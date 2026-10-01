// 4:55 — the same request, three destinations, and how long until each is seen
SCENES.routes=()=>{
  theme('dark');
  const hd=heading('Where the request lands','Time until <span style="color:var(--blue)">seen.</span>',420,60,80);
  const req=panel(null,{left:'420px',top:'420px',width:'500px',padding:'34px 36px'});
  req.innerHTML=`<div style="display:flex;align-items:center;gap:16px"><span style="width:20px;height:20px;border-radius:50%;background:var(--amber);box-shadow:0 0 16px var(--amber)"></span><span style="font-weight:700;font-size:22px;color:var(--mute)">APPROVAL</span></div>
    <div style="font-weight:900;font-size:36px;margin-top:14px">Post weekly report?</div>
    <div class="exp" style="margin-top:26px;font-size:24px;font-weight:700;color:var(--mute)">valid for 24 h</div>
    <div style="margin-top:10px;height:10px;border-radius:5px;background:#2a2622"><div class="bar" style="height:100%;border-radius:5px;background:var(--amber)"></div></div>`;
  const bar=req.querySelector('.bar'), exp=req.querySelector('.exp');
  const lanes=[['Dashboard tab','~ 3 days','tab',null],['A channel you keep open','~ 20 minutes','channel','channel'],['Phone notification','~ 1 minute','phone','phone']].map(([n,tm,_,w],i)=>{
    const p=panel(null,{left:'1080px',top:(270+i*220)+'px',width:'760px',height:'170px',padding:'30px 40px',display:'flex',flexDirection:'column',justifyContent:'center'});
    p.innerHTML=`<div style="font-weight:900;font-size:40px">${n}</div><div class="tm" style="font-weight:700;font-size:30px;margin-top:8px;color:var(--mute)">seen in ${tm}</div>`;
    const ln=el('div','fill'); ln.innerHTML=`<svg width="1920" height="1080" style="position:absolute;inset:0"><path d="M920 530 C 1000 530, 1000 ${355+i*220}, 1080 ${355+i*220}" fill="none" stroke-width="4"/></svg>`;
    return {p,ln,w:w?wordAt(0,w):null,tm:p.querySelector('.tm'),dash:i===0}});
  const ended=chip(null,'run ended before anyone saw it','var(--mute)',{position:'absolute',left:'1440px',top:'334px',fontSize:'22px',zIndex:2});
  const tLook=wordAt(0,'look'), tValid=wordAt(1,'valid'), tEnds=wordAt(1,'ends');
  const camIn=cam(.2,240);
  return t=>{
    hd(t); req.style.opacity=ramp(t,.1,.4);
    lanes.forEach(({p,ln,w,tm,dash},i)=>{p.style.opacity=ramp(t,.3+i*.15,.4); ln.style.opacity=p.style.opacity;
      const good=w!=null&&t>=w;
      p.style.boxShadow=good?'0 0 0 3px rgba(127,196,214,.6),0 40px 80px rgba(0,0,0,.5)':'0 0 0 1px rgba(255,255,255,.07)';
      ln.querySelector('path').style.stroke=good?'var(--blue)':'#3a342e'; tm.style.color=good?'var(--blue)':'var(--mute)';
      if(dash) p.style.opacity=ramp(t,.3,.4)*lerp(1,.45,ramp(t,tLook,.5));});
    const v=ramp(t,tValid,S.duration-tValid,clamp); bar.style.width=(100*(1-v))+'%';
    exp.style.color=t>=tValid?'var(--amber)':'var(--mute)'; exp.textContent=t>=tValid?`expires in ${Math.max(0,Math.ceil(24*(1-v)))} h`:'valid for 24 h';
    ended.style.opacity=ramp(t,tEnds-.1,.3);
    camIn(t);
  };
};
