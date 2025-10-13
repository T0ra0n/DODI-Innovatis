// Fullscreen functionality with overlay control
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselOverlay = document.querySelector('.carousel-overlay');

    if (fullscreenBtn && carouselWrapper) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
            // Entering fullscreen
            if (carouselWrapper.requestFullscreen) {
                carouselWrapper.requestFullscreen();
            } else if (carouselWrapper.webkitRequestFullscreen) {
                carouselWrapper.webkitRequestFullscreen();
            } else if (carouselWrapper.mozRequestFullScreen) {
                carouselWrapper.mozRequestFullScreen();
            }
        } else {
            // Exiting fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
    }

    // Handle fullscreen change events
    function handleFullscreenChange() {
        if (carouselOverlay) {
            const isFullscreen = document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement;
            carouselOverlay.style.display = isFullscreen ? 'none' : 'block';
        }
    }

    // Add event listeners for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
});
