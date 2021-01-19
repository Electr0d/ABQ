// add event listener
document.body.addEventListener('keydown', e => {
  if(e.code == "Escape") {
    pauseMenu();
  } else if(e.code == "ArrowUp" || e.code == "ArrowDown") {
    selectorMove(e.code.replace('Arrow', '').toLowerCase())
  } else if(e.code == "Enter") {
    selectorSelect();
  }
})
window.addEventListener("wheel", e => {
  let direction = e.deltaY < 0 ? 'up' : 'down';
  selectorMove(direction);
});

// pause menu
function pauseMenu() {
  if(!components.paused) {
    // add overlay and container
    let overlay = addElement('div', { class: 'overlay', id: 'pause-overlay' }, '', el.app);
    let collection = addElement('div', { class: 'collection', id: 'pause-collection' }, '', overlay);

    // add header
    addElement('div', { class: 'pause-header' }, 'Game Paused', collection);

    // add buttons
    addElement('button', { class: 'pause-button', id: 'resume-button', onclick: 'pauseMenu()' }, 'Resume', collection);
    addElement('button', { class: 'pause-button', id: 'save-button', onclick: 'saveSession(); pauseMenu()'}, 'Save', collection);
    addElement('button', { class: 'pause-button', id: 'return-button', onclick: 'returnToMenu()' }, 'Return to main menu', collection);
    addElement('button', { class: 'pause-button', id: 'quit-button', onclick: 'quit()'}, 'Quit', collection);
  } else {
    // remove overlay
    el.app.removeChild(document.querySelector('.overlay#pause-overlay'));
  }

  // toggle
  components.paused = !components.paused;
}

