// 4:11 — If status is still "new": remind a human. Otherwise: end.
SCENES.ifStatus=()=>{
  theme('dark');
  const hd=heading('Step 05 · If','Still new? <span style="color:var(--accent)">Tell a human.</span>',420,70,80);
  const W=wires();
  const ip=panel(null,{left:'420px',top:'420px',width:'470px',padding:'30px 36px'});
  ip.innerHTML=`<div style="display:flex;gap:16px;align-items:center;color:var(--accent)">${ico('branch',44)}<span style="font-weight:900;font-size:40px;color:var(--cream)">If</span></div>
    <div style="margin-top:18px;font-family:monospace;font-size:28px;line-height:1.5"><span style="color:var(--blue)">status</span><br><span style="color:#8d857b">is equal to</span><br><span style="color:var(--amber)">"new"</span></div>`;
  const yes=W.line(890,520,1000,330,'#5b544c'), no=W.line(890,560,1000,770,'#5b544c');
  const tl=el('div','abs',null,'TRUE · nobody replied'); Object.assign(tl.style,{left:'1010px',top:'230px',fontWeight:700,fontSize:'22px',letterSpacing:'.14em',color:WARN});
  const msg=panel(null,{left:'1000px',top:'270px',width:'840px',padding:'26px 32px',boxShadow:`0 0 0 2px ${WARN},0 30px 60px rgba(0,0,0,.5)`});
  msg.innerHTML=`<div style="display:flex;gap:12px;align-items:center;font-size:20px;color:#8d857b;font-weight:700;letter-spacing:.1em">${ico('bell',24,'#ffb13d')} #NEW-LEADS · N8N</div>
    <div style="font-weight:900;font-size:40px;margin-top:12px">Dana Ruiz has waited a day.</div><div style="font-size:28px;color:#cfc6b8;margin-top:6px">Nobody has replied yet. Open row →</div>`;
  const fl=el('div','abs',null,'FALSE · someone replied'); Object.assign(fl.style,{left:'1010px',top:'690px',fontWeight:700,fontSize:'22px',letterSpacing:'.14em',color:'#8d857b'});
  const end=panel(null,{left:'1000px',top:'730px',width:'840px',padding:'26px 32px'});
  end.innerHTML=`<div style="font-family:monospace;font-size:30px"><span style="color:var(--blue)">status</span> <span style="color:var(--accent)">"replied"</span> <span style="color:#8d857b">→</span> <b style="font-family:Archivo;color:var(--cream)">End.</b> <span class="serif" style="font-style:italic;color:#8d857b;font-family:Newsreader">Nothing to do.</span></div>`;
  const tI=S.lines[0].t0, tY=wordAt(1,'new'), tM=wordAt(1,'second'), tN=S.lines[2].t0;
  const camIn=cam(.2,220);
  return t=>{hd(t); ip.style.opacity=ramp(t,tI,.4);
    yes(ramp(t,tY,.4)); tl.style.opacity=ramp(t,tY+.2,.3); msg.style.opacity=ramp(t,tM-.1,.3); msg.style.transform=`translateY(${(1-spring((t-tM+.1)/.6))*30}px)`;
    no(ramp(t,tN,.4)); fl.style.opacity=ramp(t,tN+.2,.3); end.style.opacity=ramp(t,tN+.3,.3);
    camIn(t)};
};
