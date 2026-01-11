// filters.js - Handles dynamic loading of brands and categories from Supabase

// Function to load brands and categories from Supabase
async function loadFilters() {
    try {
        console.log('Starting to load filters...');
        
        // Check if fetchFromSupabase is available
        if (typeof fetchFromSupabase !== 'function') {
            console.error('fetchFromSupabase is not a function');
            return;
        }

        console.log('Fetching brands...');
        const brands = await fetchFromSupabase('brands', 'id, name, slug');
        console.log('Brands data:', brands);
        
        console.log('Fetching categories...');
        const categories = await fetchFromSupabase('categories', 'id, name, slug');
        console.log('Categories data:', categories);
        
        // Update the navigation dropdowns
        updateBrandsDropdown(Array.isArray(brands) ? brands : []);
        updateCategoriesDropdown(Array.isArray(categories) ? categories : []);
        
    } catch (error) {
        console.error('Error in loadFilters:', error);
        // Show error in the UI
        const brandDropdown = document.getElementById('brands-dropdown');
        const categoryDropdown = document.getElementById('categories-dropdown');
        
        if (brandDropdown) {
            brandDropdown.innerHTML = '<div class="dropdown-error">Failed to load brands</div>';
        }
        if (categoryDropdown) {
            categoryDropdown.innerHTML = '<div class="dropdown-error">Failed to load categories</div>';
        }
    }
}

// Update the brands dropdown with data from Supabase
function updateBrandsDropdown(brands) {
    const brandDropdown = document.getElementById('brands-dropdown');
    if (!brandDropdown) {
        console.error('Brands dropdown element not found');
        return;
    }
    
    console.log('Updating brands dropdown with:', brands);
    
    if (!Array.isArray(brands) || brands.length === 0) {
        brandDropdown.innerHTML = '<div class="dropdown-empty">No brands found</div>';
        return;
    }
    
    // Clear existing content
    brandDropdown.innerHTML = '';
    
    // Add each brand as a link
    brands.forEach(brand => {
        const link = document.createElement('a');
        link.href = `index.html?brand=${encodeURIComponent(brand.name)}`;
        link.textContent = brand.name;
        brandDropdown.appendChild(link);
    });
}

// Update the categories dropdown with data from Supabase
function updateCategoriesDropdown(categories) {
    const categoryDropdown = document.getElementById('categories-dropdown');
    if (!categoryDropdown) {
        console.error('Categories dropdown element not found');
        return;
    }
    
    console.log('Updating categories dropdown with:', categories);
    
    if (!Array.isArray(categories) || categories.length === 0) {
        categoryDropdown.innerHTML = '<div class="dropdown-empty">No categories found</div>';
        return;
    }
    
    // Clear existing content
    categoryDropdown.innerHTML = '';
    
    // Add each category as a link
    categories.forEach(category => {
        const link = document.createElement('a');
        link.href = `index.html?category=${encodeURIComponent(category.name)}`;
        link.textContent = category.name;
        categoryDropdown.appendChild(link);
    });
}

// Initialize the filters when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing filters...');
    // Only run on pages that have the filter dropdowns
    if (document.querySelector('.nav-dropdown')) {
        console.log('Nav dropdown found, loading filters...');
        // Add a small delay to ensure all scripts are loaded
        setTimeout(() => {
            loadFilters().catch(err => {
                console.error('Failed to load filters:', err);
            });
        }, 100);
    } else {
        console.log('No nav dropdown found on this page');
    }
});

// Make the loadFilters function available globally
window.loadFilters = loadFilters;
