import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();

//Size of each "cell" in px
const cellsize = 30;
const speed = 5;

const rows = window.height / cellsize;
const cols = window.width / cellsize;

let direction = "right";

//Create the snake
let snake = [
    { x: 3, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 1 }
];



//add the snake to the scene
snake.forEach((s) => {
    k.add([
        k.pos(s.x * cellsize, s.y * cellsize),
        k.rect(cellsize, cellsize),
        k.color(52, 235, 103),
        "snakepart"
    ]);
});

//Move the snake
(function move() {
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

    k.get("snakepart").forEach((s) => {
        console.log(s.pos.x);
        const pos = s.pos;
        s.destroy();
        CreateSnakePart(pos.x +speed, pos.y);

    });

    setTimeout(move, 1000);
})();

k.onUpdate(() => {
    

});
function CreateSnakePart(x, y) {
    k.add([
        k.pos(x, y),
        k.rect(cellsize, cellsize),
        k.color(52, 235, 103),
        "snakepart"
    ]);
}