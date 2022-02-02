function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.Btimer16    = document.querySelector("#Btimer16");
  this.Btimer32    = document.querySelector("#Btimer32");
  this.Btimer64    = document.querySelector("#Btimer64");
  this.Btimer128    = document.querySelector("#Btimer128");
  this.Btimer256    = document.querySelector("#Btimer256");
  this.Btimer512    = document.querySelector("#Btimer512");
  this.Btimer32768    = document.querySelector("#Btimer32768");
  this.Btimer16384    = document.querySelector("#Btimer16384");
  this.Btimer8192    = document.querySelector("#Btimer8192");
  this.Btimer4096    = document.querySelector("#Btimer4096");
  this.Btimer2048    = document.querySelector("#Btimer2048");
  this.Btimer1024    = document.querySelector("#Btimer1024");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.updateBestScore1024 = function (bestScore1024) {
  this.Btimer1024.textContent = bestScore1024;
};

HTMLActuator.prototype.updateBestScore2048 = function (bestScore2048) {
  this.Btimer2048.textContent = bestScore2048;
};

HTMLActuator.prototype.updateBestScore4096 = function (bestScore4096) {
  this.Btimer4096.textContent = bestScore4096;
};

HTMLActuator.prototype.updateBestScore8192 = function (bestScore8192) {
  this.Btimer8192.textContent = bestScore8192;
};

HTMLActuator.prototype.updateBestScore16384 = function (bestScore16384) {
  this.Btimer16384.textContent = bestScore16384;
};

HTMLActuator.prototype.updateBestScore32768 = function (bestScore32768) {
  this.Btimer32768.textContent = bestScore32768;
};

HTMLActuator.prototype.updateBestScore512 = function (bestScore512) {
  this.Btimer512.textContent = bestScore512;
};

HTMLActuator.prototype.updateBestScore256 = function (bestScore256) {
  this.Btimer256.textContent = bestScore256;
};

HTMLActuator.prototype.updateBestScore16 = function (bestScore16) {
  this.Btimer16.textContent = bestScore16;
};

HTMLActuator.prototype.updateBestScore128 = function (bestScore128) {
  this.Btimer128.textContent = bestScore128;
};

HTMLActuator.prototype.updateBestScore64 = function (bestScore64) {
  this.Btimer64.textContent = bestScore64;
};

HTMLActuator.prototype.updateBestScore32 = function (bestScore32) {
  this.Btimer32.textContent = bestScore32;
};


HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
