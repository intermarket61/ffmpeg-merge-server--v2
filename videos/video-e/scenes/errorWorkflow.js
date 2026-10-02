// 4:54 — a tiny Error Trigger workflow, chosen in the lead workflow's settings
SCENES.errorWorkflow=()=>{
  theme('dark');
  const hd=heading('Leak four','When it breaks, <span style="color:var(--accent)">it tells you.</span>',420,70,80);
  const W=wires();
  const box=panel(null,{left:'420px',top:'250px',width:'720px',height:'330px',background:'#141210'});
  const lbl=el('div','',box,'WORKFLOW · “LEAD ALARM”'); Object.assign(lbl.style,{position:'absolute',left:'30px',top:'22px',fontWeight:700,fontSize:'20px',letterSpacing:'.16em',color:'#8d857b'});
  const n1=node(box,90,90,'alert','Error Trigger',null,{size:130,col:WARN}), n2=node(box,470,90,'phone','Telegram',null,{size:130,col:WARN});
  const lk=W.line(420+90+130,250+155,420+470,250+155,'#5b544c');
  const set=panel(null,{left:'1200px',top:'250px',width:'640px',padding:'30px 36px'});
  set.innerHTML=`<div style="font-weight:900;font-size:34px">New lead · Settings</div><div style="margin-top:22px;font-size:24px;color:#8d857b">Error workflow (to notify when this one errors)</div>
    <div class="dd" style="margin-top:10px;padding:16px 20px;border-radius:12px;background:#0f0e0c;font-size:30px;font-weight:700;display:flex;justify-content:space-between"><span class="v" style="color:#6f685f">No workflow</span><span style="color:#8d857b">▾</span></div>`;
  const v=set.querySelector('.v');
  const alertMsg=panel(null,{left:'420px',top:'660px',width:'1420px',padding:'28px 36px',boxShadow:`0 0 0 2px ${WARN},0 30px 60px rgba(0,0,0,.5)`});
  alertMsg.innerHTML=`<div style="display:flex;gap:12px;align-items:center;font-size:20px;color:#8d857b;font-weight:700;letter-spacing:.1em">${ico('alert',24,'#ffb13d')} LEAD ALARM</div>
    <div style="font-weight:900;font-size:40px;margin-top:12px">“New lead” failed at <span style="color:var(--amber)">Google Sheets</span></div><div class="serif" style="font-style:italic;font-size:30px;color:#cfc6b8;margin-top:6px">The connection’s sign-in has expired. Reconnect it, then re-run.</div>`;
  const tE=wordAt(0,'error'), tS=wordAt(0,'sends'), tC=wordAt(1,'choose'), tF=S.lines[2].t0;
  const camIn=cam(.2,220);
  return t=>{hd(t); box.style.opacity=ramp(t,.1,.4);
    n1.w.style.opacity=ramp(t,tE-.2,.3); n1.set(t>tE?1:0); n2.w.style.opacity=ramp(t,tS-.2,.3); n2.set(t>tS?1:0); lk(ramp(t,tS-.2,.4));
    set.style.opacity=ramp(t,tC-.6,.4); const on=t>=tC+.2; v.textContent=on?'Lead alarm':'No workflow'; v.style.color=on?'var(--amber)':'#6f685f';
    alertMsg.style.opacity=ramp(t,tF,.3); alertMsg.style.transform=`translateY(${(1-spring((t-tF)/.6))*30}px)`;
    camIn(t)};
};
