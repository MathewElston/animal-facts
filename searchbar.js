async function createMainCard(animal) {
    // Search results are displayed to main picture card
    const resultImg= document.getElementById('results');
    const resultHeader = document.getElementById('animalName');

    //display animal name of first result
    resultHeader.innerText = animal.name;

    //display slogan if exists
    const slogan = document.getElementById('slogan');
    if (animal.characteristics.slogan) {
        slogan.innerText = animal.characteristics.slogan;
    } else {
        slogan.innerText = " ";
    }
    

    //call image api
    const data = await fetchImages("query=the animal "+animal.name); 
    //get landscape image and diplay to main card
    const imageSource = data.photos[0].src.landscape;
    resultImg.src = imageSource;

    //display photographer Name to main card 
    const photographerName = document.getElementById('photographerName');
    photographerName.innerText = " Taken by " + data.photos[0].photographer + " on Pexels.";
}


async function createFactCards(animal) {
    //get fact card section div 
    const factCardSection = document.getElementById('factCardSection');

    //call image api
    const imgData = await fetchImages("query=animal "+animal.name); 
    
    
    let htmlContent = '';
    let imgCount = 0;

    //iterate over every fact section in animal obj {name, taxonomy, location, characteristics}
    for (const section in animal) {

        // skip animal[0]/the animal's name
        if (!(section == 'name')) {
            ++imgCount;

            //create htmlContent with img, photographer attribution, fact section name
            htmlContent += '<div class="col">' +
                                '<div class="card h-100">' +
                                    '<figure>' +
                                        '<img src='+ imgData.photos[imgCount].src.portrait +' class="card-img-top" alt="...">' +
                                        '<figcaption><small class="text-body-secondary"> Taken by '+ imgData.photos[imgCount].photographer +' on Pexels.</small></figcaption>' +
                                    '</figure>' +
                                    '<div class="card-body">' +
                                        '<h5 class="card-title">' + section +'</h5>' +
                                        '<p class="card-text"> <ul class="list-unstyled"> ';

            // iterate over every fact in the section, add fact name and the fact to htmlContent
            for (const fact in animal[section]) {
                htmlContent += '<li><strong>' + section + ': </strong>' + animal[section][fact] + '</li>';
            }

            //Close off the htmlContent and add footer(footer makes cards the same height)
            htmlContent += '</ul> </p> </div>' +
                            '<div class="card-footer"></div>' +
                            '</div>  </div>';
        }
    }

    // Insert htmlContent into the HTML container
    factCardSection.innerHTML = htmlContent;
}



async function searchAnimal() {
    //get user input
    const searchInput = document.getElementById('searchInput').value;

    //Fetches animals 
    const animals = await fetchAnimals("name="+searchInput);
    const firstResult = animals[0];
    
    //call function to display maincard
    createMainCard(firstResult);

    //call function to display fact cards
    createFactCards(firstResult);
}