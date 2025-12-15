// ================================
// GLOBAL STATE & DATA
// ================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSlide = 0;
let slideInterval;

// Sample Products Data
const products = [
    {
        id: 1,
        name: 'Paracetamol 500mg',
        category: 'medicines',
        subcategory: 'pain-relief',
        price: 25,
        originalPrice: 35,
        discount: 28,
        image: 'https://via.placeholder.com/300x300/00A896/fff?text=Paracetamol',
        inStock: true,
        description: 'Effective pain and fever relief. 10 tablets per strip.',
        rating: 4.5
    },
    {
        id: 2,
        name: 'Vitamin D3 Tablets',
        category: 'supplements',
        price: 350,
        originalPrice: 450,
        discount: 22,
        image: 'https://via.placeholder.com/300x300/4A90E2/fff?text=Vitamin+D3',
        inStock: true,
        description: 'Support bone health and immunity. 60 capsules.',
        rating: 4.8
    },
    {
        id: 3,
        name: 'Face Moisturizer SPF 30',
        category: 'cosmetics',
        subcategory: 'skincare',
        price: 599,
        originalPrice: 899,
        discount: 33,
        image: 'https://via.placeholder.com/300x300/05B395/fff?text=Moisturizer',
        inStock: true,
        description: 'Hydrating face cream with sun protection. 50ml.',
        rating: 4.6
    },
    {
        id: 4,
        name: 'Baby Diapers (Medium)',
        category: 'baby-care',
        price: 1299,
        originalPrice: 1599,
        discount: 19,
        image: 'https://via.placeholder.com/300x300/2E86DE/fff?text=Diapers',
        inStock: true,
        description: 'Soft and comfortable diapers. Pack of 64.',
        rating: 4.7
    },
    {
        id: 5,
        name: 'Protein Bar (Chocolate)',
        category: 'packed-food',
        price: 120,
        originalPrice: 150,
        discount: 20,
        image: 'https://via.placeholder.com/300x300/00D9D0/fff?text=Protein+Bar',
        inStock: true,
        description: 'High protein snack bar. 60g per bar.',
        rating: 4.4
    },
    {
        id: 6,
        name: 'Hand Sanitizer 500ml',
        category: 'personal-care',
        price: 180,
        originalPrice: 250,
        discount: 28,
        image: 'https://via.placeholder.com/300x300/00A896/fff?text=Sanitizer',
        inStock: true,
        description: '70% alcohol-based hand sanitizer.',
        rating: 4.5
    },
    {
        id: 7,
        name: 'Hair Growth Serum',
        category: 'cosmetics',
        subcategory: 'haircare',
        price: 899,
        originalPrice: 1299,
        discount: 31,
        image: 'https://via.placeholder.com/300x300/4A90E2/fff?text=Hair+Serum',
        inStock: true,
        description: 'Promotes hair growth and thickness. 100ml.',
        rating: 4.3
    },
    {
        id: 8,
        name: 'Omega-3 Fish Oil',
        category: 'supplements',
        price: 650,
        originalPrice: 850,
        discount: 24,
        image: 'https://via.placeholder.com/300x300/05B395/fff?text=Omega-3',
        inStock: true,
        description: 'Supports heart and brain health. 60 softgels.',
        rating: 4.7
    }
];

// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroSlider();
    initSearch();
    initCart();
    loadFeaturedProducts();
    updateCartCount();
});

// ================================
// NAVIGATION
// ================================
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-wrapper')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Sticky header
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        }

        lastScroll = currentScroll;
    });
}

// ================================
// HERO SLIDER
// ================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!slides.length) return;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function goToSlide(index) {
        showSlide(index);
        resetSlideInterval();
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideInterval();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideInterval();
    });

    // Auto-advance slider
    slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        heroSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

// ================================
// SEARCH FUNCTIONALITY
// ================================
function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', () => {
            searchBar.classList.add('active');
            searchInput.focus();
        });
    }

    if (searchClose && searchBar) {
        searchClose.addEventListener('click', () => {
            searchBar.classList.remove('active');
            searchInput.value = '';
        });
    }

    // Close search on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchBar.classList.contains('active')) {
            searchBar.classList.remove('active');
            searchInput.value = '';
        }
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length > 0) {
                // In a real app, this would filter products
                console.log('Searching for:', query);
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.toLowerCase().trim();
                if (query) {
                    // Redirect to products page with search query
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// ================================
// CART FUNCTIONALITY
// ================================
function initCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            openCart();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => {
            closeCart();
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            closeCart();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            handleCheckout();
        });
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        renderCartItems();
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');

    // Animate cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 300);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCartItems();
            updateCartCount();
        }
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountEl = document.getElementById('totalAmount');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (totalAmountEl) totalAmountEl.textContent = '₹0.00';
        return;
    }

    let total = 0;
    let itemsHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₹${item.price}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity(${item.id}, -1)" class="qty-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)" class="qty-btn">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="cart-item-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    if (totalAmountEl) totalAmountEl.textContent = `₹${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create WhatsApp message
    let message = `*Hello, I want to place an order.*\n\n`;
    message += `*Items:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Total: ₹${total.toFixed(2)}*\n\n`;
    message += `Please confirm this order.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/+919970670610?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    showNotification('Redirecting to WhatsApp...', 'success');
}

// ================================
// PRODUCTS
// ================================
function loadFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');

    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        ${product.discount ? `<div class="product-badge">-${product.discount}%</div>` : ''}
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <div class="product-category">${product.category.replace('-', ' ')}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="price-current">₹${product.price}</span>
                ${product.originalPrice ? `<span class="price-original">₹${product.originalPrice}</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    // Make product clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on buttons
        if (!e.target.closest('button')) {
            window.location.href = `product.html?id=${product.id}`;
        }
    });

    return card;
}

function toggleWishlist(productId) {
    // In a real app, this would save to wishlist
    const btn = event.target.closest('.wishlist-btn');
    const icon = btn.querySelector('i');

    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Added to wishlist!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Removed from wishlist!', 'info');
    }
}

// ================================
// NOTIFICATIONS
// ================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        success: 'check-circle',
        warning: 'exclamation-circle',
        error: 'times-circle',
        info: 'info-circle'
    };

    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : type === 'error' ? 'var(--danger)' : 'var(--info)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .cart-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--off-white);
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        position: relative;
    }

    .cart-item-image {
        width: 80px;
        height: 80px;
        border-radius: var(--radius-sm);
        overflow: hidden;
        flex-shrink: 0;
    }

    .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item-details h4 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .cart-item-price {
        color: var(--primary-color);
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .qty-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--white);
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        border: 1px solid var(--light-gray);
        transition: var(--transition-fast);
    }

    .qty-btn:hover {
        background: var(--primary-color);
        color: var(--white);
    }

    .cart-item-quantity span {
        font-weight: 600;
        min-width: 30px;
        text-align: center;
    }

    .cart-item-remove {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: transparent;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-fast);
    }

    .cart-item-remove:hover {
        background: var(--danger);
        color: var(--white);
    }
`;
document.head.appendChild(style);

// ================================
// UTILITY FUNCTIONS
// ================================
function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
}

function getProductById(id) {
    return products.find(p => p.id === id);
}

// Export functions for use in other pages
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleWishlist = toggleWishlist;
window.showNotification = showNotification;
window.products = products;
window.cart = cart;
