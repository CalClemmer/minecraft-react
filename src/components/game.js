import React, { useState } from "react";
import Board from "./board";

const Game = (props) => {
  return (
    <div>
      <Board height={10} width={10} mine={5} />
    </div>
  );
};

export default Game;
