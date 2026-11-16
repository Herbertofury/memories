const fs = require('node:fs');
const path = require('node:path');
function buildResearchQueue(items) {
  return items.filter(x => x.coreMemory && ['creator','character','franchise','series'].includes(x.type)).map(x => ({
    id: x.id, name: x.name, type: x.type,
    status: 'research-required-not-verified',
    questions: ['Verify creator-owned social links', 'Find source-linked lore and continuity', 'Inventory characters and source universes without inferring favorites', 'Find creator-owned reference sheets; record exact character/version, access state and reuse rights'],
    sourcePointers: [x.url, ...(x.sourceLinks || []).map(s => s.url)].filter((u,i,a) => typeof u === 'string' && /^https:\/\//.test(u) && a.indexOf(u) === i),
    referenceSheetCandidates: (x.referenceSheets || []).filter(r => r && typeof r.url === 'string' && /^https:\/\//.test(r.url)).map(r => ({url:r.url, title:r.title || 'Reference candidate', creator:r.creator || 'Unknown', verification:r.verification || 'unverified', access:r.access || 'unknown', rights:r.rights || 'unknown'})),
    evidence: x.evidence || 'No reviewed evidence recorded',
    universeStatus: x.universeId ? 'linked catalog record' : x.universeStatus || 'not explicitly linked',
    universeId: x.universeId || null,
    boundaries: 'Metadata only. No automatic scraping, login, asset copying or identity verification.'
  })).sort((a,b) => a.id.localeCompare(b.id));
}
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const data = JSON.parse(fs.readFileSync(path.join(root,'docs/data.json'),'utf8'));
  const queue = {schemaVersion:1, scope:'Automatic queue generation, not autonomous web research', items:buildResearchQueue(data.items)};
  fs.writeFileSync(path.join(root,'docs/research-queue.json'),JSON.stringify(queue,null,2)+'\n');
  console.log(`Prepared ${queue.items.length} favorite research entries`);
}
module.exports = {buildResearchQueue};
