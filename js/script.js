// Demo interactivity (placed at js/script.js)
// Toggle state keys
const TOGGLE_KEY = 'amp_demo_status';

// DOM elements
const toggleBtn = document.getElementById('toggleBtn');
const userStatus = document.getElementById('userStatus');
const loginFlow = document.getElementById('loginFlow');
const flowResult = document.getElementById('flowResult');
const simulateBtn = document.getElementById('simulateBtn');

// read status from localStorage or default to 'cracked'
function readStatus() {
  const raw = localStorage.getItem(TOGGLE_KEY);
  if (!raw) return 'cracked';
  return raw === 'premium' ? 'premium' : 'cracked';
}

// write status
function writeStatus(status) {
  localStorage.setItem(TOGGLE_KEY, status);
}

// update UI based on status
function updateUI() {
  const status = readStatus();
  const dot = status === 'premium' ? '<span class="dot dot-green"></span>' : '<span class="dot dot-red"></span>';
  const label = status === 'premium' ? 'Premium' : 'Cracked';
  userStatus.innerHTML = `${dot} ${label}`;
  if (status === 'premium') {
    toggleBtn.classList.remove('red'); toggleBtn.classList.add('green'); toggleBtn.textContent = 'Revert to Cracked';
  } else {
    toggleBtn.classList.remove('green'); toggleBtn.classList.add('red'); toggleBtn.textContent = 'Make Premium';
  }
}

// toggle handler
toggleBtn.addEventListener('click', () => {
  const cur = readStatus();
  const next = cur === 'premium' ? 'cracked' : 'premium';
  writeStatus(next);
  updateUI();
});

// simulate auto-login with animation
simulateBtn.addEventListener('click', async () => {
  loginFlow.style.display = 'flex';
  flowResult.textContent = '';
  const steps = Array.from(loginFlow.querySelectorAll('.flow-step'));
  for (let i = 0; i < steps.length; i++) {
    steps.forEach(s => s.style.opacity = 0.4);
    const s = steps[i];
    s.style.opacity = 1;
    // small pause to simulate flow
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
  // hide after a short period
  setTimeout(() => { loginFlow.style.display = 'none'; }, 3800);
});

// initial render on load
updateUI();