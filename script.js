// ===========================
// Modal Functions
// ===========================

/**
 * Opens a modal with the specified file
 * @param {string} filename - The name of the file to open
 * @param {boolean} isImage - Whether the file is an image (PNG)
 */
function openModal(filename, isImage = false) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    // Determine the file path
    const filePath = isImage ? `images/${filename}` : `pdfs/${filename}`;
    
    // Clear previous content
    modalBody.innerHTML = '';
    
    if (isImage) {
        // Create an img element for images
        const img = document.createElement('img');
        img.src = filePath;
        img.alt = filename;
        img.onerror = function() {
            modalBody.innerHTML = `<p style="color: #666; padding: 20px;">Unable to load image: ${filename}</p>`;
        };
        modalBody.appendChild(img);
    } else {
        // Create an embed element for PDFs
        const embed = document.createElement('embed');
        embed.src = filePath;
        embed.type = 'application/pdf';
        embed.width = '100%';
        embed.height = '600px';
        embed.onerror = function() {
            modalBody.innerHTML = `<p style="color: #666; padding: 20px;">Unable to load PDF: ${filename}. Please ensure the file is in the /pdfs/ folder.</p>`;
        };
        modalBody.appendChild(embed);
    }
    
    // Show the modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the modal
 */
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ===========================
// Modal Event Listeners
// ===========================

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ===========================
// Navigation Functions
// ===========================

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the section ID from href
            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            
            if (section) {
                // Smooth scroll to section
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===========================
// Scroll Event Listener
// ===========================
window.addEventListener('scroll', updateActiveNavOnScroll);

// ===========================
// Initialize on Page Load
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Set home as active on page load
    updateActiveNavOnScroll();
    
    // Add smooth animations on scroll
    observeElements();
});

// ===========================
// Intersection Observer for Animations
// ===========================

/**
 * Observe elements and animate them when they come into view
 */
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        observer.observe(card);
    });
    
    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        observer.observe(card);
    });
}

// ===========================
// Utility Functions
// ===========================

/**
 * Copy text to clipboard (useful for email)
 */
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show feedback
    const originalText = event.target.textContent;
    event.target.textContent = 'Copied!';
    setTimeout(() => {
        event.target.textContent = originalText;
    }, 2000);
}

// ===========================
// Mobile Menu Toggle (if needed in future)
// ===========================

/**
 * Toggle mobile menu (for future mobile navigation expansion)
 */
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// ===========================
// Performance Optimization
// ===========================

/**
 * Lazy load images (if needed in future)
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
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
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ===========================
// Dark Mode Toggle (Optional Future Feature)
// ===========================

/**
 * Toggle dark mode (optional feature for future implementation)
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check if user prefers dark mode
function initializeDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
        // Optionally enable dark mode by default
        // document.body.classList.add('dark-mode');
    }
}

// ===========================
// Console Message
// ===========================

// Display a friendly message in the console
console.log('%c🎓 Welcome to Ederlyn Caparas E-Portfolio!', 'color: #0066cc; font-size: 16px; font-weight: bold;');
console.log('%cObject-Oriented Programming Midterm Projects', 'color: #3399ff; font-size: 14px;');
console.log('%cPUP Sta. Mesa - BSIT 2-3', 'color: #666; font-size: 12px;');
