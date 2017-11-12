var Zombie = function(top, left){
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
};

Zombie.prototype.movePath = function(path){
  this.path = path;

  var index = 0;
  var that = this;

  that.id = setInterval(function(){
    var classDirection = "zombie zombie-down";
    that.moving = true;
    if (index < path.length && that.moving && game.board.map[that.path[index][0]][that.path[index][1]]!="Z" && path.length !==0 ) {

      if (that.path[index][0]>that.top){
        classDirection = "zombie zombie-down";
      } else if (that.path[index][0]<that.top) {
        classDirection = "zombie zombie-up";
      } else if (that.path[index][1]>that.left) {
        classDirection = "zombie zombie-right";
      } else if (that.path[index][1]<that.left) {
        classDirection = "zombie zombie-left";
      }

      game.board.map[that.top][that.left]="*";
      game.board.map[that.path[index][0]][that.path[index][1]]="Z";

      that.top=that.path[index][0];
      that.left=that.path[index][1];

      //Check collide
      if (game.players.length == 2) {
        if (that.top == game.players[0].top && that.left == game.players[0].left) {
          //Player 1 dead
          game.stopGame("DEAD");
        } else if (that.top == game.players[1].top && that.left == game.players[1].left) {
          //Player 2 dead
          game.stopGame("DEAD");
        }
      } else {
        if (that.top == game.players[0].top && that.left == game.players[0].left) {
          //Player 1 dead
          game.stopGame("DEAD");
        }
      }
      //Render Zombie
      $("#Z"+that.zombieID).removeClass().addClass(classDirection);
      $("#Z"+that.zombieID).animate({left: that.left*game.board.tileSize, top:that.top*game.board.tileSize}, 300);
      index++;
    } else {
      clearInterval(that.id);
    }
  }, this.speed);
};
