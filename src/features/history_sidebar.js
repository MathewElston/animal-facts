//Create global variables for sidebar element in HTML doc
const historySidebar = document.getElementById("history_sidebar");
const historyTemplate = historySidebar.children[0].cloneNode(true);

//Function to create history bar using array of data

function createHistoryBar(){
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    clearHistoryButton.style.cursor = "pointer";
    clearHistoryButton.addEventListener("click", () => {db.clearHistory();});

    const pexelsFormatting = "?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=50&w=50";

    historySidebar.innerHTML = "";

    if (db.history.length === 0) {
        historySidebar.textContent = "You dont have any history!";
        return;
    }

    //For loop to iterate through each element in array
    for (let i = 0; i < db.history.length; i++){

        //Create the list item we'll be editing from the template
        var li = historyTemplate.cloneNode(true);

        // TO-DO change this to use querySelector later
        function nestedIterate(node) {
            for (let child of node.children) {
                switch (child.getAttribute("name")) {
                    case "animalImg":
                        child.setAttribute("src", db.history[i].photos.photos[0].src.original + pexelsFormatting);
                        break;
                    case "animalName":
                        child.textContent = db.history[i].animal.name;
                        break;
                    case "animalMotto":
                        child.textContent = db.history[i].animal.characteristics.slogan;
                        if (child.textContent == "") {
                            child.textContent = db.history[i].animal.taxonomy.scientific_name;
                        }
                        break;
                    case "animalDate":
                        child.textContent = new Date(db.history[i].time).toLocaleDateString("en-US", {
                            hour:"numeric", minute:"numeric"
                        });
                        break;
                    case "removeIcon":
                        child.textContent = "";
                        //Create delete button
                        createClickIcon(child, "bi bi-x-lg", db.history[i], (animal) => { db.removeHistory(animal) }).then((icon) => {
                            icon.setAttribute("id", "hoverIcon");
                            icon.setAttribute("title", "Delete");
                            icon.style.visibility = "hidden";
                        })
                        break;
                    case "addFavIcons":
                        child.textContent = "";
                        //Create add favorite button
                        if (db.favorites.some((e) => e.animal.name === db.history[i].animal.name)) { // if the animal is a favorite
                            createClickIcon(child, "bi bi-star-fill", db.history[i], (animal) => { db.removeFavorite(animal) }).then((icon) => {
                                icon.setAttribute("id", "hoverIcon");
                                icon.setAttribute("title", "Remove Favorite");
                                icon.style.visibility = "hidden";
                            })
                        }
                        else {
                            createClickIcon(child, "bi bi-star", db.history[i], (animal) => { db.addFavorite(animal); }).then((icon) => {
                                icon.setAttribute("id", "hoverIcon");
                                icon.setAttribute("title", "Add Favorite");
                                icon.style.visibility = "hidden";
                            })
                        }
                        
                        break;
                }
                nestedIterate(child);
            }
        }
        nestedIterate(li);
        li.addEventListener("click", () => {
            searchAnimal(db.history[i].animal, db.history[i].photos)
        });
        li.addEventListener('mouseenter', iconHoverIn);

        historySidebar.appendChild(li);
    }
}