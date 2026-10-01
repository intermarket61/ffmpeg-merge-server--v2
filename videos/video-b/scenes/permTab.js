// 3:00 — the permissions tab: watched and unattended set separately; the mistake is copying across
SCENES.permTab=()=>{
  theme('dark');
  const hd=heading('Agent · permissions','Two situations. <span style="color:var(--blue)">Two columns.</span>',420,60,76);
  const box=panel(null,{left:'420px',top:'250px',width:'1420px',padding:'10px 44px'});
  const head=el('div','',box); Object.assign(head.style,{display:'flex',height:'90px',alignItems:'center',fontWeight:700,fontSize:'24px',letterSpacing:'.14em',color:'var(--mute)'});
  head.innerHTML='<span style="flex:1">ACTION</span><span style="width:340px">IN A THREAD · WATCHED</span><span style="width:340px">ON A SCHEDULE · UNATTENDED</span>';
  const acts=[['Web search',0],['Read Gmail',0],['Draft email',0],['Send email',1],['Post to Slack',1],['Edit calendar',1]];
  const cell=(r,txt)=>{const c=el('span','',r,txt);Object.assign(c.style,{width:'340px'});const v=el('span','',c,'');Object.assign(v.style,{display:'inline-block',padding:'10px 22px',borderRadius:'12px',fontWeight:900,fontSize:'26px'});return v};
  const rows=acts.map(([n,out])=>{const r=el('div','',box);Object.assign(r.style,{display:'flex',alignItems:'center',height:'92px',borderTop:'1px solid #2a2622',fontSize:'34px'});
    const nm=el('span','',r,n); nm.style.flex='1'; nm.style.fontWeight=900; nm.style.color=out?'var(--amber)':'var(--blue)';
    return {r,out,a:cell(r),b:cell(r)}});
  const set=(v,txt)=>{v.textContent=txt;
    v.style.background= txt==='Allow'?'rgba(143,214,148,.16)':txt==='Ask first'?'rgba(127,196,214,.16)':'#2a2622';
    v.style.color= txt==='Allow'?'var(--green)':txt==='Ask first'?'var(--blue)':'var(--mute)';};
  const scrub=el('div','abs'); Object.assign(scrub.style,{top:'250px',width:'340px',height:'650px',borderRadius:'20px',background:'rgba(127,196,214,.07)',boxShadow:'0 0 0 2px rgba(127,196,214,.35)'});
  const cap=el('div','abs serif',null,'The mistake: <i>the same config, on a schedule.</i>'); Object.assign(cap.style,{left:'420px',top:'940px',fontSize:'46px'});
  const tSplit=wordAt(0,'split'), tFine=wordAt(1,'fine'), tCopy=wordAt(1,'exact');
  const camIn=cam(.2,240);
  return t=>{
    hd(t); box.style.opacity=ramp(t,.1,.5);
    // slow scrub across the two columns while the split is named
    const s=ramp(t,tSplit-.2,2.2,inOut); scrub.style.left=lerp(1106,1446,s)+'px';
    scrub.style.opacity=ramp(t,tSplit-.2,.3)*(1-ramp(t,tFine-.6,.4));
    rows.forEach(({out,a,b},i)=>{
      const lit=t>=tFine-.3+i*.08; set(a, lit?'Allow':(out?'Ask first':'Allow'));
      const copied=t>=tCopy+i*.12; set(b, copied?'Allow':(out?'Off':'Allow'));
      b.style.boxShadow= copied&&out?`0 0 0 3px rgba(255,177,61,${.5+.4*Math.sin(t*5)})`:'none';
    });
    cap.style.opacity=ramp(t,tCopy+.6,.4); camIn(t);
  };
};
