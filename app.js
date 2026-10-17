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

// Bảo vệ tránh crash khi sets.js tải chậm
const allSets = (typeof sets !== "undefined" && Array.isArray(sets)) ? sets : [];
let setsById = new Map(allSets.map((set) => [set.id, set]));

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
let currentIndex = 0;
let studyOrder = activeSet().cards.map((entry) => entry.word);
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
  } catch {}
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
      return Object.fromEntries(allSets.map((set) => {
        const wordsInSet = new Set(set.cards.map((entry) => entry.word));
        const statuses = saved[set.id] && typeof saved[set.id] === "object" ? saved[set.id] : {};
        return [set.id, Object.fromEntries(Object.entries(statuses).filter(([word, status]) => wordsInSet.has(word) && ["review", "remembered"].includes(status)))];
      }));
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
  return activeSet().cards.find((entry) => entry.word === studyOrder[currentIndex]) || activeSet().cards[0];
}

function formatCount(count) {
  return String(count).padStart(2, "0");
}

function highlightWord(sentence, word) {
  if (!sentence) return [document.createTextNode("")];
  const position = sentence.toLowerCase().indexOf((word || "").toLowerCase());
  if (position === -1) return [document.createTextNode(sentence)];
  const highlighted = document.createElement("em");
  highlighted.textContent = sentence.slice(position, position + word.length);
  return [document.createTextNode(sentence.slice(0, position)), highlighted, document.createTextNode(sentence.slice(position + word.length))];
}

function setCardFace(isFlipped) {
  if (!flashcard) return;
  flashcard.classList.toggle("is-flipped", isFlipped);
  document.querySelector("#card-front")?.setAttribute("aria-hidden", String(isFlipped));
  document.querySelector("#card-back")?.setAttribute("aria-hidden", String(!isFlipped));
  flashcard.setAttribute("aria-label", isFlipped ? "Definition revealed. Press Enter or Space to see the word again." : "Vocabulary card. Press Enter or Space to reveal the definition.");
  if (isFlipped && voiceSettings.onFlip && !studyView.hidden) {
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  }
}

function renderCard() {
  const entry = currentWord();
  if (!entry) return;
  const cardIndex = document.querySelector("#card-index");
  if (cardIndex) cardIndex.innerHTML = `${formatCount(currentIndex + 1)} <span>/ ${formatCount(studyOrder.length)}</span>`;
  document.querySelector("#front-pos").textContent = (entry.pos || "word").toUpperCase();
  document.querySelector("#front-word").textContent = entry.word;
  document.querySelector("#front-phonetic").textContent = entry.phonetic || "";
  document.querySelector("#back-word").textContent = entry.word;
  document.querySelector("#back-translation").textContent = entry.translation || "";
  document.querySelectorAll(".card-set-name").forEach((label) => { label.textContent = activeSet().name.toUpperCase(); });
  
  const syns = entry.synonyms || [];
  document.querySelector("#back-synonyms")?.replaceChildren(...syns.flatMap((synonym, index) => {
    const nodes = [document.createTextNode(synonym)];
    if (index < syns.length - 1) {
      const separator = document.createElement("span");
      separator.textContent = " · ";
      nodes.push(separator);
    }
    return nodes;
  }));
  document.querySelector("#back-example")?.replaceChildren(...highlightWord(entry.example || "", entry.word));
  const progressLabel = document.querySelector("#progress-label");
  if (progressLabel) progressLabel.innerHTML = `${formatCount(currentIndex + 1)} <span>/</span> ${formatCount(studyOrder.length)}`;
  
  if (progressTrack) {
    progressTrack.setAttribute("aria-valuemax", String(studyOrder.length));
    progressTrack.setAttribute("aria-valuenow", String(currentIndex));
  }
  const fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = `${(currentIndex / (studyOrder.length || 1)) * 100}%`;
  
  document.querySelector("#review-tally").textContent = String(sessionResults.review);
  document.querySelector("#remember-tally").textContent = String(sessionResults.remembered);
  document.querySelector("#session-note").textContent = currentIndex === 0 ? "Take a breath. There’s no rush." : "One small step at a time.";
  renderSetProgress();
  setCardFace(false);
  if (voiceSettings.onCard && !studyView.hidden) speakWord(entry.word);
}

function gradeCard(status) {
  const entry = currentWord();
  if (!entry) return;
  statusByWord[entry.word] = status;
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
  if (flashcard) flashcard.classList.remove("is-flipped");
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
  const previewTitle = document.querySelector("#preview-title");
  if (previewTitle) previewTitle.textContent = selectedSet.name;
  const previewCount = document.querySelector("#preview-count");
  if (previewCount) previewCount.textContent = `${formatCount(selectedSet.cards.length)} WORDS`;
  const previewList = document.querySelector("#preview-list");
  if (!previewList) return;
  previewList.replaceChildren();
  selectedSet.cards.forEach((entry) => {
    const row = document.createElement("li");
    row.className = "preview-word-row";
    const word = document.createElement("span");
    word.className = "preview-word";
    word.textContent = entry.word;
    const pos = document.createElement("span");
    pos.className = "preview-pos";
    pos.textContent = entry.pos || "";
    const translation = document.createElement("span");
    translation.className = "preview-translation";
    translation.textContent = entry.translation || "";
    row.append(word, pos, translation);
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
  if (isStudy && voiceSettings.onCard && !document.querySelector("#card-scene").hidden) {
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

// Phân tích văn bản nhập đầy đủ: từ, loại từ, phiên âm, ví dụ, đồng nghĩa
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

    // 1. Trường hợp định dạng đầy đủ chuẩn kiki.txt (chứa dấu Tab hoặc dấu gạch đứng '|')
    if (line.includes("\t") || line.includes("|")) {
      const parts = line.split(line.includes("\t") ? "\t" : "|").map(p => p.trim()).filter(Boolean);
      word = parts[0];

      // Đọc phần nghĩa và loại từ
      if (parts[1]) {
        let defText = parts[1];
        const posMatch = defText.match(/\((v\.\vert{}n\.\vert{}adj\.\vert{}adv\.\vert{}noun\vert{}verb\vert{}adjective\vert{}adverb)\)/i);
        if (posMatch) {
          const rawPos = posMatch[1].toLowerCase().replace(".", "");
          pos = rawPos === "v" ? "verb" : rawPos === "n" ? "noun" : rawPos === "adj" ? "adjective" : rawPos === "adv" ? "adverb" : rawPos;
          defText = defText.replace(posMatch[0], "").trim();
        }
        translation = defText;
      }

      // Đọc các phần tiếp theo: phiên âm, ví dụ, từ đồng nghĩa
      for (let i = 2; i < parts.length; i++) {
        const chunk = parts[i];
        if (chunk.startsWith("/") && chunk.endsWith("/")) {
          phonetic = chunk;
        } else if (chunk.toLowerCase().startsWith("vd:") || chunk.toLowerCase().startsWith("ex:")) {
          example = chunk.replace(/^(vd:|ex:)\s*/i, "").trim();
        } else if (chunk.toLowerCase().includes("đồng nghĩa:") || chunk.toLowerCase().startsWith("synonyms:")) {
          const synString = chunk.replace(/.*(đồng nghĩa:|synonyms:)\s*/i, "").trim();
          synonyms = synString.split(",").map(s => s.trim()).filter(Boolean);
        }
      }
    } 
    // 2. Trường hợp định dạng ngắn gọn: Từ - Nghĩa
    else {
      const separator = line.includes(" - ") ? " - " : "-";
      const parts = line.split(separator);
      if (parts.length >= 2) {
        word = parts[0].trim();
        translation = parts.slice(1).join(separator).trim();
      }
    }

    if (word && translation) {
      cards.push({
        word: word,
        pos: pos,
        phonetic: phonetic,
        translation: translation,
        synonyms: synonyms,
        example: example || `Example sentence for ${word}.`
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
      const data = doc.data();
      const onlineSetId = `firebase-${doc.id}`;
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

// Cài đặt âm thanh và Theme
const settingsMenu = document.querySelector("#settings-menu");
const voiceSelect = document.querySelector("#voice-gender");
const speedSelect = document.querySelector("#voice-speed");
const onCardToggle = document.querySelector("#voice-on-card");
const onFlipToggle = document.querySelector("#voice-on-flip");

document.querySelector("#theme-select")?.addEventListener("change", (event) => applyTheme(event.target.value));
applyTheme(loadTheme());

if (voiceSelect) voiceSelect.value = voiceSettings.gender;
if (speedSelect) speedSelect.value = voiceSettings.speed;
if (onCardToggle) onCardToggle.checked = voiceSettings.onCard;
if (onFlipToggle) onFlipToggle.checked = voiceSettings.onFlip;

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
    const entry = currentWord();
    if (entry) speakWord(entry.word);
  });
});

if (supportsSpeech) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
} else {
  document.querySelectorAll(".listen-button").forEach((button) => { button.disabled = true; });
  [voiceSelect, speedSelect, onCardToggle, onFlipToggle].forEach((control) => { if (control) control.disabled = true; });
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

if (flashcard) {
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
}

reviewButton?.addEventListener("click", () => gradeCard("review"));
rememberButton?.addEventListener("click", () => gradeCard("remembered"));
document.querySelector("#restart-button")?.addEventListener("click", startStudy);
document.querySelector("#preview-start")?.addEventListener("click", () => setView("study"));

document.querySelectorAll(".set-select").forEach((select) => {
  select.addEventListener("change", () => changeSet(select.value));
});
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
  if (!Object.keys(statusByWord).length) return;
  statusByWord = {};
  statusBySet[activeSetId] = statusByWord;
  sessionResults = { review: 0, remembered: 0 };
  saveProgress();
  renderCard();
  renderHome();
  if (wordsView && !wordsView.hidden) renderWords();
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

// Khởi chạy
updateSelectDropdowns();
renderCard();
renderWords();
renderHome();
syncOnlineDecks();