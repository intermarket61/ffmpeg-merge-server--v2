// 6:10 — the checks are a boring final step: code, not your best model
SCENES.checkStep=()=>{
  theme('dark');
  const hd=heading('Where they live','<span style="color:var(--accent)">Deliberately</span> boring.',420,70,80);
  const steps=[['Research',DATA],['Judgment',DATA],['Design',DATA],['Checks',FIRE]];
  const nodes=steps.map(([n,c],i)=>{const p=panel(null,{left:(420+i*360)+'px',top:'320px',width:'300px',height:'160px',display:'grid',placeItems:'center',boxShadow:`0 0 0 3px ${i===3?'rgba(255,177,61,.6)':'rgba(127,196,214,.35)'}`});
    p.innerHTML=`<div style="font-weight:900;font-size:40px;color:${i===3?'var(--accent)':'var(--cream)'}">${n}</div>`; return p});
  const code=panel(null,{left:'1500px',top:'540px',width:'340px',padding:'24px 28px',fontFamily:'monospace',fontSize:'24px',lineHeight:'1.5',color:'var(--blue)'});
  code.innerHTML='count(outputs)<br>kept / received<br>required fields<br>run.cost';
  const notL=el('div','abs',null,'<div class="kicker" style="color:var(--mute)">Not this</div><div class="mega" style="font-size:56px;margin-top:10px;color:#8d857b">Your most expensive<br>model, checking the others.</div>'); Object.assign(notL.style,{left:'420px',top:'560px'});
  const cap=el('div','abs serif',null,'Counting and comparing <i>is what code is for.</i>'); Object.assign(cap.style,{left:'420px',top:'880px',fontSize:'48px'});
  const tF=wordAt(2,'final'), tN=S.lines[3].t0, tC=S.lines[4].t0;
  const camIn=cam(.2,220);
  return t=>{hd(t); nodes.forEach((p,i)=>p.style.opacity= i<3?ramp(t,.2+i*.15,.3):ramp(t,tF-.1,.4)); code.style.opacity=ramp(t,tF+.3,.4);
    notL.style.opacity=ramp(t,tN-.1,.4); cap.style.opacity=ramp(t,tC-.1,.4); camIn(t)};
};
