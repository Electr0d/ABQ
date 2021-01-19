function time() {
  if(!components.paused) {
    let time = session.time.time;
    
  // increment hour if out of bounds
  if(time.minute >= 60) {
    time.minute = 0;
    time.hour++;
  }
  if(time.hour >= 24) time.hour -= 24;
  let hour = time.hour == 0 ? 12 : time.hour == 12 ? 12 : time.hour % 12;
  let ampm = time.hour >= 12 ? 'PM' : 'AM';
  
  // add zero if below 10
  let minute = time.minute < 10 ? "0" + time.minute.toString() : time.minute;
  
  el.time.textContent = `${hour}:${minute} ${ampm}`;
  time.minute++;
}
}
time();
let timeInterval = setInterval(time, 1000 * session.time.multiplier);


function resetTimeInterval() {
  clearInterval(timeInterval);
  timeInterval = setInterval(time, 1000 * session.time.multiplier);
}