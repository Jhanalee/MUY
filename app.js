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
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
  }
} catch (e) {
  console.warn("Không thể kết nối Firebase:", e);
}

var storageKey = "marginalia-sat-progress-v2";
var legacyStorageKey = "marginalia-sat-progress-v1";
var activeSetStorageKey = "marginalia-sat-active-set-v1";

var allSets = (typeof sets !== "undefined" && Array.isArray(sets)) ? sets : [];
var setsById = new Map();
allSets.forEach(function(set) { setsById.set(set.id, set); });

var flashcard = document.querySelector("#flashcard");
var reviewButton = document.querySelector("#review-button");
var rememberButton = document.querySelector("#remember-button");
var homeView = document.querySelector("#home-view");
var studyView = document.querySelector("#study-view");
var wordsView = document.querySelector("#words-view");
var testView = document.querySelector("#test-view"); 
var gameView = document.querySelector("#game-view"); 
var progressTrack = document.querySelector("#progress-track");
var voiceSettingsStorageKey = "sat-vocab-voice-settings-v1";
var themeStorageKey = "sat-vocab-theme-v1";
var supportsSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

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

function activeSet() {
  return setsById.get(activeSetId) || allSets[0] || { id: "default", name: "Empty", cards: [] };
}

function loadActiveSet() {
  var fallback = (allSets[0] && allSets[0].id) ? allSets[0].id : "essentials";
  try {
    var savedSetId = localStorage.getItem(activeSetStorageKey);
    return setsById.has(savedSetId) ? savedSetId : fallback;
  } catch (e) { return fallback; }
}

function loadVoiceSettings() {
  var defaults = { gender: "female", speed: "normal", onCard: true, onFlip: true };
  try {
    var saved = JSON.parse(localStorage.getItem(voiceSettingsStorageKey) || "null");
    if (!saved || typeof saved !== "object") return defaults;
    return {
      gender: (saved.gender === "female" || saved.gender === "male") ? saved.gender : defaults.gender,
      speed: (saved.speed === "normal" || saved.speed === "slow") ? saved.speed : defaults.speed,
      onCard: saved.version === 2 ? saved.onCard === true : true,
      onFlip: saved.version === 2 ? saved.onFlip === true : true
    };
  } catch (e) { return defaults; }
}

function saveVoiceSettings() {
  try {
    var objToSave = { gender: voiceSettings.gender, speed: voiceSettings.speed, onCard: voiceSettings.onCard, onFlip: voiceSettings.onFlip, version: 2 };
    localStorage.setItem(voiceSettingsStorageKey, JSON.stringify(objToSave));
  } catch (e) {}
}

function applyTheme(theme) {
  var selectedTheme = (theme === "green" || theme === "red" || theme === "graphite") ? theme : "green";
  document.documentElement.dataset.theme = selectedTheme;
  var select = document.querySelector("#theme-select");
  if (select) select.value = selectedTheme;
  try { localStorage.setItem(themeStorageKey, selectedTheme); } catch (e) {}
}

function loadTheme() {
  try { return localStorage.getItem(themeStorageKey) || "green"; } catch (e) { return "green"; }
}

function refreshVoices() {
  if (!supportsSpeech) return;
  availableVoices = window.speechSynthesis.getVoices();
  updateVoiceNote();
}

function preferredVoice() {
  var englishVoices = availableVoices.filter(function(voice) { return voice.lang.toLowerCase().indexOf("en") === 0; });
  var voiceNamePatterns = voiceSettings.gender === "female"
    ? /\b(?:female|woman|zira|samantha|victoria|karen|moira|tessa|susan|aria|jenny|linda|amy|allison|ava|siri.*(?:1|2|3|4|5|6|7|8|9))\b/i
    : /\b(?:male|man|david|alex|daniel|james|guy|ryan|fred|tom|george|mark|aaron|arthur|oliver|lee|thomas|rishi)\b/i;
  var matchedVoice = null;
  for(var i = 0; i < englishVoices.length; i++) {
    if(voiceNamePatterns.test(englishVoices[i].name)) { matchedVoice = englishVoices[i]; break; }
  }
  return matchedVoice || englishVoices[0] || null;
}

function updateVoiceNote() {
  var note = document.querySelector("#voice-note");
  if (!note) return;
  var voice = preferredVoice();
  note.textContent = voice ? "Using " + voice.name : "No English voice is available yet.";
}

function speakWord(word) {
  if (!supportsSpeech || !word) return false;
  var synthesis = window.speechSynthesis;
  if (synthesis.speaking || synthesis.pending) synthesis.cancel();
  var utterance = new window.SpeechSynthesisUtterance(word);
  var voice = preferredVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }
  utterance.rate = voiceSettings.speed === "slow" ? 0.72 : 1;
  utterance.pitch = 1;
  if (synthesis.paused) synthesis.resume();
  synthesis.speak(utterance);
  return true;
}

function loadProgress() {
  try {
    var saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object") {
      var result = {};
      allSets.forEach(function(set) {
        var wordsInSet = {};
        set.cards.forEach(function(entry){ wordsInSet[entry.word] = true; });
        var statuses = saved[set.id] && typeof saved[set.id] === "object" ? saved[set.id] : {};
        var filtered = {};
        for (var key in statuses) {
          if (wordsInSet[key] && (statuses[key] === "review" || statuses[key] === "remembered")) {
            filtered[key] = statuses[key];
          }
        }
        result[set.id] = filtered;
      });
      return result;
    }
    var defaultId = allSets[0] ? allSets[0].id : "essentials";
    var res = {}; res[defaultId] = {}; return res;
  } catch (e) {
    var errorRes = {};
    allSets.forEach(function(set) { errorRes[set.id] = {}; });
    return errorRes;
  }
}

function saveProgress() {
  try { localStorage.setItem(storageKey, JSON.stringify(statusBySet)); } catch (e) {}
}

function formatCount(count) {
  var str = String(count);
  return str.length < 2 ? "0" + str : str;
}

// ==========================================
// STUDY MODE & CHUNG
// ==========================================

function updateSelectDropdowns() {
  document.querySelectorAll(".set-select").forEach(function(select) {
    select.innerHTML = "";
    allSets.forEach(function(set) {
      var option = document.createElement("option");
      option.value = set.id;
      option.textContent = set.name;
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
}

// ==========================================
// TEST MODE
// ==========================================
function updateTestRangeBounds() {
  var cards = activeSet().cards;
  var maxVal = cards.length || 1;
  var endInput = document.querySelector("#test-end-idx");
  if (endInput) {
    endInput.max = maxVal;
    if (parseInt(endInput.value) > maxVal || !endInput.value) endInput.value = maxVal;
  }
}
function normalizeStr(str) { return (str || "").trim().toLowerCase().replace(/[.,!?;:()]/g, ''); }

function generateTestQuestions() {
  var selectEl = document.querySelector("#test-type-select");
  if (selectEl) testMode = selectEl.value;
  var startInput = document.querySelector("#test-start-idx");
  var endInput = document.querySelector("#test-end-idx");
  var startIdx = startInput ? (parseInt(startInput.value) || 1) : 1;
  var endIdx = endInput ? (parseInt(endInput.value) || 10) : 10;

  var cards = activeSet().cards;
  var baseCards = cards.slice().sort(function(a, b) { return a.word.localeCompare(b.word); });
  startIdx = Math.max(1, startIdx);
  endIdx = Math.max(startIdx, Math.min(baseCards.length, endIdx));
  var pool = baseCards.slice(startIdx - 1, endIdx);

  if (testMode.indexOf("synonym") !== -1) {
    pool = pool.filter(function(c) { return c.synonyms && c.synonyms.length > 0; });
  }
  if (pool.length === 0) { alert("Không đủ dữ liệu cho chế độ này!"); return; }

  pool.sort(function() { return 0.5 - Math.random(); });
  testQuestions = pool;

  var container = document.querySelector("#test-questions-container");
  if (!container) return;
  container.innerHTML = "";

  for(var idx=0; idx<testQuestions.length; idx++){
    var q = testQuestions[idx];
    var promptText = "";
    if (testMode === "meaning-word") promptText = "Nghĩa: " + q.translation;
    if (testMode === "word-meaning") promptText = "Từ vựng: " + q.word;
    if (testMode === "synonym-word") promptText = "Từ đồng nghĩa: " + q.synonyms.join(", ");
    if (testMode === "word-synonym") promptText = "Từ vựng: " + q.word + " (Hãy điền 1 từ đồng nghĩa)";

    var phoneticHtml = q.phonetic || "Không có";
    var cardHtml = '<div class="test-question-card" id="test-q-' + idx + '">' +
      '<div class="test-q-label">Câu hỏi ' + (idx + 1) + '</div>' +
      '<div class="test-q-text">' + promptText + '</div>' +
      '<input type="text" class="test-q-input" id="test-ans-' + idx + '" placeholder="Gõ câu trả lời vào đây..." autocomplete="off">' +
      '<div class="test-feedback" id="test-fb-' + idx + '">' +
        '<div style="font-weight: bold; font-size: 15px; margin-bottom: 8px;" id="test-badge-' + idx + '"></div>' +
        '<div style="margin-bottom: 6px;"><b>Đáp án chuẩn:</b> <span id="test-correct-' + idx + '" style="color: var(--lime);"></span></div>' +
        '<div style="color: var(--muted); margin-bottom: 6px; font-size: 13px;"><b>Phiên âm:</b> ' + phoneticHtml + '</div>' +
      '</div></div>';
    
    var div = document.createElement("div");
    div.innerHTML = cardHtml;
    container.appendChild(div.firstElementChild);
  }

  document.querySelector("#test-setup-panel").hidden = true;
  document.querySelector("#test-run-panel").hidden = false;
  document.querySelector("#test-result-summary").hidden = true;
  document.querySelector("#test-submit-btn").hidden = false;
  window.scrollTo(0, 0);
}

function submitFullTest() {
  if (!confirm("Bạn có chắc chắn muốn nộp bài?")) return;
  var score = 0;
  for(var index=0; index<testQuestions.length; index++){
    var q = testQuestions[index];
    var inputEl = document.querySelector("#test-ans-" + index);
    if (!inputEl) continue;
    
    var userStr = normalizeStr(inputEl.value);
    var isCorrect = false;
    if (testMode === "meaning-word" || testMode === "synonym-word") {
      isCorrect = (userStr === normalizeStr(q.word));
    } else if (testMode === "word-meaning") {
      var defStr = normalizeStr(q.translation);
      isCorrect = (userStr.length >= 2 && defStr.indexOf(userStr) !== -1);
    } else if (testMode === "word-synonym") {
      var syns = (q.synonyms || []).map(normalizeStr);
      isCorrect = (syns.indexOf(userStr) !== -1);
    }
    
    if (isCorrect) score++;

    var cardEl = document.querySelector("#test-q-" + index);
    if (cardEl) { cardEl.classList.add("submitted"); cardEl.classList.add(isCorrect ? "correct" : "incorrect"); }
    inputEl.disabled = true;

    var badge = document.querySelector("#test-badge-" + index);
    if (badge) {
      badge.textContent = isCorrect ? "✅ CHÍNH XÁC" : "❌ SAI";
      badge.style.color = isCorrect ? "var(--lime)" : "var(--rose)";
    }

    var correctStr = "";
    if (testMode === "meaning-word" || testMode === "synonym-word") correctStr = q.word;
    if (testMode === "word-meaning") correctStr = q.translation;
    if (testMode === "word-synonym") correctStr = (q.synonyms && q.synonyms.length) ? q.synonyms.join(", ") : "Chưa có từ đồng nghĩa nào.";
    
    var correctEl = document.querySelector("#test-correct-" + index);
    if (correctEl) correctEl.textContent = correctStr;
  }

  document.querySelector("#test-submit-btn").hidden = true;
  document.querySelector("#test-result-summary").hidden = false;
  document.querySelector("#test-final-score").textContent = score;
  document.querySelector("#test-final-total").textContent = testQuestions.length;
  window.scrollTo(0, 0);
}

// ==========================================
// GAME CROSSWORD MODE (TÍNH NĂNG MỚI TẠO Ô CHỮ)
// ==========================================

function updateCwRangeBounds() {
  var cards = activeSet().cards;
  var maxVal = cards.length || 1;
  var endInput = document.querySelector("#cw-end-idx");
  if (endInput) {
    endInput.max = maxVal;
    if (parseInt(endInput.value) > maxVal || !endInput.value) endInput.value = maxVal;
  }
}

// Xóa bỏ khoảng trắng và ký tự đặc biệt khỏi đáp án game
function cleanWordForGrid(word) {
  return word.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function generateCrossword() {
  var startInput = document.querySelector("#cw-start-idx");
  var endInput = document.querySelector("#cw-end-idx");
  var startIdx = startInput ? (parseInt(startInput.value) || 1) : 1;
  var endIdx = endInput ? (parseInt(endInput.value) || 10) : 10;

  var cards = activeSet().cards;
  var baseCards = cards.slice().sort(function(a, b) { return a.word.localeCompare(b.word); });
  startIdx = Math.max(1, startIdx);
  endIdx = Math.max(startIdx, Math.min(baseCards.length, endIdx));
  
  var pool = baseCards.slice(startIdx - 1, endIdx);
  if (pool.length === 0) { alert("Không đủ từ vựng để tạo game!"); return; }

  // Chuẩn bị danh sách từ
  var cwList = [];
  for(var i=0; i<pool.length; i++) {
    var pureWord = cleanWordForGrid(pool[i].word);
    if(pureWord.length > 1) {
      cwList.push({ id: i, rawWord: pool[i].word, word: pureWord, clue: pool[i].translation });
    }
  }
  if(cwList.length === 0) { alert("Các từ vựng không hợp lệ để tạo lưới."); return; }

  // Xếp từ dài nhất lên trước để dễ đan chéo
  cwList.sort(function(a,b) { return b.word.length - a.word.length; });

  cwGridData = {}; 
  cwWordsPlaced = [];

  function getCell(x, y) { return cwGridData[x + ',' + y]; }
  function setCell(x, y, char, wId) {
    var key = x + ',' + y;
    if (!cwGridData[key]) cwGridData[key] = { char: char, wordIds: [] };
    if (cwGridData[key].wordIds.indexOf(wId) === -1) cwGridData[key].wordIds.push(wId);
  }

  function canPlace(wordStr, startX, startY, dir) {
    for (var k = 0; k < wordStr.length; k++) {
      var x = startX + (dir === 'H' ? k : 0);
      var y = startY + (dir === 'V' ? k : 0);
      var cell = getCell(x, y);
      
      if (cell && cell.char !== wordStr[k]) return false; // Trùng ô nhưng khác chữ
      
      // Chống dính liền (tránh tạo ra từ vô nghĩa ở các ô kề cạnh)
      if (dir === 'H') {
        if (!cell && (getCell(x, y-1) || getCell(x, y+1))) return false;
        if (k === 0 && getCell(x-1, y)) return false;
        if (k === wordStr.length - 1 && getCell(x+1, y)) return false;
      } else {
        if (!cell && (getCell(x-1, y) || getCell(x+1, y))) return false;
        if (k === 0 && getCell(x, y-1)) return false;
        if (k === wordStr.length - 1 && getCell(x, y+1)) return false;
      }
    }
    return true;
  }

  // Thuật toán đan chéo tham lam (Greedy Intersection)
  for(var i=0; i<cwList.length; i++) {
    var item = cwList[i];
    var wordStr = item.word;

    if (cwWordsPlaced.length === 0) {
      cwWordsPlaced.push({ id: item.id, word: wordStr, clue: item.clue, x: 0, y: 0, dir: 'H', num: 1 });
      for(var k=0; k<wordStr.length; k++) setCell(k, 0, wordStr[k], item.id);
      continue;
    }

    var bestPlacement = null;
    for (var p = 0; p < cwWordsPlaced.length; p++) {
      var pWord = cwWordsPlaced[p];
      for (var j = 0; j < pWord.word.length; j++) {
        var pChar = pWord.word[j];
        var pX = pWord.x + (pWord.dir === 'H' ? j : 0);
        var pY = pWord.y + (pWord.dir === 'V' ? j : 0);

        for (var c = 0; c < wordStr.length; c++) {
          if (wordStr[c] === pChar) {
            var newDir = pWord.dir === 'H' ? 'V' : 'H';
            var sX = pX - (newDir === 'H' ? c : 0);
            var sY = pY - (newDir === 'V' ? c : 0);
            if (canPlace(wordStr, sX, sY, newDir)) {
              bestPlacement = { id: item.id, word: wordStr, clue: item.clue, x: sX, y: sY, dir: newDir };
              break;
            }
          }
        }
        if (bestPlacement) break;
      }
      if (bestPlacement) break;
    }

    // Nếu không đan chéo được, xếp độc lập xuống dưới cùng
    if (bestPlacement) {
      bestPlacement.num = cwWordsPlaced.length + 1;
      cwWordsPlaced.push(bestPlacement);
      for(var m=0; m<wordStr.length; m++) setCell(bestPlacement.x + (bestPlacement.dir==='H'?m:0), bestPlacement.y + (bestPlacement.dir==='V'?m:0), wordStr[m], item.id);
    } else {
      var maxY = 0;
      for (var key in cwGridData) {
        var coords = key.split(',');
        var yPos = parseInt(coords[1], 10);
        if (yPos > maxY) maxY = yPos;
      }
      var newY = maxY + 2;
      cwWordsPlaced.push({ id: item.id, word: wordStr, clue: item.clue, x: 0, y: newY, dir: 'H', num: cwWordsPlaced.length + 1 });
      for(var n=0; n<wordStr.length; n++) setCell(n, newY, wordStr[n], item.id);
    }
  }

  drawCrosswordGrid();
  
  document.querySelector("#cw-setup-panel").hidden = true;
  document.querySelector("#cw-run-panel").hidden = false;
  document.querySelector("#cw-submit-btn").hidden = false;
  document.querySelector("#cw-result-summary").hidden = true;
}

function drawCrosswordGrid() {
  if (cwWordsPlaced.length === 0) return;

  var minX = 999, maxX = -999, minY = 999, maxY = -999;
  for (var key in cwGridData) {
    var parts = key.split(',');
    var x = parseInt(parts[0], 10);
    var y = parseInt(parts[1], 10);
    if(x < minX) minX = x; if(x > maxX) maxX = x;
    if(y < minY) minY = y; if(y > maxY) maxY = y;
  }

  var container = document.querySelector("#cw-grid-container");
  var table = document.createElement("table");
  table.className = "cw-board";

  for (var r = minY; r <= maxY; r++) {
    var tr = document.createElement("tr");
    for (var c = minX; c <= maxX; c++) {
      var td = document.createElement("td");
      td.className = "cw-cell";
      
      var cellData = cwGridData[c + ',' + r];
      if (!cellData) {
        td.classList.add("empty");
      } else {
        var isStart = false;
        var startNum = 0;
        for(var i=0; i<cwWordsPlaced.length; i++) {
          if (cwWordsPlaced[i].x === c && cwWordsPlaced[i].y === r) {
            isStart = true; startNum = cwWordsPlaced[i].num; break;
          }
        }
        
        if (isStart) {
          var numSpan = document.createElement("span");
          numSpan.className = "cw-number";
          numSpan.textContent = startNum;
          td.appendChild(numSpan);
        }
        
        var inp = document.createElement("input");
        inp.type = "text";
        inp.className = "cw-input";
        inp.maxLength = 1;
        inp.dataset.x = c;
        inp.dataset.y = r;
        inp.dataset.wids = cellData.wordIds.join(",");
        
        inp.addEventListener("focus", function(e) {
           var wids = e.target.dataset.wids.split(",");
           if (wids.length === 1) {
             cwCurrentWordId = parseInt(wids[0], 10);
             cwCurrentDir = getWordById(cwCurrentWordId).dir;
           } else {
             if (cwCurrentWordId != parseInt(wids[0], 10) && cwCurrentWordId != parseInt(wids[1], 10)) {
               cwCurrentWordId = parseInt(wids[0], 10);
             } else {
               cwCurrentWordId = cwCurrentWordId == parseInt(wids[0], 10) ? parseInt(wids[1], 10) : parseInt(wids[0], 10);
             }
             cwCurrentDir = getWordById(cwCurrentWordId).dir;
           }
           highlightCurrentCwWord();
        });

        inp.addEventListener("keydown", function(e) {
          var cx = parseInt(e.target.dataset.x, 10);
          var cy = parseInt(e.target.dataset.y, 10);
          
          if (e.key === "Backspace" && e.target.value === "") {
             e.preventDefault();
             var px = cx - (cwCurrentDir === 'H' ? 1 : 0);
             var py = cy - (cwCurrentDir === 'V' ? 1 : 0);
             focusCwCell(px, py);
          } else if (e.key === "ArrowRight") { e.preventDefault(); focusCwCell(cx+1, cy); }
            else if (e.key === "ArrowLeft")  { e.preventDefault(); focusCwCell(cx-1, cy); }
            else if (e.key === "ArrowDown")  { e.preventDefault(); focusCwCell(cx, cy+1); }
            else if (e.key === "ArrowUp")    { e.preventDefault(); focusCwCell(cx, cy-1); }
        });

        inp.addEventListener("input", function(e) {
          e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
          if (e.target.value !== "") {
             var nx = parseInt(e.target.dataset.x, 10) + (cwCurrentDir === 'H' ? 1 : 0);
             var ny = parseInt(e.target.dataset.y, 10) + (cwCurrentDir === 'V' ? 1 : 0);
             focusCwCell(nx, ny);
          }
        });

        td.appendChild(inp);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  
  container.innerHTML = "";
  container.appendChild(table);

  // In danh sách gợi ý
  var acrossList = document.querySelector("#cw-across-list");
  var downList = document.querySelector("#cw-down-list");
  acrossList.innerHTML = ""; downList.innerHTML = "";

  for(var w=0; w<cwWordsPlaced.length; w++) {
    var wp = cwWordsPlaced[w];
    var li = document.createElement("li");
    li.className = "cw-clue-item";
    li.id = "cw-clue-" + wp.id;
    li.innerHTML = "<span class='cw-clue-num'>" + wp.num + ".</span> " + wp.clue;
    if (wp.dir === 'H') acrossList.appendChild(li);
    else downList.appendChild(li);
  }
}

function getWordById(id) {
  for(var i=0; i<cwWordsPlaced.length; i++) {
    if(cwWordsPlaced[i].id === id) return cwWordsPlaced[i];
  }
  return null;
}

function focusCwCell(x, y) {
  var inp = document.querySelector(".cw-input[data-x='" + x + "'][data-y='" + y + "']");
  if (inp) inp.focus();
}

function highlightCurrentCwWord() {
  document.querySelectorAll(".cw-cell").forEach(function(c) { c.classList.remove("active-word"); });
  document.querySelectorAll(".cw-clue-item").forEach(function(c) { c.classList.remove("active"); });
  
  if (cwCurrentWordId === null) return;
  
  document.querySelectorAll(".cw-input").forEach(function(inp) {
    var wids = inp.dataset.wids.split(",");
    if (wids.indexOf(String(cwCurrentWordId)) !== -1) {
      inp.parentElement.classList.add("active-word");
    }
  });
  
  var clueEl = document.querySelector("#cw-clue-" + cwCurrentWordId);
  if (clueEl) clueEl.classList.add("active");
}

function submitCrossword() {
  if(!confirm("Chốt đáp án và kiểm tra?")) return;
  
  var allCorrect = true;
  document.querySelectorAll(".cw-input").forEach(function(inp) {
    var x = inp.dataset.x;
    var y = inp.dataset.y;
    var expected = cwGridData[x + ',' + y].char;
    inp.disabled = true;
    
    if (inp.value.toUpperCase() === expected) {
      inp.parentElement.classList.add("correct");
    } else {
      inp.parentElement.classList.add("incorrect");
      inp.value = expected; // Sửa lại cho đúng
      allCorrect = false;
    }
  });
  
  document.querySelector("#cw-submit-btn").hidden = true;
  document.querySelector("#cw-result-summary").hidden = false;
  var title = document.querySelector("#cw-result-title");
  if (allCorrect) {
    title.textContent = "Tuyệt Vời! Ô chữ đã được giải mã 100%!";
    title.style.color = "var(--lime)";
  } else {
    title.textContent = "Chưa hoàn hảo. Hãy xem lại các ô đỏ!";
    title.style.color = "var(--rose)";
  }
  window.scrollTo(0, document.body.scrollHeight);
}

// Bắt sự kiện
document.querySelector("#cw-start-btn")?.addEventListener("click", generateCrossword);
document.querySelector("#cw-submit-btn")?.addEventListener("click", submitCrossword);
document.querySelector("#cw-abort-btn")?.addEventListener("click", function() {
  if(confirm("Thoát ván chơi hiện tại?")) {
    document.querySelector("#cw-run-panel").hidden = true;
    document.querySelector("#cw-setup-panel").hidden = false;
  }
});
document.querySelector("#cw-retry-btn")?.addEventListener("click", function() {
  document.querySelector("#cw-result-summary").hidden = true;
  document.querySelector("#cw-run-panel").hidden = true;
  document.querySelector("#cw-setup-panel").hidden = false;
});

// Các sự kiện Navigation khác
document.querySelectorAll(".nav-link").forEach(function(button) {
  button.addEventListener("click", function() { setView(button.dataset.view); });
});
document.querySelectorAll(".set-select").forEach(function(select) {
  select.addEventListener("change", function() { changeSet(select.value); });
});

// Khởi chạy
applyTheme(loadTheme());
updateSelectDropdowns();
startStudy();
renderWords();
renderHome();