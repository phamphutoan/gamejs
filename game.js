const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// // Vẽ lineTo
// ctx.lineTo(0, 0);
// ctx.lineTo(50, 50);
// ctx.lineTo(0, 50);
// ctx.lineTo(0, 0);
// ctx.stroke();

// // Di chuyển bút đến điểm khác bằng moveTo
// ctx.moveTo(0, 70);
// ctx.lineTo(70, 70);
// ctx.stroke();

// ctx.moveTo(100, 0);
// ctx.lineTo(150, 0);
// ctx.lineTo(150, 50);
// ctx.lineTo(100, 50);
// ctx.lineTo(100, 0);
// ctx.stroke();
// ctx.fillStyle = 'red';
// ctx.fill();

// // Vẽ hình chữ nhật bằng rect
// ctx.rect(0, 100, 100, 50);
// ctx.strokeStyle = 'yellow';
// ctx.stroke();

// ctx.fillStyle = '#f0f0f0';
// ctx.fill();

// // Hàm vẽ đường cong
// ctx.arc(50, 50, 50, 0, Math.PI / 2, true);
// ctx.stroke();

// // Vẽ nhiều hình tách thuộc tính bằng beginPath và closePath
// ctx.beginPath();
// ctx.rect(0, 0, 100, 50);
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(150, 150, 50, 0, Math.PI * 2, true);
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(300, 150, 50, 0, Math.PI * 2, true);
// ctx.stroke();
// ctx.fillStyle = 'yellow';
// ctx.fill();
// ctx.closePath();


// Vẽ trò chơi

let isEnd = false;

let x = Math.floor(Math.random() * (canvas.width - 50));
let y = canvas.height - 100;
let radius = 3;
let dx = 2;
let dy = -2;

let wBar = 50;
let hBar = 5;
let xBar = canvas.width / 2 - wBar / 2;
let yBar = canvas.height - 25;
let speedBar = 5;
let isMovingLeft = false;
let isMovingRight = false;

let row = 8;
let col = 8;
let offset = 15;
let margin = 10;

let wBrick = (canvas.width - (2 * offset) - ((col - 1) * margin)) / col;
let hBrick = 5;

let brickArr = [];

for(let r = 1; r <= row; r++){
    for(let c = 1; c <= col; c++){
        brickArr.push({
            x: offset + (c - 1) * (wBrick + margin),
            y: offset + (r - 1) * (hBrick + margin),
            isActive: true,
        });
    }
}

let start = confirm('Start Game');
let score = 0;

let caseChange = document.getElementById('case');

class Ball {

    constructor(){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }

    checkPosition(){
        if(x < radius || x > canvas.width - radius){
            dx = -dx;
        }
    
        if(y < radius || y > canvas.height - radius){
            dy = -dy;
        }

        if(y + radius == yBar && x + radius >= xBar && x - radius <= xBar + wBar){
            dy = -dy;
        }

        if(y >= canvas.height - radius){
            isEnd = true;
        }
    }

    updatePosition(){
        x += dx;
        y += dy;
    }

}

class Bar {
    constructor(){
        ctx.beginPath();
        ctx.rect(xBar, yBar, wBar, hBar);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    updatePosition(){
        if(isMovingLeft){
            xBar -= speedBar;
        }

        if(isMovingRight){
            xBar += speedBar;
        }
    }

    checkPosition(){
        if(xBar + wBar > canvas.width){
            isMovingRight = false;
        }

        if(xBar < 0){
            isMovingLeft = false;
        }
    }
}

class Brick {
    constructor(){
        ctx.beginPath();
        brickArr.forEach(item => {
            if(item.isActive){
                ctx.rect(item.x, item.y, wBrick, hBrick);
            }
        });
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.closePath();
    }

    checkBrickAndBall(){
        brickArr.forEach(item => {
            if(item.isActive){
                if((x >= item.x) && (x <= item.x + wBrick + radius) && (y >= item.y - radius) && (y <= item.y + hBrick + radius)){
                    item.isActive = false;
                    score++;
                    let i = Math.floor(Math.random()*2) + 1;
                    switch (i){
                        case 1:
                            dx = -dx;
                            caseChange.innerText = 1;
                            break;
                        case 2:
                            caseChange.innerText = 2;
                        default:
                            dy = -dy;
                            caseChange.innerText = 'default';
                            break;
                    }
                }
            }
        });
    }
}

document.addEventListener('keydown', (e) => {
    // console.log(e);
    if(e.key == 'ArrowLeft'){ //Di chuyển sang trái
        isMovingLeft = true;
    } else if(e.key == 'ArrowRight'){ //Di chuyển sang phải
        isMovingRight = true;
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key == 'ArrowLeft' || e.key == 'ArrowRight'){
        isMovingLeft = false;
        isMovingRight = false;
    }
});

let scoreBoard = document.getElementById('score');

function logic(){
    if(score < brickArr.length){
        if(!isEnd){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let ball = new Ball;
            let bar = new Bar;
            let brick = new Brick;
    
            ball.checkPosition();
            ball.updatePosition();
            brick.checkBrickAndBall();
    
            bar.checkPosition();
            bar.updatePosition();

            scoreBoard.innerText = score;
    
            requestAnimationFrame(logic);
        } else {
            alert('Game Over');
        }
    } else {
        score++;
        alert('You won');
    }
}

if(start){
    logic();
}