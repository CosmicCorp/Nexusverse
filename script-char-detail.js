document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. MENU BURGER */
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

    /* 2. GALERIE & NAVIGATION */
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".modal-close");
    
    // Boutons de navigation
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    
    // Récupérer toutes les images de la galerie
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentIndex = 0;

    // Fonction pour mettre à jour l'image affichée avec un effet de fondu
    const updateModalImage = (index) => {
        // Disparition douce
        modalImg.style.opacity = "0"; 
        
        setTimeout(() => {
            const img = galleryImages[index];
            modalImg.src = img.src;
            const caption = img.getAttribute('data-caption');
            captionText.innerHTML = caption ? caption : "";
            currentIndex = index;
            
            // Réapparition une fois l'image chargée
            modalImg.onload = () => {
                modalImg.style.opacity = "1";
            };
        }, 200);
    };

    // Clic sur une vignette
    galleryImages.forEach((img, index) => {
        img.closest('.gallery-item').addEventListener('click', function() {
            modal.style.display = "flex"; // Utilisation de flex pour garder le centrage
            updateModalImage(index);
        });
    });

    // Navigation SUIVANT
    if(nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche de fermer la modale en cliquant
            let newIndex = currentIndex + 1;
            if (newIndex >= galleryImages.length) {
                newIndex = 0; // Boucle au début
            }
            updateModalImage(newIndex);
        });
    }

    // Navigation PRÉCÉDENT
    if(prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = galleryImages.length - 1; // Boucle à la fin
            }
            updateModalImage(newIndex);
        });
    }

    // Navigation Clavier (Flèches Gauche/Droite)
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "flex" || modal.style.display === "block") {
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'Escape') modal.style.display = "none";
        }
    });

    // Fermeture
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    /* 3. SCROLL REVEAL */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 50; 
        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger au chargement

    /* 4. ACCORDÉON GALERIE (Injection dynamique) */
    const evolutionSection = document.querySelector('.evolution-section');
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (evolutionSection && galleryGrid && galleryItems.length > 0) {
        // Création et injection du bouton sans toucher au HTML
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'gallery-toggle-btn';
        toggleBtn.textContent = 'Voir toutes les variantes ▼';
        evolutionSection.appendChild(toggleBtn);

        let isExpanded = false;

        const updateGridHeight = () => {
            if (isExpanded) {
                // Si ouvert : on donne la hauteur totale de la grille
                galleryGrid.style.maxHeight = galleryGrid.scrollHeight + "px";
            } else {
                // Si fermé : on limite la hauteur à celle du tout premier élément
                const firstItemHeight = galleryItems[0].offsetHeight;
                galleryGrid.style.maxHeight = firstItemHeight + "px";
            }
        };

        // Initialisation de la hauteur au chargement
        // On utilise un setTimeout pour s'assurer que le CSS a bien été appliqué
        setTimeout(updateGridHeight, 50);

        // Événement au clic sur le bouton
        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            updateGridHeight();
            toggleBtn.textContent = isExpanded ? 'Masquer les variantes ▲' : 'Voir toutes les variantes ▼';
        });

        // Mise à jour automatique de la hauteur si la fenêtre est redimensionnée (responsive)
        window.addEventListener('resize', () => {
            if (isExpanded) {
                // Astuce : on retire la contrainte temporairement pour recalculer la vraie taille
                galleryGrid.style.maxHeight = 'none';
                const newHeight = galleryGrid.scrollHeight;
                galleryGrid.style.maxHeight = newHeight + "px";
            } else {
                updateGridHeight();
            }
        });
    }
});