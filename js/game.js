let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];

const backgroundMusic = new Audio('audio/background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

/**
 * Schaltet die Hintergrundmusik um und aktualisiert den Musikbutton.
 * @param {HTMLButtonElement} button - Button zur Musiksteuerung.
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
 * Aktualisiert den zugänglichen Zustand und Tooltip des Musikbuttons.
 * @param {HTMLButtonElement} button - Button zur Musiksteuerung.
 * @returns {void}
 */
function updateMusicButton(button) {
  const isPlaying = !backgroundMusic.paused;
  button.setAttribute('aria-pressed', String(isPlaying));
  button.title = isPlaying ? 'Music ausschalten' : 'Music einschalten';
}

/**
 * Startet das Spiel einmalig und entfernt den Startbildschirm.
 * @returns {void}
 */
function startGame() {
  if (world) return;

  initLevel();
  init();
  document.getElementById('startscreen').remove();
}

/**
 * Startet ein Intervall und registriert es zum späteren Stoppen.
 * @param {function(): void} fn - Wiederholt auszuführende Funktion.
 * @param {number} time - Intervallabstand in Millisekunden.
 * @returns {void}
 */
function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
}

/**
 * Beendet alle registrierten Spielintervalle und leert ihre Liste.
 * @returns {void}
 */
function stopGame() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

/**
 * Ermittelt das Canvas und erstellt die Spielwelt.
 * @returns {void}
 */
function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

/**
 * Fordert den Vollbildmodus für den Spielcontainer an.
 * @returns {void}
 */
function fullscreen() {
  let fullscreen = document.getElementById('fullscreen');
  enterFullscreen(fullscreen);
}

/**
 * Fordert den Vollbildmodus für das angegebene Element an.
 * @param {HTMLElement} elem - Im Vollbild anzuzeigendes Element.
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
 * Fordert das Beenden des Vollbildmodus an.
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

window.addEventListener('keydown', /** Aktiviert die gedrückte Spieltaste. */ (event) => {
  updateKeyboard(event, true);
});

window.addEventListener('keyup', /** Setzt die losgelassene Spieltaste zurück. */ (event) => {
  updateKeyboard(event, false);
});

/**
 * Stoppt das bisherige Spiel und erstellt Tastaturzustand und Spielwelt neu.
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
 * Aktualisiert den Zustand einer unterstützten Spieltaste.
 * @param {KeyboardEvent} event - Tastaturereignis.
 * @param {boolean} pressed - Ob die Taste gedrückt ist.
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
