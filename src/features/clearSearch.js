async function clearResults()
{
    document.getElementById("btnSearchAnimals").addEventListener("click", getAnimalResults());
    document.getElementById("searchInput").value = '';
}