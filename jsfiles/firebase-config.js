import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA72sU38DLHmCIF4ZxoCq1M-80xkwmJVmY",
    authDomain: "auctionarc-f65e1.firebaseapp.com",
    projectId: "auctionarc-f65e1",
    storageBucket: "auctionarc-f65e1.appspot.com",
    databaseURL: "https://auctionarc-f65e1-default-rtdb.firebaseio.com/",
    messagingSenderId: "413631641520",
    appId: "1:413631641520:web:ef390410283e11c2604875",
    measurementId: "G-8PVZGQ83V2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Export Firebase services
export { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, storage };
