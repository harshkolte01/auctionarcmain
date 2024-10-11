// For mobile


// Get the nav links element
const navlinks = document.getElementById("nav-links");

// Show the menu by changing the right style
export function showMenu() {
    navlinks.style.right = "0";
    console.log("show");
}

// Hide the menu by changing the right style
export function hideMenu() {
    navlinks.style.right = "-200px"; // Make sure the unit is specified
    console.log("hide");
}

// Ensure these functions are accessible globally if needed
window.showMenu = showMenu;
window.hideMenu = hideMenu;
