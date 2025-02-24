console.log("localStorageAccess: " + db.checkStorage());
db.loadHistory();
db.loadFavorites();

if (db.history.length === 0) {
    db.DEV_fillDummyHistory(15);
}

if (db.favorites.length === 0) {
    db.DEV_fillDummyFavorites(15);
}
createHistoryBar();
createFavoritesBar();

// Test
/* const imagebutton = document.getElementById("picturebutton");
imagebutton.onclick = async()=> 
{
    const image = await fetchImages("query=cheetah");
    console.log("afterfetch");
    console.log(image.photos[0]);
   await displayPicture("photo-container", image.photos[0], width = 500, height = 350);

} */

const searchButton = document.getElementById("btnSearchAnimals");
let animalData;
let selectedAnimal;
let animalPictures;

searchButton.onclick = async () => {
    const userInput = getAnimalInput("searchInput");
    animalData = await getAnimalResults(userInput);
    await displayAnimalResults("resultsContainer", animalData, async (animal)=> {
        console.log("Animal Clicked: ", animal);
        animalPictures = await fetchImages("query="+animal.name);
        searchAnimal(animal,animalPictures);

    });
}
