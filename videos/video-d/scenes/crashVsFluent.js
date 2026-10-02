// 1:00 — a crashed script is loud; a confused agent sounds exactly like a working one
SCENES.crashVsFluent=()=>{
  theme('dark');
  const hd=heading('How things fail','Scripts crash. <span style="color:var(--accent)">Agents don’t.</span>',420,70,80);
  const L=panel(null,{left:'420px',top:'290px',width:'680px',height:'470px',padding:'34px 38px',fontFamily:'monospace'});
  L.innerHTML='<div class="kicker" style="font-size:20px;color:var(--mute);font-family:Archivo">A script</div><div style="margin-top:24px;font-size:28px;line-height:1.5;color:var(--amber)">Traceback (most recent call last):<br>&nbsp;&nbsp;File "publish.py", line 42<br>KeyError: \'link\'<br><br><b style="font-family:Archivo;font-size:40px">● ERROR</b></div>';
  const R=panel(null,{left:'1160px',top:'290px',width:'680px',height:'470px',padding:'34px 38px'});
  R.innerHTML='<div class="kicker" style="font-size:20px;color:var(--mute)">A confused agent</div><div class="serif" style="margin-top:24px;font-size:32px;line-height:1.45;color:#d8d0c4">This week’s most significant development is the broad shift toward agentic workflows, with several releases signalling a clear direction for the industry…</div><div style="margin-top:22px;font-weight:900;font-size:30px;color:var(--green)">✓ looks fine</div>';
  const cap=el('div','abs serif',null,'Fluent and plausible <i>is what working output looks like too.</i>'); Object.assign(cap.style,{left:'420px',top:'820px',fontSize:'46px'});
  const tL=wordAt(2,'crashed'), tR=wordAt(3,'confused'), tC=wordAt(3,'exactly');
  const a=pop(L,tL-.15,40), b=pop(R,tR-.15,40);
  const camIn=cam(.2,240);
  return t=>{hd(t); a(t); b(t); cap.style.opacity=ramp(t,tC-.1,.4); camIn(t)};
};
