// 0:36 — three leaks along the path from enquiry to customer. params.upto: which leak this shot adds
SCENES.leakMap=()=>{
  theme('dark');
  const up=P().upto;
  const hd=heading('Three leaks','Where leads <span style="color:var(--accent)">slip through.</span>',420,70,80);
  const W=wires(), y=400;
  const pipe=W.line(470,y,1790,y,'#5b544c',10);
  const ends=[['Enquiry',420],['Customer',1700]].map(([s,x])=>{const d=el('div','abs',null,s); Object.assign(d.style,{left:x+'px',top:(y-70)+'px',fontWeight:700,fontSize:'24px',letterSpacing:'.2em',textTransform:'uppercase',color:'#8d857b'}); return d});
  const L=[['Nobody sees it','Shared inbox · spam · someone who left'],['Nobody replies fast','“Properly” turns into tomorrow'],['Nobody follows up','One reply, then silence']];
  const xs=[620,1060,1500];
  const leaks=L.map(([h,s],i)=>{
    const x=xs[i];
    const gapEl=el('div','abs'); Object.assign(gapEl.style,{left:(x-30)+'px',top:(y-14)+'px',width:'60px',height:'28px',background:'var(--night)'});
    const drops=[0,1,2].map(j=>{const d=el('div','abs'); Object.assign(d.style,{left:(x-8)+'px',top:(y+10)+'px',width:'16px',height:'22px',borderRadius:'50% 50% 50% 50% / 60% 60% 40% 40%',background:WARN}); return d});
    const card=panel(null,{left:(x-200)+'px',top:'560px',width:'400px',padding:'30px 32px'});
    card.innerHTML=`<div class="mega" style="font-size:72px;color:${WARN}">0${i+1}</div><div style="font-weight:900;font-size:40px;margin-top:16px">${h}</div><div class="serif" style="font-style:italic;font-size:27px;color:#b9b0a4;margin-top:8px">${s}</div>`;
    return {gapEl,drops,card};
  });
  // when each leak appears in this shot (earlier leaks are already there)
  const at=[-1,-1,-1];
  if(up===1) at[0]=S.lines[1].t0-.1;
  if(up===2) at[1]=S.lines[0].t0;
  if(up===3) at[2]=S.lines[0].t0;
  const sub= up===1?S.lines[2].t0: up===2?S.lines[1].t0: S.lines[1].t0;
  const camIn=cam(.2,220);
  return t=>{hd(t); pipe(up===1?ramp(t,.1,.8):1); ends.forEach(e=>e.style.opacity=up===1?ramp(t,.4,.4):1);
    leaks.forEach(({gapEl,drops,card},i)=>{
      const shown= i<up-1 ? -10 : i===up-1 ? at[i] : 1e9;
      const k=clamp((t-shown)*3); gapEl.style.opacity=k;
      drops.forEach((d,j)=>{const ph=((t-shown)*0.9+j/3)%1; d.style.opacity=k*(1-ph); d.style.transform=`translateY(${ph*110}px)`});
      const sk=spring((t-shown)/.6); card.style.opacity=k*(i<up-1?.45:1); card.style.transform=`translateY(${(1-sk)*40}px)`;
      const s=card.lastChild; s.style.opacity= i<up-1?1: ramp(t,sub-.1,.4);
    });
    camIn(t)};
};
