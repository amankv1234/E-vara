-- 1. Create Identity monitoring table
CREATE TABLE public.monitored_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    identity_type TEXT NOT NULL CHECK (identity_type IN ('email', 'username', 'phone', 'domain')),
    identity_value_encrypted TEXT NOT NULL, -- AES-256 encrypted
    identity_hash TEXT NOT NULL, -- SHA-256 for lookup
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_scanned_at TIMESTAMP WITH TIME ZONE
);

-- 2. Create Threat Findings table
CREATE TABLE public.threat_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    identity_id UUID REFERENCES public.monitored_identities ON DELETE CASCADE,
    source TEXT NOT NULL, -- e.g., 'dark_web', 'github_leak'
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    data_payload JSONB, -- Raw breach info
    resolved BOOLEAN DEFAULT FALSE,
    found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX idx_identities_user ON public.monitored_identities(user_id);
CREATE INDEX idx_findings_user_severity ON public.threat_findings(user_id, severity);
CREATE INDEX idx_identities_hash ON public.monitored_identities(identity_hash);

-- 4. RLS Policies
ALTER TABLE public.monitored_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_findings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own identities" ON public.monitored_identities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own findings" ON public.threat_findings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert findings" ON public.threat_findings
    FOR INSERT WITH CHECK (true); -- Restricted to service_role in Edge Function
