// Minimal source-format renderer: text nodes only, no raw HTML evaluation.
export function inline(text) {
  const fragment=document.createDocumentFragment();
  const pattern=/\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*/g;
  let end=0;
  for(const match of text.matchAll(pattern)) {
    fragment.append(document.createTextNode(text.slice(end,match.index)));
    if(match[3]) {const bold=document.createElement('strong');bold.textContent=match[3];fragment.append(bold);}
    else {
      const label=match[1],url=match[2];
      if(/^https?:\/\//i.test(url)) {const a=document.createElement('a');a.textContent=label;a.href=url;a.target='_blank';a.rel='noopener';fragment.append(a);}
      else fragment.append(document.createTextNode(label+' ('+url+')'));
    }
    end=match.index+match[0].length;
  }
  fragment.append(document.createTextNode(text.slice(end)));return fragment;
}
export function renderMarkdown(text) {
  const root=document.createElement('div');root.className='rendered-source excerpt';
  let paragraph=[],list=null;
  function flush(){if(paragraph.length){for(const sentence of paragraph.join(' ').split(/(?<=[.!?])\s+(?=[가-힣A-Za-z「])/u)){const p=document.createElement('p');p.append(inline(sentence));root.append(p);}paragraph=[];}list=null;}
  for(const line of text.split(/\r?\n/)) {
    if(!line.trim()||/^\s*---\s*$/.test(line)){flush();continue;}
    const heading=line.match(/^#{1,6}\s+(.+)$/);
    if(heading){flush();const h=document.createElement('h4');h.append(inline(heading[1]));root.append(h);continue;}
    const bullet=line.match(/^\s*[-*]\s+(.+)$/);
    if(bullet){if(paragraph.length)flush();if(!list){list=document.createElement('ul');root.append(list);}const li=document.createElement('li');li.append(inline(bullet[1]));list.append(li);continue;}
    if(list)flush();paragraph.push(line.trim());
  }
  flush();return root;
}
export const activityTitles = text => [...text.matchAll(/^####\s+(.+)$/gm)].map(m=>m[1]);
export const evidenceTitles = text => [...text.matchAll(/^\s*-\s+\*\*([^*]+)\*\*:?/gm)].map(m=>m[1].replace(/:$/,''));
