var Path = function(startArray, endArray, board){

  this.result = [];
  this.times = 0;

  var grid = [];
  for (var y = 0; y < board.rows; y++ ) {
    grid[y] = [];
    for (var x = 0; x < board.cols; x++ ) {
      if (board.map[y][x] == "*" || (board.map[y][x] == "0") || board.map[y][x] == "1") {
        grid[y][x] = 1;
      } else {
        grid[y][x] = 0;
      }
    }
  }
  
  var graph = new Graph(grid, false),
  start = graph.grid[startArray[0]][startArray[1]],
  end = graph.grid[endArray[0]][endArray[1]],
  results = [],
  times = 0;

  var nodes = astar.search(graph, start, end);
  nodes.forEach(function(gridNode) {
    results.push([gridNode.x, gridNode.y]);
  });
  return results;
};
