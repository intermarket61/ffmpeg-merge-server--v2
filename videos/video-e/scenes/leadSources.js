// 2:20 — every door a lead comes through feeds the same steps, labelled by source
SCENES.leadSources=()=>{
  theme('dark');
  const hd=heading('Step 01','Every door, <span style="color:var(--accent)">one workflow.</span>',420,70,80);
  const W=wires();
  const D=[['hook','Website form','website form'],['clock','Booking page','booking page'],['bolt','Lead ad','lead ad'],['mail','info@ inbox','email']];
  const doors=D.map(([ic,n],i)=>{const p=panel(null,{left:'420px',top:(250+i*150)+'px',width:'400px',height:'120px',padding:'0 30px',display:'flex',alignItems:'center',gap:'22px'});
    p.innerHTML=`<span style="color:var(--accent)">${ico(ic,44)}</span><span style="font-weight:900;font-size:36px">${n}</span>`; return p});
  const hub=panel(null,{left:'1030px',top:'420px',width:'360px',height:'140px',display:'grid',placeItems:'center',boxShadow:'0 0 0 3px var(--accent),0 40px 80px rgba(0,0,0,.5)'});
  hub.innerHTML='<div style="text-align:center"><div style="font-weight:900;font-size:36px">Same steps</div><div class="serif" style="font-style:italic;font-size:26px;color:#b9b0a4;margin-top:6px">tidy · write · reply · alert</div></div>';
  const ls=D.map((_,i)=>W.line(820,310+i*150,1030,490,'#5b544c'));
  // a month later: count by source (illustrative)
  const tally=panel(null,{left:'1450px',top:'250px',width:'390px',padding:'26px 30px'});
  el('div','',tally,'<span style="font-weight:700;font-size:20px;letter-spacing:.16em;color:#8d857b">SOURCE · ONE MONTH</span>');
  const n=[14,9,6,3], bars=D.map(([,,s],i)=>{const r=el('div','',tally); Object.assign(r.style,{marginTop:'18px'});
    r.innerHTML=`<div style="display:flex;justify-content:space-between;font-size:24px"><span style="font-family:monospace;color:#cfc6b8">${s}</span><b>${n[i]}</b></div><div style="height:12px;border-radius:6px;background:#2a2622;margin-top:8px"><div class="b" style="height:12px;border-radius:6px;background:var(--accent);width:0"></div></div>`;
    return r.querySelector('.b')});
  const ex=el('div','',tally,'<span class="serif" style="font-style:italic;font-size:22px;color:#8d857b">Example figures</span>'); ex.style.marginTop='16px';
  const tD=[wordAt(1,'booking'),wordAt(1,'lead'),wordAt(1,'email'),S.lines[0].t0+.2], at=[tD[3],tD[0],tD[1],tD[2]];
  const tH=wordAt(2,'same'), tM=S.lines[3].t0;
  const camIn=cam(.2,220);
  return t=>{hd(t);
    doors.forEach((p,i)=>{p.style.opacity=ramp(t,at[i]-.1,.3); p.style.transform=`translateX(${(1-ramp(t,at[i]-.1,.4))*-30}px)`});
    hub.style.opacity=ramp(t,tH-.2,.4); ls.forEach(l=>l(ramp(t,tH,.5)));
    tally.style.opacity=ramp(t,tM-.1,.4); bars.forEach((b,i)=>b.style.width=(ramp(t,tM+.2+i*.1,.6)*n[i]/14*100)+'%');
    camIn(t)};
};
