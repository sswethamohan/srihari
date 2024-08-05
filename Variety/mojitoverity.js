document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminForm');
    const listItemContainer = document.getElementById('Listitem');
    let editIndex = null; // Track index of item being edited

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

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
                    page: 'mojito',
                    available: true
                };

                if (editIndex !== null) {
                    // Update existing item
                    const items = JSON.parse(localStorage.getItem('mojitoItems')) || [];
                    items[editIndex] = newItem;
                    localStorage.setItem('mojitoItems', JSON.stringify(items));
                    editIndex = null; // Reset edit index
                } else {
                    // Add new item
                    const items = JSON.parse(localStorage.getItem('mojitoItems')) || [];
                    items.push(newItem);
                    localStorage.setItem('mojitoItems', JSON.stringify(items));
                }

                // Reload items
                loadItems();

                // Clear form
                form.reset();
            };
            reader.readAsDataURL(itemImage);
        }
    });

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
        listItemContainer.appendChild(itemElement);
    }

    // Function to edit an item
    window.editItem = function(index) {
        const items = JSON.parse(localStorage.getItem('mojitoItems')) || [];
        const item = items[index];
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemPrice').value = item.price;
        editIndex = index; // Set index of item being edited
    };

    // Function to remove an item
    window.removeItem = function(index) {
        const items = JSON.parse(localStorage.getItem('mojitoItems')) || [];
        items.splice(index, 1); // Remove item from array
        localStorage.setItem('mojitoItems', JSON.stringify(items));
        loadItems(); // Reload items
    };

    // Function to toggle availability
    window.toggleAvailability = function(index) {
        const items = JSON.parse(localStorage.getItem('mojitoItems')) || [];
        items[index].available = !items[index].available; // Toggle availability
        localStorage.setItem('mojitoItems', JSON.stringify(items));
        loadItems(); // Reload items
    };

    // Load and display items on page load
    function loadItems() {
        listItemContainer.innerHTML = ''; // Clear existing items
        const items = JSON.parse(localStorage.getItem('mojitoItems')) || [];
        items.forEach(addItemToList);
    }

    loadItems();
});
