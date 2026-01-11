// Function to update button states based on selected color
function updateButtonStates() {
    const selectedColorCircle = document.querySelector('#modalColors .color-circle.selected');
    const isOutOfStock = selectedColorCircle && selectedColorCircle.classList.contains('out-of-stock');
    
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (addToCartBtn) {
        if (isOutOfStock) {
            addToCartBtn.classList.add('out-of-stock');
            addToCartBtn.disabled = true;
        } else {
            addToCartBtn.classList.remove('out-of-stock');
            addToCartBtn.disabled = false;
        }
    }
    
    if (buyNowBtn) {
        if (isOutOfStock) {
            buyNowBtn.classList.add('out-of-stock');
            buyNowBtn.disabled = true;
        } else {
            buyNowBtn.classList.remove('out-of-stock');
            buyNowBtn.disabled = false;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.querySelector(".navlinks");
    const overlay = document.getElementById("overlay");

    // Function to toggle drawer menu
    const toggleMenu = () => {
        navLinks.classList.toggle("active");
        overlay.classList.toggle("active");
    };

    // Toggle drawer menu on hamburger click - only if menu button exists
    if (menuBtn) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close drawer when clicking on overlay
    if (overlay) {
        overlay.addEventListener("click", () => {
            navLinks.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    // Prevent body scroll when drawer is open on mobile
    if (navLinks) {
        const observer = new MutationObserver(() => {
            if (window.innerWidth <= 667 && navLinks) {
                if (navLinks.classList.contains("active")) {
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "";
                }
            }
        });

        observer.observe(navLinks, { attributes: true, attributeFilter: ["class"] });
    }

    // Close drawer on window resize if switching to desktop view
    window.addEventListener("resize", () => {
        if (window.innerWidth > 667) {
            if (navLinks) navLinks.classList.remove("active");
            if (overlay) overlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Color selection functionality
    document.addEventListener('click', (e) => {
    const colorCircle = e.target.closest('.color-circle');
    
    if (colorCircle) {
        // Update selected state
        document.querySelectorAll('.color-circle').forEach(circle => {
            circle.classList.remove('selected');
        });
        colorCircle.classList.add('selected');
        
        // Update button states
        updateButtonStates();
        const productCard = colorCircle.closest('.product-card, #productModal');
        const isModal = productCard && (productCard.id === 'productModal' || productCard.closest('#productModal'));
        
        if (!productCard) return;
        
        // Update the UI to show which color is selected
        const allCircles = productCard.querySelectorAll('.color-circle');
        allCircles.forEach(circle => circle.classList.remove('selected'));
        colorCircle.classList.add('selected');

        // Get the color data
        const colorName = colorCircle.getAttribute('data-color-name') || colorCircle.getAttribute('title');
        
        // If this is the main product card (not in modal), update its image immediately
        if (!isModal) {
            const productId = productCard.getAttribute('data-product-id');
            if (productId) {
                const product = productsData.find(p => p.id === parseInt(productId));
                if (product) {
                    const color = product.colors.find(c => c.name === colorName);
                    if (color) {
                        const colorImages = getColorImages(color);
                        if (colorImages.length > 0) {
                            const mainImg = productCard.querySelector('.main-product-img');
                            if (mainImg) {
                                mainImg.src = colorImages[0];
                                mainImg.alt = `${product.name} - ${colorName}`;
                                console.log('Updated main card image to:', colorImages[0]);
                            }
                        }
                    }
                }
            }
            return; // Exit early for main card color changes
        }
        const productId = productCard.getAttribute('data-product-id') || 
                         (productCard.closest('.product-modal')?.querySelector('[data-product-id]')?.getAttribute('data-product-id'));
        
        if (productId) {
            const product = productsData.find(p => p.id === parseInt(productId));
            if (product) {
                const color = product.colors.find(c => c.name === colorName);
                if (color) {
                    const colorImages = getColorImages(color);
                    
                    // Update main image in product card or modal
                    const mainImg = productCard.querySelector('.main-product-img, #modalMainImg');
                    if (mainImg && colorImages.length > 0) {
                        const imageUrl = colorImages[0].trim();
                        if (imageUrl) {
                            mainImg.src = imageUrl;
                            mainImg.alt = `${product.name} - ${colorName}`;
                            mainImg.setAttribute('data-current-color', colorName);
                            
                            // Update the main product card image in the grid if we're in the modal
                            if (productCard.closest('#productModal')) {
                                const mainCardImg = document.querySelector(`.product-card[data-product-id="${productId}"] .main-product-img`);
                                if (mainCardImg) {
                                    mainCardImg.src = imageUrl;
                                    mainCardImg.alt = `${product.name} - ${colorName}`;
                                    mainCardImg.setAttribute('data-current-color', colorName);
                                    console.log('Updated main card image to:', imageUrl);
                                }
                            }
                        } else {
                            console.warn('Empty image URL for color:', colorName);
                        }
                    } else if (mainImg) {
                        console.warn('No images available for color:', colorName);
                    }
                    
                    // Update thumbnails if in modal
                    if (productCard.id === 'productModal' || productCard.closest('#productModal')) {
                        updateModalThumbnails(colorImages, colorName);
                    }
                }
            }
        }
    }
});

    // Dropdown functionality - prevent navigation on toggle click
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Always prevent default to stop navigation
            e.preventDefault();
            e.stopPropagation();
            
            // On mobile, toggle dropdown on click
            if (window.innerWidth <= 667) {
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
            // On desktop, dropdown opens on hover (CSS handles this), just prevent navigation
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
                renderProducts(null, null, null).catch(err => console.error('Error rendering products:', err));
            }
            updateNavLinkStates(null, null);
            scrollToProducts();
    
        });
    }

    // Hero slider buttons scroll functionality
    function setupHeroButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // If we're on the home page, render all products first
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                    renderProducts(null, null, null).catch(err => console.error('Error rendering products:', err));
                }
                updateNavLinkStates(null, null);
                scrollToProducts();
            });
        }
    }

    // Set up all hero slider buttons
    setupHeroButton('shopNowBtn');    // First slide
    setupHeroButton('exploreNowBtn'); // Second slide
    setupHeroButton('shopNowBtn2');   // Third slide

    // Filter state (now managed globally in productdata.js)
    // These are kept for backward compatibility but will sync with global state

// 1. BRAND FILTER FUNCTIONALITY
    document.querySelectorAll('[data-brand]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Always prevent default to handle navigation properly
            
            // Check if we are on index.html
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
            const brand = link.getAttribute('data-brand');

            if (isHomePage) {
                // On home page, apply filter directly
                closeQuickView();
                if (searchInput) searchInput.value = '';
                if (searchDropdown) searchDropdown.classList.remove('active');
                
                if (window.innerWidth <= 667) {
                    navLinks.classList.remove('active');
                    overlay.classList.remove('active');
                }
                
                if (typeof renderProducts === 'function') {
                    renderProducts(brand, null, null).catch(err => console.error('Error rendering products:', err));
                }
                updateNavLinkStates(brand, null);
                scrollToProducts();
            } else {
                // On other pages (like store.html), navigate to index.html with filter
                // Store filter in sessionStorage and navigate
                sessionStorage.setItem('pendingFilter', JSON.stringify({ type: 'brand', value: brand }));
                window.location.href = 'index.html';
            }
        });
    });

    // 2. CATEGORY FILTER FUNCTIONALITY
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Always prevent default to handle navigation properly
            
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
            const category = link.getAttribute('data-category');

            if (isHomePage) {
                // On home page, apply filter directly
                closeQuickView();
                if (searchInput) searchInput.value = '';
                if (searchDropdown) searchDropdown.classList.remove('active');
                
                if (window.innerWidth <= 667) {
                    navLinks.classList.remove('active');
                    overlay.classList.remove('active');
                }
                
                if (typeof renderProducts === 'function') {
                    renderProducts(null, category, null).catch(err => console.error('Error rendering products:', err));
                }
                updateNavLinkStates(null, category);
                scrollToProducts();
            } else {
                // On other pages (like store.html), navigate to index.html with filter
                sessionStorage.setItem('pendingFilter', JSON.stringify({ type: 'category', value: category }));
                window.location.href = 'index.html';
            }
        });
    });

    // 3. "ALL PRODUCTS" LINK
    document.querySelectorAll('.navlinks > a').forEach(link => {
        if (link.textContent.trim() === 'ALL PRODUCTS') {
            link.addEventListener('click', (e) => {
                const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

                if (isHomePage) {
                    e.preventDefault();
                    closeQuickView();
                    if (window.innerWidth <= 667) {
                        navLinks.classList.remove('active');
                        overlay.classList.remove('active');
                    }
                    if (searchInput) searchInput.value = '';
                    if (searchDropdown) searchDropdown.classList.remove('active');
                    
                    if (typeof renderProducts === 'function') {
                        renderProducts(null, null, null).catch(err => console.error('Error rendering products:', err));
                    }
                    updateNavLinkStates(null, null);
                    scrollToProducts();
                }
                // If not on home page, allow navigation (don't prevent default)
            });
        }
    });
    
    // Check for pending filter on page load (for navigation from store.html)
    const pendingFilter = sessionStorage.getItem('pendingFilter');
    if (pendingFilter) {
        try {
            const filter = JSON.parse(pendingFilter);
            sessionStorage.removeItem('pendingFilter'); // Clear after reading
            
            // Wait for page to fully load
            setTimeout(() => {
                if (filter.type === 'brand' && typeof renderProducts === 'function') {
                    renderProducts(filter.value, null, null);
                    updateNavLinkStates(filter.value, null);
                    // Scroll immediately to products, skipping hero section
                    setTimeout(() => scrollToProducts(), 50);
                } else if (filter.type === 'category' && typeof renderProducts === 'function') {
                    renderProducts(null, filter.value, null);
                    updateNavLinkStates(null, filter.value);
                    // Scroll immediately to products, skipping hero section
                    setTimeout(() => scrollToProducts(), 50);
                }
            }, 150);
        } catch (e) {
            console.error('Error applying pending filter:', e);
        }
    }
    
    // Check if search should be opened (for navigation from store.html)
    if (sessionStorage.getItem('openSearch')) {
        sessionStorage.removeItem('openSearch');
        setTimeout(() => {
            if (searchDropdown) {
                searchDropdown.classList.add('active');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }, 200);
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
            
            // Check if we are on index.html
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
            
            if (!isHomePage) {
                // On other pages (like store.html), navigate to index.html and open search
                window.location.href = 'index.html';
                sessionStorage.setItem('openSearch', 'true');
                return;
            }
            
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
                renderProducts(null, null, null).catch(err => console.error('Error rendering products:', err));
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
            renderProducts(null, null, query).catch(err => console.error('Error rendering products:', err));
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
                        renderProducts(null, null, null).catch(err => console.error('Error rendering products:', err));
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
// --- PRODUCT DETAIL PAGE (MODAL) LOGIC ---

// Helper function to get images array from color (supports both single image and multiple images)
function getColorImages(color) {
    if (!color) return [];
    
    // 1. Check if we have an 'images' array
    if (color.images) {
        // If it's already an array, return it
        if (Array.isArray(color.images)) {
            return color.images.filter(img => img); // Filter out any falsy values
        }
        // If it's a string that looks like a JSON array, try to parse it
        if (typeof color.images === 'string' && color.images.trim().startsWith('[')) {
            try {
                const parsed = JSON.parse(color.images);
                return Array.isArray(parsed) ? parsed.filter(img => img) : [];
            } catch (e) {
                console.warn('Could not parse images as JSON, treating as single image:', color.images);
                return [color.images].filter(img => img);
            }
        }
        // If it's a non-empty string, treat as single image
        if (typeof color.images === 'string' && color.images.trim() !== '') {
            return [color.images];
        }
    }
    
    // 2. Fallback to single 'image' property if it exists
    if (color.image) {
        return [color.image];
    }
    
    // 3. If we get here, no valid images found
    console.warn('No valid images found for color:', color.name || 'unnamed');
    return [];
}

// Helper function to update modal thumbnails
function updateModalThumbnails(images, colorName) {
    const modalThumbnails = document.getElementById('modalThumbnails');
    if (!modalThumbnails) return;
    
    // Clear existing thumbnails
    modalThumbnails.innerHTML = '';
    
    // If no images, show a placeholder or return early
    if (!images || images.length === 0) {
        return;
    }
    
    // Add new thumbnails
    images.forEach((imgSrc, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        
        // Create image element properly
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Thumbnail ${index + 1}`;
        img.className = 'thumb-img';
        img.setAttribute('data-image-index', index);
        
        // Add click handler to update main image
        thumbnail.onclick = () => {
            // Update main image
            const mainImg = document.getElementById('modalMainImg');
            if (mainImg) {
                mainImg.src = imgSrc;
                mainImg.setAttribute('data-current-color', colorName);
                
                // Update active thumbnail - remove active class from all thumbnails first
                const allThumbnails = document.querySelectorAll('.thumbnail');
                allThumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                thumbnail.classList.add('active');
                
                // Also update the thumbnail image to show active state
                const thumbImg = thumbnail.querySelector('img');
                if (thumbImg) {
                    // Remove active class from all thumbnail images
                    document.querySelectorAll('.thumbnail img').forEach(img => img.classList.remove('active'));
                    // Add active class to clicked thumbnail image
                    thumbImg.classList.add('active');
                }
                
                // Update current image index in modal
                const modal = document.getElementById('productModal');
                if (modal) {
                    modal.setAttribute('data-current-image-index', index);
                }
            }
        };
        
        // Set initial active state for first thumbnail
        if (index === 0) {
            thumbnail.classList.add('active');
            const thumbImg = thumbnail.querySelector('img');
            if (thumbImg) {
                thumbImg.classList.add('active');
            }
        }
        
        thumbnail.appendChild(img);
        modalThumbnails.appendChild(thumbnail);
    });
    
    // Show/hide navigation arrows based on number of images
    const prevBtn = document.getElementById('imagePrevBtn');
    const nextBtn = document.getElementById('imageNextBtn');
    const shouldShowArrows = images.length > 1;
    
    if (prevBtn) {
        prevBtn.style.display = shouldShowArrows ? 'flex' : 'none';
        
        // Set up previous button click handler
        if (shouldShowArrows) {
            prevBtn.onclick = () => {
                const modal = document.getElementById('productModal');
                if (!modal) return;
                
                const currentIndex = parseInt(modal.getAttribute('data-current-image-index') || '0');
                const prevIndex = (currentIndex - 1 + images.length) % images.length;
                
                // Simulate click on the previous thumbnail
                const prevThumb = modalThumbnails.querySelector(`[data-image-index="${prevIndex}"]`);
                if (prevThumb && prevThumb.parentElement) {
                    prevThumb.parentElement.click();
                }
            };
        }
    }
    
    if (nextBtn) {
        nextBtn.style.display = shouldShowArrows ? 'flex' : 'none';
        
        // Set up next button click handler
        if (shouldShowArrows) {
            nextBtn.onclick = () => {
                const modal = document.getElementById('productModal');
                if (!modal) return;
                
                const currentIndex = parseInt(modal.getAttribute('data-current-image-index') || '0');
                const nextIndex = (currentIndex + 1) % images.length;
                
                // Simulate click on the next thumbnail
                const nextThumb = modalThumbnails.querySelector(`[data-image-index="${nextIndex}"]`);
                if (nextThumb && nextThumb.parentElement) {
                    nextThumb.parentElement.click();
                }
            };
        }
    }
    
    // Store current images array in modal for navigation
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.setAttribute('data-current-images', JSON.stringify(images));
        modal.setAttribute('data-current-image-index', '0');
    }
}

// Function to update main image display
function updateMainImageDisplay(index) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    const imagesJson = modal.getAttribute('data-current-images');
    if (!imagesJson) return;
    
    try {
        const images = JSON.parse(imagesJson);
        if (images && images[index] !== undefined) {
            const modalMainImg = document.getElementById('modalMainImg');
            if (modalMainImg) {
                modalMainImg.src = images[index];
            }
            
            // Update active thumbnail
            document.querySelectorAll('.thumb-img').forEach(thumb => {
                thumb.classList.remove('active');
            });
            const activeThumb = document.querySelector(`.thumb-img[data-image-index="${index}"]`);
            if (activeThumb) {
                activeThumb.classList.add('active');
            }
            
            // Update current index
            modal.setAttribute('data-current-image-index', index.toString());
            
            // Show/hide navigation arrows based on number of images
            const prevBtn = document.getElementById('imagePrevBtn');
            const nextBtn = document.getElementById('imageNextBtn');
            
            if (prevBtn) prevBtn.style.display = images.length > 1 ? 'flex' : 'none';
            if (nextBtn) nextBtn.style.display = images.length > 1 ? 'flex' : 'none';
        }
    } catch (e) {
        console.error('Error parsing images:', e);
    }
}

// Function to navigate images
function navigateImage(direction) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    const imagesJson = modal.getAttribute('data-current-images');
    if (!imagesJson) return;
    
    try {
        const images = JSON.parse(imagesJson);
        const currentIndex = parseInt(modal.getAttribute('data-current-image-index') || '0');
        
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % images.length;
        } else {
            newIndex = (currentIndex - 1 + images.length) % images.length;
        }
        
        updateMainImageDisplay(newIndex);
    } catch (e) {
        console.error('Error navigating images:', e);
    }
}

// 1. Function to open and populate the modal
function openProductModal(productId) {
    const product = productsData.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    // Set default size to 'Small' if available
    setTimeout(() => {
        const sizeButtons = document.querySelectorAll('.size-btn');
        if (sizeButtons.length > 0) {
            // First, remove active class from all size buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Try to find 'Small' size
            const smallButton = Array.from(sizeButtons).find(btn => 
                btn.textContent.trim().toLowerCase().includes('small') && 
                !btn.classList.contains('out-of-stock')
            );
            
            // If 'Small' is found and available, select it
            if (smallButton) {
                smallButton.classList.add('active');
            } 
            // Otherwise, select the first available size
            else {
                const firstAvailable = Array.from(sizeButtons).find(btn => 
                    !btn.classList.contains('out-of-stock')
                );
                if (firstAvailable) {
                    firstAvailable.classList.add('active');
                } else if (sizeButtons.length > 0) {
                    // If no sizes are available, just select the first one
                    sizeButtons[0].classList.add('active');
                }
            }
        }
    }, 10);

    const modal = document.getElementById('productModal');
    
    // Fill Text Data
    document.getElementById('modalName').textContent = product.name;
    const categoryElement = document.getElementById('modalCategory');
    if (product.category) {
        categoryElement.textContent = product.category;
    } else if (product.brand) {
        categoryElement.textContent = product.brand;
    } else {
        categoryElement.textContent = ''; // Hide if no category or brand
    }
    document.getElementById('modalDescription').textContent = product.description || "Premium quality travel gear designed for durability and style.";
    
    // Set Initial Image (First available color)
    const firstColor = product.colors.find(c => c.available) || product.colors[0];
    const firstColorImages = getColorImages(firstColor);
    const modalMainImg = document.getElementById('modalMainImg');
    if (modalMainImg && firstColorImages.length > 0) {
        modalMainImg.src = firstColorImages[0];
        modalMainImg.setAttribute('data-current-color', firstColor.name);
    }

    // Generate Color Circles for Modal with data-color-name attribute
    const modalColors = document.getElementById('modalColors');
    modalColors.innerHTML = product.colors.map(color => {
        const colorImages = getColorImages(color);
        const firstImage = colorImages.length > 0 ? colorImages[0] : '';
        return `
        <div class="color-circle ${color.available ? '' : 'out-of-stock'}" 
             style="background-color: ${color.code}" 
             data-image="${firstImage}"
             data-color-name="${color.name}"
             title="${color.name}">
        </div>
    `;
    }).join('');

    // Generate Size Buttons (If they exist)
    const sizeSection = document.getElementById('sizeSection');
    const modalSizes = document.getElementById('modalSizes');
    const modalPrice = document.getElementById('modalPrice');

    if (product.sizes && product.sizes.length > 0) {
        sizeSection.style.display = 'block';
        modalSizes.innerHTML = product.sizes.map((s, index) => `
            <button class="size-btn ${index === product.sizes.length - 1 ? 'active' : ''}" 
                    data-price="${s.price}">
                ${s.label}
            </button>
        `).join('');
        // Set initial price to the "Set" or default price
        modalPrice.textContent = `Rs. ${product.basePrice.toLocaleString('en-PK')}`;
    } else {
        sizeSection.style.display = 'none';
        modalPrice.textContent = `Rs. ${product.basePrice.toLocaleString('en-PK')}`;
    }

    // Generate Mini Thumbnails (from first color)
    updateModalThumbnails(firstColorImages, firstColor.name);

    // Store product ID for cart functionality
    modal.setAttribute('data-current-product-id', productId);
    
    // Reset quantity to 1
    const qtyInput = document.getElementById('qtyInput');
    if (qtyInput) {
        qtyInput.value = 1;
    }
    
    // Select first color circle
    setTimeout(() => {
        const firstColorCircle = modalColors.querySelector('.color-circle:not(.out-of-stock)');
        if (firstColorCircle) {
            firstColorCircle.classList.add('selected');
        }
        
        // Show/hide navigation arrows based on number of images
        const prevBtn = document.getElementById('imagePrevBtn');
        const nextBtn = document.getElementById('imageNextBtn');
        
        if (prevBtn) prevBtn.style.display = firstColorImages.length > 1 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = firstColorImages.length > 1 ? 'flex' : 'none';
    }, 100);

    // Show the Modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling the main page
}

// Make functions globally available
window.updateMainImageDisplay = updateMainImageDisplay;
window.navigateImage = navigateImage;

// 2. EVENT LISTENERS for the Modal
document.addEventListener('click', (e) => {
    // A. Open Modal when clicking a Product Card (excluding color circles)
    const card = e.target.closest('.product-card');
    const isColorCircle = e.target.closest('.color-circle');
    const isCartBtn = e.target.closest('.add-to-cart-btn');

    if (card && !isColorCircle && !isCartBtn) {
        const productId = card.getAttribute('data-product-id');
        openProductModal(productId);
    }

    // B. Close Modal (Back to Store)
    if (e.target.id === 'backToStore') {
        document.getElementById('productModal').style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    // C. Change Main Image via Modal Color Circles
    const modalColor = e.target.closest('#modalColors .color-circle');
    if (modalColor) {
        // Get the color name and product ID
        const modal = document.getElementById('productModal');
        const productId = modal ? modal.getAttribute('data-current-product-id') : null;
        
        if (productId) {
            const product = productsData.find(p => p.id === parseInt(productId));
            if (product) {
                const colorName = modalColor.getAttribute('data-color-name');
                const selectedColor = product.colors.find(c => c.name === colorName);
                
                if (selectedColor) {
                    // Get images array (support both single image and multiple images)
                    const images = getColorImages(selectedColor);
                    
                    if (images.length > 0) {
                        // Update thumbnails to show images for this color
                        updateModalThumbnails(images, colorName);
                        
                        // Update main image to first image of selected color
                        const modalMainImg = document.getElementById('modalMainImg');
                        if (modalMainImg) {
                            modalMainImg.setAttribute('data-current-color', colorName);
                        }
                        
                        // Reset to first image when color changes (this will also update main image)
                        updateMainImageDisplay(0);
                    }
                }
            }
        } else {
            // Fallback to old behavior if no product found
            const imageSrc = modalColor.getAttribute('data-image');
            if (imageSrc) {
                document.getElementById('modalMainImg').src = imageSrc;
            }
        }
        
        // Update selected circle
        document.querySelectorAll('#modalColors .color-circle').forEach(c => c.classList.remove('selected'));
        modalColor.classList.add('selected');
        
        // Update button states
        updateButtonStates();
    }

    // D. Change Price via Size Buttons
    const sizeBtn = e.target.closest('.size-btn');
    if (sizeBtn) {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        sizeBtn.classList.add('active');
        const newPrice = parseInt(sizeBtn.getAttribute('data-price'));
        document.getElementById('modalPrice').textContent = `Rs. ${newPrice.toLocaleString('en-PK')}`;
    }
});
// 1. Quantity Increment/Decrement Logic
document.addEventListener('click', (e) => {
    const qtyInput = document.getElementById('qtyInput');
    if (!qtyInput) return;

    let currentValue = parseInt(qtyInput.value);

    if (e.target.id === 'qtyPlus') {
        qtyInput.value = currentValue + 1;
    } 
    else if (e.target.id === 'qtyMinus') {
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    }
});

// 3. Reset logic: Ensure quantity goes back to 1 when a new product is opened
// Find your existing openProductModal function and add this line at the start:
// document.getElementById('qtyInput').value = 1;
function closeQuickView() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enables background scrolling
    }
}

// --- CART FUNCTIONALITY ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart UI
function initCart() {
    updateCartBadge();
    renderCart();
}

// Add item to cart
function addToCart(productId, color, size, quantity, price) {
    const product = productsData.find(p => p.id === parseInt(productId));
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Get the selected color object
    const selectedColor = product.colors.find(c => c.name === color);
    if (!selectedColor) {
        console.error('Color not found:', color, 'in product:', product.name);
        return;
    }

    // Get the first image for the selected color
    const colorImages = getColorImages(selectedColor);
    let image = '';
    
    if (colorImages && colorImages.length > 0) {
        // Make sure we have a valid image URL
        image = colorImages[0] ? colorImages[0].trim() : '';
        if (!image) {
            console.warn('Empty image URL for color:', color, 'in product:', product.name);
        }
    } else {
        console.warn('No images found for color:', color, 'in product:', product.name);
    }

    const selectedSize = size || null;
    const itemPrice = price || product.basePrice;
    
    const cartItem = {
        id: Date.now(), // Unique ID for cart item
        productId: product.id,
        name: product.name,
        image: image,
        color: color || selectedColor.name,
        size: selectedSize,
        quantity: parseInt(quantity) || 1,
        price: itemPrice,
        totalPrice: itemPrice * (parseInt(quantity) || 1)
    };

    cart.push(cartItem);
    saveCart();
    updateCartBadge();
    renderCart();
    openCart(); // Open cart drawer when item is added
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartBadge();
    renderCart();
}

// Update item quantity in cart
function updateCartItemQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity));
        item.totalPrice = item.price * item.quantity;
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart badge count
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        if (totalItems > 0) {
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }
}

// Render cart items
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartItems || !cartEmpty || !cartFooter) return;

    if (cart.length === 0) {
        cartItems.classList.remove('has-items');
        cartEmpty.style.display = 'flex';
        cartFooter.classList.remove('has-items');
        return;
    }

    cartEmpty.style.display = 'none';
    cartItems.classList.add('has-items');
    cartFooter.classList.add('has-items');

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-details">
                    ${item.color}${item.size ? ' • ' + item.size : ''}
                </p>
                <p class="cart-item-price">Rs. ${item.totalPrice.toLocaleString('en-PK')}</p>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <input type="number" class="cart-qty-input" value="${item.quantity}" min="1" 
                               onchange="updateCartItemQuantity(${item.id}, this.value)" 
                               onkeyup="updateCartItemQuantity(${item.id}, this.value)">
                        <button class="cart-qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    document.getElementById('cartSubtotal').textContent = `Rs. ${subtotal.toLocaleString('en-PK')}`;
    document.getElementById('cartTotal').textContent = `Rs. ${subtotal.toLocaleString('en-PK')}`;
}

// Open cart drawer
function openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close cart drawer
function closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Function to handle checkout
function checkout(immediateCheckoutItem = null) {
    // If immediateCheckoutItem is provided, clear the cart and add only this item
    if (immediateCheckoutItem) {
        cart = [immediateCheckoutItem];
        saveCart();
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Function to handle "Buy Now" button click - bypasses cart completely
function handleBuyNow(productId) {
    // Ensure productId is a number
    productId = parseInt(productId);
    
    // Find the product in the products data
    const product = productsData.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const modal = document.getElementById('productModal');
    
    // Get selected color and size
    let color = 'Default';
    let size = 'One Size';
    
    // Try to get selected color from modal
    const selectedColor = modal ? modal.querySelector('.color-circle.selected') : null;
    if (selectedColor) {
        color = selectedColor.getAttribute('data-color-name') || selectedColor.getAttribute('title') || 'Default';
    } else if (product.colors && product.colors.length > 0) {
        // Default to first available color if none selected
        const availableColor = product.colors.find(c => c.available !== false) || product.colors[0];
        if (availableColor) {
            color = availableColor.name || 'Default';
        }
    }
    
    // Try to get selected size from modal
    const selectedSize = modal ? modal.querySelector('.size-option.selected') : null;
    if (selectedSize) {
        size = selectedSize.textContent.trim();
    }
    
    // Get quantity
    const quantityInput = document.getElementById('qtyInput');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    // Prepare product data for direct checkout
    const productData = {
        id: product.id,
        name: encodeURIComponent(product.name),
        price: product.price,
        quantity: quantity,
        color: encodeURIComponent(color),
        size: encodeURIComponent(size),
        image: product.images && product.images.length > 0 ? product.images[0] : 'assets/icons/logo.png'
    };
    
    // Close the modal if it's open
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Proceed to checkout with direct product data
    const queryString = Object.entries(productData)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    
    window.location.href = `checkout.html?direct=true&${queryString}`;
}

// Cart event listeners - Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCart();

    // Add to cart button in modal
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productId = document.getElementById('productModal').getAttribute('data-product-id');
            if (productId) {
                handleAddToCartFromModal(parseInt(productId));
            }
        });
    }
    
    // Buy Now button in modal
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('productModal');
            const productId = modal.getAttribute('data-current-product-id');
            if (productId) {
                handleBuyNowFromModal(parseInt(productId));
            } else {
                console.error('Product ID not found for Buy Now');
                console.log('Modal data attributes:', {
                    'data-current-product-id': modal.getAttribute('data-current-product-id'),
                    'data-product-id': modal.getAttribute('data-product-id'),
                    'all-attributes': Array.from(modal.attributes).map(attr => ({
                        name: attr.name,
                        value: attr.value
                    }))
                });
            }
        });
    }

    // Checkout button in cart drawer
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                checkout();
            } else {
                alert('Your cart is empty. Please add items before checking out.');
            }
        });
    }

    // Cart icon click handler
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            openCart();
        });
    }

    // Close cart button
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }

    // Close cart on overlay click
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Prevent cart drawer from closing when clicking inside it
    const cartDrawer = document.getElementById('cartDrawer');
    if (cartDrawer) {
        cartDrawer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});

// Close cart on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer && cartDrawer.classList.contains('active')) {
            closeCart();
        }
    }
});

// Make functions globally available for inline onclick handlers
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;

// Handle Add to Cart button in product modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn-large')) {
        e.preventDefault();
        e.stopPropagation();
        const modal = document.getElementById('productModal');
        if (modal && modal.style.display === 'block') {
            const storedProductId = modal.getAttribute('data-current-product-id');
            if (storedProductId) {
                handleAddToCartFromModal(storedProductId);
            }
        }
    }
    
});

function handleBuyNowFromModal(productId) {
    const product = productsData.find(p => p.id === parseInt(productId));
    if (!product) return;

    // Get selected color
    const selectedColorCircle = document.querySelector('#modalColors .color-circle.selected');
    if (!selectedColorCircle || selectedColorCircle.classList.contains('out-of-stock')) {
        return; // Silently prevent buying if no color or out of stock
    }
    const selectedColor = selectedColorCircle ? selectedColorCircle.getAttribute('title') : (product.colors[0]?.name || 'Default');
    
    // Get selected size
    const selectedSizeBtn = document.querySelector('.size-btn.active');
    const selectedSize = selectedSizeBtn ? selectedSizeBtn.textContent.trim() : null;
    
    // Get quantity
    const quantityInput = document.getElementById('qtyInput');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    // Get price
    const priceText = document.getElementById('modalPrice').textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, '')) || product.basePrice;

    // Get the selected image (from selected color or first available)
    let selectedImage = 'assets/icons/logo.png';
    if (selectedColorCircle) {
        // Get the image from the selected color circle's data attribute
        selectedImage = selectedColorCircle.getAttribute('data-image') || 
                       (product.images && product.images.length > 0 ? product.images[0] : 'assets/icons/logo.png');
    } else if (product.images && product.images.length > 0) {
        selectedImage = product.images[0];
    }

    // Prepare product data for direct checkout
    const productData = {
        id: product.id,
        name: encodeURIComponent(product.name),
        price: price,
        quantity: quantity,
        color: encodeURIComponent(selectedColor),
        size: encodeURIComponent(selectedSize || 'One Size'),
        image: selectedImage
    };
    
    // Close the modal if it's open
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Proceed to checkout with direct product data
    const queryString = Object.entries(productData)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    
    window.location.href = `checkout.html?direct=true&${queryString}`;
}

function handleAddToCartFromModal(productId) {
    const product = productsData.find(p => p.id === parseInt(productId));
    if (!product) return;

    // Get selected color
    const selectedColorCircle = document.querySelector('#modalColors .color-circle.selected');
    if (!selectedColorCircle || selectedColorCircle.classList.contains('out-of-stock')) {
        return; // Silently prevent adding to cart if no color or out of stock
    }
    
    const selectedColor = selectedColorCircle ? selectedColorCircle.getAttribute('title') : (product.colors[0]?.name || 'Default');
    
    // Get selected size
    const selectedSizeBtn = document.querySelector('.size-btn.active');
    const selectedSize = selectedSizeBtn ? selectedSizeBtn.textContent.trim() : null;
    
    // Get quantity
    const quantityInput = document.getElementById('qtyInput');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    // Get price
    const priceText = document.getElementById('modalPrice').textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, '')) || product.basePrice;

    addToCart(productId, selectedColor, selectedSize, quantity, price);
}

// Function to update nav link active states
function updateNavLinkStates(brandFilter, categoryFilter) {
    // Remove active class from all nav links
    document.querySelectorAll('.navlinks a, .nav-dropdown').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to the selected filter
    if (brandFilter) {
        const brandLink = document.querySelector(`.nav-dropdown[data-filter="brand"][data-value="${brandFilter}"]`);
        if (brandLink) {
            brandLink.classList.add('active');
            // Also highlight the parent "Shop by Brands" link
            const shopByBrands = document.querySelector('.nav-dropdown-toggle[data-target="brands"]');
            if (shopByBrands) {
                shopByBrands.classList.add('active');
            }
        }
    } else if (categoryFilter) {
        const categoryLink = document.querySelector(`.nav-dropdown[data-filter="category"][data-value="${categoryFilter}"]`);
        if (categoryLink) {
            categoryLink.classList.add('active');
            // Also highlight the parent "Shop by Category" link
            const shopByCategory = document.querySelector('.nav-dropdown-toggle[data-target="categories"]');
            if (shopByCategory) {
                shopByCategory.classList.add('active');
            }
        }
    }
}

// === URL PARAMETER FILTER LOGIC ===
// This code runs when the page loads to check if a filter was sent from store.html
const handleUrlFilters = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const brandParam = urlParams.get('brand');
        const categoryParam = urlParams.get('category');

        if (brandParam || categoryParam) {
            // We use a small timeout to make sure productdata.js has finished loading the products
            setTimeout(() => {
                if (typeof renderProducts === 'function') {
                    // 1. Filter the products
                    renderProducts(brandParam, categoryParam, null).catch(err => console.error('Error rendering products:', err));
                    
                    // 2. Update the active styling on the nav links
                    updateNavLinkStates(brandParam, categoryParam);
                    
                    // 3. Automatically scroll down to the products (skipping the hero section)
                    const productsSection = document.getElementById('products');
                    if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 300); // 300ms delay for stability
        }
    };

    // Run the check
    handleUrlFilters();