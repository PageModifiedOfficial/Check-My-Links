// Check My Links by Paul Livingstone
// @ocodia

var blacklistDefaults = 
    "googleleads.g.doubleclick.net\n" +
    "doubleclick.net\n" +
    "googleadservices.com\n" +
    "www.googleadservices.com\n" +
    "googlesyndication.com\n" +
    "adservices.google.com\n" +
    "appliedsemantics.com";

function loadOptions() {
  
  var bkg = chrome.extension.getBackgroundPage();
  var blacklistItems = bkg.getItem("blacklist");

  if (blacklistItems === null) {
    bkg.setItem("blacklist", blacklistDefaults);
	}

  blacklistItems = bkg.getItem("blacklist");
  blacklistItems.split(" ");

  document.getElementById("blacklistEntries").value = blacklistItems;
 
}

function saveOptions() {
  var bkg = chrome.extension.getBackgroundPage();
  var blacklistEntries = document.getElementById("blacklistEntries");

  // Save selected options to localstore
  bkg.setItem("blacklist", blacklistEntries.value);
  document.getElementById("msg").style.visibility = "visible";
}

