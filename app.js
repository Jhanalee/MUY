const words = [
  { word: "aberrant", pos: "adjective", phonetic: "/əˈberənt/", translation: "khác thường, đi lệch khỏi chuẩn mực", synonyms: ["atypical", "unusual", "deviant"], example: "The scientist repeated the trial after noticing an aberrant result." },
  { word: "candid", pos: "adjective", phonetic: "/ˈkændɪd/", translation: "thẳng thắn, chân thật", synonyms: ["frank", "honest", "outspoken"], example: "Her candid feedback helped the team improve its proposal." },
  { word: "concede", pos: "verb", phonetic: "/kənˈsiːd/", translation: "thừa nhận; nhượng bộ", synonyms: ["admit", "acknowledge", "yield"], example: "After reviewing the new evidence, the author had to concede her point." },
  { word: "diligent", pos: "adjective", phonetic: "/ˈdɪlɪdʒənt/", translation: "siêng năng, cần cù", synonyms: ["assiduous", "industrious", "thorough"], example: "His diligent research uncovered a pattern in the historical records." },
  { word: "discrepancy", pos: "noun", phonetic: "/dɪˈskrepənsi/", translation: "sự khác biệt, điểm không nhất quán", synonyms: ["inconsistency", "difference", "divergence"], example: "The auditor noticed a discrepancy between the two reports." },
  { word: "eloquent", pos: "adjective", phonetic: "/ˈeləkwənt/", translation: "hùng hồn, diễn đạt lưu loát", synonyms: ["articulate", "expressive", "persuasive"], example: "Her eloquent speech made a complex issue feel clear." },
  { word: "mitigate", pos: "verb", phonetic: "/ˈmɪtɪɡeɪt/", translation: "làm giảm nhẹ, xoa dịu", synonyms: ["alleviate", "lessen", "ease"], example: "Planting trees can help mitigate the effects of extreme heat." },
  { word: "pragmatic", pos: "adjective", phonetic: "/præɡˈmætɪk/", translation: "thực tế, chú trọng tính khả thi", synonyms: ["practical", "sensible", "realistic"], example: "They chose a pragmatic solution that fit the time they had." }
];

const storageKey = "marginalia-sat-progress-v1";
const wordByName = new Map(words.map((entry) => [entry.word, entry]));
const flashcard = document.querySelector("#flashcard");
const reviewButton = document.querySelector("#review-button");
const rememberButton = document.querySelector("#remember-button");
const studyView = document.querySelector("#study-view");
const wordsView = document.querySelector("#words-view");
const progressTrack = document.querySelector("#progress-track");
let statusByWord = loadProgress();
let currentIndex = 0;
let studyOrder = words.map((entry) => entry.word);
let sessionResults = { review: 0, remembered: 0 };
let activeCategory = "all";

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return Object.fromEntries(Object.entries(saved).filter(([word, status]) => wordByName.has(word) && ["review", "remembered"].includes(status)));
  } catch {
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(statusByWord));
  } catch {
    // Keep the current session usable when storage is unavailable.
  }
}

function currentWord() {
  return wordByName.get(studyOrder[currentIndex]);
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
  setCardFace(false);
}

function gradeCard(status) {
  statusByWord[currentWord().word] = status;
  sessionResults[status] += 1;
  saveProgress();
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
  studyOrder = words.map((entry) => entry.word);
  document.querySelector("#completion-panel").hidden = true;
  document.querySelector("#card-scene").hidden = false;
  document.querySelector("#answer-area").hidden = false;
  renderCard();
}

function renderWords() {
  const rememberedCount = Object.values(statusByWord).filter((status) => status === "remembered").length;
  const reviewCount = Object.values(statusByWord).filter((status) => status === "review").length;
  document.querySelector("#total-count").textContent = formatCount(words.length);
  document.querySelector("#all-count").textContent = formatCount(words.length);
  document.querySelector("#remembered-count").textContent = formatCount(rememberedCount);
  document.querySelector("#review-count").textContent = formatCount(reviewCount);
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

function setView(view) {
  const isStudy = view === "study";
  studyView.hidden = !isStudy;
  wordsView.hidden = isStudy;
  document.querySelectorAll(".nav-link").forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (!isStudy) renderWords();
}

flashcard.addEventListener("click", () => setCardFace(!flashcard.classList.contains("is-flipped")));
flashcard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setCardFace(!flashcard.classList.contains("is-flipped"));
  }
});
reviewButton.addEventListener("click", () => gradeCard("review"));
rememberButton.addEventListener("click", () => gradeCard("remembered"));
document.querySelector("#restart-button").addEventListener("click", startStudy);
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
  sessionResults = { review: 0, remembered: 0 };
  saveProgress();
  renderCard();
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