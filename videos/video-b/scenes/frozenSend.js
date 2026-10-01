// 0:00 — a send, reversed and stopped: the message frozen half out of the window
SCENES.frozenSend=()=>{
  theme('dark'); coolGlow('30%','40%');
  const win=panel(null,{left:'860px',top:'230px',width:'900px',height:'680px',padding:'0',overflow:'visible'});
  win.innerHTML=`<div style="height:84px;border-radius:28px 28px 0 0;background:#211e1a;display:flex;align-items:center;padding:0 36px;font-weight:900;font-size:30px">New message</div>
    <div style="padding:22px 40px;font-size:28px;color:var(--mute);border-bottom:1px solid #2a2622">To <span style="color:var(--cream);font-weight:700;margin-left:14px">client@jojiai.co</span></div>
    <div style="padding:22px 40px;font-size:28px;color:var(--mute);border-bottom:1px solid #2a2622">Subject <span style="color:var(--cream);font-weight:700;margin-left:14px">Updated figures for Q3</span></div>`;
  const send=el('div','abs',win,'Send'); Object.assign(send.style,{left:'40px',bottom:'38px',padding:'18px 46px',borderRadius:'16px',background:'var(--blue)',color:'var(--ink)',fontWeight:900,fontSize:'30px'});
  // the message itself: the sheet that leaves
  const msg=el('div','abs',win); Object.assign(msg.style,{left:'40px',top:'250px',width:'820px',height:'250px',borderRadius:'18px',background:'#f6f1e8',padding:'30px 36px',boxShadow:'0 30px 60px rgba(0,0,0,.45)'});
  msg.innerHTML=[92,100,84,96,60].map(w=>`<div style="height:16px;width:${w}%;border-radius:8px;background:#d9d0c2;margin-bottom:22px"></div>`).join('');
  const sent=el('div','abs',null,'<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:var(--amber);margin-right:14px;box-shadow:0 0 16px var(--amber)"></span>Sending'); Object.assign(sent.style,{left:'1560px',top:'170px',fontWeight:900,fontSize:'30px',color:'var(--amber)'});
  const stat=(top,num,lab)=>{const d=el('div','abs',null,`<div class="mega" style="font-size:150px">${num}</div><div class="kicker" style="margin-top:14px;color:var(--mute)">${lab}</div>`);Object.assign(d.style,{left:'150px',top:top+'px'});return d};
  const s1=stat(170,'&lt;1 s','to do it'), s2=stat(450,'2 weeks','to explain it');
  s2.querySelector('.mega').style.color='var(--blue)';
  const tSend=wordAt(0,'second')-.25, tFort=wordAt(0,'fortnight');
  const a1=pop(s1,tSend+.1,50), a2=pop(s2,tFort-.1,50);
  const camIn=cam(1.0,250);
  return t=>{
    win.style.opacity=ramp(t,0,.6);
    const press=t>=tSend&&t<tSend+.25; send.style.transform=`scale(${press?.94:1})`;
    // out fast, then pulled back a little and held: frozen mid-send
    const k= t<tSend?0 : t<tSend+.45 ? .8*outCubic((t-tSend)/.45) : .8-.22*outCubic((t-tSend-.45)/.4);
    msg.style.transform=`translate(${k*700}px,${-k*330}px) rotate(${-k*7}deg)`;
    sent.style.opacity=t>=tSend+.45?1:0;
    a1(t); a2(t); camIn(t);
  };
};
