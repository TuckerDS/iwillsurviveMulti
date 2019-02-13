var PathModule = require('./Pathfinder.js');

var Zombie = module.exports = function(top, left, game){
  this.direction="";
  this.name="Z";
  this.top = top;
  this.left = left;
  this.size = 32;
  this.symbol = 0;
  this.path = [];
  this.moving = "moving";
  this.id = null;
  this.pathIndex = 0;
  this.speed = 300;
  this.zombieID = 0 ;
  this.game = game;
};

Zombie.prototype.movePath = function(path){
  var self = this;
  self.path = path;

  var index = 0;


  self.id = setInterval(function(){

    var classDirection;
    self.moving = true;
    if (index < path.length && self.moving && self.game.board.map[self.path[index][0]][self.path[index][1]]!="Z" && path.length !==0 ) {

      if (self.path[index][0]>self.top){
        classDirection = "zombie-down";
      } else if (self.path[index][0]<self.top) {
        classDirection = "zombie-up";
      } else if (self.path[index][1]>self.left) {
        classDirection = "zombie-right";
      } else if (self.path[index][1]<self.left) {
        classDirection = "zombie-left";
      }

      self.game.board.map[self.top][self.left]="*";
      self.game.board.map[self.path[index][0]][self.path[index][1]]="Z";

      self.top=self.path[index][0];
      self.left=self.path[index][1];

      //Check collide
      if (self.game.players.length == 2) {
        if (self.top == self.game.players[0].top && self.left == self.game.players[0].left) {
          //Player 1 dead
          self.game.stopGame("DEAD");
        } else if (self.top == self.game.players[1].top && self.left == self.game.players[1].left) {
          //Player 2 dead
          self.game.stopGame("DEAD");
        }
      } else {
        if (self.top == self.game.players[0].top && self.left == self.game.players[0].left) {
          //Player 1 dead
          self.game.stopGame("DEAD");
          console.log('DEADDDDDD');
        }
      }

      //Render Zombie
      self.game.renderZombie(self, classDirection);
      index++;
    } else {
      clearInterval(self.id);
    }
  }, this.speed);
};

Zombie.prototype.target = function(players, board){
  var self = this;
  var paths = [];

  clearInterval(self.id);
  if (players.length == 1) {
    self.movePath(new PathModule([self.top, self.left], [players[0].top, players[0].left], board));
  } else {
    var path2Player1 = new PathModule([self.top, self.left], [players[0].top, players[0].left], board);
    var path2Player2 = new PathModule([self.top, self.left], [players[1].top, players[1].left], board);
      //Nearest strategy
    if (path2Player1 < path2Player2) {
      self.movePath(path2Player1);
    } else if (path2Player2 < path2Player1) {
      self.movePath(path2Player2);
    } else {
      //Random Path Strategy
      var targetPlayer = players[Math.floor(Math.random() * players.length)];
      self.movePath((new PathModule([self.top, self.left], [targetPlayer.top, targetPlayer.left], board)) );
    }
  }
};
