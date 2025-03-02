async function dropDownMenu(parentId, labletext, options)
{
 const parent = document.getElementById(parentId);
 const select = document.createElement("select");

 for(const option of options)
 {console.log(option);
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.text = option;
    select.add(optionElement);

 }
}
async function getSelectedCategory(parentId)
{
    const selectElement = document.getElementById(parentId);
    const selectedIndex = selectElement.selectedIndex;
const selectedOption = selectElement.options[selectedIndex];
return selectedOption.text;
//console.log('Selected option text:', selectedOption.text);
}





