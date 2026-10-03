class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles = [];
  coins = [];
  level_end_x = 4000;

  /**
   * Creates and initializes a Level instance.
   * @param {Array<Chicken|Endboss>} enemies - The level enemies.
   * @param {Cloud[]} clouds - The level clouds.
   * @param {BackgroundObject[]} backgroundObjects - The level background objects.
   */
  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.createBackgroundObjects();
    this.createBottles();
    this.createCoins();
  }

  /**
   * Places bottles with alternating image variants throughout the level.
   * @returns {void}
   */
  createBottles() {
    for (let i = 0; i < 24; i++) {
      const x = 350 + i * 150;
      const variant = (i % 2) + 1;
      this.bottles.push(new Bottle(x, variant));
    }
  }

  /**
   * Places coins at randomized heights and horizontal intervals.
   * @returns {void}
   */
  createCoins() {
    const heights = [340, 240, 160];

    for (let x = 450; x < this.level_end_x - 150; ) {
      const index = Math.floor(Math.random() * heights.length);
      this.coins.push(new Coin(x, heights[index]));

      x += 180 + Math.floor(Math.random() * 181);
    }
  }

  /**
   * Creates alternating background sections throughout the level.
   * @returns {void}
   */
  createBackgroundObjects() {
    for (let i = -1; i < 7; i++) {
      const x = i * 720;
      const variant = i % 2 === 0 ? 1 : 2;
      this.addBackgroundSection(x, variant);
    }
  }

  /**
   * Creates the four background layers for one section.
   * @param {number} x - Horizontal position in pixels.
   * @param {number} variant - The image variant number.
   * @returns {void}
   */
  addBackgroundSection(x, variant) {
    const basePath = 'img/5_background/layers/';
    const layers = [
      'air.png',
      `3_third_layer/${variant}.png`,
      `2_second_layer/${variant}.png`,
      `1_first_layer/${variant}.png`,
    ];
    layers.forEach(/** Creates the current background layer. */ (layer) => {
      this.backgroundObjects.push(new BackgroundObject(basePath + layer, x));
    });
  }
}
