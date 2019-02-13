
/*global console, process, require */
var GameModule = require('./Game.js');
var ZombieModule = require('./Zombie.js');
var BoardModule = require('./Board.js');
var PathModule = require('./Pathfinder.js');
var PlayerModule = require('./Player.js');

var Server = function () {
    'use strict';
    var self = this;
    this.serverPort = parseInt(process.env.PORT) || 5000;
    this.server = null;
    this.io = null;
    this.nSight = 0;
    this.gameEnd = 0;
    this.canvasWidth = 300;
    this.canvasHeight = 200;
    this.totalPlayers = 0;
    this.players = [];
    this.stack = [];
    this.target = null;
    this.nPlayers = 1;
    this.level = {};
    this.game = null;

        // var TEST = require('./test.js');
        // var s = new TEST.test();
        // s.hola();

        //var Zombie = new ZombieModule(1,1);

    // function Circle(x, y, radius) {
    //     this.x = (x === undefined) ? 0 : x;
    //     this.y = (y === undefined) ? 0 : y;
    //     this.radius = (radius === undefined) ? 0 : radius;
    // }
    //
    // Circle.prototype = {
    //     constructor: Circle,
    //
    //     distance: function (circle) {
    //         if (circle !== undefined) {
    //             var dx = this.x - circle.x,
    //                 dy = this.y - circle.y;
    //             return (Math.sqrt(dx * dx + dy * dy) - (this.radius + circle.radius));
    //         }
    //     }
    // };
    //
    // function random(max) {
    //     return ~~(Math.random() * max);
    // }

    // function act(player) {
    //     var now = Date.now();
    //     if (gameEnd - now < -1000) {
    //         gameEnd = now + 10000;
    //         io.sockets.emit('gameEnd', {time: gameEnd});
    //         target.x = random(canvasWidth / 10 - 1) * 10 + target.radius;
    //         target.y = random(canvasHeight / 10 - 1) * 10 + target.radius;
    //         io.sockets.emit('target', {x: target.x, y: target.y});
    //     } else if (gameEnd - now > 0) {
    //         if (players[player].distance(target) < 0) {
    //             io.sockets.emit('score', {id: player, score: 1});
    //             target.x = random(canvasWidth / 10 - 1) * 10 + target.radius;
    //             target.y = random(canvasHeight / 10 - 1) * 10 + target.radius;
    //             io.sockets.emit('target', {x: target.x, y: target.y});
    //         }
    //     }
    // }


    // target = new Circle(100, 100, 10);


    this.server = require('http').createServer(this.MyServer);

    console.log(this.serverPort);

    this.server.listen(this.serverPort, '127.0.0.1', function () {
        console.log('Server is listening on port ' + self.serverPort);
    });

    this.io = require('socket.io').listen(this.server);
    this.io.sockets.on('connection', function(socket){
      self.setSocket(socket);
    });

    function convert2grid(level) {
      var grid = [];
      for (var i=0; i < level.length ;i++) {
        grid.push(level[i].split(""));
      }
      return grid;
    }
};

Server.prototype.setSocket = function(socket){
  var self = this;

  var stack = self.stack;
  if (stack.length) {
      socket.playerId = stack.pop();
  } else {
      socket.playerId = self.nSight;
      self.nSight += 1;
  }
  self.totalPlayers += 1;
  //self.players[socket.playerId] = new Circle(0, 0, 5);
  socket.emit('me', {id: socket.playerId});
  self.io.sockets.emit('sight', {id: socket.playerId, x: 0, y: 0});
  console.log(socket.id  + ' connected as player' + socket.playerId);

  socket.on('mySight', function (sight) {
      self.players[socket.playerId].x = sight.x;
      self.players[socket.playerId].y = sight.y;
      if (sight.lastPress === 1) {
          self.act(socket.playerId);
      }
      //socket.broadcast.volatile.emit('sight', {id: socket.playerId, x: sight.x, y: sight.y, lastPress: sight.lastPress});
      self.io.sockets.emit('sight', {id: socket.playerId, x: sight.x, y: sight.y, lastPress: sight.lastPress});
  });

  socket.on('clickStart', function(options){
    console.log('START EN EL SERVER');
    self.clickStartHandler(options);
  });
  socket.on('keypress', function (sight) {
    console.log('SERVER tecla', sight);
    self.keyPressHandler(sight);
  });

  socket.on('disconnect', function () {
      self.io.sockets.emit('sight', {id: socket.playerId, x: null, y: null});
      console.log('Player' + socket.playerId + ' disconnected.');
      self.totalPlayers -= 1;
      if (self.totalPlayers < 1) {
          stack.length = 0;
          self.nSight = 0;
          console.log('Sights were reset to zero.');
      } else {
          stack.push(socket.playerId);
      }
  });

  socket.on('changeSelection', function (options) {
      console.log('SERVE chageLevel', options);
      level = options;
  });
};

Server.prototype.emitEvent = function(event, options) {
  var self = this;

  self.io.sockets.emit(event, options);
};


Server.prototype.clickStartHandler = function(options){
  var self = this;
  self.level = options.level;
  console.log('options', options);
  //Crear tablero
  if (options.type == 'start') {
    self.game = new GameModule(new BoardModule(20,30,32), self);
    self.game.initGame(self.level);
  } else {
    self.game.stopGame("STOP");
  }
  self.io.sockets.emit('clickStart', options);
};

Server.prototype.keyPressHandler = function(options){
  var self = this;
  var userMove;
  var player;
  console.log('options', options);
  self.io.sockets.emit('keypress', options);
  switch (options.keyCode) {
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
    case 49: // 1
      self.nPlayers = 1;
      break;
    case 50: // 2
      self.nPlayers = 2;
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
      userMove = String.fromCharCode(options.charCode).toUpperCase();
      break;
  }

  if (player == 1) {
    self.game.players[0].move(userMove);
  }
  if (player == 2) {
    self.game.players[1].move(userMove);
  }
};


Server.prototype.MyServer = function (request, response) {
  var fs = require('fs');
  var contentTypes = {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "application/javascript",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".ico": "image/x-icon",
          ".m4a": "audio/mp4",
          ".oga": "audio/ogg"
      };

    // response.writeHead(200, {'Content-Type': 'text/html'});
    // response.end('<h1>It\'s working!</h1>');
    var filePath = '.' + request.url,
    extname = '',
    contentType = '';
   if (filePath === './') {
       filePath = './index.html';
   }

   extname = filePath.substr(filePath.lastIndexOf('.'));
   contentType = contentTypes[extname];
   if (!contentType) {
       contentType = 'application/octet-stream';
   }
   console.log((new Date()) + ' Serving ' + filePath + ' as ' + contentType);

   fs.exists(filePath, function (exists) {
       if (exists) {
           fs.readFile(filePath, function (error, content) {
               if (error) {
                   response.writeHead(500, { 'Content-Type': 'text/html' });
                   response.end('<h1>500 Internal Server Error</h1>');
               } else {
                   response.writeHead(200, { 'Content-Type': contentType });
                   response.end(content, 'utf-8');
               }
           });
       } else {
           response.writeHead(404, { 'Content-Type': 'text/html' });
           response.end('<h1>404 Not Found</h1>');
       }
   });
}
new Server();
