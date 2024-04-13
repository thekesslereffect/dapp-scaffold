import { useEffect, useRef, useState, useCallback } from 'react';
import kaboom from 'kaboom';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { notify } from "../../utils/notifications";
import formatAddress from 'utils/formatAddress';

const FlappyPootGame = () => {
  const { publicKey, signMessage  } = useWallet();
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const gameInitialized = useRef(false);
  let highScore = parseInt(localStorage.getItem("flappyPootHighScore") || "0");

  // Define the submitScore function outside of useEffect
  const submitScore = async (score) => {
    if (!publicKey || !signMessage) {
      console.error('Wallet not connected or does not support signing!');
      return;
    }
    try {
    const message = new TextEncoder().encode(`Submit Score: ${score}`);
    const signature = await signMessage(message);
    const signatureBase58 = bs58.encode(signature);
    const response = await fetch('/api/games/flappypoot/submit-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        signature: signatureBase58,
        walletAddress: publicKey.toBase58(),
      }),
    });

    const data = await response.json();
      if (response.ok) {
          notify({ type: 'success', message: 'Score submitted successfully!', txid: data.txid });
      } 
    } catch (error) {
        console.error('Failed to submit score:', error);
        notify({ type: 'error', message: `Failed to submit score: ${error.message}` });
    }
  };

  const fetchLeaderboard = useCallback(async () => {
    try {
        const response = await fetch('/api/games/flappypoot/leaderboard', {
            method: 'GET'
        });
        const data = await response.json();
        if (response.ok) {
            setLeaderboard(data);
            // notify({ type: 'success', message: 'Leaderboard fetched successfully!' });
            console.log(data);
            return data;
        } else {
            throw new Error(data.error || 'Failed to fetch leaderboard');
        }
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        notify({ type: 'error', message: `Failed to fetch leaderboard: ${error.message}` });
    }
}, [leaderboard]);


  const startGame = () => {

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
  
  let PIPE_SPACING = 2;
  let PIPE_GAP_MIN = 35;
  let PIPE_GAP_MAX = 50;
  let PIPE_RANDOM_Y = 30;
  let JUMP_FORCE = 450;

    const k = kaboom({
      scale: 1,
      root: document.getElementById("kaboom-game"),
    });

    const {loadSprite, loadSound, loadFont, play,onKeyPress, onUpdate, rotate,area,Rect,vec2,body,rand,loop,dt,wait,destroy,debug, onClick, onMousePress, scene, add, z, width, height, text, go, sprite, anchor, scale, pos, setGravity,} = k ;

    GAME_SCALE = height()/PIXEL_HEIGHT;

    loadSprite("poot", "assets/games/flappypoot/sprites/FlappyPoot_Poot.png", {
      sliceX: 5,
      anims: {
        "idle": 0,
        "up": 1,
        "down": 2,
        "dead":3,
        "puke":4,
      },
    });
    loadSprite("toot", "assets/games/flappypoot/sprites/FlappyPoot_Poot_Toot.png",{
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
    loadSprite("buildings", "assets/games/flappypoot/sprites/FlappyPoot_Buildings.png");
    loadSprite("sky", "assets/games/flappypoot/sprites/FlappyPoot_Sky.png");
    loadSprite("ground", "assets/games/flappypoot/sprites/FlappyPoot_Ground.png");
    loadSprite("bush", "assets/games/flappypoot/sprites/FlappyPoot_Bush.png");
    loadSprite("pipe", "assets/games/flappypoot/sprites/FlappyPoot_Pipe.png");
    loadSound("collect_point", "assets/games/flappypoot/sounds/collect_point_01.mp3");
    loadSound("music", "assets/games/flappypoot/sounds/music_02.mp3");
    loadSound("death", "assets/games/flappypoot/sounds/death_02.mp3");
    loadSound("toot_sound_01", "assets/games/flappypoot/sounds/toot_sound_01.mp3");
    loadSound("toot_sound_02", "assets/games/flappypoot/sounds/toot_sound_02.mp3");
    loadSound("toot_sound_03", "assets/games/flappypoot/sounds/toot_sound_03.mp3");
    loadFont("font","assets/fonts/games/digits.ttf");

      ///////////// START SCENE /////////////

  scene("start", () => {
    

    add([
      sprite("sky", {
            width: width(), 
            height: 160,
            tiled: true,
        }),
        scale(GAME_SCALE),
        pos(0,height()),
        anchor("botleft"),
    ]);

    // Initialize ground tiles
    const buildingsWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfBuildings = Math.ceil(width() / buildingsWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfBuildings; i++) {
      add([
        sprite("buildings"),
        scale(GAME_SCALE),
        pos(i * buildingsWidth, height()), // Positioned at the bottom
        anchor("botleft"),
      ]);
    }

    // Initialize ground tiles
    const bushWidth = 150 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfBushes = Math.ceil(width() / bushWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfBushes; i++) {
      add([
        sprite("bush"),
        scale(GAME_SCALE),
        pos(i * bushWidth, height()-(28*GAME_SCALE)), // Positioned at the bottom
        anchor("botleft"),
      ]);
    }
    
    // Initialize ground tiles
    const groundWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfGroundTiles = Math.ceil(width() / groundWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfGroundTiles; i++) {
      add([
        sprite("ground"),
        scale(GAME_SCALE),
        pos(i * groundWidth, height()), // Positioned at the bottom
        anchor("botleft"),
        z(1),
      ]);
    }


    if (publicKey ) {
      add([
        text(
              "Welcome to\n"
              +"FlappyPoot!\n\n"
              +`Wallet: ${ publicKey }`
              , 
              {
                size: FONT_SIZE*GAME_SCALE,
                width: 340,
                font: "Jua",
                align: "center",
            }),
            z(100),
            anchor("center"),
            pos(width()/2, height()/2),
        ]);
        onKeyPress("space", () => {
          go("game");
        });
        onMousePress("left", () => {
          go("game");
        });
      } else{
        add([
          text(
            "Welcome to\n"
            +"FlappyPoot!\n\n"
            +"Playing as Guest..."
            , 
            {
              size: FONT_SIZE*GAME_SCALE,
              width: 340,
              font: "Jua",
              align: "center",
          }),
          z(100),
          anchor("center"),
          pos(width()/2, height()/2),
          ]);


          onKeyPress("space", () => {
            go("game");
          });
          onMousePress("left", () => {
            go("game");
          });
      }
  });



      ///////////// GAME SCENE /////////////

  scene("game", () => {
    let score = 0;
    setGravity(1600);
    GROUND_SPEED_NEW = GROUND_SPEED * GAME_SCALE;
    PIPE_SPACING_NEW = PIPE_SPACING ;

    // Start playing the background music and store the handle
    if (backgroundMusic) {
      console.log("Stopping music");
      backgroundMusic.stop();  // Attempt to stop the music
    }

    backgroundMusic = play("music", {
      volume: 0.3,
      loop: true
    });

    const scoreText = add([
      text(score.toString(), {
        size: SCORE_FONT_SIZE*GAME_SCALE,
        width: 340, // it'll wrap to next line when width exceeds this value
        font: "Jua", 
        align: "center",
      }),
      
      anchor("center"),
      pos(width()/2,height()/6),
      z(100),
    ]);

    function setupBackground() {
      add([
        sprite("sky", {
              width: width(), 
              height: 160,
              tiled: true,
          }),
          scale(GAME_SCALE),
          pos(0,height()),
          anchor("botleft"),
      ]);


      const buildings = [];
      const buildingWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
      const numberOfBuildings = Math.ceil(width() / buildingWidth) + 2; // Ensure full coverage plus extra for safety

      for (let i = 0; i < numberOfBuildings; i++) {
        const building = add([
          sprite("buildings"),
          scale(GAME_SCALE),
          pos(i * buildingWidth, height()), // Positioned at the bottom
          anchor("botleft"),
        ]);
        buildings.push(building);
      }


    const bushes = [];
    const bushWidth = 150 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfBushes = Math.ceil(width() / bushWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfBushes; i++) {
      const bush = add([
        sprite("bush"),
        scale(GAME_SCALE),
        pos(i * bushWidth, height()-(28*GAME_SCALE)), // Positioned at the bottom
        anchor("botleft"),
      ]);
      bushes.push(bush);
    }

    // Initialize ground tiles
  const grounds = [];
  const groundWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
  const numberOfGroundTiles = Math.ceil(width() / groundWidth) + 2; // Ensure full coverage plus extra for safety

  for (let i = 0; i < numberOfGroundTiles; i++) {
    const ground = add([
      sprite("ground"),
      scale(GAME_SCALE),
      pos(i * groundWidth, height()), // Positioned at the bottom
      anchor("botleft"),
      z(3),
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
  onUpdate(() => {
    moveGround(GROUND_SPEED_NEW); // Adjust the speed as necessary
  });




  }
  // Call setupBackground in your game initialization
    setupBackground();

    const player = add([
      sprite("poot"),
      scale(GAME_SCALE),   
      rotate(0),
      pos(width()/4, height()/2),
      area({ shape: new Rect(vec2(0), 8,8) }),
      body(),
      z(50),
      anchor("center"),
      { 
        prevPosY: height()/2, 
        dying: false 
      }
    ]);

    player.play("idle");

    function producePipes(){
      const offset = rand(PIPE_RANDOM_Y*-1*GAME_SCALE, PIPE_RANDOM_Y*GAME_SCALE);
      // Randomly choose a PIPE_GAP within the specified range
      const PIPE_GAP = rand(PIPE_GAP_MIN*GAME_SCALE, PIPE_GAP_MAX*GAME_SCALE);

      add([
        sprite("pipe"),
        pos(width(), height()/2 + offset + PIPE_GAP/2),
        scale(GAME_SCALE),
        "pipe",
        area(),
        z(2),
        {passed: false}
      ]);

      add([
        sprite("pipe", {flipY: true}),
        pos(width(), height()/2 + offset - PIPE_GAP/2),
        scale(GAME_SCALE),
        anchor("botleft"),
        "pipe",
        z(2),
        area()
      ]);
    }

    loop(PIPE_SPACING_NEW, () => {
      producePipes();
    });
    

    onUpdate("pipe", (pipe) => {
      pipe.move(-GROUND_SPEED_NEW, 0);
      if (pipe.passed === false && pipe.pos.x < player.pos.x && !player.dying) {
        pipe.passed = true;
        score += 1;
        scoreText.text = score.toString();
        play("collect_point", {
          volume: 0.5,
          loop: false
        });
      }
    });

    player.onCollide("pipe", () => {
      playerDead();
    });
    


    player.onUpdate(() => {
      if (player.pos.y > height() - (39*GAME_SCALE) || player.pos.y < -30) {
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
        
        player.angle -= 400 * dt();
      }
    });
    

    function playerJump(){
      if(!player.dying){
        // Array of your jump sound keys
        const jumpSounds = ["toot_sound_01", "toot_sound_02", "toot_sound_03"];
        // Select a random sound key
        const randomSoundKey = jumpSounds[Math.floor(Math.random() * jumpSounds.length)];
        
        play(randomSoundKey, {
          volume: 0.4,
          loop: false
        });
        player.jump(JUMP_FORCE);

        const jumpEffect = add([
          sprite("toot"), 
          pos(player.pos.x, player.pos.y),
          scale(GAME_SCALE), 
          anchor("right"),
          "toot",
        ]);
        jumpEffect.play("toot");
        wait(2, () => {
            destroy(jumpEffect);
        });
      }
    }
    onUpdate("toot", (toot) => {
      toot.move(-40*GAME_SCALE, 0);
    });

    function debugScene(){
      debug.inspect = !debug.inspect
    }


    function playerDead(){
      if(!player.dying){
        play("death", {
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
      
      wait(1, () => {
        const storedHighScore = parseInt(localStorage.getItem("flappyPootHighScore") || "0");
        if (score > storedHighScore) {
          localStorage.setItem("flappyPootHighScore", score.toString());
        }
        go("gameover", score);
      });
    }

    onKeyPress("space", () => {
      playerJump();
    });
    onMousePress("left", () => {
      playerJump();
    });
    // onTouchStart(() => {
    //   playerJump();
    // });

    // Debug
    onKeyPress("d", () => {
      debugScene();
    });
  });


  ///////////// GAME OVER SCENE /////////////

  scene("gameover", (score) => {
    if (score > highScore) {
      highScore = score;
    }

    add([
      sprite("sky", {
            width: width(), 
            height: 160,
            tiled: true,
        }),
        scale(GAME_SCALE),
        pos(0,height()),
        anchor("botleft"),
    ]);
    
    // Initialize ground tiles
    const buildingsWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfBuildings = Math.ceil(width() / buildingsWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfBuildings; i++) {
      add([
        sprite("buildings"),
        scale(GAME_SCALE),
        pos(i * buildingsWidth, height()), // Positioned at the bottom
        anchor("botleft"),
      ]);
    }

    // Initialize ground tiles
    const bushWidth = 150 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfBushes = Math.ceil(width() / bushWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfBushes; i++) {
      add([
        sprite("bush"),
        scale(GAME_SCALE),
        pos(i * bushWidth, height()-(28*GAME_SCALE)), // Positioned at the bottom
        anchor("botleft"),
      ]);
    }
    
    // Initialize ground tiles
    const groundWidth = 92 * GAME_SCALE; // Adjusted ground width with scale
    const numberOfGroundTiles = Math.ceil(width() / groundWidth) + 2; // Ensure full coverage plus extra for safety

    for (let i = 0; i < numberOfGroundTiles; i++) {
      add([
        sprite("ground"),
        scale(GAME_SCALE),
        pos(i * groundWidth, height()), // Positioned at the bottom
        anchor("botleft"),
        z(1),
      ]);
    }

    add([
      text(
        "Gameover!\n"
        + "Score: " + score
        + "\nHigh Score: " + highScore 
        ,
        {
          size: FONT_SIZE*GAME_SCALE, // 48 pixels tall
          width: 340, // it'll wrap to next line when width exceeds this value
          font: "Jua", // specify any font you loaded or browser built-in
          align: "center",
        }
      ),
      
      z(100),
      anchor("center"),
      pos(width()/2,height()/5),
    ]);

    setScore(score);  // Update score state
    if (publicKey && signMessage) {
      add([
        text('Submit Score', { size: 60, font: 'Jua' }),
        pos((width() / 2), height() / 2),
        anchor('center'),
        area(),
        z(100),
        'submit-button',
      ]);
  
      onClick('submit-button', () => {
        submitScore(score);  // Use the submitScore function here
      });

      add([
        text('Retry', { size: 60, font: 'Jua' }),
        pos((width() / 2), height() / 2+140),
        anchor('center'),
        area(),
        z(100),
        'retry-button',
      ]);

    } else {
      add([
        text('Retry', { size: 60, font: 'Jua' }),
        pos((width() / 2), height() / 2 ),
        anchor('center'),
        area(),
        z(100),
        'retry-button',
      ]);
    }

   

    onClick('retry-button', () => {
      go("game");
    });
    
    // onKeyPress("space", () => {
    //   go("game");
    // });
    // onMousePress("left", () => {
    //   go("game");
    // });

  });

  // Start the game with the "start" scene
  go("start");
  };


  // Initialize the game screen and make sure it doesnt already exist in the page
  useEffect(() => {
    async function initGame(){
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
    }
    initGame();
    // Dependency array ensures this effect runs only once on mount
  }, []);



  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);

  const toggleLeaderboard = () => {
    setIsLeaderboardVisible(!isLeaderboardVisible);
    if (!isLeaderboardVisible) fetchLeaderboard(); // This would typically be fetched from an API
  };


  return(
    <div className='background-color'>
      <div id="kaboom-game" className='background-color'/>
      {isLeaderboardVisible && (
        <div id="leaderboard" className='absolute inset-0 bg-black bg-opacity-90 flex justify-center items-center p-8'>
           <div className='flex flex-col  items-center gap-4'>
              <h3 className="text-5xl font-bold">🏆</h3>
              <h3 className="text-5xl font-bold">LEADERBOARD</h3>
              <ul className='flex flex-col text-xl w-full gap-2'>
                  {leaderboard.map((entry, index) => (
                      <a key={index} className='flex flex-row justify-between gap-4 cursor-pointer'><div>{formatAddress(entry.walletAddress)}</div><div>{entry.score}</div></a>
                  ))}
              </ul>
          </div>
        </div>
      )}
      <button
        onClick={toggleLeaderboard}
        className='absolute button-small bottom-6 left-6'
      >
        {isLeaderboardVisible ? 'x' : '🏆'}
      </button>
      
    </div>
    
  );
};

export default FlappyPootGame;
