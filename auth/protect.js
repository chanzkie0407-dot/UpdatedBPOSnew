// protect.js — Role-based access control
export function requireAuth(allowedRoles = []) {
  const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    alert('Access denied — You do not have permission to view this page.');
    window.location.href = 'login.html';
    return null;
  }
  return user;
}
