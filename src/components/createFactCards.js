// to format strings (handle underscores, camelCase, and capitalizing)
function formatString(str) {
  str = str.replaceAll('_', ' '); //replace underscores with spaces
  str = str.replace(/([a-z])([A-Z])/g, '$1, $2'); //add commas between merged camelCase words
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); //sentence case
}


// function to generate the HTML for a fact card
function generateFactCard(facts, sectionTitle, image) {
  let html = 
    '<div class="col">' +
      '<div class="card h-100">' +
        '<figure>' +
          '<img src="'+ image.src.portrait +'" class="card-img-top" alt="...">' +
          '<figcaption><small class="text-body-secondary">Taken by '+ image.photographer +' on Pexels.</small></figcaption>' +
        '</figure>' +
        '<div class="card-body">' +
          '<h5 class="card-title">'+ formatString(sectionTitle) +'</h5>' +
          '<p class="card-text">' +
            '<ul class="list-unstyled">';

  facts.forEach(([fact, value]) => {
    if (fact) {
      // Normal key-value pairs (e.g., taxonomy, characteristics)
      html += '<li><strong>'+ formatString(fact) +': </strong>'+ formatString(value) +'</li>';
    } else {
      // Only value (for locations)
      html += '<li>' + formatString(value) + '</li>';
    }
  });

  //iterate over facts in 

  html += '</ul></p></div>' +
          '<div class="card-footer"></div>' +
        '</div>' +
      '</div>';
  
  return html;
}


async function createFactCards(animal, animalPictures) {
  const factCardSection = document.getElementById('factCardSection');

  let htmlContent = '';
  let imgCount = 0;
  //filter out 'name' key
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
        htmlContent += generateFactCard(factSubset, 'Characteristics', animalPictures.photos[++imgCount]);
      }

      continue; //skip the rest of the loop for the current section

    } else {
      // For other sections (taxonomy), just process normally
      facts = Object.entries(animal[section]);
    }

    //create fact cards taxononmy and locations
    htmlContent += generateFactCard(facts, section, animalPictures.photos[++imgCount]);
  }
  //insert the html content
  factCardSection.innerHTML = htmlContent;
}