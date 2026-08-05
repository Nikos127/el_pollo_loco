class MovableObject {
  x = 120;
  y = 280;
  img;
  width = 100;
  height = 150;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {}

  moveLeft() {}
}
