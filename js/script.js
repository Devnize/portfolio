// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
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
                navMenu.classList.remove('active');
            }
        });
    });

    // Header scroll effect
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

    // Product data for modal
    const productData = {
        'Smartphone Premium': {
            image: 'images/celular_1.jpg',
            description: 'Tela 6.5", 128GB, Câmera 48MP',
            currentPrice: 'R$ 1.299,00',
            oldPrice: 'R$ 1.499,00',
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
        'Smartphone Básico': {
            image: 'images/celular_2.jpg',
            description: 'Tela 5.5", 64GB, Câmera 13MP',
            currentPrice: 'R$ 599,00',
            oldPrice: 'R$ 699,00',
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
        'Smartphone Intermediário': {
            image: 'images/celular_3.jpg',
            description: 'Tela 6.1", 256GB, Câmera 64MP',
            currentPrice: 'R$ 899,00',
            oldPrice: 'R$ 999,00',
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
        'Smartphone Top de Linha': {
            image: 'images/celular_4.jpg',
            description: 'Tela 6.7", 512GB, Câmera 108MP',
            currentPrice: 'R$ 2.199,00',
            oldPrice: 'R$ 2.499,00',
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

    // Quick View Modal functionality
    const modal = document.getElementById('quickViewModal');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const closeBtn = document.querySelector('.close');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent;
            const product = productData[productTitle];

            if (product) {
                document.getElementById('modalImage').src = product.image;
                document.getElementById('modalTitle').textContent = productTitle;
                document.getElementById('modalDescription').textContent = product.description;
                document.getElementById('modalCurrentPrice').textContent = product.currentPrice;
                document.getElementById('modalOldPrice').textContent = product.oldPrice;

                const featuresList = document.getElementById('modalFeatures');
                featuresList.innerHTML = '';
                product.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Contact buttons functionality
    const contactBtns = document.querySelectorAll('.contact-btn');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card') || this.closest('.modal-content');
            let productName = 'produto';
            
            if (productCard) {
                const titleElement = productCard.querySelector('h3') || productCard.querySelector('#modalTitle');
                if (titleElement) {
                    productName = titleElement.textContent;
                }
            }

            const message = `Olá! Tenho interesse no ${productName}. Gostaria de mais informações sobre preço e disponibilidade.`;
            const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simulate form submission
            alert(`Obrigado ${name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`);
            this.reset();
        });
    }

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

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.product-card, .feature, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Social links functionality
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList[1]; // Get the second class (facebook, instagram, etc.)
            
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

    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.product-card, .feature, .contact-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

