// 4:15 — a prompt is a request; a check in code is a guarantee
SCENES.promptVsCheck=()=>{
  theme('dark');
  const hd=heading('Check it in code','Not in <span style="color:var(--accent)">the prompt.</span>',420,70,80);
  const L=panel(null,{left:'420px',top:'290px',width:'680px',height:'420px',padding:'36px 40px'});
  L.innerHTML='<div class="kicker" style="font-size:22px;color:var(--mute)">In the prompt</div><div class="serif" style="margin-top:30px;font-size:44px;font-style:italic;line-height:1.3">“Always include a source.”</div><div class="mega" style="margin-top:60px;font-size:72px;color:#8d857b">A request.</div>';
  const R=panel(null,{left:'1160px',top:'290px',width:'680px',height:'420px',padding:'36px 40px'});
  R.innerHTML='<div class="kicker" style="font-size:22px;color:var(--mute)">In code</div><div style="margin-top:30px;font-family:monospace;font-size:34px;line-height:1.5;color:var(--blue)">if not item.link:<br>&nbsp;&nbsp;&nbsp;&nbsp;alarm("missing link")</div><div class="mega" style="margin-top:40px;font-size:72px;color:var(--accent)">A guarantee.</div>';
  const cap=el('div','abs serif',null,'Information drops out at handoffs. <i>Quietly.</i>'); Object.assign(cap.style,{left:'420px',top:'790px',fontSize:'48px'});
  const a=pop(L,S.lines[1].t0-.1,40), b=pop(R,S.lines[2].t0-.1,40), tC=S.lines[3].t0;
  const camIn=cam(.2,240);
  return t=>{hd(t); a(t); b(t); cap.style.opacity=ramp(t,tC-.1,.4); camIn(t)};
};
