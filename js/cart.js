// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartUI();
        this.updateCartCount();
        this.initializeProductData();
    }

    initializeProductData() {
        this.productData = {
            1: {
                name: 'Smartphone Premium',
                price: 1299,
                image: 'images/celular_1.jpg',
                description: 'Tela 6.5", 128GB, Câmera 48MP',
                features: [
                    'Tela AMOLED 6.5 polegadas',
                    'Processador Octa-core 2.8GHz',
                    'Memória RAM 8GB',
                    'Armazenamento 128GB',
                    'Câmera principal 48MP',
                    'Câmera frontal 16MP',
                    'Bateria 4500mAh',
                    'Carregamento rápido 65W',
                    'Resistente à água IP68',
                    'Android 13'
                ]
            },
            2: {
                name: 'Smartphone Básico',
                price: 599,
                image: 'images/celular_2.jpg',
                description: 'Tela 5.5", 64GB, Câmera 13MP',
                features: [
                    'Tela LCD 5.5 polegadas',
                    'Processador Quad-core 1.8GHz',
                    'Memória RAM 4GB',
                    'Armazenamento 64GB',
                    'Câmera principal 13MP',
                    'Câmera frontal 8MP',
                    'Bateria 3000mAh',
                    'Carregamento 18W',
                    'Dual SIM',
                    'Android 12'
                ]
            },
            3: {
                name: 'Smartphone Intermediário',
                price: 899,
                image: 'images/celular_3.jpg',
                description: 'Tela 6.1", 256GB, Câmera 64MP',
                features: [
                    'Tela OLED 6.1 polegadas',
                    'Processador Octa-core 2.4GHz',
                    'Memória RAM 6GB',
                    'Armazenamento 256GB',
                    'Câmera principal 64MP',
                    'Câmera frontal 12MP',
                    'Bateria 4000mAh',
                    'Carregamento rápido 33W',
                    'Leitor de digital na tela',
                    'Android 13'
                ]
            },
            4: {
                name: 'Smartphone Top de Linha',
                price: 2199,
                image: 'images/celular_4.jpg',
                description: 'Tela 6.7", 512GB, Câmera 108MP',
                features: [
                    'Tela AMOLED 6.7 polegadas 120Hz',
                    'Processador Snapdragon 8 Gen 2',
                    'Memória RAM 12GB',
                    'Armazenamento 512GB',
                    'Câmera principal 108MP',
                    'Câmera ultra-wide 12MP',
                    'Câmera telefoto 10MP',
                    'Câmera frontal 32MP',
                    'Bateria 5000mAh',
                    'Carregamento super rápido 120W',
                    'Carregamento sem fio 50W',
                    'Resistente à água IP68',
                    'Android 14'
                ]
            }
        };
    }

    bindEvents() {
        // Cart icon click
        document.getElementById('cartIcon').addEventListener('click', () => {
            this.toggleCart();
        });

        // Close cart
        document.getElementById('closeCart').addEventListener('click', () => {
            this.closeCart();
        });

        // Cart overlay click
        document.getElementById('cartOverlay').addEventListener('click', () => {
            this.closeCart();
        });

        // Quantity selectors
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuantityChange(e);
            });
        });

        // Quantity inputs
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleQuantityInputChange(e);
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addToCart(e);
            });
        });

        // Clear cart button
        document.getElementById('clearCartBtn').addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.checkout();
        });

        // Quick view functionality
        this.initQuickView();

        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling
        this.initSmoothScrolling();

        // Header scroll effect
        this.initHeaderScrollEffect();

        // Form submission
        this.initFormSubmission();

        // Social links
        this.initSocialLinks();
    }

    handleQuantityChange(e) {
        const btn = e.target.closest('.qty-btn');
        const id = btn.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        let currentValue = parseInt(input.value);

        if (btn.classList.contains('plus')) {
            if (currentValue < 10) {
                input.value = currentValue + 1;
            }
        } else if (btn.classList.contains('minus')) {
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        }

        // Update cart if item is already in cart
        const cartItem = this.items.find(item => item.id == id);
        if (cartItem) {
            cartItem.quantity = parseInt(input.value);
            this.saveCart();
            this.updateCartUI();
        }
    }

    handleQuantityInputChange(e) {
        const input = e.target;
        const id = input.dataset.id;
        let value = parseInt(input.value);

        if (value < 1) value = 1;
        if (value > 10) value = 10;
        
        input.value = value;

        // Update cart if item is already in cart
        const cartItem = this.items.find(item => item.id == id);
        if (cartItem) {
            cartItem.quantity = value;
            this.saveCart();
            this.updateCartUI();
        }
    }

    addToCart(e) {
        const btn = e.target.closest('.add-to-cart-btn');
        const id = btn.dataset.id || btn.closest('.modal-content').querySelector('#modalAddBtn').dataset.id;
        
        let quantity;
        if (btn.id === 'modalAddBtn') {
            quantity = parseInt(document.getElementById('modalQtyInput').value);
        } else {
            quantity = parseInt(document.querySelector(`.qty-input[data-id="${id}"]`).value);
        }

        const product = this.productData[id];
        if (!product) return;

        // Add loading state
        btn.classList.add('loading');
        btn.disabled = true;

        setTimeout(() => {
            const existingItem = this.items.find(item => item.id == id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    id: parseInt(id),
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }

            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
            this.showToast(`${product.name} adicionado ao carrinho!`);

            // Remove loading state
            btn.classList.remove('loading');
            btn.disabled = false;

            // Close modal if open
            const modal = document.getElementById('quickViewModal');
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 500);
    }

    removeFromCart(id) {
        this.items = this.items.filter(item => item.id != id);
        this.saveCart();
        this.updateCartUI();
        this.updateCartCount();
    }

    updateCartQuantity(id, quantity) {
        const item = this.items.find(item => item.id == id);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(id);
            } else {
                item.quantity = Math.min(quantity, 10);
                this.saveCart();
                this.updateCartUI();
                this.updateCartCount();
            }
        }
    }

    clearCart() {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.items = [];
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
            this.showToast('Carrinho limpo!');
        }
    }

    toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <small>Adicione produtos para começar</small>
                </div>
            `;
            cartSummary.style.display = 'none';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                    <div class="cart-item-controls">
                        <div class="cart-item-quantity">
                            <button onclick="cart.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10" 
                                   onchange="cart.updateCartQuantity(${item.id}, parseInt(this.value))">
                            <button onclick="cart.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="cart.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update summary
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 1000 ? 0 : 50;
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('total').textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

        cartSummary.style.display = 'block';
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = count;
        
        if (count > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = total > 1000 ? 0 : 50;
        const finalTotal = total + shipping;

        const itemsList = this.items.map(item => 
            `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
        ).join('\n');

        const message = `🛒 *Pedido CelularStore*\n\n${itemsList}\n\n💰 *Total: R$ ${finalTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}*\n\nGostaria de finalizar este pedido!`;
        
        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    initQuickView() {
        const modal = document.getElementById('quickViewModal');
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        const closeBtn = document.querySelector('.close');

        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productName = btn.dataset.product;
                const productId = Object.keys(this.productData).find(id => 
                    this.productData[id].name === productName
                );
                
                if (productId) {
                    this.showQuickView(productId);
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Modal quantity controls
        document.getElementById('modalQtyMinus').addEventListener('click', () => {
            const input = document.getElementById('modalQtyInput');
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });

        document.getElementById('modalQtyPlus').addEventListener('click', () => {
            const input = document.getElementById('modalQtyInput');
            if (input.value < 10) {
                input.value = parseInt(input.value) + 1;
            }
        });

        document.getElementById('modalQtyInput').addEventListener('change', (e) => {
            let value = parseInt(e.target.value);
            if (value < 1) value = 1;
            if (value > 10) value = 10;
            e.target.value = value;
        });
    }

    showQuickView(productId) {
        const product = this.productData[productId];
        const modal = document.getElementById('quickViewModal');

        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalCurrentPrice').textContent = `R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('modalOldPrice').textContent = `R$ ${(product.price * 1.15).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        document.getElementById('modalAddBtn').dataset.id = productId;
        document.getElementById('modalQtyInput').value = 1;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    document.querySelector('.nav-menu').classList.remove('active');
                }
            });
        });
    }

    initHeaderScrollEffect() {
        const header = document.querySelector('.header');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(102, 126, 234, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    initFormSubmission() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = this.querySelector('input[type="text"]').value;
                const email = this.querySelector('input[type="email"]').value;
                const message = this.querySelector('textarea').value;
                
                alert(`Obrigado ${name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`);
                this.reset();
            });
        }
    }

    initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.classList[1];
                
                let url = '#';
                switch(platform) {
                    case 'facebook':
                        url = 'https://facebook.com/celularstore';
                        break;
                    case 'instagram':
                        url = 'https://instagram.com/celularstore';
                        break;
                    case 'twitter':
                        url = 'https://twitter.com/celularstore';
                        break;
                    case 'whatsapp':
                        url = 'https://wa.me/5511999999999';
                        break;
                    case 'youtube':
                        url = 'https://youtube.com/celularstore';
                        break;
                }
                
                window.open(url, '_blank');
            });
        });
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.product-card, .feature, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Image loading animation
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});

