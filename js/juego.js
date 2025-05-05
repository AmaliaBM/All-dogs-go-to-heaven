class Game {
    constructor() {
      this.gameMusic = new Audio("./sounds/bajo-del-mar.mp3");
      this.gameMusic.volume = 0.2;
      this.gameMusic.loop = true;
      this.winLife = new Audio("./sounds/woo-hoo.mp3");
      this.winLife.volume = 0.2;
      this.loseLife = new Audio("./sounds/pierde-vida.mp3");
      this.loseLife.volume = 0.2;
      this.eatsBone = new Audio("./sounds/points.mp3");
      this.eatsBone.volume = 0.2;
      this.canPlaySound = true;
    }
}