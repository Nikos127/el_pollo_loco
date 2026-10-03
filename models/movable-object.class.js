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

  /**
   * Updates vertical position and speed at regular intervals.
   * @returns {void}
   */
  applyGravity() {
    setStoppableInterval(() => {
      this.previousY = this.y;
      if ((this.isAboveGround() || this.speedY > 0) && !this.splashed) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      this.speedY = Math.max(this.speedY, -30);
    }, 1000 / 25);
  }

  /**
   * Checks whether the object is airborne; thrown bottles always return true.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.groundlevel;
    }
  }

  /**
   * Reduces health on a valid hit and handles injury or death.
   * @returns {void}
   */
  hit() {
    if (this.isDead() || this.isHurt()) {
      return;
    }
    this.energy -= 5;
    if (this.energy <= 0) {
      this.handleDeath();
    } else {
      this.lastHit = getGameTime();
      new Audio('audio/hurt.mp3').play();
    }
  }

  /**
   * Checks whether health is zero.
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks whether the last hit occurred less than half a second ago.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = getGameTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Checks whether the collision rectangles of both objects overlap.
   * @param {MovableObject} mo - The target object.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Moves the object to the right by its current speed.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its current speed.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Displays the next frame of a looping animation.
   * @param {string[]} images - Animation image paths.
   * @returns {void}
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Advances the animation and keeps displaying its final frame.
   * @param {string[]} images - Animation image paths.
   * @returns {void}
   */
  playAnimationOnce(images) {
    let i = Math.min(this.currentImage, images.length - 1);
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Sets health to zero, records the death time, and plays the death sound.
   * @returns {void}
   */
  handleDeath() {
    this.energy = 0;
    this.timeOfDeath = getGameTime();
    this.currentImage = 0;
    new Audio('audio/character-die.mp3').play();
  }
}
