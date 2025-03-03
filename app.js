console.log("localStorageAccess: " + db.checkStorage());
db.loadHistory();
db.loadFavorites();

// if (db.history.length === 0) {
//     db.DEV_fillDummyHistory(15);
// }

// if (db.favorites.length === 0) {
//     db.DEV_fillDummyFavorites(15);
// }

db.registerFavoritesCallback(createFavoritesBar);
db.registerHistoryCallback(createHistoryBar)
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
const searchInput = document.getElementById("searchInput");

let animalData;
let selectedAnimal;
let animalPictures;

const performSearch = async () => {
    const userInput = getAnimalInput("searchInput");
    animalData = await getAnimalResults(userInput);
    await createAnimalResults("resultsContainer", animalData, async (animal)=> {
        console.log("Animal Clicked: ", animal);
        animalPictures = await fetchImages("query="+animal.name);
        searchAnimal(animal,animalPictures);

        //Adds animal to history sidebar
        db.addHistory({"animal": animal, "photos": animalPictures})

    });
}
searchButton.onclick = performSearch();

searchInput.addEventListener("keypress", (event) =>{
    if (event.key === "Enter"){
        performSearch();
    }
})
const testButton = document.getElementById('testButton');
const data = 'hi mom';
testButton.onclick = async () => {
    createClickIcon('resultsContainer','bi bi-box2-heart-fill', data, (data) => {
        console.log("Clicked", data);
    });
}
