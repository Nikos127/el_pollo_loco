class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  endbossStatusBar = new EndbossStatusBar();
  statusBar = new Statusbar();
  bottleStatusBar = new BottleStatusBar();
  coinStatusBar = new CoinStatusBar();
  throwableObjects = [];
  gameOverScreen = new GameOverScreen();
  chickenSquash;
  hasWon = false;
  showWinScreen = false;

  /**
   * Creates and initializes a World instance.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.renderer = new WorldRenderer(this);
    this.renderer.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Links the character and endboss to this world.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(
      /** Links the endboss to the game world. */ (enemy) => {
        if (enemy instanceof Endboss) {
          enemy.world = this;
        }
      },
    );
  }

  /**
   * Starts the intervals for collisions, collectibles, victory checks, and throws.
   * @returns {void}
   */
  run() {
    setStoppableInterval(
      /** Updates the world. */ () => {
        this.updateWorld();
      },
      1000 / 25,
    );
    setStoppableInterval(
      /** Checks bottle throws. */ () => {
        this.checkThrowObjects();
      },
      200,
    );
  }

  /**
   * Detects a defeated endboss and schedules the victory screen.
   * @returns {void}
   */
  checkWin() {
    if (this.hasWon || this.character.isDead()) return;
    const boss = this.level.enemies.find(
      /** Checks whether the object matches the search. */ (enemy) =>
        enemy instanceof Endboss,
    );
    if (!boss || !boss.dead) return;
    this.hasWon = true;
    setTimeout(
      /** Completes the victory sequence after the delay. */ () =>
        this.finishWin(),
      1000,
    );
  }

  /**
   * Throws an available bottle while the space key is pressed.
   * @returns {void}
   */
  checkThrowObjects() {
    if (this.hasWon || this.character.isDead() || this.character.isHurt())
      return;
    if (!this.keyboard.SPACE || this.character.bottles <= 0) return;

    const bottle = new ThrowableObject(
      this.character.x + (this.character.otherDirection ? 0 : 100),
      this.character.y + 100,
      this.character.otherDirection,
    );

    this.throwableObjects.push(bottle);
    this.character.bottles--;
    new Audio('audio/throw-bottle.mp3').play();
  }

  /**
   * Collects overlapping bottles and removes them from the level.
   * @returns {void}
   */
  checkBottleCollection() {
    if (this.hasWon || this.character.isDead()) return;

    this.level.bottles = this.level.bottles.filter(
      /** Checks whether the object should remain in the list. */ (bottle) => {
        if (this.character.isColliding(bottle)) {
          this.character.bottles++;
          return false;
        }

        return true;
      },
    );
  }

  /**
   * Collects overlapping coins and removes them from the level.
   * @returns {void}
   */
  checkCoinCollection() {
    if (this.hasWon || this.character.isDead()) return;

    this.level.coins = this.level.coins.filter(
      /** Checks whether the object should remain in the list. */ (coin) => {
        if (this.character.isColliding(coin)) {
          this.character.coins++;
          return false;
        }
        return true;
      },
    );
  }

  /**
   * Checks character collisions and bottle hits for every enemy.
   * @returns {void}
   */
  checkCollidions() {
    if (this.hasWon) return;
    this.level.enemies.forEach(
      /** Handles character contact and bottle hits for this enemy. */ (
        enemy,
      ) => {
        const bottle = this.isBottleHit(enemy);
        this.checkCharacterCollision(enemy);
        this.handleBottleHit(enemy, bottle);
      },
    );
  }

  /**
   * Finds an unsplashed bottle that overlaps the target.
   * @param {MovableObject} mo - The target object.
   * @returns {ThrowableObject|undefined}
   */
  isBottleHit(mo) {
    return this.throwableObjects.find(
      /** Checks whether the object matches the search. */ (bottle) =>
        !bottle.splashed && bottle.isColliding(mo),
    );
  }

  /**
   * Handles stomping on chickens and damage from enemy contact.
   * @param {Chicken|Endboss} enemy - The enemy to check or damage.
   * @returns {void}
   */
  checkCharacterCollision(enemy) {
    if (
      !(enemy instanceof Endboss) &&
      this.character.isAboveEnemy(enemy) &&
      !enemy.dead
    ) {
      this.squashEnemy(enemy);
    } else if (this.character.isColliding(enemy) && !enemy.dead) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Kills a stomped chicken and makes the character bounce.
   * @param {Chicken|Endboss} enemy - The enemy to check or damage.
   * @returns {void}
   */
  squashEnemy(enemy) {
    enemy.currentImage = 0;
    enemy.loadImage(enemy.IMAGES_DEAD[0]);
    this.character.jump(20);
    this.removeEnemyLater(enemy);
    enemy.dead = true;
    this.chickenSquash = new Audio('audio/chicken-squash.mp3');
    this.chickenSquash.volume = 0.3;
    this.chickenSquash.play();
  }

  /**
   * Removes an enemy from the level after 1500 milliseconds.
   * @param {Chicken|Endboss} enemy - The enemy to check or damage.
   * @returns {void}
   */
  removeEnemyLater(enemy) {
    setTimeout(
      /** Removes the enemy after the delay. */ () => {
        this.level.enemies = this.level.enemies.filter(
          /** Checks whether the object should remain in the list. */ (e) =>
            e !== enemy,
        );
      },
      1500,
    );
  }

  /**
   * Handles a valid bottle hit and schedules removal of the bottle.
   * @param {Chicken|Endboss} enemy - The enemy to check or damage.
   * @param {ThrowableObject|undefined} bottle - The colliding bottle, if any.
   * @returns {void}
   */
  handleBottleHit(enemy, bottle) {
    if (!bottle || enemy.dead) return;
    bottle.splash();
    this.damageEnemy(enemy);
    this.removeBottleLater(bottle);
    if (enemy.dead) {
      new Audio('audio/chicken-squash.mp3').play();
      this.removeEnemyLater(enemy);
    }
  }

  /**
   * Damages the endboss or kills a chicken hit by a bottle.
   * @param {Chicken|Endboss} enemy - The enemy to check or damage.
   * @returns {void}
   */
  damageEnemy(enemy) {
    if (enemy instanceof Endboss) {
      enemy.hit();
      this.endbossStatusBar.setPercentage(enemy.energy);
    } else {
      enemy.dead = true;
      enemy.currentImage = 0;
      enemy.loadImage(enemy.IMAGES_DEAD[0]);
    }
  }

  /**
   * Displays the victory screen, stops game intervals, and plays the victory sound.
   * @returns {void}
   */
  finishWin() {
    this.showWinScreen = true;
    stopGame();
    new Audio('audio/won.mp3').play();
  }

  /**
   * Schedules the removal of a bottle after 500 milliseconds.
   * @param {ThrowableObject} bottle - The bottle to remove.
   * @returns {void}
   */
  removeBottleLater(bottle) {
    setTimeout(
      /** Removes the splashed bottle. */ () => {
        this.throwableObjects = this.throwableObjects.filter(
          /** Checks whether the object should remain in the list. */ (b) =>
            b !== bottle,
        );
      },
      500,
    );
  }

  /**
   * Updates the world by checking collisions, win conditions, and item collections.
   * @returns {void}
   */
  updateWorld() {
    this.checkCollidions();
    this.checkWin();
    this.checkBottleCollection();
    this.checkCoinCollection();
  }
}
