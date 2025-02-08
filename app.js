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
  } catch (error) {
    console.log(error);
  }
}
