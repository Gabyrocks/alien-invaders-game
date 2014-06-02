//lOADING A LEVEL

  var levelData = { 
     1:  [[3,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,2,2,0,0,2,2,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,2,2,0,0,0,0,0,0,2,2],
          [0,0,2,0,0,0,0,0,0,2,0],
          [0,0,0,1,0,0,0,0,1,0,0],
          [0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
       3: [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,2,2,2,2,2,2,0,0],
          [0,0,0,1,1,1,1,1,0,0,0],
          [0,0,0,0,2,2,2,0,0,0,0],
          [0,0,0,0,0,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]]};

//INDIVIDUAL SPRITES DEFINED FROM SPRITE SHEET X Y AXIS, WIDTH, HEIGHT, FRAMES

  var spriteData = {
    'alien1': { sx: 0,  sy: 0,  w: 23, h: 18, cls: Alien, frames: 2 },
    'alien2': { sx: 0,  sy: 18, w: 23, h: 18, cls: Alien, frames: 2 },
    'alien3': { sx: 48,  sy: 0,  w: 27, h: 18, cls: Ship, frames: 2 },
    'player': { sx: 0,  sy: 36, w: 26, h: 17, cls: Player },
    'missile': { sx: 0,  sy: 86, w: 3,  h: 14, cls: Missile },
    
  }

// THE LOADING GAME SCREEN & DEFINE START CALL BACK
  
  function loseLife(){
  if(this.Player) lives = lives -1;
    document.getElementById('lives').innerHTML="LIVES : " + lives; 
  }


function loseLifeScreen() {
    var screen = new GameScreen("SCORE : "+score+" ","you have "+lives+" lives left", "     ",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);

  }

function menuScreen() {
    var screen = new HelpPage("k 8","+1 points","2","+3 points","spacebar to start",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);

  }


  function startGame() {
    var screen = new GameScreen("ALIEN INVADERS","spacebar to start", "instructions",
                                
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {
    var screen = new GameScreen("GAME OVER","SCORE : "+score+" ",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                      document.getElementById('lives').innerHTML="LIVES : " + lives;
                                      
                                     score = 0;
                                     document.getElementById('score').innerHTML="SCORE : " + score;
                                     
                            
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("You Win!","press space to restart",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

//AUDIO FUNCTIONS - CHANGE AUDIO FILES HERE

  $(function() {
    GameAudio.load({ 'fire' : 'media/zapper.ogg', 'ShipSound' : 'media/ShipSound.ogg', 'die' : 'media/AlienDie.ogg' }, 
                   
                  //GAME INITIALIZE
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "loseLife" : loseLifeScreen,
                                        "menu" : menuScreen,
                                        "win"  : winGame });
                                        
                   });
   });


