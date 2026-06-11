-- E-VARA Enterprise Ascension Migration

-- 1. QUEUE SYSTEM (P0)
CREATE TABLE public.osint_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    identity_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    attempts INT DEFAULT 0,
    next_run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_osint_jobs_status ON public.osint_jobs(status, next_run_at);

ALTER TABLE public.osint_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own jobs" ON public.osint_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage jobs" ON public.osint_jobs USING (true);

-- 2. DISTRIBUTED RATE LIMITING (P0)
CREATE TABLE public.api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    endpoint TEXT NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    request_count INT DEFAULT 1,
    UNIQUE(user_id, endpoint, window_start)
);

CREATE INDEX idx_rate_limits ON public.api_rate_limits(user_id, endpoint, window_start);

-- Function to increment rate limit and return if allowed
CREATE OR REPLACE FUNCTION check_rate_limit(p_user_id UUID, p_endpoint TEXT, p_max_requests INT, p_window_minutes INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS \$\$
DECLARE
    v_window_start TIMESTAMP WITH TIME ZONE;
    v_current_count INT;
BEGIN
    -- Truncate to the current window
    v_window_start := date_trunc('minute', NOW()) - (EXTRACT(MINUTE FROM NOW())::int % p_window_minutes) * interval '1 minute';
    
    INSERT INTO public.api_rate_limits (user_id, endpoint, window_start, request_count)
    VALUES (p_user_id, p_endpoint, v_window_start, 1)
    ON CONFLICT (user_id, endpoint, window_start)
    DO UPDATE SET request_count = public.api_rate_limits.request_count + 1
    RETURNING request_count INTO v_current_count;

    IF v_current_count > p_max_requests THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
\$\$;

-- 3. TEAM WORKSPACES (P1)
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tier TEXT DEFAULT 'tactical',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.workspace_members (
    workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

