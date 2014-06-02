
//STARTING SCORE

var score = 0;

//NUMBER OF LIVES

var lives = 3;

//SPEED OF ALIENS - THE ALIEN FLOCK

var AlienFlock = function AlienFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 20;
  this.alive = true;
    
  this.draw = function() {};


  this.die = function() {
      this.alive = false;
      
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel())); 
    } else {
      Game.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;
    }
      
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Alien)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}

//ALIEN FUNCTIONS

var Alien = function Alien(opts) {
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;
}

// THIS IS THE LOGIC FOR THE ALIENS STEPS + MOVEMENTS

Alien.prototype.draw = function(canvas) {  Sprites.draw(canvas,this.name,this.x,this.y,this.frame);
}

//THIS HAPPENS WHEN THE ALIEN DIES, AUDIO PLAYS, REMOVES ALIEN, THE SPEED INCREMENTS WHEN THE ALIEN DIES
Alien.prototype.die = function() {
  GameAudio.play('die');
//THE SPEED EACH TIME YOU KILL AN ALIEN
  this.board.remove(this);
  score = score +1;
  document.getElementById('score').innerHTML="SCORE : " + score;

}

Alien.prototype.step = function(dt) {
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
 // THE SPEED MOVEMENTS OF ATTACKER ALIENS
  if(Math.abs(this.mx) > 10) {
    if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    this.x += this.mx;
    this.mx = 0;
    // THIS CHANGES / ADDS FRAMES FOR SPRITE SHEET %2
    this.frame = (this.frame+1) %2;
    if(this.x > Game.width - Sprites.map.alien1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.alien1.w) this.flock.hit = 1;
  }
  return true;
}

// THE ALIENS SHOOTING FIRE

Alien.prototype.fireSometimes = function() {
    // LOGIC TO SET FREQUENCY OF ALIEN FIRE - IF NUMBER IS LESS THAN 100 - SHOOT MISSILE
      if(Math.random()*100 < 10) {
        this.board.addSprite('missile',this.x + this.w/2 - Sprites.map.missile.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }
}

//THE PLAYER

var Player = function Player(opts) { 
  this.reloading = 0;
}

Player.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'player',this.x,this.y);
}


Player.prototype.die = function() {
  GameAudio.play('die');
    Game.callbacks['loseLife']();
    loseLife();
    loseLifeScreen();
    
    if(lives <= 0){
        Game.callbacks['die']();
        lives = 3;
        
        };
    
}



// CONTROL MOVING ALONG THE AXIS - LEFT/RIGHT/UP/DOWN / THE SPEED
Player.prototype.step = function(dt) {
  if(Game.keys['left']) { this.x -= 100 * dt; }
  if(Game.keys['right']) { this.x += 100 * dt; }
  if(Game.keys['up']) { this.y -= 100* dt; }
  if(Game.keys['down']) { 
      if(this.y < 480) { 
            this.y += 100* dt;
      }
      
  }

  if(this.x < 0) this.x = 0;
  if(this.x > Game.width-this.w) this.x = Game.width-this.w;

  if(this.y < 400) this.y = 400;
  if(this.height > Game.height) this.height  = Game.height - this.y;
    
//MISSILES 
  this.reloading--;
// CHANGES THE NUMBER + TYPES OF MISSILES < 10 
  if(Game.keys['fire'] && this.reloading <= 0 && this.board.missiles < 100) {
    GameAudio.play('fire');
    this.board.addSprite('missile',
                          this.x + this.w/2 - Sprites.map.missile.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.missiles++;
      // THE TIME BETWEEN SHOOTING THE MISSILES
    this.reloading = 10;
  }
  return true;
}


// THE MISSILES

var Missile = function Missile(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
}


Missile.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'missile',this.x,this.y);
}

Missile.prototype.step = function(dt) {
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;

        
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}

Missile.prototype.die = function() {
  if(this.player) this.board.missiles--;
       
  if(this.board.missiles < 0) this.board.missiles=0;
   this.board.remove(this);
    
}

// MOTHERSHIP FUNCTION

var ShipFlock = function ShipFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 20;

  this.draw = function() {};

  this.die = function() {
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel())); 
    } else {
      Game.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;
    }
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Ship)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}

///MOTHERSHIP

var Ship = function Ship(opts) {
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;

}

// THIS IS THE LOGIC FOR THE ALIENS STEPS + MOVEMENTS

Ship.prototype.draw = function(canvas) {  Sprites.draw(canvas,this.name,this.x,this.y,this.frame);
}

Ship.prototype.die = function() {
  GameAudio.play('ShipSound');
//THE SPEED EACH TIME YOU KILL AN ALIEN
  this.board.remove(this);
  score = score +3;
  document.getElementById('score').innerHTML="SCORE : " + score;
    
}

Ship.prototype.step = function(dt) {
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
 // THE SPEED MOVEMENTS OF THE MOTHERSHIP
  if(Math.abs(this.mx) > 10) {
    
      this.fireSometimes();
   
    this.x += this.mx;
    this.mx = 0;
    // THIS CHANGES / ADDS FRAMES FOR SPRITE SHEET %2
    this.frame = (this.frame+1) %2;
      
  }
  return true;
}

// THE MOTHERSHIP MISSILE FREQUENCY
Ship.prototype.fireSometimes = function() {
      if(Math.random()*100 < 10) {
        this.board.addSprite('missile',this.x + this.w/2 - Sprites.map.missile.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }
}