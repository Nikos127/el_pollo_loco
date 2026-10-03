class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  /**
   * Creates and initializes a Cloud instance.
   */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts the cloud movement interval.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(/** Updates movement on each interval tick. */ () => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
