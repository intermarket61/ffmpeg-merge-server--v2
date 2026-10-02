// 6:55 — break each alarm on purpose and watch it arrive
SCENES.breakTest=()=>{
  theme('dark');
  const hd=heading('Test by breaking','Break it. <span style="color:var(--accent)">Watch it fire.</span>',420,70,80);
  const tests=[['tool','Turn off a tool','Nothing came out'],['link','Delete a link','Something’s missing'],['cap','Set the cap low','It cost too much']];
  const rows=tests.map(([w,a,b],i)=>{const r=panel(null,{left:'420px',top:(280+i*170)+'px',width:'1420px',height:'140px',padding:'0 40px',display:'flex',alignItems:'center',gap:'34px'});
    r.innerHTML=`<span style="font-weight:900;font-size:42px;width:440px;white-space:nowrap">${a}</span><span style="font-size:42px;color:#8d857b">→</span>`;
    const bx=el('span','',r); const bl=bell(bx,52); const l=el('span','',r,b); Object.assign(l.style,{fontWeight:900,fontSize:'40px',color:'var(--accent)',whiteSpace:'nowrap'});
    const ok=el('span','',r,'✓ arrived'); Object.assign(ok.style,{marginLeft:'auto',fontWeight:900,fontSize:'32px',color:'var(--green)',whiteSpace:'nowrap'});
    return {r,bl,l,ok,s:wordAt(1,w)}});
  const cap=el('div','abs serif',null,'Never seen it fire? <i>You’re only hoping it works.</i>'); Object.assign(cap.style,{left:'420px',top:'820px',fontSize:'48px'});
  const tC=S.lines[2].t0;
  const camIn=cam(.2,240);
  return t=>{hd(t); rows.forEach(({r,bl,l,ok,s})=>{r.style.opacity=ramp(t,s-.2,.3); const f=t>=s+.6; bl.set(f?1:0,t); l.style.opacity=f?1:0; ok.style.opacity=ramp(t,s+1.0,.3)});
    cap.style.opacity=ramp(t,tC-.1,.4); camIn(t)};
};
