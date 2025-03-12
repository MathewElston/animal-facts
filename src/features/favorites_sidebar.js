//Create global variables for sidebar element in HTML doc
const favoritesSidebar = document.getElementById("favorites_sidebar");
const favoritesTemplate = favoritesSidebar.children[0].cloneNode(true);

const favSortOrder = document.getElementById("favSortOrder");
const favSortName = document.getElementById("favSortName");
const favSortTime = document.getElementById("favSortTime");
favSortOrder.style.cursor = "pointer";
favSortName.style.cursor = "pointer";
favSortTime.style.cursor = "pointer";
favSortName.addEventListener("click", () => { db.sortFavorites("name", db.sortFavDescending ? "descending" : "ascending") });
favSortTime.addEventListener("click", () => { db.sortFavorites("time", db.sortFavDescending ? "descending" : "ascending") });
favSortOrder.addEventListener("click", () => { db.toggleFavSort() });

//Function to create favorites bar using array of data
function createFavoritesBar() {
    const pexelsFormatting = "?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=50&w=50";

    // set the sort order icon
    favSortOrder.setAttribute("class", "bi bi-sort-" + (db.sortFavDescending ? "down" : "up"));
    favSortOrder.setAttribute("title", "Sort " + (db.sortFavDescending ? "Descending" : "Ascending"));

    favoritesSidebar.innerHTML = "";

    if (db.favorites.length === 0) {
        favoritesSidebar.textContent = "You dont have any favorites!";
        return;
    }

    //For loop to iterate through each element in array
    for (let i = 0; i < db.favorites.length; i++) {

        //Create the list item we'll be editing from the template
        var li = favoritesTemplate.cloneNode(true);


        // TO-DO change this to use querySelector later
        function nestedIterate(node) {
            for (let child of node.children) {
                switch (child.getAttribute("name")) {
                    case "animalImg":
                        child.setAttribute("src", db.favorites[i].photos.photos[0].src.original + pexelsFormatting);
                        break;
                    case "animalName":
                        child.textContent = db.favorites[i].animal.name;
                        child.textContent = db.favorites[i].animal.name;
                        break;
                    case "animalMotto":
                        child.textContent = db.favorites[i].animal.characteristics.slogan;
                        if (child.textContent == "") {
                            child.textContent = db.favorites[i].animal.taxonomy.scientific_name;
                        }
                        break;
                        
                    case "animalDate":
                        child.textContent = new Date(db.favorites[i].time).toLocaleDateString("en-US", {
                            hour: "numeric", minute: "numeric"
                        });
                        break;
                    case "sortIcons":
                        child.textContent="";
                        //Create sorting buttons
                        createClickIcon(child, "bi bi-caret-up-fill", db.favorites[i].animal.name, (animal) => { db.moveFavoriteUp(animal) }).then((icon) => {
                            icon.setAttribute("id", "hoverIcon");
                            icon.setAttribute("title", "Move Up");
                            icon.style.visibility = "hidden"
                        })
                        createClickIcon(child, "bi bi-caret-down-fill", db.favorites[i].animal.name, (animal) => { db.moveFavoriteDown(animal) }).then((icon) => {
                            icon.setAttribute("id", "hoverIcon");
                            icon.setAttribute("title", "Move Down");
                            icon.style.visibility = "hidden"
                        })
                        break;
                    case "removeIcon":
                        child.textContent = "";
                        //Create delete button
                        createClickIcon(child, "bi bi bi-x-lg", db.favorites[i], (animal) => { db.removeFavorite(animal) }).then((icon) => {
                            icon.setAttribute("id", "hoverIcon");
                            icon.setAttribute("title", "Delete");
                            icon.style.visibility = "hidden"
                        })
                        break;
                }
                nestedIterate(child);
            }
        }
        nestedIterate(li);
        li.addEventListener("click", () => {
            displayedAnimal = db.favorites[i].animal;
            displayedPictures = db.favorites[i].photos;
            searchAnimal(db.favorites[i].animal, db.favorites[i].photos)
            db.addHistory(db.favorites[i]);
        });

        li.addEventListener('mouseenter', iconHoverIn);

        favoritesSidebar.appendChild(li);

    }
}

function iconHoverIn(icon) {
    //icon.stopPropagation();
    icon.target.addEventListener('mouseleave', iconHoverOut);
    icon.target.removeEventListener('mouseenter', iconHoverIn);
    hoverIcons = icon.target.querySelectorAll("[id='hoverIcon']");

    for (const child of hoverIcons) {
        if (child.getAttribute("id") === "hoverIcon")
            child.style.visibility = "visible"
        }
}

function iconHoverOut(icon) {
    //icon.stopPropagation();
    icon.target.addEventListener('mouseenter', iconHoverIn);
    icon.target.removeEventListener('mouseleave', iconHoverOut);
    hoverIcons = icon.target.querySelectorAll("[id='hoverIcon']");

    for (const child of hoverIcons) {
        if (child.getAttribute("id") === "hoverIcon") {
            child.style.visibility = "hidden";
        }
    }
}