class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates and initializes a BackgroundObject instance.
   * @param {string} imagePath - The image path.
   * @param {number} x - Horizontal position in pixels.
   * @param {number} [y] - Currently unused; the object is aligned with the ground.
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
