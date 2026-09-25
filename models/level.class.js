class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles = [];
  coins = [];
  level_end_x = 4000;

  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.createBackgroundObjects();
    this.createBottles();
    this.createCoins();
  }

  createBottles() {
    for (let i = 0; i < 24; i++) {
      const x = 350 + i * 150;
      const variant = (i % 2) + 1;
      this.bottles.push(new Bottle(x, variant));
    }
  }

  createCoins() {
    const heights = [340, 240, 160];

    for (let x = 450; x < this.level_end_x - 150; ) {
      const index = Math.floor(Math.random() * heights.length);
      this.coins.push(new Coin(x, heights[index]));

      x += 180 + Math.floor(Math.random() * 181);
    }
  }

  createBackgroundObjects() {
    for (let i = -1; i < 7; i++) {
      let currentBackground;
      const x = i * 720;
      if (i % 2 == 0) {
        currentBackground = 1;
      } else {
        currentBackground = 2;
      }
      this.backgroundObjects.push(
        new BackgroundObject('img/5_background/layers/air.png', x),
        new BackgroundObject(
          `img/5_background/layers/3_third_layer/${currentBackground}.png`,
          x,
        ),
        new BackgroundObject(
          `img/5_background/layers/2_second_layer/${currentBackground}.png`,
          x,
        ),
        new BackgroundObject(
          `img/5_background/layers/1_first_layer/${currentBackground}.png`,
          x,
        ),
      );
    }
  }
}
