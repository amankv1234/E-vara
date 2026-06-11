-- E-VARA Queue Hardening & GDPR Fixes

-- 1. FIX GDPR DELETION (ON DELETE CASCADE)
ALTER TABLE public.osint_jobs DROP CONSTRAINT IF EXISTS osint_jobs_user_id_fkey;
ALTER TABLE public.osint_jobs ADD CONSTRAINT osint_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. DEDUPLICATION (Prevent queue flooding)
CREATE UNIQUE INDEX idx_unique_pending_jobs ON public.osint_jobs (identity_hash) WHERE status = 'pending';

-- 3. WORKSPACE ISOLATION (Add workspace_id to jobs and breaches)
ALTER TABLE public.osint_jobs ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;
ALTER TABLE public.identity_breaches ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- 4. WORKER LEASE LOCKING (For concurrency safety)
ALTER TABLE public.osint_jobs ADD COLUMN locked_by TEXT;
ALTER TABLE public.osint_jobs ADD COLUMN locked_at TIMESTAMP WITH TIME ZONE;

