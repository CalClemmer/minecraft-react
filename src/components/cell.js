import React, { useState } from "react";

const Cell = (props) => {
  // define states
  const { value, onClick, onContextMenu } = props;
  // let className =
  //   "cell" +
  //   (value.isReveal ? "" : " hidden") +
  //   (value.isMine ? " is-mine" : "") +
  //   (value.isFlagged ? " is-flag" : "");
  let className;
  if (value.isReveal) {
    className = value.isMine ? "is-mine" : "cell" + value.numNeighbor;
  } else {
    className = value.isFlag ? "hidden is-flag" : "hidden";
  }

  return (
    <div
      className={"cell " + className}
      onClick={onClick}
      onContextMenu={onContextMenu}
    ></div>
  );
};

export default Cell;
