class Coin extends MovableObject {
  width = 45;
  height = 45;

  /**
   * Creates and initializes a Coin instance.
   * @param {number} x - Horizontal position in pixels.
   * @param {number} y - Vertical position in pixels.
   */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage('img/7_statusbars/3_icons/icon_coin.png');
  }
}
