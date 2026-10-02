// 4:30 — 24 hours after Friday evening is Saturday evening: resume at the next working morning instead
SCENES.businessHours=()=>{
  theme('dark');
  const hd=heading('Step 05 · Wait','Remind you <span style="color:var(--accent)">when you can act.</span>',420,70,80);
  const days=['Fri','Sat','Sun','Mon'];
  const row=el('div','abs'); Object.assign(row.style,{left:'420px',top:'260px',display:'flex',gap:'20px'});
  const cells=days.map(d=>{const c=el('div','',row); Object.assign(c.style,{width:'335px',height:'240px',borderRadius:'24px',background:'#191714',padding:'24px 28px',boxShadow:'0 0 0 1px rgba(255,255,255,.07)',position:'relative'});
    c.innerHTML=`<div style="font-weight:700;font-size:26px;letter-spacing:.14em;color:#8d857b">${d.toUpperCase()}</div><div class="e"></div>`; return c});
  const ev=(c,html,col)=>{const e=el('div','',c.querySelector('.e'),html); Object.assign(e.style,{marginTop:'20px',fontWeight:900,fontSize:'32px',color:col,lineHeight:'1.15'}); return e};
  const e1=ev(cells[0],'18:40<br><span style="font-size:26px;font-weight:500;color:#cfc6b8">Lead arrives</span>','var(--cream)');
  const e2=ev(cells[1],'18:40<br><span style="font-size:26px;font-weight:500">+24 hours</span>',WARN);
  const x=el('div','abs',cells[1]); Object.assign(x.style,{left:'20px',right:'20px',top:'92px',height:'5px',borderRadius:'3px',background:WARN});
  const e3=ev(cells[3],'09:00<br><span style="font-size:26px;font-weight:500;color:#cfc6b8">Reminder</span>',LEAD);
  const wp=panel(null,{left:'420px',top:'560px',width:'1420px',padding:'28px 36px',display:'flex',gap:'60px',alignItems:'center'});
  wp.innerHTML=`<div style="display:flex;gap:16px;align-items:center;color:var(--accent)">${ico('clock',44)}<span style="font-weight:900;font-size:38px;color:var(--cream)">Wait</span></div>
    <div><div style="font-size:24px;color:#8d857b">Resume</div><div class="r" style="font-size:34px;font-weight:700">After time interval</div></div>
    <div class="ex" style="font-family:monospace;font-size:24px;color:var(--blue)">next working day, 09:00</div>`;
  const r=wp.querySelector('.r'), exE=wp.querySelector('.ex');
  const note=el('div','abs serif',null,'<i>One short expression skips the weekend.</i>'); Object.assign(note.style,{left:'420px',top:'760px',fontSize:'38px',color:'#b9b0a4'});
  const tF=wordAt(1,'friday'), tS=wordAt(1,'saturday'), tN=wordAt(1,'nobody'), tR=wordAt(2,'specific'), tM=wordAt(2,'nine'), tX=S.lines[3].t0;
  const camIn=cam(.2,220);
  return t=>{hd(t); row.style.opacity=ramp(t,.1,.4);
    e1.style.opacity=ramp(t,tF-.1,.3); e2.style.opacity=ramp(t,tS-.1,.3); x.style.width='auto'; x.style.transform=`scaleX(${ramp(t,tN,.4)})`; x.style.transformOrigin='left';
    wp.style.opacity=ramp(t,tR-.6,.4); const sp=t>=tR; r.textContent=sp?'At specified time':'After time interval'; r.style.color=sp?'var(--accent)':'var(--cream)';
    exE.style.opacity=ramp(t,tM-.2,.3); e3.style.opacity=ramp(t,tM-.1,.3); cells[3].style.boxShadow=t>tM?'0 0 0 3px var(--accent)':'0 0 0 1px rgba(255,255,255,.07)';
    note.style.opacity=ramp(t,tX-.1,.4); camIn(t)};
};
