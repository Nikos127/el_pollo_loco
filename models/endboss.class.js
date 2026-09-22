class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  dead = false;
  hits = 0;

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 3500;
    this.animate();
  }

  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  hit() {
    this.hits++;
    if (this.hits >= 3) {
      this.dead = true;
      this.currentImage = 0;
    }
  }
}
