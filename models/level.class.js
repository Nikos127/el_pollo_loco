class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles = [];
  coins = [];
  level_end_x = 4000;

  /**
   * Erstellt und initialisiert eine Instanz von Level.
   * @param {Array<Chicken|Endboss>} enemies - Gegner des Levels.
   * @param {Cloud[]} clouds - Wolken des Levels.
   * @param {BackgroundObject[]} backgroundObjects - Hintergrundobjekte des Levels.
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
   * Verteilt Flaschen mit wechselnden Bildvarianten im Level.
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
   * Verteilt Münzen mit zufälligen Höhen und Abständen im Level.
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
   * Erstellt abwechselnde Hintergrundabschnitte für das Level.
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
   * Erstellt die vier Hintergrundebenen eines Abschnitts.
   * @param {number} x - Horizontale Position in Pixeln.
   * @param {number} variant - Nummer der Bildvariante.
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
    layers.forEach(/** Erstellt die aktuelle Hintergrundebene. */ (layer) => {
      this.backgroundObjects.push(new BackgroundObject(basePath + layer, x));
    });
  }
}
