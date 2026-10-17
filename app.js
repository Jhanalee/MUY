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
const reviewIntervals = [2, 5, 10, 30, 60, 1440].map((minutes) => minutes * 60 * 1000);
const hardReviewDelay = 15 * 1000;
const setsById = new Map(allSets.map((set) => [set.id, set]));
const flashcard = document.querySelector("#flashcard");
const reviewButton = document.querySelector("#review-button");
const rememberButton = document.querySelector("#remember-button");
const homeView = document.querySelector("#home-view");
const studyView = document.querySelector("#study-view");
const wordsView = document.querySelector("#words-view");
const progressTrack = document.querySelector("#progress-track");
const studyOrderStorageKey = "sat-vocab-study-order-v1";
const themeStorageKey = "sat-vocab-theme-v1";
const voiceSettingsStorageKey = "sat-vocab-voice-settings-v1";
const supportsSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

let activeSetId = loadActiveSet();
let statusBySet = loadProgress();
let statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
let currentIndex = 0;
let studyOrderMode = loadStudyOrderMode();
let studyOrder = orderCards(activeSet().cards);
let activeReviewItem = null;
let reviewQueue = [];
let easyReviewCounts = {};
let reviewTimer = null;
let sessionResults = { review: 0, remembered: 0 };
let activeCategory = "all";
let voiceSettings = loadVoiceSettings();
let availableVoices = [];

function activeSet() {
  return setsById.get(activeSetId) || allSets[0] || { id: "default", name: "Empty", cards: [] };
}

function loadActiveSet() {
  const fallback = allSets[0]?.id || "essentials";
  try {
    const savedSetId = localStorage.getItem(activeSetStorageKey);
    return setsById.has(savedSetId) ? savedSetId : fallback;
  } catch {
    return fallback;
  }
}

function loadStudyOrderMode() {
  try {
    return localStorage.getItem(studyOrderStorageKey) === "random" ? "random" : "alphabetical";
  } catch {
    return "alphabetical";
  }
}

function orderCards(cards) {
  const orderedCards = [...cards];
  if (studyOrderMode === "alphabetical") {
    orderedCards.sort((left, right) => left.word.localeCompare(right.word, "en", { sensitivity: "base" }));
  } else {
    for (let index = orderedCards.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [orderedCards[index], orderedCards[swapIndex]] = [orderedCards[swapIndex], orderedCards[index]];
    }
  }
  return orderedCards.map((entry) => entry.word);
}

function updateStudyOrderControl() {
  document.querySelectorAll(".study-order-button").forEach((button) => {
    const isActive = button.dataset.studyOrder === studyOrderMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function changeStudyOrder(mode) {
  if (!["alphabetical", "random"].includes(mode) || mode === studyOrderMode) return;
  const currentEntry = currentWord();
  const completedWords = studyOrder.slice(0, currentIndex);
  studyOrderMode = mode;
  try {
    localStorage.setItem(studyOrderStorageKey, studyOrderMode);
  } catch {
    // Keep the selected order for the current session.
  }
  updateStudyOrderControl();
  if (activeReviewItem || document.querySelector("#card-scene")?.hidden) return;
  if (!currentEntry) return;

  const completedSet = new Set(completedWords);
  const remainingCards = activeSet().cards.filter((entry) => entry.word !== currentEntry.word && !completedSet.has(entry.word));
  studyOrder = [...completedWords, currentEntry.word, ...orderCards(remainingCards)];
  renderCard();
}

function loadVoiceSettings() {
  const defaults = { gender: "female", speed: "normal" };
  try {
    const saved = JSON.parse(localStorage.getItem(voiceSettingsStorageKey) || "null");
    if (!saved || typeof saved !== "object") return defaults;
    return {
      gender: ["female", "male"].includes(saved.gender) ? saved.gender : defaults.gender,
      speed: ["normal", "slow"].includes(saved.speed) ? saved.speed : defaults.speed
    };
  } catch {
    return defaults;
  }
}

function saveVoiceSettings() {
  try {
    localStorage.setItem(voiceSettingsStorageKey, JSON.stringify({ ...voiceSettings, version: 2 }));
  } catch {
    // Voice preferences still apply for the current session.
  }
}

function applyTheme(theme) {
  const selectedTheme = ["green", "red", "graphite"].includes(theme) ? theme : "green";
  document.documentElement.dataset.theme = selectedTheme;
  const select = document.querySelector("#theme-select");
  if (select) select.value = selectedTheme;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = { green: "#171916", red: "#1d1718", graphite: "#17191d" }[selectedTheme];
  }
  try {
    localStorage.setItem(themeStorageKey, selectedTheme);
  } catch {}
}

function loadTheme() {
  try {
    return localStorage.getItem(themeStorageKey) || "green";
  } catch {
    return "green";
  }
}

function refreshVoices() {
  if (!supportsSpeech) return;
  availableVoices = window.speechSynthesis.getVoices();
  updateVoiceNote();
}

function preferredVoice() {
  const englishVoices = availableVoices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const voiceNamePatterns = voiceSettings.gender === "female"
    ? /\b(?:female|woman|zira|samantha|victoria|karen|moira|tessa|susan|aria|jenny|linda|amy|allison|ava|siri.*(?:1|2|3|4|5|6|7|8|9))\b/i
    : /\b(?:male|man|david|alex|daniel|james|guy|ryan|fred|tom|george|mark|aaron|arthur|oliver|lee|thomas|rishi)\b/i;
  const matchedVoice = englishVoices.find((voice) => voiceNamePatterns.test(voice.name));
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
    ? `Using ${voice.name}${voiceNameMatchesGender(voice) ? "" : ` with ${voiceSettings.gender}-leaning pitch`}.`
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
  utterance.onstart = () => updateVoiceNote(voice ? `Speaking with ${voice.name}.` : "Speaking with default English voice.");
  utterance.onerror = (event) => {
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
      const progress = Object.fromEntries(allSets.map((set) => {
        const wordsInSet = new Set(set.cards.map((entry) => entry.word));
        const statuses = saved[set.id] && typeof saved[set.id] === "object" ? saved[set.id] : {};
        return [set.id, Object.fromEntries(Object.entries(statuses).filter(([word, status]) => wordsInSet.has(word) && ["review", "remembered"].includes(status)))];
      }));
      for (const [setId, statuses] of Object.entries(saved)) {
        if (setsById.has(setId) || !statuses || typeof statuses !== "object") continue;
        progress[setId] = Object.fromEntries(Object.entries(statuses).filter(([, status]) => ["review", "remembered"].includes(status)));
      }
      return progress;
    }
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey) || "{}");
    const firstSetWords = new Set(allSets[0]?.cards.map((entry) => entry.word) || []);
    return { [allSets[0]?.id || "essentials"]: Object.fromEntries(Object.entries(legacy).filter(([word, status]) => firstSetWords.has(word) && ["review", "remembered"].includes(status))) };
  } catch {
    return Object.fromEntries(allSets.map((set) => [set.id, {}]));
  }
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(statusBySet));
  } catch {}
}

function currentWord() {
  if (activeReviewItem) return activeSet().cards.find((entry) => entry.word === activeReviewItem.word);
  return activeSet().cards.find((entry) => entry.word === studyOrder[currentIndex]) || activeSet().cards[0];
}

function formatCount(count) {
  return String(count).padStart(2, "0");
}

function formatDelay(delay) {
  if (delay < 60 * 1000) return `Show in ${Math.ceil(delay / 1000)} sec`;
  const minutes = Math.ceil(delay / (60 * 1000));
  if (minutes < 60) return `Show in ${minutes} min`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `Show in ${hours} hr${hours === 1 ? "" : "s"}`;
  const days = Math.ceil(hours / 24);
  return `Show in ${days} day${days === 1 ? "" : "s"}`;
}

function nextEasyReviewDelay(word) {
  const stage = easyReviewCounts[word] || 0;
  return reviewIntervals[Math.min(stage, reviewIntervals.length - 1)];
}

function updateAnswerDelays() {
  const entry = currentWord();
  if (!entry) return;
  document.querySelector("#hard-delay").textContent = formatDelay(hardReviewDelay);
  document.querySelector("#easy-delay").textContent = formatDelay(nextEasyReviewDelay(entry.word));
}

function highlightWord(sentence, word) {
  if (!sentence) return [document.createTextNode("")];
  const cleanWord = (word || "").trim();
  const cleanWordStem = cleanWord.length > 4 ? cleanWord.slice(0, 4) : cleanWord;
  
  let position = sentence.toLowerCase().indexOf(cleanWord.toLowerCase());
  let matchLen = cleanWord.length;
  
  // Tìm từ gốc nếu từ trong câu có chia thì (ví dụ abated -> abate)
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
  document.querySelector("#card-front")?.setAttribute("aria-hidden", String(isFlipped));
  document.querySelector("#card-back")?.setAttribute("aria-hidden", String(!isFlipped));
  flashcard.setAttribute("aria-label", isFlipped ? "Definition revealed. Press Enter or Space to see the word again." : "Vocabulary card. Press Enter or Space to reveal the definition.");
  if (isFlipped && studyView && !studyView.hidden) {
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

function renderCard() {
  const entry = currentWord();
  if (!entry) return;
  const cardIndex = document.querySelector("#card-index");
  if (cardIndex) {
    if (activeReviewItem) cardIndex.textContent = "REVIEW";
    else cardIndex.innerHTML = `${formatCount(currentIndex + 1)} <span>/ ${formatCount(studyOrder.length)}</span>`;
  }
  const frontPos = document.querySelector("#front-pos");
  if (frontPos) frontPos.textContent = (entry.pos || "WORD").toUpperCase();
  const frontWord = document.querySelector("#front-word");
  if (frontWord) frontWord.textContent = entry.word || "";
  const frontPhonetic = document.querySelector("#front-phonetic");
  if (frontPhonetic) frontPhonetic.textContent = entry.phonetic || "";
  const backWord = document.querySelector("#back-word");
  if (backWord) backWord.textContent = entry.word || "";
  const backTranslation = document.querySelector("#back-translation");
  if (backTranslation) backTranslation.textContent = entry.translation || "";
  document.querySelectorAll(".card-set-name").forEach((label) => { label.textContent = activeSet().name.toUpperCase(); });
  const synonyms = Array.isArray(entry.synonyms) ? entry.synonyms : [];
  const backSynonyms = document.querySelector("#back-synonyms");
  if (backSynonyms) backSynonyms.replaceChildren(...synonyms.flatMap((synonym, index) => {
    const nodes = [document.createTextNode(synonym)];
    if (index < synonyms.length - 1) {
      const separator = document.createElement("span");
      separator.textContent = " · ";
      nodes.push(separator);
    }
    return nodes;
  }));
  const backExample = document.querySelector("#back-example");
  if (backExample) backExample.replaceChildren(...highlightWord(entry.example || "", entry.word || ""));
  const progressLabel = document.querySelector("#progress-label");
  if (progressLabel) {
    if (activeReviewItem) progressLabel.textContent = "Review";
    else progressLabel.innerHTML = `${formatCount(currentIndex + 1)} <span>/ ${formatCount(studyOrder.length)}</span>`;
  }
  if (progressTrack) {
    progressTrack.setAttribute("aria-valuemax", String(studyOrder.length));
    progressTrack.setAttribute("aria-valuenow", String(currentIndex));
  }
  const progressFill = document.querySelector("#progress-fill");
  if (progressFill) progressFill.style.width = `${(currentIndex / (studyOrder.length || 1)) * 100}%`;
  const reviewTally = document.querySelector("#review-tally");
  if (reviewTally) reviewTally.textContent = String(sessionResults.review);
  const rememberedTally = document.querySelector("#remember-tally");
  if (rememberedTally) rememberedTally.textContent = String(sessionResults.remembered);
  const sessionNote = document.querySelector("#session-note");
  if (sessionNote) sessionNote.textContent = currentIndex === 0 ? "Take a breath. There’s no rush." : "One small step at a time.";
  updateAnswerDelays();
  renderSetProgress();
  setCardFace(false);
  if (studyView && !studyView.hidden) speakWord(entry.word);
}

function gradeCard(status) {
  const entry = currentWord();
  if (!entry) return;
  const delay = status === "review" ? hardReviewDelay : nextEasyReviewDelay(entry.word);
  if (status === "review") easyReviewCounts[entry.word] = 0;
  else easyReviewCounts[entry.word] = (easyReviewCounts[entry.word] || 0) + 1;
  statusByWord[entry.word] = status;
  sessionResults[status] += 1;
  reviewQueue.push({ word: entry.word, dueAt: Date.now() + delay });
  if (!activeReviewItem) currentIndex += 1;
  activeReviewItem = null;
  saveProgress();
  renderHome();
  renderSetProgress();
  updatePreviewFilterCount();
  if (previewFilterMode === "learning") renderSetPreview();
  showNextStudyCard();
}

function showNextStudyCard() {
  if (reviewTimer) {
    clearInterval(reviewTimer);
    reviewTimer = null;
  }
  const dueReviewIndex = reviewQueue.reduce((earliestIndex, item, index) => {
    if (item.dueAt > Date.now()) return earliestIndex;
    if (earliestIndex === -1 || item.dueAt < reviewQueue[earliestIndex].dueAt) return index;
    return earliestIndex;
  }, -1);
  if (dueReviewIndex !== -1) {
    activeReviewItem = reviewQueue.splice(dueReviewIndex, 1)[0];
    document.querySelector("#review-waiting").hidden = true;
    document.querySelector("#completion-panel").hidden = true;
    document.querySelector("#card-scene").hidden = false;
    document.querySelector("#answer-area").hidden = false;
    renderCard();
    return;
  }
  activeReviewItem = null;
  if (currentIndex < studyOrder.length) {
    document.querySelector("#review-waiting").hidden = true;
    document.querySelector("#completion-panel").hidden = true;
    document.querySelector("#card-scene").hidden = false;
    document.querySelector("#answer-area").hidden = false;
    renderCard();
    return;
  }
  if (reviewQueue.length) {
    showReviewWaiting();
    return;
  }
  showCompletion();
}

function showReviewWaiting() {
  document.querySelector("#card-scene").hidden = true;
  document.querySelector("#answer-area").hidden = true;
  document.querySelector("#completion-panel").hidden = true;
  document.querySelector("#review-waiting").hidden = false;

  const updateCountdown = () => {
    const nextReview = reviewQueue.reduce((earliest, item) => item.dueAt < earliest.dueAt ? item : earliest, reviewQueue[0]);
    const remaining = nextReview.dueAt - Date.now();
    if (remaining <= 0) {
      showNextStudyCard();
      return;
    }
    document.querySelector("#review-countdown").textContent = `Next card in ${formatDelay(remaining).replace(/^Show in /, "")}. Reviews stay in this session.`;
  };

  updateCountdown();
  if (reviewQueue.length) reviewTimer = setInterval(updateCountdown, 1000);
}

function showCompletion() {
  if (reviewTimer) {
    clearInterval(reviewTimer);
    reviewTimer = null;
  }
  reviewQueue = [];
  activeReviewItem = null;
  const reviewWaiting = document.querySelector("#review-waiting");
  if (reviewWaiting) reviewWaiting.hidden = true;
  flashcard.classList.remove("is-flipped");
  document.querySelector("#card-scene").hidden = true;
  document.querySelector("#answer-area").hidden = true;
  document.querySelector("#completion-panel").hidden = false;
  const progressLabel = document.querySelector("#progress-label");
  if (progressLabel) progressLabel.innerHTML = `${formatCount(studyOrder.length)} <span>/</span> ${formatCount(studyOrder.length)}`;
  const fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = "100%";
  if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(studyOrder.length));
  document.querySelector("#completion-copy").textContent = `${sessionResults.remembered} remembered · ${sessionResults.review} to revisit. Every word gets easier with practice.`;
}

function startStudy() {
  if (reviewTimer) clearInterval(reviewTimer);
  reviewTimer = null;
  reviewQueue = [];
  easyReviewCounts = {};
  activeReviewItem = null;
  currentIndex = 0;
  sessionResults = { review: 0, remembered: 0 };
  studyOrder = orderCards(activeSet().cards);
  document.querySelector("#completion-panel").hidden = true;
  document.querySelector("#review-waiting").hidden = true;
  document.querySelector("#card-scene").hidden = false;
  document.querySelector("#answer-area").hidden = false;
  renderCard();
}

function renderWords() {
  const words = activeSet().cards;
  const rememberedCount = Object.values(statusByWord).filter((status) => status === "remembered").length;
  const reviewCount = Object.values(statusByWord).filter((status) => status === "review").length;
  document.querySelector("#total-count").textContent = formatCount(words.length);
  document.querySelector("#all-count").textContent = formatCount(words.length);
  document.querySelector("#remembered-count").textContent = formatCount(rememberedCount);
  document.querySelector("#review-count").textContent = formatCount(reviewCount);
  renderSetProgress();
  const list = document.querySelector("#word-list");
  if (!list) return;
  list.replaceChildren();
  const entries = activeCategory === "all" ? words : words.filter((entry) => statusByWord[entry.word] === activeCategory);
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-list";
    empty.textContent = activeCategory === "remembered" ? "Words you remember will find a home here." : "Nothing to revisit yet. Keep up the good work.";
    list.append(empty);
    return;
  }
  entries.forEach((entry, index) => {
    const status = statusByWord[entry.word] || "new";
    const row = document.createElement("div");
    row.className = "word-row";
    row.style.animationDelay = `${Math.min(index * 24, 144)}ms`;
    const word = document.createElement("span");
    word.className = "row-word";
    word.textContent = entry.word;
    const pos = document.createElement("span");
    pos.className = "row-pos";
    pos.textContent = entry.pos || "";
    const translation = document.createElement("span");
    translation.className = "row-translation";
    translation.textContent = entry.translation || "";
    const statusLabel = document.createElement("span");
    statusLabel.className = `row-status status-${status}`;
    statusLabel.textContent = status === "remembered" ? "✓ Remembered" : status === "review" ? "× Review" : "— New";
    row.append(word, pos, translation, statusLabel);
    list.append(row);
  });
}

function renderHome() {
  const setGrid = document.querySelector("#home-set-grid");
  if (!setGrid) return;
  setGrid.replaceChildren();
  allSets.forEach((set, index) => {
    const statuses = statusBySet[set.id] || {};
    const rememberedCount = Object.values(statuses).filter((status) => status === "remembered").length;
    const option = document.createElement("button");
    option.className = `home-set-option${set.id === activeSetId ? " is-selected" : ""}`;
    option.type = "button";
    option.setAttribute("aria-pressed", String(set.id === activeSetId));

    const label = document.createElement("span");
    label.className = "home-set-label";
    label.textContent = `SET ${formatCount(index + 1)} · ${formatCount(set.cards.length)} WORDS`;
    const name = document.createElement("span");
    name.className = "home-set-name";
    name.textContent = set.name;
    const progress = document.createElement("span");
    progress.className = "home-set-progress";
    progress.textContent = `${rememberedCount} / ${set.cards.length} words learned`;
    const progressTrack = document.createElement("span");
    progressTrack.className = "home-set-progress-track";
    progressTrack.setAttribute("aria-hidden", "true");
    const progressFill = document.createElement("span");
    progressFill.style.width = `${set.cards.length ? (rememberedCount / set.cards.length) * 100 : 0}%`;
    progressTrack.append(progressFill);
    const arrow = document.createElement("span");
    arrow.className = "home-set-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    option.append(label, name, progress, progressTrack, arrow);
    option.addEventListener("click", () => {
      changeSet(set.id);
      setView("study");
    });
    setGrid.append(option);
  });
}

function updatePreviewFilterCount() {
  const learningCount = activeSet().cards.filter((entry) => statusByWord[entry.word]).length;
  const learningOption = document.querySelector('#preview-filter option[value="learning"]');
  if (learningOption) learningOption.textContent = `Currently learning (${learningCount})`;
  const previewCount = document.querySelector("#preview-count");
  if (previewCount && previewFilterMode === "learning") previewCount.textContent = `${formatCount(learningCount)} LEARNING`;
  return learningCount;
}

function renderSetPreview() {
  const selectedSet = activeSet();
  const previewTitle = document.querySelector("#preview-title");
  if (previewTitle) previewTitle.textContent = selectedSet.name;
  const previewList = document.querySelector("#preview-list");
  if (!previewList) return;
  const learningCount = updatePreviewFilterCount();
  const learningCards = selectedSet.cards.filter((entry) => statusByWord[entry.word]);
  const visibleCards = previewFilterMode === "learning" ? learningCards : selectedSet.cards;
  const previewCount = document.querySelector("#preview-count");
  if (previewCount) previewCount.textContent = previewFilterMode === "learning"
    ? `${formatCount(learningCount)} LEARNING`
    : `${formatCount(selectedSet.cards.length)} WORDS`;
  previewList.replaceChildren();
  if (!visibleCards.length) {
    const empty = document.createElement("li");
    empty.className = "preview-empty";
    empty.textContent = "Words you mark Hard or Easy will appear here.";
    previewList.append(empty);
    return;
  }
  visibleCards.forEach((entry) => {
    const row = document.createElement("li");
    row.className = "preview-word-row";
    const card = document.createElement("button");
    card.className = "preview-word-card";
    card.type = "button";
    const synonyms = Array.isArray(entry.synonyms) ? entry.synonyms : [];
    card.setAttribute("aria-label", `Play ${entry.word}. ${entry.pos || "Word"}. ${entry.phonetic || ""}. Synonyms: ${synonyms.join(", ")}. ${entry.translation || ""}. ${entry.example || ""}`);
    card.addEventListener("click", () => speakWord(entry.word));
    const left = document.createElement("div");
    left.className = "preview-card-left";
    const right = document.createElement("div");
    right.className = "preview-card-right";
    const heading = document.createElement("div");
    heading.className = "preview-word-heading";
    const word = document.createElement("span");
    word.className = "preview-word";
    word.textContent = entry.word;
    const pos = document.createElement("span");
    pos.className = "preview-pos";
    pos.textContent = entry.pos || "WORD";
    const phonetic = document.createElement("span");
    phonetic.className = "preview-phonetic";
    phonetic.textContent = entry.phonetic || "";
    const synonymList = document.createElement("p");
    synonymList.className = "preview-synonyms";
    synonymList.textContent = synonyms.join(" · ");
    const translation = document.createElement("span");
    translation.className = "preview-translation";
    translation.textContent = entry.translation || "";
    const example = document.createElement("p");
    example.className = "preview-example";
    example.replaceChildren(...highlightWord(entry.example || "", entry.word || ""));
    heading.append(word, pos);
    left.append(heading, phonetic, synonymList);
    right.append(translation, example);
    card.append(left, right);
    row.append(card);
    previewList.append(row);
  });
}

function updateSelectDropdowns() {
  document.querySelectorAll(".set-select").forEach((select) => {
    select.replaceChildren();
    allSets.forEach((set) => {
      const option = document.createElement("option");
      option.value = set.id;
      option.textContent = set.name;
      select.append(option);
    });
    select.value = activeSetId;
  });
}

function renderSetProgress() {
  const selectors = [document.querySelector("#study-set-select"), document.querySelector("#words-set-select")];
  allSets.forEach((set) => {
    const statuses = statusBySet[set.id] || {};
    const rememberedCount = Object.values(statuses).filter((status) => status === "remembered").length;
    const optionLabel = `${set.name} (${rememberedCount}/${set.cards.length})`;
    selectors.forEach((select) => {
      if (!select) return;
      const option = select.querySelector(`option[value="${set.id}"]`);
      if (option) option.textContent = optionLabel;
    });
  });
  selectors.forEach((select) => { if (select) select.value = activeSetId; });
  const statuses = statusBySet[activeSetId] || {};
  const rememberedCount = Object.values(statuses).filter((status) => status === "remembered").length;
  const reviewCount = Object.values(statuses).filter((status) => status === "review").length;
  const summary = `${rememberedCount} of ${activeSet().cards.length} remembered · ${reviewCount} to review`;
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
  } catch {}
  activeCategory = "all";
  document.querySelectorAll(".list-tab").forEach((tab) => {
    const isActive = tab.dataset.category === "all";
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  startStudy();
  renderWords();
  renderHome();
  renderSetPreview();
}

function setView(view) {
  const isHome = view === "home";
  const isStudy = view === "study";
  if (homeView) homeView.hidden = !isHome;
  if (studyView) studyView.hidden = !isStudy;
  if (wordsView) wordsView.hidden = isHome || isStudy;
  document.querySelectorAll(".nav-link").forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (isHome) renderHome();
  if (view === "words") renderWords();
  if (isStudy && !document.querySelector("#card-scene").hidden) {
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

// Bật tắt form thêm bộ từ
const customSetSection = document.querySelector("#custom-set-section");
document.querySelector("#toggle-add-set-btn")?.addEventListener("click", () => {
  if (customSetSection) customSetSection.hidden = !customSetSection.hidden;
});
document.querySelector("#btn-cancel-create")?.addEventListener("click", () => {
  if (customSetSection) customSetSection.hidden = true;
});

// --- BỘ TÁCH VĂN BẢN THÔNG MINH CHO CẢ ĐỊNH DẠNG TAB LẪN GẠCH ĐỨNG ---
function parseRawVocabulary(text) {
  const lines = text.trim().split("\n");
  const cards = [];

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    let word = "";
    let pos = "word";
    let phonetic = "";
    let translation = "";
    let synonyms = [];
    let example = "";

    // 1. Phân tách dòng thành các phần dựa trên dấu Tab hoặc dấu gạch đứng '|'
    let parts = [];
    if (line.includes("\t")) {
      const tabSplits = line.split("\t");
      const firstWord = tabSplits[0].trim();
      const rest = tabSplits.slice(1).join("\t");
      parts = [firstWord, ...rest.split("|").map(p => p.trim())];
    } else if (line.includes("|")) {
      const pipeSplits = line.split("|").map(p => p.trim());
      // Nếu phần đầu có chứa cả từ và nghĩa bị dính cách, tách từ đầu tiên làm word
      const firstPart = pipeSplits[0];
      const spaceIdx = firstPart.indexOf(" ");
      if (spaceIdx !== -1) {
        word = firstPart.slice(0, spaceIdx).trim();
        const def = firstPart.slice(spaceIdx).trim();
        parts = [word, def, ...pipeSplits.slice(1)];
      } else {
        parts = pipeSplits;
      }
    } else {
      // Trường hợp nhập ngắn gọn Từ - Nghĩa
      const separator = line.includes(" - ") ? " - " : "-";
      const splits = line.split(separator);
      if (splits.length >= 2) {
        word = splits[0].trim();
        translation = splits.slice(1).join(separator).trim();
      }
    }

    if (parts.length > 0) {
      word = parts[0].trim();

      // Phần nghĩa và loại từ
      if (parts[1]) {
        let defText = parts[1].trim();
        const posMatch = defText.match(/\((v\/n|n\/v|v\.|n\.|adj\.|adv\.|noun|verb|adjective|adverb)\)/i);
        if (posMatch) {
          const rawPos = posMatch[1].toLowerCase().replace(".", "");
          const partOfSpeech = {
            v: "verb",
            n: "noun",
            adj: "adjective",
            adv: "adverb",
            "n/v": "noun / verb",
            "v/n": "verb / noun"
          };
          pos = partOfSpeech[rawPos] || rawPos;
          defText = defText.replace(posMatch[0], "").trim();
        }
        translation = defText;
      }

      // Xử lý các khúc còn lại: phiên âm, ví dụ, từ đồng nghĩa
      for (let i = 2; i < parts.length; i++) {
        const chunk = parts[i].trim();
        if (chunk.startsWith("/") && chunk.endsWith("/")) {
          phonetic = chunk;
        } else if (chunk.toLowerCase().startsWith("vd:") || chunk.toLowerCase().startsWith("ex:")) {
          example = chunk.replace(/^(vd:|ex:)\s*/i, "").trim();
        } else if (chunk.toLowerCase().includes("đồng nghĩa:") || chunk.toLowerCase().startsWith("synonyms:")) {
          const synText = chunk.replace(/.*(đồng nghĩa:|synonyms:)\s*/i, "").trim();
          synonyms = synText.split(",").map(s => s.trim()).filter(Boolean);
        }
      }
    }

    if (word && translation) {
      cards.push({
        word: word,
        pos: pos,
        phonetic: phonetic,
        translation: translation,
        synonyms: synonyms,
        example: example || `The word ${word} is used in this sentence.`
      });
    }
  });

  return cards;
}

// Lưu bộ từ lên Firebase
document.getElementById("btn-save-firebase")?.addEventListener("click", async () => {
  if (!db) {
    alert("Chưa kết nối được với Firebase Firestore. Vui lòng kiểm tra lại kết nối mạng!");
    return;
  }
  const title = document.getElementById("deck-title").value.trim();
  const rawText = document.getElementById("import-input").value.trim();

  if (!title || !rawText) {
    alert("Vui lòng nhập tên bộ từ và danh sách từ vựng!");
    return;
  }

  const cards = parseRawVocabulary(rawText);
  if (cards.length === 0) {
    alert("Không tìm thấy từ hợp lệ. Vui lòng kiểm tra lại định dạng!");
    return;
  }

  const btn = document.getElementById("btn-save-firebase");
  btn.innerText = "Đang lưu lên hệ thống...";
  btn.disabled = true;

  try {
    await db.collection("decks").add({
      name: title,
      cards: cards,
      createdAt: new Date().toISOString()
    });

    alert("Tạo bộ từ thành công! Đang tải lại danh sách...");
    document.getElementById("deck-title").value = "";
    document.getElementById("import-input").value = "";
    if (customSetSection) customSetSection.hidden = true;
    btn.innerText = "Lưu & Chia Sẻ Lên Server";
    btn.disabled = false;
    await syncOnlineDecks();
  } catch (err) {
    console.error("Lỗi Firebase:", err);
    alert("Lưu thất bại. Hãy chắc chắn Firestore Database ở trạng thái Test mode.");
    btn.innerText = "Lưu & Chia Sẻ Lên Server";
    btn.disabled = false;
  }
});

// Tải bộ từ từ Firebase và hiển thị
async function syncOnlineDecks() {
  if (!db) return;
  try {
    const snapshot = await db.collection("decks").orderBy("createdAt", "desc").get();
    snapshot.forEach((doc) => {
      const data = doc.data() || {};
      const onlineSetId = `firebase-${doc.id}`;
      if (!setsById.has(onlineSetId)) {
        const cards = Array.isArray(data.cards)
          ? data.cards.filter((card) => card && typeof card.word === "string" && card.word.trim()).map((card) => ({
            word: card.word.trim(),
            pos: typeof card.pos === "string" ? card.pos : "word",
            phonetic: typeof card.phonetic === "string" ? card.phonetic : "",
            translation: typeof card.translation === "string" ? card.translation : "",
            synonyms: Array.isArray(card.synonyms) ? card.synonyms.filter((synonym) => typeof synonym === "string") : [],
            example: typeof card.example === "string" && card.example ? card.example : `The word ${card.word.trim()} is used in this sentence.`
          }))
          : [];
        if (!cards.length) return;
        const newSet = {
          id: onlineSetId,
          name: typeof data.name === "string" && data.name.trim() ? data.name.trim() : "Untitled set",
          cards
        };
        allSets.push(newSet);
        setsById.set(onlineSetId, newSet);
        const validWords = new Set(cards.map((card) => card.word));
        statusBySet[onlineSetId] = Object.fromEntries(Object.entries(statusBySet[onlineSetId] || {}).filter(([word, status]) => validWords.has(word) && ["review", "remembered"].includes(status)));
      }
    });
    let savedSetId = null;
    try {
      savedSetId = localStorage.getItem(activeSetStorageKey);
    } catch {
      // Continue with the default set when storage is unavailable.
    }
    if (savedSetId && setsById.has(savedSetId) && savedSetId !== activeSetId) {
      activeSetId = savedSetId;
      statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
      startStudy();
    }
    updateSelectDropdowns();
    renderHome();
    renderSetProgress();
    renderSetPreview();
    if (wordsView && !wordsView.hidden) renderWords();
  } catch (err) {
    console.warn("Không thể đồng bộ Firestore:", err);
  }
}

// Cài đặt âm thanh và Theme
const settingsMenu = document.querySelector("#settings-menu");
const voiceSelect = document.querySelector("#voice-gender");
const speedSelect = document.querySelector("#voice-speed");
document.querySelector("#theme-select")?.addEventListener("change", (event) => applyTheme(event.target.value));
applyTheme(loadTheme());
if (voiceSelect) voiceSelect.value = voiceSettings.gender;
if (speedSelect) speedSelect.value = voiceSettings.speed;
document.querySelectorAll("#voice-gender, #voice-speed").forEach((control) => {
  control.addEventListener("change", () => {
    voiceSettings = {
      gender: voiceSelect.value,
      speed: speedSelect.value
    };
    saveVoiceSettings();
    updateVoiceNote();
  });
});
if (supportsSpeech) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
} else {
  [voiceSelect, speedSelect].filter(Boolean).forEach((control) => { control.disabled = true; });
  updateVoiceNote("Speech playback is not supported by this browser.");
}

settingsMenu?.addEventListener("click", (event) => event.stopPropagation());
document.addEventListener("click", () => { if (settingsMenu) settingsMenu.open = false; });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && settingsMenu) settingsMenu.open = false;
});

document.querySelector(".wordmark")?.addEventListener("click", (event) => {
  event.preventDefault();
  setView("home");
});
flashcard?.addEventListener("click", () => {
  setCardFace(!flashcard.classList.contains("is-flipped"));
});
flashcard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setCardFace(!flashcard.classList.contains("is-flipped"));
  }
});
reviewButton.addEventListener("click", () => gradeCard("review"));
rememberButton.addEventListener("click", () => gradeCard("remembered"));
document.querySelector("#restart-button").addEventListener("click", startStudy);
document.querySelectorAll(".set-select").forEach((select) => {
  select.addEventListener("change", () => changeSet(select.value));
});
document.querySelectorAll(".study-order-button").forEach((button) => {
  button.addEventListener("click", () => changeStudyOrder(button.dataset.studyOrder));
});
updateStudyOrderControl();
document.querySelectorAll(".nav-link").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelector("#back-to-study")?.addEventListener("click", () => setView("study"));

document.querySelectorAll(".list-tab").forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll(".list-tab").forEach((tab) => {
    const isActive = tab === button;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  renderWords();
}));

document.querySelector("#reset-progress")?.addEventListener("click", () => {
  if (!Object.keys(statusByWord).length && reviewQueue.length === 0) return;
  if (reviewTimer) clearInterval(reviewTimer);
  reviewTimer = null;
  reviewQueue = [];
  easyReviewCounts = {};
  activeReviewItem = null;
  currentIndex = 0;
  studyOrder = orderCards(activeSet().cards);
  statusByWord = {};
  statusBySet[activeSetId] = statusByWord;
  sessionResults = { review: 0, remembered: 0 };
  document.querySelector("#review-waiting").hidden = true;
  document.querySelector("#completion-panel").hidden = true;
  document.querySelector("#card-scene").hidden = false;
  document.querySelector("#answer-area").hidden = false;
  saveProgress();
  renderCard();
  renderHome();
  updatePreviewFilterCount();
  if (previewFilterMode === "learning") renderSetPreview();
  if (!wordsView.hidden) renderWords();
});

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLElement && ["BUTTON", "A", "INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.target === flashcard) return;
  if (!studyView || studyView.hidden || document.querySelector("#card-scene")?.hidden) return;
  if (event.key === " ") {
    event.preventDefault();
    if (flashcard) setCardFace(!flashcard.classList.contains("is-flipped"));
  }
  if (event.key === "ArrowLeft") gradeCard("review");
  if (event.key === "ArrowRight") gradeCard("remembered");
});

document.querySelector("#preview-filter").addEventListener("change", (event) => {
  previewFilterMode = event.target.value === "learning" ? "learning" : "all";
  renderSetPreview();
});

// Khởi chạy
updateSelectDropdowns();
renderCard();
renderWords();
renderHome();
renderSetPreview();
syncOnlineDecks();