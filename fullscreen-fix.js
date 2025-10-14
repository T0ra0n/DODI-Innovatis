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

// Actualizează funcția toggleFullscreen() cu această versiune
function toggleFullscreen() {
    const element = document.documentElement;
    
    if (isIOS()) {
        if (document.webkitFullscreenElement || 
            document.webkitCurrentFullScreenElement || 
            document.fullscreenElement) {
            exitFullscreen();
        } else {
            // Pe iOS, încercăm mai întâi cu document.documentElement
            const requestFullscreen = 
                element.requestFullscreen || 
                element.webkitRequestFullscreen || 
                element.mozRequestFullScreen || 
                element.msRequestFullscreen;
            
            if (requestFullscreen) {
                requestFullscreen.call(element).catch(err => {
                    console.log('Eroare la fullscreen:', err);
                    // Dacă nu funcționează, încercăm cu o abordare alternativă
                    document.body.classList.add('ios-fullscreen');
                });
            } else {
                // Ultimul recurs - adăugăm clasa manual
                document.body.classList.add('ios-fullscreen');
            }
        }
    } else {
        // Pentru alte browsere
        if (!document.fullscreenElement) {
            enterFullscreen(element).catch(console.error);
        } else {
            exitFullscreen();
        }
    }
}

// Adaugă acest stil în head-ul documentului dacă nu există deja
if (!document.querySelector('#ios-fullscreen-style')) {
    const style = document.createElement('style');
    style.id = 'ios-fullscreen-style';
    style.textContent = `
        .ios-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 99999 !important;
            background: white;
            overflow: auto !important;
            -webkit-overflow-scrolling: touch !important;
        }
    `;
    document.head.appendChild(style);
}