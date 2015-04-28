// Check My Links by Paul Livingstone
// @ocodia

String.prototype.startsWith = function(text) {
  return this.substr(0, text.length) == text;
};

String.prototype.contains = function(text) {
  return this.indexOf(text) !== -1;
};
function removeClassFromElements(classname) {
  var x = document.getElementsByClassName(classname);
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].classList.remove(classname);
  }
}

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function removeDOMElement(id){
  if(document.getElementById(id)){
    document.getElementById(id).remove();
  }
}

chrome.extension.onMessage.addListener(

  function doStuff(request, sender) {

  // Gather links
  var pageLinks = document.getElementsByTagName('a');
  var totalvalid = pageLinks.length;
  var queued = 0;
  var checked = 0;
  var invalid = 0;
  var passed = 0;
  var rpBox;
  // Clear the Previous Run
  removeDOMElement("CMY_ReportBox");
  removeClassFromElements("CMY_Link");
  removeClassFromElements("CMY_Valid");
  removeClassFromElements("CMY_Invalid");
  removeElementsByClass("CMY_Response");

  (
  function(pg){

    var blacklist = request.bl;
    blacklist = blacklist.split("\n");

    var blacklisted;

    var cacheType = request.ca;
    var checkType = request.ct;
    var optURL = request.op;

    // Inject Styles and Elements for feedback report

    var reportStyle = document.createElement("style");
    reportStyle.setAttribute("rel", "stylesheet");
    reportStyle.setAttribute("type", "text/css");
    document.getElementsByTagName("head")[0].appendChild(reportStyle);

    reportStyle.appendChild(document.createTextNode(".CMY_Link{background: #333 !important; color: #fff !important; font-weight: bold; border-right: 1px solid #fff;}"));
    reportStyle.appendChild(document.createTextNode(".CMY_Invalid{background: #990000 !important; color: #fff !important;}"));
    reportStyle.appendChild(document.createTextNode(".CMY_Valid{background: #669900 !important; color: #fff !important;}"));
    reportStyle.appendChild(document.createTextNode(".CMY_Response{color:#fff; border-left: 1px solid #fff; padding: 0px 5px; margin: 0px 0px 0px 5px;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox{font-weight: bold; width: 250px; position: fixed; right:0px; top: 0px; background: #fff; margin: 20px; padding: 0px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 14px; border-radius: 5px; z-index: 999999; box-shadow: 0px 0px 3px rgba(0,0,0,1);}"));
    reportStyle.appendChild(document.createTextNode("#CMY_RB_Header{border-radius: 5px 5px 0px 0px; border-bottom: 1px solid #444; background: -webkit-gradient(linear, center top, center bottom, from(#777), to(#3B3B3B)); text-align: center; color: #fff; font-size: 12px; padding: 5px; margin: 0px; text-shadow: 1px 1px 1px #666;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox .CMY_RB_ResultCount{font-size: 25px; box-sizing: border-box; width: 50%; color: #fff; font-weight: bold; line-height: 14px; text-shadow: 0px 0px 4px rgba(0,0,0,0.3); text-align: left; padding: 10px 10px 10px 40px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAABQCAYAAAD2gj5JAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAR2SURBVHja7JjdaxxVGMbPObM7HzszuwkoVdv+DSJCK2oilaz1o4KBJqYVTW+0ou2NjZZaQ2vTIoGoTa010gixjbtJm1KF9qZ3ghdeFgreeKeIopjd7Mxukt3sOT5nsklnZ2aTGPVCmIHDZnfe85vnvO/znjCHCiHIv33RGLrpyV29dp+SJPlEgsqv3Te/LH39j6ASmNDIZdNmCd1k8qfqvMv3VRx+c1NQAHsBnAKQ2m0KUQ1PKVmc5/NukWcTm1T4lR/IPKGkrmr0mGawOyFo14v2IFPIlls551AL4CSALADknJOBWpWcy31YEE3LB/AdPG1YNymhlHx67cLcocCS8xFAITh5a3FBnJs4M8ubCgXguwCeMTOMmGkmoQRJPz89Wjyc7bN7lARymA4rBPAIgJ8AWA9ZavdL9s9WG9uWbsckbTnxtaog5RL/bqEidiRVolqZMPDzwT/PBtPEVumM7Esk6S9Q5KnEd5JUKbEy7PG2e5hqt4eWLBWOrmv+F17L7LLbWd4w2RYUa/kSkiAjlx/WUDjQyGF9Qx3VfTDTabWznJFiWz1VtOl2HVU+Ul0Gir/VpgB3IL85PcW2KcoqeKXKo2sB12xTgHdJMFJxHxTXETYQrPKmNhSAn0QqxjSdXlyqkZH1FK5ca7ZpxeXf4qOzZtC5qbNFEW/SMTSGxtAYGkNjaAyNoTE0hsbQGPo/ghIJ9Y+sbvY/rVt/PKtbvcF7/tGlmzt26+YPiHs/eK9J6VOG9UqS0LEUpUaS0nJViAMzldJMUEjWsHYmCL1qULpdp5QvEXLiSnnudGj5AL4K4HmTMdWijCTxOg6o4wref7Vcuu4DPgrgFB683cLrNaB4xSYEcUMYIzcqTmn1uEMh9DgCPaCGQEzEBGbj+0SPme5uPPgRqVACbQANxMo4FfGIO2pS9nDTGQr+OIolF6RC5jtgATiNCZM9ZuYUVE0C+IDtKWRk5UQEU5Ywd1Aj9PtQ9fem0j2YMC5BzJdDedi0iLgahjwr1HxAXEu4fxypGvnCLfBIS2GpfVA2BnDGDxaN0bQ8pB2UY585sx9FHiGtXCjKFBL++oLgv3O/oRvBvgnlhsKPN2x+5PA9m7IhWTQW5W9C8hec2f1Rc6PiZZV3LsJKMoet+g2/Z/uttr0balP48DHYJC9tk25UuYVSWTyn5Pl47npLKIAdAE4DeL/l+ZBK/7ZscZlz5N5FDQ6gFtdCUAA7AcwBuDXoQ3mWiKhvMJ7AI+6lYfACwC8DPNOUUwDGjGggB+wUqrx/XvA3sOQSDxQF8bpNlUuwY0cASqfRMXXNW/JdYwM4COAH426hNuEWZxzBD0JZCIxWvaIT9mMTFEFD2G1OgsIbWZb7xEkAhwFcPYrDbiR9LMEOv1u0iboQhy+Xi7+FCrXHsCl2qRPw59vo5WFY6vR4o/UifNyPuGEovAXgmxfdgtPSUntSdhq7zYPYHG5fKhedVpV/zrDVFKMPYck/QeGv6+38TH4+b1h0rZ1fjmd0S4mK+0/+R/0lwAD2yuPPDbbSegAAAABJRU5ErkJggg%3D%3D); background-repeat: no-repeat;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox .CMY_RB_Meta{text-align: center; background: #111; font-size: 11px; font-weight: bold; padding: 10px 0px 10px 0px; box-sizing: border-box; color: #fff; line-height: 12px; width: 50%;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox .CMY_RB_Meta a{color: #fff !important;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox .CMY_RB_LC_Left{float: left;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox .CMY_RB_LC_Right{float: right;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox .CMY_RB_Queue{color: #F59703 !important;}"));
    //reportStyle.appendChild(document.createTextNode("#CMY_ReportBox #CMY_RB_Perc{font-size: 50px; line-height: 50px; color:#fff; background: #111; padding: 10px; text-shadow: 0px 0px 5px rgba(255,255,255,0.8); text-align: center;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox #CMY_RB_Pass{border-top: 1px solid #bddf5d; border-right: 1px solid #8db615; float:left; border-radius: 0px 0px 0px 5px; background-color:#9fcd19; background-position-x: 8px; background-position-y: 5px;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox #CMY_RB_Fail{border-top: 1px solid #c54f4f; float: right; border-radius: 0px 0px 5px 0px; background-color: #a9060a; background-position-x: 8px; background-position-y: -52px;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox #CMY_RB_Close{float: right;color:#ffffff;cursor:pointer;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox #CMY_RB_Options{border-top: 1px solid #333; color: #fff; background: #000; clear:both;}"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox #CMY_RB_Settings {float: left; }"));
    reportStyle.appendChild(document.createTextNode("#CMY_ReportBox #CMY_RB_Settings a {width: 13px; height: 13px; display: block; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEHSURBVHjafNFNS4JBEMDxLYokJb0mSAlKRlAQqPc+QkJE9xQ8Cn0G6e5V6BpBFn2EDnaPDh4qT3rKgygKWdt/ccaX5aGB32F3ntmdZ9ZYa02ACj5wFJRfM9NI4wRNDHCKJM7xhT3E8Yi+VpftNN6Exhgv6KKvN2vRIV7t/1FHxH2/Ku31sGLm8Y4naVVjMltTeYVn/MiJLeQQwyV+ZX+Ie5y5oo7XxgNC0nZK/kVjgoZLHOMaI0m4j0rYR22h4FP2kzqIKJrejQNvXdV30kHksWOWI+ytc/JWs8dNIIQbfONCitq4Q1YOjaGj7W3hAJvYkGG4qRUlv40M1hcf11fALXaD8n8CDAA06afD6OE/sAAAAABJRU5ErkJggg==);}"));

    var reportBox = document.createElement("div");
    var rbHeader = document.createElement("div");
    //var rbPerc = document.createElement("div");
    var rbAmt = document.createElement("div");
    var rbQueue = document.createElement("div");
    var rbOptions = document.createElement("div");
    var rbPass = document.createElement("div");
    var rbFail = document.createElement("div");

    var rbClose = document.createElement("div");
    rbClose.innerHTML = "&times;";
    rbClose.setAttribute("id", "CMY_RB_Close");

    var rbSettings = document.createElement("div");
    rbSettings.innerHTML = "<a href='" + optURL + "' target='_blank'></a>";
    rbSettings.setAttribute("id", "CMY_RB_Settings");

    reportBox.setAttribute("id", "CMY_ReportBox");
    rbHeader.setAttribute("id", "CMY_RB_Header");
    rbHeader.innerHTML = "Link Results";
    //rbPerc.setAttribute("id", "CMY_RB_Perc");

    rbAmt.setAttribute("id", "CMY_RB_LC_Left");
    rbAmt.setAttribute("class", "CMY_RB_LC_Left CMY_RB_Meta");

    rbQueue.setAttribute("id", "CMY_RB_LC_Right");
    rbQueue.setAttribute("class", "CMY_RB_LC_Right CMY_RB_Meta CMY_RB_Queue");

    rbPass.setAttribute("id", "CMY_RB_Pass");
    rbPass.setAttribute("class", "CMY_RB_ResultCount");
    rbFail.setAttribute("id", "CMY_RB_Fail");
    rbFail.setAttribute("class", "CMY_RB_ResultCount");

    rbOptions.setAttribute("id", "CMY_RB_Options");
    var rbOption1 = document.createElement("div");
    rbOption1.setAttribute("class", "CMY_RB_LC_Left CMY_RB_Meta");
    rbOption1.innerHTML = "Caching: " + cacheType.toUpperCase();
    rbOptions.appendChild(rbOption1);

    var rbOption2 = document.createElement("div");
    rbOption2.setAttribute("class", "CMY_RB_LC_Right CMY_RB_Meta");
    rbOption2.innerHTML = "Method: " + checkType;
    rbOptions.appendChild(rbOption2);

    document.getElementsByTagName("body")[0].appendChild(reportBox);
    rpBox = document.getElementById("CMY_ReportBox");

	rbHeader.appendChild(rbSettings);
    rbHeader.appendChild(rbClose);
    rpBox.appendChild(rbHeader);
    //rpBox.appendChild(rbPerc);
    rpBox.appendChild(rbAmt);
    rpBox.appendChild(rbQueue);
    rpBox.appendChild(rbOptions);
    rpBox.appendChild(rbPass);
    rpBox.appendChild(rbFail);


    //rpBoxPerc = document.getElementById("CMY_RB_Perc");
    rpBoxAmt = document.getElementById("CMY_RB_LC_Left");
    rpBoxQueue = document.getElementById("CMY_RB_LC_Right");
    rpBoxPass = document.getElementById("CMY_RB_Pass");
    rpBoxFail = document.getElementById("CMY_RB_Fail");

    //rpBoxPerc.innerHTML = "0%";
    rpBoxAmt.innerHTML = "Links: 0";
    rpBoxQueue.innerHTML = "Queue: 0";
    rpBoxPass.innerHTML = "0";
    rpBoxFail.innerHTML = "0";

    // Run through links, add feedback classes and ignore empty href and non http* links
    for (var i = 0; i < pg.length; i++){

      var link = pg[i];
      var url = link.href;
      var rel = link.rel;
      blacklisted = false;

      if ((url.length <= 0) || (request.nf=='false' && rel == "nofollow") || (url.startsWith('http')===false)){
      	if(url.startsWith('chrome-extension://')){

      	}
      	else{
        	console.log("Skipped: " + url);
        	totalvalid -=1;
    	}
      }
      else{
        for (var b = 0; b < blacklist.length; b++)
        {
          if (blacklist[b] !== "" && url.contains(blacklist[b])){
            blacklisted = true;
          }
        }

        if (blacklisted === true){
          console.log("Skipped (blacklisted): " + url);
          totalvalid -=1;
        }
        else{
          if(url.indexOf("#")==url.length-1){
            totalvalid -=1;
          }
          else{
          queued +=1;
          link.classList.add("CMY_Link");
          checkURL(url, link);
          }
        }
      }
    }


    rpBoxAmt.innerHTML = "Links: " + totalvalid;
    // When close element is clicked, hide UI
    document.getElementById("CMY_RB_Close").onclick=function(){removeDOMElement("CMY_ReportBox");};
    // Remove the event listener in the event this is run again without reloading
    chrome.extension.onMessage.removeListener(doStuff);
  }(pageLinks)
  )

  // Send links to get checked via XHR
  function checkURL(url, link) {
    chrome.extension.sendMessage({"action": "check", "url": url},
    function (response) {
      updateDisplay(url,link,response);
    });
  }

  function updateDisplay(url,link,response){
    if (response) {
      if (200 <= response && response < 400) {
        link.classList.add("CMY_Valid");
        passed +=1;
        rpBoxPass.innerHTML = passed;
      }
      else {
        console.log("Response " + response + ": " + url);
        link.classList.add("CMY_Invalid");
    	link.innerHTML += " <span class='CMY_Response'>" + response + "</span>";
        invalid +=1;
        rpBoxFail.innerHTML = invalid;
      }
      queued -=1;
      checked +=1;
      //rpBoxPerc.innerHTML = Math.floor((checked)/totalvalid * 100) + "%";
      rpBoxQueue.innerHTML = "Queue: " + queued;
    }
  }

    return true;

  });
