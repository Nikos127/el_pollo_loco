class Bottle extends MovableObject {
  width = 60;
  height = 60;
  y = 355;

  /**
   * Creates and initializes a Bottle instance.
   * @param {number} x - Horizontal position in pixels.
   * @param {number} variant - The image variant number.
   */
  constructor(x, variant) {
    super();
    this.x = x;
    this.loadImage(`img/6_salsa_bottle/${variant}_salsa_bottle_on_ground.png`);
  }
}
