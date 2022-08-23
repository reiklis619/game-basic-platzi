const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', startGame);

function startGame() {
    let canvasSize;

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    const elementsSize = (canvasSize / 10);
    console.log({canvasSize, elementsSize});

    game.font = elementsSize+'px Verdana';
    game.textAlign = 'end';

    for(let i = 1; i <= 10; i++) {
        game.fillText(emojis['X'], (i*elementsSize)+10, elementsSize);
    }


    // game.fillRect(0,0,100,100);
    // game.clearRect(0,0,100,50);
}