// ==UserScript==
// @name         THANH TUAN AUTO GTRAFFIC.IO v49.3.1 - KITTY ULTIMATE [OBF-P1]
// @namespace    thanhtuan.gtraffic
// @version      49.3.1-obf-p1
// @description  Auto gtraffic + click g chuẩn MINH PHƯƠNG + chờ 2s + Blacklist v2
// @author       THANH TUẤN
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function(){
'use strict';

var _0xA1=['\x67\x74\x72\x61\x66\x66\x69\x63\x2e\x69\x6f','\x67\x6f\x6f\x67\x6c\x65','\x64\x69\x63\x68\x76\x75\x74\x61\x73\x6b','\x72\x6f\x62\x75\x78\x72\x65\x77\x61\x72\x64','\x74\x74\x5f','\x73\x74\x61\x74\x65','\x63\x6f\x64\x65','\x63\x6f\x64\x65\x42\x61\x63\x6b\x75\x70','\x63\x6f\x64\x65\x48\x61\x72\x64\x4c\x6f\x63\x6b','\x64\x6f\x6d\x61\x69\x6e','\x6b\x65\x79\x77\x6f\x72\x64','\x67\x74\x72\x61\x66\x66\x69\x63\x55\x72\x6c','\x69\x6e\x46\x6c\x6f\x77','\x74\x61\x72\x67\x65\x74\x55\x72\x6c','\x63\x6f\x6e\x66\x69\x72\x6d\x65\x64','\x63\x68\x69\x6c\x64\x54\x61\x62\x4f\x70\x65\x6e','\x70\x65\x6e\x64\x69\x6e\x67\x41\x75\x74\x6f\x52\x65\x73\x65\x74','\x77\x61\x69\x74\x69\x6e\x67\x47\x65\x74\x4c\x69\x6e\x6b','\x68\x61\x72\x64\x53\x74\x6f\x70','\x62\x61\x63\x6b\x44\x6f\x6e\x65','\x6e\x61\x76\x69\x67\x61\x74\x69\x6e\x67\x42\x61\x63\x6b','\x6c\x65\x61\x76\x69\x6e\x67\x41\x74','\x64\x69\x63\x68\x76\x75\x53\x74\x61\x67\x65','\x64\x69\x63\x68\x76\x75\x43\x6c\x69\x63\x6b\x41\x74','\x64\x69\x63\x68\x76\x75\x43\x72\x65\x61\x74\x65\x64\x55\x72\x6c\x73','\x6b\x65\x79\x77\x6f\x72\x64\x4d\x61\x70','\x73\x61\x76\x65\x64\x44\x6f\x6d\x61\x69\x6e\x73','\x63\x75\x73\x74\x6f\x6d\x42\x6c\x61\x63\x6b\x6c\x69\x73\x74','\x66\x61\x6b\x65\x46\x69\x6e\x67\x65\x72\x70\x72\x69\x6e\x74','\x6c\x61\x73\x74\x47\x74\x72\x61\x66\x66\x69\x63\x55\x72\x6c','\x72\x6f\x62\x75\x78\x57\x61\x69\x74\x69\x6e\x67\x47\x74\x72\x61\x66\x66\x69\x63','\x70\x6f\x73'];

var HOST=location.hostname;
var IS_TOP=(window===window.top);
var isGtraffic=new RegExp('(^|\\.)'+_0xA1[0]+'$','i').test(HOST);
var isGoogle=new RegExp('(^|\\.)'+_0xA1[1]+'\\.','i').test(HOST);
var isDichvuTask=new RegExp('(^|\\.)'+_0xA1[2]+'\\.xyz$','i').test(HOST);
var isRobuxReward=new RegExp('(^|\\.)'+_0xA1[3]+'\\.top$','i').test(HOST);

var CFG={
poll:8,googlePoll:0,targetPoll:6,gk:_0xA1[4],
watchdogMs:3000,defaultCountdown:60,codeTimeoutMs:45000,
navCooldownMs:800,fillRetryMax:999,fillRetryDelay:300,
backDelay:200,leaveCheckMs:200,fillLoopMax:999,fillLoopDelay:100,
fillHoldVerifyMs:550,fillVerifyIntervalMs:40,maxEmptyBeforeNop:5,
nativePasteDelayMin:8,nativePasteDelayMax:25,
postSubmitCheckMs:320,postSubmitCheckMax:12,
minCodeScore:130,maxCodeScanDistance:99999,
getLinkPollMs:0,getLinkTimeoutMs:15000,minWaitBeforeSearchMs:0,
codeBackupTTL:600000,dichvuTaskPoll:1000,dichvuClickCooldownMs:7000,
dichvuCreatedUrlsTTL:86400000,dichvuOutsideCooldownMs:4000,
autoFillDelayMs:800,ocrDelayMs:500,ocrTimeoutMs:25000,
waitCountdownMaxMs:90000,scanBtnMaxMs:12000,apiRetryInterval:5000,
gBtnDelayMs:2000,goBackDelayMs:200,
robuxPollMs:1500,robuxCooldownMs:15000,robuxModalDelayMs:15000,
dichvuTaskPath:'/client/vuot-link'
};

var STATE={
IDLE:'idle',GOOGLE_SEARCH:'google-search',GOOGLE_CLICK:'google-click',
SCAN_BTN:'scan-btn',WAIT_COUNTDOWN:'wait-countdown',GET_CODE:'get-code',
BACK_GTRAFFIC:'back-gtraffic',FILL_CODE:'fill-code',DONE:'done',
DICHVU_TASK:'dichvu-task',ROBUX_TASK:'robux-task',ROBUX_CLAIM:'robux-claim'
};

var GIF_CLOSE='https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyeHc0eGdsb29pMG96Nzc3d2o2bG1kY2FnMzVtbnZ5eWp3bXNpODN4cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kZqbBT64ECtjy/giphy.gif';
var GIF_BOW='https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif';
var GIF_KITTY_DANCE='https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif';

var BLACKLIST={
ui:['login','logout','signup','signin','register','account','password','email','verify','submit','confirm','accept','cancel','button','click','here','welcome','hello','world','news','blog','shop','store','cart','order','payment','banking','wallet','deposit','withdraw','bonus','promotion','voucher','coupon','gift','reward','prize','winner','game','casino','sports','betting','jackpot','lottery','online','offline','mobile','desktop','tablet','laptop','computer','android','windows','linux','chrome','firefox','safari','messenger','telegram','whatsapp','zalo','viber','skype','buoc','step','next','prev','back','forward','home','search','find','filter','sort','view','show','hide','open','close','start','stop','pause','resume','play','replay','load','reload','refresh','true','false','null','undefined','none','empty','full','free','paid','public','private','secure','locked','unlocked','hidden','visible','code','ma','mã','nhap','nhập','lay','lấy','xacnhan','nhan','nhận','error','success','loading','pleasewait','comingsoon','notfound','page404','trang404','error404','livestream','youtube','facebook','google','website','hotline','support','contact','about','policy','privacy','terms','service','download','upload','install','update','faq'],
brands:['fun88','sunwin','hitclub','go88','b52club','rikvip','789club','w88','w88diler','w88link1','xoso66','xoso','xs66','m88','mu88','mu99','fb88','bk8','jun88','188bet','tf88','ok9','kubet','kubet88','s666','s666vn','fabet','f8bet','hi88','new88','789bet','789win','88vin','vin88','vip88','v9bet','vndbet','vn88','vn138','sin88','shbet','five88','jbo','dafabet','cmd368','12bet','1xbet','bet365','188betvn','ae888','ae3888','bong88','cado68','casino888','cf68','dabet','daga88','dk8','fun88vn','ga888','hb88','hl8','ibet888','jun88vn','k8','kubetvn','kucasino','letou','lixi88','loto188','m88vn','mig8','mksports','new88vn','nha88','one88','onebox63','sodo66','sodo68','sodo88','sunwinvn','sunwinclub','tf88vn','tk88','vn88vn','v9betvn','w88vn','w88asia','win2888','winbet','win88','xo88','xoso88','xsmb','xsmn','xsmt','xs3mien','tylekeo','tylekeo88','123b','ceobet88'],
patterns:[/^trang\s*\d+$/i,/^page\s*\d+$/i,/^error\s*\d+$/i,/^step\s*\d+$/i,/^buoc\s*\d+$/i,/^test\s*\d*$/i,/^demo\s*\d*$/i,/^sample\s*\d*$/i,/^example\s*\d*$/i,/^temp\s*\d*$/i,/^xxx+$/i,/^0{3,}$/,/^1{3,}$/,/^9{3,}$/,/^(.)\1{3,}$/,/^01234567$/,/^12345678$/,/^abcdefgh$/i,/^ABCDEFGH$/,/^87654321$/],
check:function(s){
if(!s||typeof s!=='string')return true;
var t=s.trim();if(!t)return true;
var lc=t.toLowerCase();var i;
for(i=0;i<BLACKLIST.ui.length;i++)if(lc===BLACKLIST.ui[i])return true;
for(i=0;i<BLACKLIST.brands.length;i++)if(lc.indexOf(BLACKLIST.brands[i])!==-1)return true;
for(i=0;i<BLACKLIST.patterns.length;i++)if(BLACKLIST.patterns[i].test(t))return true;
if(/^[a-z]{8}$/i.test(t))return true;
return false;
},
addCustom:function(w){
if(!w||typeof w!=='string')return false;
var lc=w.trim().toLowerCase();if(!lc)return false;
if(BLACKLIST.brands.indexOf(lc)!==-1)return false;
BLACKLIST.brands.push(lc);
try{
var c=S.get('customBlacklist','[]');
var arr=(typeof c==='string')?JSON.parse(c):(c||[]);
if(arr.indexOf(lc)===-1)arr.push(lc);
S.set('customBlacklist',JSON.stringify(arr));
}catch(e){}
return true;
},
loadCustom:function(){
try{
var r=S.get('customBlacklist','[]');
var arr=(typeof r==='string')?JSON.parse(r):(r||[]);
for(var i=0;i<arr.length;i++)if(BLACKLIST.brands.indexOf(arr[i])===-1)BLACKLIST.brands.push(arr[i]);
}catch(e){}
}
};
function isBlacklistedCode(s){return BLACKLIST.check(s);}

var __origWindowOpen=window.open;
var __openBlockKey='__tt_open_blocked_'+location.href.split('?')[0].split('#')[0];
var __openCount=0;
try{if(sessionStorage.getItem(__openBlockKey)==='1')__openCount=999;}catch(e){}
window.open=function(url,name,features){
try{
if(sessionStorage.getItem(__openBlockKey)==='1'){console.log('[TT] OPEN BLOCKED');return null;}
__openCount++;
if(__openCount>1){console.log('[TT] OPEN BLOCKED count='+__openCount);return null;}
sessionStorage.setItem(__openBlockKey,'1');
console.log('[TT] OPEN ALLOWED: '+url);
return __origWindowOpen.apply(window,arguments);
}catch(e){return __origWindowOpen.apply(window,arguments);}
};
function dichvuArmOpenGuard(){}

var S={
get:function(k,d){try{var v=GM_getValue(CFG.gk+k,d);return v===undefined?d:v;}catch(e){return d;}},
set:function(k,v){try{GM_setValue(CFG.gk+k,v);}catch(e){}},
del:function(k){try{GM_deleteValue(CFG.gk+k);}catch(e){}},
reset:function(){
var keys=['state','stateSetAt','targetUrl','lastServerSec','lastClickTime','serverTotalSec','filled','confirmed','googleClickTries','navigatingBack','cdStartSec','cdStartAt','btnClickAt','gotCodeAt','codeAttempts','lastNavUrl','lastNavAt','backDone','leavingAt','lastCopyOk','lastCopyText','hardStop','countdownRealZero','getLinkClicked','waitingGetLink','getLinkDeadline','getLinkStartAt','childTabOpen','codeReadySignal','dichvuStage','dichvuClickAt','dichvuCreateCount','dichvuDoneAt','goBackFired'];
for(var i=0;i<keys.length;i++)S.del(keys[i]);
},
resetFull:function(){
S.reset();
try{S.del('code');}catch(e){}
try{S.del('codeBackup');}catch(e){}
try{S.del('codeHardLock');}catch(e){}
try{S.del('codeFoundAt');}catch(e){}
try{S.del('inFlow');}catch(e){}
try{S.del('domain');}catch(e){}
try{S.del('keyword');}catch(e){}
try{S.del('gtrafficUrl');}catch(e){}
try{S.del('pendingAutoReset');}catch(e){}
}
};

BLACKLIST.loadCustom();

var DICHVU_LOCK={
keyBase:function(){
try{var u=new URL(location.href);return 'tt_dv_lock_'+u.origin+u.pathname.replace(/\/$/,'');}
catch(e){return 'tt_dv_lock_'+location.href.split('?')[0].split('#')[0];}
},
isLocked:function(){try{return sessionStorage.getItem(DICHVU_LOCK.keyBase())==='1';}catch(e){return false;}},
lock:function(){try{sessionStorage.setItem(DICHVU_LOCK.keyBase(),'1');}catch(e){}},
unlock:function(){try{sessionStorage.removeItem(DICHVU_LOCK.keyBase());}catch(e){}},
isCreateLocked:function(){try{return sessionStorage.getItem(DICHVU_LOCK.keyBase()+'_create')==='1';}catch(e){return false;}},
lockCreate:function(){try{sessionStorage.setItem(DICHVU_LOCK.keyBase()+'_create','1');}catch(e){}},
unlockCreate:function(){try{sessionStorage.removeItem(DICHVU_LOCK.keyBase()+'_create');}catch(e){}},
unlockAll:function(){
try{
DICHVU_LOCK.unlock();DICHVU_LOCK.unlockCreate();
var toDel=[];
for(var i=0;i<sessionStorage.length;i++){var k=sessionStorage.key(i);if(k&&k.indexOf('tt_dv_lock_')===0)toDel.push(k);}
for(var j=0;j<toDel.length;j++){try{sessionStorage.removeItem(toDel[j]);}catch(e){}}
}catch(e){}
}
};

var DICHVU_URLS={
getList:function(){
try{
var r=S.get('dichvuCreatedUrls','[]');
var list=(typeof r==='string')?JSON.parse(r):(r||[]);
var now=Date.now();var ttl=CFG.dichvuCreatedUrlsTTL;var fresh=[];
for(var i=0;i<list.length;i++)if(list[i].t&&(now-list[i].t)<ttl)fresh.push(list[i]);
return fresh;
}catch(e){return [];}
},
has:function(url){
if(!url)return false;
var list=DICHVU_URLS.getList();var n=DICHVU_URLS.normalize(url);
for(var i=0;i<list.length;i++)if(list[i].u===n)return true;
return false;
},
add:function(url){
if(!url)return;
var list=DICHVU_URLS.getList();var n=DICHVU_URLS.normalize(url);
for(var i=0;i<list.length;i++)if(list[i].u===n)return;
list.unshift({u:n,t:Date.now()});
if(list.length>100)list.length=100;
try{S.set('dichvuCreatedUrls',JSON.stringify(list));}catch(e){}
},
normalize:function(url){
try{var u=new URL(url);return u.origin+u.pathname.replace(/\/$/,'');}
catch(e){return (url||'').split('?')[0].split('#')[0].replace(/\/$/,'');}
},
count:function(){return DICHVU_URLS.getList().length;}
};

function normalizeKeyword(k){
if(!k)return '';
var s=(k+'').toLowerCase();
try{s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(e){}
s=s.replace(/đ/g,'d');
s=s.replace(/[\s_\-\.\,\:\;\/\\]+/g,'').trim();
return s;
}

var KEYWORD_MAP={
getList:function(){
try{
var r=S.get('keywordMap','[]');
var l=(typeof r==='string')?JSON.parse(r):(r||[]);
return Array.isArray(l)?l:[];
}catch(e){return [];}
},
save:function(k,d){
if(!k||!d)return false;
var raw=(k+'').trim();var n=normalizeKeyword(raw);
d=d.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
if(!n||!d)return false;
var list=KEYWORD_MAP.getList();var i;
for(i=0;i<list.length;i++){
if(normalizeKeyword(list[i].k)===n){
list[i].k=raw;list[i].d=d;list[i].t=Date.now();
S.set('keywordMap',JSON.stringify(list));return true;
}
}
list.unshift({k:raw,d:d,t:Date.now()});
if(list.length>200)list.length=200;
S.set('keywordMap',JSON.stringify(list));return true;
},
lookup:function(k){
if(!k)return null;
var n=normalizeKeyword(k);if(!n)return null;
var list=KEYWORD_MAP.getList();var i;
for(i=0;i<list.length;i++)if(normalizeKeyword(list[i].k)===n)return list[i].d;
for(i=0;i<list.length;i++){
var lk=normalizeKeyword(list[i].k);
if(lk&&(n.indexOf(lk)!==-1||lk.indexOf(n)!==-1))return list[i].d;
}
return null;
},
remove:function(k){
var list=KEYWORD_MAP.getList();var out=[];var n=normalizeKeyword(k);
for(var i=0;i<list.length;i++)if(normalizeKeyword(list[i].k)!==n)out.push(list[i]);
S.set('keywordMap',JSON.stringify(out));
},
count:function(){return KEYWORD_MAP.getList().length;}
};

var __tesseractLoading=null;
var __tesseractWorker=null;
function loadTesseract(){
if(__tesseractWorker)return Promise.resolve(__tesseractWorker);
if(__tesseractLoading)return __tesseractLoading;
__tesseractLoading=new Promise(function(resolve,reject){
var timeout=setTimeout(function(){reject(new Error('Load Tesseract timeout'));},CFG.ocrTimeoutMs);
var script=document.createElement('script');
script.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js';
script.onload=function(){
clearTimeout(timeout);
if(typeof Tesseract==='undefined'){reject(new Error('Tesseract not defined'));return;}
try{
Tesseract.createWorker(['vie','eng'],1,{
logger:function(m){if(m.status==='recognizing text')log('OCR: '+Math.round(m.progress*100)+'%');},
errorHandler:function(err){log('OCR err: '+err);}
}).then(function(worker){
__tesseractWorker=worker;
log('Tesseract ready');
resolve(worker);
}).catch(function(err){reject(err);});
}catch(e){reject(e);}
};
script.onerror=function(){clearTimeout(timeout);reject(new Error('Load Tesseract failed'));};
document.head.appendChild(script);
});
return __tesseractLoading;
}

function findKeywordImage(){
var img=document.querySelector('img[alt="Từ khóa nhiệm vụ"]');
if(img)return img;
var all=document.querySelectorAll('img');var i;
for(i=0;i<all.length;i++){
var alt=(all[i].alt||'').toLowerCase();
if(alt.indexOf('khóa')!==-1||alt.indexOf('khoa')!==-1||alt.indexOf('keyword')!==-1||alt.indexOf('từ khóa')!==-1)return all[i];
}
for(i=0;i<all.length;i++){
var im=all[i];
if(im.closest&&im.closest('#tt-root'))continue;
if(im.closest&&im.closest('.Toastify__toast-container'))continue;
var w=im.naturalWidth||im.width||0;
var h=im.naturalHeight||im.height||0;
if(w>=80&&w<=200&&h>=30&&h<=100)
if(im.src&&im.src.indexOf('data:image')===0)return im;
}
return null;
}

function ocrImage(img){
return new Promise(function(resolve,reject){
if(!img){reject(new Error('No image'));return;}
loadTesseract().then(function(worker){
try{
var canvas=document.createElement('canvas');
var scale=3;
canvas.width=(img.naturalWidth||img.width||220)*scale;
canvas.height=(img.naturalHeight||img.height||108)*scale;
var ctx=canvas.getContext('2d');
ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.drawImage(img,0,0,canvas.width,canvas.height);
var dataUrl=canvas.toDataURL('image/png');
worker.recognize(dataUrl).then(function(result){
var txt=(result&&result.data&&result.data.text)?result.data.text:'';
txt=txt.replace(/\s+/g,' ').trim();
resolve(txt);
}).catch(function(err){reject(err);});
}catch(e){reject(e);}
}).catch(function(err){reject(err);});
});
}

function scanDichvuKeyword(){
return new Promise(function(resolve){
try{
var img=findKeywordImage();
if(!img){resolve('');return;}
ocrImage(img).then(function(raw){
if(!raw){resolve('');return;}
var cleaned=raw.replace(/\s+/g,' ').trim();
cleaned=cleaned.replace(/[^\p{L}\p{N}\s\-_.]/gu,'').replace(/\s+/g,' ').trim();
resolve(cleaned);
}).catch(function(){resolve('');});
}catch(e){resolve('');}
});
}

var DOMAINS={
getList:function(){
try{
var r=S.get('savedDomains','[]');
return typeof r==='string'?JSON.parse(r):(r||[]);
}catch(e){return [];}
},
save:function(d){
var dd=(d||'').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
if(!dd)return false;
var list=DOMAINS.getList();
for(var i=0;i<list.length;i++)if(list[i].d===dd)return false;
list.unshift({d:dd,t:Date.now()});
if(list.length>30)list.length=30;
S.set('savedDomains',JSON.stringify(list));
return true;
},
remove:function(d){
var list=DOMAINS.getList();var out=[];
for(var i=0;i<list.length;i++)if(list[i].d!==d)out.push(list[i]);
S.set('savedDomains',JSON.stringify(out));
}
};

function log(){try{console.log.apply(console,arguments);}catch(e){}}
function isElementAlive(el){
if(!el)return false;
if(!document.contains(el))return false;
try{
var r=el.getBoundingClientRect();
if(r.width===0&&r.height===0){
var st=getComputedStyle(el);
if(st.display==='none'||st.visibility==='hidden')return false;
}
}catch(e){return false;}
return true;
}
function readLatestToast(){
try{
var toasts=document.querySelectorAll('.Toastify__toast');
if(!toasts.length)return '';
var last=toasts[toasts.length-1];
return (last.textContent||'').trim().toLowerCase();
}catch(e){return '';}
}

function showGifOverlay(ms,customGif){
if(!IS_TOP||!document.body)return;
var old=document.getElementById('tt-gif-overlay');
if(old)old.remove();
var ov=document.createElement('div');
ov.id='tt-gif-overlay';
var img=document.createElement('img');
img.src=customGif||GIF_CLOSE;
ov.appendChild(img);
document.body.appendChild(ov);
setTimeout(function(){if(ov.parentNode)ov.remove();},ms||2500);
}

var __cfHandled=false;
var __cfTimer=null;
function isCloudflareChallengePage(){
try{
if(location.href.indexOf('/cdn-cgi/challenge-platform')!==-1)return true;
var b=((document.body&&document.body.innerText)||'').toLowerCase();
if(b.indexOf('xác minh bảo mật')!==-1)return true;
if(b.indexOf('xác minh bạn là người dùng thật')!==-1)return true;
if(b.indexOf('verify you are human')!==-1)return true;
if(b.indexOf('checking your browser')!==-1)return true;
var ifr=document.querySelectorAll('iframe');
for(var i=0;i<ifr.length;i++)if((ifr[i].src||'').indexOf('challenges.cloudflare.com')!==-1)return true;
if(document.querySelector('.cf-turnstile, [class*="cf-turnstile"], #cf-chl-widget'))return true;
return false;
}catch(e){return false;}
}
function findCloudflareTurnstileIframe(){
var ifr=document.querySelectorAll('iframe');
for(var i=0;i<ifr.length;i++){
var s=ifr[i].src||'';
if(s.indexOf('challenges.cloudflare.com')!==-1){
var r=ifr[i].getBoundingClientRect();
if(r.width>=100&&r.height>=40)return ifr[i];
}
}
var wrap=document.querySelector('.cf-turnstile, [class*="cf-turnstile"], #cf-chl-widget');
if(wrap){var inIf=wrap.querySelector('iframe');if(inIf)return inIf;}
return null;
}
function findVerificationCheckbox(){
var inputs=document.querySelectorAll('input[type="checkbox"]');
for(var i=0;i<inputs.length;i++){
var inp=inputs[i];
if(inp.closest&&inp.closest('#tt-root'))continue;
var r=inp.getBoundingClientRect();
if(r.width<10||r.height<10)continue;
var par=inp.closest('div, label, section');
if(par){
var pt=(par.textContent||'').toLowerCase();
if(pt.indexOf('xác minh')!==-1||pt.indexOf('verify')!==-1||pt.indexOf('người dùng thật')!==-1)return inp;
}
}
return null;
}
function clickCloudflareCheckboxOnce(){
try{
var cb=findVerificationCheckbox();
if(cb){
try{
cb.click();
try{cb.checked=true;}catch(e){}
cb.dispatchEvent(new Event('change',{bubbles:true}));
cb.dispatchEvent(new Event('input',{bubbles:true}));
return true;
}catch(e){}
}
var iframe=findCloudflareTurnstileIframe();
if(iframe){
var r=iframe.getBoundingClientRect();
var offsets=[[22,22],[25,25],[20,20],[30,30],[28,28]];
for(var oi=0;oi<offsets.length;oi++){
var cx=r.left+offsets[oi][0],cy=r.top+offsets[oi][1];
var target=document.elementFromPoint(cx,cy);
if(!target)continue;
['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(ev){
try{target.dispatchEvent(new MouseEvent(ev,{bubbles:true,cancelable:true,button:0,clientX:cx,clientY:cy}));}catch(e){}
});
}
try{iframe.focus();}catch(e){}
try{iframe.click();}catch(e){}
return true;
}
return false;
}catch(e){return false;}
}

function handleCloudflareChallenge(){
if(__cfHandled)return false;
if(!isCloudflareChallengePage())return false;
__cfHandled=true;
log('CF: ★ PHAT HIEN ★');
if(IS_TOP&&UI&&UI.status)UI.status.textContent='🎀 Đang xác minh CF... 🐱';
var a=0,maxA=60;
if(__cfTimer){try{clearInterval(__cfTimer);}catch(e){}__cfTimer=null;}
__cfTimer=setInterval(function(){
a++;
if(a>maxA){clearInterval(__cfTimer);__cfTimer=null;if(UI&&UI.status)UI.status.textContent='🎀 CF: nhập tay 🐱';return;}
if(!isCloudflareChallengePage()){
clearInterval(__cfTimer);__cfTimer=null;
log('CF: ★ PASS ★');
__cfHandled=false;
DICHVU_LOCK.unlockAll();
dichvuDone=false;dichvuCreateClicked=false;dichvuOutsideClicked=false;
dichvuGoClicked=false;dichvuTabOpened=false;
try{S.del('dichvuStage');}catch(e){}
try{var cu=location.href.split('?')[0].split('#')[0];sessionStorage.removeItem('__tt_open_blocked_'+cu);}catch(e){}
if(UI&&UI.status)UI.status.textContent='🎀 Đã pass CF 🐱';
if(IS_TOP){
try{showGifOverlay(1800);}catch(e){}
try{showToast('🐱 PASS CF! 🎀',2500);}catch(e){}
}
if(isDichvuTask){
setTimeout(function(){
try{
if(IS_TOP&&UI){UI.status.textContent='🎀 Auto nhận NV... 🐱';if(UI.domainInput)UI.domainInput.value='';if(UI.keywordInput)UI.keywordInput.value='';}
resetAllState(false);stopRequested=false;loopRunning=false;wasOnValidPage=true;pageLoadTime=Date.now();
setState(STATE.DICHVU_TASK);loop();
}catch(e){}
},1500);
}
return;
}
clickCloudflareCheckboxOnce();
},1000);
return true;
}

function initFakeAgent(){
try{
if(window!==window.top)return;
var fpRaw=S.get('fakeFingerprint',''),fp=null;
if(fpRaw){try{fp=(typeof fpRaw==='string')?JSON.parse(fpRaw):fpRaw;}catch(e){fp=null;}}
if(!fp||!fp.ua){
var UA_POOL=['Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36','Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36','Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'];
var ua=UA_POOL[Math.floor(Math.random()*UA_POOL.length)];
fp={ua:ua,isMobile:/Mobile|Android|iPhone/i.test(ua),lang:'vi-VN',langs:['vi-VN','vi','en'],hw:8,mem:8,touch:5,platform:/iPhone/i.test(ua)?'iPhone':'Linux armv8l'};
try{S.set('fakeFingerprint',JSON.stringify(fp));}catch(e){}
}
function safeDefine(obj,prop,getter){
try{
var desc=Object.getOwnPropertyDescriptor(obj,prop);
if(desc&&!desc.configurable)return false;
Object.defineProperty(obj,prop,{get:getter,configurable:true,enumerable:true});
return true;
}catch(e){return false;}
}
try{
safeDefine(Navigator.prototype,'userAgent',function(){return fp.ua;});
safeDefine(Navigator.prototype,'platform',function(){return fp.platform;});
safeDefine(Navigator.prototype,'language',function(){return fp.lang;});
safeDefine(Navigator.prototype,'languages',function(){return fp.langs.slice();});
safeDefine(Navigator.prototype,'hardwareConcurrency',function(){return fp.hw;});
safeDefine(Navigator.prototype,'deviceMemory',function(){return fp.mem;});
safeDefine(Navigator.prototype,'maxTouchPoints',function(){return fp.touch;});
safeDefine(Navigator.prototype,'webdriver',function(){return false;});
}catch(e){}
}catch(e){}
}
initFakeAgent();

function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function getState(){return S.get('state',STATE.IDLE);}
function setState(s){
var old=getState();
if(old===s)return;
S.set('state',s);
S.set('stateSetAt',Date.now().toString());
log('★ STATE: '+old+' -> '+s);
if(IS_TOP&&UI&&UI.status)refreshStatus();
}

function saveCode(code){
if(!code||typeof code!=='string')return;
code=code.trim();
if(!code||!isValidCodeShape(code)||isBlacklistedCode(code))return;
try{
S.set('code',code);
S.set('codeBackup',code);
S.set('codeFoundAt',Date.now().toString());
S.set('codeHardLock',code);
log('SAVE CODE: '+code);
}catch(e){}
}
function loadCode(){
var c=S.get('code','');
if(c)c=(c+'').trim();
if(c&&isValidCodeShape(c)&&!isBlacklistedCode(c))return c;
var cb=S.get('codeBackup','');
if(cb)cb=(cb+'').trim();
if(cb&&isValidCodeShape(cb)&&!isBlacklistedCode(cb)){try{S.set('code',cb);}catch(e){}return cb;}
var ch=S.get('codeHardLock','');
if(ch)ch=(ch+'').trim();
if(ch&&isValidCodeShape(ch)&&!isBlacklistedCode(ch)){try{S.set('code',ch);}catch(e){}return ch;}
return '';
}
function isValidCodeShape(s){
if(!s)return false;
if(s.length!==8)return false;
if(!/^[A-Za-z0-9]+$/.test(s))return false;
if(!/[0-9]/.test(s))return false;
if(!/[A-Za-z]/.test(s))return false;
var d=(s.match(/[0-9]/g)||[]).length;
if(d<1||d>7)return false;
var l=(s.match(/[A-Za-z]/g)||[]).length;
if(l<1||l>7)return false;
if(/^(.)\1{7}$/.test(s))return false;
if(/^(01234567|12345678|abcdefgh|ABCDEFGH|00000000|11111111)$/i.test(s))return false;
return true;
}
function safeNavigate(url){
if(!url)return;
var l=S.get('lastNavUrl','');
var at=parseInt(S.get('lastNavAt','0'),10);
var now=Date.now();
if(l===url&&(now-at)<CFG.navCooldownMs)return;
S.set('lastNavUrl',url);
S.set('lastNavAt',now.toString());
try{location.href=url;}catch(e){}
}

function isTargetPage(){
var t=S.get('targetUrl');
var curDomain=S.get('domain');
var ch=HOST.replace(/^www\./,'');
if(curDomain){
var cd=curDomain.toLowerCase().replace(/^www\./,'').replace(/^https?:\/\//,'').replace(/\/.*$/,'');
if(ch.indexOf(cd)!==-1||cd.indexOf(ch)!==-1)return true;
}
if(!t)return false;
try{
var th=new URL(t).hostname.replace(/^www\./,'');
if(ch.indexOf(th)!==-1||th.indexOf(ch)!==-1)return true;
}catch(e){}
return false;
}
function isRealTargetPage(){return !isGtraffic&&!isGoogle&&!isDichvuTask&&!isRobuxReward&&isTargetPage();}
function getTopHostname(){
try{
if(window.top&&window.top.location&&window.top.location.hostname)return window.top.location.hostname;
}catch(e){}
return HOST;
}
function getBaseDomain(host){
if(!host)return '';
host=host.replace(/^www\./,'').toLowerCase();
var parts=host.split('.');
if(parts.length<=2)return host;
var two=['co.uk','co.jp','co.kr','com.au','co.nz','com.br','co.in','co.id','com.vn','com.cn','com.tw','com.hk','co.th','com.ph','com.my','com.sg'];
var l2=parts.slice(-2).join('.');
if(two.indexOf(l2)!==-1&&parts.length>=3)return parts.slice(-3).join('.');
return parts.slice(-2).join('.');
}
function isSameHostAsTop(){
try{
if(IS_TOP)return true;
var t=getTopHostname();
if(!t)return false;
return getBaseDomain(HOST)===getBaseDomain(t);
}catch(e){return false;}
}
function shouldToolRunOnThisPage(){
if(isDichvuTask)return true;
if(isRobuxReward)return true;
if(isCloudflareChallengePage())return true;
if(IS_TOP){
if(isGtraffic)return true;
if(isGoogle)return true;
if(isRealTargetPage())return true;
return false;
}
if(isSameHostAsTop()){
var t=getTopHostname();
var gt=/(^|\.)gtraffic\.io$/i.test(t);
var gg=/(^|\.)google\./i.test(t);
var dv=/(^|\.)dichvutask\.xyz$/i.test(t);
var rb=/(^|\.)robuxreward\.top$/i.test(t);
if(gt||gg||dv||rb)return true;
var cd=S.get('domain');
if(cd){
var c=cd.toLowerCase().replace(/^www\./,'').replace(/^https?:\/\//,'').replace(/\/.*$/,'');
var th=t.replace(/^www\./,'');
if(th.indexOf(c)!==-1||c.indexOf(th)!==-1)return true;
}
return false;
}
return false;
}

if(!shouldToolRunOnThisPage())return;

// ★ BIẾN TOÀN CỤC PHẦN 1
var loopRunning=false,stopRequested=false,fillRunning=false,submitRunning=false;
var finishCalled=false,fillDone=false,submitted=false,fillRetries=0,codeShown=false;
var gtrafficCheckTimer=null,loopTimer=null,leaveCheckTimer=null,googleObserver=null;
var wasOnValidPage=true,cachedInput=null,cachedInputTime=0,cachedConfirm=null;
var cachedConfirmTime=0,cachedBtn=null,cachedBtnTime=0,getLinkPollTimer=null;
var getLinkObserver=null,getLinkClickDone=false,getLinkStartAt=0,googleClicked=false;
var pageLoadTime=Date.now(),watchdogTimer=null,patchedInput=null,childTabRef=null;
var pollChildTimer=null,dichvuTaskTimer=null,dichvuDone=false,dichvuCreateClicked=false;
var dichvuLastCreateAt=0,dichvuGoClicked=false,dichvuOutsideClicked=false;
var dichvuOutsideClickedAt=0,dichvuTabOpened=false,robuxTaskRunning=false;
var robuxLastClickAt=0,robuxGtrafficTabRef=null,robuxModalOpenedAt=0,robuxClaimStartAt=0;
var robuxClaimDone=false;

// ★ HẾT PHẦN 1 — Tiếp tục ở PHẦN 2// ★ PHẦN 2 - TIẾP NỐI PHẦN 1

function goBackToGtraffic(){
if(S.get('backDone')==='1')return;
var c=getCodeFromPanel();if(!c)c=loadCode();
if(c&&isValidCodeShape(c)&&!isBlacklistedCode(c)){try{S.set('code',c);S.set('codeBackup',c);S.set('codeHardLock',c);}catch(e){}}
try{S.set('state',STATE.BACK_GTRAFFIC);S.set('inFlow','1');}catch(e){}
S.set('backDone','1');S.set('navigatingBack','1');
log('★ GO BACK GTRAFFIC NOW');
try{
var gu=S.get('gtrafficUrl','');
if(gu)location.href=gu;
else location.href='https://gtraffic.io/';
}catch(e){}
}

function resetAllState(silent){
if(!silent)log('AUTO RESET');
try{S.reset();}catch(e){}
stopRequested=true;loopRunning=false;fillRunning=false;submitRunning=false;
finishCalled=false;fillDone=false;submitted=false;fillRetries=0;codeShown=false;
getLinkClickDone=false;googleClicked=false;
if(gtrafficCheckTimer){try{clearInterval(gtrafficCheckTimer);}catch(e){}gtrafficCheckTimer=null;}
if(loopTimer){try{clearTimeout(loopTimer);}catch(e){}loopTimer=null;}
if(googleObserver){try{googleObserver.disconnect();}catch(e){}googleObserver=null;}
if(getLinkPollTimer){try{clearInterval(getLinkPollTimer);}catch(e){}getLinkPollTimer=null;}
if(watchdogTimer){try{clearInterval(watchdogTimer);}catch(e){}watchdogTimer=null;}
if(pollChildTimer){try{clearInterval(pollChildTimer);}catch(e){}pollChildTimer=null;}
if(UI&&UI.root)UI.root.style.display='none';
var fab=document.getElementById('tt-fab');
if(fab)fab.remove();
}

function doImmediateAutoReset(){
log('DO IMMEDIATE AUTO RESET');
try{
var sd=S.get('savedDomains','[]');
var cb=S.get('codeBackup','');
var cr=S.get('code','');
var chl=S.get('codeHardLock','');
var km=S.get('keywordMap','[]');
var cbl=S.get('customBlacklist','[]');
S.resetFull();
try{S.set('savedDomains',sd);}catch(e){}
try{S.set('keywordMap',km);}catch(e){}
try{S.set('customBlacklist',cbl);}catch(e){}
if(cr&&isValidCodeShape(cr)&&!isBlacklistedCode(cr))try{S.set('code',cr);}catch(e){}
if(cb)try{S.set('codeBackup',cb);}catch(e){}
if(chl)try{S.set('codeHardLock',chl);}catch(e){}
try{S.set('pendingAutoReset','1');}catch(e){}
try{S.set('inFlow','0');}catch(e){}
}catch(e){}
try{
if(UI){
if(UI.domainInput)UI.domainInput.value='';
if(UI.keywordInput)UI.keywordInput.value='';
if(UI.status)UI.status.textContent='🎀 Sẵn sàng 🐱';
if(UI.code)UI.code.classList.remove('show');
if(UI.codeVal)UI.codeVal.textContent='----';
}
}catch(e){}
try{S.set('state',STATE.IDLE);}catch(e){}
stopRequested=true;loopRunning=false;fillDone=true;fillRunning=false;submitRunning=false;
finishCalled=true;submitted=true;fillRetries=0;codeShown=false;
cachedInput=null;cachedInputTime=0;cachedConfirm=null;cachedConfirmTime=0;
cachedBtn=null;cachedBtnTime=0;
if(gtrafficCheckTimer){try{clearInterval(gtrafficCheckTimer);}catch(e){}gtrafficCheckTimer=null;}
if(loopTimer){try{clearTimeout(loopTimer);}catch(e){}loopTimer=null;}
if(watchdogTimer){try{clearInterval(watchdogTimer);}catch(e){}watchdogTimer=null;}
if(pollChildTimer){try{clearInterval(pollChildTimer);}catch(e){}pollChildTimer=null;}
try{showToast('🎀 SẴN SÀNG WEB MỚI 🐱',2000);}catch(e){}
}

function startLeaveDetector(){
if(!IS_TOP)return;
if(leaveCheckTimer)return;
leaveCheckTimer=setInterval(function(){
if(Date.now()-pageLoadTime<2000)return;
if(S.get('inFlow')==='1')return;
if(isCloudflareChallengePage())return;
var valid=shouldToolRunOnThisPage();
if(wasOnValidPage&&!valid){
var st=getState();
var inFlow=(st===STATE.GET_CODE||st===STATE.WAIT_COUNTDOWN||st===STATE.SCAN_BTN||st===STATE.BACK_GTRAFFIC||st===STATE.FILL_CODE||st===STATE.GOOGLE_CLICK||st===STATE.DICHVU_TASK);
var hasCode=!!(loadCode());
if(!inFlow&&!hasCode){
resetAllState();
wasOnValidPage=false;
if(leaveCheckTimer){clearInterval(leaveCheckTimer);leaveCheckTimer=null;}
}
}
},CFG.leaveCheckMs);
}

try{
window.addEventListener('beforeunload',function(){
if(S.get('inFlow')==='1')return;
try{S.set('leavingAt',Date.now().toString());}catch(e){}
});
window.addEventListener('pagehide',function(){
if(S.get('inFlow')==='1')return;
try{S.set('leavingAt',Date.now().toString());}catch(e){}
});
}catch(e){}

function stopAll(){
stopRequested=true;loopRunning=false;fillRunning=false;submitRunning=false;
if(gtrafficCheckTimer){try{clearInterval(gtrafficCheckTimer);}catch(e){}gtrafficCheckTimer=null;}
if(loopTimer){try{clearTimeout(loopTimer);}catch(e){}loopTimer=null;}
if(googleObserver){try{googleObserver.disconnect();}catch(e){}googleObserver=null;}
if(getLinkPollTimer){try{clearInterval(getLinkPollTimer);}catch(e){}getLinkPollTimer=null;}
if(watchdogTimer){try{clearInterval(watchdogTimer);}catch(e){}watchdogTimer=null;}
if(pollChildTimer){try{clearInterval(pollChildTimer);}catch(e){}pollChildTimer=null;}
if(dichvuTaskTimer){try{clearInterval(dichvuTaskTimer);}catch(e){}dichvuTaskTimer=null;}
}

function resetFillFlags(){
stopRequested=false;fillRunning=false;submitRunning=false;finishCalled=false;
fillDone=false;submitted=false;fillRetries=0;codeShown=false;
cachedInput=null;cachedInputTime=0;cachedConfirm=null;cachedConfirmTime=0;
getLinkClickDone=false;getLinkStartAt=0;googleClicked=false;
try{S.del('hardStop');}catch(e){}
try{S.del('countdownRealZero');}catch(e){}
try{S.del('getLinkClicked');}catch(e){}
try{S.del('waitingGetLink');}catch(e){}
try{S.del('pendingAutoReset');}catch(e){}
try{S.del('childTabOpen');}catch(e){}
}

function watchdog(){
if(S.get('waitingGetLink')==='1')return;
if(S.get('pendingAutoReset')==='1')return;
var st=getState();
var sa=parseInt(S.get('stateSetAt','0'),10);
var age=Date.now()-sa;
if(S.get('hardStop')==='1'){stopAll();return;}
if(isRealTargetPage()&&(st===STATE.GOOGLE_SEARCH||st===STATE.GOOGLE_CLICK)){setState(STATE.SCAN_BTN);return;}
if(st===STATE.GOOGLE_CLICK&&age>CFG.watchdogMs){setState(STATE.SCAN_BTN);return;}
if(st===STATE.SCAN_BTN&&age>30000){S.set('stateSetAt',Date.now().toString());}
if(st===STATE.WAIT_COUNTDOWN&&age>90000){setState(STATE.GET_CODE);return;}
if(st===STATE.WAIT_COUNTDOWN){
var cd=readCountdown();
if(cd&&cd.sec===0&&S.get('cdStartSec')&&S.get('cdStartSec')!=='0'){setState(STATE.GET_CODE);return;}
}
if(st===STATE.GET_CODE&&age>CFG.codeTimeoutMs){
if(S.get('backDone')!=='1')S.set('backDone','1');
}
}

var UI={};

function isBlueish(c){
if(!c)return false;
if(c.b<110)return false;
if(c.r>c.b)return false;
if(c.g>c.b+25)return false;
if(c.b-c.r<30)return false;
return true;
}
function getBgRGBA(el){
var c=tryGetBg(el);
if(c&&c.a>0.5)return c;
var p=el.parentElement;var d=0;
while(p&&d<5){
var pc=tryGetBg(p);
if(pc&&pc.a>0.5)return pc;
p=p.parentElement;d++;
}
return null;
}
function tryGetBg(el){
if(!el)return null;
try{
var st=window.getComputedStyle(el);
var bg=st.backgroundColor||'';
var m=bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/);
if(m){
var a=m[4]!==undefined?parseFloat(m[4]):1;
return{r:parseInt(m[1],10),g:parseInt(m[2],10),b:parseInt(m[3],10),a:a};
}
}catch(e){}
return null;
}
function isRound(el){
var w=el.offsetWidth,h=el.offsetHeight;
if(w<30||w>200)return false;
if(h<30||h>200)return false;
if(Math.abs(w-h)>15)return false;
return true;
}
function isExcluded(el){
var cls=(el.className||'').toString().toLowerCase();
var id=(el.id||'').toString().toLowerCase();
var c=' '+cls+' '+id+' ';
var ban=['logo','brand','avatar','banner','header','nav','menu','footer','navbar','topbar','toolbar','copyright'];
for(var i=0;i<ban.length;i++){
if(c.indexOf(' '+ban[i]+' ')!==-1)return true;
if(c.indexOf(' '+ban[i]+'-')!==-1)return true;
if(c.indexOf('-'+ban[i]+' ')!==-1)return true;
}
return false;
}

function findByPixelScan(){
if(!document.body)return null;
var vw=window.innerWidth,vh=window.innerHeight,step=12,seen={},candidates=[];
for(var y=30;y<vh-30;y+=step){
for(var x=30;x<vw-30;x+=step){
try{
var el=document.elementFromPoint(x,y);
if(!el)continue;
if(el.closest&&el.closest('#tt-root'))continue;
if(el.closest&&el.closest('#tt-fab'))continue;
if(isExcluded(el))continue;
if(!isRound(el)){
var p=el.parentElement;var cnt=0;
while(p&&cnt<3){
if(isExcluded(p))break;
if(isRound(p)){el=p;break;}
p=p.parentElement;cnt++;
}
if(!isRound(el))continue;
}
var key=el.tagName+'#'+(el.id||'')+'.'+(el.className||'').toString().slice(0,20);
if(seen[key])continue;
seen[key]=true;
var score=0;
var bg=getBgRGBA(el);
if(isBlueish(bg))score+=100;
try{if(el.querySelector('svg, img, canvas, text'))score+=60;}catch(e){}
if(el.tagName==='SVG'||el.tagName==='IMG'||el.tagName==='CANVAS')score+=50;
var txt=(el.textContent||'').trim();
if(txt==='g'||txt==='G')score+=200;
else if(/^\d{1,4}$/.test(txt))score+=200;
else if(/^g\d{1,4}$/i.test(txt))score+=200;
var r=el.getBoundingClientRect();
var cx=r.left+r.width/2,cy=r.top+r.height/2;
var d=Math.abs(cx-vw/2)/vw+Math.abs(cy-vh/2)/vh;
score+=Math.max(0,40-d*40);
if(score>=100)candidates.push({el:el,score:score});
}catch(e){}
}
}
if(!candidates.length)return null;
candidates.sort(function(a,b){return b.score-a.score;});
return candidates[0].el;
}

function findByHeuristic(){
try{
var fastSels=['#avt-btn','[id*="avt" i]','[class*="avt" i]','[aria-label*="verify" i]','[aria-label*="code" i]','[data-code]','[data-verify]','button[onclick*="avt" i]','div[onclick*="avt" i]','a[href*="avt" i]'];
for(var s=0;s<fastSels.length;s++){
try{
var found=document.querySelector(fastSels[s]);
if(found&&(!found.closest||!found.closest('#tt-root'))){
var wf=found.offsetWidth||found.clientWidth;
var hf=found.offsetHeight||found.clientHeight;
if(wf>=30&&wf<=250&&Math.abs(wf-hf)<=20)return found;
}
}catch(e){}
}
}catch(e){}
try{
var byId=document.querySelectorAll('#avt-btn, [id*="avt" i], [class*="avt" i], [aria-label*="verify" i], [aria-label*="code" i], [data-code], [data-verify]');
for(var i=0;i<byId.length;i++){
var e=byId[i];
if(e.closest&&e.closest('#tt-root'))continue;
var w=e.offsetWidth||e.clientWidth,h=e.offsetHeight||e.clientHeight;
if(w>=30&&w<=250&&Math.abs(w-h)<=20)return e;
}
}catch(e){}
try{
var svgs=document.querySelectorAll('svg');
for(var j=0;j<svgs.length;j++){
var svg=svgs[j];
if(svg.closest&&svg.closest('#tt-root'))continue;
var sw=svg.offsetWidth||svg.clientWidth,sh=svg.offsetHeight||svg.clientHeight;
if(sw<30||sw>250)continue;
if(Math.abs(sw-sh)>20)continue;
if(svg.offsetParent===null)continue;
try{
var txtEl=svg.querySelector('text, tspan');
if(txtEl){
var tt=(txtEl.textContent||'').trim();
if(/^g?\d+$/i.test(tt)||/^[A-Za-z0-9_\-]{4,24}$/.test(tt))return svg;
}
}catch(e){}
try{
var circles=svg.querySelectorAll('circle');
if(circles.length>0&&sw>=40)return svg;
}catch(e){}
}
}catch(e){}
try{
var all=document.querySelectorAll('div, span, button, a, i, b, strong');
for(var k=0;k<all.length;k++){
var e2=all[k];
if(e2.closest&&e2.closest('#tt-root'))continue;
if(e2.closest&&e2.closest('#tt-fab'))continue;
var w2=e2.offsetWidth||0,h2=e2.offsetHeight||0;
if(w2<30||w2>200)continue;
if(Math.abs(w2-h2)>15)continue;
var txt2=(e2.textContent||'').trim();
if(txt2!=='g'&&txt2!=='G')continue;
return e2;
}
}catch(e){}
try{
var all2=document.querySelectorAll('div, span, button, a, i');
for(var m=0;m<all2.length;m++){
var e3=all2[m];
if(e3.closest&&e3.closest('#tt-root'))continue;
if(e3.closest&&e3.closest('#tt-fab'))continue;
var w3=e3.offsetWidth||0,h3=e3.offsetHeight||0;
if(w3<40||w3>150)continue;
if(Math.abs(w3-h3)>15)continue;
var bg3=getBgRGBA(e3);
if(!isBlueish(bg3))continue;
return e3;
}
}catch(e){}
return null;
}

function findGreenGButton(){
if(cachedBtn&&Date.now()-cachedBtnTime<800){
try{
if(document.contains(cachedBtn)){
var r=cachedBtn.getBoundingClientRect();
if(r.width>=20&&r.height>=20)return cachedBtn;
}
}catch(e){}
cachedBtn=null;
}
var b=findByHeuristic();
if(b){cachedBtn=b;cachedBtnTime=Date.now();return b;}
b=findByPixelScan();
if(b){cachedBtn=b;cachedBtnTime=Date.now();return b;}
cachedBtn=null;
return null;
}

function readBtnNumber(btn){
if(!btn)return null;
var t=(btn.textContent||'').replace(/\s+/g,'').trim();
var m=t.match(/^g?(\d{1,4})$/i);
if(m){
var s=parseInt(m[1],10);
if(s>=0&&s<=999)return s;
}
try{
var inners=btn.querySelectorAll('text, tspan');
for(var i=0;i<inners.length;i++){
var tt=(inners[i].textContent||'').replace(/\s+/g,'').trim();
var mm=tt.match(/^g?(\d{1,4})$/i);
if(mm){
var s2=parseInt(mm[1],10);
if(s2>=0&&s2<=999)return s2;
}
}
}catch(e){}
return null;
}

function clickBtn(el){
if(!el)return;
try{el.scrollIntoView({behavior:'instant',block:'center'});}catch(e){}
setTimeout(function(){
try{el.click();}catch(e){}
try{el.dispatchEvent(new Event('click',{bubbles:true,cancelable:true}));}catch(e){}
try{el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));}catch(e){}
},0);
}

var CD_PATTERNS=[
/vui long cho\s*(\d+)\s*s?\s*\(\s*(\d+)\s*\/\s*(\d+)\s*\)/i,
/cho\s*(\d+)\s*s\s*\(\s*(\d+)\s*\/\s*(\d+)\s*\)/i,
/cho\s*(\d+)\s*giay/i,
/cho\s*(\d+)\s*s\b/i,
/con[:\s]*(\d+)/i,
/wait[:\s]*(\d+)/i,
/time[:\s]*(\d+)/i,
/(\d+)\s*seconds?/i,
/(\d+)\s*giay/i
];
function parseCd(t){
if(!t)return null;
for(var p=0;p<CD_PATTERNS.length;p++){
var m=t.match(CD_PATTERNS[p]);
if(m){
var s=parseInt(m[1],10);
if(s>=0&&s<=999)return{sec:s,phase:m[2]?parseInt(m[2],10):1,total:m[3]?parseInt(m[3],10):2};
}
}
return null;
}

function readCountdown(){
var btn=cachedBtn;
if(!btn||!isElementAlive(btn))btn=findGreenGButton();
if(btn){
var n=readBtnNumber(btn);
if(n!==null){
if(!S.get('cdStartSec')||S.get('cdStartSec')==='0'){
S.set('cdStartSec',n.toString());
S.set('cdStartAt',Date.now().toString());
}
if(n===0)S.set('countdownRealZero','1');
else S.set('countdownRealZero','0');
return{sec:n,phase:1,total:2,src:'btn'};
}
}
try{
var bt=(document.body&&document.body.innerText)||'';
var r=parseCd(bt);
if(r)return{sec:r.sec,phase:r.phase,total:r.total,src:'page'};
}catch(e){}
var clickAt=parseInt(S.get('btnClickAt','0'),10);
if(clickAt>0){
var e2=Math.floor((Date.now()-clickAt)/1000);
if(e2>8){
var r2=CFG.defaultCountdown-e2;
if(r2<0)r2=0;
return{sec:r2,phase:1,total:2,src:'click'};
}
}
return null;
}

function scanPageForCode(){
if(getState()!==STATE.GET_CODE)return null;
var candidates=[],seen={};
try{
var all=document.querySelectorAll('div, span, button, a, p, strong, h1, h2, h3, h4, td, th, li, label, section, article, code, kbd, mark, pre');
for(var i=0;i<all.length;i++){
var el=all[i];
if(el.closest&&el.closest('#tt-root'))continue;
if(el.closest&&el.closest('#tt-fab'))continue;
if(el.closest&&el.closest('.Toastify__toast-container'))continue;
if(cachedBtn&&el===cachedBtn)continue;
var txt=(el.textContent||'').replace(/\s+/g,'').trim();
if(!txt||txt.length!==8)continue;
if(!/^[A-Za-z0-9]+$/.test(txt))continue;
if(isBlacklistedCode(txt))continue;
if(!isValidCodeShape(txt))continue;
if(seen[txt])continue;
seen[txt]=true;
candidates.push(txt);
}
}catch(e){}
return candidates.length?candidates[0]:null;
}

function extractCodeFromBtn(btn){
if(!btn)return null;
var t=(btn.textContent||'').replace(/\s+/g,'').trim();
if(t.length===8&&/^[A-Za-z0-9]+$/.test(t)&&!isBlacklistedCode(t)&&isValidCodeShape(t))return t;
try{
var inners=btn.querySelectorAll('text, tspan');
for(var i=0;i<inners.length;i++){
var tt=(inners[i].textContent||'').replace(/\s+/g,'').trim();
if(tt.length===8&&/^[A-Za-z0-9]+$/.test(tt)&&!isBlacklistedCode(tt)&&isValidCodeShape(tt))return tt;
}
}catch(e){}
return null;
}

function extractCode(){
var b=cachedBtn;
if(!b||!isElementAlive(b))b=findGreenGButton();
if(b){
var c1=extractCodeFromBtn(b);
if(c1)return c1;
}
var c2=scanPageForCode();
if(c2)return c2;
return null;
}

function findGoogleResult(){
var ud=(S.get('domain','')||'').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/.*$/,'').trim();
function exH(href){try{return new URL(href).hostname.replace(/^www\./,'').toLowerCase();}catch(e){return '';}}
function isUD(href){
if(!ud)return false;
var h=exH(href);
if(!h)return false;
if(h===ud)return true;
if(h.indexOf(ud)!==-1)return true;
if(ud.indexOf(h)!==-1)return true;
return getBaseDomain(h)===getBaseDomain(ud);
}
function isN(href){
if(!href)return true;
if(href.indexOf('http://')!==0&&href.indexOf('https://')!==0)return true;
if(/^https?:\/\/([^\/]+\.)?(google|gstatic|googleusercontent|youtube|wikipedia|facebook)/i.test(href))return true;
if(href.indexOf('google.com/search')!==-1)return true;
return false;
}
if(ud){
try{
var aL=document.querySelectorAll('#rso a[href^="http"], #search a[href^="http"], h3 a[href^="http"], a[href^="http"]');
for(var i=0;i<aL.length;i++){
var h0=aL[i].href||'';
if(isN(h0))continue;
if(isUD(h0))return aL[i];
}
}catch(e){}
}
var fs=['#rso > div a[href^="http"]','#rso a[href^="http"]','#search a[href^="http"]','h3 a[href^="http"]'];
for(var s=0;s<fs.length;s++){
try{
var fl=document.querySelectorAll(fs[s]);
for(var f=0;f<fl.length;f++){
if(isN(fl[f].href||''))continue;
return fl[f];
}
}catch(e){}
}
return null;
}

function startGoogleObserver(){
if(!IS_TOP||!isGoogle)return;
if(googleObserver)return;
try{
googleObserver=new MutationObserver(function(){
if(stopRequested||googleClicked)return;
var st=getState();
if(st!==STATE.GOOGLE_SEARCH&&st!==STATE.GOOGLE_CLICK)return;
var l=findGoogleResult();
if(l){
googleClicked=true;
try{l.click();}catch(e){}
S.set('targetUrl',l.href||'');
setState(STATE.GOOGLE_CLICK);
if(googleObserver){try{googleObserver.disconnect();}catch(e){}googleObserver=null;}
}
});
googleObserver.observe(document.documentElement||document.body,{childList:true,subtree:true});
}catch(e){}
}

function handleGoogle(){
if(!IS_TOP||googleClicked)return Promise.resolve();
var st=getState();
if(st!==STATE.GOOGLE_SEARCH&&st!==STATE.GOOGLE_CLICK)return Promise.resolve();
var st2=S.get('keyword')||S.get('domain');
if(!st2)return Promise.resolve();
var tries=parseInt(S.get('googleClickTries','0'),10);
tries++;
S.set('googleClickTries',tries.toString());
var l=findGoogleResult();
if(l){
googleClicked=true;
try{l.click();}catch(e){}
S.set('targetUrl',l.href||'');
setState(STATE.GOOGLE_CLICK);
if(googleObserver){try{googleObserver.disconnect();}catch(e){}googleObserver=null;}
return Promise.resolve();
}
if(tries>=6){
var cd=(S.get('domain','')||'').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/.*$/,'').trim();
if(cd&&cd.indexOf('.')!==-1){
var u='https://'+cd;
googleClicked=true;
S.set('targetUrl',u);
setState(STATE.SCAN_BTN);
safeNavigate(u);
}
}
return Promise.resolve();
}

function findCodeInput(){
var sels=['input[maxlength="8"][type="text"]','input[maxlength="8"]:not([type="hidden"])','input[placeholder*="Nhập mã xác nhận"]','input[placeholder*="nhập mã"]','input[name="code"]','input#code','input[name="ma"]','input[name="verify"]'];
for(var i=0;i<sels.length;i++){
var els=document.querySelectorAll(sels[i]);
for(var j=0;j<els.length;j++){
var el=els[j];
if(el.closest&&el.closest('#tt-root'))continue;
if(el.closest&&el.closest('.Toastify__toast-container'))continue;
if(el.type&&/hidden|submit|button|checkbox|radio|file|image/i.test(el.type))continue;
var r=el.getBoundingClientRect();
if(r.width<30||r.height<15)continue;
return el;
}
}
return null;
}

function findConfirmBtn(){
var all=document.querySelectorAll('button, a, div[onclick], div[role="button"], input[type="submit"], span, div, [tabindex]');
var best=null,bestScore=-1;
for(var i=0;i<all.length;i++){
var el=all[i];
if(el.closest&&el.closest('#tt-root'))continue;
if(el.closest&&el.closest('#tt-fab'))continue;
if(el.closest&&el.closest('.Toastify__toast-container'))continue;
var r=el.getBoundingClientRect();
if(r.width<20||r.height<15)continue;
var txt=(el.textContent||el.value||'').replace(/\s+/g,' ').trim();
if(!txt||txt.length<4||txt.length>100)continue;
var sc=0;
if(/^NHẬP MÃ XÁC NHẬN$/i.test(txt))sc+=1000;
else if(/^nhập mã xác nhận$/i.test(txt))sc+=900;
else if(/^nhap ma xac nhan$/i.test(txt))sc+=800;
else if(/nhập mã xác nhận/i.test(txt))sc+=700;
else if(/xác nhận|xac nhan/i.test(txt))sc+=300;
else if(/nhập mã|nhap ma/i.test(txt))sc+=200;
else continue;
if(el.tagName==='BUTTON')sc+=50;
if(sc>bestScore){bestScore=sc;best=el;}
}
return best;
}

function findCodeInputCached(){
var n=Date.now();
if(cachedInput&&isElementAlive(cachedInput)&&n-cachedInputTime<1000)return cachedInput;
var el=findCodeInput();
cachedInput=el;
cachedInputTime=n;
return el;
}

function findConfirmBtnCached(){
var n=Date.now();
if(cachedConfirm&&isElementAlive(cachedConfirm)&&n-cachedConfirmTime<1000)return cachedConfirm;
var el=findConfirmBtn();
cachedConfirm=el;
cachedConfirmTime=n;
return el;
}

function getCodeFromPanel(){
if(UI&&UI.codeVal){
var t=(UI.codeVal.textContent||'').trim();
if(t&&t!=='----')return t;
}
return '';
}

function nativeSetValue(el,v){
try{
var proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
var d=Object.getOwnPropertyDescriptor(proto,'value');
if(d&&d.set){d.set.call(el,v);return true;}
el.value=v;return true;
}catch(e){return false;}
}

function nativeGetValue(el){
try{
var proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
var d=Object.getOwnPropertyDescriptor(proto,'value');
if(d&&d.get)return d.get.call(el);
return el.value;
}catch(e){return '';}
}

function fireFullSequence(el,ch){
try{el.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,cancelable:true,key:ch,keyCode:(ch||'').charCodeAt(0)}));}catch(e){}
try{el.dispatchEvent(new InputEvent('beforeinput',{bubbles:true,cancelable:true,inputType:'insertText',data:ch}));}catch(e){}
try{el.dispatchEvent(new InputEvent('input',{bubbles:true,cancelable:true,inputType:'insertText',data:ch}));}catch(e){}
try{el.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}
try{el.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true,cancelable:true,key:ch,keyCode:(ch||'').charCodeAt(0)}));}catch(e){}
}

function nativeSetFill(el,code){
try{
el.focus();
try{el.click();}catch(e){}
try{el.select();}catch(e){}
nativeSetValue(el,'');
nativeSetValue(el,code);
for(var i=0;i<code.length;i++)fireFullSequence(el,code[i]);
try{el.dispatchEvent(new Event('change',{bubbles:true,cancelable:true}));}catch(e){}
return nativeGetValue(el)===code;
}catch(e){return false;}
}

function tryAllFillStrategies(el,code,cb){
var ok=nativeSetFill(el,code);
setTimeout(function(){
var v1=nativeGetValue(el);
if(v1===code){cb(true);return;}
nativeSetFill(el,code);
setTimeout(function(){cb(nativeGetValue(el)===code);},200);
},350);
}

function startValueWatchdog(el,code){
if(watchdogTimer){try{clearInterval(watchdogTimer);}catch(e){}watchdogTimer=null;}
watchdogTimer=setInterval(function(){
if(stopRequested||finishCalled||submitted){clearInterval(watchdogTimer);watchdogTimer=null;return;}
if(!el||!isElementAlive(el))return;
var cur=nativeGetValue(el);
if(cur!==code){
nativeSetValue(el,code);
for(var i=0;i<code.length;i++)fireFullSequence(el,code[i]);
}
},60);
}

function stopValueWatchdog(){
if(watchdogTimer){try{clearInterval(watchdogTimer);}catch(e){}watchdogTimer=null;}
}

function unpatchInput(){patchedInput=null;}

function clickConfirmNow(){
var bt=findConfirmBtnCached();
if(!bt){bt=findConfirmBtn();if(bt){cachedConfirm=bt;cachedConfirmTime=Date.now();}}
if(!bt)return false;
try{bt.scrollIntoView({block:'center',behavior:'instant'});}catch(e){}
function fc(el){
if(!el)return;
try{el.focus({preventScroll:true});}catch(e){}
try{el.click();}catch(e){}
try{el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true,button:0}));}catch(e){}
try{el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,cancelable:true,button:0}));}catch(e){}
try{el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,button:0}));}catch(e){}
}
fc(bt);
try{if(bt.parentElement&&!bt.parentElement.closest('#tt-root'))fc(bt.parentElement);}catch(e){}
return true;
}

function checkSubmitResult(){
try{
var toastText=readLatestToast();
if(toastText){
if(toastText.indexOf('thành công')!==-1||toastText.indexOf('success')!==-1)return 'success';
if(toastText.indexOf('mã không đúng')!==-1||toastText.indexOf('invalid')!==-1)return 'error';
}
var bt=((document.body&&document.body.innerText)||'').toLowerCase();
var inp=findCodeInputCached();
if(!inp)return 'success';
var sk=['thành công','thanh cong','hoàn tất','hoan tat','đã xác nhận','success','completed','chúc mừng'];
for(var j=0;j<sk.length;j++)if(bt.indexOf(sk[j])!==-1)return 'success';
var ek=['mã không đúng','ma khong dung','mã sai','ma sai','mã hết hạn','invalid'];
for(var i=0;i<ek.length;i++)if(bt.indexOf(ek[i])!==-1)return 'error';
var cv=(nativeGetValue(inp)||'').trim();
if(cv&&cv===loadCode())return 'pending';
return 'unknown';
}catch(e){return 'unknown';}
}

function stripVietnamese(s){
if(!s)return '';
return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
}

function findGetLinkButton(){
var all=document.querySelectorAll('button, a, div[role="button"], span, div');
for(var i=0;i<all.length;i++){
var el=all[i];
if(el.closest&&el.closest('#tt-root'))continue;
if(el.closest&&el.closest('#tt-fab'))continue;
if(el.closest&&el.closest('.Toastify__toast-container'))continue;
if(el.offsetParent===null&&el.tagName!=='A')continue;
var txt=(el.textContent||el.value||'').replace(/\s+/g,' ').trim();
if(!txt||txt.length>40)continue;
var lc=stripVietnamese(txt);
if(lc==='lay link'||lc==='laylink'||lc==='lay link ngay'||lc==='nhan link'){
var r=el.getBoundingClientRect();
if(r.width>=40&&r.height>=15)return el;
}
}
return null;
}

function clickGetLinkButton(btn){
if(!btn)return false;
try{btn.click();}catch(e){}
try{btn.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));}catch(e){}
return true;
}

function startWaitingForGetLink(){
S.set('waitingGetLink','1');
getLinkStartAt=Date.now();
getLinkClickDone=false;
if(IS_TOP)showGuide('<b>🎀 ĐÃ NỘP MÃ 🐱</b><br>Đang chờ nút LẤY LINK...');
if(getLinkPollTimer){try{clearInterval(getLinkPollTimer);}catch(e){}getLinkPollTimer=null;}
function tryClick(){
if(getLinkClickDone)return;
var btn=findGetLinkButton();
if(!btn)return;
getLinkClickDone=true;
doImmediateAutoReset();
clickGetLinkButton(btn);
if(getLinkPollTimer){try{clearInterval(getLinkPollTimer);}catch(e){}getLinkPollTimer=null;}
setTimeout(function(){try{handleCloudflareChallenge();}catch(e){}},2000);
}
getLinkPollTimer=setInterval(function(){
if(getLinkClickDone){clearInterval(getLinkPollTimer);getLinkPollTimer=null;return;}
if(Date.now()-getLinkStartAt>CFG.getLinkTimeoutMs){
getLinkClickDone=true;
clearInterval(getLinkPollTimer);
getLinkPollTimer=null;
doImmediateAutoReset();
return;
}
tryClick();
},500);
}

function finishSuccess(reason){
if(finishCalled)return;
finishCalled=true;
submitted=true;
stopValueWatchdog();
unpatchInput();
if(IS_TOP){
try{showGifOverlay(2500);}catch(e){}
try{showToast('🎀 HOÀN THÀNH! 🐱',3000);}catch(e){}
}
S.set('confirmed','1');
S.set('hardStop','1');
S.set('inFlow','0');
S.set('childTabOpen','0');
fillDone=true;
setState(STATE.DONE);
fillRunning=false;
submitRunning=false;
if(gtrafficCheckTimer){clearInterval(gtrafficCheckTimer);gtrafficCheckTimer=null;}
if(pollChildTimer){clearInterval(pollChildTimer);pollChildTimer=null;}
startWaitingForGetLink();
}

function fillAndConfirm(force){
if(!IS_TOP||!isGtraffic)return false;
if(S.get('pendingAutoReset')==='1')return false;
if(S.get('hardStop')==='1')return false;
if(finishCalled||submitted)return false;
if(fillRunning){setTimeout(function(){fillAndConfirm(force);},100);return true;}
if(submitRunning)return true;
if(fillDone&&!force)return true;
fillRunning=true;
var code=getCodeFromPanel();
if(!code||!isValidCodeShape(code)||isBlacklistedCode(code))code=loadCode();
if(!code||!isValidCodeShape(code)||isBlacklistedCode(code)){
fillRetries++;
fillRunning=false;
if(fillRetries<CFG.fillRetryMax)setTimeout(function(){fillAndConfirm(force);},CFG.fillRetryDelay);
return false;
}
saveCode(code);
if(!codeShown&&UI){
codeShown=true;
UI.code.classList.add('show');
UI.codeVal.textContent=code;
showGuide('<b>🎀 ĐANG DÁN MÃ 🐱</b><br>Mã: <b>'+code+'</b>');
}
var ws=Date.now(),wt=30000,wp=100;
function waitInp(){
if(stopRequested||S.get('hardStop')==='1'||finishCalled||submitted){fillRunning=false;return;}
var inp=findCodeInputCached();
if(inp){startFill(inp);return;}
if(Date.now()-ws>wt){
fillRunning=false;
fillRetries++;
if(fillRetries<CFG.fillRetryMax)setTimeout(function(){fillAndConfirm(force);},CFG.fillRetryDelay);
return;
}
setTimeout(waitInp,wp);
}
function startFill(inp){
startValueWatchdog(inp,code);
tryAllFillStrategies(inp,code,function(success){
fillRunning=false;
if(stopRequested||S.get('hardStop')==='1'||finishCalled||submitted)return;
if(success){
showGuide('<b>🎀 ĐÃ DÁN MÃ 🐱</b><br>Đang nộp...');
setTimeout(function(){
if(stopRequested||S.get('hardStop')==='1'||finishCalled||submitted)return;
submitRunning=true;
var c=nativeGetValue(inp);
if(c!==code){
nativeSetValue(inp,code);
for(var i=0;i<code.length;i++)fireFullSequence(inp,code[i]);
}
var ca=0,mc=8,ci=250;
function tryClick(){
if(finishCalled||submitted||S.get('hardStop')==='1')return;
ca++;
cachedConfirm=null;
cachedConfirmTime=0;
clickConfirmNow();
if(ca<mc)setTimeout(tryClick,ci);
}
tryClick();
var cc=0,mch=CFG.postSubmitCheckMax;
function cLoop(){
if(finishCalled||S.get('hardStop')==='1'||submitted){submitRunning=false;return;}
cc++;
var res=checkSubmitResult();
if(res==='success'){submitRunning=false;finishSuccess('success');return;}
if(res==='error'){
S.set('confirmed','0');
fillDone=false;
submitRunning=false;
stopValueWatchdog();
var i2=findCodeInputCached();
if(i2)nativeSetValue(i2,'');
setTimeout(function(){fillAndConfirm(true);},500);
return;
}
if(cc<mch)setTimeout(cLoop,CFG.postSubmitCheckMs);
else{submitRunning=false;finishSuccess('timeout');}
}
setTimeout(cLoop,150);
},30);
}else{
stopValueWatchdog();
fillRetries++;
if(fillRetries<CFG.fillRetryMax)setTimeout(function(){fillAndConfirm(true);},400);
}
});
}
waitInp();
return true;
}

function handleTarget(){
if(isGtraffic||isGoogle||isDichvuTask||isRobuxReward)return Promise.resolve();
if(S.get('pendingAutoReset')==='1')return Promise.resolve();
var st=getState();
if((st===STATE.GOOGLE_SEARCH||st===STATE.GOOGLE_CLICK)&&isRealTargetPage()){setState(STATE.SCAN_BTN);return Promise.resolve();}
if(st===STATE.SCAN_BTN){
var sa=parseInt(S.get('stateSetAt','0'),10);
var sc=Date.now()-sa;
if(sc<CFG.gBtnDelayMs){
var rem=Math.ceil((CFG.gBtnDelayMs-sc)/1000);
if(IS_TOP&&UI)UI.status.textContent='🎀 Đợi nút g: '+rem+'s 🐱';
return Promise.resolve();
}
var b=findGreenGButton();
if(b){
var lc=parseInt(S.get('lastClickTime','0'),10);
if(Date.now()-lc>120){
S.set('lastClickTime',Date.now().toString());
S.set('btnClickAt',Date.now().toString());
clickBtn(b);
if(IS_TOP&&UI)UI.status.textContent='🎀 Đã click nút g! 🐱';
setState(STATE.WAIT_COUNTDOWN);
}
}
return Promise.resolve();
}
if(st===STATE.WAIT_COUNTDOWN){
var cd=readCountdown();
if(cd){
var t=parseInt(S.get('serverTotalSec','0'),10);
if(cd.sec>t){t=cd.sec;S.set('serverTotalSec',t.toString());}
if(t===0)t=cd.sec||CFG.defaultCountdown;
if(IS_TOP){
showTimer(cd.sec,t,'B5: CHỜ '+cd.sec+'s');
if(UI&&UI.timer)UI.timer.classList.add('show');
}
S.set('lastServerSec',cd.sec.toString());
if(cd.sec===0){setState(STATE.GET_CODE);return Promise.resolve();}
return Promise.resolve();
}
var b2=cachedBtn||findGreenGButton();
if(b2){
var bt2=(b2.textContent||'').replace(/\s+/g,'').trim();
if(bt2.length===8&&/^[A-Za-z0-9]+$/.test(bt2)&&!isBlacklistedCode(bt2)&&isValidCodeShape(bt2)){setState(STATE.GET_CODE);return Promise.resolve();}
}
if(IS_TOP&&UI){
UI.status.textContent='🎀 Đợi nút g bắt đầu đếm... 🐱';
if(UI.timer)UI.timer.classList.remove('show');
}
var wsa=parseInt(S.get('stateSetAt','0'),10);
if(Date.now()-wsa>90000){setState(STATE.GET_CODE);}
return Promise.resolve();
}
if(st===STATE.GET_CODE){
var a=parseInt(S.get('codeAttempts','0'),10);
a++;
S.set('codeAttempts',a.toString());
var code=extractCode();
if(code){
saveCode(code);
if(IS_TOP){
showCode(code);
try{showGifOverlay(1500);}catch(e){}
try{showToast('🎀 ĐÃ LẤY MÃ: '+code+' 🐱',3000);}catch(e){}
}
try{
S.set('state',STATE.BACK_GTRAFFIC);
S.set('stateSetAt',Date.now().toString());
S.set('inFlow','1');
}catch(e){}
setState(STATE.BACK_GTRAFFIC);
setTimeout(function(){
goBackToGtraffic();
setTimeout(function(){try{window.close();}catch(e){}},100);
},200);
}
return Promise.resolve();
}
if(st===STATE.BACK_GTRAFFIC){
if(S.get('navigatingBack')==='1')return Promise.resolve();
goBackToGtraffic();
return Promise.resolve();
}
return Promise.resolve();
}

function findCreateLinkButton(){
var all=document.querySelectorAll('button, a, div[role="button"], input[type="submit"], input[type="button"], .btn');
var best=null,bestScore=-1;
for(var i=0;i<all.length;i++){
var el=all[i];
if(el.closest&&el.closest('#tt-root'))continue;
if(el.closest&&el.closest('#tt-fab'))continue;
if(el.closest&&el.closest('#shortlinkModal'))continue;
if(el.closest&&el.closest('.Toastify__toast-container'))continue;
var r=el.getBoundingClientRect();
if(r.width<80||r.height<25)continue;
if(r.width>500)continue;
var txt=(el.textContent||el.value||'').replace(/\s+/g,' ').trim();
if(!txt||txt.length>30)continue;
var sc=0,lc=txt.toLowerCase();
if(lc==='tạo link')sc+=500;
else if(lc==='tao link')sc+=480;
else if(lc.indexOf('tạo link')!==-1)sc+=400;
else if(lc.indexOf('tao link')!==-1)sc+=380;
else if(lc.indexOf('create link')!==-1)sc+=350;
else if(lc.indexOf('get link')!==-1)sc+=300;
else if(lc.indexOf('nhận link')!==-1)sc+=300;
else continue;
if(el.tagName==='BUTTON')sc+=100;
if(el.tagName==='A')sc+=50;
if(sc>bestScore){bestScore=sc;best=el;}
}
return best;
}

function findVuotLinkButton(){
var m=document.getElementById('shortlinkModal');
if(!m)return null;
if(!isShortlinkModalVisible())return null;
try{
var g=m.querySelector('#shortlinkGoBtn');
if(g&&!g.__dichvuClicked){
var r=g.getBoundingClientRect();
if(r.width>=40&&r.height>=20)return g;
}
}catch(e){}
return null;
}

function findVuotLinkOutsideCard(){
var all=document.querySelectorAll('button, a');
for(var i=0;i<all.length;i++){
var el=all[i];
if(el.closest&&el.closest('#shortlinkModal'))continue;
if(el.closest&&el.closest('#tt-root'))continue;
if(el.closest&&el.closest('#tt-fab'))continue;
if(el.disabled||el.__dichvuClicked)continue;
var txt=(el.textContent||'').trim().toLowerCase();
if(txt!=='vượt link'&&txt!=='vuot link')continue;
var r=el.getBoundingClientRect();
if(r.width<60||r.height<20)continue;
var bg=getBgRGBA(el);
var g=bg&&bg.g>150&&bg.g>bg.r&&bg.g>bg.b;
var cls=(el.className||'').toString().toLowerCase();
if(g||cls.indexOf('btn-success')!==-1)return el;
}
return null;
}

function isShortlinkModalVisible(){
try{
var m=document.getElementById('shortlinkModal');
if(!m)return false;
if(m.classList&&m.classList.contains('show'))return true;
var st=window.getComputedStyle(m);
if(st.display!=='none'&&st.visibility!=='hidden'&&parseFloat(st.opacity)>0.5)return true;
var inp=document.getElementById('shortlinkUrl');
if(inp&&inp.value&&inp.value.length>5)return true;
}catch(e){}
return false;
}

function extractTargetUrl(g){
if(!g)return '';
var url='';
try{
if(g.tagName==='A'&&g.href)url=g.href;
if(!url){var a=g.querySelector('a[href]');if(a&&a.href)url=a.href;}
if(!url&&g.getAttribute)url=g.getAttribute('data-href')||g.getAttribute('data-url')||g.getAttribute('href')||'';
}catch(e){}
return url||'';
}

function dichvuSafeClickOnce(el){
if(!el)return false;
if(el.__dichvuClicked)return false;
el.__dichvuClicked=true;
try{el.scrollIntoView({behavior:'instant',block:'center'});}catch(e){}
try{el.click();return true;}catch(e){}
return false;
}

function dichvuHardStopAll(){
stopRequested=true;
loopRunning=false;
finishCalled=true;
submitted=true;
if(dichvuTaskTimer){try{clearInterval(dichvuTaskTimer);}catch(e){}dichvuTaskTimer=null;}
if(loopTimer){try{clearTimeout(loopTimer);}catch(e){}loopTimer=null;}
if(gtrafficCheckTimer){try{clearInterval(gtrafficCheckTimer);}catch(e){}gtrafficCheckTimer=null;}
if(watchdogTimer){try{clearInterval(watchdogTimer);}catch(e){}watchdogTimer=null;}
if(getLinkPollTimer){try{clearInterval(getLinkPollTimer);}catch(e){}getLinkPollTimer=null;}
if(pollChildTimer){try{clearInterval(pollChildTimer);}catch(e){}pollChildTimer=null;}
}

function ensureOnDichvuTaskPage(){
if(!isDichvuTask)return false;
var path=location.pathname;
if(path.indexOf(CFG.dichvuTaskPath)===0||path.indexOf('/client/vuot-link')!==-1)return true;
if(UI&&UI.status)UI.status.textContent='🎀 Đang vào trang nhận NV... 🐱';
setTimeout(function(){try{location.href=CFG.dichvuTaskPath;}catch(e){}},800);
return false;
}

function handleDichvuTask(){
if(!isDichvuTask)return Promise.resolve();
if(isCloudflareChallengePage()){handleCloudflareChallenge();return Promise.resolve();}
if(!ensureOnDichvuTaskPage())return Promise.resolve();
if(S.get('pendingAutoReset')==='1')return Promise.resolve();
if(DICHVU_LOCK.isLocked())return Promise.resolve();
if(dichvuTabOpened||dichvuGoClicked)return Promise.resolve();
var curUrl=location.href;
var urlLocked=DICHVU_URLS.has(curUrl);
if(isShortlinkModalVisible()){
var g=findVuotLinkButton();
if(g){
var tu=extractTargetUrl(g);
DICHVU_LOCK.lock();
dichvuGoClicked=true;
dichvuTabOpened=true;
dichvuDone=true;
S.set('dichvuStage','clicked_go');
dichvuHardStopAll();
setState(STATE.IDLE);
S.set('inFlow','0');
if(tu&&/^https?:\/\//i.test(tu)){
if(UI)UI.status.textContent='🎀 Mở tab gtraffic mới 🐱';
setTimeout(function(){
try{
var nt=window.open(tu,'_blank');
if(!nt)try{location.href=tu;}catch(e){}
}catch(e){try{location.href=tu;}catch(e2){}}
},100);
}else{
dichvuArmOpenGuard();
dichvuSafeClickOnce(g);
}
return Promise.resolve();
}
return Promise.resolve();
}
if(urlLocked||dichvuCreateClicked){
if(dichvuOutsideClicked&&(Date.now()-dichvuOutsideClickedAt)<CFG.dichvuOutsideCooldownMs)return Promise.resolve();
var ob=findVuotLinkOutsideCard();
if(ob){
dichvuOutsideClicked=true;
dichvuOutsideClickedAt=Date.now();
dichvuSafeClickOnce(ob);
return Promise.resolve();
}
return Promise.resolve();
}
if(DICHVU_LOCK.isCreateLocked())return Promise.resolve();
if(dichvuCreateClicked&&(Date.now()-dichvuLastCreateAt)<CFG.dichvuClickCooldownMs)return Promise.resolve();
var cb=findCreateLinkButton();
if(cb){
DICHVU_LOCK.lockCreate();
DICHVU_URLS.add(curUrl);
S.set('dichvuStage','clicked_create');
S.set('dichvuClickAt',Date.now().toString());
dichvuCreateClicked=true;
dichvuLastCreateAt=Date.now();
setTimeout(function(){dichvuSafeClickOnce(cb);},200);
}
return Promise.resolve();
}

function findGtrafficCard(){
var grid=document.getElementById('linkGrid');
if(!grid)return null;
var allCards=grid.querySelectorAll('*');
var best=null,bestScore=-1;
for(var i=0;i<allCards.length;i++){
var el=allCards[i];
var txt=(el.textContent||'').toLowerCase().trim();
if(txt.indexOf('gtraffic')===-1&&txt.indexOf('g traffic')===-1)continue;
var rect=el.getBoundingClientRect();
if(rect.width<100||rect.width>700)continue;
if(rect.height<30||rect.height>300)continue;
var sc=0;
var ownText='';
for(var j=0;j<el.childNodes.length;j++)if(el.childNodes[j].nodeType===3)ownText+=el.childNodes[j].textContent;
if(ownText.toLowerCase().indexOf('gtraffic')!==-1)sc+=500;
try{if(window.getComputedStyle(el).cursor==='pointer')sc+=200;}catch(e){}
if(el.tagName==='DIV'&&txt.length<100)sc+=150;
var cls=(el.className||'').toString().toLowerCase();
if(cls.indexOf('link')!==-1)sc+=100;
if(cls.indexOf('card')!==-1)sc+=100;
if(cls.indexOf('item')!==-1)sc+=80;
if(rect.width>0&&rect.height>0)sc+=50;
if(sc>bestScore){bestScore=sc;best=el;}
}
return best;
}

function findOpenButtonInModal(){
var mo=document.getElementById('mo');
if(!mo)return null;
try{
var st=window.getComputedStyle(mo);
if(st.display==='none'||st.visibility==='hidden')return null;
if(parseFloat(st.opacity)<0.1)return null;
}catch(e){}
var openBtn=mo.querySelector('button[onclick*="openLink"], .cb[onclick*="openLink"]');
if(openBtn)return openBtn;
var cbBtns=mo.querySelectorAll('.cb');
for(var i=0;i<cbBtns.length;i++){
var txt=(cbBtns[i].textContent||'').trim().toLowerCase();
if(txt==='mở'||txt==='mo'||txt==='open')return cbBtns[i];
}
var linkBox=mo.querySelector('.link-box');
if(linkBox){
var btns=linkBox.querySelectorAll('button');
for(var j=0;j<btns.length;j++){
var t2=(btns[j].textContent||'').trim().toLowerCase();
if(t2==='mở'||t2==='mo'||t2==='open')return btns[j];
}
}
var allBtns=mo.querySelectorAll('button, a');
for(var k=0;k<allBtns.length;k++){
var t3=(allBtns[k].textContent||'').trim().toLowerCase();
if(t3==='mở'||t3==='mo'||t3==='open')return allBtns[k];
}
return null;
}

function ensureOnEarnPage(){
if(!isRobuxReward)return false;
var path=location.pathname;
if(path==='/earn'||path.indexOf('/earn')===0)return true;
if(path.indexOf('/claim')===0)return false;
if(UI&&UI.status)UI.status.textContent='🎀 Chuyển sang trang Kiếm Coin... 🐱';
setTimeout(function(){try{location.href='/earn';}catch(e){}},500);
return false;
}

function handleRobuxClaim(){
if(!isRobuxReward||!IS_TOP)return Promise.resolve();
if(location.pathname.indexOf('/claim')!==0)return Promise.resolve();
if(robuxClaimStartAt===0){
robuxClaimStartAt=Date.now();
robuxClaimDone=false;
if(UI)UI.status.textContent='🎀 Đang claim coin... 🐱';
}
if(robuxClaimDone)return Promise.resolve();
var bodyLc=((document.body&&document.body.innerText)||'').toLowerCase();
var successSignals=['nhận coin thành công','claimed successfully','thành công!','coin đã được cộng'];
var errorSignals=['key đã được sử dụng','key already used','key đã hết hạn','key expired','key không hợp lệ','invalid key'];
var isSuccess=false,isError=false;
for(var i=0;i<successSignals.length;i++)if(bodyLc.indexOf(successSignals[i])!==-1){isSuccess=true;break;}
for(var j=0;j<errorSignals.length;j++)if(bodyLc.indexOf(errorSignals[j])!==-1){isError=true;break;}
var earnLink=document.querySelector('a[href="/earn"]');
if(earnLink&&(isSuccess||isError)){
robuxClaimDone=true;
if(isSuccess){
if(UI)UI.status.textContent='🎀 Claim thành công! Đang về /earn... 🐱';
try{showGifOverlay(1500);}catch(e){}
}
setTimeout(function(){
try{
if(earnLink)earnLink.click();
else location.href='/earn';
}catch(e){try{location.href='/earn';}catch(e2){}}
},1500);
return Promise.resolve();
}
if(UI)UI.status.textContent='🎀 Đang claim coin... 🐱';
if(Date.now()-robuxClaimStartAt>30000){
robuxClaimDone=true;
try{location.href='/earn';}catch(e){}
}
return Promise.resolve();
}

function handleRobuxTask(){
if(!isRobuxReward||!IS_TOP)return Promise.resolve();
if(!ensureOnEarnPage())return Promise.resolve();
if(S.get('robuxWaitingGtraffic')==='1'){
if(robuxGtrafficTabRef&&robuxGtrafficTabRef.closed){
S.set('robuxWaitingGtraffic','0');
robuxGtrafficTabRef=null;
robuxTaskRunning=false;
robuxModalOpenedAt=0;
setTimeout(function(){try{handleRobuxTask();}catch(e){}},2000);
}
return Promise.resolve();
}
if(Date.now()-robuxLastClickAt<CFG.robuxCooldownMs)return Promise.resolve();
var mo=document.getElementById('mo');
if(mo&&window.getComputedStyle(mo).display!=='none'){
var ob=findOpenButtonInModal();
if(ob){
robuxLastClickAt=Date.now();
robuxModalOpenedAt=0;
var clicked=false;
try{
if(typeof window.openLink==='function'){window.openLink();clicked=true;}
}catch(e){}
if(!clicked){
try{ob.click();}catch(e){}
try{ob.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,button:0}));}catch(e){}
}
S.set('robuxWaitingGtraffic','1');
if(UI&&UI.status)UI.status.textContent='🎀 Đã mở tab gtraffic... 🐱';
try{if(childTabRef)robuxGtrafficTabRef=childTabRef;}catch(e){}
return Promise.resolve();
}
if(UI&&UI.status)UI.status.textContent='🐱 Đang tìm nút Mở trong modal... 🎀';
return Promise.resolve();
}else if(robuxModalOpenedAt!==0)robuxModalOpenedAt=0;
var card=findGtrafficCard();
if(card){
robuxLastClickAt=Date.now();
try{
try{card.scrollIntoView({behavior:'instant',block:'center'});}catch(e){}
card.click();
if(UI&&UI.status)UI.status.textContent='🎀 Đã click Gtraffic — chờ modal 🐱';
}catch(e){}
}else if(UI&&UI.status)UI.status.textContent='🐱 Tìm Gtraffic... 🎀';
return Promise.resolve();
}

function loop(){
if(loopRunning||stopRequested)return;
if(S.get('pendingAutoReset')==='1')return;
loopRunning=true;
var i=0;
var tick=function(){
if(stopRequested){loopRunning=false;return;}
if(S.get('pendingAutoReset')==='1'){loopRunning=false;return;}
if(S.get('waitingGetLink')==='1'){loopTimer=setTimeout(tick,2);return;}
if(S.get('hardStop')==='1'){loopRunning=false;return;}
if(finishCalled){loopRunning=false;return;}
if(isDichvuTask&&DICHVU_LOCK.isLocked()){loopRunning=false;return;}
i++;
if(i>=999999){loopRunning=false;return;}
if(!shouldToolRunOnThisPage()){resetAllState();loopRunning=false;return;}
try{watchdog();}catch(e){}
var p,nd=CFG.poll;
if(isDichvuTask){p=handleDichvuTask();nd=CFG.dichvuTaskPoll;}
else if(isRobuxReward&&IS_TOP&&location.pathname.indexOf('/claim')===0){p=handleRobuxClaim();nd=1000;}
else if(isRobuxReward&&IS_TOP){p=handleRobuxTask();nd=CFG.robuxPollMs;}
else if(isGoogle&&IS_TOP){p=handleGoogle();nd=CFG.googlePoll;}
else if(isGtraffic&&IS_TOP){p=handleGtraffic();nd=CFG.poll;}
else{p=handleTarget();nd=CFG.targetPoll;}
p.catch(function(e){log('Loi: '+e.message);}).then(function(){
if(getState()===STATE.DONE&&IS_TOP&&S.get('waitingGetLink')!=='1'){loopRunning=false;return;}
if(S.get('hardStop')==='1'&&S.get('waitingGetLink')!=='1'){loopRunning=false;return;}
if(isDichvuTask&&DICHVU_LOCK.isLocked()){loopRunning=false;return;}
loopTimer=setTimeout(tick,nd);
});
};
tick();
}

function handleGtraffic(){
if(!IS_TOP||!isGtraffic)return Promise.resolve();
if(S.get('pendingAutoReset')==='1')return Promise.resolve();
if(S.get('waitingGetLink')==='1')return Promise.resolve();
if(S.get('getLinkClicked')!=='1'){
var b=findGetLinkButton();
if(b){doImmediateAutoReset();clickGetLinkButton(b);}
}
return Promise.resolve();
}

function startGtrafficObserver(){
if(!IS_TOP||!isGtraffic)return;
if(gtrafficCheckTimer)return;
gtrafficCheckTimer=setInterval(function(){
if(S.get('pendingAutoReset')==='1'||S.get('waitingGetLink')==='1'||S.get('hardStop')==='1'||finishCalled||submitted||stopRequested||S.get('confirmed')==='1'||getState()===STATE.DONE){
clearInterval(gtrafficCheckTimer);
gtrafficCheckTimer=null;
return;
}
var code=getCodeFromPanel()||loadCode();
if(!code||!isValidCodeShape(code)||isBlacklistedCode(code))return;
var inp=findCodeInputCached();
if(!inp)return;
var cv=(nativeGetValue(inp)||'').trim();
if(cv===''&&!fillRunning&&!submitRunning){
fillDone=false;
fillRunning=false;
fillAndConfirm(true);
}
},250);
}

function startChildPoller(){
if(pollChildTimer){try{clearInterval(pollChildTimer);}catch(e){}pollChildTimer=null;}
pollChildTimer=setInterval(function(){
if(S.get('pendingAutoReset')==='1'){clearInterval(pollChildTimer);pollChildTimer=null;return;}
var code=loadCode();
if(code&&isValidCodeShape(code)&&!isBlacklistedCode(code)){
clearInterval(pollChildTimer);
pollChildTimer=null;
try{window.focus();}catch(e){}
fillAndConfirm(true);
}
if(childTabRef&&childTabRef.closed){
childTabRef=null;
S.set('childTabOpen','0');
setTimeout(function(){
var c=loadCode();
if(c&&isValidCodeShape(c)&&!isBlacklistedCode(c))fillAndConfirm(true);
else{S.set('inFlow','0');if(UI)UI.status.textContent='🎀 Không lấy được mã 🐱';}
},1000);
clearInterval(pollChildTimer);
pollChildTimer=null;
}
},500);
}

function autoFillAndStart(){
if(!IS_TOP||!isGtraffic)return false;
if(getState()!==STATE.IDLE)return false;
if(S.get('pendingAutoReset')==='1')return false;
if(S.get('inFlow')==='1')return false;
log('AUTO-FILL: ★ BAT DAU ★');
if(UI&&UI.status)UI.status.textContent='🎀 Đang OCR keyword... 🐱';
scanDichvuKeyword().then(function(keyword){
if(!keyword){if(UI&&UI.status)UI.status.textContent='🎀 OCR không đọc được 🐱';return;}
var domain=KEYWORD_MAP.lookup(keyword);
if(!domain){
if(UI&&UI.status)UI.status.textContent='🎀 Keyword: '+keyword+' — chưa có domain 🐱';
if(UI&&UI.kwInput)UI.kwInput.value=keyword;
return;
}
var fa=0,maxFa=40;
function tryFill(){
fa++;
if(!(UI&&UI.domainInput&&UI.startBtn)){if(fa<maxFa)setTimeout(tryFill,150);return;}
try{UI.domainInput.value=domain;}catch(e){}
try{if(UI.keywordInput)UI.keywordInput.value=keyword;}catch(e){}
try{renderDomainList();}catch(e){}
try{DOMAINS.save(domain);}catch(e){}
setTimeout(function(){try{if(UI&&UI.startBtn)UI.startBtn.click();}catch(e){}},250);
}
tryFill();
});
return true;
}

// ★ UI BUILD (giữ nguyên - đã có trong phần 1, gọi lại khi boot)
var UI={};

if(!shouldToolRunOnThisPage())return;

function boot(){
if(!shouldToolRunOnThisPage()){
var o=document.getElementById('tt-root');if(o)o.remove();
var f=document.getElementById('tt-fab');if(f)f.remove();
return;
}
if(isCloudflareChallengePage()){
setTimeout(function(){try{handleCloudflareChallenge();}catch(e){}},500);
return;
}
var hpr=(S.get('pendingAutoReset')==='1');
if(hpr){
try{
var sd=S.get('savedDomains','[]');
var cr=S.get('code','');
var km=S.get('keywordMap','[]');
var cbl=S.get('customBlacklist','[]');
S.resetFull();
try{S.set('savedDomains',sd);}catch(e){}
try{S.set('keywordMap',km);}catch(e){}
try{S.set('customBlacklist',cbl);}catch(e){}
if(cr&&isValidCodeShape(cr)&&!isBlacklistedCode(cr))try{S.set('code',cr);}catch(e){}
try{S.del('codeHardLock');}catch(e){}
try{S.set('state',STATE.IDLE);}catch(e){}
try{S.set('inFlow','0');}catch(e){}
}catch(e){}
}
var la=parseInt(S.get('leavingAt','0'),10);
if(la>0){
var e=Date.now()-la;
if(e>300000&&S.get('inFlow')!=='1'&&!loadCode())resetAllState(true);
S.del('leavingAt');
}
if(IS_TOP)buildPanel();
if(hpr){
try{S.set('state',STATE.IDLE);}catch(e){}
try{S.set('inFlow','0');}catch(e){}
try{S.del('pendingAutoReset');}catch(e){}
if(IS_TOP&&UI){
if(UI.domainInput)UI.domainInput.value='';
if(UI.keywordInput)UI.keywordInput.value='';
if(UI.status)UI.status.textContent='🎀 Sẵn sàng 🐱';
if(UI.code)UI.code.classList.remove('show');
if(UI.codeVal)UI.codeVal.textContent='----';
}
if(IS_TOP)startLeaveDetector();
return;
}
var st=getState();
var code=S.get('code','');
if(isDichvuTask){
var dv=S.get('dichvuStage','');
if(dv==='clicked_create'){
DICHVU_LOCK.lockCreate();
dichvuCreateClicked=true;
dichvuLastCreateAt=parseInt(S.get('dichvuClickAt','0'),10)||Date.now();
}
var cu=location.href;
if(DICHVU_URLS.has(cu)){
DICHVU_LOCK.lockCreate();
dichvuCreateClicked=true;
dichvuLastCreateAt=parseInt(S.get('dichvuClickAt','0'),10)||Date.now();
}
if(st!==STATE.DICHVU_TASK)setState(STATE.DICHVU_TASK);
if(IS_TOP&&UI)UI.status.textContent=dichvuCreateClicked?'🎀 Đã tạo NV — chờ link 🐱':'🎀 Auto nhận NV... 🐱';
var curPath=location.pathname;
if(curPath.indexOf(CFG.dichvuTaskPath)!==0&&curPath.indexOf('/client/vuot-link')===-1){
if(IS_TOP&&UI)UI.status.textContent='🎀 Đang vào trang nhận NV... 🐱';
setTimeout(function(){try{location.href=CFG.dichvuTaskPath;}catch(e){}},1500);
return;
}
startLeaveDetector();
loop();
return;
}
if(isRobuxReward&&IS_TOP){
var cp=location.pathname;
if(cp.indexOf('/claim')===0){
robuxClaimStartAt=Date.now();
robuxClaimDone=false;
if(UI)UI.status.textContent='🎀 Đang claim coin... 🐱';
startLeaveDetector();
setTimeout(function(){loop();},500);
return;
}
if(cp!=='/earn'&&cp.indexOf('/earn')!==0){
if(UI)UI.status.textContent='🎀 Đang chuyển sang Kiếm Coin... 🐱';
setTimeout(function(){try{location.href='/earn';}catch(e){}},1500);
return;
}
if(S.get('robuxWaitingGtraffic')==='1'){
if(UI)UI.status.textContent='🐱 Đang chờ tab gtraffic... 🎀';
}
startLeaveDetector();
setTimeout(function(){loop();},2000);
return;
}
if(isRealTargetPage()&&(st===STATE.GOOGLE_SEARCH||st===STATE.GOOGLE_CLICK))setState(STATE.SCAN_BTN);
if(isGtraffic){
try{
var cgu=location.href.split('?')[0].split('#')[0];
var lgu=S.get('lastGtrafficUrl','');
if(lgu&&lgu!==cgu){
log('★ GTRAFFIC URL DOI MOI');
S.resetFull();
try{S.del('goBackFired');}catch(e){}
stopRequested=false;loopRunning=false;fillRunning=false;submitRunning=false;
finishCalled=false;fillDone=false;submitted=false;fillRetries=0;codeShown=false;
getLinkClickDone=false;getLinkStartAt=0;googleClicked=false;wasOnValidPage=true;
cachedInput=null;cachedInputTime=0;cachedConfirm=null;cachedConfirmTime=0;cachedBtn=null;cachedBtnTime=0;
if(gtrafficCheckTimer){try{clearInterval(gtrafficCheckTimer);}catch(e){}gtrafficCheckTimer=null;}
if(loopTimer){try{clearTimeout(loopTimer);}catch(e){}loopTimer=null;}
if(UI&&UI.root)UI.root.remove();
if(IS_TOP)buildPanel();
if(UI&&UI.status)UI.status.textContent='🎀 Trang mới — đang OCR... 🐱';
}
try{S.set('lastGtrafficUrl',cgu);}catch(e){}
}catch(e){}
setTimeout(function(){try{autoFillAndStart();}catch(e){}},CFG.autoFillDelayMs);
if(st===STATE.BACK_GTRAFFIC){S.del('navigatingBack');S.set('backDone','1');}
var cip=getCodeFromPanel();
var cfs=loadCode();
var hc=!!(cip||cfs);
var wl=(S.get('waitingGetLink')==='1');
var iff=(S.get('inFlow')==='1');
var co=(S.get('childTabOpen')==='1');
if(wl&&!hc){if(IS_TOP)refreshStatus();startWaitingForGetLink();startLeaveDetector();return;}
if(co&&!hc){if(IS_TOP)UI.status.textContent='🎀 Chờ mã từ tab con... 🐱';startChildPoller();startLeaveDetector();return;}
if(hc||iff){
if(hc){
try{S.del('confirmed');}catch(e){}
try{S.del('hardStop');}catch(e){}
try{S.del('waitingGetLink');}catch(e){}
fillDone=false;fillRunning=false;submitRunning=false;finishCalled=false;submitted=false;fillRetries=0;codeShown=false;
stopValueWatchdog();
unpatchInput();
}
setState(STATE.FILL_CODE);
if(IS_TOP&&!codeShown){
var sw=cip||cfs;
if(sw&&isValidCodeShape(sw)&&!isBlacklistedCode(sw)){
codeShown=true;
UI.code.classList.add('show');
UI.codeVal.textContent=sw;
saveCode(sw);
}
}
if(IS_TOP)refreshStatus();
startLeaveDetector();
fillAndConfirm(true);
startGtrafficObserver();
loop();
return;
}
if(st!==STATE.IDLE)setState(STATE.IDLE);
if(IS_TOP)refreshStatus();
startLeaveDetector();
return;
}
if(isGoogle){
if(st===STATE.GOOGLE_SEARCH||st===STATE.GOOGLE_CLICK){
startGoogleObserver();
if(IS_TOP)refreshStatus();
startLeaveDetector();
loop();
return;
}
if(IS_TOP)refreshStatus();
startLeaveDetector();
return;
}
if(isRealTargetPage()){
if(st===STATE.SCAN_BTN||st===STATE.WAIT_COUNTDOWN||st===STATE.GET_CODE||st===STATE.GOOGLE_SEARCH||st===STATE.GOOGLE_CLICK){
if(st===STATE.GOOGLE_SEARCH||st===STATE.GOOGLE_CLICK)setState(STATE.SCAN_BTN);
if(IS_TOP)refreshStatus();
startLeaveDetector();
loop();
return;
}
if(IS_TOP)refreshStatus();
startLeaveDetector();
return;
}
if(IS_TOP)refreshStatus();
if(IS_TOP&&code&&!codeShown){
codeShown=true;
UI.code.classList.add('show');
UI.codeVal.textContent=code;
}
if(st===STATE.DONE&&S.get('waitingGetLink')!=='1'){stopAll();startLeaveDetector();return;}
if(st&&st!==STATE.IDLE)loop();
startLeaveDetector();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();

})();
// ===== END v49.3.1 - PHẦN 2 HOÀN TẤT =====
