import { logout } from './login.js';

export function requireAuth(allowedRoles) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user || !allowedRoles.includes(user.role)) {
    alert('Access denied!');
    logout();
    return false;
  }
  return user;
}
