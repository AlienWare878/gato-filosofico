// --- 1. REFERENCIAS Y VARIABLES GLOBALES ---
const catImage = document.getElementById('cat-image');
const aiTextDisplay = document.getElementById('ai-text');
const counterDisplay = document.getElementById('counter');

let clickCount = 0;
let audioEnabled = false;

const clickSound = new Audio('assets/audio/boop.wav'); 
clickSound.volume = 0.5; 

// Array de frases filosóficas de respaldo en español
const FALLBACK_PHRASES = [
    "El único conocimiento verdadero es saber que no sabes nada.",
    "No es la carga lo que te abruma, sino cómo la llevas.",
    "La vida es lo que pasa mientras estás ocupado haciendo otros planes.",
    "El sabio no dice todo lo que piensa, pero siempre piensa todo lo que dice.",
    "La mayor declaración de amor es la que no se hace; el hombre que siente mucho, habla poco.",
    "No hay caminos para la paz; la paz es el camino.",
    "Conócete a ti mismo y conocerás el universo y los dioses.",
    "La duda es el principio de la sabiduría."
];

// --- 2. FUNCIÓN PRINCIPAL DE CLIC ---

function handleClick() {
    if (!audioEnabled) {
        audioEnabled = true;
    }

    clickCount++;
    counterDisplay.textContent = `Clics: ${clickCount}`;
    
    updateCatSprite();
    
    // Función de contenido dinámico (API filosófica o Fallback)
    displayPhilosophicalQuote();
    
    playClickSound();
}

/**
 * Obtiene una frase filosófica de la API o utiliza un fallback en caso de error.
 */
async function displayPhilosophicalQuote() {
    // Aumentamos significativamente el tiempo de visualización
    const DISPLAY_TIME = 8000; // 8 segundos para frases filosóficas

    aiTextDisplay.textContent = "El gato reflexiona...";
    aiTextDisplay.style.opacity = 1;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        // Llamada a la API de frases filosóficas
        const response = await fetch('https://api.filosofia.digital/v1/frases/random', { 
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificación de la respuesta de la API filosófica
        if (!data.frase || typeof data.frase !== 'string') {
            throw new Error("Respuesta API vacía o inválida.");
        }

        // Formatear el texto filosófico (más caracteres para frases largas)
        let philosophicalText = data.frase.substring(0, 200);
        if (data.frase.length > 200) {
             philosophicalText += '...';
        }
        
        // Muestra la frase filosófica obtenida
        aiTextDisplay.textContent = `"${philosophicalText}"`;
        
        // Oculta después de DISPLAY_TIME (8 segundos)
        setTimeout(() => {
            aiTextDisplay.style.opacity = 0;
        }, DISPLAY_TIME);
        
    } catch (error) {
        // --- BLOQUE DE ERROR/FALLBACK ---
        console.error("Error al obtener frase filosófica. Usando Fallback.", error);
        
        // Intentar con API alternativa de frases célebres
        await tryAlternativeQuoteAPI();
    }
}

/**
 * Intenta con una API alternativa de frases célebres
 */
async function tryAlternativeQuoteAPI() {
    const DISPLAY_TIME = 8000; // 8 segundos también para el fallback

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // API alternativa - Quotable (tiene contenido en español)
        const response = await fetch('https://api.quotable.io/random?maxLength=120', { 
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error("API alternativa falló");
        }
        
        const data = await response.json();
        
        if (data.content) {
            let alternativeText = data.content.substring(0, 180);
            if (data.content.length > 180) {
                alternativeText += '...';
            }
            aiTextDisplay.textContent = `"${alternativeText}" - ${data.author || 'Anónimo'}`;
        } else {
            throw new Error("Contenido alternativo no disponible");
        }
        
    } catch (backupError) {
        console.error("Todas las APIs fallaron. Usando fallback local.", backupError);
        
        // Usar frase filosófica de respaldo aleatoria
        const randomIndex = Math.floor(Math.random() * FALLBACK_PHRASES.length);
        aiTextDisplay.textContent = `"${FALLBACK_PHRASES[randomIndex]}"`;
    }
    
    setTimeout(() => {
        aiTextDisplay.style.opacity = 0;
    }, DISPLAY_TIME);
}

// --- 3. FUNCIONES DE LÓGICA (Mantenidas) ---

function updateCatSprite() {
    if (clickCount > 0 && clickCount % 50 === 0) {
        catImage.src = 'assets/img/cat-glitch.png';
        setTimeout(() => { 
            catImage.src = 'assets/img/cat-neutral.png';
        }, 300);
    
    } else if (clickCount % 2 === 1) {
        catImage.src = 'assets/img/cat-reaction.png';
    } else {
        catImage.src = 'assets/img/cat-neutral.png';
    }
}

function playClickSound() {
    if (audioEnabled) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

// --- 4. INICIALIZACIÓN ---
catImage.addEventListener('click', handleClick);
counterDisplay.textContent = `Clics: ${clickCount}`;