// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// Mobile Navigation
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href*="${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-links a[href*="${sectionId}"]`)?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Program Tabs Filtering
const tabButtons = document.querySelectorAll('.tab-btn');
const programCards = document.querySelectorAll('.program-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-tab');
        
        // Filter program cards
        programCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === category) {
                card.classList.add('active');
                // Re-trigger AOS animation
                card.setAttribute('data-aos', 'zoom-in');
            } else {
                card.classList.remove('active');
            }
        });
        
        // Refresh AOS
        AOS.refresh();
    });
});

// Admission Form Handler
const admissionForm = document.getElementById('admissionForm');

if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(admissionForm);
        const name = admissionForm.querySelector('input[type="text"]').value;
        const email = admissionForm.querySelector('input[type="email"]').value;
        
        // Here you would typically send the data to a server
        // For demo purposes, we'll just show an alert
        alert(`Terima kasih ${name}! Data pendaftaran Anda telah kami terima.\n\nTim admission kami akan menghubungi Anda melalui email (${email}) dalam 1x24 jam.`);
        
        // Reset form
        admissionForm.reset();
    });
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Counter Animation for Hero Stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const suffix = element.textContent.replace(/[0-9,+]/g, '');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }
    }, 16);
}

// Trigger counter animation when hero section is visible
const heroStats = document.querySelectorAll('.stat-item h3');
let hasAnimated = false;

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            heroStats.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                animateCounter(stat, number);
            });
            hasAnimated = true;
        }
    });
}, observerOptions);

const heroSection = document.querySelector('.hero');
if (heroSection) {
    observer.observe(heroSection);
}

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }
});

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,13}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
}

// Add real-time validation to form inputs
if (admissionForm) {
    const emailInput = admissionForm.querySelector('input[type="email"]');
    const phoneInput = admissionForm.querySelector('input[type="tel"]');
    
    emailInput?.addEventListener('blur', (e) => {
        if (e.target.value && !validateEmail(e.target.value)) {
            e.target.style.borderColor = '#dc3545';
        } else {
            e.target.style.borderColor = '';
        }
    });
    
    phoneInput?.addEventListener('blur', (e) => {
        if (e.target.value && !validatePhone(e.target.value)) {
            e.target.style.borderColor = '#dc3545';
        } else {
            e.target.style.borderColor = '';
        }
    });
}

// Lazy Loading Images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Testimonial Auto Slider (optional enhancement)
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    if (testimonialCards.length > 3) {
        testimonialCards.forEach((card, index) => {
            card.style.order = (index - currentTestimonial + testimonialCards.length) % testimonialCards.length;
        });
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    }
}

// Auto rotate testimonials every 5 seconds (if more than 3)
// setInterval(rotateTestimonials, 5000);

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.facility-card, .news-card, .program-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(element);
});

// Dynamic Year in Footer
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('.footer-bottom p:first-child');
yearElements.forEach(element => {
    element.textContent = element.textContent.replace('2025', currentYear);
});

// Search Functionality (if you want to add search later)
function searchPrograms(query) {
    const lowerQuery = query.toLowerCase();
    programCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Handle External Links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

// Console Message
console.log('%c🎓 Telkom University', 'font-size: 24px; font-weight: bold; color: #E31E24;');
console.log('%cWebsite Template by Mentoring Program', 'font-size: 14px; color: #666;');
console.log('%cInterested in studying at Tel-U? Visit our admission page!', 'font-size: 12px; color: #FFB81C;');

// Performance Monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });
}

// Add animation on scroll for section titles
const sectionTitles = document.querySelectorAll('.section-title');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, {
    threshold: 0.5
});

sectionTitles.forEach(title => {
    titleObserver.observe(title);
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);