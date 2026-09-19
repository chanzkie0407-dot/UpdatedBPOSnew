import { VALID_USERS } from '../shared/auth-config.js';

document.addEventListener('submit', e => {
  if (e.target?.id !== 'login-form') return;
  e.preventDefault();
  
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value.trim();
  
  if (!role || !password) return alert('Select role and enter password.');
  
  let user = VALID_USERS.find(u => u.role === role && u.password === password);
  
  // Cashier: check locally created accounts
  if (!user && role === 'cashier') {
    const cashiers = JSON.parse(localStorage.getItem('cashiers') || '[]');
    const match = cashiers.find(c => c.password === password);
    if (match) {
      user = {
        id: match.id,
        name: `${match.fname} ${match.lname || ''}`.trim() || match.name,
        fname: match.fname,
        lname: match.lname,
        role: 'cashier',
        storeId: match.storeId
      };
    }
  }
  
  // Admin: check SP-created admin accounts
  if (!user && role === 'admin') {
    const admins = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
    const match = admins.find(a => a.password === password);
    if (match) {
      user = {
        id: match.id,
        name: match.name,
        username: match.username,
        role: 'admin'
      };
    }
  }
  
  // SP: check SP master account
  if (!user && role === 'service_provider') {
    const spAccount = JSON.parse(localStorage.getItem('spAccount') || null);
    if (spAccount && spAccount.password === password) {
      user = {
        id: 'sp-master',
        name: 'Service Provider',
        role: 'service_provider'
      };
    }
  }
  
  if (!user) {
    alert('❌ Invalid password! Please try again.');
    document.getElementById('password').value = '';
    return;
  }
  
  // Save session
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Clear password field
  document.getElementById('password').value = '';
  
  // Redirect
  redirectByRole(user.role);
});

function redirectByRole(role) {
  const paths = {
    admin: '../pages/admin/dashboard.html',
    cashier: '../pages/cashier/dashboard.html',
    service_provider: '../pages/sp/dashboard.html'
  };
  window.location.href = paths[role] || '../auth/login.html';
}

export function logout() {
  localStorage.removeItem('currentUser');
  document.querySelectorAll('input[type="password"]').forEach(f => f.value = '');
  
  const path = window.location.pathname;
  if (path.includes('/pages/')) {
    window.location.href = '../../auth/login.html';
  } else {
    window.location.href = 'login.html';
  }
}

// Logout button handler
function initLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Log out? Password fields will be cleared.')) {
        document.querySelectorAll('input[type="password"]').forEach(el => el.value = '');
        logout();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogoutButton);
} else {
  initLogoutButton();
}
