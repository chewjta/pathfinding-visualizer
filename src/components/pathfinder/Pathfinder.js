import React, { useState, useEffect } from "react";
import Node from "../node/Node";
import Astar from "../../astarAlgorithm/astar";
import "./Pathfinder.css";

const cols = 15;
const rows = 15;

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows - 1;
const NODE_END_COL = cols - 1;

const Pathfinder = () => {
  const [Grid, setGrid] = useState([]);
  const [mousePressed, setMousePressed] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  //creates the grid
  const initializeGrid = () => {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols);
    }
    createSpot(grid);
    setGrid(grid);
  };

  //creates the spot
  const createSpot = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  };

  //add neighbour nodes
  const addNeighbours = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addNeighbours(grid);
      }
    }
  };

  // mouseclick functions
  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(Grid, row, col);
    setGrid(newGrid);
    setMousePressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mousePressed) return;
    const newGrid = getNewGridWithWallToggled(Grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMousePressed(false);
  };

  const getNewGridWithWallToggled = (Grid, row, col) => {
    const newGrid = Grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  //creates the spot
  function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
    this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    this.isWall = false;
    // if (Math.random(1) < 0.4) {
    //   this.isWall = true;
    // }
    this.neighbours = [];
    this.previous = undefined;
    //function to add surrounding neighbour nodes
    this.addNeighbours = function (grid) {
      let i = this.x;
      let j = this.y;
      if (i > 0) {
        this.neighbours.push(grid[i - 1][j]); // NORTH
      }
      if (i < rows - 1) {
        this.neighbours.push(grid[i + 1][j]); // SOUTH
      }
      if (j > 0) {
        this.neighbours.push(grid[i][j - 1]); // WEST
      }
      if (j < cols - 1) {
        this.neighbours.push(grid[i][j + 1]); // EAST
      }

      //DIAGONALS

      if (i > 0 && j > 0) {
        this.neighbours.push(grid[i - 1][j - 1]);
      }
      if (i < rows - 1 && j > 0) {
        this.neighbours.push(grid[i + 1][j - 1]);
      }
      if (i > 0 && j < cols - 1) {
        this.neighbours.push(grid[i - 1][j + 1]);
      }
      if (i < rows - 1 && j < cols - 1) {
        this.neighbours.push(grid[i + 1][j + 1]);
      }
    };
  }

  //grid with node

  const gridWithNode = (
    <div>
      {Grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="rowWrapper">
            {row.map((col, colIndex) => {
              const { isStart, isEnd, isWall, x, y } = col;
              return (
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  isWall={isWall}
                  row={x}
                  col={y}
                  mousePressed={mousePressed}
                  onMouseDown={(x, y) => handleMouseDown(x, y)}
                  onMouseEnter={(x, y) => handleMouseEnter(x, y)}
                  onMouseUp={() => handleMouseUp()}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const visualizeShortestPath = (shortestPathNodes) => {
    for (let i = 0; i < shortestPathNodes.length; i++) {
      setTimeout(() => {
        const node = shortestPathNodes[i];
        document.getElementById(`node-${node.x}-${node.y}`).className =
          "node node-shortest-path";
      }, 10 * i); // this controls the framerate/delay
    }
  };

  const visualizePath = (visitedNodes, path) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          visualizeShortestPath(path);
        }, 20 * i); // this controls the framerate/delay
      } else {
        setTimeout(() => {
          const node = visitedNodes[i];
          document.getElementById(`node-${node.x}-${node.y}`).className =
            "node node-visited";
        }, 20 * i);
      }
    }
  };

  const visualizeAstar = () => {
    addNeighbours(Grid);
    const startNode = Grid[NODE_START_ROW][NODE_START_COL];
    const endNode = Grid[NODE_END_ROW][NODE_END_COL];
    let path = Astar(startNode, endNode);
    visualizePath(path.visitedNodes, path.path);
  };

  return (
    <div className="Wrapper">
      <button onClick={visualizeAstar}>Visualize Path</button>
      <h1>Pathfinder Component</h1>
      {gridWithNode}
    </div>
  );
};

export default Pathfinder;
