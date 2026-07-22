/* Congenital Heart Lab application controller. */
(() => {
  "use strict";

  const content = window.CHDContent;
  if (!content) throw new Error("CHDContent failed to load.");

  const KEYS = {
    visited: "chd-lab-visited-v1",
    bookmarks: "chd-lab-bookmarks-v1",
    rate: "chd-lab-speech-rate-v1"
  };

  const els = {
    nav: document.getElementById("course-nav"),
    app: document.getElementById("app-content"),
    currentLabel: document.getElementById("current-section-label"),
    sidebar: document.getElementById("sidebar"),
    scrim: document.getElementById("sidebar-scrim"),
    menu: document.getElementById("menu-button"),
    closeSidebar: document.getElementById("sidebar-close"),
    progressLabel: document.getElementById("progress-label"),
    progressBar: document.getElementById("progress-bar"),
    resetProgress: document.getElementById("reset-progress"),
    clearBookmarks: document.getElementById("clear-bookmarks"),
    search: document.getElementById("site-search"),
    searchResults: document.getElementById("search-results"),
    voiceStatus: document.getElementById("voice-status"),
    speechRate: document.getElementById("speech-rate"),
    stopSpeech: document.getElementById("stop-speech"),
    print: document.getElementById("print-button"),
    bookmarksButton: document.getElementById("bookmarks-button"),
    bookmarkDialog: document.getElementById("bookmark-dialog"),
    bookmarkList: document.getElementById("bookmark-list"),
    closeBookmarks: document.getElementById("close-bookmarks"),
    toast: document.getElementById("toast")
  };

  const state = {
    route: "overview",
    visited: new Set(readJSON(KEYS.visited, ["overview"])),
    bookmarks: readJSON(KEYS.bookmarks, []),
    voices: [],
    voice: null,
    speechUnit: null,
    flashcards: [...content.flashcards],
    quiz: { index: 0, score: 0, answered: false },
    murmurIndex: 0,
    chamberIndex: 0,
    tetSelection: []
  };

  const murmurCases = [
    { clue: "Wide, fixed splitting of S2 with a systolic pulmonary flow murmur", answer: "ASD", why: "Atrial-level left-to-right shunting produces RV volume load and prolonged RV ejection." },
    { clue: "Harsh holosystolic murmur at the lower left sternal border; a small defect may be very loud", answer: "VSD", why: "A restrictive VSD maintains a large LV-to-RV pressure gradient." },
    { clue: "Continuous infraclavicular machinery murmur with bounding pulses", answer: "PDA", why: "Aortic-to-pulmonary flow persists in systole and diastole, with diastolic runoff." },
    { clue: "Ejection click, harsh systolic ejection murmur at the LUSB, and soft delayed P2", answer: "Pulmonary stenosis", why: "The RV ejects through an obstructed pulmonary valve or outflow tract." },
    { clue: "Upper-limb hypertension, weak femoral pulses, and a systolic back murmur", answer: "Coarctation", why: "Aortic arch obstruction creates a pressure and pulse difference between upper and lower body." },
    { clue: "Single S2, cyanosis, and an RVOT systolic ejection murmur", answer: "Tetralogy of Fallot", why: "Pulmonary outflow obstruction limits pulmonary flow and drives right-to-left shunting." },
    { clue: "Loud P2, cyanosis, and a previous shunt murmur that has become quieter", answer: "Eisenmenger syndrome", why: "Rising pulmonary pressure narrows and reverses the original shunt gradient." },
    { clue: "Profound neonatal cyanosis with relatively little respiratory distress; oxygen alone has limited effect", answer: "d-TGA", why: "Parallel circulations require effective mixing rather than oxygen alone." }
  ];

  const chamberCases = [
    { lesion: "ASD", answer: "RA and RV volume overload", choices: ["RA and RV volume overload", "LA and LV volume overload", "RV pressure overload only", "LV pressure overload"], why: "The left-to-right atrial shunt sends extra blood through the RA, tricuspid valve, and RV." },
    { lesion: "Moderate VSD", answer: "LA and LV volume overload", choices: ["RA and RV volume overload", "LA and LV volume overload", "Isolated RA pressure overload", "No chamber response"], why: "Extra pulmonary flow returns through the pulmonary veins to the LA and LV." },
    { lesion: "PDA", answer: "LA and LV volume overload", choices: ["LA and LV volume overload", "RA and RV volume overload", "RV pressure overload", "Biatrial pressure overload"], why: "Aortic-to-pulmonary shunting increases pulmonary venous return to the left heart." },
    { lesion: "Pulmonary stenosis", answer: "RV pressure overload", choices: ["RV pressure overload", "RV volume overload", "LV volume overload", "LA pressure overload"], why: "The RV must generate higher systolic pressure across the obstructed outflow." },
    { lesion: "Coarctation", answer: "LV pressure overload", choices: ["LV pressure overload", "LA volume overload", "RV volume overload", "RA pressure overload"], why: "The LV ejects against a narrowed aortic arch." },
    { lesion: "Tetralogy of Fallot", answer: "RV pressure overload", choices: ["RV pressure overload", "LV volume overload", "RA volume overload", "No ventricular load"], why: "RVOT obstruction creates chronic RV pressure load and hypertrophy." }
  ];

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode may deny storage */ }
  }

  function routeFromHash() {
    const candidate = location.hash.replace(/^#/, "").split("?")[0];
    return content.routes.some(route => route.id === candidate) ? candidate : "overview";
  }

  function renderNav() {
    const groups = [];
    content.routes.forEach(route => {
      let group = groups.find(item => item.name === route.group);
      if (!group) {
        group = { name: route.group, routes: [] };
        groups.push(group);
      }
      group.routes.push(route);
    });

    let count = 0;
    els.nav.innerHTML = groups.map(group => `
      <p class="nav-group-title">${group.name}</p>
      ${group.routes.map(route => {
        count += 1;
        return `<button type="button" class="nav-link" data-route="${route.id}">
          <span class="nav-number">${String(count).padStart(2, "0")}</span>
          <span class="nav-copy"><strong>${route.short}</strong><small>${route.subtitle}</small></span>
          <span class="nav-check" aria-label="Visited">✓</span>
        </button>`;
      }).join("")}
    `).join("");
  }

  function navigate(routeId, options = {}) {
    const route = content.routes.find(item => item.id === routeId) || content.routes[0];
    if (location.hash !== `#${route.id}`) history.pushState(null, "", `#${route.id}`);
    state.route = route.id;
    state.visited.add(route.id);
    writeJSON(KEYS.visited, [...state.visited]);

    window.speechSynthesis?.cancel();
    state.speechUnit = null;
    els.app.innerHTML = content.render(route.id);
    els.currentLabel.textContent = route.title;
    document.title = `${route.title} | Congenital Heart Lab`;

    updateNavigation();
    decorateLearningBlocks();
    initCurrentPage();
    closeSidebar();

    if (!options.preserveScroll) window.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      if (options.targetUnit) {
        const target = document.getElementById(options.targetUnit);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.focus?.({ preventScroll: true });
        }
      } else if (options.focus !== false) {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    });
  }

  function updateNavigation() {
    document.querySelectorAll(".nav-link").forEach(button => {
      const id = button.dataset.route;
      button.classList.toggle("active", id === state.route);
      button.classList.toggle("visited", state.visited.has(id));
      button.setAttribute("aria-current", id === state.route ? "page" : "false");
    });
    const total = content.routes.length;
    const count = state.visited.size;
    els.progressLabel.textContent = `${count} / ${total}`;
    els.progressBar.style.width = `${Math.min(100, (count / total) * 100)}%`;
  }

  function decorateLearningBlocks() {
    const route = state.route;
    const units = [...els.app.querySelectorAll(".tts-unit")];
    units.forEach((unit, index) => {
      const unitId = `${route}-unit-${index + 1}`;
      unit.id = unitId;
      unit.tabIndex = unit.matches("section.hero") ? -1 : 0;
      const title = unit.dataset.bookmarkTitle || unit.querySelector("h1,h2,h3,strong")?.textContent?.trim() || `Learning block ${index + 1}`;
      const bookmarked = state.bookmarks.some(bookmark => bookmark.route === route && bookmark.unitId === unitId);
      const tools = document.createElement("div");
      tools.className = "block-tools interactive-only";
      tools.setAttribute("aria-label", "Learning block tools");
      tools.innerHTML = `<button class="listen-button" type="button" data-listen-unit="${unitId}" aria-label="Listen to ${escapeAttribute(title)}">▶ Listen</button>
        <button class="bookmark-button ${bookmarked ? "is-bookmarked" : ""}" type="button" data-bookmark-unit="${unitId}" data-bookmark-title="${escapeAttribute(title)}" aria-label="${bookmarked ? "Remove" : "Add"} bookmark for ${escapeAttribute(title)}">★</button>`;
      unit.prepend(tools);
    });
  }

  function escapeAttribute(value) {
    return String(value).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  }

  function textForUnit(unit) {
    const clone = unit.cloneNode(true);
    clone.querySelectorAll(".block-tools, button, select, input, .interactive-only").forEach(node => node.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  function loadVoices() {
    if (!window.speechSynthesis) {
      els.voiceStatus.textContent = "TTS unavailable";
      return;
    }
    state.voices = speechSynthesis.getVoices();
    const scored = state.voices.map(voice => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      let score = 0;
      if (name.includes("google uk english female")) score += 100;
      if (name.includes("uk english female")) score += 80;
      if (lang === "en-gb") score += 45;
      if (name.includes("female") || name.includes("susan") || name.includes("serena") || name.includes("sonia") || name.includes("libby")) score += 20;
      if (lang.startsWith("en")) score += 10;
      return { voice, score };
    }).sort((a, b) => b.score - a.score);
    state.voice = scored[0]?.voice || null;
    els.voiceStatus.textContent = state.voice ? state.voice.name.replace(/Microsoft|Google/g, "").trim() : "Default voice";
  }

  function speakUnit(unitId) {
    if (!window.speechSynthesis) {
      showToast("Text-to-speech is not supported in this browser.");
      return;
    }
    const unit = document.getElementById(unitId);
    if (!unit) return;
    const text = textForUnit(unit);
    if (!text) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (state.voice) utterance.voice = state.voice;
    utterance.lang = state.voice?.lang || "en-GB";
    utterance.rate = Number(els.speechRate.value || 0.92);
    utterance.pitch = 1;
    utterance.onstart = () => {
      state.speechUnit = unitId;
      document.querySelectorAll("[data-listen-unit]").forEach(button => {
        button.textContent = button.dataset.listenUnit === unitId ? "❚❚ Speaking" : "▶ Listen";
      });
    };
    const clear = () => {
      state.speechUnit = null;
      document.querySelectorAll("[data-listen-unit]").forEach(button => { button.textContent = "▶ Listen"; });
    };
    utterance.onend = clear;
    utterance.onerror = clear;
    speechSynthesis.speak(utterance);
  }

  function toggleBookmark(button) {
    const unitId = button.dataset.bookmarkUnit;
    const title = button.dataset.bookmarkTitle;
    const index = state.bookmarks.findIndex(bookmark => bookmark.route === state.route && bookmark.unitId === unitId);
    if (index >= 0) {
      state.bookmarks.splice(index, 1);
      button.classList.remove("is-bookmarked");
      button.setAttribute("aria-label", `Add bookmark for ${title}`);
      showToast("Bookmark removed.");
    } else {
      state.bookmarks.push({ route: state.route, unitId, title, savedAt: Date.now() });
      button.classList.add("is-bookmarked");
      button.setAttribute("aria-label", `Remove bookmark for ${title}`);
      showToast("Bookmark saved.");
    }
    writeJSON(KEYS.bookmarks, state.bookmarks);
  }

  function renderBookmarks() {
    if (!state.bookmarks.length) {
      els.bookmarkList.innerHTML = `<div class="empty-state"><strong>No bookmarks yet.</strong><p>Use the star button on any learning block.</p></div>`;
      return;
    }
    els.bookmarkList.innerHTML = state.bookmarks.map((bookmark, index) => {
      const route = content.routes.find(item => item.id === bookmark.route);
      return `<div class="bookmark-item">
        <button type="button" data-open-bookmark="${index}"><strong>${bookmark.title}</strong><small>${route?.title || bookmark.route}</small></button>
        <button type="button" class="icon-button" data-remove-bookmark="${index}" aria-label="Remove bookmark">×</button>
      </div>`;
    }).join("");
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { els.toast.hidden = true; }, 2600);
  }

  function openSidebar() {
    document.body.classList.add("sidebar-open");
    els.scrim.hidden = false;
    els.menu.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    els.scrim.hidden = true;
    els.menu.setAttribute("aria-expanded", "false");
  }

  function searchSite(query) {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) {
      els.searchResults.hidden = true;
      els.searchResults.innerHTML = "";
      return;
    }
    const terms = normalized.split(/\s+/).filter(Boolean);
    const results = content.searchDocs.map(doc => {
      const text = doc.text.toLowerCase();
      const title = doc.title.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 8 : 0) + (text.includes(term) ? 2 : 0), 0);
      return { ...doc, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);

    els.searchResults.innerHTML = results.length ? results.map((result, index) => {
      const lower = result.text.toLowerCase();
      const hit = terms.map(term => lower.indexOf(term)).filter(position => position >= 0).sort((a, b) => a - b)[0] || 0;
      const start = Math.max(0, hit - 55);
      const snippet = `${start ? "…" : ""}${result.text.slice(start, start + 150)}${result.text.length > start + 150 ? "…" : ""}`;
      return `<button type="button" class="search-result" role="option" aria-selected="${index === 0}" data-route="${result.id}"><strong>${result.title}</strong><span>${snippet}</span></button>`;
    }).join("") : `<div class="empty-state">No matching modules.</div>`;
    els.searchResults.hidden = false;
  }

  function initCurrentPage() {
    const initializers = {
      overview: initLesionMap,
      approach: initShuntReasoning,
      asd: initASDTool,
      vsd: initVSDTool,
      pda: initPDATool,
      "pulmonary-stenosis": initPSTool,
      coarctation: initCoarctationTool,
      tof: initTetTool,
      eisenmenger: initEisenmengerTool,
      dtga: initDTGATool,
      dextrocardia: initComparisonTool,
      "reasoning-lab": initReasoningLab,
      flashcards: initFlashcards,
      quiz: initQuiz
    };
    initializers[state.route]?.();
  }

  function initLesionMap() {
    const output = document.getElementById("lesion-output");
    const buttons = [...document.querySelectorAll(".lesion-select")];
    const render = key => {
      const profile = content.lesionProfiles[key];
      if (!profile || !output) return;
      output.innerHTML = `<div class="diagram-card tts-unit"><h3>${profile.name}</h3><p>${profile.family}</p><div class="diagram-wrap">${content.lesionSvg(profile.diagram)}</div>
        <div class="result-grid">
          <div class="result-chip"><span>Connection</span><strong>${profile.connection}</strong></div>
          <div class="result-chip"><span>Flow</span><strong>${profile.flow}</strong></div>
          <div class="result-chip"><span>Pulmonary flow</span><strong>${profile.pulmonary}</strong></div>
          <div class="result-chip"><span>Chamber load</span><strong>${profile.chamber}</strong></div>
        </div>
        <div class="callout info" style="margin-top:12px"><p><strong>Classic clue:</strong> ${profile.clue}</p></div>
        <div class="callout ${profile.cyanosis.includes("Absent") ? "success" : "warning"}" style="margin-top:10px"><p><strong>Cyanosis:</strong> ${profile.cyanosis}</p></div>
      </div>`;
    };
    buttons.forEach(button => button.addEventListener("click", () => {
      buttons.forEach(item => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      render(button.dataset.lesion);
    }));
    render(buttons[0]?.dataset.lesion || "asd");
  }

  function initShuntReasoning() {
    const level = document.getElementById("shunt-level");
    const pressure = document.getElementById("shunt-pressure");
    const pvr = document.getElementById("shunt-pvr");
    const result = document.getElementById("shunt-reasoning-result");
    document.getElementById("run-shunt-reasoning")?.addEventListener("click", () => {
      const levelText = { atrial: "an atrial-level communication", ventricular: "a ventricular-level communication", arterial: "a great-artery communication" }[level.value];
      const phase = { atrial: "mainly because mean LA pressure exceeds RA pressure", ventricular: "during systole when LV pressure exceeds RV pressure", arterial: "through systole and diastole when aortic pressure exceeds pulmonary pressure" }[level.value];
      let direction = "left-to-right";
      if (pressure.value === "equal") direction = "low-gradient or bidirectional";
      if (pressure.value === "right") direction = "right-to-left";
      let safety = "If the shunt is significant and chamber loading is present, closure may be considered after anatomy is defined.";
      let cls = "success";
      if (pvr.value === "borderline") { safety = "Pulmonary vascular resistance needs specialist invasive assessment before closure. A visible defect is not enough."; cls = "warning"; }
      if (pvr.value === "irreversible") { safety = "Established irreversible pulmonary vascular disease makes simple closure unsafe; the communication may decompress the RV."; cls = "danger"; }
      result.innerHTML = `<strong>Structured explanation:</strong> There is ${levelText}. The current pressure relationship produces <strong>${direction}</strong> flow ${phase}. This determines pulmonary blood flow and the volume- or pressure-loaded chambers. <div class="callout ${cls}" style="margin-top:12px"><p><strong>Closure principle:</strong> ${safety}</p></div>`;
    });
    document.getElementById("reset-shunt-reasoning")?.addEventListener("click", () => {
      level.value = "atrial"; pressure.value = "left"; pvr.value = "normal";
      result.textContent = "Choose the anatomy and hemodynamics, then build the explanation.";
    });
  }

  function initASDTool() {
    const result = document.getElementById("asd-result");
    document.getElementById("run-asd")?.addEventListener("click", () => {
      const rv = document.getElementById("asd-rv").value;
      const symptoms = document.getElementById("asd-symptoms").value;
      const pvr = document.getElementById("asd-pvr").value;
      if (pvr === "eisenmenger") {
        result.innerHTML = `<strong>Do not perform simple closure.</strong> Established Eisenmenger physiology is a contraindication because the communication may serve as RV pressure relief. Refer to expert ACHD and pulmonary hypertension care.`;
      } else if (pvr === "uncertain") {
        result.innerHTML = `<strong>Do not decide from the echo image alone.</strong> Elevated or uncertain pulmonary vascular resistance requires specialist hemodynamic assessment before any closure strategy.`;
      } else if (rv === "yes" || symptoms === "yes") {
        result.innerHTML = `<strong>Closure is generally considered</strong> when there is a significant left-to-right shunt causing RA/RV enlargement or attributable symptoms, provided anatomy and pulmonary vascular resistance are suitable.`;
      } else {
        result.innerHTML = `<strong>Observation may be appropriate.</strong> An ASD should not be closed solely because it is visible when there is no important right-heart volume load or attributable symptom.`;
      }
    });
    document.getElementById("run-asd")?.click();
  }

  function initVSDTool() {
    const result = document.getElementById("vsd-result");
    const data = {
      small: { title: "Small restrictive VSD", pressure: "Large LV-to-RV gradient", load: "Little chamber volume load", murmur: "Very loud harsh holosystolic murmur", action: "Usually observation; many muscular defects close spontaneously" },
      moderate: { title: "Moderate VSD", pressure: "Meaningful LV-to-RV gradient", load: "LA/LV volume overload and pulmonary overcirculation", murmur: "Holosystolic murmur; possible mitral flow murmur", action: "Assess symptoms, growth, chamber load, aortic valve, and pulmonary pressure" },
      large: { title: "Large nonrestrictive VSD", pressure: "RV pressure approaches LV pressure", load: "Major pulmonary flow with early pulmonary hypertension", murmur: "May become shorter or softer", action: "Stabilize heart failure and close in time to prevent irreversible pulmonary vascular disease" },
      eisenmenger: { title: "Eisenmenger VSD", pressure: "PVR is systemic or suprasystemic", load: "RV pressure overload and systemic cyanosis", murmur: "Original murmur diminishes; loud P2 dominates", action: "Do not close; expert pulmonary hypertension and ACHD management" }
    };
    const render = key => {
      const item = data[key];
      result.innerHTML = `<strong>${item.title}</strong><div class="result-grid"><div class="result-chip"><span>Pressure</span><strong>${item.pressure}</strong></div><div class="result-chip"><span>Chamber effect</span><strong>${item.load}</strong></div><div class="result-chip"><span>Murmur</span><strong>${item.murmur}</strong></div><div class="result-chip"><span>Principle</span><strong>${item.action}</strong></div></div>`;
    };
    document.querySelectorAll("[data-vsd-state]").forEach(button => button.addEventListener("click", () => {
      document.querySelectorAll("[data-vsd-state]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      render(button.dataset.vsdState);
    }));
    render("small");
  }

  function initPDATool() {
    const result = document.getElementById("pda-result");
    const data = {
      left: ["Ordinary left-to-right PDA", "Aorta-to-pulmonary flow is continuous. Pulmonary flow increases, and the LA/LV become volume-loaded. Cyanosis is absent."],
      large: ["Large PDA with heart failure", "High pulmonary flow causes tachypnea, feeding difficulty, poor growth, congestion, and pulmonary hypertension. Bounding pulses reflect diastolic runoff."],
      reverse: ["Eisenmenger PDA", "Flow reverses from pulmonary artery to descending aorta. Deoxygenated blood enters distal to the left subclavian artery, producing lower-limb differential cyanosis and clubbing."],
      dependent: ["Duct-dependent lesion", "The duct is beneficial and must be kept open with prostaglandin E1 because it supports systemic flow, pulmonary flow, or mixing depending on the lesion."]
    };
    const render = key => { const [title, text] = data[key]; result.innerHTML = `<strong>${title}:</strong> ${text}`; };
    document.querySelectorAll("[data-pda-state]").forEach(button => button.addEventListener("click", () => {
      document.querySelectorAll("[data-pda-state]").forEach(item => item.classList.remove("active"));
      button.classList.add("active"); render(button.dataset.pdaState);
    }));
    render("left");
  }

  function initPSTool() {
    const result = document.getElementById("ps-result");
    document.getElementById("run-ps")?.addEventListener("click", () => {
      const gradient = Number(document.getElementById("ps-gradient").value);
      const effects = document.getElementById("ps-symptoms").value === "yes";
      if (!Number.isFinite(gradient) || gradient < 0) { result.textContent = "Enter a valid non-negative gradient."; return; }
      const severity = gradient < 36 ? "mild" : gradient <= 64 ? "moderate" : "severe";
      const principle = severity === "mild" && !effects
        ? "Periodic echocardiographic observation is typical."
        : "Symptoms, RV pressure/function, valve anatomy, and gradient should be integrated; suitable moderate or severe valvular stenosis is often treated by balloon valvuloplasty.";
      result.innerHTML = `<strong>${gradient.toFixed(0)} mmHg is ${severity} by peak Doppler classification.</strong> ${principle}`;
    });
    document.getElementById("run-ps")?.click();
  }

  function initCoarctationTool() {
    const result = document.getElementById("coa-result");
    document.getElementById("run-coa")?.addEventListener("click", () => {
      const arm = Number(document.getElementById("coa-arm").value);
      const leg = Number(document.getElementById("coa-leg").value);
      const pulse = document.getElementById("coa-femoral").value;
      if (![arm, leg].every(Number.isFinite)) { result.textContent = "Enter valid systolic pressures."; return; }
      const gradient = arm - leg;
      const concerning = gradient >= 20 || pulse !== "normal";
      result.innerHTML = `<strong>Calculated arm-leg systolic difference: ${gradient} mmHg.</strong> ${concerning ? "This pattern is concerning for arch obstruction or residual disease and supports full clinical and imaging assessment." : "The resting difference is not strongly suggestive by itself, but a low gradient cannot exclude repaired coarctation, collateral flow, or exercise hypertension."}`;
    });
    document.getElementById("run-coa")?.click();
  }

  function initTetTool() {
    state.tetSelection = [];
    const steps = [...document.querySelectorAll(".sequence-step")];
    const result = document.getElementById("tet-result");
    const update = () => {
      steps.forEach(step => {
        const position = state.tetSelection.indexOf(Number(step.dataset.step));
        step.classList.toggle("selected", position >= 0);
        step.querySelector("span").textContent = position >= 0 ? position + 1 : "?";
      });
      result.textContent = state.tetSelection.length ? `${state.tetSelection.length} of 6 steps selected.` : "No steps selected yet.";
    };
    steps.forEach(step => step.addEventListener("click", () => {
      const id = Number(step.dataset.step);
      const existing = state.tetSelection.indexOf(id);
      if (existing >= 0) state.tetSelection.splice(existing, 1);
      else if (state.tetSelection.length < 6) state.tetSelection.push(id);
      steps.forEach(item => item.classList.remove("correct", "wrong"));
      update();
    }));
    document.getElementById("check-tet")?.addEventListener("click", () => {
      const correct = [3, 1, 5, 2, 4, 0];
      if (state.tetSelection.length !== 6) { result.textContent = "Select all six steps before checking."; return; }
      const allCorrect = correct.every((value, index) => state.tetSelection[index] === value);
      steps.forEach(step => {
        const selectedPosition = state.tetSelection.indexOf(Number(step.dataset.step));
        step.classList.toggle("correct", correct[selectedPosition] === Number(step.dataset.step));
        step.classList.toggle("wrong", correct[selectedPosition] !== Number(step.dataset.step));
      });
      result.innerHTML = allCorrect
        ? `<strong>Correct.</strong> Calm the child, use knee-chest positioning, support oxygen/airway, give volume if needed, reduce infundibular spasm or raise SVR, and escalate urgently.`
        : `<strong>Review the physiologic order:</strong> calm → knee-chest → oxygen/airway → volume if needed → beta-blockade/raise SVR → urgent congenital cardiology.`;
    });
    document.getElementById("reset-tet")?.addEventListener("click", () => {
      state.tetSelection = [];
      steps.forEach(step => step.classList.remove("correct", "wrong", "selected"));
      update();
    });
    update();
  }

  function initEisenmengerTool() {
    const slider = document.getElementById("pvr-slider");
    const result = document.getElementById("pvr-result");
    const render = () => {
      const value = Number(slider.value);
      let phase;
      if (value < 35) phase = { title: "Low-to-moderate PVR", direction: "Predominantly left-to-right", murmur: "A clear shunt murmur may be present", cyanosis: "Absent", safety: "Closure may be considered if the shunt is significant and anatomy is suitable" };
      else if (value < 70) phase = { title: "Rising PVR", direction: "Lower-gradient or bidirectional", murmur: "The murmur may soften as the gradient narrows", cyanosis: "May emerge with exertion", safety: "Invasive specialist hemodynamic assessment is essential" };
      else phase = { title: "Irreversible pulmonary vascular disease", direction: "Bidirectional or right-to-left", murmur: "The original murmur may be quiet; P2 is loud", cyanosis: "Established systemic cyanosis", safety: "Do not simply close the defect" };
      result.innerHTML = `<strong>${phase.title}</strong><div class="result-grid"><div class="result-chip"><span>Direction</span><strong>${phase.direction}</strong></div><div class="result-chip"><span>Murmur</span><strong>${phase.murmur}</strong></div><div class="result-chip"><span>Cyanosis</span><strong>${phase.cyanosis}</strong></div><div class="result-chip"><span>Closure safety</span><strong>${phase.safety}</strong></div></div>`;
    };
    slider?.addEventListener("input", render);
    render();
  }

  function initDTGATool() {
    const result = document.getElementById("dtga-result");
    document.getElementById("run-dtga")?.addEventListener("click", () => {
      const asd = document.getElementById("dtga-asd").value;
      const vsd = document.getElementById("dtga-vsd").value;
      const pda = document.getElementById("dtga-pda").value;
      let score = asd === "good" ? 4 : asd === "poor" ? 1 : 0;
      score += vsd === "present" ? 2 : 0;
      score += pda === "open" ? 2 : 0;
      let message;
      if (score >= 6) message = "Multiple effective mixing pathways are present, supporting systemic oxygen delivery before definitive repair. Prostaglandin may still be needed to maintain ductal contribution.";
      else if (score >= 3) message = "Mixing is present but may be limited. Continuous neonatal reassessment is essential, and balloon atrial septostomy may be required if atrial mixing is restrictive.";
      else message = "Mixing is critically inadequate. Oxygen alone cannot correct the parallel circuits; maintain ductal patency and urgently improve atrial mixing while preparing definitive repair.";
      result.innerHTML = `<strong>Mixing assessment:</strong> ${message}`;
    });
    document.getElementById("run-dtga")?.click();
  }

  function initComparisonTool() {
    const buttons = [...document.querySelectorAll(".filter-button")];
    const rows = [...document.querySelectorAll("#comparison-table tbody tr")];
    buttons.forEach(button => button.addEventListener("click", () => {
      buttons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      rows.forEach(row => { row.hidden = filter !== "all" && row.dataset.family !== filter; });
    }));
  }

  function initReasoningLab() {
    initMurmurGame();
    initChamberGame();
    const result = document.getElementById("closure-result");
    document.getElementById("run-closure")?.addEventListener("click", () => {
      const shunt = document.getElementById("closure-shunt").value;
      const anatomy = document.getElementById("closure-anatomy").value;
      const pvr = document.getElementById("closure-pvr").value;
      if (pvr === "irreversible") result.innerHTML = `<strong>Unsafe for simple closure.</strong> Irreversible pulmonary vascular disease / Eisenmenger physiology is the dominant contraindication.`;
      else if (pvr === "uncertain") result.innerHTML = `<strong>Pause and measure.</strong> Elevated or uncertain PVR requires expert hemodynamic assessment before closure.`;
      else if (shunt === "no") result.innerHTML = `<strong>No automatic indication.</strong> A visible communication without meaningful chamber loading or attributable symptoms may be observed.`;
      else if (anatomy === "no") result.innerHTML = `<strong>The shunt may be significant, but the proposed closure route is not straightforward.</strong> Define anatomy and consider surgical or advanced congenital options.`;
      else result.innerHTML = `<strong>Principles support considering closure.</strong> The shunt is significant, anatomy is suitable, and pulmonary vascular resistance is acceptable. Final decisions remain lesion- and patient-specific.`;
    });
    document.getElementById("run-closure")?.click();
  }

  function initMurmurGame() {
    const prompt = document.getElementById("murmur-prompt");
    const choices = document.getElementById("murmur-choices");
    const feedback = document.getElementById("murmur-feedback");
    const options = ["ASD", "VSD", "PDA", "Pulmonary stenosis", "Coarctation", "Tetralogy of Fallot", "Eisenmenger syndrome", "d-TGA"];
    const render = () => {
      const item = murmurCases[state.murmurIndex % murmurCases.length];
      prompt.textContent = item.clue;
      feedback.textContent = "Select the best lesion.";
      choices.innerHTML = options.map(option => `<button class="choice-button" type="button" data-murmur-choice="${escapeAttribute(option)}"><span class="choice-letter">${option.slice(0, 1)}</span><span>${option}</span></button>`).join("");
      choices.querySelectorAll("[data-murmur-choice]").forEach(button => button.addEventListener("click", () => {
        const selected = button.dataset.murmurChoice;
        choices.querySelectorAll("button").forEach(candidate => {
          candidate.disabled = true;
          if (candidate.dataset.murmurChoice === item.answer) candidate.classList.add("correct");
        });
        if (selected !== item.answer) button.classList.add("incorrect");
        feedback.innerHTML = `<strong>${selected === item.answer ? "Correct." : `Best answer: ${item.answer}.`}</strong> ${item.why}`;
      }));
    };
    document.getElementById("next-murmur")?.addEventListener("click", () => { state.murmurIndex = (state.murmurIndex + 1) % murmurCases.length; render(); });
    render();
  }

  function initChamberGame() {
    const prompt = document.getElementById("chamber-prompt");
    const choices = document.getElementById("chamber-choices");
    const feedback = document.getElementById("chamber-feedback");
    const render = () => {
      const item = chamberCases[state.chamberIndex % chamberCases.length];
      prompt.textContent = `${item.lesion}: what is the primary chamber response?`;
      feedback.textContent = "Choose the chamber load.";
      choices.innerHTML = item.choices.map((choice, index) => `<button class="choice-button" type="button" data-chamber-choice="${escapeAttribute(choice)}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${choice}</span></button>`).join("");
      choices.querySelectorAll("[data-chamber-choice]").forEach(button => button.addEventListener("click", () => {
        const selected = button.dataset.chamberChoice;
        choices.querySelectorAll("button").forEach(candidate => {
          candidate.disabled = true;
          if (candidate.dataset.chamberChoice === item.answer) candidate.classList.add("correct");
        });
        if (selected !== item.answer) button.classList.add("incorrect");
        feedback.innerHTML = `<strong>${selected === item.answer ? "Correct." : `Best answer: ${item.answer}.`}</strong> ${item.why}`;
      }));
    };
    document.getElementById("next-chamber")?.addEventListener("click", () => { state.chamberIndex = (state.chamberIndex + 1) % chamberCases.length; render(); });
    render();
  }

  function initFlashcards() {
    const grid = document.getElementById("flashcard-grid");
    const render = () => {
      grid.innerHTML = state.flashcards.map((card, index) => `<button type="button" class="flashcard" data-flashcard="${index}" aria-pressed="false" aria-label="Flashcard ${index + 1}: ${escapeAttribute(card.q)}. Activate to reveal answer.">
        <span class="flashcard-inner">
          <span class="flashcard-face flashcard-front"><span><span class="flashcard-kicker">${card.tag}</span><h3>${card.q}</h3></span><span class="flashcard-hint">Click or press Enter to reveal →</span></span>
          <span class="flashcard-face flashcard-back"><span><span class="flashcard-kicker">Answer</span><h3>${card.a}</h3></span><span class="flashcard-hint">Click again to return ←</span></span>
        </span>
      </button>`).join("");
      updateFlashcardCount();
    };
    grid.addEventListener("click", event => {
      const card = event.target.closest(".flashcard");
      if (!card) return;
      card.classList.toggle("is-flipped");
      const flipped = card.classList.contains("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
      card.setAttribute("aria-label", flipped ? "Answer revealed. Activate to return to question." : "Question shown. Activate to reveal answer.");
      updateFlashcardCount();
    });
    document.getElementById("shuffle-flashcards")?.addEventListener("click", () => {
      state.flashcards = [...state.flashcards].sort(() => Math.random() - 0.5);
      render();
      showToast("Flashcards shuffled.");
    });
    document.getElementById("reset-flashcards")?.addEventListener("click", () => {
      state.flashcards = [...content.flashcards];
      render();
    });
    document.getElementById("flip-all-flashcards")?.addEventListener("click", () => {
      grid.querySelectorAll(".flashcard").forEach(card => { card.classList.add("is-flipped"); card.setAttribute("aria-pressed", "true"); });
      updateFlashcardCount();
    });
    render();
  }

  function updateFlashcardCount() {
    const count = document.querySelectorAll(".flashcard.is-flipped").length;
    const label = document.getElementById("flipped-count");
    if (label) label.textContent = count;
  }

  function initQuiz() {
    state.quiz = { index: 0, score: 0, answered: false };
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const container = document.getElementById("quiz-container");
    if (!container) return;
    const total = content.quiz.length;
    if (state.quiz.index >= total) {
      const percent = Math.round((state.quiz.score / total) * 100);
      container.innerHTML = `<div class="quiz-card"><div class="score-ring" style="--score:${percent}%"><strong>${state.quiz.score}/${total}</strong></div><h3 style="text-align:center">Quiz complete</h3><p style="text-align:center;color:var(--muted)">${percent >= 80 ? "Strong physiology-based performance." : percent >= 60 ? "Good foundation. Review the explanations for missed cases." : "Revisit the lesion map and comparison module, then retry."}</p><div class="tool-actions" style="justify-content:center"><button class="primary-button" id="restart-quiz" type="button">Restart quiz</button><button class="secondary-button" data-route="reasoning-lab" type="button">Open reasoning lab</button></div></div>`;
      document.getElementById("restart-quiz")?.addEventListener("click", initQuiz);
      return;
    }
    const item = content.quiz[state.quiz.index];
    container.innerHTML = `<div class="quiz-card">
      <div class="quiz-meta"><span>Question ${state.quiz.index + 1} of ${total}</span><strong>Score: ${state.quiz.score}</strong></div>
      <h3>${item.q}</h3>
      <div class="choice-list">${item.choices.map((choice, index) => `<button class="choice-button" type="button" data-quiz-choice="${index}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${choice}</span></button>`).join("")}</div>
      <div class="quiz-feedback" id="quiz-feedback" hidden></div>
      <div class="quiz-footer"><span></span><button class="primary-button" id="next-quiz" type="button" hidden>${state.quiz.index === total - 1 ? "See score" : "Next question"}</button></div>
    </div>`;
    container.querySelectorAll("[data-quiz-choice]").forEach(button => button.addEventListener("click", () => {
      if (state.quiz.answered) return;
      state.quiz.answered = true;
      const selected = Number(button.dataset.quizChoice);
      const correct = selected === item.answer;
      if (correct) state.quiz.score += 1;
      container.querySelectorAll("[data-quiz-choice]").forEach(candidate => {
        candidate.disabled = true;
        const index = Number(candidate.dataset.quizChoice);
        if (index === item.answer) candidate.classList.add("correct");
        else if (index === selected) candidate.classList.add("incorrect");
      });
      const feedback = document.getElementById("quiz-feedback");
      feedback.hidden = false;
      feedback.innerHTML = `<strong>${correct ? "Correct." : `Best answer: ${String.fromCharCode(65 + item.answer)}.`}</strong> ${item.explanation}`;
      const next = document.getElementById("next-quiz");
      next.hidden = false;
      container.querySelector(".quiz-meta strong").textContent = `Score: ${state.quiz.score}`;
    }));
    document.getElementById("next-quiz")?.addEventListener("click", () => {
      state.quiz.index += 1;
      state.quiz.answered = false;
      renderQuizQuestion();
    });
  }

  function handleRouteClick(event) {
    const routeTarget = event.target.closest("[data-route]");
    if (!routeTarget) return false;
    event.preventDefault();
    els.searchResults.hidden = true;
    els.search.value = "";
    navigate(routeTarget.dataset.route);
    return true;
  }

  renderNav();
  loadVoices();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = loadVoices;

  els.menu.addEventListener("click", openSidebar);
  els.closeSidebar.addEventListener("click", closeSidebar);
  els.scrim.addEventListener("click", closeSidebar);
  els.nav.addEventListener("click", handleRouteClick);
  els.app.addEventListener("click", event => {
    if (handleRouteClick(event)) return;
    const listen = event.target.closest("[data-listen-unit]");
    if (listen) { speakUnit(listen.dataset.listenUnit); return; }
    const bookmark = event.target.closest("[data-bookmark-unit]");
    if (bookmark) { toggleBookmark(bookmark); }
  });
  document.querySelector(".site-footer")?.addEventListener("click", handleRouteClick);

  els.stopSpeech.addEventListener("click", () => {
    window.speechSynthesis?.cancel();
    document.querySelectorAll("[data-listen-unit]").forEach(button => { button.textContent = "▶ Listen"; });
  });
  els.speechRate.value = localStorage.getItem(KEYS.rate) || "0.92";
  els.speechRate.addEventListener("change", () => {
    try { localStorage.setItem(KEYS.rate, els.speechRate.value); } catch { /* ignore */ }
  });
  els.print.addEventListener("click", () => window.print());

  els.resetProgress.addEventListener("click", () => {
    state.visited = new Set([state.route]);
    writeJSON(KEYS.visited, [...state.visited]);
    updateNavigation();
    showToast("Visited progress reset.");
  });

  els.clearBookmarks.addEventListener("click", () => {
    state.bookmarks = [];
    writeJSON(KEYS.bookmarks, []);
    document.querySelectorAll(".bookmark-button").forEach(button => button.classList.remove("is-bookmarked"));
    renderBookmarks();
    showToast("Bookmarks cleared.");
  });

  els.bookmarksButton.addEventListener("click", () => {
    renderBookmarks();
    if (typeof els.bookmarkDialog.showModal === "function") els.bookmarkDialog.showModal();
    else els.bookmarkDialog.setAttribute("open", "");
  });
  els.closeBookmarks.addEventListener("click", () => els.bookmarkDialog.close());
  els.bookmarkDialog.addEventListener("click", event => {
    const open = event.target.closest("[data-open-bookmark]");
    if (open) {
      const bookmark = state.bookmarks[Number(open.dataset.openBookmark)];
      els.bookmarkDialog.close();
      if (bookmark) navigate(bookmark.route, { targetUnit: bookmark.unitId });
      return;
    }
    const remove = event.target.closest("[data-remove-bookmark]");
    if (remove) {
      state.bookmarks.splice(Number(remove.dataset.removeBookmark), 1);
      writeJSON(KEYS.bookmarks, state.bookmarks);
      renderBookmarks();
    }
  });

  els.search.addEventListener("input", () => searchSite(els.search.value));
  els.search.addEventListener("keydown", event => {
    const results = [...els.searchResults.querySelectorAll(".search-result")];
    const current = results.findIndex(result => result.getAttribute("aria-selected") === "true");
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      const next = (current + 1) % results.length;
      results.forEach((result, index) => result.setAttribute("aria-selected", String(index === next)));
      results[next].scrollIntoView({ block: "nearest" });
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      const next = (current - 1 + results.length) % results.length;
      results.forEach((result, index) => result.setAttribute("aria-selected", String(index === next)));
      results[next].scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && results.length) {
      event.preventDefault();
      const selected = results[Math.max(0, current)];
      if (selected) navigate(selected.dataset.route);
      els.search.value = "";
      els.searchResults.hidden = true;
    } else if (event.key === "Escape") {
      els.searchResults.hidden = true;
      els.search.blur();
    }
  });
  els.searchResults.addEventListener("click", handleRouteClick);

  document.addEventListener("keydown", event => {
    if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      event.preventDefault();
      els.search.focus();
    }
    if (event.key === "Escape") {
      closeSidebar();
      els.searchResults.hidden = true;
      if (els.bookmarkDialog.open) els.bookmarkDialog.close();
      window.speechSynthesis?.cancel();
    }
  });

  window.addEventListener("popstate", () => navigate(routeFromHash(), { preserveScroll: false, focus: false }));
  navigate(routeFromHash(), { focus: false });
})();
