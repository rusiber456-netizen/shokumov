document.addEventListener('DOMContentLoaded', function() {
    // Проверка прав администратора
    checkAdminAccess();
    
    // Инициализация данных
    initAdminData();
    loadStats();
    loadRequests();
    loadUsers();
    loadCategories();
    loadNews();
    
    // Навигация
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    
    // Табы
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Поиск
    document.getElementById('search-requests')?.addEventListener('input', filterRequests);
    document.getElementById('search-users')?.addEventListener('input', filterUsers);
    
    // Категории
    document.getElementById('add-category-btn')?.addEventListener('click', addCategory);
    
    // Новости
    document.getElementById('add-news-btn')?.addEventListener('click', function() {
        document.getElementById('news-modal').style.display = 'block';
    });
    
    // Модальные окна
    initModals();
    
    // Изменение статуса
    document.getElementById('status-select')?.addEventListener('change', function() {
        const rejectGroup = document.getElementById('reject-reason-group');
        if (this.value === 'Отклонена') {
            rejectGroup.style.display = 'block';
        } else {
            rejectGroup.style.display = 'none';
        }
    });
    
    // Функции
    
    function checkAdminAccess() {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'admin') {
            window.location.href = 'index.html';
        }
    }
    
    function initAdminData() {
        const adminAvatar = document.getElementById('admin-avatar');
        if (adminAvatar) {
            const userName = localStorage.getItem('userName') || 'Администратор';
            const firstLetter = userName.charAt(0);
            adminAvatar.textContent = firstLetter;
        }
    }
    
    function switchTab(tabName) {
        // Обновляем активную кнопку таба
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Показываем активное содержимое
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }
    
    function loadStats() {
        // Загрузка статистики (в реальном проекте - AJAX запрос)
        const requests = JSON.parse(localStorage.getItem('allRequests')) || getSampleRequests();
        const users = JSON.parse(localStorage.getItem('allUsers')) || getSampleUsers();
        
        // Статистика заявок
        const newRequests = requests.filter(r => r.status === 'Новая').length;
        const solvedRequests = requests.filter(r => r.status === 'Решена').length;
        const rejectedRequests = requests.filter(r => r.status === 'Отклонена').length;
        
        // Обновляем UI
        document.getElementById('stat-new').textContent = newRequests;
        document.getElementById('stat-solved').textContent = solvedRequests;
        document.getElementById('stat-rejected').textContent = rejectedRequests;
        document.getElementById('stat-total').textContent = users.length;
    }
    
    function loadRequests() {
        const requests = JSON.parse(localStorage.getItem('allRequests')) || getSampleRequests();
        displayRequests(requests);
    }
    
    function displayRequests(requests) {
        const container = document.getElementById('requests-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (requests.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #7f8c8d;">Нет заявок</div>';
            return;
        }
        
        requests.forEach(request => {
            const requestEl = document.createElement('div');
            requestEl.className = 'request-row';
            requestEl.setAttribute('data-id', request.id);
            
            let statusClass = 'badge-new';
            if (request.status === 'Решена') statusClass = 'badge-solved';
            if (request.status === 'Отклонена') statusClass = 'badge-rejected';
            
            // Форматируем дату
            const date = new Date(request.date);
            const formattedDate = date.toLocaleDateString('ru-RU');
            
            requestEl.innerHTML = `
                <div class="user-avatar-small">${request.userName.charAt(0)}</div>
                <div>
                    <div style="font-weight: 500;">${request.title}</div>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">${request.userName}</div>
                </div>
                <div>${request.category}</div>
                <div>${formattedDate}</div>
                <div>
                    <span class="status-badge ${statusClass}">${request.status}</span>
                </div>
                <div class="action-buttons">
                    ${request.status === 'Новая' ? 
                        `<button class="btn btn-sm btn-solve change-status" data-id="${request.id}" data-action="Решена">
                            Решить
                        </button>
                        <button class="btn btn-sm btn-reject change-status" data-id="${request.id}" data-action="Отклонена">
                            Отклонить
                        </button>` : 
                        `<span style="color: #95a5a6; font-size: 0.9rem;">Статус изменен</span>`
                    }
                </div>
            `;
            
            container.appendChild(requestEl);
        });
        
        // Добавляем обработчики для кнопок изменения статуса
        document.querySelectorAll('.change-status').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = parseInt(this.getAttribute('data-id'));
                const action = this.getAttribute('data-action');
                showStatusModal(requestId, action);
            });
        });
    }
    
    function filterRequests() {
        const searchTerm = document.getElementById('search-requests').value.toLowerCase();
        const requests = JSON.parse(localStorage.getItem('allRequests')) || getSampleRequests();
        
        const filtered = requests.filter(request => 
            request.title.toLowerCase().includes(searchTerm) ||
            request.userName.toLowerCase().includes(searchTerm) ||
            request.category.toLowerCase().includes(searchTerm)
        );
        
        displayRequests(filtered);
    }
    
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('allUsers')) || getSampleUsers();
        displayUsers(users);
    }
    
    function displayUsers(users) {
        const container = document.getElementById('users-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        users.forEach(user => {
            const userEl = document.createElement('div');
            userEl.className = 'user-row';
            
            userEl.innerHTML = `
                <div class="user-avatar-small">${user.name.charAt(0)}</div>
                <div>
                    <div style="font-weight: 500;">${user.name}</div>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">${user.login}</div>
                </div>
                <div>${user.email}</div>
                <div>${user.role === 'admin' ? 'Администратор' : 'Пользователь'}</div>
                <div>${user.requests} заявок</div>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit">Редактировать</button>
                    ${user.role !== 'admin' ? 
                        `<button class="btn btn-sm btn-delete delete-user" data-id="${user.id}">
                            Удалить
                        </button>` : 
                        ''
                    }
                </div>
            `;
            
            container.appendChild(userEl);
        });
        
        // Обработчики для кнопок удаления
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
                    deleteUser(userId);
                }
            });
        });
    }
    
    function filterUsers() {
        const searchTerm = document.getElementById('search-users').value.toLowerCase();
        const users = JSON.parse(localStorage.getItem('allUsers')) || getSampleUsers();
        
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.login.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        
        displayUsers(filtered);
    }
    
    function loadCategories() {
        const categories = JSON.parse(localStorage.getItem('categories')) || 
                         ['Редактура', 'Дизайн обложки', 'Вёрстка', 'Печать', 'Продвижение'];
        
        displayCategories(categories);
    }
    
    function displayCategories(categories) {
        const container = document.getElementById('categories-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        categories.forEach((category, index) => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'category-tag';
            
            categoryEl.innerHTML = `
                ${category}
                <span class="remove" data-index="${index}">×</span>
            `;
            
            container.appendChild(categoryEl);
        });
        
        // Обработчики для удаления категорий
        document.querySelectorAll('.category-tag .remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeCategory(index);
            });
        });
    }
    
    function addCategory() {
        const input = document.getElementById('new-category');
        const categoryName = input.value.trim();
        
        if (!categoryName) {
            showNotification('Введите название категории', 'error');
            return;
        }
        
        const categories = JSON.parse(localStorage.getItem('categories')) || 
                         ['Редактура', 'Дизайн обложки', 'Вёрстка', 'Печать', 'Продвижение'];
        
        if (categories.includes(categoryName)) {
            showNotification('Такая категория уже существует', 'error');
            return;
        }
        
        categories.push(categoryName);
        localStorage.setItem('categories', JSON.stringify(categories));
        
        displayCategories(categories);
        input.value = '';
        showNotification('Категория добавлена', 'success');
    }
    
    function removeCategory(index) {
        const categories = JSON.parse(localStorage.getItem('categories')) || 
                         ['Редактура', 'Дизайн обложки', 'Вёрстка', 'Печать', 'Продвижение'];
        
        if (index >= 0 && index < categories.length) {
            categories.splice(index, 1);
            localStorage.setItem('categories', JSON.stringify(categories));
            displayCategories(categories);
            showNotification('Категория удалена', 'success');
        }
    }
    
    function loadNews() {
        const news = JSON.parse(localStorage.getItem('adminNews')) || getSampleNews();
        displayNews(news);
    }
    
    function displayNews(newsList) {
        const container = document.getElementById('news-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        newsList.forEach(news => {
            const newsEl = document.createElement('div');
            newsEl.className = 'request-row';
            
            // Обрезаем длинный текст
            const shortContent = news.content.length > 100 ? 
                news.content.substring(0, 100) + '...' : news.content;
            
            newsEl.innerHTML = `
                <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 150px 100px; gap: 1rem; width: 100%;">
                    <div>
                        <div style="font-weight: 500;">${news.title}</div>
                        <div style="font-size: 0.9rem; color: #7f8c8d; margin-top: 0.25rem;">
                            ${shortContent}
                        </div>
                        <div style="font-size: 0.85rem; color: #3498db; margin-top: 0.5rem;">
                            ${news.category || 'Без категории'}
                        </div>
                    </div>
                    <div>${news.date}</div>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-edit">Изменить</button>
                        <button class="btn btn-sm btn-delete delete-news" data-id="${news.id}">
                            Удалить
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(newsEl);
        });
        
        // Обработчики для удаления новостей
        document.querySelectorAll('.delete-news').forEach(btn => {
            btn.addEventListener('click', function() {
                const newsId = this.getAttribute('data-id');
                if (confirm('Вы уверены, что хотите удалить эту новость?')) {
                    deleteNews(newsId);
                }
            });
        });
    }
    
    function showStatusModal(requestId, action) {
        const requests = JSON.parse(localStorage.getItem('allRequests')) || getSampleRequests();
        const request = requests.find(r => r.id === requestId);
        
        if (!request) return;
        
        document.getElementById('modal-request-title').textContent = request.title;
        document.getElementById('modal-current-status').textContent = request.status;
        document.getElementById('status-select').value = action;
        
        // Показываем/скрываем поле причины отказа
        const rejectGroup = document.getElementById('reject-reason-group');
        if (action === 'Отклонена') {
            rejectGroup.style.display = 'block';
        } else {
            rejectGroup.style.display = 'none';
        }
        
        // Сохраняем ID заявки
        const modal = document.getElementById('status-modal');
        modal.setAttribute('data-request-id', requestId);
        modal.style.display = 'block';
    }
    
    function saveStatus() {
        const modal = document.getElementById('status-modal');
        const requestId = parseInt(modal.getAttribute('data-request-id'));
        const newStatus = document.getElementById('status-select').value;
        const rejectReason = document.getElementById('reject-reason').value;
        
        if (!newStatus) {
            showNotification('Выберите новый статус', 'error');
            return;
        }
        
        if (newStatus === 'Отклонена' && !rejectReason.trim()) {
            showNotification('Укажите причину отказа', 'error');
            return;
        }
        
        // Обновляем заявку (в реальном проекте - AJAX запрос)
        let requests = JSON.parse(localStorage.getItem('allRequests')) || getSampleRequests();
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = newStatus;
            if (newStatus === 'Отклонена') {
                requests[requestIndex].rejectReason = rejectReason;
            }
            
            localStorage.setItem('allRequests', JSON.stringify(requests));
            
            // Также обновляем заявки пользователя (если они есть)
            updateUserRequest(requestId, newStatus, rejectReason);
            
            // Обновляем UI
            loadRequests();
            loadStats();
            
            showNotification('Статус заявки обновлен', 'success');
            modal.style.display = 'none';
            document.getElementById('reject-reason').value = '';
        }
    }
    
    function updateUserRequest(requestId, newStatus, rejectReason) {
        // Обновляем заявку в данных пользователя
        let userRequests = JSON.parse(localStorage.getItem('userRequests')) || [];
        const userRequestIndex = userRequests.findIndex(r => r.id === requestId);
        
        if (userRequestIndex !== -1) {
            userRequests[userRequestIndex].status = newStatus;
            userRequests[userRequestIndex].canDelete = false; // После изменения статуса удаление запрещено
            
            if (newStatus === 'Отклонена' && rejectReason) {
                userRequests[userRequestIndex].rejectReason = rejectReason;
            }
            
            localStorage.setItem('userRequests', JSON.stringify(userRequests));
        }
    }
    
    function deleteUser(userId) {
        let users = JSON.parse(localStorage.getItem('allUsers')) || getSampleUsers();
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('allUsers', JSON.stringify(users));
        
        loadUsers();
        loadStats();
        showNotification('Пользователь удален', 'success');
    }
    
    function deleteNews(newsId) {
        let news = JSON.parse(localStorage.getItem('adminNews')) || getSampleNews();
        news = news.filter(n => n.id !== newsId);
        localStorage.setItem('adminNews', JSON.stringify(news));
        
        loadNews();
        showNotification('Новость удалена', 'success');
    }
    
    function initModals() {
        // Модальное окно статуса
        const statusModal = document.getElementById('status-modal');
        const cancelStatusBtn = document.getElementById('cancel-status');
        const saveStatusBtn = document.getElementById('save-status');
        
        if (cancelStatusBtn) {
            cancelStatusBtn.addEventListener('click', function() {
                statusModal.style.display = 'none';
                document.getElementById('reject-reason').value = '';
            });
        }
        
        if (saveStatusBtn) {
            saveStatusBtn.addEventListener('click', saveStatus);
        }
        
        // Модальное окно новостей
        const newsModal = document.getElementById('news-modal');
        const cancelNewsBtn = document.getElementById('cancel-news');
        const newsForm = document.getElementById('news-form');
        
        if (cancelNewsBtn) {
            cancelNewsBtn.addEventListener('click', function() {
                newsModal.style.display = 'none';
                newsForm.reset();
            });
        }
        
        if (newsForm) {
            newsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addNews();
            });
        }
        
        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', function(e) {
            if (e.target === statusModal) {
                statusModal.style.display = 'none';
                document.getElementById('reject-reason').value = '';
            }
            if (e.target === newsModal) {
                newsModal.style.display = 'none';
                newsForm.reset();
            }
        });
    }
    
    function addNews() {
        const title = document.getElementById('news-title').value.trim();
        const category = document.getElementById('news-category').value.trim();
        const content = document.getElementById('news-content').value.trim();
        const image = document.getElementById('news-image').value.trim();
        
        if (!title || !content) {
            showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        let news = JSON.parse(localStorage.getItem('adminNews')) || getSampleNews();
        
        const newNews = {
            id: Date.now(),
            title: title,
            category: category || 'Без категории',
            content: content,
            image: image || 'images/default-news.jpg',
            date: new Date().toLocaleDateString('ru-RU')
        };
        
        news.unshift(newNews);
        localStorage.setItem('adminNews', JSON.stringify(news));
        
        // Закрываем модальное окно и сбрасываем форму
        document.getElementById('news-modal').style.display = 'none';
        document.getElementById('news-form').reset();
        
        // Обновляем список новостей
        loadNews();
        showNotification('Новость добавлена', 'success');
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    }
    
    // Вспомогательные функции для тестовых данных
    function getSampleRequests() {
        return [
            {
                id: 1,
                title: 'Редактура романа "Путь к успеху"',
                userName: 'Иванов Иван',
                category: 'Редактура',
                status: 'Новая',
                date: '2023-12-15'
            },
            {
                id: 2,
                title: 'Дизайн обложки для сборника стихов',
                userName: 'Петрова Анна',
                category: 'Дизайн обложки',
                status: 'Решена',
                date: '2023-12-10'
            },
            {
                id: 3,
                title: 'Верстка детской книги',
                userName: 'Сидоров Петр',
                category: 'Вёрстка',
                status: 'Отклонена',
                date: '2023-12-05'
            },
            {
                id: 4,
                title: 'Продвижение книги в социальных сетях',
                userName: 'Кузнецова Мария',
                category: 'Продвижение',
                status: 'Новая',
                date: '2023-12-01'
            }
        ];
    }
    
    function getSampleUsers() {
        return [
            { id: 1, name: 'Администратор', login: 'admin', email: 'admin@example.com', role: 'admin', requests: 0 },
            { id: 2, name: 'Шокумов Шамиль', login: 'shamil', email: 'shamil@example.com', role: 'user', requests: 4 },
            { id: 3, name: 'Иванов Иван', login: 'ivanov', email: 'ivan@example.com', role: 'user', requests: 2 },
            { id: 4, name: 'Петрова Анна', login: 'petrova', email: 'anna@example.com', role: 'user', requests: 1 }
        ];
    }
    
    function getSampleNews() {
        return [
            {
                id: 1,
                title: 'Открытие нового филиала',
                category: 'Анонс',
                content: 'Мы рады сообщить об открытии филиала в Москве!',
                date: '15.12.2023'
            },
            {
                id: 2,
                title: 'Литературный конкурс 2024',
                category: 'Конкурс',
                content: 'Принимаем заявки на участие в ежегодном конкурсе',
                date: '10.12.2023'
            }
        ];
    }
    
    function showNotification(message, type) {
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
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
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