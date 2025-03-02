async function dropDownMenu(parentId, labletext, options)
{
 const parent = document.getElementById(parentId);
 const select = document.createElement("select");

 for(const option of options)
 {console.log(opiton);
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.innertext = option;
    select.appendChild(optionElement);

 }
 parent.appendChild(select);



}





