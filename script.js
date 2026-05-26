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

    /* --- 2. BANNER CLOSE LOGIC --- */
    const banner = document.getElementById('new-char-banner');
    const closeBannerBtn = document.getElementById('close-banner');

    if (banner && closeBannerBtn) {
        closeBannerBtn.addEventListener('click', () => {
            banner.style.display = 'none';
        });
    }

    /* --- 3. BOUTON RETOUR EN HAUT --- */
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =========================================================
       4. GÉNÉRATION DYNAMIQUE (HORS-LIGNE)
       ========================================================= */
    const charactersContainer = document.getElementById('characters-container');
    const sectionNavContainer = document.getElementById('section-nav-container');
    const categoryFilter = document.getElementById('category-filter');
    const searchBar = document.getElementById('search-bar');
    const noResultsDiv = document.getElementById('no-results');

    if (charactersContainer) {
        // On vérifie que la variable globale du fichier personnages.js est bien accessible
        if (typeof factionsData !== 'undefined') {
            let htmlNav = '';
            let htmlContent = '';
            let htmlOptions = '<option value="all">Toutes les factions</option>';

            factionsData.forEach(faction => {
                // Construction de la navigation et du select
                htmlNav += `<a href="#${faction.id}">${faction.name}</a>`;
                htmlOptions += `<option value="${faction.id}">${faction.name}</option>`;
                
                // Construction des grilles et des cartes de personnages
                htmlContent += `<h2 id="${faction.id}">${faction.name} <span class="count"></span></h2>`;
                htmlContent += `<div class="character-grid">`;
                
                faction.characters.forEach(char => {
                    htmlContent += `
                    <div class="character-icon">
                        <button class="card-flip-btn" aria-label="Changer d'apparence">&#8635;</button>
                        <a href="${char.link}" class="card-link">
                        <div class="card-face">
                            <div class="img-flip-container">
                            <div class="flip-inner">
                                <div class="flip-front">
                                <img loading="lazy" src="${char.img}" alt="${char.name}">
                                </div>
                                <div class="flip-back">
                                <img loading="lazy" src="${char.imgAlt}" alt="${char.name} Alternatif">
                                </div>
                            </div>
                            </div>
                            <span>${char.name}</span>
                        </div>
                        </a>
                    </div>`;
                });
                
                htmlContent += `</div>`;
            });

            // Injection immédiate des éléments dans le DOM HTML
            sectionNavContainer.innerHTML = htmlNav;
            charactersContainer.innerHTML = htmlContent;
            if (categoryFilter) categoryFilter.innerHTML = htmlOptions;

            // Initialisation de toutes les fonctionnalités interactives sur le contenu généré
            initCharacterFeatures();
        } else {
            console.error("Variable factionsData introuvable.");
            charactersContainer.innerHTML = `<p style="text-align:center; color:var(--nexus-cyan);">Erreur : Le fichier personnages.js est introuvable ou mal configuré.</p>`;
        }
    }

    /* =========================================================
       5. INITIALISATION DES FONCTIONNALITÉS LIÉES AU CONTENU GÉNÉRÉ
       ========================================================= */
    function initCharacterFeatures() {
        const sections = document.querySelectorAll('h2[id]');
        const navItems = document.querySelectorAll('.section-nav a');

        /* --- SCROLL REVEAL ANIMATION --- */
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
        revealOnScroll(); // Lancement initial pour afficher les éléments visibles en haut

        /* --- ACTIVE LINK HIGHLIGHT (Section Nav) --- */
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

        /* --- LOGIQUE FLIPCARD INDIVIDUELLE --- */
        const flipButtons = document.querySelectorAll('.card-flip-btn');
        flipButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const cardContainer = btn.closest('.character-icon');
                const flipInner = cardContainer.querySelector('.flip-inner');
                if (flipInner) {
                    flipInner.classList.toggle('is-flipped');
                }
            });
        });

        /* --- COMPTEURS DYNAMIQUES --- */
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
        updateCounts(); // Initialisation des compteurs de factions

        /* --- LOGIQUE DE RECHERCHE & FILTRAGE (COMBINÉE) --- */
        function filterCharacters() {
            const searchTerm = searchBar ? searchBar.value.toLowerCase().trim() : '';
            const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
            let totalVisible = 0;

            sections.forEach(section => {
                const sectionId = section.getAttribute('id');
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
                    const categoryMatches = (selectedCategory === 'all' || selectedCategory === sectionId);
                    let visibleInSection = 0;
                    const gridIcons = relatedGrid.querySelectorAll('.character-icon');

                    gridIcons.forEach(icon => {
                        const characterName = icon.querySelector('.card-face span').textContent.toLowerCase();
                        const textMatches = characterName.includes(searchTerm);

                        if (categoryMatches && textMatches) {
                            icon.classList.remove('hidden');
                            visibleInSection++;
                            totalVisible++;
                        } else {
                            icon.classList.add('hidden');
                        }
                    });

                    // Masquer la section entière s'il n'y a aucun résultat dedans
                    if (visibleInSection === 0) {
                        section.classList.add('hidden');
                        relatedGrid.classList.add('hidden');
                    } else {
                        section.classList.remove('hidden');
                        relatedGrid.classList.remove('hidden');
                    }
                }
            });

            // Afficher ou masquer le message d'absence de résultat
            if (totalVisible === 0 && (searchTerm !== "" || selectedCategory !== 'all')) {
                noResultsDiv.classList.remove('hidden');
            } else {
                noResultsDiv.classList.add('hidden');
            }
            
            updateCounts();
            revealOnScroll(); // Réactive le reveal pour les éléments filtrés apparaissant à l'écran
        }

        if (searchBar) searchBar.addEventListener('input', filterCharacters);
        if (categoryFilter) categoryFilter.addEventListener('change', filterCharacters);
    }
});