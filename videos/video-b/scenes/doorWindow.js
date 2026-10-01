// 4:00 — a closed wall with one window, against an open door with a list pinned beside it
SCENES.doorWindow=()=>{
  theme('dark');
  // left: the wall
  const wall=el('div','abs'); Object.assign(wall.style,{left:'340px',top:'230px',width:'560px',height:'620px',borderRadius:'18px',
    background:'repeating-linear-gradient(0deg,#1f1b17 0 58px,#15120f 58px 62px),#1f1b17',boxShadow:'0 0 0 2px #2a2622'});
  const win=el('div','abs',wall); Object.assign(win.style,{left:'200px',top:'170px',width:'160px',height:'200px',borderRadius:'12px',background:'linear-gradient(180deg,#bfe6f0,#7fc4d6)',boxShadow:'0 0 60px rgba(127,196,214,.6)'});
  const wl=el('div','abs',null,'<div class="kicker">The pattern</div><div class="mega" style="font-size:64px;margin-top:10px">One window.</div>'); Object.assign(wl.style,{left:'340px',top:'880px'});
  // right: the open door and its list
  const door=el('div','abs'); Object.assign(door.style,{left:'1060px',top:'230px',width:'360px',height:'620px',borderRadius:'6px 6px 0 0',background:'linear-gradient(180deg,#dcecf0,#8fbfcc)',boxShadow:'0 0 0 14px #2a2622,0 0 90px rgba(143,191,204,.35)',perspective:'900px'});
  const leaf=el('div','abs',door); Object.assign(leaf.style,{left:0,top:0,width:'360px',height:'620px',background:'linear-gradient(90deg,#26221e,#1a1714)',transformOrigin:'0 50%',boxShadow:'0 0 0 2px #3a342e'});
  const knob=el('div','abs',leaf); Object.assign(knob.style,{right:'30px',top:'320px',width:'18px',height:'18px',borderRadius:'50%',background:'#6b645b'});
  const list=el('div','abs'); Object.assign(list.style,{left:'1470px',top:'230px',width:'380px',height:'620px',borderRadius:'10px',background:'#f6f1e8',color:'var(--ink)',padding:'26px 28px',overflow:'hidden',transform:'rotate(2deg)'});
  const ex=['except invoices','except Fridays','except the CEO','except replies under 50 words','except internal threads','except calendar holds','unless it\'s urgent','except #sales','except cc\'d threads','except drafts older than a day','unless it\'s a reminder','except clients on retainer'];
  list.innerHTML='<div style="font-weight:900;font-size:26px;margin-bottom:12px">Allowed, except…</div>'+ex.map(e=>`<div class="ex" style="font-family:Newsreader,serif;font-size:27px;line-height:1.5">— ${e}</div>`).join('');
  const exEls=[...list.querySelectorAll('.ex')];
  const dl=el('div','abs',null,'<div class="kicker" style="color:var(--mute)">Not this</div><div class="mega" style="font-size:64px;margin-top:10px;color:#8d857b">A list of exceptions.</div>'); Object.assign(dl.style,{left:'1060px',top:'880px'});
  const tWall=wordAt(0,'closed'), tWin=wordAt(0,'window'), tDoor=wordAt(0,'open',0), tList=wordAt(0,'list'), tHold=wordAt(1,'head'), tCant=wordAt(1,'cannot');
  const camIn=cam(.2,220);
  return t=>{
    wall.style.opacity=ramp(t,tWall-.3,.4); 
    const w=ramp(t,tWin,.5); win.style.transform=`scaleY(${w})`; win.style.opacity=w;
    wl.style.opacity=ramp(t,tWin,.4);
    door.style.opacity=ramp(t,tDoor-.4,.4); leaf.style.transform=`rotateY(${-72*ramp(t,tDoor-.1,.8,inOut)}deg)`;
    list.style.opacity=ramp(t,tList-.3,.3);
    exEls.forEach((e,i)=>{e.style.opacity=ramp(t,tList-.3+i*.12,.15)});
    const blur=ramp(t,tCant,.6); list.style.filter=`blur(${3*blur}px)`; list.style.opacity=ramp(t,tList-.3,.3)*lerp(1,.5,blur);
    dl.style.opacity=ramp(t,tList,.4)*lerp(1,.6,blur);
    wall.style.boxShadow=t>=tHold?`0 0 0 3px rgba(127,196,214,.55),0 0 60px rgba(127,196,214,.2)`:'0 0 0 2px #2a2622';
    camIn(t);
  };
};
