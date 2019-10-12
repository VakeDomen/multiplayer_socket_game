


document.onkeydown = function(e){
    if(state == "game"){
        if(e.keyCode == 87) socket.emit("keypress", {type: "up", state: true});
        if(e.keyCode == 83) socket.emit("keypress", {type: "down", state: true});
        if(e.keyCode == 65) socket.emit("keypress", {type: "left", state: true});
        if(e.keyCode == 68) socket.emit("keypress", {type: "right", state: true});
    }
}


document.onkeyup = function(e){
    if(state == "game"){
        if(e.keyCode == 87) socket.emit("keypress", {type: "up", state: false});
        if(e.keyCode == 83) socket.emit("keypress", {type: "down", state: false});
        if(e.keyCode == 65) socket.emit("keypress", {type: "left", state: false});
        if(e.keyCode == 68) socket.emit("keypress", {type: "right", state: false});
    }
}