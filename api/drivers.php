
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        // جلب جميع السائقين
        try {
            $stmt = $pdo->query("SELECT * FROM drivers ORDER BY created_at DESC");
            $drivers = $stmt->fetchAll();
            jsonResponse($drivers);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to fetch drivers: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        // إضافة سائق جديد
        $data = getJsonInput();
        
        if (!$data) {
            jsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        try {
            $sql = "INSERT INTO drivers (
                driver_name, nationality, phone_number, whatsapp_number, 
                truck_brand, truck_type, has_insurance, insurance_type, 
                invitation_code, referral_code, created_at, updated_at
            ) VALUES (
                :driver_name, :nationality, :phone_number, :whatsapp_number,
                :truck_brand, :truck_type, :has_insurance, :insurance_type,
                :invitation_code, :referral_code, NOW(), NOW()
            )";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'driver_name' => $data['driver_name'],
                'nationality' => $data['nationality'],
                'phone_number' => $data['phone_number'],
                'whatsapp_number' => $data['whatsapp_number'],
                'truck_brand' => $data['truck_brand'],
                'truck_type' => $data['truck_type'],
                'has_insurance' => $data['has_insurance'] ? 1 : 0,
                'insurance_type' => $data['insurance_type'] ?? null,
                'invitation_code' => $data['invitation_code'] ?? null,
                'referral_code' => $data['referral_code'] ?? null
            ]);

            jsonResponse(['message' => 'Driver created successfully', 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to create driver: ' . $e->getMessage()], 500);
        }
        break;

    case 'PUT':
        // تحديث سائق
        $data = getJsonInput();
        
        if (!$data || !isset($data['id'])) {
            jsonResponse(['error' => 'Driver ID is required'], 400);
        }

        try {
            $sql = "UPDATE drivers SET 
                driver_name = :driver_name,
                nationality = :nationality,
                phone_number = :phone_number,
                whatsapp_number = :whatsapp_number,
                truck_brand = :truck_brand,
                truck_type = :truck_type,
                has_insurance = :has_insurance,
                insurance_type = :insurance_type,
                invitation_code = :invitation_code,
                updated_at = NOW()
                WHERE id = :id";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $data['id'],
                'driver_name' => $data['driver_name'],
                'nationality' => $data['nationality'],
                'phone_number' => $data['phone_number'],
                'whatsapp_number' => $data['whatsapp_number'],
                'truck_brand' => $data['truck_brand'],
                'truck_type' => $data['truck_type'],
                'has_insurance' => $data['has_insurance'] ? 1 : 0,
                'insurance_type' => $data['insurance_type'] ?? null,
                'invitation_code' => $data['invitation_code'] ?? null
            ]);

            jsonResponse(['message' => 'Driver updated successfully']);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update driver: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        // حذف سائقين
        $data = getJsonInput();
        
        if (!$data || !isset($data['ids']) || !is_array($data['ids'])) {
            jsonResponse(['error' => 'Driver IDs array is required'], 400);
        }

        try {
            $placeholders = str_repeat('?,', count($data['ids']) - 1) . '?';
            $sql = "DELETE FROM drivers WHERE id IN ($placeholders)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($data['ids']);

            jsonResponse(['message' => 'Drivers deleted successfully', 'count' => $stmt->rowCount()]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to delete drivers: ' . $e->getMessage()], 500);
        }
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
?>
