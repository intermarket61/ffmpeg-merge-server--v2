// 5:50 — add replied_at next to received_at; the gap is your real response time
SCENES.responseTime=()=>{
  theme('dark');
  const hd=heading('Measure the leak','Your real <span style="color:var(--accent)">response time.</span>',420,70,80);
  const R=[['Omar Haddad','Mon 09:02','Mon 09:40',0.6],['Priya Nair','Mon 14:40','Tue 08:15',17.6],['Dana Ruiz','Tue 21:14','Wed 08:30',11.3],['Lee Chen','Wed 11:05','Wed 11:50',0.75],['Ana Costa','Thu 16:20','Fri 10:05',17.8]];
  const tbl=panel(null,{left:'420px',top:'250px',width:'1420px',padding:'10px 34px',borderRadius:'18px'});
  const w=[300,260,260,520];
  const hdr=el('div','',tbl); Object.assign(hdr.style,{display:'flex',height:'64px',alignItems:'center',fontWeight:700,fontSize:'22px',letterSpacing:'.12em',color:'#8d857b'});
  ['NAME','RECEIVED_AT','REPLIED_AT','GAP'].forEach((h,i)=>{const c=el('span','',hdr,h); c.style.width=w[i]+'px'; if(i===2) c.className='rh'});
  const rh=hdr.querySelector('.rh');
  const rows=R.map(([n,a,b,g])=>{const r=el('div','',tbl); Object.assign(r.style,{display:'flex',height:'76px',alignItems:'center',borderTop:'1px solid #2a2622',fontFamily:'monospace',fontSize:'28px',color:'#cfc6b8'});
    r.innerHTML=`<span style="width:${w[0]}px;font-family:Archivo;font-weight:700">${n}</span><span style="width:${w[1]}px">${a}</span><span class="b" style="width:${w[2]}px;color:var(--accent)">${b}</span><span style="width:${w[3]}px;display:flex;align-items:center;gap:18px"><span class="bar" style="height:16px;border-radius:8px;background:${g>8?WARN:LEAD};width:0"></span><b class="g" style="font-family:Archivo">${g<1?Math.round(g*60)+' min':g.toFixed(1)+' h'}</b></span>`;
    return {b:r.querySelector('.b'),bar:r.querySelector('.bar'),g:r.querySelector('.g'),v:g}});
  const avg=el('div','abs',null,'Average: <span style="color:var(--amber)">9.6 hours</span> <span class="serif" style="font-style:italic;font-weight:400;color:#8d857b;font-size:30px">example figures</span>');
  Object.assign(avg.style,{left:'420px',top:'760px',fontWeight:900,fontSize:'56px'});
  const tail=el('div','abs serif',null,'<i>Creeping up? The bottleneck is the reply, not the workflow.</i>'); Object.assign(tail.style,{left:'420px',top:'860px',fontSize:'38px',color:'#cfc6b8'});
  const tC=wordAt(0,'replied'), tG=wordAt(1,'gap'), tA=wordAt(2,'longer'), tT=S.lines[3].t0;
  const camIn=cam(.2,220);
  return t=>{hd(t); tbl.style.opacity=ramp(t,.1,.4);
    rh.style.color=t>tC?'var(--accent)':'#8d857b'; rh.style.opacity=ramp(t,tC-.2,.3);
    rows.forEach(({b,bar,g,v},i)=>{b.style.opacity=ramp(t,tC+i*.12,.3); bar.style.width=(ramp(t,tG+i*.15,.6)*v/18*360)+'px'; g.style.opacity=ramp(t,tG+i*.15+.3,.3)});
    avg.style.opacity=ramp(t,tA-.1,.4); tail.style.opacity=ramp(t,tT-.1,.4); camIn(t)};
};
