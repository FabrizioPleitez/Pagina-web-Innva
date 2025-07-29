let currentSection = 'home';

        // Actualizar estado del menú
        function updateNavState(activeSection) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === activeSection) {
                    link.classList.add('active');
                }
            });
        }

        // Mostrar la página principal
        function showHome() {
            hideAllSections();
            document.getElementById('home-section').style.display = 'block';
            currentSection = 'home';
            updateNavState('home');
            window.history.pushState({ section: 'home' }, '', '#home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Mostrar categoría específica
        function showCategory(category) {
            if (!category) {
                console.error('Categoría no especificada');
                return;
            }

            hideAllSections();
            const sectionElement = document.getElementById(category + '-section');

            if (sectionElement) {
                sectionElement.style.display = 'block';
                sectionElement.classList.add('active');
                currentSection = category;
                updateNavState(category);

                window.history.pushState({ section: category }, '', '#' + category);
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Animación de entrada
                sectionElement.style.opacity = '0';
                sectionElement.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    sectionElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    sectionElement.style.opacity = '1';
                    sectionElement.style.transform = 'translateY(0)';
                }, 50);
            } else {
                console.error('Sección no encontrada:', category);
                showHome();
            }
        }

        // Ocultar todas las secciones
        function hideAllSections() {
            const sections = [
                'home-section',
                'procesadores-section',
                'ram-section',
                'gpu-section',
                'motherboards-section',
                'almacenamiento-section',
                'fuentes-section'
            ];

            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = 'none';
                    el.classList.remove('active');
                }
            });
        }

        // Manejo del historial (botón atrás)
        function handlePopState(event) {
            if (event.state && event.state.section) {
                if (event.state.section === 'home') {
                    showHomeWithoutHistory();
                } else {
                    showCategoryWithoutHistory(event.state.section);
                }
            } else {
                showHomeWithoutHistory();
            }
        }

        function showHomeWithoutHistory() {
            hideAllSections();
            document.getElementById('home-section').style.display = 'block';
            currentSection = 'home';
            updateNavState('home');
        }

        function showCategoryWithoutHistory(category) {
            hideAllSections();
            const sectionElement = document.getElementById(category + '-section');
            if (sectionElement) {
                sectionElement.style.display = 'block';
                sectionElement.classList.add('active');
                currentSection = category;
                updateNavState(category);
            }
        }

        // Validar entrada de categoría
        function validateInput(input) {
            if (typeof input !== 'string') return false;
            const sanitized = input.trim().toLowerCase();
            const allowed = ['procesadores', 'ram', 'gpu', 'motherboards', 'almacenamiento', 'fuentes'];
            return allowed.includes(sanitized);
        }

        // Mostrar notificación simple
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? '#ef4444' : '#10b981'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                font-family: inherit;
                font-weight: 500;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 100);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        // Mejoras UX
        function enhanceUserExperience() {
            // Escape para volver a home
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    showHome();
                }
            });

            // Simulación de lazy load
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                    }
                });
            }, { threshold: 0.1, rootMargin: '50px' });

            document.querySelectorAll('.product-card, .category-card').forEach(card => {
                observer.observe(card);
            });
        }

        // Inicializar app
        function initializeApp() {
            try {
                const hash = window.location.hash.substring(1);
                if (hash && validateInput(hash)) {
                    showCategory(hash);
                } else {
                    showHome();
                }

                window.addEventListener('popstate', handlePopState);
                enhanceUserExperience();

                window.addEventListener('error', e => {
                    handleError(e.error, 'Error global');
                });

                console.log("Aplicación inicializada - Menú superior funcional");
            } catch (error) {
                handleError(error, 'Inicialización');
            }
        }

        // Manejo de errores
        function handleError(error, context) {
            console.error(`Error en ${context}:`, error);
            showNotification('Ocurrió un error. Intenta de nuevo.', 'error');
        }

        // Utilidades globales
        const AppUtils = {
            formatPrice: price =>
                new Intl.NumberFormat('es-HN', {
                    style: 'currency',
                    currency: 'USD'
                }).format(price),

            formatDate: date =>
                new Intl.DateTimeFormat('es-HN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(new Date(date)),

            debounce: (func, wait) => {
                let timeout;
                return function (...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func(...args), wait);
                };
            }
        };

        // Exportar globalmente
        window.TechPCStore = {
            showHome,
            showCategory,
            AppUtils
        };

        // DOM listo
        document.addEventListener('DOMContentLoaded', initializeApp);

        // Limpiar recursos antes de salir
        window.addEventListener('beforeunload', () => {
            console.log('Cerrando aplicación...');
        });
