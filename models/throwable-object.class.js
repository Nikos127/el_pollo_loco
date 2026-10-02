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
   * Erstellt und initialisiert eine Instanz von ThrowableObject.
   * @param {number} x - Horizontale Position in Pixeln.
   * @param {number} y - Vertikale Position in Pixeln.
   */
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

  /**
   * Startet Flugbewegung, Schwerkraft und Rotation der Flasche.
   * @returns {void}
   */
  throw() {
    this.speedY = 20;
    this.applyGravity();
    setStoppableInterval(/** Animiert und bewegt die fliegende Flasche. */ () => {
      if (this.splashed) {
        return;
      } else {
        this.playAnimation(this.IMAGE);
        this.x += 10;
      }
    }, 25);
  }

  /**
   * Stoppt die Flugbewegung und startet die Spritzanimation.
   * @returns {void}
   */
  splash() {
    this.splashed = true;
    this.speedY = 0;
    this.currentImage = 0;
    setStoppableInterval(/** Zeigt das nächste Bild der Spritzanimation. */ () => {
      this.playAnimationOnce(this.IMAGES_SPLASH);
    }, 60);
  }
}
