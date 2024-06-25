// Get the HTML element with the id "MenuItems"
var MenuItems = document.getElementById("MenuItems");
// Set the initial maximum height of the MenuItems to 0px (collapsed)
MenuItems.style.maxHeight = "0px";

// Function to toggle the menu height
function menutoggle() {
    // Check if the current maxHeight of MenuItems is "0px"
    if(MenuItems.style.maxHeight == "0px") {
        // If it is, set the maxHeight to "200px" (expand the menu)
        MenuItems.style.maxHeight = "200px";
    } else {
        // Otherwise, set the maxHeight back to "0px" (collapse the menu)
        MenuItems.style.maxHeight = "0px";
    }
}
