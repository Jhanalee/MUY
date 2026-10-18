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
const progressTrack = document.querySelector("#progress-track");
const themeStorageKey = "sat-vocab-theme-v1";
const voiceSettingsStorageKey = "sat-vocab-voice-settings-v1";
const supportsSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

let activeSetId = loadActiveSet();
let statusBySet = loadProgress();
let statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
let sessionResults = { review: 0, remembered: 0 };
let activeCategory = "all";
let voiceSettings = loadVoiceSettings();
let availableVoices = [];

// --- BIẾN TOÀN CỤC CHO TÍNH NĂNG SHUFFLE VÀ 15S/2M ---
let studyQueue = [];
let currentCardObj = null;
let totalCardsInSession = 0;
let completedCardsInSession = 0;
let waitingInterval = null;
let currentOrderMode = "alphabetical"; // "alphabetical" | "random"

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

function renderCard() {
  const entry = currentWord();
  if (!entry) return;
  
  const cardIndex = document.querySelector("#card-index");
  if (cardIndex) cardIndex.innerHTML = formatCount(completedCardsInSession + 1) + " <span>/ " + formatCount(totalCardsInSession) + "</span>";
  
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
  if (progressLabel) progressLabel.innerHTML = formatCount(completedCardsInSession + 1) + " <span>/</span> " + formatCount(totalCardsInSession);
  
  if (progressTrack) {
    progressTrack.setAttribute("aria-valuemax", String(totalCardsInSession));
    progressTrack.setAttribute("aria-valuenow", String(completedCardsInSession));
  }
  const fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = ((completedCardsInSession / (totalCardsInSession || 1)) * 100) + "%";
  
  const revTally = document.querySelector("#review-tally");
  if (revTally) revTally.textContent = String(sessionResults.review);
  const remTally = document.querySelector("#remember-tally");
  if (remTally) remTally.textContent = String(sessionResults.remembered);
  
  const sessNote = document.querySelector("#session-note");
  if (sessNote) sessNote.textContent = completedCardsInSession === 0 ? "Take a breath. There’s no rush." : "One small step at a time.";
  
  // Nâng cấp: Hiển thị nhãn thời gian tùy theo Step của thẻ
  const easyDelay = document.querySelector("#easy-delay");
  if (easyDelay) {
    easyDelay.textContent = currentCardObj.step === 0 ? "Show in 2 min" : "Finish";
  }

  renderSetProgress();
  setCardFace(false);
  if (voiceSettings.onCard && studyView && !studyView.hidden) speakWord(entry.word);
}

// --- THUẬT TOÁN ĐIỀU CHỈNH THỜI GIAN LẶP LẠI (15S / 2M) ---
function gradeCard(status) {
  if (!currentCardObj) return;

  if (status === "review") {
    // Nhấn Khó (Hard) -> Đưa về Step 0, Hẹn 15 giây sau
    sessionResults.review++;
    statusByWord[currentCardObj.word] = "review";
    currentCardObj.step = 0;
    currentCardObj.availableAt = Date.now() + 15000;
    studyQueue.push(currentCardObj);
  } else if (status === "remembered") {
    // Nhấn Dễ (Easy)
    if (currentCardObj.step === 0) {
      // Nếu mới học -> Nâng lên Step 1, Hẹn 2 phút sau
      currentCardObj.step = 1;
      currentCardObj.availableAt = Date.now() + 120000;
      studyQueue.push(currentCardObj);
    } else {
      // Nếu đã ở Step 1 -> Tốt nghiệp! Loại khỏi hàng đợi.
      sessionResults.remembered++;
      statusByWord[currentCardObj.word] = "remembered";
      completedCardsInSession++;
    }
  }

  currentCardObj = null;
  saveProgress();
  renderSetProgress();
  renderNextCard(); // Rút thẻ tiếp theo trong hàng đợi
}

// --- HÀM TÌM THẺ TIẾP THEO TRONG HÀNG ĐỢI HOẶC CHỜ ---
function renderNextCard() {
  if (waitingInterval) { clearInterval(waitingInterval); waitingInterval = null; }

  // Nếu hàng đợi rỗng và không còn thẻ đang cầm -> Kết thúc
  if (studyQueue.length === 0 && !currentCardObj) {
    showCompletion();
    return;
  }

  const now = Date.now();
  let nextIdx = -1;
  // Tìm thẻ có thời gian khả dụng <= thời gian hiện tại
  for (let i = 0; i < studyQueue.length; i++) {
    if (studyQueue[i].availableAt <= now) {
      nextIdx = i;
      break;
    }
  }

  if (nextIdx !== -1) {
    // Có thẻ sẵn sàng -> Hiển thị màn hình Flashcard
    const waitPanel = document.querySelector("#review-waiting");
    if (waitPanel) waitPanel.hidden = true;
    const cardScene = document.querySelector("#card-scene");
    if (cardScene) cardScene.hidden = false;
    const answerArea = document.querySelector("#answer-area");
    if (answerArea) answerArea.hidden = false;

    currentCardObj = studyQueue.splice(nextIdx, 1)[0];
    renderCard();
  } else {
    // Tất cả các thẻ đều đang bị hẹn giờ trong tương lai -> Hiện đồng hồ đếm ngược
    currentCardObj = null;
    const cardScene = document.querySelector("#card-scene");
    if (cardScene) cardScene.hidden = true;
    const answerArea = document.querySelector("#answer-area");
    if (answerArea) answerArea.hidden = true;
    const waitPanel = document.querySelector("#review-waiting");
    if (waitPanel) waitPanel.hidden = false;

    // Tìm thời gian chờ ngắn nhất
    let minTime = studyQueue[0].availableAt;
    for (let j = 1; j < studyQueue.length; j++) {
      if (studyQueue[j].availableAt < minTime) minTime = studyQueue[j].availableAt;
    }

    updateCountdown(minTime);
    waitingInterval = setInterval(function() {
      if (Date.now() >= minTime) {
        renderNextCard(); // Đến giờ thì tự động load thẻ ra
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
  
  const compCopy = document.querySelector("#completion-copy");
  if (compCopy) compCopy.textContent = sessionResults.remembered + " remembered · " + sessionResults.review + " to revisit. Every word gets easier with practice.";
}

// --- THUẬT TOÁN SHUFFLE (TRỘN THẺ) VÀ BẮT ĐẦU BÀI HỌC ---
function startStudy() {
  sessionResults = { review: 0, remembered: 0 };
  completedCardsInSession = 0;
  const cards = activeSet().cards;
  totalCardsInSession = cards.length;

  let initialWords = cards.map(function(c) { return c.word; });
  
  // Tính năng Shuffle
  if (currentOrderMode === "random") {
    for (let i = initialWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = initialWords[i];
      initialWords[i] = initialWords[j];
      initialWords[j] = temp;
    }
  } else {
    // Thứ tự A-Z
    initialWords.sort(function(a, b) { return a.localeCompare(b); });
  }

  // Khởi tạo hàng đợi bài học (Tất cả bắt đầu từ Step 0)
  studyQueue = initialWords.map(function(w) {
    return {
      word: w,
      availableAt: 0,
      step: 0
    };
  });

  const completionPanel = document.querySelector("#completion-panel");
  if (completionPanel) completionPanel.hidden = true;
  const waitPanel = document.querySelector("#review-waiting");
  if (waitPanel) waitPanel.hidden = true;
  
  renderNextCard();
}

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

    // --- NÚT XÓA CHÍNH THỨC ---
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
      delBtn.style.backgroundColor = "red";
      delBtn.style.cursor = "pointer";
      delBtn.style.zIndex = "10";
      
      delBtn.addEventListener("click", async function(e) {
        e.stopPropagation(); // Ngăn mở bài học khi bấm vào xóa
        if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bộ từ: " + set.name + "?")) {
          delBtn.textContent = "...";
          try {
            const realId = set.id.replace("firebase-", "");
            if (db) await db.collection("decks").doc(realId).delete();
            
            const idx = allSets.findIndex(function(s) { return s.id === set.id; });
            if (idx > -1) allSets.splice(idx, 1);
            setsById.delete(set.id);
            renderHome();
          } catch(err) {
             alert("Lỗi khi xóa: " + err.message);
             delBtn.textContent = "🗑 Xóa";
          }
        }
      });
      option.appendChild(delBtn);
    }
    // ----------------------------

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
}

function renderSetProgress() {
  const selectors = [document.querySelector("#study-set-select"), document.querySelector("#words-set-select")];
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
  startStudy();
  renderWords();
  renderHome();
}

function setView(view) {
  const isHome = view === "home";
  const isStudy = view === "study";
  if (homeView) homeView.hidden = !isHome;
  if (studyView) studyView.hidden = !isStudy;
  if (wordsView) wordsView.hidden = isHome || isStudy;
  document.querySelectorAll(".nav-link").forEach(function(button) {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (isHome) renderHome();
  if (view === "words") renderWords();
  
  const cardScene = document.querySelector("#card-scene");
  if (isStudy && voiceSettings.onCard && cardScene && !cardScene.hidden) {
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

// Bật tắt form thêm bộ từ
const customSetSection = document.querySelector("#custom-set-section");
const toggleAddSetBtn = document.querySelector("#toggle-add-set-btn");
if (toggleAddSetBtn) {
  toggleAddSetBtn.addEventListener("click", function() {
    if (customSetSection) customSetSection.hidden = !customSetSection.hidden;
  });
}
const btnCancelCreate = document.querySelector("#btn-cancel-create");
if (btnCancelCreate) {
  btnCancelCreate.addEventListener("click", function() {
    if (customSetSection) customSetSection.hidden = true;
  });
}

// THUẬT TOÁN TÁCH DỮ LIỆU ĐẦY ĐỦ
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
    const posMatch = defText.match(/\((v\.|n\.|adj\.|adv\.|noun|verb|adjective|adverb)\)/i);
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

// Lưu Firebase
const btnSaveFirebase = document.getElementById("btn-save-firebase");
if (btnSaveFirebase) {
  btnSaveFirebase.addEventListener("click", async function() {
    if (!db) {
      alert("Chưa kết nối được với Firebase Firestore. Vui lòng tải lại trang!");
      return;
    }
    const titleObj = document.getElementById("deck-title");
    const rawObj = document.getElementById("import-input");
    const title = titleObj ? titleObj.value.trim() : "";
    const rawText = rawObj ? rawObj.value.trim() : "";

    if (!title || !rawText) {
      alert("Vui lòng nhập tên bộ từ và danh sách từ vựng!");
      return;
    }

    const cards = parseRawVocabulary(rawText);
    if (cards.length === 0) {
      alert("Không tìm thấy từ hợp lệ. Vui lòng kiểm tra lại định dạng!");
      return;
    }

    btnSaveFirebase.innerText = "Đang lưu lên hệ thống...";
    btnSaveFirebase.disabled = true;

    try {
      await db.collection("decks").add({
        name: title,
        cards: cards,
        createdAt: new Date().toISOString()
      });

      alert("Tạo bộ từ thành công! Đang tải lại danh sách...");
      if (titleObj) titleObj.value = "";
      if (rawObj) rawObj.value = "";
      if (customSetSection) customSetSection.hidden = true;
      btnSaveFirebase.innerText = "Lưu & Chia Sẻ Lên Server";
      btnSaveFirebase.disabled = false;
      await syncOnlineDecks();
    } catch (err) {
      console.error("Lỗi Firebase:", err);
      alert("Lưu thất bại. Hãy chắc chắn Firestore Database ở trạng thái Test mode.");
      btnSaveFirebase.innerText = "Lưu & Chia Sẻ Lên Server";
      btnSaveFirebase.disabled = false;
    }
  });
}

// Đồng bộ bộ từ trên mạng
async function syncOnlineDecks() {
  if (!db) return;
  try {
    const snapshot = await db.collection("decks").orderBy("createdAt", "desc").get();
    snapshot.forEach(function(doc) {
      const data = doc.data();
      const onlineSetId = "firebase-" + doc.id;
      if (!setsById.has(onlineSetId)) {
        const newSet = {
          id: onlineSetId,
          name: data.name,
          cards: data.cards
        };
        allSets.push(newSet);
        setsById.set(onlineSetId, newSet);
      }
    });
    updateSelectDropdowns();
    renderHome();
    renderSetProgress();
  } catch (err) {
    console.warn("Không thể đồng bộ Firestore:", err);
  }
}

// Thiết lập điều khiển
const settingsMenu = document.querySelector("#settings-menu");
const voiceSelect = document.querySelector("#voice-gender");
const speedSelect = document.querySelector("#voice-speed");
const onCardToggle = document.querySelector("#voice-on-card");
const onFlipToggle = document.querySelector("#voice-on-flip");

const themeSelect = document.querySelector("#theme-select");
if (themeSelect) {
  themeSelect.addEventListener("change", function(event) { applyTheme(event.target.value); });
}
applyTheme(loadTheme());

if (voiceSelect) voiceSelect.value = voiceSettings.gender;
if (speedSelect) speedSelect.value = voiceSettings.speed;
if (onCardToggle) onCardToggle.checked = voiceSettings.onCard;
if (onFlipToggle) onFlipToggle.checked = voiceSettings.onFlip;

document.querySelectorAll("#voice-gender, #voice-speed, #voice-on-card, #voice-on-flip").forEach(function(control) {
  control.addEventListener("change", function() {
    voiceSettings = {
      gender: voiceSelect.value,
      speed: speedSelect.value,
      onCard: onCardToggle.checked,
      onFlip: onFlipToggle.checked
    };
    saveVoiceSettings();
    updateVoiceNote();
  });
});

document.querySelectorAll(".listen-button").forEach(function(button) {
  button.addEventListener("click", function(event) {
    event.stopPropagation();
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  });
});

if (supportsSpeech) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
} else {
  document.querySelectorAll(".listen-button").forEach(function(button) { button.disabled = true; });
  [voiceSelect, speedSelect, onCardToggle, onFlipToggle].forEach(function(control) { if (control) control.disabled = true; });
  updateVoiceNote("Speech playback is not supported by this browser.");
}

if (settingsMenu) {
  settingsMenu.addEventListener("click", function(event) { event.stopPropagation(); });
}
document.addEventListener("click", function() { if (settingsMenu) settingsMenu.open = false; });
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && settingsMenu) settingsMenu.open = false;
});

const wordmark = document.querySelector(".wordmark");
if (wordmark) {
  wordmark.addEventListener("click", function(event) {
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

// BẮT SỰ KIỆN NÚT CHỌN THỨ TỰ (A-Z VÀ RANDOM)
document.querySelectorAll(".study-order-button").forEach(function(btn) {
  btn.addEventListener("click", function() {
    // Đổi màu nút được chọn
    document.querySelectorAll(".study-order-button").forEach(function(b) {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    
    // Lưu lại chế độ và tải lại bài học
    currentOrderMode = btn.dataset.studyOrder;
    if (studyView && !studyView.hidden) {
      startStudy();
    }
  });
});

// BẮT SỰ KIỆN NÚT FINISH (KẾT THÚC BÀI HỌC SỚM TRONG LÚC CHỜ)
const finishEarlyBtn = document.querySelector("#finish-early");
if (finishEarlyBtn) {
  finishEarlyBtn.addEventListener("click", function() {
    if (waitingInterval) { clearInterval(waitingInterval); waitingInterval = null; }
    showCompletion();
  });
}

if (reviewButton) reviewButton.addEventListener("click", function() { gradeCard("review"); });
if (rememberButton) rememberButton.addEventListener("click", function() { gradeCard("remembered"); });

const restartBtn = document.querySelector("#restart-button");
if (restartBtn) restartBtn.addEventListener("click", startStudy);

const previewStart = document.querySelector("#preview-start");
if (previewStart) previewStart.addEventListener("click", function() { setView("study"); });

document.querySelectorAll(".set-select").forEach(function(select) {
  select.addEventListener("change", function() { changeSet(select.value); });
});

document.querySelectorAll(".nav-link").forEach(function(button) {
  button.addEventListener("click", function() { setView(button.dataset.view); });
});

const backToStudy = document.querySelector("#back-to-study");
if (backToStudy) backToStudy.addEventListener("click", function() { setView("study"); });

document.querySelectorAll(".list-tab").forEach(function(button) {
  button.addEventListener("click", function() {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".list-tab").forEach(function(tab) {
      const isActive = tab === button;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    renderWords();
  });
});

const resetProg = document.querySelector("#reset-progress");
if (resetProg) {
  resetProg.addEventListener("click", function() {
    if (Object.keys(statusByWord).length === 0) return;
    statusByWord = {};
    statusBySet[activeSetId] = statusByWord;
    sessionResults = { review: 0, remembered: 0 };
    saveProgress();
    startStudy();
    renderHome();
    if (wordsView && !wordsView.hidden) renderWords();
  });
}

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