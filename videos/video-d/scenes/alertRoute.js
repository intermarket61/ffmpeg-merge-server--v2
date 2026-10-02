// 6:30 — where an alarm goes, and what it says: one plain sentence
SCENES.alertRoute=()=>{
  theme('dark');
  const hd=heading('Where they go','Somewhere you <span style="color:var(--accent)">already look.</span>',420,70,80);
  const dash=panel(null,{left:'420px',top:'280px',width:'560px',height:'300px',padding:'34px 38px'});
  dash.innerHTML='<div style="font-weight:900;font-size:40px">Dashboard tab</div><div class="serif" style="font-size:32px;font-style:italic;color:#8d857b;margin-top:14px">opened once a month</div><div class="mega" style="font-size:56px;margin-top:30px;color:#6b645b">= no alarm</div>';
  const ph=el('div','abs'); Object.assign(ph.style,{left:'1080px',top:'250px',width:'760px',height:'520px',borderRadius:'48px',background:'linear-gradient(170deg,#203a4a,#0f1a24)',boxShadow:'0 0 0 4px #24262a,0 40px 80px rgba(0,0,0,.6)',padding:'40px'});
  ph.innerHTML='<div style="text-align:center;font-weight:700;font-size:26px;color:#cfe3ea">Tuesday</div><div class="mega" style="text-align:center;font-size:110px;color:#eef6f8">09:12</div>';
  const n=el('div','',ph); Object.assign(n.style,{marginTop:'30px',padding:'26px 30px',borderRadius:'26px',background:'rgba(240,248,250,.16)',color:'#eef6f8'});
  n.innerHTML='<div style="font-weight:700;font-size:22px;opacity:.8">AGENT ALARMS · now</div><div style="font-weight:900;font-size:32px;margin-top:8px;line-height:1.3">The Monday run produced nothing and has been waiting for approval for 30 hours.</div>';
  const tD=wordAt(1,'dashboard'), tP=wordAt(2,'phone'), tS=wordAt(3,'sentence');
  const a=pop(dash,tD-.2,40);
  const camIn=cam(.2,240);
  return t=>{hd(t); a(t); dash.style.filter=`grayscale(${ramp(t,tD+1.2,.6)})`; ph.style.opacity=ramp(t,tP-.2,.4);
    n.style.opacity=ramp(t,tS,.4); n.style.transform=`translateY(${(1-spring((t-tS)/.6))*30}px)`; camIn(t)};
};
