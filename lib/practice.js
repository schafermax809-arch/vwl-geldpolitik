// Retired links resolve to the replacement task; saved scores still use exact IDs.
export function resolvePracticeTask(questions,id){
 const exact=questions.find(q=>q.id===id);
 if(exact)return exact;
 const old=String(id||'').match(/^([a-z]+)-(\d+)$/);
 return old?questions.find(q=>q.id===`${old[1]}-pdf-${old[2]}`):undefined;
}

export function readPracticeDraft(state,q){
 const draft=state.drafts?.[q.id];
 if(!draft||typeof draft!=='object')return {answer:null,reason:''};
 const a=draft.answer;
 let valid=a===null;
 if(q.type==='open')valid=typeof a==='string';
 if(q.type==='mc')valid=Number.isInteger(a)&&a>=0&&a<q.options.length;
 if(q.type==='tf')valid=typeof a==='boolean';
 if(q.type==='cloze')valid=Array.isArray(a)&&a.length===q.answers.length&&a.every(x=>typeof x==='string');
 if(q.type==='match'||q.type==='connect')valid=Array.isArray(a)&&a.length===q.pairs.length&&a.every(x=>x===''||q.pairs.some(p=>p[1]===x));
 if(q.type==='order')valid=Array.isArray(a)&&a.length===q.items.length&&new Set(a).size===q.items.length&&a.every(x=>q.items.includes(x));
 return {answer:valid?a:null,reason:typeof draft.reason==='string'?draft.reason:''};
}
