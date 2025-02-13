async function searchAnimal() {
    //User's input
    const searchInput = document.getElementById('searchInput').value;
    // Search results are displayed
    const resultDiv = document.getElementById('result');
    //Fetches animals 
    const animals = await fetchAnimals(searchInput);
    
    // Then works on going through the animal 
    resultDiv.innerHTML = '';
    animals.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.innerHTML = `
            <h3>${animal.name}</h3>
        `;
        resultDiv.appendChild(animalDiv);
    });
}