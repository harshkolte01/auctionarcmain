import { getDatabase, ref, get, update, onValue } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const db = getDatabase();
    const auth = getAuth();
    const auctionGrid = document.getElementById('auctionGrid');
    let currentUserType = null;

    // Fetch user type
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(db, `users/${user.uid}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    currentUserType = snapshot.val().userType;
                    console.log(currentUserType);
                    loadProducts(); // Load products after determining the user type
                } else {
                    console.error('User type not found.');
                }
            }).catch((error) => {
                console.error('Error fetching user type:', error);
            });
        } else {
            console.error('No user is signed in.');
        }
    });

    function loadProducts() {
        const productsRef = ref(db, 'products');
        
        // Listen for real-time updates to products
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();
                auctionGrid.innerHTML = ''; // Clear existing items
                for (const productId in products) {
                    const product = products[productId];
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'auction-item';
                    itemDiv.innerHTML = `
                        <img src="${product.productImageURL}" alt="${product.productName}">
                        <h3>${product.productName}</h3>
                        <p>Starting Price: $${product.startingPrice}</p>
                        <p>Category: ${product.category}</p>
                        <p>Total Bid Time: ${product.bidTimeValue}</p>
                        <button data-product-id="${productId}" class="start-bid-btn" ${product.bidStarted ? 'disabled' : ''}>Start Bid</button>
                        <button data-product-id="${productId}" class="participate-btn" style="display: ${product.bidStarted ? 'block' : 'none'};">Participate</button>
                    `;
                    auctionGrid.appendChild(itemDiv);
                }

                // Add event listeners to "Start Bid" buttons
                document.querySelectorAll('.start-bid-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        if (currentUserType === 'Admin') {
                            const productId = e.target.getAttribute('data-product-id');
                            startBid(productId);
                        } else {
                            alert('Only admins can start the bid.');
                        }
                    });
                });

                // Add event listeners to "Participate" buttons
                document.querySelectorAll('.participate-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        if (currentUserType === 'Buyer' || currentUserType === 'Admin') {
                            const productId = e.target.getAttribute('data-product-id');
                            // Redirect to biditemon.html with product ID
                            window.location.href = `biditemon.html?productId=${productId}`;
                        }
                    });
                });

            } else {
                auctionGrid.innerHTML = '<p>No products available.</p>';
            }
        }, (error) => {
            console.error('Error fetching products:', error);
            auctionGrid.innerHTML = '<p>Error loading products.</p>';
        });
    }

    function startBid(productId) {
        const productRef = ref(db, `products/${productId}`);
        const now = new Date().toISOString(); // Get current time in ISO format

        // Update the product to indicate the bid has started and store the bid start time
        update(productRef, {
            bidStarted: true,
            bidStartTime: now
        }).then(() => {
            // Redirect to biditemon.html with product ID
            window.location.href = `biditemon.html?productId=${productId}`;
            console.log(`Bid started for product: ${productId}`);
        }).catch((error) => {
            console.error('Error starting bid:', error);
        });
    }
});
