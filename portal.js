// portal.js — Web Analytics Portal

// Auth guard
if (sessionStorage.getItem('wap_auth') !== 'true') {
  window.location.href = 'login.html';
}

// Set username in nav
const storedUser = sessionStorage.getItem('wap_user') || 'Team';
const navUsername = document.getElementById('nav-username');
if (navUsername) navUsername.textContent = storedUser;

// ---- Tab switching ----
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));

  const targetTab = document.getElementById('tab-' + tabName);
  if (targetTab) targetTab.classList.add('active');

  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(btn => {
    if (btn.getAttribute('onclick').includes(tabName)) {
      btn.classList.add('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Logout ----
function logout() {
  sessionStorage.removeItem('wap_auth');
  sessionStorage.removeItem('wap_user');
  window.location.href = 'login.html';
}

// ---- PPT Modal ----
const pptData = {
  piano: {
    title: 'Piano Analytics Documentation',
    filename: 'Piano_Analytics_Documentation.pptx',
    author: 'Aanchal Ranglani'
  },
  pii: {
    title: 'PII Walkthrough',
    filename: 'C:\Users\B739RT\OneDrive - AXA\Documents\1st and 2nd PII Data\PII Walkthrough.pptx',
    author: 'Jeevan KS'
  }
};

function viewPPT(key) {
  const data = pptData[key];
  if (!data) return;

  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-ppt-name').textContent = data.title + ' — ' + data.author;
  document.getElementById('ppt-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePPTModal() {
  document.getElementById('ppt-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function downloadPPT(key) {
  const data = pptData[key];
  if (!data) return;

  // If files are uploaded to server, change this URL to the actual file path
  // e.g. window.location.href = '/files/' + data.filename;
  alert('Please upload the PPT file to the server and update the download path.\n\nExpected file: ' + data.filename);
}

// Close modal on backdrop click
document.getElementById('ppt-modal').addEventListener('click', function(e) {
  if (e.target === this) closePPTModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closePPTModal();
});
// ---- Internal Training — Teams Links ----
const teamsLinks = {
  piano:    { title: 'Piano Analytics KT', stored: null },
  onetrust: { title: 'One Trust KT', stored: null }
};

let activeTeamsKey = null;

function openTeamsLink(key) {
  const data = teamsLinks[key];
  if (!data) return;

  // If a link is already saved, open it directly
  if (data.stored) {
    window.open(data.stored, '_blank');
    return;
  }

  activeTeamsKey = key;
  document.getElementById('teams-modal-title').textContent = data.title;
  document.getElementById('teams-modal-session').textContent = data.title + ' — Microsoft Teams';
  document.getElementById('teams-link-input').value = '';
  document.getElementById('teams-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('teams-link-input').focus(), 100);
}

function closeTeamsModal() {
  document.getElementById('teams-modal').classList.add('hidden');
  document.body.style.overflow = '';
  activeTeamsKey = null;
}

function saveAndOpenTeams() {
  const url = document.getElementById('teams-link-input').value.trim();
  if (!url) {
    document.getElementById('teams-link-input').style.borderColor = '#dc2626';
    setTimeout(() => { document.getElementById('teams-link-input').style.borderColor = ''; }, 1500);
    return;
  }
  if (activeTeamsKey && teamsLinks[activeTeamsKey]) {
    teamsLinks[activeTeamsKey].stored = url;
  }
  closeTeamsModal();
  window.open(url, '_blank');
}

// Close teams modal on backdrop click
document.getElementById('teams-modal').addEventListener('click', function(e) {
  if (e.target === this) closeTeamsModal();
});
