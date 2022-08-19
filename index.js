const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const boundaries = [];

const offset = {
  x: -610,
  y: -560,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const mapImage = new Image();
mapImage.src = ".\\assets\\img\\Pellet Town.png";

const playerImageDown = new Image();
playerImageDown.src = ".\\assets\\img\\playerDown.png";

const playerImageUp = new Image();
playerImageUp.src = ".\\assets\\img\\playerUp.png";

const playerImageLeft = new Image();
playerImageLeft.src = ".\\assets\\img\\playerLeft.png";

const playerImageRight = new Image();
playerImageRight.src = ".\\assets\\img\\playerRight.png";

const foregroundImage = new Image();
foregroundImage.src = ".\\assets\\img\\foregroundObjects.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImageDown,
  frames: { max: 4, hold: 10 },
  sprites: {
    up: playerImageUp,
    down: playerImageDown,
    left: playerImageLeft,
    right: playerImageRight,
  },
});

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: mapImage,
});

const foreground = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, ...battleZones, foreground];

const rectangularCollision = ({ rectangleOne, rectangleTwo }) => {
  return (
    rectangleOne.position.x + rectangleOne.width >= rectangleTwo.position.x &&
    rectangleOne.position.x <= rectangleTwo.position.x + rectangleTwo.width &&
    rectangleOne.position.y <= rectangleTwo.position.y + rectangleTwo.height &&
    rectangleOne.position.y + rectangleOne.height >= rectangleTwo.position.y
  );
};

const battle = {
  initiated: false,
};

const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();

  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      const battleZoneOffset = 20;
      if (
        rectangularCollision({
          rectangleOne: player,
          rectangleTwo: battleZone,
        }) &&
        overlappingArea - battleZoneOffset >
          (player.width * player.height) / 2 &&
        Math.random() < 0.02
      ) {
        window.cancelAnimationFrame(animationId);
        battle.initiated = true;
        gsap.to("#overlapping-div", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlapping-div", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                animateBattle();
                gsap.to("#overlapping-div", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangleOne: player,
          rectangleTwo: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y + 3 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangleOne: player,
          rectangleTwo: {
            ...boundary,
            position: { x: boundary.position.x + 3, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangleOne: player,
          rectangleTwo: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y - 3 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangleOne: player,
          rectangleTwo: {
            ...boundary,
            position: { x: boundary.position.x - 3, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
};

animate();

const battleBackgroundImage = new Image();
battleBackgroundImage.src = ".\\assets\\img\\battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const allyPosition = { x: 360, y: 430 };
const enemyPosition = { x: 1010, y: 150 };

const draggleImage = new Image();
draggleImage.src = ".\\assets\\img\\draggleSprite.png";

const draggle = new Sprite({
  position: enemyPosition,
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  isEnemy: true,
});

const embyImage = new Image();
embyImage.src = ".\\assets\\img\\embySprite.png";

const emby = new Sprite({
  position: allyPosition,
  image: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
});

const animateBattle = () => {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  draggle.draw();
  emby.draw();
};

// animateBattle();

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    emby.attack({
      attack: {
        name: "Tackle",
        damage: 10,
        type: "Normal",
      },
      recipient: draggle,
    });
  });
});

let lastKey = "";

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
