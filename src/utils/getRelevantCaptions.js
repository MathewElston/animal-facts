function getRelevantCaptions(animalData)
{
   const characterVariable = animalData.characteristics;
    
   for (const key in characterVariable)
    {
        if(characterVariable[key])
        {
            return `${key}: ${characterVariable[key]}`;
        }
    }
   
}