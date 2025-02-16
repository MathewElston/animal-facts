async function searchAnimal() {
    //User's input
    const searchInput = document.getElementById('searchInput').value;
    // Search results are displayed
    const resultDiv = document.getElementById('results');

    const resultHeader = document.createElement("h3");
    //Fetches animals 
    const animals = await fetchAnimals("name="+searchInput);
    const firstResult = animals[0].name;
    
    resultHeader.innerText = firstResult;
    resultDiv.appendChild(resultHeader);
    console.log(animals[0].name);
    // Then works on going through the animal 
    // resultDiv.innerText = '';
    // animals.forEach(animal => {
    //     const animalDiv = document.createElement('div');
    //     animalDiv.innerText = `
    //         <h3>${animal.name}</h3>
    //     `;
    //     resultDiv.appendChild(animalDiv);
    //     console.log(animal.name);
    // });
}