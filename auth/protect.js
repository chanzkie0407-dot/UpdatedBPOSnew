import { logout } from './login.js';

export function requireAuth(allowedRoles) {
  const userData = localStorage.getItem('currentUser');
  
  if (!userData) {
    alert('⚠️ Please log in first.');
    logout();
    return null;
  }
  
  const user = JSON.parse(userData);
  
  if (!allowedRoles.includes(user.role)) {
    alert('🚫 Access Denied — You do not have permission to view this page.');
    logout();
    return null;
  }
  
  return user;
}
