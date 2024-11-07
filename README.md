# Sistema de Votación Escolar con Teachable Machine

Este proyecto incluye tres aplicaciones educativas basadas en Teachable Machine: un sistema de votación escolar, una evaluación de pronunciación de números en inglés y un juego de lateralidad. Cada aplicación está diseñada para enseñar a estudiantes de forma interactiva usando reconocimiento de imágenes, audio y posturas.

## Aplicaciones Incluidas

1. **Sistema de Votación Escolar**  
   Una aplicación que utiliza reconocimiento de imágenes para registrar y clasificar los votos entre los candidatos especificados. Los resultados de la votación se muestran en un gráfico de barras en tiempo real.

2. **Evaluación de Speaking**  
   Una aplicación de reconocimiento de audio para evaluar la pronunciación de los números del 1 al 10 en inglés, diseñada para estudiantes de preescolar. Al final de la evaluación, se muestra un puntaje basado en el número de aciertos.

3. **Juego de Lateralidad**  
   Un juego interactivo para enseñar la lateralidad (izquierda y derecha) a estudiantes de preescolar mediante reconocimiento de posturas.

## Tecnologías Utilizadas

- **Node.js**: Para la estructura del proyecto y la lógica de servidor.
- **Teachable Machine**: Para los modelos de reconocimiento de imágenes, audio y posturas.
- **TensorFlow.js**: Para ejecutar los modelos de Teachable Machine en el navegador.
- **Chart.js**: Para visualizar los resultados de la votación en un gráfico de barras.
- **Bootstrap**: Para una interfaz de usuario intuitiva y responsiva.

## Estructura del Proyecto

- `index.html`: Página principal que permite seleccionar entre las tres aplicaciones.
- `votacion.html`, `speaking.html`, `lateralidad.html`: Páginas individuales para cada aplicación.
- `tm_integration.js`: Script para el sistema de votación escolar.
- `tm_speaking.js`: Script para la evaluación de speaking.
- `lateralidad_game.js`: Script para el juego de lateralidad.
- `package.json`: Archivo de configuración de Node.js con las dependencias del proyecto.

## Instalación

Para instalar y ejecutar este proyecto, sigue estos pasos:

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git

2. Navega al directorio del proyecto:
    ```bash
   cd tu-repositorio
3.  Instala las dependencias del proyecto (asegúrate de tener Node.js instalado):
   
    ```bash
    npm install
Asegúrate de que los archivos model.json y metadata.json de Teachable Machine están en la ruta correcta (tm_model/), ya que estos archivos contienen el modelo de clasificación.

## Uso
- Abre el archivo index.html en tu navegador web.
- Permite el acceso a la cámara para que la aplicación pueda hacer el reconocimiento.
- Observa cómo se registran los votos automáticamente cuando se detectan las imágenes correspondientes.
- Los resultados de la votación se mostrarán en tiempo real en un gráfico de barras.

## Características
- **Votación Automática**: El sistema registra automáticamente los votos cuando detecta una imagen correspondiente a un candidato.
- **Alerta de Confirmación de Voto**: Al registrar un voto, aparece un mensaje de confirmación que se cierra automáticamente después de 5 segundos.
- **Bloqueo de Nuevos Votos Durante la Alerta**: Mientras la alerta de confirmación está activa, no se pueden registrar nuevos votos.
- **Gráfico de Resultados en Tiempo Real**: Un gráfico de barras se actualiza en tiempo real para mostrar los votos acumulados para cada candidato.

## Configuración de Teachable Machine

- **Para adaptar el sistema a tus necesidades**:
- Entrena un modelo en Teachable Machine para reconocer las imágenes de los candidatos.
- Exporta el modelo y coloca los archivos model.json y metadata.json en la carpeta tm_model/ de este proyecto.

## Contribución
Si deseas contribuir, por favor abre un pull request o crea un issue para sugerencias.

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
