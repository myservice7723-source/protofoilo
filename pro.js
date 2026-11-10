'use strict';
const header = document.getElementById('siteHeader');
const progress = document.getElementById('scrollProgress');
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('mobileMenu');
const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];
const sectionIds = ['home','studio','work','expertise','contact'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScroll(){
  const y = window.scrollY;
  header.classList.toggle('scrolled',y>24);
  progress.style.width = `${Math.min(100, (y / Math.max(1,document.documentElement.scrollHeight-window.innerHeight))*100)}%`;
  let active = 'home';
  for (const id of sectionIds){const el=document.getElementById(id);if(el && el.getBoundingClientRect().top <= window.innerHeight*.38)active=id;}
  navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+active));
}
window.addEventListener('scroll',updateScroll,{passive:true});
window.addEventListener('resize',updateScroll,{passive:true});
updateScroll();

function setMenu(open){
  menu.classList.toggle('open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  document.body.classList.toggle('menu-open',open);
  menu.inert=!open;
}
toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){setMenu(false);toggle.focus();}});
window.addEventListener('resize',()=>{if(window.innerWidth>850)setMenu(false)});

const items=document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  items.forEach(el=>observer.observe(el));
}else{items.forEach(el=>el.classList.add('visible'))}

document.getElementById('year').textContent=String(new Date().getFullYear());

const projectData=[
 {name:'Maison No. 01',type:'RESIDENTIAL / CONCEPT 01',image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=84',copy:'A conceptual exploration of contemporary residential design — warm natural textures, sculpted light, and thoughtful spatial relationships. This preview demonstrates how a real project story could be presented.'},
 {name:'The Quiet Form',type:'INTERIORS / CONCEPT 02',image:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=84',copy:'An interior concept grounded in restraint and proportion. Natural materials, a soft palette, and understated details create a sense of calm.'},
 {name:'A Study in Light',type:'SPATIAL DESIGN / CONCEPT 03',image:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=84',copy:'A conceptual study of how light, surface, and shadow influence the atmosphere of architectural spaces.'}
];
const projectModal=document.getElementById('projectModal');
const projectImage=document.getElementById('modalProjectImage');
const projectTitle=document.getElementById('modalProjectTitle');
const projectType=document.getElementById('modalProjectType');
const projectCopy=document.getElementById('modalProjectCopy');
document.querySelectorAll('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{
  const data=projectData[Number(btn.dataset.project)];if(!data)return;
  projectTitle.textContent=data.name;projectType.textContent=data.type;projectCopy.textContent=data.copy;
  projectImage.style.backgroundImage=`url("${data.image}")`;
  projectModal.showModal();
}));
const contactModal=document.getElementById('contactModal');
document.getElementById('openContact').addEventListener('click',()=>contactModal.showModal());
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
[projectModal,contactModal].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()}));
const form=document.getElementById('contactForm');
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const name=document.getElementById('contactName').value.trim();
  const email=document.getElementById('contactEmail').value.trim();
  const message=document.getElementById('contactMessage').value.trim();
  if(!name||!email||!message)return;
  const prepared=`Portfolio inquiry for Sohaib Al-Qutaibi\n\nName: ${name}\nEmail: ${email}\n\n${message}`;
  const status=document.getElementById('contactStatus');
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(prepared);
    status.textContent='Message copied. Paste it into your email or messaging app.';
  }catch{
    const fallback=document.createElement('textarea');fallback.value=prepared;fallback.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(fallback);fallback.select();
    const ok=document.execCommand('copy');fallback.remove();
    status.textContent=ok?'Message copied. Paste it into your email or messaging app.':'Copy unavailable. Please select and copy your message manually.';
  }
});
