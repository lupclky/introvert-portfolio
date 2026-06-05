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
    let snakeTimeout = null;
    let conwayTimer = null;
    let fireflyFrame = null;
    let firefliesRunning = false;
    let wordRainTimer = null;

    let breatheInterval = null;
    let towerAnim = null;
    let sandAnim = null;

    // Variables for 18 new games
    let rakeAnim = null;
    let ripplesAnim = null;
    let chimesAnim = null;
    let bonsaiAnim = null;
    let origamiAnim = null;
    let pebblesAnim = null;
    let constellationAnim = null;
    let lanternAnim = null;
    let shadowAnim = null;
    let tangramAnim = null;
    
    // Audio Context and synthesized node references for soundscape and chimes
    let audioCtx = null;
    let soundscapeActiveNodes = {};
    let soundscapeIntervals = [];

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

        // Clean up 18 new games animations
        if (rakeAnim) cancelAnimationFrame(rakeAnim);
        rakeAnim = null;
        if (ripplesAnim) cancelAnimationFrame(ripplesAnim);
        ripplesAnim = null;
        if (chimesAnim) cancelAnimationFrame(chimesAnim);
        chimesAnim = null;
        if (bonsaiAnim) cancelAnimationFrame(bonsaiAnim);
        bonsaiAnim = null;
        if (origamiAnim) cancelAnimationFrame(origamiAnim);
        origamiAnim = null;
        if (pebblesAnim) cancelAnimationFrame(pebblesAnim);
        pebblesAnim = null;
        if (constellationAnim) cancelAnimationFrame(constellationAnim);
        constellationAnim = null;
        if (lanternAnim) cancelAnimationFrame(lanternAnim);
        lanternAnim = null;
        if (shadowAnim) cancelAnimationFrame(shadowAnim);
        shadowAnim = null;
        if (tangramAnim) cancelAnimationFrame(tangramAnim);
        tangramAnim = null;

        // Clean up Soundscape audio contexts, nodes and intervals
        soundscapeIntervals.forEach(interval => clearInterval(interval));
        soundscapeIntervals = [];
        
        if (audioCtx) {
            try {
                if (audioCtx.state !== 'closed') {
                    audioCtx.close();
                }
            } catch (err) {
                console.error("Error closing AudioContext:", err);
            }
            audioCtx = null;
        }
        soundscapeActiveNodes = {};
    }

    gameSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameName = btn.getAttribute('data-game');
            stopIndieGames();
            currentActiveGame = gameName;

            gameSelectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

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
            else if (gameName === 'rake') title = 'cào cát zen';
            else if (gameName === 'soundscape') title = 'hòa âm thiên nhiên';
            else if (gameName === 'ripples') title = 'giọt nước mặt hồ';
            else if (gameName === 'chimes') title = 'chuông gió bình yên';
            else if (gameName === 'kintsugi') title = 'hàn gắn kintsugi';
            else if (gameName === 'bonsai') title = 'cắt tỉa bonsai';
            else if (gameName === 'origami') title = 'gấp giấy origami';
            else if (gameName === 'calligraphy') title = 'luyện thư pháp';
            else if (gameName === 'ikebana') title = 'cắm hoa ikebana';
            else if (gameName === 'stainedglass') title = 'xếp kính màu';
            else if (gameName === 'pebbles') title = 'xếp đá thăng bằng';
            else if (gameName === 'constellation') title = 'dệt sao đêm';
            else if (gameName === 'tea') title = 'nghệ thuật trà đạo';
            else if (gameName === 'lantern') title = 'thả đèn trời';
            else if (gameName === 'shadow') title = 'múa bóng nghệ thuật';
            else if (gameName === 'tangram') title = 'trò chơi trí uẩn';
            else if (gameName === 'mahjong') title = 'cặp trùng mahjong';
            else if (gameName === 'zensudoku') title = 'sudoku tĩnh lặng';
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
            } else if (gameName === 'rake') {
                startRake();
            } else if (gameName === 'soundscape') {
                startSoundscape();
            } else if (gameName === 'ripples') {
                startRipples();
            } else if (gameName === 'chimes') {
                startChimes();
            } else if (gameName === 'kintsugi') {
                startKintsugi();
            } else if (gameName === 'bonsai') {
                startBonsai();
            } else if (gameName === 'origami') {
                startOrigami();
            } else if (gameName === 'calligraphy') {
                startCalligraphy();
            } else if (gameName === 'ikebana') {
                startIkebana();
            } else if (gameName === 'stainedglass') {
                startStainedGlass();
            } else if (gameName === 'pebbles') {
                startPebbles();
            } else if (gameName === 'constellation') {
                startConstellation();
            } else if (gameName === 'tea') {
                startTea();
            } else if (gameName === 'lantern') {
                startLantern();
            } else if (gameName === 'shadow') {
                startShadow();
            } else if (gameName === 'tangram') {
                startTangram();
            } else if (gameName === 'mahjong') {
                startMahjong();
            } else if (gameName === 'zensudoku') {
                startSudoku();
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
            gameSelectBtns.forEach(b => b.classList.remove('active'));
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

    // --- GAME 1: CÀO CÁT ZEN ---
    let rakeCanvas, rakeCtx, isDrawingRake = false;
    let rakeStones = [{x: 100, y: 100, r: 25}, {x: 220, y: 130, r: 30}, {x: 160, y: 230, r: 20}];
    function startRake() {
        if (rakeAnim) cancelAnimationFrame(rakeAnim);
        rakeCanvas = document.getElementById('rake-canvas');
        if (!rakeCanvas) return;
        rakeCtx = rakeCanvas.getContext('2d');
        clearRakeSand();
        
        rakeCanvas.onmousedown = (e) => { isDrawingRake = true; drawRakeStroke(e); };
        window.onmouseup = () => isDrawingRake = false;
        rakeCanvas.onmousemove = drawRakeStroke;

        rakeCanvas.ontouchstart = (e) => { isDrawingRake = true; drawRakeStroke(e.touches[0]); };
        window.ontouchend = () => isDrawingRake = false;
        rakeCanvas.ontouchmove = (e) => { if(isDrawingRake) drawRakeStroke(e.touches[0]); };
    }
    function clearRakeSand() {
        if (!rakeCanvas) return;
        rakeCtx.fillStyle = '#eae2d5'; // sand color
        rakeCtx.fillRect(0, 0, rakeCanvas.width, rakeCanvas.height);
        rakeCtx.fillStyle = 'rgba(0,0,0,0.02)';
        for(let i=0; i<1500; i++) {
            rakeCtx.fillRect(Math.random()*rakeCanvas.width, Math.random()*rakeCanvas.height, 1, 1);
        }
        drawRakeStones();
    }
    function drawRakeStones() {
        rakeStones.forEach(s => {
            rakeCtx.beginPath();
            rakeCtx.arc(s.x + 3, s.y + 4, s.r, 0, Math.PI*2);
            rakeCtx.fillStyle = 'rgba(0,0,0,0.1)';
            rakeCtx.fill();
            
            rakeCtx.beginPath();
            rakeCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            rakeCtx.fillStyle = activeTheme === 'dark' ? '#555' : '#888';
            rakeCtx.fill();
            
            rakeCtx.beginPath();
            rakeCtx.arc(s.x - 2, s.y - 2, s.r - 4, 0, Math.PI*2);
            rakeCtx.fillStyle = activeTheme === 'dark' ? '#666' : '#9a9';
            rakeCtx.fill();
        });
    }
    function drawRakeStroke(e) {
        if (!isDrawingRake || !rakeCanvas) return;
        const rect = rakeCanvas.getBoundingClientRect();
        const clientX = e.clientX || e.pageX;
        const clientY = e.clientY || e.pageY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        rakeCtx.strokeStyle = 'rgba(0,0,0,0.08)';
        if(activeTheme === 'dark') rakeCtx.strokeStyle = 'rgba(255,255,255,0.06)';
        rakeCtx.lineWidth = 2;
        for(let i = -10; i <= 10; i += 5) {
            rakeCtx.beginPath();
            rakeCtx.arc(x, y, 8 + i, 0, Math.PI*2);
            rakeCtx.stroke();
        }
        drawRakeStones();
    }
    document.getElementById('rake-clear')?.addEventListener('click', clearRakeSand);

    // --- GAME 2: HÒA ÂM THIÊN NHIÊN ---
    function startSoundscape() {
        initAudioContext();
        setupSoundscapeChannel('vol-rain', 'rain');
        setupSoundscapeChannel('vol-wind', 'wind');
        setupSoundscapeChannel('vol-waves', 'waves');
        setupSoundscapeChannel('vol-fire', 'fire');
        setupSoundscapeChannel('vol-piano', 'piano');
        setupSoundscapeChannel('vol-chimes', 'chimes');
    }
    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    function setupSoundscapeChannel(sliderId, type) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;
        
        slider.oninput = () => {
            initAudioContext();
            const val = parseFloat(slider.value) / 100;
            updateSoundscapeVolume(type, val);
        };
    }
    function updateSoundscapeVolume(type, volume) {
        if (!audioCtx) return;
        if (!soundscapeActiveNodes[type]) {
            createSoundscapeNode(type);
        }
        if (soundscapeActiveNodes[type] && soundscapeActiveNodes[type].gainNode) {
            soundscapeActiveNodes[type].gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        }
    }
    function createSoundscapeNode(type) {
        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'rain') {
            let noise = audioCtx.createBufferSource();
            noise.buffer = createNoiseBuffer('white');
            noise.loop = true;
            let filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, audioCtx.currentTime);
            noise.connect(filter);
            filter.connect(gainNode);
            noise.start(0);
            soundscapeActiveNodes[type] = { source: noise, gainNode: gainNode };
        } else if (type === 'wind') {
            let noise = audioCtx.createBufferSource();
            noise.buffer = createNoiseBuffer('pink');
            noise.loop = true;
            let filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.setValueAtTime(2.0, audioCtx.currentTime);
            
            let lfo = audioCtx.createOscillator();
            lfo.frequency.setValueAtTime(0.05, audioCtx.currentTime);
            let lfoGain = audioCtx.createGain();
            lfoGain.gain.setValueAtTime(400, audioCtx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            
            noise.connect(filter);
            filter.connect(gainNode);
            lfo.start(0);
            noise.start(0);
            soundscapeActiveNodes[type] = { source: noise, gainNode: gainNode, lfo: lfo };
        } else if (type === 'waves') {
            let noise = audioCtx.createBufferSource();
            noise.buffer = createNoiseBuffer('pink');
            noise.loop = true;
            let filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, audioCtx.currentTime);
            
            let lfo = audioCtx.createOscillator();
            lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime);
            let lfoGain = audioCtx.createGain();
            lfoGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            
            let waveVolumeOffset = audioCtx.createGain();
            waveVolumeOffset.gain.setValueAtTime(0.5, audioCtx.currentTime);
            
            lfo.connect(lfoGain);
            lfoGain.connect(waveVolumeOffset.gain);
            
            noise.connect(filter);
            filter.connect(waveVolumeOffset);
            waveVolumeOffset.connect(gainNode);
            lfo.start(0);
            noise.start(0);
            soundscapeActiveNodes[type] = { source: noise, gainNode: gainNode, lfo: lfo };
        } else if (type === 'fire') {
            let noise = audioCtx.createBufferSource();
            noise.buffer = createNoiseBuffer('pink');
            noise.loop = true;
            let filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, audioCtx.currentTime);
            noise.connect(filter);
            filter.connect(gainNode);
            noise.start(0);
            
            let fireInterval = setInterval(() => {
                if (Math.random() < 0.15 && audioCtx && gainNode.gain.value > 0) {
                    playCrackNode(gainNode);
                }
            }, 100);
            soundscapeIntervals.push(fireInterval);
            soundscapeActiveNodes[type] = { source: noise, gainNode: gainNode };
        } else if (type === 'piano') {
            let pianoInterval = setInterval(() => {
                if (Math.random() < 0.4 && audioCtx && gainNode.gain.value > 0) {
                    const freqs = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
                    const freq = freqs[Math.floor(Math.random() * freqs.length)];
                    playPianoNode(freq, gainNode);
                }
            }, 3000);
            soundscapeIntervals.push(pianoInterval);
            soundscapeActiveNodes[type] = { gainNode: gainNode };
        } else if (type === 'chimes') {
            let chimeInterval = setInterval(() => {
                if (Math.random() < 0.3 && audioCtx && gainNode.gain.value > 0) {
                    const freqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
                    const freq = freqs[Math.floor(Math.random() * freqs.length)];
                    playChimeNode(freq, gainNode);
                }
            }, 4000);
            soundscapeIntervals.push(chimeInterval);
            soundscapeActiveNodes[type] = { gainNode: gainNode };
        }
    }
    function playCrackNode(parentGain) {
        if (!audioCtx) return;
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200 + Math.random() * 800, audioCtx.currentTime);
        gain.gain.setValueAtTime(parentGain.gain.value * 0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(0);
        osc.stop(audioCtx.currentTime + 0.03);
    }
    function playPianoNode(freq, parentGain) {
        if (!audioCtx) return;
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        let now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(parentGain.gain.value * 0.3, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(0);
        osc.stop(now + 4.5);
    }
    function playChimeNode(freq, parentGain) {
        if (!audioCtx) return;
        let osc1 = audioCtx.createOscillator();
        let osc2 = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        
        osc1.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc2.frequency.setValueAtTime(freq * 1.5, audioCtx.currentTime);
        
        let now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(parentGain.gain.value * 0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.start(0);
        osc2.start(0);
        osc1.stop(now + 3.5);
        osc2.stop(now + 3.5);
    }
    function createNoiseBuffer(type) {
        let bufferSize = 2 * audioCtx.sampleRate;
        let noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        let output = noiseBuffer.getChannelData(0);
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        for (let i = 0; i < bufferSize; i++) {
            let white = Math.random() * 2 - 1;
            if (type === 'pink') {
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            } else {
                output[i] = white;
            }
        }
        return noiseBuffer;
    }
    document.getElementById('soundscape-mute')?.addEventListener('click', () => {
        const sliders = ['vol-rain', 'vol-wind', 'vol-waves', 'vol-fire', 'vol-piano', 'vol-chimes'];
        sliders.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = 0;
        });
        Object.keys(soundscapeActiveNodes).forEach(type => {
            updateSoundscapeVolume(type, 0);
        });
    });

    // --- GAME 3: GIỌT NƯỚC MẶT HỒ ---
    let ripplesCanvas, ripplesCtx;
    let ripplesList = [];
    let rippleLeaves = [];
    function startRipples() {
        if (ripplesAnim) cancelAnimationFrame(ripplesAnim);
        ripplesCanvas = document.getElementById('ripples-canvas');
        if (!ripplesCanvas) return;
        ripplesCtx = ripplesCanvas.getContext('2d');
        
        ripplesList = [];
        rippleLeaves = [
            { x: 80, y: 120, vx: 0, vy: 0, r: 8, color: '#e5a65d', angle: 0.2 },
            { x: 220, y: 100, vx: 0, vy: 0, r: 10, color: '#d48a60', angle: -0.5 },
            { x: 150, y: 240, vx: 0, vy: 0, r: 7, color: '#a2b082', angle: 0.8 }
        ];
        
        ripplesCanvas.onclick = (e) => {
            const rect = ripplesCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripplesList.push({ x: x, y: y, r: 0, maxR: 120, alpha: 1 });
            triggerChimeSound(x);
        };
        
        loopRipples();
    }
    function triggerChimeSound(x) {
        try {
            initAudioContext();
            if (audioCtx) {
                const pitch = 300 + (x / 320) * 600;
                let osc = audioCtx.createOscillator();
                let gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(0);
                osc.stop(audioCtx.currentTime + 1.6);
            }
        } catch(e) {}
    }
    function loopRipples() {
        if (!ripplesCanvas) return;
        ripplesCtx.clearRect(0, 0, ripplesCanvas.width, ripplesCanvas.height);
        ripplesCtx.fillStyle = activeTheme === 'dark' ? '#0f172a' : '#f0f9ff';
        ripplesCtx.fillRect(0, 0, ripplesCanvas.width, ripplesCanvas.height);
        
        ripplesCtx.lineWidth = 1.5;
        for (let i = ripplesList.length - 1; i >= 0; i--) {
            let r = ripplesList[i];
            r.r += 2;
            r.alpha = 1 - (r.r / r.maxR);
            
            if (r.r >= r.maxR) {
                ripplesList.splice(i, 1);
                continue;
            }
            
            ripplesCtx.beginPath();
            ripplesCtx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
            ripplesCtx.strokeStyle = activeTheme === 'dark' 
                ? `rgba(148, 163, 184, ${r.alpha * 0.4})` 
                : `rgba(56, 189, 248, ${r.alpha * 0.5})`;
            ripplesCtx.stroke();
            
            rippleLeaves.forEach(l => {
                let dx = l.x - r.x;
                let dy = l.y - r.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (Math.abs(dist - r.r) < 5 && dist > 1) {
                    let force = (1 - (dist / r.maxR)) * 0.5;
                    l.vx += (dx / dist) * force;
                    l.vy += (dy / dist) * force;
                }
            });
        }
        
        rippleLeaves.forEach(l => {
            l.x += l.vx;
            l.y += l.vy;
            l.vx *= 0.95;
            l.vy *= 0.95;
            
            if(l.x < l.r) { l.x = l.r; l.vx *= -1; }
            if(l.x > ripplesCanvas.width - l.r) { l.x = ripplesCanvas.width - l.r; l.vx *= -1; }
            if(l.y < l.r) { l.y = l.r; l.vy *= -1; }
            if(l.y > ripplesCanvas.height - l.r) { l.y = ripplesCanvas.height - l.r; l.vy *= -1; }
            
            ripplesCtx.save();
            ripplesCtx.translate(l.x, l.y);
            ripplesCtx.rotate(l.angle + Math.atan2(l.vy, l.vx)*0.1);
            ripplesCtx.beginPath();
            ripplesCtx.ellipse(0, 0, l.r * 1.5, l.r, 0, 0, Math.PI * 2);
            ripplesCtx.fillStyle = l.color;
            ripplesCtx.fill();
            ripplesCtx.beginPath();
            ripplesCtx.moveTo(-l.r * 1.5, 0);
            ripplesCtx.lineTo(l.r * 1.5, 0);
            ripplesCtx.strokeStyle = 'rgba(0,0,0,0.15)';
            ripplesCtx.stroke();
            ripplesCtx.restore();
        });
        
        ripplesAnim = requestAnimationFrame(loopRipples);
    }
    document.getElementById('ripples-reset')?.addEventListener('click', () => {
        ripplesList = [];
    });

    // --- GAME 4: CHUÔNG GIÓ BÌNH YÊN ---
    let chimesCanvas, chimesCtx;
    let chimeTubes = [];
    function startChimes() {
        if (chimesAnim) cancelAnimationFrame(chimesAnim);
        chimesCanvas = document.getElementById('chimes-canvas');
        if (!chimesCanvas) return;
        chimesCtx = chimesCanvas.getContext('2d');
        
        const freqs = [392.00, 440.00, 523.25, 587.33, 659.25];
        chimeTubes = [];
        for (let i = 0; i < 5; i++) {
            chimeTubes.push({
                x: 60 + i * 50,
                length: 120 + i * 20,
                angle: 0,
                angVel: 0,
                freq: freqs[i],
                color: activeTheme === 'dark' ? '#b4b4b4' : '#6b7280',
                width: 12,
                hitCooldown: 0
            });
        }
        
        const chimeTouch = (e) => {
            const rect = chimesCanvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            if (!clientX) return;
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            chimeTubes.forEach(t => {
                if (Math.abs(x - t.x) < 25 && y > 30 && y < 30 + t.length) {
                    t.angVel += (x - t.x) * 0.005;
                }
            });
        };
        
        chimesCanvas.onmousemove = chimeTouch;
        chimesCanvas.ontouchmove = (e) => chimeTouch(e);
        
        loopChimes();
    }
    function loopChimes() {
        if (!chimesCanvas) return;
        chimesCtx.clearRect(0, 0, chimesCanvas.width, chimesCanvas.height);
        chimesCtx.fillStyle = '#8b5a2b';
        chimesCtx.fillRect(30, 20, chimesCanvas.width - 60, 10);
        
        chimeTubes.forEach((t) => {
            const gravity = 0.0005;
            const damping = 0.985;
            const torque = -gravity * Math.sin(t.angle);
            t.angVel += torque;
            t.angVel *= damping;
            t.angle += t.angVel;
            
            if (t.hitCooldown > 0) t.hitCooldown--;
            if (Math.abs(t.angle) > 0.15 && t.hitCooldown === 0) {
                playChimeNode(t.freq, { gainNode: { gain: { value: Math.abs(t.angle) * 0.5 } } });
                t.hitCooldown = 60;
            }
            
            chimesCtx.save();
            chimesCtx.translate(t.x, 30);
            chimesCtx.rotate(t.angle);
            chimesCtx.beginPath();
            chimesCtx.moveTo(0, 0);
            chimesCtx.lineTo(0, 20);
            chimesCtx.strokeStyle = '#999';
            chimesCtx.stroke();
            chimesCtx.fillStyle = t.color;
            chimesCtx.fillRect(-t.width/2, 20, t.width, t.length);
            chimesCtx.strokeStyle = 'rgba(0,0,0,0.2)';
            chimesCtx.strokeRect(-t.width/2, 20, t.width, t.length);
            chimesCtx.restore();
        });
        
        if (Math.random() < 0.02) {
            const windForce = (Math.random() - 0.5) * 0.02;
            chimeTubes.forEach(t => t.angVel += windForce);
        }
        chimesAnim = requestAnimationFrame(loopChimes);
    }

    // --- GAME 5: HÀN GẮN KINTSUGI ---
    let kintsugiCanvas, kintsugiCtx;
    let kintsugiDone = false, goldLinesPainted = 0, isPaintingKintsugi = false;
    function startKintsugi() {
        const board = document.getElementById('kintsugi-board');
        kintsugiCanvas = document.getElementById('kintsugi-canvas');
        const desc = document.getElementById('kintsugi-desc');
        if (!board || !kintsugiCanvas) return;
        
        desc.textContent = "ghép các mảnh vỡ lại thành một chiếc bát hoàn chỉnh...";
        board.innerHTML = '';
        kintsugiCtx = kintsugiCanvas.getContext('2d');
        kintsugiCtx.clearRect(0, 0, 320, 320);
        kintsugiDone = false;
        goldLinesPainted = 0;
        isPaintingKintsugi = false;
        
        const pieceData = [
            { id: 1, char: '◜', style: 'top: 30px; left: 40px; border-radius: 100px 0 0 0;', target: { x: 80, y: 80 } },
            { id: 2, char: '◝', style: 'top: 40px; right: 50px; border-radius: 0 100px 0 0;', target: { x: 160, y: 80 } },
            { id: 3, char: '◟', style: 'bottom: 50px; left: 30px; border-radius: 0 0 0 100px;', target: { x: 80, y: 160 } },
            { id: 4, char: '◞', style: 'bottom: 30px; right: 40px; border-radius: 0 0 100px 0;', target: { x: 160, y: 160 } }
        ];
        
        pieceData.forEach(p => {
            const el = document.createElement('div');
            el.className = 'kintsugi-piece';
            el.style = `position: absolute; width: 80px; height: 80px; background: ${activeTheme === 'dark' ? '#334155' : '#cbd5e1'}; border: 2px dashed rgba(0,0,0,0.1); cursor: grab; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--text-muted); ${p.style}`;
            el.setAttribute('data-id', p.id);
            el.draggable = true;
            
            let isDragging = false;
            let startX, startY;
            
            const onStart = (clientX, clientY) => {
                isDragging = true;
                el.style.zIndex = 100;
                startX = clientX - el.offsetLeft;
                startY = clientY - el.offsetTop;
            };
            
            const onMove = (clientX, clientY) => {
                if (!isDragging) return;
                el.style.left = `${clientX - startX}px`;
                el.style.top = `${clientY - startY}px`;
            };
            
            const onEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                el.style.zIndex = 10;
                
                const dx = el.offsetLeft - p.target.x;
                const dy = el.offsetTop - p.target.y;
                if (Math.sqrt(dx*dx + dy*dy) < 20) {
                    el.style.left = `${p.target.x}px`;
                    el.style.top = `${p.target.y}px`;
                    el.style.border = 'none';
                    el.style.background = activeTheme === 'dark' ? '#475569' : '#94a3b8';
                    el.draggable = false;
                    checkKintsugiAssembled();
                }
            };
            
            el.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', onEnd);
            
            el.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
            window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
            window.addEventListener('touchend', onEnd);
            
            board.appendChild(el);
        });
    }
    function checkKintsugiAssembled() {
        const pieces = document.querySelectorAll('.kintsugi-piece');
        let snappedCount = 0;
        pieces.forEach(p => {
            if (p.draggable === false) snappedCount++;
        });
        
        if (snappedCount === 4) {
            document.getElementById('kintsugi-desc').textContent = "hãy vẽ cọ dọc theo vết nứt để gắn kết chúng bằng vàng...";
            kintsugiCanvas.style.pointerEvents = 'auto';
            kintsugiCanvas.onmousedown = () => isPaintingKintsugi = true;
            window.onmouseup = () => isPaintingKintsugi = false;
            kintsugiCanvas.onmousemove = paintKintsugiGold;
            
            kintsugiCanvas.ontouchstart = () => isPaintingKintsugi = true;
            window.ontouchend = () => isPaintingKintsugi = false;
            kintsugiCanvas.ontouchmove = (e) => paintKintsugiGold(e.touches[0]);
        }
    }
    function paintKintsugiGold(e) {
        if (!isPaintingKintsugi || kintsugiDone) return;
        const rect = kintsugiCanvas.getBoundingClientRect();
        const clientX = e.clientX || e.pageX;
        const clientY = e.clientY || e.pageY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        kintsugiCtx.beginPath();
        kintsugiCtx.arc(x, y, 4, 0, Math.PI*2);
        kintsugiCtx.fillStyle = '#fbbf24';
        kintsugiCtx.fill();
        
        goldLinesPainted++;
        if (goldLinesPainted > 150) {
            kintsugiDone = true;
            document.getElementById('kintsugi-desc').textContent = "tác phẩm hoàn hảo. vẻ đẹp của sự hàn gắn và bất toàn.";
            triggerChimeSound(160);
        }
    }
    document.getElementById('reset-kintsugi')?.addEventListener('click', startKintsugi);

    // --- GAME 6: CẮT TỈA BONSAI ---
    let bonsaiTree = {};
    let bonsaiLeavesPruned = 0;
    function startBonsai() {
        const canvas = document.getElementById('bonsai-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        bonsaiLeavesPruned = 0;
        
        bonsaiTree = generateBonsaiBranch(160, 280, -Math.PI / 2, 70, 7);
        
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            pruneBonsaiLeaf(bonsaiTree, x, y);
            renderBonsai(ctx, canvas.width, canvas.height);
            
            const scoreEl = document.getElementById('bonsai-rating');
            if (scoreEl) {
                let rating = Math.max(20, 100 - bonsaiLeavesPruned * 5);
                scoreEl.textContent = `tĩnh lặng: ${rating}%`;
            }
        };
        renderBonsai(ctx, canvas.width, canvas.height);
    }
    function generateBonsaiBranch(x, y, angle, length, depth) {
        let xEnd = x + Math.cos(angle) * length;
        let yEnd = y + Math.sin(angle) * length;
        
        let branch = {
            xStart: x, yStart: y,
            xEnd: xEnd, yEnd: yEnd,
            thickness: depth * 1.5,
            length: length,
            depth: depth,
            isLeaf: depth <= 2,
            pruned: false,
            branches: []
        };
        
        if (depth > 1) {
            const numBranches = Math.random() < 0.2 ? 1 : 2;
            for (let i = 0; i < numBranches; i++) {
                const angleOffset = (Math.random() - 0.5) * 0.6;
                const nextLength = length * (0.7 + Math.random() * 0.15);
                branch.branches.push(generateBonsaiBranch(xEnd, yEnd, angle + angleOffset, nextLength, depth - 1));
            }
        }
        return branch;
    }
    function pruneBonsaiLeaf(branch, mx, my) {
        if (branch.pruned) return;
        
        if (branch.isLeaf) {
            const dx = branch.xEnd - mx;
            const dy = branch.yEnd - my;
            if (Math.sqrt(dx*dx + dy*dy) < 15) {
                branch.pruned = true;
                bonsaiLeavesPruned++;
                triggerChimeSound(mx);
                return;
            }
        }
        branch.branches.forEach(b => pruneBonsaiLeaf(b, mx, my));
    }
    function renderBonsai(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(100, 280, 120, 15);
        ctx.fillRect(110, 295, 100, 10);
        drawBonsaiBranch(ctx, bonsaiTree);
    }
    function drawBonsaiBranch(ctx, b) {
        if (b.pruned) return;
        ctx.strokeStyle = activeTheme === 'dark' ? '#b45309' : '#78350f';
        ctx.lineWidth = b.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(b.xStart, b.yStart);
        ctx.lineTo(b.xEnd, b.yEnd);
        ctx.stroke();
        
        if (b.isLeaf) {
            ctx.fillStyle = activeTheme === 'dark' ? '#065f46' : '#10b981';
            ctx.beginPath();
            ctx.arc(b.xEnd, b.yEnd, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        b.branches.forEach(sub => drawBonsaiBranch(ctx, sub));
    }
    document.getElementById('reset-bonsai')?.addEventListener('click', startBonsai);

    // --- GAME 7: GẤP GIẤY ORIGAMI ---
    let origamiStepIndex = 0;
    const origamiSteps = [
        { desc: "bước 1: vuốt từ góc trên bên trái xuống góc dưới bên phải", pts: [{x: 40, y: 40}, {x: 280, y: 280}] },
        { desc: "bước 2: gấp góc dưới bên trái vào đường chéo giữa", pts: [{x: 40, y: 280}, {x: 160, y: 160}] },
        { desc: "bước 3: gấp góc trên bên phải đối xứng vào giữa", pts: [{x: 280, y: 40}, {x: 160, y: 160}] },
        { desc: "bước 4: gấp đỉnh nhọn phía dưới lên trên để tạo chiếc thuyền", pts: [{x: 160, y: 280}, {x: 160, y: 100}] }
    ];
    function startOrigami() {
        origamiStepIndex = 0;
        renderOrigamiStep();
    }
    function renderOrigamiStep() {
        const canvas = document.getElementById('origami-canvas');
        const desc = document.getElementById('origami-desc');
        const stepLbl = document.getElementById('origami-step');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const step = origamiSteps[origamiStepIndex];
        if (desc) desc.textContent = step.desc;
        if (stepLbl) stepLbl.textContent = `bước ${origamiStepIndex + 1}/4`;
        
        ctx.fillStyle = activeTheme === 'dark' ? 'rgba(212, 184, 134, 0.15)' : 'rgba(212, 184, 134, 0.4)';
        ctx.strokeStyle = 'var(--text-primary)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        if (origamiStepIndex === 0) {
            ctx.rect(40, 40, 240, 240);
        } else if (origamiStepIndex === 1) {
            ctx.moveTo(40, 40); ctx.lineTo(280, 40); ctx.lineTo(280, 280); ctx.closePath();
        } else if (origamiStepIndex === 2) {
            ctx.moveTo(160, 160); ctx.lineTo(280, 40); ctx.lineTo(280, 280); ctx.closePath();
        } else if (origamiStepIndex >= 3) {
            ctx.moveTo(160, 160); ctx.lineTo(280, 40); ctx.lineTo(280, 200); ctx.lineTo(160, 280); ctx.lineTo(40, 200); ctx.lineTo(40, 40); ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(step.pts[0].x, step.pts[0].y);
        ctx.lineTo(step.pts[1].x, step.pts[1].y);
        ctx.strokeStyle = '#ef4444';
        ctx.stroke();
        ctx.setLineDash([]);
        
        let isDragging = false;
        canvas.onmousedown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (Math.sqrt((x-step.pts[0].x)**2 + (y-step.pts[0].y)**2) < 25) {
                isDragging = true;
            }
        };
        canvas.onmousemove = (e) => {
            if (!isDragging) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (Math.sqrt((x-step.pts[1].x)**2 + (y-step.pts[1].y)**2) < 25) {
                isDragging = false;
                triggerChimeSound(x);
                if (origamiStepIndex < origamiSteps.length - 1) {
                    origamiStepIndex++;
                    renderOrigamiStep();
                } else {
                    if (desc) desc.textContent = "hoàn thành! bạn đã gấp được chiếc thuyền Origami bình yên.";
                    if (stepLbl) stepLbl.textContent = "hoàn thành";
                }
            }
        };
        canvas.onmouseup = () => isDragging = false;
        
        canvas.ontouchstart = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            if (Math.sqrt((x-step.pts[0].x)**2 + (y-step.pts[0].y)**2) < 25) isDragging = true;
        };
        canvas.ontouchmove = (e) => {
            if (!isDragging) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            if (Math.sqrt((x-step.pts[1].x)**2 + (y-step.pts[1].y)**2) < 25) {
                isDragging = false;
                triggerChimeSound(x);
                if (origamiStepIndex < origamiSteps.length - 1) {
                    origamiStepIndex++;
                    renderOrigamiStep();
                } else {
                    if (desc) desc.textContent = "hoàn thành! bạn đã gấp được chiếc thuyền Origami bình yên.";
                    if (stepLbl) stepLbl.textContent = "hoàn thành";
                }
            }
        };
        canvas.ontouchend = () => isDragging = false;
    }
    document.getElementById('origami-next')?.addEventListener('click', () => {
        if (origamiStepIndex < origamiSteps.length - 1) {
            origamiStepIndex++;
            renderOrigamiStep();
        }
    });
    document.getElementById('reset-origami')?.addEventListener('click', startOrigami);

    // --- GAME 8: LUYỆN THƯ PHÁP ---
    let calligraphyCanvas, calligraphyCtx;
    let isDrawingCalligraphy = false;
    let selectedCalligraphyWord = 'thien';
    const calligraphyPaths = {
        thien: [
            [{x: 100, y: 80}, {x: 100, y: 150}],
            [{x: 70, y: 110}, {x: 130, y: 110}],
            [{x: 160, y: 70}, {x: 260, y: 70}],
            [{x: 210, y: 70}, {x: 210, y: 260}],
            [{x: 160, y: 150}, {x: 260, y: 150}],
            [{x: 160, y: 220}, {x: 260, y: 220}]
        ],
        tinh: [
            [{x: 80, y: 80}, {x: 140, y: 80}],
            [{x: 110, y: 80}, {x: 110, y: 260}],
            [{x: 80, y: 160}, {x: 140, y: 160}],
            [{x: 180, y: 90}, {x: 250, y: 90}],
            [{x: 210, y: 90}, {x: 170, y: 250}],
            [{x: 210, y: 150}, {x: 260, y: 250}]
        ],
        an: [
            [{x: 120, y: 80}, {x: 200, y: 80}],
            [{x: 160, y: 80}, {x: 160, y: 130}],
            [{x: 100, y: 130}, {x: 220, y: 130}],
            [{x: 160, y: 130}, {x: 110, y: 240}],
            [{x: 130, y: 180}, {x: 230, y: 180}],
            [{x: 190, y: 150}, {x: 230, y: 240}]
        ]
    };
    function startCalligraphy() {
        calligraphyCanvas = document.getElementById('calligraphy-canvas');
        if (!calligraphyCanvas) return;
        calligraphyCtx = calligraphyCanvas.getContext('2d');
        clearCalligraphyCanvas();
        
        calligraphyCanvas.onmousedown = (e) => { isDrawingCalligraphy = true; drawCalligraphyStroke(e); };
        window.onmouseup = () => isDrawingCalligraphy = false;
        calligraphyCanvas.onmousemove = drawCalligraphyStroke;
        
        calligraphyCanvas.ontouchstart = (e) => { isDrawingCalligraphy = true; drawCalligraphyStroke(e.touches[0]); };
        window.ontouchend = () => isDrawingCalligraphy = false;
        calligraphyCanvas.ontouchmove = (e) => { if(isDrawingCalligraphy) drawCalligraphyStroke(e.touches[0]); };
    }
    function clearCalligraphyCanvas() {
        if (!calligraphyCanvas) return;
        calligraphyCtx.clearRect(0, 0, calligraphyCanvas.width, calligraphyCanvas.height);
        
        calligraphyCtx.strokeStyle = 'rgba(212, 184, 134, 0.3)';
        calligraphyCtx.lineWidth = 1;
        calligraphyCtx.setLineDash([5, 5]);
        
        calligraphyCtx.beginPath();
        calligraphyCtx.moveTo(0, 160); calligraphyCtx.lineTo(320, 160);
        calligraphyCtx.moveTo(160, 0); calligraphyCtx.lineTo(160, 320);
        calligraphyCtx.stroke();
        calligraphyCtx.setLineDash([]);
        
        calligraphyCtx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
        calligraphyCtx.lineWidth = 12;
        calligraphyCtx.lineCap = 'round';
        calligraphyCtx.lineJoin = 'round';
        
        const lines = calligraphyPaths[selectedCalligraphyWord];
        lines.forEach(stroke => {
            calligraphyCtx.beginPath();
            calligraphyCtx.moveTo(stroke[0].x, stroke[0].y);
            calligraphyCtx.lineTo(stroke[1].x, stroke[1].y);
            calligraphyCtx.stroke();
        });
    }
    function drawCalligraphyStroke(e) {
        if (!isDrawingCalligraphy || !calligraphyCanvas) return;
        const rect = calligraphyCanvas.getBoundingClientRect();
        const clientX = e.clientX || e.pageX;
        const clientY = e.clientY || e.pageY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        calligraphyCtx.strokeStyle = '#1e293b';
        calligraphyCtx.lineWidth = 6 + Math.random() * 4;
        calligraphyCtx.lineCap = 'round';
        calligraphyCtx.lineJoin = 'round';
        
        calligraphyCtx.beginPath();
        calligraphyCtx.arc(x, y, calligraphyCtx.lineWidth / 2, 0, Math.PI * 2);
        calligraphyCtx.fillStyle = '#1e293b';
        calligraphyCtx.fill();
    }
    document.querySelectorAll('.calligraphy-word-select').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.calligraphy-word-select').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCalligraphyWord = btn.getAttribute('data-word');
            clearCalligraphyCanvas();
        };
    });
    document.getElementById('clear-calligraphy')?.addEventListener('click', clearCalligraphyCanvas);

    // --- GAME 9: CẮM HOA IKEBANA ---
    function startIkebana() {
        const workspace = document.getElementById('ikebana-workspace');
        const tray = document.getElementById('ikebana-tray');
        if (!workspace || !tray) return;
        
        workspace.innerHTML = '';
        tray.innerHTML = '';
        
        const flowers = ['🌸', '🌿', '🍃', '🌹', '🌾', '🎋'];
        flowers.forEach(symbol => {
            const item = document.createElement('div');
            item.className = 'ikebana-item';
            item.textContent = symbol;
            item.onclick = () => addIkebanaFlowerToWorkspace(symbol);
            tray.appendChild(item);
        });
    }
    function addIkebanaFlowerToWorkspace(symbol) {
        const workspace = document.getElementById('ikebana-workspace');
        if(!workspace) return;
        
        const el = document.createElement('div');
        el.className = 'ikebana-placed';
        el.textContent = symbol;
        el.style.left = '140px';
        el.style.top = '120px';
        el.style.fontSize = '2.5rem';
        el.style.transform = 'rotate(0deg)';
        
        let rotationAngle = 0;
        let isDragging = false;
        let startX, startY;
        
        const onStart = (clientX, clientY) => {
            isDragging = true;
            startX = clientX - el.offsetLeft;
            startY = clientY - el.offsetTop;
            document.querySelectorAll('.ikebana-placed').forEach(x => x.style.outline = 'none');
            el.style.outline = '1px dashed var(--accent)';
        };
        const onMove = (clientX, clientY) => {
            if (!isDragging) return;
            el.style.left = `${clientX - startX}px`;
            el.style.top = `${clientY - startY}px`;
        };
        const onEnd = () => { isDragging = false; };
        
        el.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onEnd);
        
        el.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
        window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
        window.addEventListener('touchend', onEnd);
        
        window.addEventListener('keydown', (e) => {
            if(el.style.outline === 'none' || el.style.outline === '') return;
            if(e.key === 'ArrowLeft') {
                rotationAngle -= 15;
                el.style.transform = `rotate(${rotationAngle}deg)`;
            } else if (e.key === 'ArrowRight') {
                rotationAngle += 15;
                el.style.transform = `rotate(${rotationAngle}deg)`;
            }
        });
        workspace.appendChild(el);
        triggerChimeSound(160);
    }
    document.getElementById('clear-ikebana')?.addEventListener('click', startIkebana);

    // --- GAME 10: XẾP KÍNH MÀU ---
    function startStainedGlass() {
        const board = document.getElementById('stainedglass-board');
        const tray = document.getElementById('stainedglass-tray');
        if (!board || !tray) return;
        
        board.innerHTML = '';
        tray.innerHTML = '';
        
        const targets = [
            { id: 1, color: 'rgba(239, 68, 68, 0.4)', colorFull: '#ef4444', left: 40, top: 40, w: 100, h: 100, symbol: '❤️' },
            { id: 2, color: 'rgba(59, 130, 246, 0.4)', colorFull: '#3b82f6', left: 180, top: 40, w: 100, h: 100, symbol: '💎' },
            { id: 3, color: 'rgba(245, 158, 11, 0.4)', colorFull: '#f59e0b', left: 40, top: 180, w: 100, h: 100, symbol: '☀️' },
            { id: 4, color: 'rgba(16, 185, 129, 0.4)', colorFull: '#10b989', left: 180, top: 180, w: 100, h: 100, symbol: '🍀' },
            { id: 5, color: 'rgba(139, 92, 246, 0.4)', colorFull: '#8b5cf6', left: 110, top: 110, w: 100, h: 100, symbol: '🔮' }
        ];
        
        targets.forEach(t => {
            const slot = document.createElement('div');
            slot.className = 'stainedglass-slot';
            slot.style = `position: absolute; left: ${t.left}px; top: ${t.top}px; width: ${t.w}px; height: ${t.h}px; background: ${t.color}; border: 1px dashed var(--border-color); border-radius: 50%; opacity: 0.3;`;
            board.appendChild(slot);
        });
        
        targets.forEach(t => {
            const piece = document.createElement('div');
            piece.className = 'stainedglass-item';
            piece.textContent = t.symbol;
            piece.style = `font-size: 2.2rem; cursor: grab; background: ${t.color}; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);`;
            piece.onclick = () => {
                addStainedGlassToBoard(t, board);
                piece.style.display = 'none';
            };
            tray.appendChild(piece);
        });
    }
    function addStainedGlassToBoard(t, board) {
        const el = document.createElement('div');
        el.className = 'stainedglass-placed';
        el.textContent = t.symbol;
        el.style.left = '120px';
        el.style.top = '120px';
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.fontSize = '2.5rem';
        el.style.background = t.color;
        el.style.borderRadius = '50%';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        
        let isDragging = false;
        let startX, startY;
        
        const onStart = (clientX, clientY) => {
            isDragging = true;
            startX = clientX - el.offsetLeft;
            startY = clientY - el.offsetTop;
        };
        const onMove = (clientX, clientY) => {
            if (!isDragging) return;
            el.style.left = `${clientX - startX}px`;
            el.style.top = `${clientY - startY}px`;
        };
        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            
            const dx = el.offsetLeft - t.left;
            const dy = el.offsetTop - t.top;
            if (Math.sqrt(dx*dx + dy*dy) < 25) {
                el.style.left = `${t.left}px`;
                el.style.top = `${t.top}px`;
                el.style.background = t.colorFull;
                el.style.boxShadow = '0 0 15px ' + t.colorFull;
                el.style.cursor = 'default';
                el.onmousedown = null;
                el.ontouchstart = null;
                triggerChimeSound(t.left);
            }
        };
        
        el.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onEnd);
        
        el.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
        window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
        window.addEventListener('touchend', onEnd);
        
        board.appendChild(el);
    }
    document.getElementById('reset-stainedglass')?.addEventListener('click', startStainedGlass);

    // --- GAME 11: XẾP ĐÁ THĂNG BẰNG ---
    let pebblesList = [];
    let pebblesActiveRock = null;
    let pebblesCanvas, pebblesCtx;
    function startPebbles() {
        if (pebblesAnim) cancelAnimationFrame(pebblesAnim);
        pebblesCanvas = document.getElementById('pebbles-canvas');
        if (!pebblesCanvas) return;
        pebblesCtx = pebblesCanvas.getContext('2d');
        
        pebblesList = [
            { id: 'base', x: 160, y: 310, w: 120, h: 30, rx: 25, color: '#475569', isFixed: true },
            { id: 1, x: 50, y: 60, w: 70, h: 25, rx: 12, color: '#64748b', isFixed: false },
            { id: 2, x: 130, y: 60, w: 85, h: 28, rx: 14, color: '#94a3b8', isFixed: false },
            { id: 3, x: 230, y: 60, w: 60, h: 22, rx: 10, color: '#cbd5e1', isFixed: false },
            { id: 4, x: 90, y: 110, w: 95, h: 32, rx: 16, color: '#78716c', isFixed: false },
            { id: 5, x: 210, y: 110, w: 75, h: 26, rx: 13, color: '#a8a29e', isFixed: false }
        ];
        pebblesActiveRock = null;
        setupPebbleInteraction();
        loopPebbles();
        updatePebbleStatus();
    }
    function setupPebbleInteraction() {
        const getRockAt = (x, y) => {
            for(let i = pebblesList.length - 1; i >= 0; i--) {
                const r = pebblesList[i];
                if (r.isFixed) continue;
                if (x > r.x - r.w/2 && x < r.x + r.w/2 && y > r.y - r.h/2 && y < r.y + r.h/2) {
                    return r;
                }
            }
            return null;
        };
        const onStart = (x, y) => {
            pebblesActiveRock = getRockAt(x, y);
        };
        const onMove = (x, y) => {
            if (!pebblesActiveRock) return;
            pebblesActiveRock.x = x;
            pebblesActiveRock.y = y;
        };
        const onEnd = () => {
            if (!pebblesActiveRock) return;
            pebblesActiveRock = null;
            checkPebblesGravity();
        };
        
        pebblesCanvas.onmousedown = (e) => {
            const rect = pebblesCanvas.getBoundingClientRect();
            onStart(e.clientX - rect.left, e.clientY - rect.top);
        };
        pebblesCanvas.onmousemove = (e) => {
            const rect = pebblesCanvas.getBoundingClientRect();
            onMove(e.clientX - rect.left, e.clientY - rect.top);
        };
        window.onmouseup = onEnd;
        
        pebblesCanvas.ontouchstart = (e) => {
            const rect = pebblesCanvas.getBoundingClientRect();
            onStart(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        };
        pebblesCanvas.ontouchmove = (e) => {
            const rect = pebblesCanvas.getBoundingClientRect();
            onMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        };
        window.ontouchend = onEnd;
    }
    function checkPebblesGravity() {
        let stack = [pebblesList[0]];
        let remaining = pebblesList.filter(r => !r.isFixed);
        remaining.sort((a,b) => b.y - a.y);
        let collapsed = false;
        
        for (let i = 0; i < remaining.length; i++) {
            let stone = remaining[i];
            let baseUnder = null;
            for (let j = stack.length - 1; j >= 0; j--) {
                let st = stack[j];
                if (Math.abs(stone.x - st.x) < (stone.w + st.w) / 2 - 10) {
                    baseUnder = st;
                    break;
                }
            }
            if (baseUnder) {
                let targetY = baseUnder.y - (baseUnder.h + stone.h) / 2;
                if (stone.y < targetY) {
                    stone.y = targetY;
                }
                stack.push(stone);
                
                let indexUnder = stack.indexOf(baseUnder);
                let massSum = 0;
                let weightedXSum = 0;
                for (let k = indexUnder + 1; k < stack.length; k++) {
                    let stAbove = stack[k];
                    massSum += stAbove.w;
                    weightedXSum += stAbove.x * stAbove.w;
                }
                if (massSum > 0) {
                    let cogX = weightedXSum / massSum;
                    let offset = cogX - baseUnder.x;
                    if (Math.abs(offset) > baseUnder.w / 3.5) {
                        collapsed = true;
                        break;
                    }
                }
            }
        }
        if (collapsed) {
            remaining.forEach(st => {
                st.y = 250 + Math.random() * 30;
                st.x = 60 + Math.random() * 200;
            });
            triggerChimeSound(100);
            updatePebbleStatus();
        } else {
            updatePebbleStatus();
        }
    }
    function updatePebbleStatus() {
        const count = pebblesList.filter(r => !r.isFixed && r.y < 240).length;
        const statusEl = document.getElementById('pebbles-status');
        if (statusEl) {
            statusEl.textContent = `chiều cao tháp: ${count} viên đá`;
        }
    }
    function loopPebbles() {
        if (!pebblesCanvas) return;
        pebblesCtx.clearRect(0, 0, pebblesCanvas.width, pebblesCanvas.height);
        pebblesCtx.fillStyle = activeTheme === 'dark' ? '#1e293b' : '#e2e8f0';
        pebblesCtx.fillRect(0, 310, pebblesCanvas.width, 30);
        
        pebblesList.forEach(r => {
            pebblesCtx.save();
            pebblesCtx.fillStyle = r.color;
            pebblesCtx.beginPath();
            pebblesCtx.roundRect(r.x - r.w/2, r.y - r.h/2, r.w, r.h, r.rx);
            pebblesCtx.fill();
            
            pebblesCtx.beginPath();
            pebblesCtx.roundRect(r.x - r.w/2 + 2, r.y - r.h/2 + 2, r.w - 4, r.h - 4, r.rx - 2);
            pebblesCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            pebblesCtx.fill();
            pebblesCtx.restore();
        });
        pebblesAnim = requestAnimationFrame(loopPebbles);
    }
    document.getElementById('reset-pebbles')?.addEventListener('click', startPebbles);

    // --- GAME 12: DỆT SAO ĐÊM ---
    let constellationIndex = 0;
    const constellations = [
        {
            name: "chòm sao diều giấy",
            stars: [{x: 160, y: 60}, {x: 240, y: 140}, {x: 160, y: 260}, {x: 80, y: 140}, {x: 160, y: 140}],
            lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [2, 4]]
        },
        {
            name: "chòm sao chim bồ câu",
            stars: [{x: 80, y: 80}, {x: 160, y: 120}, {x: 260, y: 80}, {x: 200, y: 180}, {x: 120, y: 220}],
            lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]]
        }
    ];
    let constellationConnected = [];
    function startConstellation() {
        constellationConnected = [];
        const btnNext = document.getElementById('next-constellation');
        if (btnNext) btnNext.style.display = 'none';
        const nameLbl = document.getElementById('constellation-name');
        if (nameLbl) nameLbl.textContent = `chòm sao: ?`;
        renderConstellation();
    }
    function renderConstellation() {
        const canvas = document.getElementById('constellation-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const data = constellations[constellationIndex];
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 40; i++) {
            ctx.fillRect((Math.random() * 320), (Math.random() * 320), 1.5, 1.5);
        }
        
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < constellationConnected.length - 1; i++) {
            const s1 = data.stars[constellationConnected[i]];
            const s2 = data.stars[constellationConnected[i+1]];
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
        }
        ctx.stroke();
        
        data.stars.forEach((s, idx) => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = constellationConnected.includes(idx) ? '#60a5fa' : '#f8fafc';
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '10px monospace';
            ctx.fillText(idx + 1, s.x + 8, s.y - 4);
        });
        
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            data.stars.forEach((s, idx) => {
                const dist = Math.sqrt((x-s.x)**2 + (y-s.y)**2);
                if (dist < 15) {
                    const expectedNext = constellationConnected.length;
                    if (idx === expectedNext) {
                        constellationConnected.push(idx);
                        triggerChimeSound(s.x);
                        renderConstellation();
                        
                        if (constellationConnected.length === data.stars.length) {
                            document.getElementById('constellation-name').textContent = `chòm sao: ${data.name}`;
                            document.getElementById('next-constellation').style.display = 'inline-block';
                        }
                    }
                }
            });
        };
    }
    document.getElementById('next-constellation')?.addEventListener('click', () => {
        constellationIndex = (constellationIndex + 1) % constellations.length;
        startConstellation();
    });
    document.getElementById('reset-constellation')?.addEventListener('click', startConstellation);

    // --- GAME 13: NGHỆ THUẬT TRÀ ĐẠO ---
    let teaTemp = 25;
    let teaSteepTime = 0.0;
    let teaHeatInterval = null;
    let teaSteepInterval = null;
    let teaStep = 1;
    function startTea() {
        if (teaHeatInterval) clearInterval(teaHeatInterval);
        if (teaSteepInterval) clearInterval(teaSteepInterval);
        
        teaTemp = 25;
        teaSteepTime = 0.0;
        teaStep = 1;
        
        document.getElementById('tea-heating-view').style.display = 'flex';
        document.getElementById('tea-steeping-view').style.display = 'none';
        document.getElementById('tea-result-view').style.display = 'none';
        document.getElementById('tea-desc').textContent = "bước 1: đun nước đến nhiệt độ tối ưu (85°C)...";
        document.getElementById('tea-temp-gauge').textContent = "25°C";
        document.getElementById('tea-temp-progress').style.width = '25%';
    }
    document.getElementById('tea-heat-btn')?.addEventListener('click', () => {
        if (teaStep !== 1) return;
        const btn = document.getElementById('tea-heat-btn');
        btn.disabled = true;
        
        teaHeatInterval = setInterval(() => {
            teaTemp += 3;
            if (teaTemp > 105) teaTemp = 105;
            
            document.getElementById('tea-temp-gauge').textContent = `${teaTemp}°C`;
            document.getElementById('tea-temp-progress').style.width = `${Math.min(100, teaTemp)}%`;
            
            if (teaTemp >= 85) {
                clearInterval(teaHeatInterval);
                btn.disabled = false;
                teaStep = 2;
                document.getElementById('tea-heating-view').style.display = 'none';
                document.getElementById('tea-steeping-view').style.display = 'flex';
                document.getElementById('tea-desc').textContent = "bước 2: nhấn giữ nút để ủ trà trong 5.0 giây...";
                triggerChimeSound(160);
            }
        }, 150);
    });
    const steepBtn = document.getElementById('tea-steep-btn');
    if (steepBtn) {
        const startSteeping = () => {
            if (teaStep !== 2) return;
            if (teaSteepInterval) clearInterval(teaSteepInterval);
            
            teaSteepInterval = setInterval(() => {
                teaSteepTime += 0.1;
                document.getElementById('tea-timer').textContent = `${teaSteepTime.toFixed(1)}s / 5.0s`;
                
                const indicator = document.getElementById('tea-color-indicator');
                if (indicator) {
                    const tint = Math.min(0.9, teaSteepTime * 0.15);
                    indicator.style.backgroundColor = `rgba(212, 184, 134, ${tint})`;
                }
            }, 100);
        };
        const stopSteeping = () => {
            if (teaStep !== 2) return;
            if (teaSteepInterval) clearInterval(teaSteepInterval);
            
            teaStep = 3;
            document.getElementById('tea-steeping-view').style.display = 'none';
            document.getElementById('tea-result-view').style.display = 'flex';
            
            const diff = Math.abs(teaSteepTime - 5.0);
            let evaluation = "";
            if (diff < 0.3) {
                evaluation = "trà ủ hoàn hảo! hương vị thanh khiết, ngọt ngào.";
            } else if (teaSteepTime < 4.0) {
                evaluation = "trà hơi nhạt, cần ủ lâu hơn một chút.";
            } else {
                evaluation = "trà bị nồng, vị hơi chát vì ủ quá thời gian.";
            }
            
            document.getElementById('tea-desc').textContent = "thành quả:";
            document.getElementById('tea-evaluation').textContent = evaluation;
            triggerChimeSound(200);
        };
        
        steepBtn.onmousedown = startSteeping;
        steepBtn.onmouseup = stopSteeping;
        steepBtn.ontouchstart = (e) => { e.preventDefault(); startSteeping(); };
        steepBtn.ontouchend = (e) => { e.preventDefault(); stopSteeping(); };
    }
    document.getElementById('reset-tea')?.addEventListener('click', startTea);

    // --- GAME 14: THẢ ĐÈN TRỜI ---
    let lanterns = [];
    let lanternCanvas, lanternCtx;
    function startLantern() {
        if (lanternAnim) cancelAnimationFrame(lanternAnim);
        lanternCanvas = document.getElementById('lantern-canvas');
        if (!lanternCanvas) return;
        lanternCtx = lanternCanvas.getContext('2d');
        lanterns = [];
        loopLanterns();
    }
    function loopLanterns() {
        if (!lanternCanvas) return;
        lanternCtx.clearRect(0, 0, lanternCanvas.width, lanternCanvas.height);
        
        lanternCtx.fillStyle = '#0f172a';
        lanternCtx.fillRect(0, 0, lanternCanvas.width, lanternCanvas.height);
        
        lanternCtx.fillStyle = 'rgba(251, 191, 36, 0.08)';
        for (let i = 0; i < 15; i++) {
            lanternCtx.beginPath();
            lanternCtx.arc(50 + i * 20, 40 + Math.sin(i) * 15, 3, 0, Math.PI * 2);
            lanternCtx.fill();
        }
        
        for (let i = lanterns.length - 1; i >= 0; i--) {
            let l = lanterns[i];
            l.y -= l.speed;
            l.x += Math.sin(l.y * 0.02) * 0.5;
            l.size -= 0.015;
            l.alpha -= 0.002;
            
            if (l.y < -50 || l.size <= 2 || l.alpha <= 0) {
                lanterns.splice(i, 1);
                continue;
            }
            
            lanternCtx.beginPath();
            lanternCtx.arc(l.x, l.y, l.size * 2, 0, Math.PI * 2);
            lanternCtx.fillStyle = `rgba(251, 191, 36, ${l.alpha * 0.25})`;
            lanternCtx.fill();
            
            lanternCtx.beginPath();
            lanternCtx.roundRect(l.x - l.size, l.y - l.size * 1.5, l.size * 2, l.size * 2.5, l.size * 0.3);
            lanternCtx.fillStyle = `rgba(254, 243, 199, ${l.alpha})`;
            lanternCtx.fill();
            
            lanternCtx.beginPath();
            lanternCtx.arc(l.x, l.y + l.size * 0.8, l.size * 0.4, 0, Math.PI * 2);
            lanternCtx.fillStyle = '#f59e0b';
            lanternCtx.fill();
            
            if (l.text) {
                lanternCtx.fillStyle = `rgba(255, 255, 255, ${l.alpha * 0.8})`;
                lanternCtx.font = `${Math.max(9, l.size * 0.8)}px Garamond, Lora, serif`;
                lanternCtx.textAlign = 'center';
                lanternCtx.fillText(l.text, l.x, l.y - l.size * 2);
            }
        }
        lanternAnim = requestAnimationFrame(loopLanterns);
    }
    document.getElementById('lantern-send')?.addEventListener('click', () => {
        const input = document.getElementById('lantern-input');
        if (!input || !input.value.trim()) return;
        
        lanterns.push({
            x: 80 + Math.random() * 160,
            y: 320,
            size: 14 + Math.random() * 4,
            speed: 0.8 + Math.random() * 0.5,
            alpha: 1.0,
            text: input.value.trim()
        });
        input.value = '';
        triggerChimeSound(160);
    });
    document.getElementById('clear-lanterns')?.addEventListener('click', () => {
        lanterns = [];
    });

    // --- GAME 15: MÚA BÓNG NGHỆ THUẬT ---
    let shadowTargetIndex = 0;
    const shadowTargets = [
        { name: "thỏ con", thumb: 30, index: -20, other: 10, hint: "khớp ngón cái: 30, ngón trỏ: -20, ngón khác: 10" },
        { name: "chim bay", thumb: 0, index: 20, other: -30, hint: "khớp ngón cái: 0, ngón trỏ: 20, ngón khác: -30" },
        { name: "chó con", thumb: -30, index: 0, other: 20, hint: "khớp ngón cái: -30, ngón trỏ: 0, ngón khác: 20" }
    ];
    function startShadow() {
        shadowTargetIndex = 0;
        const btnNext = document.getElementById('next-shadow-target');
        if (btnNext) btnNext.style.display = 'none';
        updateShadowTargetText();
        setupShadowSliders();
        renderShadowPuppet();
    }
    function updateShadowTargetText() {
        const t = shadowTargets[shadowTargetIndex];
        const statusEl = document.getElementById('shadow-match-status');
        if (statusEl) statusEl.textContent = `mục tiêu: tạo bóng ${t.name} (${t.hint})`;
    }
    function setupShadowSliders() {
        const renderCaller = () => {
            renderShadowPuppet();
            checkShadowMatch();
        };
        const s1 = document.getElementById('shadow-thumb');
        const s2 = document.getElementById('shadow-index');
        const s3 = document.getElementById('shadow-other');
        if(s1) s1.oninput = renderCaller;
        if(s2) s2.oninput = renderCaller;
        if(s3) s3.oninput = renderCaller;
    }
    function renderShadowPuppet() {
        const canvas = document.getElementById('shadow-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const thumbVal = parseInt(document.getElementById('shadow-thumb')?.value || '0');
        const indexVal = parseInt(document.getElementById('shadow-index')?.value || '0');
        const otherVal = parseInt(document.getElementById('shadow-other')?.value || '0');
        
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(160, 130, 120, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.save();
        ctx.translate(160, 130);
        
        ctx.beginPath();
        ctx.arc(0, 40, 25, 0, Math.PI*2);
        ctx.fill();
        
        ctx.save();
        ctx.translate(-15, 20);
        ctx.rotate((thumbVal * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, -20, 8, 20, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(-5, 15);
        ctx.rotate((indexVal * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, -35, 7, 28, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(15, 20);
        ctx.rotate((otherVal * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, -30, 10, 25, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        
        ctx.restore();
    }
    function checkShadowMatch() {
        const t = shadowTargets[shadowTargetIndex];
        const thumbVal = parseInt(document.getElementById('shadow-thumb')?.value || '0');
        const indexVal = parseInt(document.getElementById('shadow-index')?.value || '0');
        const otherVal = parseInt(document.getElementById('shadow-other')?.value || '0');
        
        if (Math.abs(thumbVal - t.thumb) <= 5 && 
            Math.abs(indexVal - t.index) <= 5 && 
            Math.abs(otherVal - t.other) <= 5) {
            
            document.getElementById('shadow-match-status').textContent = `chúc mừng! bóng ${t.name} rất giống.`;
            document.getElementById('next-shadow-target').style.display = 'inline-block';
            triggerChimeSound(160);
        }
    }
    document.getElementById('next-shadow-target')?.addEventListener('click', () => {
        shadowTargetIndex = (shadowTargetIndex + 1) % shadowTargets.length;
        updateShadowTargetText();
        document.getElementById('next-shadow-target').style.display = 'none';
        renderShadowPuppet();
    });

    // --- GAME 16: TRÒ CHƠI TRÍ UẨN ---
    let tangramPieces = [];
    let tangramSelectedIdx = -1;
    let tangramCanvas, tangramCtx;
    function startTangram() {
        tangramCanvas = document.getElementById('tangram-canvas');
        if (!tangramCanvas) return;
        tangramCtx = tangramCanvas.getContext('2d');
        tangramSelectedIdx = -1;
        
        tangramPieces = [
            { id: 1, type: 'triangle', color: 'rgba(239, 68, 68, 0.75)', x: 60, y: 70, size: 50, angle: 0 },
            { id: 2, type: 'triangle', color: 'rgba(59, 130, 246, 0.75)', x: 130, y: 70, size: 70, angle: 90 },
            { id: 3, type: 'square', color: 'rgba(245, 158, 11, 0.75)', x: 230, y: 70, size: 30, angle: 0 },
            { id: 4, type: 'parallelogram', color: 'rgba(16, 185, 129, 0.75)', x: 70, y: 150, w: 40, h: 30, angle: 45 },
            { id: 5, type: 'triangle', color: 'rgba(139, 92, 246, 0.75)', x: 180, y: 150, size: 40, angle: 180 }
        ];
        
        setupTangramInteraction();
        renderTangram();
    }
    function setupTangramInteraction() {
        const getPieceAt = (x, y) => {
            for (let i = tangramPieces.length - 1; i >= 0; i--) {
                const p = tangramPieces[i];
                if (Math.sqrt((x-p.x)**2 + (y-p.y)**2) < 40) return i;
            }
            return -1;
        };
        let isDragging = false;
        
        tangramCanvas.onmousedown = (e) => {
            const rect = tangramCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const idx = getPieceAt(x, y);
            if (idx !== -1) {
                tangramSelectedIdx = idx;
                isDragging = true;
                renderTangram();
            }
        };
        tangramCanvas.onmousemove = (e) => {
            if (!isDragging || tangramSelectedIdx === -1) return;
            const rect = tangramCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            tangramPieces[tangramSelectedIdx].x = x;
            tangramPieces[tangramSelectedIdx].y = y;
            renderTangram();
        };
        window.onmouseup = () => { isDragging = false; };
        
        tangramCanvas.ontouchstart = (e) => {
            const rect = tangramCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            const idx = getPieceAt(x, y);
            if (idx !== -1) {
                tangramSelectedIdx = idx;
                isDragging = true;
                renderTangram();
            }
        };
        tangramCanvas.ontouchmove = (e) => {
            if (!isDragging || tangramSelectedIdx === -1) return;
            const rect = tangramCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            tangramPieces[tangramSelectedIdx].x = x;
            tangramPieces[tangramSelectedIdx].y = y;
            renderTangram();
        };
        window.ontouchend = () => { isDragging = false; };
        
        tangramCanvas.addEventListener('click', (e) => {
            if (isDragging || tangramSelectedIdx === -1) return;
            const rect = tangramCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const idx = getPieceAt(x, y);
            if (idx === tangramSelectedIdx) {
                tangramPieces[tangramSelectedIdx].angle = (tangramPieces[tangramSelectedIdx].angle + 45) % 360;
                triggerChimeSound(x);
                renderTangram();
            }
        });
    }
    function renderTangram() {
        if (!tangramCanvas) return;
        tangramCtx.clearRect(0, 0, tangramCanvas.width, tangramCanvas.height);
        
        tangramCtx.fillStyle = '#cbd5e1';
        if(activeTheme === 'dark') tangramCtx.fillStyle = '#334155';
        tangramCtx.save();
        tangramCtx.beginPath();
        tangramCtx.moveTo(160, 220);
        tangramCtx.lineTo(220, 220);
        tangramCtx.lineTo(190, 160);
        
        tangramCtx.moveTo(160, 160);
        tangramCtx.lineTo(200, 120);
        tangramCtx.lineTo(160, 80);
        tangramCtx.lineTo(120, 120);
        tangramCtx.closePath();
        tangramCtx.fill();
        tangramCtx.restore();
        
        tangramPieces.forEach((p, idx) => {
            tangramCtx.save();
            tangramCtx.translate(p.x, p.y);
            tangramCtx.rotate((p.angle * Math.PI) / 180);
            
            tangramCtx.fillStyle = p.color;
            if (idx === tangramSelectedIdx) {
                tangramCtx.strokeStyle = 'var(--text-primary)';
                tangramCtx.lineWidth = 2.5;
            } else {
                tangramCtx.strokeStyle = 'rgba(0,0,0,0.1)';
                tangramCtx.lineWidth = 1;
            }
            
            tangramCtx.beginPath();
            if (p.type === 'triangle') {
                tangramCtx.moveTo(-p.size/2, -p.size/2);
                tangramCtx.lineTo(p.size/2, -p.size/2);
                tangramCtx.lineTo(-p.size/2, p.size/2);
                tangramCtx.closePath();
            } else if (p.type === 'square') {
                tangramCtx.rect(-p.size/2, -p.size/2, p.size, p.size);
            } else if (p.type === 'parallelogram') {
                tangramCtx.moveTo(-p.w/2, -p.h/2);
                tangramCtx.lineTo(p.w/2, -p.h/2);
                tangramCtx.lineTo(p.w/2 - 15, p.h/2);
                tangramCtx.lineTo(-p.w/2 - 15, p.h/2);
                tangramCtx.closePath();
            }
            tangramCtx.fill();
            tangramCtx.stroke();
            tangramCtx.restore();
        });
    }
    document.getElementById('reset-tangram')?.addEventListener('click', startTangram);

    // --- GAME 17: CẶP TRÙNG MAHJONG ---
    let mahjongTiles = [];
    let mahjongSelectedIdx = -1;
    function startMahjong() {
        const board = document.getElementById('mahjong-board');
        if (!board) return;
        board.innerHTML = '';
        mahjongSelectedIdx = -1;
        
        const symbols = ['🌸', '🍃', '💧', '🌙', '☀️', '⛰️'];
        let pool = [];
        symbols.forEach(s => {
            for(let i=0; i<4; i++) pool.push(s);
        });
        pool.sort(() => Math.random() - 0.5);
        
        mahjongTiles = [];
        pool.forEach((s, idx) => {
            mahjongTiles.push({
                id: idx,
                symbol: s,
                cleared: false
            });
        });
        renderMahjong();
    }
    function renderMahjong() {
        const board = document.getElementById('mahjong-board');
        if(!board) return;
        board.innerHTML = '';
        
        let remaining = 0;
        mahjongTiles.forEach((tile, idx) => {
            if (tile.cleared) {
                const empty = document.createElement('div');
                empty.style.width = '42px';
                empty.style.height = '54px';
                board.appendChild(empty);
                return;
            }
            
            remaining++;
            const el = document.createElement('div');
            el.className = 'mahjong-tile';
            el.textContent = tile.symbol;
            
            const col = idx % 6;
            const leftClear = (col === 0) || mahjongTiles[idx - 1].cleared;
            const rightClear = (col === 5) || mahjongTiles[idx + 1].cleared;
            const free = leftClear || rightClear;
            
            if (!free) el.classList.add('blocked');
            if (idx === mahjongSelectedIdx) el.classList.add('selected');
            
            el.onclick = () => {
                if (!free) return;
                
                if (mahjongSelectedIdx === -1) {
                    mahjongSelectedIdx = idx;
                    renderMahjong();
                } else if (mahjongSelectedIdx === idx) {
                    mahjongSelectedIdx = -1;
                    renderMahjong();
                } else {
                    const prev = mahjongTiles[mahjongSelectedIdx];
                    if (prev.symbol === tile.symbol) {
                        tile.cleared = true;
                        prev.cleared = true;
                        mahjongSelectedIdx = -1;
                        triggerChimeSound(160);
                        renderMahjong();
                    } else {
                        mahjongSelectedIdx = idx;
                        renderMahjong();
                    }
                }
            };
            board.appendChild(el);
        });
        const statusEl = document.getElementById('mahjong-status');
        if(statusEl) statusEl.textContent = `thẻ còn lại: ${remaining}`;
    }
    document.getElementById('reset-mahjong')?.addEventListener('click', startMahjong);

    // --- GAME 18: SUDOKU TĨNH LẶNG ---
    let sudokuBoard = [];
    let sudokuSelectedCellIdx = -1;
    const sudokuTemplates = [
        [
            5, 3, 0, 0, 7, 0, 0, 0, 0,
            6, 0, 0, 1, 9, 5, 0, 0, 0,
            0, 9, 8, 0, 0, 0, 0, 6, 0,
            8, 0, 0, 0, 6, 0, 0, 0, 3,
            4, 0, 0, 8, 0, 3, 0, 0, 1,
            7, 0, 0, 0, 2, 0, 0, 0, 6,
            0, 6, 0, 0, 0, 0, 2, 8, 0,
            0, 0, 0, 4, 1, 9, 0, 0, 5,
            0, 0, 0, 0, 8, 0, 0, 7, 9
        ]
    ];
    function startSudoku() {
        const grid = document.getElementById('sudoku-grid');
        const keypad = document.getElementById('sudoku-keypad');
        if (!grid || !keypad) return;
        
        sudokuSelectedCellIdx = -1;
        const template = sudokuTemplates[0];
        sudokuBoard = [];
        template.forEach((val) => {
            sudokuBoard.push({
                val: val,
                fixed: val !== 0,
                wrong: false
            });
        });
        
        keypad.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.className = 'capsule-btn';
            btn.textContent = i;
            btn.onclick = () => fillSudokuNumber(i);
            keypad.appendChild(btn);
        }
        const delBtn = document.createElement('button');
        delBtn.className = 'capsule-btn';
        delBtn.textContent = 'Xóa';
        delBtn.onclick = () => fillSudokuNumber(0);
        keypad.appendChild(delBtn);
        
        renderSudoku();
    }
    function renderSudoku() {
        const grid = document.getElementById('sudoku-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        sudokuBoard.forEach((cell, idx) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'sudoku-cell';
            if (cell.fixed) cellDiv.classList.add('fixed');
            if (cell.wrong) cellDiv.classList.add('wrong');
            if (idx === sudokuSelectedCellIdx) cellDiv.classList.add('selected');
            
            cellDiv.textContent = cell.val !== 0 ? cell.val : '';
            cellDiv.onclick = () => {
                if (cell.fixed) return;
                sudokuSelectedCellIdx = idx;
                renderSudoku();
            };
            grid.appendChild(cellDiv);
        });
    }
    function fillSudokuNumber(num) {
        if (sudokuSelectedCellIdx === -1) return;
        const cell = sudokuBoard[sudokuSelectedCellIdx];
        if (cell.fixed) return;
        
        cell.val = num;
        cell.wrong = false;
        if (num !== 0) {
            const row = Math.floor(sudokuSelectedCellIdx / 9);
            const col = sudokuSelectedCellIdx % 9;
            for (let c = 0; c < 9; c++) {
                const otherIdx = row * 9 + c;
                if (otherIdx !== sudokuSelectedCellIdx && sudokuBoard[otherIdx].val === num) {
                    cell.wrong = true;
                }
            }
            for (let r = 0; r < 9; r++) {
                const otherIdx = r * 9 + col;
                if (otherIdx !== sudokuSelectedCellIdx && sudokuBoard[otherIdx].val === num) {
                    cell.wrong = true;
                }
            }
        }
        triggerChimeSound(160);
        renderSudoku();
    }
    document.getElementById('reset-sudoku')?.addEventListener('click', startSudoku);
});