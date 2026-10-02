// 1:20 — stop asking "is it good?", ask "is it the right shape?"; then what an alarm is
SCENES.shapeVsQuality=()=>{
  theme('dark');
  const Q=(x,q,who,note,col)=>{const p=panel(null,{left:x+'px',top:'130px',width:'680px',height:'330px',padding:'38px 40px'});
    p.innerHTML=`<div class="mega" style="font-size:64px;color:${col}">${q}</div><div style="font-weight:700;font-size:28px;margin-top:22px">${who}</div><div class="serif" style="font-size:30px;font-style:italic;color:#b9b0a4;margin-top:8px">${note}</div>`;return p};
  const A=Q(420,'Is it good?','Needs judgment','You, reading every page','#8d857b');
  const B=Q(1160,'Is it the right shape?','A few lines of code','Every single run','var(--accent)');
  const def=el('div','abs',null,'<div class="kicker">An alarm is</div><div class="mega" style="font-size:72px;margin-top:14px">a condition that <span style="color:var(--accent)">cannot be true</span><br>if everything is working.</div>');
  Object.assign(def.style,{left:'420px',top:'560px'});
  const tA=wordAt(0,'good'), tB=wordAt(0,'shape'), tD=S.lines[1].t0;
  const a=pop(A,tA-.2,40), b=pop(B,tB-.2,40), d=pop(def,tD-.1,40);
  const camIn=cam(.2,240);
  return t=>{a(t); b(t); A.style.opacity=Math.min(A.style.opacity, lerp(1,.45,ramp(t,tB,.5))); d(t); camIn(t)};
};
