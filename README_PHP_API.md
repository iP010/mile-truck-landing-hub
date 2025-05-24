
# إعداد PHP API للتطبيق

## الملفات المطلوبة

1. **api/config.php** - إعدادات قاعدة البيانات
2. **api/drivers.php** - API للسائقين
3. **api/companies.php** - API للشركات
4. **api/auth.php** - API للمصادقة
5. **api/database.sql** - هيكل قاعدة البيانات

## خطوات التثبيت

### 1. إنشاء قاعدة البيانات
- ادخل إلى phpMyAdmin
- أنشئ قاعدة بيانات جديدة باسم `miletruck_db`
- استورد ملف `api/database.sql`

### 2. تحديث إعدادات قاعدة البيانات
في ملف `api/config.php`:
```php
define('DB_HOST', 'localhost');        // خادم قاعدة البيانات
define('DB_NAME', 'miletruck_db');     // اسم قاعدة البيانات
define('DB_USER', 'your_username');    // اسم المستخدم
define('DB_PASS', 'your_password');    // كلمة المرور
```

### 3. رفع الملفات
- أنشئ مجلد `api` في المجلد الرئيسي لموقعك
- ارفع جميع ملفات PHP إلى مجلد `api`

### 4. تحديث التطبيق
في ملف `src/api/database.ts`:
```typescript
const API_BASE_URL = 'https://yourdomain.com/api';
```
غيّر `yourdomain.com` إلى نطاق موقعك الفعلي.

### 5. اختبار API
- يمكنك اختبار API من خلال:
  - `GET https://yourdomain.com/api/drivers.php` - جلب السائقين
  - `GET https://yourdomain.com/api/companies.php` - جلب الشركات

## بيانات الدخول الافتراضية
- **اسم المستخدم**: admin
- **كلمة المرور**: admin123

## ملاحظات أمنية
- تأكد من تفعيل HTTPS على موقعك
- قم بتحديث كلمة مرور الأدمن في قاعدة البيانات
- تأكد من حماية مجلد API من الوصول المباشر إذا لزم الأمر
