async function searchAnimal() {
    //User's input
    const searchInput = document.getElementById('searchInput').value;
    // Search results are displayed
    const resultDiv = document.getElementById('result');
    //Fetches animals 
    const animals = await fetchAnimals("name="+searchInput);
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