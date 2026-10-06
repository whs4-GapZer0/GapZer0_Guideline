import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('all guide links resolve to published Control pages and matching headings', () => {
  const bank = JSON.parse(fs.readFileSync(new URL('../assets/assessment/questions.json', import.meta.url), 'utf8'));
  const root = new URL('../_pages/control-guide/', import.meta.url);
  const pages = new Map();
  for (const domain of fs.readdirSync(root, {withFileTypes: true}).filter(e => e.isDirectory())) {
    const directory = new URL(domain.name + '/', root);
    for (const file of fs.readdirSync(directory).filter(f => f.endsWith('.md'))) {
      const markdown = fs.readFileSync(new URL(file, directory), 'utf8');
      const permalink = markdown.match(/^permalink: (.+)$/m)?.[1].trim();
      if (permalink) pages.set(permalink, markdown);
    }
  }
  assert.equal(bank.controls.length, 121);
  for (const control of bank.controls) {
    assert.match(control.guide, /^\/controls\/[^/]+\/(common|enhancement|local)\/#/);
    const [page, anchor] = control.guide.split('#');
    assert.equal(anchor, control.id.toLowerCase());
    assert.ok(pages.get(page)?.includes('## ' + control.id), control.guide);
  }
});
