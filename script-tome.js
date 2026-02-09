const pages = [
    "tome1/1.png", "tome1/2.png", "tome1/3.png", "tome1/4.png", "tome1/5.png",
    "tome1/6.png", "tome1/7.png", "tome1/8.png", "tome1/9.png", "tome1/10.png",
    "tome1/11.png", "tome1/12.png", "tome1/13.png", "tome1/14.png", "tome1/15.png",
    "tome1/16.png", "tome1/17.png", "tome1/18.png", "tome1/19.png", "tome1/20.png",
    "tome1/21.png", "tome1/22.png", "tome1/23.png", "tome1/24.png", "tome1/25.png",
    "tome1/26.png", "tome1/27.png", "tome1/28.png", "tome1/29.png", "tome1/30.png",
    "tome1/31.png", "tome1/32.png", "tome1/33.png", "tome1/34.png", "tome1/35.png",
    "tome1/36.png", "tome1/37.png", "tome1/38.png", "tome1/39.png", "tome1/40.png",
    "tome1/41.png", "tome1/42.png", "tome1/43.png", "tome1/44.png", "tome1/45.png",
    "tome1/46.png", "tome1/47.png", "tome1/48.png", "tome1/49.png", "tome1/50.png",
    "tome1/51.png", "tome1/52.png", "tome1/53.png", "tome1/54.png", "tome1/55.png",
    "tome1/56.png", "tome1/57.png", "tome1/58.png", "tome1/59.png", "tome1/60.png",
    "tome1/61.png", "tome1/62.png", "tome1/63.png", "tome1/64.png", "tome1/65.png",
    "tome1/66.png", "tome1/67.png", "tome1/68.png", "tome1/69.png", "tome1/70.png",
    "tome1/71.png", "tome1/72.png", "tome1/73.png", "tome1/74.png", "tome1/75.png",
    "tome1/76.png", "tome1/77.png", "tome1/78.png", "tome1/79.png", "tome1/80.png",
    "tome1/81.png", "tome1/82.png", "tome1/83.png", "tome1/84.png", "tome1/85.png",
    "tome1/86.png", "tome1/87.png", "tome1/88.png", "tome1/89.png", "tome1/90.png",
    "tome1/91.png", "tome1/92.png", "tome1/93.png", "tome1/94.png", "tome1/95.png",
    "tome1/96.png", "tome1/97.png", "tome1/98.png", "tome1/99.png", "tome1/100.png",
    "tome1/101.png", "tome1/102.png", "tome1/103.png"
];

let currentIndex = 0;
let lastTap = 0;
let direction = 'next';
let isAnimating = false;

const book = document.getElementById('book');
const progressBar = document.getElementById('progressBar');
const pageIndicator = document.getElementById('pageIndicator');
const pageSelect = document.getElementById('pageSelect');

// Initialisation du menu déroulant
pages.forEach((_, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = `P. ${i + 1}`;
    pageSelect.appendChild(opt);
});

function updateProgress() {
    const total = pages.length;
    const isMobile = window.innerWidth <= 768;
    // Calcul de la progression selon le mode d'affichage
    const currentPos = (currentIndex === 0 || isMobile) ? currentIndex + 1 : currentIndex + 2;
    const percent = (Math.min(currentPos, total) / total) * 100;
    progressBar.style.width = percent + "%";
}

function renderBook() {
    if (isAnimating) return;
    isAnimating = true;

    // 1. Déclencher l'animation de sortie
    const flipClass = direction === 'next' ? 'flip-next' : 'flip-prev';
    book.classList.add(flipClass);

    // 2. Changer le contenu à mi-chemin de la transition (300ms)
    setTimeout(() => {
        book.innerHTML = '';
        const isMobile = window.innerWidth <= 768;

        if (currentIndex === 0 || isMobile) {
            createPage(currentIndex);
            pageIndicator.innerText = `${currentIndex + 1} / ${pages.length}`;
        } else {
            createPage(currentIndex);
            if (pages[currentIndex + 1]) {
                createPage(currentIndex + 1);
                pageIndicator.innerText = `${currentIndex + 1}-${currentIndex + 2} / ${pages.length}`;
            }
        }

        updateProgress();
        pageSelect.value = currentIndex;
        
        // 3. Préparer l'entrée
        book.classList.remove(flipClass);
        book.classList.add('flip-enter');
        
        // Force le reflow pour que l'animation d'entrée soit visible
        void book.offsetWidth; 

        // 4. Lancer l'animation d'entrée
        requestAnimationFrame(() => {
            book.classList.remove('flip-enter');
            // On libère le verrou d'animation un peu avant la fin pour plus de fluidité
            setTimeout(() => { isAnimating = false; }, 300);
        });

    }, 300); 
}

function createPage(index) {
    const container = document.createElement('div');
    container.className = 'page-container';
    
    const img = document.createElement('img');
    img.src = pages[index];
    
    // Zoom tactile (Double tap)
    img.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            e.preventDefault();
            img.classList.toggle('zoomed');
        }
        lastTap = now;
    });
    // Zoom souris (Double clic)
    img.addEventListener('dblclick', () => img.classList.toggle('zoomed'));

    container.appendChild(img);
    book.appendChild(container);
}

// Contrôles de Navigation
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

nextBtn.onclick = () => {
    if (isAnimating) return;
    const step = (window.innerWidth <= 768 || currentIndex === 0) ? 1 : 2;
    if (currentIndex + step < pages.length) {
        direction = 'next';
        currentIndex += step;
        renderBook();
    }
};

prevBtn.onclick = () => {
    if (isAnimating) return;
    const step = (window.innerWidth <= 768 || currentIndex <= 2) ? 1 : 2;
    if (currentIndex - step >= 0) {
        direction = 'prev';
        currentIndex -= step;
        renderBook();
    }
};

pageSelect.onchange = (e) => {
    const newIndex = parseInt(e.target.value);
    if (newIndex === currentIndex) return;
    direction = newIndex > currentIndex ? 'next' : 'prev';
    currentIndex = newIndex;
    renderBook();
};

document.getElementById('fullscreenBtn').onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

// Ré-affichage lors du redimensionnement (passage PC/Mobile)
window.onresize = () => {
    renderBook();
};

// Premier affichage
renderBook();

// ==========================================
// GESTION DU SWIPE TACTILE (AJOUT MOBILE)
// ==========================================

let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; // Seuil minimum pour valider un swipe
const readerContainer = document.getElementById('readerContainer');

// Capture le début du toucher
readerContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

// Capture la fin du toucher et calcule la direction
readerContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    // 1. Si on est déjà en train d'animer, on ne fait rien
    if (isAnimating) return;

    // 2. Si une image est zoomée, on désactive le swipe de page 
    // pour permettre à l'utilisateur de se déplacer DANS l'image.
    if (document.querySelector('.zoomed')) return;

    const distance = touchEndX - touchStartX;

    // Vérifie si le mouvement est assez long
    if (Math.abs(distance) > minSwipeDistance) {
        if (distance < 0) {
            // Glissement vers la GAUCHE -> Page SUIVANTE
            nextBtn.click();
        } else {
            // Glissement vers la DROITE -> Page PRÉCÉDENTE
            prevBtn.click();
        }
    }
}