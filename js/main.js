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
  musicaJuegoNode.volume = 0.1;
  musicaJuegoNode.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
  }, false);

  const stopMusic = () => {
    musicaJuegoNode.pause();
  };

  const musicaColisionNode = document.querySelector("#musicacolision");
  musicaColisionNode.volume = 0.5;

  const sonidoPolloNode = document.querySelector("#sonidocomerpollo");
  sonidoPolloNode.volume = 0.5;

  const sonidoManzanaNode = document.querySelector("#sonidocomerpollo");
  sonidoManzanaNode.volume = 0.5;

  //* VARIABLES GLOBALES DEL JUEGO
  let londonObj = null;
  let pollitosArr = [];
  let manzanasArr = [];
  let nubesArr = [];
  let score = 0;

  let gameIntervalId = null;
  let nubesIntervalId = null;
  let pollitosIntervalId = null;
  let manzanasIntervalId = null;

  //* FUNCIONES GLOBALES DEL JUEGO

  startBtnNode.addEventListener("click", () => {
    startGame();
  });

  restartBtnNode.addEventListener("click", () => {
    location.reload();
  });

  soundOnBtnDOM.addEventListener("click", () => {
    musicaJuegoNode.play();
  });

  soundOffBtnDOM.addEventListener("click", stopMusic);

  document.addEventListener("keydown", (event) => {
    if (!londonObj) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      londonObj.moveUp();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      londonObj.moveDown();
    } else if (event.key === " ") {
      event.preventDefault();
      londonObj.jump();
    }
    event.stopPropagation();
  });

  function startGame() {
    score = 0;
    scoreNode.innerText = score;

    splashScreenNode.style.display = "none";
    gameScreenNode.style.display = "flex";

    musicaJuegoNode.play();
    musicaJuegoNode.pause();

    londonObj = new London(gameBoxNode);

    gameIntervalId = setInterval(() => {
      gameLoop();
    }, Math.round(1000 / 60));

    nubesIntervalId = setInterval(() => {
      nubesAppear();
    }, 2000);

    pollitosIntervalId = setInterval(() => {
      const randomY = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 60));
      const nuevoPollito = new PollitoAsado(gameBoxNode, randomY);
      pollitosArr.push(nuevoPollito);
    }, 3500);

    manzanasIntervalId = setInterval(() => {
      const randomY = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 100)) + 10;
      const nuevoManzana = new Manzana(gameBoxNode, randomY);
      manzanasArr.push(nuevoManzana);
    }, 3700); // desfasar un poco el tiempo    
  }

  function gameLoop() {
    if (!londonObj) return;

    nubesArr.forEach((cadaNubeObj, index) => {
      cadaNubeObj.automaticMovement();
      if (cadaNubeObj.x + cadaNubeObj.width < 0) {
        cadaNubeObj.remove();
        nubesArr.splice(index, 1);
      }
    });

    pollitosArr.forEach((pollito, index) => {
      pollito.automaticMovement();
      if (pollito.x + pollito.width < 0) {
        pollito.remove();
        pollitosArr.splice(index, 1);
      }
    });

    manzanasArr.forEach((manzana, index) => {
      manzana.automaticMovement();
      if (manzana.x + manzana.width < 0) {
        manzana.remove();
        manzanasArr.splice(index, 1);
      }
    });

    checkCollisionLondonNubes(musicaJuegoNode, musicaColisionNode);
    checkCollisionLondonPollitos(sonidoPolloNode);
    checkCollisionLondonManzana(sonidoPolloNode);
  }

  function endGame() {
    clearInterval(gameIntervalId);
    clearInterval(nubesIntervalId);
    clearInterval(pollitosIntervalId);
    clearInterval(manzanasIntervalId);

    gameScreenNode.style.display = "none";
    gameOverScreenNode.style.display = "flex";
  }

  function nubesAppear() {
    let randomY = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 100));
    let nuevaNube = new Nube(gameBoxNode, randomY);
    nubesArr.push(nuevaNube);
  }

  function checkCollisionLondonNubes(musicaJuegoNode, musicaColisionNode) {
    nubesArr.forEach((nube) => {
      if (
        londonObj.x < nube.x + nube.width &&
        londonObj.x + londonObj.w > nube.x &&
        londonObj.y < nube.y + nube.height &&
        londonObj.y + londonObj.h > nube.y
      ) {
        musicaJuegoNode.pause();
        musicaColisionNode.play();
        endGame();
      }
    });
  }

  function checkCollisionLondonPollitos(sonidoPolloNode) {
    pollitosArr.forEach((pollito, index) => {
      if (
        londonObj.x < pollito.x + pollito.width &&
        londonObj.x + londonObj.w > pollito.x &&
        londonObj.y < pollito.y + pollito.height &&
        londonObj.y + londonObj.h > pollito.y
      ) {
        sonidoPolloNode.play();
        pollito.remove();
        pollitosArr.splice(index, 1);
        score += 1;
        scoreNode.innerText = score;
      }
    });
  }

  function checkCollisionLondonManzana(sonidoPolloNode) {
    manzanasArr.forEach((manzana, index) => {
      if (
        londonObj.x < manzana.x + manzana.width &&
        londonObj.x + londonObj.w > manzana.x &&
        londonObj.y < manzana.y + manzana.height &&
        londonObj.y + londonObj.h > manzana.y
      ) {
        sonidoPolloNode.play();
        manzana.remove();
        manzanasArr.splice(index, 1);
        score += 2;
        scoreNode.innerText = score;
      }
    });
  }

});
