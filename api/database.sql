
-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS miletruck_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE miletruck_db;

-- جدول السائقين
CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    driver_name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    truck_brand VARCHAR(100) NOT NULL,
    truck_type VARCHAR(100) NOT NULL,
    has_insurance BOOLEAN NOT NULL DEFAULT FALSE,
    insurance_type VARCHAR(100) NULL,
    invitation_code VARCHAR(50) NULL,
    referral_code VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول الشركات
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_name VARCHAR(255) NOT NULL,
    manager_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    truck_count INT NOT NULL DEFAULT 0,
    has_insurance BOOLEAN NOT NULL DEFAULT FALSE,
    insurance_type VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول الأدمن
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- إدراج أدمن افتراضي
INSERT INTO admins (username, email, password_hash) 
VALUES ('admin', 'admin@miletruck.com', 'admin123')
ON DUPLICATE KEY UPDATE username = username;
