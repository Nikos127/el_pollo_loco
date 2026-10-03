class ThrowableObject extends MovableObject {
  IMAGE = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  /**
   * Creates and initializes a ThrowableObject instance.
   * @param {number} x - Horizontal position in pixels.
   * @param {number} y - Vertical position in pixels.
   */
  constructor(x, y, otherDirection = false) {
    super().loadImage(
      'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    );
    this.loadImages(this.IMAGE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.otherDirection = otherDirection;
    this.throw();
    this.splashed = false;
  }

  /**
   * Starts the flight, gravity, and rotation of the bottle.
   * @returns {void}
   */
  throw() {
    this.speedY = 20;
    this.applyGravity();
    setStoppableInterval(
      /** Animates and moves the flying bottle. */ () => {
        if (this.splashed) {
          return;
        } else {
          this.playAnimation(this.IMAGE);
          this.x += this.otherDirection ? -10 : 10;
        }
      },
      25,
    );
  }

  /**
   * Stops the bottle flight and starts the splash animation.
   * @returns {void}
   */
  splash() {
    this.splashed = true;
    this.speedY = 0;
    this.currentImage = 0;
    setStoppableInterval(
      /** Displays the next splash animation frame. */ () => {
        this.playAnimationOnce(this.IMAGES_SPLASH);
      },
      60,
    );
  }
}
