const rulesBtn=document.getElementById('rules-btn');
const closeBtn=document.getElementById('close-btn');
const rules=document.getElementById('rules');
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
let score=0;
let highScore=localStorage.getItem('highscore');
const brickColumns=9;
const brickRows=5;

//Create Ball Properties
const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    size:10,
    speed:4,
    dx:4,
    dy:-4
}

//Create Paddle properties
const paddle={
    x:canvas.width/2-40,
    y:canvas.height-20,
    dx:0,
    speed:8,
    width:80,
    height:10
}

//Create Brick Properties
const brickInfo={
    width:70,
    height:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible:true
}

//Create Bricks
const bricks=[];
for(let i=0;i<brickColumns;i++){
    bricks[i]=[];
    for(let j=0;j<brickRows;j++){
        const x=i*(brickInfo.width+brickInfo.padding) + brickInfo.offsetX;
        const y=j*(brickInfo.height+brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j]={x,y,...brickInfo};
    }
}

//Draw ball on canvas
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI*2);
    // ctx.fillStyle='#0095dd';
    ctx.fillStyle='red';
    ctx.fill();
    ctx.closePath();
}

//Draw paddle on canvas
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.width,paddle.height);
    // ctx.fillStyle='#0095dd';
    ctx.fillStyle='yellow';
    ctx.fill();
    ctx.closePath();
}

//Draw bricks on canvas
function drawBricks(){
    bricks.forEach(column=>{
        column.forEach(brick=>{
            ctx.beginPath();
            ctx.rect(brick.x,brick.y,brick.width,brick.height);
            // ctx.fillStyle=brick.visible ? '#0095dd': 'transparent';
            ctx.fillStyle=brick.visible ? '#00f700': 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

//Move Paddle On Canvas
function movePaddle(){
    paddle.x+=paddle.dx;
    //Wall Detection
    if(paddle.x+paddle.width>canvas.width){
        paddle.x=canvas.width-paddle.width;
    }

    if(paddle.x<0){
        paddle.x=0;
    }
}

//Move Ball On Canvas
function moveBall(){
    ball.x+=ball.dx;
    ball.y+=ball.dy;

    //Wall Collision on X-Axis
    if(ball.x+ball.size>canvas.width || ball.x-ball.size<0){
        ball.dx*=-1;
    }
    //Wall Collision on Y-Axis
    if(ball.y+ball.size>canvas.height || ball.y-ball.size<0){
        ball.dy*=-1;
    }

    //Paddle Collision
    if(ball.x-ball.size>paddle.x && ball.x +ball.size<paddle.x+paddle.width && ball.y+ball.size>paddle.y){
        ball.dy=-ball.speed;
    }

    //Bricks Collision
    bricks.forEach(column=>{
        column.forEach(brick=>{
            if(brick.visible){
                if(ball.x -ball.size>brick.x &&
                    ball.x + ball.size<brick.x +brick.width &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.height){
                        ball.dy*=-1;
                        brick.visible=false;
                        increaseScore();
                    } 
            }
        })
    });

    //Hit Bottom Wall
    if(ball.y + ball.size > canvas.height){
        setHighScore();
        showAllBricks();
        score=0;
        ball.x=canvas.width/2;
        ball.y=canvas.height/2;
    }
}

//Sets High Score
function setHighScore(){
    if(score>highScore) localStorage.setItem('highscore',score);
}

//Increase Score
function increaseScore(){
    score++;
    if(score%(brickColumns*brickRows)===0){
        showAllBricks();
    }
}

//Show All Bricks
function showAllBricks(){
    bricks.forEach(column=>{
        column.forEach(brick=>{
            brick.visible=true;
        });
    });
}

//Draw everything

function draw(){
    //clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
};

//Draw score on canvas
function drawScore(){
    ctx.font='20px Arial',
    ctx.fillText(`Score: ${score}`,canvas.width-100,30);
    ctx.fillText(`High Score: ${highScore}`,30,30);
}


//Update Canvas Drawing And Animation
function update(){
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

update();

//KeyDown Event
function keyDown(key){

    if(key.key==='Right' || key.key==='ArrowRight'){
        paddle.dx=paddle.speed;
    
    }
    else if(key.key==='Left' || key.key==='ArrowLeft'){
        paddle.dx=-paddle.speed;
    }
}

//KeyUp Event
function keyUp(key){
 
    if(key.key==='Right' || key.key==='ArrowRight' || key.key==='Left' || key.key==='ArrowLeft'){
        paddle.dx=0;
    }
}

//Keyboard Event Listeners
document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

//Rules Event Handlers

rulesBtn.addEventListener('click',()=>{
    rules.classList.add('show');
})

closeBtn.addEventListener('click',()=>{
    rules.classList.remove('show');
})