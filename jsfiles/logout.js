import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

document.getElementById('logout').addEventListener('click', () => {
    const auth = getAuth();

    signOut(auth).then(() => {
        // Sign-out successful, redirect to the sign-in page
        window.location.href = 'signin.html';
        alert('logout done')
        console.log('signout')
    }).catch((error) => {
        // Handle errors here
        console.error("Error signing out:", error);
    });
});
