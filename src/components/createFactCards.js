// to format strings (handle underscores, camelCase, and capitalizing)
function formatString(str) {
  str = str.replaceAll('_', ' '); //replace underscores with spaces
  str = str.replace(/([a-z])([A-Z])/g, '$1, $2'); //add commas between merged camelCase words
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); //sentence case
}


// function to generate the HTML for a fact card
function generateFactCard(facts, sectionTitle, image) {
  const imageSource =  image?.src?.original || "assets/animal_placeholder.jpg";
  const photographer = image 
    ? `Taken by ${image.photographer || "Unknown"} on Pexels.` 
    : "Image not found on Pexels.";

  //start the html content for the card
  let html = 
    `<div class="col">
      <div class="card h-100">
        <figure>
          <img src="${imageSource}" class="card-img-top img-fluid" style="object-fit: cover;">
          <figcaption><small class="text-body-secondary">${photographer}</small></figcaption>
        </figure>
        <div class="card-body">
          <h5 class="card-title">${formatString(sectionTitle)}</h5>
          <p class="card-text">
            <ul class="list-unstyled">`;

  //iterate over each fact in the section
  facts.forEach(([fact, value]) => {
    if (fact) {
      //add normal key-value pairs for taxonomy and characteristics
      html += `<li><strong>${formatString(fact)}: </strong>${formatString(value)}</li>`;
    } else {
      //add only the values for the locations section
      html += `<li>${formatString(value)}</li>`;
    }
  });

  //add the ending html content
  html += `</ul></p></div>
          <div class="card-footer"></div>
        </div>
      </div>`;
  
  return html;
}

//if animalPictures goes through the picResultFilter then animalPictures is already animalPictures.photos
function createFactCards(animal, animalPictures) {
  const factCardSection = document.getElementById('factCardSection');

  let htmlContent = '';
  let imgCount = 0;
  //filter out 'name' key to remove the name section
  let sections = Object.keys(animal).filter(section => section !== 'name'); 

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    let facts = [];

    if (section === "locations") {
      //process locations as a list of values (no keys, just locations)
      facts = animal[section].map(location => [null, location]);

    } else if (section === "characteristics") {
      //remove 'slogan' and 'most_distinctive_feature' from the facts (display in main card instead)
      facts = Object.entries(animal[section]).filter(([key]) => 
        key !== "slogan" && key !== "most_distinctive_feature"
      );

      //split characteristics into multiple cards
      const chunkSize = Math.ceil(facts.length / 4);
      for (let j = 0; j < facts.length; j += chunkSize) {
        const factSubset = facts.slice(j, j + chunkSize);
        
        //create fact cards for characteristics
        htmlContent += generateFactCard(factSubset, 'Characteristics', animalPictures[++imgCount]);
      }

      continue; //skip the rest of the loop for the current section

    } else {
      //for taxonomy just process normally
      facts = Object.entries(animal[section]);
    }

    //create fact cards taxononmy and locations
    htmlContent += generateFactCard(facts, section, animalPictures[++imgCount]);
  }
  
  //insert the html content
  factCardSection.innerHTML = htmlContent;
}