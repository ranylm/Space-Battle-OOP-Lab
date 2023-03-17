//Management
//export {GameObject,Player,Alien};

class GameObject{
player: Player = new Player(20,5,0.7);
enemies: Alien[] = [];
continue: boolean = true;

  createEnemies(num: number){
    for(let i =0 ; i < num ; i++){
      this.enemies.push(new Alien(`Alien Ship ${i}`));
    }
  }

  //Resolve a battle, return victor
  resolveRound(initiator:Ship, target: Ship){
    let turn = true;
    while(initiator.hull > 0 && target.hull > 0){
      console.log(initiator,target)
      turn ? initiator.attackShip(target) : target.attackShip(initiator)
      turn=!turn;
    }
    return initiator.hull > 0 ? initiator : target
  }

  battle(){
    //while there are enemies and not retreat
    while(this.enemies.length !== 0 && this.continue === true){
      //fight last enemy
      let winner = this.resolveRound(this.player, this.enemies[this.enemies.length - 1]);
      if(winner === this.player){
        console.log("player wins");
        this.enemies.pop();
        //Prompt to continue
        //this.continue = !window.confirm("Do you wish to retreat?")
      } else {
        console.log("player lose");
        break;
      }
    }
  }

  destroyShip(index:number){
    this.enemies.splice(index, 1);
  }
  //Handle rounds with 1vs Many w/ targetting
  resolveGroupBattle(){}
  GroupBattle(){}
}

//ship
class Ship{
  name: string;
  hull: number = 0;
  firepower: number = 0;
  accuracy: number = 0 ;
  constructor(hull:number , firepower:number, accuracy: number,name:string = "Alien Ship"){
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
    this.name = name;
  }

  attackShip(target: Ship){
    if (Math.random() < this.accuracy) {
      target.hull -= this.firepower;
      return `${this.name} hit the ${target.name} for ${this.firepower}!`
    }
    return `${this.name} has missed!`
  }

  getStatus(){
    return {hull:this.hull, firepower:this.firepower, accuracy:this.accuracy}
  }
}

//Player Ship
class Player extends Ship{
  missles:number = 0;
  constructor(...args : [number,number,number]){
    super(...args,"USS Assembley")
  }
  regenerateShields(amount: number){
    this.hull += amount;
  }
  loadMissiles(amount: number){
    this.missles += amount;
  }
}

//Alien Ship
class Alien extends Ship{
  constructor(name){
    let hull:number = 3 + Math.floor(Math.random() * 4);
    let firepower:number = 2 + Math.floor(Math.random() * 3);
    let accuracy:number = .6 + ( Math.random() * .2 );
    super(hull, firepower, accuracy,name);
  }
}

//combat instance
// const game = new GameObject();
// game.createEnemies(6);
// game.battle()
/*
function defendEarth(){
  const earthInvasion = new GameObject();
  game.createEnemies(Math.floor(Math.random() * 10));
  //battle
  earthInvasion.battle();
}
*/