/* =========================================================
   Biochem Master application
   Vanilla JavaScript only. No framework or backend required.
   ========================================================= */

"use strict";

const APP_VERSION = "1.3.0";
const IMPORTED_UNITS_KEY = "biochem-master-imported-units-v1";
const THEME_KEY = "biochem-master-theme";

/* ------------------------------
   Application state
   ------------------------------ */

const state = {
  catalog: [],
  units: new Map(),
  selectedUnitId: null,
  activeTopicIndex: 0,
  learnQueue: [],
  learnIndex: 0,
  learnAnswerRevealed: false,
  learnSessionStats: { knew: 0, almost: 0, didnt: 0 },
  flashcardIndex: 0,
  flashcardOrder: [],
  answerMode: localStorage.getItem("biochem-master-answer-mode") || "flashcard",
  quizQuestions: [],
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizQuestionCount: "50",
  quizSource: "unit",
  quizRandomize: true,
  quizSessionMistakes: [],
  installPrompt: null,
  unitWorkspaceId: null,
  unitWorkspaceTab: "lessons",
  discoveredUnitFiles: [],
  searchIndex: [],
  searchResults: [],
  activeSearchResultIndex: -1,
  practiceCount: "10",
  practiceSource: "unit",
  practiceQuestions: [],
  practiceAnswers: [],
  practiceIndex: 0,
  practiceTimerEnabled: false,
  practiceTimeRemaining: 0,
  practiceTimerId: null,
  practiceResults: null,
  discoveredDataFiles: [],
  discoveryWarnings: []
};

const STORAGE_KEY = "biochem-master-progress-v1";

/* ------------------------------
   Cached DOM references
   ------------------------------ */

const dom = {
  views: document.querySelectorAll(".view"),
  main: document.querySelector("#main-content"),
  loadingStatus: document.querySelector("#appLoadingStatus"),
  navButtons: document.querySelectorAll(".sidebar-link"),
  unitGrid: document.querySelector("#unitGrid"),
  unitSearch: document.querySelector("#unitSearch"),
  overallPercent: document.querySelector("#overallPercent"),
  learnUnitSelect: document.querySelector("#learnUnitSelect"),
  learnCounter: document.querySelector("#learnCounter"),
  learnDueStatus: document.querySelector("#learnDueStatus"),
  learnProgressBar: document.querySelector("#learnProgressBar"),
  learnQuestion: document.querySelector("#learnQuestion"),
  learnAttemptInput: document.querySelector("#learnAttemptInput"),
  revealLearnAnswerButton: document.querySelector("#revealLearnAnswerButton"),
  learnAnswerPanel: document.querySelector("#learnAnswerPanel"),
  learnAnswer: document.querySelector("#learnAnswer"),
  learnExplanation: document.querySelector("#learnExplanation"),
  learnExplanationSection: document.querySelector("#learnExplanationSection"),
  learnRatingButtons: document.querySelectorAll("[data-learn-rating]"),
  learnKnewCount: document.querySelector("#learnKnewCount"),
  learnAlmostCount: document.querySelector("#learnAlmostCount"),
  learnDidntCount: document.querySelector("#learnDidntCount"),
  flashcardUnitSelect: document.querySelector("#flashcardUnitSelect"),
  flashcard: document.querySelector("#flashcard"),
  flashcardFront: document.querySelector("#flashcardFront"),
  flashcardBack: document.querySelector("#flashcardBack"),
  flashcardCounter: document.querySelector("#flashcardCounter"),
  flashcardMastery: document.querySelector("#flashcardMastery"),
  flashcardProgressBar: document.querySelector("#flashcardProgressBar"),
  flashcardExplanation: document.querySelector("#flashcardExplanation"),
  flashcardMemoryTrick: document.querySelector("#flashcardMemoryTrick"),
  flashcardExamTrap: document.querySelector("#flashcardExamTrap"),
  flashcardExplanationSection: document.querySelector("#flashcardExplanationSection"),
  flashcardMemorySection: document.querySelector("#flashcardMemorySection"),
  flashcardTrapSection: document.querySelector("#flashcardTrapSection"),
  previousCardButton: document.querySelector("#previousCardButton"),
  nextCardButton: document.querySelector("#nextCardButton"),
  reviewCardButton: document.querySelector("#reviewCardButton"),
  masterCardButton: document.querySelector("#masterCardButton"),
  bookmarkCardButton: document.querySelector("#bookmarkCardButton"),
  shuffleCardsButton: document.querySelector("#shuffleCardsButton"),
  difficultCardButton: document.querySelector("#difficultCardButton"),
  confidenceButtons: document.querySelectorAll(".confidence-button"),
  answerModeButtons: document.querySelectorAll("[data-answer-mode]"),
  quizUnitSelect: document.querySelector("#quizUnitSelect"),
  quizSetupPanel: document.querySelector("#quizSetupPanel"),
  quizPanel: document.querySelector("#quizPanel"),
  quizResultPanel: document.querySelector("#quizResultPanel"),
  startQuizButton: document.querySelector("#startQuizButton"),
  retryQuizButton: document.querySelector("#retryQuizButton"),
  nextQuestionButton: document.querySelector("#nextQuestionButton"),
  quizCounter: document.querySelector("#quizCounter"),
  quizScore: document.querySelector("#quizScore"),
  quizProgressBar: document.querySelector("#quizProgressBar"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  quizResultTitle: document.querySelector("#quizResultTitle"),
  quizResultText: document.querySelector("#quizResultText"),
  quizUnitBadge: document.querySelector("#quizUnitBadge"),
  quizAvailabilityNote: document.querySelector("#quizAvailabilityNote"),
  quizUnitSelectLabel: document.querySelector("#quizUnitSelectLabel"),
  randomizeQuizToggle: document.querySelector("#randomizeQuizToggle"),
  questionCountButtons: document.querySelectorAll("[data-question-count]"),
  questionSourceButtons: document.querySelectorAll("[data-question-source]"),
  reviewQuizMistakesButton: document.querySelector("#reviewQuizMistakesButton"),
  mistakesList: document.querySelector("#mistakesList"),
  clearMistakesButton: document.querySelector("#clearMistakesButton"),
  practiceSetupPanel: document.querySelector("#practiceSetupPanel"),
  practiceTestPanel: document.querySelector("#practiceTestPanel"),
  practiceResultPanel: document.querySelector("#practiceResultPanel"),
  practiceReviewPanel: document.querySelector("#practiceReviewPanel"),
  practiceUnitSelect: document.querySelector("#practiceUnitSelect"),
  practiceUnitSelectLabel: document.querySelector("#practiceUnitSelectLabel"),
  practiceCountButtons: document.querySelectorAll("[data-practice-count]"),
  practiceSourceButtons: document.querySelectorAll("[data-practice-source]"),
  practiceTimerToggle: document.querySelector("#practiceTimerToggle"),
  practiceTimerMinutesRow: document.querySelector("#practiceTimerMinutesRow"),
  practiceTimerMinutes: document.querySelector("#practiceTimerMinutes"),
  practiceAvailabilityNote: document.querySelector("#practiceAvailabilityNote"),
  startPracticeButton: document.querySelector("#startPracticeButton"),
  practiceCounter: document.querySelector("#practiceCounter"),
  practiceTimerDisplay: document.querySelector("#practiceTimerDisplay"),
  practiceProgressBar: document.querySelector("#practiceProgressBar"),
  practiceUnitBadge: document.querySelector("#practiceUnitBadge"),
  practiceQuestion: document.querySelector("#practiceQuestion"),
  practiceOptions: document.querySelector("#practiceOptions"),
  previousPracticeQuestionButton: document.querySelector("#previousPracticeQuestionButton"),
  nextPracticeQuestionButton: document.querySelector("#nextPracticeQuestionButton"),
  practiceResultScore: document.querySelector("#practiceResultScore"),
  practiceResultSummary: document.querySelector("#practiceResultSummary"),
  reviewPracticeAnswersButton: document.querySelector("#reviewPracticeAnswersButton"),
  restartPracticeButton: document.querySelector("#restartPracticeButton"),
  backToPracticeResultsButton: document.querySelector("#backToPracticeResultsButton"),
  practiceReviewList: document.querySelector("#practiceReviewList"),
  masteredCount: document.querySelector("#masteredCount"),
  studyTimeStat: document.querySelector("#studyTimeStat"),
  masteryStat: document.querySelector("#masteryStat"),
  cardsLearnedStat: document.querySelector("#cardsLearnedStat"),
  questionsAnsweredStat: document.querySelector("#questionsAnsweredStat"),
  averageScoreStat: document.querySelector("#averageScoreStat"),
  bookmarksStat: document.querySelector("#bookmarksStat"),
  dailyStreakStat: document.querySelector("#dailyStreakStat"),
  overallStatisticsBars: document.querySelector("#overallStatisticsBars"),
  strongestTopicsList: document.querySelector("#strongestTopicsList"),
  weakestTopicsList: document.querySelector("#weakestTopicsList"),
  quizAverage: document.querySelector("#quizAverage"),
  completedQuizCount: document.querySelector("#completedQuizCount"),
  progressList: document.querySelector("#progressList"),
  resetProgressButton: document.querySelector("#resetProgressButton"),
  installButton: document.querySelector("#installButton"),
  offlineStatus: document.querySelector("#offlineStatus"),
  toast: document.querySelector("#toast"),
  globalSearchInput: document.querySelector("#globalSearchInput"),
  globalSearchResults: document.querySelector("#globalSearchResults"),
  sidebar: document.querySelector("#appSidebar"),
  sidebarToggleButton: document.querySelector("#sidebarToggleButton"),
  mobileMenuButton: document.querySelector("#mobileMenuButton"),
  sidebarOverlay: document.querySelector("#sidebarOverlay"),
  sidebarPreferenceToggle: document.querySelector("#sidebarPreferenceToggle"),
  themeChoiceButtons: document.querySelectorAll("[data-theme-choice]"),
  unitImportInput: document.querySelector("#unitImportInput"),
  importUnitButton: document.querySelector("#importUnitButton"),
  unitImportStatus: document.querySelector("#unitImportStatus"),
  progressImportInput: document.querySelector("#progressImportInput"),
  importProgressButton: document.querySelector("#importProgressButton"),
  progressImportStatus: document.querySelector("#progressImportStatus"),
  exportProgressButton: document.querySelector("#exportProgressButton"),
  settingsResetProgressButton: document.querySelector("#settingsResetProgressButton"),
  appVersionText: document.querySelector("#appVersionText"),
  unitsLibrary: document.querySelector("#unitsLibrary"),
  unitLibrarySearch: document.querySelector("#unitLibrarySearch"),
  rescanUnitsButton: document.querySelector("#rescanUnitsButton"),
  unitDiscoveryStatus: document.querySelector("#unitDiscoveryStatus"),
  bookmarkSearchInput: document.querySelector("#bookmarkSearchInput"),
  bookmarksList: document.querySelector("#bookmarksList"),
  unitLibraryPanel: document.querySelector("#unitLibraryPanel"),
  unitWorkspace: document.querySelector("#unitWorkspace"),
  unitWorkspaceNumber: document.querySelector("#unitWorkspaceNumber"),
  unitWorkspaceTitle: document.querySelector("#unitWorkspaceTitle"),
  unitWorkspaceContent: document.querySelector("#unitWorkspaceContent"),
  withinUnitSearch: document.querySelector("#withinUnitSearch"),
  backToUnitsButton: document.querySelector("#backToUnitsButton"),
  unitTabs: document.querySelectorAll(".unit-tab")
};

/* ------------------------------
   Progress persistence
   ------------------------------ */

/** Load and normalize all locally saved study progress. */
function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {
      units: {},
      mistakes: [],
      analytics: {
        studySeconds: 0,
        questionsAnswered: 0,
        studyDays: {},
        topicStats: {}
      }
    };
    if (!parsed.units) parsed.units = {};
    if (!Array.isArray(parsed.mistakes)) parsed.mistakes = [];
    if (!parsed.analytics) {
      parsed.analytics = {
        studySeconds: 0,
        questionsAnswered: 0,
        studyDays: {},
        topicStats: {}
      };
    }
    if (!parsed.analytics.studyDays) parsed.analytics.studyDays = {};
    if (!parsed.analytics.topicStats) parsed.analytics.topicStats = {};
    if (!Number.isFinite(parsed.analytics.studySeconds)) parsed.analytics.studySeconds = 0;
    if (!Number.isFinite(parsed.analytics.questionsAnswered)) parsed.analytics.questionsAnswered = 0;
    return parsed;
  } catch (error) {
    console.warn("Progress data could not be read. Starting fresh.", error);
    return {
      units: {},
      mistakes: [],
      analytics: {
        studySeconds: 0,
        questionsAnswered: 0,
        studyDays: {},
        topicStats: {}
      }
    };
  }
}

let progress = loadProgress();

/** Persist study progress and refresh progress-dependent views. */
function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  updateProgressUI();
}

function getUnitProgress(unitId) {
  if (!progress.units[unitId]) {
    progress.units[unitId] = {
      masteredCards: [],
      quizAttempts: [],
      flashcards: {}
    };
  }

  if (!progress.units[unitId].flashcards) {
    progress.units[unitId].flashcards = {};
  }

  return progress.units[unitId];
}

function getCardProgress(unitId, cardId) {
  const unitProgress = getUnitProgress(unitId);

  if (!unitProgress.flashcards[cardId]) {
    unitProgress.flashcards[cardId] = {
      bookmarked: false,
      difficult: false,
      confidence: null,
      reviewCount: 0,
      lastReviewed: null
    };
  }

  return unitProgress.flashcards[cardId];
}

/* ------------------------------
   Data loading
   ------------------------------ */

async function loadJSON(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load ${path}: ${response.status}`);
  }

  return response.json();
}

/** Discover unit JSON files from the manifest or an exposed directory listing. */
async function discoverJSONFiles() {
  const files = new Set();
  const warnings = [];
  let manifest = [];

  /*
   * 1. Read the optional manifest when present. It remains supported for
   *    hosts that disable directory listings.
   */
  try {
    manifest = await loadJSON("data/index.json");
    if (Array.isArray(manifest)) {
      manifest.forEach((entry) => {
        if (typeof entry.file === "string" && entry.file.endsWith(".json")) {
          files.add(entry.file);
        }
      });
    } else {
      manifest = [];
    }
  } catch (error) {
    warnings.push("data/index.json was not available.");
    manifest = [];
  }

  /*
   * 2. Attempt true folder discovery. Many local and static development
   *    servers expose /data/ as an HTML directory listing.
   */
  try {
    const response = await fetch("data/", { cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";

    if (response.ok && contentType.includes("text/html")) {
      const html = await response.text();
      const parser = new DOMParser();
      const directoryDocument = parser.parseFromString(html, "text/html");

      directoryDocument.querySelectorAll('a[href$=".json"]').forEach((link) => {
        const href = link.getAttribute("href") || "";
        const filename = decodeURIComponent(href.split("/").pop());

        if (filename && filename !== "index.json") {
          files.add(filename);
        }
      });
    } else {
      warnings.push("The host does not expose a /data/ directory listing.");
    }
  } catch (error) {
    warnings.push("Automatic directory listing discovery was unavailable.");
  }

  /*
   * Static browsers cannot enumerate a folder when directory listing is
   * disabled. The optional data/index.json manifest is therefore the reliable
   * fallback. Manual rescans may use a small bounded filename probe.
   */
  state.discoveredDataFiles = [...files];
  state.discoveryWarnings = warnings;

  return {
    manifest,
    files: [...files]
  };
}

/** Load, validate, normalize, and order all available study units. */
async function loadCatalog({ preserveSelection = false } = {}) {
  const previousSelection = preserveSelection ? state.selectedUnitId : null;
  const discovery = await discoverJSONFiles();

  state.catalog = discovery.manifest;

  const discoveredFiles = new Set([
    ...discovery.files,
    ...(preserveSelection ? state.discoveredDataFiles : [])
  ]);

  state.discoveredUnitFiles = [...discoveredFiles];

  const loadedUnits = new Map();

  const settled = await Promise.allSettled(
    state.discoveredUnitFiles.map((file) => loadJSON(`data/${file}`))
  );

  settled.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value?.id) {
      try {
        const unit = normalizeUnit(result.value, state.discoveredUnitFiles[index]);
        loadedUnits.set(unit.id, unit);
      } catch (error) {
        console.warn(`Skipped invalid unit file: ${state.discoveredUnitFiles[index]}`, error);
      }
    } else if (result.status === "rejected") {
      console.warn(`Skipped unreadable unit file: ${state.discoveredUnitFiles[index]}`, result.reason);
    }
  });

  loadImportedUnits().forEach((rawUnit) => {
    try {
      const unit = normalizeUnit(rawUnit, `local:${rawUnit.id}`);
      loadedUnits.set(unit.id, unit);
    } catch (error) {
      console.warn("Skipped invalid locally imported unit.", error);
    }
  });

  state.units = loadedUnits;

  const orderedUnits = [...state.units.values()].sort(
    (a, b) =>
      (a.unitNumber ?? 9999) - (b.unitNumber ?? 9999) ||
      a.title.localeCompare(b.title)
  );

  if (previousSelection && state.units.has(previousSelection)) {
    state.selectedUnitId = previousSelection;
  } else {
    state.selectedUnitId = orderedUnits[0]?.id ?? null;
  }

  return orderedUnits;
}

/** Convert supported unit JSON shapes into one internal application format. */
function normalizeUnit(rawUnit, filename) {
  const manifestRecord = state.catalog.find(
    (entry) => entry.file === filename || entry.id === rawUnit.id
  );

  const topics = Array.isArray(rawUnit.topics) ? rawUnit.topics : [];
  const lessons = Array.isArray(rawUnit.lessons)
    ? rawUnit.lessons
    : topics.map((topic, index) => ({
        id: `${rawUnit.id}-lesson-${index + 1}`,
        title: topic.title || `Lesson ${index + 1}`,
        topics: [topic]
      }));

  const flashcards = Array.isArray(rawUnit.flashcards)
    ? rawUnit.flashcards
    : Array.isArray(rawUnit.items)
      ? rawUnit.items
          .filter((item) => item.question && (item.flashcard_answer || item.exam_answer))
          .map((item) => ({
            id: item.id,
            front: item.question,
            back: item.flashcard_answer || item.exam_answer,
            examAnswer: item.exam_answer || "",
            explanation: item.explanation || "",
            memoryTrick: item.memory_trick || "",
            examTrap: item.exam_trap || "",
            difficulty: item.difficulty || null,
            tags: item.tags || []
          }))
      : [];

  const quiz = Array.isArray(rawUnit.quiz)
    ? rawUnit.quiz
    : Array.isArray(rawUnit.mcqs)
      ? rawUnit.mcqs
      : Array.isArray(rawUnit.questions)
        ? rawUnit.questions.filter((item) =>
            Array.isArray(item.options) && Number.isInteger(item.answerIndex)
          )
        : [];

  return {
    ...rawUnit,
    id: rawUnit.id,
    title: rawUnit.title || manifestRecord?.title || rawUnit.id,
    description: rawUnit.description || "",
    level: rawUnit.level || "Study unit",
    unitNumber: rawUnit.unitNumber ?? manifestRecord?.order ?? extractUnitNumber(rawUnit.title),
    topics,
    lessons,
    flashcards,
    quiz,
    sourceFile: filename
  };
}

function extractUnitNumber(value = "") {
  const match = String(value).match(/\bunit\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

/* ------------------------------
   View navigation
   ------------------------------ */

function showView(viewName) {
  const requestedView = document.querySelector(`#${viewName}View`);
  const safeViewName = requestedView ? viewName : "dashboard";

  dom.views.forEach((view) => {
    view.classList.toggle("active", view.id === `${safeViewName}View`);
  });

  dom.navButtons.forEach((button) => {
    const isActive = button.dataset.view === safeViewName;
    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  localStorage.setItem("biochem-master-last-view", safeViewName);

  if (safeViewName === "progress") {
    updateProgressUI();
  }

  if (safeViewName === "mistakes") {
    renderMistakes();
  }

  if (safeViewName === "practice") {
    if (!state.practiceQuestions.length || dom.practiceSetupPanel.classList.contains("hidden") === false) {
      updatePracticeAvailability();
    }
  }

  if (safeViewName === "settings") {
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
    if (dom.appVersionText) {
      dom.appVersionText.textContent = `Biochem Master ${APP_VERSION}`;
    }
  }

  if (safeViewName === "bookmarks") {
    renderBookmarks(dom.bookmarkSearchInput?.value || "");
  }

  if (safeViewName === "units") {
    if (!state.unitWorkspaceId) {
      dom.unitLibraryPanel?.classList.remove("hidden");
      dom.unitWorkspace?.classList.add("hidden");
      renderUnitsLibrary(dom.unitLibrarySearch?.value || "");
    }
  }

  closeMobileSidebar();
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  });

  window.requestAnimationFrame(() => {
    dom.main?.focus({ preventScroll: true });
  });
}

dom.navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

dom.unitLibrarySearch?.addEventListener("input", (event) => {
  renderUnitsLibrary(event.target.value);
});

dom.withinUnitSearch?.addEventListener("input", renderUnitWorkspaceContent);
dom.backToUnitsButton?.addEventListener("click", closeUnitWorkspace);

dom.unitTabs.forEach((button) => {
  button.addEventListener("click", () => setUnitWorkspaceTab(button.dataset.unitTab));
});

/* ------------------------------
   Unit registry and drop-in discovery
   ------------------------------ */

/**
 * Probe a bounded set of conventional unit filenames during a manual rescan.
 * This avoids thousands of startup requests while still supporting no-code
 * drop-ins on static hosts that do not expose directory listings.
 */
async function probeConventionalUnitFiles() {
  const known = new Set(state.discoveredDataFiles);
  const candidates = [];

  for (let number = 1; number <= 150; number += 1) {
    candidates.push(`unit-${number}.json`);
    candidates.push(`unit-${String(number).padStart(3, "0")}.json`);
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const results = await Promise.allSettled(
      candidates.map(async (filename) => {
        if (known.has(filename)) return null;

        const response = await fetch(`data/${filename}`, {
          method: "HEAD",
          cache: "no-store",
          signal: controller.signal
        });

        return response.ok ? filename : null;
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        known.add(result.value);
      }
    });
  } catch (error) {
    console.info("Conventional filename probing was unavailable.", error);
  } finally {
    clearTimeout(timeout);
  }

  state.discoveredDataFiles = [...known];
}

function refreshAllUnitFeatures() {
  populateUnitSelects();
  buildSearchIndex();
  renderDashboard(dom.unitSearch?.value || "");
  renderUnitsLibrary(dom.unitLibrarySearch?.value || "");
  renderFlashcard();
  resetLearnSession();
  resetQuizPanels();
  resetPracticePanels();
  updateProgressUI();
  renderBookmarks(dom.bookmarkSearchInput?.value || "");
}

async function rescanDataFolder() {
  await probeConventionalUnitFiles();

  if (dom.rescanUnitsButton) {
    dom.rescanUnitsButton.disabled = true;
    dom.rescanUnitsButton.textContent = "Scanning…";
  }

  if (dom.unitDiscoveryStatus) {
    dom.unitDiscoveryStatus.textContent = "Scanning /data/ for JSON units…";
  }

  try {
    const before = state.units.size;
    await loadCatalog({ preserveSelection: true });
    refreshAllUnitFeatures();

    const added = Math.max(0, state.units.size - before);
    const warnings = state.discoveryWarnings.length
      ? ` ${state.discoveryWarnings.join(" ")}`
      : "";

    dom.unitDiscoveryStatus.textContent =
      `${state.units.size} unit${state.units.size === 1 ? "" : "s"} loaded.` +
      `${added ? ` ${added} new unit${added === 1 ? "" : "s"} found.` : ""}` +
      warnings;

    showToast(
      added
        ? `${added} new unit${added === 1 ? "" : "s"} loaded.`
        : "Unit library is up to date."
    );
  } catch (error) {
    console.error(error);
    dom.unitDiscoveryStatus.textContent =
      "The /data/ folder could not be rescanned.";
    showToast("Unit scan failed.");
  } finally {
    if (dom.rescanUnitsButton) {
      dom.rescanUnitsButton.disabled = false;
      dom.rescanUnitsButton.textContent = "Rescan /data/";
    }
  }
}

function getBookmarkedCards() {
  const records = [];

  state.units.forEach((unit) => {
    const unitProgress = getUnitProgress(unit.id);

    unit.flashcards.forEach((card, cardIndex) => {
      const cardProgress = unitProgress.flashcards?.[card.id];

      if (cardProgress?.bookmarked) {
        records.push({
          unit,
          card,
          cardIndex,
          bookmarkedAt:
            cardProgress.lastReviewed ||
            cardProgress.bookmarkedAt ||
            ""
        });
      }
    });
  });

  return records.sort((a, b) =>
    a.unit.title.localeCompare(b.unit.title) ||
    a.cardIndex - b.cardIndex
  );
}

function renderBookmarks(filterText = "") {
  if (!dom.bookmarksList) return;

  const query = filterText.trim().toLowerCase();

  const bookmarks = getBookmarkedCards().filter(({ unit, card }) =>
    [
      unit.title,
      card.front,
      card.back,
      card.explanation,
      card.memoryTrick,
      card.examTrap,
      ...(card.tags || [])
    ].filter(Boolean).join(" ").toLowerCase().includes(query)
  );

  if (!bookmarks.length) {
    dom.bookmarksList.innerHTML = `
      <div class="study-panel compact">
        <h3>${query ? "No matching bookmarks" : "No bookmarks yet"}</h3>
        <p>
          ${query
            ? "Try a different search term."
            : "Bookmark a flashcard and it will appear here automatically."}
        </p>
      </div>
    `;
    return;
  }

  dom.bookmarksList.innerHTML = bookmarks.map(({ unit, card, cardIndex }) => `
    <article class="study-item">
      <span class="unit-meta">${escapeHTML(unit.title)}</span>
      <h3>${escapeHTML(card.front || card.question || "")}</h3>
      <p>${escapeHTML(card.back || card.answer || "")}</p>
      <div class="bookmark-card-actions">
        <button
          class="button button-secondary open-bookmark-card"
          data-unit-id="${unit.id}"
          data-card-index="${cardIndex}"
          type="button"
        >
          Open card
        </button>
        <button
          class="button button-danger remove-bookmark-card"
          data-unit-id="${unit.id}"
          data-card-id="${card.id}"
          type="button"
        >
          Remove
        </button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".open-bookmark-card").forEach((button) => {
    button.addEventListener("click", () => {
      const unitId = button.dataset.unitId;
      const cardIndex = Number(button.dataset.cardIndex);

      setSelectedUnit(unitId);
      resetFlashcardDeck();

      const orderPosition = state.flashcardOrder.indexOf(cardIndex);
      state.flashcardIndex = orderPosition >= 0 ? orderPosition : cardIndex;

      showView("flashcards");
      renderFlashcard();
    });
  });

  document.querySelectorAll(".remove-bookmark-card").forEach((button) => {
    button.addEventListener("click", () => {
      const cardProgress = getCardProgress(
        button.dataset.unitId,
        button.dataset.cardId
      );

      cardProgress.bookmarked = false;
      saveProgress();
      renderBookmarks(dom.bookmarkSearchInput.value);
      renderFlashcard();
      showToast("Bookmark removed.");
    });
  });
}

dom.rescanUnitsButton?.addEventListener("click", rescanDataFolder);

dom.bookmarkSearchInput?.addEventListener("input", (event) => {
  renderBookmarks(event.target.value);
});

/* ------------------------------
   Global instant search
   ------------------------------ */

/** Build the in-memory search index used by instant search. */
function buildSearchIndex() {
  const records = [];

  [...state.units.values()].forEach((unit) => {
    records.push({
      id: `unit:${unit.id}`,
      type: "Unit",
      title: unit.title,
      context: unit.description || "",
      unitId: unit.id,
      target: "unit"
    });

    (unit.lessons || []).forEach((lesson, lessonIndex) => {
      records.push({
        id: `lesson:${unit.id}:${lesson.id || lessonIndex}`,
        type: "Lesson",
        title: lesson.title || `Lesson ${lessonIndex + 1}`,
        context: unit.title,
        unitId: unit.id,
        lessonIndex,
        target: "lesson"
      });
    });

    collectTopics(unit).forEach((topic, topicIndex) => {
      records.push({
        id: `topic:${unit.id}:${topicIndex}`,
        type: "Topic",
        title: topic.title || `Topic ${topicIndex + 1}`,
        context: `${unit.title} ${summarizeTopic(topic)}`,
        unitId: unit.id,
        topicIndex,
        target: "topic"
      });
    });

    (unit.flashcards || []).forEach((card, cardIndex) => {
      const tags = Array.isArray(card.tags) ? card.tags.join(" ") : "";

      records.push({
        id: `question:${unit.id}:${card.id || cardIndex}`,
        type: "Question",
        title: card.front || card.question || "",
        context: [
          unit.title,
          card.back || card.answer || "",
          card.explanation || "",
          card.memoryTrick || card.memory_trick || "",
          card.examTrap || card.exam_trap || "",
          tags
        ].join(" "),
        unitId: unit.id,
        cardId: card.id,
        cardIndex,
        target: "flashcard"
      });
    });

    (unit.quiz || []).forEach((question, questionIndex) => {
      records.push({
        id: `mcq:${unit.id}:${question.id || questionIndex}`,
        type: "Question",
        title: question.question || "",
        context: [
          unit.title,
          ...(question.options || []),
          question.explanation || ""
        ].join(" "),
        unitId: unit.id,
        questionIndex,
        target: "mcq"
      });
    });

    if (Array.isArray(unit.items)) {
      unit.items.forEach((item, itemIndex) => {
        const itemType = String(item.item_type || "").toLowerCase();

        if (itemType === "glossary" || itemType === "glossary_definition") {
          records.push({
            id: `glossary:${unit.id}:${item.id || itemIndex}`,
            type: "Glossary",
            title: item.question || item.topic || item.term || "",
            context: [
              item.flashcard_answer,
              item.exam_answer,
              item.explanation,
              ...(item.tags || [])
            ].filter(Boolean).join(" "),
            unitId: unit.id,
            itemId: item.id,
            cardId: item.id,
            target: "flashcard"
          });
        }

        if (item.question) {
          records.push({
            id: `item-question:${unit.id}:${item.id || itemIndex}`,
            type: "Question",
            title: item.question,
            context: [
              unit.title,
              item.lesson,
              item.topic,
              item.flashcard_answer,
              item.exam_answer,
              item.explanation,
              ...(item.tags || [])
            ].filter(Boolean).join(" "),
            unitId: unit.id,
            itemId: item.id,
            cardId: item.id,
            target: "flashcard"
          });
        }

        if (item.topic) {
          records.push({
            id: `item-topic:${unit.id}:${item.id || itemIndex}`,
            type: "Topic",
            title: item.topic,
            context: [unit.title, item.lesson, item.source_text].filter(Boolean).join(" "),
            unitId: unit.id,
            itemId: item.id,
            target: "unit-search"
          });
        }

        if (item.lesson) {
          records.push({
            id: `item-lesson:${unit.id}:${item.id || itemIndex}`,
            type: "Lesson",
            title: item.lesson,
            context: [unit.title, item.topic, item.source_text].filter(Boolean).join(" "),
            unitId: unit.id,
            itemId: item.id,
            target: "unit-search"
          });
        }

        if (Array.isArray(item.tags)) {
          item.tags.forEach((tag, tagIndex) => {
            records.push({
              id: `keyword:${unit.id}:${item.id || itemIndex}:${tagIndex}`,
              type: "Keyword",
              title: tag,
              context: [
                unit.title,
                item.lesson,
                item.topic,
                item.question,
                item.flashcard_answer
              ].filter(Boolean).join(" "),
              unitId: unit.id,
              itemId: item.id,
              cardId: item.id,
              target: item.question ? "flashcard" : "unit-search"
            });
          });
        }
      });
    }

    (unit.tags || []).forEach((tag, tagIndex) => {
      records.push({
        id: `unit-keyword:${unit.id}:${tagIndex}`,
        type: "Keyword",
        title: tag,
        context: `${unit.title} ${unit.description || ""}`,
        unitId: unit.id,
        target: "unit"
      });
    });
  });

  const unique = new Map();
  records.forEach((record) => {
    const key = `${record.type}|${record.title}|${record.unitId}`;
    if (record.title && !unique.has(key)) unique.set(key, record);
  });

  state.searchIndex = [...unique.values()];
}

function scoreSearchRecord(record, query) {
  const title = record.title.toLowerCase();
  const context = record.context.toLowerCase();
  let score = 0;

  if (title === query) score += 100;
  if (title.startsWith(query)) score += 60;
  if (title.includes(query)) score += 35;
  if (context.includes(query)) score += 12;

  query.split(/\s+/).filter(Boolean).forEach((term) => {
    if (title.includes(term)) score += 8;
    if (context.includes(term)) score += 3;
  });

  const typePriority = {
    Question: 6,
    Glossary: 5,
    Topic: 4,
    Lesson: 3,
    Unit: 2,
    Keyword: 1
  };

  score += typePriority[record.type] || 0;
  return score;
}

function runInstantSearch(value) {
  const query = value.trim().toLowerCase();

  if (!query) {
    closeGlobalSearch();
    return;
  }

  state.searchResults = state.searchIndex
    .map((record) => ({
      ...record,
      score: scoreSearchRecord(record, query)
    }))
    .filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 30);

  state.activeSearchResultIndex = -1;
  renderGlobalSearchResults(query);
}

function renderGlobalSearchResults(query) {
  dom.globalSearchResults.classList.remove("hidden");
  dom.globalSearchInput.setAttribute("aria-expanded", "true");

  if (!state.searchResults.length) {
    dom.globalSearchResults.innerHTML =
      '<div class="global-search-empty">No matching study material.</div>';
    return;
  }

  dom.globalSearchResults.innerHTML = state.searchResults.map((record, index) => `
    <button
      class="search-result"
      data-search-index="${index}"
      role="option"
      type="button"
    >
      <span class="search-result-type">${escapeHTML(record.type)}</span>
      <span class="search-result-title">${highlightSearchText(record.title, query)}</span>
      <span class="search-result-context">${escapeHTML(searchResultContext(record))}</span>
    </button>
  `).join("");

  document.querySelectorAll(".search-result").forEach((button) => {
    button.addEventListener("click", () => {
      openSearchResult(state.searchResults[Number(button.dataset.searchIndex)]);
    });
  });
}

function searchResultContext(record) {
  const unit = state.units.get(record.unitId);
  return unit ? unit.title : record.context.slice(0, 90);
}

function highlightSearchText(text, query) {
  const safeText = escapeHTML(text);
  const terms = query.split(/\s+/).filter(Boolean);

  return terms.reduce((result, term) => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return result.replace(
      new RegExp(`(${escapedTerm})`, "ig"),
      '<mark class="search-highlight">$1</mark>'
    );
  }, safeText);
}

function closeGlobalSearch() {
  dom.globalSearchResults.classList.add("hidden");
  dom.globalSearchInput.setAttribute("aria-expanded", "false");
  state.searchResults = [];
  state.activeSearchResultIndex = -1;
}

function openSearchResult(record) {
  if (!record) return;

  const unit = state.units.get(record.unitId);
  if (!unit) return;

  setSelectedUnit(unit.id);

  if (record.target === "flashcard") {
    resetFlashcardDeck();

    const targetIndex = unit.flashcards.findIndex(
      (card) =>
        (record.cardId && card.id === record.cardId) ||
        card.front === record.title ||
        card.question === record.title
    );

    if (targetIndex >= 0) {
      const orderPosition = state.flashcardOrder.indexOf(targetIndex);
      state.flashcardIndex = orderPosition >= 0 ? orderPosition : targetIndex;
    }

    showView("flashcards");
    renderFlashcard();
  } else if (record.target === "mcq") {
    state.quizSource = "unit";
    state.quizQuestionCount = "all";
    showView("quiz");
    resetQuizPanels();
    dom.quizUnitSelect.value = unit.id;
    dom.quizAvailabilityNote.textContent =
      `Selected question: ${record.title}`;
  } else if (record.target === "topic") {
    state.activeTopicIndex = record.topicIndex || 0;
    openUnitWorkspace(unit.id);
    setUnitWorkspaceTab("topics");
  } else if (record.target === "lesson") {
    openUnitWorkspace(unit.id);
    setUnitWorkspaceTab("lessons");
  } else if (record.target === "unit-search") {
    openUnitWorkspace(unit.id);
    dom.withinUnitSearch.value = record.title;
    setUnitWorkspaceTab("topics");
  } else {
    openUnitWorkspace(unit.id);
  }

  dom.globalSearchInput.value = "";
  closeGlobalSearch();
}

dom.globalSearchInput?.addEventListener("input", (event) => {
  runInstantSearch(event.target.value);
});

dom.globalSearchInput?.addEventListener("keydown", (event) => {
  if (!state.searchResults.length) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    state.activeSearchResultIndex =
      (state.activeSearchResultIndex + 1) % state.searchResults.length;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    state.activeSearchResultIndex =
      (state.activeSearchResultIndex - 1 + state.searchResults.length) %
      state.searchResults.length;
  } else if (event.key === "Enter") {
    event.preventDefault();
    const index =
      state.activeSearchResultIndex >= 0
        ? state.activeSearchResultIndex
        : 0;
    openSearchResult(state.searchResults[index]);
    return;
  } else if (event.key === "Escape") {
    closeGlobalSearch();
    return;
  } else {
    return;
  }

  document.querySelectorAll(".search-result").forEach((item, index) => {
    item.classList.toggle("active", index === state.activeSearchResultIndex);
    if (index === state.activeSearchResultIndex) {
      item.scrollIntoView({ block: "nearest" });
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".global-search")) {
    closeGlobalSearch();
  }
});

/* ------------------------------
   Settings
   ------------------------------ */

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;
  localStorage.setItem(THEME_KEY, safeTheme);

  dom.themeChoiceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === safeTheme);
  });
}

function loadImportedUnits() {
  try {
    const stored = JSON.parse(localStorage.getItem(IMPORTED_UNITS_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.warn("Imported units could not be read.", error);
    return [];
  }
}

function saveImportedUnit(rawUnit) {
  const units = loadImportedUnits();
  const existingIndex = units.findIndex((unit) => unit.id === rawUnit.id);

  if (existingIndex >= 0) {
    units[existingIndex] = rawUnit;
  } else {
    units.push(rawUnit);
  }

  localStorage.setItem(IMPORTED_UNITS_KEY, JSON.stringify(units));
}

function validateImportedUnit(unit) {
  if (!unit || typeof unit !== "object") {
    throw new Error("The selected file does not contain a JSON object.");
  }

  if (!unit.id || typeof unit.id !== "string") {
    throw new Error("The unit requires a unique string ID.");
  }

  if (!unit.title || typeof unit.title !== "string") {
    throw new Error("The unit requires a title.");
  }

  const hasStudyContent =
    Array.isArray(unit.flashcards) ||
    Array.isArray(unit.quiz) ||
    Array.isArray(unit.topics) ||
    Array.isArray(unit.lessons) ||
    Array.isArray(unit.items);

  if (!hasStudyContent) {
    throw new Error("The unit does not contain recognizable study content.");
  }
}

async function importUnitFile(file) {
  const text = await file.text();
  const rawUnit = JSON.parse(text);

  validateImportedUnit(rawUnit);
  saveImportedUnit(rawUnit);

  const normalized = normalizeUnit(rawUnit, `local:${rawUnit.id}`);
  state.units.set(normalized.id, normalized);

  state.catalog = state.catalog.filter((entry) => entry.id !== normalized.id);
  state.catalog.push({
    id: normalized.id,
    title: normalized.title,
    file: `local:${normalized.id}`,
    order: normalized.unitNumber ?? state.catalog.length + 1
  });

  populateUnitSelects();
  buildSearchIndex();
  renderDashboard();
  renderUnitsLibrary();

  dom.unitImportStatus.textContent =
    `${normalized.title} was imported successfully.`;
  showToast("New study unit imported.");
}

function downloadJSON(data, filename) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportProgress() {
  const backup = {
    format: "biochem-master-progress",
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    preferences: {
      theme: localStorage.getItem(THEME_KEY) || "light",
      sidebarCollapsed:
        localStorage.getItem(SIDEBAR_STATE_KEY) === "true",
      answerMode:
        localStorage.getItem("biochem-master-answer-mode") || "flashcard",
      lastView:
        localStorage.getItem("biochem-master-last-view") || "dashboard"
    }
  };

  const date = localDateKey();
  downloadJSON(backup, `biochem-master-progress-${date}.json`);
  showToast("Progress backup exported.");
}

function validateProgressBackup(backup) {
  if (!backup || typeof backup !== "object") {
    throw new Error("The selected file is not a valid backup.");
  }

  if (backup.format !== "biochem-master-progress") {
    throw new Error("This file is not a Biochem Master progress export.");
  }

  if (!backup.progress || typeof backup.progress !== "object") {
    throw new Error("The backup does not contain progress data.");
  }
}

async function importProgressFile(file) {
  const text = await file.text();
  const backup = JSON.parse(text);

  validateProgressBackup(backup);

  progress = backup.progress;
  ensureAnalytics();

  if (!progress.units) progress.units = {};
  if (!Array.isArray(progress.mistakes)) progress.mistakes = [];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  if (backup.preferences) {
    if (backup.preferences.theme) {
      applyTheme(backup.preferences.theme);
    }

    if (typeof backup.preferences.sidebarCollapsed === "boolean") {
      applySidebarPreference(backup.preferences.sidebarCollapsed);
    }

    if (backup.preferences.answerMode) {
      state.answerMode = backup.preferences.answerMode;
      localStorage.setItem(
        "biochem-master-answer-mode",
        backup.preferences.answerMode
      );
    }
  }

  updateProgressUI();
  renderFlashcard();
  renderMistakes();
  resetLearnSession();

  dom.progressImportStatus.textContent =
    `Progress restored from ${new Date(backup.exportedAt || Date.now()).toLocaleDateString()}.`;
  showToast("Progress imported successfully.");
}

function resetAllProgress() {
  const confirmed = window.confirm(
    "Erase all learning history, scores, bookmarks, mistakes, and statistics?"
  );

  if (!confirmed) return;

  progress = {
    units: {},
    mistakes: [],
    analytics: {
      studySeconds: 0,
      questionsAnswered: 0,
      studyDays: {},
      topicStats: {}
    }
  };

  localStorage.removeItem(STORAGE_KEY);
  saveProgress();
  resetFlashcardDeck();
  resetLearnSession();
  renderMistakes();
  showToast("All progress has been reset.");
}

dom.themeChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.themeChoice);
  });
});

dom.importUnitButton?.addEventListener("click", () => {
  dom.unitImportInput.click();
});

dom.unitImportInput?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    await importUnitFile(file);
  } catch (error) {
    dom.unitImportStatus.textContent = error.message;
    showToast("The unit could not be imported.");
  } finally {
    event.target.value = "";
  }
});

dom.exportProgressButton?.addEventListener("click", exportProgress);

dom.importProgressButton?.addEventListener("click", () => {
  dom.progressImportInput.click();
});

dom.progressImportInput?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    await importProgressFile(file);
  } catch (error) {
    dom.progressImportStatus.textContent = error.message;
    showToast("The progress file could not be imported.");
  } finally {
    event.target.value = "";
  }
});

dom.settingsResetProgressButton?.addEventListener(
  "click",
  resetAllProgress
);

/* ------------------------------
   Sidebar
   ------------------------------ */

const SIDEBAR_STATE_KEY = "biochem-master-sidebar-collapsed";

function applySidebarPreference(collapsed) {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  dom.sidebarToggleButton?.setAttribute("aria-expanded", String(!collapsed));
  dom.sidebarToggleButton?.setAttribute(
    "aria-label",
    collapsed ? "Expand sidebar" : "Collapse sidebar"
  );

  if (dom.sidebarPreferenceToggle) {
    dom.sidebarPreferenceToggle.checked = collapsed;
  }

  localStorage.setItem(SIDEBAR_STATE_KEY, String(collapsed));
}

function toggleSidebar() {
  applySidebarPreference(!document.body.classList.contains("sidebar-collapsed"));
}

function openMobileSidebar() {
  document.body.classList.add("sidebar-open");
  dom.sidebarOverlay.hidden = false;
  dom.mobileMenuButton.setAttribute("aria-expanded", "true");
}

function closeMobileSidebar() {
  document.body.classList.remove("sidebar-open");
  dom.sidebarOverlay.hidden = true;
  dom.mobileMenuButton.setAttribute("aria-expanded", "false");
}

dom.sidebarToggleButton?.addEventListener("click", toggleSidebar);
dom.mobileMenuButton?.addEventListener("click", openMobileSidebar);
dom.sidebarOverlay?.addEventListener("click", closeMobileSidebar);
dom.sidebarPreferenceToggle?.addEventListener("change", (event) => {
  applySidebarPreference(event.target.checked);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileSidebar();
});

/** Render the responsive Study by Unit table. */
function renderUnitsLibrary(filterText = "") {
  if (!dom.unitsLibrary) return;

  const query = filterText.trim().toLowerCase();
  const units = [...state.units.values()]
    .sort((a, b) => (a.unitNumber ?? 9999) - (b.unitNumber ?? 9999) || a.title.localeCompare(b.title))
    .filter((unit) => getUnitSearchText(unit).includes(query));

  if (!units.length) {
    dom.unitsLibrary.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">No study units match “${escapeHTML(filterText)}”.</div>
        </td>
      </tr>
    `;
    return;
  }

  dom.unitsLibrary.innerHTML = units.map((unit, index) => {
    const unitProgress = getUnitProgress(unit.id);
    const cardTotal = unit.flashcards.length;
    const mastered = unitProgress.masteredCards.length;
    const questionTotal = unit.quiz.length || countQuestionItems(unit);
    const progressPercent = calculateUnitProgress(unit);
    const displayNumber = unit.unitNumber ?? index + 1;

    return `
      <tr>
        <td><span class="unit-number-badge">${escapeHTML(displayNumber)}</span></td>
        <td>
          <strong>${escapeHTML(unit.title)}</strong>
          ${unit.description ? `<div class="unit-meta">${escapeHTML(unit.description)}</div>` : ""}
        </td>
        <td class="unit-progress-cell">
          <div class="unit-progress-label">
            <span>${mastered}/${cardTotal} cards</span>
            <strong>${progressPercent}%</strong>
          </div>
          <div class="progress-track" aria-label="${progressPercent}% complete">
            <div class="progress-fill" style="width:${progressPercent}%"></div>
          </div>
        </td>
        <td>${cardTotal}</td>
        <td>${questionTotal}</td>
        <td>${unit.lessons.length}</td>
        <td>
          <button class="button button-primary open-unit-workspace" data-unit-id="${unit.id}" type="button">
            Open
          </button>
        </td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".open-unit-workspace").forEach((button) => {
    button.addEventListener("click", () => openUnitWorkspace(button.dataset.unitId));
  });
}

function getUnitSearchText(unit) {
  return [
    unit.title,
    unit.description,
    ...(unit.tags || []),
    ...unit.lessons.flatMap((lesson) => [
      lesson.title,
      ...(lesson.topics || []).map((topic) => topic.title)
    ]),
    ...unit.topics.map((topic) => topic.title),
    ...unit.flashcards.flatMap((card) => [card.front, card.back]),
    ...unit.quiz.flatMap((question) => [question.question, ...(question.options || [])])
  ].join(" ").toLowerCase();
}

function countQuestionItems(unit) {
  if (!Array.isArray(unit.items)) return 0;
  return unit.items.filter((item) => item.question).length;
}

function calculateUnitProgress(unit) {
  const unitProgress = getUnitProgress(unit.id);
  const cardWeight = unit.flashcards.length;
  const quizWeight = unit.quiz.length ? 1 : 0;
  const completedCards = Math.min(unitProgress.masteredCards.length, cardWeight);
  const completedQuiz = unitProgress.quizAttempts.length ? 1 : 0;
  const totalWeight = cardWeight + quizWeight;

  return totalWeight
    ? Math.round(((completedCards + completedQuiz) / totalWeight) * 100)
    : 0;
}

function openUnitWorkspace(unitId) {
  const unit = state.units.get(unitId);
  if (!unit) return;

  state.unitWorkspaceId = unitId;
  state.unitWorkspaceTab = "lessons";
  dom.unitLibraryPanel.classList.add("hidden");
  dom.unitWorkspace.classList.remove("hidden");
  dom.unitWorkspaceNumber.textContent = `Unit ${unit.unitNumber ?? ""}`.trim();
  dom.unitWorkspaceTitle.textContent = unit.title;
  dom.withinUnitSearch.value = "";
  setUnitWorkspaceTab("lessons");
}

function closeUnitWorkspace() {
  state.unitWorkspaceId = null;
  dom.unitWorkspace.classList.add("hidden");
  dom.unitLibraryPanel.classList.remove("hidden");
  renderUnitsLibrary(dom.unitLibrarySearch.value);
}

function setUnitWorkspaceTab(tabName) {
  state.unitWorkspaceTab = tabName;
  dom.unitTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.unitTab === tabName);
  });
  renderUnitWorkspaceContent();
}

function renderUnitWorkspaceContent() {
  const unit = state.units.get(state.unitWorkspaceId);
  if (!unit) return;

  const query = dom.withinUnitSearch.value.trim().toLowerCase();
  const tab = state.unitWorkspaceTab;

  if (tab === "lessons") {
    const lessons = unit.lessons.filter((lesson) =>
      [lesson.title, ...(lesson.topics || []).map((topic) => topic.title)]
        .join(" ").toLowerCase().includes(query)
    );

    dom.unitWorkspaceContent.innerHTML = renderStudyItems(
      lessons.map((lesson, index) => ({
        title: lesson.title || `Lesson ${index + 1}`,
        meta: `${(lesson.topics || []).length} topic${(lesson.topics || []).length === 1 ? "" : "s"}`,
        body: (lesson.topics || []).map((topic) => topic.title).join(" · ")
      })),
      "No lessons match this search."
    );
    return;
  }

  if (tab === "topics") {
    const topics = collectTopics(unit).filter((topic) =>
      JSON.stringify(topic).toLowerCase().includes(query)
    );

    dom.unitWorkspaceContent.innerHTML = renderStudyItems(
      topics.map((topic) => ({
        title: topic.title,
        meta: "Topic",
        body: summarizeTopic(topic)
      })),
      "No topics match this search."
    );
    return;
  }

  if (tab === "flashcards") {
    const cards = unit.flashcards.filter((card) =>
      `${card.front} ${card.back}`.toLowerCase().includes(query)
    );

    dom.unitWorkspaceContent.innerHTML = cards.length
      ? `<div class="unit-flashcard-grid">${cards.map((card) => `
          <article class="mini-flashcard">
            <small>Question</small>
            <strong>${escapeHTML(card.front)}</strong>
            <p>${escapeHTML(card.back)}</p>
          </article>
        `).join("")}</div>`
      : `<div class="empty-state">No flashcards match this search.</div>`;
    return;
  }

  if (tab === "mcqs") {
    const questions = unit.quiz.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query)
    );

    dom.unitWorkspaceContent.innerHTML = renderStudyItems(
      questions.map((item, index) => ({
        title: `${index + 1}. ${item.question}`,
        meta: `${(item.options || []).length} choices`,
        body: [
          ...(item.options || []).map((option, optionIndex) =>
            `${String.fromCharCode(65 + optionIndex)}. ${option}`
          ),
          item.explanation ? `Explanation: ${item.explanation}` : ""
        ].filter(Boolean).join("\n")
      })),
      "No multiple-choice questions match this search."
    );
    return;
  }

  if (tab === "practice") {
    const questionCount = unit.quiz.length || countQuestionItems(unit);
    dom.unitWorkspaceContent.innerHTML = `
      <div class="practice-summary">
        <article class="stat-card"><span>${questionCount}</span><p>questions available</p></article>
        <article class="stat-card"><span>${unit.flashcards.length}</span><p>flashcards available</p></article>
        <article class="stat-card"><span>${unit.lessons.length}</span><p>lessons covered</p></article>
      </div>
      <div class="study-panel compact">
        <h3>Practice Test: ${escapeHTML(unit.title)}</h3>
        <p>Questions are shuffled and scored using the selected unit only.</p>
        <button id="launchUnitPracticeButton" class="button button-primary" type="button">
          Start practice test
        </button>
      </div>
    `;

    document.querySelector("#launchUnitPracticeButton")?.addEventListener("click", () => {
      setSelectedUnit(unit.id);
      state.practiceSource = "unit";
      dom.practiceSourceButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.practiceSource === "unit");
      });
      dom.practiceUnitSelectLabel.classList.remove("hidden");
      showView("practice");
      resetPracticePanels();
    });
  }
}

function collectTopics(unit) {
  if (unit.topics.length) return unit.topics;
  return unit.lessons.flatMap((lesson) => lesson.topics || []);
}

function summarizeTopic(topic) {
  if (Array.isArray(topic.sections)) {
    return topic.sections.map((section) =>
      [section.heading, section.text, ...(section.items || []), section.keyPoint]
        .filter(Boolean).join(" — ")
    ).join("\n");
  }

  return topic.description || topic.text || "";
}

function renderStudyItems(items, emptyMessage) {
  if (!items.length) return `<div class="empty-state">${escapeHTML(emptyMessage)}</div>`;

  return `<div class="study-item-list">${items.map((item) => `
    <article class="study-item">
      <span class="unit-meta">${escapeHTML(item.meta || "")}</span>
      <h3>${escapeHTML(item.title || "")}</h3>
      ${String(item.body || "").split("\n").filter(Boolean).map((line) =>
        `<p>${escapeHTML(line)}</p>`
      ).join("")}
    </article>
  `).join("")}</div>`;
}

/* ------------------------------
   Dashboard
   ------------------------------ */

function renderDashboard(filterText = "") {
  const query = filterText.trim().toLowerCase();

  const units = [...state.units.values()].filter((unit) => {
    const searchableText = [
      unit.title,
      unit.description,
      ...(unit.tags || []),
      ...unit.topics.map((topic) => topic.title)
    ].join(" ").toLowerCase();

    return searchableText.includes(query);
  });

  if (!units.length) {
    dom.unitGrid.innerHTML = `
      <div class="empty-state">
        No units match “${escapeHTML(filterText)}”.
      </div>
    `;
    return;
  }

  dom.unitGrid.innerHTML = units.map((unit) => {
    const unitProgress = getUnitProgress(unit.id);
    const mastered = unitProgress.masteredCards.length;
    const total = unit.flashcards.length;
    const percent = total ? Math.round((mastered / total) * 100) : 0;

    return `
      <article class="unit-card">
        <p class="eyebrow">${escapeHTML(unit.level)}</p>
        <h3>${escapeHTML(unit.title)}</h3>
        <p>${escapeHTML(unit.description)}</p>
        <div class="unit-card-footer">
          <span class="unit-meta">${unit.topics.length} topics · ${percent}% mastered</span>
          <button class="button button-primary open-unit-button" data-unit-id="${unit.id}" type="button">
            Study
          </button>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".open-unit-button").forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedUnit(button.dataset.unitId);
      showView("learn");
    });
  });
}

dom.unitSearch.addEventListener("input", (event) => {
  renderDashboard(event.target.value);
});

/* ------------------------------
   Unit selection
   ------------------------------ */

function populateUnitSelects() {
  const options = [...state.units.values()]
    .map((unit) => `<option value="${unit.id}">${escapeHTML(unit.title)}</option>`)
    .join("");

  [dom.learnUnitSelect, dom.flashcardUnitSelect, dom.quizUnitSelect, dom.practiceUnitSelect].forEach((select) => {
    select.innerHTML = options;
    select.value = state.selectedUnitId;
  });
}

function setSelectedUnit(unitId) {
  if (!state.units.has(unitId)) {
    return;
  }

  state.selectedUnitId = unitId;
  state.activeTopicIndex = 0;
  state.flashcardIndex = 0;
  resetFlashcardDeck();
  state.learnQueue = [];
  state.learnIndex = 0;
  state.learnAnswerRevealed = false;
  state.learnSessionStats = { knew: 0, almost: 0, didnt: 0 };

  [dom.learnUnitSelect, dom.flashcardUnitSelect, dom.quizUnitSelect, dom.practiceUnitSelect].forEach((select) => {
    select.value = unitId;
  });

  renderLearnView();
  renderFlashcard();
  resetQuizPanels();
}

dom.learnUnitSelect.addEventListener("change", (event) => {
  setSelectedUnit(event.target.value);
  resetLearnSession();
});
dom.flashcardUnitSelect.addEventListener("change", (event) => setSelectedUnit(event.target.value));

/* ------------------------------
   Adaptive Learn Mode
   ------------------------------ */

function getLearnCardProgress(unitId, cardId) {
  const unitProgress = getUnitProgress(unitId);

  if (!unitProgress.learn) {
    unitProgress.learn = {};
  }

  if (!unitProgress.learn[cardId]) {
    unitProgress.learn[cardId] = {
      intervalDays: 0,
      easeFactor: 2.3,
      repetitions: 0,
      dueAt: null,
      lastRating: null,
      lastReviewed: null,
      lapses: 0
    };
  }

  return unitProgress.learn[cardId];
}

function buildLearnQueue(unitId) {
  const unit = state.units.get(unitId);
  if (!unit) return [];

  const now = Date.now();

  const dueCards = [];
  const futureCards = [];

  unit.flashcards.forEach((card) => {
    const item = getLearnCardProgress(unit.id, card.id);
    const dueTime = item.dueAt ? new Date(item.dueAt).getTime() : 0;

    const queueRecord = {
      cardId: card.id,
      dueTime,
      weight: calculateLearnWeight(item, dueTime <= now)
    };

    if (!item.dueAt || dueTime <= now) {
      dueCards.push(queueRecord);
    } else {
      futureCards.push(queueRecord);
    }
  });

  /*
   * Cards with poor ratings receive larger weights and are inserted more
   * often. This is deliberately simple: difficult cards may appear up to
   * three times in a session, "almost" cards twice, and well-known cards once.
   */
  const weightedDue = [];

  dueCards.forEach((record) => {
    const repetitions = Math.max(1, Math.min(3, record.weight));
    for (let i = 0; i < repetitions; i += 1) {
      weightedDue.push(record.cardId);
    }
  });

  const shuffledDue = shuffle(weightedDue);

  if (shuffledDue.length) {
    return shuffledDue;
  }

  /*
   * When nothing is currently due, offer the soonest upcoming cards so the
   * user can still study without discarding the saved schedule.
   */
  return futureCards
    .sort((a, b) => a.dueTime - b.dueTime)
    .slice(0, Math.min(10, futureCards.length))
    .map((record) => record.cardId);
}

function calculateLearnWeight(progressItem, isDue) {
  if (!isDue) return 1;
  if (progressItem.lastRating === "didnt") return 3;
  if (progressItem.lastRating === "almost") return 2;
  return 1;
}

function resetLearnSession() {
  const unit = state.units.get(state.selectedUnitId);

  state.learnQueue = unit ? buildLearnQueue(unit.id) : [];
  state.learnIndex = 0;
  state.learnAnswerRevealed = false;
  state.learnSessionStats = { knew: 0, almost: 0, didnt: 0 };

  renderLearnView();
}

function currentLearnCard() {
  const unit = state.units.get(state.selectedUnitId);
  if (!unit || !state.learnQueue.length) return null;

  const cardId = state.learnQueue[state.learnIndex];
  return unit.flashcards.find((card) => card.id === cardId) || null;
}

function countDueLearnCards(unit) {
  const now = Date.now();

  return unit.flashcards.filter((card) => {
    const item = getLearnCardProgress(unit.id, card.id);
    return !item.dueAt || new Date(item.dueAt).getTime() <= now;
  }).length;
}

/** Render the current adaptive Learn Mode card. */
function renderLearnView() {
  const unit = state.units.get(state.selectedUnitId);

  if (!unit || !unit.flashcards.length) {
    dom.learnQuestion.textContent = "No learn cards are available.";
    dom.learnCounter.textContent = "Card 0 of 0";
    dom.learnDueStatus.textContent = "0 due";
    dom.learnProgressBar.style.width = "0%";
    dom.revealLearnAnswerButton.disabled = true;
    return;
  }

  if (!state.learnQueue.length) {
    state.learnQueue = buildLearnQueue(unit.id);
  }

  if (!state.learnQueue.length) {
    dom.learnQuestion.textContent = "You are caught up for now.";
    dom.learnCounter.textContent = "Session complete";
    dom.learnDueStatus.textContent = "0 due";
    dom.learnProgressBar.style.width = "100%";
    dom.revealLearnAnswerButton.disabled = true;
    return;
  }

  state.learnIndex = Math.min(state.learnIndex, state.learnQueue.length - 1);

  const card = currentLearnCard();
  const dueCount = countDueLearnCards(unit);

  dom.learnQuestion.textContent = card.front || card.question || "";
  dom.learnAttemptInput.value = "";
  dom.learnAttemptInput.disabled = false;
  dom.learnAnswerPanel.classList.add("hidden");
  dom.revealLearnAnswerButton.classList.remove("hidden");
  dom.revealLearnAnswerButton.disabled = false;
  state.learnAnswerRevealed = false;

  dom.learnCounter.textContent =
    `Card ${state.learnIndex + 1} of ${state.learnQueue.length}`;
  dom.learnDueStatus.textContent = `${dueCount} due`;
  dom.learnProgressBar.style.width =
    `${(state.learnIndex / state.learnQueue.length) * 100}%`;

  dom.learnKnewCount.textContent = state.learnSessionStats.knew;
  dom.learnAlmostCount.textContent = state.learnSessionStats.almost;
  dom.learnDidntCount.textContent = state.learnSessionStats.didnt;
}

function revealLearnAnswer() {
  const card = currentLearnCard();
  if (!card) return;

  const attempt = dom.learnAttemptInput.value.trim();

  if (!attempt) {
    showToast("Type an answer before revealing the card.");
    dom.learnAttemptInput.focus();
    return;
  }

  dom.learnAnswer.textContent = card.back || card.answer || "";
  dom.learnExplanation.textContent = card.explanation || "";
  dom.learnExplanationSection.classList.toggle("hidden", !card.explanation);
  dom.learnAnswerPanel.classList.remove("hidden");
  dom.revealLearnAnswerButton.classList.add("hidden");
  dom.learnAttemptInput.disabled = true;
  state.learnAnswerRevealed = true;
}

function updateSpacedRepetition(item, rating) {
  const now = new Date();
  let intervalDays = item.intervalDays || 0;
  let easeFactor = item.easeFactor || 2.3;
  let repetitions = item.repetitions || 0;

  if (rating === "didnt") {
    repetitions = 0;
    intervalDays = 0.007; // about 10 minutes
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    item.lapses = (item.lapses || 0) + 1;
  } else if (rating === "almost") {
    repetitions += 1;
    intervalDays = repetitions <= 1
      ? 1
      : Math.max(1, Math.round(Math.max(intervalDays, 1) * 1.5));
    easeFactor = Math.max(1.3, easeFactor - 0.05);
  } else {
    repetitions += 1;

    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(
        4,
        Math.round(Math.max(intervalDays, 1) * easeFactor)
      );
    }

    easeFactor = Math.min(3.0, easeFactor + 0.08);
  }

  item.intervalDays = intervalDays;
  item.easeFactor = easeFactor;
  item.repetitions = repetitions;
  item.lastRating = rating;
  item.lastReviewed = now.toISOString();
  item.dueAt = new Date(
    now.getTime() + intervalDays * 24 * 60 * 60 * 1000
  ).toISOString();
}

function rateLearnCard(rating) {
  if (!state.learnAnswerRevealed) return;

  const unit = state.units.get(state.selectedUnitId);
  const card = currentLearnCard();
  if (!unit || !card) return;

  const item = getLearnCardProgress(unit.id, card.id);
  updateSpacedRepetition(item, rating);
  recordStudyActivity();

  state.learnSessionStats[rating] += 1;

  /*
   * "Didn't know" cards repeat soon in the same session.
   * "Almost" cards repeat once later in the current queue.
   */
  if (rating === "didnt") {
    const insertionPoint = Math.min(
      state.learnQueue.length,
      state.learnIndex + 2 + Math.floor(Math.random() * 2)
    );
    state.learnQueue.splice(insertionPoint, 0, card.id);
  } else if (rating === "almost") {
    const insertionPoint = Math.min(
      state.learnQueue.length,
      state.learnIndex + 4 + Math.floor(Math.random() * 3)
    );
    state.learnQueue.splice(insertionPoint, 0, card.id);
  }

  saveProgress();

  state.learnIndex += 1;

  if (state.learnIndex >= state.learnQueue.length) {
    state.learnQueue = buildLearnQueue(unit.id);
    state.learnIndex = 0;
  }

  renderLearnView();
  showToast(
    rating === "knew"
      ? "Scheduled for a longer review interval."
      : rating === "almost"
        ? "This card will return later."
        : "This card will repeat soon."
  );
}

dom.revealLearnAnswerButton?.addEventListener("click", revealLearnAnswer);

dom.learnAttemptInput?.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    revealLearnAnswer();
  }
});

dom.learnRatingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rateLearnCard(button.dataset.learnRating);
  });
});

/* ------------------------------
   Flashcards
   ------------------------------ */

function getCurrentFlashcardDeck() {
  const unit = state.units.get(state.selectedUnitId);
  if (!unit) return [];

  if (
    !state.flashcardOrder.length ||
    state.flashcardOrder.some((index) => index >= unit.flashcards.length)
  ) {
    state.flashcardOrder = unit.flashcards.map((_, index) => index);
  }

  return state.flashcardOrder.map((index) => unit.flashcards[index]);
}

function resetFlashcardDeck() {
  const unit = state.units.get(state.selectedUnitId);
  state.flashcardOrder = unit ? unit.flashcards.map((_, index) => index) : [];
  state.flashcardIndex = 0;
}

function currentFlashcard() {
  const deck = getCurrentFlashcardDeck();
  return deck[state.flashcardIndex] || null;
}

function normalizeExamBullets(card) {
  const explicitExamAnswer =
    card.examAnswer ||
    card.exam_answer ||
    "";

  if (Array.isArray(explicitExamAnswer)) {
    return explicitExamAnswer
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  if (typeof explicitExamAnswer === "string" && explicitExamAnswer.trim()) {
    const explicitBullets = explicitExamAnswer
      .split(/\n|•|(?<=\.)\s+(?=[A-Z])/)
      .map((item) => item.replace(/^[-–—]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 4);

    if (explicitBullets.length >= 2) {
      return explicitBullets;
    }
  }

  /*
   * Older unit files may contain only a short flashcard answer. In that case,
   * create an exam-ready response from the answer plus its explanation,
   * preserving the source wording rather than inventing new facts.
   */
  const sourceText = [
    card.back || card.answer || "",
    card.explanation || ""
  ].filter(Boolean).join(" ");

  const sentences = sourceText
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const bullets = [];

  for (const sentence of sentences) {
    if (!bullets.includes(sentence)) {
      bullets.push(sentence);
    }
    if (bullets.length === 4) break;
  }

  if (bullets.length === 1) {
    const clauses = bullets[0]
      .split(/;\s+|,\s+(?=[a-zA-Z])/)
      .map((item) => item.trim())
      .filter((item) => item.length > 8);

    if (clauses.length >= 2) {
      return clauses.slice(0, 4);
    }
  }

  return bullets.slice(0, 4);
}

function renderFlashcardAnswer(card) {
  dom.answerModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.answerMode === state.answerMode);
  });

  if (state.answerMode === "exam") {
    const bullets = normalizeExamBullets(card);

    dom.flashcardBack.innerHTML = bullets.length
      ? `<ul>${bullets.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`
      : "<p>No exam answer is available for this card.</p>";
  } else {
    const shortAnswer = card.back || card.answer || "";
    dom.flashcardBack.innerHTML = `<p>${escapeHTML(shortAnswer)}</p>`;
  }
}

/** Render the active flashcard and its saved state. */
function renderFlashcard() {
  const unit = state.units.get(state.selectedUnitId);
  const deck = getCurrentFlashcardDeck();

  if (!unit || !deck.length) {
    dom.flashcardFront.textContent = "No flashcards are available.";
    dom.flashcardBack.innerHTML = "";
    dom.flashcardCounter.textContent = "Card 0 of 0";
    dom.flashcardProgressBar.style.width = "0%";
    return;
  }

  state.flashcardIndex = Math.max(0, Math.min(state.flashcardIndex, deck.length - 1));

  const card = deck[state.flashcardIndex];
  const unitProgress = getUnitProgress(unit.id);
  const cardProgress = getCardProgress(unit.id, card.id);

  dom.flashcard.classList.remove("flipped");
  dom.flashcardFront.textContent = card.front || card.question || "";
  renderFlashcardAnswer(card);

  const explanation = card.explanation || "";
  const memoryTrick = card.memoryTrick || card.memory_trick || "";
  const examTrap = card.examTrap || card.exam_trap || "";

  dom.flashcardExplanation.textContent = explanation;
  dom.flashcardMemoryTrick.textContent = memoryTrick;
  dom.flashcardExamTrap.textContent = examTrap;

  dom.flashcardExplanationSection.classList.toggle("hidden", !explanation);
  dom.flashcardMemorySection.classList.toggle("hidden", !memoryTrick);
  dom.flashcardTrapSection.classList.toggle("hidden", !examTrap);

  dom.flashcardCounter.textContent = `Card ${state.flashcardIndex + 1} of ${deck.length}`;
  dom.flashcardProgressBar.style.width = `${((state.flashcardIndex + 1) / deck.length) * 100}%`;

  const reviewedCount = Object.values(unitProgress.flashcards)
    .filter((item) => item.reviewCount > 0).length;
  dom.flashcardMastery.textContent = `${reviewedCount} reviewed`;

  dom.bookmarkCardButton.textContent = cardProgress.bookmarked ? "★ Bookmarked" : "☆ Bookmark";
  dom.difficultCardButton.textContent = cardProgress.difficult ? "Difficult ✓" : "Mark Difficult";

  dom.confidenceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.confidence === cardProgress.confidence);
  });
}

function advanceFlashcard(direction = 1) {
  const deck = getCurrentFlashcardDeck();
  if (!deck.length) return;

  state.flashcardIndex =
    (state.flashcardIndex + direction + deck.length) % deck.length;
  renderFlashcard();
}

function recordCardReview(confidence) {
  const unit = state.units.get(state.selectedUnitId);
  const card = currentFlashcard();
  if (!unit || !card) return;

  const cardProgress = getCardProgress(unit.id, card.id);
  cardProgress.confidence = confidence;
  cardProgress.reviewCount += 1;
  cardProgress.lastReviewed = new Date().toISOString();
  recordStudyActivity();

  if (confidence === "easy" && !getUnitProgress(unit.id).masteredCards.includes(card.id)) {
    getUnitProgress(unit.id).masteredCards.push(card.id);
  }

  if (confidence === "hard") {
    cardProgress.difficult = true;
    getUnitProgress(unit.id).masteredCards =
      getUnitProgress(unit.id).masteredCards.filter((id) => id !== card.id);
  }

  saveProgress();
  renderFlashcard();
  showToast(`Confidence saved: ${confidence}.`);
}

dom.flashcard.addEventListener("click", () => {
  dom.flashcard.classList.toggle("flipped");
});

dom.previousCardButton.addEventListener("click", () => advanceFlashcard(-1));
dom.nextCardButton.addEventListener("click", () => advanceFlashcard(1));

dom.bookmarkCardButton?.addEventListener("click", () => {
  const unit = state.units.get(state.selectedUnitId);
  const card = currentFlashcard();
  if (!unit || !card) return;

  const cardProgress = getCardProgress(unit.id, card.id);
  cardProgress.bookmarked = !cardProgress.bookmarked;
  if (cardProgress.bookmarked) {
    cardProgress.bookmarkedAt = new Date().toISOString();
  }
  saveProgress();
  renderFlashcard();
  showToast(cardProgress.bookmarked ? "Card bookmarked." : "Bookmark removed.");
});

dom.difficultCardButton?.addEventListener("click", () => {
  const unit = state.units.get(state.selectedUnitId);
  const card = currentFlashcard();
  if (!unit || !card) return;

  const cardProgress = getCardProgress(unit.id, card.id);
  cardProgress.difficult = !cardProgress.difficult;

  if (cardProgress.difficult) {
    getUnitProgress(unit.id).masteredCards =
      getUnitProgress(unit.id).masteredCards.filter((id) => id !== card.id);
  }

  saveProgress();
  renderFlashcard();
  showToast(cardProgress.difficult ? "Card marked difficult." : "Difficult mark removed.");
});

dom.shuffleCardsButton?.addEventListener("click", () => {
  const unit = state.units.get(state.selectedUnitId);
  if (!unit) return;

  state.flashcardOrder = shuffle(unit.flashcards.map((_, index) => index));
  state.flashcardIndex = 0;
  renderFlashcard();
  showToast("Flashcards shuffled.");
});

dom.answerModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.answerMode = button.dataset.answerMode;
    localStorage.setItem("biochem-master-answer-mode", state.answerMode);
    renderFlashcard();
  });
});

dom.confidenceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    recordCardReview(button.dataset.confidence);
  });
});

/* ------------------------------
   Multiple Choice mode
   ------------------------------ */

function getAllQuizQuestions() {
  return [...state.units.values()].flatMap((unit) =>
    unit.quiz.map((question) => ({
      ...question,
      unitId: unit.id,
      unitTitle: unit.title
    }))
  );
}

function getQuizPool() {
  if (state.quizSource === "mixed") {
    return getAllQuizQuestions();
  }

  const unit = state.units.get(state.selectedUnitId);
  return unit
    ? unit.quiz.map((question) => ({
        ...question,
        unitId: unit.id,
        unitTitle: unit.title
      }))
    : [];
}

function prepareQuizQuestions() {
  let pool = getQuizPool();

  if (state.quizRandomize) {
    pool = shuffle(pool);
  }

  const requestedCount =
    state.quizQuestionCount === "all"
      ? pool.length
      : Number(state.quizQuestionCount);

  const selected = pool.slice(0, Math.min(requestedCount, pool.length));

  return selected.map((question) => {
    if (!state.quizRandomize || !Array.isArray(question.options)) {
      return { ...question };
    }

    const optionRecords = question.options.map((option, index) => ({
      text: option,
      isCorrect: index === question.answerIndex
    }));

    const shuffledOptions = shuffle(optionRecords);

    return {
      ...question,
      options: shuffledOptions.map((item) => item.text),
      answerIndex: shuffledOptions.findIndex((item) => item.isCorrect)
    };
  });
}

function updateQuizAvailability() {
  const pool = getQuizPool();
  const requested =
    state.quizQuestionCount === "all"
      ? pool.length
      : Number(state.quizQuestionCount);

  if (!pool.length) {
    dom.quizAvailabilityNote.textContent = "No multiple-choice questions are available for this selection.";
    dom.startQuizButton.disabled = true;
    return;
  }

  dom.startQuizButton.disabled = false;

  if (requested > pool.length && state.quizQuestionCount !== "all") {
    dom.quizAvailabilityNote.textContent =
      `${pool.length} questions are available, so this test will use all ${pool.length}.`;
  } else {
    dom.quizAvailabilityNote.textContent =
      `${Math.min(requested, pool.length)} questions will be included.`;
  }
}

function resetQuizPanels() {
  dom.quizSetupPanel.classList.remove("hidden");
  dom.quizPanel.classList.add("hidden");
  dom.quizResultPanel.classList.add("hidden");
  updateQuizAvailability();
}

/** Create and begin an immediate-feedback MCQ session. */
function startQuiz() {
  state.quizRandomize = dom.randomizeQuizToggle.checked;
  state.quizQuestions = prepareQuizQuestions();

  if (!state.quizQuestions.length) {
    showToast("No MCQs are available for this selection.");
    return;
  }

  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizSessionMistakes = [];

  dom.quizSetupPanel.classList.add("hidden");
  dom.quizResultPanel.classList.add("hidden");
  dom.quizPanel.classList.remove("hidden");

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const question = state.quizQuestions[state.quizIndex];
  state.quizAnswered = false;

  dom.quizCounter.textContent =
    `Question ${state.quizIndex + 1} of ${state.quizQuestions.length}`;
  dom.quizScore.textContent =
    `Score: ${state.quizScore} / ${state.quizIndex}`;
  dom.quizProgressBar.style.width =
    `${(state.quizIndex / state.quizQuestions.length) * 100}%`;
  dom.quizUnitBadge.textContent = question.unitTitle || "Biochemistry";
  dom.quizQuestion.textContent = question.question;
  dom.quizFeedback.className = "quiz-feedback";
  dom.quizFeedback.innerHTML = "";
  dom.nextQuestionButton.classList.add("hidden");

  dom.quizOptions.innerHTML = question.options.map((option, index) => `
    <button class="quiz-option" data-option-index="${index}" type="button">
      ${escapeHTML(option)}
    </button>
  `).join("");

  document.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () =>
      answerQuizQuestion(Number(button.dataset.optionIndex))
    );
  });
}

function saveIncorrectQuestion(question, selectedIndex) {
  const record = {
    id: `${question.unitId}:${question.id}`,
    questionId: question.id,
    unitId: question.unitId,
    unitTitle: question.unitTitle,
    question: question.question,
    options: question.options,
    correctAnswer: question.options[question.answerIndex],
    selectedAnswer: question.options[selectedIndex],
    explanation: question.explanation || "",
    lastMissed: new Date().toISOString(),
    missCount: 1
  };

  const existing = progress.mistakes.find((item) => item.id === record.id);

  if (existing) {
    existing.selectedAnswer = record.selectedAnswer;
    existing.lastMissed = record.lastMissed;
    existing.missCount = (existing.missCount || 1) + 1;
    existing.options = record.options;
    existing.correctAnswer = record.correctAnswer;
    existing.explanation = record.explanation;
  } else {
    progress.mistakes.push(record);
  }

  state.quizSessionMistakes.push(record.id);
  saveProgress();
}

function answerQuizQuestion(selectedIndex) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;

  const question = state.quizQuestions[state.quizIndex];
  const optionButtons = document.querySelectorAll(".quiz-option");
  const isCorrect = selectedIndex === question.answerIndex;

  const topicStat = recordQuestionAnswered(question);

  if (isCorrect) {
    state.quizScore += 1;
    topicStat.correct += 1;
  } else {
    saveIncorrectQuestion(question, selectedIndex);
  }

  topicStat.answered += 1;

  optionButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.answerIndex) {
      button.classList.add("correct-answer");
    } else if (index === selectedIndex) {
      button.classList.add("selected-incorrect");
    }
  });

  const answeredCount = state.quizIndex + 1;
  dom.quizScore.textContent =
    `Score: ${state.quizScore} / ${answeredCount}`;

  dom.quizFeedback.className =
    `quiz-feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`;
  dom.quizFeedback.innerHTML = `
    <strong>${isCorrect ? "Correct" : "Incorrect"}</strong>
    <span>${escapeHTML(question.explanation || "Review the highlighted correct answer.")}</span>
  `;

  dom.nextQuestionButton.textContent =
    state.quizIndex === state.quizQuestions.length - 1
      ? "See results"
      : "Next question";
  dom.nextQuestionButton.classList.remove("hidden");
}

function nextQuizQuestion() {
  if (!state.quizAnswered) return;

  if (state.quizIndex < state.quizQuestions.length - 1) {
    state.quizIndex += 1;
    renderQuizQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const percent = Math.round(
    (state.quizScore / state.quizQuestions.length) * 100
  );

  const attemptsByUnit = new Map();

  state.quizQuestions.forEach((question) => {
    if (!attemptsByUnit.has(question.unitId)) {
      attemptsByUnit.set(question.unitId, { total: 0, correct: 0 });
    }

    attemptsByUnit.get(question.unitId).total += 1;
  });

  /*
   * A mixed test is saved to each represented unit as a session summary.
   * Exact per-unit correct counts are not required for the running test UI,
   * so the overall percentage is used for the stored attempt summary.
   */
  attemptsByUnit.forEach((summary, unitId) => {
    getUnitProgress(unitId).quizAttempts.push({
      date: new Date().toISOString(),
      score: state.quizScore,
      total: state.quizQuestions.length,
      percent,
      source: state.quizSource
    });
  });

  saveProgress();

  dom.quizPanel.classList.add("hidden");
  dom.quizResultPanel.classList.remove("hidden");
  dom.quizProgressBar.style.width = "100%";
  dom.quizResultTitle.textContent = `${percent}%`;
  dom.quizResultText.textContent =
    `You answered ${state.quizScore} of ${state.quizQuestions.length} correctly. ` +
    `${state.quizSessionMistakes.length} incorrect question${state.quizSessionMistakes.length === 1 ? "" : "s"} saved for review.`;
}

function renderMistakes() {
  if (!dom.mistakesList) return;

  if (!progress.mistakes.length) {
    dom.mistakesList.innerHTML = `
      <div class="study-panel compact">
        <h3>No mistakes saved</h3>
        <p>Incorrect MCQ answers will appear here automatically.</p>
      </div>
    `;
    return;
  }

  const sorted = [...progress.mistakes].sort(
    (a, b) => new Date(b.lastMissed) - new Date(a.lastMissed)
  );

  dom.mistakesList.innerHTML = sorted.map((item) => `
    <article class="study-item">
      <span class="unit-meta">${escapeHTML(item.unitTitle || "")}</span>
      <h3>${escapeHTML(item.question)}</h3>
      <p><strong>Your answer:</strong> ${escapeHTML(item.selectedAnswer || "")}</p>
      <p><strong>Correct answer:</strong> ${escapeHTML(item.correctAnswer || "")}</p>
      ${item.explanation ? `<p><strong>Explanation:</strong> ${escapeHTML(item.explanation)}</p>` : ""}
      <div class="mistake-meta">
        <span>Missed ${item.missCount || 1} time${(item.missCount || 1) === 1 ? "" : "s"}</span>
        <span>Last missed: ${new Date(item.lastMissed).toLocaleDateString()}</span>
      </div>
    </article>
  `).join("");
}

dom.questionCountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.quizQuestionCount = button.dataset.questionCount;
    dom.questionCountButtons.forEach((item) =>
      item.classList.toggle("active", item === button)
    );
    updateQuizAvailability();
  });
});

dom.questionSourceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.quizSource = button.dataset.questionSource;
    dom.questionSourceButtons.forEach((item) =>
      item.classList.toggle("active", item === button)
    );
    dom.quizUnitSelectLabel.classList.toggle(
      "hidden",
      state.quizSource === "mixed"
    );
    updateQuizAvailability();
  });
});

dom.quizUnitSelect.addEventListener("change", (event) => {
  setSelectedUnit(event.target.value);
  updateQuizAvailability();
});

dom.randomizeQuizToggle.addEventListener("change", (event) => {
  state.quizRandomize = event.target.checked;
});

dom.startQuizButton.addEventListener("click", startQuiz);
dom.retryQuizButton.addEventListener("click", () => {
  dom.quizResultPanel.classList.add("hidden");
  dom.quizSetupPanel.classList.remove("hidden");
  updateQuizAvailability();
});
dom.nextQuestionButton.addEventListener("click", nextQuizQuestion);

dom.reviewQuizMistakesButton?.addEventListener("click", () => {
  showView("mistakes");
  renderMistakes();
});

dom.clearMistakesButton?.addEventListener("click", () => {
  if (!progress.mistakes.length) return;

  const confirmed = window.confirm("Clear all saved incorrect questions?");
  if (!confirmed) return;

  progress.mistakes = [];
  saveProgress();
  renderMistakes();
  showToast("Saved mistakes cleared.");
});

/* ------------------------------
   Practice Test mode
   ------------------------------ */

function getPracticePool() {
  if (state.practiceSource === "mixed") {
    return getAllQuizQuestions();
  }

  const unit = state.units.get(state.selectedUnitId);

  return unit
    ? unit.quiz.map((question) => ({
        ...question,
        unitId: unit.id,
        unitTitle: unit.title
      }))
    : [];
}

function updatePracticeAvailability() {
  const pool = getPracticePool();
  const requested =
    state.practiceCount === "all"
      ? pool.length
      : Number(state.practiceCount);

  if (!pool.length) {
    dom.practiceAvailabilityNote.textContent =
      "No multiple-choice questions are available for this selection.";
    dom.startPracticeButton.disabled = true;
    return;
  }

  dom.startPracticeButton.disabled = false;

  if (state.practiceCount !== "all" && requested > pool.length) {
    dom.practiceAvailabilityNote.textContent =
      `${pool.length} questions are available, so the test will use all ${pool.length}.`;
  } else {
    dom.practiceAvailabilityNote.textContent =
      `${Math.min(requested, pool.length)} randomized questions will be included.`;
  }
}

function preparePracticeQuestions() {
  const pool = shuffle(getPracticePool());
  const requested =
    state.practiceCount === "all"
      ? pool.length
      : Number(state.practiceCount);

  return pool
    .slice(0, Math.min(requested, pool.length))
    .map((question) => {
      const options = question.options.map((option, index) => ({
        text: option,
        correct: index === question.answerIndex
      }));

      const shuffledOptions = shuffle(options);

      return {
        ...question,
        options: shuffledOptions.map((option) => option.text),
        answerIndex: shuffledOptions.findIndex((option) => option.correct)
      };
    });
}

function resetPracticePanels() {
  clearPracticeTimer();
  dom.practiceSetupPanel.classList.remove("hidden");
  dom.practiceTestPanel.classList.add("hidden");
  dom.practiceResultPanel.classList.add("hidden");
  dom.practiceReviewPanel.classList.add("hidden");
  updatePracticeAvailability();
}

/** Create and begin an exam-style practice test. */
function startPracticeTest() {
  state.practiceQuestions = preparePracticeQuestions();

  if (!state.practiceQuestions.length) {
    showToast("No questions are available for this selection.");
    return;
  }

  state.practiceAnswers = new Array(state.practiceQuestions.length).fill(null);
  state.practiceIndex = 0;
  state.practiceResults = null;
  state.practiceTimerEnabled = dom.practiceTimerToggle.checked;

  dom.practiceSetupPanel.classList.add("hidden");
  dom.practiceResultPanel.classList.add("hidden");
  dom.practiceReviewPanel.classList.add("hidden");
  dom.practiceTestPanel.classList.remove("hidden");

  if (state.practiceTimerEnabled) {
    const minutes = Number(dom.practiceTimerMinutes.value);
    state.practiceTimeRemaining = minutes * 60;
    dom.practiceTimerDisplay.classList.remove("hidden");
    updatePracticeTimerDisplay();
    state.practiceTimerId = window.setInterval(tickPracticeTimer, 1000);
  } else {
    dom.practiceTimerDisplay.classList.add("hidden");
  }

  renderPracticeQuestion();
}

function renderPracticeQuestion() {
  const question = state.practiceQuestions[state.practiceIndex];
  const selectedAnswer = state.practiceAnswers[state.practiceIndex];

  dom.practiceCounter.textContent =
    `Question ${state.practiceIndex + 1} of ${state.practiceQuestions.length}`;
  dom.practiceProgressBar.style.width =
    `${((state.practiceIndex + 1) / state.practiceQuestions.length) * 100}%`;
  dom.practiceUnitBadge.textContent = question.unitTitle || "Biochemistry";
  dom.practiceQuestion.textContent = question.question;

  dom.practiceOptions.innerHTML = question.options.map((option, index) => `
    <button
      class="quiz-option ${selectedAnswer === index ? "practice-choice-selected" : ""}"
      data-practice-option="${index}"
      type="button"
    >
      ${escapeHTML(option)}
    </button>
  `).join("");

  document.querySelectorAll("[data-practice-option]").forEach((button) => {
    button.addEventListener("click", () => {
      state.practiceAnswers[state.practiceIndex] =
        Number(button.dataset.practiceOption);
      renderPracticeQuestion();
    });
  });

  dom.previousPracticeQuestionButton.disabled = state.practiceIndex === 0;
  dom.nextPracticeQuestionButton.textContent =
    state.practiceIndex === state.practiceQuestions.length - 1
      ? "Submit test"
      : "Next";
}

function goToPreviousPracticeQuestion() {
  if (state.practiceIndex > 0) {
    state.practiceIndex -= 1;
    renderPracticeQuestion();
  }
}

function goToNextPracticeQuestion() {
  if (state.practiceIndex < state.practiceQuestions.length - 1) {
    state.practiceIndex += 1;
    renderPracticeQuestion();
    return;
  }

  const unanswered = state.practiceAnswers.filter((answer) => answer === null).length;

  if (unanswered) {
    const confirmed = window.confirm(
      `${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered. Submit anyway?`
    );
    if (!confirmed) return;
  }

  finishPracticeTest(false);
}

function finishPracticeTest(timedOut = false) {
  clearPracticeTimer();

  const results = state.practiceQuestions.map((question, index) => {
    const selectedIndex = state.practiceAnswers[index];
    const correct = selectedIndex === question.answerIndex;
    const topicStat = recordQuestionAnswered(question);

    topicStat.answered += 1;
    if (correct) topicStat.correct += 1;

    return {
      question,
      selectedIndex,
      correct
    };
  });

  const correctCount = results.filter((result) => result.correct).length;
  const incorrectResults = results.filter((result) => !result.correct);
  const percent = Math.round(
    (correctCount / state.practiceQuestions.length) * 100
  );

  state.practiceResults = {
    results,
    correctCount,
    incorrectResults,
    percent,
    timedOut
  };

  incorrectResults.forEach((result) => {
    if (result.selectedIndex !== null) {
      saveIncorrectQuestion(result.question, result.selectedIndex);
    }
  });

  const representedUnits = new Set(
    state.practiceQuestions.map((question) => question.unitId)
  );

  representedUnits.forEach((unitId) => {
    getUnitProgress(unitId).quizAttempts.push({
      date: new Date().toISOString(),
      score: correctCount,
      total: state.practiceQuestions.length,
      percent,
      source: "practice-test"
    });
  });

  saveProgress();

  dom.practiceTestPanel.classList.add("hidden");
  dom.practiceReviewPanel.classList.add("hidden");
  dom.practiceResultPanel.classList.remove("hidden");
  dom.practiceResultScore.textContent = `${percent}%`;
  dom.practiceResultSummary.textContent =
    `${timedOut ? "Time expired. " : ""}` +
    `You answered ${correctCount} of ${state.practiceQuestions.length} correctly. ` +
    `${incorrectResults.length} question${incorrectResults.length === 1 ? "" : "s"} available for review.`;

  dom.reviewPracticeAnswersButton.disabled = incorrectResults.length === 0;
}

function renderPracticeReview() {
  if (!state.practiceResults) return;

  const incorrect = state.practiceResults.incorrectResults;

  dom.practiceResultPanel.classList.add("hidden");
  dom.practiceReviewPanel.classList.remove("hidden");

  if (!incorrect.length) {
    dom.practiceReviewList.innerHTML = `
      <div class="study-panel compact">
        <h3>No incorrect answers</h3>
        <p>You answered every question correctly.</p>
      </div>
    `;
    return;
  }

  dom.practiceReviewList.innerHTML = incorrect.map((result, index) => {
    const question = result.question;
    const selectedAnswer =
      result.selectedIndex === null
        ? "No answer selected"
        : question.options[result.selectedIndex];

    return `
      <article class="study-item">
        <span class="unit-meta">${escapeHTML(question.unitTitle || "")}</span>
        <h3>${index + 1}. ${escapeHTML(question.question)}</h3>
        <p class="practice-review-answer">
          <strong>Your answer:</strong> ${escapeHTML(selectedAnswer)}
        </p>
        <p class="practice-review-correct">
          <strong>Correct answer:</strong>
          ${escapeHTML(question.options[question.answerIndex])}
        </p>
        ${question.explanation
          ? `<p><strong>Explanation:</strong> ${escapeHTML(question.explanation)}</p>`
          : ""}
      </article>
    `;
  }).join("");
}

function tickPracticeTimer() {
  state.practiceTimeRemaining -= 1;
  updatePracticeTimerDisplay();

  if (state.practiceTimeRemaining <= 0) {
    finishPracticeTest(true);
  }
}

function updatePracticeTimerDisplay() {
  const minutes = Math.floor(state.practiceTimeRemaining / 60);
  const seconds = state.practiceTimeRemaining % 60;

  dom.practiceTimerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clearPracticeTimer() {
  if (state.practiceTimerId) {
    clearInterval(state.practiceTimerId);
    state.practiceTimerId = null;
  }
}

dom.practiceCountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.practiceCount = button.dataset.practiceCount;

    dom.practiceCountButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    updatePracticeAvailability();
  });
});

dom.practiceSourceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.practiceSource = button.dataset.practiceSource;

    dom.practiceSourceButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    dom.practiceUnitSelectLabel.classList.toggle(
      "hidden",
      state.practiceSource === "mixed"
    );

    updatePracticeAvailability();
  });
});

dom.practiceUnitSelect?.addEventListener("change", (event) => {
  setSelectedUnit(event.target.value);
  updatePracticeAvailability();
});

dom.practiceTimerToggle?.addEventListener("change", (event) => {
  dom.practiceTimerMinutesRow.classList.toggle(
    "hidden",
    !event.target.checked
  );
});

dom.startPracticeButton?.addEventListener("click", startPracticeTest);
dom.previousPracticeQuestionButton?.addEventListener(
  "click",
  goToPreviousPracticeQuestion
);
dom.nextPracticeQuestionButton?.addEventListener(
  "click",
  goToNextPracticeQuestion
);
dom.reviewPracticeAnswersButton?.addEventListener(
  "click",
  renderPracticeReview
);
dom.restartPracticeButton?.addEventListener("click", resetPracticePanels);
dom.backToPracticeResultsButton?.addEventListener("click", () => {
  dom.practiceReviewPanel.classList.add("hidden");
  dom.practiceResultPanel.classList.remove("hidden");
});

/* ------------------------------
   Local study analytics
   ------------------------------ */

let activeStudyStartedAt = Date.now();
let lastStudyActivityAt = Date.now();
let studyTrackingTimer = null;

function ensureAnalytics() {
  if (!progress.analytics) {
    progress.analytics = {
      studySeconds: 0,
      questionsAnswered: 0,
      studyDays: {},
      topicStats: {}
    };
  }

  if (!progress.analytics.studyDays) progress.analytics.studyDays = {};
  if (!progress.analytics.topicStats) progress.analytics.topicStats = {};
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function recordStudyActivity() {
  ensureAnalytics();
  lastStudyActivityAt = Date.now();
}

function beginStudyTimeTracking() {
  if (studyTrackingTimer) return;

  activeStudyStartedAt = Date.now();
  lastStudyActivityAt = Date.now();

  studyTrackingTimer = window.setInterval(() => {
    if (document.hidden) return;

    const now = Date.now();
    const recentlyActive = now - lastStudyActivityAt <= 120000;

    if (recentlyActive) {
      progress.analytics.studySeconds += 10;
      progress.analytics.studyDays[localDateKey()] =
        (progress.analytics.studyDays[localDateKey()] || 0) + 10;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, 10000);
}

function recordQuestionAnswered(question) {
  ensureAnalytics();
  progress.analytics.questionsAnswered += 1;
  recordStudyActivity();

  const topicKey = getQuestionTopicKey(question);
  if (!progress.analytics.topicStats[topicKey]) {
    progress.analytics.topicStats[topicKey] = {
      title: getQuestionTopicTitle(question),
      unitId: question.unitId || state.selectedUnitId,
      correct: 0,
      answered: 0
    };
  }

  return progress.analytics.topicStats[topicKey];
}

function getQuestionTopicKey(question) {
  const unitId = question.unitId || state.selectedUnitId || "unknown";
  const topic =
    question.topic ||
    question.lesson ||
    question.unitTitle ||
    state.units.get(unitId)?.title ||
    "General";
  return `${unitId}:${topic}`;
}

function getQuestionTopicTitle(question) {
  return (
    question.topic ||
    question.lesson ||
    question.unitTitle ||
    state.units.get(question.unitId || state.selectedUnitId)?.title ||
    "General"
  );
}

function calculateDailyStreak() {
  ensureAnalytics();

  const activeDays = new Set(
    Object.entries(progress.analytics.studyDays)
      .filter(([, seconds]) => Number(seconds) > 0)
      .map(([date]) => date)
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  if (!activeDays.has(localDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (activeDays.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function formatStudyTime(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function countBookmarks() {
  return Object.values(progress.units).reduce((total, unitProgress) => {
    const cards = unitProgress.flashcards || {};
    return total + Object.values(cards).filter((card) => card.bookmarked).length;
  }, 0);
}

function getTopicPerformance() {
  ensureAnalytics();

  return Object.values(progress.analytics.topicStats)
    .filter((item) => item.answered > 0)
    .map((item) => ({
      ...item,
      percent: Math.round((item.correct / item.answered) * 100)
    }));
}

function renderTopicStats(target, topics, emptyText) {
  if (!target) return;

  if (!topics.length) {
    target.innerHTML = `<p class="topic-stat-empty">${escapeHTML(emptyText)}</p>`;
    return;
  }

  target.innerHTML = topics.map((topic) => `
    <div class="topic-stat-item">
      <div class="topic-stat-header">
        <strong>${escapeHTML(topic.title)}</strong>
        <span>${topic.percent}% · ${topic.answered} answered</span>
      </div>
      <div class="progress-track" aria-label="${topic.percent}% accuracy">
        <div class="progress-fill" style="width:${topic.percent}%"></div>
      </div>
    </div>
  `).join("");
}

["pointerdown", "keydown", "input"].forEach((eventName) => {
  document.addEventListener(eventName, recordStudyActivity, { passive: true });
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    lastStudyActivityAt = Date.now();
  }
});

/* ------------------------------
   Progress summary
   ------------------------------ */

/** Calculate and render all statistics and progress bars. */
function updateProgressUI() {
  ensureAnalytics();

  const units = [...state.units.values()];
  let masteredCards = 0;
  let totalCards = 0;
  let quizAttempts = [];
  let totalReviewedCards = 0;

  const progressMarkup = units.map((unit) => {
    const unitProgress = getUnitProgress(unit.id);
    const mastered = unitProgress.masteredCards.length;
    const total = unit.flashcards.length;
    const percent = total ? Math.round((mastered / total) * 100) : 0;
    const latestAttempt = unitProgress.quizAttempts.at(-1);
    const reviewed = Object.values(unitProgress.flashcards || {})
      .filter((item) => item.reviewCount > 0).length;

    masteredCards += mastered;
    totalCards += total;
    totalReviewedCards += reviewed;
    quizAttempts = quizAttempts.concat(unitProgress.quizAttempts);

    return `
      <article class="progress-unit">
        <div class="progress-unit-header">
          <div>
            <strong>${escapeHTML(unit.title)}</strong>
            <div class="unit-meta">
              ${mastered} of ${total} cards mastered · ${reviewed} reviewed
            </div>
          </div>
          <span>${percent}%</span>
        </div>
        <div class="progress-track" aria-label="${percent}% mastery">
          <div class="progress-fill" style="width:${percent}%"></div>
        </div>
        <p class="unit-meta">
          Latest score: ${latestAttempt ? `${latestAttempt.percent}%` : "Not attempted"}
        </p>
      </article>
    `;
  }).join("");

  const averageScore = quizAttempts.length
    ? Math.round(
        quizAttempts.reduce((sum, attempt) => sum + attempt.percent, 0) /
        quizAttempts.length
      )
    : 0;

  const mastery = totalCards
    ? Math.round((masteredCards / totalCards) * 100)
    : 0;

  const bookmarks = countBookmarks();
  const streak = calculateDailyStreak();
  const questionsAnswered = progress.analytics.questionsAnswered || 0;

  dom.studyTimeStat.textContent = formatStudyTime(progress.analytics.studySeconds);
  dom.masteryStat.textContent = `${mastery}%`;
  dom.cardsLearnedStat.textContent = masteredCards;
  dom.questionsAnsweredStat.textContent = questionsAnswered;
  dom.averageScoreStat.textContent = `${averageScore}%`;
  dom.bookmarksStat.textContent = bookmarks;
  dom.dailyStreakStat.textContent = `${streak} day${streak === 1 ? "" : "s"}`;

  if (dom.masteredCount) dom.masteredCount.textContent = masteredCards;
  if (dom.quizAverage) dom.quizAverage.textContent = `${averageScore}%`;
  if (dom.completedQuizCount) dom.completedQuizCount.textContent = quizAttempts.length;
  if (dom.overallPercent) dom.overallPercent.textContent = `${mastery}%`;

  dom.overallStatisticsBars.innerHTML = [
    { label: "Mastery", value: mastery },
    {
      label: "Cards reviewed",
      value: totalCards ? Math.round((totalReviewedCards / totalCards) * 100) : 0
    },
    { label: "Average score", value: averageScore }
  ].map((item) => `
    <div class="statistics-bar-row">
      <div class="statistics-bar-label">
        <strong>${item.label}</strong>
        <span>${item.value}%</span>
      </div>
      <div class="progress-track" aria-label="${item.label}: ${item.value}%">
        <div class="progress-fill" style="width:${item.value}%"></div>
      </div>
    </div>
  `).join("");

  const topicPerformance = getTopicPerformance();
  const strongest = [...topicPerformance]
    .sort((a, b) => b.percent - a.percent || b.answered - a.answered)
    .slice(0, 5);
  const weakest = [...topicPerformance]
    .sort((a, b) => a.percent - b.percent || b.answered - a.answered)
    .slice(0, 5);

  renderTopicStats(
    dom.strongestTopicsList,
    strongest,
    "Answer questions to identify your strongest topics."
  );
  renderTopicStats(
    dom.weakestTopicsList,
    weakest,
    "Answer questions to identify topics that need review."
  );

  dom.progressList.innerHTML = progressMarkup ||
    '<div class="empty-state">No units are available.</div>';

  renderDashboard(dom.unitSearch.value);
}

dom.resetProgressButton.addEventListener("click", resetAllProgress);

/* ------------------------------
   PWA installation and offline state
   ------------------------------ */

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.installPrompt = event;
  dom.installButton.classList.remove("hidden");
});

dom.installButton.addEventListener("click", async () => {
  if (!state.installPrompt) return;

  state.installPrompt.prompt();
  await state.installPrompt.userChoice;
  state.installPrompt = null;
  dom.installButton.classList.add("hidden");
});

function updateConnectionStatus() {
  dom.offlineStatus.textContent = navigator.onLine ? "Online" : "Working offline";
}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

function cacheDiscoveredUnitsOffline() {
  if (!navigator.serviceWorker?.controller) return;

  navigator.serviceWorker.controller.postMessage({
    type: "CACHE_UNIT_URLS",
    urls: state.discoveredUnitFiles.map((file) => `data/${file}`)
  });
}

/** Register the offline service worker when supported. */
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("service-worker.js");
    await navigator.serviceWorker.ready;
    cacheDiscoveredUnitsOffline();
    return registration;
  } catch (error) {
    console.warn("Service worker registration failed.", error);
  }
}

/* ------------------------------
   Small helpers
   ------------------------------ */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer;

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    dom.toast.classList.remove("visible");
  }, 2200);
}

/* ------------------------------
   Application startup
   ------------------------------ */

/** Initialize preferences, content, views, offline support, and analytics. */
async function initializeApp() {
  try {
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
    if (dom.appVersionText) {
      dom.appVersionText.textContent = `Biochem Master ${APP_VERSION}`;
    }
    await loadCatalog();
    populateUnitSelects();
    buildSearchIndex();
    renderDashboard();
    renderUnitsLibrary();
    renderBookmarks();

    if (dom.unitDiscoveryStatus) {
      const warningText = state.discoveryWarnings.length
        ? ` ${state.discoveryWarnings.join(" ")}`
        : "";
      dom.unitDiscoveryStatus.textContent =
        `${state.units.size} unit${state.units.size === 1 ? "" : "s"} loaded.` +
        warningText;
    }
    resetLearnSession();
    renderFlashcard();
    updateProgressUI();
    updateQuizAvailability();
    updatePracticeAvailability();
    renderMistakes();
    updateConnectionStatus();
    registerServiceWorker();
    beginStudyTimeTracking();

    const savedSidebarState = localStorage.getItem(SIDEBAR_STATE_KEY) === "true";
    applySidebarPreference(savedSidebarState);

    const lastView = localStorage.getItem("biochem-master-last-view") || "dashboard";
    showView(lastView);
  } catch (error) {
    console.error(error);

    if (dom.unitGrid) {
      dom.unitGrid.innerHTML = `
        <div class="empty-state">
          Biochem Master could not load its study files. Open the app through a
          local web server so the browser can read the JSON files.
        </div>
      `;
    }

    showToast("Some study content could not be loaded.");
  } finally {
    document.body.removeAttribute("aria-busy");
    dom.loadingStatus?.classList.add("ready");
  }
}

window.addEventListener("error", (event) => {
  console.error("Unhandled application error:", event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

document.body.setAttribute("aria-busy", "true");
initializeApp();
