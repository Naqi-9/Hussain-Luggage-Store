// Product Data Structure - Easy to manage for developer options
// This structure allows easy addition, removal, and editing of products

const productsData = [
  {
    id: 1,
    name: "Airway Princeton",
    basePrice: 36000,
    colors: [
      { name: "Aqua Green", code: "#00CED1", available: true },
      { name: "Black", code: "#000000", available: true },
      { name: "Cherry Pink", code: "#DE3163", available: true },
      { name: "Midnight Blue", code: "#191970", available: true },
      { name: "Taupe Grey", code: "#8B8589", available: true }
    ]
  },
  {
    id: 2,
    name: "American Tourister Bagpack",
    basePrice: 7000,
    brand: "American Tourister",
    colors: [
      { name: "Default", code: "#333333", available: true }
    ]
  },
  {
    id: 3,
    name: "American Tourister Deep Dive",
    basePrice: 48000,
    brand: "American Tourister",
    category: "Hard Sided",
    colors: [
      { name: "Red", code: "#DC143C", available: true , image: "assets/product images/American Tourister/Deep Dive Red.webp"},
      { name: "Blue", code: "#0000FF", available: true, image: "assets/product images/American Tourister/Deep Dive Blue.webp" },
      { name: "Navy Blue", code: "#000080", available: false }
    ]
  },
  {
    id: 4,
    name: "American Tourister Marina",
    basePrice: 50000,
    brand: "American Tourister",
    category: "Hard Sided",
    colors: [
      { name: "Red", code: "#DC143C", available: true, image: "assets/product images/American Tourister/Marina Red.jpg" },
    ]
  },
  {
    id: 5,
    name: "American Tourister Duncan Plus",
    basePrice: 47000,
    brand: "American Tourister",
    colors: [
      { name: "Black", code: "#000000", available: true, image: "assets/product images/American Tourister/Duncan Plus Black.jpg" },
      { name: "Blue", code: "#0000FF", available: true, image: "assets/product images/American Tourister/Duncan Plus Blue.jpg"},
    ]
  },
  {
    id: 6,
    name: "American Tourister Pulsonic",
    basePrice: 53000,
    brand: "American Tourister",
    colors: [
      { name: "Black", code: "#000000", available: true, image: "assets/product images/American Tourister/Pulsonic Black.jpg" },
      { name: "Blue", code: "#0000FF", available: true, image: "assets/product images/American Tourister/Pulsonic Blue.webp"},
      { name: "Purple", code: "#800080", available: true, image: "assets/product images/American Tourister/Pulsonic Purple.webp"},
    ]
  },
  {
    id: 7,
    name: "American Tourister Skycove",
    basePrice: 0,
    brand: "American Tourister",
    colors: [
      { name: "Silver", code: "#C0C0C0", available: false }
    ]
  },
  {
    id: 8,
    name: "Berg Germany",
    basePrice: 58000,
    colors: [
      { name: "Black", code: "#000000", available: true, image: "assets/product images/Berg Germany/Black.webp" },
      { name: "Brown", code: "#8B4513", available: true },
      { name: "Grey", code: "#808080", available: true, image: "assets/product images/Berg Germany/Grey.webp" },
      { name: "Navy", code: "#000080", available: true, image: "assets/product images/Berg Germany/Navy.webp" },
      { name: "Purplish Red", code: "#8B008B", available: true, image: "assets/product images/Berg Germany/Purplish Red.webp" }
    ]
  },
  {
    id: 9,
    name: "Cat Backpack",
    basePrice: 2950,
    category: "Backpack",
    colors: [
      { name: "Default", code: "#333333", available: true }
    ]
  },
  {
    id: 10,
    name: "Cat Original Backpack",
    basePrice: 9500,
    colors: [
      { name: "Default", code: "#333333", available: true }
    ]
  },
  {
    id: 11,
    name: "Delsey AA",
    basePrice: 65000,
    brand: "Delsey",
    category: "Hard Sided",
    colors: [
      { name: "Black", code: "#000000", available: true, image: "assets/product images/Delsey/AA Black.jpg" },
      { name: "Dark Blue", code: "#00008B", available: true, image: "assets/product images/Delsey/AA Dark Blue.jpg" },
      { name: "Dark Green", code: "#006400", available: true, image: "assets/product images/Delsey/AA Dark Green.jpg" },
      { name: "Purple", code: "#800080", available: true, image: "assets/product images/Delsey/AA Purple.jpg" }
    ]
  },
  {
    id: 12,
    name: "Delsey Caracus",
    basePrice: 48000,
    brand: "Delsey",
    colors: [
      { name: "Black", code: "#000000", available: true, image: "assets/product images/Delsey/Caracus Black.webp" },
    ]
  },
  {
    id: 13,
    name: "Delsey Cuzco",
    basePrice: 48000,
    brand: "Delsey",
    category: "Hard Sided",
    colors: [
      { name: "Red", code: "#DC143C", available: true, image: "assets/product images/Delsey/Cuzco Red.jpg" },
      { name: "Lavender", code: "#E6E6FA", available: true, image: "assets/product images/Delsey/Cuzco Lavender.webp" }
    ]
  },
  {
    id: 14,
    name: "Delsey Shadow",
    basePrice: 75000,
    brand: "Delsey",
    category: "Hard Sided",
    colors: [
      { name: "Black", code: "#000000", available: true, image: "assets/product images/Delsey/Shadow Black.jpg" },
      { name: "Blue", code: "#0000FF", available: true, image: "assets/product images/Delsey/Shadow Blue.jpg" },
      { name: "Dark Green", code: "#006400", available: true, image: "assets/product images/Delsey/Shadow Dark Green.jpg" },
      { name: "Silver", code: "#C0C0C0", available: true, image: "assets/product images/Delsey/Shadow Silver.jpg" }
    ]
  },
  {
    id: 15,
    name: "DKNY 626 Deco",
    basePrice: 90000,
    brand: "DKNY",
    category: "Hard Sided",
    colors: [
      { name: "Green", code: "#008000", available: true },
      { name: "Purple", code: "#800080", available: true }
    ]
  },
  {
    id: 16,
    name: "Dockers",
    basePrice: 28000,
    colors: [
      { name: "Maroon", code: "#800000", available: true }
    ]
  },
  {
    id: 17,
    name: "Flieger",
    basePrice: 40000,
    colors: [
      { name: "Black", code: "#000000", available: true },
      { name: "Navy Blue", code: "#000080", available: true },
      { name: "White", code: "#FFFFFF", available: true }
    ]
  },
  {
    id: 18,
    name: "iFLY Fibertech",
    basePrice: 35000,
    brand: "iFLY",
    colors: [
      { name: "Black", code: "#000000", available: true, image: "assets/product images/iFLY/FiberTech Black.webp" },
      { name: "Cotton Candy", code: "#FFB6C1", available: true, image: "assets/product images/iFLY/FiberTech Cotton Candy.webp" },
      { name: "Two Tone Blue", code: "#4169E1", available: true, image: "assets/product images/iFLY/FiberTech TwoTone Blue.webp" },
      { name: "Midnight Berry Purple", code: "#4B0082", available: true, image: "assets/product images/iFLY/FiberTech Midnight Berry Purple.webp" }
    ]
  },
  {
    id: 19,
    name: "IT 14/2916",
    basePrice: 65000,
    brand: "IT",
    colors: [
      { name: "Green", code: "#008000", available: true, image: "assets/product images/IT/14 Green.webp" },
    ]
  },
  {
    id: 20,
    name: "IT 17/2651",
    basePrice: 65000,
    brand: "IT",
    colors: [
      { name: "Black", code: "#000000", available: true, },
      { name: "Green", code: "#008000", available: true },
      { name: "Grey", code: "#808080", available: true }
    ]
  },

  {
    id: 21,
    name: "IT 21/2884",
    basePrice: 68000,
    brand: "IT",
    colors: [
      { name: "Brown", code: "#8B4513", available: true, image: "assets/product images/IT/21 Brown.webp" },
      { name: "O White", code: "#F4F0E0", available: true, image: "assets/product images/IT/21 White.webp" },
      { name: "Pink", code: "#FFC0CB", available: true, image: "assets/product images/IT/21 Pink.webp" }
    ]
  },
  {
    id: 22,
    name: "IT 52/3039",
    basePrice: 85000,
    brand: "IT",
    colors: [
      { name: "Owhite", code: "#F4F0E0", available: true, image: "assets/product images/IT/52 Owhite.webp" },
    ]
  },
  {
    id: 23,
    name: "IT 73/2881 Spontaneous",
    basePrice: 60000,
    brand: "IT",
    colors: [
      { name: "Blue", code: "#0000FF", available: true, image: "assets/product images/IT/73 Blue Spontaneous.webp" },
      { name: "Green", code: "#008000", available: true, image: "assets/product images/IT/73 Green Spontaneous.webp" },
      { name: "Pink", code: "#FFC0CB", available: true, image: "assets/product images/IT/73 Pink Spontaneous.webp" }
    ]
  },
  {
    id: 25,
    name: "IT Fashionista Advant",
    basePrice: 60000,
    brand: "IT",
    colors: [
      { name: "Charcoal", code: "#36454F", available: true }
    ]
  },
  {
    id: 26,
    name: "IT Fashionista Black Impakt",
    basePrice: 60000,
    brand: "IT",
    colors: [
      { name: "Black", code: "#000000", available: true }
    ]
  },
  {
    id: 27,
    name: "Jeep",
    basePrice: 42000,
    colors: [
      { name: "Grey Polygon", code: "#808080", available: true },
      { name: "Silver 4x4", code: "#C0C0C0", available: true },
      { name: "Yellow Polygon", code: "#FFD700", available: true }
    ]
  },
  {
    id: 28,
    name: "POLO US",
    basePrice: 40000,
    colors: [
      { name: "Blue", code: "#0000FF", available: true },
      { name: "Coffee", code: "#6F4E37", available: true },
      { name: "Green", code: "#008000", available: true }
    ]
  },
  {
    id: 29,
    name: "Pierre Cardin",
    basePrice: 80000,
    colors: [
      { name: "Black", code: "#000000", available: true },
      { name: "SG", code: "#708090", available: true },
      { name: "White", code: "#FFFFFF", available: true }
    ]
  },
  {
    id: 30,
    name: "Samsnite Soft",
    basePrice: 50000,
    brand: "Samsonite",
    colors: [
      { name: "Black", code: "#000000", available: true }
    ]
  },
  {
    id: 31,
    name: "Smile",
    basePrice: 48000,
    colors: [
      { name: "Black", code: "#000000", available: true }
    ]
  },
  {
    id: 32,
    name: "SwissGear",
    basePrice: 40000,
    brand: "Swiss Gear",
    colors: [
      { name: "Black", code: "#000000", available: true },
      { name: "Green", code: "#008000", available: true },
      { name: "Grey", code: "#808080", available: true }
    ]
  },
  {
    id: 33,
    name: "Timberland",
    basePrice: 26000,
    brand: "Timberland",
    category: "Duffle Bags",
    colors: [
      { name: "Black", code: "#000000", available: true },
      { name: "Grey Black", code: "#2F2F2F", available: true }
    ]
  },
  {
    id: 34,
    name: "Tommy L",
    basePrice: 60000,
    brand: "Tommy",
    colors: [
      { name: "Green", code: "#008000", available: true },
      { name: "Grey", code: "#808080", available: true },
      { name: "Red", code: "#DC143C", available: true }
    ]
  },
  {
    id: 35,
    name: "Tommy M",
    basePrice: 75000,
    brand: "Tommy",
    colors: [
      { name: "Black", code: "#000000", available: true },
      { name: "Red", code: "#DC143C", available: true },
      { name: "White", code: "#FFFFFF", available: true }
    ]
  },
  {
    id: 36,
    name: "Travel Choice",
    basePrice: 38000,
    colors: [
      { name: "Pink", code: "#FFC0CB", available: true }
    ]
  },
  {
    id: 37,
    name: "Travel Club",
    basePrice: 48000,
    colors: [
      { name: "Golden Brown", code: "#CD853F", available: true },
      { name: "Metal Grey", code: "#708090", available: true },
      { name: "Mint Green", code: "#98FB98", available: true },
      { name: "Navy Blue", code: "#000080", available: true }
    ]
  },
  {
    id: 38,
    name: "Traveler's Choice",
    basePrice: 60000,
    brand: null,
    category: "Hard Sided",
    colors: [
      { name: "Black", code: "#000000", available: true }
    ]
  },
  {
    id: 39,
    name: "VIP Redeemer",
    basePrice: 35000,
    brand: "VIP",
    colors: [
      { name: "Maroon", code: "#800000", available: true },
      { name: "Olive Green", code: "#556B2F", available: true },
      { name: "Red", code: "#DC143C", available: true }
    ]
  },
  {
    id: 40,
    name: "Wilson Fashion",
    basePrice: 48000,
    colors: [
      { name: "Black", code: "#000000", available: true }
    ]
  }
];

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
function renderProducts(filterBrand = null, filterCategory = null, searchQuery = null) {
  const productsGrid = document.getElementById('productsGrid');
  const productsSection = document.querySelector('.products-section .container');
  if (!productsGrid) return;
  
  // Update global filter state
  currentFilterBrand = filterBrand;
  currentFilterCategory = filterCategory;
  currentSearchQuery = searchQuery;
  
  // Remove existing filter header if any
  const existingHeader = document.getElementById('filterHeader');
  if (existingHeader) {
    existingHeader.remove();
  }
  
  // Filter products
  let filteredProducts = productsData;
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
  } else if (filterCategory) {
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
    titleElement.textContent = filterTitle;
    
    const seeAllBtn = document.createElement('button');
    seeAllBtn.id = 'seeAllProductsBtn';
    seeAllBtn.textContent = 'See All Products';
    seeAllBtn.style.cssText = 'background-color: #000; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; font-family: "Poppins", sans-serif; text-transform: uppercase; letter-spacing: 0.8px;';
    seeAllBtn.onmouseover = function() { this.style.backgroundColor = '#333'; this.style.transform = 'translateY(-2px)'; };
    seeAllBtn.onmouseout = function() { this.style.backgroundColor = '#000'; this.style.transform = 'translateY(0)'; };
    
    filterHeader.appendChild(titleElement);
    filterHeader.appendChild(seeAllBtn);
    
    // Insert before products grid
    productsGrid.parentNode.insertBefore(filterHeader, productsGrid);
    
    // Add click handler for See All Products button
    seeAllBtn.addEventListener('click', () => {
      if (typeof renderProducts === 'function') {
        renderProducts(null, null, null);
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

        // 1. THIS IS NEW: Find the first available color so we know which image to show first
    const firstAvailableColor = product.colors.find(c => c.available) || product.colors[0];
    
    // Get the lowest available price or show basePrice
    const availableColors = product.colors.filter(c => c.available);
    const price = product.basePrice > 0 ? product.basePrice : (availableColors.length > 0 ? availableColors[0].price || product.basePrice : 0);
    
    // Find first available color to select by default
    const firstAvailableIndex = product.colors.findIndex(c => c.available);
    
    productCard.innerHTML = `
      <div class="product-image">

       <!-- 2. THIS IS NEW: We add an <img> tag here. It uses the image path from the first color -->
        <img src="${firstAvailableColor.image || ''}" alt="${product.name}" class="main-product-img">
        
        <div class="product-overlay">
          <button class="quick-view-btn">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">Rs. ${price.toLocaleString('en-PK')}</span>
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
                  /* 3. THIS IS NEW: We store the image path inside the circle so JS can find it later */
                  data-color-image="${color.image || ''}"
                >
                  ${!color.available ? '<span class="diagonal-line"></span>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <button class="add-to-cart-btn" ${price === 0 ? 'disabled' : ''}>Add to Cart</button>
      </div>
    `;
    
    productsGrid.appendChild(productCard);
  });
}

// Initialize products on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProducts);
} else {
  renderProducts();
}

