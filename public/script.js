document.addEventListener('DOMContentLoaded', () => {
    // === Floating Action Button (Mobile) ===
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');
    const fabThemeToggle = document.getElementById('fabThemeToggle');
    
    if (fabButton && fabMenu) {
        fabButton.addEventListener('click', () => {
            fabButton.classList.toggle('active');
            fabMenu.classList.toggle('active');
        });
        
        // Close FAB menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!fabButton.contains(e.target) && !fabMenu.contains(e.target)) {
                fabButton.classList.remove('active');
                fabMenu.classList.remove('active');
            }
        });
    }
    
    // FAB Theme Toggle
    if (fabThemeToggle) {
        fabThemeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // === Theme Toggle ===
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Animate the toggle
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 600);
        });
    }

    // === Search Filter Logic ===
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card-container');

            cards.forEach((container, index) => {
                const card = container.querySelector('.card-front');
                const title = card.querySelector('.title').textContent.toLowerCase();
                const author = card.querySelector('.author').textContent.toLowerCase();
                
                if (title.includes(query) || author.includes(query)) {
                    container.style.display = 'block';
                    container.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
                } else {
                    container.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        container.style.display = 'none';
                    }, 300);
                }
            });
        });
    }

    // === Star Rating Logic ===
    const starContainers = document.querySelectorAll('.star-rating-container');
    
    starContainers.forEach(container => {
        const stars = container.querySelectorAll('.star-rating-star');
        const hiddenInput = container.querySelector('input[type="hidden"]');
        
        // Initialize based on hidden input value if present (edit mode)
        if (hiddenInput && hiddenInput.value) {
            updateStars(stars, hiddenInput.value);
        }

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                // Update hidden input
                if (hiddenInput) {
                    hiddenInput.value = value;
                }
                // Update visuals
                updateStars(stars, value);
            });
            
            // Hover effect
            star.addEventListener('mouseenter', () => {
                const value = star.getAttribute('data-value');
                highlightStars(stars, value);
            });
        });
        
        // Reset on mouse leave
        container.addEventListener('mouseleave', () => {
            if (hiddenInput && hiddenInput.value) {
                updateStars(stars, hiddenInput.value);
            }
        });
    });

    function updateStars(stars, value) {
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-value')) <= parseInt(value)) {
                s.classList.add('active');
                s.style.color = '#FFD700';
            } else {
                s.classList.remove('active');
                s.style.color = '#CBD5E1';
            }
        });
    }
    
    function highlightStars(stars, value) {
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-value')) <= parseInt(value)) {
                s.style.color = '#FFD700';
            } else {
                s.style.color = '#CBD5E1';
            }
        });
    }
    
    
    // === Read More / Read Less Logic ===
    initReadMore();
    
    // === Ripple Effect on Buttons ===
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .chip-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // === Magnetic Cursor Effect (Desktop only) ===
    if (window.innerWidth > 768) {
        const cards = document.querySelectorAll('.card-container');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                const rotateX = deltaY * -5; // Tilt up/down
                const rotateY = deltaX * 5;  // Tilt left/right
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
    
    // === Intersection Observer for Scroll Animations ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card-container').forEach(card => {
        observer.observe(card);
    });
});

function initReadMore() {
    const noteContents = document.querySelectorAll('.note-content');
    
    noteContents.forEach(content => {
        const lineHeight = parseInt(getComputedStyle(content).lineHeight);
        const maxLines = 3;
        const maxHeight = lineHeight * maxLines;
        
        if (content.scrollHeight > content.clientHeight + 2 || content.textContent.length > 150) {
            const btn = content.parentElement.querySelector('.read-more-btn');
            if (btn) {
                btn.style.display = 'inline-block';
                
                btn.addEventListener('click', () => {
                    const isExpanded = content.classList.contains('expanded');
                    if (isExpanded) {
                        content.classList.remove('expanded');
                        btn.textContent = 'Read more';
                    } else {
                        content.classList.add('expanded');
                        btn.textContent = 'Read less';
                    }
                });
            }
        }
    });
}

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(style);
