// ==UserScript==
// @name           NCms
// @version        0.1.5
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
// @grant          GM.getResourceUrl
// ==/UserScript==

////////////////////////
// A Note from plscks //
////////////////////////
// Hi! Please hang with me
// I have no idea how userscripts work
// but in my defense I had no idea how
// Google Apps Scripts worked a day before
// I started this and well, here we are!
// None of this is intended to be stolen code
// it is mearly borrowed code, I'm still digesting
// how much of the borrowed code I really need.
// Anyways, to give credit where credit
// is due, this is all from AnneTrue who
// did an completely amazing job with LibC to
// begin with! Thanks for the inspiration
// AnneTrue.
//
// AnneTrue/LibConglomerate
// https://github.com/AnneTrue/libConglomerate
//////////////////////////////////////////////////////////

function ncMappingScript() {
  var versionStr = '0.1.5';
  var NCmsLogging = true;
  var NCmsLoggingVerbose = false;

  try {
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf('not supported') > -1)) {
        this.GM_getValue = (key, def) => { localStorage[key] || def; };
        this.GM_setValue = (key, value) => { localStorage[key] = value; return true; };
        this.GM_deleteValue = function (key) { return delete localStorage[key]; };
      }
  } catch (e) { logNCms('GM_set/get error: ' + e.message); }

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
  if (mapinfo == null) {
    logNCms("Map pane not open or no map data!");
    return;
  }

  // loads map table and splits cells to grab bgcolor of tiles
  var table = document.getElementById('Map');
  var cells = table.getElementsByTagName('td');

  var bgcolors = []
  for (var i = 0, len = cells.length; i < len; i++) {
    if (/\#....../.test(cells[i].getAttribute("bgcolor")) == true) bgcolors.push(cells[i].getAttribute("bgcolor"));
  }

  for (var k = 0; k < bgcolors.length; k++) {
    console.log("bgcolors: " + bgcolors[k]);
  }

  //attempt to collect the proper coordinate arrays
  // X coords
  var xArray = []
  for (var i = 0; i < 4; i++) {
    for (var j = -2; j < 2; j++) {xArray.push(String(xInt + j))}
  }

  for (var i = 0; i < xArray.length; i++) {console.log(xArray[i])}

  // A simplle error logging function
    function logNCms(message, verbose=false) {
    if (!NCmsLogging) { return; }
    if (verbose && !NCmsLoggingVerbose) { return; }
    console.log('[NCms] [ver:'+versionStr+']:  '+message);
  }
}

ncMappingScript();
