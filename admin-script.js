// Storage keys
const CATEGORIES_KEY = 'medical_categories';
const PRODUCTS_KEY = 'medical_products';

// State
let categories = [];
let products = [];
let currentEditingProduct = null;
let uploadedImages = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeEventListeners();
    renderCategories();
    renderProducts();
});

// Load data from localStorage
function loadData() {
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    const savedProducts = localStorage.getItem(PRODUCTS_KEY);

    categories = savedCategories ? JSON.parse(savedCategories) : [];
    products = savedProducts ? JSON.parse(savedProducts) : [];

    // Add default categories if none exist
    if (categories.length === 0) {
        categories = ['Medicines', 'Supplements', 'Medical Equipment', 'Personal Care'];
        saveCategories();
    }
}

// Save functions
function saveCategories() {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

function saveProducts() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });

    // Category events
    document.getElementById('add-category-btn').addEventListener('click', addCategory);
    document.getElementById('category-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCategory();
    });

    // Product form events
    document.getElementById('add-product-toggle').addEventListener('click', toggleProductForm);
    document.getElementById('cancel-product').addEventListener('click', cancelProductForm);
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    document.getElementById('product-images').addEventListener('change', handleImageUpload);
}

// Section switching
function switchSection(section) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === section) {
            btn.classList.add('active');
        }
    });

    // Show/hide sections
    document.getElementById('products-section').classList.toggle('hidden', section !== 'products');
    document.getElementById('categories-section').classList.toggle('hidden', section !== 'categories');
}

// Category Management
function addCategory() {
    const input = document.getElementById('category-name');
    const categoryName = input.value.trim();

    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }

    if (categories.includes(categoryName)) {
        alert('Category already exists');
        return;
    }

    categories.push(categoryName);
    saveCategories();
    renderCategories();
    updateCategoryDropdown();
    input.value = '';
}

function deleteCategory(categoryName) {
    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
        categories = categories.filter(cat => cat !== categoryName);
        saveCategories();
        renderCategories();
        updateCategoryDropdown();
    }
}

function renderCategories() {
    const container = document.getElementById('categories-list');

    if (categories.length === 0) {
        container.innerHTML = '<div class="no-data-message">No categories available</div>';
        return;
    }

    container.innerHTML = categories.map(category => `
        <div class="category-item">
            <span class="category-name">${category}</span>
            <button class="delete-category" onclick="deleteCategory('${category}')">✕</button>
        </div>
    `).join('');
}

function updateCategoryDropdown() {
    const select = document.getElementById('product-category');
    const currentValue = select.value;

    select.innerHTML = '<option value="">Select Category</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    if (currentValue && categories.includes(currentValue)) {
        select.value = currentValue;
    }
}

// Product Form Management
function toggleProductForm() {
    const container = document.getElementById('product-form-container');
    const isHidden = container.classList.contains('hidden');

    if (isHidden) {
        container.classList.remove('hidden');
        updateCategoryDropdown();
    } else {
        cancelProductForm();
    }
}

function cancelProductForm() {
    document.getElementById('product-form-container').classList.add('hidden');
    document.getElementById('product-form').reset();
    uploadedImages = [];
    currentEditingProduct = null;
    renderImagePreviews();
}

// Image Upload Handling
function handleImageUpload(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImages.push(event.target.result);
                renderImagePreviews();
            };
            reader.readAsDataURL(file);
        }
    });
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImagePreviews();
}

function renderImagePreviews() {
    const container = document.getElementById('image-preview-container');

    if (uploadedImages.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = uploadedImages.map((img, index) => `
        <div class="image-preview-item">
            <img src="${img}" alt="Preview ${index + 1}">
            <button type="button" class="remove-image" onclick="removeImage(${index})">✕</button>
        </div>
    `).join('');
}

// Product CRUD
function saveProduct(e) {
    e.preventDefault();

    // Validate images
    if (uploadedImages.length < 2) {
        alert('Please upload at least 2 product images');
        return;
    }

    const productData = {
        id: currentEditingProduct ? currentEditingProduct.id : Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        unit: document.getElementById('product-unit').value,
        quantity: parseInt(document.getElementById('product-quantity').value),
        composition: document.getElementById('product-composition').value,
        price: parseFloat(document.getElementById('product-price').value),
        discount: parseFloat(document.getElementById('product-discount').value) || 0,
        description: document.getElementById('product-description').value,
        images: [...uploadedImages]
    };

    if (currentEditingProduct) {
        // Update existing product
        const index = products.findIndex(p => p.id === currentEditingProduct.id);
        products[index] = productData;
    } else {
        // Add new product
        products.push(productData);
    }

    saveProducts();
    renderProducts();
    cancelProductForm();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentEditingProduct = product;
    uploadedImages = [...product.images];

    // Populate form
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-unit').value = product.unit;
    document.getElementById('product-quantity').value = product.quantity;
    document.getElementById('product-composition').value = product.composition;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-discount').value = product.discount;
    document.getElementById('product-description').value = product.description;

    // Show form
    document.getElementById('product-form-container').classList.remove('hidden');
    updateCategoryDropdown();
    renderImagePreviews();

    // Scroll to form
    document.getElementById('product-form-container').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
    }
}

function renderProducts() {
    const tbody = document.getElementById('products-tbody');
    const noProductsMsg = document.getElementById('no-products-message');

    if (products.length === 0) {
        tbody.innerHTML = '';
        noProductsMsg.classList.remove('hidden');
        return;
    }

    noProductsMsg.classList.add('hidden');

    tbody.innerHTML = products.map(product => {
        const finalPrice = product.price - (product.price * product.discount / 100);

        return `
            <tr>
                <td>
                    <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                </td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>${product.unit}</td>
                <td>${product.quantity}</td>
                <td class="product-composition">
                    ${product.composition.substring(0, 30)}...
                    <span class="tooltip">${product.composition}</span>
                </td>
                <td>
                    ${product.discount > 0 ?
                `<del>₹${product.price.toFixed(2)}</del><br><strong>₹${finalPrice.toFixed(2)}</strong>` :
                `₹${product.price.toFixed(2)}`
            }
                </td>
                <td>${product.discount > 0 ? product.discount + '%' : 'N/A'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="editProduct(${product.id})" style="margin-bottom: 8px; padding: 6px 12px; font-size: 12px;">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Calculate final price
function calculateFinalPrice(price, discount) {
    return price - (price * discount / 100);
}
