// ============ COUNTUP LOGIC ============

const startDate = new Date('2026-01-01T00:00:00').getTime();
const countdownScreen = document.getElementById('countdown-screen');
const fireworkScreen = document.getElementById('firework-screen');
const startButton = document.getElementById('start-button');

function updateCountdown() {
  const now = new Date().getTime();
  let distance = now - startDate;


  if (distance < 0) distance = 0;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');


  startButton.classList.add('show');
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ============ TEXT LINES ============
const textLines = [
  { text: "ylx-khoavan", delay: 2500 },
  { text: "下一站2026<br>TRẠM TIẾP THEO：2026", delay: 1200 },
  { text: "祝我们马到成功!<br>Chúc Bạn và tôi mã đảo thành công!", delay: 1300 },
  { text: "一顺百順<br>Mọi việc suôn sẻ, thuận buồm xuôi gió", delay: 1300 },
  { text: "平安喜乐<br>Bình an và hạnh phúc", delay: 1300 },
  { text: "心想事成<br>Mọi mong ước đều trở thành hiện thực", delay: 1300 },
  { text: "万事胜意<br>Mọi việc như ý", delay: 1300 },
  { text: "财源滚滚<br>Tài lộc dồi dào", delay: 1300 },
  { text: "好运连连<br>May mắn nối tiếp may mắn", delay: 1200 },
  { text: "2025你若不离<br>2025 nếu bạn không rời xa", delay: 1300 },
  { text: "2026我们继续<br>2026 chúng ta tiếp tục cùng nhau", delay: 1300 },
  { text: "新年快乐，平安喜乐<br>Chúc Mừng Năm Mới - Vui Vẻ , Bình An !!", delay: 9000 }
];

const customAudioURL = "../font/ny2.mp3";

// ============ START BUTTON HANDLER ============
startButton.addEventListener("click", () => {
  countdownScreen.style.display = "none";
  const frame = document.getElementById("firework-frame");
  frame.src = "../firework/firework.html";
  frame.style.display = "block";

  setTimeout(() => {
    try { frame.contentWindow.postMessage({ type: 'reduceVolume', volume: 0.3 }, '*'); } 
    catch (e) { console.log('Cannot reduce firework volume yet'); }
  }, 500);

  playCustomAudio();
  showTextAnimation();
});

// ============ CUSTOM AUDIO ============
function playCustomAudio(delay = 2500) {
  setTimeout(() => {
    const audio1 = new Audio(customAudioURL);
    audio1.volume = 0.5;
    audio1.addEventListener('ended', () => {
      const audio2 = new Audio("../font/ny3.mp3");
      audio2.volume = 0.2;
      audio2.play().catch(err => console.log('Audio2 play failed:', err));
    });
    audio1.play().catch(err => console.log('Audio1 play failed:', err));
  }, delay);
}

// ============ TEXT ANIMATION ============
function showTextAnimation() {
  const textContainer = document.createElement('div');
  textContainer.id = 'text-animation-container';
  textContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    text-align: center;
    pointer-events: none;
    max-width: 90vw;
    word-wrap: break-word;
  `;
  document.body.appendChild(textContainer);

  let currentLine = 0;

  function showNextLine() {
    if (currentLine >= textLines.length) {
      setTimeout(() => textContainer.remove(), 100);
      return;
    }

    const line = textLines[currentLine];
    const textElement = document.createElement('div');
    textElement.className = 'animated-text';
    textElement.innerHTML = line.text;
    textElement.style.cssText = `
      font-size: clamp(1.2em, 5vw, 4em);
      font-weight: bold;
      color: #ffffff;
      text-shadow:
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 20px rgba(255, 215, 0, 0.6),
        0 0 30px rgba(255, 215, 0, 0.4),
        2px 2px 4px rgba(0,0,0,0.5);
      margin: 20px 0;
      opacity: 0;
      animation: fadeInOut ${line.delay/1000}s ease-in-out forwards;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    textContainer.appendChild(textElement);

    setTimeout(() => {
      textElement.remove();
      currentLine++;
      showNextLine();
    }, line.delay);
  }

  showNextLine();
}

// ============ CSS ANIMATION ============
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(20px) scale(0.9); }
    20% { opacity: 1; transform: translateY(0) scale(1); }
    80% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
  }

  .animated-text { white-space: normal; }

  @media (max-width: 768px) {
    .animated-text { font-size: 4vw !important; }
  }
`;
document.head.appendChild(style);


// ============ FIREWORK LOGIC ============
const IS_MOBILE = window.innerWidth <= 640;
const IS_DESKTOP = window.innerWidth > 800;
const MAX_WIDTH = 7680;
const MAX_HEIGHT = 4320;
const GRAVITY = 0.9;
let simSpeed = 1;
let stageW, stageH;
let quality = 2;
let isPaused = true;
let soundEnabled = false;
let autoLaunchTime = 0;

const COLOR = {
  Red: '#ff0043',
  Green: '#14fc56',
  Blue: '#1e7fff',
  Purple: '#e60aff',
  Gold: '#ffbf36',
  White: '#ffffff'
};

const INVISIBLE = '_INVISIBLE_';
const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

const trailsStage = new Stage('trails-canvas');
const mainStage = new Stage('main-canvas');

const COLOR_NAMES = Object.keys(COLOR);
const COLOR_CODES = COLOR_NAMES.map(colorName => COLOR[colorName]);
const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE];

const COLOR_TUPLES = {};
COLOR_CODES.forEach(hex => {
  COLOR_TUPLES[hex] = {
    r: parseInt(hex.substr(1, 2), 16),
    g: parseInt(hex.substr(3, 2), 16),
    b: parseInt(hex.substr(5, 2), 16),
  };
});

function randomColor() {
  return COLOR_CODES[Math.random() * COLOR_CODES.length | 0];
}

function createParticleCollection() {
  const collection = {};
  COLOR_CODES_W_INVIS.forEach(color => {
    collection[color] = [];
  });
  return collection;
}

const Star = {
  drawWidth: 3,
  airDrag: 0.98,
  airDragHeavy: 0.992,
  active: createParticleCollection(),
  _pool: [],
  
  add(x, y, color, angle, speed, life, speedOffX, speedOffY) {
    const instance = this._pool.pop() || {};
    instance.visible = true;
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin(angle) * speed + (speedOffX || 0);
    instance.speedY = Math.cos(angle) * speed + (speedOffY || 0);
    instance.life = life;
    instance.fullLife = life;
    this.active[color].push(instance);
    return instance;
  },

  returnInstance(instance) {
    instance.onDeath && instance.onDeath(instance);
    instance.onDeath = null;
    this._pool.push(instance);
  }
};

const Spark = {
  drawWidth: 1,
  airDrag: 0.9,
  active: createParticleCollection(),
  _pool: [],
  
  add(x, y, color, angle, speed, life) {
    const instance = this._pool.pop() || {};
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin(angle) * speed;
    instance.speedY = Math.cos(angle) * speed;
    instance.life = life;
    this.active[color].push(instance);
    return instance;
  },

  returnInstance(instance) {
    this._pool.push(instance);
  }
};

const BurstFlash = {
  active: [],
  _pool: [],
  add(x, y, radius) {
    const instance = this._pool.pop() || {};
    instance.x = x;
    instance.y = y;
    instance.radius = radius;
    this.active.push(instance);
    return instance;
  },
  returnInstance(instance) {
    this._pool.push(instance);
  }
};

const soundManager = {
  ctx: new (window.AudioContext || window.webkitAudioContext)(),
  baseURL: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/',
  sources: {
    lift: {
      volume: 1,
      playbackRateMin: 0.85,
      playbackRateMax: 0.95,
      fileNames: ['lift1.mp3', 'lift2.mp3', 'lift3.mp3']
    },
    burst: {
      volume: 1,
      playbackRateMin: 0.8,
      playbackRateMax: 0.9,
      fileNames: ['burst1.mp3', 'burst2.mp3']
    }
  },

  preload() {
    const allPromises = [];
    Object.keys(this.sources).forEach(type => {
      const source = this.sources[type];
      const promises = source.fileNames.map(fileName => {
        return fetch(this.baseURL + fileName)
          .then(r => r.arrayBuffer())
          .then(data => new Promise(resolve => {
            this.ctx.decodeAudioData(data, resolve);
          }));
      });
      Promise.all(promises).then(buffers => {
        source.buffers = buffers;
      });
      allPromises.push(...promises);
    });
    return Promise.all(allPromises);
  },

  resumeAll() {
    this.ctx.resume();
  },

  playSound(type, scale = 1) {
    if (!soundEnabled) return;
    const source = this.sources[type];
    if (!source || !source.buffers) return;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = source.volume * scale;
    const buffer = source.buffers[Math.floor(Math.random() * source.buffers.length)];
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    bufferSource.start(0);
  }
};

class Shell {
  constructor(size = 3) {
    this.shellSize = size;
    this.spreadSize = 300 + size * 100;
    this.starLife = 900 + size * 200;
    this.starCount = Math.max(30, size * 15);
    this.color = randomColor();
  }

  launch(x, y) {
    const width = stageW;
    const height = stageH;
    const launchX = x * width;
    const launchY = height;
    const burstY = y * height * 0.5;
    const launchDistance = launchY - burstY;
    const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);

    const comet = Star.add(
      launchX, launchY, COLOR.White,
      Math.PI, launchVelocity, launchVelocity * 400
    );
    comet.heavy = true;
    comet.onDeath = () => this.burst(comet.x, comet.y);
    soundManager.playSound('lift');
  }

  burst(x, y) {
    const speed = this.spreadSize / 96;
    const count = this.starCount;
    const R = 0.5 * Math.sqrt(count / Math.PI);
    const C = 2 * R * Math.PI;
    const C_HALF = C / 2;

    for (let i = 0; i <= C_HALF; i++) {
      const ringAngle = i / C_HALF * PI_HALF;
      const ringSize = Math.cos(ringAngle);
      const partsPerRing = C * ringSize;
      const angleInc = PI_2 / partsPerRing;

      for (let j = 0; j < partsPerRing; j++) {
        const angle = angleInc * j + Math.random() * angleInc;
        Star.add(x, y, this.color, angle, speed * ringSize, this.starLife);
      }
    }

    BurstFlash.add(x, y, this.spreadSize / 4);
    soundManager.playSound('burst');
  }
}

function handleResize() {
  const w = Math.min(window.innerWidth, MAX_WIDTH);
  const h = Math.min(window.innerHeight, MAX_HEIGHT);
  trailsStage.resize(w, h);
  mainStage.resize(w, h);
  stageW = w;
  stageH = h;
}

let currentFrame = 0;

function update(frameTime, lag) {
  if (isPaused) return;

  currentFrame++;
  const timeStep = frameTime * simSpeed;
  const speed = simSpeed * lag;

  autoLaunchTime -= timeStep;
  if (autoLaunchTime <= 0) {
    const shell = new Shell(Math.random() * 3 + 2);
    shell.launch(Math.random() * 0.6 + 0.2, Math.random() * 0.3 + 0.5);
    autoLaunchTime = 900 + Math.random() * 600;
  }

  const gAcc = timeStep / 1000 * GRAVITY;
  const starDrag = 1 - (1 - Star.airDrag) * speed;

  COLOR_CODES_W_INVIS.forEach(color => {
    const stars = Star.active[color];
    for (let i = stars.length - 1; i >= 0; i--) {
      const star = stars[i];
      star.life -= timeStep;
      if (star.life <= 0) {
        stars.splice(i, 1);
        Star.returnInstance(star);
      } else {
        star.prevX = star.x;
        star.prevY = star.y;
        star.x += star.speedX * speed;
        star.y += star.speedY * speed;
        star.speedX *= starDrag;
        star.speedY *= starDrag;
        star.speedY += gAcc;
      }
    }

    const sparks = Spark.active[color];
    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      spark.life -= timeStep;
      if (spark.life <= 0) {
        sparks.splice(i, 1);
        Spark.returnInstance(spark);
      } else {
        spark.prevX = spark.x;
        spark.prevY = spark.y;
        spark.x += spark.speedX * speed;
        spark.y += spark.speedY * speed;
        spark.speedX *= 0.9;
        spark.speedY *= 0.9;
        spark.speedY += gAcc;
      }
    }
  });

  render(speed);
}

function render(speed) {
  const { dpr } = mainStage;
  const trailsCtx = trailsStage.ctx;
  const mainCtx = mainStage.ctx;

  trailsCtx.scale(dpr, dpr);
  mainCtx.scale(dpr, dpr);

  trailsCtx.fillStyle = `rgba(0, 0, 0, ${0.175 * speed})`;
  trailsCtx.fillRect(0, 0, stageW, stageH);
  mainCtx.clearRect(0, 0, stageW, stageH);

  while (BurstFlash.active.length) {
    const bf = BurstFlash.active.pop();
    const grad = trailsCtx.createRadialGradient(bf.x, bf.y, 0, bf.x, bf.y, bf.radius);
    grad.addColorStop(0.024, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.125, 'rgba(255, 160, 20, 0.2)');
    grad.addColorStop(0.32, 'rgba(255, 140, 20, 0.11)');
    grad.addColorStop(1, 'rgba(255, 120, 20, 0)');
    trailsCtx.fillStyle = grad;
    trailsCtx.fillRect(bf.x - bf.radius, bf.y - bf.radius, bf.radius * 2, bf.radius * 2);
    BurstFlash.returnInstance(bf);
  }

  trailsCtx.globalCompositeOperation = 'lighten';
  trailsCtx.lineWidth = Star.drawWidth;
  trailsCtx.lineCap = 'round';
  mainCtx.strokeStyle = '#fff';
  mainCtx.lineWidth = 1;

  COLOR_CODES.forEach(color => {
    const stars = Star.active[color];
    trailsCtx.strokeStyle = color;
    trailsCtx.beginPath();
    mainCtx.beginPath();
    stars.forEach(star => {
      if (star.visible) {
        trailsCtx.moveTo(star.x, star.y);
        trailsCtx.lineTo(star.prevX, star.prevY);
        mainCtx.moveTo(star.x, star.y);
        mainCtx.lineTo(star.x - star.speedX * 1.6, star.y - star.speedY * 1.6);
      }
    });
    trailsCtx.stroke();
    mainCtx.stroke();
  });

  trailsCtx.setTransform(1, 0, 0, 1, 0, 0);
  mainCtx.setTransform(1, 0, 0, 1, 0, 0);
}

soundManager.preload();
handleResize();



