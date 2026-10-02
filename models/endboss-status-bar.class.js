class EndbossStatusBar extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/2_statusbar_endboss/green/green0.png',
    'img/7_statusbars/2_statusbar_endboss/green/green20.png',
    'img/7_statusbars/2_statusbar_endboss/green/green40.png',
    'img/7_statusbars/2_statusbar_endboss/green/green60.png',
    'img/7_statusbars/2_statusbar_endboss/green/green80.png',
    'img/7_statusbars/2_statusbar_endboss/green/green100.png',
  ];

  /**
   * Erstellt und initialisiert eine Instanz von EndbossStatusBar.
   */
  constructor() {
    super();
    this.x = 480;
    this.y = 5;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Aktualisiert das Bild der Lebensanzeige anhand des Energiewerts.
   * @param {number} persentage - Lebensenergie in Prozent.
   * @returns {void}
   */
  setPercentage(persentage) {
    const value = Math.max(0, Math.min(100, persentage));
    const index = Math.ceil(value / 20);
    this.img = this.imageCache[this.IMAGES[index]];
  }
}
