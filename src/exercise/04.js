// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react';
import { useLocalStorageState } from '../utils';

function Board({ onClick, squares }) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button >
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [[Array(9).fill(null), null]])
  const [moveNumber, setMoveNumber] = useLocalStorageState('move', 0)

  const [squares,] = history[moveNumber]
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)

  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue

    setHistory([
      ...history.slice(0, moveNumber + 1),
      [squaresCopy, square]
    ])
    setMoveNumber(moveNumber + 1)
  }

  function restart() {
    setMoveNumber(0);
    setHistory([history[0]])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map(([itemSquares, movePosition], i) =>
            <li key={i} >
              <button disabled={i === moveNumber} onClick={() => setMoveNumber(i)}>
                {
                  (i === 0
                    ? 'Go to game start'
                    : `Move #${i}:  add ${itemSquares[movePosition]} on line ${Math.floor(movePosition / 3) + 1}, column ${movePosition % 3 + 1} `
                  )
                  + (i === moveNumber ? ' (current)' : '')
                }
              </button>
            </li>
          )}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
