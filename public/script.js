let model, webcam, countA = 0, countB = 0, countBlank = 0;

// Función para cargar el modelo
async function loadModel() {
    // Cargar el modelo entrenado y los metadatos desde los archivos locales
    model = await tmImage.load('./model.json', './metadata.json');

    // Configurar la webcam
    const flip = true; // Habilita o deshabilita el efecto espejo en la webcam
    webcam = new tmImage.Webcam(224, 224, flip); // ancho, alto, flip
    await webcam.setup(); // Solicita permiso para acceder a la webcam
    await webcam.play();  // Empieza a reproducir la webcam

    // Agregar la webcam al DOM
    document.getElementById('webcam').appendChild(webcam.canvas);

    // Iniciar el bucle de predicción
    window.requestAnimationFrame(loop);
}

// Función principal de detección y conteo
async function loop() {
    webcam.update(); // Actualiza la imagen de la webcam
    const prediction = await model.predict(webcam.canvas);

    // Clasificar y contar votos
    if (prediction[0].probability > 0.8) { // Si "Candidato A" es detectado
        countA++;
        document.getElementById('countA').innerText = countA;
    } else if (prediction[1].probability > 0.8) { // Si "Candidato B" es detectado
        countB++;
        document.getElementById('countB').innerText = countB;
    } else if (prediction[2].probability > 0.8) { // Si "Voto en Blanco" es detectado
        countBlank++;
        document.getElementById('countBlank').innerText = countBlank;
    }

    // Continuar el bucle de predicción
    window.requestAnimationFrame(loop);
}

// Cargar el modelo al abrir la página
loadModel();

