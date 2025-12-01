class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    constructor() {
        this.reset();
        this.initSounds();
    }

    initSounds() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.lastLevel = 0;
        this.soundQueue = [];
        this.isPlayingSound = false;

        this.soundPriorities = {
            'gameOver': 5,
            'levelUp': 4,
            'lineClear': 3,
            'gameStart': 2,
            'lockPiece': 1
        };
    }

    queueSound(soundType, soundFunction) {
        this.soundQueue.push({
            type: soundType,
            priority: this.soundPriorities[soundType] || 0,
            play: soundFunction
        });

        this.soundQueue.sort((a, b) => b.priority - a.priority);

        this.processSoundQueue();
    }

    processSoundQueue() {
        if (this.isPlayingSound || this.soundQueue.length === 0) {
            return;
        }

        const nextSound = this.soundQueue.shift();
        this.isPlayingSound = true;

        try {
            nextSound.play();

            setTimeout(() => {
                this.isPlayingSound = false;
                this.processSoundQueue();
            }, 100);
        } catch (e) {
            console.log("Sound playback error:", e);
            this.isPlayingSound = false;
            this.processSoundQueue();
        }
    }

    playSound(frequency, duration, type = 'sine', volume = 0.3, immediate = false) {
        if (!this.audioContext) return;

        if (immediate) {
            this.playSoundImmediate(frequency, duration, type, volume);
            return;
        }

        const soundFunction = () => {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = type;

                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + duration);

            } catch (e) {
                console.log("Sound playback error:", e);
                throw e;
            }
        };

        if (immediate) {
            soundFunction();
        }
    }

    playSoundImmediate(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);

        } catch (e) {
            console.log("Sound playback error:", e);
        }
    }

    // Звук начала игры
    playGameStartSound() {
        this.queueSound('gameStart', () => {
            const notes = [261.63, 329.63, 392.00, 523.25];
            let delay = 0;

            notes.forEach((freq, index) => {
                setTimeout(() => {
                    this.playSoundImmediate(freq, 0.15, 'sine', 0.25);
                }, delay);
                delay += 120;
            });
        });
    }

    // Звук фиксации фигуры
    playLockSound() {
        this.queueSound('lockPiece', () => {
            this.playSoundImmediate(150, 0.08, 'sawtooth', 0.15);
        });
    }

    // Звук повышения уровня
    playLevelUpSound() {
        this.queueSound('levelUp', () => {
            const notes = [523.25, 659.25, 783.99];
            let delay = 0;

            notes.forEach((freq, index) => {
                setTimeout(() => {
                    this.playSoundImmediate(freq, 0.15, 'sine', 0.25);
                }, delay);
                delay += 150;
            });
        });
    }

    // Звук проигрыша
    playGameOverSound() {
        this.queueSound('gameOver', () => {
            const notes = [523.25, 392.00, 261.63];
            let delay = 0;

            notes.forEach((freq, index) => {
                setTimeout(() => {
                    this.playSoundImmediate(freq, 0.2, 'sine', 0.3);
                }, delay);
                delay += 200;
            });
        });
    }

    // Звук удаления линий
    playLineClearSound(linesCleared) {
        this.queueSound('lineClear', () => {
            let frequency, duration;

            switch (linesCleared) {
                case 1:
                    frequency = 200;
                    duration = 0.1;
                    break;
                case 2:
                    frequency = 300;
                    duration = 0.15;
                    break;
                case 3:
                    frequency = 400;
                    duration = 0.2;
                    break;
                case 4:
                    frequency = 600;
                    duration = 0.3;
                    break;
                default:
                    return;
            }

            this.playSoundImmediate(frequency, duration, 'triangle', 0.3);
        });
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    getState() {
        const field = this.createField();
        const { y: pieceY, x: pieceX, blocks } = this.currentPiece;

        for (let y = 0; y < this.field.length; y++) {
            field[y] = [];

            for (let x = 0; x < this.field[y].length; x++) {
                field[y][x] = this.field[y][x];
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    field[pieceY + y][pieceX + x] = this.currentPiece.blocks[y][x];
                }
            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            field,
            isGameOver: this.topOut
        };
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.lastLevel = 0;
        this.soundQueue = []; // Очистка очереди звуков при сбросе
        this.isPlayingSound = false;
        this.field = this.createField();
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
    }

    createField() {
        const field = [];

        for (let y = 0; y < 20; y++) {
            field[y] = [];

            for (let x = 0; x < 10; x++) {
                field[y][x] = 0;
            }
        }

        return field;
    }

    createPiece() {
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];
        const piece = {};

        switch (type) {
            case 'I':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'J':
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2]
                ];
                break;
            case 'L':
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0]
                ];
                break;
            case 'O':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'S':
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0]
                ];
                break;
            case 'T':
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0]
                ];
                break;
            case 'Z':
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7]
                ];
                break;
            default:
                throw new Error("Undefined type");
        }

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;

        return piece;
    }

    moveLeft() {
        this.currentPiece.x -= 1;

        if (this.hasCollision())
            this.currentPiece.x += 1;
    }

    moveRight() {
        this.currentPiece.x += 1;

        if (this.hasCollision())
            this.currentPiece.x -= 1;
    }

    moveDown() {
        if (this.topOut) return;

        this.currentPiece.y += 1;

        if (this.hasCollision()) {
            this.currentPiece.y -= 1;
            this.lockFrame();
            const combo = this.deleteLines();
            this.updateScore(combo);
            this.updatePieces();
        }

        if (this.hasCollision()) {
            this.topOut = true;
            this.playGameOverSound();
        }
    }

    rotatePiece() {
        this.rotateBlocks();

        if (this.hasCollision()) {
            this.rotateBlocks(false);
        }
    }

    rotateBlocks(clockwise = true) {
        const blocks = this.currentPiece.blocks;
        const length = blocks.length;
        const x = Math.floor(length / 2);
        const y = length - 1;

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j];
                if (clockwise) {
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                }
                else {
                    blocks[i][j] = blocks[j][y - i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }
            }
        }
    }

    hasCollision() {
        const { y: pieceY, x: pieceX, blocks } = this.currentPiece;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] &&
                    ((this.field[pieceY + y] === undefined || this.field[pieceY + y][pieceX + x] === undefined) ||
                        this.field[pieceY + y][pieceX + x])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockFrame() {
        const { y: pieceY, x: pieceX, blocks } = this.currentPiece;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.field[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
        // Воспроизводим звук фиксации
        this.playLockSound();
    }

    deleteLines() {
        const rows = 20;
        const columns = 10;
        let lines = [];

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;
            for (let x = 0; x < columns; x++) {
                if (this.field[y][x]) {
                    numberOfBlocks += 1;
                }
            }

            if (numberOfBlocks === 0) {
                break;
            }
            else if (numberOfBlocks < columns) {
                continue;
            }
            else if (numberOfBlocks === columns) {
                lines.unshift(y);
            }
        }

        if (lines.length > 0) {
            this.playLineClearSound(lines.length);
        }

        for (let index of lines) {
            this.field.splice(index, 1);
            this.field.unshift(new Array(columns).fill(0));
        }

        return lines.length;
    }

    updateScore(combo) {
        if (combo > 0) {
            this.score += Game.points[combo] * (this.level + 1);
            this.lines += combo;

            const currentLevel = this.level;
            if (currentLevel > this.lastLevel) {
                this.playLevelUpSound();
                this.lastLevel = currentLevel;
            }
        }
    }

    updatePieces() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }
}

class View {
    // Цвета для светлой темы
    static lightColors = {
        '1': 'green',
        '2': 'yellow',
        '3': 'red',
        '4': 'blue',
        '5': 'cyan',
        '6': 'brown',
        '7': 'purple'
    };

    // Цвета для темной темы
    static darkColors = {
        '1': '#4CAF50',  
        '2': '#FFC107',  
        '3': '#F44336',  
        '4': '#2196F3',  
        '5': '#00BCD4',  
        '6': '#795548',  
        '7': '#9C27B0'   
    };

    static get colors() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? View.darkColors : View.lightColors;
    }

    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.fieldBorderWidth = 4;
        this.fieldX = this.fieldBorderWidth;
        this.fieldY = this.fieldBorderWidth;
        this.fieldWidth = this.width * 2 / 3;
        this.fieldHeight = this.height;
        this.fieldInnerWidth = this.fieldWidth - this.fieldBorderWidth * 2;
        this.fieldInnerHeight = this.fieldHeight - this.fieldBorderWidth * 2;

        this.blockWidth = this.fieldInnerWidth / columns;
        this.blockHeight = this.fieldInnerHeight / rows;

        this.panelX = this.fieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;

        this.element.appendChild(this.canvas);
    }

    renderMainScreen(state) {
        this.clearScreen();
        this.renderField(state);
        this.renderPanel(state);
    }

    renderStartScreen() {
        this.context.fillStyle = this.getTextColor();
        this.context.font = '18px "Ariel"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = this.getTextColor();
        this.context.font = '18px "Ariel"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }

    renderEndScreen({ score }) {
        this.clearScreen();

        this.context.fillStyle = this.getTextColor();
        this.context.font = '18px "Ariel"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText(`Press ENTER to Restart`, this.width / 2, this.height / 2 + 48);
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    getTextColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? '#e0e0e0' : 'black';
    }

    getGridColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(207, 207, 207, 0.1)';
    }

    renderField({ field }) {
        for (let y = 0; y < field.length; y++) {
            const line = field[y];

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.renderBlock(
                        this.fieldX + (x * this.blockWidth),
                        this.fieldY + (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        View.colors[block]
                    );
                }

                if (x != 0) {
                    this.context.strokeStyle = this.getGridColor();
                    this.context.lineWidth = 1;

                    this.context.beginPath();
                    this.context.moveTo(this.fieldX + (x * this.blockWidth), this.fieldY);
                    this.context.lineTo(this.fieldX + (x * this.blockWidth), this.fieldHeight - this.fieldBorderWidth);
                    this.context.stroke();
                }

                if (y != 0) {
                    this.context.strokeStyle = this.getGridColor();
                    this.context.lineWidth = 1;

                    this.context.beginPath();
                    this.context.moveTo(this.fieldX, this.fieldY + (y * this.blockHeight));
                    this.context.lineTo(this.fieldWidth - this.fieldBorderWidth, this.fieldY + (y * this.blockHeight));
                    this.context.stroke();
                }

            }
        }

        this.context.strokeStyle = this.getTextColor();
        this.context.lineWidth = this.fieldBorderWidth;
        this.context.strokeRect(this.fieldX / 2, this.fieldY / 2, this.fieldWidth - this.fieldX, this.fieldHeight - this.fieldY);
    }

    renderPanel({ level, score, lines, nextPiece }) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = this.getTextColor();
        this.context.font = '20px "Ariel"';

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + this.panelHeight - 24);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + this.panelHeight - 58);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + this.panelHeight - 92);

        this.context.font = '24px "Ariel"';

        this.context.fillText('Next:', this.panelX, this.panelY);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.renderBlock(
                        this.panelX + (x * this.blockWidth * 0.75),
                        this.panelY + 24 + (y * this.blockHeight * 0.75),
                        this.blockWidth * 0.75,
                        this.blockHeight * 0.75,
                        View.colors[block]
                    );
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = this.getTextColor();
        this.context.lineWidth = 2;

        this.context.fillRect(x + this.context.lineWidth / 2, y + this.context.lineWidth / 2, width - this.context.lineWidth, height - this.context.lineWidth);
        this.context.strokeRect(x + this.context.lineWidth / 2, y + this.context.lineWidth / 2, width - this.context.lineWidth, height - this.context.lineWidth);
    }
}

class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;
        this.isSaved = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.view.renderStartScreen();
    }

    update() {
        this.game.moveDown();
        this.updateView();
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
        this.game.playGameStartSound();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    reset() {
        this.isPlaying = true;
        this.isSaved = false;
        this.game.reset();
        this.play();
    }

    updateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.view.renderEndScreen(state);
            if (!this.isSaved) {
                $.post('SaveGame', { score: game.getState().score }, function () {
                    //location.reload();
                });
                this.isSaved = true;
            }
        }
        else {
            if (!this.isPlaying) {
                this.view.renderPauseScreen();
            }
            else
                this.view.renderMainScreen(state);
        }
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100;

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    handleKeyDown(event) {
        const state = this.game.getState();

        if (this.isPlaying) {
            switch (event.keyCode) {
                case 13:
                    this.pause();
                    break;
                case 37:
                    this.game.moveLeft();
                    this.updateView();
                    break;
                case 38:
                    this.game.rotatePiece();
                    this.updateView();
                    break;
                case 39:
                    this.game.moveRight();
                    this.updateView();
                    break;
                case 40:
                    this.stopTimer();
                    this.game.moveDown();
                    this.updateView();
                    break;
            }
        }
        else {
            if (event.keyCode == 13) {
                if (state.isGameOver) {
                    this.reset();
                }
                else
                    this.play()
            }
        }
    }

    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40:
                this.startTimer();
                break;
        }
    }
}

const root = document.querySelector('#root');
const game = new Game();
const view = new View(root, 480, 640, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller;

document.addEventListener('themeChanged', () => {
    if (controller.isPlaying || game.getState().isGameOver) {
        view.renderMainScreen(game.getState());
    } else {
        view.renderStartScreen();
    }
});