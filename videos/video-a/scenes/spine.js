// 0:44 — Scout → Ridge → Atlas, connectors glowing, each node on its sentence
SCENES.spine=()=>{
  stage.style.background='#0c0b0a';
  const grid=el('div','fill'); grid.style.background='radial-gradient(circle,#2a2520 1.6px,transparent 1.8px) 0 0/44px 44px';
  const cam3=el('div','fill');
  const head=el('div','abs',cam3); Object.assign(head.style,{left:'120px',top:'96px'});
  head.innerHTML='<div class="kicker">The team</div><div class="mega" style="font-size:96px;margin-top:14px">3 agents. <span style="color:var(--orange)">1 job each.</span></div>';
  const svgNS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(svgNS,'svg'); svg.setAttribute('width',1920);svg.setAttribute('height',1080);
  svg.style.position='absolute'; cam3.appendChild(svg);
  const defs=document.createElementNS(svgNS,'defs'); defs.innerHTML='<filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  svg.appendChild(defs);
  const data=[
    ['Scout','RESEARCH','#7fc4d6','S','What launched in AI. A source and a date on every item. Five, then stop.'],
    ['Ridge','JUDGMENT','#ffb13d','R','Which items are worth a video, and which are already saturated.'],
    ['Atlas','DESIGN','#8fd694','A','A page with a cover image per item, ready for an editor.'],
  ];
  const X=[200,760,1320], Y=280, NW=400;
  const nodes=data.map(([n,role,col,ic,job],i)=>{
    const d=el('div','node',cam3,`<div class="ic" style="background:${col}">${ic}</div><h3>${n}</h3><div class="role" style="color:${col}">${role}</div><p>${job}</p>`);
    d.style.left=X[i]+'px'; d.style.top=Y+'px'; return d;
  });
  const links=[0,1].map(i=>{
    const p=document.createElementNS(svgNS,'path');
    const x0=X[i]+NW, x1=X[i+1], y=Y+150;
    p.setAttribute('d',`M${x0+10} ${y} C ${x0+70} ${y}, ${x1-70} ${y}, ${x1-10} ${y}`);
    p.setAttribute('stroke','#ff5a1f');p.setAttribute('stroke-width','5');p.setAttribute('fill','none');p.setAttribute('filter','url(#glow)');
    svg.appendChild(p);
    const dot=document.createElementNS(svgNS,'circle');dot.setAttribute('r','9');dot.setAttribute('fill','#fff');dot.setAttribute('filter','url(#glow)');svg.appendChild(dot);
    const len=x1-x0-20; p.style.strokeDasharray=len; return {p,dot,x0:x0+10,len,y};
  });
  const camIn=cam(.3,270);
  const tl=tally(0);
  return t=>{
    head.style.opacity=ramp(t,.1,.6); head.style.transform=`translateY(${(1-ramp(t,.1,.6))*30}px)`;
    nodes.forEach((d,i)=>{
      const s=S.lines[i+1].t0-.1, k=spring((t-s)/.8);
      d.style.opacity=clamp((t-s)*3);
      d.style.transform=`translateY(${(1-k)*80}px) scale(${lerp(.9,1,clamp(k))})`;
      const lit= t>=s && (i===2 || t<S.lines[i+2].t0-.1);
      d.style.boxShadow= lit?`0 0 0 2px ${data[i][2]},0 0 70px ${data[i][2]}55,0 40px 80px rgba(0,0,0,.5)`:'0 0 0 1px rgba(255,255,255,.07),0 40px 80px rgba(0,0,0,.5)';
    });
    links.forEach((L,i)=>{
      const s=S.lines[i+2].t0-.35, g=ramp(t,s,.6);
      L.p.style.strokeDashoffset=L.len*(1-g);
      const ph=((t-s)*.7)%1; L.dot.setAttribute('cx',L.x0+L.len*ph); L.dot.setAttribute('cy',L.y);
      L.dot.style.opacity= g>=1?1:0;
    });
    // slow camera drift
    const k=inOut(t/S.duration);
    cam3.style.transform=`scale(${lerp(1.0,1.05,k)}) translateX(${lerp(8,-8,k)}px)`;
    camIn(t); tl(t);
  };
};
