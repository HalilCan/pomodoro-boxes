let scr = document.getElementById("main-screen");
let minBox = document.getElementById("minBox");
let secBox = document.getElementById("secBox");
let statusBox = document.getElementById('span-status');
let boxList = document.getElementById('box-list');
let toggleButton = document.getElementById('toggleButton');
let timerLabel = document.getElementById('timer-label');

let mins = 0;
let secs = 0;
let label = '';
let paused = true;

let bellPath = 'sounds/japanese_temple_bell.mp3';
let bell = new Audio(bellPath);

let boxes = [1];

function parseSecs() {
  let mins_new = 0;
  if (secs >= 60) {
    mins_new = Math.floor(secs / 60);
    secs = secs % 60;
  }
  return [mins_new, secs];
}

function toggleState() {
  paused = !paused;
  mins = minBox.value;
  secs = secBox.value;
  
  if (mins === undefined) {
    mins = 0;
  }
  if (secs === undefined) {
    secs = 0;
  }
  
  //render duo here to update realtime info
  clearBoxesOnScreen();
  renderBoxes();
  
  if (paused) {
    statusBox.innerHTML = ('Timer is paused');
    toggleButton.value = (`\u9654`);
    toggleButton.innerText = (`\u9654`);
    minBox.disabled = false;
    secBox.disabled = false;
  } else {
    statusBox.innerHTML = ('Time is ticking');
    toggleButton.value = (`\u9612 \u9612`);
    console.log (`ticking:\u9612 \u9612`);
    minBox.disabled = true;
    secBox.disabled = true;
  }
}

window.setInterval(countDown, 1000);

function countDown() {
  if (!paused) {
    if (mins == 0 && secs == 0) {
      timeOut();
    } else {
      if (secs == 0) {
        mins -= 1;
        secs = 59;
      } else {
        secs -= 1;
      }
    }
    updateDisp();
  }
}

function updateDisp() {
  minBox.value = mins;
  secBox.value = secs;
  console.log(label);
  timerLabel.innerHTML = label;
  if (!paused) {
    document.title = mins + ':' + secs;
  }
  if (paused) {
    document.title = 'Paused';
  }
}

function refreshBox() {
  box = boxes[0];
  mins = box.minutes;
  seconds = box.seconds;
  label = box.label;
  stop_alert();
}

function timeOut() {
  toggleState();
  play_alert();
  alert("Time Out!");
  if (boxes.length > 1) {
    boxes.splice(0,1);
    clearBoxesOnScreen();
    renderBoxes();
    refreshBox();
    updateDisp();
  }
}

function genRealtimeBox (xMin, xSec, index) {
  let currentTime = new Date();
  let realHours = currentTime.getHours();
  let realMinutes = currentTime.getMinutes();
  
  let mins2 = totalBtnTimeUpToIndex(index)[0] - totalBtnTimeUpToIndex(0)[0];
  let secs2 = totalBtnTimeUpToIndex(index)[1] - totalBtnTimeUpToIndex(0)[1];
  
  let curMins = parseInt(minBox.value);
  let curSecs = parseInt(secBox.value);
  
  let minsNew = (realMinutes + mins2 + curMins + Math.floor((secs2 + curSecs) / 60)) % 60;
  let totMinsNew = (realMinutes + mins2 + curMins + Math.floor((secs2 + curSecs) / 60));
  console.log('totMinsNew = ' + totMinsNew);
  let hrsNew = (realHours + Math.floor(totMinsNew / 60)) % 24;
  
  return ('<span class = "rt-box" id = "rt-box-' + index + '"> <span id = "rt-Hrs-' + index +
  '">' + hrsNew + '</span> : <span id = "rt-Mins-' + index + '">' + minsNew + '</span></span>');
}

function genTimeBox (m, s, label) {
  if (!(m > -1)) {
    m = 0;
  }
  if (!(s > -1)) {
    s = 0;
  }
  
  if (label === null) {
    label = '';
  }
  
  return {
    minutes: m, seconds: s, label: label
  };
}

function addBox() {
  let minBoxNew = document.getElementById('minBoxNew');
  let secBoxNew = document.getElementById('secBoxNew');
  let labelBoxNew = document.getElementById('labelBoxNew');
  
  let minBoxNewR = document.getElementById('minBoxNewR');
  let secBoxNewR = document.getElementById('secBoxNewR');
  let labelBoxNewR = document.getElementById('labelBoxNewR');
  
  let newBox = genTimeBox(minBoxNew.value, secBoxNew.value, labelBoxNew.value);
  let newBoxR = genTimeBox(minBoxNewR.value, secBoxNewR.value, labelBoxNewR.value);
  boxes.push(newBox);
  boxes.push(newBoxR);
  clearBoxesOnScreen();
  renderBoxes();
}

function clearBoxesOnScreen() {
  boxList.innerHTML = ("");
}

function deleteBox(index) {
  boxes.splice(index,1);
  clearBoxesOnScreen();
  renderBoxes();
}

function renderBoxes() {
  let len = boxes.length;
  for (let i = 1; i < len; i ++) {
    let box = boxes[i];
    let boxLi = document.createElement("LI");
    let boxMinutes = parseInt(box.minutes, 10) + Math.floor(box.seconds / 60);
    
    boxLi.innerHTML = ("<div id = 'timeBlock-" + i + "' class = 'time-block'> " +
    "<form> <input id = 'minBox-" + i + "' class = 'min-box' type='text' " +
    "name='mins' disabled = 'disabled' value="+ boxMinutes +">:<input id = " +
    "'secBox-"+ i +"' class = 'sec-box' type='text' name='secs' disabled = " +
    "'disabled' value="+ box.seconds%60 + "><input id = 'labelBox-"+ i +"' " +
    "class = 'label-box' type='text' disabled = 'disabled' name='label' " +
    "value="+ stringToHTML(box.label) +"> <input id = 'delete-"+ i +"' class = 'delete-btn' " +
    "type='button' value='X' onclick = 'deleteBox("+i+");'> </form></div>" + genRealtimeBox(boxMinutes, box.seconds % 60, i));

    boxList.appendChild(boxLi);
  }
}

function stringToHTML(label) {
  let lb = label.split(' ');
  let retVal = '';
  retVal += '"';
  for (let i = 0; i < lb.length; i ++) {
    retVal = retVal + lb[i]  + ' ';
  }
  retVal += '"';
  return retVal;
}

function changeColor() {
  //rgb
  console.log('event fired');
  let colors = [0, 0, 0];
  let hour = new Date().getHours();
  console.log(hour);
  
  //Will get a valid rgb color
  let color = parseInt(255 - 255/24*(24 - hour));
  console.log(color);
  for(let i = 0; i < colors.length; i++) {
    colors[i] = color;
  }
  
  document.body.style.backgroundColor = "rgb("+colors[0] + "," + colors[1] + "," + colors[2] + ")";
  console.log("event fired. color get:" + colors[0] + colors[1] + colors[2]);
}

setInterval(changeColor,1000000);

function play_alert() {
  bell.play();
}

function stop_alert() {
  bell.pause();
  bell.currentTime = 0;
}

function totalBtnTimeUpToIndex (index) {
  let mins = 0;
  let secs = 0;
  for (let i = 0; i < index + 1; i ++) {
    if (parseInt(boxes[i].minutes) > -1) {
      mins += parseInt(boxes[i].minutes);
      secs += parseInt(boxes[i].seconds);
    }
  }
  mins += Math.floor(secs / 60);
  secs = secs % 60;
  return [mins, secs];
}