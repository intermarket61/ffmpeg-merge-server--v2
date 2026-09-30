// 1:24 — cream paper: the schedule, then the deal
SCENES.schedule=()=>{
  stage.className='paper'; stage.style.background='var(--paper)';
  const head=el('div','abs serif'); Object.assign(head.style,{left:'470px',top:'110px',fontSize:'78px',lineHeight:'1.05',color:'var(--ink)',width:'1300px'});
  head.innerHTML='Scout never sleeps.<br><i style="color:#8a7b68">The others wake on Mondays.</i>';
  const sheet=el('div','sheet'); Object.assign(sheet.style,{left:'470px',top:'340px',width:'1150px'});
  const rows=[['Scout','#1e8fb0','interval · noticing is the job','Every 30 min','var(--orange)','#fff'],
              ['Ridge','#d98a00','weekly · waits for new items','Mon · 07:00','#15120f','#fff'],
              ['Atlas','#4a9a50','weekly · waits for survivors','Mon · 07:00','#15120f','#fff']]
    .map(([n,c,k,w,bgc,fg])=>el('div','row',sheet,`<span class="dot" style="background:${c}"></span><span class="nm">${n}</span><span class="kd">${k}</span><span class="when" style="background:${bgc};color:${fg}">${w}</span>`));
  const deal=el('div','abs mega'); Object.assign(deal.style,{left:'470px',top:'770px',fontSize:'128px',color:'var(--ink)'});
  deal.innerHTML='4 weeks <span style="color:var(--orange)">→</span> 4 pages';
  const face=el('div','cam'); Object.assign(face.style,{left:'70px',bottom:'auto',top:'340px',width:'340px',height:'400px',boxShadow:'0 40px 80px rgba(60,40,20,.3),0 0 0 6px #fbf8f2'});
  const c=el('canvas','',face); c.width=340;c.height=400; faceCanvases.push({canvas:c,kind:'bubble'});
  const tl=tally(0);
  const dealAt=wordAt(0,'deal'), sched=S.lines[0].t0;
  return t=>{
    head.style.opacity=ramp(t,0,.5); head.style.transform=`translateY(${(1-ramp(t,0,.6))*24}px)`;
    const sk=spring(t/.9); sheet.style.transform=`translateY(${(1-sk)*120}px)`; sheet.style.opacity=clamp(t*3);
    rows.forEach((r,i)=>{const s=sched+.4+i*1.1; const k=ramp(t,s,.35);
      r.querySelector('.when').style.transform=`scale(${lerp(.6,1,spring((t-s)/.6))})`;
      r.querySelector('.when').style.opacity=k;});
    const dk=spring((t-dealAt)/.7); deal.style.opacity=clamp((t-dealAt)*5); deal.style.transform=`translateY(${(1-dk)*60}px)`;
    const fk=spring((t-.2)/.9); face.style.transform=`translateX(${(1-fk)*-420}px)`;
    tl(t);
  };
};
