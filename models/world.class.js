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
   * Erstellt und initialisiert eine Instanz von World.
   * @param {HTMLCanvasElement} canvas - Zeichenfläche des Spiels.
   */
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Verknüpft die Spielfigur und den Endboss mit dieser Spielwelt.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(/** Verknüpft den Endboss mit der Spielwelt. */ (enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  /**
   * Startet die Intervalle für Kollisionen, Sammelobjekte, Sieg und Würfe.
   * @returns {void}
   */
  run() {
    setStoppableInterval(/** Prüft Kollisionen, Sieg und Sammelobjekte. */ () => {
      this.checkCollidions();
      this.checkWin();
      this.checkBottleCollection();
      this.checkCoinCollection();
    }, 1000 / 25);
    setStoppableInterval(/** Prüft den nächsten Flaschenwurf. */ () => {
      this.checkThrowObjects();
    }, 200);
  }

  /**
   * Erkennt den besiegten Endboss und plant den Siegbildschirm.
   * @returns {void}
   */
  checkWin() {
    if (this.hasWon || this.character.isDead()) return;
    const boss = this.level.enemies.find(/** Prüft, ob das gesuchte Objekt übereinstimmt. */ (enemy) => enemy instanceof Endboss);
    if (!boss || !boss.dead) return;
    this.hasWon = true;
    setTimeout(/** Schließt den Sieg nach der Wartezeit ab. */ () => this.finishWin(), 1000);
  }

  /**
   * Wirft bei gedrückter Leertaste eine verfügbare Flasche.
   * @returns {void}
   */
  checkThrowObjects() {
    if (this.hasWon || this.character.isDead()) return;
    if (!this.keyboard.SPACE || this.character.bottles <= 0) return;

    const bottle = new ThrowableObject(
      this.character.x + 100,
      this.character.y + 100,
    );

    this.throwableObjects.push(bottle);
    this.character.bottles--;
    new Audio('audio/throw-bottle.mp3').play();
  }

  /**
   * Sammelt berührte Flaschen ein und entfernt sie aus dem Level.
   * @returns {void}
   */
  checkBottleCollection() {
    if (this.hasWon || this.character.isDead()) return;

    this.level.bottles = this.level.bottles.filter(/** Prüft, ob das Objekt in der Liste verbleiben soll. */ (bottle) => {
      if (this.character.isColliding(bottle)) {
        this.character.bottles++;
        return false;
      }

      return true;
    });
  }

  /**
   * Sammelt berührte Münzen ein und entfernt sie aus dem Level.
   * @returns {void}
   */
  checkCoinCollection() {
    if (this.hasWon || this.character.isDead()) return;

    this.level.coins = this.level.coins.filter(/** Prüft, ob das Objekt in der Liste verbleiben soll. */ (coin) => {
      if (this.character.isColliding(coin)) {
        this.character.coins++;
        return false;
      }
      return true;
    });
  }

  /**
   * Prüft Gegnerkontakte und Flaschentreffer für alle Gegner.
   * @returns {void}
   */
  checkCollidions() {
    if (this.hasWon) return;
    this.level.enemies.forEach(/** Behandelt Spielfigurkontakt und Flaschentreffer für diesen Gegner. */ (enemy) => {
      const bottle = this.isBottleHit(enemy);
      this.checkCharacterCollision(enemy);
      this.handleBottleHit(enemy, bottle);
    });
  }

  /**
   * Sucht eine noch nicht zerplatzte Flasche, die das Ziel berührt.
   * @param {MovableObject} mo - Zu prüfendes oder zu zeichnendes Objekt.
   * @returns {ThrowableObject|undefined}
   */
  isBottleHit(mo) {
    return this.throwableObjects.find(
      /** Prüft, ob das gesuchte Objekt übereinstimmt. */ (bottle) => !bottle.splashed && bottle.isColliding(mo),
    );
  }

  /**
   * Zeichnet einen vollständigen Frame und plant den nächsten.
   * @returns {void}
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    this.drawEndbossStatusBar();
    this.drawWinScreen();
    this.drawLossScreen();
    this.animationFrameId = requestAnimationFrame(/** Zeichnet den nächsten Frame. */ () => this.draw());
  }

  /**
   * Zeichnet alle übergebenen Objekte.
   * @param {DrawableObject[]} objects - Zu zeichnende Objekte.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach(/** Zeichnet das aktuelle Objekt. */ (o) => {
      this.addToMap(o);
    });
  }

  /**
   * Zeichnet ein Objekt mit seiner aktuellen Blickrichtung.
   * @param {MovableObject} mo - Zu prüfendes oder zu zeichnendes Objekt.
   * @returns {void}
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Spiegelt den Zeichenkontext und die horizontale Objektposition.
   * @param {MovableObject} mo - Zu prüfendes oder zu zeichnendes Objekt.
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Stellt Objektposition und Zeichenkontext nach dem Spiegeln wieder her.
   * @param {MovableObject} mo - Zu prüfendes oder zu zeichnendes Objekt.
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Zeichnet Hintergrund und Wolken mit Kameraverschiebung.
   * @returns {void}
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Zeichnet Lebensenergie sowie Flaschen- und Münzanzahl.
   * @returns {void}
   */
  drawStatusBars() {
    this.addToMap(this.statusBar);
    this.bottleStatusBar.draw(this.ctx, this.character.bottles);
    this.coinStatusBar.draw(this.ctx, this.character.coins);
  }

  /**
   * Zeichnet Spielfigur, Sammelobjekte, Gegner und geworfene Flaschen.
   * @returns {void}
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Zeichnet die Boss-Lebensanzeige, wenn der Boss im Bild liegt.
   * @returns {void}
   */
  drawEndbossStatusBar() {
    const boss = this.level.enemies.find(/** Prüft, ob das gesuchte Objekt übereinstimmt. */ (enemy) => enemy instanceof Endboss);
    if (
      boss &&
      boss.x + this.camera_x < this.canvas.width &&
      boss.x + boss.width + this.camera_x > 0
    ) {
      this.addToMap(this.endbossStatusBar);
    }
  }

  /**
   * Zeichnet bei freigegebenem Sieg den Endbildschirm und zeigt den Neustartbutton.
   * @returns {void}
   */
  drawWinScreen() {
    if (this.showWinScreen) {
      this.gameOverScreen.img =
        this.gameOverScreen.imageCache[this.gameOverScreen.IMAGES_WON[0]];
      this.addToMap(this.gameOverScreen);
      document.getElementById('restart-button').hidden = false;
    }
  }

  /**
   * Zeichnet nach dem Tod zeitversetzt die Niederlagenbilder.
   * @returns {void}
   */
  drawLossScreen() {
    if (!this.character.isDead() || this.hasWon) return;
    const timeSinceDead = new Date().getTime() - this.character.timeOfDeath;
    if (timeSinceDead >= 3500) {
      this.gameOverScreen.img =
        this.gameOverScreen.imageCache[this.gameOverScreen.IMAGES_LOST[1]];
      this.addToMap(this.gameOverScreen);
      document.getElementById('restart-button').hidden = false;
    } else if (timeSinceDead >= 2000) {
      this.addToMap(this.gameOverScreen);
    }
  }

  /**
   * Behandelt Draufspringen auf Hühner und schädlichen Gegnerkontakt.
   * @param {Chicken|Endboss} enemy - Zu prüfender oder getroffener Gegner.
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
   * Tötet ein übersprungenes Huhn und lässt die Spielfigur abprallen.
   * @param {Chicken|Endboss} enemy - Zu prüfender oder getroffener Gegner.
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
   * Entfernt einen Gegner nach 1500 Millisekunden aus dem Level.
   * @param {Chicken|Endboss} enemy - Zu prüfender oder getroffener Gegner.
   * @returns {void}
   */
  removeEnemyLater(enemy) {
    setTimeout(/** Entfernt den Gegner nach der Wartezeit. */ () => {
      this.level.enemies = this.level.enemies.filter(/** Prüft, ob das Objekt in der Liste verbleiben soll. */ (e) => e !== enemy);
    }, 1500);
  }

  /**
   * Behandelt einen gültigen Flaschentreffer und entfernt die Flasche verzögert.
   * @param {Chicken|Endboss} enemy - Zu prüfender oder getroffener Gegner.
   * @param {ThrowableObject|undefined} bottle - Getroffene Flasche, sofern vorhanden.
   * @returns {void}
   */
  handleBottleHit(enemy, bottle) {
    if (!bottle || enemy.dead) return;
    bottle.splash();
    this.damageEnemy(enemy);
    setTimeout(/** Entfernt die zerplatzte Flasche. */ () => {
      this.throwableObjects = this.throwableObjects.filter(/** Prüft, ob das Objekt in der Liste verbleiben soll. */ (b) => b !== bottle);
    }, 500);
    if (enemy.dead) {
      new Audio('audio/chicken-squash.mp3').play();
      this.removeEnemyLater(enemy);
    }
  }

  /**
   * Verletzt den Endboss oder tötet ein getroffenes Huhn.
   * @param {Chicken|Endboss} enemy - Zu prüfender oder getroffener Gegner.
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
   * Zeigt den Siegbildschirm, stoppt die Spielintervalle und spielt den Siegton.
   * @returns {void}
   */
  finishWin() {
    this.showWinScreen = true;
    stopGame();
    new Audio('audio/won.mp3').play();
  }
}
