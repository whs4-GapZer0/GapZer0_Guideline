import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(scriptDir, '..', 'references', 'control-index.md');
const indexText = fs.readFileSync(indexPath, 'utf8');

const STOPWORDS = new Set([
  '은','는','이','가','을','를','의','에','에서','에게','으로','로','와','과','및','등',
  '관련','대한','대해','위한','위해','하는','하려고','해야','어떻게','우리','회사','너무',
  '있는','없는','경우','사항','방법','작성','초안','계획','절차'
]);

const normalize = (value) => value
  .toLowerCase()
  .replace(/[·,/()[\]{}:;'"“”‘’!?→—–-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenize = (value) => normalize(value)
  .split(' ')
  .map((term) => term.trim())
  .filter((term) => term.length >= 2 && !STOPWORDS.has(term));

const entries = [...indexText.matchAll(
  /^##\s+([A-Z]{3}-(?:C|E|L)-\d{2})\s+—\s+([^\r\n]+)\r?\n([\s\S]*?)(?=^##\s+[A-Z]{3}-(?:C|E|L)-\d{2}\s+—|(?![\s\S]))/gm
)].map((match) => {
  const body = match[3];
  const keywords = body.match(/^- \*\*검색 키워드:\*\*\s*(.+)$/m)?.[1] ?? '';
  const applicability = body.match(/^- \*\*적용 조건 요약:\*\*\s*(.+)$/m)?.[1] ?? '';
  return {
    id: match[1],
    title: normalize(match[2]),
    keywords: normalize(keywords),
    applicability: normalize(applicability),
  };
});

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

const scoreEntry = (entry, query) => {
  const terms = tokenize(query);
  const normalizedQuery = normalize(query);
  let score = 0;
  for (const term of terms) {
    if (entry.title.includes(term)) score += 5;
    if (entry.keywords.includes(term)) score += 3;
    if (entry.applicability.includes(term)) score += 1;
  }
  if (entry.title && normalizedQuery.includes(entry.title)) score += 8;
  return score;
};

let failures = 0;
for (const test of cases) {
  const ranked = entries
    .map((entry) => ({ ...entry, score: scoreEntry(entry, test.query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id, 'en'))
    .slice(0, 5);

  const rankedIds = ranked.map((entry) => entry.id);
  const missing = test.expected.filter((id) => !rankedIds.includes(id));

  if (missing.length) {
    failures += 1;
    console.error(`FAIL: ${test.query}`);
    console.error(`  Missing in top 5: ${missing.join(', ')}`);
    console.error(`  Top 5: ${ranked.map((e) => `${e.id}(${e.score})`).join(', ')}`);
  } else {
    console.log(`PASS: ${test.query}`);
    console.log(`  Top 5: ${ranked.map((e) => `${e.id}(${e.score})`).join(', ')}`);
  }
}

if (failures) process.exit(1);
console.log(`Top-5 search quality tests passed: ${cases.length}/${cases.length}`);
console.log(`Stopwords enabled: ${STOPWORDS.size}`);
