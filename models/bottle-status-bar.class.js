class BottleStatusBar extends DrawableObject {
  /**
   * Erstellt und initialisiert eine Instanz von BottleStatusBar.
   */
  constructor() {
    super();
    this.loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
    this.x = 40;
    this.y = 65;
    this.width = 45;
    this.height = 45;
  }

  /**
   * Zeichnet das Symbol und die aktuelle Anzahl.
   * @param {CanvasRenderingContext2D} ctx - 2D-Zeichenkontext.
   * @param {number} amout - Anzuzeigende Anzahl.
   * @returns {void}
   */
  draw(ctx, amout) {
    super.draw(ctx);
    ctx.save();
    this.setTextStyle(ctx);
    const text = `x ${amout}`;
    const x = this.x + this.width + 10;
    const y = this.y + this.height / 2;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * Legt Schrift, Ausrichtung und Farben der Zähleranzeige fest.
   * @param {CanvasRenderingContext2D} ctx - 2D-Zeichenkontext.
   * @returns {void}
   */
  setTextStyle(ctx) {
    ctx.font = 'bold 28px sans-serif';
    ctx.txtAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.linewidth = 3;
    ctx.strokeStyle = '#803300';
    ctx.fillStyle = 'white';
  }
}
