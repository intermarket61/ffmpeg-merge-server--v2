// ================================================================== funnel that never narrows
SCENES.funnel=()=>{
  theme('dark');
  const head=el('div','abs',null,'<div class="kicker">Ridge · judgment</div><div class="mega" style="font-size:88px;margin-top:14px">5 in. <span style="color:var(--orange)">5 out.</span> Every week.</div>');
  Object.assign(head.style,{left:'120px',top:'80px'});
  const svgNS='http://www.w3.org/2000/svg';
  const weeks=[1,2,3].map((w,i)=>{
    const x0=440+i*470, box=el('div','abs'); Object.assign(box.style,{left:(x0-170)+'px',top:'290px',width:'340px',height:'560px'});
    const svg=document.createElementNS(svgNS,'svg'); svg.setAttribute('width',340);svg.setAttribute('height',560); box.appendChild(svg);
    svg.innerHTML=`<path d="M20 90 L320 90 L210 330 L210 440 L130 440 L130 330 Z" fill="#1d1a17" stroke="#3a342e" stroke-width="3"/>`;
    const lab=el('div','',box,`Week ${w}`); Object.assign(lab.style,{position:'absolute',left:0,right:0,top:'500px',textAlign:'center',fontWeight:900,fontSize:'34px',color:'var(--mute)'});
    const dots=[...Array(5)].map(k=>{const c=document.createElementNS(svgNS,'circle');c.setAttribute('r',18);c.setAttribute('fill','#ffb13d');svg.appendChild(c);return c});
    return {dots,lab};
  });
  const cap=el('div','abs serif',null,'Never once <i style="color:var(--orange)">shorter.</i>'); Object.assign(cap.style,{left:0,right:0,top:'900px',textAlign:'center',fontSize:'64px'});
  const camIn=cam(.2,240); const tl=tally();
  const starts=[S.lines[1].t0, S.lines[1].t0+.8, .2]; const capAt=wordAt(2,'never');
  return t=>{
    head.style.opacity=ramp(t,0,.5);
    weeks.forEach((w,i)=>{
      const s=starts[i];
      w.lab.style.color= t>s+1.4?'var(--cream)':'var(--mute)';
      w.dots.forEach((c,k)=>{
        const p=clamp((t-s-k*.12)/1.3); const e=inOut(p);
        const xTop=70+k*50, xOut=70+k*50;               // same spread out as in: nothing narrows
        const y= p<=0?40: p<.5? lerp(40,300,e*2): lerp(300,480,(e-.5)*2);
        const x= p<.5? lerp(xTop,170,e*1.6>1?1:e*1.6) : lerp(170,xOut,(e-.5)*2);
        c.setAttribute('cx',x); c.setAttribute('cy',y); c.style.opacity=p>0?1:.25;
      });
    });
    cap.style.opacity=ramp(t,capAt-.1,.5);
    camIn(t); tl(t);
  };
};
