


var name = "";
var state = "login";
var lobbyPlayers = [];

document.getElementById("name-input").value = Math.random() * 100;

function login(){
    var name = document.getElementById("name-input").value;
    if(name != "") {
        var data = {
            name: name
        };

        socket.emit("login", data);
    }
}

function toLobby(){
    document.getElementById("div-login").style.display = "none";
    document.getElementById("div-lobby").style.display = "inline-block";
    //document.getElementById("div-chat").style.display = "inline-block";
    socket.emit("lobby-init-players");
    state = "lobby";
    
}

function startGame(){
    socket.emit("start-game");
}

function ready(){
    var checkbox = document.getElementById("checkbox");
    if(checkbox.checked) checkbox.checked = false;
    else checkbox.checked = true;
    socket.emit("player-ready", {ready: document.getElementById("checkbox").checked});
}

function includesId(id){
    for(var player of lobbyPlayers){
        if(player.id == id) return true;
    }
    return false;
}

//chat
var chat = document.getElementById("chat-form");
chat.onsubmit = function(e){
    e.preventDefault();
    var input = document.getElementById("chat-input").value;
    if(input[0] == "/"){
        document.getElementById("chat-input").value = "";
        socket.emit("eval", input.slice(1));
    }else{
        var data = {
            from: name,
            msg: input
        };
        document.getElementById("chat-input").value = "";
        socket.emit("chat-msg", data)
    }


    
}

socket.on("login-successful", (data)=>{
    name = data.name;
    document.getElementById("login-message").innerHTML = "";
    toLobby();
});

socket.on("login-failed", (data)=>{
    document.getElementById("login-message").innerHTML = data.message;
});

socket.on("lobby-init-players", (data)=>{
    lobbyPlayers = data;
    document.getElementById("lobby-list").innerHTML = createPlayerLobbyTable(lobbyPlayers);
});


var change = false;
socket.on("lobby-players-update", (data)=>{
    console.log("lobby", lobbyPlayers);
    console.log("data", data);
    
    if(data.length != 0){
        console.log(data);
        for(var player of data) {
            if(!includesId(player.id)) {
                console.log("includs");
                lobbyPlayers.push(player);
                change = true;
                continue;
            }
            for(var lplayer of lobbyPlayers){
                if(lplayer.id == player.id) {
                    console.log("updated " + lplayer.name);
                    lplayer = player;
                    change = true;
                }
            }
        }
    }
    if(change) {
        document.getElementById("lobby-list").innerHTML = createPlayerLobbyTable(lobbyPlayers);
        change = false;
    }
    
});

socket.on("user-disconnected",(data)=>{
    console.log("player DC: " + data.id);
    for(var i = 0 ; i < lobbyPlayers.length ; i++){
        if(lobbyPlayers[i].id == data.id){
            lobbyPlayers.splice(i, 1);
            if(state == "lobby") document.getElementById("lobby-list").innerHTML = createPlayerLobbyTable(lobbyPlayers);
            break;
        }
    }
});

socket.on("chat-msg", (data)=>{
    document.getElementById("chat").innerHTML = "<p><b>" + data.from + ": </b> " + data.msg +  "</p>" + document.getElementById("chat").innerHTML;
});

socket.on("start-game", (data)=>{
    document.getElementById("div-lobby").style.display = "none";
    document.getElementById("div-canvas").style.display = "inline-block";
    state="game";
    
    data  = JSON.parse(data);




    var players = [];
    for(var i in data.players){
        players[i] = new Player(data.players[i]);
    }
    
    
    var game = new Game({
        players: players,
        enemies: data.enemies,
        env: data.env
    });
    initCanvas(game);
});




