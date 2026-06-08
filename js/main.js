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