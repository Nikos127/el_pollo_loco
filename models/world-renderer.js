class WorldRenderer {
  constructor(world) {
    this.world = world;
  }

  /**
   * Draws a complete frame and schedules the next one.
   * @returns {void}
   */
  draw() {
    const world = this.world;
    world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    this.drawEndbossStatusBar();
    this.drawWinScreen();
    this.drawLossScreen();
    world.animationFrameId = requestAnimationFrame(
      /** Draws the next frame. */ () => this.draw(),
    );
  }

  /**
   * Draws all objects in the supplied list.
   * @param {DrawableObject[]} objects - Objects to draw.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach(
      /** Draws the current object. */ (o) => {
        this.addToMap(o);
      },
    );
  }

  /**
   * Draws an object in its current facing direction.
   * @param {DrawableObject} mo - The object to draw or mirror.
   * @returns {void}
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.world.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Mirrors the drawing context and the horizontal object position.
   * @param {DrawableObject} mo - The object to draw or mirror.
   * @returns {void}
   */
  flipImage(mo) {
    this.world.ctx.save();
    this.world.ctx.translate(mo.width, 0);
    this.world.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the object position and drawing context after mirroring.
   * @param {DrawableObject} mo - The object to draw or mirror.
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.world.ctx.restore();
  }

  /**
   * Draws the background and clouds with the camera offset.
   * @returns {void}
   */
  drawBackground() {
    const world = this.world;
    world.ctx.translate(world.camera_x, 0);
    this.addObjectsToMap(world.level.backgroundObjects);
    this.addObjectsToMap(world.level.clouds);
    world.ctx.translate(-world.camera_x, 0);
  }

  /**
   * Draws health, bottle count, and coin count.
   * @returns {void}
   */
  drawStatusBars() {
    const world = this.world;
    this.addToMap(world.statusBar);
    world.bottleStatusBar.draw(world.ctx, world.character.bottles);
    world.coinStatusBar.draw(world.ctx, world.character.coins);
  }

  /**
   * Draws the character, collectibles, enemies, and thrown bottles.
   * @returns {void}
   */
  drawGameObjects() {
    const world = this.world;
    world.ctx.translate(world.camera_x, 0);
    this.addToMap(world.character);
    this.addObjectsToMap(world.level.bottles);
    this.addObjectsToMap(world.level.coins);
    this.addObjectsToMap(world.level.enemies);
    this.addObjectsToMap(world.throwableObjects);
    world.ctx.translate(-world.camera_x, 0);
  }

  /**
   * Draws the health bar while the endboss is on screen.
   * @returns {void}
   */
  drawEndbossStatusBar() {
    const world = this.world;
    const boss = world.level.enemies.find(
      /** Checks whether the object matches the search. */ (enemy) =>
        enemy instanceof Endboss,
    );
    if (
      boss &&
      boss.x + world.camera_x < world.canvas.width &&
      boss.x + boss.width + world.camera_x > 0
    ) {
      this.addToMap(world.endbossStatusBar);
    }
  }

  /**
   * Displays the victory screen and restart button when victory is ready.
   * @returns {void}
   */
  drawWinScreen() {
    const world = this.world;
    if (world.showWinScreen) {
      world.gameOverScreen.img =
        world.gameOverScreen.imageCache[world.gameOverScreen.IMAGES_WON[0]];
      this.addToMap(world.gameOverScreen);
      document.getElementById('restart-button').hidden = false;
    }
  }

  /**
   * Displays the defeat screens after the respective death delays.
   * @returns {void}
   */
  drawLossScreen() {
    const world = this.world;
    if (!world.character.isDead() || world.hasWon) return;

    const timeSinceDead = getGameTime() - world.character.timeOfDeath;
    if (timeSinceDead >= 3500) {
      world.gameOverScreen.img =
        world.gameOverScreen.imageCache[world.gameOverScreen.IMAGES_LOST[1]];
      this.addToMap(world.gameOverScreen);
      document.getElementById('restart-button').hidden = false;
    } else if (timeSinceDead >= 2000) {
      this.addToMap(world.gameOverScreen);
    }
  }
}
