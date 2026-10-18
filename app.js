/* global firebase, sets */
// --- KẾT NỐI VÀ ĐỒNG BỘ DỮ LIỆU FIREBASE ---
var firebaseConfig = {
  apiKey: "AIzaSyCX_30nYbSoKmyyLBQBjTW_0K1zTUnm6CU",
  authDomain: "muy-flashcards.firebaseapp.com",
  projectId: "muy-flashcards",
  storageBucket: "muy-flashcards.firebasestorage.app",
  messagingSenderId: "745907745384",
  appId: "1:745907745384:web:826faa570f76bcfdeec1dd",
  measurementId: "G-L72QT1NLPH"
};

var db = null;
try {
  if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  }
} catch (e) { console.warn("Lỗi Firebase:", e); }

var storageKey = "marginalia-sat-progress-v2";
var activeSetStorageKey = "marginalia-sat-active-set-v1";
var voiceSettingsStorageKey = "sat-vocab-voice-settings-v1";
var themeStorageKey = "sat-vocab-theme-v1";

var allSets = (typeof sets !== "undefined" && Array.isArray(sets)) ? sets : [];
var setsById = new Map();
allSets.forEach(function(set) { setsById.set(set.id, set); });

var flashcard = document.querySelector("#flashcard");
var studyView = document.querySelector("#study-view");
var homeView = document.querySelector("#home-view");
var wordsView = document.querySelector("#words-view");
var testView = document.querySelector("#test-view");
var gameView = document.querySelector("#game-view");
var supportsSpeech = "speechSynthesis" in window;

var activeSetId = loadActiveSet();
var statusBySet = loadProgress();
var statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
var activeCategory = "all";
var voiceSettings = loadVoiceSettings();
var availableVoices = [];

// --- BIẾN STUDY MODE ---
var studyQueue = [];
var currentCardObj = null;
var totalCardsInSession = 0;
var completedCardsInSession = 0;
var waitingInterval = null;
var currentOrderMode = "alphabetical"; 
var sessionReviewWords = {};
var sessionRememberedWords = {};
var cardsSeenInSession = {}; 

// --- BIẾN TEST MODE ---
var testQuestions = []; 
var testMode = "meaning-word";

// --- BIẾN GAME CROSSWORD ---
var cwGridData = {}; 
var cwWordsPlaced = []; 
var cwCurrentDir = "H"; 
var cwCurrentWordId = null;

// ==========================================
// CÁC HÀM TIỆN ÍCH VÀ THIẾT LẬP
// ==========================================
function activeSet() { return setsById.get(activeSetId) || allSets[0] || { id: "default", name: "Empty", cards: [] }; }
function loadActiveSet() {
  try { return setsById.has(localStorage.getItem(activeSetStorageKey)) ? localStorage.getItem(activeSetStorageKey) : (allSets[0] ? allSets[0].id : "essentials"); } 
  catch (e) { return allSets[0] ? allSets[0].id : "essentials"; }
}
function loadVoiceSettings() {
  var d = { gender: "female", speed: "normal", onCard: true, onFlip: true };
  try {
    var s = JSON.parse(localStorage.getItem(voiceSettingsStorageKey));
    if (!s) return d;
    return { gender: s.gender||d.gender, speed: s.speed||d.speed, onCard: s.onCard!==false, onFlip: s.onFlip!==false };
  } catch (e) { return d; }
}
function saveVoiceSettings() { try { localStorage.setItem(voiceSettingsStorageKey, JSON.stringify(voiceSettings)); } catch (e) {} }
function applyTheme(theme) {
  var t = (theme==="green"||theme==="red"||theme==="graphite") ? theme : "green";
  document.documentElement.dataset.theme = t;
  var sel = document.querySelector("#theme-select"); if (sel) sel.value = t;
  try { localStorage.setItem(themeStorageKey, t); } catch (e) {}
}
function loadTheme() { try { return localStorage.getItem(themeStorageKey) || "green"; } catch (e) { return "green"; } }
function refreshVoices() { if (supportsSpeech) { availableVoices = window.speechSynthesis.getVoices(); updateVoiceNote(); } }
function preferredVoice() {
  var en = availableVoices.filter(function(v) { return v.lang.toLowerCase().indexOf("en") === 0; });
  var pat = voiceSettings.gender === "female" ? /\b(female|woman|zira|samantha|victoria|karen|moira|tessa|susan|aria|jenny|linda|amy|allison|ava)\b/i : /\b(male|man|david|alex|daniel|james|guy|ryan|fred|tom|george|mark|aaron|arthur|oliver|lee|thomas)\b/i;
  for(var i=0; i<en.length; i++) if(pat.test(en[i].name)) return en[i];
  return en[0] || null;
}
function updateVoiceNote() { var n = document.querySelector("#voice-note"); if(n) n.textContent = preferredVoice() ? "Using " + preferredVoice().name : "No English voice is available yet."; }
function speakWord(word) {
  if (!supportsSpeech || !word) return false;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(word);
  var v = preferredVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
  u.rate = voiceSettings.speed === "slow" ? 0.72 : 1;
  window.speechSynthesis.speak(u);
  return true;
}
function loadProgress() {
  try {
    var s = JSON.parse(localStorage.getItem(storageKey));
    if (s && typeof s === "object") {
      var r = {};
      allSets.forEach(function(set) {
        var w = {}; set.cards.forEach(function(c){ w[c.word]=true; });
        var st = s[set.id] || {}; var f = {};
        for (var k in st) if (w[k] && (st[k]==="review"||st[k]==="remembered")) f[k]=st[k];
        r[set.id] = f;
      });
      return r;
    }
  } catch (e) {}
  var res={}; if(allSets[0]) res[allSets[0].id]={}; return res;
}
function saveProgress() { try { localStorage.setItem(storageKey, JSON.stringify(statusBySet)); } catch (e) {} }
function currentWord() {
  if (!currentCardObj) return null;
  var c = activeSet().cards;
  for(var i=0; i<c.length; i++) if(c[i].word === currentCardObj.word) return c[i];
  return c[0];
}
function formatCount(c) { return String(c).length<2 ? "0"+c : String(c); }
function highlightWord(sen, word) {
  if (!sen) return [document.createTextNode("")];
  var cw = (word||"").trim(); var pos = sen.toLowerCase().indexOf(cw.toLowerCase()); var len = cw.length;
  if(pos===-1 && cw.length>=3) { pos = sen.toLowerCase().indexOf(cw.slice(0,4).toLowerCase()); len = cw.length; }
  if (pos===-1) return [document.createTextNode(sen)];
  var em = document.createElement("em"); em.textContent = sen.slice(pos, pos+len);
  return [document.createTextNode(sen.slice(0,pos)), em, document.createTextNode(sen.slice(pos+len))];
}
function setCardFace(isF) {
  if (!flashcard) return;
  isF ? flashcard.classList.add("is-flipped") : flashcard.classList.remove("is-flipped");
  var f=document.querySelector("#card-front"), b=document.querySelector("#card-back");
  if(f) f.setAttribute("aria-hidden", String(isF)); if(b) b.setAttribute("aria-hidden", String(!isF));
  if (isF && voiceSettings.onFlip && studyView && !studyView.hidden) { var e=currentWord(); if(e) speakWord(e.word); }
}

// ==========================================
// KHỐI ĐIỀU KHIỂN GIAO DIỆN (ĐÃ PHỤC HỒI)
// ==========================================
function updateSelectDropdowns() {
  document.querySelectorAll(".set-select").forEach(function(select) {
    select.innerHTML = "";
    allSets.forEach(function(set) {
      var option = document.createElement("option");
      option.value = set.id; option.textContent = set.name;
      select.appendChild(option);
    });
    select.value = activeSetId;
  });
  updateTestRangeBounds();
  updateCwRangeBounds();
}

function renderSetProgress() {
  var selectors = [document.querySelector("#study-set-select"), document.querySelector("#words-set-select"), document.querySelector("#test-set-select"), document.querySelector("#cw-set-select")];
  allSets.forEach(function(set) {
    var statuses = statusBySet[set.id] || {};
    var rememberedCount = Object.keys(statuses).filter(function(k) { return statuses[k] === "remembered"; }).length;
    var optionLabel = set.name + " (" + rememberedCount + "/" + set.cards.length + ")";
    selectors.forEach(function(select) {
      if (!select) return;
      var option = select.querySelector("option[value='" + set.id + "']");
      if (option) option.textContent = optionLabel;
    });
  });
  selectors.forEach(function(select) { if (select) select.value = activeSetId; });
  
  var st = statusBySet[activeSetId] || {};
  var rc = Object.keys(st).filter(function(k) { return st[k] === "remembered"; }).length;
  var rvc = Object.keys(st).filter(function(k) { return st[k] === "review"; }).length;
  var sum = rc + " of " + activeSet().cards.length + " remembered · " + rvc + " to review";
  
  if (document.querySelector("#study-set-progress")) document.querySelector("#study-set-progress").textContent = sum;
  if (document.querySelector("#words-set-progress")) document.querySelector("#words-set-progress").textContent = sum;
}

function changeSet(setId) {
  if (!setsById.has(setId) || setId === activeSetId) return;
  activeSetId = setId;
  statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
  try { localStorage.setItem(activeSetStorageKey, activeSetId); } catch (e) {}
  activeCategory = "all";
  document.querySelectorAll(".list-tab").forEach(function(tab) {
    var isActive = tab.dataset.category === "all";
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  updateTestRangeBounds();
  updateCwRangeBounds();
  startStudy();
  renderWords();
  renderHome();
}

function setView(view) {
  if (homeView) homeView.hidden = (view !== "home");
  if (studyView) studyView.hidden = (view !== "study");
  if (wordsView) wordsView.hidden = (view !== "words");
  if (testView) testView.hidden = (view !== "test");
  if (gameView) gameView.hidden = (view !== "game");
  
  document.querySelectorAll(".nav-link").forEach(function(button) {
    var isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  
  if (view === "home") renderHome();
  if (view === "words") renderWords();
  if (view === "test") updateTestRangeBounds();
  if (view === "game") updateCwRangeBounds();
  
  var cardScene = document.querySelector("#card-scene");
  if (view === "study" && voiceSettings.onCard && cardScene && !cardScene.hidden) {
    var entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

// ==========================================
// STUDY MODE (15s/2m)
// ==========================================
function gradeCard(status) {
  if (!currentCardObj) return;
  cardsSeenInSession[currentCardObj.word] = true;
  if (status === "review") {
    sessionReviewWords[currentCardObj.word] = true; delete sessionRememberedWords[currentCardObj.word];
    statusByWord[currentCardObj.word] = "review"; currentCardObj.step = 0; currentCardObj.availableAt = Date.now()+15000;
    studyQueue.push(currentCardObj);
  } else if (status === "remembered") {
    if (currentCardObj.step === 0) {
      currentCardObj.step = 1; currentCardObj.availableAt = Date.now()+120000; studyQueue.push(currentCardObj);
    } else {
      sessionRememberedWords[currentCardObj.word] = true; delete sessionReviewWords[currentCardObj.word];
      statusByWord[currentCardObj.word] = "remembered"; completedCardsInSession++;
    }
  }
  currentCardObj = null; saveProgress(); renderSetProgress(); renderNextCard();
}

function renderNextCard() {
  if (waitingInterval) { clearInterval(waitingInterval); waitingInterval = null; }
  if (studyQueue.length === 0 && !currentCardObj) { showCompletion(); return; }
  var now = Date.now(); var avail = [];
  for (var i=0; i<studyQueue.length; i++) if (studyQueue[i].availableAt <= now) avail.push({c:studyQueue[i], idx:i});
  
  var nIdx = -1;
  if (avail.length > 0) {
     var revs = avail.filter(function(x){ return x.c.availableAt > 0; });
     if(revs.length>0){ revs.sort(function(a,b){return a.c.availableAt - b.c.availableAt;}); nIdx=revs[0].idx; }
     else { nIdx = avail[0].idx; }
  }

  if (nIdx !== -1) {
    document.querySelector("#review-waiting").hidden = true;
    document.querySelector("#card-scene").hidden = false; document.querySelector("#answer-area").hidden = false;
    currentCardObj = studyQueue.splice(nIdx, 1)[0]; renderCard();
  } else {
    currentCardObj = null;
    document.querySelector("#card-scene").hidden = true; document.querySelector("#answer-area").hidden = true;
    document.querySelector("#review-waiting").hidden = false;
    var mT = studyQueue[0].availableAt;
    for (var j=1; j<studyQueue.length; j++) if(studyQueue[j].availableAt<mT) mT=studyQueue[j].availableAt;
    updateCountdown(mT);
    waitingInterval = setInterval(function(){ Date.now()>=mT ? renderNextCard() : updateCountdown(mT); }, 1000);
  }
}

function updateCountdown(t) {
  var d = Math.max(0, Math.ceil((t - Date.now())/1000));
  var el = document.querySelector("#review-countdown");
  if(el) el.textContent = formatCount(Math.floor(d/60)) + ":" + formatCount(d%60);
}

function renderCard() {
  var e = currentWord(); if (!e) return;
  var dIdx = Object.keys(cardsSeenInSession).length; if(!cardsSeenInSession[e.word]) dIdx++;
  if(dIdx>totalCardsInSession) dIdx=totalCardsInSession; if(dIdx===0) dIdx=1;
  
  document.querySelector("#card-index").innerHTML = formatCount(dIdx)+" <span>/ "+formatCount(totalCardsInSession)+"</span>";
  document.querySelector("#front-pos").textContent = (e.pos||"word").toUpperCase();
  document.querySelector("#front-word").textContent = e.word;
  document.querySelector("#front-phonetic").textContent = e.phonetic||"";
  document.querySelector("#back-word").textContent = e.word;
  document.querySelector("#back-translation").textContent = e.translation||"";
  document.querySelectorAll(".card-set-name").forEach(function(l){ l.textContent = activeSet().name.toUpperCase(); });
  
  var syns = Array.isArray(e.synonyms) ? e.synonyms : [];
  var bs = document.querySelector("#back-synonyms");
  if(bs){ bs.innerHTML=""; syns.forEach(function(s,i){ bs.appendChild(document.createTextNode(s)); if(i<syns.length-1){var sp=document.createElement("span"); sp.textContent=" · "; bs.appendChild(sp);} }); }
  
  var be = document.querySelector("#back-example");
  if(be){ be.innerHTML=""; highlightWord(e.example||"", e.word).forEach(function(n){ be.appendChild(n); }); }
  
  document.querySelector("#progress-label").innerHTML = formatCount(dIdx)+" <span>/</span> "+formatCount(totalCardsInSession);
  document.querySelector("#progress-track").setAttribute("aria-valuenow", String(completedCardsInSession));
  document.querySelector("#progress-fill").style.width = ((completedCardsInSession/(totalCardsInSession||1))*100)+"%";
  
  document.querySelector("#review-tally").textContent = String(Object.keys(sessionReviewWords).length);
  document.querySelector("#remember-tally").textContent = String(Object.keys(sessionRememberedWords).length);
  document.querySelector("#easy-delay").textContent = currentCardObj.step===0 ? "Show in 2 min" : "Finish";
  
  renderSetProgress(); setCardFace(false);
  if (voiceSettings.onCard && !studyView.hidden) speakWord(e.word);
}

function showCompletion() {
  if (flashcard) flashcard.classList.remove("is-flipped");
  document.querySelector("#card-scene").hidden = true; document.querySelector("#answer-area").hidden = true;
  document.querySelector("#review-waiting").hidden = true; document.querySelector("#completion-panel").hidden = false;
  document.querySelector("#progress-label").innerHTML = formatCount(totalCardsInSession)+" <span>/</span> "+formatCount(totalCardsInSession);
  document.querySelector("#progress-fill").style.width = "100%";
  var c = document.querySelector("#completion-copy");
  if(c) c.textContent = Object.keys(sessionRememberedWords).length + " remembered · " + Object.keys(sessionReviewWords).length + " to revisit.";
}

function startStudy() {
  sessionReviewWords={}; sessionRememberedWords={}; cardsSeenInSession={}; completedCardsInSession=0;
  var c = activeSet().cards; totalCardsInSession = c.length;
  var iw = c.map(function(x){ return x.word; });
  if (currentOrderMode === "random") { for(var i=iw.length-1; i>0; i--){ var j=Math.floor(Math.random()*(i+1)); var t=iw[i]; iw[i]=iw[j]; iw[j]=t; } }
  else { iw.sort(function(a,b){ return a.localeCompare(b); }); }
  studyQueue = iw.map(function(w){ return {word:w, availableAt:0, step:0}; });
  document.querySelector("#completion-panel").hidden = true; document.querySelector("#review-waiting").hidden = true;
  renderNextCard();
}

// ==========================================
// TEST MODE (LIST FORM)
// ==========================================
function updateTestRangeBounds() {
  var max = activeSet().cards.length||1; var e = document.querySelector("#test-end-idx");
  if(e){ e.max=max; if(!e.value || parseInt(e.value)>max) e.value=max; }
}
function normStr(s) { return (s||"").trim().toLowerCase().replace(/[.,!?;:()]/g,''); }

function generateTestQuestions() {
  testMode = document.querySelector("#test-type-select").value;
  var sIdx = parseInt(document.querySelector("#test-start-idx").value)||1;
  var eIdx = parseInt(document.querySelector("#test-end-idx").value)||10;
  var bc = activeSet().cards.slice().sort(function(a,b){return a.word.localeCompare(b.word);});
  sIdx = Math.max(1, sIdx); eIdx = Math.max(sIdx, Math.min(bc.length, eIdx));
  var pool = bc.slice(sIdx-1, eIdx);
  if(testMode.indexOf("synonym")!==-1) pool = pool.filter(function(c){return c.synonyms&&c.synonyms.length>0;});
  if(pool.length===0){ alert("Không đủ dữ liệu cho chế độ này!"); return; }
  pool.sort(function(){return 0.5-Math.random();}); testQuestions=pool;
  var cont = document.querySelector("#test-questions-container"); cont.innerHTML="";

  for(var i=0; i<testQuestions.length; i++){
    var q=testQuestions[i]; var pt="";
    if(testMode==="meaning-word") pt="Nghĩa: "+q.translation;
    else if(testMode==="word-meaning") pt="Từ vựng: "+q.word;
    else if(testMode==="synonym-word") pt="Từ đồng nghĩa: "+q.synonyms.join(", ");
    else pt="Từ vựng: "+q.word+" (Hãy điền 1 từ đồng nghĩa)";

    var h = '<div class="test-question-card" id="test-q-'+i+'"><div class="test-q-label">Câu hỏi '+(i+1)+'</div><div class="test-q-text">'+pt+'</div><input type="text" class="test-q-input" id="test-ans-'+i+'" placeholder="Gõ câu trả lời vào đây..." autocomplete="off"><div class="test-feedback" id="test-fb-'+i+'"><div style="font-weight: bold; font-size: 15px; margin-bottom: 8px;" id="test-badge-'+i+'"></div><div style="margin-bottom: 6px;"><b>Đáp án chuẩn:</b> <span id="test-correct-'+i+'" style="color: var(--lime);"></span></div><div style="color: var(--muted); margin-bottom: 6px; font-size: 13px;"><b>Phiên âm:</b> '+(q.phonetic||"Không có")+'</div><div style="color: var(--muted); line-height: 1.5; font-size: 13px;"><b>Ví dụ:</b> <span class="test-ex-holder" data-idx="'+i+'"></span></div></div></div>';
    var d = document.createElement("div"); d.innerHTML = h; cont.appendChild(d.firstElementChild);
    var exH = cont.querySelector(".test-ex-holder[data-idx='"+i+"']");
    if(exH) highlightWord(q.example||"", q.word).forEach(function(n){ exH.appendChild(n); });
  }
  document.querySelector("#test-setup-panel").hidden = true; document.querySelector("#test-run-panel").hidden = false;
  document.querySelector("#test-result-summary").hidden = true; document.querySelector("#test-submit-btn").hidden = false;
  window.scrollTo(0,0);
}

function submitFullTest() {
  if(!confirm("Bạn chắc chắn muốn nộp bài?")) return;
  var score = 0;
  for(var i=0; i<testQuestions.length; i++){
    var q=testQuestions[i]; var inp=document.querySelector("#test-ans-"+i); if(!inp) continue;
    var uStr=normStr(inp.value); var isC=false;
    if(testMode==="meaning-word"||testMode==="synonym-word") isC=(uStr===normStr(q.word));
    else if(testMode==="word-meaning") isC=(uStr.length>=2 && normStr(q.translation).indexOf(uStr)!==-1);
    else if(testMode==="word-synonym") isC=((q.synonyms||[]).map(normStr).indexOf(uStr)!==-1);
    
    if(isC) score++;
    var card=document.querySelector("#test-q-"+i); if(card){ card.classList.add("submitted"); card.classList.add(isC?"correct":"incorrect"); }
    inp.disabled=true;
    var b=document.querySelector("#test-badge-"+i); if(b){ b.textContent=isC?"✅ CHÍNH XÁC":"❌ SAI"; b.style.color=isC?"var(--lime)":"var(--rose)"; }
    var cStr="";
    if(testMode==="meaning-word"||testMode==="synonym-word") cStr=q.word;
    else if(testMode==="word-meaning") cStr=q.translation;
    else cStr=(q.synonyms&&q.synonyms.length)?q.synonyms.join(", "):"Chưa có từ đồng nghĩa nào.";
    document.querySelector("#test-correct-"+i).textContent = cStr;
  }
  document.querySelector("#test-submit-btn").hidden=true; document.querySelector("#test-result-summary").hidden=false;
  document.querySelector("#test-final-score").textContent=score; document.querySelector("#test-final-total").textContent=testQuestions.length;
  window.scrollTo({top:0, behavior:'smooth'});
}

// ==========================================
// GAME CROSSWORD MODE
// ==========================================
function updateCwRangeBounds() {
  var max = activeSet().cards.length||1; var e = document.querySelector("#cw-end-idx");
  if(e){ e.max=max; if(!e.value || parseInt(e.value)>max) e.value=max; }
}
function cleanWord(w) { return w.replace(/[^a-zA-Z]/g,"").toUpperCase(); }

function generateCrossword() {
  var sIdx = parseInt(document.querySelector("#cw-start-idx").value)||1;
  var eIdx = parseInt(document.querySelector("#cw-end-idx").value)||10;
  var cType = document.querySelector("#cw-clue-type-select").value;
  var bc = activeSet().cards.slice().sort(function(a,b){return a.word.localeCompare(b.word);});
  sIdx=Math.max(1,sIdx); eIdx=Math.max(sIdx, Math.min(bc.length, eIdx));
  var pool = bc.slice(sIdx-1, eIdx);
  if(pool.length===0){alert("Không đủ từ vựng để tạo game!"); return;}

  var list = [];
  for(var i=0; i<pool.length; i++) {
    var pw = cleanWord(pool[i].word);
    if(pw.length>1) {
      var fClue = pool[i].translation; var syns = pool[i].synonyms||[];
      if(cType==="synonym"){ fClue = syns.length>0 ? "Đồng nghĩa: "+syns.join(", ") : pool[i].translation; }
      else if(cType==="both") { fClue = pool[i].translation + (syns.length>0 ? " (Đồng nghĩa: "+syns.join(", ")+")" : ""); }
      list.push({id:i, word:pw, clue:fClue});
    }
  }
  if(list.length===0){alert("Các từ vựng không hợp lệ để tạo lưới."); return;}
  list.sort(function(a,b){return b.word.length - a.word.length;});

  cwGridData={}; cwWordsPlaced=[];
  function getC(x,y){return cwGridData[x+','+y];}
  function setC(x,y,ch,wId){ var k=x+','+y; if(!cwGridData[k]) cwGridData[k]={char:ch,wordIds:[]}; if(cwGridData[k].wordIds.indexOf(wId)===-1) cwGridData[k].wordIds.push(wId); }
  function canP(ws, sx, sy, d) {
    for(var k=0; k<ws.length; k++){
      var x = sx+(d==='H'?k:0), y = sy+(d==='V'?k:0), c = getC(x,y);
      if(c && c.char!==ws[k]) return false;
      if(d==='H'){ if(!c && (getC(x,y-1)||getC(x,y+1))) return false; if(k===0&&getC(x-1,y)) return false; if(k===ws.length-1&&getC(x+1,y)) return false; }
      else { if(!c && (getC(x-1,y)||getC(x+1,y))) return false; if(k===0&&getC(x,y-1)) return false; if(k===ws.length-1&&getC(x,y+1)) return false; }
    } return true;
  }

  for(var i=0; i<list.length; i++){
    var it=list[i], ws=it.word;
    if(cwWordsPlaced.length===0){
      cwWordsPlaced.push({id:it.id, word:ws, clue:it.clue, x:0, y:0, dir:'H', num:1});
      for(var k=0; k<ws.length; k++) setC(k,0,ws[k],it.id); continue;
    }
    var best = null;
    for(var p=0; p<cwWordsPlaced.length; p++){
      var pw=cwWordsPlaced[p];
      for(var j=0; j<pw.word.length; j++){
        var pc=pw.word[j], px=pw.x+(pw.dir==='H'?j:0), py=pw.y+(pw.dir==='V'?j:0);
        for(var c=0; c<ws.length; c++){
          if(ws[c]===pc){
            var nd=pw.dir==='H'?'V':'H', sx=px-(nd==='H'?c:0), sy=py-(nd==='V'?c:0);
            if(canP(ws, sx, sy, nd)){ best = {id:it.id, word:ws, clue:it.clue, x:sx, y:sy, dir:nd}; break; }
          }
        } if(best) break;
      } if(best) break;
    }
    if(best){
      best.num=cwWordsPlaced.length+1; cwWordsPlaced.push(best);
      for(var m=0; m<ws.length; m++) setC(best.x+(best.dir==='H'?m:0), best.y+(best.dir==='V'?m:0), ws[m], it.id);
    } else {
      var my=0; for(var key in cwGridData){ var yP=parseInt(key.split(',')[1]); if(yP>my) my=yP; }
      var ny=my+2; cwWordsPlaced.push({id:it.id, word:ws, clue:it.clue, x:0, y:ny, dir:'H', num:cwWordsPlaced.length+1});
      for(var n=0; n<ws.length; n++) setC(n,ny,ws[n],it.id);
    }
  }
  drawCrosswordGrid();
  document.querySelector("#cw-setup-panel").hidden=true; document.querySelector("#cw-run-panel").hidden=false;
  document.querySelector("#cw-submit-btn").hidden=false; document.querySelector("#cw-result-summary").hidden=true;
}

function drawCrosswordGrid() {
  if(cwWordsPlaced.length===0) return;
  var mX=999, mx=-999, mY=999, my=-999;
  for(var k in cwGridData){ var p=k.split(','); var x=parseInt(p[0]), y=parseInt(p[1]); if(x<mX)mX=x; if(x>mx)mx=x; if(y<mY)mY=y; if(y>my)my=y; }
  var cont = document.querySelector("#cw-grid-container"); var tb = document.createElement("table"); tb.className="cw-board";
  
  for(var r=mY; r<=my; r++){
    var tr=document.createElement("tr");
    for(var c=mX; c<=mx; c++){
      var td=document.createElement("td"); td.className="cw-cell"; var cd=cwGridData[c+','+r];
      if(!cd) td.classList.add("empty");
      else {
        var isS=false, sN=0;
        for(var i=0; i<cwWordsPlaced.length; i++) if(cwWordsPlaced[i].x===c && cwWordsPlaced[i].y===r){ isS=true; sN=cwWordsPlaced[i].num; break; }
        if(isS){ var sp=document.createElement("span"); sp.className="cw-number"; sp.textContent=sN; td.appendChild(sp); }
        
        var inp=document.createElement("input"); inp.type="text"; inp.className="cw-input"; inp.maxLength=1;
        inp.setAttribute("autocomplete", "off"); inp.setAttribute("autocorrect", "off"); inp.setAttribute("autocapitalize", "characters"); inp.setAttribute("spellcheck", "false");
        inp.dataset.x=c; inp.dataset.y=r; inp.dataset.wids=cd.wordIds.join(",");
        
        inp.addEventListener("click", function(e){
          var wids=e.target.dataset.wids.split(",");
          if(wids.length>1 && document.activeElement===e.target){
             cwCurrentWordId=(cwCurrentWordId==parseInt(wids[0]))?parseInt(wids[1]):parseInt(wids[0]);
             cwCurrentDir=getWordById(cwCurrentWordId).dir; highlightCurrentCwWord();
          }
        });
        inp.addEventListener("focus", function(e){
          var wids=e.target.dataset.wids.split(",");
          if(cwCurrentWordId===null || wids.indexOf(String(cwCurrentWordId))===-1){
             cwCurrentWordId=parseInt(wids[0]); cwCurrentDir=getWordById(cwCurrentWordId).dir;
          }
          highlightCurrentCwWord(); setTimeout(function(){e.target.select();}, 10);
        });
        inp.addEventListener("keydown", function(e){
          var cx=parseInt(e.target.dataset.x), cy=parseInt(e.target.dataset.y);
          if(e.key==="Backspace"){
            if(e.target.value===""){ e.preventDefault(); focusCwCell(cx-(cwCurrentDir==='H'?1:0), cy-(cwCurrentDir==='V'?1:0)); }
            else { e.target.value=""; e.preventDefault(); }
          } else if(e.key==="ArrowRight"){ e.preventDefault(); focusCwCell(cx+1,cy); }
            else if(e.key==="ArrowLeft"){ e.preventDefault(); focusCwCell(cx-1,cy); }
            else if(e.key==="ArrowDown"){ e.preventDefault(); focusCwCell(cx,cy+1); }
            else if(e.key==="ArrowUp"){ e.preventDefault(); focusCwCell(cx,cy-1); }
        });
        inp.addEventListener("input", function(e){
          var v=e.target.value.replace(/[^a-zA-Z]/g,"").toUpperCase();
          if(v.length>0){ e.target.value=v.charAt(v.length-1); focusCwCell(parseInt(e.target.dataset.x)+(cwCurrentDir==='H'?1:0), parseInt(e.target.dataset.y)+(cwCurrentDir==='V'?1:0)); }
          else e.target.value="";
        });
        td.appendChild(inp);
      } tr.appendChild(td);
    } tb.appendChild(tr);
  }
  cont.innerHTML=""; cont.appendChild(tb);

  var aL = document.querySelector("#cw-across-list"), dL = document.querySelector("#cw-down-list");
  if(aL) aL.innerHTML=""; if(dL) dL.innerHTML="";
  for(var w=0; w<cwWordsPlaced.length; w++){
    var wp=cwWordsPlaced[w], li=document.createElement("li"); li.className="cw-clue-item"; li.id="cw-clue-"+wp.id;
    li.innerHTML="<span class='cw-clue-num'>"+wp.num+".</span> "+wp.clue;
    if(wp.dir==='H' && aL) aL.appendChild(li); else if(dL) dL.appendChild(li);
  }
}

function getWordById(id) { for(var i=0; i<cwWordsPlaced.length; i++) if(cwWordsPlaced[i].id===id) return cwWordsPlaced[i]; return null; }
function focusCwCell(x,y) { var inp=document.querySelector(".cw-input[data-x='"+x+"'][data-y='"+y+"']"); if(inp) inp.focus(); }
function highlightCurrentCwWord() {
  document.querySelectorAll(".cw-cell").forEach(function(c){c.classList.remove("active-word");});
  document.querySelectorAll(".cw-clue-item").forEach(function(c){c.classList.remove("active");});
  if(cwCurrentWordId===null) return;
  document.querySelectorAll(".cw-input").forEach(function(inp){ if(inp.dataset.wids.split(",").indexOf(String(cwCurrentWordId))!==-1) inp.parentElement.classList.add("active-word"); });
  var el=document.querySelector("#cw-clue-"+cwCurrentWordId); if(el) el.classList.add("active");
}

function submitCrossword() {
  if(!confirm("Chốt đáp án và kiểm tra?")) return;
  var allC=true;
  document.querySelectorAll(".cw-input").forEach(function(inp){
    var ex=cwGridData[inp.dataset.x+','+inp.dataset.y].char; inp.disabled=true;
    if(inp.value.toUpperCase()===ex) inp.parentElement.classList.add("correct");
    else { inp.parentElement.classList.add("incorrect"); inp.value=ex; allC=false; }
  });
  document.querySelector("#cw-submit-btn").hidden=true; document.querySelector("#cw-result-summary").hidden=false;
  var t=document.querySelector("#cw-result-title");
  if(t){ t.textContent = allC ? "Tuyệt Vời! Ô chữ đã giải mã 100%!" : "Chưa hoàn hảo. Xem lại ô đỏ!"; t.style.color = allC ? "var(--lime)" : "var(--rose)"; }
  window.scrollTo(0, document.body.scrollHeight);
}

// ==========================================
// RENDER DANH SÁCH TỪ VÀ TRANG CHỦ
// ==========================================
function renderWords() {
  var w = activeSet().cards; var rc=0, rvc=0;
  for(var k in statusByWord){ if(statusByWord[k]==="remembered") rc++; else if(statusByWord[k]==="review") rvc++; }
  if (document.querySelector("#total-count")) document.querySelector("#total-count").textContent=formatCount(w.length);
  if (document.querySelector("#all-count")) document.querySelector("#all-count").textContent=formatCount(w.length);
  if (document.querySelector("#remembered-count")) document.querySelector("#remembered-count").textContent=formatCount(rc);
  if (document.querySelector("#review-count")) document.querySelector("#review-count").textContent=formatCount(rvc);
  renderSetProgress();
  var l=document.querySelector("#word-list"); if(!l) return; l.innerHTML="";
  var en = activeCategory==="all" ? w : w.filter(function(e){return statusByWord[e.word]===activeCategory;});
  if(!en.length){ l.innerHTML="<p class='empty-list'>Không có từ vựng ở mục này.</p>"; return; }
  en.forEach(function(e,i){
    var st = statusByWord[e.word]||"new", r=document.createElement("div"); r.className="word-row"; r.style.animationDelay=Math.min(i*24,144)+"ms";
    var sText = st==="remembered"?"✓ Remembered":(st==="review"?"× Review":"— New");
    r.innerHTML="<span class='row-word'>"+e.word+"</span><span class='row-pos'>"+(e.pos||"")+"</span><span class='row-translation'>"+(e.translation||"")+"</span><span class='row-status status-"+st+"'>"+sText+"</span>";
    l.appendChild(r);
  });
}

function renderHome() {
  var g=document.querySelector("#home-set-grid"); if(!g) return; g.innerHTML="";
  allSets.forEach(function(set, i){
    var st=statusBySet[set.id]||{}; var rc=Object.keys(st).filter(function(k){return st[k]==="remembered";}).length;
    var btn=document.createElement("button"); btn.className="home-set-option"+(set.id===activeSetId?" is-selected":""); btn.type="button";
    btn.innerHTML="<span class='home-set-label'>SET "+formatCount(i+1)+" · "+formatCount(set.cards.length)+" WORDS</span><span class='home-set-name'>"+set.name+"</span><span class='home-set-progress'>"+rc+" / "+set.cards.length+" remembered</span><span class='home-set-arrow'>↗</span>";
    if(set.id.indexOf("firebase-")===0){
      btn.style.position="relative";
      var del=document.createElement("button"); del.textContent="🗑 Xóa";
      del.setAttribute("style", "position:absolute;bottom:12px;right:12px;font-size:12px;color:white;padding:4px 8px;border:none;border-radius:4px;background:var(--rose);cursor:pointer;z-index:10;");
      del.addEventListener("click", function(e){
        e.stopPropagation(); if(confirm("Xóa vĩnh viễn: "+set.name+"?")){
          del.textContent="..."; db.collection("decks").doc(set.id.replace("firebase-","")).delete().then(function(){
            var idx=-1; for(var k=0;k<allSets.length;k++) if(allSets[k].id===set.id){idx=k;break;}
            if(idx>-1) allSets.splice(idx,1); setsById.delete(set.id);
            if(activeSetId===set.id) changeSet(allSets[0]?allSets[0].id:"essentials"); else { renderHome(); updateSelectDropdowns(); }
          }).catch(function(err){ alert("Lỗi: "+err.message); del.textContent="🗑 Xóa"; });
        }
      }); btn.appendChild(del);
    }
    btn.addEventListener("click", function(){ changeSet(set.id); }); g.appendChild(btn);
  });
  var s=activeSet(); 
  if(document.querySelector("#preview-title")) document.querySelector("#preview-title").textContent=s.name; 
  if(document.querySelector("#preview-count")) document.querySelector("#preview-count").textContent=formatCount(s.cards.length)+" WORDS";
  var pl=document.querySelector("#preview-list"); if(!pl) return; pl.innerHTML="";
  s.cards.forEach(function(e){ var r=document.createElement("li"); r.className="preview-word-row"; r.innerHTML="<span class='preview-word'>"+e.word+"</span><span class='preview-pos'>"+(e.pos||"")+"</span><span class='preview-translation'>"+(e.translation||"")+"</span>"; pl.appendChild(r); });
}

function parseRawVocabulary(text) {
  var lines=text.trim().split("\n"), cards=[];
  lines.forEach(function(l){
    l=l.trim(); if(!l) return;
    var f=[]; if(l.indexOf("\t")!==-1) f=[l.slice(0,l.indexOf("\t")), l.slice(l.indexOf("\t")+1)];
    else if(l.indexOf(" - ")!==-1) f=[l.slice(0,l.indexOf(" - ")), l.slice(l.indexOf(" - ")+3)];
    else if(l.indexOf("-")!==-1) f=[l.slice(0,l.indexOf("-")), l.slice(l.indexOf("-")+1)];
    else if(l.indexOf(" ")!==-1) f=[l.slice(0,l.indexOf(" ")), l.slice(l.indexOf(" ")+1)];
    else return;
    
    var w=f[0].trim(), p=[f[1].trim()]; if(p[0].indexOf("|")!==-1) p=p[0].split("|").map(function(x){return x.trim();}).filter(Boolean);
    var dt=p[0], pm=dt.match(/\((v\.|n\.|adj\.|adv\.|noun|verb|adjective|adverb|idiom)\)/i), pos="word";
    if(pm){ pos=pm[1].toLowerCase().replace(".",""); pos=pos==="v"?"verb":pos==="n"?"noun":pos==="adj"?"adjective":pos==="adv"?"adverb":pos; dt=dt.replace(pm[0],"").trim(); }
    var pho="", ex="", syn=[];
    for(var i=1; i<p.length; i++){
      if(p[i].indexOf("/")===0 && p[i].lastIndexOf("/")===p[i].length-1) pho=p[i];
      else if(/^(vd|ex):/i.test(p[i])) ex=p[i].replace(/^(vd|ex):\s*/i,"").trim();
      else if(/^(đồng nghĩa|synonyms):/i.test(p[i])) syn=p[i].replace(/^(đồng nghĩa|synonyms):\s*/i,"").trim().split(",").map(function(s){return s.trim();}).filter(Boolean);
    }
    if(w&&dt) cards.push({word:w, pos:pos, phonetic:pho, translation:dt, synonyms:syn, example:ex||"No example."});
  }); return cards;
}

var bsf=document.getElementById("btn-save-firebase");
if(bsf) bsf.addEventListener("click", function(){
  if(!db){alert("Chưa kết nối Firebase!");return;}
  var ti=document.getElementById("deck-title"), ra=document.getElementById("import-input");
  if(!ti.value.trim() || !ra.value.trim()){alert("Nhập đủ thông tin!");return;}
  var c=parseRawVocabulary(ra.value); if(c.length===0){alert("Sai định dạng!");return;}
  bsf.innerText="Đang lưu..."; bsf.disabled=true;
  db.collection("decks").add({name:ti.value.trim(), cards:c, createdAt:new Date().toISOString()}).then(function(){
    alert("Tạo bộ từ thành công!"); ti.value=""; ra.value=""; document.querySelector("#custom-set-section").hidden=true;
    bsf.innerText="Lưu & Chia Sẻ Lên Server"; bsf.disabled=false; syncOnlineDecks();
  }).catch(function(){alert("Lỗi lưu!"); bsf.innerText="Lưu & Chia Sẻ"; bsf.disabled=false;});
});

function syncOnlineDecks() {
  if(!db) return;
  db.collection("decks").orderBy("createdAt","desc").get().then(function(snap){
    var a=false; snap.forEach(function(doc){
      var d=doc.data(), id="firebase-"+doc.id;
      if(!setsById.has(id)){ allSets.push({id:id, name:d.name, cards:d.cards}); setsById.set(id, allSets[allSets.length-1]); a=true; }
    });
    if(a){ updateSelectDropdowns(); if(setsById.has(activeSetId)) changeSet(activeSetId); else if(allSets.length>0) changeSet(allSets[0].id); }
  });
}

// ==========================================
// CÁC SỰ KIỆN GIAO DIỆN
// ==========================================
document.querySelector("#review-button")?.addEventListener("click", function(){gradeCard("review");});
document.querySelector("#remember-button")?.addEventListener("click", function(){gradeCard("remembered");});
document.querySelector("#restart-button")?.addEventListener("click", startStudy);
document.querySelector("#preview-start")?.addEventListener("click", function(){setView("study");});
document.querySelectorAll(".study-order-button").forEach(function(b){ b.addEventListener("click",function(){ document.querySelectorAll(".study-order-button").forEach(function(x){x.classList.remove("is-active");x.setAttribute("aria-pressed","false");}); b.classList.add("is-active"); b.setAttribute("aria-pressed","true"); currentOrderMode=b.dataset.studyOrder; if(!studyView.hidden) startStudy(); }); });
document.querySelector("#finish-early")?.addEventListener("click", function(){ if(waitingInterval){clearInterval(waitingInterval);waitingInterval=null;} showCompletion(); });
document.querySelector("#toggle-add-set-btn")?.addEventListener("click", function(){ document.querySelector("#custom-set-section").hidden=!document.querySelector("#custom-set-section").hidden; });
document.querySelector("#btn-cancel-create")?.addEventListener("click", function(){ document.querySelector("#custom-set-section").hidden=true; });

// Sự kiện Test & Game
document.querySelector("#test-start-btn")?.addEventListener("click", generateTestQuestions);
document.querySelector("#test-submit-btn")?.addEventListener("click", submitFullTest);
document.querySelector("#test-abort-btn")?.addEventListener("click", function(){ if(confirm("Hủy bài?")){document.querySelector("#test-run-panel").hidden=true;document.querySelector("#test-setup-panel").hidden=false;} });
document.querySelector("#test-retry-btn")?.addEventListener("click", function(){ document.querySelector("#test-result-summary").hidden=true;document.querySelector("#test-run-panel").hidden=true;document.querySelector("#test-setup-panel").hidden=false; });
document.querySelector("#cw-start-btn")?.addEventListener("click", generateCrossword);
document.querySelector("#cw-submit-btn")?.addEventListener("click", submitCrossword);
document.querySelector("#cw-abort-btn")?.addEventListener("click", function(){ if(confirm("Thoát?")){document.querySelector("#cw-run-panel").hidden=true;document.querySelector("#cw-setup-panel").hidden=false;} });
document.querySelector("#cw-retry-btn")?.addEventListener("click", function(){ document.querySelector("#cw-result-summary").hidden=true;document.querySelector("#cw-run-panel").hidden=true;document.querySelector("#cw-setup-panel").hidden=false; });

// Navigation & Setting
document.querySelector("#back-to-study")?.addEventListener("click", function(){setView("study");});
document.querySelector("#theme-select")?.addEventListener("change", function(e){applyTheme(e.target.value);});
document.querySelectorAll("#voice-gender, #voice-speed, #voice-on-card, #voice-on-flip").forEach(function(c){
  c.addEventListener("change", function(){
    var vg=document.querySelector("#voice-gender"), vs=document.querySelector("#voice-speed"), vc=document.querySelector("#voice-on-card"), vf=document.querySelector("#voice-on-flip");
    voiceSettings={gender:vg?vg.value:"female", speed:vs?vs.value:"normal", onCard:vc?vc.checked:true, onFlip:vf?vf.checked:true};
    saveVoiceSettings(); updateVoiceNote();
  });
});
document.querySelectorAll(".listen-button").forEach(function(b){ b.addEventListener("click", function(e){e.stopPropagation(); speakWord(currentWord()?.word);}); });
document.querySelector("#settings-menu")?.addEventListener("click", function(e){e.stopPropagation();});
document.addEventListener("click", function(){ var m=document.querySelector("#settings-menu"); if(m) m.open=false; });
document.addEventListener("keydown", function(e){ if(e.key==="Escape"){ var m=document.querySelector("#settings-menu"); if(m) m.open=false;} });
document.querySelector(".wordmark")?.addEventListener("click", function(e){e.preventDefault();setView("home");});
if(flashcard){ flashcard.addEventListener("click", function(e){if(e.target.closest(".listen-button"))return; setCardFace(!flashcard.classList.contains("is-flipped"));}); flashcard.addEventListener("keydown", function(e){if(e.target.closest(".listen-button"))return; if(e.key==="Enter"||e.key===" "){e.preventDefault(); setCardFace(!flashcard.classList.contains("is-flipped"));}}); }
document.querySelectorAll(".set-select").forEach(function(s){ s.addEventListener("change", function(){changeSet(s.value);}); });
document.querySelectorAll(".nav-link").forEach(function(b){ b.addEventListener("click", function(){setView(b.dataset.view);}); });
document.querySelectorAll(".list-tab").forEach(function(b){ b.addEventListener("click", function(){activeCategory=b.dataset.category; document.querySelectorAll(".list-tab").forEach(function(t){t.classList.toggle("is-active",t===b); t.setAttribute("aria-selected",String(t===b));}); renderWords();}); });
document.querySelector("#reset-progress")?.addEventListener("click", function(){ if(Object.keys(statusByWord).length===0)return; statusByWord={}; statusBySet[activeSetId]=statusByWord; saveProgress(); startStudy(); renderHome(); if(!wordsView.hidden)renderWords(); });
document.addEventListener("keydown", function(e){
  if(e.target instanceof HTMLElement && ["BUTTON","A","INPUT","TEXTAREA"].indexOf(e.target.tagName)!==-1) return;
  if(e.target===flashcard || studyView.hidden || document.querySelector("#card-scene").hidden) return;
  if(e.key===" "){e.preventDefault(); setCardFace(!flashcard.classList.contains("is-flipped"));}
  if(e.key==="ArrowLeft") gradeCard("review");
  if(e.key==="ArrowRight") gradeCard("remembered");
});

// KHỞI CHẠY LẦN ĐẦU
applyTheme(loadTheme());
updateSelectDropdowns();
startStudy();
renderWords();
renderHome();
syncOnlineDecks();