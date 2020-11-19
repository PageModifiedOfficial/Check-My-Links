// Check My Links by Paul Livingstone
// @ocodia
var logging = false;
String.prototype.startsWith = function (text) {
    return this.substr(0, text.length) == text;
};

String.prototype.contains = function (text) {
    return this.indexOf(text) !== -1;
};

String.prototype.rtrim = function (s) {
    return this.replace(new RegExp(s + "*$"), '');
};

function removeClassFromElements(classname) {
    var x = document.getElementsByClassName(classname);
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].classList.remove(classname);
    }
}

function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function removeDOMElement(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).remove();
    }
}

function isLinkValid(link, request, blacklist) {
    var url = link.href;
    var rel = link.rel;
    var blacklisted = false;
    if (url.startsWith('chrome-extension://')) {
        return false;
    } else if ((request.nf == 'false' && rel == "nofollow") || (url.startsWith('http') === false && url.length !== 0)) {
        console.log("Skipped: " + url);
        return false;
    } else {
        for (var b = 0; b < blacklist.length; b++) {
            if (blacklist[b] !== "" && url.contains(blacklist[b])) {
                blacklisted = true;
            }
        }

        if (blacklisted === true) {
            console.log("Skipped (blacklisted): " + url);
            return false;
        }
        return true;
    }
    return false;
}

function clearDisplay() {
    // Clear the Previous Run
    removeDOMElement("CMY_ReportBox");
    removeClassFromElements("CMY_Link");
    removeClassFromElements("CMY_Valid");
    removeClassFromElements("CMY_Redirect");
    removeClassFromElements("CMY_Invalid");
    removeElementsByClass("CMY_Response");
}

function createDisplay(optURL, cacheType, checkType) {
    clearDisplay();
    // Creating Elements
    reportBox = create("div", {
        id: "CMY_ReportBox"
    });
    rbHeader = create("div", {
        id: "CMY_RB_Header",
        innerText: "Link Results"
    });
    rbPMLink = create("div", {
        id: "CMY_RB_Sponsored",
        class: "CMY_RB_Sponsor",
        innerHTML: "Check My Links is supported by <a href='https://logflare.app/?utm_source=extension&utm_medium=link&utm_campaign=check_my_links' target='_blank'>Logflare</a>. Easily ⤵️ ingest, 🌊 stream, 🔍 search and 📊 dashboard structured logs with <a href='https://logflare.app/?utm_source=extension&utm_medium=link&utm_campaign=check_my_links' target='_blank'>Logflare</a>."
    });
    rbAmt = create("div", {
        id: "CMY_RB_LC_Left",
        class: "CMY_RB_LC_Left CMY_RB_Meta",
        innerHTML: "Links: 0"
    });
    rbQueue = create("div", {
        id: "CMY_RB_LC_Right",
        class: "CMY_RB_LC_Right CMY_RB_Meta CMY_RB_Queue",
        innerHTML: "Queue: 0"
    });
    rbOptions = create("div", {
        id: "CMY_RB_Options",
    });
    rbPass = create("div", {
        id: "CMY_RB_Pass",
        class: "CMY_RB_ResultCount",
        innerHTML: "Valid links: 0"
    });
    rbRedirect = create("div", {
        id: "CMY_RB_Redirect",
        class: "CMY_RB_ResultCount",
        innerHTML: "Redirect links: 0"
    });
    rbWarning = create("div", {
        id: "CMY_RB_Warning",
        class: "CMY_RB_ResultCount",
        innerHTML: "Warnings: 0"
    });
    rbFail = create("div", {
        id: "CMY_RB_Fail",
        class: "CMY_RB_ResultCount",
        innerHTML: "Invalid links: 0"
    });
    rbClose = create("div", {
        id: "CMY_RB_Close",
        innerHTML: "&times;"
    });
    rbExportDiv = create("div", {
        id: "CMY_RB_Export",
        alt: "Copy to clipboard in CSV format",
        title: "Copy to clipboard in CSV format"
    });
    rbSettings = create("div", {
        id: "CMY_RB_Settings",
        innerHTML: "<a href='" + optURL + "' target='_blank'></a>"
    });
    rbOption1 = create("div", {
        id: "CMY_RB_Cache",
        class: "CMY_RB_LC_Left CMY_RB_Meta",
        innerHTML: "Caching: " + cacheType.toString().toUpperCase()
    });
    rbOption2 = create("div", {
        id: "CMY_RB_RequestType",
        class: "CMY_RB_LC_Right CMY_RB_Meta",
        innerHTML: "Method: " + checkType.toString()
    });

    // Appending Elements
    document.getElementsByTagName("body")[0].appendChild(reportBox);
    rbOptions.appendChild(rbOption1);
    rbOptions.appendChild(rbOption2);
    rbHeader.appendChild(rbSettings);
    rbHeader.appendChild(rbClose);
    rbHeader.appendChild(rbExportDiv);
    reportBox.appendChild(rbHeader);
    reportBox.appendChild(rbPMLink);
    reportBox.appendChild(rbAmt);
    reportBox.appendChild(rbQueue);
    reportBox.appendChild(rbOptions);
    reportBox.appendChild(rbPass);
    reportBox.appendChild(rbRedirect);
    reportBox.appendChild(rbWarning);
    reportBox.appendChild(rbFail);
}

function updateDisplay(link, warnings, linkStatus) {
    if (!isNaN(linkStatus) && 200 <= linkStatus && linkStatus < 300 && warnings.length === 0) {
        link.classList.add("CMY_Valid");
        passed += 1;
        rbPass.innerHTML = "Valid links: " + passed;
    } else if (!isNaN(linkStatus) && 300 <= linkStatus && linkStatus < 400 && warnings.length === 0) {
        link.classList.add("CMY_Redirect");
        link.classList.add("CMY_Valid");
        redirected += 1;
        rbRedirect.innerHTML = "Valid redirecting links: " + redirected;
    } else if (!isNaN(linkStatus) && 200 <= linkStatus && linkStatus < 400 && warnings.length > 0) {
        var response;
        response = "Response " + linkStatus + ": " + link.href + " Warning: ";
        for (var i = 0; i < warnings.length; i++) {
            response += warnings[i];
            if (i < warnings.length - 1) {
                response += ",";
            }
        }
        link.classList.add("CMY_Warning");
        link.innerHTML += " <span class=\"CMY_Response\">" + linkStatus + "</span>";
        warning += 1;
        rbWarning.innerHTML = "Warnings: " + warning;
        console.log(response);
    } else {
        console.log("Response " + linkStatus + ": " + link.href);
        link.classList.add("CMY_Invalid");
        link.innerHTML += " <span class=\"CMY_Response\">" + linkStatus + "</span>";
        invalid += 1;
        rbFail.innerHTML = "Invalid links: " + invalid;
    }
    queued -= 1;
    checked += 1;
    rbQueue.innerHTML = "Queue: " + queued;
}

function create(name, props) {
    var el = document.createElement(name);
    for (var p in props) {
        if (p == "innerText") {
            el.innerText = props[p];
        } else if (p == "innerHTML") {
            el.innerHTML = props[p];
        } else {
            el.setAttribute(p, props[p]);
        }
    }
    return el;
}

function shouldDOMbeParsed(url, parseDOMoption, checkTypeOption) {
    if (parseDOMoption === "true" && checkTypeOption == "GET") {
        if ((url.lastIndexOf("#") > url.lastIndexOf("/")) && (url.lastIndexOf("#") < url.length - 1)) {
            return true;
        }
    }
    return false;
}

// Timeout for each link is 30+1 seconds
var timeout = 30000;

function check(url) {
    var response = { status: null, document: null };
    return new Promise(function (resolve, reject) {
        var XMLHttpTimeout = null;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (data) {
            if (xhr.readyState == 4) {
                log(xhr);
                clearTimeout(XMLHttpTimeout);
                if (200 <= xhr.status && xhr.status < 400) {
                    response.document = xhr.responseText;
                }
                response.source = "xhr";
                // Redirects eventually 200, comparing response URL with requested to detect redirects
                console.log(xhr.responseURL);
                if (xhr.responseURL == url.split('#')[0]) {
                    response.status = xhr.status;
                } else {
                    response.status = 300;
                }
                resolve(response);
            }
        };

        try {
            xhr.open(getOption("checkType"), url, true);
            xhr.send();
        } catch (e) {
            console.log(e);
            response.status = 0;
            resolve(response);
        }
        XMLHttpTimeout = setTimeout(function () {
            response.status = 408;
            resolve(response);
            xhr.abort();
        }, timeout += 1000);
    });
}

function XHRisNecessary(options, url) {
    if (shouldDOMbeParsed(url, options.parseDOM, options.checkType) === true || options.cache == 'false') {
        return true;
    }
    return false;
}

function getTrailingHashWarning(options, link, warnings) {
    if (options.trailingHash == 'true') {
        if (link.href.lastIndexOf("#") == link.href.length - 1 && link.href.lastIndexOf("#") >= 0) {
            warnings.push("Link has a trailing hash");
        }
    }
    return warnings;
}

function getEmptyLinkWarning(options, link, warnings) {
    // link is the outerHTML
    if (options.emptyLink == 'true') {
        if (new RegExp(/(([^>]+href\s*=\s*"\s*?")|([^>]+href\s*=\s*'\s*?'))/i).test(link)) {
            warnings.push("Link is empty");
        }
    }
    return warnings;
}

// Not utilized yet, would need to allow length 0 to be a valid link and then filter it out from trying to send an XHR request
function getNoHrefLinkWarning(options, link, warnings) {
    if (options.noHrefAttr == 'true') {
        if (!link.hasAttribute("href")) {
            warnings.push("Link does not have an href attribute");
        }
    }
    return warnings;
}

function getParseDOMWarning(options, url, response, warnings) {
    if (options.parseDOM == 'true') {
        if (200 <= response.status && response.status < 400) {
            var parser = new DOMParser();
            var responseDoc = parser.parseFromString(response.document, "text/html");
            var fragID;
            if (url.lastIndexOf("#") !== -1 && url.lastIndexOf("#") < url.length - 1) {
                fragID = url.substring(url.lastIndexOf("#") + 1, url.length);
                log("fragID");
                log(fragID);
                log(responseDoc.getElementById(fragID) || responseDoc.getElementsByName(fragID));
                if (!(responseDoc.getElementById(fragID)) && (responseDoc.getElementsByName(fragID).length <= 0)) {
                    warnings.push("Unable to find element to match hashtag");
                }
            }
        }
    }
    return warnings;
}

// OPTIONS: Management

// OPTIONS: Set items in localstore
function setItem(key, value) {
    try {
        log("Inside setItem:" + key + ":" + value);
        window.localStorage.removeItem(key);
        window.localStorage.setItem(key, value);
    } catch (e) {
        log("Error inside setItem");
        log(e);
    }
    log("Return from setItem" + key + ":" + value);
}

// OPTIONS: Get items from localstore
function getItem(key) {
    var value;
    log('Get Item:' + key);
    try {
        value = window.localStorage.getItem(key);
        if (typeof value === 'undefined') {
            return null;
        }
    } catch (e) {
        log("Error inside getItem() for key:" + key);
        log(e);
        value = null;
    }

    log("Returning value: " + value);
    return value;
}

function getOption(key) {
    var value;
    var defaultOptions = {
        blacklist: "googleleads.g.doubleclick.net\n" +
            "doubleclick.net\n" +
            "googleadservices.com\n" +
            "www.googleadservices.com\n" +
            "googlesyndication.com\n" +
            "adservices.google.com\n" +
            "appliedsemantics.com",
        checkType: "GET",
        cache: "false",
        noFollow: "false",
        parseDOM: "false",
        trailingHash: "false",
        emptyLink: "false",
        noHrefAttr: "false",
        autoCheck: "false",
        optionsURL: chrome.extension.getURL("options.html")
    };
    // Get Option from LocalStorage
    value = getItem(key);
    // Default the value if it does not exist in LocalStorage and a default value is defined above
    if ((value === null || value == "null") && (key in defaultOptions)) {
        setItem(key, defaultOptions[key]);
        value = defaultOptions[key];
    }
    return value;
}

// OPTIONS: Zap all items in localstore
function clearStrg() {
    log('about to clear local storage');
    window.localStorage.clear();
    log('cleared');
}

function log(txt) {
    if (logging) {
        console.log(txt);
    }
}

function getOptions() {
    var options = {};
    options.blacklist = getOption("blacklist");
    options.checkType = getOption("checkType");
    options.cache = getOption("cache");
    options.noFollow = getOption("noFollow");
    options.parseDOM = getOption("parseDOM");
    options.trailingHash = getOption("trailingHash");
    options.emptyLink = getOption("emptyLink");
    options.noHrefAttr = getOption("noHrefAttr");
    options.autoCheck = getOption("autoCheck");
    options.optionsURL = getOption("optionsURL");
    return options;
}

function onRequest(request, sender, callback) {
    if (request.action == "check") {
        if (request.url) {
            var options = getOptions();
            var promise;
            var response = { status: null, document: null };
            if (XHRisNecessary(options, request.url) === true) {
                check(request.url)
                    .then(function (response) {
                        if (options.cache == 'true' && (200 <= response.status && response.status < 400)) {
                            // Add link to database
                            indexedDBHelper.addLink(request.url, response.status);
                        }
                        return new Promise(function (resolve, reject) { resolve(response); });
                    })
                    .then(function (response) {
                        callback(response);
                    });
            } else {
                // Caching is true
                indexedDBHelper.getLink(request.url).then(function (link) {
                    if (typeof (link) != "undefined" && (200 <= link.status && link.status < 400)) {
                        log("found");
                        log(link);
                        response.status = link.status;
                    } else {
                        response = check(request.url);
                    }
                    return new Promise(function (resolve, reject) { resolve(response); });
                })
                    .then(function (response) {
                        if ((response.source == "xhr") && (200 <= response.status && response.status < 400)) {
                            // Add link to database
                            indexedDBHelper.addLink(request.url, response.status);
                        }
                        return new Promise(function (resolve, reject) { resolve(response); });
                    })
                    .then(function (response) {
                        callback(response);
                    });
            }
        }
        return false;
    }
}
