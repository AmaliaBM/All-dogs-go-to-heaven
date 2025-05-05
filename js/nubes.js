class Nube {

    /*Las nubes deben:

    Entrar por la derecha y moverse a la izquierda (como los pollitos).

    No interferir con la lógica ni la frecuencia de aparición de los pollitos.

    Crear colisión con el personaje principal, si colisionan personaje principal (London) y nubes, entonces se pierde el juego.

    Tener su propio control de aparición y destrucción, separado del de los pollitos.*/

    constructor(gameBoxNode, posY) {
        // Crear imagen de la nube
        this.node = document.createElement("img");
        this.node.src = "./images-sin-fondo/nube-horizontal-8bits.png"; // ruta de imagen

        // Añadirla al DOM dentro del gameBox
        this.gameBoxNode = gameBoxNode;
        this.gameBoxNode.append(this.node);

        // Posiciones y dimensiones
        this.x = this.gameBoxNode.offsetWidth; // entra desde la derecha del juego
        this.y = posY;
        this.width = 80;
        this.height = 60;
        this.speed = 2.5;

        // Estilo del nodo en pantalla
        this.node.style.width = `${this.width}px`;
        this.node.style.height = `${this.height}px`;
        this.node.style.position = "absolute";
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
    }

    // Método de movimiento automático
    automaticMovement() {
        this.x -= this.speed;
        this.updatePosition();
    }

    // Método para actualizar posición en pantalla
    updatePosition() {
        this.node.style.left = `${this.x}px`;
    }

    // Método para eliminar el nodo del DOM
    remove() {
        this.node.remove();
    }
}
