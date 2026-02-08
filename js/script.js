// js/script.js — interactive demo and accessibility helpers
// Uses localStorage to persist demo state. Replace with real API calls for production.

const TOGGLE_KEY = 'amp_demo_status';
const toggleBtn = document.getElementById('toggleBtn');
const userStatus = document.getElementById('userStatus');
const loginFlow = document.getElementById('loginFlow');
const flowResult = document.getElementById('flowResult');
const simulateBtn = document.getElementById('simulateBtn');
const userAvatar = document.querySelector('.user-avatar');

function readStatus() {
  const raw = localStorage.getItem(TOGGLE_KEY);
  if (!raw) return 'cracked';
  return raw === 'premium' ? 'premium' : 'cracked';
}

function writeStatus(status) {
  localStorage.setItem(TOGGLE_KEY, status);
}

function updateUI() {
  const status = readStatus();
  const dot = status === 'premium' ? '<span class="dot dot-green" aria-hidden="true"></span>' : '<span class="dot dot-red" aria-hidden="true"></span>';
  const label = status === 'premium' ? 'Premium' : 'Cracked';
  userStatus.innerHTML = `${dot} ${label}`;
  toggleBtn.setAttribute('aria-pressed', status === 'premium' ? 'true' : 'false');
  if (status === 'premium') {
    toggleBtn.classList.remove('red'); toggleBtn.classList.add('green');
    toggleBtn.textContent = 'Revert to Cracked';
    userAvatar.setAttribute('src', 'images/premium-icon.svg');
    userAvatar.setAttribute('alt', 'Premium user avatar');
  } else {
    toggleBtn.classList.remove('green'); toggleBtn.classList.add('red');
    toggleBtn.textContent = 'Make Premium';
    userAvatar.setAttribute('src', 'images/cracked-icon.svg');
    userAvatar.setAttribute('alt', 'Cracked user avatar');
  }
}

toggleBtn.addEventListener('click', () => {
  const cur = readStatus();
  const next = cur === 'premium' ? 'cracked' : 'premium';
  writeStatus(next);
  updateUI();
});

simulateBtn.addEventListener('click', async () => {
  loginFlow.style.display = 'flex';
  flowResult.textContent = '';
  const steps = Array.from(loginFlow.querySelectorAll('.flow-step'));
  for (let i = 0; i < steps.length; i++) {
    steps.forEach(s => s.style.opacity = 0.45);
    const s = steps[i];
    s.style.opacity = 1;
    await new Promise(r => setTimeout(r, 650));
  }
  const status = readStatus();
  if (status === 'premium') {
    flowResult.textContent = 'Auto-login succeeded — player authenticated as Premium.';
    flowResult.style.color = '#22C55E';
  } else {
    flowResult.textContent = 'Auto-login not detected — AuthMe requires manual login (cracked).';
    flowResult.style.color = '#EF4444';
  }
  setTimeout(() => { loginFlow.style.display = 'none'; }, 3800);
});

// Initialize UI on load
document.addEventListener('DOMContentLoaded', updateUI);