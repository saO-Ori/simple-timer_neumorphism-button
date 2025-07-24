// ==============================
// 要素取得
// ==============================
const timeDisplay = document.getElementById('time');
const alarm = document.getElementById('alarmSound');
const stopHint = document.getElementById('stopHint');
const resetButton = document.getElementById('resetButton');

let inputDigits = '';
let countdownInterval;
let remainingTime = 0;
let isRunning = false;

// ==============================
// 数字ボタン入力
// ==============================
function appendDigit(num) {
  if (isRunning) return;
  if (inputDigits.length >= 6) return;
  inputDigits += num.toString();
  remainingTime = parseSmartTime(inputDigits);
  updateDisplay(remainingTime);
}

// ==============================
// スタート・一時停止切り替え
// ==============================
function startOrPause() {
  const startBtn = document.querySelector('button[onclick="startOrPause()"]');
  if (!isRunning) {
    if (remainingTime <= 0) {
      alert('1秒以上の時間を入力してください');
      return;
    }
    startCountdown();
    startBtn.textContent = '一時停止';
  } else {
    pauseCountdown();
    startBtn.textContent = '再開';
  }
}

// ==============================
// リセット処理
// ==============================
function resetTimer() {
  clearInterval(countdownInterval);
  isRunning = false;
  remainingTime = 0;
  inputDigits = '';
  updateDisplay(0);
  document.querySelector('button[onclick="startOrPause()"]').textContent = 'スタート';
  stopHint.classList.remove('show');
  alarm.pause();
  alarm.currentTime = 0;
  document.body.removeEventListener('click', stopAlarm);
  document.body.removeEventListener('touchstart', stopAlarm);
  toggleControls(false);
}

// ==============================
// カウントダウン開始
// ==============================
function startCountdown() {
  isRunning = true;
  toggleControls(true);

  countdownInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      updateDisplay(0);
      alarm.play();
      isRunning = false;
      remainingTime = 0;
      inputDigits = '';
      toggleControls(false);
      document.querySelector('button[onclick="startOrPause()"]').textContent = 'スタート';
      stopHint.classList.add('show');
      document.body.addEventListener('click', stopAlarm);
      document.body.addEventListener('touchstart', stopAlarm);
    } else {
      updateDisplay(remainingTime);
    }
  }, 1000);
}

// ==============================
// 一時停止
// ==============================
function pauseCountdown() {
  isRunning = false;
  clearInterval(countdownInterval);
  toggleControls(false);
}

// ==============================
// アラーム停止
// ==============================
function stopAlarm() {
  alarm.pause();
  alarm.currentTime = 0;
  stopHint.classList.remove('show');
  document.body.removeEventListener('click', stopAlarm);
  document.body.removeEventListener('touchstart', stopAlarm);
  resetTimer();
}

// ==============================
// 秒数に変換（hhmmss対応）
function parseSmartTime(inputStr) {
  const raw = inputStr.padStart(2, '0');
  if (raw === '6000') return 3600;
  const len = raw.length;
  const s = parseInt(raw.slice(-2), 10);
  const m = len > 2 ? parseInt(raw.slice(-4, -2), 10) : 0;
  const h = len > 4 ? parseInt(raw.slice(0, -4), 10) : 0;
  return h * 3600 + m * 60 + s;
}

// ==============================
// 表示更新（コロン位置調整含む）
function updateDisplay(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const baseStr = h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const styledHTML = baseStr.replace(/:/g, '<span class="time-colon">:</span>');
  timeDisplay.innerHTML = styledHTML;
}

// ==============================
// プリセットボタン
function setPreset(sec) {
  if (isRunning) return;
  remainingTime = sec;
  inputDigits = '';
  updateDisplay(remainingTime);
}

// ==============================
// ボタン制御（trueで無効化）
// ==============================
function toggleControls(disable) {
  // 数字ボタン（スタート以外）
  document.querySelectorAll('.digit-buttons button').forEach(btn => {
    const label = btn.textContent;
    if (!label.includes('スタート') && !label.includes('一時停止') && !label.includes('再開')) {
      btn.disabled = disable;
    }
  });

  // プリセット
  document.querySelectorAll('.preset-buttons button').forEach(btn => {
    btn.disabled = disable;
  });

  // リセット
  resetButton.disabled = disable;
}

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay(0);
});
