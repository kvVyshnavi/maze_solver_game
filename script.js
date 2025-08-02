// Constants
const CELL_SIZE = 20; // Size of each cell in pixels
const START_COLOR = "#2ecc71"; // Green
const END_COLOR = "#e74c3c"; // Red
const PATH_COLOR = "#3498db"; // Blue
const PLAYER_COLOR = "#9b59b6"; // Purple
const WALL_COLOR = "#2c3e50"; // Dark blue
const VISITED_COLOR = "#f1c40f"; // Yellow

// Maze class
class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.start = { x: 0, y: 0 };
    this.end = { x: width - 1, y: height - 1 };
    this.playerPos = { x: this.start.x, y: this.start.y };

    // Initialize grid with walls
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push({
          x: x,
          y: y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
        });
      }
      this.grid.push(row);
    }
  }

  // Get cell at coordinates
  getCell(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.grid[y][x];
  }

  // Get neighboring cells
  getNeighbors(cell) {
    const { x, y } = cell;
    const neighbors = [];

    const directions = [
      { dx: 0, dy: -1, wall: "top" }, // top
      { dx: 1, dy: 0, wall: "right" }, // right
      { dx: 0, dy: 1, wall: "bottom" }, // bottom
      { dx: -1, dy: 0, wall: "left" }, // left
    ];

    directions.forEach((dir) => {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      const neighbor = this.getCell(nx, ny);

      if (neighbor) {
        neighbors.push({
          cell: neighbor,
          wall: dir.wall,
          opposite: this.getOppositeWall(dir.wall),
        });
      }
    });

    return neighbors;
  }

  // Get opposite wall
  getOppositeWall(wall) {
    switch (wall) {
      case "top":
        return "bottom";
      case "right":
        return "left";
      case "bottom":
        return "top";
      case "left":
        return "right";
      default:
        return null;
    }
  }

  // Remove walls between two cells
  removeWalls(cell, neighbor, wall, oppositeWall) {
    cell.walls[wall] = false;
    neighbor.walls[oppositeWall] = false;
  }

  // Generate maze using Depth-First Search algorithm
  generateMaze() {
    const stack = [];
    let current = this.getCell(0, 0);
    current.visited = true;

    while (true) {
      const unvisitedNeighbors = this.getNeighbors(current).filter(
        (n) => !n.cell.visited,
      );

      if (unvisitedNeighbors.length > 0) {
        // Choose random unvisited neighbor
        const randomIndex = Math.floor(
          Math.random() * unvisitedNeighbors.length,
        );
        const { cell: next, wall, opposite } = unvisitedNeighbors[randomIndex];

        // Push current cell to stack
        stack.push(current);

        // Remove walls between current and chosen cell
        this.removeWalls(current, next, wall, opposite);

        // Make chosen cell the current cell and mark as visited
        current = next;
        current.visited = true;
      } else if (stack.length > 0) {
        // Backtrack
        current = stack.pop();
      } else {
        // Maze generation complete
        break;
      }
    }

    // Reset visited status for solving algorithms
    this.resetVisited();

    // Set player position to start
    this.playerPos = { x: this.start.x, y: this.start.y };
  }

  // Reset visited status for all cells
  resetVisited() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x].visited = false;
      }
    }
  }

  // Check if there's a path between two cells (no wall)
  hasPath(x1, y1, x2, y2) {
    // Check if cells are adjacent
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (Math.abs(dx) + Math.abs(dy) !== 1) return false;

    const cell1 = this.getCell(x1, y1);
    const cell2 = this.getCell(x2, y2);

    if (!cell1 || !cell2) return false;

    if (dx === 1) return !cell1.walls.right && !cell2.walls.left; // cell2 is right of cell1
    if (dx === -1) return !cell1.walls.left && !cell2.walls.right; // cell2 is left of cell1
    if (dy === 1) return !cell1.walls.bottom && !cell2.walls.top; // cell2 is below cell1
    if (dy === -1) return !cell1.walls.top && !cell2.walls.bottom; // cell2 is above cell1

    return false;
  }

  // Move player
  movePlayer(dx, dy) {
    const newX = this.playerPos.x + dx;
    const newY = this.playerPos.y + dy;

    if (this.hasPath(this.playerPos.x, this.playerPos.y, newX, newY)) {
      this.playerPos.x = newX;
      this.playerPos.y = newY;
      return true;
    }

    return false;
  }

  // Check if player has reached the end
  checkWin() {
    return this.playerPos.x === this.end.x && this.playerPos.y === this.end.y;
  }
}

// Solver class with different algorithms
class MazeSolver {
  constructor(maze) {
    this.maze = maze;
    this.visitedCells = new Set();
    this.path = [];
    this.solution = [];
  }

  // Convert cell coordinates to string key
  cellToKey(x, y) {
    return `${x},${y}`;
  }

  // Get unvisited accessible neighbors of a cell
  getAccessibleNeighbors(x, y) {
    const neighbors = [];
    const directions = [
      { dx: 0, dy: -1 }, // top
      { dx: 1, dy: 0 }, // right
      { dx: 0, dy: 1 }, // bottom
      { dx: -1, dy: 0 }, // left
    ];

    directions.forEach((dir) => {
      const nx = x + dir.dx;
      const ny = y + dir.dy;

      if (this.maze.hasPath(x, y, nx, ny)) {
        const key = this.cellToKey(nx, ny);
        if (!this.visitedCells.has(key)) {
          neighbors.push({ x: nx, y: ny });
        }
      }
    });

    return neighbors;
  }

  // Depth-First Search algorithm
  solveDFS() {
    this.visitedCells.clear();
    this.path = [];
    this.solution = [];

    const startX = this.maze.start.x;
    const startY = this.maze.start.y;
    const endX = this.maze.end.x;
    const endY = this.maze.end.y;

    const found = this.dfsRecursive(startX, startY, endX, endY, []);

    if (found) {
      this.solution = [...this.path];
      return true;
    }

    return false;
  }

  // Recursive DFS helper
  dfsRecursive(x, y, endX, endY, currentPath) {
    const key = this.cellToKey(x, y);
    this.visitedCells.add(key);

    currentPath.push({ x, y });
    this.path = [...currentPath];

    // Check if we reached the end
    if (x === endX && y === endY) {
      return true;
    }

    // Get unvisited neighbors
    const neighbors = this.getAccessibleNeighbors(x, y);

    for (const neighbor of neighbors) {
      if (this.dfsRecursive(neighbor.x, neighbor.y, endX, endY, currentPath)) {
        return true;
      }
    }

    // Backtrack
    currentPath.pop();
    this.path = [...currentPath];

    return false;
  }

  // Breadth-First Search algorithm
  solveBFS() {
    this.visitedCells.clear();
    this.path = [];
    this.solution = [];

    const startX = this.maze.start.x;
    const startY = this.maze.start.y;
    const endX = this.maze.end.x;
    const endY = this.maze.end.y;

    const queue = [{ x: startX, y: startY }];
    const parent = new Map();

    this.visitedCells.add(this.cellToKey(startX, startY));

    while (queue.length > 0) {
      const current = queue.shift();
      this.path.push(current);

      // Check if we reached the end
      if (current.x === endX && current.y === endY) {
        // Reconstruct path
        this.solution = this.reconstructPath(parent, current);
        return true;
      }

      // Get unvisited neighbors
      const neighbors = this.getAccessibleNeighbors(current.x, current.y);

      for (const neighbor of neighbors) {
        const key = this.cellToKey(neighbor.x, neighbor.y);
        this.visitedCells.add(key);
        queue.push(neighbor);
        parent.set(key, current);
      }
    }

    return false;
  }

  // A* algorithm
  solveAStar() {
    this.visitedCells.clear();
    this.path = [];
    this.solution = [];

    const startX = this.maze.start.x;
    const startY = this.maze.start.y;
    const endX = this.maze.end.x;
    const endY = this.maze.end.y;

    // Priority queue using array
    const openList = [
      {
        x: startX,
        y: startY,
        g: 0,
        h: this.heuristic(startX, startY, endX, endY),
        f: 0,
      },
    ];
    const closedSet = new Set();
    const gScore = new Map();
    const parent = new Map();

    gScore.set(this.cellToKey(startX, startY), 0);

    while (openList.length > 0) {
      // Sort open list by f score (ascending)
      openList.sort((a, b) => a.f - b.f);

      const current = openList.shift();
      this.path.push(current);

      // Check if we reached the end
      if (current.x === endX && current.y === endY) {
        // Reconstruct path
        this.solution = this.reconstructPath(parent, current);
        return true;
      }

      // Add to closed set
      closedSet.add(this.cellToKey(current.x, current.y));

      // Get neighbors
      const neighbors = this.getAccessibleNeighbors(current.x, current.y);

      for (const neighbor of neighbors) {
        const neighborKey = this.cellToKey(neighbor.x, neighbor.y);

        // Skip if already evaluated
        if (closedSet.has(neighborKey)) continue;

        // Calculate g score (distance from start)
        const tentativeGScore =
          gScore.get(this.cellToKey(current.x, current.y)) + 1;

        // Check if this path is better
        if (
          !gScore.has(neighborKey) ||
          tentativeGScore < gScore.get(neighborKey)
        ) {
          // Record this path
          parent.set(neighborKey, current);
          gScore.set(neighborKey, tentativeGScore);

          // Calculate f score (g + heuristic)
          const h = this.heuristic(neighbor.x, neighbor.y, endX, endY);
          const f = tentativeGScore + h;

          // Add to open list if not already there
          const inOpenList = openList.some(
            (item) => item.x === neighbor.x && item.y === neighbor.y,
          );

          if (!inOpenList) {
            openList.push({ ...neighbor, g: tentativeGScore, h, f });
            this.visitedCells.add(neighborKey);
          }
        }
      }
    }

    return false;
  }

  // Manhattan distance heuristic for A*
  heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  // Reconstruct path from parent map
  reconstructPath(parent, current) {
    const path = [current];

    while (parent.has(this.cellToKey(current.x, current.y))) {
      current = parent.get(this.cellToKey(current.x, current.y));
      path.unshift(current);
    }

    return path;
  }
}

// Main app
class MazeApp {
  constructor() {
    this.canvas = document.getElementById("maze-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.maze = null;
    this.solver = null;
    this.animationId = null;
    this.isPlaying = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Generate button
    document.getElementById("generate-btn").addEventListener("click", () => {
      this.generateMaze();
    });

    // Solve button
    document.getElementById("solve-btn").addEventListener("click", () => {
      this.solveMaze();
    });

    // Play button
    document.getElementById("play-btn").addEventListener("click", () => {
      this.playMaze();
    });

    // Keyboard controls for playing
    document.addEventListener("keydown", (e) => {
      if (!this.isPlaying || !this.maze) return;

      let moved = false;

      switch (e.key) {
        case "ArrowUp":
          moved = this.maze.movePlayer(0, -1);
          break;
        case "ArrowRight":
          moved = this.maze.movePlayer(1, 0);
          break;
        case "ArrowDown":
          moved = this.maze.movePlayer(0, 1);
          break;
        case "ArrowLeft":
          moved = this.maze.movePlayer(-1, 0);
          break;
      }

      if (moved) {
        this.drawMaze();

        if (this.maze.checkWin()) {
          this.stopPlaying();
          this.setStatusText(
            `Congratulations! You solved the maze in ${this.formatTime(this.elapsedTime)} seconds!`,
          );
        }
      }
    });
  }

  generateMaze() {
    // Cancel any ongoing animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Stop playing mode if active
    this.stopPlaying();

    // Get maze size from select
    const sizeSelect = document.getElementById("size");
    const size = parseInt(sizeSelect.value);

    // Create new maze
    this.maze = new Maze(size, size);
    this.maze.generateMaze();
    this.solver = new MazeSolver(this.maze);

    // Resize canvas
    this.resizeCanvas();

    // Draw maze
    this.drawMaze();

    this.setStatusText(
      'Maze generated. Click "Solve Maze" to see a solution or "Play Maze" to solve it yourself.',
    );
  }

  resizeCanvas() {
    const canvasSize = this.maze.width * CELL_SIZE + 1;
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
  }

  drawMaze() {
    const { ctx, maze } = this;

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cells and walls
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        const cell = maze.getCell(x, y);
        const cellX = x * CELL_SIZE;
        const cellY = y * CELL_SIZE;

        // Draw cell background (start and end points)
        if (x === maze.start.x && y === maze.start.y) {
          ctx.fillStyle = START_COLOR;
          ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
        } else if (x === maze.end.x && y === maze.end.y) {
          ctx.fillStyle = END_COLOR;
          ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
        } else if (cell.visited && !this.isPlaying) {
          ctx.fillStyle = VISITED_COLOR;
          ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
        }

        // Draw walls
        ctx.strokeStyle = WALL_COLOR;
        ctx.lineWidth = 2;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(cellX, cellY);
          ctx.lineTo(cellX + CELL_SIZE, cellY);
          ctx.stroke();
        }

        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(cellX + CELL_SIZE, cellY);
          ctx.lineTo(cellX + CELL_SIZE, cellY + CELL_SIZE);
          ctx.stroke();
        }

        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(cellX, cellY + CELL_SIZE);
          ctx.lineTo(cellX + CELL_SIZE, cellY + CELL_SIZE);
          ctx.stroke();
        }

        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(cellX, cellY);
          ctx.lineTo(cellX, cellY + CELL_SIZE);
          ctx.stroke();
        }
      }
    }

    // Draw solution path if available
    if (this.solver && this.solver.solution.length > 0 && !this.isPlaying) {
      ctx.strokeStyle = PATH_COLOR;
      ctx.lineWidth = CELL_SIZE / 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const start = this.solver.solution[0];
      ctx.moveTo(
        start.x * CELL_SIZE + CELL_SIZE / 2,
        start.y * CELL_SIZE + CELL_SIZE / 2,
      );

      for (let i = 1; i < this.solver.solution.length; i++) {
        const point = this.solver.solution[i];
        ctx.lineTo(
          point.x * CELL_SIZE + CELL_SIZE / 2,
          point.y * CELL_SIZE + CELL_SIZE / 2,
        );
      }

      ctx.stroke();
    }

    // Draw player in play mode
    if (this.isPlaying) {
      const { x, y } = this.maze.playerPos;
      ctx.fillStyle = PLAYER_COLOR;
      ctx.beginPath();
      ctx.arc(
        x * CELL_SIZE + CELL_SIZE / 2,
        y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  solveMaze() {
    if (!this.maze) {
      this.setStatusText("Generate a maze first!");
      return;
    }

    // Stop playing mode if active
    this.stopPlaying();

    // Get selected algorithm
    const algorithmSelect = document.getElementById("algorithm");
    const algorithm = algorithmSelect.value;

    // Reset maze visited status
    this.maze.resetVisited();

    // Solve with selected algorithm
    let solved = false;

    switch (algorithm) {
      case "dfs":
        solved = this.solver.solveDFS();
        break;
      case "bfs":
        solved = this.solver.solveBFS();
        break;
      case "astar":
        solved = this.solver.solveAStar();
        break;
    }

    if (solved) {
      this.setStatusText(
        `Maze solved using ${this.getAlgorithmName(algorithm)}! Path length: ${this.solver.solution.length}`,
      );
      this.animateSolution();
    } else {
      this.setStatusText("No solution found!");
    }
  }

  getAlgorithmName(algorithm) {
    switch (algorithm) {
      case "dfs":
        return "Depth-First Search";
      case "bfs":
        return "Breadth-First Search";
      case "astar":
        return "A* Algorithm";
      default:
        return algorithm;
    }
  }

  animateSolution() {
    // Cancel any ongoing animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    let visitedIndex = 0;
    let pathIndex = 0;
    const visited = [...this.solver.path];
    const solution = [...this.solver.solution];

    // Reset solution
    this.solver.solution = [];

    const animate = () => {
      // Visualize visited cells
      if (visitedIndex < visited.length) {
        const cell = visited[visitedIndex];
        this.maze.getCell(cell.x, cell.y).visited = true;
        visitedIndex++;
      }
      // Visualize solution path
      else if (pathIndex < solution.length) {
        this.solver.solution.push(solution[pathIndex]);
        pathIndex++;
      }

      this.drawMaze();

      if (visitedIndex < visited.length || pathIndex < solution.length) {
        this.animationId = requestAnimationFrame(animate);
      }
    };

    animate();
  }

  playMaze() {
    if (!this.maze) {
      this.setStatusText("Generate a maze first!");
      return;
    }

    // Cancel any ongoing animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Reset maze visited status and player position
    this.maze.resetVisited();
    this.maze.playerPos = { x: this.maze.start.x, y: this.maze.start.y };

    // Clear solution
    if (this.solver) {
      this.solver.solution = [];
    }

    // Set play mode
    this.isPlaying = true;

    // Start timer
    this.startTime = Date.now();
    this.elapsedTime = 0;

    // Update timer display
    this.timerInterval = setInterval(() => {
      this.elapsedTime = (Date.now() - this.startTime) / 1000;
      document.getElementById("timer").textContent =
        `Time: ${this.formatTime(this.elapsedTime)}s`;
    }, 100);

    this.setStatusText(
      "Use arrow keys to navigate the maze from the green start to the red end.",
    );
    this.drawMaze();
  }

  stopPlaying() {
    this.isPlaying = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds) {
    return seconds.toFixed(1);
  }

  setStatusText(text) {
    document.getElementById("status-text").textContent = text;
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  const app = new MazeApp();
  // Generate a maze on page load
  setTimeout(() => {
    app.generateMaze();
  }, 100);
});
