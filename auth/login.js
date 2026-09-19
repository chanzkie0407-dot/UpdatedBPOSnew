import { VALID_USERS } from '../shared/auth-config.js';

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value;

  let user = VALID_USERS.find(u => u.role === role && u.password === password);
  
  if (!user && role === 'cashier') {
    const cashiers = JSON.parse(localStorage.getItem('cashiers') || '[]');
    const match = cashiers.find(c => c.password === password);
    if (match) user = { id: match.id, name: match.name, role: 'cashier', storeId: match.storeId };
  }

  if (!user) return alert('Invalid password!');

  localStorage.setItem('currentUser', JSON.stringify(user));
  redirectByRole(user.role);
});

function redirectByRole(role) {
  if (role === 'admin') window.location.href = '../pages/admin/dashboard.html';
  else if (role === 'cashier') window.location.href = '../pages/cashier/dashboard.html';
  else if (role === 'service_provider') window.location.href = '../pages/sp/dashboard.html';
}

export function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
