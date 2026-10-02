// 0:40 — what three of the five failures looked like: completely normal
SCENES.normalOutput=()=>{
  theme('dark');
  const hd=heading('The thirty day experiment','3 of 5 failures <span style="color:var(--accent)">looked normal.</span>',420,70,80);
  const page=panel(null,{left:'420px',top:'280px',width:'660px',padding:'30px 36px'});
  page.innerHTML='<div class="kicker" style="font-size:20px;color:var(--mute)">AI launches · week 3</div>'+[1,2,3,4,5].map(i=>`<div style="display:flex;gap:18px;align-items:center;height:78px;border-top:${i>1?'1px solid #2a2622':'0'}"><span style="font-weight:900;font-size:30px;color:var(--mute)">0${i}</span><span style="flex:1;height:14px;border-radius:7px;background:#3a342e"></span><span style="font-size:22px;font-weight:700;color:var(--green)">✓ sourced</span></div>`).join('');
  const list=panel(null,{left:'1140px',top:'280px',width:'700px',padding:'30px 36px'});
  list.innerHTML='<div class="kicker" style="font-size:20px;color:var(--mute)">Worth covering?</div>'+['Agent pricing','Model release','Browser update','New API','Benchmark'].map(x=>`<div style="display:flex;align-items:center;height:78px;border-top:1px solid #2a2622;font-size:28px"><span style="flex:1;font-weight:700">${x}</span><span style="font-weight:900;color:var(--green)">YES</span><span class="serif" style="font-size:22px;font-style:italic;color:#8d857b;margin-left:16px">+ a reason</span></div>`).join('');
  const verdict=el('div','abs mega',null,'Nothing said <span style="color:var(--accent)">broken.</span>'); Object.assign(verdict.style,{left:'420px',top:'860px',fontSize:'76px'});
  const tP=wordAt(0,'three'), tL=wordAt(0,'normal'), tV=S.lines[3].t0;
  const a=pop(page,tP-.1,40), b=pop(list,tL-.1,40), c=pop(verdict,tV-.1,40);
  const camIn=cam(.2,240);
  return t=>{hd(t); a(t); b(t); c(t); camIn(t)};
};
