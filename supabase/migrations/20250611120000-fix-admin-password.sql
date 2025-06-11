
-- تحديث كلمة المرور للأدمن الرئيسي إلى نص خام مؤقت
-- سيقوم التطبيق بتشفيرها عند أول تسجيل دخول

-- التأكد من وجود الأدمن الرئيسي مع كلمة المرور الصحيحة
UPDATE admins 
SET password_hash = 'Zz115599',
    updated_at = NOW()
WHERE username = 'admin';

-- إذا لم يكن موجوداً، إنشاؤه
INSERT INTO admins (username, email, password_hash, role)
SELECT 'admin', 'admin@example.com', 'Zz115599', 'super_admin'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

-- التأكد من تمكين RLS وإضافة السياسات المناسبة
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة إذا كانت تسبب مشاكل
DROP POLICY IF EXISTS "Allow admin authentication" ON public.admins;
DROP POLICY IF EXISTS "Allow admin self update" ON public.admins;
DROP POLICY IF EXISTS "Allow admin insert" ON public.admins;

-- إضافة سياسات بسيطة وفعالة
CREATE POLICY "Enable read access for authentication" 
ON public.admins FOR SELECT 
USING (true);

CREATE POLICY "Enable update for authenticated admins" 
ON public.admins FOR UPDATE 
USING (true);

CREATE POLICY "Enable insert for system" 
ON public.admins FOR INSERT 
WITH CHECK (true);

-- التأكد من تنظيف الجلسات المنتهية الصلاحية
DELETE FROM admin_sessions WHERE expires_at < NOW();

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
