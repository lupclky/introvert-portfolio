document.addEventListener('DOMContentLoaded', () => {

    /* =============================================================
       CẤU HÌNH KHÓA MẬT KHẨU (PASSWORD LOCK)
       Đặt là true nếu bạn muốn khóa trang web bằng file writings.enc đã mã hóa.
       Đặt là false nếu bạn muốn mở tự do (dùng bài viết tĩnh trong index.html).
       ============================================================= */
    const USE_PASSWORD_LOCK = true;

    /* =============================================================
       CẤU HÌNH LIÊN KẾT GOOGLE APPS SCRIPT WEB APP
       Dán URL Apps Script Web App của bạn vào đây (Xem README.md)
       Nếu để trống "", trang web sẽ tự động sử dụng file writings.enc mã hóa cục bộ.
       ============================================================= */
    const GOOGLE_APPS_SCRIPT_URL = "/api/sheet";

    const UNLOCK_API_URL = "/api/unlock";
    const PRIVATE_ABOUT_ENCRYPTED_URL = "about.enc?v=20260604-about-utf8";
    const ENCRYPTED_PRIVATE_ABOUT = [
        "+DGP70a8C3/HGt6X35todnMnpl6Td1/P+ReZNrL7ICD2IAOkXcnBI92hqSGIDlMjW6Sq6xJ8LHNSuWreAfgnbpJ86a34Rqr4UK76XfUoUZAJChNrs0Gnvwch95d8BY/QzxMCLlSbPoQnaXM7Qm7dzpQemGh6g46ZUKZ1/gDoMJl8b89WHNNLPQww+pEizTwHeY+HCzfqcCappplrJcRa8LaK6dCS",
        "x49Q4ZmlpiwEiRo+Ys2xNMn5DxyTtWiHNvQ8LkU6A+nK75UOveOjdyFkka8mSfFNa7I08bxK4tcWMyZiGFDlf2+x2KByXDMeCinpr8C8MdzInrj3zkt6K4AwA60K+VNtM3cn8y+Z6vA7qc/+VIGOKX6ZQpvy5MScrrypx+liOUmPLJBIi4KSJ3mY/rJuUwqx0fxOrbpF8VPJIFLhEy2aTYA7QoAE",
        "uJb4ab7TobhmElhZ/QzY0fav0PsCyTMoOwomMwtHD5UrIi9FnF4eOusAMhmf01boAxEHzSwxaD9gXe9491kgHo3mxew0wO9u3xyr3zU8S2AsC0eQNmQw9nsX32fK1eUqNirP8R6VZiqYQPR/Gs/x+QW2cnxxkM7bG5fGSsnI82d4bIrL19wOFTdvUY4vzIfJP1GhBxaM2tRTPo+RJfSp5s6KuAAt",
        "mK4qHxYRMshu8vxpECwgAc3/4At0qJh3QUjjgfhFzdpOHaxJduaFl9djs3NncZL+SM4erBOqrkH4HU+TTlmOJjiOufQq1IWHg7xSM5BgZH0PzDYrn47uf/vEzmqy6uyBt7gJ6y+G1gFCZD5B4iYMRcDMpR7SyCcOTsVv+BiqAOh7MUHX9l7HLwSUhTqxljoJwMrH+Q6mFbv+VMyEDgDxA5cXSbOT",
        "9F9HYb4ih8wDPVDIDWo+/FI4otGlRR1HstyI7it+GvY4/+KQBfxSMh/c+PL9P1zUQhSN7Z3wm2pWm1c+CDHtuyN5A88vSWvoc5MQG3EsOqyWj39ikCe8WRN1u+cv1d3uH0+yMAMQpBnRf5X7VZ0dLHo1bOX9bcFU5bqGPzSEdXICf0E+03oHbt5+1M7RaiCe8mCTCOeQoRjn4ugOc6CT03JEnVXW",
        "zS6IXnAAJJqDS407U/+0zcDbTPtouF83ycSIdRssMDPOBE5+Zc00BPFN8gFDUSCbkhDeUVf5p3k2qYTl3G0cwqygTwt3fWWboo0j8Bvzgk5g+cQ0U+6ZttOU7KhQJLGLlDp4g65yBHd1AErHgyEH44jYEOlEa/geOoBHfl9Amvkr9KKyp0eSHJhQqQtnMcCBEsKGbepVRl27EHw8Fo662ryk3P1i",
        "lFIZI0z9Pn2IE1KktmmPbSo3GxH4U/DTRLt0ee8XFoNQ57b39ZxKs0CoV4+zNv/VaqHXrfbQAm5Y/y7mtprK9uEC6vwx/uRUYJi/sJBBrZkmS8o5gYmTWHMgS+jaKqK1JgeVYOIb8T8blFastS4NNemfzIOZT+6hgUXK2GiUPCGM187+9hS4518x41YTaabgnvdilIIuFwNhxZK9xrkbvpOQIDlj",
        "DNgaY3bpyLE970jLuOn9ZGLFY1DlF7QHZPcVl1jjtxb9KJUkoLc+b9Z9Ar+jLsAEbOELWN3Vvr6jQAZyVgwKf3Kbc6cu+33EDJcxpv0WdD4w9Vl+IO3ivTFTmeETHOGhQQtwTilqaFiued3nDAnQ9hRKIMDwGJ7NO0+t/6KTgZSmcROjvj7FzvX+7YRdiJnt5NVOLlHhsji1o3AUEov8cNNig4po",
        "OvLP3mqMqMoW3KrA/X2fkUpXcwD1xkoITKeDFOEGTxnBOUqWK1h6uMq6MZM+A7TRo9xlWWm2mIONXCuBtfj9T8H0oUYFIF/wHQMuBR3soAlSYbvaaoU8nc6ijnSokBDxI0GkjxP+8YM6ZgIalMgakksAhqwJneRVG+yixMgJqD4zkjtU/utWJj91mF1iX0su1x2i50BDDxquJ7Yc1mJwoyGr2t7o",
        "bueSOo6MMQtdeLgf4Wz17hP55zl+CISNPoxQgk5Fkk6QC5ITUsEAy6kJRf/jZO/R5+E+octzdngansgzw0bnYyUqRKKG/iIQagawkLqFjh9wGXXaukR7nhNf18QfINSkrsFt0l9twsFBtYExnHh6cf2F6o8XAGjlMH0D++0VFe8Oi46zwIfiKz1TKkz6rmTyz3/lkDx3lHkMWlD8TU/XE+ZN93xg",
        "3qrEWo1YGaVNbbVp5g5ooOt3DkQL65EZHSaQcAy8dCw92Kq1/S/BTo3Ghq+78YWTh+7xGbqOigv59SLuxQiUj8LSPlTPJkJtZiYUNxYVHqWDouCzCIih4UBjcfCHOd/eUBwA9IulR1cuU4lBFn0XpZDZCdVnPDFiyhLrI+NvazTJdjQYvF1EirCYITz6edTpnfvPE2MyxEbi8R4FyhNIA2XEpwGw",
        "mPNUOgeff3OdQD5hhR5NHTPknuQyk9TQsJsitWObRYS/gzIdmXaoDXf6pbt0HGgIJY1ggdB8JkHq4w2ZwIvOFYKe58jgkcTQqSNvSZ6BWT0S4epnKoHYHcZWTMv4blXGEu9XHVvGF2sGetmWkDm9ZovafyifvW5GS4eOYv/wyFVWIITjci3HIkwtwpg1FsaojIof3nVfihZx9vxcACVlvJefSfyI",
        "sdjtRCrUeiJFf3kiTcRSRaWfSDLQzVzpAGaouhz6jnWteE3Px/gzVebvpq4/KlLcg1xj2iIp+0DY6cVto1U3YY5S7IEgX5bebfvJB56v6AtLmz75/ZyLV5wqmc7Dq0h93xEqAt7YCuCjbSfejgal/2IgVxaGLrISilS+jeqN7ySBzNEjxq4CTP8ArGH+VmqPZbhTylp60TEc0adISalnwtSZSrKL",
        "6MYpQR/PRb7Q+w0W55HsP1iIwK3z6me0If6ROHsPfIIsNoWIF7oR0OdFIcPAILKOyx7ShozEux1oJcXxX2Xk5PR1r0ps2Y1rbetcEOmYb3huWfpOv7UjQ0lClxq6jmGCUt/JDgwjxrd68Lao/vPIipeOdSK6Mq00Q97efDO95yMg8jyzEKg04TPKVf/XfejWbVoaVqi9YQ/f/O6wYcJunBo9z4CY",
        "kNk56vjJTjOtZKIe7IME6REYtnHzvVKJo2qnVRi+XeWXw6gmg95wPlKylOnsfC1rahaHQhoF/fH9ok3awK27SRjhdXZqfDohwC+yyfGrxjlu+b1IZLiSb6cJ7cm4k5Lw0pJs93oxPGnhw7iVvMoAkaZc1e2tXXuiUVYY4CIhSqqj8HRcxODGUSB5vznBmbURaH+XNiHaDoLRg9bGaL10dbEf+Jbc",
        "+7AxnxLcTmdl1R2uJ5z8iT6OWMkB8jdQRlnB+v4ZdFC0D4k4k3wqn1IPo8gq1O4GVnPcHQDycjOx7RwCUjSjKiBZu/JNiwZ6GBLUEdySq5JRJ+y7c9qMpHo2v7BQo0445epVibWLod7LBP1jl/ffh4Bl3xrrksRgTfqMtmKQeDaMXZey3vaierbZJpSI8EjC5RYrHPE9xV25m1Sza24qIAwZ5v09",
        "JZrZg/Mj2W/iWSMmeE2qxt5+vcAwNFkYEiEPTUiddJgclaxmX77Dm069Rb4HH5zC230w7kmoqBRcOBjgysuADvkLykKzQISnmGXAd4tj8rIVtD6wdtJSiWq5GN2kQsLnw8yzpR9NFCMLGSyJowLvJ4SwZAHIFrqIA1i83KEMmU3Snh9MuOfQVRyADQnLgA7wbOi6k5G7o8h+rP7TZVuCjuEM3+uW",
        "segxIeVprs5IgonaasT9UgdqTBdbnKfURN8vS5SeYWyq233SPPwSiKTNHFjP7DwEvTlJuwo1EETLHkfty6rCsNFd98jgdPm+T9dI92izWs2xiCi0VPlq6oOmIu6Ue/twCqdVfce5dSYRZAFFIadeg1CawT+hLC0zhYavNTDyt8Of1uAjAWCpuO38pryz/ca2iYUDx1ntC5C6UbgdDEyS8WR7RXqd",
        "L9dAnkAiFDHNB6rIZM979MJedaSMywDafoOYbRWf0QH2ex1HKHf5bTNi7TKXEvkycJXcwssrpdIg6p76eyHO8eb0FfmYBKY8j9MVS1Yz+Su5PonHADHkdk8sYi60Qf7QipfeX5nocUbUIxL7YUgS1fqxbAIJxCeXYzd6jYo9f2wazBrXuYB+TiakAwT1NO0pnf7JRPH6dy3508EhX6ZbTj3gbild",
        "bi767YVbynoDuXmnXbQwmtzZL5IDEgzL/EoHkrrVTZCtwcK6Jpj9OoP//Z0Q6Bzn7Jgl7sEuC/yvlfGI7hthNW1YhiYpxOAqsu4/g62aq0gQTQBRYlCo+b2jekRkp0i5sa8xA0S76TylSg3xUXVOV79QiQ2NptHrAHBOq6/e5sdJ6YKF0DrARQFccsTZNfnFgHplfJKnkAdsltEMUYk/eFPeDu/9",
        "sWxRQi5p2sROa3sXaTz/0RbrrTCdhQ7p77oY6PDmVtNJlbIVHYHNqB2IfiPdtDDba7TZCbrUyZCT0xaFqwz824ej8Iv1Tn9nbZrb4zby4Z9p6MAaXm5OQNoRPSZP1hP+fYo73iA6aC8XS6EY8w==",
    ].join("");
    const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

    // Lưu trữ mật mã hiện tại để mã hóa các thông tin nhập thêm (mood, note)
    let currentPasscode = "";
    let privateSessionToken = "";

    /* -------------------------------------------------------------
       THEMING / DARK MODE LOGIC
       ------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Đọc theme từ localStorage hoặc cài đặt hệ thống
    const savedTheme = localStorage.getItem('introvert_theme');
    let activeTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');

    // Áp dụng theme ban đầu
    applyTheme(activeTheme);

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        activeTheme = theme; // Đồng bộ biến theme toàn cục cho hệ thống hạt bụi
        if (themeToggleBtn) {
            // Nhãn thể hiện hành động để chuyển sang trạng thái đối lập
            themeToggleBtn.textContent = theme === 'dark' ? 'sáng' : 'tối';
            themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            localStorage.setItem('introvert_theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Tự động cập nhật theo theme của hệ thống nếu người dùng chưa ghi đè thủ công
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('introvert_theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });

    /* =============================================================
       HỆ THỐNG HẠT BỤI NỀN ĐỘNG (PARTICLES SYSTEM)
       ============================================================= */
    const particlesCanvas = document.getElementById('bg-particles');
    if (particlesCanvas) {
        const pCtx = particlesCanvas.getContext('2d');
        let particlesArray = [];
        let mousePos = { x: null, y: null, radius: 100 };

        function resizeParticlesCanvas() {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeParticlesCanvas);
        resizeParticlesCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * particlesCanvas.width;
                this.y = Math.random() * particlesCanvas.height;
                this.size = Math.random() * 2 + 0.5; // Kích thước hạt bụi rất nhỏ
                this.speedX = (Math.random() - 0.5) * 0.15 + 0.05; // Trôi chậm sang phải
                this.speedY = (Math.random() - 0.5) * 0.15 - 0.05; // Trôi chậm lên trên
                this.baseAlpha = Math.random() * 0.15 + 0.05;
                this.alpha = this.baseAlpha;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Trôi lại phía đối diện nếu tràn khung
                if (this.x < 0) this.x = particlesCanvas.width;
                if (this.x > particlesCanvas.width) this.x = 0;
                if (this.y < 0) this.y = particlesCanvas.height;
                if (this.y > particlesCanvas.height) this.y = 0;

                // Tương tác đẩy nhẹ khi có chuột qua
                if (mousePos.x !== null && mousePos.y !== null) {
                    let dx = this.x - mousePos.x;
                    let dy = this.y - mousePos.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mousePos.radius) {
                        let force = (mousePos.radius - dist) / mousePos.radius;
                        let dirX = dx / dist;
                        let dirY = dy / dist;
                        this.x += dirX * force * 0.8;
                        this.y += dirY * force * 0.8;
                    }
                }
            }
            draw() {
                const rgb = activeTheme === 'dark' ? '229, 224, 216' : '139, 115, 85';
                pCtx.fillStyle = `rgba(${rgb}, ${this.alpha})`;
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pCtx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            const density = Math.floor((particlesCanvas.width * particlesCanvas.height) / 32000);
            for (let i = 0; i < Math.min(density, 60); i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();

        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mousePos.x = null;
            mousePos.y = null;
        });

        function animateParticles() {
            pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            particlesArray.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* =============================================================
       HIỆU ỨNG GÕ CHỮ CHO TAGLINE (TYPEWRITER)
       ============================================================= */
    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) {
        const textToType = "thoughts, slowly.";
        let charIndex = 0;
        function typeTagline() {
            if (charIndex < textToType.length) {
                taglineEl.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeTagline, Math.random() * 80 + 50);
            }
        }
        setTimeout(typeTagline, 800);
    }

    /* =============================================================
       THANH ĐIỀU HƯỚNG SCROLL & ĐIỀU KHIỂN TRIGGER
       ============================================================= */
    const mainHeader = document.querySelector('.main-header');
    const scrollWritingsLink = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader?.classList.add('scrolled');
        } else {
            mainHeader?.classList.remove('scrolled');
        }
    });

    const navSanctuaryBtn = document.getElementById('nav-sanctuary-btn');
    const heroSanctuaryTrigger = document.getElementById('hero-sanctuary-trigger');
    const homeSanctuaryTrigger = document.getElementById('home-sanctuary-trigger');

    if (navSanctuaryBtn) {
        navSanctuaryBtn.addEventListener('click', openMoodDrawer);
    }
    if (heroSanctuaryTrigger) {
        heroSanctuaryTrigger.addEventListener('click', openMoodDrawer);
    }
    if (homeSanctuaryTrigger) {
        homeSanctuaryTrigger.addEventListener('click', openMoodDrawer);
    }

    // Xử lý giao diện khóa mật mã và giải mã
    const passwordOverlay = document.getElementById('password-overlay');
    const passwordForm = document.getElementById('password-form');
    const passwordField = document.getElementById('password-field');
    const errorMessage = document.getElementById('error-message');
    const passcodeUnlockBtn = document.getElementById('passcode-unlock-btn');
    const passcodeMessageInput = document.getElementById('passcode-message-input');
    const passcodeMessageSend = document.getElementById('passcode-message-send');
    const passcodeMessageStatus = document.getElementById('passcode-message-status');
    const publicMessageInput = document.getElementById('public-message-input');
    const publicMessageSend = document.getElementById('public-message-send');
    const publicMessageStatus = document.getElementById('public-message-status');
    const aboutLockForm = document.getElementById('about-lock-form');
    const aboutPasscodeDigits = Array.from(document.querySelectorAll('.about-passcode-digit'));
    const aboutLockStatus = document.getElementById('about-lock-status');
    const aboutPrivateLock = document.getElementById('about-private-lock');
    const aboutPrivateContent = document.getElementById('about-private-content');
    const introvertMessagesSection = document.getElementById('introvert-messages');
    const introvertMessagesList = document.getElementById('introvert-messages-list');
    const introvertMessagesStatus = document.getElementById('introvert-messages-status');
    let privateUnlocked = !USE_PASSWORD_LOCK;
    let pendingPrivateTarget = "";

    function setPrivateLockState(isLocked) {
        document.body.classList.toggle('private-locked', isLocked);
        document.body.classList.toggle('private-unlocked', !isLocked);
    }

    setPrivateLockState(USE_PASSWORD_LOCK);

    function isPrivateUnlocked() {
        return !USE_PASSWORD_LOCK || privateUnlocked;
    }

    function resetPasscodeInputs() {
        const passcodeDigits = document.querySelectorAll('.passcode-digit');
        passcodeDigits.forEach(inp => inp.value = "");
        return passcodeDigits;
    }

    function getEnteredPasscode() {
        return Array.from(document.querySelectorAll('.passcode-digit')).map(inp => inp.value).join('');
    }

    function submitEnteredPasscode() {
        const code = getEnteredPasscode();
        if (code.length !== 6) {
            if (errorMessage) {
                errorMessage.textContent = "vui lòng nhập đủ 6 số.";
                errorMessage.classList.add('is-visible');
            }
            return;
        }
        verifyAndLoad(code);
    }

    function showPasswordGate(target = "") {
        if (!passwordOverlay) return;
        pendingPrivateTarget = target;
        resetPasscodeInputs();
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.classList.remove('is-visible');
        }
        document.getElementById('mood-backdrop')?.classList.remove('is-active');
        document.getElementById('mood-drawer')?.classList.remove('is-active');
        passwordOverlay.classList.remove('is-unlocked');
        document.body.classList.add('lock-scroll');
        const passcodeDigits = document.querySelectorAll('.passcode-digit');
        if (passcodeDigits.length > 0) {
            setTimeout(() => passcodeDigits[0].focus(), 80);
        }
    }

    function scrollToPrivateTarget(target) {
        if (!target || target === "mood") return;
        const targetEl = document.getElementById(target);
        if (targetEl) {
            setTimeout(() => targetEl.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        }
    }

    function requestPrivateSection(target) {
        if (isPrivateUnlocked()) {
            scrollToPrivateTarget(target);
            return true;
        }
        showPasswordGate(target);
        return false;
    }

    function getPrivateGateTarget(trigger) {
        if (!trigger) return "";
        if (trigger.id === "nav-sanctuary-btn" || trigger.id === "hero-sanctuary-trigger" || trigger.id === "home-sanctuary-trigger" || trigger.id === "mood-trigger-btn") {
            return "mood";
        }
        const href = trigger.getAttribute?.("href") || "";
        return href.startsWith("#") ? href.slice(1) : "";
    }

    // --- CÁC HÀM GIẢI MÃ & MÃ HÓA CRYPTOGRAPHY (WEB CRYPTO API) ---
    async function deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const passwordKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            passwordKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async function encryptData(plaintext, password) {
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encoder.encode(plaintext)
        );

        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);

        let binary = '';
        const len = combined.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(combined[i]);
        }
        return btoa(binary);
    }

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function decryptData(ciphertextBase64, password) {
        const decoder = new TextDecoder();
        const binaryString = atob(ciphertextBase64);
        const combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            combined[i] = binaryString.charCodeAt(i);
        }

        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const ciphertext = combined.slice(28);

        const key = await deriveKey(password, salt);
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            ciphertext
        );
        return decoder.decode(decrypted);
    }

    function setAboutLockStatus(message = "") {
        if (!aboutLockStatus) return;
        aboutLockStatus.textContent = message;
        aboutLockStatus.classList.toggle('is-visible', Boolean(message));
    }

    function getAboutPasscode() {
        return aboutPasscodeDigits.map(input => input.value).join('');
    }

    function resetAboutPasscodeInputs() {
        aboutPasscodeDigits.forEach(input => {
            input.value = "";
        });
    }

    async function requestPrivateUnlock(passcode) {
        const response = await fetch(UNLOCK_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passcode })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success || !result.token) {
            throw new Error(result.error || "Unauthorized");
        }
        privateSessionToken = result.token;
        return result.token;
    }

    function getPrivateSheetHeaders(baseHeaders = {}) {
        return privateSessionToken
            ? { ...baseHeaders, Authorization: `Bearer ${privateSessionToken}` }
            : baseHeaders;
    }

    async function loadEncryptedPrivateAbout() {
        const response = await fetch(PRIVATE_ABOUT_ENCRYPTED_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error("Không tải được about.enc");
        }
        return (await response.text()).trim();
    }

    async function unlockPrivateAbout() {
        if (!aboutPrivateLock || !aboutPrivateContent) return;
        const passcode = getAboutPasscode();
        if (passcode.length !== 6) {
            setAboutLockStatus("vui lòng nhập đủ 6 số.");
            return;
        }

        try {
            await requestPrivateUnlock(passcode);
        } catch (err) {
            setAboutLockStatus("mật mã chưa chính xác.");
            resetAboutPasscodeInputs();
            aboutPasscodeDigits[0]?.focus();
            return;
        }

        try {
            const encryptedAbout = await loadEncryptedPrivateAbout();
            const decryptedAbout = await decryptData(encryptedAbout || ENCRYPTED_PRIVATE_ABOUT, passcode);
            aboutPrivateContent.innerHTML = decryptedAbout;
            aboutPrivateContent.hidden = false;
            aboutPrivateLock.hidden = true;
            currentPasscode = passcode;
            setAboutLockStatus("");
        } catch (err) {
            console.error("Không giải mã được phần about riêng tư:", err);
            setAboutLockStatus("chưa mở được phần này. hãy thử lại.");
            resetAboutPasscodeInputs();
            aboutPasscodeDigits[0]?.focus();
        }
    }

    function looksEncryptedBase64(value) {
        if (typeof value !== "string") return false;
        const trimmed = value.trim();
        if (trimmed.length < 40) return false;
        if (!/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed)) return false;
        try {
            atob(trimmed);
            return true;
        } catch (err) {
            return false;
        }
    }

    async function fetchSheetJson(type, label = "dữ liệu") {
        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === "") {
            throw new Error("Chưa cấu hình Google Apps Script URL.");
        }

        const separator = GOOGLE_APPS_SCRIPT_URL.includes('?') ? '&' : '?';
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}${separator}type=${encodeURIComponent(type)}`);
        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Không thể tải ${label} từ Sheet.`);
        }

        try {
            return JSON.parse(text);
        } catch (err) {
            throw new Error(`Proxy không trả JSON hợp lệ cho ${label}.`);
        }
    }

    function formatVietnamDateTime(value, options = {}) {
        if (!value) return "";

        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);

        const includeTime = options.includeTime !== false;
        const parts = new Intl.DateTimeFormat("vi-VN", {
            timeZone: VIETNAM_TIME_ZONE,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: includeTime ? "2-digit" : undefined,
            minute: includeTime ? "2-digit" : undefined,
            hour12: false
        }).formatToParts(date).reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});

        const dateText = `${parts.day}/${parts.month}/${parts.year}`;
        return includeTime ? `${dateText} ${parts.hour}:${parts.minute} GMT+7` : dateText;
    }

    function stripHTML(value = "") {
        return String(value)
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function makeExcerpt(value = "", fallback = "một lá thư đã sẵn sàng để mở.") {
        const text = stripHTML(value);
        if (!text) return fallback;
        return text.length > 140 ? `${text.slice(0, 140).trim()}...` : text;
    }

    function parseVietnamUnlockDate(value) {
        const raw = String(value || "").trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            return new Date(`${raw}T00:00:00+07:00`);
        }
        return new Date(raw);
    }

    async function loadLocalArticles(passcode) {
        const response = await fetch('writings.enc');
        if (!response.ok) throw new Error('Không thấy file writings.enc');

        const encryptedText = await response.text();
        const decryptedText = await decryptData(encryptedText, passcode);
        return JSON.parse(decryptedText);
    }

    async function loadSheetArticles(passcode) {
        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === "") return [];

        const encryptedRows = await fetchSheetJson("articles", "bài viết");
        const articles = [];

        for (const row of encryptedRows) {
            if (!row || !row.title || !row.content || !row.preview) continue;

            const isFutureLetter = row.preview && row.preview.startsWith("future_letter:");
            let isLocked = false;
            let unlockDateStr = "";

            if (isFutureLetter) {
                unlockDateStr = row.preview.substring("future_letter:".length);
                const unlockDate = parseVietnamUnlockDate(unlockDateStr);
                if (new Date() < unlockDate) {
                    isLocked = true;
                }
            }

            try {
                let decTitle = "thư tương lai";
                let decContent = "";
                let decPreview = row.preview;

                if (!isLocked) {
                    decTitle = await decryptData(row.title, passcode);
                    decContent = await decryptData(row.content, passcode);
                    decPreview = isFutureLetter
                        ? makeExcerpt(decContent, "lá thư tương lai đã đến ngày mở.")
                        : await decryptData(row.preview, passcode);
                } else if (isFutureLetter) {
                    decPreview = `được niêm phong đến ${formatVietnamDateTime(unlockDateStr, { includeTime: false })}.`;
                }

                articles.push({
                    date: row.date,
                    title: decTitle,
                    preview: decPreview,
                    content: decContent,
                    unlockDate: unlockDateStr,
                    isLocked,
                    type: isFutureLetter ? "future_letter" : "article"
                });
            } catch (e) {
                console.error("Lỗi giải mã bài viết trên Sheet:", e);
            }
        }

        return articles;
    }

    // Hàm xử lý xác thực và giải mã (định nghĩa ở cấp cao hơn để dùng được ở tab Capsule)
    async function verifyAndLoad(passcode) {
        if (errorMessage) {
            errorMessage.textContent = "đang giải mã không gian...";
            errorMessage.classList.add('is-visible');
        }

        try {
            await requestPrivateUnlock(passcode);
            let articles = [];
            try {
                articles = await loadLocalArticles(passcode);
            } catch (localErr) {
                throw localErr;
            }

            try {
                const sheetArticles = await loadSheetArticles(passcode);
                if (sheetArticles.length > 0) {
                    articles = sheetArticles;
                }
            } catch (sheetErr) {
                console.error("Lỗi tải Sheet, dùng dữ liệu cục bộ:", sheetErr);
            }

            // Tải thêm thư tương lai cục bộ (nếu có)
            try {
                const encryptedLocalLetters = JSON.parse(localStorage.getItem('introvert_future_letters') || '[]');
                for (const row of encryptedLocalLetters) {
                    try {
                        const unlockDate = parseVietnamUnlockDate(row.unlockDate);
                        const isLocked = new Date() < unlockDate;

                        let title = "thư tương lai";
                        let content = "";
                        let preview = `được niêm phong đến ${formatVietnamDateTime(row.unlockDate, { includeTime: false })}.`;

                        if (!isLocked) {
                            title = await decryptData(row.title, passcode);
                            content = await decryptData(row.content, passcode);
                            preview = makeExcerpt(content, "lá thư tương lai đã đến ngày mở.");
                        }

                        articles.push({
                            date: row.date,
                            title: title,
                            preview,
                            content: content,
                            unlockDate: row.unlockDate,
                            isLocked,
                            type: "future_letter"
                        });
                    } catch (e) {
                        console.error("Lỗi giải mã thư tương lai nội bộ:", e);
                    }
                }
            } catch (err) {
                console.error("Lỗi load thư tương lai nội bộ:", err);
            }

            // Render bài viết
            renderWritings(articles);

            // Lưu passcode để mã hóa ghi chép tiếp theo
            currentPasscode = passcode;
            privateUnlocked = true;
            setPrivateLockState(false);

            // Đồng bộ nhật ký cảm xúc từ Google Sheets
            await syncMoodsFromSheet(passcode);
            await loadIntrovertMessages();

            // Mở khóa giao diện
            document.body.classList.remove('lock-scroll');
            if (passwordOverlay) {
                passwordOverlay.classList.add('is-unlocked');
            }

            const target = pendingPrivateTarget;
            pendingPrivateTarget = "";
            if (target === "mood") {
                setTimeout(() => openMoodDrawer(), 80);
            } else {
                scrollToPrivateTarget(target || "introvert-messages");
            }
        } catch (err) {
            console.error("Lỗi giải mã:", err);
            if (errorMessage) {
                errorMessage.textContent = "mật mã chưa chính xác. hãy thử lại.";
                errorMessage.classList.add('is-visible');
            }

            const passwordBox = document.querySelector('.password-box');
            if (passwordBox) {
                passwordBox.classList.add('shake');
                setTimeout(() => passwordBox.classList.remove('shake'), 500);
            }

            const passcodeDigits = document.querySelectorAll('.passcode-digit');
            if (passcodeDigits.length > 0) {
                passcodeDigits.forEach(inp => inp.value = "");
                passcodeDigits[0].focus();
            }

            setTimeout(() => {
                if (errorMessage) {
                    errorMessage.classList.remove('is-visible');
                }
            }, 3000);
        }
    }

    if (USE_PASSWORD_LOCK) {
        if (passwordOverlay) {
            passwordOverlay.classList.add('is-unlocked');
        }

        const passcodeDigits = document.querySelectorAll('.passcode-digit');

        if (passwordForm) {
            passwordForm.addEventListener('submit', (event) => {
                event.preventDefault();
                submitEnteredPasscode();
            });
        }

        if (passcodeUnlockBtn) {
            passcodeUnlockBtn.addEventListener('click', submitEnteredPasscode);
        }

        if (passcodeDigits.length > 0) {
            // Gắn các sự kiện chuyển tiếp tự động cho ô nhập số
            passcodeDigits.forEach((input, index) => {
                // Khi người dùng gõ
                input.addEventListener('input', () => {
                    // Chỉ cho phép ký tự số
                    input.value = input.value.replace(/[^0-9]/g, '');

                    // Tự động chuyển tiếp sang ô tiếp theo
                    if (input.value && index < passcodeDigits.length - 1) {
                        passcodeDigits[index + 1].focus();
                    }

                    // Kiểm tra xem đã gõ đủ cả 6 ô chưa
                    const code = getEnteredPasscode();
                    if (code.length === 6) {
                        verifyAndLoad(code);
                    }
                });

                // Khi người dùng nhấn Backspace
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace') {
                        // Nếu ô hiện tại rỗng, lùi về ô trước đó và xóa giá trị
                        if (!input.value && index > 0) {
                            passcodeDigits[index - 1].focus();
                            passcodeDigits[index - 1].value = '';
                        }
                    }
                });

                // Hỗ trợ paste trực tiếp chuỗi mật mã 6 số.
                input.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const pastedData = (e.clipboardData || window.clipboardData).getData('text').trim();
                    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
                        passcodeDigits.forEach((inp, idx) => {
                            inp.value = pastedData[idx];
                        });
                        verifyAndLoad(pastedData);
                    }
                });
            });
        }
    } else {
        // Nếu không dùng khóa, xóa overlay khỏi DOM
        if (passwordOverlay) {
            passwordOverlay.remove();
        }
        // Load bài viết không dùng mật mã
        verifyAndLoad("");
    }

    [scrollWritingsLink].forEach(link => {
        if (!link) return;
        link.addEventListener('click', (event) => {
            const href = link.getAttribute("href") || "";
            if (!href.startsWith("#")) return;
            const targetEl = document.querySelector(href);
            if (!targetEl) return;
            event.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.addEventListener('click', (event) => {
        if (isPrivateUnlocked()) return;
        const trigger = event.target.closest('a[href="#introvert-messages"], #nav-sanctuary-btn, #hero-sanctuary-trigger, #home-sanctuary-trigger, #mood-trigger-btn');
        if (!trigger) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        showPasswordGate(getPrivateGateTarget(trigger));
    }, true);

    function guardPrivateHash() {
        if (!USE_PASSWORD_LOCK || isPrivateUnlocked()) return;
        const targetMap = {
            "#introvert-messages": "introvert-messages",
            "#sanctuary": "mood"
        };
        const target = targetMap[window.location.hash];
        if (!target) return;

        history.replaceState(null, "", window.location.pathname + window.location.search);
        showPasswordGate(target);
    }

    guardPrivateHash();
    window.addEventListener('hashchange', guardPrivateHash);

    if (aboutLockForm && aboutPasscodeDigits.length > 0) {
        aboutLockForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await unlockPrivateAbout();
        });

        aboutPasscodeDigits.forEach((input, index) => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
                setAboutLockStatus("");
                if (input.value && index < aboutPasscodeDigits.length - 1) {
                    aboutPasscodeDigits[index + 1].focus();
                }
                if (getAboutPasscode().length === 6) {
                    unlockPrivateAbout();
                }
            });

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Backspace' && !input.value && index > 0) {
                    aboutPasscodeDigits[index - 1].focus();
                    aboutPasscodeDigits[index - 1].value = '';
                }
            });

            input.addEventListener('paste', (event) => {
                event.preventDefault();
                const pasted = (event.clipboardData || window.clipboardData).getData('text').trim();
                if (!/^\d{6}$/.test(pasted)) return;
                aboutPasscodeDigits.forEach((digit, digitIndex) => {
                    digit.value = pasted[digitIndex];
                });
                unlockPrivateAbout();
            });
        });
    }

    async function sendIntrovertMessage(inputEl, buttonEl, statusEl) {
        if (!inputEl || !buttonEl) return;
        const message = inputEl.value.trim();

        if (!message) {
            if (statusEl) statusEl.textContent = "hãy viết một lời nhắn.";
            inputEl.focus();
            return;
        }

        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === "") {
            if (statusEl) statusEl.textContent = "chưa cấu hình sheet.";
            return;
        }

        buttonEl.disabled = true;
        if (statusEl) statusEl.textContent = "đang gửi...";

        try {
            await fetchSheetJson("messages", "lời nhắn");
            await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: "message",
                    date: getLocalDateString(),
                    message,
                    createdAt: new Date().toISOString(),
                    source: "index"
                })
            });
            inputEl.value = "";
            if (statusEl) statusEl.textContent = "đã gửi.";
        } catch (err) {
            console.error("Lỗi gửi lời nhắn:", err);
            if (statusEl) statusEl.textContent = "chưa gửi được.";
        } finally {
            setTimeout(() => {
                buttonEl.disabled = false;
            }, 600);
        }
    }

    if (passcodeMessageSend && passcodeMessageInput) {
        passcodeMessageSend.addEventListener('click', () => {
            sendIntrovertMessage(passcodeMessageInput, passcodeMessageSend, passcodeMessageStatus);
        });
    }

    if (publicMessageSend && publicMessageInput) {
        publicMessageSend.addEventListener('click', () => {
            sendIntrovertMessage(publicMessageInput, publicMessageSend, publicMessageStatus);
        });
    }

    async function loadIntrovertMessages() {
        if (!introvertMessagesSection || !introvertMessagesList) return;

        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === "") {
            introvertMessagesSection.hidden = true;
            return;
        }

        try {
            if (introvertMessagesStatus) introvertMessagesStatus.textContent = "đang tải lời nhắn...";
            const messages = await fetchSheetJson("messages", "lời nhắn");
            const sortedMessages = Array.isArray(messages)
                ? messages.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
                : [];

            if (sortedMessages.length === 0) {
                introvertMessagesSection.hidden = true;
                return;
            }

            introvertMessagesList.innerHTML = sortedMessages.map(item => {
                const date = item.displayDate || formatVietnamDateTime(item.createdAt || item.date);
                const message = escapeHTML(String(item.message || ""));
                return `
                    <article class="introvert-message-item">
                        <time class="introvert-message-date">${escapeHTML(date)}</time>
                        <p class="introvert-message-text">${message}</p>
                    </article>
                `;
            }).join("");

            introvertMessagesSection.hidden = false;
            introvertMessagesSection.classList.add('is-visible');
            if (introvertMessagesStatus) introvertMessagesStatus.textContent = "";
        } catch (err) {
            console.error("Lỗi tải lời nhắn:", err);
            introvertMessagesSection.hidden = false;
            if (introvertMessagesStatus) introvertMessagesStatus.textContent = "chưa tải được lời nhắn.";
        }
    }

    /* -------------------------------------------------------------
       1. Fade-in on Scroll (Intersection Observer)
       ------------------------------------------------------------- */
    const fadeSections = document.querySelectorAll('.fade-in-section');

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeSections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        fadeSections.forEach(section => {
            section.classList.add('is-visible');
        });
    }

    /* -------------------------------------------------------------
       2. Writings Accordion (Sử dụng Event Delegation cho động & tĩnh)
       ------------------------------------------------------------- */
    const writingsList = document.querySelector('.writings-list');

    if (writingsList) {
        // Event click handling
        writingsList.addEventListener('click', (e) => {
            const btn = e.target.closest('.read-more-btn');
            const title = e.target.closest('.writing-title');

            if (!btn && !title) return;

            const item = e.target.closest('.writing-item');
            if (!item) return;
            if (item.classList.contains('is-future-locked')) return;

            e.preventDefault();
            const isExpanded = item.classList.contains('is-expanded');
            const itemBtn = item.querySelector('.read-more-btn');

            // Thu gọn tất cả các bài viết khác
            const allItems = writingsList.querySelectorAll('.writing-item');
            allItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('is-expanded')) {
                    otherItem.classList.remove('is-expanded');
                    const otherBtn = otherItem.querySelector('.read-more-btn');
                    if (otherBtn) {
                        otherBtn.innerText = 'Đọc thêm';
                        otherBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            // Toggle trạng thái của bài viết hiện tại
            if (isExpanded) {
                item.classList.remove('is-expanded');
                if (itemBtn) {
                    itemBtn.innerText = 'Đọc thêm';
                    itemBtn.setAttribute('aria-expanded', 'false');
                }
            } else {
                item.classList.add('is-expanded');
                if (itemBtn) {
                    itemBtn.innerText = 'Thu gọn';
                    itemBtn.setAttribute('aria-expanded', 'true');
                }

                // Cuộn mượt để căn mắt đọc của người dùng
                setTimeout(() => {
                    const headerOffset = 60;
                    const elementPosition = item.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });

        // Hỗ trợ accessibility qua bàn phím (Enter / Space)
        writingsList.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const title = e.target.closest('.writing-title');
                if (title) {
                    e.preventDefault();
                    title.click();
                }
            }
        });
    }

    /* -------------------------------------------------------------
       3. Bài viết & Giải mã bài viết
       ------------------------------------------------------------- */

    function renderWritings(articles) {
        if (!writingsList) return;

        writingsList.innerHTML = '';

        articles.forEach(art => {
            const item = document.createElement('article');
            const isLockedLetter = art.type === "future_letter" && art.isLocked;
            item.className = `writing-item${art.type === "future_letter" ? " writing-item-future" : ""}${isLockedLetter ? " is-future-locked" : ""}`;

            // Kiểm tra xem nội dung đã chứa HTML định dạng chưa (được tạo từ Quill Editor)
            const contentSource = String(art.content || "");
            let contentHTML = contentSource;
            if (contentSource && !contentSource.includes('<p>') && !contentSource.includes('</p>') && !contentSource.includes('<br>')) {
                // Nếu là văn bản thuần thì mới chuyển đổi xuống dòng (\n) thành thẻ <p>
                contentHTML = contentSource.split('\n')
                    .map(p => p.trim())
                    .filter(p => p.length > 0)
                    .map(p => `<p>${escapeHTML(p)}</p>`)
                    .join('');
            }
            const readButtonHTML = isLockedLetter
                ? ""
                : '<button class="read-more-btn" aria-expanded="false">Đọc thêm</button>';

            item.innerHTML = `
                <div class="writing-header">
                    <span class="writing-date">${art.displayDate || formatVietnamDateTime(art.date)}</span>
                    <h3 class="writing-title" tabindex="0" role="button" aria-label="Mở rộng bài viết: ${escapeHTML(art.title)}">${escapeHTML(art.title)}</h3>
                </div>
                <p class="writing-preview">${escapeHTML(art.preview)}</p>
                <div class="writing-content">
                    ${contentHTML}
                </div>
                ${readButtonHTML}
            `;
            writingsList.appendChild(item);
        });
    }

    /* -------------------------------------------------------------
       4. Copy Email to Clipboard
       ------------------------------------------------------------- */
    const emailButton = document.getElementById('email-button');

    if (emailButton) {
        emailButton.addEventListener('click', async () => {
            const email = emailButton.getAttribute('data-email');
            const statusSpan = emailButton.querySelector('.copy-status');

            try {
                await navigator.clipboard.writeText(email);
                emailButton.classList.add('is-copied');
                statusSpan.textContent = 'đã chép';

                setTimeout(() => {
                    emailButton.classList.remove('is-copied');
                    statusSpan.textContent = 'sao chép';
                }, 2000);

            } catch (err) {
                console.error('Không thể sao chép email: ', err);
                const textarea = document.createElement('textarea');
                textarea.value = email;
                textarea.style.position = 'fixed';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    emailButton.classList.add('is-copied');
                    statusSpan.textContent = 'đã chép';
                    setTimeout(() => {
                        emailButton.classList.remove('is-copied');
                        statusSpan.textContent = 'sao chép';
                    }, 2000);
                } catch (fallbackErr) {
                    statusSpan.textContent = 'hãy sao chép';
                }
                document.body.removeChild(textarea);
            }
        });
    }

    /* -------------------------------------------------------------
       5. Mood Journal & Ambient Soundscapes Logic
       ------------------------------------------------------------- */
    const moodBackdrop = document.getElementById('mood-backdrop');
    const moodDrawer = document.getElementById('mood-drawer');
    const moodTriggerBtn = document.getElementById('mood-trigger-btn');
    const moodCloseBtn = document.getElementById('mood-close-btn');
    const moodStateBtns = document.querySelectorAll('.mood-state-btn');
    const moodNoteInput = document.getElementById('mood-note-input');
    const moodCalendarStrip = document.getElementById('mood-calendar-strip');
    const journalStreakCount = document.getElementById('journal-streak-count');
    const journalEntryCount = document.getElementById('journal-entry-count');
    const journalWordCount = document.getElementById('journal-word-count');
    const journalTemplateBtns = document.querySelectorAll('.journal-template-btn');
    const memoryJarInput = document.getElementById('memory-jar-input');
    const memoryJarSave = document.getElementById('memory-jar-save');
    const memoryJarList = document.getElementById('memory-jar-list');

    // Tạo chấm báo hiệu lưu dữ liệu
    let saveStatusDot;
    const drawerHeader = document.querySelector('.mood-drawer-header');
    if (drawerHeader) {
        saveStatusDot = document.createElement('span');
        saveStatusDot.className = 'save-status-dot';
        drawerHeader.appendChild(saveStatusDot);
    }

    function getLocalDateString(date = new Date()) {
        const parsedDate = date instanceof Date ? date : new Date(date);
        const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: VIETNAM_TIME_ZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(safeDate).reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});

        return `${parts.year}-${parts.month}-${parts.day}`;
    }

    function normalizeMoodDateKey(value) {
        const raw = String(value || "").trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

        const vietnamDateMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        if (vietnamDateMatch) {
            return `${vietnamDateMatch[3]}-${vietnamDateMatch[2]}-${vietnamDateMatch[1]}`;
        }

        const isoDateMatch = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
        const parsedDate = new Date(raw);
        if (!Number.isNaN(parsedDate.getTime())) return getLocalDateString(parsedDate);
        if (isoDateMatch) return `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}`;

        return getLocalDateString();
    }

    function normalizeMoodLogs(rawLogs) {
        const normalized = {};
        Object.entries(rawLogs || {}).forEach(([dateKey, log]) => {
            if (!log || (!log.emoji && !log.note)) return;
            normalized[normalizeMoodDateKey(dateKey)] = {
                emoji: log.emoji || "",
                note: log.note || ""
            };
        });
        return normalized;
    }

    function formatJournalDate(value) {
        const dateKey = normalizeMoodDateKey(value);
        const dateParts = dateKey.split('-');
        return dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : String(value || "");
    }

    function getMoodLogs() {
        try {
            return normalizeMoodLogs(JSON.parse(localStorage.getItem('introvert_mood_log')) || {});
        } catch (e) {
            return {};
        }
    }

    function countWords(text = "") {
        const matches = String(text).trim().match(/\S+/g);
        return matches ? matches.length : 0;
    }

    function calculateJournalStreak(logs) {
        let streak = 0;
        const cursor = new Date();
        while (true) {
            const key = getLocalDateString(cursor);
            const log = logs[key];
            if (!log || (!log.emoji && !String(log.note || "").trim())) break;
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
    }

    function updateJournalStats() {
        const logs = getMoodLogs();
        const entries = Object.values(logs).filter(log => log && (log.emoji || String(log.note || "").trim()));
        const todayLog = logs[getLocalDateString()] || {};

        if (journalStreakCount) journalStreakCount.textContent = String(calculateJournalStreak(logs));
        if (journalEntryCount) journalEntryCount.textContent = String(entries.length);
        if (journalWordCount) journalWordCount.textContent = String(countWords(todayLog.note || ""));
    }

    function saveMoodLog(dateStr, state, note) {
        const logs = getMoodLogs();
        if (!state && !note) {
            delete logs[dateStr];
        } else {
            // Lưu dưới dạng 'emoji' để tương thích ngược cấu trúc cũ
            logs[dateStr] = { emoji: state || "", note: note || "" };
        }
        localStorage.setItem('introvert_mood_log', JSON.stringify(logs));
        updateJournalStats();

        // Tự động đồng bộ lên Google Sheet nếu có cấu hình
        triggerSyncMoodToSheet(dateStr, state, note);
    }

    function getMemoryJarItems() {
        try {
            return JSON.parse(localStorage.getItem('introvert_memory_jar')) || [];
        } catch (e) {
            return [];
        }
    }

    function setMemoryJarItems(items) {
        localStorage.setItem('introvert_memory_jar', JSON.stringify(items.slice(0, 40)));
    }

    function renderMemoryJar() {
        if (!memoryJarList) return;
        const items = getMemoryJarItems();
        if (items.length === 0) {
            memoryJarList.innerHTML = `<p class="memory-jar-empty">lọ ký ức đang trống.</p>`;
            return;
        }

        memoryJarList.innerHTML = items.slice(0, 5).map(item => `
            <article class="memory-jar-item" data-id="${escapeHTML(item.id)}">
                <span class="memory-jar-date">${escapeHTML(formatJournalDate(item.date))}</span>
                <p class="memory-jar-text">${escapeHTML(item.text)}</p>
                <div class="memory-jar-actions">
                    <button type="button" class="memory-jar-use" data-id="${escapeHTML(item.id)}">đưa</button>
                    <button type="button" class="memory-jar-delete" data-id="${escapeHTML(item.id)}">xóa</button>
                </div>
            </article>
        `).join("");
    }

    function appendToMoodNote(text) {
        if (!moodNoteInput || !text) return;
        moodNoteInput.value = moodNoteInput.value.trim()
            ? `${moodNoteInput.value.trim()}\n\n${text}`
            : text;
        moodNoteInput.dispatchEvent(new Event('input'));
        moodNoteInput.focus();
    }

    function saveMemoryJarItem() {
        if (!memoryJarInput) return;
        const text = memoryJarInput.value.trim();
        if (!text) {
            memoryJarInput.focus();
            return;
        }

        const items = getMemoryJarItems();
        items.unshift({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            date: getLocalDateString(),
            text
        });
        setMemoryJarItems(items);
        memoryJarInput.value = "";
        renderMemoryJar();
    }

    const JOURNAL_TEMPLATES = {
        checkin: "check-in\ncơ thể:\ntâm trí:\nđiều đang cần:",
        gratitude: "ba điều biết ơn\n1.\n2.\n3.",
        release: "điều cần buông xuống\nhôm nay tôi buông:\nvì:",
        tomorrow: "gửi ngày mai\nngày mai tôi muốn:\nmột việc nhỏ đủ làm:",
        dream: "giấc mơ / hình ảnh còn sót lại\nkhung cảnh:\ncảm giác:\ný nghĩa có thể là:"
    };

    journalTemplateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-template');
            appendToMoodNote(JOURNAL_TEMPLATES[key] || "");
        });
    });

    memoryJarSave?.addEventListener('click', saveMemoryJarItem);
    memoryJarInput?.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            saveMemoryJarItem();
        }
    });

    memoryJarList?.addEventListener('click', (event) => {
        const useBtn = event.target.closest('.memory-jar-use');
        const deleteBtn = event.target.closest('.memory-jar-delete');
        const btn = useBtn || deleteBtn;
        if (!btn) return;

        const id = btn.getAttribute('data-id');
        const items = getMemoryJarItems();
        const item = items.find(entry => entry.id === id);
        if (!item) return;

        if (useBtn) {
            appendToMoodNote(item.text);
            return;
        }

        setMemoryJarItems(items.filter(entry => entry.id !== id));
        renderMemoryJar();
    });

    function updateSaveStatus(status) {
        if (!saveStatusDot) return;

        if (status === "saving") {
            saveStatusDot.className = 'save-status-dot saving';
        } else if (status === "saved") {
            saveStatusDot.className = 'save-status-dot saved';
            setTimeout(() => {
                if (saveStatusDot.className === 'save-status-dot saved') {
                    saveStatusDot.className = 'save-status-dot';
                }
            }, 1500);
        } else {
            saveStatusDot.className = 'save-status-dot';
        }
    }

    let syncTimeout = null;
    function triggerSyncMoodToSheet(dateStr, state, note) {
        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === "" || !currentPasscode) return;

        updateSaveStatus("saving");

        if (syncTimeout) clearTimeout(syncTimeout);

        syncTimeout = setTimeout(async () => {
            try {
                const encState = await encryptData(state, currentPasscode);
                const encNote = await encryptData(note, currentPasscode);

                const payload = {
                    type: "mood",
                    date: dateStr,
                    emoji: encState, // cột emoji trên sheet sẽ chứa trạng thái text mã hóa
                    note: encNote
                };

                await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    headers: getPrivateSheetHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(payload)
                });

                updateSaveStatus("saved");
            } catch (err) {
                console.error("Lỗi đồng bộ mood lên Google Sheet:", err);
                updateSaveStatus("error");
            }
        }, 1500);
    }

    async function syncMoodsFromSheet(passcode) {
        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === "") return;

        try {
            const encryptedLogs = await fetchSheetJson("moods", "moods");
            const logs = getMoodLogs();

            for (const log of encryptedLogs) {
                if (!log || !log.date || !looksEncryptedBase64(log.emoji) || !looksEncryptedBase64(log.note)) {
                    continue;
                }

                try {
                    const decState = await decryptData(log.emoji, passcode);
                    const decNote = await decryptData(log.note, passcode);
                    logs[normalizeMoodDateKey(log.date)] = { emoji: decState, note: decNote };
                } catch (e) {
                    console.error("Lỗi giải mã dòng mood:", e);
                }
            }
            localStorage.setItem('introvert_mood_log', JSON.stringify(logs));
            renderCalendarStrip();
            updateJournalStats();
        } catch (e) {
            console.error("Lỗi đồng bộ moods từ sheet:", e);
        }
    }

    function renderCalendarStrip() {
        if (!moodCalendarStrip) return;

        const logs = getMoodLogs();
        const weekdays = ["cn", "t2", "t3", "t4", "t5", "t6", "t7"];
        let html = "";

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = getLocalDateString(d);
            const dayLabel = weekdays[d.getDay()];

            const log = logs[dateStr];
            const state = log && log.emoji ? log.emoji : "·";
            const note = log && log.note ? log.note : "";

            const tooltip = log
                ? `${dayLabel}: ${state}${note ? ` - "${note}"` : ''}`
                : `${dayLabel}: trống`;

            // Độ đục mờ dần về quá khứ (opacity giảm từ 1.0 về 0.4)
            const opacity = (1 - (i * 0.1)).toFixed(2);

            html += `
                <div class="mood-calendar-day" style="opacity: ${opacity}" title="${tooltip}">
                    <span class="mood-calendar-label">${dayLabel}</span>
                    <span class="mood-calendar-emoji">${state}</span>
                </div>
            `;
        }
        moodCalendarStrip.innerHTML = html;
    }

    function openMoodDrawer() {
        if (!moodDrawer || !moodBackdrop) return;

        if (!isPrivateUnlocked()) {
            showPasswordGate("mood");
            return;
        }

        const logs = getMoodLogs();
        const todayStr = getLocalDateString();
        const todayLog = logs[todayStr];

        moodStateBtns.forEach(btn => {
            btn.classList.remove('is-selected');
            if (todayLog && btn.getAttribute('data-state') === todayLog.emoji) {
                btn.classList.add('is-selected');
            }
        });

        if (moodNoteInput) {
            moodNoteInput.value = todayLog ? todayLog.note : "";
        }

        renderCalendarStrip();
        renderJournalHistory(); // Kết xuất lịch sử nhật ký nâng cao
        updateJournalStats();
        renderMemoryJar();

        moodBackdrop.classList.add('is-active');
        moodDrawer.classList.add('is-active');
        document.body.classList.add('lock-scroll');
    }

    function closeMoodDrawer() {
        if (!moodDrawer || !moodBackdrop) return;

        moodBackdrop.classList.remove('is-active');
        moodDrawer.classList.remove('is-active');

        if (isPrivateUnlocked()) {
            document.body.classList.remove('lock-scroll');
        }
    }

    if (moodTriggerBtn) {
        moodTriggerBtn.addEventListener('click', openMoodDrawer);
    }

    if (moodCloseBtn) {
        moodCloseBtn.addEventListener('click', closeMoodDrawer);
    }

    if (moodBackdrop) {
        moodBackdrop.addEventListener('click', closeMoodDrawer);
    }

    moodStateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodStateBtns.forEach(b => b.classList.remove('is-selected'));
            btn.classList.add('is-selected');

            const state = btn.getAttribute('data-state');
            const note = moodNoteInput ? moodNoteInput.value : "";
            const todayStr = getLocalDateString();

            saveMoodLog(todayStr, state, note);
            renderCalendarStrip();
        });
    });

    if (moodNoteInput) {
        moodNoteInput.addEventListener('input', () => {
            const selectedBtn = document.querySelector('.mood-state-btn.is-selected');
            const state = selectedBtn ? selectedBtn.getAttribute('data-state') : '';
            const note = moodNoteInput.value;
            const todayStr = getLocalDateString();

            saveMoodLog(todayStr, state, note);
            renderCalendarStrip();
        });
    }

    /* -------------------------------------------------------------
       Ritual Tools: prompts, breath, and note handoff
       ------------------------------------------------------------- */
    const ritualPromptBtn = document.getElementById('ritual-prompt-btn');
    const ritualBreatheBtn = document.getElementById('ritual-breathe-btn');
    const ritualNoteBtn = document.getElementById('ritual-note-btn');
    const ritualOutput = document.getElementById('ritual-output');
    const RITUAL_PROMPTS = [
        "hãy viết về một âm thanh nhỏ mà hôm nay bạn bỏ sót.",
        "nếu nỗi mệt có màu, nó đang nghiêng về sắc nào?",
        "một điều bạn không muốn giải thích với ai là gì?",
        "hãy đặt tên cho khoảng im lặng giữa hai lần thở.",
        "có điều gì trong bạn đang cần được để yên?",
        "viết một câu cho phiên bản bạn của ba tháng sau.",
        "nơi nào trong ký ức vẫn còn bật đèn?",
        "nếu hôm nay là một căn phòng, cửa sổ sẽ nhìn ra đâu?"
    ];
    let breathTimer = null;
    let breathStep = 0;
    const BREATH_PHASES = [
        "hít vào 4 nhịp.",
        "giữ lại 4 nhịp.",
        "thở ra 6 nhịp.",
        "nghỉ một chút."
    ];

    function setRitualText(text) {
        if (ritualOutput) ritualOutput.textContent = text;
    }

    ritualPromptBtn?.addEventListener('click', () => {
        if (breathTimer) {
            clearInterval(breathTimer);
            breathTimer = null;
            if (ritualBreatheBtn) ritualBreatheBtn.textContent = "nhịp thở";
        }
        const prompt = RITUAL_PROMPTS[Math.floor(Math.random() * RITUAL_PROMPTS.length)];
        setRitualText(prompt);
    });

    ritualBreatheBtn?.addEventListener('click', () => {
        if (breathTimer) {
            clearInterval(breathTimer);
            breathTimer = null;
            ritualBreatheBtn.textContent = "nhịp thở";
            setRitualText("đã dừng nhịp thở.");
            return;
        }

        breathStep = 0;
        ritualBreatheBtn.textContent = "dừng";
        setRitualText(BREATH_PHASES[breathStep]);
        breathTimer = setInterval(() => {
            breathStep += 1;
            if (breathStep >= 12) {
                clearInterval(breathTimer);
                breathTimer = null;
                ritualBreatheBtn.textContent = "nhịp thở";
                setRitualText("nhịp thở khép lại. hãy giữ phần yên vừa tìm thấy.");
                return;
            }
            setRitualText(BREATH_PHASES[breathStep % BREATH_PHASES.length]);
        }, 4200);
    });

    ritualNoteBtn?.addEventListener('click', () => {
        if (!moodNoteInput || !ritualOutput) return;
        const signal = ritualOutput.textContent.trim();
        if (!signal) return;
        moodNoteInput.value = moodNoteInput.value.trim()
            ? `${moodNoteInput.value.trim()}\n\n${signal}`
            : signal;
        moodNoteInput.dispatchEvent(new Event('input'));
        moodNoteInput.focus();
    });

    /* -------------------------------------------------------------
       6. Ambient Soundscapes & Multi-channel Mixer
       ------------------------------------------------------------- */
    const ambientPlayer = document.getElementById('ambient-player');
    const ambientToggle = document.getElementById('ambient-toggle');
    const ambientTrackBtns = document.querySelectorAll('.ambient-track-btn');
    const trackTitleEl = document.getElementById('ambient-track-title');

    const LOFI_PLAYLIST = [
        { title: "affection", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Affection.mp3" },
        { title: "again", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Again.mp3" },
        { title: "alone and lonely", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Alone%20and%20Lonely.mp3" },
        { title: "backpack city", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Backpack%20City.mp3" },
        { title: "beauty", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Beauty.mp3" },
        { title: "call me", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Call%20me.mp3" },
        { title: "controlla", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/controlla.mp3" },
        { title: "cream", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Cream.mp3" },
        { title: "daydreaming", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Daydreaming.mp3" },
        { title: "death bed", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Death%20Bed.mp3" },
        { title: "feblu", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Feblu.mp3" },
        { title: "fever dream", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/Fever%20Dream.mp3" },
        { title: "first heartbreak", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/First%20Heartbreak.mp3" },
        { title: "french inhale", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/French%20Inhale.mp3" },
        { title: "i'll keep you safe", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/I'll%20Keep%20You%20Safe.mp3" },
        { title: "i'm yours", url: "https://raw.githubusercontent.com/pramit-marattha/lofi-music-player-vanilla-javascript/master/sounds/songs/I'm%20Yours.mp3" }
    ];

    const rainAudio = new Audio("https://raw.githubusercontent.com/rafaelreis-hotmart/Ambient-Sounds-App/master/assets/sounds/rain.mp3");
    rainAudio.loop = true;
    const seaAudio = new Audio("https://raw.githubusercontent.com/rafaelreis-hotmart/Ambient-Sounds-App/master/assets/sounds/ocean.mp3");
    seaAudio.loop = true;
    const lofiAudio = new Audio();

    let shuffledLofiTracks = [];
    let currentLofiIndex = 0;

    function shuffleLofiTracks() {
        shuffledLofiTracks = [...LOFI_PLAYLIST];
        for (let i = shuffledLofiTracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledLofiTracks[i], shuffledLofiTracks[j]] = [shuffledLofiTracks[j], shuffledLofiTracks[i]];
        }
        currentLofiIndex = 0;
    }

    function playLofiTrack(index) {
        if (shuffledLofiTracks.length === 0) shuffleLofiTracks();
        const track = shuffledLofiTracks[index];
        lofiAudio.src = track.url;
        const vol = parseFloat(document.getElementById('mixer-lofi').value) / 100;
        lofiAudio.volume = vol;
        lofiAudio.play().then(() => updateFooterAmbientUI()).catch(err => console.log("Lofi error:", err));
    }

    lofiAudio.addEventListener('ended', () => {
        currentLofiIndex = (currentLofiIndex + 1) % shuffledLofiTracks.length;
        playLofiTrack(currentLofiIndex);
    });

    function playAmbientTrack(trackName) {
        if (!trackName || trackName === "none") {
            document.getElementById('mixer-rain').value = 0;
            document.getElementById('mixer-sea').value = 0;
            document.getElementById('mixer-lofi').value = 0;
            document.getElementById('mixer-val-rain').textContent = 'tắt';
            document.getElementById('mixer-val-sea').textContent = 'tắt';
            document.getElementById('mixer-val-lofi').textContent = 'tắt';
            rainAudio.volume = 0; rainAudio.pause();
            seaAudio.volume = 0; seaAudio.pause();
            lofiAudio.volume = 0; lofiAudio.pause();
            if (trackTitleEl) {
                trackTitleEl.classList.remove('is-visible');
                setTimeout(() => { if (!trackTitleEl.classList.contains('is-visible')) trackTitleEl.textContent = ""; }, 600);
            }
            return;
        }

        if (trackName === "rain") {
            document.getElementById('mixer-rain').value = 40;
            document.getElementById('mixer-val-rain').textContent = '40%';
            rainAudio.volume = 0.4; rainAudio.play().catch(e => console.log(e));
            document.getElementById('mixer-sea').value = 0;
            document.getElementById('mixer-val-sea').textContent = 'tắt';
            seaAudio.volume = 0; seaAudio.pause();
            document.getElementById('mixer-lofi').value = 0;
            document.getElementById('mixer-val-lofi').textContent = 'tắt';
            lofiAudio.volume = 0; lofiAudio.pause();
        } else if (trackName === "sea") {
            document.getElementById('mixer-sea').value = 40;
            document.getElementById('mixer-val-sea').textContent = '40%';
            seaAudio.volume = 0.4; seaAudio.play().catch(e => console.log(e));
            document.getElementById('mixer-rain').value = 0;
            document.getElementById('mixer-val-rain').textContent = 'tắt';
            rainAudio.volume = 0; rainAudio.pause();
            document.getElementById('mixer-lofi').value = 0;
            document.getElementById('mixer-val-lofi').textContent = 'tắt';
            lofiAudio.volume = 0; lofiAudio.pause();
        } else if (trackName === "lofi") {
            document.getElementById('mixer-lofi').value = 40;
            document.getElementById('mixer-val-lofi').textContent = '40%';
            lofiAudio.volume = 0.4;
            if (!lofiAudio.src) playLofiTrack(currentLofiIndex); else lofiAudio.play().catch(e => console.log(e));
            document.getElementById('mixer-rain').value = 0;
            document.getElementById('mixer-val-rain').textContent = 'tắt';
            rainAudio.volume = 0; rainAudio.pause();
            document.getElementById('mixer-sea').value = 0;
            document.getElementById('mixer-val-sea').textContent = 'tắt';
            seaAudio.volume = 0; seaAudio.pause();
        }
        updateFooterAmbientUI();
    }

    function updateFooterAmbientUI() {
        const rainVol = parseInt(document.getElementById('mixer-rain').value);
        const seaVol = parseInt(document.getElementById('mixer-sea').value);
        const lofiVol = parseInt(document.getElementById('mixer-lofi').value);
        ambientTrackBtns.forEach(btn => btn.classList.remove('active'));
        let activeCount = 0;
        if (rainVol > 0) activeCount++; if (seaVol > 0) activeCount++; if (lofiVol > 0) activeCount++;
        if (activeCount === 0) {
            const btn = document.querySelector('.ambient-track-btn[data-track="none"]');
            if (btn) btn.classList.add('active');
            if (trackTitleEl) {
                trackTitleEl.classList.remove('is-visible');
                setTimeout(() => { if (!trackTitleEl.classList.contains('is-visible')) trackTitleEl.textContent = ""; }, 600);
            }
        } else if (activeCount === 1) {
            if (rainVol > 0) {
                const btn = document.querySelector('.ambient-track-btn[data-track="rain"]');
                if (btn) btn.classList.add('active');
                if (trackTitleEl) { trackTitleEl.textContent = "đang phát: tiếng mưa rơi"; trackTitleEl.classList.add('is-visible'); }
            } else if (seaVol > 0) {
                const btn = document.querySelector('.ambient-track-btn[data-track="sea"]');
                if (btn) btn.classList.add('active');
                if (trackTitleEl) { trackTitleEl.textContent = "đang phát: tiếng sóng biển"; trackTitleEl.classList.add('is-visible'); }
            } else if (lofiVol > 0) {
                const btn = document.querySelector('.ambient-track-btn[data-track="lofi"]');
                if (btn) btn.classList.add('active');
                if (trackTitleEl) {
                    const track = shuffledLofiTracks[currentLofiIndex] || LOFI_PLAYLIST[0];
                    trackTitleEl.textContent = `đang phát: ${track.title.toLowerCase()}`;
                    trackTitleEl.classList.add('is-visible');
                }
            }
        } else {
            if (trackTitleEl) { trackTitleEl.textContent = "đang phát: hòa âm"; trackTitleEl.classList.add('is-visible'); }
        }
    }

    document.getElementById('mixer-rain').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('mixer-val-rain').textContent = val > 0 ? `${val}%` : 'tắt';
        rainAudio.volume = val / 100;
        if (val > 0 && rainAudio.paused) rainAudio.play().catch(err => console.log(err));
        else if (val === 0 && !rainAudio.paused) rainAudio.pause();
        updateFooterAmbientUI();
    });

    document.getElementById('mixer-sea').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('mixer-val-sea').textContent = val > 0 ? `${val}%` : 'tắt';
        seaAudio.volume = val / 100;
        if (val > 0 && seaAudio.paused) seaAudio.play().catch(err => console.log(err));
        else if (val === 0 && !seaAudio.paused) seaAudio.pause();
        updateFooterAmbientUI();
    });

    document.getElementById('mixer-lofi').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('mixer-val-lofi').textContent = val > 0 ? `${val}%` : 'tắt';
        lofiAudio.volume = val / 100;
        if (val > 0) { if (lofiAudio.paused) { if (!lofiAudio.src) playLofiTrack(currentLofiIndex); else lofiAudio.play().catch(err => console.log(err)); } }
        else if (val === 0 && !lofiAudio.paused) lofiAudio.pause();
        updateFooterAmbientUI();
    });

    if (ambientToggle && ambientPlayer) {
        ambientToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            ambientPlayer.classList.toggle('is-active');
        });
        document.addEventListener('click', (e) => { if (!ambientPlayer.contains(e.target)) ambientPlayer.classList.remove('is-active'); });
    }

    ambientTrackBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const track = btn.getAttribute('data-track');
            ambientTrackBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('introvert_ambient_track', track);
            playAmbientTrack(track);
        });
    });

    const savedTrack = localStorage.getItem('introvert_ambient_track') || 'none';
    const activeBtn = document.querySelector(`.ambient-track-btn[data-track="${savedTrack}"]`);
    if (activeBtn) {
        ambientTrackBtns.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    if (savedTrack !== 'none') {
        const startAutoplay = () => { playAmbientTrack(savedTrack); document.removeEventListener('click', startAutoplay); document.removeEventListener('keydown', startAutoplay); };
        document.addEventListener('click', startAutoplay);
        document.addEventListener('keydown', startAutoplay);
    }

    /* -------------------------------------------------------------
       7. Hệ thống Tab & Gợi ý viết lách hàng ngày (Quiet Prompts)
       ------------------------------------------------------------- */
    const tabBtns = document.querySelectorAll('.mood-tab-btn');
    const tabContents = document.querySelectorAll('.mood-tab-content');
    const QUIET_PROMPTS = ["âm thanh nào hôm nay làm bạn dừng lại?", "một điều nhỏ bé bạn muốn giữ riêng cho mình?", "một khoảnh khắc bình yên nhất trong ngày?", "hôm nay, bạn đã mỉm cười vì điều gì?", "nếu ngày hôm nay là một chiếc lá, nó sẽ có màu gì?", "điều gì đang thì thầm trong tâm trí bạn?", "một góc phố nào bạn nhớ tới hôm nay?", "có lời chưa nói nào bạn muốn gửi vào hư vô?"];

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const activeContent = document.getElementById(`tab-${tabId}`);
            if (activeContent) activeContent.classList.add('active');
            if (tabId === 'reflect') generateReflection();
        });
    });

    function showQuietPrompt() {
        let promptEl = document.querySelector('.prompt-tip');
        if (!promptEl) {
            promptEl = document.createElement('div'); promptEl.className = 'prompt-tip';
            const journalTab = document.getElementById('tab-journal');
            const noteContainer = journalTab.querySelector('.mood-note-container');
            if (journalTab && noteContainer) journalTab.insertBefore(promptEl, noteContainer);
        }
        if (promptEl) promptEl.textContent = QUIET_PROMPTS[Math.floor(Math.random() * QUIET_PROMPTS.length)];
    }

    const originalOpenMoodDrawer = openMoodDrawer;
    openMoodDrawer = function () { originalOpenMoodDrawer(); showQuietPrompt(); };

    /* -------------------------------------------------------------
       8. E2EE Time Capsule (Hộp thư tương lai)
       ------------------------------------------------------------- */
    const capsuleTitleInput = document.getElementById('capsule-title');
    const capsuleContentInput = document.getElementById('capsule-content');
    const capsuleDateInput = document.getElementById('capsule-date');
    const capsuleSendBtn = document.getElementById('capsule-send-btn');
    const capsuleStatus = document.getElementById('capsule-status');

    if (capsuleSendBtn) {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        capsuleDateInput.min = tomorrow.toISOString().split('T')[0];
        capsuleDateInput.value = tomorrow.toISOString().split('T')[0];

        capsuleSendBtn.addEventListener('click', async () => {
            const title = capsuleTitleInput.value.trim();
            const content = capsuleContentInput.value.trim();
            const unlockDate = capsuleDateInput.value;
            if (!title || !content || !unlockDate) { capsuleStatus.textContent = "vui lòng điền đủ thông tin."; return; }
            if (new Date(unlockDate) <= new Date()) { capsuleStatus.textContent = "ngày mở khóa phải ở tương lai."; return; }
            if (!currentPasscode) { capsuleStatus.textContent = "vui lòng mở khóa trước."; return; }
            capsuleStatus.textContent = "đang mã hóa & niêm phong...";
            try {
                const encTitle = await encryptData(title, currentPasscode);
                const encContent = await encryptData(content, currentPasscode);
                if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL.trim() !== "") {
                    const createdAt = new Date();
                    await fetch(GOOGLE_APPS_SCRIPT_URL, {
                        method: 'POST',
                        headers: getPrivateSheetHeaders({ 'Content-Type': 'application/json' }),
                        body: JSON.stringify({
                            type: "future_letter",
                            date: createdAt.toISOString(),
                            title: encTitle,
                            preview: "future_letter:" + unlockDate,
                            content: encContent,
                            unlockDate,
                            displayDate: formatVietnamDateTime(createdAt)
                        })
                    });
                }
                capsuleStatus.textContent = "thư đã được niêm phong.";
                capsuleTitleInput.value = ""; capsuleContentInput.value = "";
                setTimeout(() => verifyAndLoad(currentPasscode), 1000);
            } catch (err) { capsuleStatus.textContent = "thất bại. thử lại sau."; }
        });
    }

    /* -------------------------------------------------------------
       9. Self-Reflection Trends (Dệt thơ phản chiếu tâm cảnh)
       ------------------------------------------------------------- */
    function generateReflection() {
        const reportEl = document.getElementById('reflect-report-text');
        if (!reportEl) return;

        const logs = getMoodLogs();
        const dates = Object.keys(logs).sort().reverse();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const counts = { "tĩnh": 0, "mơ": 0, "lặng": 0, "trầm": 0, "loạn": 0 };
        let total = 0;

        dates.forEach(dateStr => {
            const date = new Date(dateStr);
            if (date >= thirtyDaysAgo) {
                const log = logs[dateStr];
                if (log && log.emoji && counts[log.emoji] !== undefined) {
                    counts[log.emoji]++;
                    total++;
                }
            }
        });

        if (total === 0) {
            reportEl.innerHTML = `
                <div class="reflect-poem-container">
                    <p class="reflect-poem-meta">tấm gương tâm cảnh đang im lìm</p>
                    <p class="reflect-poem-stanza">chưa có ký ức nào được ghi lại trong ba mươi ngày qua.
                    hãy viết lại vài dòng nhật ký cảm xúc,
                    để tâm hồn có gương soi soi rọi bóng hình mình...</p>
                    <p class="reflect-poem-footer">kính gửi bạn</p>
                </div>
            `;
            return;
        }

        // Tìm cảm xúc chủ đạo
        let dominantMood = "";
        let maxCount = -1;
        for (let mood in counts) {
            if (counts[mood] > maxCount) {
                maxCount = counts[mood];
                dominantMood = mood;
            }
        }

        // Thơ ca tiếng Việt tự dệt tương ứng với từng tâm cảnh
        const poems = {
            "tĩnh": `những ngày qua yên ả lặng lẽ trôi đi
                    lòng ta như mặt nước hồ thu không gợn gió
                    mọi xôn xao ngoài kia xin khép lại sau cánh cửa
                    chỉ còn bóng tối dịu dàng che chở giấc mơ ngoan...`,
            "mơ": `những đám mây lững lờ dệt nên giấc mộng chiều hôm
                    bàn tay lơ đãng viết những dòng thơ không tựa đề
                    thời gian đi qua vội vã, người đi qua rất xa
                    chỉ còn khoảng trời mơ mộng đầy gió lộng ở lại với ta...`,
            "lặng": `lặng nhìn bóng tối từ từ ôm lấy căn phòng trống
                    nghe tiếng thở dài của đêm muộn trôi đi
                    mọi thanh âm ồn ào giờ đã lùi xa khuất bóng
                    chỉ còn sự im lặng đọng lại dịu êm nơi này...`,
            "trầm": `bóng chiều đổ nghiêng qua ô cửa sổ nhỏ màu xám
                    nỗi buồn tựa như những giọt mưa thu chậm rãi rơi
                    nghe tiếng lá rụng thầm thì lời tiễn biệt trong gió
                    lòng trầm ngâm nhặt nhạnh từng mảnh ký ức đã phai màu...`,
            "loạn": `có những cơn giông bão lòng đổ về không báo trước
                    tâm trí xôn xao như lá rụng giữa mùa giông lốc
                    giữa dòng người hối hả ngược xuôi chen chúc ngoài phố
                    ta tự tìm cho mình một lối về bình lặng giữa cơn giông...`
        };

        const moodNames = {
            "tĩnh": "tĩnh lặng",
            "mơ": "thơ thẩn",
            "lặng": "trầm ngâm",
            "trầm": "buồn bã",
            "loạn": "bất an"
        };

        const poemText = poems[dominantMood] || poems["tĩnh"];
        const moodName = moodNames[dominantMood] || "yên ả";

        reportEl.innerHTML = `
            <div class="reflect-poem-container">
                <p class="reflect-poem-meta">30 ngày qua, lòng bạn chủ yếu là sự ${moodName} (${maxCount}/${total} ngày)</p>
                <div class="reflect-poem-stanza">${poemText}</div>
                <p class="reflect-poem-footer">gửi một bản thể lặng lẽ</p>
            </div>
        `;
    }

    /* =============================================================
       NHẬT KÝ NÂNG CAO (ADVANCED JOURNAL) LOGIC
       ============================================================= */
    let currentFilter = "all";
    let searchPattern = "";

    function renderJournalHistory() {
        const historyListEl = document.getElementById('journal-history-list');
        if (!historyListEl) return;

        const logs = getMoodLogs();
        const dates = Object.keys(logs).sort().reverse();

        let html = "";
        let count = 0;

        dates.forEach(dateStr => {
            const log = logs[dateStr];
            if (!log) return;

            const mood = log.emoji || "không rõ";
            const note = log.note || "";

            // Lọc theo cảm xúc
            if (currentFilter !== "all" && mood !== currentFilter) return;

            // Tìm kiếm theo từ khóa
            if (searchPattern.trim() !== "") {
                const searchLower = searchPattern.toLowerCase();
                const noteLower = note.toLowerCase();
                const dateLower = `${dateStr} ${formatJournalDate(dateStr)}`.toLowerCase();
                const moodLower = mood.toLowerCase();
                if (!noteLower.includes(searchLower) && !dateLower.includes(searchLower) && !moodLower.includes(searchLower)) {
                    return;
                }
            }

            count++;

            const displayDate = formatJournalDate(dateStr);
            const safeDate = escapeHTML(dateStr);

            html += `
                <div class="journal-history-item" data-date="${safeDate}">
                    <div class="journal-item-meta">
                        <span class="journal-item-date">${displayDate}</span>
                        <span class="journal-item-mood">${escapeHTML(mood)}</span>
                    </div>
                    <div class="journal-item-content">${escapeHTML(note) || '<span style="color: var(--text-muted); font-style: italic;">trống</span>'}</div>
                    <button class="journal-item-delete" data-date="${safeDate}" aria-label="Xóa nhật ký ngày ${displayDate}">×</button>
                </div>
            `;
        });

        if (count === 0) {
            html = `<p style="font-style: italic; color: var(--text-muted); text-align: center; padding: 2rem 0;">không tìm thấy ký ức nào...</p>`;
        }

        historyListEl.innerHTML = html;

        // Gắn sự kiện xóa
        historyListEl.querySelectorAll('.journal-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dateToDelete = btn.getAttribute('data-date');
                if (confirm(`bạn có chắc chắn muốn xóa ký ức ngày ${dateToDelete}?`)) {
                    deleteMoodLog(dateToDelete);
                }
            });
        });
    }

    function deleteMoodLog(dateStr) {
        saveMoodLog(dateStr, "", "");
        renderCalendarStrip();
        renderJournalHistory();
    }

    function escapeHTML(str) {
        return String(str ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Nút Lưu thủ công
    const moodSaveBtn = document.getElementById('mood-save-btn');
    if (moodSaveBtn) {
        moodSaveBtn.addEventListener('click', () => {
            const selectedBtn = document.querySelector('.mood-state-btn.is-selected');
            const state = selectedBtn ? selectedBtn.getAttribute('data-state') : '';
            const note = moodNoteInput ? moodNoteInput.value : '';
            const todayStr = getLocalDateString();

            if (!state && !note) {
                alert("vui lòng chọn trạng thái hoặc điền ghi chép.");
                return;
            }

            saveMoodLog(todayStr, state, note);
            renderCalendarStrip();
            renderJournalHistory();

            // Phản hồi nút bấm
            moodSaveBtn.textContent = "đã ghi";
            moodSaveBtn.disabled = true;
            setTimeout(() => {
                moodSaveBtn.textContent = "ghi lại";
                moodSaveBtn.disabled = false;
            }, 1500);
        });
    }

    // Input tìm kiếm
    const searchInput = document.getElementById('journal-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchPattern = e.target.value;
            renderJournalHistory();
        });
    }

    // Nút lọc cảm xúc
    const filterBtns = document.querySelectorAll('.journal-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderJournalHistory();
        });
    });

    /* -------------------------------------------------------------
       10. Zen Games (Menu & Control)
       ------------------------------------------------------------- */
    let currentActiveGame = "";
    const gameSelectBtns = document.querySelectorAll('.game-select-btn');
    const gamesMenu = document.getElementById('games-menu');
    const gameActiveContainer = document.getElementById('game-active-container');
    const gameTitleText = document.getElementById('game-title');
    const gamePlayareas = document.querySelectorAll('.game-playarea');
    const gameBackBtn = document.getElementById('game-back-btn');

    let tictactoeTimeout = null;
    let nimTimeout = null;
    let oanquanTimeout = null;
    let minigoTimeout = null;
    let mastermindTimeout = null;
    let memoryTimeout = null;

    function stopIndieGames() {
        if (fireflyFrame) cancelAnimationFrame(fireflyFrame);
        fireflyFrame = null;
        firefliesRunning = false;
        if (wordRainTimer) clearInterval(wordRainTimer);
        wordRainTimer = null;
        if (tictactoeTimeout) clearTimeout(tictactoeTimeout);
        tictactoeTimeout = null;
        if (nimTimeout) clearTimeout(nimTimeout);
        nimTimeout = null;
        if (oanquanTimeout) clearTimeout(oanquanTimeout);
        oanquanTimeout = null;
        if (minigoTimeout) clearTimeout(minigoTimeout);
        minigoTimeout = null;
        if (mastermindTimeout) clearTimeout(mastermindTimeout);
        mastermindTimeout = null;
        if (memoryTimeout) clearTimeout(memoryTimeout);
        memoryTimeout = null;
    }

    gameSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameName = btn.getAttribute('data-game');
            stopIndieGames();
            currentActiveGame = gameName;

            if (gamesMenu) gamesMenu.style.display = 'none';
            if (gameActiveContainer) gameActiveContainer.classList.add('active');

            let title = 'trò chơi';
            if (gameName === 'haiku') title = 'ghép thơ haiku';
            else if (gameName === '2048') title = 'zen 2048';
            else if (gameName === 'snake') title = 'rắn săn mồi';
            else if (gameName === 'conway') title = 'vườn conway';
            else if (gameName === 'fireflies') title = 'đom đóm đêm';
            else if (gameName === 'wordrain') title = 'mưa chữ';
            else if (gameName === 'signal') title = 'đài tín hiệu';
            else if (gameName === 'tictactoe') title = 'cờ caro tĩnh lặng';
            else if (gameName === 'nim') title = 'nhặt sỏi zen';
            else if (gameName === 'oanquan') title = 'ô ăn quan dân gian';
            else if (gameName === 'minigo') title = 'cờ vây thu nhỏ';
            else if (gameName === 'mastermind') title = 'dò mã cảm xúc';
            else if (gameName === 'memory') title = 'cặp đôi đồng điệu';
            if (gameTitleText) gameTitleText.textContent = title;

            gamePlayareas.forEach(p => p.classList.remove('active'));
            const activePlayarea = document.getElementById(`game-play-${gameName}`);
            if (activePlayarea) activePlayarea.classList.add('active');

            if (gameName === 'haiku') {
                initHaikuBuilder();
            } else if (gameName === '2048') {
                start2048();
            } else if (gameName === 'snake') {
                startSnake();
            } else if (gameName === 'conway') {
                initConway();
            } else if (gameName === 'fireflies') {
                startFireflies();
            } else if (gameName === 'wordrain') {
                startWordRain();
            } else if (gameName === 'signal') {
                startSignalRadio();
            } else if (gameName === 'tictactoe') {
                startTicTacToe();
            } else if (gameName === 'nim') {
                startNim();
            } else if (gameName === 'oanquan') {
                startOanQuan();
            } else if (gameName === 'minigo') {
                startMiniGo();
            } else if (gameName === 'mastermind') {
                startMastermind();
            } else if (gameName === 'memory') {
                startMemory();
            }
        });
    });

    if (gameBackBtn) {
        gameBackBtn.addEventListener('click', () => {
            if (snakeInterval) clearInterval(snakeInterval);
            snakeRunning = false;
            if (conwayInterval) clearInterval(conwayInterval);
            conwayRunning = false;
            stopIndieGames();

            currentActiveGame = "";

            if (gameActiveContainer) gameActiveContainer.classList.remove('active');
            if (gamesMenu) gamesMenu.style.display = 'flex';
        });
    }

    // --- GAME A: HAIKU BUILDER ---
    const HAIKU_WORDS_POOL = [
        { word: "mưa", syllables: 1 },
        { word: "nắng", syllables: 1 },
        { word: "mây", syllables: 1 },
        { word: "gió", syllables: 1 },
        { word: "lặng", syllables: 1 },
        { word: "mơ", syllables: 1 },
        { word: "rơi", syllables: 1 },
        { word: "trôi", syllables: 1 },
        { word: "sương", syllables: 1 },
        { word: "đêm", syllables: 1 },
        { word: "ngày", syllables: 1 },
        { word: "chiều", syllables: 1 },
        { word: "thu", syllables: 1 },
        { word: "đông", syllables: 1 },
        { word: "lá", syllables: 1 },
        { word: "hoa", syllables: 1 },
        { word: "sông", syllables: 1 },
        { word: "biển", syllables: 1 },
        { word: "sóng", syllables: 1 },
        { word: "trời", syllables: 1 },
        { word: "trăng", syllables: 1 },
        { word: "sao", syllables: 1 },
        { word: "khói", syllables: 1 },
        { word: "bụi", syllables: 1 },
        { word: "vườn", syllables: 1 },
        { word: "lòng", syllables: 1 },
        { word: "tâm", syllables: 1 },
        { word: "hồn", syllables: 1 },
        { word: "yêu", syllables: 1 },
        { word: "nhớ", syllables: 1 },
        { word: "quên", syllables: 1 },
        { word: "chờ", syllables: 1 },
        { word: "tìm", syllables: 1 },
        { word: "mất", syllables: 1 },
        { word: "đi", syllables: 1 },
        { word: "về", syllables: 1 },
        { word: "lặng lẽ", syllables: 2 },
        { word: "mơ màng", syllables: 2 },
        { word: "rơi rụng", syllables: 2 },
        { word: "trôi nổi", syllables: 2 },
        { word: "mênh mông", syllables: 2 },
        { word: "thì thầm", syllables: 2 },
        { word: "lững lờ", syllables: 2 },
        { word: "êm đềm", syllables: 2 },
        { word: "bình yên", syllables: 2 },
        { word: "tĩnh lặng", syllables: 2 },
        { word: "sâu thẳm", syllables: 2 },
        { word: "xa xăm", syllables: 2 },
        { word: "bâng khuâng", syllables: 2 },
        { word: "nhẹ nhàng", syllables: 2 },
        { word: "chậm rãi", syllables: 2 },
        { word: "mong manh", syllables: 2 }
    ];

    let activeHaikuLine = 1;
    let haikuLinesData = { 1: [], 2: [], 3: [] };

    function initHaikuBuilder() {
        const poolContainer = document.getElementById('haiku-words-pool');
        if (!poolContainer) return;
        poolContainer.innerHTML = '';

        const words = [...HAIKU_WORDS_POOL].sort(() => Math.random() - 0.5);
        words.forEach(item => {
            const chip = document.createElement('span');
            chip.className = 'haiku-word-chip';
            chip.textContent = item.word;
            chip.addEventListener('click', () => addWordToHaiku(item.word, item.syllables));
            poolContainer.appendChild(chip);
        });

        haikuLinesData = { 1: [], 2: [], 3: [] };
        for (let i = 1; i <= 3; i++) {
            updateHaikuLineUI(i);
        }
        selectHaikuLine(1);
    }

    function selectHaikuLine(lineNum) {
        activeHaikuLine = lineNum;
        document.querySelectorAll('.haiku-line').forEach((el, index) => {
            if (index + 1 === lineNum) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }

    document.querySelectorAll('.haiku-line').forEach((el, index) => {
        el.addEventListener('click', () => selectHaikuLine(index + 1));
    });

    function addWordToHaiku(word, syllables) {
        const currentLineWords = haikuLinesData[activeHaikuLine];
        const targetSyllables = activeHaikuLine === 2 ? 7 : 5;
        const currentSyllables = currentLineWords.reduce((sum, w) => sum + w.syllables, 0);

        if (currentSyllables + syllables > targetSyllables) {
            return;
        }

        currentLineWords.push({ word, syllables });
        updateHaikuLineUI(activeHaikuLine);
    }

    function updateHaikuLineUI(lineNum) {
        const textEl = document.getElementById(`haiku-text-${lineNum}`);
        if (!textEl) return;
        const lineWords = haikuLinesData[lineNum];
        const currentSyllables = lineWords.reduce((sum, w) => sum + w.syllables, 0);
        const targetSyllables = lineNum === 2 ? 7 : 5;

        if (lineWords.length === 0) {
            textEl.textContent = `chạm để dệt dòng ${lineNum}`;
            textEl.style.opacity = 0.5;
        } else {
            const sentence = lineWords.map(w => w.word).join(' ');
            textEl.textContent = `${sentence} (${currentSyllables}/${targetSyllables})`;
            textEl.style.opacity = 1;
        }
    }

    document.getElementById('haiku-reset')?.addEventListener('click', () => {
        haikuLinesData = { 1: [], 2: [], 3: [] };
        updateHaikuLineUI(1);
        updateHaikuLineUI(2);
        updateHaikuLineUI(3);
        selectHaikuLine(1);
    });

    document.getElementById('haiku-save')?.addEventListener('click', () => {
        const s1 = haikuLinesData[1].reduce((sum, w) => sum + w.syllables, 0);
        const s2 = haikuLinesData[2].reduce((sum, w) => sum + w.syllables, 0);
        const s3 = haikuLinesData[3].reduce((sum, w) => sum + w.syllables, 0);

        if (s1 !== 5 || s2 !== 7 || s3 !== 5) {
            alert("vui lòng dệt bài thơ haiku đúng nhịp 5-7-5.");
            return;
        }

        const line1Text = haikuLinesData[1].map(w => w.word).join(' ');
        const line2Text = haikuLinesData[2].map(w => w.word).join(' ');
        const line3Text = haikuLinesData[3].map(w => w.word).join(' ');
        const haikuText = `${line1Text}\n${line2Text}\n${line3Text}`;

        if (moodNoteInput) {
            moodNoteInput.value = haikuText;
            moodNoteInput.dispatchEvent(new Event('input'));
        }

        alert("bài thơ haiku đã được ký thác vào nhật ký.");
    });

    // --- GAME B: ZEN 2048 ---
    let board = Array(16).fill(0);
    let score2048 = 0;
    let best2048 = parseInt(localStorage.getItem('introvert_2048_best') || '0');

    function start2048() {
        board = Array(16).fill(0);
        score2048 = 0;
        const scoreEl = document.getElementById('2048-score');
        const bestEl = document.getElementById('2048-best');
        if (scoreEl) scoreEl.textContent = `điểm: ${score2048}`;
        if (bestEl) bestEl.textContent = `kỷ niệm: ${best2048}`;
        addRandom2048();
        addRandom2048();
        render2048();
    }

    function addRandom2048() {
        const empties = [];
        board.forEach((val, idx) => {
            if (val === 0) empties.push(idx);
        });
        if (empties.length === 0) return;
        const randomIdx = empties[Math.floor(Math.random() * empties.length)];
        board[randomIdx] = Math.random() < 0.9 ? 2 : 4;
    }

    function render2048() {
        const grid = document.getElementById('grid-2048');
        if (!grid) return;
        grid.innerHTML = '';

        board.forEach(val => {
            const tile = document.createElement('div');
            tile.className = 'tile-2048';
            if (val > 0) {
                tile.textContent = val;
                tile.classList.add(`tile-${val}`);
            }
            grid.appendChild(tile);
        });
    }

    function slideRow(row) {
        let filtered = row.filter(val => val > 0);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                score2048 += filtered[i];
                filtered.splice(i + 1, 1);
            }
        }
        while (filtered.length < 4) {
            filtered.push(0);
        }
        return filtered;
    }

    function moveLeft2048() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = [board[r * 4], board[r * 4 + 1], board[r * 4 + 2], board[r * 4 + 3]];
            const slid = slideRow(row);
            for (let c = 0; c < 4; c++) {
                if (board[r * 4 + c] !== slid[c]) moved = true;
                board[r * 4 + c] = slid[c];
            }
        }
        return moved;
    }

    function moveRight2048() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = [board[r * 4], board[r * 4 + 1], board[r * 4 + 2], board[r * 4 + 3]].reverse();
            const slid = slideRow(row);
            slid.reverse();
            for (let c = 0; c < 4; c++) {
                if (board[r * 4 + c] !== slid[c]) moved = true;
                board[r * 4 + c] = slid[c];
            }
        }
        return moved;
    }

    function moveUp2048() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const col = [board[c], board[4 + c], board[8 + c], board[12 + c]];
            const slid = slideRow(col);
            for (let r = 0; r < 4; r++) {
                if (board[r * 4 + c] !== slid[r]) moved = true;
                board[r * 4 + c] = slid[r];
            }
        }
        return moved;
    }

    function moveDown2048() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const col = [board[c], board[4 + c], board[8 + c], board[12 + c]].reverse();
            const slid = slideRow(col);
            slid.reverse();
            for (let r = 0; r < 4; r++) {
                if (board[r * 4 + c] !== slid[r]) moved = true;
                board[r * 4 + c] = slid[r];
            }
        }
        return moved;
    }

    function handle2048Move(direction) {
        if (currentActiveGame !== '2048') return;

        let moved = false;
        if (direction === 'left') moved = moveLeft2048();
        else if (direction === 'right') moved = moveRight2048();
        else if (direction === 'up') moved = moveUp2048();
        else if (direction === 'down') moved = moveDown2048();

        if (moved) {
            addRandom2048();
            render2048();
            const scoreEl = document.getElementById('2048-score');
            const bestEl = document.getElementById('2048-best');
            if (scoreEl) scoreEl.textContent = `điểm: ${score2048}`;
            if (score2048 > best2048) {
                best2048 = score2048;
                localStorage.setItem('introvert_2048_best', best2048);
                if (bestEl) bestEl.textContent = `kỷ niệm: ${best2048}`;
            }
            if (isGameOver2048()) {
                alert("trò chơi kết thúc tĩnh lặng.");
            }
        }
    }

    function isGameOver2048() {
        if (board.includes(0)) return false;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                let idx = r * 4 + c;
                if (c < 3 && board[idx] === board[idx + 1]) return false;
                if (r < 3 && board[idx] === board[idx + 4]) return false;
            }
        }
        return true;
    }

    document.getElementById('reset-2048')?.addEventListener('click', start2048);

    let touchStartX = 0;
    let touchStartY = 0;
    const grid2048 = document.getElementById('grid-2048');
    if (grid2048) {
        grid2048.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        grid2048.addEventListener('touchend', (e) => {
            if (currentActiveGame !== '2048') return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > 30) {
                    handle2048Move(dx > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(dy) > 30) {
                    handle2048Move(dy > 0 ? 'down' : 'up');
                }
            }
        }, { passive: true });
    }

    // --- GAME C: QUIET SNAKE ---
    let snake = [];
    let snakeDir = { x: 0, y: -1 };
    let snakeNextDir = { x: 0, y: -1 };
    let snakeFood = { x: 0, y: 0 };
    let snakeScoreVal = 3;
    let snakeBestVal = parseInt(localStorage.getItem('introvert_snake_best') || '3');
    let snakeInterval = null;
    let snakeRunning = false;

    function startSnake() {
        if (snakeInterval) clearInterval(snakeInterval);
        snake = [{ x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }];
        snakeDir = { x: 0, y: -1 };
        snakeNextDir = { x: 0, y: -1 };
        snakeScoreVal = 3;
        const scoreEl = document.getElementById('snake-score');
        const bestEl = document.getElementById('snake-best');
        const resetBtn = document.getElementById('reset-snake');
        if (scoreEl) scoreEl.textContent = `độ dài: ${snakeScoreVal}`;
        if (bestEl) bestEl.textContent = `kỷ niệm: ${snakeBestVal}`;
        placeSnakeFood();
        snakeRunning = true;
        snakeInterval = setInterval(snakeTick, 140);
        if (resetBtn) resetBtn.textContent = "làm lại";
    }

    function placeSnakeFood() {
        let collision = true;
        while (collision) {
            snakeFood = {
                x: Math.floor(Math.random() * 15),
                y: Math.floor(Math.random() * 15)
            };
            collision = snake.some(seg => seg.x === snakeFood.x && seg.y === snakeFood.y);
        }
    }

    function snakeTick() {
        if (!snakeRunning || currentActiveGame !== 'snake') return;

        snakeDir = snakeNextDir;
        const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };

        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15) {
            endSnakeGame();
            return;
        }

        if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            endSnakeGame();
            return;
        }

        snake.unshift(head);

        if (head.x === snakeFood.x && head.y === snakeFood.y) {
            snakeScoreVal = snake.length;
            const scoreEl = document.getElementById('snake-score');
            const bestEl = document.getElementById('snake-best');
            if (scoreEl) scoreEl.textContent = `độ dài: ${snakeScoreVal}`;
            if (snakeScoreVal > snakeBestVal) {
                snakeBestVal = snakeScoreVal;
                localStorage.setItem('introvert_snake_best', snakeBestVal);
                if (bestEl) bestEl.textContent = `kỷ niệm: ${snakeBestVal}`;
            }
            placeSnakeFood();
        } else {
            snake.pop();
        }

        drawSnake();
    }

    function drawSnake() {
        const canvas = document.getElementById('snake-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 300, 300);

        ctx.strokeStyle = activeTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 15; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 20, 0);
            ctx.lineTo(i * 20, 300);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * 20);
            ctx.lineTo(300, i * 20);
            ctx.stroke();
        }

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8B7355';
        ctx.beginPath();
        ctx.arc(snakeFood.x * 20 + 10, snakeFood.y * 20 + 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        snake.forEach((seg, idx) => {
            const opacity = 1 - (idx / snake.length) * 0.7;
            ctx.fillStyle = `rgba(139, 115, 85, ${opacity})`;

            ctx.beginPath();
            ctx.arc(seg.x * 20 + 10, seg.y * 20 + 10, 7, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    function endSnakeGame() {
        snakeRunning = false;
        clearInterval(snakeInterval);
        const resetBtn = document.getElementById('reset-snake');
        if (resetBtn) resetBtn.textContent = "bắt đầu";

        const canvas = document.getElementById('snake-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = activeTheme === 'dark' ? 'rgba(229, 224, 216, 0.6)' : 'rgba(44, 42, 39, 0.6)';
            ctx.font = 'italic 16px Lora, Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText('kết thúc tĩnh lặng.', 150, 150);
        }
    }

    document.getElementById('reset-snake')?.addEventListener('click', startSnake);


    // --- GAME D: CONWAY'S ZEN GARDEN ---
    let conwayGrid = Array(30).fill(null).map(() => Array(30).fill(0));
    let conwayRunning = false;
    let conwayInterval = null;
    let conwayDragging = false;

    function initConway() {
        if (conwayInterval) clearInterval(conwayInterval);
        conwayRunning = false;
        const startBtn = document.getElementById('conway-start');
        if (startBtn) startBtn.textContent = "chạy";
        conwayGrid = Array(30).fill(null).map(() => Array(30).fill(0));
        drawConway();
    }

    function drawConway() {
        const canvas = document.getElementById('conway-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 300, 300);

        ctx.strokeStyle = activeTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 30; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 10, 0);
            ctx.lineTo(i * 10, 300);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * 10);
            ctx.lineTo(300, i * 10);
            ctx.stroke();
        }

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8B7355';
        for (let r = 0; r < 30; r++) {
            for (let c = 0; c < 30; c++) {
                if (conwayGrid[r][c] === 1) {
                    ctx.beginPath();
                    ctx.arc(c * 10 + 5, r * 10 + 5, 3.5, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
    }

    function conwayTick() {
        const nextGrid = Array(30).fill(null).map(() => Array(30).fill(0));
        let changed = false;
        let aliveCount = 0;

        for (let r = 0; r < 30; r++) {
            for (let c = 0; c < 30; c++) {
                let neighbors = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue;
                        const row = (r + i + 30) % 30;
                        const col = (c + j + 30) % 30;
                        neighbors += conwayGrid[row][col];
                    }
                }

                const state = conwayGrid[r][c];
                if (state === 1) {
                    if (neighbors === 2 || neighbors === 3) {
                        nextGrid[r][c] = 1;
                        aliveCount++;
                    }
                } else {
                    if (neighbors === 3) {
                        nextGrid[r][c] = 1;
                        aliveCount++;
                    }
                }

                if (nextGrid[r][c] !== state) {
                    changed = true;
                }
            }
        }

        if (!changed || aliveCount === 0) {
            conwayRunning = false;
            clearInterval(conwayInterval);
            const startBtn = document.getElementById('conway-start');
            if (startBtn) startBtn.textContent = "chạy";
        }

        conwayGrid = nextGrid;
        drawConway();
    }

    const conwayCanvas = document.getElementById('conway-canvas');
    if (conwayCanvas) {
        function getConwayCoords(e) {
            const rect = conwayCanvas.getBoundingClientRect();
            const scaleX = conwayCanvas.width / rect.width;
            const scaleY = conwayCanvas.height / rect.height;
            const x = Math.floor((e.clientX - rect.left) * scaleX / 10);
            const y = Math.floor((e.clientY - rect.top) * scaleY / 10);
            return { x, y };
        }

        conwayCanvas.addEventListener('mousedown', (e) => {
            conwayDragging = true;
            const coords = getConwayCoords(e);
            if (coords.x >= 0 && coords.x < 30 && coords.y >= 0 && coords.y < 30) {
                conwayGrid[coords.y][coords.x] = conwayGrid[coords.y][coords.x] === 1 ? 0 : 1;
                drawConway();
            }
        });

        conwayCanvas.addEventListener('mousemove', (e) => {
            if (!conwayDragging) return;
            const coords = getConwayCoords(e);
            if (coords.x >= 0 && coords.x < 30 && coords.y >= 0 && coords.y < 30) {
                conwayGrid[coords.y][coords.x] = 1;
                drawConway();
            }
        });

        window.addEventListener('mouseup', () => {
            conwayDragging = false;
        });

        conwayCanvas.addEventListener('touchstart', (e) => {
            conwayDragging = true;
            const touch = e.touches[0];
            const coords = getConwayCoords(touch);
            if (coords.x >= 0 && coords.x < 30 && coords.y >= 0 && coords.y < 30) {
                conwayGrid[coords.y][coords.x] = conwayGrid[coords.y][coords.x] === 1 ? 0 : 1;
                drawConway();
            }
            e.preventDefault();
        }, { passive: false });

        conwayCanvas.addEventListener('touchmove', (e) => {
            if (!conwayDragging) return;
            const touch = e.touches[0];
            const coords = getConwayCoords(touch);
            if (coords.x >= 0 && coords.x < 30 && coords.y >= 0 && coords.y < 30) {
                conwayGrid[coords.y][coords.x] = 1;
                drawConway();
            }
            e.preventDefault();
        }, { passive: false });
    }

    document.getElementById('conway-start')?.addEventListener('click', () => {
        conwayRunning = !conwayRunning;
        const startBtn = document.getElementById('conway-start');
        if (conwayRunning) {
            if (startBtn) startBtn.textContent = "dừng";
            conwayInterval = setInterval(conwayTick, 200);
        } else {
            if (startBtn) startBtn.textContent = "chạy";
            clearInterval(conwayInterval);
        }
    });

    document.getElementById('conway-clear')?.addEventListener('click', initConway);

    document.getElementById('conway-random')?.addEventListener('click', () => {
        for (let r = 0; r < 30; r++) {
            for (let c = 0; c < 30; c++) {
                conwayGrid[r][c] = Math.random() < 0.25 ? 1 : 0;
            }
        }
        drawConway();
    });

    // --- GAME E: FIREFLY NIGHT ---
    let fireflies = [];
    let fireflyFrame = null;
    let firefliesRunning = false;
    let fireflyScore = 0;

    function createFirefly(canvas) {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            radius: 7 + Math.random() * 6,
            pulse: Math.random() * Math.PI * 2,
            life: 0.7 + Math.random() * 0.3
        };
    }

    function startFireflies() {
        const canvas = document.getElementById('firefly-canvas');
        if (!canvas) return;
        if (fireflyFrame) cancelAnimationFrame(fireflyFrame);
        fireflyScore = 0;
        firefliesRunning = true;
        fireflies = Array.from({ length: 9 }, () => createFirefly(canvas));
        const scoreEl = document.getElementById('firefly-score');
        const statusEl = document.getElementById('firefly-status');
        if (scoreEl) scoreEl.textContent = "đom đóm: 0";
        if (statusEl) statusEl.textContent = "chạm vào ánh sáng";
        drawFireflies();
    }

    function drawFireflies() {
        const canvas = document.getElementById('firefly-canvas');
        if (!canvas || !firefliesRunning || currentActiveGame !== "fireflies") return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = activeTheme === 'dark' ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.018)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireflies.forEach(fly => {
            fly.x += fly.vx;
            fly.y += fly.vy;
            fly.pulse += 0.035;
            fly.life -= 0.0015;
            if (fly.x < 8 || fly.x > canvas.width - 8) fly.vx *= -1;
            if (fly.y < 8 || fly.y > canvas.height - 8) fly.vy *= -1;
            if (fly.life <= 0.15) Object.assign(fly, createFirefly(canvas));

            const glow = 0.38 + Math.sin(fly.pulse) * 0.18;
            const gradient = ctx.createRadialGradient(fly.x, fly.y, 1, fly.x, fly.y, fly.radius * 3.5);
            gradient.addColorStop(0, `rgba(194,176,149,${Math.max(0.2, glow)})`);
            gradient.addColorStop(1, 'rgba(194,176,149,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(fly.x, fly.y, fly.radius * 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(229,224,216,${Math.max(0.35, glow)})`;
            ctx.beginPath();
            ctx.arc(fly.x, fly.y, Math.max(2.5, fly.radius * 0.38), 0, Math.PI * 2);
            ctx.fill();
        });
        fireflyFrame = requestAnimationFrame(drawFireflies);
    }

    function catchFirefly(event) {
        const canvas = document.getElementById('firefly-canvas');
        if (!canvas || currentActiveGame !== "fireflies") return;
        const rect = canvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = (point.clientX - rect.left) * (canvas.width / rect.width);
        const y = (point.clientY - rect.top) * (canvas.height / rect.height);
        const hitIndex = fireflies.findIndex(fly => Math.hypot(fly.x - x, fly.y - y) < fly.radius * 1.8);
        if (hitIndex === -1) return;
        fireflyScore += 1;
        fireflies[hitIndex] = createFirefly(canvas);
        const scoreEl = document.getElementById('firefly-score');
        const statusEl = document.getElementById('firefly-status');
        if (scoreEl) scoreEl.textContent = `đom đóm: ${fireflyScore}`;
        if (statusEl) statusEl.textContent = fireflyScore >= 12 ? "đêm đã đủ sáng" : "một ánh nhỏ được giữ lại";
    }

    document.getElementById('reset-fireflies')?.addEventListener('click', startFireflies);
    document.getElementById('firefly-canvas')?.addEventListener('click', catchFirefly);
    document.getElementById('firefly-canvas')?.addEventListener('touchstart', (event) => {
        catchFirefly(event);
        event.preventDefault();
    }, { passive: false });

    // --- GAME F: WORD RAIN ---
    const WORD_RAIN_WORDS = ["lặng", "mưa", "đêm", "sương", "hơi thở", "gác mái", "ký ức", "vệt sáng", "trôi", "bình yên", "xa xăm", "tỉnh giấc"];
    let wordRainTimer = null;
    let wordRainScore = 0;
    let wordRainTime = 45;
    let currentRainWord = "";

    function nextRainWord() {
        currentRainWord = WORD_RAIN_WORDS[Math.floor(Math.random() * WORD_RAIN_WORDS.length)];
        const wordEl = document.getElementById('wordrain-word');
        if (wordEl) {
            wordEl.textContent = currentRainWord;
            wordEl.style.animation = 'none';
            void wordEl.offsetWidth;
            wordEl.style.animation = '';
        }
    }

    function startWordRain() {
        if (wordRainTimer) clearInterval(wordRainTimer);
        wordRainScore = 0;
        wordRainTime = 45;
        const input = document.getElementById('wordrain-input');
        if (input) input.value = "";
        document.getElementById('wordrain-score').textContent = "điểm: 0";
        document.getElementById('wordrain-time').textContent = "45s";
        nextRainWord();
        input?.focus();
        wordRainTimer = setInterval(() => {
            wordRainTime -= 1;
            const timeEl = document.getElementById('wordrain-time');
            if (timeEl) timeEl.textContent = `${wordRainTime}s`;
            if (wordRainTime <= 0) {
                clearInterval(wordRainTimer);
                wordRainTimer = null;
                if (timeEl) timeEl.textContent = "hết mưa";
            }
        }, 1000);
    }

    document.getElementById('reset-wordrain')?.addEventListener('click', startWordRain);
    document.getElementById('wordrain-input')?.addEventListener('input', (event) => {
        if (currentActiveGame !== "wordrain" || !wordRainTimer) return;
        if (event.target.value.trim().toLowerCase() !== currentRainWord.toLowerCase()) return;
        wordRainScore += 1;
        const scoreEl = document.getElementById('wordrain-score');
        if (scoreEl) scoreEl.textContent = `điểm: ${wordRainScore}`;
        event.target.value = "";
        nextRainWord();
    });

    // --- GAME G: SIGNAL RADIO ---
    const SIGNAL_MESSAGES = [
        "tín hiệu rõ: hôm nay bạn được phép chậm lại.",
        "tín hiệu rõ: có một câu chưa viết đang đợi bạn.",
        "tín hiệu rõ: đừng trả lời mọi tiếng gọi.",
        "tín hiệu rõ: giữ lại một góc yên cho riêng mình.",
        "tín hiệu rõ: ký ức không cần hoàn hảo mới đáng lưu."
    ];
    let hiddenSignal = 50;
    let currentSignalMessage = SIGNAL_MESSAGES[0];

    function startSignalRadio() {
        hiddenSignal = 8 + Math.floor(Math.random() * 85);
        currentSignalMessage = SIGNAL_MESSAGES[Math.floor(Math.random() * SIGNAL_MESSAGES.length)];
        const dial = document.getElementById('signal-dial');
        if (dial) dial.value = 50;
        updateSignalRadio();
    }

    function updateSignalRadio() {
        const dial = document.getElementById('signal-dial');
        const status = document.getElementById('signal-status');
        if (!dial || !status) return;
        const distance = Math.abs(parseInt(dial.value, 10) - hiddenSignal);
        if (distance <= 2) status.textContent = currentSignalMessage;
        else if (distance <= 8) status.textContent = "tín hiệu gần, còn nhiễu mỏng.";
        else if (distance <= 18) status.textContent = "có tiếng thì thầm sau lớp rè.";
        else status.textContent = "nhiễu rất nhẹ.";
    }

    document.getElementById('signal-dial')?.addEventListener('input', updateSignalRadio);
    document.getElementById('reset-signal')?.addEventListener('click', startSignalRadio);
    document.getElementById('signal-note')?.addEventListener('click', () => {
        if (!moodNoteInput) return;
        moodNoteInput.value = moodNoteInput.value.trim()
            ? `${moodNoteInput.value.trim()}\n\n${currentSignalMessage}`
            : currentSignalMessage;
        moodNoteInput.dispatchEvent(new Event('input'));
        moodNoteInput.focus();
    });

    // --- GAME H: TIC-TAC-TOE ---
    let tictactoeBoard = Array(9).fill("");
    let tictactoeActive = false;
    let tictactoeCurrentTurn = "X";

    function startTicTacToe() {
        if (tictactoeTimeout) clearTimeout(tictactoeTimeout);
        tictactoeBoard = Array(9).fill("");
        tictactoeActive = true;
        tictactoeCurrentTurn = "X";

        const statusEl = document.getElementById('tictactoe-status');
        if (statusEl) statusEl.textContent = "đến lượt của bạn (X)";

        const cells = document.querySelectorAll('.tictactoe-cell');
        cells.forEach(cell => {
            cell.textContent = "";
            cell.className = "tictactoe-cell";
            cell.disabled = false;
        });
    }

    function checkTicTacToeWinner(b) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, c, d] = lines[i];
            if (b[a] && b[a] === b[c] && b[a] === b[d]) {
                return b[a];
            }
        }
        if (b.includes("")) return null;
        return "draw";
    }

    function tictactoeMinimax(b, depth, isMaximizing) {
        const winner = checkTicTacToeWinner(b);
        if (winner === "O") return 10 - depth;
        if (winner === "X") return depth - 10;
        if (winner === "draw") return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (b[i] === "") {
                    b[i] = "O";
                    let score = tictactoeMinimax(b, depth + 1, false);
                    b[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (b[i] === "") {
                    b[i] = "X";
                    let score = tictactoeMinimax(b, depth + 1, true);
                    b[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function getTicTacToeBestMove(b) {
        // 15% ngẫu nhiên để người chơi dễ thắng hơn một chút
        if (Math.random() < 0.15) {
            const empties = [];
            for (let i = 0; i < 9; i++) {
                if (b[i] === "") empties.push(i);
            }
            if (empties.length > 0) {
                return empties[Math.floor(Math.random() * empties.length)];
            }
        }

        let bestScore = -Infinity;
        let move = -1;
        for (let i = 0; i < 9; i++) {
            if (b[i] === "") {
                b[i] = "O";
                let score = tictactoeMinimax(b, 0, false);
                b[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function endTicTacToe(result) {
        tictactoeActive = false;
        const statusEl = document.getElementById('tictactoe-status');
        if (statusEl) {
            if (result === "X") {
                statusEl.textContent = "bạn đã chiến thắng khoảng lặng.";
            } else if (result === "O") {
                statusEl.textContent = "khoảng lặng đã bao trùm.";
            } else {
                statusEl.textContent = "hòa trong tĩnh lặng.";
            }
        }
        document.querySelectorAll('.tictactoe-cell').forEach(cell => {
            cell.disabled = true;
        });
    }

    function tictactoeBotMove() {
        if (!tictactoeActive) return;

        const move = getTicTacToeBestMove(tictactoeBoard);
        if (move !== -1) {
            tictactoeBoard[move] = "O";
            const cell = document.querySelector(`.tictactoe-cell[data-index="${move}"]`);
            if (cell) {
                cell.textContent = "O";
                cell.classList.add('o-played');
                cell.disabled = true;
            }

            const winner = checkTicTacToeWinner(tictactoeBoard);
            if (winner) {
                endTicTacToe(winner);
            } else {
                tictactoeCurrentTurn = "X";
                const statusEl = document.getElementById('tictactoe-status');
                if (statusEl) statusEl.textContent = "đến lượt của bạn (X)";
            }
        }
    }

    document.querySelectorAll('.tictactoe-cell').forEach(cell => {
        cell.addEventListener('click', (e) => {
            if (!tictactoeActive || tictactoeCurrentTurn !== "X") return;
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            if (tictactoeBoard[index] !== "") return;

            tictactoeBoard[index] = "X";
            e.target.textContent = "X";
            e.target.classList.add('x-played');
            e.target.disabled = true;

            const winner = checkTicTacToeWinner(tictactoeBoard);
            if (winner) {
                endTicTacToe(winner);
            } else {
                tictactoeCurrentTurn = "O";
                const statusEl = document.getElementById('tictactoe-status');
                if (statusEl) statusEl.textContent = "khoảng lặng đang suy nghĩ...";
                tictactoeTimeout = setTimeout(tictactoeBotMove, 1000);
            }
        });
    });

    document.getElementById('reset-tictactoe')?.addEventListener('click', startTicTacToe);


    // --- GAME I: NIM GAME (NHẶT SỎI ZEN) ---
    let nimStonesCount = 15;
    let nimCurrentTurn = "player";
    let nimActive = false;

    function startNim() {
        if (nimTimeout) clearTimeout(nimTimeout);
        nimStonesCount = 15;
        nimCurrentTurn = "player";
        nimActive = true;

        renderNimStones();
        updateNimUI();
    }

    function renderNimStones() {
        const pile = document.getElementById('nim-pile');
        if (!pile) return;
        pile.innerHTML = "";
        for (let i = 0; i < nimStonesCount; i++) {
            const stone = document.createElement('div');
            stone.className = "nim-stone";
            pile.appendChild(stone);
        }
    }

    function updateNimUI() {
        const statusEl = document.getElementById('nim-status');
        if (statusEl) {
            if (nimCurrentTurn === "player") {
                statusEl.textContent = `${nimStonesCount} viên sỏi. đến lượt của bạn.`;
            } else {
                statusEl.textContent = "thiền sư đang suy ngẫm...";
            }
        }

        const take1Btn = document.getElementById('nim-take-1');
        const take2Btn = document.getElementById('nim-take-2');
        const take3Btn = document.getElementById('nim-take-3');

        if (take1Btn) take1Btn.disabled = !nimActive || nimCurrentTurn !== "player" || nimStonesCount < 1;
        if (take2Btn) take2Btn.disabled = !nimActive || nimCurrentTurn !== "player" || nimStonesCount < 2;
        if (take3Btn) take3Btn.disabled = !nimActive || nimCurrentTurn !== "player" || nimStonesCount < 3;
    }

    function nimBotMove() {
        if (!nimActive) return;

        // Chiến thuật Nim thắng (giữ số sỏi còn lại chia 4 dư 1: 13, 9, 5, 1)
        let take = (nimStonesCount - 1) % 4;
        if (take === 0) {
            // Bot đang ở thế thua, nhặt ngẫu nhiên 1, 2, hoặc 3 sỏi
            take = Math.floor(Math.random() * Math.min(3, nimStonesCount)) + 1;
        }

        // Thực hiện nhặt sỏi
        const stones = document.querySelectorAll('#nim-pile .nim-stone:not(.removed)');
        const startIdx = stones.length - take;
        for (let i = startIdx; i < stones.length; i++) {
            stones[i].classList.add('removed');
        }

        nimStonesCount -= take;

        nimTimeout = setTimeout(() => {
            // Xóa thực tế khỏi DOM
            renderNimStones();

            if (nimStonesCount === 0) {
                nimActive = false;
                const statusEl = document.getElementById('nim-status');
                if (statusEl) statusEl.textContent = "thiền sư mỉm cười. bạn đã thắng.";
                updateNimUI();
            } else {
                nimCurrentTurn = "player";
                updateNimUI();
            }
        }, 400);
    }

    function nimPlayerTake(take) {
        if (!nimActive || nimCurrentTurn !== "player" || nimStonesCount < take) return;

        // Hiệu ứng nhặt sỏi của người chơi
        const stones = document.querySelectorAll('#nim-pile .nim-stone:not(.removed)');
        const startIdx = stones.length - take;
        for (let i = startIdx; i < stones.length; i++) {
            stones[i].classList.add('removed');
        }

        nimStonesCount -= take;
        nimCurrentTurn = "bot";
        updateNimUI();

        nimTimeout = setTimeout(() => {
            renderNimStones();

            if (nimStonesCount === 0) {
                nimActive = false;
                const statusEl = document.getElementById('nim-status');
                if (statusEl) statusEl.textContent = "bạn đã nhặt viên sỏi cuối. thiền sư thắng.";
                updateNimUI();
            } else {
                nimTimeout = setTimeout(nimBotMove, 1200);
            }
        }, 400);
    }

    document.getElementById('nim-take-1')?.addEventListener('click', () => nimPlayerTake(1));
    document.getElementById('nim-take-2')?.addEventListener('click', () => nimPlayerTake(2));
    document.getElementById('nim-take-3')?.addEventListener('click', () => nimPlayerTake(3));
    document.getElementById('reset-nim')?.addEventListener('click', startNim);

    // Hiệu ứng hover nhặt sỏi
    function highlightNimStones(count) {
        if (!nimActive || nimCurrentTurn !== "player") return;
        const stones = document.querySelectorAll('#nim-pile .nim-stone:not(.removed)');
        const start = Math.max(0, stones.length - count);
        for (let i = start; i < stones.length; i++) {
            stones[i].classList.add('taking');
        }
    }

    function clearHighlightNimStones() {
        const stones = document.querySelectorAll('#nim-pile .nim-stone');
        stones.forEach(s => s.classList.remove('taking'));
    }

    const t1 = document.getElementById('nim-take-1');
    const t2 = document.getElementById('nim-take-2');
    const t3 = document.getElementById('nim-take-3');

    t1?.addEventListener('mouseenter', () => highlightNimStones(1));
    t1?.addEventListener('mouseleave', clearHighlightNimStones);
    t2?.addEventListener('mouseenter', () => highlightNimStones(2));
    t2?.addEventListener('mouseleave', clearHighlightNimStones);
    t3?.addEventListener('mouseenter', () => highlightNimStones(3));
    t3?.addEventListener('mouseleave', clearHighlightNimStones);


    // --- GAME J: Ô ĂN QUAN ---
    let oanquanBoard = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10];
    let oanquanPlayerScore = 0;
    let oanquanBotScore = 0;
    let oanquanActive = false;
    let oanquanCurrentTurn = "player";
    let oanquanSelectedCell = -1;

    function startOanQuan() {
        if (oanquanTimeout) clearTimeout(oanquanTimeout);
        oanquanBoard = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10];
        oanquanPlayerScore = 0;
        oanquanBotScore = 0;
        oanquanActive = true;
        oanquanCurrentTurn = "player";
        oanquanSelectedCell = -1;

        const controls = document.getElementById('oanquan-controls');
        if (controls) controls.style.display = 'none';

        renderOanQuanBoard();
        const statusEl = document.getElementById('oanquan-status');
        if (statusEl) statusEl.textContent = "đến lượt của bạn. chọn một ô cờ để đi.";
    }

    function renderOanQuanBoard() {
        const pScoreEl = document.getElementById('oanquan-score-player');
        const bScoreEl = document.getElementById('oanquan-score-bot');
        if (pScoreEl) pScoreEl.textContent = `bạn: ${oanquanPlayerScore}`;
        if (bScoreEl) bScoreEl.textContent = `thiền sư: ${oanquanBotScore}`;

        for (let i = 0; i < 12; i++) {
            const cell = document.getElementById(`oanquan-cell-${i}`);
            if (cell) {
                cell.textContent = oanquanBoard[i];
                cell.className = "oanquan-cell";
                if (i === 10 || i === 11) {
                    cell.classList.add('oanquan-mandarin');
                } else {
                    if (oanquanSelectedCell === i) {
                        cell.classList.add('selected-cell');
                    }
                    if (i >= 0 && i <= 4 && oanquanBoard[i] > 0 && oanquanCurrentTurn === "player" && oanquanActive) {
                        cell.classList.add('player-playable');
                    }
                }
            }
        }
    }

    function getNextOanQuanIndex(curr, dir) {
        const ccwSequence = [0, 1, 2, 3, 4, 11, 5, 6, 7, 8, 9, 10];
        const idx = ccwSequence.indexOf(curr);
        if (dir === 1) {
            return ccwSequence[(idx + 1) % 12];
        } else {
            return ccwSequence[(idx + 11) % 12];
        }
    }

    function executeOanQuanMove(startIdx, dir) {
        let hand = oanquanBoard[startIdx];
        oanquanBoard[startIdx] = 0;
        let curr = startIdx;

        while (hand > 0) {
            curr = getNextOanQuanIndex(curr, dir);
            oanquanBoard[curr] += 1;
            hand -= 1;

            if (hand === 0) {
                let nextCell = getNextOanQuanIndex(curr, dir);
                if (oanquanBoard[nextCell] > 0 && nextCell !== 10 && nextCell !== 11) {
                    hand = oanquanBoard[nextCell];
                    oanquanBoard[nextCell] = 0;
                    curr = nextCell;
                } else if (nextCell === 10 || nextCell === 11) {
                    break;
                } else {
                    let checkCell = nextCell;
                    let canCapture = true;

                    while (canCapture) {
                        let target = getNextOanQuanIndex(checkCell, dir);
                        if (oanquanBoard[target] > 0) {
                            let pts = oanquanBoard[target];
                            oanquanBoard[target] = 0;
                            if (oanquanCurrentTurn === "player") {
                                oanquanPlayerScore += pts;
                            } else {
                                oanquanBotScore += pts;
                            }
                            
                            let pastTarget = getNextOanQuanIndex(target, dir);
                            if (oanquanBoard[pastTarget] === 0) {
                                checkCell = pastTarget;
                            } else {
                                canCapture = false;
                            }
                        } else {
                            canCapture = false;
                        }
                    }
                    break;
                }
            }
        }

        if (oanquanBoard[10] === 0 && oanquanBoard[11] === 0) {
            endOanQuan();
            return;
        }

        checkOanQuanEmptySide();
        renderOanQuanBoard();
    }

    function checkOanQuanEmptySide() {
        if (oanquanBoard[10] === 0 && oanquanBoard[11] === 0) return;

        let playerSideEmpty = true;
        for (let i = 0; i < 5; i++) {
            if (oanquanBoard[i] > 0) playerSideEmpty = false;
        }

        let botSideEmpty = true;
        for (let i = 5; i < 10; i++) {
            if (oanquanBoard[i] > 0) botSideEmpty = false;
        }

        if (playerSideEmpty && oanquanCurrentTurn === "player") {
            oanquanPlayerScore -= 5;
            for (let i = 0; i < 5; i++) oanquanBoard[i] = 1;
        }

        if (botSideEmpty && oanquanCurrentTurn === "bot") {
            oanquanBotScore -= 5;
            for (let i = 5; i < 10; i++) oanquanBoard[i] = 1;
        }
    }

    function endOanQuan() {
        oanquanActive = false;
        for (let i = 0; i < 5; i++) {
            oanquanPlayerScore += oanquanBoard[i];
            oanquanBoard[i] = 0;
        }
        for (let i = 5; i < 10; i++) {
            oanquanBotScore += oanquanBoard[i];
            oanquanBoard[i] = 0;
        }

        renderOanQuanBoard();
        const statusEl = document.getElementById('oanquan-status');
        if (statusEl) {
            if (oanquanPlayerScore > oanquanBotScore) {
                statusEl.textContent = `game kết thúc. bạn thắng (${oanquanPlayerScore} vs ${oanquanBotScore}).`;
            } else if (oanquanPlayerScore < oanquanBotScore) {
                statusEl.textContent = `game kết thúc. thiền sư thắng (${oanquanPlayerScore} vs ${oanquanBotScore}).`;
            } else {
                statusEl.textContent = `hòa cờ (${oanquanPlayerScore} đều).`;
            }
        }
        const controls = document.getElementById('oanquan-controls');
        if (controls) controls.style.display = 'none';
    }

    function oanquanBotMove() {
        if (!oanquanActive) return;

        let bestMove = -1;
        let bestDir = 1;
        let maxPoints = -1;
        const validMoves = [];

        for (let i = 5; i < 10; i++) {
            if (oanquanBoard[i] > 0) {
                validMoves.push({ cell: i, dir: 1 });
                validMoves.push({ cell: i, dir: -1 });
            }
        }

        if (validMoves.length === 0) {
            endOanQuan();
            return;
        }

        validMoves.forEach(mv => {
            const boardCopy = [...oanquanBoard];
            let pts = 0;
            let hand = boardCopy[mv.cell];
            boardCopy[mv.cell] = 0;
            let curr = mv.cell;
            while (hand > 0) {
                curr = getNextOanQuanIndex(curr, mv.dir);
                boardCopy[curr] += 1;
                hand -= 1;
                if (hand === 0) {
                    let nextCell = getNextOanQuanIndex(curr, mv.dir);
                    if (boardCopy[nextCell] > 0 && nextCell !== 10 && nextCell !== 11) {
                        hand = boardCopy[nextCell];
                        boardCopy[nextCell] = 0;
                        curr = nextCell;
                    } else if (nextCell === 10 || nextCell === 11) {
                        break;
                    } else {
                        let checkCell = nextCell;
                        let canCapture = true;
                        while (canCapture) {
                            let target = getNextOanQuanIndex(checkCell, mv.dir);
                            if (boardCopy[target] > 0) {
                                pts += boardCopy[target];
                                boardCopy[target] = 0;
                                let pastTarget = getNextOanQuanIndex(target, mv.dir);
                                if (boardCopy[pastTarget] === 0) {
                                    checkCell = pastTarget;
                                } else {
                                    canCapture = false;
                                }
                            } else {
                                canCapture = false;
                            }
                        }
                        break;
                    }
                }
            }

            if (pts > maxPoints) {
                maxPoints = pts;
                bestMove = mv.cell;
                bestDir = mv.dir;
            }
        });

        if (maxPoints === 0 && validMoves.length > 0) {
            const r = validMoves[Math.floor(Math.random() * validMoves.length)];
            bestMove = r.cell;
            bestDir = r.dir;
        }

        executeOanQuanMove(bestMove, bestDir);

        oanquanCurrentTurn = "player";
        const statusEl = document.getElementById('oanquan-status');
        if (statusEl) statusEl.textContent = "đến lượt của bạn. chọn một ô cờ để đi.";
        checkOanQuanEmptySide();
        renderOanQuanBoard();
    }

    // Gắn sự kiện click cho các ô từ 0-4
    for (let i = 0; i < 5; i++) {
        document.getElementById(`oanquan-cell-${i}`)?.addEventListener('click', (e) => {
            if (!oanquanActive || oanquanCurrentTurn !== "player") return;
            const idx = i;
            if (oanquanBoard[idx] === 0) return;

            oanquanSelectedCell = idx;
            renderOanQuanBoard(); // Vẽ lại để cập nhật màu viền ô chọn

            const selectedLbl = document.getElementById('oanquan-selected-lbl');
            if (selectedLbl) selectedLbl.textContent = `đã chọn ô: ${idx + 1} (có ${oanquanBoard[idx]} sỏi)`;

            const controls = document.getElementById('oanquan-controls');
            if (controls) controls.style.display = 'flex';
        });
    }

    document.getElementById('oanquan-dir-left')?.addEventListener('click', () => {
        if (oanquanSelectedCell === -1 || oanquanCurrentTurn !== "player") return;
        document.getElementById('oanquan-controls').style.display = 'none';
        executeOanQuanMove(oanquanSelectedCell, 1);

        oanquanSelectedCell = -1;
        if (oanquanActive) {
            oanquanCurrentTurn = "bot";
            const statusEl = document.getElementById('oanquan-status');
            if (statusEl) statusEl.textContent = "thiền sư đang suy ngẫm...";
            oanquanTimeout = setTimeout(oanquanBotMove, 1500);
        }
    });

    document.getElementById('oanquan-dir-right')?.addEventListener('click', () => {
        if (oanquanSelectedCell === -1 || oanquanCurrentTurn !== "player") return;
        document.getElementById('oanquan-controls').style.display = 'none';
        executeOanQuanMove(oanquanSelectedCell, -1);

        oanquanSelectedCell = -1;
        if (oanquanActive) {
            oanquanCurrentTurn = "bot";
            const statusEl = document.getElementById('oanquan-status');
            if (statusEl) statusEl.textContent = "thiền sư đang suy ngẫm...";
            oanquanTimeout = setTimeout(oanquanBotMove, 1500);
        }
    });

    document.getElementById('reset-oanquan')?.addEventListener('click', startOanQuan);


    // --- GAME K: MINI GO (CỜ VÂY 5X5) ---
    let minigoBoard = Array(25).fill(null);
    let minigoCurrentTurn = "black";
    let minigoActive = false;
    let minigoPassCount = 0;

    function startMiniGo() {
        if (minigoTimeout) clearTimeout(minigoTimeout);
        minigoBoard = Array(25).fill(null);
        minigoCurrentTurn = "black";
        minigoActive = true;
        minigoPassCount = 0;

        renderMiniGoBoard();
        updateMiniGoUI();
    }

    function renderMiniGoBoard() {
        const boardEl = document.getElementById('minigo-board');
        if (!boardEl) return;
        boardEl.innerHTML = "";

        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('button');
            cell.className = "minigo-cell";
            cell.dataset.index = i;
            cell.ariaLabel = `Giao điểm ${i + 1}`;

            if (minigoBoard[i]) {
                const stone = document.createElement('div');
                stone.className = `minigo-stone ${minigoBoard[i]}`;
                cell.appendChild(stone);
            }

            cell.addEventListener('click', (e) => {
                let target = e.target;
                if (target.classList.contains('minigo-stone')) {
                    target = target.parentElement;
                }
                const idx = parseInt(target.dataset.index, 10);
                handleMiniGoCellClick(idx);
            });

            boardEl.appendChild(cell);
        }
    }

    function updateMiniGoUI() {
        let bCount = 0;
        let wCount = 0;
        for (let i = 0; i < 25; i++) {
            if (minigoBoard[i] === "black") bCount++;
            if (minigoBoard[i] === "white") wCount++;
        }

        const bScoreEl = document.getElementById('minigo-score-player');
        const wScoreEl = document.getElementById('minigo-score-bot');
        if (bScoreEl) bScoreEl.textContent = `quân đen: ${bCount}`;
        if (wScoreEl) wScoreEl.textContent = `quân trắng: ${wCount}`;

        const statusEl = document.getElementById('minigo-status');
        if (statusEl) {
            if (minigoCurrentTurn === "black") {
                statusEl.textContent = "lượt của bạn (Đen)";
            } else {
                statusEl.textContent = "thiền sư đang suy ngẫm...";
            }
        }
    }

    function getMiniGoGroup(board, idx, color) {
        const group = [];
        const queue = [idx];
        const visited = new Set();
        visited.add(idx);

        while (queue.length > 0) {
            const curr = queue.shift();
            group.push(curr);

            const row = Math.floor(curr / 5);
            const col = curr % 5;

            const neighbors = [];
            if (row > 0) neighbors.push(curr - 5);
            if (row < 4) neighbors.push(curr + 5);
            if (col > 0) neighbors.push(curr - 1);
            if (col < 4) neighbors.push(curr + 1);

            neighbors.forEach(n => {
                if (!visited.has(n) && board[n] === color) {
                    visited.add(n);
                    queue.push(n);
                }
            });
        }
        return group;
    }

    function getMiniGoLiberties(board, group) {
        const liberties = new Set();
        group.forEach(idx => {
            const row = Math.floor(idx / 5);
            const col = idx % 5;

            const neighbors = [];
            if (row > 0) neighbors.push(idx - 5);
            if (row < 4) neighbors.push(idx + 5);
            if (col > 0) neighbors.push(idx - 1);
            if (col < 4) neighbors.push(idx + 1);

            neighbors.forEach(n => {
                if (board[n] === null) {
                    liberties.add(n);
                }
            });
        });
        return liberties.size;
    }

    function handleMiniGoCellClick(idx) {
        if (!minigoActive || minigoCurrentTurn !== "black") return;
        if (minigoBoard[idx] !== null) return;

        const boardCopy = [...minigoBoard];
        boardCopy[idx] = "black";

        let capturedAny = false;
        const row = Math.floor(idx / 5);
        const col = idx % 5;
        const neighbors = [];
        if (row > 0) neighbors.push(idx - 5);
        if (row < 4) neighbors.push(idx + 5);
        if (col > 0) neighbors.push(idx - 1);
        if (col < 4) neighbors.push(idx + 1);

        neighbors.forEach(n => {
            if (boardCopy[n] === "white") {
                const group = getMiniGoGroup(boardCopy, n, "white");
                const liberties = getMiniGoLiberties(boardCopy, group);
                if (liberties === 0) {
                    group.forEach(gIdx => boardCopy[gIdx] = null);
                    capturedAny = true;
                }
            }
        });

        if (!capturedAny) {
            const ownGroup = getMiniGoGroup(boardCopy, idx, "black");
            const ownLiberties = getMiniGoLiberties(boardCopy, ownGroup);
            if (ownLiberties === 0) {
                alert("nước đi không hợp lệ (không có khí/tự tử).");
                return;
            }
        }

        minigoBoard = boardCopy;
        minigoPassCount = 0;
        minigoCurrentTurn = "white";

        renderMiniGoBoard();
        updateMiniGoUI();

        minigoTimeout = setTimeout(minigoBotMove, 1200);
    }

    function minigoBotMove() {
        if (!minigoActive) return;

        let bestMove = -1;
        let maxCapture = -1;
        const validMoves = [];

        for (let i = 0; i < 25; i++) {
            if (minigoBoard[i] === null) {
                const boardCopy = [...minigoBoard];
                boardCopy[i] = "white";

                let captureCount = 0;
                const row = Math.floor(i / 5);
                const col = i % 5;
                const neighbors = [];
                if (row > 0) neighbors.push(i - 5);
                if (row < 4) neighbors.push(i + 5);
                if (col > 0) neighbors.push(i - 1);
                if (col < 4) neighbors.push(i + 1);

                neighbors.forEach(n => {
                    if (boardCopy[n] === "black") {
                        const group = getMiniGoGroup(boardCopy, n, "black");
                        if (getMiniGoLiberties(boardCopy, group) === 0) {
                            captureCount += group.length;
                        }
                    }
                });

                let isSuicide = false;
                if (captureCount === 0) {
                    const ownGroup = getMiniGoGroup(boardCopy, i, "white");
                    if (getMiniGoLiberties(boardCopy, ownGroup) === 0) {
                        isSuicide = true;
                    }
                }

                if (!isSuicide) {
                    validMoves.push(i);
                    if (captureCount > maxCapture) {
                        maxCapture = captureCount;
                        bestMove = i;
                    }
                }
            }
        }

        if (maxCapture <= 0 && validMoves.length > 0) {
            let chosenMove = -1;
            let bestLibs = -1;
            
            validMoves.sort(() => Math.random() - 0.5);
            
            for (let i = 0; i < validMoves.length; i++) {
                const mv = validMoves[i];
                const boardCopy = [...minigoBoard];
                boardCopy[mv] = "white";
                const group = getMiniGoGroup(boardCopy, mv, "white");
                const libs = getMiniGoLiberties(boardCopy, group);
                if (libs > bestLibs) {
                    bestLibs = libs;
                    chosenMove = mv;
                }
            }
            bestMove = chosenMove !== -1 ? chosenMove : validMoves[0];
        }

        if (bestMove !== -1) {
            minigoBoard[bestMove] = "white";
            const row = Math.floor(bestMove / 5);
            const col = bestMove % 5;
            const neighbors = [];
            if (row > 0) neighbors.push(bestMove - 5);
            if (row < 4) neighbors.push(bestMove + 5);
            if (col > 0) neighbors.push(bestMove - 1);
            if (col < 4) neighbors.push(bestMove + 1);

            neighbors.forEach(n => {
                if (minigoBoard[n] === "black") {
                    const group = getMiniGoGroup(minigoBoard, n, "black");
                    if (getMiniGoLiberties(minigoBoard, group) === 0) {
                        group.forEach(gIdx => minigoBoard[gIdx] = null);
                    }
                }
            });

            minigoPassCount = 0;
            minigoCurrentTurn = "black";
            renderMiniGoBoard();
            updateMiniGoUI();
        } else {
            minigoPassCount++;
            minigoCurrentTurn = "black";
            const statusEl = document.getElementById('minigo-status');
            if (statusEl) statusEl.textContent = "thiền sư đã bỏ lượt. đến lượt bạn.";
            if (minigoPassCount >= 2) {
                endMiniGo();
            } else {
                updateMiniGoUI();
            }
        }
    }

    document.getElementById('minigo-pass')?.addEventListener('click', () => {
        if (!minigoActive || minigoCurrentTurn !== "black") return;
        minigoPassCount++;
        minigoCurrentTurn = "white";
        updateMiniGoUI();

        if (minigoPassCount >= 2) {
            endMiniGo();
        } else {
            minigoTimeout = setTimeout(minigoBotMove, 1200);
        }
    });

    function endMiniGo() {
        minigoActive = false;
        let bCount = 0;
        let wCount = 0;
        for (let i = 0; i < 25; i++) {
            if (minigoBoard[i] === "black") bCount++;
            if (minigoBoard[i] === "white") wCount++;
        }

        const statusEl = document.getElementById('minigo-status');
        if (statusEl) {
            if (bCount > wCount) {
                statusEl.textContent = `trận đấu kết thúc. đen thắng (${bCount} vs ${wCount}).`;
            } else if (bCount < wCount) {
                statusEl.textContent = `trận đấu kết thúc. trắng thắng (${bCount} vs ${wCount}).`;
            } else {
                statusEl.textContent = `hòa cờ (${bCount} đều).`;
            }
        }
    }

    document.getElementById('reset-minigo')?.addEventListener('click', startMiniGo);


    // --- GAME L: ZEN MASTERMIND (DÒ MÃ CẢM XÚC) ---
    const MM_SYMBOLS = ["🌸", "🍃", "💧", "🌙", "🪵", "☀️"];
    let mastermindSecret = [];
    let mastermindHistory = [];
    let mastermindGuess = ["🌸", "🌸", "🌸", "🌸"];
    let mastermindAttempts = 0;
    let mastermindActive = false;

    function startMastermind() {
        if (mastermindTimeout) clearTimeout(mastermindTimeout);
        mastermindSecret = Array.from({ length: 4 }, () => MM_SYMBOLS[Math.floor(Math.random() * 6)]);
        mastermindHistory = [];
        mastermindGuess = ["🌸", "🌸", "🌸", "🌸"];
        mastermindAttempts = 0;
        mastermindActive = true;

        renderMastermindBoard();
        updateMastermindSlots();
        const statusEl = document.getElementById('mastermind-status');
        if (statusEl) statusEl.textContent = "lượt đoán 1/8. hãy chọn biểu tượng.";
    }

    function renderMastermindBoard() {
        const boardEl = document.getElementById('mastermind-board');
        if (!boardEl) return;
        boardEl.innerHTML = "";

        mastermindHistory.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = "mastermind-row";

            const guessDiv = document.createElement('div');
            guessDiv.className = "mastermind-row-guess";
            row.guess.forEach(sym => {
                const peg = document.createElement('span');
                peg.className = "mastermind-row-peg";
                peg.textContent = sym;
                guessDiv.appendChild(peg);
            });

            const feedDiv = document.createElement('div');
            feedDiv.className = "mastermind-row-feedback";
            
            for (let i = 0; i < row.black; i++) {
                const dot = document.createElement('div');
                dot.className = "mastermind-feedback-dot black";
                feedDiv.appendChild(dot);
            }
            for (let i = 0; i < row.white; i++) {
                const dot = document.createElement('div');
                dot.className = "mastermind-feedback-dot white";
                feedDiv.appendChild(dot);
            }
            const emptyDots = 4 - row.black - row.white;
            for (let i = 0; i < emptyDots; i++) {
                const dot = document.createElement('div');
                dot.className = "mastermind-feedback-dot";
                feedDiv.appendChild(dot);
            }

            rowDiv.appendChild(guessDiv);
            rowDiv.appendChild(feedDiv);
            boardEl.appendChild(rowDiv);
        });

        boardEl.scrollTop = boardEl.scrollHeight;
    }

    function updateMastermindSlots() {
        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById(`mm-slot-${i}`);
            if (slot) slot.textContent = mastermindGuess[i];
        }
    }

    document.querySelectorAll('.mastermind-slot').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!mastermindActive) return;
            const idx = parseInt(e.target.dataset.idx, 10);
            const currSym = mastermindGuess[idx];
            const currIdx = MM_SYMBOLS.indexOf(currSym);
            const nextSym = MM_SYMBOLS[(currIdx + 1) % 6];
            mastermindGuess[idx] = nextSym;
            updateMastermindSlots();
        });
    });

    document.getElementById('mastermind-submit')?.addEventListener('click', () => {
        if (!mastermindActive) return;

        let black = 0;
        let white = 0;
        const secretCopy = [...mastermindSecret];
        const guessCopy = [...mastermindGuess];

        for (let i = 0; i < 4; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                black++;
                secretCopy[i] = null;
                guessCopy[i] = null;
            }
        }

        for (let i = 0; i < 4; i++) {
            if (guessCopy[i] !== null) {
                const sIdx = secretCopy.indexOf(guessCopy[i]);
                if (sIdx !== -1) {
                    white++;
                    secretCopy[sIdx] = null;
                }
            }
        }

        mastermindHistory.push({
            guess: [...mastermindGuess],
            black,
            white
        });

        mastermindAttempts++;
        renderMastermindBoard();

        const statusEl = document.getElementById('mastermind-status');
        if (black === 4) {
            mastermindActive = false;
            if (statusEl) statusEl.textContent = "chúc mừng! bạn đã dò được mã cảm xúc.";
        } else if (mastermindAttempts >= 8) {
            mastermindActive = false;
            if (statusEl) statusEl.textContent = `bạn đã hết lượt. mã đúng là: ${mastermindSecret.join(' ')}`;
        } else {
            if (statusEl) statusEl.textContent = `lượt đoán ${mastermindAttempts + 1}/8.`;
        }
    });

    document.getElementById('reset-mastermind')?.addEventListener('click', startMastermind);


    // --- GAME M: ZEN MEMORY MATCH (CẶP ĐÔI ĐỒNG ĐIỆU) ---
    const MEM_SYMBOLS = ["🌸", "🍃", "💧", "🌙", "🪵", "☀️", "🕯️", "🏔️"];
    let memoryCards = [];
    let memoryPlayerScore = 0;
    let memoryBotScore = 0;
    let memoryTurn = "player";
    let memorySelected = [];
    let memoryActive = false;
    let memoryKnownCards = {};

    function startMemory() {
        if (memoryTimeout) clearTimeout(memoryTimeout);
        memoryPlayerScore = 0;
        memoryBotScore = 0;
        memoryTurn = "player";
        memorySelected = [];
        memoryActive = true;
        memoryKnownCards = {};

        const pool = [...MEM_SYMBOLS, ...MEM_SYMBOLS].sort(() => Math.random() - 0.5);
        memoryCards = pool.map((sym, idx) => ({
            id: idx,
            symbol: sym,
            flipped: false,
            matched: false
        }));

        renderMemoryGrid();
        updateMemoryScoreboard();
    }

    function renderMemoryGrid() {
        const grid = document.getElementById('memory-grid');
        if (!grid) return;
        grid.innerHTML = "";

        memoryCards.forEach((card, idx) => {
            const cardEl = document.createElement('div');
            cardEl.className = "memory-card";
            if (card.flipped) cardEl.classList.add('flipped');
            if (card.matched) cardEl.classList.add('matched');

            const inner = document.createElement('div');
            inner.className = "memory-card-inner";

            const front = document.createElement('div');
            front.className = "memory-card-front";

            const back = document.createElement('div');
            back.className = "memory-card-back";
            back.textContent = card.symbol;

            inner.appendChild(front);
            inner.appendChild(back);
            cardEl.appendChild(inner);

            cardEl.addEventListener('click', () => {
                if (memoryTurn !== "player" || memorySelected.length >= 2 || card.flipped || card.matched) return;
                
                card.flipped = true;
                cardEl.classList.add('flipped');
                memorySelected.push(idx);
                
                memoryKnownCards[idx] = card.symbol;

                if (memorySelected.length === 2) {
                    memoryTimeout = setTimeout(checkMemoryMatch, 1000);
                }
            });

            grid.appendChild(cardEl);
        });
    }

    function updateMemoryScoreboard() {
        const pScoreEl = document.getElementById('memory-score-player');
        const bScoreEl = document.getElementById('memory-score-bot');
        if (pScoreEl) pScoreEl.textContent = `bạn: ${memoryPlayerScore}`;
        if (bScoreEl) bScoreEl.textContent = `thiền sư: ${memoryBotScore}`;

        const statusEl = document.getElementById('memory-status');
        if (statusEl) {
            if (memoryTurn === "player") {
                statusEl.textContent = "đến lượt của bạn";
            } else {
                statusEl.textContent = "thiền sư đang tìm quân cờ...";
            }
        }
    }

    function checkMemoryMatch() {
        if (!memoryActive) return;

        const [idx1, idx2] = memorySelected;
        const card1 = memoryCards[idx1];
        const card2 = memoryCards[idx2];

        if (card1.symbol === card2.symbol) {
            card1.matched = true;
            card2.matched = true;
            
            delete memoryKnownCards[idx1];
            delete memoryKnownCards[idx2];

            if (memoryTurn === "player") {
                memoryPlayerScore++;
            } else {
                memoryBotScore++;
            }

            memorySelected = [];
            updateMemoryScoreboard();
            renderMemoryGrid();

            const allMatched = memoryCards.every(c => c.matched);
            if (allMatched) {
                memoryActive = false;
                const statusEl = document.getElementById('memory-status');
                if (statusEl) {
                    if (memoryPlayerScore > memoryBotScore) {
                        statusEl.textContent = `bạn thắng thiền sư (${memoryPlayerScore} vs ${memoryBotScore}).`;
                    } else if (memoryPlayerScore < memoryBotScore) {
                        statusEl.textContent = `thiền sư thắng cuộc (${memoryPlayerScore} vs ${memoryBotScore}).`;
                    } else {
                        statusEl.textContent = `hòa cờ (${memoryPlayerScore} đều).`;
                    }
                }
            } else {
                if (memoryTurn === "bot") {
                    memoryTimeout = setTimeout(memoryBotTurn, 1000);
                }
            }
        } else {
            card1.flipped = false;
            card2.flipped = false;
            memorySelected = [];
            
            renderMemoryGrid();

            memoryTurn = memoryTurn === "player" ? "bot" : "player";
            updateMemoryScoreboard();

            if (memoryTurn === "bot") {
                memoryTimeout = setTimeout(memoryBotTurn, 1000);
            }
        }
    }

    function memoryBotTurn() {
        if (!memoryActive) return;

        let match1 = -1;
        let match2 = -1;

        const knownIndices = Object.keys(memoryKnownCards).map(Number);
        for (let i = 0; i < knownIndices.length; i++) {
            for (let j = i + 1; j < knownIndices.length; j++) {
                const idx1 = knownIndices[i];
                const idx2 = knownIndices[j];
                if (memoryKnownCards[idx1] === memoryKnownCards[idx2] && idx1 !== idx2) {
                    match1 = idx1;
                    match2 = idx2;
                    break;
                }
            }
            if (match1 !== -1) break;
        }

        if (match1 !== -1 && match2 !== -1) {
            flipBotCard(match1);
            memoryTimeout = setTimeout(() => {
                flipBotCard(match2);
                memoryTimeout = setTimeout(checkMemoryMatch, 1000);
            }, 800);
            return;
        }

        const unmatchedIndices = memoryCards.map((c, i) => c.matched || c.flipped ? -1 : i).filter(i => i !== -1);
        if (unmatchedIndices.length === 0) return;

        const firstChoice = unmatchedIndices[Math.floor(Math.random() * unmatchedIndices.length)];
        flipBotCard(firstChoice);

        const symbolToFind = memoryCards[firstChoice].symbol;
        let secondChoice = -1;

        for (const [idxStr, sym] of Object.entries(memoryKnownCards)) {
            const idx = Number(idxStr);
            if (sym === symbolToFind && idx !== firstChoice && !memoryCards[idx].matched) {
                if (Math.random() < 0.8) {
                    secondChoice = idx;
                }
                break;
            }
        }

        memoryTimeout = setTimeout(() => {
            if (secondChoice === -1) {
                const remainingUnmatched = unmatchedIndices.filter(i => i !== firstChoice);
                if (remainingUnmatched.length > 0) {
                    secondChoice = remainingUnmatched[Math.floor(Math.random() * remainingUnmatched.length)];
                }
            }

            if (secondChoice !== -1) {
                flipBotCard(secondChoice);
                memoryTimeout = setTimeout(checkMemoryMatch, 1000);
            }
        }, 1000);
    }

    function flipBotCard(idx) {
        memoryCards[idx].flipped = true;
        memorySelected.push(idx);
        memoryKnownCards[idx] = memoryCards[idx].symbol;
        renderMemoryGrid();
    }

    document.getElementById('reset-memory')?.addEventListener('click', startMemory);


    // --- GAME CONTROLS & KEYDOWN ACTIONS ---
    window.addEventListener('keydown', (e) => {
        if (currentActiveGame === '2048' || currentActiveGame === 'snake') {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 's', 'a', 'd'].includes(e.key)) {
                e.preventDefault();
            }
        }

        if (currentActiveGame === '2048') {
            if (e.key === 'ArrowLeft' || e.key === 'a') handle2048Move('left');
            else if (e.key === 'ArrowRight' || e.key === 'd') handle2048Move('right');
            else if (e.key === 'ArrowUp' || e.key === 'w') handle2048Move('up');
            else if (e.key === 'ArrowDown' || e.key === 's') handle2048Move('down');
        }

        if (currentActiveGame === 'snake' && snakeRunning) {
            if ((e.key === 'ArrowUp' || e.key === 'w') && snakeDir.y === 0) snakeNextDir = { x: 0, y: -1 };
            else if ((e.key === 'ArrowDown' || e.key === 's') && snakeDir.y === 0) snakeNextDir = { x: 0, y: 1 };
            else if ((e.key === 'ArrowLeft' || e.key === 'a') && snakeDir.x === 0) snakeNextDir = { x: -1, y: 0 };
            else if ((e.key === 'ArrowRight' || e.key === 'd') && snakeDir.x === 0) snakeNextDir = { x: 1, y: 0 };
        }
    });

    // --- BÍ MẬT: PHÍM TẮT ---
    let secretBuffer = "";
    window.addEventListener('keydown', (e) => {
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            secretBuffer += e.key.toLowerCase();
            if (secretBuffer.length > 20) {
                secretBuffer = secretBuffer.substring(secretBuffer.length - 20);
            }
            if (secretBuffer.endsWith("write")) {
                window.location.href = "write.html";
            } else if (secretBuffer.endsWith("mood")) {
                openMoodDrawer();
            }
        }
    });
});
