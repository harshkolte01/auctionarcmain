import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const db = getDatabase();

    // Function to handle role-based visibility
    const handleRoleBasedVisibility = (userData) => {
        const roleLinks = document.querySelectorAll('.role-link');
        roleLinks.forEach(link => {
            if (userData.userType === 'Admin') {
                link.classList.remove('hidden');
                link.classList.add('visible');
            } else {
                link.classList.add('hidden');
                link.classList.remove('visible');
            }
        });
    };

    // Check user role on auth state change
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(db, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    handleRoleBasedVisibility(userData);
                } else {
                    console.error("User data not found.");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            // If no user is logged in, hide all role links
            const roleLinks = document.querySelectorAll('.role-link');
            roleLinks.forEach(link => {
                link.classList.add('hidden');
                link.classList.remove('visible');
            });
        }
    });
});
