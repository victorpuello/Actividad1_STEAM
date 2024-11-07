const URL = 'https://teachablemachine.withgoogle.com/models/re0Z7Wi9B/';

let model, webcam, ctx, labelContainer, maxPredictions;
let currentChallenge = "";
let score = 0;
let detectionCounter = 0; // Contador de detección consistente
let gameRunning = false; // Variable para indicar si el juego está en curso
let instructions = [
    { text: "Levanta la mano derecha", label: "Mano_derecha" },
    { text: "Levanta la mano izquierda", label: "Mano_izquierda" }
];
const REQUIRED_DETECTION_COUNT = 30; // Número de frames consistentes para considerar el movimiento correcto

// Función de inicialización
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargar el modelo
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Configurar la webcam
    webcam = new tmPose.Webcam(400, 400, true);
    await webcam.setup();
    await webcam.play();
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Configurar el canvas
    const canvas = document.getElementById("canvas");
    canvas.width = 400;
    canvas.height = 400;
    ctx = canvas.getContext("2d");

    startChallenge(); // Inicia el primer desafío
    gameRunning = true;
    toggleButtons(); // Muestra y oculta los botones correspondientes
    window.requestAnimationFrame(loop);
}

// Seleccionar y mostrar un nuevo desafío
function startChallenge() {
    const challenge = instructions[Math.floor(Math.random() * instructions.length)];
    currentChallenge = challenge.label;
    detectionCounter = 0; // Reinicia el contador al iniciar un nuevo desafío
    document.getElementById("feedback").innerText = `Instrucción: ${challenge.text}`;
    document.getElementById("feedback").style.color = "black";
    document.getElementById("feedback").style.backgroundColor = "transparent";
}

// Bucle de predicción
async function loop() {
    if (!gameRunning) return; // Si el juego no está en curso, detener el loop
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Función de predicción de pose
async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    let maxProbability = 0;
    let detectedPose = "";

    // Determina la postura detectada con la probabilidad más alta
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > maxProbability) {
            maxProbability = prediction[i].probability;
            detectedPose = prediction[i].className;
        }
    }

    // Verifica si la postura detectada coincide con el desafío y la probabilidad es del 99% o más
    if (maxProbability >= 0.99 && detectedPose === currentChallenge) {
        detectionCounter++; // Incrementa el contador de detección consistente

        // Solo registra el movimiento si ha sido detectado consistentemente durante el tiempo requerido
        if (detectionCounter >= REQUIRED_DETECTION_COUNT) {
            updateScore();
            document.getElementById("feedback").innerText = `¡Felicitaciones! Has hecho correctamente: ${currentChallenge}`;
            document.getElementById("feedback").style.color = "white";
            document.getElementById("feedback").style.backgroundColor = "green";

            // Inicia un nuevo reto después de 3 segundos y reinicia el contador
            setTimeout(startChallenge, 3000);
        }
    } else {
        // Reinicia el contador si la pose detectada no coincide o la probabilidad es menor al 99%
        detectionCounter = 0;
        document.getElementById("feedback").innerText = `Sigue intentando: ${currentChallenge}`;
        document.getElementById("feedback").style.color = "red";
        document.getElementById("feedback").style.backgroundColor = "transparent";
    }

    drawPose(pose);
}

// Función para dibujar puntos clave y esqueleto en el canvas
function drawPose(pose) {
    ctx.clearRect(0, 0, 400, 400);
    ctx.drawImage(webcam.canvas, 0, 0);

    if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
}

// Función para actualizar el puntaje
function updateScore() {
    score += 10;
    document.getElementById("score-count").innerText = score;
}

// Alterna la visibilidad de los botones "Empezar Juego" y "Terminar Juego"
function toggleButtons() {
    document.getElementById("start-button").style.display = gameRunning ? "none" : "inline-block";
    document.getElementById("stop-button").style.display = gameRunning ? "inline-block" : "none";
}

// Función para terminar el juego y regresar a la pantalla inicial
function stopGame() {
    gameRunning = false;
    toggleButtons(); // Muestra el botón "Empezar Juego" y oculta "Terminar Juego"
    webcam.stop();
    document.getElementById("feedback").innerText = "Juego terminado. Presiona 'Empezar Juego' para reiniciar.";
    score = 0;
    document.getElementById("score-count").innerText = score;
}

// Asignar eventos a los botones
document.getElementById("start-button").addEventListener("click", init);
document.getElementById("stop-button").addEventListener("click", stopGame);
