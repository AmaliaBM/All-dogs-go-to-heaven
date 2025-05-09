class AceiteOliva {
    /*
      Clase Aceite:
      - Aparece desde la derecha y se desplaza hacia la izquierda.
      - Aparece solo en el momento bonus, con todos los demás alimentos saludables (no nocivos)
    */
  
    constructor(gameBoxNode, posY) {
      // === REFERENCIA AL CONTENEDOR DEL JUEGO ===
      this.gameBoxNode = gameBoxNode;
  
      // === CREACIÓN DEL NODO DOM ===
      this.node = document.createElement("img");
      this.node.src = "./elementos-comida-y-botones/aceiteoliva.png";
      this.node.style.zIndex = 10;
      this.node.style.position = "absolute";
  
      // === DIMENSIONES Y POSICIÓN INICIAL ===
      this.width = 20;
      this.height = 30;
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
      this.node.style.left = `${this.x}px`;
    }
  
    // === ELIMINAR DEL DOM ===
    remove() {
      this.node.remove();
    }
  }
  