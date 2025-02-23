// Función para manejar el movimiento de arrastre
function dragMoveListener(event) {
    const target = event.target;
    // Recupera las posiciones almacenadas o establece en 0 si no existen
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // Aplica la transformación de traducción
    target.style.transform = `translate(${x}px, ${y}px)`;

    // Actualiza los atributos de posición
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// Inicializa la interacción de arrastre para elementos con la clase 'draggable'
interact('.draggable').draggable({
    inertia: true, // Habilita inercia para un arrastre más fluido
    autoScroll: true, // Habilita el auto desplazamiento durante el arrastre
    listeners: {
        move: dragMoveListener, // Llama a la función durante el movimiento de arrastre
    }
});

// Define la zona de destino para soltar los elementos
interact('.dropzone').dropzone({
    accept: '.draggable', // Acepta elementos con la clase 'draggable'
    overlap: 0.75, // Requiere un 75% de superposición para considerar un drop
    ondropactivate: function (event) {
        event.target.classList.add('active'); // Añade clase activa al iniciar el drop
    },
    ondragenter: function (event) {
        const draggableElement = event.relatedTarget;
        const dropzoneElement = event.target;

        // Añade estilos de retroalimentación visual
        dropzoneElement.classList.add('active');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: function (event) {
        // Remueve estilos cuando el elemento sale de la zona de drop
        event.target.classList.remove('active');
        event.relatedTarget.classList.remove('can-drop');
    },
    ondrop: function (event) {
        const draggableElement = event.relatedTarget;
        const dropzoneElement = event.target;

        // Añade el elemento arrastrado a la zona de destino
        dropzoneElement.appendChild(draggableElement);

        // Resetea las transformaciones y posiciones
        draggableElement.style.transform = 'none';
        draggableElement.setAttribute('data-x', 0);
        draggableElement.setAttribute('data-y', 0);

        // Posiciona el elemento en las coordenadas donde se soltó
        draggableElement.style.left = `${event.offsetX - draggableElement.offsetWidth / 2}px`;
        draggableElement.style.top = `${event.offsetY - draggableElement.offsetHeight / 2}px`;

        // Habilita el redimensionamiento del elemento dentro de la zona de destino
        interact(draggableElement).gesturable({
            listeners: {
                move: function (event) {
                    let scale = (parseFloat(draggableElement.getAttribute('data-scale')) || 1) * (1 + event.ds);

                    // Limita el escalado para evitar tamaños demasiado pequeños o grandes
                    scale = Math.max(0.5, Math.min(scale, 2));

                    draggableElement.style.transform = `scale(${scale})`;
                    draggableElement.setAttribute('data-scale', scale);
                }
            }
        });
    },
    ondropdeactivate: function (event) {
        // Remueve la clase activa al finalizar el drop
        event.target.classList.remove('active');
    }
});
