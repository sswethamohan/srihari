document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminForm');
    let editIndex = null; // Track index of item being edited

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const itemName = document.getElementById('itemName').value;
        const itemDescription = document.getElementById('itemDescription').value;
        const itemPrice = parseFloat(document.getElementById('itemPrice').value).toFixed(2);
        const itemImage = document.getElementById('itemImage').files[0];

        if (itemImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newItem = {
                    name: itemName,
                    description: itemDescription,
                    price: itemPrice,
                    image: e.target.result,
                    page: 'sandwich', // Ensure correct key for sandwich items
                    available: true
                };

                if (editIndex !== null) {
                    // Update existing item
                    const items = JSON.parse(localStorage.getItem('sandwichItems')) || [];
                    items[editIndex] = newItem;
                    localStorage.setItem('sandwichItems', JSON.stringify(items));
                    editIndex = null; // Reset edit index
                } else {
                    // Add new item
                    const items = JSON.parse(localStorage.getItem('sandwichItems')) || [];
                    items.push(newItem);
                    localStorage.setItem('sandwichItems', JSON.stringify(items));
                }

                // Reload items
                loadItems();

                // Clear form
                form.reset();
            };
            reader.readAsDataURL(itemImage);
        }
    });

    // Function to load and display items
    function loadItems() {
        const listItemContainer = document.getElementById('Listitem');
        listItemContainer.innerHTML = ''; // Clear existing items
        const items = JSON.parse(localStorage.getItem('sandwichItems')) || [];
        console.log('Loaded items:', items); // Log items for debugging
        items.forEach((item, index) => addItemToList(item, index));
    }

    // Function to add an item to the list
    function addItemToList(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'col-12 col-md-4 menu-item';
        itemElement.innerHTML = `
            <div class="card">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p>${item.description}</p>
                    <p>Price: ₹${item.price}</p>
                    <button class="btn btn-warning" onclick="editItem(${index})">Edit</button>
                    <button class="btn btn-danger" onclick="removeItem(${index})">Remove</button>
                    <button class="btn ${item.available ? 'btn-success' : 'btn-secondary'}" onclick="toggleAvailability(${index})">${item.available ? 'Available' : 'Unavailable'}</button>
                </div>
            </div>
        `;
        document.getElementById('Listitem').appendChild(itemElement);
    }

    // Functions to edit, remove, and toggle availability of items
    window.editItem = function(index) {
        const items = JSON.parse(localStorage.getItem('sandwichItems')) || [];
        const item = items[index];
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemPrice').value = item.price;
        editIndex = index; // Set index of item being edited
    };

    window.removeItem = function(index) {
        const items = JSON.parse(localStorage.getItem('sandwichItems')) || [];
        items.splice(index, 1); // Remove item from array
        localStorage.setItem('sandwichItems', JSON.stringify(items));
        loadItems(); // Reload items
    };

    window.toggleAvailability = function(index) {
        const items = JSON.parse(localStorage.getItem('sandwichItems')) || [];
        items[index].available = !items[index].available; // Toggle availability
        localStorage.setItem('sandwichItems', JSON.stringify(items));
        loadItems(); // Reload items
    };

    // Load items on page load
    loadItems();
});
