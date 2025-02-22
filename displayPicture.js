testData = "Cheetah";

async function displayPicture(animal) {
    const data = await fetchImages("query="+animal); 
    const imageSource = data.photos[0].src.original;// Gets the first index
    const img = document.createElement("img");
    const photoParent = document.getElementById('photo-container');

    img.src = imageSource;
    img.style.width = "500px";//adjusts the width of the image
    img.style.height = '350PX';//adjusts the height of the image
   photoParent.appendChild(img);
    console.log(data.photos[0]);
    
}

async function stuff()
{
    const data = await fetchImages("query="+animal); 
    const photoParent = document.getElementById('photo-container').addEventListener("load", searchAnimal);
return data;
}
    