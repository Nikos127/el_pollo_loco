let level1;

/**
 * Creates the first level with enemies, a cloud, and background objects.
 * @returns {void}
 */
function initLevel() {
  level1 = new Level(createEnemies(), [new Cloud()], []);
}

/**
 * Creates randomly selected chickens and appends the endboss.
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
