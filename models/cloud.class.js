class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  /**
   * Erstellt und initialisiert eine Instanz von Cloud.
   */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Startet die Intervalle für Bewegung und Animation.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(/** Aktualisiert die Bewegung im Intervall. */ () => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
