import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {datasetPath,normalizeCatalogText,catalogKey,validateCatalogExpansion,verifySourceText,buildCatalogImportSQL} from '../scripts/import-catalog-expansion.mjs';
const data=JSON.parse(await readFile(datasetPath,'utf8'));
test('200 sourced new edible cultivars preserve the 100/100 fruit/vegetable split',()=>{assert.deepEqual(validateCatalogExpansion(data),{entries:200,counts:{Obst:100,'Gemüse':100},groups:54});assert.equal(new Set(data.entries.map(row=>catalogKey(row,data.dedup))).size,200);});
test('normalization rejects case, umlaut, apostrophe, F1 and known synonym duplicates',()=>{
 assert.equal(normalizeCatalogText(' HINNONMÄKI RÖT F1 '),'hinnonmaekiroet');assert.equal(normalizeCatalogText('King’s Russet'),'kingsrusset');
 assert.equal(catalogKey({category:'Obst',name:'Stachelbeere',variety:'Hinnonmäki Röd'},data.dedup),catalogKey({category:'Obst',name:'Stachelbeere',variety:'Hinnonmäki Rot'},data.dedup));
 assert.equal(catalogKey({category:'Gemüse',name:'Erbsen',variety:'Kelvedon Wonder'},data.dedup),catalogKey({category:'Gemüse',name:'Erbsen',variety:'Wonder von Kelvedon'},data.dedup));
 const changed=structuredClone(data);changed.entries[0]={...changed.entries[0],name:'Stachelbeere',variety:'Hinnonmäki Röd',category:'Obst'};assert.throws(()=>validateCatalogExpansion(changed),/existing cultivar/);
});
test('cultivation guesses, account identifiers and ornamental categories are rejected',()=>{
 for(const change of[{category:'Blumen'},{months:[3]},{spacing:'30 cm'},{schedule:{sow:[3]}},{family_id:'not-allowed'},{created_by:'not-allowed'},{photo_path:'not-allowed'},{source_url:'https://unverified.invalid/'}]){const copy=structuredClone(data);Object.assign(copy.entries[0],change);assert.throws(()=>validateCatalogExpansion(copy));}
});
test('diversity includes figs, pome/stone/berry fruit and culinary chillies and peppers',()=>{
 for(const name of['Feige','Apfel','Birne','Pflaume','Süßkirsche','Weintraube','Erdbeeren','Walnuss','Tomate','Aubergine','Kartoffel','Pak Choi'])assert.ok(data.entries.some(row=>row.name===name),name);
 for(const variety of['Brown Turkey','Fresno','Hot Thai','Hungarian Hot Wax','Corno di Toro Giallo','Friggitello'])assert.ok(data.entries.some(row=>row.variety===variety),variety);
});
test('independent source-text verification rejects absent evidence rather than silently counting it',()=>{
 assert.throws(()=>verifySourceText(data,'Unrelated document'),/not found/);
 const allEvidence=data.entries.map(row=>row.evidence.listed_as).join('\n');assert.deepEqual(verifySourceText(data,allEvidence),{verified:200});
 const oneRemoved=data.entries.slice(1).map(row=>row.evidence.listed_as).join('\n');assert.throws(()=>verifySourceText(data,oneRemoved),/not found/);
 const fabricated=structuredClone(data);fabricated.entries[0].variety='Invented cultivar without source evidence';assert.throws(()=>validateCatalogExpansion(fabricated),/does not match/);
});
test('import SQL is insert-only, guarded, scoped to the existing single catalog family and idempotent',()=>{
 const sql=buildCatalogImportSQL(data);assert.match(sql,/^--[\s\S]*begin;/);assert.match(sql,/pg_advisory_xact_lock/);assert.match(sql,/family_count<>1/);assert.match(sql,/where not exists/);assert.match(sql,/p\.family_id=target_family and p\.is_catalog/);assert.match(sql,/commit;/);
 assert.doesNotMatch(sql,/\b(?:update|delete|truncate|drop|alter|grant)\s+(?:public\.|table|policy)/i);assert.doesNotMatch(sql,/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});
