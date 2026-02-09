document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. MENU BURGER */
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Change l'icône
            if (navLinks.classList.contains('active')) {
                burger.innerHTML = '&#10006;'; // Croix
            } else {
                burger.innerHTML = '&#9776;'; // Burger
            }
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.innerHTML = '&#9776;';
            });
        });
    }

    /* 2. GALERIE & NAVIGATION (Modale) */
    const modal = document.getElementById("imgModal");
    
    // On vérifie que la modale existe dans le HTML pour éviter les erreurs
    if (modal) {
        const modalImg = document.getElementById("modalImg");
        const captionText = document.getElementById("caption");
        const closeBtn = document.querySelector(".modal-close");
        
        // Boutons de navigation
        const prevBtn = document.querySelector(".prev");
        const nextBtn = document.querySelector(".next");
        
        // Récupérer toutes les images qui sont cliquables (si tu ajoutes une classe .gallery-trigger par exemple, ou ici .gallery-item img)
        // Note: Dans ta page chrono, les images ont la classe .event-img. 
        // Si tu veux qu'elles s'ouvrent en grand, tu peux changer le sélecteur ci-dessous par '.event-img'
        const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
        
        let currentIndex = 0;

        const updateModalImage = (index) => {
            if (galleryImages.length === 0) return;
            const img = galleryImages[index];
            modalImg.src = img.src;
            // On utilise l'attribut alt comme légende si data-caption n'existe pas
            const caption = img.getAttribute('data-caption') || img.alt;
            captionText.innerHTML = caption ? caption : "";
            currentIndex = index;
        };

        // Activation du clic sur les images
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                modal.style.display = "flex"; // Flex pour centrer
                updateModalImage(index);
            });
        });

        // Navigation SUIVANT
        if(nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (galleryImages.length === 0) return;
                let newIndex = currentIndex + 1;
                if (newIndex >= galleryImages.length) newIndex = 0;
                updateModalImage(newIndex);
            });
        }

        // Navigation PRÉCÉDENT
        if(prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (galleryImages.length === 0) return;
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = galleryImages.length - 1;
                updateModalImage(newIndex);
            });
        }

        // Clavier
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === "flex" || modal.style.display === "block") {
                if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
                if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
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
    }

    /* 3. SCROLL REVEAL */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 30; // Seuil plus bas pour mobile
        
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
    // Appel initial au chargement
    revealOnScroll();
});