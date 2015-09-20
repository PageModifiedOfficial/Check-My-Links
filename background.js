chrome.extension.onMessage.addListener(onRequest);

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {file:'functions.js'});
    chrome.tabs.executeScript(tab.id, {file:'check.js'}, function () {
        chrome.tabs.sendMessage(tab.id, {options:getOptions(),action:"initial"});
    });
});