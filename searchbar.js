async function displayAnimalResults(parentId, animalResults) {
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
        cardTitle.innerText = "Animal Slogan";
        cardText.innerText = animal.characteristics.slogan;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardDiv.appendChild(cardHeader);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        parent.appendChild(colDiv);
        console.log(animal);

        // Make the card clickable
        cardDiv.style.cursor = "pointer";
        cardDiv.addEventListener("click", () => {
            console.log("do something");
        })
    }
}

async function getAnimalResults(searchInput) {
    const animalResults = await fetchAnimals("name="+searchInput);
    return animalResults

}