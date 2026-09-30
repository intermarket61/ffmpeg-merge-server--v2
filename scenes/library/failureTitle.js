// ================================================================== failure title
SCENES.failureTitle=()=>{
  const n=P().n; faceFull(1.02,1.08);
  const chip=el('div','abs'); Object.assign(chip.style,{left:'64px',top:'56px',padding:'16px 26px',borderRadius:'18px',background:'var(--orange)',color:'var(--ink)',fontWeight:900,fontSize:'30px',zIndex:44});
  chip.innerHTML=`FAILURE 0${n} <span style="font-weight:500;opacity:.8">· ${P().title.replace('<br>',' ')}</span>`;
  const slab=el('div','fill'); slab.style.background='var(--orange)'; slab.style.zIndex=41;
  const big=el('div','abs mega',slab,'0'+n); Object.assign(big.style,{right:'-40px',top:'40px',fontSize:'900px',color:'transparent',WebkitTextStroke:'6px rgba(21,18,15,.28)'});
  const kick=el('div','abs',slab,`FAILURE 0${n} OF 05`); Object.assign(kick.style,{left:'130px',top:'280px',fontWeight:900,fontSize:'34px',letterSpacing:'.3em',color:'#2a130a'});
  const title=el('div','abs mega',slab,P().title); Object.assign(title.style,{left:'124px',top:'350px',fontSize:'150px',color:'var(--ink)'});
  const tl=tallyStrike(n,.9);
  const out= S.duration>5.2 ? 3.3 : 1e9;
  return t=>{
    const k=ramp(t,0,.45,outExpo);
    title.style.transform=`translateX(${(1-k)*-160}px)`; title.style.opacity=k;
    kick.style.opacity=ramp(t,.15,.4);
    big.style.transform=`translateX(${(1-k)*200}px) scale(${1+.02*t})`;
    const o=ramp(t,out,.45,inOut);
    slab.style.clipPath=`inset(0 0 ${o*100}% 0)`;
    chip.style.opacity=ramp(t,out+.3,.4); chip.style.transform=`translateY(${(1-ramp(t,out+.3,.5))*-30}px)`;
    tl(t);
  };
};
