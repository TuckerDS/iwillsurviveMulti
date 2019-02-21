var ZombieModule = require('./Zombie.js');
var BoardModule = require('./Board.js');
var PathModule = require('./Pathfinder.js');
var PlayerModule = require('./Player.js');

var Game = module.exports = function(board, server){
  this.players = [];
  this.size = 0;
  this.board = board;
  this.zombies = [];
  this.players = [];
  this.bullets = [];
  this.objects = [];
  this.gameTime = 20 * 1000;
  this.zombieGenerationInterval = 2 * 1000;
  this.gameTimeID = null;
  this.playOn=true;
  this.level = 0;
  this.nPlayers = server.nPlayers;
  this.server = server;
  this.moveStack = [];
  // this.zombieRenderInterval = 33;
  // this.zombieRenderTimeID = null;
  this.renderInterval = 1000 / 60;
  this.renderTimeID = null;
};

Game.prototype.insertZombie = function (zombie) {
  var self = this;
  this.zombies.push(zombie);
  zombie.zombieID = this.zombies.length -1;
  zombie.direction = 'zombie-right';
  var positionTop = zombie.top*this.board.tileSize;
  var positionLeft = zombie.left*this.board.tileSize;

  self.server.emitEvent('insertZombie', {'zombieID': zombie.zombieID, 'direction': zombie.direction, 'top':positionTop, 'left':positionLeft});
};

Game.prototype.insertPlayer = function (player) {
  var self = this;
  this.players.push(player);
  var positionTop = player.top * this.board.tileSize;
  var positionLeft = player.left * this.board.tileSize;
  if (player.playerNumber === 0){
    this.board.map[player.top][player.left] = player.playerNumber;
  } else {
    this.board.map[player.top][player.left] = player.playerNumber;
  }
  self.server.emitEvent('insertPlayer', {'playerNumber': player.playerNumber, 'top':positionTop, 'left':positionLeft});
};

Game.prototype.initGame = function (level) {
  var self = this;
  self.clean();
  self.gameTime = level.gametime;
  self.level = level.id;
  self.board = new BoardModule(20,30,32,self);
  self.zombies = [];
  self.players = [];
  self.board.map = self.convert2grid(level.level);

  self.board.init();
  self.insertZombie(new ZombieModule(1,1, self));

  if (self.nPlayers == 2) {
    self.insertPlayer(new PlayerModule(11,15,0, self));
    self.insertPlayer(new PlayerModule(11,14,1, self));
  } else {
    self.insertPlayer(new PlayerModule(11,15,0, self));
  }
  self.startGameTime();
  // console.log(this.board.map.toString());
};

Game.prototype.updatePaths = function(){
  var self = this;
  for (i=0; i < self.zombies.length; i++) {
    self.zombies[i].target(self.players, self.board);
  }
};

Game.prototype.startGameTime = function(){
  var self = this;

  self.server.emitEvent('stopSound', {'value': 'ace'});
  self.server.emitEvent('playSound', {'value': 'iwillsurvive'});

  self.server.emitEvent('updateTime', {'value': self.gameTime / 1000});
  self.updatePaths();

  self.gameOverTimer = setInterval(function(){
    //Call function stopGame, winning
    self.stopGame("TIMEOUT");
  },self.gameTime);

  //Start game
  self.resetTimer();

  self.zombieTimer = setInterval(function(){
    if (self.board.map[1][1]=="*") self.insertZombie(new ZombieModule(1,1, self));
    self.updatePaths();
  },self.zombieGenerationInterval);

  self.renderTimeID = setInterval(function () {
    self.server.emitEvent('renderUpdate', {
      date: Date.now(),
      moves: self.moveStack
    });
    self.moveStack = [];
  }, self.renderInterval);
};

Game.prototype.resetTimer = function(){
  var that = this;
  var gameTime = this.gameTime;
  var timerSpeed = 100;
  this.gameTimer = setInterval(function(){
    that.setGameTimer(gameTime/1000);
    gameTime -= timerSpeed;
  }, timerSpeed);
};

Game.prototype.stopGame = function(gameDeadType){
  console.log('gameDeadType', gameDeadType)
  var self = this;
  clearInterval(self.zombieTimer);
  clearInterval(self.zombieRenderTimeID);
  clearInterval(self.gameTimer);
  clearInterval(self.gameOverTimer);
  clearInterval(self.renderTimeID);

  //Stop zombies intervals
  for (i=0; i < self.zombies.length; i++) {
    clearInterval(self.zombies[i].id);
  }
  self.server.emitEvent('stopGame', {'value': gameDeadType});
};

Game.prototype.setGameTimer = function(value){
  var self = this;
  self.server.emitEvent('setGameTimer', {'value': value});
};

Game.prototype.clean = function(sound){
  var self = this;
  for (var z=this.zombies.length-1; z===0; z--){
    this.zombies[z].pull();
  }
  for (var p=this.players.length-1; p===0; p--){
    this.players[p].pull();
  }
  self.cleanBoard();
};

Game.prototype.playSound = function(sound){
  var audio = document.getElementById(sound);
  if (audio.paused) audio.play();
};

Game.prototype.stopSound = function(sound){
  var audio = document.getElementById(sound);
  if (!audio.paused) audio.pause();
};

Game.prototype.renderPlayer = function(options){
  var self = this;
  options.top = options.top * this.board.tileSize;
  options.left = options.left *this.board.tileSize;

  self.moveStack.push(options);
};

Game.prototype.renderZombie = function(zombie, direction){
  var self = this;
  var positionTop = zombie.top*this.board.tileSize;
  var positionLeft = zombie.left*this.board.tileSize;
  var options = {
    'type': 'zombie',
    'zombieID':zombie.zombieID,
    'preDirection': zombie.direction,
    'direction': direction,
    'top': positionTop,
    'left': positionLeft
  };
  zombie.direction = direction;
  self.moveStack.push(options);
};

Game.prototype.renderBoard = function(board){
  var self = this;
  var boardLite = {
    'map': board.map,
    'rows': board.rows,
    'cols': board.cols,
  };

  self.server.emitEvent('renderBoard', {'board':boardLite});
};

Game.prototype.cleanBoard = function(board){
  var self = this;
  self.server.emitEvent('cleanBoard', {});
};

Game.prototype.convert2grid = function(level) {
  var grid = [];
  for (var i=0; i < level.length ;i++) {
    grid.push(level[i].split(""));
  }
  return grid;
};
