function loadImage() {
    const fileInput = document.getElementById('file-input');
    const imageContainer = document.getElementById('image-container');
  
    const file = fileInput.files[0];
  
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          canvas.width = 200; // Ancho deseado
          canvas.height = 200; // Alto deseado
          ctx.drawImage(img, 0, 0, 200, 200); // Dibuja la imagen en el canvas con el tamaño deseado
  
          const scaledImage = new Image();
          scaledImage.src = canvas.toDataURL(); // La imagen se convierte en base64 para mostrarla en el contenedor
  
          imageContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar la nueva imagen
          imageContainer.appendChild(scaledImage); // Mostrar la imagen escalada en el contenedor
        };
      };
  
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  }
  