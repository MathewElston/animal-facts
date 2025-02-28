//Function to create favorites bar using array of data

function createFavoritesBar() {
    //Create variable for sidebar element in HTML doc
    const parent = document.getElementById("favorites_sidebar");
    //const title = document.createElement("div");

    parent.innerHTML = "";

    //title.textContent = "Favorites:";
    //parent.appendChild(title);

    if (db.favorites.length === 0) {
        parent.textContent = "You dont have any favorites!";
        return;
    }

    //For loop to iterate through each element in array
    for (let i = 0; i < db.favorites.length; i++) {

        //Create variables for a new div and paragraph
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");


        //const href = document.createElement("href");
        //href.setAttribute("class", "link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover");

        
        //Set the innertext of the paragraph to the current element
        //href.textContent = db.favorites[i].animal.name;

        li.textContent = db.favorites[i].animal.name;

        li.addEventListener('mouseenter', iconHoverIn);

        
        
        //Create sorting buttons
        createClickIcon(li, "bi bi-caret-down-fill", db.favorites[i].animal.name, (animal) => { db.moveFavoriteDown(animal) }).then((icon)=> {
            icon.setAttribute("id", "hoverIcon");
            icon.style.visibility = "hidden"
        })

        createClickIcon(li, "bi bi-caret-up-fill", db.favorites[i].animal.name, (animal) => { db.moveFavoriteUp(animal) }).then((icon)=> {
            icon.setAttribute("id", "hoverIcon");
            icon.style.visibility = "hidden"
        })



        //Append the new paragraph to the new div and the div to the HTML doc
        //li.appendChild(href);

        //Create delete button
        createClickIcon(li, "bi bi-star-fill", db.favorites[i].animal.name, (animal) => { db.removeFavorite(animal) }).then((icon)=> {
            icon.setAttribute("id", "hoverIcon");
            icon.style.visibility = "hidden"
        })

        //paragraph.appendChild(delButton);
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