const el = {
  app: document.querySelector('.app'),
  // UI elements
  controls: {
    selector: document.querySelector('.selector'),
    options: document.querySelector('.options')
  },

  // UI info elements
  hp: document.querySelector('.health'),
  suspicion: document.querySelector('.suspicion'),
  location: document.querySelector('.location'),
  money: document.querySelector('.money'),
  time: document.querySelector('.time'),
  text: document.querySelector('.text')
}

let session;

// game session
function loadGame() {
  session = unpack(path.join(dir.saves, config.session));
  if(session.gameOver) gameOver()
}

let components = {
  paused: false,
  selector: {
    position: 0,
    highlighted: null
  },
  gameOver: false
}
loadGame();


let game = {
  location: {
    safehouse: {
      text: "You're in your safehouse. Controls: use [Arrow Keys] to select an option and [Enter] to confirm your selection.",
      options: {
        goToJoint: {
          name: 'Go to your restaurant',
          action: 'cLocation("joint")'
        },
        eat: {
          name: 'Eat from the fridge',
          action: 'eat("safehouse")',
          hideUponUse: true,
          value: 1,
          cost: 0
        },
        goToWarehouse: {
          name: 'Go to your warehouse',
          action: 'cSusLocation("warehouse", 50)'
        },
        sleep: {
          name: 'Sleep',
          action: 'sleep(6)'
        }
      }
    },


    joint: {
      text: "You're at Los Pollos Hermanos. What would you like to do?",
      options: {
        collectProfits: {
          name: "Collect profits",
          action: "collectProfits(this.id, 'joint', 500)"
        },
        returnHome: {
          name: 'Go to safehouse',
          action: 'cLocation("safehouse")'
        },
        enterOffice: {
          name: 'Enter office',
          action: 'cLocation("office")'
        },
        eat: {
          name: 'Order food',
          action: 'eat("joint")',
          cost: 1,
          value: 3,
          hideUponUse: true
        }
      }
    },

    office: {
      text: "You're in your office. What would you like to do?",
      options: {
        openComputer: {
          name: 'Open your laptop',
          action: 'cLocation("desk")'
        },
        exit: {
          name: 'Exit office',
          action: 'cLocation("joint")'
        },
        goToSafehouse: {
          name: 'Go to safehouse',
          action: 'cLocation("safehouse")'
        }
      }
    },


    desk: {
      text: "You're on your desk. You open your laptop. The following missions are available",
      options: {
        goToMethOperation: {
          name: 'Drive to meth operation',
          action: 'cSusLocation("warehouse", 50)'
        },
        closeLaptop: {
          name: 'Close laptop',
          action: 'cLocation("office")'
        },
        goToPolice: {
          name: 'Drive to the police precinct',
          action: 'cLocation("police")'
        }


      }
    },
    warehouse: {
      text: "You're in your warehouse. You go to the basement where the meth operations are taking place.",
      closeTime: [23, 8],
      textClosed: "You drive to your warehouse. A chill feeling runs down your spine.",
      options: {
        collectProfits: {
          name: 'Collect profits',
          action: 'collectMethProfits(this.id, "warehouse", 40000)'
        },
        goToJoint: {
          name: 'Go to your joint',
          hideWhenClosed: true,
          action: 'cLocation("joint")'
        },
        goToSafehouse: {
          name: 'Go to safehouse',
          hideWhenClosed: true,
          action: 'cLocation("safehouse")'
        },
        goToMethOffice: {
          name: 'Go to office',
          action: 'cActionLocation("meth_office")'
        },
      }
    },
    meth_office: {
      text: "You enter your office. You open your laptop.",
      closeTime: [23, 8],
      textClosed: "You rush into your office. You hear the scraping of a footstep on your door.",
      options: {
        closeLaptop: {
          name: 'Close laptop',
          action: 'cSusLocation("warehouse", 50)',
          hideWhenClosed: true
        },
        goToPolice: {
          name: 'Drive to the police precinct',
          action: 'cLocation("police")',
          hideWhenClosed: true
        },
      },
      closedOptions: {
        closeLaptop: {
          name: 'Leave the office',
          action: 'cSusLocation("warehouse", 50); wareHouseDeath()',
        },
        barricade: {
          name: 'Barricade the door and wait',
          action: 'barricadeWarehouseOffice()'
        },
        callForHelp: {
          name: 'Dial 911',
          action: 'dial911WarehouseOffice()'
        },
        sneakOutside: {
          name: 'Sneak outside',
          action: 'sneakOutsideWarehouse()'

        },
      }
    },

    police: {
      text: "You enter the police precinct. They seem to be running a charity by an agent.",
      textClosed: "You arrive at the precinct. You knock the door but no one is answering.",
      closeTime: [ 20, 6 ],
      options: {
        donate: {
          name: 'Donate to charity',
          action: 'donate("police", "donate")',
          hideUponUse: true,
          hideWhenClosed: true,
          cost: 1000,
        },
        goToJoint: {
          name: 'Go to your joint',
          action: 'cLocation("joint")'
        },
        goToSafehouse: {
          name: 'Go to safehouse',
          action: 'cLocation("safehouse")'
        },
        goToMethOffice: {
          name: 'Go to warehouse',
          action: 'cSusLocation("warehouse", 50)'
        },
      }
    },
    outside_warehouse: {
      text: "You sneak out from the back door. Somehow they still haven't made it there. You take out the assassins with your supressed pistol and dispose their bodies.",
      textClosed: this.text,
      options: {
        goHome: {
          name: 'Go to safehouse',
          action: 'cLocation("safehouse")'
        },
        goToJoint: {
          name: 'Go to your joint',
          action: 'cLocation("joint")'
        },

      }
    }







  }
}
function sleep(hours) {
  session.time.time.hour += 6
}
function barricadeWarehouseOffice() {
  let office = game.location.meth_office;
  office.textClosed = "You barricade the door and sit silently, a sudden burst of bullets pierce through the door and barricade hitting a gas canister. A sudden explosion proceeds";
  office.text = office.textClosed;
  office.closedOptions = {};
  setTimeout(()=> { session.player.health = 0; saveSession(); }, 5000);
}
function dial911WarehouseOffice() {
  let office = game.location.meth_office;
  office.textClosed = "You dial 911 and rat everyone out including yourself. The police arrive and arrest everyone on the scene.";
  office.text = office.textClosed;
  setTimeout(()=> {
    session.player.suspicion = 10;
    session.gameOver = true;
    gameOver();
  }, 1000);
}
function sneakOutsideWarehouse() {
  session.player.suspicion += Math.round(Math.random() * 2);
  cLocation("outside_warehouse");
}
function donate(location, option) {
  let ob = game.location[location];
  let op = ob.options[option];
  // subtract if you have money
  if(session.player.money >= op.cost) {
    session.player.money -= op.cost;
    ob.text = ob.text.replace(' They seem to be running a charity by one of the agents.', '');
    session.player.suspicion = clamp(session.player.suspicion - 2, 0, 10);
    session.police.binoculars = clamp(session.police.binoculars - 1, 0, 3);
    // hide if required
    op.hidden = op.hideUponUse;
  }
  saveSession();
}
function cActionLocation(location, randomChance) {
  let office = game.location.meth_office;
  if(Math.round(Math.random() * 100 <= randomChance) && !checkClosed(game.location.warehouse)) {
    office.text += ' Suddenly, you hear a burst of gun fire outside.';
    office.options.runOutside = {
      name: 'Run outside',
      action: 'actionOutside()',
      hideWhenClosed: true
    }
  }
  cLocation("meth_office");
}
let binoculars = [
  'The binoculars are a little blurry so the officers cannot see identifying features, but your basic features are noted.',
  'They got better binoculars. They noted your identifying features.',
  'They took a photo of you walking out of your car.',
  'They got a search warrant'
];

function cSusLocation(location, randomChance) {
  // if below odds
  let odds = Math.round(Math.random() * 100);
  console.log(odds, randomChance);
  if(odds <= randomChance) {
    // sus
    let susLevel = Math.round(Math.random() * 3) + session.police.binoculars;
    session.player.suspicion += susLevel;
    if(session.police.binoculars > 0) game.location.warehouse.text = game.location.warehouse.text.replace(' You are spotted by police officers. ' + binoculars[session.police.binoculars - 1], '');
    game.location.warehouse.text += ' You are spotted by police officers. ' + binoculars[session.police.binoculars];
    session.police.binoculars++;
    if(session.police.binoculars == binoculars.length) {
      gameOver();
      session.player.suspicion = 10;
    }
  }
  cLocation(location);
}

function cLocation(location) {
  session.player.location = location;
  saveSession();
}
function wareHouseDeath() {
  if(checkClosed(game.location.warehouse)) game.location.warehouse.gameOver = true;
  game.location.warehouse.textClosed = 'You go outside. You walk around the warehouse. Suddenly, you hear the scrape of a footstep, but before you turn around. Darkness.'
  setTimeout(()=> { session.player.health = 0; saveSession() }, 3500);
}


function collectMethProfits(id, location, upperLimit) {
  if(checkClosed(game.location.warehouse)) wareHouseDeath();
  collectProfits(id, location, upperLimit)

} 
function collectProfits(id, location, upperLimit) {
  let option = id.replace('-option', '');
  session.player.money += Math.round(Math.random() * upperLimit);
  game.location[location].options[option].hidden = true;
  saveSession();
}

function eat(location) {
  // debugger;
  let eatObject = game.location[location].options.eat;
  if(eatObject.cost <= session.player.money) {
    session.player.health = clamp(session.player.health + eatObject.value, 0, 10);
    cost(eatObject);
    eatObject.hidden = eatObject.hideUponUse;
  }
}


function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function cost(ob) {
  session.player.money -= ob.cost;
  saveSession();
}


function gameOver() {
  if(!components.gameOver) {
    let overlay =  addElement('div', { class: 'overlay', id: 'gameover-overlay' }, '', el.app);
    let collection = addElement('div', { class: 'collection' }, '', overlay);
    addElement('div', { class: 'gameover' }, 'Game Over', collection);
    addElement('button', { class: 'main-menu', id: 'gameover-return-mainmenu', onclick: 'returnToMenu()' }, 'Return to the main menu', collection);
    session.gameOver = true;
    components.gameOver = true;
    saveSession();
  }
}

function returnToMenu() {
  saveSession();
  config.session = "";
  pack(dir.config, config);
  window.location.replace('../titleScreen/titleScreen.html');
}