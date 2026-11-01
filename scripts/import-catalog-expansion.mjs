import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export const datasetPath=fileURLToPath(new URL('../data/catalog-expansion-20261101.json',import.meta.url));
export function normalizeCatalogText(value){
 return String(value).toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss')
  .replace(/\([^)]*\)/g,'').replace(/\bf1\b/g,'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
}
export function catalogKey(row,dedup){
 const name=dedup.name_aliases[row.name]||row.name,variety=normalizeCatalogText(row.variety);
 return [normalizeCatalogText(row.category),normalizeCatalogText(name),dedup.variety_aliases[variety]||variety].join('|');
}
export function validateCatalogExpansion(data){
 if(data?.schema_version!==1||data.import_tag!=='catalog-expansion-20261101'||!Array.isArray(data.entries)||data.entries.length!==200)throw Error('Expected the reviewed 200-entry catalog expansion.');
 if(data.existing_catalog_count!==638||!Array.isArray(data.dedup?.existing_keys)||!data.dedup.name_aliases||!data.dedup.variety_aliases)throw Error('Missing reviewed catalog baseline.');
 const keys=new Set(),baseline=new Set(data.dedup.existing_keys),counts={Obst:0,'Gemüse':0};
 for(const row of data.entries){
  if(!Object.hasOwn(counts,row.category))throw Error('Only edible fruit/vegetable categories are permitted.');
  if(typeof row.name!=='string'||!row.name.trim()||row.name.length>100||typeof row.variety!=='string'||!row.variety.trim()||row.variety.length>100)throw Error('Missing or invalid cultivar identity.');
  const key=catalogKey(row,data.dedup);if(keys.has(key)||baseline.has(key))throw Error('Duplicate or existing cultivar: '+row.name+' / '+row.variety);keys.add(key);counts[row.category]++;
  const url=new URL(row.source_url);if(url.origin!=='https://www.rhs.org.uk'||url.pathname!=='/plants/pdfs/agm-lists/agm-fruit-and-vegetables'||url.hash!=='#page='+row.evidence?.page)throw Error('Unverified source URL.');
  if(row.evidence.publisher!=='Royal Horticultural Society'||!Number.isInteger(row.evidence.page)||row.evidence.page<2||row.evidence.page>6||typeof row.evidence.listed_as!=='string'||!row.evidence.listed_as.trim()||row.evidence.verified_on!=='2026-11-01')throw Error('Missing page-specific source evidence.');
  if(!normalizeCatalogText(row.evidence.listed_as.replace(/[()]/g,'')).includes(normalizeCatalogText(row.variety)))throw Error('Cultivar identity does not match its quoted source evidence.');
  if(['location','spacing','sowing','harvest'].some(key=>row[key]!==''))throw Error('Unverified cultivation fields must remain blank.');
  if(!Array.isArray(row.months)||row.months.length||JSON.stringify(row.schedule)!=='{}')throw Error('Unverified schedules/months must remain empty.');
  if(typeof row.care!=='string'||row.care.length>4000||!row.care.includes('noch nicht geprüft')||!row.care.includes(row.source_url))throw Error('Missing uncertainty/source information.');
  if(['id','family_id','created_by','photo_path'].some(key=>Object.hasOwn(row,key)))throw Error('No hardcoded user/family/photo identifiers allowed.');
 }
 if(counts.Obst!==100||counts['Gemüse']!==100)throw Error('Expected 100 fruit and 100 vegetable cultivars.');
 return{entries:keys.size,counts,groups:new Set(data.entries.map(row=>row.category+'|'+row.name)).size};
}

// Optional independent verification against pdftotext -raw output of the cited
// PDF. The extracted source text is evidence, never code or SQL instructions.
export function verifySourceText(data,text){
 validateCatalogExpansion(data);const normalized=String(text).replaceAll('\r','').replace(/[\s\u000c]+/g,' ').normalize('NFKC');
 for(const row of data.entries){const quote=row.evidence.listed_as.replace(/[\s\u000c]+/g,' ').normalize('NFKC');if(!normalized.includes(quote))throw Error('Cultivar listing not found in source: '+row.name+' / '+row.variety);}
 return{verified:data.entries.length};
}
const jsonLiteral=(value,tag)=>{const json=JSON.stringify(value);if(json.includes('$'+tag+'$'))throw Error('Unsafe SQL delimiter collision.');return '$'+tag+'$'+json+'$'+tag+'$::jsonb';};
function sqlNormalize(expression){return `regexp_replace(normalize(regexp_replace(replace(replace(replace(replace(lower(${expression}),'ä','ae'),'ö','oe'),'ü','ue'),'ß','ss'),'\\([^)]*\\)|\\mf1\\M','','g'),NFKD),'[^a-z0-9]','','g')`;}
export function buildCatalogImportSQL(data){
 validateCatalogExpansion(data);
 const candidates=data.entries.map(row=>({name:row.name,variety:row.variety,category:row.category,page:row.evidence.page,listed_as:row.evidence.listed_as}));
 const nameAliases=jsonLiteral(data.dedup.name_aliases,'catalog_names'),varietyAliases=jsonLiteral(data.dedup.variety_aliases,'catalog_varieties'),incoming=jsonLiteral(candidates,'catalog_entries');
 const normalized=(alias)=>`select ${alias}.*,${sqlNormalize(`${alias}.category`)} as category_key,${sqlNormalize(`coalesce(c.name_aliases->>${alias}.name,${alias}.name)`)} as name_key,${sqlNormalize(`${alias}.variety`)} as variety_key from ${alias==='i'?'incoming i':'public.rg_plants p'} cross join config c ${alias==='p'?'where p.family_id=target_family and p.is_catalog':''}`;
 return `-- Reviewed factual cultivar identities only; no guessed cultivation data.\n-- Insert-only, idempotent, no hardcoded family/user IDs, no changes to policies.\nbegin;\ndo $import$\ndeclare target_family uuid;family_count integer;inserted_count integer;\nbegin\n perform pg_advisory_xact_lock(hashtext('catalog-expansion-20261101'));\n select count(distinct family_id) into family_count from public.rg_plants where is_catalog;\n if family_count<>1 then raise exception 'Catalog source family must resolve uniquely; import stopped without changes';end if;\n select family_id into strict target_family from public.rg_plants where is_catalog group by family_id;\n with config as(select ${nameAliases} as name_aliases,${varietyAliases} as variety_aliases),\n incoming as(select * from jsonb_to_recordset(${incoming}) as x(name text,variety text,category text,page integer,listed_as text)),\n new_normalized as(${normalized('i')}),\n existing_normalized as(${normalized('p')}),\n inserted as(\n insert into public.rg_plants(family_id,name,variety,category,location,spacing,sowing,harvest,care,months,favorite,source,version,created_by,legacy_data,schedule,photo_path,is_catalog)\n select target_family,n.name,n.variety,n.category,'','','','',\n 'Sortenname in der RHS-Referenzliste belegt. Standort, Pflanzabstand und Kulturzeiten sind für deinen Garten noch nicht geprüft; bitte örtliche Bedingungen und die konkrete Pflanzen- oder Saatgutangabe berücksichtigen. Quelle: https://www.rhs.org.uk/plants/pdfs/agm-lists/agm-fruit-and-vegetables#page='||n.page::text,\n '{}'::integer[],false,'seed',1,null,\n jsonb_build_object('catalog_import','catalog-expansion-20261101','source_url','https://www.rhs.org.uk/plants/pdfs/agm-lists/agm-fruit-and-vegetables#page='||n.page::text,'evidence',jsonb_build_object('publisher','Royal Horticultural Society','document','RHS Recommended: Award of Garden Merit – Fruit, vegetables and herbs','page',n.page,'listed_as',n.listed_as,'verified_on','2026-11-01','scope','Cultivar identity only; cultivation details unverified')),\n '{}'::jsonb,null,true\n from new_normalized n cross join config c\n where not exists(select 1 from existing_normalized e where e.category_key=n.category_key and e.name_key=n.name_key and coalesce(c.variety_aliases->>e.variety_key,e.variety_key)=coalesce(c.variety_aliases->>n.variety_key,n.variety_key))\n returning id)select count(*) into inserted_count from inserted;\n if inserted_count>200 then raise exception 'Unexpected import size';end if;\nend $import$;\ncommit;\nselect count(*) as expansion_rows,count(*)filter(where category='Obst')as fruit_rows,count(*)filter(where category='Gemüse')as vegetable_rows\n from public.rg_plants where is_catalog and legacy_data->>'catalog_import'='catalog-expansion-20261101';\n`;
}
async function main(){const data=JSON.parse(await readFile(datasetPath,'utf8')),args=process.argv.slice(2);console.log(JSON.stringify(validateCatalogExpansion(data)));
 const source=args.indexOf('--verify-source');if(source>=0){if(!args[source+1])throw Error('Provide a pdftotext -raw source file.');console.log(JSON.stringify(verifySourceText(data,await readFile(args[source+1],'utf8'))));}
 const write=args.indexOf('--write');if(write>=0){const output=args[write+1]||fileURLToPath(new URL('./import-catalog-expansion.sql',import.meta.url));await writeFile(output,buildCatalogImportSQL(data));console.log('Wrote reviewed insert-only SQL: '+path.basename(output));}
 if(args.includes('--stdout'))process.stdout.write(buildCatalogImportSQL(data));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
