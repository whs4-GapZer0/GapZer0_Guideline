import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(skillRoot, '..');
const sourceRoot = path.join(repoRoot, '_pages', 'control-guide');
const referencesRoot = path.join(skillRoot, 'references');
const targetRoot = path.join(referencesRoot, 'controls');
const indexFile = path.join(referencesRoot, 'control-index.md');
const errors = [];

const normalizeLineEndings = (value) => value.replace(/\r\n?/g, '\n');

const controlIdPattern = /^##\s+([A-Z]{3}-(?:C|E|L)-\d{2})(?:\s+—.*)?\s*$/gm;
const sourceFiles = [];
for (const domain of fs.readdirSync(sourceRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  for (const fileName of ['common.md', 'enhancement.md', 'local.md']) {
    const source = path.join(sourceRoot, domain.name, fileName);
    if (fs.existsSync(source)) sourceFiles.push({ domain: domain.name, fileName, source });
  }
}

const provenancePath = path.join(referencesRoot, 'guideline-provenance.json');
const provenance = fs.existsSync(provenancePath) ? JSON.parse(fs.readFileSync(provenancePath, 'utf8')) : null;
// Validate the recorded canonical revision, not a potentially older worktree.
if (provenance) {
  sourceFiles.length = 0;
  for (const file of provenance.files) sourceFiles.push({ domain: path.basename(path.dirname(file.source)), fileName: path.basename(file.source), source: path.join(repoRoot, file.source), relativeSource: file.source });
}
const sourceIds = [];
for (const file of sourceFiles) {
  const raw = provenance
    ? execFileSync('git', ['show', `${provenance.guidelineRevision}:${file.relativeSource}`], { cwd: repoRoot, encoding: 'utf8' })
    : fs.readFileSync(file.source, 'utf8');
  const ids = [...raw.matchAll(controlIdPattern)].map((match) => match[1]);
  sourceIds.push(...ids);
  const target = path.join(targetRoot, file.domain, file.fileName);
  if (!fs.existsSync(target)) {
    errors.push(`Missing mirrored control file: ${target}`);
    continue;
  }
  const cleanedSource = normalizeLineEndings(raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '')).trim();
  const mirrored = normalizeLineEndings(fs.readFileSync(target, 'utf8')).trim();
  if (cleanedSource !== mirrored) errors.push(`Mirrored content differs from source: ${target}`);
}

if (!fs.existsSync(indexFile)) errors.push(`Missing control index: ${indexFile}`);
const indexText = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, 'utf8') : '';
const indexIds = [...indexText.matchAll(controlIdPattern)].map((match) => match[1]);
const duplicates = (ids) => [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

if (!sourceIds.length) errors.push('No source controls found.');
if (provenance && sourceIds.length !== provenance.controlCount) errors.push('Source count differs from pinned provenance.');
if (indexIds.length !== sourceIds.length) errors.push(`Expected ${sourceIds.length} index entries, found ${indexIds.length}`);
if (duplicates(sourceIds).length) errors.push(`Duplicate source IDs: ${duplicates(sourceIds).join(', ')}`);
if (duplicates(indexIds).length) errors.push(`Duplicate index IDs: ${duplicates(indexIds).join(', ')}`);

const missingFromIndex = sourceIds.filter((id) => !indexIds.includes(id));
const unknownInIndex = indexIds.filter((id) => !sourceIds.includes(id));
if (missingFromIndex.length) errors.push(`Missing from index: ${missingFromIndex.join(', ')}`);
if (unknownInIndex.length) errors.push(`Unknown index IDs: ${unknownInIndex.join(', ')}`);
if (/내용 작성 예정|\[Control Name\]/.test(indexText)) errors.push('Index contains unfinished placeholder text.');

const indexEntryMatches = [...indexText.matchAll(/^##\s+([A-Z]{3}-(?:C|E|L)-\d{2})\s+—[^\r\n]+\r?\n([\s\S]*?)(?=^##\s+[A-Z]{3}-(?:C|E|L)-\d{2}\s+—|(?![\s\S]))/gm)];
for (const entry of indexEntryMatches) {
  const [id, body] = [entry[1], entry[2]];
  for (const field of ['Domain', 'Class', '검색 키워드', '적용 조건 요약', '원문 위치', '가이드라인 원본']) {
    if (!body.includes(`**${field}:**`)) errors.push(`${id}: missing index field ${field}`);
  }
  const keywordLine = /- \*\*검색 키워드:\*\* ([^\r\n]+)/.exec(body)?.[1] || '';
  if (keywordLine.split(',').filter(Boolean).length < 4) errors.push(`${id}: fewer than 4 search keywords`);
  const applicability = /- \*\*적용 조건 요약:\*\* ([^\r\n]+)/.exec(body)?.[1] || '';
  if (applicability.length < 10) errors.push(`${id}: applicability summary is empty or too short`);
}
if (indexEntryMatches.length !== sourceIds.length) errors.push(`Expected ${sourceIds.length} complete index blocks, found ${indexEntryMatches.length}`);

for (const match of indexText.matchAll(/- \*\*원문 위치:\*\* `([^`#]+)(?:#[^`]+)?`/g)) {
  const resolved = path.join(skillRoot, ...match[1].split('/'));
  if (!fs.existsSync(resolved)) errors.push(`Broken index source path: ${match[1]}`);
}

if (errors.length) {
  console.error('Control data validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Control data validation passed.');
console.log(`- Source revision: ${provenance?.guidelineRevision || 'working tree'}`);
console.log(`- Source controls: ${sourceIds.length}`);
console.log(`- Index entries: ${indexIds.length}`);
console.log(`- Mirrored control files: ${sourceFiles.length}`);
console.log('- Duplicate IDs: 0');
console.log('- Broken source paths: 0');
console.log('- Source/mirror differences: 0');
console.log('- Required index fields: complete');
