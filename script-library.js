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

    /* --- 2. BANDEAU D'INFORMATION --- */
    const banner = document.getElementById('new-tome-banner');
    const closeBannerBtn = document.getElementById('close-banner-btn');

    if (banner && closeBannerBtn) {
        closeBannerBtn.addEventListener('click', () => {
            banner.classList.add('hidden');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 400);
        });
    }

    /* =========================================================
       3. GÉNÉRATION DYNAMIQUE (HORS-LIGNE)
       ========================================================= */
    const libraryContainer = document.getElementById('library-container');

    if (libraryContainer) {
        if (typeof libraryData !== 'undefined') {
            let htmlContent = '';

            libraryData.forEach(category => {
                // Construction de l'en-tête de section (Accordéon)
                htmlContent += `
                <section class="category reveal">
                  <div class="category-header" data-target="${category.id}">
                    <div class="header-content">
                      <h2>${category.title}</h2>
                      <span class="subtitle">${category.subtitle}</span>
                    </div>
                    <span class="category-toggle">▼</span>
                  </div>
                  
                  <div class="tomes-grid" id="${category.id}">
                `;

                // Construction des cartes de tomes
                category.tomes.forEach(tome => {
                    if (tome.type === 'locked') {
                        htmlContent += `
                        <div class="tome-card locked">
                          <div class="cover-container">
                            <div class="cover-front">
                              <div class="lock-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                              </div>
                              <div class="glitch-text">ARRIVE BIENTOT</div>
                            </div>
                          </div>
                          <div class="tome-info">
                            <div class="tome-meta">
                              <span class="tome-number">${tome.number}</span>
                            </div>
                            <h3 class="tome-title">${tome.title}</h3>
                            <p class="tome-sub">${tome.subtitle}</p>
                          </div>
                        </div>`;
                    } else {
                        htmlContent += `
                        <div class="tome-card">
                          <div class="cover-container">
                            <div class="cover-flipper">
                              <div class="cover-front">
                                <img src="${tome.coverFront}" alt="${tome.altFront}" loading="lazy">
                                <a href="${tome.link}" class="tome-overlay">
                                  <span class="overlay-text">Lire</span>
                                </a>
                              </div>
                              <div class="cover-back">
                                <img src="${tome.coverBack}" alt="${tome.altBack}" loading="lazy">
                                <a href="${tome.link}" class="tome-overlay">
                                  <span class="overlay-text">Lire</span>
                                </a>
                              </div>
                            </div>
                            <button class="btn-alt-cover" title="Voir la couverture alternative" aria-label="Couverture alternative">
                              <span class="icon">↻</span>
                            </button>
                          </div>
                          <div class="tome-info">
                            <div class="tome-meta">
                              <span class="tome-number">${tome.number}</span>
                              <span class="tome-status">${tome.status}</span>
                            </div>
                            <h3 class="tome-title">${tome.title}</h3>
                            <p class="tome-sub">${tome.subtitle}</p>
                          </div>
                        </div>`;
                    }
                });

                htmlContent += `
                  </div>
                </section>`;
            });

            // Injection dans le DOM
            libraryContainer.innerHTML = htmlContent;

            // Initialisation des fonctionnalités interactives
            initLibraryFeatures();
        } else {
            console.error("Variable libraryData introuvable.");
            libraryContainer.innerHTML = `<p style="text-align:center; color:var(--nexus-cyan);">Erreur : Le fichier tomes.js est introuvable ou mal configuré.</p>`;
        }
    }

    /* =========================================================
       4. INITIALISATION DES FONCTIONNALITÉS LIÉES AU CONTENU GÉNÉRÉ
       ========================================================= */
    function initLibraryFeatures() {
        
        /* --- GESTION DES CATÉGORIES (Accordéon) --- */
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

        /* --- SCROLL REVEAL ANIMATION --- */
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
        revealOnScroll(); // Activation au chargement initial

        /* --- ALTERNATIVE COVERS (Flip Effect) --- */
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

        /* --- BARRE DE RECHERCHE INTELLIGENTE --- */
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
                        
                        // Ouvre la catégorie parente si elle était fermée par l'accordéon
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
    }
});