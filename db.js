//TO-DO make commentts nice :)

// this object effectively acts as a namespace for our database methods and properties
var db = {
    favoritesKey : "af_favorites", // TO-DO const syntax
    historyKey : "af_history",
    maxFavorites : 20,
    maxHistory: 20,
    localStorageAccess : false, // whether or not we can access localStorage
    favorites : [],
    history : [],

    // checks whether localStorage is available for use
    // returnes true if avaiable, and false if not
    // also sets the localStorageAccess flag
    checkStorage : function() {
        try {
            localStorage.setItem("TestKey", "TestValue");
            localStorage.removeItem("TestKey");
            localStorageAccess = true;
            return true;
        }
        catch (e) {
            localStorageAccess = false;
            console.error(e);
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
    },

    loadFavorites : function() {
        if (!localStorageAccess || localStorage.getItem(this.favoritesKey) === null) { return false; }
        // TO-DO: check integrity of array (dupes)
        this.favorites = localStorage.getItem(this.favoritesKey).JSON();
        return true;
    },

    saveFavorites : function() {
        if (!this.localStorageAccess) { return false; }
        localStorage.setItem(this.favoritesKey, JSON.stringify(this.favorites));
        this.checkStorage();
        return true;
    },

    // add a new favorite animal, will automatically take a timestamp as well
    // returns true if successful and false if not
    addFavorite : function(name, desc, image) {
        if (!localStorageAccess) { return false; }

        this.checkStorage();
    },

    // remove a favorite animal by name
    // returns true if favorite was removed and false if no such favorite
    // remove functions ignore localStorageAccess and attempt to delete anyway since storage may just be full
    // they also run checkStorage again to see if there's now free space to store new information
    removeFavorite : function(name) {

        this.checkStorage();
        return true;
    },

    loadHistory : function() {
        if (!localStorageAccess || localStorage.getItem(this.historyKey) === null) { return false; }
        // TO-DO: check integrity of array (dupes)
        this.history = JSON.parse(localStorage.getItem(this.historyKey));
        return true;
    },

    saveHistory : function() {
        if (!localStorageAccess) { return false; }
        localStorage.setItem(this.historyKey, JSON.stringify(this.history));
        this.checkStorage();
        return true;
    },

    // add to user history, will automatically take a timestamp as well
    // returns true if successful and false if not
    addHistory : function(name, desc, image) {
        if (!localStorageAccess) { return false; }
        // add a new element to the array with our history data
        this.history.push({
            name : name,
            desc : desc,
            image : image,
            time: Date.now()
        });

        // if the size is greater than max remove the oldest element
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.saveHistory();
        this.checkStorage();
    },

    // remove from user history by name
    // returns true if history was removed and false if no such history
    removeHistory : function (name) {

        this.checkStorage();
        return true;
    },

    // clear all user history
    // clears both the localStorage history key and the history array
    // returns true if successful and false if localStorage cant be accessed
    clearHistory : function () {
        console.log("here");
        if (!localStorageAccess) { return false; }
        try {
            this.history = [];
            localStorage.setItem(this.historyKey, "");
            this.checkStorage();
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
}

