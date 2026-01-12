// API Service - Fetches products from Supabase
// This replaces productdata.js with database-backed data

let productsData = []; // Global products cache
let isLoading = false;
let loadError = null;

// Transform Supabase product data to match our app's format
function transformProductData(dbProduct) {
  console.log('Transforming product:', dbProduct);
  
  // Parse colors JSON if it's a string, otherwise use as-is
  let colors = [];
  try {
    if (typeof dbProduct.colors === 'string') {
      colors = JSON.parse(dbProduct.colors);
    } else if (dbProduct.colors) {
      colors = dbProduct.colors;
    } else {
      colors = [];
    }
    console.log('Parsed colors:', colors);
  } catch (e) {
    console.error('Error parsing colors:', e, 'Raw colors value:', dbProduct.colors);
    colors = [];
  }
  
  // Parse sizes JSON if it exists
  let sizes = [];
  if (dbProduct.sizes) {
    try {
      if (typeof dbProduct.sizes === 'string') {
        sizes = JSON.parse(dbProduct.sizes);
      } else {
        sizes = dbProduct.sizes;
      }
    } catch (e) {
      console.error('Error parsing sizes:', e);
    }
  }
  
  const transformed = {
    id: dbProduct.id,
    name: dbProduct.name,
    basePrice: dbProduct.base_price || dbProduct.basePrice || 0,
    brand: dbProduct.brand || null,
    category: dbProduct.category || null,
    description: dbProduct.description || null,
    colors: colors,
    sizes: sizes || null
  };
  
  console.log('Transformed product result:', transformed);
  return transformed;
}

// Fetch all products from Supabase
async function fetchProducts() {
  if (isLoading) {
    console.log('Already loading products, returning cached data...');
    return productsData; // Return cached data if already loading
  }
  
  // Return cached data if available
  if (productsData.length > 0) {
    console.log(`Returning cached products: ${productsData.length} items`);
    return productsData;
  }
  
  isLoading = true;
  loadError = null;
  
  try {
    // Check if Supabase is configured
    if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url || window.SUPABASE_CONFIG.url.includes('YOUR_SUPABASE_URL')) {
      console.warn('Supabase not configured. Using fallback data.');
      // Return empty array - will show loading/error state
      isLoading = false;
      return [];
    }
    
    console.log('Fetching products from Supabase...', window.SUPABASE_CONFIG.url);
    
    // Fetch products from Supabase, ordered by display_order (ascending)
    // If display_order is null, those items will appear last
    const data = await window.fetchFromSupabase('products', '*', {}, 'display_order.asc.nullslast');
    
    console.log('Raw data from Supabase:', data);
    console.log(`Fetched ${data ? data.length : 0} products from database`);
    
    if (!data || data.length === 0) {
      console.warn('No products found in database');
      isLoading = false;
      return [];
    }
    
    // Transform and cache products
    productsData = data.map(transformProductData);
    console.log('Transformed products:', productsData);
    
    // Auto-detect brand and category if not set (legacy support)
    productsData.forEach(product => {
      if (!product.brand && typeof getBrandFromName === 'function') {
        product.brand = getBrandFromName(product.name);
      }
      if (!product.category && typeof getCategory === 'function') {
        product.category = getCategory(product.name, product.brand);
      }
    });
    
    console.log(`Successfully loaded ${productsData.length} products`);
    isLoading = false;
    return productsData;
    
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      supabaseConfig: window.SUPABASE_CONFIG
    });
    loadError = error;
    isLoading = false;
    return [];
  }
}

// Get products (with caching)
async function getProducts() {
  if (productsData.length === 0) {
    await fetchProducts();
  }
  return productsData;
}

// Refresh products from database
async function refreshProducts() {
  productsData = []; // Clear cache
  return await fetchProducts();
}

// Get loading state
function getLoadingState() {
  return isLoading;
}

// Get error state
function getErrorState() {
  return loadError;
}

// Export functions
if (typeof window !== 'undefined') {
  window.fetchProducts = fetchProducts;
  window.getProducts = getProducts;
  window.refreshProducts = refreshProducts;
  window.getLoadingState = getLoadingState;
  window.getErrorState = getErrorState;
}
