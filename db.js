//TO-DO make comments nice :)

// this object effectively acts as a namespace for our database methods and properties
// TO-DO maybe swap db to a class and make favorites and history private with accessors
var db = {
    favoritesKey : "af_favorites", // TO-DO const syntax
    historyKey : "af_history",
    maxFavorites : 20,
    maxHistory: 3,
    localStorageAccess : false, // whether or not we can access localStorage
    favorites : [],
    history : [],

    // checks whether localStorage is available for use
    // returnes true if avaiable, and false if not
    // also sets the localStorageAccess flag
    // will split this up later if we ever need to check storage without setting the flag
    checkStorage : function() {
        try {
            localStorage.setItem("TestKey", "TestValue");
            localStorage.removeItem("TestKey");
            this.localStorageAccess = true;
            return true;
        }
        catch (e) {
            this.localStorageAccess = false;
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
        if (!this.localStorageAccess ||
            localStorage.getItem(this.favoritesKey) === null ||
            localStorage.getItem(this.favoritesKey) === "") {
            return false;
        }

        this.favorites = JSON.parse(localStorage.getItem(this.favoritesKey));
        // TO-DO: check integrity of array (dupes)
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
        if (!this.localStorageAccess) { return false; }
        // add a new element to the array with our favorites data
        this.favorites.push({
            name: name,
            desc: desc,
            image: image,
            time: Date.now()
        });

        // if the size is greater than max remove the oldest element
        while (this.favorites.length > this.maxFavorites) {
            this.favorites.shift();
        }
        this.saveFavorites();
        this.checkStorage();
    },

    // remove a favorite animal by name
    // returns true if favorite was removed and false if no such favorite
    // remove functions ignore localStorageAccess and attempt to delete anyway since storage may just be full
    // they also run checkStorage again to see if there's now free space to store new information
    removeFavorite : function(name) {
        var elementRemoved = false; // true if an element was found and removed
        for (var fCnt = 0; fCnt < this.favorites.length; fCnt++) {
            console.log("fCnt " + fCnt);
            if (this.favorites[fCnt].name === name) { // loop through the entire array just in case there are dupes
                this.favorites.splice(fCnt, 1); // remove the named element
                fCnt--; // decrement the count to correct for removed item
                elementRemoved = true;
            }
        }
        this.saveFavorites();
        this.checkStorage();
        return elementRemoved;
    },

    loadHistory : function() {
        if (!this.localStorageAccess ||
            localStorage.getItem(this.historyKey) === null ||
            localStorage.getItem(this.historyKey) === "") {
                return false;
            }

        this.history = JSON.parse(localStorage.getItem(this.historyKey));
        // TO-DO: check integrity of array (dupes)
        return true;
    },

    saveHistory : function() {
        if (!this.localStorageAccess) { return false; }
        localStorage.setItem(this.historyKey, JSON.stringify(this.history));
        this.checkStorage();
        return true;
    },

    // add to user history, will automatically take a timestamp as well
    // returns true if successful and false if not
    addHistory : function(name, desc, image) {
        if (!this.localStorageAccess) { return false; }
        // add a new element to the array with our history data
        this.history.push({
            name : name,
            desc : desc,
            image : image,
            time: Date.now()
        });

        // if the size is greater than max remove the oldest element
        while (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.saveHistory();
        this.checkStorage();
    },

    // remove from user history by name
    // returns true if history was removed and false if no such history
    removeHistory : function (name) {
        var elementRemoved = false; // true if an element was found and removed
        for (var hCnt = 0; hCnt < this.history.length; hCnt++) {
            if (this.history[hCnt].name === name) { // loop through the entire array just in case there are dupes
                this.history.splice(hCnt, 1); // remove the named element
                hCnt--; // decrement the count to correct for removed item
                elementRemoved = true;
            }
        }
        this.saveHistory();
        this.checkStorage();
        return elementRemoved;
    },

    // clear all user history
    // clears both the localStorage history key and the history array
    // returns true if successful and false if localStorage cant be accessed
    clearHistory : function () {
        if (!this.localStorageAccess) { return false; }
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