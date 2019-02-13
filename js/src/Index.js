
var game;
var level = {'id': 0, 'gametime': 30000, 'level': levels[0]};
var socket;
var me;

$(document).ready(function() {
  socket = io.connect('http://localhost:5000');

  enableSockets();
  enableInputs();
  function enableSockets() {
    socket.on('me', function (sight) {
        me = sight.id;
        console.log('ID',me);
    });

    socket.on('sight', function (sight) {
      //me = sight.id;

        // if (sight.x === null && sight.y === null) {
        //     players[sight.id] = null;
        // } else if (!players[sight.id]) {
        //     players[sight.id] = new Circle(sight.x, sight.y, 5);
        // } else {
        //     players[sight.id].x = sight.x;
        //     players[sight.id].y = sight.y;
        // }
    });
    socket.on('clickStart', function (options) {
      console.log('RECIBIENDO START');
      clickStart(options);
    });
    socket.on('keypress', function (sight) {
      console.log('RECIBIENDO tecla', sight);
      keyupWindow(sight);
    });

    socket.on('renderZombie', function (options) {
      console.log('Render Zombie', options);
      renderZombie(options);
    });

    socket.on('renderZombies', function (options) {
      console.log('Render Zombie', options);
      for (i=0; i< options.zombies.length;i++){
        renderZombie(options.zombies[i]);
      }

    });

    socket.on('renderPlayer', function (options) {
      console.log('Render Player', options);
      renderPlayer(options);
    });

    socket.on('renderBoard', function (options) {
      console.log('Render Board', options);
      renderBoard(options.board);
    });

    socket.on('levelSelection', function (options) {
      console.log('Render Board', options);
      clickLevelSelector(options);
    });
    socket.on('cleanBoard', function (options) {
      console.log('clean Board', options);
      $("#board").empty();
    });
    socket.on('setGameTimer', function (options) {
      console.log('timer', options);
      $("#time").html(parseInt(options.value) + " SEC");
    });

    socket.on('insertPlayer', function (options) {
      console.log('insertPlayer', options);
      insertPlayer(options);
    });

    socket.on('insertZombie', function (options) {
      console.log('insertZombie', options);
      insertZombie(options);
    });

    socket.on('updateTime', function (options) {
      console.log('time');
      $("#time").html(options.value);
    });

    socket.on('playSound', function (options) {
      playSound(options.value);
    });

    socket.on('stopSound', function (options) {
      stopSound(options.value);
    });

    socket.on('stopGame', function (options) {
      stopGame(options.value);
    });
  }

  function enableInputs() {
       $(document).on('keyup', function (e) {
         console.log('EMITIENDO tecla');
           var config = {keyCode: e.keyCode};
           if ('charCode' in e) config.charCode = e.charCode;
           socket.emit('keypress', config);
       });

       $('#levelSelector').change( function (e) {
        var options = {};
        options.selection = e.currentTarget.selectedIndex;
        options.levelId = options.selection;
        options.level = levels[options.levelId];
        socket.emit('changeSelection', options);
       });

       $('#start').on("click", function (e) {
         console.log('EMITIENDO FIST CLICK');
         var options = {};
         if ($('#start').html() == "Start")
           options = {'type': 'start', 'level':level};
         else
           options = {'type': 'stop'};
         socket.emit('clickStart', options);
       });
   }

  function clickStart(options){
    console.log('options', options);
    //Crear tablero
    if (options.type == "start") {
      $("#message").addClass('hide');
      $('#start').html("Stop") ;
    } else {
      $('#start').html("Start") ;
    }
  }

  function keyupWindow(config) {
    switch (config.keyCode) {
      case 49: //Player1   keycode(77)=1
        var element = $('#nPlayers');
        element.html('1 PLAYER');
        break;
      case 50: //Player2   keycode(77)=2
        var element = $('#nPlayers');
        element.html('2 PLAYERS');
        break;
    }
  }

  function clickLevelSelector(selection, levelId){
    selection = selection;
    level.id = levelId;
    switch (selection) {
      case 0:
        level.gametime = 30000;
        break;
      case 1:
        level.gametime = 45000;
        break;
      case 2:
        level.gametime = 60000;
        break;
      case 3:
        level.gametime = 75000;
        break;
      case 4:
        level.gametime = 90000;
        break;
      default:
    }
  }

  function renderZombie (options){
    console.log('renderZombie', options);
    var zombieElement = $('#Z' + options.zombieID);
    if (options.direction != options.preDirection) {
      zombieElement.removeClass(options.preDirection).addClass(options.direction);
    }

    zombieElement.animate({left: options.left, top:options.top}, 300);
  }

  function renderPlayer (options){
    var self = this;
    var playerNumber = options.playerNumber;
    if (playerNumber === 0) {
      $("#player1").removeClass(options.preDirection).addClass(options.direction);
      $("#player1").animate({'left': options.left, 'top':options.top}, 50);
    } else {
      $("#player2").removeClass(options.preDirection).addClass(options.direction);
      $("#player2").animate({'left': options.left, 'top':options.top}, 50);
    }
    //console.log(self.board.map.toString());
    playSound("walk");
  }

  function renderBoard(board){
    var html = "";
    $("#board").empty();

    for (var y = 0; y < board.rows; y++){
      for (var x = 0; x < board.cols; x++){
        var tileClass;
        if (board.map[y][x] == "*")
          tileClass = "tile empty";
        else
          tileClass = "tile wall";
        html +=("<div id='"+ y +"-"+ x +"' class='square " + tileClass + "' style='{top: " + (y*board.tileSize) + "px;left:"  + (x*board.tileSize) + "px;}'></div>");
      }
    }
    $('#board').append(html);
    $(".square").on("click", board.clickBoard);
  }

  function insertPlayer (options) {
    if (options.playerNumber === 0){
      $("#board").append("<div id='player1' class='player player1-down'></div>");
      $("#player1").css({left: options.left, top:options.top});
    } else {
      $("#board").append("<div id='player2' class='player player2-down'></div>");
      $("#player2").css({left: options.left, top: options.top});
    }
  }

  function insertZombie (options) {
    var zombieElement = $("<div class='zombie'></div>");
    options.direction = 'zombie-right';
    zombieElement.attr('id', 'Z'+options.zombieID);
    zombieElement.addClass(options.direction);
    zombieElement.css({left: options.left, top: options.top});
    $("#board").append(zombieElement);
  }

  function stopGame (gameDeadType){
    //Eventos de final
    if (gameDeadType == "TIMEOUT") {
      stopSound("iwillsurvive");
      playSound("ace");
      document.getElementById("message").innerHTML="YOU'VE SURVIVE!!!";
      $("#message").removeClass('hide');
    } else if (gameDeadType == "DEAD"){
      stopSound("iwillsurvive");
      playSound("dead");
      document.getElementById("message").innerHTML="GAME OVER";
      $("#message").removeClass('hide');
    } else if (gameDeadType == "STOP") {
      stopSound("iwillsurvive");
      stopSound("ace");
    }
    $("#start").html("Start");
  }

  function playSound (sound){
    var audio = document.getElementById(sound);
    if (audio.paused) audio.play();
  }

  function stopSound (sound){
    var audio = document.getElementById(sound);
    if (!audio.paused) audio.pause();
  }

});
