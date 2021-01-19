const path = require('path');
const fs = require('fs');

let dir = {
  saves: path.join(__dirname, '../save/game'),
  config: path.join(__dirname, '../save/config.json')
}

class Save {
  constructor(name) {
    this.gameOver = false;
    this.save = {
      name: name,
      date: new Date()
    };
    this.time = {
      time: {
        hour: 6,
        minute: 0,
        
      },
      multiplier: 1,
      date: ''
    };
    this.police = {
      binoculars: 0,
    };
    this.scenario = 0;
    this.index = config.index;
    this.player = new Character('Gus Fring', 55, 100, 'safehouse')
  }
}
class Character {
  constructor(name, age, money, location) {
    this.name = name;
    this.age = age;
    this.money = money;
    this.health = 10;
    this.suspicion = 0;
    this.location = location;
  }
}



function readSaves() {
  let list = []
  fs.readdirSync(dir.saves).forEach(file => {
    list.push(file);
  })
  return list;
}

function createSave(name) {
  let game =  new Save(name);
  pack(path.join(dir.saves, `/save-${config.saves.index}.json`), game);
  config.saves.index++;

  pack(dir.config, config);
  return game;
}


let config = {
  saves: {
    index: 0
  },
  session: '',
  settings: {
    textAnimationMultiplier: 1
  }
}
config = unpack(dir.config);



function pack(dir, object) {
  fs.writeFileSync(dir, JSON.stringify(object));
}

function unpack(dir) {
  return JSON.parse(fs.readFileSync(dir));
}

function loadSave(name) {
  config.session = name;
  pack(dir.config, config);
  window.location.replace('../game/game.html');
}

function saveSession() {
  session.save.date = new Date();
  pack(path.join(dir.saves, config.session), session);
}

function formatLocation(locationString) {
  let location = '';
  let locationSplit = locationString.split('_');
  for(let i = 0; i < locationSplit.length; i++) {
    // capitalize the beginning of every word
    location += capitalize(locationSplit[i]) + ' ';
  }
  return location;
}
function capitalize(text) {
  return text.replace(text.substring(0, 1), text.substring(0, 1).toUpperCase());
}