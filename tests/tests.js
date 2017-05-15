QUnit.config.reorder = false;
QUnit.module("Generic Functions");

QUnit.test("test the startsWith function", function(assert) {
    assert.equal("http://example.com".startsWith("http://"), true, "startsWith should return true when string startsWith passed string");
    assert.equal("http://".startsWith("http://"), true, "startsWith should return true when passed equals string");
    assert.equal("https://example.com".startsWith("example"), false, "startsWith should return false when string contains passed string but does not start with passed string");
    assert.equal("mailto:example@example.com".startsWith("http://"), false, "startsWith should return false when string does not start with passed string");
    assert.equal("".startsWith("http://"), false, "startsWith on empty string should return false");
    assert.equal("example".startsWith(""), true, "startsWith should return true when passed an empty string");
});

QUnit.test("test the contains function", function(assert) {
    assert.equal("http://example.com".contains("http://"), true, "contains should return true when string starts with passed string");
    assert.equal("http://".contains("http://"), true, "contains should return true when contains equals string");
    assert.equal("https://example.com".contains("example"), true, "contains should return true when string is in string");
    assert.equal("mailto:example@example.com".contains("http://"), false, "contains should return false when does not start with");
    assert.equal("".contains("http://"), false, "contains on empty string should return false");
    assert.equal("example".startsWith(""), true, "contains should return true when passed an empty string");
});

QUnit.test("test the rtrim function", function(assert) {
    assert.equal(",link1,link2,link3,link4,,".rtrim(','), ",link1,link2,link3,link4", "rtrim only trims from the end of the string");
});


QUnit.module("Generic DOM functions", {
  beforeEach: function() {
    // prepare something for all following tests
    var moduleContainer = document.createElement('div');
    moduleContainer.id = 'moduleContainer';
    document.getElementById("qunit-fixture").appendChild(moduleContainer);
    
    var moduleElement1 = document.createElement('div');
    moduleElement1.className = 'moduleclass';
    moduleElement1.id = 'moduleElement1';
    document.getElementById("qunit-fixture").appendChild(moduleElement1);

    var moduleElement2 = document.createElement('div');
    moduleElement2.className = 'moduleclass';
    moduleElement2.id = 'moduleElement2';
    document.getElementById("qunit-fixture").appendChild(moduleElement2);

    var moduleElement3 = document.createElement('div');
    moduleElement3.className = 'othermoduleclass';
    moduleElement3.id = 'moduleElement3';
    document.getElementById("qunit-fixture").appendChild(moduleElement3);
  },
  afterEach: function() {
    // clean up after each test
    if(document.getElementById('moduleContainer')){
        document.getElementById('moduleContainer').remove();
    }
  }
});

QUnit.test("test the removeDOMElement function", function(assert) {
    var exists;
    exists = document.getElementById('moduleContainer');
    assert.notEqual(exists, null, "element exists");
    removeDOMElement('moduleContainer');
    exists = document.getElementById('moduleContainer');
    assert.equal(exists, null, "element should not exist after removeDOMElement by id is run");
    removeDOMElement('moduleContainer');
    exists = document.getElementById('moduleContainer');
    assert.equal(exists, null, "remove element that does not exist by id is run");
});

QUnit.test("test the removeElementsByClass function", function(assert) {
    var exists;
    removeElementsByClass('moduleclass');

    exists = document.getElementById('moduleElement3');
    assert.notEqual(exists, null, "element without the class should still exist");

    exists = document.getElementById('moduleElement1');
    assert.equal(exists, null, "element with the class should not exist");

    exists = document.getElementById('moduleElement2');
    assert.equal(exists, null, "element with the class should not exist");
});

QUnit.test("test the removeClassFromElements function", function(assert) {
    assert.equal(moduleElement1.classList.contains('moduleclass'), true, "class exists before removed");
    removeClassFromElements('moduleclass');
    assert.equal(moduleElement1.classList.contains('moduleclass'), false, "class no longer exists after removed");
});

QUnit.test("test the removeClassFromElements function", function(assert) {
    assert.equal(moduleElement1.classList.contains('moduleclass'), true, "class exists before removed");
    removeClassFromElements('moduleclass');
    assert.equal(moduleElement1.classList.contains('moduleclass'), false, "class no longer exists after removed");
});
QUnit.test("test the create function", function(assert) {
    assert.equal($("[id=createdElement]").length,0,"Created element does not exist until create is called");
    assert.equal($("[id=htmlElement]").length,0,"HTML element does not exist until create is called");
    var createdElement = create("div", {
        id: "createdElement",
        innerText:"This is innerText"
    });
    var htmlElement = create("div", {
        id: "htmlElement",
        innerHTML:"<p>This is innerHTML</p>",
        class:"class1 class2"
    });
    document.getElementById("qunit-fixture").appendChild(createdElement);
    document.getElementById("qunit-fixture").appendChild(htmlElement);
    assert.equal($("[id=createdElement]").length, 1, "Created element does exist after create is called");
    assert.equal($("[id=htmlElement]").length, 1, "HTML element does exist after create is called");
    assert.equal($("[id=createdElement]").prop("innerText"), "This is innerText", "Create element innerText is set when create is called");
    assert.equal($("[id=htmlElement]").prop("innerHTML"), "<p>This is innerHTML</p>", "HTML element innerHTML is set when create is called");
    assert.equal($(".class1.class2").length, 1, "Element classes are set");
});


QUnit.module("Determining Valid Links", {
  beforeEach: function() {
    // prepare something for all following tests
    this.request = {nf:'false'};
    this.blacklist = "";
  }
});

QUnit.test("test the isLinkValid function", function(assert) {
    assert.equal(isLinkValid({href:"http://google.com"},this.request,this.blacklist), true, "http links are valid");
    assert.equal(isLinkValid({href:""},this.request,this.blacklist), true, "empty links are valid so that they can be marked as a warning (option pending)");
    assert.equal(isLinkValid({href:"#"},this.request,this.blacklist), false, "hashtag links are not valid and are marked as a warning,when chrome has a hashtag link it prepends the current url which resolves to valid link http://example.com# below");
    assert.equal(isLinkValid({href:"http://example.com#"},this.request,this.blacklist), true, "links that end with hashtags are valid");

    assert.equal(isLinkValid({href:"https://google.com"},this.request,this.blacklist), true, "https links are valid");
    assert.equal(isLinkValid({href:"chrome-extension://"},this.request,this.blacklist), false, "chrome extension links are invalid and don't need to be checked");
    assert.equal(isLinkValid({href:"mailto:ex@example.com"},this.request,this.blacklist), false, "mailto links are invalid and don't need to be checked");
    assert.equal(isLinkValid({href:"http://example.com#hashtag"},this.request,this.blacklist), true, "links with hashtags are valid");
    assert.equal(isLinkValid({href:"http://example.com",rel:"nofollow"},this.request,this.blacklist), false, "links with rel='nofollow' are not to be checked when option setting nofollow is false");
    assert.equal(isLinkValid({href:"file://local/machine/path/index.html"},this.request,this.blacklist), false, "file links are not valid");
    this.blacklist = "example.com";
    assert.equal(isLinkValid({href:"http://example.com#"},this.request,this.blacklist), false, "links that end with hashtags and are blacklisted are invalid");
    assert.equal(isLinkValid({href:"http://example.com#hashtag"},this.request,this.blacklist), false, "links with hashtags and are blacklisted are invalid");
    assert.equal(isLinkValid({href:"http://example.com",rel:"nofollow"},this.request,this.blacklist), false, "links with rel='nofollow' are not to be checked when option setting nofollow is false and is blacklisted");
    this.request = {nf:'true'};
    assert.equal(isLinkValid({href:"http://example.com",rel:"nofollow"},this.request,this.blacklist), false, "links with rel='nofollow' are not to be checked when option setting nofollow is true and are blacklisted");
    this.blacklist = "";
    assert.equal(isLinkValid({href:"http://example.com",rel:"nofollow"},this.request,this.blacklist), true, "links with rel='nofollow' are to be checked when option setting nofollow is true");
});

QUnit.test("test the shouldDOMbeParsed function", function(assert) {
    var checkType = "GET";
    assert.equal(shouldDOMbeParsed("http://www.example.com","false",checkType), false, "DOM should not be parsed when setting is 'false' regardless of URL");
    assert.equal(shouldDOMbeParsed("http://www.example.com#elementID","false",checkType), false, "DOM should not be parsed when setting is 'false' regardless of URL");
    assert.equal(shouldDOMbeParsed("http://www.example.com","true",checkType), false, "DOM should not be parsed when url does not contain hashtag");
    assert.equal(shouldDOMbeParsed("http://www.example.com#elementID","true",checkType), true, "DOM should be parsed when setting is 'true' and url contains hashtag after last slash");
    assert.equal(shouldDOMbeParsed("http://www.example.com/#/pageID","true",checkType), false, "DOM should not be parsed when setting is 'true' and url lastindexOf '#' is less than lastIndexOf '/'");
    assert.equal(shouldDOMbeParsed("http://www.example.com#","false",checkType), false, "DOM should not be parsed when it is just a trailing hash");
    assert.equal(shouldDOMbeParsed("http://www.example.com#","true",checkType), false, "DOM should not be parsed when it is just a trailing hash");
    checkType = "HEAD";
    assert.equal(shouldDOMbeParsed("http://www.example.com","false",checkType), false, "DOM should not be parsed when setting is 'false' regardless of URL");
    assert.equal(shouldDOMbeParsed("http://www.example.com#elementID","false",checkType), false, "DOM should not be parsed when setting is 'false' regardless of URL");
    assert.equal(shouldDOMbeParsed("http://www.example.com","true",checkType), false, "DOM should not be parsed when url does not contain hashtag");
    assert.equal(shouldDOMbeParsed("http://www.example.com#elementID","true",checkType), false, "DOM should be not parsed when setting is 'true', url contains hashtag after last slash, and request type is HEAD.  If request type is not GET then the document is not fetched and therefore cannot be parsed.");
    assert.equal(shouldDOMbeParsed("http://www.example.com/#/pageID","true",checkType), false, "DOM should not be parsed when setting is 'true' and url lastindexOf '#' is less than lastIndexOf '/'");
    assert.equal(shouldDOMbeParsed("http://www.example.com#","false",checkType), false, "DOM should not be parsed when it is just a trailing hash");
    assert.equal(shouldDOMbeParsed("http://www.example.com#","true",checkType), false, "DOM should not be parsed when it is just a trailing hash");
});

QUnit.test("test the XHRisNecessary function", function(assert) {
    var stub = sinon.stub(window,"shouldDOMbeParsed");
    stub.returns(false);
    XHRisNecessary({cache:"false"},"http://example.com/");
    assert.ok(shouldDOMbeParsed.called);
    assert.equal(XHRisNecessary({cache:"true"},"http://example.com/"), false, "XHR is not necessary when caching is true and there is not an element to find");
    assert.equal(XHRisNecessary({cache:"false"},"http://example.com/"), true, "XHR is necessary when caching is false and parsing is false");
    stub.returns(true);
    assert.equal(XHRisNecessary({cache:"true"},"http://example.com/"), true, "XHR is necessary when caching is true and dom should be parsed");
    assert.equal(XHRisNecessary({cache:"false"},"http://example.com/"), true, "XHR is necessary when caching is false and dom should be parsed");
});


QUnit.module("Display", {
  beforeEach: function() {
    this.optURL = "options.html";
    this.cache = "false";
    this.checkType = "GET";
  },
  afterEach:function(){
    clearDisplay();
  }
});

QUnit.test("test the createDisplay function", function(assert) {
    assert.equal($("[id=CMY_ReportBox]").length, 0, "Report does not exist until createDisplay is called");
    createDisplay(this.optURL,this.cache,this.checkType);
    assert.equal($("[id=CMY_ReportBox]").length, 1, "Report exists after createDisplay is called");
    assert.equal($("[id=CMY_RB_Header]").length, 1, "Report Box element CMY_RB_Header is created");
    assert.equal($("[id=CMY_RB_LC_Left]").length, 1, "Report Box element CMY_RB_LC_Left is created");
    assert.equal($("[id=CMY_RB_LC_Right]").length, 1, "Report Box element CMY_RB_LC_Right is created");
    assert.equal($("[id=CMY_RB_Options]").length, 1, "Report Box element CMY_RB_Options is created");
    assert.equal($("[id=CMY_RB_Pass]").length, 1, "Report Box element CMY_RB_Pass is created");
    assert.equal($("[id=CMY_RB_Warning]").length, 1, "Report Box element CMY_RB_Warning is created");
    assert.equal($("[id=CMY_RB_Fail]").length, 1, "Report Box element CMY_RB_Fail is created");
    assert.equal($("[id=CMY_RB_Close]").length, 1, "Report Box element CMY_RB_Close is created");
    assert.equal($("[id=CMY_RB_Export]").length, 1, "Report Box element CMY_RB_Export is created");
    assert.equal($("[id=CMY_RB_Settings]").length, 1, "Report Box element CMY_RB_Settings is created");
    assert.equal($("[id=CMY_RB_Cache]").length, 1, "Report Box element CMY_RB_Cache is created");
    assert.equal($("[id=CMY_RB_RequestType]").length, 1, "Report Box element CMY_RB_RequestType is created");
    createDisplay(this.optURL,this.cache,this.checkType);
    assert.equal($("[id=CMY_ReportBox]").length, 1, "Only one report box exists after createDisplay is called");
});

QUnit.test("test the clearDisplay function", function(assert) {
    createDisplay(this.optURL,this.cache,this.checkType);
    var aLink = document.createElement('div');
    aLink.className = 'CMY_Link';
    document.getElementById("qunit-fixture").appendChild(aLink);
    assert.equal($(".CMY_Link").length, 1, "One Link has been created.");
    assert.equal($("[id=CMY_ReportBox]").length, 1, "ReportBox Exists");
    clearDisplay();
    assert.equal($(".CMY_Link").length, 0, "Links do not exist after clearDisplay is called");
    assert.equal($("[id=CMY_ReportBox]").length, 0, "Report does not exist after clearDisplay is called");
});


QUnit.module("Warnings");

QUnit.test("test the warnings functions", function(assert) {
    var link = document.createElement('a');
    link.setAttribute('href', 'http://example.com/');
    var emptyLink = document.createElement('a');
    emptyLink.setAttribute('href', "");
    var noHrefLink = document.createElement('a');

    document.getElementById("qunit-fixture").appendChild(link);
    document.getElementById("qunit-fixture").appendChild(emptyLink);
    document.getElementById("qunit-fixture").appendChild(noHrefLink);
    // no hash
    assert.deepEqual(getTrailingHashWarning({trailingHash:"false"},link,[]), [], "warning should not be appended when option is false");
    assert.deepEqual(getTrailingHashWarning({trailingHash:"true"},link,[]), [], "warning should be not appended when option is true and there is not a trailing hash");
    // trailing hash
    link.setAttribute('href', 'http://example.com/#');
    assert.deepEqual(getTrailingHashWarning({trailingHash:"false"},link,[]), [], "warning should not be appended when option is false");
    assert.deepEqual(getTrailingHashWarning({trailingHash:"true"},link,[]), ["Link has a trailing hash"], "warning should be appended when option is true and there is a trailing hash");

    // not a trailing hash without value
    link.setAttribute('href', 'http://example.com/#value');
    assert.deepEqual(getTrailingHashWarning({trailingHash:"false"},link,[]), [], "warning should not be appended when option is false");
    assert.deepEqual(getTrailingHashWarning({trailingHash:"true"},link,[]), [], "warning should not be appended when option is true and there is a trailing hash with a value");

    // a /#/ hash
    link.setAttribute('href', 'http://example.com/#/');
    assert.deepEqual(getTrailingHashWarning({trailingHash:"false"},link,[]), [], "warning should not be appended when option is false");
    assert.deepEqual(getTrailingHashWarning({trailingHash:"true"},link,[]), [], "warning should not be appended when option is true and there is a slash after the hash");

    assert.deepEqual(getTrailingHashWarning({trailingHash:"true"},emptyLink,[]), [], "warning should not be appended when option is true and link is empty");
    assert.deepEqual(getTrailingHashWarning({trailingHash:"true"},noHrefLink,[]), [], "warning should not be appended when option is true and link does not have an href attribute");

    // need to check the outerHTML because chrome inputs current url for empty href tags
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"false"},emptyLink,[]), [], "warning should not be appended when option is false");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a href=''>",[]), ["Link is empty"], "warning should be appended when option is true and link is empty");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a href=\"\">",[]), ["Link is empty"], "warning should be appended when option is true and link is empty");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a href ='  '>",[]), ["Link is empty"], "warning should be appended when option is true and link is empty");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a href= \"  \">",[]), ["Link is empty"], "warning should be appended when option is true and link is empty");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a HREF=''>",[]), ["Link is empty"], "warning should be appended when option is true and link is empty");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a>",[]), [], "warning should not be appended when option is true and link does not have an href attribute");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a>href</a>",[]), [], "warning should not be appended when option is true and link does not have an href attribute but href it within the outerhtml<a>href</a>");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a class='myclass'> Example text href</a>",[]), [], "warning should not be appended when option is true and link does not have an href attribute but href it within the outerhtml href is in the text");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},"<a>href=''</a>",[]), [], "warning should not be appended when option is true and link does not have an href attribute but href='' is within the outerhtml");
    assert.deepEqual(getEmptyLinkWarning({emptyLink:"true"},link,[]), [], "warning should not be appended when option is true and link is not empty");

    assert.deepEqual(getNoHrefLinkWarning({noHrefAttr:"false"},noHrefLink,[]), [], "warning should not be appended when option is false");
    assert.deepEqual(getNoHrefLinkWarning({noHrefAttr:"true"},noHrefLink,[]), ["Link does not have an href attribute"], "warning should be appended when option is true and there is not an href attribute");

    assert.deepEqual(getParseDOMWarning({parseDOM:"true"},"http://www.example.com",{status:200,document:""},[]), [], "warning should not be appended when there is not a hashtag in the url");
    assert.deepEqual(getParseDOMWarning({parseDOM:"false"},"http://www.example.com",{status:200,document:""},[]), [], "warning should not be appended when parse hashtag option is false");
    assert.deepEqual(getParseDOMWarning({parseDOM:"true"},"http://www.example.com",{status:404,document:""},[]), [], "warning should not be appended when result was a 404");
    assert.deepEqual(getParseDOMWarning({parseDOM:"true"},"http://www.example.com/#element",{status:200,document:"<!DOCTYPE html><html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\"><head><title>Example Page</title></head><body><div id=\"element\"></div></body></html>"},[]), [], "warning should not be appended when element is within response document");
    assert.deepEqual(getParseDOMWarning({parseDOM:"true"},"http://www.example.com/#element",{status:200,document:"<!DOCTYPE html><html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\"><head><title>Example Page</title></head><body></body></html>"},[]), ["Unable to find element to match hashtag"], "warning should not be appended when element is within response document");
    // Need get element by name test for parsing the dom true

});


QUnit.module("Local Storage getItem Function", {
  beforeEach: function() {
    // Stub out localStorage Method
    window.localStorage.getItem = sinon.stub();
  }
});

QUnit.test("test the getItem function: gets from localstorage", function(assert) {
    window.localStorage.getItem.withArgs('cache').returns("true");
    assert.equal(getItem("cache"),"true","asserting stub");
});

QUnit.test("test the getItem function: if not found", function(assert) {
    assert.equal(getItem("cache"),null,"asserting stub");
    assert.ok(window.localStorage.getItem.calledOnce);
});


QUnit.module("Local Storage setItem Function", {
  beforeEach: function() {
    // Stub out localStorage Method
    window.localStorage.setItem = sinon.stub();
  }
});

QUnit.test("test the setItem function: parameters", function(assert) {
    setItem("cache","true");
    assert.ok(window.localStorage.setItem.withArgs("cache","true").calledOnce);
});

QUnit.module("Local Storage clear Function", {
  beforeEach: function() {
    // Stub out localStorage Method
    window.localStorage.clear = sinon.stub();
  }
});

QUnit.test("test the clearStrg function:", function(assert) {
    clearStrg();
    assert.ok(window.localStorage.clear.calledOnce);
});


QUnit.module("Options", {
  beforeEach: function() {
    // Stub out localStorage Methods
    sandbox = sinon.sandbox.create();
    window.localStorage.getItem = sandbox.stub();
  },
  afterEach: function(){
    sandbox.restore();
  }
});

QUnit.test("test the getOption function do not default", function(assert) {
    window.localStorage.getItem.withArgs("blacklist").returns("http://example.com/");
    window.localStorage.getItem.withArgs("checkType").returns("GET");
    window.localStorage.getItem.withArgs("cache").returns("true");
    window.localStorage.getItem.withArgs("noFollow").returns("true");
    window.localStorage.getItem.withArgs("parseDOM").returns("true");
    window.localStorage.getItem.withArgs("trailingHash").returns("true");
    window.localStorage.getItem.withArgs("emptyLink").returns("true");
    window.localStorage.getItem.withArgs("noHrefAttr").returns("true");
    window.localStorage.getItem.withArgs("optionsURL").returns("true");
    assert.equal(getOption("blacklist"), "http://example.com/", "Testing the option value of blacklist is retrieved from LocalStorage");
    assert.equal(getOption("checkType"), "GET", "Testing the option value of checkType is retrieved from LocalStorage");
    assert.equal(getOption("cache"), "true", "Testing the option value of cache is retrieved from LocalStorage");
    assert.equal(getOption("noFollow"), "true", "Testing the option value of noFollow is retrieved from LocalStorage");
    assert.equal(getOption("parseDOM"), "true", "Testing the option value of parseDOM is retrieved from LocalStorage");
    assert.equal(getOption("trailingHash"), "true", "Testing the option value of trailingHash is retrieved from LocalStorage");
    assert.equal(getOption("emptyLink"), "true", "Testing the option value of emptyLink is retrieved from LocalStorage");
    assert.equal(getOption("noHrefAttr"), "true", "Testing the option value of noHrefAttr is retrieved from LocalStorage");
    assert.equal(getOption("optionsURL"), "true", "Testing the option value of optionsURL is retrieved from LocalStorage");
});

QUnit.test("test the getOption function Defaults", function(assert) {
    window.localStorage.getItem.returns("null");
    // Mock out chrome extension
    var mock = sinon.mock(chrome.extension);
    var expectation = mock.expects("getURL").withExactArgs("options.html").atLeast(1).returns("[optionspage]");
    assert.equal(getOption("blacklist"), "googleleads.g.doubleclick.net\n" +
                    "doubleclick.net\n" +
                    "googleadservices.com\n" +
                    "www.googleadservices.com\n" +
                    "googlesyndication.com\n" +
                    "adservices.google.com\n" +
                    "appliedsemantics.com", "Testing the default value of blacklist");
    assert.equal(getOption("checkType"), "GET", "Testing the default value of checkType");
    assert.equal(getOption("cache"), "false", "Testing the default value of cache");
    assert.equal(getOption("noFollow"), "false", "Testing the default value of noFollow");
    assert.equal(getOption("parseDOM"), "false", "Testing the default value of parseDOM");
    assert.equal(getOption("trailingHash"), "false", "Testing the default value of trailingHash");
    assert.equal(getOption("emptyLink"), "false", "Testing the default value of emptyLink");
    assert.equal(getOption("noHrefAttr"), "false", "Testing the default value of noHrefAttr");
    assert.equal(getOption("optionsURL"), "[optionspage]", "Testing the default value of optionsURL");
    mock.restore();
    mock.verify();
});

QUnit.test("test the getOptions function Defaults", function(assert) {
    sinon.spy(window, "getOption");
    getOptions();
    assert.equal(window.getOption.withArgs("blacklist").calledOnce, true, "getOption blacklist is called");
    assert.equal(window.getOption.withArgs("checkType").calledOnce, true, "getOption checkType is called");
    assert.equal(window.getOption.withArgs("cache").calledOnce, true, "getOption cache is called");
    assert.equal(window.getOption.withArgs("noFollow").calledOnce, true, "getOption noFollow is called");
    assert.equal(window.getOption.withArgs("parseDOM").calledOnce, true, "getOption parseDOM is called");
    assert.equal(window.getOption.withArgs("trailingHash").calledOnce, true, "getOption trailingHash is called");
    assert.equal(window.getOption.withArgs("emptyLink").calledOnce, true, "getOption emptyLink is called");
    assert.equal(window.getOption.withArgs("noHrefAttr").calledOnce, true, "getOption noHrefAttr is called");
    assert.equal(window.getOption.withArgs("optionsURL").calledOnce, true, "getOption optionsURL is called");
});


var sandbox;
QUnit.module("OnRequest function", {
  beforeEach: function() {
    sandbox = sinon.sandbox.create();
  },
  afterEach: function() {
    sandbox.restore();
  }
});

QUnit.test("test the onrequest function make sure addLink is called when cache is true and response is 200:", function(assert) {
    window.getOption = sandbox.stub().returns("true");
    window.XHRisNecessary = sandbox.stub().returns(true);    
    var spy = sandbox.spy(indexedDBHelper,"addLink");
    window.check = sandbox.stub().returns(new Promise(function(resolve, reject){resolve({status:200,document:null,source:"xhr"});}));
    onRequest({action:"check",url:"http://example.com/"},null,function(){});
    assert.ok(window.getOption.called);
    assert.ok(window.XHRisNecessary.called);
    var promise = check("http://example.com");
    return promise.then(function(data){
        assert.ok(check.called);
        assert.deepEqual(data, {status:200,document:null,source:"xhr"}, "assert stubbed xhr promise return");
        assert.ok(spy.called);
    });
});

QUnit.test("test the onrequest function make sure addLink is not called when cache is true and response is 404:", function(assert) {
    window.getOption = sandbox.stub().returns("true");
    window.XHRisNecessary = sandbox.stub().returns(true);    
    var spy = sandbox.spy(indexedDBHelper,"addLink");
    window.check = sandbox.stub().returns(new Promise(function(resolve, reject){resolve({status:404,document:null,source:"xhr"});}));
    onRequest({action:"check",url:"http://example.com/"},null,function(){});
    assert.ok(window.getOption.called);
    assert.ok(window.XHRisNecessary.called);
    var promise = check("http://example.com");
    return promise.then(function(data){
        assert.ok(check.called);
        assert.deepEqual(data, {status:404,document:null,source:"xhr"} ,"assert stubbed xhr promise return");
        assert.equal(spy.called, false, "addlink is not called when the result is a 404");
    });
});

QUnit.test("test the onrequest function make sure addLink is not called when cache is false and response is 200:", function(assert) {
    window.getOption = sandbox.stub().returns("false");
    window.XHRisNecessary = sandbox.stub().returns(true);    
    var spy = sandbox.spy(indexedDBHelper,"addLink");
    window.check = sandbox.stub().returns(new Promise(function(resolve, reject){resolve({status:200,document:null,source:"xhr"});}));
    onRequest({action:"check",url:"http://example.com/"},null,function(){});
    assert.ok(window.getOption.called);
    assert.ok(window.XHRisNecessary.called);
    var promise = check("http://example.com");
    return promise.then(function(data){
        assert.ok(check.called);
        assert.deepEqual(data, {status:200,document:null,source:"xhr"}, "assert stubbed xhr promise return");
        assert.equal(spy.called, false, "not called");
    });
});

QUnit.test("test the onrequest function make sure getLink is called when cache is true and addLink is not called when not found:", function(assert) {
    window.getOption = sandbox.stub().returns("true");
    window.XHRisNecessary = sandbox.stub().returns(false);    
    var stub = sandbox.stub(indexedDBHelper,"getLink").returns(new Promise(function(resolve, reject){resolve(500);}));    
    window.check = sandbox.stub().returns(new Promise(function(resolve, reject){resolve({status:200,document:null,source:"xhr"});}));
    onRequest({action:"check",url:"http://example.com/"},null,function(){});
    assert.ok(window.getOption.called);
    assert.ok(window.XHRisNecessary.called);
    var promise = check("http://example.com");
    return promise.then(function(data){
        assert.ok(check.called);
        assert.deepEqual(data, {status:200,document:null,source:"xhr"}, "assert stubbed xhr promise return");
        assert.ok(stub.called);
    });
});

QUnit.test("test the onrequest function make sure getLink is called when cache is true and addLink is called when found 200:", function(assert) {
    window.getOption = sandbox.stub().returns("true");
    window.XHRisNecessary = sandbox.stub().returns(false);    
    var stub = sandbox.stub(indexedDBHelper,"getLink").returns(new Promise(function(resolve, reject){resolve({status:200});}));    
    window.check = sandbox.stub().returns(new Promise(function(resolve, reject){resolve({status:200,document:null,source:"xhr"});}));
    onRequest({action:"check",url:"http://example.com/"},null,function(){});
    assert.ok(window.getOption.called);
    assert.ok(window.XHRisNecessary.called);
    var promise = check("http://example.com");
    return promise.then(function(data){
        assert.ok(check.called);
        assert.deepEqual(data, {status:200,document:null,source:"xhr"}, "assert stubbed xhr promise return");
        assert.ok(stub.called);
    });
});


QUnit.module("UpdateDisplay", {
  beforeEach: function() {
    passed = 0;
    warning = 0;
    invalid = 0;
    queued = 2;
    checked = 0;
    link = document.createElement('a');
    link.setAttribute('href', 'http://example.com/');
    link2 = document.createElement('a');
    link2.setAttribute('href', 'http://example.com/');
    createDisplay("optionsurl","true","GET");
    document.getElementById("qunit-fixture").appendChild(link);
    document.getElementById("qunit-fixture").appendChild(link2);
  },
  afterEach: function() {
    clearDisplay();
  }
});

QUnit.test("test the updateDisplay function global variables: passed", function(assert) {
    updateDisplay(link,[],200);
    assert.equal(passed, 1, "passed increased");
    assert.equal(warning, 0, "warning stayed the same");
    assert.equal(invalid, 0, "invalid stayed the same");
    assert.equal(queued, 1, "queued decreased");
    assert.equal(checked, 1, "checked increased");
});

QUnit.test("test the updateDisplay function global variables: warnings", function(assert) {
    updateDisplay(link,["Warning: Empty Link"],200);
    assert.equal(passed, 0, "passed stayed the same");
    assert.equal(warning, 1, "warning increased");
    assert.equal(invalid, 0, "invalid stayed the same");
    assert.equal(queued, 1, "queued decreased");
    assert.equal(checked, 1, "checked increased");
});

QUnit.test("test the updateDisplay function global variables: error", function(assert) {
    updateDisplay(link,[],404);
    assert.equal(passed, 0, "passed stayed the same");
    assert.equal(warning, 0, "warning stayed the same");
    assert.equal(invalid, 1, "invalid increased");
    assert.equal(queued, 1, "queued decreased");
    assert.equal(checked, 1, "checked increased");
});
QUnit.test("test the updateDisplay function global variables: dns error", function(assert) {
    updateDisplay(link,[],0);
    assert.equal(passed, 0, "passed stayed the same");
    assert.equal(warning, 0, "warning stayed the same");
    assert.equal(invalid, 1, "invalid increased");
    assert.equal(queued, 1, "queued decreased");
    assert.equal(checked, 1, "checked increased");
});
QUnit.test("test the updateDisplay function appended element: passed", function(assert) {
    updateDisplay(link,[],200);
    assert.equal(link.classList.contains("CMY_Valid"), true, "valid class");
    assert.equal(link.outerHTML.contains("<span class='CMY_Response'>"), false, "Response element not appended when passed and there aren't any warnings");
});
QUnit.test("test the updateDisplay function appended element: warning", function(assert) {
    updateDisplay(link,["Warning: Empty Link"],200);
    assert.equal(link.outerHTML.contains("<span class=\"CMY_Response\">200</span>"), true, "Response element is appended when passed and has warning");
});
QUnit.test("test the updateDisplay function appended element: error", function(assert) {
    updateDisplay(link,[],404);
    assert.equal(link.outerHTML.contains("<span class=\"CMY_Response\">404</span>"), true, "Response element is appended when failed");
});

QUnit.test("test the updateDisplay function ReportBox display", function(assert) {
    updateDisplay(link,[],200);
    assert.equal(rbPass.innerHTML, "Valid links: " + passed.toString(), "passed innerhtml is set to passed count");
    assert.equal(rbWarning.innerHTML, "Warnings: " + warning.toString(), "warning innerhtml is set to warning count");
    assert.equal(rbFail.innerHTML, "Invalid links: " + invalid.toString(), "fail innerhtml is set to fail count");
    assert.equal(rbQueue.innerHTML, "Queue: " + queued.toString(), "queue innerhtml is set to queue count");
    updateDisplay(link2,["Warning: Empty Link"],200);
    assert.equal(rbPass.innerHTML, "Valid links: " + passed.toString(), "passed innerhtml is set to passed count");
    assert.equal(rbWarning.innerHTML, "Warnings: " + warning.toString(), "warning innerhtml is set to warning count");
    assert.equal(rbFail.innerHTML, "Invalid links: " + invalid.toString(), "fail innerhtml is set to fail count");
    assert.equal(rbQueue.innerHTML, "Queue: " + queued.toString(), "queue innerhtml is set to queue count");
});