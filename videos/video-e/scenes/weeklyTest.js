// 5:27 — once a week, fill in your own form: reply arrived, alert arrived
SCENES.weeklyTest=()=>{
  theme('dark');
  const hd=heading('Once a week','Fill in <span style="color:var(--accent)">your own form.</span>',420,70,80);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const row=el('div','abs'); Object.assign(row.style,{left:'420px',top:'280px',display:'flex',gap:'16px'});
  const cells=days.map((d,i)=>{const c=el('div','',row); Object.assign(c.style,{width:'188px',height:'150px',borderRadius:'22px',background:'#191714',padding:'20px 22px',boxShadow:'0 0 0 1px rgba(255,255,255,.07)'});
    c.innerHTML=`<div style="font-weight:700;font-size:24px;letter-spacing:.14em;color:#8d857b">${d.toUpperCase()}</div>${i===0?'<div class="tl" style="font-weight:900;font-size:26px;margin-top:22px;color:var(--accent);white-space:nowrap">Test lead</div>':''}`; return c});
  const sec=el('div','abs mega',null,'30 seconds.'); Object.assign(sec.style,{left:'420px',top:'500px',fontSize:'120px',color:'var(--cream)'});
  const checks=['Reply arrived','Alert arrived'].map((s,i)=>{const d=el('div','abs',null,`<span class="ck" style="display:inline-grid;place-items:center;width:64px;height:64px;border-radius:18px;background:#2f2a25;margin-right:22px;vertical-align:middle">${ico('check',40,'#15120f')}</span>${s}`);
    Object.assign(d.style,{left:(420+i*560)+'px',top:'700px',fontWeight:900,fontSize:'52px'}); return d});
  const tM=S.lines[0].t0+.1, tS=S.lines[1].t0, tR=wordAt(2,'reply'), tA=wordAt(2,'alert'), tW=wordAt(2,'works');
  const camIn=cam(.2,220);
  return t=>{hd(t); row.style.opacity=ramp(t,.1,.4);
    const c0=cells[0]; c0.style.boxShadow= t>tM?'0 0 0 3px var(--accent)':'0 0 0 1px rgba(255,255,255,.07)'; c0.querySelector('.tl').style.opacity=ramp(t,tM,.3);
    sec.style.opacity=ramp(t,tS-.1,.3);
    checks.forEach((d,i)=>{const at=i?tA:tR; d.style.opacity=ramp(t,at-.1,.3); d.querySelector('.ck').style.background=t>at+.2?'var(--accent)':'#2f2a25'});
    camIn(t)};
};
