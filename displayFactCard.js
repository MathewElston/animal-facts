const placeholderData = {
  locations: ["Africa", "Asia", "Eurasia"],
};
async function displayFactCard(parentId, title, text) {
  const parent = document.getElementById(parentId);
  const colDiv = document.createElement("div");
  const cardDiv = document.createElement("div");
  const cardBody = document.createElement("div");
  const cardTitle = document.createElement("h5");
  const cardText = document.createElement("p");

  colDiv.classList.add("col-md-4");
  cardDiv.classList.add("card", "mb-3");
  cardBody.classList.add("card-body");
  cardTitle.classList.add("card-title");
  cardText.classList.add("card-text");

  cardTitle.innerText = title;
  cardText.innerText = text;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardDiv.appendChild(cardBody);
  colDiv.appendChild(cardDiv);
  parent.appendChild(colDiv);
}

function testCard() {
    displayFactCard("fact-cards-row","Locations",placeholderData.locations[0]);
}
