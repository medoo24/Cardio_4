/* Congenital Heart Disease Lab content bank. */
(() => {
  "use strict";

  const section = (title, note = "") => `<div class="section-heading"><div><h2>${title}</h2>${note ? `<p>${note}</p>` : ""}</div></div>`;
  const card = (title, body, icon = "•") => `<article class="mini-card speech-unit"><span class="icon-badge">${icon}</span><h3>${title}</h3>${body}</article>`;
  const callout = (title, body, type = "info") => `<aside class="callout ${type} speech-unit"><h3>${title}</h3><p>${body}</p></aside>`;
  const table = (headers, rows) => `<div class="table-wrap speech-unit"><table><thead><tr>${headers.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const bullets = items => `<ul class="clean-list">${items.map(x=>`<li>${x}</li>`).join("")}</ul>`;
  const linkRow = items => `<div class="choice-row">${items.map(x=>`<button class="secondary-button" type="button" data-route="${x[0]}"><strong>${x[1]} →</strong></button>`).join("")}</div>`;

  const navGroups = [
    {title:"Foundations",items:[
      {id:"overview",label:"Overview & study map"},
      {id:"framework",label:"Physiology-first framework"},
      {id:"suspicion",label:"When to suspect CHD"},
      {id:"classification",label:"Physiology classification"},
      {id:"shunt-reasoning",label:"Reason through a shunt"},
      {id:"diagnostics",label:"Diagnostic strategy"}
    ]},
    {title:"Acyanotic shunts",items:[
      {id:"asd",label:"Atrial septal defect"},
      {id:"vsd",label:"Ventricular septal defect"},
      {id:"pda",label:"Patent ductus arteriosus"},
      {id:"shunt-lab",label:"Interactive shunt lab"}
    ]},
    {title:"Obstructive lesions",items:[
      {id:"pulmonary-stenosis",label:"Pulmonary stenosis"},
      {id:"coarctation",label:"Coarctation of the aorta"},
      {id:"aortic-stenosis",label:"Congenital aortic stenosis"}
    ]},
    {title:"Cyanotic & mixing lesions",items:[
      {id:"tof",label:"Tetralogy of Fallot"},
      {id:"tet-spell",label:"Hypercyanotic spell"},
      {id:"tga",label:"d-Transposition"},
      {id:"other-cyanotic",label:"Other cyanotic lesions"}
    ]},
    {title:"Advanced care",items:[
      {id:"eisenmenger",label:"Eisenmenger syndrome"},
      {id:"dextrocardia",label:"Dextrocardia & situs"},
      {id:"endocarditis",label:"Endocarditis prevention"},
      {id:"lifelong-care",label:"Lifelong ACHD care"},
      {id:"corrections",label:"High-yield corrections"}
    ]},
    {title:"Active revision",items:[
      {id:"lesion-map",label:"Lesion comparison explorer"},
      {id:"murmur-lab",label:"Murmur & pulse lab"},
      {id:"exam-sequence",label:"Rapid examination sequence"},
      {id:"cases",label:"Clinical cases"},
      {id:"flashcards",label:"Flashcards"},
      {id:"quiz",label:"Scored quiz"},
      {id:"sources",label:"Sources & scope"}
    ]}
  ];

  const physiologySteps = [
    {title:"Locate the connection or obstruction",body:"Start with anatomy: atrial, ventricular, great-artery, valve, outflow tract, aortic arch, or a combination. Anatomy tells you which chambers can exchange blood and which pressure load is expected.",pearl:"Do not begin by memorizing the murmur. Begin by asking where blood can or cannot flow."},
    {title:"Compare pressures and resistances",body:"Flow follows the pressure gradient, but pulmonary and systemic vascular resistances determine how large the shunt becomes. After birth, falling pulmonary vascular resistance often unmasks pulmonary overcirculation.",pearl:"A large VSD may be quiet early in neonatal life and become symptomatic as pulmonary resistance falls."},
    {title:"Determine direction and pulmonary flow",body:"Left-to-right flow increases pulmonary blood flow without initial cyanosis. Right-to-left flow bypasses the lungs and lowers systemic saturation. Parallel circulations, as in d-TGA, require mixing rather than a simple series connection.",pearl:"Cyanosis may reflect reduced pulmonary blood flow, inadequate mixing, or pulmonary vascular shunt reversal."},
    {title:"Predict the loaded chambers",body:"Atrial shunts primarily volume-load the right atrium and right ventricle. Ventricular or ductal left-to-right shunts commonly volume-load the left atrium and left ventricle. Obstruction pressure-loads the ventricle upstream from the narrowing.",pearl:"The chamber response is often more informative than defect diameter alone."},
    {title:"Connect physiology to examination",body:"Increased flow creates flow murmurs and chamber heaves. Obstruction produces ejection murmurs and altered S2. Equalization of pressures can make a serious defect quieter, so murmur intensity never replaces physiology.",pearl:"A softer murmur can mean a smaller gradient, not a safer lesion."},
    {title:"Decide whether intervention is safe",body:"Before closure, assess shunt significance, ventricular response, pulmonary pressure, pulmonary vascular resistance, anatomy, and reversibility. Advanced pulmonary vascular disease can make closure dangerous.",pearl:"Established Eisenmenger physiology is not treated by simply closing the original communication."}
  ];

  const lesionData = [
    {id:"asd",title:"Atrial septal defect",group:"Left-to-right shunt",tag:"RA/RV volume load",summary:"A low-pressure atrial communication with increased pulmonary flow and a characteristic wide fixed split S2.",details:"Secundum ASD is often suitable for device closure; primum and sinus venosus defects usually need surgery. Close significant shunts that cause right-heart enlargement when pulmonary vascular resistance is acceptable."},
    {id:"vsd",title:"Ventricular septal defect",group:"Left-to-right shunt",tag:"LA/LV volume load",summary:"Physiology ranges from a tiny restrictive defect with a loud murmur to a large nonrestrictive defect with heart failure and pulmonary hypertension.",details:"A large gradient makes a small VSD loud. As RV pressure rises, the murmur may soften. Aortic cusp prolapse, progressive aortic regurgitation, symptoms, or major volume load may drive closure."},
    {id:"pda",title:"Patent ductus arteriosus",group:"Great-artery shunt",tag:"Continuous flow",summary:"Aortic-to-pulmonary flow persists through systole and diastole, producing LA/LV volume overload, bounding pulses, and a continuous murmur.",details:"Transcatheter closure is preferred for most significant PDAs in older infants, children, and adults. In selected preterm infants, cyclooxygenase inhibition may be used. Some critical lesions instead require prostaglandin to keep the duct open."},
    {id:"pulmonary-stenosis",title:"Pulmonary stenosis",group:"Right-sided obstruction",tag:"RV pressure load",summary:"Valvular, subvalvular, or supravalvular obstruction raises RV pressure and can reduce pulmonary blood flow when severe.",details:"A valvular ejection click, harsh left-upper-sternal-border ejection murmur, delayed soft P2, and Doppler gradient define the pattern. Balloon valvuloplasty is preferred for suitable significant valvular disease."},
    {id:"coarctation",title:"Coarctation of the aorta",group:"Left-sided obstruction",tag:"LV pressure load",summary:"Aortic arch narrowing causes arm hypertension, weak or delayed femoral pulses, and impaired lower-body perfusion.",details:"Critical neonatal coarctation becomes dangerous as the duct closes and requires prostaglandin and urgent repair. Repaired patients still need lifelong blood-pressure and aortic surveillance."},
    {id:"tof",title:"Tetralogy of Fallot",group:"Cyanotic with reduced pulmonary flow",tag:"RVOT obstruction",summary:"A large VSD, overriding aorta, RV outflow obstruction, and secondary RV hypertrophy produce variable right-to-left shunting and cyanosis.",details:"The severity of RV outflow obstruction determines pulmonary flow and cyanosis. Hypercyanotic spells are emergencies aimed at restoring pulmonary flow and raising systemic vascular resistance."},
    {id:"tga",title:"d-Transposition",group:"Parallel circulation",tag:"Mixing-dependent",summary:"The aorta arises from the RV and the pulmonary artery from the LV, so the two circuits run in parallel rather than in series.",details:"Survival depends on mixing through an ASD, VSD, or PDA. Prostaglandin maintains ductal patency; urgent atrial septostomy may improve mixing; definitive treatment is neonatal arterial switch."},
    {id:"eisenmenger",title:"Eisenmenger syndrome",group:"Pulmonary vascular disease",tag:"Shunt reversal",summary:"A longstanding large systemic-to-pulmonary shunt causes irreversible pulmonary vascular remodeling, bidirectional or right-to-left flow, and systemic cyanosis.",details:"Do not simply close the communication. Management requires expert ACHD and pulmonary hypertension care, careful iron and volume assessment, and individualized advanced therapy."},
    {id:"dextrocardia",title:"Dextrocardia",group:"Position and situs",tag:"Anatomy first",summary:"The cardiac apex points right; significance depends on situs and associated intracardiac anatomy.",details:"Mirror-image situs inversus may have little structural disease, whereas dextrocardia with situs solitus is more often associated with major CHD. ECG lead placement and imaging orientation must be adapted."}
  ];

  const diagnosticData = [
    {title:"Pulse oximetry",use:"Detects subtle cyanosis, compares pre- and post-ductal saturations in neonates, and documents resting or exertional desaturation.",limit:"A normal saturation does not exclude a significant acyanotic shunt or obstruction."},
    {title:"ECG",use:"Shows chamber hypertrophy, axis, conduction abnormalities, and arrhythmias. Certain patterns support particular lesions.",limit:"It rarely defines anatomy and should not be treated as a stand-alone diagnosis."},
    {title:"Chest radiograph",use:"Assesses heart size, pulmonary plethora or oligemia, great-vessel contour, rib notching, and postoperative anatomy.",limit:"Classic signs such as a boot-shaped heart are helpful when present but are not required."},
    {title:"Transthoracic echo",use:"First-line anatomic and hemodynamic test: defect location, shunt direction, gradients, chamber response, valves, ventricular function, and pulmonary pressure.",limit:"Complex adult arch, pulmonary artery, venous, or postoperative anatomy may need CT or CMR."},
    {title:"CMR / cardiac CT",use:"Defines aorta, pulmonary arteries, veins, conduits, complex postoperative anatomy, ventricular volumes, and flow quantification.",limit:"Modality choice depends on the clinical question, radiation, device compatibility, local expertise, and need for sedation."},
    {title:"Cardiac catheterization",use:"Measures invasive pressures and pulmonary vascular resistance and permits intervention when anatomy is suitable.",limit:"It is reserved for intervention or unresolved hemodynamic questions, not used routinely when noninvasive imaging is adequate."},
    {title:"Genetic assessment",use:"Supports diagnosis when syndromic features, developmental differences, family history, or recurrent patterns suggest an inherited cause.",limit:"A genetic result complements rather than replaces complete cardiac anatomy and physiology assessment."}
  ];

  const tetSteps = [
    {title:"Recognize the spell",body:"Abrupt deepening cyanosis, tachypnea, irritability or lethargy, and sometimes syncope or seizure in a child with TOF. Triggers include crying, feeding, fever, dehydration, defecation, or exertion.",pearl:"The RV outflow murmur may become softer because less blood reaches the pulmonary artery."},
    {title:"Calm and position",body:"Minimize distress and place the child in the knee-chest position. This increases systemic vascular resistance and reduces right-to-left shunting.",pearl:"A calm environment is treatment: agitation can intensify infundibular spasm."},
    {title:"Support airway and oxygenation",body:"Provide oxygen and airway support as needed. Oxygen alone may not normalize saturation because the primary problem is intracardiac shunting and reduced pulmonary flow.",pearl:"Do not delay broader resuscitation while waiting for saturation to normalize."},
    {title:"Improve preload",body:"Correct dehydration and give volume when clinically indicated. Better filling can reduce dynamic outflow obstruction and support pulmonary flow.",pearl:"Volume is targeted, not automatic; assess perfusion and heart failure risk."},
    {title:"Reduce spasm and raise SVR",body:"Beta-blockade may reduce infundibular spasm, while vasoconstrictor support can raise systemic vascular resistance in severe spells under emergency protocols.",pearl:"The physiologic goals are increased SVR, improved preload, and less RVOT obstruction."},
    {title:"Escalate urgently",body:"A severe or persistent spell requires urgent congenital cardiology and definitive surgical planning. Recurrent spells indicate an unstable circulation.",pearl:"Treat the spell now, then address the anatomy that allows it to recur."}
  ];

  const modules = {
    overview:{
      title:"Congenital heart disease",kicker:"Chapter 4 · Interactive cardiology lab",lead:"Study congenital lesions as flow problems rather than isolated names: identify the connection or obstruction, predict shunt direction and chamber load, recognize the bedside pattern, choose the right imaging, and know when intervention becomes urgent or unsafe.",
      html:`
        <section class="hero speech-unit">
          <div>
            <p class="eyebrow" style="color:#d6fff5">Anatomy → pressure → flow → chamber response → clinical picture</p>
            <h2>Follow the blood, then the diagnosis becomes predictable.</h2>
            <p>Congenital heart disease is best organized into left-to-right shunts, right- or left-sided obstruction, cyanotic lesions with reduced pulmonary flow, parallel or mixing-dependent circulations, and pulmonary vascular disease with shunt reversal.</p>
            <div class="hero-actions">
              <button class="primary-button" type="button" data-route="framework">Build the framework</button>
              <button class="ghost-button" type="button" data-route="lesion-map" style="color:#fff;border-color:rgba(255,255,255,.45)">Explore lesions</button>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <svg viewBox="0 0 520 390">
              <defs><linearGradient id="chdHeart" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#83e5d5"/><stop offset="1" stop-color="#13647a"/></linearGradient><filter id="chdGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <path d="M260 350C112 272 76 154 128 81c36-51 106-40 132 15 26-55 96-66 132-15 52 73 16 191-132 269Z" fill="url(#chdHeart)" stroke="#e8fffa" stroke-width="5"/>
              <path d="M260 105v204M168 194h184" stroke="#d8fff6" stroke-width="8" opacity=".65"/>
              <circle cx="260" cy="194" r="22" fill="#f4c65d" filter="url(#chdGlow)"/>
              <path d="M138 73c72-50 142-25 122 33M382 73c-72-50-142-25-122 33" fill="none" stroke="#f5ffff" stroke-width="14" stroke-linecap="round"/>
              <path d="M153 113c-37 59-30 125 5 172M367 113c37 59 30 125-5 172" fill="none" stroke="#b8eee8" stroke-width="11" stroke-linecap="round"/>
              <g fill="#fff" font-size="13" font-weight="800"><text x="37" y="68">Pulmonary flow</text><text x="374" y="68">Systemic flow</text><text x="218" y="193">shunt</text></g>
            </svg>
          </div>
        </section>
        <section class="section-block">
          ${section("Chapter architecture","Every module links back to physiology and forward to clinical decisions.")}
          <div class="card-grid">
            ${card("Acyanotic shunts","<p>ASD, VSD, and PDA increase pulmonary flow and create characteristic chamber volume loads.</p>","L→R")}
            ${card("Obstructive lesions","<p>Pulmonary stenosis pressure-loads the RV; coarctation and congenital aortic stenosis pressure-load the LV.</p>","⇥")}
            ${card("Cyanotic lesions","<p>TOF reduces pulmonary flow, while d-TGA requires mixing between parallel circuits.</p>","O₂")}
            ${card("Pulmonary vascular disease","<p>Longstanding shunts can become irreversible, reverse direction, and produce Eisenmenger physiology.</p>","PVR")}
            ${card("Bedside pattern","<p>S2, pulses, blood-pressure distribution, cyanosis, and chamber heaves often reveal the physiology before imaging.</p>","S2")}
            ${card("Lifelong care","<p>Repair is not always cure; arrhythmias, valve disease, ventricular dysfunction, aortopathy, and reintervention can emerge later.</p>","∞")}
          </div>
        </section>
        <section class="section-block">
          ${section("Seven anchors")}
          <div class="exam-strip speech-unit"><strong>ASD</strong><span>fixed split S2</span><strong>VSD</strong><span>holosystolic murmur</span><strong>PDA</strong><span>continuous murmur + bounding pulse</span><strong>PS</strong><span>ejection murmur + delayed P2</span><strong>Coarctation</strong><span>arm hypertension + weak femorals</span><strong>TOF</strong><span>RVOT obstruction + cyanosis</span><strong>Eisenmenger</strong><span>shunt reversal: do not simply close</span></div>
        </section>
        ${callout("Core safety principle","The visible defect is not the complete diagnosis. Management depends on flow magnitude, chamber response, pulmonary vascular resistance, associated anatomy, symptoms, and the consequences of intervention.","danger")}
      `
    },

    framework:{
      title:"Physiology-first framework",kicker:"Foundations 1 · Interactive sequence",lead:"Use the same six questions for every lesion. This turns a long list of congenital defects into a repeatable reasoning process.",
      html:`
        <section class="interactive-panel interactive-only">
          <div class="pathway-map">
            <div class="step-list" id="physiology-step-list"></div>
            <div class="step-stage speech-unit" id="physiology-stage"></div>
          </div>
        </section>
        <section class="section-block">
          ${section("The complete reasoning chain")}
          <div class="flow-chain speech-unit">${["Anatomic connection","Pressure gradient","Direction of flow","Pulmonary blood flow","Chamber response","Symptoms / cyanosis","Intervention safety"].map((x,i)=>`<div class="flow-step"><strong>${i+1}</strong><span>${x}</span></div>`).join("")}</div>
        </section>
        ${callout("Why this works","Auscultation, radiography, ECG, and symptoms are downstream consequences of anatomy and flow. When the chain is correct, the findings become easier to predict and harder to confuse.","success")}
      `
    },

    suspicion:{
      title:"When to suspect congenital heart disease",kicker:"Foundations 2",lead:"Suspicion begins with cyanosis, abnormal pulses or S2, a murmur, infant heart-failure symptoms, growth failure, syndromic clues, or an unexplained adult finding.",
      html:`
        <section class="section-block">
          ${table(["Clue","Clinical meaning","Immediate next thought"],[
            ["Cyanosis or low saturation","Right-to-left shunt, inadequate pulmonary blood flow, or abnormal mixing","Onset, pre/post-ductal difference, respiratory distress, and response to oxygen"],
            ["Murmur or abnormal S2","Increased flow, obstruction, regurgitation, or a residual/repaired lesion","Describe S2 before the murmur; loudness alone does not grade severity"],
            ["Feeding difficulty, tachypnea, sweating, poor growth","Pulmonary overcirculation or heart failure in infancy","Look for hepatomegaly, retractions, gallop, and chamber enlargement"],
            ["Upper-limb hypertension or weak femorals","Coarctation until proved otherwise","Four-limb pressures and simultaneous brachial-femoral palpation"],
            ["Clubbing, erythrocytosis, hemoptysis","Chronic cyanosis or pulmonary vascular disease","Assess saturation, iron status, pulmonary pressure, and specialist urgency"],
            ["Associated anomalies or family history","Syndromic or inherited CHD","Complete physical examination and targeted genetic assessment"]
          ])}
        </section>
        <section class="section-block">
          ${section("Age-pattern clues")}
          <div class="card-grid">
            ${card("First hours to days","<p>Severe cyanosis, shock as the duct closes, or poor systemic perfusion suggests a duct-dependent or mixing-dependent lesion.</p>","0–7d")}
            ${card("Early infancy","<p>Large VSD or PDA often becomes symptomatic after pulmonary vascular resistance falls.</p>","1–8w")}
            ${card("Childhood","<p>Murmur, exercise limitation, differential pulses, or cyanosis may reveal a previously compensated lesion.</p>","Child")}
            ${card("Adulthood","<p>ASD, repaired CHD, coarctation, arrhythmia, pulmonary hypertension, or pregnancy evaluation may uncover disease.</p>","Adult")}
            ${card("After repair","<p>Residual shunts, valve regurgitation, outflow obstruction, conduit degeneration, or rhythm disease can appear years later.</p>","Post-op")}
            ${card("Emergency red flag","<p>Shock, profound cyanosis, altered consciousness, severe respiratory distress, or a hypercyanotic spell requires urgent specialist care.</p>","!")}
          </div>
        </section>
        ${callout("Important correction","Absence of rheumatic fever does not diagnose congenital disease, and a congenital lesion may remain silent until adulthood. Diagnosis depends on anatomy and physiology, not history alone.","warning")}
      `
    },

    classification:{
      title:"Physiology-based classification",kicker:"Foundations 3",lead:"Classify by what the lesion does to flow. The same anatomy can behave differently as pressure and pulmonary vascular resistance change.",
      html:`
        <section class="section-block">
          ${table(["Physiologic group","Typical lesions","Pulmonary flow","Dominant consequence"],[
            ["Left-to-right shunt","ASD, VSD, PDA, AV septal defect","Increased","Pulmonary overcirculation and chamber volume overload; cyanosis appears only after advanced reversal"],
            ["Right-sided obstruction","Pulmonary stenosis, pulmonary atresia","Normal or reduced","RV pressure overload; severe obstruction may cause cyanosis"],
            ["Left-sided obstruction","Coarctation, congenital aortic stenosis","Usually normal","LV pressure overload and impaired systemic flow; critical lesions may be duct-dependent"],
            ["Cyanotic with reduced pulmonary flow","TOF, tricuspid atresia with pulmonary obstruction","Reduced","Right-to-left shunting, oligemia, cyanosis"],
            ["Parallel or mixing-dependent circulation","d-TGA, selected single-ventricle physiology","Variable","Survival depends on mixing through ASD, VSD, PDA, or intervention"],
            ["Pulmonary vascular disease","Eisenmenger syndrome","Advanced vascular disease","Bidirectional or right-to-left shunt with cyanosis and multisystem consequences"]
          ])}
        </section>
        <section class="section-block">
          ${section("Fast classifier")}
          <div class="decision-grid">
            <article class="decision-card speech-unit"><span class="score-badge">1</span><h3>Is saturation low?</h3><p>No: think shunt or obstruction. Yes: decide reduced pulmonary flow, poor mixing, or shunt reversal.</p></article>
            <article class="decision-card speech-unit"><span class="score-badge">2</span><h3>Is pulmonary flow high or low?</h3><p>Plethora supports left-to-right flow or mixing with overcirculation; oligemia supports reduced pulmonary flow.</p></article>
            <article class="decision-card speech-unit"><span class="score-badge">3</span><h3>Which ventricle is loaded?</h3><p>RV volume load suggests ASD; LA/LV volume load suggests VSD or PDA; pressure load suggests obstruction.</p></article>
            <article class="decision-card speech-unit"><span class="score-badge">4</span><h3>What happened to S2 and pulses?</h3><p>Fixed split, single S2, loud P2, delayed P2, bounding pulses, or weak femorals are high-yield discriminators.</p></article>
          </div>
        </section>
        ${linkRow([["shunt-lab","Apply this in the shunt lab"],["lesion-map","Compare lesions side by side"]])}
      `
    },

    "shunt-reasoning":{
      title:"How to reason through a shunt",kicker:"Foundations 4",lead:"A shunt is not merely a hole. Its clinical importance depends on pressure, resistance, flow magnitude, chamber response, and whether the direction remains reversible.",
      html:`
        <section class="section-block">
          <div class="timeline speech-unit">
            <div class="timeline-item"><span class="timeline-dot">1</span><div class="timeline-body"><h3>Identify the level</h3><p>Atrial, ventricular, great-artery, or multiple connections.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">2</span><div class="timeline-body"><h3>Define the gradient</h3><p>Which side has higher pressure, and does the gradient persist in systole, diastole, or both?</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">3</span><div class="timeline-body"><h3>Estimate pulmonary-to-systemic flow</h3><p>Use imaging, chamber enlargement, and when needed formal Qp:Qs measurement.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">4</span><div class="timeline-body"><h3>Find the volume-loaded chambers</h3><p>The chamber response tells you where the extra blood returns and how long the burden has existed.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">5</span><div class="timeline-body"><h3>Assess pulmonary vascular resistance</h3><p>This is essential before closure when pulmonary hypertension is present.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">6</span><div class="timeline-body"><h3>Look for reversal</h3><p>Bidirectional or right-to-left flow changes prognosis and may make simple closure unsafe.</p></div></div>
          </div>
        </section>
        <section class="section-block">
          ${section("Classic chamber-load patterns")}
          ${table(["Lesion","Primary volume/pressure response","Why"],[
            ["ASD","RA and RV volume overload","Extra blood crosses at atrial level and is pumped through the right heart"],
            ["VSD","LA/LV volume overload; RV pressure load if large","Extra pulmonary flow returns to LA/LV; large defects transmit LV pressure to RV"],
            ["PDA","LA/LV volume overload","Aortic blood enters pulmonary artery and returns through pulmonary veins"],
            ["Pulmonary stenosis","RV pressure overload","The RV ejects against an obstructed outflow"],
            ["Coarctation / aortic stenosis","LV pressure overload","The LV ejects against systemic outflow obstruction"]
          ])}
        </section>
        ${callout("Exam trap","A small restrictive VSD may have the loudest murmur because the pressure gradient is high. A large nonrestrictive VSD or Eisenmenger VSD may sound softer because pressures equalize.","danger")}
      `
    },

    diagnostics:{
      title:"Diagnostic strategy",kicker:"Foundations 5 · Interactive test explorer",lead:"Choose each test for a specific question. Echocardiography is the first-line anatomic and hemodynamic study, but complex anatomy and pulmonary vascular disease may require advanced imaging or catheterization.",
      html:`
        <section class="interactive-panel interactive-only">
          <div class="evidence-explorer">
            <div class="evidence-tabs" id="diagnostic-tabs"></div>
            <div class="evidence-stage speech-unit" id="diagnostic-stage"></div>
          </div>
        </section>
        <section class="section-block">
          ${section("Question-based test plan")}
          <div class="card-grid">
            ${card("Is the child cyanotic?","<p>Pulse oximetry, pre/post-ductal comparison, blood gas when needed, and urgent assessment of mixing or duct dependence.</p>","O₂")}
            ${card("What is the anatomy?","<p>Transthoracic echo first; TEE, CMR, or CT for detailed septal, venous, arch, pulmonary artery, or postoperative anatomy.</p>","Echo")}
            ${card("How severe is obstruction?","<p>Doppler velocity and gradient, ventricular response, symptoms, and sometimes catheter pressure measurement.</p>","ΔP")}
            ${card("How large is the shunt?","<p>Chamber enlargement, pulmonary flow, Qp:Qs, and pulmonary pressure define hemodynamic significance.</p>","Qp")}
            ${card("Can it be safely closed?","<p>Assess pulmonary vascular resistance, reversibility, anatomy, and whether the shunt is supporting a failing circulation.</p>","PVR")}
            ${card("What will matter later?","<p>Baseline rhythm, ventricular function, valve function, aortic dimensions, exercise capacity, and pregnancy risk.</p>","∞")}
          </div>
        </section>
        ${callout("Lifelong-care principle","Successful childhood repair is not always a cure. Follow-up intensity depends on lesion complexity, residual disease, ventricular consequences, and the type of repair.","success")}
      `
    },

    asd:{
      title:"Atrial septal defect",kicker:"Acyanotic shunts 1",lead:"ASD is a low-pressure left-to-right atrial shunt that mainly volume-loads the right atrium and right ventricle. The defect itself is usually quiet; the classic murmur is increased flow across the pulmonary valve.",
      html:`
        <section class="section-block">
          ${section("Anatomy and closure approach")}
          ${table(["Type","Location / association","Typical closure approach"],[
            ["Secundum ASD","Fossa ovalis; most common true ASD","Transcatheter device closure when size and rims are suitable; surgery otherwise"],
            ["Primum ASD","Low atrial septum; part of AV septal defect; AV valve abnormalities","Surgical repair"],
            ["Sinus venosus defect","Near SVC or IVC; often partial anomalous pulmonary venous return","Surgery or selected advanced transcatheter repair"],
            ["Coronary sinus defect","Unroofing of coronary sinus; uncommon","Surgery in most significant cases"],
            ["Patent foramen ovale","Flap-valve persistence, not loss of septal tissue","Not managed as an ASD; closure only for selected indications"]
          ])}
        </section>
        <section class="section-block">
          ${section("Clinical picture")}
          <div class="card-grid">
            ${card("Often silent in childhood","<p>Adults may develop exertional dyspnea, atrial arrhythmia, or right-heart failure.</p>","…")}
            ${card("Wide fixed split S2","<p>RV ejection is prolonged and respiratory variation is blunted by reciprocal changes in shunt flow.</p>","S2")}
            ${card("Pulmonary flow murmur","<p>Systolic ejection murmur at the left upper sternal border; the atrial defect itself has a low gradient.</p>","♪")}
            ${card("Right ventricular heave","<p>Reflects chronic RV volume load and later pressure load if pulmonary hypertension develops.</p>","RV")}
            ${card("Tricuspid flow murmur","<p>A large shunt may produce a mid-diastolic murmur from increased tricuspid flow.</p>","TV")}
            ${card("Atrial arrhythmia","<p>Flutter or fibrillation becomes more common with age and atrial enlargement.</p>","AF")}
          </div>
        </section>
        <section class="section-block">
          ${section("When closure is appropriate")}
          ${table(["Question","Principle"],[
            ["Is the shunt significant?","Look for right atrial/RV enlargement, symptoms, and pulmonary overcirculation rather than defect visibility alone"],
            ["Is anatomy suitable?","Secundum defects require adequate rims and appropriate size for device closure"],
            ["Is pulmonary vascular resistance acceptable?","Advanced pulmonary vascular disease can make closure harmful"],
            ["What follows closure?","Assess residual shunt, device position, arrhythmia, pulmonary pressure, RV remodeling, and associated lesions"]
          ])}
        </section>
        ${callout("Do not close reflexively","An ASD is not closed solely because it is visible. Established Eisenmenger physiology is a contraindication to simple closure.","danger")}
        ${linkRow([["eisenmenger","Why closure can become unsafe"],["murmur-lab","Compare S2 and murmurs"]])}
      `
    },

    vsd:{
      title:"Ventricular septal defect",kicker:"Acyanotic shunts 2",lead:"VSD physiology ranges from a small restrictive defect with a large pressure gradient and loud murmur to a large nonrestrictive defect with pulmonary overcirculation, heart failure, pulmonary hypertension, and eventual reversal.",
      html:`
        <section class="section-block">
          ${section("Anatomic types")}
          ${table(["Type","Key features"],[
            ["Perimembranous","Most common; close to aortic and tricuspid valves; may cause aortic cusp prolapse and aortic regurgitation"],
            ["Muscular","Single or multiple; small muscular defects often close spontaneously"],
            ["Inlet","Near AV valves; often associated with AV septal defects"],
            ["Outlet / subarterial","Near semilunar valves; increased risk of aortic cusp prolapse and progressive regurgitation"]
          ])}
        </section>
        <section class="section-block">
          ${section("Hemodynamics: size is not enough")}
          ${table(["Physiology","Pressure / chamber consequence","Typical murmur"],[
            ["Small restrictive VSD","Large LV-to-RV gradient, little volume load, normal pulmonary pressure","Very loud harsh holosystolic murmur with thrill"],
            ["Moderate VSD","Meaningful left-to-right shunt, LA/LV volume overload, pulmonary overcirculation","Holosystolic murmur; possible mitral flow rumble"],
            ["Large nonrestrictive VSD","RV pressure approaches LV pressure, major pulmonary flow, early pulmonary hypertension","Murmur may be shorter or softer as gradient falls"],
            ["Eisenmenger VSD","PVR becomes systemic or suprasystemic; bidirectional/right-to-left flow","Original murmur diminishes; loud P2 and cyanosis dominate"]
          ])}
        </section>
        <section class="section-block">
          ${section("Clinical timeline")}
          <div class="flow-chain speech-unit">${["Birth: PVR high","PVR falls","L→R shunt increases","Pulmonary overcirculation","LA/LV volume load","Heart failure / poor growth","Pulmonary vascular disease if untreated"].map((x,i)=>`<div class="flow-step"><strong>${i+1}</strong><span>${x}</span></div>`).join("")}</div>
        </section>
        <section class="section-block">
          ${section("Management principles")}
          ${table(["Situation","Approach"],[
            ["Small uncomplicated restrictive VSD","Observation; many muscular defects close spontaneously"],
            ["Large symptomatic VSD","Stabilize heart failure, then close before irreversible pulmonary vascular disease"],
            ["Aortic cusp prolapse or progressive AR","Consider closure even when the shunt is not large"],
            ["Prior endocarditis attributable to VSD","Closure may be considered depending on anatomy and residual risk"],
            ["Established Eisenmenger physiology","Do not close; refer for ACHD and pulmonary hypertension management"]
          ])}
        </section>
        ${callout("Classic exam trap","The louder murmur may belong to the smaller restrictive defect. A quieter murmur can indicate pressure equalization and more advanced disease.","warning")}
      `
    },

    pda:{
      title:"Patent ductus arteriosus",kicker:"Acyanotic shunts 3",lead:"The fetal duct connects the proximal descending aorta to the pulmonary artery. Persistence after birth usually creates continuous aortic-to-pulmonary flow, pulmonary overcirculation, and LA/LV volume loading.",
      html:`
        <section class="section-block">
          <div class="flow-chain speech-unit">${["Aorta","Continuous L→R flow","Pulmonary artery","Pulmonary overcirculation","LA/LV volume load","Heart failure / PH"].map((x,i)=>`<div class="flow-step"><strong>${i+1}</strong><span>${x}</span></div>`).join("")}</div>
        </section>
        <section class="section-block">
          ${section("Clinical findings")}
          ${table(["Finding","Interpretation"],[
            ["Small PDA","Often asymptomatic; continuous murmur may be the only sign"],
            ["Large PDA in infancy","Tachypnea, feeding difficulty, poor growth, recurrent respiratory symptoms, heart failure"],
            ["Bounding pulses / wide pulse pressure","High stroke volume plus diastolic runoff into the pulmonary artery"],
            ["Continuous machinery-like murmur","Usually maximal below the left clavicle; a thrill may be palpable"],
            ["Differential cyanosis","In Eisenmenger PDA, desaturated blood enters the descending aorta, affecting lower limbs more than upper limbs"]
          ])}
        </section>
        <section class="section-block">
          ${section("Close it—or keep it open?")}
          <div class="compare-grid">
            <article class="compare-card blue speech-unit"><h3>Close a significant PDA</h3><p>Transcatheter closure is preferred for most suitable children and adults with LV volume load or important shunting. Surgery is used when anatomy is unsuitable.</p></article>
            <article class="compare-card red speech-unit"><h3>Keep the duct open in critical CHD</h3><p>Prostaglandin E1 maintains ductal patency in lesions such as critical coarctation, pulmonary atresia, or d-TGA while definitive treatment is arranged.</p></article>
          </div>
        </section>
        ${callout("Medication correction","Cyclooxygenase inhibitors are mainly a selected preterm/neonatal strategy. They are not the general treatment for a significant PDA in older children or adults.","warning")}
      `
    },

    "shunt-lab":{
      title:"Interactive shunt lab",kicker:"Acyanotic shunts 4 · Build the physiology",lead:"Choose a lesion and see how the communication, pressure gradient, pulmonary flow, chamber load, examination, and closure logic connect.",
      html:`
        <section class="interactive-panel interactive-only">
          <div class="form-grid">
            <label class="field"><span>Lesion</span><select id="shunt-lesion" class="wide-select"><option value="asd">ASD</option><option value="vsd">VSD</option><option value="pda">PDA</option><option value="eisenmenger">Eisenmenger physiology</option></select></label>
            <label class="field"><span>Clinical phase</span><select id="shunt-phase" class="wide-select"><option value="typical">Typical left-to-right phase</option><option value="large">Large / hemodynamically important</option><option value="reversed">Pulmonary vascular reversal</option></select></label>
          </div>
          <div class="result-panel speech-unit" id="shunt-result"></div>
        </section>
        <section class="section-block">
          ${section("What the lab is testing")}
          <div class="card-grid">
            ${card("Connection","<p>Atrial, ventricular, or arterial level.</p>","A")}
            ${card("Direction","<p>Left-to-right, bidirectional, or right-to-left.</p>","→")}
            ${card("Pulmonary flow","<p>Increased before reversal; advanced vascular disease changes the pattern.</p>","Lung")}
            ${card("Chamber load","<p>ASD loads RA/RV; VSD and PDA load LA/LV; large VSD also pressure-loads RV.</p>","4C")}
            ${card("Bedside sign","<p>S2, murmur, pulses, and cyanosis reflect the hemodynamics.</p>","S2")}
            ${card("Closure logic","<p>Significant reversible shunts may be closed; irreversible Eisenmenger physiology is not.</p>","✓")}
          </div>
        </section>
        ${callout("Educational limitation","This lab teaches patterns. Real closure decisions require complete echo, sometimes catheter hemodynamics, lesion-specific criteria, and congenital cardiology expertise.","danger")}
      `
    },

    "pulmonary-stenosis":{
      title:"Pulmonary stenosis",kicker:"Obstructive lesions 1",lead:"Pulmonary stenosis raises right ventricular systolic pressure. Severe obstruction can reduce pulmonary blood flow, elevate right atrial pressure, and cause cyanosis or right-heart failure.",
      html:`
        <section class="section-block">
          ${section("Anatomic levels")}
          ${table(["Level","Typical features"],[
            ["Valvular","Most common; doming leaflets with commissural fusion; dysplastic valves may occur in genetic syndromes"],
            ["Subvalvular / infundibular","Muscular narrowing in the RV outflow tract; may be isolated or part of TOF"],
            ["Supravalvular / branch pulmonary artery","Narrowing above the valve or in branch pulmonary arteries; associated with syndromes or previous surgery"]
          ])}
        </section>
        <section class="section-block">
          ${section("Examination and Doppler")}
          ${table(["Feature","Typical finding"],[
            ["Palpation","Left parasternal heave and pulmonary-area systolic thrill when significant"],
            ["S2","P2 becomes soft and delayed; splitting widens as obstruction increases"],
            ["Ejection click","Common in valvular stenosis and may become softer with inspiration; absent in subvalvular disease"],
            ["Murmur","Harsh crescendo-decrescendo systolic ejection murmur at the left upper sternal border, often radiating to the back"],
            ["Doppler peak gradient","Mild below 36 mmHg; moderate 36–64 mmHg; severe above 64 mmHg"]
          ])}
        </section>
        <section class="section-block">
          ${section("Management ladder")}
          <div class="timeline speech-unit">
            <div class="timeline-item"><span class="timeline-dot">1</span><div class="timeline-body"><h3>Mild, asymptomatic</h3><p>Observe with periodic echocardiography.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">2</span><div class="timeline-body"><h3>Suitable significant valvular stenosis</h3><p>Balloon pulmonary valvuloplasty is the preferred intervention.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">3</span><div class="timeline-body"><h3>Unfavorable anatomy</h3><p>Surgery for dysplastic valves, sub/supravalvular obstruction, associated lesions, or anatomy unsuitable for catheter treatment.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">4</span><div class="timeline-body"><h3>Critical neonatal obstruction</h3><p>Urgent stabilization; prostaglandin may be needed to maintain ductal pulmonary flow.</p></div></div>
          </div>
        </section>
        ${callout("Current-practice correction","Routine infective endocarditis prophylaxis is not recommended for uncomplicated native pulmonary stenosis.","warning")}
      `
    },

    coarctation:{
      title:"Coarctation of the aorta",kicker:"Obstructive lesions 2 · Includes arm–leg tool",lead:"Coarctation is a discrete or tubular narrowing of the aortic arch, usually near the ductal insertion. It can present as neonatal shock or as upper-body hypertension with weak femoral pulses later in life.",
      html:`
        <section class="section-block">
          ${section("Anatomy and associations")}
          <div class="card-grid">
            ${card("Bicuspid aortic valve","<p>A common associated lesion that also requires lifelong surveillance.</p>","BAV")}
            ${card("Arch hypoplasia","<p>May make neonatal disease and surgical anatomy more complex.</p>","Arch")}
            ${card("VSD","<p>May coexist and alter infant hemodynamics.</p>","VSD")}
            ${card("Turner syndrome","<p>An important syndromic association.</p>","45X")}
            ${card("Aortic aneurysm","<p>Native or repaired segments can develop aneurysm or dissection risk.</p>","Ao")}
            ${card("Intracranial aneurysm risk","<p>Cerebrovascular risk is part of lifelong assessment.</p>","CNS")}
          </div>
        </section>
        ${callout("Neonatal emergency","Critical coarctation may appear well while the duct is open, then cause shock, acidosis, renal dysfunction, and weak lower-body perfusion as the duct closes. Give urgent prostaglandin and arrange specialist repair.","danger")}
        <section class="section-block interactive-only">
          ${section("Arm–leg systolic pressure explorer","This is a bedside learning aid, not a diagnostic threshold calculator.")}
          <div class="interactive-panel">
            <div class="form-grid">
              <label class="field"><span>Right-arm systolic pressure (mmHg)</span><input id="arm-pressure" type="number" min="0" max="300" value="140"></label>
              <label class="field"><span>Leg systolic pressure (mmHg)</span><input id="leg-pressure" type="number" min="0" max="300" value="105"></label>
            </div>
            <div class="result-panel speech-unit" id="gradient-result"></div>
          </div>
        </section>
        <section class="section-block">
          ${section("Hemodynamics and examination")}
          ${table(["Feature","Typical finding"],[
            ["Blood pressure","Arms higher than legs; upper-body hypertension can persist after repair"],
            ["Pulses","Weak or delayed femoral pulses with radiofemoral delay"],
            ["Older-child/adult symptoms","Headache, epistaxis, leg fatigue or claudication; many remain asymptomatic"],
            ["Murmur","Systolic murmur at left infraclavicular region and back; continuous collateral murmurs may occur"],
            ["Collateral signs","Interscapular pulsations and inferior rib notching, usually ribs 3–8, in longstanding disease"],
            ["Cardiac response","LV hypertrophy from pressure overload"]
          ])}
        </section>
        <section class="section-block">
          ${section("Lifelong follow-up")}
          ${bullets(["Arm and ambulatory blood pressure","Exercise-induced hypertension","Recoarctation or residual arch obstruction","Bicuspid valve and ascending aorta","Aneurysm formation and cerebrovascular risk","Pregnancy planning and exercise advice"])}
        </section>
        ${callout("High-yield point","A low resting arm–leg gradient does not exclude important repaired coarctation. Collaterals, arch geometry, and exercise hypertension can conceal residual disease.","warning")}
      `
    },

    "aortic-stenosis":{
      title:"Congenital aortic stenosis",kicker:"Obstructive lesions 3",lead:"Congenital aortic obstruction may be valvular, subvalvular, or supravalvular. Severe neonatal disease can be duct-dependent and requires urgent stabilization and intervention.",
      html:`
        <section class="section-block">
          ${table(["Level","Orientation","Important consequences"],[
            ["Valvular","Bicuspid or dysplastic valve; most common congenital form","LV pressure overload, post-stenotic aortic dilatation, progressive valve disease"],
            ["Subvalvular","Discrete membrane or tunnel below the valve","Progressive gradient and possible aortic regurgitation from jet injury"],
            ["Supravalvular","Narrowing above the valve, often at sinotubular junction","May be syndromic and can involve coronary perfusion or branch vessels"]
          ])}
        </section>
        <section class="section-block">
          ${section("Clinical pattern")}
          <div class="card-grid">
            ${card("LV pressure load","<p>Concentric hypertrophy develops as the LV ejects against obstruction.</p>","LV")}
            ${card("Ejection murmur","<p>Crescendo-decrescendo systolic murmur, often at the right upper sternal border with neck radiation.</p>","♪")}
            ${card("Severe symptoms","<p>Exertional chest pain, syncope, dyspnea, or reduced exercise tolerance require urgent evaluation.</p>","!")}
            ${card("Critical neonate","<p>Poor perfusion, acidosis, respiratory distress, and shock as ductal systemic support falls.</p>","PGE₁")}
            ${card("Echo first","<p>Define valve morphology, Doppler gradient, LV function, and associated aortic anatomy.</p>","Echo")}
            ${card("Lifelong valve/aorta care","<p>Bicuspid valve disease and aortopathy can progress after childhood.</p>","∞")}
          </div>
        </section>
        ${callout("Integration principle","Intervention decisions combine symptoms, Doppler severity, ventricular function, anatomy, and age. A single gradient should not be interpreted without flow and clinical context.","warning")}
      `
    },

    tof:{
      title:"Tetralogy of Fallot",kicker:"Cyanotic lesions 1",lead:"TOF combines a large VSD, overriding aorta, right ventricular outflow obstruction, and secondary RV hypertrophy. The severity of outflow obstruction—not the VSD size—mainly determines pulmonary flow and cyanosis.",
      html:`
        <section class="section-block">
          ${section("The four components")}
          <div class="card-grid">
            ${card("Large VSD","<p>Usually nonrestrictive, allowing ventricular pressures to equalize.</p>","1")}
            ${card("RV outflow obstruction","<p>Infundibular, valvular, or pulmonary-artery obstruction; the main determinant of cyanosis.</p>","2")}
            ${card("Overriding aorta","<p>The aorta receives blood from both ventricles because it lies over the VSD.</p>","3")}
            ${card("RV hypertrophy","<p>A consequence of chronic RV pressure overload, not the primary embryologic lesion.</p>","4")}
          </div>
        </section>
        <section class="section-block">
          ${section("Clinical presentation")}
          ${table(["Feature","Explanation"],[
            ["Cyanosis","Varies with RVOT obstruction; may be absent at birth and worsen as infundibular narrowing increases"],
            ["Clubbing / growth delay","Develop with chronic hypoxemia in unrepaired or palliated disease"],
            ["S2","Usually single because P2 is soft or absent"],
            ["Murmur","Harsh systolic ejection murmur from RVOT obstruction; the VSD is often silent because ventricular pressures are similar"],
            ["Chest radiograph","Boot-shaped heart may appear with RV hypertrophy, upturned apex, and reduced pulmonary markings"],
            ["ECG","Right-axis deviation and RV hypertrophy in unrepaired disease"]
          ])}
        </section>
        <section class="section-block">
          ${section("Repair and later consequences")}
          ${table(["Stage","Key points"],[
            ["Initial strategy","Complete repair is preferred in most infants; selected unstable or very small infants may need palliation first"],
            ["Complete repair","Close VSD and relieve RVOT obstruction while avoiding excessive pulmonary regurgitation"],
            ["Late complications","Pulmonary regurgitation, RV dilatation/dysfunction, residual RVOT obstruction, tricuspid regurgitation, arrhythmia, aortic-root dilatation, ventricular dysfunction, sudden-death risk"],
            ["Reintervention","Pulmonary valve replacement decisions use symptoms, RV size/function, exercise capacity, arrhythmia, and imaging thresholds"],
            ["Surveillance","Lifelong ACHD follow-up with ECG, rhythm monitoring, echocardiography/CMR, exercise testing, and pregnancy counseling"]
          ])}
        </section>
        ${callout("Important correction","Classic TOF does not contain an insignificant VSD or merely mild RV enlargement. The VSD is usually large and nonrestrictive; RV hypertrophy is a consequence of pressure overload.","danger")}
        ${linkRow([["tet-spell","Manage a hypercyanotic spell"],["lifelong-care","Review repaired-TOF surveillance"]])}
      `
    },

    "tet-spell":{
      title:"Hypercyanotic (tet) spell",kicker:"Cyanotic lesions 2 · Emergency sequence",lead:"A tet spell is an abrupt increase in right-to-left shunting, often caused by infundibular spasm, reduced systemic vascular resistance, low preload, or a trigger that increases oxygen demand and distress.",
      html:`
        <section class="interactive-panel interactive-only">
          <div class="pathway-map">
            <div class="step-list" id="tet-step-list"></div>
            <div class="step-stage speech-unit" id="tet-stage"></div>
          </div>
        </section>
        <section class="section-block">
          ${section("Physiologic goals")}
          <div class="stat-grid speech-unit">
            <div class="stat"><strong>↑ SVR</strong><span>Reduce right-to-left shunting</span></div>
            <div class="stat"><strong>↑ Preload</strong><span>Support RV filling and pulmonary flow</span></div>
            <div class="stat"><strong>↓ RVOT spasm</strong><span>Improve forward flow to lungs</span></div>
            <div class="stat"><strong>↓ Distress</strong><span>Break the catecholamine cycle</span></div>
          </div>
        </section>
        ${callout("Emergency principle","Calm the child, use knee-chest positioning, support oxygenation and airway, restore volume when needed, reduce infundibular spasm, raise systemic vascular resistance when indicated, and obtain urgent congenital cardiology care.","danger")}
      `
    },

    tga:{
      title:"d-Transposition of the great arteries",kicker:"Cyanotic lesions 3",lead:"In d-TGA, atrioventricular connections are concordant but ventriculoarterial connections are discordant: the aorta arises from the RV and the pulmonary artery from the LV. The circuits are parallel, so survival depends on mixing.",
      html:`
        <section class="section-block">
          <div class="compare-grid">
            <article class="compare-card red speech-unit"><h3>Systemic circuit</h3><p>Systemic veins → RA → RV → aorta → body → systemic veins. Desaturated blood recirculates systemically.</p></article>
            <article class="compare-card blue speech-unit"><h3>Pulmonary circuit</h3><p>Pulmonary veins → LA → LV → pulmonary artery → lungs → pulmonary veins. Oxygenated blood recirculates through the lungs.</p></article>
          </div>
        </section>
        <section class="section-block">
          ${section("Why mixing is lifesaving")}
          <div class="flow-chain speech-unit">${["ASD / PFO","VSD","PDA","Atrial septostomy","Effective mixing","Systemic oxygen delivery"].map((x,i)=>`<div class="flow-step"><strong>${i+1}</strong><span>${x}</span></div>`).join("")}</div>
        </section>
        <section class="section-block">
          ${table(["Phase","Management or consequence"],[
            ["Presentation","Profound cyanosis soon after birth, often with less respiratory distress than the degree of hypoxemia suggests"],
            ["Immediate stabilization","Prostaglandin E1 maintains ductal patency; urgent balloon atrial septostomy when atrial mixing is inadequate"],
            ["Definitive repair","Arterial switch operation in early neonatal life, including coronary artery transfer"],
            ["Long-term surveillance","Neo-aortic root dilatation/regurgitation, coronary complications, pulmonary artery stenosis, ventricular function, arrhythmia, and exercise capacity"],
            ["Older atrial-switch survivors","Risk of systemic RV failure, tricuspid regurgitation, sinus-node dysfunction, atrial arrhythmia, and baffle obstruction or leak"]
          ])}
        </section>
        ${callout("Clinical trap","Oxygen alone cannot correct inadequate mixing. In a profoundly cyanotic neonate with d-TGA physiology, the urgent goal is to create or maintain communication between the circuits.","danger")}
      `
    },

    "other-cyanotic":{
      title:"Other cyanotic and complex lesions",kicker:"Cyanotic lesions 4",lead:"Use the same questions—pulmonary flow, mixing, ventricular adequacy, and duct dependence—to orient yourself in complex congenital anatomy.",
      html:`
        <section class="section-block">
          ${table(["Lesion","Physiologic orientation","Typical strategy"],[
            ["Tricuspid atresia","No direct RA-to-RV connection, underdeveloped RV; survival requires interatrial flow and a source of pulmonary blood flow","Staged single-ventricle palliation"],
            ["Atrioventricular septal defect","Atrial and ventricular septal components plus common/abnormal AV valves; strongly associated with trisomy 21","Surgical repair, timing based on symptoms and pulmonary vascular risk"],
            ["Pulmonary atresia","No effective RV-to-pulmonary artery flow; pulmonary circulation may be duct-dependent","Prostaglandin and urgent catheter/surgical pathway"],
            ["Single-ventricle physiology","One ventricle supports systemic output; mixing and balanced pulmonary flow are crucial","Staged palliation and lifelong specialist follow-up"],
            ["Total anomalous pulmonary venous connection","Pulmonary veins drain abnormally; systemic survival requires interatrial communication","Urgent surgery, especially if venous return is obstructed"]
          ])}
        </section>
        <section class="section-block">
          ${section("Historical labels to handle carefully")}
          <div class="card-grid">
            ${card("Fallot triology","<p>Historical term for pulmonary stenosis, ASD, and RV hypertrophy; describe actual anatomy instead of relying on the label.</p>","3")}
            ${card("Fallot pentalogy","<p>TOF with an additional ASD; management follows the individual anatomy and physiology.</p>","5")}
            ${card("Mixing lesion","<p>Not every cyanotic lesion has reduced pulmonary flow; some have parallel circuits or excessive pulmonary flow with poor systemic oxygen delivery.</p>","Mix")}
          </div>
        </section>
        ${callout("General rule","In complex CHD, avoid forcing the patient into a memorized label. Define connections, ventricular function, sources of pulmonary and systemic blood flow, mixing pathways, and obstructions.","success")}
      `
    },

    eisenmenger:{
      title:"Eisenmenger syndrome",kicker:"Advanced care 1",lead:"Eisenmenger syndrome is irreversible pulmonary vascular disease caused by a longstanding large systemic-to-pulmonary shunt. As pulmonary vascular resistance approaches or exceeds systemic resistance, flow becomes bidirectional or right-to-left and cyanosis appears.",
      html:`
        <section class="section-block">
          <div class="flow-chain speech-unit">${["Large L→R shunt","Pulmonary overcirculation","Vascular remodeling","Rising PVR","Bidirectional / R→L shunt","Cyanosis","Multisystem disease"].map((x,i)=>`<div class="flow-step"><strong>${i+1}</strong><span>${x}</span></div>`).join("")}</div>
        </section>
        <section class="section-block">
          ${section("Clinical consequences")}
          ${table(["System","Manifestations"],[
            ["Cardiorespiratory","Cyanosis, exertional limitation, loud P2, RV failure, syncope, hemoptysis, pulmonary artery dilatation, arrhythmia"],
            ["Hematologic","Secondary erythrocytosis is adaptive; iron deficiency can worsen symptoms; both bleeding and thrombosis risk rise"],
            ["Neurologic / thrombotic","Paradoxical embolism, stroke, brain abscess, in-situ pulmonary thrombosis"],
            ["Renal / metabolic","Hyperuricemia, gout, renal dysfunction, proteinuria"],
            ["Pregnancy","Extremely high maternal and fetal risk; strong counseling and expert contraception planning are essential"]
          ])}
        </section>
        <section class="section-block">
          ${section("Management principles")}
          ${bullets([
            "Do not close the original communication when pulmonary vascular disease is irreversible; it may act as a pressure-relief pathway for the RV.",
            "Use an expert ACHD and pulmonary hypertension team.",
            "Monitor saturation, iron status, renal function, rhythm, heart failure, and hemoptysis.",
            "Pulmonary arterial hypertension therapy may include endothelin-receptor antagonists or phosphodiesterase-5 inhibitors under specialist care.",
            "Avoid routine phlebotomy; reserve it for selected severe hyperviscosity after excluding dehydration and iron deficiency.",
            "Use air filters for IV lines, meticulous dental care, careful perioperative planning, and individualized anticoagulation.",
            "Selected advanced disease may require lung transplantation with cardiac repair or heart-lung transplantation."
          ])}
        </section>
        ${callout("Murmur warning","As pulmonary pressure rises and the gradient narrows, the original shunt murmur may become quieter. A softer murmur can therefore signal worse disease rather than improvement.","danger")}
      `
    },

    dextrocardia:{
      title:"Dextrocardia, situs, and dextroposition",kicker:"Advanced care 2",lead:"A right-sided cardiac silhouette can represent true dextrocardia, mirror-image situs, complex heterotaxy, or displacement of an otherwise normally oriented heart. The terms are not interchangeable.",
      html:`
        <section class="section-block">
          ${table(["Term","Definition and significance"],[
            ["Dextrocardia","Cardiac apex points right; may occur with situs solitus, situs inversus, or heterotaxy"],
            ["Situs inversus totalis","Mirror-image thoracic and abdominal organs, usually with mirror-image dextrocardia; many have no major structural CHD"],
            ["Dextrocardia with situs solitus","More often associated with significant intracardiac malformations"],
            ["Dextroposition","Heart displaced rightward by lung volume loss, diaphragmatic abnormality, or mediastinal shift; apex orientation is not truly mirror-imaged"],
            ["Heterotaxy","Abnormal left-right arrangement that may include complex CHD, anomalous venous return, splenic abnormalities, and conduction disease"]
          ])}
        </section>
        <section class="section-block">
          ${section("ECG and imaging caution")}
          <div class="card-grid">
            ${card("Confirm apex direction","<p>Do not label dextrocardia from a right-sided silhouette alone.</p>","Apex")}
            ${card("Define situs","<p>Identify atrial arrangement, bronchi, lungs, liver, stomach, and spleen.</p>","Situs")}
            ${card("Adapt ECG leads","<p>Standard left-sided placement can create apparent axis abnormalities and poor R-wave progression.</p>","ECG")}
            ${card("Map venous return","<p>Systemic and pulmonary venous anomalies are common in heterotaxy.</p>","Veins")}
            ${card("Look for conduction disease","<p>Abnormal conduction tissue and rhythm problems may accompany complex situs.</p>","Rhythm")}
            ${card("Describe, do not assume","<p>Clinical significance comes from actual anatomy rather than the position term alone.</p>","Map")}
          </div>
        </section>
        ${callout("Practical point","Imaging reports and ECG interpretation must state orientation clearly. Apparent abnormalities may simply reflect standard left-sided assumptions applied to mirror-image anatomy.","warning")}
      `
    },

    endocarditis:{
      title:"Infective endocarditis prevention",kicker:"Advanced care 3",lead:"Good oral hygiene and regular dental care matter for everyone. Antibiotic prophylaxis is reserved for selected highest-risk congenital conditions and specified dental procedures—not every murmur or repaired lesion.",
      html:`
        <section class="section-block">
          ${section("Highest-risk congenital categories")}
          <div class="card-grid">
            ${card("Unrepaired cyanotic CHD","<p>Includes palliative shunts and conduits when cyanotic disease remains unrepaired.</p>","Cyan")}
            ${card("Recent repair with prosthetic material","<p>Highest risk during the guideline-defined period after device or prosthetic repair.</p>","Device")}
            ${card("Residual defect near prosthetic material","<p>Persistent shunting or regurgitation that inhibits endothelialization remains high risk.</p>","Residual")}
            ${card("Prior infective endocarditis","<p>History of IE is itself a high-risk condition.</p>","IE")}
            ${card("Prosthetic valve or conduit","<p>Valve-related prophylaxis rules may apply independent of the original congenital diagnosis.</p>","Valve")}
            ${card("Routine native lesions","<p>Uncomplicated ASD, VSD, PDA, pulmonary stenosis, or native repaired lesions without high-risk features generally do not receive routine prophylaxis.</p>","No")}
          </div>
        </section>
        <section class="section-block">
          ${section("Prevention beyond antibiotics")}
          ${bullets(["Excellent oral hygiene and regular dental review","Prompt evaluation of unexplained fever in high-risk patients","Avoid nonessential skin piercing or tattooing when infection control is uncertain","Aseptic technique for vascular access and implanted devices","Clear documentation of prosthetic material, conduits, and residual defects","Use current local antibiotic, allergy, and dental-procedure guidance"])}
        </section>
        ${callout("Current-practice correction","Routine antibiotic prophylaxis is not indicated for most uncomplicated congenital heart disease. The cardiac condition and dental procedure must both meet guideline criteria.","danger")}
      `
    },

    "lifelong-care":{
      title:"Lifelong adult congenital heart disease care",kicker:"Advanced care 4",lead:"Childhood repair changes anatomy and risk; it does not erase them. Moderate and complex lesions require ongoing adult congenital heart disease expertise.",
      html:`
        <section class="section-block">
          ${section("What can emerge decades later")}
          <div class="card-grid">
            ${card("Residual or recurrent obstruction","<p>Recoarctation, RVOT obstruction, branch pulmonary stenosis, or conduit degeneration.</p>","⇥")}
            ${card("Valve disease","<p>Pulmonary regurgitation after TOF repair, AV valve disease, neo-aortic regurgitation, or bicuspid aortic valve progression.</p>","Valve")}
            ${card("Ventricular dysfunction","<p>Systemic RV failure, dilated RV after pulmonary regurgitation, or LV dysfunction from residual loading.</p>","EF")}
            ${card("Arrhythmia","<p>Atrial scar-related tachycardia, ventricular arrhythmia, sinus-node disease, or AV block.</p>","ECG")}
            ${card("Aortopathy","<p>Aortic-root dilatation, aneurysm, recoarctation-related disease, or post-surgical vascular complications.</p>","Ao")}
            ${card("Pregnancy and exercise risk","<p>Risk depends on lesion, ventricular function, pulmonary pressure, aorta, rhythm, and medications.</p>","Life")}
          </div>
        </section>
        <section class="section-block">
          ${section("A structured follow-up visit")}
          ${table(["Domain","Questions"],[
            ["Symptoms / function","Exercise tolerance, cyanosis, palpitations, syncope, edema, chest pain, hemoptysis"],
            ["Examination","Saturation, blood pressure distribution, pulses, S2, murmurs, JVP, heart failure signs"],
            ["Rhythm","ECG and ambulatory monitoring when indicated"],
            ["Imaging","Echo, CMR, or CT according to lesion and repair"],
            ["Exercise","Objective testing when symptoms, intervention timing, or sports advice require it"],
            ["Life planning","Pregnancy counseling, contraception, employment, travel, dental care, endocarditis risk, and transition of care"]
          ])}
        </section>
        ${callout("Transition principle","Adolescents should move through a planned transition—not a sudden transfer—from pediatric to adult congenital care, with clear understanding of their anatomy, operations, medications, and warning symptoms.","success")}
      `
    },

    corrections:{
      title:"High-yield corrections and exam traps",kicker:"Advanced care 5",lead:"Several older shortcuts are unsafe because modern congenital care depends on integrated hemodynamics, advanced imaging, and long-term surveillance.",
      html:`
        <section class="section-block">
          ${table(["Older shortcut","Updated interpretation"],[
            ["Give endocarditis prophylaxis for every congenital lesion","Reserve prophylaxis for highest-risk cardiac categories and specified dental procedures"],
            ["Pulmonary stenosis is severe above 50 mmHg","Modern Doppler grading commonly uses a peak gradient above 64 mmHg for severe valvular PS, while treatment also depends on symptoms and RV effect"],
            ["Indomethacin is the general treatment for PDA","Cyclooxygenase inhibition is mainly a selected preterm strategy; older patients usually undergo transcatheter closure when indicated"],
            ["TOF has mild RV enlargement and an insignificant VSD","The VSD is usually large and nonrestrictive; RV hypertrophy results from pressure overload; RVOT obstruction determines cyanosis"],
            ["Close all shunts before they reverse","Closure requires assessment of shunt size, chamber load, pulmonary pressure, and pulmonary vascular resistance; established Eisenmenger physiology contraindicates simple closure"],
            ["Childhood repair completes care","Many repaired patients require lifelong ACHD surveillance for rhythm, valves, ventricles, pulmonary hypertension, aorta, pregnancy risk, and reintervention"]
          ])}
        </section>
        <section class="section-block">
          ${section("Quiet does not mean mild")}
          <div class="myth-grid">
            <article class="myth bad speech-unit"><span>Myth</span><h3>A softer shunt murmur means improvement.</h3><p>Pressure equalization or low pulmonary flow can reduce turbulence while disease worsens.</p></article>
            <article class="myth good speech-unit"><span>Reality</span><h3>Interpret sound with flow and pressure.</h3><p>Use S2, saturation, pulses, chamber response, pulmonary pressure, and imaging.</p></article>
          </div>
        </section>
        ${callout("Best exam habit","State the physiology before the diagnosis: shunt direction, pulmonary flow, loaded chamber, and expected saturation. This prevents most congenital-heart exam errors.","success")}
      `
    },

    "lesion-map":{
      title:"Lesion comparison explorer",kicker:"Active revision 1 · Interactive",lead:"Select a lesion to compare physiology, chamber load, pulmonary flow, bedside clues, imaging, and management logic.",
      html:`
        <section class="interactive-panel interactive-only">
          <div class="manifestation-explorer">
            <div class="manifestation-list" id="lesion-list"></div>
            <div class="manifestation-stage speech-unit" id="lesion-stage"></div>
          </div>
        </section>
        <section class="section-block">
          ${section("Common-lesion snapshot")}
          ${table(["Lesion","Primary chamber load","Pulmonary flow","Classic bedside clue"],[
            ["ASD","RA/RV volume overload","Increased","Wide fixed S2 split; pulmonary flow murmur"],
            ["VSD","LA/LV volume overload; RV pressure load if large","Increased","Harsh holosystolic murmur at lower left sternal border"],
            ["PDA","LA/LV volume overload","Increased","Continuous infraclavicular murmur; bounding pulse"],
            ["Pulmonary stenosis","RV pressure overload","Normal or reduced if severe","Ejection click, systolic murmur, soft delayed P2"],
            ["Coarctation","LV pressure overload","Usually normal","Arm hypertension, weak/delayed femorals, back murmur"],
            ["TOF","RV pressure overload with R→L shunt","Reduced","Single S2, RVOT murmur, cyanosis"],
            ["d-TGA","Parallel circulation; mixing-dependent","Variable","Severe neonatal cyanosis, often limited murmur"],
            ["Eisenmenger","RV pressure overload and systemic cyanosis","Pulmonary vascular disease","Loud P2; original shunt murmur diminishes"]
          ])}
        </section>
      `
    },

    "murmur-lab":{
      title:"Murmur, S2, and pulse lab",kicker:"Active revision 2 · Interactive matching",lead:"Congenital examination becomes easier when the murmur is interpreted together with S2, pulses, saturation, and the chamber load.",
      html:`
        <section class="interactive-panel interactive-only">
          <div class="form-grid">
            <label class="field"><span>Choose a bedside clue</span><select id="murmur-clue" class="wide-select">
              <option value="fixed">Wide fixed split S2</option>
              <option value="holosystolic">Harsh holosystolic murmur at LLSB</option>
              <option value="continuous">Continuous infraclavicular murmur + bounding pulses</option>
              <option value="delayed-p2">Ejection click + soft delayed P2</option>
              <option value="weak-femoral">Arm hypertension + weak femoral pulses</option>
              <option value="single-s2">Single S2 + cyanosis + RVOT murmur</option>
              <option value="loud-p2">Loud P2 + cyanosis + quieter old shunt murmur</option>
            </select></label>
          </div>
          <div class="result-panel speech-unit" id="murmur-result"></div>
        </section>
        <section class="section-block">
          ${section("Describe every murmur in the same order")}
          <div class="exam-strip speech-unit"><strong>Timing</strong><span>systolic, diastolic, continuous</span><strong>Site</strong><span>where maximal</span><strong>Radiation</strong><span>back, neck, axilla</span><strong>Quality</strong><span>harsh, blowing, machinery</span><strong>S2</strong><span>fixed, single, loud, soft</span><strong>Pulse</strong><span>bounding, delayed, differential</span></div>
        </section>
        ${callout("Do not grade anatomy by loudness","Murmur intensity depends on gradient and flow. Severe disease can be quiet when pulmonary flow falls or pressures equalize.","warning")}
      `
    },

    "exam-sequence":{
      title:"Rapid congenital heart examination",kicker:"Active revision 3",lead:"Use a fixed sequence so that saturation, blood-pressure distribution, pulses, S2, and signs of pulmonary hypertension are not missed while focusing on the murmur.",
      html:`
        <section class="section-block">
          <div class="timeline speech-unit">
            <div class="timeline-item"><span class="timeline-dot">1</span><div class="timeline-body"><h3>Inspect</h3><p>Cyanosis, clubbing, scars, growth pattern, chest shape, respiratory effort, syndromic features.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">2</span><div class="timeline-body"><h3>Measure</h3><p>Oxygen saturation and blood pressure; compare both arms and at least one leg when obstruction is possible.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">3</span><div class="timeline-body"><h3>Palpate pulses together</h3><p>Brachial and femoral pulses simultaneously to detect radiofemoral delay; note bounding or differential pulses.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">4</span><div class="timeline-body"><h3>Assess the precordium</h3><p>RV heave, LV apex displacement, thrills, and surgical changes.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">5</span><div class="timeline-body"><h3>Characterize S2 first</h3><p>Wide fixed split, single S2, loud P2, or soft/delayed P2 can narrow the diagnosis rapidly.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">6</span><div class="timeline-body"><h3>Describe the murmur</h3><p>Timing, site, radiation, intensity, quality, and respiratory response.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot">7</span><div class="timeline-body"><h3>Look for consequences</h3><p>Heart failure, pulmonary hypertension, differential cyanosis, hepatomegaly, edema, arrhythmia, and neurologic complications.</p></div></div>
          </div>
        </section>
        <section class="section-block">
          ${section("One-minute lesion anchors")}
          <div class="card-grid">
            ${card("Fixed S2","<p>Think ASD and RV volume load.</p>","ASD")}
            ${card("Holosystolic LLSB","<p>Think VSD; loud does not necessarily mean large.</p>","VSD")}
            ${card("Continuous + bounding","<p>Think PDA and diastolic runoff.</p>","PDA")}
            ${card("Delayed P2","<p>Think pulmonary outflow obstruction.</p>","PS")}
            ${card("Weak femorals","<p>Think coarctation and compare four limbs.</p>","CoA")}
            ${card("Single S2 + cyanosis","<p>Think TOF or another lesion with reduced pulmonary flow.</p>","TOF")}
          </div>
        </section>
      `
    },

    cases:{
      title:"Clinical reasoning cases",kicker:"Active revision 4",lead:"Work from physiology to diagnosis and management. Reveal the explanation only after committing to a pattern.",
      html:`<section class="interactive-panel interactive-only"><div id="case-lab"></div></section>`
    },

    flashcards:{
      title:"Flashcards",kicker:"Active revision 5",lead:"A keyboard-accessible active-recall deck covering physiology, lesion signatures, emergencies, management, and lifelong care.",
      html:`<section class="interactive-panel interactive-only"><div id="flashcard-lab"></div></section>`
    },

    quiz:{
      title:"Scored quiz",kicker:"Active revision 6",lead:"Twenty-four single-best-answer questions with immediate explanation and locally saved progress.",
      html:`<section class="interactive-panel interactive-only"><div id="quiz-lab"></div></section>`
    },

    sources:{
      title:"Sources, scope, and use",kicker:"Active revision 7",lead:"This offline lab reconstructs the supplied congenital heart disease chapter into a connected learning system. It is designed for structured medical revision, not patient-specific decision-making.",
      html:`
        <section class="source-download speech-unit">
          <div><p class="eyebrow">Bundled source</p><h2>Congenital Heart Disease — reconstructed study chapter</h2><p>The original 17-page PDF is included in this folder for direct comparison and printing.</p></div>
          <a class="primary-button" href="congenital-heart-disease-source.pdf" target="_blank" rel="noopener">Open source PDF</a>
        </section>
        <section class="section-block">
          ${section("Content basis")}
          <div class="source-list speech-unit">
            <div class="source-item"><span class="source-number">1</span><div><strong>2025 adult congenital heart disease guideline</strong><p>Used in the source chapter for contemporary lifelong-care and reintervention framing.</p></div></div>
            <div class="source-item"><span class="source-number">2</span><div><strong>2020 ESC adult congenital heart disease guideline</strong><p>Supports classification, pulmonary vascular disease assessment, and specialist follow-up principles.</p></div></div>
            <div class="source-item"><span class="source-number">3</span><div><strong>American Heart Association congenital heart resources</strong><p>General lesion orientation and patient education.</p></div></div>
            <div class="source-item"><span class="source-number">4</span><div><strong>American Heart Association infective endocarditis prevention statement</strong><p>Supports the restricted, highest-risk prophylaxis approach.</p></div></div>
          </div>
        </section>
        <section class="section-block">
          ${section("What was added in the interactive build")}
          <div class="card-grid">
            ${card("29 connected modules","<p>Previous/Next navigation plus cross-links between physiology, lesions, examination, and management.</p>","29")}
            ${card("Interactive reasoning tools","<p>Physiology sequence, diagnostic explorer, shunt lab, tet-spell pathway, arm–leg pressure explorer, lesion map, and murmur lab.</p>","UI")}
            ${card("Study systems","<p>Search, bookmarks, progress, dark mode, focus mode, local notes, timer, flashcards, cases, and scored quiz.</p>","Study")}
            ${card("Section-level TTS","<p>Browser text-to-speech with pause and exact continuation from the paused position when supported by the browser.</p>","TTS")}
            ${card("Accessible interaction","<p>Keyboard navigation, visible focus, semantic buttons, skip link, and responsive layout.</p>","a11y")}
            ${card("Offline package","<p>All files are in one flat folder; no installation, server, or build step is required.</p>","ZIP")}
          </div>
        </section>
        ${callout("Clinical scope","Local protocols, current lesion-specific guidelines, device criteria, contraindications, prescribing information, and specialist assessment take precedence. Urgent cyanosis, shock, syncope, severe respiratory distress, or a tet spell requires immediate clinical care.","danger")}
      `
    }
  };

  const cases = [
    {title:"The fixed split",tag:"ASD",stem:"A 24-year-old woman has mild exertional dyspnea. Examination shows a right ventricular heave, a systolic ejection murmur at the left upper sternal border, and a widely split S2 that does not vary with respiration.",question:"Identify the most likely lesion, explain the murmur, and state the chamber load.",answer:"The pattern is an atrial septal defect, most often secundum ASD. The murmur is a pulmonary flow murmur rather than flow across the atrial defect. The right atrium and right ventricle are volume-loaded.",pearls:["The ASD itself is usually silent because the atrial pressure gradient is low.","Closure is based on significant shunt and RV enlargement, not visibility alone.","Assess pulmonary vascular resistance if pulmonary hypertension is present."]},
    {title:"The loud small defect",tag:"VSD",stem:"A thriving 6-year-old has a very loud harsh holosystolic murmur with a thrill at the lower left sternal border. Echocardiography shows a small muscular ventricular septal defect and normal pulmonary pressure.",question:"Why is the murmur so loud, and what is the usual management direction?",answer:"A small restrictive VSD creates a large LV-to-RV pressure gradient, producing high-velocity turbulent flow and a loud murmur. With no volume overload or complications, observation is appropriate and spontaneous closure may occur.",pearls:["Loudness does not equal defect size.","Large nonrestrictive VSDs may be quieter as pressures equalize.","Monitor for aortic valve complications in relevant VSD types."]},
    {title:"Infant heart failure after 6 weeks",tag:"VSD",stem:"A 7-week-old infant develops tachypnea, sweating during feeds, poor weight gain, hepatomegaly, and a holosystolic murmur. The infant was relatively well in the first week of life.",question:"Explain the timing and the likely physiology.",answer:"A large VSD becomes more hemodynamically important as pulmonary vascular resistance falls after birth. Left-to-right flow increases, causing pulmonary overcirculation, LA/LV volume load, and heart failure.",pearls:["The early neonatal period can hide a large shunt while PVR is high.","Medical stabilization is followed by timely closure when symptoms and major shunting persist.","Delay risks irreversible pulmonary vascular disease."]},
    {title:"Bounding pulses",tag:"PDA",stem:"A child has a continuous machinery-like murmur below the left clavicle, brisk bounding pulses, and a wide pulse pressure.",question:"Identify the lesion and explain the pulse finding.",answer:"This is a patent ductus arteriosus. Aortic blood runs off into the pulmonary artery during diastole, lowering diastolic pressure, while increased stroke volume raises systolic pressure, producing a wide pulse pressure and bounding pulses.",pearls:["The shunt is continuous because aortic pressure exceeds pulmonary pressure in systole and diastole.","A significant PDA usually volume-loads LA/LV.","Transcatheter closure is preferred in most suitable older infants, children, and adults."]},
    {title:"Shock as the duct closes",tag:"Coarctation",stem:"A 5-day-old infant becomes pale, acidotic, oliguric, and poorly perfused in the lower body. Femoral pulses are weak. The infant had appeared well at birth.",question:"What is the emergency diagnosis and immediate physiologic treatment?",answer:"Critical coarctation with duct-dependent systemic blood flow is likely. Begin prostaglandin E1 to restore or maintain ductal patency while arranging urgent congenital cardiac stabilization and repair.",pearls:["The lesion may be hidden while the duct is open.","Assess four-limb pressures and perfusion.","Renal dysfunction and acidosis reflect impaired systemic output."]},
    {title:"Single S2 and cyanosis",tag:"TOF",stem:"A 9-month-old has cyanosis, a harsh systolic ejection murmur at the left upper sternal border, a single S2, and reduced pulmonary vascular markings on chest radiograph.",question:"Identify the lesion and the main determinant of cyanosis.",answer:"Tetralogy of Fallot is most likely. The degree of right ventricular outflow tract obstruction determines how much blood reaches the lungs and how much crosses right-to-left through the large VSD into the overriding aorta.",pearls:["The VSD is usually large and nonrestrictive.","The murmur comes from RVOT obstruction, not the VSD.","RV hypertrophy is secondary to pressure overload."]},
    {title:"Crying makes the child blue",tag:"Tet spell",stem:"A child with known TOF becomes suddenly deeply cyanosed and irritable during crying. The outflow murmur becomes softer.",question:"Explain the softer murmur and outline the immediate sequence.",answer:"Pulmonary flow has fallen because RVOT obstruction and right-to-left shunting increased, so less turbulent forward flow produces a softer murmur. Calm the child, use knee-chest positioning, support oxygenation/airway, correct volume depletion, reduce infundibular spasm, raise systemic vascular resistance when indicated, and obtain urgent congenital cardiology care.",pearls:["A quieter murmur can indicate a more severe spell.","Knee-chest position raises SVR.","Persistent spells require definitive surgical planning."]},
    {title:"Profound cyanosis with little distress",tag:"d-TGA",stem:"A newborn is profoundly cyanosed soon after birth but has relatively little respiratory distress. Oxygen produces little improvement. Echocardiography shows the aorta from the RV and pulmonary artery from the LV.",question:"What is the immediate management goal?",answer:"The circuits are parallel, so the goal is to improve mixing and maintain ductal patency. Start prostaglandin E1 and perform urgent balloon atrial septostomy if atrial mixing is inadequate, followed by neonatal arterial switch repair.",pearls:["Oxygen alone cannot fix inadequate mixing.","Survival depends on ASD/PFO, VSD, PDA, or created communication.","Coronary transfer is part of the arterial switch."]},
    {title:"The disappearing VSD murmur",tag:"Eisenmenger",stem:"An adult with a childhood large VSD now has cyanosis, clubbing, a loud P2, and a much softer holosystolic murmur than previously documented.",question:"What has happened, and should the VSD be closed?",answer:"Severe pulmonary vascular disease has raised RV and pulmonary pressures, reducing the LV-to-RV gradient and reversing or making the shunt bidirectional. This is Eisenmenger physiology. The defect should not be simply closed because it may be a pressure-relief pathway for the RV.",pearls:["A softer murmur may signal worse disease.","Care requires expert ACHD and pulmonary hypertension teams.","Routine phlebotomy is avoided unless carefully selected."]},
    {title:"Right-sided heart on chest film",tag:"Dextrocardia",stem:"A chest radiograph shows the cardiac silhouette on the right. The ECG has poor R-wave progression using standard lead placement.",question:"What must be clarified before diagnosing structural CHD?",answer:"Confirm whether the apex truly points right, define situs, distinguish dextrocardia from dextroposition, adapt ECG lead placement, and map intracardiac and venous anatomy. Standard left-sided leads can create misleading ECG abnormalities.",pearls:["Situs inversus totalis may have little structural CHD.","Dextrocardia with situs solitus has a higher association with complex lesions.","Heterotaxy requires detailed venous and splenic assessment."]}
  ];

  const flashcards = [
    {tag:"Framework",q:"What four broad physiologic questions organize congenital heart disease?",a:"Is there a left-to-right shunt, obstruction, reduced pulmonary flow/right-to-left shunt, or a mixing/parallel circulation?"},
    {tag:"Framework",q:"What determines shunt direction?",a:"Pressure relationships between connected chambers/vessels plus systemic and pulmonary vascular resistances."},
    {tag:"Framework",q:"Why can a large VSD become symptomatic weeks after birth?",a:"Pulmonary vascular resistance falls, increasing left-to-right shunt and pulmonary overcirculation."},
    {tag:"Framework",q:"Which chambers are volume-loaded in isolated ASD?",a:"The right atrium and right ventricle."},
    {tag:"Framework",q:"Which chambers are volume-loaded in a significant VSD or PDA?",a:"The left atrium and left ventricle, because increased pulmonary flow returns through the pulmonary veins."},
    {tag:"Framework",q:"Why can a severe shunt murmur become softer?",a:"The pressure gradient or forward flow may fall as pressures equalize or pulmonary flow decreases."},
    {tag:"Diagnosis",q:"What is the first-line anatomic and hemodynamic test for CHD?",a:"Transthoracic echocardiography with Doppler."},
    {tag:"Diagnosis",q:"What does pulse oximetry add?",a:"It detects subtle cyanosis, documents saturation, and permits pre/post-ductal comparison in neonates."},
    {tag:"Diagnosis",q:"When are CMR or cardiac CT especially useful?",a:"For complex arch, pulmonary artery, venous, conduit, postoperative anatomy, ventricular volumes, and flow assessment."},
    {tag:"Diagnosis",q:"When is cardiac catheterization used?",a:"For intervention or unresolved invasive hemodynamics such as pulmonary vascular resistance or pressure gradients."},
    {tag:"ASD",q:"What is the classic auscultatory sign of ASD?",a:"Wide fixed splitting of S2 with a pulmonary flow ejection murmur."},
    {tag:"ASD",q:"Why is the ASD itself usually silent?",a:"The atrial pressure gradient is low; the audible murmur is increased flow across the pulmonary valve."},
    {tag:"ASD",q:"Which ASD is most suitable for device closure?",a:"Secundum ASD with suitable size and rims."},
    {tag:"ASD",q:"What finding usually drives closure of an ASD?",a:"A significant left-to-right shunt causing right atrial/RV enlargement or symptoms, with acceptable PVR."},
    {tag:"VSD",q:"Why can a small VSD have a loud murmur?",a:"A large LV-to-RV pressure gradient creates high-velocity turbulent flow."},
    {tag:"VSD",q:"What is the usual murmur of VSD?",a:"A harsh holosystolic murmur at the lower left sternal border."},
    {tag:"VSD",q:"Which VSD complication can justify closure even without a large shunt?",a:"Aortic cusp prolapse or progressive aortic regurgitation."},
    {tag:"VSD",q:"What happens to the murmur in Eisenmenger VSD?",a:"It often diminishes as ventricular pressures equalize; loud P2 and cyanosis become more prominent."},
    {tag:"PDA",q:"Why is the classic PDA murmur continuous?",a:"Aortic pressure normally exceeds pulmonary pressure in both systole and diastole."},
    {tag:"PDA",q:"What causes bounding pulses in PDA?",a:"High stroke volume plus diastolic runoff into the pulmonary artery creates wide pulse pressure."},
    {tag:"PDA",q:"What is differential cyanosis in Eisenmenger PDA?",a:"Lower-body desaturation exceeds upper-body desaturation because reversed ductal flow enters the descending aorta."},
    {tag:"PDA",q:"When is prostaglandin used in relation to the duct?",a:"To keep the duct open in duct-dependent lesions such as critical coarctation, pulmonary atresia, or d-TGA."},
    {tag:"Obstruction",q:"What chamber is pressure-loaded in pulmonary stenosis?",a:"The right ventricle."},
    {tag:"Obstruction",q:"What happens to P2 in significant pulmonary stenosis?",a:"It becomes soft and delayed, with wider splitting."},
    {tag:"Obstruction",q:"What Doppler peak gradient is commonly severe valvular pulmonary stenosis?",a:"Above 64 mmHg, interpreted with symptoms, anatomy, and RV effects."},
    {tag:"Obstruction",q:"What is the preferred treatment for suitable significant valvular pulmonary stenosis?",a:"Balloon pulmonary valvuloplasty."},
    {tag:"Coarctation",q:"What pulse pattern suggests coarctation?",a:"Weak or delayed femoral pulses with radiofemoral delay."},
    {tag:"Coarctation",q:"What blood-pressure pattern suggests coarctation?",a:"Higher arm pressure than leg pressure."},
    {tag:"Coarctation",q:"Why can critical coarctation cause shock after several days?",a:"Systemic blood flow was duct-supported; deterioration occurs as the duct closes."},
    {tag:"Coarctation",q:"Does successful repair end surveillance?",a:"No. Monitor hypertension, recoarctation, bicuspid valve, aneurysm, exercise BP, and cerebrovascular risk lifelong."},
    {tag:"TOF",q:"What are the four components of TOF?",a:"Large VSD, RV outflow obstruction, overriding aorta, and secondary RV hypertrophy."},
    {tag:"TOF",q:"What mainly determines cyanosis in TOF?",a:"The severity of right ventricular outflow tract obstruction."},
    {tag:"TOF",q:"Why is S2 often single in TOF?",a:"P2 is soft or absent because pulmonary flow is reduced."},
    {tag:"TOF",q:"What is the murmur source in TOF?",a:"Turbulent flow across the obstructed RV outflow tract, not the large VSD."},
    {tag:"Tet spell",q:"What are the main physiologic goals in a tet spell?",a:"Raise SVR, improve preload, reduce infundibular spasm, and restore pulmonary blood flow."},
    {tag:"Tet spell",q:"Why use the knee-chest position?",a:"It raises systemic vascular resistance and reduces right-to-left shunting."},
    {tag:"Tet spell",q:"Why may the TOF murmur soften during a spell?",a:"Pulmonary forward flow falls, reducing turbulence across the RVOT."},
    {tag:"d-TGA",q:"Why is d-TGA called a parallel circulation?",a:"Systemic venous blood returns to the body and pulmonary venous blood returns to the lungs unless the circuits mix."},
    {tag:"d-TGA",q:"What is the immediate physiologic goal in d-TGA?",a:"Maintain ductal patency and improve mixing between circuits."},
    {tag:"d-TGA",q:"What procedure rapidly improves atrial mixing?",a:"Balloon atrial septostomy."},
    {tag:"d-TGA",q:"What is the definitive neonatal repair?",a:"Arterial switch operation with coronary artery transfer."},
    {tag:"Eisenmenger",q:"What defines Eisenmenger syndrome?",a:"Irreversible pulmonary vascular disease with bidirectional or right-to-left shunting and systemic cyanosis."},
    {tag:"Eisenmenger",q:"Why should the original defect not be simply closed?",a:"It may serve as a pressure-relief pathway for the RV when PVR is irreversible."},
    {tag:"Eisenmenger",q:"Is routine phlebotomy recommended?",a:"No. It is reserved for selected severe hyperviscosity after excluding dehydration and iron deficiency."},
    {tag:"Dextrocardia",q:"What is the difference between dextrocardia and dextroposition?",a:"Dextrocardia has a right-pointing apex; dextroposition is displacement of a normally oriented heart."},
    {tag:"Dextrocardia",q:"Why can standard ECG leads mislead in dextrocardia?",a:"They may create apparent axis abnormalities and poor R-wave progression unless placement is adapted."},
    {tag:"Prevention",q:"Does every congenital lesion require dental IE prophylaxis?",a:"No. It is reserved for guideline-defined highest-risk conditions and specified dental procedures."},
    {tag:"Lifelong care",q:"Why do repaired CHD patients need adult congenital follow-up?",a:"Residual lesions, arrhythmias, ventricular dysfunction, valve disease, aortopathy, pregnancy risk, and reintervention may emerge later."},
    {tag:"Examination",q:"Which heart sound should be characterized before focusing on the murmur?",a:"S2: fixed split, single, loud P2, or soft/delayed P2 is highly informative."},
    {tag:"Examination",q:"What seven bedside anchors distinguish common lesions?",a:"ASD fixed split; VSD holosystolic; PDA continuous + bounding; PS delayed P2; coarctation weak femorals; TOF single S2/cyanosis; Eisenmenger loud P2 with quieter old shunt murmur."}
  ];

  const quiz = [
    {q:"Which chamber pattern is expected in isolated ASD?",choices:["LA/LV volume overload","RA/RV volume overload","LV pressure overload","RV pressure overload only"],answer:1,explanation:"ASD increases flow through the right atrium, right ventricle, and pulmonary circulation, producing RA/RV volume overload."},
    {q:"The classic ASD murmur is caused by:",choices:["High-velocity flow through the atrial defect","Increased flow across the pulmonary valve","Mitral regurgitation","Aortic obstruction"],answer:1,explanation:"The atrial gradient is low; the systolic ejection murmur is a pulmonary flow murmur."},
    {q:"A very loud VSD murmur with normal pulmonary pressure most strongly suggests:",choices:["A small restrictive VSD","A large nonrestrictive VSD","Eisenmenger syndrome","d-TGA"],answer:0,explanation:"A small restrictive defect creates a large pressure gradient and high-velocity turbulent flow."},
    {q:"Which finding can justify VSD closure even if the shunt is not large?",choices:["Wide fixed S2","Progressive aortic regurgitation from cusp prolapse","Bounding pulses","Soft delayed P2"],answer:1,explanation:"Aortic cusp prolapse and progressive AR can worsen and may prompt closure."},
    {q:"Bounding pulses and a continuous infraclavicular murmur indicate:",choices:["ASD","VSD","PDA","Pulmonary stenosis"],answer:2,explanation:"PDA creates continuous aortic-to-pulmonary runoff and a wide pulse pressure."},
    {q:"Prostaglandin E1 is used in critical coarctation to:",choices:["Close the PDA","Maintain ductal systemic blood flow","Lower pulmonary vascular resistance permanently","Treat endocarditis"],answer:1,explanation:"Critical coarctation may rely on ductal flow to the descending aorta until repair."},
    {q:"Which pattern is most characteristic of coarctation?",choices:["Leg pressure higher than arm pressure","Bounding femoral pulses","Arm hypertension with weak delayed femorals","Fixed split S2"],answer:2,explanation:"Upper-body hypertension with weak or delayed femoral pulses is classic."},
    {q:"Which lesion primarily pressure-loads the right ventricle?",choices:["ASD","PDA","Pulmonary stenosis","Coarctation"],answer:2,explanation:"The RV ejects against the obstructed pulmonary valve or outflow tract."},
    {q:"A Doppler peak gradient above which value commonly defines severe valvular pulmonary stenosis?",choices:["25 mmHg","36 mmHg","50 mmHg","64 mmHg"],answer:3,explanation:"Modern grading commonly uses a peak gradient above 64 mmHg, integrated with symptoms and RV effect."},
    {q:"What mainly determines cyanosis in tetralogy of Fallot?",choices:["Size of the ASD","Severity of RV outflow obstruction","Degree of mitral regurgitation","LV systolic function"],answer:1,explanation:"RVOT obstruction determines pulmonary flow and the magnitude of right-to-left shunting."},
    {q:"The VSD in classic TOF is usually:",choices:["Tiny and restrictive","Large and nonrestrictive","Absent","Acquired"],answer:1,explanation:"The VSD is generally large, allowing ventricular pressures to equalize."},
    {q:"During a hypercyanotic spell, knee-chest positioning helps by:",choices:["Lowering systemic vascular resistance","Increasing systemic vascular resistance","Closing the VSD","Increasing pulmonary vascular resistance"],answer:1,explanation:"Higher SVR reduces right-to-left shunting and supports pulmonary flow."},
    {q:"A softer RVOT murmur during a tet spell means:",choices:["The spell is resolving","Pulmonary forward flow may have fallen","The VSD closed","The child is no longer cyanotic"],answer:1,explanation:"Less forward flow through the obstructed RVOT produces less turbulence, so a softer murmur can indicate worse obstruction."},
    {q:"Why is d-TGA immediately life-threatening?",choices:["The LV cannot contract","The circuits run in parallel with inadequate mixing","The pulmonary valve is always atretic","There is always complete heart block"],answer:1,explanation:"Without mixing, oxygenated pulmonary venous blood recirculates to the lungs and desaturated systemic venous blood recirculates to the body."},
    {q:"Which intervention rapidly improves atrial mixing in d-TGA?",choices:["Balloon atrial septostomy","PDA closure","Pulmonary valvuloplasty","Coarctation stent"],answer:0,explanation:"Balloon atrial septostomy enlarges the atrial communication when mixing is inadequate."},
    {q:"The definitive neonatal operation for d-TGA is:",choices:["Fontan procedure","Arterial switch","Blalock-Taussig shunt only","VSD device closure"],answer:1,explanation:"The arterial switch restores the great arteries to the appropriate ventricles and transfers the coronaries."},
    {q:"Which statement best defines Eisenmenger syndrome?",choices:["Any left-to-right shunt","Reversible pulmonary hypertension","Irreversible pulmonary vascular disease with shunt reversal","Isolated cyanosis from lung disease"],answer:2,explanation:"Eisenmenger syndrome develops after longstanding large shunting causes irreversible PVR elevation and bidirectional/right-to-left flow."},
    {q:"Why is simple defect closure dangerous in established Eisenmenger physiology?",choices:["It always causes bradycardia","The shunt may be a pressure-relief pathway for the RV","It causes ASD formation","It lowers systemic pressure only"],answer:1,explanation:"Closing the pathway can precipitate RV failure when pulmonary vascular resistance is irreversible."},
    {q:"A previously loud VSD murmur becomes quieter while cyanosis and P2 increase. The best explanation is:",choices:["Spontaneous cure","Rising pulmonary pressure and gradient equalization","Acute anemia","New ASD"],answer:1,explanation:"Advanced pulmonary vascular disease reduces the trans-VSD gradient while cyanosis and loud P2 emerge."},
    {q:"Which is true about dextroposition?",choices:["The apex always points right due to mirror-image anatomy","It is displacement of a normally oriented heart","It always means situs inversus","It never affects chest radiography"],answer:1,explanation:"Dextroposition is rightward displacement from extracardiac causes rather than true mirror-image orientation."},
    {q:"Routine infective endocarditis prophylaxis is recommended for:",choices:["Every native congenital lesion","Only selected highest-risk cardiac categories for specified procedures","All repaired ASDs forever","All pulmonary stenosis"],answer:1,explanation:"Routine prophylaxis is restricted to defined high-risk conditions and relevant dental procedures."},
    {q:"Which bedside finding is most useful before focusing on the murmur?",choices:["Hair color","S2 character","Body mass index only","Respiratory rate only"],answer:1,explanation:"Fixed splitting, a single S2, loud P2, or soft/delayed P2 can rapidly narrow the physiology."},
    {q:"Which lesion classically causes differential cyanosis of the lower body in advanced disease?",choices:["ASD","VSD","PDA with Eisenmenger physiology","Pulmonary stenosis"],answer:2,explanation:"Reversed ductal flow enters the descending aorta, desaturating the lower body more than the upper body."},
    {q:"Which statement about repaired congenital heart disease is most accurate?",choices:["Childhood repair eliminates future risk","Only cyanotic lesions need follow-up","Residual lesions, arrhythmias, ventricular dysfunction, and aortopathy can emerge later","Pregnancy counseling is unnecessary"],answer:2,explanation:"Many repaired lesions require lifelong ACHD surveillance and life-stage planning."}
  ];

  window.CHDContent = {navGroups,modules,physiologySteps,lesionData,diagnosticData,tetSteps,cases,flashcards,quiz};
})();
