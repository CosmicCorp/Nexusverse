document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. MENU BURGER --- */
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if(burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.innerHTML = navLinks.classList.contains('active') ? '&#10006;' : '&#9776;';
        });
    }

    /* --- 2. LOGIQUE DE LA GALERIE --- */
    const galleryContainer = document.querySelector('.gallery-container');
    
    if (galleryContainer) {
        // On récupère d'abord les miniatures et les éléments de la galerie
        const thumbs = document.querySelectorAll('.thumb');
        const currentImg = document.getElementById('current-img');
        const caption = document.getElementById('caption');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // On génère le tableau d'images dynamiquement à partir des attributs des miniatures HTML
        const images = Array.from(thumbs).map(thumb => {
            return {
                src: thumb.getAttribute('src'),
                caption: thumb.getAttribute('alt') || ''
            };
        });

        let currentIndex = 0;

        function updateGallery(index) {
            if (!currentImg || images.length === 0) return;
            
            // Disparition
            currentImg.style.opacity = '0';
            currentImg.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                // Mise à jour de la source avec le bon chemin
                currentIndex = index;
                currentImg.src = images[currentIndex].src;
                if(caption) caption.textContent = images[currentIndex].caption;
                
                // Mise à jour des miniatures
                thumbs.forEach(t => t.classList.remove('active'));
                if(thumbs[currentIndex]) {
                    thumbs[currentIndex].classList.add('active');
                    
                    // Fait défiler le conteneur pour centrer automatiquement la miniature active
                    thumbs[currentIndex].scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest'
                    });
                }
                
                // Apparition
                currentImg.style.opacity = '1';
                currentImg.style.transform = 'scale(1)';
            }, 300);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault(); 
                updateGallery((currentIndex + 1) % images.length);
            });

            prevBtn.addEventListener('click', (e) => {
                e.preventDefault(); 
                updateGallery((currentIndex - 1 + images.length) % images.length);
            });

            // Gérer le clic sur les miniatures avec index direct
            thumbs.forEach((thumb, index) => {
                thumb.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateGallery(index);
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') nextBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
            });
        }
    }

    /* --- 3. RECHERCHE & COMPTEURS (Page Personnages) --- */
    const searchBar = document.getElementById('search-bar');
    const sections = document.querySelectorAll('h2[id]');

    const updateCounts = () => {
        sections.forEach(section => {
            const grid = section.nextElementSibling;
            if (grid && grid.classList.contains('character-grid')) {
                const count = grid.querySelectorAll('.character-icon:not(.hidden)').length;
                const span = section.querySelector('.count');
                if(span) span.textContent = `(${count})`;
            }
        });
    };

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.character-icon');
            
            cards.forEach(card => {
                const name = card.querySelector('span').textContent.toLowerCase();
                card.classList.toggle('hidden', !name.includes(term));
            });

            sections.forEach(sec => {
                const grid = sec.nextElementSibling;
                const visible = grid.querySelectorAll('.character-icon:not(.hidden)').length;
                sec.classList.toggle('hidden', visible === 0);
                grid.classList.toggle('hidden', visible === 0);
            });

            updateCounts();
        });
        updateCounts();
    }

    /* --- 4. RETOUR EN HAUT --- */
    const backBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if(backBtn) backBtn.classList.toggle('show', window.scrollY > 500);
    });
    if(backBtn) backBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
});