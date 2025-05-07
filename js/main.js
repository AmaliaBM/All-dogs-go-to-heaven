

// === INICIO DEL JUEGO ===
window.addEventListener("DOMContentLoaded", () => {
  
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

  // === SONIDOS ===
  const musicaJuegoNode = document.querySelector("#musicajuego");
  const musicaColisionNode = document.querySelector("#musicacolision");
  const sonidoPolloNode = document.querySelector("#sonidocomerpollo");
  const sonidoManzanaNode = document.querySelector("#sonidocomermanzana") || sonidoPolloNode; // fallback

  musicaJuegoNode.volume = 0.1;
  musicaJuegoNode.addEventListener("ended", function () {
    this.currentTime = 0;
    this.play();
  });

  musicaColisionNode.volume = 0.5;
  sonidoPolloNode.volume = 0.5;
  sonidoManzanaNode.volume = 0.5;

  const stopMusic = () => musicaJuegoNode.pause();

  // === CONFIGURACIÓN DE NIVELES ===
  const niveles = [
    { nivel: 1, puntosParaPasar: 0, velocidadNubes: 1500, velocidadPollitos: 900 },
    { nivel: 2, puntosParaPasar: 10, velocidadNubes: 2000, velocidadPollitos: 1100 },
    { nivel: 3, puntosParaPasar: 20, velocidadNubes: 2500, velocidadPollitos: 1400 },
    { nivel: 4, puntosParaPasar: 30, velocidadNubes: 3000, velocidadPollitos: 1700 },
    { nivel: 5, puntosParaPasar: 40, velocidadNubes: 3500,  velocidadPollitos: 2000 },
  ];
  

  // === VARIABLES DE JUEGO ===
  window.londonObj = null;
  let pollitosArr = [];
  let manzanasArr = [];
  let nubesArr = [];

  let playerName = "";
  let maxScore = 0;
  let score = 0;
  let nivelActual = 0;
  let currentLevelConfig = niveles[nivelActual];

  let gameIntervalId, nubesIntervalId, pollitosIntervalId, manzanasIntervalId;

  // === CARGAR PUNTUACIÓN MÁXIMA ===
  const savedData = JSON.parse(localStorage.getItem("maxScores")) || [];
  if (savedData.length) {
    const best = savedData.reduce((max, p) => p.score > max.score ? p : max, savedData[0]);
    maxScore = best.score;
    playerName = best.name;
    maxScoreNode.innerText = `Max Score: ${maxScore} (${playerName})`;
  }

  // === EVENTOS DE BOTONES ===
  startBtnNode.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (!name) return alert("Por favor, ingresa tu nombre.");
    playerName = name;
    splashScreenNode.style.display = "none";
    gameScreenNode.style.display = "flex";
    gameBoxNode.style.display = "block";
    startGame();
  });

  restartBtnNode.addEventListener("click", () => location.reload());

  pauseBtnNode.addEventListener("click", () => {
    window.isPaused = !window.isPaused;
    pauseBtnNode.innerText = window.isPaused ? "▶️ Reanudar" : "⏸️ Pausa";
    window.isPaused ? musicaJuegoNode.pause() : musicaJuegoNode.play();
  });

  soundOnBtnDOM.addEventListener("click", () => musicaJuegoNode.play());
  soundOffBtnDOM.addEventListener("click", stopMusic);

  document.addEventListener("keydown", (event) => {
    if (!window.londonObj || window.isPaused) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        window.londonObj.moveUp();
        break;
      case "ArrowDown":
        event.preventDefault();
        window.londonObj.moveDown();
        break;
      case " ":
        event.preventDefault();
        window.londonObj.jump();
        break;
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

    iniciarSpawners();
  }

  function iniciarSpawners() {
    nubesIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 100);
      nubesArr.push(new Nube(gameBoxNode, y));
    }, currentLevelConfig.velocidadNubes);

    pollitosIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      pollitosArr.push(new PollitoAsado(gameBoxNode, y));
    }, currentLevelConfig.velocidadPollitos);

    manzanasIntervalId = setInterval(() => {
      const y = 10 + Math.random() * (gameBoxNode.offsetHeight - 100);
      manzanasArr.push(new Manzana(gameBoxNode, y));
    }, 3700);
  }

  // === GAME LOOP ===
  function gameLoop() {
    if (window.isPaused || !window.londonObj) return;

    moverYLimpiar(nubesArr);
    moverYLimpiar(pollitosArr);
    moverYLimpiar(manzanasArr);

    checkCollisionLondonNubes();
    checkCollisionLondonPollitos();
    checkCollisionLondonManzana();
  }

  function moverYLimpiar(arr) {
    arr.forEach(obj => obj.automaticMovement());
    arr = arr.filter(obj => {
      if (obj.x + obj.width < 0) {
        obj.remove();
        return false;
      }
      return true;
    });
  }

  // === COLISIONES ===
  function checkCollisionLondonNubes() {
    nubesArr.forEach(nube => {
      if (colisiona(window.londonObj, nube)) {
        musicaJuegoNode.pause();
        musicaColisionNode.play();
        endGame();
      }
    });
  }

  function checkCollisionLondonPollitos() {
    pollitosArr = pollitosArr.filter(pollito => {
      if (colisiona(window.londonObj, pollito)) {
        sonidoPolloNode.play();
        pollito.remove();
        updateScore(1);
        return false;
      }
      return true;
    });
  }

  function checkCollisionLondonManzana() {
    manzanasArr = manzanasArr.filter(manzana => {
      if (colisiona(window.londonObj, manzana)) {
        sonidoManzanaNode.play();
        manzana.remove();
        updateScore(2);
        return false;
      }
      return true;
    });
  }

  function colisiona(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.w > b.x &&
      a.y < b.y + b.height &&
      a.y + a.h > b.y
    );
  }

  // === PUNTUACIÓN ===
  function updateScore(puntos) {
    score += puntos;
    scoreNode.innerText = score;

    if (score > maxScore) {
      maxScore = score;
      maxScoreNode.innerText = `Max Score: ${maxScore} (${playerName})`;
      const maxScores = JSON.parse(localStorage.getItem("maxScores")) || [];
      const existing = maxScores.find(p => p.name === playerName);
      if (existing) existing.score = maxScore;
      else maxScores.push({ name: playerName, score: maxScore });
      localStorage.setItem("maxScores", JSON.stringify(maxScores));
    }

    checkNivel();
  }

  function checkNivel() {
    const siguiente = niveles[nivelActual + 1];
    if (siguiente && score >= siguiente.puntosParaPasar) {
      nivelActual++;
      currentLevelConfig = niveles[nivelActual];
      updateNivel();
    }
  }

  function updateNivel() {
    clearInterval(manzanasIntervalId);
    clearInterval(pollitosIntervalId);
    iniciarSpawners();
    console.log(`¡Nivel ${nivelActual + 1} alcanzado!`);
    showLevelUpMessage(nivelActual + 1);
  }

  function showLevelUpMessage(nivel) {
    const levelMsgNode = document.getElementById("level-up-message");
    levelMsgNode.innerText = `¡Nivel ${nivel} alcanzado! 🔥`;
    levelMsgNode.style.opacity = "1";
  
    setTimeout(() => {
      levelMsgNode.style.opacity = "0";
    }, 2500); // Dura 2.5 segundos
  }

  // === FINAL DEL JUEGO ===
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

  // === RANKING ===
  function mostrarRanking() {
    const rankingList = document.querySelector("#ranking-list");
    const maxScores = JSON.parse(localStorage.getItem("maxScores")) || [];

    const player = maxScores.find(p => p.name === playerName);
    if (player && score > player.score) player.score = score;
    else if (!player) maxScores.push({ name: playerName, score });

    maxScores.sort((a, b) => b.score - a.score);
    localStorage.setItem("maxScores", JSON.stringify(maxScores.slice(0, 5)));

    rankingList.innerHTML = "";
    maxScores.slice(0, 5).forEach(p => {
      const li = document.createElement("li");
      li.innerText = `${p.name}: ${p.score} puntos`;
      rankingList.appendChild(li);
    });
  }
});


