// 4:00 — the contract: what has to be on every item
SCENES.contract=()=>{
  theme('dark');
  const hd=heading('Alarm 03 · the contract','On <span style="color:var(--accent)">every</span> item. No exceptions.',420,70,80);
  const mk=(x,title,fields,s)=>{const p=panel(null,{left:x+'px',top:'300px',width:'680px',padding:'36px 40px'});
    p.innerHTML=`<div class="kicker" style="font-size:22px;color:var(--mute)">${title}</div>`+fields.map(f=>`<div style="display:flex;align-items:center;gap:20px;height:96px;border-top:1px solid #2a2622;margin-top:8px"><span style="width:34px;height:34px;border-radius:8px;border:3px solid var(--accent)"></span><span style="font-weight:900;font-size:42px">${f}</span><span style="margin-left:auto;font-weight:700;font-size:22px;color:var(--accent)">REQUIRED</span></div>`).join('');
    return pop(p,s,40)};
  const a=mk(420,'Research page',['Source link','Date'],wordAt(1,'research')-.2);
  const b=mk(1160,'Email triage agent',['Sender','Suggested action'],wordAt(2,'email')-.2);
  const camIn=cam(.2,240);
  return t=>{hd(t); a(t); b(t); camIn(t)};
};
