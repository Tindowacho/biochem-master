# Biochem Master

Biochem Master is a polished, offline-first Progressive Web App for undergraduate biochemistry study. It uses only HTML5, CSS3, vanilla JavaScript, JSON, and browser storage.

## Features

- Responsive dashboard and collapsible navigation
- Study by Unit with lessons, topics, flashcards, MCQs, and unit search
- Quizlet-style flashcards with short and exam-answer modes
- Adaptive Learn Mode with simple spaced repetition
- Immediate-feedback MCQ mode
- Timed or untimed randomized practice tests
- Bookmarks and automatic mistake review
- Instant global search
- Local statistics, mastery, streaks, and study-time tracking
- Light and dark themes
- Progress export and import
- Local JSON unit import
- Installable PWA that works offline after the first successful load

## Project structure

```text
biochem-master/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── service-worker.js
├── README.md
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── data/
    ├── index.json
    ├── amino-acids.json
    └── enzymes.json
```

## Run locally

Browsers do not permit `fetch()` to read JSON from a folder opened with `file://`. Run the project through a static web server:

```bash
cd biochem-master
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

After the first complete load, the installed PWA can reopen offline.

## Add a unit

Create a JSON file in `data/` and add its filename to `data/index.json`. No HTML, CSS, or JavaScript changes are required.

Example manifest entry:

```json
{
  "id": "metabolism",
  "file": "metabolism.json",
  "title": "Metabolism",
  "order": 3
}
```

When the hosting server exposes directory listings, Biochem Master also discovers JSON files directly from `/data/`. The **Rescan /data/** control checks common `unit-#.json` filenames as a compatibility fallback.

## Supported unit structure

```json
{
  "id": "unique-unit-id",
  "unitNumber": 3,
  "title": "Unit title",
  "description": "Short description",
  "level": "Course grouping",
  "tags": ["search", "keywords"],
  "lessons": [],
  "topics": [],
  "flashcards": [
    {
      "id": "card-1",
      "front": "Question",
      "back": "Short answer",
      "examAnswer": [
        "Exam-ready point one.",
        "Exam-ready point two."
      ],
      "explanation": "Optional explanation.",
      "memoryTrick": "Optional one-sentence memory aid.",
      "examTrap": "Optional misconception correction."
    }
  ],
  "quiz": [
    {
      "id": "question-1",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 0,
      "explanation": "Brief answer explanation."
    }
  ]
}
```

The importer also recognizes structured `items` arrays containing fields such as `question`, `flashcard_answer`, `exam_answer`, `explanation`, `memory_trick`, `exam_trap`, `lesson`, `topic`, and `tags`.

## Offline behaviour

The service worker caches:

- The complete application shell
- Every JSON unit successfully loaded by the app
- Newly discovered unit URLs sent to it by the page

Changing the cache version in `service-worker.js` releases an updated shell.

## Privacy and storage

All progress remains in browser `localStorage` unless the student exports it. No account, backend, database, analytics service, or external API is used.

## Accessibility

The application includes semantic landmarks, keyboard navigation, visible focus indicators, status announcements, reduced-motion support, responsive touch targets, table captions, accessible form labels, and high-contrast adjustments.

## Version

Biochem Master 1.3.0


## Included course database

Version 1.3.0 includes Units 1–5 from `Biochem Unit 1-5a(1).pdf`.

Each unit file preserves all extracted source records in its `items` array and supplies interactive lessons, topics, flashcards, exam answers, explanations, memory tricks, exam traps, and MCQs.

## Adding future PDFs

The browser app does not parse PDFs directly. Future PDFs should be converted into Biochem Master JSON files, then added as `data/unit-6.json`, `data/unit-7.json`, and so forth. Add each filename to `data/index.json` and upload the changed `data` folder to GitHub. No application-code changes are required.
