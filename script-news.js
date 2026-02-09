document.addEventListener('DOMContentLoaded', () => {
    
    

    /* --- 2. SCROLL REVEAL ANIMATION --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        // Fait apparaître l'élément quand il est à 100px du bas de l'écran
        const elementVisible = 100; 

        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Déclencher une fois au chargement
});
document.addEventListener('DOMContentLoaded', () => {
    
    // ... (Garde ton code existant pour le menu Burger et le Scroll Reveal ici) ...

    /* --- 3. GESTION DE LA MODALE --- */
    const modalOverlay = document.getElementById('article-modal');
    const modalClose = document.querySelector('.modal-close');
    const openButtons = document.querySelectorAll('.open-modal');

    // Éléments internes de la modale à remplir
    const mTitle = document.getElementById('modal-title');
    const mDate = document.getElementById('modal-date');
    const mImg = document.getElementById('modal-img');
    const mText = document.getElementById('modal-text');

    // Fonction pour ouvrir
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le lien de suivre href="#"

            // Récupérer les données depuis les attributs HTML du bouton
            const title = btn.getAttribute('data-title');
            const date = btn.getAttribute('data-date');
            const img = btn.getAttribute('data-img');
            const fullText = btn.getAttribute('data-full-text');

            // Remplir la modale
            mTitle.textContent = title;
            mDate.textContent = date;
            mImg.src = img;
            mText.innerHTML = fullText; // innerHTML permet d'utiliser des <br> dans le texte

            // Afficher
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Bloque le scroll de la page derrière
        });
    });

    // Fonction pour fermer
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Réactive le scroll
    };

    // Fermer au clic sur la croix
    modalClose.addEventListener('click', closeModal);

    // Fermer au clic en dehors de la boîte (sur le fond sombre)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Fermer avec la touche Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});
const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

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

    /* --- 2. GESTION DES CATÉGORIES (Accordéon) --- */
    const headers = document.querySelectorAll('.category-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-target');
            const grid = document.getElementById(targetId);
            const toggle = header.querySelector('.category-toggle');

            // Basculer la classe 'hidden'
            if (grid.classList.contains('hidden')) {
                grid.classList.remove('hidden');
                toggle.textContent = '−'; // Signe moins
            } else {
                grid.classList.add('hidden');
                toggle.textContent = '+'; // Signe plus
            }
        });
    });