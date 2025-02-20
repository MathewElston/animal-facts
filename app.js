const searchButton = document.getElementById("btnSearchAnimals");

searchButton.onclick = async () => {
    const userInput = getAnimalInput("searchInput");
    const animalData = await getAnimalResults(userInput);
    await displayAnimalResults("results", animalData);
}