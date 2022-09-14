var canvas;
var ctx;
var width, height;
const FPS = 70;


window.onload = () => {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    var game = new Game(FPS);

    //Update Loop
    setInterval(() => {
        canvas.width = width = window.innerWidth
        canvas.height = height = window.innerHeight

        game.update();
        game.render(ctx);

    }, 1000 / FPS);
}