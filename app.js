"use strict";
const wishes=window.CHRISTMAS_WISHES;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('track').innerHTML=wishes.map((w,i)=>{return `<article class="panel" data-index="${i}"><div class="window-stage"><img class="panel-photo" src="assets/${w.image||w.id}.png" alt="${esc(w.brand)} Christmas window: ${esc(w.title)}" loading="${i<2?'eager':'lazy'}"></div><div class="panel-info"><div><div class="panel-tag">WINDOW ${String(i+1).padStart(2,'0')} · ${esc(w.setting)}</div><h3>${esc(w.brand)}</h3><p>${esc(w.title)} · ${esc(w.detail)}</p></div><a class="gift" href="${esc(w.url)}" target="_blank" rel="noopener noreferrer" aria-label="View ${esc(w.title)} at retailer">VIEW THIS WISH ↗</a></div></article>`}).join('');
$('dots').innerHTML=wishes.map((_,i)=>`<button class="dot" data-index="${i}" aria-label="Go to window ${i+1}"></button>`).join('');
let active=0;const motion=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const cards=[...$('track').children];const update=()=>{$('count').textContent=String(active+1).padStart(2,'0')+' / '+String(wishes.length).padStart(2,'0');document.querySelectorAll('.dot').forEach((b,i)=>b.classList.toggle('current',i===active));};
function go(i){active=(i+wishes.length)%wishes.length;const el=cards[active];$('viewport').scrollTo({left:el.offsetLeft-cards[0].offsetLeft,behavior:motion?'smooth':'instant'});update()}
function showList(i=0){if(typeof hideInvitation==='function')hideInvitation();$('home').classList.add('hidden');$('collection').classList.remove('hidden');location.hash='wishes';window.scrollTo(0,0);requestAnimationFrame(()=>go(i))}
function showHome(){$('home').classList.remove('hidden');$('collection').classList.add('hidden');location.hash='home';window.scrollTo(0,0)}
$('landing-enter').onclick=()=>showList();$('brand').onclick=showHome;$('top-cta').onclick=()=>showList();$('enter').onclick=()=>showList();$('prev').onclick=()=>go(active-1);$('next').onclick=()=>go(active+1);document.querySelectorAll('.dot').forEach(b=>b.onclick=()=>go(Number(b.dataset.index)));
$('viewport').onkeydown=e=>{if(e.key==='ArrowRight'){e.preventDefault();go(active+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(active-1)}};
// Native touch scrolling and CSS scroll-snap handle gestures. Synchronise the active dot to the real viewport.
let scrollFrame=0;
function syncFromScroll(){
  scrollFrame=0;
  const vp=$('viewport');
  const centre=vp.scrollLeft+vp.clientWidth/2;
  let nearest=0,dist=Infinity;
  cards.forEach((card,i)=>{
    const cardCentre=card.offsetLeft-cards[0].offsetLeft+card.offsetWidth/2;
    const d=Math.abs(cardCentre-centre);
    if(d<dist){dist=d;nearest=i;}
  });
  if(nearest!==active){active=nearest;update();}
}
$('viewport').addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(syncFromScroll)},{passive:true});
window.addEventListener('resize',()=>{if(!$('collection').classList.contains('hidden')){
  $('viewport').scrollTo({left:cards[active].offsetLeft-cards[0].offsetLeft,behavior:'instant'});
  syncFromScroll();
}});

update();
// Five-second invitation: never blocks the storefront during its initial reveal.
let invitationTimer;let invitationSeen=false;
function hideInvitation(){clearTimeout(invitationTimer);$('reveal').hidden=true;invitationSeen=true;}
$('dismiss').addEventListener('click',hideInvitation);
$('browse').addEventListener('click',hideInvitation);
$('enter').addEventListener('click',hideInvitation);
function scheduleInvitation(){if(invitationSeen||location.hash==='#wishes')return;invitationTimer=setTimeout(()=>{if(!$('home').classList.contains('hidden')&&!document.hidden){$('reveal').hidden=false;invitationSeen=true;}},5000);}
if(location.hash==='#wishes')showList(); else scheduleInvitation();
