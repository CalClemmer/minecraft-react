import { render } from "@testing-library/react";
import React, { useState } from "react";
import Cell from "./cell";

const Board = (props) => {
  // define states
  let [boardData, setBoardData] = useState(initBoard(5, 6, 10));

  // function to generate board array
  function initBoard(width, height, mineNum) {
    // console.log("width", width, "height", height, "mine", mine);
    let board = emptyBoard(width, height);
    // mineBoard(board, mineNum);
    return board;
  }

  //   setBoardData(initBoard(5, 6, 10));

  // function to create an empty board array
  function emptyBoard(width, height) {
    let ans = [];
    for (let i = 0; i < height; i++) {
      ans.push([]);
      for (let j = 0; j < width; j++) {
        ans[i].push({
          x: i,
          y: j,
          isMine: false,
          isReveal: false,
          numNeighbor: 0,
        });
      }
    }
    return ans;
  }
  // function to randomly place mines in board
  function mineBoard(board, mineNum) {
    let height = board.length;
    let width = board[0].length;
    let len = height * width;
    let numArr = [...Array(len).keys()];
    //shuffle numArr outputs something like [5, 3, 1, 2, 4, 0]
    shuffle(numArr);
    //FIX: Properly getting this to mine
    for (let i = 0; i < mineNum; i++) {
      // place n mines, using the order supplied by numArr
      board[numArr[i]]["isMine"] = true;
    }
  }

  // function to efficiently and randomly shuffle an array
  function shuffle(array) {
    var i = array.length,
      j = 0,
      temp;

    while (i--) {
      j = Math.floor(Math.random() * (i + 1));

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  function renderBoard(data) {
    console.log("data", data);
    return data.map((datarow) => {
      return datarow.map((dataitem) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <Cell
              onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
              cMenu={(e) => this.handleContextMenu(e, dataitem.x, dataitem.y)}
              value={dataitem}
            />
            {/* // This line of code adds a clearfix div after the last cell of each row. */}
            {datarow[datarow.length - 1] === dataitem ? (
              <div className="clear" />
            ) : (
              ""
            )}
          </div>
        );
      });
    });
  }

  //   renderBoard(boardData);
  //   initBoard(props.width, props.height, props.mine);
  return <div>{renderBoard(boardData)}</div>;
};

export default Board;
