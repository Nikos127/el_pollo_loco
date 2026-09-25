class Coin extends MovableObject {
  width = 45;
  height = 45;

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage('img/7_statusbars/3_icons/icon_coin.png');
  }
}
