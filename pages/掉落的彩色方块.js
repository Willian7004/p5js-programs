let gridSize = 20;
let cols, rows;
let colors = [];
let fallingCells = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);
  initColors();
}

function initColors() {
  colors = [];
  for (let i = 0; i < rows; i++) {
    colors[i] = [];
    for (let j = 0; j < cols; j++) {
      colors[i][j] = color(random(255), random(255), random(255));
    }
  }
}

function draw() {
  background(120);
  
  // 绘制颜色格子
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      fill(colors[i][j]);
      rect(j * gridSize, i * gridSize, gridSize, gridSize);
    }
  }

  // 处理下落动画
  handleFallingCells();
}

function handleFallingCells() {
  let newColors = []; // 临时存储新颜色值
  
  // 先处理所有下落动画
  for (let cell of fallingCells) {
    cell.currentY += cell.speed;
    cell.speed += 0.4;
    
    // 绘制下落中的格子（使用原始颜色）
    fill(colors[cell.startRow][cell.col]);
    rect(cell.col * gridSize, cell.currentY, gridSize, gridSize);
  }

  // 收集需要更新的颜色（从下往上处理）
  for (let cell of fallingCells) {
    if (cell.currentY >= cell.targetRow * gridSize) {
      if (!newColors[cell.col]) newColors[cell.col] = [];
      newColors[cell.col][cell.targetRow] = colors[cell.startRow][cell.col];
    }
  }

  // 统一更新颜色数组并移除已完成的下落单元
  fallingCells = fallingCells.filter(cell => {
    if (cell.currentY >= cell.targetRow * gridSize) {
      // 更新目标行颜色
      if (newColors[cell.col] && newColors[cell.col][cell.targetRow]) {
        colors[cell.targetRow][cell.col] = newColors[cell.col][cell.targetRow];
      }
      // 如果是顶部的格子，生成新颜色
      if (cell.startRow === 0) {
        colors[0][cell.col] = color(random(255), random(255), random(255));
      }
      return false; // 过滤掉已完成的
    }
    return true;
  });
}

function mousePressed() {
  handleClick();
}

function mouseDragged() {
  handleClick();
}

function handleClick() {
  let col = floor(mouseX / gridSize);
  let row = floor(mouseY / gridSize);
  
  // 影响周围9个格子（3x3区域）
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let c = col + j;
      let r = row + i;
      
      if (c >= 0 && c < cols && r >= 0 && r < rows) {
        // 设置当前格子为黑色
        colors[r][c] = color(0);
        
        // 获取该格子上方的所有格子
        for (let y = r - 1; y >= 0; y--) {
          fallingCells.push({
            col: c,
            startRow: y,
            targetRow: Math.min(y + 3, rows - 1), // 确保不超过画布底部
            currentY: y * gridSize,
            speed: 0
          });
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);
  initColors();
}
