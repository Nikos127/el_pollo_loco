let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];

const backgroundMusic = new Audio('audio/background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

async function toggleMusic(button) {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
    } catch (error) {
      console.error('Music konnte nicht gestartet werden:', error);
      return;
    }
  } else {
    backgroundMusic.pause();
  }

  const isPlaying = !backgroundMusic.paused;
  button.setAtribute('aria-pressed', String(isPlaying));
  button.title = isPlaying ? 'Music ausschalten' : 'Music einschalten';
}

function startGame() {
  if (world) return;

  initLevel();
  init();
  document.getElementById('startscreen').remove();
}

function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
}

function stopGame() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

function fullscreen() {
  let fullscreen = document.getElementById('fullscreen');
  enterFullscreen(fullscreen);
}

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

window.addEventListener('keydown', (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 87) {
    keyboard.W = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 88) {
    keyboard.X = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 87) {
    keyboard.W = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 88) {
    keyboard.X = false;
  }
});

function restartGame() {
  stopGame();
  cancelAnimationFrame(world.animationFrameId);
  world.character.walkingSound.pause();

  keyboard = new Keyboard();
  document.getElementById('restart-button').hidden = true;

  initLevel();
  init();
}
