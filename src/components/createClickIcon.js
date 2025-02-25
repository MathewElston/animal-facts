async function createClickIcon(parentId,iconFont, data, onSelect) {
    const parent = document.getElementById(parentId);
    const iconClass = iconFont;
    const iconElement = document.createElement('i');
    iconElement.setAttribute("class",iconClass);
    iconElement.style.cursor = "pointer";

    iconElement.addEventListener('click', () => {
        onSelect(data);
    });
    parent.appendChild(iconElement);
}