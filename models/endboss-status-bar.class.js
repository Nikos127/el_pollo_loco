class EndbossStatusBar extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/2_statusbar_endboss/green/green0.png',
    'img/7_statusbars/2_statusbar_endboss/green/green20.png',
    'img/7_statusbars/2_statusbar_endboss/green/green40.png',
    'img/7_statusbars/2_statusbar_endboss/green/green60.png',
    'img/7_statusbars/2_statusbar_endboss/green/green80.png',
    'img/7_statusbars/2_statusbar_endboss/green/green100.png',
  ];

  constructor() {
    super();
    this.x = 480;
    this.y = 5;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  setPercentage(persentage) {
    const value = Math.max(0, Math.min(100, persentage));
    const index = Math.ceil(value / 20);
    this.img = this.imageCache[this.IMAGES[index]];
  }
}
