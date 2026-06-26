// login.js — Web Analytics Portal Login (Enhanced)

// Redirect if already logged in
if (sessionStorage.getItem('wap_auth') === 'true') {
  window.location.href = 'index.html';
}

const VALID_USERNAME = 'teamwebanalytics.com';
const VALID_PASSWORD = 'demo';

let currentMode = 'internal';

// ── Mode switching ──
function switchMode(mode) {
  currentMode = mode;

  const tabInternal = document.getElementById('tab-internal');
  const tabExternal = document.getElementById('tab-external');
  const sectionInternal = document.getElementById('section-internal');
  const sectionExternal = document.getElementById('section-external');

  if (mode === 'internal') {
    tabInternal.classList.add('active');
    tabExternal.classList.remove('active');
    sectionInternal.classList.remove('hidden-section');
    sectionExternal.classList.add('hidden-section');
  } else {
    tabExternal.classList.add('active');
    tabInternal.classList.remove('active');
    sectionExternal.classList.remove('hidden-section');
    sectionInternal.classList.add('hidden-section');
    // focus first field
    setTimeout(() => document.getElementById('username').focus(), 50);
  }

  // animate card content
  const card = document.querySelector('.login-card');
  card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
  card.style.transform = 'scale(0.99)';
  setTimeout(() => { card.style.transform = 'scale(1)'; }, 150);
}

// ── Internal (one-click) login ──
function handleInternalLogin() {
  const btnText   = document.getElementById('internal-btn-text');
  const btnLoader = document.getElementById('internal-btn-loader');

  btnText.textContent = 'Authenticating…';
  btnLoader.classList.remove('hidden');

  setTimeout(() => {
    sessionStorage.setItem('wap_auth', 'true');
    sessionStorage.setItem('wap_user', VALID_USERNAME);
    showSuccessAndRedirect();
  }, 900);
}

// ── External (credential) login ──
function handleLogin() {
  const usernameEl = document.getElementById('username');
  const passwordEl = document.getElementById('password');
  const alertEl    = document.getElementById('login-alert');
  const btnText    = document.getElementById('btn-text');
  const btnLoader  = document.getElementById('btn-loader');

  clearErrors();

  const username = usernameEl.value.trim();
  const password = passwordEl.value;

  let valid = true;

  if (!username) {
    showFieldError('username-error', 'Username is required');
    usernameEl.classList.add('error');
    usernameEl.focus();
    valid = false;
  }

  if (!password) {
    showFieldError('password-error', 'Password is required');
    passwordEl.classList.add('error');
    if (valid) passwordEl.focus();
    valid = false;
  }

  if (!valid) {
    shakeCard();
    return;
  }

  btnText.textContent = 'Signing in…';
  btnLoader.classList.remove('hidden');

  setTimeout(() => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      alertEl.className = 'login-alert success';
      alertEl.textContent = '✓ Credentials verified!';
      sessionStorage.setItem('wap_auth', 'true');
      sessionStorage.setItem('wap_user', username);
      setTimeout(showSuccessAndRedirect, 500);
    } else {
      btnText.textContent = 'Sign In';
      btnLoader.classList.add('hidden');
      alertEl.className = 'login-alert error';
      alertEl.textContent = '✗ Invalid credentials. Please try again.';

      if (username !== VALID_USERNAME) usernameEl.classList.add('error');
      if (password !== VALID_PASSWORD) passwordEl.classList.add('error');

      shakeCard();
    }
  }, 900);
}

// ── Success overlay + redirect ──
function showSuccessAndRedirect() {
  const overlay = document.getElementById('success-overlay');
  overlay.classList.add('show');
  setTimeout(() => { window.location.href = 'index.html'; }, 1500);
}

// ── Shake animation on error ──
function shakeCard() {
  const card = document.querySelector('.login-card');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = 'shakeError 0.4s ease';
  // inject keyframe once
  if (!document.getElementById('shake-style')) {
    const s = document.createElement('style');
    s.id = 'shake-style';
    s.textContent = `
      @keyframes shakeError {
        0%,100% { transform: translateX(0); }
        20%     { transform: translateX(-8px); }
        40%     { transform: translateX(8px); }
        60%     { transform: translateX(-5px); }
        80%     { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(s);
  }
}

function clearErrors() {
  document.getElementById('username-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  document.getElementById('username').classList.remove('error');
  document.getElementById('password').classList.remove('error');
  const alertEl = document.getElementById('login-alert');
  if (alertEl) {
    alertEl.className = 'login-alert hidden';
    alertEl.textContent = '';
  }
}

function showFieldError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function togglePassword() {
  const pw = document.getElementById('password');
  pw.type = pw.type === 'password' ? 'text' : 'password';
}

// Enter key submits whichever form is active
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (currentMode === 'internal') {
      handleInternalLogin();
    } else {
      handleLogin();
    }
  }
});