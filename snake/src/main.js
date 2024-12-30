import kaplay from "https://unpkg.com/kaplay@3001/dist/kaplay.mjs";

const k = kaplay();
k.setBackground(0, 0, 0);

//Size of each "cell" in px
const cellsize = 80;
const speed = 600;

const rows = Math.floor(window.innerHeight / cellsize);
const cols = Math.floor(window.innerWidth / cellsize);

let direction = "right";

let gameOver = false;
drawGrid();

let snake = [];
let food = [];
let score = 0;

// Function to initialize the game
function initGame() {
    direction = "right";
    gameOver = false;
    score = 0;

    snake = [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 }
    ];

    //place 1 food.
    placeFood();
}

//Main scene
k.scene("Game", () => {
    k.setBackground(0, 0, 0);

    //initialize the game
    initGame();

    //show score
    const scorelabel = k.add([
        text("Score: " + score),
        pos(24, 24),
        { value: 0 },
    ]);
    
    //Move the snake
    (function move() {

        //If the game is over, stop the game
        if(gameOver) return;

        setTimeout(() => {
            move();
        }, speed);

        let head = { ...snake[0] };

        if (direction === "right") {
            head.x++;
        }
        if (direction === "left") {
            head.x--;
        }
        if (direction === "up") {
            head.y--;
        }
        if (direction === "down") {
            head.y++;
        }

        //Add new head
        snake.unshift(head);

        //Remove tail
        snake.pop();

        Drawsnake();

        //check if the snake collieds with itself or the wall
        checkCollision();

        //check if it hits a placed food
        eatFood();

        k.onUpdate(() => {
            scorelabel.text = "Score: " + score;
        });
        
    })();


    //On keydown
    k.onKeyPress("left", () => {
        if(direction != "right") { direction = "left"; }
    });
    k.onKeyPress("right", () => {
        if(direction != "left") { direction = "right"; }
    });
    k.onKeyPress("up", () => {
        if(direction != "down") { direction = "up"; }
        direction = "up";
    });
    k.onKeyPress("down", () => {
        if(direction != "up") { direction = "down"; }
    });

});

// Create Gameover scene
k.scene("Gameover", () => {
    k.add([
        k.text("Game Over", 48),
        pos(width() / 2, height() / 2),
        scale(3),
        anchor("center"),
    ]);
    k.add([
        k.text("Press space to start over", 30),
        pos(width() / 2, height() /2 + 100),
        scale(2),
        anchor("center"),
    ]);

    k.onKeyPress("space", () => {
        k.go("Game");
    });
});



function Drawsnake() {

    drawGrid();

    //remove old snake
    k.get("snakepart").forEach((s) => {
        //console.log(s.pos.x);
        const pos = s.pos;
        s.destroy();
    });

    //draw new snake
    snake.forEach((s) => {
        k.add([
            k.pos(s.x * cellsize, s.y * cellsize),
            k.rect(cellsize, cellsize),
            k.color(52, 235, 103),
            "snakepart"
        ]);
    });
    
}

function checkCollision() {
    let head = { ...snake[0] };

    //checks for collison with itself
    for(let i = 1; i < snake.length; i++) {
        if(snake[i].x === head.x && snake[i].y === head.y) {
            console.log("Game Over. Snake collieded with itself");
            endGame();
        }
    }

    //checks for collision with the wall
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        console.log("Game Over. Snake collieded with the wall");
        endGame();
    }
}

function eatFood() {
    const head = { ...snake[0] };

    if(head.x === food.x && head.y === food.y) {
        //add a new part to the snake
        snake.push({ ...snake[snake.length - 1] });

        //remove the old food
        k.get("food").forEach((f) => {
            f.destroy();
        });

        //place a new food
        placeFood();

        //update score
        score++;
        k.get("scorelabel").text = score;

        console.log("food hit: " + score);
    }
}

function endGame()
{
    gameOver = true;
    k.go("Gameover");
    console.log("Game Over");
}

//add a new food
function placeFood()
{
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };


    //Todo: check if the food is placed on the snake

    k.add([
        k.pos(food.x * cellsize, food.y * cellsize),
        k.rect(cellsize, cellsize),
        k.color(255, 0, 0),
        "food"
    ]);
}

// Draw the grid
function drawGrid() {

     //draw columns
     for (let i = 0; i < cols * cellsize; i += cellsize) {
        k.add([
            k.rect(1, rows * cellsize),
            k.pos(i, 0),
            k.color(15, 15, 15),
        ]);
    }

    //draw rows
    for (let i = 0; i < rows * cellsize; i += cellsize) {
        k.add([
            k.rect(cols * cellsize, 1),
            k.pos(0, i),
            k.color(15, 15, 15),
        ]);
    }
}


k.go("Game");