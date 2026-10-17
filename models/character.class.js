/** The playable character with movement, collisions, and animation states. */
class Character extends MovableObject {
  width = 150;
  height = 250;
  y = 80;
  groundlevel = 175;
  speed = 10;
  bottles = 0;
  coins = 0;

  offset = {
    top: 120,
    bottom: 30,
    left: 55,
    right: 45,
  };

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  IMAGES_LONG_IDLE = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  lastMovementTime = getGameTime();
  lastIdleFrameTime = 0;
  currentIdleAnimation = null;
  lastAnimateHit = 0;

  world;
  DeathAnimationDelay = 0;
  walkingSound = new Audio('audio/walking.mp3');

  /**
   * Creates and initializes a Character instance.
   */
  constructor() {
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.walkingSound.loop = true;
    this.walkingSound.volume = 1;
    this.animate();
  }

  /**
   * Starts the movement and animation intervals.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(
      /** Updates movement on each interval tick. */ () => this.moveCharacter(),
      1000 / 60,
    );
    setStoppableInterval(
      /** Updates animation on each interval tick. */ () =>
        this.playCharacterAnimation(),
      50,
    );
  }

  /**
   * Processes movement and jump input and updates the camera.
   * @returns {void}
   */
  moveCharacter() {
    const movesRight = this.canMoveRight();
    const movesLeft = this.canMoveLeft();
    const jumps = this.canJump();

    if (movesRight) this.moveRight();
    if (movesLeft) this.moveLeft();
    if (jumps) this.jump();

    this.updateMovementActivity(movesRight || movesLeft || jumps);
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Resets idle timing while moving, jumping, or airborne.
   * @param {boolean} hasMovementInput - Whether a movement or jump action was accepted.
   * @returns {void}
   */
  updateMovementActivity(hasMovementInput) {
    if (hasMovementInput || this.isAboveGround()) {
      this.lastMovementTime = getGameTime();
      this.currentIdleAnimation = null;
    }
  }

  /**
   * Checks the right key and the right level boundary.
   * @returns {boolean|undefined}
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Moves the object to the right by its current speed.
   * @returns {void}
   */
  moveRight() {
    this.otherDirection = false;
    super.moveRight();
  }

  /**
   * Checks the left key and the left level boundary.
   * @returns {boolean|undefined}
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Moves the object to the left by its current speed.
   * @returns {void}
   */
  moveLeft() {
    this.otherDirection = true;
    super.moveLeft();
  }

  /**
   * Checks the jump key and whether the character is on the ground.
   * @returns {boolean|undefined}
   */
  canJump() {
    return this.world.keyboard.W && !this.isAboveGround();
  }

  /**
   * Sets jump speed, estimates the apex for animation, and plays the jump sound.
   * @param {number} [strength=30] - Initial vertical jump speed.
   * @returns {void}
   */
  jump(strength = 30) {
    this.currentImage = 0;
    this.speedY = strength;
    this.jumpStrength = strength;
    const rise = (strength * (strength / this.acceleration + 1)) / 2;
    this.jumpPeakY = this.y - rise;
    new Audio('audio/jumping.mp3').play();
  }

  /**
   * Checks whether the falling feet cross the enemy top with central foot overlap.
   * @param {Chicken|Endboss} enemy - The enemy whose top and horizontal bounds are checked.
   * @returns {boolean}
   */
  isAboveEnemy(enemy) {
    const feet = this.y + this.height - this.offset.bottom;
    const previousFeet = this.previousY + this.height - this.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    return (
      this.speedY < 0 &&
      previousFeet <= enemyTop &&
      feet >= enemyTop &&
      this.x + this.width / 2 + 10 > enemy.x + enemy.offset.left &&
      this.x + this.width / 2 - 10 < enemy.x + enemy.width - enemy.offset.right
    );
  }

  /**
   * Selects the character animation and controls walking audio.
   * @returns {void}
   */
  playCharacterAnimation() {
    if (this.isDead()) {
      this.playDeathAnimation();
    } else if (this.isHurt()) {
      this.playHurtAnimation();
    } else if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playWalkingAnimation();
    } else {
      this.playIdleAnimation();
    }
  }

  /** Displays the frame matching jump progress and pauses walking audio. */
  playJumpAnimation() {
    const progress = this.getJumpProgress();
    const lastIndex = this.IMAGES_JUMPING.length - 1;
    const index = Math.min(
      lastIndex,
      Math.floor(Math.max(0, progress) * (lastIndex + 1)),
    );
    this.img = this.imageCache[this.IMAGES_JUMPING[index]];
    this.walkingSound.pause();
  }

  /**
   * Calculates animation progress from ascent speed or descent position.
   * @returns {number} Jump progress before frame-index clamping.
   */
  getJumpProgress() {
    const strength = this.jumpStrength ?? 30;
    const peak = this.jumpPeakY ?? this.y;
    return this.speedY > 0
      ? 0.5 * (1 - this.speedY / strength)
      : 0.5 + (0.5 * (this.y - peak)) / (this.groundlevel - peak);
  }

  /** Restarts the hurt frames for a new hit and holds the final frame. */
  playHurtAnimation() {
    if (this.lastAnimateHit !== this.lastHit) {
      this.currentImage = 0;
      this.lastAnimateHit = this.lastHit;
    }
    this.playAnimationOnce(this.IMAGES_HURT);
  }

  /** Advances the walking animation and starts walking audio if paused. */
  playWalkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
    if (this.walkingSound.paused) this.walkingSound.play();
  }

  /** Selects normal or long idle frames after 30 seconds without movement. */
  playIdleAnimation() {
    this.walkingSound.pause();
    const images =
      getGameTime() - this.lastMovementTime >= 30000
        ? this.IMAGES_LONG_IDLE
        : this.IMAGES_IDLE;
    this.updateIdleAnimation(images);
  }

  /**
   * Resets changed idle sequences and advances them at 200-millisecond intervals.
   * @param {string[]} images - The selected idle image paths.
   * @returns {void}
   */
  updateIdleAnimation(images) {
    if (this.currentIdleAnimation !== images) {
      this.currentIdleAnimation = images;
      this.currentImage = 0;
    }
    if (getGameTime() - this.lastIdleFrameTime >= 200) {
      this.playAnimation(images);
      this.lastIdleFrameTime = getGameTime();
    }
  }

  /**
   * Plays the delayed death animation and stops game intervals after two seconds.
   * @returns {void}
   */
  playDeathAnimation() {
    this.walkingSound.pause();
    this.DeathAnimationDelay++;
    if (this.DeathAnimationDelay % 6 === 0) {
      this.playAnimationOnce(this.IMAGES_DEAD);
    }
    let timeSinceDeath = getGameTime() - this.timeOfDeath;
    if (timeSinceDeath >= 2000) {
      stopGame();
      new Audio('audio/lost.mp3').play();
    }
  }
}
