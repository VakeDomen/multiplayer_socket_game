const Enemy = require("./Enemy");


class Villager extends Enemy {

    constructor(x, y){
        super({
            x:              x,
            y:              y,
            dmg:            5,
            speed:          2,
            maxHp:          20,
            baseAttackCd:   20,
            range:          20
        });
    }


}

module.exports = Villager;