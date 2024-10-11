import { getDatabase, ref, get, remove } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const db = getDatabase();
    const auctionListContainer = document.getElementById('auctionList');
    const deletePopup = document.getElementById('deletePopup');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    let itemToDelete = null; // Variable to store item to delete

    // Fetch auctions from Firebase Realtime Database
    const auctionsRef = ref(db, 'products');
    get(auctionsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const auctions = snapshot.val();
            auctionListContainer.innerHTML = ''; // Clear existing items
            for (const productId in auctions) {
                const auction = auctions[productId];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'auction-item';
                itemDiv.innerHTML = `
                    <table class="auction-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Time</th>
                                <th>Seller</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${auction.productName}</td>
                                <td>${new Date(auction.bidStartTime).toLocaleString()}</td>
                                <td>${auction.sellerName}</td>
                                <td><i class="fa fa-times delete-icon" data-id="${productId}"></i></td>
                            </tr>
                        </tbody>
                    </table>
                `;
                auctionListContainer.appendChild(itemDiv);
            }

            // Add event listeners to delete icons
            document.querySelectorAll('.delete-icon').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    itemToDelete = e.target.dataset.id;
                    deletePopup.style.display = 'flex';
                });
            });
        } else {
            auctionListContainer.innerHTML = '<p>No active auctions.</p>';
        }
    }).catch((error) => {
        console.error('Error fetching auctions:', error);
        auctionListContainer.innerHTML = '<p>Error loading auctions.</p>';
    });

    // Handle confirmation of deletion
    confirmDelete.addEventListener('click', () => {
        if (itemToDelete) {
            const itemRef = ref(db, 'products/' + itemToDelete);
            remove(itemRef).then(() => {
                console.log('Auction deleted successfully');
                deletePopup.style.display = 'none';
                document.querySelector(`[data-id="${itemToDelete}"]`).parentElement.remove();
                itemToDelete = null; // Reset itemToDelete
            }).catch((error) => {
                console.error('Error deleting auction:', error);
            });
        }
    });

    // Handle cancellation of deletion
    cancelDelete.addEventListener('click', () => {
        deletePopup.style.display = 'none';
        itemToDelete = null; // Reset itemToDelete
    });
});
