async function createClickIcon(parentId,iconFont, data, onSelect) {
    const parent = parentId;
    if (typeof parentId === "string") {
    parent = document.getElementById(parentId);
    }
    const iconClass = iconFont;
    const iconElement = document.createElement('i');
    iconElement.setAttribute("class",iconClass);
    iconElement.style.cursor = "pointer";

    iconElement.addEventListener('click', (e) => {
        // added stopPropagation to keep favorites/history icons from triggering the click events of
        // the cards that host them
        e.stopPropagation();
        onSelect(data);
    });
    parent.appendChild(iconElement);

    return iconElement;
}