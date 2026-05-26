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
    const newsContainer = document.getElementById('news-container');

    if (newsContainer) {
        if (typeof newsData !== 'undefined') {
            let htmlContent = '';

            newsData.forEach(news => {
                // Gestion du layout large optionnel pour la modale
                const layoutAttr = news.layout === 'large' ? `data-layout="large"` : '';

                htmlContent += `
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
            });

            // Injection des actualités dans le DOM
            newsContainer.innerHTML = htmlContent;

            // Une fois le HTML généré, on initialise les animations et la modale
            initNewsFeatures();

        } else {
            console.error("Variable newsData introuvable.");
            newsContainer.innerHTML = `<p style="text-align:center; color:var(--nexus-cyan); width:100%;">Erreur : Le fichier actus.js est introuvable ou mal configuré.</p>`;
        }
    }


    /* =========================================================
       3. INITIALISATION DES FONCTIONNALITÉS LIÉES AU CONTENU GÉNÉRÉ
       ========================================================= */
    function initNewsFeatures() {
        
        /* --- SCROLL REVEAL ANIMATION --- */
        const revealElements = document.querySelectorAll('.reveal, .news-card'); // On cible aussi les cartes générées
        
        // On s'assure d'initialiser les classes correctement
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
        revealOnScroll(); // Déclencher une fois au chargement pour les premiers éléments

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