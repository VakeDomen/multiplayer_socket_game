


canvas.onclick = (event)=>{
        
    var packet = {
        x:          event.clientX - event.target.width/2,
        y:          event.clientY - event.target.height/2,
        id:         room
    }
    console.log(socket);

    if(g.me.ableToShoot) socket.emit("shoot", packet);   
}



