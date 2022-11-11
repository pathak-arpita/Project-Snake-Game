var lastPaintTime = 0;
const snakeSpeed = 2;
const Exp_amt = 1; 
var score = 0;
let inputDirection = { x: 0, y: 0 }
let lastInputDirection = inputDirection;

//let food = getFoodRandomPosition();
const gameBoard = document.querySelector(".gameBoard");
const scoreBox = document.getElementById("score");

const snakeBody = [
  { x: 8, y: 8 },
  // { x: 9, y: 8 },
  // { x: 10, y: 8 },
  // { x: 11, y: 8 }
];

let foodBody = getFoodRandomPosition ();

function paint(currTime) {
  var sec = (currTime - lastPaintTime) / 1000;
  requestAnimationFrame(paint);
  if (sec < 1 / snakeSpeed) {
    return;
  }
  lastPaintTime = currTime;

  update(); //This function is for updating SNAK and FOOD's Position(For e.g. - upadting size of Snake, game over when snake touches the container etc)
  draw();  //This function is for drawing SNAK and FOOD's Position
}

window.requestAnimationFrame(paint);


//DRAW -
function draw() {
  drawSnake(); //for drawing SNAKE
  drawFood();  //for drawing FOOD
}

function drawSnake() {
  snakeBody.forEach((segment, index) => {
    var snakeEle = document.createElement("div");
    snakeEle.style.gridColumnStart = segment.x;
    snakeEle.style.gridRowStart = segment.y;
  // here origin is at TOP LEFT corner so - X-Axis = Columns & Y-Axis = Rows
    snakeEle.style.transform = "rotate(0deg)";

    if (index == 0) {
      snakeEle.classList.add("head");
    
    if (inputDirection.x == 1) {
      snakeEle.style.transform = "rotate(-90deg)";
    } else if (inputDirection.x == -1) {
      snakeEle.style.transform = "rotate(90deg)";
    }
    else if (inputDirection.y == -1) {
      snakeEle.style.transform = "rotate(180deg)";
    }
    else if (inputDirection.y == 1) {
      snakeEle.style.transform = "rotate(0deg)";
    }
  } else {
      snakeEle.classList.add("snake");
    }
    gameBoard.appendChild(snakeEle);
  });
}


function drawFood () {
  var foodEle = document.createElement("div");
  foodEle.style.gridColumnStart = foodBody.x;
  foodEle.style.gridRowStart = foodBody.y;
  foodEle.classList.add("food");
  gameBoard.appendChild(foodEle);

}



//UPDATE -
function update() {
  gameBoard.innerHTML = " ";
  snakeMove();   //for moving SNAKE in container
  snakeEatFood(); //as soon as SNAKE touch FOOD it will be vanishes
}

function snakeMove() {
  inputDirection = getInputDirection();

  //for connecting body-dives one to another (last -> 2nd last ->....->0)
  for (i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] } //spread syntax(...) - for interacting one object to another object
  }

  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
   checkGameOver();
}

function getInputDirection() {
  window.addEventListener("keydown", e => {

    switch (e.key) {
      case 'ArrowUp':
        if (lastInputDirection.y == 1) break;
        inputDirection = { x: 0, y: -1 }
        break;
      case 'ArrowDown':
        if (lastInputDirection.y == -1) break;
        inputDirection = { x: 0, y: 1 }
        break;
      case 'ArrowLeft':
        if (lastInputDirection.x == 1) break;
        inputDirection = { x: -1, y: 0 }
        break;
      case 'ArrowRight':
        if (lastInputDirection.x == -1) break;
        inputDirection = { x: 1, y: 0 }
        break;
      default: inputDirection = { x: 0, y: 0 }
    }

  })
  lastInputDirection = inputDirection;
  return inputDirection;
}

function snakeEatFood() {
  if(isEat()) {
    score += 10;
    scoreBox.innerHTML = score;
    console.log("Eated");
    foodBody = getFoodRandomPosition();
    expendSnake();
  }
}

function isEat() {
  return snakeBody[0].x === foodBody.x  && snakeBody[0].y === foodBody.y ;
}

function getFoodRandomPosition() {
  let a,b, myCondition = true;
    while(myCondition){
        a = Math.ceil(Math.random()*16);
        b = Math.ceil(Math.random()*16);

        myCondition = snakeBody.some(segment=>{
            //for cheking APPLE dont come on SNAKE_BODY part-
             return segment.x === a && segment.y === b;
        })
    }
    return {x : a, y : b};
  
}

function expendSnake() {
  for(i = 0; i < Exp_amt ; i++){
    snakeBody.push(snakeBody[snakeBody.length-1]); // for adding any element at the end of Array
  }
}


// For Checking Game Over - 
function checkGameOver() {
    if(snakeOutOfGrid() || snakeInteractItself()){
        location.reload();
        alert("Game Over : You Loose");

    }
}

function snakeOutOfGrid () {
    return snakeBody[0].x < 0 || snakeBody[0].x > 16 || snakeBody[0].y < 0 || snakeBody[0].y > 16;
}

function snakeInteractItself () {
    for(i=1; i<snakeBody.length; i++){
        if(snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y){
            return true;
        }
    }

}
