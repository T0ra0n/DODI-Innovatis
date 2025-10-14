// Funcție helper pentru a detecta iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Funcție pentru a gestiona schimbările de fullscreen
function handleFullscreenChange() {
    const carouselOverlay = document.querySelector('.carousel-overlay');
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement ||
                        document.webkitCurrentFullScreenElement ||
                        document.mozFullScreenElement ||
                        document.msFullscreenElement;
    
    if (carouselOverlay) {
        carouselOverlay.style.display = isFullscreen ? 'none' : 'block';
    }
}

// Funcție pentru a intra în modul fullscreen
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen().catch(console.error);
    } else if (element.webkitRequestFullscreen) { // Safari/Chrome
        return element.webkitRequestFullscreen();
    } else if (element.webkitEnterFullscreen) { // iOS Safari
        return element.webkitEnterFullscreen();
    } else if (element.webkitEnterFullScreen) { // iOS Safari (altă variantă)
        return element.webkitEnterFullScreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        return element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        return element.msRequestFullscreen();
    }
    return Promise.reject('Fullscreen API nu este suportat');
}

// Funcție pentru a ieși din modul fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari
        return document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) { // iOS
        return document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        return document.msExitFullscreen();
    }
    return Promise.reject('Ieșirea din fullscreen nu este suportată');
}

// Funcția principală de toggle fullscreen
function toggleFullscreen() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselOverlay = document.querySelector('.carousel-overlay');
    const element = carouselWrapper || document.documentElement;
    
    // Verificăm dacă suntem deja în fullscreen
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement ||
                        document.webkitCurrentFullScreenElement ||
                        document.mozFullScreenElement ||
                        document.msFullscreenElement;
    
    if (isIOS()) {
        // Pe iOS, folosim o abordare specifică
        if (isFullscreen) {
            exitFullscreen();
        } else {
            // Pe iOS, trebuie să folosim un element video sau iframe pentru fullscreen
            const videoElement = element.querySelector('video');
            if (videoElement) {
                enterFullscreen(videoElement);
            } else {
                // Dacă nu există element video, încercăm cu elementul principal
                enterFullscreen(element).catch(err => {
                    console.warn('Nu s-a putut activa fullscreen pe iOS:', err);
                    // Pe iOS, adăugăm o clasă pentru a simula fullscreen
                    document.body.classList.add('ios-fullscreen');
                    if (carouselOverlay) {
                        carouselOverlay.style.display = 'none';
                    }
                });
            }
        }
    } else {
        // Pentru alte browsere, folosim metoda standard
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen(element).catch(console.error);
        }
    }
}

// Adăugăm evenimente pentru detectarea schimbărilor de fullscreen
const fullscreenEvents = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange'
];

fullscreenEvents.forEach(event => {
    document.addEventListener(event, handleFullscreenChange);
});

// Adăugăm gesturi specifice pentru iOS
if (isIOS()) {
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            // Dacă utilizatorul face pinch cu două degete, ieșim din fullscreen
            exitFullscreen().catch(console.error);
        }
    }, { passive: true });
}

// Adăugăm stiluri necesare pentru iOS
const style = document.createElement('style');
style.textContent = `
    .ios-fullscreen {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        z-index: 9999 !important;
        background: white;
        overflow: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
`;
document.head.appendChild(style);