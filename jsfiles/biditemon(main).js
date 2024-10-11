import { getDatabase, ref, onValue, update, set, push } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const db = getDatabase();
    const auth = getAuth();
    const productId = new URLSearchParams(window.location.search).get('productId');
    const productImage = document.getElementById('productImage');
    const productName = document.getElementById('productName');
    const startingPrice = document.getElementById('startingPrice');
    const timerElement = document.getElementById('timer');
    const bidAmountInput = document.getElementById('bidAmount');
    const submitBidButton = document.getElementById('submitBid');
    const bidList = document.getElementById('bidList');
    
    let bidEndTime = null;
    let highestBid = 0;
    let highestBidder = null;
    let submittingBid = false; // Flag to prevent duplicate submissions

    function formatTime(ms) {
        const hours = Math.floor(ms / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function updateTimer() {
        if (bidEndTime) {
            const now = new Date().getTime();
            const remainingTime = bidEndTime - now;
            if (remainingTime <= 0) {
                timerElement.innerHTML = '00:00:00';
                bidAmountInput.readOnly = true;
                submitBidButton.disabled = true;
                saveAuctionResult(); // Save the auction result when the timer ends
            } else {
                timerElement.innerHTML = formatTime(remainingTime);
                setTimeout(updateTimer, 1000);
            }
        }
    }

    function loadProduct() {
        if (productId) {
            console.log('Product ID from URL:', productId); // Debug log
            const productRef = ref(db, `products/${productId}`);
            onValue(productRef, (snapshot) => {
                if (snapshot.exists()) {
                    const product = snapshot.val();
                    productImage.src = product.productImageURL;
                    productName.textContent = product.productName;
                    startingPrice.textContent = product.startingPrice;
                    highestBid = product.currentBid || 0;

                    if (product.bidStarted) {
                        const bidStartTime = new Date(product.bidStartTime).getTime();
                        const bidDuration = product.bidTimeValue * 60000; // Convert minutes to milliseconds
                        bidEndTime = bidStartTime + bidDuration;
                        updateTimer();

                        // Enable the input if the auction is ongoing
                        bidAmountInput.readOnly = false;
                        submitBidButton.disabled = false;

                        loadBidHistory(); // Load bid history when the auction is ongoing
                    } else {
                        bidEndTime = null;
                        timerElement.textContent = '00:00:00';
                        bidAmountInput.readOnly = true;
                        submitBidButton.disabled = true;
                    }

                } else {
                    console.error('Product not found.');
                }
            }, (error) => {
                console.error('Error fetching product details:', error);
            });
        } else {
            console.error('No product ID provided.');
        }
    }

    function loadBidHistory() {
        const bidsRef = ref(db, `products/${productId}/bids`);
        onValue(bidsRef, (snapshot) => {
            bidList.innerHTML = ''; // Clear the current bid history
            snapshot.forEach((childSnapshot) => {
                const bid = childSnapshot.val();
                const listItem = document.createElement('li');
                listItem.textContent = `${bid.userName}: $${bid.bidAmount}`;
                bidList.appendChild(listItem);
            });
        });
    }

    function submitBid(user, bidAmount) {
        // Debounce mechanism to prevent duplicate submissions
        if (submittingBid) return;
        submittingBid = true;

        const productRef = ref(db, `products/${productId}`);
        const newBidRef = push(ref(db, `products/${productId}/bids`));

        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (userSnapshot) => {
            if (userSnapshot.exists()) {
                const userInfo = userSnapshot.val();
                set(newBidRef, {
                    userId: user.uid,
                    userName: userInfo.userName,
                    bidAmount: bidAmount
                }).then(() => {
                    console.log('Bid submitted:', bidAmount);
                    highestBid = bidAmount;
                    highestBidder = user;
                    bidAmountInput.value = ''; // Clear input after submission
                    update(productRef, {
                        currentBid: bidAmount,
                        highestBidder: {
                            userId: user.uid,
                            userName: userInfo.userName,
                            email: user.email
                        }
                    });
                }).catch((error) => {
                    console.error('Error submitting bid:', error);
                }).finally(() => {
                    submittingBid = false; // Reset flag after submission
                });
            }
        });
    }

    function saveAuctionResult() {
        if (highestBidder) {
            const resultRef = ref(db, `auctionResults/${productId}`);
            set(resultRef, {
                productId: productId,
                highestBid: highestBid,
                userId: highestBidder.uid,
                userName: highestBidder.displayName,
                email: highestBidder.email
            }).then(() => {
                console.log('Auction result saved successfully.');
            }).catch((error) => {
                console.error('Error saving auction result:', error);
            });
        } else {
            console.log('No bids were placed.');
        }
    }

    // Ensure the event listener is attached only once
    submitBidButton.addEventListener('click', () => {
        const bidAmount = parseFloat(bidAmountInput.value);
        if (isNaN(bidAmount) || bidAmount <= 0) {
            alert('Please enter a valid bid amount.');
            return;
        }
        if (bidAmount <= highestBid || bidAmount <= parseFloat(startingPrice.textContent)) {
            alert(`Your bid must be greater than $${Math.max(highestBid, startingPrice.textContent)}.`);
            return;
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                submitBid(user, bidAmount);
            }
        });
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadProduct();
        } else {
            console.error('User is not authenticated.');
        }
    });
});
