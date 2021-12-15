import { render } from "@testing-library/react";
import React, { useState } from "react";

import Cell from "./cell";

const Board = (props) => {
  // these are ultimate arbiters of truth for variables
  // okay these are basically never updating uh
  // I need to learn more about state and come back
  let height = 5;
  let width = 10;
  let mines = 45;
  let lost = false;
  let won = false;
  let firstGuess = true;
  let boardData = initBoard(width, height, mines);

  // define states
  // let [boardData, setBoardData] = useState(initBoard(width, height, mines));
  let [board, setBoard] = useState(renderBoard(boardData));

  // function to generate board array
  function initBoard(width, height, mineNum) {
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

  function sortNeighbors(neighbors) {
    let revealed = [];
    let hidden = [];
    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i].isReveal) {
        revealed.push(neighbors[i]);
      } else hidden.push(neighbors[i]);
    }
    return { revealed: revealed, hidden: hidden };
    //tbh I think the splice already modifies things but unsure
    // lol it was already modifying things which is no bueno
  }

  function lookupNeighbors(board, cell) {
    let ans = [];
    let y = cell.y;
    let x = cell.x;
    let height = board.length - 1;
    let width = board[0].length - 1;
    if (y >= 1) {
      ans.push(board[y - 1][x]);
      if (x < width) {
        ans.push(board[y - 1][x + 1]);
      }
      if (x >= 1) {
        ans.push(board[y - 1][x - 1]);
      }
    }
    if (y < height) {
      ans.push(board[y + 1][x]);
      if (x < width) {
        ans.push(board[y + 1][x + 1]);
      }
      if (x >= 1) {
        ans.push(board[y + 1][x - 1]);
      }
    }
    if (x < width) {
      ans.push(board[y][x + 1]);
    }
    if (x >= 1) {
      ans.push(board[y][x - 1]);
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
          x: j,
          y: i,
          isMine: false,
          isReveal: false,
          isFlag: false,
          numNeighbor: 0,
        });
      }
    }
    return board;
  }

  // function to solve board
  function solve() {
    let data = boardData;
    console.log("data", data);
    // dirty inefficient solution first, optimize later
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        let flagNum = 0;
        let cell = data[i][j];
        // situation 1: a cell already has all mines next to it flagged
        // in which case, cell is safe and should be revealed

        // situation 2: all adjacent cells must be mines,
        // in which case flag
        // I need to check if flags + unrevealed = numNeighbor

        let neighbors = lookupNeighbors(data, cell);
        const { revealed, hidden } = sortNeighbors(neighbors);
        // let revealedNeighbors = removeHiddenNeighbors(neighbors);
        // hiddenNum = neighbors.length - revealedNeighbors.length;
        for (let k = 0; k < hidden.length; k++) {
          if (hidden[k].isFlag) {
            flagNum++;
          }
        }
        // I don't love this solution because
        // The algorithm is still accessing information it
        // shouldn't really have... but then again it's
        // not doing anything with it
        // Should I eventually write an algorithm to give this algorithm only information
        // that it should actually have? I dunno
        if (cell.numNeighbor > 0 && flagNum === cell.numNeighbor) {
          // right now I'm relying on flags to protect
          // from setting off mines
          neighbors.forEach(revealCell);
        }
        //not seeing any hidden lengths of 1 after reset, even when there should be
        if (hidden.length === cell.numNeighbor) {
          for (let l = 0; l < hidden.length; l++) {
            hidden[l].isFlag = true;
          }
        }

        // if (flagNum + hiddenNum === cell.numNeighbor && cell.isReveal) {
        //   neighbors.forEach(flagCell);
        // }
      }
    }
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
    //this code ensures that the first click will never be on a mine
    if (firstGuess && cell.isMine) {
      moveMine(cell);
      revealCell(cell);
      return;
    }

    firstGuess = false;

    if (!cell.isReveal && !cell.isFlag && !lost && !won) {
      cell.isReveal = true;

      if (cell.isMine) {
        // I'm clearly not understanding something about how state works
        // since setLost on it's own isn't working. Hm.
        lost = true;
        revealMines(boardData);
      }

      // recursively reveal all 0 neighbors
      if (cell.numNeighbor === 0) {
        let neighbors = lookupNeighbors(boardData, cell);
        neighbors.forEach(revealCell);
      }
      if (checkWon(boardData)) {
        // why don't i understand states yet
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
    // turns out state is asynchronous and probably doesn't need to be used here
    lost = false;

    // this is also doing nothing. great.
    // firstGuess = true;

    // setBoardData(initBoard(width, height, mines));
    console.log("old data", boardData);
    //... how the heck is this line doing nothing
    // why the heck does this function still work O_O
    // boardData = initBoard(width, height, mines);
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
        <button onClick={() => solve()}>Solve</button>
      </div>
    </div>
  );
};

export default Board;
