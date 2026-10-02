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
   * Erstellt und initialisiert eine Instanz von Character.
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
   * Startet die Intervalle für Bewegung und Animation.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(/** Aktualisiert die Bewegung im Intervall. */ () => this.moveCharacter(), 1000 / 60);
    setStoppableInterval(/** Aktualisiert die Animation im Intervall. */ () => this.playCharacterAnimation(), 50);
  }

  /**
   * Verarbeitet Bewegungs- und Sprungtasten und aktualisiert die Kamera.
   * @returns {void}
   */
  moveCharacter() {
    if (this.canMoveRight()) this.moveRight();
    if (this.canMoveLeft()) this.moveLeft();
    if (this.canJump()) this.jump();

    this.world.camera_x = -this.x + 100;
  }

  /**
   * Prüft die rechte Richtungstaste und die rechte Levelgrenze.
   * @returns {boolean|undefined}
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Bewegt das Objekt um seine Geschwindigkeit nach rechts.
   * @returns {void}
   */
  moveRight() {
    this.otherDirection = false;
    super.moveRight();
  }

  /**
   * Prüft die linke Richtungstaste und die linke Levelgrenze.
   * @returns {boolean|undefined}
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Bewegt das Objekt um seine Geschwindigkeit nach links.
   * @returns {void}
   */
  moveLeft() {
    this.otherDirection = true;
    super.moveLeft();
  }

  /**
   * Prüft die Sprungtaste und den Bodenkontakt.
   * @returns {boolean|undefined}
   */
  canJump() {
    return this.world.keyboard.W && !this.isAboveGround();
  }

  /**
   * Setzt die vertikale Sprunggeschwindigkeit und spielt den Sprungton.
   * @param {number} [strength=30] - Anfängliche vertikale Sprunggeschwindigkeit.
   * @returns {void}
   */
  jump(strength = 30) {
    this.speedY = strength;
    new Audio('audio/jumping.mp3').play();
  }

  /**
   * Prüft, ob die fallende Spielfigur einen Gegner von oben trifft.
   * @param {Chicken|Endboss} enemy - Zu prüfender oder getroffener Gegner.
   * @returns {boolean}
   */
  isAboveEnemy(enemy) {
    if (
      this.speedY <= 0 &&
      this.y + this.height >= enemy.y &&
      this.y + this.height <= enemy.y + enemy.height / 2 &&
      this.x + this.width > enemy.x &&
      this.x < enemy.x + enemy.width
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Wählt die Animation der Spielfigur und steuert das Laufgeräusch.
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
   * Spielt die verzögerte Todesanimation und beendet nach zwei Sekunden die Spielintervalle.
   * @returns {void}
   */
  playDeathAnimation() {
    this.walkingSound.pause();
    this.DeathAnimationDelay++;
    if (this.DeathAnimationDelay % 6 === 0) {
      this.playAnimationOnce(this.IMAGES_DEAD);
    }
    let timeSinceDeath = new Date().getTime() - this.timeOfDeath;
    if (timeSinceDeath >= 2000) {
      stopGame();
      new Audio('audio/lost.mp3').play();
    }
  }
}
