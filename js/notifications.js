// Function to get a random product from the database
async function getRandomProduct() {
    try {
        // Get products from the API service
        const products = await window.getProducts();
        if (!products || products.length === 0) {
            console.error('No products available');
            return null;
        }
        
        // Select a random product
        const randomIndex = Math.floor(Math.random() * products.length);
        const product = products[randomIndex];
        
        // Get the first available image from the first color
        let imageUrl = 'https://via.placeholder.com/60x60?text=No+Image';
        if (product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0) {
            imageUrl = product.colors[0].images[0];
        } else if (product.colors && product.colors.length > 0 && product.colors[0].image) {
            imageUrl = product.colors[0].image;
        }
        
        return {
            name: product.name,
            image: imageUrl
        };
    } catch (error) {
        console.error('Error fetching random product:', error);
        return null;
    }
}

// Function to show the notification
async function showNotification() {
    console.log('Showing notification...');
    const notification = document.getElementById('purchaseNotification');
    if (!notification) {
        console.error('Notification element not found!');
        return;
    }
    
    try {
        // Get a random product
        const product = await getRandomProduct();
        if (!product) {
            console.error('No product available to show');
            return;
        }
        
        console.log('Selected product:', product);
        
        // Update the notification content
        const productImage = document.getElementById('notificationProductImage');
        const productName = document.getElementById('notificationProductName');
        
        if (productImage) {
            console.log('Setting image source:', product.image);
            productImage.src = product.image;
            // Add error handling for image loading
            productImage.onerror = function() {
                console.error('Failed to load image:', product.image);
                // Fallback to a placeholder image if the main image fails to load
                productImage.src = 'https://via.placeholder.com/60x60?text=Product+Image';
            };
        } else {
            console.error('Product image element not found!');
        }
        
        if (productName) {
            productName.textContent = product.name;
        } else {
            console.error('Product name element not found!');
        }
        
        // Show the notification
        console.log('Adding show class to notification');
        notification.classList.add('show');
        
        // Hide the notification after 5 seconds
        setTimeout(() => {
            console.log('Hiding notification');
            notification.classList.remove('show');
        }, 5000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Function to initialize the notification system
function initNotificationSystem() {
    console.log('Initializing notification system...');
    
    const closeButton = document.getElementById('closeNotification');
    const notification = document.getElementById('purchaseNotification');
    
    if (!notification) {
        console.error('Notification container not found in the DOM!');
        return;
    }
    
    // Ensure notification is initially hidden
    notification.style.display = 'none';
    
    // Close button functionality
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            console.log('Close button clicked');
            notification.classList.remove('show');
        });
    } else {
        console.warn('Close button not found!');
    }
    
    // Show first notification after 15 seconds (15000 milliseconds)
    setTimeout(() => {
        console.log('Showing first order notification...');
        showOrderNotifications();
        
        // Then show new order notifications every 30 seconds (30000 milliseconds)
        setInterval(() => {
            console.log('Interval triggered - showing next order notification');
            showOrderNotifications();
        }, 30000);
    }, 15000);
}

// Initialize the notification system when the DOM is loaded
document.addEventListener('DOMContentLoaded', initNotificationSystem);

// Test function to check order count
async function testOrderCount() {
    try {
        // Use the fetchFromSupabase helper with count query
        const response = await fetch(`${window.SUPABASE_CONFIG.url}/rest/v1/orders?select=count`, {
            method: 'GET',
            headers: {
                'apikey': window.SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
            }
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Error counting orders:', error);
            return 'Error counting orders';
        }

        // Get the count from the content-range header
        const count = response.headers.get('content-range')?.split('/')[1] || '0';
        console.log('Total orders in database:', count);
        return `Total orders in database: ${count}`;
    } catch (error) {
        console.error('Error in testOrderCount:', error);
        return 'Error: ' + error.message;
    }
}

// Function to format time difference in a user-friendly way
function formatTimeAgo(timestamp) {
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - orderTime) / 1000);
    
    if (diffInSeconds < 60) {
        return 'less than 1 minute ago';
    } 
    
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }
    
    return 'more than a week ago';
}

// Function to get recent orders with product details
async function getRecentOrders() {
    try {
        // Get Supabase client
        const supabase = supabase.createClient(
            'https://vbdcamffptexwssjcsfh.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZGNhbWZmcHRleHdzc2pjc2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODI4MDEsImV4cCI6MjA4MjE1ODgwMX0.YAFityTLYKj3fUtf6bqOWJXmMGM35Ke4Xcc0GqNF_u0'
        );

        // Get recent orders (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .gte('created_at', oneDayAgo)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!orders || orders.length === 0) {
            console.log('No recent orders found in the last 24 hours');
            return [];
        }

        // Process orders to extract product info
        const recentPurchases = [];
        
        for (const order of orders) {
            try {
                const items = Array.isArray(order.items) ? order.items : [];
                
                for (const item of items) {
                    recentPurchases.push({
                        productName: item.name || 'A product',
                        imageUrl: item.image || 'https://via.placeholder.com/60x60?text=Product+Image',
                        timeAgo: formatTimeAgo(order.created_at),
                        timestamp: order.created_at
                    });
                }
            } catch (e) {
                console.error('Error processing order items:', e);
            }
        }

        console.log('Recent purchases:', recentPurchases);
        return recentPurchases;
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}

// Function to test and display recent orders
async function testRecentOrders() {
    const recentPurchases = await getRecentOrders();
    
    if (recentPurchases.length === 0) {
        console.log('No recent purchases found in the last 24 hours');
        return 'No recent purchases found';
    }
    
    console.log('--- Recent Purchases ---');
    recentPurchases.forEach((purchase, index) => {
        console.log(`${index + 1}. ${purchase.productName} - ${purchase.timeAgo}`);
        console.log(`   Image: ${purchase.imageUrl}`);
    });
    
    return recentPurchases;
}

// Function to ensure notification elements exist in the DOM
function ensureNotificationElements() {
    // Check if notification element exists
    let notification = document.getElementById('purchaseNotification');
    
    if (!notification) {
        // Create the notification HTML
        const notificationHTML = `
        <div class="purchase-notification" id="purchaseNotification" style="
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #ffffff;
            padding: 18px 20px;
            border-radius: 20px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
            border: 1px solid #f0f0f0;
            z-index: 9999;
            display: none;
            max-width: 320px;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        ">
            <button class="close-notification" id="closeNotification" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.05);
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                line-height: 1;
                cursor: pointer;
                color: #666;
                transition: all 0.2s ease;
            ">
                &times;
            </button>
            <div class="notification-content" style="
                position: relative;
                padding: 14px 16px;
                background: #fff;
            ">
                <div class="notification-header" style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #111;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">
                    <span class="pulse-dot" style="
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        background: #333333;
                        border-radius: 50%;
                        margin-right: 10px;
                        animation: pulse 2s infinite;
                        box-shadow: 0 0 0 rgba(51, 51, 51, 0.4);
                    "></span>
                    <span>New Order</span>
                    <span>•</span>
                    <span>Just Now</span>
                </div>
                <div class="notification-body" style="
                    display: flex;
                    align-items: flex-start;
                    text-align: left;
                    width: 100%;
                ">
                    <img src="" alt="Product" class="notification-product-image" id="notificationProductImage" style="
                        width: 65px;
                        height: 65px;
                        object-fit: cover;
                        border-radius: 10px;
                        margin-right: 14px;
                        border: 1px solid #f0f0f0;
                        flex-shrink: 0;
                    ">
                    <div class="notification-details" style="
                        flex: 1;
                        min-width: 0;
                        padding-right: 15px;
                    ">
                        <p class="product-name-popup" id="notificationProductName" style="
                            margin: 0 0 8px 0;
                            font-weight: 500;
                            font-size: 15px;
                            color: #000;
                            line-height: 1.4;
                            text-align: left;
                            justify-content: left;
                            padding-right: 10px;
                        "></p>
                        <p class="purchase-time" style="
                            margin: 0;
                            font-size: 13px;
                            color: #666;
                            text-align: left;
                        ">
                            Added to cart • <span id="notificationTime">Just now</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <style>
            @keyframes pulse {
                0% { 
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
                }
                70% {
                    transform: scale(1.3);
                    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
                }
            }
            .purchase-notification {
                transform: translateX(120%) scale(0.95);
                opacity: 0;
            }
            .purchase-notification.show {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
`;
                
        // Add to the body
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
        console.log('Added notification element to the page');
    }
            
    
    return {
        notification: document.getElementById('purchaseNotification'),
        productImage: document.getElementById('notificationProductImage'),
        productNameEl: document.getElementById('notificationProductName'),
        closeBtn: document.getElementById('closeNotification')
    };
}

// Function to show a notification popup for an order item
function showOrderNotification(productName, imageUrl, orderTimestamp = new Date().toISOString()) {
    console.log('showOrderNotification called with:', { productName, imageUrl, orderTimestamp });
    
    // Ensure all required elements exist
    const elements = ensureNotificationElements();
    const { notification, productImage, productNameEl, closeBtn } = elements;
    
    if (!notification || !productImage || !productNameEl) {
        console.error('Failed to initialize notification elements');
        return false;
    }
    
    try {
        // Set the product details
        productImage.src = imageUrl || 'https://via.placeholder.com/60x60?text=No+Image';
        productImage.alt = productName || 'Product';
        productNameEl.textContent = productName || 'A product';
        
        // Update the time display
        const timeElement = notification.querySelector('.purchase-time');
        if (timeElement) {
            timeElement.textContent = formatTimeAgo(orderTimestamp);
        }
        
        // Show the notification with animation
        notification.style.display = 'block';
        // Force reflow to enable transition
        void notification.offsetWidth;
        notification.classList.add('show');
        
        // Auto-hide after 8 seconds
        const hideTimeout = setTimeout(() => {
            hideNotification(notification);
        }, 8000);
        
        // Close button functionality
        if (closeBtn) {
            const closeHandler = () => {
                clearTimeout(hideTimeout);
                hideNotification(notification);
                closeBtn.removeEventListener('click', closeHandler);
            };
            closeBtn.addEventListener('click', closeHandler);
        }
        
        return true;
    } catch (error) {
        console.error('Error showing notification:', error);
        return false;
    }
}

// Helper function to hide notification with animation
function hideNotification(notification) {
    if (!notification) return;
    
    notification.classList.remove('show');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        notification.style.display = 'none';
    }, 300);
}

// Test function to verify notifications are working
window.testNotification = function() {
    console.log('Testing notification system...');
    showOrderNotification(
        'Test Product', 
        'https://via.placeholder.com/60x60?text=Test+Product'
    );
    return 'Test notification triggered. Check the bottom-right corner of the screen.';
};

// Function to show a single random order notification
async function showOrderNotifications() {
    try {
        // First, get all orders with their items
        const orders = await window.fetchFromSupabase(
            'orders',
            'id, created_at, items, order_number'
        );
        
        // Only show notifications if there are at least 5 orders
        if (!orders || orders.length < 5) {
            return;
        }
        
        // Sort orders by created_at in descending order and take only the 10 most recent
        const sortedOrders = [...orders].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );
        const recentOrders = sortedOrders.slice(0, 10);
        
        // Get all order items from the 10 most recent orders
        const allItems = [];
        for (const order of recentOrders) {
            if (order.items && order.items.length > 0) {
                for (const item of order.items) {
                    allItems.push({ order, item });
                }
            }
        }
        
        if (allItems.length === 0) {
            console.log('No order items found');
            return;
        }
        
        // Select a random order item
        const randomIndex = Math.floor(Math.random() * allItems.length);
        const { order, item } = allItems[randomIndex];
        
        try {
            const productId = item.product_id || item.id || (item.product && item.product.id);
            
            if (!productId) {
                console.error(`[Order ${order.order_number}] Could not find product ID in item:`, item);
                return;
            }
            
            // Get the product details
            const products = await window.fetchFromSupabase(
                'products',
                'id, name, colors',
                { id: productId }
            );
            
            const product = products && products[0];
            const productName = product?.name || `Product #${productId}`;
            let imageUrl = 'https://via.placeholder.com/60x60?text=No+Image';
            
            // Get the first image from the first color if available
            if (product?.colors?.[0]?.images?.[0]) {
                imageUrl = product.colors[0].images[0];
            } else if (product?.colors?.[0]?.image) {
                imageUrl = product.colors[0].image;
            }
            
            console.log(`[${new Date().toISOString()}] Showing notification: ${productName} (Order time: ${order.created_at})`);
            showOrderNotification(productName, imageUrl, order.created_at);
            
        } catch (error) {
            console.error('Error showing notification:', error);
        }
        
    } catch (error) {
        console.error('Error in showOrderNotifications:', error);
    }
}

// Test function to verify order details retrieval
async function testOrderDetails() {
    // Start showing order notifications
    showOrderNotifications();
    
    // Also log the order details to console
    try {
        const orders = await window.fetchFromSupabase(
            'orders',
            'id, created_at, items, order_number'
        );
        
        if (!orders || orders.length === 0) {
            console.log('No orders found');
            return;
        }
        
        const sortedOrders = [...orders].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );
        
        console.log('Recent Orders with Product Details:');
        
        for (const order of sortedOrders) {
            console.log(`\nOrder ID: ${order.id} (${order.order_number})`);
            console.log(`Order Time: ${new Date(order.created_at).toLocaleString()}`);
            
            if (order.items && order.items.length > 0) {
                console.log('Products:');
                
                for (const [index, item] of order.items.entries()) {
                    try {
                        const productId = item.product_id || item.id || (item.product && item.product.id);
                        
                        if (!productId) {
                            console.error(`  ${index + 1}. [ERROR] Could not find product ID in item:`, item);
                            continue;
                        }
                        
                        const products = await window.fetchFromSupabase(
                            'products',
                            'id, name, colors',
                            { id: productId }
                        );
                        
                        const product = products && products[0];
                        const productName = product?.name || `Unknown Product (ID: ${productId})`;
                        
                        console.log(`  ${index + 1}. ${productName} (Qty: ${item.quantity || 1})`);
                    } catch (error) {
                        console.error(`  ${index + 1}. [ERROR] Error processing item:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error testing order details:', error);
    }
}

// Function to manually test notifications (for debugging)
function testNotification() {
    console.log('Testing notification system...');
    
    // Test with sample data
    const productName = "Test Product";
    const imageUrl = "https://via.placeholder.com/60x60?text=Test";
    
    console.log('Calling showOrderNotification with:', { productName, imageUrl });
    
    // Call the notification function
    showOrderNotification(productName, imageUrl);
    
    // Log success message
    console.log('Notification should be visible now. Check the bottom-right corner of the screen.');
    
    // Return true to indicate the function ran successfully
    return true;
}

// Uncomment to test:
// testOrderDetails();
// testRecentOrders().then(console.log);
// testNotification(); // Uncomment to test a single notification
