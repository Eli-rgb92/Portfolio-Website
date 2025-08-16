// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle-btn');
        this.themeIcon = document.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Debug logging
        console.log('ThemeManager initialized');
        console.log('Theme toggle button:', this.themeToggle);
        console.log('Theme icon:', this.themeIcon);
        console.log('Current theme:', this.currentTheme);
        
        this.init();
    }
    
    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateIcon();
        
        // Add event listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                console.log('Theme toggle clicked!');
                this.toggleTheme();
            });
            console.log('Event listener added to theme toggle');
        } else {
            console.error('Theme toggle button not found!');
        }
    }
    
    toggleTheme() {
        console.log('Toggling theme from:', this.currentTheme);
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        console.log('New theme:', this.currentTheme);
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcon();
    }
    
    updateIcon() {
        this.themeIcon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.element.textContent = '';
        this.startTyping();
    }
    
    startTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.typeNextChar();
    }
    
    typeNextChar() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.typeNextChar(), this.speed);
        } else {
            this.isTyping = false;
            // Remove cursor after typing is complete
            setTimeout(() => {
                this.element.style.setProperty('--cursor-opacity', '0');
            }, 2000);
        }
    }
}

// Smooth Scrolling with Active Navigation
class SmoothScroller {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }
    
    init() {
        // Add click listeners to nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
            });
        });
        
        // Add scroll listener for active navigation
        window.addEventListener('scroll', () => this.updateActiveNav());
        
        // Initial active nav update
        this.updateActiveNav();
    }
    
    scrollToSection(targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    updateActiveNav() {
        const scrollPosition = window.scrollY + 150; // Offset for header
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                this.navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
}

// Mobile Navigation Toggle
class MobileNav {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }
    
    init() {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on a link
        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        this.navToggle.setAttribute('aria-expanded', 
            this.navMenu.classList.contains('active').toString());
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing features...');
    
    // Initialize theme manager
    new ThemeManager();
    
    // Initialize typing animation for the hero name
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        new TypingAnimation(heroName, 'Eli Hull', 150);
    }
    
    // Initialize smooth scrolling
    new SmoothScroller();
    
    // Initialize mobile navigation
    new MobileNav();
    
    // Add some nice scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in animation
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
