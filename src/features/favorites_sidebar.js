//Function to create favorites bar using array of data

async function createFavoritesBar() {
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


        const href = document.createElement("href");
        href.setAttribute("class", "link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover");

        
        //Set the innertext of the paragraph to the current element
        href.textContent = db.favorites[i].animal.name;

        li.addEventListener('mouseover', iconHoverIn);

        
        
        //Create sorting buttons
        await createClickIcon(li, "bi bi-caret-down-fill", db.favorites[i].animal.name, moveFavoriteDown).then((icon)=> {
            icon.setAttribute("id", "hoverIcon");
        })

        await createClickIcon(li, "bi bi-caret-up-fill", db.favorites[i].animal.name, moveFavoriteUp).then((icon)=> {
            icon.setAttribute("id", "hoverIcon");
        })



        //Append the new paragraph to the new div and the div to the HTML doc
        li.appendChild(href);

        //Create delete button
        await createClickIcon(li, "bi bi-star-fill", db.favorites[i].animal.name, deleteFavorite).then((icon)=> {
            icon.setAttribute("id", "hoverIcon");
        })
        
        //paragraph.appendChild(delButton);
        parent.appendChild(li);

    }
}

function deleteFavorite(animal) {
    db.removeFavorite(animal)
}

function moveFavoriteUp(animal) {
    db.moveFavoriteUp(animal)
}

function moveFavoriteDown(animal) {
    db.moveFavoriteDown(animal)
}

function iconHoverIn(icon) {
    icon.target.addEventListener('mouseout', iconHoverOut);
    icon.target.removeEventListener('mouseover', iconHoverIn);
    for (const child of icon.target.children) {
        if (child.getAttribute("id") === "hoverIcon")
            child.hidden = false;
        }
}

function iconHoverOut(icon) {
    icon.target.addEventListener('mouseover', iconHoverIn);
    icon.target.removeEventListener('mouseout', iconHoverOut);
    for (const child of icon.target.children) {
        if (child.getAttribute("id") === "hoverIcon")
            child.hidden = true;
        }
}