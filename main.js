const mINF = -9999999; // minus infinity
const INF = 9999999; // infinity
var MODE = "Easy"; //game mode; default is easy
var currentPlayer = "X"; //player; always X except in two players can pe O
const winCombos = [
  //combinations of cells that end the game (row, column, and diagonal)
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

// **************************************
const options = () => {
  //display the options menu
  document.getElementById("options").style.display = "flex";
  document.getElementById("aura").style.display = "block"; //the black oura behind the menu
};
const closeOptions = () => {
  //close the options menu
  document.getElementById("options").style.display = "none";
  document.getElementById("aura").style.display = "none"; //the black oura behind the menu
};
const changeMode = (e) => {
  //change the mode of the game; (button handler)
  //when a button is clicked, change the mode to the name attribute of the button
  let name = e.target.name;
  MODE = name;
  document.getElementById("mode").innerText = name;
  closeOptions();
  console.log(MODE);
  startGame();
};

// **************************************
const getBoardStatus = () => {
  // make the board array
  // for each cell if its empty => 'e', else the value in the cell

  let board = [];
  for (let i = 0; i < 9; i++) {
    if (document.getElementById(`c${i}`).innerText === "") board[i] = "e";
    else if (document.getElementById(`c${i}`).innerText === "X") board[i] = "x";
    else board[i] = "o";
  }
  return board;
};

const checkGame = (board) => {
  //check the game if ended or not;
  //for loop on every possible combination, end the game if someone wins, or if a tie happened,
  for (let i = 0; i < 8; i++) {
    const comb = winCombos[i];
    //check if X wins
    if (
      board[comb[0]] === "x" &&
      board[comb[1]] === "x" &&
      board[comb[2]] === "x"
    ) {
      console.log("x wins");
      if (MODE === "2Players") {
        endGame(false, "player X wins ", "green", comb);
      } else endGame(false, "YOU WON !! :) ", "green", comb);

      return "x wins";
    }
    //check if O wins
    if (
      board[comb[0]] === "o" &&
      board[comb[1]] === "o" &&
      board[comb[2]] === "o"
    ) {
      console.log("o wins");
      if (MODE === "2Players") {
        endGame(false, "player O wins", "blue", comb);
      } else endGame(false, "YOU LOST :(", "red", comb);

      return "o wins";
    }
  }
  //check if tie
  let finished = true;
  for (let i = 0; i < 9; i++) {
    //if there is one empty cell, then the game is not finished yet
    if (board[i] === "e") finished = false;
  }
  if (finished) {
    console.log("tie");
    endGame(true, "TIE !!");
    return "tie";
  }
  //else = the game not finished yet
  else {
    console.log("continuing");
    return "not finished";
  }
};

const startGame = () => {
  //reset the game; start new game
  document.getElementById("popup").style.display = "none"; //hide the score popup if shown
  for (let i = 0; i < 9; i++) {
    //loop every cell on the board
    const cell = document.getElementById(`c${i}`);
    // const id = cell.id;
    cell.style.backgroundColor = "white"; //color back the cell if changed
    cell.innerHTML = ""; //clear the cell if there is text inside (X or O)
    cell.addEventListener("click", playerMove); //add the click listner back,(removed when game finished)
    document.getElementById("score").style.color = "white"; // color the score popup back to default white,(tie->white, win->green,lose->red)
    currentPlayer = "X"; //reset the current player to X, if changed in two players mode; (X always start)
    document.getElementById("turn").innerText = currentPlayer; //update the turn element on the interface
  }
};

const endGame = (tie, message, color, comb) => {
  //end the game and display the result
  //tie flag if the game ended in a tie
  //else display the wining message and color the cells with the given color

  //color and comb parameters only used if not tie
  if (!tie) {
    //color the wining cells
    for (let i = 0; i < 3; i++) {
      document.getElementById(`c${comb[i]}`).style.backgroundColor = color;
    }
    //color the message
    document.getElementById("score").style.color = color;
  }
  //display the popup
  document.getElementById("popup").style.display = "flex";
  //set the message
  document.getElementById("score").innerText = message;
  //remove click listener from cells; (cells not clickable after game is ended)
  for (let i = 0; i < 9; i++) {
    document.getElementById(`c${i}`).removeEventListener("click", playerMove);
  }
};

const checkDone = (board) => {
  // same as checkGame() but without affecting the game or ending it
  // needed by the AI algorithm
  for (let i = 0; i < 8; i++) {
    const comb = winCombos[i];

    if (
      board[comb[0]] === "x" &&
      board[comb[1]] === "x" &&
      board[comb[2]] === "x"
    ) {
      return "x wins";
    }
    if (
      board[comb[0]] === "o" &&
      board[comb[1]] === "o" &&
      board[comb[2]] === "o"
    ) {
      return "o wins";
    }
  }
  return false;
};

const makeMove = (cellID, player) => {
  // takes a cell id and player string(X or O)
  //if the cell is empty add the move (X or O) and return true
  if (document.getElementById(cellID).innerHTML === "") {
    document.getElementById(cellID).innerHTML = `<h1>${player}</h1>`;
    return true;
  }
  // if the cell is not empty return false
  return false;
};

const playerMove = (event) => {
  //register the player move and make the next action based on the active mode
  const cellID = event.target.id;
  //call the function makeMove() that adds the move to the board
  //the code inside the if only executed if the move rigistered (makeMove()returns true); -clicking filled cell does nothing
  if (cellID && makeMove(cellID, currentPlayer)) {
    //if the move added get the new board and check if game ends
    const board = getBoardStatus();
    const game = checkGame(board);

    //if game not finished make next move based on the mode
    if (game === "not finished") {
      if (MODE === "Easy") makeAiMoveEasy(board);
      else if (MODE === "Medium") makeAiMoveMedium(board);
      else if (MODE === "Hard") makeAiMoveHard(board);
      else if (MODE === "2Players") switchTurn();
    }
  }
};

// *********************************************** 2 players mode *****
const switchTurn = () => {
  // switch the player turn
  if (currentPlayer === "X") currentPlayer = "O";
  else currentPlayer = "X";
  //update turn in the interface
  document.getElementById("turn").innerText = currentPlayer;
};
// *********************************************** AI algorithm *******
const getAvailableMoves = (board, player) => {
  //get every possible board after adding a move py the player(or AI)
  const moves = [];
  //loop every cell
  for (let i = 0; i < 9; i++) {
    //if the cell is empty
    if (board[i] === "e") {
      //add the original board with the updated move to the moves array
      let move = [...board];
      move[i] = player;
      moves.push(move);
    }
  }
  return moves;
};

const alphaBeta = (board, depth, a, b, AiTurn) => {
  //check if the game is done based on the given board status
  const done = checkDone(board);
  let score;
  if (done === "x wins") score = -10; //AI loses
  if (done === "o wins") score = 10; //AI wins
  if (done === false) score = 0; //not done yet

  //return the value of the move if done(someone wins or depth reaches 0)
  //depth starts at -1 in hard level, so it will never reache 0 when decrementing the depth in the recursive call
  //depth starts at 0 in easy level, so it will return the value of the move if winner or looser, else it will be 0 and will do the first possible move
  //depth starts at 1 in medium level, so it will recursively call the algorithm one more time only
  if (score === 10 || score === -10 || depth === 0) return score;

  //if maximizing
  if (AiTurn) {
    let v = mINF; //initial value is minus infinity
    let AIMoves = getAvailableMoves(board, "o"); //get the AI's possible moves

    if (AIMoves.length === 0) return 0; //if no moves return(the game ended)

    //recursively call the algorithm on every child(possible moves after this one)
    for (let i = 0; i < AIMoves.length; i++) {
      const child = AIMoves[i];
      v = Math.max(v, alphaBeta(child, depth - 1, a, b, false));
      a = Math.max(a, v);
      if (b <= a) break;
    }
    return v;
  }
  //if minimizing
  else {
    let v = INF; //initial value is infinity
    let PMoves = getAvailableMoves(board, "x"); //get the player's possible moves

    if (PMoves.length === 0) return 0; //if no moves return(the game ended)

    //recursively call the algorithm on every child(possible moves after this one)
    for (let i = 0; i < PMoves.length; i++) {
      const child = PMoves[i];
      v = Math.min(v, alphaBeta(child, depth - 1, a, b, true));
      b = Math.min(b, v);
      if (b <= a) break;
    }
    return v;
  }
};

// *********************************************** AI move depends on mode

const makeAiMoveHard = (board) => {
  // evaluate every possiple scenario; immposible to beat
  let bestVal = -1000; //initials
  let bestMoveIndex = -1;

  //loop every cell
  for (let i = 0; i < 9; i++) {
    // Check if cell is empty
    if (board[i] === "e") {
      // Make the move
      let newBoard = [...board];
      newBoard[i] = "o";
      //call the algorithm on the new boared with the made move; set depth = -1 (will never reach 0 -> keep going until end of game)
      let moveVal = alphaBeta(newBoard, -1, mINF, INF, false);

      //if the move is better than the current best move update the values
      if (moveVal > bestVal) {
        bestMoveIndex = i;
        bestVal = moveVal;
      }
    }
  }
  // make the move indicated by the bestMoveIndex
  if (bestMoveIndex >= 0) {
    makeMove(`c${bestMoveIndex}`, "O");
    // check if the game ends
    checkGame(getBoardStatus());
    return;
  }
};

const makeAiMoveEasy = (board) => {
  //doesnt evaluate for the future; if the move makes him win he do it; else makes the first available move
  let bestVal = -1000; //initials
  let bestMoveIndex = -1;

  //loop every cell
  for (let i = 0; i < 9; i++) {
    // Check if cell is empty
    if (board[i] === "e") {
      // Make the move
      let newBoard = [...board];
      newBoard[i] = "o";
      //call the algorithm on the new boared with the made move;
      // set depth = 0 (no evaluation done by the algorithm, just check if the move makes the AI wins or not)
      let moveVal = alphaBeta(newBoard, 0, mINF, INF, false);

      //if the move is better than the current best move update the values
      if (moveVal > bestVal) {
        bestMoveIndex = i;
        bestVal = moveVal;
      }
    }
  }
  // make the move indicated by the bestMoveIndex
  if (bestMoveIndex >= 0) {
    makeMove(`c${bestMoveIndex}`, "O");
    // check if the game ends
    checkGame(getBoardStatus());
    return;
  }
};

const makeAiMoveMedium = (board) => {
  // evaluate one more step after his move
  let bestVal = -1000; //initials
  let bestMoveIndex = -1;

  //loop every cell
  for (let i = 0; i < 9; i++) {
    // Check if cell is empty
    if (board[i] === "e") {
      // Make the move
      let newBoard = [...board];
      newBoard[i] = "o";
      //call the algorithm on the new boared with the made move; set depth = 1
      // (evaluate one more step after this move)
      let moveVal = alphaBeta(newBoard, 1, mINF, INF, false);

      //if the move is better than the current best move update the values
      if (moveVal > bestVal) {
        bestMoveIndex = i;
        bestVal = moveVal;
      }
    }
  }

  /// make the move indicated by the bestMoveIndex
  if (bestMoveIndex >= 0) {
    makeMove(`c${bestMoveIndex}`, "O");
    // check if the game ends
    checkGame(getBoardStatus());
    return;
  }
};

startGame();
