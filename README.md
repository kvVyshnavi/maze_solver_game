Maze Solver Game
Interactive maze visualizer and solver built with HTML, CSS and JavaScript.

A browser-based app that generates mazes and visualizes pathfinding algorithms (BFS, DFS, A*). Use it to learn how different algorithms explore and find paths through mazes.

Demo: (Add GitHub Pages or live demo URL here)

Features

Generate random mazes (multiple generation algorithms).
Visualize pathfinding algorithms: Breadth-First Search (BFS), Depth-First Search (DFS), A* (with configurable heuristics).
Step-by-step visualization and speed control.
Place start and end points, draw/erase walls with mouse.
Clear, reset, and export maze (optional).
Screenshot

Add a screenshot here (e.g., /assets/screenshot.png)
Getting started

Prerequisites

Modern web browser (Chrome, Firefox, Edge, Safari).
(Optional) Node.js/npm if you want to use a local static server.
Run locally

Clone the repo: git clone https://github.com/kvVyshnavi/maze_solver_game.git
Open the project folder: cd maze_solver_game
Open index.html in your browser:
Double-click index.html, or
Serve with a simple server:
Python 3: python -m http.server 8000
Node (serve): npx serve Then open http://localhost:8000 in your browser.
If the project uses a build tool, update these instructions accordingly.

Usage / Controls

Click a cell to toggle wall / floor (or use a brush tool if provided).
Click "Set Start" then a cell to place the start.
Click "Set End" then a cell to place the target.
Choose an algorithm (BFS / DFS / A*) from the UI.
Click "Start" to begin the visualization.
Use "Pause", "Step", or "Reset" to control the run.
Speed slider: slow → fast visualization.
Generate Maze: choose a generation algorithm and click "Generate".
Algorithms (short notes)

BFS (Breadth-First Search): guaranteed shortest path in an unweighted grid — explores level by level.
DFS (Depth-First Search): explores deeply first — not guaranteed shortest path.
A* Search: uses a heuristic (e.g., Manhattan distance) to guide search — faster for many cases and produces shortest path given admissible heuristic.
Example complexity

BFS / DFS: O(V + E) time (for grid, proportional to number of cells).
A*: depends on heuristic quality; worst-case similar to BFS but typically faster.
Project structure (example)

index.html — main HTML file and UI.
css/
styles.css — styling and layout.
js/
app.js — main UI and event handling.
grid.js — grid/cell data structures and utilities.
algorithms.js — BFS, DFS, A* implementations.
mazeGenerator.js — maze generation algorithms (recursive backtracker, Prim-like, etc.)
utils.js — helpers (timer, rendering).
assets/ — images, icons, screenshots.
Development

Use consistent formatting (Prettier / ESLint recommended).
To add features:
Create a new branch: git checkout -b feat/your-feature
Implement and test locally.
Open a pull request for review.
Contributing Contributions, issues and feature requests are welcome! Please follow these steps:

Fork the repo.
Create a branch for your change.
Submit a pull request describing your changes.
Issues If you find a bug or want to request a feature, please open an issue with steps to reproduce and expected behavior.

License This project is licensed under the MIT License. See LICENSE for details. (Change if you prefer a different license.)

Author

kvVyshnavi — https://github.com/kvVyshnavi
Acknowledgements

Pathfinding algorithm references and visualizer inspirations (e.g., Red Blob Games, PathFinding.js).
Any libraries or resources you used.
Tips for improving this README

Add a live demo URL (GitHub Pages).
Include screenshots and GIFs showing algorithm visualization.
Add performance notes for large grids and recommended grid sizes.
Provide code examples for extending algorithms or serialization/export of maze data.
