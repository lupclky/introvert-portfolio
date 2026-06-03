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

    const OWNER_PASSCODE = "241099";
    const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

    // Lưu trữ mật mã hiện tại để mã hóa các thông tin nhập thêm (mood, note)
    let currentPasscode = OWNER_PASSCODE;

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
    const navWritingsLink = document.querySelector('a[href="#writings"]');
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

    if (navSanctuaryBtn) {
        navSanctuaryBtn.addEventListener('click', openMoodDrawer);
    }
    if (heroSanctuaryTrigger) {
        heroSanctuaryTrigger.addEventListener('click', openMoodDrawer);
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
    const introvertMessagesSection = document.getElementById('introvert-messages');
    const introvertMessagesList = document.getElementById('introvert-messages-list');
    const introvertMessagesStatus = document.getElementById('introvert-messages-status');
    const writingsSection = document.getElementById('writings');
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
        if (trigger.id === "nav-sanctuary-btn" || trigger.id === "hero-sanctuary-trigger" || trigger.id === "mood-trigger-btn") {
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
            let articles = [];
            try {
                articles = await loadLocalArticles(passcode);
            } catch (localErr) {
                if (passcode !== OWNER_PASSCODE) throw localErr;
                console.error("Lỗi tải dữ liệu cục bộ, vẫn mở bằng mật mã chủ:", localErr);
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
                scrollToPrivateTarget(target || "writings");
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

                // Hỗ trợ Paste trực tiếp chuỗi mật mã 6 số (ví dụ: 241099)
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

    [navWritingsLink, scrollWritingsLink].forEach(link => {
        if (!link) return;
        link.addEventListener('click', (event) => {
            if (!isPrivateUnlocked()) {
                event.preventDefault();
                requestPrivateSection("writings");
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (isPrivateUnlocked()) return;
        const trigger = event.target.closest('a[href="#writings"], a[href="#introvert-messages"], #nav-sanctuary-btn, #hero-sanctuary-trigger, #mood-trigger-btn');
        if (!trigger) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        showPasswordGate(getPrivateGateTarget(trigger));
    }, true);

    function guardPrivateHash() {
        if (!USE_PASSWORD_LOCK || isPrivateUnlocked()) return;
        const targetMap = {
            "#writings": "writings",
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

    function saveMoodLog(dateStr, state, note) {
        const logs = getMoodLogs();
        if (!state && !note) {
            delete logs[dateStr];
        } else {
            // Lưu dưới dạng 'emoji' để tương thích ngược cấu trúc cũ
            logs[dateStr] = { emoji: state || "", note: note || "" };
        }
        localStorage.setItem('introvert_mood_log', JSON.stringify(logs));

        // Tự động đồng bộ lên Google Sheet nếu có cấu hình
        triggerSyncMoodToSheet(dateStr, state, note);
    }

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
                const auth = await sha256(currentPasscode);

                const payload = {
                    type: "mood",
                    date: dateStr,
                    emoji: encState, // cột emoji trên sheet sẽ chứa trạng thái text mã hóa
                    note: encNote,
                    auth: auth
                };

                await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
                const auth = await sha256(currentPasscode);
                if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL.trim() !== "") {
                    const createdAt = new Date();
                    await fetch(GOOGLE_APPS_SCRIPT_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: "future_letter",
                            date: createdAt.toISOString(),
                            title: encTitle,
                            preview: "future_letter:" + unlockDate,
                            content: encContent,
                            unlockDate,
                            displayDate: formatVietnamDateTime(createdAt),
                            auth
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

    gameSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameName = btn.getAttribute('data-game');
            currentActiveGame = gameName;

            if (gamesMenu) gamesMenu.style.display = 'none';
            if (gameActiveContainer) gameActiveContainer.classList.add('active');

            let title = 'trò chơi';
            if (gameName === 'haiku') title = 'ghép thơ haiku';
            else if (gameName === '2048') title = 'zen 2048';
            else if (gameName === 'snake') title = 'rắn săn mồi';
            else if (gameName === 'conway') title = 'vườn conway';
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
            }
        });
    });

    if (gameBackBtn) {
        gameBackBtn.addEventListener('click', () => {
            if (snakeInterval) clearInterval(snakeInterval);
            snakeRunning = false;
            if (conwayInterval) clearInterval(conwayInterval);
            conwayRunning = false;

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
