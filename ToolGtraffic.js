// ==UserScript==
// @name         THANH TUAN AUTO v50.3.4 - FINAL
// @namespace    thanhtuan.autotool
// @version      50.3.4
// @description  Auto gtraffic + TaskTrafficNgon + Trial Key + Welcome
// @author       THANH TUẤN
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  var HOST = location.hostname,
    IS_TOP = (window === window.top),
    isGtraffic = /(^|\.)gtraffic\.io$/i.test(HOST),
    isGoogle = /(^|\.)google\./i.test(HOST),
    isDichvuTask = /(^|\.)dichvutask\.xyz$/i.test(HOST),
    isRobuxReward = /(^|\.)robuxreward\.top$/i.test(HOST);

  var isTaskTrafficNgon = (function() {
    if (isGtraffic) return false;
    if (isGoogle) return false;
    if (isDichvuTask) return false;
    if (isRobuxReward) return false;
    if (/(^|\.)tasktrafficngon\./i.test(HOST)) return true;
    if (/\/(dashboard|client|task|nhiem-vu)/i.test(location.pathname)) return true;
    return false;
  })();

  var KEY_SYSTEM = {
    validKeys: ['TRIAL1DAY'],
    lockedKeys: ['LOCKED001', 'BANNED2026', 'SPAM001'],
    startDate: new Date('2026-10-10T00:00:00+07:00').getTime(),
    endDate: new Date('2026-10-11T23:59:59+07:00').getTime(),
    telegram: 'https://t.me/hafvanthinhmod',
    adminTelegram: '@userThanhTuan',
    adminUrl: 'https://t.me/userThanhTuan'
  };

  var CFG = {
    poll: 8, googlePoll: 0, targetPoll: 6, gk: 'tt_',
    watchdogMs: 3000, defaultCountdown: 60, codeTimeoutMs: 45000,
    navCooldownMs: 800, fillRetryMax: 999, fillRetryDelay: 300,
    backDelay: 200, leaveCheckMs: 200,
    postSubmitCheckMs: 320, postSubmitCheckMax: 12,
    getLinkPollMs: 0, getLinkTimeoutMs: 15000,
    autoFillDelayMs: 800, ocrTimeoutMs: 25000,
    gBtnDelayMs: 2000,
    goBackDelayMs: 200,
    dichvuTaskPoll: 1000, dichvuClickCooldownMs: 7000,
    dichvuOutsideCooldownMs: 4000, dichvuTaskPath: '/client/vuot-link',
    dichvuCreatedUrlsTTL: 86400000,
    robuxPollMs: 1500, robuxCooldownMs: 15000,
    ttPollMs: 1500, ttClickDelay: 2000,
    ttLinkWaitMs: 20000, ttCooldownMs: 30000,
    ttAutoNavDelayMs: 1500,
    ttStateTTLMs: 30 * 60 * 1000,
    ttOpenClickCooldownMs: 2000,
    welcomeHideMs: 2 * 60 * 60 * 1000
  };

  var STATE = {
    IDLE: 'idle', GOOGLE_SEARCH: 'google-search', GOOGLE_CLICK: 'google-click',
    SCAN_BTN: 'scan-btn', WAIT_COUNTDOWN: 'wait-countdown', GET_CODE: 'get-code',
    BACK_GTRAFFIC: 'back-gtraffic', FILL_CODE: 'fill-code', DONE: 'done',
    DICHVU_TASK: 'dichvu-task', ROBUX_TASK: 'robux-task', ROBUX_CLAIM: 'robux-claim',
    TT_TASK: 'tt-task', TT_WAIT_LINK: 'tt-wait-link'
  };

  var GIF_KITTY_DANCE = 'https://media.giphy.com/media/11c7UUfN4eoHF6/giphy.gif';
  var GIF_KITTY_HEART = 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif';
  var GIF_CLOSE = 'https://media.giphy.com/media/3o6ZsYm5wE7O4vXw36/giphy.gif';
  var GIF_HELLO_KITTY = 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif';
  var GIF_LOGO_HK = 'https://media.giphy.com/media/jUwpNzg9IcyrK/giphy.gif';

  var BLACKLIST = {
    ui: ['login','logout','signup','signin','register','account','password','email','verify','submit','confirm','accept','cancel','button','click','here','welcome','hello','world','news','blog','shop','store','cart','order','payment','banking','wallet','deposit','withdraw','bonus','promotion','voucher','coupon','gift','reward','prize','winner','game','casino','sports','betting','jackpot','lottery','online','offline','mobile','desktop','tablet','laptop','computer','android','windows','linux','chrome','firefox','safari','messenger','telegram','whatsapp','zalo','viber','skype','buoc','step','next','prev','back','forward','home','search','find','filter','sort','view','show','hide','open','close','start','stop','pause','resume','play','replay','load','reload','refresh','true','false','null','undefined','none','empty','full','free','paid','public','private','secure','locked','unlocked','hidden','visible','code','ma','mã','nhap','nhập','lay','lấy','xacnhan','nhan','nhận','error','success','loading','pleasewait','comingsoon','notfound','page404','trang404','error404','livestream','youtube','facebook','google','website','hotline','support','contact','about','policy','privacy','terms','service','download','upload','install','update','faq'],
    brands: ['fun88','sunwin','hitclub','go88','b52club','rikvip','789club','w88','w88diler','xoso66','xoso','xs66','m88','mu88','mu99','fb88','bk8','jun88','188bet','tf88','ok9','kubet','s666','fabet','f8bet','hi88','new88','789bet','789win','88vin','vin88','vip88','v9bet','vn88','vn138','sin88','shbet','five88','jbo','dafabet','cmd368','12bet','1xbet','bet365','ae888','bong88','cado68','cf68','dabet','daga88','dk8','ga888','hb88','hl8','k8','letou','lixi88','loto188','mig8','mksports','nha88','one88','sodo66','sodo68','sodo88','tk88','win2888','win88','xo88','xoso88','xsmb','xsmn','xsmt','tylekeo','123b','ceobet88'],
    patterns: [/^trang\s*\d+$/i, /^page\s*\d+$/i, /^error\s*\d+$/i, /^step\s*\d+$/i, /^buoc\s*\d+$/i, /^test\s*\d*$/i, /^demo\s*\d*$/i, /^xxx+$/i, /^0{3,}$/, /^1{3,}$/, /^9{3,}$/, /^(.)\1{3,}$/, /^01234567$/, /^12345678$/, /^abcdefgh$/i, /^ABCDEFGH$/, /^87654321$/],
    check: function(s) {
      if (!s || typeof s !== 'string') return true;
      var t = s.trim(); if (!t) return true;
      var lc = t.toLowerCase();
      for (var i = 0; i < BLACKLIST.ui.length; i++) if (lc === BLACKLIST.ui[i]) return true;
      for (var j = 0; j < BLACKLIST.brands.length; j++) if (lc.indexOf(BLACKLIST.brands[j]) !== -1) return true;
      for (var k = 0; k < BLACKLIST.patterns.length; k++) if (BLACKLIST.patterns[k].test(t)) return true;
      if (/^[a-z]{8}$/i.test(t)) return true;
      return false;
    },
    addCustom: function(word) {
      if (!word || typeof word !== 'string') return false;
      var w = word.trim().toLowerCase(); if (!w) return false;
      if (BLACKLIST.brands.indexOf(w) !== -1) return false;
      BLACKLIST.brands.push(w);
      try {
        var custom = S.get('customBlacklist', '[]');
        var arr = (typeof custom === 'string') ? JSON.parse(custom) : (custom || []);
        if (arr.indexOf(w) === -1) arr.push(w);
        S.set('customBlacklist', JSON.stringify(arr));
      } catch (e) {}
      return true;
    },
    loadCustom: function() {
      try {
        var raw = S.get('customBlacklist', '[]');
        var arr = (typeof raw === 'string') ? JSON.parse(raw) : (raw || []);
        for (var i = 0; i < arr.length; i++) if (BLACKLIST.brands.indexOf(arr[i]) === -1) BLACKLIST.brands.push(arr[i]);
      } catch (e) {}
    }
  };
  function isBlacklistedCode(s) { return BLACKLIST.check(s); }

  var __origWindowOpen = window.open;
  var __openBlockKey = '__tt_open_blocked_' + location.href.split('?')[0].split('#')[0];
  var __openCount = 0;
  try { if (sessionStorage.getItem(__openBlockKey) === '1') __openCount = 999; } catch (e) {}
  window.open = function(url, name, features) {
    try {
      if (sessionStorage.getItem(__openBlockKey) === '1') { console.log('[TT] OPEN BLOCKED'); return null; }
      __openCount++;
      if (__openCount > 1) { console.log('[TT] OPEN BLOCKED count=' + __openCount); return null; }
      sessionStorage.setItem(__openBlockKey, '1');
      console.log('[TT] OPEN ALLOWED: ' + url);
      return __origWindowOpen.apply(window, arguments);
    } catch (e) { return __origWindowOpen.apply(window, arguments); }
  };

  var S = {
    get: function(k, d) { try { var v = GM_getValue(CFG.gk + k, d); return v === undefined ? d : v; } catch (e) { return d; } },
    set: function(k, v) { try { GM_setValue(CFG.gk + k, v); } catch (e) {} },
    del: function(k) { try { GM_deleteValue(CFG.gk + k); } catch (e) {} },
    reset: function() {
      var keys = ['state','stateSetAt','targetUrl','lastServerSec','lastClickTime','serverTotalSec','filled','confirmed','googleClickTries','navigatingBack','cdStartSec','cdStartAt','btnClickAt','gotCodeAt','codeAttempts','lastNavUrl','lastNavAt','backDone','leavingAt','lastCopyOk','lastCopyText','hardStop','countdownRealZero','getLinkClicked','waitingGetLink','getLinkDeadline','getLinkStartAt','childTabOpen','codeReadySignal','dichvuStage','dichvuClickAt','dichvuDoneAt','goBackFired','ttLink','ttPendingLink'];
      for (var i = 0; i < keys.length; i++) S.del(keys[i]);
    },
    resetFull: function() {
      S.reset();
      try { S.del('code'); } catch (e) {}
      try { S.del('codeBackup'); } catch (e) {}
      try { S.del('codeHardLock'); } catch (e) {}
      try { S.del('codeFoundAt'); } catch (e) {}
      try { S.del('inFlow'); } catch (e) {}
      try { S.del('domain'); } catch (e) {}
      try { S.del('keyword'); } catch (e) {}
      try { S.del('gtrafficUrl'); } catch (e) {}
      try { S.del('pendingAutoReset'); } catch (e) {}
    }
  };

  BLACKLIST.loadCustom();

  function normalizeKey(k) {
    if (!k) return '';
    return (k + '').trim().toUpperCase().replace(/\s+/g, '').replace(/-/g, '');
  }
  function isKeyValid(k) {
    if (!k) return false;
    var nk = normalizeKey(k);
    for (var i = 0; i < KEY_SYSTEM.validKeys.length; i++) {
      if (normalizeKey(KEY_SYSTEM.validKeys[i]) === nk) return true;
    }
    return false;
  }
  function isKeyLocked(k) {
    if (!k) return false;
    var nk = normalizeKey(k);
    for (var i = 0; i < KEY_SYSTEM.lockedKeys.length; i++) {
      if (normalizeKey(KEY_SYSTEM.lockedKeys[i]) === nk) return true;
    }
    return false;
  }
  function isKeyInDateRange() {
    var now = Date.now();
    return (now >= KEY_SYSTEM.startDate && now <= KEY_SYSTEM.endDate);
  }
  function getKeyStatus(k) {
    if (!k) return { status: 'invalid', reason: 'no-key' };
    if (!isKeyValid(k)) return { status: 'invalid', reason: 'wrong-key' };
    if (isKeyLocked(k)) return { status: 'locked', reason: 'key-locked' };
    if (!isKeyInDateRange()) {
      var now = Date.now();
      if (now < KEY_SYSTEM.startDate) return { status: 'not-yet', reason: 'not-started' };
      if (now > KEY_SYSTEM.endDate) return { status: 'expired', reason: 'key-expired' };
    }
    return { status: 'active', reason: 'ok' };
  }
  function checkUserKey() {
    var saved = S.get('userKey', '');
    var status = getKeyStatus(saved);
    if (status.status !== 'active') return { ok: false, reason: status.reason, status: status.status };
    return { ok: true, key: saved };
  }
  function formatTimeLeft(ms) {
    if (ms <= 0) return 'Hết hạn';
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60);
    var sec = s - m * 60;
    var out = [];
    if (d > 0) out.push(d + 'n');
    if (h > 0 || d > 0) out.push(h + 'g');
    out.push(m + 'p');
    out.push(sec + 's');
    return out.join(' ');
  }
  function formatTimeLeftShort(ms) {
    if (ms <= 0) return 'Hết hạn';
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60);
    var out = [];
    if (d > 0) out.push(d + 'n');
    if (h > 0) out.push(h + 'g');
    out.push(m + 'p');
    return out.join(' ');
  }

  var DICHVU_LOCK = {
    keyBase: function() { try { var u = new URL(location.href); return 'tt_dv_lock_' + u.origin + u.pathname.replace(/\/$/, ''); } catch (e) { return 'tt_dv_lock_' + location.href.split('?')[0].split('#')[0]; } },
    isLocked: function() { try { return sessionStorage.getItem(DICHVU_LOCK.keyBase()) === '1'; } catch (e) { return false; } },
    lock: function() { try { sessionStorage.setItem(DICHVU_LOCK.keyBase(), '1'); } catch (e) {} },
    unlock: function() { try { sessionStorage.removeItem(DICHVU_LOCK.keyBase()); } catch (e) {} },
    unlockAll: function() {
      try {
        DICHVU_LOCK.unlock();
        var toDel = [];
        for (var i = 0; i < sessionStorage.length; i++) { var k = sessionStorage.key(i); if (k && k.indexOf('tt_dv_lock_') === 0) toDel.push(k); }
        for (var j = 0; j < toDel.length; j++) { try { sessionStorage.removeItem(toDel[j]); } catch (e) {} }
      } catch (e) {}
    }
  };

  function normalizeKeyword(k) { if (!k) return ''; var s = (k + '').toLowerCase(); try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {} s = s.replace(/đ/g, 'd'); s = s.replace(/[\s_\-\.\,\:\;\/\\]+/g, '').trim(); return s; }

  var KEYWORD_MAP = {
    getList: function() { try { var raw = S.get('keywordMap', '[]'); var list = (typeof raw === 'string') ? JSON.parse(raw) : (raw || []); return Array.isArray(list) ? list : []; } catch (e) { return []; } },
    save: function(keyword, domain) {
      if (!keyword || !domain) return false;
      var raw = (keyword + '').trim(); var norm = normalizeKeyword(raw);
      domain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (!norm || !domain) return false;
      var list = KEYWORD_MAP.getList();
      for (var i = 0; i < list.length; i++) if (normalizeKeyword(list[i].k) === norm) { list[i].k = raw; list[i].d = domain; list[i].t = Date.now(); S.set('keywordMap', JSON.stringify(list)); return true; }
      list.unshift({ k: raw, d: domain, t: Date.now() });
      if (list.length > 200) list.length = 200;
      S.set('keywordMap', JSON.stringify(list));
      return true;
    },
    lookup: function(keyword) {
      if (!keyword) return null; var norm = normalizeKeyword(keyword); if (!norm) return null;
      var list = KEYWORD_MAP.getList();
      for (var i = 0; i < list.length; i++) if (normalizeKeyword(list[i].k) === norm) return list[i].d;
      for (var j = 0; j < list.length; j++) { var lk = normalizeKeyword(list[j].k); if (lk && (norm.indexOf(lk) !== -1 || lk.indexOf(norm) !== -1)) return list[j].d; }
      return null;
    },
    remove: function(keyword) { var list = KEYWORD_MAP.getList(); var out = []; var norm = normalizeKeyword(keyword); for (var i = 0; i < list.length; i++) if (normalizeKeyword(list[i].k) !== norm) out.push(list[i]); S.set('keywordMap', JSON.stringify(out)); },
    count: function() { return KEYWORD_MAP.getList().length; }
  };

  var __tesseractLoading = null, __tesseractWorker = null;
  function loadTesseract() {
    if (__tesseractWorker) return Promise.resolve(__tesseractWorker);
    if (__tesseractLoading) return __tesseractLoading;
    __tesseractLoading = new Promise(function(resolve, reject) {
      var timeout = setTimeout(function() { reject(new Error('timeout')); }, CFG.ocrTimeoutMs);
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js';
      script.onload = function() {
        clearTimeout(timeout);
        if (typeof Tesseract === 'undefined') { reject(new Error('no Tesseract')); return; }
        try {
          Tesseract.createWorker(['vie', 'eng'], 1).then(function(worker) { __tesseractWorker = worker; resolve(worker); }).catch(function(err) { reject(err); });
        } catch (e) { reject(e); }
      };
      script.onerror = function() { clearTimeout(timeout); reject(new Error('load fail')); };
      document.head.appendChild(script);
    });
    return __tesseractLoading;
  }
  function findKeywordImage() {
    var img = document.querySelector('img[alt="Từ khóa nhiệm vụ"]');
    if (img) return img;
    var allImg = document.querySelectorAll('img');
    for (var i = 0; i < allImg.length; i++) { var alt = (allImg[i].alt || '').toLowerCase(); if (alt.indexOf('khóa') !== -1 || alt.indexOf('khoa') !== -1 || alt.indexOf('keyword') !== -1) return allImg[i]; }
    return null;
  }
  function ocrImage(img) {
    return new Promise(function(resolve, reject) {
      if (!img) { reject(new Error('no img')); return; }
      loadTesseract().then(function(worker) {
        try {
          var canvas = document.createElement('canvas');
          var scale = 3;
          canvas.width = (img.naturalWidth || img.width || 220) * scale;
          canvas.height = (img.naturalHeight || img.height || 108) * scale;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          worker.recognize(canvas.toDataURL('image/png')).then(function(result) { var txt = (result && result.data && result.data.text) ? result.data.text : ''; txt = txt.replace(/\s+/g, ' ').trim(); resolve(txt); }).catch(function(err) { reject(err); });
        } catch (e) { reject(e); }
      }).catch(function(err) { reject(err); });
    });
  }
  function scanDichvuKeyword() {
    return new Promise(function(resolve) {
      try {
        var img = findKeywordImage();
        if (!img) { resolve(''); return; }
        ocrImage(img).then(function(rawText) { if (!rawText) { resolve(''); return; } var cleaned = rawText.replace(/\s+/g, ' ').trim(); cleaned = cleaned.replace(/[^\p{L}\p{N}\s\-_.]/gu, '').replace(/\s+/g, ' ').trim(); resolve(cleaned); }).catch(function() { resolve(''); });
      } catch (e) { resolve(''); }
    });
  }

  var DOMAINS = {
    getList: function() { try { var raw = S.get('savedDomains', '[]'); return typeof raw === 'string' ? JSON.parse(raw) : (raw || []); } catch (e) { return []; } },
    save: function(domain) { var d = (domain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''); if (!d) return false; var list = DOMAINS.getList(); for (var i = 0; i < list.length; i++) if (list[i].d === d) return false; list.unshift({ d: d, t: Date.now() }); if (list.length > 30) list.length = 30; S.set('savedDomains', JSON.stringify(list)); return true; },
    remove: function(d) { var list = DOMAINS.getList(); var out = []; for (var i = 0; i < list.length; i++) if (list[i].d !== d) out.push(list[i]); S.set('savedDomains', JSON.stringify(out)); }
  };

  function log() { try { console.log.apply(console, arguments); } catch (e) {} }
  function isElementAlive(el) { if (!el) return false; if (!document.contains(el)) return false; try { var r = el.getBoundingClientRect(); if (r.width === 0 && r.height === 0) { var st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden') return false; } } catch (e) { return false; } return true; }
  function readLatestToast() { try { var toasts = document.querySelectorAll('.Toastify__toast'); if (!toasts.length) return ''; var last = toasts[toasts.length - 1]; return (last.textContent || '').trim().toLowerCase(); } catch (e) { return ''; } }
  function showGifOverlay(ms, customGif) {
    if (!IS_TOP || !document.body) return;
    var old = document.getElementById('tt-gif-overlay'); if (old) old.remove();
    var ov = document.createElement('div'); ov.id = 'tt-gif-overlay';
    var img = document.createElement('img'); img.src = customGif || GIF_CLOSE;
    ov.appendChild(img); document.body.appendChild(ov);
    setTimeout(function() { if (ov.parentNode) ov.remove(); }, ms || 2500);
  }

  var __cfHandled = false, __cfTimer = null;
  function isCloudflareChallengePage() {
    try {
      if (location.href.indexOf('/cdn-cgi/challenge-platform') !== -1) return true;
      var b = ((document.body && document.body.innerText) || '').toLowerCase();
      if (b.indexOf('xác minh bảo mật') !== -1) return true;
      if (b.indexOf('xác minh bạn là người dùng thật') !== -1) return true;
      if (b.indexOf('verify you are human') !== -1) return true;
      if (b.indexOf('checking your browser') !== -1) return true;
      var ifr = document.querySelectorAll('iframe');
      for (var i = 0; i < ifr.length; i++) if ((ifr[i].src || '').indexOf('challenges.cloudflare.com') !== -1) return true;
      if (document.querySelector('.cf-turnstile, [class*="cf-turnstile"], #cf-chl-widget')) return true;
      return false;
    } catch (e) { return false; }
  }
  function findCloudflareTurnstileIframe() {
    var ifr = document.querySelectorAll('iframe');
    for (var i = 0; i < ifr.length; i++) { var s = ifr[i].src || ''; if (s.indexOf('challenges.cloudflare.com') !== -1) { var r = ifr[i].getBoundingClientRect(); if (r.width >= 100 && r.height >= 40) return ifr[i]; } }
    return null;
  }
  function clickCloudflareCheckboxOnce() {
    try {
      var iframe = findCloudflareTurnstileIframe();
      if (iframe) {
        var r = iframe.getBoundingClientRect();
        var offsets = [[22, 22], [25, 25], [20, 20], [30, 30]];
        for (var oi = 0; oi < offsets.length; oi++) {
          var cx = r.left + offsets[oi][0], cy = r.top + offsets[oi][1];
          var target = document.elementFromPoint(cx, cy); if (!target) continue;
          ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(function(ev) {
            try { target.dispatchEvent(new MouseEvent(ev, { bubbles: true, cancelable: true, button: 0, clientX: cx, clientY: cy })); } catch (e) {}
          });
        }
        return true;
      }
      return false;
    } catch (e) { return false; }
  }
  function handleCloudflareChallenge() {
    if (__cfHandled) return false;
    if (!isCloudflareChallengePage()) return false;
    __cfHandled = true;
    log('CF: ★ PHAT HIEN ★');
    if (IS_TOP && UI && UI.status) UI.status.textContent = '❯ Đang xác minh CF... ❮';
    var a = 0, maxA = 60;
    if (__cfTimer) { try { clearInterval(__cfTimer); } catch (e) {} __cfTimer = null; }
    __cfTimer = setInterval(function() {
      a++;
      if (a > maxA) { clearInterval(__cfTimer); __cfTimer = null; return; }
      if (!isCloudflareChallengePage()) {
        clearInterval(__cfTimer); __cfTimer = null;
        log('CF: ★ PASS ★');
        __cfHandled = false;
        DICHVU_LOCK.unlockAll();
        if (UI && UI.status) UI.status.textContent = '✧ Đã pass CF ✧';
        if (IS_TOP) { try { showGifOverlay(2000, GIF_KITTY_HEART); } catch (e) {} try { showToast('♛ PASS CF ♛', 2000); } catch (e) {} }
        return;
      }
      clickCloudflareCheckboxOnce();
    }, 1000);
    return true;
  }

  function initFakeAgent() {
    try {
      if (window !== window.top) return;
      var fpRaw = S.get('fakeFingerprint', ''), fp = null;
      if (fpRaw) { try { fp = (typeof fpRaw === 'string') ? JSON.parse(fpRaw) : fpRaw; } catch (e) { fp = null; } }
      if (!fp || !fp.ua) {
        var UA_POOL = ['Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36','Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'];
        var ua = UA_POOL[Math.floor(Math.random() * UA_POOL.length)];
        fp = { ua: ua, lang: 'vi-VN', langs: ['vi-VN', 'vi', 'en'], hw: 8, mem: 8, touch: 5, platform: /iPhone/i.test(ua) ? 'iPhone' : 'Linux armv8l' };
        try { S.set('fakeFingerprint', JSON.stringify(fp)); } catch (e) {}
      }
      function safeDefine(obj, prop, getter) { try { var desc = Object.getOwnPropertyDescriptor(obj, prop); if (desc && !desc.configurable) return false; Object.defineProperty(obj, prop, { get: getter, configurable: true, enumerable: true }); return true; } catch (e) { return false; } }
      try {
        safeDefine(Navigator.prototype, 'userAgent', function() { return fp.ua; });
        safeDefine(Navigator.prototype, 'platform', function() { return fp.platform; });
        safeDefine(Navigator.prototype, 'language', function() { return fp.lang; });
        safeDefine(Navigator.prototype, 'languages', function() { return fp.langs.slice(); });
        safeDefine(Navigator.prototype, 'hardwareConcurrency', function() { return fp.hw; });
        safeDefine(Navigator.prototype, 'webdriver', function() { return false; });
      } catch (e) {}
    } catch (e) {}
  }
  initFakeAgent();

  function getState() { return S.get('state', STATE.IDLE); }
  function setState(s) { var old = getState(); if (old === s) return; S.set('state', s); S.set('stateSetAt', Date.now().toString()); log('★ STATE: ' + old + ' -> ' + s); if (IS_TOP && UI && UI.status) refreshStatus(); }

  function saveCode(code) { if (!code || typeof code !== 'string') return; code = code.trim(); if (!code || !isValidCodeShape(code) || isBlacklistedCode(code)) return; try { S.set('code', code); S.set('codeBackup', code); S.set('codeFoundAt', Date.now().toString()); S.set('codeHardLock', code); log('SAVE CODE: ' + code); } catch (e) {} }
  function loadCode() { var c = S.get('code', ''); if (c) c = (c + '').trim(); if (c && isValidCodeShape(c) && !isBlacklistedCode(c)) return c; var cb = S.get('codeBackup', ''); if (cb) cb = (cb + '').trim(); if (cb && isValidCodeShape(cb) && !isBlacklistedCode(cb)) { try { S.set('code', cb); } catch (e) {} return cb; } return ''; }
  function isValidCodeShape(s) { if (!s) return false; if (s.length !== 8) return false; if (!/^[A-Za-z0-9]+$/.test(s)) return false; if (!/[0-9]/.test(s)) return false; if (!/[A-Za-z]/.test(s)) return false; var d = (s.match(/[0-9]/g) || []).length; if (d < 1 || d > 7) return false; var l = (s.match(/[A-Za-z]/g) || []).length; if (l < 1 || l > 7) return false; if (/^(.)\1{7}$/.test(s)) return false; if (/^(01234567|12345678|abcdefgh|ABCDEFGH|00000000|11111111)$/i.test(s)) return false; return true; }
  function safeNavigate(url) { if (!url) return; var l = S.get('lastNavUrl', ''); var at = parseInt(S.get('lastNavAt', '0'), 10); var now = Date.now(); if (l === url && (now - at) < CFG.navCooldownMs) return; S.set('lastNavUrl', url); S.set('lastNavAt', now.toString()); try { location.href = url; } catch (e) {} }

  function isTargetPage() { var t = S.get('targetUrl'); var curDomain = S.get('domain'); var ch = HOST.replace(/^www\./, ''); if (curDomain) { var cd = curDomain.toLowerCase().replace(/^www\./, '').replace(/^https?:\/\//, '').replace(/\/.*$/, ''); if (ch.indexOf(cd) !== -1 || cd.indexOf(ch) !== -1) return true; } if (!t) return false; try { var th = new URL(t).hostname.replace(/^www\./, ''); if (ch.indexOf(th) !== -1 || th.indexOf(ch) !== -1) return true; } catch (e) {} return false; }
  function isRealTargetPage() { return !isGtraffic && !isGoogle && !isDichvuTask && !isRobuxReward && !isTaskTrafficNgon && isTargetPage(); }
  function getTopHostname() { try { if (window.top && window.top.location && window.top.location.hostname) return window.top.location.hostname; } catch (e) {} return HOST; }
  function getBaseDomain(host) { if (!host) return ''; host = host.replace(/^www\./, '').toLowerCase(); var parts = host.split('.'); if (parts.length <= 2) return host; var two = ['co.uk','co.jp','co.kr','com.au','co.nz','com.br','co.in','co.id','com.vn','com.cn','com.tw','com.hk','co.th','com.ph','com.my','com.sg']; var l2 = parts.slice(-2).join('.'); if (two.indexOf(l2) !== -1 && parts.length >= 3) return parts.slice(-3).join('.'); return parts.slice(-2).join('.'); }
  function isSameHostAsTop() { try { if (IS_TOP) return true; var t = getTopHostname(); if (!t) return false; return getBaseDomain(HOST) === getBaseDomain(t); } catch (e) { return false; } }

  function shouldToolRunOnThisPage() { return true; }

  function isAutoSite() {
    if (isTaskTrafficNgon) return true;
    if (isDichvuTask) return true;
    if (isRobuxReward) return true;
    if (isGtraffic) return true;
    if (isGoogle) return true;
    if (isRealTargetPage()) return true;
    return false;
  }

  function recheckTaskTrafficNgon() {
    if (isGtraffic || isGoogle || isDichvuTask || isRobuxReward) return false;
    if (isTaskTrafficNgon) {
      if (/(^|\.)tasktrafficngon\./i.test(HOST)) return true;
      try {
        var hasBtn = !!document.querySelector('button.task-create-button');
        var hasForm = !!document.querySelector('form[action*="/tasks/create"]');
        var hasDrawer = !!document.querySelector('.dashboard-drawer');
        var hasPanel = !!document.querySelector('.dashboard-panel');
        var hits = 0;
        if (hasBtn) hits++;
        if (hasForm) hits++;
        if (hasDrawer) hits++;
        if (hasPanel) hits++;
        if (hits >= 2) { log('★ TT: Confirm TTTN qua ' + hits + ' dấu hiệu'); return true; }
      } catch (e) {}
    }
    return isTaskTrafficNgon;
  }

  if (!shouldToolRunOnThisPage()) return;

  // ===== GLOBALS =====
  var loopRunning = false, stopRequested = false, fillRunning = false, submitRunning = false,
    finishCalled = false, fillDone = false, submitted = false, fillRetries = 0, codeShown = false,
    gtrafficCheckTimer = null, loopTimer = null, leaveCheckTimer = null, googleObserver = null,
    wasOnValidPage = true, cachedInput = null, cachedInputTime = 0, cachedConfirm = null,
    cachedConfirmTime = 0, cachedBtn = null, cachedBtnTime = 0, getLinkPollTimer = null,
    getLinkClickDone = false, getLinkStartAt = 0, googleClicked = false,
    pageLoadTime = Date.now(), watchdogTimer = null, patchedInput = null, childTabRef = null,
    pollChildTimer = null, dichvuTaskTimer = null;

  var ttStage = '', ttClickAt = 0, ttLinkWaitStart = 0, ttLinkFound = '', ttCooldownAt = 0;
  var ttOpenClickAt = 0;
  var ttTaskCreated = (S.get('ttTaskCreated', '0') === '1');
  var keyCountdownTimer = null;

  if (!pageLoadTime) pageLoadTime = Date.now();

  function goBackToGtraffic() {
    if (S.get('backDone') === '1') return;
    var c = getCodeFromPanel(); if (!c) c = loadCode();
    if (c && isValidCodeShape(c) && !isBlacklistedCode(c)) { try { S.set('code', c); S.set('codeBackup', c); S.set('codeHardLock', c); } catch (e) {} }
    try { S.set('state', STATE.BACK_GTRAFFIC); S.set('inFlow', '1'); } catch (e) {}
    S.set('backDone', '1'); S.set('navigatingBack', '1');
    log('★ GO BACK GTRAFFIC NOW');
    try { var gu = S.get('gtrafficUrl', ''); if (gu) location.href = gu; else location.href = 'https://gtraffic.io/'; } catch (e) {}
  }

  function resetAllState(silent) {
    if (!silent) log('AUTO RESET');
    try { S.reset(); } catch (e) {}
    stopRequested = true; loopRunning = false; fillRunning = false; submitRunning = false;
    finishCalled = false; fillDone = false; submitted = false; fillRetries = 0; codeShown = false;
    getLinkClickDone = false; googleClicked = false;
    ttStage = ''; ttClickAt = 0; ttLinkWaitStart = 0; ttLinkFound = ''; ttOpenClickAt = 0;
    if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; }
    if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
    if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; }
    if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
    if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; }
    if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
    if (UI && UI.root) UI.root.style.display = 'none';
    var fab = document.getElementById('tt-fab'); if (fab) fab.remove();
  }

  function startLeaveDetector() {
    if (!IS_TOP) return;
    if (leaveCheckTimer) return;
    leaveCheckTimer = setInterval(function() {
      if (Date.now() - pageLoadTime < 2000) return;
      if (S.get('inFlow') === '1') return;
      if (isCloudflareChallengePage()) return;
      var valid = isAutoSite();
      if (wasOnValidPage && !valid) {
        var st = getState();
        var inFlow = (st === STATE.GET_CODE || st === STATE.WAIT_COUNTDOWN || st === STATE.SCAN_BTN || st === STATE.BACK_GTRAFFIC || st === STATE.FILL_CODE || st === STATE.GOOGLE_CLICK || st === STATE.DICHVU_TASK || st === STATE.TT_TASK);
        var hasCode = !!(loadCode());
        if (!inFlow && !hasCode) { resetAllState(); wasOnValidPage = false; if (leaveCheckTimer) { clearInterval(leaveCheckTimer); leaveCheckTimer = null; } }
      }
    }, CFG.leaveCheckMs);
  }
  try {
    window.addEventListener('beforeunload', function() { if (S.get('inFlow') === '1') return; try { S.set('leavingAt', Date.now().toString()); } catch (e) {} });
    window.addEventListener('pagehide', function() { if (S.get('inFlow') === '1') return; try { S.set('leavingAt', Date.now().toString()); } catch (e) {} });
  } catch (e) {}

  function stopAll() {
    stopRequested = true; loopRunning = false; fillRunning = false; submitRunning = false;
    if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; }
    if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
    if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; }
    if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
    if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; }
    if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
    if (dichvuTaskTimer) { try { clearInterval(dichvuTaskTimer); } catch (e) {} dichvuTaskTimer = null; }
  }
  function resetFillFlags() {
    stopRequested = false; fillRunning = false; submitRunning = false; finishCalled = false;
    fillDone = false; submitted = false; fillRetries = 0; codeShown = false;
    cachedInput = null; cachedInputTime = 0; cachedConfirm = null; cachedConfirmTime = 0;
    getLinkClickDone = false; getLinkStartAt = 0; googleClicked = false;
    try { S.del('hardStop'); } catch (e) {} try { S.del('countdownRealZero'); } catch (e) {}
    try { S.del('getLinkClicked'); } catch (e) {} try { S.del('waitingGetLink'); } catch (e) {}
    try { S.del('pendingAutoReset'); } catch (e) {} try { S.del('childTabOpen'); } catch (e) {}
  }

  function watchdog() {
    if (S.get('waitingGetLink') === '1') return;
    var st = getState(); var sa = parseInt(S.get('stateSetAt', '0'), 10); var age = Date.now() - sa;
    if (S.get('hardStop') === '1') { stopAll(); return; }
    if (isRealTargetPage() && (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK)) { setState(STATE.SCAN_BTN); return; }
    if (st === STATE.GOOGLE_CLICK && age > CFG.watchdogMs) { setState(STATE.SCAN_BTN); return; }
    if (st === STATE.SCAN_BTN && age > 30000) { S.set('stateSetAt', Date.now().toString()); }
    if (st === STATE.WAIT_COUNTDOWN && age > 90000) { setState(STATE.GET_CODE); return; }
    if (st === STATE.WAIT_COUNTDOWN) {
      var cd = readCountdown();
      if (cd && cd.sec === 0 && S.get('cdStartSec') && S.get('cdStartSec') !== '0') { setState(STATE.GET_CODE); return; }
    }
    if (st === STATE.GET_CODE && age > CFG.codeTimeoutMs) { if (S.get('backDone') !== '1') S.set('backDone', '1'); }
  }

  var UI = {};

  function isBlueish(c) { if (!c) return false; if (c.b < 110) return false; if (c.r > c.b) return false; if (c.g > c.b + 25) return false; if (c.b - c.r < 30) return false; return true; }
  function getBgRGBA(el) { var c = tryGetBg(el); if (c && c.a > 0.5) return c; var p = el.parentElement; var d = 0; while (p && d < 5) { var pc = tryGetBg(p); if (pc && pc.a > 0.5) return pc; p = p.parentElement; d++; } return null; }
  function tryGetBg(el) { if (!el) return null; try { var st = window.getComputedStyle(el); var bg = st.backgroundColor || ''; var m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/); if (m) { var a = m[4] !== undefined ? parseFloat(m[4]) : 1; return { r: parseInt(m[1],10), g: parseInt(m[2],10), b: parseInt(m[3],10), a: a }; } } catch (e) {} return null; }
  function isRound(el) { var w = el.offsetWidth, h = el.offsetHeight; if (w < 30 || w > 200) return false; if (h < 30 || h > 200) return false; if (Math.abs(w - h) > 15) return false; return true; }
  function isExcluded(el) { var cls = (el.className || '').toString().toLowerCase(); var id = (el.id || '').toString().toLowerCase(); var c = ' ' + cls + ' ' + id + ' '; var ban = ['logo','brand','avatar','banner','header','nav','menu','footer','navbar','topbar','toolbar','copyright']; for (var i = 0; i < ban.length; i++) { if (c.indexOf(' ' + ban[i] + ' ') !== -1) return true; if (c.indexOf(' ' + ban[i] + '-') !== -1) return true; if (c.indexOf('-' + ban[i] + ' ') !== -1) return true; } return false; }

  function findByPixelScan() {
    if (!document.body) return null;
    var vw = window.innerWidth, vh = window.innerHeight, step = 12, seen = {}, candidates = [];
    for (var y = 30; y < vh - 30; y += step) {
      for (var x = 30; x < vw - 30; x += step) {
        try {
          var el = document.elementFromPoint(x, y); if (!el) continue;
          if (el.closest && el.closest('#tt-root')) continue;
          if (el.closest && el.closest('#tt-fab')) continue;
          if (isExcluded(el)) continue;
          if (!isRound(el)) { var p = el.parentElement; var cnt = 0; while (p && cnt < 3) { if (isExcluded(p)) break; if (isRound(p)) { el = p; break; } p = p.parentElement; cnt++; } if (!isRound(el)) continue; }
          var key = el.tagName + '#' + (el.id||'') + '.' + (el.className||'').toString().slice(0,20); if (seen[key]) continue; seen[key] = true;
          var score = 0; var bg = getBgRGBA(el); if (isBlueish(bg)) score += 100;
          try { if (el.querySelector('svg, img, canvas, text')) score += 60; } catch (e) {}
          if (el.tagName === 'SVG' || el.tagName === 'IMG' || el.tagName === 'CANVAS') score += 50;
          var txt = (el.textContent || '').trim();
          if (txt === 'g' || txt === 'G') score += 200; else if (/^\d{1,4}$/.test(txt)) score += 200; else if (/^g\d{1,4}$/i.test(txt)) score += 200;
          var r = el.getBoundingClientRect(); var cx = r.left + r.width / 2, cy = r.top + r.height / 2; var d = Math.abs(cx - vw/2)/vw + Math.abs(cy - vh/2)/vh; score += Math.max(0, 40 - d * 40);
          if (score >= 100) candidates.push({ el: el, score: score });
        } catch (e) {}
      }
    }
    if (!candidates.length) return null;
    candidates.sort(function(a,b) { return b.score - a.score; });
    return candidates[0].el;
  }
  function findByHeuristic() {
    try { var fastSels = ['#avt-btn','[id*="avt" i]','[class*="avt" i]','[aria-label*="verify" i]','[aria-label*="code" i]','[data-code]','[data-verify]']; for (var s = 0; s < fastSels.length; s++) { try { var found = document.querySelector(fastSels[s]); if (found && (!found.closest || !found.closest('#tt-root'))) { var wf = found.offsetWidth || found.clientWidth, hf = found.offsetHeight || found.clientHeight; if (wf >= 30 && wf <= 250 && Math.abs(wf-hf) <= 20) return found; } } catch (e) {} } } catch (e) {}
    try { var svgs = document.querySelectorAll('svg'); for (var j = 0; j < svgs.length; j++) { var svg = svgs[j]; if (svg.closest && svg.closest('#tt-root')) continue; var sw = svg.offsetWidth || svg.clientWidth, sh = svg.offsetHeight || svg.clientHeight; if (sw < 30 || sw > 250) continue; if (Math.abs(sw-sh) > 20) continue; if (svg.offsetParent === null) continue; try { var txtEl = svg.querySelector('text, tspan'); if (txtEl) { var tt = (txtEl.textContent || '').trim(); if (/^g?\d+$/i.test(tt)) return svg; } } catch (e) {} } } catch (e) {}
    try { var all = document.querySelectorAll('div, span, button, a, i, b, strong'); for (var k = 0; k < all.length; k++) { var e2 = all[k]; if (e2.closest && e2.closest('#tt-root')) continue; var w2 = e2.offsetWidth || 0, h2 = e2.offsetHeight || 0; if (w2 < 30 || w2 > 200) continue; if (Math.abs(w2-h2) > 15) continue; var txt2 = (e2.textContent || '').trim(); if (txt2 !== 'g' && txt2 !== 'G') continue; return e2; } } catch (e) {}
    return null;
  }
  function findGreenGButton() {
    if (cachedBtn && Date.now() - cachedBtnTime < 800) {
      try { if (document.contains(cachedBtn)) { var r = cachedBtn.getBoundingClientRect(); if (r.width >= 20 && r.height >= 20) return cachedBtn; } } catch (e) {}
      cachedBtn = null;
    }
    var b = findByHeuristic(); if (b) { cachedBtn = b; cachedBtnTime = Date.now(); return b; }
    b = findByPixelScan(); if (b) { cachedBtn = b; cachedBtnTime = Date.now(); return b; }
    cachedBtn = null; return null;
  }
  function readBtnNumber(btn) {
    if (!btn) return null;
    var t = (btn.textContent || '').replace(/\s+/g, '').trim();
    var m = t.match(/^g?(\d{1,4})$/i);
    if (m) { var s = parseInt(m[1],10); if (s >= 0 && s <= 999) return s; }
    try { var inners = btn.querySelectorAll('text, tspan'); for (var i = 0; i < inners.length; i++) { var tt = (inners[i].textContent || '').replace(/\s+/g, '').trim(); var mm = tt.match(/^g?(\d{1,4})$/i); if (mm) { var s2 = parseInt(mm[1],10); if (s2 >= 0 && s2 <= 999) return s2; } } } catch (e) {}
    return null;
  }
  function clickBtn(el) {
    if (!el) return;
    try { el.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch (e) {}
    setTimeout(function() {
      try { el.click(); } catch (e) {}
      try { el.dispatchEvent(new Event('click', { bubbles: true, cancelable: true })); } catch (e) {}
      try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); } catch (e) {}
    }, 0);
  }
  var CD_PATTERNS = [/vui long cho\s*(\d+)\s*s?\s*\(\s*(\d+)\s*\/\s*(\d+)\s*\)/i, /cho\s*(\d+)\s*s\s*\(\s*(\d+)\s*\/\s*(\d+)\s*\)/i, /cho\s*(\d+)\s*giay/i, /cho\s*(\d+)\s*s\b/i, /con[:\s]*(\d+)/i, /wait[:\s]*(\d+)/i, /time[:\s]*(\d+)/i, /(\d+)\s*seconds?/i];
  function parseCd(t) { if (!t) return null; for (var p = 0; p < CD_PATTERNS.length; p++) { var m = t.match(CD_PATTERNS[p]); if (m) { var s = parseInt(m[1],10); if (s >= 0 && s <= 999) return { sec: s, phase: m[2]?parseInt(m[2],10):1, total: m[3]?parseInt(m[3],10):2 }; } } return null; }
  function readCountdown() {
    var btn = cachedBtn;
    if (!btn || !isElementAlive(btn)) btn = findGreenGButton();
    if (btn) {
      var n = readBtnNumber(btn);
      if (n !== null) {
        if (!S.get('cdStartSec') || S.get('cdStartSec') === '0') { S.set('cdStartSec', n.toString()); S.set('cdStartAt', Date.now().toString()); }
        return { sec: n, phase: 1, total: 2, src: 'btn' };
      }
    }
    try { var bt = (document.body && document.body.innerText) || ''; var r = parseCd(bt); if (r) return { sec: r.sec, phase: r.phase, total: r.total, src: 'page' }; } catch (e) {}
    var clickAt = parseInt(S.get('btnClickAt', '0'), 10);
    if (clickAt > 0) { var e2 = Math.floor((Date.now() - clickAt) / 1000); if (e2 > 8) { var r2 = CFG.defaultCountdown - e2; if (r2 < 0) r2 = 0; return { sec: r2, phase: 1, total: 2, src: 'click' }; } }
    return null;
  }

  function scanPageForCode() {
    if (getState() !== STATE.GET_CODE) return null;
    var candidates = [], seen = {};
    try {
      var all = document.querySelectorAll('div, span, button, a, p, strong, h1, h2, h3, h4, td, th, li, label, section, article, code, kbd, mark, pre');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.closest && el.closest('#tt-root')) continue;
        if (cachedBtn && el === cachedBtn) continue;
        var txt = (el.textContent || '').replace(/\s+/g, '').trim();
        if (!txt || txt.length !== 8) continue;
        if (!/^[A-Za-z0-9]+$/.test(txt)) continue;
        if (isBlacklistedCode(txt)) continue;
        if (!isValidCodeShape(txt)) continue;
        if (seen[txt]) continue; seen[txt] = true; candidates.push(txt);
      }
    } catch (e) {}
    return candidates.length ? candidates[0] : null;
  }
  function extractCodeFromBtn(btn) {
    if (!btn) return null;
    var t = (btn.textContent || '').replace(/\s+/g, '').trim();
    if (t.length === 8 && /^[A-Za-z0-9]+$/.test(t) && !isBlacklistedCode(t) && isValidCodeShape(t)) return t;
    return null;
  }
  function extractCode() {
    var b = cachedBtn; if (!b || !isElementAlive(b)) b = findGreenGButton();
    if (b) { var c1 = extractCodeFromBtn(b); if (c1) return c1; }
    var c2 = scanPageForCode(); if (c2) return c2;
    return null;
  }

  function findGoogleResult() {
    var ud = (S.get('domain', '') || '').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/.*$/,'').trim();
    function exH(href) { try { return new URL(href).hostname.replace(/^www\./,'').toLowerCase(); } catch (e) { return ''; } }
    function isUD(href) { if (!ud) return false; var h = exH(href); if (!h) return false; if (h === ud) return true; if (h.indexOf(ud) !== -1) return true; if (ud.indexOf(h) !== -1) return true; return getBaseDomain(h) === getBaseDomain(ud); }
    function isN(href) { if (!href) return true; if (href.indexOf('http://') !== 0 && href.indexOf('https://') !== 0) return true; if (/^https?:\/\/([^\/]+\.)?(google|gstatic|googleusercontent|youtube|wikipedia|facebook)/i.test(href)) return true; return false; }
    if (ud) { try { var aL = document.querySelectorAll('#rso a[href^="http"], #search a[href^="http"], h3 a[href^="http"], a[href^="http"]'); for (var i = 0; i < aL.length; i++) { var h0 = aL[i].href || ''; if (isN(h0)) continue; if (isUD(h0)) return aL[i]; } } catch (e) {} }
    var fs = ['#rso > div a[href^="http"]','#rso a[href^="http"]','#search a[href^="http"]','h3 a[href^="http"]'];
    for (var s = 0; s < fs.length; s++) { try { var fl = document.querySelectorAll(fs[s]); for (var f = 0; f < fl.length; f++) { if (isN(fl[f].href || '')) continue; return fl[f]; } } catch (e) {} }
    return null;
  }
  function startGoogleObserver() {
    if (!IS_TOP || !isGoogle) return; if (googleObserver) return;
    try {
      googleObserver = new MutationObserver(function() {
        if (stopRequested || googleClicked) return;
        var st = getState(); if (st !== STATE.GOOGLE_SEARCH && st !== STATE.GOOGLE_CLICK) return;
        var l = findGoogleResult();
        if (l) { googleClicked = true; try { l.click(); } catch (e) {} S.set('targetUrl', l.href || ''); setState(STATE.GOOGLE_CLICK); if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; } }
      });
      googleObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  function handleGoogle() {
    if (!IS_TOP || googleClicked) return Promise.resolve();
    var st = getState(); if (st !== STATE.GOOGLE_SEARCH && st !== STATE.GOOGLE_CLICK) return Promise.resolve();
    var st2 = S.get('keyword') || S.get('domain'); if (!st2) return Promise.resolve();
    var tries = parseInt(S.get('googleClickTries', '0'), 10); tries++; S.set('googleClickTries', tries.toString());
    var l = findGoogleResult();
    if (l) { googleClicked = true; try { l.click(); } catch (e) {} S.set('targetUrl', l.href || ''); setState(STATE.GOOGLE_CLICK); if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; } return Promise.resolve(); }
    if (tries >= 6) { var cd = (S.get('domain', '')||'').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/.*$/,'').trim(); if (cd && cd.indexOf('.') !== -1) { var u = 'https://' + cd; googleClicked = true; S.set('targetUrl', u); setState(STATE.SCAN_BTN); safeNavigate(u); } }
    return Promise.resolve();
  }

  function findCodeInput() {
    var sels = ['input[maxlength="8"][type="text"]','input[maxlength="8"]:not([type="hidden"])','input[placeholder*="Nhập mã xác nhận"]','input[placeholder*="nhập mã"]','input[name="code"]','input#code'];
    for (var i = 0; i < sels.length; i++) { var els = document.querySelectorAll(sels[i]); for (var j = 0; j < els.length; j++) { var el = els[j]; if (el.closest && el.closest('#tt-root')) continue; if (el.type && /hidden|submit|button|checkbox|radio|file|image/i.test(el.type)) continue; var r = el.getBoundingClientRect(); if (r.width < 30 || r.height < 15) continue; return el; } }
    return null;
  }
  function findConfirmBtn() {
    var all = document.querySelectorAll('button, a, div[onclick], div[role="button"], input[type="submit"], span, div, [tabindex]'), best = null, bestScore = -1;
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest && el.closest('#tt-root')) continue;
      var r = el.getBoundingClientRect(); if (r.width < 20 || r.height < 15) continue;
      var txt = (el.textContent || el.value || '').replace(/\s+/g, ' ').trim();
      if (!txt || txt.length < 4 || txt.length > 100) continue;
      var sc = 0;
      if (/^NHẬP MÃ XÁC NHẬN$/i.test(txt)) sc += 1000;
      else if (/^nhập mã xác nhận$/i.test(txt)) sc += 900;
      else if (/xác nhận|xac nhan/i.test(txt)) sc += 300;
      else continue;
      if (el.tagName === 'BUTTON') sc += 50;
      if (sc > bestScore) { bestScore = sc; best = el; }
    }
    return best;
  }
  function findCodeInputCached() { var n = Date.now(); if (cachedInput && isElementAlive(cachedInput) && n - cachedInputTime < 1000) return cachedInput; var el = findCodeInput(); cachedInput = el; cachedInputTime = n; return el; }
  function findConfirmBtnCached() { var n = Date.now(); if (cachedConfirm && isElementAlive(cachedConfirm) && n - cachedConfirmTime < 1000) return cachedConfirm; var el = findConfirmBtn(); cachedConfirm = el; cachedConfirmTime = n; return el; }
  function getCodeFromPanel() { if (UI && UI.codeVal) { var t = (UI.codeVal.textContent || '').trim(); if (t && t !== '----') return t; } return ''; }

  function nativeSetValue(el, v) { try { var proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; var d = Object.getOwnPropertyDescriptor(proto, 'value'); if (d && d.set) { d.set.call(el, v); return true; } el.value = v; return true; } catch (e) { return false; } }
  function nativeGetValue(el) { try { var proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; var d = Object.getOwnPropertyDescriptor(proto, 'value'); if (d && d.get) return d.get.call(el); return el.value; } catch (e) { return ''; } }
  function fireFullSequence(el, ch) {
    try { el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ch, keyCode: (ch||'').charCodeAt(0) })); } catch (e) {}
    try { el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: ch })); } catch (e) {}
    try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
    try { el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: ch, keyCode: (ch||'').charCodeAt(0) })); } catch (e) {}
  }
  function nativeSetFill(el, code) {
    try {
      el.focus(); try { el.click(); } catch (e) {} try { el.select(); } catch (e) {}
      nativeSetValue(el, ''); nativeSetValue(el, code);
      for (var i = 0; i < code.length; i++) fireFullSequence(el, code[i]);
      try { el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); } catch (e) {}
      return nativeGetValue(el) === code;
    } catch (e) { return false; }
  }
  function tryAllFillStrategies(el, code, cb) {
    nativeSetFill(el, code);
    setTimeout(function() { if (nativeGetValue(el) === code) { cb(true); return; } nativeSetFill(el, code); setTimeout(function() { cb(nativeGetValue(el) === code); }, 200); }, 350);
  }
  function stopValueWatchdog() { if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; } }
  function unpatchInput() { patchedInput = null; }
  function clickConfirmNow() {
    var bt = findConfirmBtnCached();
    if (!bt) { bt = findConfirmBtn(); if (bt) { cachedConfirm = bt; cachedConfirmTime = Date.now(); } }
    if (!bt) return false;
    try { bt.scrollIntoView({ block: 'center', behavior: 'instant' }); } catch (e) {}
    function fc(el) { if (!el) return; try { el.focus({ preventScroll: true }); } catch (e) {} try { el.click(); } catch (e) {} try { el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {} try { el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {} try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {} }
    fc(bt);
    try { if (bt.parentElement && !bt.parentElement.closest('#tt-root')) fc(bt.parentElement); } catch (e) {}
    return true;
  }
  function checkSubmitResult() {
    try {
      var toastText = readLatestToast();
      if (toastText) {
        if (toastText.indexOf('thành công') !== -1 || toastText.indexOf('success') !== -1) return 'success';
        if (toastText.indexOf('mã không đúng') !== -1) return 'error';
      }
      var bt = ((document.body && document.body.innerText) || '').toLowerCase();
      var inp = findCodeInputCached();
      if (!inp) return 'success';
      var sk = ['thành công','thanh cong','hoàn tất','hoan tat','đã xác nhận','success','completed'];
      for (var j = 0; j < sk.length; j++) if (bt.indexOf(sk[j]) !== -1) return 'success';
      var ek = ['mã không đúng','ma khong dung','mã sai','mã hết hạn','invalid'];
      for (var i = 0; i < ek.length; i++) if (bt.indexOf(ek[i]) !== -1) return 'error';
      var cv = (nativeGetValue(inp) || '').trim();
      if (cv && cv === loadCode()) return 'pending';
      return 'unknown';
    } catch (e) { return 'unknown'; }
  }
  function stripVietnamese(s) { if (!s) return ''; return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase(); }
  function findGetLinkButton() {
    var all = document.querySelectorAll('button, a, div[role="button"], span, div');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest && el.closest('#tt-root')) continue;
      if (el.offsetParent === null && el.tagName !== 'A') continue;
      var txt = (el.textContent || el.value || '').replace(/\s+/g, ' ').trim();
      if (!txt || txt.length > 40) continue;
      var lc = stripVietnamese(txt);
      if (lc === 'lay link' || lc === 'laylink' || lc === 'lay link ngay' || lc === 'nhan link') {
        var r = el.getBoundingClientRect();
        if (r.width >= 40 && r.height >= 15) return el;
      }
    }
    return null;
  }
  function clickGetLinkButton(btn) { if (!btn) return false; try { btn.click(); } catch (e) {} try { btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); } catch (e) {} return true; }
  function startWaitingForGetLink() {
    S.set('waitingGetLink', '1'); getLinkStartAt = Date.now(); getLinkClickDone = false;
    if (IS_TOP) showGuide('<b>♛ ĐÃ NỘP MÃ ♛</b><br>Đang chờ nút LẤY LINK...');
    if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
    function tryClick() {
      if (getLinkClickDone) return;
      var btn = findGetLinkButton(); if (!btn) return;
      getLinkClickDone = true;
      S.set('hardStop', '1'); S.set('inFlow', '0');
      clickGetLinkButton(btn);
      if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
      setTimeout(function() { try { handleCloudflareChallenge(); } catch (e) {} }, 2000);
    }
    getLinkPollTimer = setInterval(function() {
      if (getLinkClickDone) { clearInterval(getLinkPollTimer); getLinkPollTimer = null; return; }
      if (Date.now() - getLinkStartAt > CFG.getLinkTimeoutMs) {
        getLinkClickDone = true; clearInterval(getLinkPollTimer); getLinkPollTimer = null;
        S.set('hardStop', '1'); S.set('inFlow', '0');
        return;
      }
      tryClick();
    }, 500);
  }
  function finishSuccess(reason) {
    if (finishCalled) return; finishCalled = true; submitted = true;
    stopValueWatchdog(); unpatchInput();
    if (IS_TOP) { try { showGifOverlay(3000, GIF_KITTY_HEART); } catch (e) {} try { showToast('♛ HOÀN THÀNH ♛', 3000); } catch (e) {} }
    S.set('confirmed', '1'); S.set('hardStop', '1'); S.set('inFlow', '0'); S.set('childTabOpen', '0');
    fillDone = true; setState(STATE.DONE); fillRunning = false; submitRunning = false;
    if (gtrafficCheckTimer) { clearInterval(gtrafficCheckTimer); gtrafficCheckTimer = null; }
    if (pollChildTimer) { clearInterval(pollChildTimer); pollChildTimer = null; }
    startWaitingForGetLink();
  }
  function fillAndConfirm(force) {
    if (!IS_TOP || !isGtraffic) return false;
    if (S.get('hardStop') === '1') return false;
    if (finishCalled || submitted) return false;
    if (fillRunning) { setTimeout(function() { fillAndConfirm(force); }, 100); return true; }
    if (submitRunning) return true;
    if (fillDone && !force) return true;
    fillRunning = true;
    var code = getCodeFromPanel();
    if (!code || !isValidCodeShape(code) || isBlacklistedCode(code)) code = loadCode();
    if (!code || !isValidCodeShape(code) || isBlacklistedCode(code)) { fillRetries++; fillRunning = false; if (fillRetries < CFG.fillRetryMax) setTimeout(function() { fillAndConfirm(force); }, CFG.fillRetryDelay); return false; }
    saveCode(code);
    if (!codeShown && UI) { codeShown = true; UI.code.classList.add('show'); UI.codeVal.textContent = code; showGuide('<b>✿ ĐANG DÁN MÃ ✿</b><br>Mã: <b>' + code + '</b>'); }
    var ws = Date.now(), wt = 30000, wp = 100;
    function waitInp() {
      if (stopRequested || S.get('hardStop') === '1' || finishCalled || submitted) { fillRunning = false; return; }
      var inp = findCodeInputCached();
      if (inp) { startFill(inp); return; }
      if (Date.now() - ws > wt) { fillRunning = false; fillRetries++; if (fillRetries < CFG.fillRetryMax) setTimeout(function() { fillAndConfirm(force); }, CFG.fillRetryDelay); return; }
      setTimeout(waitInp, wp);
    }
    function startFill(inp) {
      tryAllFillStrategies(inp, code, function(success) {
        fillRunning = false;
        if (stopRequested || S.get('hardStop') === '1' || finishCalled || submitted) return;
        if (success) {
          showGuide('<b>✿ ĐÃ DÁN MÃ ✿</b><br>Đang nộp...');
          setTimeout(function() {
            if (stopRequested || S.get('hardStop') === '1' || finishCalled || submitted) return;
            submitRunning = true;
            if (nativeGetValue(inp) !== code) { nativeSetValue(inp, code); for (var i = 0; i < code.length; i++) fireFullSequence(inp, code[i]); }
            var ca = 0, mc = 8, ci = 250;
            function tryClick() { if (finishCalled || submitted || S.get('hardStop') === '1') return; ca++; cachedConfirm = null; cachedConfirmTime = 0; clickConfirmNow(); if (ca < mc) setTimeout(tryClick, ci); }
            tryClick();
            var cc = 0, mch = CFG.postSubmitCheckMax;
            function cLoop() {
              if (finishCalled || S.get('hardStop') === '1' || submitted) { submitRunning = false; return; }
              cc++; var res = checkSubmitResult();
              if (res === 'success') { submitRunning = false; finishSuccess('success'); return; }
              if (res === 'error') { S.set('confirmed', '0'); fillDone = false; submitRunning = false; stopValueWatchdog(); var i2 = findCodeInputCached(); if (i2) nativeSetValue(i2, ''); setTimeout(function() { fillAndConfirm(true); }, 500); return; }
              if (cc < mch) setTimeout(cLoop, CFG.postSubmitCheckMs);
              else { submitRunning = false; finishSuccess('timeout'); }
            }
            setTimeout(cLoop, 150);
          }, 30);
        } else { stopValueWatchdog(); fillRetries++; if (fillRetries < CFG.fillRetryMax) setTimeout(function() { fillAndConfirm(true); }, 400); }
      });
    }
    waitInp();
    return true;
  }

  function handleTarget() {
    if (isGtraffic || isGoogle || isDichvuTask || isRobuxReward || isTaskTrafficNgon) return Promise.resolve();
    var st = getState();
    if (!isAutoSite() && !S.get('inFlow')) return Promise.resolve();
    if ((st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) && isRealTargetPage()) { setState(STATE.SCAN_BTN); return Promise.resolve(); }
    if (st === STATE.SCAN_BTN) {
      var sa = parseInt(S.get('stateSetAt', '0'), 10);
      var sc = Date.now() - sa;
      if (sc < CFG.gBtnDelayMs) {
        var rem = Math.ceil((CFG.gBtnDelayMs - sc) / 1000);
        if (IS_TOP && UI) UI.status.textContent = '❯ Đợi nút g: ' + rem + 's ❮';
        return Promise.resolve();
      }
      var b = findGreenGButton();
      if (b) {
        var lc = parseInt(S.get('lastClickTime', '0'), 10);
        if (Date.now() - lc > 120) {
          S.set('lastClickTime', Date.now().toString());
          S.set('btnClickAt', Date.now().toString());
          clickBtn(b);
          if (IS_TOP && UI) UI.status.textContent = '✧ Đã click nút g ✧';
          setState(STATE.WAIT_COUNTDOWN);
        }
      }
      return Promise.resolve();
    }
    if (st === STATE.WAIT_COUNTDOWN) {
      var cd = readCountdown();
      if (cd) {
        var t = parseInt(S.get('serverTotalSec','0'), 10);
        if (cd.sec > t) { t = cd.sec; S.set('serverTotalSec', t.toString()); }
        if (t === 0) t = cd.sec || CFG.defaultCountdown;
        if (IS_TOP) { showTimer(cd.sec, t, 'CHỜ ' + cd.sec + 's'); if (UI && UI.timer) UI.timer.classList.add('show'); }
        if (cd.sec === 0) { setState(STATE.GET_CODE); return Promise.resolve(); }
        return Promise.resolve();
      }
      if (IS_TOP && UI) { UI.status.textContent = '❯ Đợi nút g đếm... ❮'; if (UI.timer) UI.timer.classList.remove('show'); }
      return Promise.resolve();
    }
    if (st === STATE.GET_CODE) {
      var code = extractCode();
      if (code) {
        saveCode(code);
        if (IS_TOP) { showCode(code); try { showGifOverlay(1500, GIF_KITTY_HEART); } catch (e) {} }
        try { S.set('state', STATE.BACK_GTRAFFIC); S.set('inFlow', '1'); } catch (e) {}
        setState(STATE.BACK_GTRAFFIC);
        setTimeout(function() { goBackToGtraffic(); setTimeout(function() { try { window.close(); } catch (e) {} }, 100); }, 200);
      }
      return Promise.resolve();
    }
    if (st === STATE.BACK_GTRAFFIC) {
      if (S.get('navigatingBack') === '1') return Promise.resolve();
      goBackToGtraffic();
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  function handleGtraffic() {
    if (!IS_TOP || !isGtraffic) return Promise.resolve();
    if (S.get('waitingGetLink') === '1') return Promise.resolve();
    if (S.get('getLinkClicked') !== '1') { var b = findGetLinkButton(); if (b) { S.set('hardStop', '1'); S.set('inFlow', '0'); clickGetLinkButton(b); } }
    return Promise.resolve();
  }
  function startGtrafficObserver() {
    if (!IS_TOP || !isGtraffic) return;
    if (gtrafficCheckTimer) return;
    gtrafficCheckTimer = setInterval(function() {
      if (S.get('waitingGetLink') === '1' || S.get('hardStop') === '1' || finishCalled || submitted || stopRequested || S.get('confirmed') === '1' || getState() === STATE.DONE) { clearInterval(gtrafficCheckTimer); gtrafficCheckTimer = null; return; }
      var code = getCodeFromPanel() || loadCode();
      if (!code || !isValidCodeShape(code) || isBlacklistedCode(code)) return;
      var inp = findCodeInputCached(); if (!inp) return;
      if ((nativeGetValue(inp) || '').trim() === '' && !fillRunning && !submitRunning) { fillDone = false; fillRunning = false; fillAndConfirm(true); }
    }, 250);
  }

  // ============================================================
  // ★ TASKTRAFFICNGON
  // ============================================================
  function ttFindCreateButton() {
    var btn = document.querySelector('button.task-create-button');
    if (btn) return btn;
    var form = document.querySelector('form[action*="/tasks/create"]');
    if (form) { var b = form.querySelector('button[type="submit"]'); if (b) return b; }
    var allBtns = document.querySelectorAll('button, a');
    for (var i = 0; i < allBtns.length; i++) {
      var txt = (allBtns[i].textContent || '').trim().toLowerCase();
      if (txt.indexOf('tạo task') !== -1 || txt.indexOf('tao task') !== -1) return allBtns[i];
    }
    return null;
  }

  function ttFindOpenTaskButton() {
    var allEls = document.querySelectorAll('a, button, [role="button"], div[onclick]');
    for (var i = 0; i < allEls.length; i++) {
      var el = allEls[i];
      if (el.closest && el.closest('#tt-root')) continue;
      if (el.offsetParent === null && el.tagName !== 'A') continue;
      var txt = (el.textContent || '').trim().toLowerCase();
      var href = (el.href || el.getAttribute('href') || '').toLowerCase();
      if (txt.indexOf('tạo task') !== -1 || txt.indexOf('tao task') !== -1) continue;
      if (href.indexOf('tasks/create') !== -1) continue;
      var isOpenBtn = (
        txt.indexOf('mở nhiệm vụ') !== -1 ||
        txt.indexOf('mo nhiem vu') !== -1 ||
        txt.indexOf('mở nhiệm') !== -1 ||
        txt.indexOf('mở task') !== -1 ||
        txt.indexOf('mở link') !== -1 ||
        txt.indexOf('mở gt') !== -1 ||
        txt.indexOf('mở gtraffic') !== -1 ||
        txt.indexOf('gtraffic') !== -1 ||
        txt.indexOf('bắt đầu') !== -1 ||
        txt.indexOf('bat dau') !== -1 ||
        txt.indexOf('vào nhiệm vụ') !== -1 ||
        txt.indexOf('đi đến') !== -1 ||
        txt.indexOf('truy cập') !== -1 ||
        txt.indexOf('nhận nhiệm vụ') !== -1 ||
        txt.indexOf('làm nhiệm vụ') !== -1 ||
        href.indexOf('gtraffic.io') !== -1
      );
      if (!isOpenBtn) continue;
      var r = el.getBoundingClientRect();
      if (r.width < 20 || r.height < 10) continue;
      log('★ TT: Thấy nút Mở: "' + (el.textContent || '').trim().substring(0, 40) + '"');
      return el;
    }
    var gLinks = document.querySelectorAll('a[href*="gtraffic.io"]');
    if (gLinks.length > 0) { log('★ TT: Fallback href gtraffic'); return gLinks[0]; }
    var allA = document.querySelectorAll('a[href^="http"]');
    for (var k = 0; k < allA.length; k++) {
      var h = allA[k].href || '';
      if (h.indexOf('tasks/create') !== -1) continue;
      if (h.indexOf(location.hostname) !== -1) continue;
      if (allA[k].closest && allA[k].closest('.dashboard-nav, .dashboard-drawer, nav, header, footer')) continue;
      var rt = allA[k].getBoundingClientRect();
      if (rt.width < 20 || rt.height < 10) continue;
      return allA[k];
    }
    return null;
  }

  function ttIsOnTasksPage() {
    if (isGtraffic) return false;
    if (isGoogle) return false;
    if (isDichvuTask) return false;
    if (isRobuxReward) return false;
    if (!isTaskTrafficNgon) return false;
    var path = location.pathname;
    var host = location.hostname;
    if (/(^|\.)tasktrafficngon\./i.test(host)) {
      if (path === '/dashboard/tasks' || path === '/dashboard/tasks/') return true;
      if (path.indexOf('/dashboard/tasks') === 0) return true;
      return false;
    }
    if (path === '/dashboard/tasks' || path === '/dashboard/tasks/' || path.indexOf('/dashboard/tasks') === 0) {
      try {
        var hasBtn = !!document.querySelector('button.task-create-button');
        var hasForm = !!document.querySelector('form[action*="/tasks/create"]');
        var hasDrawer = !!document.querySelector('.dashboard-drawer');
        var hasPanel = !!document.querySelector('.dashboard-panel');
        var hits = 0;
        if (hasBtn) hits++;
        if (hasForm) hits++;
        if (hasDrawer) hits++;
        if (hasPanel) hits++;
        if (hits >= 2) return true;
        if (document.readyState === 'loading') return true;
        return false;
      } catch (e) { return true; }
    }
    return false;
  }

  function handleTaskTrafficWait() {
    if (!isTaskTrafficNgon) return Promise.resolve();
    if (!ttIsOnTasksPage()) return Promise.resolve();

    if (!ttTaskCreated) {
      log('★ TT: Chưa tạo task — không đợi nút Mở');
      return Promise.resolve();
    }

    if (ttStage === 'clicked_open' || ttStage === 'opening') {
      if (IS_TOP && UI && UI.status) UI.status.textContent = '✧ Đã click Mở NV — đợi chuyển trang ✧';
      return Promise.resolve();
    }

    if (ttStage !== 'waiting_link') return Promise.resolve();

    if (Date.now() - ttLinkWaitStart > CFG.ttLinkWaitMs) {
      log('TT: Hết thời gian đợi — reset');
      if (IS_TOP && UI && UI.status) UI.status.textContent = '✧ Không thấy nút Mở — reset ✧';
      ttStage = ''; ttClickAt = 0; ttTaskCreated = false; ttOpenClickAt = 0;
      try { S.del('ttTaskCreated'); } catch (e) {}
      ttCooldownAt = Date.now();
      return Promise.resolve();
    }

    if (ttOpenClickAt > 0 && (Date.now() - ttOpenClickAt) < CFG.ttOpenClickCooldownMs) {
      var rem = Math.ceil((CFG.ttOpenClickCooldownMs - (Date.now() - ttOpenClickAt)) / 1000);
      if (IS_TOP && UI && UI.status) UI.status.textContent = '❯ Đợi ' + rem + 's rồi click Mở ❮';
      return Promise.resolve();
    }

    var openEl = ttFindOpenTaskButton();
    if (openEl) {
      ttOpenClickAt = Date.now();
      log('★ TT: THẤY NÚT MỞ — CLICK');
      ttStage = 'clicked_open';
      S.set('inFlow', '1'); S.set('childTabOpen', '1');
      S.set('ttStage', 'clicked_open');
      S.set('ttClickedOpenAt', Date.now().toString());
      S.set('ttPageUrl', location.href.split('?')[0].split('#')[0]);

      try { openEl.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch (e) {}
      try { openEl.focus({ preventScroll: true }); } catch (e) {}

      var href = openEl.href || openEl.getAttribute('href') || openEl.getAttribute('data-href') || openEl.getAttribute('data-url') || openEl.getAttribute('data-link') || '';
      if (!href) { try { var aIn = openEl.querySelector('a[href]'); if (aIn) href = aIn.href || aIn.getAttribute('href'); } catch (e) {} }
      if (!href) {
        try {
          var onclick = openEl.getAttribute('onclick') || '';
          var m1 = onclick.match(/window\.open\s*\(\s*['"]([^'"]+)['"]/);
          if (m1) href = m1[1];
          if (!href) { var m2 = onclick.match(/location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/); if (m2) href = m2[1]; }
          if (!href) { var m3 = onclick.match(/['"](https?:\/\/[^'"]+)['"]/); if (m3) href = m3[1]; }
        } catch (e) {}
      }

      if (href && (href.indexOf('http://') === 0 || href.indexOf('https://') === 0)) {
        log('★ TT: Có href → mở trực tiếp: ' + href);
        S.set('gtrafficUrl', href);
        if (IS_TOP && UI && UI.status) UI.status.textContent = '✧ Đang mở link ✧';
        try { showToast('✿ Đã lấy link GTRAFFIC ✿', 2500); } catch (e) {}
        setTimeout(function() {
          try { var w = window.open(href, '_blank'); if (w) return; } catch (e) {}
          try { location.href = href; return; } catch (e) {}
          try {
            var a = document.createElement('a');
            a.href = href; a.target = '_blank'; a.rel = 'noopener';
            document.body.appendChild(a); a.click();
            setTimeout(function() { try { document.body.removeChild(a); } catch (e) {} }, 500);
          } catch (e) {}
        }, 500);
        return Promise.resolve();
      }

      setTimeout(function() {
        try {
          try { openEl.click(); } catch (e) {}
          try { openEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {}
          try { openEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {}
          try { openEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {}
          log('★ TT: ĐÃ CLICK MỞ NV (cooldown 2s)');
          if (IS_TOP && UI && UI.status) UI.status.textContent = '✧ Đã click Mở NV — đợi chuyển trang ✧';
          try { showToast('♛ Đã click Mở nhiệm vụ ♛', 2500); } catch (e) {}
        } catch (e) { log('TT: Lỗi click: ' + e.message); }
      }, 100);
      return Promise.resolve();
    }

    var waited = Math.floor((Date.now() - ttLinkWaitStart) / 1000);
    if (IS_TOP && UI && UI.status) UI.status.textContent = '❯ Đợi nút Mở NV (' + waited + 's)... ❮';
    return Promise.resolve();
  }

  function handleTaskTrafficNgon() {
    if (!isTaskTrafficNgon) return Promise.resolve();
    if (!ttIsOnTasksPage()) return Promise.resolve();
    if (isCloudflareChallengePage()) { handleCloudflareChallenge(); return Promise.resolve(); }

    if (ttStage === 'waiting_link' || ttStage === 'clicked_open' || ttStage === 'opening') {
      return handleTaskTrafficWait();
    }

    if (ttTaskCreated && ttStage === '') {
      log('★ TT: Đã tạo task → chuyển sang đợi nút Mở');
      ttStage = 'waiting_link';
      ttLinkWaitStart = Date.now();
      return handleTaskTrafficWait();
    }

    if (ttTaskCreated) return Promise.resolve();

    var pendLink = S.get('ttPendingLink', '');
    if (pendLink) {
      S.del('ttPendingLink');
      S.set('gtrafficUrl', pendLink); S.set('inFlow', '1'); S.set('childTabOpen', '1');
      ttStage = ''; ttClickAt = 0; ttTaskCreated = true;
      S.set('ttTaskCreated', '1');
      setTimeout(function() {
        try { var w = window.open(pendLink, '_blank'); if (!w) location.href = pendLink; }
        catch (e) { try { location.href = pendLink; } catch (e2) {} }
      }, 800);
      return Promise.resolve();
    }

    if (Date.now() - ttCooldownAt < CFG.ttCooldownMs && ttCooldownAt > 0) return Promise.resolve();

    if (ttStage === '') {
      if (ttClickAt === 0) {
        ttClickAt = Date.now();
        if (IS_TOP && UI && UI.status) UI.status.textContent = '❯ Chuẩn bị click Tạo task... ❮';
        return Promise.resolve();
      }
      if (Date.now() - ttClickAt < CFG.ttClickDelay) {
        var rem = Math.ceil((CFG.ttClickDelay - (Date.now() - ttClickAt)) / 1000);
        if (IS_TOP && UI && UI.status) UI.status.textContent = '❯ Đợi ' + rem + 's rồi tạo task ❮';
        return Promise.resolve();
      }
      var btn = ttFindCreateButton();
      if (!btn) { ttClickAt = 0; return Promise.resolve(); }
      try { btn.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch (e) {}
      log('★ TT: Click Tạo task (chỉ 1 lần)');

      ttTaskCreated = true;
      S.set('ttTaskCreated', '1');
      S.set('ttStage', 'waiting_link');
      S.set('ttLinkWaitStart', Date.now().toString());
      S.set('ttClickAt', Date.now().toString());
      S.set('ttPageUrl', location.href.split('?')[0].split('#')[0]);
      ttStage = 'waiting_link';
      ttLinkWaitStart = Date.now();
      ttClickAt = Date.now();

      setTimeout(function() {
        try {
          btn.click();
          try { btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {}
          try { btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {}
          try { btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {}
          if (IS_TOP && UI && UI.status) UI.status.textContent = '✧ Đã tạo task — tìm nút Mở NV ✧';
          try { showToast('✿ Đã tạo task — đợi nút Mở NV ✿', 2500); } catch (e) {}
        } catch (e) {}
      }, 100);
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  function startChildPoller() {
    if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
    pollChildTimer = setInterval(function() {
      var code = loadCode();
      if (code && isValidCodeShape(code) && !isBlacklistedCode(code)) { clearInterval(pollChildTimer); pollChildTimer = null; try { window.focus(); } catch (e) {} fillAndConfirm(true); }
      if (childTabRef && childTabRef.closed) {
        childTabRef = null; S.set('childTabOpen', '0');
        setTimeout(function() { var c = loadCode(); if (c && isValidCodeShape(c) && !isBlacklistedCode(c)) fillAndConfirm(true); else { S.set('inFlow', '0'); if (UI) UI.status.textContent = '✧ Không lấy được mã ✧'; } }, 1000);
        clearInterval(pollChildTimer); pollChildTimer = null;
      }
    }, 500);
  }
  function autoFillAndStart() {
    if (!IS_TOP || !isGtraffic) return false;
    if (getState() !== STATE.IDLE) return false;
    if (S.get('inFlow') === '1') return false;
    log('AUTO-FILL: ★ BAT DAU ★');
    if (UI && UI.status) UI.status.textContent = '❯ Đang OCR keyword... ❮';
    scanDichvuKeyword().then(function(keyword) {
      if (!keyword) { if (UI && UI.status) UI.status.textContent = '✧ OCR không đọc được ✧'; return; }
      var domain = KEYWORD_MAP.lookup(keyword);
      if (!domain) { if (UI && UI.status) UI.status.textContent = '✧ Keyword: ' + keyword + ' — chưa có domain ✧'; if (UI && UI.kwInput) UI.kwInput.value = keyword; return; }
      var fa = 0, maxFa = 40;
      function tryFill() {
        fa++;
        if (!(UI && UI.domainInput && UI.startBtn)) { if (fa < maxFa) setTimeout(tryFill, 150); return; }
        try { UI.domainInput.value = domain; } catch (e) {}
        try { if (UI.keywordInput) UI.keywordInput.value = keyword; } catch (e) {}
        try { renderDomainList(); } catch (e) {}
        try { DOMAINS.save(domain); } catch (e) {}
        setTimeout(function() { try { if (UI && UI.startBtn) UI.startBtn.click(); } catch (e) {} }, 250);
      }
      tryFill();
    });
    return true;
  }

  function loop() {
    if (loopRunning || stopRequested) return;
    var isSupportedSite = isAutoSite();
    var hasFlow = S.get('inFlow') === '1';
    if (!isSupportedSite && !hasFlow) return;
    loopRunning = true; var i = 0;
    var tick = function() {
      if (stopRequested) { loopRunning = false; return; }
      if (S.get('waitingGetLink') === '1') { loopTimer = setTimeout(tick, 2); return; }
      if (S.get('hardStop') === '1') { loopRunning = false; return; }
      if (finishCalled) { loopRunning = false; return; }
      if (isDichvuTask && DICHVU_LOCK.isLocked()) { loopRunning = false; return; }
      i++; if (i >= 999999) { loopRunning = false; return; }
      var isSupported = isAutoSite();
      var hasFlowNow = S.get('inFlow') === '1';
      if (!isSupported && !hasFlowNow) { loopRunning = false; return; }
      try { watchdog(); } catch (e) {}
      var p; var nd = CFG.poll;
      if (isTaskTrafficNgon) { p = handleTaskTrafficNgon(); nd = CFG.ttPollMs; }
      else if (isGoogle && IS_TOP) { p = handleGoogle(); nd = CFG.googlePoll; }
      else if (isGtraffic && IS_TOP) { p = handleGtraffic(); nd = CFG.poll; }
      else if (isSupported || hasFlowNow) { p = handleTarget(); nd = CFG.targetPoll; }
      else { loopRunning = false; return; }
      p.catch(function(e) { log('Loi: ' + e.message); }).then(function() {
        if (getState() === STATE.DONE && IS_TOP && S.get('waitingGetLink') !== '1') { loopRunning = false; return; }
        if (S.get('hardStop') === '1' && S.get('waitingGetLink') !== '1') { loopRunning = false; return; }
        loopTimer = setTimeout(tick, nd);
      });
    };
    tick();
  }

  // ============================================================
  // ★ KEY COUNTDOWN REALTIME
  // ============================================================
  function startKeyCountdown() {
    if (keyCountdownTimer) { try { clearInterval(keyCountdownTimer); } catch (e) {} keyCountdownTimer = null; }
    var el = document.getElementById('tt-key-time-left');
    if (!el) return;

    function update() {
      var left = KEY_SYSTEM.endDate - Date.now();
      if (left <= 0) {
        el.innerHTML = '⏰ <b>KEY ĐÃ HẾT HẠN</b>';
        el.style.background = 'linear-gradient(135deg,#FFEBEE,#FFCDD2)';
        el.style.borderColor = '#EF5350';
        el.style.color = '#C62828';
        clearInterval(keyCountdownTimer);
        keyCountdownTimer = null;
        setTimeout(function() {
          try { S.del('userKey'); } catch (e) {}
          if (UI && UI.root) UI.root.style.display = 'none';
          if (!document.getElementById('tt-key-modal')) showKeyModal();
        }, 3000);
        return;
      }
      var totalMs = KEY_SYSTEM.endDate - KEY_SYSTEM.startDate;
      var pct = Math.max(0, Math.min(100, (left / totalMs) * 100));
      el.innerHTML = '⏰ Còn lại: <b>' + formatTimeLeft(left) + '</b>';
      if (pct < 10) {
        el.style.background = 'linear-gradient(135deg,#FFEBEE,#FFCDD2)';
        el.style.borderColor = '#EF5350';
        el.style.color = '#C62828';
      } else if (pct < 30) {
        el.style.background = 'linear-gradient(135deg,#FFF3E0,#FFE0B2)';
        el.style.borderColor = '#FF9800';
        el.style.color = '#E65100';
      } else {
        el.style.background = 'linear-gradient(135deg,#E8F5E9,#C8E6C9)';
        el.style.borderColor = '#66BB6A';
        el.style.color = '#2E7D32';
      }
    }

    update();
    keyCountdownTimer = setInterval(update, 1000);
  }

  // ============================================================
  // ★ KEY SUCCESS BANNER
  // ============================================================
  function showKeySuccessBanner(key) {
    if (!IS_TOP || !document.body) return;
    var old = document.getElementById('tt-key-success'); if (old) old.remove();

    var banner = document.createElement('div');
    banner.id = 'tt-key-success';
    banner.innerHTML = [
      '<div class="tt-ks-glow"></div>',
      '<div class="tt-ks-emoji">🎉</div>',
      '<div class="tt-ks-title">✦ KÍCH HOẠT THÀNH CÔNG ✦</div>',
      '<div class="tt-ks-key">🔑 ' + key.toUpperCase() + '</div>',
      '<div class="tt-ks-msg">♛ Chúc bạn dùng tool vui vẻ ♛</div>',
      '<div class="tt-ks-time">⏰ Hết hạn: 23:59 · 11/10/2026</div>'
    ].join('');
    document.body.appendChild(banner);

    setTimeout(function() {
      if (banner && banner.parentNode) {
        banner.classList.add('tt-ks-hide');
        setTimeout(function() { if (banner.parentNode) banner.remove(); }, 500);
      }
    }, 3500);
  }

  // ============================================================
  // ★ WELCOME MODAL — CHECK 2H, KHÔNG CÓ force
  // ============================================================
  function showWelcomeModal() {
    if (!IS_TOP || !document.body) return;
    if (document.getElementById('tt-welcome')) return;

    // ★ Check welcomeOkAt (2h)
    var lastOk = parseInt(S.get('welcomeOkAt', '0'), 10);
    var TWO_HOURS = CFG.welcomeHideMs;
    if (lastOk > 0) {
      var elapsed = Date.now() - lastOk;
      if (elapsed < TWO_HOURS) {
        var left = TWO_HOURS - elapsed;
        log('★ WELCOME: Còn ' + formatTimeLeftShort(left) + ' → bỏ qua (đang ẩn 2h)');
        var savedKey = S.get('userKey', '');
        if (!isKeyValid(savedKey) || !isKeyInDateRange()) {
          setTimeout(showKeyModal, 500);
        }
        return;
      } else {
        log('★ WELCOME: Đã quá 2h → hiện lại');
        try { S.del('welcomeOkAt'); } catch (e) {}
      }
    }

    var box = document.createElement('div');
    box.id = 'tt-welcome';
    box.innerHTML = [
      '<div id="tt-welcome-box">',
      ' <div class="tt-welcome-glow"></div>',
      ' <div class="tt-welcome-decor d1">✨</div>',
      ' <div class="tt-welcome-decor d2">✿</div>',
      ' <div class="tt-welcome-decor d3">♡</div>',
      ' <div class="tt-welcome-decor d4">★</div>',
      ' <div id="tt-welcome-emoji">',
      '  <img src="' + GIF_HELLO_KITTY + '" alt="🐱" />',
      ' </div>',
      ' <div id="tt-welcome-title">XIN CHÀO</div>',
      ' <div id="tt-welcome-subtitle">✦ WELCOME TO TOOL ✦</div>',
      ' <div id="tt-welcome-text">',
      '  <span class="line">Xin Chào Mọi Người Đã Sài Thử Tool Gtraffic Của</span>',
      '  <span class="highlight">♛ THANH TUẤN DZAI ♛</span>',
      '  <span class="line">Tool Này Sẽ Hỗ Trợ Mọi Người Auto Làm Nhiệm Vụ</span>',
      ' </div>',
      ' <div id="tt-welcome-btns">',
      '  <button id="tt-welcome-ok">✓ OK · TẮT 2H</button>',
      '  <button id="tt-welcome-close">✕ ĐÓNG</button>',
      ' </div>',
      ' <div id="tt-welcome-timer">💡 Nhấn OK để ẩn 2 tiếng · Nhấn ĐÓNG để ẩn tạm thời</div>',
      '</div>'
    ].join('');
    document.body.appendChild(box);

    var okBtn = document.getElementById('tt-welcome-ok');
    if (okBtn) okBtn.onclick = function() {
      log('★ WELCOME: Bấm OK — tắt 2 tiếng');
      try { S.set('welcomeOkAt', Date.now().toString()); } catch (e) {}
      var el = document.getElementById('tt-welcome');
      if (el) el.remove();
      showToast('♛ Đã tắt 2 tiếng — hẹn gặp lại ♛', 2500);
      setTimeout(showKeyModal, 400);
    };

    var closeBtn = document.getElementById('tt-welcome-close');
    if (closeBtn) closeBtn.onclick = function() {
      log('★ WELCOME: Bấm ĐÓNG — không lưu');
      var el = document.getElementById('tt-welcome');
      if (el) el.remove();
      setTimeout(showKeyModal, 400);
    };
  }

  // ============================================================
  // ★ KEY MODAL
  // ============================================================
  function showKeyModal() {
    if (!IS_TOP || !document.body) return;
    if (document.getElementById('tt-key-modal')) return;

    var savedKey = S.get('userKey', '');
    var keyStatus = getKeyStatus(savedKey);

    if (keyStatus.status === 'active') {
      log('★ KEY: Đang active — bỏ qua');
      return;
    }

    if (keyStatus.status === 'expired' || keyStatus.status === 'locked') {
      log('★ KEY: ' + keyStatus.status + ' → xóa key cũ');
      try { S.del('userKey'); } catch (e) {}
      try { S.del('userKeyAt'); } catch (e) {}
    }

    var bannerHtml = '';
    if (keyStatus.status === 'expired') {
      bannerHtml = [
        '<div id="tt-key-banner" class="expired">',
        ' <div class="tt-banner-icon">⏰</div>',
        ' <div class="tt-banner-title">🔒 KEY ĐÃ HẾT HẠN</div>',
        ' <div class="tt-banner-sub">Key của bạn đã hết hạn sử dụng</div>',
        ' <div class="tt-banner-action">',
        '  👉 Mua key mới: IB Telegram ',
        '  <a href="' + KEY_SYSTEM.adminUrl + '" target="_blank">' + KEY_SYSTEM.adminTelegram + '</a>',
        ' </div>',
        '</div>'
      ].join('');
    } else if (keyStatus.status === 'locked') {
      bannerHtml = [
        '<div id="tt-key-banner" class="locked">',
        ' <div class="tt-banner-icon">🚫</div>',
        ' <div class="tt-banner-title">⚠️ KEY BỊ KHÓA</div>',
        ' <div class="tt-banner-sub">Key của bạn đã bị admin khóa</div>',
        ' <div class="tt-banner-action">',
        '  👉 IB admin để kích hoạt lại: ',
        '  <a href="' + KEY_SYSTEM.adminUrl + '" target="_blank">' + KEY_SYSTEM.adminTelegram + '</a>',
        ' </div>',
        '</div>'
      ].join('');
    } else if (keyStatus.status === 'not-yet') {
      bannerHtml = [
        '<div id="tt-key-banner" class="notyet">',
        ' <div class="tt-banner-icon">⏳</div>',
        ' <div class="tt-banner-title">KEY CHƯA KÍCH HOẠT</div>',
        ' <div class="tt-banner-sub">Key sẽ có hiệu lực từ 0:00 10/10/2026</div>',
        '</div>'
      ].join('');
    } else if (savedKey && keyStatus.status === 'invalid') {
      bannerHtml = [
        '<div id="tt-key-banner" class="invalid">',
        ' <div class="tt-banner-icon">❌</div>',
        ' <div class="tt-banner-title">KEY KHÔNG HỢP LỆ</div>',
        ' <div class="tt-banner-sub">Key bạn nhập không tồn tại hoặc đã bị xóa</div>',
        '</div>'
      ].join('');
    }

    var box = document.createElement('div');
    box.id = 'tt-key-modal';
    box.innerHTML = [
      '<div id="tt-key-box">',
      ' <div class="tt-key-glow"></div>',
      ' <div class="tt-key-decor k1">✦</div>',
      ' <div class="tt-key-decor k2">✧</div>',
      ' <div class="tt-key-decor k3">❋</div>',
      ' <div class="tt-key-decor k4">✺</div>',
      ' <div id="tt-key-emoji">',
      '  <img src="' + GIF_LOGO_HK + '" alt="🔑" />',
      ' </div>',
      ' <div id="tt-key-title">✦ NHẬP KEY ✦</div>',
      ' <div id="tt-key-sub">Key Trial 1 Ngày · 0:00 10/10 → 23:59 11/10/2026</div>',
      bannerHtml,
      ' <div id="tt-key-input-wrap">',
      '  <span class="tt-key-input-icon">🔑</span>',
      '  <input id="tt-key-input" type="text" placeholder="Nhập key tại đây..." autocomplete="off" />',
      ' </div>',
      ' <button id="tt-key-submit">⚡ XÁC NHẬN</button>',
      ' <div id="tt-key-error"></div>',
      ' <div id="tt-key-hint">📲 Tham gia Telegram: <b>t.me/hafvanthinhmod</b></div>',
      ' <div id="tt-key-contact">',
      '  📞 Liên hệ admin: ',
      '  <a href="' + KEY_SYSTEM.adminUrl + '" target="_blank">' + KEY_SYSTEM.adminTelegram + '</a>',
      ' </div>',
      ' <div id="tt-key-telegram">',
      '  <div>♛ KÍCH HOẠT THÀNH CÔNG ♛</div>',
      '  <div style="margin-top:6px;font-size:11px">Tham gia Group Telegram để sử dụng tool</div>',
      '  <a href="' + KEY_SYSTEM.telegram + '" target="_blank">📲 THAM GIA TELEGRAM</a>',
      '  <div id="tt-key-countdown"></div>',
      ' </div>',
      '</div>'
    ].join('');
    document.body.appendChild(box);

    var input = document.getElementById('tt-key-input');
    var submitBtn = document.getElementById('tt-key-submit');
    var errorEl = document.getElementById('tt-key-error');
    var tgEl = document.getElementById('tt-key-telegram');
    var cdEl = document.getElementById('tt-key-countdown');

    function trySubmit() {
      var k = (input.value || '').trim();
      if (!k) {
        errorEl.textContent = '✗ Vui lòng nhập key';
        errorEl.style.color = '#C62828';
        return;
      }

      if (!isKeyValid(k)) {
        errorEl.style.color = '#C62828';
        errorEl.textContent = '✗ Key không đúng. Thử lại!';
        input.value = '';
        input.focus();
        log('★ KEY: Sai — ' + k);
        return;
      }

      if (isKeyLocked(k)) {
        errorEl.style.color = '#C62828';
        errorEl.innerHTML = [
          '🚫 <b>KEY CỦA BẠN ĐÃ BỊ KHÓA</b><br>',
          '<span style="font-size:10px">IB admin để kích hoạt lại: <b>' + KEY_SYSTEM.adminTelegram + '</b></span>'
        ].join('');
        input.value = '';
        input.focus();
        log('★ KEY: Bị khóa — ' + k);
        try { showToast('🚫 Key của bạn đã bị khóa!', 4000); } catch (e) {}
        return;
      }

      if (!isKeyInDateRange()) {
        var now = Date.now();
        errorEl.style.color = '#C62828';
        if (now > KEY_SYSTEM.endDate) {
          errorEl.innerHTML = [
            '⏰ <b>KEY CỦA BẠN ĐÃ HẾT HẠN</b><br>',
            '<span style="font-size:10px">Mua key mới: IB Telegram <b>' + KEY_SYSTEM.adminTelegram + '</b></span>'
          ].join('');
          try { showToast('⏰ Key hết hạn! Mua key mới IB admin', 4000); } catch (e) {}
        } else {
          errorEl.innerHTML = '⏳ Key sẽ có hiệu lực từ 0:00 10/10/2026';
          try { showToast('⏳ Key chưa tới ngày kích hoạt', 3000); } catch (e) {}
        }
        input.value = '';
        input.focus();
        return;
      }

      errorEl.style.color = '#2E7D32';
      errorEl.textContent = '✓ Key hợp lệ! Đang kích hoạt...';
      log('★ KEY: Hợp lệ → kích hoạt');

      try {
        S.set('userKey', k.toUpperCase());
        S.set('userKeyAt', Date.now().toString());
      } catch (e) {}

      // ★ THÔNG BÁO KEY THÀNH CÔNG
      log('★ KEY: KÍCH HOẠT THÀNH CÔNG — ' + k);
      try { showGifOverlay(2500, GIF_KITTY_HEART); } catch (e) {}
      try { showToast('♛ KÍCH HOẠT KEY THÀNH CÔNG ♛', 3500); } catch (e) {}
      try { showKeySuccessBanner(k); } catch (e) {}

      if (input) input.style.display = 'none';
      if (submitBtn) submitBtn.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      if (tgEl) tgEl.classList.add('show');

      if (cdEl) {
        cdEl.textContent = '⏰ Còn lại: ' + formatTimeLeft(KEY_SYSTEM.endDate - Date.now());
        var cdTimer = setInterval(function() {
          var left = KEY_SYSTEM.endDate - Date.now();
          if (left <= 0) {
            clearInterval(cdTimer);
            if (cdEl) cdEl.textContent = '⏰ KEY ĐÃ HẾT HẠN';
            setTimeout(function() {
              try { S.del('userKey'); } catch (e) {}
              var el = document.getElementById('tt-key-modal');
              if (el) el.remove();
              if (UI && UI.root) UI.root.style.display = 'none';
              showKeyModal();
            }, 5000);
            return;
          }
          if (cdEl) cdEl.textContent = '⏰ Còn lại: ' + formatTimeLeft(left);
        }, 1000);
      }

      setTimeout(function() {
        try { showToast('♛ Đang chuyển Telegram... ♛', 2000); } catch (e) {}
        try { window.open(KEY_SYSTEM.telegram, '_blank'); } catch (e) {
          try { location.href = KEY_SYSTEM.telegram; } catch (e2) {}
        }
      }, 2000);

      setTimeout(function() {
        var el = document.getElementById('tt-key-modal');
        if (el) el.remove();
        showToast('♛ Kích hoạt thành công ♛', 3000);
        if (UI && UI.root) UI.root.style.display = '';
        setTimeout(function() { startKeyCountdown(); }, 200);
      }, 5000);
    }

    submitBtn.onclick = trySubmit;
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') trySubmit();
    });
    setTimeout(function() { try { input.focus(); } catch (e) {} }, 300);
  }

  // ============================================================
  // ★ UI CSS
  // ============================================================
  function buildCSS() {
    return [
      '@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;900&family=Nunito:wght@700;900&display=swap");',
      '@keyframes ttKittyFloat{0%,100%{transform:translateY(0) rotate(-3deg) scale(1)}50%{transform:translateY(-5px) rotate(3deg) scale(1.08)}}',
      '@keyframes ttKittyDance{0%,100%{transform:translateY(0) rotate(-6deg) scale(1)}25%{transform:translateY(-6px) rotate(4deg) scale(1.08)}50%{transform:translateY(0) rotate(6deg) scale(1)}75%{transform:translateY(-6px) rotate(-4deg) scale(1.08)}}',
      '@keyframes ttKittyPulse{0%,100%{box-shadow:0 0 0 0 rgba(233,30,99,.5)}50%{box-shadow:0 0 0 10px rgba(233,30,99,0)}}',
      '@keyframes ttKittyGlow{0%,100%{text-shadow:0 0 8px rgba(255,255,255,.5),0 1px 2px rgba(0,0,0,.3)}50%{text-shadow:0 0 14px rgba(255,255,255,.9),0 0 20px rgba(255,20,147,.6),0 1px 2px rgba(0,0,0,.3)}}',
      '@keyframes ttKittySparkle{0%,100%{opacity:.4;transform:scale(.8) rotate(0)}50%{opacity:1;transform:scale(1.2) rotate(180deg)}}',
      '@keyframes ttGifPop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}',
      '@keyframes ttMenuSlideIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}',
      '@keyframes ttTimerShine{0%{background-position:-200% 0}100%{background-position:200% 0}}',
      '@keyframes ttTimerPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,20,147,.4)}50%{transform:scale(1.02);box-shadow:0 0 0 10px rgba(255,20,147,0)}}',
      '@keyframes ttHeaderFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
      '@keyframes ttSectionFadeIn{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}',
      '@keyframes ttSpin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}',
      '@keyframes ttPulseBg{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.9;transform:scale(1.05)}}',
      '@keyframes ttWelcomeIn{0%{transform:scale(.5) translateY(30px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}',
      '@keyframes ttKeySuccessIn{0%{transform:translate(-50%,-50%) scale(.3) rotate(-10deg);opacity:0}60%{transform:translate(-50%,-50%) scale(1.08) rotate(3deg);opacity:1}100%{transform:translate(-50%,-50%) scale(1) rotate(0);opacity:1}}',
      '@keyframes ttKeySuccessOut{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(.6);opacity:0}}',

      '#tt-root{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;width:360px;max-width:calc(100vw - 16px);font-family:"Quicksand","Nunito","Comic Sans MS","Segoe UI",Arial,sans-serif;font-size:10px;color:#AD1457;background:linear-gradient(165deg,#FFF0F5 0%,#FCE4EC 45%,#F8BBD0 100%);border-radius:20px;user-select:none;max-height:88vh;overflow:visible;display:flex;flex-direction:column;box-shadow:0 6px 22px rgba(233,30,99,.35),0 0 0 2px rgba(255,255,255,.9) inset;border:2.5px solid #F48FB1}',
      '#tt-root *{box-sizing:border-box}',
      '#tt-root.tt-min{width:64px !important;max-width:64px !important;border-radius:50% !important;top:8px;left:auto;right:8px;transform:none;padding:0;background:radial-gradient(circle at 30% 30%,#FFD9E8,#FF69B4 70%);border:3px solid #FFF;animation:ttKittyPulse 2s infinite;overflow:hidden}',
      '#tt-root.tt-min .tt-head{padding:12px 0;text-align:center;border-radius:50%;background:transparent;border:none}',
      '#tt-root.tt-min .tt-brand-txt,#tt-root.tt-min .tt-body,#tt-root.tt-min .tt-foot,#tt-root.tt-min .tt-head-actions{display:none}',
      '#tt-root.tt-min .tt-rose{font-size:0 !important;width:52px;height:52px;display:block;background-image:url("' + GIF_KITTY_DANCE + '");background-size:contain;background-repeat:no-repeat;background-position:center;border-radius:50%}',

      '.tt-head{padding:12px 14px;background:linear-gradient(135deg,#E91E63 0%,#D81B60 25%,#F48FB1 50%,#D81B60 75%,#E91E63 100%);background-size:200% 200%;border-radius:17px 17px 0 0;position:relative;overflow:hidden;animation:ttHeaderFlow 5s ease-in-out infinite}',
      '.tt-head::before{content:"✨";position:absolute;top:8px;left:50%;font-size:12px;animation:ttKittySparkle 2s infinite;color:#FFF}',
      '.tt-head::after{content:"✿";position:absolute;bottom:4px;right:20px;font-size:12px;animation:ttKittySparkle 2.5s infinite .3s;color:#FFF}',
      '.tt-brand{display:flex;align-items:center;gap:11px;position:relative;z-index:1}',
      '.tt-rose{width:52px;height:52px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%,#FFE4F0,#F48FB1 80%);border-radius:50%;animation:ttKittyDance 0.6s ease-in-out infinite;filter:drop-shadow(0 4px 10px rgba(233,30,99,.7));position:relative;overflow:hidden;border:2.5px solid #FFF;box-shadow:0 0 12px rgba(255,20,147,.4)}',
      '.tt-rose img{width:100%;height:100%;object-fit:contain;position:absolute;z-index:2;border-radius:50%}',
      '.tt-title-main{font-family:"Quicksand",sans-serif;font-size:13px;font-weight:900;color:#FFF;letter-spacing:1.5px;line-height:1.15;animation:ttKittyGlow 2s ease-in-out infinite}',
      '.tt-title-sub{font-family:"Quicksand",sans-serif;font-size:7.5px;letter-spacing:2px;font-weight:800;margin-top:2px;color:#FCE4EC;text-transform:uppercase;text-shadow:0 1px 1px rgba(0,0,0,.15)}',
      '.tt-head-actions{position:absolute;top:8px;right:8px;display:flex;gap:5px;z-index:12}',
      '.tt-icon-btn{width:20px;height:20px;border-radius:50%;border:1.8px solid rgba(255,255,255,.75);background:rgba(255,255,255,.25);color:#FFF;font-size:11px;font-weight:900;line-height:1;padding:0;cursor:pointer;transition:all .2s}',
      '.tt-icon-btn:hover{background:rgba(255,255,255,.5);transform:scale(1.1) rotate(90deg)}',

      '.tt-body{padding:9px;overflow-y:auto;flex:1;display:grid;grid-template-columns:1fr 1fr;gap:7px;background:transparent;-webkit-overflow-scrolling:touch}',
      '.tt-body::-webkit-scrollbar{width:5px}',
      '.tt-body::-webkit-scrollbar-thumb{background:linear-gradient(#F48FB1,#E91E63);border-radius:3px}',
      '.tt-body .tt-full{grid-column:1/-1}',
      '.tt-status{grid-column:1/-1;background:#FFFFFF;border-radius:12px;padding:8px 13px;border-left:5px solid #E91E63;font-family:"Quicksand",sans-serif;font-size:10.5px;font-weight:800;color:#AD1457;text-align:center;letter-spacing:.5px;box-shadow:0 2px 6px rgba(233,30,99,.15);position:relative;overflow:hidden;animation:ttSectionFadeIn .4s ease-out}',
      '.tt-status::after{content:"";position:absolute;top:0;left:-200%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(244,143,177,.5),transparent);animation:ttTimerShine 3s infinite}',
      '.tt-key-time{grid-column:1/-1;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);border:2px solid #66BB6A;border-radius:12px;padding:8px 12px;text-align:center;font-family:"Quicksand",sans-serif;font-size:11px;font-weight:900;color:#2E7D32;letter-spacing:.5px;box-shadow:0 2px 8px rgba(76,175,80,.2);animation:ttSectionFadeIn .4s ease-out;transition:all .3s}',
      '.tt-section{background:rgba(255,255,255,.96);border-radius:13px;padding:8px;border:1.5px solid #F8BBD0;box-shadow:0 2px 6px rgba(233,30,99,.1);animation:ttSectionFadeIn .5s ease-out}',
      '.tt-section-title{font-family:"Quicksand",sans-serif;font-size:9px;font-weight:900;letter-spacing:1px;margin-bottom:6px;color:#D81B60;text-transform:uppercase;display:flex;align-items:center;gap:5px}',
      '.tt-section-title .r{font-size:12px;animation:ttKittyFloat 2s infinite}',
      '.tt-input{padding:8px 10px;border:2px solid #F8BBD0;border-radius:10px;font-family:"Quicksand",inherit;font-size:10px;color:#AD1457;background:#FFF;outline:none;width:100%;transition:all .2s}',
      '.tt-input::placeholder{color:#F48FB1;font-style:italic}',
      '.tt-input:focus{border-color:#E91E63;box-shadow:0 0 0 3px rgba(233,30,99,.18);background:#FFF0F5}',
      '.tt-row{display:flex;gap:6px;align-items:center}',
      '.tt-btn{padding:8px 11px;border:none;border-radius:10px;font-family:"Quicksand",sans-serif;font-weight:900;font-size:9.5px;cursor:pointer;color:#FFF;background:linear-gradient(135deg,#F48FB1,#E91E63);white-space:nowrap;flex-shrink:0;text-transform:uppercase;letter-spacing:.4px;box-shadow:0 3px 8px rgba(233,30,99,.3);transition:all .15s}',
      '.tt-btn:hover{transform:translateY(-1px);box-shadow:0 5px 12px rgba(233,30,99,.4)}',
      '.tt-btn:active{transform:scale(.96)}',
      '.tt-btn.gray{background:linear-gradient(135deg,#CE93D8,#8E24AA)}',
      '.tt-btn.gold{background:linear-gradient(135deg,#FF80AB,#EC407A)}',
      '.tt-btn.blue{background:linear-gradient(135deg,#F06292,#D81B60)}',
      '.tt-domain-list{max-height:60px;overflow-y:auto;margin-top:6px;border-radius:10px;background:rgba(255,240,245,.7);padding:5px;border:1.5px dashed #F48FB1}',
      '.tt-domain-list::-webkit-scrollbar{width:4px}',
      '.tt-domain-list::-webkit-scrollbar-thumb{background:linear-gradient(#F48FB1,#E91E63);border-radius:2px}',
      '.tt-domain-item{display:flex;align-items:center;justify-content:space-between;padding:5px 7px;border-radius:7px;font-size:8.5px;margin-bottom:3px;background:#FFF;border-left:4px solid #F48FB1;box-shadow:0 1px 3px rgba(233,30,99,.08);animation:ttMenuSlideIn .3s ease-out}',
      '.tt-domain-item .d-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700;color:#AD1457}',
      '.tt-domain-item .d-use{padding:3px 7px;border-radius:6px;background:linear-gradient(135deg,#F48FB1,#E91E63);color:#FFF;font-size:7px;font-weight:900;border:none;margin-left:3px;cursor:pointer}',
      '.tt-domain-item .d-del{padding:3px 7px;border-radius:6px;background:linear-gradient(135deg,#EF5350,#C62828);color:#FFF;font-size:8.5px;font-weight:900;border:none;margin-left:2px;cursor:pointer}',
      '.tt-empty{text-align:center;color:#F48FB1;font-size:8px;padding:6px;font-style:italic}',

      '.tt-timer{display:none;grid-column:1/-1;padding:14px 16px;background:radial-gradient(circle at 50% 50%,#FFF 0%,#FFF0F5 60%,#FCE4EC 100%);border-radius:20px;border:3px solid transparent;align-items:center;justify-content:center;gap:16px;position:relative;box-shadow:0 4px 16px rgba(233,30,99,.25),0 0 0 2px rgba(255,255,255,.9) inset;overflow:hidden}',
      '.tt-timer.show{display:flex;animation:ttTimerPulse 2s ease-in-out infinite}',
      '.tt-timer::before{content:"";position:absolute;inset:-3px;border-radius:22px;background:conic-gradient(from 0deg,#F48FB1,#E91E63,#FF80AB,#F48FB1,#E91E63);z-index:-1;animation:ttSpin 4s linear infinite}',
      '.tt-timer::after{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,20,147,.15) 0%,transparent 60%);animation:ttPulseBg 2s ease-in-out infinite;pointer-events:none}',
      '.tt-kitty-emoji{width:68px;height:68px;flex-shrink:0;font-size:52px;line-height:68px;text-align:center;animation:ttKittyDance 0.5s ease-in-out infinite;background:radial-gradient(circle at 30% 30%,#FFE4F0,#F48FB1 60%,#E91E63);border-radius:50%;border:4px solid #FFF;box-shadow:0 0 20px rgba(255,20,147,.6),0 6px 16px rgba(233,30,99,.5);position:relative;z-index:2}',
      '.tt-timer-wrap{position:relative;width:70px;height:70px;flex-shrink:0;z-index:2}',
      '.tt-timer-wrap svg{width:100%;height:100%;transform:rotate(-90deg);filter:drop-shadow(0 0 8px rgba(255,20,147,.5))}',
      '.tt-timer-track{fill:none;stroke:rgba(252,228,236,.8);stroke-width:6}',
      '.tt-timer-prog{fill:none;stroke:url(#ttTimerGrad);stroke-width:6;stroke-linecap:round;stroke-dasharray:163.4;stroke-dashoffset:0;transition:stroke-dashoffset .5s ease}',
      '.tt-timer-num{font-family:"Quicksand","Nunito",sans-serif;position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#E91E63;text-shadow:0 2px 6px rgba(255,255,255,.9),0 0 12px rgba(255,20,147,.6);letter-spacing:-1px}',
      '.tt-timer-cap{font-family:"Quicksand","Nunito",sans-serif;font-size:11px;font-weight:900;color:#D81B60;line-height:1.5;text-align:left;flex:1;z-index:2;text-transform:uppercase;letter-spacing:.8px;text-shadow:0 1px 3px rgba(255,255,255,.8)}',

      '.tt-guide{display:none;grid-column:1/-1;background:linear-gradient(135deg,rgba(255,240,245,.95),rgba(252,228,236,.95));border:2px solid #F8BBD0;border-radius:12px;padding:8px 11px;text-align:center;font-size:9px;color:#AD1457;line-height:1.45;animation:ttSectionFadeIn .4s ease-out}',
      '.tt-guide.show{display:block}',
      '.tt-guide b{color:#E91E63;font-weight:900}',
      '.tt-code{display:none;grid-column:1/-1;background:linear-gradient(135deg,#FFF,#FFF0F5);border:2.5px dashed #F48FB1;border-radius:14px;padding:10px 11px}',
      '.tt-code.show{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}',
      '.tt-code-label{font-family:"Quicksand",sans-serif;font-size:8px;font-weight:900;letter-spacing:1.8px;color:#D81B60;text-transform:uppercase;text-align:center}',
      '.tt-code-label .r{display:block;font-size:15px;color:#E91E63;margin-bottom:3px;animation:ttKittyFloat 1.5s infinite}',
      '.tt-code-right{display:flex;flex-direction:column;gap:5px}',
      '.tt-code-value{font-family:"Courier New",monospace;font-size:16px;font-weight:900;color:#AD1457;letter-spacing:3.5px;padding:8px 11px;background:linear-gradient(135deg,#FFF0F5,#FCE4EC);border-radius:9px;word-break:break-all;user-select:text;border:2px solid #F48FB1;text-align:center}',
      '.tt-foot{display:flex;justify-content:center;align-items:center;gap:6px;padding:7px;color:#FFF;font-family:"Quicksand",sans-serif;font-size:8px;font-weight:800;letter-spacing:1.3px;background:linear-gradient(135deg,#E91E63,#F48FB1);border-radius:0 0 17px 17px}',
      '.tt-foot .r{color:#FFF;font-size:12px;animation:ttKittyFloat 1.6s infinite}',
      '.tt-foot .w{color:#FFF;font-size:9px;letter-spacing:2px}',
      '.tt-foot .vn{color:#FFF;font-size:10px;letter-spacing:1.5px}',
      '.tt-hint{font-size:7.5px;color:#F06292;font-style:italic;margin-top:4px;display:block;line-height:1.3}',

      '#tt-fab{position:fixed;bottom:16px;right:16px;z-index:2147483647;width:64px;height:64px;border-radius:50%;cursor:pointer;color:#FFF;display:flex;align-items:center;justify-content:center;font-size:0;background:radial-gradient(circle at 30% 30%,#FFD9E8,#FF69B4 70%);border:3px solid #FFF;box-shadow:0 6px 18px rgba(233,30,99,.55);animation:ttKittyPulse 2s infinite;overflow:hidden;padding:0}',
      '#tt-fab .tt-fab-emoji{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:44px;line-height:1;animation:ttKittyDance 0.6s ease-in-out infinite}',
      '#tt-toast{position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#E91E63,#F48FB1);color:#FFF;padding:10px 20px;border-radius:22px;font-family:"Quicksand","Comic Sans MS","Segoe UI",Arial,sans-serif;font-size:11px;font-weight:800;z-index:2147483647;border:2.5px solid #FFF;pointer-events:none;letter-spacing:.6px;max-width:calc(100vw - 32px);text-align:center;box-shadow:0 6px 20px rgba(233,30,99,.5)}',
      '#tt-gif-overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(233,30,99,.4);display:flex;align-items:center;justify-content:center;pointer-events:none;backdrop-filter:blur(3px)}',
      '#tt-gif-overlay img{max-width:70vw;max-height:70vh;border-radius:20px;box-shadow:0 0 60px rgba(244,143,177,.9);animation:ttGifPop .5s ease-out}',

      '#tt-welcome{position:fixed;inset:0;z-index:2147483647;background:radial-gradient(circle at 50% 50%,rgba(233,30,99,.55),rgba(15,23,42,.92));backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Quicksand","Nunito",sans-serif}',
      '#tt-welcome-box{max-width:440px;width:100%;background:linear-gradient(165deg,#FFFFFF 0%,#FFF5F8 20%,#FCE4EC 50%,#F8BBD0 80%,#F48FB1 100%);border-radius:28px;padding:34px 28px 28px 28px;box-shadow:0 25px 70px rgba(233,30,99,.6),0 0 0 4px rgba(255,255,255,.95) inset,0 0 60px rgba(255,20,147,.4);border:3px solid #FFF;animation:ttWelcomeIn .55s cubic-bezier(.34,1.56,.64,1);text-align:center;position:relative;overflow:visible}',
      '#tt-welcome-box::after{content:"";position:absolute;top:-10px;left:-10px;right:-10px;bottom:-10px;border-radius:34px;background:conic-gradient(from 0deg,#FF80AB,#E91E63,#FF1493,#D81B60,#FF80AB);z-index:-1;animation:ttSpin 6s linear infinite;filter:blur(5px);opacity:.85}',
      '#tt-welcome-glow{position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,20,147,.25) 0%,transparent 55%);animation:ttPulseBg 3s ease-in-out infinite;pointer-events:none;border-radius:50%;z-index:0}',
      '#tt-welcome-emoji{position:relative;z-index:2;margin-bottom:14px;display:inline-block}',
      '#tt-welcome-emoji img{width:110px;height:110px;object-fit:contain;border-radius:50%;border:4px solid #FFF;box-shadow:0 8px 24px rgba(233,30,99,.55),0 0 30px rgba(255,20,147,.6);animation:ttKittyDance .8s ease-in-out infinite;background:linear-gradient(135deg,#FFE4F0,#F48FB1)}',
      '#tt-welcome-title{font-family:"Quicksand",sans-serif;font-size:30px;font-weight:900;color:#E91E63;margin-bottom:4px;letter-spacing:2px;animation:ttKittyGlow 2s ease-in-out infinite;text-shadow:0 0 18px rgba(255,255,255,.95),0 3px 6px rgba(233,30,99,.35);position:relative;z-index:2}',
      '#tt-welcome-subtitle{font-size:11px;font-weight:900;letter-spacing:4px;color:#D81B60;margin-bottom:18px;opacity:.85;position:relative;z-index:2}',
      '#tt-welcome-text{font-size:14px;line-height:1.8;color:#AD1457;font-weight:700;margin-bottom:24px;padding:20px 18px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(255,240,245,.95));border-radius:18px;border:2.5px dashed #F48FB1;position:relative;z-index:2;box-shadow:0 6px 18px rgba(233,30,99,.15) inset}',
      '#tt-welcome-text .highlight{display:block;font-size:18px;color:#D81B60;margin:12px 0;font-weight:900;text-shadow:0 2px 8px rgba(255,255,255,.95);animation:ttKittyFloat 2.5s ease-in-out infinite;letter-spacing:.5px}',
      '#tt-welcome-text .line{display:block;margin:5px 0}',
      '#tt-welcome-btns{display:flex;gap:14px;justify-content:center;position:relative;z-index:2}',
      '#tt-welcome-ok{flex:1;padding:16px 22px;border:none;border-radius:16px;background:linear-gradient(135deg,#66BB6A,#43A047,#2E7D32);color:#FFF;font-family:"Quicksand",sans-serif;font-size:14px;font-weight:900;cursor:pointer;letter-spacing:1px;box-shadow:0 8px 22px rgba(76,175,80,.55),0 0 0 2px rgba(255,255,255,.7) inset;transition:all .25s;text-transform:uppercase;position:relative;overflow:hidden}',
      '#tt-welcome-ok::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);transition:left .5s}',
      '#tt-welcome-ok:hover::before{left:100%}',
      '#tt-welcome-ok:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 32px rgba(76,175,80,.7),0 0 0 2px rgba(255,255,255,.9) inset}',
      '#tt-welcome-ok:active{transform:scale(.96)}',
      '#tt-welcome-close{flex:1;padding:16px 22px;border:none;border-radius:16px;background:linear-gradient(135deg,#F48FB1,#E91E63,#C2185B);color:#FFF;font-family:"Quicksand",sans-serif;font-size:14px;font-weight:900;cursor:pointer;letter-spacing:1px;box-shadow:0 8px 22px rgba(233,30,99,.55),0 0 0 2px rgba(255,255,255,.7) inset;transition:all .25s;text-transform:uppercase;position:relative;overflow:hidden}',
      '#tt-welcome-close::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);transition:left .5s}',
      '#tt-welcome-close:hover::before{left:100%}',
      '#tt-welcome-close:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 32px rgba(233,30,99,.7),0 0 0 2px rgba(255,255,255,.9) inset}',
      '#tt-welcome-close:active{transform:scale(.96)}',
      '#tt-welcome-timer{font-size:11px;color:#D81B60;margin-top:16px;font-weight:800;font-style:italic;position:relative;z-index:2;padding:10px 14px;background:rgba(255,255,255,.75);border-radius:12px;border:1.5px solid rgba(244,143,177,.7);display:inline-block}',
      '.tt-welcome-decor{position:absolute;font-size:26px;animation:ttKittySparkle 2s infinite;pointer-events:none;z-index:3;filter:drop-shadow(0 2px 6px rgba(233,30,99,.4))}',
      '.tt-welcome-decor.d1{top:22px;left:22px;animation-delay:0s;color:#FFD700}',
      '.tt-welcome-decor.d2{top:22px;right:22px;animation-delay:.3s;color:#FF80AB}',
      '.tt-welcome-decor.d3{bottom:22px;left:22px;animation-delay:.6s;color:#FF1493}',
      '.tt-welcome-decor.d4{bottom:22px;right:22px;animation-delay:.9s;color:#E91E63}',

      '#tt-key-modal{position:fixed;inset:0;z-index:2147483647;background:radial-gradient(circle at 50% 50%,rgba(233,30,99,.5),rgba(15,23,42,.92));backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Quicksand","Nunito",sans-serif}',
      '#tt-key-box{max-width:410px;width:100%;background:linear-gradient(165deg,#FFFFFF 0%,#FFF5F8 20%,#FCE4EC 50%,#F8BBD0 80%,#F48FB1 100%);border-radius:26px;padding:28px 24px;box-shadow:0 25px 70px rgba(233,30,99,.6),0 0 0 4px rgba(255,255,255,.95) inset,0 0 60px rgba(255,20,147,.4);border:3px solid #FFF;animation:ttWelcomeIn .55s cubic-bezier(.34,1.56,.64,1);text-align:center;position:relative;overflow:hidden}',
      '#tt-key-box::after{content:"";position:absolute;top:-10px;left:-10px;right:-10px;bottom:-10px;border-radius:32px;background:conic-gradient(from 90deg,#FF80AB,#E91E63,#FF1493,#D81B60,#FF80AB);z-index:-1;animation:ttSpin 6s linear infinite;filter:blur(5px);opacity:.85}',
      '#tt-key-glow{position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,20,147,.2) 0%,transparent 55%);animation:ttPulseBg 3s ease-in-out infinite;pointer-events:none;border-radius:50%;z-index:0}',
      '#tt-key-emoji{position:relative;z-index:2;margin-bottom:10px;display:inline-block}',
      '#tt-key-emoji img{width:80px;height:80px;object-fit:contain;border-radius:50%;border:3px solid #FFF;box-shadow:0 6px 18px rgba(233,30,99,.5),0 0 24px rgba(255,20,147,.55);animation:ttKittyDance .9s ease-in-out infinite;background:linear-gradient(135deg,#FFE4F0,#F48FB1)}',
      '#tt-key-title{font-family:"Quicksand",sans-serif;font-size:22px;font-weight:900;color:#E91E63;margin-bottom:4px;letter-spacing:1.5px;text-shadow:0 0 12px rgba(255,255,255,.9);position:relative;z-index:2}',
      '#tt-key-sub{font-size:11px;color:#AD1457;font-weight:700;margin-bottom:16px;font-style:italic;position:relative;z-index:2}',
      '#tt-key-banner{margin-bottom:14px;padding:14px 12px;border-radius:14px;text-align:center;position:relative;z-index:2;animation:ttSectionFadeIn .5s ease-out;box-shadow:0 4px 12px rgba(0,0,0,.1)}',
      '#tt-key-banner.expired{background:linear-gradient(135deg,#FFEBEE,#FFCDD2);border:2px solid #EF5350;color:#C62828}',
      '#tt-key-banner.locked{background:linear-gradient(135deg,#FFF3E0,#FFE0B2);border:2px solid #F57C00;color:#E65100}',
      '#tt-key-banner.notyet{background:linear-gradient(135deg,#E3F2FD,#BBDEFB);border:2px solid #42A5F5;color:#1565C0}',
      '#tt-key-banner.invalid{background:linear-gradient(135deg,#F3E5F5,#E1BEE7);border:2px solid #AB47BC;color:#6A1B9A}',
      '#tt-key-banner .tt-banner-icon{font-size:34px;margin-bottom:4px;animation:ttKittyFloat 2s infinite}',
      '#tt-key-banner .tt-banner-title{font-family:"Quicksand",sans-serif;font-size:14px;font-weight:900;letter-spacing:.5px;margin-bottom:6px;text-shadow:0 1px 2px rgba(255,255,255,.8)}',
      '#tt-key-banner .tt-banner-sub{font-size:11px;font-weight:700;margin-bottom:10px;opacity:.85}',
      '#tt-key-banner .tt-banner-action{font-size:11px;font-weight:800;padding:8px 10px;background:rgba(255,255,255,.7);border-radius:8px;line-height:1.5}',
      '#tt-key-banner .tt-banner-action a{color:#E91E63;text-decoration:none;font-weight:900;border-bottom:2px dotted #E91E63}',
      '#tt-key-input-wrap{position:relative;z-index:2;margin-bottom:12px}',
      '#tt-key-input-wrap .tt-key-input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px;opacity:.7}',
      '#tt-key-input{width:100%;padding:16px 16px 16px 46px;border:2.5px solid #F48FB1;border-radius:14px;font-family:"Courier New",monospace;font-size:15px;font-weight:900;color:#AD1457;background:#FFF;outline:none;letter-spacing:3px;text-align:center;transition:all .25s;text-transform:uppercase;box-shadow:0 4px 12px rgba(233,30,99,.12)}',
      '#tt-key-input::placeholder{color:#F48FB1;letter-spacing:1px;font-style:italic;text-transform:none;font-size:12px}',
      '#tt-key-input:focus{border-color:#E91E63;box-shadow:0 0 0 4px rgba(233,30,99,.22),0 6px 16px rgba(233,30,99,.2);background:#FFF0F5;transform:scale(1.01)}',
      '#tt-key-submit{width:100%;padding:16px 20px;border:none;border-radius:14px;background:linear-gradient(135deg,#F48FB1,#E91E63,#C2185B);color:#FFF;font-family:"Quicksand",sans-serif;font-size:15px;font-weight:900;cursor:pointer;letter-spacing:1.5px;box-shadow:0 8px 20px rgba(233,30,99,.5),0 0 0 2px rgba(255,255,255,.7) inset;transition:all .2s;text-transform:uppercase;margin-bottom:10px;position:relative;z-index:2}',
      '#tt-key-submit:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 28px rgba(233,30,99,.65),0 0 0 2px rgba(255,255,255,.9) inset}',
      '#tt-key-submit:active{transform:scale(.97)}',
      '#tt-key-error{font-size:12px;color:#C62828;font-weight:800;margin-top:8px;min-height:18px;position:relative;z-index:2;line-height:1.4}',
      '#tt-key-hint{font-size:11px;color:#D81B60;font-weight:700;margin-top:8px;font-style:italic;position:relative;z-index:2}',
      '#tt-key-hint b{color:#E91E63;font-weight:900}',
      '#tt-key-contact{margin-top:10px;font-size:11px;color:#D81B60;font-weight:700;text-align:center;padding:8px 12px;background:rgba(255,255,255,.65);border-radius:10px;position:relative;z-index:2;border:1.5px dashed rgba(244,143,177,.6)}',
      '#tt-key-contact a{color:#E91E63;text-decoration:none;font-weight:900;border-bottom:1px dotted #E91E63}',
      '#tt-key-telegram{display:none;margin-top:12px;padding:14px 16px;background:linear-gradient(135deg,#0088CC,#006699);border-radius:14px;color:#FFF;font-family:"Quicksand",sans-serif;font-size:12px;font-weight:900;text-align:center;line-height:1.6;box-shadow:0 6px 16px rgba(0,136,204,.45);position:relative;z-index:2}',
      '#tt-key-telegram.show{display:block;animation:ttWelcomeIn .4s ease-out}',
      '#tt-key-telegram a{color:#FFEB3B;text-decoration:none;font-weight:900;display:inline-block;padding:8px 16px;background:rgba(255,255,255,.15);border-radius:8px;margin-top:8px;transition:all .15s}',
      '#tt-key-telegram a:hover{background:rgba(255,255,255,.3);transform:scale(1.05)}',
      '#tt-key-countdown{font-size:10px;color:#FFEB3B;margin-top:6px;font-weight:800}',
      '.tt-key-decor{position:absolute;font-size:22px;animation:ttKittySparkle 2s infinite;pointer-events:none;z-index:3;color:#FF80AB;filter:drop-shadow(0 2px 4px rgba(233,30,99,.4))}',
      '.tt-key-decor.k1{top:14px;left:16px;animation-delay:0s}',
      '.tt-key-decor.k2{top:14px;right:16px;animation-delay:.3s}',
      '.tt-key-decor.k3{bottom:14px;left:16px;animation-delay:.6s}',
      '.tt-key-decor.k4{bottom:14px;right:16px;animation-delay:.9s}',

      '#tt-key-success{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:linear-gradient(165deg,#FFFFFF,#FFF5F8 30%,#FCE4EC 70%,#F8BBD0 100%);border-radius:24px;padding:28px 32px;box-shadow:0 20px 60px rgba(233,30,99,.6),0 0 0 4px rgba(255,255,255,.95) inset,0 0 80px rgba(255,20,147,.5);border:3px solid #FFF;text-align:center;font-family:"Quicksand","Nunito",sans-serif;min-width:280px;max-width:88vw;animation:ttKeySuccessIn .5s cubic-bezier(.34,1.56,.64,1);pointer-events:none}',
      '#tt-key-success::after{content:"";position:absolute;top:-10px;left:-10px;right:-10px;bottom:-10px;border-radius:30px;background:conic-gradient(from 0deg,#FF80AB,#E91E63,#FF1493,#D81B60,#FF80AB);z-index:-1;animation:ttSpin 4s linear infinite;filter:blur(6px);opacity:.85}',
      '#tt-key-success.tt-ks-hide{animation:ttKeySuccessOut .4s ease-in forwards}',
      '#tt-key-success .tt-ks-glow{position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,20,147,.25) 0%,transparent 55%);animation:ttPulseBg 2s ease-in-out infinite;border-radius:50%;pointer-events:none}',
      '#tt-key-success .tt-ks-emoji{font-size:64px;line-height:1;margin-bottom:12px;animation:ttKittyDance .7s ease-in-out infinite;display:inline-block;filter:drop-shadow(0 6px 16px rgba(233,30,99,.55))}',
      '#tt-key-success .tt-ks-title{font-family:"Quicksand",sans-serif;font-size:22px;font-weight:900;color:#E91E63;margin-bottom:12px;letter-spacing:2px;animation:ttKittyGlow 2s ease-in-out infinite;text-shadow:0 0 14px rgba(255,255,255,.95)}',
      '#tt-key-success .tt-ks-key{font-family:"Courier New",monospace;font-size:16px;font-weight:900;color:#2E7D32;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);padding:10px 18px;border-radius:12px;border:2px solid #66BB6A;letter-spacing:2px;margin-bottom:14px;display:inline-block;box-shadow:0 4px 12px rgba(76,175,80,.3)}',
      '#tt-key-success .tt-ks-msg{font-size:13px;color:#AD1457;font-weight:800;margin-bottom:8px}',
      '#tt-key-success .tt-ks-time{font-size:11px;color:#D81B60;font-weight:700;font-style:italic;padding:6px 12px;background:rgba(255,255,255,.7);border-radius:8px;display:inline-block}',

      '@media (max-width:400px){#tt-root{width:calc(100vw - 12px) !important;top:4px;font-size:9px;border-radius:16px}.tt-head{padding:10px 12px}.tt-rose{width:38px;height:38px}.tt-title-main{font-size:11px}.tt-body{padding:7px;gap:6px}.tt-input{padding:7px 9px;font-size:9.5px}.tt-btn{padding:7px 10px;font-size:9px}.tt-code-value{font-size:14px;letter-spacing:3px}.tt-kitty-emoji{width:54px;height:54px;font-size:42px;line-height:54px}.tt-timer-wrap{width:60px;height:60px}.tt-timer-num{font-size:22px}.tt-timer-cap{font-size:9.5px}#tt-welcome-box,#tt-key-box{padding:20px 18px}}',
      '@media (max-height:600px){#tt-root{max-height:94vh}.tt-body{padding:6px 7px;gap:6px}.tt-section{padding:6px}}'
    ].join('\n');
  }

  // ===== UI HELPERS =====
  function showToast(msg, ms) {
    var old = document.getElementById('tt-toast'); if (old) old.remove();
    var t = document.createElement('div'); t.id = 'tt-toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { if (t.parentNode) t.remove(); }, ms || 2500);
  }
  function copyToClipboard(text) {
    if (!text) return false;
    var tried = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() { S.set('lastCopyOk', '1'); }).catch(function() { if (copyViaExecCommand(text)) S.set('lastCopyOk', '1'); });
        tried = true;
      }
    } catch (e) {}
    if (!tried) { if (copyViaExecCommand(text)) S.set('lastCopyOk', '1'); }
    return true;
  }
  function copyViaExecCommand(text) {
    try {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0.01;z-index:-1;';
      document.body.appendChild(ta); ta.focus(); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); return ok;
    } catch (e) { return false; }
  }
  function makeDomainRow(item) {
    var row = document.createElement('div'); row.className = 'tt-domain-item'; row.setAttribute('data-domain', item.d);
    var name = document.createElement('div'); name.className = 'd-name'; name.textContent = item.d;
    var useBtn = document.createElement('button'); useBtn.className = 'd-use'; useBtn.setAttribute('data-action', 'use'); useBtn.textContent = 'DÙNG';
    var delBtn = document.createElement('button'); delBtn.className = 'd-del'; delBtn.setAttribute('data-action', 'del'); delBtn.textContent = '✕';
    row.appendChild(name); row.appendChild(useBtn); row.appendChild(delBtn);
    return row;
  }
  function onDomainListClick(e) {
    var t = e.target; if (!t || !t.closest) return;
    var row = t.closest('.tt-domain-item'); if (!row) return;
    var d = row.getAttribute('data-domain'); if (!d) return;
    var a = t.getAttribute && t.getAttribute('data-action');
    if (a === 'use') { e.stopPropagation(); if (UI.domainInput) UI.domainInput.value = d; return; }
    if (a === 'del') { e.stopPropagation(); DOMAINS.remove(d); renderDomainList(); return; }
    if (UI.domainInput) UI.domainInput.value = d;
  }
  function onKWListClick(e) {
    var t = e.target; if (!t || !t.closest) return;
    var row = t.closest('.tt-domain-item'); if (!row) return;
    var kw = row.getAttribute('data-kw'); var dm = row.getAttribute('data-dm'); if (!kw) return;
    var a = t.getAttribute && t.getAttribute('data-action');
    if (a === 'use') { e.stopPropagation(); if (UI.kwInput) UI.kwInput.value = kw; if (UI.kwDomain) UI.kwDomain.value = dm || ''; if (UI.domainInput && dm) UI.domainInput.value = dm; return; }
    if (a === 'del') { e.stopPropagation(); KEYWORD_MAP.remove(kw); renderKWList(); return; }
  }
  function renderKWList() {
    if (!IS_TOP || !UI.kwList) return;
    var list = KEYWORD_MAP.getList(); UI.kwList.innerHTML = '';
    if (!list.length) { UI.kwList.innerHTML = '<div class="tt-empty">✧ Chưa có mapping ✧</div>'; return; }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < list.length && i < 30; i++) {
      var item = list[i]; var row = document.createElement('div'); row.className = 'tt-domain-item';
      row.setAttribute('data-kw', item.k); row.setAttribute('data-dm', item.d);
      var name = document.createElement('div'); name.className = 'd-name'; name.textContent = item.k + ' → ' + item.d;
      var useBtn = document.createElement('button'); useBtn.className = 'd-use'; useBtn.setAttribute('data-action', 'use'); useBtn.textContent = 'DÙNG';
      var delBtn = document.createElement('button'); delBtn.className = 'd-del'; delBtn.setAttribute('data-action', 'del'); delBtn.textContent = '✕';
      row.appendChild(name); row.appendChild(useBtn); row.appendChild(delBtn); frag.appendChild(row);
    }
    UI.kwList.appendChild(frag);
  }
  function renderDomainList() {
    if (!IS_TOP || !UI.domainList) return;
    var list = DOMAINS.getList(); UI.domainList.innerHTML = '';
    if (!list.length) { UI.domainList.innerHTML = '<div class="tt-empty">✧ Chưa có domain ✧</div>'; return; }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < list.length; i++) frag.appendChild(makeDomainRow(list[i]));
    UI.domainList.appendChild(frag);
  }
  function updateBlCount() {
    try {
      var raw = S.get('customBlacklist', '[]');
      var arr = (typeof raw === 'string') ? JSON.parse(raw) : (raw || []);
      if (UI.blCount) UI.blCount.textContent = '✿ ' + arr.length + ' brand custom ✿';
    } catch (e) {}
  }
  function refreshStatus() {
    if (!UI.status) return;
    var map = {
      'idle': '✧ Sẵn sàng ✧',
      'google-search': '❯ Tìm Google... ❮',
      'google-click': '❯ Click trang... ❮',
      'scan-btn': '❯ Đợi nút g 2s... ❮',
      'wait-countdown': '❯ Chờ hết giờ... ❮',
      'get-code': '❯ Lấy mã... ❮',
      'back-gtraffic': '❯ Về gtraffic... ❮',
      'fill-code': '❯ Điền + nộp mã... ❮',
      'done': '♛ HOÀN TẤT ♛',
      'dichvu-task': '❯ Auto nhận NV... ❮',
      'robux-task': '❯ Auto Robux... ❮',
      'robux-claim': '❯ Đang claim coin... ❮',
      'tt-task': '❯ Auto TaskTrafficNgon... ❮',
      'tt-wait-link': '❯ Đợi link GTRAFFIC... ❮'
    };
    UI.status.textContent = map[getState()] || ('✧ ' + getState() + ' ✧');
  }
  function showTimer(sec, max, label) {
    if (!UI.timer) return;
    UI.timer.classList.add('show');
    UI.timerNum.textContent = sec;
    UI.timerCap.textContent = label || '✧ ĐANG CHỜ ✧';
    if (max > 0 && sec > 0) {
      var C_ = 2 * Math.PI * 26;
      var ratio = Math.min(1, Math.max(0, sec / max));
      UI.timerProg.style.strokeDashoffset = C_ * (1 - ratio);
    }
  }
  function showGuide(html) { if (UI.guide) { UI.guide.innerHTML = html; UI.guide.classList.add('show'); } }
  function showCode(code) {
    if (!UI.code) return;
    UI.code.classList.add('show'); UI.codeVal.textContent = code; saveCode(code);
    setTimeout(function() { showToast('♛ MÃ ĐÃ VỀ: ' + code + ' ♛', 2800); }, 400);
  }
  function toggleMin() { if (!UI.root) return; var m = UI.root.classList.toggle('tt-min'); UI.minBtn.textContent = m ? '+' : '−'; S.set('min', m ? '1' : '0'); }
  function enableDrag() {
    var h = UI.head; if (!h) return;
    var dg = false, sx = 0, sy = 0, ox = 0, oy = 0;
    var dn = function(e) {
      if (e.target.closest('.tt-icon-btn')) return;
      if (UI.root.classList.contains('tt-min')) { toggleMin(); return; }
      dg = true; var p = e.touches ? e.touches[0] : e;
      sx = p.clientX; sy = p.clientY;
      var r = UI.root.getBoundingClientRect(); ox = r.left; oy = r.top;
      UI.root.style.left = ox + 'px'; UI.root.style.top = oy + 'px';
      UI.root.style.right = 'auto'; UI.root.style.transform = 'none';
      document.addEventListener('mousemove', mv, { passive: false });
      document.addEventListener('mouseup', up);
      document.addEventListener('touchmove', mv, { passive: false });
      document.addEventListener('touchend', up);
      e.preventDefault();
    };
    var mv = function(e) { if (!dg) return; var p = e.touches ? e.touches[0] : e; var nx = ox + (p.clientX - sx), ny = oy + (p.clientY - sy); nx = Math.max(0, Math.min(nx, window.innerWidth - UI.root.offsetWidth)); ny = Math.max(0, Math.min(ny, window.innerHeight - UI.root.offsetHeight)); UI.root.style.left = nx + 'px'; UI.root.style.top = ny + 'px'; if (e.cancelable) e.preventDefault(); };
    var up = function() { if (!dg) return; dg = false; var r = UI.root.getBoundingClientRect(); S.set('pos', { x: r.left, y: r.top }); document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); document.removeEventListener('touchmove', mv); document.removeEventListener('touchend', up); };
    h.addEventListener('mousedown', dn); h.addEventListener('touchstart', dn, { passive: false });
  }

  // ============================================================
  // ★ BUILD PANEL
  // ============================================================
  function buildPanel() {
    if (!IS_TOP) return;
    if (!document.body) { var tries = 0; var w = setInterval(function() { tries++; if (document.body) { clearInterval(w); buildPanel(); } else if (tries > 200) clearInterval(w); }, 50); return; }
    var old = document.getElementById('tt-root'); if (old) old.remove();
    GM_addStyle(buildCSS());
    var html = [
      '<div class="tt-head" id="tt-head">',
      ' <div class="tt-head-actions">',
      '  <button class="tt-icon-btn" id="tt-min">−</button>',
      '  <button class="tt-icon-btn" id="tt-close">✕</button>',
      ' </div>',
      ' <div class="tt-brand">',
      '  <div class="tt-rose" id="tt-logo"><img src="' + GIF_KITTY_HEART + '" alt="✿" /></div>',
      '  <div class="tt-brand-txt">',
      '   <div class="tt-title-main">✦ THANH TUẤN ✦</div>',
      '   <div class="tt-title-sub">♛ TRIAL · v50.3.4 ♛</div>',
      '  </div>',
      ' </div>',
      '</div>',
      '<div class="tt-body">',
      ' <div class="tt-status" id="tt-status">✧ Sẵn sàng ✧</div>',
      ' <div class="tt-key-time" id="tt-key-time-left">⏰ Còn lại: --</div>',
      ' <div class="tt-section">',
      '  <div class="tt-section-title"><span class="r">♡</span> DOMAIN ĐÍCH ♡</div>',
      '  <input class="tt-input" id="tt-domain-input" type="text" placeholder="✎ vd: example.com" />',
      '  <div class="tt-section-title" style="margin-top:5px"><span class="r">✿</span> TỪ KHÓA SERVER ✿</div>',
      '  <input class="tt-input" id="tt-keyword-input" type="text" placeholder="✎ để trống = dùng domain" />',
      '  <div class="tt-row" style="margin-top:5px">',
      '   <button class="tt-btn blue" id="tt-save-domain" style="flex:1">💾 ❯ LƯU</button>',
      '   <button class="tt-btn gold" id="tt-start" style="flex:1">⚡ ❯ BẮT ĐẦU</button>',
      '  </div>',
      '  <div class="tt-domain-list" id="tt-domain-list"></div>',
      ' </div>',
      ' <div class="tt-section">',
      '  <div class="tt-section-title"><span class="r">⚙</span> ĐIỀU KHIỂN ⚙</div>',
      '  <button class="tt-btn gray" id="tt-reset" style="width:100%;padding:8px">🔄 ❯ RESET</button>',
      '  <div class="tt-timer" id="tt-timer" style="margin-top:6px">',
      '   <div class="tt-kitty-emoji" id="tt-kitty-emoji">✿</div>',
      '   <div class="tt-timer-wrap">',
      '    <svg viewBox="0 0 60 60">',
      '     <defs>',
      '      <linearGradient id="ttTimerGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
      '       <stop offset="0%" stop-color="#FF80AB"/>',
      '       <stop offset="50%" stop-color="#E91E63"/>',
      '       <stop offset="100%" stop-color="#FF1493"/>',
      '      </linearGradient>',
      '     </defs>',
      '     <circle class="tt-timer-track" cx="30" cy="30" r="26"/>',
      '     <circle class="tt-timer-prog" id="tt-timer-prog" cx="30" cy="30" r="26"/>',
      '    </svg>',
      '    <div class="tt-timer-num" id="tt-timer-num">0</div>',
      '   </div>',
      '   <div class="tt-timer-cap" id="tt-timer-cap">✧ ĐANG CHỜ ✧</div>',
      '  </div>',
      ' </div>',
      ' <div class="tt-section tt-full">',
      '  <div class="tt-section-title"><span class="r">♛</span> KEYWORD → DOMAIN MAP ♛</div>',
      '  <input class="tt-input" id="tt-kw-input" type="text" placeholder="✎ keyword" style="margin-bottom:5px" />',
      '  <input class="tt-input" id="tt-kw-domain" type="text" placeholder="✎ domain" style="margin-bottom:5px" />',
      '  <div class="tt-row">',
      '   <button class="tt-btn blue" id="tt-kw-save" style="flex:1">💾 ❯ LƯU MAP</button>',
      '   <button class="tt-btn gold" id="tt-kw-auto" style="flex:1">⚡ ❯ QUÉT + AUTO</button>',
      '  </div>',
      '  <div class="tt-domain-list" id="tt-kw-list"></div>',
      ' </div>',
      ' <div class="tt-section tt-full">',
      '  <div class="tt-section-title"><span class="r">⚠</span> BLACKLIST ⚠</div>',
      '  <input class="tt-input" id="tt-bl-input" type="text" placeholder="✎ thêm brand" style="margin-bottom:5px" />',
      '  <div class="tt-row">',
      '   <button class="tt-btn gray" id="tt-bl-add" style="flex:1">➕ ❯ THÊM</button>',
      '   <button class="tt-btn gray" id="tt-bl-view" style="flex:1">📋 ❯ XEM</button>',
      '  </div>',
      '  <span class="tt-hint" id="tt-bl-count">✧ 0 brand custom ✧</span>',
      ' </div>',
      ' <div class="tt-guide tt-full" id="tt-guide"></div>',
      ' <div class="tt-code" id="tt-code">',
      '  <div class="tt-code-label"><span class="r">♛</span>MÃ</div>',
      '  <div class="tt-code-right">',
      '   <div class="tt-code-value" id="tt-code-value">----</div>',
      '   <button class="tt-btn gold" id="tt-copy-btn" style="width:100%;padding:7px;font-size:9px">📋 ❯ COPY</button>',
      '  </div>',
      ' </div>',
      '</div>',
      '<div class="tt-foot"><span class="r">✿</span><span class="w">✧ (c) THANHTUAN ✧</span><span class="vn">♛ KITTY + CHUỘT ♛</span><span class="r">✿</span></div>'
    ].join('');
    var root = document.createElement('div'); root.id = 'tt-root'; root.innerHTML = html; document.body.appendChild(root);
    UI = {
      root: root, head: root.querySelector('#tt-head'), status: root.querySelector('#tt-status'),
      timer: root.querySelector('#tt-timer'), timerNum: root.querySelector('#tt-timer-num'),
      timerProg: root.querySelector('#tt-timer-prog'), timerCap: root.querySelector('#tt-timer-cap'),
      kittyEmoji: root.querySelector('#tt-kitty-emoji'), guide: root.querySelector('#tt-guide'),
      code: root.querySelector('#tt-code'), codeVal: root.querySelector('#tt-code-value'),
      copyBtn: root.querySelector('#tt-copy-btn'), minBtn: root.querySelector('#tt-min'),
      closeBtn: root.querySelector('#tt-close'), logo: root.querySelector('#tt-logo'),
      domainInput: root.querySelector('#tt-domain-input'), keywordInput: root.querySelector('#tt-keyword-input'),
      saveBtn: root.querySelector('#tt-save-domain'), startBtn: root.querySelector('#tt-start'),
      domainList: root.querySelector('#tt-domain-list'), resetBtn: root.querySelector('#tt-reset'),
      kwInput: root.querySelector('#tt-kw-input'), kwDomain: root.querySelector('#tt-kw-domain'),
      kwSaveBtn: root.querySelector('#tt-kw-save'), kwAutoBtn: root.querySelector('#tt-kw-auto'),
      kwList: root.querySelector('#tt-kw-list'), blInput: root.querySelector('#tt-bl-input'),
      blAddBtn: root.querySelector('#tt-bl-add'), blViewBtn: root.querySelector('#tt-bl-view'),
      blCount: root.querySelector('#tt-bl-count'), keyTime: root.querySelector('#tt-key-time-left')
    };
    if (UI.domainList) UI.domainList.addEventListener('click', onDomainListClick);
    if (UI.kwList) UI.kwList.addEventListener('click', onKWListClick);

    UI.copyBtn.onclick = function() {
      var c = (UI.codeVal.textContent || '').trim();
      if (!c || c === '----') { showToast('✧ Chưa có mã ✧'); return; }
      copyToClipboard(c); UI.copyBtn.textContent = '✅ ĐÃ COPY';
      setTimeout(function() { UI.copyBtn.textContent = '📋 ❯ COPY'; }, 2000);
    };

    // ★ RESET: KHÔNG xóa gì hết — chỉ gọi showWelcomeModal (check 2h tự động)
    UI.resetBtn.onclick = function() {
      log('★ USER RESET — không xóa gì, chỉ thử hiện welcome');

      try {
        if (UI.status) UI.status.textContent = '✧ Đã reset ✧';
      } catch (e) {}

      var lastOk = parseInt(S.get('welcomeOkAt', '0'), 10);
      var TWO_HOURS = CFG.welcomeHideMs;
      var isHidden2h = (lastOk > 0 && (Date.now() - lastOk) < TWO_HOURS);

      if (isHidden2h) {
        var left = TWO_HOURS - (Date.now() - lastOk);
        showToast('⏰ Đang ẩn 2h · Còn ' + formatTimeLeftShort(left), 2500);
        log('★ RESET: Đang trong 2h ẩn → KHÔNG hiện welcome');
      } else {
        showToast('♛ ĐÃ RESET — Welcome hiện lại ♛', 2000);
        log('★ RESET: Đã qua 2h → hiện welcome');
      }

      setTimeout(function() {
        var old = document.getElementById('tt-welcome');
        if (old) old.remove();
        try { showWelcomeModal(); } catch (e) {}
      }, 300);
    };

    UI.saveBtn.onclick = function() {
      var v = UI.domainInput.value.trim(); if (!v) { UI.domainInput.focus(); return; }
      var ok = DOMAINS.save(v);
      UI.saveBtn.textContent = ok ? '✓ LƯU' : '✓ CÓ RỒI';
      setTimeout(function() { UI.saveBtn.textContent = '💾 ❯ LƯU'; }, 1200);
      renderDomainList();
    };

    if (UI.kwSaveBtn) UI.kwSaveBtn.onclick = function() {
      var kw = (UI.kwInput.value || '').trim(); var dm = (UI.kwDomain.value || '').trim();
      if (!kw || !dm) { showToast('✧ Nhập đủ keyword và domain ✧'); return; }
      var ok = KEYWORD_MAP.save(kw, dm);
      UI.kwSaveBtn.textContent = ok ? '✓ ĐÃ LƯU' : '✗ LỖI';
      setTimeout(function() { UI.kwSaveBtn.textContent = '💾 ❯ LƯU MAP'; }, 1200);
      if (ok) { UI.kwInput.value = ''; UI.kwDomain.value = ''; showToast('✿ Đã lưu: ' + kw + ' → ' + dm + ' ✿', 2000); }
      renderKWList();
    };

    if (UI.kwAutoBtn) UI.kwAutoBtn.onclick = function() {
      if (UI.status) UI.status.textContent = '❯ Đang OCR keyword... ❮';
      scanDichvuKeyword().then(function(kw) {
        if (kw && UI.kwInput) UI.kwInput.value = kw;
        if (!kw) { showToast('✧ OCR không đọc được ✧', 3000); renderKWList(); return; }
        var dm = KEYWORD_MAP.lookup(kw);
        if (!dm) { showToast('✧ ' + kw + ' — chưa có domain ✧', 3500); if (UI.kwDomain) UI.kwDomain.focus(); renderKWList(); return; }
        if (UI.kwDomain) UI.kwDomain.value = dm;
        if (UI.domainInput) UI.domainInput.value = dm;
        if (UI.keywordInput) UI.keywordInput.value = kw;
        showToast('✿ Match: ' + kw + ' → ' + dm + ' ✿', 2500);
        renderKWList();
        setTimeout(function() { try { if (UI && UI.startBtn) UI.startBtn.click(); } catch (e) {} }, 300);
      });
    };

    if (UI.blAddBtn) UI.blAddBtn.onclick = function() {
      var w = (UI.blInput.value || '').trim().toLowerCase();
      if (!w) { showToast('✧ Nhập brand ✧'); return; }
      if (BLACKLIST.addCustom(w)) { showToast('✿ Đã thêm: ' + w + ' ✿', 2000); UI.blInput.value = ''; updateBlCount(); }
      else showToast('✧ Đã có hoặc lỗi ✧', 2000);
    };
    if (UI.blViewBtn) UI.blViewBtn.onclick = function() {
      try {
        var raw = S.get('customBlacklist', '[]'); var arr = (typeof raw === 'string') ? JSON.parse(raw) : (raw || []);
        if (!arr.length) { showToast('✧ Chưa có brand custom ✧'); return; }
        alert('Custom blacklist:\n' + arr.join('\n'));
      } catch (e) {}
    };

    UI.startBtn.onclick = function() {
      var vD = UI.domainInput.value.trim(); var vK = UI.keywordInput ? UI.keywordInput.value.trim() : '';
      if (!vD && !vK) { UI.status.textContent = '✧ Nhập domain hoặc từ khóa ✧'; UI.domainInput.focus(); return; }
      var domain = vD ? vD.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim() : '';
      var keyword = vK; var searchTerm = keyword ? keyword : domain;
      S.del('code'); S.del('targetUrl'); S.del('filled'); S.del('confirmed'); S.del('lastClickTime');
      S.del('googleClickTries'); S.del('codeFoundAt'); S.del('lastServerSec'); S.del('serverTotalSec');
      S.del('navigatingBack'); S.del('cdStartSec'); S.del('cdStartAt'); S.del('btnClickAt');
      S.del('gotCodeAt'); S.del('codeAttempts'); S.del('backDone'); S.del('lastNavUrl');
      S.del('lastNavAt'); S.del('hardStop'); S.del('countdownRealZero'); S.del('getLinkClicked');
      S.del('waitingGetLink'); S.del('getLinkDeadline'); S.del('getLinkStartAt'); S.del('pendingAutoReset');
      resetFillFlags();
      S.set('domain', domain); S.set('keyword', keyword); S.set('gtrafficUrl', location.href);
      S.set('inFlow', '1'); S.set('childTabOpen', '1'); setState(STATE.GOOGLE_SEARCH);
      if (domain) DOMAINS.save(domain); if (keyword && domain) KEYWORD_MAP.save(keyword, domain);
      renderDomainList(); renderKWList();
      var gurl = 'https://www.google.com/search?q=' + encodeURIComponent(searchTerm);
      UI.status.textContent = '❯ Đang mở Google... ❮';
      var childWin = null;
      try { childWin = window.open(gurl, '_blank'); childTabRef = childWin; } catch (e) {}
      if (childWin) { UI.status.textContent = '❯ Đang chạy tab mới... ❮'; startChildPoller(); }
      else { UI.status.textContent = '✧ Cho phép popup ✧'; S.set('childTabOpen', '0'); }
    };

    UI.domainInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') UI.startBtn.click(); });
    if (UI.keywordInput) UI.keywordInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') UI.startBtn.click(); });
    UI.minBtn.onclick = function(e) { e.stopPropagation(); toggleMin(); };
    UI.closeBtn.onclick = function(e) {
      e.stopPropagation();
      try { showGifOverlay(1800, GIF_KITTY_HEART); } catch (e) {}
      setTimeout(function() {
        UI.root.style.display = 'none';
        var fab = document.getElementById('tt-fab');
        if (!fab) { fab = document.createElement('div'); fab.id = 'tt-fab'; fab.innerHTML = '<div class="tt-fab-emoji">🐱</div>'; fab.onclick = function() { UI.root.style.display = ''; fab.remove(); }; document.body.appendChild(fab); }
      }, 400);
    };
    if (S.get('min') === '1') { UI.root.classList.add('tt-min'); UI.minBtn.textContent = '+'; }
    var pos = S.get('pos'); if (pos && typeof pos === 'object') { UI.root.style.left = pos.x + 'px'; UI.root.style.top = pos.y + 'px'; UI.root.style.transform = 'none'; }
    enableDrag();

    var cd = S.get('domain'); if (cd) UI.domainInput.value = cd;
    var ck = S.get('keyword'); if (ck && UI.keywordInput) UI.keywordInput.value = ck;
    renderDomainList(); renderKWList(); updateBlCount();

    startKeyCountdown();
  }

  // ============================================================
  // ★ HOOK SPA ROUTE CHANGE
  // ============================================================
  (function hookSPARouteChange() {
    if (!IS_TOP) return;
    try {
      var origPush = history.pushState;
      var origReplace = history.replaceState;
      function onRouteChange() {
        log('★ SPA route change: ' + location.pathname);
        cachedInput = null; cachedInputTime = 0;
        cachedConfirm = null; cachedConfirmTime = 0;
        cachedBtn = null; cachedBtnTime = 0;
        pageLoadTime = Date.now();

        if (isTaskTrafficNgon && ttIsOnTasksPage() && !loopRunning) {
          setTimeout(function() {
            try {
              var keyCheck = checkUserKey();
              if (!keyCheck.ok) return;

              if (getState() !== STATE.TT_TASK) setState(STATE.TT_TASK);

              var savedCreated = S.get('ttTaskCreated', '0');
              var savedStage = S.get('ttStage', '');
              var savedWaitStart = parseInt(S.get('ttLinkWaitStart', '0'), 10);
              var savedClickAt = parseInt(S.get('ttClickAt', '0'), 10);
              var savedPageUrl = S.get('ttPageUrl', '');
              var curPageUrl = location.href.split('?')[0].split('#')[0];
              var samePage = (savedPageUrl === curPageUrl);
              var stateAge = savedWaitStart > 0 ? (Date.now() - savedWaitStart) : 0;
              var stateFresh = (stateAge > 0 && stateAge < CFG.ttStateTTLMs);

              if (savedCreated === '1' && samePage && stateFresh) {
                ttTaskCreated = true;
                ttStage = savedStage || 'waiting_link';
                ttLinkWaitStart = savedWaitStart || Date.now();
                ttClickAt = savedClickAt || 0;
                log('★ TT: KHÔI PHỤC state từ GM');
              } else {
                ttTaskCreated = false;
                ttStage = '';
                ttClickAt = 0;
                ttLinkWaitStart = 0;
              }

              loopRunning = false; stopRequested = false;
              loop();
            } catch (e) {}
          }, 800);
        }
      }
      history.pushState = function() {
        var r = origPush.apply(this, arguments);
        try { onRouteChange(); } catch (e) {}
        return r;
      };
      history.replaceState = function() {
        var r = origReplace.apply(this, arguments);
        try { onRouteChange(); } catch (e) {}
        return r;
      };
      window.addEventListener('popstate', onRouteChange);
    } catch (e) {}
  })();

  // ============================================================
  // ★ AUTO CHECK KEY HẾT HẠN MỖI PHÚT
  // ============================================================
  (function autoCheckKeyExpire() {
    if (!IS_TOP) return;
    setInterval(function() {
      var keyStatus = getKeyStatus(S.get('userKey', ''));
      if (keyStatus.status === 'expired' || keyStatus.status === 'locked') {
        log('★ KEY: ' + keyStatus.status + ' → văng ra nhập key');
        try { S.del('userKey'); } catch (e) {}
        try { S.del('userKeyAt'); } catch (e) {}
        if (UI && UI.root) UI.root.style.display = 'none';
        if (!document.getElementById('tt-key-modal')) {
          showKeyModal();
        }
        if (keyStatus.status === 'expired') {
          try { showToast('⏰ Key của bạn đã hết hạn! IB admin để mua', 5000); } catch (e) {}
        } else {
          try { showToast('🚫 Key của bạn đã bị khóa! IB admin', 5000); } catch (e) {}
        }
      }
    }, 60 * 1000);
  })();

  // ============================================================
  // ★ AUTO HIỆN LẠI WELCOME SAU 2H
  // ============================================================
  (function autoShowWelcomeAfter2h() {
    if (!IS_TOP) return;
    setInterval(function() {
      var lastOk = parseInt(S.get('welcomeOkAt', '0'), 10);
      if (lastOk <= 0) return;
      var elapsed = Date.now() - lastOk;
      if (elapsed >= CFG.welcomeHideMs) {
        log('★ WELCOME: Đã đủ 2h — tự động hiện lại');
        try { S.del('welcomeOkAt'); } catch (e) {}
        if (!document.getElementById('tt-welcome')) {
          showWelcomeModal();
        }
      }
    }, 60 * 1000);
  })();

  // ============================================================
  // ★ BOOT
  // ============================================================
  function boot() {
    if (!shouldToolRunOnThisPage()) {
      var o = document.getElementById('tt-root'); if (o) o.remove();
      var f = document.getElementById('tt-fab'); if (f) f.remove();
      return;
    }
    if (isCloudflareChallengePage()) {
      setTimeout(function() { try { handleCloudflareChallenge(); } catch (e) {} }, 500);
      return;
    }

    if (recheckTaskTrafficNgon()) {
      isTaskTrafficNgon = true;
    }

    var la = parseInt(S.get('leavingAt', '0'), 10);
    if (la > 0) { var e = Date.now() - la; if (e > 300000 && S.get('inFlow') !== '1' && !loadCode()) resetAllState(true); S.del('leavingAt'); }

    var keyCheck = checkUserKey();
    var keyStatus = getKeyStatus(S.get('userKey', ''));

    if (IS_TOP) {
      buildPanel();

      if (keyStatus.status === 'expired' || keyStatus.status === 'locked' || keyStatus.status === 'invalid') {
        log('★ KEY: ' + keyStatus.status + ' → ẩn UI, bắt nhập lại');
        try { S.del('userKey'); } catch (e) {}
        try { S.del('userKeyAt'); } catch (e) {}
        if (UI && UI.root) UI.root.style.display = 'none';
        setTimeout(function() { showKeyModal(); }, 800);
        startLeaveDetector();
        return;
      }

      var lastOk = parseInt(S.get('welcomeOkAt', '0'), 10);
      var shouldShowWelcome = false;
      if (lastOk <= 0) {
        shouldShowWelcome = true;
      } else if (Date.now() - lastOk >= CFG.welcomeHideMs) {
        shouldShowWelcome = true;
        try { S.del('welcomeOkAt'); } catch (e) {}
      }

      if (shouldShowWelcome) {
        if (UI && UI.root) UI.root.style.display = 'none';
        setTimeout(function() { showWelcomeModal(); }, 600);
      } else if (!keyCheck.ok) {
        if (UI && UI.root) UI.root.style.display = 'none';
        setTimeout(function() { showKeyModal(); }, 600);
      } else {
        log('★ KEY: Active — còn ' + formatTimeLeft(KEY_SYSTEM.endDate - Date.now()));
      }
    }

    var st = getState(); var code = S.get('code', '');

    if (!keyCheck.ok) {
      log('★ KEY: Chưa kích hoạt — tạm dừng auto');
      if (IS_TOP) startLeaveDetector();
      return;
    }

    if (isGtraffic) {
      log('★ BOOT: Trang GTRAFFIC.IO');
      try {
        var cgu = location.href.split('?')[0].split('#')[0];
        var lgu = S.get('lastGtrafficUrl', '');
        if (lgu && lgu !== cgu) {
          log('★ GTRAFFIC URL DOI MOI');
          S.resetFull();
          try { S.del('goBackFired'); } catch (e) {}
          stopRequested = false; loopRunning = false; fillRunning = false; submitRunning = false;
          finishCalled = false; fillDone = false; submitted = false; fillRetries = 0; codeShown = false;
          getLinkClickDone = false; getLinkStartAt = 0; googleClicked = false; wasOnValidPage = true;
          cachedInput = null; cachedInputTime = 0; cachedConfirm = null; cachedConfirmTime = 0; cachedBtn = null; cachedBtnTime = 0;
          if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; }
          if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
          if (UI && UI.root) UI.root.remove();
          if (IS_TOP) buildPanel();
        }
        try { S.set('lastGtrafficUrl', cgu); } catch (e) {}
      } catch (e) {}
      setTimeout(function() { try { autoFillAndStart(); } catch (e) {} }, CFG.autoFillDelayMs);
      if (st === STATE.BACK_GTRAFFIC) { S.del('navigatingBack'); S.set('backDone', '1'); }
      var cip = getCodeFromPanel(); var cfs = loadCode();
      var hc = !!(cip || cfs); var wl = (S.get('waitingGetLink') === '1');
      var iff = (S.get('inFlow') === '1'); var co = (S.get('childTabOpen') === '1');
      if (wl && !hc) { if (IS_TOP) refreshStatus(); startWaitingForGetLink(); startLeaveDetector(); return; }
      if (co && !hc) { if (IS_TOP) UI.status.textContent = '❯ Chờ mã từ tab con... ❮'; startChildPoller(); startLeaveDetector(); return; }
      if (hc || iff) {
        if (hc) {
          try { S.del('confirmed'); } catch (e) {}
          try { S.del('hardStop'); } catch (e) {}
          try { S.del('waitingGetLink'); } catch (e) {}
          fillDone = false; fillRunning = false; submitRunning = false; finishCalled = false;
          submitted = false; fillRetries = 0; codeShown = false;
          stopValueWatchdog(); unpatchInput();
        }
        setState(STATE.FILL_CODE);
        if (IS_TOP && !codeShown) {
          var sw = cip || cfs;
          if (sw && isValidCodeShape(sw) && !isBlacklistedCode(sw)) {
            codeShown = true; UI.code.classList.add('show'); UI.codeVal.textContent = sw; saveCode(sw);
          }
        }
        if (IS_TOP) refreshStatus();
        startLeaveDetector(); fillAndConfirm(true); startGtrafficObserver(); loop(); return;
      }
      if (st !== STATE.IDLE) setState(STATE.IDLE);
      if (IS_TOP) refreshStatus();
      startLeaveDetector(); return;
    }

    if (isGoogle) {
      log('★ BOOT: Trang GOOGLE');
      if (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) {
        startGoogleObserver(); if (IS_TOP) refreshStatus(); startLeaveDetector(); loop(); return;
      }
      if (IS_TOP) refreshStatus(); startLeaveDetector(); return;
    }

    if (isDichvuTask) {
      log('★ BOOT: Trang DICHVUTASK');
      if (st !== STATE.DICHVU_TASK) setState(STATE.DICHVU_TASK);
      if (IS_TOP && UI) UI.status.textContent = '❯ Auto nhận NV... ❮';
      startLeaveDetector(); loop(); return;
    }

    if (isRobuxReward && IS_TOP) {
      log('★ BOOT: Trang ROBUX');
      var cp = location.pathname;
      if (cp.indexOf('/claim') === 0) {
        robuxClaimStartAt = Date.now(); robuxClaimDone = false;
        if (UI) UI.status.textContent = '❯ Đang claim coin... ❮';
        startLeaveDetector(); setTimeout(function() { loop(); }, 500); return;
      }
      if (cp !== '/earn' && cp.indexOf('/earn') !== 0) {
        if (UI) UI.status.textContent = '❯ Chuyển sang Kiếm Coin... ❮';
        setTimeout(function() { try { location.href = '/earn'; } catch (e) {} }, 1500); return;
      }
      startLeaveDetector(); setTimeout(function() { loop(); }, 2000);
      return;
    }

    if (isTaskTrafficNgon) {
      log('★ BOOT: Trang TASKTRAFFICNGON');
      if (st !== STATE.TT_TASK) setState(STATE.TT_TASK);

      if (!ttIsOnTasksPage()) {
        log('★ TT: Chưa ở /dashboard/tasks — tự chuyển đến');
        if (IS_TOP && UI && UI.status) {
          UI.status.textContent = '❯ Đang vào trang nhận nhiệm vụ... ❮';
        }
        setTimeout(function() {
          try {
            var curPath = location.pathname;
            if (curPath !== '/dashboard/tasks' && curPath !== '/dashboard/tasks/') {
              log('★ TT: Chuyển từ ' + curPath + ' → /dashboard/tasks');
              location.href = '/dashboard/tasks';
            }
          } catch (e) { log('TT: Lỗi chuyển trang: ' + e.message); }
        }, CFG.ttAutoNavDelayMs);
        if (IS_TOP) startLeaveDetector();
        return;
      }

      var savedCreated = S.get('ttTaskCreated', '0');
      var savedStage = S.get('ttStage', '');
      var savedWaitStart = parseInt(S.get('ttLinkWaitStart', '0'), 10);
      var savedClickAt = parseInt(S.get('ttClickAt', '0'), 10);
      var savedPageUrl = S.get('ttPageUrl', '');
      var curPageUrl = location.href.split('?')[0].split('#')[0];
      var samePage = (savedPageUrl === curPageUrl);
      var stateAge = savedWaitStart > 0 ? (Date.now() - savedWaitStart) : 0;
      var stateFresh = (stateAge > 0 && stateAge < CFG.ttStateTTLMs);

      if (savedCreated === '1' && samePage && stateFresh) {
        ttTaskCreated = true;
        ttStage = savedStage || 'waiting_link';
        ttLinkWaitStart = savedWaitStart || Date.now();
        ttClickAt = savedClickAt || 0;
        log('★ TT: KHÔI PHỤC — đã tạo task, tiếp tục đợi nút Mở');
      } else {
        ttTaskCreated = false;
        ttStage = '';
        ttClickAt = 0;
        ttLinkWaitStart = 0;
        try { S.del('ttTaskCreated'); } catch (e) {}
        try { S.del('ttStage'); } catch (e) {}
        try { S.del('ttLinkWaitStart'); } catch (e) {}
        try { S.del('ttClickAt'); } catch (e) {}
        try { S.del('ttPageUrl'); } catch (e) {}
        log('★ TT: BẮT ĐẦU LẠI');
      }

      if (IS_TOP && UI) UI.status.textContent = ttTaskCreated ? '✧ Đợi nút Mở NV ✧' : '❯ Auto TaskTrafficNgon... ❮';

      startLeaveDetector();
      loop();
      return;
    }

    if (isRealTargetPage() && (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK)) setState(STATE.SCAN_BTN);
    if (isRealTargetPage()) {
      if (st === STATE.SCAN_BTN || st === STATE.WAIT_COUNTDOWN || st === STATE.GET_CODE || st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) {
        if (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) setState(STATE.SCAN_BTN);
        if (IS_TOP) refreshStatus(); startLeaveDetector(); loop(); return;
      }
      if (IS_TOP) refreshStatus(); startLeaveDetector(); return;
    }

    if (IS_TOP) refreshStatus();
    if (IS_TOP && code && !codeShown) {
      codeShown = true; UI.code.classList.add('show'); UI.codeVal.textContent = code;
    }
    if (st === STATE.DONE && S.get('waitingGetLink') !== '1') { stopAll(); startLeaveDetector(); return; }
    startLeaveDetector();
  }

  // ============================================================
  // ★ RUN
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
// ===== END v50.3.4 FINAL =====
