class London {
    /*
      Clase London (personaje principal):
      - Aparece en el lado izquierdo de la pantalla.
      - Puede moverse arriba y abajo mediante las flechas.
      - Interactúa con otros elementos como nubes y comida.
    */
  
    constructor(gameBoxNode) {
      // === REFERENCIA AL CONTENEDOR DE JUEGO ===
      this.gameBoxNode = gameBoxNode;
  
      // === CREACIÓN DEL NODO DE LONDON ===
      this.node = document.createElement("img");
      this.node.src = "./images-sin-fondo/London-8bits.png";
      this.node.style.position = "absolute";
      this.gameBoxNode.append(this.node);
  
      // === DIMENSIONES Y POSICIÓN INICIAL ===
      this.x = 50;
      this.y = 50;
      this.w = 55;
      this.h = 50;
  
      this.movementSpeed = 15;
  
      // === APLICAR ESTILO INICIAL AL NODO ===
      this.node.style.width = `${this.w}px`;
      this.node.style.height = `${this.h}px`;
      this.node.style.left = `${this.x}px`;
      this.node.style.top = `${this.y}px`;
    }
  
    // === MOVIMIENTO HACIA ARRIBA ===
    moveUp() {
      this.y = Math.max(0, this.y - this.movementSpeed);
      this.node.style.top = `${this.y}px`;
    }
  
    // === MOVIMIENTO HACIA ABAJO ===
    moveDown() {
      const gameBoxHeight = this.gameBoxNode.offsetHeight;
      this.y = Math.min(gameBoxHeight - this.h, this.y + this.movementSpeed);
      this.node.style.top = `${this.y}px`;
    }
  }
  
