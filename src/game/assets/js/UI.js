function uHealth(hp) {
  el.hp.classList.remove('shake');
  let color = hp < 4 ? 'red' : hp < 8 ? 'orange' : 'green';
  el.hp.textContent = 'Health: ' + hp;
  el.hp.style = 'color: ' + color;
  if(hp <= 3) el.hp.classList.add('shake');
  if(hp <= 0) gameOver("Wasted");
}

function uSuspicion(sus) {
  el.suspicion.classList.remove('shake');
  let color = sus >= 7 ? 'red' : sus >= 4 ? 'orange' : 'green';
  el.suspicion.textContent = 'Suspicion: ' + sus;
  el.suspicion.style = 'color: ' + color;
  if(sus >= 8) el.suspicion.classList.add('shake');
}

uSuspicion(1)

function uLocation(locationString) {
  let location = formatLocation(locationString);
  el.location.textContent = location; 
}

function uMoney(money) {
  el.money.textContent = '$' + money; 
}
class SFX {
  constructor(src) {
    this.sound = addElement('audio', { src: src, preload: 'auto', controls: 'none', style: 'display: none' }, '', document.body);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }
}



updateUI();
setInterval(updateUI, 100);
function updateUI() {

  // update ui if game is not paused
  if(!components.paused) {
    uHealth(session.player.health);
    uSuspicion(session.player.suspicion);
    uLocation(session.player.location);
    uMoney(session.player.money);
  }
}
function checkClosed(location) {
  let time = session.time.time.hour;
  return !location.closeTime ? false : time > location.closeTime[0] || time < location.closeTime[1];
}

function updateScreen() {
  // reset parameters
  el.controls.options.innerHTML = '';
  el.controls.selector.style = 'transform: translateY(0%)';
  components.selector.position = 0;
  components.selector.highlighted = null;

  // define variables
  let location = game.location[session.player.location];
  let closed = checkClosed(location);

  // select appropriate text if closed
  let text = session.player.suspicion >= 10 ? 'You tipped off the police, they obtain an arrest warrant.' : closed ? location.textClosed : location.text;
  
  // animate text
  textAnimate(el.text, text);
  
  
  setTimeout(() => {
    let options = [ location.options, location.closedOptions];
    for(let i = 0; i < options.length; i++) {
      // make sure closed options exist
      if(options[i]) {
        for(option in options[i]) {
          // if not closed or option not hidden when closed
          if(!options[i][option].hideWhenClosed && closed || !closed && i == 0) {
            if(!options[i][option].hidden) {
              let op = addElement('div', { class: 'option', id: option + '-option', onclick: options[i][option].action  + '; updateScreen()'}, '', el.controls.options);
              textAnimate(op, options[i][option].name);
            }
          }
        }
      }
    }
    
    setTimeout(() => {
      // select the first option
      if(components.selector.highlighted == null) {
        components.selector.highlighted = document.querySelector('.options *');
        components.selector.highlighted.classList.add('option-highlighted');
      }
      setTimeout(() => {
        if(session.gameOver) gameOver();
      }, 100);
    }, 500);

  }, text.length * 25 + 500);
}
updateScreen();




// text animation
function textAnimate(element, text) {
	// declarations
	let i = 0;
	let subText = '';

	// kickout animation
	function animate(text) {
		// repeat this code as long as i is smaller than the text.length parameter
		if (i < text.length) {
			setTimeout(function() {
				// update element
				subText += text.charAt(i);
				element.innerHTML = subText;
				i++;

				// repeat function
				animate(text);

				// speed calculation
			}, 25);
		}
	}
	animate(text);
	return true;
}


// control panel
function selectorMove(direction) {
  let options = document.querySelectorAll('.option');
  let sign = direction == 'up' ? '+' : '-';

  // calculate position percentage
  let position = components.selector.position - eval(sign + 100);

  // calculate the bound
  let upperBound = (options.length - 1) * 100;


  // make sure it is in bounds
  if(position >= 0 && position <= upperBound) {
    components.selector.position = position;
    el.controls.selector.style = `transform: translateY(${components.selector.position}%)`;
    
    
    // highlight element
    for(let i = 0; i < options.length; i++) {
      options[i].classList.remove('option-highlighted');
    }
    let option = options[components.selector.position / 100];
    components.selector.highlighted = option;
    option.classList.add('option-highlighted');
  }
}
let optionSelectedSound = new SFX(path.join(__dirname, 'assets/sounds/option-selected.wav'));
function selectorSelect() {
  let options = document.querySelectorAll('.option');
  let option = components.selector.highlighted;

  if(options && option) {
    // selection animation
    option.classList.add('option-selected');
    optionSelectedSound.play();

    setTimeout(()=> {
      // call function
      option.onclick();
    }, 700);
  }

}