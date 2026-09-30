// ================================================================== alarms on the shape of the output
SCENES.alarms=()=>{
  theme('dark');
  const wall=el('div','abs'); Object.assign(wall.style,{left:'110px',top:'90px',width:'700px',height:'900px',overflow:'hidden',fontFamily:'Newsreader,serif',fontSize:'24px',lineHeight:'1.5',color:'#b9b0a4'});
  const r=rng(9); let txt='';
  for(let i=0;i<60;i++) txt+=['Item','Angle','Reason','Source','Cover','Summary'][i%6]+': '+['launch recap','worth covering','fresh angle','benchmark claim','editor note','week digest'][Math.floor(r()*6)]+' · '+['kept','kept','passed','kept'][Math.floor(r()*4)]+'<br>';
  wall.innerHTML=txt;
  const head=el('div','abs',null,'<div class="kicker">Don\'t audit the output</div><div class="mega" style="font-size:80px;margin-top:14px">Alarm on its <span style="color:var(--orange)">shape.</span></div>');
  Object.assign(head.style,{left:'900px',top:'90px'});
  const alarms=['a run produces nothing','the judgment step passes everything','a page ships without a source','a run costs more than $N'].map((a,i)=>{
    const d=el('div','abs'); Object.assign(d.style,{left:'900px',top:(330+i*150)+'px',width:'900px',display:'flex',alignItems:'center',gap:'28px'});
    d.innerHTML=`<span class="bell" style="width:30px;height:30px;border-radius:50%;background:#3a342e;flex:none"></span><span class="tx" style="font-family:'DejaVu Sans Mono',monospace;font-size:38px;font-weight:700"></span>`;
    return {d,full:'Tell me when '+a+'.',s:S.lines[i+1].t0,e:S.lines[i+1].t1}});
  const tl=tally(); const auditAt=wordAt(0,'audit');
  return t=>{
    const g=ramp(t,auditAt,1.0);
    wall.style.opacity=1-.75*g; wall.style.filter=`blur(${3*g}px) grayscale(1)`;
    wall.style.transform=`translateY(${-t*14}px)`;
    head.style.opacity=ramp(t,.1,.5);
    alarms.forEach(({d,full,s,e})=>{
      const n=Math.floor(full.length*clamp((t-s)/Math.max(.6,(e-s)*.9)));
      d.querySelector('.tx').textContent=t<s?'':full.slice(0,n);
      const done=n>=full.length, bell=d.querySelector('.bell');
      bell.style.background=done?'var(--orange)':(t>=s?'#6b645b':'#3a342e');
      bell.style.boxShadow=done?'0 0 24px var(--orange)':'none';
    });
    tl(t);
  };
};
