import { useEffect, useRef } from 'react';
import kaboom from 'kaboom';

import { useWallet } from '@solana/wallet-adapter-react';


  
  

const FlappyPootGame = () => {
  const { publicKey  } = useWallet();
  const gameInitialized = useRef(false);
  let highScore = parseInt(localStorage.getItem("flappyPootHighScore") || "0");

  let backgroundMusic;
  let GAME_SCALE = 0;
  let GROUND_SPEED_NEW = 0;
  let PIPE_SPACING_NEW = 0;

  const PIXEL_HEIGHT = 200;
  const FONT_SIZE = 8;
  const SCORE_FONT_SIZE = 14;
  let GROUND_SPEED = 40;
  let GROUND_PARALLAX = 0.95;
  let BUSH_PARALLAX = 1.2;
  let BUILDING_PARALLAX = 3;
  
  let PIPE_SPACING = 20;
  let PIPE_GAP_MIN = 200;
  let PIPE_GAP_MAX = 300;
  let PIPE_RANDOM_Y = 240;
  let JUMP_FORCE = 500;

  const startGame = () => {
    const k = kaboom({
      scale: 1,
      root: document.getElementById("kaboom-game"),
    });

    GAME_SCALE = k.height()/PIXEL_HEIGHT;

    k.loadSprite("poot", "assets/games/flappypoot/sprites/FlappyPoot_Poot.png", {
      sliceX: 5,
      anims: {
        "idle": 0,
        "up": 1,
        "down": 2,
        "dead":3,
        "puke":4,
      },
    });
    k.loadSprite("toot", "assets/games/flappypoot/sprites/FlappyPoot_Poot_Toot.png",{
      sliceX: 9,
      anims: {
        "toot": {
          from: 0,
          to: 8,
          speed: 12,
          loop: false,
        },
      },
    });
    k.loadSprite("buildings", "assets/games/flappypoot/sprites/FlappyPoot_Buildings.png");
    k.loadSprite("sky", "assets/games/flappypoot/sprites/FlappyPoot_Sky.png");
    k.loadSprite("ground", "assets/games/flappypoot/sprites/FlappyPoot_Ground.png");
    k.loadSprite("bush", "assets/games/flappypoot/sprites/FlappyPoot_Bush.png");
    k.loadSprite("pipe", "assets/games/flappypoot/sprites/FlappyPoot_Pipe.png");
    k.loadSound("collect_point", "assets/games/flappypoot/sounds/collect_point_01.mp3");
    k.loadSound("music", "assets/games/flappypoot/sounds/music_02.mp3");
    k.loadSound("death", "assets/games/flappypoot/sounds/death_02.mp3");
    k.loadSound("toot_sound_01", "assets/games/flappypoot/sounds/toot_sound_01.mp3");
    k.loadSound("toot_sound_02", "assets/games/flappypoot/sounds/toot_sound_02.mp3");
    k.loadSound("toot_sound_03", "assets/games/flappypoot/sounds/toot_sound_03.mp3");
    k.loadFont("font","assets/fonts/games/digits.ttf");

    ///////////// START SCENE /////////////

k.scene("start", () => {
  k.add([
    k.sprite("sky", {
          width: k.width(), 
          height: 160,
          tiled: true,
      }),
      k.scale(GAME_SCALE),
      k.pos(0,k.height()),
      k.anchor("botleft"),
  ]);

  // Initialize ground tiles
  const buildingsWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfBuildings = Math.ceil(k.width() / buildingsWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfBuildings; i++) {
    k.add([
      k.sprite("buildings"),
      k.scale(GAME_SCALE),
      k.pos(i * buildingsWidth, k.height()), // Positioned at the bottom
      k.anchor("botleft"),
    ]);
  }

  // Initialize ground tiles
  const bushWidth = 150 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfBushes = Math.ceil(k.width() / bushWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfBushes; i++) {
    k.add([
      k.sprite("bush"),
      k.scale(GAME_SCALE),
      k.pos(i * bushWidth, k.height()-(28*GAME_SCALE)), // Positioned at the bottom
      k.anchor("botleft"),
    ]);
  }
  
  // Initialize ground tiles
  const groundWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfGroundTiles = Math.ceil(k.width() / groundWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfGroundTiles; i++) {
    k.add([
      k.sprite("ground"),
      k.scale(GAME_SCALE),
      k.pos(i * groundWidth, k.height()), // Positioned at the bottom
      k.anchor("botleft"),
      k.z(1),
    ]);
  }


  if (publicKey ) {
    k.add([
      k.text(
            "Welcome to\n"
            +"FlappyPoot!\n\n"
            +`Wallet: ${ publicKey }`
            , 
            {
              size: FONT_SIZE*GAME_SCALE,
              width: 340,
              font: "font",
              align: "center",
          }),
          k.z(100),
          k.anchor("center"),
          k.pos(k.width()/2, k.height()/2),
      ]);
      k.onKeyPress("space", () => {
        k.go("game");
      });
      k.onMousePress("left", () => {
        k.go("game");
      });
      // k.onTouchStart(() => {
      //   k.go("game");
      // });
    } else{
      k.add([
        k.text(
          "Welcome to\n"
          +"FlappyPoot!\n\n"
          +"Playing as Guest..."
          , 
          {
            size: FONT_SIZE*GAME_SCALE,
            width: 340,
            font: "font",
            align: "center",
        }),
        k.z(100),
        k.anchor("center"),
        k.pos(k.width()/2, k.height()/2),
        ]);


        k.onKeyPress("space", () => {
          k.go("game");
        });
        k.onMousePress("left", () => {
          k.go("game");
        });
        // k.onTouchStart(() => {
        //   k.go("game");
        // });
    }
});



    ///////////// GAME SCENE /////////////

k.scene("game", () => {
  let score = 0;
  k.setGravity(1600);
  GROUND_SPEED_NEW = GROUND_SPEED * GAME_SCALE;
  PIPE_SPACING_NEW = PIPE_SPACING / GAME_SCALE;

  // Start playing the background music and store the handle
  if (backgroundMusic) {
    console.log("Stopping music");
    backgroundMusic.stop();  // Attempt to stop the music
  }

  backgroundMusic = k.play("music", {
    volume: 0.3,
    loop: true
  });

  const scoreText = k.add([
    k.text(score.toString(), {
      size: SCORE_FONT_SIZE*GAME_SCALE,
      width: 340, // it'll wrap to next line when width exceeds this value
      font: "font", 
      align: "center",
    }),
    k.anchor("center"),
    k.pos(k.width()/2,k.height()/6),
    k.z(100),
  ]);

  function setupBackground() {
    k.add([
      k.sprite("sky", {
            width: k.width(), 
            height: 160,
            tiled: true,
        }),
        k.scale(GAME_SCALE),
        k.pos(0,k.height()),
        k.anchor("botleft"),
    ]);


    const buildings = [];
    const buildingWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfBuildings = Math.ceil(k.width() / buildingWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfBuildings; i++) {
      const building = k.add([
        k.sprite("buildings"),
        k.scale(GAME_SCALE),
        k.pos(i * buildingWidth, k.height()), // Positioned at the bottom
        k.anchor("botleft"),
      ]);
      buildings.push(building);
    }


  const bushes = [];
  const bushWidth = 150 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfBushes = Math.ceil(k.width() / bushWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfBushes; i++) {
    const bush = k.add([
      k.sprite("bush"),
      k.scale(GAME_SCALE),
      k.pos(i * bushWidth, k.height()-(28*GAME_SCALE)), // Positioned at the bottom
      k.anchor("botleft"),
    ]);
    bushes.push(bush);
  }

   // Initialize ground tiles
const grounds = [];
const groundWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
const numberOfGroundTiles = Math.ceil(k.width() / groundWidth) + 2; // Ensure full coverage plus extra for safety

for (let i = 0; i < numberOfGroundTiles; i++) {
  const ground = k.add([
    k.sprite("ground"),
    k.scale(GAME_SCALE),
    k.pos(i * groundWidth, k.height()), // Positioned at the bottom
    k.anchor("botleft"),
    k.z(3),
  ]);
  grounds.push(ground);
}

// Function to move and reset ground tiles
function moveGround(speed) {
  let max = -Infinity; // Initialize max as very low to ensure correct maximum calculation

  // Move each ground and calculate max in one loop to avoid discrepancies
  grounds.forEach(ground => {
    ground.move(-speed/GROUND_PARALLAX, 0);
    if (ground.pos.x > max) {
      max = ground.pos.x;
    }
  });

  // Reset position if needed in a separate loop to ensure max has the correct final value
  grounds.forEach(ground => {
    if (ground.pos.x + groundWidth < 0) {
      ground.pos.x = max + groundWidth - 1; // Subtract 1 pixel to create overlap
    }
  });

  // Move each ground and calculate max in one loop to avoid discrepancies
  bushes.forEach(bush => {
    bush.move(-speed/BUSH_PARALLAX, 0);
    if (bush.pos.x > max) {
      max = bush.pos.x;
    }
  });

  // Reset position if needed in a separate loop to ensure max has the correct final value
  bushes.forEach(bush => {
    if (bush.pos.x + bushWidth < 0) {
      bush.pos.x = max + bushWidth - 1; // Subtract 1 pixel to create overlap
    }
  });


  // Move each ground and calculate max in one loop to avoid discrepancies
  buildings.forEach(building => {
    building.move(-speed/BUILDING_PARALLAX, 0);
    if (building.pos.x > max) {
      max = building.pos.x;
    }
  });

  // Reset position if needed in a separate loop to ensure max has the correct final value
  buildings.forEach(building => {
    if (building.pos.x + buildingWidth < 0) {
      building.pos.x = max + buildingWidth - 1; // Subtract 1 pixel to create overlap
    }
  });
}

// Game update loop
k.onUpdate(() => {
  moveGround(GROUND_SPEED_NEW); // Adjust the speed as necessary
});




}
// Call setupBackground in your game initialization
  setupBackground();

  const player = k.add([
    k.sprite("poot"),
    k.scale(GAME_SCALE),   
    k.rotate(0),
    k.pos(k.width()/4, k.height()/2),
    k.area({ shape: new k.Rect(k.vec2(0), 8,8) }),
    k.body(),
    k.z(50),
    k.anchor("center"),
    { 
      prevPosY: k.height()/2, 
      dying: false 
    }
  ]);

  player.play("idle");

  function producePipes(){
    const offset = k.rand(PIPE_RANDOM_Y*-1, PIPE_RANDOM_Y);
    // Randomly choose a PIPE_GAP within the specified range
    const PIPE_GAP = k.rand(PIPE_GAP_MIN, PIPE_GAP_MAX);

    k.add([
      k.sprite("pipe"),
      k.pos(k.width(), k.height()/2 + offset + PIPE_GAP/2),
      k.scale(GAME_SCALE),
      "pipe",
      k.area(),
      k.z(2),
      {passed: false}
    ]);

    k.add([
      k.sprite("pipe", {flipY: true}),
      k.pos(k.width(), k.height()/2 + offset - PIPE_GAP/2),
      k.scale(GAME_SCALE),
      k.anchor("botleft"),
      "pipe",
      k.z(2),
      k.area()
    ]);
  }

  k.loop(PIPE_SPACING_NEW, () => {
    producePipes();
  });
  

  k.onUpdate("pipe", (pipe) => {
    pipe.move(-GROUND_SPEED_NEW, 0);
    if (pipe.passed === false && pipe.pos.x < player.pos.x && !player.dying) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score.toString();
      k.play("collect_point", {
        volume: 0.5,
        loop: false
      });
    }
  });

  player.onCollide("pipe", () => {
    playerDead();
  });
  


  player.onUpdate(() => {
    if (player.pos.y > k.height() - (39*GAME_SCALE) || player.pos.y < -30) {
      playerDead();
    }
  
    if (!player.dying) {
      // Calculate approximate Y velocity based on position change
      const approxVelY = player.pos.y - player.prevPosY;
  
      // Define the threshold for the "idle" animation
      const idleThreshold = 2;
  
      // Determine the animation based on Y velocity
      if (approxVelY < -idleThreshold) {
        player.play("up");
      } else if (approxVelY > idleThreshold) {
        player.play("down");
      } else {
        player.play("idle");
      }
  
      // Update previous position for the next frame
      player.prevPosY = player.pos.y;
    } else {
      // Spin the player when they die
      
      player.angle -= 400 * k.dt();
    }
  });
  

  function playerJump(){
    if(!player.dying){
      // Array of your jump sound keys
      const jumpSounds = ["toot_sound_01", "toot_sound_02", "toot_sound_03"];
      // Select a random sound key
      const randomSoundKey = jumpSounds[Math.floor(Math.random() * jumpSounds.length)];
      
      k.play(randomSoundKey, {
        volume: 0.4,
        loop: false
      });
      player.jump(JUMP_FORCE);

      const jumpEffect = k.add([
        k.sprite("toot"), 
        k.pos(player.pos.x, player.pos.y),
        k.scale(GAME_SCALE), 
        k.anchor("right"),
        "toot",
      ]);
      jumpEffect.play("toot");
      k.wait(2, () => {
          k.destroy(jumpEffect);
      });
    }
  }
  k.onUpdate("toot", (toot) => {
    toot.move(-240, 0);
  });

  function debugScene(){
    k.debug.inspect = !k.debug.inspect
  }


  function playerDead(){
    if(!player.dying){
      k.play("death", {
        volume: 0.5,
        loop: false
      });
    }
    player.dying = true;
    const DEATH_KNOCK_FORCE = 700;
    player.jump(DEATH_KNOCK_FORCE);
    player.play("dead");
    

    if (backgroundMusic) {
      console.log("Stopping music");
      backgroundMusic.stop();  // Attempt to stop the music
    } else {
      console.log("Music handle not found");
    }
    
    k.wait(1, () => {
      const storedHighScore = parseInt(localStorage.getItem("flappyPootHighScore") || "0");
      if (score > storedHighScore) {
        localStorage.setItem("flappyPootHighScore", score.toString());
      }
      k.go("gameover", score);
    });
  }

  k.onKeyPress("space", () => {
    playerJump();
  });
  k.onMousePress("left", () => {
    playerJump();
  });
  // k.onTouchStart(() => {
  //   playerJump();
  // });

  // Debug
  k.onKeyPress("d", () => {
    debugScene();
  });
});


///////////// GAME OVER SCENE /////////////

k.scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score;
  }

  k.add([
    k.sprite("sky", {
          width: k.width(), 
          height: 160,
          tiled: true,
      }),
      k.scale(GAME_SCALE),
      k.pos(0,k.height()),
      k.anchor("botleft"),
  ]);
  
  // Initialize ground tiles
  const buildingsWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfBuildings = Math.ceil(k.width() / buildingsWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfBuildings; i++) {
    k.add([
      k.sprite("buildings"),
      k.scale(GAME_SCALE),
      k.pos(i * buildingsWidth, k.height()), // Positioned at the bottom
      k.anchor("botleft"),
    ]);
  }

  // Initialize ground tiles
  const bushWidth = 150 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfBushes = Math.ceil(k.width() / bushWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfBushes; i++) {
    k.add([
      k.sprite("bush"),
      k.scale(GAME_SCALE),
      k.pos(i * bushWidth, k.height()-(28*GAME_SCALE)), // Positioned at the bottom
      k.anchor("botleft"),
    ]);
  }
  
  // Initialize ground tiles
  const groundWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfGroundTiles = Math.ceil(k.width() / groundWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfGroundTiles; i++) {
    k.add([
      k.sprite("ground"),
      k.scale(GAME_SCALE),
      k.pos(i * groundWidth, k.height()), // Positioned at the bottom
      k.anchor("botleft"),
      k.z(1),
    ]);
  }

  k.add([
    k.text(
      "Gameover!\n"
      + "Score: " + score
      + "\nHigh Score: " + highScore 
      ,
      {
        size: FONT_SIZE*GAME_SCALE, // 48 pixels tall
        width: 340, // it'll wrap to next line when width exceeds this value
        font: "font", // specify any font you loaded or browser built-in
        align: "center",
      }
    ),
    k.z(100),
    k.anchor("center"),
    k.pos(k.width()/2,k.height()/2),
  ]);

  

  k.onKeyPress("space", () => {
    k.go("game");
  });
  k.onMousePress("left", () => {
    k.go("game");
  });
  // k.onTouchStart(() => {
  //   k.go("game");
  // });

});




    // Start the game with the "start" scene
    k.go("start");
  };


  // Initialize the game screen and make sure it doesnt already exist in the page
  useEffect(() => {
    if (!gameInitialized.current) {
      const gameContainer = document.getElementById("kaboom-game");
      if (gameContainer) {
        gameContainer.style.width = '100vw';
        gameContainer.style.height = '100vh';
  
        // Prevent the context menu from appearing within the game container
        const preventContextMenu = (event) => event.preventDefault();
        gameContainer.addEventListener('contextmenu', preventContextMenu);
  
        // Initialize the game
        startGame(); // Ensure this is defined and called correctly
  
        gameInitialized.current = true;
  
        // Cleanup: Remove the event listener when the component unmounts
        return () => {
          gameContainer.removeEventListener('contextmenu', preventContextMenu);
        };
      }
    }
    // Dependency array ensures this effect runs only once on mount
  }, []);

  return(
    <div className='background-color'>
      <div id="kaboom-game" className='background-color'/>
    </div>
    
  );
};

export default FlappyPootGame;
