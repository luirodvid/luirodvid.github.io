function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.timerStatus        = 0; //0 = no, 1 = first move made
  this.startTiles     = 2;
  this.startTime      = null;
  this.timerID        = null;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Start the timer
GameManager.prototype.startTimer = function() {
  this.timerStatus = 1;
  this.startTime = new Date()
  this.timerID = setInterval( this.updateTimer, 10, this.startTime);
  
};

GameManager.prototype.endTime = function() {
  clearInterval(this.timerID);
  var curTime = new Date();
  var time = curTime.getTime() - this.startTime.getTime();
  document.getElementById("timer").innerHTML = pretty(time);
};

// Update the timer
GameManager.prototype.updateTimer = function(startTime) {
  var curTime = new Date();
  var time = curTime.getTime() - startTime.getTime();
  this.time = time;
  document.getElementById("timer").innerHTML = pretty(time);
};

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
  document.getElementById("Btimer16").innerHTML = "";
  document.getElementById("Btimer32").innerHTML = "";
  document.getElementById("Btimer64").innerHTML = "";
  document.getElementById("Btimer128").innerHTML = "";
  document.getElementById("Btimer256").innerHTML = "";
  document.getElementById("Btimer512").innerHTML = "";
  document.getElementById("Btimer1024").innerHTML = "";
  document.getElementById("Btimer2048").innerHTML = "";
  document.getElementById("Btimer4096").innerHTML = "";
  document.getElementById("Btimer8192").innerHTML = "";
  document.getElementById("Btimer16384").innerHTML = "";
  document.getElementById("Btimer32768").innerHTML = "";

};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  document.getElementById("timer").innerHTML = pretty(0);
  document.getElementById("timer16").innerHTML = this.storageManager.getBestScore16();
  document.getElementById("timer32").innerHTML = this.storageManager.getBestScore32();
  document.getElementById("timer64").innerHTML = this.storageManager.getBestScore64();
  document.getElementById("timer128").innerHTML = this.storageManager.getBestScore128();
  document.getElementById("timer256").innerHTML = this.storageManager.getBestScore256();
  document.getElementById("timer512").innerHTML = this.storageManager.getBestScore512();
  document.getElementById("timer1024").innerHTML = this.storageManager.getBestScore1024();
  document.getElementById("timer2048").innerHTML = this.storageManager.getBestScore2048();
  document.getElementById("timer4096").innerHTML = this.storageManager.getBestScore4096();
  document.getElementById("timer8192").innerHTML = this.storageManager.getBestScore8192();
  document.getElementById("timer16384").innerHTML = this.storageManager.getBestScore16384();
  document.getElementById("timer32768").innerHTML = this.storageManager.getBestScore32768();
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    this.timerStatus = 0;
    clearInterval(this.timerID);

    // Add the initial tiles
    this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    bestScore16:  this.storageManager.getBestScore16(),
    bestScore32:  this.storageManager.getBestScore32(),
    bestScore64:  this.storageManager.getBestScore64(),
    bestScore128:  this.storageManager.getBestScore128(),
    bestScore256:  this.storageManager.getBestScore256(),
    bestScore512:  this.storageManager.getBestScore512(),
    bestScore32768:  this.storageManager.getBestScore32768(),
    bestScore16384:  this.storageManager.getBestScore16384(),
    bestScore8192:  this.storageManager.getBestScore8192(),
    bestScore4096:  this.storageManager.getBestScore4096(),
    bestScore2048:  this.storageManager.getBestScore2048(),
    bestScore1024:  this.storageManager.getBestScore1024(),
    terminated: this.isGameTerminated(),
    time:       this.time
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying,
    time:        this.time
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;
  
  if (this.isGameTerminated()) return; // Don't do anything if the game's over
  
  if (this.timerStatus == 0){
    this.startTimer()
  }

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();
  var self = this;
  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          

          
          //Tile is made
          if (merged.value === 16  &&  document.getElementById("Btimer16").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer16").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer16").innerHTML = a;
              self.storageManager.setBestScore16(a);
            }
            
            document.getElementById("Btimer16").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 32  &&  document.getElementById("Btimer32").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer32").innerHTML;
            
            
            if(self.substract(a,b)<0 || b == 0){
              
              document.getElementById("timer32").innerHTML = a;
              self.storageManager.setBestScore32(a);
            }
            document.getElementById("Btimer32").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 64  &&  document.getElementById("Btimer64").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer64").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer64").innerHTML = a;
              self.storageManager.setBestScore64(a);
            }
            document.getElementById("Btimer64").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 128  &&  document.getElementById("Btimer128").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer128").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer128").innerHTML = a;
              self.storageManager.setBestScore128(a);
            }
            document.getElementById("Btimer128").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 256  &&  document.getElementById("Btimer256").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer256").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer256").innerHTML = a;
              self.storageManager.setBestScore256(a);
            }
            document.getElementById("Btimer256").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }

          if (merged.value === 512  &&  document.getElementById("Btimer512").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer512").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer512").innerHTML = a;
              self.storageManager.setBestScore512(a);
            }
            document.getElementById("Btimer512").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 32768  &&  document.getElementById("Btimer32768").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer32768").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer32768").innerHTML = a;
              self.storageManager.setBestScore32768(a);
            }
            document.getElementById("Btimer32768").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 16384  &&  document.getElementById("Btimer16384").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer16384").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer16384").innerHTML = a;
              self.storageManager.setBestScore16384(a);
            }
            document.getElementById("Btimer16384").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 8192  &&  document.getElementById("Btimer8192").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer8192").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer8192").innerHTML = a;
              self.storageManager.setBestScore8192(a);
            }
            document.getElementById("Btimer8192").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 4096  &&  document.getElementById("Btimer4096").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer4096").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer4096").innerHTML = a;
              self.storageManager.setBestScore4096(a);
            }
            document.getElementById("Btimer4096").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 2048  &&  document.getElementById("Btimer2048").innerHTML === ""){
            self.won=true;
            var a = pretty(time);
            var b = document.getElementById("timer2048").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer2048").innerHTML = a;
              self.storageManager.setBestScore2048(a);
            }
            document.getElementById("Btimer2048").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }
          if (merged.value === 1024  &&  document.getElementById("Btimer1024").innerHTML === ""){
            var a = pretty(time);
            var b = document.getElementById("timer1024").innerHTML;
            if(self.substract(a,b)<0 || b == 0){
              document.getElementById("timer1024").innerHTML = a;
              self.storageManager.setBestScore1024(a);
            }
            document.getElementById("Btimer1024").innerHTML = b == 0 ? "New!" :self.substract(a,b).slice(0, -1);
          }

        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true;
      this.endTime() // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

GameManager.prototype.substract = function (a,b) {
  c = a.split(":");
  d = b.split(":");
  e=0;
  for(i=0;i<c.length ;i++){
    e +=c[i]*(60**(c.length  -1-i));
  }
  for(i=0;i<d.length ;i++){
    e -=d[i]*(60**(d.length  -1-i));
  }
  

  if(e>0) d= "+"+pretty((e*1000).toFixed(0));
  else  d= "-"+pretty((e*-1000).toFixed(0));
  return d;
 // return pretty(e);
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
GameManager.prototype.format = function format(n) {
  return (n>0?'+':'') + n;
};
