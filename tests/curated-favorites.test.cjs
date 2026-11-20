'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {curatedFavorite,orderItems}=require('../docs/app.js');
const data=require('../docs/data.json');
test('curated view is independent of local hearts and excludes discovery',()=>{
 const row={coreMemory:true,type:'character',name:'A'};
 assert.equal(curatedFavorite(row),true);
 assert.equal(curatedFavorite({...row,coreMemory:false}),false);
 assert.equal(curatedFavorite({...row,type:'aesthetic'}),false);
 assert.equal(curatedFavorite(row,'people'),false);
 assert.equal(curatedFavorite({...row,type:'creator'},'people'),true);
 assert.equal(curatedFavorite({...row,type:'series'},'universes'),true);
 assert.equal(curatedFavorite({...row,type:'series'},'characters'),false);
 assert.equal(curatedFavorite(row,'invalid'),false);
});
test('requested favorites remain in curated catalog with honest media fields',()=>{
 const rows=data.items.filter(i=>curatedFavorite(i));
 assert(rows.find(i=>i.id==='core-belle-delphine'));
 assert(rows.find(i=>i.id==='core-iluvmeww'));
 assert.equal(new Set(data.items.map(i=>i.id)).size,data.items.length);
 const belle=rows.find(i=>i.id==='core-belle-delphine');
 assert.equal(belle.type,'creator');
 assert.equal(belle.imageUrl,undefined);
 const sorted=orderItems(rows,'name');
 assert.equal(sorted.length,rows.length);
 assert.deepEqual(rows,data.items.filter(i=>curatedFavorite(i)));
});

test('iluvmeww retains exact reference and corrected clown-crew destination',()=>{
 const row=data.items.find(i=>i.id==='core-iluvmeww');
 assert.equal(row.url,'https://www.youtube.com/shorts/kT0JtBpVUh0?feature=share');
 assert.match(row.description,/Honkistas clown-crew inspiration/);
 assert.doesNotMatch(row.description,/Phonkistas inspiration/);
 assert.match(row.description,/identity remains unverified/);
 assert.match(row.evidence,/not proof of playback, soundtrack match or rights/);
 const notes=require('node:fs').readFileSync(require('node:path').join(__dirname,'../docs/Core-memories.md'),'utf8');
 assert.match(notes,/JetSetCraft Honkistas inspiration/);
 assert.doesNotMatch(notes,/honkistas” is mapped to that established gang/);
});
