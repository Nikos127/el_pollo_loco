let level1;

/**
 * Erstellt das erste Level mit Gegnern, Wolke und Hintergrund.
 * @returns {void}
 */
function initLevel() {
  level1 = new Level(createEnemies(), [new Cloud()], []);
}

/**
 * Erstellt zufällig ausgewählte Hühner und fügt den Endboss hinzu.
 * @returns {Array<Chicken|Endboss>}
 */
function createEnemies() {
  const enemies = [];
  const positions = [undefined, 1000, 1500, 2000, 2500, 3000];
  for (const x of positions) {
    for (let i = 0; i < 3; i++) {
      const enemy = Math.random() < 0.5 ? new Chicken(x) : new ChickenSmall(x);
      enemies.push(enemy);
    }
  }
  enemies.push(new Endboss());
  return enemies;
}
