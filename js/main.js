// application constants
const COLUMNS = 7;
const ROWS = 6;

// application state variables
let grid = [];
let turn;
let end;

// cached element references
const msg = document.getElementById("msg");
const cells = document.querySelectorAll(".cell");

// event listeners
document.getElementById("frame").addEventListener("click", plotClick);
document.getElementById("replay").addEventListener("click", resetGrid);

// function executions
resetGrid();

// function declarations

function plotClick(event) {
  let x = parseInt(event.target.id.charAt(1));
  let y = parseInt(event.target.id.charAt(3));
  if (end || event.target.id === "frame" || y !== dropRow(x)) return;
  grid[x][dropRow(x)] = turn ? 1 : -1;
  event.target.style.backgroundColor = turn ? "#00bbbb" : "#bb0000";
  event.target.style.border = "1px solid black";
  checkGrid();
  if (!end) {
    turn = !turn;
    dropRings();
  }
}

function dropRow(x) {
  for (let y = 0; y < ROWS; y++) {
    if (grid[x][y] === 0) {
      return y;
    }
  }
  return "full";
}

function dropRings() {
  for (let x = 0; x < COLUMNS; x++) {
    if (!end && dropRow(x) !== "full") {
      // cells[(COLUMNS*ROWS-1)-(x+(dropRow(x)*COLUMNS))].style.border = turn ? "5px solid #00bbbb" : "5px solid #bb0000";
      document.getElementById(`x${x}y${dropRow(x)}`).style.border = turn ? "5px solid #00bbbb" : "5px solid #bb0000";
    }
  }
}

function checkGrid() {
  checkVertical();
  checkHorizontal();
  // checkDiagonal();
  if (fullGrid() && !end) {
    end = true;
    msg.textContent = "TIED GAME";
    return;
  }
  return;
}

function checkVertical() {
  let player = turn ? 1 : -1;
  let spree = 0;
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (grid[x][y] === player) {
        spree++;
        if (spree === 4) {
          end = true;
          msg.innerHTML = turn ? `<span id="teal">TEAL</span> WINS!` : `<span id="red">RED</span> WINS!`;
          cells.forEach(cell => cell.style.border = "1px solid black");
          return;
        }
      } else {
        spree = 0;
      }
    }
  }
  return;
}

function checkHorizontal() {
  let player = turn ? 1 : -1;
  let spree = 0;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      if (grid[x][y] === player) {
        spree++;
        if (spree === 4) {
          end = true;
          msg.innerHTML = turn ? `<span id="teal">TEAL</span> WINS!` : `<span id="red">RED</span> WINS!`;
          cells.forEach(cell => cell.style.border = "1px solid black");
          return;
        }
      } else {
        spree = 0;
      }
    }
  }
  return;
}

// function checkDiagonal() {

// }

function fullGrid() {
  for (let x = 0; x < COLUMNS; x++) {
    if (grid[x][ROWS-1] === 0) {
      return false;
    }
  }
  return true;
}

function resetGrid() {
  for (let x = 0; x < COLUMNS; x++) {
    grid[x] = [];
    for (let y = 0; y < ROWS; y++) {
      grid[x][y] = 0;
    }
  }
  cells.forEach(cell => {
    cell.style.backgroundColor = "#ffffff";
    cells.forEach(cell => cell.style.border = "1px solid black");
  });
  turn = true;
  end = false;
  msg.innerHTML = `<span id="teal">TEAL</span> versus <span id="red">RED</span>`;
  dropRings();
}