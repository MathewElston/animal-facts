async function createMainCard(animal, animalPictures) {

    //get landscape image
    const imageSource = animalPictures.photos[0].src.landscape;

    //get slogan or/and feature if exists
    let slogan = " ";
    let feature = " ";
    if (animal.characteristics.slogan) {
        slogan = animal.characteristics.slogan;
    }
    if (animal.characteristics.most_distinctive_feature) {
        feature = "Their most distinctive feature: "+ animal.characteristics.most_distinctive_feature + "."
    }
    
    //insert the mainCardSection html
    document.getElementById('mainCardSection').innerHTML = 
        `<div class="card mb-3" style="max-width: 1200px;">
            <div class="row g-0">
            <div class="col-md-7">
                <figure>
                <img src="${imageSource}" class="img-fluid rounded-start" alt="text" >
                <figcaption><small class="text-body-secondary">Taken by ${animalPictures.photos[0].photographer} on Pexels.</small></figcaption>
                </figure>
            </div>
            <div class="col-md-5">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h5 class="card-title">${animal.name}</h5>
                    </div>
                    <div id="favoritesStarContainer"></div>
        <!-- Card text -->
                </div>
                <p class="card-text">${slogan}</p>
                <p class="card-text">${feature}</p>
                </div>
            </div>
            </div>
        </div>`;

        
    //Creates star element in fact cards, makes interactable and adds to sidebar
    displayedAnimal = animal;
    displayedPictures = animalPictures
    createFavoritesIcon();
}

function createFavoritesIcon() {
    const favStarContainer = document.getElementById("favoritesStarContainer")
    favStarContainer.innerHTML = "";

    if (db.favorites.some((e) => e.animal.name === displayedAnimal.name)) { // if the animal is a favorite
        createClickIcon(favStarContainer, "bi bi-star-fill", {"animal": displayedAnimal, "photos": displayedPictures}, (animal) => { db.removeFavorite(animal) }).then((icon) => {
            icon.setAttribute("id", "hoverIcon");
            icon.setAttribute("title", "Remove Favorite");
        })
    }
    else {
        createClickIcon(favStarContainer, "bi bi-star", { "animal": displayedAnimal, "photos": displayedPictures }, (animal) => { db.addFavorite(animal) }).then((icon) => {
            icon.setAttribute("id", "hoverIcon");
            icon.setAttribute("title", "Add Favorite");
        })
    }
}