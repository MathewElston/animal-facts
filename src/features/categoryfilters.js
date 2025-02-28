async function dropDownMenu()
{
    //const crtAt = document.createAttribute("class");
    //crtAt.value ="dropdown";
    //const buttonFun = document.createElement("button");
document.getElementById("sections").classList.toggle("show");

document.getElementById("a","#Wetland").innerHTML(fetchAnimals());
document.getElementById("a","#Grassland").innerHTML(fetchAnimals());
document.getElementById("a","#openocean").innerHTML(fetchAnimals());
document.getElementById("a","#Tundra").innerHTML(fetchAnimals());
document.getElementById("a","#Savanna").innerHTML(fetchAnimals());
}


