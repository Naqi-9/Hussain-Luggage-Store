document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.querySelector(".navlinks");
    const overlay = document.getElementById("overlay");

    // Function to toggle drawer menu
    const toggleMenu = () => {
        navLinks.classList.toggle("active");
        overlay.classList.toggle("active");
    };

    // Toggle drawer menu on hamburger click
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close drawer when clicking on overlay
    overlay.addEventListener("click", () => {
        navLinks.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Prevent body scroll when drawer is open on mobile
    const observer = new MutationObserver(() => {
        if (window.innerWidth <= 667) {
            if (navLinks.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }
    });

    observer.observe(navLinks, { attributes: true, attributeFilter: ["class"] });

    // Close drawer on window resize if switching to desktop view
    window.addEventListener("resize", () => {
        if (window.innerWidth > 667) {
            navLinks.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Color selection functionality
    // Color selection functionality
document.addEventListener('click', (e) => {
    // This looks for the color circle you clicked
    const colorCircle = e.target.closest('.color-circle');
    
    // Only run if the circle exists and is NOT out of stock
    if (colorCircle && !colorCircle.classList.contains('out-of-stock')) {
        
        // Find the specific Product Card that contains the clicked circle
        const productCard = colorCircle.closest('.product-card');
        
        // --- STEP A: Update the Circles (UI) ---
        // Find all circles in this card and remove the 'selected' border
        const allCircles = productCard.querySelectorAll('.color-circle');
        allCircles.forEach(circle => circle.classList.remove('selected'));
        
        // Add the 'selected' border to the circle you just clicked
        colorCircle.classList.add('selected');

        // --- STEP B: Swap the Image (The logic you are missing) ---
        // 1. Find the main image element inside this product card
        const mainImg = productCard.querySelector('.main-product-img');
        
        // 2. Grab the image path that we stored in the "data-color-image" attribute earlier
        const newImageSrc = colorCircle.getAttribute('data-color-image');
        
        // 3. If we found an image and a path, update the "src" to show the new picture
        if (mainImg && newImageSrc && newImageSrc !== '') {
            mainImg.src = newImageSrc;
        }
    }
});

    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // On mobile, toggle dropdown on click
            if (window.innerWidth <= 667) {
                e.preventDefault();
                const dropdown = toggle.closest('.nav-dropdown');
                const isActive = dropdown.classList.contains('active');
                
                // Close all other dropdowns
                document.querySelectorAll('.nav-dropdown').forEach(dd => {
                    dd.classList.remove('active');
                });
                
                // Toggle current dropdown
                if (!isActive) {
                    dropdown.classList.add('active');
                }
            }
        });
    });

    // Close dropdowns when clicking outside (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 667) {
            if (!e.target.closest('.nav-dropdown')) {
                document.querySelectorAll('.nav-dropdown').forEach(dd => {
                    dd.classList.remove('active');
                });
            }
        }
    });

    // Prevent dropdown from closing when clicking inside dropdown menu
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Function to update nav link active states
    function updateNavLinkStates(brandFilter, categoryFilter) {
        // Remove active class from all nav links and dropdowns
        document.querySelectorAll('.navlinks > a, .navlinks .dropdown-toggle').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class based on filter
        if (brandFilter) {
            // Find the brand dropdown (first dropdown contains brand items)
            const dropdowns = document.querySelectorAll('.nav-dropdown');
            if (dropdowns.length > 0) {
                // Check if first dropdown has brand items
                const brandItems = dropdowns[0].querySelectorAll('[data-brand]');
                if (brandItems.length > 0) {
                    const toggle = dropdowns[0].querySelector('.dropdown-toggle');
                    if (toggle) toggle.classList.add('active');
                }
            }
        } else if (categoryFilter) {
            // Find the category dropdown (second dropdown contains category items)
            const dropdowns = document.querySelectorAll('.nav-dropdown');
            if (dropdowns.length > 1) {
                // Check if second dropdown has category items
                const categoryItems = dropdowns[1].querySelectorAll('[data-category]');
                if (categoryItems.length > 0) {
                    const toggle = dropdowns[1].querySelector('.dropdown-toggle');
                    if (toggle) toggle.classList.add('active');
                }
            }
        } else {
            // No filter - highlight "ALL PRODUCTS"
            const allProductsLink = document.querySelector('.navlinks > a[href="#"]');
            if (allProductsLink && allProductsLink.textContent.trim() === 'ALL PRODUCTS') {
                allProductsLink.classList.add('active');
            }
        }
    }

    // Helper function to scroll to products with offset
    function scrollToProducts() {
        const productsSection = document.getElementById('productsSection');
        if (productsSection) {
            // Calculate offset based on header and nav height
            const header = document.getElementById('header');
            const navlinks = document.querySelector('.navlinks');
            let offset = 0;
            
            if (header) offset += header.offsetHeight;
            if (navlinks && window.innerWidth > 667) {
                offset += navlinks.offsetHeight;
            }
            
            const elementPosition = productsSection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Shop Now button scroll functionality
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear any filters and show all products
            if (typeof renderProducts === 'function') {
                renderProducts(null, null);
            }
            updateNavLinkStates(null, null);
            scrollToProducts();
        });
    }

    // Filter state (now managed globally in productdata.js)
    // These are kept for backward compatibility but will sync with global state

    // Brand filter functionality
    document.querySelectorAll('[data-brand]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const brand = link.getAttribute('data-brand');
            
            // Clear search input
            if (searchInput) {
                searchInput.value = '';
            }
            if (searchDropdown) {
                searchDropdown.classList.remove('active');
            }
            
            // Close mobile drawer if open
            if (window.innerWidth <= 667) {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            }
            
            // Render filtered products
            if (typeof renderProducts === 'function') {
                renderProducts(brand, null, null);
            }
            
            // Update nav link active states
            updateNavLinkStates(brand, null);
            
            // Scroll to products section with offset
            scrollToProducts();
        });
    });

    // Category filter functionality
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            
            // Clear search input
            if (searchInput) {
                searchInput.value = '';
            }
            if (searchDropdown) {
                searchDropdown.classList.remove('active');
            }
            
            // Close mobile drawer if open
            if (window.innerWidth <= 667) {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            }
            
            // Render filtered products
            if (typeof renderProducts === 'function') {
                renderProducts(null, category, null);
            }
            
            // Update nav link active states
            updateNavLinkStates(null, category);
            
            // Scroll to products section with offset
            scrollToProducts();
        });
    });

    // "ALL PRODUCTS" link - show all products
    const allProductsLink = document.querySelector('.navlinks > a[href="#"]');
    if (allProductsLink && allProductsLink.textContent.trim() === 'ALL PRODUCTS') {
        allProductsLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile drawer if open
            if (window.innerWidth <= 667) {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            }
            
            // Clear search input
            if (searchInput) {
                searchInput.value = '';
            }
            if (searchDropdown) {
                searchDropdown.classList.remove('active');
            }
            
            // Render all products
            if (typeof renderProducts === 'function') {
                renderProducts(null, null, null);
            }
            
            // Update nav link active states
            updateNavLinkStates(null, null);
            
            // Scroll to products section with offset
            scrollToProducts();
        });
    }
    
    // Listen for updateNavLinks event from productdata.js
    window.addEventListener('updateNavLinks', (e) => {
        updateNavLinkStates(e.detail.brand, e.detail.category);
    });
    
    // Initialize: Set "ALL PRODUCTS" as active on page load
    setTimeout(() => {
        updateNavLinkStates(null, null);
    }, 100);

    // Search functionality
    const searchIcon = document.querySelector('.righticons .search');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    const searchCloseBtn = document.getElementById('searchCloseBtn');

    // Toggle search dropdown
    if (searchIcon && searchDropdown) {
        searchIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            searchDropdown.classList.toggle('active');
            if (searchDropdown.classList.contains('active')) {
                setTimeout(() => {
                    searchInput.focus();
                }, 100);
            }
        });
    }

    // Close search dropdown
    function closeSearch() {
        if (searchDropdown) {
            searchDropdown.classList.remove('active');
        }
        if (searchInput) {
            searchInput.value = '';
        }
        // Clear search and show all products
        if (typeof renderProducts === 'function') {
            renderProducts(null, null, null);
        }
        updateNavLinkStates(null, null);
    }

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSearch();
        });
    }

    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (searchDropdown && searchDropdown.classList.contains('active')) {
            if (!searchDropdown.contains(e.target) && !searchIcon.contains(e.target)) {
                // Don't close if user is searching - only close on outside click after delay
                setTimeout(() => {
                    if (!searchInput || searchInput.value.trim() === '') {
                        closeSearch();
                    }
                }, 200);
            }
        }
    });

    // Close search on ESC key
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }

    // Search functionality - works like brand/category filters
    function performSearch(query) {
        // Clear brand and category filters when searching
        if (typeof renderProducts === 'function') {
            renderProducts(null, null, query);
        }
        updateNavLinkStates(null, null);
        
        // Scroll to products section with offset
        if (query && query.trim() !== '') {
            scrollToProducts();
        }
    }

    // Search input event listener
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value;
            searchTimeout = setTimeout(() => {
                if (query.trim() === '') {
                    // Clear search and show all products
                    if (typeof renderProducts === 'function') {
                        renderProducts(null, null, null);
                    }
                    updateNavLinkStates(null, null);
                } else {
                    performSearch(query);
                }
            }, 300); // Debounce search
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(e.target.value);
            }
        });
    }
});
