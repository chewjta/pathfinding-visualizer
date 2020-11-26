import React, { useState, useEffect } from "react";
import Node from "../node/Node";
import Astar from "../../Algorithms/astar";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../../Algorithms/dijkstra";
import "./Pathfinder.css";

let NODE_START_ROW = null;
let NODE_START_COL = null;
let NODE_END_ROW = null;
let NODE_END_COL = null;
let diagonals = false;

const Pathfinder = () => {
  const [Grid, setGrid] = useState([]);
  const [mousePressed, setMousePressed] = useState(false);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [cols, setCols] = useState(20);
  const [rows, setRows] = useState(15);
  const [formula, setFormula] = useState("astar");

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
    // if no start node, then set this as the start node.
    // if got start and no end node then set this as end node.
    // if got both then set the rest to walls.
    if (!start && !end) {
      const newGrid = Grid.slice();
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isStart: !node.isStart,
      };
      newGrid[row][col] = newNode;
      NODE_START_COL = col;
      NODE_START_ROW = row;
      setStart(true);
      return newGrid;
    }
    if (start && !end) {
      const newGrid = Grid.slice();
      const node = newGrid[row][col];
      if (node.isStart) {
        document.getElementById(`node-${row}-${col}`).className = "node";
        const newNode = {
          ...node,
          isStart: !node.isStart,
        };
        newGrid[row][col] = newNode;
        NODE_START_COL = null;
        NODE_START_ROW = null;
        setStart(false);
        return newGrid;
      }
      const newNode = {
        ...node,
        isEnd: !node.isEnd,
      };
      newGrid[row][col] = newNode;
      NODE_END_COL = col;
      NODE_END_ROW = row;
      setEnd(true);
      return newGrid;
    }

    if (!start && end) {
      const newGrid = Grid.slice();
      const node = newGrid[row][col];
      if (node.isEnd) {
        document.getElementById(`node-${row}-${col}`).className = "node";
        const newNode = {
          ...node,
          isEnd: !node.isEnd,
        };
        newGrid[row][col] = newNode;
        NODE_END_COL = null;
        NODE_END_ROW = null;
        setEnd(false);
        return newGrid;
      }
      const newNode = {
        ...node,
        isStart: !node.isStart,
      };
      newGrid[row][col] = newNode;
      NODE_START_COL = col;
      NODE_START_ROW = row;
      setStart(true);
      return newGrid;
    }

    if (start && end) {
      const newGrid = Grid.slice();
      const node = newGrid[row][col];
      if (node.isEnd) {
        document.getElementById(`node-${row}-${col}`).className = "node";
        const newNode = {
          ...node,
          isEnd: !node.isEnd,
        };
        newGrid[row][col] = newNode;
        NODE_END_COL = null;
        NODE_END_ROW = null;
        setEnd(false);
        return newGrid;
      }

      if (node.isStart) {
        document.getElementById(`node-${row}-${col}`).className = "node";
        const newNode = {
          ...node,
          isStart: !node.isStart,
        };
        newGrid[row][col] = newNode;
        NODE_START_COL = null;
        NODE_START_ROW = null;
        setStart(false);
        return newGrid;
      }

      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
      return newGrid;
    }
  };

  //creates the spot
  function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.isStart = false;
    this.isEnd = false;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    this.isWall = false;
    // if (Math.random(1) < 0.4) {
    //   this.isWall = true;
    // }
    this.neighbours = [];
    this.previous = null;
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
      if (diagonals == true) {
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
      }
    };
    // for dijkstra
    this.distance = Infinity;
    this.isVisited = false;
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
    if (
      NODE_START_ROW !== null &&
      NODE_START_COL !== null &&
      NODE_END_ROW !== null &&
      NODE_END_COL !== null
    ) {
      addNeighbours(Grid);
      const startNode = Grid[NODE_START_ROW][NODE_START_COL];
      const endNode = Grid[NODE_END_ROW][NODE_END_COL];
      if (formula === "astar") {
        let path = Astar(startNode, endNode, diagonals);
        visualizePath(path.visitedNodes, path.path);
      } else if (formula === "dijkstra") {
        const visitedNodesInOrder = dijkstra(Grid, startNode, endNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
        visualizePath(visitedNodesInOrder, nodesInShortestPathOrder);
      }
    }
  };

  const resetAll = () => {
    setGrid([]);
    setStart(false);
    setEnd(false);
    NODE_START_ROW = null;
    NODE_START_COL = null;
    NODE_END_ROW = null;
    NODE_END_COL = null;
    setTimeout(initializeGrid, 10);
  };

  return (
    <div className="Wrapper">
      <button onClick={visualizeAstar}>Visualize Path</button>
      <button onClick={resetAll}>Reset</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          initializeGrid();
        }}
      >
        Cols: <input type="number" onChange={(e) => setCols(e.target.value)} />
        Rows: <input type="number" onChange={(e) => setRows(e.target.value)} />
        <button type="submit">Set Grid</button>
      </form>
      <div>
        <input
          type="checkbox"
          id="diagonals"
          name="diagonals"
          onChange={(e) => {
            if (e.target.checked) {
              diagonals = true;
            } else if (!e.target.checked) {
              diagonals = false;
            }
          }}
        />
        <label for="diagonals"> Allow diagonals? (only for Astar)</label>
      </div>

      <div>
        <select
          onChange={(e) => {
            setFormula(e.target.value);
          }}
        >
          <option value="astar" selected>
            Astar
          </option>
          <option value="dijkstra">Dijkstra</option>
        </select>
      </div>

      <h1>Pathfinder Component</h1>
      {gridWithNode}
    </div>
  );
};

export default Pathfinder;
