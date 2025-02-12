const placeholderData = {
  locations: ["Africa", "Asia", "Eurasia"],
};
async function createFactCard(parentId, title, text) {
  const parent = document.getElementById(parentId);
  const cardDiv = document.createElement("div");
  const cardBody = document.createElement("div");
  const cardTitle = document.createElement("h5");
  const cardText = document.createElement("p");

  const children = [cardDiv, cardBody, cardTitle, cardText];

  cardDiv.classList.add("card");
  cardBody.classList.add("card-body");
  cardTitle.classList.add("card-title");
  cardText.classList.add("card-text");

  cardTitle.innerText = title;
  cardText.innerText = text;

  for (const child of children) {
    parent.appendChild(child);
  }
}
