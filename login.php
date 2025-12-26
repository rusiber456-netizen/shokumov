<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные
    $login = trim($_POST['login'] ?? '');
    $password = $_POST['password'] ?? '';
    
    $errors = [];
    
    // Валидация
    if (empty($login)) {
        $errors['login'] = 'Введите логин';
    }
    
    if (empty($password)) {
        $errors['password'] = 'Введите пароль';
    }
    
    if (!empty($errors)) {
        jsonResponse(false, ['errors' => $errors], 'Заполните все поля');
    }
    
    try {
        // Ищем пользователя по логину
        $stmt = $pdo->prepare("SELECT * FROM users WHERE login = ?");
        $stmt->execute([$login]);
        $user = $stmt->fetch();
        
        if (!$user) {
            jsonResponse(false, [], 'Неверный логин или пароль');
        }
        
        // Проверяем пароль
        if (!password_verify($password, $user['password'])) {
            jsonResponse(false, [], 'Неверный логин или пароль');
        }
        
        // Устанавливаем сессию
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_login'] = $user['login'];
        $_SESSION['user_fio'] = $user['fio'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        
        // Определяем куда редиректить
        $redirect = $user['role'] === 'admin' ? 'admin.html' : 'personal.html';
        
        jsonResponse(true, ['redirect' => $redirect], 'Вход выполнен успешно');
        
    } catch (PDOException $e) {
        jsonResponse(false, [], 'Ошибка при входе: ' . $e->getMessage());
    }
} else {
    jsonResponse(false, [], 'Неверный метод запроса');
}
?>