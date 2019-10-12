class Enemy {

    constructor(data){
        this.y =                data.y;
        this.x =                data.x;
        this.maxHp =            data.maxHp;
        this.hp =               data.maxHp;
        this.dmg =              data.dmg;
        this.speed =            data.speed;
        this.updated =          false;
        this.baseAttackCd =     data.baseAttackCd;
        this.attackCd =         data.baseAttackCd;
        this.range =            data.range;
        this.target =           null;
        this.toDel =            false;
        
    }




    update(){

        if(!this.target) this.findTarget();

        if(this.attackCd != this.baseAttackCd) {
            if(this.attackCd > 0) this.attackCd--;
            else{
                this.attackCd = this.baseAttackCd;
                this.updated = true;
            }
        }else{
            if(this.targetInRange()){
                this.attackTarget();
            }
        }
        

        if(this.target){
            if(this.x > this.target.x){
                this.x -= this.speed;
                this.updated = true;
            }
            if(this.x < this.target.x){
                this.x += this.speed;
                this.updated = true;
            }
            if(this.y > this.target.y){
                this.y -= this.speed;
                this.updated = true;
            }
            if(this.y < this.target.y){
                this.y += this.speed;
                this.updated = true;
            }
        }

    }


    attackTarget(){
        this.target.hp -= this.dmg;
        //starts cd countdown
        this.attackCd -= 1;
    }

    targetInRange(){
        if(this.target)
            if(Math.abs(this.x - this.target.x) < this.range && Math.abs(this.y - this.target.y) < this.range) 
                return true;
        return false;
    }

    findTarget(playerList){
        //random player
        var keys = Object.keys(playerList);
        this.target = playerList[keys[Math.floor(keys.length * Math.random())]];
    }

    buildPacket(){
        return {
            id:     this.env.enemies[i].id,
            type:   this.env.enemies[i].type,
            x:      this.env.enemies[i].x,
            y:      this.env.enemies[i].y,
            maxHp:  this.env.enemies[i].maxHp,
            hp:     this.env.enemies[i].hp,
            toDel:  this.env.enemies[i].toDel
        }
    }
}
module.exports = Enemy;