async function getAnimalResults(searchInput) {
    const animalResults = await fetchAnimals("name="+searchInput);
    return animalResults
}

async function searchAnimal(animal,animalPictures) { 
    animalPicArray = await picResultFilter(animal, animalPictures);   
    //call function to display maincard
    await createMainCard(animal,animalPicArray);

    //call function to display fact cards
    await createFactCards(animal,animalPicArray);
}                