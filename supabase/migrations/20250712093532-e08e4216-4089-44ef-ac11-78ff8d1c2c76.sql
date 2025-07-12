-- إنشاء admin افتراضي للاختبار
INSERT INTO public.admins (id, username, email, password_hash, role) 
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@miletruck.com',
  'admin123',
  'super_admin'
) ON CONFLICT (username) DO NOTHING;