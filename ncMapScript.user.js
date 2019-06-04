// ==UserScript==
// @name           NCms
// @version        0.1.1
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
// Google Apps Scripts worked yesterday
// and well, here we are!
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
  var versionStr = '0.1.1';
  var NCmsLogging = true;
  var NCmsLoggingVerbose = false;

  try {
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf('not supported') > -1)) {
        this.GM_getValue = (key, def) => { localStorage[key] || def; };
        this.GM_setValue = (key, value) => { localStorage[key] = value; return true; };
        this.GM_deleteValue = function (key) { return delete localStorage[key]; };
      }
  } catch (e) { logNCms('GM_set/get error: ' + e.message); }

  try {
    var tiledescription = document.getElementsByClassName('tile_description')[0].innerText;
  }
  catch(error) {
    console.log("No tile description");
    return;
  }

  var xCoord = tiledescription.match(/(?<=\s\()\d{1,2}(?!=\,\s)/);
  var yCoord = tiledescription.match(/(?<=\,\s)\d{1,2}(?!=\s\w)/);
  console.log("Coordinates: (" + xCoord + ", " + yCoord + ")");

  var mapinfo = document.getElementById('Map');
  if (mapinfo == null) {
    console.log("Map pane not open or no map data!");
    return;
  }
  console.log(mapinfo);


  function logNCms(message, verbose=false) {
    if (!NCmsLogging) { return; }
    if (verbose && !NCmsLoggingVerbose) { return; }
    console.log('[NCms] [ver:'+versionStr+']:  '+message);
  }
}

ncMappingScript();
