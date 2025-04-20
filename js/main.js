// Cart state
let cart = {
    items: [],
    total: 0
};

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Debug log
    
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const floatingCart = document.getElementById('floating-cart');

    // Load products
    loadProducts();

    // Mobile menu functionality
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && navMenu && !mobileMenu.contains(event.target) && !navMenu.contains(event.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Floating cart click handler
    if (floatingCart) {
        floatingCart.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }

    // Update cart count
    updateCartCount();
});

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Products loaded:', data.products); // Debug log
        displayProducts(data.products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in the grid
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    console.log('Displaying products:', products);
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     onerror="this.onerror=null; this.src='images/image-placeholder2.png';">
            </div>
            <h3>${product.name}</h3>
            <p class="price">AED ${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;

        // Add to cart button handler
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => {
            addToCart(product);
            showNotification(`${product.name} added to cart!`);
        });

        productsGrid.appendChild(productCard);
    });
}

// Update cart count in the UI
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation class
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Cart functionality
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    cart.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='images/image-placeholder2.png';">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>AED ${item.price.toFixed(2)}</p>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="item-total">
                <span>AED ${itemTotal.toFixed(2)}</span>
                <button class="remove-item" onclick="removeItem(${index})">Delete</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    document.getElementById('subtotal').textContent = `AED ${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `AED ${subtotal.toFixed(2)}`;
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    cart.items[index].quantity += change;
    
    if (cart.items[index].quantity <= 0) {
        cart.items.splice(index, 1);
    }
    
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    cart.items.splice(index, 1);
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count immediately on page load
    updateCartCount();
    
    if (document.getElementById('cart-items')) {
        updateCart();
        
        // Add form submission handler
        const form = document.querySelector('.cart-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
    }
});

function handleFormSubmission(event) {
    event.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    if (cart.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get form values
    const name = document.getElementById('name').value;
    const netid = document.getElementById('netid').value;
    const payment = document.getElementById('payment').value;
    const delivery = document.getElementById('delivery').value;
    
    // Create form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('netid', netid);
    formData.append('payment', payment);
    formData.append('delivery', delivery);
    
    // Submit form to CGI script
    fetch('./cgi-bin/cart_form.py', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Generate receipt
            generateReceipt(cart, name, netid, payment, delivery);
            
            // Clear cart
            localStorage.setItem('cart', JSON.stringify({ items: [], total: 0 }));
            updateCart();
            updateCartCount();
            
            // Show success message
            alert('Order submitted successfully!');
        } else {
            alert('Error submitting order: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting order. Please try again.');
    });
}

function generateReceipt(cart, name, netid, payment, delivery) {
    const receipt = document.getElementById('receipt');
    const receiptItems = document.getElementById('receipt-items');
    const receiptDate = document.getElementById('receipt-date');
    const receiptSubtotal = document.getElementById('receipt-subtotal');
    const receiptTotal = document.getElementById('receipt-total');
    const receiptName = document.getElementById('receipt-name');
    const receiptNetid = document.getElementById('receipt-netid');
    const receiptPayment = document.getElementById('receipt-payment');
    const receiptDelivery = document.getElementById('receipt-delivery');
    
    // Set date
    const now = new Date();
    receiptDate.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    // Set items
    receiptItems.innerHTML = '';
    let subtotal = 0;
    
    cart.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const receiptItem = document.createElement('div');
        receiptItem.className = 'receipt-item';
        receiptItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>AED ${itemTotal.toFixed(2)}</span>
        `;
        receiptItems.appendChild(receiptItem);
    });
    
    // Set totals
    receiptSubtotal.textContent = `AED ${subtotal.toFixed(2)}`;
    receiptTotal.textContent = `AED ${subtotal.toFixed(2)}`;
    
    // Set order details
    receiptName.textContent = name;
    receiptNetid.textContent = netid;
    receiptPayment.textContent = payment.charAt(0).toUpperCase() + payment.slice(1).replace('_', ' ');
    receiptDelivery.textContent = delivery.charAt(0).toUpperCase() + delivery.slice(1).replace('_', ' ');
    
    // Show receipt
    receipt.style.display = 'block';
    
    // Scroll to receipt
    receipt.scrollIntoView({ behavior: 'smooth' });
}

// Animated text slider
const textSlider = document.querySelector('.text-slider');
const texts = [
    'Fashion Hub',
    'Style Destination'
];
let currentIndex = 0;

function typeText(text, element, speed = 100) {
    let i = 0;
    element.textContent = '';
    element.style.width = 'auto';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function updateText() {
    textSlider.style.opacity = '0';
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        textSlider.style.opacity = '1';
        typeText(texts[currentIndex], textSlider);
    }, 500);
}

// Start the text animation
if (textSlider) {
    // Initial typing effect
    typeText(texts[0], textSlider);
    
    // Start the interval after the first text is fully typed
    setTimeout(() => {
        setInterval(updateText, 4000);
    }, texts[0].length * 100 + 1000);
} 