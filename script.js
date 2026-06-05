document.addEventListener('DOMContentLoaded', () => {

    /* =============================================================
       CẤU HÌNH KHÓA MẬT KHẨU (PASSWORD LOCK)
       Đặt là true nếu bạn muốn khóa trang web bằng file writings.enc đã mã hóa.
       Đặt là false nếu bạn muốn mở tự do (dùng bài viết tĩnh trong index.html).
       ============================================================= */
    const USE_PASSWORD_LOCK = false;

    /* =============================================================
       CẤU HÌNH LIÊN KẾT GOOGLE APPS SCRIPT WEB APP
       Dán URL Apps Script Web App của bạn vào đây (Xem README.md)
       Nếu để trống "", trang web sẽ tự động sử dụng file writings.enc mã hóa cục bộ.
       ============================================================= */
    const GOOGLE_APPS_SCRIPT_URL = "/api/sheet";

    const UNLOCK_API_URL = "/api/unlock";
    const PRIVATE_ABOUT_ENCRYPTED_URL = "about.enc?v=20260604-about-utf8";
    const ENCRYPTED_PRIVATE_ABOUT = [
        "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",
    ].join("");
    const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

    // Lưu trữ mật mã hiện tại để mã hóa các thông tin nhập thêm (mood, note)
    let currentPasscode = "";
    let privateSessionToken = "";

    const APP_I18N = {
        vi: {
            "nav.writings": "writings",
            "nav.journal": "journal",
            "nav.games": "games",
            "nav.pineapple": "góc của dứa 🍍",
            "nav.sanctuary": "sanctuary",
            "nav.contact": "contact",
            "hero.intro": "một người hướng nội đang học cách nói chậm hơn.",
            "hero.read": "[ đọc một chút ]",
            "hero.enter": "[ bước vào góc bình yên ]",
            "message.label": "gửi lời nhắn tới introvert",
            "message.placeholder": "để lại vài dòng trước khi rời đi...",
            "message.send": "gửi",
            "message.empty": "hãy viết một lời nhắn.",
            "message.sheetMissing": "chưa cấu hình sheet.",
            "message.sending": "đang gửi...",
            "message.sent": "đã gửi.",
            "message.fail": "chưa gửi được.",
            "password.hint": "Không gian riêng tư. Vui lòng nhập mật mã 6 số để mở khóa.",
            "password.unlock": "mở khóa",
            "about.kicker": "about",
            "about.title": "tôi là một người hướng nội.",
            "about.p1": "Tôi thường hiểu thế giới bằng những khoảng lặng: một buổi chiều ít tiếng động, một đoạn nhạc nhỏ, vài dòng chữ viết ra rồi để yên.",
            "about.p2": "Trang này là nơi tôi giữ lại những suy nghĩ chậm. Không phải để ồn ào hơn, chỉ để những điều khó nói có một chỗ đủ mềm để tồn tại.",
            "about.privateLabel": "bản giới thiệu đầy đủ",
            "about.privateDesc": "phần này riêng tư hơn, cần mã khóa để đọc.",
            "about.unlock": "đọc bản đầy đủ",
            "spaces.writings": "những bài viết riêng, mở bằng mật mã.",
            "spaces.journal": "nhật ký dài hơn, lưu trên Sheet.",
            "spaces.games": "những trò chơi tĩnh lặng, không ồn ào.",
            "spaces.pineapple": "khoảnh khắc đáng yêu, nhật ký của dứa.",
            "spaces.sanctuary": "mood, âm thanh, thư tương lai và vài trò chơi nhỏ.",
            "spaces.messages": "những lời nhắn được giữ lại sau khi mở khóa.",
            "music.kicker": "music",
            "music.title": "một nền âm thanh nhỏ.",
            "music.play": "phát",
            "music.clear": "xóa",
            "music.rain": "mưa",
            "music.sea": "sóng",
            "music.off": "tắt",
            "music.nowPlaying": "now playing",
            "music.opening": "đang mở",
            "music.playing": "đang phát",
            "music.stopped": "đã tắt âm nền.",
            "music.invalid": "link chưa hợp lệ.",
            "music.protocol": "chỉ hỗ trợ link http hoặc https.",
            "music.youtubeError": "chưa đọc được link YouTube này.",
            "music.spotifyError": "chưa đọc được link Spotify này.",
            "music.unsupported": "link này chưa được hỗ trợ.",
            "contact.lead": "nếu muốn, bạn có thể ghé qua một góc nhỏ khác của tôi.",
            "theme.toLight": "sáng",
            "theme.toDark": "tối",
            "theme.lightAria": "Chuyển sang giao diện sáng",
            "theme.darkAria": "Chuyển sang giao diện tối",
            "ambient.rain": "tiếng mưa rơi",
            "ambient.sea": "tiếng sóng biển",
            "ambient.mix": "hòa âm"
        },
        en: {
            "nav.writings": "writings",
            "nav.journal": "journal",
            "nav.games": "games",
            "nav.pineapple": "pineapple's corner 🍍",
            "nav.sanctuary": "sanctuary",
            "nav.contact": "contact",
            "hero.intro": "an introvert learning to speak more slowly.",
            "hero.read": "[ read a little ]",
            "hero.enter": "[ enter the quiet corner ]",
            "message.label": "send a note to introvert",
            "message.placeholder": "leave a few lines before you go...",
            "message.send": "send",
            "message.empty": "please write a note first.",
            "message.sheetMissing": "Sheet is not configured yet.",
            "message.sending": "sending...",
            "message.sent": "sent.",
            "message.fail": "could not send.",
            "password.hint": "A private space. Enter the 6-digit passcode to unlock.",
            "password.unlock": "unlock",
            "about.kicker": "about",
            "about.title": "i am an introvert.",
            "about.p1": "I often understand the world through quiet spaces: a low-noise afternoon, a small piece of music, a few lines written down and left alone.",
            "about.p2": "This site is where I keep slow thoughts. Not to become louder, only to give difficult things a soft enough place to exist.",
            "about.privateLabel": "full introduction",
            "about.privateDesc": "this part is more private and needs a passcode to read.",
            "about.unlock": "read the full version",
            "spaces.writings": "private writings, opened with a passcode.",
            "spaces.journal": "a longer journal, stored in Sheet.",
            "spaces.games": "quiet games, without the noise.",
            "spaces.pineapple": "lovely moments, pineapple's journal.",
            "spaces.sanctuary": "mood, sound, future letters and a few small games.",
            "spaces.messages": "notes kept after unlocking.",
            "music.kicker": "music",
            "music.title": "a small layer of sound.",
            "music.play": "play",
            "music.clear": "clear",
            "music.rain": "rain",
            "music.sea": "waves",
            "music.off": "off",
            "music.nowPlaying": "now playing",
            "music.opening": "opening",
            "music.playing": "playing",
            "music.stopped": "sound turned off.",
            "music.invalid": "this link is not valid.",
            "music.protocol": "only http and https links are supported.",
            "music.youtubeError": "this YouTube link could not be read.",
            "music.spotifyError": "this Spotify link could not be read.",
            "music.unsupported": "this link is not supported yet.",
            "contact.lead": "if you want, you can pass by another small corner of mine.",
            "theme.toLight": "light",
            "theme.toDark": "dark",
            "theme.lightAria": "Switch to light theme",
            "theme.darkAria": "Switch to dark theme",
            "ambient.rain": "rain",
            "ambient.sea": "ocean waves",
            "ambient.mix": "soundscape"
        }
    };

    function detectAppLanguage() {
        const saved = localStorage.getItem('introvert_lang');
        if (saved === 'vi' || saved === 'en') return saved;
        const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'vi'];
        const firstSupported = languages.find(lang => /^vi\b|^en\b/i.test(lang));
        return firstSupported && firstSupported.toLowerCase().startsWith('en') ? 'en' : 'vi';
    }

    const appLang = detectAppLanguage();
    document.documentElement.lang = appLang;
    document.documentElement.dataset.lang = appLang;

    function t(key) {
        return APP_I18N[appLang]?.[key] || APP_I18N.vi[key] || key;
    }

    function applyI18n(root = document) {
        root.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.dataset.i18n);
        });
        root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
        });
        root.querySelectorAll('[data-i18n-aria]').forEach(el => {
            el.setAttribute('aria-label', t(el.dataset.i18nAria));
        });
    }

    applyI18n();

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
            themeToggleBtn.textContent = theme === 'dark' ? t('theme.toLight') : t('theme.toDark');
            themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? t('theme.lightAria') : t('theme.darkAria'));
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
            if (statusEl) statusEl.textContent = t('message.empty');
            inputEl.focus();
            return;
        }

        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.trim() === "") {
            if (statusEl) statusEl.textContent = t('message.sheetMissing');
            return;
        }

        buttonEl.disabled = true;
        if (statusEl) statusEl.textContent = t('message.sending');

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
            if (statusEl) statusEl.textContent = t('message.sent');
        } catch (err) {
            console.error("Lỗi gửi lời nhắn:", err);
            if (statusEl) statusEl.textContent = t('message.fail');
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
    const headerNowPlaying = document.getElementById('header-now-playing');
    const headerNowPlayingTitle = document.getElementById('header-now-playing-title');

    function setHeaderNowPlaying(title) {
        const cleanTitle = String(title || "").trim();
        if (!headerNowPlaying || !headerNowPlayingTitle || !cleanTitle) return;
        headerNowPlayingTitle.textContent = cleanTitle;
        headerNowPlaying.hidden = false;
        headerNowPlaying.classList.add('is-visible');
        headerNowPlaying.setAttribute('title', `${t('music.nowPlaying')}: ${cleanTitle}`);
    }

    function clearHeaderNowPlaying() {
        if (!headerNowPlaying || !headerNowPlayingTitle) return;
        headerNowPlayingTitle.textContent = "";
        headerNowPlaying.hidden = true;
        headerNowPlaying.classList.remove('is-visible');
        headerNowPlaying.removeAttribute('title');
    }

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
            document.getElementById('mixer-val-rain').textContent = t('music.off');
            document.getElementById('mixer-val-sea').textContent = t('music.off');
            document.getElementById('mixer-val-lofi').textContent = t('music.off');
            rainAudio.volume = 0; rainAudio.pause();
            seaAudio.volume = 0; seaAudio.pause();
            lofiAudio.volume = 0; lofiAudio.pause();
            clearHeaderNowPlaying();
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
            document.getElementById('mixer-val-sea').textContent = t('music.off');
            seaAudio.volume = 0; seaAudio.pause();
            document.getElementById('mixer-lofi').value = 0;
            document.getElementById('mixer-val-lofi').textContent = t('music.off');
            lofiAudio.volume = 0; lofiAudio.pause();
        } else if (trackName === "sea") {
            document.getElementById('mixer-sea').value = 40;
            document.getElementById('mixer-val-sea').textContent = '40%';
            seaAudio.volume = 0.4; seaAudio.play().catch(e => console.log(e));
            document.getElementById('mixer-rain').value = 0;
            document.getElementById('mixer-val-rain').textContent = t('music.off');
            rainAudio.volume = 0; rainAudio.pause();
            document.getElementById('mixer-lofi').value = 0;
            document.getElementById('mixer-val-lofi').textContent = t('music.off');
            lofiAudio.volume = 0; lofiAudio.pause();
        } else if (trackName === "lofi") {
            document.getElementById('mixer-lofi').value = 40;
            document.getElementById('mixer-val-lofi').textContent = '40%';
            lofiAudio.volume = 0.4;
            if (!lofiAudio.src) playLofiTrack(currentLofiIndex); else lofiAudio.play().catch(e => console.log(e));
            document.getElementById('mixer-rain').value = 0;
            document.getElementById('mixer-val-rain').textContent = t('music.off');
            rainAudio.volume = 0; rainAudio.pause();
            document.getElementById('mixer-sea').value = 0;
            document.getElementById('mixer-val-sea').textContent = t('music.off');
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
            clearHeaderNowPlaying();
            if (trackTitleEl) {
                trackTitleEl.classList.remove('is-visible');
                setTimeout(() => { if (!trackTitleEl.classList.contains('is-visible')) trackTitleEl.textContent = ""; }, 600);
            }
        } else if (activeCount === 1) {
            if (rainVol > 0) {
                const title = t('ambient.rain');
                const btn = document.querySelector('.ambient-track-btn[data-track="rain"]');
                if (btn) btn.classList.add('active');
                if (trackTitleEl) { trackTitleEl.textContent = `${t('music.playing')}: ${title}`; trackTitleEl.classList.add('is-visible'); }
                setHeaderNowPlaying(title);
            } else if (seaVol > 0) {
                const title = t('ambient.sea');
                const btn = document.querySelector('.ambient-track-btn[data-track="sea"]');
                if (btn) btn.classList.add('active');
                if (trackTitleEl) { trackTitleEl.textContent = `${t('music.playing')}: ${title}`; trackTitleEl.classList.add('is-visible'); }
                setHeaderNowPlaying(title);
            } else if (lofiVol > 0) {
                const btn = document.querySelector('.ambient-track-btn[data-track="lofi"]');
                if (btn) btn.classList.add('active');
                const track = shuffledLofiTracks[currentLofiIndex] || LOFI_PLAYLIST[0];
                if (trackTitleEl) {
                    trackTitleEl.textContent = `${t('music.playing')}: ${track.title.toLowerCase()}`;
                    trackTitleEl.classList.add('is-visible');
                }
                setHeaderNowPlaying(track.title.toLowerCase());
            }
        } else {
            const title = t('ambient.mix');
            if (trackTitleEl) { trackTitleEl.textContent = `${t('music.playing')}: ${title}`; trackTitleEl.classList.add('is-visible'); }
            setHeaderNowPlaying(title);
        }
    }

    document.getElementById('mixer-rain').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('mixer-val-rain').textContent = val > 0 ? `${val}%` : t('music.off');
        rainAudio.volume = val / 100;
        if (val > 0 && rainAudio.paused) rainAudio.play().catch(err => console.log(err));
        else if (val === 0 && !rainAudio.paused) rainAudio.pause();
        updateFooterAmbientUI();
    });

    document.getElementById('mixer-sea').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('mixer-val-sea').textContent = val > 0 ? `${val}%` : t('music.off');
        seaAudio.volume = val / 100;
        if (val > 0 && seaAudio.paused) seaAudio.play().catch(err => console.log(err));
        else if (val === 0 && !seaAudio.paused) seaAudio.pause();
        updateFooterAmbientUI();
    });

    document.getElementById('mixer-lofi').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('mixer-val-lofi').textContent = val > 0 ? `${val}%` : t('music.off');
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

    const homeMusicForm = document.getElementById('home-music-form');
    const homeMusicInput = document.getElementById('home-music-url');
    const homeMusicEmbed = document.getElementById('home-music-embed');
    const homeMusicStatus = document.getElementById('home-music-status');
    const homeMusicClear = document.getElementById('home-music-clear');
    const homeMusicPresets = document.querySelectorAll('.home-music-preset');

    function setHomeMusicStatus(text) {
        if (homeMusicStatus) homeMusicStatus.textContent = text || "";
    }

    function getYouTubeEmbed(url) {
        const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
        const parts = url.pathname.split('/').filter(Boolean);
        let videoId = "";

        if (host === 'youtu.be') {
            videoId = parts[0] || "";
        } else if (host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
            if (parts[0] === 'watch') videoId = url.searchParams.get('v') || "";
            if (['embed', 'shorts', 'live'].includes(parts[0])) videoId = parts[1] || "";
        }

        const playlistId = url.searchParams.get('list') || "";
        const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
        if (playlistId) params.set('list', playlistId);

        if (/^[\w-]{11}$/.test(videoId)) {
            return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
        }
        if (/^[\w-]+$/.test(playlistId)) {
            return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`;
        }
        return "";
    }

    function getSpotifyEmbed(url) {
        if (!url.hostname.replace(/^www\./, '').endsWith('open.spotify.com')) return "";
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0]?.startsWith('intl-')) parts.shift();
        const [type, id] = parts;
        const allowed = ['track', 'album', 'playlist', 'episode', 'show', 'artist'];
        if (!allowed.includes(type) || !/^[A-Za-z0-9]+$/.test(id || "")) return "";
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    }

    function getTitleFromUrl(url) {
        const lastPart = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || "");
        return lastPart
            .replace(/\.(mp3|ogg|wav|m4a|aac)$/i, '')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function cleanMusicTitle(title, fallback = "") {
        return String(title || fallback || "")
            .replace(/\s*-\s*YouTube\s*$/i, '')
            .replace(/\s*\|\s*Spotify\s*$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async function fetchJsonWithTimeout(url, timeout = 2800) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) throw new Error(`metadata ${response.status}`);
            return await response.json();
        } finally {
            clearTimeout(timer);
        }
    }

    async function resolveMusicTitle(source, originalUrl = "") {
        if (!source) return "";
        if (source.kind === 'audio') {
            try {
                return cleanMusicTitle(getTitleFromUrl(new URL(source.src)), source.fallbackTitle);
            } catch (_) {
                return source.fallbackTitle || source.provider;
            }
        }

        const urls = source.metadataUrls || [];
        for (const endpoint of urls) {
            try {
                const data = await fetchJsonWithTimeout(endpoint);
                const title = cleanMusicTitle(data.title || data.name, source.fallbackTitle);
                if (title) return title;
            } catch (_) {}
        }

        if (originalUrl) {
            try {
                const parsed = new URL(originalUrl);
                const fallback = cleanMusicTitle(getTitleFromUrl(parsed), source.fallbackTitle);
                if (fallback) return fallback;
            } catch (_) {}
        }
        return source.fallbackTitle || source.provider || "";
    }

    function resolveMusicSource(value) {
        const raw = value.trim();
        if (!raw) return null;

        let url;
        try {
            url = new URL(raw);
        } catch (_) {
            return { error: t('music.invalid') };
        }

        if (!['http:', 'https:'].includes(url.protocol)) {
            return { error: t('music.protocol') };
        }

        const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
        const path = url.pathname.toLowerCase();

        if (host === 'youtu.be' || host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
            const src = getYouTubeEmbed(url);
            return src ? {
                kind: 'iframe',
                provider: 'youtube',
                src,
                title: 'YouTube player',
                fallbackTitle: 'YouTube',
                metadataUrls: [
                    `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url.href)}`,
                    `https://noembed.com/embed?url=${encodeURIComponent(url.href)}`
                ]
            } : { error: t('music.youtubeError') };
        }

        if (host.endsWith('open.spotify.com')) {
            const src = getSpotifyEmbed(url);
            return src ? {
                kind: 'iframe',
                provider: 'spotify',
                src,
                title: 'Spotify player',
                fallbackTitle: 'Spotify',
                metadataUrls: [
                    `https://open.spotify.com/oembed?url=${encodeURIComponent(url.href)}`,
                    `https://noembed.com/embed?url=${encodeURIComponent(url.href)}`
                ]
            } : { error: t('music.spotifyError') };
        }

        if (host.endsWith('soundcloud.com')) {
            return {
                kind: 'iframe',
                provider: 'soundcloud',
                src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.href)}&color=%23a78b63&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false`,
                title: 'SoundCloud player',
                fallbackTitle: 'SoundCloud',
                metadataUrls: [
                    `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url.href)}`,
                    `https://noembed.com/embed?url=${encodeURIComponent(url.href)}`
                ]
            };
        }

        if (host.endsWith('music.apple.com')) {
            return {
                kind: 'iframe',
                provider: 'apple music',
                src: `https://embed.music.apple.com${url.pathname}${url.search}`,
                title: 'Apple Music player',
                fallbackTitle: getTitleFromUrl(url) || 'Apple Music'
            };
        }

        if (/\.(mp3|ogg|wav|m4a|aac)(\?.*)?$/.test(path)) {
            return { kind: 'audio', provider: 'audio', src: url.href, title: 'audio player', fallbackTitle: getTitleFromUrl(url) || 'audio' };
        }

        return { error: t('music.unsupported') };
    }

    async function renderHomeMusic(source, originalUrl = "") {
        if (!homeMusicEmbed) return;
        homeMusicEmbed.innerHTML = "";

        if (!source || source.error) {
            homeMusicEmbed.hidden = true;
            delete homeMusicEmbed.dataset.provider;
            delete homeMusicEmbed.dataset.title;
            clearHeaderNowPlaying();
            setHomeMusicStatus(source?.error || "");
            return;
        }

        playAmbientTrack('none');
        ambientTrackBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.track === 'none'));
        localStorage.setItem('introvert_ambient_track', 'none');

        if (source.kind === 'iframe') {
            const frame = document.createElement('iframe');
            frame.src = source.src;
            frame.title = source.title;
            frame.loading = 'lazy';
            frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            frame.referrerPolicy = 'strict-origin-when-cross-origin';
            homeMusicEmbed.appendChild(frame);
        } else if (source.kind === 'audio') {
            const audio = document.createElement('audio');
            audio.src = source.src;
            audio.controls = true;
            audio.preload = 'metadata';
            homeMusicEmbed.appendChild(audio);
        }

        homeMusicEmbed.hidden = false;
        homeMusicEmbed.dataset.provider = source.provider;
        const fallbackTitle = cleanMusicTitle(source.fallbackTitle || source.provider, source.provider);
        if (fallbackTitle) {
            homeMusicEmbed.dataset.title = fallbackTitle;
            setHeaderNowPlaying(fallbackTitle);
            setHomeMusicStatus(`${t('music.opening')}: ${fallbackTitle}`);
        }
        if (originalUrl) localStorage.setItem('introvert_home_music_url', originalUrl);

        const resolvedTitle = await resolveMusicTitle(source, originalUrl);
        if (resolvedTitle) {
            homeMusicEmbed.dataset.title = resolvedTitle;
            setHeaderNowPlaying(resolvedTitle);
            setHomeMusicStatus(`${t('music.opening')}: ${resolvedTitle}`);
        }
    }

    homeMusicForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const value = homeMusicInput?.value || "";
        await renderHomeMusic(resolveMusicSource(value), value.trim());
    });

    homeMusicClear?.addEventListener('click', () => {
        if (homeMusicEmbed) {
            homeMusicEmbed.innerHTML = "";
            homeMusicEmbed.hidden = true;
            delete homeMusicEmbed.dataset.provider;
            delete homeMusicEmbed.dataset.title;
        }
        if (homeMusicInput) homeMusicInput.value = "";
        localStorage.removeItem('introvert_home_music_url');
        clearHeaderNowPlaying();
        setHomeMusicStatus("");
    });

    homeMusicPresets.forEach(btn => {
        btn.addEventListener('click', () => {
            const track = btn.dataset.ambient || 'none';
            if (homeMusicEmbed) {
                homeMusicEmbed.innerHTML = "";
                homeMusicEmbed.hidden = true;
                delete homeMusicEmbed.dataset.provider;
                delete homeMusicEmbed.dataset.title;
            }
            localStorage.removeItem('introvert_home_music_url');
            localStorage.setItem('introvert_ambient_track', track);
            playAmbientTrack(track);
            setHomeMusicStatus(track === 'none' ? t('music.stopped') : `${t('music.playing')}: ${btn.textContent.trim()}`);
        });
    });

    const savedHomeMusicUrl = localStorage.getItem('introvert_home_music_url') || "";
    if (savedHomeMusicUrl && homeMusicInput) {
        homeMusicInput.value = savedHomeMusicUrl;
        renderHomeMusic(resolveMusicSource(savedHomeMusicUrl), savedHomeMusicUrl);
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

    // -------------------------------------------------------------
});
