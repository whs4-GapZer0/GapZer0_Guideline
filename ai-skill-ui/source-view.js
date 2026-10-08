import {renderMarkdown} from './markdown-renderer.js';
const raw=document.querySelector('#source-text');
const target=document.querySelector('#source-content');
if(raw&&target)target.append(renderMarkdown(raw.textContent));
