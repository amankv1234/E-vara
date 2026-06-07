-- E-VARA IDENTITY DEFENSE OS
-- DATABASE SCHEMA V2.0 (Deep-Core Hardened)

-- 1. Identity Monitoring Table
CREATE TABLE monitored_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    identity_type TEXT NOT NULL, 
    identity_value_encrypted TEXT NOT NULL, 
    identity_hash TEXT UNIQUE NOT NULL, -- SHA-256 enforced
    risk_score INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_scanned_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Breach History Table
CREATE TABLE identity_breaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identity_id UUID REFERENCES monitored_identities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id), -- Redundant but required for efficient RLS
    source_name TEXT NOT NULL,
    leak_date DATE,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    data_types TEXT[],
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Security Events (Audit Logs)
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Secure User Profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT DEFAULT 'tactical' CHECK (tier IN ('tactical', 'executive', 'omni')),
    node_id_stable TEXT UNIQUE NOT NULL,
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- HARDENED RLS POLICIES (No more "Hollow Vault")
ALTER TABLE monitored_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Monitored Identities
CREATE POLICY "Identity_Owner_Only" ON monitored_identities 
FOR ALL USING (auth.uid() = user_id);

-- Identity Breaches (Fixed SELECT policy + ownership chain)
CREATE POLICY "Breach_Owner_Only" ON identity_breaches 
FOR SELECT USING (auth.uid() = user_id);

-- Profiles
CREATE POLICY "Profile_Owner_Only" ON user_profiles 
FOR SELECT USING (auth.uid() = id);

-- Audit Logs
CREATE POLICY "Logs_Owner_Only" ON security_audit_logs 
FOR SELECT USING (auth.uid() = user_id);


-- DATABASE INTEGRITY ENFORCEMENT
-- Moving hashing verification to DB level to prevent "Client-Side Trust" fraud.

CREATE OR REPLACE FUNCTION validate_identity_hash()
RETURNS TRIGGER AS $$
BEGIN
    -- Enforce SHA-256 format (64 hex characters)
    IF NEW.identity_hash !~ '^[a-f0-9]{64}$' THEN
        RAISE EXCEPTION 'Cryptographic Integrity Violation: identity_hash must be a valid SHA-256 hex string.';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_enforce_hashing_integrity
BEFORE INSERT OR UPDATE ON monitored_identities
FOR EACH ROW EXECUTE PROCEDURE validate_identity_hash();


-- DETERMINISTIC NODE ID GENERATION (Hardened against collisions)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, node_id_stable)
    VALUES (
        NEW.id, 
        'NODE-' || upper(encode(digest(NEW.id::text || 'E-VARA-SALT', 'sha256'), 'hex')) -- Robust hashed ID
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
