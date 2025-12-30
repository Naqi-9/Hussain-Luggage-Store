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
    if (Array.isArray(color.images)) {
        return color.images;
    } else if (color.image) {
        return [color.image];
    } else if (color.images && typeof color.images === 'string') {
        return [color.images];
    }
    return [];
}

// Helper function to update modal thumbnails
function updateModalThumbnails(images, colorName) {
    const modalThumbnails = document.getElementById('modalThumbnails');
    if (!modalThumbnails) return;
    
    modalThumbnails.innerHTML = images.map((imgSrc, index) => `
        <img src="${imgSrc}" 
             class="thumb-img ${index === 0 ? 'active' : ''}" 
             alt="thumbnail" 
             data-image-index="${index}"
             onclick="updateMainImageDisplay(${index})">
    `).join('');
    
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

    const modal = document.getElementById('productModal');
    
    // Fill Text Data
    document.getElementById('modalName').textContent = product.name;
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
    const product = productsDaSSta.find(p => p.id === parseInt(productId));
    if (!product) return;

    const selectedColor = product.colors.find(c => c.name === color) || product.colors[0];
    const selectedSize = size || null;
    const itemPrice = price || product.basePrice;
    
    const cartItem = {
        id: Date.now(), // Unique ID for cart item
        productId: product.id,
        name: product.name,
        image: selectedColor.image,
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

// Cart event listeners - Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCart();

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

function handleAddToCartFromModal(productId) {
    const product = productsData.find(p => p.id === parseInt(productId));
    if (!product) return;

    // Get selected color
    const selectedColorCircle = document.querySelector('#modalColors .color-circle.selected');
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