document.addEventListener('DOMContentLoaded', function() {
    // Select all slides, dots, and navigation elements
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_INTERVAL = 10000; // 15 seconds
    
    // Function to show a specific slide
    function showSlide(index) {
        // Reset all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => {
            dot.classList.remove('active');
            // Reset the progress ring animation
            const circle = dot.querySelector('.progress-ring-circle');
            if (circle) {
                circle.style.transition = 'none';
                circle.style.strokeDashoffset = '100';
                // Force reflow to apply the reset
                void circle.offsetWidth;
            }
        });
        
        // Show the selected slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Start the progress ring animation for the active dot
        const activeCircle = dots[index].querySelector('.progress-ring-circle');
        if (activeCircle) {
            // Small delay to ensure the transition is applied after the reset
            setTimeout(() => {
                activeCircle.style.transition = `stroke-dashoffset ${SLIDE_INTERVAL}ms linear`;
                activeCircle.style.strokeDashoffset = '0';
            }, 10);
        }
        
        currentSlide = index;
    }
    
    // Function to go to the next slide
    function nextSlide() {
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        showSlide(nextSlideIndex);
    }
    
    // Function to go to the previous slide
    function prevSlide() {
        const prevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevSlideIndex);
    }
    
    // Start the automatic slideshow
    function startSlideShow() {
        stopSlideShow(); // Clear any existing interval
        slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    }
    
    // Stop the automatic slideshow
    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }
    
    // Event listeners for navigation dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlideShow(); // Restart the slideshow after manual navigation
        });
    });
    
    // Event listeners for navigation arrows
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlideShow(); // Restart the slideshow after manual navigation
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlideShow(); // Restart the slideshow after manual navigation
    });
    
    // Pause slideshow when hovering over the slider
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlideShow();
    }, false);
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlideShow();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance to consider it a swipe
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            prevSlide();
        }
    }
    
    // Initialize the slider
    showSlide(0);
    startSlideShow();
});
