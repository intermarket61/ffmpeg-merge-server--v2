// 2:15 — what counts as zero: errored, found nothing (unless that's declared valid), waiting for approval
SCENES.zeroCases=()=>{
  theme('dark');
  const hd=heading('What counts as zero','Three ways to <span style="color:var(--accent)">produce nothing.</span>',420,70,80);
  const cases=[['errored','The run errored','obvious',2],['nothing','Found nothing to report','unless an empty week is declared valid',3],['approval','Waiting in an approval queue','nothing failed: the one that catches people',4]];
  const cards=cases.map(([w,h,s,line],i)=>{const p=panel(null,{left:'420px',top:(290+i*210)+'px',width:'1420px',height:'180px',padding:'34px 44px',display:'flex',alignItems:'center',gap:'34px'});
    const bx=el('div','',p); const b=bell(bx,64);
    p.insertAdjacentHTML('beforeend',`<div><div style="font-weight:900;font-size:46px">${h}</div><div class="serif" style="font-size:30px;font-style:italic;color:#b9b0a4;margin-top:6px">${s}</div></div><div class="mega" style="margin-left:auto;font-size:80px;color:var(--accent)">0</div>`);
    return {p,b,s:wordAt(line,w)}});
  const camIn=cam(.2,240);
  return t=>{hd(t); cards.forEach(({p,b,s},i)=>{const k=spring((t-s+.2)/.6); p.style.opacity=clamp((t-s+.2)*5); p.style.transform=`translateY(${(1-k)*40}px)`;
    b.set(t>=s+.3?1:0,t); p.style.boxShadow=i===2&&t>=s?'0 0 0 3px rgba(255,177,61,.6),0 40px 80px rgba(0,0,0,.5)':'0 0 0 1px rgba(255,255,255,.07)'}); camIn(t)};
};
