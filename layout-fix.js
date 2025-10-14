function adjustLayout() {
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
    content.style.height = `${Math.max(contentHeight, 100)}px`; // Asigură o înălțime minimă de 100px
    
    // Adaugă un mic delay pentru a se asigura că toate elementele s-au încărcat corect
    setTimeout(() => {
        const newContentHeight = window.innerHeight - header.offsetHeight - footer.offsetHeight;
        content.style.height = `${Math.max(newContentHeight, 100)}px`;
    }, 100);
}

// Ajustează la încărcarea inițială
document.addEventListener('DOMContentLoaded', () => {
    adjustLayout();
    
    // Adaugă un mic delay pentru cazul în care imaginile sau alte resurse se încarcă mai târziu
    setTimeout(adjustLayout, 500);
});

// Ajustează la redimensionarea ferestrei
window.addEventListener('resize', adjustLayout);

// Ajustează când se termină tranzițiile CSS (pentru cazul în care există animații)
document.addEventListener('transitionend', adjustLayout);

// Ajustează când se termină încărcarea tuturor resurselor
window.addEventListener('load', adjustLayout);

// Ajustează când se afișează tastatura pe mobil
window.addEventListener('orientationchange', adjustLayout);
window.addEventListener('focusin', adjustLayout);
window.addEventListener('focusout', adjustLayout);
