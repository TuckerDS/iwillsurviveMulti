var Game = function(board){
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
  this.level = 0 ;
//  this.socket = io.connect('http://localhost:5000');
};



Game.prototype.enableSockets = function () {
        socket.on('me', function (sight) {
            me = sight.id;
        });

        // socket.on('sight', function (sight) {
        //     if (sight.lastPress === 1) {
        //         canvas.style.background = '#333';
        //     }
        //     if (sight.x === null && sight.y === null) {
        //         players[sight.id] = null;
        //     } else if (!players[sight.id]) {
        //         players[sight.id] = new Circle(sight.x, sight.y, 5);
        //     } else {
        //         players[sight.id].x = sight.x;
        //         players[sight.id].y = sight.y;
        //     }
        // });
        //
        // socket.on('gameEnd', function (end) {
        //     var i = 0,
        //         l = 0;
        //     //gameEnd = end.time;
        //     gameEnd = Date.now() + 10000;
        //     for (i = 0, l = players.length; i < l; i += 1) {
        //         if (players[i] !== null) {
        //             players[i].score = 0;
        //         }
        //     }
        //     if (window.console) {
        //         window.console.log('Diff: ' + (gameEnd - end.time) / 1000);
        //     }
        // });
        //
        // socket.on('score', function (sight) {
        //     players[sight.id].score += sight.score;
        // });
        //
        // socket.on('target', function (t) {
        //     target.x = t.x;
        //     target.y = t.y;
        // });
};

Game.prototype.insertZombie = function (zombie) {
  this.zombies.push(zombie);
  zombie.zombieID = this.zombies.length -1;
  console.log(this.zombies.toString());
  var top = zombie.top;
  var left = zombie.left;
  var id = zombie.zombieID;
  $("#board").append("<div id='Z"+ id + "' class='zombie zombie-right'></div>");
  $("#Z"+id).css({left: zombie.left*this.board.tileSize, top:zombie.top*this.board.tileSize});
};

Game.prototype.insertPlayer = function (player) {
  this.players.push(player);
  var positionTop = player.top * this.board.tileSize;
  var positionLeft = player.left * this.board.tileSize;
  if (player.playerNumber === 0){
    $("#board").append("<div id='player1' class='player player1-down'></div>");
    $("#player1").css({left: positionLeft, top:positionTop});
    this.board.map[player.top][player.left] = player.playerNumber;
  } else {
    $("#board").append("<div id='player2' class='player player2-down'></div>");
    $("#player2").css({left: positionLeft, top:positionTop});
    this.board.map[player.top][player.left] = player.playerNumber;
  }
};

Game.prototype.initGame = function (level) {
  this.clean();
  this.gameTime = level.gametime;
  this.level = level.id;
  this.board = new Board(20,30,32,this);
  this.zombies = [];
  this.players = [];
  this.board.map = convert2grid(levels[this.level]);

  this.board.init();
  this.insertZombie(new Zombie(1,1));

  if (document.getElementById('nPlayers').innerHTML=="2 PLAYERS") {
    this.insertPlayer(new Player(11,15,0));
    this.insertPlayer(new Player(11,14,1));
  } else {
    this.insertPlayer(new Player(11,15,0));
  }
  this.startGameTime();
  console.log(this.board.map.toString());
};

Game.prototype.updatePaths = function(){
  var that = this;
  for (i=0; i < that.zombies.length; i++) {
    clearInterval(that.zombies[i].id);
  }
  for (i=0; i < that.zombies.length; i++) {

    if (that.players.length == 1) {
      that.zombies[i].movePath(new Path([that.zombies[i].top, that.zombies[i].left], [that.players[0].top, that.players[0].left], game.board));
    } else {
      var path2Player1 = new Path([that.zombies[i].top, that.zombies[i].left], [that.players[0].top, that.players[0].left], game.board);
      var path2Player2 = new Path([that.zombies[i].top, that.zombies[i].left], [that.players[1].top, that.players[1].left], game.board);
        //Nearest strategy
      if (path2Player1 < path2Player2) {
        that.zombies[i].movePath(path2Player1);
      } else if (path2Player2 < path2Player1) {
        that.zombies[i].movePath(path2Player2);
      } else {
        //Random Path Strategy
        var targetPlayer = that.players[Math.floor(Math.random() * that.players.length)];
        that.zombies[i].movePath((new Path([that.zombies[i].top, that.zombies[i].left], [targetPlayer.top, targetPlayer.left], game.board)) );
      }
    }
  }
};

Game.prototype.startGameTime = function(){
  var count = 0;
  var that = this;

  this.stopSound("ace");
  this.playSound("iwillsurvive");

  document.getElementById("time").innerHTML = (that.gameTime / 1000);
  game.updatePaths(this.players[0].top, this.players[0].left);

  this.gameOverTimer = setInterval(function(){
    //Call function stopGame, winning
    that.stopGame("TIMEOUT");
  },this.gameTime);

  //Start game
  this.resetTimer();

  this.zombieTimer = setInterval(function(){
    if (that.board.map[1][1]=="*") {
      that.insertZombie(new Zombie(1,1));
    }
    that.updatePaths();
  },this.zombieGenerationInterval);
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
  clearInterval(this.zombieTimer);
  clearInterval(this.gameTimer);
  clearInterval(this.gameOverTimer);

  var that = this;
  //Stop zombies intervals
  for (i=0; i < game.zombies.length; i++) {
    clearInterval(game.zombies[i].id);
  }

  //Eventos de final
  if (gameDeadType == "TIMEOUT") {
    this.stopSound("iwillsurvive");
    this.playSound("ace");
    document.getElementById("message").innerHTML="YOU'VE SURVIVE!!!";
    $("#message").removeClass('hide');
  } else if (gameDeadType == "DEAD"){
    this.stopSound("iwillsurvive");
    this.playSound("dead");
    document.getElementById("message").innerHTML="GAME OVER";
    $("#message").removeClass('hide');
  } else if (gameDeadType == "STOP") {
    this.stopSound("iwillsurvive");
    this.stopSound("ace");
  }
  document.getElementById("start").innerHTML = "Start";
};

Game.prototype.setGameTimer = function(value){
  document.getElementById("time").innerHTML = parseInt(value) + " SEC";
};

Game.prototype.clean = function(sound){
  for (var z=this.zombies.length-1; z===0; z--){
    this.zombies[z].pull();
  }
  for (var p=this.players.length-1; p===0; p--){
    this.players[p].pull();
  }
  $("#board").empty();
};

Game.prototype.playSound = function(sound){
  var audio = document.getElementById(sound);
  if (audio.paused) audio.play();
};

Game.prototype.stopSound = function(sound){
  var audio = document.getElementById(sound);
  if (!audio.paused) audio.pause();
};
