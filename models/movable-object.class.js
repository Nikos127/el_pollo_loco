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
   * Aktualisiert Höhe und vertikale Geschwindigkeit in einem Intervall.
   * @returns {void}
   */
  applyGravity() {
    setStoppableInterval(/** Berechnet den nächsten Schwerkraftschritt. */ () => {
      if ((this.isAboveGround() || this.speedY > 0) && !this.splashed) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (this.speedY < -30) {
        this.speedY = -30;
      }
    }, 1000 / 25);
  }

  /**
   * Prüft, ob das Objekt in der Luft ist; geworfene Flaschen gelten immer als in der Luft.
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
   * Verringert die Energie bei einem gültigen Treffer und behandelt Verletzung oder Tod.
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
      this.lastHit = new Date().getTime();
      new Audio('audio/hurt.mp3').play();
    }
  }

  /**
   * Prüft, ob die Lebensenergie null beträgt.
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Prüft, ob der letzte Treffer weniger als eine halbe Sekunde zurückliegt.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Prüft die Überlappung der Kollisionsrechtecke beider Objekte.
   * @param {MovableObject} mo - Zu prüfendes oder zu zeichnendes Objekt.
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
   * Bewegt das Objekt um seine Geschwindigkeit nach rechts.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Bewegt das Objekt um seine Geschwindigkeit nach links.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Zeigt das nächste Bild einer zyklisch wiederholten Animation.
   * @param {string[]} images - Pfade der Animationsbilder.
   * @returns {void}
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Zeigt das nächste Animationsbild und bleibt anschließend beim letzten Bild.
   * @param {string[]} images - Pfade der Animationsbilder.
   * @returns {void}
   */
  playAnimationOnce(images) {
    let i = Math.min(this.currentImage, images.length - 1);
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Setzt den Todeszustand, merkt den Zeitpunkt und spielt den Todeston.
   * @returns {void}
   */
  handleDeath() {
    this.energy = 0;
    this.timeOfDeath = new Date().getTime();
    this.currentImage = 0;
    new Audio('audio/character-die.mp3').play();
  }
}
