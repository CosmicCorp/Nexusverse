document.addEventListener('DOMContentLoaded', () => {
    // 1. Définition des chemins vers tes icônes SVG
    // Les clés doivent correspondre exactement au texte de tes liens HTML
    const navIcons = {
        'Personnages': 'icons/characters.svg',
        'Bibliothèque': 'icons/library.svg',
        'Galeries': 'icons/galleries.svg',
        'Groupes': 'icons/group.svg',
        'Actus': 'icons/news.svg',
    };

    // 2. Injection dynamique du CSS pour l'animation
    const style = document.createElement('style');
    style.innerHTML = `
        .nav-links a {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 5px 0;
        }
        
        /* Style de base des petites icônes */
        .nav-icon {
            width: 24px;
            height: 24px;
            transition: var(--transition);
            filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.4));
            flex-shrink: 0;
        }

        /* Animation de l'icône au survol */
        .nav-links a:hover .nav-icon,
        .nav-links a.active .nav-icon {
            filter: drop-shadow(0 0 12px var(--nexus-cyan));
            transform: scale(1.1);
        }

        /* Configuration du texte masqué par défaut */
        .nav-text {
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            white-space: nowrap;
            transform: translateX(-15px);
            /* Transition fluide basée sur tes variables */
            transition: max-width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
                        opacity 0.3s ease,
                        transform 0.4s ease,
                        margin-left 0.4s ease;
        }

        /* Révélation du texte au survol ou sur la page active */
        .nav-links a:hover .nav-text,
        .nav-links a.active .nav-text {
            max-width: 150px; /* Assez grand pour révéler le mot complet */
            opacity: 1;
            transform: translateX(0);
            margin-left: 15px; /* ESPACEMENT AUGMENTÉ ICI (15px au lieu de 10px) */
        }

        /* --- CORRECTION POUR LE MENU MOBILE --- */
        /* Sur mobile, on désactive le hover et on affiche tout pour l'ergonomie */
        @media (max-width: 768px) {
            .nav-text {
                max-width: none;
                opacity: 1;
                transform: translateX(0);
                margin-left: 20px; /* ESPACEMENT AUGMENTÉ ICI (20px au lieu de 15px) */
            }
            .nav-links a {
                justify-content: flex-start;
                width: 100%;
                padding: 10px 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // 3. Remplacement dynamique du contenu de la navbar
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const textContent = link.textContent.trim();

        // Si le texte du lien correspond à une de nos icônes
        if (navIcons[textContent]) {
            // On vide le contenu actuel (le texte brut)
            link.innerHTML = '';

            // On injecte l'icône SVG
            const img = document.createElement('img');
            img.src = navIcons[textContent];
            img.alt = `Icône ${textContent}`;
            img.className = 'nav-icon';

            // On injecte le texte enveloppé dans un span pour l'animer
            const span = document.createElement('span');
            span.className = 'nav-text';
            span.textContent = textContent;

            // On assemble les nouveaux éléments dans la balise <a>
            link.appendChild(img);
            link.appendChild(span);
        }
    });
});