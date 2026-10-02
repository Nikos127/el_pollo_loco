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
   * Erstellt und initialisiert eine Instanz von Endboss.
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
   * Startet die Intervalle für Bewegung und Animation.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(/** Aktualisiert die Bewegung im Intervall. */ () => this.updateMovement(), 1000 / 60);
    setStoppableInterval(/** Aktualisiert die Animation im Intervall. */ () => this.updateAnimation(), 200);
  }

  /**
   * Aktiviert den sichtbaren Boss und aktualisiert seine Verfolgung.
   * @returns {void}
   */
  updateMovement() {
    if (!this.world || this.dead || this.world.character.isDead()) return;
    this.activateWhenVisible();
    if (!this.activated) return;
    this.followCharacter();
  }

  /**
   * Zählt einen Flaschentreffer und setzt beim letzten Treffer den Todeszustand.
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
   * Aktiviert den Boss dauerhaft, sobald er in den sichtbaren Bereich gelangt.
   * @returns {void}
   */
  activateWhenVisible() {
    const screenX = this.x + this.world.camera_x;
    if (screenX < this.world.canvas.width && screenX + this.width > 0) {
      this.activated = true;
    }
  }

  /**
   * Bewegt den Boss auf die Spielfigur zu und bestimmt sein Angriffstempo.
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
   * Wählt die Todesanimation oder den aktuellen Animationszustand des Bosses.
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
   * Setzt bei einem Zustandswechsel den Bildzähler zurück und animiert den Boss.
   * @param {'alert'|'walk'|'attack'} nextState - Nächster Animationszustand.
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
