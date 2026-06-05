document.addEventListener('DOMContentLoaded', () => {
    const GOOGLE_APPS_SCRIPT_URL = "/api/sheet";
    const UNLOCK_API_URL = "/api/unlock";
    const LOCAL_STORAGE_SESSION_KEY = "introvert_session";
    const LOCAL_STORAGE_PASSCODE_KEY = "introvert_passcode";
    const OFFLINE_DATA_KEY = "introvert_pineapple_offline";

    const lockSection = document.getElementById('password-overlay');
    const appSection = document.getElementById('pineapple-app');
    const lockForm = document.getElementById('password-form');
    const passcodeDigits = Array.from(document.querySelectorAll('.passcode-digit'));
    const lockStatus = document.getElementById('password-status');

    const feedEl = document.getElementById('dua-feed');
    const statusEl = document.getElementById('dua-status');
    const filterBtns = document.querySelectorAll('.dua-filter-btn');
    
    // Add Trigger & Modal
    const addTriggerBtn = document.getElementById('dua-add-trigger');
    const addModal = document.getElementById('dua-modal');
    const addModalClose = document.getElementById('dua-modal-close');
    const addForm = document.getElementById('dua-modal-form');
    
    // Upload inputs
    const fileInput = document.getElementById('dua-file-input');
    const uploadStatus = document.getElementById('dua-upload-status');
    
    let currentPasscode = localStorage.getItem(LOCAL_STORAGE_PASSCODE_KEY) || "";
    let privateSessionToken = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY) || "";
    let moments = [];
    let activeCategory = "all";

    // Variables for uploaded image
    let tempImageBlob = "";
    let tempImageMimeType = "";
    let tempImageName = "";

    /* =============================================================
       PASSCODE LOCK LOGIC
       ============================================================= */
    
    // Auto focus and shift behavior for digits
    passcodeDigits.forEach((digit, index) => {
        digit.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length === 1 && index < passcodeDigits.length - 1) {
                passcodeDigits[index + 1].focus();
            }
            if (getEnteredPasscode().length === 6) {
                handleUnlock();
            }
        });

        digit.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !digit.value && index > 0) {
                passcodeDigits[index - 1].focus();
            }
        });
    });

    function getEnteredPasscode() {
        return passcodeDigits.map(input => input.value).join('');
    }

    function resetPasscodeInputs() {
        passcodeDigits.forEach(input => {
            input.value = "";
        });
        passcodeDigits[0].focus();
    }

    async function handleUnlock() {
        const passcode = getEnteredPasscode();
        if (passcode.length !== 6) return;

        setLockStatus("Đang mở khóa...");
        try {
            const token = await requestPrivateUnlock(passcode);
            currentPasscode = passcode;
            privateSessionToken = token;
            
            // Save to localStorage
            localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, token);
            localStorage.setItem(LOCAL_STORAGE_PASSCODE_KEY, passcode);

            // Attempt to load moments
            await loadMoments();
            
            // Success: Hide overlay
            lockSection.style.display = "none";
            appSection.style.display = "block";
            setLockStatus("");
        } catch (err) {
            console.error(err);
            setLockStatus("Mật mã chưa đúng, vui lòng thử lại.");
            resetPasscodeInputs();
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

    function getPrivateHeaders(baseHeaders = {}) {
        return privateSessionToken
            ? { ...baseHeaders, Authorization: `Bearer ${privateSessionToken}` }
            : baseHeaders;
    }

    function setLockStatus(msg) {
        if (lockStatus) lockStatus.textContent = msg;
    }

    // Auto unlock if session exists
    if (privateSessionToken && currentPasscode) {
        (async () => {
            try {
                // Verify session
                await loadMoments();
                lockSection.style.display = "none";
                appSection.style.display = "block";
            } catch (err) {
                console.warn("Phiên cũ đã hết hạn, yêu cầu nhập lại passcode.", err);
                localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
                localStorage.removeItem(LOCAL_STORAGE_PASSCODE_KEY);
                privateSessionToken = "";
                currentPasscode = "";
                lockSection.style.display = "flex";
                passcodeDigits[0].focus();
            }
        })();
    } else {
        lockSection.style.display = "flex";
        passcodeDigits[0].focus();
    }

    if (lockForm) {
        lockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUnlock();
        });
    }

    /* =============================================================
       GOOGLE DRIVE & YOUTUBE REGEX & CDN
       ============================================================= */

    function extractDriveId(url) {
        if (!url) return null;
        // Match drive.google.com/file/d/FILE_ID/view
        const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileDMatch) return fileDMatch[1];
        // Match drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
        const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idMatch) return idMatch[1];
        return null;
    }

    function formatImageUrl(url) {
        const driveId = extractDriveId(url);
        if (driveId) {
            // Google Drive direct image display CDN
            return `https://lh3.googleusercontent.com/d/${driveId}`;
        }
        return url;
    }

    function getDownloadUrl(url) {
        const driveId = extractDriveId(url);
        if (driveId) {
            // Google Drive direct download URL
            return `https://drive.google.com/uc?export=download&id=${driveId}`;
        }
        return url;
    }

    function extractYoutubeId(url) {
        if (!url) return null;
        // Match youtube.com/watch?v=VIDEO_ID
        const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
        if (watchMatch) return watchMatch[1];
        // Match youtu.be/VIDEO_ID
        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (shortMatch) return shortMatch[1];
        // Match youtube.com/embed/VIDEO_ID
        const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch) return embedMatch[1];
        // Match youtube.com/shorts/VIDEO_ID
        const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
        if (shortsMatch) return shortsMatch[1];
        return null;
    }

    /* =============================================================
       IMAGE UPLOAD BASE64 LOGIC
       ============================================================= */
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 8 * 1024 * 1024) { // Limit to 8MB
                alert("Kích thước file ảnh quá lớn (vui lòng chọn ảnh < 8MB).");
                fileInput.value = "";
                return;
            }

            uploadStatus.textContent = "Đang đọc file ảnh...";
            const reader = new FileReader();
            reader.onload = function(event) {
                tempImageBlob = event.target.result; // Base64 data url
                tempImageMimeType = file.type;
                tempImageName = file.name;
                
                const successMsg = window.IntrovertPageI18n?.t("dua.add.uploadSuccess") || "Đã tải ảnh lên Drive!";
                uploadStatus.textContent = `${successMsg} (${file.name})`;
                uploadStatus.style.color = "#4ade80"; // Bright cute green
                
                // Disable direct url input if uploading
                document.getElementById('dua-mediaUrl').placeholder = "Đang sử dụng ảnh vừa tải lên...";
                document.getElementById('dua-mediaUrl').disabled = true;
            };
            reader.readAsDataURL(file);
        });
    }

    /* =============================================================
       DATA OPERATION (GET & POST)
       ============================================================= */

    function setStatus(msg) {
        if (statusEl) statusEl.textContent = msg;
    }

    async function loadMoments() {
        setStatus("Đang tải dữ liệu...");
        try {
            const separator = GOOGLE_APPS_SCRIPT_URL.includes('?') ? '&' : '?';
            const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}${separator}type=pineapple`, {
                headers: getPrivateHeaders()
            });

            if (response.status === 401) {
                throw new Error("Expired or invalid session token.");
            }

            const data = await response.json();
            moments = Array.isArray(data) ? data : [];
            // Cache offline
            localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(moments));
            
            // Sort moments: live-current stays on top, then sort by date descending
            moments.sort((a, b) => {
                if (a.category === "live-current" && b.category !== "live-current") return -1;
                if (b.category === "live-current" && a.category !== "live-current") return 1;
                return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
            });

            renderMoments();
            setStatus("");
        } catch (err) {
            console.error(err);
            // Fallback load offline
            const offline = localStorage.getItem(OFFLINE_DATA_KEY);
            if (offline) {
                moments = JSON.parse(offline);
                renderMoments();
                setStatus("Chưa đồng bộ được với Google Sheet (Đang hiển thị ngoại tuyến).");
            } else {
                setStatus("Không tải được dữ liệu. Vui lòng kiểm tra lại cấu hình kết nối.");
            }
            if (err.message.includes("session")) {
                throw err; // Bubble up lock overlay trigger
            }
        }
    }

    async function saveMoment(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('dua-save-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang gửi...";

        const category = document.getElementById('dua-category').value;
        const title = document.getElementById('dua-title').value.trim();
        const content = document.getElementById('dua-content').value.trim();
        let mediaUrl = document.getElementById('dua-mediaUrl').value.trim();

        const payload = {
            type: "pineapple",
            category,
            title,
            content,
            mediaUrl,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        // Attach base64 image if exists
        if (tempImageBlob) {
            payload.imageBlob = tempImageBlob;
            payload.mimeType = tempImageMimeType;
            payload.imageName = tempImageName;
        }

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                headers: getPrivateHeaders({
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok || (result && result.success === false)) {
                throw new Error(result.error || "Gửi thất bại.");
            }

            // Reset form
            addForm.reset();
            tempImageBlob = "";
            tempImageMimeType = "";
            tempImageName = "";
            uploadStatus.textContent = "";
            document.getElementById('dua-mediaUrl').placeholder = "https://youtube.com/... hoặc link ảnh Drive...";
            document.getElementById('dua-mediaUrl').disabled = false;
            
            // Close modal & reload feed
            addModal.style.display = "none";
            await loadMoments();
        } catch (err) {
            console.error(err);
            alert("Lỗi khi đăng bài: " + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = window.IntrovertPageI18n?.t("dua.add.submit") || "Đăng lên";
        }
    }

    if (addForm) {
        addForm.addEventListener('submit', saveMoment);
    }

    /* =============================================================
       RENDERING LOGIC
       ============================================================= */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderMoments() {
        if (!feedEl) return;
        
        const filtered = moments.filter(item => {
            if (activeCategory === "all") return true;
            return item.category === activeCategory;
        });

        if (filtered.length === 0) {
            feedEl.innerHTML = `
                <div class="dua-empty-state">
                    <div class="dua-empty-emoji">🍃</div>
                    <p>Góc này hiện chưa có khoảnh khắc nào.</p>
                </div>
            `;
            return;
        }

        feedEl.innerHTML = filtered.map(item => {
            const ytId = extractYoutubeId(item.mediaUrl);
            const isDrive = extractDriveId(item.mediaUrl);
            
            let mediaHtml = "";
            let actionBtnHtml = "";
            
            if (ytId) {
                // Render YouTube embed
                mediaHtml = `
                    <div class="dua-card-media-wrapper yt-embed">
                        <iframe src="https://www.youtube.com/embed/${ytId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                `;
            } else if (item.mediaUrl) {
                // Render image display (lh3.googleusercontent.com/d/ ID for Drive, or direct source)
                const displayUrl = formatImageUrl(item.mediaUrl);
                mediaHtml = `
                    <div class="dua-card-media-wrapper">
                        <img src="${displayUrl}" alt="${escapeHTML(item.title)}" class="dua-card-img" loading="lazy">
                    </div>
                `;

                if (isDrive) {
                    const dlUrl = getDownloadUrl(item.mediaUrl);
                    const dlLabel = window.IntrovertPageI18n?.t("dua.card.download") || "Tải ảnh";
                    actionBtnHtml = `
                        <div class="dua-card-actions">
                            <a href="${dlUrl}" target="_blank" download class="dua-btn-download">💾 ${dlLabel}</a>
                        </div>
                    `;
                }
            }

            const liveLabel = window.IntrovertPageI18n?.t("dua.card.liveNow") || "LIVE NOW";
            const liveBadge = item.category === "live-current" ? `<span class="dua-live-badge pulse-anim">${liveLabel} 🔴</span>` : "";
            const categoryLabel = window.IntrovertPageI18n?.t(`dua.filter.${item.category}`) || item.category;

            return `
                <article class="dua-card category-${item.category}">
                    <div class="dua-card-meta">
                        <span class="dua-card-category-label">${categoryLabel}</span>
                        ${liveBadge}
                        <time class="dua-card-time">${escapeHTML(item.displayDate)}</time>
                    </div>
                    <h3 class="dua-card-title">${escapeHTML(item.title || "Khoảnh khắc")}</h3>
                    ${mediaHtml}
                    ${item.content ? `<p class="dua-card-content">${escapeHTML(item.content)}</p>` : ""}
                    ${actionBtnHtml}
                </article>
            `;
        }).join("");
    }

    /* =============================================================
       MODAL & FILTERS INTERACTION
       ============================================================= */

    // Open Modal
    if (addTriggerBtn && addModal) {
        addTriggerBtn.addEventListener('click', () => {
            addModal.style.display = "flex";
            document.getElementById('dua-category').focus();
        });
    }

    // Close Modal
    if (addModalClose && addModal) {
        addModalClose.addEventListener('click', () => {
            addModal.style.display = "none";
            addForm.reset();
            tempImageBlob = "";
            tempImageMimeType = "";
            tempImageName = "";
            uploadStatus.textContent = "";
            document.getElementById('dua-mediaUrl').placeholder = "https://youtube.com/... hoặc link ảnh Drive...";
            document.getElementById('dua-mediaUrl').disabled = false;
        });
    }

    // Category filter button click
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            renderMoments();
        });
    });
});
