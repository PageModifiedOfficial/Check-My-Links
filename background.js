chrome.extension.onMessage.addListener(onRequest);

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {file:'functions.js'});
    chrome.tabs.executeScript(tab.id, {file:'check.js'}, function () {
        chrome.tabs.sendMessage(tab.id, {options:getOptions(), action:"initial"});
    });
});

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url: "options.html?newinstall=yes"});
    }
    else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});