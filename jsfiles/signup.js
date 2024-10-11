import { auth, database, createUserWithEmailAndPassword } from './firebase-config.js'; // Adjust the path if necessary
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

//Signup 
document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUpButton');
    if (signUpButton) {
        signUpButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            register();
        });
    }
});

//signup func
function register(){
    // Get input fields
    const userType = document.getElementById('usertype').value;
    const userName = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('signUpPassword').value;   

    if (!validateEmail(email)) {
        alert('Email must contain "@" and "."');
        return;
    }
    if (!validatePassword(password)) {
        alert('Password length must be greater than 6 characters');
        return;
    }

    // Sign up the user
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        // Add to Firebase Realtime Database
        const databaseRef = ref(database, 'users/' + user.uid);

        // Create user data
        const userData = {
            userType: userType,
            userName: userName,
            email: email,
            pass_word: password,
            last_login: Date.now(),
            moneyIn: 0
        };

        set(databaseRef, userData)
        .then(() => {
            alert('Account creation successful');
            window.location.href = 'mainpage.html';
        })
        .catch((error) => {
            console.error('Error saving user data:', error);
            alert('Error saving user data: ' + error.message);
        });
    })
    .catch((error) => {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message);
    });
}    

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
    return password.length > 6;
}
