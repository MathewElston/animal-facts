function getRelevantCaptions(animalData)
{
   const characterVariable = animalData.characteristics;
    
   for (const key in characterVariable)
    {
        if(characterVariable[key])
        {
            let string = `${key}: ${characterVariable[key]}`
            return string.replace(/_/g," ");
        }
    }
   
}