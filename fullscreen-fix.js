// Funcționalitate fullscreen cu suport pentru toate browserele, inclusiv iOS
function toggleFullscreen() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselOverlay = document.querySelector('.carousel-overlay');
    const element = carouselWrapper || document.documentElement;
    
    // Verificăm dacă suntem deja în modul fullscreen
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
        
        // Încercăm să intrăm în modul fullscreen
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(err => {
                console.error(`Eroare la activarea fullscreen: ${err.message}`);
            });
        } else if (element.webkitRequestFullscreen) { // Safari/Chrome
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        } else if (element.webkitEnterFullscreen) { // iOS Safari
            element.webkitEnterFullscreen();
        } else if (element.webkitEnterFullScreen) { // iOS Safari (altă variantă)
            element.webkitEnterFullScreen();
        }
        
        // Ascunde overlay-ul când este în modul fullscreen
        if (carouselOverlay) {
            carouselOverlay.style.display = 'none';
        }
    } else {
        // Ieșim din modul fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        } else if (element.webkitExitFullscreen) { // iOS
            element.webkitExitFullscreen();
        }
        
        // Arată overlay-ul când iese din fullscreen
        if (carouselOverlay) {
            carouselOverlay.style.display = 'block';
        }
    }


    if (carouselOverlay) {
        carouselOverlay.style.display = isFullscreen ? 'none' : 'block';
    }
}

// Adăugăm evenimente pentru detectarea schimbărilor de fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const carouselOverlay = document.querySelector('.carousel-overlay');
    const isFullscreen = document.fullscreenElement || 
                        document.webkitIsFullScreen || 
                        document.mozFullScreen ||
                        document.msFullscreenElement;
    
    if (carouselOverlay) {
        carouselOverlay.style.display = isFullscreen ? 'none' : 'block';
    }
}