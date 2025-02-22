//Function to create favorites bar using array of data

function createFavoritesBar() {
    //Create variable for sidebar element in HTML doc
    const parent = document.getElementById("favorites_sidebar");
    const title = document.createElement("div");

    parent.innerHTML = "";

    title.textContent = "Favorites:";
    parent.appendChild(title);

    if (db.favorites.length === 0) {
        parent.textContent = "You dont have any favorites!";
        return;
    }

    //For loop to iterate through each element in array
    for (let i = 0; i < db.favorites.length; i++) {

        //Create variables for a new div and paragraph
        const div = document.createElement("div");
        const paragraph = document.createElement("p");

        //Set the innertext of the paragraph to the current element
        paragraph.innerText = db.favorites[i].animal.name;

        //TO-DO replace this style of adding the button later
        paragraph.innerHTML += " <button name=\"" + db.favorites[i].animal.name + "\" onclick=\"deleteFavorite(this)\">💀</button><br>";

        //Append the new paragraph to the new div and the div to the HTML doc
        div.appendChild(paragraph);
        //paragraph.appendChild(delButton);
        parent.appendChild(div);

    }
}

function deleteFavorite(button) {
    console.log(button.getAttribute("name"));
    db.removeFavorite(button.getAttribute("name"))
    createFavoritesBar();
}