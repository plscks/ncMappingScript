// ==UserScript==
// @name           NCms
// @version        0.1.19
// @description    Nexus Clash map data to csv
// @namespace      https://github.com/plscks/
// @author         plscks
// @source         https://github.com/plscks/ncMappingScript
// @match          *://nexusclash.com/modules.php?name=Game*
// @match          *://www.nexusclash.com/modules.php?name=Game*
// @exclude        *://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        *://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceURL
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM_xmlhttpRequest
// @grant          GM.xmlhttpRequest
// ==/UserScript==
//
//
//####################//
//~A Note from plscks~//
//####################//
// Hi! Please hang with me
// I have no idea how userscripts work
// but in my defense I had no idea how
// Google Apps Scripts worked a day before
// I started this and well, here we are!
// Also, I'm so sorry for my sloppy code, but
// I'm still trying to grasp most of this!
// None of this is intended to be stolen code
// but some is borrowed from various
// places. By the way thanks for the inspiration
// AnneTrue, couldn't have done it without
// your help!
//#############################################################################
//
//#####################//
//~STUFF TO ACCOMPLISH~//
//#####################//
// [X] Pull coords out
// [X] Pull tile color out
// [X] Output in csv format to something??
// [x] Moderate level of checks to see if runs
// [x] Pull plane information
// [ ] Pull description minus door/light/day/night status
// [ ] Pull tile name
// [ ] Pull tile type
// [x] Store data across page loads, export all once disconnected
// [ ] Fix program structure and flow
// [ ] Tile description collection
// [ ] Format tile info in hypermap formatting
// [ ] Tile description output as a seperate csv file
// [ ] Button for exporting mapdata csv file
// [ ] Check box for enable/disable data collection
//#####################//
//~THE GOOD(ISH) STUFF~//
//#####################//
//~~~is this a test?~~~//
//~~~~it has to be~~~~~//
try {
  if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf('not supported') > -1)) {
    this.GM_getValue = (key, def) => { localStorage[key] || def; };
    this.GM_setValue = (key, value) => { localStorage[key] = value; return true; };
    this.GM_deleteValue = function (key) { return delete localStorage[key]; };
  }
} catch (e) { logNCms('GM_set/get error: ' + e.message); };

// A simplle error logging function
function logNCms(message, verbose=false) {
  var versionStr = '0.1.19';
  var NCmsLogging = true;
  var NCmsLoggingVerbose = false;
  if (!NCmsLogging) { return; };
  if (verbose && !NCmsLoggingVerbose) { return; };
  console.log('[NCms] [ver:'+versionStr+']:  '+message);
}

function ncMappingScript() {
  console.log('Got this far');
  var output = [];

  // Catches error if there is no tile description i.e. - your character is dead
  try {
    var tiledescription = document.getElementsByClassName('tile_description')[0].innerText;
  }
  catch(error) {
    logNCms("No tile description");
    return;
  }

  //Grabs the x and y coordinate of current tile and all map data stops if map not open
  var xCoord = tiledescription.match(/(?<=\s\()\d{1,2}(?!=\,\s)/);
  var xInt = parseInt(xCoord);
  var yCoord = tiledescription.match(/(?<=\,\s)\d{1,2}(?!=\s\w)/);
  var yInt = parseInt(yCoord);
  var plane = tiledescription.match(/(?<=\,\s\d{1,2}\s)\w*(?!=\,\s)/);
  var mapinfo = document.getElementById('Map');
  var tileName = tiledescription.match(/^\w+(?!=\s\(\d{1,2},\s\d{1,2}\s\w+)/);
  var tileType = tiledescription.match(/(?<=,\sa+n*\s)\w+(?!=,\sNeighborhood)/);
  console.log(`xCoord: ${xCoord}   yCoord: ${yCoord}   plane: ${plane}   tileName: ${tileName}   tileType: ${tileType}`);

  //Some basic checks to make sure proper data is available
  var inCheck = tiledescription.match(/standing\soutside/);
  if (mapinfo == null) {
    logNCms("Map pane not open or no map data!");
    return;
  }
  if (inCheck == null) {
    logNCms("Not currently outside.");
    return;
  }

  // loads map table and splits cells to grab bgcolor of tiles
  var table = document.getElementById('Map');
  var cells = table.getElementsByTagName('td');
  var bgcolors = [];
  var titles = [];
  var types = [];
  for (var i = 0, len = cells.length; i < len; i++) {
    if (/\#....../.test(cells[i].getAttribute("bgcolor")) == true) bgcolors.push(cells[i].getAttribute("bgcolor"));
    if (/\w+,\san*\s/.test(cells[i].getAttribute("title")) == true) {
      titles.push(cells[i].getAttribute("title").match(/^\w+\s?\w+/)[0]);
      types.push(cells[i].getAttribute("title").match(/an?\s\w+(\s?\w+)*$/)[0]);
    }
  }

  //attempt to collect the proper coordinate arrays
  // X coords
  var xArray = [];
  for (var i = 0; i < 5; i++) {
    for (var j = -2; j < 3; j++) {xArray.push(String(xInt + j))};
  }

  // Y coords D:
  var yArray = [];
  for (var i = -2; i < 3; i++) {
    var yIntAdj = String(yInt + i);
    yArray.push(yIntAdj, yIntAdj, yIntAdj, yIntAdj, yIntAdj);
  }

  // Output
  for (var i = 0; i < xArray.length; i++) {
    output.push(xArray[i] + ", " + yArray[i] + ", " + plane + ", " + bgcolors[i] + ", " + titles[i] + ", " + types[i]);
  }

  return output;
}

function saveOutput(output) {
  // Output to csv file for each page load
  var a = document.createElement('a');
  a.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(output.join("\n"));
  //supported by chrome 14+ and firefox 20+
  a.download = 'mapdata.csv';
  //needed for firefox
  document.getElementsByTagName('body')[0].appendChild(a);
  //supported by chrome 20+ and firefox 5+
  a.click();
}

var test = []
var main = ncMappingScript();

if (main == null || main == undefined){
  saveOutput(GM_getValue('output'));
  GM_setValue('output', []);
  return;
}
if (test == undefined || test == null) {
  GM_setValue('output', main);
  return;
}

test = GM_getValue('output');
var temp = test.concat(main)
var outPut = GM_setValue('output', temp);
