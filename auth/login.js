// login.js — Logout helper
export function logout(redirectTo = 'login.html') {
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('migrated');
  window.location.href = redirectTo;
}

// Save login session
export function setLoggedInUser(userData) {
  sessionStorage.setItem('currentUser', JSON.stringify(userData));
}

// Get current user
export function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}
