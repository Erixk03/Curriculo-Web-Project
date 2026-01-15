/**
 * ============================================
 * CURRÍCULO WEB - JAVASCRIPT
 * Funcionalidades: Navegação, Scroll, Interatividade
 * ============================================
 */

(function() {
    'use strict';

    // ============================================
    // VARIÁVEIS GLOBAIS
    // ============================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const currentYear = document.getElementById('currentYear');
    const navAvatarBtn = document.getElementById('navAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const avatarModalBackdrop = document.getElementById('avatarModalBackdrop');
    const avatarModalClose = document.getElementById('avatarModalClose');

    // ============================================
    // NAVEGAÇÃO MOBILE
    // ============================================
    
    function initMobileNav() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navbar.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    
    function initNavbarScroll() {
        if (!navbar) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ============================================
    // SCROLL SUAVE PARA ÂNCORAS
    // ============================================
    
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Verifica se é um link âncora
                if (href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const navbarHeight = navbar.offsetHeight;
                        const targetPosition = targetElement.offsetTop - navbarHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ============================================
    // BOTÃO VOLTAR AO TOPO
    // ============================================
    
    function initBackToTop() {
        if (!backToTop) return;

        // Mostrar/ocultar botão baseado no scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        // Scroll suave ao clicar
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // ATIVAR LINK ATIVO NA NAVEGAÇÃO
    // ============================================
    
    function initActiveNavLink() {
        const sections = document.querySelectorAll('.section, .hero');
        
        function updateActiveLink() {
            const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink(); // Executar uma vez no carregamento
    }

    // ============================================
    // ANIMAÇÃO AO SCROLL (Fade In)
    // ============================================
    
    function initScrollAnimations() {
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

        // Elementos para animar
        const animateElements = document.querySelectorAll(
            '.experiencia-card, .formacao-card, .competencia-tag, .diferencial-card, .contato-item'
        );

        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // ============================================
    // ATUALIZAR ANO NO FOOTER
    // ============================================
    
    function updateCurrentYear() {
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // VALIDAÇÃO DE LINKS EXTERNOS
    // ============================================
    
    function initExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        
        externalLinks.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // ============================================
    // LAZY LOADING DE IMAGENS (se houver)
    // ============================================
    
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // PERFORMANCE: DEBOUNCE FUNCTION
    // ============================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // AVATAR MODAL INTERATIVO
    // ============================================
    
    function initAvatarModal() {
        if (!navAvatarBtn || !avatarModal) return;

        // Tratamento de erro para imagem do avatar
        const navAvatarImg = document.querySelector('.nav-avatar-img');
        const modalAvatarImg = document.querySelector('.avatar-modal-image');
        
        if (navAvatarImg) {
            navAvatarImg.addEventListener('error', function() {
                this.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.textContent = 'E';
                fallback.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background-color: var(--color-primary); color: white; font-weight: 700; font-size: 1.125rem; border: 2px solid #9333ea;';
                navAvatarBtn.appendChild(fallback);
            });
        }

        if (modalAvatarImg) {
            modalAvatarImg.addEventListener('error', function() {
                this.style.display = 'none';
                const wrapper = this.parentElement;
                const fallback = document.createElement('div');
                fallback.textContent = 'Foto não disponível';
                fallback.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1e3a5f, #2a4d75); color: white; font-size: 1.25rem;';
                wrapper.appendChild(fallback);
            });
        }

        // Abrir modal ao clicar no avatar
        navAvatarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openAvatarModal();
        });

        // Fechar modal ao clicar no backdrop
        if (avatarModalBackdrop) {
            avatarModalBackdrop.addEventListener('click', closeAvatarModal);
        }

        // Fechar modal ao clicar no botão fechar
        if (avatarModalClose) {
            avatarModalClose.addEventListener('click', closeAvatarModal);
        }

        // Fechar modal com tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && avatarModal && avatarModal.classList.contains('active')) {
                closeAvatarModal();
            }
        });

        // Prevenir scroll do body quando modal estiver aberto
        function preventBodyScroll() {
            if (avatarModal.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        // Observar mudanças no modal
        const observer = new MutationObserver(preventBodyScroll);
        if (avatarModal) {
            observer.observe(avatarModal, { attributes: true, attributeFilter: ['class'] });
        }
    }

    function openAvatarModal() {
        if (!avatarModal) return;
        
        avatarModal.classList.add('active');
        
        // Focar no botão de fechar para acessibilidade
        if (avatarModalClose) {
            setTimeout(() => {
                avatarModalClose.focus();
            }, 300);
        }
    }

    function closeAvatarModal() {
        if (!avatarModal) return;
        
        avatarModal.classList.remove('active');
        
        // Retornar foco para o avatar após fechar
        if (navAvatarBtn) {
            setTimeout(() => {
                navAvatarBtn.focus();
            }, 300);
        }
    }

    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    function init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Inicializar todas as funcionalidades
        initMobileNav();
        initNavbarScroll();
        initSmoothScroll();
        initBackToTop();
        initActiveNavLink();
        initScrollAnimations();
        updateCurrentYear();
        initExternalLinks();
        initLazyLoading();
        initAvatarModal();

        // Log de inicialização (remover em produção se necessário)
        console.log('✅ Currículo Web inicializado com sucesso!');
    }

    // Executar inicialização
    init();

    // ============================================
    // EXPORT PARA USO EXTERNO (se necessário)
    // ============================================
    
    window.CurriculoWeb = {
        scrollToSection: function(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = section.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

})();
