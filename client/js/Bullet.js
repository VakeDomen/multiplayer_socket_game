class Bullet {
    
    constructor(data){
        this.id =       data.id;
        this.type =     data.type;
        this.x =        data.x;
        this.y =        data.y;
        this.toDel =    data.toDel;

        this.ignore =   ["type", "id", "img", "updated"];
        this.updated =  false;
        
        this.initImg();
    }


    update(b){
        for(let data in b)
            if(!this.ignore.includes(data))
                this[data] = b[data];
        this.updated = true;
    }


    draw(e, center){

        

        e.beginPath();
        e.drawImage(
            this.img,
            e.canvas.width/2 + (this.x - center.x) - 5, 
            e.canvas.height/2 + (this.y - center.y) - 5,
            11,
            11
        );
        e.fill();
    }



    initImg(){
        this.img = new Image();
        this.img.src =  "/client/img/bullet-icon.png";
        
    }
}