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

        //Set the innertext of the paragraph to the current element
        href.innerText = db.history[i].animal.name;

        //Create delete button
        createClickIcon(li, "bi bi-trash", db.history[i].animal.name, deleteHistory);

        //Append the new paragraph to the new div and the div to the HTML doc
        li.appendChild(href);
        //paragraph.appendChild(delButton);
        parent.appendChild(li);

        
        
    }
}

function deleteHistory(button) {
    console.log(button);
    db.removeHistory(button)
}