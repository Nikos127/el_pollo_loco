class Bottle extends MovableObject {
  width = 60;
  height = 60;
  y = 355;

  constructor(x, variant) {
    super();
    this.x = x;
    this.loadImage(`img/6_salsa_bottle/${variant}_salsa_bottle_on_ground.png`);
  }
}
