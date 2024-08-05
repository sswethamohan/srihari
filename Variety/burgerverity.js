document.addEventListener('DOMContentLoaded', () => {
    function loadItems() {
        const items = JSON.parse(localStorage.getItem('burgerverityItems')) || [];
        const Listitem = document.getElementById('Listitem');
        Listitem.innerHTML = '';

        if (items.length === 0) {
            Listitem.innerHTML = '<p>No items available.</p>';
            return;
        }

        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'col';
            itemDiv.innerHTML = `
                <div class="item-square">
                    <div class="item-content">
                        <div class="card">
                            <img src="${item.image}" alt="${item.name}" class="card-img-top">
                            <div class="card-body">
                                <h3 class="card-title">${item.name}</h3>
                                <p class="card-text">${item.description}</p>
                                <p class="card-text">Price: ₹${parseFloat(item.price).toFixed(2)}</p>
                                <button class="btn btn-warning" onclick="editItem(${index})">Edit</button>
                                <button class="btn btn-danger" onclick="deleteItem(${index})">Delete</button>
                                <button class="btn btn-${item.available ? 'success' : 'secondary'}" onclick="toggleAvailability(${index})">
                                    ${item.available ? 'Available' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            Listitem.appendChild(itemDiv);
        });
    }

    document.getElementById('adminForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const itemName = formData.get('itemName');
        const itemDescription = formData.get('itemDescription');
        const itemImage = formData.get('itemImage');
        const itemPrice = formData.get('itemPrice');

        if (!itemName || !itemDescription || !itemImage || isNaN(itemPrice)) {
            alert('Please fill out all fields correctly.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function() {
            const imageBase64 = reader.result;
            const item = {
                name: itemName,
                description: itemDescription,
                image: imageBase64,
                price: itemPrice,
                page: 'burger', // Specific to burger page
                available: true // Default to available
            };

            const items = JSON.parse(localStorage.getItem('burgerverityItems')) || [];
            items.push(item);
            localStorage.setItem('burgerverityItems', JSON.stringify(items));

            loadItems();
            document.getElementById('adminForm').reset();
        };
        reader.readAsDataURL(itemImage);
    });

    window.editItem = function(index) {
        const items = JSON.parse(localStorage.getItem('burgerverityItems')) || [];
        const item = items[index];

        document.getElementById('itemName').value = item.name;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemPrice').value = item.price;

        // Store the current image in a hidden input for re-use during edit
        const currentImage = item.image;
        localStorage.setItem('currentEditImage', currentImage);

        deleteItem(index);
    };

    window.deleteItem = function(index) {
        const items = JSON.parse(localStorage.getItem('burgerverityItems')) || [];
        items.splice(index, 1);
        localStorage.setItem('burgerverityItems', JSON.stringify(items));
        loadItems();
    };

    window.toggleAvailability = function(index) {
        const items = JSON.parse(localStorage.getItem('burgerverityItems')) || [];
        const item = items[index];
        item.available = !item.available; // Toggle availability
        localStorage.setItem('burgerverityItems', JSON.stringify(items));
        loadItems();
    };

    document.getElementById('itemImage').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('imagePreview').src = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    loadItems();
});
