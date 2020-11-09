// application constants
const GRID_COLUMNS = 7;
const GRID_ROWS = 6;

// application state variables
let grid = [];
let turn;
let end;

// cached element references
const msg = document.getElementById('msg');
const cells = document.querySelectorAll('.cell');

// event listeners
document.getElementById('frame').addEventListener('click', plotClick);
document.getElementById('replay').addEventListener('click', resetGrid);

// function executions
resetGrid();

// function declarations

function plotClick(event) {
  let coordinate = event.target.id.split('_');
  let x = parseInt(coordinate[0]);
  let y = parseInt(coordinate[1]);
  if (end || event.target.id === "frame" || y !== dropRow(x)) return;
  turn ? grid[x][dropRow(x)] += 1 : grid[x][dropRow(x)] -= 1;
  turn ? event.target.style.backgroundColor = '#00bbbb' :
    event.target.style.backgroundColor = '#bb0000';
  event.target.style.border = '1px solid black';
  turn = !turn;
  highlightDrop();
  checkGrid();
}

function checkGrid() {
  // win scenarios

  if (fullGrid() && !end) {
    end = true;
    msg.textContent = "TIED GAME";
    return;
  }
  return;
}

function highlightDrop() {
  for (let x = 0; x < GRID_COLUMNS; x++) {
    if (dropRow(x) !== "full") {
      turn ? cells[x+(dropRow(x)*GRID_COLUMNS)].style.border = '5px solid #00bbbb' :
        cells[x+(dropRow(x)*GRID_COLUMNS)].style.border = '5px solid #bb0000';
    }
  }
  return;
}

function dropRow(x) {
  for (let y = GRID_ROWS - 1; y >= 0; y--) {
    if (grid[x][y] === 0) {
      return y;
    }
  }
  return "full";
}

function fullGrid() {
  for (let x = 0; x < GRID_COLUMNS; x++) {
    if (grid[x][0] === 0) {
      return false;
    }
  }
  return true;
}

function resetGrid() {
  for (let x = 0; x < GRID_COLUMNS; x++) {
    grid[x] = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      grid[x][y] = 0;
    }
  }
  cells.forEach(cell => {
    cell.style.backgroundColor = '#ffffff';
    cell.style.border = '1px solid black';
  });
  turn = true;
  highlightDrop();
  end = false;
  msg.innerHTML = "<span id='teal'>TEAL</span> versus <span id='red'>RED</span>";
}