// 0:45 — connect Gmail on one agent; the other agent's tab shows it absent
SCENES.perAgent=()=>{
  theme('dark');
  const hd=heading('Connecting Gmail','Not your account. <span style="color:var(--blue)">One agent.</span>',420,70,80);
  const mk=(x,name,role,tools)=>{
    const p=panel(null,{left:x+'px',top:'300px',width:'640px',padding:'34px 40px 20px'});
    p.innerHTML=`<div style="font-weight:900;font-size:50px">${name}</div><div class="kicker" style="font-size:20px;color:var(--mute);margin-top:4px">${role} · integrations</div>`;
    const rows=tools.map(([n,on],i)=>{const r=el('div','',p); Object.assign(r.style,{display:'flex',alignItems:'center',height:'96px',borderTop:'1px solid #2a2622',fontSize:'34px',marginTop:i?0:'22px'});
      const lab=el('span','',r,n); lab.style.flex='1'; lab.style.fontWeight=900; const st=el('span','',r,''); Object.assign(st.style,{fontSize:'22px',fontWeight:700,marginRight:'26px',color:'var(--mute)',whiteSpace:'nowrap'});
      const sw=toggle(r,92,50); return {r,sw,on,st,n}});
    return {p,rows};
  };
  const A=mk(420,'Design agent','design',[['Image generation',1],['Publish page',1],['Gmail',0]]);
  const B=mk(1180,'Research agent','research',[['Web search',1],['Browser',1],['Gmail',0]]);
  const cap=el('div','abs serif',null,'Integrations attach <i>per agent.</i>'); Object.assign(cap.style,{left:'420px',top:'900px',fontSize:'50px'});
  const tOn=wordAt(1,'one'), tRes=wordAt(2,'research'), tPer=wordAt(2,'per');
  const camIn=cam(.2,250);
  return t=>{
    hd(t);
    A.p.style.opacity=ramp(t,.1,.5); B.p.style.opacity=ramp(t,.3,.5)*lerp(.45,1,ramp(t,tRes-.3,.4));
    A.rows.forEach(({sw,on,st,n,r})=>{
      if(n==='Gmail'){const k=ramp(t,tOn,.3); sw.set(k,'var(--blue)'); st.textContent=k>.5?'connected':''; st.style.color='var(--blue)';
        r.style.background=`rgba(127,196,214,${.10*k})`;}
      else sw.set(on);
    });
    B.rows.forEach(({sw,on,st,n,r})=>{
      if(n==='Gmail'){sw.set(0); const k=ramp(t,tRes,.4); st.textContent='not connected · 0 messages'; st.style.opacity=k;
        r.style.boxShadow=`inset 0 0 0 ${3*k}px rgba(127,196,214,${.6+.3*Math.sin(t*4)})`; r.style.borderRadius='14px';}
      else sw.set(on);
    });
    cap.style.opacity=ramp(t,tPer-.1,.4); camIn(t);
  };
};
