let cart = [];

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    updateCartDisplay();
}

function toggleCheckout() {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
}

function toggleLogin() {
    const modal = document.getElementById('login-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if(existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div>${item.name}</div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <span>${item.price * item.quantity} ₽</span>
                <button onclick="removeItem(${item.id})">×</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPrice.textContent = total;
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if(item) {
        item.quantity += delta;
        if(item.quantity < 1) removeItem(id);
        updateCartDisplay();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

// Инициализация товаров
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const button = card.querySelector('.btn');
        button.onclick = () => addToCart({
            id: index + 1,
            name: card.querySelector('.product-title').textContent,
            price: parseInt(card.querySelector('.product-price').textContent)
        });
    });
});

// Закрытие модальных окон при клике вне области
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if(event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// Функция для консультации
function toggleConsultation() {
    const modal = document.getElementById('consultation-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Обработка формы консультации
document.getElementById('consultation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Ваш запрос успешно отправлен! Мы свяжемся с вами в течение часа');
    toggleConsultation();
});

function showOrderForm(serviceName) {
    const modal = document.getElementById('order-modal');
    const title = document.getElementById('modal-title');
    title.textContent = serviceName;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
}

function submitOrder(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('modal-title').textContent
    };
    
    // Сохранение заявки в localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || []);
    orders.push(formData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert('Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
    closeModal();
    document.getElementById('order-form').reset();
}

// Закрытие модального окна при клике вне области
window.onclick = function(e) {
    const modal = document.getElementById('order-modal');
    if(e.target == modal) {
        closeModal();
    }
}