const storageKey = "marginalia-sat-progress-v2";
const legacyStorageKey = "marginalia-sat-progress-v1";
const activeSetStorageKey = "marginalia-sat-active-set-v1";
const setsById = new Map(sets.map((set) => [set.id, set]));
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
let statusByWord = statusBySet[activeSetId];
let currentIndex = 0;
let studyOrder = activeSet().cards.map((entry) => entry.word);
let sessionResults = { review: 0, remembered: 0 };
let activeCategory = "all";
let voiceSettings = loadVoiceSettings();
let availableVoices = [];

function activeSet() {
  return setsById.get(activeSetId);
}

function loadActiveSet() {
  try {
    const savedSetId = localStorage.getItem(activeSetStorageKey);
    return setsById.has(savedSetId) ? savedSetId : sets[0].id;
  } catch {
    return sets[0].id;
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
  document.querySelector("#theme-select").value = selectedTheme;
  document.querySelector('meta[name="theme-color"]').content = {
    green: "#171916",
    red: "#1d1718",
    graphite: "#17191d"
  }[selectedTheme];
  try {
    localStorage.setItem(themeStorageKey, selectedTheme);
  } catch {
    // Keep the selected theme for the current session.
  }
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
  if (!supportsSpeech) return false;
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
  utterance.onstart = () => updateVoiceNote(voice
    ? `Speaking with ${voice.name}.`
    : "Speaking with your device's default English voice.");
  utterance.onerror = (event) => {
    if (event.error !== "canceled" && event.error !== "interrupted") {
      updateVoiceNote("Playback failed. Check that your device has an English speech voice enabled.");
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
      return Object.fromEntries(sets.map((set) => {
        const wordsInSet = new Set(set.cards.map((entry) => entry.word));
        const statuses = saved[set.id] && typeof saved[set.id] === "object" ? saved[set.id] : {};
        return [set.id, Object.fromEntries(Object.entries(statuses).filter(([word, status]) => wordsInSet.has(word) && ["review", "remembered"].includes(status)))];
      }));
    }
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey) || "{}");
    const firstSetWords = new Set(sets[0].cards.map((entry) => entry.word));
    return { [sets[0].id]: Object.fromEntries(Object.entries(legacy).filter(([word, status]) => firstSetWords.has(word) && ["review", "remembered"].includes(status))) };
  } catch {
    return Object.fromEntries(sets.map((set) => [set.id, {}]));
  }
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(statusBySet));
  } catch {
    // Keep the current session usable when storage is unavailable.
  }
}

function currentWord() {
  return activeSet().cards.find((entry) => entry.word === studyOrder[currentIndex]);
}

function formatCount(count) {
  return String(count).padStart(2, "0");
}

function highlightWord(sentence, word) {
  const position = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (position === -1) return [document.createTextNode(sentence)];
  const highlighted = document.createElement("em");
  highlighted.textContent = sentence.slice(position, position + word.length);
  return [document.createTextNode(sentence.slice(0, position)), highlighted, document.createTextNode(sentence.slice(position + word.length))];
}

function setCardFace(isFlipped) {
  flashcard.classList.toggle("is-flipped", isFlipped);
  document.querySelector("#card-front").setAttribute("aria-hidden", String(isFlipped));
  document.querySelector("#card-back").setAttribute("aria-hidden", String(!isFlipped));
  flashcard.setAttribute("aria-label", isFlipped ? "Definition revealed. Press Enter or Space to see the word again." : "Vocabulary card. Press Enter or Space to reveal the definition.");
  if (isFlipped && voiceSettings.onFlip && !studyView.hidden) speakWord(currentWord().word);
}

function renderCard() {
  const entry = currentWord();
  if (!entry) return;
  document.querySelector("#card-index").innerHTML = `${formatCount(currentIndex + 1)} <span>/ ${formatCount(studyOrder.length)}</span>`;
  document.querySelector("#front-pos").textContent = entry.pos.toUpperCase();
  document.querySelector("#front-word").textContent = entry.word;
  document.querySelector("#front-phonetic").textContent = entry.phonetic;
  document.querySelector("#back-word").textContent = entry.word;
  document.querySelector("#back-translation").textContent = entry.translation;
  document.querySelectorAll(".card-set-name").forEach((label) => { label.textContent = activeSet().name.toUpperCase(); });
  document.querySelector("#back-synonyms").replaceChildren(...entry.synonyms.flatMap((synonym, index) => {
    const nodes = [document.createTextNode(synonym)];
    if (index < entry.synonyms.length - 1) {
      const separator = document.createElement("span");
      separator.textContent = " · ";
      nodes.push(separator);
    }
    return nodes;
  }));
  document.querySelector("#back-example").replaceChildren(...highlightWord(entry.example, entry.word));
  document.querySelector("#progress-label").innerHTML = `${formatCount(currentIndex + 1)} <span>/</span> ${formatCount(studyOrder.length)}`;
  progressTrack.setAttribute("aria-valuemax", String(studyOrder.length));
  progressTrack.setAttribute("aria-valuenow", String(currentIndex));
  document.querySelector("#progress-fill").style.width = `${(currentIndex / studyOrder.length) * 100}%`;
  document.querySelector("#review-tally").textContent = String(sessionResults.review);
  document.querySelector("#remember-tally").textContent = String(sessionResults.remembered);
  document.querySelector("#session-note").textContent = currentIndex === 0 ? "Take a breath. There’s no rush." : "One small step at a time.";
  renderSetProgress();
  setCardFace(false);
  if (voiceSettings.onCard && !studyView.hidden) speakWord(entry.word);
}

function gradeCard(status) {
  statusByWord[currentWord().word] = status;
  sessionResults[status] += 1;
  saveProgress();
  renderSetProgress();
  currentIndex += 1;
  if (currentIndex >= studyOrder.length) {
    showCompletion();
    return;
  }
  renderCard();
}

function showCompletion() {
  flashcard.classList.remove("is-flipped");
  document.querySelector("#card-scene").hidden = true;
  document.querySelector("#answer-area").hidden = true;
  document.querySelector("#completion-panel").hidden = false;
  document.querySelector("#progress-label").innerHTML = `${formatCount(studyOrder.length)} <span>/</span> ${formatCount(studyOrder.length)}`;
  document.querySelector("#progress-fill").style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(studyOrder.length));
  document.querySelector("#completion-copy").textContent = `${sessionResults.remembered} remembered · ${sessionResults.review} to revisit. Every word gets easier with practice.`;
}

function startStudy() {
  currentIndex = 0;
  sessionResults = { review: 0, remembered: 0 };
  studyOrder = activeSet().cards.map((entry) => entry.word);
  document.querySelector("#completion-panel").hidden = true;
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
    pos.textContent = entry.pos;
    const translation = document.createElement("span");
    translation.className = "row-translation";
    translation.textContent = entry.translation;
    const statusLabel = document.createElement("span");
    statusLabel.className = `row-status status-${status}`;
    statusLabel.textContent = status === "remembered" ? "✓ Remembered" : status === "review" ? "× Review" : "— New";
    row.append(word, pos, translation, statusLabel);
    list.append(row);
  });
}

function renderHome() {
  const setGrid = document.querySelector("#home-set-grid");
  setGrid.replaceChildren();
  sets.forEach((set, index) => {
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
    progress.textContent = `${rememberedCount} / ${set.cards.length} remembered`;
    const arrow = document.createElement("span");
    arrow.className = "home-set-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    option.append(label, name, progress, arrow);
    option.addEventListener("click", () => changeSet(set.id));
    setGrid.append(option);
  });

  const selectedSet = activeSet();
  document.querySelector("#preview-title").textContent = selectedSet.name;
  document.querySelector("#preview-count").textContent = `${formatCount(selectedSet.cards.length)} WORDS`;
  const previewList = document.querySelector("#preview-list");
  previewList.replaceChildren();
  selectedSet.cards.forEach((entry) => {
    const row = document.createElement("li");
    row.className = "preview-word-row";
    const word = document.createElement("span");
    word.className = "preview-word";
    word.textContent = entry.word;
    const pos = document.createElement("span");
    pos.className = "preview-pos";
    pos.textContent = entry.pos;
    const translation = document.createElement("span");
    translation.className = "preview-translation";
    translation.textContent = entry.translation;
    row.append(word, pos, translation);
    previewList.append(row);
  });
}

function renderSetProgress() {
  const selectors = [document.querySelector("#study-set-select"), document.querySelector("#words-set-select")];
  sets.forEach((set) => {
    const statuses = statusBySet[set.id] || {};
    const rememberedCount = Object.values(statuses).filter((status) => status === "remembered").length;
    const optionLabel = `${set.name} (${rememberedCount}/${set.cards.length})`;
    selectors.forEach((select) => {
      const option = select.querySelector(`option[value="${set.id}"]`);
      if (option) option.textContent = optionLabel;
    });
  });
  selectors.forEach((select) => { select.value = activeSetId; });
  const statuses = statusBySet[activeSetId] || {};
  const rememberedCount = Object.values(statuses).filter((status) => status === "remembered").length;
  const reviewCount = Object.values(statuses).filter((status) => status === "review").length;
  const summary = `${rememberedCount} of ${activeSet().cards.length} remembered · ${reviewCount} to review`;
  document.querySelector("#study-set-progress").textContent = summary;
  document.querySelector("#words-set-progress").textContent = summary;
}

function changeSet(setId) {
  if (!setsById.has(setId) || setId === activeSetId) return;
  activeSetId = setId;
  statusByWord = statusBySet[activeSetId] || (statusBySet[activeSetId] = {});
  try {
    localStorage.setItem(activeSetStorageKey, activeSetId);
  } catch {
    // Keep the current session usable when storage is unavailable.
  }
  activeCategory = "all";
  document.querySelectorAll(".list-tab").forEach((tab) => {
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
  homeView.hidden = !isHome;
  studyView.hidden = !isStudy;
  wordsView.hidden = isHome || isStudy;
  document.querySelectorAll(".nav-link").forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (isHome) renderHome();
  if (view === "words") renderWords();
  if (isStudy && voiceSettings.onCard && !document.querySelector("#card-scene").hidden) {
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

const settingsMenu = document.querySelector("#settings-menu");
const voiceSelect = document.querySelector("#voice-gender");
const speedSelect = document.querySelector("#voice-speed");
const onCardToggle = document.querySelector("#voice-on-card");
const onFlipToggle = document.querySelector("#voice-on-flip");
document.querySelector("#theme-select").addEventListener("change", (event) => applyTheme(event.target.value));
applyTheme(loadTheme());
voiceSelect.value = voiceSettings.gender;
speedSelect.value = voiceSettings.speed;
onCardToggle.checked = voiceSettings.onCard;
onFlipToggle.checked = voiceSettings.onFlip;
document.querySelectorAll("#voice-gender, #voice-speed, #voice-on-card, #voice-on-flip").forEach((control) => {
  control.addEventListener("change", () => {
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
document.querySelectorAll(".listen-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    speakWord(currentWord().word);
  });
});
if (supportsSpeech) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
} else {
  document.querySelectorAll(".listen-button").forEach((button) => { button.disabled = true; });
  [voiceSelect, speedSelect, onCardToggle, onFlipToggle].forEach((control) => { control.disabled = true; });
  updateVoiceNote("Speech playback is not supported by this browser.");
}
settingsMenu.addEventListener("click", (event) => event.stopPropagation());
document.addEventListener("click", () => { settingsMenu.open = false; });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") settingsMenu.open = false;
});

document.querySelector(".wordmark").addEventListener("click", (event) => {
  event.preventDefault();
  setView("home");
});
flashcard.addEventListener("click", (event) => {
  if (event.target.closest(".listen-button")) return;
  setCardFace(!flashcard.classList.contains("is-flipped"));
});
flashcard.addEventListener("keydown", (event) => {
  if (event.target.closest(".listen-button")) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setCardFace(!flashcard.classList.contains("is-flipped"));
  }
});
reviewButton.addEventListener("click", () => gradeCard("review"));
rememberButton.addEventListener("click", () => gradeCard("remembered"));
document.querySelector("#restart-button").addEventListener("click", startStudy);
document.querySelector("#preview-start").addEventListener("click", () => setView("study"));
document.querySelectorAll(".set-select").forEach((select) => {
  sets.forEach((set) => {
    const option = document.createElement("option");
    option.value = set.id;
    option.textContent = set.name;
    select.append(option);
  });
  select.addEventListener("change", () => changeSet(select.value));
});
document.querySelectorAll(".nav-link").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelector("#back-to-study").addEventListener("click", () => setView("study"));
document.querySelectorAll(".list-tab").forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll(".list-tab").forEach((tab) => {
    const isActive = tab === button;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  renderWords();
}));
document.querySelector("#reset-progress").addEventListener("click", () => {
  if (!Object.keys(statusByWord).length) return;
  statusByWord = {};
  statusBySet[activeSetId] = statusByWord;
  sessionResults = { review: 0, remembered: 0 };
  saveProgress();
  renderCard();
  renderHome();
  if (!wordsView.hidden) renderWords();
});
document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLElement && ["BUTTON", "A", "INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.target === flashcard) return;
  if (studyView.hidden || document.querySelector("#card-scene").hidden) return;
  if (event.key === " ") {
    event.preventDefault();
    setCardFace(!flashcard.classList.contains("is-flipped"));
  }
  if (event.key === "ArrowLeft") gradeCard("review");
  if (event.key === "ArrowRight") gradeCard("remembered");
});

renderCard();
renderWords();
renderHome();
// --- KẾT NỐI VÀ ĐỒNG BỘ DỮ LIỆU VỚI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCX_30nYbSoKmyyLBQBjTW_0K1zTUnm6CU",
  authDomain: "muy-flashcards.firebaseapp.com",
  projectId: "muy-flashcards",
  storageBucket: "muy-flashcards.firebasestorage.app",
  messagingSenderId: "745907745384",
  appId: "1:745907745384:web:826faa570f76bcfdeec1dd",
  measurementId: "G-L72QT1NLPH"
};

// Khởi tạo
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Hàm đọc danh sách từ dạng "Từ - Nghĩa"
function parseRawVocabulary(text) {
  const lines = text.trim().split('\n');
  const cards = [];

  lines.forEach(line => {
    const separator = line.includes('\t') ? '\t' : (line.includes(' - ') ? ' - ' : '-');
    const parts = line.split(separator);
    if (parts.length >= 2) {
      cards.push({
        term: parts[0].trim(),
        definition: parts.slice(1).join(separator).trim()
      });
    }
  });
  return cards;
}

// Xử lý nút bấm lưu lên đám mây
document.getElementById('btn-save-firebase')?.addEventListener('click', async () => {
  const title = document.getElementById('deck-title').value.trim();
  const rawText = document.getElementById('import-input').value.trim();
  
  if (!title || !rawText) {
    alert("Vui lòng điền tên bộ từ và nội dung danh sách từ vựng!");
    return;
  }

  const cards = parseRawVocabulary(rawText);
  if (cards.length === 0) {
    alert("Không tìm thấy từ vựng hợp lệ. Vui lòng nhập theo định dạng: Từ - Nghĩa");
    return;
  }

  try {
    const btn = document.getElementById('btn-save-firebase');
    btn.innerText = "Đang lưu...";
    btn.disabled = true;

    // Đẩy lên Firestore
    await db.collection("decks").add({
      title: title,
      cards: cards,
      createdAt: new Date().toISOString()
    });

    alert("Đã thêm thành công! Giờ đây bất kỳ ai truy cập web cũng sẽ thấy bộ từ này.");
    document.getElementById('deck-title').value = '';
    document.getElementById('import-input').value = '';
    btn.innerText = "Lưu & Chia Sẻ Lên Hệ Thống";
    btn.disabled = false;
    
    // Tải lại trang để nạp dữ liệu mới
    location.reload();
  } catch (err) {
    console.error("Lỗi Firebase:", err);
    alert("Lưu thất bại. Hãy chắc chắn bạn đã bật Firestore Database ở Test mode.");
    const btn = document.getElementById('btn-save-firebase');
    if (btn) {
      btn.innerText = "Lưu & Chia Sẻ Lên Hệ Thống";
      btn.disabled = false;
    }
  }
});

// Tự động tải các bộ từ chung trên mạng khi vào trang
async function loadOnlineDecks() {
  try {
    const snapshot = await db.collection("decks").orderBy("createdAt", "desc").get();
    const onlineDecks = [];
    snapshot.forEach(doc => {
      onlineDecks.push({ id: doc.id, ...doc.data() });
    });
    console.log("Dữ liệu các bộ từ trực tuyến tải về thành công:", onlineDecks);
  } catch (err) {
    console.error("Chưa thể tải dữ liệu trực tuyến:", err);
  }
}

loadOnlineDecks();