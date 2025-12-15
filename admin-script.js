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

    // Use the 6 fixed categories that match the products page
    // These categories must match exactly with the category filters on products.html
    if (categories.length === 0 || !categoriesMatchRequired(categories)) {
        categories = ['Medicines', 'Cosmetics', 'Baby Care', 'Personal Care', 'Supplements', 'Packed Food'];
        saveCategories();
    }
}

// Check if categories match the required 6 categories
function categoriesMatchRequired(cats) {
    const requiredCategories = ['Medicines', 'Cosmetics', 'Baby Care', 'Personal Care', 'Supplements', 'Packed Food'];
    return requiredCategories.every(rc => cats.includes(rc));
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

    // Auto-calculate single unit price
    document.getElementById('product-price').addEventListener('input', calculateSingleUnitPrice);
    document.getElementById('product-conversion').addEventListener('input', calculateSingleUnitPrice);
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
    document.getElementById('product-single-price').value = '';
    renderImagePreviews();
}

// Calculate single unit price based on package price and conversion
function calculateSingleUnitPrice() {
    const packagePrice = parseFloat(document.getElementById('product-price').value) || 0;
    const conversion = parseFloat(document.getElementById('product-conversion').value) || 1;

    if (packagePrice > 0 && conversion > 0) {
        const singleUnitPrice = packagePrice / conversion;
        document.getElementById('product-single-price').value = singleUnitPrice.toFixed(2);
    } else {
        document.getElementById('product-single-price').value = '';
    }
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

    // Images are now optional - use medical emoji placeholder if no images
    const productImages = uploadedImages.length > 0 ? [...uploadedImages] : [];

    const productData = {
        id: currentEditingProduct ? currentEditingProduct.id : Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        packageUnit: document.getElementById('product-package-unit').value,
        singleUnit: document.getElementById('product-single-unit').value,
        conversion: parseInt(document.getElementById('product-conversion').value),
        composition: document.getElementById('product-composition').value,
        price: parseFloat(document.getElementById('product-price').value),
        discount: parseFloat(document.getElementById('product-discount').value) || 0,
        description: document.getElementById('product-description').value,
        images: productImages
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
    uploadedImages = product.images ? [...product.images] : [];

    // Populate form
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-package-unit').value = product.packageUnit || product.unit || '';
    document.getElementById('product-single-unit').value = product.singleUnit || 'Unit';
    document.getElementById('product-conversion').value = product.conversion || 1;
    document.getElementById('product-composition').value = product.composition;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-discount').value = product.discount;
    document.getElementById('product-description').value = product.description;

    // Calculate and show single unit price
    calculateSingleUnitPrice();

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
        const finalPackagePrice = product.price - (product.price * product.discount / 100);
        const conversion = product.conversion || 1;
        const singleUnitPrice = product.price / conversion;
        const finalSingleUnitPrice = finalPackagePrice / conversion;

        // For backwards compatibility with old products
        const packageUnit = product.packageUnit || product.unit || 'Package';
        const singleUnit = product.singleUnit || 'Unit';
        const conversionText = `1 ${packageUnit} = ${conversion} ${singleUnit}${conversion > 1 ? 's' : ''}`;

        // Category-specific emoji mapping
        const categoryEmojis = {
            'Medicines': '💊',
            'Cosmetics': '💄',
            'Baby Care': '👶',
            'Personal Care': '🧴',
            'Supplements': '💪',
            'Packed Food': '🍪'
        };
        const categoryEmoji = categoryEmojis[product.category] || '💊';

        // Use category emoji placeholder if no images
        const productImage = product.images && product.images.length > 0
            ? `<img src="${product.images[0]}" alt="${product.name}" class="product-image">`
            : `<div class="product-image-placeholder" style="font-size: 40px; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: linear-gradient(135deg, #00A896, #4A90E2); border-radius: 8px;">${categoryEmoji}</div>`;

        return `
            <tr>
                <td>
                    ${productImage}
                </td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>
                    <span style="font-size: 12px; color: #666;">${conversionText}</span>
                </td>
                <td class="product-composition">
                    ${product.composition.substring(0, 30)}...
                    <span class="tooltip">${product.composition}</span>
                </td>
                <td>
                    ${product.discount > 0 ?
                `<del>₹${product.price.toFixed(2)}</del><br><strong>₹${finalPackagePrice.toFixed(2)}</strong>` :
                `₹${product.price.toFixed(2)}`
            }
                </td>
                <td>
                    ${product.discount > 0 ?
                `<del>₹${singleUnitPrice.toFixed(2)}</del><br><strong>₹${finalSingleUnitPrice.toFixed(2)}</strong>` :
                `₹${singleUnitPrice.toFixed(2)}`
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
