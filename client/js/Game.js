
class Game {

    constructor(data){
        this.players =  data.players;
        this.enemies =  data.enemies;
        this.env =      data.env;


        //find me
        for(var p of this.players){
            if(p.id == socket.id) this.me = p;
        }
    }

    
    updatePlayers(data){
        for(var j in data){
            var tmp = new Player(data[j]);            
            for(var i in this.players){
                if(tmp.id == this.players[i].id) {
                    this.players[i].update(tmp);
                }
            }
        }
        
    }
    cleanUp(){
        this.cleanUpPlayers();
        this.cleanUpBullets();
    }
    cleanUpPlayers(){

    }


    cleanUpBullets(){


        for(var i in this.env.bullets){
            console.log("bullet: ",this.env.bullets[i].toDel);
            if(this.env.bullets[i].toDel){
                console.log("need to del");
                this.env.bullets.splice(i, 1);
            }
        }

            
                
    }

    updateBullets(bullets){
        for(var j in bullets){
            var tmp = new Bullet(bullets[j]);
            var found = false;
            for(var i in this.env.bullets){
                if(tmp.id == this.env.bullets[i].id){
                    this.env.bullets[i].update(tmp);
                    found = true;
                }
            }
            if(!found) this.env.bullets.push(tmp);
        }
    }


    draw(e, center){

        if(this.players)
            for(var i in this.players)
                this.players[i].draw(e, center);
        
        if(this.enemies)
            for(var i in this.enemies)
                this.enemies[i].draw(e, center);

        
        for(var i in this.env){
            if(this.env[i].length > 0)
                for(var j in this.env[i])
                    this.env[i][j].draw(e, center);
        }
    }
}