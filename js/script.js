// Меню на мобильных
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.textContent = navList.classList.contains('active') ? '✕' : '☰';
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav') && !event.target.closest('.menu-toggle')) {
                navList.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }
    
    // Счётчик посетителей
    const visitorCount = document.getElementById('visitor-count');
    if (visitorCount) {
        let count = parseInt(visitorCount.textContent) || 157;
        
        function updateCounter() {
            // Случайное увеличение счетчика
            const increment = Math.floor(Math.random() * 3) + 1;
            count += increment;
            
            // Анимация обновления
            visitorCount.textContent = count;
            visitorCount.style.transform = 'scale(1.2)';
            visitorCount.style.color = '#e67e22';
            
            setTimeout(() => {
                visitorCount.style.transform = 'scale(1)';
                visitorCount.style.color = '#e67e22';
            }, 300);
        }
        
        // Обновление каждые 5 секунд
        setInterval(updateCounter, 5000);
    }
    
    // Анимация увеличения фото новостей
    const newsImages = document.querySelectorAll('.news-img');
    newsImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.5s ease';
        });
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрытие меню на мобильных
                if (navList && navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.textContent = '☰';
                }
            }
        });
    });
    
    // Проверка авторизации (заглушка - в реальном проекте будет проверка сессии)
    function checkAuth() {
        // В реальном проекте здесь будет проверка PHP-сессии
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('personal.html') || currentPage.includes('admin.html')) {
            // Проверяем, есть ли данные о пользователе в localStorage
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const userRole = localStorage.getItem('userRole');
            
            if (!isLoggedIn) {
                window.location.href = 'login.html';
                return;
            }
            
            // Проверка роли для админки
            if (currentPage.includes('admin.html') && userRole !== 'admin') {
                window.location.href = 'personal.html';
            }
        }
    }
    
    // Инициализация проверки при загрузке страницы
    checkAuth();
    
    // Микроанимация для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками новостей и услуг
    document.querySelectorAll('.news-card, .service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});