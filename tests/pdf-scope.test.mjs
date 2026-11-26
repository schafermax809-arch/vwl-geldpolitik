import test from 'node:test';
import assert from 'node:assert/strict';
import {topics,formulas,chains,scenarios} from '../data/content.js';
import {questions} from '../data/questions.js';
import {defaults,reconcileContent} from '../lib/core.js';

test('Lernstoff und Prüfung verlangen keine extern ergänzten Vertiefungen',()=>{
 const curriculum=JSON.stringify({topics,formulas,chains,scenarios,questions});
 assert.doesNotMatch(curriculum,/Wechselkurskanal|Erwartungskanal|Kreditkanal|Realzins|Disinflation|neutralen Zins|Eigenkapital|Sekundärmarkt|parlamentarisch|symmetrisch|Stimmrechte.*rotieren/i);
 assert.deepEqual(Object.keys(chains),['restriktiv','expansiv']);
 for(const item of [...topics,...questions]){
  assert.match(item.source,/^VWL 9\.pdf, S\. /);
  const pages=item.source.replace('VWL 9.pdf, S. ','').match(/\d+/g).map(Number);
  assert.ok(pages.length>0&&pages.every(p=>(p>=2&&p<=50)||p===68),item.source);
 }
 // Die widersprüchlichen Laufzeitangaben werden erläutert, aber nicht abgefragt.
 assert.ok(!questions.some(q=>/Welche Laufzeit|heute typisch/i.test(q.prompt)));
});

test('Stoffwechsel erhält Notizen und unveränderte Bewertungen, archiviert ersetzte Inhalte',()=>{
 const old={...defaults(),read:['organe'],notes:{'map-organe':'Meine Notiz'},answers:{'organe-1':{score:2},'organe-9':{score:6}},cards:{'organe-0':{rating:'known'}},exams:[{id:'old',ids:['organe-9']}],exam:{id:'running',ids:['organe-9']}};
 const options={revision:'pdf-only-2026-11-26',questionIds:new Set(questions.map(q=>q.id)),cardIds:new Set(),isValidExam:e=>e.ids.every(id=>questions.some(q=>q.id===id))};
 const next=reconcileContent(old,options);
 assert.deepEqual(next.notes,old.notes);assert.deepEqual(next.read,old.read);
 assert.deepEqual(next.answers,{'organe-1':{score:2}});
 assert.deepEqual(next.cards,{});assert.deepEqual(next.exams,[]);assert.equal(next.exam,null);
 assert.deepEqual(next.previousContent,{answers:old.answers,cards:old.cards,exams:old.exams,exam:old.exam});
 assert.deepEqual(old.answers['organe-9'],{score:6});
 const again=reconcileContent({...next,answers:{...next.answers,'organe-pdf-9':{score:6}}},options);
 assert.equal(again.answers['organe-pdf-9'].score,6);
 assert.deepEqual(again.previousContent,next.previousContent);
 assert.equal(JSON.parse(JSON.stringify(again)).previousContent.exams[0].id,'old');
});
