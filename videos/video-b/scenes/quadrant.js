// 1:15 — "runs often" against "can reach people": the dangerous quadrant is empty
SCENES.quadrant=()=>{
  theme('dark');
  const X0=560,Y0=900,W=1180,H=720;   // origin bottom-left of the plot
  const svg=el('div','fill'); svg.innerHTML=`<svg width="1920" height="1080" style="position:absolute;inset:0">
    <line class="ax" x1="${X0}" y1="${Y0}" x2="${X0+W}" y2="${Y0}" stroke="#8d857b" stroke-width="4"/>
    <line class="ay" x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0-H}" stroke="#8d857b" stroke-width="4"/>
    <line x1="${X0+W/2}" y1="${Y0}" x2="${X0+W/2}" y2="${Y0-H}" stroke="#2a2622" stroke-width="2" stroke-dasharray="8 10"/>
    <line x1="${X0}" y1="${Y0-H/2}" x2="${X0+W}" y2="${Y0-H/2}" stroke="#2a2622" stroke-width="2" stroke-dasharray="8 10"/></svg>`;
  const zone=el('div','abs'); Object.assign(zone.style,{left:(X0+W/2+14)+'px',top:(Y0-H+14)+'px',width:(W/2-28)+'px',height:(H/2-28)+'px',borderRadius:'26px',border:'4px dashed var(--amber)',display:'grid',placeItems:'center',textAlign:'center'});
  zone.innerHTML='<div><div class="mega" style="font-size:64px;color:var(--amber)">Never build<br>this agent.</div><div class="kicker" style="font-size:18px;letter-spacing:.16em;white-space:nowrap;color:var(--mute);margin-top:16px">runs constantly · reaches people</div></div>';
  const xl=el('div','abs kicker',null,'Runs often →'); Object.assign(xl.style,{left:(X0+W-300)+'px',top:(Y0+26)+'px',width:'300px',textAlign:'right',color:'var(--cream)'});
  const yl=el('div','abs kicker',null,'Can reach people →'); Object.assign(yl.style,{left:(X0-70)+'px',top:(Y0-H+340)+'px',transformOrigin:'0 0',transform:'rotate(-90deg)',color:'var(--cream)',whiteSpace:'nowrap'});
  const dots=[['Research','every 30 min',.82,.18,IN],['Design','Mondays',.28,.2,IN],['Email','when you\'re there',.2,.8,OUT]].map(([n,s,fx,fy,c],i)=>{
    const d=el('div','abs'); Object.assign(d.style,{left:(X0+fx*W-22)+'px',top:(Y0-fy*H-22)+'px'});
    d.innerHTML=`<div style="width:44px;height:44px;border-radius:50%;background:${c};box-shadow:0 0 30px ${c}"></div><div style="position:absolute;left:62px;top:-8px;white-space:nowrap"><div style="font-weight:900;font-size:38px">${n}</div><div style="font-size:22px;color:var(--mute);font-weight:700">${s}</div></div>`;
    return pop(d,.4+i*.25,40)});
  const tX=wordAt(0,'constantly'), tY=wordAt(0,'reach'), tN=wordAt(1,'never');
  const camIn=cam(.2,250);
  return t=>{
    svg.style.opacity=ramp(t,0,.5);
    xl.style.opacity=lerp(.5,1,ramp(t,tX,.3)); xl.style.color=t>=tX?'var(--amber)':'var(--cream)';
    yl.style.opacity=lerp(.5,1,ramp(t,tY,.3)); yl.style.color=t>=tY?'var(--amber)':'var(--cream)';
    dots.forEach(d=>d(t));
    const z=ramp(t,Math.min(tX,tY)+.6,.6); zone.style.opacity=z*lerp(.45,1,ramp(t,tN,.4));
    zone.firstChild.style.opacity=ramp(t,tN-.1,.4); zone.style.transform=`scale(${1+.03*(1-spring((t-tN)/.6))*(t>=tN?1:0)})`;
    zone.style.boxShadow=t>=tN?`0 0 ${30+20*Math.sin(t*3)}px rgba(255,177,61,.25)`:'none';
    camIn(t);
  };
};
