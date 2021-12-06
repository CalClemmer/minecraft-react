import React, { useState } from "react";

const Cell = (props) => {
  console.log(props.value.isMine);
  const { value, onClick, cMenu } = props;
  let className =
    "cell" +
    (value.isRevealed ? "" : " hidden") +
    (value.isMine ? " is-mine" : "") +
    (value.isFlagged ? " is-flag" : "");
  return (
    <div className={className}>
      {props.value.x}
      {props.value.y}
    </div>
  );
};

export default Cell;
