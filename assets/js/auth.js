 // === CURSOR GLOW ===
        const glow = document.getElementById('cursorGlow');
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });

        // === TABS ===
        const tabs = document.querySelectorAll('.auth-tab');
        const panels = document.querySelectorAll('.auth-panel');
        const indicator = document.getElementById('tabIndicator');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                // Update tabs
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Move indicator
                if (target === 'daftar') {
                    indicator.classList.add('right');
                } else {
                    indicator.classList.remove('right');
                }

                // Update panels
                panels.forEach(p => p.classList.remove('active'));
                document.getElementById('panel-' + target).classList.add('active');

                // Clear errors
                clearErrors();
            });
        });

        // === TOGGLE PASSWORD ===
        function togglePw(inputId, btn) {
            const input = document.getElementById(inputId);
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';

            // Swap icon
            if (isPassword) {
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>`;
            } else {
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>`;
            }
        }

        // === VALIDATION HELPERS ===
        function showError(inputId, errId) {
            document.getElementById(inputId).classList.add('error');
            document.getElementById(errId).classList.add('show');
        }

        function clearError(inputId, errId) {
            document.getElementById(inputId).classList.remove('error');
            document.getElementById(errId).classList.remove('show');
        }

        function clearErrors() {
            document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            document.querySelectorAll('.error-msg.show').forEach(el => el.classList.remove('show'));
            const agreeWrap = document.getElementById('d-agree-wrap');
            if (agreeWrap) agreeWrap.classList.remove('error');
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // === REAL-TIME CLEAR ERROR ON INPUT ===
        document.querySelectorAll('.field input').forEach(input => {
            input.addEventListener('input', () => {
                const errEl = input.closest('.field').querySelector('.error-msg');
                if (errEl) {
                    input.classList.remove('error');
                    errEl.classList.remove('show');
                }
            });
        });

        // === LOGIN FORM ===
        document.getElementById('form-login').addEventListener('submit', function(e) {
            e.preventDefault();
            clearErrors();

            const email = document.getElementById('l-email').value.trim();
            const pass = document.getElementById('l-pass').value;
            let valid = true;

            if (!isValidEmail(email)) {
                showError('l-email', 'l-email-err');
                valid = false;
            }

            if (!pass) {
                showError('l-pass', 'l-pass-err');
                valid = false;
            }

            if (valid) {
                const btn = this.querySelector('.btn-submit');
                btn.classList.add('loading');

                // Simulasi request
                setTimeout(() => {
                    btn.classList.remove('loading');
                    toast('Login berhasil! Selamat datang kembali.', 'success');
                    this.reset();
                }, 1500);
            }
        });

        // === DAFTAR FORM ===
        document.getElementById('form-daftar').addEventListener('submit', function(e) {
            e.preventDefault();
            clearErrors();

            const nama = document.getElementById('d-nama').value.trim();
            const email = document.getElementById('d-email').value.trim();
            const pass = document.getElementById('d-pass').value;
            const agree = document.getElementById('d-agree').checked;
            let valid = true;

            if (!nama) {
                showError('d-nama', 'd-nama-err');
                valid = false;
            }

            if (!isValidEmail(email)) {
                showError('d-email', 'd-email-err');
                valid = false;
            }

            if (pass.length < 6) {
                showError('d-pass', 'd-pass-err');
                valid = false;
            }

            if (!agree) {
                document.getElementById('d-agree-wrap').classList.add('error');
                document.getElementById('d-agree-err').classList.add('show');
                valid = false;
            }

            if (valid) {
                const btn = this.querySelector('.btn-submit');
                btn.classList.add('loading');

                setTimeout(() => {
                    btn.classList.remove('loading');
                    toast('Pendaftaran berhasil! Silakan login.', 'success');

                    // Auto switch to login
                    setTimeout(() => {
                        tabs[0].click();
                    }, 800);

                    this.reset();
                }, 1500);
            }
        });

        // === TOAST ===
        function toast(message, type = 'info') {
            const container = document.getElementById('toastBox');

            const icons = {
                info: `<svg class="toast-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
                success: `<svg class="toast-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
                error: `<svg class="toast-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
            };

            const el = document.createElement('div');
            el.className = 'toast';
            el.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
            container.appendChild(el);

            setTimeout(() => {
                el.classList.add('out');
                setTimeout(() => el.remove(), 300);
            }, 3000);
        }