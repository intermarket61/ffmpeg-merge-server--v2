// ================================================================== run chain stops amber
SCENES.runChain=()=>{
  theme('dark');
  const grid=el('div','fill'); grid.style.background='radial-gradient(circle,#2a2520 1.6px,transparent 1.8px) 0 0/44px 44px';
  const head=el('div','abs',null,'<div class="kicker">Week two · Monday 07:00</div><div class="mega" style="font-size:92px;margin-top:14px">Everything ran.</div>');
  Object.assign(head.style,{left:'120px',top:'96px'});
  const names=[['Scout','research'],['Ridge','judgment'],['Atlas','design'],['Publish','stopped']];
  const X=[120,560,1000,1440], Y=430;
  const nodes=names.map(([n],i)=>{const d=panel(null,{left:X[i]+'px',top:Y+'px',width:'360px',height:'220px',padding:'34px'});
    d.innerHTML=`<div style="font-weight:900;font-size:54px">${n}</div><div class="st" style="margin-top:18px;font-weight:700;font-size:24px;letter-spacing:.14em;color:var(--mute)">QUEUED</div>
      <div class="ring" style="position:absolute;right:30px;top:36px;width:34px;height:34px;border-radius:50%;background:#3a342e"></div>`;return d});
  const links=[0,1,2].map(i=>{const l=el('div','abs');Object.assign(l.style,{left:(X[i]+360)+'px',top:(Y+108)+'px',height:'5px',width:'80px',background:'#3a342e',borderRadius:'3px'});return l});
  const wait=el('div','abs',null,'Waiting for approval'); Object.assign(wait.style,{left:'1440px',top:(Y+250)+'px',width:'360px',textAlign:'center',fontWeight:900,fontSize:'30px',color:'#ffb13d'});
  const cap=el('div','abs serif',null,'Not an error. <i>The correct setting.</i>'); Object.assign(cap.style,{left:'120px',top:'820px',fontSize:'54px'});
  const camIn=cam(.2,260); const tl=tally();
  const times=names.map(([_,w])=>wordAt(0,w)); const setAt=S.lines[1].t0;
  return t=>{
    head.style.opacity=ramp(t,0,.5);
    nodes.forEach((d,i)=>{
      const s=times[i], ok=t>=s, st=d.querySelector('.st'), ring=d.querySelector('.ring');
      d.style.opacity=.35+.65*ramp(t,s-.4,.4);
      if(i<3){
        st.textContent=ok?'✓ COMPLETED':'QUEUED'; st.style.color=ok?'var(--green)':'var(--mute)';
        ring.style.background=ok?'var(--green)':'#3a342e'; ring.style.boxShadow=ok?'0 0 24px var(--green)':'none';
        d.style.boxShadow= ok?'0 0 0 2px rgba(143,214,148,.6),0 40px 80px rgba(0,0,0,.5)':'0 0 0 1px rgba(255,255,255,.07)';
      }else{
        const pulse=.5+.5*Math.sin((t-s)*5);
        st.textContent=ok?'PAUSED':'QUEUED'; st.style.color=ok?'#ffb13d':'var(--mute)';
        ring.style.background=ok?'#ffb13d':'#3a342e'; ring.style.boxShadow=ok?`0 0 ${10+30*pulse}px #ffb13d`:'none';
        d.style.boxShadow= ok?`0 0 0 ${2+2*pulse}px rgba(255,177,61,.8),0 0 ${60*pulse}px rgba(255,177,61,.35)`:'0 0 0 1px rgba(255,255,255,.07)';
      }
      d.style.transform=`scale(${1+.04*(1-ramp(t,s,.4))*(t>=s?1:0)})`;
    });
    links.forEach((l,i)=>{const on=t>=times[i]; l.style.background=on?'var(--green)':'#3a342e'; l.style.boxShadow=on?'0 0 14px var(--green)':'none'});
    wait.style.opacity=t>=times[3]?.6+.4*Math.sin((t-times[3])*5):0;
    cap.style.opacity=ramp(t,setAt-.1,.5);
    camIn(t); tl(t);
  };
};
