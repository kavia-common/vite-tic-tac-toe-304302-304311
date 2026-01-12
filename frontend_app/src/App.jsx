import React, { useMemo, useState } from "react";

const BOARD_SIZE = 9;

/**
 * Calculate a winner for the given board.
 * @param {(null|'X'|'O')[]} squares
 * @returns {{winner: null|'X'|'O', line: number[]|null}}
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diags
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }

  return { winner: null, line: null };
}

/**
 * Returns true if all squares are filled.
 * @param {(null|'X'|'O')[]} squares
 */
function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

/**
 * Single square button.
 * @param {{value: null|'X'|'O', onClick: () => void, isWinning: boolean, disabled: boolean}} props
 */
function Square({ value, onClick, isWinning, disabled }) {
  const className = [
    "ttt-square",
    value ? "ttt-square--filled" : "",
    isWinning ? "ttt-square--winning" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      <span className="ttt-square__value" aria-hidden="true">
        {value ?? ""}
      </span>
    </button>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** This is the main Tic Tac Toe app component. */
  const [squares, setSquares] = useState(() => Array(BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = !winner && isBoardFull(squares);
  const gameOver = Boolean(winner) || draw;

  const statusText = winner
    ? `Winner: ${winner}`
    : draw
      ? "Draw game"
      : `Turn: ${xIsNext ? "X" : "O"}`;

  const statusToneClass = winner
    ? "ttt-status--success"
    : draw
      ? "ttt-status--muted"
      : "ttt-status--primary";

  function handleSquareClick(index) {
    if (gameOver) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  function handleReset() {
    setSquares(Array(BOARD_SIZE).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="ttt-page">
      <main className="ttt-shell" aria-label="Tic Tac Toe">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className={`ttt-status ${statusToneClass}`} role="status" aria-live="polite">
            {statusText}
          </p>
        </header>

        <section className="ttt-boardWrap" aria-label="Game board">
          <div className="ttt-board" role="grid" aria-label="3 by 3 board">
            {squares.map((value, idx) => (
              <Square
                key={idx}
                value={value}
                onClick={() => handleSquareClick(idx)}
                disabled={Boolean(value) || gameOver}
                isWinning={Boolean(line?.includes(idx))}
              />
            ))}
          </div>
        </section>

        <footer className="ttt-controls">
          <button type="button" className="ttt-button" onClick={handleReset}>
            {gameOver ? "New Game" : "Reset"}
          </button>

          <div className="ttt-hint" aria-hidden="true">
            First to get 3 in a row wins.
          </div>
        </footer>
      </main>
    </div>
  );
}
