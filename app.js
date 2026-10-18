// --- KẾT NỐI VÀ ĐỒNG BỘ DỮ LIỆU FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCX_30nYbSoKmyyLBQBjTW_0K1zTUnm6CU",
  authDomain: "muy-flashcards.firebaseapp.com",
  projectId: "muy-flashcards",
  storageBucket: "muy-flashcards.firebasestorage.app",
  messagingSenderId: "745907745384",
  appId: "1:745907745384:web:826faa570f76bcfdeec1dd",
  measurementId: "G-L72QT1NLPH"
};

let db = null;
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

const storageKey = "marginalia-sat-progress-v2";
const legacyStorageKey = "marginalia-sat-progress-v1";
const activeSetStorageKey = "marginalia-sat-active-set-v1";

const allSets = (typeof sets !== "undefined" && Array.isArray(sets)) ? sets : [];
let setsById = new Map(allSets.map(function(set) { return [set.id, set]; }));

const flashcard = document.querySelector("#flashcard");
const reviewButton = document.querySelector("#review-button");
const rememberButton = document.querySelector("#remember-button");
const homeView = document.querySelector("#home-view");
const studyView = document.querySelector("#study-view");
const wordsView = document.querySelector("#words-view");
const testView = document.querySelector("#test-view"); // KHAI BÁO TEST VIEW
const progressTrack = document.querySelector("#progress-track");
const themeStorageKey = "sat-vocab-theme-v1";
const voiceSettingsStorageKey = "sat-vocab-voice-settings-v1";
const supportsSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

let activeSetId = loadActiveSet();
let statusBySet = loadProgress();
let statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
let activeCategory = "all";
let voiceSettings = loadVoiceSettings();
let availableVoices = [];

// Biến cho Study Mode
let studyQueue = [];
let currentCardObj = null;
let totalCardsInSession = 0;
let completedCardsInSession = 0;
let waitingInterval = null;
let currentOrderMode = "alphabetical"; 
let sessionReviewWords = {};
let sessionRememberedWords = {};
let cardsSeenInSession = {}; 

// --- BIẾN CHO TEST MODE (MỚI) ---
let testQuestions = []; // Lưu danh sách các câu hỏi được sinh ra
let testMode = "meaning-word";

function activeSet() {
  return setsById.get(activeSetId) || allSets[0] || { id: "default", name: "Empty", cards: [] };
}

function loadActiveSet() {
  const fallback = (allSets[0] && allSets[0].id) ? allSets[0].id : "essentials";
  try {
    const savedSetId = localStorage.getItem(activeSetStorageKey);
    return setsById.has(savedSetId) ? savedSetId : fallback;
  } catch (e) {
    return fallback;
  }
}

function loadVoiceSettings() {
  const defaults = { gender: "female", speed: "normal", onCard: true, onFlip: true };
  try {
    const saved = JSON.parse(localStorage.getItem(voiceSettingsStorageKey) || "null");
    if (!saved || typeof saved !== "object") return defaults;
    return {
      gender: ["female", "male"].includes(saved.gender) ? saved.gender : defaults.gender,
      speed: ["normal", "slow"].includes(saved.speed) ? saved.speed : defaults.speed,
      onCard: saved.version === 2 ? saved.onCard === true : true,
      onFlip: saved.version === 2 ? saved.onFlip === true : true
    };
  } catch (e) {
    return defaults;
  }
}

function saveVoiceSettings() {
  try {
    localStorage.setItem(voiceSettingsStorageKey, JSON.stringify(Object.assign({}, voiceSettings, { version: 2 })));
  } catch (e) {}
}

function applyTheme(theme) {
  const selectedTheme = ["green", "red", "graphite"].includes(theme) ? theme : "green";
  document.documentElement.dataset.theme = selectedTheme;
  const select = document.querySelector("#theme-select");
  if (select) select.value = selectedTheme;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    const colors = { green: "#171916", red: "#1d1718", graphite: "#17191d" };
    metaTheme.content = colors[selectedTheme];
  }
  try {
    localStorage.setItem(themeStorageKey, selectedTheme);
  } catch (e) {}
}

function loadTheme() {
  try {
    return localStorage.getItem(themeStorageKey) || "green";
  } catch (e) {
    return "green";
  }
}

function refreshVoices() {
  if (!supportsSpeech) return;
  availableVoices = window.speechSynthesis.getVoices();
  updateVoiceNote();
}

function preferredVoice() {
  const englishVoices = availableVoices.filter(function(voice) { return voice.lang.toLowerCase().startsWith("en"); });
  const voiceNamePatterns = voiceSettings.gender === "female"
    ? /\b(?:female|woman|zira|samantha|victoria|karen|moira|tessa|susan|aria|jenny|linda|amy|allison|ava|siri.*(?:1|2|3|4|5|6|7|8|9))\b/i
    : /\b(?:male|man|david|alex|daniel|james|guy|ryan|fred|tom|george|mark|aaron|arthur|oliver|lee|thomas|rishi)\b/i;
  const matchedVoice = englishVoices.find(function(voice) { return voiceNamePatterns.test(voice.name); });
  return matchedVoice || englishVoices[0] || null;
}

function updateVoiceNote(message) {
  const note = document.querySelector("#voice-note");
  if (!note) return;
  if (message) {
    note.textContent = message;
    return;
  }
  const voice = preferredVoice();
  note.textContent = voice
    ? "Using " + voice.name + (voiceNameMatchesGender(voice) ? "" : " with " + voiceSettings.gender + "-leaning pitch.")
    : "No English voice is available yet. Try again after voices load.";
}

function voiceNameMatchesGender(voice) {
  const pattern = voiceSettings.gender === "female"
    ? /\b(?:female|woman|zira|samantha|victoria|karen|moira|tessa|susan|aria|jenny|linda|amy|allison|ava)\b/i
    : /\b(?:male|man|david|alex|daniel|james|guy|ryan|fred|tom|george|mark|aaron|arthur|oliver|lee|thomas|rishi)\b/i;
  return pattern.test(voice.name);
}

function speakWord(word) {
  if (!supportsSpeech || !word) return false;
  const synthesis = window.speechSynthesis;
  if (synthesis.speaking || synthesis.pending) synthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(word);
  const voice = preferredVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }
  utterance.rate = voiceSettings.speed === "slow" ? 0.72 : 1;
  utterance.pitch = voiceNameMatchesGender(voice || { name: "" })
    ? 1
    : voiceSettings.gender === "female" ? 1.18 : 0.82;
  utterance.onstart = function() { updateVoiceNote(voice ? "Speaking with " + voice.name + "." : "Speaking with default English voice."); };
  utterance.onerror = function(event) {
    if (event.error !== "canceled" && event.error !== "interrupted") {
      updateVoiceNote("Playback failed. Check English speech voice on device.");
    }
  };
  if (synthesis.paused) synthesis.resume();
  synthesis.speak(utterance);
  return true;
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object") {
      const result = {};
      allSets.forEach(function(set) {
        const wordsInSet = new Set(set.cards.map(function(entry) { return entry.word; }));
        const statuses = saved[set.id] && typeof saved[set.id] === "object" ? saved[set.id] : {};
        const filtered = {};
        for (const key in statuses) {
          if (wordsInSet.has(key) && (statuses[key] === "review" || statuses[key] === "remembered")) {
            filtered[key] = statuses[key];
          }
        }
        result[set.id] = filtered;
      });
      return result;
    }
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey) || "{}");
    const firstSetCards = allSets[0] ? allSets[0].cards : [];
    const firstSetWords = new Set(firstSetCards.map(function(entry) { return entry.word; }));
    const filteredLegacy = {};
    for (const key in legacy) {
      if (firstSetWords.has(key) && (legacy[key] === "review" || legacy[key] === "remembered")) {
        filteredLegacy[key] = legacy[key];
      }
    }
    const defaultId = allSets[0] ? allSets[0].id : "essentials";
    const res = {};
    res[defaultId] = filteredLegacy;
    return res;
  } catch (e) {
    const errorRes = {};
    allSets.forEach(function(set) { errorRes[set.id] = {}; });
    return errorRes;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(statusBySet));
  } catch (e) {}
}

function currentWord() {
  if (!currentCardObj) return null;
  const cards = activeSet().cards;
  const found = cards.find(function(entry) { return entry.word === currentCardObj.word; });
  return found || cards[0];
}

function formatCount(count) {
  return String(count).padStart(2, "0");
}

function highlightWord(sentence, word) {
  if (!sentence) return [document.createTextNode("")];
  const cleanWord = (word || "").trim();
  const cleanWordStem = cleanWord.length > 4 ? cleanWord.slice(0, 4) : cleanWord;
  
  let position = sentence.toLowerCase().indexOf(cleanWord.toLowerCase());
  let matchLen = cleanWord.length;
  
  if (position === -1 && cleanWordStem.length >= 3) {
    position = sentence.toLowerCase().indexOf(cleanWordStem.toLowerCase());
    if (position !== -1) {
      const spaceIdx = sentence.indexOf(" ", position);
      matchLen = spaceIdx === -1 ? sentence.length - position : spaceIdx - position;
      matchLen = sentence.slice(position, position + matchLen).replace(/[^a-zA-Z]/g, "").length;
    }
  }

  if (position === -1) return [document.createTextNode(sentence)];
  const highlighted = document.createElement("em");
  highlighted.textContent = sentence.slice(position, position + matchLen);
  return [
    document.createTextNode(sentence.slice(0, position)),
    highlighted,
    document.createTextNode(sentence.slice(position + matchLen))
  ];
}

function setCardFace(isFlipped) {
  if (!flashcard) return;
  flashcard.classList.toggle("is-flipped", isFlipped);
  const front = document.querySelector("#card-front");
  const back = document.querySelector("#card-back");
  if (front) front.setAttribute("aria-hidden", String(isFlipped));
  if (back) back.setAttribute("aria-hidden", String(!isFlipped));
  flashcard.setAttribute("aria-label", isFlipped ? "Definition revealed. Press Enter or Space to see the word again." : "Vocabulary card. Press Enter or Space to reveal the definition.");
  if (isFlipped && voiceSettings.onFlip && studyView && !studyView.hidden) {
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

// --- THUẬT TOÁN ĐIỀU KHIỂN RÚT THẺ VÀ HẸN GIỜ (STUDY MODE) ---
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

  const now = Date.now();
  let availableCards = [];
  
  for (let i = 0; i < studyQueue.length; i++) {
     if (studyQueue[i].availableAt <= now) {
        availableCards.push({ card: studyQueue[i], index: i });
     }
  }

  let nextIdx = -1;
  if (availableCards.length > 0) {
     let reviews = availableCards.filter(function(item) { return item.card.availableAt > 0; });
     if (reviews.length > 0) {
        reviews.sort(function(a, b) { return a.card.availableAt - b.card.availableAt; });
        nextIdx = reviews[0].index;
     } else {
        nextIdx = availableCards[0].index;
     }
  }

  if (nextIdx !== -1) {
    const waitPanel = document.querySelector("#review-waiting");
    if (waitPanel) waitPanel.hidden = true;
    const cardScene = document.querySelector("#card-scene");
    if (cardScene) cardScene.hidden = false;
    const answerArea = document.querySelector("#answer-area");
    if (answerArea) answerArea.hidden = false;

    currentCardObj = studyQueue.splice(nextIdx, 1)[0];
    renderCard();
  } else {
    currentCardObj = null;
    const cardScene = document.querySelector("#card-scene");
    if (cardScene) cardScene.hidden = true;
    const answerArea = document.querySelector("#answer-area");
    if (answerArea) answerArea.hidden = true;
    const waitPanel = document.querySelector("#review-waiting");
    if (waitPanel) waitPanel.hidden = false;

    let minTime = studyQueue[0].availableAt;
    for (let j = 1; j < studyQueue.length; j++) {
      if (studyQueue[j].availableAt < minTime) minTime = studyQueue[j].availableAt;
    }

    updateCountdown(minTime);
    waitingInterval = setInterval(function() {
      if (Date.now() >= minTime) {
        renderNextCard(); 
      } else {
        updateCountdown(minTime);
      }
    }, 1000);
  }
}

function updateCountdown(targetTime) {
  const diff = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
  const m = String(Math.floor(diff / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  const el = document.querySelector("#review-countdown");
  if (el) el.textContent = m + ":" + s;
}

function renderCard() {
  const entry = currentWord();
  if (!entry) return;
  
  let displayIndex = Object.keys(cardsSeenInSession).length;
  if (!cardsSeenInSession[entry.word]) displayIndex += 1;
  if (displayIndex > totalCardsInSession) displayIndex = totalCardsInSession;
  if (displayIndex === 0) displayIndex = 1;

  const cardIndex = document.querySelector("#card-index");
  if (cardIndex) cardIndex.innerHTML = formatCount(displayIndex) + " <span>/ " + formatCount(totalCardsInSession) + "</span>";
  
  const frontPos = document.querySelector("#front-pos");
  if (frontPos) frontPos.textContent = (entry.pos || "word").toUpperCase();
  
  const frontWord = document.querySelector("#front-word");
  if (frontWord) frontWord.textContent = entry.word;
  
  const frontPhonetic = document.querySelector("#front-phonetic");
  if (frontPhonetic) frontPhonetic.textContent = entry.phonetic || "";
  
  const backWord = document.querySelector("#back-word");
  if (backWord) backWord.textContent = entry.word;
  
  const backTranslation = document.querySelector("#back-translation");
  if (backTranslation) backTranslation.textContent = entry.translation || "";
  
  document.querySelectorAll(".card-set-name").forEach(function(label) { 
    label.textContent = activeSet().name.toUpperCase(); 
  });
  
  const syns = Array.isArray(entry.synonyms) ? entry.synonyms : [];
  const backSynonyms = document.querySelector("#back-synonyms");
  if (backSynonyms) {
    backSynonyms.innerHTML = "";
    syns.forEach(function(synonym, index) {
      backSynonyms.appendChild(document.createTextNode(synonym));
      if (index < syns.length - 1) {
        const separator = document.createElement("span");
        separator.textContent = " · ";
        backSynonyms.appendChild(separator);
      }
    });
  }
  
  const backExample = document.querySelector("#back-example");
  if (backExample) {
    backExample.innerHTML = "";
    const nodes = highlightWord(entry.example || "", entry.word);
    nodes.forEach(function(n) { backExample.appendChild(n); });
  }
  
  const progressLabel = document.querySelector("#progress-label");
  if (progressLabel) progressLabel.innerHTML = formatCount(displayIndex) + " <span>/</span> " + formatCount(totalCardsInSession);
  
  if (progressTrack) {
    progressTrack.setAttribute("aria-valuemax", String(totalCardsInSession));
    progressTrack.setAttribute("aria-valuenow", String(completedCardsInSession));
  }
  const fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = ((completedCardsInSession / (totalCardsInSession || 1)) * 100) + "%";
  
  const revTally = document.querySelector("#review-tally");
  if (revTally) revTally.textContent = String(Object.keys(sessionReviewWords).length);
  const remTally = document.querySelector("#remember-tally");
  if (remTally) remTally.textContent = String(Object.keys(sessionRememberedWords).length);
  
  const easyDelay = document.querySelector("#easy-delay");
  if (easyDelay) {
    easyDelay.textContent = currentCardObj.step === 0 ? "Show in 2 min" : "Finish";
  }
  
  renderSetProgress();
  setCardFace(false);
  if (voiceSettings.onCard && studyView && !studyView.hidden) speakWord(entry.word);
}

function showCompletion() {
  if (flashcard) flashcard.classList.remove("is-flipped");
  const cardScene = document.querySelector("#card-scene");
  if (cardScene) cardScene.hidden = true;
  const answerArea = document.querySelector("#answer-area");
  if (answerArea) answerArea.hidden = true;
  const waitPanel = document.querySelector("#review-waiting");
  if (waitPanel) waitPanel.hidden = true;
  const completionPanel = document.querySelector("#completion-panel");
  if (completionPanel) completionPanel.hidden = false;
  
  const progressLabel = document.querySelector("#progress-label");
  if (progressLabel) progressLabel.innerHTML = formatCount(totalCardsInSession) + " <span>/</span> " + formatCount(totalCardsInSession);
  const fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = "100%";
  if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(totalCardsInSession));
  
  const finalReview = Object.keys(sessionReviewWords).length;
  const finalRemember = Object.keys(sessionRememberedWords).length;
  const compCopy = document.querySelector("#completion-copy");
  if (compCopy) compCopy.textContent = finalRemember + " remembered · " + finalReview + " to revisit. Every word gets easier with practice.";
}

function startStudy() {
  sessionReviewWords = {};
  sessionRememberedWords = {};
  cardsSeenInSession = {};
  completedCardsInSession = 0;

  const cards = activeSet().cards;
  totalCardsInSession = cards.length;
  let initialWords = cards.map(function(c) { return c.word; });
  
  if (currentOrderMode === "random") {
    for (let i = initialWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = initialWords[i];
      initialWords[i] = initialWords[j];
      initialWords[j] = temp;
    }
  } else {
    initialWords.sort(function(a, b) { return a.localeCompare(b); });
  }

  studyQueue = initialWords.map(function(w) { return { word: w, availableAt: 0, step: 0 }; });

  const completionPanel = document.querySelector("#completion-panel");
  if (completionPanel) completionPanel.hidden = true;
  const waitPanel = document.querySelector("#review-waiting");
  if (waitPanel) waitPanel.hidden = true;
  renderNextCard();
}

// ==========================================
// TÍNH NĂNG TEST MỚI TẠO BÀI TẬP DẠNG DANH SÁCH (QUIZLET)
// ==========================================

function normalizeStr(str) {
  return (str || "").trim().toLowerCase().replace(/[.,!?;:()]/g, '');
}

function updateTestRangeBounds() {
  const cards = activeSet().cards;
  const maxVal = cards.length || 1;
  const endInput = document.querySelector("#test-end-idx");
  if (endInput) {
    endInput.max = maxVal;
    if (parseInt(endInput.value) > maxVal || !endInput.value) {
       endInput.value = maxVal;
    }
  }
}

function generateTestQuestions() {
  testMode = document.querySelector("#test-type-select").value;
  let startIdx = parseInt(document.querySelector("#test-start-idx").value) || 1;
  let endIdx = parseInt(document.querySelector("#test-end-idx").value) || 10;

  const cards = activeSet().cards;
  // Lấy thứ tự gốc của từ điển A-Z để cắt đúng vị trí
  let baseCards = [...cards].sort(function(a, b) { return a.word.localeCompare(b.word); });
  
  startIdx = Math.max(1, startIdx);
  endIdx = Math.max(startIdx, Math.min(baseCards.length, endIdx));

  let pool = baseCards.slice(startIdx - 1, endIdx);

  // Lọc nếu chọn chế độ hỏi từ đồng nghĩa
  if (testMode.includes("synonym")) {
    pool = pool.filter(function(c) { return c.synonyms && c.synonyms.length > 0; });
  }

  if (pool.length === 0) {
    alert("Dữ liệu không đủ! Nếu bạn chọn bài kiểm tra có 'Từ đồng nghĩa', hãy đảm bảo các từ trong khoảng bạn chọn có từ đồng nghĩa đi kèm.");
    return;
  }

  // Luôn trộn ngẫu nhiên để giống bài kiểm tra thật
  pool.sort(function() { return 0.5 - Math.random(); });
  testQuestions = pool;

  const container = document.querySelector("#test-questions-container");
  container.innerHTML = "";

  // Tạo khung nhập cho từng câu hỏi
  testQuestions.forEach(function(q, index) {
    let promptText = "";
    if (testMode === "meaning-word") promptText = "Nghĩa: " + q.translation;
    if (testMode === "word-meaning") promptText = "Từ vựng: " + q.word;
    if (testMode === "synonym-word") promptText = "Từ đồng nghĩa: " + q.synonyms.join(", ");
    if (testMode === "word-synonym") promptText = "Từ vựng: " + q.word + " (Hãy điền 1 từ đồng nghĩa)";

    const cardHtml = `
      <div class="test-question-card" id="test-q-${index}">
        <div class="test-q-label">Câu hỏi ${index + 1}</div>
        <div class="test-q-text">${promptText}</div>
        <input type="text" class="test-q-input" id="test-ans-${index}" placeholder="Gõ câu trả lời vào đây..." autocomplete="off">
        
        <div class="test-feedback" id="test-fb-${index}">
          <div style="font-weight: bold; font-size: 15px; margin-bottom: 8px;" id="test-badge-${index}"></div>
          <div style="margin-bottom: 6px;"><b>Đáp án chuẩn:</b> <span id="test-correct-${index}" style="color: var(--lime);"></span></div>
          <div style="color: var(--muted); margin-bottom: 6px; font-size: 13px;"><b>Phiên âm:</b> ${q.phonetic || "Không có"}</div>
          <div style="color: var(--muted); line-height: 1.5; font-size: 13px;"><b>Ví dụ:</b> <span class="test-ex-holder" data-idx="${index}"></span></div>
        </div>
      </div>
    `;
    
    // Nối div mới vào DOM
    const div = document.createElement("div");
    div.innerHTML = cardHtml;
    container.appendChild(div.firstElementChild);
    
    // In ví dụ có highlight
    const exHolder = container.querySelector(`.test-ex-holder[data-idx="${index}"]`);
    if (exHolder) {
      const nodes = highlightWord(q.example || "", q.word);
      nodes.forEach(function(n) { exHolder.appendChild(n); });
    }
  });

  document.querySelector("#test-setup-panel").hidden = true;
  document.querySelector("#test-run-panel").hidden = false;
  document.querySelector("#test-result-summary").hidden = true;
  document.querySelector("#test-submit-btn").hidden = false;
  window.scrollTo(0, 0);
}

function checkAnswer(inputVal, type, card) {
  const userStr = normalizeStr(inputVal);
  if (!userStr) return false;

  if (type === "meaning-word" || type === "synonym-word") {
    return userStr === normalizeStr(card.word);
  } 
  else if (type === "word-meaning") {
    const defStr = normalizeStr(card.translation);
    return userStr.length >= 2 && defStr.indexOf(userStr) !== -1;
  } 
  else if (type === "word-synonym") {
    const syns = (card.synonyms || []).map(normalizeStr);
    return syns.includes(userStr);
  }
  return false;
}

function submitFullTest() {
  if (!confirm("Bạn có chắc chắn muốn nộp bài?")) return;
  
  let score = 0;
  
  testQuestions.forEach(function(q, index) {
    const inputEl = document.querySelector("#test-ans-" + index);
    const inputVal = inputEl.value;
    const isCorrect = checkAnswer(inputVal, testMode, q);
    
    if (isCorrect) score++;

    // Thay đổi màu thẻ
    const cardEl = document.querySelector("#test-q-" + index);
    cardEl.classList.add("submitted");
    cardEl.classList.add(isCorrect ? "correct" : "incorrect");
    inputEl.disabled = true;

    // Gắn Badge
    const badge = document.querySelector("#test-badge-" + index);
    badge.textContent = isCorrect ? "✅ CHÍNH XÁC" : "❌ SAI";
    badge.style.color = isCorrect ? "var(--lime)" : "var(--rose)";

    // Hiện đáp án đúng
    let correctStr = "";
    if (testMode === "meaning-word" || testMode === "synonym-word") correctStr = q.word;
    if (testMode === "word-meaning") correctStr = q.translation;
    if (testMode === "word-synonym") correctStr = (q.synonyms && q.synonyms.length) ? q.synonyms.join(", ") : "Chưa có từ đồng nghĩa nào.";
    
    document.querySelector("#test-correct-" + index).textContent = correctStr;
  });

  // Hiện màn hình kết quả tổng
  document.querySelector("#test-submit-btn").hidden = true;
  document.querySelector("#test-result-summary").hidden = false;
  document.querySelector("#test-final-score").textContent = score;
  document.querySelector("#test-final-total").textContent = testQuestions.length;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Bắt sự kiện test
document.querySelector("#test-start-btn")?.addEventListener("click", generateTestQuestions);
document.querySelector("#test-submit-btn")?.addEventListener("click", submitFullTest);

document.querySelector("#test-abort-btn")?.addEventListener("click", function() {
  if (confirm("Hủy bài kiểm tra hiện tại?")) {
    document.querySelector("#test-run-panel").hidden = true;
    document.querySelector("#test-setup-panel").hidden = false;
  }
});

document.querySelector("#test-retry-btn")?.addEventListener("click", function() {
  document.querySelector("#test-result-summary").hidden = true;
  document.querySelector("#test-run-panel").hidden = true;
  document.querySelector("#test-setup-panel").hidden = false;
});

// ==========================================

function renderWords() {
  const words = activeSet().cards;
  const rememberedCount = Object.keys(statusByWord).filter(function(k) { return statusByWord[k] === "remembered"; }).length;
  const reviewCount = Object.keys(statusByWord).filter(function(k) { return statusByWord[k] === "review"; }).length;
  
  const tc = document.querySelector("#total-count");
  if (tc) tc.textContent = formatCount(words.length);
  const ac = document.querySelector("#all-count");
  if (ac) ac.textContent = formatCount(words.length);
  const remC = document.querySelector("#remembered-count");
  if (remC) remC.textContent = formatCount(rememberedCount);
  const revC = document.querySelector("#review-count");
  if (revC) revC.textContent = formatCount(reviewCount);
  
  renderSetProgress();
  const list = document.querySelector("#word-list");
  if (!list) return;
  list.innerHTML = "";
  
  const entries = activeCategory === "all" ? words : words.filter(function(entry) { return statusByWord[entry.word] === activeCategory; });
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-list";
    empty.textContent = activeCategory === "remembered" ? "Words you remember will find a home here." : "Nothing to revisit yet. Keep up the good work.";
    list.appendChild(empty);
    return;
  }
  entries.forEach(function(entry, index) {
    const status = statusByWord[entry.word] || "new";
    const row = document.createElement("div");
    row.className = "word-row";
    row.style.animationDelay = Math.min(index * 24, 144) + "ms";
    
    const wordNode = document.createElement("span");
    wordNode.className = "row-word";
    wordNode.textContent = entry.word;
    
    const posNode = document.createElement("span");
    posNode.className = "row-pos";
    posNode.textContent = entry.pos || "";
    
    const transNode = document.createElement("span");
    transNode.className = "row-translation";
    transNode.textContent = entry.translation || "";
    
    const statusLabel = document.createElement("span");
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
  const setGrid = document.querySelector("#home-set-grid");
  if (!setGrid) return;
  setGrid.innerHTML = "";
  allSets.forEach(function(set, index) {
    const statuses = statusBySet[set.id] || {};
    const rememberedCount = Object.keys(statuses).filter(function(k) { return statuses[k] === "remembered"; }).length;
    const option = document.createElement("button");
    option.className = "home-set-option" + (set.id === activeSetId ? " is-selected" : "");
    option.type = "button";
    option.setAttribute("aria-pressed", String(set.id === activeSetId));

    const label = document.createElement("span");
    label.className = "home-set-label";
    label.textContent = "SET " + formatCount(index + 1) + " · " + formatCount(set.cards.length) + " WORDS";
    
    const nameNode = document.createElement("span");
    nameNode.className = "home-set-name";
    nameNode.textContent = set.name;
    
    const progress = document.createElement("span");
    progress.className = "home-set-progress";
    progress.textContent = rememberedCount + " / " + set.cards.length + " remembered";
    
    const arrow = document.createElement("span");
    arrow.className = "home-set-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    
    option.appendChild(label);
    option.appendChild(nameNode);
    option.appendChild(progress);
    option.appendChild(arrow);

    if (set.id.startsWith("firebase-")) {
      option.style.position = "relative";
      const delBtn = document.createElement("button");
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
      
      delBtn.addEventListener("click", async function(e) {
        e.stopPropagation();
        if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bộ từ: " + set.name + "?")) {
          delBtn.textContent = "...";
          try {
            const realId = set.id.replace("firebase-", "");
            if (db) await db.collection("decks").doc(realId).delete();
            
            const idx = allSets.findIndex(function(s) { return s.id === set.id; });
            if (idx > -1) allSets.splice(idx, 1);
            setsById.delete(set.id);
            if (activeSetId === set.id) {
               changeSet(allSets[0] ? allSets[0].id : "essentials");
            } else {
               renderHome();
               updateSelectDropdowns();
            }
          } catch(err) {
             alert("Lỗi khi xóa: " + err.message);
             delBtn.textContent = "🗑 Xóa";
          }
        }
      });
      option.appendChild(delBtn);
    }
    option.addEventListener("click", function() { changeSet(set.id); });
    setGrid.appendChild(option);
  });

  const selectedSet = activeSet();
  const previewTitle = document.querySelector("#preview-title");
  if (previewTitle) previewTitle.textContent = selectedSet.name;
  const previewCount = document.querySelector("#preview-count");
  if (previewCount) previewCount.textContent = formatCount(selectedSet.cards.length) + " WORDS";
  
  const previewList = document.querySelector("#preview-list");
  if (!previewList) return;
  previewList.innerHTML = "";
  selectedSet.cards.forEach(function(entry) {
    const row = document.createElement("li");
    row.className = "preview-word-row";
    
    const wordNode = document.createElement("span");
    wordNode.className = "preview-word";
    wordNode.textContent = entry.word;
    
    const posNode = document.createElement("span");
    posNode.className = "preview-pos";
    posNode.textContent = entry.pos || "";
    
    const transNode = document.createElement("span");
    transNode.className = "preview-translation";
    transNode.textContent = entry.translation || "";
    
    row.appendChild(wordNode);
    row.appendChild(posNode);
    row.appendChild(transNode);
    previewList.appendChild(row);
  });
}

function updateSelectDropdowns() {
  document.querySelectorAll(".set-select").forEach(function(select) {
    select.innerHTML = "";
    allSets.forEach(function(set) {
      const option = document.createElement("option");
      option.value = set.id;
      option.textContent = set.name;
      select.appendChild(option);
    });
    select.value = activeSetId;
  });
  updateTestRangeBounds();
}

function renderSetProgress() {
  const selectors = [document.querySelector("#study-set-select"), document.querySelector("#words-set-select"), document.querySelector("#test-set-select")];
  allSets.forEach(function(set) {
    const statuses = statusBySet[set.id] || {};
    const rememberedCount = Object.keys(statuses).filter(function(k) { return statuses[k] === "remembered"; }).length;
    const optionLabel = set.name + " (" + rememberedCount + "/" + set.cards.length + ")";
    selectors.forEach(function(select) {
      if (!select) return;
      const option = select.querySelector("option[value='" + set.id + "']");
      if (option) option.textContent = optionLabel;
    });
  });
  selectors.forEach(function(select) { if (select) select.value = activeSetId; });
  
  const statuses = statusBySet[activeSetId] || {};
  const rememberedCount = Object.keys(statuses).filter(function(k) { return statuses[k] === "remembered"; }).length;
  const reviewCount = Object.keys(statuses).filter(function(k) { return statuses[k] === "review"; }).length;
  const summary = rememberedCount + " of " + activeSet().cards.length + " remembered · " + reviewCount + " to review";
  
  const studyProg = document.querySelector("#study-set-progress");
  if (studyProg) studyProg.textContent = summary;
  const wordsProg = document.querySelector("#words-set-progress");
  if (wordsProg) wordsProg.textContent = summary;
}

function changeSet(setId) {
  if (!setsById.has(setId) || setId === activeSetId) return;
  activeSetId = setId;
  statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
  try {
    localStorage.setItem(activeSetStorageKey, activeSetId);
  } catch (e) {}
  activeCategory = "all";
  document.querySelectorAll(".list-tab").forEach(function(tab) {
    const isActive = tab.dataset.category === "all";
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  updateTestRangeBounds();
  startStudy();
  renderWords();
  renderHome();
}

function setView(view) {
  const isHome = view === "home";
  const isStudy = view === "study";
  const isWords = view === "words";
  const isTest = view === "test";
  
  if (homeView) homeView.hidden = !isHome;
  if (studyView) studyView.hidden = !isStudy;
  if (wordsView) wordsView.hidden = !isWords;
  if (testView) testView.hidden = !isTest;
  
  document.querySelectorAll(".nav-link").forEach(function(button) {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  
  if (isHome) renderHome();
  if (isWords) renderWords();
  
  const cardScene = document.querySelector("#card-scene");
  if (isStudy && voiceSettings.onCard && cardScene && !cardScene.hidden) {
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

const customSetSection = document.querySelector("#custom-set-section");
document.querySelector("#toggle-add-set-btn")?.addEventListener("click", function() {
  if (customSetSection) customSetSection.hidden = !customSetSection.hidden;
});
document.querySelector("#btn-cancel-create")?.addEventListener("click", function() {
  if (customSetSection) customSetSection.hidden = true;
});

function parseRawVocabulary(text) {
  const lines = text.trim().split("\n");
  const cards = [];

  lines.forEach(function(line) {
    line = line.trim();
    if (!line) return;

    let word = "";
    let pos = "word";
    let phonetic = "";
    let translation = "";
    let synonyms = [];
    let example = "";

    let firstSplit = [];
    if (line.indexOf("\t") !== -1) {
      const idx = line.indexOf("\t");
      firstSplit = [line.slice(0, idx), line.slice(idx + 1)];
    } else if (line.indexOf(" - ") !== -1) {
      const idx = line.indexOf(" - ");
      firstSplit = [line.slice(0, idx), line.slice(idx + 3)];
    } else if (line.indexOf("-") !== -1) {
      const idx = line.indexOf("-");
      firstSplit = [line.slice(0, idx), line.slice(idx + 1)];
    } else {
      const idx = line.indexOf(" ");
      if (idx !== -1) {
         firstSplit = [line.slice(0, idx), line.slice(idx + 1)];
      } else {
         return; 
      }
    }

    word = firstSplit[0].trim();
    let restOfLine = firstSplit[1].trim();

    let parts = [restOfLine];
    if (restOfLine.indexOf("|") !== -1) {
       parts = restOfLine.split("|").map(function(p) { return p.trim(); }).filter(Boolean);
    }

    let defText = parts[0];
    const posMatch = defText.match(/\((v\.\vert{}n\.\vert{}adj\.\vert{}adv\.\vert{}noun\vert{}verb\vert{}adjective\vert{}adverb)\)/i);
    if (posMatch) {
      const rawPos = posMatch[1].toLowerCase().replace(".", "");
      pos = rawPos === "v" ? "verb" : rawPos === "n" ? "noun" : rawPos === "adj" ? "adjective" : rawPos === "adv" ? "adverb" : rawPos;
      defText = defText.replace(posMatch[0], "").trim();
    }
    translation = defText;

    for (let i = 1; i < parts.length; i++) {
      const chunk = parts[i];
      if (chunk.indexOf("/") === 0 && chunk.lastIndexOf("/") === chunk.length - 1) {
        phonetic = chunk;
      } else if (/^(vd|ex):/i.test(chunk)) {
        example = chunk.replace(/^(vd|ex):\s*/i, "").trim();
      } else if (/^(đồng nghĩa|synonyms):/i.test(chunk)) {
        const synText = chunk.replace(/^(đồng nghĩa|synonyms):\s*/i, "").trim();
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

const btnSaveFirebase = document.getElementById("btn-save-firebase");
if (btnSaveFirebase) {
  btnSaveFirebase.addEventListener("click", async function() {
    if (!db) {
      alert("Chưa kết nối được với Firebase. Vui lòng tải lại trang!");
      return;
    }
    const titleObj = document.getElementById("deck-title");
    const rawObj = document.getElementById("import-input");
    const title = titleObj ? titleObj.value.trim() : "";
    const rawText = rawObj ? rawObj.value.trim() : "";

    if (!title || !rawText) {
      alert("Vui lòng nhập tên bộ từ và danh sách!");
      return;
    }

    const cards = parseRawVocabulary(rawText);
    if (cards.length === 0) {
      alert("Định dạng chưa đúng!");
      return;
    }

    btnSaveFirebase.innerText = "Đang lưu...";
    btnSaveFirebase.disabled = true;

    try {
      await db.collection("decks").add({
        name: title,
        cards: cards,
        createdAt: new Date().toISOString()
      });

      alert("Tạo bộ từ thành công!");
      if (titleObj) titleObj.value = "";
      if (rawObj) rawObj.value = "";
      if (customSetSection) customSetSection.hidden = true;
      btnSaveFirebase.innerText = "Lưu & Chia Sẻ Lên Server";
      btnSaveFirebase.disabled = false;
      await syncOnlineDecks();
    } catch (err) {
      alert("Lỗi lưu dữ liệu.");
      btnSaveFirebase.innerText = "Lưu & Chia Sẻ Lên Server";
      btnSaveFirebase.disabled = false;
    }
  });
}

async function syncOnlineDecks() {
  if (!db) return;
  try {
    const snapshot = await db.collection("decks").orderBy("createdAt", "desc").get();
    snapshot.forEach(function(doc) {
      const data = doc.data();
      const onlineSetId = "firebase-" + doc.id;
      if (!setsById.has(onlineSetId)) {
        const newSet = { id: onlineSetId, name: data.name, cards: data.cards };
        allSets.push(newSet);
        setsById.set(onlineSetId, newSet);
      }
    });
    updateSelectDropdowns();
    renderHome();
    renderSetProgress();
  } catch (err) {
    console.warn("Lỗi đồng bộ:", err);
  }
}

if (reviewButton) reviewButton.addEventListener("click", function() { gradeCard("review"); });
if (rememberButton) rememberButton.addEventListener("click", function() { gradeCard("remembered"); });
document.querySelector("#restart-button")?.addEventListener("click", startStudy);
document.querySelector("#preview-start")?.addEventListener("click", function() { setView("study"); });

document.querySelector("#back-to-study")?.addEventListener("click", function() { setView("study"); });

document.querySelector("#reset-progress")?.addEventListener("click", function() {
  if (Object.keys(statusByWord).length === 0) return;
  statusByWord = {};
  statusBySet[activeSetId] = statusByWord;
  saveProgress();
  startStudy();
  renderHome();
  if (wordsView && !wordsView.hidden) renderWords();
});

document.addEventListener("keydown", function(event) {
  if (event.target instanceof HTMLElement && ["BUTTON", "A", "INPUT", "TEXTAREA"].indexOf(event.target.tagName) !== -1) return;
  if (event.target === flashcard) return;
  const cardScene = document.querySelector("#card-scene");
  if (!studyView || studyView.hidden || (cardScene && cardScene.hidden)) return;
  
  if (event.key === " ") {
    event.preventDefault();
    if (flashcard) setCardFace(!flashcard.classList.contains("is-flipped"));
  }
  if (event.key === "ArrowLeft") gradeCard("review");
  if (event.key === "ArrowRight") gradeCard("remembered");
});

// Khởi chạy
updateSelectDropdowns();
startStudy();
renderWords();
renderHome();
syncOnlineDecks();