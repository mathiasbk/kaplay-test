import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();
k.setBackground(0, 0, 0);

//Size of each "cell" in px
const cellsize = 30;
const speed = 5;

const rows = window.innerHeight;
const cols = window.innerWidth;

let direction = "right";

let gameOver = false;

let snake = [];

// Function to initialize the game
function initGame() {
    direction = "right";
    gameOver = false;
    snake = [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 }
    ];
}

//Main scene
k.scene("Game", () => {
    k.setBackground(0, 0, 0);

    //initialize the game
    initGame();

    //show score
    const score = k.add([
        text("Score: 0"),
        pos(24, 24),
        { value: 0 },
    ]);
    
    //Move the snake
    (function move() {

        //If the game is over, stop the game
        if(gameOver) return;

        setTimeout(() => {
            move();
        }, 1000);

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

        //check if the snake collieds with itself or the wall
        checkCollision();

        //Add new head
        snake.unshift(head);

        //Remove tail
        snake.pop();

        Drawsnake();
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

function endGame()
{
    gameOver = true;
    k.go("Gameover");
    console.log("Game Over");
}

k.go("Game");