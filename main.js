//setting canvas
let canvas; 
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
document.body.appendChild(canvas);


let backgroundImage, spaceFighter, bulletImage, enemyImage, gameOverImage;
let gameOver = false;
let score = 0;

//coordinate of spaceFighter
let spaceFighterX = canvas.width / 2 - 40;
let spaceFighterY = canvas.height - 80;

let bulletList = [];
function bullet(){
  this.x = 0;
  this.y = 0;
  this.init = function(){
    this.x = spaceFighterX + 28;
    this.y = spaceFighterY;
    this.alive = true;
    bulletList.push(this);
  };
  this.update = function(){
    this.y -= 7;
  }
  this.checkHit = function(){
    for (let i = 0;  i < enemyList.length; i++){
      if (this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40){
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  }
}

let enemyList = [];
function enemy(){
  this.x = 0;
  this.y = 0;
  this.init = function(){
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 80);
    enemyList.push(this);
  }
  this.update = function(){
    this.y += 2;

    if (this.y >= canvas.height - 80){
      gameOver = true;
      console.log("over")
    }
  }
}


function generateRandomValue(min, max){
  let randomNum = Math.floor(Math.random()*(max - min + 1)) + min;
  return randomNum;
}


function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src="images/wavegrower.gif";

  spaceFighter = new Image();
  spaceFighter.src="images/spaceFighter.png";

  bulletImage = new Image();
  bulletImage.src="images/bullet.png";

  enemyImage = new Image();
  enemyImage.src="images/insect.png";

  gameOverImage = new Image();
  gameOverImage.src="images/gameover.png";
}
let keysDown = {};
function setupKeyboardListener(){
  document.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
    console.log(keysDown);
  });//when key is pressed

  document.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode]
    console.log(keysDown);

    if (event.keyCode == 32){
      createBullet();
    }
  });//when key is unpressed

}


function createBullet(){
  let b = new bullet();
  b.init();
}

function createEnemy(){
  const interval = setInterval(function(){
    let e = new enemy();
    e.init()
  }, 1000)
}


function update(){
  if ( 39 in keysDown){
    spaceFighterX += 5;
  }//right
  if ( 37 in keysDown){
    spaceFighterX -= 5;
  }//left
  if ( 38 in keysDown){
    spaceFighterY -= 5;
  }//up
  if ( 40 in keysDown){
    spaceFighterY += 5;
  }//down
  if (spaceFighterX <= 0){
    spaceFighterX = 0;
  }
  if (spaceFighterX >= canvas.width - 80){
    spaceFighterX = canvas.width - 80;
  }
  if (spaceFighterY <= canvas.width / 2){
    spaceFighterY = canvas.width / 2;
  }
  if (spaceFighterY >= canvas.height - 79){
    spaceFighterY = canvas.height - 79;
  }


  for (let i = 0; i < bulletList.length; i++){
    if (bulletList[i].alive){
    bulletList[i].update();
    bulletList[i].checkHit();
  }
  }

  for (let i = 0; i < enemyList.length; i++){
    enemyList[i].update();
  }


}


function render(){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceFighter, spaceFighterX, spaceFighterY);
  ctx.fillText(score, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  for (let i = 0; i < bulletList.length; i++){
    if (bulletList[i].alive){
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++){
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }

}

function main(){
  if (!gameOver){
  render();
  requestAnimationFrame(main);
  update();
}
  else{
    alert("Game Over\n" + "Score : " + score);
  }
}
loadImage();
setupKeyboardListener();
createEnemy();
main();
