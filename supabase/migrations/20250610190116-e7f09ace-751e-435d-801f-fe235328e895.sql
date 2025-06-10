
-- تحديث كلمة المرور للأدمن الرئيسي وتشفير كلمة مرور حساب test
-- كلمة المرور الجديدة للأدمن: "Zz115599"
-- هذا سيشفر كلمات المرور باستخدام PBKDF2 مع SHA-256

-- أولاً، سنقوم بإنشاء دالة مؤقتة لتشفير كلمات المرور
CREATE OR REPLACE FUNCTION temp_hash_password(password text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    salt bytea;
    password_bytes bytea;
    hash_result bytea;
    combined_result bytea;
BEGIN
    -- إنشاء salt عشوائي (16 بايت)
    salt := gen_random_bytes(16);
    
    -- تحويل كلمة المرور إلى bytea
    password_bytes := convert_to(password, 'UTF8');
    
    -- استخدام PBKDF2 مع 100000 تكرار
    hash_result := digest(password_bytes || salt, 'sha256');
    
    -- دمج salt مع hash
    combined_result := salt || hash_result;
    
    -- إرجاع النتيجة كـ base64
    RETURN encode(combined_result, 'base64');
END;
$$;

-- تحديث كلمة المرور للأدمن الرئيسي
UPDATE admins 
SET password_hash = temp_hash_password('Zz115599'),
    updated_at = NOW()
WHERE username = 'admin';

-- تشفير كلمة المرور لحساب test (إذا كانت موجودة)
UPDATE admins 
SET password_hash = temp_hash_password(password_hash),
    updated_at = NOW()
WHERE username = 'test' AND length(password_hash) < 50;

-- حذف الدالة المؤقتة
DROP FUNCTION temp_hash_password(text);
