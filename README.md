# Congenital Heart Lab — Interactive Congenital Heart Disease

A self-contained, offline-capable learning website rebuilt from the supplied **Congenital Heart Disease** study chapter.

## Open the website

1. Extract the ZIP archive.
2. Open `index.html` in a recent version of Google Chrome, Microsoft Edge, Firefox, or Safari.
3. No installation or build step is required.

For the most consistent local behavior, serve the folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Main features

- 15 interconnected modules with hash routing, previous/next navigation, persistent visited progress, search, bookmarks, and print support.
- Detailed physiology-first coverage of the clinical approach, ASD, VSD, PDA, pulmonary stenosis, coarctation, tetralogy of Fallot, Eisenmenger syndrome, d-TGA, related lesions, and dextrocardia/situs terminology.
- Animated schematic flow diagrams that connect anatomy to shunt direction, pulmonary flow, chamber load, cyanosis, examination findings, and intervention safety.
- Interactive lesion map, shunt-reasoning builder, ASD closure explorer, VSD physiology explorer, PDA scenario explorer, pulmonary stenosis Doppler classifier, coarctation pressure tool, tet-spell sequence builder, Eisenmenger pressure-gradient explorer, and d-TGA mixing explorer.
- Murmur/pulse matching game, chamber-load challenge, closure-safety screen, and filterable comparison matrix.
- 18 **fully functional flip flashcards**. Click a card or focus it and press Enter/Space to reveal and hide the answer. Shuffle, reset, and flip-all controls are included.
- 15 clinical case questions with immediate explanations and final scoring.
- A separate **Listen** button for compact learning blocks using the browser Web Speech API.
- The supplied PDF is included in `assets/` and linked from the Sources module.

## Text-to-speech

The website first requests **Google UK English Female**. If that exact voice is unavailable, it chooses the closest British-English voice and then another available English voice. Voice availability depends on the browser and operating system.

## Project structure

- `index.html` — application shell and accessibility landmarks.
- `styles.css` — responsive layout, diagrams, tools, flashcard flip system, quiz, and print rules.
- `js/content.js` — routes, detailed educational content, lesion profiles, flashcards, quiz data, and SVG diagrams.
- `js/app.js` — routing, progress, search, bookmarks, TTS, calculators, games, flashcards, and quiz logic.
- `assets/congenital-heart-disease-source.pdf` — supplied source chapter.

## Medical scope

This website is an educational study aid. It is not a patient-specific diagnostic, procedural, prescribing, neonatal stabilization, shunt-closure, or surgical protocol. Current local guidance, lesion-specific specialist assessment, contraindications, device criteria, and trained clinical judgment take precedence.
