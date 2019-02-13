function convert2grid(level) {
  var grid = [];
  for (var i=0; i < level.length ;i++) {
    grid.push(level[i].split(""));
  }
  return grid;
}

var levels = [
  [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W****************************W",
  "W***W*****W***W**W**W***W****W",
  "W***W*****W*W*W**W**W***W****W",
  "W***W******W*W***W**WW**WW***W",
  "W****************************W",
  "W***WW*W*W*WW****W*W**W******W",
  "W**W***W*W*W*W***W*W**W******W",
  "W***W**W*W*wW****W*W**W**WW**W",
  "W****W*W*W*w*W***W*W**W******W",
  "W**WW**WWW*W**W***w***W******W",
  "W****************************W",
  "W********W*******W*W**WWW****W",
  "W*******WWW******W*W**W******W",
  "W*****WWWWWWW****W*W**WW*****W",
  "W*******WWW******W*W**W******W",
  "W********W********W***WWW****W",
  "W**WWWW*****WWWW*************W",
  "W****************************W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
  ],
  [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W****************************W",
  "W*****WWWWW*WWW***WWW*WWW*WWWW",
  "W*****W***W******************W",
  "W**WWWW***W******************W",
  "W***W***W*W*W***W*****W***W**W",
  "W*********W******************W",
  "W***WWW***W*WWW*W*W***W***W**W",
  "W****************************W",
  "W********W*******************W",
  "W***W****W************W***W**W",
  "W***WWW**W**W*****WWW*WWW*WWWW",
  "WW***WWWWW*******************W",
  "W********W****WWW**W**WW**W**W",
  "W********W*********W**W***W**W",
  "WWWWWW**WWW***WWWWWW**W***W**W",
  "W*************************W**W",
  "W***WWWWWWWWWWW*******WWWWW**W",
  "W****************************W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
  ],
  [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W****************************W",
  "W***W***W***W***W**W**WWW*W**W",
  "W*********************W*W****W",
  "WWW*WWW*WWW***WWW*WWW*WWW*WWWW",
  "W*******WWW******************W",
  "W***W***WWWWWWWW******W***W**W",
  "W****************************W",
  "WWW*WWW*WWW*WWW*W*WWW*WWW*WWWW",
  "W****************************W",
  "W****************************W",
  "W***W***W***W***W*****W***W**W",
  "W****************************W",
  "WWW*WWW**WW*WWW***WWW*WWW*WWWW",
  "W***WWW**WW******************W",
  "W***WWW**WW*WWW*W*W***W***W**W",
  "W****************************W",
  "WWW*WWW*WWW*W*WWW*WWW*WWW*WWWW",
  "W****************************W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
  ],
  [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W****************************W",
  "W****************************W",
  "W***W***W***W***W**W**WWW*W**W",
  "W*********************W*W****W",
  "WWW*WWW*WWW***WWW*WWW*WWW*WWWW",
  "W*******WWW******************W",
  "W***W***W***W***W*****W***W**W",
  "W****************************W",
  "WWW*WWW**WW*WWW***WWW*WWW*WWWW",
  "W***WWW**WW******************W",
  "W***WWW**WW*******W***W***W**W",
  "W****************************W",
  "WWW*WWW*WWW*W*WWW*WWW*WWW*WWWW",
  "W****************************W",
  "W***W***WWWWWWWW******W***W**W",
  "W****************************W",
  "WWW*WWW*WWW*WWW*W*WWW*WWW*WWWW",
  "W****************************W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
  ],
  [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W****************************W",
  "W****************************W",
  "W***W***W***W***W*****W***W**W",
  "W****************************W",
  "WWW*WWW*WWW*W*WWW*WWW*WWW*WWWW",
  "W****************************W",
  "W****************************W",
  "WWW*WWW**WW*WWW***WWW*WWW*WWWW",
  "W***WWW**WW******************W",
  "W***WWW**WW*******W***W***W**W",
  "W***W***W**********W**WWW*W**W",
  "W*********************W*W****W",
  "WWW*WWW*WWW***WWW*WWW*WWW*WWWW",
  "W*******WWW******************W",
  "W***W***WWWWWWWW******W***W**W",
  "W****************************W",
  "WWW*WWW*WWW*WWW*W*WWW*WWW*WWWW",
  "W****************************W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
  ]
];
