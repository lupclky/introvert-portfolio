document.addEventListener('DOMContentLoaded', () => {
    const GOOGLE_APPS_SCRIPT_URL = "/api/sheet";
    const UNLOCK_API_URL = "/api/unlock";
    const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

    const lockSection = document.getElementById('writings-lock');
    const appSection = document.getElementById('writings-app');
    const lockForm = document.getElementById('writings-lock-form');
    const passcodeDigits = Array.from(document.querySelectorAll('.writings-passcode-digit'));
    const lockStatus = document.getElementById('writings-lock-status');
    const listEl = document.getElementById('writings-list');
    const statusEl = document.getElementById('writings-status');
    const searchInput = document.getElementById('writings-search');
    const syncBtn = document.getElementById('writings-sync-btn');

    let currentPasscode = "";
    let articles = [];

    function setLockStatus(message = "") {
        if (!lockStatus) return;
        lockStatus.textContent = message;
        lockStatus.classList.toggle('is-visible', Boolean(message));
    }

    function setStatus(message = "") {
        if (statusEl) statusEl.textContent = message;
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
            ["decrypt"]
        );
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
        return result.token;
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
        try {
            const response = await fetch('writings.enc');
            if (!response.ok) return [];
            const encryptedText = await response.text();
            return JSON.parse(await decryptData(encryptedText, passcode));
        } catch (err) {
            console.error("Không tải được writings.enc:", err);
            return [];
        }
    }

    async function loadSheetArticles(passcode) {
        const encryptedRows = await fetchSheetJson("articles", "bài viết");
        const result = [];

        for (const row of Array.isArray(encryptedRows) ? encryptedRows : []) {
            if (!row || !row.title || !row.content || !row.preview) continue;

            const isFutureLetter = String(row.preview || "").startsWith("future_letter:");
            const unlockDateStr = isFutureLetter ? String(row.preview).substring("future_letter:".length) : "";
            const isLocked = isFutureLetter && new Date() < parseVietnamUnlockDate(unlockDateStr);

            try {
                let title = "thư tương lai";
                let content = "";
                let preview = row.preview;

                if (!isLocked) {
                    title = await decryptData(row.title, passcode);
                    content = await decryptData(row.content, passcode);
                    preview = isFutureLetter
                        ? makeExcerpt(content, "lá thư tương lai đã đến ngày mở.")
                        : await decryptData(row.preview, passcode);
                } else {
                    preview = `được niêm phong đến ${formatVietnamDateTime(unlockDateStr, { includeTime: false })}.`;
                }

                result.push({
                    date: row.date,
                    displayDate: row.displayDate,
                    title,
                    preview,
                    content,
                    unlockDate: unlockDateStr,
                    isLocked,
                    type: isFutureLetter ? "future_letter" : "article"
                });
            } catch (err) {
                console.error("Lỗi giải mã một bài viết:", err);
            }
        }

        return result;
    }

    async function loadLocalFutureLetters(passcode) {
        const result = [];
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

                    result.push({
                        date: row.date,
                        title,
                        preview,
                        content,
                        unlockDate: row.unlockDate,
                        isLocked,
                        type: "future_letter"
                    });
                } catch (err) {
                    console.error("Lỗi giải mã thư tương lai nội bộ:", err);
                }
            }
        } catch (err) {
            console.error("Không đọc được thư tương lai nội bộ:", err);
        }
        return result;
    }

    function normalizeArticleDate(article) {
        return new Date(article.createdAt || article.date || 0).getTime() || 0;
    }

    function renderWritings() {
        if (!listEl) return;
        const query = (searchInput?.value || "").trim().toLowerCase();
        const visible = articles.filter(article => {
            if (!query) return true;
            return [article.title, article.preview, article.content, article.displayDate, article.date]
                .join(" ")
                .toLowerCase()
                .includes(query);
        });

        if (visible.length === 0) {
            listEl.innerHTML = `<p class="writings-empty">chưa có bài viết phù hợp.</p>`;
            return;
        }

        listEl.innerHTML = visible.map(article => {
            const isLockedLetter = article.type === "future_letter" && article.isLocked;
            const contentSource = String(article.content || "");
            let contentHTML = contentSource;
            if (contentSource && !contentSource.includes('<p>') && !contentSource.includes('</p>') && !contentSource.includes('<br>')) {
                contentHTML = contentSource.split('\n')
                    .map(paragraph => paragraph.trim())
                    .filter(Boolean)
                    .map(paragraph => `<p>${escapeHTML(paragraph)}</p>`)
                    .join('');
            }
            const readButtonHTML = isLockedLetter
                ? ""
                : '<button class="read-more-btn" aria-expanded="false">Đọc thêm</button>';

            return `
                <article class="writing-item${article.type === "future_letter" ? " writing-item-future" : ""}${isLockedLetter ? " is-future-locked" : ""}">
                    <div class="writing-header">
                        <span class="writing-date">${escapeHTML(article.displayDate || formatVietnamDateTime(article.date))}</span>
                        <h3 class="writing-title" tabindex="0" role="button">${escapeHTML(article.title || "không tựa")}</h3>
                    </div>
                    <p class="writing-preview">${escapeHTML(article.preview || "")}</p>
                    <div class="writing-content">${contentHTML}</div>
                    ${readButtonHTML}
                </article>
            `;
        }).join("");
    }

    async function loadWritings() {
        if (!currentPasscode) return;
        setStatus("đang tải bài viết...");
        try {
            const localArticles = await loadLocalArticles(currentPasscode);
            const sheetArticles = await loadSheetArticles(currentPasscode).catch(err => {
                console.error("Không tải được Sheet articles:", err);
                return [];
            });
            const futureLetters = await loadLocalFutureLetters(currentPasscode);
            articles = [...(sheetArticles.length ? sheetArticles : localArticles), ...futureLetters]
                .sort((a, b) => normalizeArticleDate(b) - normalizeArticleDate(a));
            renderWritings();
            setStatus(articles.length ? `${articles.length} bài viết đã mở.` : "chưa có bài viết.");
        } catch (err) {
            console.error(err);
            setStatus("chưa tải được bài viết.");
        }
    }

    function getEnteredPasscode() {
        return passcodeDigits.map(input => input.value).join('');
    }

    function resetPasscodeInputs() {
        passcodeDigits.forEach(input => {
            input.value = "";
        });
    }

    async function submitPasscode() {
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
        await loadWritings();
    }

    lockForm?.addEventListener('submit', async event => {
        event.preventDefault();
        await submitPasscode();
    });

    passcodeDigits.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            setLockStatus("");
            if (input.value && index < passcodeDigits.length - 1) {
                passcodeDigits[index + 1].focus();
            }
            if (getEnteredPasscode().length === 6) {
                submitPasscode();
            }
        });

        input.addEventListener('keydown', event => {
            if (event.key === 'Backspace' && !input.value && index > 0) {
                passcodeDigits[index - 1].focus();
                passcodeDigits[index - 1].value = '';
            }
        });

        input.addEventListener('paste', event => {
            event.preventDefault();
            const pasted = (event.clipboardData || window.clipboardData).getData('text').trim();
            if (!/^\d{6}$/.test(pasted)) return;
            passcodeDigits.forEach((digit, digitIndex) => {
                digit.value = pasted[digitIndex];
            });
            submitPasscode();
        });
    });

    listEl?.addEventListener('click', event => {
        const trigger = event.target.closest('.read-more-btn, .writing-title');
        if (!trigger) return;
        const item = trigger.closest('.writing-item');
        if (!item || item.classList.contains('is-future-locked')) return;
        const isExpanded = item.classList.contains('is-expanded');

        listEl.querySelectorAll('.writing-item.is-expanded').forEach(openItem => {
            if (openItem === item) return;
            openItem.classList.remove('is-expanded');
            openItem.querySelector('.read-more-btn')?.setAttribute('aria-expanded', 'false');
            if (openItem.querySelector('.read-more-btn')) {
                openItem.querySelector('.read-more-btn').textContent = 'Đọc thêm';
            }
        });

        item.classList.toggle('is-expanded', !isExpanded);
        const button = item.querySelector('.read-more-btn');
        if (button) {
            button.textContent = isExpanded ? 'Đọc thêm' : 'Thu gọn';
            button.setAttribute('aria-expanded', String(!isExpanded));
        }
    });

    listEl?.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const title = event.target.closest('.writing-title');
        if (!title) return;
        event.preventDefault();
        title.click();
    });

    searchInput?.addEventListener('input', renderWritings);
    syncBtn?.addEventListener('click', loadWritings);
    passcodeDigits[0]?.focus();
});
