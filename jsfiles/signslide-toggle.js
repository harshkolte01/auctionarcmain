const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});
const togglePasswordIcons = document.querySelectorAll(".toggle-password");
    
togglePasswordIcons.forEach(icon => {
    icon.addEventListener("click", function () {
        const targetInputId = this.getAttribute("data-target");
        const targetInput = document.getElementById(targetInputId);

        // Toggle the type attribute
        const type = targetInput.getAttribute("type") === "password" ? "text" : "password";
        targetInput.setAttribute("type", type);

        // Toggle the eye icon class
        this.classList.toggle("fa-eye-slash");
    });
});