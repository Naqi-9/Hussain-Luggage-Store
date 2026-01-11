document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const messageDiv = document.getElementById('newsletterMessage');

    if (!newsletterForm) return;

    // Email validation function
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Show message function
    function showMessage(message, isError = false) {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = isError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)';
        messageDiv.style.color = isError ? '#e74c3c' : '#2ecc71';
        messageDiv.style.border = isError ? '1px solid rgba(231, 76, 60, 0.2)' : '1px solid rgba(46, 204, 113, 0.2)';
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // Handle form submission
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Validate email
        if (!email) {
            showMessage('Please enter your email address', true);
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', true);
            return;
        }
        
        try {
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            // Get Supabase client
            const supabase = getSupabaseClient();
            
            // Send data to Supabase
            const response = await fetch(`${supabase.url}/rest/v1/newsletters`, {
                method: 'POST',
                headers: {
                    ...supabase.headers,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    email: email,
                    created_at: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server error:', errorData);
                throw new Error('Failed to subscribe. Please try again.');
            }
            
            // Show success message
            showMessage('Thank you for subscribing to our newsletter!');
            
            // Reset form
            emailInput.value = '';
            
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            showMessage(error.message || 'Sorry, there was an error. Please try again later.', true);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});
