// Check My Links by Paul Livingstone
// @ocodia

function loadOptions() {
  
  var bkg = chrome.extension.getBackgroundPage();
  var blacklistItems = bkg.getItem("blacklist");
  var checkTypeSelection = bkg.getItem("checkType");
  var cache = bkg.getItem("cache");

  if (blacklistItems === null) {
    bkg.setItem("blacklist", bkg.blacklistDefaults);
    blacklistItems = bkg.getItem("blacklist");
  }

  if (checkTypeSelection === null) {
    bkg.setItem("checkType", bkg.checkTypeDefault);
    checkTypeSelection = bkg.getItem("checkType");
  }
  if (cache === null) {
    bkg.setItem("cache", bkg.cacheDefault);
    cache = bkg.getItem("cache");
  }

  if(blacklistItems !== null){
    blacklistItems.split(" ");
  }

  if(cache == 'true'){
    document.getElementById("cache").checked = true;
  }
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
  var cache = 'false';
  if(document.getElementById("cache").checked){
    cache = 'true';
  }
  // Save selected options to localstore
  bkg.setItem("blacklist", blacklistEntries.value);
  bkg.setItem("checkType", requestType.children[requestType.selectedIndex].value);
  bkg.setItem("cache", cache);
  document.getElementById("msg").style.visibility = "visible";
}
function deleteObjectStore(){
  indexedDBHelper.deleteObjectStore();
  console.log("Cleared IndexedDB Datastore");
}

document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clearCache').addEventListener('click', deleteObjectStore);

loadOptions();