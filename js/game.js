let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let isPaused = false;
let pauseStartedAt = 0;
let totalPausedTime = 0;

const backgroundMusic = new Audio('audio/background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

/**
 * Toggles background music and updates the music button.
 * @param {HTMLButtonElement} button - The music control button.
 * @returns {Promise<void>}
 */
async function toggleMusic(button) {
  try {
    if (backgroundMusic.paused) {
      await backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
    updateMusicButton(button);
  } catch (error) {
    console.error('Musik konnte nicht umgeschaltet werden:', error);
  }
}

/**
 * Updates the music button's pressed state and tooltip.
 * @param {HTMLButtonElement} button - The music control button.
 * @returns {void}
 */
function updateMusicButton(button) {
  const isPlaying = !backgroundMusic.paused;
  button.setAttribute('aria-pressed', String(isPlaying));
  button.title = isPlaying ? 'Music ausschalten' : 'Music einschalten';
}

/**
 * Starts the game once and removes the start screen.
 * @returns {void}
 */
function startGame() {
  if (world) return;

  initLevel();
  init();
  document.getElementById('startscreen').remove();
}

/**
 * Registers an interval that skips its callback while paused.
 * @param {function(): void} fn - The function to execute repeatedly.
 * @param {number} time - The interval duration in milliseconds.
 * @returns {void}
 */
function setStoppableInterval(fn, time) {
  const id = setInterval(
    /** Runs the game step only while the game is not paused. */
    () => {
      if (!isPaused) fn();
    },
    time,
  );
  intervalIds.push(id);
}

/**
 * Clears all registered game intervals and hides the pause button.
 * @returns {void}
 */
function stopGame() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
  document.getElementById('pause-button').hidden = true;
}

/**
 * Creates the game world and initializes the pause button.
 * @returns {void}
 */
function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
  document.getElementById('pause-button').hidden = false;
  updatePauseButton();
}

/**
 * Requests fullscreen mode for the game container.
 * @returns {void}
 */
function fullscreen() {
  let fullscreen = document.getElementById('fullscreen');
  enterFullscreen(fullscreen);
}

/**
 * Requests fullscreen mode for the supplied element.
 * @param {HTMLElement} elem - The element to display in fullscreen.
 * @returns {void}
 */
function enterFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

/**
 * Requests to exit fullscreen mode.
 * @returns {void}
 */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

window.addEventListener(
  'keydown',
  /** Handles game keys and toggles pause with P. */
  (event) => {
    if (event.code === 'KeyP') {
      event.preventDefault();
      if (!event.repeat) togglePause();
      return;
    }
    if (!isPaused) updateKeyboard(event, true);
  },
);

window.addEventListener(
  'keyup',
  /** Resets the released game key. */ (event) => {
    updateKeyboard(event, false);
  },
);

/**
 * Stops the previous game and recreates the keyboard state and world.
 * @returns {void}
 */
function restartGame() {
  stopGame();
  cancelAnimationFrame(world.animationFrameId);
  world.character.walkingSound.pause();

  keyboard = new Keyboard();
  document.getElementById('restart-button').hidden = true;

  initLevel();
  init();
}

/**
 * Updates the state of a supported game key.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {boolean} pressed - Whether the key is pressed.
 * @returns {void}
 */
function updateKeyboard(event, pressed) {
  const keys = {
    39: 'RIGHT',
    37: 'LEFT',
    87: 'W',
    40: 'DOWN',
    32: 'SPACE',
    88: 'X',
  };
  const key = keys[event.keyCode];
  if (key) {
    keyboard[key] = pressed;
  }
}

/**
 * Returns game time, excluding time spent paused.
 * @returns {number} Game time in milliseconds.
 */
function getGameTime() {
  const now = isPaused ? pauseStartedAt : Date.now();
  return now - totalPausedTime;
}

/**
 * Toggles pause while the game is active.
 * @returns {void}
 */
function togglePause() {
  if (!world || world.hasWon || world.character.isDead()) return;
  if (isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
  updatePauseButton();
}

/**
 * Freezes game time, resets keyboard input, and pauses walking audio.
 * @returns {void}
 */
function pauseGame() {
  pauseStartedAt = Date.now();
  isPaused = true;
  keyboard = new Keyboard();
  world.keyboard = keyboard;
  world.character.walkingSound.pause();
}

/**
 * Updates the pause button's icon, label, and pressed state.
 * @returns {void}
 */
function updatePauseButton() {
  const button = document.getElementById('pause-button');
  const label = isPaused ? 'Spiel fortsetzen' : 'Spiel pausieren';
  button.textContent = isPaused ? '\u25B6' : '\u23F8';
  button.title = label;
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-pressed', String(isPaused));
}

/**
 * Resumes the game and records the elapsed pause duration.
 * @returns {void}
 */
function resumeGame() {
  totalPausedTime += Date.now() - pauseStartedAt;
  isPaused = false;
}
