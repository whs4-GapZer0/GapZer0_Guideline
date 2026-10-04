import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(scriptDir, '..', 'references', 'control-index.md');
const indexText = fs.readFileSync(indexPath, 'utf8');
const entries = [...indexText.matchAll(/^##\s+([A-Z]{3}-(?:C|E|L)-\d{2})\s+—[^\r\n]+\r?\n([\s\S]*?)(?=^##\s+[A-Z]{3}-(?:C|E|L)-\d{2}\s+—|(?![\s\S]))/gm)]
  .map((match) => ({ id: match[1], text: `${match[0]}`.toLowerCase() }));

const cases = [
  { query: '퇴사자 접근권한 권한 회수', expected: ['HRS-C-01', 'IAM-C-01', 'IAM-C-03'] },
  { query: '개인정보 국외이전 해외 SaaS', expected: ['LCM-L-09'] },
  { query: '비인가 소프트웨어 설치 실행', expected: ['SCF-C-02'] },
  { query: '취약점 위험 우선순위 조치', expected: ['TVM-C-04', 'TVM-C-05'] },
  { query: '공급자 계약 보안 요구사항', expected: ['SUP-C-05'] },
  { query: '공급자 관계 체결 전 실사', expected: ['SUP-C-06'] },
  { query: '공급자 관계 종료 보안조치', expected: ['SUP-C-08'] },
  { query: '백업 복구시험 복원', expected: ['CON-C-01'] },
];

let failures = 0;
for (const test of cases) {
  const terms = test.query.toLowerCase().split(/\s+/).filter(Boolean);
  const ranked = entries
    .map((entry) => ({ ...entry, score: terms.reduce((score, term) => score + (entry.text.includes(term) ? 1 : 0), 0) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id, 'en'))
    .slice(0, 12)
    .map((entry) => entry.id);

  const missing = test.expected.filter((id) => !ranked.includes(id));
  if (missing.length) {
    failures += 1;
    console.error(`FAIL: ${test.query}`);
    console.error(`  Missing expected candidates: ${missing.join(', ')}`);
    console.error(`  Ranked candidates: ${ranked.join(', ')}`);
  } else {
    console.log(`PASS: ${test.query} -> ${test.expected.join(', ')}`);
  }
}

if (failures) process.exit(1);
console.log(`Search smoke tests passed: ${cases.length}/${cases.length}`);
