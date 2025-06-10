
-- إضافة نوع البيانات للصلاحيات
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin');

-- إضافة حقل الصلاحيات للأدمن
ALTER TABLE admins ADD COLUMN role admin_role DEFAULT 'admin';

-- تحديث الأدمن الموجود ليكون super_admin
UPDATE admins SET role = 'super_admin' WHERE username = 'admin';

-- إنشاء جدول الجلسات مع النوع الصحيح للمعرف
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- إنشاء دالة لحذف الجلسات المنتهية
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
