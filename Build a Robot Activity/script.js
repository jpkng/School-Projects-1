// Lecture 8 — Project: A Robot
// Simple 2D robot simulation with manual and autonomous mode.

// Canvas setup
const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

// UI
const modeSelect = document.getElementById('modeSelect');
const speedRange = document.getElementById('speedRange');
const resetBtn = document.getElementById('resetBtn');

resetBtn.onclick = () => reset();

const robotImg = new Image();
robotImg.src = "robot.png"; 

const arrowImg = new Image();
arrowImg.src = "arrow.png";

const wallImg = new Image();
wallImg.src = "wall.png";  


let loaded = 0;
[robotImg, arrowImg, wallImg].forEach(img => {
  img.onload = () => {
    console.log("✅ Loaded: " + img.src);
    loaded++;
    if (loaded >= 1) { 
      if (loaded < 3) { 
        console.warn("⚠️ Not all images loaded. Check arrow.png and wall.png files.");
      }
      reset();
      requestAnimationFrame(loop);
    }
  };
  img.onerror = () => {
    console.error("❌ Failed to load " + img.src);
    loaded++;
    if (loaded >= 1) {
      reset();
      requestAnimationFrame(loop);
    }
  };
});

// Robot definition
const robot = {
  x: 120,
  y: 260,
  radius: 18,
  heading: 0,         // radians, 0 = facing right
  speed: 0,           // pixels per update
  angularSpeed: 0,    // radians per update
  maxSpeed: 2.5,
  sensorRange: 150    // pixels
};

// Keys
const keys = { ArrowUp:false, ArrowDown:false, ArrowLeft:false, ArrowRight:false };

// Obstacle(s) — simple rectangle(s)
const obstacles = [
  { x: 450, y: 120, w: 220, h: 60 },
  { x: 480, y: 280, w: 50, h: 160 }
];

// Simulation state
let lastTime = 0;
let mode = 'manual';

// Event listeners
window.addEventListener('keydown', e => {
  if (e.key in keys) { keys[e.key] = true; e.preventDefault(); }
});
window.addEventListener('keyup', e => {
  if (e.key in keys) { keys[e.key] = false; e.preventDefault(); }
});
modeSelect.addEventListener('change', (e) => {
  mode = e.target.value;
});
speedRange.addEventListener('input', (e) => {
  robot.maxSpeed = parseFloat(e.target.value);
});

function reset() {
  robot.x = 120; robot.y = 260; robot.heading = 0; robot.speed = 0; robot.angularSpeed = 0;
  modeSelect.value = 'manual'; mode = 'manual';
  speedRange.value = 2;
  robot.maxSpeed = 2;
}

// Utility: line-rect intersection test
function lineIntersectsRect(x1,y1,x2,y2, rx,ry,rw,rh) {
  function segIntersectsSeg(x1,y1,x2,y2,x3,y3,x4,y4){
    const denom = (y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);
    if (Math.abs(denom) < 1e-6) return false;
    const ua = ((x4-x3)*(y1-y3)-(y4-y3)*(x1-x3))/denom;
    const ub = ((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3))/denom;
    return ua>=0 && ua<=1 && ub>=0 && ub<=1;
  }
  const rx2 = rx+rw, ry2 = ry+rh;
  if (segIntersectsSeg(x1,y1,x2,y2, rx,ry, rx2,ry)) return true;
  if (segIntersectsSeg(x1,y1,x2,y2, rx2,ry, rx2,ry2)) return true;
  if (segIntersectsSeg(x1,y1,x2,y2, rx2,ry2, rx,ry2)) return true;
  if (segIntersectsSeg(x1,y1,x2,y2, rx,ry2, rx,ry)) return true;
  return false;
}

// Sensor
function castSensor() {
  const sx = robot.x;
  const sy = robot.y;
  const ex = sx + Math.cos(robot.heading) * robot.sensorRange;
  const ey = sy + Math.sin(robot.heading) * robot.sensorRange;
  let closest = robot.sensorRange;
  const steps = 200;
  for (let i=1;i<=steps;i++){
    const t = i/steps;
    const px = sx + (ex-sx)*t;
    const py = sy + (ey-sy)*t;
    for (const ob of obstacles) {
      if (px >= ob.x && px <= ob.x+ob.w && py >= ob.y && py <= ob.y+ob.h) {
        const d = Math.hypot(px - sx, py - sy);
        if (d < closest) closest = d;
      }
    }
  }
  return closest;
}

// Autonomous behavior
function autonomousControl(sensorDist) {
  const safe = 40;
  if (sensorDist < safe) {
    robot.angularSpeed = 0.09 + (safe - sensorDist) * 0.004;
    robot.speed = -0.3;
  } else {
    robot.angularSpeed = Math.sin(Date.now()/8000) * 0.01;
    robot.speed = 1.4;
  }
  if (robot.speed > robot.maxSpeed) robot.speed = robot.maxSpeed;
  if (robot.speed < -robot.maxSpeed) robot.speed = -robot.maxSpeed;
}

// Physics
function update(dt) {
  if (mode === 'manual') {
    if (keys.ArrowUp) robot.speed += 0.1;
    else if (keys.ArrowDown) robot.speed -= 0.1;
    else robot.speed *= 0.96;
    if (keys.ArrowLeft) robot.angularSpeed = -0.06;
    else if (keys.ArrowRight) robot.angularSpeed = 0.06;
    else robot.angularSpeed *= 0.6;
    robot.speed = Math.max(-robot.maxSpeed, Math.min(robot.maxSpeed, robot.speed));
  } else {
    const sensorDist = castSensor();
    autonomousControl(sensorDist);
  }

  robot.heading += robot.angularSpeed * dt;
  robot.x += Math.cos(robot.heading) * robot.speed * dt;
  robot.y += Math.sin(robot.heading) * robot.speed * dt;

  if (robot.x < robot.radius) { robot.x = robot.radius; robot.speed *= -0.3; }
  if (robot.x > W - robot.radius) { robot.x = W - robot.radius; robot.speed *= -0.3; }
  if (robot.y < robot.radius) { robot.y = robot.radius; robot.speed *= -0.3; }
  if (robot.y > H - robot.radius) { robot.y = H - robot.radius; robot.speed *= -0.3; }

  for (const ob of obstacles) {
    const pad = robot.radius + 2;
    const insideX = robot.x > ob.x - pad && robot.x < ob.x + ob.w + pad;
    const insideY = robot.y > ob.y - pad && robot.y < ob.y + ob.h + pad;
    if (insideX && insideY) {
      const leftD = Math.abs(robot.x - (ob.x - pad));
      const rightD = Math.abs(robot.x - (ob.x + ob.w + pad));
      const topD = Math.abs(robot.y - (ob.y - pad));
      const botD = Math.abs(robot.y - (ob.y + ob.h + pad));
      const minD = Math.min(leftD,rightD,topD,botD);
      if (minD === leftD) robot.x = ob.x - pad;
      else if (minD === rightD) robot.x = ob.x + ob.w + pad;
      else if (minD === topD) robot.y = ob.y - pad;
      else robot.y = ob.y + ob.h + pad;
      robot.speed *= -0.3;
    }
  }
}

// Drawing
function draw() {
  ctx.clearRect(0,0,W,H);

  // Obstacles (use images if available)
  for (const ob of obstacles) {
    if (wallImg.complete && wallImg.naturalWidth > 0) {
      ctx.drawImage(wallImg, ob.x, ob.y, ob.w, ob.h);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    }
  }

  // Sensor ray
  const sensorDist = castSensor();
  const sx = robot.x;
  const sy = robot.y;
  const ex = sx + Math.cos(robot.heading) * sensorDist;
  const ey = sy + Math.sin(robot.heading) * sensorDist;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.lineWidth = 2;
  ctx.strokeStyle = sensorDist < 60 ? 'orange' : 'green';
  ctx.stroke();

  // Robot body
  ctx.save();
  ctx.translate(robot.x, robot.y);
  ctx.rotate(robot.heading);
  if (robotImg.complete && robotImg.naturalWidth > 0) {
    ctx.drawImage(robotImg, -robot.radius, -robot.radius, robot.radius*2, robot.radius*2);
  } else {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(0, 0, robot.radius, 0, Math.PI*2);
    ctx.fill();
  }
  // Heading arrow
  if (arrowImg.complete && arrowImg.naturalWidth > 0) {
    ctx.drawImage(arrowImg, -10, -robot.radius-20, 20, 20);
  } else {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, -robot.radius-20);
    ctx.lineTo(-5, -robot.radius-10);
    ctx.lineTo(5, -robot.radius-10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Status text
  ctx.fillStyle = '#111';
  ctx.font = '12px Arial';
  ctx.fillText(`Mode: ${mode}`, 10, H - 36);
  ctx.fillText(`Sensor distance: ${sensorDist.toFixed(1)} px`, 10, H - 20);

  ctx.strokeStyle = '#ddd';
  ctx.strokeRect(W-210, H-60, 200, 50);
}

// Main loop
function loop(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min(1.8, (ts - lastTime) / 16.6667);
  lastTime = ts;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}
