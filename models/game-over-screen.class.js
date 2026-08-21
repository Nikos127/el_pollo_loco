class GameOverScreen extends DrawableObject {
  IMAGES_LOST = [
    'img/You won, you lost/You lost.png',
    'img/You won, you lost/Game Over.png',
  ];

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;

    this.loadImage('img/You won, you lost/You lost.png');
    this.loadImages(this.IMAGES_LOST);
  }
}
