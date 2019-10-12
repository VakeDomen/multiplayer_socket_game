var room;

socket.on("game-player-update", (data)=>{
    if(g && data.length != 0){
        console.log(data);
        g.updatePlayers(data);
        draw(); 
    } 
});


socket.on("joined-room", (data)=>{
    room = data.room;
});


socket.on("game-env-update", (data)=>{
    if(data.bullets){
        console.log("hoy shit", data);
        g.updateBullets(data.bullets);
        draw();
    } 
})