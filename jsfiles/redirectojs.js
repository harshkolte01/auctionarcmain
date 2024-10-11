function redirectToSignin(event) {
    event.preventDefault(); // Prevent the default link behavior
    alert("Please sign in or sign up to access this page.");
    window.location.href = "signin.html"; // Redirect to the sign-in page
}

// Attach event listeners to the links
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.nav-links ul li a[href="#"]');
    links.forEach(link => {
        link.addEventListener('click', redirectToSignin);
    });
});
