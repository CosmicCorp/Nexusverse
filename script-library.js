document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. MENU BURGER (Comme la page perso) --- */
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

    /* --- 3. SCROLL REVEAL ANIMATION --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 50; 

        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger au chargement
});