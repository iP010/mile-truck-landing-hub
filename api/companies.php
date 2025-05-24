
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        // جلب جميع الشركات
        try {
            $stmt = $pdo->query("SELECT * FROM companies ORDER BY created_at DESC");
            $companies = $stmt->fetchAll();
            jsonResponse($companies);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to fetch companies: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        // إضافة شركة جديدة
        $data = getJsonInput();
        
        if (!$data) {
            jsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        try {
            $sql = "INSERT INTO companies (
                company_name, manager_name, phone_number, whatsapp_number,
                truck_count, has_insurance, insurance_type, created_at, updated_at
            ) VALUES (
                :company_name, :manager_name, :phone_number, :whatsapp_number,
                :truck_count, :has_insurance, :insurance_type, NOW(), NOW()
            )";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'company_name' => $data['company_name'],
                'manager_name' => $data['manager_name'],
                'phone_number' => $data['phone_number'],
                'whatsapp_number' => $data['whatsapp_number'],
                'truck_count' => $data['truck_count'],
                'has_insurance' => $data['has_insurance'] ? 1 : 0,
                'insurance_type' => $data['insurance_type'] ?? null
            ]);

            jsonResponse(['message' => 'Company created successfully', 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to create company: ' . $e->getMessage()], 500);
        }
        break;

    case 'PUT':
        // تحديث شركة
        $data = getJsonInput();
        
        if (!$data || !isset($data['id'])) {
            jsonResponse(['error' => 'Company ID is required'], 400);
        }

        try {
            $sql = "UPDATE companies SET 
                company_name = :company_name,
                manager_name = :manager_name,
                phone_number = :phone_number,
                whatsapp_number = :whatsapp_number,
                truck_count = :truck_count,
                has_insurance = :has_insurance,
                insurance_type = :insurance_type,
                updated_at = NOW()
                WHERE id = :id";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $data['id'],
                'company_name' => $data['company_name'],
                'manager_name' => $data['manager_name'],
                'phone_number' => $data['phone_number'],
                'whatsapp_number' => $data['whatsapp_number'],
                'truck_count' => $data['truck_count'],
                'has_insurance' => $data['has_insurance'] ? 1 : 0,
                'insurance_type' => $data['insurance_type'] ?? null
            ]);

            jsonResponse(['message' => 'Company updated successfully']);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update company: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        // حذف شركات
        $data = getJsonInput();
        
        if (!$data || !isset($data['ids']) || !is_array($data['ids'])) {
            jsonResponse(['error' => 'Company IDs array is required'], 400);
        }

        try {
            $placeholders = str_repeat('?,', count($data['ids']) - 1) . '?';
            $sql = "DELETE FROM companies WHERE id IN ($placeholders)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($data['ids']);

            jsonResponse(['message' => 'Companies deleted successfully', 'count' => $stmt->rowCount()]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to delete companies: ' . $e->getMessage()], 500);
        }
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
?>
