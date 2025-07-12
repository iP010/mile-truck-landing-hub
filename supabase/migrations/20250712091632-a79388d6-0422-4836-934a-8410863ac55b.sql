-- Update the get_current_admin_id function to use the custom header
CREATE OR REPLACE FUNCTION public.get_current_admin_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
DECLARE
  session_id UUID;
  admin_id UUID;
BEGIN
  -- الحصول على session_id من الرأس المخصص
  session_id := NULLIF(current_setting('request.headers', true)::json->>'x-admin-session-id', '')::UUID;

  IF session_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- استخراج admin_id في حال عدم إنتهاء الجلسة
  SELECT admin_sessions.admin_id INTO admin_id
  FROM public.admin_sessions
  WHERE id = session_id AND expires_at > NOW();

  RETURN admin_id;
END;
$function$