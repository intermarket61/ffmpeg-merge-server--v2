// 3:50 — one action switched on, in a field of grey; everything else still asks
SCENES.oneAction=()=>{
  theme('dark');
  const hd=heading('Unattended · automatic actions','<span style="color:var(--green)">One.</span> Everything else asks.',420,60,80);
  const acts=['Send email','Reply in thread','Post to #weekly-reports','Post to #general','Create calendar event','Invite to channel','Update CRM record','Delete message','Share a document','Forward a thread'];
  const ONE=2;
  const cells=acts.map((n,i)=>{const c=panel(null,{left:(420+(i%2)*720)+'px',top:(250+Math.floor(i/2)*128)+'px',width:'690px',height:'106px',borderRadius:'20px',display:'flex',alignItems:'center',padding:'0 30px',gap:'24px'});
    const nm=el('span','',c,n); Object.assign(nm.style,{flex:1,fontWeight:900,fontSize:'32px',color:'#6b645b'});
    const badge=el('span','',c,'ASK'); Object.assign(badge.style,{fontWeight:700,fontSize:'20px',letterSpacing:'.14em',color:'var(--amber)',opacity:0});
    const sw=toggle(c,88,48); return {c,nm,badge,sw,one:i===ONE}});
  const tags=[['outside','Internal only'],['delete','Deletable'],['see','Seen in seconds']].map(([w,txt],i)=>{const d=chip(null,'✓ '+txt,'var(--green)',{position:'absolute',left:(420+i*300)+'px',top:'905px',fontSize:'28px',background:'rgba(143,214,148,.12)'});return {d,s:wordAt(0,w)}});
  const tOn=wordAt(0,'posting'), tAsk=wordAt(1,'asks')-.4;
  const camIn=cam(.2,240);
  return t=>{
    hd(t);
    cells.forEach(({c,nm,badge,sw,one},i)=>{c.style.opacity=ramp(t,.1+i*.04,.3);
      if(one){const k=ramp(t,tOn,.3); sw.set(k,'var(--green)'); nm.style.color=k>.5?'var(--cream)':'#6b645b';
        c.style.boxShadow=`0 0 0 ${3*k}px rgba(143,214,148,.7),0 0 ${50*k}px rgba(143,214,148,.25)`;}
      else{sw.set(0); badge.style.opacity=ramp(t,tAsk+i*.05,.25);}});
    tags.forEach(({d,s})=>{d.style.opacity=ramp(t,s-.1,.3)});
    camIn(t);
  };
};
