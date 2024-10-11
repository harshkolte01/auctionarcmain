import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const db = getDatabase();
    const auctionGrid = document.getElementById('auctionGrid');
    
    // Fetch products from Firebase Realtime Database
    const productsRef = ref(db, 'products');
    get(productsRef).then((snapshot) => {
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
                    <button data-start-bid-uid="${product.startBidUid}">Start Bid</button>
                    <button data-participate-uid="${product.participateUid}">Participate</button>
                `;
                auctionGrid.appendChild(itemDiv);
            }
        } else {
            auctionGrid.innerHTML = '<p>No products available.</p>';
        }
    }).catch((error) => {
        console.error('Error fetching products:', error);
        auctionGrid.innerHTML = '<p>Error loading products.</p>';
    });
});
