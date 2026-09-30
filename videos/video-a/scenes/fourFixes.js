// ================================================================== four fixes
SCENES.fourFixes=()=>{
  theme('dark');
  const head=el('div','abs',null,'<div class="kicker">What I\'d change</div><div class="mega" style="font-size:92px;margin-top:14px">4 changes. <span style="color:var(--orange)">All cheap.</span></div>');
  Object.assign(head.style,{left:'470px',top:'70px'});
  const fixes=[['Approvals land where you already are','Phone and Slack, not a tab.'],['Empty is a valid result','Describe the successful-but-empty run.'],
               ['Write every brief for amnesia','Including the format the inputs arrive in.'],['Smallest tools. Spend cap. Cheap model.','On anything recurring.']];
  const rows=fixes.map(([a,b],i)=>{const d=el('div','abs'); Object.assign(d.style,{left:'470px',top:(290+i*175)+'px',display:'flex',gap:'36px',alignItems:'flex-start'});
    d.innerHTML=`<div class="mega" style="font-size:110px;color:var(--orange);width:150px">0${i+1}</div><div><div style="font-weight:900;font-size:50px;margin-top:8px">${a}</div><div class="serif" style="font-size:36px;font-style:italic;color:#b9b0a4;margin-top:6px">${b}</div></div>`;
    return pop(d,S.lines[i+1].t0-.1,70)});
  const camIn=cam(.2,280); const tl=tally();
  return t=>{head.style.opacity=ramp(t,0,.5); rows.forEach(r=>r(t)); camIn(t); tl(t)};
};
