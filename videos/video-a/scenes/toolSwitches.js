// ================================================================== the switch nothing is wired to
SCENES.toolSwitches=()=>{
  theme('dark');
  const head=el('div','abs',null,'<div class="kicker">Scout · tools</div><div class="mega" style="font-size:88px;margin-top:14px">One switch, <span style="color:var(--orange)">no job.</span></div>');
  Object.assign(head.style,{left:'470px',top:'80px'});
  const box=panel(null,{left:'470px',top:'300px',width:'1250px',padding:'20px 50px'});
  const tools=[['Web search','search','used every run'],['Browser','browser','used most runs'],['Publish page','publishing','used: never'],['Email',null,''],['Files',null,'']];
  const rows=tools.map(([n,w,use],i)=>{const r=el('div','',box); Object.assign(r.style,{display:'flex',alignItems:'center',height:'112px',borderTop:i?'1px solid #2a2622':'0',fontSize:'38px'});
    r.innerHTML=`<span style="font-weight:900;flex:1">${n}</span><span class="use" style="font-size:26px;font-weight:700;margin-right:40px;color:var(--mute)">${use}</span>
      <span class="sw" style="width:104px;height:56px;border-radius:28px;background:#2a2622;position:relative;display:inline-block"><span class="kn" style="position:absolute;top:6px;left:6px;width:44px;height:44px;border-radius:50%;background:#6b645b"></span></span>`;
    return {r,w:w?wordAt(0,w):null,danger:i===2}});
  const days=el('div','abs serif',null,'Switched on for <b style="font-family:Archivo;font-weight:900">30 days</b>. Used <b style="font-family:Archivo;font-weight:900;color:var(--orange)">0 times</b>.');
  Object.assign(days.style,{left:'474px',top:'930px',fontSize:'50px'});
  const camIn=cam(.2,260); const tl=tally(); const daysAt=S.lines[1].t0;
  return t=>{
    head.style.opacity=ramp(t,0,.5);
    rows.forEach(({r,w,danger},i)=>{
      const on=w!=null&&t>=w, k=w!=null?ramp(t,w,.3):0;
      const sw=r.querySelector('.sw'), kn=r.querySelector('.kn'), use=r.querySelector('.use');
      kn.style.left=(6+48*k)+'px'; kn.style.background=on?'#fff':'#6b645b';
      sw.style.background= on?(danger?'var(--orange)':'#3f7f52'):'#2a2622';
      const pulse=.5+.5*Math.sin(t*5);
      sw.style.boxShadow= on&&danger?`0 0 ${20+30*pulse}px rgba(255,90,31,.8)`:'none';
      use.style.opacity=on?1:.0; use.style.color=danger?'var(--orange)':'var(--green)';
      r.style.opacity= w==null?.45:1;
    });
    days.style.opacity=ramp(t,daysAt-.1,.5);
    camIn(t); tl(t);
  };
};
