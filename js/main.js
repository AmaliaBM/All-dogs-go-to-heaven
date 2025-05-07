window.addEventListener("DOMContentLoaded", () => {
  // === ADAPTACION A MÓVIL === 
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // comprobar si visitan desde móvil o tableta

  if (isMobile) {
    const mobileControls = document.getElementById("mobile-controls");
    if (mobileControls) mobileControls.style.display = "flex";
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

  // === SONIDOS ===
  const musicaJuegoNode = document.querySelector("#musicajuego");
  const musicaColisionNode = document.querySelector("#musicacolision");
  const sonidoPolloNode = document.querySelector("#sonidocomerpollo");
  const sonidoManzanaNode = document.querySelector("#sonidocomerpollo"); // usando el mismo audio (por indicación)

  musicaJuegoNode.volume = 0.1;
  musicaColisionNode.volume = 0.5;
  sonidoPolloNode.volume = 0.5;
  sonidoManzanaNode.volume = 0.5;

  musicaJuegoNode.addEventListener("ended", function () {
    this.currentTime = 0;
    this.play();
  });

  const stopMusic = () => musicaJuegoNode.pause();

  // === VARIABLES DE JUEGO ===
  let londonObj = null;
  let pollitosArr = [];
  let manzanasArr = [];
  let nubesArr = [];

  let playerName = "";
  let maxScore = 0;
  let score = 0;
  let isPaused = false;

  let gameIntervalId = null;
  let nubesIntervalId = null;
  let pollitosIntervalId = null;
  let manzanasIntervalId = null;

  // === CARGAR PUNTUACIÓN MÁXIMA ===
  let savedData = [];
  try {
    savedData = JSON.parse(localStorage.getItem("maxScores")) || [];
  } catch (e) {
    console.warn("Datos corruptos en localStorage");
  }

  if (savedData.length > 0) {
    const highestScore = savedData.reduce((max, p) => p.score > max ? p.score : max, 0);
    const bestPlayer = savedData.find(p => p.score === highestScore);
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
    isPaused = !isPaused;
    pauseBtnNode.innerText = isPaused ? "▶️ Reanudar" : "⏸️ Pausa";
    isPaused ? musicaJuegoNode.pause() : musicaJuegoNode.play();
  });

  soundOnBtnDOM.addEventListener("click", () => musicaJuegoNode.play());
  soundOffBtnDOM.addEventListener("click", stopMusic);

  document.addEventListener("keydown", (event) => {
    if (!londonObj || isPaused) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        londonObj.moveUp();
        break;
      case "ArrowDown":
        event.preventDefault();
        londonObj.moveDown();
        break;
      case " ":
        event.preventDefault();
        londonObj.jump();
        break;
    }

    event.stopPropagation();
  });

  const btnUp = document.getElementById("btn-up");
  const btnDown = document.getElementById("btn-down");

  if (btnUp) {
    btnUp.addEventListener("click", () => {
      if (londonObj && !isPaused) londonObj.moveUp();
    });
  }

  if (btnDown) {
    btnDown.addEventListener("click", () => {
      if (londonObj && !isPaused) londonObj.moveDown();
    });
  }

  // === INICIO DEL JUEGO ===
  function startGame() {
    score = 0;
    scoreNode.innerText = score;
    musicaJuegoNode.play();

    londonObj = new London(gameBoxNode);
    gameIntervalId = setInterval(gameLoop, 1000 / 60);

    nubesIntervalId = setInterval(() => {
      const y = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 100));
      nubesArr.push(new Nube(gameBoxNode, y));
    }, 2000);

    pollitosIntervalId = setInterval(() => {
      const y = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 60));
      pollitosArr.push(new PollitoAsado(gameBoxNode, y));
    }, 3500);

    manzanasIntervalId = setInterval(() => {
      const y = Math.floor(Math.random() * (gameBoxNode.offsetHeight - 100)) + 10;
      manzanasArr.push(new Manzana(gameBoxNode, y));
    }, 3700);
  }

  // === BUCLE PRINCIPAL ===
  function gameLoop() {
    if (isPaused || !londonObj) return;

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
      if (checkOverlap(londonObj, nube)) {
        musicaJuegoNode.pause();
        musicaColisionNode.play();
        endGame();
      }
    });
  }

  function checkCollisionLondonPollitos() {
    pollitosArr.forEach((pollito, index) => {
      if (checkOverlap(londonObj, pollito)) {
        sonidoPolloNode.play();
        pollito.remove();
        pollitosArr.splice(index, 1);
        updateScore(1);
      }
    });
  }

  function checkCollisionLondonManzana() {
    manzanasArr.forEach((manzana, index) => {
      if (checkOverlap(londonObj, manzana)) {
        sonidoManzanaNode.play();
        manzana.remove();
        manzanasArr.splice(index, 1);
        updateScore(2);
      }
    });
  }

  function checkOverlap(objA, objB) {
    return (
      objA.x < objB.x + objB.width &&
      objA.x + objA.w > objB.x &&
      objA.y < objB.y + objB.height &&
      objA.y + objA.h > objB.y
    );
  }

  // === PUNTUACIÓN ===
  function updateScore(points) {
    score += points;
    scoreNode.innerText = score;

    if (score > maxScore) {
      maxScore = score;
      maxScoreNode.innerText = `Max Score: ${maxScore} (${playerName})`;

      let maxScores = [];
      try {
        maxScores = JSON.parse(localStorage.getItem("maxScores")) || [];
      } catch (e) {
        maxScores = [];
      }

      maxScores.push({ name: playerName, score: maxScore });
      localStorage.setItem("maxScores", JSON.stringify(maxScores));
    }
  }

  function mostrarRanking() {
    const rankingList = document.querySelector("#ranking-list");
    rankingList.innerHTML = "";

    let maxScores = [];
    try {
      maxScores = JSON.parse(localStorage.getItem("maxScores")) || [];
    } catch (e) {
      maxScores = [];
    }

    const existingPlayer = maxScores.find(p => p.name === playerName);
    if (existingPlayer) {
      if (score > existingPlayer.score) existingPlayer.score = score;
    } else {
      maxScores.push({ name: playerName, score });
    }

    maxScores.sort((a, b) => b.score - a.score);
    localStorage.setItem("maxScores", JSON.stringify(maxScores.slice(0, 5)));

    maxScores.slice(0, 5).forEach(player => {
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

