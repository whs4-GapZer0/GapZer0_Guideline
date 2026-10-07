import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'skill');
const codexRoot = path.join(root, '.codex', 'skills', 'gapzero-guide');

function collectFiles(dir, relative = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(relative, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(full, rel));
    else out.push(rel.replaceAll('\\', '/'));
  }
  return out;
}

const required = [
  'SKILL.md',
  ...collectFiles(path.join(sourceRoot, 'references')).map((p) => `references/${p}`),
];

let failed = false;
for (const rel of required) {
  const source = path.join(sourceRoot, rel);
  const packaged = path.join(codexRoot, rel);
  if (!fs.existsSync(packaged)) {
    console.error(`MISSING: .codex/skills/gapzero-guide/${rel}`);
    failed = true;
    continue;
  }
  const normalize = (s) => s.replace(/\r\n?/g, '\n').trim();
  if (normalize(fs.readFileSync(source, 'utf8')) !== normalize(fs.readFileSync(packaged, 'utf8'))) {
    console.error(`DIFF: ${rel}`);
    failed = true;
  }
}

if (failed) {
  console.error('Codex Skill package is not synchronized with skill/.');
  process.exit(1);
}

console.log(`PASS: Codex Skill package synchronized (${required.length} files).`);
