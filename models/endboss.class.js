class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  dead = false;
  hits = 0;
  world;
  activated = false;
  attacking = false;
  animationState = 'alert';

  offset = {
    top: 60,
    bottom: 30,
    left: 20,
    right: 30,
  };

  IMAGES_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  /**
   * Creates and initializes a Endboss instance.
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 3500;
    this.animate();
  }

  /**
   * Starts the movement and animation intervals.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(/** Updates movement on each interval tick. */ () => this.updateMovement(), 1000 / 60);
    setStoppableInterval(/** Updates animation on each interval tick. */ () => this.updateAnimation(), 200);
  }

  /**
   * Activates the visible endboss and updates its pursuit.
   * @returns {void}
   */
  updateMovement() {
    if (!this.world || this.dead || this.world.character.isDead()) return;
    this.activateWhenVisible();
    if (!this.activated) return;
    this.followCharacter();
  }

  /**
   * Counts a bottle hit and marks the endboss as dead after the final hit.
   * @returns {void}
   */
  hit() {
    if (this.dead) return;
    this.hits++;
    this.energy = Math.max(0, 100 - this.hits * 10);
    if (this.energy === 0) {
      this.dead = true;
      this.currentImage = 0;
    }
  }

  /**
   * Permanently activates the endboss once it enters the visible area.
   * @returns {void}
   */
  activateWhenVisible() {
    const screenX = this.x + this.world.camera_x;
    if (screenX < this.world.canvas.width && screenX + this.width > 0) {
      this.activated = true;
    }
  }

  /**
   * Moves the endboss toward the character and adjusts its attack speed.
   * @returns {void}
   */
  followCharacter() {
    const pepe = this.world.character;
    const distance = pepe.x + pepe.width / 2 - (this.x + this.width / 2);

    this.attacking = Math.abs(distance) < 250;
    this.speed = this.attacking ? 4 : 2;
    if (distance !== 0) {
      this.otherDirection = distance > 0;
      this.x += Math.sign(distance) * Math.min(this.speed, Math.abs(distance));
    }
  }

  /**
   * Selects the death animation or the current endboss animation state.
   * @returns {void}
   */
  updateAnimation() {
    if (this.dead) {
      this.playAnimationOnce(this.IMAGES_DEAD);
      return;
    }
    const nextState = !this.activated
      ? 'alert'
      : this.attacking
        ? 'attack'
        : 'walk';
    this.playStateAnimation(nextState);
  }

  /**
   * Resets the frame counter on state changes and animates the endboss.
   * @param {'alert'|'walk'|'attack'} nextState - The next animation state.
   * @returns {void}
   */
  playStateAnimation(nextState) {
    if (this.animationState !== nextState) {
      this.currentImage = 0;
      this.animationState = nextState;
    }
    const images = {
      alert: this.IMAGES_ALERT,
      walk: this.IMAGES_WALKING,
      attack: this.IMAGES_ATTACK,
    };
    this.playAnimation(images[nextState]);
  }
}
