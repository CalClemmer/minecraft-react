import React, { useState } from "react";

const Cell = (props) => {
  const { value, onClick, cMenu } = props;
  let className =
    "cell" +
    (value.isRevealed ? "" : " hidden") +
    (value.isMine ? " is-mine" : "") +
    (value.isFlagged ? " is-flag" : "");
  let display = "O";
  if (props.value.isMine) {
    display = "X";
  } else {
    display = props.value.numNeighbor;
  }

  return (
    <div className={className} onClick={onClick}>
      {display}
    </div>
  );
};

export default Cell;
