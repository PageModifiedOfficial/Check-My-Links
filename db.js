var indexedDBHelper = function(){
  var db = null;
  var lastIndex = 0;

  function init() {
    //open the database
    indexedDBHelper.open();
  }

  var open = function(){
    var version = 1;

    var promise = new Promise(function(resolve, reject){
      //Opening the DB
      var request = indexedDB.open("CheckLinks", version);

      //Will be called if the database is new or the version is modified
      request.onupgradeneeded = function(e) {
        db = e.target.result;

        e.target.transaction.onerror = indexedDB.onerror;

        //Deleting DB if already exists
        if(db.objectStoreNames.contains("links")) {
          db.deleteObjectStore("links");
        }

        //Creating a new DB store with a paecified key property
        var store = db.createObjectStore("links",
          {keyPath: "id"});
        var linkIndex = store.createIndex("by_link", "link");
      };

      //If opening DB succeeds
      request.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };

      //If DB couldn't be opened for some reason
      request.onerror = function(e){
        reject("Couldn't open DB");
      };
    });
    return promise;
  };

  var addLink = function(linkURL,linkstatus) {
    //Creating a transaction object to perform read-write operations
    var trans = db.transaction(["links"], "readwrite");
    var store = trans.objectStore("links");
    lastIndex++;

    //Wrapping logic inside a promise
    var promise = new Promise(function(resolve, reject){
      //Sending a request to add an item
      var request = store.put({
        "id": lastIndex,
        "link": linkURL,
        "timeStamp": new Date().getTime(),
        "status": linkstatus
      });

      //success callback
      request.onsuccess = function(e) {
        resolve();
      };

      //error callback
      request.onerror = function(e) {
        console.log(e.value);
        reject("Couldn't add the passed item");
      };
    });

    return promise;
  };

  var getAllLinks = function() {
    var linksArr = [];
    //Creating a transaction object to perform Read operations
    var trans = db.transaction(["links"], "readonly");
    //Getting a reference of the link store
    var store = trans.objectStore("links");

    //Wrapping all the logic inside a promise
    var promise = new Promise(function(resolve, reject){
      //Opening a cursor to fetch items from lower bound in the DB
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);

      //success callback
      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;

        //Resolving the promise with link items when the result id empty
        if(result === null || result === undefined){
          resolve(linksArr);
        }
        //Pushing result into the link list
        else{
          linksArr.push(result.value);
          if(result.value.id > lastIndex){
            lastIndex = result.value.id;
          }
          result.continue();
        }
      };

      //Error callback
      cursorRequest.onerror = function(e){
        reject("Couldn't fetch items from the DB");
      };
    });
    return promise;
  };

  var deleteObjectStore = function(id) {
    indexedDBHelper.open().then(function(){
      var promise = new Promise(function(resolve, reject){
        var trans = db.transaction(["links"], "readwrite");
        var store = trans.objectStore("links");
        var request = store.clear();

        request.onsuccess = function(e) {
          resolve();
        };

        request.onerror = function(e) {
          console.log(e);
          reject("Couldn't delete the item");
        };
      });
      return promise;
    }, function(err){
      console.log(err);
    });
  };

  var getLink = function(url) {
    var linksArr = [];
    //Creating a transaction object to perform Read operations
    var trans = db.transaction(["links"], "readonly");
    //Getting a reference of the link store
    var store = trans.objectStore("links");

    //Wrapping all the logic inside a promise
    var promise = new Promise(function(resolve, reject){
      var index = store.index("by_link");
      var request = index.get(url);

      //success callback
      request.onsuccess = function(e) {
        var result = e.target.result;
        resolve(result);
      };

      //Error callback
      request.onerror = function(e){
        reject("Couldn't fetch items from the DB");
      };
    });
    return promise;
  };

  var deleteLink = function(id) {

    var promise = new Promise(function(resolve, reject){
      var trans = db.transaction(["links"], "readwrite");
      var store = trans.objectStore("links");
      var request = store.delete(id);

      request.onsuccess = function(e) {
        resolve();
      };

      request.onerror = function(e) {
        console.log(e);
        reject("Couldn't delete the item");
      };
    });

    return promise;
  };

  return{
    init: init,
    open: open,
    addLink: addLink,
    getLink: getLink,
    getAllLinks: getAllLinks,
    deleteLink: deleteLink,
    deleteObjectStore: deleteObjectStore
  };

}();

indexedDBHelper.init();