// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contact-form');
const header = document.querySelector('.header');

// Mobile Navigation Toggle
function toggleMobileNav() {
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Close mobile nav when clicking on a link
function closeMobileNav() {
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Smooth scrolling for navigation links and buttons
function smoothScrollToSection(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile nav if open
        closeMobileNav();
        
        // Update active nav link
        updateActiveNavLink(targetId);
    }
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Header scroll effect
function handleHeaderScroll() {
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'var(--color-surface)';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
    }
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const message = formData.get('message')?.trim();
    
    if (!name) {
        errors.push('Name is required');
    }
    
    if (!email) {
        errors.push('Email is required');
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    if (!phone) {
        errors.push('Phone number is required');
    } else {
        const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phonePattern.test(phone)) {
            errors.push('Please enter a valid phone number');
        }
    }
    
    if (!message) {
        errors.push('Message is required');
    } else if (message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Show form success/error message
function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message status status--${type}`;
    messageElement.style.marginTop = 'var(--space-16)';
    messageElement.textContent = message;
    
    // Insert message after form
    if (contactForm) {
        contactForm.insertAdjacentElement('afterend', messageElement);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Enhanced contact form handling with validation
function handleContactForm(e) {
    e.preventDefault();
    
    if (!contactForm) return;
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (!submitBtn) return;
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage('error', errors.join('. '));
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    
    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
        try {
            // Reset form
            contactForm.reset();
            showFormMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.');
        } catch (error) {
            showFormMessage('error', 'Something went wrong. Please try again.');
        } finally {
            // Reset button state
            submitBtn.classList.remove('btn--loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }, 2000);
}

// Intersection Observer for navigation highlighting
function createIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = '#' + entry.target.id;
                updateActiveNavLink(targetId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service__card, .industry__card, .advantage__card');
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize keyboard navigation
function initKeyboardNavigation() {
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Handle enter key on nav toggle
    if (navToggle) {
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileNav();
            }
        });
    }
}

// Add loading states and user feedback
function enhanceUserExperience() {
    // Add click handlers for all anchor links with href starting with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToSection);
    });
    
    // Add hover effects for better interaction feedback
    const cards = document.querySelectorAll('.service__card, .industry__card, .client__logo');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform.includes('translateY') ? 
                this.style.transform.replace(/translateY\([^)]*\)/, 'translateY(-4px)') : 
                'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(/translateY\([^)]*\)/, 'translateY(0)');
        });
    });
}

// Initialize page functionality
function initializePage() {
    try {
        // Navigation functionality
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }
        
        // Smooth scrolling for all navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScrollToSection);
        });
        
        // Contact form handling
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
        }
        
        // Scroll effects
        window.addEventListener('scroll', handleHeaderScroll);
        
        // Initialize intersection observer for navigation
        createIntersectionObserver();
        
        // Initialize animations
        animateOnScroll();
        
        // Initialize keyboard navigation
        initKeyboardNavigation();
        
        // Enhance user experience
        enhanceUserExperience();
        
        // Handle clicks outside mobile menu
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                navToggle && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });
        
        console.log('VYSE Recruit website initialized successfully');
        
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing any background processes');
    } else {
        console.log('Page visible - resuming functionality');
    }
});

// Error handling for any uncaught errors
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`VYSE Recruit page loaded in ${Math.round(loadTime)}ms`);
    });
}
