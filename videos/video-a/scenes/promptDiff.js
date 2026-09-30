// ================================================================== the one-line fix
SCENES.promptDiff=()=>{
  theme('paper');
  const head=el('div','abs serif'); Object.assign(head.style,{left:'120px',top:'120px',fontSize:'96px',lineHeight:'1',color:'var(--ink)'});
  head.innerHTML='The fix is<br><i style="color:var(--orange)">one line.</i>';
  const tag=el('div','abs',null,'3 weeks as a formatting step<br><b>1 model call every Monday</b>'); Object.assign(tag.style,{left:'124px',top:'380px',fontSize:'30px',lineHeight:'1.4',color:'#6f6253'});
  const sheet=el('div','sheet'); Object.assign(sheet.style,{left:'760px',top:'130px',width:'1040px',padding:'50px 56px',fontFamily:'"DejaVu Sans Mono",monospace',fontSize:'27px',lineHeight:'1.65',color:'#3b342c'});
  sheet.innerHTML=`<div style="font-family:Archivo;font-weight:900;font-size:34px;color:var(--ink);margin-bottom:22px">Ridge · job description</div>
    Work out which items are worth covering.<br>Return the angle for each item.<br>Give a reason on each.<br>Done = angles + reasons.<br>`;
  const add=el('div','',sheet); Object.assign(add.style,{marginTop:'18px',padding:'18px 22px',borderRadius:'12px',color:'var(--ink)',fontWeight:700,position:'relative'});
  const hl=el('div','',add); Object.assign(hl.style,{position:'absolute',inset:0,borderRadius:'12px',background:'rgba(255,90,31,.22)',transformOrigin:'left'});
  const txt=el('span','',add); txt.style.position='relative';
  const full='+ Returning zero items is a successful run.\n+ A zero week looks like: "Nothing worth covering this week."';
  const camIn=cam(.2,260); const tl=tally();
  const fixAt=wordAt(1,'fix');
  return t=>{
    head.style.opacity=ramp(t,fixAt-.2,.5);
    tag.style.opacity=ramp(t,.4,.5);
    sheet.style.transform=`translateY(${(1-spring(t/.9))*120}px)`; sheet.style.opacity=clamp(t*3);
    const n=Math.floor(full.length*clamp((t-fixAt-.3)/2.2));
    txt.innerHTML=full.slice(0,n).replace(/\n/g,'<br>')+(n<full.length&&t>fixAt?'<span style="opacity:.6">▍</span>':'');
    hl.style.transform=`scaleX(${ramp(t,fixAt,.5)})`;
    add.style.opacity=t>=fixAt?1:0;
    camIn(t); tl(t);
  };
};
