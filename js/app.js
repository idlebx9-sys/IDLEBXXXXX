/* ===== IDLEB STORE - Frontend App ===== */
(function () {
  'use strict';

  // ========== Constants & Storage Keys ==========
  const STORAGE = {
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

  // Admin credentials
  const ADMIN_USER = 'admin';
  const ADMIN_HASH = btoa('Idleb@2025');
  const ADMIN_DISPLAY_NAME = 'MOOHAMED || IDLEB X';

  // ========== Default Data ==========
  const DEFAULT_CATEGORIES = [
    { id: 'cat1', name: 'تبنيد حسابات', image: '', order: 1 },
    { id: 'cat2', name: 'فك باند', image: '', order: 2 },
    { id: 'cat3', name: 'خدمات الرشق', image: '', order: 3 },
    { id: 'cat4', name: 'شحن ألعاب', image: '', order: 4 }
  ];

  const DEFAULT_PRODUCTS = [
    { id: 'p1', name: 'تبنيد انستغرام', desc: 'حسابات انستغرام جاهزة ومضمونة', price: 15, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 42 },
    { id: 'p2', name: 'تبنيد فيسبوك', desc: 'حسابات فيسبوك قديمة وموثقة', price: 12, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 35 },
    { id: 'p3', name: 'تبنيد تليجرام', desc: 'أرقام تليجرام جاهزة', price: 10, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 28 },
    { id: 'p4', name: 'تبنيد واتساب', desc: 'أرقام واتساب مع تحقق', price: 18, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 50 },
    { id: 'p5', name: 'فك باند انستغرام', desc: 'فك حظر انستغرام بشكل دائم', price: 25, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 60 },
    { id: 'p6', name: 'فك باند واتساب', desc: 'استعادة رقم واتساب محظور', price: 30, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 45 },
    { id: 'p7', name: 'فك باند فيسبوك', desc: 'فك حظر حسابات فيسبوك', price: 22, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 33 },
    { id: 'p8', name: 'فك باند تليجرام', desc: 'فك حظر قنوات وحسابات تليجرام', price: 20, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 20 },
    { id: 'p9', name: 'فك باند تيك توك', desc: 'استعادة حسابات تيك توك', price: 28, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 38 },
    { id: 'p10', name: 'رشق متابعين انستغرام', desc: 'متابعين حقيقيين', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 90, pricingNote: 'كل 1000 متابع = 2$' },
    { id: 'p11', name: 'رشق تفاعل انستغرام', desc: 'تفاعل مستقل (إعجابات)', price: 1.5, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_engagement', active: true, sales: 55, pricingNote: 'كل 1000 تفاعل = 1.5$' },
    { id: 'p12', name: 'رشق مشاهدات', desc: 'مشاهدات مستقلة', price: 1, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_views', active: true, sales: 40, pricingNote: 'كل 1000 مشاهدة = 1$' },
    { id: 'p13', name: 'رشق متابعين تيك توك', desc: 'متابعين مستقلين', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 75, pricingNote: 'كل 1000 متابع = 2$' },
    { id: 'p14', name: 'رشق أعضاء تليجرام', desc: 'أعضاء مستقلون', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 30, pricingNote: 'كل 1000 عضو = 2$' },
    { id: 'p15', name: 'شحن ببجي', desc: 'شحن UC ببجي موبايل', price: 10, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 120, pricingNote: 'كل 1 وحدة = 10$' },
    { id: 'p16', name: 'شحن لودو', desc: 'شحن عملات لودو ستار', price: 8, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 65, pricingNote: 'كل 1 وحدة = 8$' },
    { id: 'p17', name: 'شحن جواكر', desc: 'شحن عملات جواكر', price: 7, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 48, pricingNote: 'كل 1 وحدة = 7$' },
    { id: 'p18', name: 'شحن فري فاير', desc: 'شحن جواهر فري فاير', price: 9, unitSize: 1, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 95, pricingNote: 'كل 1 وحدة = 9$' }
  ];

  const DEFAULT_SETTINGS = {
    walletImage: '',
    adminPhone: '',
    telegram: '',
    channel: '',
    ownerPhoto: '',
    ownerName: 'MOOHAMED || IDLEB X',
    ownerBio: 'صاحب ومشرف متجر IDLEB STORE — نوفر خدمات رقمية باحترافية وسرعة، مع متابعة مباشرة للطلبات وخدمة عملاء واضحة.',
    loaderLogo: '',
    loaderSeconds: 2.5,
    emailjsPublicKey: '-MV0a0jjrdW0VbOML',
    emailjsServiceId: 'service_y22dlbp',
    emailjsTemplateVerifyId: 'template_ncqtx0e',
    verificationExpiry: 24
  };

  // ========== Helpers ==========
  function load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix = 'id') {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function toast(msg, isError = false) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(function() {
      el.classList.remove('show');
    }, 3200);
  }

  function formatPrice(n) {
    return Number(n).toLocaleString('ar-SY') + ' $';
  }

  function typeLabel(t) {
    const map = {
      accounts: 'تبنيد / حسابات',
      unban: 'فك باند',
      boost: 'رشق',
      boost_followers: 'رشق متابعين',
      boost_engagement: 'رشق تفاعل',
      boost_views: 'رشق مشاهدات',
      games: 'شحن ألعاب',
      other: 'خدمة أخرى'
    };
    return map[t] || t;
  }

  function placeholderImg(text) {
    return 'https://placehold.co/400x250/8b5cf6/0a0a0f?text=' + encodeURIComponent(text) + '&font=cairo';
  }

  function hashCode(s) {
    let h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return h;
  }

  function isVerifiedUser(user) {
    user = user || currentUser;
    return !!(user && user.isVerified !== false);
  }

  function requireVerifiedUser(action) {
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return false;
    }
    if (!isVerifiedUser()) {
      toast('يرجى تفعيل حسابك أولاً', true);
      showPage('login');
      return false;
    }
    return true;
  }

  function verificationExpiryHours() {
    var settings = load(STORAGE.settings, DEFAULT_SETTINGS);
    return Math.min(168, Math.max(1, Number(settings.verificationExpiry) || 24));
  }

  function initEmailJS() {
    var settings = load(STORAGE.settings, DEFAULT_SETTINGS);
    if (!window.emailjs || !settings.emailjsPublicKey) return false;
    try {
      window.emailjs.init({ publicKey: settings.emailjsPublicKey });
      return true;
    } catch (error) {
      console.error('EmailJS init failed:', error);
      return false;
    }
  }

  // ========== Send OTP ==========
  window.sendVerificationEmail = async function(user) {
    var settings = load(STORAGE.settings, DEFAULT_SETTINGS);
    if (!settings.emailjsPublicKey || !settings.emailjsServiceId || !settings.emailjsTemplateVerifyId) {
      throw new Error('EMAILJS_NOT_CONFIGURED');
    }
    if (!window.emailjs) throw new Error('EMAILJS_LIBRARY_NOT_LOADED');
    if (!user || !user.email) throw new Error('EMAIL_REQUIRED');

    var expiry = verificationExpiryHours();
    var verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    
    console.log('✅ Verification Code Generated:', verificationCode);
    
    var createdAt = new Date().toISOString();
    var expiresAt = new Date(Date.now() + expiry * 60 * 60 * 1000).toISOString();
    var pending = load(STORAGE.pendingUsers, []);
    var idx = pending.findIndex(function(u) { 
      return u.username === user.username || (u.email && u.email.toLowerCase() === user.email.toLowerCase());
    });
    var old = idx >= 0 ? pending[idx] : {};
    var record = {
      username: user.username,
      email: user.email,
      password: user.password,
      balance: Number(user.balance || 0),
      verification_code: verificationCode,
      createdAt: createdAt,
      expiresAt: expiresAt,
      codeAttempts: 0
    };
    if (idx >= 0) pending[idx] = Object.assign({}, old, record);
    else pending.push(record);
    save(STORAGE.pendingUsers, pending);
    pendingVerificationUser = record;

    if (!initEmailJS()) throw new Error('EMAILJS_INIT_FAILED');

    var params = {
      to_email: user.email,
      email: user.email,
      user_email: user.email,
      reply_to: user.email,
      username: user.username,
      name: user.username,
      verification_code: verificationCode,
      code: verificationCode,
      otp: verificationCode,
      verification_expiry_hours: expiry,
      expiry_hours: expiry,
      site_name: 'IDLEB STORE'
    };

    console.log('📧 Sending email with params:', params);

    try {
      var response = await window.emailjs.send(
        settings.emailjsServiceId, 
        settings.emailjsTemplateVerifyId, 
        params
      );
      console.log('✅ Email sent successfully:', response);
    } catch (error) {
      console.error('❌ EmailJS send failed:', error);
      var detail = error?.text || error?.message || String(error);
      throw new Error('EMAILJS_SEND_FAILED: ' + detail);
    }

    return { verificationCode: verificationCode, expiresAt: expiresAt };
  };

  var pendingVerificationUser = null;

  function showVerificationRetry(message, user) {
    pendingVerificationUser = user || pendingVerificationUser;
    var box = document.getElementById('verificationRetryBox');
    var text = document.getElementById('verificationRetryMessage');
    if (box) box.classList.remove('hidden');
    if (text) text.textContent = message;
  }

  window.resendVerificationEmail = async function() {
    var email = (document.getElementById('authEmail')?.value || pendingVerificationUser?.email || '').trim().toLowerCase();
    var username = (document.getElementById('authUsername')?.value || pendingVerificationUser?.username || '').trim();
    var pending = load(STORAGE.pendingUsers, []);
    var user = pending.find(function(u) {
      return (email && u.email?.toLowerCase() === email) || (username && u.username === username);
    }) || pendingVerificationUser;
    if (!user) {
      toast('أدخل اسم المستخدم والبريد الإلكتروني للحساب غير المفعل', true);
      return;
    }
    try {
      toast('جاري إرسال رمز تحقق جديد...');
      await window.sendVerificationEmail(user);
      showVerificationRetry('تم إرسال رمز جديد إلى بريدك الإلكتروني. أدخل الرمز المكوّن من 6 أرقام.', user);
      toast('تم إرسال رمز التفعيل إلى بريدك الإلكتروني');
    } catch (error) {
      console.error(error);
      showVerificationRetry('تعذر إرسال رمز التفعيل. تأكد من إعدادات EmailJS', user);
      toast('فشل إرسال البريد. راجع إعدادات EmailJS', true);
    }
  };

  window.verifyEmailCode = function() {
    var code = (document.getElementById('verificationCodeInput')?.value || '').replace(/\D/g, '').trim();
    var email = (document.getElementById('authEmail')?.value || pendingVerificationUser?.email || '').trim().toLowerCase();
    var username = (document.getElementById('authUsername')?.value || pendingVerificationUser?.username || '').trim();
    if (!/^\d{6}$/.test(code)) return toast('أدخل رمز التفعيل المكوّن من 6 أرقام', true);

    var pending = load(STORAGE.pendingUsers, []);
    var idx = pending.findIndex(function(u) {
      return (email && u.email?.toLowerCase() === email) || (username && u.username === username);
    });
    if (idx < 0) return toast('لم يتم العثور على حساب بانتظار التفعيل', true);
    var user = pending[idx];

    if (user.expiresAt && Date.now() > new Date(user.expiresAt).getTime()) {
      showVerificationRetry('انتهت صلاحية رمز التفعيل، اضغط إعادة إرسال للحصول على رمز جديد.', user);
      return toast('انتهت صلاحية رمز التفعيل، يرجى طلب رمز جديد', true);
    }
    if (String(user.verification_code) !== code) {
      user.codeAttempts = Number(user.codeAttempts || 0) + 1;
      pending[idx] = user;
      save(STORAGE.pendingUsers, pending);
      return toast('رمز التفعيل غير صحيح', true);
    }

    var users = load(STORAGE.users, []);
    var cleanUser = {
      username: user.username,
      email: user.email,
      password: user.password,
      balance: Number(user.balance || 0),
      isVerified: true,
      verifiedAt: new Date().toISOString()
    };
    var existing = users.findIndex(function(u) {
      return u.username === user.username || (u.email && u.email.toLowerCase() === user.email.toLowerCase());
    });
    if (existing >= 0) users[existing] = Object.assign({}, users[existing], cleanUser);
    else users.push(cleanUser);
    save(STORAGE.users, users);
    save(STORAGE.pendingUsers, pending.filter(function(_, i) { return i !== idx; }));
    pendingVerificationUser = null;
    var retry = document.getElementById('verificationRetryBox');
    if (retry) retry.classList.add('hidden');
    var codeBox = document.getElementById('verificationCodeBox');
    if (codeBox) codeBox.classList.add('hidden');
    toast('تم تفعيل حسابك بنجاح! يمكنك تسجيل الدخول الآن');
    var confirm = document.getElementById('authPasswordConfirm');
    if (confirm) confirm.value = '';
  };

  // ========== Init Data ==========
  function initData() {
    if (!localStorage.getItem(STORAGE.categories)) {
      save(STORAGE.categories, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE.products)) {
      save(STORAGE.products, DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE.users)) {
      save(STORAGE.users, []);
    }
    if (!localStorage.getItem(STORAGE.pendingUsers)) {
      save(STORAGE.pendingUsers, []);
    }
    if (!localStorage.getItem(STORAGE.topups)) {
      save(STORAGE.topups, []);
    }
    if (!localStorage.getItem(STORAGE.orders)) {
      save(STORAGE.orders, []);
    }
    if (!localStorage.getItem(STORAGE.cart)) {
      save(STORAGE.cart, []);
    }
    var storedSettings = load(STORAGE.settings, null);
    if (!storedSettings) {
      save(STORAGE.settings, DEFAULT_SETTINGS);
    } else {
      var mergedSettings = Object.assign({}, DEFAULT_SETTINGS, storedSettings);
      if (!storedSettings.emailjsPublicKey) mergedSettings.emailjsPublicKey = DEFAULT_SETTINGS.emailjsPublicKey;
      if (!storedSettings.emailjsServiceId) mergedSettings.emailjsServiceId = DEFAULT_SETTINGS.emailjsServiceId;
      if (!storedSettings.emailjsTemplateVerifyId) mergedSettings.emailjsTemplateVerifyId = DEFAULT_SETTINGS.emailjsTemplateVerifyId;
      if (!storedSettings.verificationExpiry) mergedSettings.verificationExpiry = DEFAULT_SETTINGS.verificationExpiry;
      save(STORAGE.settings, mergedSettings);
    }
  }

  // ========== State ==========
  var currentUser = null;
  var cart = [];
  var adminLoggedIn = false;

  function loadState() {
    currentUser = load(STORAGE.currentUser, null);
    cart = load(STORAGE.cart, []);
    adminLoggedIn = !!sessionStorage.getItem(STORAGE.adminSession);
    updateUI();
  }

  function updateUI() {
    var loginBtn = document.getElementById('loginNavBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    var balanceEl = document.getElementById('userBalance');
    var balAmount = document.getElementById('balanceAmount');
    var walletBal = document.getElementById('walletBalance');

    var settings = load(STORAGE.settings, DEFAULT_SETTINGS);
    var walletImg = document.getElementById('walletPaymentImage');
    if (walletImg) {
      walletImg.src = settings.walletImage || placeholderImg('IDLEB PAYMENT');
      walletImg.alt = 'صورة الدفع';
    }
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

    var walletNotice = document.getElementById('walletVerificationNotice');
    if (walletNotice) {
      if (!currentUser || isVerifiedUser()) {
        walletNotice.classList.add('hidden');
      } else {
        walletNotice.classList.remove('hidden');
      }
    }

    var badge = document.getElementById('cartBadge');
    var count = cart.reduce(function(s, i) { return s + i.qty; }, 0);
    if (badge) badge.textContent = count;
  }

  // ========== Navigation ==========
  window.showPage = function(pageId, param) {
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
    if (pageId === 'product-detail' && param) renderProductDetail(param);
    if (pageId === 'cart') renderCart();
    if (pageId === 'about') renderAbout();
    if (pageId === 'wallet') {
      updateUI();
      var topUp = document.getElementById('topUpSection');
      if (topUp) topUp.classList.add('hidden');
    }
    if (pageId === 'admin') {
      if (adminLoggedIn) {
        var adminLogin = document.getElementById('adminLogin');
        var adminPanel = document.getElementById('adminPanel');
        if (adminLogin) adminLogin.classList.add('hidden');
        if (adminPanel) adminPanel.classList.remove('hidden');
        switchAdminTab('stats');
      } else {
        var adminLogin2 = document.getElementById('adminLogin');
        var adminPanel2 = document.getElementById('adminPanel');
        if (adminLogin2) adminLogin2.classList.remove('hidden');
        if (adminPanel2) adminPanel2.classList.add('hidden');
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

  // ========== Render Home ==========
  function renderHome() {
    var cats = load(STORAGE.categories, []).sort(function(a, b) { return a.order - b.order; });
    var prods = load(STORAGE.products, []).filter(function(p) { return p.active; }).sort(function(a, b) { return (b.sales || 0) - (a.sales || 0); }).slice(0, 6);

    var catGrid = document.getElementById('homeCategories');
    if (catGrid) {
      catGrid.innerHTML = cats.map(function(c) {
        return '<div class="category-card" onclick="showPage(\'category\', \'' + c.id + '\')">' +
          '<img src="' + (c.image || placeholderImg(c.name)) + '" alt="' + c.name + '" loading="lazy">' +
          '<div class="card-body"><h3>' + c.name + '</h3></div></div>';
      }).join('');
    }

    var best = document.getElementById('bestSellers');
    if (best) {
      best.innerHTML = prods.map(function(p) { return productCardHTML(p); }).join('');
    }
  }

  function productCardHTML(p) {
    var price = Number(p.price || 0);
    return '<div class="product-card product-card-simple" onclick="openProductDetail(\'' + p.id + '\')">' +
      '<img src="' + (p.image || placeholderImg(p.name)) + '" alt="' + p.name + '" loading="lazy">' +
      '<div class="card-body">' +
      '<span class="product-type">' + typeLabel(p.type) + '</span>' +
      '<h3>' + p.name + '</h3>' +
      '<p>' + (p.desc || '') + '</p>' +
      (p.pricingNote ? '<div class="pricing-note">' + p.pricingNote + '</div>' : '<div class="product-price">ابتداءً من ' + formatPrice(price) + '</div>') +
      '<button class="btn btn-primary btn-full" onclick="event.stopPropagation(); openProductDetail(\'' + p.id + '\')">عرض التفاصيل والطلب</button>' +
      '</div></div>';
  }

  // ========== Categories ==========
  function renderCategories() {
    var cats = load(STORAGE.categories, []).sort(function(a, b) { return a.order - b.order; });
    var grid = document.getElementById('allCategories');
    if (grid) {
      grid.innerHTML = cats.map(function(c) {
        return '<div class="category-card" onclick="showPage(\'category\', \'' + c.id + '\')">' +
          '<img src="' + (c.image || placeholderImg(c.name)) + '" alt="' + c.name + '" loading="lazy">' +
          '<div class="card-body"><h3>' + c.name + '</h3></div></div>';
      }).join('');
    }
  }

  function getPlatformName(name) {
    var n = String(name || '').toLowerCase();
    if (n.includes('انستغرام') || n.includes('instagram')) return 'انستغرام';
    if (n.includes('تيك توك') || n.includes('tiktok')) return 'تيك توك';
    if (n.includes('تليجرام') || n.includes('telegram')) return 'تليجرام';
    if (n.includes('فيسبوك') || n.includes('facebook')) return 'فيسبوك';
    if (n.includes('يوتيوب') || n.includes('youtube')) return 'يوتيوب';
    return String(name || '').replace(/^رشق\s*/, '').replace(/(متابعين|تفاعل|مشاهدات|اعضاء|إعجابات)/g, '').trim() || 'خدمة';
  }

  function platformTypeLabel(type) {
    var map = { boost_followers: 'رشق متابعين', boost_engagement: 'رشق تفاعل / لايكات', boost_views: 'رشق مشاهدات' };
    return map[type] || typeLabel(type);
  }

  function renderCategoryProducts(catId) {
    var cats = load(STORAGE.categories, []);
    var cat = cats.find(function(c) { return c.id === catId; });
    var titleEl = document.getElementById('categoryTitle');
    if (titleEl) titleEl.textContent = cat ? cat.name : 'المنتجات';

    var prods = load(STORAGE.products, []).filter(function(p) { return p.categoryId === catId && p.active; });
    var grid = document.getElementById('categoryProducts');
    if (!grid) return;

    if (catId === 'cat3') {
      var groups = [];
      prods.forEach(function(p) {
        var platform = getPlatformName(p.name);
        if (!groups.some(function(g) { return g.platform === platform; })) {
          groups.push({ platform: platform, products: [] });
        }
        groups.find(function(g) { return g.platform === platform; }).products.push(p);
      });
      grid.innerHTML = groups.length ? groups.map(function(g) {
        var first = g.products[0];
        var types = [];
        for (var i = 0; i < g.products.length; i++) {
          if (types.indexOf(g.products[i].type) === -1) types.push(g.products[i].type);
        }
        return '<div class="category-card platform-card" onclick="openPlatformDetail(\'' + g.platform + '\')">' +
          '<img src="' + (first.image || placeholderImg(g.platform)) + '" alt="' + g.platform + '" loading="lazy">' +
          '<div class="card-body">' +
          '<span class="product-type">خدمات ' + g.platform + '</span>' +
          '<h3>' + g.platform + '</h3>' +
          '<p>اختر نوع الخدمة أولاً، ثم أدخل الرابط والكمية ورقم الواتساب والتفاصيل.</p>' +
          '<div class="platform-chips">' + types.map(function(t) { return '<span>' + platformTypeLabel(t) + '</span>'; }).join('') + '</div>' +
          '<button class="btn btn-primary btn-full">اختيار ' + g.platform + '</button>' +
          '</div></div>';
      }).join('') : '<p class="empty-state">لا توجد خدمات رشق حالياً</p>';
      return;
    }

    grid.innerHTML = prods.length ? prods.map(function(p) { return productCardHTML(p); }).join('') : '<p class="empty-state">لا توجد منتجات في هذا القسم حالياً</p>';
  }

  function getPlatformProducts(platform) {
    return load(STORAGE.products, []).filter(function(p) {
      return p.active && p.categoryId === 'cat3' && getPlatformName(p.name) === platform;
    });
  }

  window.openPlatformDetail = function(platform) {
    var products = getPlatformProducts(platform);
    if (!products.length) return toast('لا توجد خدمات لهذا المنتج حالياً', true);
    var content = document.getElementById('productDetailContent');
    if (!content) return;
    content.innerHTML = 
      '<div class="detail-hero-card">' +
      '<div><span class="eyebrow">IDLEB STORE • ' + platform + '</span>' +
      '<h1>خدمات ' + platform + '</h1>' +
      '<p>اختر نوع الرشق أولاً، وبعدها ستظهر لك صفحة الطلب المبسطة لإضافة رقمك والرابط والكمية والتفاصيل.</p>' +
      '</div></div>' +
      '<h2 class="section-title detail-subtitle">اختر نوع الخدمة</h2>' +
      '<div class="service-choice-grid">' +
      products.map(function(p) {
        return '<button class="service-choice" onclick="selectDetailProduct(\'' + p.id + '\')">' +
          '<span>' + platformTypeLabel(p.type) + '</span>' +
          '<strong>' + p.name + '</strong>' +
          '<small>' + (p.pricingNote || p.desc || 'اضغط للمتابعة') + '</small>' +
          '<b>متابعة ←</b></button>';
      }).join('') +
      '</div><div id="detailOrderFormWrap" class="detail-order-wrap hidden"></div>';
    showPage('product-detail', 'platform-' + encodeURIComponent(platform));
  };

  window.openProductDetail = function(productId) {
    var p = load(STORAGE.products, []).find(function(x) { return x.id === productId && x.active; });
    if (!p) return;
    renderSingleProductDetail(p);
    showPage('product-detail', productId);
  };

  window.selectDetailProduct = function(productId) {
    var p = load(STORAGE.products, []).find(function(x) { return x.id === productId && x.active; });
    if (!p) return;
    renderDetailOrderForm(p);
  };

  function renderProductDetail(param) {
    if (String(param).startsWith('platform-')) {
      var platform = decodeURIComponent(String(param).slice(9));
      renderPlatformPage(platform);
    } else {
      var p = load(STORAGE.products, []).find(function(x) { return x.id === param && x.active; });
      if (p) renderSingleProductDetail(p);
    }
  }

  function renderPlatformPage(platform) {
    var products = getPlatformProducts(platform);
    var content = document.getElementById('productDetailContent');
    if (!content) return;
    if (!products.length) { content.innerHTML = '<p class="empty-state">الخدمة غير متاحة حالياً</p>'; return; }
    content.innerHTML = 
      '<div class="detail-hero-card">' +
      '<div><span class="eyebrow">IDLEB STORE • ' + platform + '</span><h1>خدمات ' + platform + '</h1><p>اختر نوع الخدمة أولاً، ثم عبّئ بيانات الطلب في نفس الصفحة.</p></div>' +
      '</div><h2 class="section-title detail-subtitle">اختر نوع الخدمة</h2>' +
      '<div class="service-choice-grid">' +
      products.map(function(p) {
        return '<button class="service-choice" onclick="selectDetailProduct(\'' + p.id + '\')">' +
          '<span>' + platformTypeLabel(p.type) + '</span>' +
          '<strong>' + p.name + '</strong>' +
          '<small>' + (p.pricingNote || p.desc || '') + '</small>' +
          '<b>متابعة ←</b></button>';
      }).join('') +
      '</div><div id="detailOrderFormWrap" class="detail-order-wrap hidden"></div>';
  }

  function renderSingleProductDetail(p) {
    var content = document.getElementById('productDetailContent');
    if (!content) return;
    content.innerHTML = 
      '<div class="detail-hero-card product-detail-head">' +
      '<img src="' + (p.image || placeholderImg(p.name)) + '" alt="' + p.name + '">' +
      '<div><span class="eyebrow">' + typeLabel(p.type) + '</span><h1>' + p.name + '</h1><p>' + (p.desc || '') + '</p></div>' +
      '</div><div id="detailOrderFormWrap" class="detail-order-wrap"></div>';
    renderDetailOrderForm(p);
  }

  function renderDetailOrderForm(p) {
    var wrap = document.getElementById('detailOrderFormWrap');
    if (!wrap) return;
    var boost = ['boost_followers', 'boost_engagement', 'boost_views'].indexOf(p.type) !== -1;
    var game = p.type === 'games';
    var meta = targetMeta(p.type);
    var unit = Number(p.unitSize || 1000);
    wrap.classList.remove('hidden');
    wrap.innerHTML = 
      '<div class="order-form-card">' +
      '<div class="order-form-heading"><div><span class="product-type">' + typeLabel(p.type) + '</span><h2>تفاصيل الطلب</h2></div><strong id="detailLiveTotal">' + formatPrice(Number(p.price || 0)) + '</strong></div>' +
      '<div class="detail-form-grid">' +
      '<div class="form-group"><label>رقم واتساب العميل <span class="required">*</span></label><input type="tel" id="detailWhatsapp" value="' + (currentUser?.whatsapp || '') + '" placeholder="مثال: +9639xxxxxxxx" required></div>' +
      '<div class="form-group"><label>' + meta.label + ' <span class="required">*</span></label><input type="' + meta.kind + '" id="detailTarget" placeholder="' + meta.placeholder + '" required></div>' +
      ((boost || game) ? '<div class="form-group"><label>' + (boost ? 'الكمية المطلوبة' : 'الكمية') + ' <span class="required">*</span></label><input type="number" id="detailQuantity" min="' + unit + '" step="' + unit + '" value="' + unit + '"><small class="field-hint">' + (p.pricingNote || 'كل ' + unit.toLocaleString('en-US') + ' = ' + formatPrice(p.price)) + '</small></div>' : '') +
      '<div class="form-group detail-notes"><label>تفاصيل إضافية <small>(اختياري)</small></label><textarea id="detailNotes" rows="4" placeholder="اكتب أي تفاصيل تساعد الإدمن على تنفيذ الطلب"></textarea></div>' +
      '</div><button class="btn btn-primary btn-full btn-lg" onclick="submitDetailOrder(\'' + p.id + '\')">تأكيد الطلب</button></div>';
    bindDetailQuantity(p);
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.updateDetailTotal = function(productId) {
    var p = load(STORAGE.products, []).find(function(x) { return x.id === productId; });
    var out = document.getElementById('detailLiveTotal');
    var input = document.getElementById('detailQuantity');
    if (!p || !out || !input) return;
    var quantityBased = ['boost_followers', 'boost_engagement', 'boost_views', 'games'].indexOf(p.type) !== -1;
    if (!quantityBased) return;
    var unit = Number(p.unitSize || 1);
    var q = Math.max(unit, Number(input.value) || unit);
    q = Math.ceil(q / unit) * unit;
    input.value = q;
    out.textContent = formatPrice((q / unit) * Number(p.price || 0));
  };

  function bindDetailQuantity(p) {
    var input = document.getElementById('detailQuantity');
    if (!input) return;
    input.addEventListener('input', function() { updateDetailTotal(p.id); });
    input.addEventListener('change', function() { updateDetailTotal(p.id); });
    updateDetailTotal(p.id);
  }

  window.submitDetailOrder = function(productId) {
    if (!requireVerifiedUser()) return;
    var p = load(STORAGE.products, []).find(function(x) { return x.id === productId && x.active; });
    if (!p) return;
    if (!currentUser) { toast('سجّل الدخول أولاً لإرسال الطلب', true); showPage('login'); return; }
    var whatsapp = (document.getElementById('detailWhatsapp')?.value || '').trim();
    var target = (document.getElementById('detailTarget')?.value || '').trim();
    var notes = (document.getElementById('detailNotes')?.value || '').trim();
    if (!whatsapp || whatsapp.length < 6) return toast('رقم واتساب العميل إجباري', true);
    if (!target) return toast('أدخل الرابط أو معرّف اللاعب', true);
    if (URL_TYPES.indexOf(p.type) !== -1) { try { new URL(target); } catch (e) { return toast('الرابط غير صالح', true); } }
    var quantity = 1, total = Number(p.price || 0), unit = 1;
    if (['boost_followers', 'boost_engagement', 'boost_views'].indexOf(p.type) !== -1) {
      unit = Number(p.unitSize || 1000);
      quantity = Math.max(unit, Number(document.getElementById('detailQuantity')?.value) || unit);
      quantity = Math.ceil(quantity / unit) * unit;
      total = (quantity / unit) * Number(p.price || 0);
    } else if (p.type === 'games') {
      unit = Number(p.unitSize || 1);
      quantity = Math.max(unit, Number(document.getElementById('detailQuantity')?.value) || unit);
      quantity = Math.ceil(quantity / unit) * unit;
      total = (quantity / unit) * Number(p.price || 0);
    }
    if ((currentUser.balance || 0) < total) { toast('رصيدك غير كافٍ. يرجى شحن المحفظة أولاً', true); showPage('wallet'); return; }
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
      source: 'product_detail',
      items: [{
        productId: p.id,
        name: p.name,
        serviceType: p.type,
        quantity: quantity,
        qty: 1,
        unitSize: unit,
        unitPrice: Number(p.price || 0),
        price: total,
        lineTotal: total,
        image: p.image || '',
        targetUrl: target,
        notes: notes
      }],
      notes: notes
    };
    var orders = load(STORAGE.orders, []);
    orders.push(order);
    save(STORAGE.orders, orders);
    var products = load(STORAGE.products, []);
    var saved = products.find(function(x) { return x.id === p.id; });
    if (saved) saved.sales = (saved.sales || 0) + 1;
    save(STORAGE.products, products);
    updateUI();
    document.getElementById('orderSuccessMsg').textContent = 'تم إرسال الطلب ' + order.id + ' بنجاح — واتساب: ' + order.whatsapp + ' — المجموع: ' + formatPrice(total);
    showPage('order-success');
  };

  // ========== Quick Purchase ==========
  var URL_TYPES = ['accounts', 'unban', 'boost_followers', 'boost_engagement', 'boost_views'];

  function targetMeta(type) {
    if (URL_TYPES.indexOf(type) !== -1) {
      return { label: 'رابط الحساب / المنشور', placeholder: 'https://instagram.com/...', kind: 'url', required: true };
    }
    if (type === 'games') {
      return { label: 'معرّف اللاعب / ID', placeholder: 'أدخل ID اللاعب', kind: 'text', required: true };
    }
    return { label: 'بيانات التنفيذ', placeholder: 'اكتب أي معلومات يحتاجها الإدمن لتنفيذ الخدمة', kind: 'text', required: true };
  }

  window.openQuickOrder = function(productId) {
    if (!requireVerifiedUser()) return;
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    var products = load(STORAGE.products, []);
    var p = products.find(function(x) { return x.id === productId && x.active; });
    if (!p) return;
    var q = getProductQuantity(p);
    var meta = targetMeta(p.type);
    var modal = document.getElementById('quickOrderModal');
    if (!modal) return;
    document.getElementById('quickOrderTitle').textContent = p.name;
    document.getElementById('quickOrderSummary').textContent = p.pricingNote || p.desc || 'أدخل البيانات المطلوبة وسيتم إرسال الطلب مباشرة إلى لوحة التحكم.';
    document.getElementById('quickOrderTotal').textContent = formatPrice(q.total);
    var quantityBased = ['boost_followers', 'boost_engagement', 'boost_views', 'games'].indexOf(p.type) !== -1;
    var quantityUnit = Number(p.unitSize || 1);
    document.getElementById('quickOrderForm').innerHTML = 
      (quantityBased ? '<div class="form-group"><label>الكمية المطلوبة</label><input type="number" id="quickQuantity" min="' + quantityUnit + '" step="' + quantityUnit + '" value="' + (quantityBased ? q.quantity : quantityUnit) + '"><small class="field-hint">' + (p.pricingNote || 'كل ' + quantityUnit.toLocaleString('en-US') + ' = ' + formatPrice(p.price)) + '</small></div>' : '') +
      '<div class="form-group"><label>رقم واتساب العميل <span class="required">*</span></label><input type="tel" id="quickWhatsapp" value="' + (currentUser.whatsapp || '') + '" placeholder="مثال: +9639xxxxxxxx" required></div>' +
      '<div class="form-group"><label>' + meta.label + ' <span class="required">*</span></label><input type="' + meta.kind + '" id="quickTarget" placeholder="' + meta.placeholder + '" required></div>' +
      '<div class="form-group"><label>ملاحظات إضافية <small>(اختياري)</small></label><textarea id="quickNotes" rows="3" placeholder="أي ملاحظة للإدمن"></textarea></div>' +
      '<input type="hidden" id="quickProductId" value="' + p.id + '">';
    modal.classList.remove('hidden');
  };

  window.updateQuickOrderTotal = function(unitPrice, unitSize) {
    var input = document.getElementById('quickQuantity');
    if (!input) return;
    var q = Math.max(unitSize, Number(input.value) || unitSize);
    q = Math.ceil(q / unitSize) * unitSize;
    input.value = q;
    var totalEl = document.getElementById('quickOrderTotal');
    if (totalEl) totalEl.textContent = formatPrice((q / unitSize) * unitPrice);
  };

  document.addEventListener('input', function(event) {
    if (event.target && event.target.id === 'quickQuantity') {
      var productId = document.getElementById('quickProductId')?.value;
      var p = load(STORAGE.products, []).find(function(x) { return x.id === productId; });
      if (p) window.updateQuickOrderTotal(Number(p.price || 0), Number(p.unitSize || 1));
    }
  });

  window.closeQuickOrder = function() {
    var modal = document.getElementById('quickOrderModal');
    if (modal) modal.classList.add('hidden');
  };

  window.submitQuickOrder = function() {
    if (!currentUser) return closeQuickOrder();
    var products = load(STORAGE.products, []);
    var p = products.find(function(x) { return x.id === document.getElementById('quickProductId').value; });
    if (!p) return;
    var whatsapp = document.getElementById('quickWhatsapp').value.trim();
    var target = document.getElementById('quickTarget').value.trim();
    var notes = document.getElementById('quickNotes').value.trim();
    if (!whatsapp || whatsapp.length < 6) return toast('رقم واتساب العميل إجباري', true);
    if (!target) return toast('أدخل بيانات الخدمة المطلوبة', true);
    if (URL_TYPES.indexOf(p.type) !== -1) {
      try { new URL(target); } catch (e) { return toast('رابط الحساب غير صالح', true); }
    }
    var q = ['boost_followers', 'boost_engagement', 'boost_views', 'games'].indexOf(p.type) !== -1 ?
      (function() {
        var unit = Number(p.unitSize || 1);
        var n = Math.max(unit, Number(document.getElementById('quickQuantity')?.value) || unit);
        n = Math.ceil(n / unit) * unit;
        return { quantity: n, total: (n / unit) * Number(p.price || 0), unit: unit };
      })() :
      { quantity: 1, total: Number(p.price || 0), unit: 1 };
    if ((currentUser.balance || 0) < q.total) {
      toast('رصيدك غير كافٍ. يرجى شحن المحفظة أولاً', true);
      closeQuickOrder();
      showPage('wallet');
      return;
    }
    currentUser.balance -= q.total;
    currentUser.whatsapp = whatsapp;
    saveUser(currentUser);
    var order = {
      id: uid('ord'),
      username: currentUser.username,
      whatsapp: whatsapp,
      total: q.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: notes,
      source: 'quick_purchase',
      items: [{
        productId: p.id,
        name: p.name,
        serviceType: p.type,
        quantity: q.quantity,
        qty: 1,
        unitSize: q.unit,
        unitPrice: Number(p.price || 0),
        price: q.total,
        lineTotal: q.total,
        image: p.image || '',
        targetUrl: target,
        notes: notes
      }]
    };
    var orders = load(STORAGE.orders, []);
    orders.push(order);
    save(STORAGE.orders, orders);
    p.sales = (p.sales || 0) + 1;
    save(STORAGE.products, products);
    closeQuickOrder();
    updateUI();
    document.getElementById('orderSuccessMsg').textContent = 'تم إرسال الطلب ' + order.id + ' بنجاح — واتساب: ' + order.whatsapp + ' — المجموع: ' + formatPrice(order.total);
    showPage('order-success');
  };

  function getProductQuantity(product) {
    var quantityBased = ['boost_followers', 'boost_engagement', 'boost_views', 'games'].indexOf(product.type) !== -1;
    var unit = Number(product.unitSize || 1);
    if (!quantityBased) return { quantity: 1, total: Number(product.price || 0), unit: unit };
    var input = document.getElementById('qty-' + product.id);
    var quantity = Math.max(unit, Number(input && input.value) || unit);
    quantity = Math.ceil(quantity / unit) * unit;
    return { quantity: quantity, total: (quantity / unit) * Number(product.price || 0), unit: unit };
  }

  // ========== Cart ==========
  window.addToCart = function(productId) {
    if (!requireVerifiedUser()) return;
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    var products = load(STORAGE.products, []);
    var p = products.find(function(x) { return x.id === productId; });
    if (!p) return;

    var boost = ['boost_followers', 'boost_engagement', 'boost_views'].indexOf(p.type) !== -1;
    var qty = 1;
    var unitSize = Number(p.unitSize || 1000);
    var linePrice = Number(p.price || 0);
    if (boost) {
      var input = document.getElementById('qty-' + p.id);
      qty = Math.max(unitSize, Number(input && input.value) || unitSize);
      qty = Math.ceil(qty / unitSize) * unitSize;
      linePrice = (qty / unitSize) * Number(p.price || 0);
    }
    var existing = cart.find(function(i) { return i.productId === productId; });
    if (existing && !boost) {
      existing.qty += 1;
      existing.lineTotal = existing.qty * Number(p.price || 0);
    } else {
      cart.push({
        productId: productId,
        qty: 1,
        name: p.name,
        price: linePrice,
        lineTotal: linePrice,
        image: p.image,
        serviceType: p.type,
        unitSize: unitSize,
        unitPrice: Number(p.price || 0),
        quantity: qty,
        targetUrl: ''
      });
    }
    save(STORAGE.cart, cart);
    updateUI();
    toast('تمت الإضافة إلى السلة ✓');
  };

  function renderCart() {
    var empty = document.getElementById('cartEmpty');
    var content = document.getElementById('cartContent');
    if (!cart.length) {
      if (empty) empty.classList.remove('hidden');
      if (content) content.classList.add('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    var total = 0;
    var itemsEl = document.getElementById('cartItems');
    if (itemsEl) {
      itemsEl.innerHTML = cart.map(function(item, idx) {
        total += Number(item.lineTotal != null ? item.lineTotal : item.price * item.qty);
        return '<div class="cart-item">' +
          '<img src="' + (item.image || placeholderImg(item.name)) + '" alt="">' +
          '<div class="cart-item-info">' +
          '<h4>' + item.name + '</h4>' +
          '<div class="product-price">' + formatPrice(item.lineTotal != null ? item.lineTotal : item.price * item.qty) + '</div>' +
          (item.quantity ? '<small>الكمية: ' + Number(item.quantity).toLocaleString('en-US') + '</small>' : '') +
          (['accounts', 'unban', 'boost_followers', 'boost_engagement', 'boost_views'].indexOf(item.serviceType) !== -1 || item.serviceType === 'games' || item.serviceType === 'other' ?
            '<div class="form-group order-target-field"><label>' + targetMeta(item.serviceType).label + ' <span class="required">*</span></label><input type="' + targetMeta(item.serviceType).kind + '" id="target-' + idx + '" value="' + (item.targetUrl || '') + '" placeholder="' + targetMeta(item.serviceType).placeholder + '" required></div>' : '') +
          '</div>' +
          '<div class="cart-item-actions">' +
          '<button class="qty-btn" onclick="changeQty(' + idx + ', -1)">−</button>' +
          '<span>' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(' + idx + ', 1)">+</button>' +
          '<button class="btn btn-danger btn-sm" onclick="removeFromCart(' + idx + ')">حذف</button>' +
          '</div></div>';
      }).join('');
    }
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = formatPrice(total);
  }

  window.changeQty = function(idx, delta) {
    if (['boost_followers', 'boost_engagement', 'boost_views'].indexOf(cart[idx].serviceType) !== -1) {
      var step = Number(cart[idx].unitSize || 1000);
      cart[idx].qty = Math.max(step, cart[idx].qty + delta * step);
      cart[idx].quantity = cart[idx].qty;
      cart[idx].lineTotal = (cart[idx].qty / step) * Number(cart[idx].unitPrice || 0);
    } else {
      cart[idx].qty += delta;
      if (cart[idx].qty < 1) cart.splice(idx, 1);
    }
    save(STORAGE.cart, cart);
    updateUI();
    renderCart();
  };

  window.removeFromCart = function(idx) {
    cart.splice(idx, 1);
    save(STORAGE.cart, cart);
    updateUI();
    renderCart();
  };

  window.checkout = function() {
    if (!requireVerifiedUser('إتمام الطلب')) return;
    if (!currentUser) { toast('يجب تسجيل الدخول', true); showPage('login'); return; }
    if (!cart.length) return;
    var whatsappEl = document.getElementById('orderWhatsapp');
    var whatsapp = (whatsappEl && whatsappEl.value || '').trim();
    if (!whatsapp || whatsapp.length < 6) { toast('رقم واتساب إجباري لإتمام الطلب', true); if (whatsappEl) whatsappEl.focus(); return; }

    var normalizedCart;
    try {
      normalizedCart = cart.map(function(item, index) {
        var needsTarget = URL_TYPES.indexOf(item.serviceType) !== -1;
        var targetUrl = item.targetUrl || '';
        if (needsTarget || item.serviceType === 'games' || item.serviceType === 'other') {
          var field = document.getElementById('target-' + index);
          targetUrl = (field && field.value || '').trim();
          if (!targetUrl) throw new Error('missing-target');
          if (needsTarget) { try { new URL(targetUrl); } catch (e) { throw new Error('bad-url'); } }
        }
        var lineTotal = Number(item.lineTotal != null ? item.lineTotal : item.price * item.qty);
        return Object.assign({}, item, { targetUrl: targetUrl, lineTotal: lineTotal, notes: item.notes || '' });
      });
    } catch (err) {
      toast(err && err.message === 'bad-url' ? 'أحد الروابط غير صالح' : 'أدخل بيانات التنفيذ لكل خدمة', true);
      return;
    }
    var total = normalizedCart.reduce(function(s, i) { return s + Number(i.lineTotal || 0); }, 0);
    if ((currentUser.balance || 0) < total) { toast('رصيدك غير كافٍ. يرجى شحن المحفظة أولاً', true); showPage('wallet'); return; }
    currentUser.balance -= total;
    currentUser.whatsapp = whatsapp;
    saveUser(currentUser);
    var order = {
      id: uid('ord'),
      username: currentUser.username,
      whatsapp: whatsapp,
      items: normalizedCart,
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      source: 'cart_checkout'
    };
    var orders = load(STORAGE.orders, []);
    orders.push(order);
    save(STORAGE.orders, orders);
    var products = load(STORAGE.products, []);
    normalizedCart.forEach(function(item) {
      var p = products.find(function(x) { return x.id === item.productId; });
      if (p) p.sales = (p.sales || 0) + 1;
    });
    save(STORAGE.products, products);
    cart = [];
    save(STORAGE.cart, cart);
    updateUI();
    document.getElementById('orderSuccessMsg').textContent = 'تم إرسال الطلب ' + order.id + ' بنجاح — واتساب: ' + order.whatsapp + ' — المجموع: ' + formatPrice(total);
    showPage('order-success');
  };

  // ========== Auth ==========
  window.handleAuth = async function(e) {
    e.preventDefault();
    var username = document.getElementById('authUsername').value.trim();
    var email = document.getElementById('authEmail').value.trim().toLowerCase();
    var password = document.getElementById('authPassword').value;
    var passwordConfirm = document.getElementById('authPasswordConfirm').value;
    var retryBox = document.getElementById('verificationRetryBox');
    if (retryBox) retryBox.classList.add('hidden');

    // ADMIN LOGIN
    if (username === ADMIN_USER && btoa(password) === ADMIN_HASH) {
      adminLoggedIn = true;
      sessionStorage.setItem(STORAGE.adminSession, '1');
      toast('مرحباً ' + ADMIN_DISPLAY_NAME);
      showPage('admin');
      var adminLogin = document.getElementById('adminLogin');
      var adminPanel = document.getElementById('adminPanel');
      if (adminLogin) adminLogin.classList.add('hidden');
      if (adminPanel) adminPanel.classList.remove('hidden');
      switchAdminTab('stats');
      return;
    }

    if (!username) return toast('اسم المستخدم مطلوب', true);
    if (!email) return toast('البريد الإلكتروني مطلوب', true);
    if (password.length < 4) return toast('كلمة المرور يجب أن تكون 4 أحرف على الأقل', true);
    if (password !== passwordConfirm) return toast('كلمتا المرور غير متطابقتين', true);

    var users = load(STORAGE.users, []);
    var pendingUsers = load(STORAGE.pendingUsers, []);
    var user = users.find(function(u) { return u.username === username || (u.email && u.email.toLowerCase() === email); });
    var pending = pendingUsers.find(function(u) { return u.username === username || (u.email && u.email.toLowerCase() === email); });

    if (user) {
      if (user.email && user.email.toLowerCase() !== email) return toast('البريد الإلكتروني لا يطابق الحساب', true);
      if (user.password !== btoa(password)) return toast('كلمة المرور غير صحيحة', true);
      if (user.isVerified === false) {
        pendingVerificationUser = pending || { username: user.username, email: user.email, password: user.password, balance: user.balance || 0 };
        toast('يرجى تفعيل حسابك عبر البريد الإلكتروني', true);
        showVerificationRetry('حسابك غير مفعل. أدخل رمز التفعيل الذي وصلك إلى بريدك الإلكتروني أو أعد إرساله.', pendingVerificationUser);
        var box = document.getElementById('verificationCodeBox');
        if (box) box.classList.remove('hidden');
        return;
      }
      currentUser = { username: user.username, email: user.email, balance: user.balance || 0, isVerified: true };
      save(STORAGE.currentUser, currentUser);
      updateUI();
      toast('مرحباً ' + username);
      showPage('home');
      return;
    }

    if (pending) {
      if (pending.password !== btoa(password)) return toast('كلمة المرور غير صحيحة', true);
      pendingVerificationUser = pending;
      toast('يرجى تفعيل حسابك عبر البريد الإلكتروني', true);
      showVerificationRetry('تم إنشاء الحساب لكنه غير مفعل. أدخل رمز التفعيل أو أعد إرساله.', pending);
      var box2 = document.getElementById('verificationCodeBox');
      if (box2) box2.classList.remove('hidden');
      return;
    }

    var newPendingUser = { username: username, email: email, password: btoa(password), balance: 0 };
    try {
      await window.sendVerificationEmail(newPendingUser);
      var box3 = document.getElementById('verificationCodeBox');
      if (box3) box3.classList.remove('hidden');
      showVerificationRetry('تم إرسال رمز التفعيل إلى بريدك الإلكتروني. أدخل الرمز المكوّن من 6 أرقام لإكمال التسجيل.', newPendingUser);
      toast('تم إرسال رمز التفعيل إلى بريدك الإلكتروني');
    } catch (error) {
      console.error(error);
      pendingVerificationUser = load(STORAGE.pendingUsers, []).find(function(u) { return u.username === username; }) || newPendingUser;
      var box4 = document.getElementById('verificationCodeBox');
      if (box4) box4.classList.remove('hidden');
      showVerificationRetry('تعذر إرسال رمز التفعيل. تأكد من إعدادات قالب EmailJS ثم اضغط إعادة الإرسال.', pendingVerificationUser);
      toast('تعذر إرسال البريد حالياً. راجع إعدادات EmailJS', true);
    }
  };

  window.logout = function() {
    currentUser = null;
    localStorage.removeItem(STORAGE.currentUser);
    updateUI();
    toast('تم تسجيل الخروج');
    showPage('home');
  };

  function saveUser(user) {
    var users = load(STORAGE.users, []);
    var idx = users.findIndex(function(u) { return u.username === user.username; });
    if (idx >= 0) {
      users[idx].balance = user.balance;
      if (user.email) users[idx].email = user.email;
      if (typeof user.isVerified === 'boolean') users[idx].isVerified = user.isVerified;
      save(STORAGE.users, users);
    }
    currentUser = user;
    save(STORAGE.currentUser, currentUser);
  }

  // ========== Wallet / TopUp ==========
  window.showTopUpModal = function() {
    if (!requireVerifiedUser('استخدام المحفظة')) return;
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    var topUp = document.getElementById('topUpSection');
    if (topUp) topUp.classList.remove('hidden');
  };

  window.copyShamCode = function() {
    var code = document.getElementById('shamCode').textContent;
    navigator.clipboard.writeText(code).then(function() { toast('تم نسخ رقم المحفظة'); });
  };

  window.submitTopUp = function(e) {
    e.preventDefault();
    if (!requireVerifiedUser('استخدام المحفظة')) return;
    if (!currentUser) return;

    var txNumber = document.getElementById('txNumber').value.trim();
    var amount = Number(document.getElementById('txAmount').value);
    var currency = document.getElementById('txCurrency').value;

    if (!txNumber || amount < 1) {
      toast('يرجى إدخال بيانات صحيحة', true);
      return;
    }

    var topups = load(STORAGE.topups, []);
    topups.push({
      id: uid('top'),
      username: currentUser.username,
      txNumber: txNumber,
      amount: amount,
      currency: currency,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    save(STORAGE.topups, topups);

    document.getElementById('topUpForm').reset();
    var topUpSection = document.getElementById('topUpSection');
    if (topUpSection) topUpSection.classList.add('hidden');
    toast('تم استلام طلبك، سيتم مراجعته قريباً ✓');
  };

  // ========== Admin ==========
  window.adminLogin = function(e) {
    e.preventDefault();
    var user = document.getElementById('adminUser').value.trim();
    var pass = document.getElementById('adminPass').value;

    if (user === ADMIN_USER && btoa(pass) === ADMIN_HASH) {
      adminLoggedIn = true;
      sessionStorage.setItem(STORAGE.adminSession, '1');
      var adminLogin = document.getElementById('adminLogin');
      var adminPanel = document.getElementById('adminPanel');
      if (adminLogin) adminLogin.classList.add('hidden');
      if (adminPanel) adminPanel.classList.remove('hidden');
      switchAdminTab('stats');
      toast('مرحباً أدمن');
    } else {
      toast('بيانات الدخول غير صحيحة', true);
    }
  };

  window.adminLogout = function() {
    adminLoggedIn = false;
    sessionStorage.removeItem(STORAGE.adminSession);
    var adminLogin = document.getElementById('adminLogin');
    var adminPanel = document.getElementById('adminPanel');
    if (adminLogin) adminLogin.classList.remove('hidden');
    if (adminPanel) adminPanel.classList.add('hidden');
    showPage('home');
  };

  window.switchAdminTab = function(tab) {
    var contents = document.querySelectorAll('.admin-tab-content');
    for (var i = 0; i < contents.length; i++) {
      contents[i].classList.remove('active');
    }
    var btns = document.querySelectorAll('.tab-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].classList.remove('active');
    }
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
    if (tab === 'settings') renderSiteSettings();
  };

  function renderStats() {
    var products = load(STORAGE.products, []);
    var orders = load(STORAGE.orders, []);
    var topups = load(STORAGE.topups, []);
    var users = load(STORAGE.users, []);
    var totalTopup = topups.filter(function(t) { return t.status === 'approved'; }).reduce(function(s, t) { return s + Number(t.amount); }, 0);
    var totalSales = orders.reduce(function(s, o) { return s + o.total; }, 0);

    var grid = document.getElementById('statsGrid');
    if (grid) {
      grid.innerHTML =
        '<div class="stat-card"><h4>عدد المنتجات</h4><p>' + products.length + '</p></div>' +
        '<div class="stat-card"><h4>عدد الطلبات</h4><p>' + orders.length + '</p></div>' +
        '<div class="stat-card"><h4>طلبات الشحن</h4><p>' + topups.length + '</p></div>' +
        '<div class="stat-card"><h4>المستخدمين</h4><p>' + users.length + '</p></div>' +
        '<div class="stat-card"><h4>إجمالي المبيعات</h4><p>' + formatPrice(totalSales) + '</p></div>' +
        '<div class="stat-card"><h4>الرصيد المشحون</h4><p>' + totalTopup + '</p></div>';
    }
  }

  // Categories admin
  window.showAddCategoryForm = function() {
    var form = document.getElementById('addCategoryForm');
    if (form) form.classList.remove('hidden');
  };
  window.hideAddCategoryForm = function() {
    var form = document.getElementById('addCategoryForm');
    if (form) form.classList.add('hidden');
  };

  window.addCategory = function() {
    var name = document.getElementById('catName').value.trim();
    var image = document.getElementById('catImage').value.trim();
    if (!name) return toast('أدخل اسم القسم', true);

    var cats = load(STORAGE.categories, []);
    cats.push({
      id: uid('cat'),
      name: name,
      image: image,
      order: cats.length + 1
    });
    save(STORAGE.categories, cats);
    document.getElementById('catName').value = '';
    document.getElementById('catImage').value = '';
    hideAddCategoryForm();
    renderAdminCategories();
    toast('تمت إضافة القسم');
  };

  function renderAdminCategories() {
    var cats = load(STORAGE.categories, []).sort(function(a, b) { return a.order - b.order; });
    var tbody = document.querySelector('#catsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = cats.map(function(c) {
      return '<tr><td>' + c.name + '</td><td>' + (c.image ? '✓' : '—') + '</td><td>' + c.order + '</td><td>' +
        '<button class="btn btn-sm btn-secondary" onclick="editCategory(\'' + c.id + '\')">تعديل</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteCategory(\'' + c.id + '\')">حذف</button></td></tr>';
    }).join('');
  }

  window.editCategory = function(id) {
    var cats = load(STORAGE.categories, []);
    var c = cats.find(function(x) { return x.id === id; });
    if (!c) return;
    var newName = prompt('اسم القسم الجديد:', c.name);
    if (newName === null) return;
    c.name = newName.trim() || c.name;
    var newImg = prompt('رابط الصورة (اتركه كما هو):', c.image || '');
    if (newImg !== null) c.image = newImg.trim();
    save(STORAGE.categories, cats);
    renderAdminCategories();
    toast('تم التعديل');
  };

  window.deleteCategory = function(id) {
    if (!confirm('هل تريد حذف هذا القسم؟')) return;
    var cats = load(STORAGE.categories, []);
    cats = cats.filter(function(c) { return c.id !== id; });
    save(STORAGE.categories, cats);
    renderAdminCategories();
    toast('تم الحذف');
  };

  // Products admin
  window.showAddProductForm = function() {
    var cats = load(STORAGE.categories, []);
    var sel = document.getElementById('prodCategory');
    if (sel) {
      sel.innerHTML = cats.map(function(c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('');
    }
    var form = document.getElementById('addProductForm');
    if (form) form.classList.remove('hidden');
  };
  window.hideAddProductForm = function() {
    var form = document.getElementById('addProductForm');
    if (form) form.classList.add('hidden');
  };

  window.addProduct = function() {
    var name = document.getElementById('prodName').value.trim();
    var desc = document.getElementById('prodDesc').value.trim();
    var price = Number(document.getElementById('prodPrice').value);
    var unitSize = Number(document.getElementById('prodUnitSize').value) || 1000;
    var pricingNote = document.getElementById('prodPricingNote').value.trim();
    var image = document.getElementById('prodImage').value.trim();
    var categoryId = document.getElementById('prodCategory').value;
    var type = document.getElementById('prodType').value;
    var active = document.getElementById('prodActive').checked;

    if (!name || price < 0) return toast('بيانات غير مكتملة', true);

    var products = load(STORAGE.products, []);
    products.push({
      id: uid('p'),
      name: name,
      desc: desc,
      price: price,
      unitSize: unitSize,
      pricingNote: pricingNote,
      image: image,
      categoryId: categoryId,
      type: type,
      active: active,
      sales: 0
    });
    save(STORAGE.products, products);
    hideAddProductForm();
    document.getElementById('prodName').value = '';
    document.getElementById('prodDesc').value = '';
    document.getElementById('prodPrice').value = '';
    document.getElementById('prodUnitSize').value = '1000';
    document.getElementById('prodPricingNote').value = '';
    document.getElementById('prodImage').value = '';
    renderAdminProducts();
    toast('تمت إضافة المنتج');
  };

  function renderAdminProducts() {
    var products = load(STORAGE.products, []);
    var cats = load(STORAGE.categories, []);
    var tbody = document.querySelector('#prodsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = products.map(function(p) {
      var cat = cats.find(function(c) { return c.id === p.categoryId; });
      return '<tr><td>' + p.name + '</td><td>' + (cat ? cat.name : '—') + '</td><td>' +
        formatPrice(p.price) + (['boost_followers', 'boost_engagement', 'boost_views'].indexOf(p.type) !== -1 ? '<br><small>لكل ' + Number(p.unitSize || 1000).toLocaleString('en-US') + '</small>' : '') +
        '</td><td>' + typeLabel(p.type) + '</td><td>' + (p.active ? '🟢 نشط' : '🔴 متوقف') + '</td><td>' +
        '<button class="btn btn-sm btn-secondary" onclick="toggleProduct(\'' + p.id + '\')">' + (p.active ? 'إيقاف' : 'تفعيل') + '</button>' +
        '<button class="btn btn-sm btn-secondary" onclick="editProduct(\'' + p.id + '\')">تعديل</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteProduct(\'' + p.id + '\')">حذف</button></td></tr>';
    }).join('');
  }

  window.toggleProduct = function(id) {
    var products = load(STORAGE.products, []);
    var p = products.find(function(x) { return x.id === id; });
    if (p) {
      p.active = !p.active;
      save(STORAGE.products, products);
      renderAdminProducts();
    }
  };

  window.editProduct = function(id) {
    var products = load(STORAGE.products, []);
    var p = products.find(function(x) { return x.id === id; });
    if (!p) return;
    var name = prompt('الاسم:', p.name);
    if (name === null) return;
    p.name = name.trim() || p.name;
    var price = prompt('السعر:', p.price);
    if (price !== null) p.price = Number(price) || p.price;
    var desc = prompt('الوصف:', p.desc || '');
    if (desc !== null) p.desc = desc;
    save(STORAGE.products, products);
    renderAdminProducts();
    toast('تم التعديل');
  };

  window.deleteProduct = function(id) {
    if (!confirm('حذف المنتج؟')) return;
    var products = load(STORAGE.products, []);
    products = products.filter(function(p) { return p.id !== id; });
    save(STORAGE.products, products);
    renderAdminProducts();
    toast('تم الحذف');
  };

  // Topups
  function renderAdminTopups() {
    var topups = load(STORAGE.topups, []).reverse();
    var tbody = document.querySelector('#topupsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = topups.map(function(t) {
      return '<tr><td>' + t.username + '</td><td>' + t.txNumber + '</td><td>' + t.amount + '</td><td>' + t.currency + '</td><td>' + statusBadge(t.status) + '</td><td>' + new Date(t.createdAt).toLocaleString('ar') + '</td><td>' +
        (t.status === 'pending' ?
          '<button class="btn btn-sm btn-primary" onclick="approveTopup(\'' + t.id + '\')">قبول</button>' +
          '<button class="btn btn-sm btn-danger" onclick="rejectTopup(\'' + t.id + '\')">رفض</button>' :
          '—') +
        '</td></tr>';
    }).join('') || '<tr><td colspan="8">لا توجد طلبات</td></tr>';
  }

  function statusBadge(s) {
    if (s === 'pending') return '⏳ قيد المراجعة';
    if (s === 'approved') return '✅ مقبول';
    if (s === 'rejected') return '❌ مرفوض';
    return s;
  }

  window.approveTopup = function(id) {
    var topups = load(STORAGE.topups, []);
    var t = topups.find(function(x) { return x.id === id; });
    if (!t || t.status !== 'pending') return;

    t.status = 'approved';
    var users = load(STORAGE.users, []);
    var u = users.find(function(x) { return x.username === t.username; });
    if (u) {
      var add = Number(t.amount);
      if (t.currency === 'SYP') add = Math.round(add / 10000);
      u.balance = (u.balance || 0) + add;
      save(STORAGE.users, users);
      if (currentUser && currentUser.username === t.username) {
        currentUser.balance = u.balance;
    
