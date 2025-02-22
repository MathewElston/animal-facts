//Function to create history bar using array of data

function createHistoryBar(){
    //Create variable for sidebar element in HTML doc
    const parent = document.getElementById("history_sidebar");
    //const title = document.createElement("div");

    parent.innerHTML = "";

    //title.textContent = "History:";
    //parent.appendChild(title);

    if (db.history.length === 0) {
        parent.textContent = "You dont have any history!";
        return;
    }

    //For loop to iterate through each element in array
    for (let i = 0; i < db.history.length; i++){

        //Create variables for a new div and paragraph
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");


        const href = document.createElement("href");
        href.setAttribute("class", "link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover");

        // TO-DO change to this later
        // const delButton = document.createElement("button");
        // delButton.innerHTML = "❌";
        // delButton.setAttribute("name", db.history[i].animal.name);
        // delButton.onclick = (delButton) => {
        //     db.removeFavorite(delButton.getAttribute("name"));
        //     createHistoryBar();
        // }

        //Set the innertext of the paragraph to the current element
        href.innerText = db.history[i].animal.name;

        //TO-DO replace this style of adding the button later
        href.innerHTML += " <button name=\"" + db.history[i].animal.name + "\" onclick=\"deleteHistory(this)\">❌</button><br>";

        //Append the new paragraph to the new div and the div to the HTML doc
        li.appendChild(href);
        //paragraph.appendChild(delButton);
        parent.appendChild(li);
        
    }
}

function deleteHistory(button) {
    console.log(button.getAttribute("name"));
    db.removeHistory(button.getAttribute("name"))
    createHistoryBar();
}