import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  const value = (props.winningSquare) ?
    <mark>{props.value}</mark> :
    props.value
  return (
      <button className="square" onClick={props.onClick}>
        {value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i, winningSquare) {
    return (
        <Square
          value={this.props.squares[i]}
          winningSquare={winningSquare}
          onClick={() => this.props.onClick(i)}
        />
      );
  }

  createBoard(n) {
    let board = []
    for (var i = 0; i < n * n; i = i + n) {
      let row = []
      for (var j = i; j < i + n; j++) {
        row.push(this.renderSquare(j))
      }
      board.push(<div className="board-row">{row}</div>)
    }
    return board
  }

  createBoard(n, winningSquares) {
    let board = []
    for (var i = 0; i < n * n; i = i + n) {
      let row = []
      for (var j = i; j < i + n; j++) {
        let square = this.renderSquare(j);
        if (winningSquares && winningSquares.includes(j)) {
          row.push(this.renderSquare(j, true))
        } else {
          row.push(this.renderSquare(j, false))
        }
      }
      board.push(<div className="board-row">{row}</div>)
    }
    return board
  }

  render() {
    return (
      <div>
        {this.createBoard(3, this.props.winningSquares)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      indexes: Array(9).fill(null),
      movesAscending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const indexes = this.state.indexes.slice()
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    indexes[history.length] = i;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      indexes: indexes,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
  }

  changeOrder() {
    this.setState({
      movesAscending: !this.state.movesAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const original_moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const desc_index = (move > 0) ?
        desc + ' (' + indexToColRow(this.state.indexes[move]) + ')' :
        desc
      const desc_bolded = (move == this.state.stepNumber) ? 
        <strong>{desc_index}</strong> : 
        desc_index
      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}>{desc_bolded}
          </button>
        </li>
      );
    });
    const moves = this.state.movesAscending ? original_moves : original_moves.reverse();
    let status;
    if (winner[0]) {
      status = 'Winner: ' + winner[0];
    } else if (this.state.stepNumber == 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningSquares={winner[1]}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => this.changeOrder()}>Change Order
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function indexToColRow(index) {
  const indexMap = {
    0: "0, 0",
    1: "0, 1",
    2: "0, 2",
    3: "1, 0",
    4: "1, 1",
    5: "1, 2",
    6: "2, 0",
    7: "2, 1",
    8: "2, 2"
  }
  return indexMap[index]
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

