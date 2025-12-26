<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем и очищаем данные
    $fio = trim($_POST['fio'] ?? '');
    $login = trim($_POST['login'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $password_confirm = $_POST['password_confirm'] ?? '';
    
    $errors = [];
    
    // Проверка ФИО (только кириллица, пробелы, дефис)
    if (empty($fio)) {
        $errors['fio'] = 'ФИО обязательно для заполнения';
    } elseif (!preg_match('/^[А-Яа-яЁё\s\-]+$/u', $fio)) {
        $errors['fio'] = 'ФИО должно содержать только кириллические буквы, пробелы и дефис';
    }
    
    // Проверка логина (только латиница)
    if (empty($login)) {
        $errors['login'] = 'Логин обязателен для заполнения';
    } elseif (!preg_match('/^[A-Za-z0-9_]+$/', $login)) {
        $errors['login'] = 'Логин должен содержать только латинские буквы, цифры и нижнее подчеркивание';
    } elseif (strlen($login) < 3) {
        $errors['login'] = 'Логин должен быть не менее 3 символов';
    } else {
        // Проверка уникальности логина
        $stmt = $pdo->prepare("SELECT id FROM users WHERE login = ?");
        $stmt->execute([$login]);
        if ($stmt->fetch()) {
            $errors['login'] = 'Этот логин уже занят';
        }
    }
    
    // Проверка email
    if (empty($email)) {
        $errors['email'] = 'Email обязателен для заполнения';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Некорректный email адрес';
    } else {
        // Проверка уникальности email
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors['email'] = 'Этот email уже используется';
        }
    }
    
    // Проверка пароля
    if (empty($password)) {
        $errors['password'] = 'Пароль обязателен для заполнения';
    } elseif (strlen($password) < 6) {
        $errors['password'] = 'Пароль должен быть не менее 6 символов';
    }
    
    // Проверка подтверждения пароля
    if (empty($password_confirm)) {
        $errors['password_confirm'] = 'Подтвердите пароль';
    } elseif ($password !== $password_confirm) {
        $errors['password_confirm'] = 'Пароли не совпадают';
    }
    
    // Проверка согласия
    if (!isset($_POST['agree'])) {
        $errors['agree'] = 'Необходимо согласие на обработку персональных данных';
    }
    
    // Если есть ошибки, возвращаем их
    if (!empty($errors)) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'errors' => $errors
        ]);
        exit();
    }
    
    try {
        // Хешируем пароль
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Вставляем пользователя в базу данных
        $stmt = $pdo->prepare("INSERT INTO users (fio, login, email, password, role) VALUES (?, ?, ?, ?, 'user')");
        $stmt->execute([$fio, $login, $email, $hashed_password]);
        
        // Получаем ID нового пользователя
        $user_id = $pdo->lastInsertId();
        
        // Устанавливаем сессию
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_login'] = $login;
        $_SESSION['user_fio'] = $fio;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_role'] = 'user';
        
        // Отправляем успешный ответ
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Регистрация прошла успешно!',
            'redirect' => 'personal.html'
        ]);
        
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка при регистрации: ' . $e->getMessage()
        ]);
    }
} else {
    // Если запрос не POST, возвращаем ошибку
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Неверный метод запроса'
    ]);
}
?>