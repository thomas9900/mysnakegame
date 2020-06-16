// /*
// PSEUDO CODE

// Set up the canvas
// Set score to zero
// Create snake
// Create apple
// Every 100 milliseconds {
//     Clear the canvas
//     Draw current score on the screen
//     Move snake in current direction
//     If snake collides with wall or itself {
//         End the game
//     } Else If snake eats an apple {
//         Add one to score
//         Move apple to new location
//         Make snake longer
//     }
//     For each segment of the snake {
//         Draw the segment
//     }
//     Draw apple
//     Draw border
//     }
//     When the user presses a key {
//         If the key is an arrow {
//             Update the direction of the snake
//                 }
//     }

// */





// Set up canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// Get the width and height from the canvas element
var width = canvas.width;
var height = canvas.height;
// Work out the width and height in blocks
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;
// Set score to 0
var score = 0;
var bestScore = 0;

var playBtn = $('.play');
var creditBtn = $('.credits');

// Draw the border
var drawBorder = function () {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Draw the score in the top-left corner
var drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score:" + score, blockSize, blockSize);
};
// Draw the best score
var drawBestScore = function () {
    if (!playing && score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    bestScore = Number(localStorage.getItem('bestScore'));
    ctx.fillText("Best Score:" + bestScore, 230, blockSize);
};

var newGame = function () {
    playBtn[0].style.visibility = 'visible';
    creditBtn[0].style.visibility = 'visible';

    ctx.clearRect(0, 0, 100, 50);
    drawScore();
    animationTime = 100;
    playing = false;

    playBtn[0].onclick = function() {
        startGameBtn();
    }
}

// Clear the interval and display Game Over text
var gameOver = function () {
    playing = false;
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
    newGame();
};

// Draw a circle (using the function from Chapter 14)
var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};
// The Block constructor
var Block = function (col, row) {
    this.col = col;
    this.row = row; 
};
// Draw a square at the block's location
Block.prototype.drawSquare = function (color) { 
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};
// Draw a circle at the block's location
Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true); 
};
// Check if this block is in the same location as another block
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

Block.prototype.move = function () {
    var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
    
}

var Barrier = function () {
    this.segments = 
    [
        [new Block(20, 5),
        new Block(19, 5),
        new Block(18, 5),
        new Block(17, 5),
        new Block(17, 6)],

        [new Block(5, 28),
        new Block(5, 29),
        new Block(5, 30),
        new Block(5, 31),
        new Block(6, 31)],

        [new Block(30, 28),
        new Block(30, 29),
        new Block(29, 30),
        new Block(30, 30),
        new Block(30, 31),
        new Block(31, 31)
        ]
        
    ]
};

Barrier.prototype.draw = function () {
    var barrierParts = this.segments;
    // for (var i = 0; i < 2; i++) {
        
        for (var j = 0; j < 5; j++) {
            if (score > 0) {
                barrierParts[0][j].drawSquare("orange");
            } 
            if (score > 1) {
                barrierParts[1][j].drawSquare("pink");
            }
            if (score > 2) {
                barrierParts[2][j].drawSquare("blue");
            } 
            
            // console.log(barrierParts[i][j])
            console.log(score)
        } 
    // } 
    
};

// The Snake constructor
var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    this.direction = "right";
    this.nextDirection = "right";
};
// Draw a square for each segment of the snake's body
function isEven(n) {
return n % 2 == 0;
}
function isOdd(n) {
return Math.abs(n % 2) == 1;
}

Snake.prototype.draw = function () {
    var snakeParts = this.segments
    for (var i = 0; i < this.segments.length; i++) {
        snakeParts[0].drawSquare("purple");
        if (isOdd(i)) {
            snakeParts[i].drawSquare("yellow");
        } else {
            snakeParts[i].drawSquare("red"); 
        }
    }
};
// Create a new head and add it to the beginning of
// the snake to move the snake in its current direction

Snake.prototype.move = function () {
    
    var head = this.segments[0];
    var newHead;
    this.direction = this.nextDirection;
    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        apple.move(this.segments); 

        if (animationTime > 40) {
            animationTime -= 5;  
        }
    }   
    else {
        this.segments.pop();
    } return score;   
}

// Check if the snake's new head has collided with the wall or itself
Snake.prototype.checkCollision = function (head) {
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks - 1);
    var bottomCollision = (head.row === heightInBlocks - 1);
    var wallCollision = leftCollision || topCollision ||
    rightCollision || bottomCollision;
    var selfCollision = false;
    for (var i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        } 
    }

    barrier.draw();
    if (score > 0) {
        for (var j = 0; j < 5; j++) {
            if (head.equal(barrier.segments[0][j])) {
                selfCollision = true;
            }
            if (score > 1) {
                if (head.equal(barrier.segments[1][j])) {
                selfCollision = true;
                }
            }

        }
    }
        
    
    return wallCollision || selfCollision;
};

// Set the snake's next direction based on the keyboard
// prevent illegal move
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
    return;
    } 
    else if (this.direction === "right" && newDirection === "left") {
    return;
    } else if (this.direction === "down" && newDirection === "up") {
    return;
    } else if (this.direction === "left" && newDirection === "right") {
    return;
    }
    this.nextDirection = newDirection;
};
// The Apple constructor
var Apple = function () {
    this.position = new Block(10, 5);
};
// Draw a circle at the apple's location
Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};
// Move the apple to a new random location
Apple.prototype.move = function (occupiedBlocks) {
    var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);

    // Check to see if apple has been moved to a block currently occupied by the snake
    for (var i = 0; i < occupiedBlocks.length; i++) {
        if (this.position.equal(occupiedBlocks[i])) {
            this.move(occupiedBlocks); // Call the move method again
            return;
        }
    }
};
// Create the snake and apple objects
var snake = new Snake();
var apple = new Apple();
var barrier = new Barrier();
// Pass an animation function to setInterval
// var intervalId = setInterval(function () {
    
// }, 100);


var animationTime = 100;
var playing = true;

var gameLoop = function () {
// The code that draws and updates the game should go here
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    
    drawBorder();
    drawBestScore(); 
    if (playing) {
        setTimeout(gameLoop, animationTime);
    };
    
};

newGame();
gameLoop();


// Convert keycodes to directions
var directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

var startGameBtn = function () {
    playBtn[0].style.visibility = 'hidden';
    creditBtn[0].style.visibility = 'hidden';
    playing = true;
    score = 0;
    snake = new Snake;
    gameLoop();
};
// The keydown handler for handling direction key presses
$("body").keydown(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        startGameBtn();
    }
    if (playing) {
        var newDirection = directions[event.keyCode];
        if (newDirection !== undefined) {
            snake.setDirection(newDirection);
        }
    }
});
