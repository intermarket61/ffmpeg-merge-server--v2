// 1:18 — presenter, kinetic RESEARCH / JUDGMENT / DESIGN
SCENES.presenterWords=()=>{
  faceFull(1.04,1.1);
  const shade=el('div','fill'); shade.style.background='linear-gradient(90deg,rgba(12,11,10,.88) 0%,rgba(12,11,10,.55) 36%,transparent 60%)';
  const words=[['research','Research.','#7fc4d6'],['judgment','Judgment.','#ffb13d'],['design','Design.','#8fd694']]
    .map(([w,label,col],i)=>{const d=el('div','abs mega',null,label);
      Object.assign(d.style,{left:'110px',top:(290+i*160)+'px',fontSize:'140px',color:col});
      return [wordAt(0,w),d]});
  const tagline=el('div','abs serif',null,'One each. <i>Deliberately no use at the other two.</i>');
  Object.assign(tagline.style,{left:'116px',top:'860px',fontSize:'44px',color:'var(--cream)'});
  const tl=tally(0);
  return t=>{
    shade.style.opacity=ramp(t,0,.4);
    for(const [s,d] of words){const k=spring((t-s+.05)/.55);
      d.style.opacity=clamp((t-s+.05)*6); d.style.transform=`translateX(${(1-k)*-90}px)`;}
    tagline.style.opacity=ramp(t,wordAt(0,'one')-.1,.4);
    tl(t);
  };
};
