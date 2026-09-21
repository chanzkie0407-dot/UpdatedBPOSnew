// ==============================================
// BPOS — ROLE-BASED ACCESS CONTROL
// Updated: 2026-09-21
// Roles: admin | cashier | service_provider
// ==============================================

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

// Role list — huwag babaguhin
const ROLES = {
  ADMIN: "admin",
  CASHIER: "cashier",
  SERVICE_PROVIDER: "service_provider"
};

// Current user storage
let currentUserData = null;
let currentUserRole = null;

// --------------------------
// Check & Load User Role
// --------------------------
export function initRoleProtection() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      currentUserData = null;
      currentUserRole = null;
      if (!window.location.pathname.includes("login.html")) {
        window.location.href = "login.html";
      }
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        console.error("User record not found");
        await auth.signOut();
        window.location.href = "login.html";
        return;
      }

      currentUserData = { uid: user.uid, ...snap.data() };
      currentUserRole = currentUserData.role || null;

      console.log("✅ Logged in as:", currentUserRole);
      applyRoleRestrictions();
      redirectByRole();

    } catch (err) {
      console.error("Role load error:", err);
      await auth.signOut();
      window.location.href = "login.html";
    }
  });
}

// --------------------------
// Hide elements by role
// --------------------------
function applyRoleRestrictions() {
  if (!currentUserRole) return;

  // Hide ALL role-specific elements first
  document.querySelectorAll("[data-role]").forEach(el => {
    const allowed = el.getAttribute("data-role").split(",");
    if (!allowed.includes(currentUserRole)) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
  });

  // Chat separation
  document.querySelectorAll(".chat-space").forEach(el => {
    const ownerRole = el.getAttribute("data-chat-role");
    if (ownerRole !== currentUserRole) {
      el.style.display = "none";
    }
  });
}

// --------------------------
// Auto-redirect after login
// --------------------------
function redirectByRole() {
  const page = window.location.pathname.split("/").pop() || "index.html";

  const routes = {
    [ROLES.ADMIN]: "admin-dashboard.html",
    [ROLES.CASHIER]: "cashier-dashboard.html",
    [ROLES.SERVICE_PROVIDER]: "sp-dashboard.html"
  };

  const allowedPages = {
    [ROLES.ADMIN]: ["admin-dashboard.html", "products.html", "settings.html", "chat.html", "index.html"],
    [ROLES.CASHIER]: ["cashier-dashboard.html", "pos.html", "transactions.html", "chat.html", "index.html"],
    [ROLES.SERVICE_PROVIDER]: ["sp-dashboard.html", "services.html", "chat.html", "index.html"]
  };

  // Bawal na page? Ipadala sa tamang dashboard
  if (!allowedPages[currentUserRole].includes(page)) {
    window.location.href = routes[currentUserRole];
  }
}

// --------------------------
// Helper: Check permission
// --------------------------
export function isAdmin() { return currentUserRole === ROLES.ADMIN; }
export function isCashier() { return currentUserRole === ROLES.CASHIER; }
export function isServiceProvider() { return currentUserRole === ROLES.SERVICE_PROVIDER; }
export function getUserRole() { return currentUserRole; }
export function hasPermission(requiredRoles) {
  return requiredRoles.includes(currentUserRole);
}
