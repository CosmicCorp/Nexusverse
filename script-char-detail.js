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
});