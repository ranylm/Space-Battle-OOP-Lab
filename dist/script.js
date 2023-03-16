"use strict";
console.log('test');
//Management
class GameObject {
}
//ship
class Ship {
    constructor(hull, firepower, accuracy) {
        this.hull = 0;
        this.firepower = 0;
        this.accuracy = 0;
        this.hull = hull;
        this.firepower = firepower;
        this.accuracy = accuracy;
    }
    attackShip(target) {
        if (Math.random() < this.accuracy) {
            target.hull -= this.firepower;
        }
    }
}
//Player Ship
class Player extends Ship {
    constructor(...args) {
        super(...args);
    }
}
//Alien Ship
class Alien extends Ship {
    constructor() {
        let hull = 3 + Math.floor(Math.random() * 4);
        let firepower = 2 + Math.floor(Math.random() * 3);
        let accuracy = .6 + (Math.random() * .2);
        super(hull, firepower, accuracy);
    }
}
