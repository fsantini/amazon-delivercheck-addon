var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");


// pageMod at the moment not working because of ajax: page is not actually reloaded
//var pageMod = require("sdk/page-mod");
//
//pageMod.PageMod({
//  include: [/.*amazon\.[^/]*\/s\/.*/, /.*amazon\.*\/search\/.*/],
//  contentScriptWhen: 'ready',
//  attachTo: 'top',
//  contentScript: 'console.log("Page matches");',
//  contentScriptFile: [self.data.url('jquery-3.1.0.min.js'),
//                        self.data.url('scanResults.js')]
//});


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