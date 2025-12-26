<?php
require_once 'db_connect.php';

if (isset($_GET['login'])) {
    $login = trim($_GET['login']);
    
    // Проверяем валидность логина
    if (!preg_match('/^[A-Za-z0-9_]+$/', $login)) {
        echo json_encode(['available' => false, 'message' => 'Недопустимые символы в логине']);
        exit();
    }
    
    if (strlen($login) < 3) {
        echo json_encode(['available' => false, 'message' => 'Логин должен быть не менее 3 символов']);
        exit();
    }
    
    try {
        // Проверяем занят ли логин
        $stmt = $pdo->prepare("SELECT id FROM users WHERE login = ?");
        $stmt->execute([$login]);
        
        if ($stmt->fetch()) {
            echo json_encode(['available' => false, 'message' => 'Логин уже занят']);
        } else {
            echo json_encode(['available' => true, 'message' => 'Логин свободен']);
        }
    } catch (PDOException $e) {
        echo json_encode(['available' => false, 'message' => 'Ошибка проверки']);
    }
} else {
    echo json_encode(['available' => false, 'message' => 'Не указан логин']);
}
?>