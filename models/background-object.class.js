class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Erstellt und initialisiert eine Instanz von BackgroundObject.
   * @param {string} imagePath - Pfad zum Bild.
   * @param {number} x - Horizontale Position in Pixeln.
   * @param {number} [y] - Derzeit unbenutzt; die Höhe wird am Boden ausgerichtet.
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
