document.addEventListener('DOMContentLoaded', function() {
    // Function to load items from localStorage and display them
    function loadItems() {
        const items = JSON.parse(localStorage.getItem('sandwichItems')) || [];
        const menuContainer = document.getElementById('menuContainer');
        menuContainer.innerHTML = '';

        if (items.length === 0) {
            menuContainer.innerHTML = '<p>No items available.</p>';
            return;
        }

        items.forEach(item => {
            if (item.page === 'sandwich' && item.available) { // Ensure the page key matches
                const itemElement = document.createElement('div');
                itemElement.className = 'col-12 col-md-4 menu-item';
                itemElement.innerHTML = `
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p>${item.description}</p>
                            <p>Price: ₹${parseFloat(item.price).toFixed(2)}</p>
                            <button class="btn btn-primary" onclick="addToCart('${item.name}', '${item.price}', '${item.image}')">Add to Cart</button>
                        </div>
                    </div>
                `;
                menuContainer.appendChild(itemElement);
            }
        });
    }

    // Function to add item to cart
    window.addToCart = function(name, price, image) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = { name, price, image };

        // Check if the item is already in the cart
        const existingItem = cart.find(cartItem => cartItem.name === name);
        if (existingItem) {
            alert('Item is already in the cart.');
            return;
        }

        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Item added to cart!');
    }

    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }

    // Load items when the page loads
    loadItems();
    updateCartCount(); // Update cart count on page load
});
