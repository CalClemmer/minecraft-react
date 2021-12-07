import React, { useState } from "react";

const Cell = (props) => {
  // define states
  const { value, onClick } = props;
  let className =
    "cell" +
    (value.isReveal ? "" : " hidden") +
    (value.isMine ? " is-mine" : "") +
    (value.isFlagged ? " is-flag" : "");
  let display = "O";
  if (props.value.isMine) {
    display = "X";
  } else {
    display = props.value.numNeighbor;
  }

  if (props.value.isReveal) {
    console.log("Hiiii");
    className = className + " test";
  }

  return (
    <div className={className} onClick={onClick}>
      {display}
    </div>
  );
};

export default Cell;
