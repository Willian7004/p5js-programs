let circles = [];
let enableGravity;
let enableTrail;
let enableColorChange;

class Circle {
  constructor() {
    this.radius = 15;
    this.pos = createVector();
    this.vel = p5.Vector.random2D().mult(100/60);
    this.color = color(random(200,255), random(200,255), random(200,255));
    
    // 生成不重叠位置
    let isValid = false;
    while(!isValid) {
      this.pos.x = random(this.radius, width - this.radius);
      this.pos.y = random(this.radius, height - this.radius);
      isValid = this.checkValidPosition();
    }
  }

  checkValidPosition() {
    for(let other of circles) {
      if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < this.radius + other.radius) {
        return false;
      }
    }
    return true;
  }

  update() {
    // 应用重力
    if (enableGravity.checked()) {
      this.vel.y += 20/60;
    }

    this.pos.add(this.vel);
    
    // 边界碰撞
    if (this.pos.x < this.radius || this.pos.x > width - this.radius) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, this.radius, width - this.radius);
      if (enableColorChange.checked()) this.color = color(random(200,255), random(200,255), random(200,255));
    }
    if (this.pos.y < this.radius || this.pos.y > height - this.radius) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.radius, height - this.radius);
      if (enableColorChange.checked()) this.color = color(random(200,255), random(200,255), random(200,255));
    }
  }

  checkCollisions() {
    for(let other of circles) {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < this.radius + other.radius) {
          // 弹性碰撞计算
          let collision = p5.Vector.sub(other.pos, this.pos);
          let angle = collision.heading();
          let speed1 = this.vel.mag();
          let speed2 = other.vel.mag();
          
          this.vel = p5.Vector.fromAngle(angle + PI).mult(speed2);
          other.vel = p5.Vector.fromAngle(angle).mult(speed1);
          
          if (enableColorChange.checked()) {
            this.color = color(random(200,255), random(200,255), random(200,255));
            other.color = color(random(200,255), random(200,255), random(200,255));
          }
        }
      }
    }
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius*2);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  
  // 创建控制面板
  let controls = createDiv();
  controls.position(10, 10);
  
  enableGravity = createCheckbox('重力模拟', false).parent(controls);
  enableTrail = createCheckbox('拖影效果', false).parent(controls);
  enableColorChange = createCheckbox('碰撞变色', false).parent(controls);

  // 初始化40个圆
  for(let i = 0; i < 40; i++) {
    circles.push(new Circle());
  }
}

function draw() {
  // 处理拖影效果
  if (enableTrail.checked()) {
    fill(0, 25);
    rect(0, 0, width, height);
  } else {
    background(0);
  }

  // 更新物理
  for(let circle of circles) {
    circle.update();
    circle.checkCollisions();
    circle.draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
