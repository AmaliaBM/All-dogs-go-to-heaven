class London {

    /*London debe:

    Es la perra, personaje principal, que aparece en la parte izquierda de la pantalla. 

    Permitir al usuario del juego desplazar el personaje para arriba y abajo.

    Colisionar con las nubes.

    Recoger puntos cada vez que aparezca un pollo asado e interactúe colisionando con él.

    */

    constructor(gameBoxNode) {
        
        //todas las propiedades-características de London, personaje principal.

        this.node = document.createElement("img");
        this.node.src = "./images-sin-fondo/London-8bits.png";

        this.gameBoxNode = gameBoxNode;
        this.gameBoxNode.append(this.node); //coge nodo de imagen y lo inserta en el juego

        this.x = 50;
        this.y = 50;
        this.w = 55;
        this.h = 50;

        //vamos a cambiar el DOM para que cambie posición y dimensión de London. Definir dimensión inicial.

        this.node.style.width = `${this.w}px`; //ancho
        this.node.style.height = `${this.h}px`; //alto

        //definir posición inicial

        this.node.style.position = "absolute"; //poder posicionarlo de forma exacta
        this.node.style.top = `${this.y}px`; //define su posicion en eje Y
        this.node.style.left = `${this.x}px`; //define su posicion en eje X

        //!this.gravitySpeed = 2; //esto ocurrirá 1 vez x 60s[al final no implementé esta acción]
        //!this.jumpSpeed = 40; //cuando usuario clique sobre pantalla ocurrirá esto[esta tampoco la implementé finalmente]
        this.movementSpeed = 15; 
        
    }
       

    moveUp() { 
        if (this.y - this.movementSpeed > 0) {
            this.y -= this.movementSpeed;
        } else {
            this.y = 0; // evitar que se salga por arriba
        }
        this.node.style.top = `${this.y}px`;
    }

    moveDown() { 
        const gameBoxHeight = this.gameBoxNode.offsetHeight;
        if (this.y + this.h + this.movementSpeed < gameBoxHeight) {
            this.y += this.movementSpeed;
        } else {
            this.y = gameBoxHeight - this.h; // evita que se salga del juego
        }
        this.node.style.top = `${this.y}px`;
    }

}
