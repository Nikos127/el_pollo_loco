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
   * Erstellt und initialisiert eine Instanz von Chicken.
   * @param {number} [x] - Horizontale Position in Pixeln.
   */
  constructor(x) {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.x = x = x ?? 300 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Startet die Intervalle für Bewegung und Animation.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(/** Aktualisiert die Bewegung im Intervall. */ () => {
      if (!this.dead) this.moveLeft();
    }, 1000 / 60);
    setStoppableInterval(/** Aktualisiert die Animation im Intervall. */ () => {
      if (!this.dead) this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
