const Bullet = require("./Bullet");

class Player{

    constructor(data){
        this.id =           data.id;
        this.name =         data.name;

        this.updated =      true;


        this.ready =        false;
        this.playing =      false;

        this.x =            0;
        this.y =            0;

        this.ableToShoot =  true;
        this.baseShootDc =  15;
        this.shootCd =      20; 
        this.sight =        300;

        this.maxHp =        100;
        this.maxMana =      100;
        this.maxStamina =   100;
        this.hp =           this.maxHp;
        this.stamina =      this.maxStamina;
        this.mana =         this.maxMana;
        this.speed =        4;


        this.key = {
            up:     false,
            down:   false,
            left:   false,
            right:  false
        }
    }


    setReady(boolean){
        this.ready = boolean;
        this.updated = true;
    }
    setPlaying(boolean){
        this.ready = boolean;
        this.updated = true;
    }


    update(){



        if(!this.ableToShoot) {
            if(this.shootCd > 0) this.shootCd--;
            else{
                this.shootCd = this.baseShootDc;
                this.updated = true;
                this.ableToShoot = true;
            }
            console.log("cd: "  + this.shootCd);
        }
        


        if(this.key.up) {
            this.y -= this.speed;
            this.updated = true;
        }
        if(this.key.down) {
            this.y += this.speed;
            this.updated = true;
        }
        if(this.key.left) {
            this.x -= this.speed;
            this.updated = true;
        }
        if(this.key.right) {
            this.x += this.speed;
            this.updated = true;
        }

    }
    
    shoot(type, x, y){
        this.ableToShoot = false;
        this.updated = true;
        this.shootCd = this.baseShootDc;
        return new Bullet(type, x, y, this);
    }



}
module.exports = Player;