
-- إنشاء قاعدة البيانات
-- يمكنك تشغيل هذا الكود في phpMyAdmin

-- إنشاء جدول المشرفين
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- إنشاء جدول السائقين
CREATE TABLE IF NOT EXISTS drivers (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  driver_name VARCHAR(100) NOT NULL,
  nationality VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  truck_brand VARCHAR(50) NOT NULL,
  truck_type VARCHAR(50) NOT NULL,
  has_insurance BOOLEAN DEFAULT FALSE,
  insurance_type VARCHAR(100) NULL,
  invitation_code VARCHAR(50) NULL,
  referral_code VARCHAR(8) DEFAULT (SUBSTRING(MD5(RAND()), 1, 8)),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- إنشاء جدول الشركات
CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_name VARCHAR(100) NOT NULL,
  manager_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  truck_count INT NOT NULL,
  has_insurance BOOLEAN DEFAULT FALSE,
  insurance_type VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- إدخال مشرف تجريبي
INSERT INTO admins (username, email, password_hash) 
VALUES ('admin', 'admin@miletruck.com', 'admin123')
ON DUPLICATE KEY UPDATE username = username;

-- إدخال بيانات تجريبية للسائقين
INSERT INTO drivers (driver_name, nationality, phone_number, whatsapp_number, truck_brand, truck_type, has_insurance, insurance_type) VALUES
('أحمد محمد', 'سعودي', '+966501234567', '+966501234567', 'مرسيدس', 'شاحنة ثقيلة', TRUE, 'تأمين شامل'),
('محمد علي', 'مصري', '+966509876543', '+966509876543', 'فولفو', 'شاحنة متوسطة', FALSE, NULL),
('خالد أحمد', 'أردني', '+966512345678', '+966512345678', 'سكانيا', 'شاحنة ثقيلة', TRUE, 'تأمين ضد الغير')
ON DUPLICATE KEY UPDATE driver_name = driver_name;

-- إدخال بيانات تجريبية للشركات
INSERT INTO companies (company_name, manager_name, phone_number, whatsapp_number, truck_count, has_insurance, insurance_type) VALUES
('شركة النقل السريع', 'محمد السعيد', '+966555123456', '+966555123456', 15, TRUE, 'تأمين شامل'),
('مؤسسة الخليج للنقل', 'أحمد الخليفي', '+966556789012', '+966556789012', 8, TRUE, 'تأمين ضد الغير'),
('شركة الشحن المتطور', 'سعد المالكي', '+966557890123', '+966557890123', 12, FALSE, NULL)
ON DUPLICATE KEY UPDATE company_name = company_name;
