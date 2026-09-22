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

  constructor(x, y) {
    super().loadImage(
      'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    );
    this.loadImages(this.IMAGE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw();
    this.splashed = false;
  }

  throw() {
    this.speedY = 20;
    this.applyGravity();
    setStoppableInterval(() => {
      if (this.splashed) {
        return;
      } else {
        this.playAnimation(this.IMAGE);
        this.x += 10;
      }
    }, 25);
  }

  splash() {
    this.splashed = true;
    this.speedY = 0;
    this.currentImage = 0;
    setStoppableInterval(() => {
      this.playAnimationOnce(this.IMAGES_SPLASH);
    }, 60);
  }
}
