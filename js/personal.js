document.addEventListener('DOMContentLoaded', function() {
    // Инициализация пользовательских данных
    initUserData();
    
    // Загрузка заявок
    loadRequests();
    
    // Навигация
    document.querySelectorAll('#logout-btn, #logout-btn-main').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
    
    // Создание заявки
    document.querySelectorAll('#create-request-btn, #create-first-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCreateForm(true);
        });
    });
    
    // Отмена создания заявки
    document.getElementById('cancel-request-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCreateForm(false);
    });
    
    // Отправка формы заявки
    const requestForm = document.getElementById('request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createRequest();
        });
    }
    
    // Фильтрация заявок
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Применяем фильтр
            const filter = this.getAttribute('data-filter');
            filterRequests(filter);
        });
    });
    
    // Инициализация модальных окон
    initModals();
    
    // Загрузка данных пользователя
    function initUserData() {
        const userName = localStorage.getItem('userName') || 'Шокумов Шамиль Азаматович';
        const userEmail = localStorage.getItem('userEmail') || 'shamil@example.com';
        const userLogin = localStorage.getItem('userLogin') || 'shamil';
        
        // Устанавливаем данные в интерфейс
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-email').textContent = userEmail;
        
        // Создаем аватар из первой буквы имени
        const avatar = document.getElementById('user-avatar');
        if (avatar) {
            const firstLetter = userName.charAt(0);
            avatar.textContent = firstLetter;
            avatar.style.background = `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`;
        }
    }
    
    // Загрузка заявок (симуляция данных)
    function loadRequests() {
        // Проверяем, есть ли сохраненные заявки в localStorage
        let requests = JSON.parse(localStorage.getItem('userRequests')) || [];
        
        // Если заявок нет, создаем тестовые данные
        if (requests.length === 0) {
            requests = [
                {
                    id: 1,
                    title: 'Редактура романа "Путь к успеху"',
                    description: 'Необходимо провести литературную редактуру романа объемом 300 страниц. Требуется проверка грамматики, стиля и сюжетной линии.',
                    category: 'Редактура',
                    status: 'Новая',
                    date: '15.12.2023 10:30',
                    canDelete: true
                },
                {
                    id: 2,
                    title: 'Дизайн обложки для сборника стихов',
                    description: 'Требуется разработать дизайн обложки для сборника стихов "Осенние мотивы". Предпочтение: минимализм, пастельные тона.',
                    category: 'Дизайн обложки',
                    status: 'Решена',
                    date: '10.12.2023 14:20',
                    canDelete: false
                },
                {
                    id: 3,
                    title: 'Верстка детской книги',
                    description: 'Верстка иллюстрированной детской книги "Приключения в сказочном лесу". Формат А4, 48 страниц, полноцветная печать.',
                    category: 'Вёрстка',
                    status: 'Отклонена',
                    date: '05.12.2023 09:15',
                    rejectReason: 'В данный момент мы не принимаем заявки на верстку детских книг. Повторите запрос после 15 января.',
                    canDelete: false
                },
                {
                    id: 4,
                    title: 'Продвижение книги в социальных сетях',
                    description: 'Необходимо разработать стратегию продвижения новой книги "Цифровая эра" в социальных сетях и запустить рекламную кампанию.',
                    category: 'Продвижение',
                    status: 'Новая',
                    date: '01.12.2023 16:45',
                    canDelete: true
                }
            ];
            
            localStorage.setItem('userRequests', JSON.stringify(requests));
        }
        
        displayRequests(requests);
    }
    
    // Отображение заявок в таблице
    function displayRequests(requests) {
        const tbody = document.getElementById('requests-body');
        const noRequestsDiv = document.getElementById('no-requests');
        
        if (!tbody) return;
        
        // Очищаем таблицу
        tbody.innerHTML = '';
        
        if (requests.length === 0) {
            // Показываем сообщение "нет заявок"
            tbody.innerHTML = '';
            if (noRequestsDiv) noRequestsDiv.style.display = 'block';
            return;
        }
        
        // Скрываем сообщение "нет заявок"
        if (noRequestsDiv) noRequestsDiv.style.display = 'none';
        
        // Добавляем заявки в таблицу
        requests.forEach(request => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', request.id);
            row.setAttribute('data-status', request.status);
            
            // Форматируем статус
            let statusClass = 'status-new';
            if (request.status === 'Решена') statusClass = 'status-solved';
            if (request.status === 'Отклонена') statusClass = 'status-rejected';
            
            // Форматируем дату
            const dateObj = new Date(request.date);
            const formattedDate = dateObj.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>
                    <a href="#" class="view-details" data-id="${request.id}" 
                       style="color: #3498db; text-decoration: none;">
                        ${request.title}
                    </a>
                </td>
                <td>${request.category}</td>
                <td>
                    <span class="request-status ${statusClass}">${request.status}</span>
                </td>
                <td class="actions-cell">
                    ${request.canDelete ? 
                        `<button class="btn btn-delete btn-small delete-request" data-id="${request.id}">
                            Удалить
                        </button>` : 
                        `<span style="color: #95a5a6; font-size: 0.9rem;">Удаление недоступно</span>`
                    }
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Добавляем обработчики для новых элементов
        addEventListenersToRequests();
    }
    
    // Добавление обработчиков событий для заявок
    function addEventListenersToRequests() {
        // Просмотр деталей заявки
        document.querySelectorAll('.view-details').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const requestId = parseInt(this.getAttribute('data-id'));
                showRequestDetails(requestId);
            });
        });
        
        // Удаление заявки
        document.querySelectorAll('.delete-request').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const requestId = parseInt(this.getAttribute('data-id'));
                showDeleteModal(requestId);
            });
        });
    }
    
    // Фильтрация заявок
    function filterRequests(filterType) {
        const allRequests = JSON.parse(localStorage.getItem('userRequests')) || [];
        
        let filteredRequests = allRequests;
        
        if (filterType !== 'all') {
            filteredRequests = allRequests.filter(request => request.status === filterType);
        }
        
        displayRequests(filteredRequests);
    }
    
    // Показать/скрыть форму создания заявки
    function toggleCreateForm(show) {
        const form = document.getElementById('create-request-form');
        if (!form) return;
        
        if (show) {
            form.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth' });
            
            // Сбрасываем форму
            const requestForm = document.getElementById('request-form');
            if (requestForm) requestForm.reset();
            
            // Сбрасываем ошибки
            document.querySelectorAll('.error-text').forEach(el => {
                el.textContent = '';
            });
        } else {
            form.style.display = 'none';
        }
    }
    
    // Создание новой заявки
    function createRequest() {
        const titleInput = document.getElementById('request-title');
        const categorySelect = document.getElementById('request-category');
        const descriptionTextarea = document.getElementById('request-description');
        
        // Валидация
        let isValid = true;
        
        if (!titleInput.value.trim()) {
            showFieldError(titleInput, 'Введите название заявки');
            isValid = false;
        } else {
            clearFieldError(titleInput);
        }
        
        if (!categorySelect.value) {
            showFieldError(categorySelect, 'Выберите категорию');
            isValid = false;
        } else {
            clearFieldError(categorySelect);
        }
        
        if (!descriptionTextarea.value.trim()) {
            showFieldError(descriptionTextarea, 'Введите описание заявки');
            isValid = false;
        } else {
            clearFieldError(descriptionTextarea);
        }
        
        if (!isValid) return;
        
        // Создаем новую заявку
        const newRequest = {
            id: Date.now(), // Используем временную метку как ID
            title: titleInput.value.trim(),
            description: descriptionTextarea.value.trim(),
            category: categorySelect.value,
            status: 'Новая',
            date: new Date().toLocaleString('ru-RU'),
            canDelete: true
        };
        
        // Получаем текущие заявки
        let requests = JSON.parse(localStorage.getItem('userRequests')) || [];
        
        // Добавляем новую заявку в начало
        requests.unshift(newRequest);
        
        // Сохраняем
        localStorage.setItem('userRequests', JSON.stringify(requests));
        
        // Показываем сообщение об успехе
        showNotification('Заявка успешно создана!', 'success');
        
        // Сбрасываем форму
        document.getElementById('request-form').reset();
        toggleCreateForm(false);
        
        // Обновляем таблицу
        loadRequests();
        
        // Сбрасываем фильтр на "Все"
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.add('active');
            }
        });
        filterRequests('all');
    }
    
    // Показать детали заявки
    function showRequestDetails(requestId) {
        const requests = JSON.parse(localStorage.getItem('userRequests')) || [];
        const request = requests.find(r => r.id === requestId);
        
        if (!request) return;
        
        // Заполняем модальное окно
        document.getElementById('modal-title').textContent = request.title;
        document.getElementById('modal-date').textContent = request.date;
        document.getElementById('modal-category').textContent = request.category;
        document.getElementById('modal-status').textContent = request.status;
        document.getElementById('modal-description').textContent = request.description;
        
        // Обработка причины отказа
        const rejectReasonDiv = document.getElementById('modal-reject-reason');
        if (request.status === 'Отклонена' && request.rejectReason) {
            document.getElementById('modal-reason-text').textContent = request.rejectReason;
            rejectReasonDiv.style.display = 'block';
        } else {
            rejectReasonDiv.style.display = 'none';
        }
        
        // Показываем модальное окно
        document.getElementById('details-modal').style.display = 'block';
    }
    
    // Показать модальное окно подтверждения удаления
    function showDeleteModal(requestId) {
        const modal = document.getElementById('delete-modal');
        modal.style.display = 'block';
        
        // Сохраняем ID заявки для удаления
        modal.setAttribute('data-request-id', requestId);
    }
    
    // Инициализация модальных окон
    function initModals() {
        // Модальное окно удаления
        const deleteModal = document.getElementById('delete-modal');
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', function() {
                deleteModal.style.display = 'none';
            });
        }
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', function() {
                const requestId = parseInt(deleteModal.getAttribute('data-request-id'));
                deleteRequest(requestId);
                deleteModal.style.display = 'none';
            });
        }
        
        // Модальное окно деталей
        const detailsModal = document.getElementById('details-modal');
        const closeDetailsBtn = document.getElementById('close-details');
        
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', function() {
                detailsModal.style.display = 'none';
            });
        }
        
        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
            if (e.target === detailsModal) {
                detailsModal.style.display = 'none';
            }
        });
    }
    
    // Удаление заявки
    function deleteRequest(requestId) {
        let requests = JSON.parse(localStorage.getItem('userRequests')) || [];
        
        // Находим индекс заявки
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1 && requests[requestIndex].canDelete) {
            // Удаляем заявку
            requests.splice(requestIndex, 1);
            
            // Сохраняем изменения
            localStorage.setItem('userRequests', JSON.stringify(requests));
            
            // Показываем сообщение об успехе
            showNotification('Заявка успешно удалена!', 'success');
            
            // Обновляем таблицу
            loadRequests();
        } else {
            showNotification('Невозможно удалить эту заявку', 'error');
        }
    }
    
    // Выход из системы
    function logout() {
        // В реальном проекте здесь будет AJAX-запрос к logout.php
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userLogin');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // Редирект на главную страницу
        window.location.href = 'index.html';
    }
    
    // Вспомогательные функции
    function showFieldError(input, message) {
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
    
    function clearFieldError(input) {
        const errorText = input.nextElementSibling;
        
        if (input && errorText && errorText.classList.contains('error-text')) {
            input.style.borderColor = '#ddd';
            errorText.textContent = '';
            errorText.style.display = 'none';
            input.style.animation = '';
        }
    }
    
    function showNotification(message, type) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
        } else {
            notification.style.backgroundColor = '#e74c3c';
        }
        
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Добавляем CSS для анимаций
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
});