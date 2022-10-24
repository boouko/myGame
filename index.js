const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const alertBtn = document.getElementById('alertBtn');
const alertBox = document.getElementById('alert');
const continueBox = document.getElementById('continue');
const continueBtn = document.getElementById('continueBtn');
let mineralTyle = document.getElementById('mineralType');
let mineralName = document.getElementById('mineralName');
const luckyBtn = document.getElementById('luckyBtn')
const luckyShovel = document.getElementById('lucky-shovel')
const closeBtn = document.getElementById('closeBtn')
const redeemBtn = document.getElementById('redeemBtn')
let scores = document.getElementById('scores')
const ironIcon = document.getElementById('ironIcon');
const copperIcon = document.getElementById('copperIcon');
const goldIcon = document.getElementById('goldIcon');
const rubyIcon = document.getElementById('rubyIcon');
const diamondIcon = document.getElementById('diamondIcon');
const gameOver = document.getElementById('game-over')
const continueBtn2 = document.getElementById('continueBtn2')
const mineralRecord = document.getElementById('mineralRecord')


let distance = undefined;
let mineralArray = [];
let gamePause = false;
let gameStart = false;
let redeemStatus = false;

let mineralImage = ['images/iron.png','images/copper.png','images/gold.png','images/ruby.png','images/diamond.png']


// value setting for each mineral (iron=1,copper=2, gold=5, ruby=7, diamond=10)
let money = 0;
const mineralValue = [1,3,5,7,10] 


//audio
let audio1 = new Audio();
audio1.src = 'audio/Pop.wav';
audio1.volume = 0;

let audio2 = new Audio();
audio2.src = 'audio/metal.wav';


// Randomly generated mineral location
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
  }

let xPosition = getRandomNum(100, canvas.width-100);
let yPosition = getRandomNum(150, canvas.height-100);


// Optimization of browser resizing
window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    xPosition = getRandomNum(100, canvas.width-100);
    yPosition = getRandomNum(150, canvas.height-100);
    centerX = xPosition + 25;
    centerY = yPosition + 25;
    centerPoint = [centerX, centerY]

    ctx.fillStyle = "rgba(255,165,0,0)"; //test
    ctx.fillRect(xPosition, yPosition, 50, 50)

})


// Click button to gameStart (alert box)
alertBtn.addEventListener('click',function(){
    alertBox.style.display = 'none';
    gameStart = true;
    luckyBtn.style.display = 'inline';
    audio1.play()
})


// Determine center point of the mineral >> for later distance calculation
let centerX = xPosition + 25;
let centerY = yPosition + 25;
let centerPoint = [centerX, centerY]


//MOUSEMOVE - position & distance
const mouse = {
    x : undefined,
    y : undefined,
}

function distanceCalculation(){
    let distanceX = Math.abs(mouse.x - centerPoint[0]);
    let distanceY = Math.abs(mouse.y - centerPoint[1]);
    distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2))
}


// MOUSEMOVE - audio
function checkGameStatus(){
    if(gamePause == true){
        audio1.pause();
    } 
    else if (gamePause == false && gameStart == true){
        audio1.play();
        audio1.loop = true;
    }
}


function setVolume(){
    if (distance < 30){
        audio1.volume = 1;
    } else if (distance < canvas.width*0.05){
        audio1.volume = 0.9
    } else if (distance < canvas.width*0.1){
        audio1.volume = 0.8
    } else if (distance < canvas.width*0.2){
        audio1.volume = 0.5
    } else if(distance < canvas.width*0.3){
        audio1.volume = 0.4
    } else if (distance < canvas.width*0.5){
        audio1.volume = 0.3
    } else {
        audio1.volume = 0.1
    }

    if(gamePause == true){
        audio1.volume = 0;
    }
}


// MOUSEMOVE - cursor
function switchCursor(){
    if (distance <25){
        if (redeemStatus == false){
            canvas.style.cursor = 'url("images/cursor.png"),auto';
        } else {
            canvas.style.cursor = 'url("images/luckyShovel.png"), auto';
        }
        
    } else {
        canvas.style.cursor = 'default';
    }
}


// MOUSEMOVE - eventlistner
canvas.addEventListener('mousemove', function(event){

    //distance calculation
    mouse.x = event.x;
    mouse.y = event.y;
    distanceCalculation();

    // check if the game is started, and the 'gamePause annoucement' is not shown
    checkGameStatus();

    //determine audio volume according to distance
    setVolume()

    // switch cursor image when it touches minerals
    switchCursor();
})






//LUCKY SHOVEL - open, redeem, close
luckyBtn.addEventListener('click',function(){
    audio1.volume = 0;

    if(redeemStatus == true){
        alert("You have already redeemed lucky shovel")
    } else {
    gamePause = true; // when the game is paused, moving mouse won't cause audio to play
    luckyShovel.style.display = 'block';
    }

})

redeemBtn.addEventListener('click',function(){
    if (money < 30){
        alert("Sorry, you don't have enough money")
        
    } else {
        money -= 30;
        scores.textContent = money;
        alert('Your shovel has been upgraded')
        gamePause = false;
        luckyShovel.style.display = 'none';
        redeemStatus = true;
    }
})

closeBtn.addEventListener('click',function(){
    gamePause = false;
    luckyShovel.style.display = 'none';
})




// MOUSE CLICK - result display
function mineralCollected(){
    scores.textContent = money;
    audio2.play();
    continueBox.style.display = 'block';
}

function checkGameOver(){
    if (mineralArray.includes(0) && mineralArray.includes(1) && mineralArray.includes(2) && mineralArray.includes(3) && mineralArray.includes(4)){
        console.log('game ended')
        gameOver.style.display = 'block';
    }
}

class Mineral {
    constructor (name, index){
        this.name = name;
        this.index = index;
    }

    resultUpdate(){

        if (this.index == 0){
            mineralName.textContent = 'an ' + this.name;
        } else {
            mineralName.textContent = 'a ' + this.name;
        }
        
        mineralType.innerHTML = '<img src="' + mineralImage[this.index] +'" alt="mineral">'
        money += mineralValue[this.index]
        mineralArray.push(this.index)
        
        // draw mineral image
        let img = new Image();
        img.onload = function(){
          ctx.drawImage(img, xPosition, yPosition);
        }
        img.src = mineralImage[this.index];
        audio1.pause()


    }
}

const iron = new Mineral('iron', 0);
const copper = new Mineral('copper', 1);
const gold = new Mineral('gold', 2);
const ruby = new Mineral('ruby', 3);
const diamond = new Mineral('diamond', 4);


// MOUSE CLICK - chance calculation
let ironChance = 0.4;
let copperChance = 0.7;
let goldChance = 0.9;
let rubyChance = 0.99;

function calculateChance(){
    let chance = Math.random();

    if(chance < ironChance){
        ironIcon.innerHTML = '<img  src="images/iron.png" alt="iron"></img>'
        iron.resultUpdate()

    } else if (chance < copperChance){
        copperIcon.innerHTML = '<img  src="images/copper.png" alt="iron"></img>'
        copper.resultUpdate()

    } else if (chance < goldChance){
        goldIcon.innerHTML = '<img  src="images/gold.png" alt="iron"></img>'
        gold.resultUpdate()


    } else if (chance < rubyChance){
        rubyIcon.innerHTML = '<img  src="images/ruby.png" alt="iron"></img>'
        ruby.resultUpdate()


    }else {
        diamondIcon.innerHTML = '<img  src="images/diamond.png" alt="iron"></img>'
        diamond.resultUpdate()

    }

    checkGameOver();
}


// MOUSE CLICK - eventlistener
canvas.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;

    if(mouse.x >= xPosition -10 && mouse.x <= xPosition + 60 &&
        mouse.y >= yPosition -10 && mouse.y <= yPosition + 60 ){
        gamePause = true;

        if(redeemStatus == false){
            checkGameStatus();
            calculateChance();
     
        } else {
            ironChance -= 0.1;
            copperChance -= 0.2;
            goldChance -= 0.3;
            rubyChance -= 0.19;
            calculateChance();
            checkGameStatus();

        }

        setTimeout(mineralCollected, 500)
    }
})



// generating new mineral
continueBtn.addEventListener('click',function(){
    continueBox.style.display = 'none';

    ctx.clearRect(0,0,canvas.width, canvas.height)

    xPosition = getRandomNum(100, canvas.width-100);
    yPosition = getRandomNum(150, canvas.height-100);

    centerPoint[0] = xPosition+25;
    centerPoint[1] = yPosition+25;
    gamePause = false;
})

continueBtn2.addEventListener('click',function(){
    gameOver.style.display = 'none';
})

