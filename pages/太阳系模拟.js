let celestialBodies = [];
let selectedBody = null;
let centerX = 0;
let centerY = 0;
let zoomLevel = 1.0;
let speedInput;

let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 生成星空背景
  for(let i = 0; i < 2000; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }

  celestialBodies = [
    {
      name: 'Sun',
      diameter: 20,
      orbitRadius: 0,
      color: '#ffcc00',
      angularVelocity: 0,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Mercury',
      diameter: 3,
      orbitRadius: 50,
      color: '#8c8c8c',
      angularVelocity: 0.01,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Venus',
      diameter: 6,
      orbitRadius: 100,
      color: '#cc6600',
      angularVelocity: 0.008,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Earth',
      diameter: 6,
      orbitRadius: 150,
      color: '#2266cc',
      angularVelocity: 0.005,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Mars',
      diameter: 4,
      orbitRadius: 200,
      color: '#cc2200',
      angularVelocity: 0.004,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Jupiter',
      diameter: 15,
      orbitRadius: 280,
      color: '#ccaa66',
      angularVelocity: 0.003,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Saturn',
      diameter: 12,
      orbitRadius: 350,
      color: '#ffdd99',
      angularVelocity: 0.002,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Uranus',
      diameter: 9,
      orbitRadius: 400,
      color: '#66ccff',
      angularVelocity: 0.0015,
      angle: 0,
      x: 0,
      y: 0
    },
    {
      name: 'Neptune',
      diameter: 8,
      orbitRadius: 450,
      color: '#3366ff',
      angularVelocity: 0.001,
      angle: 0,
      x: 0,
      y: 0
    }
  ];

  // UI elements
  speedInput = createInput('1.0');
  speedInput.position(10, 10);

  const zoomIn = createButton('+');
  zoomIn.position(10, 30);
  zoomIn.mousePressed(() => { zoomLevel *= 1.1; });

  const zoomOut = createButton('-');
  zoomOut.position(50, 30);
  zoomOut.mousePressed(() => { zoomLevel *= 0.9; });
}

function draw() {
  background(0);
  
  // 绘制星空
  fill(255);
  noStroke();
  for(let star of stars) {
    ellipse(star.x, star.y, star.size, star.size);
  }

  // Update positions
  const speed = parseFloat(speedInput.value()) || 1.0;
  for (const body of celestialBodies) {
    if (body.angularVelocity !== 0) {
      body.angle += body.angularVelocity * speed;
    }
    body.x = body.orbitRadius * cos(body.angle);
  body.y = body.orbitRadius * sin(body.angle);
}

if (selectedBody) {
  centerX = selectedBody.x;
  centerY = selectedBody.y;
}

push();
  translate(width/2, height/2);
  scale(zoomLevel);
  translate(-centerX, -centerY);

  // Draw orbits
  stroke(255);
  noFill();
  for (const body of celestialBodies) {
    if (body.orbitRadius > 0) {
      ellipse(0, 0, 2 * body.orbitRadius, 2 * body.orbitRadius);
    }
  }

  // Draw celestial bodies
  for (const body of celestialBodies) {
    const displayedDiameter = Math.max(body.diameter, 10);
    fill(body.color);
    ellipse(body.x, body.y, displayedDiameter, displayedDiameter);
  }

  // Draw labels
  if (selectedBody) {
    const displayedRadius = Math.max(selectedBody.diameter, 10) / 2;
    fill(255);
    text(selectedBody.name, selectedBody.x, selectedBody.y - displayedRadius - 10);
  }

  pop();
}

function mousePressed() {
  const mx = mouseX;
  const my = mouseY;

  // Convert to world coordinates
  const worldX = (mx - width/2) / zoomLevel + centerX;
  const worldY = (my - height/2) / zoomLevel + centerY;

  // Check collision
  for (const body of celestialBodies) {
    const dx = worldX - body.x;
    const dy = worldY - body.y;
    const distance = sqrt(dx*dx + dy*dy);
    const displayedRadius = Math.max(body.diameter, 10)/2;

    if (distance <= displayedRadius) {
      selectedBody = body;
      centerX = body.x;
      centerY = body.y;
      return;
    }
  }
  selectedBody = null;
}
