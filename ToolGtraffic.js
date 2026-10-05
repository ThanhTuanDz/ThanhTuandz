// ==UserScript==
// @name         THANH TUAN AUTO GTRAFFIC.IO v49.0.0 - KITTY ULTIMATE
// @namespace    thanhtuan.gtraffic
// @version      49.0.0-kitty-ultimate
// @description  Auto gtraffic + dichvutask + robuxreward + OCR + CF + GIF + TIMER ĐẸP + MENU CHUYỂN ĐỘNG
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
    var HOST = location.hostname, IS_TOP = (window === window.top), isGtraffic = /(^|\.)gtraffic\.io$/i.test(HOST), isGoogle = /(^|\.)google\./i.test(HOST), isDichvuTask = /(^|\.)dichvutask\.xyz$/i.test(HOST), isRobuxReward = /(^|\.)robuxreward\.top$/i.test(HOST);
    var CFG = { poll: 8, googlePoll: 0, targetPoll: 6, gk: 'mpgt_', watchdogMs: 3000, defaultCountdown: 60, codeTimeoutMs: 45000, navCooldownMs: 800, fillRetryMax: 999, fillRetryDelay: 300, backDelay: 200, leaveCheckMs: 200, fillLoopMax: 999, fillLoopDelay: 100, fillHoldVerifyMs: 550, fillVerifyIntervalMs: 40, maxEmptyBeforeNop: 5, nativePasteDelayMin: 8, nativePasteDelayMax: 25, postSubmitCheckMs: 320, postSubmitCheckMax: 12, minCodeScore: 130, maxCodeScanDistance: 99999, getLinkPollMs: 0, getLinkTimeoutMs: 15000, minWaitBeforeSearchMs: 0, codeBackupTTL: 600000, dichvuTaskPoll: 1000, dichvuClickCooldownMs: 7000, dichvuCreatedUrlsTTL: 86400000, dichvuOutsideCooldownMs: 4000, autoFillDelayMs: 800, ocrDelayMs: 500, ocrTimeoutMs: 25000, waitCountdownMaxMs: 90000, scanBtnMaxMs: 12000, apiRetryInterval: 5000, gBtnDelayMs: 3000, robuxPollMs: 1500, robuxCooldownMs: 15000, robuxModalDelayMs: 15000, dichvuTaskPath: '/client/vuot-link' };
    var STATE = { IDLE: 'idle', GOOGLE_SEARCH: 'google-search', GOOGLE_CLICK: 'google-click', SCAN_BTN: 'scan-btn', WAIT_COUNTDOWN: 'wait-countdown', GET_CODE: 'get-code', BACK_GTRAFFIC: 'back-gtraffic', FILL_CODE: 'fill-code', DONE: 'done', DICHVU_TASK: 'dichvu-task', ROBUX_TASK: 'robux-task', ROBUX_CLAIM: 'robux-claim' };

    // ★★★ HELLO KITTY GIFS (nhiều nguồn dự phòng) ★★★
    var GIF_CLOSE = 'https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyeHc0eGdsb29pMG96Nzc3d2o2bG1kY2FnMzVtbnZ5eWp3bXNpODN4cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kZqbBT64ECtjy/giphy.gif';
    var GIF_BOW = 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif';
    var GIF_KITTY_DANCE = 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif';
    var GIF_KITTY_DANCE_ALT = 'https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyeHc0eGdsb29pMG96Nzc3d2o2bG1kY2FnMzVtbnZ5eWp3bXNpODN4cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kZqbBT64ECtjy/giphy.gif';
    var GIF_KITTY_DANCE_ALT2 = 'https://media.giphy.com/media/l0HlMW1sAKmFB8FWw/giphy.gif';

    var __origWindowOpen = window.open, __openBlockKey = '__tt_open_blocked_' + location.href.split('?')[0].split('#')[0], __openCount = 0;
    try { if (sessionStorage.getItem(__openBlockKey) === '1') { __openCount = 999; } } catch (e) {}
    window.open = function(url, name, features) { try { if (sessionStorage.getItem(__openBlockKey) === '1') { console.log('[TT] OPEN BLOCKED: ' + url); return null; } __openCount++; if (__openCount > 1) { console.log('[TT] OPEN BLOCKED count=' + __openCount + ': ' + url); return null; } sessionStorage.setItem(__openBlockKey, '1'); console.log('[TT] OPEN ALLOWED: ' + url); return __origWindowOpen.apply(window, arguments); } catch (e) { return __origWindowOpen.apply(window, arguments); } };
    function dichvuArmOpenGuard() { }
    var S = {
        get: function(k, d) { try { var v = GM_getValue(CFG.gk + k, d); return v === undefined ? d : v; } catch (e) { return d; } },
        set: function(k, v) { try { GM_setValue(CFG.gk + k, v); } catch (e) {} },
        del: function(k) { try { GM_deleteValue(CFG.gk + k); } catch (e) {} },
        reset: function() { var keys = ['state','stateSetAt','targetUrl','lastServerSec','lastClickTime','serverTotalSec','filled','confirmed','googleClickTries','navigatingBack','cdStartSec','cdStartAt','btnClickAt','gotCodeAt','codeAttempts','lastNavUrl','lastNavAt','backDone','leavingAt','lastCopyOk','lastCopyText','hardStop','countdownRealZero','getLinkClicked','waitingGetLink','getLinkDeadline','getLinkStartAt','childTabOpen','codeReadySignal','dichvuStage','dichvuClickAt','dichvuCreateCount','dichvuDoneAt']; for (var i = 0; i < keys.length; i++) S.del(keys[i]); },
        resetFull: function() { S.reset(); try { S.del('code'); } catch (e) {} try { S.del('codeBackup'); } catch (e) {} try { S.del('codeBackupAt'); } catch (e) {} try { S.del('codeHardLock'); } catch (e) {} try { S.del('codeHardLockAt'); } catch (e) {} try { S.del('codeFoundAt'); } catch (e) {} try { S.del('inFlow'); } catch (e) {} try { S.del('domain'); } catch (e) {} try { S.del('keyword'); } catch (e) {} try { S.del('gtrafficUrl'); } catch (e) {} try { S.del('pendingAutoReset'); } catch (e) {} }
    };
    var DICHVU_LOCK = {
        keyBase: function() { try { var u = new URL(location.href); return 'tt_dv_lock_' + u.origin + u.pathname.replace(/\/$/, ''); } catch (e) { return 'tt_dv_lock_' + location.href.split('?')[0].split('#')[0]; } },
        isLocked: function() { try { return sessionStorage.getItem(DICHVU_LOCK.keyBase()) === '1'; } catch (e) { return false; } },
        lock: function() { try { sessionStorage.setItem(DICHVU_LOCK.keyBase(), '1'); } catch (e) {} },
        unlock: function() { try { sessionStorage.removeItem(DICHVU_LOCK.keyBase()); } catch (e) {} },
        isCreateLocked: function() { try { return sessionStorage.getItem(DICHVU_LOCK.keyBase() + '_create') === '1'; } catch (e) { return false; } },
        lockCreate: function() { try { sessionStorage.setItem(DICHVU_LOCK.keyBase() + '_create', '1'); } catch (e) {} },
        unlockCreate: function() { try { sessionStorage.removeItem(DICHVU_LOCK.keyBase() + '_create'); } catch (e) {} },
        unlockAll: function() { try { DICHVU_LOCK.unlock(); DICHVU_LOCK.unlockCreate(); var toDel = []; for (var i = 0; i < sessionStorage.length; i++) { var k = sessionStorage.key(i); if (k && k.indexOf('tt_dv_lock_') === 0) toDel.push(k); } for (var j = 0; j < toDel.length; j++) { try { sessionStorage.removeItem(toDel[j]); } catch (e) {} } } catch (e) {} }
    };
    var DICHVU_URLS = {
        getList: function() { try { var raw = S.get('dichvuCreatedUrls', '[]'); var list = (typeof raw === 'string') ? JSON.parse(raw) : (raw || []); var now = Date.now(); var ttl = CFG.dichvuCreatedUrlsTTL; var fresh = []; for (var i = 0; i < list.length; i++) { if (list[i].t && (now - list[i].t) < ttl) fresh.push(list[i]); } return fresh; } catch (e) { return []; } },
        has: function(url) { if (!url) return false; var list = DICHVU_URLS.getList(); var norm = DICHVU_URLS.normalize(url); for (var i = 0; i < list.length; i++) { if (list[i].u === norm) return true; } return false; },
        add: function(url) { if (!url) return; var list = DICHVU_URLS.getList(); var norm = DICHVU_URLS.normalize(url); for (var i = 0; i < list.length; i++) { if (list[i].u === norm) return; } list.unshift({ u: norm, t: Date.now() }); if (list.length > 100) list.length = 100; try { S.set('dichvuCreatedUrls', JSON.stringify(list)); } catch (e) {} },
        normalize: function(url) { try { var u = new URL(url); return u.origin + u.pathname.replace(/\/$/, ''); } catch (e) { return (url || '').split('?')[0].split('#')[0].replace(/\/$/, ''); } },
        count: function() { return DICHVU_URLS.getList().length; }
    };
    function normalizeKeyword(k) {
        if (!k) return '';
        var s = (k + '').toLowerCase();
        try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
        s = s.replace(/đ/g, 'd');
        s = s.replace(/[\s_\-\.\,\:\;\/\\]+/g, '').trim();
        return s;
    }
    var KEYWORD_MAP = {
        getList: function() { try { var raw = S.get('keywordMap', '[]'); var list = (typeof raw === 'string') ? JSON.parse(raw) : (raw || []); return Array.isArray(list) ? list : []; } catch (e) { return []; } },
        save: function(keyword, domain) {
            if (!keyword || !domain) return false;
            var raw = (keyword + '').trim();
            var norm = normalizeKeyword(raw);
            domain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
            if (!norm || !domain) return false;
            var list = KEYWORD_MAP.getList();
            for (var i = 0; i < list.length; i++) { var listNorm = normalizeKeyword(list[i].k); if (listNorm === norm) { list[i].k = raw; list[i].d = domain; list[i].t = Date.now(); S.set('keywordMap', JSON.stringify(list)); return true; } }
            list.unshift({ k: raw, d: domain, t: Date.now() });
            if (list.length > 200) list.length = 200;
            S.set('keywordMap', JSON.stringify(list));
            return true;
        },
        lookup: function(keyword) {
            if (!keyword) return null;
            var norm = normalizeKeyword(keyword);
            if (!norm) return null;
            var list = KEYWORD_MAP.getList();
            for (var i = 0; i < list.length; i++) { if (normalizeKeyword(list[i].k) === norm) return list[i].d; }
            for (var j = 0; j < list.length; j++) { var lk = normalizeKeyword(list[j].k); if (lk && (norm.indexOf(lk) !== -1 || lk.indexOf(norm) !== -1)) return list[j].d; }
            return null;
        },
        remove: function(keyword) { var list = KEYWORD_MAP.getList(); var out = []; var norm = normalizeKeyword(keyword); for (var i = 0; i < list.length; i++) { if (normalizeKeyword(list[i].k) !== norm) out.push(list[i]); } S.set('keywordMap', JSON.stringify(out)); },
        count: function() { return KEYWORD_MAP.getList().length; }
    };
    var __tesseractLoading = null;
    var __tesseractWorker = null;
    function loadTesseract() {
        if (__tesseractWorker) return Promise.resolve(__tesseractWorker);
        if (__tesseractLoading) return __tesseractLoading;
        __tesseractLoading = new Promise(function(resolve, reject) {
            var timeout = setTimeout(function() { reject(new Error('Load Tesseract timeout')); }, CFG.ocrTimeoutMs);
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js';
            script.onload = function() {
                clearTimeout(timeout);
                if (typeof Tesseract === 'undefined') { reject(new Error('Tesseract not defined')); return; }
                try {
                    Tesseract.createWorker(['vie', 'eng'], 1, {
                        logger: function(m) { if (m.status === 'recognizing text') log('OCR progress: ' + Math.round(m.progress * 100) + '%'); },
                        errorHandler: function(err) { log('OCR worker error: ' + err); }
                    }).then(function(worker) { __tesseractWorker = worker; log('Tesseract ready'); resolve(worker); }).catch(function(err) { reject(err); });
                } catch (e) { reject(e); }
            };
            script.onerror = function() { clearTimeout(timeout); reject(new Error('Load Tesseract failed')); };
            document.head.appendChild(script);
        });
        return __tesseractLoading;
    }
    function findKeywordImage() {
        var img = document.querySelector('img[alt="Từ khóa nhiệm vụ"]');
        if (img) return img;
        var allImg = document.querySelectorAll('img');
        for (var i = 0; i < allImg.length; i++) { var alt = (allImg[i].alt || '').toLowerCase(); if (alt.indexOf('khóa') !== -1 || alt.indexOf('khoa') !== -1 || alt.indexOf('keyword') !== -1 || alt.indexOf('từ khóa') !== -1) return allImg[i]; }
        for (var j = 0; j < allImg.length; j++) { var im = allImg[j]; if (im.closest && im.closest('#tt-root')) continue; var w = im.naturalWidth || im.width || 0; var h = im.naturalHeight || im.height || 0; if (w >= 80 && w <= 200 && h >= 30 && h <= 100) { if (im.src && im.src.indexOf('data:image') === 0) return im; } }
        return null;
    }
    function ocrImage(img) {
        return new Promise(function(resolve, reject) {
            if (!img) { reject(new Error('No image')); return; }
            loadTesseract().then(function(worker) {
                try {
                    var canvas = document.createElement('canvas');
                    var scale = 3;
                    canvas.width = (img.naturalWidth || img.width || 220) * scale;
                    canvas.height = (img.naturalHeight || img.height || 108) * scale;
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    var dataUrl = canvas.toDataURL('image/png');
                    worker.recognize(dataUrl).then(function(result) { var txt = (result && result.data && result.data.text) ? result.data.text : ''; txt = txt.replace(/\s+/g, ' ').trim(); resolve(txt); }).catch(function(err) { reject(err); });
                } catch (e) { reject(e); }
            }).catch(function(err) { reject(err); });
        });
    }
    function scanDichvuKeyword() {
        return new Promise(function(resolve) {
            try {
                var img = findKeywordImage();
                if (!img) { resolve(''); return; }
                ocrImage(img).then(function(rawText) {
                    if (!rawText) { resolve(''); return; }
                    var cleaned = rawText.replace(/\s+/g, ' ').trim();
                    cleaned = cleaned.replace(/[^\p{L}\p{N}\s\-_.]/gu, '').replace(/\s+/g, ' ').trim();
                    resolve(cleaned);
                }).catch(function() { resolve(''); });
            } catch (e) { resolve(''); }
        });
    }
    function autoFillAndStart() {
        if (!IS_TOP || !isGtraffic) return false;
        if (getState() !== STATE.IDLE) return false;
        if (S.get('pendingAutoReset') === '1') return false;
        if (S.get('inFlow') === '1') return false;
        log('AUTO-FILL: ★ BAT DAU ★');
        if (UI && UI.status) UI.status.textContent = '🎀 Đang OCR keyword... 🐱';
        scanDichvuKeyword().then(function(keyword) {
            if (!keyword) { if (UI && UI.status) UI.status.textContent = '🎀 OCR không đọc được 🐱'; return; }
            var domain = KEYWORD_MAP.lookup(keyword);
            if (!domain) { if (UI && UI.status) UI.status.textContent = '🎀 Keyword: ' + keyword + ' — chưa có domain 🐱'; if (UI && UI.kwInput) UI.kwInput.value = keyword; return; }
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
    var DOMAINS = {
        getList: function() { try { var raw = S.get('savedDomains', '[]'); return typeof raw === 'string' ? JSON.parse(raw) : (raw || []); } catch (e) { return []; } },
        save: function(domain) { var d = (domain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''); if (!d) return false; var list = DOMAINS.getList(); for (var i = 0; i < list.length; i++) if (list[i].d === d) return false; list.unshift({ d: d, t: Date.now() }); if (list.length > 30) list.length = 30; S.set('savedDomains', JSON.stringify(list)); return true; },
        remove: function(d) { var list = DOMAINS.getList(); var out = []; for (var i = 0; i < list.length; i++) if (list[i].d !== d) out.push(list[i]); S.set('savedDomains', JSON.stringify(out)); }
    };
    function log() { try { console.log.apply(console, arguments); } catch (e) {} }

    function showGifOverlay(ms, customGif) {
        if (!IS_TOP || !document.body) return;
        var old = document.getElementById('tt-gif-overlay');
        if (old) old.remove();
        var ov = document.createElement('div');
        ov.id = 'tt-gif-overlay';
        var img = document.createElement('img');
        img.src = customGif || GIF_CLOSE;
        img.onerror = function() { ov.innerHTML = '<div style="font-size:140px;animation:ttKittyFloat 1.5s infinite">🐱🎀</div>'; };
        ov.appendChild(img);
        document.body.appendChild(ov);
        setTimeout(function(){ if (ov.parentNode) ov.remove(); }, ms || 2500);
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
            for (var i = 0; i < ifr.length; i++) { if ((ifr[i].src || '').indexOf('challenges.cloudflare.com') !== -1) return true; }
            if (document.querySelector('.cf-turnstile, [class*="cf-turnstile"], #cf-chl-widget')) return true;
            return false;
        } catch (e) { return false; }
    }
    function findCloudflareTurnstileIframe() {
        var ifr = document.querySelectorAll('iframe');
        for (var i = 0; i < ifr.length; i++) { var s = ifr[i].src || ''; if (s.indexOf('challenges.cloudflare.com') !== -1) { var r = ifr[i].getBoundingClientRect(); if (r.width >= 100 && r.height >= 40) return ifr[i]; } }
        var wrap = document.querySelector('.cf-turnstile, [class*="cf-turnstile"], #cf-chl-widget');
        if (wrap) { var inIf = wrap.querySelector('iframe'); if (inIf) return inIf; }
        return null;
    }
    function findVerificationCheckbox() {
        var inputs = document.querySelectorAll('input[type="checkbox"]');
        for (var i = 0; i < inputs.length; i++) { var inp = inputs[i]; if (inp.closest && inp.closest('#tt-root')) continue; var r = inp.getBoundingClientRect(); if (r.width < 10 || r.height < 10) continue; var par = inp.closest('div, label, section'); if (par) { var pt = (par.textContent || '').toLowerCase(); if (pt.indexOf('xác minh') !== -1 || pt.indexOf('verify') !== -1 || pt.indexOf('người dùng thật') !== -1) return inp; } }
        return null;
    }
    function clickCloudflareCheckboxOnce() {
        try {
            var cb = findVerificationCheckbox();
            if (cb) { try { cb.click(); try { cb.checked = true; } catch (e) {} cb.dispatchEvent(new Event('change', { bubbles: true })); cb.dispatchEvent(new Event('input', { bubbles: true })); return true; } catch (e) {} }
            var iframe = findCloudflareTurnstileIframe();
            if (iframe) {
                var r = iframe.getBoundingClientRect();
                var offsets = [[22, 22], [25, 25], [20, 20], [30, 30], [28, 28], [18, 18], [24, 24], [15, 15], [35, 35]];
                for (var oi = 0; oi < offsets.length; oi++) {
                    var ox = offsets[oi][0], oy = offsets[oi][1];
                    var cx = r.left + ox, cy = r.top + oy;
                    var target = document.elementFromPoint(cx, cy);
                    if (!target) continue;
                    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(function(ev) { try { if (ev.indexOf('pointer') === 0) { target.dispatchEvent(new PointerEvent(ev, { bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: (ev === 'pointerdown' ? 1 : 0), clientX: cx, clientY: cy })); } else { target.dispatchEvent(new MouseEvent(ev, { bubbles: true, cancelable: true, button: 0, buttons: (ev === 'mousedown' ? 1 : 0), clientX: cx, clientY: cy })); } } catch (e) {} });
                }
                try { iframe.focus(); } catch (e) {}
                try { iframe.click(); } catch (e) {}
                return true;
            }
            return false;
        } catch (e) { return false; }
    }
    function handleCloudflareChallenge() {
        if (__cfHandled) return false;
        if (!isCloudflareChallengePage()) return false;
        __cfHandled = true;
        log('CF: ★★★ PHAT HIEN ★★★');
        if (IS_TOP && UI) { if (UI.status) UI.status.textContent = '🎀 Đang xác minh CF... 🐱'; }
        var a = 0, maxA = 60;
        if (__cfTimer) { try { clearInterval(__cfTimer); } catch (e) {} __cfTimer = null; }
        __cfTimer = setInterval(function() {
            a++;
            if (a > maxA) { clearInterval(__cfTimer); __cfTimer = null; if (UI) UI.status.textContent = '🎀 CF: nhập tay 🐱'; return; }
            if (!isCloudflareChallengePage()) {
                clearInterval(__cfTimer); __cfTimer = null;
                log('CF: ★★★ DA PASS ★★★');
                __cfHandled = false;
                DICHVU_LOCK.unlockAll();
                dichvuDone = false; dichvuCreateClicked = false; dichvuOutsideClicked = false; dichvuGoClicked = false; dichvuTabOpened = false;
                try { S.del('dichvuStage'); } catch (e) {}
                try { S.del('dichvuClickAt'); } catch (e) {}
                try { var curUrl = location.href.split('?')[0].split('#')[0]; sessionStorage.removeItem('__tt_open_blocked_' + curUrl); } catch (e) {}
                if (UI) UI.status.textContent = '🎀 Đã pass CF 🐱';
                if (IS_TOP) { try { showGifOverlay(1800); } catch (e) {} try { showToast('🐱 PASS CF! 🎀', 2500); } catch (e) {} }
                if (isDichvuTask) {
                    setTimeout(function() {
                        try { if (IS_TOP && UI) { UI.status.textContent = '🎀 Auto nhận NV... 🐱'; if (UI.domainInput) UI.domainInput.value = ''; if (UI.keywordInput) UI.keywordInput.value = ''; }
                            resetAllState(false); stopRequested = false; loopRunning = false; wasOnValidPage = true; pageLoadTime = Date.now(); setState(STATE.DICHVU_TASK); loop();
                        } catch (e) {}
                    }, 1500);
                }
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
                var UA_POOL = ['Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36','Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36','Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1','Mozilla/5.0 (Android 13; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'];
                var ua = UA_POOL[Math.floor(Math.random() * UA_POOL.length)];
                fp = { ua:ua, isMobile:/Mobile|Android|iPhone/i.test(ua), screen:{w:360,h:800,aw:360,ah:780,cd:24}, tzOffset:420, lang:'vi-VN', langs:['vi-VN','vi','en'], hw:8, mem:8, touch:5, platform: /iPhone/i.test(ua)?'iPhone':'Linux armv8l' };
                try { S.set('fakeFingerprint', JSON.stringify(fp)); } catch (e) {}
            }
            function safeDefine(obj, prop, getter) { try { var desc = Object.getOwnPropertyDescriptor(obj, prop); if (desc && !desc.configurable) return false; Object.defineProperty(obj, prop, { get: getter, configurable: true, enumerable: true }); return true; } catch (e) { return false; } }
            try { safeDefine(Navigator.prototype, 'userAgent', function() { return fp.ua; }); safeDefine(Navigator.prototype, 'platform', function() { return fp.platform; }); safeDefine(Navigator.prototype, 'language', function() { return fp.lang; }); safeDefine(Navigator.prototype, 'languages', function() { return fp.langs.slice(); }); safeDefine(Navigator.prototype, 'hardwareConcurrency', function() { return fp.hw; }); safeDefine(Navigator.prototype, 'deviceMemory', function() { return fp.mem; }); safeDefine(Navigator.prototype, 'maxTouchPoints', function() { return fp.touch; }); safeDefine(Navigator.prototype, 'webdriver', function() { return false; }); } catch (e) {}
        } catch (e) {}
    }
    initFakeAgent();
    function sleep(ms) { return new Promise(function(r){ setTimeout(r, ms); }); }
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function getState() { return S.get('state', STATE.IDLE); }
    function setState(s) { var old = getState(); if (old === s) return; S.set('state', s); S.set('stateSetAt', Date.now().toString()); log('★ STATE: ' + old + ' -> ' + s); if (IS_TOP && UI && UI.status) refreshStatus(); }
    function saveCode(code) { if (!code || typeof code !== 'string') return; code = code.trim(); if (!code || !isValidCodeShape(code) || isBlacklistedCode(code)) return; try { S.set('code', code); S.set('codeBackup', code); S.set('codeBackupAt', Date.now().toString()); S.set('codeFoundAt', Date.now().toString()); S.set('codeHardLock', code); S.set('codeHardLockAt', Date.now().toString()); log('SAVE CODE: ' + code); } catch (e) {} }
    function loadCode() { var c = S.get('code', ''); if (c) c = (c + '').trim(); if (c && isValidCodeShape(c) && !isBlacklistedCode(c)) return c; var cb = S.get('codeBackup', ''); if (cb) cb = (cb + '').trim(); if (cb && isValidCodeShape(cb) && !isBlacklistedCode(cb)) { try { S.set('code', cb); } catch (e) {} return cb; } var ch = S.get('codeHardLock', ''); if (ch) ch = (ch + '').trim(); if (ch && isValidCodeShape(ch) && !isBlacklistedCode(ch)) { try { S.set('code', ch); } catch (e) {} return ch; } return ''; }
    function safeNavigate(url) { if (!url) return; var l = S.get('lastNavUrl', ''); var at = parseInt(S.get('lastNavAt', '0'), 10); var now = Date.now(); if (l === url && (now - at) < CFG.navCooldownMs) return; S.set('lastNavUrl', url); S.set('lastNavAt', now.toString()); try { location.href = url; } catch (e) {} }
    function isTargetPage() { var t = S.get('targetUrl'); var curDomain = S.get('domain'); var ch = HOST.replace(/^www\./, ''); if (curDomain) { var cd = curDomain.toLowerCase().replace(/^www\./, '').replace(/^https?:\/\//, '').replace(/\/.*$/, ''); if (ch.indexOf(cd) !== -1 || cd.indexOf(ch) !== -1) return true; } if (!t) return false; try { var th = new URL(t).hostname.replace(/^www\./, ''); if (ch.indexOf(th) !== -1 || ch.indexOf(ch) !== -1) return true; } catch (e) {} return false; }
    function isRealTargetPage() { return !isGtraffic && !isGoogle && !isDichvuTask && !isRobuxReward && isTargetPage(); }
    function getTopHostname() { try { if (window.top && window.top.location && window.top.location.hostname) return window.top.location.hostname; } catch (e) {} return HOST; }
    function getBaseDomain(host) { if (!host) return ''; host = host.replace(/^www\./, '').toLowerCase(); var parts = host.split('.'); if (parts.length <= 2) return host; var two = ['co.uk','co.jp','co.kr','com.au','co.nz','com.br','co.in','co.id','com.vn','com.cn','com.tw','com.hk','co.th','com.ph','com.my','com.sg']; var l2 = parts.slice(-2).join('.'); if (two.indexOf(l2) !== -1 && parts.length >= 3) return parts.slice(-3).join('.'); return parts.slice(-2).join('.'); }
    function isSameHostAsTop() { try { if (IS_TOP) return true; var t = getTopHostname(); if (!t) return false; return getBaseDomain(HOST) === getBaseDomain(t); } catch (e) { return false; } }
    function shouldToolRunOnThisPage() {
        if (isDichvuTask) return true;
        if (isRobuxReward) return true;
        if (isCloudflareChallengePage()) return true;
        if (IS_TOP) { if (isGtraffic) return true; if (isGoogle) return true; if (isRealTargetPage()) return true; return false; }
        if (isSameHostAsTop()) { var t = getTopHostname(); var gt = /(^|\.)gtraffic\.io$/i.test(t); var gg = /(^|\.)google\./i.test(t); var dv = /(^|\.)dichvutask\.xyz$/i.test(t); var rb = /(^|\.)robuxreward\.top$/i.test(t); if (gt || gg || dv || rb) return true; var cd = S.get('domain'); if (cd) { var c = cd.toLowerCase().replace(/^www\./, '').replace(/^https?:\/\//, '').replace(/\/.*$/, ''); var th = t.replace(/^www\./, ''); if (th.indexOf(c) !== -1 || c.indexOf(th) !== -1) return true; } return false; }
        return false;
    }
    if (!shouldToolRunOnThisPage()) return;
    var loopRunning = false, stopRequested = false, fillRunning = false, submitRunning = false, finishCalled = false, fillDone = false, submitted = false, fillRetries = 0, codeShown = false, gtrafficCheckTimer = null, loopTimer = null, leaveCheckTimer = null, googleObserver = null, wasOnValidPage = true, cachedInput = null, cachedInputTime = 0, cachedConfirm = null, cachedConfirmTime = 0, cachedBtn = null, cachedBtnTime = 0, getLinkPollTimer = null, getLinkObserver = null, getLinkClickDone = false, getLinkStartAt = 0, googleClicked = false, pageLoadTime = Date.now(), watchdogTimer = null, patchedInput = null, childTabRef = null, pollChildTimer = null, dichvuTaskTimer = null, dichvuDone = false, dichvuCreateClicked = false, dichvuLastCreateAt = 0, dichvuGoClicked = false, dichvuOutsideClicked = false, dichvuOutsideClickedAt = 0, dichvuTabOpened = false, robuxTaskRunning = false, robuxLastClickAt = 0, robuxGtrafficTabRef = null, robuxModalOpenedAt = 0, robuxClaimStartAt = 0, robuxClaimDone = false;
    if (!pageLoadTime) pageLoadTime = Date.now();
    function resetAllState(silent) {
        if (!silent) log('AUTO RESET');
        try { S.del('state'); S.del('stateSetAt'); S.del('targetUrl'); S.del('lastServerSec'); S.del('lastClickTime'); S.del('serverTotalSec'); S.del('filled'); S.del('confirmed'); S.del('googleClickTries'); S.del('navigatingBack'); S.del('cdStartSec'); S.del('cdStartAt'); S.del('btnClickAt'); S.del('gotCodeAt'); S.del('codeAttempts'); S.del('lastNavUrl'); S.del('lastNavAt'); S.del('backDone'); S.del('leavingAt'); S.del('lastCopyOk'); S.del('lastCopyText'); S.del('hardStop'); S.del('countdownRealZero'); S.del('getLinkClicked'); S.del('waitingGetLink'); S.del('getLinkDeadline'); S.del('getLinkStartAt'); S.del('childTabOpen'); S.del('codeReadySignal'); S.del('dichvuStage'); S.del('dichvuClickAt'); S.del('dichvuCreateCount'); S.del('dichvuDoneAt'); } catch (e) {}
        stopRequested = true; loopRunning = false; fillRunning = false; submitRunning = false; finishCalled = false; fillDone = false; submitted = false; fillRetries = 0; codeShown = false; getLinkClickDone = false; googleClicked = false;
        if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; }
        if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
        if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; }
        if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
        if (getLinkObserver) { try { getLinkObserver.disconnect(); } catch (e) {} getLinkObserver = null; }
        if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; }
        if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
        if (dichvuTaskTimer) { try { clearInterval(dichvuTaskTimer); } catch (e) {} dichvuTaskTimer = null; }
        if (UI && UI.root) UI.root.style.display = 'none';
        var fab = document.getElementById('tt-fab'); if (fab) fab.remove();
    }
    function doImmediateAutoReset() {
        log('DO IMMEDIATE AUTO RESET');
        try { var sd = S.get('savedDomains', '[]'); var cb = S.get('codeBackup', ''); var cba = S.get('codeBackupAt', ''); var cr = S.get('code', ''); var chl = S.get('codeHardLock', ''); var chla = S.get('codeHardLockAt', ''); var cfa = S.get('codeFoundAt', ''); var km = S.get('keywordMap', '[]'); S.resetFull(); try { S.set('savedDomains', sd); } catch (e) {} try { S.set('keywordMap', km); } catch (e) {} if (cr && isValidCodeShape(cr) && !isBlacklistedCode(cr)) { try { S.set('code', cr); } catch (e) {} } if (cb) { try { S.set('codeBackup', cb); } catch (e) {} try { S.set('codeBackupAt', cba); } catch (e) {} } if (chl) { try { S.set('codeHardLock', chl); } catch (e) {} try { S.set('codeHardLockAt', chla); } catch (e) {} } if (cfa) { try { S.set('codeFoundAt', cfa); } catch (e) {} } try { S.set('pendingAutoReset', '1'); } catch (e) {} try { S.set('inFlow', '0'); } catch (e) {} } catch (e) {}
        try { if (UI) { if (UI.domainInput) UI.domainInput.value = ''; if (UI.keywordInput) UI.keywordInput.value = ''; if (UI.status) UI.status.textContent = '🎀 Sẵn sàng 🐱'; if (UI.code) UI.code.classList.remove('show'); if (UI.codeVal) UI.codeVal.textContent = '----'; } } catch (e) {}
        try { S.set('state', STATE.IDLE); } catch (e) {}
        stopRequested = true; loopRunning = false; fillDone = true; fillRunning = false; submitRunning = false; finishCalled = true; submitted = true; fillRetries = 0; codeShown = false; getLinkClickDone = true; getLinkStartAt = 0; wasOnValidPage = true; googleClicked = false; cachedInput = null; cachedInputTime = 0; cachedConfirm = null; cachedConfirmTime = 0; cachedBtn = null; cachedBtnTime = 0;
        if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; }
        if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
        if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; }
        if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
        if (getLinkObserver) { try { getLinkObserver.disconnect(); } catch (e) {} getLinkObserver = null; }
        if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; }
        if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
        try { showToast('🎀 SẴN SÀNG WEB MỚI 🐱', 2000); } catch (e) {}
    }
    function startLeaveDetector() {
        if (!IS_TOP) return;
        if (leaveCheckTimer) return;
        leaveCheckTimer = setInterval(function() {
            if (Date.now() - pageLoadTime < 2000) return;
            if (S.get('inFlow') === '1') return;
            if (isCloudflareChallengePage()) return;
            var valid = shouldToolRunOnThisPage();
            if (wasOnValidPage && !valid) {
                var st = getState();
                var inFlow = (st === STATE.GET_CODE || st === STATE.WAIT_COUNTDOWN || st === STATE.SCAN_BTN || st === STATE.BACK_GTRAFFIC || st === STATE.FILL_CODE || st === STATE.GOOGLE_CLICK || st === STATE.DICHVU_TASK);
                var hasCode = !!(loadCode());
                if (!inFlow && !hasCode) { resetAllState(); wasOnValidPage = false; if (leaveCheckTimer) { clearInterval(leaveCheckTimer); leaveCheckTimer = null; } }
            }
        }, CFG.leaveCheckMs);
    }
    try { window.addEventListener('beforeunload', function() { if (S.get('inFlow') === '1') return; try { S.set('leavingAt', Date.now().toString()); } catch (e) {} }); window.addEventListener('pagehide', function() { if (S.get('inFlow') === '1') return; try { S.set('leavingAt', Date.now().toString()); } catch (e) {} }); } catch (e) {}
    function stopAll() {
        stopRequested = true; loopRunning = false; fillRunning = false; submitRunning = false;
        if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; }
        if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
        if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; }
        if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
        if (getLinkObserver) { try { getLinkObserver.disconnect(); } catch (e) {} getLinkObserver = null; }
        if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; }
        if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
        if (dichvuTaskTimer) { try { clearInterval(dichvuTaskTimer); } catch (e) {} dichvuTaskTimer = null; }
    }
    function resetFillFlags() {
        stopRequested = false; fillRunning = false; submitRunning = false; finishCalled = false; fillDone = false; submitted = false; fillRetries = 0; codeShown = false; cachedInput = null; cachedInputTime = 0; cachedConfirm = null; cachedConfirmTime = 0; getLinkClickDone = false; getLinkStartAt = 0; googleClicked = false;
        try { S.del('hardStop'); } catch (e) {} try { S.del('countdownRealZero'); } catch (e) {} try { S.del('getLinkClicked'); } catch (e) {} try { S.del('waitingGetLink'); } catch (e) {} try { S.del('getLinkDeadline'); } catch (e) {} try { S.del('getLinkStartAt'); } catch (e) {} try { S.del('pendingAutoReset'); } catch (e) {} try { S.del('childTabOpen'); } catch (e) {} try { S.del('codeReadySignal'); } catch (e) {} try { S.del('dichvuStage'); } catch (e) {} try { S.del('dichvuClickAt'); } catch (e) {} try { S.del('dichvuCreateCount'); } catch (e) {} try { S.del('dichvuDoneAt'); } catch (e) {}
    }
    function watchdog() {
        if (S.get('waitingGetLink') === '1') return;
        if (S.get('pendingAutoReset') === '1') return;
        var st = getState(); var sa = parseInt(S.get('stateSetAt', '0'), 10); var age = Date.now() - sa;
        if (S.get('hardStop') === '1') { stopAll(); return; }
        if (isRealTargetPage() && (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK)) { setState(STATE.SCAN_BTN); return; }
        if (st === STATE.GOOGLE_CLICK && age > CFG.watchdogMs) { setState(STATE.SCAN_BTN); return; }
        if (st === STATE.SCAN_BTN && age > 30000) { S.set('stateSetAt', Date.now().toString()); }
        if (st === STATE.WAIT_COUNTDOWN && age > 90000) { setState(STATE.GET_CODE); return; }
        if (st === STATE.WAIT_COUNTDOWN) { var cd = readCountdown(); if (cd && cd.sec === 0) { setState(STATE.GET_CODE); return; } }
        if (st === STATE.GET_CODE && age > CFG.codeTimeoutMs) { if (S.get('backDone') !== '1') { S.set('backDone', '1'); } }
    }
    var UI = {};

// >>> TIẾP TỤC Ở PHẦN 2/2 <<<    // ===== HELLO KITTY CSS - NÂNG CẤP TOÀN DIỆN =====
    function buildCSS() {
        return [
        // ★ ANIMATIONS ĐA DẠNG
        '@keyframes ttKittyFloat{0%,100%{transform:translateY(0) rotate(-3deg) scale(1)}50%{transform:translateY(-5px) rotate(3deg) scale(1.08)}}',
        '@keyframes ttKittyDance{0%,100%{transform:translateY(0) rotate(-6deg) scale(1)}25%{transform:translateY(-6px) rotate(4deg) scale(1.08)}50%{transform:translateY(0) rotate(6deg) scale(1)}75%{transform:translateY(-6px) rotate(-4deg) scale(1.08)}}',
        '@keyframes ttKittyPulse{0%,100%{box-shadow:0 0 0 0 rgba(233,30,99,.5)}50%{box-shadow:0 0 0 10px rgba(233,30,99,0)}}',
        '@keyframes ttKittyGlow{0%,100%{text-shadow:0 0 6px rgba(255,20,147,.6),0 0 12px rgba(255,20,147,.4)}50%{text-shadow:0 0 12px rgba(255,20,147,1),0 0 24px rgba(255,20,147,.7)}}',
        '@keyframes ttKittySparkle{0%,100%{opacity:.4;transform:scale(.8) rotate(0)}50%{opacity:1;transform:scale(1.2) rotate(180deg)}}',
        '@keyframes ttGifPop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}',
        '@keyframes ttGifWiggle{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.12)}}',
        '@keyframes ttMenuSlideIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}',
        '@keyframes ttBtnWobble{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}',
        '@keyframes ttTimerShine{0%{background-position:-200% 0}100%{background-position:200% 0}}',
        '@keyframes ttTimerPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,20,147,.6)}50%{transform:scale(1.03);box-shadow:0 0 0 12px rgba(255,20,147,0)}}',
        '@keyframes ttHeaderFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
        '@keyframes ttSectionFadeIn{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}',

        // ★ ROOT PANEL
        '#tt-root{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;width:360px;max-width:calc(100vw - 16px);font-family:"Comic Sans MS","Segoe UI",Arial,sans-serif;font-size:10px;color:#AD1457;background:linear-gradient(165deg,#FFF0F5 0%,#FCE4EC 45%,#F8BBD0 100%);border-radius:20px;user-select:none;max-height:88vh;overflow:visible;display:flex;flex-direction:column;box-shadow:0 6px 22px rgba(233,30,99,.35),0 0 0 2px rgba(255,255,255,.9) inset;border:2.5px solid #F48FB1}',

        // ★ GIF NƠ Ở 2 GÓC
        '#tt-root::before{content:"";position:absolute;top:-22px;left:8px;width:48px;height:48px;background-image:url("' + GIF_BOW + '");background-size:contain;background-repeat:no-repeat;background-position:center;z-index:11;pointer-events:none;animation:ttGifWiggle 1.8s ease-in-out infinite;filter:drop-shadow(0 3px 6px rgba(233,30,99,.55))}',
        '#tt-root::after{content:"";position:absolute;top:-22px;right:8px;width:48px;height:48px;background-image:url("' + GIF_BOW + '");background-size:contain;background-repeat:no-repeat;background-position:center;z-index:11;pointer-events:none;animation:ttGifWiggle 1.8s ease-in-out infinite .4s;filter:drop-shadow(0 3px 6px rgba(233,30,99,.55))}',
        '#tt-root *{box-sizing:border-box}',

        // ★ MINIMIZE STATE
        '#tt-root.tt-min{width:64px !important;max-width:64px !important;border-radius:50% !important;top:8px;left:auto;right:8px;transform:none;padding:0;background:radial-gradient(circle at 30% 30%,#FFD9E8,#FF69B4 70%);border:3px solid #FFF;animation:ttKittyPulse 2s infinite;overflow:hidden}',
        '#tt-root.tt-min::before,#tt-root.tt-min::after{display:none}',
        '#tt-root.tt-min .tt-head{padding:12px 0;text-align:center;border-radius:50%;background:transparent;border:none}',
        '#tt-root.tt-min .tt-brand-txt,#tt-root.tt-min .tt-body,#tt-root.tt-min .tt-foot,#tt-root.tt-min .tt-head-actions{display:none}',
        '#tt-root.tt-min .tt-rose{font-size:0 !important;margin:0 auto !important;width:52px;height:52px;display:block;background-image:url("' + GIF_KITTY_DANCE + '"),url("' + GIF_KITTY_DANCE_ALT + '"),url("' + GIF_KITTY_DANCE_ALT2 + '");background-size:contain;background-repeat:no-repeat;background-position:center;border-radius:50%;animation:ttKittyDance 0.6s ease-in-out infinite}',

        // ★ HEADER - gradient chuyển động
        '.tt-head{padding:12px 14px;background:linear-gradient(135deg,#E91E63 0%,#D81B60 25%,#F48FB1 50%,#D81B60 75%,#E91E63 100%);background-size:200% 200%;flex-shrink:0;position:relative;overflow:hidden;border-radius:17px 17px 0 0;animation:ttHeaderFlow 5s ease-in-out infinite}',
        '.tt-head::before{content:"✨";position:absolute;top:8px;left:50%;font-size:12px;animation:ttKittySparkle 2s infinite;color:#FFF}',
        '.tt-head::after{content:"✨";position:absolute;bottom:4px;right:20px;font-size:10px;animation:ttKittySparkle 2.5s infinite .3s;color:#FFF}',
        '.tt-brand{display:flex;align-items:center;gap:9px;position:relative;z-index:1}',

        // ★ LOGO - GIF hoặc emoji nhảy, hiện 100%
        '.tt-rose{font-size:0 !important;width:44px;height:44px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%,#FFE4F0,#F48FB1 80%);border-radius:50%;animation:ttKittyDance 0.6s ease-in-out infinite;filter:drop-shadow(0 3px 6px rgba(233,30,99,.6));position:relative;overflow:hidden}',
        '.tt-rose::after{content:"🐱";font-size:32px;line-height:1;position:absolute;animation:ttKittyDance 0.6s ease-in-out infinite}',
        '.tt-rose img{width:100%;height:100%;object-fit:contain;position:absolute;z-index:2;border-radius:50%}',
        '.tt-title-main{font-size:12.5px;font-weight:900;color:#FFF;letter-spacing:.5px;line-height:1.15;text-shadow:0 1px 2px rgba(0,0,0,.2)}',
        '.tt-title-main .rose-mark{color:#FFF;animation:ttKittyFloat 1.8s ease-in-out infinite;display:inline-block}',
        '.tt-title-sub{font-size:7.5px;letter-spacing:2px;font-weight:800;margin-top:2px;color:#FCE4EC;text-transform:uppercase;text-shadow:0 1px 1px rgba(0,0,0,.15)}',
        '.tt-head-actions{position:absolute;top:8px;right:8px;display:flex;gap:5px;z-index:12}',
        '.tt-icon-btn{width:20px;height:20px;border-radius:50%;border:1.8px solid rgba(255,255,255,.75);background:rgba(255,255,255,.25);color:#FFF;font-size:11px;font-weight:900;line-height:1;padding:0;cursor:pointer;transition:all .2s}',
        '.tt-icon-btn:hover{background:rgba(255,255,255,.5);transform:scale(1.1) rotate(90deg)}',

        // ★ BODY
        '.tt-body{padding:9px;overflow-y:auto;flex:1;display:grid;grid-template-columns:1fr 1fr;gap:7px;background:transparent;-webkit-overflow-scrolling:touch}',
        '.tt-body::-webkit-scrollbar{width:5px}',
        '.tt-body::-webkit-scrollbar-thumb{background:linear-gradient(#F48FB1,#E91E63);border-radius:3px}',
        '.tt-body::-webkit-scrollbar-track{background:rgba(252,228,236,.5);border-radius:3px}',
        '.tt-body .tt-full{grid-column:1/-1}',

        // ★ STATUS - shimmer
        '.tt-status{grid-column:1/-1;background:#FFFFFF;border-radius:12px;padding:8px 13px;border-left:5px solid #E91E63;font-size:10.5px;font-weight:800;color:#AD1457;text-align:center;letter-spacing:.2px;box-shadow:0 2px 6px rgba(233,30,99,.15);position:relative;overflow:hidden;animation:ttSectionFadeIn .4s ease-out}',
        '.tt-status::after{content:"";position:absolute;top:0;left:-200%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(244,143,177,.5),transparent);animation:ttTimerShine 3s infinite}',

        // ★ SECTION - fade in + hover
        '.tt-section{background:rgba(255,255,255,.96);border-radius:13px;padding:8px;border:1.5px solid #F8BBD0;box-shadow:0 2px 6px rgba(233,30,99,.1);position:relative;animation:ttSectionFadeIn .5s ease-out;transition:transform .2s ease,box-shadow .2s ease}',
        '.tt-section:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(233,30,99,.2)}',
        '.tt-section:nth-child(2){animation-delay:.05s}',
        '.tt-section:nth-child(3){animation-delay:.1s}',
        '.tt-section:nth-child(4){animation-delay:.15s}',

        '.tt-section-title{font-size:9px;font-weight:900;letter-spacing:1px;margin-bottom:6px;color:#D81B60;text-transform:uppercase;display:flex;align-items:center;gap:5px}',
        '.tt-section-title .r{font-size:12px;animation:ttKittyFloat 2s infinite}',

        // ★ INPUT
        '.tt-input{padding:8px 10px;border:2px solid #F8BBD0;border-radius:10px;font-family:inherit;font-size:10px;color:#AD1457;background:#FFF;outline:none;width:100%;transition:all .2s}',
        '.tt-input::placeholder{color:#F48FB1;font-style:italic}',
        '.tt-input:focus{border-color:#E91E63;box-shadow:0 0 0 3px rgba(233,30,99,.18);background:#FFF0F5}',

        '.tt-row{display:flex;gap:6px;align-items:center}',

        // ★ BUTTON - wobble on hover
        '.tt-btn{padding:8px 11px;border:none;border-radius:10px;font-weight:900;font-size:9.5px;cursor:pointer;color:#FFF;background:linear-gradient(135deg,#F48FB1,#E91E63);font-family:inherit;white-space:nowrap;flex-shrink:0;text-transform:uppercase;letter-spacing:.4px;box-shadow:0 3px 8px rgba(233,30,99,.3);-webkit-tap-highlight-color:transparent;transition:all .15s;position:relative;overflow:hidden}',
        '.tt-btn::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);transition:left .4s}',
        '.tt-btn:hover::before{left:100%}',
        '.tt-btn:hover{transform:translateY(-1px);box-shadow:0 5px 12px rgba(233,30,99,.4);animation:ttBtnWobble .3s ease-in-out}',
        '.tt-btn:active{transform:scale(.96)}',
        '.tt-btn.gray{background:linear-gradient(135deg,#CE93D8,#8E24AA)}',
        '.tt-btn.gold{background:linear-gradient(135deg,#FF80AB,#EC407A)}',
        '.tt-btn.blue{background:linear-gradient(135deg,#F06292,#D81B60)}',

        // ★ DOMAIN LIST
        '.tt-domain-list{max-height:60px;overflow-y:auto;margin-top:6px;border-radius:10px;background:rgba(255,240,245,.7);padding:5px;border:1.5px dashed #F48FB1}',
        '.tt-domain-list::-webkit-scrollbar{width:4px}',
        '.tt-domain-list::-webkit-scrollbar-thumb{background:linear-gradient(#F48FB1,#E91E63);border-radius:2px}',
        '.tt-domain-item{display:flex;align-items:center;justify-content:space-between;padding:5px 7px;border-radius:7px;font-size:8.5px;margin-bottom:3px;background:#FFF;border-left:4px solid #F48FB1;box-shadow:0 1px 3px rgba(233,30,99,.08);transition:all .15s;animation:ttMenuSlideIn .3s ease-out}',
        '.tt-domain-item:hover{background:#FFF0F5;transform:translateX(2px)}',
        '.tt-domain-item .d-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700;color:#AD1457}',
        '.tt-domain-item .d-use{padding:3px 7px;border-radius:6px;background:linear-gradient(135deg,#F48FB1,#E91E63);color:#FFF;font-size:7px;font-weight:900;border:none;margin-left:3px;cursor:pointer;transition:all .15s}',
        '.tt-domain-item .d-use:hover{transform:scale(1.1)}',
        '.tt-domain-item .d-del{padding:3px 7px;border-radius:6px;background:linear-gradient(135deg,#EF5350,#C62828);color:#FFF;font-size:8.5px;font-weight:900;border:none;margin-left:2px;cursor:pointer;transition:all .15s}',
        '.tt-domain-item .d-del:hover{transform:scale(1.15) rotate(90deg)}',
        '.tt-empty{text-align:center;color:#F48FB1;font-size:8px;padding:6px;font-style:italic}',

        // ★ TIMER - ĐẸP HƠN, TO HƠN, PHÁT SÁNG
        '.tt-timer{display:none;grid-column:1/-1;padding:11px 13px;background:linear-gradient(135deg,#FFF,#FFF0F5 50%,#FFE4F0 100%);background-size:200% 200%;border-radius:16px;border:3px solid transparent;background-clip:padding-box;align-items:center;justify-content:center;gap:12px;position:relative;animation:ttSectionFadeIn .5s ease-out}',
        '.tt-timer.show{display:flex;animation:ttTimerPulse 2s ease-in-out infinite}',
        '.tt-timer::before{content:"";position:absolute;inset:-3px;border-radius:16px;background:linear-gradient(135deg,#F48FB1,#E91E63,#FF80AB,#F48FB1);background-size:200% 200%;z-index:-1;animation:ttHeaderFlow 3s ease-in-out infinite}',
        '.tt-timer::after{content:"";position:absolute;top:0;left:-200%;width:200%;height:100%;border-radius:16px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);animation:ttTimerShine 3s infinite}',

        // ★ KITTY trong timer - EMOJI nhảy (chắc chắn hiện)
        '.tt-kitty-emoji{width:56px;height:56px;flex-shrink:0;font-size:44px;line-height:56px;text-align:center;animation:ttKittyDance 0.6s ease-in-out infinite;transform-origin:bottom center;filter:drop-shadow(0 4px 8px rgba(233,30,99,.7));background:radial-gradient(circle at 30% 30%,#FFE4F0,#F48FB1);border-radius:50%;border:3px solid #FFF;box-shadow:0 4px 12px rgba(233,30,99,.4);position:relative;z-index:1}',

        '.tt-timer-wrap{position:relative;width:56px;height:56px;flex-shrink:0;z-index:1}',
        '.tt-timer-wrap svg{width:100%;height:100%;transform:rotate(-90deg);filter:drop-shadow(0 2px 4px rgba(233,30,99,.3))}',
        '.tt-timer-track{fill:none;stroke:rgba(252,228,236,.9);stroke-width:5.5}',
        '.tt-timer-prog{fill:none;stroke:url(#ttTimerGrad);stroke-width:5.5;stroke-linecap:round;stroke-dasharray:163.4;stroke-dashoffset:0;filter:drop-shadow(0 0 4px rgba(233,30,99,.7))}',
        '.tt-timer-num{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#E91E63;text-shadow:0 2px 4px rgba(255,255,255,.9),0 0 8px rgba(255,20,147,.3)}',
        '.tt-timer-cap{font-size:9.5px;font-weight:800;color:#D81B60;line-height:1.4;text-align:left;flex:1;z-index:1;text-shadow:0 1px 2px rgba(255,255,255,.8);animation:ttKittyGlow 2s ease-in-out infinite}',

        // ★ GUIDE / CODE
        '.tt-guide{display:none;grid-column:1/-1;background:linear-gradient(135deg,rgba(255,240,245,.95),rgba(252,228,236,.95));border:2px solid #F8BBD0;border-radius:12px;padding:8px 11px;text-align:center;font-size:9px;color:#AD1457;line-height:1.45;position:relative;overflow:hidden;animation:ttSectionFadeIn .4s ease-out}',
        '.tt-guide.show{display:block}',
        '.tt-guide b{color:#E91E63;font-weight:900}',

        '.tt-code{display:none;grid-column:1/-1;background:linear-gradient(135deg,#FFF,#FFF0F5);border:2.5px dashed #F48FB1;border-radius:14px;padding:10px 11px;position:relative;animation:ttSectionFadeIn .4s ease-out}',
        '.tt-code.show{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}',
        '.tt-code-label{font-size:8px;font-weight:900;letter-spacing:1.8px;color:#D81B60;text-transform:uppercase;text-align:center}',
        '.tt-code-label .r{display:block;font-size:15px;color:#E91E63;margin-bottom:3px;animation:ttKittyFloat 1.5s infinite}',
        '.tt-code-right{display:flex;flex-direction:column;gap:5px}',
        '.tt-code-value{font-family:"Courier New",monospace;font-size:16px;font-weight:900;color:#AD1457;letter-spacing:3.5px;padding:8px 11px;background:linear-gradient(135deg,#FFF0F5,#FCE4EC);border-radius:9px;word-break:break-all;user-select:text;border:2px solid #F48FB1;text-align:center;text-shadow:0 1px 1px rgba(255,255,255,.9);box-shadow:inset 0 1px 3px rgba(233,30,99,.15)}',

        // ★ FOOTER
        '.tt-foot{display:flex;justify-content:center;align-items:center;gap:6px;padding:7px;color:#FFF;font-size:8px;font-weight:800;letter-spacing:1.3px;background:linear-gradient(135deg,#E91E63,#F48FB1);border-radius:0 0 17px 17px;overflow:hidden;position:relative}',
        '.tt-foot::before{content:"";position:absolute;top:0;left:-200%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);animation:ttTimerShine 4s infinite}',
        '.tt-foot .r{color:#FFF;font-size:12px;animation:ttKittyFloat 1.6s infinite}',
        '.tt-foot .w{color:#FFF;font-size:9px;letter-spacing:2px;text-shadow:0 1px 1px rgba(0,0,0,.2)}',
        '.tt-foot .vn{color:#FFF;font-size:10px;letter-spacing:1.5px;text-shadow:0 1px 1px rgba(0,0,0,.2)}',

        '.tt-hint{font-size:7.5px;color:#F06292;font-style:italic;margin-top:4px;display:block;line-height:1.3}',

        // ★ FAB - LOGO khi tắt = EMOJI nhảy
        '#tt-fab{position:fixed;bottom:16px;right:16px;z-index:2147483647;width:64px;height:64px;border-radius:50%;cursor:pointer;color:#FFF;display:flex;align-items:center;justify-content:center;font-size:0;background:radial-gradient(circle at 30% 30%,#FFD9E8,#FF69B4 70%);border:3px solid #FFF;box-shadow:0 6px 18px rgba(233,30,99,.55);animation:ttKittyPulse 2s infinite;overflow:hidden;padding:0;transition:transform .2s}',
        '#tt-fab:hover{transform:scale(1.1) rotate(8deg)}',
        '#tt-fab .tt-fab-emoji{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:44px;line-height:1;animation:ttKittyDance 0.6s ease-in-out infinite;pointer-events:none}',

        // ★ TOAST
        '#tt-toast{position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#E91E63,#F48FB1);color:#FFF;padding:10px 20px;border-radius:22px;font-family:"Comic Sans MS","Segoe UI",Arial,sans-serif;font-size:11px;font-weight:800;z-index:2147483647;border:2.5px solid #FFF;pointer-events:none;letter-spacing:.6px;max-width:calc(100vw - 32px);text-align:center;box-shadow:0 6px 20px rgba(233,30,99,.5);animation:ttKittyFloat 1.5s infinite}',

        // ★ GIF OVERLAY
        '#tt-gif-overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(233,30,99,.4);display:flex;align-items:center;justify-content:center;pointer-events:none;backdrop-filter:blur(3px)}',
        '#tt-gif-overlay img{max-width:70vw;max-height:70vh;border-radius:20px;box-shadow:0 0 60px rgba(244,143,177,.9),0 0 0 6px rgba(255,255,255,.8);animation:ttGifPop .5s ease-out}',

        // ★ RESPONSIVE
        '@media (max-width:400px){',
        '  #tt-root{width:calc(100vw - 12px) !important;top:4px;font-size:9px;border-radius:16px}',
        '  .tt-head{padding:10px 12px}',
        '  .tt-rose{width:38px;height:38px}',
        '  .tt-rose::after{font-size:28px}',
        '  .tt-title-main{font-size:11px}',
        '  .tt-title-sub{font-size:6px}',
        '  .tt-body{padding:7px;gap:6px}',
        '  .tt-input{padding:7px 9px;font-size:9.5px}',
        '  .tt-btn{padding:7px 10px;font-size:9px}',
        '  .tt-code-value{font-size:14px;letter-spacing:3px}',
        '  .tt-timer-wrap{width:48px;height:48px}',
        '  .tt-timer-num{font-size:15px}',
        '  .tt-kitty-emoji{width:48px;height:48px;font-size:38px;line-height:48px}',
        '  #tt-root::before,#tt-root::after{width:36px;height:36px;top:-18px}',
        '  #tt-root.tt-min{width:56px !important;max-width:56px !important}',
        '  #tt-root.tt-min .tt-rose{width:44px;height:44px}',
        '}',
        '@media (min-width:401px) and (max-width:720px){',
        '  #tt-root{width:380px}',
        '}',
        '@media (max-height:600px){',
        '  #tt-root{max-height:94vh}',
        '  .tt-body{padding:6px 7px;gap:6px}',
        '  .tt-section{padding:6px}',
        '}'].join('\n');
    }
    function makeDomainRow(item) {
        var row = document.createElement('div'); row.className = 'tt-domain-item'; row.setAttribute('data-domain', item.d);
        var name = document.createElement('div'); name.className = 'd-name'; name.textContent = item.d;
        var useBtn = document.createElement('button'); useBtn.className = 'd-use'; useBtn.setAttribute('data-action', 'use'); useBtn.textContent = 'DÙNG';
        var delBtn = document.createElement('button'); delBtn.className = 'd-del'; delBtn.setAttribute('data-action', 'del'); delBtn.textContent = '✕';
        row.appendChild(name); row.appendChild(useBtn); row.appendChild(delBtn); return row;
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
        if (!list.length) { UI.kwList.innerHTML = '<div class="tt-empty">🎀 Chưa có mapping 🐱</div>'; return; }
        var frag = document.createDocumentFragment();
        for (var i = 0; i < list.length && i < 30; i++) {
            var item = list[i]; var row = document.createElement('div'); row.className = 'tt-domain-item'; row.setAttribute('data-kw', item.k); row.setAttribute('data-dm', item.d);
            var name = document.createElement('div'); name.className = 'd-name'; name.textContent = item.k + ' → ' + item.d;
            var useBtn = document.createElement('button'); useBtn.className = 'd-use'; useBtn.setAttribute('data-action', 'use'); useBtn.textContent = 'DÙNG';
            var delBtn = document.createElement('button'); delBtn.className = 'd-del'; delBtn.setAttribute('data-action', 'del'); delBtn.textContent = '✕';
            row.appendChild(name); row.appendChild(useBtn); row.appendChild(delBtn); frag.appendChild(row);
        }
        UI.kwList.appendChild(frag);
    }
    function buildPanel() {
        if (!IS_TOP) return;
        if (!document.body) { var tries = 0; var w = setInterval(function() { tries++; if (document.body) { clearInterval(w); buildPanel(); } else if (tries > 200) { clearInterval(w); } }, 50); return; }
        var old = document.getElementById('tt-root'); if (old) old.remove();
        GM_addStyle(buildCSS());
        var html = ['<div class="tt-head" id="tt-head">','  <div class="tt-head-actions">','    <button class="tt-icon-btn" id="tt-min">−</button>','    <button class="tt-icon-btn" id="tt-close">✕</button>','  </div>','  <div class="tt-brand">','    <div class="tt-rose" id="tt-logo"><img src="' + GIF_KITTY_DANCE + '" alt="🐱" onerror="this.style.display=\'none\';this.parentNode.style.backgroundImage=\'url(' + GIF_KITTY_DANCE_ALT + ')\';this.parentNode.style.backgroundSize=\'contain\';this.parentNode.style.backgroundRepeat=\'no-repeat\';this.parentNode.style.backgroundPosition=\'center\';" /></div>','    <div class="tt-brand-txt">','      <div class="tt-title-main">THANH TUẤN <span class="rose-mark">🎀</span></div>','      <div class="tt-title-sub">HELLO KITTY · v49.0.0</div>','    </div>','  </div>','</div>','<div class="tt-body">','  <div class="tt-status" id="tt-status">🎀 Sẵn sàng 🐱</div>','  <div class="tt-section">','    <div class="tt-section-title"><span class="r">🎀</span> DOMAIN ĐÍCH</div>','    <input class="tt-input" id="tt-domain-input" type="text" placeholder="vd: example.com" />','    <div class="tt-section-title" style="margin-top:5px"><span class="r">🐱</span> TỪ KHÓA SERVER</div>','    <input class="tt-input" id="tt-keyword-input" type="text" placeholder="để trống = dùng domain" />','    <span class="tt-hint">🎀 Click kết quả Google đầu tiên 🐱</span>','    <div class="tt-row" style="margin-top:5px;margin-bottom:0">','      <button class="tt-btn blue" id="tt-save-domain" style="flex:1">💾 LƯU</button>','      <button class="tt-btn gold" id="tt-start" style="flex:1">⚡ BẮT ĐẦU</button>','    </div>','    <div class="tt-domain-list" id="tt-domain-list"></div>','  </div>','  <div class="tt-section">','    <div class="tt-section-title"><span class="r">🎀</span> ĐIỀU KHIỂN</div>','    <button class="tt-btn gray" id="tt-reset" style="width:100%;padding:8px">🔄 RESET</button>','    <div class="tt-timer" id="tt-timer" style="margin-top:6px;margin-bottom:0">','      <div class="tt-kitty-emoji" id="tt-kitty-emoji">🐱</div>','      <div class="tt-timer-wrap">','        <svg viewBox="0 0 60 60">','          <defs>','            <linearGradient id="ttTimerGrad" x1="0%" y1="0%" x2="100%" y2="100%">','              <stop offset="0%" stop-color="#F48FB1"/>','              <stop offset="50%" stop-color="#E91E63"/>','              <stop offset="100%" stop-color="#FF80AB"/>','            </linearGradient>','          </defs>','          <circle class="tt-timer-track" cx="30" cy="30" r="26"/>','          <circle class="tt-timer-prog" id="tt-timer-prog" cx="30" cy="30" r="26"/>','        </svg>','        <div class="tt-timer-num" id="tt-timer-num">0</div>','      </div>','      <div class="tt-timer-cap" id="tt-timer-cap">ĐANG CHỜ</div>','    </div>','  </div>','  <div class="tt-section tt-full">','    <div class="tt-section-title"><span class="r">🐱</span> KEYWORD → DOMAIN MAP</div>','    <input class="tt-input" id="tt-kw-input" type="text" placeholder="keyword (vd: Sunwin)" style="margin-bottom:5px" />','    <input class="tt-input" id="tt-kw-domain" type="text" placeholder="domain (vd: sunwin.com)" style="margin-bottom:5px" />','    <div class="tt-row">','      <button class="tt-btn blue" id="tt-kw-save" style="flex:1">💾 LƯU MAP</button>','      <button class="tt-btn gold" id="tt-kw-auto" style="flex:1">⚡ QUÉT + AUTO</button>','    </div>','    <div class="tt-domain-list" id="tt-kw-list"></div>','  </div>','  <div class="tt-guide tt-full" id="tt-guide"></div>','  <div class="tt-code" id="tt-code">','    <div class="tt-code-label"><span class="r">🎀</span>MÃ</div>','    <div class="tt-code-right">','      <div class="tt-code-value" id="tt-code-value">----</div>','      <button class="tt-btn gold" id="tt-copy-btn" style="width:100%;padding:7px;font-size:9px">📋 COPY</button>','    </div>','  </div>','</div>','<div class="tt-foot">','  <span class="r">🎀</span>','  <span class="w">(c) THANHTUAN</span>','  <span class="vn">🐱 HELLO KITTY 🐱</span>','  <span class="r">🎀</span>','</div>'].join('');
        var root = document.createElement('div'); root.id = 'tt-root'; root.innerHTML = html; document.body.appendChild(root);
        UI = { root: root, head: root.querySelector('#tt-head'), status: root.querySelector('#tt-status'), timer: root.querySelector('#tt-timer'), timerNum: root.querySelector('#tt-timer-num'), timerProg: root.querySelector('#tt-timer-prog'), timerCap: root.querySelector('#tt-timer-cap'), kittyEmoji: root.querySelector('#tt-kitty-emoji'), guide: root.querySelector('#tt-guide'), code: root.querySelector('#tt-code'), codeVal: root.querySelector('#tt-code-value'), copyBtn: root.querySelector('#tt-copy-btn'), minBtn: root.querySelector('#tt-min'), closeBtn: root.querySelector('#tt-close'), logo: root.querySelector('#tt-logo'), domainInput: root.querySelector('#tt-domain-input'), keywordInput: root.querySelector('#tt-keyword-input'), saveBtn: root.querySelector('#tt-save-domain'), startBtn: root.querySelector('#tt-start'), domainList: root.querySelector('#tt-domain-list'), resetBtn: root.querySelector('#tt-reset'), kwInput: root.querySelector('#tt-kw-input'), kwDomain: root.querySelector('#tt-kw-domain'), kwSaveBtn: root.querySelector('#tt-kw-save'), kwAutoBtn: root.querySelector('#tt-kw-auto'), kwList: root.querySelector('#tt-kw-list') };
        if (UI.domainList) UI.domainList.addEventListener('click', onDomainListClick);
        if (UI.kwList) UI.kwList.addEventListener('click', onKWListClick);
        UI.copyBtn.onclick = function() { var c = (UI.codeVal.textContent || '').trim(); if (!c || c === '----') { showToast('🎀 Chưa có mã! 🐱'); return; } copyToClipboard(c); UI.copyBtn.textContent = '✅ ĐÃ COPY: ' + c; setTimeout(function() { UI.copyBtn.textContent = '📋 COPY'; }, 2000); };
        UI.resetBtn.onclick = function() {
            if (!confirm('Reset toan bo?')) return;
            try { S.set('state', STATE.IDLE); } catch (e) {} try { S.set('inFlow', '0'); } catch (e) {} try { S.resetFull(); } catch (e) {} try { S.del('code'); } catch (e) {} try { S.del('codeHardLock'); } catch (e) {} try { S.del('pendingAutoReset'); } catch (e) {} try { S.del('fakeFingerprint'); } catch (e) {} try { S.del('dichvuCreatedUrls'); } catch (e) {} try { S.del('lastGtrafficUrl'); } catch (e) {} try { S.del('robuxWaitingGtraffic'); } catch (e) {}
            try { DICHVU_LOCK.unlockAll(); } catch (e) {}
            try { sessionStorage.removeItem(__openBlockKey); } catch (e) {}
            try { location.reload(true); } catch (e) { location.reload(); }
        };
        UI.saveBtn.onclick = function() { var v = UI.domainInput.value.trim(); if (!v) { UI.domainInput.focus(); return; } var ok = DOMAINS.save(v); UI.saveBtn.textContent = ok ? '✓ LƯU' : '✓ CÓ RỒI'; setTimeout(function(){ UI.saveBtn.textContent = '💾 LƯU'; }, 1200); renderDomainList(); };
        if (UI.kwSaveBtn) UI.kwSaveBtn.onclick = function() { var kw = (UI.kwInput.value || '').trim(); var dm = (UI.kwDomain.value || '').trim(); if (!kw || !dm) { showToast('🎀 Nhập đủ keyword và domain! 🐱'); return; } var ok = KEYWORD_MAP.save(kw, dm); UI.kwSaveBtn.textContent = ok ? '✓ ĐÃ LƯU' : '✗ LỖI'; setTimeout(function(){ UI.kwSaveBtn.textContent = '💾 LƯU MAP'; }, 1200); if (ok) { UI.kwInput.value = ''; UI.kwDomain.value = ''; showToast('🎀 Đã lưu: ' + kw + ' → ' + dm + ' 🐱', 2000); } renderKWList(); };
        if (UI.kwAutoBtn) UI.kwAutoBtn.onclick = function() { if (UI.status) UI.status.textContent = '🎀 Đang OCR keyword... 🐱'; scanDichvuKeyword().then(function(kw) { if (kw && UI.kwInput) UI.kwInput.value = kw; if (!kw) { showToast('🎀 OCR không đọc được 🐱', 3000); if (UI.status) UI.status.textContent = '🎀 OCR không đọc được 🐱'; renderKWList(); return; } var dm = KEYWORD_MAP.lookup(kw); if (!dm) { showToast('🎀 OCR: ' + kw + ' — chưa có domain 🐱', 3500); if (UI.status) UI.status.textContent = '🎀 OCR: ' + kw + ' — chưa có domain 🐱'; if (UI.kwDomain) UI.kwDomain.focus(); renderKWList(); return; } if (UI.kwDomain) UI.kwDomain.value = dm; if (UI.domainInput) UI.domainInput.value = dm; if (UI.keywordInput) UI.keywordInput.value = kw; if (UI.status) UI.status.textContent = '🎀 Match: ' + kw + ' → ' + dm + ' 🐱'; showToast('🎀 Match: ' + kw + ' → ' + dm + ' 🐱', 2500); renderKWList(); setTimeout(function() { try { if (UI && UI.startBtn) UI.startBtn.click(); } catch (e) {} }, 300); }); };
        UI.startBtn.onclick = function() {
            var vD = UI.domainInput.value.trim(); var vK = UI.keywordInput ? UI.keywordInput.value.trim() : '';
            if (!vD && !vK) { UI.status.textContent = '🎀 Nhập domain hoặc từ khóa! 🐱'; UI.domainInput.focus(); return; }
            var domain = vD ? vD.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim() : ''; var keyword = vK; var searchTerm = keyword ? keyword : domain;
            S.del('code'); S.del('targetUrl'); S.del('filled'); S.del('confirmed'); S.del('lastClickTime'); S.del('googleClickTries'); S.del('codeFoundAt'); S.del('lastServerSec'); S.del('serverTotalSec'); S.del('navigatingBack'); S.del('cdStartSec'); S.del('cdStartAt'); S.del('btnClickAt'); S.del('gotCodeAt'); S.del('codeAttempts'); S.del('backDone'); S.del('lastNavUrl'); S.del('lastNavAt'); S.del('hardStop'); S.del('countdownRealZero'); S.del('getLinkClicked'); S.del('waitingGetLink'); S.del('getLinkDeadline'); S.del('getLinkStartAt'); S.del('pendingAutoReset');
            try { S.del('codeBackup'); } catch (e) {} try { S.del('codeHardLock'); } catch (e) {}
            resetFillFlags(); S.set('domain', domain); S.set('keyword', keyword); S.set('gtrafficUrl', location.href); S.set('inFlow', '1'); S.set('childTabOpen', '1'); setState(STATE.GOOGLE_SEARCH);
            if (domain) DOMAINS.save(domain); if (keyword && domain) KEYWORD_MAP.save(keyword, domain); renderDomainList(); renderKWList();
            var gurl = 'https://www.google.com/search?q=' + encodeURIComponent(searchTerm);
            UI.status.textContent = '🎀 B1: Đang mở tab Google... 🐱';
            var childWin = null; try { childWin = window.open(gurl, '_blank'); childTabRef = childWin; } catch (e) {}
            if (childWin) { UI.status.textContent = '🎀 Đang chạy trên tab mới... 🐱'; startChildPoller(); } else { UI.status.textContent = '🎀 Cho phép popup! 🐱'; S.set('childTabOpen', '0'); }
        };
        UI.domainInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') UI.startBtn.click(); });
        if (UI.keywordInput) UI.keywordInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') UI.startBtn.click(); });
        UI.minBtn.onclick = function(e){ e.stopPropagation(); toggleMin(); };
        UI.closeBtn.onclick = function(e){
            e.stopPropagation();
            try { showGifOverlay(1800); } catch (e) {}
            setTimeout(function() {
                UI.root.style.display = 'none';
                var fab = document.getElementById('tt-fab');
                if (!fab) {
                    fab = document.createElement('div');
                    fab.id = 'tt-fab';
                    fab.innerHTML = '<div class="tt-fab-emoji">🐱</div>';
                    fab.onclick = function(){ UI.root.style.display = ''; fab.remove(); };
                    document.body.appendChild(fab);
                }
            }, 400);
        };
        if (S.get('min') === '1') { UI.root.classList.add('tt-min'); UI.minBtn.textContent = '+'; }
        var pos = S.get('pos'); if (pos && typeof pos === 'object') { UI.root.style.left = pos.x + 'px'; UI.root.style.top = pos.y + 'px'; UI.root.style.transform = 'none'; }
        enableDrag();
        if (S.get('pendingAutoReset') === '1') { if (UI.domainInput) UI.domainInput.value = ''; if (UI.keywordInput) UI.keywordInput.value = ''; if (UI.status) UI.status.textContent = '🎀 Sẵn sàng 🐱'; } else { var cd = S.get('domain'); if (cd) UI.domainInput.value = cd; var ck = S.get('keyword'); if (ck && UI.keywordInput) UI.keywordInput.value = ck; }
        renderDomainList(); renderKWList();
    }
    function startChildPoller() {
        if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
        pollChildTimer = setInterval(function() {
            if (S.get('pendingAutoReset') === '1') { clearInterval(pollChildTimer); pollChildTimer = null; return; }
            var code = loadCode();
            if (code && isValidCodeShape(code) && !isBlacklistedCode(code)) { clearInterval(pollChildTimer); pollChildTimer = null; try { window.focus(); } catch (e) {} fillAndConfirm(true); }
            if (childTabRef && childTabRef.closed) {
                childTabRef = null; S.set('childTabOpen', '0');
                setTimeout(function() { var c = loadCode(); if (c && isValidCodeShape(c) && !isBlacklistedCode(c)) { fillAndConfirm(true); } else { S.set('inFlow', '0'); if (UI) UI.status.textContent = '🎀 Không lấy được mã 🐱'; } }, 1000);
                clearInterval(pollChildTimer); pollChildTimer = null;
            }
        }, 500);
    }
    function findCreateLinkButton() {
        var all = document.querySelectorAll('button, a, div[role="button"], input[type="submit"], input[type="button"], .btn'), best = null, bestScore = -1;
        for (var i = 0; i < all.length; i++) { var el = all[i]; if (el.closest && el.closest('#tt-root')) continue; if (el.closest && el.closest('#tt-fab')) continue; if (el.closest && el.closest('#shortlinkModal')) continue; var r = el.getBoundingClientRect(); if (r.width < 80 || r.height < 25) continue; if (r.width > 500) continue; var txt = (el.textContent || el.value || '').replace(/\s+/g, ' ').trim(); if (!txt || txt.length > 30) continue; var sc = 0, lc = txt.toLowerCase(); if (lc === 'tạo link') sc += 500; else if (lc === 'tao link') sc += 480; else if (lc.indexOf('tạo link') !== -1) sc += 400; else if (lc.indexOf('tao link') !== -1) sc += 380; else if (lc.indexOf('create link') !== -1) sc += 350; else if (lc.indexOf('get link') !== -1) sc += 300; else if (lc.indexOf('nhận link') !== -1) sc += 300; else continue; if (el.tagName === 'BUTTON') sc += 100; if (el.tagName === 'A') sc += 50; if (sc > bestScore) { bestScore = sc; best = el; } }
        return best;
    }
    function findVuotLinkButton() { var m = document.getElementById('shortlinkModal'); if (!m) return null; if (!isShortlinkModalVisible()) return null; try { var g = m.querySelector('#shortlinkGoBtn'); if (g && !g.__dichvuClicked) { var r = g.getBoundingClientRect(); if (r.width >= 40 && r.height >= 20) return g; } } catch (e) {} return null; }
    function findVuotLinkOutsideCard() {
        var all = document.querySelectorAll('button, a');
        for (var i = 0; i < all.length; i++) { var el = all[i]; if (el.closest && el.closest('#shortlinkModal')) continue; if (el.closest && el.closest('#tt-root')) continue; if (el.closest && el.closest('#tt-fab')) continue; if (el.disabled) continue; if (el.__dichvuClicked) continue; var txt = (el.textContent || '').trim().toLowerCase(); if (txt !== 'vượt link' && txt !== 'vuot link') continue; var r = el.getBoundingClientRect(); if (r.width < 60 || r.height < 20) continue; var bg = getBgRGBA(el); var g = bg && bg.g > 150 && bg.g > bg.r && bg.g > bg.b; var cls = (el.className || '').toString().toLowerCase(); if (g || cls.indexOf('btn-success') !== -1) return el; }
        return null;
    }
    function isShortlinkModalVisible() { try { var m = document.getElementById('shortlinkModal'); if (!m) return false; if (m.classList && m.classList.contains('show')) return true; var st = window.getComputedStyle(m); if (st.display !== 'none' && st.visibility !== 'hidden' && parseFloat(st.opacity) > 0.5) return true; var inp = document.getElementById('shortlinkUrl'); if (inp && inp.value && inp.value.length > 5) return true; } catch (e) {} return false; }
    function extractTargetUrl(g) { if (!g) return ''; var url = ''; try { if (g.tagName === 'A' && g.href) url = g.href; if (!url) { var a = g.querySelector('a[href]'); if (a && a.href) url = a.href; } if (!url && g.getAttribute) url = g.getAttribute('data-href') || g.getAttribute('data-url') || g.getAttribute('href') || ''; } catch (e) {} return url || ''; }
    function dichvuSafeClickOnce(el) { if (!el) return false; if (el.__dichvuClicked) return false; el.__dichvuClicked = true; try { el.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch (e) {} try { el.click(); return true; } catch (e) {} return false; }
    function dichvuHardStopAll() { stopRequested = true; loopRunning = false; finishCalled = true; submitted = true; if (dichvuTaskTimer) { try { clearInterval(dichvuTaskTimer); } catch (e) {} dichvuTaskTimer = null; } if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; } if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; } if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; } if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; } if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; } }
    function ensureOnDichvuTaskPage() {
        if (!isDichvuTask) return false;
        var path = location.pathname;
        if (path.indexOf(CFG.dichvuTaskPath) === 0 || path.indexOf('/client/vuot-link') !== -1) return true;
        log('DICHVU: dang o ' + path + ' → chuyen ' + CFG.dichvuTaskPath);
        if (UI && UI.status) UI.status.textContent = '🎀 Đang vào trang nhận NV... 🐱';
        setTimeout(function() { try { location.href = CFG.dichvuTaskPath; } catch (e) { log('DICHVU chuyen trang loi: ' + e.message); } }, 800);
        return false;
    }
    function handleDichvuTask() {
        if (!isDichvuTask) return Promise.resolve();
        if (isCloudflareChallengePage()) { handleCloudflareChallenge(); return Promise.resolve(); }
        if (!ensureOnDichvuTaskPage()) return Promise.resolve();
        if (S.get('pendingAutoReset') === '1') return Promise.resolve();
        if (DICHVU_LOCK.isLocked()) return Promise.resolve();
        if (dichvuTabOpened) return Promise.resolve();
        if (dichvuGoClicked) return Promise.resolve();
        var curUrl = location.href; var urlLocked = DICHVU_URLS.has(curUrl);
        if (isShortlinkModalVisible()) { var g = findVuotLinkButton(); if (g) { var tu = extractTargetUrl(g); DICHVU_LOCK.lock(); dichvuGoClicked = true; dichvuTabOpened = true; dichvuDone = true; S.set('dichvuStage', 'clicked_go'); dichvuHardStopAll(); setState(STATE.IDLE); S.set('inFlow', '0'); if (tu && /^https?:\/\//i.test(tu)) { if (UI) UI.status.textContent = '🎀 Mở tab gtraffic mới 🐱'; setTimeout(function() { try { var nt = window.open(tu, '_blank'); if (!nt) { try { location.href = tu; } catch (e) {} } } catch (e) { try { location.href = tu; } catch (e2) {} } }, 100); } else { dichvuArmOpenGuard(); dichvuSafeClickOnce(g); } return Promise.resolve(); } return Promise.resolve(); }
        if (urlLocked || dichvuCreateClicked) { if (dichvuOutsideClicked && (Date.now() - dichvuOutsideClickedAt) < CFG.dichvuOutsideCooldownMs) return Promise.resolve(); var ob = findVuotLinkOutsideCard(); if (ob) { dichvuOutsideClicked = true; dichvuOutsideClickedAt = Date.now(); dichvuSafeClickOnce(ob); return Promise.resolve(); } return Promise.resolve(); }
        if (DICHVU_LOCK.isCreateLocked()) return Promise.resolve();
        if (dichvuCreateClicked && (Date.now() - dichvuLastCreateAt) < CFG.dichvuClickCooldownMs) return Promise.resolve();
        var cb = findCreateLinkButton();
        if (cb) { DICHVU_LOCK.lockCreate(); DICHVU_URLS.add(curUrl); S.set('dichvuStage', 'clicked_create'); S.set('dichvuClickAt', Date.now().toString()); dichvuCreateClicked = true; dichvuLastCreateAt = Date.now(); setTimeout(function() { dichvuSafeClickOnce(cb); }, 200); }
        return Promise.resolve();
    }
    function findGtrafficCard() {
        var grid = document.getElementById('linkGrid');
        if (!grid) return null;
        var allCards = grid.querySelectorAll('*');
        var best = null, bestScore = -1;
        for (var i = 0; i < allCards.length; i++) {
            var el = allCards[i];
            var txt = (el.textContent || '').toLowerCase().trim();
            if (txt.indexOf('gtraffic') === -1 && txt.indexOf('g traffic') === -1) continue;
            var rect = el.getBoundingClientRect();
            if (rect.width < 100 || rect.width > 700) continue;
            if (rect.height < 30 || rect.height > 300) continue;
            var sc = 0;
            var ownText = '';
            for (var j = 0; j < el.childNodes.length; j++) { if (el.childNodes[j].nodeType === 3) ownText += el.childNodes[j].textContent; }
            if (ownText.toLowerCase().indexOf('gtraffic') !== -1) sc += 500;
            try { var st = window.getComputedStyle(el); if (st.cursor === 'pointer') sc += 200; } catch (e) {}
            if (el.tagName === 'DIV' && txt.length < 100) sc += 150;
            var cls = (el.className || '').toString().toLowerCase();
            if (cls.indexOf('link') !== -1) sc += 100;
            if (cls.indexOf('card') !== -1) sc += 100;
            if (cls.indexOf('item') !== -1) sc += 80;
            if (rect.width > 0 && rect.height > 0) sc += 50;
            if (sc > bestScore) { bestScore = sc; best = el; }
        }
        return best;
    }
    function findOpenButtonInModal() {
        var mo = document.getElementById('mo');
        if (!mo) { log('ROBUX: khong tim thay #mo'); return null; }
        try { var moStyle = window.getComputedStyle(mo); if (moStyle.display === 'none' || moStyle.visibility === 'hidden') { log('ROBUX: #mo bi an'); return null; } if (parseFloat(moStyle.opacity) < 0.1) { log('ROBUX: #mo opacity thap'); return null; } } catch (e) {}
        var openBtn = mo.querySelector('button[onclick*="openLink"], .cb[onclick*="openLink"]');
        if (openBtn) { log('ROBUX: ★ Tim thay nut onclick=openLink()'); return openBtn; }
        var cbBtns = mo.querySelectorAll('.cb');
        for (var i = 0; i < cbBtns.length; i++) { var txt = (cbBtns[i].textContent || '').trim().toLowerCase(); if (txt === 'mở' || txt === 'mo' || txt === 'open') { log('ROBUX: ★ Tim thay nut.cb'); return cbBtns[i]; } }
        var linkBox = mo.querySelector('.link-box');
        if (linkBox) { var btns = linkBox.querySelectorAll('button'); for (var j = 0; j < btns.length; j++) { var t2 = (btns[j].textContent || '').trim().toLowerCase(); if (t2 === 'mở' || t2 === 'mo' || t2 === 'open') { log('ROBUX: ★ Tim thay nut trong .link-box'); return btns[j]; } } }
        var allBtns = mo.querySelectorAll('button, a');
        for (var k = 0; k < allBtns.length; k++) { var t3 = (allBtns[k].textContent || '').trim().toLowerCase(); if (t3 === 'mở' || t3 === 'mo' || t3 === 'open') { log('ROBUX: ★ Fallback tim thay nut Mở'); return allBtns[k]; } }
        log('ROBUX: ❌ KHONG TIM THAY NUT MO');
        return null;
    }
    function ensureOnEarnPage() {
        if (!isRobuxReward) return false;
        var path = location.pathname;
        if (path === '/earn' || path.indexOf('/earn') === 0) return true;
        if (path.indexOf('/claim') === 0) return false;
        log('ROBUX: dang o ' + path + ' → chuyen /earn');
        if (UI && UI.status) UI.status.textContent = '🎀 Chuyển sang trang Kiếm Coin... 🐱';
        setTimeout(function() { try { location.href = '/earn'; } catch (e) { log('ROBUX chuyen trang loi: ' + e.message); } }, 500);
        return false;
    }
    function handleRobuxClaim() {
        if (!isRobuxReward) return Promise.resolve();
        if (!IS_TOP) return Promise.resolve();
        var path = location.pathname;
        if (path.indexOf('/claim') !== 0) return Promise.resolve();
        if (robuxClaimStartAt === 0) {
            robuxClaimStartAt = Date.now();
            robuxClaimDone = false;
            log('ROBUX CLAIM: ★ Bat dau theo doi trang /claim');
            if (UI) UI.status.textContent = '🎀 Đang claim coin... 🐱';
        }
        if (robuxClaimDone) return Promise.resolve();
        var bodyTxt = (document.body && document.body.innerText) || '';
        var bodyLc = bodyTxt.toLowerCase();
        var successSignals = ['nhận coin thành công', 'claimed successfully', 'thành công!', 'coin đã được cộng', 'coins have been added'];
        var errorSignals = ['key đã được sử dụng', 'key already used', 'key đã hết hạn', 'key expired', 'key không hợp lệ', 'invalid key'];
        var isSuccess = false, isError = false;
        for (var i = 0; i < successSignals.length; i++) { if (bodyLc.indexOf(successSignals[i]) !== -1) { isSuccess = true; break; } }
        for (var j = 0; j < errorSignals.length; j++) { if (bodyLc.indexOf(errorSignals[j]) !== -1) { isError = true; break; } }
        var earnLink = document.querySelector('a[href="/earn"]');
        if (earnLink && (isSuccess || isError)) {
            log('ROBUX CLAIM: ★ Phat hien ket qua (success=' + isSuccess + ', error=' + isError + ')');
            robuxClaimDone = true;
            if (isSuccess) {
                if (UI) UI.status.textContent = '🎀 Claim thành công! Đang về /earn... 🐱';
                try { showGifOverlay(1500); } catch (e) {}
                try { showToast('🎀 +Coin thành công! Về /earn 🐱', 2000); } catch (e) {}
            } else {
                if (UI) UI.status.textContent = '🐱 Claim lỗi — về /earn 🎀';
                try { showToast('🐱 Claim lỗi — về /earn', 2000); } catch (e) {}
            }
            setTimeout(function() {
                log('ROBUX CLAIM: ★ Click "Ve trang Earn"');
                try {
                    if (earnLink) { earnLink.click(); log('ROBUX CLAIM: da click nut "Ve trang Earn"'); }
                    else { location.href = '/earn'; }
                } catch (e) { try { location.href = '/earn'; } catch (e2) {} }
            }, 1500);
            return Promise.resolve();
        }
        if (UI) UI.status.textContent = '🎀 Đang claim coin... 🐱';
        if (Date.now() - robuxClaimStartAt > 30000) {
            log('ROBUX CLAIM: ★ QUA 30s → ve /earn');
            if (UI) UI.status.textContent = '🐱 Hết thời gian chờ — về /earn 🎀';
            robuxClaimDone = true;
            try { location.href = '/earn'; } catch (e) {}
        }
        return Promise.resolve();
    }
    function handleRobuxTask() {
        if (!isRobuxReward) return Promise.resolve();
        if (!IS_TOP) return Promise.resolve();
        if (!ensureOnEarnPage()) return Promise.resolve();
        if (S.get('robuxWaitingGtraffic') === '1') {
            if (robuxGtrafficTabRef && robuxGtrafficTabRef.closed) {
                log('ROBUX: tab gtraffic da dong → reset');
                S.set('robuxWaitingGtraffic', '0'); robuxGtrafficTabRef = null; robuxTaskRunning = false; robuxModalOpenedAt = 0;
                setTimeout(function() { try { handleRobuxTask(); } catch (e) {} }, 2000);
            }
            return Promise.resolve();
        }
        if (Date.now() - robuxLastClickAt < CFG.robuxCooldownMs) return Promise.resolve();
        var mo = document.getElementById('mo');
        if (mo && window.getComputedStyle(mo).display !== 'none') {
            var ob = findOpenButtonInModal();
            if (ob) {
                log('ROBUX: ★ Tim thay nut Mo → CLICK');
                robuxLastClickAt = Date.now();
                robuxModalOpenedAt = 0;
                var clicked = false;
                try { if (typeof window.openLink === 'function') { log('ROBUX: → goi truc tiep window.openLink()'); window.openLink(); clicked = true; } } catch (e) { log('ROBUX: openLink() loi: ' + e.message); }
                if (!clicked) {
                    try { ob.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch (e) {}
                    try { ob.focus({ preventScroll: true }); } catch (e) {}
                    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(function(evName) {
                        try { if (evName.indexOf('pointer') === 0) { ob.dispatchEvent(new PointerEvent(evName, { bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: (evName === 'pointerdown' ? 1 : 0) })); } else { ob.dispatchEvent(new MouseEvent(evName, { bubbles: true, cancelable: true, button: 0, buttons: (evName === 'mousedown' ? 1 : 0) })); } } catch (e) {}
                    });
                    try { ob.click(); } catch (e) {}
                }
                S.set('robuxWaitingGtraffic', '1');
                if (UI && UI.status) UI.status.textContent = '🎀 Đã mở tab gtraffic... 🐱';
                try { showToast('🎀 Đã mở gtraffic 🐱', 3000); } catch (e) {}
                try { if (childTabRef) robuxGtrafficTabRef = childTabRef; } catch (e) {}
                return Promise.resolve();
            }
            if (UI && UI.status) UI.status.textContent = '🐱 Đang tìm nút Mở trong modal... 🎀';
            return Promise.resolve();
        } else { if (robuxModalOpenedAt !== 0) { robuxModalOpenedAt = 0; log('ROBUX: modal da dong'); } }
        var card = findGtrafficCard();
        if (card) {
            log('ROBUX: ★ Tim card Gtraffic → click');
            robuxLastClickAt = Date.now();
            try {
                try { card.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch (e) {}
                card.click();
                try { card.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {}
                if (UI && UI.status) UI.status.textContent = '🎀 Đã click Gtraffic — chờ modal 🐱';
                try { showToast('🎀 Click Gtraffic 400 Coin 🐱', 2000); } catch (e) {}
            } catch (e) { log('ROBUX loi click card: ' + e.message); }
        } else { if (UI && UI.status) UI.status.textContent = '🐱 Tìm Gtraffic... 🎀'; }
        return Promise.resolve();
    }
    function toggleMin() { if (!UI.root) return; var m = UI.root.classList.toggle('tt-min'); UI.minBtn.textContent = m ? '+' : '−'; S.set('min', m ? '1' : '0'); }
    function enableDrag() {
        var h = UI.head; if (!h) return;
        var dg = false, sx = 0, sy = 0, ox = 0, oy = 0;
        var dn = function(e) { if (e.target.closest('.tt-icon-btn')) return; if (UI.root.classList.contains('tt-min')) { toggleMin(); return; } dg = true; var p = e.touches ? e.touches[0] : e; sx = p.clientX; sy = p.clientY; var r = UI.root.getBoundingClientRect(); ox = r.left; oy = r.top; UI.root.style.left = ox + 'px'; UI.root.style.top = oy + 'px'; UI.root.style.right = 'auto'; UI.root.style.transform = 'none'; document.addEventListener('mousemove', mv, { passive: false }); document.addEventListener('mouseup', up); document.addEventListener('touchmove', mv, { passive: false }); document.addEventListener('touchend', up); e.preventDefault(); };
        var mv = function(e) { if (!dg) return; var p = e.touches ? e.touches[0] : e; var nx = ox + (p.clientX - sx), ny = oy + (p.clientY - sy); nx = Math.max(0, Math.min(nx, window.innerWidth - UI.root.offsetWidth)); ny = Math.max(0, Math.min(ny, window.innerHeight - UI.root.offsetHeight)); UI.root.style.left = nx + 'px'; UI.root.style.top = ny + 'px'; if (e.cancelable) e.preventDefault(); };
        var up = function() { if (!dg) return; dg = false; var r = UI.root.getBoundingClientRect(); S.set('pos', { x: r.left, y: r.top }); document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); document.removeEventListener('touchmove', mv); document.removeEventListener('touchend', up); };
        h.addEventListener('mousedown', dn); h.addEventListener('touchstart', dn, { passive: false });
    }
    function refreshStatus() {
        if (!UI.status) return;
        if (S.get('pendingAutoReset') === '1') { UI.status.textContent = '🎀 Sẵn sàng 🐱'; return; }
        var map = { 'idle': '🎀 Sẵn sàng 🐱', 'google-search': '🐱 B2: Tìm Google... 🎀', 'google-click': '🎀 B3: Click trang... 🐱', 'scan-btn': '🐱 B4: Đợi nút g... 🎀', 'wait-countdown': '🎀 B5: Chờ hết giờ... 🐱', 'get-code': '🐱 B5: Lấy mã... 🎀', 'back-gtraffic': '🎀 Về gtraffic.io... 🐱', 'fill-code': '🐱 Điền + nộp mã... 🎀', 'done': '🎀 HOÀN TẤT! 🐱', 'dichvu-task': '🎀 Auto nhận NV... 🐱', 'robux-task': '🎀 Auto Gtraffic 400 Coin... 🐱', 'robux-claim': '🎀 Đang claim coin... 🐱' };
        UI.status.textContent = map[getState()] || ('🎀 ' + getState() + ' 🐱');
    }
    function showTimer(sec, max, label) {
        if (!UI.timer) return;
        UI.timer.classList.add('show');
        UI.timerNum.textContent = sec;
        UI.timerCap.textContent = label || 'ĐANG CHỜ';
        if (max > 0 && sec > 0) { var C_ = 2 * Math.PI * 26; var ratio = Math.min(1, Math.max(0, sec / max)); UI.timerProg.style.strokeDashoffset = C_ * (1 - ratio); }
        else if (sec === 0) { var C_ = 2 * Math.PI * 26; UI.timerProg.style.strokeDashoffset = C_; UI.timerCap.textContent = '🎀 SẴN SÀNG LẤY MÃ 🐱'; }
        try {
            var kitty = UI.kittyEmoji || (UI.timer && UI.timer.querySelector('.tt-kitty-emoji'));
            if (kitty) {
                if (sec > 0 && sec <= 3) { kitty.style.animationDuration = '0.3s'; kitty.style.filter = 'drop-shadow(0 4px 8px rgba(233,30,99,.9)) drop-shadow(0 0 12px rgba(255,20,147,1))'; kitty.style.background = 'radial-gradient(circle at 30% 30%,#FFD9E8,#FF1493)'; }
                else if (sec > 0 && sec <= 10) { kitty.style.animationDuration = '0.45s'; kitty.style.filter = 'drop-shadow(0 4px 8px rgba(233,30,99,.8))'; kitty.style.background = 'radial-gradient(circle at 30% 30%,#FFE4F0,#FF69B4)'; }
                else { kitty.style.animationDuration = '0.6s'; kitty.style.filter = 'drop-shadow(0 4px 8px rgba(233,30,99,.7))'; kitty.style.background = 'radial-gradient(circle at 30% 30%,#FFE4F0,#F48FB1)'; }
            }
        } catch (e) {}
    }
    function showGuide(html) { if (UI.guide) { UI.guide.innerHTML = html; UI.guide.classList.add('show'); } }
    function copyToClipboard(text) {
        if (!text) return false; var tried = false;
        try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function() { S.set('lastCopyOk', '1'); S.set('lastCopyText', text); }).catch(function() { if (copyViaExecCommand(text)) { S.set('lastCopyOk', '1'); S.set('lastCopyText', text); } }); tried = true; } } catch (e) {}
        if (!tried) { if (copyViaExecCommand(text)) { S.set('lastCopyOk', '1'); S.set('lastCopyText', text); } }
        return true;
    }
    function copyViaExecCommand(text) { try { var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0.01;z-index:-1;'; document.body.appendChild(ta); ta.focus(); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); return ok; } catch (e) { return false; } }
    function showToast(msg, ms) { var old = document.getElementById('tt-toast'); if (old) old.remove(); var t = document.createElement('div'); t.id = 'tt-toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(function() { if (t.parentNode) t.remove(); }, ms || 2500); }
    function showCode(code) { if (!UI.code) return; UI.code.classList.add('show'); UI.codeVal.textContent = code; saveCode(code); setTimeout(function() { showToast('🎀 MÃ ĐÃ VỀ: ' + code + ' 🐱', 2800); }, 400); }
    function renderDomainList() { if (!IS_TOP || !UI.domainList) return; var list = DOMAINS.getList(); UI.domainList.innerHTML = ''; if (!list.length) { UI.domainList.innerHTML = '<div class="tt-empty">🎀 Chưa có domain 🐱</div>'; return; } var frag = document.createDocumentFragment(); for (var i = 0; i < list.length; i++) frag.appendChild(makeDomainRow(list[i])); UI.domainList.appendChild(frag); }
    function isBlueish(c) { if (!c) return false; if (c.b < 110) return false; if (c.r > c.b) return false; if (c.g > c.b + 25) return false; if (c.b - c.r < 30) return false; return true; }
    function getBgRGBA(el) { var c = tryGetBg(el); if (c && c.a > 0.5) return c; var p = el.parentElement; var d = 0; while (p && d < 5) { var pc = tryGetBg(p); if (pc && pc.a > 0.5) return pc; p = p.parentElement; d++; } return null; }
    function tryGetBg(el) { if (!el) return null; try { var st = window.getComputedStyle(el); var bg = st.backgroundColor || ''; var m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/); if (m) { var a = m[4] !== undefined ? parseFloat(m[4]) : 1; return { r: parseInt(m[1],10), g: parseInt(m[2],10), b: parseInt(m[3],10), a: a }; } } catch (e) {} return null; }
    function isRound(el) { var w = el.offsetWidth, h = el.offsetHeight; if (w < 30 || w > 200) return false; if (h < 30 || h > 200) return false; if (Math.abs(w - h) > 15) return false; return true; }
    function isExcluded(el) { var cls = (el.className || '').toString().toLowerCase(); var id = (el.id || '').toString().toLowerCase(); var c = ' ' + cls + ' ' + id + ' '; var ban = ['logo','brand','avatar','banner','header','nav','menu','footer','navbar','topbar','toolbar','copyright']; for (var i = 0; i < ban.length; i++) { if (c.indexOf(' ' + ban[i] + ' ') !== -1) return true; if (c.indexOf(' ' + ban[i] + '-') !== -1) return true; if (c.indexOf('-' + ban[i] + ' ') !== -1) return true; } return false; }
    function findByPixelScan() {
        if (!document.body) return null;
        var vw = window.innerWidth, vh = window.innerHeight, step = 12, seen = {}, candidates = [];
        for (var y = 30; y < vh - 30; y += step) { for (var x = 30; x < vw - 30; x += step) {
            try {
                var el = document.elementFromPoint(x, y); if (!el) continue; if (el.closest && el.closest('#tt-root')) continue; if (el.closest && el.closest('#tt-fab')) continue; if (isExcluded(el)) continue;
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
        } }
        if (!candidates.length) return null;
        candidates.sort(function(a,b){ return b.score - a.score; });
        return candidates[0].el;
    }
    function findByHeuristic() {
        try { var f = ['#avt-btn','[id*="avt" i]','[class*="avt" i]','[aria-label*="verify" i]','[aria-label*="code" i]','[data-code]','[data-verify]']; for (var s = 0; s < f.length; s++) { try { var fo = document.querySelector(f[s]); if (fo && (!fo.closest || !fo.closest('#tt-root'))) { var w = fo.offsetWidth || fo.clientWidth, h = fo.offsetHeight || fo.clientHeight; if (w >= 30 && w <= 250 && Math.abs(w-h) <= 20) return fo; } } catch (e) {} } } catch (e) {}
        try { var all = document.querySelectorAll('div, span, button, a, i'); for (var k = 0; k < all.length; k++) { var e2 = all[k]; if (e2.closest && e2.closest('#tt-root')) continue; if (e2.closest && e2.closest('#tt-fab')) continue; var w2 = e2.offsetWidth || 0, h2 = e2.offsetHeight || 0; if (w2 < 30 || w2 > 200) continue; if (Math.abs(w2-h2) > 15) continue; var t2 = (e2.textContent || '').trim(); if (t2 !== 'g' && t2 !== 'G') continue; return e2; } } catch (e) {}
        return null;
    }
    function findGreenGButton() { if (cachedBtn && Date.now() - cachedBtnTime < 800) { try { if (document.contains(cachedBtn)) { var r = cachedBtn.getBoundingClientRect(); if (r.width >= 20 && r.height >= 20) return cachedBtn; } } catch (e) {} cachedBtn = null; } var b = findByHeuristic(); if (b) { cachedBtn = b; cachedBtnTime = Date.now(); return b; } b = findByPixelScan(); if (b) { cachedBtn = b; cachedBtnTime = Date.now(); return b; } cachedBtn = null; return null; }
    function readBtnNumber(btn) { if (!btn) return null; var t = (btn.textContent || '').replace(/\s+/g, '').trim(); var m = t.match(/^g?(\d{1,4})$/i); if (m) { var s = parseInt(m[1],10); if (s >= 0 && s <= 999) return s; } return null; }
    function clickBtn(el) { if (!el) return; try { el.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch (e) {} setTimeout(function() { try { el.click(); } catch (e) {} try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); } catch (e) {} }, 0); }
    function readCountdown() {
        var btn = cachedBtn; if (!btn || !document.contains(btn)) btn = findGreenGButton();
        if (btn) { var n = readBtnNumber(btn); if (n !== null) { if (S.get('cdStartSec') === '0' || !S.get('cdStartSec')) { S.set('cdStartSec', n.toString()); S.set('cdStartAt', Date.now().toString()); } if (n === 0) S.set('countdownRealZero', '1'); else S.set('countdownRealZero', '0'); return { sec: n, phase: 1, total: 2, src: 'btn' }; } }
        var clickAt = parseInt(S.get('btnClickAt', '0'), 10);
        if (clickAt > 0) { var el = Math.floor((Date.now() - clickAt) / 1000); var r = CFG.defaultCountdown - el; if (r < 0) r = 0; return { sec: r, phase: 1, total: 2, src: 'click' }; }
        var pa = Date.now() - pageLoadTime;
        if (pa > 8000) return { sec: 0, phase: 1, total: 2, src: 'fallback' };
        return null;
    }
    function isBlacklistedCode(s) {
        if (!s) return true;
        var lc = s.toLowerCase();
        if (lc === 'trang404' || lc === 'page404' || lc === 'error404' || lc === 'notfound' || lc === 'comingsoon' || lc === 'pleasewait') return true;
        var bl = ['livestream','youtube','facebook','google','login','logout','signup','signin','register','account','password','email','verify','submit','confirm','accept','cancel','button','click','here','website','hotline','support','contact','about','policy','privacy','terms','service','download','upload','install','update','welcome','hello','world','news','blog','shop','store','cart','order','payment','banking','wallet','deposit','withdraw','bonus','promotion','voucher','coupon','gift','reward','prize','winner','game','casino','sports','betting','jackpot','lottery','online','offline','mobile','desktop','tablet','laptop','computer','android','windows','linux','chrome','firefox','safari','messenger','telegram','whatsapp','zalo','viber','skype','buoc','step','next','prev','back','forward','home','search','find','filter','sort','view','show','hide','open','close','start','stop','pause','resume','play','replay','load','reload','refresh','true','false','null','undefined','none','empty','full','free','paid','public','private','secure','locked','unlocked','hidden','visible','code','ma','mã','nhap','nhập','lay','lấy','xacnhan','nhan','nhận','faqfun88','fun88','sunwin','hitclub','go88','b52club','rikvip','789club','w88','w88diler','w88link1','xoso66','xoso','xs66','m88','mu88','mu99','fb88','bk8','jun88','188bet','tf88'];
        for (var i = 0; i < bl.length; i++) if (lc === bl[i]) return true;
        if (/trang\s*\d+/i.test(s)) return true; if (/page\s*\d+/i.test(s)) return true; if (/error\s*\d+/i.test(s)) return true;
        if (/^[a-z]{8}$/.test(lc)) return true; if (/0{3,}$/.test(s)) return true;
        return false;
    }
    function isValidCodeShape(s) { if (!s) return false; if (s.length !== 8) return false; if (!/^[A-Za-z0-9]+$/.test(s)) return false; if (!/[0-9]/.test(s)) return false; if (!/[A-Za-z]/.test(s)) return false; var d = (s.match(/[0-9]/g) || []).length; if (d < 1 || d > 7) return false; var l = (s.match(/[A-Za-z]/g) || []).length; if (l < 1 || l > 7) return false; if (/^(.)\1{7}$/.test(s)) return false; if (/^(01234567|12345678|abcdefgh|ABCDEFGH|00000000|11111111)$/i.test(s)) return false; return true; }
    function scanPageForCode() {
        if (getState() !== STATE.GET_CODE) return null;
        var candidates = [], seen = {};
        try { var all = document.querySelectorAll('div, span, button, a, p, strong, h1, h2, h3, h4, td, th, li, label, section, article, code, kbd, mark, pre'); for (var i = 0; i < all.length; i++) { var el = all[i]; if (el.closest && el.closest('#tt-root')) continue; if (el.closest && el.closest('#tt-fab')) continue; if (cachedBtn && el === cachedBtn) continue; var txt = (el.textContent || '').replace(/\s+/g, '').trim(); if (!txt || txt.length !== 8) continue; if (!/^[A-Za-z0-9]+$/.test(txt)) continue; if (isBlacklistedCode(txt)) continue; if (!isValidCodeShape(txt)) continue; if (seen[txt]) continue; seen[txt] = true; candidates.push(txt); } } catch (e) {}
        if (!candidates.length) return null;
        return candidates[0];
    }
    function extractCodeFromBtn(btn) { if (!btn) return null; var t = (btn.textContent || '').replace(/\s+/g, '').trim(); if (t.length === 8 && /^[A-Za-z0-9]+$/.test(t) && !isBlacklistedCode(t) && isValidCodeShape(t)) return t; return null; }
    function extractCode() { var b = cachedBtn; if (!b || !document.contains(b)) b = findGreenGButton(); if (b) { var c1 = extractCodeFromBtn(b); if (c1) return c1; } var c2 = scanPageForCode(); if (c2) return c2; return null; }
    function findGoogleResult() {
        var ud = (S.get('domain', '') || '').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/.*$/,'').trim();
        function exH(href) { try { return new URL(href).hostname.replace(/^www\./,'').toLowerCase(); } catch (e) { return ''; } }
        function isUD(href) { if (!ud) return false; var h = exH(href); if (!h) return false; if (h === ud) return true; if (h.indexOf(ud) !== -1) return true; if (ud.indexOf(h) !== -1) return true; return getBaseDomain(h) === getBaseDomain(ud); }
        function isN(href) { if (!href) return true; if (href.indexOf('http://') !== 0 && href.indexOf('https://') !== 0) return true; if (/^https?:\/\/([^\/]+\.)?(google|gstatic|googleusercontent|youtube|wikipedia|facebook)/i.test(href)) return true; if (href.indexOf('google.com/search') !== -1) return true; return false; }
        if (ud) { try { var aL = document.querySelectorAll('#rso a[href^="http"], #search a[href^="http"], h3 a[href^="http"], a[href^="http"]'); for (var i = 0; i < aL.length; i++) { var a0 = aL[i], h0 = a0.href || ''; if (isN(h0)) continue; if (isUD(h0)) return a0; } } catch (e) {} }
        var fs = ['#rso > div a[href^="http"]','#rso a[href^="http"]','#search a[href^="http"]','h3 a[href^="http"]'];
        for (var s = 0; s < fs.length; s++) { try { var fl = document.querySelectorAll(fs[s]); for (var f = 0; f < fl.length; f++) { if (isN(fl[f].href || '')) continue; return fl[f]; } } catch (e) {} }
        return null;
    }
    function startGoogleObserver() {
        if (!IS_TOP || !isGoogle) return; if (googleObserver) return;
        try { googleObserver = new MutationObserver(function() { if (stopRequested) return; if (googleClicked) return; var st = getState(); if (st !== STATE.GOOGLE_SEARCH && st !== STATE.GOOGLE_CLICK) return; var l = findGoogleResult(); if (l) { googleClicked = true; try { l.click(); } catch (e) {} try { l.dispatchEvent(new MouseEvent('click', { bubbles: true })); } catch (e) {} S.set('targetUrl', l.href || ''); setState(STATE.GOOGLE_CLICK); if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; } } }); googleObserver.observe(document.documentElement || document.body, { childList: true, subtree: true }); } catch (e) {}
    }
    function handleGoogle() {
        if (!IS_TOP) return Promise.resolve(); if (googleClicked) return Promise.resolve();
        var st = getState(); if (st !== STATE.GOOGLE_SEARCH && st !== STATE.GOOGLE_CLICK) return Promise.resolve();
        var st2 = S.get('keyword') || S.get('domain'); if (!st2) return Promise.resolve();
        var tries = parseInt(S.get('googleClickTries', '0'), 10); tries++; S.set('googleClickTries', tries.toString());
        var l = findGoogleResult();
        if (l) { googleClicked = true; try { l.click(); } catch (e) {} try { l.dispatchEvent(new MouseEvent('click', { bubbles: true })); } catch (e) {} S.set('targetUrl', l.href || ''); setState(STATE.GOOGLE_CLICK); if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; } return Promise.resolve(); }
        if (tries >= 6) { var cd = (S.get('domain', '')||'').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/.*$/,'').trim(); if (cd && cd.indexOf('.') !== -1) { var u = 'https://' + cd; googleClicked = true; S.set('targetUrl', u); setState(STATE.SCAN_BTN); safeNavigate(u); } }
        return Promise.resolve();
    }
    function findCodeInput() {
        var sels = ['input[maxlength="8"][type="text"]','input[maxlength="8"]:not([type="hidden"])','input[placeholder*="Nhập mã xác nhận"]','input[placeholder*="nhập mã"]','input[name="code"]','input#code','input[name="ma"]','input[name="verify"]'];
        for (var i = 0; i < sels.length; i++) { var els = document.querySelectorAll(sels[i]); for (var j = 0; j < els.length; j++) { var el = els[j]; if (el.closest && el.closest('#tt-root')) continue; if (el.type && /hidden|submit|button|checkbox|radio|file|image/i.test(el.type)) continue; var r = el.getBoundingClientRect(); if (r.width < 30 || r.height < 15) continue; return el; } }
        return null;
    }
    function findConfirmBtn() {
        var all = document.querySelectorAll('button, a, div[onclick], div[role="button"], input[type="submit"], span, div, [tabindex]'), best = null, bestScore = -1;
        for (var i = 0; i < all.length; i++) { var el = all[i]; if (el.closest && el.closest('#tt-root')) continue; if (el.closest && el.closest('#tt-fab')) continue; var r = el.getBoundingClientRect(); if (r.width < 20 || r.height < 15) continue; var txt = (el.textContent || el.value || '').replace(/\s+/g, ' ').trim(); if (!txt || txt.length < 4 || txt.length > 100) continue; var sc = 0; if (/^NHẬP MÃ XÁC NHẬN$/i.test(txt)) sc += 1000; else if (/^nhập mã xác nhận$/i.test(txt)) sc += 900; else if (/^nhap ma xac nhan$/i.test(txt)) sc += 800; else if (/nhập mã xác nhận/i.test(txt)) sc += 700; else if (/xác nhận|xac nhan/i.test(txt)) sc += 300; else if (/nhập mã|nhap ma/i.test(txt)) sc += 200; else continue; if (el.tagName === 'BUTTON') sc += 50; if (sc > bestScore) { bestScore = sc; best = el; } }
        return best;
    }
    function findCodeInputCached() { var n = Date.now(); if (cachedInput && document.contains(cachedInput) && n - cachedInputTime < 1000) return cachedInput; var el = findCodeInput(); cachedInput = el; cachedInputTime = n; return el; }
    function findConfirmBtnCached() { var n = Date.now(); if (cachedConfirm && document.contains(cachedConfirm) && n - cachedConfirmTime < 1000) return cachedConfirm; var el = findConfirmBtn(); cachedConfirm = el; cachedConfirmTime = n; return el; }
    function getCodeFromPanel() { if (UI && UI.codeVal) { var t = (UI.codeVal.textContent || '').trim(); if (t && t !== '----') return t; } return ''; }
    function nativeSetValue(el, v) { try { var proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; var d = Object.getOwnPropertyDescriptor(proto, 'value'); if (d && d.set) { d.set.call(el, v); return true; } el.value = v; return true; } catch (e) { return false; } }
    function nativeGetValue(el) { try { var proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; var d = Object.getOwnPropertyDescriptor(proto, 'value'); if (d && d.get) return d.get.call(el); return el.value; } catch (e) { return ''; } }
    function fireFullSequence(el, ch) {
        try { el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ch, keyCode: (ch||'').charCodeAt(0) })); } catch (e) {}
        try { el.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: ch })); } catch (e) {}
        try { el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: ch })); } catch (e) {}
        try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
        try { el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: ch, keyCode: (ch||'').charCodeAt(0) })); } catch (e) {}
    }
    function nativeSetFill(el, code) { try { el.focus(); try { el.click(); } catch (e) {} try { el.select(); } catch (e) {} nativeSetValue(el, ''); nativeSetValue(el, code); for (var i = 0; i < code.length; i++) fireFullSequence(el, code[i]); try { el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); } catch (e) {} return nativeGetValue(el) === code; } catch (e) { return false; } }
    function tryAllFillStrategies(el, code, cb) { var ok = nativeSetFill(el, code); setTimeout(function() { cb(ok && nativeGetValue(el) === code); }, 300); }
    function startValueWatchdog(el, code) { if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; } watchdogTimer = setInterval(function() { if (stopRequested || finishCalled || submitted) { clearInterval(watchdogTimer); watchdogTimer = null; return; } if (!el || !document.contains(el)) return; var cur = nativeGetValue(el); if (cur !== code) { nativeSetValue(el, code); for (var i = 0; i < code.length; i++) fireFullSequence(el, code[i]); } }, 60); }
    function stopValueWatchdog() { if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; } }
    function unpatchInput() { patchedInput = null; }
    function clickConfirmNow() {
        var bt = findConfirmBtnCached(); if (!bt) { bt = findConfirmBtn(); if (bt) { cachedConfirm = bt; cachedConfirmTime = Date.now(); } }
        if (!bt) return false;
        try { bt.scrollIntoView({ block: 'center', behavior: 'instant' }); } catch (e) {}
        function fc(el) { if (!el) return; try { el.focus({ preventScroll: true }); } catch (e) {} try { el.click(); } catch (e) {} try { el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {} try { el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {} try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); } catch (e) {} }
        fc(bt);
        try { if (bt.parentElement && !bt.parentElement.closest('#tt-root')) fc(bt.parentElement); } catch (e) {}
        return true;
    }
    function checkSubmitResult() {
        try { var bt = ((document.body && document.body.innerText) || '').toLowerCase(); var inp = findCodeInputCached(); if (!inp) return 'success'; var sk = ['thành công','thanh cong','hoàn tất','hoan tat','đã xác nhận','success','completed','chúc mừng']; for (var j = 0; j < sk.length; j++) if (bt.indexOf(sk[j]) !== -1) return 'success'; var ek = ['mã không đúng','ma khong dung','mã sai','ma sai','mã hết hạn','invalid']; for (var i = 0; i < ek.length; i++) if (bt.indexOf(ek[i]) !== -1) return 'error'; var cv = (nativeGetValue(inp) || '').trim(); if (cv && cv === loadCode()) return 'pending'; return 'unknown'; } catch (e) { return 'unknown'; }
    }
    function stripVietnamese(s) { if (!s) return ''; return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase(); }
    function findGetLinkButton() {
        var all = document.querySelectorAll('button, a, div[role="button"], span, div');
        for (var i = 0; i < all.length; i++) { var el = all[i]; if (el.closest && el.closest('#tt-root')) continue; if (el.closest && el.closest('#tt-fab')) continue; if (el.offsetParent === null && el.tagName !== 'A') continue; var txt = (el.textContent || el.value || '').replace(/\s+/g, ' ').trim(); if (!txt || txt.length > 40) continue; var lc = stripVietnamese(txt); if (lc === 'lay link' || lc === 'laylink' || lc === 'lay link ngay' || lc === 'nhan link') { var r = el.getBoundingClientRect(); if (r.width >= 40 && r.height >= 15) return el; } }
        return null;
    }
    function clickGetLinkButton(btn) { if (!btn) return false; try { btn.click(); } catch (e) {} try { btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); } catch (e) {} return true; }
    function startWaitingForGetLink() {
        S.set('waitingGetLink', '1'); getLinkStartAt = Date.now(); getLinkClickDone = false;
        if (IS_TOP) showGuide('<b>🎀 ĐÃ NỘP MÃ 🐱</b><br>Đang chờ nút LẤY LINK...');
        if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
        function tryClick() { if (getLinkClickDone) return; var btn = findGetLinkButton(); if (!btn) return; getLinkClickDone = true; doImmediateAutoReset(); clickGetLinkButton(btn); if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; } setTimeout(function() { try { handleCloudflareChallenge(); } catch (e) {} }, 2000); }
        getLinkPollTimer = setInterval(function() { if (getLinkClickDone) { clearInterval(getLinkPollTimer); getLinkPollTimer = null; return; } if (Date.now() - getLinkStartAt > CFG.getLinkTimeoutMs) { getLinkClickDone = true; clearInterval(getLinkPollTimer); getLinkPollTimer = null; doImmediateAutoReset(); return; } tryClick(); }, 500);
    }
    function finishSuccess(reason) {
        if (finishCalled) return; finishCalled = true; submitted = true; stopValueWatchdog(); unpatchInput();
        if (IS_TOP) { try { showGifOverlay(2500); } catch (e) {} try { showToast('🎀 HOÀN THÀNH! 🐱', 3000); } catch (e) {} }
        S.set('confirmed', '1'); S.set('hardStop', '1'); S.set('inFlow', '0'); S.set('childTabOpen', '0'); fillDone = true; setState(STATE.DONE);
        fillRunning = false; submitRunning = false;
        if (gtrafficCheckTimer) { clearInterval(gtrafficCheckTimer); gtrafficCheckTimer = null; }
        if (pollChildTimer) { clearInterval(pollChildTimer); pollChildTimer = null; }
        startWaitingForGetLink();
    }
    function fillAndConfirm(force) {
        if (!IS_TOP || !isGtraffic) return false;
        if (S.get('pendingAutoReset') === '1') return false;
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
        if (!codeShown && UI) { codeShown = true; UI.code.classList.add('show'); UI.codeVal.textContent = code; showGuide('<b>🎀 ĐANG DÁN MÃ 🐱</b><br>Mã: <b>' + code + '</b>'); }
        var ws = Date.now(), wt = 30000, wp = 100;
        function waitInp() { if (stopRequested || S.get('hardStop') === '1' || finishCalled || submitted) { fillRunning = false; return; } var inp = findCodeInputCached(); if (inp) { startFill(inp); return; } if (Date.now() - ws > wt) { fillRunning = false; fillRetries++; if (fillRetries < CFG.fillRetryMax) setTimeout(function() { fillAndConfirm(force); }, CFG.fillRetryDelay); return; } setTimeout(waitInp, wp); }
        function startFill(inp) {
            startValueWatchdog(inp, code);
            tryAllFillStrategies(inp, code, function(success) {
                fillRunning = false;
                if (stopRequested || S.get('hardStop') === '1' || finishCalled || submitted) return;
                if (success) {
                    showGuide('<b>🎀 ĐÃ DÁN MÃ 🐱</b><br>Đang nộp...');
                    setTimeout(function() {
                        if (stopRequested || S.get('hardStop') === '1' || finishCalled || submitted) return;
                        submitRunning = true;
                        var c = nativeGetValue(inp); if (c !== code) { nativeSetValue(inp, code); for (var i = 0; i < code.length; i++) fireFullSequence(inp, code[i]); }
                        var ca = 0, mc = 8, ci = 250;
                        function tryClick() { if (finishCalled || submitted || S.get('hardStop') === '1') return; ca++; cachedConfirm = null; cachedConfirmTime = 0; clickConfirmNow(); if (ca < mc) setTimeout(tryClick, ci); }
                        tryClick();
                        var cc = 0, mch = CFG.postSubmitCheckMax;
                        function cLoop() {
                            if (finishCalled || S.get('hardStop') === '1' || submitted) { submitRunning = false; return; }
                            cc++; var res = checkSubmitResult();
                            if (res === 'success') { submitRunning = false; finishSuccess('success'); return; }
                            if (res === 'error') { S.set('confirmed', '0'); fillDone = false; submitRunning = false; stopValueWatchdog(); var i2 = findCodeInputCached(); if (i2) nativeSetValue(i2, ''); setTimeout(function() { fillAndConfirm(true); }, 500); return; }
                            if (cc < mch) setTimeout(cLoop, CFG.postSubmitCheckMs); else { submitRunning = false; finishSuccess('timeout'); }
                        }
                        setTimeout(cLoop, 150);
                    }, 30);
                } else { stopValueWatchdog(); fillRetries++; if (fillRetries < CFG.fillRetryMax) setTimeout(function() { fillAndConfirm(true); }, 400); }
            });
        }
        waitInp();
        return true;
    }
    function goBackToGtraffic() {
        if (S.get('backDone') === '1') return;
        var c = getCodeFromPanel(); if (!c) c = loadCode();
        if (c && isValidCodeShape(c) && !isBlacklistedCode(c)) { try { S.set('code', c); S.set('codeBackup', c); S.set('codeHardLock', c); } catch (e) {} }
        try { S.set('state', STATE.BACK_GTRAFFIC); S.set('inFlow', '1'); } catch (e) {}
        S.set('backDone', '1'); S.set('navigatingBack', '1');
    }
    function handleTarget() {
        if (isGtraffic || isGoogle || isDichvuTask || isRobuxReward) return Promise.resolve();
        if (S.get('pendingAutoReset') === '1') return Promise.resolve();
        var st = getState();
        if ((st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) && isRealTargetPage()) { setState(STATE.SCAN_BTN); return Promise.resolve(); }
        if (st === STATE.SCAN_BTN) {
            var sa = parseInt(S.get('stateSetAt', '0'), 10); var sc = Date.now() - sa;
            if (sc < CFG.gBtnDelayMs) { var rd = Math.ceil((CFG.gBtnDelayMs - sc) / 1000); if (IS_TOP) { try { showTimer(rd, Math.ceil(CFG.gBtnDelayMs/1000), '🎀 CHỜ NÚT g: ' + rd + 's'); } catch (e) {} if (UI && UI.status) UI.status.textContent = '🐱 Đợi nút g: ' + rd + 's 🎀'; } if (!cachedBtn) { var pb = findGreenGButton(); if (pb) { cachedBtn = pb; cachedBtnTime = Date.now(); } } return Promise.resolve(); }
            var b = findGreenGButton();
            if (b) { var lc = parseInt(S.get('lastClickTime','0'), 10); if (Date.now() - lc > 120) { S.set('lastClickTime', Date.now().toString()); S.set('btnClickAt', Date.now().toString()); clickBtn(b); setState(STATE.WAIT_COUNTDOWN); } }
            else { if (sc > CFG.scanBtnMaxMs) { var dc = extractCode(); if (dc) { saveCode(dc); if (IS_TOP) showCode(dc); setState(STATE.BACK_GTRAFFIC); setTimeout(function() { goBackToGtraffic(); }, 200); } } else { if (IS_TOP && UI) UI.status.textContent = '🐱 Đợi nút g... 🎀'; } }
            return Promise.resolve();
        }
        if (st === STATE.WAIT_COUNTDOWN) {
            var cd = readCountdown();
            if (cd) { var t = parseInt(S.get('serverTotalSec','0'), 10); if (cd.sec > t) { t = cd.sec; S.set('serverTotalSec', t.toString()); } if (t === 0) t = cd.sec || CFG.defaultCountdown; if (IS_TOP) showTimer(cd.sec, t, 'B5: CHỜ ' + cd.sec + 's'); if (cd.sec === 0) { setState(STATE.GET_CODE); return Promise.resolve(); } return Promise.resolve(); }
            var cA = parseInt(S.get('btnClickAt', '0'), 10);
            if (cA > 0 && IS_TOP) { var e = Math.floor((Date.now() - cA) / 1000); var r = Math.max(0, CFG.defaultCountdown - e); showTimer(r, CFG.defaultCountdown, 'B5: CHỜ ' + r + 's'); if (r === 0) { setState(STATE.GET_CODE); return Promise.resolve(); } }
            return Promise.resolve();
        }
        if (st === STATE.GET_CODE) {
            var a = parseInt(S.get('codeAttempts', '0'), 10); a++; S.set('codeAttempts', a.toString());
            var code = extractCode();
            if (code) { saveCode(code); if (IS_TOP) showCode(code); setState(STATE.BACK_GTRAFFIC); setTimeout(function() { goBackToGtraffic(); setTimeout(function() { try { window.close(); } catch (e) {} }, 100); }, 200); }
            return Promise.resolve();
        }
        if (st === STATE.BACK_GTRAFFIC) { if (S.get('navigatingBack') === '1') return Promise.resolve(); goBackToGtraffic(); return Promise.resolve(); }
        return Promise.resolve();
    }
    function loop() {
        if (loopRunning) return; if (stopRequested) return; if (S.get('pendingAutoReset') === '1') return;
        loopRunning = true; var i = 0;
        var tick = function() {
            if (stopRequested) { loopRunning = false; return; }
            if (S.get('pendingAutoReset') === '1') { loopRunning = false; return; }
            if (S.get('waitingGetLink') === '1') { loopTimer = setTimeout(tick, 2); return; }
            if (S.get('hardStop') === '1') { loopRunning = false; return; }
            if (finishCalled) { loopRunning = false; return; }
            if (isDichvuTask && DICHVU_LOCK.isLocked()) { loopRunning = false; return; }
            i++; if (i >= 999999) { loopRunning = false; return; }
            if (!shouldToolRunOnThisPage()) { resetAllState(); loopRunning = false; return; }
            try { watchdog(); } catch (e) {}
            var p; var nd = CFG.poll;
            if (isDichvuTask) { p = handleDichvuTask(); nd = CFG.dichvuTaskPoll; }
            else if (isRobuxReward && IS_TOP && location.pathname.indexOf('/claim') === 0) { p = handleRobuxClaim(); nd = 1000; }
            else if (isRobuxReward && IS_TOP) { p = handleRobuxTask(); nd = CFG.robuxPollMs; }
            else if (isGoogle && IS_TOP) { p = handleGoogle(); nd = CFG.googlePoll; }
            else if (isGtraffic && IS_TOP) { p = handleGtraffic(); nd = CFG.poll; }
            else { p = handleTarget(); nd = CFG.targetPoll; }
            p.catch(function(e){ log('Loi: ' + e.message); }).then(function() {
                if (getState() === STATE.DONE && IS_TOP && S.get('waitingGetLink') !== '1') { loopRunning = false; return; }
                if (S.get('hardStop') === '1' && S.get('waitingGetLink') !== '1') { loopRunning = false; return; }
                if (isDichvuTask && DICHVU_LOCK.isLocked()) { loopRunning = false; return; }
                loopTimer = setTimeout(tick, nd);
            });
        };
        tick();
    }
    function handleGtraffic() {
        if (!IS_TOP || !isGtraffic) return Promise.resolve();
        if (S.get('pendingAutoReset') === '1') return Promise.resolve();
        if (S.get('waitingGetLink') === '1') return Promise.resolve();
        if (S.get('getLinkClicked') !== '1') { var b = findGetLinkButton(); if (b) { doImmediateAutoReset(); clickGetLinkButton(b); } }
        return Promise.resolve();
    }
    function startGtrafficObserver() {
        if (!IS_TOP || !isGtraffic) return; if (gtrafficCheckTimer) return;
        gtrafficCheckTimer = setInterval(function() {
            if (S.get('pendingAutoReset') === '1' || S.get('waitingGetLink') === '1' || S.get('hardStop') === '1' || finishCalled || submitted || stopRequested || S.get('confirmed') === '1' || getState() === STATE.DONE) { clearInterval(gtrafficCheckTimer); gtrafficCheckTimer = null; return; }
            var code = getCodeFromPanel() || loadCode(); if (!code || !isValidCodeShape(code) || isBlacklistedCode(code)) return;
            var inp = findCodeInputCached(); if (!inp) return;
            var cv = (nativeGetValue(inp) || '').trim();
            if (cv === '' && !fillRunning && !submitRunning) { fillDone = false; fillRunning = false; fillAndConfirm(true); }
        }, 250);
    }
    function boot() {
        if (!shouldToolRunOnThisPage()) { var o = document.getElementById('tt-root'); if (o) o.remove(); var f = document.getElementById('tt-fab'); if (f) f.remove(); return; }
        if (isCloudflareChallengePage()) { setTimeout(function() { try { handleCloudflareChallenge(); } catch (e) {} }, 500); return; }
        var hpr = (S.get('pendingAutoReset') === '1');
        if (hpr) {
            try { var sd = S.get('savedDomains', '[]'); var cr = S.get('code', ''); var km = S.get('keywordMap', '[]'); S.resetFull(); try { S.set('savedDomains', sd); } catch (e) {} try { S.set('keywordMap', km); } catch (e) {} if (cr && isValidCodeShape(cr) && !isBlacklistedCode(cr)) { try { S.set('code', cr); } catch (e) {} } try { S.del('codeHardLock'); } catch (e) {} try { S.set('state', STATE.IDLE); } catch (e) {} try { S.set('inFlow', '0'); } catch (e) {} } catch (e) {}
        }
        var la = parseInt(S.get('leavingAt', '0'), 10);
        if (la > 0) { var e = Date.now() - la; if (e > 300000 && S.get('inFlow') !== '1' && !loadCode()) resetAllState(true); S.del('leavingAt'); }
        if (IS_TOP) buildPanel();
        if (hpr) {
            try { S.set('state', STATE.IDLE); } catch (e) {} try { S.set('inFlow', '0'); } catch (e) {} try { S.del('pendingAutoReset'); } catch (e) {}
            if (IS_TOP && UI) { if (UI.domainInput) UI.domainInput.value = ''; if (UI.keywordInput) UI.keywordInput.value = ''; if (UI.status) UI.status.textContent = '🎀 Sẵn sàng 🐱'; if (UI.code) UI.code.classList.remove('show'); if (UI.codeVal) UI.codeVal.textContent = '----'; }
            if (IS_TOP) startLeaveDetector();
            return;
        }
        var st = getState(); var code = S.get('code', '');
        if (isDichvuTask) {
            var dv = S.get('dichvuStage', '');
            if (dv === 'clicked_create') { DICHVU_LOCK.lockCreate(); dichvuCreateClicked = true; dichvuLastCreateAt = parseInt(S.get('dichvuClickAt', '0'), 10) || Date.now(); }
            var cu = location.href; if (DICHVU_URLS.has(cu)) { DICHVU_LOCK.lockCreate(); dichvuCreateClicked = true; dichvuLastCreateAt = parseInt(S.get('dichvuClickAt', '0'), 10) || Date.now(); }
            if (st !== STATE.DICHVU_TASK) setState(STATE.DICHVU_TASK);
            if (IS_TOP && UI) UI.status.textContent = dichvuCreateClicked ? '🎀 Đã tạo NV — chờ link 🐱' : '🎀 Auto nhận NV... 🐱';
            var curPath = location.pathname;
            if (curPath.indexOf(CFG.dichvuTaskPath) !== 0 && curPath.indexOf('/client/vuot-link') === -1) {
                log('DICHVU BOOT: dang o ' + curPath + ' → se chuyen ' + CFG.dichvuTaskPath);
                if (IS_TOP && UI) UI.status.textContent = '🎀 Đang vào trang nhận NV dichvutask... 🐱';
                setTimeout(function() { try { location.href = CFG.dichvuTaskPath; } catch (e) {} }, 1500);
                return;
            }
            startLeaveDetector(); loop(); return;
        }
        if (isRobuxReward && IS_TOP) {
            var cp = location.pathname;
            log('ROBUX: ★ BAT DAU ★ path=' + cp);
            if (cp.indexOf('/claim') === 0) {
                log('ROBUX: dang o /claim — bat dau theo doi claim');
                if (UI) UI.status.textContent = '🎀 Đang claim coin... 🐱';
                robuxClaimStartAt = Date.now(); robuxClaimDone = false;
                startLeaveDetector();
                setTimeout(function() { loop(); }, 500);
                return;
            }
            if (UI) UI.status.textContent = '🎀 Auto Gtraffic 400 Coin... 🐱';
            if (cp !== '/earn' && cp.indexOf('/earn') !== 0) {
                log('ROBUX: dang o ' + cp + ' → chuyen /earn');
                if (UI) UI.status.textContent = '🎀 Đang chuyển sang Kiếm Coin... 🐱';
                setTimeout(function() { try { location.href = '/earn'; } catch (e) {} }, 1500);
                return;
            }
            if (S.get('robuxWaitingGtraffic') === '1') { log('ROBUX: van dang cho gtraffic'); if (UI) UI.status.textContent = '🐱 Đang chờ tab gtraffic... 🎀'; }
            startLeaveDetector();
            setTimeout(function() { loop(); }, 2000);
            var lastPath = location.pathname;
            setInterval(function() {
                var cur = location.pathname;
                if (cur !== lastPath) {
                    log('ROBUX: SPA route change: ' + lastPath + ' → ' + cur);
                    lastPath = cur;
                    if ((cur === '/earn' || cur.indexOf('/earn') === 0) && !loopRunning) { setTimeout(function() { loop(); }, 1500); }
                }
            }, 1000);
            window.addEventListener('focus', function() {
                if (S.get('robuxWaitingGtraffic') === '1') {
                    setTimeout(function() {
                        if (robuxGtrafficTabRef && robuxGtrafficTabRef.closed) {
                            S.set('robuxWaitingGtraffic', '0'); robuxTaskRunning = false; robuxLastClickAt = 0; robuxModalOpenedAt = 0;
                            try { var curUrl = location.href.split('?')[0].split('#')[0]; sessionStorage.removeItem('__tt_open_blocked_' + curUrl); } catch (e) {}
                            log('ROBUX: reset waiting flag → se click NV moi');
                        }
                    }, 1000);
                }
            });
            return;
        }
        if (isRealTargetPage() && (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK)) setState(STATE.SCAN_BTN);
        if (isGtraffic) {
            try {
                var cgu = location.href.split('?')[0].split('#')[0];
                var lgu = S.get('lastGtrafficUrl', '');
                if (lgu && lgu !== cgu) {
                    log('★ GTRAFFIC URL DOI MOI');
                    try { S.set('state', STATE.IDLE); } catch (e) {}
                    try { S.set('inFlow', '0'); } catch (e) {}
                    try { S.set('childTabOpen', '0'); } catch (e) {}
                    try { S.del('waitingGetLink'); } catch (e) {}
                    try { S.del('hardStop'); } catch (e) {}
                    try { S.del('confirmed'); } catch (e) {}
                    try { S.del('pendingAutoReset'); } catch (e) {}
                    try { S.del('code'); } catch (e) {}
                    try { S.del('codeHardLock'); } catch (e) {}
                    try { S.del('targetUrl'); } catch (e) {}
                    try { S.del('domain'); } catch (e) {}
                    try { S.del('keyword'); } catch (e) {}
                    try { S.del('gtrafficUrl'); } catch (e) {}
                    stopRequested = false; loopRunning = false; fillRunning = false; submitRunning = false;
                    finishCalled = false; fillDone = false; submitted = false; fillRetries = 0; codeShown = false;
                    getLinkClickDone = false; getLinkStartAt = 0; googleClicked = false; wasOnValidPage = true;
                    cachedInput = null; cachedInputTime = 0; cachedConfirm = null; cachedConfirmTime = 0; cachedBtn = null; cachedBtnTime = 0;
                    if (gtrafficCheckTimer) { try { clearInterval(gtrafficCheckTimer); } catch (e) {} gtrafficCheckTimer = null; }
                    if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
                    if (googleObserver) { try { googleObserver.disconnect(); } catch (e) {} googleObserver = null; }
                    if (getLinkPollTimer) { try { clearInterval(getLinkPollTimer); } catch (e) {} getLinkPollTimer = null; }
                    if (watchdogTimer) { try { clearInterval(watchdogTimer); } catch (e) {} watchdogTimer = null; }
                    if (pollChildTimer) { try { clearInterval(pollChildTimer); } catch (e) {} pollChildTimer = null; }
                    if (UI && UI.root) UI.root.remove();
                    if (IS_TOP) buildPanel();
                    if (UI && UI.status) UI.status.textContent = '🎀 Trang mới — đang OCR... 🐱';
                }
                try { S.set('lastGtrafficUrl', cgu); } catch (e) {}
            } catch (e) {}
            setTimeout(function() { try { autoFillAndStart(); } catch (e) {} }, CFG.autoFillDelayMs);
            if (st === STATE.BACK_GTRAFFIC) { S.del('navigatingBack'); S.set('backDone', '1'); }
            var cip = getCodeFromPanel(); var cfs = loadCode(); var ipr = (S.get('pendingAutoReset') === '1');
            var hc = !!(cip || cfs); var wl = (S.get('waitingGetLink') === '1'); var iff = (S.get('inFlow') === '1'); var co = (S.get('childTabOpen') === '1');
            if (wl && !hc) { if (IS_TOP) refreshStatus(); startWaitingForGetLink(); startLeaveDetector(); return; }
            if (co && !hc) { if (IS_TOP) UI.status.textContent = '🎀 Chờ mã từ tab con... 🐱'; startChildPoller(); startLeaveDetector(); return; }
            if (hc || iff) {
                if (hc) { try { S.del('confirmed'); } catch (e) {} try { S.del('hardStop'); } catch (e) {} try { S.del('waitingGetLink'); } catch (e) {} fillDone = false; fillRunning = false; submitRunning = false; finishCalled = false; submitted = false; fillRetries = 0; codeShown = false; stopValueWatchdog(); unpatchInput(); }
                setState(STATE.FILL_CODE);
                if (IS_TOP && !codeShown) { var sw = cip || cfs; if (sw && isValidCodeShape(sw) && !isBlacklistedCode(sw)) { codeShown = true; UI.code.classList.add('show'); UI.codeVal.textContent = sw; saveCode(sw); } }
                if (IS_TOP) refreshStatus(); startLeaveDetector(); fillAndConfirm(true); startGtrafficObserver(); loop(); return;
            }
            if (st !== STATE.IDLE) setState(STATE.IDLE);
            if (IS_TOP) refreshStatus(); startLeaveDetector(); return;
        }
        if (isGoogle) {
            if (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) { startGoogleObserver(); if (IS_TOP) refreshStatus(); startLeaveDetector(); loop(); return; }
            if (IS_TOP) refreshStatus(); startLeaveDetector(); return;
        }
        if (isRealTargetPage()) {
            if (st === STATE.SCAN_BTN || st === STATE.WAIT_COUNTDOWN || st === STATE.GET_CODE || st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) { if (st === STATE.GOOGLE_SEARCH || st === STATE.GOOGLE_CLICK) setState(STATE.SCAN_BTN); if (IS_TOP) refreshStatus(); startLeaveDetector(); loop(); return; }
            if (IS_TOP) refreshStatus(); startLeaveDetector(); return;
        }
        if (IS_TOP) refreshStatus();
        if (IS_TOP && code && !codeShown) { codeShown = true; UI.code.classList.add('show'); UI.codeVal.textContent = code; }
        if (st === STATE.DONE && S.get('waitingGetLink') !== '1') { stopAll(); startLeaveDetector(); return; }
        if (st && st !== STATE.IDLE) loop();
        startLeaveDetector();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
