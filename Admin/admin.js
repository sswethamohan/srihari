document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminForm');
    const itemList = document.getElementById('itemList');
    let items = JSON.parse(localStorage.getItem('items')) || [];

    function updateItemList() {
        itemList.innerHTML = '';

        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <img src="${item.image}" alt="${item.name}">
                <div class="button-container">
                    <button class="edit-item" data-index="${index}">Edit</button>
                    <button class="remove-item" data-index="${index}">Remove</button>
                    <button class="add-variety" data-index="${index}">Add Variety</button>
                </div>
            `;
            itemList.appendChild(itemDiv);
        });

        itemList.querySelectorAll('.edit-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                openEditForm(index);
            });
        });

        itemList.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                items.splice(index, 1);
                localStorage.setItem('items', JSON.stringify(items));
                updateItemList();
                // Refresh the menu page if needed
                if (window.location.pathname.includes('../Menu/Menu.html')) {
                    location.reload();
                }
            });
        });

        itemList.querySelectorAll('.add-variety').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                openVarietyForm(index);
            });
        });
    }

    function openEditForm(index) {
        const item = items[index];
        document.getElementById('itemName').value = item.name;
        document.getElementById('imagePreview').src = item.image;
        document.getElementById('imagePreview').style.display = 'block';
        form.addEventListener('submit', function handleEdit(event) {
            event.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('itemName');
            const imageFile = formData.get('itemImage');
            
            let image = item.image;
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    image = e.target.result;
                    items[index] = { name, image };
                    localStorage.setItem('items', JSON.stringify(items));
                    updateItemList();
                    form.reset();
                    document.getElementById('imagePreview').style.display = 'none';
                    form.removeEventListener('submit', handleEdit);
                };
                reader.readAsDataURL(imageFile);
            } else {
                items[index] = { name, image };
                localStorage.setItem('items', JSON.stringify(items));
                updateItemList();
                form.reset();
                document.getElementById('imagePreview').style.display = 'none';
                form.removeEventListener('submit', handleEdit);
            }
        });
    }

    function openVarietyForm(index) {
        // Determine the variety page URL based on the item
        const item = items[index];
        const normalizedItemName = item.name.trim().toLowerCase().replace(/\s+/g, '-');
        const varietyPageUrl = `../Variety/${normalizedItemName}-variety.html?index=${index}`;

        // Redirect to the appropriate variety page
        window.location.href = varietyPageUrl;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('itemName');
        const imageFile = formData.get('itemImage');

        if (name && imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = e.target.result;
                items.push({ name, image });
                localStorage.setItem('items', JSON.stringify(items));
                updateItemList();
                form.reset();
                document.getElementById('imagePreview').style.display = 'none';
            };
            reader.readAsDataURL(imageFile);
        }
    });

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

    updateItemList();
});
