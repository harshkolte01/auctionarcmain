import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

const auth = getAuth();
const database = getDatabase();

onAuthStateChanged(auth, async (user) => {
    const userLink = document.getElementById('userLink');
    if (user) {
        // User is signed in, fetch user data from the database
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const username = userData.userName; // Assuming you stored the username with the key 'userName'
            
            // Update the user link with the username
            userLink.textContent = username; 
            userLink.href = 'myprofile.html'; // Disable link or point to user profile page
        } else {
            console.error('User data not found in the database.');
        }
    } else {
        // No user is signed in
        userLink.textContent = 'Sign in/Signup';
        userLink.href = 'signin.html';
    }
});
