// Check My Links
// Paul Livingstone
// 2012

var blacklistDefaults = 
    "googleleads.g.doubleclick.net\n" +
    "doubleclick.net\n" +
    "googleadservices.com\n" +
    "www.googleadservices.com\n" +
    "googlesyndication.com\n" +
    "adservices.google.com\n" +
    "appliedsemantics.com";

function loadOptions() {
  
  // Load up the background page
  var bkg = chrome.extension.getBackgroundPage();
  
	var blacklistItems = bkg.getItem("blacklist");

	// Set up the defaults if no values are present in LocalStorage
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

