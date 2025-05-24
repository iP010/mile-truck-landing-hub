
# دليل إعداد قاعدة البيانات مع Supabase

## الخطوات المطلوبة:

### 1. إعداد قاعدة البيانات في Supabase:
النظام يستخدم Supabase (PostgreSQL) بدلاً من MySQL لضمان التوافق مع المتصفح.

### 2. إنشاء الجداول في Supabase:
يجب إنشاء الجداول التالية في لوحة تحكم Supabase:

#### جدول admins:
```sql
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### جدول drivers:
```sql
CREATE TABLE drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_name VARCHAR(255) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  truck_brand VARCHAR(100) NOT NULL,
  truck_type VARCHAR(100) NOT NULL,
  has_insurance BOOLEAN DEFAULT FALSE,
  insurance_type VARCHAR(100),
  invitation_code VARCHAR(50),
  referral_code VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### جدول companies:
```sql
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  manager_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  truck_count INTEGER DEFAULT 0,
  has_insurance BOOLEAN DEFAULT FALSE,
  insurance_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. إضافة بيانات تجريبية:
```sql
-- إضافة مشرف تجريبي
INSERT INTO admins (username, email, password_hash) 
VALUES ('admin', 'admin@miletruck.com', 'admin123');
```

### 4. الوظائف المتاحة:
- **تسجيل دخول المشرف**: username: `admin`, password: `admin123`
- **إدارة السائقين**: عرض، تعديل، حذف
- **إدارة الشركات**: عرض، تعديل، حذف
- **تصدير البيانات**: إلى Excel/CSV

### 5. تصدير البيانات إلى phpMyAdmin:
1. استخدم ميزة التصدير في لوحة الإدارة للحصول على ملفات CSV
2. يمكنك استيراد هذه الملفات في قاعدة بيانات MySQL عبر phpMyAdmin
3. أو استخدم SQL Export من Supabase وتحويله لـ MySQL syntax

### ملاحظات مهمة:
1. Supabase متصل تلقائياً بالمشروع
2. لا حاجة لتحديث أي إعدادات اتصال
3. يمكن الوصول لإدارة قاعدة البيانات من لوحة تحكم Supabase
4. البيانات متزامنة فورياً مع التطبيق

## التصدير إلى phpMyAdmin:
بعد تجميع البيانات في Supabase، يمكنك:
1. تصدير البيانات من التطبيق كـ CSV
2. إنشاء قاعدة بيانات MySQL في phpMyAdmin
3. استيراد ملفات CSV إلى الجداول المناسبة
