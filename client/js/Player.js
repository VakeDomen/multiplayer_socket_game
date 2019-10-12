class Player {

    constructor(data){
        this.id =           data.id;
        this.name =         data.name;
        
        this.x =            data.x;
        this.y =            data.y;
        this.sight =        data.sight;

        
        this.maxHp =        data.maxHp;
        this.maxMana =      data.maxMana;
        this.maxStamina =   data.maxStamina;
        this.hp =           data.hp;
        this.mana =         data.mana;
        this.stamina =      data.stamina;

        this.ableToShoot =  data.ableToShoot;

        this.key =          data.key;



        this.ignore =       ["walk", "updated", "res", "init", "width", "height"];
        
        this.walk = 0;
        this.updated =      false;
        this.res =          {};
        this.init =         false;

        this.width =        innerWidth / 20;
        this.height =       innerHeight / 10;
    }




    update(p){
        for(let data in p)
            if(!this.ignore.includes(data)) this[data] = p[data];
        this.updated = true;
    }

    draw(e, center){

        
        //init
        if(!this.init){
            this.init = true;
            this.initSprites();
        }

        //display controlled player
        this.updated = false;
        if(this.id == socket.id){
            
            //draw player
            e.drawImage(
                this.getWalkImage(), 
                e.canvas.width/2 - this.width/2, 
                e.canvas.height/2 - this.height, 
                this.width, 
                this.height
            );


        //display other players
        }else{
            e.drawImage(
                this.getWalkImage(), 
                //e.canvas.width/2 + (this.y - center.x) - this.width/2, 
                //e.canvas.height/2 + (this.y - center.y) - this.height, 
                e.canvas.width/2 + (this.x - center.x) - this.width/2, 
                e.canvas.height/2 + (this.y - center.y) - this.height,
                this.width, 
                this.height
            );
        }

        this.drawHeadsUpDisplay(e);
        
        
    }

    drawWalkAnimation(e, center){
        e.drawImage(this.getWalkImage(), e.canvas.width/2 - this.width/2, e.canvas.height/2 - this.height, this.width, this.height);        
    }

    getWalkImage(){
        if(this.key.up || this.key.down || this.key.left || this.key.right) this.walk++;
        this.walk = this.walk % 10;
        return this.res.walk[this.direction()][this.walk];
    }

    direction(){
        if(this.key.up && this.key.left) return "lu";
        if(this.key.up && this.key.right) return "lu";
        if(this.key.up) return "u";
        if(this.key.down && this.key.left) return "dl";
        if(this.key.down && this.key.right) return "dr";
        if(this.key.down) return "d";
        if(this.key.left) return "l";
        if(this.key.right) return "r";
        return "d"; 
    }

    drawHeadsUpDisplay(e){
        //hp bar
        e.beginPath();
        e.rect(
            this.res.hpBar.x, 
            this.res.hpBar.y, 
            this.res.hpBar.width, 
            this.res.hpBar.height
        );
        e.stroke();

        e.beginPath();
        e.rect(
            this.res.hpBar.x, 
            this.res.hpBar.y, 
            (this.hp/this.maxHp) * this.res.hpBar.width, 
            this.res.hpBar.height
        );
        e.fillStyle = "#9b0d15";
        e.fill();

        //mana bar
        e.beginPath();
        e.rect(
            this.res.manaBar.x, 
            this.res.manaBar.y, 
            this.res.manaBar.width, 
            this.res.manaBar.height
        );
        e.stroke();

        e.beginPath();
        e.rect(
            this.res.manaBar.x, 
            this.res.manaBar.y, 
            (this.mana/this.maxMana) * this.res.manaBar.width, 
            this.res.manaBar.height);
        e.fillStyle = "#1357a0";
        e.fill();

        //stamina
        e.beginPath();
        e.rect(
            this.res.staminaBar.x, 
            this.res.staminaBar.y, 
            this.res.staminaBar.width,
            this.res.staminaBar.height
        );
        e.stroke();

        e.beginPath();
        e.rect(
            this.res.staminaBar.x, 
            this.res.staminaBar.y, 
            (this.stamina/this.maxStamina) * this.res.staminaBar.width, 
            this.res.staminaBar.height
        );
        e.fillStyle = "#1c7040";
        e.fill();
        //hp icon
        e.drawImage(
            this.res.hp.img, 
            this.res.hp.x,
            this.res.hp.y, 
            this.res.hp.width, 
            this.res.hp.height
        );
        e.drawImage(
            this.res.mana.img, 
            this.res.mana.x, 
            this.res.mana.y, 
            this.res.mana.width, 
            this.res.mana.height
        );
        e.drawImage(
            this.res.stamina.img, 
            this.res.stamina.x, 
            this.res.stamina.y, 
            this.res.stamina.width, 
            this.res.stamina.height
        );
        e.fillStyle = "black";
    }





    initSprites(){

        //hp icon
        this.res.hp = {
            img: new Image(),
            x: e.canvas.width / 70,
            y: e.canvas.height / 30,
            width: e.canvas.width / 30,
            height: e.canvas.width / 30
        };
        this.res.hp.img.src =  "/client/img/hp-icon.png";
        

        //hp bar
        this.res.hpBar = {
            x: e.canvas.width / 70 * 2,
            y: e.canvas.height / 30 * 1.4,
            width: e.canvas.width / 4,
            height: e.canvas.width / 60
        }
    
    
        this.res.mana = {
            img: new Image(),
            x: (e.canvas.width / 70) * 21,
            y: e.canvas.height / 30,
            width: e.canvas.width / 30,
            height: e.canvas.width / 30
        };
        this.res.mana.img.src =  "/client/img/mana-icon.png";
        

        //hp bar
        this.res.manaBar = {
            x: e.canvas.width / 70 * 22,
            y: e.canvas.height / 30 * 1.4,
            width: e.canvas.width / 4,
            height: e.canvas.width / 60
        }

        this.res.stamina = {
            img: new Image(),
            x: e.canvas.width / 70 * 42,
            y: e.canvas.height / 30,
            width: e.canvas.width / 30,
            height: e.canvas.width / 30
        };
        this.res.stamina.img.src =  "/client/img/stamina-icon.png";
        

        //hp bar
        this.res.staminaBar = {
            x: e.canvas.width / 70 * 43,
            y: e.canvas.height / 30 * 1.4,
            width: e.canvas.width / 4,
            height: e.canvas.width / 60
        }
    
    
        this.res.walk = {
            u:  [],
            lu: [],
            l:  [],
            dl: [],
            d:  [],
            dr: [],
            r:  [],
            ur: []
        };
        var moveTypes = ["u", "lu", "l", "dl", "d", "dr", "r", "ur"];

        for(var type of moveTypes){
            for(var i = 0 ; i < 10 ; i++){
                var img = new Image();
                if(type == "dr") img.src = "/client/img/player/walk/" + "lu" + i + ".png";
                else if(type == "r") img.src = "/client/img/player/walk/" + "l" + i + ".png";
                else if(type == "ur") img.src = "/client/img/player/walk/" + "dl" + i + ".png";
                else img.src = "/client/img/player/walk/" + type + i + ".png";

                this.res.walk[type][i] = img;
            }
        }
        
    
    }
}