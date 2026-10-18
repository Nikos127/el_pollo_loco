// Run with: node tests/collisions.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const intervals = [];
const timeouts = [];
const context = vm.createContext({
  Image: class {},
  Audio: class {
    paused = true;
    play() { this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
  },
  getGameTime: () => 10000,
  setStoppableInterval: (callback, delay) => intervals.push({ callback, delay }),
  setTimeout: (callback, delay) => timeouts.push({ callback, delay }),
});

for (const name of [
  'drawable-object', 'movable-object', 'character', 'chicken',
  'chicken-small', 'endboss', 'throwable-object', 'world',
]) {
  const filename = path.join(__dirname, '..', 'models', `${name}.class.js`);
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
}
const { Character, Chicken, ChickenSmall, Endboss, ThrowableObject, World } =
  vm.runInContext('({ Character, Chicken, ChickenSmall, Endboss, ThrowableObject, World })', context);

let passed = 0;
function test(name, callback) {
  callback();
  passed++;
  console.log(`ok ${passed} - ${name}`);
}

function createWorld(enemies = []) {
  const world = Object.create(World.prototype);
  Object.assign(world, {
    character: new Character(),
    level: { enemies, bottles: [], coins: [], level_end_x: 4000 },
    throwableObjects: [],
    keyboard: {},
    hasWon: false,
    statusBar: { setPercentage(value) { this.percentage = value; } },
  });
  world.character.world = world;
  world.character.x = 100;
  return world;
}

function feet(character) {
  return character.y + character.height - character.offset.bottom;
}

function setFeet(character, position) {
  character.y = position - character.height + character.offset.bottom;
}

function top(enemy) {
  return enemy.y + enemy.offset.top;
}

function prepareFall(world, enemy, distance = 8) {
  world.character.x = enemy.x;
  setFeet(world.character, top(enemy) - distance);
  world.character.speedY = -30;
}

function assertStomp(world, enemy) {
  assert.equal(enemy.dead, true, 'The crossed chicken must be stomped.');
  assert.equal(feet(world.character), top(enemy), 'Feet must stop at the chicken surface.');
  assert.ok(world.character.speedY > 0, 'A stomp must start an upward bounce.');
  assert.equal(world.character.energy, 100, 'A stomp must not hurt Pepe.');
}

for (const Enemy of [Chicken, ChickenSmall]) {
  test(`fast descent onto ${Enemy.name} resolves in the same world tick`, () => {
    const enemy = new Enemy(100);
    const world = createWorld([enemy]);
    prepareFall(world, enemy);
    world.updateWorld();
    assertStomp(world, enemy);
  });

  test(`outer foot contact stomps ${Enemy.name} outside the old center strip`, () => {
    const enemy = new Enemy(100);
    const world = createWorld([enemy]);
    prepareFall(world, enemy);
    const pepe = world.character;
    // Leave only five pixels of contact at the right edge of Pepe's body.
    pepe.x = enemy.x + enemy.offset.left - pepe.width + pepe.offset.right + 5;
    assert.ok(pepe.x + pepe.width / 2 + 10 < enemy.x + enemy.offset.left);
    world.updateWorld();
    assertStomp(world, enemy);
  });
}

test('ascending through a chicken does not count as a stomp', () => {
  const enemy = new Chicken(100);
  const world = createWorld([enemy]);
  setFeet(world.character, top(enemy) + 18);
  world.character.speedY = 10;
  world.updateWorld();
  assert.equal(enemy.dead, false);
  assert.equal(feet(world.character), top(enemy) + 8);
  assert.equal(world.character.speedY, 7.5, 'Ascending contact must not reset jump speed.');
  assert.equal(world.character.energy, 95);
});

test('walking into a chicken from the side hurts Pepe without a bounce', () => {
  const enemy = new Chicken(100);
  const world = createWorld([enemy]);
  world.character.y = world.character.groundlevel;
  world.updateWorld();
  assert.equal(enemy.dead, false);
  assert.equal(world.character.energy, 95);
  assert.equal(world.character.speedY, 0);
});

for (const Enemy of [Chicken, ChickenSmall, Endboss]) {
  for (const direction of ['left', 'right']) {
    test(`${Enemy.name} hurts Pepe only after slight overlap from the ${direction}`, () => {
      const enemy = new Enemy(100);
      const world = createWorld([enemy]);
      const pepe = world.character;
      pepe.y = pepe.groundlevel;
      enemy.x = direction === 'right'
        ? pepe.x + pepe.width - pepe.offset.right - enemy.offset.left + 1
        : pepe.x + pepe.offset.left - enemy.width + enemy.offset.right - 1;
      world.updateWorld();
      assert.equal(pepe.energy, 100, 'A one-pixel gap must not cause damage.');
      enemy.x += direction === 'right' ? -14 : 14;
      world.updateWorld();
      assert.equal(pepe.energy, 100, 'Thirteen pixels of overlap must not cause damage.');
      enemy.x += direction === 'right' ? -2 : 2;
      world.updateWorld();
      assert.equal(pepe.energy, 95, 'Fifteen pixels of overlap must cause contact damage.');
      assert.equal(world.statusBar.percentage, 95);
      assert.equal(enemy.dead, false);
      assert.equal(pepe.speedY, 0);
    });
  }
}

test('movement checks contact before the next gravity tick', () => {
  const enemy = new Chicken(100);
  const world = createWorld([enemy]);
  const pepe = world.character;
  pepe.y = pepe.groundlevel;
  enemy.x = pepe.x + pepe.width - pepe.offset.right - enemy.offset.left - 5;
  world.keyboard.RIGHT = true;
  pepe.moveCharacter();
  assert.equal(pepe.energy, 95);
  assert.equal(pepe.x, 110);
});

for (const reverse of [false, true]) {
  test(`overlapping chicken surfaces resolve highest first (${reverse ? 'small' : 'normal'} listed first)`, () => {
    const normal = new Chicken(100);
    const small = new ChickenSmall(100);
    const enemies = reverse ? [small, normal] : [normal, small];
    const world = createWorld(enemies);
    // Both surfaces lie within a single 30-pixel descent.
    prepareFall(world, normal, 2);
    assert.ok(top(small) > top(normal));
    assert.ok(top(small) < feet(world.character) + 30);
    world.updateWorld();
    assertStomp(world, normal);
    assert.equal(small.dead, false, 'The lower chicken must survive the bounce above it.');
  });
}

test('crossing a surface during ground clamping still stomps and bounces', () => {
  const enemy = new ChickenSmall(100);
  const world = createWorld([enemy]);
  const pepe = world.character;
  const groundFeet = pepe.groundlevel + pepe.height - pepe.offset.bottom;
  enemy.y = groundFeet - 2 - enemy.offset.top;
  prepareFall(world, enemy, 5);
  assert.ok(pepe.y + 30 > pepe.groundlevel, 'This descent must cross the ground clamp.');
  world.updateWorld();
  assertStomp(world, enemy);
  assert.ok(pepe.y < pepe.groundlevel);
});

test('a dead chicken cannot hurt Pepe or trigger another bounce', () => {
  const enemy = new Chicken(100);
  enemy.dead = true;
  const world = createWorld([enemy]);
  prepareFall(world, enemy);
  const expectedY = world.character.y + 30;
  world.updateWorld();
  assert.equal(world.character.y, expectedY);
  assert.ok(world.character.speedY <= 0);
  assert.equal(world.character.energy, 100);
});

test('dead Pepe cannot stomp or bounce on a chicken', () => {
  const enemy = new Chicken(100);
  const world = createWorld([enemy]);
  prepareFall(world, enemy);
  world.character.energy = 0;
  world.updateWorld();
  assert.equal(enemy.dead, false);
  assert.equal(world.character.energy, 0);
  assert.ok(world.character.speedY <= 0);
});

test('landing on the endboss causes contact damage instead of a chicken stomp', () => {
  const enemy = new Endboss();
  const world = createWorld([enemy]);
  prepareFall(world, enemy);
  world.updateWorld();
  assert.equal(enemy.dead, false);
  assert.equal(world.character.energy, 95);
  assert.ok(world.character.speedY <= 0);
});

test('character timers cannot advance gravity independently of world collisions', () => {
  const before = intervals.length;
  const world = createWorld();
  const characterTimers = intervals.slice(before);
  const pepe = world.character;
  pepe.y = 70;
  pepe.speedY = -10;
  for (const timer of characterTimers) timer.callback();
  assert.equal(pepe.y, 70, 'Character animation and movement timers must not move Pepe vertically.');
  assert.equal(pepe.speedY, -10);
  world.updateWorld();
  assert.equal(pepe.previousY, 70);
  assert.equal(pepe.y, 80, 'The world must advance gravity exactly once per update.');
});

test('thrown bottles retain their own gravity timer', () => {
  const before = intervals.length;
  const bottle = new ThrowableObject(100, 100);
  const bottleTimers = intervals.slice(before);
  for (const timer of bottleTimers) timer.callback();
  assert.equal(bottle.y, 80);
  assert.equal(bottle.speedY, 17.5);
  assert.ok(bottle.x > 100, 'The independent horizontal flight timer must still run.');
});

console.log(`Passed ${passed} collision regression tests.`);
module.exports = { passed };
