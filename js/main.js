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
  
    // game box
    const gameBoxNode = document.querySelector("#game-box");
  
    //* VARIABLES GLOBALES DEL JUEGO
  
    let londonObj = null; //creo variable de acceso, no creo "london". No quiero q todavía exista. Es para que cualquier parte del código acceda a ella.
    let pollitosArr = []; //!Pollitos asados que dan puntos
    let nubesArr = []; //En vez de tener 1obj de nube, creamos un array de nubes:
    let score = 0;
  
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
    });
  
    function startGame() {
      score = 0; //inicio de puntos
      scoreNode.innerText = score;
  
      //1. ocultar pantalla inicial
      splashScreenNode.style.display = "none";
  
      //2. mostrar la pantalla de juego
      gameScreenNode.style.display = "flex";
     
  
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
      // cómo se invoca gravedad del personaje principal:
      if (!londonObj) return; // Aseguramos que londonObj esté definido
  
      // movimiento automático de las nubes
      nubesArr.forEach((cadaNubeObj, index) => {
        cadaNubeObj.automaticMovement(); //accedemos a cada nube y añadimos la ejecución del movimiento. Esto es un código escalable.
        if (cadaNubeObj.x + cadaNubeObj.width < 0) {
          cadaNubeObj.remove(); // Si implementaste un método remove()
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
      checkCollisionLondonNubes();
      checkCollisionLondonSuelo();
      checkCollisionLondonPollitos();
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
  
      //>>>>>esto específico de las tuberías es algo particular de este juego. PUNTO donde se personaliza.
      //>>>>>Proyecto final se basa en esto, pero precisamente en este PUNTO se tiene que cambiar.
    }
  
    function checkCollisionLondonPollitos() {
      pollitosArr.forEach((pollito, index) => {
        if (
          londonObj.x < pollito.x + pollito.width &&
          londonObj.x + londonObj.w > pollito.x &&
          londonObj.y < pollito.y + pollito.height &&
          londonObj.y + londonObj.h > pollito.y
        ) {
          // ¡Colisión = recogido!
          pollito.remove();
          pollitosArr.splice(index, 1);
          score += 1;
          scoreNode.innerText = score;
          // Aumentar puntos aquí
          // ejemplo: score += 1;
        }
      });
    }
  
    function checkCollisionLondonNubes() {
      nubesArr.forEach((nube) => {
        if (
          londonObj.x < nube.x + nube.width &&
          londonObj.x + londonObj.w > nube.x &&
          londonObj.y < nube.y + nube.height &&
          londonObj.y + londonObj.h > nube.y
        ) {
          // London ha chocado con la nube -> fin del juego
          endGame();
        }
      });
    }
  
    function checkCollisionLondonSuelo() { //london colisiona con el suelo -> fin juego
      const gameBoxHeight = gameBoxNode.offsetHeight;
      if (londonObj.y + londonObj.h > gameBoxHeight) {
        endGame();
      }
    }
  });
  
