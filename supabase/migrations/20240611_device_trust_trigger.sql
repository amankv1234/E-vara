-- Week 2: Auth Trigger for Device Trust Logging

CREATE OR REPLACE FUNCTION public.log_identity_event()
RETURNS trigger AS $$
BEGIN
  -- Insert into identity events on login or user creation
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.identity_events (user_id, event_type, metadata)
    VALUES (NEW.id, 'login', jsonb_build_object('source', 'auth_trigger'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: We only attach this to auth.users for demo purposes. 
-- In a real scenario, you'd track Supabase auth.audit_log_entries or similar.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.log_identity_event();

