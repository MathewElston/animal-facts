//Function to create history bar using array of data

function createHistoryBar(){
    const pexelsFormatting = "?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=40&w=40";

    //Create variable for sidebar element in HTML doc
    const parent = document.getElementById("history_sidebar");
    //console.log(parent.querySelector("input[name='animalList']"));
    //const listTemplate = parent.querySelector("input[name='animalList']").cloneNode(true);
    const listTemplate = parent.children[0].cloneNode(true);

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
        var li = listTemplate.cloneNode(true);

        // TO-DO change this to use querySelector later
        function nestedIterate(node) {
            for (let child of node.children) {
                switch (child.getAttribute("name")) {
                    case "animalImg":
                        child.setAttribute("src", db.history[i].photos.photos[0].src.original + pexelsFormatting);
                        child.setAttribute("width", "40px");
                        child.setAttribute("height", "40px");
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
                    case "animalIcons":
                        child.textContent = "";
                        //Create delete button
                        createClickIcon(child, "bi bi-trash", db.history[i].animal.name, (animal) => { db.removeHistory(animal) }).then((icon) => {
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

        //Append the new paragraph to the new div and the div to the HTML doc
        parent.appendChild(li);

        
        
    }
}