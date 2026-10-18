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
// CHUNG
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

function currentWord() {
  if (!currentCardObj) return null;
  var cards = activeSet().cards;
  var found = null;
  for(var i=0; i<cards.length; i++){
    if(cards[i].word === currentCardObj.word){ found = cards[i]; break; }
  }
  return found || cards[0];
}

function highlightWord(sentence, word) {
  if (!sentence) return [document.createTextNode("")];
  var cleanWord = (word || "").trim();
  var cleanWordStem = cleanWord.length > 4 ? cleanWord.slice(0, 4) : cleanWord;
  var position = sentence.toLowerCase().indexOf(cleanWord.toLowerCase());
  var matchLen = cleanWord.length;
  
  if (position === -1 && cleanWordStem.length >= 3) {
    position = sentence.toLowerCase().indexOf(cleanWordStem.toLowerCase());
    if (position !== -1) {
      var spaceIdx = sentence.indexOf(" ", position);
      matchLen = spaceIdx === -1 ? sentence.length - position : spaceIdx - position;
      matchLen = sentence.slice(position, position + matchLen).replace(/[^a-zA-Z]/g, "").length;
    }
  }

  if (position === -1) return [document.createTextNode(sentence)];
  var highlighted = document.createElement("em");
  highlighted.textContent = sentence.slice(position, position + matchLen);
  return [
    document.createTextNode(sentence.slice(0, position)),
    highlighted,
    document.createTextNode(sentence.slice(position + matchLen))
  ];
}

function setCardFace(isFlipped) {
  if (!flashcard) return;
  if(isFlipped){ flashcard.classList.add("is-flipped"); } 
  else { flashcard.classList.remove("is-flipped"); }
  var front = document.querySelector("#card-front");
  var back = document.querySelector("#card-back");
  if (front) front.setAttribute("aria-hidden", String(isFlipped));
  if (back) back.setAttribute("aria-hidden", String(!isFlipped));
  if (isFlipped && voiceSettings.onFlip && studyView && studyView.hidden === false) {
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
    sessionReviewWords[currentCardObj.word] = true;
    delete sessionRememberedWords[currentCardObj.word];
    statusByWord[currentCardObj.word] = "review";
    currentCardObj.step = 0;
    currentCardObj.availableAt = Date.now() + 15000;
    studyQueue.push(currentCardObj);
  } else if (status === "remembered") {
    if (currentCardObj.step === 0) {
      currentCardObj.step = 1;
      currentCardObj.availableAt = Date.now() + 120000;
      studyQueue.push(currentCardObj);
    } else {
      sessionRememberedWords[currentCardObj.word] = true;
      delete sessionReviewWords[currentCardObj.word];
      statusByWord[currentCardObj.word] = "remembered";
      completedCardsInSession++;
    }
  }

  currentCardObj = null;
  saveProgress();
  renderSetProgress();
  renderNextCard();
}

function renderNextCard() {
  if (waitingInterval) { clearInterval(waitingInterval); waitingInterval = null; }

  if (studyQueue.length === 0 && !currentCardObj) {
    showCompletion();
    return;
  }

  var now = Date.now();
  var availableCards = [];
  for (var i = 0; i < studyQueue.length; i++) {
     if (studyQueue[i].availableAt <= now) {
        availableCards.push({ card: studyQueue[i], index: i });
     }
  }

  var nextIdx = -1;
  if (availableCards.length > 0) {
     var reviews = availableCards.filter(function(item) { return item.card.availableAt > 0; });
     if (reviews.length > 0) {
        reviews.sort(function(a, b) { return a.card.availableAt - b.card.availableAt; });
        nextIdx = reviews[0].index;
     } else {
        nextIdx = availableCards[0].index;
     }
  }

  if (nextIdx !== -1) {
    var waitPanel = document.querySelector("#review-waiting");
    if (waitPanel) waitPanel.hidden = true;
    var cardScene = document.querySelector("#card-scene");
    if (cardScene) cardScene.hidden = false;
    var answerArea = document.querySelector("#answer-area");
    if (answerArea) answerArea.hidden = false;

    currentCardObj = studyQueue.splice(nextIdx, 1)[0];
    renderCard();
  } else {
    currentCardObj = null;
    var cardScene2 = document.querySelector("#card-scene");
    if (cardScene2) cardScene2.hidden = true;
    var answerArea2 = document.querySelector("#answer-area");
    if (answerArea2) answerArea2.hidden = true;
    var waitPanel2 = document.querySelector("#review-waiting");
    if (waitPanel2) waitPanel2.hidden = false;

    var minTime = studyQueue[0].availableAt;
    for (var j = 1; j < studyQueue.length; j++) {
      if (studyQueue[j].availableAt < minTime) minTime = studyQueue[j].availableAt;
    }

    updateCountdown(minTime);
    waitingInterval = setInterval(function() {
      if (Date.now() >= minTime) renderNextCard(); 
      else updateCountdown(minTime);
    }, 1000);
  }
}

function updateCountdown(targetTime) {
  var diff = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
  var m = formatCount(Math.floor(diff / 60));
  var s = formatCount(diff % 60);
  var el = document.querySelector("#review-countdown");
  if (el) el.textContent = m + ":" + s;
}

function renderCard() {
  var entry = currentWord();
  if (!entry) return;
  
  var displayIndex = Object.keys(cardsSeenInSession).length;
  if (!cardsSeenInSession[entry.word]) displayIndex += 1;
  if (displayIndex > totalCardsInSession) displayIndex = totalCardsInSession;
  if (displayIndex === 0) displayIndex = 1;

  var cardIndex = document.querySelector("#card-index");
  if (cardIndex) cardIndex.innerHTML = formatCount(displayIndex) + " <span>/ " + formatCount(totalCardsInSession) + "</span>";
  
  var frontPos = document.querySelector("#front-pos");
  if (frontPos) frontPos.textContent = (entry.pos || "word").toUpperCase();
  
  var frontWord = document.querySelector("#front-word");
  if (frontWord) frontWord.textContent = entry.word;
  
  var frontPhonetic = document.querySelector("#front-phonetic");
  if (frontPhonetic) frontPhonetic.textContent = entry.phonetic || "";
  
  var backWord = document.querySelector("#back-word");
  if (backWord) backWord.textContent = entry.word;
  
  var backTranslation = document.querySelector("#back-translation");
  if (backTranslation) backTranslation.textContent = entry.translation || "";
  
  document.querySelectorAll(".card-set-name").forEach(function(label) { 
    label.textContent = activeSet().name.toUpperCase(); 
  });
  
  var syns = Array.isArray(entry.synonyms) ? entry.synonyms : [];
  var backSynonyms = document.querySelector("#back-synonyms");
  if (backSynonyms) {
    backSynonyms.innerHTML = "";
    syns.forEach(function(synonym, index) {
      backSynonyms.appendChild(document.createTextNode(synonym));
      if (index < syns.length - 1) {
        var separator = document.createElement("span");
        separator.textContent = " · ";
        backSynonyms.appendChild(separator);
      }
    });
  }
  
  var backExample = document.querySelector("#back-example");
  if (backExample) {
    backExample.innerHTML = "";
    var nodes = highlightWord(entry.example || "", entry.word);
    nodes.forEach(function(n) { backExample.appendChild(n); });
  }
  
  var progressLabel = document.querySelector("#progress-label");
  if (progressLabel) progressLabel.innerHTML = formatCount(displayIndex) + " <span>/</span> " + formatCount(totalCardsInSession);
  
  if (progressTrack) {
    progressTrack.setAttribute("aria-valuemax", String(totalCardsInSession));
    progressTrack.setAttribute("aria-valuenow", String(completedCardsInSession));
  }
  var fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = ((completedCardsInSession / (totalCardsInSession || 1)) * 100) + "%";
  
  var revTally = document.querySelector("#review-tally");
  if (revTally) revTally.textContent = String(Object.keys(sessionReviewWords).length);
  var remTally = document.querySelector("#remember-tally");
  if (remTally) remTally.textContent = String(Object.keys(sessionRememberedWords).length);
  
  var easyDelay = document.querySelector("#easy-delay");
  if (easyDelay) {
    easyDelay.textContent = currentCardObj.step === 0 ? "Show in 2 min" : "Finish";
  }
  
  renderSetProgress();
  setCardFace(false);
  if (voiceSettings.onCard && studyView && studyView.hidden === false) speakWord(entry.word);
}

function showCompletion() {
  if (flashcard) flashcard.classList.remove("is-flipped");
  var cardScene = document.querySelector("#card-scene");
  if (cardScene) cardScene.hidden = true;
  var answerArea = document.querySelector("#answer-area");
  if (answerArea) answerArea.hidden = true;
  var waitPanel = document.querySelector("#review-waiting");
  if (waitPanel) waitPanel.hidden = true;
  var completionPanel = document.querySelector("#completion-panel");
  if (completionPanel) completionPanel.hidden = false;
  
  var progressLabel = document.querySelector("#progress-label");
  if (progressLabel) progressLabel.innerHTML = formatCount(totalCardsInSession) + " <span>/</span> " + formatCount(totalCardsInSession);
  var fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = "100%";
  if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(totalCardsInSession));
  
  var finalReview = Object.keys(sessionReviewWords).length;
  var finalRemember = Object.keys(sessionRememberedWords).length;
  var compCopy = document.querySelector("#completion-copy");
  if (compCopy) compCopy.textContent = finalRemember + " remembered · " + finalReview + " to revisit.";
}

// KHÔI PHỤC LẠI HÀNG START STUDY ĐÃ MẤT
function startStudy() {
  sessionReviewWords = {};
  sessionRememberedWords = {};
  cardsSeenInSession = {};
  completedCardsInSession = 0;

  var cards = activeSet().cards;
  totalCardsInSession = cards.length;
  var initialWords = cards.map(function(c) { return c.word; });
  
  if (currentOrderMode === "random") {
    for (var i = initialWords.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = initialWords[i];
      initialWords[i] = initialWords[j];
      initialWords[j] = temp;
    }
  } else {
    initialWords.sort(function(a, b) { return a.localeCompare(b); });
  }

  studyQueue = initialWords.map(function(w) { return { word: w, availableAt: 0, step: 0 }; });

  var completionPanel = document.querySelector("#completion-panel");
  if (completionPanel) completionPanel.hidden = true;
  var waitPanel = document.querySelector("#review-waiting");
  if (waitPanel) waitPanel.hidden = true;
  renderNextCard();
}

// ==========================================
// TEST MODE (KIỂM TRA DẠNG LIST FORM)
// ==========================================

function updateTestRangeBounds() {
  var cards = activeSet().cards;
  var maxVal = cards.length || 1;
  var endInput = document.querySelector("#test-end-idx");
  if (endInput) {
    endInput.max = maxVal;
    if (parseInt(endInput.value) > maxVal || !endInput.value) {
       endInput.value = maxVal;
    }
  }
}

function normalizeStr(str) {
  return (str || "").trim().toLowerCase().replace(/[.,!?;:()]/g, '');
}

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

  if (pool.length === 0) {
    alert("Không đủ dữ liệu cho chế độ này!");
    return;
  }

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
        '<div style="color: var(--muted); line-height: 1.5; font-size: 13px;"><b>Ví dụ:</b> <span class="test-ex-holder" data-idx="' + idx + '"></span></div>' +
      '</div>' +
    '</div>';
    
    var div = document.createElement("div");
    div.innerHTML = cardHtml;
    container.appendChild(div.firstElementChild);
    
    var exHolder = container.querySelector(".test-ex-holder[data-idx='" + idx + "']");
    if (exHolder) {
      var nodes = highlightWord(q.example || "", q.word);
      nodes.forEach(function(n) { exHolder.appendChild(n); });
    }
  }

  var setupPanel = document.querySelector("#test-setup-panel");
  var runPanel = document.querySelector("#test-run-panel");
  var resultPanel = document.querySelector("#test-result-summary");
  var submitBtn = document.querySelector("#test-submit-btn");

  if (setupPanel) setupPanel.hidden = true;
  if (runPanel) runPanel.hidden = false;
  if (resultPanel) resultPanel.hidden = true;
  if (submitBtn) submitBtn.hidden = false;
  window.scrollTo(0, 0);
}

function checkAnswer(inputVal, type, card) {
  var userStr = normalizeStr(inputVal);
  if (!userStr) return false;

  if (type === "meaning-word" || type === "synonym-word") {
    return userStr === normalizeStr(card.word);
  } 
  else if (type === "word-meaning") {
    var defStr = normalizeStr(card.translation);
    return userStr.length >= 2 && defStr.indexOf(userStr) !== -1;
  } 
  else if (type === "word-synonym") {
    var syns = (card.synonyms || []).map(normalizeStr);
    return syns.indexOf(userStr) !== -1;
  }
  return false;
}

function submitFullTest() {
  if (!confirm("Bạn có chắc chắn muốn nộp bài?")) return;
  
  var score = 0;
  
  for(var index=0; index<testQuestions.length; index++){
    var q = testQuestions[index];
    var inputEl = document.querySelector("#test-ans-" + index);
    if (!inputEl) continue;
    var inputVal = inputEl.value;
    var isCorrect = checkAnswer(inputVal, testMode, q);
    
    if (isCorrect) score++;

    var cardEl = document.querySelector("#test-q-" + index);
    if (cardEl) {
      cardEl.classList.add("submitted");
      cardEl.classList.add(isCorrect ? "correct" : "incorrect");
    }
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

  var submitBtn = document.querySelector("#test-submit-btn");
  var resultPanel = document.querySelector("#test-result-summary");
  var finalScore = document.querySelector("#test-final-score");
  var finalTotal = document.querySelector("#test-final-total");

  if (submitBtn) submitBtn.hidden = true;
  if (resultPanel) resultPanel.hidden = false;
  if (finalScore) finalScore.textContent = score;
  if (finalTotal) finalTotal.textContent = testQuestions.length;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ==========================================
// GAME CROSSWORD MODE 
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

  var cwList = [];
  for(var i=0; i<pool.length; i++) {
    var pureWord = cleanWordForGrid(pool[i].word);
    if(pureWord.length > 1) {
      cwList.push({ id: i, rawWord: pool[i].word, word: pureWord, clue: pool[i].translation });
    }
  }
  if(cwList.length === 0) { alert("Các từ vựng không hợp lệ để tạo lưới."); return; }

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
      
      if (cell && cell.char !== wordStr[k]) return false; 
      
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

  var acrossList = document.querySelector("#cw-across-list");
  var downList = document.querySelector("#cw-down-list");
  if(acrossList) acrossList.innerHTML = ""; 
  if(downList) downList.innerHTML = "";

  for(var w=0; w<cwWordsPlaced.length; w++) {
    var wp = cwWordsPlaced[w];
    var li = document.createElement("li");
    li.className = "cw-clue-item";
    li.id = "cw-clue-" + wp.id;
    li.innerHTML = "<span class='cw-clue-num'>" + wp.num + ".</span> " + wp.clue;
    if (wp.dir === 'H' && acrossList) acrossList.appendChild(li);
    else if (downList) downList.appendChild(li);
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
      inp.value = expected; 
      allCorrect = false;
    }
  });
  
  document.querySelector("#cw-submit-btn").hidden = true;
  document.querySelector("#cw-result-summary").hidden = false;
  var title = document.querySelector("#cw-result-title");
  if (title) {
    if (allCorrect) {
      title.textContent = "Tuyệt Vời! Ô chữ đã được giải mã 100%!";
      title.style.color = "var(--lime)";
    } else {
      title.textContent = "Chưa hoàn hảo. Hãy xem lại các ô đỏ!";
      title.style.color = "var(--rose)";
    }
  }
  window.scrollTo(0, document.body.scrollHeight);
}

// ==========================================
// VIEWS & GIAO DIỆN CHÍNH
// ==========================================

function renderWords() {
  var words = activeSet().cards;
  var rememberedCount = Object.keys(statusByWord).filter(function(k) { return statusByWord[k] === "remembered"; }).length;
  var reviewCount = Object.keys(statusByWord).filter(function(k) { return statusByWord[k] === "review"; }).length;
  
  var tc = document.querySelector("#total-count");
  if (tc) tc.textContent = formatCount(words.length);
  var ac = document.querySelector("#all-count");
  if (ac) ac.textContent = formatCount(words.length);
  var remC = document.querySelector("#remembered-count");
  if (remC) remC.textContent = formatCount(rememberedCount);
  var revC = document.querySelector("#review-count");
  if (revC) revC.textContent = formatCount(reviewCount);
  
  renderSetProgress();
  var list = document.querySelector("#word-list");
  if (!list) return;
  list.innerHTML = "";
  
  var entries = activeCategory === "all" ? words : words.filter(function(entry) { return statusByWord[entry.word] === activeCategory; });
  if (!entries.length) {
    var empty = document.createElement("p");
    empty.className = "empty-list";
    empty.textContent = activeCategory === "remembered" ? "Words you remember will find a home here." : "Nothing to revisit yet. Keep up the good work.";
    list.appendChild(empty);
    return;
  }
  entries.forEach(function(entry, index) {
    var status = statusByWord[entry.word] || "new";
    var row = document.createElement("div");
    row.className = "word-row";
    row.style.animationDelay = Math.min(index * 24, 144) + "ms";
    
    var wordNode = document.createElement("span");
    wordNode.className = "row-word";
    wordNode.textContent = entry.word;
    
    var posNode = document.createElement("span");
    posNode.className = "row-pos";
    posNode.textContent = entry.pos || "";
    
    var transNode = document.createElement("span");
    transNode.className = "row-translation";
    transNode.textContent = entry.translation || "";
    
    var statusLabel = document.createElement("span");
    statusLabel.className = "row-status status-" + status;
    statusLabel.textContent = status === "remembered" ? "✓ Remembered" : status === "review" ? "× Review" : "— New";
    
    row.appendChild(wordNode);
    row.appendChild(posNode);
    row.appendChild(transNode);
    row.appendChild(statusLabel);
    list.appendChild(row);
  });
}

function renderHome() {
  var setGrid = document.querySelector("#home-set-grid");
  if (!setGrid) return;
  setGrid.innerHTML = "";
  allSets.forEach(function(set, index) {
    var statuses = statusBySet[set.id] || {};
    var rememberedCount = Object.keys(statuses).filter(function(k) { return statuses[k] === "remembered"; }).length;
    var option = document.createElement("button");
    option.className = "home-set-option" + (set.id === activeSetId ? " is-selected" : "");
    option.type = "button";
    option.setAttribute("aria-pressed", String(set.id === activeSetId));

    var label = document.createElement("span");
    label.className = "home-set-label";
    label.textContent = "SET " + formatCount(index + 1) + " · " + formatCount(set.cards.length) + " WORDS";
    
    var nameNode = document.createElement("span");
    nameNode.className = "home-set-name";
    nameNode.textContent = set.name;
    
    var progress = document.createElement("span");
    progress.className = "home-set-progress";
    progress.textContent = rememberedCount + " / " + set.cards.length + " remembered";
    
    var arrow = document.createElement("span");
    arrow.className = "home-set-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    
    option.appendChild(label);
    option.appendChild(nameNode);
    option.appendChild(progress);
    option.appendChild(arrow);

    if (set.id.indexOf("firebase-") === 0) {
      option.style.position = "relative";
      var delBtn = document.createElement("button");
      delBtn.textContent = "🗑 Xóa";
      delBtn.style.position = "absolute";
      delBtn.style.bottom = "12px";
      delBtn.style.right = "12px";
      delBtn.style.fontSize = "12px";
      delBtn.style.color = "white";
      delBtn.style.padding = "4px 8px";
      delBtn.style.border = "none";
      delBtn.style.borderRadius = "4px";
      delBtn.style.backgroundColor = "var(--rose)";
      delBtn.style.cursor = "pointer";
      delBtn.style.zIndex = "10";
      
      delBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bộ từ: " + set.name + "?")) {
          delBtn.textContent = "...";
          var realId = set.id.replace("firebase-", "");
          if (db) {
            db.collection("decks").doc(realId).delete().then(function() {
              var idx = -1;
              for(var k=0; k<allSets.length; k++){
                if(allSets[k].id === set.id) { idx = k; break; }
              }
              if (idx > -1) allSets.splice(idx, 1);
              setsById.delete(set.id);
              if (activeSetId === set.id) {
                 changeSet(allSets[0] ? allSets[0].id : "essentials");
              } else {
                 renderHome();
                 updateSelectDropdowns();
              }
            }).catch(function(err) {
               alert("Lỗi khi xóa: " + err.message);
               delBtn.textContent = "🗑 Xóa";
            });
          }
        }
      });
      option.appendChild(delBtn);
    }
    option.addEventListener("click", function() { changeSet(set.id); });
    setGrid.appendChild(option);
  });

  var selectedSet = activeSet();
  var previewTitle = document.querySelector("#preview-title");
  if (previewTitle) previewTitle.textContent = selectedSet.name;
  var previewCount = document.querySelector("#preview-count");
  if (previewCount) previewCount.textContent = formatCount(selectedSet.cards.length) + " WORDS";
  
  var previewList = document.querySelector("#preview-list");
  if (!previewList) return;
  previewList.innerHTML = "";
  selectedSet.cards.forEach(function(entry) {
    var row = document.createElement("li");
    row.className = "preview-word-row";
    
    var wordNode = document.createElement("span");
    wordNode.className = "preview-word";
    wordNode.textContent = entry.word;
    
    var posNode = document.createElement("span");
    posNode.className = "preview-pos";
    posNode.textContent = entry.pos || "";
    
    var transNode = document.createElement("span");
    transNode.className = "preview-translation";
    transNode.textContent = entry.translation || "";
    
    row.appendChild(wordNode);
    row.appendChild(posNode);
    row.appendChild(transNode);
    previewList.appendChild(row);
  });
}

function parseRawVocabulary(text) {
  var lines = text.trim().split("\n");
  var cards = [];

  lines.forEach(function(line) {
    line = line.trim();
    if (!line) return;

    var word = "";
    var pos = "word";
    var phonetic = "";
    var translation = "";
    var synonyms = [];
    var example = "";

    var firstSplit = [];
    if (line.indexOf("\t") !== -1) {
      var idx = line.indexOf("\t");
      firstSplit = [line.slice(0, idx), line.slice(idx + 1)];
    } else if (line.indexOf(" - ") !== -1) {
      var idx2 = line.indexOf(" - ");
      firstSplit = [line.slice(0, idx2), line.slice(idx2 + 3)];
    } else if (line.indexOf("-") !== -1) {
      var idx3 = line.indexOf("-");
      firstSplit = [line.slice(0, idx3), line.slice(idx3 + 1)];
    } else {
      var idx4 = line.indexOf(" ");
      if (idx4 !== -1) {
         firstSplit = [line.slice(0, idx4), line.slice(idx4 + 1)];
      } else {
         return; 
      }
    }

    word = firstSplit[0].trim();
    var restOfLine = firstSplit[1].trim();
    var parts = [restOfLine];
    if (restOfLine.indexOf("|") !== -1) {
       parts = restOfLine.split("|").map(function(p) { return p.trim(); }).filter(Boolean);
    }

    var defText = parts[0];
    var posMatch = defText.match(/\((v\.|n\.|adj\.|adv\.|noun|verb|adjective|adverb|idiom)\)/i);
    if (posMatch) {
      var rawPos = posMatch[1].toLowerCase().replace(".", "");
      pos = rawPos === "v" ? "verb" : rawPos === "n" ? "noun" : rawPos === "adj" ? "adjective" : rawPos === "adv" ? "adverb" : rawPos;
      defText = defText.replace(posMatch[0], "").trim();
    }
    translation = defText;

    for (var i = 1; i < parts.length; i++) {
      var chunk = parts[i];
      if (chunk.indexOf("/") === 0 && chunk.lastIndexOf("/") === chunk.length - 1) {
        phonetic = chunk;
      } else if (/^(vd|ex):/i.test(chunk)) {
        example = chunk.replace(/^(vd|ex):\s*/i, "").trim();
      } else if (/^(đồng nghĩa|synonyms):/i.test(chunk)) {
        var synText = chunk.replace(/^(đồng nghĩa|synonyms):\s*/i, "").trim();
        synonyms = synText.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
      }
    }

    if (word && translation) {
      cards.push({
        word: word,
        pos: pos,
        phonetic: phonetic,
        translation: translation,
        synonyms: synonyms,
        example: example || "Example sentence with " + word + "."
      });
    }
  });

  return cards;
}

var btnSaveFirebase = document.getElementById("btn-save-firebase");
if (btnSaveFirebase) {
  btnSaveFirebase.addEventListener("click", function() {
    if (!db) { alert("Chưa kết nối được với Firebase. Vui lòng tải lại trang!"); return; }
    var titleObj = document.getElementById("deck-title");
    var rawObj = document.getElementById("import-input");
    var title = titleObj ? titleObj.value.trim() : "";
    var rawText = rawObj ? rawObj.value.trim() : "";

    if (!title || !rawText) { alert("Vui lòng nhập tên bộ từ và danh sách!"); return; }

    var cards = parseRawVocabulary(rawText);
    if (cards.length === 0) { alert("Định dạng chưa đúng!"); return; }

    btnSaveFirebase.innerText = "Đang lưu...";
    btnSaveFirebase.disabled = true;

    db.collection("decks").add({
      name: title,
      cards: cards,
      createdAt: new Date().toISOString()
    }).then(function() {
      alert("Tạo bộ từ thành công!");
      if (titleObj) titleObj.value = "";
      if (rawObj) rawObj.value = "";
      var customSetSection = document.querySelector("#custom-set-section");
      if (customSetSection) customSetSection.hidden = true;
      btnSaveFirebase.innerText = "Lưu & Chia Sẻ Lên Server";
      btnSaveFirebase.disabled = false;
      syncOnlineDecks();
    }).catch(function(err) {
      alert("Lỗi lưu dữ liệu.");
      btnSaveFirebase.innerText = "Lưu & Chia Sẻ Lên Server";
      btnSaveFirebase.disabled = false;
    });
  });
}

function syncOnlineDecks() {
  if (!db) return;
  db.collection("decks").orderBy("createdAt", "desc").get()
  .then(function(snapshot) {
    var added = false;
    snapshot.forEach(function(doc) {
      var data = doc.data();
      var onlineSetId = "firebase-" + doc.id;
      if (!setsById.has(onlineSetId)) {
        var newSet = { id: onlineSetId, name: data.name, cards: data.cards };
        allSets.push(newSet);
        setsById.set(onlineSetId, newSet);
        added = true;
      }
    });
    if (added) {
       updateSelectDropdowns();
       if (setsById.has(activeSetId)) {
         changeSet(activeSetId);
       } else if (allSets.length > 0) {
         changeSet(allSets[0].id);
       }
    }
  }).catch(function(err) { console.warn("Lỗi đồng bộ:", err); });
}

// ==========================================
// CÁC SỰ KIỆN GIAO DIỆN
// ==========================================

if (reviewButton) reviewButton.addEventListener("click", function() { gradeCard("review"); });
if (rememberButton) rememberButton.addEventListener("click", function() { gradeCard("remembered"); });
var restartBtn = document.querySelector("#restart-button");
if (restartBtn) restartBtn.addEventListener("click", startStudy);

var previewStart = document.querySelector("#preview-start");
if (previewStart) previewStart.addEventListener("click", function() { setView("study"); });

document.querySelectorAll(".study-order-button").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".study-order-button").forEach(function(b) {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    currentOrderMode = btn.getAttribute("data-study-order");
    if (studyView && studyView.hidden === false) startStudy();
  });
});

var finishEarlyBtn = document.querySelector("#finish-early");
if (finishEarlyBtn) {
  finishEarlyBtn.addEventListener("click", function() {
    if (waitingInterval) { clearInterval(waitingInterval); waitingInterval = null; }
    showCompletion();
  });
}

// Bắt sự kiện tạo bộ từ
var toggleAddSetBtn = document.querySelector("#toggle-add-set-btn");
var customSetSection = document.querySelector("#custom-set-section");
if (toggleAddSetBtn) {
  toggleAddSetBtn.addEventListener("click", function() {
    if (customSetSection) customSetSection.hidden = !customSetSection.hidden;
  });
}
var btnCancelCreate = document.querySelector("#btn-cancel-create");
if (btnCancelCreate) {
  btnCancelCreate.addEventListener("click", function() {
    if (customSetSection) customSetSection.hidden = true;
  });
}

// Sự kiện bài Test
var testStartBtn = document.querySelector("#test-start-btn");
if (testStartBtn) testStartBtn.addEventListener("click", generateTestQuestions);

var testSubmitBtn = document.querySelector("#test-submit-btn");
if (testSubmitBtn) testSubmitBtn.addEventListener("click", submitFullTest);

var testAbortBtn = document.querySelector("#test-abort-btn");
if (testAbortBtn) {
  testAbortBtn.addEventListener("click", function() {
    if (confirm("Hủy bài kiểm tra hiện tại?")) {
      var runPanel = document.querySelector("#test-run-panel");
      var setupPanel = document.querySelector("#test-setup-panel");
      if (runPanel) runPanel.hidden = true;
      if (setupPanel) setupPanel.hidden = false;
    }
  });
}

var testRetryBtn = document.querySelector("#test-retry-btn");
if (testRetryBtn) {
  testRetryBtn.addEventListener("click", function() {
    var summary = document.querySelector("#test-result-summary");
    var runPanel = document.querySelector("#test-run-panel");
    var setupPanel = document.querySelector("#test-setup-panel");
    if (summary) summary.hidden = true;
    if (runPanel) runPanel.hidden = true;
    if (setupPanel) setupPanel.hidden = false;
  });
}

// Sự kiện Game Crossword
var cwStartBtn = document.querySelector("#cw-start-btn");
if (cwStartBtn) cwStartBtn.addEventListener("click", generateCrossword);

var cwSubmitBtn = document.querySelector("#cw-submit-btn");
if (cwSubmitBtn) cwSubmitBtn.addEventListener("click", submitCrossword);

var cwAbortBtn = document.querySelector("#cw-abort-btn");
if (cwAbortBtn) {
  cwAbortBtn.addEventListener("click", function() {
    if(confirm("Thoát ván chơi hiện tại?")) {
      var runPanel = document.querySelector("#cw-run-panel");
      var setupPanel = document.querySelector("#cw-setup-panel");
      if (runPanel) runPanel.hidden = true;
      if (setupPanel) setupPanel.hidden = false;
    }
  });
}

var cwRetryBtn = document.querySelector("#cw-retry-btn");
if (cwRetryBtn) {
  cwRetryBtn.addEventListener("click", function() {
    var summary = document.querySelector("#cw-result-summary");
    var runPanel = document.querySelector("#cw-run-panel");
    var setupPanel = document.querySelector("#cw-setup-panel");
    if (summary) summary.hidden = true;
    if (runPanel) runPanel.hidden = true;
    if (setupPanel) setupPanel.hidden = false;
  });
}

var backToStudy2 = document.querySelector("#back-to-study");
if (backToStudy2) backToStudy2.addEventListener("click", function() { setView("study"); });

var themeSelect2 = document.querySelector("#theme-select");
if (themeSelect2) themeSelect2.addEventListener("change", function(event) { applyTheme(event.target.value); });

var voiceGender = document.querySelector("#voice-gender");
var voiceSpeed = document.querySelector("#voice-speed");
var voiceOnCard = document.querySelector("#voice-on-card");
var voiceOnFlip = document.querySelector("#voice-on-flip");

if (voiceGender) voiceGender.value = voiceSettings.gender;
if (voiceSpeed) voiceSpeed.value = voiceSettings.speed;
if (voiceOnCard) voiceOnCard.checked = voiceSettings.onCard;
if (voiceOnFlip) voiceOnFlip.checked = voiceSettings.onFlip;

document.querySelectorAll("#voice-gender, #voice-speed, #voice-on-card, #voice-on-flip").forEach(function(control) {
  control.addEventListener("change", function() {
    voiceSettings = {
      gender: voiceGender ? voiceGender.value : "female",
      speed: voiceSpeed ? voiceSpeed.value : "normal",
      onCard: voiceOnCard ? voiceOnCard.checked : true,
      onFlip: voiceOnFlip ? voiceOnFlip.checked : true
    };
    saveVoiceSettings();
    updateVoiceNote();
  });
});

document.querySelectorAll(".listen-button").forEach(function(button) {
  button.addEventListener("click", function(event) {
    event.stopPropagation();
    var entry = currentWord();
    if (entry) speakWord(entry.word);
  });
});

if (supportsSpeech) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
} else {
  document.querySelectorAll(".listen-button").forEach(function(button) { button.disabled = true; });
  [voiceGender, voiceSpeed, voiceOnCard, voiceOnFlip].forEach(function(control) { if (control) control.disabled = true; });
  updateVoiceNote();
}

var settingsMenu2 = document.querySelector("#settings-menu");
if (settingsMenu2) {
  settingsMenu2.addEventListener("click", function(event) { event.stopPropagation(); });
}
document.addEventListener("click", function() { if (settingsMenu2) settingsMenu2.open = false; });
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && settingsMenu2) settingsMenu2.open = false;
});

var wordmark2 = document.querySelector(".wordmark");
if (wordmark2) {
  wordmark2.addEventListener("click", function(event) {
    event.preventDefault();
    setView("home");
  });
}

if (flashcard) {
  flashcard.addEventListener("click", function(event) {
    if (event.target.closest(".listen-button")) return;
    setCardFace(!flashcard.classList.contains("is-flipped"));
  });
  flashcard.addEventListener("keydown", function(event) {
    if (event.target.closest(".listen-button")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setCardFace(!flashcard.classList.contains("is-flipped"));
    }
  });
}

document.querySelectorAll(".set-select").forEach(function(select) {
  select.addEventListener("change", function() { changeSet(select.value); });
});

document.querySelectorAll(".nav-link").forEach(function(button) {
  button.addEventListener("click", function() { setView(button.dataset.view); });
});

document.querySelectorAll(".list-tab").forEach(function(button) {
  button.addEventListener("click", function() {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".list-tab").forEach(function(tab) {
      var isActive = tab === button;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    renderWords();
  });
});

var resetProg2 = document.querySelector("#reset-progress");
if (resetProg2) {
  resetProg2.addEventListener("click", function() {
    if (Object.keys(statusByWord).length === 0) return;
    statusByWord = {};
    statusBySet[activeSetId] = statusByWord;
    saveProgress();
    startStudy();
    renderHome();
    if (wordsView && wordsView.hidden === false) renderWords();
  });
}

document.addEventListener("keydown", function(event) {
  if (event.target instanceof HTMLElement && ["BUTTON", "A", "INPUT", "TEXTAREA"].indexOf(event.target.tagName) !== -1) return;
  if (event.target === flashcard) return;
  var cardScene = document.querySelector("#card-scene");
  if (!studyView || studyView.hidden || (cardScene && cardScene.hidden)) return;
  
  if (event.key === " ") {
    event.preventDefault();
    if (flashcard) setCardFace(!flashcard.classList.contains("is-flipped"));
  }
  if (event.key === "ArrowLeft") gradeCard("review");
  if (event.key === "ArrowRight") gradeCard("remembered");
});

// Khởi chạy
applyTheme(loadTheme());
updateSelectDropdowns();
startStudy();
renderWords();
renderHome();
syncOnlineDecks();