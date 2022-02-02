window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.bestScoreKey16     = "bestScore16";
  this.bestScoreKey32     = "bestScore32";
  this.bestScoreKey64     = "bestScore64";
  this.bestScoreKey128     = "bestScore128";
  this.bestScoreKey256     = "bestScore256";
  this.bestScoreKey512     = "bestScore512";
  this.bestScoreKey1024     = "bestScore1024";
  this.bestScoreKey2048     = "bestScore2048";
  this.bestScoreKey4096     = "bestScore4096";
  this.bestScoreKey8192     = "bestScore8192";
  this.bestScoreKey16384     = "bestScore16384";
  this.bestScoreKey32768     = "bestScore32768";
  this.gameStateKey     = "gameState";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};


LocalStorageManager.prototype.getBestScore32768 = function () {
  return this.storage.getItem(this.bestScoreKey32768) || 0;
};

LocalStorageManager.prototype.setBestScore32768 = function (score) {
  this.storage.setItem(this.bestScoreKey32768, score);
};

LocalStorageManager.prototype.getBestScore16384 = function () {
  return this.storage.getItem(this.bestScoreKey16384) || 0;
};

LocalStorageManager.prototype.setBestScore16384 = function (score) {
  this.storage.setItem(this.bestScoreKey16384, score);
};
LocalStorageManager.prototype.getBestScore8192 = function () {
  return this.storage.getItem(this.bestScoreKey8192) || 0;
};

LocalStorageManager.prototype.setBestScore8192 = function (score) {
  this.storage.setItem(this.bestScoreKey8192, score);
};
LocalStorageManager.prototype.getBestScore4096 = function () {
  return this.storage.getItem(this.bestScoreKey4096) || 0;
};

LocalStorageManager.prototype.setBestScore4096 = function (score) {
  this.storage.setItem(this.bestScoreKey4096, score);
};
LocalStorageManager.prototype.getBestScore2048 = function () {
  return this.storage.getItem(this.bestScoreKey2048) || 0;
};

LocalStorageManager.prototype.setBestScore2048 = function (score) {
  this.storage.setItem(this.bestScoreKey2048, score);
};
LocalStorageManager.prototype.getBestScore1024 = function () {
  return this.storage.getItem(this.bestScoreKey1024) || 0;
};

LocalStorageManager.prototype.setBestScore1024 = function (score) {
  this.storage.setItem(this.bestScoreKey1024, score);
};
LocalStorageManager.prototype.getBestScore512 = function () {
  return this.storage.getItem(this.bestScoreKey512) || 0;
};

LocalStorageManager.prototype.setBestScore512 = function (score) {
  this.storage.setItem(this.bestScoreKey512, score);
};
LocalStorageManager.prototype.getBestScore256 = function () {
  return this.storage.getItem(this.bestScoreKey256) || 0;
};

LocalStorageManager.prototype.setBestScore256 = function (score) {
  this.storage.setItem(this.bestScoreKey256, score);
};
LocalStorageManager.prototype.getBestScore128 = function () {
  return this.storage.getItem(this.bestScoreKey128) || 0;
};

LocalStorageManager.prototype.setBestScore128 = function (score) {
  this.storage.setItem(this.bestScoreKey128, score);
};
LocalStorageManager.prototype.getBestScore64 = function () {
  return this.storage.getItem(this.bestScoreKey64) || 0;
};

LocalStorageManager.prototype.setBestScore64 = function (score) {
  this.storage.setItem(this.bestScoreKey64, score);
};
LocalStorageManager.prototype.getBestScore32 = function () {
  return this.storage.getItem(this.bestScoreKey32) || 0;
};

LocalStorageManager.prototype.setBestScore32 = function (score) {
  this.storage.setItem(this.bestScoreKey32, score);
};
LocalStorageManager.prototype.getBestScore16 = function () {
  return this.storage.getItem(this.bestScoreKey16) || 0;
};

LocalStorageManager.prototype.setBestScore16 = function (score) {
  this.storage.setItem(this.bestScoreKey16, score);
};