class Level {
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 4000;

  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.createBackgroundObjects();
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
