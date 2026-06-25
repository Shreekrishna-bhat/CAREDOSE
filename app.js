emailjs.init("PEDS5RlD7QtCThRBw");

const sendMedicineAlert = () => {
  alert("Button clicked");
  emailjs.send(
  'service_vclmfay',
  'template_10fa0mc',
  {
    name: 'Shreekrishna',
    time: '8:00 PM',
    email: 'bhatshree2006@gmail.com'
  },
  'PEDS5RlD7QtCThRBw'
)
  .then(() => {
    alert('Email sent successfully');
  })
  .catch((error) => {
    console.log(error);
    alert(JSON.stringify(error));
  });
};

// --- Authentication ---
const AUTH_KEY = 'medguard_auth';
const USERS_KEY = 'medguard_users';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function saveSession(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
  return !!getSession();
}

// Tab switching
function switchAuthTab(tab) {
  const tabSignIn = document.getElementById('tabSignIn');
  const tabSignUp = document.getElementById('tabSignUp');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');

  // Hide errors
  document.getElementById('loginError').classList.add('hidden');
  document.getElementById('registerError').classList.add('hidden');

  if (tab === 'signin') {
    tabSignIn.classList.add('active');
    tabSignUp.classList.remove('active');
    signInForm.classList.remove('hidden');
    signUpForm.classList.add('hidden');
  } else {
    tabSignUp.classList.add('active');
    tabSignIn.classList.remove('active');
    signUpForm.classList.remove('hidden');
    signInForm.classList.add('hidden');
  }
}

// Password visibility toggle
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

// Password strength meter
function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-5
}

function updatePasswordStrength() {
  const password = document.getElementById('registerPassword').value;
  const container = document.getElementById('passwordStrength');
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

  if (password.length === 0) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  const score = checkPasswordStrength(password);
  const percentage = (score / 5) * 100;

  fill.style.width = percentage + '%';

  if (score <= 1) {
    fill.style.background = '#ef4444';
    label.textContent = 'Weak';
    label.style.color = '#ef4444';
  } else if (score <= 3) {
    fill.style.background = '#eab308';
    label.textContent = 'Fair';
    label.style.color = '#eab308';
  } else {
    fill.style.background = '#22c55e';
    label.textContent = 'Strong';
    label.style.color = '#22c55e';
  }
}

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sign In
function handleSignIn() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  const errorText = document.getElementById('loginErrorText');

  errorEl.classList.add('hidden');

  if (!email || !password) {
    errorText.textContent = 'Please fill in all fields';
    errorEl.classList.remove('hidden');
    return;
  }

  if (!isValidEmail(email)) {
    errorText.textContent = 'Please enter a valid email address';
    errorEl.classList.remove('hidden');
    return;
  }

  // Show spinner
  document.getElementById('signInBtnText').classList.add('hidden');
  document.getElementById('signInSpinner').classList.remove('hidden');

  // Simulate auth delay for polish
  setTimeout(() => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    document.getElementById('signInBtnText').classList.remove('hidden');
    document.getElementById('signInSpinner').classList.add('hidden');

    if (user) {
      saveSession(user);
      enterApp();
    } else {
      errorText.textContent = 'Invalid email or password';
      errorEl.classList.remove('hidden');
    }
  }, 800);
}

// Sign Up
function handleSignUp() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const errorEl = document.getElementById('registerError');
  const errorText = document.getElementById('registerErrorText');

  errorEl.classList.add('hidden');

  if (!name || !email || !password || !confirmPassword) {
    errorText.textContent = 'Please fill in all fields';
    errorEl.classList.remove('hidden');
    return;
  }

  if (!isValidEmail(email)) {
    errorText.textContent = 'Please enter a valid email address';
    errorEl.classList.remove('hidden');
    return;
  }

  if (password.length < 6) {
    errorText.textContent = 'Password must be at least 6 characters';
    errorEl.classList.remove('hidden');
    return;
  }

  if (password !== confirmPassword) {
    errorText.textContent = 'Passwords do not match';
    errorEl.classList.remove('hidden');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    errorText.textContent = 'An account with this email already exists';
    errorEl.classList.remove('hidden');
    return;
  }

  // Show spinner
  document.getElementById('signUpBtnText').classList.add('hidden');
  document.getElementById('signUpSpinner').classList.remove('hidden');

  setTimeout(() => {
    const newUser = {
      id: Date.now().toString(36),
      name,
      email,
      password,
      joinedDate: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    saveSession(newUser);

    document.getElementById('signUpBtnText').classList.remove('hidden');
    document.getElementById('signUpSpinner').classList.add('hidden');

    enterApp();
  }, 1000);
}

// Social login (stub — simulates login)
function handleSocialLogin(provider) {
  const name = provider.charAt(0).toUpperCase() + provider.slice(1) + ' User';
  const email = `user@${provider}.com`;
  const user = { id: Date.now().toString(36), name, email, password: '', joinedDate: new Date().toISOString() };
  saveSession(user);
  enterApp();
}

// Forgot password
function showForgotPassword() {
  alert('Password reset link would be sent to your email.\n\nThis is a demo — simply create a new account or use your existing credentials.');
}

// Enter the app after login
function enterApp() {
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('bottomNav').classList.remove('hidden');
  navigateTo('home');
  updateProfileModal();
}

// Logout
function handleLogout() {
  clearSession();
  hideUserProfile();

  // Hide all views and nav
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('elderlyView').classList.add('hidden');
  document.getElementById('caregiverView').classList.add('hidden');
  document.getElementById('bottomNav').classList.add('hidden');

  // Show login
  document.getElementById('loginView').classList.remove('hidden');

  // Clear form fields
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').classList.add('hidden');
}

// Profile modal
function showUserProfile() {
  updateProfileModal();
  document.getElementById('profileModal').classList.remove('hidden');
}

function hideUserProfile() {
  document.getElementById('profileModal').classList.add('hidden');
}

function updateProfileModal() {
  const user = getSession();
  if (!user) return;

  document.getElementById('profileName').textContent = user.name || 'User';
  document.getElementById('profileEmail').textContent = user.email || '';
  document.getElementById('profileAvatar').textContent = user.name ? user.name.charAt(0).toUpperCase() : '👤';

  const joinedDate = user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Today';
  document.getElementById('profileJoined').textContent = joinedDate;

  const meds = getMedicines();
  document.getElementById('profileMedCount').textContent = meds.length;
}


// --- State and Storage ---
const MEDICINES_KEY = 'medguard_medicines';

function getMedicines() {
  const raw = localStorage.getItem(MEDICINES_KEY);
  if (!raw) return [];
  try {
    const meds = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    return meds.map(m => {
      if (m.date !== today) {
        return { ...m, date: today, status: 'pending' };
      }
      return m;
    });
  } catch {
    return [];
  }
}

function saveMedicines(medicines) {
  localStorage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
}

function addMedicineStorage(med) {
  const meds = getMedicines();
  meds.push(med);
  saveMedicines(meds);
  return meds;
}

function updateMedicineStatus(id, status) {
  const meds = getMedicines();
  const updated = meds.map(m => m.id === id ? { ...m, status } : m);
  saveMedicines(updated);
  return updated;
}

function deleteMedicine(id) {
  const meds = getMedicines().filter(m => m.id !== id);
  saveMedicines(meds);
  return meds;
}

function calculateHealthStatus(medicines) {
  const today = new Date().toISOString().split('T')[0];
  const todayMeds = medicines.filter(m => m.date === today);
  if (todayMeds.length === 0) return 'red';
  
  const missed = todayMeds.filter(m => m.status === 'missed').length;
  const taken = todayMeds.filter(m => m.status === 'taken').length;
  
  if (missed > 0) return 'broken';
  if (taken === todayMeds.length) return 'green';
  return 'red';
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}


// --- App Logic ---
let currentView = 'home';
let medicines = [];
let heartStatus = 'red';
let currentAlertMed = null;
let alertCountdown = 30;
let alertInterval = null;
let alertedIds = new Set();
let caregiverInterval = null;
let isListening = false;
let recognition = null;
let celebrateId = null;

let medBeforeFood = true;

// Navigation
function navigateTo(view) {
  // Hide all views
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('elderlyView').classList.add('hidden');
  document.getElementById('caregiverView').classList.add('hidden');
  
  // Show target view
  document.getElementById(`${view}View`).classList.remove('hidden');
  
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`nav-${view}`).classList.add('active');
  
  currentView = view;

  if (view === 'elderly') {
    refreshElderlyData();
  } else if (view === 'caregiver') {
    refreshCaregiverData();
    if (!caregiverInterval) {
      caregiverInterval = setInterval(refreshCaregiverData, 3000);
    }
  } else {
    if (caregiverInterval) {
      clearInterval(caregiverInterval);
      caregiverInterval = null;
    }
  }
}

function updateHeartIcon(btnElement, status) {
  btnElement.classList.remove('bg-green-500/20', 'text-green-400', 'animate-pulse-glow-green', 'bg-red-500/20', 'text-red-400', 'animate-pulse-glow-red');
  if (status === 'green') {
    btnElement.textContent = '💚';
    btnElement.classList.add('bg-green-500/20', 'text-green-400', 'animate-pulse-glow-green');
  } else if (status === 'broken') {
    btnElement.textContent = '💔';
    btnElement.classList.add('bg-red-500/20', 'text-red-400', 'animate-pulse-glow-red');
  } else {
    btnElement.textContent = '❤️';
    btnElement.classList.add('bg-red-500/20', 'text-red-400', 'animate-pulse-glow-red');
  }
}

// --- Elderly View Functions ---
function refreshElderlyData() {
  medicines = getMedicines();
  heartStatus = calculateHealthStatus(medicines);
  updateHeartIcon(document.getElementById('elderlyHeartBtn'), heartStatus);
  renderElderlyProgress();
  renderMedicinesList();
}

function renderElderlyProgress() {
  const today = new Date().toISOString().split('T')[0];
  const todayMeds = medicines.filter(m => m.date === today);
  const totalCount = todayMeds.length;
  
  const progressContainer = document.getElementById('elderlyProgress');
  if (totalCount === 0) {
    progressContainer.classList.add('hidden');
    return;
  }
  
  progressContainer.classList.remove('hidden');
  const takenCount = todayMeds.filter(m => m.status === 'taken').length;
  const progress = Math.round((takenCount / totalCount) * 100);
  
  document.getElementById('elderlyProgressText').textContent = `${progress}%`;
  document.getElementById('elderlyProgressBar').style.width = `${progress}%`;
  document.getElementById('elderlyProgressTaken').textContent = `${takenCount} taken`;
  document.getElementById('elderlyProgressTotal').textContent = `${totalCount} total`;
}

function renderMedicinesList() {
  const listContainer = document.getElementById('medicinesList');
  const today = new Date().toISOString().split('T')[0];
  const todayMeds = medicines.filter(m => m.date === today);
  
  if (todayMeds.length === 0) {
    listContainer.innerHTML = `
      <div class="glass-card text-center py-12">
        <div class="text-5xl mb-4 animate-float">💊</div>
        <p class="text-white/40 font-semibold">No medicines added yet</p>
        <p class="text-white/20 text-sm mt-1">Tap the green button above to add one</p>
      </div>`;
    document.getElementById('testAlertContainer').classList.add('hidden');
    return;
  }
  
  document.getElementById('testAlertContainer').classList.remove('hidden');
  
  todayMeds.sort((a, b) => a.time.localeCompare(b.time));
  listContainer.innerHTML = '';
  
  todayMeds.forEach((med, idx) => {
    const isCelebrate = celebrateId === med.id;
    const isTaken = med.status === 'taken';
    const isMissed = med.status === 'missed';
    const isPending = med.status === 'pending';
    
    let statusClass = 'status-pending';
    let statusText = '⏳ Pending';
    if (isTaken) { statusClass = 'status-taken'; statusText = '✅ Taken'; }
    if (isMissed) { statusClass = 'status-missed'; statusText = '❌ Missed'; }
    
    const card = document.createElement('div');
    card.className = `med-card glass-card ${isCelebrate ? 'animate-celebrate' : ''}`;
    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-lg font-bold text-white">💊 ${med.name}</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-white/40">
            <span>🕐 ${med.time}</span>
            <span>${med.beforeFood ? 'Before food' : 'After food'}</span>
          </div>
        </div>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      
      ${isPending ? `
        <div class="flex gap-3 mt-4">
          <button onclick="handleTaken('${med.id}')" class="btn-neo btn-neo-green flex-1 text-sm py-3">✅ Taken</button>
          <button onclick="handleMissed('${med.id}')" class="btn-neo btn-neo-red flex-1 text-sm py-3">❌ Missed</button>
        </div>
      ` : ''}
      
      <div class="flex justify-end mt-3">
        <button onclick="handleDelete('${med.id}')" class="text-white/20 text-xs hover:text-red-400 transition-colors cursor-pointer">🗑️ Remove</button>
      </div>
    `;
    listContainer.appendChild(card);
  });
}

function handleTaken(id) {
  updateMedicineStatus(id, 'taken');
  celebrateId = id;
  setTimeout(() => celebrateId = null, 600);
  refreshElderlyData();
}

function handleMissed(id) {
  updateMedicineStatus(id, 'missed');
  refreshElderlyData();
}

function handleDelete(id) {
  deleteMedicine(id);
  refreshElderlyData();
}

// Global clock tick
setInterval(() => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  document.getElementById('elderlyTime').textContent = timeStr;
  
  // Check for alerts
  const today = now.toISOString().split('T')[0];
  const pending = medicines.find(m => m.time === timeStr && m.status === 'pending' && m.date === today);
  
  if (pending && !alertedIds.has(pending.id) && !currentAlertMed) {
    alertedIds.add(pending.id);
    triggerAlert(pending);
  }
}, 1000);


// --- Alert Logic ---
function triggerAlert(med) {
  currentAlertMed = med;
  alertCountdown = 30;
  
  const overlay = document.getElementById('alertOverlay');
  overlay.classList.remove('hidden');
  
  document.getElementById('alertMedicineInfo').classList.remove('hidden');
  document.getElementById('alertMedName').textContent = `💊 ${med.name}`;
  document.getElementById('alertMedInstruction').textContent = med.beforeFood ? '🍽️ Before food' : '🍽️ After food';
  document.getElementById('alertMedTime').textContent = `🕐 ${med.time}`;
  
  document.getElementById('alertCountdownText').textContent = alertCountdown;
  
  // Speak
  if ('speechSynthesis' in window) {
    const msg = `Time to take your medicine. ${med.name}. ${med.beforeFood ? 'Take before food.' : 'Take after food.'}`;
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = 0.9;
    setTimeout(() => speechSynthesis.speak(utterance), 500);
  }
  
  alertInterval = setInterval(() => {
    alertCountdown--;
    const countdownEl = document.getElementById('alertCountdownText');
    countdownEl.textContent = alertCountdown;
    
    const circle = document.getElementById('alertCountdownCircle');
    circle.setAttribute('stroke-dasharray', `${(alertCountdown / 30) * 314} 314`);
    
    if (alertCountdown <= 10) {
      countdownEl.classList.remove('text-white');
      countdownEl.classList.add('text-red-400');
      circle.setAttribute('stroke', '#ef4444');
    } else {
      countdownEl.classList.add('text-white');
      countdownEl.classList.remove('text-red-400');
      circle.setAttribute('stroke', '#4f8fff');
    }
    
    if (alertCountdown <= 0) {
      closeAlertAsMissed();
    }
  }, 1000);
}

function closeAlertAsTaken() {
  if (currentAlertMed) {
    handleTaken(currentAlertMed.id);
  }
  resetAlertUI();
}

function closeAlertAsMissed() {
  document.getElementById('alertIcon').parentElement.children[0].classList.add('hidden'); // hide normal alert content visually, wait simpler to hide container children
  document.getElementById('alertTitle').parentElement.querySelectorAll(':not(#notifyingState):not(.alert-overlay-bg)').forEach(el => el.classList.add('hidden'));
  document.getElementById('notifyingState').classList.remove('hidden');
  
  setTimeout(() => {
    if (currentAlertMed) {
      handleMissed(currentAlertMed.id);
    }
    resetAlertUI();
  }, 2000);
}

function resetAlertUI() {
  clearInterval(alertInterval);
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (recognition) { recognition.stop(); isListening = false; }
  
  document.getElementById('alertOverlay').classList.add('hidden');
  document.getElementById('notifyingState').classList.add('hidden');
  document.getElementById('alertTitle').parentElement.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));
  document.getElementById('notifyingState').classList.add('hidden'); // ensure it's hidden
  document.getElementById('alertMedicineInfo').classList.add('hidden');
  
  document.getElementById('alertVoiceBtn').textContent = '🎤 Say "I took it"';
  document.getElementById('alertVoiceBtn').classList.remove('animate-pulse-glow');
  currentAlertMed = null;
}

document.getElementById('alertTakeBtn').addEventListener('click', closeAlertAsTaken);
document.getElementById('alertMissBtn').addEventListener('click', closeAlertAsMissed);

// Voice Recognition
document.getElementById('alertVoiceBtn').addEventListener('click', () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Speech recognition not supported in this browser.");
    return;
  }
  
  if (isListening) return;
  
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    if (transcript.includes('took') || transcript.includes('taken') || transcript.includes('done') || transcript.includes('yes')) {
      closeAlertAsTaken();
    }
    isListening = false;
    document.getElementById('alertVoiceBtn').textContent = '🎤 Say "I took it"';
    document.getElementById('alertVoiceBtn').classList.remove('animate-pulse-glow');
  };
  recognition.onerror = () => {
    isListening = false;
    document.getElementById('alertVoiceBtn').textContent = '🎤 Say "I took it"';
    document.getElementById('alertVoiceBtn').classList.remove('animate-pulse-glow');
  };
  recognition.onend = () => {
    isListening = false;
    document.getElementById('alertVoiceBtn').textContent = '🎤 Say "I took it"';
    document.getElementById('alertVoiceBtn').classList.remove('animate-pulse-glow');
  };
  
  isListening = true;
  document.getElementById('alertVoiceBtn').textContent = '🎤 Listening...';
  document.getElementById('alertVoiceBtn').classList.add('animate-pulse-glow');
  recognition.start();
});


// Form Logic
const btnBefore = document.getElementById('btnBeforeFood');
const btnAfter = document.getElementById('btnAfterFood');

btnBefore.addEventListener('click', () => {
  medBeforeFood = true;
  btnBefore.className = "flex-1 py-3 rounded-xl font-bold text-sm transition-all bg-blue-500/20 border-2 border-blue-400 text-blue-300";
  btnAfter.className = "flex-1 py-3 rounded-xl font-bold text-sm transition-all bg-white/5 border-2 border-white/10 text-white/40";
});

btnAfter.addEventListener('click', () => {
  medBeforeFood = false;
  btnAfter.className = "flex-1 py-3 rounded-xl font-bold text-sm transition-all bg-purple-500/20 border-2 border-purple-400 text-purple-300";
  btnBefore.className = "flex-1 py-3 rounded-xl font-bold text-sm transition-all bg-white/5 border-2 border-white/10 text-white/40";
});

const medNameInput = document.getElementById('medNameInput');
const medTimeInput = document.getElementById('medTimeInput');
const saveMedBtn = document.getElementById('saveMedBtn');

function checkFormValidity() {
  if (medNameInput.value.trim() && medTimeInput.value) {
    saveMedBtn.disabled = false;
  } else {
    saveMedBtn.disabled = true;
  }
}

medNameInput.addEventListener('input', checkFormValidity);
medTimeInput.addEventListener('input', checkFormValidity);

saveMedBtn.addEventListener('click', () => {
  const name = medNameInput.value.trim();
  const time = medTimeInput.value;
  if (!name || !time) return;
  
  const today = new Date().toISOString().split('T')[0];
  const newMed = {
    id: generateId(),
    name,
    time,
    beforeFood: medBeforeFood,
    status: 'pending',
    date: today
  };
  
  addMedicineStorage(newMed);
  
  medNameInput.value = '';
  medTimeInput.value = '';
  saveMedBtn.disabled = true;
  document.getElementById('addMedForm').classList.add('hidden');
  document.getElementById('toggleFormBtn').innerHTML = '➕ Add Medicine';
  
  refreshElderlyData();
});

document.getElementById('toggleFormBtn').addEventListener('click', () => {
  const form = document.getElementById('addMedForm');
  if (form.classList.contains('hidden')) {
    form.classList.remove('hidden');
    document.getElementById('toggleFormBtn').innerHTML = '✕ Cancel';
  } else {
    form.classList.add('hidden');
    document.getElementById('toggleFormBtn').innerHTML = '➕ Add Medicine';
  }
});

document.getElementById('testAlertBtn').addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0];
  const pending = medicines.find(m => m.status === 'pending' && m.date === today);
  if (pending) {
    triggerAlert(pending);
  }
});


// --- Caregiver View Functions ---
setInterval(() => {
  if (currentView === 'caregiver') {
    const now = new Date();
    document.getElementById('caregiverTime').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}, 1000);

function refreshCaregiverData() {
  const meds = getMedicines();
  const hs = calculateHealthStatus(meds);
  
  document.getElementById('caregiverSyncTime').textContent = new Date().toLocaleTimeString();
  updateHeartIcon(document.getElementById('caregiverHeartBtn'), hs);
  
  const today = new Date().toISOString().split('T')[0];
  const todayMeds = meds.filter(m => m.date === today);
  
  const takenCount = todayMeds.filter(m => m.status === 'taken').length;
  const missedCount = todayMeds.filter(m => m.status === 'missed').length;
  const pendingCount = todayMeds.filter(m => m.status === 'pending').length;
  const totalCount = todayMeds.length;
  const complianceRate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
  
  document.getElementById('caregiverComplianceText').textContent = `${complianceRate}%`;
  document.getElementById('caregiverComplianceBar').style.width = `${complianceRate}%`;
  
  document.getElementById('statTotal').textContent = totalCount;
  document.getElementById('statTaken').textContent = takenCount;
  document.getElementById('statMissed').textContent = missedCount;
  document.getElementById('statPending').textContent = pendingCount;
  
  const statusCard = document.getElementById('caregiverStatusCard');
  statusCard.className = `glass-card mb-6 flex items-center gap-4 ${hs === 'green' ? 'glow-green' : hs === 'broken' ? 'glow-red' : 'glow-blue'}`;
  
  document.getElementById('caregiverStatusIcon').textContent = hs === 'green' ? '💚' : hs === 'broken' ? '💔' : '❤️';
  document.getElementById('caregiverStatusTitle').textContent = hs === 'green' ? 'All Medicines Taken!' : hs === 'broken' ? 'Alert: Missed Medicine!' : 'Pending Medicines';
  document.getElementById('caregiverStatusDesc').textContent = hs === 'green' ? 'Great job! All medicines have been taken today.' : hs === 'broken' ? `${missedCount} medicine(s) were missed. Consider reaching out.` : `${pendingCount} medicine(s) still pending today.`;
  
  const timeline = document.getElementById('caregiverTimeline');
  if (todayMeds.length === 0) {
    timeline.innerHTML = `
      <div class="glass-card text-center py-12">
        <div class="text-5xl mb-4 animate-float">📋</div>
        <p class="text-white/40 font-semibold">No medicines tracked yet</p>
        <p class="text-white/20 text-sm mt-1">Ask the elderly user to add medicines</p>
      </div>`;
  } else {
    timeline.innerHTML = '';
    todayMeds.sort((a, b) => a.time.localeCompare(b.time)).forEach((med, i) => {
      let dotClass = 'bg-yellow-400 border-yellow-400';
      let badgeHtml = '<span class="status-badge status-pending">⏳ Pending</span>';
      if (med.status === 'taken') {
        dotClass = 'bg-green-400 border-green-400 glow-green';
        badgeHtml = '<span class="status-badge status-taken">✅ Taken</span>';
      } else if (med.status === 'missed') {
        dotClass = 'bg-red-400 border-red-400 glow-red';
        badgeHtml = '<span class="status-badge status-missed">❌ Missed</span>';
      }
      
      const card = document.createElement('div');
      card.className = "glass-card med-card";
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-4 h-4 rounded-full border-2 ${dotClass}"></div>
            <div>
              <div class="text-white font-bold">💊 ${med.name}</div>
              <div class="text-white/40 text-sm flex items-center gap-2">
                <span>🕐 ${med.time}</span><span>·</span><span>${med.beforeFood ? 'Before food' : 'After food'}</span>
              </div>
            </div>
          </div>
          <div>${badgeHtml}</div>
        </div>
        ${med.status === 'missed' ? `
          <div class="mt-3 flex items-center gap-2 text-red-400/80 text-xs animate-notify-pulse">
            <span>📡</span><span>Caregiver was notified</span>
          </div>
        ` : ''}
      `;
      timeline.appendChild(card);
    });
  }
}

document.getElementById('refreshDataBtn').addEventListener('click', refreshCaregiverData);

// --- Keyboard handlers for login ---
document.getElementById('loginEmail').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('loginPassword').focus();
});
document.getElementById('loginPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSignIn();
});
document.getElementById('registerName').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('registerEmail').focus();
});
document.getElementById('registerEmail').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('registerPassword').focus();
});
document.getElementById('registerPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('registerConfirmPassword').focus();
});
document.getElementById('registerConfirmPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSignUp();
});

// Password strength meter
document.getElementById('registerPassword').addEventListener('input', updatePasswordStrength);

// --- Startup ---
medicines = getMedicines();

if ((true)) {
  // Already logged in — go straight to app
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('homeView').classList.remove('hidden');
  document.getElementById('bottomNav').classList.remove('hidden');

navigateTo('home');

} else {
  // Show login, hide everything else
  document.getElementById('loginView').classList.remove('hidden');
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('elderlyView').classList.add('hidden');
  document.getElementById('caregiverView').classList.add('hidden');
  document.getElementById('bottomNav').classList.add('hidden');
}

const sendBtn = document.createElement('button');

sendBtn.innerText = 'Send Medicine Alert';

sendBtn.style.padding = '10px 20px';
sendBtn.style.backgroundColor = '#2563eb';
sendBtn.style.color = 'white';
sendBtn.style.border = 'none';
sendBtn.style.borderRadius = '8px';
sendBtn.style.cursor = 'pointer';
sendBtn.style.margin = '20px';

sendBtn.addEventListener('click', sendMedicineAlert);
document.body.appendChild(sendBtn);
