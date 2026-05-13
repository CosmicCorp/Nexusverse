document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. MENU BURGER --- */
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.innerHTML = navLinks.classList.contains('active') ? '&#10006;' : '&#9776;';
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.innerHTML = '&#9776;';
            });
        });
    }

    /* --- 2. GESTION DES CATÉGORIES (Accordéon) --- */
    const headers = document.querySelectorAll('.category-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-target');
            const grid = document.getElementById(targetId);
            const toggle = header.querySelector('.category-toggle');

            if (grid) {
                grid.classList.toggle('hidden');
                if(toggle) {
                    toggle.classList.toggle('rotated');
                }
            }
        });
    });

    /* --- 3. SCROLL REVEAL ANIMATION --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    /* --- 4. ALTERNATIVE COVERS (Flip Effect) --- */
    const flipButtons = document.querySelectorAll('.btn-alt-cover');

    flipButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); 
            
            const container = btn.closest('.cover-container');
            if(container) {
                container.classList.toggle('is-flipped');
            }
        });
    });

    /* --- 5. BARRE DE RECHERCHE INTELLIGENTE --- */
    const searchInput = document.getElementById('search-input');
    const tomesCards = document.querySelectorAll('.tome-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            tomesCards.forEach(card => {
                const title = card.querySelector('.tome-title')?.textContent.toLowerCase() || '';
                const subtitle = card.querySelector('.tome-sub')?.textContent.toLowerCase() || '';
                const number = card.querySelector('.tome-number')?.textContent.toLowerCase() || '';
                
                const isMatch = title.includes(searchTerm) || subtitle.includes(searchTerm) || number.includes(searchTerm);

                if (isMatch) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                    
                    if (searchTerm.length > 0) {
                        const parentGrid = card.closest('.tomes-grid');
                        if (parentGrid && parentGrid.classList.contains('hidden')) {
                            parentGrid.classList.remove('hidden');
                            const targetHeader = document.querySelector(`.category-header[data-target="${parentGrid.id}"] .category-toggle`);
                            if (targetHeader) targetHeader.classList.remove('rotated');
                        }
                    }
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    }

    /* --- 6. BANDEAU D'INFORMATION (Réapparaît au rafraîchissement) --- */
    const banner = document.getElementById('new-tome-banner');
    const closeBannerBtn = document.getElementById('close-banner-btn');

    if (banner && closeBannerBtn) {
        // La vérification du localStorage a été supprimée pour permettre la réapparition au refresh.

        closeBannerBtn.addEventListener('click', () => {
            // On ajoute la classe pour l'animation de sortie
            banner.classList.add('hidden');
            
            // La sauvegarde dans localStorage a été supprimée.
            
            // On cache l'élément après l'animation (400ms) pour libérer l'espace visuel
            setTimeout(() => {
                banner.style.display = 'none';
            }, 400);
        });
    }

});