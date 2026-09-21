/* ============================================================
   COMMERCEHUB — MAIN JAVASCRIPT (Vanilla ES6+)
   ============================================================ */

'use strict';

/* ============================================================
   STATE MANAGEMENT
   ============================================================ */
const AppState = {
  isAuthenticated: false,
  currentView: 'dashboard',
  products: [],
  filters: { search: '', category: '', status: '' },
  pagination: { page: 1, perPage: 8 },
  sort: { field: 'name', direction: 'asc' },
  productToDelete: null,
  selectedEmoji: '📦',
  viewMode: 'table', // 'table' | 'grid'
  notifPanelOpen: false,
  dropdownOpen: false,
};

/* ============================================================
   SEED DATA — Initial Products
   ============================================================ */
const SEED_PRODUCTS = [
  { id: 'p1', emoji: '💻', name: 'MacBook Pro 16"', sku: 'MBP-16-2024', category: 'Electronics', price: 2499.99, stock: 45, threshold: 10, status: 'In Stock', brand: 'Apple', description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD.' },
  { id: 'p2', emoji: '📱', name: 'iPhone 15 Pro Max', sku: 'IPH-15PM-BLK', category: 'Electronics', price: 1199.00, stock: 7, threshold: 10, status: 'Low Stock', brand: 'Apple', description: 'A17 Pro chip, 256GB storage, Titanium design.' },
  { id: 'p3', emoji: '👕', name: 'Merino Wool T-Shirt', sku: 'CLO-MW-MED', category: 'Clothing', price: 49.95, stock: 0, threshold: 5, status: 'Out of Stock', brand: 'Wool&Co', description: 'Ultra-soft 100% merino wool, size medium.' },
  { id: 'p4', emoji: '🎮', name: 'Sony PS5 Console', sku: 'PS5-DISC-WHT', category: 'Electronics', price: 499.99, stock: 22, threshold: 10, status: 'In Stock', brand: 'Sony', description: 'Next-gen gaming with ultra-high speed SSD.' },
  { id: 'p5', emoji: '📚', name: 'Clean Code (Book)', sku: 'BK-CC-MART', category: 'Books', price: 34.99, stock: 120, threshold: 20, status: 'In Stock', brand: "O'Reilly", description: 'A handbook of agile software craftsmanship by Robert C. Martin.' },
  { id: 'p6', emoji: '💄', name: 'Rose Lip Gloss Set', sku: 'BEA-RLG-SET6', category: 'Beauty', price: 28.50, stock: 8, threshold: 10, status: 'Low Stock', brand: 'Luminate', description: 'Set of 6 rose-tinted lip glosses with SPF 15.' },
  { id: 'p7', emoji: '⚽', name: 'Adidas Pro Soccer Ball', sku: 'SPT-SOC-PRO5', category: 'Sports', price: 59.99, stock: 55, threshold: 15, status: 'In Stock', brand: 'Adidas', description: 'FIFA-quality match ball, size 5.' },
  { id: 'p8', emoji: '🏠', name: 'Smart LED Floor Lamp', sku: 'HG-LED-FLR', category: 'Home & Garden', price: 89.00, stock: 33, threshold: 10, status: 'In Stock', brand: 'LumiSmart', description: 'WiFi-enabled RGB floor lamp with app control.' },
  { id: 'p9', emoji: '📦', name: 'Wireless Charging Pad', sku: 'EL-WCP-15W', category: 'Electronics', price: 29.99, stock: 0, threshold: 10, status: 'Out of Stock', brand: 'ChargePro', description: '15W Qi-certified fast wireless charging pad.' },
  { id: 'p10', emoji: '🎸', name: 'Acoustic Guitar Bundle', sku: 'MUS-GTR-AK41', category: 'Sports', price: 199.00, stock: 14, threshold: 5, status: 'In Stock', brand: 'Fender', description: 'Beginner acoustic guitar kit with bag, picks, and tuner.' },
  { id: 'p11', emoji: '🍳', name: 'Non-Stick Cookware Set', sku: 'HG-NCS-10PC', category: 'Home & Garden', price: 139.95, stock: 5, threshold: 8, status: 'Low Stock', brand: 'CookMaster', description: '10-piece PFOA-free non-stick cookware set.' },
  { id: 'p12', emoji: '👕', name: 'Running Jacket Pro', sku: 'SPT-RJP-LRG', category: 'Clothing', price: 129.00, stock: 38, threshold: 10, status: 'In Stock', brand: 'NikeRun', description: 'Lightweight breathable running jacket, reflective.' },
];

/* ============================================================
   LOCAL STORAGE HELPERS
   ============================================================ */
const Storage = {
  KEY_PRODUCTS: 'commercehub_products',
  KEY_SESSION: 'commercehub_session',

  getProducts() {
    try {
      const raw = localStorage.getItem(this.KEY_PRODUCTS);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  saveProducts(products) {
    try { localStorage.setItem(this.KEY_PRODUCTS, JSON.stringify(products)); } catch {}
  },

  getSession() {
    try {
      const raw = localStorage.getItem(this.KEY_SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  saveSession(session) {
    try { localStorage.setItem(this.KEY_SESSION, JSON.stringify(session)); } catch {}
  },

  clearSession() {
    try { localStorage.removeItem(this.KEY_SESSION); } catch {}
  },
};

/* ============================================================
   ID GENERATOR
   ============================================================ */
function generateId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const DOM = {
  // Views
  viewLogin: document.getElementById('view-login'),
  appLayout: document.getElementById('app-layout'),
  views: {
    dashboard: document.getElementById('view-dashboard'),
    products: document.getElementById('view-products'),
    orders: document.getElementById('view-orders'),
    customers: document.getElementById('view-customers'),
    analytics: document.getElementById('view-analytics'),
    settings: document.getElementById('view-settings'),
  },

  // Sidebar
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  sidebarCloseBtn: document.getElementById('sidebar-close-btn'),
  hamburgerBtn: document.getElementById('hamburger-btn'),
  navItems: document.querySelectorAll('.sidebar-nav-item'),

  // Header
  globalSearch: document.getElementById('global-search'),
  notificationsBtn: document.getElementById('notifications-btn'),
  notifPanel: document.getElementById('notification-panel'),
  notifDot: document.getElementById('notif-dot'),
  userAvatarBtn: document.getElementById('user-avatar-btn'),
  headerUser: document.getElementById('header-user'),
  userDropdown: document.getElementById('user-dropdown'),
  markAllReadBtn: document.getElementById('mark-all-read-btn'),

  // Dropdown items
  ddMyProfile: document.getElementById('dd-my-profile'),
  ddAccountSettings: document.getElementById('dd-account-settings'),
  ddLogout: document.getElementById('dd-logout'),

  // Auth
  loginForm: document.getElementById('login-form'),
  loginEmail: document.getElementById('login-email'),
  loginPassword: document.getElementById('login-password'),
  rememberDevice: document.getElementById('remember-device'),
  togglePassword: document.getElementById('toggle-password'),
  loginBtn: document.getElementById('login-btn'),
  loginLoader: document.getElementById('login-loader'),
  emailError: document.getElementById('email-error'),
  passwordError: document.getElementById('password-error'),

  // Dashboard KPIs
  kpiTotal: document.getElementById('kpi-total'),
  kpiInstock: document.getElementById('kpi-instock'),
  kpiLowstock: document.getElementById('kpi-lowstock'),
  kpiOutstock: document.getElementById('kpi-outstock'),
  dashboardDate: document.getElementById('dashboard-date'),
  categoryBars: document.getElementById('category-bars'),

  // Products view
  productSearch: document.getElementById('product-search'),
  categoryFilter: document.getElementById('category-filter'),
  statusFilter: document.getElementById('status-filter'),
  addProductBtn: document.getElementById('add-product-btn'),
  addProductEmptyBtn: document.getElementById('add-product-empty-btn'),
  productsTbody: document.getElementById('products-tbody'),
  productsGridView: document.getElementById('products-grid-view'),
  productsEmptyState: document.getElementById('products-empty-state'),
  tableCount: document.getElementById('table-count'),
  paginationInfo: document.getElementById('pagination-info'),
  paginationControls: document.getElementById('pagination-controls'),
  viewTableBtn: document.getElementById('view-table-btn'),
  viewGridBtn: document.getElementById('view-grid-btn'),
  productsTableWrapper: document.getElementById('products-table-wrapper'),
  selectAll: document.getElementById('select-all-products'),

  // Products KPIs
  prodKpiTotal: document.getElementById('prod-kpi-total'),
  prodKpiInstock: document.getElementById('prod-kpi-instock'),
  prodKpiLowstock: document.getElementById('prod-kpi-lowstock'),
  prodKpiOutstock: document.getElementById('prod-kpi-outstock'),
  productsBadge: document.getElementById('products-count-badge'),

  // Product Modal
  productModalOverlay: document.getElementById('product-modal-overlay'),
  modalTitle: document.getElementById('modal-title'),
  productForm: document.getElementById('product-form'),
  productId: document.getElementById('product-id'),
  productName: document.getElementById('product-name'),
  productSku: document.getElementById('product-sku'),
  productDescription: document.getElementById('product-description'),
  productCategory: document.getElementById('product-category'),
  productPrice: document.getElementById('product-price'),
  productStock: document.getElementById('product-stock'),
  productThreshold: document.getElementById('product-low-stock-threshold'),
  productStatus: document.getElementById('product-status'),
  productBrand: document.getElementById('product-brand'),
  modalEmojiDisplay: document.getElementById('modal-emoji-display'),
  emojiPicker: document.getElementById('emoji-picker'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalCancelBtn: document.getElementById('modal-cancel-btn'),
  modalSaveBtn: document.getElementById('modal-save-btn'),
  nameError: document.getElementById('name-error'),
  skuError: document.getElementById('sku-error'),
  categoryError: document.getElementById('category-error'),
  priceError: document.getElementById('price-error'),
  stockError: document.getElementById('stock-error'),

  // Delete Modal
  deleteModalOverlay: document.getElementById('delete-modal-overlay'),
  deleteProductName: document.getElementById('delete-product-name'),
  deleteModalClose: document.getElementById('delete-modal-close'),
  deleteCancelBtn: document.getElementById('delete-cancel-btn'),
  deleteConfirmBtn: document.getElementById('delete-confirm-btn'),

  // Settings
  profileForm: document.getElementById('profile-form'),
  profileFirstname: document.getElementById('profile-firstname'),
  profileLastname: document.getElementById('profile-lastname'),
  profileEmailInput: document.getElementById('profile-email-input'),
  profilePhone: document.getElementById('profile-phone'),
  profileJobtitle: document.getElementById('profile-jobtitle'),
  profileOrg: document.getElementById('profile-org'),
  profileDisplayName: document.getElementById('profile-display-name'),
  profileDisplayEmail: document.getElementById('profile-display-email'),
  profileAvatarDisplay: document.getElementById('profile-avatar-display'),
  profileStatProducts: document.getElementById('profile-stat-products'),
  cancelProfileBtn: document.getElementById('cancel-profile-btn'),
  changePhotoBtn: document.getElementById('change-photo-btn'),

  passwordForm: document.getElementById('password-form'),
  currentPassword: document.getElementById('current-password'),
  newPassword: document.getElementById('new-password'),
  confirmPassword: document.getElementById('confirm-password'),
  strengthFill: document.getElementById('strength-fill'),
  strengthLabel: document.getElementById('strength-label'),
  passwordMatchError: document.getElementById('password-match-error'),

  revokeAllBtn: document.getElementById('revoke-all-sessions-btn'),

  // Toast
  toastContainer: document.getElementById('toast-container'),
};

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
function showToast(type = 'info', title = '', message = '', duration = 3500) {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      ${message ? `<div class="toast-message">${escapeHtml(message)}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  const closeToast = () => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('.toast-close').addEventListener('click', closeToast);
  DOM.toastContainer.appendChild(toast);
  setTimeout(closeToast, duration);
}

/* ============================================================
   VIEW ROUTER
   ============================================================ */
function switchView(viewName) {
  if (!DOM.views[viewName]) return;

  // Hide all views
  Object.values(DOM.views).forEach(v => {
    v.classList.remove('active-view');
    v.style.display = 'none';
  });

  // Show target
  const target = DOM.views[viewName];
  target.style.display = 'flex';
  target.classList.add('active-view');

  // Update sidebar active state
  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  AppState.currentView = viewName;

  // Close sidebar on mobile after navigation
  closeSidebar();

  // Trigger view-specific initializations
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'products') renderProductsView();
  if (viewName === 'settings') renderSettingsView();
}

/* ============================================================
   SIDEBAR CONTROLS
   ============================================================ */
function openSidebar() {
  DOM.sidebar.classList.add('sidebar-open');
  DOM.sidebarOverlay.classList.add('overlay-visible');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  DOM.sidebar.classList.remove('sidebar-open');
  DOM.sidebarOverlay.classList.remove('overlay-visible');
  document.body.style.overflow = '';
}

/* ============================================================
   AUTHENTICATION
   ============================================================ */
function validateLoginForm() {
  let valid = true;
  const email = DOM.loginEmail.value.trim();
  const password = DOM.loginPassword.value;

  DOM.emailError.textContent = '';
  DOM.passwordError.textContent = '';
  DOM.loginEmail.style.borderColor = '';
  DOM.loginPassword.style.borderColor = '';

  if (!email) {
    DOM.emailError.textContent = 'Email address is required.';
    DOM.loginEmail.style.borderColor = 'var(--color-danger)';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    DOM.emailError.textContent = 'Please enter a valid email address.';
    DOM.loginEmail.style.borderColor = 'var(--color-danger)';
    valid = false;
  }

  if (!password || password.length < 3) {
    DOM.passwordError.textContent = 'Password must be at least 3 characters.';
    DOM.loginPassword.style.borderColor = 'var(--color-danger)';
    valid = false;
  }

  return valid;
}

function loginUser() {
  if (!validateLoginForm()) return;

  // Show loading
  DOM.loginBtn.querySelector('.btn-text').classList.add('hidden');
  DOM.loginLoader.classList.remove('hidden');
  DOM.loginBtn.disabled = true;

  setTimeout(() => {
    AppState.isAuthenticated = true;

    // Save session if "remember device"
    if (DOM.rememberDevice.checked) {
      Storage.saveSession({ email: DOM.loginEmail.value.trim(), remember: true });
    }

    // Transition: hide login, show app
    DOM.viewLogin.classList.add('hidden');
    DOM.appLayout.classList.remove('hidden');

    // Reset button
    DOM.loginBtn.querySelector('.btn-text').classList.remove('hidden');
    DOM.loginLoader.classList.add('hidden');
    DOM.loginBtn.disabled = false;

    switchView('dashboard');
    showToast('success', 'Welcome back!', 'Successfully signed in as Alex Reynolds.');
  }, 1200);
}

function logoutUser() {
  AppState.isAuthenticated = false;
  Storage.clearSession();

  DOM.appLayout.classList.add('hidden');
  DOM.viewLogin.classList.remove('hidden');
  DOM.loginEmail.value = '';
  DOM.loginPassword.value = '';
  DOM.rememberDevice.checked = false;

  closeDropdown();
  showToast('info', 'Signed Out', 'You have been logged out successfully.');
}

/* ============================================================
   DASHBOARD RENDERING
   ============================================================ */
function renderDashboard() {
  const products = AppState.products;
  const total = products.length;
  const instock = products.filter(p => p.status === 'In Stock').length;
  const lowstock = products.filter(p => p.status === 'Low Stock').length;
  const outstock = products.filter(p => p.status === 'Out of Stock').length;

  // Animated counter
  animateCounter(DOM.kpiTotal, total);
  animateCounter(DOM.kpiInstock, instock);
  animateCounter(DOM.kpiLowstock, lowstock);
  animateCounter(DOM.kpiOutstock, outstock);

  // Date
  const now = new Date();
  DOM.dashboardDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Category bars
  renderCategoryBars();

  // Revenue chart
  renderRevenueChart();
}

function animateCounter(el, target) {
  if (!el) return;
  let start = 0;
  const duration = 800;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function renderCategoryBars() {
  if (!DOM.categoryBars) return;
  const categories = {};
  AppState.products.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });

  const total = AppState.products.length || 1;
  const colors = [
    'linear-gradient(90deg, #6366F1, #818CF8)',
    'linear-gradient(90deg, #22C55E, #4ADE80)',
    'linear-gradient(90deg, #F59E0B, #FCD34D)',
    'linear-gradient(90deg, #EF4444, #F87171)',
    'linear-gradient(90deg, #3B82F6, #60A5FA)',
    'linear-gradient(90deg, #EC4899, #F9A8D4)',
  ];

  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);
  DOM.categoryBars.innerHTML = sorted.map(([cat, count], i) => {
    const pct = Math.round((count / total) * 100);
    return `
      <div class="category-bar-item">
        <div class="category-bar-label">
          <span class="category-bar-name">${escapeHtml(cat)}</span>
          <span class="category-bar-value">${count} products (${pct}%)</span>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill" style="width: 0%; background: ${colors[i % colors.length]}" data-width="${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  // Animate bars
  requestAnimationFrame(() => {
    DOM.categoryBars.querySelectorAll('.category-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  });
}

/* ============================================================
   REVENUE CHART (Pure Canvas, no libs)
   ============================================================ */
function renderRevenueChart() {
  const canvas = document.getElementById('revenue-chart');
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const W = rect.width - 48; // account for padding
  const H = 220;

  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);

  // Generate chart data
  const data7d = [4200, 5800, 4900, 7200, 6100, 8400, 9100];
  const labels7d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const data = data7d;
  const labels = labels7d;
  const maxVal = Math.max(...data) * 1.15;
  const minVal = 0;
  const padTop = 20, padBottom = 30, padLeft = 55, padRight = 20;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridCount = 5;
  ctx.strokeStyle = '#F1F5F9';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i <= gridCount; i++) {
    const y = padTop + (chartH / gridCount) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(W - padRight, y);
    ctx.stroke();

    // Y labels
    const val = Math.round(maxVal - (maxVal - minVal) * (i / gridCount));
    ctx.setLineDash([]);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val), padLeft - 8, y + 4);
    ctx.setLineDash([4, 4]);
  }
  ctx.setLineDash([]);

  // Compute points
  const points = data.map((val, i) => ({
    x: padLeft + (i / (data.length - 1)) * chartW,
    y: padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH,
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
  grad.addColorStop(0, 'rgba(99,102,241,0.25)');
  grad.addColorStop(1, 'rgba(99,102,241,0.01)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, padTop + chartH);
  ctx.lineTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cx = (points[i - 1].x + points[i].x) / 2;
    ctx.bezierCurveTo(cx, points[i - 1].y, cx, points[i].y, points[i].x, points[i].y);
  }
  ctx.lineTo(points[points.length - 1].x, padTop + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cx = (points[i - 1].x + points[i].x) / 2;
    ctx.bezierCurveTo(cx, points[i - 1].y, cx, points[i].y, points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#6366F1';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  points.forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // X labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], pt.x, H - 5);
  });
}

/* ============================================================
   PRODUCTS VIEW
   ============================================================ */
function getFilteredProducts() {
  let prods = [...AppState.products];
  const { search, category, status } = AppState.filters;

  if (search) {
    const q = search.toLowerCase();
    prods = prods.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (category) prods = prods.filter(p => p.category === category);
  if (status) prods = prods.filter(p => p.status === status);

  // Sort
  const { field, direction } = AppState.sort;
  prods.sort((a, b) => {
    let va = a[field], vb = b[field];
    if (field === 'price' || field === 'stock') {
      va = parseFloat(va); vb = parseFloat(vb);
    } else {
      va = String(va).toLowerCase(); vb = String(vb).toLowerCase();
    }
    if (va < vb) return direction === 'asc' ? -1 : 1;
    if (va > vb) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return prods;
}

function renderProductsView() {
  updateProductKPIs();
  renderProductsTable();
}

function updateProductKPIs() {
  const prods = AppState.products;
  const total = prods.length;
  const instock = prods.filter(p => p.status === 'In Stock').length;
  const low = prods.filter(p => p.status === 'Low Stock').length;
  const out = prods.filter(p => p.status === 'Out of Stock').length;

  animateCounter(DOM.prodKpiTotal, total);
  animateCounter(DOM.prodKpiInstock, instock);
  animateCounter(DOM.prodKpiLowstock, low);
  animateCounter(DOM.prodKpiOutstock, out);

  if (DOM.productsBadge) DOM.productsBadge.textContent = total;
}

function renderProductsTable() {
  const filtered = getFilteredProducts();
  const { page, perPage } = AppState.pagination;
  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / perPage) || 1;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  // Update count
  DOM.tableCount.textContent = `Showing ${totalFiltered} product${totalFiltered !== 1 ? 's' : ''}`;

  // Empty state
  const isEmpty = filtered.length === 0;
  DOM.productsEmptyState.classList.toggle('hidden', !isEmpty);

  if (AppState.viewMode === 'table') {
    DOM.productsTableWrapper.classList.remove('hidden');
    DOM.productsGridView.classList.add('hidden');
    renderTableRows(paginated);
  } else {
    DOM.productsTableWrapper.classList.add('hidden');
    DOM.productsGridView.classList.remove('hidden');
    renderGridCards(paginated);
  }

  renderPagination(totalFiltered, totalPages, page, perPage, start);
}

function renderTableRows(products) {
  if (products.length === 0) {
    DOM.productsTbody.innerHTML = '';
    return;
  }

  DOM.productsTbody.innerHTML = products.map(p => `
    <tr data-id="${p.id}">
      <td><label class="checkbox-label"><input type="checkbox" class="row-checkbox" data-id="${p.id}" aria-label="Select ${escapeHtml(p.name)}"/><span class="checkbox-custom"></span></label></td>
      <td>
        <div class="product-cell">
          <div class="product-emoji-icon">${p.emoji || '📦'}</div>
          <div>
            <div class="product-name">${escapeHtml(p.name)}</div>
            ${p.brand ? `<div class="product-brand">${escapeHtml(p.brand)}</div>` : ''}
          </div>
        </div>
      </td>
      <td><span class="product-sku">${escapeHtml(p.sku)}</span></td>
      <td>${escapeHtml(p.category)}</td>
      <td class="product-price">$${parseFloat(p.price).toFixed(2)}</td>
      <td><span class="stock-number ${getStockClass(p)}">${p.stock}</span></td>
      <td>${getStatusBadge(p.status)}</td>
      <td>
        <div class="table-actions">
          <button class="action-btn action-btn-edit" data-id="${p.id}" title="Edit product" aria-label="Edit ${escapeHtml(p.name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn action-btn-delete" data-id="${p.id}" title="Delete product" aria-label="Delete ${escapeHtml(p.name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderGridCards(products) {
  if (products.length === 0) {
    DOM.productsGridView.innerHTML = '';
    return;
  }
  DOM.productsGridView.innerHTML = products.map(p => `
    <div class="product-grid-card" data-id="${p.id}">
      <div class="grid-card-emoji">${p.emoji || '📦'}</div>
      <div class="grid-card-body">
        <div class="grid-card-name">${escapeHtml(p.name)}</div>
        <div class="grid-card-meta">${escapeHtml(p.category)} &middot; ${escapeHtml(p.sku)}</div>
        ${getStatusBadge(p.status)}
        <div class="grid-card-footer" style="margin-top: 12px;">
          <span class="grid-card-price">$${parseFloat(p.price).toFixed(2)}</span>
          <div class="grid-card-actions">
            <button class="action-btn action-btn-edit" data-id="${p.id}" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn action-btn-delete" data-id="${p.id}" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPagination(total, totalPages, currentPage, perPage, start) {
  DOM.paginationInfo.textContent = total === 0 ? '' :
    `${start + 1}–${Math.min(start + perPage, total)} of ${total}`;

  DOM.paginationControls.innerHTML = '';
  if (totalPages <= 1) return;

  // Prev
  const prevBtn = createPageBtn('‹', currentPage === 1, () => {
    AppState.pagination.page = currentPage - 1;
    renderProductsTable();
  });
  DOM.paginationControls.appendChild(prevBtn);

  // Page numbers
  const pages = getPaginationRange(currentPage, totalPages);
  pages.forEach(p => {
    if (p === '…') {
      const el = document.createElement('span');
      el.textContent = '…';
      el.style.cssText = 'padding: 0 4px; color: var(--color-text-muted); display:flex;align-items:center;';
      DOM.paginationControls.appendChild(el);
    } else {
      const btn = createPageBtn(p, false, () => {
        AppState.pagination.page = p;
        renderProductsTable();
      });
      if (p === currentPage) btn.classList.add('active');
      DOM.paginationControls.appendChild(btn);
    }
  });

  // Next
  const nextBtn = createPageBtn('›', currentPage === totalPages, () => {
    AppState.pagination.page = currentPage + 1;
    renderProductsTable();
  });
  DOM.paginationControls.appendChild(nextBtn);
}

function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

function createPageBtn(label, disabled, onClick) {
  const btn = document.createElement('button');
  btn.className = 'page-btn';
  btn.textContent = label;
  btn.disabled = disabled;
  if (!disabled) btn.addEventListener('click', onClick);
  return btn;
}

function getStockClass(product) {
  if (product.stock === 0) return 'stock-out';
  if (product.stock <= product.threshold) return 'stock-low';
  return 'stock-ok';
}

function getStatusBadge(status) {
  const map = {
    'In Stock': 'badge-success',
    'Low Stock': 'badge-warning',
    'Out of Stock': 'badge-danger',
  };
  return `<span class="badge ${map[status] || 'badge-info'}">${escapeHtml(status)}</span>`;
}

/* ============================================================
   PRODUCT MODAL — ADD / EDIT
   ============================================================ */
function openAddProductModal() {
  resetProductForm();
  DOM.modalTitle.textContent = 'Add New Product';
  DOM.productId.value = '';
  showModal(DOM.productModalOverlay);
}

function openEditProductModal(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  resetProductForm();
  DOM.modalTitle.textContent = 'Edit Product';
  DOM.productId.value = product.id;
  DOM.productName.value = product.name;
  DOM.productSku.value = product.sku;
  DOM.productDescription.value = product.description || '';
  DOM.productCategory.value = product.category;
  DOM.productPrice.value = product.price;
  DOM.productStock.value = product.stock;
  DOM.productThreshold.value = product.threshold || 10;
  DOM.productStatus.value = product.status;
  DOM.productBrand.value = product.brand || '';

  // Set emoji
  setModalEmoji(product.emoji || '📦');
  showModal(DOM.productModalOverlay);
}

function setModalEmoji(emoji) {
  AppState.selectedEmoji = emoji;
  DOM.modalEmojiDisplay.textContent = emoji;
  DOM.emojiPicker.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.emoji === emoji);
  });
}

function resetProductForm() {
  DOM.productForm.reset();
  DOM.productId.value = '';
  setModalEmoji('📦');
  [DOM.nameError, DOM.skuError, DOM.categoryError, DOM.priceError, DOM.stockError].forEach(el => {
    el.textContent = '';
  });
  [DOM.productName, DOM.productSku, DOM.productCategory, DOM.productPrice, DOM.productStock].forEach(el => {
    el.style.borderColor = '';
  });
}

function validateProductForm() {
  let valid = true;
  const clearErr = (errEl, inputEl) => { errEl.textContent = ''; inputEl.style.borderColor = ''; };
  const setErr = (errEl, inputEl, msg) => { errEl.textContent = msg; inputEl.style.borderColor = 'var(--color-danger)'; valid = false; };

  clearErr(DOM.nameError, DOM.productName);
  clearErr(DOM.skuError, DOM.productSku);
  clearErr(DOM.categoryError, DOM.productCategory);
  clearErr(DOM.priceError, DOM.productPrice);
  clearErr(DOM.stockError, DOM.productStock);

  if (!DOM.productName.value.trim()) setErr(DOM.nameError, DOM.productName, 'Product name is required.');
  if (!DOM.productSku.value.trim()) setErr(DOM.skuError, DOM.productSku, 'SKU is required.');
  if (!DOM.productCategory.value) setErr(DOM.categoryError, DOM.productCategory, 'Please select a category.');
  if (!DOM.productPrice.value || parseFloat(DOM.productPrice.value) < 0) setErr(DOM.priceError, DOM.productPrice, 'Enter a valid price.');
  if (DOM.productStock.value === '' || parseInt(DOM.productStock.value) < 0) setErr(DOM.stockError, DOM.productStock, 'Enter a valid stock quantity.');

  return valid;
}

function saveProduct() {
  if (!validateProductForm()) return;

  const stock = parseInt(DOM.productStock.value);
  const threshold = parseInt(DOM.productThreshold.value) || 10;
  let status = DOM.productStatus.value;

  // Auto-determine status from stock
  if (stock === 0) status = 'Out of Stock';
  else if (stock <= threshold) status = 'Low Stock';
  else status = 'In Stock';

  const productData = {
    emoji: AppState.selectedEmoji,
    name: DOM.productName.value.trim(),
    sku: DOM.productSku.value.trim(),
    description: DOM.productDescription.value.trim(),
    category: DOM.productCategory.value,
    price: parseFloat(DOM.productPrice.value),
    stock,
    threshold,
    status,
    brand: DOM.productBrand.value.trim(),
  };

  const editId = DOM.productId.value;
  if (editId) {
    // Update existing
    const idx = AppState.products.findIndex(p => p.id === editId);
    if (idx !== -1) {
      AppState.products[idx] = { ...AppState.products[idx], ...productData };
      showToast('success', 'Product Updated', `"${productData.name}" has been updated.`);
    }
  } else {
    // Add new
    const newProduct = { id: generateId(), ...productData };
    AppState.products.unshift(newProduct);
    showToast('success', 'Product Added', `"${productData.name}" has been added to your catalog.`);
  }

  Storage.saveProducts(AppState.products);
  hideModal(DOM.productModalOverlay);
  renderProductsView();
  if (AppState.currentView === 'dashboard') renderDashboard();
}

/* ============================================================
   DELETE PRODUCT
   ============================================================ */
function openDeleteModal(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;
  AppState.productToDelete = productId;
  DOM.deleteProductName.textContent = `"${product.name}"`;
  showModal(DOM.deleteModalOverlay);
}

function confirmDelete() {
  if (!AppState.productToDelete) return;
  const product = AppState.products.find(p => p.id === AppState.productToDelete);
  AppState.products = AppState.products.filter(p => p.id !== AppState.productToDelete);
  Storage.saveProducts(AppState.products);
  AppState.productToDelete = null;
  hideModal(DOM.deleteModalOverlay);
  renderProductsView();
  if (AppState.currentView === 'dashboard') renderDashboard();
  showToast('warning', 'Product Deleted', `"${product?.name || 'Product'}" has been removed.`);
}

/* ============================================================
   MODAL HELPERS
   ============================================================ */
function showModal(overlay) {
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function hideModal(overlay) {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ============================================================
   DROPDOWN & NOTIFICATION PANEL
   ============================================================ */
function toggleDropdown() {
  AppState.dropdownOpen = !AppState.dropdownOpen;
  DOM.userDropdown.classList.toggle('hidden', !AppState.dropdownOpen);
  DOM.headerUser.classList.toggle('active', AppState.dropdownOpen);
  DOM.userAvatarBtn.setAttribute('aria-expanded', AppState.dropdownOpen);
  if (AppState.dropdownOpen && AppState.notifPanelOpen) closeNotifPanel();
}

function closeDropdown() {
  AppState.dropdownOpen = false;
  DOM.userDropdown.classList.add('hidden');
  DOM.headerUser.classList.remove('active');
  DOM.userAvatarBtn.setAttribute('aria-expanded', 'false');
}

function toggleNotifPanel() {
  AppState.notifPanelOpen = !AppState.notifPanelOpen;
  DOM.notifPanel.classList.toggle('hidden', !AppState.notifPanelOpen);
  if (AppState.notifPanelOpen) {
    closeDropdown();
    // Mark as read visually
    DOM.notifDot?.classList.add('hidden');
  }
}

function closeNotifPanel() {
  AppState.notifPanelOpen = false;
  DOM.notifPanel.classList.add('hidden');
}

/* ============================================================
   SETTINGS VIEW
   ============================================================ */
function renderSettingsView() {
  const total = AppState.products.length;
  if (DOM.profileStatProducts) DOM.profileStatProducts.textContent = total;
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function updatePasswordStrength(password) {
  const score = getPasswordStrength(password);
  const fill = DOM.strengthFill;
  const label = DOM.strengthLabel;
  if (!fill || !label) return;

  const levels = [
    { pct: 0, color: '#e2e8f0', text: 'Enter a password', textColor: 'var(--color-text-muted)' },
    { pct: 20, color: '#EF4444', text: 'Very Weak', textColor: 'var(--color-danger)' },
    { pct: 40, color: '#F59E0B', text: 'Weak', textColor: 'var(--color-warning)' },
    { pct: 60, color: '#F59E0B', text: 'Fair', textColor: 'var(--color-warning)' },
    { pct: 80, color: '#22C55E', text: 'Good', textColor: 'var(--color-success)' },
    { pct: 100, color: '#16A34A', text: 'Strong', textColor: '#16A34A' },
  ];

  const level = levels[password ? Math.max(1, score) : 0];
  fill.style.width = level.pct + '%';
  fill.style.background = level.color;
  label.textContent = level.text;
  label.style.color = level.textColor;
}

/* ============================================================
   GLOBAL SEARCH (Header)
   ============================================================ */
function handleGlobalSearch(query) {
  const q = query.toLowerCase().trim();
  if (!q) return;
  // Navigate to products and apply search
  AppState.filters.search = q;
  AppState.pagination.page = 1;
  switchView('products');
  DOM.productSearch.value = q;
  renderProductsTable();
}

/* ============================================================
   ESCAPE HTML (XSS prevention)
   ============================================================ */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
function bindEvents() {
  // ---- AUTH ----
  DOM.loginForm.addEventListener('submit', e => { e.preventDefault(); loginUser(); });
  DOM.togglePassword.addEventListener('click', () => {
    const isPass = DOM.loginPassword.type === 'password';
    DOM.loginPassword.type = isPass ? 'text' : 'password';
    const eyeIcon = document.getElementById('eye-icon');
    if (eyeIcon) {
      eyeIcon.innerHTML = isPass
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    }
  });

  document.getElementById('forgot-password-link')?.addEventListener('click', e => {
    e.preventDefault();
    showToast('info', 'Password Reset', 'A reset link has been sent to your email (demo mode).');
  });
  document.getElementById('contact-admin-link')?.addEventListener('click', e => {
    e.preventDefault();
    showToast('info', 'Contact Admin', 'Please reach out to admin@commercehub.io.');
  });

  // ---- SIDEBAR ----
  DOM.hamburgerBtn.addEventListener('click', openSidebar);
  DOM.sidebarCloseBtn.addEventListener('click', closeSidebar);
  DOM.sidebarOverlay.addEventListener('click', closeSidebar);

  DOM.navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  // ---- HEADER ----
  DOM.userAvatarBtn.addEventListener('click', e => { e.stopPropagation(); toggleDropdown(); });
  DOM.headerUser.addEventListener('click', e => { e.stopPropagation(); });
  DOM.userAvatarBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(); } });

  DOM.notificationsBtn.addEventListener('click', e => { e.stopPropagation(); toggleNotifPanel(); });
  DOM.markAllReadBtn?.addEventListener('click', () => {
    DOM.notifPanel.querySelectorAll('.notif-unread').forEach(el => el.classList.remove('notif-unread'));
    showToast('success', 'All Caught Up', 'All notifications marked as read.');
  });

  // Dropdown navigation
  [DOM.ddMyProfile, DOM.ddAccountSettings].forEach(btn => {
    btn?.addEventListener('click', () => { closeDropdown(); switchView('settings'); });
  });
  DOM.ddLogout?.addEventListener('click', () => logoutUser());
  document.getElementById('dd-team')?.addEventListener('click', () => {
    closeDropdown();
    showToast('info', 'Team Management', 'Team management coming soon!');
  });
  document.getElementById('dd-billing')?.addEventListener('click', () => {
    closeDropdown();
    showToast('info', 'Billing', 'Billing portal coming soon!');
  });

  // Dashboard "View all" links
  document.querySelectorAll('.card-link[data-view]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); switchView(link.dataset.view); });
  });

  // Global click outside — close dropdown & notif panel
  document.addEventListener('click', () => {
    if (AppState.dropdownOpen) closeDropdown();
    if (AppState.notifPanelOpen) closeNotifPanel();
  });

  // Escape key closes modals/panels
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!DOM.productModalOverlay.classList.contains('hidden')) hideModal(DOM.productModalOverlay);
      if (!DOM.deleteModalOverlay.classList.contains('hidden')) hideModal(DOM.deleteModalOverlay);
      if (AppState.dropdownOpen) closeDropdown();
      if (AppState.notifPanelOpen) closeNotifPanel();
      if (document.getElementById('sidebar').classList.contains('sidebar-open')) closeSidebar();
    }
  });

  // ---- GLOBAL SEARCH ----
  let globalSearchTimeout;
  DOM.globalSearch.addEventListener('input', e => {
    clearTimeout(globalSearchTimeout);
    globalSearchTimeout = setTimeout(() => handleGlobalSearch(e.target.value), 400);
  });
  DOM.globalSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleGlobalSearch(e.target.value);
  });

  // ---- PRODUCTS VIEW ----
  DOM.addProductBtn.addEventListener('click', openAddProductModal);
  DOM.addProductEmptyBtn?.addEventListener('click', openAddProductModal);

  let searchTimeout;
  DOM.productSearch.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      AppState.filters.search = DOM.productSearch.value;
      AppState.pagination.page = 1;
      renderProductsTable();
    }, 200);
  });

  DOM.categoryFilter.addEventListener('change', () => {
    AppState.filters.category = DOM.categoryFilter.value;
    AppState.pagination.page = 1;
    renderProductsTable();
  });
  DOM.statusFilter.addEventListener('change', () => {
    AppState.filters.status = DOM.statusFilter.value;
    AppState.pagination.page = 1;
    renderProductsTable();
  });

  // View toggle
  DOM.viewTableBtn.addEventListener('click', () => {
    AppState.viewMode = 'table';
    DOM.viewTableBtn.classList.add('active');
    DOM.viewGridBtn.classList.remove('active');
    renderProductsTable();
  });
  DOM.viewGridBtn.addEventListener('click', () => {
    AppState.viewMode = 'grid';
    DOM.viewGridBtn.classList.add('active');
    DOM.viewTableBtn.classList.remove('active');
    renderProductsTable();
  });

  // Select all checkbox
  DOM.selectAll?.addEventListener('change', () => {
    document.querySelectorAll('.row-checkbox').forEach(cb => { cb.checked = DOM.selectAll.checked; });
  });

  // Sortable columns
  document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (AppState.sort.field === field) {
        AppState.sort.direction = AppState.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        AppState.sort.field = field;
        AppState.sort.direction = 'asc';
      }
      renderProductsTable();
    });
  });

  // Table action buttons (delegated)
  DOM.productsTbody.addEventListener('click', e => {
    const editBtn = e.target.closest('.action-btn-edit');
    const deleteBtn = e.target.closest('.action-btn-delete');
    if (editBtn) openEditProductModal(editBtn.dataset.id);
    if (deleteBtn) openDeleteModal(deleteBtn.dataset.id);
  });
  DOM.productsGridView.addEventListener('click', e => {
    const editBtn = e.target.closest('.action-btn-edit');
    const deleteBtn = e.target.closest('.action-btn-delete');
    if (editBtn) openEditProductModal(editBtn.dataset.id);
    if (deleteBtn) openDeleteModal(deleteBtn.dataset.id);
  });

  // Chart period tabs
  document.querySelectorAll('.period-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderRevenueChart();
    });
  });

  // ---- PRODUCT MODAL ----
  DOM.modalCloseBtn.addEventListener('click', () => hideModal(DOM.productModalOverlay));
  DOM.modalCancelBtn.addEventListener('click', () => hideModal(DOM.productModalOverlay));
  DOM.modalSaveBtn.addEventListener('click', saveProduct);
  DOM.productModalOverlay.addEventListener('click', e => {
    if (e.target === DOM.productModalOverlay) hideModal(DOM.productModalOverlay);
  });

  // Emoji picker
  DOM.emojiPicker.addEventListener('click', e => {
    const btn = e.target.closest('.emoji-btn');
    if (btn) setModalEmoji(btn.dataset.emoji);
  });

  // Auto-status based on stock
  DOM.productStock.addEventListener('input', () => {
    const stock = parseInt(DOM.productStock.value);
    const threshold = parseInt(DOM.productThreshold.value) || 10;
    if (!isNaN(stock)) {
      if (stock === 0) DOM.productStatus.value = 'Out of Stock';
      else if (stock <= threshold) DOM.productStatus.value = 'Low Stock';
      else DOM.productStatus.value = 'In Stock';
    }
  });

  // ---- DELETE MODAL ----
  DOM.deleteModalClose.addEventListener('click', () => hideModal(DOM.deleteModalOverlay));
  DOM.deleteCancelBtn.addEventListener('click', () => hideModal(DOM.deleteModalOverlay));
  DOM.deleteConfirmBtn.addEventListener('click', confirmDelete);
  DOM.deleteModalOverlay.addEventListener('click', e => {
    if (e.target === DOM.deleteModalOverlay) hideModal(DOM.deleteModalOverlay);
  });

  // ---- SETTINGS ----
  DOM.profileForm?.addEventListener('submit', e => {
    e.preventDefault();
    const firstName = DOM.profileFirstname.value.trim();
    const lastName = DOM.profileLastname.value.trim();
    const email = DOM.profileEmailInput.value.trim();
    if (firstName && lastName) {
      if (DOM.profileDisplayName) DOM.profileDisplayName.textContent = `${firstName} ${lastName}`;
      if (DOM.profileAvatarDisplay) DOM.profileAvatarDisplay.textContent = (firstName[0] + (lastName[0] || '')).toUpperCase();
      if (DOM.profileDisplayEmail) DOM.profileDisplayEmail.textContent = email;
      showToast('success', 'Profile Updated', 'Your profile information has been saved.');
    }
  });

  DOM.cancelProfileBtn?.addEventListener('click', () => {
    DOM.profileFirstname.value = 'Alex';
    DOM.profileLastname.value = 'Reynolds';
    DOM.profileEmailInput.value = 'alex@commercehub.io';
  });

  DOM.changePhotoBtn?.addEventListener('click', () => {
    showToast('info', 'Change Photo', 'Photo upload functionality coming soon.');
  });

  DOM.newPassword?.addEventListener('input', e => updatePasswordStrength(e.target.value));

  DOM.passwordForm?.addEventListener('submit', e => {
    e.preventDefault();
    const newPass = DOM.newPassword?.value;
    const confirmPass = DOM.confirmPassword?.value;

    if (DOM.passwordMatchError) DOM.passwordMatchError.classList.add('hidden');
    if (newPass !== confirmPass) {
      DOM.passwordMatchError?.classList.remove('hidden');
      return;
    }
    if (!newPass || newPass.length < 6) {
      showToast('error', 'Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    showToast('success', 'Password Updated', 'Your password has been changed successfully.');
    DOM.passwordForm.reset();
    updatePasswordStrength('');
  });

  DOM.revokeAllBtn?.addEventListener('click', () => {
    const items = document.querySelectorAll('.session-item:not(.current-session)');
    items.forEach(item => item.style.opacity = '0.3');
    showToast('warning', 'Sessions Revoked', 'All other sessions have been terminated.');
  });

  document.querySelectorAll('.session-revoke-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.session-item');
      if (li) li.style.opacity = '0.3';
      showToast('success', 'Session Revoked', 'The session has been terminated.');
    });
  });

  // Password toggles in settings
  document.querySelectorAll('.input-toggle-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (input) input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // Window resize — re-render chart
  window.addEventListener('resize', debounce(() => {
    if (AppState.currentView === 'dashboard') renderRevenueChart();
  }, 300));
}

/* ============================================================
   DEBOUNCE UTILITY
   ============================================================ */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ============================================================
   INITIALIZE APP
   ============================================================ */
function initApp() {
  // Load products from localStorage or use seed data
  const stored = Storage.getProducts();
  AppState.products = stored && stored.length > 0 ? stored : [...SEED_PRODUCTS];
  if (!stored || stored.length === 0) {
    Storage.saveProducts(AppState.products);
  }

  // Check for existing session
  const session = Storage.getSession();
  if (session && session.remember) {
    // Auto-login
    AppState.isAuthenticated = true;
    DOM.viewLogin.classList.add('hidden');
    DOM.appLayout.classList.remove('hidden');
    if (session.email) DOM.loginEmail.value = session.email;
    switchView('dashboard');
  } else {
    // Show login
    DOM.viewLogin.classList.remove('hidden');
    DOM.appLayout.classList.add('hidden');
    // Hide all views initially
    Object.values(DOM.views).forEach(v => { v.style.display = 'none'; v.classList.remove('active-view'); });
  }

  bindEvents();
  updateProductKPIs();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
