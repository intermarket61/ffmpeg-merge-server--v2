// 4:25 — a completed run with no output, and the request one tab away. Cut between them twice
SCENES.quietRun=()=>{
  theme('dark');
  const frame=panel(null,{left:'420px',top:'110px',width:'1420px',height:'860px',padding:'0',overflow:'hidden'});
  const tabs=el('div','',frame); Object.assign(tabs.style,{display:'flex',gap:'8px',padding:'20px 24px 0',background:'#211e1a',height:'86px'});
  const tab=(txt)=>{const d=el('div','',tabs,txt);Object.assign(d.style,{padding:'16px 34px',borderRadius:'16px 16px 0 0',fontWeight:900,fontSize:'26px'});return d};
  const tRuns=tab('Runs'), tAppr=tab('Approvals <span style="background:var(--amber);color:var(--ink);border-radius:10px;padding:2px 10px;font-size:20px;margin-left:6px">1</span>');
  const runs=el('div','abs',frame); Object.assign(runs.style,{left:'60px',top:'140px',right:'60px'});
  runs.innerHTML=`<div style="font-weight:700;font-size:24px;color:var(--mute)">Scheduled run · Monday 07:00</div>
    <div class="mega" style="font-size:70px;margin-top:12px">Completed</div>
    ${[['Research','✓ done','var(--green)'],['Writing','✓ done','var(--green)'],['Post report','— nothing posted','var(--mute)']].map(([a,b,c])=>`<div class="st" style="display:flex;height:100px;align-items:center;border-top:1px solid #2a2622;font-size:36px;margin-top:0"><span style="flex:1;font-weight:900">${a}</span><span style="font-weight:700;color:${c}">${b}</span></div>`).join('')}
    <div style="margin-top:34px;font-size:30px;color:var(--mute)">Errors: <b style="color:var(--cream)">0</b></div>`;
  const steps=[...runs.querySelectorAll('.st')];
  const appr=el('div','abs',frame); Object.assign(appr.style,{left:'60px',top:'140px',right:'60px'});
  appr.innerHTML=`<div style="font-weight:700;font-size:24px;color:var(--mute)">Waiting for you</div>
    <div style="margin-top:30px;border-radius:22px;background:#221f1b;padding:36px 40px;display:flex;align-items:center;gap:28px;box-shadow:0 0 0 3px rgba(255,177,61,.5)">
      <span style="width:24px;height:24px;border-radius:50%;background:var(--amber);box-shadow:0 0 20px var(--amber);flex:none"></span>
      <div style="flex:1"><div style="font-weight:900;font-size:38px">Post “Weekly report” to #weekly-reports</div><div style="font-size:26px;color:var(--mute);margin-top:8px">Requested Monday 07:04 · run paused</div></div></div>
    <div style="display:flex;gap:16px;margin-top:28px"><span style="padding:16px 34px;border-radius:14px;background:var(--cream);color:var(--ink);font-weight:900;font-size:28px">Approve</span><span style="padding:16px 34px;border-radius:14px;background:#2a2622;font-weight:900;font-size:28px">Deny</span></div>`;
  const cap=el('div','abs mega',null,'Not broken.'); Object.assign(cap.style,{left:'1360px',top:'40px',fontSize:'60px',color:'var(--blue)'});
  const l1=S.lines[1], tReq=wordAt(2,'request');
  const cuts=[[0,'r'],[l1.t0,'a'],[l1.t1+.25,'r'],[tReq-.1,'a']];
  const steAt=[wordAt(0,'research'),wordAt(0,'writing'),wordAt(0,'nothing')];
  const camIn=cam(.2,240);
  return t=>{
    frame.style.opacity=ramp(t,0,.4);
    const view=cuts.filter(c=>t>=c[0]).pop()[1];
    runs.style.display=view==='r'?'block':'none'; appr.style.display=view==='a'?'block':'none';
    [tRuns,tAppr].forEach((d,i)=>{const on=(i===0)===(view==='r'); d.style.background=on?'#191714':'transparent'; d.style.color=on?'var(--cream)':'var(--mute)'});
    steps.forEach((s,i)=>{s.style.opacity=ramp(t,steAt[i]-.2,.3)});
    cap.style.opacity=ramp(t,l1.t0,.3);
    camIn(t);
  };
};
