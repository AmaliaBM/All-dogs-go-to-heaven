class Chocolate {
    /*
      Clase Chocolate:
      - Aparece desde la derecha y se desplaza hacia la izquierda, en el nivel 2. ES NOCIVO.
      - No interfiere con la lógica de nubes ni pollitos, ni manzanas.
      - Vale 0.50 puntos cuando es recolectada por el personaje principal.
      - Tiene su propio control de aparición y eliminación.
    */
  
    constructor(gameBoxNode, posY) {
      // === REFERENCIA AL CONTENEDOR DEL JUEGO ===
      this.gameBoxNode = gameBoxNode;
  
      // === CREACIÓN DEL NODO DOM ===
      this.node = document.createElement("img");
      this.node.src = "./images-sin-fondo/chocolate.png";
      this.node.style.zIndex = 20;
      this.node.style.position = "absolute";
  
      // === DIMENSIONES Y POSICIÓN INICIAL ===
      this.width = 20;
      this.height = 20;
      this.x = this.gameBoxNode.offsetWidth;
      this.y = posY;
      this.speed = 2;
  
      // === APLICAR ESTILOS INICIALES ===
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
    
      // Movimiento en zigzag vertical
      this.y += Math.sin(this.x / 20) * 2; 
    
      this.node.style.left = `${this.x}px`;
      this.node.style.top = `${this.y}px`;
    }
    // === ELIMINAR DEL DOM ===
    remove() {
      this.node.remove();
    }
  }
  