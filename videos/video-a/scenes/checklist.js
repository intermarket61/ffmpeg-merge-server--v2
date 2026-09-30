// ================================================================== what a brief must carry
SCENES.checklist=()=>{
  theme('paper');
  const head=el('div','abs serif'); Object.assign(head.style,{left:'470px',top:'100px',fontSize:'84px',lineHeight:'1.02',color:'var(--ink)'});
  head.innerHTML='Every brief carries<br><i style="color:#8a7b68">four things.</i>';
  const sheet=el('div','sheet'); Object.assign(sheet.style,{left:'470px',top:'330px',width:'1150px'});
  const rows=[['goal','The goal'],['inputs','The inputs'],['format','The format of the inputs'],['finished','What finished looks like']].map(([w,label])=>{
    const r=el('div','row',sheet,`<span class="bx" style="width:44px;height:44px;border-radius:12px;border:3px solid #cfc4b2;margin-right:28px;display:grid;place-items:center;color:#fff;font-weight:900;font-size:28px"></span><span style="font-weight:900">${label}</span>`);
    return [wordAt(0,w),r.querySelector('.bx')]});
  const foot=el('div','abs serif',null,'…for a reader with <i style="color:var(--orange)">nothing else in front of them.</i>'); Object.assign(foot.style,{left:'474px',top:'880px',fontSize:'50px',color:'var(--ink)'});
  const face=el('div','cam'); Object.assign(face.style,{left:'70px',bottom:'auto',top:'330px',width:'340px',height:'400px',boxShadow:'0 40px 80px rgba(60,40,20,.3),0 0 0 6px #fbf8f2'});
  const c=el('canvas','',face); c.width=340;c.height=400; faceCanvases.push({canvas:c,kind:'bubble'});
  const tl=tally(); const footAt=wordAt(0,'nothing');
  return t=>{
    head.style.opacity=ramp(t,0,.5);
    sheet.style.transform=`translateY(${(1-spring(t/.9))*120}px)`; sheet.style.opacity=clamp(t*3);
    for(const [s,bx] of rows){const on=t>=s; bx.style.background=on?'var(--orange)':'transparent'; bx.style.borderColor=on?'var(--orange)':'#cfc4b2';
      bx.textContent=on?'✓':''; bx.style.transform=`scale(${on?lerp(1.5,1,ramp(t,s,.35)):1})`;}
    foot.style.opacity=ramp(t,footAt-.1,.5);
    face.style.transform=`translateX(${(1-spring((t-.2)/.9))*-420}px)`;
    tl(t);
  };
};
