class CoinStatusBar extends DrawableObject {
  constructor() {
    super();
    this.loadImage('img/7_statusbars/3_icons/icon_coin.png');
    this.x = 40;
    this.y = 115;
    this.width = 45;
    this.height = 45;
  }

  draw(ctx, amount) {
    super.draw(ctx);

    ctx.save();
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#803300';
    ctx.fillStyle = 'white';

    const text = `× ${amount}`;
    const x = this.x + this.width + 10;
    const y = this.y + this.height / 2;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
