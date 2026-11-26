export const STORE='weiter-geldpolitik-v1';
export const defaults=()=>({version:1,theme:'dark',design:'financial',read:[],answers:{},cards:{},exams:[],last:null,exam:null,notes:{}});
export function load(storage){try{const s=JSON.parse(storage.getItem(STORE));if(s?.version!==1)return defaults();return {...defaults(),...s,read:Array.isArray(s.read)?s.read:[],answers:s.answers&&typeof s.answers==='object'?s.answers:{},cards:s.cards&&typeof s.cards==='object'?s.cards:{},exams:Array.isArray(s.exams)?s.exams:[],notes:s.notes&&typeof s.notes==='object'?s.notes:{}}}catch{return defaults()}}
export function reconcileContent(state,{revision,questionIds,cardIds,isValidExam}){
 const next={...state};
 if(state.contentRevision!==revision){
  next.previousContent={answers:state.answers,cards:state.cards,exams:state.exams,exam:state.exam};
  next.contentRevision=revision;
 }
 next.answers=Object.fromEntries(Object.entries(state.answers).filter(([id,a])=>questionIds.has(id)&&Number.isFinite(a?.score)));
 next.cards=Object.fromEntries(Object.entries(state.cards).filter(([id])=>cardIds.has(id)));
 next.exams=state.exams.filter(isValidExam);
 next.exam=state.exam&&isValidExam(state.exam)?state.exam:null;
 return next;
}
export function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export const normalize=x=>String(x??'').normalize('NFC').trim().toLocaleLowerCase('de').replace(/[.!?]$/,'');
export function grade(q,a){
 if(q.type==='open')return null;
 if(q.type==='mc')return a===q.correct?q.points:0;
 if(q.type==='tf')return a===q.correct?q.points:0;
 if(q.type==='cloze')return q.answers.every((v,i)=>v.some(x=>normalize(x)===normalize(a?.[i])))?q.points:0;
 if(q.type==='match'||q.type==='connect')return q.pairs.reduce((sum,p,i)=>sum+(a?.[i]===p[1]?1:0),0);
 if(q.type==='order')return JSON.stringify(a)===JSON.stringify(q.items)?q.points:0;
 return 0;
}
export function topicProgress(id,state,questions){const qs=questions.filter(q=>q.topic===id),mastered=qs.filter(q=>state.answers[q.id]?.score===q.points).length;return Math.round((state.read.includes(id)?50:0)+50*mastered/qs.length)}
export function stats(id,state,questions){const qs=questions.filter(q=>!id||q.topic===id),done=qs.filter(q=>state.answers[q.id]);return {attempted:done.length,correct:done.filter(q=>state.answers[q.id].score===q.points).length,wrong:done.filter(q=>state.answers[q.id].score<q.points),self:done.filter(q=>q.type==='open').length}}
export function makeExam(questions,{difficulty=3}={},rng=Math.random){
 // Jede Klausur deckt alle sechs Themen ab: je eine offene und eine geschlossene Aufgabe.
 const topics=[...new Set(questions.map(q=>q.topic))],selected=[];
 for(const t of topics){const eligible=questions.filter(q=>q.topic===t&&q.difficulty<=difficulty);let opens=eligible.filter(q=>q.type==='open');if(!opens.length)opens=questions.filter(q=>q.topic===t&&q.type==='open');selected.push(shuffle(opens,rng)[0]);selected.push(shuffle(eligible.filter(q=>q.type!=='open'),rng)[0]);}
 // Bei Anwendung/Analyse mindestens eine Aufgabe der jeweils gewählten Anforderungsstufe.
 if(difficulty>=3&&!selected.some(q=>q.afb==='III')){const q=shuffle(questions.filter(q=>q.type==='open'&&q.afb==='III'),rng)[0];selected[selected.findIndex(x=>x.topic===q.topic&&x.type==='open')]=q;}
 if(difficulty>=2&&!selected.some(q=>q.afb==='II')){const q=shuffle(questions.filter(q=>q.type==='open'&&q.afb==='II'&&q.difficulty<=difficulty&&selected.find(x=>x.topic===q.topic&&x.type==='open').afb!=='III'),rng)[0];selected[selected.findIndex(x=>x.topic===q.topic&&x.type==='open')]=q;}
 return shuffle(selected,rng).map(q=>q.id);
}
export function dueCards(cards,state,now=Date.now()){return cards.filter(c=>!state.cards[c.id]||state.cards[c.id].due<=now)}
export function rateCard(old,rating,now=Date.now()){const level=rating==='known'?Math.min((old?.level||0)+1,5):rating==='unsure'?1:0;const delay=rating==='unknown'?5*60000:rating==='unsure'?86400000:[1,1,3,7,14,30][level]*86400000;return {rating,level,due:now+delay,at:now}}
export function labModel(rate){const change=rate-3;return {credit:Math.max(.1,5+change*.8),saving:Math.max(0,2+change*.65),loan:Math.max(20,100-change*13),investment:Math.max(20,100-change*10),consumption:Math.max(20,100-change*5),demand:Math.max(20,100-change*7),pressure:Math.max(20,100-change*9)}}
export const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
