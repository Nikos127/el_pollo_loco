class DrawableObject {
  x = 120;
  y = 280;
  img;
  width = 100;
  height = 150;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads a single image as the current object image.
   * @param {string} path - The image path.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D drawing context.
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads the supplied image paths into the image cache.
   * @param {string[]} arr - Image paths to load.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach(/** Loads an image path into the cache. */ (path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
