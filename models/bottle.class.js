class Bottle extends MovableObject {
  width = 60;
  height = 60;
  y = 355;

  /**
   * Erstellt und initialisiert eine Instanz von Bottle.
   * @param {number} x - Horizontale Position in Pixeln.
   * @param {number} variant - Nummer der Bildvariante.
   */
  constructor(x, variant) {
    super();
    this.x = x;
    this.loadImage(`img/6_salsa_bottle/${variant}_salsa_bottle_on_ground.png`);
  }
}
