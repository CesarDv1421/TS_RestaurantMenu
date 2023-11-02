// Esta función se llamará al hacer clic en el botón
const copyToClipboard = (text: string) => {
  // Intenta copiar el texto al portapapeles
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('Texto copiado al portapapeles: ' + text);
    })
    .catch((err) => {
      console.error('Error al copiar al portapapeles: ' + err);
    });
};

export default copyToClipboard;
