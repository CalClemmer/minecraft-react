import React, { useState } from "react";

const Cell = (props) => {
  console.log(props.value.isMine);
  return (
    <div>
      {props.value.x}
      {props.value.y}
    </div>
  );
};

export default Cell;
