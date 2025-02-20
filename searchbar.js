async function displayAnimalResults(parentId, animalResults) {
    // Search results are displayed
    const parent = document.getElementById(parentId);

    for (const animal in animalResults) {
        displayFactCard(parent,animal.name, animal.characteristics);

    }
}

async function getAnimalResults(searchInput) {
    const animalResults = await fetchAnimals("name="+searchInput);
    return animalResults

}