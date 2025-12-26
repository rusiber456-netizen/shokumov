document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    // Список занятых логинов (в реальном проекте будет проверка через AJAX)
    const takenLogins = ['admin', 'shamil', 'test', 'user'];
    
    // Валидация ФИО (кириллица, пробелы, дефис)
    const fioInput = document.getElementById('fio');
    if (fioInput) {
        fioInput.addEventListener('blur', validateFIO);
        fioInput.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    // Валидация логина (латиница + проверка уникальности)
    const loginInput = document.getElementById('login');
    const loginCheck = document.getElementById('login-check');
    let loginTimeout;
    
    if (loginInput) {
        loginInput.addEventListener('blur', validateLogin);
        loginInput.addEventListener('input', function() {
            clearError(this);
            
            // Очищаем предыдущий таймер
            clearTimeout(loginTimeout);
            
            // Если поле не пустое, запускаем проверку через 500мс
            if (this.value.trim().length >= 3) {
                loginTimeout = setTimeout(checkLoginAvailability, 500);
            } else {
                if (loginCheck) loginCheck.innerHTML = '';
            }
        });
    }
    
    // Валидация email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    // Валидация паролей
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('password_confirm');
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', function() {
            clearError(this);
            // Если есть текст в поле подтверждения, проверяем совпадение
            if (confirmInput && confirmInput.value) {
                validatePasswordConfirm();
            }
        });
    }
    
    if (confirmInput) {
        confirmInput.addEventListener('blur', validatePasswordConfirm);
        confirmInput.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    // Отправка формы
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбрасываем сообщения
            if (errorMessage) errorMessage.style.display = 'none';
            if (successMessage) successMessage.style.display = 'none';
            
            // Валидируем все поля
            const isValid = validateAllFields();
            
            if (isValid) {
                // Собираем данные формы
                const formData = {
                    fio: fioInput.value.trim(),
                    login: loginInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    agree: document.getElementById('agree').checked
                };
                
                // В реальном проекте здесь будет AJAX-запрос к register.php
                
                // Симуляция успешной регистрации
                simulateRegistration(formData);
            }
        });
    }
    
    // Функции валидации
    function validateFIO() {
        const value = fioInput.value.trim();
        const errorText = fioInput.nextElementSibling;
        
        if (!value) {
            showError(fioInput, 'ФИО обязательно для заполнения');
            return false;
        }
        
        if (!/^[А-Яа-яЁё\s\-]+$/.test(value)) {
            showError(fioInput, 'Только кириллические буквы, пробелы и дефис');
            return false;
        }
        
        if (value.split(/\s+/).length < 2) {
            showError(fioInput, 'Введите фамилию, имя и отчество');
            return false;
        }
        
        clearError(fioInput);
        return true;
    }
    
    function validateLogin() {
        const value = loginInput.value.trim();
        const errorText = loginInput.nextElementSibling;
        
        if (!value) {
            showError(loginInput, 'Логин обязателен для заполнения');
            return false;
        }
        
        if (!/^[A-Za-z0-9]+$/.test(value)) {
            showError(loginInput, 'Только латинские буквы и цифры');
            return false;
        }
        
        if (value.length < 3) {
            showError(loginInput, 'Логин должен быть не менее 3 символов');
            return false;
        }
        
        // Проверка на занятость логина
        if (takenLogins.includes(value.toLowerCase())) {
            showError(loginInput, 'Этот логин уже занят');
            return false;
        }
        
        clearError(loginInput);
        return true;
    }
    
    function checkLoginAvailability() {
        const value = loginInput.value.trim();
        
        if (value.length < 3) return;
        
        // Симуляция AJAX-запроса
        if (loginCheck) {
            loginCheck.innerHTML = '<span style="color: #3498db;">Проверка доступности...</span>';
            
            setTimeout(() => {
                if (takenLogins.includes(value.toLowerCase())) {
                    loginCheck.innerHTML = '<span style="color: #e74c3c;">✗ Логин занят</span>';
                } else {
                    loginCheck.innerHTML = '<span style="color: #27ae60;">✓ Логин свободен</span>';
                }
            }, 500);
        }
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        const errorText = emailInput.nextElementSibling;
        
        if (!value) {
            showError(emailInput, 'Email обязателен для заполнения');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(emailInput, 'Введите корректный email адрес');
            return false;
        }
        
        clearError(emailInput);
        return true;
    }
    
    function validatePassword() {
        const value = passwordInput.value;
        const errorText = passwordInput.nextElementSibling;
        
        if (!value) {
            showError(passwordInput, 'Пароль обязателен для заполнения');
            return false;
        }
        
        if (value.length < 6) {
            showError(passwordInput, 'Пароль должен быть не менее 6 символов');
            return false;
        }
        
        clearError(passwordInput);
        return true;
    }
    
    function validatePasswordConfirm() {
        const value = confirmInput.value;
        const errorText = confirmInput.nextElementSibling;
        
        if (!value) {
            showError(confirmInput, 'Повторите пароль');
            return false;
        }
        
        if (value !== passwordInput.value) {
            showError(confirmInput, 'Пароли не совпадают');
            return false;
        }
        
        clearError(confirmInput);
        return true;
    }
    
    function validateAllFields() {
        const validations = [
            validateFIO(),
            validateLogin(),
            validateEmail(),
            validatePassword(),
            validatePasswordConfirm(),
            validateAgreement()
        ];
        
        return validations.every(result => result === true);
    }
    
    function validateAgreement() {
        const agreeCheckbox = document.getElementById('agree');
        const errorText = agreeCheckbox.closest('.form-group').querySelector('.error-text');
        
        if (!agreeCheckbox.checked) {
            if (errorText) {
                errorText.textContent = 'Необходимо согласие на обработку данных';
                errorText.style.display = 'block';
            }
            
            // Анимация для чекбокса
            agreeCheckbox.style.outline = '2px solid #e74c3c';
            agreeCheckbox.style.outlineOffset = '2px';
            setTimeout(() => {
                agreeCheckbox.style.outline = 'none';
            }, 1000);
            
            return false;
        }
        
        if (errorText) {
            errorText.textContent = '';
            errorText.style.display = 'none';
        }
        
        return true;
    }
    
    function simulateRegistration(formData) {
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Регистрация...';
        submitBtn.disabled = true;
        
        // Симуляция задержки сервера
        setTimeout(() => {
            // Сохраняем данные пользователя (в реальном проекте будет PHP сессия)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userLogin', formData.login);
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('userName', formData.fio);
            localStorage.setItem('userEmail', formData.email);
            
            // Показываем сообщение об успехе
            if (successMessage) {
                successMessage.textContent = 'Регистрация прошла успешно! Вы будете перенаправлены в личный кабинет...';
                successMessage.style.display = 'block';
                
                // Редирект через 2 секунды
                setTimeout(() => {
                    window.location.href = 'personal.html';
                }, 2000);
            }
            
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        }, 1500);
    }
    
    function showError(input, message) {
        const errorText = input.nextElementSibling;
        
        if (input && errorText && errorText.classList.contains('error-text')) {
            input.style.borderColor = '#e74c3c';
            errorText.textContent = message;
            errorText.style.display = 'block';
            errorText.style.color = '#e74c3c';
            
            // Анимация ошибки
            input.style.animation = 'none';
            setTimeout(() => {
                input.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
            
            // Фокус на поле с ошибкой
            input.focus();
        }
    }
    
    function clearError(input) {
        const errorText = input.nextElementSibling;
        
        if (input && errorText && errorText.classList.contains('error-text')) {
            input.style.borderColor = '#ddd';
            errorText.textContent = '';
            errorText.style.display = 'none';
            input.style.animation = '';
        }
    }
});