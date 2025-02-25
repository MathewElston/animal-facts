async function createPicture(parentid,animal,width,height) {
    const imageSource = animal.src.original;
    const img = document.createElement("img");
    const parent = document.getElementById(parentid);

    img.src = imageSource;
    img.width = width;
    img.height = height;
    img.classList.add("rounded");
    parent.appendChild(img);
   
}
