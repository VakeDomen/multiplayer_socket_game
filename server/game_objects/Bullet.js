class Bullet {

    constructor(type, vx, vy, owner){
        this.id =           Math.floor(Math.random() * 10000000);
        this.type =         type;
        this.x =            owner.x;
        this.y =            owner.y - 50; //-50 due to shootinh from hip, not from legs :)
        this.owner =        owner;
        this.dmg =          10;
        this.speed =        40  ;
        this.range =        500;

        var mult = this.speed / Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
        
        this.vx =           vx * mult;
        this.vy =           vy * mult;
        this.updated =      true;

        this.toDel =        false;
    }


    update(){
        this.x += this.vx;
        this.y += this.vy;
        this.range -= this.speed;
        if(this.range < 0 ) 
            this.toDel = true;
        this.updated = true;
    }


    buildPacket(){
        return {
            id:     this.env.bullets[i].id,
            type:   this.env.bullets[i].type,
            x:      this.env.bullets[i].x,
            y:      this.env.bullets[i].y,
            toDel:  this.env.bullets[i].toDel
        }
    }
}
module.exports = Bullet;