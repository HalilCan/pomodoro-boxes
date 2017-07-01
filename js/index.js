var scr = document.getElementById("main-screen");
var minBox = document.getElementById("minBox");
var secBox = document.getElementById("secBox");
var statusBox = document.getElementById('span-status');
var boxList = document.getElementById('box-list');
var toggleButton = document.getElementById('toggleButton');

var mins = 0;
var secs = 0;
var label = '';
var paused = true;

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
  /*
  //refresh html form values into block array
  var items = boxList.getElementsByTagName("li");
  if (items.length < 1) {
    console.log('empty!');
  } else {
    for (var lindex = 0; lindex < items.length; lindex ++) {
      var minB = document.getElementById('minBox' + lindex);
      var secB = document.getElementById('secBox' + lindex);
      var labB = document.getElementById('labelBox' + lindex);
      console.log(secB);
    }
  }
  
  //match current timer from array[0]
  refreshBox();
  updateDisp(); */
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
}

function refreshBox() {
  box = boxes[0];
  mins = box.minutes;
  label = box.label;
  seconds = box.seconds;
}

function timeOut() {
  toggleState();
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
    
    boxLi.innerHTML = ("<div id = 'timeBlock-" + i + "' class = 'time-block'> <form> <input id = 'minBox-" + i + "' class = 'min-box' type='text' name='mins' disabled = 'disabled' value="+ boxMinutes +">:<input id = 'secBox-"+ i +"' class = 'sec-box' type='text' name='secs' disabled = 'disabled' value="+ box.seconds%60 +"><input id = 'labelBox-"+ i +"' class = 'label-box' type='text' disabled = 'disabled' name='label' value="+ box.label +"> <input id = 'delete-"+ i +"' class = 'delete-btn' type='button' value='X' onclick = 'deleteBox("+i+");'> </form> </div>");
    
      
    boxList.appendChild(boxLi);
    
  }
}