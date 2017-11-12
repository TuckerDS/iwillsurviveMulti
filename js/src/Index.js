
var game;
var level = {id: 0, gametime: 30000};
var socket;
var me;

$(document).ready(function() {
  socket = io.connect('http://localhost:5000');
  //Eventos
  //$(document).on( "keyup", keyupWindow);
  $('#levelSelector').change(clickLevelSelector);
  //$('#start').on("click",clickStart);

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
    socket.on('clickStart', function (sight) {
      console.log('RECIBIENDO START');
      clickStart();
    });
    socket.on('keypress', function (sight) {
      console.log('RECIBIENDO tecla', sight);
      keyupWindow(sight);
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
         socket.emit('changeSelection', {
           selection: e.currentTarget.selectedIndex
          });
       });

       $('#start').on("click", function (e) {
         console.log('EMITIENDO FIST CLICK');
         socket.emit('clickStart', {});
       });
   }

  function clickStart(e){
    //Crear tablero
    if ($('#start').html() == "Start") {
      $("#message").addClass('hide');
      game = new Game(new Board(20,30,32));
      game.initGame(level);
      $('#start').html("Stop") ;
    } else {
      $('#start').html("Start") ;
      game.stopGame("STOP");
    }
  }

  function keyupWindow(e) {
      var chCode = ('charCode' in e) ? e.charCode : e.keyCode;
      var userMove;
      //alert ("keyCode: " + event.keyCode + " Unicode charcode: " + chCode + " StringFrom charcode: "+ String.fromCharCode(chCode));
      //alert(e.keyCode);
      var player = 0;
      switch (e.keyCode) {
        case 38: //up     keycode(70)=F
          userMove="F"; player = 1;
          break;
        case 40: //down   keycode(66)=B
          userMove="B"; player = 1;
          break;
        case 39: //right  keycode(82)=R
          userMove="R"; player = 1;
          break;
        case 37: //left   keycode(77)=L
          userMove="L"; player = 1;
          break;
        case 49: //Player1   keycode(77)=1
            //userMove="L";
            break;
        case 50: //Player2   keycode(77)=2
            //userMove="L";
            break;
        case 68: //left P2   keycode(77)=D
            userMove="R"; player = 2;
            break;
        case 65: //left P2   keycode(77)=A
            userMove="L"; player = 2;
            break;
        case 87: //left P2   keycode(77)=W
            userMove="F"; player = 2;
            break;
        case 83: //left 83   keycode(77)=S
            userMove="B"; player = 2;
            break;
        default:
          userMove = String.fromCharCode(chCode).toUpperCase();
          break;
      }

      if (player === 0) {
        //alert(document.getElementById("nPlayers"));
        var element = document.getElementById("nPlayers");
        if (element.innerHTML=="1 PLAYER") {
            element.innerHTML="2 PLAYERS";
        } else {
            element.innerHTML="1 PLAYER";
        }
        //change player
      }

      if (player == 1) {
        game.players[0].move(userMove);
      }
      if (player == 2) {
        game.players[1].move(userMove);
      }
  }

  function clickLevelSelector(e){

    selection = e.currentTarget.selectedIndex;
    level.id = selection;
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
    //game.initGame(convert2grid(levels[e.currentTarget.selectedIndex]));
  }
});
