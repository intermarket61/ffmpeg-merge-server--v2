// 0:24 — presenter, "5 THINGS BROKE" slams in on orange, tally settles
SCENES.presenterFive=()=>{
  faceFull(1.0,1.07);
  const at=wordAt(0,'five');
  const slab=el('div','fill'); slab.style.background='var(--orange)';
  const txt=el('div','abs mega',slab); Object.assign(txt.style,{left:'120px',top:'250px',fontSize:'300px',color:'var(--ink)'});
  txt.innerHTML='5 THINGS<br>BROKE.';
  const sub=el('div','abs serif',slab); Object.assign(sub.style,{left:'128px',top:'800px',fontSize:'54px',fontStyle:'italic',color:'#2a130a'});
  sub.textContent='None of them looked like an error.';
  const tl=tally(0,at);
  const pills=[
    [0,'quietly','Every one broke <em>quietly</em>'],
    [1,'watching','When nobody is <em>watching</em>'],
  ].map(([ln,w,h])=>{const p=el('div','pill','',h);p.style.opacity=0;return [wordAt(ln,w),p]});
  return t=>{
    const inK=ramp(t,at-.05,.35,outExpo), outK=ramp(t,at+1.55,.4,inOut);
    slab.style.clipPath=`inset(0 ${100-inK*100}% 0 ${outK*100}%)`;
    txt.style.transform=`translateX(${(1-inK)*-120}px) scale(${1+.03*(t-at)})`;
    sub.style.opacity=ramp(t,at+.35,.3);
    tl(t);
    for(const [s,p] of pills){
      const a=ramp(t,s-.15,.3), b=1-ramp(t,s+1.6,.3);
      const k=Math.min(a,b); p.style.opacity=k;
      p.style.transform=`translateX(-50%) translateY(${(1-spring((t-s+.15)/.6))*40}px) scale(${lerp(.92,1,a)})`;
    }
  };
};
