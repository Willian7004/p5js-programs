let grids = [];
let isLoaded = false;
let leftMargin;
let topMargin;
let loadedCount = 0;
let totalImages = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#964B00');

  const gridWidth = 240;
  const gridHeight = 160;

  const cols = floor(windowWidth / gridWidth);
  const rows = floor(windowHeight / gridHeight);
  totalImages = cols * rows;

  const totalWidth = cols * gridWidth;
  const totalHeight = rows * gridHeight;

  leftMargin = (windowWidth - totalWidth) / 2;
  topMargin = (windowHeight - totalHeight) / 2;

  grids = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const gridX = leftMargin + x * gridWidth;
      const gridY = topMargin + y * gridHeight;
      
      const dx = random(-24, 24);
      const dy = random(-17, 17);
      const rot = random(-PI/8, PI/8);
      
      // Use CORS proxy and cache busting
      const url = `https://corsproxy.io/?${encodeURIComponent(`https://picsum.photos/240/160?random=${random(1,200)}`)}`;

      loadImage(url, img => {
        grids.push({
          x: gridX + dx,
          y: gridY + dy,
          rotation: rot,
          img: img
        });
        loadedCount++;
        if (loadedCount === totalImages) {
          isLoaded = true;
          // Sort by Y then X for proper drawing order
          grids.sort((a, b) => a.y - b.y || a.x - b.x);
        }
      });
    }
  }
}

function draw() {
  if (isLoaded) {
    background('#964B00');
    grids.forEach(grid => {
      push();
      translate(grid.x, grid.y);
      rotate(grid.rotation);
      image(grid.img, 0, 0);
      pop();
    });
  }
}
