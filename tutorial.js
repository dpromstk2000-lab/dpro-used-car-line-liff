/* DPRO CAR TUTORIAL / R3 STANDARD V1.1 / 20260829 */
(() => {
  "use strict";
  if (window.DPRO_CAR_TUTORIAL) return;

  const VERSION = "DPRO-CAR-TUTORIAL-R3-V1.1-20260829";
  const KEY = "dpro_car_tutorial_v1";
  const FIRST10 = Object.freeze([
    {id:"CAR-01",route:"index.html",title:"車を売りたい",copy:"買取・下取り・写真査定への入口です。ここでは場所だけ確認し、リンクは自動で押しません。",primary:"#sellLink",fallback:".quick-grid .quick-card.primary",focus:"#sellLink"},
    {id:"CAR-02",route:"index.html",title:"車を買いたい",copy:"公開在庫へ進む入口です。Tutorialはハイライトのみで、画面遷移はTutorialの「次へ」で行います。",primary:"#buyLink",fallback:'.quick-grid a[href^="inventory.html"]',focus:"#buyLink"},
    {id:"CAR-03",route:"index.html",title:"マイページ",copy:"査定・商談・納車予定などを確認する入口です。お客様データの更新は行いません。",primary:"#memberLink",fallback:'.quick-grid a[href^="member.html"]',focus:"#memberLink"},
    {id:"CAR-04",route:"sell.html",title:"買取査定",copy:"査定申込みの種類を確認します。Tutorialは選択や送信を自動実行しません。",primary:'input[name="case_type"][value="purchase"] + .choice-box',fallback:'.step[data-step="1"] .choice-grid:first-of-type .choice:first-child .choice-box',focus:'input[name="case_type"][value="purchase"]'},
    {id:"CAR-05",route:"sell.html",title:"写真概算",copy:"来店前に写真で相談できる査定方法です。写真選択・アップロードはTutorialの対象外です。",primary:'input[name="appraisal_method"][value="photo"] + .choice-box',fallback:'.step[data-step="1"] .choice-grid.three .choice:nth-child(3) .choice-box',focus:'input[name="appraisal_method"][value="photo"]'},
    {id:"CAR-06",route:"sell.html",title:"次へ",copy:"査定フォームは4段階です。このステップでは最初の「次へ」の位置だけ確認し、Tutorialからフォーム送信はしません。",primary:"#nextButton",fallback:'.actions .button.primary[type="button"]',focus:"#nextButton"},
    {id:"CAR-07",route:"inventory.html",title:"キーワード検索",copy:"車名や装備などで公開在庫を絞り込む欄です。Tutorialは文字入力や検索送信を自動実行しません。",primary:"#keyword",fallback:'#filterForm input[type="search"]',focus:"#keyword"},
    {id:"CAR-08",route:"inventory.html",title:"詳細な絞り込み",copy:"年式・走行距離・燃料などの追加条件を確認できます。開閉は公開画面内のローカル操作です。",primary:"#advancedFilters > summary",fallback:"details.advanced > summary",focus:"#advancedFilters > summary"},
    {id:"CAR-09",route:"inventory.html",title:"在庫結果",copy:"現在案内できる車の一覧領域です。Tutorialは車両詳細・試乗相談を自動で開きません。",primary:"#stockGrid",fallback:"section.stock-grid",focus:null},
    {id:"CAR-10",route:"owner-ipad.html",title:"管理コード",copy:"現場管理画面の入口です。管理コード欄だけを説明し、自動ログインや業務ステータス更新は絶対に実行しません。",primary:"#adminCode",fallback:"#loginForm .code-input",focus:"#adminCode"}
  ]);

  let card, highlight, launcher, titleNode, copyNode, kickerNode, noteNode, nextButton, backButton;
  let drag = null;

  function safeParse(raw){try{return JSON.parse(raw)}catch{return null}}
  function readState(){
    const parsed=safeParse(localStorage.getItem(KEY));
    const step=Number(parsed?.step);
    return {step:Number.isInteger(step)&&step>=1&&step<=10?step:1,status:["active","paused","completed"].includes(parsed?.status)?parsed.status:"idle",updatedAt:parsed?.updatedAt||null};
  }
  function writeState(next){const state={...readState(),...next,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent("dpro-car-tutorial-state",{detail:state}));return state}
  function fileName(){const p=location.pathname.split("/").filter(Boolean).pop()||"index.html";return p.includes(".")?p:"index.html"}
  function routeUrl(route){const params=new URLSearchParams(location.search);params.set("demo","1");params.delete("tutorial");return `${route}?${params.toString()}`}
  function isVisible(el){if(!el)return false;const style=getComputedStyle(el);if(style.display==="none"||style.visibility==="hidden"||Number(style.opacity)===0)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth}
  function resolveTarget(step){
    const selectors=[step.primary,step.fallback].filter(Boolean);
    for(const selector of selectors){const el=document.querySelector(selector);if(el&&isVisible(el))return {el,selector};}
    for(const selector of selectors){const el=document.querySelector(selector);if(!el)continue;try{el.scrollIntoView({block:"center",inline:"nearest",behavior:"auto"})}catch{}if(isVisible(el))return {el,selector};}
    return {el:null,selector:null};
  }
  function clamp(value,min,max){return Math.min(Math.max(value,min),Math.max(min,max))}
  function clampCard(){if(!card||card.hidden)return;const r=card.getBoundingClientRect();const left=clamp(r.left,8,innerWidth-r.width-8);const top=clamp(r.top,8,innerHeight-r.height-8);card.style.left=`${left}px`;card.style.top=`${top}px`;card.style.right="auto";card.style.bottom="auto"}
  function positionHighlight(target){
    if(!highlight)return;
    if(!target||!isVisible(target)){highlight.style.display="none";return;}
    const r=target.getBoundingClientRect(),pad=6;
    const left=clamp(r.left-pad,4,innerWidth-8),top=clamp(r.top-pad,4,innerHeight-8);
    const right=clamp(r.right+pad,8,innerWidth-4),bottom=clamp(r.bottom+pad,8,innerHeight-4);
    highlight.style.cssText+=`;display:block;left:${left}px;top:${top}px;width:${Math.max(0,right-left)}px;height:${Math.max(0,bottom-top)}px`;
  }
  function focusTarget(step,resolved){
    const focusEl=step.focus?document.querySelector(step.focus):null;
    if(focusEl&&typeof focusEl.focus==="function"){try{focusEl.focus({preventScroll:true})}catch{focusEl.focus()}return}
    if(!resolved.el) nextButton?.focus();
  }
  function showLauncher(){if(!launcher)return;launcher.hidden=false;const state=readState();const resume=launcher.querySelector("[data-action=resume]");resume.hidden=!(state.status==="paused"||state.status==="active");const replay=launcher.querySelector("[data-action=replay]");replay.hidden=state.status!=="completed"}
  function hideTutorial(status="paused"){
    if(card)card.hidden=true;if(highlight)highlight.style.display="none";document.body.classList.remove("dpro-tutorial-active");writeState({status});showLauncher();
  }
  function renderStep(){
    const state=readState();const index=clamp(state.step,1,10)-1;const step=FIRST10[index];
    if(fileName()!==step.route){location.href=routeUrl(step.route);return;}
    card.hidden=false;document.body.classList.add("dpro-tutorial-active");
    kickerNode.textContent=`${step.id} / ${index+1} of 10`;titleNode.textContent=step.title;copyNode.textContent=step.copy;
    const resolved=resolveTarget(step);
    noteNode.textContent=resolved.el?`対象を確認中：${step.title}`:`対象が画面内に見つからないため、安全にTutorial操作へ戻しました。画面を再読込しても業務操作は実行されません。`;
    positionHighlight(resolved.el);backButton.disabled=index===0;nextButton.textContent=index===9?"完了":"次へ";
    writeState({step:index+1,status:"active"});showLauncher();
    setTimeout(()=>{positionHighlight(resolved.el);clampCard();focusTarget(step,resolved)},0);
  }
  function goToStep(n){const step=clamp(Number(n)||1,1,10);writeState({step,status:"active"});renderStep()}
  function next(){const state=readState();if(state.step>=10){hideTutorial("completed");return}goToStep(state.step+1)}
  function back(){const state=readState();if(state.step>1)goToStep(state.step-1)}
  function start(){writeState({step:1,status:"active"});goToStep(1)}
  function resume(){const state=readState();writeState({step:state.step,status:"active"});renderStep()}
  function replay(){writeState({step:1,status:"active"});goToStep(1)}
  function skip(){hideTutorial("completed")}

  function build(){
    if(document.getElementById("dproTutorialCard"))return;
    highlight=document.createElement("div");highlight.id="dproTutorialHighlight";highlight.setAttribute("aria-hidden","true");
    card=document.createElement("section");card.id="dproTutorialCard";card.hidden=true;card.setAttribute("role","dialog");card.setAttribute("aria-modal","false");card.setAttribute("aria-label","DPRO CAR 操作チュートリアル");
    card.innerHTML=`<div class="dpro-tutorial-drag" id="dproTutorialDrag" tabindex="0" aria-label="チュートリアルカード移動ハンドル"><span>DPRO CAR 操作ガイド</span><span class="dpro-tutorial-dots" aria-hidden="true">•••</span></div><div class="dpro-tutorial-body"><p class="dpro-tutorial-kicker" id="dproTutorialKicker"></p><h2 id="dproTutorialTitle"></h2><p id="dproTutorialCopy"></p><p class="dpro-tutorial-target-note" id="dproTutorialNote"></p></div><div class="dpro-tutorial-controls"><button type="button" id="dproTutorialBack">戻る</button><button type="button" class="primary" id="dproTutorialNext">次へ</button><button type="button" id="dproTutorialClose">閉じる</button><button type="button" id="dproTutorialSkip">スキップ</button><button type="button" id="dproTutorialReplay">最初から</button></div>`;
    launcher=document.createElement("div");launcher.id="dproTutorialLauncher";launcher.innerHTML=`<button class="primary" type="button" data-action="start">操作ガイド</button><button type="button" data-action="resume">続きから</button><button type="button" data-action="replay">もう一度</button><a href="demo-guide.html?demo=1">ガイド一覧</a>`;
    document.body.append(highlight,card,launcher);
    titleNode=card.querySelector("#dproTutorialTitle");copyNode=card.querySelector("#dproTutorialCopy");kickerNode=card.querySelector("#dproTutorialKicker");noteNode=card.querySelector("#dproTutorialNote");nextButton=card.querySelector("#dproTutorialNext");backButton=card.querySelector("#dproTutorialBack");
    backButton.addEventListener("click",back);nextButton.addEventListener("click",next);card.querySelector("#dproTutorialClose").addEventListener("click",()=>hideTutorial("paused"));card.querySelector("#dproTutorialSkip").addEventListener("click",skip);card.querySelector("#dproTutorialReplay").addEventListener("click",replay);
    launcher.addEventListener("click",e=>{const b=e.target.closest("button[data-action]");if(!b)return;({start,resume,replay}[b.dataset.action]||(()=>{}))()});
    const handle=card.querySelector("#dproTutorialDrag");
    handle.addEventListener("pointerdown",e=>{if(e.button!==undefined&&e.button!==0)return;const r=card.getBoundingClientRect();drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};try{handle.setPointerCapture(e.pointerId)}catch{}e.preventDefault()});
    handle.addEventListener("pointermove",e=>{if(!drag||e.pointerId!==drag.id)return;const r=card.getBoundingClientRect();const left=clamp(e.clientX-drag.dx,8,innerWidth-r.width-8),top=clamp(e.clientY-drag.dy,8,innerHeight-r.height-8);card.style.left=`${left}px`;card.style.top=`${top}px`;card.style.right="auto";card.style.bottom="auto";e.preventDefault()});
    const end=e=>{if(drag&&e.pointerId===drag.id)drag=null};handle.addEventListener("pointerup",end);handle.addEventListener("pointercancel",end);
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!card.hidden){e.preventDefault();hideTutorial("paused")}});
    const reposition=()=>{if(card&&!card.hidden){clampCard();const step=FIRST10[readState().step-1];positionHighlight(resolveTarget(step).el)}};addEventListener("resize",reposition);addEventListener("scroll",reposition,{passive:true});
    showLauncher();
    const params=new URLSearchParams(location.search),state=readState();
    if(params.get("tutorial")==="1")start();else if(state.status==="active")renderStep();
  }

  window.DPRO_CAR_TUTORIAL=Object.freeze({version:VERSION,key:KEY,steps:FIRST10,start,resume,replay,skip,close:()=>hideTutorial("paused"),goToStep,getState:readState});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build,{once:true});else build();
})();
