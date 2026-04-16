 const glow = document.getElementById('cursorGlow');
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });

        const progressBar = document.getElementById('scrollProgress');
        const scrollIndicator = document.getElementById('scrollIndicator');
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobileToggle');
        const navBackdrop = document.getElementById('navBackdrop');
        const navMobileOverlay = document.getElementById('navMobileOverlay');

        let menuOpen = false;

        function openMenu() {
            menuOpen = true;
            mobileToggle.classList.add('active');
            mobileToggle.setAttribute('aria-expanded', 'true');
            navBackdrop.classList.add('open');
            navMobileOverlay.classList.add('open');
            document.body.classList.add('menu-open');
        }

        function closeMenu() {
            menuOpen = false;
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            navBackdrop.classList.remove('open');
            navMobileOverlay.classList.remove('open');
            document.body.classList.remove('menu-open');
        }

        function toggleMenu() {
            menuOpen ? closeMenu() : openMenu();
        }

        mobileToggle.addEventListener('click', toggleMenu);
        mobileToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOpen) closeMenu();
        });

        navBackdrop.addEventListener('click', closeMenu);

        navMobileOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });

        let lastScrollY = window.scrollY;
        let scrollTicking = false;
        let currentDirection = 'down';
        const EXIT_THRESHOLD = -150;
        const animatedSections = document.querySelectorAll('.hero-section, .footer-section');

        function handleScrollDirection() {
            const scrollY = window.scrollY;
            const viewportH = window.innerHeight;

            if (scrollY > lastScrollY) currentDirection = 'down';
            else if (scrollY < lastScrollY) currentDirection = 'up';

            const docHeight = document.documentElement.scrollHeight - viewportH;
            progressBar.style.width = ((scrollY / docHeight) * 100) + '%';

            if (scrollY > 80) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');

            if (scrollY > 100 && scrollIndicator) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.5s ease';
            }

            animatedSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionBottom = rect.bottom;
                const sectionTop = rect.top;
                const isVisible = sectionTop < viewportH && sectionBottom > 0;

                if (currentDirection === 'down') {
                    if (sectionBottom < EXIT_THRESHOLD) {
                        section.classList.remove('section-enter-up');
                        section.classList.add('section-exit-up');
                    } else {
                        section.classList.remove('section-exit-up');
                        section.classList.add('section-enter-up');
                    }
                }

                if (currentDirection === 'up') {
                    if (sectionBottom > EXIT_THRESHOLD) {
                        section.classList.remove('section-exit-up');
                        section.classList.add('section-enter-up');
                    }
                }

                if (isVisible) {
                    section.classList.remove('section-exit-up');
                    section.classList.add('section-enter-up');
                }
            });

            lastScrollY = scrollY;
            scrollTicking = false;
        }

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(handleScrollDirection);
                scrollTicking = true;
            }
        }, { passive: true });

        const revealElements = document.querySelectorAll('.reveal, .reveal-img, .product-card, .flavor-item');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        revealElements.forEach(el => revealObserver.observe(el));

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(el => {
                const section = el.closest('.hero-section');
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const speed = parseFloat(el.dataset.parallax);
                el.style.transform = `translateY(${rect.top * speed}px)`;
            });
        }, { passive: true });