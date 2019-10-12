const express = require("express");
const app = express();
const config = require("./config");
const http = require("http");
const socketIo = require("socket.io");
const Player = require("./server/game_objects/Player");
var GameObj = require("./server/Game");


const server = http.createServer(app);
const io = socketIo(server);




app.get("/", (req, resp)=>{
    resp.sendFile(__dirname + "/client/index.html");
});

app.use("/client", express.static(__dirname + "/client"));


console.log("server started");








var ACTIVE_SOCKETS = [];
var ACTIVE_PLAYERS = [];
var PLAYERS_PLAYING = [];
var GAMES = [];

//var server = app.listen(config.port);

try {
        
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
                    id:         ACTIVE_PLAYERS[i].id,
                    name:       ACTIVE_PLAYERS[i].name,
                    ready:      ACTIVE_PLAYERS[i].ready,
                    playing:    ACTIVE_PLAYERS[i].playing
                });
            }
            socket.emit("lobby-init-players", packet);
        });



        socket.on("start-game", ()=>{

            var id = Math.floor(Math.random() * 1000000);
            var room = io.of(id);

            for(var i in ACTIVE_SOCKETS){
                ACTIVE_SOCKETS[i].join(id);
            }



            var game = new GameObj(io, id);
            
            playersToGame(game);
            GAMES[id] = game;
            game.start();

            var packet = {
                players:    normalizeArray(game.players),
                enemies:    game.enemies,
                env:        game.env
            }
            io.emit("joined-room", {room: id})
            
            io.emit("start-game", JSON.stringify(packet));
            
        });





        //controls

        socket.on("keypress", (data)=>{
            if(data.type == "up") PLAYERS_PLAYING[socket.id].key.up = data.state;
            else if(data.type == "down") PLAYERS_PLAYING[socket.id].key.down = data.state;
            else if(data.type == "left") PLAYERS_PLAYING[socket.id].key.left = data.state;
            else if(data.type == "right") PLAYERS_PLAYING[socket.id].key.right = data.state;
            PLAYERS_PLAYING[socket.id].updated = true;
        });

        socket.on("shoot", (data)=>{
            console.log("shoot");
            GAMES[data.id].playerShoot(socket.id, data);
        });



    
    });

    
} catch (error) {
    console.log(error);    
}



var lobbyTick = 1000;
setInterval(()=>{
    try{
        sendPlayerData();
    }catch(e){
        console.log(e);
    }
    

}, lobbyTick);

function normalizeArray(array){
    var a = [];
    for(var obj in array) a.push(array[obj]);
    return a;
}
function sendPlayerData(){
    //console.log(Date.now() + " sending data");
    var packet = [];
    
    for(var i in ACTIVE_PLAYERS){
        if(ACTIVE_PLAYERS[i].updated == true){
            packet.push({
                id:         ACTIVE_PLAYERS[i].id,
                name:       ACTIVE_PLAYERS[i].name,
                ready:      ACTIVE_PLAYERS[i].ready,
                playing:    ACTIVE_PLAYERS[i].playing
            });
            ACTIVE_PLAYERS[i].updated = false;
        }
    }
    
    
    if(packet.length != 0){
        io.emit("lobby-players-update", packet);
        if(config.log.LOOP_LOBBY) 
            console.log(Date.now() + ": lobby packet sent", packet);
    }
}


function avalibleName(name){
    for (let i in ACTIVE_PLAYERS) 
        if(ACTIVE_PLAYERS[i].name == name) return false;
    return true;
}

function playersToGame(game){
    game.players = ACTIVE_PLAYERS;
    for(var i in ACTIVE_PLAYERS){
        PLAYERS_PLAYING[i] = ACTIVE_PLAYERS[i];
    }
    ACTIVE_PLAYERS = [];
    return;
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
    delete PLAYERS_PLAYING[socket.id];
}



server.listen(config.port);


