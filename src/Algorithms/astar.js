function Astar(startNode, endNode, diagonals) {
  let openSet = []; // nodes to be visited
  let closedSet = []; // nodes already visited
  let path = []; // shortest path
  let visitedNodes = [];

  openSet.push(startNode);
  while (openSet.length > 0) {
    let leastIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[leastIndex].f) {
        leastIndex = i; // gives us the index of the spot with the lowest f value
      }
    }

    let current = openSet[leastIndex];
    visitedNodes.push(current);
    if (current === endNode) {
      let temp = current;
      path.push(temp); //push this current value into the path array. then where neighbour.previous = current, i.e. tracks the path of the node
      while (temp.previous) {
        // backtracking the path taken.
        path.push(temp.previous);
        temp = temp.previous;
      }
      return { path, visitedNodes };
    }

    //move current from openset to closed set. we found the shortest path for this current node.
    openSet = openSet.filter((el) => el !== current);
    closedSet.push(current);

    let neighbours = current.neighbours; // neighbours in N,S,E,W direction
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i]; // visit each neighbour
      if (!closedSet.includes(neighbour) && !neighbour.isWall) {
        //if it includes neighbour, means its visited already, so no need visit
        let tempG = current.g + 1;
        let newPath = false; // a temp g value which we plus 1 since we are moving forward
        if (openSet.includes(neighbour)) {
          if (tempG < neighbour.g) {
            neighbour.g = tempG;
            newPath = true; //update neighbour.g with the lowest g value. because now there is a shorter path to here.
          }
        } else {
          // otherwise just add the neighbour into the open set to find the shortest path
          neighbour.g = tempG;
          newPath = true;
          openSet.push(neighbour);
        }
        if (newPath) {
          neighbour.h = heuristic(neighbour, endNode, diagonals);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }
      }
    }
  }

  return { path, visitedNodes, error: "no path found!" };
}

function heuristic(a, b, diagonals) {
  if (diagonals === true) {
    let d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); //Euclidean heuristic
    return d;
  } else {
    let d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y); //Manhattan heuristic
    return d;
  }
}

export default Astar;
