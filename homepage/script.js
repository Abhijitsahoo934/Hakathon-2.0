// DOM Elements
const navbar = document.querySelector('.navbar');
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const mainContent = document.querySelector('.main-content');
const sidebarNavLinks = document.querySelectorAll('.sidebar .nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const searchInput = document.querySelector('.search-input');
const clearSearchBtn = document.querySelector('.clear-search');
const notificationBtn = document.querySelector('.notification-btn');
const notifications = document.querySelector('.notifications');
const profileBtn = document.querySelector('.profile-btn');
const profile = document.querySelector('.profile');
const toastContainer = document.querySelector('.toast-container');
const parallaxImages = document.querySelectorAll('.parallax-img');
const heroSection = document.querySelector('.hero-section');
const featureCards = document.querySelectorAll('.feature-card');
const glassCards = document.querySelectorAll('.glass-card');
const showcaseItems = document.querySelectorAll('.showcase-item');

// State Management
let isSidebarCollapsed = false;
let isMobileView = window.innerWidth <= 768;
let lastScrollTop = 0;
let isScrolling = false;
let isNavbarVisible = true;
let scrollPosition = 0;
let ticking = false;

// Theme Management
function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add animation class
    themeToggle.classList.add('theme-transition');
    setTimeout(() => themeToggle.classList.remove('theme-transition'), 500);
    
    // Show toast notification
    showToast('Theme Changed', `Switched to ${isDark ? 'dark' : 'light'} mode`, isDark ? 'moon' : 'sun');
}

// Navbar Scroll Behavior
function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show navbar based on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                if (isNavbarVisible) {
                    navbar.classList.add('navbar-hidden');
                    isNavbarVisible = false;
                }
            } else {
                if (!isNavbarVisible) {
                    navbar.classList.remove('navbar-hidden');
                    isNavbarVisible = true;
                }
            }
            
            // Auto-hide sidebar on mobile when scrolling down
            if (isMobileView && sidebar.classList.contains('active')) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    sidebar.classList.remove('active');
                    sidebarToggle.setAttribute('aria-expanded', 'false');
                }
            }
            
            // Update scroll position for parallax effects
            scrollPosition = scrollTop;
            
            // Trigger parallax effects
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    applyParallaxEffects();
                    ticking = false;
                });
                ticking = true;
            }
            
            lastScrollTop = scrollTop;
            isScrolling = false;
        });
    }
    isScrolling = true;
}

// Parallax Effects
function applyParallaxEffects() {
    // Apply parallax to images
    parallaxImages.forEach(img => {
        const speed = 0.5;
        const yPos = -(scrollPosition * speed);
        img.style.transform = `translateY(${yPos}px)`;
    });
    
    // Apply parallax to decorative elements
    const decorations = document.querySelectorAll('.hero-decoration > div');
    decorations.forEach((decoration, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrollPosition * speed);
        const xPos = (index % 2 === 0) ? -(scrollPosition * speed * 0.5) : (scrollPosition * speed * 0.5);
        decoration.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
    
    // Apply parallax to feature cards
    featureCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            const speed = 0.1;
            const yPos = -(scrollPosition * speed);
            card.style.transform = `translateY(${yPos}px)`;
            
            // Add animation class when card is in view
            if (!card.classList.contains('animate')) {
                card.classList.add('animate');
            }
        }
    });
    
    // Apply parallax to glass cards
    glassCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            const speed = 0.15;
            const yPos = -(scrollPosition * speed);
            card.style.transform = `translateY(${yPos}px)`;
            
            // Add animation class when card is in view
            if (!card.classList.contains('animate')) {
                card.classList.add('animate');
            }
        }
    });
    
    // Apply parallax to showcase items
    showcaseItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            const speed = 0.2;
            const yPos = -(scrollPosition * speed);
            item.style.transform = `translateY(${yPos}px)`;
            
            // Add animation class when item is in view
            if (!item.classList.contains('animate')) {
                item.classList.add('animate');
            }
        }
    });
}

// Sidebar Toggle
function toggleSidebar() {
    if (isMobileView) {
        sidebar.classList.toggle('active');
        sidebarToggle.setAttribute('aria-expanded', 
            sidebar.classList.contains('active'));
    } else {
        isSidebarCollapsed = !isSidebarCollapsed;
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
        sidebarToggle.setAttribute('aria-expanded', !isSidebarCollapsed);
        
        // Animate nav links
        sidebarNavLinks.forEach((link, index) => {
            link.style.transitionDelay = `${index * 50}ms`;
            link.classList.add('nav-link-transition');
        });
        
        setTimeout(() => {
            sidebarNavLinks.forEach(link => {
                link.style.transitionDelay = '';
                link.classList.remove('nav-link-transition');
            });
        }, 300);
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', 
        navLinks.classList.contains('active'));
}

// Handle Window Resize
function handleResize() {
    const wasMobile = isMobileView;
    isMobileView = window.innerWidth <= 768;
    
    if (wasMobile !== isMobileView) {
        if (isMobileView) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('sidebar-collapsed');
            sidebar.classList.remove('active');
            navLinks.classList.remove('active');
        } else {
            sidebar.classList.toggle('collapsed', isSidebarCollapsed);
            mainContent.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
        }
    }
}

// Search Functionality
function handleSearch() {
    const searchValue = searchInput.value.trim();
    
    if (searchValue) {
        clearSearchBtn.classList.add('visible');
    } else {
        clearSearchBtn.classList.remove('visible');
    }
    
    // Simulate search functionality
    if (searchValue.length > 2) {
        // In a real application, you would perform a search here
        console.log(`Searching for: ${searchValue}`);
    }
}

function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    searchInput.focus();
}

// Notifications
function toggleNotifications() {
    notifications.classList.toggle('active');
    
    if (notifications.classList.contains('active')) {
        // Close profile dropdown if open
        profile.classList.remove('active');
        
        // Load notifications (simulated)
        loadNotifications();
    }
}

function loadNotifications() {
    const notificationList = document.querySelector('.notification-list');
    
    // Clear existing notifications
    notificationList.innerHTML = '';
    
    // Simulated notifications
    const notifications = [
        {
            icon: 'fa-bell',
            title: 'New Message',
            message: 'You have a new message from John Doe',
            time: '5 minutes ago'
        },
        {
            icon: 'fa-user-plus',
            title: 'New Follower',
            message: 'Jane Smith started following you',
            time: '1 hour ago'
        },
        {
            icon: 'fa-tasks',
            title: 'Task Completed',
            message: 'Your task "Update Dashboard" has been completed',
            time: '2 hours ago'
        }
    ];
    
    // Add notifications to the list
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;
        notificationList.appendChild(notificationItem);
    });
}

function markAllNotificationsAsRead() {
    const notificationBadge = document.querySelector('.notification-badge');
    notificationBadge.textContent = '0';
    notificationBadge.style.display = 'none';
    
    showToast('Notifications', 'All notifications marked as read', 'check-circle');
}

// Profile Dropdown
function toggleProfile() {
    profile.classList.toggle('active');
    
    if (profile.classList.contains('active')) {
        // Close notifications if open
        notifications.classList.remove('active');
    }
}

// Active Link Management
function setActiveLink() {
    const currentPath = window.location.pathname;
    const hash = window.location.hash || '#home';
    
    sidebarNavLinks.forEach(link => {
        const linkHash = link.getAttribute('href');
        if (linkHash === hash) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Toast Notifications
function showToast(title, message, icon = 'info-circle') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Determine toast type based on icon
    if (icon.includes('check') || icon.includes('success')) {
        toast.classList.add('toast-success');
    } else if (icon.includes('exclamation') || icon.includes('warning')) {
        toast.classList.add('toast-warning');
    } else if (icon.includes('times') || icon.includes('error')) {
        toast.classList.add('toast-error');
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add show class after a small delay to trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Add click event to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => closeToast(toast));
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        closeToast(toast);
    }, 5000);
}

function closeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Handle Click Outside
function handleClickOutside(e) {
    // Close notifications dropdown if clicking outside
    if (notifications.classList.contains('active') && 
        !notifications.contains(e.target) && 
        !notificationBtn.contains(e.target)) {
        notifications.classList.remove('active');
    }
    
    // Close profile dropdown if clicking outside
    if (profile.classList.contains('active') && 
        !profile.contains(e.target) && 
        !profileBtn.contains(e.target)) {
        profile.classList.remove('active');
    }
    
    // Close mobile menu if clicking outside
    if (isMobileView && 
        navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // Close dropdowns on Escape key
    if (e.key === 'Escape') {
        notifications.classList.remove('active');
        profile.classList.remove('active');
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    
    // Toggle theme on Ctrl+T
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
}

// Animate Feature Cards
function animateFeatureCards() {
    featureCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView && !card.classList.contains('animate')) {
            // Add animation class with delay based on index
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        }
    });
}

// Initialize
function init() {
    // Initialize theme
    initTheme();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyboardNavigation);
    
    sidebarToggle.addEventListener('click', toggleSidebar);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    notificationBtn.addEventListener('click', toggleNotifications);
    profileBtn.addEventListener('click', toggleProfile);
    
    // Add click event to mark all read button
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }
    
    // Add click event to sidebar nav links
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMobileView) {
                sidebar.classList.remove('active');
                sidebarToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Set active link based on current hash
    setActiveLink();
    window.addEventListener('hashchange', setActiveLink);
    
    // Initial animations
    animateFeatureCards();
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Welcome!', 'Thank you for visiting our platform', 'smile');
    }, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 