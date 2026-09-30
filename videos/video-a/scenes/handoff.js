// ================================================================== the handoff loses its link
SCENES.handoff=()=>{
  theme('dark');
  const grid=el('div','fill'); grid.style.background='radial-gradient(circle,#2a2520 1.6px,transparent 1.8px) 0 0/44px 44px';
  const names=[['Scout','#7fc4d6'],['Ridge','#ffb13d'],['Atlas','#8fd694']], X=[160,780,1400];
  names.forEach(([n,c],i)=>{const d=panel(null,{left:X[i]+'px',top:'110px',width:'360px',height:'120px',padding:'30px 34px'});
    d.innerHTML=`<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${c};box-shadow:0 0 14px ${c};margin-right:16px"></span><b style="font-weight:900;font-size:46px">${n}</b>`});
  [0,1].forEach(i=>{const l=el('div','abs');Object.assign(l.style,{left:(X[i]+370)+'px',top:'168px',width:'250px',height:'4px',background:'var(--orange)',boxShadow:'0 0 14px var(--orange)'})});
  const card=el('div','abs'); Object.assign(card.style,{width:'560px',top:'330px',borderRadius:'24px',background:'var(--cream)',color:'var(--ink)',padding:'34px 38px',boxShadow:'0 40px 80px rgba(0,0,0,.5)'});
  card.innerHTML=`<div class="f" style="font-weight:900;font-size:36px">Browser agent opens its beta</div>
    <div class="f" style="font-size:24px;color:#6f6253;margin-top:10px">Day 4</div>
    <div class="f para serif" style="font-size:28px;margin-top:14px;color:#3b342c;display:none">Five launches this week: a coding model, a scheduling SDK, a 4K video mode, a browser agent beta and faster voice.</div>
    <div class="f note serif" style="font-size:26px;margin-top:12px;color:#3b342c">Worth a look for the agents series.</div>`;
  const link=el('div','abs',null,'🔗 source ↗ launch post'); Object.assign(link.style,{padding:'14px 22px',borderRadius:'14px',background:'#1e6fd6',color:'#fff',fontWeight:900,fontSize:'26px',boxShadow:'0 20px 40px rgba(0,0,0,.4)'});
  const ghost=el('div','abs',null,'still in the thread'); Object.assign(ghost.style,{left:X[0]+'px',top:'250px',fontWeight:700,fontSize:'24px',color:'#7fb6ff',letterSpacing:'.04em'});
  const miss=el('div','abs',null,'✕ not in the handoff'); Object.assign(miss.style,{left:(X[1]-40)+'px',top:'250px',fontWeight:900,fontSize:'28px',color:'var(--orange)'});
  const page=el('div','abs',null,`<div style="font-weight:900;font-size:30px">AI launches, week 2</div><div style="margin-top:14px;font-size:24px;color:#6f6253">Browser agent opens its beta</div><div style="margin-top:12px;padding:10px 16px;border:2px dashed var(--orange);border-radius:10px;color:var(--orange);font-weight:900;font-size:24px">source: —</div>`);
  Object.assign(page.style,{left:X[2]+'px',top:'330px',width:'420px',borderRadius:'22px',background:'#fbf8f2',color:'var(--ink)',padding:'30px'});
  const cap=el('div','abs serif',null,'Nothing in the chain did anything <i style="color:var(--orange)">wrong.</i>'); Object.assign(cap.style,{left:'480px',top:'900px',fontSize:'56px'});
  const camIn=cam(.2,250); const tl=tally();
  const sumAt=wordAt(0,'summarised'), linksAt=S.lines[1].t0, missAt=wordAt(2,'handoff'), atlasAt=S.lines[3].t0, wrongAt=wordAt(3,'wrong');
  const para=card.querySelector('.para'), note=card.querySelector('.note'), f=card.querySelectorAll('.f');
  return t=>{
    // card rides the chain: Scout -> Ridge at summarise, Ridge -> Atlas at the last line
    const hop1=ramp(t,sumAt+.4,1.0,inOut), hop2=ramp(t,atlasAt+.3,1.0,inOut);
    const x= lerp(lerp(X[0]-40,X[1]-40,hop1),X[2]-40,hop2);
    card.style.left=x+'px'; card.style.opacity=clamp(t*4)*(1-ramp(t,atlasAt+1.1,.4));
    card.style.transform=`translateY(${(1-spring(t/.8))*100}px) rotate(${Math.sin(hop1*Math.PI)*-3+Math.sin(hop2*Math.PI)*-3}deg)`;
    const summ=t>=sumAt; para.style.display=summ?'block':'none'; f[0].style.display=summ?'none':'block'; f[1].style.display=summ?'none':'block'; note.style.display=summ?'none':'block';
    // the link falls off on the first hop
    const drop=ramp(t,sumAt+.5,1.1,x=>x*x);
    link.style.left=(X[0]+(1-drop)*0+drop*120)+'px'; link.style.top=(640+drop*420)+'px';
    link.style.transform=`rotate(${drop*38}deg)`; link.style.opacity=(t<.2?0:1)*(1-ramp(t,sumAt+1.3,.3));
    // ...and reappears as a ghost back in Scout's thread
    ghost.style.opacity=ramp(t,linksAt,.4);
    miss.style.opacity=ramp(t,missAt-.1,.3); miss.style.transform=`scale(${lerp(1.3,1,ramp(t,missAt-.1,.4))})`;
    page.style.opacity=ramp(t,atlasAt+1.1,.4); page.style.transform=`translateY(${(1-spring((t-atlasAt-1.1)/.7))*60}px)`;
    cap.style.opacity=ramp(t,wrongAt-.6,.5);
    camIn(t); tl(t);
  };
};
