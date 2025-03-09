console.log("localStorageAccess: " + db.checkStorage());
db.loadHistory();
db.loadFavorites();

db.registerFavoritesCallback(createFavoritesBar);
db.registerFavoritesCallback(createHistoryBar);
db.registerFavoritesCallback(createFavoritesIcon);
db.registerHistoryCallback(createHistoryBar);
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

// tl;dr this works but might be redundant; shouldn't break anything
// not sure if this is this what selectedAnimal and animalPictures are supposed to do, will clarify on wed (3/5)
// these hold the data for the currently displayed animal and are set at the bottom of createMainCard and used
// by createFavoritesIcon(), which cant have the arguments passed to it because it's registered as a callback
// whenever favorites data changes
let displayedAnimal;
let displayedPictures;

const performSearch = async () => {
    const userInput = getAnimalInput("searchInput");
    animalData = await getAnimalResults(userInput);
    await createAnimalResults("resultsContainer", animalData, async (animal)=> {
        console.log("Animal Clicked: ", animal);
        animalPictures = await fetchImages("query="+animal.name);
        searchAnimal(animal,animalPictures);

        //Adds animal to history sidebar
        db.addHistory({"animal": animal, "photos": animalPictures});
       const caption =  getRelevantCaptions(animal);     
    });
}
searchButton.onclick = performSearch;

searchInput.addEventListener("keypress", async (event) =>{
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


async function clearResults()
{
    const claim = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = '';
}

document.getElementById("btnSearchAnimals").addEventListener("click", function()
{
    const search = document.getElementById("searchInput").value;

    clearResults();
    getAnimalResults();
})

