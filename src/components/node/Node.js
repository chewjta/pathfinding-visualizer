import React from "react";
import "./Node.css";

const Node = ({
  isStart,
  isEnd,
  row,
  col,
  isWall,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
}) => {
  const classes = isStart
    ? "node-start"
    : isWall
    ? "isWall"
    : isEnd
    ? "node-end"
    : "";
  return (
    <div
      className={`node ${classes}`}
      id={`node-${row}-${col}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Node;
