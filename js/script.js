// Dummy data for products
const products = [
    {
        id: 1,
        name: 'Mawar Merah',
        price: 75000,
        category: 'bunga',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Bunga mawar merah segar dengan tangkai panjang, cocok untuk hadiah spesial.'
    },
    {
        id: 2,
        name: 'Anggrek Bulan',
        price: 120000,
        category: 'bunga',
        image: 'https://images.unsplash.com/photo-1533735140089-255378c8cc25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Anggrek bulan putih yang elegan, cocok untuk dekorasi ruangan.'
    },
    {
        id: 3,
        name: 'Lidah Mertua',
        price: 85000,
        category: 'tanaman',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Tanaman hias yang bisa membersihkan udara dalam ruangan.'
    },
    {
        id: 4,
        name: 'Kaktus Mini',
        price: 35000,
        category: 'tanaman',
        image: 'https://images.unsplash.com/photo-1485955901906-b46b52d6b4b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Koleksi kaktus mini dalam pot lucu, mudah perawatannya.'
    },
    {
        id: 5,
        name: 'Lavender',
        price: 65000,
        category: 'bunga',
        image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2656?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Tanaman lavender dengan aroma menenangkan, cocok untuk kamar tidur.'
    },
    {
        id: 6,
        name: 'Monstera',
        price: 150000,
        category: 'tanaman',
        image: 'https://images.unsplash.com/photo-1593482892291-3dbdd5820fc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Tanaman hias dengan daun lebar yang eksotis.'
    },
    {
        id: 7,
        name: 'Tulip',
        price: 95000,
        category: 'bunga',
        image: 'https://images.unsplash.com/photo-1522737038-68b0e0a9e9cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Bunga tulip segar dengan berbagai pilihan warna.'
    },
    {
        id: 8,
        name: 'Lili Paris',
        price: 45000,
        category: 'tanaman',
        image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Tanaman gantung yang cantik dengan daun menjuntai.'
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeBtn = document.querySelector('.close');
const filterBtns = document.querySelectorAll('.filter-btn');

// Format price to IDR
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
};

// Display products
const displayProducts = (productsToDisplay) => {
    productContainer.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productContainer.innerHTML = '<p class="empty-cart">Tidak ada produk yang ditemukan</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.dataset.category = product.category;
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <span class="product-price">${formatPrice(product.price)}</span>
                <button class="btn add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
            </div>
        `;
        
        productContainer.appendChild(productElement);
    });
    
    // Add event listeners to the new "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
};

// Filter products
const filterProducts = (category) => {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
};

// Add to cart
const addToCart = (e) => {
    const productId = parseInt(e.target.dataset.id);
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
    
    updateCart();
    showNotification(`${product.name} ditambahkan ke keranjang`);
};

// Update cart
const updateCart = () => {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja Anda kosong</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = formatPrice(total);
    
    // Add event listeners
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', updateQuantity);
    });
    
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', updateQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
};

// Update quantity
const updateQuantity = (e) => {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    if (e.target.classList.contains('increase-quantity')) {
        item.quantity += 1;
    } else if (e.target.classList.contains('decrease-quantity') && item.quantity > 1) {
        item.quantity -= 1;
    }
    
    updateCart();
};

// Remove item from cart
const removeItem = (e) => {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Produk dihapus dari keranjang');
};

// Show notification
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
};

// Initialize the app
const init = () => {
    // Display all products initially
    displayProducts(products);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Filter products
            filterProducts(btn.dataset.category);
        });
    });
    
    // Cart icon click
    document.querySelector('.cart-icon').addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang belanja Anda kosong');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Terima kasih telah berbelanja!\nTotal pembayaran: ${formatPrice(total)}\nPesanan Anda akan segera diproses.`);
        
        // Clear cart after checkout
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
    });
};

// Add notification styles to the head
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
