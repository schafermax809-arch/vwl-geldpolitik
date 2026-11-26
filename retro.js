import {resolveOSRoute} from './lib/os-routes.js';
import {topics} from './data/content.js?v=5-review';
import {questions} from './data/questions.js?v=5-review';
import {load,topicProgress,esc,STORE} from './lib/core.js?v=5-review';

const $=s=>document.querySelector(s),desktop=$('#os-desktop');
const preferences='vwl-os-preferences-v1';let config={theme:'pastel',positions:{}},z=20,drag=null,focusReturnScroll=0;
try{config={...config,...JSON.parse(localStorage.getItem(preferences)||'{}')}}catch{}
const programs=[
{id:'lernen',file:'EZB.exe',label:'Lernmodule',route:'lernen',icon:'bank',color:'lavender'},
{id:'uebung',file:'ÜBEN.exe',label:'Aufgaben',route:'uebung',icon:'pencil',color:'yellow'},
{id:'lab',file:'ZINSLABOR',label:'Ausprobieren',icon:'chart',color:'mint'},
{id:'klausur',file:'KLAUSUR.exe',label:'Klausurmodus',route:'klausur',icon:'clock',color:'pink'},
{id:'karten',file:'KARTEN.app',label:'Karteikarten',route:'karten',icon:'cards',color:'lavender'},
{id:'glossar',file:'LEXIKON.txt',label:'Begriffe & Formeln',route:'glossar',icon:'book',color:'mint'},
{id:'produkte',file:'NOTIZEN.txt',label:'Mindmap & Ideen',route:'produkte',icon:'note',color:'yellow'},
{id:'guide',file:'LIESMICH.txt',label:'Kurz erklärt',icon:'floppy',color:'pink'}
];
const paths={bank:'M6 18h36v3H6zm3 3h4v15H9zm10 0h4v15h-4zm10 0h4v15h-4zm10 0h3v15h-3zM6 36h36v4H6zm0-22L24 4l18 10v3H6z',pencil:'M8 34 31 11l7 7-23 23-9 2zm24-26 4-4 8 8-4 4zM4 4h22v3H7v24H4zm0 33h3v7h24v-3h3v6H4z',chart:'M5 5h38v33H5zM8 8v25h32V8zm2 18 9-9 8 6 10-12 2 2-12 15-8-6-7 7zM18 39h12v4h6v3H12v-3h6z',clock:'M13 5h22v4h6v6h4v20h-4v7h-6v4H13v-4H6v-7H3V15h3V9h7zm2 5v4h-5v6H8v12h3v6h6v3h15v-3h5v-6h3V19h-3v-5h-6v-4zm7 6h4v11h9v4H22z',cards:'M3 11h5v30h28v4H3zM10 5h34v33H10zm4 4v25h26V9zm4 5h17v3H18zm0 8h12v3H18z',book:'M4 6h16l4 4 4-4h16v34H28l-4 4-4-4H4zm4 4v26h13V14l-3-4zm19 4v22h13V10H30z',note:'M7 3h25l10 10v32H7zm4 4v34h27V17H29V7zm22 3v3h3zM15 20h19v3H15zm0 7h19v3H15zm0 7h12v3H15z',floppy:'M5 3h33l6 6v36H5zm4 4v34h31V12l-5-5h-3v13H13V7zm9 0v9h9V7zm-4 18h21v14H14zm4 4v6h13v-6z'};
function pixel(p){return `<svg class="pixel-icon ${p.color}" viewBox="0 0 48 48" aria-hidden="true"><rect x="3" y="5" width="42" height="40" rx="0" fill="${({lavender:'#c7b5ee',yellow:'#edda9c',mint:'#b9e4ce',pink:'#ecc5cf'})[p.color]}" opacity=".65"/><path d="${paths[p.icon]}" fill="#3c3446"/></svg>`}
$('#desktop-icons').innerHTML=programs.map(p=>`<button class="desktop-icon" data-open="${p.id}" title="${p.label}" aria-label="${p.file} – ${p.label} öffnen">${pixel(p)}<span>${p.file}</span></button>`).join('');
$('#start-menu').innerHTML=programs.map(p=>`<button data-open="${p.id}">${pixel(p)}<span>${p.file}</span></button>`).join('')+`<button data-launch="quellen">[?] Quellen & Sicherung</button><a class="os-button" href="https://schafermax809-arch.github.io/lernzettel/">weiter. / Alle Lernseiten</a>`;
function persist(){try{localStorage.setItem(preferences,JSON.stringify(config))}catch{}}
function theme(){document.documentElement.dataset.osTheme=config.theme;$('#os-theme').setAttribute('aria-label',config.theme==='terminal'?'Pastell-Modus einschalten':'Terminal-Modus einschalten');$('#os-theme').innerHTML=`◐ <span>${config.theme==='terminal'?'Pastell':'Terminal'}</span>`;sendTheme();persist()}
function sendTheme(){const frame=$('#program-frame');if(frame.contentWindow&&frame.getAttribute('src')!=='about:blank')frame.contentWindow.postMessage({type:'vwl-os-theme',theme:config.theme},location.origin)}
function progress(){const s=load({getItem:k=>localStorage.getItem(k)}),p=Math.round(topics.reduce((sum,t)=>sum+topicProgress(t.id,s,questions),0)/topics.length);$('#welcome-progress').textContent=`${s.read.length}/6 Module gelesen · ${p} % Gesamtfortschritt`;$('#taskbar-progress').textContent=`${p} % gelernt`}
function clock(){$('#os-clock').textContent=new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'}).format(new Date())}clock();setInterval(clock,30000);
function focusWindow(id){const w=$('#window-'+id);w.style.zIndex=++z;w.querySelector('.window-titlebar')?.setAttribute('data-active','true')}
function openWindow(id){const w=$('#window-'+id);if(!w)return;if(document.body.classList.contains('os-focused')&&!w.classList.contains('maximized'))leaveFocus();w.hidden=false;w.dataset.closed='false';focusWindow(id);tasks();if(matchMedia('(max-width:850px)').matches)w.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'})}
function launch(id,routeOverride){
 if(id==='lab'||id==='guide'||id==='welcome'){openWindow(id);return}
 const p=programs.find(p=>p.id===id)||{id,route:id},state=load({getItem:k=>localStorage.getItem(k)});
 const hash=routeOverride||(p.route==='lernen'?'lernen/'+(state.last||'organe'):p.route),resolved=resolveOSRoute(hash);
 if(!resolved||resolved.id==='welcome')return;
 $('#program-title').textContent=resolved.file;$('#standalone-link').href='classic.html#'+hash;
 history.replaceState(null,'',location.pathname+location.search+'#'+hash);
 const frame=$('#program-frame');if(frame.getAttribute('src')==='about:blank')frame.src='workbench.html?v=5-review#'+hash;else frame.contentWindow.location.hash=hash;
 openWindow('program');
}
function openFromAddress(){const r=resolveOSRoute(location.hash);if(!r)return;if(r.id==='welcome'){closeWindow('program',false);openWindow('welcome');return}launch(r.id,r.hash)}
function syncProgramAddress(){try{const hash=$('#program-frame').contentWindow.location.hash.slice(1),r=resolveOSRoute(hash);if(!r||r.id==='welcome')return;$('#program-title').textContent=r.file;$('#standalone-link').href='classic.html#'+hash;history.replaceState(null,'',location.pathname+location.search+'#'+hash);tasks()}catch{}}

function setMaximized(id,on){
 const w=$('#window-'+id),button=w?.querySelector('[data-maximize]');if(!w||!button)return;
 on=on??!w.classList.contains('maximized');
 if(on){
  if(!document.body.classList.contains('os-focused'))focusReturnScroll=window.scrollY;
  document.querySelectorAll('.os-window.maximized').forEach(other=>{if(other!==w)setMaximized(other.dataset.window,false)});
 }
 w.classList.toggle('maximized',on);document.body.classList.toggle('os-focused',on);
 button.textContent=on?'Vollbild verlassen':'□';button.setAttribute('aria-pressed',String(on));
 button.setAttribute('aria-label',on?'Vollbild verlassen':id==='lab'?'Zinslabor maximieren':'Lernprogramm maximieren');
 if(on){$('#start-menu').hidden=true;$('#start-button').setAttribute('aria-expanded','false');focusWindow(id);window.scrollTo(0,0)}
 else window.scrollTo(0,focusReturnScroll);
 button.focus({preventScroll:true});
}
function leaveFocus(){const w=document.querySelector('.os-window.maximized');if(w)setMaximized(w.dataset.window,false)}
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===$('#program-frame').contentWindow&&e.data?.type==='vwl-os-exit-fullscreen')leaveFocus()});

function tasks(){$('#task-list').innerHTML=['welcome','lab','program','guide'].filter(id=>$('#window-'+id).dataset.closed!=='true').map(id=>{const w=$('#window-'+id),name=id==='welcome'?'WILLKOMMEN':id==='lab'?'ZINSLABOR':id==='guide'?'LIESMICH':$('#program-title').textContent;return `<button data-task="${id}" class="${w.hidden?'minimized':''}" aria-label="${esc(name)} ${w.hidden?'wiederherstellen':'in den Vordergrund holen'}">${esc(name)}</button>`}).join('')}
$('#window-program').dataset.closed='true';$('#window-guide').dataset.closed='true';
function closeWindow(id,closed){const w=$('#window-'+id);if(w.classList.contains('maximized'))setMaximized(id,false);w.hidden=true;w.dataset.closed=String(closed||(id==='program'&&$('#program-frame').getAttribute('src')==='about:blank'));if(id==='program'&&closed)history.replaceState(null,'',location.pathname+location.search);tasks()}
let tick=0,rate=3;const format=(n,d=1)=>new Intl.NumberFormat('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
function updateLab(animateOnly=false){const up=rate>3,down=rate<3,direction=up?'RESTRIKTIVER IMPULS':down?'EXPANSIVER IMPULS':'AUSGANGSPUNKT',flow=up?'→':down?'→':'·',pulse=['·','•','·',' '][tick%4],credit=up?'teurer':down?'günstiger':'Kredite',demand=up?'sinkt':down?'steigt':'Nachfrage';$('#ascii-scene').textContent=`   ______          __________        /\\   /\\\n  / EZB /|        | GESCHÄFTS |      /  \\_/  \\\n | [€] | |  ${pulse} ${flow}  |   BANK   | ${pulse} ${flow} | WIRTSCH. |\n |_____|/         |__________|      |_________|\n   Zins ${up?'↑':down?'↓':'='}          ${credit.padEnd(10)}      ${demand}`;if(animateOnly)return;$('#lab-direction').textContent=direction;$('#os-rate-value').textContent=format(rate,2)+' %';$('#os-rate').setAttribute('aria-valuetext',format(rate,2)+' Prozent');$('#os-credit').textContent=up?'höher':down?'niedriger':'gleich';$('#os-demand').textContent=up?'sinkt':down?'steigt':'gleich';$('#os-pressure').textContent=up?'gebremst':down?'angeregt':'gleich';$('#lab-message').textContent=up?'> Nachfrage & Preisdruck werden tendenziell gedämpft.':down?'> Nachfrage & Preisdruck können tendenziell steigen.':'> Verändere den Zins und beobachte die Kette.'}
$('#os-rate').addEventListener('input',e=>{rate=+e.target.value;updateLab()});updateLab();if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(()=>{tick++;if(!$('#window-lab').hidden)updateLab(true)},650);
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.open){launch(b.dataset.open);$('#start-menu').hidden=true;$('#start-button').setAttribute('aria-expanded','false')}if(b.dataset.launch){launch(b.dataset.launch);$('#start-menu').hidden=true;$('#start-button').setAttribute('aria-expanded','false')}if(b.dataset.minimize)closeWindow(b.dataset.minimize,false);if(b.dataset.close)closeWindow(b.dataset.close,true);if(b.dataset.maximize)setMaximized(b.dataset.maximize);if(b.dataset.task)openWindow(b.dataset.task)});
$('#start-button').addEventListener('click',()=>{const open=$('#start-menu').hidden;$('#start-menu').hidden=!open;$('#start-button').setAttribute('aria-expanded',String(open))});
document.addEventListener('click',e=>{if(!e.target.closest('#start-button,#start-menu')){$('#start-menu').hidden=true;$('#start-button').setAttribute('aria-expanded','false')}});
$('#os-theme').addEventListener('click',()=>{config.theme=config.theme==='terminal'?'pastel':'terminal';theme()});
$('#desktop-reset').addEventListener('click',()=>{leaveFocus();closeWindow('program',false);history.replaceState(null,'',location.pathname+location.search);config.positions={};persist();document.querySelectorAll('.os-window').forEach(w=>{w.style.left='';w.style.top='';w.classList.remove('maximized')});openWindow('welcome');openWindow('lab')});
$('#program-frame').addEventListener('load',()=>{sendTheme();try{$('#program-frame').contentDocument?.addEventListener('pointerdown',()=>focusWindow('program'));$('#program-frame').contentWindow.addEventListener('hashchange',syncProgramAddress);syncProgramAddress()}catch{}});
window.addEventListener('storage',e=>{if(e.key===STORE)progress()});window.addEventListener('focus',progress);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){leaveFocus();$('#start-menu').hidden=true;$('#start-button').setAttribute('aria-expanded','false')}});
document.querySelectorAll('.os-window').forEach(w=>{const id=w.dataset.window,pos=config.positions?.[id];if(pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&matchMedia('(min-width:851px)').matches){w.style.left=Math.max(0,Math.min(pos.x,desktop.clientWidth-150))+'px';w.style.top=Math.max(0,Math.min(pos.y,desktop.clientHeight-60))+'px'}w.addEventListener('pointerdown',()=>focusWindow(id));w.querySelector('.window-titlebar').addEventListener('pointerdown',e=>{if(e.target.closest('button')||!matchMedia('(min-width:851px)').matches||w.classList.contains('maximized'))return;const r=w.getBoundingClientRect(),d=desktop.getBoundingClientRect();drag={id,w,offsetX:e.clientX-r.left,offsetY:e.clientY-r.top,desktop:d};e.currentTarget.setPointerCapture(e.pointerId);e.preventDefault()});});
document.addEventListener('pointermove',e=>{if(!drag)return;const{x,y}={x:Math.max(0,Math.min(desktop.clientWidth-drag.w.offsetWidth,e.clientX-drag.desktop.left-drag.offsetX)),y:Math.max(0,Math.min(desktop.clientHeight-40,e.clientY-drag.desktop.top-drag.offsetY))};drag.w.style.left=x+'px';drag.w.style.top=y+'px'});
document.addEventListener('pointerup',()=>{if(!drag)return;config.positions??={};config.positions[drag.id]={x:parseFloat(drag.w.style.left),y:parseFloat(drag.w.style.top)};persist();drag=null});
window.addEventListener('hashchange',openFromAddress);
theme();progress();tasks();if(location.hash&&location.hash!=='#dashboard')openFromAddress();
