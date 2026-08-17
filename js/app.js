/* ===== IDLEB STORE - Frontend App ===== */
(function () {
  'use strict';

  // ========== Constants & Storage Keys ==========
  const STORAGE = {
    categories: 'idleb_categories',
    products: 'idleb_products',
    users: 'idleb_users',
    currentUser: 'idleb_current_user',
    cart: 'idleb_cart',
    topups: 'idleb_topups',
    orders: 'idleb_orders',
    adminSession: 'idleb_admin_session',
    settings: 'idleb_site_settings'
  };

  // Simple hash for admin password (not real security, just obfuscation)
  const ADMIN_USER = 'admin';
  const ADMIN_HASH = btoa('Idleb@2025');
  const ADMIN_DISPLAY_NAME = 'MOOHAMED || IDLEB X'; // base64

  // ========== Default Data ==========
  const DEFAULT_CATEGORIES = [
    { id: 'cat1', name: 'تبنيد حسابات', image: '', order: 1 },
    { id: 'cat2', name: 'فك باند', image: '', order: 2 },
    { id: 'cat3', name: 'خدمات الرشق', image: '', order: 3 },
    { id: 'cat4', name: 'شحن ألعاب', image: '', order: 4 }
  ];

  const DEFAULT_PRODUCTS = [
    // تبنيد
    { id: 'p1', name: 'تبنيد انستغرام', desc: 'حسابات انستغرام جاهزة ومضمونة', price: 15, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 42 },
    { id: 'p2', name: 'تبنيد فيسبوك', desc: 'حسابات فيسبوك قديمة وموثقة', price: 12, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 35 },
    { id: 'p3', name: 'تبنيد تليجرام', desc: 'أرقام تليجرام جاهزة', price: 10, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 28 },
    { id: 'p4', name: 'تبنيد واتساب', desc: 'أرقام واتساب مع تحقق', price: 18, image: '', categoryId: 'cat1', type: 'accounts', active: true, sales: 50 },
    // فك باند
    { id: 'p5', name: 'فك باند انستغرام', desc: 'فك حظر انستغرام بشكل دائم', price: 25, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 60 },
    { id: 'p6', name: 'فك باند واتساب', desc: 'استعادة رقم واتساب محظور', price: 30, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 45 },
    { id: 'p7', name: 'فك باند فيسبوك', desc: 'فك حظر حسابات فيسبوك', price: 22, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 33 },
    { id: 'p8', name: 'فك باند تليجرام', desc: 'فك حظر قنوات وحسابات تليجرام', price: 20, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 20 },
    { id: 'p9', name: 'فك باند تيك توك', desc: 'استعادة حسابات تيك توك', price: 28, image: '', categoryId: 'cat2', type: 'unban', active: true, sales: 38 },
    // الرشق — كل خدمة مستقلة وتسعيرها حسب الكمية
    { id: 'p10', name: 'رشق متابعين انستغرام', desc: 'متابعين حقيقيين — كل 1000 متابع بسعر مستقل', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 90, pricingNote: 'كل 1000 متابع = 2$' },
    { id: 'p11', name: 'رشق تفاعل انستغرام', desc: 'تفاعل مستقل (إعجابات/تفاعل) حسب الكمية', price: 1.5, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_engagement', active: true, sales: 55, pricingNote: 'كل 1000 تفاعل = 1.5$' },
    { id: 'p12', name: 'رشق مشاهدات', desc: 'مشاهدات مستقلة حسب الكمية', price: 1, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_views', active: true, sales: 40, pricingNote: 'كل 1000 مشاهدة = 1$' },
    { id: 'p13', name: 'رشق متابعين تيك توك', desc: 'متابعين مستقلين حسب الكمية', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 75, pricingNote: 'كل 1000 متابع = 2$' },
    { id: 'p14', name: 'رشق أعضاء تليجرام', desc: 'أعضاء مستقلون حسب الكمية', price: 2, unitSize: 1000, image: '', categoryId: 'cat3', type: 'boost_followers', active: true, sales: 30, pricingNote: 'كل 1000 عضو = 2$' },
    // ألعاب
    { id: 'p15', name: 'شحن ببجي', desc: 'شحن UC ببجي موبايل', price: 10, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 120 },
    { id: 'p16', name: 'شحن لودو', desc: 'شحن عملات لودو ستار', price: 8, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 65 },
    { id: 'p17', name: 'شحن جواكر', desc: 'شحن عملات جواكر', price: 7, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 48 },
    { id: 'p18', name: 'شحن فري فاير', desc: 'شحن جواهر فري فاير', price: 9, image: '', categoryId: 'cat4', type: 'games', active: true, sales: 95 }
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
    loaderSeconds: 2.5
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
    el.textContent = msg;
    el.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => el.classList.remove('show'), 3200);
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
    const colors = ['8b5cf6', '9f1239', 'a78bfa', 'be123c', '7c3aed'];
    const c = colors[Math.abs(hashCode(text)) % colors.length];
    return `https://placehold.co/400x250/${c}/0a0a0f?text=${encodeURIComponent(text)}&font=cairo`;
  }

  function hashCode(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return h;
  }

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
    if (!localStorage.getItem(STORAGE.topups)) {
      save(STORAGE.topups, []);
    }
    if (!localStorage.getItem(STORAGE.orders)) {
      save(STORAGE.orders, []);
    }
    if (!localStorage.getItem(STORAGE.cart)) {
      save(STORAGE.cart, []);
    }
    if (!localStorage.getItem(STORAGE.settings)) {
      save(STORAGE.settings, DEFAULT_SETTINGS);
    }
  }

  // ========== State ==========
  let currentUser = null;
  let cart = [];
  let adminLoggedIn = false;

  function loadState() {
    currentUser = load(STORAGE.currentUser, null);
    cart = load(STORAGE.cart, []);
    adminLoggedIn = !!sessionStorage.getItem(STORAGE.adminSession);
    updateUI();
  }

  function updateUI() {
    const loginBtn = document.getElementById('loginNavBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const balanceEl = document.getElementById('userBalance');
    const balAmount = document.getElementById('balanceAmount');
    const walletBal = document.getElementById('walletBalance');

    const settings = load(STORAGE.settings, DEFAULT_SETTINGS);
    const walletImg = document.getElementById('walletPaymentImage');
    if (walletImg) {
      walletImg.src = settings.walletImage || placeholderImg('IDLEB PAYMENT');
      walletImg.alt = 'صورة الدفع';
    }
    if (currentUser) {
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
      balanceEl.classList.remove('hidden');
      balAmount.textContent = formatPrice(currentUser.balance || 0);
      if (walletBal) walletBal.textContent = formatPrice(currentUser.balance || 0);
    } else {
      loginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
      balanceEl.classList.add('hidden');
      if (walletBal) walletBal.textContent = '0 $';
    }

    const badge = document.getElementById('cartBadge');
    const count = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = count;
  }

  // ========== Navigation ==========
  window.showPage = function (pageId, param) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');

    // close mobile menu
    document.getElementById('navLinks').classList.remove('open');

    // special handlers
    if (pageId === 'home') renderHome();
    if (pageId === 'categories') renderCategories();
    if (pageId === 'category' && param) renderCategoryProducts(param);
    if (pageId === 'cart') renderCart();
    if (pageId === 'about') renderAbout();
    if (pageId === 'wallet') {
      updateUI();
      document.getElementById('topUpSection').classList.add('hidden');
    }
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

    // update hash without reload
    if (pageId === 'category' && param) {
      history.replaceState(null, '', '#category/' + param);
    } else if (pageId !== 'home') {
      history.replaceState(null, '', '#' + pageId);
    } else {
      history.replaceState(null, '', '#home');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ========== Render Home ==========
  function renderHome() {
    const cats = load(STORAGE.categories, []).sort((a, b) => a.order - b.order);
    const prods = load(STORAGE.products, []).filter(p => p.active).sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 6);

    const catGrid = document.getElementById('homeCategories');
    catGrid.innerHTML = cats.map(c => `
      <div class="category-card" onclick="showPage('category', '${c.id}')">
        <img src="${c.image || placeholderImg(c.name)}" alt="${c.name}" loading="lazy">
        <div class="card-body">
          <h3>${c.name}</h3>
        </div>
      </div>
    `).join('');

    const best = document.getElementById('bestSellers');
    best.innerHTML = prods.map(p => productCardHTML(p)).join('');
  }

  function productCardHTML(p) {
    const boost = ['boost_followers','boost_engagement','boost_views'].includes(p.type);
    const unit = Number(p.unitSize || 1000);
    const price = Number(p.price || 0);
    return `
      <div class="product-card">
        <img src="${p.image || placeholderImg(p.name)}" alt="${p.name}" loading="lazy">
        <div class="card-body">
          <span class="product-type">${typeLabel(p.type)}</span>
          <h3>${p.name}</h3>
          <p>${p.desc || ''}</p>
          ${p.pricingNote ? `<div class="pricing-note">${p.pricingNote}</div>` : ''}
          ${boost ? `
            <div class="quantity-box">
              <label>الكمية المطلوبة</label>
              <input type="number" min="${unit}" step="${unit}" value="${unit}" id="qty-${p.id}" oninput="updateBoostPrice('${p.id}', ${price}, ${unit})">
              <small id="price-${p.id}">السعر: ${formatPrice(price)}</small>
            </div>` : `
            <div class="product-price">${formatPrice(price)}</div>`}
          <button class="btn btn-primary btn-full" onclick="addToCart('${p.id}')">أضف إلى السلة</button>
        </div>
      </div>
    `;
  }

  window.updateBoostPrice = function(id, unitPrice, unitSize) {
    const input = document.getElementById('qty-' + id);
    const out = document.getElementById('price-' + id);
    if (!input || !out) return;
    let qty = Math.max(unitSize, Number(input.value) || unitSize);
    qty = Math.ceil(qty / unitSize) * unitSize;
    input.value = qty;
    out.textContent = 'السعر: ' + formatPrice((qty / unitSize) * unitPrice);
  };


  // ========== Categories ==========
  function renderCategories() {
    const cats = load(STORAGE.categories, []).sort((a, b) => a.order - b.order);
    document.getElementById('allCategories').innerHTML = cats.map(c => `
      <div class="category-card" onclick="showPage('category', '${c.id}')">
        <img src="${c.image || placeholderImg(c.name)}" alt="${c.name}" loading="lazy">
        <div class="card-body"><h3>${c.name}</h3></div>
      </div>
    `).join('');
  }

  function renderCategoryProducts(catId) {
    const cats = load(STORAGE.categories, []);
    const cat = cats.find(c => c.id === catId);
    document.getElementById('categoryTitle').textContent = cat ? cat.name : 'المنتجات';
    const prods = load(STORAGE.products, []).filter(p => p.categoryId === catId && p.active);
    document.getElementById('categoryProducts').innerHTML = prods.length
      ? prods.map(p => productCardHTML(p)).join('')
      : '<p class="empty-state">لا توجد منتجات في هذا القسم حالياً</p>';
  }

  // ========== Cart ==========
  window.addToCart = function (productId) {
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    const products = load(STORAGE.products, []);
    const p = products.find(x => x.id === productId);
    if (!p) return;

    const boost = ['boost_followers','boost_engagement','boost_views'].includes(p.type);
    let qty = 1;
    let unitSize = Number(p.unitSize || 1000);
    let linePrice = Number(p.price || 0);
    if (boost) {
      const input = document.getElementById('qty-' + p.id);
      qty = Math.max(unitSize, Number(input && input.value) || unitSize);
      qty = Math.ceil(qty / unitSize) * unitSize;
      linePrice = (qty / unitSize) * Number(p.price || 0);
    }
    const existing = cart.find(i => i.productId === productId);
    if (existing && !boost) {
      existing.qty += 1;
      existing.lineTotal = existing.qty * Number(p.price || 0);
    } else {
      cart.push({
        productId, qty, name: p.name, price: linePrice, image: p.image,
        serviceType: p.type, unitSize, unitPrice: Number(p.price || 0), quantity: qty, targetUrl: ''
      });
    }
    save(STORAGE.cart, cart);
    updateUI();
    toast('تمت الإضافة إلى السلة ✓');
  };


  function renderCart() {
    const empty = document.getElementById('cartEmpty');
    const content = document.getElementById('cartContent');
    if (!cart.length) {
      empty.classList.remove('hidden');
      content.classList.add('hidden');
      return;
    }
    empty.classList.add('hidden');
    content.classList.remove('hidden');

    let total = 0;
    document.getElementById('cartItems').innerHTML = cart.map((item, idx) => {
      total += Number(item.lineTotal != null ? item.lineTotal : item.price * item.qty);
      return `
        <div class="cart-item">
          <img src="${item.image || placeholderImg(item.name)}" alt="">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="product-price">${formatPrice(item.lineTotal != null ? item.lineTotal : item.price * item.qty)}</div>
            ${item.quantity ? `<small>الكمية: ${Number(item.quantity).toLocaleString('en-US')}</small>` : ''}
            ${['accounts','unban','boost_followers','boost_engagement','boost_views'].includes(item.serviceType) ? `<div class="form-group order-target-field"><label>رابط الحساب/المنشور <span class="required">*</span></label><input type="url" id="target-${idx}" value="${item.targetUrl || ''}" placeholder="https://..." required></div>` : ''}
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${idx})">حذف</button>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById('cartTotal').textContent = formatPrice(total);
  }

  window.changeQty = function (idx, delta) {
    if (['boost_followers','boost_engagement','boost_views'].includes(cart[idx].serviceType)) {
      const step = Number(cart[idx].unitSize || 1000);
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

  window.removeFromCart = function (idx) {
    cart.splice(idx, 1);
    save(STORAGE.cart, cart);
    updateUI();
    renderCart();
  };

  window.checkout = function () {
    if (!currentUser) {
      toast('يجب تسجيل الدخول', true);
      showPage('login');
      return;
    }
    if (!cart.length) return;

    // Every order requires WhatsApp + target URL for applicable services.
    const whatsappEl = document.getElementById('orderWhatsapp');
    const whatsapp = (whatsappEl && whatsappEl.value || '').trim();
    if (!whatsapp || whatsapp.length < 6) {
      toast('رقم واتساب إجباري لإتمام الطلب', true);
      whatsappEl && whatsappEl.focus();
      return;
    }

    let normalizedCart;
    try {
      normalizedCart = cart.map((item, index) => {
        const needsUrl = ['accounts','unban','boost_followers','boost_engagement','boost_views'].includes(item.serviceType);
        let targetUrl = item.targetUrl || '';
        if (needsUrl) {
          const field = document.getElementById('target-' + index);
          targetUrl = (field && field.value || '').trim();
          if (!targetUrl) throw new Error('missing-target');
        }
        return {...item, targetUrl};
      });
    } catch {
      toast('أدخل رابط الحساب/المنشور لكل خدمة مطلوبة', true);
      return;
    }

    let total = normalizedCart.reduce((s, i) => s + Number(i.lineTotal != null ? i.lineTotal : i.price * i.qty), 0);
    if ((currentUser.balance || 0) < total) {
      toast('رصيدك غير كافٍ. يرجى شحن المحفظة أولاً', true);
      showPage('wallet');
      return;
    }

    currentUser.balance -= total;
    currentUser.whatsapp = whatsapp.trim();
    saveUser(currentUser);

    const orders = load(STORAGE.orders, []);
    const order = {
      id: uid('ord'),
      username: currentUser.username,
      whatsapp: whatsapp.trim(),
      items: normalizedCart,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    save(STORAGE.orders, orders);

    const products = load(STORAGE.products, []);
    normalizedCart.forEach(item => {
      const p = products.find(x => x.id === item.productId);
      if (p) p.sales = (p.sales || 0) + 1;
    });
    save(STORAGE.products, products);

    cart = [];
    save(STORAGE.cart, cart);
    updateUI();

    document.getElementById('orderSuccessMsg').textContent =
      `رقم الطلب: ${order.id} — واتساب: ${order.whatsapp} — المجموع: ${formatPrice(total)} — سيتم التنفيذ قريباً`;
    showPage('order-success');
  };


  // ========== Auth ==========
  window.handleAuth = function (e) {
    e.preventDefault();
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value;

    // Admin can enter through the normal login screen — no URL change required.
    if (username === ADMIN_USER && btoa(password) === ADMIN_HASH) {
      adminLoggedIn = true;
      sessionStorage.setItem(STORAGE.adminSession, '1');
      toast('مرحباً ' + ADMIN_DISPLAY_NAME);
      showPage('admin');
      document.getElementById('adminLogin').classList.add('hidden');
      document.getElementById('adminPanel').classList.remove('hidden');
      switchAdminTab('stats');
      return;
    }

    let users = load(STORAGE.users, []);
    let user = users.find(u => u.username === username);

    if (user) {
      if (user.password !== btoa(password)) {
        toast('كلمة المرور غير صحيحة', true);
        return;
      }
    } else {
      user = {
        username,
        password: btoa(password),
        balance: 0,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      save(STORAGE.users, users);
      toast('تم إنشاء الحساب بنجاح');
    }

    currentUser = { username: user.username, balance: user.balance };
    save(STORAGE.currentUser, currentUser);
    updateUI();
    toast('مرحباً ' + username);
    showPage('home');
  };

  window.logout = function () {
    currentUser = null;
    localStorage.removeItem(STORAGE.currentUser);
    updateUI();
    toast('تم تسجيل الخروج');
    showPage('home');
  };

  function saveUser(user) {
    const users = load(STORAGE.users, []);
    const idx = users.findIndex(u => u.username === user.username);
    if (idx >= 0) {
      users[idx].balance = user.balance;
      save(STORAGE.users, users);
    }
    currentUser = user;
    save(STORAGE.currentUser, currentUser);
  }

  // ========== Wallet / TopUp ==========
  window.showTopUpModal = function () {
    if (!currentUser) {
      toast('يجب تسجيل الدخول أولاً', true);
      showPage('login');
      return;
    }
    document.getElementById('topUpSection').classList.remove('hidden');
  };

  window.copyShamCode = function () {
    const code = document.getElementById('shamCode').textContent;
    navigator.clipboard.writeText(code).then(() => toast('تم نسخ رقم المحفظة'));
  };

  window.submitTopUp = function (e) {
    e.preventDefault();
    if (!currentUser) return;

    const txNumber = document.getElementById('txNumber').value.trim();
    const amount = Number(document.getElementById('txAmount').value);
    const currency = document.getElementById('txCurrency').value;

    if (!txNumber || amount < 1) {
      toast('يرجى إدخال بيانات صحيحة', true);
      return;
    }

    const topups = load(STORAGE.topups, []);
    topups.push({
      id: uid('top'),
      username: currentUser.username,
      txNumber,
      amount,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    save(STORAGE.topups, topups);

    document.getElementById('topUpForm').reset();
    document.getElementById('topUpSection').classList.add('hidden');
    toast('تم استلام طلبك، سيتم مراجعته قريباً ✓');
  };

  // ========== Admin ==========
  window.adminLogin = function (e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value;

    if (user === ADMIN_USER && btoa(pass) === ADMIN_HASH) {
      adminLoggedIn = true;
      sessionStorage.setItem(STORAGE.adminSession, '1');
      document.getElementById('adminLogin').classList.add('hidden');
      document.getElementById('adminPanel').classList.remove('hidden');
      switchAdminTab('stats');
      toast('مرحباً أدمن');
    } else {
      toast('بيانات الدخول غير صحيحة', true);
    }
  };

  window.adminLogout = function () {
    adminLoggedIn = false;
    sessionStorage.removeItem(STORAGE.adminSession);
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    showPage('home');
  };

  window.switchAdminTab = function (tab) {
    document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('admin-' + tab).classList.add('active');
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'stats') renderStats();
    if (tab === 'categories') renderAdminCategories();
    if (tab === 'products') renderAdminProducts();
    if (tab === 'topups') renderAdminTopups();
    if (tab === 'orders') renderAdminOrders();
    if (tab === 'users') renderAdminUsers();
    if (tab === 'settings') renderSiteSettings();
  };

  function renderStats() {
    const products = load(STORAGE.products, []);
    const orders = load(STORAGE.orders, []);
    const topups = load(STORAGE.topups, []);
    const users = load(STORAGE.users, []);
    const totalTopup = topups.filter(t => t.status === 'approved').reduce((s, t) => s + Number(t.amount), 0);
    const totalSales = orders.reduce((s, o) => s + o.total, 0);

    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card"><h4>عدد المنتجات</h4><p>${products.length}</p></div>
      <div class="stat-card"><h4>عدد الطلبات</h4><p>${orders.length}</p></div>
      <div class="stat-card"><h4>طلبات الشحن</h4><p>${topups.length}</p></div>
      <div class="stat-card"><h4>المستخدمين</h4><p>${users.length}</p></div>
      <div class="stat-card"><h4>إجمالي المبيعات</h4><p>${formatPrice(totalSales)}</p></div>
      <div class="stat-card"><h4>الرصيد المشحون</h4><p>${totalTopup}</p></div>
    `;
  }

  // Categories admin
  window.showAddCategoryForm = function () {
    document.getElementById('addCategoryForm').classList.remove('hidden');
  };
  window.hideAddCategoryForm = function () {
    document.getElementById('addCategoryForm').classList.add('hidden');
  };

  window.addCategory = function () {
    const name = document.getElementById('catName').value.trim();
    const image = document.getElementById('catImage').value.trim();
    if (!name) return toast('أدخل اسم القسم', true);

    const cats = load(STORAGE.categories, []);
    cats.push({
      id: uid('cat'),
      name,
      image,
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
    const cats = load(STORAGE.categories, []).sort((a, b) => a.order - b.order);
    const tbody = document.querySelector('#catsTable tbody');
    tbody.innerHTML = cats.map(c => `
      <tr>
        <td>${c.name}</td>
        <td>${c.image ? '✓' : '—'}</td>
        <td>${c.order}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="editCategory('${c.id}')">تعديل</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${c.id}')">حذف</button>
        </td>
      </tr>
    `).join('');
  }

  window.editCategory = function (id) {
    const cats = load(STORAGE.categories, []);
    const c = cats.find(x => x.id === id);
    if (!c) return;
    const newName = prompt('اسم القسم الجديد:', c.name);
    if (newName === null) return;
    c.name = newName.trim() || c.name;
    const newImg = prompt('رابط الصورة (اتركه كما هو):', c.image || '');
    if (newImg !== null) c.image = newImg.trim();
    save(STORAGE.categories, cats);
    renderAdminCategories();
    toast('تم التعديل');
  };

  window.deleteCategory = function (id) {
    if (!confirm('هل تريد حذف هذا القسم؟')) return;
    let cats = load(STORAGE.categories, []);
    cats = cats.filter(c => c.id !== id);
    save(STORAGE.categories, cats);
    renderAdminCategories();
    toast('تم الحذف');
  };

  // Products admin
  window.showAddProductForm = function () {
    const cats = load(STORAGE.categories, []);
    const sel = document.getElementById('prodCategory');
    sel.innerHTML = cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    document.getElementById('addProductForm').classList.remove('hidden');
  };
  window.hideAddProductForm = function () {
    document.getElementById('addProductForm').classList.add('hidden');
  };

  window.addProduct = function () {
    const name = document.getElementById('prodName').value.trim();
    const desc = document.getElementById('prodDesc').value.trim();
    const price = Number(document.getElementById('prodPrice').value);
    const unitSize = Number(document.getElementById('prodUnitSize').value) || 1000;
    const pricingNote = document.getElementById('prodPricingNote').value.trim();
    const image = document.getElementById('prodImage').value.trim();
    const categoryId = document.getElementById('prodCategory').value;
    const type = document.getElementById('prodType').value;
    const active = document.getElementById('prodActive').checked;

    if (!name || price < 0) return toast('بيانات غير مكتملة', true);

    const products = load(STORAGE.products, []);
    products.push({
      id: uid('p'),
      name, desc, price, unitSize, pricingNote, image, categoryId, type, active, sales: 0
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
    const products = load(STORAGE.products, []);
    const cats = load(STORAGE.categories, []);
    const tbody = document.querySelector('#prodsTable tbody');
    tbody.innerHTML = products.map(p => {
      const cat = cats.find(c => c.id === p.categoryId);
      return `
        <tr>
          <td>${p.name}</td>
          <td>${cat ? cat.name : '—'}</td>
          <td>${formatPrice(p.price)}${['boost_followers','boost_engagement','boost_views'].includes(p.type) ? `<br><small>لكل ${Number(p.unitSize||1000).toLocaleString('en-US')}</small>` : ''}</td>
          <td>${typeLabel(p.type)}</td>
          <td>${p.active ? '🟢 نشط' : '🔴 متوقف'}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="toggleProduct('${p.id}')">${p.active ? 'إيقاف' : 'تفعيل'}</button>
            <button class="btn btn-sm btn-secondary" onclick="editProduct('${p.id}')">تعديل</button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p.id}')">حذف</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.toggleProduct = function (id) {
    const products = load(STORAGE.products, []);
    const p = products.find(x => x.id === id);
    if (p) {
      p.active = !p.active;
      save(STORAGE.products, products);
      renderAdminProducts();
    }
  };

  window.editProduct = function (id) {
    const products = load(STORAGE.products, []);
    const p = products.find(x => x.id === id);
    if (!p) return;
    const name = prompt('الاسم:', p.name);
    if (name === null) return;
    p.name = name.trim() || p.name;
    const price = prompt('السعر:', p.price);
    if (price !== null) p.price = Number(price) || p.price;
    const desc = prompt('الوصف:', p.desc || '');
    if (desc !== null) p.desc = desc;
    save(STORAGE.products, products);
    renderAdminProducts();
    toast('تم التعديل');
  };

  window.deleteProduct = function (id) {
    if (!confirm('حذف المنتج؟')) return;
    let products = load(STORAGE.products, []);
    products = products.filter(p => p.id !== id);
    save(STORAGE.products, products);
    renderAdminProducts();
    toast('تم الحذف');
  };

  // Topups
  function renderAdminTopups() {
    const topups = load(STORAGE.topups, []).reverse();
    const tbody = document.querySelector('#topupsTable tbody');
    tbody.innerHTML = topups.map(t => `
      <tr>
        <td>${t.username}</td>
        <td>${t.txNumber}</td>
        <td>${t.amount}</td>
        <td>${t.currency}</td>
        <td>${statusBadge(t.status)}</td>
        <td>${new Date(t.createdAt).toLocaleString('ar')}</td>
        <td>
          ${t.status === 'pending' ? `
            <button class="btn btn-sm btn-primary" onclick="approveTopup('${t.id}')">قبول</button>
            <button class="btn btn-sm btn-danger" onclick="rejectTopup('${t.id}')">رفض</button>
          ` : '—'}
        </td>
      </tr>
    `).join('') || '<tr><td colspan="8">لا توجد طلبات</td></tr>';
  }

  function statusBadge(s) {
    if (s === 'pending') return '⏳ قيد المراجعة';
    if (s === 'approved') return '✅ مقبول';
    if (s === 'rejected') return '❌ مرفوض';
    return s;
  }

  window.approveTopup = function (id) {
    const topups = load(STORAGE.topups, []);
    const t = topups.find(x => x.id === id);
    if (!t || t.status !== 'pending') return;

    t.status = 'approved';
    // add balance
    const users = load(STORAGE.users, []);
    const u = users.find(x => x.username === t.username);
    if (u) {
      // simple conversion: if SYP treat as is for demo, or convert roughly
      let add = Number(t.amount);
      if (t.currency === 'SYP') add = Math.round(add / 10000); // demo rate ~10k SYP = 1$
      u.balance = (u.balance || 0) + add;
      save(STORAGE.users, users);
      // update current if same
      if (currentUser && currentUser.username === t.username) {
        currentUser.balance = u.balance;
        save(STORAGE.currentUser, currentUser);
        updateUI();
      }
    }
    save(STORAGE.topups, topups);
    renderAdminTopups();
    toast('تم قبول الطلب وإضافة الرصيد');
  };

  window.rejectTopup = function (id) {
    const topups = load(STORAGE.topups, []);
    const t = topups.find(x => x.id === id);
    if (t) {
      t.status = 'rejected';
      save(STORAGE.topups, topups);
      renderAdminTopups();
      toast('تم رفض الطلب');
    }
  };

  // Orders
  function renderAdminOrders() {
    const orders = load(STORAGE.orders, []).reverse();
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${o.username}</td>
        <td>${o.whatsapp || '—'}</td>
        <td>${o.items.map(i => i.name + ' ×' + i.qty).join('<br>')}</td>
        <td>${formatPrice(o.total)}</td>
        <td>${statusBadge(o.status)}</td>
        <td>${new Date(o.createdAt).toLocaleString('ar')}</td>
        <td>
          ${o.status === 'pending' ? `
            <button class="btn btn-sm btn-primary" onclick="completeOrder('${o.id}')">تم التنفيذ</button>
          ` : '—'}
        </td>
      </tr>
    `).join('') || '<tr><td colspan="8">لا توجد طلبات</td></tr>';
  }

  window.completeOrder = function (id) {
    const orders = load(STORAGE.orders, []);
    const o = orders.find(x => x.id === id);
    if (o) {
      o.status = 'approved';
      save(STORAGE.orders, orders);
      renderAdminOrders();
      toast('تم تحديث حالة الطلب');
    }
  };

  // Users
  function renderAdminUsers() {
    const users = load(STORAGE.users, []);
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.username}</td>
        <td>${formatPrice(u.balance || 0)}</td>
        <td>${new Date(u.createdAt).toLocaleDateString('ar')}</td>
      </tr>
    `).join('') || '<tr><td colspan="3">لا يوجد مستخدمون</td></tr>';
  }

  window.addManualBalance = function () {
    const username = document.getElementById('manualUser').value.trim();
    const amount = Number(document.getElementById('manualAmount').value);
    if (!username || amount < 1) return toast('بيانات غير صحيحة', true);

    const users = load(STORAGE.users, []);
    const u = users.find(x => x.username === username);
    if (!u) return toast('المستخدم غير موجود', true);

    u.balance = (u.balance || 0) + amount;
    save(STORAGE.users, users);
    if (currentUser && currentUser.username === username) {
      currentUser.balance = u.balance;
      save(STORAGE.currentUser, currentUser);
      updateUI();
    }
    document.getElementById('manualUser').value = '';
    document.getElementById('manualAmount').value = '';
    renderAdminUsers();
    toast('تم إضافة الرصيد');
  };

  // ========== Site Settings / Owner ==========
  function renderAbout() {
    const s = load(STORAGE.settings, DEFAULT_SETTINGS);
    const photo = document.getElementById('ownerPhoto');
    if (photo) photo.src = s.ownerPhoto || placeholderImg('MOOHAMED');
    const name = document.getElementById('ownerName');
    const bio = document.getElementById('ownerBio');
    if (name) name.textContent = s.ownerName || ADMIN_DISPLAY_NAME;
    if (bio) bio.textContent = s.ownerBio || DEFAULT_SETTINGS.ownerBio;
    const links = [
      ['ownerPhone', s.adminPhone, s.adminPhone ? 'tel:' + s.adminPhone : '#'],
      ['ownerTelegram', s.telegram, s.telegram || '#'],
      ['ownerChannel', s.channel, s.channel || '#']
    ];
    links.forEach(([id,label,href]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.href = href;
      const strong = el.querySelector('strong');
      if (strong) strong.textContent = label || 'غير محدد';
    });
  }

  function renderSiteSettings() {
    const s = load(STORAGE.settings, DEFAULT_SETTINGS);
    const vals = {
      settingWalletImage:s.walletImage, settingAdminPhone:s.adminPhone, settingTelegram:s.telegram,
      settingChannel:s.channel, settingOwnerPhoto:s.ownerPhoto, settingOwnerName:s.ownerName,
      settingOwnerBio:s.ownerBio, settingLoaderLogo:s.loaderLogo, settingLoaderSeconds:s.loaderSeconds
    };
    Object.entries(vals).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.value=val ?? ''; });
  }

  window.saveSiteSettings = function() {
    const s = {
      walletImage: document.getElementById('settingWalletImage').value.trim(),
      adminPhone: document.getElementById('settingAdminPhone').value.trim(),
      telegram: document.getElementById('settingTelegram').value.trim(),
      channel: document.getElementById('settingChannel').value.trim(),
      ownerPhoto: document.getElementById('settingOwnerPhoto').value.trim(),
      ownerName: document.getElementById('settingOwnerName').value.trim() || ADMIN_DISPLAY_NAME,
      ownerBio: document.getElementById('settingOwnerBio').value.trim() || DEFAULT_SETTINGS.ownerBio,
      loaderLogo: document.getElementById('settingLoaderLogo').value.trim(),
      loaderSeconds: Math.min(10, Math.max(1, Number(document.getElementById('settingLoaderSeconds').value) || 2.5))
    };
    save(STORAGE.settings, s);
    updateUI();
    renderAbout();
    applyLoaderBranding();
    toast('تم حفظ إعدادات الموقع ✓');
  };

  function applyLoaderBranding() {
    const s = load(STORAGE.settings, DEFAULT_SETTINGS);
    const img = document.getElementById('loaderLogo');
    if (img) img.src = s.loaderLogo || placeholderImg('IDLEB STORE');
  }

  function startLoader() {
    applyLoaderBranding();
    const s = load(STORAGE.settings, DEFAULT_SETTINGS);
    const loader = document.getElementById('siteLoader');
    if (!loader) return;
    const duration = Math.min(10, Math.max(1, Number(s.loaderSeconds) || 2.5)) * 1000;
    setTimeout(() => loader.classList.add('hidden'), duration);
  }

  // ========== Visual background intentionally static (3D removed) ==========
  // ========== Mobile Menu ==========
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // ========== Hash Routing ==========
  function handleHash() {
    const hash = location.hash.slice(1) || 'home';
    if (hash.startsWith('category/')) {
      const id = hash.split('/')[1];
      showPage('category', id);
    } else if (hash === 'admin') {
      showPage('admin');
    } else {
      showPage(hash);
    }
  }

  // ========== Boot ==========
  initData();
  loadState();
  handleHash();
  window.addEventListener('hashchange', handleHash);

  renderAbout();
  startLoader();

  // expose for debugging if needed
  window.IDLEB = { load, save, STORAGE };
})();
