let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let isPaused = false;
let pauseStartedAt = 0;
let totalPausedTime = 0;

const fullscreenUnavailableQuery = window.matchMedia(
  '(width < 720px), (height < 480px)',
);

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
  if (world || portraitQuery.matches) return;
  if (window.matchMedia('(max-width: 1024px)').matches) {
    fullscreen();
  }
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
 * Enables the mobile layout, requests native fullscreen if supported, and updates the button.
 * @param {HTMLElement} elem - The element to display in fullscreen.
 * @returns {Promise<void>} Resolves after the fullscreen attempt and button update.
 */
async function enterFullscreen(elem) {
  if (fullscreenUnavailableQuery.matches) return;
  document.body.classList.add('mobile-game-active');
  try {
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
    }
  } catch (error) {
    console.warn('Vollbild konnte nicht aktiviert werden', error);
  }
  updateFullscreenButton();
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

/** Restores the normal layout after native fullscreen ends and updates the button. */
function restoreLayoutAfterFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    document.body.classList.remove('mobile-game-active');
  }
  updateFullscreenButton();
}

/** Updates the fullscreen icon, tooltip, and accessible label. */
function updateFullscreenButton() {
  const button = document.getElementById('fullscreen-button');
  const isFullscreen = isFullscreenActive();
  updateFullscreenIcon(button, isFullscreen);
  button.title = isFullscreen
    ? 'Klicken für Normalansicht'
    : 'Klicken für Vollbild';
  button.setAttribute('aria-label', button.title);
}

/**
 * Checks native fullscreen and the mobile fullscreen layout.
 * @returns {boolean} Whether either fullscreen mode is active.
 */
function isFullscreenActive() {
  return Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.body.classList.contains('mobile-game-active'),
  );
}

/**
 * Selects inward or outward arrows for the fullscreen button.
 * @param {HTMLButtonElement} button - The fullscreen button.
 * @param {boolean} isFullscreen - Whether fullscreen is active.
 * @returns {void}
 */
function updateFullscreenIcon(button, isFullscreen) {
  const arrows = isFullscreen
    ? 'M3 3L9 9 M9 4V9H4 M21 3L15 9 M15 4V9H20 M3 21L9 15 M4 15H9V20 M21 21L15 15 M20 15H15V20'
    : 'M9 9L3 3 M3 8V3H8 M15 9L21 3 M16 3H21V8 M9 15L3 21 M3 16V21H8 M15 15L21 21 M16 21H21V16';
  button.querySelector('path').setAttribute('d', arrows);
}

/** Toggles native fullscreen or exits the mobile fullscreen layout. */
function toggleFullscreen() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    closeFullscreen();
  } else if (document.body.classList.contains('mobile-game-active')) {
    document.body.classList.remove('mobile-game-active');
    updateFullscreenButton();
  } else {
    fullscreen();
  }
}

/** Leaves fullscreen when the viewport becomes smaller than the canvas. */
function handleFullscreenAvailability() {
  if (!fullscreenUnavailableQuery.matches) return;
  document.body.classList.remove('mobile-game-active');
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    closeFullscreen();
  }
  updateFullscreenButton();
}

fullscreenUnavailableQuery.addEventListener('change', handleFullscreenAvailability);
document.addEventListener('fullscreenchange', restoreLayoutAfterFullscreen);
document.addEventListener(
  'webkitfullscreenchange',
  restoreLayoutAfterFullscreen,
);

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
  if (portraitQuery.matches) return;
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
  if (portraitQuery.matches) return;
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

/**
 * Registers context-menu suppression and pointer controls for a game button.
 * @param {HTMLButtonElement} button - A button with a data-key attribute.
 * @returns {void}
 */
function bindMobileButton(button) {
  const key = button.dataset.key;
  button.addEventListener('contextmenu', /** Suppresses the browser menu.
 * @param {MouseEvent} event - Context-menu event.
 */ (event) => {
    event.preventDefault();
  });
  button.addEventListener('pointerdown', /** Handles a touch or mouse press.
 * @param {PointerEvent} event - Pointer event.
 */ (event) => {
    handleMobilePress(event, button, key);
  });
  bindMobileRelease(button, key);
}

/**
 * Captures the pointer and presses the mapped key while gameplay is active.
 * @param {PointerEvent} event - The pointer-down event.
 * @param {HTMLButtonElement} button - The pressed game button.
 * @param {string} key - The keyboard property to activate.
 * @returns {void}
 */
function handleMobilePress(event, button, key) {
  event.preventDefault();
  if (!world || isPaused || world.hasWon || world.character.isDead()) {
    return;
  }
  button.setPointerCapture(event.pointerId);
  keyboard[key] = true;
}

/**
 * Releases the mapped key on pointer release, cancellation, capture loss, or blur.
 * @param {HTMLButtonElement} button - The game button.
 * @param {string} key - The keyboard property to release.
 * @returns {void}
 */
function bindMobileRelease(button, key) {
  const release = /** Releases the mapped game key. */ () => {
    keyboard[key] = false;
  };
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
  window.addEventListener('blur', release);
}

window.addEventListener('DOMContentLoaded', /** Binds the mobile buttons after the DOM is ready. */ () => {
  document
    .querySelectorAll('.mobile-controls button')
    .forEach(bindMobileButton);
});

const portraitQuery = window.matchMedia(
  '(max-width: 1024px) and (orientation: portrait)',
);
/** Pauses an active game when the viewport enters the portrait media query. */
function handleOrientationChange() {
  if (!portraitQuery.matches || !world || isPaused) return;
  if (world.hasWon || world.character.isDead()) return;

  pauseGame();
  updatePauseButton();
}
portraitQuery.addEventListener('change', handleOrientationChange);
