// Detectare iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Functie pentru activare fullscreen nativ
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        return element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        return element.msRequestFullscreen();
    }
    return Promise.reject('Fullscreen API nu este suportat');
}

// Functie pentru iesire fullscreen nativ
function exitFullscreen() {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        return document.msExitFullscreen();
    }
    return Promise.reject('Ieșirea din fullscreen nu este suportată');
}

// Functie pentru a sti daca suntem in fullscreen
function isFullscreenActive() {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement ||
           document.msFullscreenElement;
}

// Functie principala toggle fullscreen
function toggleFullscreen() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselOverlay = document.querySelector('.carousel-overlay');
    const element = carouselWrapper || document.documentElement;

    if (isIOS()) {
        // Simulare fullscreen pentru iPhone
        const isActive = document.body.classList.toggle('ios-fullscreen');
        element.classList.toggle('ios-fullscreen', isActive);
        if (carouselOverlay) {
            carouselOverlay.style.display = isActive ? 'none' : 'block';
        }
    } else {
        // Browsere normale – folosim API-ul nativ
        if (isFullscreenActive()) {
            exitFullscreen();
        } else {
            enterFullscreen(element).catch(err => console.warn('Eroare fullscreen:', err));
        }
    }
}

// Detectam schimbarea modului fullscreen
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
.forEach(event => {
    document.addEventListener(event, () => {
        const carouselOverlay = document.querySelector('.carousel-overlay');
        const active = isFullscreenActive();
        if (carouselOverlay) {
            carouselOverlay.style.display = active ? 'none' : 'block';
        }
    });
});

// Stiluri pentru simularea fullscreen-ului pe iOS
const style = document.createElement('style');
style.textContent = `
.ios-fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    z-index: 9999 !important;
    background: #000 !important;
    overflow: hidden !important;
    display: flex !important;
    justify-content: center;
    align-items: center;
}
`;
document.head.appendChild(style);
