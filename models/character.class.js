class Character extends MovableObject {
  width = 150;
  height = 250;
  y = 80;
  speed = 10;

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

  constructor() {
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
    setStoppableInterval(() => this.playCharacterAnimation(), 50);
  }

  moveCharacter() {
    if (this.canMoveRight()) this.moveRight();
    if (this.canMoveLeft()) this.moveLeft();
    if (this.canJump()) this.jump();

    this.world.camera_x = -this.x + 100;
  }

  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  moveRight() {
    this.otherDirection = false;
    super.moveRight();
  }

  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  moveLeft() {
    this.otherDirection = true;
    super.moveLeft();
  }

  canJump() {
    return this.world.keyboard.W && !this.isAboveGround();
  }

  jump() {
    this.speedY = 30;
  }

  isAboveEnemy(enemy) {
    if (
      this.speedY <= 0 &&
      this.y + this.height - this.offset.bottom <= enemy.y + enemy.height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  playCharacterAnimation() {
    if (this.isDead()) {
      this.DeathAnimationDelay++;
      if (this.DeathAnimationDelay % 6 === 0) {
        this.playAnimationOnce(this.IMAGES_DEAD);
      }
      let timeSinceDeath = new Date().getTime() - this.timeOfDeath;
      if (timeSinceDeath >= 2000) {
        stopGame();
      }
    } else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
    else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
    else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      this.playAnimation(this.IMAGES_WALKING);
    else this.img = this.imageCache[this.IMAGES_WALKING[0]];
  }
}
