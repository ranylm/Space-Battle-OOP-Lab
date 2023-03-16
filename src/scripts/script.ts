console.log('test')

//Management
class GameObject{

}

//ship
class Ship{
  hull: number = 0;
  firepower: number = 0;
  accuracy: number = 0 ;
  constructor(hull:number , firepower:number, accuracy: number){
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }

  attackShip(target: Ship){
    if (Math.random() < this.accuracy) {
      target.hull -= this.firepower;
    }
  }
}

//Player Ship
class Player extends Ship{
  constructor(...args : [number,number,number]){
    super(...args)
  }
}

//Alien Ship
class Alien extends Ship{
  constructor(){
    let hull:number = 3 + Math.floor(Math.random() * 4);
    let firepower:number = 2 + Math.floor(Math.random() * 3);
    let accuracy:number = .6 + ( Math.random() * .2 );
    super(hull, firepower, accuracy);
  }
}