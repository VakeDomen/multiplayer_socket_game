const express = require("express");
const app = express();
const config = require("./config");



app.get("/", (req, resp)=>{
    console.log("serving index");
    resp.sendFile(__dirname + "/client/index.html");
});

app.use("/client", express.static(__dirname + "/client"));

var server = app.listen(config.port);
console.log("server started");

var bla = 1;
var interval = setInterval(()=>{
    console.log(bla);
    bla++;
}, 1000);



const Player = require("./server/game_objects/Player");
var GameObj = require("./server/Game");




var ACTIVE_SOCKETS = [];
var ACTIVE_PLAYERS = [];
var PLAYERS_PLAYING = [];
var GAMES = [];

const io = require("socket.io").listen(server);


io.sockets.on("connection", (socket)=>{

    





    console.log("new socket connectted: " + socket.id);
    ACTIVE_SOCKETS.push(socket);
    console.log("active sockets: ", ACTIVE_SOCKETS.length);





    //name login
    //check if name taken and login
    socket.on("login", (data)=>{
        console.log("trying to login with name: " + data.name);
        if(avalibleName(data.name)){
            ACTIVE_PLAYERS[socket.id] = new Player({name: data.name, id: socket.id });
            console.log("successful login");
            socket.emit("login-successful", {name: data.name});
        }else{
            console.log("login failed");
            socket.emit("login-failed", { message: "Name taken" });
        }
    })
    







    //disconnect
    //remove player and socket
    socket.on('disconnect', ()=>{
        console.log("user disconected: " + socket.id);
        removePlayer(socket);
        removeSocket(socket);
        console.log("remaining connected socects: ", ACTIVE_SOCKETS.length);
        io.emit('user-disconnected',{id: socket.id});
    });






    //chat
    
    socket.on("eval", (data)=>{
        console.log("eval: ", data);
        if(config.debug) socket.emit("chat-msg", { from: "admin", msg: "'" + eval(data) + "'"})
    });


    socket.on("chat-msg", (data)=>{
        io.emit("chat-msg", data);
    });






    //player settings
    socket.on("player-ready", (data)=>{
        console.log("player " + ACTIVE_PLAYERS[socket.id] + " ready: " + data.ready );
        ACTIVE_PLAYERS[socket.id].setReady(data.ready);
    });


    socket.on("lobby-init-players", ()=>{
        var packet = [];
        for(var i in ACTIVE_PLAYERS){
            packet.push({
                id: ACTIVE_PLAYERS[i].id,
                name:       ACTIVE_PLAYERS[i].name,
                ready:      ACTIVE_PLAYERS[i].ready,
                playing:    ACTIVE_PLAYERS[i].playing
            });
        }
        socket.emit("lobby-init-players", packet);
    });



    socket.on("start-game", ()=>{
        var Game = new GameObj();
        Game.setPlayers(ACTIVE_PLAYERS);
        for(var player of ACTIVE_PLAYERS) {
            player.setReady(true);
            PLAYERS_PLAYING.push(player);
        }
        ACTIVE_PLAYERS = [];
        Game.start();
        io.emit("start-game", ACTIVE_PLAYERS);
        GAMES.push(Game);
    });





   
});




var lobbyTick = 300;
setInterval(()=>{
    
    sendPlayerData();

}, lobbyTick);


function sendPlayerData(){
    //console.log(Date.now() + " sending data");
    var packet = [];
    
    for(var i in ACTIVE_PLAYERS){
        if(ACTIVE_PLAYERS[i].playing == false && ACTIVE_PLAYERS[i].updated == true){
            packet.push({
                id: ACTIVE_PLAYERS[i].id,
                name:       ACTIVE_PLAYERS[i].name,
                ready:      ACTIVE_PLAYERS[i].ready,
                playing:    ACTIVE_PLAYERS[i].playing
            });
            ACTIVE_PLAYERS[i].updated = false;
        }
    }
    
    if(config.log.LOOP_LOBBY && packet.lenght != 0) console.log(Date.now() + ": lobby packet sent", packet);
    if(packet.length != 0) io.emit("lobby-players-update", packet);
}


function avalibleName(name){
    for (let i in ACTIVE_PLAYERS) 
        if(ACTIVE_PLAYERS[i].name == name) return false;
    return true;
}


function removeSocket(socket){
    for (let i = 0; i < ACTIVE_SOCKETS.length; i++) {
        if(ACTIVE_SOCKETS[i] == socket){
            ACTIVE_SOCKETS.splice(i, 1);
            break;
        }
    }
}

function removePlayer(socket){
    delete ACTIVE_PLAYERS[socket.id];
}





