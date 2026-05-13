document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. MENU BURGER --- */
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

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

    /* --- 2. SCROLL REVEAL ANIMATION --- */
    const revealElements = document.querySelectorAll('.character-icon, h2');
    revealElements.forEach(el => el.classList.add('reveal'));

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

    /* --- 3. ACTIVE LINK HIGHLIGHT (Section Nav) --- */
    const sections = document.querySelectorAll('h2[id]');
    const navItems = document.querySelectorAll('.section-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current) && current !== '') {
                a.classList.add('active');
            }
        });
    });

    /* --- 4. BANNER CLOSE LOGIC --- */
    const banner = document.getElementById('new-char-banner');
    const closeBannerBtn = document.getElementById('close-banner');

    if (banner && closeBannerBtn) {
        closeBannerBtn.addEventListener('click', () => {
            banner.style.display = 'none';
        });
    }

    /* --- 5. COMPTEURS DYNAMIQUES --- */
    const updateCounts = () => {
        sections.forEach(section => {
            let nextElement = section.nextElementSibling;
            let relatedGrid = null;

            while (nextElement && nextElement.tagName !== 'H2') {
                if (nextElement.classList.contains('character-grid')) {
                    relatedGrid = nextElement;
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }

            if (relatedGrid) {
                const visibleCharacters = relatedGrid.querySelectorAll('.character-icon:not(.hidden)').length;
                const countSpan = section.querySelector('.count');
                if (countSpan) {
                    countSpan.textContent = `(${visibleCharacters})`;
                }
            }
        });
    };
    
    // Initialiser les compteurs au chargement
    updateCounts();

    /* --- 6. LOGIQUE DE LA BARRE DE RECHERCHE --- */
    const searchBar = document.getElementById('search-bar');
    const noResultsDiv = document.getElementById('no-results');
    
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const characterIcons = document.querySelectorAll('.character-icon');
            let totalVisible = 0;
            
            // Masquer/Afficher les personnages
            characterIcons.forEach(icon => {
                const characterName = icon.querySelector('span').textContent.toLowerCase();
                if (characterName.includes(searchTerm)) {
                    icon.classList.remove('hidden');
                    totalVisible++;
                } else {
                    icon.classList.add('hidden');
                }
            });

            // Gérer l'affichage des titres de sections (h2)
            sections.forEach(section => {
                let nextElement = section.nextElementSibling;
                let relatedGrid = null;

                while (nextElement && nextElement.tagName !== 'H2') {
                    if (nextElement.classList.contains('character-grid')) {
                        relatedGrid = nextElement;
                        break;
                    }
                    nextElement = nextElement.nextElementSibling;
                }

                if (relatedGrid) {
                    const visibleCharacters = relatedGrid.querySelectorAll('.character-icon:not(.hidden)');
                    
                    if (visibleCharacters.length === 0) {
                        section.classList.add('hidden');
                        relatedGrid.classList.add('hidden');
                    } else {
                        section.classList.remove('hidden');
                        relatedGrid.classList.remove('hidden');
                    }
                }
            });

            // Afficher le message "Aucun résultat" si nécessaire
            if (totalVisible === 0 && searchTerm !== "") {
                noResultsDiv.classList.remove('hidden');
            } else {
                noResultsDiv.classList.add('hidden');
            }
            
            // Mettre à jour les compteurs en temps réel
            updateCounts();
            
            // S'assurer que les éléments révélés par la recherche ont l'animation "active"
            revealOnScroll();
        });
    }

    /* --- 7. BOUTON RETOUR EN HAUT --- */
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});