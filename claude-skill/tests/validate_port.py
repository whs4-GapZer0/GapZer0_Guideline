"""Static portability checks only; never invokes an AI runtime."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
CANONICAL = REPO / 'skill'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    manifest = json.loads((ROOT / 'tests/source-manifest.json').read_text())
    for item in manifest['files']:
        assert sha(REPO / item['source']) == item['sha256'], item['source']
        assert sha(REPO / item['portable']) == item['sha256'], item['portable']
    for name in ['FUNCTION_SPEC.md', 'INTEGRATION_SPEC.md']:
        assert (ROOT / name).read_bytes() == (CANONICAL / name).read_bytes()
    portable_skill = (ROOT / 'SKILL.md').read_bytes()
    canonical_skill = (CANONICAL / 'SKILL.md').read_bytes()
    def body(data):
        assert data.startswith(b'---')
        return data[data.index(b'---', 3) + 3:]
    assert body(portable_skill).startswith(body(canonical_skill))
    metadata = portable_skill[:portable_skill.index(b'---', 3)].decode()
    assert re.findall(r'^([a-z_]+):', metadata, re.M) == ['name', 'description']
    assert 'name: gapzero-guide' in metadata
    assert 'description: GapZer0 Framework' in metadata
    index = (ROOT / 'references/control-index.md').read_text()
    records = list(re.finditer(r'^## ([A-Z]{3}-[CEL]-\d{2}) — (.+)\n([\s\S]*?)(?=^## |\Z)', index, re.M))
    assert records
    ids = set()
    for match in records:
        cid, name, body = match.groups()
        assert cid not in ids, cid
        ids.add(cid)
        source = re.search(r'\*\*원문 위치:\*\* `([^`]+)`', body).group(1)
        rel, anchor = source.split('#')
        path = (ROOT / rel).resolve()
        assert path.is_relative_to((ROOT / 'references/controls').resolve())
        assert anchor == cid.lower()
        section = re.search(r'^## ' + re.escape(cid) + r'\s*\n([\s\S]*?)(?=^## |\Z)', path.read_text(), re.M).group(1)
        def field(label):
            return re.search(r'^### '+re.escape(label)+r'\s*\n\s*([^\n]+)', section, re.M).group(1).strip()
        assert field('Control Name') == name.strip(), cid
        for label, source_label in [('Domain','Security Domain'),('Class','Control Class')]:
            indexed = re.search(r'\*\*'+label+r':\*\* (.+)', body).group(1).strip()
            assert indexed == field(source_label), cid
    for cid in ['HRS-C-01','IAM-C-01','IAM-C-03','CON-C-01','SUP-C-05','SUP-C-06']:
        assert cid in ids
    codex = REPO / '.codex/skills/gapzero-guide'
    assert (codex/'SKILL.md').read_bytes() == (CANONICAL/'SKILL.md').read_bytes()
    for path in (ROOT/'references').rglob('*'):
        if path.is_file():
            peer=codex/'references'/path.relative_to(ROOT/'references')
            assert peer.is_file() and peer.read_bytes()==path.read_bytes(), str(peer)
    return {'status':'PASS','validation_type':'STATIC ONLY','reference_files_byte_equal':len(manifest['files']),
            'control_source_files':len(list((ROOT/'references/controls').rglob('*.md'))),
            'index_records_verified':len(records),'unique_control_ids':len(ids),
            'scenario_candidate_ids_verified':6,'copied_specifications_byte_equal':2,
            'original_skill_body_preserved':True,'upload_metadata_validated':True,'codex_reference_parity':True,
            'claude_runtime_validation':'NOT TESTED','cross_runtime_agreement':'NOT MEASURED'}


if __name__ == '__main__':
    print(json.dumps(main(),ensure_ascii=False,indent=2))
