document.addEventListener('DOMContentLoaded', () => {
    const GOOGLE_APPS_SCRIPT_URL = "/api/sheet";
    const UNLOCK_API_URL = "/api/unlock";
    const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";
    const DRAFT_KEY = "introvert_journal_draft";

    const lockSection = document.getElementById('journal-lock');
    const appSection = document.getElementById('journal-app');
    const lockForm = document.getElementById('journal-lock-form');
    const passcodeDigits = Array.from(document.querySelectorAll('.journal-passcode-digit'));
    const lockStatus = document.getElementById('journal-lock-status');
    const dateInput = document.getElementById('journal-date');
    const moodInput = document.getElementById('journal-mood');
    const tagsInput = document.getElementById('journal-tags');
    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const saveBtn = document.getElementById('journal-save-btn');
    const syncBtn = document.getElementById('journal-sync-btn');
    const clearDraftBtn = document.getElementById('journal-draft-clear');
    const saveStatus = document.getElementById('journal-save-status');
    const listEl = document.getElementById('journal-list');
    const searchInput = document.getElementById('journal-search-input');
    const entryCountEl = document.getElementById('journal-page-entry-count');
    const wordCountEl = document.getElementById('journal-page-word-count');
    const lastSyncEl = document.getElementById('journal-page-last-sync');

    let currentPasscode = "";
    let privateSessionToken = "";
    let entries = [];

    function getLocalDateString(date = new Date()) {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: VIETNAM_TIME_ZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(date).reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});
        return `${parts.year}-${parts.month}-${parts.day}`;
    }

    function formatVietnamDateTime(value, options = {}) {
        const date = value ? new Date(value) : new Date();
        if (Number.isNaN(date.getTime())) return String(value || "");
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

    async function deriveKey(password, salt) {
        const passwordKey = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            "PBKDF2",
            false,
            ["deriveKey"]
        );
        return crypto.subtle.deriveKey(
            { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
            passwordKey,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    }

    async function encryptData(plaintext, password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            new TextEncoder().encode(plaintext)
        );
        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);
        let binary = "";
        for (let i = 0; i < combined.byteLength; i++) {
            binary += String.fromCharCode(combined[i]);
        }
        return btoa(binary);
    }

    async function decryptData(ciphertextBase64, password) {
        const binaryString = atob(String(ciphertextBase64 || ""));
        const combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            combined[i] = binaryString.charCodeAt(i);
        }
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const ciphertext = combined.slice(28);
        const key = await deriveKey(password, salt);
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
        return new TextDecoder().decode(decrypted);
    }

    async function fetchSheetJson(type, label = "dữ liệu") {
        const separator = GOOGLE_APPS_SCRIPT_URL.includes('?') ? '&' : '?';
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}${separator}type=${encodeURIComponent(type)}`);
        const text = await response.text();
        if (!response.ok) throw new Error(`Không thể tải ${label}.`);
        try {
            return JSON.parse(text);
        } catch (err) {
            throw new Error(`Sheet không trả JSON hợp lệ cho ${label}.`);
        }
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

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function countWords(text = "") {
        const matches = String(text).trim().match(/\S+/g);
        return matches ? matches.length : 0;
    }

    function setStatus(message = "") {
        if (saveStatus) saveStatus.textContent = message;
    }

    function setLockStatus(message = "") {
        if (!lockStatus) return;
        lockStatus.textContent = message;
        lockStatus.classList.toggle('is-visible', Boolean(message));
    }

    function getEnteredPasscode() {
        return passcodeDigits.map(input => input.value).join('');
    }

    function resetPasscodeInputs() {
        passcodeDigits.forEach(input => {
            input.value = "";
        });
    }

    function updateStats() {
        if (entryCountEl) entryCountEl.textContent = String(entries.length);
        if (wordCountEl) wordCountEl.textContent = String(countWords(contentInput.value));
    }

    function saveDraft() {
        const draft = {
            date: dateInput.value,
            mood: moodInput.value,
            tags: tagsInput.value,
            title: titleInput.value,
            content: contentInput.value
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        updateStats();
    }

    function loadDraft() {
        try {
            const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
            dateInput.value = draft.date || getLocalDateString();
            moodInput.value = draft.mood || "tĩnh";
            tagsInput.value = draft.tags || "";
            titleInput.value = draft.title || "";
            contentInput.value = draft.content || "";
        } catch (err) {
            dateInput.value = getLocalDateString();
        }
        updateStats();
    }

    function renderEntries() {
        if (!listEl) return;
        const query = (searchInput?.value || "").trim().toLowerCase();
        const visibleEntries = entries.filter(entry => {
            if (!query) return true;
            return [entry.title, entry.mood, entry.tags, entry.content, entry.displayDate]
                .join(" ")
                .toLowerCase()
                .includes(query);
        });

        if (visibleEntries.length === 0) {
            listEl.innerHTML = `<p class="journal-empty">chưa có trang nhật ký nào phù hợp.</p>`;
            return;
        }

        listEl.innerHTML = visibleEntries.map(entry => `
            <article class="journal-entry-card">
                <div class="journal-entry-meta">
                    <time>${escapeHTML(entry.displayDate || formatVietnamDateTime(entry.createdAt || entry.date))}</time>
                    <span>${escapeHTML(entry.mood || "tĩnh")}</span>
                </div>
                <h3>${escapeHTML(entry.title || "không tựa")}</h3>
                <p class="journal-entry-tags">${escapeHTML(entry.tags || "")}</p>
                <p class="journal-entry-content">${escapeHTML(entry.content || "")}</p>
            </article>
        `).join("");
    }

    async function loadJournals() {
        if (!currentPasscode) return;
        setStatus("đang đồng bộ...");
        try {
            const rows = await fetchSheetJson("journals", "nhật ký");
            const decrypted = [];
            for (const row of Array.isArray(rows) ? rows : []) {
                if (!row || !row.content) continue;
                try {
                    decrypted.push({
                        date: row.date,
                        title: await decryptData(row.title, currentPasscode),
                        mood: await decryptData(row.mood, currentPasscode),
                        tags: await decryptData(row.tags, currentPasscode),
                        content: await decryptData(row.content, currentPasscode),
                        createdAt: row.createdAt,
                        displayDate: row.displayDate
                    });
                } catch (err) {
                    console.error("Không giải mã được một dòng nhật ký:", err);
                }
            }
            entries = decrypted.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
            renderEntries();
            updateStats();
            if (lastSyncEl) lastSyncEl.textContent = formatVietnamDateTime(new Date(), { includeTime: false });
            setStatus("đã đồng bộ.");
        } catch (err) {
            console.error(err);
            setStatus("chưa tải được Sheet. hãy kiểm tra Apps Script.");
        }
    }

    async function saveJournal() {
        if (!currentPasscode) return;
        const title = titleInput.value.trim() || "không tựa";
        const content = contentInput.value.trim();
        if (!content) {
            setStatus("hãy viết nội dung trước khi lưu.");
            contentInput.focus();
            return;
        }

        saveBtn.disabled = true;
        setStatus("đang mã hóa và lưu...");
        try {
            const createdAt = new Date();
            const payload = {
                type: "journal",
                date: dateInput.value || getLocalDateString(createdAt),
                title: await encryptData(title, currentPasscode),
                mood: await encryptData(moodInput.value || "tĩnh", currentPasscode),
                tags: await encryptData(tagsInput.value.trim(), currentPasscode),
                content: await encryptData(content, currentPasscode),
                createdAt: createdAt.toISOString(),
                displayDate: formatVietnamDateTime(createdAt)
            };
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                headers: getPrivateSheetHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify(payload)
            });
            const result = await response.json().catch(() => ({ success: false }));
            if (!response.ok || result.success === false) {
                throw new Error(result.error || "Không lưu được nhật ký.");
            }

            localStorage.removeItem(DRAFT_KEY);
            titleInput.value = "";
            tagsInput.value = "";
            contentInput.value = "";
            dateInput.value = getLocalDateString();
            updateStats();
            setStatus("đã lưu lên Sheet.");
            await loadJournals();
        } catch (err) {
            console.error(err);
            setStatus("lưu thất bại. hãy cập nhật Apps Script nếu chưa làm.");
        } finally {
            saveBtn.disabled = false;
        }
    }

    const TEMPLATES = {
        checkin: "check-in\ncơ thể:\ntâm trí:\nđiều đang cần:",
        gratitude: "ba điều biết ơn\n1.\n2.\n3.",
        release: "điều cần buông xuống\nhôm nay tôi buông:\nvì:",
        letter: "thư cho mình\nnày tôi ơi,\n\n",
        dream: "giấc mơ / hình ảnh còn sót lại\nkhung cảnh:\ncảm giác:\ný nghĩa có thể là:"
    };

    function insertTemplate(template) {
        const text = TEMPLATES[template] || "";
        if (!text) return;
        contentInput.value = contentInput.value.trim()
            ? `${contentInput.value.trim()}\n\n${text}`
            : text;
        saveDraft();
        contentInput.focus();
    }

    async function submitJournalPasscode() {
        const passcode = getEnteredPasscode();
        if (passcode.length !== 6) {
            setLockStatus("vui lòng nhập đủ 6 số.");
            return;
        }

        try {
            await requestPrivateUnlock(passcode);
        } catch (err) {
            setLockStatus("mật mã chưa chính xác.");
            resetPasscodeInputs();
            passcodeDigits[0]?.focus();
            return;
        }

        currentPasscode = passcode;
        lockSection.hidden = true;
        appSection.hidden = false;
        setLockStatus("");
        loadDraft();
        await loadJournals();
    }

    lockForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        await submitJournalPasscode();
    });

    passcodeDigits.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            setLockStatus("");
            if (input.value && index < passcodeDigits.length - 1) {
                passcodeDigits[index + 1].focus();
            }
            if (getEnteredPasscode().length === 6) {
                submitJournalPasscode();
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && !input.value && index > 0) {
                passcodeDigits[index - 1].focus();
                passcodeDigits[index - 1].value = '';
            }
        });

        input.addEventListener('paste', (event) => {
            event.preventDefault();
            const pasted = (event.clipboardData || window.clipboardData).getData('text').trim();
            if (!/^\d{6}$/.test(pasted)) return;
            passcodeDigits.forEach((digit, digitIndex) => {
                digit.value = pasted[digitIndex];
            });
            submitJournalPasscode();
        });
    });

    [dateInput, moodInput, tagsInput, titleInput, contentInput].forEach(input => {
        input?.addEventListener('input', saveDraft);
        input?.addEventListener('change', saveDraft);
    });

    document.querySelectorAll('.journal-page-template').forEach(btn => {
        btn.addEventListener('click', () => insertTemplate(btn.getAttribute('data-template')));
    });

    saveBtn?.addEventListener('click', saveJournal);
    syncBtn?.addEventListener('click', loadJournals);
    searchInput?.addEventListener('input', renderEntries);
    clearDraftBtn?.addEventListener('click', () => {
        localStorage.removeItem(DRAFT_KEY);
        loadDraft();
        setStatus("đã xóa nháp.");
    });

    const zenBtn = document.getElementById('journal-zen-btn');
    const fadeBtn = document.getElementById('journal-fade-btn');
    const burnBtn = document.getElementById('journal-burn-btn');

    zenBtn?.addEventListener('click', () => {
        document.body.classList.toggle('extreme-zen-mode');
        zenBtn.textContent = document.body.classList.contains('extreme-zen-mode') ? "thoát zen" : "zen canvas";
    });

    fadeBtn?.addEventListener('click', () => {
        document.body.classList.toggle('fading-text-mode');
        if (document.body.classList.contains('fading-text-mode')) {
            fadeBtn.classList.add('primary');
        } else {
            fadeBtn.classList.remove('primary');
        }
    });

    burnBtn?.addEventListener('click', () => {
        if (!contentInput.value.trim()) {
            setStatus("không có gì để buông xả.");
            return;
        }
        if (confirm("Bạn có chắc chắn muốn buông xả? Dòng chữ này sẽ bốc cháy và tan biến mãi mãi.")) {
            contentInput.classList.add('burning-text');
            setTimeout(() => {
                contentInput.value = '';
                titleInput.value = '';
                tagsInput.value = '';
                contentInput.classList.remove('burning-text');
                saveDraft();
                setStatus("mọi suy tư đã nhẹ nhàng tan biến.");
            }, 3000);
        }
    });

    passcodeDigits[0]?.focus();
});
