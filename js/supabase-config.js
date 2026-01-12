// Supabase Configuration
// Replace these values with your Supabase project credentials
// Get them from: https://app.supabase.com -> Your Project -> Settings -> API

const SUPABASE_CONFIG = {
  url: 'https://vbdcamffptexwssjcsfh.supabase.co', // e.g., 'https://xxxxx.supabase.co'
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZGNhbWZmcHRleHdzc2pjc2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODI4MDEsImV4cCI6MjA4MjE1ODgwMX0.YAFityTLYKj3fUtf6bqOWJXmMGM35Ke4Xcc0GqNF_u0' // Public anon key (safe to expose in frontend)
};

// Supabase Client (we'll use fetch API, no need for Supabase JS library)
function getSupabaseClient() {
  return {
    url: SUPABASE_CONFIG.url,
    headers: {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };
}

// Helper function to fetch from Supabase
async function fetchFromSupabase(table, select = '*', filters = {}, orderBy = null) {
  const client = getSupabaseClient();
  let url = `${client.url}/rest/v1/${table}?select=${select}`;
  
  // Add filters if provided
  if (Object.keys(filters).length > 0) {
    const filterParams = Object.entries(filters)
      .filter(([key]) => key !== 'orderBy') // Skip orderBy in filters
      .map(([key, value]) => `${key}=eq.${encodeURIComponent(value)}`)
      .join('&');
    if (filterParams) {
      url += `&${filterParams}`;
    }
  }
  
  // Add ordering if specified
  if (orderBy) {
    url += `&order=${encodeURIComponent(orderBy)}`;
  } else if (filters.orderBy) {
    // For backward compatibility, check filters.orderBy
    url += `&order=${encodeURIComponent(filters.orderBy)}`;
  }
  
  console.log('Fetching from Supabase:', {
    url: url,
    table: table,
    headers: { ...client.headers, 'apikey': '***hidden***', 'Authorization': 'Bearer ***hidden***' }
  });
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: client.headers
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    console.error('Error details:', {
      message: error.message,
      url: url,
      table: table
    });
    throw error;
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.fetchFromSupabase = fetchFromSupabase;
}

