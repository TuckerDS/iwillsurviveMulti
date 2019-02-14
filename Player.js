var Player = module.exports = function(top, left, playerNumber, game){
  this.top = top;   // || 11;
  this.left = left; // || 15;
  this.direction = "S";
  this.size = 0;
  this.symbol = 0;
  this.playerNumber = playerNumber;
  this.game = game;
};

Player.prototype.moveForward = function() {
  switch(this.direction) {
    case 'N': this.top--; break;
    case 'E': this.left++; break;
    case 'S': this.top++; break;
    case 'W': this.left--; break;
  }
};

Player.prototype.moveUp = function() {
  if (this.direction == "N")  this.moveForward();
  else                        this.direction="N";
};

Player.prototype.moveDown = function() {
  if (this.direction == "S")  this.moveForward();
  else                        this.direction="S";
};

Player.prototype.moveLeft = function() {
  if (this.direction == "W")  this.moveForward();
  else                        this.direction="W";
};

Player.prototype.moveRight = function() {
  if (this.direction == "E")  this.moveForward();
  else                        this.direction="E";
};

Player.prototype.move = function(moveOption) {
  var self = this;
  //if (document.getElementById("start").innerHTML == "Stop"){
    preCoordY = this.top;
    preCoordX = this.left;
    preDirection = this.direction;

    switch (moveOption) {
      case "F": this.moveUp(); break;
      case "B": this.moveDown(); break;
      case "R": this.moveRight(); break;
      case "L": this.moveLeft(); break;
      default:
    }

    if (this.top == preCoordY && this.left == preCoordX) {
      this.render(preCoordY, preCoordX, preDirection);
    } else {
      var tile = self.game.board.getItemAtPosition(this.top, this.left);
      switch (tile) {
        case "*":
        case this.playerNumber:
            // Clean previous position
          self.game.board.map[preCoordY][preCoordX] = "*";
          self.game.board.map[this.top][this.left] = this.playerNumber;
            // Render
          this.render(preCoordY, preCoordX, preDirection);
            // Update paths
            //game.updatePaths();
            // Update map
          break;
        case "Z":
            // Death
          self.game.stopGame("DEAD");
          break;
        default:
            //Stay
          this.top = preCoordY;
          this.left = preCoordX;
          this.direction = preDirection;
      }
    }

};

Player.prototype.render = function(preCoordY, preCoordX, preDirection){
  var top;
  var left;
  var self = this;
  var classDirection;
  var classPreDirection;
  var options = {};

  if (this.playerNumber===0) {
    switch (self.direction) {
      case "N": classDirection = 'player1-up'; break;
      case "S": classDirection = 'player1-down'; break;
      case "E": classDirection = 'player1-right'; break;
      case "W": classDirection = 'player1-left'; break;
    }
    switch (preDirection) {
      case "N": classPreDirection = 'player1-up'; break;
      case "S": classPreDirection = 'player1-down'; break;
      case "E": classPreDirection = 'player1-right'; break;
      case "W": classPreDirection = 'player1-left'; break;
    }
  } else {
    switch (self.direction) {
      case "N": classDirection = 'player2-up'; break;
      case "S": classDirection = 'player2-down'; break;
      case "E": classDirection = 'player2-right'; break;
      case "W": classDirection = 'player2-left'; break;
    }
    switch (preDirection) {
      case "N": classPreDirection = 'player2-up'; break;
      case "S": classPreDirection = 'player2-down'; break;
      case "E": classPreDirection = 'player2-right'; break;
      case "W": classPreDirection = 'player2-left'; break;
    }
  }

  options.type = 'player';
  options.playerNumber = this.playerNumber;
  options.preDirection = classPreDirection;
  options.direction = classDirection;
  options.top = this.top;
  options.left = this.left;

  self.game.renderPlayer(options);
};


// No usefull functions at this stage
// Player.prototype.shoot = function(){};
// Player.prototype.init = function(){};
// Player.prototype.checkCollides = function(){};
// Player.prototype.updatePosition = function(){};
