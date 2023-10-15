const DINO_X = 100;
const DINO_Y = 250;
const DINO_SPEED = 15;
const DINO_WIDTH = 30;
const CACTUSES_WIDTH = 20;
const CACTUSES_HEIGHT = 60;
const CACTUSES_Y = 310;
const CACTUSES_SPEED = 6;
const BIRDS_Y = 90;
const BIRDS_HEIGHT = 50;
const MAX_JUMP_HEIGHT = 200;
const TEN = 10;

let ctx = canvas.getContext("2d");
let dinosaurImage = document.getElementById("dinosaur");
let birdImage = document.getElementById("bird");
let cactusImage = document.getElementById("cactus");
let cloudsImage = document.getElementById("clouds");
let canvas = document.getElementById("canvas");
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
let score = 0;
let jumpHeight = 0;
let isJumping = false;
let isGameOver = false;
let birds = [];
let cactuses = [];
let clouds = [];

let dinosaur = {
    dinosaurX: DINO_X,
    dinosaurY: DINO_Y,
    dinosaurWidth: DINO_WIDTH,
    dinosaurHeight: DINO_WIDTH * 2,
    speed : DINO_SPEED,

    drawDinosaur() {
        ctx.drawImage(dinosaurImage, this.dinosaurX, this.dinosaurY, this.dinosaurWidth, this.dinosaurHeight);
    }
};

class Cactus {
    constructor(cactusX, cactusY, cactusWidth, cactusHeight, speed) {
        this.cactusX = cactusX;
        this.cactusY = cactusY;
        this.cactusWidth = cactusWidth;
        this.cactusHeight = cactusHeight;
        this.speed = speed;
    }

    drawCactus() {
        ctx.drawImage(cactusImage, this.cactusX, this.cactusY, this.cactusWidth, this.cactusHeight);
    }

    upadateCactus() {
        this.cactusX -= this.speed;
    }
}

function addCactuses() {
    let x = canvas.width;
    let width = CACTUSES_WIDTH;
    let height = Math.floor(Math.random() * (CACTUSES_HEIGHT - CACTUSES_WIDTH + 1) + CACTUSES_WIDTH);
    let y = CACTUSES_Y - height;
    let speed = CACTUSES_SPEED;
    let newCactus = new Cactus(x, y, width, height, speed);
    cactuses.push(newCactus);
}

setInterval(addCactuses, 1000);

class Bird {
    constructor(birdX, birdY, birdWidth, birdHeight, speed) {
        this.birdX = birdX;
        this.birdY = birdY;
        this.birdWidth = birdWidth;
        this.birdHeight = birdHeight;
        this.speed = speed;
    }

    drawBird() {
        ctx.drawImage(birdImage, this.birdX, this.birdY, this.birdWidth, this.birdHeight);
    }

    updateBird() {
        this.birdX -= this.speed;
    }
}

function addBirds() {
    let x = canvas.width;
    let y = Math.floor(Math.random() * (BIRDS_Y - TEN + 1) + TEN);
    let width = CACTUSES_WIDTH * 2;
    let height = BIRDS_HEIGHT;
    let speed = CACTUSES_SPEED / 2;
    let newBird = new Bird(x, y, width, height, speed);
    birds.push(newBird);
}

setInterval(addBirds, 10000);

class Clouds {
    constructor(cloudX, cloudY, cloudWidth, cloudHeight, speed) {
        this.cloudX = cloudX;
        this.cloudY = cloudY;
        this.cloudWidth = cloudWidth;
        this.cloudHeight = cloudHeight;
        this.speed = speed;
    }

    drawClouds() {
        ctx.drawImage(cloudsImage, this.cloudX, this.cloudY, this.cloudWidth, this.cloudHeight);
    }

    updateClouds() {
        this.cloudX -= this.speed;
    }
}

function addClouds() {
    let x = canvas.width;
    let y = Math.floor(Math.random() * (BIRDS_Y + TEN - 1) + TEN);
    let width = BIRDS_Y - TEN;
    let height = BIRDS_HEIGHT;
    let speed = 0.3;
    let newCloud = new Clouds(x, y, width, height, speed);
    clouds.push(newCloud);
}

setInterval(addClouds, 5000);

function startGame() {
    drawGame();
    setInterval(updateScore, 300);
    startButton.disabled = true;
    resetButton.disabled = false;
}

function updateScore() {
    if (!isGameOver) {
        ++score;
        document.getElementById("score").innerText = "SCORE:" + score;
    }
}

function keyDown(e) {
    if (e.key == " ") {
        jumpDino();
    }
}

function jumpDino() {
    if (!isJumping) {
        isJumping = true;
        jumpHeight = 0;
        jump();
    }
}

function jump() {
    jumpHeight += dinosaur.speed;
    dinosaur.dinosaurY -= dinosaur.speed;
    if (jumpHeight >= MAX_JUMP_HEIGHT) {
        fall();
    } else {
        requestAnimationFrame(jump);
    }
}

function fall() {
    jumpHeight -= dinosaur.speed;
    dinosaur.dinosaurY += dinosaur.speed;
    if (dinosaur.dinosaurY >= DINO_Y) {
        dinosaur.dinosaurY = DINO_Y;
        isJumping = false;
    } else {
        requestAnimationFrame(fall);
    }
}

function createBackgroundLine() {
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(1000, 300);
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawGame() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createBackgroundLine();
        dinosaur.drawDinosaur();
        for (let k = 0; k < clouds.length; ++k) {
            clouds[k].drawClouds();
            clouds[k].updateClouds();
        }
        for (let i = 0; i < cactuses.length; ++i) {
            cactuses[i].drawCactus();
            cactuses[i].upadateCactus();
        }
        for (let j = 0; j < birds.length; ++j) {
            birds[j].drawBird();
            birds[j].updateBird();
        }
        checkCollisionWithCactuses();
        checkCollisionWithBirds();
        requestAnimationFrame(drawGame);
    } else {
        gameOver();
    }
}

function checkCollisionWithCactuses() {
    for (let i = 0; i < cactuses.length; ++i) {
        let cactus = cactuses[i];
        if (dinosaur.dinosaurX < cactus.cactusX + cactus.cactusWidth &&
            dinosaur.dinosaurX + dinosaur.dinosaurWidth - TEN > cactus.cactusX &&
            cactus.cactusY + cactus.cactusHeight > dinosaur.dinosaurY &&
            cactus.cactusY < dinosaur.dinosaurY + dinosaur.dinosaurHeight) {
                isGameOver = true;
        }
    }
}

function checkCollisionWithBirds() {
    for (let i = 0; i < birds.length; ++i) {
        let bird = birds[i];
        if (dinosaur.dinosaurX < bird.birdX + bird.birdWidth &&
            dinosaur.dinosaurX + dinosaur.dinosaurWidth > bird.birdX &&
            bird.birdY + bird.birdHeight > dinosaur.dinosaurY &&
            bird.birdY < dinosaur.dinosaurY + dinosaur.dinosaurHeight) {
                isGameOver = true;
        }
    }
}

function gameOver() {
    ctx.font = "50px serif";
    ctx.fillText("GAME OVER!", 600, 100);
    ctx.font = "30px serif";
    ctx.fillText("Press RESET button to restart the game", 500, 150);
}

function resetGame() {
    if (isGameOver) {
        location.reload();
    }
}

document.addEventListener("keydown", keyDown);