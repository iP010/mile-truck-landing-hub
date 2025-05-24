
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'POST':
        $data = getJsonInput();
        
        if (!$data || !isset($data['action'])) {
            jsonResponse(['error' => 'Action is required'], 400);
        }

        if ($data['action'] === 'login') {
            // تسجيل دخول
            if (!isset($data['username']) || !isset($data['password'])) {
                jsonResponse(['error' => 'Username and password are required'], 400);
            }

            try {
                $stmt = $pdo->prepare("SELECT id, username, email, password_hash FROM admins WHERE username = ?");
                $stmt->execute([$data['username']]);
                $admin = $stmt->fetch();

                if ($admin && $admin['password_hash'] === $data['password']) {
                    // في التطبيق الحقيقي، استخدم password_verify() مع password_hash()
                    jsonResponse([
                        'success' => true,
                        'admin' => [
                            'id' => $admin['id'],
                            'username' => $admin['username'],
                            'email' => $admin['email']
                        ]
                    ]);
                } else {
                    jsonResponse(['error' => 'Invalid credentials'], 401);
                }
            } catch (PDOException $e) {
                jsonResponse(['error' => 'Login failed: ' . $e->getMessage()], 500);
            }
        }
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
?>
