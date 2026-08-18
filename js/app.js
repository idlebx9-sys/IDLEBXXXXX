/* ===== IDLEB STORE - Full App with EmailJS OTP ===== */
(function() {
  'use strict';

  console.log('✅ IDLEB STORE loading...');

  // ========== STORAGE KEYS ==========
  var KEYS = {
    categories: 'idleb_categories',
    products: 'idleb_products',
    users: 'idleb_users',
    pendingUsers: 'idleb_pending_users',
    currentUser: 'idleb_current_user',
    cart: 'idleb_cart',
    topups: 'idleb_topups',
    orders: 'idleb_orders',
    adminSession: 'idleb_admin_session',
    settings: 'idleb_site_settings'
  };

  // ========== ADMIN ==========
  var ADMIN_USER = 'admin';
  var ADMIN_PASS = 'Idleb@2025';

  // ========== EMAILJS SETTINGS ==========
  var EMAILJS_CONFIG = {
    publicKey: '-MV0a0jjrdW0VbOML',
    serviceId: 'service_y22dlbp',
    templateId: 'template_ncqtx0e'
  };

  // ========== HELPERS ==========
  function load(key, fallback) {
    try {
      var data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch(e) {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function toast(msg, isError) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(function() { el.classList.remove('show'); }, 3500);
  }

  function formatPrice(n) {
    return Number(n).toLocaleString('ar-SY') + ' $';
  }

  function placeholderImg(text) {
    return 'https://placehold.co/400x250/8b5cf6/ffffff?text=' + encodeURIComponent(text);
  }

  function typeLabel(t) {
    var map = {
      accounts: 'تبنيد',
      unban: 'فك باند',
      boost_followers: 'رشق متابعين',
      boost_engagement: 'رشق تفاعل',
      boost_views: 'رشق مشاهدات',
      games: 'شحن ألعاب',
      other: 'خدمة أخرى'
    };
    return map[t] || t;
  }

  function generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  // ========== DEFAULT DATA ==========
  var DEFAULT_CATEGORIES = [
    { id: 'cat1', name: 'تبنيد حسابات', image: '', order: 1 },
    { id: 'cat2', name: 'فك باند', image: '', order: 2 },
    { id: 'cat3', name: 'خدمات الرشق', image: '', order: 3 },
    { id: 'cat4', name: 'شحن ألعاب', image: '', order: 4 }
  ];

  var DEFAULT_PRODUCTS = [
    { id: 'p1', name: 'تبنيد انستغرام', desc: 'حسابات انستغرام جاهزة', price: 15, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 42 },
    { id: 'p2', name: 'تبنيد فيسبوك', desc: 'حسابات فيسبوك قديمة', price: 12, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 35 },
    { id: 'p3', name: 'تبنيد تليجرام', desc: 'أرقام تليجرام جاهزة', price: 10, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 28 },
    { id: 'p4', name: 'تبنيد واتساب', desc: 'أرقام واتساب مع تحقق', price: 18, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 50 },
    { id: 'p5', name: 'فك باند انستغرام', desc: 'فك حظر انستغرام', price: 25, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 60 },
    { id: 'p6', name: 'فك باند واتساب', desc: 'استعادة رقم محظور', price: 30, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 45 },
    { id: 'p7', name: 'فك باند فيسبوك', desc: 'فك حظر حسابات فيسبوك', price: 22, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 33 },
    { id: 'p8', name: 'فك باند تليجرام', desc: 'فك حظر قنوات', price: 20, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 20 },
    { id: 'p9', name: 'فك باند تيك توك', desc: 'استعادة حسابات تيك توك', price: 28, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 38 },
    { id: 'p10', name: 'رشق متابعين انستغرام', desc: 'كل 1000 متابع', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 90, pricingNote: 'كل 1000 متابع = 2$' },
    { id: 'p11', name: 'رشق تفاعل انستغرام', desc: 'كل 1000 تفاعل', price: 1.5, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_engagement', active: true, sales: 55, pricingNote: 'كل 1000 تفاعل = 1.5$' },
    { id: 'p12', name: 'رشق مشاهدات', desc: 'كل 1000 مشاهدة', price: 1, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_views', active: true, sales: 40, pricingNote: 'كل 1000 مشاهدة = 1$' },
    { id: 'p13', name: 'رشق متابعين تيك توك', desc: 'كل 1000 متابع', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 75, pricingNote: 'كل 1000 متابع = 2$' },
    { id: 'p14', name: 'رشق أعضاء تليجرام', desc: 'كل 1000 عضو', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 30, pricingNote: 'كل 1000 عضو = 2$' },
    { id: 'p15', name: 'شحن ببجي', desc: 'شحن UC', price: 10, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 120, pricingNote: 'كل 1 وحدة = 10$' },
    { id: 'p16', name: 'شحن لودو', desc: 'شحن عملات', price: 8, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 65, pricingNote: 'كل 1 وحدة = 8$' },
    { id: 'p17', name: 'شحن جواكر', desc: 'شحن عملات', price: 7, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 48, pricingNote: 'كل 1 وحدة = 7$' },
    { id: 'p18', name: 'شحن فري فاير', desc: 'شحن جواهر', price: 9, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 95, pricingNote: 'كل 1 وحدة = 9$' }
  ];

  // ========== INIT DATA ==========
  function initData() {
    if (!localStorage.getItem(KEYS.categories)) save(KEYS.categories, DEFAULT_CATEGORIES);
    if (!localStorage.getItem(KEYS.products)) save(KEYS.products, DEFAULT_PRODUCTS);
    if (!localStorage.getItem(KEYS.users)) save(KEYS.users, []);
    if (!localStorage.getItem(KEYS.pendingUsers)) save(KEYS.pendingUsers, []);
    if (!localStorage.getItem(KEYS.topups)) save(KEYS.topups, []);
    if (!localStorage.getItem(KEYS.orders)) save(KEYS.orders, []);
    if (!localStorage.getItem(KEYS.cart)) save(KEYS.cart, []);
  }

  // ========== STATE ==========
  var currentUser = null;
  var cart = [];
  var adminLoggedIn = false;
  var pendingVerificationUser = null;

  function loadState() {
    currentUser = load(KEYS.currentUser, null);
    cart = load(KEYS.cart, []);
    adminLoggedIn = !!sessionStorage.getItem(KEYS.adminSession);
    updateUI();
  }

  function updateUI() {
    var loginBtn = document.getElementById('loginNavBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    var balanceEl = document.getElementById('userBalance');
    var balAmount = document.getElementById('balanceAmount');
    var walletBal = document.getElementById('walletBalance');

    if (currentUser) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
      if (balanceEl) balanceEl.classList.remove('hidden');
      if (balAmount) balAmount.textContent = formatPrice(currentUser.balance || 0);
      if (walletBal) walletBal.textContent = formatPrice(currentUser.balance || 0);
    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
      if (balanceEl) balanceEl.classList.add('hidden');
      if (walletBal) walletBal.textContent = '0 $';
    }

    var badge = document.getElementById('cartBadge');
    if (badge) {
      var count = 0;
      for (var i = 0; i < cart.length; i++) count += cart[i].qty;
      badge.textContent = count;
    }
  }

  // ========== EMAILJS ==========
  function initEmailJS() {
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS not loaded');
      return false;
    }
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      return true;
    } catch(e) {
      console.error('EmailJS init error:', e);
      return false;
    }
  }

  window.sendVerificationEmail = async function(user) {
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS library not loaded');
    }
    if (!user || !user.email) {
      throw new Error('Email required');
    }

    var code = generateOTP();
    var expiry = 24;
    var expiresAt = new Date(Date.now() + expiry * 60 * 60 * 1000).toISOString();

    var pending = load(KEYS.pendingUsers, []);
    var existing = null;
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].email === user.email || pending[i].username === user.username) {
        existing = pending[i];
        break;
      }
    }

    var record = {
      username: user.username,
      email: user.email,
      password: user.password,
      verification_code: code,
      expiresAt: expiresAt,
      createdAt: new Date().toISOString()
    };

    if (existing) {
      for (var key in record) {
        existing[key] = record[key];
      }
    } else {
      pending.push(record);
    }
    save(KEYS.pendingUsers, pending);
    pendingVerificationUser = record;

    if (!initEmailJS()) {
      throw new Error('EmailJS init failed');
    }

    var params = {
      to_email: user.email,
      email: user.email,
      username: user.username,
      name: user.username,
      verification_code: code,
      code: code,
      otp: code,
      expiry_hours: expiry
    };

    console.log('📧 Sending OTP to:', user.email, 'Code:', code);

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params);
      console.log('✅ Email sent successfully');
    } catch(e) {
      console.error('❌ Email send error:', e);
      throw new Error('Failed to send email: ' + (e.text || e.message));
    }

    return { code: code, expiresAt: expiresAt };
  };

  // ========== VERIFY OTP ==========
  window.verifyOTP = function() {
    console.log('🔐 verifyOTP called');
    
    var codeInput = document.getElementById('verificationCodeInput');
    var emailInput = document.getElementById('authEmail');
    var usernameInput = document.getElementById('authUsername');
    
    if (!codeInput || !emailInput || !usernameInput) {
      toast('حدث خطأ في الصفحة', true);
      return;
    }
    
    var code = codeInput.value.trim();
    var email = emailInput.value.trim().toLowerCase();
    var username = usernameInput.value.trim();

    console.log('📝 Verifying - Code:', code, 'Email:', email, 'Username:', username);

    if (!code || code.length !== 6) {
      toast('أدخل رمز التفعيل المكوّن من 6 أرقام', true);
      return;
    }

    var pending = load(KEYS.pendingUsers, []);
    console.log('📋 Pending users:', pending);
    
    var user = null;
    var idx = -1;

    for (var i = 0; i < pending.length; i++) {
      if (pending[i].email === email || pending[i].username === username) {
        user = pending[i];
        idx = i;
        break;
      }
    }

    if (!user) {
      toast('لم يتم العثور على حساب بانتظار التفعيل', true);
      return;
    }

    console.log('👤 Found pending user:', user);
    console.log('🔑 Stored code:', user.verification_code, 'Entered code:', code);

    if (user.expiresAt && Date.now() > new Date(user.expiresAt).getTime()) {
      toast('انتهت صلاحية الرمز، يرجى طلب رمز جديد', true);
      return;
    }

    if (String(user.verification_code) !== String(code)) {
      toast('❌ رمز التفعيل غير صحيح', true);
      return;
    }

    var users = load(KEYS.users, []);
    var newUser = {
      username: user.username,
      email: user.email,
      password: user.password,
      balance: 0,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      createdAt: user.createdAt || new Date().toISOString()
    };

    var exists = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === user.username || users[i].email === user.email) {
        users[i] = newUser;
        exists = true;
        break;
      }
    }
    if (!exists) users.push(newUser);

    save(KEYS.users, users);
    
    pending.splice(idx, 1);
    save(KEYS.pendingUsers, pending);

    var codeBox = document.getElementById('verificationCodeBox');
    var retryBox = document.getElementById('verificationRetryBox');
    if (codeBox) codeBox.classList.add('hidden');
    if (retryBox) retryBox.classList.add('hidden');

    toast('✅ تم تفعيل حسابك بنجاح!');
    
    currentUser = { username: user.username, email: user.email, balance: 0 };
    save(KEYS.currentUser, currentUser);
    updateUI();
    
    setTimeout(function() {
      showPage('home');
    }, 500);
  };

  // ========== RESEND VERIFICATION ==========
  window.resendVerification = async function() {
    console.log('🔄 resendVerification called');
    
    var emailInput = document.getElementById('authEmail');
    var usernameInput = document.getElementById('authUsername');
    
    if (!emailInput || !usernameInput) {
      toast('حدث خطأ في الصفحة', true);
      return;
    }
    
    var email = emailInput.value.trim().toLowerCase();
    var username = usernameInput.value.trim();

    console.log('📝 Resend - Email:', email, 'Username:', username);

    if (!email && !username) {
      toast('أدخل البريد الإلكتروني أو اسم المستخدم', true);
      return;
    }

    var pending = load(KEYS.pendingUsers, []);
    var user = null;
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].email === email || pending[i].username === username) {
        user = pending[i];
        break;
      }
    }

    if (!user) {
      toast('لم يتم العثور على حساب بانتظار التفعيل', true);
      return;
    }

    try {
      toast('📧 جاري إرسال رمز جديد...');
      await window.sendVerificationEmail(user);
      
      var retryMessage = document.getElementById('verificationRetryMessage');
      if (retryMessage) {
        retryMessage.textContent = '✅ تم إرسال رمز جديد إلى ' + user.email;
      }
      
      toast('✅ تم إرسال رمز جديد إلى بريدك الإلكتروني');
    } catch(e) {
      console.error('❌ Resend error:', e);
      toast('❌ فشل إرسال البريد: ' + e.message, true);
    }
  };

  // ========== NAVIGATION ==========
  window.showPage = function(pageId, param) {
    console.log('📍 Navigating to:', pageId, param);
    
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove('active');
    }
    var page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');

    var navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('open');

    if (pageId === 'home') renderHome();
    if (pageId === 'categories') renderCategories();
    if (pageId === 'category' && param) renderCategoryProducts(param);
    if (pageId === 'cart') renderCart();
    if (pageId === 'about') renderAbout();

    if (pageId === 'admin') {
      if (adminLoggedIn) {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        switchAdminTab('stats');
      } else {
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
      }
    }

    if (pageId === 'category' && param) {
      history.replaceState(null, '', '#category/' + param);
    } else if (pageId === 'product-detail' && param) {
      history.replaceState(null, '', '#product/' + param);
    } else if (pageId !== 'home') {
      history.replaceState(null, '', '#' + pageId);
    } else {
      history.replaceState(null, '', '#home');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ========== RENDER HOME ==========
  function renderHome() {
    console.log('🏠 Rendering home...');
    
    var cats = load(KEYS.categories, []).sort(function(a, b) { return a.order - b.order; });
    var allProds = load(KEYS.products, []);
    var prods = [];
    for (var i = 0; i < allProds.length; i++) {
      if (allProds[i].active) prods.push(allProds[i]);
    }
    prods.sort(function(a, b) { return (b.sales || 0) - (a.sales || 0); });
    prods = prods.slice(0, 6);

    var catGrid = document.getElementById('homeCategories');
    if (catGrid) {
      var html = '';
      for (var i = 0; i < cats.length; i++) {
        var c = cats[i];
        html += '<div class="category-card" onclick="showPage(\'category\', \'' + c.id + '\')" style="cursor:pointer;">';
        html += '<img src="' + (c.image || placeholderImg(c.name)) + '" alt="' + c.name + '" style="width:100%; height:150px; object-fit:cover;">';
        html += '<div class="card-body" style="padding:12px;"><h3 style="margin:0; text-align:center;">' + c.name + '</h3></div></div>';
      }
      catGrid.innerHTML = html;
    }

    var bestEl = document.getElementById('bestSellers');
    if (bestEl) {
      var html2 = '';
      for (var i = 0; i < prods.length; i++) {
        html2 += productCardHTML(prods[i]);
      }
      bestEl.innerHTML = html2;
    }
  }

  // ========== PRODUCT CARD HTML ==========
  function productCardHTML(p) {
    return '<div class="product-card" style="cursor:pointer; background:#14131a; border-radius:14px; border:1px solid #2a2735; overflow:hidden; transition:0.2s; hover:border-color:#8b5cf6;">' +
      '<img src="' + (p.image || placeholderImg(p.name)) + '" alt="' + p.name + '" style="width:100%; height:150px; object-fit:cover; background:#1c1b24;">' +
      '<div class="card-body" style="padding:12px;">' +
      '<span class="product-type" style="display:inline-block; background:rgba(139,92,246,0.12); color:#8b5cf6; padding:2px 10px; border-radius:6px; font-size:0.65rem;">' + typeLabel(p.type) + '</span>' +
      '<h3 style="margin:6px 0 2px; font-size:0.95rem; color:#f4f2f8;">' + p.name + '</h3>' +
      '<p style="color:#9b96a8; font-size:0.8rem; margin:0 0 8px;">' + (p.desc || '') + '</p>' +
      '<div class="product-price" style="font-size:1rem; font-weight:700; color:#8b5cf6; margin-bottom:8px;">' + formatPrice(p.price) + '</div>' +
      '<button class="btn btn-primary btn-full" onclick="event.stopPropagation(); openProductDetail(\'' + p.id + '\')" style="width:100%; padding:8px; font-size:0.8rem; border-radius:8px; background:#8b5cf6; color:#fff; border:none; cursor:pointer;">📦 عرض التفاصيل</button>' +
      '</div></div>';
  }

  // ========== CATEGORIES ==========
  function renderCategories() {
    console.log('📂 Rendering categories...');
    
    var cats = load(KEYS.categories, []).sort(function(a, b) { return a.order - b.order; });
    var grid = document.getElementById('allCategories');
    if (!grid) return;
    
    var html = '';
    for (var i = 0; i < cats.length; i++) {
      var c = cats[i];
      html += '<div class="category-card" onclick="showPage(\'category\', \'' + c.id + '\')" style="cursor:pointer; background:#14131a; border-radius:14px; border:1px solid #2a2735; overflow:hidden; transition:0.2s;">';
      html += '<img src="' + (c.image || placeholderImg(c.name)) + '" alt="' + c.name + '" style="width:100%; height:150px; object-fit:cover;">';
      html += '<div class="card-body" style="padding:12px;"><h3 style="margin:0; text-align:center; color:#f4f2f8;">' + c.name + '</h3></div></div>';
    }
    grid.innerHTML = html;
  }

  // ========== CATEGORY PRODUCTS ==========
  function renderCategoryProducts(catId) {
    console.log('📦 Rendering category products:', catId);
    
    var cats = load(KEYS.categories, []);
    var cat = null;
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].id === catId) { cat = cats[i]; break; }
    }
    
    var titleEl = document.getElementById('categoryTitle');
    if (titleEl) titleEl.textContent = cat ? cat.name : 'المنتجات';

    var allProds = load(KEYS.products, []);
    var prods = [];
    for (var i = 0; i < allProds.length; i++) {
      if (allProds[i].categoryId === catId && allProds[i].active) {
        prods.push(allProds[i]);
      }
    }

    var grid = document.getElementById('categoryProducts');
    if (!grid) return;

    if (prods.length === 0) {
      grid.innerHTML = '<p class="empty-state" style="text-align:center; padding:40px; color:#9b96a8;">لا توجد منتجات في هذا القسم</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < prods.length; i++) {
      html += productCardHTML(prods[i]);
    }
    grid.innerHTML = html;
  }

  // ========== PRODUCT DETAIL ==========
  window.openProductDetail = function(productId) {
    console.log('🛒 Opening product detail:', productId);
    
    var allProds = load(KEYS.products, []);
    var p = null;
    for (var i = 0; i < allProds.length; i++) {
      if (allProds[i].id === productId && allProds[i].active) {
        p = allProds[i];
        break;
      }
    }
    
    if (!p) {
      toast('المنتج غير موجود', true);
      return;
    }
    
    var content = document.getElementById('productDetailContent');
    if (!content) {
      console.error('❌ productDetailContent not found');
      return;
    }
    
    content.innerHTML = 
      '<div class="detail-hero-card" style="display:flex; gap:20px; padding:24px; background:#14131a; border-radius:14px; border:1px solid #2a2735; margin-bottom:20px; flex-wrap:wrap;">' +
      '<img src="' + (p.image || placeholderImg(p.name)) + '" alt="' + p.name + '" style="width:120px; height:120px; border-radius:14px; object-fit:cover; background:#1c1b24;">' +
      '<div style="flex:1; min-width:200px;">' +
      '<span class="product-type" style="display:inline-block; background:rgba(139,92,246,0.12); color:#8b5cf6; padding:2px 12px; border-radius:6px; font-size:0.75rem;">' + typeLabel(p.type) + '</span>' +
      '<h1 style="margin:8px 0 4px; color:#f4f2f8; font-size:1.6rem;">' + p.name + '</h1>' +
      '<p style="color:#9b96a8; margin:0 0 10px;">' + (p.desc || '') + '</p>' +
      '<div class="product-price" style="font-size:1.4rem; font-weight:700; color:#8b5cf6;">' + formatPrice(p.price) + '</div>' +
      (p.pricingNote ? '<div class="pricing-note" style="padding:8px 12px; background:rgba(139,92,246,0.08); border-radius:8px; margin-top:8px; color:#c4b5fd; font-size:0.85rem;">' + p.pricingNote + '</div>' : '') +
      '</div></div>' +
      '<div style="display:flex; gap:12px; flex-wrap:wrap;">' +
      '<button class="btn btn-primary" onclick="addToCart(\'' + p.id + '\')" style="flex:1; padding:12px 24px; background:#8b5cf6; color:#fff; border:none; border-radius:10px; font-size:1rem; cursor:pointer;">🛒 أضف إلى السلة</button>' +
      '<button class="btn btn-secondary" onclick="openQuickOrder(\'' + p.id + '\')" style="flex:1; padding:12px 24px; background:#1c1b24; color:#f4f2f8; border:1px solid #2a2735; border-radius:10px; font-size:1rem; cursor:pointer;">⚡ شراء مباشر</button>' +
      '</div>';
    
    showPage('product-detail', productId);
  };

  // ========== CART ==========
  window.addToCart = function(productId) {
    console.log('🛒 Adding to cart:', productId);
    
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    
    var allProds = load(KEYS.products, []);
    var p = null;
    for (var i = 0; i < allProds.length; i++) {
      if (allProds[i].id === productId) {
        p = allProds[i];
        break;
      }
    }
    if (!p) {
      toast('المنتج غير موجود', true);
      return;
    }

    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId) {
        existing = cart[i];
        break;
      }
    }

    if (existing) {
      existing.qty += 1;
      existing.lineTotal = existing.qty * Number(p.price || 0);
    } else {
      cart.push({
        productId: productId,
        qty: 1,
        name: p.name,
        price: Number(p.price || 0),
        lineTotal: Number(p.price || 0),
        image: p.image,
        serviceType: p.type
      });
    }

    save(KEYS.cart, cart);
    updateUI();
    toast('✅ تمت الإضافة إلى السلة');
  };

  function renderCart() {
    console.log('🛒 Rendering cart...');
    
    var empty = document.getElementById('cartEmpty');
    var content = document.getElementById('cartContent');
    
    if (!cart || cart.length === 0) {
      if (empty) empty.classList.remove('hidden');
      if (content) content.classList.add('hidden');
      return;
    }
    
    if (empty) empty.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    var total = 0;
    var itemsEl = document.getElementById('cartItems');
    if (itemsEl) {
      var html = '';
      for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        total += Number(item.lineTotal || item.price * item.qty);
        html += '<div class="cart-item" style="display:flex; gap:12px; background:#14131a; border:1px solid #2a2735; border-radius:10px; padding:12px; margin-bottom:8px; align-items:center; flex-wrap:wrap;">';
        html += '<img src="' + (item.image || placeholderImg(item.name)) + '" alt="' + item.name + '" style="width:60px; height:60px; border-radius:8px; object-fit:cover;">';
        html += '<div class="cart-item-info" style="flex:1; min-width:120px;">';
        html += '<h4 style="margin:0; font-size:0.9rem; color:#f4f2f8;">' + item.name + '</h4>';
        html += '<div class="product-price" style="font-size:0.9rem; font-weight:700; color:#8b5cf6;">' + formatPrice(item.lineTotal || item.price * item.qty) + '</div>';
        html += '</div>';
        html += '<div class="cart-item-actions" style="display:flex; gap:6px; align-items:center;">';
        html += '<button class="qty-btn" onclick="changeQty(' + i + ', -1)" style="width:30px; height:30px; border-radius:6px; border:1px solid #2a2735; background:#1c1b24; color:#f4f2f8; cursor:pointer;">−</button>';
        html += '<span style="min-width:24px; text-align:center;">' + item.qty + '</span>';
        html += '<button class="qty-btn" onclick="changeQty(' + i + ', 1)" style="width:30px; height:30px; border-radius:6px; border:1px solid #2a2735; background:#1c1b24; color:#f4f2f8; cursor:pointer;">+</button>';
        html += '<button class="btn btn-danger btn-sm" onclick="removeFromCart(' + i + ')" style="padding:4px 10px; background:transparent; border:1px solid #9f1239; color:#9f1239; border-radius:6px; cursor:pointer;">حذف</button>';
        html += '</div></div>';
      }
      itemsEl.innerHTML = html;
    }
    
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = formatPrice(total);
  }

  window.changeQty = function(idx, delta) {
    if (idx < 0 || idx >= cart.length) return;
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) {
      cart.splice(idx, 1);
    } else {
      cart[idx].lineTotal = cart[idx].qty * Number(cart[idx].price || 0);
    }
    save(KEYS.cart, cart);
    updateUI();
    renderCart();
  };

  window.removeFromCart = function(idx) {
    if (idx < 0 || idx >= cart.length) return;
    cart.splice(idx, 1);
    save(KEYS.cart, cart);
    updateUI();
    renderCart();
  };

  // ========== QUICK ORDER ==========
  window.openQuickOrder = function(productId) {
    console.log('⚡ Opening quick order:', productId);
    
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    
    var allProds = load(KEYS.products, []);
    var p = null;
    for (var i = 0; i < allProds.length; i++) {
      if (allProds[i].id === productId && allProds[i].active) {
        p = allProds[i];
        break;
      }
    }
    if (!p) {
      toast('المنتج غير موجود', true);
      return;
    }
    
    var modal = document.getElementById('quickOrderModal');
    if (!modal) {
      toast('حدث خطأ في النافذة', true);
      return;
    }
    
    document.getElementById('quickOrderTitle').textContent = p.name;
    document.getElementById('quickOrderSummary').textContent = p.pricingNote || p.desc || 'أدخل البيانات المطلوبة';
    document.getElementById('quickOrderTotal').textContent = formatPrice(p.price);
    document.getElementById('quickOrderForm').innerHTML = 
      '<div class="form-group"><label>رقم واتساب العميل <span class="required">*</span></label>' +
      '<input type="tel" id="quickWhatsapp" placeholder="مثال: +9639xxxxxxxx" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #2a2735; background:#1c1b24; color:#f4f2f8;"></div>' +
      '<div class="form-group"><label>رابط الحساب <span class="required">*</span></label>' +
      '<input type="url" id="quickTarget" placeholder="https://instagram.com/..." required style="width:100%; padding:10px; border-radius:8px; border:1px solid #2a2735; background:#1c1b24; color:#f4f2f8;"></div>' +
      '<div class="form-group"><label>ملاحظات إضافية</label>' +
      '<textarea id="quickNotes" rows="3" placeholder="أي ملاحظة للإدمن" style="width:100%; padding:10px; border-radius:8px; border:1px solid #2a2735; background:#1c1b24; color:#f4f2f8;"></textarea></div>' +
      '<input type="hidden" id="quickProductId" value="' + p.id + '">';
    
    modal.classList.remove('hidden');
  };

  window.closeQuickOrder = function() {
    var modal = document.getElementById('quickOrderModal');
    if (modal) modal.classList.add('hidden');
  };

  window.submitQuickOrder = function() {
    if (!currentUser) return;
    
    var whatsapp = document.getElementById('quickWhatsapp').value.trim();
    var target = document.getElementById('quickTarget').value.trim();
    var notes = document.getElementById('quickNotes').value.trim();
    var productId = document.getElementById('quickProductId').value;
    
    if (!whatsapp || whatsapp.length < 6) {
      toast('رقم واتساب العميل إجباري', true);
      return;
    }
    if (!target) {
      toast('أدخل رابط الحساب', true);
      return;
    }
    
    var allProds = load(KEYS.products, []);
    var p = null;
    for (var i = 0; i < allProds.length; i++) {
      if (allProds[i].id === productId) {
        p = allProds[i];
        break;
      }
    }
    if (!p) return;
    
    var total = Number(p.price || 0);
    if ((currentUser.balance || 0) < total) {
      toast('رصيدك غير كافٍ. يرجى شحن المحفظة أولاً', true);
      closeQuickOrder();
      showPage('wallet');
      return;
    }
    
    currentUser.balance -= total;
    currentUser.whatsapp = whatsapp;
    saveUser(currentUser);
    
    var order = {
      id: uid('ord'),
      username: currentUser.username,
      whatsapp: whatsapp,
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      items: [{
        productId: p.id,
        name: p.name,
        serviceType: p.type,
        qty: 1,
        price: total,
        targetUrl: target,
        notes: notes
      }]
    };
    
    var orders = load(KEYS.orders, []);
    orders.push(order);
    save(KEYS.orders, orders);
    
    closeQuickOrder();
    updateUI();
    
    document.getElementById('orderSuccessMsg').textContent = 
      'تم إرسال الطلب ' + order.id + ' بنجاح — المجموع: ' + formatPrice(total);
    showPage('order-success');
  };

  // ========== CHECKOUT ==========
  window.checkout = function() {
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    if (!cart || cart.length === 0) {
      toast('السلة فارغة', true);
      return;
    }
    
    var whatsappEl = document.getElementById('orderWhatsapp');
    var whatsapp = (whatsappEl ? whatsappEl.value.trim() : '');
    if (!whatsapp || whatsapp.length < 6) {
      toast('رقم واتساب إجباري', true);
      if (whatsappEl) whatsappEl.focus();
      return;
    }
    
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      total += Number(cart[i].lineTotal || cart[i].price * cart[i].qty);
    }
    
    if ((currentUser.balance || 0) < total) {
      toast('رصيدك غير كافٍ. يرجى شحن المحفظة أولاً', true);
      showPage('wallet');
      return;
    }
    
    currentUser.balance -= total;
    currentUser.whatsapp = whatsapp;
    saveUser(currentUser);
    
    var order = {
      id: uid('ord'),
      username: currentUser.username,
      whatsapp: whatsapp,
      items: cart.slice(),
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    var orders = load(KEYS.orders, []);
    orders.push(order);
    save(KEYS.orders, orders);
    
    var products = load(KEYS.products, []);
    for (var i = 0; i < cart.length; i++) {
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === cart[i].productId) {
          products[j].sales = (products[j].sales || 0) + 1;
          break;
        }
      }
    }
    save(KEYS.products, products);
    
    cart = [];
    save(KEYS.cart, cart);
    updateUI();
    
    document.getElementById('orderSuccessMsg').textContent = 
      'تم إرسال الطلب ' + order.id + ' بنجاح — المجموع: ' + formatPrice(total);
    showPage('order-success');
  };

  function saveUser(user) {
    var users = load(KEYS.users, []);
    var found = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === user.username) {
        users[i].balance = user.balance;
        if (user.email) users[i].email = user.email;
        found = true;
        break;
      }
    }
    if (!found) {
      users.push(user);
    }
    save(KEYS.users, users);
    currentUser = user;
    save(KEYS.currentUser, currentUser);
  }

  // ========== AUTH ==========
  window.handleAuth = async function(e) {
    e.preventDefault();
    
    var username = document.getElementById('authUsername').value.trim();
    var email = document.getElementById('authEmail').value.trim().toLowerCase();
    var password = document.getElementById('authPassword').value;
    var passwordConfirm = document.getElementById('authPasswordConfirm').value;
    
    var codeBox = document.getElementById('verificationCodeBox');
    var retryBox = document.getElementById('verificationRetryBox');
    if (codeBox) codeBox.classList.add('hidden');
    if (retryBox) retryBox.classList.add('hidden');
    
    // ✅ ADMIN LOGIN
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      adminLoggedIn = true;
      sessionStorage.setItem(KEYS.adminSession, '1');
      toast('مرحباً أدمن');
      showPage('admin');
      return;
    }
    
    if (!username) { toast('اسم المستخدم مطلوب', true); return; }
    if (!email) { toast('البريد الإلكتروني مطلوب', true); return; }
    if (password.length < 4) { toast('كلمة المرور 4 أحرف على الأقل', true); return; }
    if (password !== passwordConfirm) { toast('كلمتا المرور غير متطابقتين', true); return; }
    
    var users = load(KEYS.users, []);
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username || users[i].email === email) {
        user = users[i];
        break;
      }
    }
    
    if (user) {
      if (user.password !== password) {
        toast('كلمة المرور غير صحيحة', true);
        return;
      }
      currentUser = { username: user.username, email: user.email, balance: user.balance || 0 };
      save(KEYS.currentUser, currentUser);
      updateUI();
      toast('مرحباً ' + username);
      showPage('home');
      return;
    }
    
    var pending = load(KEYS.pendingUsers, []);
    var pendingUser = null;
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].username === username || pending[i].email === email) {
        pendingUser = pending[i];
        break;
      }
    }
    
    if (pendingUser) {
      if (pendingUser.password !== password) {
        toast('كلمة المرور غير صحيحة', true);
        return;
      }
      pendingVerificationUser = pendingUser;
      if (codeBox) codeBox.classList.remove('hidden');
      if (retryBox) retryBox.classList.remove('hidden');
      
      var retryMessage = document.getElementById('verificationRetryMessage');
      if (retryMessage) {
        retryMessage.textContent = '📧 تم إرسال رمز التفعيل إلى ' + email + '. أدخل الرمز المكوّن من 6 أرقام.';
      }
      
      toast('📧 أدخل رمز التفعيل المرسل إلى بريدك الإلكتروني');
      return;
    }
    
    var newUser = {
      username: username,
      email: email,
      password: password
    };
    
    try {
      toast('📧 جاري إرسال رمز التفعيل...');
      await window.sendVerificationEmail(newUser);
      
      if (codeBox) codeBox.classList.remove('hidden');
      if (retryBox) retryBox.classList.remove('hidden');
      
      var retryMessage2 = document.getElementById('verificationRetryMessage');
      if (retryMessage2) {
        retryMessage2.textContent = '✅ تم إرسال رمز التفعيل إلى ' + email + '. أدخل الرمز المكوّن من 6 أرقام.';
      }
      
      toast('✅ تم إرسال رمز التفعيل إلى بريدك الإلكتروني');
    } catch(e) {
      console.error('Send error:', e);
      toast('❌ فشل إرسال البريد: ' + e.message, true);
    }
  };

  window.logout = function() {
    currentUser = null;
    localStorage.removeItem(KEYS.currentUser);
    updateUI();
    toast('تم تسجيل الخروج');
    showPage('home');
  };

  // ========== WALLET ==========
  window.showTopUpModal = function() {
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    document.getElementById('topUpSection').classList.remove('hidden');
  };

  window.submitTopUp = function(e) {
    e.preventDefault();
    if (!currentUser) return;
    
    var txNumber = document.getElementById('txNumber').value.trim();
    var amount = Number(document.getElementById('txAmount').value);
    var currency = document.getElementById('txCurrency').value;
    
    if (!txNumber || amount < 1) {
      toast('يرجى إدخال بيانات صحيحة', true);
      return;
    }
    
    var topups = load(KEYS.topups, []);
    topups.push({
      id: uid('top'),
      username: currentUser.username,
      txNumber: txNumber,
      amount: amount,
      currency: currency,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    save(KEYS.topups, topups);
    
    document.getElementById('topUpForm').reset();
    document.getElementById('topUpSection').classList.add('hidden');
    toast('تم استلام طلبك، سيتم مراجعته قريباً ✓');
  };

  // ========== ADMIN ==========
  window.switchAdminTab = function(tab) {
    var contents = document.querySelectorAll('.admin-tab-content');
    for (var i = 0; i < contents.length; i++) contents[i].classList.remove('active');
    var btns = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    
    var content = document.getElementById('admin-' + tab);
    if (content) content.classList.add('active');
    var btn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
    if (btn) btn.classList.add('active');
    
    if (tab === 'stats') renderStats();
    if (tab === 'categories') renderAdminCategories();
    if (tab === 'products') renderAdminProducts();
    if (tab === 'topups') renderAdminTopups();
    if (tab === 'orders') renderAdminOrders();
    if (tab === 'users') renderAdminUsers();
  };

  function renderStats() {
    var products = load(KEYS.products, []);
    var orders = load(KEYS.orders, []);
    var topups = load(KEYS.topups, []);
    var users = load(KEYS.users, []);
    var grid = document.getElementById('statsGrid');
    if (!grid) return;
    grid.innerHTML = 
      '<div class="stat-card"><h4>المنتجات</h4><p>' + products.length + '</p></div>' +
      '<div class="stat-card"><h4>الطلبات</h4><p>' + orders.length + '</p></div>' +
      '<div class="stat-card"><h4>طلبات الشحن</h4><p>' + topups.length + '</p></div>' +
      '<div class="stat-card"><h4>المستخدمين</h4><p>' + users.length + '</p></div>';
  }

  function renderAdminCategories() {
    var cats = load(KEYS.categories, []).sort(function(a, b) { return a.order - b.order; });
    var tbody = document.querySelector('#catsTable tbody');
    if (!tbody) return;
    var html = '';
    for (var i = 0; i < cats.length; i++) {
      var c = cats[i];
      html += '<tr><td>' + c.name + '</td><td>' + (c.image ? '✓' : '—') + '</td><td>' + c.order + '</td><td>' +
        '<button class="btn btn-sm btn-secondary" onclick="editCategory(\'' + c.id + '\')">تعديل</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteCategory(\'' + c.id + '\')">حذف</button></td></tr>';
    }
    tbody.innerHTML = html;
  }

  window.editCategory = function(id) {
    var cats = load(KEYS.categories, []);
    var c = null;
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].id === id) { c = cats[i]; break; }
    }
    if (!c) return;
    var newName = prompt('اسم القسم الجديد:', c.name);
    if (newName !== null) c.name = newName.trim() || c.name;
    save(KEYS.categories, cats);
    renderAdminCategories();
    toast('تم التعديل');
  };

  window.deleteCategory = function(id) {
    if (!confirm('حذف القسم؟')) return;
    var cats = load(KEYS.categories, []);
    var newCats = [];
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].id !== id) newCats.push(cats[i]);
    }
    save(KEYS.categories, newCats);
    renderAdminCategories();
    toast('تم الحذف');
  };

  window.addCategory = function() {
    var name = document.getElementById('catName').value.trim();
    if (!name) { toast('أدخل اسم القسم', true); return; }
    var cats = load(KEYS.categories, []);
    cats.push({ id: uid('cat'), name: name, image: '', order: cats.length + 1 });
    save(KEYS.categories, cats);
    document.getElementById('catName').value = '';
    document.getElementById('addCategoryForm').classList.add('hidden');
    renderAdminCategories();
    toast('تمت الإضافة');
  };

  function renderAdminProducts() {
    var products = load(KEYS.products, []);
    var cats = load(KEYS.categories, []);
    var tbody = document.querySelector('#prodsTable tbody');
    if (!tbody) return;
    var html = '';
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var catName = '—';
      for (var j = 0; j < cats.length; j++) {
        if (cats[j].id === p.categoryId) { catName = cats[j].name; break; }
      }
      html += '<tr><td>' + p.name + '</td><td>' + catName + '</td><td>' + formatPrice(p.price) + '</td><td>' + typeLabel(p.type) + '</td><td>' + (p.active ? '🟢 نشط' : '🔴 متوقف') + '</td><td>' +
        '<button class="btn btn-sm btn-secondary" onclick="toggleProduct(\'' + p.id + '\')">تغيير</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteProduct(\'' + p.id + '\')">حذف</button></td></tr>';
    }
    tbody.innerHTML = html;
  }

  window.toggleProduct = function(id) {
    var products = load(KEYS.products, []);
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) { products[i].active = !products[i].active; break; }
    }
    save(KEYS.products, products);
    renderAdminProducts();
  };

  window.deleteProduct = function(id) {
    if (!confirm('حذف المنتج؟')) return;
    var products = load(KEYS.products, []);
    var newProds = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].id !== id) newProds.push(products[i]);
    }
    save(KEYS.products, newProds);
    renderAdminProducts();
    toast('تم الحذف');
  };

  window.addProduct = function() {
    var name = document.getElementById('prodName').value.trim();
    var price = Number(document.getElementById('prodPrice').value);
    var categoryId = document.getElementById('prodCategory').value;
    var type = document.getElementById('prodType').value;
    if (!name || price < 0) { toast('بيانات غير مكتملة', true); return; }
    var products = load(KEYS.products, []);
    products.push({
      id: uid('p'),
      name: name,
      desc: document.getElementById('prodDesc').value.trim(),
      price: price,
      unitSize: Number(document.getElementById('prodUnitSize').value) || 1000,
      image: document.getElementById('prodImage').value.trim(),
      categoryId: categoryId,
      type: type,
      active: true,
      sales: 0
    });
    save(KEYS.products, products);
    document.getElementById('addProductForm').classList.add('hidden');
    renderAdminProducts();
    toast('تمت إضافة المنتج');
  };

  window.showAddProductForm = function() {
    var cats = load(KEYS.categories, []);
    var sel = document.getElementById('prodCategory');
    if (sel) {
      var html = '';
      for (var i = 0; i < cats.length; i++) {
        html += '<option value="' + cats[i].id + '">' + cats[i].name + '</option>';
      }
      sel.innerHTML = html;
    }
    document.getElementById('addProductForm').classList.remove('hidden');
  };

  window.hideAddProductForm = function() {
    document.getElementById('addProductForm').classList.add('hidden');
  };

  window.showAddCategoryForm = function() {
    document.getElementById('addCategoryForm').classList.remove('hidden');
  };

  window.hideAddCategoryForm = function() {
    document.getElementById('addCategoryForm').classList.add('hidden');
  };

  function renderAdminTopups() {
    var topups = load(KEYS.topups, []).reverse();
    var tbody = document.querySelector('#topupsTable tbody');
    if (!tbody) return;
    var html = '';
    for (var i = 0; i < topups.length; i++) {
      var t = topups[i];
      html += '<tr><td>' + t.username + '</td><td>' + t.txNumber + '</td><td>' + t.amount + '</td><td>' + t.currency + '</td><td>' + (t.status === 'pending' ? '⏳ قيد المراجعة' : t.status === 'approved' ? '✅ مقبول' : '❌ مرفوض') + '</td><td>' + new Date(t.createdAt).toLocaleString('ar') + '</td><td>' +
        (t.status === 'pending' ? '<button class="btn btn-sm btn-primary" onclick="approveTopup(\'' + t.id + '\')">قبول</button><button class="btn btn-sm btn-danger" onclick="rejectTopup(\'' + t.id + '\')">رفض</button>' : '—') +
        '</td></tr>';
    }
    tbody.innerHTML = html || '<tr><td colspan="8">لا توجد طلبات</td></tr>';
  }

  window.approveTopup = function(id) {
    var topups = load(KEYS.topups, []);
    var t = null;
    for (var i = 0; i < topups.length; i++) {
      if (topups[i].id === id) { t = topups[i]; break; }
    }
    if (!t || t.status !== 'pending') return;
    t.status = 'approved';
    var users = load(KEYS.users, []);
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === t.username) {
        var add = Number(t.amount);
        if (t.currency === 'SYP') add = Math.round(add / 10000);
        users[i].balance = (users[i].balance || 0) + add;
        break;
      }
    }
    save(KEYS.users, users);
    save(KEYS.topups, topups);
    renderAdminTopups();
    toast('تم قبول الطلب وإضافة الرصيد');
  };

  window.rejectTopup = function(id) {
    var topups = load(KEYS.topups, []);
    for (var i = 0; i < topups.length; i++) {
      if (topups[i].id === id) { topups[i].status = 'rejected'; break; }
    }
    save(KEYS.topups, topups);
    renderAdminTopups();
    toast('تم رفض الطلب');
  };

  function renderAdminOrders() {
    var orders = load(KEYS.orders, []).reverse();
    var tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    var html = '';
    for (var i = 0; i < orders.length; i++) {
      var o = orders[i];
      html += '<tr><td><strong>' + o.id + '</strong></td><td>' + (o.username || '—') + '</td><td>' + (o.whatsapp || '—') + '</td><td>' + (o.items ? o.items.length + ' خدمة' : '—') + '</td><td>' + formatPrice(o.total || 0) + '</td><td>' + (o.status === 'pending' ? '⏳ قيد المراجعة' : '✅ منفذ') + '</td><td>' + new Date(o.createdAt).toLocaleString('ar') + '</td><td>' +
        (o.status === 'pending' ? '<button class="btn btn-sm btn-primary" onclick="completeOrder(\'' + o.id + '\')">تم التنفيذ</button>' : '') +
        '</td></tr>';
    }
    tbody.innerHTML = html || '<tr><td colspan="8">لا توجد طلبات</td></tr>';
  }

  window.completeOrder = function(id) {
    var orders = load(KEYS.orders, []);
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === id) { orders[i].status = 'approved'; break; }
    }
    save(KEYS.orders, orders);
    renderAdminOrders();
    toast('تم تحديث حالة الطلب');
  };

  function renderAdminUsers() {
    var users = load(KEYS.users, []);
    var pending = load(KEYS.pendingUsers, []);
    var tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    var html = '';
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      html += '<tr><td>' + u.username + '</td><td>' + (u.email || '—') + '</td><td>' + formatPrice(u.balance || 0) + '</td><td>✅ مفعل</td><td>' + (u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar') : '—') + '</td></tr>';
    }
    for (var i = 0; i < pending.length; i++) {
      var u = pending[i];
      html += '<tr><td>' + u.username + '</td><td>' + (u.email || '—') + '</td><td>' + formatPrice(0) + '</td><td>⏳ غير مفعل</td><td>' + (u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar') : '—') + '</td></tr>';
    }
    tbody.innerHTML = html || '<tr><td colspan="5">لا يوجد مستخدمون</td></tr>';
  }

  // ========== ABOUT ==========
  function renderAbout() {
    var settings = load(KEYS.settings, {});
    var photo = document.getElementById('ownerPhoto');
    if (photo) photo.src = settings.ownerPhoto || placeholderImg('MOOHAMED');
    var name = document.getElementById('ownerName');
    if (name) name.textContent = settings.ownerName || 'MOOHAMED || IDLEB X';
    var bio = document.getElementById('ownerBio');
    if (bio) bio.textContent = settings.ownerBio || 'صاحب ومشرف متجر IDLEB STORE';
  }

  // ========== LOADER ==========
  function startLoader() {
    try {
      var loader = document.getElementById('siteLoader');
      if (!loader) return;
      setTimeout(function() {
        if (loader) loader.classList.add('hidden');
      }, 2500);
      setTimeout(function() {
        if (loader && !loader.classList.contains('hidden')) {
          loader.classList.add('hidden');
        }
      }, 5000);
    } catch(e) {
      var loader = document.getElementById('siteLoader');
      if (loader) loader.classList.add('hidden');
    }
  }

  // ========== HASH ROUTING ==========
  function handleHash() {
    var hash = location.hash.slice(1) || 'home';
    console.log('📍 Hash changed:', hash);
    
    if (hash.startsWith('category/')) {
      var id = hash.split('/')[1];
      showPage('category', id);
    } else if (hash.startsWith('product/')) {
      var id = hash.split('/')[1];
      showPage('product-detail', id);
    } else if (hash === 'admin') {
      showPage('admin');
    } else {
      showPage(hash);
    }
  }

  // ========== MOBILE MENU ==========
  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('menuToggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        var links = document.getElementById('navLinks');
        if (links) links.classList.toggle('open');
      });
    }
    
    console.log('✅ DOM fully loaded');
  });

  // ========== BOOT ==========
  console.log('🚀 Booting IDLEB STORE...');
  initData();
  loadState();
  handleHash();
  window.addEventListener('hashchange', handleHash);
  renderAbout();
  startLoader();

  console.log('✅ IDLEB STORE ready!');
  console.log('🔍 Available functions:');
  console.log('  - openProductDetail:', typeof window.openProductDetail);
  console.log('  - addToCart:', typeof window.addToCart);
  console.log('  - openQuickOrder:', typeof window.openQuickOrder);
  console.log('  - showPage:', typeof window.showPage);
  console.log('  - verifyOTP:', typeof window.verifyOTP);
  console.log('  - resendVerification:', typeof window.resendVerification);
})();
