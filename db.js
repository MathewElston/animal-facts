// this object effectively acts as a namespace for our database methods and properties
var db = {

    // checks whether localStorage is available for use
    checkStorage : function() {
        try {
            localStorage.setItem("TestKey", "TestValue");
            localStorage.removeItem("TestKey");
            return true;
        }
        catch (e) {
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
        
    },

    // add a new key value pair to the database
    new : function(key, value) {

    }
}