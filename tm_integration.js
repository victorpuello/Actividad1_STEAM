// tm_integration.js

// URLs locales del modelo y los metadatos
const modelURL = './tm_model/model.json';
const metadataURL = './tm_model/metadata.json';

console.log("Model URL:", modelURL);
console.log("Metadata URL:", metadataURL);

let model, webcam, labelContainer, maxPredictions;
let votes = {
    'Candidato1': 0,
    'Candidato2': 0,
    'Voto_En_Blanco': 0
}; // Objeto para almacenar los votos de cada candidato y del voto en blanco
let currentPrediction = null;  // Predicción actual del modelo
let chart = null;  // Objeto para el gráfico de resultados
let votingEnabled = true; // Variable para controlar el registro de votos

// Verifica si el navegador es iOS (fix para problemas con iOS)
let isIos = false;
if (window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('iPad') > -1) {
    isIos = true;
}

// Verificar acceso a la cámara utilizando navigator.mediaDevices.getUserMedia
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        console.log("Cámara disponible y acceso concedido.");
        stream.getTracks().forEach(track => track.stop());
        init(); // Inicializar el modelo y la webcam
    })
    .catch((error) => {
        console.error("No se pudo acceder a la cámara:", error);
    });

// Inicializar el modelo y configurar la webcam
async function init() {
    try {
        console.log("Iniciando la carga del modelo...");
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Modelo cargado con éxito.");

        maxPredictions = model.getTotalClasses();
        labelContainer = document.getElementById('label-container');
        if (!labelContainer) {
            console.error("No se encontró el elemento con id 'label-container'. Verifica el HTML.");
            return;
        }

        for (let i = 0; i < maxPredictions; i++) {
            const labelElement = document.createElement('div');
            labelContainer.appendChild(labelElement);
        }

        const flip = true;
        const width = 320;
        const height = 240;
        webcam = new tmImage.Webcam(width, height, flip);
        await webcam.setup();
        await webcam.play();
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        initChart();
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("Error al cargar el modelo o la webcam:", error);
    }
}

// Función para el bucle de predicción
async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Ejecutar la predicción del modelo
async function predict() {
    if (!labelContainer) {
        console.error("labelContainer no está definido.");
        return;
    }

    let prediction;
    prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    currentPrediction = prediction.reduce((prev, curr) => (prev.probability > curr.probability ? prev : curr));

    if (currentPrediction.probability >= 0.97) {
        voteForCandidate(currentPrediction.className);
        updateResults();
        updateChart();
    }
}

// Función para votar por el candidato actual
function voteForCandidate(candidateName) {
    if (!votingEnabled) {
        console.log("Espere hasta que la alerta desaparezca para registrar otro voto.");
        return; // No permite registrar el voto si la alerta está activa
    }

    console.log(`dato que entró: ${candidateName}`);
    if (votes.hasOwnProperty(candidateName)) {
        votes[candidateName] += 1;
        console.log(`Voto registrado para: ${candidateName}`);
        
        // Muestra el mensaje temporal y desactiva el registro de votos
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) {
            // Crear el contenedor de alerta si no existe
            const alertDiv = document.createElement('div');
            alertDiv.id = 'alert-container';
            alertDiv.style.cssText = 'display: block; padding: 10px; background-color: #4CAF50; color: white; margin-top: 20px; text-align: center; border-radius: 5px;';
            document.body.appendChild(alertDiv);
        }
        
        alertContainer.textContent = `Voto registrado para ${candidateName}. Ahora puedes registrar otro voto.`;
        alertContainer.style.display = 'block';
        votingEnabled = false; // Desactiva la votación temporalmente

        // Oculta el mensaje después de 5 segundos y habilita el registro de votos nuevamente
        setTimeout(() => {
            alertContainer.style.display = 'none';
            votingEnabled = true; // Habilita la votación de nuevo
        }, 5000);
    } else {
        console.warn(`Candidato no válido: ${candidateName}`);
    }
}

// Función para actualizar los resultados en el DOM
function updateResults() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Limpiar los resultados previos

    for (const [candidate, count] of Object.entries(votes)) {
        const resultElement = document.createElement('div');
        resultElement.textContent = `${candidate}: ${count} votos`;
        resultsContainer.appendChild(resultElement);
    }
}

// Inicializar el gráfico de resultados
function initChart() {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    if (!ctx) {
        console.error("No se pudo encontrar el elemento canvas para el gráfico.");
        return;
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(votes),
            datasets: [{
                label: 'Número de Votos',
                data: Object.values(votes),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Actualizar el gráfico de resultados
function updateChart() {
    if (chart && chart.data && chart.data.datasets && chart.data.datasets[0]) {
        chart.data.labels = Object.keys(votes);
        chart.data.datasets[0].data = Object.values(votes);
        chart.update();
    } else {
        console.error("El gráfico aún no está inicializado.");
    }
}
