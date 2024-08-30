import React, { useState, useEffect } from 'react';
import './App.css';

const BOARD_SIZE = 16;

const initialBoard = () => {
  const board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
  
  const setupRow = (row, color, isPawnRow = false) => {
    const pieces = isPawnRow ? Array(8).fill('P') : ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    const startCol = (BOARD_SIZE - pieces.length) / 2;
    for (let i = 0; i < pieces.length; i++) {
      board[row][startCol + i] = { type: pieces[i], color };
    }
  };

  setupRow(0, 'black');
  setupRow(1, 'black', true);
  setupRow(BOARD_SIZE - 2, 'white', true);
  setupRow(BOARD_SIZE - 1, 'white');

  return board;
};

const Piece = ({ type, color }) => {
  return <div className={`piece ${color} ${type}`}>{type}</div>;
};

const Square = ({ piece, onClick, isSelected }) => {
  return (
    <div className={`square ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

const Board = ({ board, onClick, selectedPiece }) => {
  return (
    <div className="board">
      {board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((piece, j) => (
            <Square 
              key={j} 
              piece={piece} 
              onClick={() => onClick(i, j)}
              isSelected={selectedPiece && selectedPiece.i === i && selectedPiece.j === j}
            />
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
  const [moveCount, setMoveCount] = useState(0);

  const isPathClear = (start, end) => {
    const dx = Math.sign(end.j - start.j);
    const dy = Math.sign(end.i - start.i);
    let x = start.j + dx;
    let y = start.i + dy;

    while (x !== end.j || y !== end.i) {
      if (board[y][x] !== null) {
        return false;
      }
      x += dx;
      y += dy;
    }
    return true;
  };

  const isValidMove = (start, end) => {
    const piece = board[start.i][start.j];
    const target = board[end.i][end.j];

    if (!piece || (target && target.color === piece.color)) {
      return false;
    }

    const dx = Math.abs(end.j - start.j);
    const dy = Math.abs(end.i - start.i);

    switch (piece.type) {
      case 'P':
        const direction = piece.color === 'white' ? -1 : 1;
        if (start.j === end.j && !target) {
          if (dy === 1 && start.i + direction === end.i) {
            return true;
          }
          if (dy === 2 && ((piece.color === 'white' && start.i === BOARD_SIZE - 2) || (piece.color === 'black' && start.i === 1)) && start.i + 2 * direction === end.i && !board[start.i + direction][start.j]) {
            return true;
          }
        }
        if (dy === 1 && dx === 1 && target && target.color !== piece.color && start.i + direction === end.i) {
          return true;
        }
        return false;

      case 'R':
        return (dx === 0 || dy === 0) && isPathClear(start, end);

      case 'N':
        return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);

      case 'B':
        return dx === dy && isPathClear(start, end);

      case 'Q':
        return (dx === dy || dx === 0 || dy === 0) && isPathClear(start, end);

      case 'K':
        return dx <= 1 && dy <= 1;

      default:
        return false;
    }
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
        setMoveCount(moveCount + 1);
      } else {
        setSelectedPiece(null);
      }
    } else if (board[i][j] && board[i][j].color === currentPlayer) {
      setSelectedPiece({ i, j });
    }
  };

  const getValidMoves = (piece) => {
    const validMoves = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (isValidMove(piece, { i, j })) {
          validMoves.push({ i, j });
        }
      }
    }
    return validMoves;
  };

  useEffect(() => {
    if (currentPlayer === 'black' && moveCount > 0) {
      setTimeout(() => {
        const pieces = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
          for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] && board[i][j].color === 'black') {
              pieces.push({ i, j });
            }
          }
        }

        let validMove = null;
        while (pieces.length > 0 && !validMove) {
          const pieceIndex = Math.floor(Math.random() * pieces.length);
          const piece = pieces[pieceIndex];
          const moves = getValidMoves(piece);
          if (moves.length > 0) {
            validMove = moves[Math.floor(Math.random() * moves.length)];
            handleClick(piece.i, piece.j);
            handleClick(validMove.i, validMove.j);
          } else {
            pieces.splice(pieceIndex, 1);
          }
        }

        if (!validMove) {
          setCurrentPlayer('white');
        }
      }, 1000);
    }
  }, [currentPlayer, moveCount]);

  return (
    <div>
      <Board board={board} onClick={handleClick} selectedPiece={selectedPiece} />
      <div className="game-info">Current Player: {currentPlayer}</div>
    </div>
  );
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
