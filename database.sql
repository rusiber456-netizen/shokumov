-- Создание базы данных
CREATE DATABASE IF NOT EXISTS publishing_house CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE publishing_house;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fio VARCHAR(100) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица категорий заявок
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица заявок
CREATE TABLE IF NOT EXISTS requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INT,
    status ENUM('Новая', 'Решена', 'Отклонена') DEFAULT 'Новая',
    reject_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица новостей
CREATE TABLE IF NOT EXISTS news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица счетчика посетителей
CREATE TABLE IF NOT EXISTS visitor_counter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE UNIQUE NOT NULL,
    count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Вставка начальных данных

-- Создание администратора (логин: admin, пароль: admin)
INSERT INTO users (fio, login, email, password, role) VALUES 
('Администратор', 'admin', 'admin@litera-house.ru', '$2y$10$i5B5e6D8fG2hJ3kL4mN5oP7qR9sT1uV3wX5yZ7A9bC0dE2fG4hJ6kL8mN0pQ', 'admin');

-- Категории заявок
INSERT INTO categories (name) VALUES 
('Редактура'),
('Дизайн обложки'),
('Вёрстка'),
('Печать'),
('Продвижение')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Пример новостей
INSERT INTO news (title, content, category, image_url) VALUES
('Открытие нового филиала', 'Мы рады сообщить об открытии филиала в Москве! Теперь наши услуги доступны в столице.', 'Анонс', 'images/news1.jpg'),
('Литературный конкурс 2024', 'Принимаем заявки на участие в ежегодном литературном конкурсе. Главный приз - публикация книги за наш счет!', 'Конкурс', 'images/news2.jpg'),
('Новая серия книг', 'Представляем серию "Современная проза". Мы ищем талантливых авторов для сотрудничества.', 'Новинка', 'images/news3.jpg'),
('Встреча с авторами', 'Приглашаем на встречу с известными писателями 25 декабря в нашем центральном офисе.', 'Мероприятие', 'images/news4.jpg')
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    content = VALUES(content),
    category = VALUES(category),
    image_url = VALUES(image_url);

-- Пример заявок (для тестирования)
INSERT INTO requests (user_id, title, description, category_id, status) VALUES
(1, 'Тестовая заявка 1', 'Описание тестовой заявки 1', 1, 'Новая'),
(1, 'Тестовая заявка 2', 'Описание тестовой заявки 2', 2, 'Решена'),
(1, 'Тестовая заявка 3', 'Описание тестовой заявки 3', 3, 'Отклонена');

-- Инициализация счетчика посетителей
INSERT INTO visitor_counter (date, count) VALUES (CURDATE(), 157)
ON DUPLICATE KEY UPDATE count = VALUES(count);

-- Создание представлений для удобства

-- Представление для заявок с именами пользователей
CREATE OR REPLACE VIEW requests_view AS
SELECT 
    r.*,
    u.fio as user_name,
    u.login as user_login,
    u.email as user_email,
    c.name as category_name
FROM requests r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN categories c ON r.category_id = c.id;

-- Представление для статистики
CREATE OR REPLACE VIEW stats_view AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
    (SELECT COUNT(*) FROM requests WHERE status = 'Новая') as new_requests,
    (SELECT COUNT(*) FROM requests WHERE status = 'Решена') as solved_requests,
    (SELECT COUNT(*) FROM requests WHERE status = 'Отклонена') as rejected_requests,
    (SELECT COUNT(*) FROM requests) as total_requests;

-- Создание пользователя для приложения (если нужно)
-- CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON publishing_house.* TO 'app_user'@'localhost';
-- FLUSH PRIVILEGES;