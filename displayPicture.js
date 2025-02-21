testData = "Cheetah";

async function displayPicture(animal) {
    const data = await fetchImages("query="+animal); 
    const imageSource = data.photos[0].src.original// Gets the first index
    const img = document.createElement("img");
    const photoParent = document.getElementById('photo-container').addEventListener("click", placeholder);//grabs the photo comntainer element
       
    img.src = imageSource;
    img.width = 500;//adjusts the width of the image
    img.height = 350;//adjusts the height of the image
    photoParent.appendChild(img);//
    console.log(data.photos[0]);
}

async function getImage()
{
    const data = await fetchImages("query="+animal);
    retreivedata;
}
    