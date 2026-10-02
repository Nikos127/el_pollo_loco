class Coin extends MovableObject {
  width = 45;
  height = 45;

  /**
   * Erstellt und initialisiert eine Instanz von Coin.
   * @param {number} x - Horizontale Position in Pixeln.
   * @param {number} y - Vertikale Position in Pixeln.
   */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage('img/7_statusbars/3_icons/icon_coin.png');
  }
}
