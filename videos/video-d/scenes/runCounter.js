// 2:00 — every scheduled run ends with something delivered; count it
SCENES.runCounter=()=>{
  theme('dark');
  const hd=heading('Alarm 01','Count what each run <span style="color:var(--accent)">delivered.</span>',420,70,80);
  const runs=[['Mon 07:00','page published',1],['Mon 07:30','message posted',1],['Tue 07:00','file saved',1],['Wed 07:00','—',0]];
  const box=panel(null,{left:'420px',top:'270px',width:'1420px',padding:'14px 44px'});
  const rows=runs.map(([w,what,n],i)=>{const r=el('div','',box);Object.assign(r.style,{display:'flex',alignItems:'center',height:'120px',borderTop:i?'1px solid #2a2622':'0',fontSize:'36px'});
    r.innerHTML=`<span style="width:300px;font-weight:900">${w}</span><span style="flex:1;color:#b9b0a4">${what}</span><span class="cnt mega" style="font-size:60px;width:120px;text-align:right;color:${n?'var(--green)':'var(--accent)'}">${n}</span><span class="b" style="margin-left:30px"></span>`;
    const b=bell(r.querySelector('.b'),52); return {r,b,n}});
  const tAt=[wordAt(0,'scheduled'),wordAt(1,'message'),wordAt(1,'file'),S.lines[2].t0];
  const camIn=cam(.2,240);
  return t=>{hd(t); box.style.opacity=ramp(t,.1,.4);
    rows.forEach(({r,b,n},i)=>{r.style.opacity=ramp(t,tAt[i]-.2,.3); b.set(n===0&&t>=tAt[3]+.3?1:0,t);
      r.style.background=n===0&&t>=tAt[3]+.3?'rgba(255,177,61,.08)':'transparent'});
    camIn(t)};
};
