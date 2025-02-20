const searchButton = document.getElementById("btnSearchAnimals");
let animalData;
let selectedAnimal;

searchButton.onclick = async () => {
    const userInput = getAnimalInput("searchInput");
    animalData = await getAnimalResults(userInput);
    await displayAnimalResults("results", animalData);
}