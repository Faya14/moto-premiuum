// script.js

const menuIcon = document.querySelector('.menu-icon'); // или класс твоей иконки ☰
  const mobileMenu = document.getElementById('mobileMenu');
  
  menuIcon.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
  });
  
  // Закрыть меню при клике на ссылку
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });

// Класс для работы с корзиной
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    // Добавить товар в корзину
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.save();
        this.updateCartCount();
        this.showNotification('Товар добавлен в корзину');
    }

    // Удалить товар из корзины
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartCount();
    }

    // Изменить количество товара
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
            this.updateCartCount();
        }
    }

    // Очистить корзину
    clear() {
        this.items = [];
        this.save();
        this.updateCartCount();
    }

    // Получить все товары
    getItems() {
        return this.items;
    }

    // Получить общую сумму
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Сохранить в localStorage
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Обновить счетчик в шапке
    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartLinks = document.querySelectorAll('a[href="cart.html"]');
        cartLinks.forEach(link => {
            link.textContent = `Корзина (${count})`;
        });
    }

    // Показать уведомление
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Инициализация корзины
const cart = new Cart();

// Функция добавления товара в корзину
function addToCart(id, name, category, specs, price) {
    const product = {
        id: id,
        name: name,
        category: category,
        specs: specs,
        price: price
    };
    
    cart.addItem(product);
}

// Стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #dc2626;
        color: white;
        padding: 16px 24px;
        border-radius: 2px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
`;
document.head.appendChild(style);
