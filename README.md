# Sistema de Votación Escolar con Teachable Machine

Este proyecto es una aplicación de votación escolar basada en reconocimiento de imágenes. Utiliza Teachable Machine de Google para reconocer a los votantes y clasificar sus votos entre los candidatos especificados. La aplicación muestra en tiempo real los resultados de la votación en un gráfico de barras.

## Tecnologías Utilizadas

- **Node.js**: Para la estructura del proyecto y la lógica de servidor.
- **Teachable Machine**: Para el modelo de reconocimiento de imágenes.
- **TensorFlow.js**: Para ejecutar el modelo de Teachable Machine en el navegador.
- **Chart.js**: Para visualizar los resultados de la votación en un gráfico de barras.

## Estructura del Proyecto

- `index.html`: Página principal del proyecto, donde se integra la webcam, los resultados, y el gráfico.
- `tm_integration.js`: Script principal para cargar el modelo de Teachable Machine, configurar la webcam, y manejar el proceso de votación.
- `script.js`: Contiene lógica adicional para el modelo de Teachable Machine.
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
