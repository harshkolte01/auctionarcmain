import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { ref as dbRef, push, set, get } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';
import { database } from './firebase-config.js';

// Simple UUID generation function
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const storage = getStorage();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = dbRef(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData.userType === 'Seller') {
                        document.getElementById('sellerName').value = userData.userName;
                    } else {
                        alert("You are not authorized to sell products.");
                        window.location.href = 'mainpage.html';
                    }
                } else {
                    console.log("No user data available");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            window.location.href = 'mainpage.html';
        }
    });

    document.getElementById('sellProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const productName = document.getElementById('productName').value;
        const startingPrice = document.getElementById('startingPrice').value;
        const category = document.getElementById('category').value;
        const totalBidTime = document.getElementById('totalBidTime').value;
        const sellerName = document.getElementById('sellerName').value;
        const productImage = document.getElementById('productImage').files[0];

        if (!productImage) {
            alert("Please select a product image.");
            return;
        }

        try {
            const imageRef = storageRef(storage, 'productImages/' + productImage.name);
            const snapshot = await uploadBytes(imageRef, productImage);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const productRef = push(dbRef(database, 'products'));

            const startBidUid = generateUUID(); // Generate UUID for Start Bid
            const participateUid = generateUUID(); // Generate UUID for Participate
            const biddingUid = generateUUID();

            await set(productRef, {
                productName: productName,
                startingPrice: startingPrice,
                category: category,
                bidTimeValue: parseInt(totalBidTime, 10),
                sellerName: sellerName,
                productImageURL: downloadURL,
                startBidUid: startBidUid, // Store Start Bid UUID
                participateUid: participateUid, // Store Participate UUID
                biddingUid: biddingUid, // Store bidding Uid
                status: 'Not Started',
            });

            console.log('Product information added');
            alert("Product information saved successfully!");
            document.getElementById('sellProductForm').reset();
        } catch (error) {
            console.error("Error handling form submission:", error);
            if (error.code === 'storage/unauthorized') {
                alert("You don't have permission to upload this file.");
            } else {
                alert("Error saving product information. Please try again.");
            }
        }
    });
});
