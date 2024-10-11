import { getDatabase, ref, get, set, update } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

// Initialize Firebase
const db = getDatabase();
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    const orderListContainer = document.getElementById('orderListContainer');

    // Fetch auction results from Firebase
    const resultsRef = ref(db, 'auctionResults');
    get(resultsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const results = snapshot.val();
            orderListContainer.innerHTML = ''; // Clear existing items
            
            // Get current user
            const user = auth.currentUser;
            if (!user) {
                orderListContainer.innerHTML = '<p>Please sign in to view your orders.</p>';
                return;
            }

            const userId = user.uid;

            for (const productId in results) {
                const result = results[productId];
                // Only display orders for the current user
                if (result.userId === userId) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'order-item';
                    const status = result.status || 'Not Paid';
                    itemDiv.innerHTML = `
                        <h3>Product ID: ${result.productId}</h3>
                        <p>Highest Bid: $${result.highestBid}</p>
                        <p>Winner: ${result.userName} (User ID: ${result.userId})</p>
                        <p>Email: ${result.email}</p>
                        <p>Status: ${status}</p>
                        ${status === 'Not Paid' ? `<button class="buy-button" data-product-id="${result.productId}" data-amount="${result.highestBid}">Buy</button>` : ''}
                    `;
                    orderListContainer.appendChild(itemDiv);
                }
            }

            // Add event listener to "Buy" buttons
            document.querySelectorAll('.buy-button').forEach(button => {
                button.addEventListener('click', handleBuyClick);
            });
        } else {
            orderListContainer.innerHTML = '<p>No auction results available.</p>';
        }
    }).catch((error) => {
        console.error('Error fetching auction results:', error);
        orderListContainer.innerHTML = '<p>Error loading auction results.</p>';
    });
});

async function handleBuyClick(event) {
    const button = event.target;
    const productId = button.getAttribute('data-product-id');
    const amount = parseFloat(button.getAttribute('data-amount'));

    // Get current user
    const user = auth.currentUser;
    if (!user) {
        alert('Please sign in to complete the purchase.');
        return;
    }

    const userId = user.uid;
    const userRef = ref(db, `users/${userId}`);
    const productRef = ref(db, `auctionResults/${productId}`);

    try {
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            const moneyIn = userData.moneyIn;

            if (moneyIn >= amount) {
                // Deduct money and update status
                await update(userRef, { moneyIn: moneyIn - amount });
                await update(productRef, { status: 'Paid' });
                button.style.display = 'none'; // Hide the button
                alert('Payment successful!');
                // Optionally, you can refresh the order list here to reflect the changes immediately
                // location.reload(); // Uncomment if you want to refresh the page
            } else {
                alert('Insufficient funds. Please add money to your account.');
            }
        } else {
            alert('User data not found.');
        }
    } catch (error) {
        console.error('Error processing purchase:', error);
        alert('Error processing purchase.');
    }
}
