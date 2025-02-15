testData = "Cheetah";
//what needs to be done is alter the size and location of the image then save and merge with the main repo
async function displayPicture(animal) {
    const data = await fetchImages("query="+animal); 
    const imageSource = data.photos[0].src.original;
    const img = document.createElement("img");
    const photoParent = document.getElementById('photo-container');

    img.src = imageSource;
    img.width = 500;
    img.height = 350;
    photoParent.appendChild(img);
    console.log(data.photos[0]);
}