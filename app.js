/* Congenital Heart Disease Lab application controller. */
(() => {
  "use strict";

  const content = window.CHDContent;
  if (!content) throw new Error("CHDContent failed to load.");

  const KEYS = {
    visited:"chd-lab-visited-v2",bookmarks:"chd-lab-bookmarks-v2",rate:"chd-lab-rate-v2",
    theme:"chd-lab-theme-v2",quiz:"chd-lab-quiz-v2"
  };
  const $ = (selector,root=document) => root.querySelector(selector);
  const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
  const storage = {
    get(key){try{return localStorage.getItem(key);}catch{return null;}},
    set(key,value){try{localStorage.setItem(key,value);}catch{}},
    remove(key){try{localStorage.removeItem(key);}catch{}}
  };
  const readJSON=(key,fallback)=>{try{return JSON.parse(storage.get(key))??fallback;}catch{return fallback;}};
  const writeJSON=(key,value)=>storage.set(key,JSON.stringify(value));
  const escapeHTML=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  const stripHTML=html=>{const node=document.createElement("div");node.innerHTML=html;return(node.textContent||"").replace(/\s+/g," ").trim();};

  const allItems=content.navGroups.flatMap(group=>group.items);
  const initialQuiz={index:0,score:0,answered:false,finished:false,selected:null};
  const savedQuiz=readJSON(KEYS.quiz,initialQuiz);
  const state={
    route:"overview",visited:new Set(readJSON(KEYS.visited,["overview"])),bookmarks:readJSON(KEYS.bookmarks,[]),
    voices:[],voice:null,flashFilter:"All",caseIndex:0,physiologyIndex:0,lesionIndex:0,diagnosticIndex:0,tetIndex:0,
    quiz:Object.assign({},initialQuiz,savedQuiz),
    speech:{button:null,unit:null,chunks:[],index:0,utterance:null,paused:false,session:0}
  };

  const els={
    nav:$("#course-nav"),app:$("#app-content"),currentLabel:$("#current-section-label"),sidebar:$("#sidebar"),
    scrim:$("#sidebar-scrim"),menu:$("#menu-button"),closeSidebar:$("#sidebar-close"),progressLabel:$("#progress-label"),
    progressBar:$("#progress-bar"),resetProgress:$("#reset-progress"),clearBookmarks:$("#clear-bookmarks"),search:$("#site-search"),
    searchResults:$("#search-results"),voiceStatus:$("#voice-status"),speechRate:$("#speech-rate"),stopSpeech:$("#stop-speech"),
    print:$("#print-button"),theme:$("#theme-toggle"),bookmarksButton:$("#bookmarks-button"),bookmarkDialog:$("#bookmark-dialog"),
    bookmarkList:$("#bookmark-list"),closeBookmarks:$("#close-bookmarks"),toast:$("#toast")
  };

  function buildNav(){
    els.nav.innerHTML=content.navGroups.map(group=>`<div class="nav-group"><div class="nav-group-title">${group.title}</div>${group.items.map(item=>`<button class="nav-link" type="button" data-route="${item.id}"><span class="nav-index">${String(allItems.indexOf(item)+1).padStart(2,"0")}</span><span>${item.label}</span><span class="nav-mark" aria-hidden="true"></span></button>`).join("")}</div>`).join("");
  }
  function routeFromHash(){const id=location.hash.replace(/^#/,"");return content.modules[id]?id:"overview";}
  function navigate(route,replace=false){
    if(!content.modules[route])route="overview";
    if(replace){history.replaceState(null,"",`#${route}`);render(route);}
    else if(location.hash!==`#${route}`)location.hash=route;
    else render(route);
  }
  function moduleNav(route){
    const i=allItems.findIndex(item=>item.id===route),prev=allItems[i-1],next=allItems[i+1];
    return `<nav class="module-nav" aria-label="Module navigation">${prev?`<button class="secondary-button" data-route="${prev.id}" type="button"><small>Previous</small><strong>← ${prev.label}</strong></button>`:"<span></span>"}${next?`<button class="secondary-button" data-route="${next.id}" type="button"><small>Next</small><strong>${next.label} →</strong></button>`:"<span></span>"}</nav>`;
  }
  function render(route){
    resetSpeech();state.route=route;state.visited.add(route);writeJSON(KEYS.visited,[...state.visited]);
    const m=content.modules[route];
    els.app.innerHTML=`<article class="module" data-module="${route}"><header class="module-header"><div><p class="eyebrow">${m.kicker}</p><h1>${m.title}</h1><p class="module-lead">${m.lead}</p></div><div class="module-tools"><button class="icon-button bookmark-module ${state.bookmarks.includes(route)?"active":""}" type="button" aria-label="Bookmark this module" title="Bookmark">★</button></div></header>${m.html}${moduleNav(route)}</article>`;
    els.currentLabel.textContent=m.title;document.title=`${m.title} | Congenital Heart Disease Lab`;
    updateNav();addSpeechButtons();initRoute(route);closeSidebar();
    requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:"instant"});$("#main-content").focus({preventScroll:true});});
  }
  function updateNav(){
    $$(".nav-link",els.nav).forEach(button=>{
      button.classList.toggle("active",button.dataset.route===state.route);
      button.classList.toggle("visited",state.visited.has(button.dataset.route));
      button.setAttribute("aria-current",button.dataset.route===state.route?"page":"false");
    });
    const count=[...state.visited].filter(id=>content.modules[id]).length,total=allItems.length;
    els.progressLabel.textContent=`${count} / ${total}`;els.progressBar.style.width=`${Math.min(100,count/total*100)}%`;
  }
  function openSidebar(){els.sidebar.classList.add("open");els.scrim.hidden=false;els.menu.setAttribute("aria-expanded","true");}
  function closeSidebar(){els.sidebar.classList.remove("open");els.scrim.hidden=true;els.menu.setAttribute("aria-expanded","false");}
  function showToast(text){els.toast.textContent=text;els.toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>els.toast.hidden=true,2100);}

  function toggleBookmark(route){
    const exists=state.bookmarks.includes(route);
    state.bookmarks=exists?state.bookmarks.filter(x=>x!==route):[...state.bookmarks,route];
    writeJSON(KEYS.bookmarks,state.bookmarks);$(".bookmark-module")?.classList.toggle("active",!exists);
    renderBookmarkList();showToast(exists?"Bookmark removed":"Module bookmarked");
  }
  function renderBookmarkList(){
    const valid=state.bookmarks.filter(id=>content.modules[id]);
    els.bookmarkList.innerHTML=valid.length?valid.map(id=>`<div class="bookmark-item"><button type="button" data-bookmark-route="${id}"><strong>${content.modules[id].title}</strong><small>${content.modules[id].kicker}</small></button><button class="icon-button" type="button" data-remove-bookmark="${id}" aria-label="Remove ${escapeHTML(content.modules[id].title)}">×</button></div>`).join(""):`<div class="bookmark-empty">No bookmarks yet. Use ★ on any module.</div>`;
  }
  function searchSite(query){
    const term=query.trim().toLowerCase();if(term.length<2){els.searchResults.hidden=true;return;}
    const hits=allItems.map(item=>{const m=content.modules[item.id],text=`${m.title} ${m.lead} ${stripHTML(m.html)}`.toLowerCase(),index=text.indexOf(term);return index<0?null:{item,m,text,index};}).filter(Boolean).slice(0,12);
    els.searchResults.innerHTML=hits.length?hits.map(hit=>{const start=Math.max(0,hit.index-65),snippet=hit.text.slice(start,hit.index+term.length+105);return `<button class="search-hit" type="button" data-search-route="${hit.item.id}"><strong>${hit.m.title}</strong><small>…${escapeHTML(snippet)}…</small></button>`;}).join(""):`<div class="search-hit"><strong>No matching module</strong><small>Try ASD, VSD, PDA, TOF, cyanosis, coarctation, S2, shunt, or Eisenmenger.</small></div>`;
    els.searchResults.hidden=false;
  }

  /* Section text-to-speech. Tapping the same button pauses and then continues from the paused position. */
  function loadVoices(){
    if(!("speechSynthesis" in window)){els.voiceStatus.textContent="Voice unavailable";return;}
    state.voices=speechSynthesis.getVoices();
    const preferred=["Google UK English Female","Microsoft Sonia Online","Microsoft Libby Online","Serena","Kate","Martha"];
    state.voice=preferred.map(name=>state.voices.find(v=>v.name.includes(name))).find(Boolean)
      ||state.voices.find(v=>/^en-GB/i.test(v.lang)&&/female|sonia|libby|serena|kate|martha/i.test(v.name))
      ||state.voices.find(v=>/^en-GB/i.test(v.lang))||state.voices.find(v=>/^en/i.test(v.lang))||state.voices[0]||null;
    els.voiceStatus.textContent=state.voice?state.voice.name.replace(/Microsoft | Online \(Natural\)/g,"").slice(0,24):"Browser voice";
  }
  function buttonSpeechState(button,mode){
    if(!button)return;
    const map={idle:["▶ Listen","Read this section aloud"],playing:["⏸ Pause","Pause speech"],paused:["▶ Continue","Continue from the paused position"]};
    button.textContent=map[mode][0];button.setAttribute("aria-label",map[mode][1]);button.dataset.speechState=mode;
  }
  function splitSpeechText(text,max=220){
    const normalized=text.replace(/\s+/g," ").trim();if(!normalized)return[];
    const sentences=normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[normalized],chunks=[];
    for(const raw of sentences){
      const sentence=raw.trim();
      if(sentence.length<=max){
        if(chunks.length&&chunks[chunks.length-1].length+sentence.length+1<=max)chunks[chunks.length-1]+=` ${sentence}`;
        else chunks.push(sentence);continue;
      }
      const words=sentence.split(/\s+/);let current="";
      for(const word of words){
        if((current+" "+word).trim().length>max&&current){chunks.push(current);current=word;}
        else current=(current+" "+word).trim();
      }
      if(current)chunks.push(current);
    }
    return chunks;
  }
  function extractSpeechText(unit){
    const clone=unit.cloneNode(true);
    $$(".listen-button,button,input,select,option,textarea,script,style,[hidden]",clone).forEach(node=>node.remove());
    return(clone.textContent||"").replace(/\s+/g," ").trim();
  }
  function resetSpeech(){
    if("speechSynthesis" in window)speechSynthesis.cancel();
    state.speech.session++;buttonSpeechState(state.speech.button,"idle");
    state.speech.button=null;state.speech.unit=null;state.speech.chunks=[];state.speech.index=0;state.speech.utterance=null;state.speech.paused=false;
  }
  function finishSpeech(){
    buttonSpeechState(state.speech.button,"idle");
    state.speech.button=null;state.speech.unit=null;state.speech.chunks=[];state.speech.index=0;state.speech.utterance=null;state.speech.paused=false;
  }
  function speakCurrentChunk(){
    if(!state.speech.button||state.speech.index>=state.speech.chunks.length){finishSpeech();return;}
    const session=state.speech.session;
    const utterance=new SpeechSynthesisUtterance(state.speech.chunks[state.speech.index]);
    if(state.voice)utterance.voice=state.voice;
    utterance.lang=state.voice?.lang||"en-GB";utterance.rate=Number(els.speechRate.value)||0.92;
    utterance.onend=()=>{if(session!==state.speech.session||state.speech.paused)return;state.speech.index++;if(state.speech.index<state.speech.chunks.length)speakCurrentChunk();else finishSpeech();};
    utterance.onerror=event=>{if(session!==state.speech.session||["canceled","interrupted"].includes(event.error))return;state.speech.paused=true;buttonSpeechState(state.speech.button,"paused");showToast("Speech paused. Tap Continue to retry.");};
    state.speech.utterance=utterance;buttonSpeechState(state.speech.button,"playing");speechSynthesis.speak(utterance);
  }
  function toggleSpeech(unit,button){
    if(!("speechSynthesis" in window)){showToast("Text-to-speech is unavailable in this browser");return;}
    if(state.speech.button===button){
      if(state.speech.paused||speechSynthesis.paused){speechSynthesis.resume();state.speech.paused=false;buttonSpeechState(button,"playing");return;}
      if(speechSynthesis.speaking){speechSynthesis.pause();state.speech.paused=true;buttonSpeechState(button,"paused");return;}
      if(state.speech.index<state.speech.chunks.length){state.speech.paused=false;speakCurrentChunk();return;}
    }
    resetSpeech();const text=extractSpeechText(unit),chunks=splitSpeechText(text);if(!chunks.length)return;
    state.speech.session++;state.speech.button=button;state.speech.unit=unit;state.speech.chunks=chunks;state.speech.index=0;state.speech.paused=false;speakCurrentChunk();
  }
  function addSpeechButtons(root=els.app){
    const floating=".hero,.stat-grid,.flow-chain,.table-wrap,.source-list,.checklist,.exam-strip";
    $$(".speech-unit",root).forEach(unit=>{
      if($(":scope > .listen-button",unit))return;
      const button=document.createElement("button");button.type="button";button.className="listen-button";buttonSpeechState(button,"idle");
      button.addEventListener("click",event=>{event.stopPropagation();toggleSpeech(unit,button);});
      if(unit.matches(floating)){unit.style.position="relative";button.classList.add("floating");unit.append(button);}else unit.prepend(button);
    });
  }

  function renderPhysiology(index){
    state.physiologyIndex=index;const step=content.physiologySteps[index],stage=$("#physiology-stage");if(!stage)return;
    stage.innerHTML=`<p class="eyebrow">Question ${index+1} of ${content.physiologySteps.length}</p><h2>${step.title}</h2><p>${step.body}</p><div class="callout success"><h3>Clinical pearl</h3><p>${step.pearl}</p></div>`;
    $$("[data-physiology-index]").forEach(button=>button.classList.toggle("active",Number(button.dataset.physiologyIndex)===index));addSpeechButtons(stage);
  }
  function initPhysiology(){
    const list=$("#physiology-step-list");if(!list)return;
    list.innerHTML=content.physiologySteps.map((step,i)=>`<button type="button" data-physiology-index="${i}" class="${i===state.physiologyIndex?"active":""}"><span>${i+1}</span><strong>${step.title}</strong></button>`).join("");
    list.addEventListener("click",event=>{const button=event.target.closest("[data-physiology-index]");if(button)renderPhysiology(Number(button.dataset.physiologyIndex));});renderPhysiology(state.physiologyIndex);
  }

  function renderDiagnostic(index){
    state.diagnosticIndex=index;const item=content.diagnosticData[index],stage=$("#diagnostic-stage");if(!stage)return;
    stage.innerHTML=`<p class="eyebrow">Test ${index+1} of ${content.diagnosticData.length}</p><h2>${item.title}</h2><div class="compare-grid"><div class="compare-card blue"><h3>What it contributes</h3><p>${item.use}</p></div><div class="compare-card red"><h3>Limitation</h3><p>${item.limit}</p></div></div>`;
    $$("[data-diagnostic-index]").forEach(button=>button.classList.toggle("active",Number(button.dataset.diagnosticIndex)===index));addSpeechButtons(stage);
  }
  function initDiagnostics(){
    const tabs=$("#diagnostic-tabs");if(!tabs)return;
    tabs.innerHTML=content.diagnosticData.map((item,i)=>`<button type="button" class="route-chip ${i===state.diagnosticIndex?"active":""}" data-diagnostic-index="${i}">${item.title}</button>`).join("");
    tabs.addEventListener("click",event=>{const button=event.target.closest("[data-diagnostic-index]");if(button)renderDiagnostic(Number(button.dataset.diagnosticIndex));});renderDiagnostic(state.diagnosticIndex);
  }

  function renderLesion(index){
    state.lesionIndex=index;const item=content.lesionData[index],stage=$("#lesion-stage");if(!stage)return;
    stage.innerHTML=`<span class="pill">${item.group}</span><h2>${item.title}</h2><div class="badge-row"><span class="pill">${item.tag}</span></div><p class="lead-copy">${item.summary}</p><p>${item.details}</p><button class="secondary-button" type="button" data-route="${item.id}"><strong>Open full module →</strong></button>`;
    $$("[data-lesion-index]").forEach(button=>button.classList.toggle("active",Number(button.dataset.lesionIndex)===index));addSpeechButtons(stage);
  }
  function initLesionMap(){
    const list=$("#lesion-list");if(!list)return;
    list.innerHTML=content.lesionData.map((item,i)=>`<button type="button" data-lesion-index="${i}" class="${i===state.lesionIndex?"active":""}"><strong>${item.title}</strong><small>${item.group}</small></button>`).join("");
    list.addEventListener("click",event=>{const button=event.target.closest("[data-lesion-index]");if(button)renderLesion(Number(button.dataset.lesionIndex));});renderLesion(state.lesionIndex);
  }

  function renderTet(index){
    state.tetIndex=index;const step=content.tetSteps[index],stage=$("#tet-stage");if(!stage)return;
    stage.innerHTML=`<p class="eyebrow">Emergency step ${index+1} of ${content.tetSteps.length}</p><h2>${step.title}</h2><p>${step.body}</p><div class="callout warning"><h3>Why it matters</h3><p>${step.pearl}</p></div>`;
    $$("[data-tet-index]").forEach(button=>button.classList.toggle("active",Number(button.dataset.tetIndex)===index));addSpeechButtons(stage);
  }
  function initTetSpell(){
    const list=$("#tet-step-list");if(!list)return;
    list.innerHTML=content.tetSteps.map((step,i)=>`<button type="button" data-tet-index="${i}" class="${i===state.tetIndex?"active":""}"><span>${i+1}</span><strong>${step.title}</strong></button>`).join("");
    list.addEventListener("click",event=>{const button=event.target.closest("[data-tet-index]");if(button)renderTet(Number(button.dataset.tetIndex));});renderTet(state.tetIndex);
  }

  function initShuntLab(){
    const lesion=$("#shunt-lesion"),phase=$("#shunt-phase"),result=$("#shunt-result");if(!lesion||!phase||!result)return;
    const maps={
      asd:{name:"Atrial septal defect",connection:"Atrial communication",typical:{direction:"Left-to-right",flow:"Increased",load:"RA/RV volume overload",sign:"Wide fixed split S2 with pulmonary flow murmur",closure:"Close a significant shunt with RV enlargement when PVR and anatomy are acceptable"},large:{direction:"Larger left-to-right shunt",flow:"Markedly increased",load:"More RA/RV dilatation; possible pulmonary hypertension",sign:"RV heave, fixed S2, flow murmurs, later atrial arrhythmia",closure:"Specialist assessment of pulmonary pressure, PVR, symptoms, and device/surgical anatomy"},reversed:{direction:"Bidirectional or right-to-left",flow:"Pulmonary vascular disease",load:"RV pressure load with systemic cyanosis",sign:"Loud P2, cyanosis; original flow findings may diminish",closure:"Do not simply close established Eisenmenger physiology"}},
      vsd:{name:"Ventricular septal defect",connection:"Ventricular communication",typical:{direction:"Left-to-right",flow:"Increased",load:"LA/LV volume overload",sign:"Harsh holosystolic LLSB murmur",closure:"Observe small uncomplicated defects; close significant symptomatic shunts or complications"},large:{direction:"Large nonrestrictive left-to-right shunt",flow:"Markedly increased",load:"LA/LV volume load plus high RV pressure",sign:"Heart failure in infancy; murmur may be less intense than expected",closure:"Stabilize heart failure then close before irreversible pulmonary vascular disease"},reversed:{direction:"Bidirectional or right-to-left",flow:"Pulmonary vascular disease",load:"RV pressure overload and systemic cyanosis",sign:"Loud P2 and a quieter old VSD murmur",closure:"Do not close established Eisenmenger VSD"}},
      pda:{name:"Patent ductus arteriosus",connection:"Aorta-to-pulmonary artery communication",typical:{direction:"Continuous aortic-to-pulmonary flow",flow:"Increased",load:"LA/LV volume overload",sign:"Continuous infraclavicular murmur with bounding pulses",closure:"Close a significant PDA, usually by transcatheter device"},large:{direction:"Large continuous left-to-right shunt",flow:"Markedly increased",load:"LA/LV dilatation, heart failure, pulmonary hypertension",sign:"Wide pulse pressure, tachypnea, poor growth",closure:"Assess PVR and close when reversible and anatomically suitable"},reversed:{direction:"Right-to-left ductal flow",flow:"Pulmonary vascular disease",load:"RV pressure load and differential systemic desaturation",sign:"Differential cyanosis: lower limbs more desaturated",closure:"Do not close irreversible Eisenmenger PDA"}},
      eisenmenger:{name:"Eisenmenger physiology",connection:"Former large systemic-to-pulmonary communication",typical:{direction:"Bidirectional or right-to-left",flow:"Irreversible pulmonary vascular disease",load:"RV pressure overload with systemic consequences",sign:"Cyanosis, clubbing, loud P2, quieter original murmur",closure:"Do not simply close; use expert ACHD and pulmonary hypertension care"},large:{direction:"Bidirectional or right-to-left",flow:"Irreversible pulmonary vascular disease",load:"RV pressure overload with systemic consequences",sign:"Cyanosis, clubbing, loud P2, quieter original murmur",closure:"Do not simply close; use expert ACHD and pulmonary hypertension care"},reversed:{direction:"Right-to-left / bidirectional",flow:"Irreversible pulmonary vascular disease",load:"RV pressure overload with systemic consequences",sign:"Cyanosis, clubbing, loud P2, quieter original murmur",closure:"Do not simply close; use expert ACHD and pulmonary hypertension care"}}
    };
    const draw=()=>{
      const base=maps[lesion.value],item=base[phase.value]||base.typical;
      result.innerHTML=`<p class="eyebrow">Built physiology</p><h2>${base.name}</h2><div class="stat-grid"><div class="stat"><strong>${base.connection}</strong><span>Connection</span></div><div class="stat"><strong>${item.direction}</strong><span>Direction</span></div><div class="stat"><strong>${item.flow}</strong><span>Pulmonary state</span></div><div class="stat"><strong>${item.load}</strong><span>Chamber response</span></div></div><div class="compare-grid" style="margin-top:16px"><div class="compare-card blue"><h3>Expected bedside pattern</h3><p>${item.sign}</p></div><div class="compare-card red"><h3>Closure logic</h3><p>${item.closure}</p></div></div>`;addSpeechButtons(result);
    };
    [lesion,phase].forEach(input=>input.addEventListener("input",draw));draw();
  }

  function initGradientTool(){
    const arm=$("#arm-pressure"),leg=$("#leg-pressure"),result=$("#gradient-result");if(!arm||!leg||!result)return;
    const draw=()=>{
      const a=Number(arm.value),l=Number(leg.value);
      if(!Number.isFinite(a)||!Number.isFinite(l)){result.innerHTML="<p>Enter both systolic pressures.</p>";return;}
      const difference=a-l;
      const direction=difference>0?`The arm pressure is ${Math.abs(difference)} mmHg higher than the leg pressure.`:difference<0?`The leg pressure is ${Math.abs(difference)} mmHg higher than the arm pressure.`:"Arm and leg systolic pressures are equal in this example.";
      const meaning=difference>0?"This direction is compatible with the classic coarctation pattern, especially when femoral pulses are weak or delayed. Confirm technique and interpret with all four limbs, anatomy, age, and clinical context.":"This single resting comparison does not exclude coarctation or residual repaired disease. Collateral flow, measurement technique, and exercise hypertension can obscure the pattern.";
      result.innerHTML=`<p class="eyebrow">Arm–leg comparison</p><div class="big-result">${difference>0?"+":""}${difference} mmHg</div><h2>${direction}</h2><p>${meaning}</p><div class="callout warning"><h3>Do not use this alone</h3><p>Pulse delay, complete four-limb measurement, echocardiography, CT/CMR, and sometimes exercise or catheter assessment are required.</p></div>`;addSpeechButtons(result);
    };
    [arm,leg].forEach(input=>input.addEventListener("input",draw));draw();
  }

  function initMurmurLab(){
    const select=$("#murmur-clue"),result=$("#murmur-result");if(!select||!result)return;
    const clues={
      fixed:{lesion:"Atrial septal defect",why:"Chronic RV volume loading prolongs RV ejection, while respiratory changes in venous return are partly offset by reciprocal changes in shunt flow.",next:"Look for RV heave, pulmonary flow murmur, RA/RV enlargement, and suitable closure anatomy."},
      holosystolic:{lesion:"Ventricular septal defect",why:"Systolic LV-to-RV flow creates a harsh holosystolic murmur. A very loud murmur often means a restrictive defect with a high gradient.",next:"Use echo to define location, restriction, chamber load, aortic valve involvement, and pulmonary pressure."},
      continuous:{lesion:"Patent ductus arteriosus",why:"Aortic pressure exceeds pulmonary pressure through systole and diastole, creating continuous flow and diastolic runoff.",next:"Check LA/LV volume load, pulmonary pressure, and suitability for transcatheter closure."},
      "delayed-p2":{lesion:"Pulmonary stenosis",why:"RV ejection is prolonged and pulmonary valve closure is delayed; severe obstruction makes P2 soft.",next:"Assess Doppler gradient, valve morphology, RV pressure/function, and suitability for balloon valvuloplasty."},
      "weak-femoral":{lesion:"Coarctation of the aorta",why:"Aortic arch obstruction raises upper-body pressure and reduces or delays lower-body pulse transmission.",next:"Measure four-limb pressures and image the entire arch and aorta."},
      "single-s2":{lesion:"Tetralogy of Fallot",why:"Pulmonary flow is reduced and P2 is soft or absent. The systolic murmur arises from RVOT obstruction.",next:"Assess cyanosis, RVOT severity, spell history, pulmonary arteries, and repair status."},
      "loud-p2":{lesion:"Eisenmenger physiology",why:"Severe pulmonary hypertension accentuates P2 while pressure equalization makes the original shunt murmur quieter.",next:"Do not close reflexively; obtain expert ACHD and pulmonary hypertension assessment."}
    };
    const draw=()=>{const x=clues[select.value];result.innerHTML=`<p class="eyebrow">Most likely pattern</p><h2>${x.lesion}</h2><div class="compare-grid"><div class="compare-card blue"><h3>Why the clue fits</h3><p>${x.why}</p></div><div class="compare-card red"><h3>What to do next</h3><p>${x.next}</p></div></div>`;addSpeechButtons(result);};
    select.addEventListener("input",draw);draw();
  }

  function renderCases(){
    const root=$("#case-lab");if(!root)return;const item=content.cases[state.caseIndex];
    root.innerHTML=`<div class="case-shell"><div><p class="eyebrow">Choose a case</p><div class="case-list" id="case-list">${content.cases.map((x,i)=>`<button type="button" class="${i===state.caseIndex?"active":""}" data-case-index="${i}"><strong>${i+1}. ${x.title}</strong><small>${x.tag}</small></button>`).join("")}</div></div><div class="case-card speech-unit"><p class="eyebrow">Case ${state.caseIndex+1} of ${content.cases.length} · ${item.tag}</p><h2>${item.title}</h2><p>${item.stem}</p><div class="case-prompt"><strong>Your task</strong><p>${item.question}</p></div><button class="primary-button" id="reveal-case" type="button">Reveal reasoning</button><div class="answer-box" id="case-answer"><strong>Reasoned answer</strong><p>${item.answer}</p><h3>Key pearls</h3><ul class="clean-list">${item.pearls.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="choice-row" style="margin-top:17px"><button class="secondary-button" id="previous-case" type="button" ${state.caseIndex===0?"disabled":""}><strong>← Previous case</strong></button><button class="secondary-button" id="next-case" type="button" ${state.caseIndex===content.cases.length-1?"disabled":""}><strong>Next case →</strong></button></div></div></div>`;
    $("#case-list",root).addEventListener("click",event=>{const button=event.target.closest("[data-case-index]");if(!button)return;resetSpeech();state.caseIndex=Number(button.dataset.caseIndex);renderCases();});
    $("#reveal-case",root).addEventListener("click",event=>{$("#case-answer",root).classList.add("revealed");event.currentTarget.hidden=true;});
    $("#previous-case",root).addEventListener("click",()=>{if(state.caseIndex>0){resetSpeech();state.caseIndex--;renderCases();}});
    $("#next-case",root).addEventListener("click",()=>{if(state.caseIndex<content.cases.length-1){resetSpeech();state.caseIndex++;renderCases();}});addSpeechButtons(root);
  }

  function renderFlashcards(){
    const root=$("#flashcard-lab");if(!root)return;const tags=["All",...new Set(content.flashcards.map(x=>x.tag))],cards=content.flashcards.filter(x=>state.flashFilter==="All"||x.tag===state.flashFilter);
    root.innerHTML=`<div class="flash-toolbar"><div><strong>${cards.length} cards</strong><p class="small muted" style="margin:2px 0 0">Click or press Enter/Space to flip each card.</p></div><div class="choice-row"><button class="secondary-button" id="reveal-flashcards" type="button">Reveal all</button><button class="secondary-button" id="reset-flashcards" type="button">Reset</button></div></div><div class="flash-filters" id="flash-filters">${tags.map(tag=>`<button class="chip-button ${tag===state.flashFilter?"selected":""}" type="button" data-flash-filter="${escapeHTML(tag)}">${tag}</button>`).join("")}</div><div class="flash-grid" id="flash-grid">${cards.map((x,i)=>`<button class="flashcard" type="button" data-flash-index="${i}" aria-pressed="false" aria-label="Flashcard: ${escapeHTML(x.q)}"><span class="flash-inner"><span class="flash-face flash-front"><span class="flash-tag">${x.tag}</span><strong>${x.q}</strong><span class="flash-hint">Click or press Enter to reveal</span></span><span class="flash-face flash-back"><span class="flash-tag">Answer</span><strong>${x.a}</strong><span class="flash-hint">Click to return</span></span></span></button>`).join("")}</div>`;
    $("#flash-filters",root).addEventListener("click",event=>{const button=event.target.closest("[data-flash-filter]");if(!button)return;state.flashFilter=button.dataset.flashFilter;renderFlashcards();});
    $("#flash-grid",root).addEventListener("click",event=>{const card=event.target.closest(".flashcard");if(!card)return;card.classList.toggle("flipped");card.setAttribute("aria-pressed",card.classList.contains("flipped")?"true":"false");});
    $("#reveal-flashcards",root).addEventListener("click",()=>{$$(".flashcard",root).forEach(card=>{card.classList.add("flipped");card.setAttribute("aria-pressed","true");});});
    $("#reset-flashcards",root).addEventListener("click",()=>{$$(".flashcard",root).forEach(card=>{card.classList.remove("flipped");card.setAttribute("aria-pressed","false");});});
  }

  function renderQuiz(){
    const root=$("#quiz-lab");if(!root)return;const total=content.quiz.length,qState=state.quiz;
    if(!Number.isInteger(qState.index)||qState.index<0||qState.index>=total)state.quiz={...initialQuiz};
    if(qState.finished){
      const pct=Math.round(qState.score/total*100),message=pct>=85?"Excellent command of congenital physiology.":pct>=70?"Strong result. Review the weaker lesion patterns.":pct>=50?"Good foundation. Revisit shunts, cyanosis, and emergencies.":"Rebuild the physiology-first framework, then try again.";
      root.innerHTML=`<div class="score-panel"><p class="eyebrow">Quiz complete</p><div class="score-number">${qState.score} / ${total}</div><h2>${message}</h2><p class="muted">Your score is stored locally in this browser until you restart.</p><button class="primary-button" id="restart-quiz" type="button">Restart quiz</button></div>`;
      $("#restart-quiz",root).addEventListener("click",()=>{state.quiz={...initialQuiz};writeJSON(KEYS.quiz,state.quiz);renderQuiz();});return;
    }
    const question=content.quiz[qState.index];
    root.innerHTML=`<div class="quiz-shell"><div class="quiz-progress"><strong>Question ${qState.index+1} of ${total}</strong><span>Score ${qState.score}</span></div><div class="quiz-track"><span style="width:${qState.index/total*100}%"></span></div><div class="quiz-card"><h2>${question.q}</h2><div class="quiz-choices">${question.choices.map((choice,i)=>`<button class="choice-button ${qState.answered?(i===question.answer?"correct":i===qState.selected?"wrong":""):""}" type="button" data-quiz-choice="${i}" ${qState.answered?"disabled":""}>${String.fromCharCode(65+i)}. ${choice}</button>`).join("")}</div>${qState.answered?`<div class="quiz-explanation"><strong>${qState.selected===question.answer?"Correct":"Not quite"}</strong><p>${question.explanation}</p></div><button class="primary-button" id="next-question" type="button" style="margin-top:14px">${qState.index===total-1?"See final score":"Next question"}</button>`:""}</div></div>`;
    $$('[data-quiz-choice]',root).forEach(button=>button.addEventListener("click",()=>{if(qState.answered)return;qState.selected=Number(button.dataset.quizChoice);qState.answered=true;if(qState.selected===question.answer)qState.score++;writeJSON(KEYS.quiz,qState);renderQuiz();}));
    $("#next-question",root)?.addEventListener("click",()=>{if(qState.index===total-1)qState.finished=true;else{qState.index++;qState.answered=false;qState.selected=null;}writeJSON(KEYS.quiz,qState);renderQuiz();});
  }

  function initRoute(route){
    const map={framework:initPhysiology,diagnostics:initDiagnostics,"lesion-map":initLesionMap,"tet-spell":initTetSpell,"shunt-lab":initShuntLab,coarctation:initGradientTool,"murmur-lab":initMurmurLab,cases:renderCases,flashcards:renderFlashcards,quiz:renderQuiz};
    if(map[route])map[route]();
  }
  function applyTheme(theme){document.documentElement.setAttribute("data-theme",theme);storage.set(KEYS.theme,theme);els.theme.setAttribute("aria-label",theme==="dark"?"Switch to light theme":"Switch to dark theme");}
  function initializeTheme(){applyTheme(storage.get(KEYS.theme)||"light");}

  document.addEventListener("click",event=>{
    const route=event.target.closest("[data-route]");if(route){event.preventDefault();navigate(route.dataset.route);return;}
    if(event.target.closest(".bookmark-module")){toggleBookmark(state.route);return;}
    const hit=event.target.closest("[data-search-route]");if(hit){els.search.value="";els.searchResults.hidden=true;navigate(hit.dataset.searchRoute);return;}
    const saved=event.target.closest("[data-bookmark-route]");if(saved){els.bookmarkDialog.close();navigate(saved.dataset.bookmarkRoute);return;}
    const remove=event.target.closest("[data-remove-bookmark]");if(remove){toggleBookmark(remove.dataset.removeBookmark);return;}
    if(!event.target.closest(".search-box")&&!event.target.closest(".search-results"))els.searchResults.hidden=true;
  });
  els.menu.addEventListener("click",openSidebar);els.closeSidebar.addEventListener("click",closeSidebar);els.scrim.addEventListener("click",closeSidebar);
  els.resetProgress.addEventListener("click",()=>{state.visited=new Set([state.route]);writeJSON(KEYS.visited,[state.route]);updateNav();showToast("Progress reset");});
  els.clearBookmarks.addEventListener("click",()=>{state.bookmarks=[];writeJSON(KEYS.bookmarks,[]);renderBookmarkList();$(".bookmark-module")?.classList.remove("active");showToast("Bookmarks cleared");});
  els.bookmarksButton.addEventListener("click",()=>{renderBookmarkList();els.bookmarkDialog.showModal();});els.closeBookmarks.addEventListener("click",()=>els.bookmarkDialog.close());
  els.search.addEventListener("input",event=>searchSite(event.target.value));els.stopSpeech.addEventListener("click",()=>{resetSpeech();showToast("Speech stopped and reset");});els.print.addEventListener("click",()=>window.print());
  els.speechRate.value=storage.get(KEYS.rate)||"0.92";els.speechRate.addEventListener("change",()=>storage.set(KEYS.rate,els.speechRate.value));
  els.theme.addEventListener("click",()=>applyTheme(document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark"));
  window.addEventListener("hashchange",()=>render(routeFromHash()));window.addEventListener("beforeunload",resetSpeech);
  document.addEventListener("keydown",event=>{if(event.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){event.preventDefault();els.search.focus();}if(event.key==="Escape"){els.searchResults.hidden=true;closeSidebar();if(els.bookmarkDialog.open)els.bookmarkDialog.close();}});

  buildNav();initializeTheme();renderBookmarkList();loadVoices();if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=loadVoices;navigate(routeFromHash(),true);
})();
