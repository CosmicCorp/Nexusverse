// Génère automatiquement un tableau de "tome2/1.png" à "tome2/134.png"
const pages = Array.from({ length: 134 }, (_, i) => `tome2/${i + 1}.png`);

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
document.getElementById('nextBtn').onclick = () => {
    if (isAnimating) return;
    const step = (window.innerWidth <= 768 || currentIndex === 0) ? 1 : 2;
    if (currentIndex + step < pages.length) {
        direction = 'next';
        currentIndex += step;
        renderBook();
    }
};

document.getElementById('prevBtn').onclick = () => {
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