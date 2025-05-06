class PollitoAsado {
    /*
      Clase PollitoAsado:
      - Entra desde la derecha y se desplaza a la izquierda.
      - No interfiere con la lógica ni la frecuencia de aparición de las nubes.
      - Es recolectable por el personaje principal (London) y suma puntos.
      - Tiene su propio control de aparición y destrucción.
    */
  
    constructor(gameBoxNode, posY) {
      // === REFERENCIA AL CONTENEDOR DEL JUEGO ===
      this.gameBoxNode = gameBoxNode;
  
      // === CREACIÓN DEL NODO DOM ===
      this.node = document.createElement("img");
      this.node.src = "./images-sin-fondo/pollitoasado-8bit.png";
      this.node.style.position = "absolute";
  
      // === DIMENSIONES Y POSICIÓN INICIAL ===
      this.width = 40;
      this.height = 30;
      this.x = this.gameBoxNode.offsetWidth;
      this.y = posY;
      this.speed = 2.5;
  
      // === APLICAR ESTILOS ===
      this.node.style.width = `${this.width}px`;
      this.node.style.height = `${this.height}px`;
      this.node.style.left = `${this.x}px`;
      this.node.style.top = `${this.y}px`;
  
      // === AGREGAR AL DOM ===
      this.gameBoxNode.append(this.node);
    }
  
    // === MOVIMIENTO AUTOMÁTICO HACIA LA IZQUIERDA ===
    automaticMovement() {
      this.x -= this.speed;
      this.node.style.left = `${this.x}px`;
    }
  
    // === ELIMINAR DEL DOM ===
    remove() {
      this.node.remove();
    }
  }
  