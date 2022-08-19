const allyPosition = { x: 360, y: 430 };
const enemyPosition = { x: 1010, y: 150 };

const embyImage = new Image();
embyImage.src = ".\\assets\\img\\embySprite.png";

const draggleImage = new Image();
draggleImage.src = ".\\assets\\img\\draggleSprite.png";

const monsters = {
  Emby: {
    position: allyPosition,
    image: embyImage,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Draggle: {
    position: enemyPosition,
    image: draggleImage,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle],
  },
};
