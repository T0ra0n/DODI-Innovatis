// Funcție pentru a preveni derularea automată
function preventAutoScroll() {
    // Salvează poziția de derulare curentă
    const scrollY = window.scrollY;
    
    // Aplică scroll la poziția curentă după un mic delay
    setTimeout(() => {
        window.scrollTo(0, scrollY);
    }, 0);
}

function adjustLayout() {
    // Salvează poziția de derulare curentă
    const scrollY = window.scrollY;
    
    // Elementele pe care vrem să le ajustăm
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.mobile-footer');
    const content = document.querySelector('.left-large');
    
    // Verifică dacă toate elementele există
    if (!header || !footer || !content) return;
    
    // Obține înălțimile
    const headerHeight = header.offsetHeight;
    const footerHeight = footer.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculează și setează înălțimea pentru conținut
    const contentHeight = windowHeight - headerHeight - footerHeight;
    content.style.height = `${Math.max(contentHeight, 100)}px`;
    
    // Restabilește poziția de derulare după ajustarea layout-ului
    window.scrollTo(0, scrollY);
    
    // Adaugă un mic delay pentru a se asigura că toate elementele s-au încărcat corect
    setTimeout(() => {
        const newContentHeight = window.innerHeight - header.offsetHeight - footer.offsetHeight;
        content.style.height = `${Math.max(newContentHeight, 100)}px`;
        window.scrollTo(0, scrollY);
    }, 100);
}

// Funcție de inițializare care rulează o singură dată
function initLayout() {
    // Aplică scroll la început pentru a preveni derularea automată
    preventAutoScroll();
    
    // Ajustează layout-ul
    adjustLayout();
    
    // Aplică din nou după un scurt delay pentru a contracara orice ajustare a browserului
    setTimeout(() => {
        preventAutoScroll();
        adjustLayout();
    }, 300);
}

// Rulează la încărcarea inițială
document.addEventListener('DOMContentLoaded', initLayout);

// Evenimente care pot schimba layout-ul
const resizeObserver = new ResizeObserver(adjustLayout);
resizeObserver.observe(document.body);

// Evenimente suplimentare pentru a gestiona schimbările de layout
window.addEventListener('load', initLayout);
window.addEventListener('resize', adjustLayout);
window.addEventListener('orientationchange', () => {
    setTimeout(adjustLayout, 100);
});

// Previne derularea automată când se face focus pe câmpuri de input
document.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        preventAutoScroll();
    }
});

// Asigură-te că layout-ul este corect după ce dispare tastatura
document.addEventListener('focusout', () => {
    setTimeout(adjustLayout, 300);
});
