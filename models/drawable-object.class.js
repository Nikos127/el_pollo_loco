class DrawableObject {
  x = 120;
  y = 280;
  img;
  width = 100;
  height = 150;
  imageCache = {};
  currentImage = 0;

  /**
   * Lädt ein einzelnes Bild als aktuelles Objektbild.
   * @param {string} path - Pfad zum Bild.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Zeichnet das Objekt auf die Zeichenfläche.
   * @param {CanvasRenderingContext2D} ctx - 2D-Zeichenkontext.
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Lädt die angegebenen Bilder in den Bildcache.
   * @param {string[]} arr - Zu ladende Bildpfade.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach(/** Lädt einen Bildpfad in den Cache. */ (path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
