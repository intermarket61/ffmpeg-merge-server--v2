// ================================================================== cost per usable page
SCENES.costChart=()=>{
  theme('dark');
  const head=el('div','abs',null,'<div class="kicker">30 days</div><div class="mega" style="font-size:88px;margin-top:14px">Cost per page <span style="color:var(--orange)">×3</span></div>');
  Object.assign(head.style,{left:'120px',top:'80px'});
  const cv=el('canvas','abs'); cv.width=1500;cv.height=560; Object.assign(cv.style,{left:'300px',top:'300px'});
  const g=cv.getContext('2d');
  const cost=d=>1+2*Math.pow(d/29,1.4), pages=d=> d<12?5:Math.max(1.6,5-(d-12)*.2);
  const chips=['1 · The expensive model on the heartbeat','2 · A fresh thread on every run'].map((x,i)=>{
    const c=el('div','abs',null,x); Object.assign(c.style,{left:(300+i*720)+'px',top:'900px',padding:'18px 28px',borderRadius:'16px',background:'#221f1b',fontWeight:900,fontSize:'32px',boxShadow:'0 0 0 1px rgba(255,255,255,.08)'});return c});
  const legend=el('div','abs',null,'<span style="color:var(--orange)">━ cost per usable page</span> &nbsp;&nbsp; <span style="color:var(--green)">━ usable pages</span>');
  Object.assign(legend.style,{left:'1200px',top:'130px',fontWeight:700,fontSize:'26px'});
  const camIn=cam(.2,240); const tl=tally();
  const twoAt=S.lines[1].t0, drawEnd=S.lines[0].t1||twoAt;
  return t=>{
    head.style.opacity=ramp(t,0,.5); legend.style.opacity=ramp(t,.3,.5);
    const p=clamp((t-.3)/(drawEnd-.3));
    g.clearRect(0,0,1500,560);
    g.strokeStyle='#2a2622'; g.lineWidth=2;
    for(let i=0;i<=4;i++){g.beginPath();g.moveTo(0,40+i*120);g.lineTo(1500,40+i*120);g.stroke()}
    const X=d=>20+d/29*1460, Yc=v=>520-(v-1)/2*440, Yp=v=>520-(v/5)*440;
    const upto=29*p;
    const line=(f,Y,col)=>{g.strokeStyle=col; g.lineWidth=7; g.shadowColor=col; g.shadowBlur=18; g.beginPath();
      for(let d=0;d<=upto;d+=.25){const y=Y(f(d)); d===0?g.moveTo(X(d),y):g.lineTo(X(d),y)} g.stroke(); g.shadowBlur=0};
    line(pages,Yp,'#8fd694'); line(cost,Yc,'#ff5a1f');
    // crossing point
    let cx=null; for(let d=0;d<29;d+=.1){if(Yc(cost(d))<=Yp(pages(d))){cx=d;break}}
    if(cx!=null && upto>cx){const k=ramp(t,.3+(drawEnd-.3)*cx/29,.5);
      g.fillStyle=`rgba(255,255,255,${k})`; g.shadowColor='#fff'; g.shadowBlur=30*k; g.beginPath(); g.arc(X(cx),Yc(cost(cx)),14,0,7); g.fill(); g.shadowBlur=0;}
    chips.forEach((c,i)=>{const s=twoAt+.2+i*.35; c.style.opacity=ramp(t,s,.3); c.style.transform=`translateY(${(1-spring((t-s)/.6))*40}px)`});
    camIn(t); tl(t);
  };
};
