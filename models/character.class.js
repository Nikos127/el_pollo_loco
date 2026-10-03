class Character extends MovableObject {
  width = 150;
  height = 250;
  y = 80;
  speed = 10;
  bottles = 0;
  coins = 0;

  offset = {
    top: 120,
    bottom: 30,
    left: 40,
    right: 30,
  };

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
    if (this.canMoveRight()) this.moveRight();
    if (this.canMoveLeft()) this.moveLeft();
    if (this.canJump()) this.jump();

    this.world.camera_x = -this.x + 100;
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
   * Sets the initial vertical jump speed and plays the jump sound.
   * @param {number} [strength=30] - Initial vertical jump speed.
   * @returns {void}
   */
  jump(strength = 30) {
    this.speedY = strength;
    new Audio('audio/jumping.mp3').play();
  }

  /**
   * Checks whether the falling character hits an enemy from above.
   * @param {Chicken|Endboss} enemy - The enemy to check or damage.
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
      this.x + this.width - this.offset.right > enemy.x + enemy.offset.left &&
      this.x + this.offset.left < enemy.x + enemy.width - enemy.offset.right
    );
  }

  /**
   * Selects the character animation and controls walking audio.
   * @returns {void}
   */
  playCharacterAnimation() {
    if (this.isDead()) {
      this.playDeathAnimation();
    } else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
    else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
    else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      if (this.walkingSound.paused) this.walkingSound.play();
    } else {
      this.img = this.imageCache[this.IMAGES_WALKING[0]];
      this.walkingSound.pause();
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
