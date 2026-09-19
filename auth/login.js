import { VALID_USERS } from '../shared/auth-config.js';

// Login form handler — kept original logic
document.getElementById('login-form').addEventListener('submit', e => {
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
        name: match.name,
        lastName: match.lastName || '',
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

// ✅ Updated logout function — kept your original code
export function logout() {
  localStorage.removeItem('currentUser');
  // Clear password fields on all pages
  const pwFields = document.querySelectorAll('input[type="password"]');
  pwFields.forEach(f => f.value = '');
  window.location.href = 'login.html';
}

// ✅ Added: Safely attach logout button — no error if button doesn't exist
// Linya 38+ — exactly as requested
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function() {
    logout();
  });
}
