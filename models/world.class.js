class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];
  backgroundObjects = [];
  ctx;
  canvas;
  keyboard;
  camera_x = 0;

  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.createBackgroundObjects();
    this.draw();
    this.setWorld();
  }

  createBackgroundObjects() {
    for (let i = -2; i < 10; i++) {
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

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);

    this.ctx.translate(-this.camera_x, 0);

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
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      mo.x = mo.x * -1;
      this.ctx.restore();
    }
  }
}
