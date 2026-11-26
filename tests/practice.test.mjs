import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../data/questions.js';
import {resolvePracticeTask,readPracticeDraft} from '../lib/practice.js';
import {defaults,load,reconcileContent} from '../lib/core.js';

test('Alte Aufgabenlinks öffnen die überarbeitete Aufgabe, unbekannte keine Zufallsaufgabe',()=>{
 assert.equal(resolvePracticeTask(questions,'organe-9').id,'organe-pdf-9');
 assert.equal(resolvePracticeTask(questions,'transmission-10').id,'transmission-pdf-10');
 assert.equal(resolvePracticeTask(questions,'organe-1').id,'organe-1');
 assert.equal(resolvePracticeTask(questions,'organe-pdf-9').id,'organe-pdf-9');
 assert.equal(resolvePracticeTask(questions,'organe-999'),undefined);
});

test('Antwortentwürfe überstehen Speicherung einschließlich Falsch, Teilzuordnung und Freitext',()=>{
 const state=defaults();
 for(const q of questions){
  const answer=q.type==='open'?'Mein Text mit Begründung.':q.type==='tf'?false:q.type==='mc'?0:q.type==='order'?[...q.items].reverse():q.type==='cloze'?q.answers.map((_,i)=>i===0?'Antwort':''):q.pairs.map((p,i)=>i===0?p[1]:'');
  state.drafts[q.id]={answer,reason:'Eigene Begründung'};
 }
 const restored=load({getItem:()=>JSON.stringify(state)});
 for(const q of questions)assert.deepEqual(readPracticeDraft(restored,q),state.drafts[q.id]);
 const q=questions.find(q=>q.type==='order');restored.drafts[q.id].answer=[q.items[0],q.items[0]];
 assert.equal(readPracticeDraft(restored,q).answer,null);
 assert.equal(readPracticeDraft({drafts:{}},q).answer,null);
});

test('Entwürfe werden nicht bewertet und werden keinem ersetzten Aufgabeninhalt zugewiesen',()=>{
 const state={...defaults(),drafts:{'organe-9':{answer:'Alter Stoff'},'organe-pdf-9':{answer:'Aktueller Entwurf'}}};
 const next=reconcileContent(state,{revision:'review',questionIds:new Set(questions.map(q=>q.id)),cardIds:new Set(),isValidExam:()=>false});
 assert.equal(next.drafts['organe-9'],undefined);
 assert.equal(next.drafts['organe-pdf-9'].answer,'Aktueller Entwurf');
 assert.deepEqual(next.answers,{});
});
