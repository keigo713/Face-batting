// FaceBomp ゲーム用 JavaScript
let score = 0;
let timer = 30;
let gameInterval;
let popupTimeout;
let isPlaying = false;
let highScore = 0;

const startBtn = document.getElementById('start-btn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const finalMessage = document.getElementById('final-message');
const holes = document.querySelectorAll('.hole');
const faces = document.querySelectorAll('.face-img');

// ホームラン音声の準備
document.body.insertAdjacentHTML('beforeend', '<audio id="homerun-audio" src="homerun.mp3" preload="auto"></audio>');
const homerunAudio = document.getElementById('homerun-audio');

// 褒めコメント
const praiseComments = [
  'ナイス！',
  'すごい！',
  'ホームラン王！',
  '神反応！',
  '伝説級！',
  '天才！',
  'プロ級！',
  '無双！',
  '最高記録更新！',
];

function getPraise(score) {
  if (score >= 30) return praiseComments[8];
  if (score >= 25) return praiseComments[7];
  if (score >= 20) return praiseComments[6];
  if (score >= 15) return praiseComments[5];
  if (score >= 12) return praiseComments[4];
  if (score >= 9) return praiseComments[3];
  if (score >= 6) return praiseComments[2];
  if (score >= 3) return praiseComments[1];
  return praiseComments[0];
}

function resetGame() {
  score = 0;
  timer = 30;
  scoreDisplay.textContent = 'スコア: 0';
  timerDisplay.textContent = 'タイマー: 30';
  finalMessage.textContent = '';
  finalMessage.classList.add('hidden');
  faces.forEach(face => face.classList.add('hidden'));
}

const faceImages = [
  { src: '細川成也.jpeg', alt: '細川成也', weight: 0.5 },
  { src: 'My picture.jpeg', alt: 'My picture', weight: 0.3 },
  { src: '細川成也イラスト.jpeg', alt: '細川成也イラスト', weight: 0.2 }
];

function getWeightedRandomImage() {
  const r = Math.random();
  let sum = 0;
  for (const img of faceImages) {
    sum += img.weight;
    if (r < sum) return img;
  }
  return faceImages[faceImages.length - 1]; // 念のため
}

function startGame() {
  if (isPlaying) return;
  isPlaying = true;
  resetGame();
  startBtn.disabled = true;
  gameInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `タイマー: ${timer}`;
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
  popupFace();
}

function popupFace() {
  faces.forEach(face => face.classList.add('hidden'));
  // ランダムな穴と重み付きランダムな画像を選ぶ
  const idx = Math.floor(Math.random() * holes.length);
  const faceImg = holes[idx].querySelector('.face-img');
  const img = getWeightedRandomImage();
  faceImg.src = img.src;
  faceImg.alt = img.alt;
  faceImg.classList.remove('hidden');
  popupTimeout = setTimeout(() => {
    faceImg.classList.add('hidden');
    if (isPlaying) popupFace();
  }, 1000);
}

faces.forEach(face => {
  face.addEventListener('click', () => {
    if (!face.classList.contains('hidden') && isPlaying) {
      // 得点処理
      let point = 0;
      if (face.getAttribute('src') === 'My picture.jpeg') {
        point = -3;
      } else if (face.getAttribute('src') === '細川成也.jpeg') {
        point = 1;
      } else if (face.getAttribute('src') === '細川成也イラスト.jpeg') {
        point = 3;
      }
      score += point;
      scoreDisplay.textContent = `スコア: ${score}`;
      // ホームラン音再生（再生できない場合はcatchで無視）
      try {
        homerunAudio.currentTime = 0;
        homerunAudio.play();
      } catch (e) {}
      face.classList.add('hidden');
    }
  });
});

function endGame() {
  isPlaying = false;
  clearInterval(gameInterval);
  clearTimeout(popupTimeout);
  faces.forEach(face => face.classList.add('hidden'));
  // 最高記録の保存と表示
  const prevHigh = Number(localStorage.getItem('facebompHighScore') || 0);
  if (score > prevHigh) {
    localStorage.setItem('facebompHighScore', score);
    highScore = score;
  } else {
    highScore = prevHigh;
  }
  // 合計得点に応じたコメント
  let comment = '';
  if (score >= 30) comment = '伝説のバッター！';
  else if (score >= 25) comment = '超プロ級！';
  else if (score >= 20) comment = 'すごすぎ！';
  else if (score >= 15) comment = '絶好調！';
  else if (score >= 10) comment = 'ナイスバッティング！';
  else if (score >= 5) comment = 'いい感じ！';
  else if (score >= 1) comment = 'まずはウォーミングアップ！';
  else comment = 'また挑戦してね！';
  finalMessage.textContent = `ゲーム終了！あなたのスコアは ${score} です\n${comment}\n最高記録: ${highScore}`;
  finalMessage.classList.remove('hidden');
  startBtn.disabled = false;
  // 最高記録表示も更新
  const hs = document.getElementById('high-score');
  if (hs) hs.textContent = `最高記録: ${highScore}`;
}

// ページ読み込み時に最高記録表示
window.addEventListener('DOMContentLoaded', () => {
  highScore = Number(localStorage.getItem('facebompHighScore') || 0);
  const hs = document.createElement('div');
  hs.id = 'high-score';
  hs.textContent = `最高記録: ${highScore}`;
  document.querySelector('.controls').appendChild(hs);
});

startBtn.addEventListener('click', startGame);
