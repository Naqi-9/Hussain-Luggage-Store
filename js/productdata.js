
// This structure allows easy addition, removal, and editing of products
//
// IMAGE SUPPORT:
// - Single image per color: Use "image": "path/to/image.jpg"
// - Multiple images per color (1-5 images): Use "images": ["path1.jpg", "path2.jpg", "path3.jpg"]
// - The system supports both formats and will automatically handle them
// - When multiple images are provided, an image slider will appear with navigation arrows
//
// Example with multiple images:
// colors: [
//   { name: "Red", code: "#DC143C", available: true, images: ["img1.jpg", "img2.jpg", "img3.jpg"] },
//   { name: "Blue", code: "#0000FF", available: true, image: "img.jpg" } // Single image still works
// ]


// Helper function to extract brand from product name
function getBrandFromName(name) {
  const brandPatterns = {
    'American Tourister': /American Tourister/i,
    'Delsey': /Delsey/i,
    'iFLY': /iFLY/i,
    'IT': /^IT\s/i,
    'Samsonite': /Samsonite|Samsnite/i,
    'Swiss Gear': /SwissGear|Swiss Gear/i,
    'Tommy': /Tommy/i,
    'VIP': /VIP/i,
    'DKNY': /DKNY/i,
    'Timberland': /Timberland/i
  };
  
  for (const [brand, pattern] of Object.entries(brandPatterns)) {
    if (pattern.test(name)) {
      return brand;
    }
  }
  return null;
}

// Helper function to get category
function getCategory(name, brand) {
  // Hard Sided products (exact matches)
  const hardSidedProducts = [
    'Traveler\'s Choice',
    'DKNY 626',
    'Delsey Cuzco',
    'American Tourister Marina',
    'American Tourister Deep Dive',
    'Delsey AA',
    'Delsey Shadow'
  ];
  
  // Duffle Bags
  const duffleBags = ['Timberland'];
  
  // Check for Hard Sided
  for (const product of hardSidedProducts) {
    if (name.includes(product.split(' ')[0]) || name.includes(product)) {
      return 'Hard Sided';
    }
  }
  
  // Check for Duffle Bags
  if (duffleBags.some(p => name.includes(p))) {
    return 'Duffle Bags';
  }
  
  // Default: null (not categorized)
  return null;
}

// Add brand and category to products (only if not already set)
productsData.forEach(product => {
  if (!product.brand) {
    product.brand = getBrandFromName(product.name);
  }
  if (!product.category) {
    product.category = getCategory(product.name, product.brand);
  }
});

// Global filter state
let currentFilterBrand = null;
let currentFilterCategory = null;
let currentSearchQuery = null;

// Function to render products with optional filters
async function renderProducts(filterBrand = null, filterCategory = null, searchQuery = null) {
  const productsGrid = document.getElementById('productsGrid');
  const productsSection = document.querySelector('.products-section .container');
  if (!productsGrid) return;
  
  // Update global filter state
  currentFilterBrand = filterBrand;
  currentFilterCategory = filterCategory;
  currentSearchQuery = searchQuery;
  
  // Remove filter header if it exists
  const existingFilterHeader = document.getElementById('filterHeader');
  if (existingFilterHeader) {
    existingFilterHeader.remove();
  }
  
  // Filter products - get from API if available, otherwise use static data
  let filteredProducts = productsData;
  
  // If productsData is empty, try to get from API
  if (filteredProducts.length === 0 && window.getProducts) {
    try {
      const apiProducts = await window.getProducts();
      if (apiProducts && apiProducts.length > 0) {
        filteredProducts = apiProducts;
        productsData = apiProducts; // Cache for next time
      }
    } catch (e) {
      console.error('Error fetching products:', e);
      // Show error message
      productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e74c3c;">Error loading products. Please check your Supabase configuration.</div>';
      return;
    }
  }
  
  // If still no products, show message
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">No products available.</div>';
    // Try to refresh
    if (window.refreshProducts) {
      try {
        await window.refreshProducts();
        filteredProducts = productsData;
        if (filteredProducts.length === 0) {
          productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">No products available.</div>';
          return;
        }
      } catch (e) {
        console.error('Error refreshing products:', e);
        productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e74c3c;">Error loading products.</div>';
        return;
      }
    } else {
      productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">No products available.</div>';
      return;
    }
  }
  let filterTitle = '';
  
  if (searchQuery && searchQuery.trim() !== '') {
    const searchTerm = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm)
    );
    if (filteredProducts.length === 0) {
      filterTitle = 'No items found';
    } else {
      filterTitle = `Search Results: ${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'} found`;
    }
  } else if (filterBrand) {
    filteredProducts = filteredProducts.filter(p => p.brand === filterBrand);
    filterTitle = `${filterBrand} Bags:`;
    
    // No filter header for brand filter
  } else if (filterCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
    filterTitle = `${filterCategory}:`;
    
    // No filter header for category filter
    filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
    filterTitle = `${filterCategory} Bags:`;
  }
  
  // Hide/show default section title based on filter
  const sectionTitle = document.querySelector('.section-title');
  const sectionSubtitle = document.querySelector('.section-subtitle');
  
  if (filterBrand || filterCategory || (searchQuery && searchQuery.trim() !== '')) {
    // Hide default title and subtitle when filter is active
    if (sectionTitle) sectionTitle.style.display = 'none';
    if (sectionSubtitle) sectionSubtitle.style.display = 'none';
    
    const filterHeader = document.createElement('div');
    filterHeader.id = 'filterHeader';
    filterHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;';
    
    const titleElement = document.createElement('h2');
    titleElement.style.cssText = 'font-size: 2rem; font-weight: 700; color: #000; margin: 0; font-family: "Lato", sans-serif;';
    titleElement.textContent = filterTitle || 'Featured Products';
    
    const seeAllBtn = document.createElement('button');
    seeAllBtn.id = 'seeAllProductsBtn';
    seeAllBtn.textContent = 'See All Products';
    seeAllBtn.style.cssText = 'background-color: #000; color: white; border: none; padding: 17px 24px; border-radius: 30px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; font-family: "Poppins", sans-serif; letter-spacing: 0.8px;';
    seeAllBtn.onmouseover = function() { this.style.backgroundColor = '#333'; this.style.transform = 'translateY(-2px)'; };
    seeAllBtn.onmouseout = function() { this.style.backgroundColor = '#000'; this.style.transform = 'translateY(0)'; };
    
    filterHeader.appendChild(titleElement);
    filterHeader.appendChild(seeAllBtn);
    
    // Insert before products grid
    productsGrid.parentNode.insertBefore(filterHeader, productsGrid);
    
    // Add click handler for See All Products button
    seeAllBtn.addEventListener('click', () => {
      if (typeof renderProducts === 'function') {
        renderProducts(null, null, null).catch(err => console.error('Error rendering products:', err));
      }
      // Clear search input if exists
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      // Trigger custom event to update nav links (handled in script.js)
      window.dispatchEvent(new CustomEvent('updateNavLinks', { detail: { brand: null, category: null } }));
    });
  } else {
    // Show default title and subtitle when no filter
    if (sectionTitle) sectionTitle.style.display = '';
    if (sectionSubtitle) sectionSubtitle.style.display = '';
  }
  
  productsGrid.innerHTML = '';
  
  // If no products match, show message
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">No products found matching your selection.</div>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-product-id', product.id);

        // Find the first available color to use for the main image
        const firstAvailableColor = product.colors.find(c => c.available) || product.colors[0];
        const firstAvailableIndex = product.colors.findIndex(c => c.available);
        
        // Get the lowest available price or show basePrice
        const availableColors = product.colors.filter(c => c.available);
        const price = product.basePrice > 0 ? product.basePrice : (availableColors.length > 0 ? availableColors[0].price || product.basePrice : 0);
        
        // Get the first available image for the product card
        const firstImage = getColorImages(firstAvailableColor)[0] || '';
    
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${firstImage}" alt="${product.name}" class="main-product-img">
        <!-- THE OLD OVERLAY DIV WAS REMOVED FROM HERE -->
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">From Rs. ${price.toLocaleString('en-PK')}</span>
        </div>
        <div class="color-selector">
          <span class="color-label">Colors:</span>
          <div class="color-options">
            ${product.colors.map((color, index) => `
              <div class="color-circle-wrapper" data-color-index="${index}">
                <div 
                  class="color-circle ${color.available ? '' : 'out-of-stock'} ${index === firstAvailableIndex ? 'selected' : ''}" 
                  style="background-color: ${color.code};"
                  title="${color.name} ${color.available ? '' : '(Out of Stock)'}"
                  data-color-name="${color.name}"
                  data-product-id="${product.id}"
                >
                  ${!color.available ? '<span class="diagonal-line"></span>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <!-- CHANGED: Button text is now "QUICK VIEW" instead of "Add to Cart" -->
        <button class="quick-view-btn" ${price === 0 ? 'disabled' : ''}>Quick View</button>
      </div>
    `;

    
    productsGrid.appendChild(productCard);
  });
}

// Initialize products on page load - NOW FETCHES FROM SUPABASE
async function initializeProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) {
    // No products grid on this page, exit silently
    return;
  }
  
  console.log('Initializing products...');
  
  // Show loading state
  productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">Loading products...</div>';
  
  try {
    // Check if API service is loaded
    if (!window.getProducts || typeof window.getProducts !== 'function') {
      console.error('API service not loaded! Make sure api-service.js is loaded before productdata.js');
      productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e74c3c;">API service not loaded. Check script order in HTML.</div>';
      return;
    }
    
    // Fetch products from Supabase API
    console.log('Calling window.getProducts()...');
    const products = await window.getProducts();
    console.log('Products received:', products);
    console.log('Number of products:', products ? products.length : 0);
    
    if (products && products.length > 0) {
      // Update global productsData reference
      productsData = products;
      console.log('Setting productsData to:', productsData.length, 'items');
      // Render products
      await renderProducts(null, null, null);
      console.log('Products rendered successfully');
    } else {
      // No products found
      console.warn('No products found');
      productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">No products available.</div>';
    }
  } catch (error) {
    console.error('Error initializing products:', error);
    console.error('Full error:', error);
    productsGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e74c3c;">
      Error loading products. Check browser console for details.<br>
      <small>Error: ${error.message}</small>
    </div>`;
  }
}

// Filter products by brand
window.filterProductsByBrand = function(brandName) {
  renderProducts(brandName, null, null);
};

// Filter products by category
window.filterProductsByCategory = function(categoryName) {
  renderProducts(null, categoryName, null);
};

// Show all products (clear filters)
window.getAllProducts = function() {
  renderProducts(null, null, null);
};

// Handle URL parameters on page load
function handleInitialFilters() {
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand');
  const category = params.get('category');
  
  if (brand) {
    window.filterProductsByBrand(brand);
  } else if (category) {
    window.filterProductsByCategory(category);
  } else {
    window.getAllProducts();
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeProducts().then(() => {
      handleInitialFilters();
    });
  });
} else {
  // In case the document is already loaded
  initializeProducts().then(() => {
    handleInitialFilters();
  });
}
