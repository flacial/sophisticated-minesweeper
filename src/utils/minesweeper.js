import { startCountdown, endCountdown } from './countdown.js';

class Minesweeper {
  constructor(value) {
    this.blocks = document.querySelector(".blocks");
    this.countdownEl = document.querySelector('.countdown');

    this.value = value;
    this.gridNxn = value * value;
    this.allSquares = [];
    this.allSquaresWithoutBombs = [];
    this.bombsCount = value;
    this.revealedSquaresCount = 0;

    if (this.value) {
      this.allSquaresWithoutBombs = this.generateRows(this.value);
      this.allSquares = this.generateBombs();
      this.blocks.style.maxWidth = `${this.value * 50}px`
    } else {
      throw "Grid value argument is missing";
    }
  }

  generateBombs = (
    count = 0,
    sqs = this.allSquaresWithoutBombs.map((el) => ({ ...el }))
  ) => {
    if (count === this.bombsCount) return sqs;

    let rand = Math.floor(Math.random() * this.gridNxn);
    let sq = sqs[rand];

    if (!sq.bomb) {
      sq.bomb = true;
      return this.generateBombs(count + 1, sqs);
    }

    return this.generateBombs(count, sqs);
  };

  findNearestSquares = (squareIndex) => {
    const neighborSquares = [];

    (squareIndex + 1) % this.value !== 0 &&
      neighborSquares.push(this.allSquares[squareIndex + 1]);
    squareIndex % this.value !== 0 &&
      neighborSquares.push(this.allSquares[squareIndex - 1]);

    const assignDirections = (index) => {
      if (index % this.value !== 0 && this.allSquares[index - 1])
        neighborSquares.push(this.allSquares[index - 1]);

      this.allSquares[index] && neighborSquares.push(this.allSquares[index]);

      if ((index + 1) % this.value !== 0 && this.allSquares[index + 1])
        neighborSquares.push(this.allSquares[index + 1]);
    };

    const topNeighborsIndex = squareIndex - this.value;

    if (topNeighborsIndex >= 0) assignDirections(topNeighborsIndex);

    const bottomNeighborsIndex = squareIndex + this.value;

    if (bottomNeighborsIndex < this.gridNxn)
      assignDirections(bottomNeighborsIndex);

    return neighborSquares;
  };

  findNearestBombsCount = (squareIndex) => this.findNearestSquares(squareIndex).filter((e) => e.bomb).length;

  start = () => {
    this.blocks.innerHTML = "";
    new Minesweeper(this.value);
  }

  restart = () => {
    this.blocks.innerHTML = "";
    endCountdown(this.countdownEl);
    new Minesweeper(this.value);
  }

  endGame = (state) => {
    const isSquaresRevealed =
      this.revealedSquaresCount + this.bombsCount === this.gridNxn;

    if (isSquaresRevealed) {
      if (confirm("You Won! Wanna play again?")) this.start()
      return;
    }

    if (state?.lost && confirm("You Lost :( Wanna try again?")) this.restart()
  };

  revealNearestSquares = (i) => {
    const square = this.allSquares[i];
    if (!square.revealed) {
      square.revealed = true;
      square.el.innerHTML = "";

      this.findNearestSquares(i)
        .filter((e) => !e.hasOwnProperty("bomb"))
        .forEach((e) => {
          if (!this.allSquares[e.index].revealed) {
            const bombs = this.findNearestBombsCount(e.index);

            this.revealedSquaresCount += 1;
            e.el.classList.add("selected", "cursorNone");

            if (bombs === 0) {
              this.revealNearestSquares(e.index);
            } else {
              e.el.innerHTML = `<p>${bombs}</p>`;
            }

            this.allSquares[e.index].revealed = true;
          }
        });
    }

    return;
  };

  createSquare = (squareIndex) => {
    const square = document.createElement("div");
    square.classList.add("cell");

    square.addEventListener("click", () => {
      square.classList.add("selected", "cursorNone");

      if (this.revealedSquaresCount === 0)  startCountdown(this.countdownEl)

      if (this.allSquares[squareIndex].bomb) {
        square.innerHTML = `<p>&#x1F4A3</p>`;
        setTimeout(() => this.endGame({ lost: true }), 200);
        return;
      }

      const nearestBombsCount = this.findNearestBombsCount(squareIndex);

      setTimeout(() => this.endGame(), 200);
      this.revealedSquaresCount += 1;

      if (nearestBombsCount === 0) {
        square.innerHTML = "";
        this.revealNearestSquares(squareIndex);
        return;
      }

      this.allSquares[squareIndex].revealed = true;

      square.innerHTML = `<p>${nearestBombsCount}</p>`;
    });

    square.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      if (!this.allSquares[squareIndex].revealed)
        square.innerHTML = "<p>&#128681</p>";
    });

    return square;
  };

  generateColumns = (rowCount, row, col = 0, rows = []) => {
    if (col === rowCount) return rows;

    rows.push(this.createSquare(col + row * this.value));

    return this.generateColumns(rowCount, row, col + 1, rows);
  };

  generateRows = (rows, row = 0, squaresStore = []) => {
    if (row === rows) {
      return squaresStore;
    }

    this.generateColumns(rows, row).forEach((e, col) => {
      this.blocks.append(e);
      squaresStore.push({
        el: e,
        index: col + row * this.value,
      });
    });

    return this.generateRows(rows, row + 1, squaresStore);
  };
}

export default Minesweeper;

