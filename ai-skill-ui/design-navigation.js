// Navigation presentation only: native anchor URLs and all data remain unchanged.
const menu=document.querySelector('.showcase-nav');
const toggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.textContent='메뉴 열기';}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'메뉴 닫기':'메뉴 열기';});
const links=[...menu.querySelectorAll('a')];
function mark(id){for(const a of links){if(a.hash===`#${id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
links.forEach(a=>a.addEventListener('click',()=>{mark(a.hash.slice(1));closeMenu();}));
menu.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();toggle.focus();}});
window.addEventListener('hashchange',()=>mark(location.hash.slice(1)||'ai-skill'));
mark(location.hash.slice(1)||'ai-skill');
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)mark(e.target.id);},{rootMargin:'-10% 0px -65% 0px'});
links.forEach(a=>{const target=document.querySelector(a.hash);if(target)observer.observe(target);});
