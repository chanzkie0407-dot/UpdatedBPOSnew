import { VALID_USERS } from '../shared/auth-config.js';

// Login form handler
document.addEventListener('submit', e => {
  if (e.target?.id !== 'login-form') return;
  e.preventDefault();
  
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value;
  let user = VALID_USERS.find(u => u.role === role && u.password === password);
  
  if (!user && role === 'cashier') {
    const cashiers = JSON.parse(localStorage.getItem('cashiers') || '[]');
    const match = cashiers.find(c => c.password === password);
    if (match) {
      user = { 
        id: match.id, 
        name: match.name || `${match.fname} ${match.lname || ''}`.trim(),
        fname: match.fname,
        lname: match.lname,
        role: 'cashier', 
        storeId: match.storeId 
      };
    }
  }
  
  if (!user) {
    alert('Invalid password!');
    return;
  }
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  redirectByRole(user.role);
});

function redirectByRole(role) {
  if (role === 'admin') {
    window.location.href = '../pages/admin/dashboard.html';
  } else if (role === 'cashier') {
    window.location.href = '../pages/cashier/dashboard.html';
  } else if (role === 'service_provider') {
    window.location.href = '../pages/sp/dashboard.html';
  }
}

export function logout() {
  localStorage.removeItem('currentUser');
  const pwFields = document.querySelectorAll('input[type="password"]');
  pwFields.forEach(f => f.value = '');
  window.location.href = 'login.html';
}

// ✅ AYUSIN: Hintayin munang mabuo ang pahina bago hanapin ang button
function initLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  // Kung wala ang button — tahimik lang, walang error ✅
}

// Tumatakbo kapag handa na ang DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogoutButton);
} else {
  initLogoutButton();
}
