/** 
* @param {string} parentId - The id of the parent element to attach the 
* @param {Array} animalResults - An array of the animals data.
* @param {function} onSelect - A callback function to handle the hovered animal card
*/
async function displayAnimalResults(parentId, animalResults, onSelect) {
    // Search results are displayed
    const parent = document.getElementById(parentId);

     // for each element in array, create a card with the slogan of the animal.
    for (const animal of animalResults) {
        const colDiv = document.createElement("div");
        const cardDiv = document.createElement("div");
        const cardHeader = document.createElement("div");
        const cardBody = document.createElement("div");
        const cardTitle = document.createElement("h5");
        const cardText = document.createElement("p");

        colDiv.classList.add("col-md-4");
        cardDiv.classList.add("card", "mb-1","card-hover");
        cardHeader.classList.add("card-header");
        cardBody.classList.add("card-body");
        cardTitle.classList.add("card-title");
        cardText.classList.add("card-text");

        cardHeader.innerText = animal.name;
        cardText.innerText = animal.characteristics.slogan;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardDiv.appendChild(cardHeader);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        parent.appendChild(colDiv);

        // Make the card clickable
        cardDiv.style.cursor = "pointer";
        cardDiv.addEventListener("click", () => {
            onSelect(animal);
        })
    }
}