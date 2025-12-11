// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Get guest name from URL parameter
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('guestName').textContent = decodeURIComponent(guestName);
    }
}

getGuestName();

// Open Invitation
const cover = document.getElementById('cover');
const mainContent = document.getElementById('mainContent');
const openBtn = document.getElementById('openInvitation');
const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');

openBtn.addEventListener('click', () => {
    cover.classList.add('hidden');
    mainContent.classList.add('active');
    
    // Play music
    bgMusic.play().catch(error => {
        console.log('Autoplay was prevented:', error);
    });
    musicControl.classList.add('playing');
    
    // Refresh AOS
    AOS.refresh();
});

// Music Control
let isPlaying = false;

musicControl.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicControl.classList.add('playing');
        isPlaying = true;
    } else {
        bgMusic.pause();
        musicControl.classList.remove('playing');
        isPlaying = false;
    }
});

// Countdown Timer
const weddingDate = new Date('2025-02-15T08:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// RSVP Form
const rsvpForm = document.getElementById('rsvpForm');

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(rsvpForm);
    const name = formData.get('name') || rsvpForm.querySelector('input[type="text"]').value;
    const attendance = formData.get('attendance');
    
    // Here you would typically send the data to a server
    // For demo purposes, we'll just show an alert
    alert(`Terima kasih ${name}! Konfirmasi kehadiran Anda telah kami terima.`);
    
    rsvpForm.reset();
});

// Wishes Form
const wishesForm = document.getElementById('wishesForm');
const wishesList = document.querySelector('.wishes-list');

wishesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = wishesForm.querySelector('input[type="text"]').value;
    const message = wishesForm.querySelector('textarea').value;
    
    // Create new wish item
    const wishItem = document.createElement('div');
    wishItem.className = 'wish-item';
    wishItem.innerHTML = `
        <div class="wish-header">
            <i class="fas fa-user-circle"></i>
            <div>
                <h4>${name}</h4>
                <span class="wish-date">Baru saja</span>
            </div>
        </div>
        <p class="wish-message">${message}</p>
    `;
    
    // Add to top of wishes list
    wishesList.insertBefore(wishItem, wishesList.firstChild);
    
    // Show success message
    alert('Terima kasih atas ucapan dan doa Anda!');
    
    // Reset form
    wishesForm.reset();
    
    // Add fade-in animation
    wishItem.style.opacity = '0';
    setTimeout(() => {
        wishItem.style.transition = 'opacity 0.5s ease';
        wishItem.style.opacity = '1';
    }, 100);
});

// Copy Account Number
const copyButtons = document.querySelectorAll('.btn-copy');

copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const textToCopy = button.getAttribute('data-copy');
        
        // Create temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        // Select and copy
        textarea.select();
        document.execCommand('copy');
        
        // Remove textarea
        document.body.removeChild(textarea);
        
        // Show feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroWedding = document.querySelector('.hero-wedding');
    
    if (heroWedding) {
        heroWedding.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Lazy Load Images (if you add real images later)
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

// Disable right-click (optional - for protecting content)
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
// });

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Gallery Modal (optional enhancement)
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // You can add a modal/lightbox here to show full-size images
        console.log('Gallery item clicked');
    });
});

// Form validation enhancement
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Console message
console.log('%c💒 Wedding Invitation', 'font-size: 20px; font-weight: bold; color: #d4af37;');
console.log('%cMade with ❤️ for Budi & Ani', 'font-size: 14px; color: #b76e79;');