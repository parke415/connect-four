// application constants
const COORDINATES = 42;
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

function dropRings() {
  for (let x = 0; x < COLUMNS; x++) {
    if (!end && dropRow(x) !== "full") {
      cells[(COORDINATES-1)-(((COLUMNS-1)-x)+(dropRow(x)*COLUMNS))].style.border = turn ? "5px solid #00bbbb" : "5px solid #bb0000";
    }
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

function checkGrid() {
  checkVertical();
  checkHorizontal();
  checkDiagonal();
  if (fullGrid() && !end) {
    end = true;
    msg.textContent = "TIED GAME";
    return;
  }
  return;
}

function checkVertical() {
  let player = turn ? 1 : -1;
  let spree;
  let spreeCache;
  for (let x = 0; x < COLUMNS; x++) {
    spree = 0;
    spreeCache = [];
    for (let y = 0; y < ROWS; y++) {
      if (grid[x][y] === player) {
        spree++;
        spreeCache.push([x, y]);
        if (spree === 4) {
          end = true;
          msg.innerHTML = turn ? `<span id="teal">TEAL</span> WINS!` : `<span id="red">RED</span> WINS!`;
          cells.forEach(cell => cell.style.border = "1px solid black");
          for (let i = 0; i < 4; i++) {
            cells[(COORDINATES-1)-(((COLUMNS-1)-spreeCache[i][0])+(spreeCache[i][1]*COLUMNS))].style.backgroundColor = turn ? "#00ffff" : "#ff0000";
          }
          return;
        }
      } else {
        spree = 0;
        spreeCache = [];
      }
    }
  }
  return;
}

function checkHorizontal() {
  let player = turn ? 1 : -1;
  let spree;
  let spreeCache;
  for (let y = 0; y < ROWS; y++) {
    spree = 0;
    spreeCache = [];
    for (let x = 0; x < COLUMNS; x++) {
      if (grid[x][y] === player) {
        spree++;
        spreeCache.push([x, y]);
        if (spree === 4) {
          end = true;
          msg.innerHTML = turn ? `<span id="teal">TEAL</span> WINS!` : `<span id="red">RED</span> WINS!`;
          cells.forEach(cell => cell.style.border = "1px solid black");
          for (let i = 0; i < 4; i++) {
            cells[(COORDINATES-1)-(((COLUMNS-1)-spreeCache[i][0])+(spreeCache[i][1]*COLUMNS))].style.backgroundColor = turn ? "#00ffff" : "#ff0000";
          }
          return;
        }
      } else {
        spree = 0;
        spreeCache = [];
      }
    }
  }
  return;
}

function checkDiagonal() {
  let player = turn ? 1 : -1;
  let spreeNW;
  let spreeSE;
  let spreeNE;
  let spreeSW;
  let spreeCacheNW;
  let spreeCacheSE;
  let spreeCacheNE;
  let spreeCacheSW;
  for (let offset = 0; offset < ROWS; offset++) {
    spreeNW = 0;
    spreeSE = 0;
    spreeNE = 0;
    spreeSW = 0;
    spreeCacheNW = [];
    spreeCacheSE = [];
    spreeCacheNE = [];
    spreeCacheSW = [];
    for (let z = 0; z < (ROWS-offset); z++) {
      if (grid[z][z+offset] === player) {
        spreeNW++;
        spreeCacheNW.push([z, z+offset]);
      } else {
        spreeNW = 0;
        spreeCacheNW = [];
      }
      if (grid[(z+1)+offset][z] === player) {
        spreeSE++;
        spreeCacheSE.push([(z+1)+offset, z]);
      } else {
        spreeSE = 0;
        spreeCacheSE = [];
      }
      if (grid[(COLUMNS-1)-z][z+offset] === player) {
        spreeNE++;
        spreeCacheNE.push([(COLUMNS-1)-z, z+offset]);
      } else {
        spreeNE = 0;
        spreeCacheNE = [];
      }
      if (grid[(COLUMNS-2)-z-offset][z] === player) {
        spreeSW++;
        spreeCacheSW.push([(COLUMNS-2)-z-offset, z]);
      } else {
        spreeSW = 0;
        spreeCacheSW = [];
      }
      if (spreeNW === 4 || spreeSE === 4 || spreeNE === 4 || spreeSW === 4) {
        end = true;
        msg.innerHTML = turn ? `<span id="teal">TEAL</span> WINS!` : `<span id="red">RED</span> WINS!`;
        cells.forEach(cell => cell.style.border = "1px solid black");
        for (let i = 0; i < 4; i++) {
          if (spreeNW === 4) cells[(COORDINATES-1)-(((COLUMNS-1)-spreeCacheNW[i][0])+(spreeCacheNW[i][1]*COLUMNS))].style.backgroundColor = turn ? "#00ffff" : "#ff0000";
          if (spreeSE === 4) cells[(COORDINATES-1)-(((COLUMNS-1)-spreeCacheSE[i][0])+(spreeCacheSE[i][1]*COLUMNS))].style.backgroundColor = turn ? "#00ffff" : "#ff0000";
          if (spreeNE === 4) cells[(COORDINATES-1)-(((COLUMNS-1)-spreeCacheNE[i][0])+(spreeCacheNE[i][1]*COLUMNS))].style.backgroundColor = turn ? "#00ffff" : "#ff0000";
          if (spreeSW === 4) cells[(COORDINATES-1)-(((COLUMNS-1)-spreeCacheSW[i][0])+(spreeCacheSW[i][1]*COLUMNS))].style.backgroundColor = turn ? "#00ffff" : "#ff0000";
        }
        return;
      }
    }
  }
  return;
}

function fullGrid() {
  for (let x = 0; x < COLUMNS; x++) {
    if (grid[x][ROWS-1] === 0) {
      return false;
    }
  }
  return true;
}