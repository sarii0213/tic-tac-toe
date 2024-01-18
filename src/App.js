import { useState } from 'react';

function Square({ value, onSquareClick, style}) {

  return (
    <button 
      className="square"
      onClick={onSquareClick}
      style={style}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice(); // shallow copy (=share the same references)
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const isDraw = result && result.winner === "Draw";
  const status = isDraw
    ? "It's a Draw!"
    : result
    ? "Winner: " + result.winner
    : "Next player: " + (xIsNext ? "X" : "O");

  const getSquareStyle = (index) => {
    const winningLine = result && result.line;
    return winningLine && winningLine.includes(index)
      ? { backgroundColor: "yellow" }
      : {};
  };

  return (
    <>
      <div className="status">{status}</div>
        {Array.from({ length: 3}, (_, rowIndex) => (
        <div className='board-row' key={rowIndex}>
          {Array.from({ length: 3 }, (_, colIndex) => {
            const squareIndex = rowIndex * 3 + colIndex;
            return (
              <Square
                key={squareIndex}
                value={squares[squareIndex]}
                onSquareClick={() => handleClick(squareIndex)}
                style={getSquareStyle(squareIndex)}
              />
            );
          })}
        </div>
        ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleOrder() {
    setAscendingOrder(!ascendingOrder);
  }

  const moves = history.map((squares, move) => {
    const ROW_NUM = 3
    const description = 
      move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={`move-${move}`}>
        {currentMove === move ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = ascendingOrder ? moves : moves.slice().reverse();

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleOrder}>Toggle Order</button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: lines[i]};
    }
  }
  if (squares.every((square) => square !== null)) {
    return { winner: "Draw" };
  }
  return null;

}

// TODO: 着手履歴リストで、各着手の場所を (row, col) という形式で表示する