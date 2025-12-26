<?php
// Настройки базы данных
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Обычно root для локального сервера
define('DB_PASS', ''); // Пароль (пустой для XAMPP)
define('DB_NAME', 'publishing_house');

// Настройки сессии
session_start();

// Базовый URL сайта
$base_url = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']);
$base_url = rtrim($base_url, '/') . '/';

// Функция для редиректа
function redirect($url) {
    header('Location: ' . $url);
    exit();
}

// Функция для проверки авторизации
function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        redirect('login.html');
    }
}

// Функция для проверки прав администратора
function checkAdmin() {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
        redirect('index.html');
    }
}

// Функция для безопасного вывода данных
function escape($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Функция для генерации ответа JSON
function jsonResponse($success, $data = [], $message = '') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}
?>