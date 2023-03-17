"use strict";
//import { GameObject,Player ,Alien} from "./script";
// const game= new GameObject();
// game.createEnemies(6);
// game.battle();
const enemyContainer = document.querySelector('#enemy-container');
const controlPanel = document.querySelector('#control-panel');
const startButton = document.querySelector('#start-button');
const attackButton = document.querySelector('#attack-button');
const retreatButton = document.querySelector('#retreat-button');
const combatPanel = document.querySelector('#combat-panel');
const stats = document.querySelector('stats');
const consoleUI = document.querySelector('console');
class UIManager {
    constructor() {
        this.state = 'Initialize';
        this.gameInstance = null;
    }
    updateUI() {
        var _a, _b, _c, _d, _e, _f, _g;
        console.log('updating UI', this.state);
        //Cheat
        if (this.gameInstance != null) {
            this.gameInstance.player.hull = 100;
        }
        if ((this.state === "Targeting" || this.state === "Attack") && ((_a = this.gameInstance) === null || _a === void 0 ? void 0 : _a.enemies.length) === 0) {
            this.state = "Victory";
        }
        if (this.gameInstance != null && ((_b = this.gameInstance) === null || _b === void 0 ? void 0 : _b.player.hull) <= 0) {
            this.state = "Defeat";
        }
        switch (this.state) {
            case 'Initialize':
                console.log("[Initialize]");
                this.gameInstance = new GameObject();
                startButton.style.display = 'block';
                attackButton.style.display = 'none';
                retreatButton.style.display = 'none';
                combatPanel.style.display = 'none';
                this.state = "Start";
                //this.updateUI();
                break;
            case 'Start':
                console.log("[Start]");
                (_c = this.gameInstance) === null || _c === void 0 ? void 0 : _c.createEnemies(6);
                startButton.style.display = 'none';
                attackButton.style.display = 'block';
                attackButton.classList.remove('button-disabled');
                retreatButton.style.display = 'block';
                break;
            case 'Attack':
                console.log("[Attack]");
                this.printToConsole(`${(_d = this.gameInstance) === null || _d === void 0 ? void 0 : _d.player.name} ready for combat.`);
                controlPanel.classList.add('tiltUI');
                startButton.style.display = 'none';
                attackButton.style.display = 'none';
                retreatButton.style.display = 'none';
                combatPanel.style.display = 'flex';
                this.populateEnemyContainer((_e = this.gameInstance) === null || _e === void 0 ? void 0 : _e.enemies);
                this.state = "Targeting";
                break;
            case 'Targeting':
                console.log("[Targeting]");
                this.populateEnemyContainer((_f = this.gameInstance) === null || _f === void 0 ? void 0 : _f.enemies);
                break;
            case "Defeat":
                console.log("[Defeat]");
                break;
            case "Victory":
                console.log("[Victory]");
                this.populateEnemyContainer((_g = this.gameInstance) === null || _g === void 0 ? void 0 : _g.enemies);
                controlPanel.classList.remove('tiltUI');
                combatPanel.style.display = 'none';
                this.state = "Start";
                this.updateUI();
                break;
            default:
                console.log(this.state);
                console.log("Unknown State");
                break;
        }
    }
    printToConsole(input) {
        let ptag = document.createElement('p');
        ptag.textContent = input;
        consoleUI.prepend(ptag);
    }
    populateEnemyContainer(enemyArray) {
        if (enemyArray === undefined) {
            this.state = "Victory";
            return;
        }
        enemyContainer.innerHTML = '';
        for (let i = 0; i < enemyArray.length; i++) {
            const enemy = document.createElement('enemy');
            enemy.dataset.id = i;
            //----------Event handler for attacking------------
            enemy.addEventListener('click', (e) => {
                var _a, _b;
                let id = e.target.dataset.id;
                //Attack a ship
                this.printToConsole((_a = this.gameInstance) === null || _a === void 0 ? void 0 : _a.player.attackShip(enemyArray[i]));
                if (enemyArray[i].hull <= 0) {
                    this.gameInstance.enemies(i)
                    console.log(enemyArray);
                }
                //Enemy Counter Attack if not wiped out
                if (enemyArray.length !== 0) {
                    for (const alien of enemyArray) {
                        this.printToConsole(alien.attackShip((_b = this.gameInstance) === null || _b === void 0 ? void 0 : _b.player));
                    }
                }
                this.updateUI();
            });
            enemyContainer.appendChild(enemy);
        }
    }
    generateScenario() {
    }
}
const UI = new UIManager();
UI.updateUI();
console.log(UI);
startButton.addEventListener('click', UI.updateUI.bind(UI));
attackButton.addEventListener('click', () => {
    if (UI.state == "Attack") {
        UI.printToConsole("Click Enemy to Attack");
    }
    UI.state = 'Attack';
    UI.updateUI();
});
