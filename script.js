// --- 1. REFERENCIAS Y VARIABLES GLOBALES ---
const catImage = document.getElementById('cat-image');
const aiTextDisplay = document.getElementById('ai-text');
const counterDisplay = document.getElementById('counter');

let clickCount = 0;
let audioEnabled = false;
let currentTextTimeout = null; // Para controlar el timeout actual

const clickSound = new Audio('assets/audio/boop.wav'); 
clickSound.volume = 0.5; 

// Array ampliado de frases filosóficas de respaldo en español
const FALLBACK_PHRASES = [
    "Donde hay amor, hay vida. (Mahatma Gandhi)",
    "No es lo que te ocurre, sino cómo reaccionas lo que importa. (Epicteto)",
    "El futuro pertenece a quienes creen en la belleza de sus sueños. (Eleanor Roosevelt)",
    "Si no te equivocas de vez en cuando, significa que no lo estás intentando. (Woody Allen)",
    "El que sabe, sabe que ignora mucho. (José Saramago)",
    "El miedo es la ignorancia que se arma. (Anónimo)",
    "La felicidad es interior, no exterior; por lo tanto, no depende de lo que tenemos, sino de lo que somos. (Henry Van Dyke)",
    "El secreto del cambio es enfocar toda tu energía no en luchar contra lo viejo, sino en construir lo nuevo. (Sócrates)",
    "Lo que la oruga llama el fin del mundo, el maestro lo llama mariposa. (Richard Bach)",
    "Sé tú mismo; todos los demás ya están ocupados. (Oscar Wilde)",
    "Nunca dejes que el miedo a fallar te impida jugar el juego. (Babe Ruth)",
    "La mejor manera de predecir el futuro es creándolo. (Peter Drucker)",
    "Los problemas son oportunidades para demostrar lo que se sabe. (Duke Ellington)",
    "Nuestras dudas son traidoras y nos hacen perder el bien que a menudo podríamos ganar, por miedo a intentar. (William Shakespeare)",
    "La paciencia es amarga, pero su fruto es dulce. (Jean-Jacques Rousseau)",
    "La vida es un eco; lo que envías, vuelve. (Proverbio Chino)",
    "Caminante, no hay camino, se hace camino al andar. (Antonio Machado)",
    "Unas veces se gana, otras se aprende. (Anónimo)",
    "La única limitación es la que estableces en tu propia mente. (Napoleon Hill)",
    "La inteligencia consiste no solo en el conocimiento, sino también en la destreza de aplicar los conocimientos a la práctica. (Aristóteles)",
    "La simplicidad es la máxima sofisticación. (Leonardo da Vinci)",
    "El conocimiento habla, pero la sabiduría escucha. (Jimi Hendrix)",
    "El hombre que no comete errores usualmente no hace nada. (Edward Phelps)",
    "No es suficiente con adquirir sabiduría; es necesario usarla. (Cicerón)",
    "La vida es como montar en bicicleta. Para mantener el equilibrio, debes seguir avanzando. (Albert Einstein)",
    "Quien tiene un porqué para vivir, puede soportar casi cualquier cómo. (Friedrich Nietzsche)",
    "Aprende como si fueras a vivir para siempre, vive como si fueras a morir mañana. (Mahatma Gandhi)",
    "La envidia es una declaración de inferioridad. (Napoleón Bonaparte)",
    "El tiempo es la medida del movimiento, y lo que es eterno no se mueve. (Platón)",
    "No cuentes los días, haz que los días cuenten. (Muhammad Ali)",
    "La suerte favorece a la mente preparada. (Louis Pasteur)",
    "El verdadero viaje de descubrimiento no consiste en buscar nuevos paisajes, sino en tener nuevos ojos. (Marcel Proust)",
    "El optimismo es la fe que conduce al logro. (Helen Keller)",
    "La vida no se mide por el número de respiraciones que tomas, sino por los momentos que te quitan el aliento. (Maya Angelou)",
    "La meta no es el dinero. La meta es vivir la vida en tus propios términos. (Chris Brogan)",
    "La risa es el sol que ahuyenta el invierno del rostro humano. (Victor Hugo)",
    "Es difícil luchar contra un enemigo que tiene puestos avanzados en tu propia cabeza. (Sally Kempton)",
    "Si no te gusta algo, cámbialo. Si no puedes cambiarlo, cambia tu actitud. (Maya Angelou)",
    "No se trata de esperar a que pase la tormenta, sino de aprender a bailar bajo la lluvia. (Vivian Greene)",
    "El sabio querrá estar con el que es mejor que él. (Platón)",
    "Un libro es una prueba de que los hombres son capaces de hacer magia. (Carl Sagan)",
    "El valor es saber que no temer. (Platón)",
    "Lo que con mucho trabajo se adquiere, más se ama. (Aristóteles)",
    "El secreto para salir adelante es empezar. (Mark Twain)",
    "El hombre es la medida de todas las cosas. (Protágoras)",
    "Si no te atreves, no aciertas. (Anónimo)",
    "El éxito es ir de fracaso en fracaso sin perder el entusiasmo. (Winston Churchill)",
    "La conciencia tranquila es el mejor regalo. (Benito Juárez)",
    "La diferencia entre una persona inteligente y una sabia es que la inteligente resuelve problemas y la sabia los evita. (Albert Einstein)",
    "Cada día es una nueva oportunidad para cambiar tu vida. (Anónimo)",
    "La vida es un 10% lo que te pasa y un 90% cómo reaccionas a ello. (Charles R. Swindoll)",
    "No hay hombre más miserable que aquel que no tiene nada más que dinero. (Andrew Carnegie)",
    "Elige un trabajo que te guste y no tendrás que trabajar ni un día de tu vida. (Confucio)",
    "Si buscas resultados distintos, no hagas siempre lo mismo. (Albert Einstein)",
    "Solo sé que no sé nada. (Atribuida a Sócrates)",
    "El momento en que realmente te comprometes, el universo entero conspira a tu favor. (Goethe)",
    "Nunca moriría por mis creencias, porque podría estar equivocado. (Bertrand Russell)",
    "La imaginación es más importante que el conocimiento. (Albert Einstein)",
    "La peor lucha es la que no se hace. (Karl Marx)",
    "Tú debes ser el cambio que deseas ver en el mundo. (Mahatma Gandhi)",
    "En medio de la dificultad reside la oportunidad. (Albert Einstein)",
    "La victoria más difícil es la victoria sobre uno mismo. (Aristóteles)",
    "Los dos guerreros más poderosos son la paciencia y el tiempo. (León Tolstói)",
    "No es lo que tienes, sino cómo usas lo que tienes, lo que marca la diferencia. (Zig Ziglar)",
    "La felicidad no brota de la razón, sino de la imaginación. (Immanuel Kant)",
    "Solo los que se arriesgan a ir demasiado lejos pueden descubrir lo lejos que pueden llegar. (T.S. Eliot)",
    "Cree en ti mismo y todo lo que eres. Reconoce que hay algo dentro de ti que es más grande que cualquier obstáculo. (Christian D. Larson)",
    "La sencillez es la clave de toda verdadera elegancia. (Coco Chanel)",
    "La mente es como un paracaídas, solo funciona si se abre. (Albert Einstein)",
    "La crítica es a menudo un disfraz envidioso para la admiración. (Václav Havel)",
    "La acción es la clave fundamental para todo éxito. (Pablo Picasso)",
    "No te preocupes por los fracasos, preocúpate por las posibilidades que pierdes cuando ni siquiera lo intentas. (Jack Canfield)",
    "El hombre que se levanta es más grande que el que nunca ha caído. (Concepción Arenal)",
    "La sabiduría consiste en saber cuál es el siguiente paso; la virtud, en llevarlo a cabo. (David Starr Jordan)",
    "La verdadera libertad es imposible sin una mente liberada por la disciplina. (Mortimer J. Adler)",
    "El conocimiento es poder. (Francis Bacon)",
    "Alguien está sentado hoy a la sombra porque alguien plantó un árbol hace mucho tiempo. (Warren Buffett)",
    "Sé feliz en este momento, este momento es tu vida. (Omar Khayyam)",
    "Lo grandioso no sucede solo por impulso, es una sucesión de pequeñas cosas que se juntan. (Vincent van Gogh)",
    "No mires el reloj; haz lo que hace. Sigue adelante. (Sam Levenson)",
    "Aprender es descubrir que algo es posible. (Fritz Perls)",
    "El fracaso es éxito si aprendemos de él. (Malcolm Forbes)",
    "El que puede tener paciencia, puede tener lo que quiera. (Benjamin Franklin)",
    "La vida es una especie de bicicleta. Si quieres mantener el equilibrio, pedalea hacia delante. (Albert Einstein)",
    "La grandeza de un hombre se mide por la forma en que trata a los pequeños. (Thomas Carlyle)",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo. (Nelson Mandela)",
    "La mejor almohada para dormir es una conciencia tranquila. (Sócrates)",
    "Un viaje de mil millas comienza con un solo paso. (Lao Tzu)",
    "La diferencia entre lo ordinario y lo extraordinario es ese pequeño 'extra'. (Jimmy Johnson)",
    "No tienes que ser grande para empezar, pero tienes que empezar para ser grande. (Zig Ziglar)",
    "No hay caminos de flores hacia la gloria. (Jean de La Fontaine)",
    "El amor no se mira con los ojos, se mira con el corazón. (William Shakespeare)",
    "Lo único imposible es aquello que no intentas. (Anónimo)",
    "No es la especie más fuerte la que sobrevive, ni la más inteligente, sino la que mejor se adapta al cambio. (Charles Darwin)",
    "El propósito de la vida es encontrar tu don. El sentido de la vida es regalarlo. (Pablo Picasso)",
    "El arte de vencer se aprende en las derrotas. (Simón Bolívar)",
    "Para tener éxito, la actitud es tan importante como la habilidad. (Walter Scott)",
    "La vida no examinada no vale la pena vivirla. (Sócrates)",
    "La mayor gloria no es nunca caer, sino levantarse siempre. (Nelson Mandela)",
    "No hay que ir para atrás ni para tomar impulso. (Lao Tzu)",
    "La felicidad es una elección propia; elige ser feliz. (Anónimo)",
    "En toda historia de éxito encontrarás a alguien que tomó una decisión valiente. (Peter F. Drucker)",
    "El tiempo es la cosa más valiosa que una persona puede gastar. (Teofrasto)",
    "Hay una fuerza motriz más poderosa que el vapor, la electricidad y la energía atómica: la voluntad. (Albert Einstein)",
    "La belleza está en los ojos del que mira. (Oscar Wilde)"
];

// --- 2. FUNCIÓN PRINCIPAL DE CLIC ---

function handleClick() {
    if (!audioEnabled) {
        audioEnabled = true;
    }

    clickCount++;
    counterDisplay.textContent = `Clics: ${clickCount}`;
    
    updateCatSprite();
    displayPhilosophicalQuote();
    playClickSound();
}

/**
 * Calcula el tiempo de visualización basado en la longitud del texto
 */
function calculateDisplayTime(text) {
    const wordCount = text.split(' ').length;
    const baseTime = 10000; // 10 segundos base (aumentado)
    
    // Añadir 300ms por palabra después de las primeras 10 palabras
    if (wordCount > 10) {
        return baseTime + ((wordCount - 10) * 300);
    }
    
    return baseTime;
}

/**
 * Obtiene una frase filosófica en español de APIs confiables
 */
async function displayPhilosophicalQuote() {
    // Limpiar timeout anterior si existe
    if (currentTextTimeout) {
        clearTimeout(currentTextTimeout);
    }

    // Mostrar mensaje de carga
    aiTextDisplay.textContent = "El gato reflexiona...";
    aiTextDisplay.style.opacity = "1";

    try {
        // PRIMERA OPCIÓN: API de frases célebres en español
        const response = await fetch('https://frasedeldia.azurewebsites.net/api/phrase', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar la estructura de la respuesta
        if (data.phrase && typeof data.phrase === 'string') {
            showPhrase(data.phrase, data.author);
            return;
        } else if (data.text && typeof data.text === 'string') {
            showPhrase(data.text, data.author);
            return;
        } else {
            throw new Error("Estructura de API no reconocida");
        }
        
    } catch (error) {
        console.error("Error con API principal:", error);
        await trySpanishQuoteAPI();
    }
}

/**
 * Muestra la frase formateada correctamente
 */
function showPhrase(text, author = null) {
    let philosophicalText = text.substring(0, 250);
    if (text.length > 250) {
        philosophicalText += '...';
    }
    
    const displayText = author ? `"${philosophicalText}" - ${author}` : `"${philosophicalText}"`;
    const displayTime = calculateDisplayTime(displayText);
    
    // Mostrar la nueva frase
    aiTextDisplay.textContent = displayText;
    aiTextDisplay.style.opacity = "1";
    
    console.log(`Frase mostrada por ${displayTime/1000} segundos (${displayText.split(' ').length} palabras)`);
    
    // Programar el ocultamiento después del tiempo calculado
    currentTextTimeout = setTimeout(() => {
        aiTextDisplay.style.opacity = "0";
        currentTextTimeout = null;
    }, displayTime);
}

/**
 * Intenta con APIs alternativas en español
 */
async function trySpanishQuoteAPI() {
    try {
        // SEGUNDA OPCIÓN: API de quotes random con filtro español
        const response = await fetch('https://quote-api.alexandreramos8.repl.co/quotes/random');
        
        if (!response.ok) {
            throw new Error("API alternativa falló");
        }
        
        const data = await response.json();
        
        if (data.quote && data.author) {
            showPhrase(data.quote, data.author);
            return;
        } else {
            throw new Error("Estructura de API no reconocida");
        }
        
    } catch (backupError) {
        console.error("Error con API alternativa:", backupError);
        await tryFinalBackupAPI();
    }
}

/**
 * Último intento con API simple
 */
async function tryFinalBackupAPI() {
    try {
        // TERCERA OPCIÓN: API simple de frases motivacionales en español
        const response = await fetch('https://zenquotes.io/api/random');
        
        if (!response.ok) {
            throw new Error("API final falló");
        }
        
        const data = await response.json();
        
        if (data[0] && data[0].q) {
            showPhrase(data[0].q, data[0].a);
            return;
        } else {
            throw new Error("Estructura de API no reconocida");
        }
        
    } catch (finalError) {
        console.error("Todas las APIs fallaron. Usando fallback local.", finalError);
        useLocalFallback();
    }
}

/**
 * Usa las frases locales de respaldo
 */
function useLocalFallback() {
    const randomIndex = Math.floor(Math.random() * FALLBACK_PHRASES.length);
    const fallbackText = FALLBACK_PHRASES[randomIndex];
    const displayTime = calculateDisplayTime(fallbackText);
    
    aiTextDisplay.textContent = fallbackText;
    aiTextDisplay.style.opacity = "1";
    
    currentTextTimeout = setTimeout(() => {
        aiTextDisplay.style.opacity = "0";
        currentTextTimeout = null;
    }, displayTime);
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