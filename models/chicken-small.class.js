class ChickenSmall extends Chicken {
  y = 345;
  width = 60;
  height = 70;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  constructor(x) {
    super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.x = x ?? 300 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  animate() {
    setStoppableInterval(() => this.moveLeft(), 1000 / 60);
    setStoppableInterval(() => this.playAnimation(this.IMAGES_WALKING), 200);
  }
}
