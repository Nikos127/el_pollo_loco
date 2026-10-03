class Chicken extends MovableObject {
  y = 320;
  width = 80;
  height = 100;
  dead = false;

  offset = {
    top: 15,
    bottom: 20,
    left: 15,
    right: 15,
  };

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMAGES_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  /**
   * Creates and initializes a Chicken instance.
   * @param {number} [x] - Horizontal position in pixels.
   */
  constructor(x) {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.x = x = x ?? 300 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Starts the movement and animation intervals.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(/** Updates movement on each interval tick. */ () => {
      if (!this.dead) this.moveLeft();
    }, 1000 / 60);
    setStoppableInterval(/** Updates animation on each interval tick. */ () => {
      if (!this.dead) this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
