// ==UserScript==
// @name           NCms
// @version        0.1.14
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
// [x] pull coords out
// [x] pull tile color out
// [x] output in csv format to something??
// [x] moderate level of checks to see if runs
// [ ] pull plane information
// [ ] pull description minus door/light/day/night status
// [ ] pull tile name
// [ ] pull tile type
// [ ] store data accross page loads, export all once disconnected
//#####################//
//~THE GOOD(ISH) STUFF~//
//#####################//
//~~~is this a test?~~~//
//~~~~it has to be~~~~~//
var output = [];

function ncMappingScript(output) {
  var versionStr = '0.1.14';
  var NCmsLogging = true;
  var NCmsLoggingVerbose = false;

  try {
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf('not supported') > -1)) {
        this.GM_getValue = (key, def) => { localStorage[key] || def; };
        this.GM_setValue = (key, value) => { localStorage[key] = value; return true; };
        this.GM_deleteValue = function (key) { return delete localStorage[key]; };
      }
  } catch (e) { logNCms('GM_set/get error: ' + e.message); };

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
  var mapinfo = document.getElementById('Map');

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
  for (var i = 0, len = cells.length; i < len; i++) {
    if (/\#....../.test(cells[i].getAttribute("bgcolor")) == true) bgcolors.push(cells[i].getAttribute("bgcolor"));
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
    output.push(xArray[i] + ", " + yArray[i] + ", " + bgcolors[i]);
  }

  // A simplle error logging function
  function logNCms(message, verbose=false) {
    if (!NCmsLogging) { return; };
    if (verbose && !NCmsLoggingVerbose) { return; };
    console.log('[NCms] [ver:'+versionStr+']:  '+message);
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

output.push(ncMappingScript(output));
console.log(output);
