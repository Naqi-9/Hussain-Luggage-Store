// Migration Script: Export products from productdata.js to Supabase
// Run this in browser console AFTER loading your site with current productdata.js

async function migrateProductsToSupabase() {
  // Check if productsData exists
  if (typeof productsData === 'undefined' || !productsData || productsData.length === 0) {
    console.error('No products found! Make sure productdata.js is loaded first.');
    return;
  }
  
  console.log(`Found ${productsData.length} products to migrate...`);
  
  // Check if Supabase is configured
  if (!window.SUPABASE_CONFIG || window.SUPABASE_CONFIG.url.includes('YOUR_SUPABASE_URL')) {
    console.error('Please configure Supabase in supabase-config.js first!');
    return;
  }
  
  const client = window.SUPABASE_CONFIG;
  const url = `${client.url}/rest/v1/products`;
  const headers = {
    'apikey': client.anonKey,
    'Authorization': `Bearer ${client.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const product of productsData) {
    try {
      // Prepare product data for Supabase
      const supabaseProduct = {
        name: product.name,
        base_price: product.basePrice || 0,
        brand: product.brand || null,
        category: product.category || null,
        description: product.description || null,
        colors: JSON.stringify(product.colors || []),
        sizes: product.sizes ? JSON.stringify(product.sizes) : null
      };
      
      // Insert product
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(supabaseProduct)
      });
      
      if (response.ok) {
        console.log(`✓ Migrated: ${product.name}`);
        successCount++;
      } else {
        const error = await response.text();
        console.error(`✗ Failed: ${product.name}`, error);
        errorCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`✗ Error migrating ${product.name}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n=== Migration Complete ===');
  console.log(`✓ Success: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
  console.log('\nRefresh your page to see products from Supabase!');
}

// Auto-run migration (comment out if you want to run manually)
// migrateProductsToSupabase();

// To run manually, type in console: migrateProductsToSupabase()

