(() => {
    const TEXT = {
        vi: {
            "nav.home": "home",
            "nav.write": "write",
            "nav.journal": "journal",
            "password.hint": "Không gian riêng tư. Vui lòng nhập mật mã 6 số để mở khóa.",
            "password.unlock": "mở khóa",
            "journal.kicker": "private journal",
            "journal.title": "nhật ký",
            "journal.sync": "đồng bộ",
            "journal.date": "ngày",
            "journal.mood": "tâm trạng",
            "journal.tags": "tag",
            "journal.tagsPlaceholder": "đêm, mưa, riêng tư",
            "journal.titlePlaceholder": "tựa đề hôm nay...",
            "journal.contentPlaceholder": "viết dài hơn ở đây...",
            "journal.template.gratitude": "biết ơn",
            "journal.template.release": "buông xuống",
            "journal.template.letter": "thư cho mình",
            "journal.template.dream": "giấc mơ",
            "journal.zen": "zen canvas",
            "journal.fade": "mực phai",
            "journal.burn": "buông xả",
            "journal.save": "lưu lên Sheet",
            "journal.clear": "xóa nháp",
            "journal.listTitle": "những trang đã lưu",
            "journal.searchPlaceholder": "tìm trong nhật ký...",
            "mood.tinh": "tĩnh",
            "mood.mo": "mơ",
            "mood.lang": "lặng",
            "mood.tram": "trầm",
            "mood.loan": "loạn",
            "writings.kicker": "private writings",
            "writings.title": "writings",
            "writings.sync": "đồng bộ",
            "writings.searchPlaceholder": "tìm trong bài viết...",
            "nav.pineapple": "góc của dứa",
            "dua.title": "góc của dứa",
            "dua.kicker": "khoảnh khắc & nhật ký",
            "dua.password.hint": "Góc của dứa. Vui lòng nhập mật mã 6 số để mở khóa.",
            "dua.filter.all": "tất cả",
            "dua.filter.live-current": "đang live 🔴",
            "dua.filter.live-recent": "live gần đây 📹",
            "dua.filter.short": "shorts ⚡",
            "dua.filter.video": "video 🎬",
            "dua.filter.writing": "viết lách ✍️",
            "dua.filter.message": "lời nhắn 💬",
            "dua.filter.journal": "nhật ký 📖",
            "dua.add.btn": "Đăng bài",
            "dua.add.title": "Thêm khoảnh khắc mới",
            "dua.add.category": "Danh mục",
            "dua.add.itemTitle": "Tiêu đề",
            "dua.add.itemContent": "Nội dung / Lời nhắn",
            "dua.add.mediaUrl": "Link video (YouTube) hoặc dán link ảnh",
            "dua.add.uploadBtn": "Tải ảnh lên từ máy",
            "dua.add.uploadSuccess": "Đã tải ảnh lên Drive!",
            "dua.add.submit": "Đăng lên",
            "dua.add.cancel": "Hủy",
            "dua.card.download": "Tải ảnh",
            "dua.card.liveNow": "LIVE NOW"
        },
        en: {
            "nav.home": "home",
            "nav.write": "write",
            "nav.journal": "journal",
            "password.hint": "A private space. Enter the 6-digit passcode to unlock.",
            "password.unlock": "unlock",
            "journal.kicker": "private journal",
            "journal.title": "journal",
            "journal.sync": "sync",
            "journal.date": "date",
            "journal.mood": "mood",
            "journal.tags": "tags",
            "journal.tagsPlaceholder": "night, rain, private",
            "journal.titlePlaceholder": "today's title...",
            "journal.contentPlaceholder": "write longer here...",
            "journal.template.gratitude": "gratitude",
            "journal.template.release": "release",
            "journal.template.letter": "letter to myself",
            "journal.template.dream": "dream",
            "journal.zen": "zen canvas",
            "journal.fade": "fading ink",
            "journal.burn": "release",
            "journal.save": "save to Sheet",
            "journal.clear": "clear draft",
            "journal.listTitle": "saved pages",
            "journal.searchPlaceholder": "search journal...",
            "mood.tinh": "still",
            "mood.mo": "dreamy",
            "mood.lang": "quiet",
            "mood.tram": "low",
            "mood.loan": "restless",
            "writings.kicker": "private writings",
            "writings.title": "writings",
            "writings.sync": "sync",
            "writings.searchPlaceholder": "search writings...",
            "nav.pineapple": "pineapple's corner",
            "dua.title": "pineapple's corner",
            "dua.kicker": "moments & journals",
            "dua.password.hint": "Pineapple's corner. Enter the 6-digit passcode to unlock.",
            "dua.filter.all": "all",
            "dua.filter.live-current": "live now 🔴",
            "dua.filter.live-recent": "recent live 📹",
            "dua.filter.short": "shorts ⚡",
            "dua.filter.video": "videos 🎬",
            "dua.filter.writing": "writings ✍️",
            "dua.filter.message": "messages 💬",
            "dua.filter.journal": "journals 📖",
            "dua.add.btn": "Post",
            "dua.add.title": "Add new moment",
            "dua.add.category": "Category",
            "dua.add.itemTitle": "Title",
            "dua.add.itemContent": "Content / Note",
            "dua.add.mediaUrl": "Video link (YouTube) or paste image URL",
            "dua.add.uploadBtn": "Upload image from device",
            "dua.add.uploadSuccess": "Uploaded image to Drive!",
            "dua.add.submit": "Submit",
            "dua.add.cancel": "Cancel",
            "dua.card.download": "Download",
            "dua.card.liveNow": "LIVE NOW"
        }
    };

    function detectLanguage() {
        const saved = localStorage.getItem('introvert_lang');
        if (saved === 'vi' || saved === 'en') return saved;
        const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'vi'];
        const supported = languages.find(lang => /^vi\b|^en\b/i.test(lang));
        return supported && supported.toLowerCase().startsWith('en') ? 'en' : 'vi';
    }

    const lang = detectLanguage();
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;

    function t(key) {
        return TEXT[lang]?.[key] || TEXT.vi[key] || key;
    }

    function setText(selector, key) {
        const el = document.querySelector(selector);
        if (el) el.textContent = t(key);
    }

    function setPlaceholder(selector, key) {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('placeholder', t(key));
    }

    function applyJournalText() {
        setText('.journal-page .nav-links .nav-link[href*="index"]', 'nav.home');
        setText('.journal-page .nav-links .nav-link[href*="write"]', 'nav.write');
        setText('.journal-page .nav-links .nav-link[href*="dua"]', 'nav.pineapple');
        setText('.journal-page .password-hint', 'password.hint');
        setText('#journal-unlock-btn', 'password.unlock');
        setText('.journal-kicker', 'journal.kicker');
        setText('.journal-title-row h1', 'journal.title');
        setText('#journal-sync-btn', 'journal.sync');
        setText('.journal-editor-grid label:nth-child(1) span', 'journal.date');
        setText('.journal-editor-grid label:nth-child(2) span', 'journal.mood');
        setText('.journal-editor-grid label:nth-child(3) span', 'journal.tags');
        setText('.journal-page-template[data-template="gratitude"]', 'journal.template.gratitude');
        setText('.journal-page-template[data-template="release"]', 'journal.template.release');
        setText('.journal-page-template[data-template="letter"]', 'journal.template.letter');
        setText('.journal-page-template[data-template="dream"]', 'journal.template.dream');
        setText('#journal-zen-btn', 'journal.zen');
        setText('#journal-fade-btn', 'journal.fade');
        setText('#journal-burn-btn', 'journal.burn');
        setText('#journal-save-btn', 'journal.save');
        setText('#journal-draft-clear', 'journal.clear');
        setText('.journal-list-header h2', 'journal.listTitle');
        setPlaceholder('#journal-tags', 'journal.tagsPlaceholder');
        setPlaceholder('#journal-title', 'journal.titlePlaceholder');
        setPlaceholder('#journal-content', 'journal.contentPlaceholder');
        setPlaceholder('#journal-search-input', 'journal.searchPlaceholder');

        const moodLabels = ['mood.tinh', 'mood.mo', 'mood.lang', 'mood.tram', 'mood.loan'];
        document.querySelectorAll('#journal-mood option').forEach((option, index) => {
            if (moodLabels[index]) option.textContent = t(moodLabels[index]);
        });
    }

    function applyWritingsText() {
        setText('.writings-page .nav-links .nav-link[href*="index"]', 'nav.home');
        setText('.writings-page .nav-links .nav-link[href*="journal"]', 'nav.journal');
        setText('.writings-page .nav-links .nav-link[href*="dua"]', 'nav.pineapple');
        setText('.writings-page .password-hint', 'password.hint');
        setText('#writings-unlock-btn', 'password.unlock');
        setText('.writings-kicker', 'writings.kicker');
        setText('.writings-title-row h1', 'writings.title');
        setText('#writings-sync-btn', 'writings.sync');
        setPlaceholder('#writings-search', 'writings.searchPlaceholder');
    }

    function applyPineappleText() {
        setText('.pineapple-page .nav-links .nav-link[href*="index"]', 'nav.home');
        setText('.pineapple-page .nav-links .nav-link[href*="journal"]', 'nav.journal');
        setText('.pineapple-page .nav-links .nav-link[href*="games"]', 'nav.games');
        setText('.pineapple-page .nav-links .nav-link[href*="writings"]', 'nav.writings');
        setText('.pineapple-page .password-hint', 'dua.password.hint');
        setText('#passcode-unlock-btn', 'password.unlock');
        setText('.dua-kicker', 'dua.kicker');
        setText('.dua-title-row h1', 'dua.title');
        
        setText('#dua-add-trigger', 'dua.add.btn');
        setText('.dua-modal-title', 'dua.add.title');
        setText('#dua-modal-form label[for="dua-category"] span', 'dua.add.category');
        setText('#dua-modal-form label[for="dua-title"] span', 'dua.add.itemTitle');
        setText('#dua-modal-form label[for="dua-content"] span', 'dua.add.itemContent');
        setText('#dua-modal-form label[for="dua-mediaUrl"] span', 'dua.add.mediaUrl');
        setText('#dua-upload-label', 'dua.add.uploadBtn');
        setText('#dua-save-btn', 'dua.add.submit');
        setText('#dua-modal-close', 'dua.add.cancel');
        
        setPlaceholder('#dua-title', 'dua.add.itemTitle');
        setPlaceholder('#dua-content', 'dua.add.itemContent');
        setPlaceholder('#dua-mediaUrl', 'dua.add.mediaUrl');

        // Lọc filter button text
        setText('.dua-filter-btn[data-category="all"]', 'dua.filter.all');
        setText('.dua-filter-btn[data-category="live-current"]', 'dua.filter.live-current');
        setText('.dua-filter-btn[data-category="live-recent"]', 'dua.filter.live-recent');
        setText('.dua-filter-btn[data-category="short"]', 'dua.filter.short');
        setText('.dua-filter-btn[data-category="video"]', 'dua.filter.video');
        setText('.dua-filter-btn[data-category="writing"]', 'dua.filter.writing');
        setText('.dua-filter-btn[data-category="message"]', 'dua.filter.message');
        setText('.dua-filter-btn[data-category="journal"]', 'dua.filter.journal');
    }

    function applyPageI18n() {
        if (document.body.classList.contains('journal-page')) applyJournalText();
        if (document.body.classList.contains('writings-page')) applyWritingsText();
        if (document.body.classList.contains('pineapple-page')) applyPineappleText();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPageI18n);
    } else {
        applyPageI18n();
    }

    window.IntrovertPageI18n = { lang, t, apply: applyPageI18n };
})();
