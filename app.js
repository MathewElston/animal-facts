console.log("localStorageAccess: " + db.checkStorage());
db.loadHistory();
db.loadFavorites();

db.registerFavoritesCallback(createFavoritesBar);
db.registerFavoritesCallback(createHistoryBar);
db.registerFavoritesCallback(createFavoritesIcon);
db.registerHistoryCallback(createHistoryBar);
// createHistoryBar();
// createFavoritesBar();
resizeHandler();

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
let animalPicArray;

// tl;dr this works but might be redundant; shouldn't break anything
// not sure if this is this what selectedAnimal and animalPictures are supposed to do, will clarify on wed (3/5)
// these hold the data for the currently displayed animal and are set at the bottom of createMainCard and used
// by createFavoritesIcon(), which cant have the arguments passed to it because it's registered as a callback
// whenever favorites data changes
let displayedAnimal = null;
let displayedPictures = null;

const performSearch = async () => {
    const userInput = getAnimalInput("searchInput");

    animalData = await getAnimalResults(userInput);

    await createAnimalResults("resultsContainer", animalData, async (animal)=> {
        console.log("Animal Clicked: ", animal);

        //80 is the max per page
         animalPictures = await fetchImages("query=" + animal.name);
///////////filter out irelevent pics
        //animalPicArray = await picResultFilter(animal, animalPictures);
        //Creates star element in fact cards, makes interactable and adds to sidebar
        displayedAnimal = animal;
        displayedPictures = animalPictures;

        searchAnimal(animal,animalPictures);
        

        //Adds animal to history sidebar
        db.addHistory({"animal": animal, "photos": animalPictures}); 
    });
}
searchButton.onclick = performSearch;

searchInput.addEventListener("keypress", async (event) =>{
    if (event.key === "Enter"){
        performSearch();
        clearResults();
    }
})


async function clearResults()
{
    const claim = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = '';
}

document.getElementById("btnSearchAnimals").addEventListener("click", function()
{
    const search = document.getElementById("searchInput").value;

    clearResults();
    //getAnimalResults();
})

