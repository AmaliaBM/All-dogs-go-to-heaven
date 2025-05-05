window.addEventListener("DOMContentLoaded", () => { //asegura que todo se ejecute una vez que HTML este completamente cargado
    //* ELEMENTOS PRINCIPALES DEL DOM

    // pantallas
    const splashScreenNode = document.querySelector("#splash-screen");
    const gameScreenNode = document.querySelector("#game-screen");
    const gameOverScreenNode = document.querySelector("#game-over-screen");
    const scoreNode = document.querySelector("#score");
  
    // botones
    const startBtnNode = document.querySelector("#start-btn");
    const restartBtnNode = document.querySelector("#restart-btn");
    const soundOnBtnDOM = document.querySelector("#soundOn-btn"); //btn sonido ON musica
    const soundOffBtnDOM = document.querySelector("#soundOff-btn"); //btn sonido OFF musica
  
    // game box
    const gameBoxNode = document.querySelector("#game-box");

    // musica--> suena música cuando comienza juego
    const musicaJuegoNode = document.querySelector("#musicajuego");
    musicaJuegoNode.volume = 0.1; //volumen de la musica general del juego, para q suenen + los efectos
    // Bucle Musica general ---> para que no deje de sonar aunque lleves mucho tiempo jugando
    musicaJuegoNode.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
    
    //>>>>PARAR MUSICA. -->
    const stopMusic = () => {
        musicaJuegoNode.pause(); 
    };


    // sonido efecto colisión --> suena cuando hay colisión con nubes
    const musicaColisionNode = document.querySelector("#musicacolision");
    musicaColisionNode.volume = 0.5;

    //sonido cuando coge pollo --> suena cuando recoge pollo
    const sonidoPolloNode = document.querySelector("#sonidocomerpollo")
    sonidoPolloNode.volume = 0.5;

   
   
    //* VARIABLES GLOBALES DEL JUEGO
  
    let londonObj = null; //creo variable de acceso, no creo "london". No quiero q todavía exista. Es para que cualquier parte del código acceda a ella.
    let pollitosArr = []; //!Pollitos asados que dan puntos
    let nubesArr = []; //En vez de tener 1obj de nube, creamos un array de nubes:
    let score = 0;// Contador de puntos
  
    let gameIntervalId = null;
    let nubesIntervalId = null;
    let pollitosIntervalId = null; // Añadido para limpiar si se quiere parar luego
  
    //* FUNCIONES GLOBALES DEL JUEGO

     startBtnNode.addEventListener("click", () => {
      startGame();
    });
  
    restartBtnNode.addEventListener("click", () => {
      location.reload(); // Recarga todo el juego
    });

    soundOnBtnDOM.addEventListener("click", () => {
      musicaJuegoNode.play();
    });
    
    soundOffBtnDOM.addEventListener("click", stopMusic) 
  
    // Movimiento con teclado
    document.addEventListener("keydown", (event) => {
      if (!londonObj) return; //verifica que londonObj este inicializado
  
      if (event.key === "ArrowUp") { 
        londonObj.moveUp(); // nuevo método
      } else if (event.key === "ArrowDown") { 
        londonObj.moveDown();
      } else if (event.key === " ") {
        londonObj.jump(); // puedes asignar espacio al salto
      }
      event.stopPropagation(); //para que musica no se sube y baje usando los comandos de flechas
    });
  
    function startGame() {
      score = 0; //inicio de puntos
      scoreNode.innerText = score;
  
      //1. ocultar pantalla inicial
      splashScreenNode.style.display = "none";
  
      //2. mostrar la pantalla de juego
      gameScreenNode.style.display = "flex";

     //!--->aqui añadiría la musica, llamando al nodo juego musica y método .play, Ocultarlo y generar un botón que clicka el usuario y se accede al nodo, metodo pausa. 

     //2.1 meter música del juego
     musicaJuegoNode.play();
     musicaJuegoNode.pause();
    
      //3. Añadimos elementos iniciales del juego
      londonObj = new London(gameBoxNode); //antes era "const", pero lo quitamos para que acceda a la variable global
  
      //4. Iniciamos el intervalo principal del juego: controla mov. automáticos, colisiones, etc.
      gameIntervalId = setInterval(() => {
        gameLoop();
      }, Math.round(1000 / 60)); // lo más recomendable para videojuegos es 60fps
  
      //!5. Iniciamos otros intervalos del juego: cosas que aparecen después de X tiempo.
  
      nubesIntervalId = setInterval(() => {
        nubesAppear();
      }, 2000); // las nubes aparecen cada 2 segundos.
  
      pollitosIntervalId = setInterval(() => {
        const randomY = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 60));
        const nuevoPollito = new PollitoAsado(gameBoxNode, randomY);
        pollitosArr.push(nuevoPollito);
      }, 3500); // Aparece cada 3.5s (ajustable)
    }
  
    function gameLoop() {
      if (!londonObj) return; // Aseguramos que londonObj esté definido
  
      // movimiento automático de las nubes
      nubesArr.forEach((cadaNubeObj, index) => {
        cadaNubeObj.automaticMovement(); //accedemos a cada nube y añadimos la ejecución del movimiento. Esto es un código escalable.
        if (cadaNubeObj.x + cadaNubeObj.width < 0) {
          cadaNubeObj.remove(); // Método remove()
          nubesArr.splice(index, 1);
        }
      });
  
      // movimiento automático de los pollitos
      pollitosArr.forEach((pollito, index) => {
        pollito.automaticMovement();
  
        if (pollito.x + pollito.width < 0) {
          pollito.remove();
          pollitosArr.splice(index, 1);
        }
      });
  
      // comprobar colisiones
      checkCollisionLondonNubes(musicaJuegoNode, musicaColisionNode);
      checkCollisionLondonPollitos(sonidoPolloNode);
    }
  
    function endGame() { //funcion finalizar juego
      clearInterval(gameIntervalId);
      clearInterval(nubesIntervalId);
      clearInterval(pollitosIntervalId);
  
      gameScreenNode.style.display = "none";
      gameOverScreenNode.style.display = "flex";
    }
  
    // función que genera nuevas nubes
    function nubesAppear() {
      let randomY = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 100));
      let nuevaNube = new Nube(gameBoxNode, randomY);
      nubesArr.push(nuevaNube); //punto de partida de altura será aleatorio.
  
      //>>>>>PUNTO donde se personaliza mi proyecto.
      //>>>>>Proyecto final se basa en esto, pero precisamente en este PUNTO se tiene que cambiar.
    }
  
    function checkCollisionLondonPollitos(sonidoPolloNode) {
      pollitosArr.forEach((pollito, index) => {
        if (
          londonObj.x < pollito.x + pollito.width &&
          londonObj.x + londonObj.w > pollito.x &&
          londonObj.y < pollito.y + pollito.height &&
          londonObj.y + londonObj.h > pollito.y
        ) {
          // ¡Colisión = recogido!
          sonidoPolloNode.play();
          pollito.remove();
          pollitosArr.splice(index, 1);
          score += 1;
          scoreNode.innerText = score;
          // Aumentar puntos aquí
          // ejemplo: score += 1;
        }
      });
    }
  
    function checkCollisionLondonNubes(musicaJuegoNode, musicaColisionNode) {
      nubesArr.forEach((nube) => {
        if (
          londonObj.x < nube.x + nube.width &&
          londonObj.x + londonObj.w > nube.x &&
          londonObj.y < nube.y + nube.height &&
          londonObj.y + londonObj.h > nube.y
        ) {
          // London ha chocado con la nube -> fin del juego
          musicaJuegoNode.pause();
          musicaColisionNode.play();
          endGame();
        }
      });
    }
  
  });
  
