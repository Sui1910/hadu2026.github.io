// ============ COUNTDOWN LOGIC ============
const targetDate = new Date('2026-01-01T00:00:00').getTime();
const countdownScreen = document.getElementById('countdown-screen');
const fireworkScreen = document.getElementById('firework-screen');
const startButton = document.getElementById('start-button');

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    startButton.classList.add('show');
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============ TEXT LINES ============
const textLines = [
  { text: "ylx", delay: 1500 },
  { text: "下一站2026<br>TRẠM TIẾP THEO：2026", delay: 1200 },
  { text: "祝我们马到成功!<br>Chúc Bạn và tôi mã đảo thành công!", delay: 1300 },
  { text: "一顺百順<br>Mọi việc suôn sẻ, thuận buồm xuôi gió", delay: 1300 },
  { text: "平安喜乐<br>Bình an và hạnh phúc", delay: 1300 },
  { text: "心想事成<br>Mọi mong ước đều trở thành hiện thực", delay: 1300 },
  { text: "万事胜意<br>Mọi việc như ý", delay: 1300 },
  { text: "财源滚滚<br>Tài lộc dồi dào", delay: 1300 },
  { text: "好运连连<br>May mắn nối tiếp may mắn", delay: 1200 },
  { text: "2025你若不离<br>2025 nếu bạn không rời xa", delay: 1200 },
  { text: "2026我们继续<br>2026 chúng ta tiếp tục cùng nhau", delay: 1200 },
  { text: "新年快乐，平安喜乐<br>Chúc Mừng Năm Mới - Vui Vẻ , Bình An !!", delay: 10000 }
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
function playCustomAudio(delay = 1500) {
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

// ============ FIREWORK LOGIC (giữ nguyên) ============
/* ...giữ nguyên toàn bộ code fireworks của cậu như cũ... */

