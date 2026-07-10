document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. GESTION DU MENU BURGER --- */
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

    /* =========================================================
       2. GÉNÉRATION DYNAMIQUE (HORS-LIGNE)
       ========================================================= */
    const heroContainer = document.getElementById('hero-news-container');
    const newsContainer = document.getElementById('news-container');

    if (newsContainer && heroContainer) {
        if (typeof newsData !== 'undefined' && newsData.length > 0) {
            
            // --- A. Génération de l'actu "À la une" (la plus récente, index 0) ---
            const heroNews = newsData[0];
            const heroLayoutAttr = heroNews.layout === 'large' ? `data-layout="large"` : '';
            
            let heroHtml = `
            <article class="hero-news-card">
              <div class="hero-news-image">
                <img src="${heroNews.image}" alt="Aperçu grande image" loading="lazy">
              </div>
              <div class="hero-news-content">
                <div class="news-meta">
                  <span class="news-date">${heroNews.date}</span>
                  <span class="news-tag">${heroNews.tag}</span>
                </div>
                <h2>${heroNews.title}</h2>
                <p>${heroNews.subtitle}</p>
                
                <button class="news-button open-modal" 
                   data-title="${heroNews.title}" 
                   data-date="${heroNews.modalDate || heroNews.date}"
                   data-img="${heroNews.image}"
                   ${heroLayoutAttr}
                   data-full-text="${heroNews.fullText}">
                   ${heroNews.buttonText}
                </button>
              </div>
            </article>`;
            
            heroContainer.innerHTML = heroHtml;

            // --- B. Génération des autres actus (en plus petit) ---
            let restHtml = '';

            for (let i = 1; i < newsData.length; i++) {
                const news = newsData[i];
                const layoutAttr = news.layout === 'large' ? `data-layout="large"` : '';

                restHtml += `
                <article class="news-card">
                  <div class="news-image">
                    <img src="${news.image}" alt="Aperçu grande image" loading="lazy">
                  </div>
                  <div class="news-content">
                    <div class="news-meta">
                      <span class="news-date">${news.date}</span>
                      <span class="news-tag">${news.tag}</span>
                    </div>
                    <h2>${news.title}</h2>
                    <p>${news.subtitle}</p>
                    
                    <button class="news-button open-modal" 
                       data-title="${news.title}" 
                       data-date="${news.modalDate || news.date}"
                       data-img="${news.image}"
                       ${layoutAttr}
                       data-full-text="${news.fullText}">
                       ${news.buttonText}
                    </button>
                  </div>
                </article>`;
            }

            newsContainer.innerHTML = restHtml;

            // Initialisation des animations et modales
            initNewsFeatures();

        } else {
            console.error("Variable newsData introuvable ou vide.");
            newsContainer.innerHTML = `<p style="text-align:center; color:var(--nexus-cyan); width:100%;">Erreur : Le fichier actus.js est introuvable ou mal configuré.</p>`;
        }
    }


    /* =========================================================
       3. INITIALISATION DES FONCTIONNALITÉS LIÉES AU CONTENU GÉNÉRÉ
       ========================================================= */
    function initNewsFeatures() {
        
        /* --- SCROLL REVEAL ANIMATION --- */
        // On cible également la nouvelle classe de la grande carte
        const revealElements = document.querySelectorAll('.reveal, .news-card, .hero-news-card'); 
        
        revealElements.forEach(el => {
            if(!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });

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

        /* --- GESTION DE LA MODALE --- */
        const modalOverlay = document.getElementById('article-modal');
        const modalContainer = document.querySelector('.modal-container');
        const modalClose = document.querySelector('.modal-close');
        const openButtons = document.querySelectorAll('.open-modal');

        if (modalOverlay) {
            const mTitle = document.getElementById('modal-title');
            const mDate = document.getElementById('modal-date');
            const mImg = document.getElementById('modal-img');
            const mText = document.getElementById('modal-text');

            // Fonction pour ouvrir
            openButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); 

                    const title = btn.getAttribute('data-title');
                    const date = btn.getAttribute('data-date');
                    const img = btn.getAttribute('data-img');
                    const fullText = btn.getAttribute('data-full-text');
                    const layout = btn.getAttribute('data-layout');

                    if (layout === 'large') {
                        modalContainer.classList.add('layout-large');
                    } else {
                        modalContainer.classList.remove('layout-large');
                    }

                    mTitle.textContent = title;
                    mDate.textContent = date;
                    mImg.src = img;
                    mText.innerHTML = fullText; 

                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                });
            });

            // Fonction pour fermer
            const closeModal = () => {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = ''; 
            };

            if (modalClose) {
                modalClose.addEventListener('click', closeModal);
            }

            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                    closeModal();
                }
            });
        }
    }
});