// ── CURSOR ──
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
function animRing(){ rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); }
animRing();
document.querySelectorAll('a,button,.servicio-card,.doctor-img-wrap,.faq-item,.carousel-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

// ── SCROLL PROGRESS ──
const prog = document.getElementById('scrollProgress');
window.addEventListener('scroll',()=>{
  const pct = window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
  prog.style.width = pct+'%';
});

// ── NAV ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>80));

// ── GSAP ──
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({defaults:{ease:'power3.out'}});
tl.to('.hero-tag',{opacity:1,y:0,duration:.9,delay:.3})
  .to('.hero-logo',{opacity:1,y:0,duration:1.4},'-=.5')
  .to('.hero-sub',{opacity:1,y:0,duration:.8},'-.8')
  .to('.hero-tagline',{opacity:1,y:0,duration:1},'-.5')
  .to('.hero-actions',{opacity:1,y:0,duration:.8},'-.6')
  .to('.hero-scroll',{opacity:1,duration:.6},'-.3')
  .to('.hero-badges',{opacity:1,duration:.8},'-.4');

gsap.to('#heroBg',{yPercent:12,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:2}});

gsap.utils.toArray('.reveal').forEach(el=>{
  gsap.fromTo(el,{opacity:0,y:35},{opacity:1,y:0,duration:1,ease:'power2.out',
    scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}});
});
gsap.utils.toArray('.reveal-left').forEach(el=>{
  gsap.fromTo(el,{opacity:0,x:-40},{opacity:1,x:0,duration:1.1,ease:'power2.out',
    scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}});
});
gsap.utils.toArray('.reveal-right').forEach(el=>{
  gsap.fromTo(el,{opacity:0,x:40},{opacity:1,x:0,duration:1.1,ease:'power2.out',
    scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}});
});

// ── CONTADORES ──
gsap.utils.toArray('[data-target]').forEach(el=>{
  const target=parseInt(el.dataset.target), prefix=el.dataset.prefix||'';
  ScrollTrigger.create({trigger:el,start:'top 85%',once:true,onEnter:()=>{
    gsap.to({val:0},{val:target,duration:2.5,ease:'power2.out',onUpdate:function(){
      const v=Math.round(this.targets()[0].val);
      el.textContent=prefix+(target>=1000?v.toLocaleString('es-ES'):v);
    }});
  }});
});

// ── CARRUSEL ──
const TOT=4; let cur=0, timer;
const track=document.getElementById('carouselTrack');
const progressBar=document.getElementById('carouselProgress');
const slides=document.querySelectorAll('.carousel-slide');

function carouselGo(n){
  slides[cur].classList.remove('active');
  cur=(n+TOT)%TOT;
  track.style.transform=`translateX(-${cur*100}%)`;
  slides[cur].classList.add('active');
  progressBar.style.width=((cur+1)/TOT*100)+'%';
  clearInterval(timer);
  timer=setInterval(()=>carouselGo(cur+1),6000);
}
function carouselMove(d){carouselGo(cur+d);}
progressBar.style.width='25%';
timer=setInterval(()=>carouselGo(cur+1),6000);

// ── FAQ ──
function toggleFaq(item){
  const isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

// ── FORM ──
document.getElementById('citaForm').addEventListener('submit',function(e){
  e.preventDefault();
  const btn=this.querySelector('.btn-form');
  btn.innerHTML='✓ Solicitud recibida — Te llamaremos pronto';
  btn.style.background='#1a6e3a';
  setTimeout(()=>{
    btn.innerHTML='Solicitar cita <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.style.background='';this.reset();
  },4000);
});



/* ═══════════════════════════════════════
   TRATAMIENTOS v7 — Coverflow + flip real
   ═══════════════════════════════════════ */

// Empieza en el centro (índice 3 de 7 = posición central)
let cfIdx = 3;
const CF_TOTAL = 7;

// Configuración de cada posición relativa
// rel: -3 .. 0 .. +3
const CF_POS = {
  '-3': { tx: -750, ty: 55, tz: -340, ry:  52, scale: 0.62, opacity: 0.28, blur: 5 },
  '-2': { tx: -490, ty: 28, tz: -210, ry:  38, scale: 0.74, opacity: 0.48, blur: 3 },
  '-1': { tx: -258, ty:  8, tz:  -95, ry:  20, scale: 0.86, opacity: 0.72, blur: 1 },
   '0': { tx:    0, ty:  0, tz:    0, ry:   0, scale: 1.00, opacity: 1,    blur: 0 },
   '1': { tx:  258, ty:  8, tz:  -95, ry: -20, scale: 0.86, opacity: 0.72, blur: 1 },
   '2': { tx:  490, ty: 28, tz: -210, ry: -38, scale: 0.74, opacity: 0.48, blur: 3 },
   '3': { tx:  750, ty: 55, tz: -340, ry: -52, scale: 0.62, opacity: 0.28, blur: 5 },
};



function cfRender() {
  const cards = document.querySelectorAll('.trat-card');

  cards.forEach((card, i) => {
    const rel = i - cfIdx;
    const absRel = Math.max(-3, Math.min(3, rel));
    const cfg = CF_POS[String(absRel)];

    if (Math.abs(rel) > 3) {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      card.style.zIndex = '0';
      return;
    }

    card.style.transform = cfGetTransform(cfg, false);
    card.style.opacity = cfg.opacity;
    card.style.filter  = cfg.blur > 0 ? `blur(${cfg.blur}px)` : 'none';
    card.style.zIndex  = String(10 - Math.abs(absRel));
    card.style.pointerEvents = Math.abs(absRel) <= 2 ? 'auto' : 'none';

    // Quitar flip a las no-centrales
  });
}

function cfMove(dir) {
  // Desflipear central
  const cards = document.querySelectorAll('.trat-card');

  cfIdx = Math.max(0, Math.min(cfIdx + dir, CF_TOTAL - 1));
  cfRender();
}

// Click desactivado — acordeón exclusivo maneja la apertura

// Scroll
// Scroll desactivado

// Init
function cfGetTransform(cfg, flipped) {
  const flipY = flipped ? 180 : 0;
  return `translateX(${cfg.tx}px) translateY(${cfg.ty}px) translateZ(${cfg.tz}px) rotateY(${cfg.ry + flipY}deg) scale(${cfg.scale})`;
}
document.addEventListener('DOMContentLoaded', cfRender);
setTimeout(cfRender, 150);







/* ═══════════════════════════
   ACORDEÓN EXCLUSIVO
   ═══════════════════════════ */

const SECCIONES_ACTIVAS = [
  'implantologia',
  'odontopediatria-seccion',
  'scanner-seccion'
];

function abrirSeccion(seccionId, e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }

  const objetivo = document.getElementById(seccionId);
  if (!objetivo) return;

  const yaAbierta = objetivo.style.display === 'block';

  // Cerrar todas
  SECCIONES_ACTIVAS.forEach(function(id) {
    var sec = document.getElementById(id);
    if (sec) sec.style.display = 'none';
  });

  // Si estaba cerrada, abrirla
  if (!yaAbierta) {
    objetivo.style.display = 'block';
    setTimeout(function() {
      objetivo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
}
