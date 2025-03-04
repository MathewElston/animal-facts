//Function to create favorites bar using array of data

function createFavoritesBar() {
    const pexelsFormatting = "?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=40&w=40";

    //Create variable for sidebar element in HTML doc
    const parent = document.getElementById("favorites_sidebar");
    const listTemplate = parent.children[0].cloneNode(true);

    parent.innerHTML = "";

    if (db.favorites.length === 0) {
        parent.textContent = "You dont have any favorites!";
        return;
    }

    //For loop to iterate through each element in array
    for (let i = 0; i < db.favorites.length; i++) {

        //Create the list item we'll be editing from the template
        var li = listTemplate.cloneNode(true);


        // TO-DO change this to use querySelector later
        function nestedIterate(node) {
            for (let child of node.children) {
                switch (child.getAttribute("name")) {
                    case "animalImg":
                        child.setAttribute("src", db.favorites[i].photos.photos[0].src.original + pexelsFormatting);
                        child.setAttribute("width", "40px");
                        child.setAttribute("height", "40px");
                        break;
                    case "animalName":
                        child.textContent = db.favorites[i].animal.name;
                        child.textContent = db.history[i].animal.name;
                        child.addEventListener("click", () => {
                            searchAnimal(db.favorites[i].animal, db.favorites[i].photos)
                        });
                        break;
                    case "animalMotto":
                        child.textContent = db.favorites[i].animal.characteristics.slogan;
                        if (child.textContent == "") {
                            child.textContent = db.favorites[i].animal.taxonomy.scientific_name;
                        }
                        break;
                    case "sortIcons":
                        child.textContent = "";

                        //Create sorting buttons
                        createClickIcon(child, "bi bi-caret-up-fill", db.favorites[i].animal.name, (animal) => { db.moveFavoriteUp(animal) }).then((icon) => {
                            icon.setAttribute("id", "hoverIcon");
                            icon.style.visibility = "hidden"
                        })
                        createClickIcon(child, "bi bi-caret-down-fill", db.favorites[i].animal.name, (animal) => { db.moveFavoriteDown(animal) }).then((icon) => {
                            icon.setAttribute("id", "hoverIcon");
                            icon.style.visibility = "hidden"
                        })
                        break;
                    case "favoriteIcon":
                        child.textContent = "";
                        //Create delete button
                        createClickIcon(child, "bi bi-star-fill", db.favorites[i].animal.name, (animal) => { db.removeFavorite(animal) }).then((icon) => {
                            icon.setAttribute("id", "hoverIcon");
                            icon.style.visibility = "hidden"
                        })
                        break;
                }
                nestedIterate(child);
            }
        }
        nestedIterate(li);
        li.addEventListener('mouseenter', iconHoverIn);

        parent.appendChild(li);

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