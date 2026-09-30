// 0:17 — a month of runs flying past on a tilted wall
SCENES.scrub=()=>{
  stage.style.background='#0c0b0a';
  const world=el('div','abs'); Object.assign(world.style,{left:'50%',top:'50%',width:'0',height:'0',perspective:'1600px'});
  const wall=el('div','abs',world); Object.assign(wall.style,{left:'-900px',top:'-540px',width:'1800px',transformStyle:'preserve-3d'});
  const r=rng(5), agents=[['Scout','#7fc4d6','RESEARCH'],['Ridge','#ffb13d','JUDGMENT'],['Atlas','#8fd694','DESIGN']];
  const cards=[]; const cols=5, total=260;
  for(let i=0;i<total;i++){
    const day=1+Math.floor(i/(total/30)); const ag=i%9===0?agents[1+(i%2)]:agents[0];
    const c=el('div','runcard',wall,
      `<div class="d">Day ${String(day).padStart(2,'0')}</div><div class="m">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(day-1)%7]} ${String(7+(i*2)%16).padStart(2,'0')}:${r()<.5?'00':'30'} · ${ag[0]}</div>
       <span class="s" style="background:${ag[1]};box-shadow:0 0 12px ${ag[1]}"></span><span class="a" style="color:${ag[1]}">${ag[2]}</span>`);
    c.style.left=((i%cols)*360)+'px'; c.style.top=(Math.floor(i/cols)*140)+'px';
    cards.push(c);
  }
  const fog=el('div','fill'); fog.style.background='linear-gradient(#0c0b0a 0%,transparent 26%,transparent 70%,#0c0b0a 100%)';
  const head=el('div','abs'); Object.assign(head.style,{left:'110px',top:'90px'});
  head.innerHTML='<div class="kicker">Thread history</div><div class="mega" style="font-size:120px;margin-top:14px"><span id="rc">0</span> runs</div>';
  const rc=head.querySelector('#rc');
  const camIn=cam(.1);
  const rows=Math.ceil(total/cols), travel=(rows-7)*140;
  return t=>{
    const k=inOut(t/S.duration);
    wall.style.transform=`rotateX(34deg) rotateZ(-10deg) translateY(${-k*travel}px)`;
    // motion blur proportional to speed
    const v=Math.abs(inOut((t+.03)/S.duration)-k)/.03*travel;
    wall.style.filter=`blur(${Math.min(5,v/900)}px)`;
    rc.textContent=Math.round(k*total);
    head.style.opacity=ramp(t,.1,.5);
    camIn(t);
  };
};
