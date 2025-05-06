class Nube {
    /*
      Clase Nube:
      - Entra por la derecha y se mueve hacia la izquierda.
      - No interfiere con la lógica ni frecuencia de los pollitos.
      - Colisiona con el personaje principal (London), lo que provoca el fin del juego.
      - Tiene control de aparición y eliminación independiente.
    */
  
    constructor(gameBoxNode, posY) {
      // === REFERENCIA AL CONTENEDOR DEL JUEGO ===
      this.gameBoxNode = gameBoxNode;
  
      // === CREACIÓN DEL NODO DOM ===
      this.node = document.createElement("img");
      this.node.src = "./images-sin-fondo/nube-horizontal-8bits.png";
      this.node.style.position = "absolute";
  
      // === DIMENSIONES Y POSICIÓN INICIAL ===
      this.width = 40;
      this.height = 30;
      this.x = this.gameBoxNode.offsetWidth;
      this.y = posY;
      this.speed = 3.5;
  
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
      this.updatePosition();
    }
  
    // === ACTUALIZAR POSICIÓN EN PANTALLA ===
    updatePosition() {
      this.node.style.left = `${this.x}px`;
    }
  
    // === ELIMINAR DEL DOM ===
    remove() {
      this.node.remove();
    }
  }
  