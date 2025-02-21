async function getAnimalResults(searchInput) {
    const animalResults = await fetchAnimals("name="+searchInput);
    return animalResults

}