

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
  const sonidoComerSaludableNode = document.querySelector("#sonidocomersaludable");
 
  musicaJuegoNode.volume = 0.1;
  musicaJuegoNode.addEventListener("ended", function () {
    this.currentTime = 0;
    this.play();
  });

  musicaColisionNode.volume = 0.5;
  sonidoComerSaludableNode.volume = 0.5;

  const stopMusic = () => musicaJuegoNode.pause();

  // === CONFIGURACIÓN DE NIVELES ===
  const niveles = [
    { nivel: 1, puntosParaPasar: 0, velocidadNubes: 1500, velocidadPollitos: 900 },
    { nivel: 2, puntosParaPasar: 10, velocidadNubes: 2000, velocidadPollitos: 1100 },
    { nivel: 3, puntosParaPasar: 20, velocidadNubes: 2500, velocidadPollitos: 1400 },
    { nivel: 4, puntosParaPasar: 30, velocidadNubes: 3000, velocidadPollitos: 1700 },
    { nivel: 5, puntosParaPasar: 40, velocidadNubes: 3500,  velocidadPollitos: 2000 },
    { nivel: 6, puntosParaPasar: 50, velocidadNubes: 3500,  velocidadPollitos: 2000 },
  ];
  

  // === VARIABLES DE JUEGO ===
  window.londonObj = null;
  let pollitosArr = [];
  let manzanasArr = [];
  let nubesArr = [];
  let chocolatesArr = [];
  let zanahoriasArr = [];
  let brocolisArr = [];
  let aceitesArr = [];
  let carnederesesArr = [];
  let huevosArr = [];
  let sandiasArr = [];
  let pescadosArr = [];

  let playerName = "";
  let maxScore = 0;
  let score = 0;
  let nivelActual = 0;
  let bonusStage = false;
  let currentLevelConfig = niveles[nivelActual];

  let gameIntervalId, nubesIntervalId, pollitosIntervalId, manzanasIntervalId, chocolatesIntervalId, brocoliIntervalId, aceiteolivaIntervalId, huevoIntervalId, pescadoIntervalId, zanahoriaIntervalId, sandiaIntervalId, carnederesIntervalId;

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

    if (window.isPaused){
      musicaJuegoNode.pause()
      pauseBtnNode.innerText = "▶️ Reanudar";
    } else {
      musicaJuegoNode.play()
      pauseBtnNode.innerText = "⏸️ Pausa";
    }
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
      let tipo = "normal";
      if (Math.random() < 0.5){
        tipo = "normal"
      } else {
        tipo = "grande"
      }
      const nuevaNube = new Nube(gameBoxNode, y, tipo);  
      nubesArr.push(nuevaNube);
    }, currentLevelConfig.velocidadNubes);

    pollitosIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      pollitosArr.push(new PollitoAsado(gameBoxNode, y));
    }, currentLevelConfig.velocidadPollitos);

    manzanasIntervalId = setInterval(() => {
      const y = 10 + Math.random() * (gameBoxNode.offsetHeight - 100);
      manzanasArr.push(new Manzana(gameBoxNode, y));
    }, 3700);

     // Solo en el nivel 2
     if (nivelActual >= 1) {
      chocolatesIntervalId = setInterval(() => {
        const y = Math.random() * (gameBoxNode.offsetHeight - 50);
        chocolatesArr.push(new Chocolate(gameBoxNode, y));
        }, 3000);
    }
  }

  // === GAME LOOP ===
  function gameLoop() {
    if (window.isPaused || !window.londonObj) return;

    moverYLimpiar(nubesArr);
    moverYLimpiar(pollitosArr);
    moverYLimpiar(manzanasArr);
    moverYLimpiar(chocolatesArr);
    moverYLimpiar(zanahoriasArr);
    moverYLimpiar(brocolisArr);
    moverYLimpiar(aceitesArr);
    moverYLimpiar(carnederesesArr);
    moverYLimpiar(huevosArr);
    moverYLimpiar(sandiasArr);
    moverYLimpiar(pescadosArr);

    checkCollisionLondonNubes();
    checkCollisionLondonPollitos();
    checkCollisionLondonManzana();
    checkCollisionLondonChocolate();
    checkCollisionLondonZanahoria();
    checkCollisionLondonBrocoli();
    checkCollisionLondonAceite();
    checkCollisionLondonCarnederes();
    checkCollisionLondonHuevo();
    checkCollisionLondonSandia();
    checkCollisionLondonPescado();
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
  
  function checkCollisionLondonChocolate() {
    chocolatesArr.forEach(chocolate => {
      if (colisiona(window.londonObj, chocolate)) {
        musicaJuegoNode.pause();
        musicaColisionNode.play();
        endGame();
      }
    });
  }
  function checkCollisionLondonPollitos() {
    pollitosArr = pollitosArr.filter(pollito => {
      if (colisiona(window.londonObj, pollito)) {
        sonidoComerSaludableNode.play();
        pollito.remove();
        updateScore(2);
        mostrarMensajeSalud(2, pollito.x, pollito.y);
        return false;
      }
      return true;
    });
  }
  
  function checkCollisionLondonManzana() {
    manzanasArr = manzanasArr.filter(manzana => {
      if (colisiona(window.londonObj, manzana)) {
        sonidoComerSaludableNode.play();
        manzana.remove();
        updateScore(1);
        mostrarMensajeSalud(1, manzana.x, manzana.y);
        return false;
      }
      return true;
    });
  }

  function checkCollisionLondonZanahoria() {
    zanahoriasArr = zanahoriasArr.filter(zanahoria => {
      if (colisiona(window.londonObj, zanahoria)) {
        sonidoComerSaludableNode.play();
        zanahoria.remove();
        updateScore(0.50);
        mostrarMensajeSalud(0.50, zanahoria.x, zanahoria.y);
        return false;
      }
      return true;
    });
  }

  function checkCollisionLondonBrocoli() {
    brocolisArr = brocolisArr.filter(brocoli => {
      if (colisiona(window.londonObj, brocoli)) {
        sonidoComerSaludableNode.play();
        brocoli.remove();
        updateScore(0.50);
        mostrarMensajeSalud(0.50, brocoli.x, brocoli.y);
        return false;
      }
      return true;
    });
  }

  function checkCollisionLondonAceite() {
    aceitesArr = aceitesArr.filter(aceite => {
      if (colisiona(window.londonObj, aceite)) {
        sonidoComerSaludableNode.play();
        aceite.remove();
        updateScore(0.20);
        mostrarMensajeSalud(0.20, aceite.x, aceite.y);
        return false;
      }
      return true;
    });
  }

  function checkCollisionLondonCarnederes() {
    carnederesesArr = carnederesesArr.filter(carnederes => {
      if (colisiona(window.londonObj, carnederes)) {
        sonidoComerSaludableNode.play();
        carnederes.remove();
        updateScore(1);
        mostrarMensajeSalud(1, carnederes.x, carnederes.y);
        return false;
      }
      return true;
    });
  }
  

  function checkCollisionLondonHuevo() {
    huevosArr = huevosArr.filter(huevo => {
      if (colisiona(window.londonObj, huevo)) {
        sonidoComerSaludableNode.play();
        huevo.remove();
        updateScore(2);
        mostrarMensajeSalud(2, huevo.x, huevo.y);
        return false;
      }
      return true;
    });
  }

  function checkCollisionLondonSandia() {
    sandiasArr = sandiasArr.filter(sandia => {
      if (colisiona(window.londonObj, sandia)) {
        sonidoComerSaludableNode.play();
        sandia.remove();
        updateScore(0.30);
        mostrarMensajeSalud(0.30, sandia.x, sandia.y);
        return false;
      }
      return true;
    });
  }

  function checkCollisionLondonPescado() {
    pescadosArr = pescadosArr.filter(pescado => {
      if (colisiona(window.londonObj, pescado)) {
        sonidoComerSaludableNode.play();
        pescado.remove();
        updateScore(1);
        mostrarMensajeSalud(1, pescado.x, pescado.y);
        return false;
      }
      return true;
    });
  }
  
  function colisiona(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
    
  // === PUNTUACIÓN ===
  function updateScore(puntos) {
    score += puntos;
    scoreNode.innerText = score;

    if (score > maxScore) {
      maxScore = score;
      maxScoreNode.innerText = `Máxima puntuación en salud: ${maxScore} (${playerName})`;
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
    if (nivelActual === 5 && !bonusStage) {
      bonusStage = true;
      activarBonusStage();
    }
  }

  function updateNivel() {
    clearInterval(manzanasIntervalId);
    clearInterval(pollitosIntervalId);
    clearInterval(chocolatesIntervalId);
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

  function activarBonusStage() {
    clearAllSpawners(); // detiene las nubes y chocolates
    mostrarMensajeBonus(); // muestra un texto en pantalla
  
    // Solo elementos positivos (manzana, pollo y nuevos saludables)
    manzanasIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      manzanasArr.push(new Manzana(gameBoxNode, y));
    }, 800);
  
    pollitosIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      pollitosArr.push(new PollitoAsado(gameBoxNode, y));
    }, 800);
  
    zanahoriaIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      zanahoriasArr.push(new Zanahoria(gameBoxNode, y));
    }, 1000);
  
    brocoliIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      brocolisArr.push(new Brocoli(gameBoxNode, y));
    }, 1000);
  
    aceiteolivaIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      aceitesArr.push(new AceiteOliva(gameBoxNode, y));
    }, 1100);
  
    carnederesIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      carnederesesArr.push(new CarneDeres(gameBoxNode, y));
    }, 1100);
  
    huevoIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      huevosArr.push(new Huevo(gameBoxNode, y));
    }, 1000);
  
    sandiaIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      sandiasArr.push(new Sandia(gameBoxNode, y));
    }, 1000);
  
    pescadoIntervalId = setInterval(() => {
      const y = Math.random() * (gameBoxNode.offsetHeight - 60);
      pescadosArr.push(new Pescado(gameBoxNode, y));
    }, 1000);
  
    // Detener el bonus después de 20 segundos
    setTimeout(() => {
      bonusStage = false;
      clearAllSpawners();
      iniciarSpawners(); // volver a los spawners normales
    }, 20000);
  }
  
    
  function clearAllSpawners() {
    clearInterval(nubesIntervalId);
    clearInterval(pollitosIntervalId);
    clearInterval(manzanasIntervalId);
    clearInterval(chocolatesIntervalId);
    clearInterval(zanahoriaIntervalId);
    clearInterval(brocoliIntervalId);
    clearInterval(aceiteolivaIntervalId);
    clearInterval(carnederesIntervalId);
    clearInterval(huevoIntervalId);
    clearInterval(sandiaIntervalId);
    clearInterval(pescadoIntervalId);
  }

  function mostrarMensajeBonus() {
    const levelMsgNode = document.getElementById("level-up-message");
    levelMsgNode.innerText = `¡BONUS DE SALUD! 🥦🥩🍉`;
    levelMsgNode.style.opacity = "0.8";
  
    setTimeout(() => {
      levelMsgNode.style.opacity = "0";
    }, 3000);
  }

  /*function ocultarMensajeBonus() {
    const msg = document.getElementById("bonus-msg");
    if (msg) msg.remove();
  }*/

  
  function mostrarMensajeSalud(puntosGanados, x = window.innerWidth / 2, y = 100) {
    const mensaje = document.createElement("div");
    mensaje.textContent = `¡+${puntosGanados} en salud!`;
    mensaje.style.position = "absolute";
    mensaje.style.left = `${x}px`;
    mensaje.style.top = `${y}px`;
    mensaje.style.transform = "translate(-50%, 0,)";
    mensaje.style.color = "#009f48 ";
    mensaje.style.border = "0.50px solid #009f48"; 
    mensaje.style.borderRadius = "8px";
    mensaje.style.fontWeight = "bold";
    mensaje.style.fontSize = "20px";
    mensaje.style.opacity = 1;
    mensaje.style.transition = "all 1s ease-out";
    mensaje.style.zIndex = 1000;
  
    document.getElementById("mensajes-salud").appendChild(mensaje);
    setTimeout(() => {
      mensaje.style.top = `${y - 40}px`;
      mensaje.style.opacity = 0;
    }, 50);
  
    setTimeout(() => {
      mensaje.remove();
    }, 1100);
  }

  // === FINAL DEL JUEGO ===
  function endGame() {
    clearInterval(gameIntervalId);
    clearInterval(nubesIntervalId);
    clearInterval(pollitosIntervalId); //alimentosaludable
    clearInterval(manzanasIntervalId); //alimentosaludable
    clearInterval(chocolatesIntervalId);
    clearInterval(brocoliIntervalId); //alimentosaludable
    clearInterval(aceiteolivaIntervalId); //alimentosaludable
    clearInterval(huevoIntervalId); //alimentosaludable
    clearInterval(pescadoIntervalId); //alimentosaludable
    clearInterval(zanahoriaIntervalId); //alimentosaludable
    clearInterval(sandiaIntervalId); //alimentosaludable
    clearInterval(carnederesIntervalId); //alimentosaludable

    mostrarRanking();

    gameScreenNode.style.display = "none";
    gameBoxNode.style.display = "none";
    gameOverScreenNode.style.display = "flex";

    scoreGameOverNode.innerText = `Tu puntuación final: ${score.toFixed(2)}`;
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
      li.innerText = `${p.name}: ${p.score.toFixed(2)} puntos`;
      rankingList.appendChild(li);
    });
  }
});


