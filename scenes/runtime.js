// Scene runtime: timing utilities, the presenter face, the failure tally,
// film grain, shared scene helpers and the setup/seek API the engine calls.
// Scenes register themselves on SCENES from their own files.

// ------------------------------------------------------------------ utils
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const outCubic=x=>1-Math.pow(1-clamp(x),3);
const outExpo=x=>{x=clamp(x);return x===1?1:1-Math.pow(2,-10*x)};
const inOut=x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const spring=x=>{x=Math.max(0,x);return x>=1.6?1:1-Math.exp(-5.5*x)*Math.cos(9*x)};
const ramp=(t,s,d,e=outCubic)=>e((t-s)/d);
const lerp=(a,b,k)=>a+(b-a)*k;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function el(tag,cls,parent,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;(parent||stage).appendChild(e);return e}
const stage=document.getElementById('stage');

// shot state, set by setup()
let S=null, scene=null, faceBitmap=null;
const faceCanvases=[];

// word timing helpers: S.words = [{w, t0, t1, line}]
function wordAt(line, match, nth=0){
  const hits=S.words.filter(w=>w.line===line && w.w.toLowerCase().replace(/[^a-z0-9']/g,'')===match);
  return hits[nth] ? hits[nth].t0 : S.lines[line].t0;
}

// ------------------------------------------------------------------ face
window.setFace=async function(dataUrl){
  if(!dataUrl){faceBitmap=null;return}
  const blob=await (await fetch(dataUrl)).blob();
  faceBitmap=await createImageBitmap(blob);
};
function drawFaces(t){
  if(!faceBitmap) return;
  for(const f of faceCanvases){
    const c=f.canvas, g=c.getContext('2d');
    const W=faceBitmap.width, H=faceBitmap.height;
    let sx,sy,sw,sh;
    if(f.kind==='full'){
      const z=lerp(f.z0,f.z1,inOut(t/S.duration));
      sw=W/z; sh=H/z;
      sx=clamp(W*.505-sw/2,0,W-sw); sy=clamp(H*.30-sh*.30,0,H-sh);
    }else{ // head-and-shoulders square
      sw=sh=H*.56; sx=W*.505-sw/2; sy=H*.03;
    }
    g.drawImage(faceBitmap,sx,sy,sw,sh,0,0,c.width,c.height);
  }
}
function faceFull(z0=1.0,z1=1.08,parent){
  const c=el('canvas','fill',parent); c.width=1920;c.height=1080;
  faceCanvases.push({canvas:c,kind:'full',z0,z1}); return c;
}
function cam(enterAt=0.2,size=330){
  const box=el('div','cam'); box.style.width=box.style.height=size+'px'; const c=el('canvas','',box); c.width=c.height=400;
  faceCanvases.push({canvas:c,kind:'bubble'});
  return t=>{const k=spring((t-enterAt)/0.9);
    box.style.transform=`translateY(${(1-k)*420}px) scale(${lerp(.8,1,clamp(k))})`;
    box.style.opacity=clamp((t-enterAt)*4)};
}

// ------------------------------------------------------------------ tally
function tally(struck=(S.params&&S.params.tally)||0, strikeAt=null){
  if(S.params&&S.params.tally===false) return ()=>{};   // video without a failure count
  const box=el('div'); box.id='tally';
  const bars=[...Array(5)].map(()=>el('i','',box));
  const lab=el('div','',box,`<b>${struck}/5</b><small>FAILURES</small>`);
  return t=>{
    const inK= strikeAt==null?1:ramp(t,strikeAt+1.7,.5);
    box.style.opacity=inK; box.style.transform=`translateY(${(1-inK)*-30}px)`;
    bars.forEach((b,i)=>{
      const on=i<struck;
      b.style.background= on?'var(--orange)':'#3a342e';
      b.style.boxShadow= on?'0 0 18px rgba(255,90,31,.7)':'none';
      const g= strikeAt==null?1:ramp(t,strikeAt+1.7+i*.09,.25);
      b.style.transform=`scaleY(${g})`;
    });
  };
}

// ------------------------------------------------------------------ grain
const grain=document.getElementById('grain').getContext('2d');
const grainImg=grain.createImageData(480,270);
function drawGrain(frame){
  const r=rng(frame*7919+13), d=grainImg.data;
  for(let i=0;i<d.length;i+=4){const v=r()*255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}
  grain.putImageData(grainImg,0,0);
}

// ------------------------------------------------------------------ scenes
const SCENES={};

// ================================================================== shared
const P=()=>S.params||{};
function wAt(spec){ // [line, word, nth?] -> time
  return wordAt(spec[0], spec[1], spec[2]||0);
}
function pop(d,s,dist=60,dur=.7){ // spring an element up into place at time s
  return t=>{const k=spring((t-s)/dur); d.style.opacity=clamp((t-s)*5);
    d.style.transform=`translateY(${(1-k)*dist}px)`;};
}
function makePills(list){
  return (list||[]).map(([ln,w,h,nth])=>{const p=el('div','pill','',h);p.style.opacity=0;return [wordAt(ln,w,nth||0),p]});
}
function runPills(pills,t){
  for(const [s,p] of pills){
    const a=ramp(t,s-.15,.3), b=1-ramp(t,s+2.0,.3);
    const k=Math.min(a,b); p.style.opacity=k;
    p.style.transform=`translateX(-50%) translateY(${(1-spring((t-s+.15)/.6))*40}px) scale(${lerp(.92,1,a)})`;
  }
}
function theme(name){
  if(name==='paper'){stage.className='paper'; stage.style.background='var(--paper)'}
  else if(name==='orange'){stage.style.background='var(--orange)'}
  else if(name==='accent'){stage.style.background='var(--accent)'}
  else {stage.style.background='radial-gradient(ellipse at 30% 40%,#1c1612 0%,#0c0b0a 70%)'}
}
// tally with the n-th bar striking on at time `at`
function tallyStrike(n,at){
  const box=el('div'); box.id='tally';
  const bars=[...Array(5)].map(()=>el('i','',box));
  const lab=el('div','',box,`<b>${n-1}/5</b><small>FAILURES</small>`); const b=lab.querySelector('b');
  return t=>{
    const on=t>=at;
    b.textContent=(on?n:n-1)+'/5';
    bars.forEach((bar,i)=>{
      const lit=i<n-1 || (i===n-1&&on);
      bar.style.background=lit?'var(--orange)':'#3a342e';
      bar.style.boxShadow=lit?'0 0 18px rgba(255,90,31,.7)':'none';
      bar.style.transform= i===n-1&&on ? `scaleY(${spring((t-at)/.5)}) scaleX(${1+.8*(1-ramp(t,at,.6))})` : '';
    });
    box.style.boxShadow= on&&t<at+.8 ? `0 0 0 1px rgba(255,255,255,.08),0 0 ${60*(1-ramp(t,at,.8))}px rgba(255,90,31,.8)`:'0 0 0 1px rgba(255,255,255,.08)';
  };
}
function panel(parent,style){const d=el('div','abs',parent);Object.assign(d.style,{borderRadius:'28px',background:'#191714',boxShadow:'0 0 0 1px rgba(255,255,255,.07),0 40px 80px rgba(0,0,0,.5)'},style||{});return d}


// ------------------------------------------------------------------ API
window.setup=function(shot){
  S=shot; stage.innerHTML=''; stage.className=''; stage.style.cssText=''; faceCanvases.length=0;
  const p=shot.params||{};                  // a video's own accent colour, if it sets one
  if(p.accent) stage.style.setProperty('--accent',p.accent);
  if(p.accentInk) stage.style.setProperty('--accent-ink',p.accentInk);
  document.getElementById('grain').style.opacity= p.grain!=null ? p.grain : '';   // '' = the page default
  scene=SCENES[shot.scene]();
  return document.fonts.ready.then(()=>true);
};
window.seek=function(t,frame){
  scene(t); drawFaces(t); drawGrain(frame);
  // fade from black at the head of the cut, to black at the tail
  const fade=S.fadeIn?clamp(t/.4):1, tail=S.fadeOut?clamp((S.duration-t)/.6):1;
  document.body.style.opacity=Math.min(fade,tail);
  document.documentElement.style.background='#000';
};
