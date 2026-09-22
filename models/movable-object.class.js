class MovableObject extends DrawableObject {
  offset = { top: 0, right: 0, bottom: 0, left: 0 };
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  timeOfDeath = 0;
  groundlevel = 165;

  applyGravity() {
    setStoppableInterval(() => {
      if ((this.isAboveGround() || this.speedY > 0) && !this.splashed) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (this.speedY < -30) {
        this.speedY = -30;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.groundlevel;
    }
  }

  hit() {
    if (this.isDead() || this.isHurt()) {
      return;
    }
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
      this.timeOfDeath = new Date().getTime();
      this.currentImage = 0;
      new Audio('audio/character-die.mp3').play();
    } else {
      this.lastHit = new Date().getTime();
      new Audio('audio/hurt.mp3').play();
      w;
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  playAnimationOnce(images) {
    let i = Math.min(this.currentImage, images.length - 1);
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}
