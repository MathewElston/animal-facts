//Dummy data
let animals = ["cat", "dog", "mouse"];

//Function to create history bar using array of data
async function createHistoryBar(animals){

    //Create variable for sidebar element in HTML doc
    const parent = document.getElementById("history_sidebar");
    
    //For loop to iterate through each element in array
    for (let i = 0; i < animals.length; i++){

        //Create variables for a new div and paragraph
        const div = document.createElement("div");
        const paragraph = document.createElement("p");

        //Set the innertext of the paragraph to the current element
        paragraph.innerText = animals[i];

        //Append the new paragraph to the new div and the div to the HTML doc
        div.appendChild(paragraph);
        parent.appendChild(div);
        
    }

    const data = await fetchAnimals("name=Cheetah");

    console.log(data[0].locations);
}