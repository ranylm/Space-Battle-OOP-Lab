//import { GameObject,Player ,Alien} from "./script";


// const game= new GameObject();
// game.createEnemies(6);
// game.battle();
const enemyContainer = document.querySelector('#enemy-container') as HTMLElement;
const controlPanel = document.querySelector('#control-panel') as HTMLElement;
  const startButton=document.querySelector('#start-button') as HTMLElement;
  const attackButton = document.querySelector('#attack-button') as HTMLElement;
  const retreatButton=document.querySelector('#retreat-button') as HTMLElement;
const combatPanel=document.querySelector('#combat-panel') as HTMLElement;
  const stats=document.querySelector('stats') as HTMLElement;
  const consoleUI=document.querySelector('console') as HTMLElement;
  


type State = "Initialize" | "Start" | "Attack" | "Targeting" | "Defeat" | "Victory";

class UIManager{
  state: State = 'Initialize';
  gameInstance: GameObject | null = null;
  updateUI(){
    
    console.log('updating UI',this.state);
    //Cheat
    if(this.gameInstance != null){
      this.gameInstance.player.hull = 100;
    }
    if((this.state === "Targeting" || this.state === "Attack") && this.gameInstance?.enemies.length === 0){
      this.state = "Victory";
    }
    if(this.gameInstance != null && this.gameInstance?.player.hull <= 0){
      this.state = "Defeat";
    }
    switch(this.state){
      case 'Initialize':
        console.log("[Initialize]")
        this.gameInstance = new GameObject();
        startButton.style.display='block';
        attackButton.style.display='none';
        retreatButton.style.display='none';
  
        combatPanel.style.display = 'none';
        this.state = "Start";
        //this.updateUI();
        break;
      case 'Start':
        console.log("[Start]")
        this.gameInstance?.createEnemies(6);
        startButton.style.display='none';
        attackButton.style.display='block';
        attackButton.classList.remove('button-disabled')
        retreatButton.style.display='block';
        break;
      case 'Attack':
        console.log("[Attack]");
        this.printToConsole(`${this.gameInstance?.player.name} ready for combat.`)
        controlPanel.classList.add('tiltUI');
        startButton.style.display = 'none';
        attackButton.style.display = 'none';
        retreatButton.style.display = 'none';

        combatPanel.style.display = 'flex';

        this.populateEnemyContainer(this.gameInstance?.enemies);
        this.state = "Targeting"
        break;
      case 'Targeting':
        console.log("[Targeting]");
        this.populateEnemyContainer(this.gameInstance?.enemies);
        break;
      case "Defeat":
        console.log("[Defeat]");
        break;
      case "Victory":
        console.log("[Victory]");
        this.populateEnemyContainer(this.gameInstance?.enemies);
        controlPanel.classList.remove('tiltUI');
        combatPanel.style.display='none';
        this.state="Start"
        this.updateUI();
        break;
      default:
        console.log(this.state)
        console.log("Unknown State")
        break;
    }
  }
  
  printToConsole(input:string){
    let ptag=document.createElement('p');
    ptag.textContent = input;
    consoleUI.prepend(ptag);
  }
  populateEnemyContainer(enemyArray: Alien[] | undefined){
    if(enemyArray === undefined){
      this.state="Victory";
      return;
    }
    enemyContainer.innerHTML='';
    for (let i = 0; i < enemyArray.length ; i++){
      const enemy = document.createElement('enemy');
      enemy.dataset.id= i ;
      //----------Event handler for attacking------------
      enemy.addEventListener('click',(e)=>{
        let id = (e.target as HTMLElement).dataset.id;
        //Attack a ship
        this.printToConsole(this.gameInstance?.player.attackShip(enemyArray[i]));
        if(enemyArray[i].hull <= 0){       
          enemyArray.splice(i, 1);
          console.log(enemyArray);
        }
        //Enemy Counter Attack if not wiped out
        if(enemyArray.length !== 0){
          for (const alien of enemyArray){
            this.printToConsole(alien.attackShip(this.gameInstance?.player))
          }
        }
        this.updateUI();
      })
      enemyContainer.appendChild(enemy);
    }
  }

  generateScenario(){

  }
}

const UI = new UIManager();
UI.updateUI();
console.log(UI)

startButton.addEventListener('click',UI.updateUI.bind(UI))
attackButton.addEventListener('click',()=>{
  if(UI.state == "Attack"){
    UI.printToConsole("Click Enemy to Attack");
  }
  UI.state='Attack';
  UI.updateUI();
})
