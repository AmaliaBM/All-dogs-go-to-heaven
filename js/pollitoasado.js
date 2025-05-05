class PollitoAsado {

    /*Los pollitos asados deben:

    Entrar por la derecha y moverse a la izquierda (como las nubes).

    No interferir con la lógica ni la frecuencia de aparición de las nubes.

    Ser recolectables por el personaje principal (suman puntos).

    Tener su propio control de aparición y destrucción, separado del de las nubes.*/

        constructor(gameBoxNode, posY) {
            this.node = document.createElement("img");
            this.node.src = "./images-sin-fondo/pollitoasado-8bit.png"; // imagen 

            // Añadirla al DOM dentro del gameBox
            this.gameBoxNode = gameBoxNode;
            this.gameBoxNode.append(this.node);
    
            this.x = this.gameBoxNode.offsetWidth;
            this.y = posY;
            this.width = 80;
            this.height = 60;
            this.speed = 2.5;
    
            // Aplicar estilo al DOM
            this.node.style.position = "absolute";
            this.node.style.width = `${this.width}px`;
            this.node.style.height = `${this.height}px`;
            this.node.style.left = `${this.x}px`;
            this.node.style.top = `${this.y}px`;
        }
      //Añadir metodo de movimiento
        automaticMovement() {
            this.x -= this.speed;
            this.node.style.left = `${this.x}px`;
        }
    
        remove() {
            this.node.remove();
        }   
  
}