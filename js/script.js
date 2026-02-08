
// Demo interactivity: toggle premium/cracked, simulate login flow and persist state
const TOGGLE_KEY = 'amp_demo_status';

// get DOM elements
const toggleBtn = document.getElementById('toggleBtn');
const userStatus = document.getElementById('userStatus');
const userCard = document.getElementById('userCard');
const loginFlow = document.getElementById('loginFlow');
const flowResult = document.getElementById('flowResult');
const simulateBtn = document.getElementById('simulateBtn');
const downloadLink = document.getElementById('downloadCommands');

// read status from storage or default to cracked
function readStatus() {
  const raw = localStorage.getItem(TOGGLE_KEY);
  if (!raw) return 'cracked';
  return raw === 'premium' ? 'premium' : 'cracked';
}

// save status
function writeStatus(status) {
  localStorage.setItem(TOGGLE_KEY, status);
}

// ui update
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

// simulate auto-login (animated)
simulateBtn.addEventListener('click', async () => {
  loginFlow.style.display = 'flex';
  flowResult.textContent = '';
  const steps = Array.from(loginFlow.querySelectorAll('.flow-step'));
  for (let i = 0; i < steps.length; i++) {
    steps.forEach(s => s.style.opacity = 0.4);
    const s = steps[i];
    s.style.opacity = 1;
    await new Promise(r => setTimeout(r, 700));
  }
  // final result: if status premium -> success, else show blocked / login prompt
  const status = readStatus();
  if (status === 'premium') {
    flowResult.textContent = 'Auto-login succeeded — player logged in as Premium.';
    flowResult.style.color = '#22C55E';
  } else {
    flowResult.textContent = 'Auto-login not detected — AuthMe requires manual login (cracked).';
    flowResult.style.color = '#EF4444';
  }
  // hide after a while
  setTimeout(() => { loginFlow.style.display = 'none'; }, 4200);
});

// prepare downloadable PLUGIN_COMMANDS.txt
const commandsTxt = `AuthMePremium - Commands & Permissions

/premium
  Permission: authmepremium.premium
  Aliases: /prem
  Description: Enables premium mode for your account. Use /cracked to revert.

 /cracked
  Permission: authmepremium.cracked
  Aliases: /crack
  Description: Disables premium mode for your account.

 /authmepremium setpremium <player> [true/false]
  Permission: authmepremium.admin
  Description: Admin command to set premium for a player.

Notes:
- Auto-login requires proper proxy setup (FlameCord / VeloFlame) and AuthMe on the backend.
- Public listings and marketplace summaries referenced for compatibility.`;

downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(commandsTxt);

// initial render
updateUI();