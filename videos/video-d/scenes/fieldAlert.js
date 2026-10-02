// 4:45 — the alarm names the item and the field, and where it was lost
SCENES.fieldAlert=()=>{
  theme('dark');
  const hd=heading('When it fires','Which item. <span style="color:var(--accent)">Which field.</span>',420,70,80);
  const al=panel(null,{left:'420px',top:'290px',width:'1100px',padding:'38px 44px',boxShadow:'0 0 0 3px rgba(255,177,61,.6),0 40px 80px rgba(0,0,0,.5)'});
  const row=el('div','',al); Object.assign(row.style,{display:'flex',alignItems:'center',gap:'24px'}); const b=bell(row,60);
  row.insertAdjacentHTML('beforeend','<div style="font-weight:900;font-size:44px">Missing field</div>');
  al.insertAdjacentHTML('beforeend','<div style="margin-top:26px;font-size:34px;line-height:1.7"><span style="color:var(--mute)">Item</span> <b>03 · “New API pricing”</b><br><span style="color:var(--mute)">Field</span> <b style="color:var(--accent)">source link</b><br><span class="where" style="color:var(--mute)">Last seen</span> <b class="where">Research → Judgment handoff</b></div>');
  const where=[...al.querySelectorAll('.where')];
  const tItem=wordAt(0,'item'), tW=wordAt(0,'dropped');
  const camIn=cam(.2,240);
  return t=>{hd(t); al.style.opacity=ramp(t,tItem-.3,.4); b.set(t>=tItem?1:0,t); where.forEach(w=>w.style.opacity=ramp(t,tW-.1,.4)); camIn(t)};
};
