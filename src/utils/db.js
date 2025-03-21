//TO-DO make comments nice :)

// this class effectively acts as a namespace for our database methods and properties
db = new class {
    #favoritesKey = "af_favorites"; // TO-DO const syntax
    #historyKey = "af_history";
    #sortKey = "af_sort";
    #maxFavorites = 20;
    #maxHistory = 20;
    #localStorageAccess = false; // whether or not we can access localStorage
    #favorites = [];
    #history = [];
    #historyCallbacks = []; // callbacks for when #history is saved
    #favoritesCallbacks = []; // callbacks for when #favorites is saved
    #sortOrder = "descending"; // the order of the favorites sort feature
    #sortType = "name"; // the last type of sort conducted

    // generic accessors
    //get favoritesKey() { return this.#favoritesKey; } // should not ever need to be accessed outside class
    //get historyKey() { return this.#historyKey; } // should not ever need to be accessed outside class
    get maxFavorites() { return this.#maxFavorites; }
    get maxHistory() { return this.#maxHistory; }
    get favorites() { return this.#favorites; }
    get history() { return this.#history; }
    get sortOrder() { return this.#sortOrder; }

    toggleFavSort() {
        this.#sortOrder = (this.#sortOrder === "descending" ? "ascending" : "descending");
        //this.#saveFavorites();
        this.sortFavorites(this.#sortType, this.#sortOrder);
        //return this.#sortFavDescending;
    }

    // checks whether localStorage is available for use
    // returnes true if avaiable, and false if not
    // also sets the #localStorageAccess flag effectively making this an accessor
    // will create a localStorageAccess getter if needed later
    checkStorage = function() {
        try {
            localStorage.setItem("TestKey", "TestValue");
            localStorage.removeItem("TestKey");
            this.#localStorageAccess = true;
            return true;
        }
        catch (e) {
            this.#localStorageAccess = false;
            console.error(e);
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
    }

    // TO-DO consider setting favorites key to "" when not loaded
    // consider returning true when favorites was ""
    loadFavorites = function() {
        if (!this.#localStorageAccess ||
            localStorage.getItem(this.#favoritesKey) === null ||
            localStorage.getItem(this.#favoritesKey) === "") {
            return false;
        }

        // load the sort order
        if (!localStorage.getItem(this.#sortKey) === null && // if we've saved a sort order before
            !localStorage.getItem(this.#sortKey) === "") {
            var sortData = JSON.parse(localStorage.getItem(this.#sortKey));
            this.#sortOrder = sortData.sortOrder;
            this.#sortType = sortData.sortType;
            }

        this.#favorites = JSON.parse(localStorage.getItem(this.#favoritesKey));

        // validate schema and delete entries that are invalid
        for (var loadIndex = 0; loadIndex < this.#favorites.length; loadIndex++) {
            if(this.#validateSchema(this.#favorites[loadIndex]) === false) {
                this.#favorites.splice(loadIndex, 1);
                loadIndex--;
            }
        }

        // TO-DO: check integrity of array (dupes)
        return true;
    }

    #validateSchema = function(animalObj) {
        // try to access the essential fields, return false if any fail
        var reqs = [
            animalObj.animal.name,
            animalObj.animal.taxonomy,
            animalObj.animal.locations,
            animalObj.animal.characteristics,
            animalObj.photos.photos[0].photographer,
            animalObj.photos.photos[0].src.original,
            animalObj.photos.photos[0].src.tiny,
            animalObj.time,
        ];

        for (var req in reqs) {
            if (reqs[req] === undefined) {
                console.error("An animal data object has failed schema validation! The object has not been loaded and will not be included in the next save operation.");
                console.error("The missing key index was [" + req + "] and the full contents of the object are listed below.");
                console.error(animalObj);
                return false;
            }
        }
        return true;

    }

    #saveFavorites = function() {
        if (!this.#localStorageAccess) { return false; }
        localStorage.setItem(this.#favoritesKey, JSON.stringify(this.#favorites));

        // save sort order
        localStorage.setItem(this.#sortKey, JSON.stringify({"sortOrder": this.#sortOrder, "sortType": this.#sortType}));

        // call all registered callbacks when we save favorites
        for (var cbIndex = 0; cbIndex < this.#favoritesCallbacks.length; cbIndex++) {
            this.#favoritesCallbacks[cbIndex]();
        }
        this.checkStorage();
        return true;
    }

    registerFavoritesCallback(callback) {
        this.#favoritesCallbacks.push(callback);
    }

    // add a new favorite animal, will automatically take a timestamp as well
    // returns true if successful and false if not
    addFavorite = function(animalData) {
        // add/update the timestamp for the animal data
        animalData["time"] = Date.now();

        if (!this.#localStorageAccess || !this.#validateSchema(animalData)) { return false; }

        // remove existing entries (will only remove first)
        var dupeIndex = this.#favorites.findIndex((e) => { return e.animal.name === animalData.animal.name; });

        if (dupeIndex >= 0) {
            this.#favorites.splice(dupeIndex, 1);
        }

        // add a new element to the array with our favorites data
        this.#favorites.push(animalData);

        // if the size is greater than max remove the oldest element
        while (this.#favorites.length > this.#maxFavorites) {
            this.#favorites.shift();
        }
        this.#saveFavorites();
        this.checkStorage();
    }

    // remove a favorite animal by name
    // returns true if favorite was removed and false if no such favorite
    // remove functions ignore #localStorageAccess and attempt to delete anyway since storage may just be full
    // they also run checkStorage again to see if there's now free space to store new information
    removeFavorite = function(animal) {
        var elementRemoved = false; // true if an element was found and removed
        for (var fCnt = 0; fCnt < this.#favorites.length; fCnt++) {
            if (this.#favorites[fCnt].animal.name.toUpperCase() === animal.animal.name.toUpperCase()) { // loop through the entire array just in case there are dupes
                this.#favorites.splice(fCnt, 1); // remove the named element
                fCnt--; // decrement the count to correct for removed item
                elementRemoved = true;
            }
        }
        this.#saveFavorites();
        this.checkStorage();
        return elementRemoved;
    }

    loadHistory = function() {
        if (!this.#localStorageAccess ||
            localStorage.getItem(this.#historyKey) === null ||
            localStorage.getItem(this.#historyKey) === "") {
                return false;
            }

        this.#history = JSON.parse(localStorage.getItem(this.#historyKey));
        // TO-DO: check integrity of array (dupes)

        // validate schema and delete entries that are invalid
        for (var loadIndex = 0; loadIndex < this.#history.length; loadIndex++) {
            if (this.#validateSchema(this.#history[loadIndex]) === false) {
                this.#history.splice(loadIndex, 1);
                loadIndex--;
            }
        }

        return true;
    }

    #saveHistory = function() {
        if (!this.#localStorageAccess) { return false; }
        localStorage.setItem(this.#historyKey, JSON.stringify(this.#history));

        // call all registered callbacks when we save history
        for (var cbIndex = 0; cbIndex < this.#historyCallbacks.length; cbIndex++) {
            this.#historyCallbacks[cbIndex]();
        }
        this.checkStorage();
        return true;
    }

    registerHistoryCallback(callback) {
        this.#historyCallbacks.push(callback);
    }

    // add to user history, will automatically take a timestamp as well
    // returns true if successful and false if not
    addHistory = function(animalData) {
        // add/update the timestamp for the animal data
        animalData["time"] = Date.now();

        if (!this.#localStorageAccess || !this.#validateSchema(animalData)) { return false; }

        // add a new element to the array with our history data
        this.#history.unshift(animalData);

        // if the size is greater than max remove the oldest element
        while (this.#history.length > this.#maxHistory) {
            this.#history.pop();
        }
        this.#saveHistory();
        this.checkStorage();
    }

    // remove from user history by name
    // returns true if history was removed and false if no such history
    removeHistory = function (animal) {
        var elementRemoved = false; // true if an element was found and removed
        for (var hCnt = 0; hCnt < this.#history.length; hCnt++) {
            if (this.#history[hCnt].animal.name.toUpperCase() === animal.animal.name.toUpperCase() && // loop through the entire array just in case there are dupes
                this.#history[hCnt].time === animal.time) {
                console.log(animal.time);
                this.#history.splice(hCnt, 1); // remove the named element
                hCnt--; // decrement the count to correct for removed item
                elementRemoved = true;
            }
        }
        this.#saveHistory();
        this.checkStorage();
        return elementRemoved;
    }

    // clear all user history
    // clears both the localStorage history key and the history array
    // returns true if successful and false if localStorage cant be accessed
    clearHistory = function () {
        if (!this.#localStorageAccess) { return false; }
        try {
            this.#history = [];
            //localStorage.setItem(this.#historyKey, "");
            this.#saveHistory();
            this.checkStorage();
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    // SORTING FUNCTIONS

    // the sorting functions will complete a sort IN PLACE and will return true if successful
    // and false if not successful
    // type arguments are name and time
    // direction arguments are ascending and descending
    sortFavorites = function (type, direction = "ascending") {
        // check direction parameter validity
        if (direction !== "ascending" && direction !== "descending") {
            return false;
        }

        this.#sortType = type;

        // invert the sorting direction if we're sorting descending
        var directionMult = (direction === "descending" ? 1 : -1);

        // sort the array based on the parameters sent
        if (type === "name") {
            this.#favorites.sort((a, b) => {
                 return (a.animal.name.localeCompare(b.animal.name)) * directionMult;
            })
        }
        else if (type === "time") {
            this.#favorites.sort((a, b) => {
                if (a.time === b.time) {
                    return 0;
                }
                return (a.time > b.time ? 1 : -1) * directionMult;
            })
        }
        else { // invalid type parameter
            return false;
        }
        
        // TO-DO implement callbacks to refresh relevant lists
        this.#saveFavorites();
        return true;
    }

    moveFavoriteUp = function(name){
        // get the index of the animal to move
        var animalIndex = this.#favorites.findIndex((e) => { return e.animal.name.toUpperCase() === name.toUpperCase(); });

        // if the named animal isnt in favorites or is at the top of the list
        if (animalIndex <= 0) {
            return false;
        }

        var toMove = this.#favorites[animalIndex];
        this.#favorites[animalIndex] = this.#favorites[animalIndex - 1];
        this.#favorites[animalIndex - 1] = toMove;

        this.#saveFavorites();
        return true;
    }

    moveFavoriteDown = function(name) {
        // get the index of the animal to move
        var animalIndex = this.#favorites.findIndex((e) => { return e.animal.name.toUpperCase() === name.toUpperCase(); });

        // if the named animal isnt in favorites or is at the bottom of the list
        if (animalIndex < 0 || animalIndex >= this.#favorites.length-1) {
            return false;
        }

        var toMove = this.#favorites[animalIndex];
        this.#favorites[animalIndex] = this.#favorites[animalIndex + 1];
        this.#favorites[animalIndex + 1] = toMove;

        this.#saveFavorites();
        return true;
    }

    // functions for filling the history and favorites storage with dummy data from #testData
    DEV_fillDummyHistory = function (amount) {
        console.warn("DEV_fillDummyHistory() used. This method is for testing purposes only.");
        for (var ii = 0; ii < amount; ii++) {
            this.addHistory(this.#testData[Math.floor(Math.random() * this.#testData.length)])
        }
    }

    DEV_fillDummyFavorites = function(amount) {
        console.warn("DEV_fillDummyFavorites() used. This method is for testing purposes only.");
        for (var ii = 0; ii < amount; ii++) {
            this.addFavorite(this.#testData[Math.floor(Math.random() * this.#testData.length)])
        }
    }
    /*************************************************************/
    /******************** TEST DATA STARTS HERE ******************/
    /*************************************************************/

    // no more definitions below this, only test data

    #testData = [
        {
            "animal": {
                "name": "Cheetah",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Mammalia",
                    "order": "Carnivora",
                    "family": "Felidae",
                    "genus": "Acinonyx",
                    "scientific_name": "Acinonyx jubatus"
                },
                "locations": [
                    "Africa",
                    "Asia",
                    "Eurasia"
                ],
                "characteristics": {
                    "prey": "Gazelle, Wildebeest, Hare",
                    "name_of_young": "Cub",
                    "group_behavior": "Solitary/Pairs",
                    "estimated_population_size": "8,500",
                    "biggest_threat": "Habitat loss",
                    "most_distinctive_feature": "Yellowish fur covered in small black spots",
                    "gestation_period": "90 days",
                    "habitat": "Open grassland",
                    "diet": "Carnivore",
                    "average_litter_size": "3",
                    "lifestyle": "Diurnal",
                    "common_name": "Cheetah",
                    "number_of_species": "5",
                    "location": "Asia and Africa",
                    "slogan": "The fastest land mammal in the world!",
                    "group": "Mammal",
                    "color": "BrownYellowBlackTan",
                    "skin_type": "Fur",
                    "top_speed": "70 mph",
                    "lifespan": "10 - 12 years",
                    "weight": "40kg - 65kg (88lbs - 140lbs)",
                    "height": "115cm - 136cm (45in - 53in)",
                    "age_of_sexual_maturity": "20 - 24 months",
                    "age_of_weaning": "3 months"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },
        {
            "animal": {
                "name": "Gazelle",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Mammalia",
                    "order": "Artiodactyla",
                    "family": "Bovidae",
                    "genus": "Gazella",
                    "scientific_name": "Gazella gazella"
                },
                "locations": [
                    "Africa",
                    "Asia"
                ],
                "characteristics": {
                    "name_of_young": "fawns",
                    "group_behavior": "Herd",
                    "estimated_population_size": "<500",
                    "biggest_threat": "hunting",
                    "most_distinctive_feature": "Long curved horns",
                    "gestation_period": "5-6 months",
                    "litter_size": "1-2",
                    "habitat": "Grasslands, savannas, shrubby steppes",
                    "predators": "Lions, leopards, cheetahs, hyenas, wolves",
                    "diet": "Herbivore",
                    "type": "mammal",
                    "common_name": "gazelle",
                    "number_of_species": "16",
                    "location": "Africa, Asia",
                    "group": "herd",
                    "color": "BrownYellowBlackWhite",
                    "skin_type": "Fur",
                    "top_speed": "60 mph",
                    "lifespan": "10-12 years",
                    "weight": "26 to 165 lbs.",
                    "height": "2.0 to 3.6 feet",
                    "length": "42.0 to 49.0 feet",
                    "age_of_sexual_maturity": "1 year (males) to 1.5 years (females)",
                    "age_of_weaning": "2-3 months"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },

        {
            "animal": {
                "name": "Cape Lion",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Mammalia",
                    "order": "Carnivora",
                    "family": "Felidae",
                    "genus": "Panthera",
                    "scientific_name": "Panthera leo melanochaitus"
                },
                "locations": [
                    "Africa"
                ],
                "characteristics": {
                    "prey": "Wildebeests, antelopes, zebras, buffalos, rodents, and more",
                    "name_of_young": "cub",
                    "group_behavior": "Pride",
                    "biggest_threat": "Habitat loss and hunting",
                    "most_distinctive_feature": "The male’s dark-colored mane",
                    "gestation_period": "around 100 days",
                    "litter_size": "1-6 cubs",
                    "habitat": "plains",
                    "diet": "Carnivore",
                    "type": "mammal",
                    "common_name": "Cape Lion",
                    "origin": "South Africa",
                    "number_of_species": "1",
                    "location": "South Africa",
                    "color": "BrownYellowWhiteOrange",
                    "skin_type": "Hair",
                    "top_speed": "48 mph",
                    "lifespan": "25 years",
                    "weight": "up to 600 pounds",
                    "height": "4 feet",
                    "length": "6-7 feet",
                    "age_of_sexual_maturity": "3-4 years",
                    "age_of_weaning": "6-7 months"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },
        {
            "animal": {
                "name": "Golden Lion Tamarin",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Mammalia",
                    "order": "Primates",
                    "family": "Callitrichidae",
                    "genus": "Leontopithecus",
                    "scientific_name": "Leontopithecus rosalia"
                },
                "locations": [
                    "South-America"
                ],
                "characteristics": {
                    "main_prey": "Fruit, Insects, Small Mammals, Small Reptiles",
                    "habitat": "Lowland tropical forest",
                    "predators": "Hawks, Wild Cats, Snakes, Rats",
                    "diet": "Omnivore",
                    "average_litter_size": "2",
                    "lifestyle": "Troop",
                    "favorite_food": "Fruit",
                    "type": "Mammal",
                    "slogan": "Native to the eastern rainforests of Brazil!",
                    "color": "BrownBlackGoldOrange",
                    "skin_type": "Hair",
                    "top_speed": "24 mph",
                    "lifespan": "8-15 years",
                    "weight": "550-700g (19-25oz)"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },
        {
            "animal": {
                "name": "Lion",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Mammalia",
                    "order": "Carnivora",
                    "family": "Felidae",
                    "genus": "Panthera",
                    "scientific_name": "Panthera leo"
                },
                "locations": [
                    "Africa",
                    "Asia"
                ],
                "characteristics": {
                    "prey": "Antelope, Warthog, Zebra",
                    "name_of_young": "Cub",
                    "group_behavior": "Pride",
                    "estimated_population_size": "23,000",
                    "biggest_threat": "Habitat loss",
                    "most_distinctive_feature": "Long and thick hairy mane of the male around the face",
                    "other_name(s)": "African Lion",
                    "gestation_period": "110 days",
                    "habitat": "open woodland, scrub, grassland",
                    "diet": "Carnivore",
                    "average_litter_size": "3",
                    "lifestyle": "Diurnal/Nocturnal",
                    "common_name": "Lion",
                    "number_of_species": "2",
                    "location": "sub-Saharan Africa",
                    "slogan": "Lives in small groups called prides!",
                    "group": "Mammal",
                    "color": "BrownGoldTawnyBlonde",
                    "skin_type": "Fur",
                    "top_speed": "35 mph",
                    "lifespan": "8 - 15 years",
                    "weight": "120kg - 249kg (264lbs - 550lbs)",
                    "length": "1.4m - 2.5m (4.7ft - 8.2ft)",
                    "age_of_sexual_maturity": "2 - 3 years",
                    "age_of_weaning": "6 months"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },
        {
            "animal": {
                "name": "Lion’s Mane Jellyfish",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Cnidaria",
                    "class": "Scyphozoa",
                    "order": "Semaeostomeae",
                    "family": "Cyaneidae",
                    "genus": "Cyanea",
                    "scientific_name": "Cyanea capillata"
                },
                "locations": [
                    "Ocean"
                ],
                "characteristics": {
                    "prey": "Fish, zooplankton, shrimp, other jellyfish",
                    "group_behavior": "Solitary/School",
                    "estimated_population_size": "Possibly millions its IUCN conservation status is unevaluated, but not in danger of extinction",
                    "biggest_threat": "Pollution",
                    "most_distinctive_feature": "Its size",
                    "other_name(s)": "Giant jellyfish, hair jellyfish, hair jellyfish, mane jellyfish, Arctic red jellyfish, sea nettle, sea blubber, winter jellyfish",
                    "gestation_period": "One day",
                    "water_type": "Salt",
                    "optimum_ph_level": "8.1",
                    "habitat": "Cooler ocean waters",
                    "predators": "Seabirds, sea turtles, anemones, ocean sunfish, larger jellies but only when the jellyfish is a juvenile.",
                    "diet": "Carnivore",
                    "type": "Cnidarian",
                    "common_name": "Lion’s Mane Jellyfish",
                    "number_of_species": "1",
                    "color": "YellowRedWhiteOrangePurple",
                    "lifespan": "One year",
                    "weight": "200 pounds",
                    "length": "As much as 120 feet"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },
        {
            "animal": {
                "name": "Lionfish",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Actinopterygii",
                    "order": "Scorpaeniformes",
                    "family": "Scorpaenidae",
                    "genus": "Pterois",
                    "scientific_name": "Pterois volitans"
                },
                "locations": [
                    "Ocean"
                ],
                "characteristics": {
                    "main_prey": "Fish, Shrimp, Crabs",
                    "distinctive_feature": "Striped body markings with long spines",
                    "water_type": "Salt",
                    "optimum_ph_level": "8.1 - 8.4",
                    "habitat": "Tropical reefs and rocky crevices",
                    "predators": "Eels, Frogfish, Scorpion Fish",
                    "diet": "Carnivore",
                    "favorite_food": "Fish",
                    "common_name": "Lionfish",
                    "average_clutch_size": "8000",
                    "slogan": "Females can release up to 15,000 eggs at a time!",
                    "color": "BrownRedBlackWhiteOrange",
                    "skin_type": "Scales",
                    "lifespan": "10 - 18 years",
                    "length": "30cm - 35cm (12in - 14in)"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },
        {
            "animal": {
                "name": "Mountain Lion",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Mammalia",
                    "order": "Carnivora",
                    "family": "Felidae",
                    "genus": "Puma",
                    "scientific_name": "Felis Concolor"
                },
                "locations": [
                    "Central-America",
                    "North-America",
                    "South-America"
                ],
                "characteristics": {
                    "main_prey": "Deer, Elk, Beavers",
                    "litter_size": "3",
                    "habitat": "Forest and mountainous regions",
                    "predators": "Human, Grizzly Bear",
                    "diet": "Carnivore",
                    "lifestyle": "Solitary",
                    "favorite_food": "Deer",
                    "type": "Mammal",
                    "origin": "3",
                    "slogan": "Has no real natural predators!",
                    "color": "BrownBlackTan",
                    "skin_type": "Fur",
                    "top_speed": "30 mph",
                    "lifespan": "10-20 years",
                    "weight": "29-90kg (64-198lbs)"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        },
        {
            "animal": {
                "name": "Sea Lion",
                "taxonomy": {
                    "kingdom": "Animalia",
                    "phylum": "Chordata",
                    "class": "Mammalia",
                    "order": "Carnivora",
                    "family": "Otariidae",
                    "scientific_name": "Otariidae"
                },
                "locations": [
                    "Ocean"
                ],
                "characteristics": {
                    "main_prey": "Fish, Crabs, Squid",
                    "habitat": "Coastal waters and rocky shorelines",
                    "predators": "Human, Sharks, Killer Whale",
                    "diet": "Omnivore",
                    "average_litter_size": "1",
                    "lifestyle": "Herd",
                    "favorite_food": "Fish",
                    "type": "Mammal",
                    "slogan": "It's flippers allow it to walk on the land",
                    "color": "BrownGreyTan",
                    "skin_type": "Fur",
                    "top_speed": "27 mph",
                    "lifespan": "15-22 years",
                    "weight": "300-1,000kg (660-2,200lbs)"
                }
            },
            "photos": {
                "total_results": 10000,
                "page": 1,
                "per_page": 1,
                "photos": [
                    {
                        "id": 3573351,
                        "width": 3066,
                        "height": 3968,
                        "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
                        "photographer": "Lukas Rodriguez",
                        "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
                        "photographer_id": 1845331,
                        "avg_color": "#374824",
                        "src": {
                            "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
                            "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                            "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
                            "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
                            "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
                            "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                            "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                            "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
                        },
                        "liked": false,
                        "alt": "Brown Rocks During Golden Hour"
                    }
                ],
                "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
            }
        }
    ];
}