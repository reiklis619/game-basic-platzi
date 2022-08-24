const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const up = document.querySelector('#up');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const down = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timesStart;
let timePlayer;
let timeInterval;

//player
const playerPosition = {
    x: undefined,
    y: undefined,
}
const giftPosition = {
    x: undefined,
    y: undefined,
}
let enemiesPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

//teclas
window.addEventListener('keyup', keyPressed);

//funciones
function setCanvasSize(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = (canvasSize / 10);

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    game.font = elementsSize+'px Verdana';
    game.textAlign = 'end';
    
    const map = maps[level];
    
    if(!map){
        gameWin();
        return;
    }
    
    if(!timesStart){
        timesStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    
    showLives();
    
    enemiesPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize*(colI+1);
            const posY = elementsSize*(rowI+1);

            if(col === 'O' && (!playerPosition.y || !playerPosition.x)){
                playerPosition.x = posX;
                playerPosition.y = posY;
            }else if(col === 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            }else if(col === 'X'){
                enemiesPositions.push( {
                    x: posX,
                    y: posY,
                })
            }

            game.fillText(emoji, posX, posY);
        })
    });
    movePlayer()
}
//move Player
function movePlayer(){
    const giftColisionX = playerPosition.x.toFixed(0) == giftPosition.x.toFixed(0);
    const giftColisionY = playerPosition.y.toFixed(0) == giftPosition.y.toFixed(0);

    if(giftColisionX && giftColisionY) {
        levelWin();
    }

    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(0) == playerPosition.x.toFixed(0);
        const enemyCollisionY =enemy.y.toFixed(0) == playerPosition.y.toFixed(0);
        return enemyCollisionX && enemyCollisionY;
    });

    if(enemyCollision){
        loseLive();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin(){
    console.log('Subiste de nivel');
    level ++;
    startGame();
}
function loseLive(){
    console.log('prediste una vida');
    
    if(lives <= 1){
        level = 0;
        lives = 3;
        timesStart = undefined;
        clearInterval(timeInterval);
    }else{
        lives --;
    }
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin(){
    console.log('you win the game!!');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timesStart;
    
    if(recordTime){
        if(recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'felicitaciones, superaste el record :)';
        }else{
            pResult.innerHTML = 'lo siento, no superate el record :(';
        }
    }else{
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'primera vez? muy bien, pero ahora superate';
    }
}

function showLives(){
    const heartsArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerHTML = '';
    heartsArray.forEach(heart => spanLives.innerHTML += heart);
}

function showTime(){
    spanTime.innerHTML = Date.now() - timesStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

//botones
up.addEventListener('click', moverUp);
left.addEventListener('click', moverLeft);
right.addEventListener('click', moverRight);
down.addEventListener('click', moverDown);

//funciones movimiento

function moverUp(){
    if(playerPosition.y>elementsSize+10) {
        playerPosition.y -= elementsSize;
        startGame();
    }
}
function moverLeft(){
    if(playerPosition.x>elementsSize+10){
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function moverRight(){
    if(playerPosition.x<elementsSize*10-10){
        playerPosition.x += elementsSize;
        startGame();
    }
}
function moverDown(){
    if(playerPosition.y<elementsSize*10-10){
        playerPosition.y += elementsSize;
        startGame();
    }
}

//key pressed function
function keyPressed(e){
    switch(e.keyCode){
        case 38:
        moverUp();
        break;
        case 39:
        moverRight();
        break;
        case 37:      
        moverLeft();
        break;
        case 40:
        moverDown();
        break;
    }
}