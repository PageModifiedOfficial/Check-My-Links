chrome.extension.onMessage.addListener(onRequest);
var beginLinkCheck = function beginLinkCheck(tab) {
    chrome.tabs.executeScript(tab.id, {file:'functions.js'});
    chrome.tabs.executeScript(tab.id, {file:'check.js'}, function () {
        chrome.tabs.sendMessage(tab.id, {options:getOptions(), action:"initial"});
    });
};
chrome.tabs.onUpdated.addListener(function(tabid, changeinfo, tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
     var activeTab = arrayOfTabs[0];
     //If the active tab was updated
     if(activeTab.id == tab.id){
        var url = tab.url;
        if (url !== undefined && changeinfo.status == "complete" && getItem("autoCheck")=="true") {
          beginLinkCheck(tab);
        }
     }
  });
});

chrome.browserAction.onClicked.addListener(beginLinkCheck);
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url: "options.html?newinstall=yes"});
    }
    else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});