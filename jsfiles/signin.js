import { auth, database, signInWithEmailAndPassword } from './firebase-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const signInButton = document.getElementById('signInButton');
    if (signInButton) {
        signInButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            console.log("Sign In button clicked"); // Debugging line
            login();
        });
    }
});

async function login() {
    console.log("Login function called"); // Debugging line
    const email = document.getElementById('semail').value;
    const password = document.getElementById('signInPassword').value;
    console.log("Email entered:", email); // Debugging line
    console.log("Password entered:", password); // Debugging line

    // Validate email and password fields
    if (!email || !validateEmail(email)) {
        alert('Invalid or empty email. Please enter a valid email address.');
        return;
    }

    if (!password) {
        alert('Password field is empty. Please enter your password.');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign-in successful", userCredential); // Debugging line
        alert('Signin done')
        const user = userCredential.user;

        // Fetch user data from Firebase Realtime Database
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userType = userData.userType;
            console.log("User type:", userType); // Debugging line

            // Redirect based on user type
            redirectUser(userType);
        } else {
            alert('User data not found in the database.');
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        alert('Error during sign-in: ' + error.message);
    }
}

// Redirect user based on their type
function redirectUser(userType) {
    switch (userType) {
        case 'Buyer':
            window.location.href = 'mainpage.html'; // URL for Buyer
            break;
        case 'Seller':
            window.location.href = 'mainpage.html'; // URL for Seller
            break;
        case 'Admin':
            window.location.href = 'adminpage.html'; // URL for Admin
            break;
        default:
            alert('Invalid user type');
            break;
    }
}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

