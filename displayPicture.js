testData = "Cheetah";

async function displayPicture(animal) {
    const data = await fetchImages("query="+animal); 
    const imageSource = data.photos[0].src.original
    const img = document.createElement("img");
    const photoParent = document.getElementById('photo-container');
    img.src = imageSource;
    photoParent.appendChild(img);
    console.log(data.photos[0]);
}