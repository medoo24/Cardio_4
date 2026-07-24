/* Congenital Heart Lab: structured content and data. */
(() => {
  "use strict";

  const routes = [
    { id: "overview", group: "Foundations", title: "Overview & physiology map", short: "Overview", subtitle: "A physiology-first map of congenital heart disease" },
    { id: "approach", group: "Foundations", title: "Clinical approach & investigations", short: "Clinical approach", subtitle: "Red flags, shunt reasoning, examination, and imaging" },
    { id: "asd", group: "Acyanotic shunts", title: "Atrial septal defect", short: "ASD", subtitle: "Types, fixed splitting, RV volume load, and closure" },
    { id: "vsd", group: "Acyanotic shunts", title: "Ventricular septal defect", short: "VSD", subtitle: "Restrictive versus nonrestrictive physiology" },
    { id: "pda", group: "Acyanotic shunts", title: "Patent ductus arteriosus", short: "PDA", subtitle: "Continuous shunt, bounding pulse, and differential cyanosis" },
    { id: "pulmonary-stenosis", group: "Obstructive lesions", title: "Pulmonary stenosis", short: "Pulmonary stenosis", subtitle: "RV pressure load, ejection click, and Doppler severity" },
    { id: "coarctation", group: "Obstructive lesions", title: "Coarctation of the aorta", short: "Coarctation", subtitle: "Arm-leg gradient, femoral delay, repair, and surveillance" },
    { id: "tof", group: "Cyanotic lesions", title: "Tetralogy of Fallot", short: "Tetralogy of Fallot", subtitle: "Four components, cyanosis, tet spells, and late care" },
    { id: "eisenmenger", group: "Cyanotic lesions", title: "Eisenmenger syndrome", short: "Eisenmenger", subtitle: "Pulmonary vascular remodeling and shunt reversal" },
    { id: "dtga", group: "Cyanotic lesions", title: "d-TGA & related lesions", short: "d-TGA", subtitle: "Parallel circulation, mixing, and neonatal stabilization" },
    { id: "dextrocardia", group: "Integration", title: "Dextrocardia & comparison", short: "Dextrocardia + comparison", subtitle: "Situs language, ECG caution, and lesion matrix" },
    { id: "reasoning-lab", group: "Revision lab", title: "Interactive reasoning lab", short: "Reasoning lab", subtitle: "Murmurs, chamber load, gradients, and closure safety" },
    { id: "flashcards", group: "Revision lab", title: "Active-recall flashcards", short: "Flashcards", subtitle: "Click or press Enter to flip every card" },
    { id: "quiz", group: "Revision lab", title: "Clinical case quiz", short: "Clinical quiz", subtitle: "Exam-style cases with immediate explanations" },
    { id: "sources", group: "Reference", title: "Sources, scope & limitations", short: "Sources", subtitle: "Original chapter, guideline anchors, and educational scope" }
  ];

  const lesionProfiles = {
    asd: {
      name: "Atrial septal defect",
      family: "Left-to-right shunt",
      connection: "Atrial level",
      flow: "LA → RA during most of the cardiac cycle",
      pulmonary: "Increased",
      chamber: "RA and RV volume overload",
      cyanosis: "Absent unless advanced pulmonary vascular disease causes reversal",
      clue: "Wide, fixed splitting of S2 with a pulmonary flow murmur",
      diagram: "asd"
    },
    vsd: {
      name: "Ventricular septal defect",
      family: "Left-to-right shunt",
      connection: "Ventricular level",
      flow: "LV → RV during systole when the defect is restrictive",
      pulmonary: "Increased in moderate or large defects",
      chamber: "LA/LV volume overload; RV pressure load if large",
      cyanosis: "Absent before shunt reversal",
      clue: "Harsh holosystolic murmur; a small VSD may be louder than a large one",
      diagram: "vsd"
    },
    pda: {
      name: "Patent ductus arteriosus",
      family: "Great-artery left-to-right shunt",
      connection: "Aorta to pulmonary artery",
      flow: "Aorta → pulmonary artery in systole and diastole",
      pulmonary: "Increased",
      chamber: "LA and LV volume overload",
      cyanosis: "Differential lower-limb cyanosis after Eisenmenger reversal",
      clue: "Continuous infraclavicular machinery murmur with bounding pulse",
      diagram: "pda"
    },
    ps: {
      name: "Pulmonary stenosis",
      family: "Right-sided obstruction",
      connection: "RV outflow tract / pulmonary valve",
      flow: "Forward flow is obstructed rather than shunted",
      pulmonary: "Usually normal; reduced when severe",
      chamber: "RV pressure overload and hypertrophy",
      cyanosis: "Possible in critical obstruction with right-to-left atrial shunting",
      clue: "Ejection click, harsh systolic ejection murmur, soft delayed P2",
      diagram: "ps"
    },
    coa: {
      name: "Coarctation of the aorta",
      family: "Left-sided obstruction",
      connection: "Aortic arch near the ductal insertion",
      flow: "Systemic outflow to the lower body is obstructed",
      pulmonary: "Usually normal",
      chamber: "LV pressure overload",
      cyanosis: "Not typical in older patients; critical neonates may be duct-dependent",
      clue: "Arm hypertension, weak or delayed femorals, and a back murmur",
      diagram: "coa"
    },
    tof: {
      name: "Tetralogy of Fallot",
      family: "Cyanotic lesion with reduced pulmonary flow",
      connection: "Large VSD plus RV outflow obstruction",
      flow: "RV → aorta through the VSD when RVOT obstruction is important",
      pulmonary: "Reduced",
      chamber: "RV pressure overload and hypertrophy",
      cyanosis: "Variable; governed mainly by severity of RVOT obstruction",
      clue: "Single S2, RVOT ejection murmur, cyanosis, possible tet spells",
      diagram: "tof"
    },
    eisenmenger: {
      name: "Eisenmenger syndrome",
      family: "Pulmonary vascular disease with shunt reversal",
      connection: "A previous large systemic-to-pulmonary communication",
      flow: "Bidirectional or right-to-left after PVR becomes systemic",
      pulmonary: "Pulmonary vascular disease rather than simple overcirculation",
      chamber: "RV pressure overload with systemic cyanosis",
      cyanosis: "Established systemic desaturation and often clubbing",
      clue: "Loud P2; the original shunt murmur may become quieter",
      diagram: "eisenmenger"
    },
    dtga: {
      name: "d-Transposition of the great arteries",
      family: "Parallel circulation / mixing-dependent lesion",
      connection: "Aorta from RV; pulmonary artery from LV",
      flow: "Two parallel loops; survival requires ASD, VSD, PDA, or combined mixing",
      pulmonary: "Variable",
      chamber: "Depends on associated anatomy and repair",
      cyanosis: "Severe neonatal cyanosis, often disproportionate to respiratory distress",
      clue: "Profound early cyanosis that oxygen alone cannot correct when mixing is inadequate",
      diagram: "dtga"
    }
  };

  const flashcards = [
    { tag: "Core framework", q: "What four physiologic groups organize congenital heart disease?", a: "Left-to-right shunts, obstructive lesions, cyanotic lesions with reduced pulmonary flow, and parallel or mixing-dependent circulations. Pulmonary vascular disease with reversal is a later physiologic state." },
    { tag: "ASD", q: "Which chambers enlarge in an isolated significant ASD?", a: "The right atrium and right ventricle become volume-loaded. The left ventricle is not the primary enlarged chamber." },
    { tag: "ASD", q: "Why is S2 widely and fixedly split in ASD?", a: "RV ejection is prolonged, and respiratory changes in systemic venous return are partly offset by reciprocal changes in left-to-right shunt flow." },
    { tag: "VSD", q: "Why can a small VSD be louder than a large VSD?", a: "A small restrictive defect maintains a large LV-to-RV pressure gradient, producing high-velocity turbulent flow. A large nonrestrictive defect equalizes pressures and may have a softer murmur." },
    { tag: "PDA", q: "Why is the classic PDA murmur continuous?", a: "Aortic pressure exceeds pulmonary artery pressure in both systole and diastole, so flow persists throughout the cardiac cycle." },
    { tag: "PDA", q: "What causes bounding pulses and a wide pulse pressure in PDA?", a: "High stroke volume plus diastolic runoff from the aorta into the pulmonary artery lowers diastolic pressure." },
    { tag: "Pulmonary stenosis", q: "What Doppler peak gradients classify valvular pulmonary stenosis?", a: "Mild is below 36 mmHg, moderate is 36–64 mmHg, and severe is above 64 mmHg. Clinical decisions also use symptoms, anatomy, and RV effects." },
    { tag: "Coarctation", q: "What bedside pulse sign is classic for coarctation?", a: "Weak or delayed femoral pulses with radiofemoral delay. Compare brachial and femoral pulses together." },
    { tag: "Coarctation", q: "Why does a low resting arm-leg gradient not exclude important repaired coarctation?", a: "Collateral flow, altered arch geometry, and exercise-induced hypertension may conceal residual obstruction at rest." },
    { tag: "TOF", q: "Which TOF component mainly determines cyanosis?", a: "The severity of right ventricular outflow tract obstruction determines pulmonary blood flow and the amount of right-to-left shunting." },
    { tag: "TOF", q: "What are the immediate physiologic goals during a hypercyanotic spell?", a: "Increase systemic vascular resistance, reduce infundibular spasm, improve preload, and restore pulmonary blood flow." },
    { tag: "Eisenmenger", q: "Why must the original shunt not simply be closed in established Eisenmenger physiology?", a: "The pulmonary vascular disease is irreversible, and the communication may act as a pressure-relief pathway for the right ventricle. Closure can precipitate RV failure." },
    { tag: "Eisenmenger", q: "Is secondary erythrocytosis automatically treated by phlebotomy?", a: "No. It is adaptive. First exclude dehydration and iron deficiency; phlebotomy is reserved for selected severe hyperviscosity symptoms." },
    { tag: "d-TGA", q: "Why is d-TGA called a parallel circulation?", a: "The aorta arises from the RV and returns systemic venous blood to the body, while the pulmonary artery arises from the LV and recirculates pulmonary venous blood to the lungs." },
    { tag: "d-TGA", q: "What two urgent strategies improve survival in d-TGA before repair?", a: "Prostaglandin E1 maintains ductal patency, and balloon atrial septostomy improves atrial-level mixing when it is inadequate." },
    { tag: "Dextrocardia", q: "How does dextroposition differ from dextrocardia?", a: "Dextroposition is displacement of the heart to the right without true mirror-image apex and chamber orientation; dextrocardia means the cardiac apex points right." },
    { tag: "Examination", q: "Which heart sound should you characterize before concentrating on the murmur?", a: "S2. Fixed splitting, a single S2, a loud P2, or a soft/delayed P2 can quickly narrow the lesion." },
    { tag: "Lifelong care", q: "Why is childhood repair not always a cure?", a: "Residual shunts, valve disease, ventricular dysfunction, aortopathy, arrhythmia, pulmonary hypertension, pregnancy risk, and reintervention may emerge decades later." }
  ];

  const quiz = [
    {
      q: "A 28-year-old has exertional dyspnea, a right ventricular heave, a pulmonary flow murmur, and wide fixed splitting of S2. Which chamber pattern is most likely?",
      choices: ["LA and LV pressure overload", "RA and RV volume overload", "Isolated LV volume overload", "Biatrial pressure overload"],
      answer: 1,
      explanation: "A significant ASD produces left-to-right flow at atrial level, causing RA and RV volume overload and increased pulmonary flow."
    },
    {
      q: "An infant has a very loud harsh holosystolic murmur and a small restrictive VSD on echocardiography. Why is the murmur loud?",
      choices: ["The defect has no pressure gradient", "Pulmonary vascular resistance is suprasystemic", "A large LV-to-RV gradient creates high-velocity turbulence", "The murmur is generated across the pulmonary valve"],
      answer: 2,
      explanation: "Restrictive VSDs preserve a large pressure gradient. Loudness does not reliably indicate defect size."
    },
    {
      q: "A child has bounding pulses, a wide pulse pressure, and a continuous murmur below the left clavicle. Which chamber load is expected?",
      choices: ["RA/RV volume overload", "LA/LV volume overload", "Isolated RV pressure overload", "Isolated LV pressure overload"],
      answer: 1,
      explanation: "PDA sends continuous aortic blood to the pulmonary artery, increasing pulmonary venous return and loading the LA and LV."
    },
    {
      q: "A Doppler peak gradient across a valvular pulmonary stenosis is 72 mmHg. How is this usually classified?",
      choices: ["Mild", "Moderate", "Severe", "Not classifiable without catheterization"],
      answer: 2,
      explanation: "A peak gradient above 64 mmHg is severe, although symptoms, RV pressure/function, and anatomy guide intervention."
    },
    {
      q: "A neonate with critical coarctation becomes shocked as the ductus closes. What immediate physiologic action is required?",
      choices: ["Close the ductus with a cyclooxygenase inhibitor", "Maintain ductal patency with prostaglandin E1", "Perform routine exercise testing", "Give an AV nodal blocker"],
      answer: 1,
      explanation: "Critical neonatal coarctation may be a duct-dependent systemic circulation. Prostaglandin supports lower-body perfusion while urgent repair is arranged."
    },
    {
      q: "Which component of tetralogy of Fallot is the main determinant of cyanosis?",
      choices: ["Right ventricular hypertrophy", "The overriding aorta alone", "Severity of RV outflow tract obstruction", "The presence of a loud murmur"],
      answer: 2,
      explanation: "RVOT obstruction controls pulmonary blood flow and the extent of right-to-left shunting through the large VSD."
    },
    {
      q: "During a hypercyanotic spell, which action directly helps raise systemic vascular resistance?",
      choices: ["Knee-chest positioning", "Routine phlebotomy", "Closing the VSD immediately at bedside", "Reducing preload"],
      answer: 0,
      explanation: "Knee-chest positioning raises systemic vascular resistance and can reduce right-to-left shunting while definitive emergency care proceeds."
    },
    {
      q: "A patient with a long-standing large VSD develops cyanosis, loud P2, and a quieter original murmur. What is the best interpretation?",
      choices: ["The VSD has spontaneously closed", "The disease has improved", "Pulmonary vascular resistance has risen and the gradient has narrowed", "This proves isolated left ventricular failure"],
      answer: 2,
      explanation: "In Eisenmenger physiology, rising pulmonary pressure narrows the shunt gradient. A softer murmur can mean worse disease."
    },
    {
      q: "Why is oxygen alone often insufficient in profoundly cyanosed d-TGA?",
      choices: ["There is always severe pulmonary edema", "The pulmonary and systemic circuits are parallel and inadequate mixing persists", "The ductus is always closed", "The LV cannot eject"],
      answer: 1,
      explanation: "Oxygen cannot correct the fundamental separation of the two circuits. Survival requires adequate mixing."
    },
    {
      q: "Which statement about secundum ASD is most accurate?",
      choices: ["It always requires surgery", "It is usually closed with a catheter device when anatomy is suitable", "It is a form of patent foramen ovale", "It primarily causes LV pressure overload"],
      answer: 1,
      explanation: "Secundum ASD is the common true ASD and is often suitable for transcatheter device closure when rims and size are appropriate."
    },
    {
      q: "Which VSD feature may justify closure even when the shunt is not very large?",
      choices: ["Aortic cusp prolapse with progressive aortic regurgitation", "A quiet murmur in a healthy child", "A normal pulmonary pressure", "A muscular location alone"],
      answer: 0,
      explanation: "Progressive aortic cusp prolapse and regurgitation can worsen, so valve protection may become an indication for closure."
    },
    {
      q: "An adult has rightward cardiac displacement after left lung volume loss, but the apex and chambers are not mirror-imaged. What is the correct term?",
      choices: ["Situs inversus totalis", "Dextrocardia", "Dextroposition", "Heterotaxy"],
      answer: 2,
      explanation: "Dextroposition is displacement caused by extracardiac anatomy; it is not true dextrocardia."
    },
    {
      q: "Which finding most strongly suggests coarctation during bedside examination?",
      choices: ["Fixed splitting of S2", "Bounding femoral pulses", "Upper-limb hypertension with delayed femoral pulses", "A continuous machinery murmur alone"],
      answer: 2,
      explanation: "The arm-leg pressure difference and radiofemoral delay are core bedside clues."
    },
    {
      q: "Which statement about infective endocarditis prophylaxis is correct for congenital heart disease?",
      choices: ["Every congenital lesion requires prophylaxis for all procedures", "Routine prophylaxis is limited to highest-risk categories and specified dental procedures", "Only ASD requires prophylaxis", "Good oral hygiene is unimportant"],
      answer: 1,
      explanation: "Modern practice does not recommend routine prophylaxis for most uncomplicated CHD; oral hygiene remains central."
    },
    {
      q: "A repaired TOF patient is well in adulthood. Which follow-up principle is correct?",
      choices: ["No further review is needed", "Only blood pressure is monitored", "Lifelong ACHD surveillance is required for RV size/function, pulmonary regurgitation, arrhythmia, and other late complications", "CMR has no role"],
      answer: 2,
      explanation: "Repaired TOF has important late risks, including pulmonary regurgitation, RV dilation, ventricular arrhythmia, and sudden death risk."
    }
  ];

  const esc = value => String(value).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  function hero({ eyebrow, title, intro, chips = [], visual = "heart" }) {
    return `<section class="hero tts-unit" data-bookmark-title="${esc(title)}" data-tts-label="${esc(title)}">
      <div class="hero-copy">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="lead">${intro}</p>
        <div class="chip-row">${chips.map(chip => `<span class="chip">${chip}</span>`).join("")}</div>
      </div>
      <div class="hero-visual" aria-hidden="true">${heroSvg(visual)}</div>
    </section>`;
  }

  function heroSvg(type) {
    if (type === "parallel") {
      return `<svg viewBox="0 0 420 300" role="img">
        <defs><marker id="a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#a7efe8"/></marker></defs>
        <rect x="25" y="34" width="150" height="230" rx="70" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.22)"/>
        <rect x="245" y="34" width="150" height="230" rx="70" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.22)"/>
        <circle cx="100" cy="92" r="34" fill="#0a6f90" stroke="#c9f7f0" stroke-width="3"/><circle cx="100" cy="205" r="40" fill="#0b5275" stroke="#c9f7f0" stroke-width="3"/>
        <circle cx="320" cy="92" r="34" fill="#b94c5a" stroke="#ffe6ea" stroke-width="3"/><circle cx="320" cy="205" r="40" fill="#a33b49" stroke="#ffe6ea" stroke-width="3"/>
        <path d="M100 58 C55 20 50 250 100 245" fill="none" stroke="#a7efe8" stroke-width="5" marker-end="url(#a1)"/>
        <path d="M320 58 C365 20 370 250 320 245" fill="none" stroke="#ffd2d8" stroke-width="5" marker-end="url(#a1)"/>
        <path d="M140 148 C188 126 232 126 280 148" fill="none" stroke="#f4d98c" stroke-width="4" stroke-dasharray="9 7"/>
        <text x="100" y="97" text-anchor="middle" fill="#fff" font-size="16" font-weight="800">RV</text><text x="100" y="211" text-anchor="middle" fill="#fff" font-size="16" font-weight="800">Body</text>
        <text x="320" y="97" text-anchor="middle" fill="#fff" font-size="16" font-weight="800">LV</text><text x="320" y="211" text-anchor="middle" fill="#fff" font-size="16" font-weight="800">Lungs</text>
        <text x="210" y="118" text-anchor="middle" fill="#f7e6a8" font-size="13" font-weight="800">Mixing is essential</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 410 310" role="img">
      <defs>
        <linearGradient id="hgrad" x1="0" x2="1"><stop offset="0" stop-color="#0d6d8c"/><stop offset=".52" stop-color="#0b5575"/><stop offset=".53" stop-color="#a13c4c"/><stop offset="1" stop-color="#c25b66"/></linearGradient>
        <marker id="heroArrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L8,3.5 z" fill="#bdf4eb"/></marker>
      </defs>
      <path d="M205 274C118 220 65 166 65 95c0-43 32-73 73-73 29 0 53 16 67 42 14-26 39-42 68-42 41 0 72 30 72 73 0 71-53 125-140 179Z" fill="url(#hgrad)" stroke="rgba(255,255,255,.75)" stroke-width="4"/>
      <path d="M205 66v176" stroke="rgba(255,255,255,.44)" stroke-width="4"/>
      <path d="M102 120 C145 98 163 90 193 86" fill="none" stroke="#bdf4eb" stroke-width="5" stroke-linecap="round" marker-end="url(#heroArrow)" class="flow-arrow"/>
      <path d="M310 136 C274 154 253 169 220 186" fill="none" stroke="#ffe2e6" stroke-width="5" stroke-linecap="round" marker-end="url(#heroArrow)" class="flow-arrow"/>
      <circle cx="147" cy="116" r="9" fill="#bdf4eb"/><circle cx="265" cy="153" r="9" fill="#ffe2e6"/>
      <text x="105" y="80" fill="#d9f7fa" font-size="13" font-weight="800">Flow</text>
      <text x="270" y="84" fill="#ffe9ec" font-size="13" font-weight="800">Pressure</text>
      <text x="205" y="297" text-anchor="middle" fill="#e4f8fa" font-size="13" font-weight="800">Anatomy → physiology → examination → intervention</text>
    </svg>`;
  }

  function sectionHeading(title, text, label = "Key concepts") {
    return `<div class="section-heading"><div><p class="eyebrow">${label}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div><span class="section-label">${label}</span></div>`;
  }

  function section(title, text, body, label = "Key concepts") {
    return `<section class="section-block">${sectionHeading(title, text, label)}${body}</section>`;
  }

  function card(title, body, accent = "", icon = "•") {
    return `<article class="card ${accent} tts-unit" data-bookmark-title="${esc(title)}" data-tts-label="${esc(title)}"><span class="card-icon" aria-hidden="true">${icon}</span><h3>${title}</h3>${body}</article>`;
  }

  function callout(kind, title, body) {
    return `<aside class="callout ${kind} tts-unit" data-bookmark-title="${esc(title)}" data-tts-label="${esc(title)}"><p><strong>${title}</strong> ${body}</p></aside>`;
  }

  function table(headers, rows, caption) {
    return `<div class="table-card tts-unit" data-bookmark-title="${esc(caption)}" data-tts-label="${esc(caption)}"><div class="table-scroll"><table><caption>${caption}</caption><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  }

  function flow(items) {
    return `<div class="flow-chain" style="--flow-count:${items.length}">${items.map(item => `<div class="flow-node tts-unit" data-bookmark-title="${esc(item[0])}" data-tts-label="${esc(item[0])}">${item[0]}<small>${item[1]}</small></div>`).join("")}</div>`;
  }

  function lesionSvg(type) {
    const profiles = {
      asd: { title: "Atrial-level shunt", arrow: "M194 96 C215 77 241 78 263 98", chamber1: "RA", chamber2: "LA", note: "LA → RA", color: "#128b91" },
      vsd: { title: "Ventricular-level shunt", arrow: "M188 198 C216 176 247 176 272 198", chamber1: "RV", chamber2: "LV", note: "LV → RV", color: "#128b91" },
      pda: { title: "Continuous great-artery shunt", arrow: "M265 45 C315 68 317 105 286 125", chamber1: "PA", chamber2: "Aorta", note: "Aorta → PA", color: "#128b91" },
      ps: { title: "RV outflow obstruction", arrow: "M184 153 C175 105 183 73 207 42", chamber1: "RV", chamber2: "PA", note: "Pressure load", color: "#a96512" },
      coa: { title: "Aortic arch obstruction", arrow: "M258 42 C310 65 322 116 306 152", chamber1: "LV", chamber2: "Aorta", note: "Upper > lower BP", color: "#a96512" },
      tof: { title: "Reduced pulmonary flow", arrow: "M184 198 C219 163 243 154 284 128", chamber1: "RV", chamber2: "Aorta", note: "R → L across VSD", color: "#a33b49" },
      eisenmenger: { title: "Reversed shunt", arrow: "M272 198 C241 177 216 177 188 198", chamber1: "RV", chamber2: "LV", note: "R → L", color: "#a33b49" },
      dtga: { title: "Parallel circulation", arrow: "M164 185 C120 130 128 66 170 40 M285 40 C332 70 337 137 291 188", chamber1: "RV → Aorta", chamber2: "LV → PA", note: "Mixing required", color: "#6750a4" }
    };
    const p = profiles[type] || profiles.asd;
    return `<svg viewBox="0 0 460 310" role="img" aria-label="${p.title}">
      <defs><marker id="lesionArrow-${type}" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L8,3.5 z" fill="${p.color}"/></marker></defs>
      <rect x="18" y="18" width="424" height="274" rx="24" fill="#f8fbfc" stroke="#d6e3e9"/>
      <path d="M230 268C157 225 112 180 112 117c0-37 27-63 63-63 24 0 44 12 55 34 12-22 32-34 56-34 36 0 63 26 63 63 0 63-46 108-119 151Z" fill="#fff" stroke="#9dbac7" stroke-width="3"/>
      <path d="M230 88v151" stroke="#b7ccd5" stroke-width="3"/>
      <path d="M132 154h196" stroke="#b7ccd5" stroke-width="3"/>
      <text x="173" y="127" text-anchor="middle" class="svg-label">RA</text><text x="286" y="127" text-anchor="middle" class="svg-label">LA</text>
      <text x="173" y="206" text-anchor="middle" class="svg-label">RV</text><text x="286" y="206" text-anchor="middle" class="svg-label">LV</text>
      <path d="M175 58 C168 26 185 16 205 45" fill="none" stroke="#0e6b8e" stroke-width="13" stroke-linecap="round"/>
      <path d="M285 58 C293 27 277 15 255 45" fill="none" stroke="#b34958" stroke-width="13" stroke-linecap="round"/>
      <path d="${p.arrow}" fill="none" stroke="${p.color}" stroke-width="7" stroke-linecap="round" marker-end="url(#lesionArrow-${type})" class="flow-arrow"/>
      <rect x="42" y="34" width="122" height="34" rx="11" fill="#eaf3fb"/><text x="103" y="56" text-anchor="middle" class="svg-label">${p.chamber1}</text>
      <rect x="296" y="34" width="122" height="34" rx="11" fill="#fbecef"/><text x="357" y="56" text-anchor="middle" class="svg-label">${p.chamber2}</text>
      <text x="230" y="281" text-anchor="middle" font-size="14" font-weight="850" fill="${p.color}">${p.note}</text>
    </svg>`;
  }

  function page(id, html) {
    const index = routes.findIndex(route => route.id === id);
    const previous = routes[index - 1];
    const next = routes[index + 1];
    return `${html}<nav class="module-nav" aria-label="Module navigation">
      ${previous ? `<button type="button" data-route="${previous.id}"><span>← Previous</span><strong>${previous.title}</strong></button>` : `<span></span>`}
      ${next ? `<button type="button" data-route="${next.id}"><span>Next →</span><strong>${next.title}</strong></button>` : `<span></span>`}
    </nav>`;
  }

  function overviewPage() {
    return page("overview", `
      ${hero({
        eyebrow: "Module 01 · Physiology-first map",
        title: "Congenital heart disease becomes easier when you follow the blood",
        intro: "Begin with the communication or obstruction, identify the pressure gradient, predict flow direction and pulmonary blood flow, then name the chamber load, clinical signs, and safe timing of intervention.",
        chips: ["Shunt direction", "Pulmonary flow", "Chamber load", "Cyanosis", "Pulmonary vascular resistance", "Lifelong care"],
        visual: "heart"
      })}

      ${section("The six-step reasoning sequence", "Use the same sequence for a bedside case, an echocardiogram description, or an examination question.", flow([
        ["1. Locate the lesion", "Atrial, ventricular, great-artery, outflow, arch, or multiple levels"],
        ["2. Compare pressures", "Which chamber or vessel is at higher pressure?"],
        ["3. Follow the flow", "Left-to-right, right-to-left, bidirectional, obstructed, or mixing-dependent"],
        ["4. Predict pulmonary flow", "Increased, reduced, variable, or limited by vascular disease"],
        ["5. Predict chamber response", "Volume overload versus pressure overload"],
        ["6. Decide timing and safety", "Observe, close, dilate, stent, repair, or avoid closure"]
      ]), "Core method")}

      ${section("Physiology-based classification", "Classification by physiology explains symptoms and examination findings better than memorizing a disconnected list of names.", `
        <div class="grid three">
          ${card("Left-to-right shunts", `<p>ASD, VSD, PDA, and AV septal defects increase pulmonary blood flow and create chamber volume overload. Cyanosis is initially absent.</p>`, "accent-teal", "L→R")}
          ${card("Obstructive lesions", `<p>Pulmonary stenosis causes RV pressure load. Coarctation and congenital aortic stenosis cause LV pressure load and may be duct-dependent when critical.</p>`, "accent-amber", "⊣")}
          ${card("Cyanotic with reduced flow", `<p>TOF and pulmonary-atresia physiology direct venous blood to the systemic circulation while limiting pulmonary blood flow.</p>`, "accent-red", "R→L")}
          ${card("Parallel or mixing-dependent", `<p>d-TGA and single-ventricle circulations require communication between circuits. The anatomy may permit flow, but survival depends on mixing.</p>`, "accent-violet", "↔")}
          ${card("Pulmonary vascular disease", `<p>A long-standing large shunt can remodel the pulmonary vasculature until pulmonary vascular resistance becomes systemic and the shunt reverses.</p>`, "accent-red", "PVR")}
          ${card("Repaired congenital disease", `<p>Repair changes anatomy but does not erase arrhythmia, valve, ventricular, aortic, pulmonary vascular, pregnancy, or reintervention risks.</p>`, "", "∞")}
        </div>
      `, "Classification")}

      ${callout("warning", "Murmur intensity is not lesion size.", "A small restrictive VSD may be very loud, while a large nonrestrictive VSD or an Eisenmenger shunt may become softer as the pressure gradient falls.")}

      ${section("Explore the lesion map", "Select a lesion to display its direction of flow, chamber load, pulmonary blood flow, cyanosis pattern, and classic bedside clue.", `
        <section class="tool-card interactive-only" id="lesion-map-tool">
          <div class="lesion-board">
            <div class="lesion-list" role="tablist" aria-label="Lesion selector">
              ${Object.entries(lesionProfiles).map(([key, profile], index) => `<button class="lesion-select ${index === 0 ? "active" : ""}" type="button" data-lesion="${key}" role="tab" aria-selected="${index === 0}"><span>${profile.name}</span><small>${profile.family}</small></button>`).join("")}
            </div>
            <div class="lesion-output" id="lesion-output" role="tabpanel" aria-live="polite"></div>
          </div>
        </section>
      `, "Interactive map")}

      ${section("Seven revision anchors", "These anchors are deliberately short; each later module explains the mechanism behind them.", `
        <div class="grid four">
          ${card("ASD", `<p>Fixed split S2 + RA/RV volume overload.</p>`, "accent-teal", "A")}
          ${card("VSD", `<p>Holosystolic murmur + LA/LV volume overload.</p>`, "accent-teal", "V")}
          ${card("PDA", `<p>Continuous murmur + bounding pulse.</p>`, "accent-teal", "P")}
          ${card("Pulmonary stenosis", `<p>Ejection murmur + soft delayed P2.</p>`, "accent-amber", "PS")}
          ${card("Coarctation", `<p>Arm hypertension + weak femorals.</p>`, "accent-amber", "CoA")}
          ${card("TOF", `<p>RVOT obstruction + large VSD + variable cyanosis.</p>`, "accent-red", "4")}
          ${card("Eisenmenger", `<p>Irreversible PVR rise + reversal; do not simply close.</p>`, "accent-red", "E")}
        </div>
      `, "High yield")}
    `);
  }

  function approachPage() {
    return page("approach", `
      ${hero({
        eyebrow: "Module 02 · Clinical approach",
        title: "Suspect congenital disease from physiology, not from history alone",
        intro: "Many lesions are silent in childhood and first appear in adults. Combine oxygen saturation, pulses, blood pressure, S2, murmur characteristics, chamber signs, and targeted imaging.",
        chips: ["Cyanosis", "Abnormal S2", "Poor growth", "Four-limb pressure", "Echo first", "CMR/CT for complex anatomy"],
        visual: "heart"
      })}

      ${section("When congenital heart disease should enter the differential", "The clue usually reflects abnormal pulmonary flow, obstruction, chronic cyanosis, or a repaired residual lesion.", `
        ${table(["Clue", "Physiologic meaning", "Next thought"], [
          ["Cyanosis or low oxygen saturation", "Right-to-left shunt, inadequate pulmonary flow, or abnormal mixing", "Consider onset, pre/post-ductal pattern, response to oxygen, and duct dependence"],
          ["Murmur or abnormal S2", "Increased flow, obstruction, regurgitation, or residual anatomy", "Characterize S2 before grading the murmur"],
          ["Feeding difficulty, tachypnea, poor growth", "Pulmonary overcirculation or heart failure in infancy", "Look for large VSD, PDA, AVSD, or other major shunt"],
          ["Upper-limb hypertension or weak femoral pulses", "Obstruction to lower-body systemic flow", "Measure four-limb pressure and image the aortic arch"],
          ["Clubbing, erythrocytosis, hemoptysis", "Chronic cyanosis or pulmonary vascular disease", "Consider Eisenmenger physiology and multisystem complications"],
          ["Family history or associated anomalies", "Possible syndromic or inherited CHD", "Use lesion-specific genetic assessment"]
        ], "Clinical clues and what they mean")}
      `, "Recognition")}

      ${section("Rapid examination sequence", "A consistent sequence prevents the classic mistake of hearing a murmur but missing the pulse or S2 clue.", `
        <div class="grid three">
          ${card("1. Inspect", `<p>Cyanosis, clubbing, scars, respiratory effort, growth pattern, edema, syndromic features.</p>`, "", "1")}
          ${card("2. Saturation and pressure", `<p>Resting oxygen saturation; compare both arms and at least one leg when obstruction is possible.</p>`, "accent-teal", "2")}
          ${card("3. Pulses", `<p>Palpate brachial and femoral pulses together for radiofemoral delay. Note bounding versus weak pulses.</p>`, "accent-amber", "3")}
          ${card("4. Precordium", `<p>RV heave, displaced LV apex, systolic thrill, and signs of previous surgery.</p>`, "", "4")}
          ${card("5. S2 first", `<p>Fixed split, single, loud P2, or soft/delayed P2 often narrows the diagnosis rapidly.</p>`, "accent-violet", "5")}
          ${card("6. Murmur and consequences", `<p>Timing, site, radiation, respiratory response, heart failure, pulmonary hypertension, or differential cyanosis.</p>`, "accent-red", "6")}
        </div>
      `, "Examination")}

      ${section("What each investigation contributes", "Echocardiography is first-line, but complex anatomy and pulmonary vascular questions require additional modalities.", `
        ${table(["Test", "Primary contribution", "Important limitation or role"], [
          ["Pulse oximetry", "Subtle cyanosis, exertional desaturation, neonatal pre/post-ductal comparison", "Does not define anatomy"],
          ["ECG", "Axis, chamber hypertrophy, conduction defects, arrhythmia", "Supportive rather than definitive"],
          ["Chest radiograph", "Heart size, pulmonary plethora/oligemia, great-vessel contour, rib notching", "May be normal in important lesions"],
          ["Transthoracic echo", "Defect anatomy, shunt direction, gradients, chamber response, valves, pulmonary pressure", "First-line test"],
          ["TEE", "Detailed septal/valve anatomy and procedure planning", "Used when TTE windows or detail are insufficient"],
          ["CMR / cardiac CT", "Volumes, flows, arch, pulmonary arteries/veins, conduits, postoperative anatomy", "Central in complex and adult surveillance"],
          ["Catheterization", "Intervention, PVR, pressures, complex anatomy/coronary relationships", "Reserved for a specific invasive question"],
          ["Genetic assessment", "Syndromic and inherited patterns", "Targeted rather than automatic"]
        ], "General diagnostic approach")}
      `, "Investigations")}

      ${section("Build a shunt explanation", "Choose the communication, pressure relationship, and pulmonary vascular state. The tool returns a structured oral-exam answer.", `
        <section class="tool-card interactive-only" id="shunt-reasoning-tool">
          <h3>Shunt reasoning builder</h3>
          <p class="tool-intro">Use it to practice the chain from anatomy to safe management.</p>
          <div class="form-grid">
            <div class="field"><label for="shunt-level">Communication level</label><select id="shunt-level"><option value="atrial">Atrial</option><option value="ventricular">Ventricular</option><option value="arterial">Great-artery</option></select></div>
            <div class="field"><label for="shunt-pressure">Current pressure relationship</label><select id="shunt-pressure"><option value="left">Left/systemic pressure higher</option><option value="equal">Pressures nearly equal</option><option value="right">Right/pulmonary pressure higher</option></select></div>
            <div class="field"><label for="shunt-pvr">Pulmonary vascular resistance</label><select id="shunt-pvr"><option value="normal">Acceptable / not severely elevated</option><option value="borderline">Elevated and needs invasive assessment</option><option value="irreversible">Irreversibly high / Eisenmenger</option></select></div>
          </div>
          <div class="tool-actions"><button class="primary-button" id="run-shunt-reasoning" type="button">Build explanation</button><button class="secondary-button" id="reset-shunt-reasoning" type="button">Reset</button></div>
          <div class="tool-result" id="shunt-reasoning-result" aria-live="polite">Choose the anatomy and hemodynamics, then build the explanation.</div>
        </section>
      `, "Interactive")}

      ${callout("success", "Lifelong-care principle:", "Successful childhood repair is not always a cure. Residual shunts, valve disease, ventricular dysfunction, aortopathy, arrhythmia, pulmonary hypertension, pregnancy risk, and reintervention may appear later.")}
    `);
  }

  function asdPage() {
    return page("asd", `
      ${hero({
        eyebrow: "Module 03 · Acyanotic shunt",
        title: "Atrial septal defect: a low-pressure defect with a high-volume consequence",
        intro: "The defect itself is usually quiet. The examination findings come from increased right-sided flow: RV volume overload, pulmonary flow murmur, and wide fixed splitting of S2.",
        chips: ["Secundum", "Primum", "Sinus venosus", "RA/RV volume load", "Fixed split S2", "Device or surgery"],
        visual: "heart"
      })}

      ${section("Anatomy and closure route", "Not every opening at atrial level is the same lesion, and the anatomy determines whether catheter closure is possible.", `
        ${table(["Type", "Location / association", "Typical closure route"], [
          ["Secundum ASD", "Fossa ovalis; most common true ASD", "Transcatheter device when size and rims are suitable; surgery otherwise"],
          ["Primum ASD", "Low atrial septum; part of AV septal defect with AV valve abnormalities", "Surgical repair"],
          ["Sinus venosus defect", "Near SVC or IVC; often partial anomalous pulmonary venous return", "Surgery or selected advanced transcatheter repair"],
          ["Coronary sinus defect", "Unroofing of the coronary sinus", "Surgery in most significant cases"],
          ["Patent foramen ovale", "Flap-valve persistence without true loss of septal tissue", "Not managed as an ASD; closure only for selected indications"]
        ], "ASD types and management anatomy")}
      `, "Anatomy")}

      ${section("Physiology", "Left atrial pressure usually exceeds right atrial pressure, so blood crosses left-to-right and loads the right heart.", `
        <div class="grid two">
          <div class="diagram-card tts-unit" data-bookmark-title="ASD flow diagram" data-tts-label="ASD flow diagram"><h3>Why the right heart enlarges</h3><p>The extra blood enters the RA, crosses the tricuspid valve, and is ejected by the RV into the pulmonary circulation.</p><div class="diagram-wrap">${lesionSvg("asd")}</div></div>
          <div class="grid two">
            ${card("Primary chamber response", `<p>RA and RV volume overload. Pulmonary arteries may enlarge because flow is increased.</p>`, "accent-teal", "RV")}
            ${card("What does not enlarge first", `<p>The LV is not the primary enlarged chamber in an isolated ASD.</p>`, "", "LV")}
            ${card("Why the murmur is not at the defect", `<p>The atrial pressure gradient is low. The systolic murmur is a flow murmur across the pulmonary valve.</p>`, "accent-violet", "S2")}
            ${card("Age effect", `<p>Dyspnea, atrial flutter/fibrillation, pulmonary hypertension, and right-heart failure become more likely with age.</p>`, "accent-red", "↑")}
          </div>
        </div>
      `, "Hemodynamics")}

      ${section("Clinical picture and investigations", "The combination of fixed S2 splitting and RV volume load is more informative than murmur loudness.", `
        ${table(["Domain", "Expected finding", "Why it matters"], [
          ["Symptoms", "Often asymptomatic in childhood; later exertional dyspnea or arrhythmia", "The lesion can present for the first time in adulthood"],
          ["Palpation", "RV heave", "Reflects RV volume load and later pressure load if pulmonary hypertension develops"],
          ["S2", "Wide fixed splitting", "Prolonged RV ejection with little respiratory variation"],
          ["Murmur", "Systolic ejection murmur at LUSB; possible mid-diastolic tricuspid flow murmur", "Both are flow murmurs rather than turbulence through the ASD itself"],
          ["ECG / radiograph", "Incomplete RBBB/right axis; cardiomegaly, prominent pulmonary arteries, plethora", "Supports significant right-sided volume load"],
          ["Echo", "Type, size, rims, shunt, RV enlargement, pressure, valves, anomalous veins", "Defines closure suitability and hemodynamic consequence"]
        ], "ASD findings")}
      `, "Clinical pattern")}

      ${section("Should this ASD be closed?", "Visibility alone is not an indication. Closure depends on hemodynamic significance, right-heart load, symptoms, anatomy, and pulmonary vascular resistance.", `
        <section class="tool-card interactive-only" id="asd-tool">
          <h3>Educational ASD closure explorer</h3>
          <p class="tool-intro">This illustrates principles only and does not replace ACHD hemodynamic assessment.</p>
          <div class="form-grid">
            <div class="field"><label for="asd-rv">RA/RV enlargement</label><select id="asd-rv"><option value="yes">Present</option><option value="no">Absent</option></select></div>
            <div class="field"><label for="asd-symptoms">Symptoms attributable to shunt</label><select id="asd-symptoms"><option value="yes">Present</option><option value="no">Absent</option></select></div>
            <div class="field"><label for="asd-pvr">Pulmonary vascular state</label><select id="asd-pvr"><option value="acceptable">Acceptable</option><option value="uncertain">Elevated / uncertain</option><option value="eisenmenger">Established Eisenmenger physiology</option></select></div>
          </div>
          <div class="tool-actions"><button class="primary-button" id="run-asd" type="button">Interpret principle</button></div>
          <div class="tool-result" id="asd-result" aria-live="polite"></div>
        </section>
      `, "Decision principle")}

      ${callout("danger", "Do not close reflexively.", "Established Eisenmenger physiology is a contraindication to simple closure. Elevated or uncertain pulmonary vascular resistance requires specialist hemodynamic assessment.")}
    `);
  }

  function vsdPage() {
    return page("vsd", `
      ${hero({
        eyebrow: "Module 04 · Acyanotic shunt",
        title: "Ventricular septal defect: size matters, but pressure restriction matters more",
        intro: "A small restrictive VSD preserves a large LV-to-RV gradient and may be very loud. A large nonrestrictive VSD equalizes ventricular pressures, creates major pulmonary overcirculation, and can become quieter as disease worsens.",
        chips: ["Perimembranous", "Muscular", "Inlet", "Outlet", "Restrictive", "Nonrestrictive"],
        visual: "heart"
      })}

      ${section("Anatomic types", "Location predicts spontaneous closure, valve involvement, and repair considerations.", `
        ${table(["Type", "Key anatomy", "Important consequence"], [
          ["Perimembranous", "Near aortic and tricuspid valves; most common", "Aortic cusp prolapse and aortic regurgitation may develop"],
          ["Muscular", "Within muscular septum; single or multiple", "Small lesions often close spontaneously"],
          ["Inlet", "Near AV valves", "Often part of AV septal defect anatomy"],
          ["Outlet / subarterial", "Near semilunar valves", "Higher risk of progressive aortic cusp prolapse and regurgitation"]
        ], "VSD anatomic types")}
      `, "Anatomy")}

      ${section("Hemodynamics: why the murmur can mislead", "The pressure gradient across the defect changes the velocity of flow and therefore the murmur.", `
        <div class="grid two">
          <div class="diagram-card tts-unit" data-bookmark-title="VSD flow diagram" data-tts-label="VSD flow diagram"><h3>Ventricular-level communication</h3><p>Moderate and large left-to-right shunts increase pulmonary venous return and load the LA and LV.</p><div class="diagram-wrap">${lesionSvg("vsd")}</div></div>
          ${table(["Physiology", "Pressure relation", "Murmur"], [
            ["Small restrictive", "Large LV-to-RV gradient; little volume load", "Very loud, harsh holosystolic murmur with thrill"],
            ["Moderate", "Meaningful left-to-right shunt; LA/LV volume load", "Holosystolic murmur; possible mitral flow murmur"],
            ["Large nonrestrictive", "RV pressure approaches LV pressure; early pulmonary hypertension", "Shorter or softer as the gradient falls"],
            ["Eisenmenger VSD", "PVR becomes systemic; bidirectional/right-to-left flow", "Original murmur diminishes; loud P2 and cyanosis dominate"]
          ], "VSD physiology versus murmur")}
        </div>
      `, "Hemodynamics")}

      ${section("Clinical presentation, investigations, and management", "Symptoms often begin after pulmonary vascular resistance falls in early infancy.", `
        <div class="grid three">
          ${card("Small defect", `<p>Usually asymptomatic and found because of a loud murmur. Observation is common, especially for muscular defects.</p>`, "accent-teal", "S")}
          ${card("Large symptomatic defect", `<p>Tachypnea, feeding difficulty, sweating, poor weight gain, recurrent respiratory symptoms, and heart failure.</p>`, "accent-red", "L")}
          ${card("Echo questions", `<p>Location, size, direction, pressure restriction, chamber volume load, aortic valve involvement, and pulmonary pressure.</p>`, "", "E")}
          ${card("Timely closure", `<p>Medical stabilization of heart failure followed by closure prevents irreversible pulmonary vascular disease.</p>`, "accent-amber", "Tx")}
          ${card("Valve-protection indication", `<p>Aortic cusp prolapse or progressive AR can justify closure even when the shunt is not large.</p>`, "accent-violet", "AV")}
          ${card("Established Eisenmenger", `<p>Do not close the defect. Refer for pulmonary hypertension and adult congenital heart disease care.</p>`, "accent-red", "!")}
        </div>
      `, "Management")}

      ${section("Change the physiology", "Select a physiologic category to see how pressure, chamber load, symptoms, and murmur change.", `
        <section class="tool-card interactive-only" id="vsd-tool">
          <h3>VSD physiology explorer</h3>
          <div class="segmented" role="group" aria-label="VSD physiology">
            <button type="button" data-vsd-state="small" class="active">Small restrictive</button>
            <button type="button" data-vsd-state="moderate">Moderate</button>
            <button type="button" data-vsd-state="large">Large nonrestrictive</button>
            <button type="button" data-vsd-state="eisenmenger">Eisenmenger</button>
          </div>
          <div class="tool-result" id="vsd-result" aria-live="polite"></div>
        </section>
      `, "Interactive")}

      ${callout("warning", "Classic trap:", "A quieter VSD murmur does not necessarily mean the defect is smaller. It can mean ventricular pressures have equalized because the defect is large or pulmonary vascular resistance has risen.")}
    `);
  }

  function pdaPage() {
    return page("pda", `
      ${hero({
        eyebrow: "Module 05 · Acyanotic shunt",
        title: "Patent ductus arteriosus: continuous runoff from the aorta to the pulmonary artery",
        intro: "Because aortic pressure normally exceeds pulmonary pressure in systole and diastole, the shunt is continuous. Pulmonary overcirculation returns to the LA and LV, while diastolic runoff creates bounding pulses and a wide pulse pressure.",
        chips: ["Continuous shunt", "LA/LV volume load", "Bounding pulse", "Wide pulse pressure", "Differential cyanosis", "Device closure"],
        visual: "heart"
      })}

      ${section("Physiology sequence", "Follow the duct from the descending aorta to the pulmonary artery, then follow the extra pulmonary venous return back to the left heart.", `
        ${flow([
          ["Persistent duct", "Aorta remains connected to pulmonary artery"],
          ["Continuous L→R flow", "Aortic pressure exceeds pulmonary pressure in systole and diastole"],
          ["Pulmonary overcirculation", "Pulmonary flow and pressure may rise"],
          ["LA/LV volume load", "Extra pulmonary venous return expands the left heart"],
          ["Heart failure / PH", "Large shunts cause infant symptoms and vascular disease"]
        ])}
        <div class="diagram-card tts-unit" data-bookmark-title="PDA flow diagram" data-tts-label="PDA flow diagram" style="margin-top:16px"><div class="diagram-wrap">${lesionSvg("pda")}</div></div>
      `, "Hemodynamics")}

      ${section("Clinical findings", "Pulse findings are central because the lesion affects aortic diastolic runoff.", `
        ${table(["Finding", "Interpretation", "Mechanism"], [
          ["Small PDA", "Often asymptomatic; murmur may be the only clue", "Low total shunt volume"],
          ["Large PDA in infancy", "Tachypnea, feeding difficulty, poor growth, recurrent respiratory symptoms, heart failure", "Pulmonary overcirculation and LA/LV volume load"],
          ["Bounding pulses / wide pulse pressure", "High-volume peripheral pulse", "High stroke volume plus aortic diastolic runoff"],
          ["Continuous machinery murmur", "Maximal below the left clavicle; possible thrill", "Persistent systolic and diastolic pressure gradient"],
          ["Differential cyanosis", "Cyanotic/clubbing lower limbs with relatively spared upper limbs", "Reversed ductal flow enters descending aorta distal to left subclavian artery"]
        ], "PDA bedside pattern")}
      `, "Clinical pattern")}

      ${section("Management by context", "The same vessel may need closure in one patient and deliberate maintenance in another.", `
        ${table(["Situation", "Approach", "Why"], [
          ["Hemodynamically insignificant PDA", "Observation may be appropriate", "No LV volume overload or pulmonary hypertension"],
          ["Moderate/large PDA with LV volume load", "Transcatheter device closure in most suitable children and adults", "Removes ongoing pulmonary overcirculation"],
          ["Premature infant", "Individualized; cyclooxygenase inhibition may be used", "Medication is mainly a neonatal/preterm strategy"],
          ["Established Eisenmenger physiology", "Avoid closure", "The pulmonary vascular disease is irreversible"],
          ["Duct-dependent congenital lesion", "Prostaglandin E1 keeps the duct open", "The duct supports systemic flow, pulmonary flow, or mixing"]
        ], "PDA: close it, observe it, or keep it open?")}
      `, "Management")}

      ${section("Cyanosis pattern explorer", "Choose a ductal scenario and compare where deoxygenated blood enters the circulation.", `
        <section class="tool-card interactive-only" id="pda-tool">
          <h3>PDA scenario explorer</h3>
          <div class="segmented" role="group" aria-label="PDA scenario">
            <button type="button" data-pda-state="left" class="active">Ordinary left-to-right PDA</button>
            <button type="button" data-pda-state="large">Large PDA with heart failure</button>
            <button type="button" data-pda-state="reverse">Eisenmenger PDA</button>
            <button type="button" data-pda-state="dependent">Duct-dependent lesion</button>
          </div>
          <div class="tool-result" id="pda-result" aria-live="polite"></div>
        </section>
      `, "Interactive")}

      ${callout("warning", "Medication trap:", "Indomethacin or ibuprofen is not a general PDA treatment for older children and adults. Significant PDA in these groups is usually closed by catheter when anatomy is suitable.")}
    `);
  }

  function pulmonaryStenosisPage() {
    return page("pulmonary-stenosis", `
      ${hero({
        eyebrow: "Module 06 · Right-sided obstruction",
        title: "Pulmonary stenosis: the right ventricle pumps against a narrowed outflow",
        intro: "Obstruction raises RV systolic pressure and produces hypertrophy. Severe disease reduces pulmonary blood flow, softens and delays P2, and may become duct-dependent in a critically affected neonate.",
        chips: ["Valvular", "Subvalvular", "Supravalvular", "RV pressure load", "Ejection click", "Balloon valvuloplasty"],
        visual: "heart"
      })}

      ${section("Where can the obstruction be?", "The level determines the physical signs and whether balloon treatment is suitable.", `
        ${table(["Level", "Typical anatomy", "Management implication"], [
          ["Valvular", "Doming leaflets with commissural fusion; most common", "Balloon pulmonary valvuloplasty is preferred when suitable"],
          ["Dysplastic valvular", "Thick abnormal leaflets; may occur in genetic syndromes", "May respond less well to balloon treatment"],
          ["Subvalvular / infundibular", "Muscular RVOT narrowing; isolated or part of TOF", "Often requires surgical/anatomic management"],
          ["Supravalvular / branch PA", "Narrowing above valve or in branch pulmonary arteries", "Catheter or surgical strategy depends on anatomy"]
        ], "Levels of pulmonary stenosis")}
      `, "Anatomy")}

      ${section("Examination and Doppler severity", "As obstruction worsens, RV pressure rises, P2 becomes softer and later, and pulmonary flow can fall.", `
        <div class="grid two">
          <div class="diagram-card tts-unit" data-bookmark-title="Pulmonary stenosis diagram" data-tts-label="Pulmonary stenosis diagram"><h3>Pressure overload rather than volume overload</h3><p>The RV must generate higher systolic pressure to eject through the narrowed outflow.</p><div class="diagram-wrap">${lesionSvg("ps")}</div></div>
          ${table(["Feature", "Typical finding"], [
            ["Palpation", "Left parasternal heave and systolic thrill at pulmonary area"],
            ["S2", "P2 soft and delayed; splitting widens with increasing obstruction"],
            ["Ejection click", "Common in valvular stenosis and may soften with inspiration"],
            ["Murmur", "Harsh crescendo-decrescendo systolic ejection murmur at LUSB, often radiating to back"],
            ["Cyanosis", "Possible in critical obstruction with right-to-left atrial shunting"],
            ["Neonatal critical disease", "Pulmonary blood flow may be duct-dependent"]
          ], "Pulmonary stenosis examination")}
        </div>
      `, "Clinical pattern")}

      ${section("Doppler gradient calculator", "Enter the peak Doppler gradient. The output classifies severity while reminding you that symptoms, RV effects, and anatomy still matter.", `
        <section class="tool-card interactive-only" id="ps-tool">
          <h3>Peak gradient classifier</h3>
          <div class="form-grid">
            <div class="field"><label for="ps-gradient">Peak Doppler gradient (mmHg)</label><input id="ps-gradient" type="number" min="0" max="250" value="42" inputmode="decimal"></div>
            <div class="field"><label for="ps-symptoms">Symptoms / important RV effect</label><select id="ps-symptoms"><option value="no">Not evident</option><option value="yes">Present</option></select></div>
          </div>
          <div class="tool-actions"><button class="primary-button" id="run-ps" type="button">Classify</button></div>
          <div class="tool-result" id="ps-result" aria-live="polite"></div>
        </section>
      `, "Interactive")}

      ${section("Management", "Treatment is driven by anatomy and physiologic consequence rather than a single number.", `
        <div class="grid three">
          ${card("Mild asymptomatic", `<p>Observe with periodic echocardiography.</p>`, "accent-teal", "<36")}
          ${card("Suitable moderate/severe valvular", `<p>Balloon pulmonary valvuloplasty is preferred, especially with symptoms or significant RV pressure load.</p>`, "accent-amber", "36+")}
          ${card("Unsuitable anatomy", `<p>Surgery for dysplastic valves, sub/supravalvular obstruction, important regurgitation, or anatomy unsuitable for catheter treatment.</p>`, "accent-red", "Sx")}
          ${card("Critical neonate", `<p>Urgent stabilization and congenital intervention; prostaglandin may maintain ductal pulmonary flow.</p>`, "accent-red", "PGE₁")}
        </div>
      `, "Treatment")}

      ${callout("info", "Endocarditis prophylaxis:", "Routine prophylaxis is not recommended for uncomplicated native pulmonary stenosis. It is reserved for the highest-risk congenital categories and specified dental procedures.")}
    `);
  }

  function coarctationPage() {
    return page("coarctation", `
      ${hero({
        eyebrow: "Module 07 · Left-sided obstruction",
        title: "Coarctation: compare the upper body with the lower body",
        intro: "A narrowing near the ductal insertion creates upper-body hypertension, weak or delayed femoral pulses, and LV pressure overload. Critical neonatal disease may remain silent until the duct closes and lower-body perfusion collapses.",
        chips: ["Aortic arch", "Arm-leg gradient", "Radiofemoral delay", "Rib notching", "Prostaglandin in neonate", "Lifelong hypertension surveillance"],
        visual: "heart"
      })}

      ${section("Anatomy, associations, and neonatal danger", "Coarctation is more than a single pressure gradient: it is an aortopathy and a lifelong vascular condition.", `
        <div class="grid three">
          ${card("Typical location", `<p>Discrete or tubular narrowing of the aortic arch, usually near the ductal insertion.</p>`, "accent-amber", "Arch")}
          ${card("Associations", `<p>Bicuspid aortic valve, arch hypoplasia, VSD, Turner syndrome, and intracranial aneurysm risk.</p>`, "accent-violet", "+")}
          ${card("Critical neonate", `<p>Shock, acidosis, renal dysfunction, and weak lower-body perfusion as the duct closes. Maintain ductal patency and arrange urgent repair.</p>`, "accent-red", "!")}
        </div>
      `, "Anatomy")}

      ${section("Hemodynamics and examination", "The lesion creates a pressure difference and pulse delay across the narrowed arch.", `
        <div class="grid two">
          <div class="diagram-card tts-unit" data-bookmark-title="Coarctation diagram" data-tts-label="Coarctation diagram"><h3>Obstruction to lower-body systemic flow</h3><p>The LV faces pressure overload. Collaterals can partially bypass the narrowing and produce rib notching.</p><div class="diagram-wrap">${lesionSvg("coa")}</div></div>
          ${table(["Feature", "Finding"], [
            ["Blood pressure", "Higher in arms than legs; hypertension may persist after repair"],
            ["Pulses", "Weak or delayed femoral pulses with radiofemoral delay"],
            ["Older-patient symptoms", "Headache, epistaxis, exertional leg fatigue or claudication; many are asymptomatic"],
            ["Murmur", "Systolic murmur in left infraclavicular region and back; collateral murmurs may be continuous"],
            ["Collateral signs", "Interscapular pulsations and inferior rib notching, classically ribs 3–8"],
            ["Cardiac response", "LV hypertrophy; associated bicuspid valve may add stenosis or regurgitation"]
          ], "Coarctation examination")}
        </div>
      `, "Clinical pattern")}

      ${section("Four-limb pressure practice", "Enter representative systolic pressures to calculate the arm-leg gradient. The result is an educational flag, not a diagnostic threshold in isolation.", `
        <section class="tool-card interactive-only" id="coa-tool">
          <h3>Arm-leg systolic gradient</h3>
          <div class="form-grid">
            <div class="field"><label for="coa-arm">Higher arm systolic pressure</label><input id="coa-arm" type="number" value="152" min="50" max="300"></div>
            <div class="field"><label for="coa-leg">Leg systolic pressure</label><input id="coa-leg" type="number" value="118" min="30" max="300"></div>
            <div class="field"><label for="coa-femoral">Femoral pulse</label><select id="coa-femoral"><option value="normal">Normal</option><option value="weak">Weak</option><option value="delayed">Delayed</option></select></div>
          </div>
          <div class="tool-actions"><button class="primary-button" id="run-coa" type="button">Calculate gradient</button></div>
          <div class="tool-result" id="coa-result" aria-live="polite"></div>
        </section>
      `, "Interactive")}

      ${section("Imaging, intervention, and lifelong follow-up", "Adult surveillance depends heavily on cross-sectional imaging and ambulatory or exercise blood pressure assessment.", `
        ${table(["Step", "Role"], [
          ["Echo", "Doppler gradient and LV response; useful arch view in children but may miss complex adult anatomy"],
          ["CMR / CT angiography", "Entire arch, collaterals, recoarctation, aneurysm, and associated aortopathy"],
          ["Catheterization", "When intervention is planned or pressure/anatomy requires invasive clarification"],
          ["Intervention", "Surgery in infants/complex anatomy; balloon angioplasty or stenting in selected older patients"],
          ["Lifelong surveillance", "Arm and ambulatory BP, exercise hypertension, bicuspid valve disease, recoarctation, aneurysm, cerebrovascular risk"]
        ], "Coarctation management pathway")}
      `, "Management")}

      ${callout("warning", "High-yield warning:", "A low resting arm-leg gradient does not exclude important repaired coarctation. Collateral flow, altered arch geometry, and exercise hypertension can conceal residual disease.")}
    `);
  }

  function tofPage() {
    return page("tof", `
      ${hero({
        eyebrow: "Module 08 · Cyanotic lesion",
        title: "Tetralogy of Fallot: one large VSD, one obstructed outflow, four linked findings",
        intro: "The large VSD equalizes ventricular pressure, while RV outflow obstruction determines how much blood reaches the lungs and how much crosses right-to-left into the overriding aorta.",
        chips: ["Large VSD", "RVOT obstruction", "Overriding aorta", "RV hypertrophy", "Tet spell", "Lifelong CMR and rhythm follow-up"],
        visual: "heart"
      })}

      ${section("The four components", "The components are not four independent problems. RVOT obstruction drives the physiology, and RV hypertrophy is a consequence of pressure load.", `
        <div class="grid four">
          ${card("Large VSD", `<p>Usually nonrestrictive, allowing ventricular pressures to equalize.</p>`, "accent-red", "1")}
          ${card("RVOT obstruction", `<p>Infundibular, valvular, or pulmonary-artery obstruction; the main determinant of cyanosis.</p>`, "accent-red", "2")}
          ${card("Overriding aorta", `<p>The aorta receives blood from both ventricles because it is displaced over the VSD.</p>`, "accent-violet", "3")}
          ${card("RV hypertrophy", `<p>Secondary to chronic RV pressure overload, not the primary embryologic lesion.</p>`, "accent-amber", "4")}
        </div>
      `, "Anatomy")}

      ${section("Clinical presentation", "The VSD itself is often silent because ventricular pressures are similar; the ejection murmur comes from RVOT obstruction.", `
        <div class="grid two">
          <div class="diagram-card tts-unit" data-bookmark-title="Tetralogy flow diagram" data-tts-label="Tetralogy flow diagram"><h3>Cyanosis follows the obstruction</h3><p>Worse RVOT obstruction reduces pulmonary flow and directs more blood through the VSD into the aorta.</p><div class="diagram-wrap">${lesionSvg("tof")}</div></div>
          ${table(["Feature", "Typical finding"], [
            ["Cyanosis", "May be absent at birth with mild obstruction and worsen as infundibular narrowing increases"],
            ["S2", "Usually single because P2 is soft or absent"],
            ["Murmur", "Harsh systolic ejection murmur from RVOT obstruction"],
            ["Chest radiograph", "Boot-shaped heart with upturned apex and reduced pulmonary markings"],
            ["ECG", "Right-axis deviation and RV hypertrophy in unrepaired disease"],
            ["Chronic hypoxemia", "Clubbing and growth delay in unrepaired or palliated disease"]
          ], "TOF clinical pattern")}
        </div>
      `, "Clinical pattern")}

      ${section("Hypercyanotic spell", "A spell is an abrupt increase in right-to-left shunting, often triggered by crying, feeding, defecation, dehydration, fever, or exertion.", `
        ${callout("danger", "Emergency physiology:", "Infundibular spasm and reduced systemic vascular resistance worsen pulmonary flow. Severe spells can cause syncope, seizure, stroke, or cardiac arrest.")}
        <section class="tool-card interactive-only" id="tet-tool" style="margin-top:14px">
          <h3>Put the tet-spell response in order</h3>
          <p class="tool-intro">Select all six steps in the best sequence, then check your answer.</p>
          <div class="sequence-board" id="tet-sequence">
            ${[
              ["Urgent congenital cardiology", "Escalate for severe or persistent spell"],
              ["Knee-chest position", "Raise systemic vascular resistance"],
              ["Volume if needed", "Improve preload"],
              ["Calm the child", "Reduce catecholamine drive"],
              ["Beta-blockade / raise SVR", "Reduce infundibular spasm and right-to-left shunt"],
              ["Oxygen / airway support", "Support oxygen delivery and ventilation"]
            ].map((item, index) => `<button type="button" class="sequence-step" data-step="${index}"><span>?</span><strong>${item[0]}</strong><small>${item[1]}</small></button>`).join("")}
          </div>
          <div class="tool-actions"><button class="primary-button" id="check-tet" type="button">Check sequence</button><button class="secondary-button" id="reset-tet" type="button">Reset</button></div>
          <div class="tool-result" id="tet-result" aria-live="polite">No steps selected yet.</div>
        </section>
      `, "Emergency")}

      ${section("Repair and lifelong surveillance", "Complete repair closes the VSD and relieves RVOT obstruction, but the long-term balance includes pulmonary regurgitation and RV remodeling.", `
        ${table(["Stage", "Key points"], [
          ["Initial management", "Complete repair in most infants; selected unstable/small infants may receive shunt, ductal stent, or RVOT intervention"],
          ["Complete repair", "VSD closure and relief of RVOT obstruction while avoiding excessive pulmonary regurgitation"],
          ["Late complications", "Pulmonary regurgitation, RV dilation/dysfunction, residual obstruction, TR, aortic-root dilation, ventricular arrhythmia, sudden death risk"],
          ["Reintervention", "Pulmonary valve replacement uses symptoms, RV size/function, exercise capacity, arrhythmia, and imaging thresholds"],
          ["Surveillance", "Lifelong ACHD follow-up with ECG, rhythm assessment, echo, CMR, exercise testing, and pregnancy counseling"]
        ], "TOF repair and follow-up")}
      `, "Long-term care")}

      ${callout("warning", "Correction of a common misconception:", "The classic VSD is usually large and nonrestrictive, not insignificant. RV outflow obstruction—not VSD size alone—determines cyanosis.")}
    `);
  }

  function eisenmengerPage() {
    return page("eisenmenger", `
      ${hero({
        eyebrow: "Module 09 · Pulmonary vascular disease",
        title: "Eisenmenger syndrome: the shunt begins left-to-right and ends by reversing",
        intro: "Long-standing pulmonary overcirculation remodels pulmonary vessels. When pulmonary vascular resistance approaches or exceeds systemic resistance, flow becomes bidirectional or right-to-left and systemic cyanosis develops.",
        chips: ["PVR rise", "Shunt reversal", "Cyanosis", "Loud P2", "Multisystem disease", "Do not close the defect"],
        visual: "heart"
      })}

      ${section("Progression", "The syndrome is a sequence, not simply a cyanotic defect present from birth.", `
        ${flow([
          ["Large systemic-to-pulmonary shunt", "Commonly VSD, PDA, AVSD, or occasionally ASD"],
          ["Pulmonary overcirculation", "High flow and pressure injure pulmonary vessels"],
          ["Vascular remodeling", "Progressive structural change raises resistance"],
          ["Rising PVR", "Pulmonary pressure approaches systemic pressure"],
          ["Bidirectional / R→L flow", "The original pressure gradient narrows and reverses"],
          ["Systemic cyanosis", "Oxygen saturation falls and multisystem effects appear"]
        ])}
        <div class="diagram-card tts-unit" data-bookmark-title="Eisenmenger shunt reversal" data-tts-label="Eisenmenger shunt reversal" style="margin-top:16px"><div class="diagram-wrap">${lesionSvg("eisenmenger")}</div></div>
      `, "Pathophysiology")}

      ${section("Multisystem consequences", "Both bleeding and thrombosis risks can coexist, and secondary erythrocytosis is usually adaptive.", `
        ${table(["System", "Manifestations", "Clinical implication"], [
          ["Cardiorespiratory", "Cyanosis, exertional limitation, loud P2, RV failure, syncope, hemoptysis, PA dilation, arrhythmia", "Expert ACHD and pulmonary hypertension care"],
          ["Hematologic", "Secondary erythrocytosis; iron deficiency may worsen symptoms", "Do not perform automatic phlebotomy"],
          ["Neurologic / thrombotic", "Paradoxical embolism, stroke, brain abscess, in-situ pulmonary thrombosis", "Use meticulous IV air precautions and individualized anticoagulation"],
          ["Renal / metabolic", "Hyperuricemia, gout, renal dysfunction, proteinuria", "Monitor renal and metabolic status"],
          ["Pregnancy", "Extremely high maternal and fetal risk", "Strongly discouraged; expert contraception and counseling"]
        ], "Eisenmenger consequences")}
      `, "Clinical consequences")}

      ${section("Management principles", "Management preserves RV function, treats pulmonary vascular disease, and avoids interventions that remove a necessary pressure-relief pathway.", `
        <div class="grid three">
          ${card("Do not close the defect", `<p>Irreversible pulmonary vascular disease makes simple closure dangerous; the shunt may decompress the RV.</p>`, "accent-red", "!")}
          ${card("Expert multidisciplinary care", `<p>Track saturation, iron, renal function, arrhythmia, heart failure, bleeding, thrombosis, and pregnancy risk.</p>`, "", "Team")}
          ${card("Targeted PAH therapy", `<p>Endothelin-receptor antagonists or PDE-5 inhibitors may be used with specialist escalation.</p>`, "accent-teal", "PAH")}
          ${card("Avoid routine phlebotomy", `<p>Reserve it for selected severe hyperviscosity symptoms after excluding dehydration and iron deficiency.</p>`, "accent-amber", "Fe")}
          ${card("Air and dental precautions", `<p>Use air filters for IV lines, meticulous dental care, careful perioperative planning, and individualized anticoagulation.</p>`, "accent-violet", "Air")}
          ${card("Advanced disease", `<p>Selected patients may require lung transplantation with cardiac repair or heart-lung transplantation.</p>`, "accent-red", "Tx")}
        </div>
      `, "Management")}

      ${section("Murmur paradox", "Move the pulmonary vascular state from low to very high and observe why the original shunt murmur fades.", `
        <section class="tool-card interactive-only" id="eisenmenger-tool">
          <h3>Pressure-gradient explorer</h3>
          <div class="field"><label for="pvr-slider">Pulmonary vascular resistance</label><input id="pvr-slider" type="range" min="0" max="100" value="20"></div>
          <div class="tool-result" id="pvr-result" aria-live="polite"></div>
        </section>
      `, "Interactive")}

      ${callout("danger", "Murmur warning:", "As pulmonary pressure rises and the ventricular or arterial gradient narrows, the original shunt murmur may become quieter. A softer murmur can signal worse disease rather than improvement.")}
    `);
  }

  function dtgaPage() {
    return page("dtga", `
      ${hero({
        eyebrow: "Module 10 · Mixing-dependent circulation",
        title: "d-Transposition: two complete circuits that run beside each other instead of through each other",
        intro: "The aorta arises from the RV and the pulmonary artery from the LV. Systemic and pulmonary circulations are therefore parallel. Survival depends on mixing through an ASD, VSD, PDA, or a combination.",
        chips: ["Ventriculoarterial discordance", "Parallel circuits", "Mixing", "Prostaglandin E1", "Balloon atrial septostomy", "Arterial switch"],
        visual: "parallel"
      })}

      ${section("Why cyanosis is profound", "Oxygenated pulmonary venous blood is returned to the lungs, while systemic venous blood is returned to the body unless the circuits communicate.", `
        <div class="grid two">
          <div class="diagram-card tts-unit" data-bookmark-title="d-TGA circulation diagram" data-tts-label="d-TGA circulation diagram"><h3>Parallel circulation</h3><p>The presence and effectiveness of mixing—not oxygen administration alone—determine systemic oxygen delivery.</p><div class="diagram-wrap">${lesionSvg("dtga")}</div></div>
          <div class="grid two">
            ${card("Presentation", `<p>Profound cyanosis soon after birth, sometimes with surprisingly little respiratory distress relative to the hypoxemia.</p>`, "accent-red", "O₂")}
            ${card("Immediate stabilization", `<p>Prostaglandin E1 maintains ductal patency. Urgent balloon atrial septostomy improves atrial mixing when needed.</p>`, "accent-amber", "PGE₁")}
            ${card("Definitive repair", `<p>Arterial switch operation in early neonatal life, including coronary artery transfer.</p>`, "accent-teal", "Switch")}
            ${card("Long-term surveillance", `<p>Neo-aortic root/regurgitation, coronary complications, pulmonary artery stenosis, ventricular function, arrhythmia, and exercise capacity.</p>`, "", "∞")}
          </div>
        </div>
      `, "Core physiology")}

      ${section("Mixing explorer", "Select the available communications and see how they support mixing before definitive repair.", `
        <section class="tool-card interactive-only" id="dtga-tool">
          <h3>Pre-repair mixing pathways</h3>
          <div class="form-grid">
            <div class="field"><label for="dtga-asd">Atrial communication</label><select id="dtga-asd"><option value="good">Large / effective</option><option value="poor">Restrictive / poor</option><option value="none">Absent</option></select></div>
            <div class="field"><label for="dtga-vsd">VSD</label><select id="dtga-vsd"><option value="present">Present</option><option value="absent">Absent</option></select></div>
            <div class="field"><label for="dtga-pda">PDA</label><select id="dtga-pda"><option value="open">Open</option><option value="closing">Closing / closed</option></select></div>
          </div>
          <div class="tool-actions"><button class="primary-button" id="run-dtga" type="button">Assess mixing</button></div>
          <div class="tool-result" id="dtga-result" aria-live="polite"></div>
        </section>
      `, "Interactive")}

      ${section("Related lesions named in classic classifications", "Use the actual anatomy and physiology rather than relying on older labels.", `
        ${table(["Lesion / term", "Concise orientation"], [
          ["Tricuspid atresia", "No direct RA-to-RV connection with an underdeveloped RV; requires interatrial flow and a source of pulmonary blood flow; staged single-ventricle palliation is typical"],
          ["Atrioventricular septal defect", "Endocardial-cushion defect involving atrial and ventricular septa and common/abnormal AV valves; strongly associated with trisomy 21"],
          ["Fallot triology", "Historical term for pulmonary stenosis, ASD, and RV hypertrophy; not a preferred modern diagnostic category"],
          ["Fallot pentalogy", "Historical TOF plus ASD; management follows the real anatomy and physiology"],
          ["Congenital aortic stenosis", "Valvular, subvalvular, or supravalvular; severe neonatal disease may be duct-dependent and later disease causes LV pressure load"]
        ], "Related congenital lesions and historical terms")}
      `, "Orientation")}

      ${callout("info", "Older atrial-switch survivors:", "Systemic RV failure, tricuspid regurgitation, sinus-node dysfunction, atrial arrhythmia, and baffle obstruction or leak require lifelong specialist surveillance.")}
    `);
  }

  function dextrocardiaPage() {
    return page("dextrocardia", `
      ${hero({
        eyebrow: "Module 11 · Integration",
        title: "Dextrocardia describes direction; situs describes arrangement",
        intro: "A right-sided cardiac silhouette is not a diagnosis by itself. Decide whether the apex truly points right, whether the thoracoabdominal organs are mirror-imaged, and whether the heart has been displaced by extracardiac disease.",
        chips: ["Dextrocardia", "Situs solitus", "Situs inversus", "Dextroposition", "Heterotaxy", "Adapt ECG leads"],
        visual: "heart"
      })}

      ${section("Terms that must not be confused", "The associated intracardiac anatomy—not the word dextrocardia alone—determines clinical significance.", `
        ${table(["Term", "Definition", "Clinical significance"], [
          ["Dextrocardia", "Cardiac apex points to the right", "May occur with situs solitus, situs inversus, or heterotaxy"],
          ["Situs inversus totalis", "Mirror-image thoracic and abdominal organs, usually with mirror-image dextrocardia", "Many individuals have no major structural CHD"],
          ["Dextrocardia with situs solitus", "Right-pointing apex with ordinary organ arrangement", "More often associated with significant CHD and needs detailed imaging"],
          ["Dextroposition", "Heart displaced right without true mirror-image apex/chambers", "Think lung volume loss, diaphragmatic abnormality, or mediastinal shift"],
          ["Heterotaxy", "Abnormal left-right arrangement", "Can include complex CHD, anomalous venous return, splenic abnormalities, and conduction disease"]
        ], "Dextrocardia and situs terminology")}
      `, "Terminology")}

      ${callout("warning", "ECG and imaging caution:", "Lead placement and image orientation must be adapted. Apparent axis abnormalities or poor R-wave progression may simply reflect standard left-sided lead placement in true dextrocardia.")}

      ${section("High-yield lesion comparison", "Filter the matrix by physiologic family. The table links chamber load, pulmonary flow, and the classic bedside clue.", `
        <section class="tool-card interactive-only" id="comparison-tool">
          <div class="comparison-toolbar" role="group" aria-label="Comparison filter">
            <button class="filter-button active" type="button" data-filter="all">All lesions</button>
            <button class="filter-button" type="button" data-filter="shunt">Left-to-right shunts</button>
            <button class="filter-button" type="button" data-filter="obstruction">Obstruction</button>
            <button class="filter-button" type="button" data-filter="cyanotic">Cyanotic / mixing</button>
          </div>
          <div class="table-card"><div class="table-scroll"><table id="comparison-table"><caption>Common congenital lesions</caption><thead><tr><th>Lesion</th><th>Primary chamber load</th><th>Pulmonary flow</th><th>Classic clue</th></tr></thead><tbody>
            <tr data-family="shunt"><td><strong>ASD</strong></td><td>RA/RV volume overload</td><td>Increased</td><td>Wide fixed S2 split; pulmonary flow ejection murmur</td></tr>
            <tr data-family="shunt"><td><strong>VSD</strong></td><td>LA/LV volume load; RV pressure load if large</td><td>Increased</td><td>Harsh holosystolic murmur at lower left sternal border</td></tr>
            <tr data-family="shunt"><td><strong>PDA</strong></td><td>LA/LV volume overload</td><td>Increased</td><td>Continuous infraclavicular machinery murmur; bounding pulse</td></tr>
            <tr data-family="obstruction"><td><strong>Pulmonary stenosis</strong></td><td>RV pressure overload</td><td>Normal or reduced if severe</td><td>Ejection click and systolic ejection murmur; soft delayed P2</td></tr>
            <tr data-family="obstruction"><td><strong>Coarctation</strong></td><td>LV pressure overload</td><td>Usually normal</td><td>Arm hypertension, weak/delayed femorals, back murmur</td></tr>
            <tr data-family="cyanotic"><td><strong>Tetralogy of Fallot</strong></td><td>RV pressure overload with right-to-left shunt</td><td>Reduced</td><td>Single S2; RVOT ejection murmur; cyanosis</td></tr>
            <tr data-family="cyanotic"><td><strong>d-TGA</strong></td><td>Parallel circulation; mixing-dependent</td><td>Variable</td><td>Severe neonatal cyanosis, often limited murmur</td></tr>
            <tr data-family="cyanotic"><td><strong>Eisenmenger</strong></td><td>RV pressure overload and systemic cyanosis</td><td>Pulmonary vascular disease</td><td>Loud P2; original shunt murmur diminishes</td></tr>
          </tbody></table></div></div>
        </section>
      `, "Comparison")}

      ${section("Current-practice corrections", "These updates prevent common exam and clinical misconceptions.", `
        ${table(["Older statement", "Updated interpretation"], [
          ["Every lesion needs endocarditis prophylaxis", "Routine prophylaxis is limited to highest-risk CHD categories and specified dental procedures"],
          ["Pulmonary stenosis is severe above 50 mmHg", "Modern Doppler classification commonly uses peak gradient above 64 mmHg, with symptoms and RV effects also considered"],
          ["Indomethacin is the general treatment for PDA", "Cyclooxygenase inhibition is mainly a preterm-neonatal strategy; older patients usually receive catheter closure when significant"],
          ["TOF contains a mild RV enlargement and insignificant VSD", "The VSD is usually large and nonrestrictive; RV hypertrophy is secondary; RVOT obstruction determines cyanosis"],
          ["Close shunts before reversal", "Correct only after assessing shunt significance, ventricular load, pulmonary pressure, and PVR; Eisenmenger physiology contraindicates simple closure"],
          ["Childhood repair completes care", "Many repaired patients require lifelong ACHD surveillance"]
        ], "Important corrections")}
      `, "Exam traps")}
    `);
  }

  function reasoningLabPage() {
    return page("reasoning-lab", `
      ${hero({
        eyebrow: "Module 12 · Interactive revision",
        title: "Reason from the clue to the physiology, not from a memorized label",
        intro: "Use the tools below to connect murmurs, pulse patterns, S2, chamber load, pulmonary flow, and closure safety. Each tool gives an explanation rather than only a score.",
        chips: ["Murmur matcher", "Chamber load", "S2", "Pressure gradients", "Shunt closure", "Clinical reasoning"],
        visual: "heart"
      })}

      ${section("Murmur and pulse matcher", "Choose the lesion that best fits the clue. A new case appears after each answer.", `
        <section class="tool-card interactive-only" id="murmur-game">
          <h3 id="murmur-prompt">Loading clue…</h3>
          <div class="choice-list" id="murmur-choices"></div>
          <div class="tool-result" id="murmur-feedback" aria-live="polite">Select the best lesion.</div>
          <div class="tool-actions"><button class="secondary-button" id="next-murmur" type="button">Next clue</button></div>
        </section>
      `, "Pattern recognition")}

      ${section("Chamber-load challenge", "Select the primary chamber response. The explanation follows the direction of blood and distinguishes pressure from volume overload.", `
        <section class="tool-card interactive-only" id="chamber-game">
          <h3 id="chamber-prompt">Loading lesion…</h3>
          <div class="choice-list" id="chamber-choices"></div>
          <div class="tool-result" id="chamber-feedback" aria-live="polite">Choose the chamber load.</div>
          <div class="tool-actions"><button class="secondary-button" id="next-chamber" type="button">Next lesion</button></div>
        </section>
      `, "Physiology")}

      ${section("Shunt-closure safety screen", "The tool deliberately emphasizes when not to close a communication.", `
        <section class="tool-card interactive-only" id="closure-tool">
          <h3>Educational closure safety screen</h3>
          <div class="form-grid">
            <div class="field"><label for="closure-shunt">Hemodynamically significant shunt / chamber load</label><select id="closure-shunt"><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div class="field"><label for="closure-anatomy">Anatomy suitable for proposed closure</label><select id="closure-anatomy"><option value="yes">Yes</option><option value="no">No / complex</option></select></div>
            <div class="field"><label for="closure-pvr">Pulmonary vascular state</label><select id="closure-pvr"><option value="acceptable">Acceptable</option><option value="uncertain">Elevated / uncertain</option><option value="irreversible">Irreversible / Eisenmenger</option></select></div>
          </div>
          <div class="tool-actions"><button class="primary-button" id="run-closure" type="button">Screen decision</button></div>
          <div class="tool-result" id="closure-result" aria-live="polite"></div>
        </section>
      `, "Safety")}

      ${section("The fastest bedside discriminators", "Use these before reaching for rare diagnoses.", `
        <div class="mini-stat-grid">
          <div class="mini-stat"><span>Fixed split S2</span><strong>ASD</strong></div>
          <div class="mini-stat"><span>Bounding pulse</span><strong>PDA</strong></div>
          <div class="mini-stat"><span>Radiofemoral delay</span><strong>Coarctation</strong></div>
          <div class="mini-stat"><span>Soft delayed P2</span><strong>Pulmonary stenosis</strong></div>
          <div class="mini-stat"><span>Single S2 + cyanosis</span><strong>TOF</strong></div>
          <div class="mini-stat"><span>Loud P2 + quieter old murmur</span><strong>Eisenmenger</strong></div>
          <div class="mini-stat"><span>Severe early cyanosis + little distress</span><strong>d-TGA</strong></div>
          <div class="mini-stat"><span>Loud small-defect murmur</span><strong>Restrictive VSD</strong></div>
        </div>
      `, "Rapid revision")}
    `);
  }

  function flashcardsPage() {
    return page("flashcards", `
      ${hero({
        eyebrow: "Module 13 · Active recall",
        title: "Flashcards that actually flip",
        intro: "Click a card or focus it and press Enter or Space. The front asks the question; the back explains the mechanism. Use shuffle and reset to repeat the deck.",
        chips: ["18 cards", "Mouse", "Keyboard", "Shuffle", "Reset", "Mechanism-based answers"],
        visual: "heart"
      })}
      <section class="section-block">
        ${sectionHeading("Active-recall deck", "Answer aloud before revealing the back. The card remains flipped until you flip it again or reset the deck.", "Flashcards")}
        <p class="flashcard-counter"><strong id="flipped-count">0</strong> of <strong>${flashcards.length}</strong> cards revealed.</p>
        <div class="flashcard-controls interactive-only"><button class="primary-button" id="shuffle-flashcards" type="button">Shuffle deck</button><button class="secondary-button" id="reset-flashcards" type="button">Reset all cards</button><button class="secondary-button" id="flip-all-flashcards" type="button">Flip all</button></div>
        <div class="flashcard-grid" id="flashcard-grid"></div>
      </section>
    `);
  }

  function quizPage() {
    return page("quiz", `
      ${hero({
        eyebrow: "Module 14 · Clinical cases",
        title: "Use the physiology to answer the case",
        intro: "Each question gives immediate feedback and explains the mechanism. The quiz covers lesion recognition, chamber load, emergency priorities, closure safety, and lifelong follow-up.",
        chips: ["15 questions", "Immediate explanation", "Clinical clues", "Management principles", "Score", "Retry"],
        visual: "heart"
      })}
      <section class="section-block">
        ${sectionHeading("Clinical case quiz", "Select one answer. You cannot change it after the explanation appears, which encourages a deliberate first choice.", "Quiz")}
        <div id="quiz-container" class="interactive-only"></div>
      </section>
    `);
  }

  function sourcesPage() {
    return page("sources", `
      ${hero({
        eyebrow: "Module 15 · Source and scope",
        title: "Built from the supplied reconstructed congenital heart disease chapter",
        intro: "The website reorganizes the chapter into interconnected physiology-first modules, adds interactive revision tools, and keeps the original PDF available for direct review.",
        chips: ["Original PDF included", "Offline website", "No build step", "Educational use", "Guideline anchors", "Lifelong ACHD emphasis"],
        visual: "heart"
      })}

      ${section("Primary source", "The supplied chapter is included inside the website package.", `
        <div class="source-list">
          <div class="source-item"><strong>Congenital Heart Disease — Reconstructed Study Chapter</strong><p>Physiology-based classification; shunt lesions; obstructive lesions; cyanotic lesions; Eisenmenger physiology; dextrocardia; examination; current-practice corrections; lifelong care.</p><p><a href="assets/congenital-heart-disease-source.pdf" target="_blank" rel="noopener">Open the supplied source PDF</a></p></div>
        </div>
      `, "Source")}

      ${section("Guideline anchors named by the chapter", "Use official current documents and local protocols for clinical decisions, device criteria, doses, procedural details, and contraindications.", `
        <div class="source-list">
          <div class="source-item"><strong>2025 ACC/AHA/HRS/ISACHD/SCAI Guideline for Adults With Congenital Heart Disease</strong><p>The chapter cites this guideline as a current adult congenital heart disease anchor.</p><p><a href="https://www.acc.org/guidelines" target="_blank" rel="noopener">ACC guideline portal</a></p></div>
          <div class="source-item"><strong>2020 ESC Guidelines for Adult Congenital Heart Disease</strong><p>Used as a major framework for adult lesion assessment and long-term care.</p><p><a href="https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Adult-Congenital-Heart-Disease" target="_blank" rel="noopener">ESC guideline page</a></p></div>
          <div class="source-item"><strong>American Heart Association congenital heart defect resources</strong><p>Patient and clinician orientation to congenital lesions and lifelong care.</p><p><a href="https://www.heart.org/en/health-topics/congenital-heart-defects" target="_blank" rel="noopener">AHA congenital heart defects</a></p></div>
          <div class="source-item"><strong>American Heart Association infective endocarditis prevention resources</strong><p>Supports the correction that routine prophylaxis is not used for every uncomplicated congenital lesion.</p><p><a href="https://www.heart.org/en/health-topics/infective-endocarditis" target="_blank" rel="noopener">AHA infective endocarditis</a></p></div>
        </div>
      `, "References")}

      ${section("What the website adds", "The added interactivity is designed for structured revision rather than patient-specific decision-making.", `
        <div class="grid three">
          ${card("Connected modules", `<p>Hash-based routing, previous/next navigation, search, visited progress, bookmarks, and print support.</p>`, "accent-teal", "↔")}
          ${card("Reasoning tools", `<p>Lesion flow map, shunt builder, ASD closure principles, VSD states, gradient tools, tet-spell sequence, mixing explorer, and games.</p>`, "accent-violet", "Lab")}
          ${card("Revision tools", `<p>Fully functional flip flashcards and an explained clinical case quiz.</p>`, "accent-amber", "Q")}
          ${card("Text-to-speech", `<p>Each compact learning block receives a Listen button. The app first requests Google UK English Female when available.</p>`, "", "TTS")}
          ${card("Offline operation", `<p>No framework, installation, server dependency, or external content library is required for core operation.</p>`, "accent-teal", "Offline")}
          ${card("Accessibility", `<p>Semantic navigation, keyboard-operable cards and controls, focus states, reduced-motion support, and printable modules.</p>`, "accent-violet", "A11y")}
        </div>
      `, "Implementation")}

      ${callout("danger", "Educational limitation:", "This site does not replace lesion-specific assessment by pediatric or adult congenital cardiology teams. Local protocols, current device criteria, prescribing information, contraindications, and trained clinical judgment take precedence.")}
    `);
  }

  function render(routeId) {
    const pages = {
      overview: overviewPage,
      approach: approachPage,
      asd: asdPage,
      vsd: vsdPage,
      pda: pdaPage,
      "pulmonary-stenosis": pulmonaryStenosisPage,
      coarctation: coarctationPage,
      tof: tofPage,
      eisenmenger: eisenmengerPage,
      dtga: dtgaPage,
      dextrocardia: dextrocardiaPage,
      "reasoning-lab": reasoningLabPage,
      flashcards: flashcardsPage,
      quiz: quizPage,
      sources: sourcesPage
    };
    return (pages[routeId] || pages.overview)();
  }

  const searchDocs = routes.map(route => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = render(route.id);
    return {
      id: route.id,
      title: route.title,
      subtitle: route.subtitle,
      text: `${route.title} ${route.subtitle} ${wrapper.textContent}`.replace(/\s+/g, " ").trim()
    };
  });

  window.CHDContent = { routes, lesionProfiles, flashcards, quiz, render, searchDocs, lesionSvg };
})();
