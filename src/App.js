import React, { useState, useEffect } from 'react';
import './App.css';

const BOARD_SIZE = 16;

const initialBoard = () => {
  const board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
  
  // Set up initial pieces (simplified for 16x16 board)
  const setupRow = (row, color) => {
    board[row] = [
      { type: 'R', color }, { type: 'N', color }, { type: 'B', color }, { type: 'Q', color },
      { type: 'K', color }, { type: 'B', color }, { type: 'N', color }, { type: 'R', color },
      { type: 'P', color }, { type: 'P', color }, { type: 'P', color }, { type: 'P', color },
      { type: 'P', color }, { type: 'P', color }, { type: 'P', color }, { type: 'P', color },
    ];
  };

  setupRow(0, 'white');
  setupRow(1, 'white');
  setupRow(14, 'black');
  setupRow(15, 'black');

  return board;
};

const Piece = ({ type, color }) => {
  return <div className={`piece ${color} ${type}`}>{type}</div>;
};

const Square = ({ piece, onClick }) => {
  return (
    <div className="square" onClick={onClick}>
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

const Board = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((piece, j) => (
            <Square key={j} piece={piece} onClick={() => onClick(i, j)} />
          ))}
        </div>
      ))}
    </div>
  );
};

const Game = () => {
  const [board, setBoard] = useState(initialBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');

  const isValidMove = (start, end) => {
    // Implement chess rules here (simplified for brevity)
    return true;
  };

  const handleClick = (i, j) => {
    if (selectedPiece) {
      if (isValidMove(selectedPiece, { i, j })) {
        const newBoard = [...board];
        newBoard[i][j] = newBoard[selectedPiece.i][selectedPiece.j];
        newBoard[selectedPiece.i][selectedPiece.j] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      } else {
        setSelectedPiece(null);
      }
    } else if (board[i][j] && board[i][j].color === currentPlayer) {
      setSelectedPiece({ i, j });
    }
  };

  useEffect(() => {
    if (currentPlayer === 'black') {
      // Simple AI: Move a random piece to a random valid position
      setTimeout(() => {
        const pieces = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
          for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] && board[i][j].color === 'black') {
              pieces.push({ i, j });
            }
          }
        }
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        let validMove = false;
        while (!validMove) {
          const newI = Math.floor(Math.random() * BOARD_SIZE);
          const newJ = Math.floor(Math.random() * BOARD_SIZE);
          if (isValidMove(piece, { i: newI, j: newJ })) {
            handleClick(piece.i, piece.j);
            handleClick(newI, newJ);
            validMove = true;
          }
        }
      }, 1000);
    }
  }, [currentPlayer]);

  return <Board board={board} onClick={handleClick} />;
};

function App() {
  return (
    <div className="App">
      <h1>Lords of the Kingdom</h1>
      <Game />
    </div>
  );
}

export default App;
