var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var pref = require("sdk/simple-prefs");

// pageMod at the moment not working because of ajax: page is not actually reloaded
var pageMod = require("sdk/page-mod");

function initPageMod()
{
  return pageMod.PageMod({
    include: [/.*amazon\.[^/]*\/s\/.*/, /.*amazon\.*\/search\/.*/],
    contentScriptWhen: 'ready',
    attachTo: ['top', 'existing'],
    contentScript: 'console.log("Page matches");',
    contentScriptFile: [self.data.url('jquery-3.1.0.min.js'),
                          self.data.url('scanResults.js')]
  });
}

var pmod = null;



var windows = require("sdk/window/utils");
var window = windows.getMostRecentBrowserWindow();

var ua = window.navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1;

function autoRunChanged()
{
  if (pmod)
  {
    pmod.destroy();
    pmod = null;
  }
  if (pref.prefs.autoRun || isAndroid)
    pmod = initPageMod();  
}

// check if we need to auto-attach the script to amazon search pages
// under Android there are no buttons, pagemod is the only way
if (pref.prefs.autoRun || isAndroid)
  pmod = initPageMod();

// listen when the autoRun property is set
pref.on("autoRun", autoRunChanged);

var button = buttons.ActionButton({
  id: "amazon-result-scan",
  label: "See which products can be delivered",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  var worker = tabs.activeTab.attach({
    contentScriptFile: [self.data.url('jquery-3.1.0.min.js'),
                        self.data.url('scanResults.js')]
  });
}