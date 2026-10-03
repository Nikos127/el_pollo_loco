class CoinStatusBar extends DrawableObject {
  /**
   * Creates and initializes a CoinStatusBar instance.
   */
  constructor() {
    super();
    this.loadImage('img/7_statusbars/3_icons/icon_coin.png');
    this.x = 40;
    this.y = 115;
    this.width = 45;
    this.height = 45;
  }

  /**
   * Draws the icon and current count.
   * @param {CanvasRenderingContext2D} ctx - The 2D drawing context.
   * @param {number} amount - The count to display.
   * @returns {void}
   */
  draw(ctx, amount) {
    super.draw(ctx);
    ctx.save();
    this.setTextStyle(ctx);
    const text = `× ${amount}`;
    const x = this.x + this.width + 10;
    const y = this.y + this.height / 2;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * Sets the font, alignment, and colors for the counter text.
   * @param {CanvasRenderingContext2D} ctx - The 2D drawing context.
   * @returns {void}
   */
  setTextStyle(ctx) {
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#803300';
    ctx.fillStyle = 'white';
  }
}
