/*global console, process, require */
(function () {

    'use strict';
    var serverPort = process.env.PORT || 5000,
        server = null,
        io = null,
        nSight = 0,
        gameEnd = 0,
        canvasWidth = 300,
        canvasHeight = 200,
        totalPlayers = 0,
        players = [],
        stack = [],
        target = null,
        fs = require('fs'),

        contentTypes = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "application/javascript",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".ico": "image/x-icon",
            ".m4a": "audio/mp4",
            ".oga": "audio/ogg"
        };

    function Circle(x, y, radius) {
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
        this.radius = (radius === undefined) ? 0 : radius;
    }

    Circle.prototype = {
        constructor: Circle,

        distance: function (circle) {
            if (circle !== undefined) {
                var dx = this.x - circle.x,
                    dy = this.y - circle.y;
                return (Math.sqrt(dx * dx + dy * dy) - (this.radius + circle.radius));
            }
        }
    };

    function random(max) {
        return ~~(Math.random() * max);
    }

    function act(player) {
        var now = Date.now();
        if (gameEnd - now < -1000) {
            gameEnd = now + 10000;
            io.sockets.emit('gameEnd', {time: gameEnd});
            target.x = random(canvasWidth / 10 - 1) * 10 + target.radius;
            target.y = random(canvasHeight / 10 - 1) * 10 + target.radius;
            io.sockets.emit('target', {x: target.x, y: target.y});
        } else if (gameEnd - now > 0) {
            if (players[player].distance(target) < 0) {
                io.sockets.emit('score', {id: player, score: 1});
                target.x = random(canvasWidth / 10 - 1) * 10 + target.radius;
                target.y = random(canvasHeight / 10 - 1) * 10 + target.radius;
                io.sockets.emit('target', {x: target.x, y: target.y});
            }
        }
    }

    function MyServer(request, response) {
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

    target = new Circle(100, 100, 10);

    server = require('http').createServer(MyServer);
    server.listen(parseInt(serverPort, 10), function () {
        console.log('Server is listening on port ' + serverPort);
    });

    io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
        if (stack.length) {
            socket.playerId = stack.pop();
        } else {
            socket.playerId = nSight;
            nSight += 1;
        }
        totalPlayers += 1;
        players[socket.playerId] = new Circle(0, 0, 5);
        socket.emit('me', {id: socket.playerId});
        io.sockets.emit('sight', {id: socket.playerId, x: 0, y: 0});
        console.log(socket.id  + ' connected as player' + socket.playerId);

        socket.on('mySight', function (sight) {
            players[socket.playerId].x = sight.x;
            players[socket.playerId].y = sight.y;
            if (sight.lastPress === 1) {
                act(socket.playerId);
            }
            //socket.broadcast.volatile.emit('sight', {id: socket.playerId, x: sight.x, y: sight.y, lastPress: sight.lastPress});
            io.sockets.emit('sight', {id: socket.playerId, x: sight.x, y: sight.y, lastPress: sight.lastPress});
        });

        socket.on('clickStart', function(){
          console.log('START EN EL SERVER');
          io.sockets.emit('clickStart', {});
        });
        socket.on('keypress', function (sight) {
          console.log('SERVER tecla', sight);
          io.sockets.emit('keypress', sight);
        });

        socket.on('disconnect', function () {
            io.sockets.emit('sight', {id: socket.playerId, x: null, y: null});
            console.log('Player' + socket.playerId + ' disconnected.');
            totalPlayers -= 1;
            if (totalPlayers < 1) {
                stack.length = 0;
                nSight = 0;
                console.log('Sights were reset to zero.');
            } else {
                stack.push(socket.playerId);
            }
        });
    });
}());
