document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. MENU BURGER --- */
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animation du bouton burger (optionnel : transformer en croix)
        burger.innerHTML = navLinks.classList.contains('active') ? '&#10006;' : '&#9776;';
    });

    // Fermer le menu si on clique sur un lien
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.innerHTML = '&#9776;';
        });
    });

    /* --- 2. SCROLL REVEAL ANIMATION --- */
    // On ajoute la classe .reveal à tous les éléments qu'on veut animer
    const revealElements = document.querySelectorAll('.character-icon, h2');
    
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Distance du bas avant apparition

        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Déclencher une fois au chargement pour afficher les éléments du haut
    revealOnScroll();

    /* --- 3. ACTIVE LINK HIGHLIGHT (Section Nav) --- */
    // Met en surbrillance le bouton de filtre correspondant à la section visible
    const sections = document.querySelectorAll('h2[id]');
    const navItems = document.querySelectorAll('.section-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // On ajoute un offset pour la navbar fixe (~150px)
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
});