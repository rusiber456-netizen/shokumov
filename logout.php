<?php
require_once 'config.php';

// Уничтожаем все данные сессии
$_SESSION = array();

// Если требуется уничтожить cookie сессии
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Уничтожаем сессию
session_destroy();

// Редирект на главную страницу
header('Location: index.html');
exit();
?>