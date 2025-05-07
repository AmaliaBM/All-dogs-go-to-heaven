function handleMoveUp(event) {
  event.preventDefault(); 
  if (window.londonObj && !window.isPaused) { //saco estas funciones del DOMContent porque si no son incompatibles con jugar desde el ordenador y dejan el juego inutil
    window.londonObj.moveUp();
  }
}

function handleMoveDown(event) {
  event.preventDefault();
  if (window.londonObj && !window.isPaused) {
    window.londonObj.moveDown();
  }
}

window.addEventListener("DOMContentLoaded", () => {

  // === DETECCIÓN DE DISPOSITIVO MÓVIL === 
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); //comprobar que visitan desde web

  if (isMobile) {
    document.getElementById("mobile-controls").style.display = "flex";
  }

  // === ELEMENTOS DEL DOM ===
  const splashScreenNode = document.querySelector("#splash-screen");
  const gameScreenNode = document.querySelector("#game-screen");
  const gameOverScreenNode = document.querySelector("#game-over-screen");
  const scoreNode = document.querySelector("#score");
  const maxScoreNode = document.querySelector("#max-score");
  const scoreGameOverNode = document.querySelector("#score-gameover");
  const playerNameInput = document.querySelector("#player-name-input");
  const startBtnNode = document.querySelector("#start-btn");
  const pauseBtnNode = document.querySelector("#pause-btn");
  const restartBtnNode = document.querySelector("#restart-btn");
  const soundOnBtnDOM = document.querySelector("#soundOn-btn");
  const soundOffBtnDOM = document.querySelector("#soundOff-btn");
  const gameBoxNode = document.querySelector("#game-box");

  // === BOTONES DE CONTROL TÁCTIL ===
  const btnUp = document.getElementById("btn-up");
  const btnDown = document.getElementById("btn-down");

  if (btnUp) {
    btnUp.addEventListener("click", handleMoveUp);
    btnUp.addEventListener("touchstart", handleMoveUp, { passive: false });
  }

  if (btnDown) {
    btnDown.addEventListener("click", handleMoveDown);
    btnDown.addEventListener("touchstart", handleMoveDown, { passive: false });
  }

  // === SONIDOS ===
  const musicaJuegoNode = document.querySelector("#musicajuego");
  const musicaColisionNode = document.querySelector("#musicacolision");
  const sonidoPolloNode = document.querySelector("#sonidocomerpollo");
  const sonidoManzanaNode = document.querySelector("#sonidocomerpollo"); // mismo audio

  musicaJuegoNode.volume = 0.1;
  musicaJuegoNode.addEventListener("ended", function () {
    this.currentTime = 0;
    this.play();
  });

  musicaColisionNode.volume = 0.5;
  sonidoPolloNode.volume = 0.5;
  sonidoManzanaNode.volume = 0.5;

  const stopMusic = () => musicaJuegoNode.pause();

  // === VARIABLES DE JUEGO ===
  window.londonObj = null;
  let pollitosArr = [];
  let manzanasArr = [];
  let nubesArr = [];

  let playerName = "";
  let maxScore = 0;
  let score = 0;
  window.isPaused = false;

  let gameIntervalId = null;
  let nubesIntervalId = null;
  let pollitosIntervalId = null;
  let manzanasIntervalId = null;

  // === CARGAR PUNTUACIÓN MÁXIMA ===
  const savedData = JSON.parse(localStorage.getItem("maxScores")) || [];
  if (savedData.length > 0) {
    const highestScore = savedData.reduce((max, player) => player.score > max ? player.score : max, 0);
    const bestPlayer = savedData.find(player => player.score === highestScore);
    maxScore = highestScore;
    playerName = bestPlayer.name;
    maxScoreNode.innerText = `Max Score: ${maxScore} (${playerName})`;
  }

  // === EVENTOS ===
  startBtnNode.addEventListener("click", () => {
    if (playerNameInput.value.trim() === "") {
      alert("Por favor, ingresa tu nombre.");
      return;
    }
    playerName = playerNameInput.value.trim();
    splashScreenNode.style.display = "none";
    gameScreenNode.style.display = "flex";
    gameBoxNode.style.display = "block";
    startGame();
  });

  restartBtnNode.addEventListener("click", () => location.reload());

  pauseBtnNode.addEventListener("click", () => {
    window.isPaused = !window.isPaused;

    if (window.isPaused) {
      pauseBtnNode.innerText = "▶️ Reanudar";
      musicaJuegoNode.pause();
    } else {
      pauseBtnNode.innerText = "⏸️ Pausa";
      musicaJuegoNode.play();
    }
  });

  soundOnBtnDOM.addEventListener("click", () => musicaJuegoNode.play());
  soundOffBtnDOM.addEventListener("click", stopMusic);

  document.addEventListener("keydown", (event) => {
    if (!window.londonObj || window.isPaused) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      window.londonObj.moveUp();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      window.londonObj.moveDown();
    } else if (event.key === " ") {
      event.preventDefault();
      window.londonObj.jump();
    }

    event.stopPropagation();
  });

  // === INICIO DEL JUEGO ===
  function startGame() {
    score = 0;
    scoreNode.innerText = score;
    musicaJuegoNode.play();

    window.londonObj = new London(gameBoxNode);
    gameIntervalId = setInterval(gameLoop, 1000 / 60);

    nubesIntervalId = setInterval(() => {
      const randomY = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 100));
      const nuevaNube = new Nube(gameBoxNode, randomY);
      nubesArr.push(nuevaNube);
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
    }, 3700);
  }

  function requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  // === BUCLE PRINCIPAL ===
  function gameLoop() {
    if (window.isPaused || !window.londonObj) return;

    moveAndClean(nubesArr);
    moveAndClean(pollitosArr);
    moveAndClean(manzanasArr);

    checkCollisionLondonNubes();
    checkCollisionLondonPollitos();
    checkCollisionLondonManzana();
  }

  function moveAndClean(arr) {
    arr.forEach((obj, index) => {
      obj.automaticMovement();
      if (obj.x + obj.width < 0) {
        obj.remove();
        arr.splice(index, 1);
      }
    });
  }

  // === COLISIONES ===
  function checkCollisionLondonNubes() {
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

  function checkCollisionLondonPollitos() {
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
        updateScore(1);
      }
    });
  }

  function checkCollisionLondonManzana() {
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
        updateScore(2);
      }
    });
  }

  // === PUNTUACIÓN ===
  function updateScore(points) {
    score += points;
    scoreNode.innerText = score;

    if (score > maxScore) {
      maxScore = score;
      maxScoreNode.innerText = `Max Score: ${maxScore} (${playerName})`;

      const maxScores = JSON.parse(localStorage.getItem("maxScores")) || [];
      maxScores.push({ name: playerName, score: maxScore });
      localStorage.setItem("maxScores", JSON.stringify(maxScores));
    }
  }

  function mostrarRanking() {
    const rankingList = document.querySelector("#ranking-list");
    rankingList.innerHTML = "";

    const maxScores = JSON.parse(localStorage.getItem("maxScores")) || [];
    const existingPlayer = maxScores.find(p => p.name === playerName);
    if (existingPlayer) {
      if (score > existingPlayer.score) existingPlayer.score = score;
    } else {
      maxScores.push({ name: playerName, score });
    }

    maxScores.sort((a, b) => b.score - a.score);
    localStorage.setItem("maxScores", JSON.stringify(maxScores.slice(0, 5)));

    maxScores.slice(0, 5).forEach((player) => {
      const li = document.createElement("li");
      li.innerText = `${player.name}: ${player.score} puntos`;
      rankingList.appendChild(li);
    });
  }

  // === FINALIZAR JUEGO ===
  function endGame() {
    clearInterval(gameIntervalId);
    clearInterval(nubesIntervalId);
    clearInterval(pollitosIntervalId);
    clearInterval(manzanasIntervalId);
    mostrarRanking();

    gameScreenNode.style.display = "none";
    gameBoxNode.style.display = "none";
    gameOverScreenNode.style.display = "flex";

    scoreGameOverNode.innerText = `Tu puntuación final: ${score}`;
    document.querySelector("#player-name-gameover").innerText = `¡Hola ${playerName}!`;
  }
});


