let sunAngle = -1;
let rotationSpeed = 10;
let bgColor;
let groundColor;
let input;

function setup() {
  createCanvas(windowWidth, windowHeight);
  input = createInput('30');
  input.position(20, 20);
  input.size(60);
}

function draw() {
  // 更新旋转速度
  rotationSpeed = parseFloat(input.value()) || 30;
  
  // 计算天体位置
  sunAngle += radians(rotationSpeed) * deltaTime / 1000;
  if (sunAngle > TWO_PI) sunAngle -= TWO_PI;
  
  // 计算颜色过渡
  let angleDegrees = degrees(sunAngle+1) % 360;
  let sunHeight = sin(sunAngle+1);
  
  // 背景颜色渐变（最终修正版）
  const isDawn = angleDegrees > 350 || angleDegrees < 20;
  const isDusk = angleDegrees > 160 && angleDegrees < 190;
  const isDay = !isDawn && !isDusk && angleDegrees < 180;
  
  if (isDawn || isDusk) { // 黎明/黄昏
    const dawnProgress = map(angleDegrees, 350, 10, 0, 1, true);
    const duskProgress = map(angleDegrees, 170, 190, 0, 1);
    const progress = isDawn ? dawnProgress : duskProgress;
    
    bgColor = lerpColor(
      color(255, 165, 0), 
      isDawn ? color(135, 206, 235) : color(0),
      progress
    );
    groundColor = lerpColor(
      color(218, 165, 32),
      isDawn ? color(144, 238, 144) : color(0, 50, 0),
      progress
    );
  } else if (isDay) { // 白天
    bgColor = color(135, 206, 235);
    groundColor = color(144, 238, 144);
  } else { // 夜晚
    bgColor = color(0);
    groundColor = color(0, 50, 0);
  }
  
  // 绘制天空
  background(bgColor);
  
  // 设置旋转中心（提升坐标系）
  translate(width/2, height * 0.9);
  rotate(sunAngle - HALF_PI);
  translate(0, -height * 0.1);
  
  // 绘制天体（最终可见性优化）
  let orbitRadius = (width + height) / 3.5;
  strokeWeight(2);
  push();
  translate(0, -height * 0.15); // 提升天体绘制高度
  
  // 绘制星空（单次初始化版）
  if (!isDay && !window.stars) {
    window.stars = [];
    let maxStarDist = dist(0, 0, width, height);
    for (let i = 0; i < 1800; i++) {
      window.stars.push({
        x: random(-maxStarDist, maxStarDist),
        y: random(-maxStarDist , maxStarDist ),
        size: random(1, 5),
        alpha: random(150, 255)
      });
    }
  }
  
  if (window.stars) {
    window.stars.forEach(star => {
      fill(255, star.alpha);
      noStroke();
      circle(star.x, star.y, star.size);
    });
    
    // 清除星空缓存当进入白天
    if (isDay) {
      window.stars = null;
    }
  }
  if (angleDegrees < 180) { // 太阳
    fill(255, 220, 50);
    ellipse(orbitRadius, 0, 30);
  } else { // 月亮
    fill(245);
    stroke(200);
    arc(-orbitRadius, 0, 20, 20, 0, PI);
  }
  pop();
  // 重置坐标
  resetMatrix();
  
  // 绘制地面
  fill(groundColor);
  noStroke();
  rect(0, height * 0.85, width, height * 0.15);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 窗口大小变化时重置星空
  if (window.stars) {
    window.stars = null;
  }
}
