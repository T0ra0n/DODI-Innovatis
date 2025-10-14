document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.querySelector('.tabs-container');
    const sectionTabs = document.querySelector('.section-tabs');
    const topLarge = document.querySelector('.top-large');
    const tabContent = document.querySelector('.tab-content.fade-in-up');
    
    // Verifică dacă toate elementele există
    if (!tabsContainer || !sectionTabs || !topLarge || !tabContent) return;
    
    // Adaugă clasa pentru stilizare inițială
    tabsContainer.classList.add('sticky-tabs');
    sectionTabs.classList.add('sticky-tabs');
    
    // Funcție pentru a verifica poziția de derulare
    function checkScroll() {
        const topLargeRect = topLarge.getBoundingClientRect();
        const tabContentRect = tabContent.getBoundingClientRect();
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        
        // Verifică dacă am derulat până la sfârșitul conținutului
        if (isAtBottom || tabContentRect.bottom <= window.innerHeight) {
            tabsContainer.classList.remove('sticky');
            sectionTabs.classList.remove('sticky');
        } else if (topLargeRect.top <= 0) {
            // Dacă am derulat mai mult de începutul containerului top-large
            tabsContainer.classList.add('sticky');
            sectionTabs.classList.add('sticky');
        } else {
            // Dacă suntem în partea de sus a paginii
            tabsContainer.classList.remove('sticky');
            sectionTabs.classList.remove('sticky');
        }
    }
    
    // Adaugă eveniment de scroll
    window.addEventListener('scroll', checkScroll);
    
    // Rulează o dată la încărcarea paginii
    checkScroll();
});
