import { render } from "@testing-library/react";
import React, { useState } from "react";

import Cell from "./cell";

const Board = (props) => {
  // define states
  let [boardData, setBoardData] = useState(initBoard(5, 5, 5));
  let [board, setBoard] = useState(renderBoard(boardData));

  // function to generate board array
  function initBoard(width, height, mineNum) {
    // console.log("width", width, "height", height, "mine", mine);
    let board = emptyBoard(width, height);
    mineBoard(board, mineNum);
    getNeighbors(board);
    return board;
  }

  function getNeighbors(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        let cell = board[i][j];
        let num = 0;
        let neighbors = lookupNeighbors(board, cell);
        for (let k = 0; k < neighbors.length; k++) {
          if (neighbors[k].isMine) {
            num++;
          }
        }
        cell.numNeighbor = num;
      }
    }
  }

  function lookupNeighbors(board, cell) {
    let ans = [];
    let x = cell.x;
    let y = cell.y;
    let width = board[0].length - 1;
    let height = board.length - 1;
    if (y >= 1) {
      ans.push(board[x][y - 1]);
      if (x < width) {
        ans.push(board[x + 1][y - 1]);
      }
      if (x >= 1) {
        ans.push(board[x - 1][y - 1]);
      }
    }
    if (y < height) {
      ans.push(board[x][y + 1]);
      if (x < width) {
        ans.push(board[x + 1][y + 1]);
      }
      if (x >= 1) {
        ans.push(board[x - 1][y + 1]);
      }
    }
    if (x < width) {
      ans.push(board[x + 1][y]);
    }
    if (x >= 1) {
      ans.push(board[x - 1][y]);
    }
    return ans;
  }

  // function to create an empty board array
  function emptyBoard(width, height) {
    let board = [];
    for (let i = 0; i < height; i++) {
      board.push([]);
      for (let j = 0; j < width; j++) {
        board[i].push({
          x: i,
          y: j,
          isMine: false,
          isReveal: false,
          numNeighbor: 0,
        });
      }
    }
    return board;
  }

  // function to randomly place mines in board
  function mineBoard(board, mineNum) {
    let height = board.length;
    let width = board[0].length;
    let len = height * width;
    let numArr = [...Array(len).keys()];
    //shuffle numArr outputs something like [5, 3, 1, 2, 4, 0]
    shuffle(numArr);

    //failsafe if there are more mines than squares
    if (mineNum > len) {
      mineNum = len - 1;
    }

    for (let i = 0; i < mineNum; i++) {
      // division for row, remainder for column...?
      let row = Math.floor(numArr[i] / width);
      let column = numArr[i] % width;
      // place n mines, using the order supplied by numArr
      board[row][column]["isMine"] = true;
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

  function revealCell(cell) {
    cell.isReveal = true;
    setBoard(renderBoard(boardData));
  }

  // renders board
  function renderBoard(data) {
    let table = [];
    for (let i = 0; i < data.length; i++) {
      let row = [];
      for (let j = 0; j < data[i].length; j++) {
        let cellID = "cell" + i + j;
        row.push(
          <td>
            <Cell
              key={cellID}
              value={data[i][j]}
              onClick={() => revealCell(data[i][j])}
            />
          </td>
        );
      }
      table.push(<tr key={"row" + i}>{row}</tr>);
    }
    return table;
  }

  //   renderBoard(boardData);
  //   initBoard(props.width, props.height, props.mine);
  return (
    <div>
      {" "}
      <table id="board">
        <tbody>{board}</tbody>
      </table>
    </div>
  );
};

export default Board;
