// Înlocuiește funcția isIOS() cu această versiune îmbunătățită
function isIOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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

// Funcția principală de toggle fullscreen pentru carusel
function toggleFullscreen() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (!carouselWrapper) {
        console.error('Elementul .carousel-wrapper nu a fost găsit');
        return;
    }

    // Verificăm dacă suntem deja în fullscreen (orice browser)
    const isCurrentlyFullscreen = document.fullscreenElement ||
                                 document.webkitFullscreenElement ||
                                 document.webkitCurrentFullScreenElement ||
                                 document.mozFullScreenElement ||
                                 document.msFullscreenElement ||
                                 carouselWrapper.classList.contains('carousel-fullscreen');

    console.log('Current fullscreen state:', isCurrentlyFullscreen);
    console.log('Carousel wrapper classes:', carouselWrapper.className);

    if (isCurrentlyFullscreen) {
        // Ieșim din fullscreen - restaurăm starea inițială a overlay-ului
        if (carouselWrapper.classList.contains('carousel-fullscreen')) {
            // Pe iOS, doar eliminăm clasa CSS și restaurăm overlay-ul
            carouselWrapper.classList.remove('carousel-fullscreen');
            document.body.classList.remove('carousel-fullscreen-active');
            console.log('Removed carousel-fullscreen class and body class');

            // Restaurăm overlay-ul la starea inițială
            const overlay = carouselWrapper.querySelector('.carousel-overlay');
            if (overlay) {
                overlay.style.display = '';
                overlay.style.visibility = '';
                overlay.style.position = '';
                overlay.style.left = '';
                overlay.style.top = '';
                overlay.style.zIndex = '';
                console.log('Overlay restored to initial state');
            }
        } else {
            // Pe alte browsere, folosim API-ul standard
            exitFullscreen().catch(err => {
                console.error('Eroare la ieșirea din fullscreen:', err);
            });
        }
    } else {
        // Intrăm în fullscreen
        if (isIOS()) {
            // Pe iOS, încercăm mai întâi API-ul cu elementul carusel, apoi fallback la CSS
            const requestFullscreen =
                carouselWrapper.requestFullscreen ||
                carouselWrapper.webkitRequestFullscreen ||
                carouselWrapper.webkitEnterFullscreen ||
                carouselWrapper.webkitEnterFullScreen;

            if (requestFullscreen) {
                requestFullscreen.call(carouselWrapper).then(() => {
                    console.log('Fullscreen activat cu succes pe iOS pentru carusel');
                }).catch(err => {
                    console.log('API-ul fullscreen nu funcționează pe iOS pentru carusel, folosim soluția CSS:', err);
                    carouselWrapper.classList.add('carousel-fullscreen');
                    document.body.classList.add('carousel-fullscreen-active');
                    console.log('Applied carousel-fullscreen class and body class');
                    // Asigurăm că overlay-ul este ascuns și manual dacă regula CSS nu funcționează
                    const overlay = carouselWrapper.querySelector('.carousel-overlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                        overlay.style.visibility = 'hidden';
                        console.log('Overlay hidden manually');
                    }
                });
            } else {
                console.log('Nicio metodă de fullscreen disponibilă pe iOS pentru carusel, folosim soluția CSS');
                carouselWrapper.classList.add('carousel-fullscreen');
                document.body.classList.add('carousel-fullscreen-active');
                console.log('Applied carousel-fullscreen class and body class');
                // Asigurăm că overlay-ul este ascuns și manual
                const overlay = carouselWrapper.querySelector('.carousel-overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    overlay.style.visibility = 'hidden';
                    console.log('Overlay hidden manually');
                }
            }
        } else {
            // Pe alte browsere, folosim API-ul standard cu elementul carusel
            enterFullscreen(carouselWrapper).catch(err => {
                console.error('Eroare la activarea fullscreen pentru carusel:', err);
            });
        }
    }
}

// Adăugăm gesturi pentru ieșirea din fullscreen pe iOS
if (isIOS()) {
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            console.log('Pinch detected on iOS');
            // Dacă utilizatorul face pinch cu două degete, ieșim din fullscreen
            const carouselWrapper = document.querySelector('.carousel-wrapper');
            if (carouselWrapper && carouselWrapper.classList.contains('carousel-fullscreen')) {
                console.log('Removing carousel-fullscreen class via pinch');
                carouselWrapper.classList.remove('carousel-fullscreen');
                document.body.classList.remove('carousel-fullscreen-active');

                // Restaurăm overlay-ul la starea inițială
                const overlay = carouselWrapper.querySelector('.carousel-overlay');
                if (overlay) {
                    overlay.style.display = '';
                    overlay.style.visibility = '';
                    overlay.style.position = '';
                    overlay.style.left = '';
                    overlay.style.top = '';
                    overlay.style.zIndex = '';
                    console.log('Overlay restored via pinch');
                }
            } else {
                exitFullscreen().catch(console.error);
            }
        }
    }, { passive: true });
}

// Adăugăm evenimente pentru a gestiona schimbările de fullscreen pe toate browserele
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

// Funcție pentru a gestiona schimbările de fullscreen
function handleFullscreenChange() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const overlay = carouselWrapper ? carouselWrapper.querySelector('.carousel-overlay') : null;
    const isFullscreen = document.fullscreenElement ||
                        document.webkitFullscreenElement ||
                        document.webkitCurrentFullScreenElement ||
                        document.mozFullScreenElement ||
                        document.msFullscreenElement ||
                        (carouselWrapper && carouselWrapper.classList.contains('carousel-fullscreen'));

    console.log('Fullscreen state changed:', isFullscreen);
    console.log('Document fullscreenElement:', document.fullscreenElement);
    console.log('Carousel wrapper classes:', carouselWrapper ? carouselWrapper.className : 'null');

    // Gestionăm starea overlay-ului în funcție de fullscreen
    if (isFullscreen && overlay) {
        // Suntem în fullscreen - ascundem overlay-ul
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        console.log('Overlay hidden in fullscreen change handler');
    } else if (!isFullscreen && overlay) {
        // Am ieșit din fullscreen - restaurăm overlay-ul
        overlay.style.display = '';
        overlay.style.visibility = '';
        overlay.style.position = '';
        overlay.style.left = '';
        overlay.style.top = '';
        overlay.style.zIndex = '';
        console.log('Overlay restored in fullscreen change handler');
    }

    // Gestionăm și clasa body pentru fullscreen
    if (isFullscreen) {
        document.body.classList.add('carousel-fullscreen-active');
    } else {
        document.body.classList.remove('carousel-fullscreen-active');
    }
}

// Adaugă acest stil în head-ul documentului dacă nu există deja
if (!document.querySelector('#carousel-fullscreen-style')) {
    const style = document.createElement('style');
    style.id = 'carousel-fullscreen-style';
    style.textContent = `
        /* Asigurăm că overlay-ul este ascuns cu prioritate maximă */
        .carousel-fullscreen .carousel-overlay,
        .carousel-wrapper.carousel-fullscreen .carousel-overlay,
        .carousel-wrapper.carousel-fullscreen > .carousel-overlay {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
            z-index: -1 !important;
        }

        .carousel-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 99999 !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
        }

        .carousel-fullscreen .carousel {
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            position: relative !important;
        }

        .carousel-fullscreen .carousel-container {
            height: 100% !important;
            width: 100% !important;
            position: relative !important;
        }

        .carousel-fullscreen .carousel-slide {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            object-fit: contain !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
        }

        /* Ascundem toate elementele din afară când caruselul este în fullscreen pe iOS și alte browsere */
        .carousel-fullscreen ~ *,
        .carousel-fullscreen ~ header,
        .carousel-fullscreen ~ footer,
        .carousel-fullscreen ~ .main-container,
        .carousel-fullscreen ~ .resizer,
        .carousel-fullscreen ~ .right-small {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }

        /* Asigurăm că body-ul nu se scrollează în fullscreen */
        body.carousel-fullscreen-active {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
        }

        /* Doar caruselul și butonul de fullscreen rămân vizibile */
        .carousel-fullscreen,
        .carousel-fullscreen .fullscreen-btn {
            display: block !important;
        }

        /* Pe iOS, forțăm orientarea landscape pentru fullscreen */
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