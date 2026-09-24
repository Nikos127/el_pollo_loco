class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  endbossStatusBar = new EndbossStatusBar();
  statusBar = new Statusbar();
  throwableObjects = [];
  gameOverScreen = new GameOverScreen();
  chickenSquash;
  hasWon = false;
  showWinScreen = false;

  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  run() {
    setStoppableInterval(() => {
      this.checkCollidions();
      this.checkWin();
    }, 1000 / 25);
    setStoppableInterval(() => {
      this.checkThrowObjects();
    }, 200);
  }

  checkWin() {
    if (this.hasWon || this.character.isDead()) return;

    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);

    if (!boss || !boss.dead) return;

    this.hasWon = true;

    setTimeout(() => {
      this.showWinScreen = true;
      stopGame();
      new Audio('audio/won.mp3').play();

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }, 1000);
  }

  checkThrowObjects() {
    if (this.hasWon) return;
    if (this.keyboard.SPACE) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      new Audio('audio/throw-bottle.mp3').play();
    }
  }

  checkCollidions() {
    if (this.hasWon) return;
    this.level.enemies.forEach((enemy) => {
      let bottle = this.isBottleHit(enemy);
      if (
        !(enemy instanceof Endboss) &&
        this.character.isAboveEnemy(enemy) &&
        !enemy.dead
      ) {
        enemy.currentImage = 0;
        enemy.loadImage(enemy.IMAGES_DEAD[0]);
        this.character.jump(20);
        setTimeout(() => {
          this.level.enemies = this.level.enemies.filter((e) => e !== enemy);
        }, 1500);
        enemy.dead = true;
        this.chickenSquash = new Audio('audio/chicken-squash.mp3');
        this.chickenSquash.volume = 0.3;
        this.chickenSquash.play();
      } else if (this.character.isColliding(enemy) && !enemy.dead) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
      if (bottle && !enemy.dead) {
        bottle.splash();

        if (enemy instanceof Endboss) {
          enemy.hit();
          this.endbossStatusBar.setPercentage(enemy.energy);
        } else {
          enemy.dead = true;
          enemy.currentImage = 0;
          enemy.loadImage(enemy.IMAGES_DEAD[0]);
        }

        setTimeout(() => {
          this.throwableObjects = this.throwableObjects.filter(
            (b) => b !== bottle,
          );
        }, 500);

        if (enemy.dead) {
          new Audio('audio/chicken-squash.mp3').play();

          setTimeout(() => {
            this.level.enemies = this.level.enemies.filter((e) => e !== enemy);
          }, 1500);
        }
      }
    });
  }

  isBottleHit(mo) {
    return this.throwableObjects.find(
      (bottle) => !bottle.splashed && bottle.isColliding(mo),
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);

    if (
      boss &&
      boss.x + this.camera_x < this.canvas.width &&
      boss.x + boss.width + this.camera_x > 0
    ) {
      this.addToMap(this.endbossStatusBar);
    }

    if (this.showWinScreen) {
      this.gameOverScreen.img =
        this.gameOverScreen.imageCache[this.gameOverScreen.IMAGES_WON[0]];
      this.addToMap(this.gameOverScreen);
    }
    if (this.character.isDead() && !this.hasWon) {
      let timeSinceDead = new Date().getTime() - this.character.timeOfDeath;
      if (timeSinceDead >= 3500) {
        this.gameOverScreen.img =
          this.gameOverScreen.imageCache[this.gameOverScreen.IMAGES_LOST[1]];
        this.addToMap(this.gameOverScreen);
      } else if (timeSinceDead >= 2000) {
        this.addToMap(this.gameOverScreen);
      } else {
        this.img;
      }
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
