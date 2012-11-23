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

var checkTypeDefault = "HEAD";    

function loadOptions() {
  
  var bkg = chrome.extension.getBackgroundPage();
  var blacklistItems = bkg.getItem("blacklist");
  var checkTypeSelection = bkg.getItem("checkType");

  if (blacklistItems === null) {
    bkg.setItem("blacklist", blacklistDefaults);
  }

  if (checkTypeSelection === null) {
    bkg.setItem("checkType", checkTypeDefault);
  }

  //blacklistItems = bkg.getItem("blacklist");
  blacklistItems.split(" ");

  document.getElementById("blacklistEntries").value = blacklistItems;
  var requestType = document.getElementById("requestType");
 
 // Select the appropriate saved option for TRENDS
  for (var i = 0; i < requestType.children.length; i++) {
    var requestTypechild = requestType.children[i];
      if (requestTypechild.value == checkTypeSelection) {
      requestTypechild.selected = "true";
      break;
    }
  }
}

function saveOptions() {
  var bkg = chrome.extension.getBackgroundPage();
  var blacklistEntries = document.getElementById("blacklistEntries");
  var requestType = document.getElementById("requestType");
  // Save selected options to localstore
  bkg.setItem("blacklist", blacklistEntries.value);
  bkg.setItem("checkType", requestType.children[requestType.selectedIndex].value);
  document.getElementById("msg").style.visibility = "visible";
}


document.querySelector('#save').addEventListener('click', saveOptions);

loadOptions();