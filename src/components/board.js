import { render } from "@testing-library/react";
import React, { useState } from "react";

import Cell from "./cell";

const Board = (props) => {
  let height = 5;
  let width = 5;
  let mines = 18;

  // define states
  let [boardData, setBoardData] = useState(initBoard(height, width, mines));
  let [board, setBoard] = useState(renderBoard(boardData));
  let [lost, setLost] = useState(false);
  let [won, setWon] = useState(false);
  let [firstGuess, setFirstGuess] = useState(true);

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
          isFlag: false,
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

  function revealMines(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        let cell = board[i][j];
        if (cell.isMine) {
          cell.isReveal = true;
        }
      }
    }
  }

  function moveMine(cell) {
    for (let i = 0; i < boardData.length; i++) {
      for (let j = 0; j < boardData[0].length; j++) {
        let _cell = boardData[i][j];
        if (!_cell.isMine) {
          _cell.isMine = true;
          cell.isMine = false;
          getNeighbors(boardData);
          // setBoard(renderBoard(boardData));
          return;
        }
      }
    }
  }
  function revealCell(cell) {
    if (firstGuess && cell.isMine) {
      moveMine(cell);
      revealCell(cell);
      return;
    }

    setFirstGuess(false);
    firstGuess = false;

    if (!cell.isReveal && !cell.isFlag && !lost && !won) {
      cell.isReveal = true;

      if (cell.isMine) {
        // I'm clearly not understanding something about how state works
        // since setLost on it's own isn't working. Hm.
        lost = true;
        setLost(true);
        revealMines(boardData);
      }

      // recursively reveal all 0 neighbors
      if (cell.numNeighbor === 0) {
        let neighbors = lookupNeighbors(boardData, cell);
        neighbors.forEach(revealCell);
      }
      if (checkWon(boardData)) {
        // why don't i understand states yet
        setWon(true);
        won = true;
        revealMines(boardData);
        console.log("You win");
      }
      setBoard(renderBoard(boardData));
    }
  }

  function checkWon(board) {
    // probably a more efficient way to do this
    // than a nested for loop
    // but almost certainly good enough for my immediate needs
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        let cell = board[i][j];
        //check all cells, if all cells revealed except mines you win
        if (!cell.isReveal && !cell.isMine) {
          return false;
        }
      }
    }
    return true;
  }

  function reset() {
    // again, I'm not understanding something about state here
    setLost(false);
    lost = false;
    setWon(false);
    setFirstGuess(true);
    firstGuess = true;
    setBoardData(initBoard(width, height, mines));
    setBoard(renderBoard(boardData));
  }

  function flagCell(cell) {
    if (!won && !lost) {
      cell.isFlag = !cell.isFlag;
      setBoard(renderBoard(boardData));
    }
  }

  function prevent(e) {
    e.preventDefault();
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
              onContextMenu={(e) => {
                flagCell(data[i][j]);
                prevent(e);
              }}
            />
          </td>
        );
      }
      table.push(<tr key={"row" + i}>{row}</tr>);
    }
    return table;
  }

  return (
    <div>
      <div>Mines: {mines}</div>{" "}
      <table id="board">
        <tbody>{board}</tbody>
      </table>
      <div>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </div>
  );
};

export default Board;
