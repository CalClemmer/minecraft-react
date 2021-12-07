import React, { useState } from "react";

const Cell = (props) => {
  // define states
  const { value, onClick } = props;
  // let className =
  //   "cell" +
  //   (value.isReveal ? "" : " hidden") +
  //   (value.isMine ? " is-mine" : "") +
  //   (value.isFlagged ? " is-flag" : "");
  let className;
  if (value.isReveal) {
    className = value.isMine ? "cell is-mine" : "cell" + value.numNeighbor;
  } else {
    className = "cell hidden";
  }
  let display = "O";
  if (props.value.isMine) {
    display = "X";
  } else {
    display = props.value.numNeighbor;
  }

  return (
    <div className={className} onClick={onClick}>
      {/* {display} */}
    </div>
  );
};

export default Cell;
