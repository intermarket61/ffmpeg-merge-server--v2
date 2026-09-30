// 0:00 — 1 → 30 over a sunburst, the number popping on every tick
SCENES.counter=()=>{
  stage.style.background='radial-gradient(ellipse at 50% 48%,#241510 0%,#0c0b0a 62%)';
  const burst=el('canvas','fill'); burst.width=1920;burst.height=1080;
  const bg=burst.getContext('2d');
  const r=rng(30), rays=[...Array(140)].map(()=>({a:r()*Math.PI*2,l:.3+r()*.7,w:.6+r()*1.8,s:r()}));
  const num=el('div','abs mega'); Object.assign(num.style,{left:0,right:0,top:'250px',textAlign:'center',fontSize:'470px'});
  const lab=el('div','abs kicker'); Object.assign(lab.style,{left:0,right:0,top:'760px',textAlign:'center',fontSize:'34px',letterSpacing:'.42em'});
  lab.textContent='Days unsupervised';
  const bar=el('div','abs'); Object.assign(bar.style,{left:'660px',width:'600px',top:'830px',height:'6px',borderRadius:'3px',background:'#2c241e'});
  const fillb=el('div','abs',bar); Object.assign(fillb.style,{left:0,top:0,bottom:0,borderRadius:'3px',background:'var(--orange)',boxShadow:'0 0 20px var(--orange)'});
  const camIn=cam(1.0);
  const tickEnd=S.lines[1].t0+1.5;
  return t=>{
    const p=clamp(t/tickEnd), day=t<tickEnd?1+Math.floor(29*inOut(p)):30;
    const since = t<tickEnd ? (t*29/tickEnd)%1 : (t-tickEnd);
    const pop = t<tickEnd ? 1+.05*(1-outCubic(since*3)) : 1+.12*(1-spring(since/0.8));
    num.textContent=day; num.style.transform=`scale(${pop})`;
    num.style.color= day===30?'#fff':'var(--cream)';
    num.style.textShadow= day===30?`0 0 ${60+40*Math.sin(t*3)}px rgba(255,90,31,.55)`:'none';
    fillb.style.width=((day-1)/29*100)+'%';
    const intro=ramp(t,0,1.2);
    num.style.opacity=intro; lab.style.opacity=ramp(t,.4,1);
    // sunburst
    bg.clearRect(0,0,1920,1080);
    const flare= day===30 ? 1+.8*(1-outCubic((t-tickEnd)/1.2)) : .55+.45*p;
    for(const ray of rays){
      const a=ray.a+t*.05*(ray.s-.5);
      const r0=150, r1=r0+ray.l*820*flare*intro;
      bg.strokeStyle=`rgba(255,${110+ray.s*60|0},50,${.12+.35*ray.s})`;
      bg.lineWidth=ray.w;
      bg.beginPath();bg.moveTo(960+Math.cos(a)*r0,470+Math.sin(a)*r0);bg.lineTo(960+Math.cos(a)*r1,470+Math.sin(a)*r1);bg.stroke();
    }
    camIn(t);
  };
};
