document.addEventListener('DOMContentLoaded', function() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const itemList = document.getElementById('itemList');

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'col-12 col-md-4';
        itemElement.innerHTML = `
            <a href="${getPageUrl(item.name)}" class="card-link">
                <div class="card">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                    </div>
                </div>
            </a>
        `;
        itemList.appendChild(itemElement);
    });

    // Update cart count on page load
    updateCartCount();

    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }

    // Function to get the page URL based on the item name
    function getPageUrl(itemName) {
        const normalizedItemName = itemName.trim().toLowerCase().replace(/\s+/g, '-');
        const url = `../Items/${normalizedItemName}.html`; // General URL structure for each item
        console.log(`Item: ${itemName}, URL: ${url}`); // Debugging log
        return url;
    }
});
