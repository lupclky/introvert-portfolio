document.addEventListener('DOMContentLoaded', () => {
let activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
const observer = new MutationObserver((mutations) => { mutations.forEach((mutation) => { if (mutation.attributeName === 'data-theme') { activeTheme = document.documentElement.getAttribute('data-theme'); } }); }); observer.observe(document.documentElement, { attributes: true });
/* 10. Zen Games (Menu & Control)
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
let snakeRunning = false;
let snakeDir = { x: 1, y: 0 };
let snakeNextDir = { x: 1, y: 0 };
snakeTimeout = null;
conwayTimer = null;
    let fireflyFrame = null;
    let firefliesRunning = false;
    let wordRainTimer = null;

    let breatheInterval = null;
    let towerAnim = null;
    let sandAnim = null;

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

        if (breatheInterval) clearInterval(breatheInterval);
        breatheInterval = null;
        if (towerAnim) cancelAnimationFrame(towerAnim);
        towerAnim = null;
        if (sandAnim) cancelAnimationFrame(sandAnim);
        sandAnim = null;
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
            else if (gameName === 'breathe') title = 'vòng tròn thở';
            else if (gameName === 'tower') title = 'tháp cân bằng';
            else if (gameName === 'sand') title = 'rơi cát';
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
            } else if (gameName === 'breathe') {
                startBreathe();
            } else if (gameName === 'tower') {
                startTower();
            } else if (gameName === 'sand') {
                startSand();
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
    snakeDir = { x: 0, y: -1 };
    snakeNextDir = { x: 0, y: -1 };
    let snakeFood = { x: 0, y: 0 };
    let snakeScoreVal = 3;
    let snakeBestVal = parseInt(localStorage.getItem('introvert_snake_best') || '3');
    let snakeInterval = null;
    snakeRunning = false;

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
    fireflyFrame = null;
    firefliesRunning = false;
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
    wordRainTimer = null;
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


    // --- GAME N: ZEN BREATHE ---
    let breathePhase = 0; // 0: ready, 1: in, 2: hold, 3: out
    function startBreathe() {
        if (breatheInterval) clearInterval(breatheInterval);
        const circle = document.getElementById('breathe-circle');
        const status = document.getElementById('breathe-status');
        if(!circle || !status) return;
        
        breathePhase = 1;
        circle.style.transition = 'transform 4s linear';
        circle.style.transform = 'scale(2)';
        status.textContent = 'hít vào (4s)...';
        
        breatheInterval = setTimeout(() => {
            breathePhase = 2;
            status.textContent = 'giữ hơi (7s)...';
            breatheInterval = setTimeout(() => {
                breathePhase = 3;
                circle.style.transition = 'transform 8s linear';
                circle.style.transform = 'scale(1)';
                status.textContent = 'thở ra (8s)...';
                breatheInterval = setTimeout(() => {
                    startBreathe(); // loop
                }, 8000);
            }, 7000);
        }, 4000);
    }
    document.getElementById('start-breathe')?.addEventListener('click', startBreathe);

    // --- GAME O: ZEN TOWER ---
    let towerCanvas, towerCtx;
    let blocks = [];
    let movingBlock = null;
    let towerScore = 0;
    
    function startTower() {
        if (towerAnim) cancelAnimationFrame(towerAnim);
        towerCanvas = document.getElementById('tower-canvas');
        if (!towerCanvas) return;
        towerCtx = towerCanvas.getContext('2d');
        
        blocks = [{ x: 100, y: 350, w: 100, h: 20 }];
        towerScore = 0;
        spawnMovingBlock();
        updateTowerScore();
        loopTower();
    }
    
    function spawnMovingBlock() {
        const last = blocks[blocks.length - 1];
        movingBlock = { x: 0, y: last.y - 20, w: last.w, h: 20, speed: 2 + towerScore * 0.1, dir: 1 };
    }
    
    function updateTowerScore() {
        const scoreEl = document.getElementById('tower-score');
        if(scoreEl) scoreEl.textContent = `tầng: ${towerScore}`;
    }
    
    function loopTower() {
        towerCtx.clearRect(0, 0, towerCanvas.width, towerCanvas.height);
        
        // draw blocks
        towerCtx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        if (activeTheme === 'dark') towerCtx.fillStyle = 'rgba(180, 180, 180, 0.8)';
        blocks.forEach(b => towerCtx.fillRect(b.x, b.y, b.w, b.h));
        
        // move & draw moving block
        if (movingBlock) {
            movingBlock.x += movingBlock.speed * movingBlock.dir;
            if (movingBlock.x + movingBlock.w > towerCanvas.width || movingBlock.x < 0) {
                movingBlock.dir *= -1;
            }
            towerCtx.fillStyle = 'rgba(150, 150, 150, 0.8)';
            if (activeTheme === 'dark') towerCtx.fillStyle = 'rgba(200, 200, 200, 0.8)';
            towerCtx.fillRect(movingBlock.x, movingBlock.y, movingBlock.w, movingBlock.h);
        }
        
        towerAnim = requestAnimationFrame(loopTower);
    }
    
    document.getElementById('tower-canvas')?.addEventListener('click', () => {
        if (!movingBlock) return;
        const last = blocks[blocks.length - 1];
        // check intersection
        if (movingBlock.x + movingBlock.w < last.x || movingBlock.x > last.x + last.w) {
            // missed
            startTower(); // reset
            return;
        }
        // slice block
        const newX = Math.max(movingBlock.x, last.x);
        const newW = Math.min(movingBlock.x + movingBlock.w, last.x + last.w) - newX;
        blocks.push({ x: newX, y: movingBlock.y, w: newW, h: 20 });
        towerScore++;
        updateTowerScore();
        
        // shift camera if too high
        if (blocks.length > 10) {
            blocks.forEach(b => b.y += 20);
        }
        spawnMovingBlock();
        movingBlock.w = newW;
    });
    
    document.getElementById('reset-tower')?.addEventListener('click', startTower);

    // --- GAME P: FALLING SAND ---
    let sandCanvas, sandCtx;
    let sandGrid = [];
    const COLS = 60;
    const ROWS = 60;
    const CELL_SIZE = 5;
    let isDrawingSand = false;
    
    function startSand() {
        if (sandAnim) cancelAnimationFrame(sandAnim);
        sandCanvas = document.getElementById('sand-canvas');
        if (!sandCanvas) return;
        sandCtx = sandCanvas.getContext('2d');
        
        sandGrid = Array(COLS).fill().map(() => Array(ROWS).fill(0)); // 0: empty, 1: sand, 2: wall
        loopSand();
    }
    
    function loopSand() {
        sandCtx.clearRect(0, 0, sandCanvas.width, sandCanvas.height);
        
        // update sand logic
        for (let x = 0; x < COLS; x++) {
            for (let y = ROWS - 2; y >= 0; y--) {
                if (sandGrid[x][y] === 1) {
                    // try move down
                    if (sandGrid[x][y+1] === 0) {
                        sandGrid[x][y+1] = 1;
                        sandGrid[x][y] = 0;
                    } else if (x > 0 && sandGrid[x-1][y+1] === 0) {
                        sandGrid[x-1][y+1] = 1;
                        sandGrid[x][y] = 0;
                    } else if (x < COLS - 1 && sandGrid[x+1][y+1] === 0) {
                        sandGrid[x+1][y+1] = 1;
                        sandGrid[x][y] = 0;
                    }
                }
            }
        }
        
        // draw
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                if (sandGrid[x][y] === 1) {
                    sandCtx.fillStyle = '#d4b886'; // sand color
                    sandCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                } else if (sandGrid[x][y] === 2) {
                    sandCtx.fillStyle = activeTheme === 'dark' ? '#888' : '#444'; // wall color
                    sandCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        
        // spawn sand at top middle
        if (Math.random() < 0.3) {
            sandGrid[Math.floor(COLS/2)][0] = 1;
        }
        
        sandAnim = requestAnimationFrame(loopSand);
    }
    
    function drawWall(e) {
        if (!isDrawingSand || !sandCanvas) return;
        const rect = sandCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridX = Math.floor(mouseX / CELL_SIZE);
        const gridY = Math.floor(mouseY / CELL_SIZE);
        if (gridX >= 0 && gridX < COLS && gridY >= 0 && gridY < ROWS) {
            sandGrid[gridX][gridY] = 2; // draw wall
            if(gridX > 0) sandGrid[gridX-1][gridY] = 2;
            if(gridX < COLS-1) sandGrid[gridX+1][gridY] = 2;
            if(gridY > 0) sandGrid[gridX][gridY-1] = 2;
            if(gridY < ROWS-1) sandGrid[gridX][gridY+1] = 2;
        }
    }
    
    document.getElementById('sand-canvas')?.addEventListener('mousedown', () => isDrawingSand = true);
    window.addEventListener('mouseup', () => isDrawingSand = false);
    document.getElementById('sand-canvas')?.addEventListener('mousemove', drawWall);
    
    document.getElementById('sand-clear')?.addEventListener('click', () => {
        if (sandGrid) sandGrid = Array(COLS).fill().map(() => Array(ROWS).fill(0));
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

    // --- MOBILE TOUCH SUPPORT ---
    let docTouchStartX = 0;
    let docTouchStartY = 0;
    
    document.addEventListener('touchstart', e => {
        docTouchStartX = e.changedTouches[0].screenX;
        docTouchStartY = e.changedTouches[0].screenY;
    }, {passive: true});
    
    document.addEventListener('touchend', e => {
        if (currentActiveGame !== '2048' && currentActiveGame !== 'snake') return;
        
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        let dx = touchEndX - docTouchStartX;
        let dy = touchEndY - docTouchStartY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (Math.abs(dx) > 30) {
                if (dx > 0) { // right
                    if (currentActiveGame === '2048') handle2048Move('right');
                    else if (currentActiveGame === 'snake' && snakeRunning && snakeDir.x === 0) snakeNextDir = {x: 1, y: 0};
                } else { // left
                    if (currentActiveGame === '2048') handle2048Move('left');
                    else if (currentActiveGame === 'snake' && snakeRunning && snakeDir.x === 0) snakeNextDir = {x: -1, y: 0};
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(dy) > 30) {
                if (dy > 0) { // down
                    if (currentActiveGame === '2048') handle2048Move('down');
                    else if (currentActiveGame === 'snake' && snakeRunning && snakeDir.y === 0) snakeNextDir = {x: 0, y: 1};
                } else { // up
                    if (currentActiveGame === '2048') handle2048Move('up');
                    else if (currentActiveGame === 'snake' && snakeRunning && snakeDir.y === 0) snakeNextDir = {x: 0, y: -1};
                }
            }
        }
    });

    // Mobile touch for Sand Canvas
    const sandCanvasEl = document.getElementById('sand-canvas');
    if(sandCanvasEl) {
        sandCanvasEl.addEventListener('touchstart', (e) => {
            isDrawingSand = true;
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            drawWall(mouseEvent);
        }, {passive: true});
        
        sandCanvasEl.addEventListener('touchmove', (e) => {
            if(!isDrawingSand) return;
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            drawWall(mouseEvent);
        }, {passive: true});
        
        window.addEventListener('touchend', () => isDrawingSand = false);
    }
});