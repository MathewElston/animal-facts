async function getAnimalResults(searchInput) {
    const animalResults = await fetchAnimals("name="+searchInput);
    return animalResults
}

async function createMainCard(animal, animalPictures) {
    // Search results are displayed to main picture card
    const resultImg= document.getElementById('results');
    const resultHeader = document.getElementById('animalName');

    //display animal name of first result
    resultHeader.innerText = animal.name;

    //display slogan or/and feature if exists
    const slogan = document.getElementById('slogan');
    const feature = document.getElementById('feature');
    if (animal.characteristics.slogan) {
        slogan.innerText = animal.characteristics.slogan;
    } else {
        slogan.innerText = " ";
    }
    if (animal.characteristics.most_distinctive_feature) {
        feature.innerText = "Their most distinctive feature is their "+ animal.characteristics.most_distinctive_feature + "."
    }
    else {
        feature.innerHTML = " ";
    }
    
    //get landscape image and diplay to main card
    const imageSource = animalPictures.photos[0].src.landscape;
    resultImg.src = imageSource;

    //display photographer Name to main card 
    const photographerName = document.getElementById('photographerName');
    photographerName.innerText = " Taken by " + animalPictures.photos[0].photographer + " on Pexels.";
}





async function searchAnimal(animal,animalPictures) {    
    //call function to display maincard
    await createMainCard(animal,animalPictures);

    //call function to display fact cards
    await createFactCards(animal,animalPictures);
}