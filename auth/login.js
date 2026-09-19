// login.js — Complete with Firebase auth
export function logout(redirectTo = 'login.html') {
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('migrated');
  window.location.href = redirectTo;
}

export function setLoggedInUser(userData) {
  sessionStorage.setItem('currentUser', JSON.stringify(userData));
}

export function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}

// ===== Verify Login =====
export async function verifyLogin(role, password) {
  // Helper to get data from Firebase
  async function getData(key) {
    try {
      const db = firebase.firestore();
      const snap = await db.collection('data').doc(key).get();
      return snap.exists ? snap.data()?.value : [];
    } catch (e) {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : [];
    }
  }

  if (role === 'admin') {
    const admins = await getData('adminAccounts');
    const admin = admins.find(a => a.password === password);
    if (admin) {
      return { success: true, user: {
        id: admin.id,
        name: admin.username,
        role: 'admin'
      }};
    }
  } else if (role === 'cashier') {
    const cashiers = await getData('cashiers');
    const cashier = cashiers.find(c => c.password === password);
    if (cashier) {
      return { success: true, user: {
        id: cashier.id,
        name: `${cashier.fname} ${cashier.lname || ''}`.trim(),
        role: 'cashier',
        storeId: cashier.storeId
      }};
    }
  } else if (role === 'service_provider') {
    // SP default password or from adminAccounts
    const admins = await getData('adminAccounts');
    const sp = admins.find(a => a.isSP === true || a.username === 'sp');
    if (sp && sp.password === password) {
      return { success: true, user: {
        id: sp.id || 'sp-main',
        name: 'Service Provider',
        role: 'service_provider'
      }};
    }
  }
  
  return { success: false, message: 'Invalid password or role not found' };
}
