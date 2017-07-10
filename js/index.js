var scr = document.getElementById("main-screen");
var minBox = document.getElementById("minBox");
var secBox = document.getElementById("secBox");
var statusBox = document.getElementById('span-status');
var boxList = document.getElementById('box-list');
var toggleButton = document.getElementById('toggleButton');
var timerLabel = document.getElementById('timer-label');

var mins = 0;
var secs = 0;
var label = '';
var paused = true;

var bellPath = 'sounds/japanese_temple_bell.mp3';
var bell = new Audio(bellPath);

var currentTime = new Date()
var realHours = currentTime.getHours()
var realMinutes = currentTime.getMinutes()

var boxes = [1];

function parseSecs() {
  var mins_new = 0;
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
  
  if (paused) {
    statusBox.innerHTML = ('Timer is paused');
    toggleButton.value = ('Play');
  } else {
    statusBox.innerHTML = ('Time is ticking');
    toggleButton.value = ('Pause');
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

function genTimeBox (m, s, label) {
  if (!(m > -1)) {
    m = 0;
  }
  if (!(s > -1)) {
    s = 0;
  }
  
  if (isNaN(label) || label === null || typeof label === 'undefined') {
    label = '';
  }
  
  return {
    minutes: m, seconds: s, label: label
  };
}

function addBox() {
  var minBoxNew = document.getElementById('minBoxNew');
  var secBoxNew = document.getElementById('secBoxNew');
  var labelBoxNew = document.getElementById('labelBoxNew');
  
  var minBoxNewR = document.getElementById('minBoxNewR');
  var secBoxNewR = document.getElementById('secBoxNewR');
  var labelBoxNewR = document.getElementById('labelBoxNewR');
  
  var newBox = genTimeBox(minBoxNew.value, secBoxNew.value, labelBoxNew.value); 
  var newBoxR = genTimeBox(minBoxNewR.value, secBoxNewR.value, labelBoxNewR.value);
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
  var len = boxes.length;
  for (var i = 1; i < len; i ++) {
    var box = boxes[i];
    var boxLi = document.createElement("LI");
    var boxMinutes = parseInt(box.minutes, 10) + Math.floor(box.seconds / 60);
    
    boxLi.innerHTML = ("<div id = 'timeBlock-" + i + "' class = 'time-block'> " +
    "<form> <input id = 'minBox-" + i + "' class = 'min-box' type='text' " +
    "name='mins' disabled = 'disabled' value="+ boxMinutes +">:<input id = " +
    "'secBox-"+ i +"' class = 'sec-box' type='text' name='secs' disabled = " +
    "'disabled' value="+ box.seconds%60 +"><input id = 'labelBox-"+ i +"' " +
    "class = 'label-box' type='text' disabled = 'disabled' name='label' " +
    "value="+ stringToHTML(box.label) +"> <input id = 'delete-"+ i +"' class = 'delete-btn' " +
    "type='button' value='X' onclick = 'deleteBox("+i+");'> </form> </div>");
    
      
    boxList.appendChild(boxLi);
    
  }
}

function stringToHTML(label) {
  var lb = label.split(' ');
  var retVal = '';
  retVal += '"';
  for (var i = 0; i < lb.length; i ++) {
    retVal = retVal + lb[i]  + ' ';
  }
  retVal += '"';
  return retVal;
}

function changeColor() {
  //rgb
  console.log('event fired');
  var colors = [0, 0, 0];
  var hour = new Date().getHours();
  console.log(hour);
  
  //Will get a valid rgb color
  var color = parseInt(255 - 255/24*(24 - hour));
  console.log(color);
  for(var i = 0; i < colors.length; i++) {
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