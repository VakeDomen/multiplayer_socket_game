const config = require("../config");
const Villager  = require("./game_objects/enemies/Enemy");

class Game{

    constructor(io, id){
        this.io = io;
        this.id = id;
        this.players = [];
        this.enemies = [];
        this.env = {
            bullets: []
        };
        this.running = false;


        this.enemy_cap = 1;
        this.spawnEnemy = 1;

    }





    start(){
        if(this.playersReady()){
            this.running = true;
            for(var player of this.players){
                player.ready = false;
                player.playing = true;
            }
        }
        this.gameLoop();
        
    }
    stop(){
        this.running = false;
    }

    setPlayers(players){
        this.players = players;
    }

    playersReady(){
        for(var player of this.players)
            if(player.ready == false) return false;
        return true;
    }



    playerPacket(){
        var packet = [];
        for(var i in this.players){
            if(this.players[i].updated){
                this.players[i].updated = false;
                packet.push({
                    id:         this.players[i].id,
                    x:          this.players[i].x,
                    y:          this.players[i].y,
                    ableToShoot:this.players[i].ableToShoot,
                    sight:      this.players[i].sight,
                    maxHp:      this.players[i].maxHp,
                    maxMana:    this.players[i].maxMana,
                    maxStamina: this.players[i].maxStamina,
                    hp:         this.players[i].hp,
                    mana:       this.players[i].mana,
                    stamina:    this.players[i].stamina,
                    key:        this.players[i].key
                });
            }
            
        }
        return packet;
    }


    playerShoot(id, data){
        this.env.bullets.push(this.players[id].shoot(1, data.x, data.y));
    }

    gameLoop(){
        var interval = setInterval(() => {
            
            this.clean();
            //---------------------------updates-----------------------------
            
            
            this.updateEnemies();
            this.updateEnviorment();
            this.updatePlayers();
            
            //this.spawn();



            //-------------------construct and send packets -------------------

            var packet = this.playerPacket();
            if(packet.length != 0) this.io.to(this.id).emit("game-player-update", packet);

            packet = this.enviormentPacket();
            if(!objectEmpty(packet)) this.io.to(this.id).emit("game-env-update", packet);

            packet = this.enemiesPacket();
            if(packet.length != 0 ) this.io.to(this.id).emit("game-enemy-update", packet);


        }, 40);
    }



    clean(){
        for(var i in this.env.bullets)
            if(this.env.bullets[i].toDel)
                delete this.env.bullets[i];
        for(var i in this.enemies)
            if(this.enemies[i].toDel)
                delete this.enemies[i];
    }


    updateEnemies(){
        for(var i in this.enemies)
            this.enemies[i].update();
    }
    updateEnviorment(){
        for(var i in this.env.bullets)
            this.env.bullets[i].update();
                
            
    }
    updatePlayers(){
        for(var i in  this.players)
            this.players[i].update();       
    }

    enviormentPacket(){
        var packet = {
            bullets: []
        };
        for(var i in this.env.bullets)
            if(this.env.bullets[i].updated) 
                packet.bullets.push(this.env.bullets[i].buildPacket());
        return packet;
    }

    enemiesPacket(){
        var packet = [];
        for(var i in this.enemies)
            if(this.enemies[i].updated) 
                packet.push(this.enemies[i].buildPacket());

        console.log("enemy packet", packet);
        return packet;
    }


    spawn(){
        if(this.enemies.length < this.enemy_cap){
            this.enemies.push(this.generateEnemy());
        }
    }

    generateEnemy(){
        return new Villager(this.players[0] + 300, this.players[0] + 300);
    }


}


function objectEmpty(obj){
    for(var data in obj){
        if(typeof obj[data] !== "undefined" && obj[data].length != 0) return false;
    }
    return true;
}

module.exports = Game;  