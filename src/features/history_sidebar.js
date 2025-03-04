//Create global variables for sidebar element in HTML doc
const historySidebar = document.getElementById("history_sidebar");
const historyTemplate = historySidebar.children[0].cloneNode(true);

//Function to create history bar using array of data

function createHistoryBar(){
    const pexelsFormatting = "?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=40&w=40";

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
                        child.addEventListener("click", () => {
                            searchAnimal(db.history[i].animal, db.history[i].photos)
                        });
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
                        createClickIcon(child, "bi bi-trash", db.history[i], (animal) => { db.removeHistory(animal) }).then((icon) => {
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

        historySidebar.appendChild(li);
    }
}