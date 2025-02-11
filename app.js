// Animal API call function and headers -> Returns Async JSON Object
const animalHeaders = new Headers({
  "X-Api-Key": "VmBqdp0DySLZmHEVc+jqqQ==Nf2BTvpDoqncCtKW",
});
const animalsURL = "https://api.api-ninjas.com/v1/animals?";

async function fetchAnimals(args) {
  try {
    const response = await fetch(animalsURL + args, { headers: animalHeaders });
    if (!response.ok) {
      throw new Error("Could not fetch API.");
    }
    const data = await response.json();

    console.log(data);
    console.log(response);

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Images API call function and headers -> Returns Async JSON Object
const imagesHeaders = new Headers({
  Authorization: "Qna0ffg6Y6hV8qsX7hBYb92BxvTFW6fATIb0eMJ9TTQzlCnpp9GG9EmK",
});
const imagesURL = "https://api.pexels.com/v1/search?";

async function fetchImages(args) {
  try {
    const response = await fetch(imagesURL + args, { headers: imagesHeaders });
    if (!response.ok) {
      throw new Error("Could not fetch API.");
    }
    const data = await response.json();

    console.log(data);
    console.log(response);

    return data;
  } catch (error) {
    console.log(error);
  }
}