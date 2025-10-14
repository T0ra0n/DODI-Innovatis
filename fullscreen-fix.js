// Înlocuiește funcția isIOS() cu această versiune îmbunătățită
function isIOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Funcții simplificate pentru fullscreen (folosesc API-ul modern cu fallback)
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    }
    // Fallback pentru browsere vechi în ordine de prioritate
    return Promise.resolve(
        element.webkitRequestFullscreen?.() ||
        element.webkitEnterFullscreen?.() ||
        element.webkitEnterFullScreen?.() ||
        element.mozRequestFullScreen?.() ||
        element.msRequestFullscreen?.()
    ).catch(() => Promise.reject('Fullscreen nu este suportat'));
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    }
    // Fallback pentru browsere vechi
    return Promise.resolve(
        document.webkitExitFullscreen?.() ||
        document.webkitCancelFullScreen?.() ||
        document.mozCancelFullScreen?.() ||
        document.msExitFullscreen?.()
    ).catch(() => Promise.reject('Ieșirea din fullscreen nu este suportată'));
}

// Funcție centralizată pentru gestionarea overlay-ului
function updateOverlayVisibility(hide = false) {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const overlay = carouselWrapper?.querySelector('.carousel-overlay');
    if (overlay) {
        overlay.style.display = hide ? 'none' : '';
        overlay.style.visibility = hide ? 'hidden' : '';
        overlay.style.position = '';
        overlay.style.left = '';
        overlay.style.top = '';
        overlay.style.zIndex = '';
    }
}

// Funcția principală de toggle fullscreen pentru carusel
function toggleFullscreen() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (!carouselWrapper) {
        console.error('Elementul .carousel-wrapper nu a fost găsit');
        return;
    }

    // Verificăm dacă suntem deja în fullscreen (orice metodă)
    const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.webkitCurrentFullScreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        carouselWrapper.classList.contains('carousel-fullscreen')
    );

    console.log('Fullscreen state:', isCurrentlyFullscreen);

    if (isCurrentlyFullscreen) {
        // Ieșim din fullscreen
        if (carouselWrapper.classList.contains('carousel-fullscreen')) {
            carouselWrapper.classList.remove('carousel-fullscreen');
            document.body.classList.remove('carousel-fullscreen-active');
            updateOverlayVisibility(false); // Restaurăm overlay-ul
            console.log('Ieșit din fullscreen CSS');
        } else {
            exitFullscreen().catch(console.error);
        }
    } else {
        // Intrăm în fullscreen
        if (isIOS()) {
            // Pe iOS încercăm API-ul, apoi fallback la CSS
            const requestFullscreen =
                carouselWrapper.requestFullscreen ||
                carouselWrapper.webkitRequestFullscreen ||
                carouselWrapper.webkitEnterFullscreen ||
                carouselWrapper.webkitEnterFullScreen;

            if (requestFullscreen) {
                requestFullscreen.call(carouselWrapper).catch(() => {
                    // Fallback la CSS dacă API-ul nu funcționează
                    carouselWrapper.classList.add('carousel-fullscreen');
                    document.body.classList.add('carousel-fullscreen-active');
                    updateOverlayVisibility(true);
                    console.log('Fullscreen CSS activat pe iOS');
                });
            } else {
                // Direct CSS dacă nu avem nicio metodă API
                carouselWrapper.classList.add('carousel-fullscreen');
                document.body.classList.add('carousel-fullscreen-active');
                updateOverlayVisibility(true);
                console.log('Fullscreen CSS activat pe iOS (fallback)');
            }
        } else {
            // Pe alte browsere folosim API-ul standard
            enterFullscreen(carouselWrapper).catch(() => {
                // Fallback la CSS dacă API-ul nu funcționează
                carouselWrapper.classList.add('carousel-fullscreen');
                document.body.classList.add('carousel-fullscreen-active');
                updateOverlayVisibility(true);
                console.log('Fullscreen CSS activat (fallback)');
            });
        }
    }
}

// Gesturi pentru ieșirea din fullscreen pe iOS
if (isIOS()) {
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) { // Pinch cu două degete
            const carouselWrapper = document.querySelector('.carousel-wrapper');
            if (carouselWrapper?.classList.contains('carousel-fullscreen')) {
                carouselWrapper.classList.remove('carousel-fullscreen');
                document.body.classList.remove('carousel-fullscreen-active');
                updateOverlayVisibility(false);
                console.log('Ieșit din fullscreen via pinch');
            } else {
                exitFullscreen().catch(console.error);
            }
        }
    }, { passive: true });
}

// Gestionăm schimbările de fullscreen pe toate browserele
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

// Funcție pentru gestionarea schimbărilor de fullscreen
function handleFullscreenChange() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.webkitCurrentFullScreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        (carouselWrapper && carouselWrapper.classList.contains('carousel-fullscreen'))
    );

    // Gestionăm overlay-ul și clasa body în funcție de stare
    updateOverlayVisibility(isFullscreen);

    if (isFullscreen) {
        document.body.classList.add('carousel-fullscreen-active');
    } else {
        document.body.classList.remove('carousel-fullscreen-active');
    }

    console.log('Fullscreen schimbat:', isFullscreen);
}

// Stilurile CSS pentru fullscreen (mai eficiente)
if (!document.querySelector('#carousel-fullscreen-style')) {
    const style = document.createElement('style');
    style.id = 'carousel-fullscreen-style';
    style.textContent = `
        .carousel-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
        }

        .carousel-fullscreen .carousel {
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
        }

        .carousel-fullscreen .carousel-slide {
            width: 100vw !important;
            height: 100vh !important;
            object-fit: contain !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
        }

        body.carousel-fullscreen-active {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
        }

        @media screen and (max-width: 1024px) {
            .carousel-fullscreen .carousel-slide {
                width: 100vw !important;
                height: 100vh !important;
                object-fit: contain !important;
            }
        }
    `;
    document.head.appendChild(style);
}