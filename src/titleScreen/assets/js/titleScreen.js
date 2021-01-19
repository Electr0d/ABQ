const el = {
  parameters: document.querySelector('.parameters')
}
let components = {
  play: false
}
function play() {
  if(!components.play) {
    // create save input
    let newSaveContainer = addElement('div', { class: 'new-save-container' }, '', el.parameters);
    addElement('input', { class: 'new-save-input', placeholder: 'Save name' }, '', newSaveContainer);
    addElement('button', { class: 'new-save-button', onclick: 'addData()' }, 'Create', newSaveContainer);

    listSaves();
  } else {
    el.parameters.innerHTML = '';
  }
  components.play = !components.play;
}

function addData() {
  let input = document.querySelector('.new-save-input');
  let game = createSave(input.value);
  console.log(game);

  input.value = '';
  listSaves();
}

function listSaves() {
  // remove existing saves
  let savesContainer = document.querySelector('.saves-container');
  if(savesContainer) el.parameters.removeChild(savesContainer);
  
  // add saves
  savesContainer = addElement('div', { class: 'saves-container' }, '',  el.parameters)
  let list = readSaves();
  console.log(list);
  for(let i = 0; i < list.length; i++) {
    let save = unpack(path.join(dir.saves, list[i]));

    
    let container = addElement('div', { class: 'save-container', id: save.index + '-save-container', onclick: `loadSave("${list[i]}")` }, '', savesContainer);
    addElement('p', { class: 'save-name', id: save.index + '-save-name' }, save.save.name, container);
    addElement('p', { class: 'save-date', id: save.index + '-save-date' }, save.save.date, container)
    addElement('p', { class: 'save-location', id: save.index + '-save-date' }, formatLocation(save.player.location), container)

  }
}