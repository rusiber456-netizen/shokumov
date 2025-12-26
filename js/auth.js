document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const login = document.getElementById('login').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Сброс предыдущих ошибок
            document.querySelectorAll('.error-text').forEach(el => {
                el.textContent = '';
            });
            
            if (!login) {
                showFieldError('login', 'Введите логин');
                return;
            }
            
            if (!password) {
                showFieldError('password', 'Введите пароль');
                return;
            }
            
            // Проверка на стороне клиента (заглушка)
            // В реальном проекте здесь будет AJAX-запрос к серверу
            
            // Тестовые данные
            const testUsers = {
                'admin': { password: 'admin', role: 'admin', name: 'Администратор' },
                'shamil': { password: '123456', role: 'user', name: 'Шокумов Шамиль' }
            };
            
            if (testUsers[login] && testUsers[login].password === password) {
                // Сохраняем данные в localStorage (в реальном проекте - PHP сессии)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userLogin', login);
                localStorage.setItem('userRole', testUsers[login].role);
                localStorage.setItem('userName', testUsers[login].name);
                
                // Показываем сообщение об успехе
                if (errorMessage) {
                    errorMessage.textContent = 'Вход выполнен успешно!';
                    errorMessage.style.backgroundColor = '#27ae60';
                    errorMessage.style.display = 'block';
                    
                    // Редирект через 1 секунду
                    setTimeout(() => {
                        if (testUsers[login].role === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'personal.html';
                        }
                    }, 1000);
                }
            } else {
                // Показываем ошибку
                if (errorMessage) {
                    errorMessage.textContent = 'Неверный логин или пароль';
                    errorMessage.style.backgroundColor = '#e74c3c';
                    errorMessage.style.display = 'block';
                    
                    // Анимация ошибки
                    errorMessage.style.animation = 'none';
                    setTimeout(() => {
                        errorMessage.style.animation = 'shake 0.5s ease-in-out';
                    }, 10);
                }
                
                // Встряска полей ввода
                ['login', 'password'].forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    field.style.borderColor = '#e74c3c';
                    setTimeout(() => {
                        field.style.borderColor = '#ddd';
                    }, 500);
                });
            }
        });
        
        // Сброс ошибок при вводе
        ['login', 'password'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('input', function() {
                clearFieldError(fieldId);
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            });
        });
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorText = field.nextElementSibling;
        
        if (field && errorText && errorText.classList.contains('error-text')) {
            field.style.borderColor = '#e74c3c';
            errorText.textContent = message;
            errorText.style.display = 'block';
            
            // Фокус на поле с ошибкой
            field.focus();
        }
    }
    
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorText = field.nextElementSibling;
        
        if (field && errorText && errorText.classList.contains('error-text')) {
            field.style.borderColor = '#ddd';
            errorText.textContent = '';
            errorText.style.display = 'none';
        }
    }
});