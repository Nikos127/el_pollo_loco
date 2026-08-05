class Character extends MovableObject {
  width = 150;
  height = 250;
  y = 180;
  constructor() {
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
  }

  jump() {}
}
