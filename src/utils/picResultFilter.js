"use strict"

function forLoopfilter(animalPictures, animalName, common_name, other_names, animalPicArray) {
    //i = animalPictures index, iterate over animalPictures until count is 7 or i == length of animalPictures
    for (let i = 0; animalPicArray.length < 7 && i < (animalPictures.photos.length); i++) {
        //get alt text for current animalPicture at index i
        let picAltText = (animalPictures.photos[i].alt).toLowerCase().trim();

        if (
            (animalName && picAltText.includes(animalName)) || 
            (common_name && picAltText.includes(common_name)) || 
            (other_names.length != 0 && other_names.some(name => picAltText.includes(name)))
        ) {
            animalPicArray.push(animalPictures.photos[i]);
        }
    }
}

//get animal and animalPictures objects
async function picResultFilter (animal, animalPictures) {
    console.log("pic result filter");
    // get all names safely
    const animalName = (animal.name || "").toLowerCase().trim();
    const common_name = (animal.characteristics.common_name || "").toLowerCase().trim();
    
    // make sure other_names is always an array
    let other_names = (animal.characteristics['other_name(s)'] || "")
        .toLowerCase()
        .trim()
        .split(/\s*,\s*|\s+or\s+/)  // Split on ", " or " or "
        .filter(name => name.length > 0);  // Remove empty values

    //array that holds the 7 pics
    let animalPicArray = [];

    //first pass: filter from the initial API response
    forLoopfilter(animalPictures, animalName, common_name, other_names, animalPicArray);


    //if still less than 7  search the api using the scientific_name
    if (animalPicArray.length < 7 && animal.characteristics.scientific_name) {
        animalPictures = await fetchImages("query=" + animal.characteristics.scientific_name);

        forLoopfilter(animalPictures, animalName, common_name, other_names, animalPicArray);
    }

    //if still less than 7 search the api using the common names
    if (animalPicArray.length < 7 && animal.characteristics["other_name(s)"]) {
        animalPictures = await fetchImages("query=" + animal.characteristics["other_name(s)"]);

        forLoopfilter(animalPictures, animalName, common_name, other_names, animalPicArray);
    }

    //if still less than 7 search the api using the animal name with '+' in spaces (this works better than just sending animal.name but not always)
    if (animalPicArray.length < 7) {
        animalPictures = await fetchImages("query=" + (animal.name).replace(/\s+/g, "+").replace("'", ""));

        forLoopfilter(animalPictures, animalName, common_name, other_names, animalPicArray);
    }

    // if there still isnt 7 pics fill in the remaining spots with photos from last api call
    if (animalPicArray.length < 7) {
        for (let i = 0; i < 7; i++){
            animalPicArray.push(animalPictures.photos[i]);
        }
    }

    return animalPicArray;
}