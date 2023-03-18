//import { GameObject,Player ,Alien} from "./script";


// const game= new GameObject();
// game.createEnemies(6);
// game.battle();
const bridgeWindow = document.querySelector('#bridge-window') as HTMLElement;
const enemyContainer = document.querySelector('#enemy-container') as HTMLElement;
const controlPanel = document.querySelector('#control-panel') as HTMLElement;
  const startButton=document.querySelector('#start-button') as HTMLElement;
  const attackButton = document.querySelector('#attack-button') as HTMLElement;
  const retreatButton=document.querySelector('#retreat-button') as HTMLElement;
const combatPanel=document.querySelector('#combat-panel') as HTMLElement;
  const stats = document.querySelector('stats') as HTMLElement;
    const hullInfo = document.querySelector('hull') as HTMLElement;
    const shieldInfo = document.querySelector('shields') as HTMLElement;
    //const missleInfo = document.querySelector('missle ') as HTMLElement;
    const scoredisplay = document.querySelector('score span') as HTMLElement;
  const consoleUI=document.querySelector('console') as HTMLElement;
const endscreen = document.querySelector('#end-screen') as HTMLElement;
const restartbutton = document.querySelector("#restart-prompt button") as HTMLElement;



type State = "Initialize" | "Start" | "Attack" | "Targeting" | "Defeat" | "Victory";

class UIManager{
  state: State = 'Initialize';
  gameInstance: GameObject | null = null;
  cheatsEnabled: boolean = false;
  updateUI(){
    
    console.log('updating UI',this.state);
    //Cheat
 
    if(this.gameInstance != null && this.cheatsEnabled === true){
      this.gameInstance.player.hull = 100;
      this.gameInstance.player.firepower = 100;
      this.gameInstance
    }
    //update sub UI
    this.updateStatsUI();

    //Universal Overrides That May Stall logic
    // if(this.gameInstance != null && (this.state === "Targeting" || this.state === "Attack") && this.gameInstance?.enemies.length === 0){
    //   this.state = "Victory";
    // }
    
    // if(this.gameInstance != null && this.gameInstance?.player.hull <= 0){
    //   this.state = "Defeat";
    // }
    switch(this.state){
      case 'Initialize':
        console.log("[Initialize]")
        this.gameInstance = new GameObject();
        bridgeWindow.classList.remove("bridge-shutdown");

        controlPanel.classList.remove("tiltUI");
        startButton.style.display='block';
        attackButton.style.display='none';
        retreatButton.style.display='none';
  
        combatPanel.style.display = 'none';

        endscreen.style.display = 'none';
        this.state = "Start";
        //this.updateUI();
        break;
      case 'Start':
        //Initialize a fight
        console.log("[Start]")
        //this.gameInstance?.createEnemies(1);
        this.gameInstance?.createEnemies(Math.floor(Math.random()* 4)+3);
        startButton.style.display='none';
        attackButton.style.display='block';
        attackButton.classList.remove('button-disabled');
        retreatButton.style.display='block';
        combatPanel.style.display = 'none';
        //Allow retreat but causes Defeat condition
        retreatButton.classList.remove('button-disabled');
        break;
      case 'Attack':
        console.log("[Attack]");
        this.printToConsole(`${this.gameInstance?.player.name} ready for combat.`)
        enemyContainer.style.display = "flex";
        retreatButton.classList.add('button-disabled');
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
      case "Victory":
        console.log("[Victory]");
        this.populateEnemyContainer(this.gameInstance?.enemies);
        controlPanel.classList.remove('tiltUI');
        combatPanel.style.display='none';
        this.state="Start"
        this.updateUI();
        break;
      case "Defeat":
          console.log("[Defeat]");
          //Lock out ability to attack
          enemyContainer.style.display='none';
          endscreen.style.display="flex";

          //bridgeWindow.classList.add("bridge-shutdown");
          //Allow a restart to initialize state
          //Use modal?
          //this.state="Initialize";
          break;
      default:
        console.log(this.state)
        console.log("Unknown State")
        break;
    }
  }
  
  printToConsole(input:string | undefined){
    if (input === undefined){
      input = '';
    }
    let ptag=document.createElement('p');
    ptag.textContent = input;
    consoleUI.prepend(ptag);
  }

  //Setup Targetable Enemies
  populateEnemyContainer(enemyArray: Alien[] | undefined){
    if(enemyArray === undefined || this.gameInstance === undefined){
      this.state="Victory";
      return;
    }
    enemyContainer.innerHTML='';
    for (let i:number = 0; i < enemyArray.length ; i++){
      const enemy = document.createElement('enemy');
      enemy.dataset.id= i.toString() ;
      //-------------Event handler for attacking------------------------------
      enemy.addEventListener('click',(e)=>{
        // if(this.state === 'Defeat'){
        //   return;
        // }
        let id = (e.target as HTMLElement).dataset.id;
        //Attack a ship
        this.printToConsole(this.gameInstance?.player.attackShip(enemyArray[i]));
        //target destroyed + points
        if(enemyArray[i].hull <= 0){       
          this.gameInstance?.destroyShip(i);
          console.log(enemyArray);
          this.gameInstance?.points += 500 ;
        }
        //Enemy Counter Attack if not wiped out
        if(enemyArray.length !== 0){
          for (const alien of enemyArray){
            this.printToConsole(alien.attackShip(this.gameInstance?.player!))
          }
        }
        //Set defeat or victory if applicable otherwise continue
        if(this.gameInstance?.player.hull! < 0) this.state = "Defeat";
        if(this.gameInstance?.enemies.length === 0) this.state = "Victory";
        this.gameInstance?.player.regenerateShields(1);
        this.updateUI();
      })
      enemyContainer.appendChild(enemy);
    }
  }

  updateStatsUI(){
    if(this.gameInstance?.player != undefined){
      const status = this.gameInstance.player.getStatus();
      console.log(status);
      hullInfo.style.height = ((status.hull / status.maxHull)*100).toFixed(0) + '%';
      shieldInfo.style.height = ((status.shields / status.maxShields)*100).toFixed(0) + '%';
      scoredisplay.innerText=this.gameInstance.points.toFixed(0);
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

retreatButton.addEventListener('click',()=>{
  UI.state = 'Defeat';
  UI.updateUI();
})

restartbutton.addEventListener('click',()=>{
  UI.state = "Initialize";
  UI.updateUI();
})



