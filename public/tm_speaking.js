const URL = 'https://teachablemachine.withgoogle.com/models/caPhX2AIr/';

let recognizer;
let targetNumber;
let score = 0;
let attempts = 0;
let isListening = false;

async function createModel() {
    const checkpointURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    recognizer = speechCommands.create(
        'BROWSER_FFT',
        undefined,
        checkpointURL,
        metadataURL
    );

    await recognizer.ensureModelLoaded();
}

// Función para generar un número aleatorio entre 1 y 10
function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

// Función para iniciar la evaluación
function startEvaluation() {
    if (isListening || attempts >= 5) return;

    targetNumber = generateRandomNumber();
    document.getElementById('number-card').innerText = targetNumber;
    document.getElementById('result-message').innerText = '';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('progress-bar-container').style.display = 'block';
    init(); 
}

async function init() {
    if (!recognizer) await createModel();

    isListening = true;

    recognizer.listen(result => {
        const scores = result.scores;
        const classLabels = recognizer.wordLabels();
        const maxScoreIndex = scores.indexOf(Math.max(...scores));
        const predictedLabel = classLabels[maxScoreIndex];

        updateProgressBar(scores[maxScoreIndex] * 100);

        // Verifica si la salida es correcta y si no es ruido de fondo
        if (attempts < 5 && predictedLabel === numberToWord(targetNumber)) {
            score += 20;
            attempts++;
            showResultMessage('¡Correcto! 🎉', true);
        } else if (attempts < 5 && predictedLabel !== 'Ruido de fondo') {
            attempts++;
            showResultMessage('Inténtalo de nuevo.', false);
        }

        if (attempts >= 5) {
            endEvaluation();
        } else {
            document.getElementById('next-button').style.display = 'inline-block';
        }

        recognizer.stopListening();
        isListening = false;
    }, {
        probabilityThreshold: 0.75
    });

    setTimeout(() => {
        if (isListening) {
            recognizer.stopListening();
            isListening = false;
            showResultMessage('No se detectó respuesta. Inténtalo de nuevo.', false);
            attempts++;
            if (attempts >= 5) endEvaluation();
            else document.getElementById('next-button').style.display = 'inline-block';
        }
    }, 5000);
}

// Función para iniciar el siguiente reto
function startNextChallenge() {
    document.getElementById('next-button').style.display = 'none';
    startEvaluation();
}

// Función para mostrar el mensaje de resultado
function showResultMessage(message, isCorrect) {
    const resultMessage = document.getElementById('result-message');
    resultMessage.innerText = message;
    resultMessage.className = '';
    resultMessage.classList.add(isCorrect ? 'correct' : 'incorrect');
}

// Actualiza la barra de progreso con el porcentaje de precisión
function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percentage}%`;
    progressBar.innerText = `${Math.round(percentage)}%`;
}

// Finaliza la evaluación y muestra el puntaje final
function endEvaluation() {
    document.getElementById('progress-bar-container').style.display = 'none';
    document.getElementById('start-button').style.display = 'inline-block';
    document.getElementById('next-button').style.display = 'none';
    showResultMessage(`Puntaje final: ${score}/100`, score > 0);
    score = 0;
    attempts = 0;
}

// Función para convertir números a palabras en inglés
function numberToWord(number) {
    const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    return numbers[number - 1];
}  
