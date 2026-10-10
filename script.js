const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const nav=$('#nav'),bar=$('#progress'),hero=$('.hero>img');
addEventListener('scroll',()=>{
  nav.classList.toggle('solid',scrollY>40);
  const h=document.documentElement.scrollHeight-innerHeight;
  bar.style.width=(h>0?scrollY/h*100:0)+'%';
  if(hero&&innerWidth>800&&scrollY<innerHeight)hero.style.marginTop=(scrollY*.15)+'px';
},{passive:true});
$$('.card').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('open')));
$('#yr').textContent=new Date().getFullYear();

// intro splash (once per session)
const splash=$('#splash');let seen=false;
try{seen=sessionStorage.getItem('intro')}catch(e){}
const start=()=>{splash.classList.add('hide');document.body.classList.add('ready')};
if(seen){splash.style.display='none';document.body.classList.add('ready')}
else{setTimeout(start,1500);try{sessionStorage.setItem('intro','1')}catch(e){}}

// scroll reveal with stagger
const targets=$$('.row h2,.note,.sg h3,.card,.pcard,.tl-item,.tl-now,.logo-tile,.num,.chips,.contact>*');
targets.forEach(el=>{
  el.classList.add('reveal');
  const sibs=[...el.parentElement.children];
  el.style.transitionDelay=Math.min(sibs.indexOf(el),6)*90+'ms';
});
const count=el=>{
  const to=parseFloat(el.dataset.count),dec=+el.dataset.dec||0,suf=el.dataset.suf||'';
  const t0=performance.now();
  (function f(t){const p=Math.min((t-t0)/1200,1),e=1-Math.pow(1-p,3);
    el.textContent=(to*e).toFixed(dec)+suf;if(p<1)requestAnimationFrame(f)})(t0);
};
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach(count);
  io.unobserve(e.target);
}),{threshold:.15});
targets.forEach(t=>io.observe(t));
// hero stats count-up after intro
setTimeout(()=>$$('.stats [data-count]').forEach(count),seen?300:1700);
targets.forEach(el=>el.addEventListener('transitionend',e=>{if(e.propertyName==='transform'&&el.classList.contains('in'))el.classList.add('done')}));

// desktop slider arrows (only where a row overflows)
$$('.slider:not(.tiles)').forEach(s=>{
  const w=document.createElement('div');w.className='sw';
  s.parentNode.insertBefore(w,s);w.appendChild(s);
  [['l','\u2039',-1],['r','\u203A',1]].forEach(([k,t,d])=>{
    const b=document.createElement('button');b.className='arrow '+k;b.type='button';
    b.setAttribute('aria-label',d<0?'Scroll left':'Scroll right');b.textContent=t;
    b.addEventListener('click',()=>s.scrollBy({left:d*s.clientWidth*.8,behavior:'smooth'}));
    w.appendChild(b);
  });
  const chk=()=>w.classList.toggle('over',s.scrollWidth>s.clientWidth+4);
  chk();addEventListener('resize',chk);
});
