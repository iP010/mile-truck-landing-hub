
-- Add proper RLS policies for admin tables and improve security

-- First, enable RLS on all admin tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current admin ID from session
CREATE OR REPLACE FUNCTION public.get_current_admin_id()
RETURNS UUID AS $$
DECLARE
  session_id TEXT;
  admin_id UUID;
BEGIN
  -- Get session ID from request headers or context
  session_id := current_setting('request.jwt.claims', true)::json->>'session_id';
  
  -- If no session in JWT, try to get from a custom header
  IF session_id IS NULL THEN
    session_id := current_setting('app.current_session_id', true);
  END IF;
  
  -- Get admin_id from valid session
  SELECT s.admin_id INTO admin_id
  FROM public.admin_sessions s
  WHERE s.id::text = session_id 
    AND s.expires_at > NOW();
    
  RETURN admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_current_admin_id() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for admins table
CREATE POLICY "Admins can view own record" ON public.admins
  FOR SELECT USING (id = public.get_current_admin_id());

CREATE POLICY "Admins can update own record" ON public.admins
  FOR UPDATE USING (id = public.get_current_admin_id());

-- Super admins can view all admins
CREATE POLICY "Super admins can view all admins" ON public.admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.id = public.get_current_admin_id() 
        AND a.role = 'super_admin'
    )
  );

-- RLS Policies for admin_sessions table
CREATE POLICY "Admins can view own sessions" ON public.admin_sessions
  FOR SELECT USING (admin_id = public.get_current_admin_id());

CREATE POLICY "Admins can delete own sessions" ON public.admin_sessions
  FOR DELETE USING (admin_id = public.get_current_admin_id());

CREATE POLICY "System can insert sessions" ON public.admin_sessions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for drivers table - only admins can access
CREATE POLICY "Admins can view drivers" ON public.drivers
  FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can insert drivers" ON public.drivers
  FOR INSERT WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update drivers" ON public.drivers
  FOR UPDATE USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete drivers" ON public.drivers
  FOR DELETE USING (public.is_current_user_admin());

-- RLS Policies for companies table - only admins can access
CREATE POLICY "Admins can view companies" ON public.companies
  FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can insert companies" ON public.companies
  FOR INSERT WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update companies" ON public.companies
  FOR UPDATE USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete companies" ON public.companies
  FOR DELETE USING (public.is_current_user_admin());

-- Update session cleanup function to be more aggressive
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to cleanup sessions for deleted admins
CREATE OR REPLACE FUNCTION cleanup_orphaned_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions 
  WHERE admin_id NOT IN (SELECT id FROM admins);
END;
$$ LANGUAGE plpgsql;

-- Add index for better performance on session lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_lookup ON admin_sessions(admin_id, expires_at);
