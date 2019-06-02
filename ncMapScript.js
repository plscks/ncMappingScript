// ==UserScript==
// @name           NCms
// @version        0.1
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
// @grant          GM_getResourceText
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

(function () {
var versionStr = '0.1'; // version updates go here too!

// logs to console; can disable if you want
var NCmsLogging = true;
// verbose logging, set true for dev-work
var NCmsLoggingVerbose = false;


//#############################################################################
// Boilerplate functions

// platform support: GM is provided by greasemonkey, if not assume chrome and use localStorage
try {
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf('not supported') > -1)) {
        this.GM_getValue = (key, def) => { localStorage[key] || def; };
        this.GM_setValue = (key, value) => { localStorage[key] = value; return true; };
        this.GM_deleteValue = function (key) { return delete localStorage[key]; };
    }
} catch (e) { logNCms('GM_set/get error: ' + e.message); }
}

//#############################################################################
// Generic functions

// returns number of char c in x
function timesCharExist(x, c){ var t=0,l=0;c=c+''; while(l=x.indexOf(c,l)+1)++t; return t; }


// sets first letter to be uppercase
function ucfirstletter(str){ return str.replace(/\b[A-Za-z]/,function($0) { return $0.toUpperCase(); }); }


// checks if a string represents an integer
function isNormalInteger(str) { var n = ~~Number(str); return String(n) === str && n >= 0; }


// forces ints to be two digits long for displaying as string
function fluffDigit(x) { if (x<10) { x = '0'+x; } return x; }


//#############################################################################
// Global info: used to determine if script can safely run without errors

var charinfodiv = document.getElementById('CharacterInfo');
function getCharacterInfo(charinfodiv) {
    // returns an object with the character's level, class name, ap, mp, hp, and ID number.
    if (!charinfodiv) { return; }
    var charinfo = {'level':null, 'class':'', 'id':null, 'ap':null, 'mp':null, 'hp':null},
        levelclass,
        levelclassdata,
        apNode,
        apMatch,
        hpNode,
        hpMatch,
        mpNode,
        mpMatch;
    levelclass = charinfodiv.getElementsByTagName('td')[1];
    levelclassdata = /Level ([0-9]{1,3}) (.+)/.exec(levelclass.innerHTML);
    charinfo.level = levelclassdata[1];
    charinfo.class = levelclassdata[2];
    charinfo.id = charinfodiv.getElementsByTagName('a')[0].href.match(/character&id=(\d+)$/)[1];

    try {
      apNode = document.evaluate(
          "//td/a[contains(@title, 'Action Points')]",
          charinfodiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
      ).snapshotItem(0);
      apMatch = apNode.textContent.match(/(\d+) AP/);
      if (apMatch) {
          charinfo.ap = parseInt(apMatch[1]);
      }
    } catch (err) { logNCms('Charinfo parse AP error: '+ err.message) }

    try {
      hpNode = document.evaluate(
          "//td/a[contains(@title, 'Hit Points')]",
          charinfodiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
      ).snapshotItem(0);
      hpMatch = hpNode.textContent.match(/(\d+) HP/);
      if (hpMatch) {
          charinfo.hp = parseInt(hpMatch[1]);
      }
    } catch (err) { logNCms('Charinfo parse HP error: '+ err.message) }

    try {
      mpNode = document.evaluate(
          "//td/a[contains(@title, 'Magic Points')]", charinfodiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
      ).snapshotItem(0);
      mpMatch = mpNode.textContent.match(/(\d+) MP/);
      if (mpMatch) {
          charinfo.mp = parseInt(mpMatch[1]);
      }
    } catch (err) { logNCms('Charinfo parse MP error: '+ err.message) }

    return charinfo;
}

var charinfo;
try {
    charinfo = getCharacterInfo(charinfodiv);
} catch (err) { logNCms('Error parsing charinfo: '+err.message); }
