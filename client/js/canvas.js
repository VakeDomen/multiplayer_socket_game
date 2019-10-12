var canvas = document.querySelector("canvas");

var e = null;
var g = null;



function initCanvas(game){
    g = game;
    
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.border = "1px solid black";
    
    e = canvas.getContext("2d");
    
    draw();
}




function draw(){
    e.clearRect(0, 0, innerWidth, innerHeight);
    var centerPoint = calibrateCenter();
    g.cleanUp();
    g.draw(e, centerPoint);

}


function calibrateCenter(){
    var point = {};
    for(var i in g.players){
        if(g.players[i].id == socket.id)
            point = {
                x: g.players[i].x,
                y: g.players[i].y
            }
    }
    return point;
}