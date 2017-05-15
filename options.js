// Check My Links by Paul Livingstone
// @ocodia

function loadOptions() {
  
  var bkg = chrome.runtime.getBackgroundPage(function(bkg){
   var options = bkg.getOptions();

    if(options.cache == 'true'){
      document.getElementById("cache").checked = true;
    }

    if(options.noFollow == 'true'){
      document.getElementById("noFollow").checked = true;
    }

    if(options.parseDOM == 'true'){
      document.getElementById("parseDOM").checked = true;
    }

    if(options.trailingHash == 'true'){
      document.getElementById("trailingHash").checked = true;
    }

    if(options.emptyLink == 'true'){
      document.getElementById("emptyLink").checked = true;
    }

    if(options.noHrefAttr == 'true'){
      document.getElementById("noHrefAttr").checked = true;
    }
    if(options.autoCheck == 'true'){
      document.getElementById("autoCheck").checked = true;
    }

    document.getElementById("blacklistEntries").value = options.blacklist.split(" ");
    var requestType = document.getElementById("requestType");
   
    for (var i = 0; i < requestType.children.length; i++) {
      var requestTypechild = requestType.children[i];
        if (requestTypechild.value == options.checkType) {
        requestTypechild.selected = "true";
        break;
      }
    }
  });
}

function saveOptions() {
  var bkg = chrome.runtime.getBackgroundPage(function(bkg){
    var blacklistEntries = document.getElementById("blacklistEntries");
    var requestType = document.getElementById("requestType");

    // Save selected options to localstore
    bkg.setItem("blacklist", blacklistEntries.value);
    bkg.setItem("checkType", requestType.children[requestType.selectedIndex].value);

    if(document.getElementById("cache").checked){bkg.setItem("cache", 'true');}else{bkg.setItem("cache", 'false');}
    if(document.getElementById("noFollow").checked){bkg.setItem("noFollow", 'true');}else{bkg.setItem("noFollow", 'false');}
    if(document.getElementById("parseDOM").checked){bkg.setItem("parseDOM", 'true');}else{bkg.setItem("parseDOM", 'false');}
    if(document.getElementById("trailingHash").checked){bkg.setItem("trailingHash", 'true');}else{bkg.setItem("trailingHash", 'false');}
    if(document.getElementById("emptyLink").checked){bkg.setItem("emptyLink", 'true');}else{bkg.setItem("emptyLink", 'false');}
    if(document.getElementById("noHrefAttr").checked){bkg.setItem("noHrefAttr", 'true');}else{bkg.setItem("noHrefAttr", 'false');}
    if(document.getElementById("autoCheck").checked){bkg.setItem("autoCheck", 'true');}else{bkg.setItem("autoCheck", 'false');}

    document.getElementById("msg").style.visibility = "visible";
    setTimeout(function() {
      document.getElementById("msg").style.visibility = "hidden";
    }, 2000);
  });
}

function deleteObjectStore(){
  indexedDBHelper.deleteObjectStore();
  console.log("Cleared IndexedDB Datastore");
  document.getElementById("msgCache").style.visibility = "visible";
  setTimeout(function() {
    document.getElementById("msgCache").style.visibility = "hidden";
  }, 2000);
}

document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clearCache').addEventListener('click', deleteObjectStore);

loadOptions();