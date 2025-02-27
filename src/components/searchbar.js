async function getAnimalResults(searchInput) {
    const animalResults = await fetchAnimals("name="+searchInput);
    return animalResults
}

async function searchAnimal(animal,animalPictures) {    
    //call function to display maincard
    await createMainCard(animal,animalPictures);

    //call function to display fact cards
    await createFactCards(animal,animalPictures);
}                