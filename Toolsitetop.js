// ==UserScript==
// @name         SITETOP AUTO v2.0 - FULL COMPLETE
// @namespace    sitetop.auto.full
// @version      2.0.0
// @description  Auto sitetop.net - Đọc link, tự mở, tự vượt mọi bước, tự lấy mã
// @author       THANH TUẤN
// @match        *://sitetop.net/*
// @match        *://*.sitetop.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  var HOST = location.hostname;
  if (!/(^|\.)sitetop\.net$/i.test(HOST)) return;

  // ============================================================
  // ★ CẤU HÌNH
  // ============================================================
  var CFG = {
    autoReadLink: true,
    autoOpenLink: true,
    autoTouch: true,
    autoScroll: true,
    autoClickBtn: true,
    autoCopyCode: true,
    autoStep2: true,
    autoBypass: true,
    verbose: true,
    pollMs: 1000,
    linkOpenDelay: 2000
  };

  var S = {
    get: function(k, d) { try { var v = GM_getValue('st_' + k, d); return v === undefined ? d : v; } catch (e) { return d; } },
    set: function(k, v) { try { GM_setValue('st_' + k, v); } catch (e) {} },
    del: function(k) { try { GM_deleteValue('st_' + k); } catch (e) {} }
  };

  function log() {
    if (!CFG.verbose) return;
    try { console.log.apply(console, ['[ST-AUTO]'].concat(Array.prototype.slice.call(arguments))); } catch (e) {}
  }

  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

  // ============================================================
  // ★ STATE
  // ============================================================
  var st = {
    autoRunning: true,
    startedAt: Date.now(),
    touchCount: 0,
    scrollCount: 0,
    clickCount: 0,
    codeCount: 0,
    step2Count: 0,
    linkOpenCount: 0,
    lastCode: '',
    lastPopupMsg: '',
    lastPopupTime: 0,
    lastClickTime: 0,
    lastScrollTime: 0,
    lastTouchTime: 0,
    lastStep2Time: 0,
    lastLinkOpenTime: 0,
    openedLinks: [],
    currentLink: ''
  };

  // ============================================================
  // ★ BYPASS INCOGNITO
  // ============================================================
  (function bypassIncognito() {
    if (!CFG.autoBypass) return;
    try {
      if (navigator.storage) {
        try {
          Object.defineProperty(navigator.storage, 'getDirectory', {
            get: function() {
              return function() {
                return Promise.resolve({
                  getFileHandle: function() { return Promise.resolve({}); },
                  getDirectoryHandle: function() { return Promise.resolve({}); },
                  removeEntry: function() { return Promise.resolve(); },
                  resolve: function() { return Promise.resolve(null); }
                });
              };
            },
            configurable: true
          });
        } catch (e) {}
        try {
          Object.defineProperty(navigator.storage, 'estimate', {
            get: function() {
              return function() {
                return Promise.resolve({ quota: 1073741824, usage: 1024 });
              };
            },
            configurable: true
          });
        } catch (e) {}
      }
      var origDefine = Object.defineProperty;
      Object.defineProperty = function(obj, prop, desc) {
        try {
          if (prop === 'detectIncognito' && desc && typeof desc.value === 'function') {
            desc.value = function() {
              return Promise.resolve({ isPrivate: false, browserName: 'Chrome' });
            };
          }
        } catch (e) {}
        return origDefine.call(this, obj, prop, desc);
      };
    } catch (e) {}
  })();

  function removeIncognitoOverlay() {
    var ov = document.getElementById('incognito-overlay');
    if (ov) {
      ov.remove();
      document.body.style.overflow = '';
      document.body.style.position = '';
    }
  }

  // ============================================================
  // ★ ĐỌC LINK BƯỚC 1 (TỪ Ô URL DISPLAY)
  // ============================================================
  function readTargetUrl() {
    // Cách 1: Đọc trực tiếp từ span.url-display
    var urlEl = document.getElementById('target-url-text');
    if (urlEl) {
      var txt = (urlEl.textContent || '').trim();
      if (txt && /^https?:\/\//i.test(txt)) {
        log('Đọc URL từ #target-url-text:', txt);
        return txt;
      }
    }

    // Cách 2: Quét mọi span.url-display
    var urlDisplays = document.querySelectorAll('span.url-display');
    for (var i = 0; i < urlDisplays.length; i++) {
      var t = (urlDisplays[i].textContent || '').trim();
      if (t && /^https?:\/\//i.test(t)) {
        log('Đọc URL từ span.url-display:', t);
        return t;
      }
    }

    // Cách 3: Quét mọi <a> có href ngoài sitetop
    var links = document.querySelectorAll('a[href^="http"]');
    for (var j = 0; j < links.length; j++) {
      var h = links[j].href || '';
      if (h.indexOf('sitetop.net') === -1 && h.indexOf('google.com') === -1 &&
          h.indexOf('cloudflare') === -1 && h.indexOf('facebook.com') === -1) {
        log('Đọc URL từ <a>:', h);
        return h;
      }
    }

    return '';
  }

  // ============================================================
  // ★ MỞ LINK BƯỚC 1
  // ============================================================
  function openTargetLink() {
    if (!CFG.autoOpenLink) return false;

    var url = readTargetUrl();
    if (!url) {
      log('Không tìm được URL đích');
      return false;
    }

    // Đã mở rồi?
    if (st.openedLinks.indexOf(url) !== -1) {
      log('Link đã mở rồi:', url);
      return true;
    }

    // Cooldown
    if (Date.now() - st.lastLinkOpenTime < 5000) return false;

    st.lastLinkOpenTime = Date.now();
    st.openedLinks.push(url);
    st.currentLink = url;
    st.linkOpenCount++;

    log('★ MỞ LINK BƯỚC 1:', url);
    updatePanel();

    setTimeout(function() {
      try {
        // Ưu tiên GM_openInTab (chạy nền)
        if (typeof GM_openInTab === 'function') {
          try {
            GM_openInTab(url, { active: true, insert: true, setParent: true });
            showToast('♛ Đã mở link đích — tự tìm nút lấy mã ♛', 4000);
            return;
          } catch (e) { log('GM_openInTab lỗi:', e.message); }
        }

        // Fallback: window.open
        try {
          var w = window.open(url, '_blank');
          if (w) {
            showToast('♛ Đã mở link đích ♛', 4000);
            return;
          }
        } catch (e) {}

        // Fallback: chuyển trang cùng tab
        try {
          showToast('♛ Đang chuyển đến link đích ♛', 3000);
          setTimeout(function() { location.href = url; }, 1000);
        } catch (e) {}
      } catch (e) { log('Lỗi mở link:', e.message); }
    }, CFG.linkOpenDelay);

    return true;
  }

  // ============================================================
  // ★ FAKE TOUCH
  // ============================================================
  function fakeTouch(x, y) {
    if (!CFG.autoTouch) return;
    if (Date.now() - st.lastTouchTime < 200) return;
    st.lastTouchTime = Date.now();

    x = x || rnd(50, Math.max(60, window.innerWidth - 50));
    y = y || rnd(100, Math.max(120, window.innerHeight - 100));

    try {
      var touch = new Touch({
        identifier: Date.now(),
        target: document.body,
        clientX: x, clientY: y,
        pageX: x, pageY: y,
        screenX: x, screenY: y,
        radiusX: 10, radiusY: 10,
        rotationAngle: 0,
        force: 0.5
      });
      document.body.dispatchEvent(new TouchEvent('touchstart', {
        bubbles: true, cancelable: true,
        touches: [touch], targetTouches: [touch], changedTouches: [touch]
      }));
      setTimeout(function() {
        document.body.dispatchEvent(new TouchEvent('touchend', {
          bubbles: true, cancelable: true,
          touches: [], targetTouches: [], changedTouches: [touch]
        }));
      }, 50);
      st.touchCount++;
      log('Fake touch:', x, y);
    } catch (e) {}

    try {
      var opt = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button: 0 };
      document.body.dispatchEvent(new MouseEvent('mousedown', opt));
      document.body.dispatchEvent(new MouseEvent('mouseup', opt));
      document.body.dispatchEvent(new MouseEvent('click', opt));
      document.body.dispatchEvent(new MouseEvent('mousemove', opt));
    } catch (e) {}
  }

  // ============================================================
  // ★ FAKE SCROLL
  // ============================================================
  function fakeScroll(direction) {
    if (!CFG.autoScroll) return;
    if (Date.now() - st.lastScrollTime < 300) return;
    st.lastScrollTime = Date.now();

    direction = direction || 'random';
    var currentY = window.pageYOffset;
    var maxY = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    ) - window.innerHeight;
    var targetY;

    if (direction === 'top') targetY = 0;
    else if (direction === 'bottom') targetY = maxY;
    else if (direction === 'up') targetY = Math.max(0, currentY - rnd(200, 500));
    else if (direction === 'down') targetY = Math.min(maxY, currentY + rnd(200, 500));
    else targetY = rnd(0, maxY);

    try {
      var step = (targetY - currentY) / 10;
      var i = 0;
      var scrollStep = function() {
        if (i >= 10) {
          window.dispatchEvent(new Event('scroll'));
          st.scrollCount++;
          log('Fake scroll →', targetY);
          updatePanel();
          return;
        }
        currentY += step;
        window.scrollTo(0, currentY);
        window.dispatchEvent(new Event('scroll'));
        i++;
        setTimeout(scrollStep, 30);
      };
      scrollStep();
    } catch (e) {}
  }

  // ============================================================
  // ★ ĐỌC TRẠNG THÁI WIDGET
  // ============================================================
  function readBtnText() {
    var t = document.getElementById('tn-btn-text');
    return t ? (t.textContent || '').trim().toLowerCase() : '';
  }

  function readCountdown() {
    var cd = document.getElementById('tn-cd');
    if (!cd || cd.style.display === 'none') return null;
    var n = parseInt(cd.textContent, 10);
    return isNaN(n) ? null : n;
  }

  function readCode() {
    var codeEl = document.getElementById('tn-code-t');
    return codeEl ? (codeEl.textContent || '').trim() : '';
  }

  function getPopupMsg() {
    var m = document.getElementById('tn-pop-msg');
    return m ? (m.textContent || '').trim() : '';
  }

  function getPopupSub() {
    var s = document.getElementById('tn-pop-sub');
    return s ? (s.textContent || '').trim() : '';
  }

  function isPopupVisible() {
    var ov = document.getElementById('tn-ov');
    if (!ov || !ov.classList.contains('show')) return false;
    if (ov.classList.contains('mini')) return false;
    return true;
  }

  function isGuideVisible() {
    var g = document.getElementById('tn-guide');
    return g && g.offsetParent !== null;
  }

  function isCaptchaVisible() {
    var cap = document.getElementById('tn-captcha');
    if (!cap) return false;
    return cap.style.display !== 'none' && cap.style.display !== '';
  }

  // ============================================================
  // ★ XỬ LÝ POPUP GATE
  // ============================================================
  function handlePopupGate() {
    if (!isPopupVisible()) return false;

    var msg = getPopupMsg();
    var sub = getPopupSub();
    var msgLc = msg.toLowerCase();
    var subLc = sub.toLowerCase();

    if (msg === st.lastPopupMsg && (Date.now() - st.lastPopupTime) < 2000) {
      return true;
    }
    st.lastPopupMsg = msg;
    st.lastPopupTime = Date.now();

    log('Popup gate:', msg, '|', sub);

    if (msgLc.indexOf('chạm') !== -1 || subLc.indexOf('chạm') !== -1 ||
        msgLc.indexOf('tạm dừng') !== -1) {
      setTimeout(function() { fakeTouch(); }, rnd(300, 800));
      return true;
    }
    if (msgLc.indexOf('lướt lên') !== -1 || msgLc.indexOf('lên đầu') !== -1 ||
        msgLc.indexOf('lên trang') !== -1 || subLc.indexOf('lên đầu') !== -1) {
      setTimeout(function() { fakeScroll('top'); }, rnd(300, 800));
      return true;
    }
    if (msgLc.indexOf('cuộn xuống') !== -1 || msgLc.indexOf('xuống cuối') !== -1 ||
        msgLc.indexOf('xuống trang') !== -1 || subLc.indexOf('xuống cuối') !== -1) {
      setTimeout(function() { fakeScroll('bottom'); }, rnd(300, 800));
      return true;
    }
    if (msgLc.indexOf('để tiếp tục') !== -1 || subLc.indexOf('để tiếp tục') !== -1) {
      setTimeout(function() { fakeTouch(); }, rnd(300, 800));
      return true;
    }
    return false;
  }

  // ============================================================
  // ★ XỬ LÝ BƯỚC 2
  // ============================================================
  function handleStep2Guide() {
    if (!CFG.autoStep2) return false;
    if (!isGuideVisible()) return false;
    if (Date.now() - st.lastStep2Time < 5000) return false;

    var guide = document.getElementById('tn-guide');
    if (!guide) return false;

    var link = guide.querySelector('a.tn-step2-link, #tn-s2img');
    if (link && link.href && !link.href.startsWith('javascript:')) {
      st.lastStep2Time = Date.now();
      st.step2Count++;
      log('★ BƯỚC 2: click', link.href);
      updatePanel();
      setTimeout(function() {
        try {
          try { localStorage.setItem('tn_link_clicked', '1'); } catch (e) {}
          link.scrollIntoView({ behavior: 'instant', block: 'center' });
          link.click();
        } catch (e) { log('Lỗi click bước 2:', e.message); }
      }, rnd(1500, 3000));
      return true;
    }
    return false;
  }

  // ============================================================
  // ★ XỬ LÝ NÚT CHÍNH
  // ============================================================
  function handleMainButton() {
    var btn = document.getElementById('tn-btn');
    if (!btn || btn.style.display === 'none') return false;

    var code = readCode();
    if (code && code.length >= 4 && code !== st.lastCode) {
      st.lastCode = code;
      st.codeCount++;
      log('★ CÓ MÃ:', code);
      updatePanel();
      if (CFG.autoCopyCode) {
        setTimeout(function() {
          try { GM_setClipboard(code); } catch (e) {
            try { navigator.clipboard.writeText(code); } catch (e2) {}
          }
          try { btn.click(); } catch (e) {}
          showToast('♛ ĐÃ COPY MÃ: ' + code + ' ♛', 5000, 'success');
        }, rnd(500, 1000));
      }
      return true;
    }

    var btnText = readBtnText();
    if (btnText.indexOf('vui lòng đợi') !== -1) return false;
    if (btnText.indexOf('đang tải') !== -1) return false;

    if (btnText === '' || btnText === 'st' || btnText.indexOf('bắt đầu') !== -1 ||
        btnText.indexOf('lấy mã') !== -1) {
      if (Date.now() - st.lastClickTime < 3000) return true;
      st.lastClickTime = Date.now();
      log('Click nút sẵn sàng');
      setTimeout(function() {
        try { btn.click(); st.clickCount++; updatePanel(); } catch (e) {}
      }, rnd(800, 1500));
      return true;
    }
    return false;
  }

  // ============================================================
  // ★ AUTO LOOP
  // ============================================================
  var loopTimer = null;

  function autoLoop() {
    if (!st.autoRunning) {
      loopTimer = setTimeout(autoLoop, 2000);
      return;
    }

    removeIncognitoOverlay();

    try {
      // ★ 1. Đọc link bước 1 → tự mở (chỉ chạy 1 lần)
      if (CFG.autoReadLink && st.linkOpenCount === 0) {
        var url = readTargetUrl();
        if (url) {
          var opened = openTargetLink();
          if (opened) {
            loopTimer = setTimeout(autoLoop, 3000);
            return;
          }
        }
      }

      // 2. Popup gate
      if (handlePopupGate()) {
        loopTimer = setTimeout(autoLoop, CFG.pollMs);
        return;
      }

      // 3. Bước 2
      if (handleStep2Guide()) {
        loopTimer = setTimeout(autoLoop, CFG.pollMs);
        return;
      }

      // 4. Captcha (không xử lý)
      if (isCaptchaVisible()) {
        loopTimer = setTimeout(autoLoop, CFG.pollMs);
        return;
      }

      // 5. Nút chính
      if (handleMainButton()) {
        loopTimer = setTimeout(autoLoop, CFG.pollMs);
        return;
      }

    } catch (e) {
      log('Loop error:', e.message);
    }

    loopTimer = setTimeout(autoLoop, CFG.pollMs);
  }

  // ============================================================
  // ★ UI PANEL
  // ============================================================
  function buildCSS() {
    return [
      '@keyframes stDance{0%,100%{transform:translateY(0) rotate(-6deg) scale(1)}25%{transform:translateY(-6px) rotate(4deg) scale(1.08)}50%{transform:translateY(0) rotate(6deg) scale(1)}75%{transform:translateY(-6px) rotate(-4deg) scale(1.08)}}',
      '@keyframes stPulse{0%,100%{box-shadow:0 0 0 0 rgba(233,30,99,.5)}50%{box-shadow:0 0 0 10px rgba(233,30,99,0)}}',
      '@keyframes stGlow{0%,100%{text-shadow:0 0 8px rgba(255,255,255,.5)}50%{text-shadow:0 0 14px rgba(255,255,255,.9),0 0 20px rgba(255,20,147,.6)}}',
      '@keyframes stSparkle{0%,100%{opacity:.4;transform:scale(.8) rotate(0)}50%{opacity:1;transform:scale(1.2) rotate(180deg)}}',
      '@keyframes stFloat{0%,100%{transform:translateY(0) rotate(-3deg) scale(1)}50%{transform:translateY(-5px) rotate(3deg) scale(1.08)}}',
      '@keyframes stHeaderFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
      '@keyframes stFadeIn{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}',
      '@keyframes stShine{0%{background-position:-200% 0}100%{background-position:200% 0}}',

      '#st-root{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;width:340px;max-width:calc(100vw - 16px);font-family:"Quicksand","Segoe UI",Arial,sans-serif;font-size:10px;color:#AD1457;background:linear-gradient(165deg,#FFF0F5 0%,#FCE4EC 45%,#F8BBD0 100%);border-radius:20px;user-select:none;max-height:88vh;overflow:visible;display:flex;flex-direction:column;box-shadow:0 6px 22px rgba(233,30,99,.35),0 0 0 2px rgba(255,255,255,.9) inset;border:2.5px solid #F48FB1}',
      '#st-root *{box-sizing:border-box}',
      '#st-root.st-min{width:64px !important;max-width:64px !important;border-radius:50% !important;top:8px;left:auto;right:8px;transform:none;padding:0;background:radial-gradient(circle at 30% 30%,#FFD9E8,#FF69B4 70%);border:3px solid #FFF;animation:stPulse 2s infinite;overflow:hidden}',
      '#st-root.st-min .st-head{padding:12px 0;text-align:center;border-radius:50%;background:transparent;border:none}',
      '#st-root.st-min .st-brand-txt,#st-root.st-min .st-body,#st-root.st-min .st-foot,#st-root.st-min .st-head-actions{display:none}',
      '#st-root.st-min .st-rose{font-size:0 !important;width:52px;height:52px;display:block;background-image:url("https://media.giphy.com/media/11c7UUfN4eoHF6/giphy.gif");background-size:contain;background-repeat:no-repeat;background-position:center;border-radius:50%}',

      '.st-head{padding:12px 14px;background:linear-gradient(135deg,#E91E63 0%,#D81B60 25%,#F48FB1 50%,#D81B60 75%,#E91E63 100%);background-size:200% 200%;border-radius:17px 17px 0 0;position:relative;overflow:hidden;animation:stHeaderFlow 5s ease-in-out infinite}',
      '.st-head::before{content:"✨";position:absolute;top:8px;left:50%;font-size:12px;animation:stSparkle 2s infinite;color:#FFF}',
      '.st-brand{display:flex;align-items:center;gap:11px;position:relative;z-index:1}',
      '.st-rose{width:52px;height:52px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%,#FFE4F0,#F48FB1 80%);border-radius:50%;animation:stDance 0.6s ease-in-out infinite;filter:drop-shadow(0 4px 10px rgba(233,30,99,.7));position:relative;overflow:hidden;border:2.5px solid #FFF}',
      '.st-rose img{width:100%;height:100%;object-fit:contain;position:absolute;z-index:2;border-radius:50%}',
      '.st-title-main{font-family:"Quicksand",sans-serif;font-size:13px;font-weight:900;color:#FFF;letter-spacing:1.5px;line-height:1.15;animation:stGlow 2s ease-in-out infinite}',
      '.st-title-sub{font-family:"Quicksand",sans-serif;font-size:7.5px;letter-spacing:2px;font-weight:800;margin-top:2px;color:#FCE4EC;text-transform:uppercase}',
      '.st-head-actions{position:absolute;top:8px;right:8px;display:flex;gap:5px;z-index:12}',
      '.st-icon-btn{width:20px;height:20px;border-radius:50%;border:1.8px solid rgba(255,255,255,.75);background:rgba(255,255,255,.25);color:#FFF;font-size:11px;font-weight:900;line-height:1;padding:0;cursor:pointer;transition:all .2s}',
      '.st-icon-btn:hover{background:rgba(255,255,255,.5);transform:scale(1.1) rotate(90deg)}',

      '.st-body{padding:9px;overflow-y:auto;flex:1;display:grid;grid-template-columns:1fr 1fr;gap:7px;-webkit-overflow-scrolling:touch}',
      '.st-body::-webkit-scrollbar{width:5px}',
      '.st-body::-webkit-scrollbar-thumb{background:linear-gradient(#F48FB1,#E91E63);border-radius:3px}',
      '.st-body .st-full{grid-column:1/-1}',
      '.st-status{grid-column:1/-1;background:#FFFFFF;border-radius:12px;padding:8px 13px;border-left:5px solid #E91E63;font-family:"Quicksand",sans-serif;font-size:10.5px;font-weight:800;color:#AD1457;text-align:center;letter-spacing:.5px;box-shadow:0 2px 6px rgba(233,30,99,.15);position:relative;overflow:hidden;animation:stFadeIn .4s ease-out}',
      '.st-status::after{content:"";position:absolute;top:0;left:-200%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(244,143,177,.5),transparent);animation:stShine 3s infinite}',
      '.st-section{background:rgba(255,255,255,.96);border-radius:13px;padding:8px;border:1.5px solid #F8BBD0;box-shadow:0 2px 6px rgba(233,30,99,.1);animation:stFadeIn .5s ease-out}',
      '.st-section-title{font-family:"Quicksand",sans-serif;font-size:9px;font-weight:900;letter-spacing:1px;margin-bottom:6px;color:#D81B60;text-transform:uppercase;display:flex;align-items:center;gap:5px}',
      '.st-section-title .r{font-size:12px;animation:stFloat 2s infinite}',
      '.st-stat-row{display:flex;justify-content:space-between;padding:4px 0;font-size:10px;border-bottom:1px solid rgba(244,143,177,.2)}',
      '.st-stat-row:last-child{border-bottom:none}',
      '.st-stat-label{color:#AD1457;font-weight:700}',
      '.st-stat-value{color:#E91E63;font-weight:900;font-family:"Courier New",monospace;font-size:11px}',
      '.st-stat-value.ok{color:#2E7D32}',
      '.st-stat-value.warn{color:#F57C00}',
      '.st-btn{padding:9px 12px;border:none;border-radius:10px;font-family:"Quicksand",sans-serif;font-weight:900;font-size:10px;cursor:pointer;color:#FFF;background:linear-gradient(135deg,#F48FB1,#E91E63);text-transform:uppercase;letter-spacing:.4px;box-shadow:0 3px 8px rgba(233,30,99,.3);transition:all .15s;width:100%}',
      '.st-btn:hover{transform:translateY(-1px);box-shadow:0 5px 12px rgba(233,30,99,.4)}',
      '.st-btn:active{transform:scale(.96)}',
      '.st-btn.gray{background:linear-gradient(135deg,#CE93D8,#8E24AA)}',
      '.st-btn.green{background:linear-gradient(135deg,#66BB6A,#2E7D32)}',
      '.st-btn.gold{background:linear-gradient(135deg,#FF80AB,#EC407A)}',
      '.st-foot{display:flex;justify-content:center;align-items:center;gap:6px;padding:7px;color:#FFF;font-family:"Quicksand",sans-serif;font-size:8px;font-weight:800;letter-spacing:1.3px;background:linear-gradient(135deg,#E91E63,#F48FB1);border-radius:0 0 17px 17px}',
      '.st-foot .r{color:#FFF;font-size:12px;animation:stFloat 1.6s infinite}',

      '#st-toast{position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#E91E63,#F48FB1);color:#FFF;padding:12px 22px;border-radius:22px;font-family:"Quicksand",sans-serif;font-size:12px;font-weight:800;z-index:2147483647;border:2.5px solid #FFF;pointer-events:none;letter-spacing:.6px;max-width:calc(100vw - 32px);text-align:center;box-shadow:0 6px 20px rgba(233,30,99,.5);animation:stFadeIn .3s}',
      '#st-toast.success{background:linear-gradient(135deg,#66BB6A,#2E7D32)}',
      '#st-toast.error{background:linear-gradient(135deg,#EF5350,#C62828)}',

      '@media (max-width:400px){#st-root{width:calc(100vw - 12px) !important;top:4px;font-size:9px}.st-rose{width:38px;height:38px}.st-title-main{font-size:11px}}'
    ].join('\n');
  }

  function showToast(msg, ms, type) {
    var old = document.getElementById('st-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.id = 'st-toast';
    if (type) t.className = type;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { if (t.parentNode) t.remove(); }, ms || 2500);
  }

  // ============================================================
  // ★ BUILD PANEL
  // ============================================================
  var UI = {};

  function buildPanel() {
    if (!document.body) { setTimeout(buildPanel, 200); return; }
    var old = document.getElementById('st-root');
    if (old) old.remove();

    try { GM_addStyle(buildCSS()); } catch (e) {
      var s = document.createElement('style');
      s.textContent = buildCSS();
      document.head.appendChild(s);
    }

    var html = [
      '<div class="st-head">',
      ' <div class="st-head-actions">',
      '  <button class="st-icon-btn" id="st-min">−</button>',
      '  <button class="st-icon-btn" id="st-close">✕</button>',
      ' </div>',
      ' <div class="st-brand">',
      '  <div class="st-rose"><img src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" alt="✿" /></div>',
      '  <div class="st-brand-txt">',
      '   <div class="st-title-main">✦ SITETOP AUTO ✦</div>',
      '   <div class="st-title-sub">♛ v2.0 · BY THANH TUẤN ♛</div>',
      '  </div>',
      ' </div>',
      '</div>',
      '<div class="st-body">',
      ' <div class="st-status" id="st-status">✧ Sẵn sàng ✧</div>',
      ' <div class="st-section st-full">',
      '  <div class="st-section-title"><span class="r">📊</span> TRẠNG THÁI</div>',
      '  <div class="st-stat-row"><span class="st-stat-label">Mở link đích</span><span class="st-stat-value" id="st-linkopen">0</span></div>',
      '  <div class="st-stat-row"><span class="st-stat-label">Chạm màn hình</span><span class="st-stat-value" id="st-touch">0</span></div>',
      '  <div class="st-stat-row"><span class="st-stat-label">Cuộn trang</span><span class="st-stat-value" id="st-scroll">0</span></div>',
      '  <div class="st-stat-row"><span class="st-stat-label">Click nút</span><span class="st-stat-value" id="st-click">0</span></div>',
      '  <div class="st-stat-row"><span class="st-stat-label">Bước 2</span><span class="st-stat-value" id="st-step2">0</span></div>',
      '  <div class="st-stat-row"><span class="st-stat-label">Mã đã lấy</span><span class="st-stat-value ok" id="st-code">0</span></div>',
      ' </div>',
      ' <div class="st-section st-full">',
      '  <div class="st-section-title"><span class="r">🔗</span> LINK ĐÍCH</div>',
      '  <div class="st-stat-row"><span class="st-stat-label">URL</span><span class="st-stat-value" id="st-url" style="font-size:8px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">--</span></div>',
      '  <button class="st-btn gold" id="st-open" style="width:100%;margin-top:5px">🚀 MỞ LINK NGAY</button>',
      ' </div>',
      ' <div class="st-section st-full">',
      '  <div class="st-section-title"><span class="r">⚙</span> ĐIỀU KHIỂN</div>',
      '  <button class="st-btn green" id="st-toggle">⏸ DỪNG AUTO</button>',
      '  <button class="st-btn gray" id="st-reset" style="margin-top:5px">🔄 RESET</button>',
      ' </div>',
      '</div>',
      '<div class="st-foot"><span class="r">✿</span><span>♛ (c) THANHTUAN ♛</span><span class="r">✿</span></div>'
    ].join('');

    var root = document.createElement('div');
    root.id = 'st-root';
    root.innerHTML = html;
    document.body.appendChild(root);

    UI = {
      root: root,
      status: root.querySelector('#st-status'),
      linkopen: root.querySelector('#st-linkopen'),
      touch: root.querySelector('#st-touch'),
      scroll: root.querySelector('#st-scroll'),
      click: root.querySelector('#st-click'),
      step2: root.querySelector('#st-step2'),
      code: root.querySelector('#st-code'),
      url: root.querySelector('#st-url'),
      open: root.querySelector('#st-open'),
      toggle: root.querySelector('#st-toggle'),
      reset: root.querySelector('#st-reset'),
      min: root.querySelector('#st-min'),
      close: root.querySelector('#st-close')
    };

    UI.min.onclick = function() {
      var m = UI.root.classList.toggle('st-min');
      this.textContent = m ? '+' : '−';
    };

    UI.close.onclick = function() { UI.root.style.display = 'none'; };

    UI.toggle.onclick = function() {
      st.autoRunning = !st.autoRunning;
      this.textContent = st.autoRunning ? '⏸ DỪNG AUTO' : '▶ BẮT ĐẦU AUTO';
      this.className = 'st-btn ' + (st.autoRunning ? 'green' : 'gold');
      showToast(st.autoRunning ? '⚡ Auto BẬT' : '⏸ Auto TẮT', 2000);
      if (st.autoRunning) { if (loopTimer) clearTimeout(loopTimer); autoLoop(); }
    };

    UI.reset.onclick = function() {
      st.touchCount = 0; st.scrollCount = 0; st.clickCount = 0;
      st.codeCount = 0; st.step2Count = 0; st.linkOpenCount = 0;
      st.lastCode = ''; st.lastPopupMsg = ''; st.openedLinks = [];
      st.startedAt = Date.now();
      updatePanel();
      showToast('♛ Đã reset ♛', 2000);
    };

    UI.open.onclick = function() {
      st.openedLinks = [];
      st.linkOpenCount = 0;
      var url = readTargetUrl();
      if (url) {
        st.currentLink = url;
        UI.url.textContent = url;
      }
      openTargetLink();
    };

    updatePanel();
    setInterval(updatePanel, 1000);
  }

  function updatePanel() {
    if (!UI || !UI.touch) return;
    UI.linkopen.textContent = st.linkOpenCount;
    UI.touch.textContent = st.touchCount;
    UI.scroll.textContent = st.scrollCount;
    UI.click.textContent = st.clickCount;
    UI.step2.textContent = st.step2Count;
    UI.code.textContent = st.codeCount;

    // Hiện URL
    var url = st.currentLink || readTargetUrl();
    if (url && UI.url) {
      UI.url.textContent = url;
      UI.url.title = url;
    }

    if (UI.status) {
      if (!st.autoRunning) {
        UI.status.textContent = '⏸ Đã dừng';
      } else {
        var code = readCode();
        if (code) UI.status.textContent = '✓ CÓ MÃ: ' + code;
        else if (st.linkOpenCount > 0 && !document.getElementById('tn-btn')) {
          UI.status.textContent = '⏳ Đã mở link — chờ web đích...';
        } else {
          var cd = readCountdown();
          var popupMsg = getPopupMsg();
          if (popupMsg) UI.status.textContent = '⏳ ' + popupMsg.substring(0, 35);
          else if (cd !== null) UI.status.textContent = '⏱ Đếm ngược: ' + cd + 's';
          else UI.status.textContent = '⚡ Đang auto...';
        }
      }
    }
  }

  // ============================================================
  // ★ OBSERVER
  // ============================================================
  function observeDOM() {
    var observer = new MutationObserver(function() {
      if (!st.autoRunning) return;
      var ov = document.getElementById('tn-ov');
      if (ov && ov.classList.contains('show') && !ov.classList.contains('mini')) {
        setTimeout(handlePopupGate, 300);
      }
      if (document.getElementById('tn-guide')) {
        setTimeout(handleStep2Guide, 500);
      }
      if (document.getElementById('incognito-overlay')) {
        removeIncognitoOverlay();
      }
    });
    observer.observe(document.body, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['class', 'style']
    });
  }

  // ============================================================
  // ★ BOOT
  // ============================================================
  function boot() {
    if (!document.body) { setTimeout(boot, 200); return; }

    log('========================================');
    log('SITETOP AUTO v2.0 - START');
    log('========================================');

    buildPanel();
    observeDOM();

    // Tự mở link sau 1s
    setTimeout(function() {
      log('Auto loop bắt đầu');
      autoLoop();
    }, 1000);

    // Auto touch định kỳ 25s
    setInterval(function() {
      if (st.autoRunning && CFG.autoTouch) fakeTouch();
    }, 25000);

    log('Boot hoàn tất');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
