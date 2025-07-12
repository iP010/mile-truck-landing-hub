-- إزالة جميع policies القديمة وإنشاء جديدة للـ admin_sessions
DROP POLICY IF EXISTS "System can insert sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "admin_own_session" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow session creation for login" ON public.admin_sessions;

-- إنشاء policies جديدة مبسطة
CREATE POLICY "Allow public session management" 
ON public.admin_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);