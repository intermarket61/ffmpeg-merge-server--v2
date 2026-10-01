// 8:30 — four-line summary, built on screen and held. Legible at 400 px wide
SCENES.summary=()=>{
  theme('paper');
  const sheet=el('div','sheet'); Object.assign(sheet.style,{left:'170px',top:'90px',width:'1580px',height:'900px',padding:'70px 90px'});
  const k=el('div','kicker',sheet,'Before you connect anything'); k.style.color='var(--accent-ink)';
  const lines=['Ask first on everything.','One window, opened deliberately.','Requests land where you look.','Inbound runs unattended.'];
  const rows=lines.map((x,i)=>{const d=el('div','',sheet,`<span class="mega" style="color:var(--accent-ink);display:inline-block;width:130px">0${i+1}</span>${x}`);
    Object.assign(d.style,{fontWeight:900,fontSize:'74px',letterSpacing:'-.03em',whiteSpace:'nowrap',marginTop:i?'56px':'70px',color:'var(--ink)'});
    return pop(d,S.lines[i].t0-.1,50)});
  return t=>{sheet.style.opacity=ramp(t,0,.4); rows.forEach(r=>r(t))};
};
