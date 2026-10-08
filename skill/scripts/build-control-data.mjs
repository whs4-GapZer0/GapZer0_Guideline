import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(skillRoot, '..');
// A pinned Git revision is extracted read-only by sync-guideline.py.
const sourceRoot = process.env.GAPZERO_GUIDELINE_ROOT || path.join(repoRoot, '_pages', 'control-guide');
const referencesRoot = path.join(skillRoot, 'references');
const targetControlsRoot = path.join(referencesRoot, 'controls');

const classFiles = new Map([
  ['common.md', 'Common'],
  ['enhancement.md', 'Enhancement'],
  ['local.md', 'Local'],
]);

const provenanceFile = path.join(referencesRoot, 'guideline-provenance.json');
const pinned = !process.env.GAPZERO_GUIDELINE_ROOT && fs.existsSync(provenanceFile) ? JSON.parse(fs.readFileSync(provenanceFile, 'utf8')) : null;
const sourceRevision = process.env.GAPZERO_GUIDELINE_REVISION || pinned?.guidelineRevision;

const keywordRules = [
  [/퇴사|퇴직|계약종료|고용 종료/, ['퇴사자', '퇴직자', '계약 종료', '계정 회수', '권한 회수', '자산 반납']],
  [/입사|채용|업무 시작/, ['입사자', '신규 인력', '채용', '업무 시작']],
  [/직무변경|부서 변경|인사변경|휴직/, ['부서 이동', '직무 변경', '휴직', '인사 변경']],
  [/교육|인식|훈련|역량/, ['보안 교육', '인식제고', '직무 교육', '훈련', '역량 평가']],
  [/접근권한|권한|특권|계정/, ['접근권한', '사용자 계정', '관리자 권한', '최소 권한', '권한 검토']],
  [/인증|비밀번호|패스워드|자격증명|다중요소/, ['사용자 인증', '비밀번호', '자격증명', '다중요소인증', 'MFA']],
  [/신원|사용자 식별|계정 식별/, ['사용자 식별', '신원 확인', '계정 식별']],
  [/자산|하드웨어 자산|소프트웨어·서비스·시스템 목록|서비스 목록/, ['정보자산', '자산 목록', '하드웨어', '소프트웨어', '서비스']],
  [/수명주기|폐기|재사용/, ['자산 수명주기', '재사용', '폐기', '데이터 삭제']],
  [/데이터 분류|정보 분류|중요도|등급/, ['정보 분류', '데이터 분류', '보안등급', '중요도']],
  [/개인정보|민감정보|고유식별정보/, ['개인정보', '민감정보', '고유식별정보', '개인정보 처리']],
  [/국외이전|국외 이전|해외 이전|데이터 이전/, ['개인정보 국외이전', '데이터 이전', '국외 처리']],
  [/암호|암호화|암호키|키 관리/, ['암호화', '암호키', '키 관리', '전송구간 암호화', '저장 데이터 암호화']],
  [/백업|복구|복원/, ['백업', '데이터 복구', '복구시험', 'RTO', 'RPO']],
  [/연속성|재해|재난|복원력|비상/, ['업무연속성', '재해복구', '비상대응', '복원력', 'BCP', 'DR']],
  [/용량|가용성|중단/, ['용량 관리', '가용성', '서비스 중단', '성능 관리']],
  [/사고|이벤트|침해|위기/, ['보안사고', '침해사고', '사고 대응', '이벤트 분석', '위기 대응']],
  [/신고|보고|통지|소통/, ['사고 신고', '대외 통지', '내부 보고', '이해관계자 소통']],
  [/로그|기록|모니터링|탐지/, ['로그', '보안 모니터링', '이상행위 탐지', '감사기록']],
  [/위협정보|위협 인텔리전스/, ['위협정보', '위협 인텔리전스', '위협 공유']],
  [/취약점|패치|보안 업데이트/, ['취약점 점검', '취약점 조치', '패치', '보안 업데이트', '재검증']],
  [/구성|설정|기준선/, ['보안설정기준', '구성관리', '설정 변경', '비인가 변경']],
  [/악성코드|랜섬웨어|소프트웨어 설치/, ['악성코드', '랜섬웨어', '비인가 소프트웨어', '실행 통제']],
  [/네트워크|통신|방화벽|포트|프로토콜/, ['네트워크 보안', '방화벽', '통신 경로', '포트', '프로토콜']],
  [/분리|분할|세분화|경계/, ['네트워크 분리', '망분리', '보안 경계', '세그멘테이션']],
  [/무선|원격접속|재택/, ['무선 네트워크', '원격접속', '재택근무', 'VPN']],
  [/개발|애플리케이션|소스코드|코드/, ['안전한 개발', '애플리케이션 보안', '소스코드', '보안 요구사항']],
  [/변경관리|변경 관리|배포|릴리스/, ['변경관리', '배포', '릴리스', '변경 승인']],
  [/시험|테스트|검증/, ['보안 시험', '테스트', '검증', '점검']],
  [/공급자|협력사|수탁자|외주|제3자/, ['공급자', '협력사', '수탁자', '외주', '제3자 위험']],
  [/계약|협약|SLA/, ['보안 계약', '계약 조항', 'SLA', '책임 명시']],
  [/공급망|제품|서비스 제공자/, ['공급망 보안', '제품 보안', '서비스 제공자', '공급망 위험']],
  [/물리|출입|시설|보호구역/, ['물리보안', '출입통제', '보호구역', '시설 보안']],
  [/장비|매체|반출|반입/, ['장비 보안', '저장매체', '반출입', '매체 폐기']],
  [/법령|법적|규제|준수|컴플라이언스/, ['법규 준수', '컴플라이언스', '법적 요구사항', '규제 대응']],
  [/감사|점검|검토|평가/, ['보안 감사', '관리체계 점검', '정기 검토', '효과성 평가']],
  [/위험|리스크/, ['위험평가', '위험관리', '리스크', '잔여위험', '우선순위']],
  [/정책|절차|지침/, ['보안 정책', '운영 절차', '지침', '정책 검토']],
  [/역할|책임|조직|거버넌스/, ['역할과 책임', '보안 조직', '거버넌스', '책임자']],
  [/예산|자원|인력/, ['보안 예산', '인력', '자원 배정']],
  [/클라우드/, ['클라우드 보안', '클라우드 서비스', '클라우드 설정']],
  [/보존|보유기간|파기|삭제/, ['보유기간', '기록 보존', '개인정보 파기', '안전한 삭제']],
];

const domainKeywords = {
  Governance: ['정보보호 거버넌스', '경영진', '위험관리'],
  'Asset Management': ['자산관리', '자산 목록'],
  Continuity: ['업무연속성', '복구', '복원력'],
  'Human Resource Security': ['인적보안', '임직원', '외부인력'],
  'Identity and Access Management': ['신원관리', '접근통제', '권한관리'],
  'Information Protection': ['정보보호', '데이터 보호', '개인정보'],
  'Information Security Assurance': ['보증', '점검', '감사'],
  'Information Security Event Management': ['보안이벤트', '사고대응', '모니터링'],
  'Legal and Compliance': ['법규 준수', '컴플라이언스'],
  'Physical Security': ['물리보안', '출입통제'],
  'Application Security': ['애플리케이션 보안', '안전한 개발'],
  'Secure Configuration': ['보안설정기준', '구성관리'],
  'Supplier Relationships Security': ['공급자 보안', '제3자 위험'],
  'System and Network Security': ['시스템 보안', '네트워크 보안'],
  'Threat and Vulnerability Management': ['위협관리', '취약점 관리'],
};

function stripFrontMatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '');
}

function extractSection(block, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`^###\\s+${escaped}\\s*$`, 'm').exec(block);
  if (!match) return '';
  const rest = block.slice(match.index + match[0].length);
  const nextHeading = rest.search(/^###\s+/m);
  return (nextHeading >= 0 ? rest.slice(0, nextHeading) : rest).trim();
}

function extractSubsection(block, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`^####\\s+${escaped}\\s*$`, 'm').exec(block);
  if (!match) return '';
  const rest = block.slice(match.index + match[0].length);
  const nextHeading = rest.search(/^####\s+/m);
  return (nextHeading >= 0 ? rest.slice(0, nextHeading) : rest).trim();
}

function markdownToText(value) {
  return value
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/^[-+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstSentences(value, maxLength = 180) {
  const text = markdownToText(value);
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength);
  const sentenceEnd = Math.max(clipped.lastIndexOf('합니다.'), clipped.lastIndexOf('됩니다.'), clipped.lastIndexOf('입니다.'));
  return `${(sentenceEnd > maxLength * 0.55 ? clipped.slice(0, sentenceEnd + 4) : clipped).trim()}…`;
}

function summarizeApplicability(block) {
  const applicability = extractSection(block, '적용 조건');
  const when = firstSentences(extractSubsection(applicability, '적용 시점'), 155);
  const target = firstSentences(extractSubsection(applicability, '적용 대상'), 185);
  if (when || target) return [when && `시점: ${when}`, target && `대상: ${target}`].filter(Boolean).join(' / ');
  return firstSentences(applicability, 300);
}

function buildKeywords(control) {
  const values = [];
  const seen = new Set();
  const add = (value) => {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    values.push(normalized);
  };

  add(control.name);
  const stopwords = new Set([
    '및', '위한', '확보', '수립', '운영', '관리', '보호', '보안', '통합', '유지', '지원', '적용',
    '전', '과정의', '활동에서', '발생하는', '서비스와', '주기에', '대한', '관련', '기반', '통한', '결과',
  ]);
  control.name
    .split(/[\s·,/()]+/)
    .map((word) => word.replace(/[^0-9A-Za-z가-힣-]/g, ''))
    .filter((word) => word.length >= 2 && !stopwords.has(word))
    .forEach(add);

  (domainKeywords[control.domain] || []).forEach(add);
  const searchable = `${control.name} ${control.objective}`;
  for (const [pattern, words] of keywordRules) {
    if (pattern.test(searchable)) words.forEach(add);
    if (values.length >= 18) break;
  }

  for (const acronym of searchable.match(/\b[A-Z][A-Z0-9-]{1,9}\b/g) || []) add(acronym);
  return values.slice(0, 20);
}

function parseControls(markdown, relativeSource, className) {
  const matches = [...markdown.matchAll(/^##\s+([A-Z]{3}-(?:C|E|L)-\d{2})\s*$/gm)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    const block = markdown.slice(start, end).trim();
    const control = {
      id: match[1],
      name: markdownToText(extractSection(block, 'Control Name')),
      domain: markdownToText(extractSection(block, 'Security Domain')),
      className: markdownToText(extractSection(block, 'Control Class')) || className,
      objective: markdownToText(extractSection(block, 'Control Objective')),
      applicability: summarizeApplicability(block),
      relativeSource,
    };
    control.keywords = buildKeywords(control);
    return control;
  });
}

if (!pinned && !fs.existsSync(sourceRoot)) throw new Error(`Control source directory not found: ${sourceRoot}`);
fs.mkdirSync(targetControlsRoot, { recursive: true });
const controls = [];
const domainDirs = pinned
  ? [...new Set(pinned.files.map((file) => path.basename(path.dirname(file.source))))].sort()
  : fs.readdirSync(sourceRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

for (const domainDir of domainDirs) {
  const sourceDomain = path.join(sourceRoot, domainDir);
  for (const [fileName, className] of classFiles) {
    const sourceFile = path.join(sourceDomain, fileName);
    const canonicalPath = `_pages/control-guide/${domainDir}/${fileName}`;
    if (pinned ? !pinned.files.some((file) => file.source === canonicalPath) : !fs.existsSync(sourceFile)) continue;

    const raw = pinned
      ? execFileSync('git', ['show', `${sourceRevision}:${canonicalPath}`], { cwd: repoRoot, encoding: 'utf8' })
      : fs.readFileSync(sourceFile, 'utf8');
    const cleaned = stripFrontMatter(raw).trimStart();
    const targetDir = path.join(targetControlsRoot, domainDir);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, fileName), `${cleaned.trimEnd()}\n`, 'utf8');

    const skillRelative = path.posix.join('references', 'controls', domainDir, fileName);
    controls.push(...parseControls(cleaned, skillRelative, className));
  }
}

controls.sort((a, b) => a.id.localeCompare(b.id, 'en'));
const duplicateIds = controls.map((control) => control.id).filter((id, index, ids) => ids.indexOf(id) !== index);
if (duplicateIds.length) throw new Error(`Duplicate Control IDs: ${[...new Set(duplicateIds)].join(', ')}`);
if (!controls.length) throw new Error('No source controls found; refusing to generate an empty index.');

const domainSummary = new Map();
for (const control of controls) {
  if (!domainSummary.has(control.domain)) domainSummary.set(control.domain, { Common: 0, Enhancement: 0, Local: 0, total: 0 });
  const summary = domainSummary.get(control.domain);
  summary[control.className] += 1;
  summary.total += 1;
}

const lines = [
  '# GapZer0 Control Index',
  '',
  '이 인덱스는 사용자의 실무 표현을 관련 GapZer0 Control 후보와 연결하기 위한 검색 자료입니다. 인덱스의 요약만으로 최종 답변을 작성하지 말고, 반드시 `원문 위치`의 Control 본문과 적용 조건을 확인합니다.',
  '',
  '- **기준 원본:** `_pages/control-guide/`',
  ...(sourceRevision ? [`- **기준 원문 커밋:** ${sourceRevision} (canonical main snapshot)`] : []),
  `- **Control 수:** ${controls.length}`,
  `- **Security Domain 수:** ${domainSummary.size}`,
  '- **Control Class:** Common, Enhancement, Local',
  '',
  '## Domain별 Control 수',
  '',
  '| Security Domain | Common | Enhancement | Local | 합계 |',
  '|---|---:|---:|---:|---:|',
];

for (const [domain, summary] of [...domainSummary.entries()].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
  lines.push(`| ${domain} | ${summary.Common} | ${summary.Enhancement} | ${summary.Local} | ${summary.total} |`);
}

lines.push('', '---', '');
for (const control of controls) {
  const originalPath = control.relativeSource.replace(/^references\/controls\//, '_pages/control-guide/');
  const anchor = control.id.toLowerCase();
  lines.push(
    `## ${control.id} — ${control.name}`,
    '',
    `- **Domain:** ${control.domain}`,
    `- **Class:** ${control.className}`,
    `- **검색 키워드:** ${control.keywords.join(', ')}`,
    `- **적용 조건 요약:** ${control.applicability}`,
    `- **원문 위치:** \`${control.relativeSource}#${anchor}\``,
    `- **가이드라인 원본:** \`${originalPath}#${anchor}\``,
    '',
  );
}

fs.mkdirSync(referencesRoot, { recursive: true });
fs.writeFileSync(path.join(referencesRoot, 'control-index.md'), `${lines.join('\n').trimEnd()}\n`, 'utf8');
console.log(`Generated ${controls.length} controls across ${domainSummary.size} domains.`);
console.log(`Index: ${path.join(referencesRoot, 'control-index.md')}`);
console.log(`Control references: ${targetControlsRoot}`);
