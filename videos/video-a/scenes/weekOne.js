// ================================================================== week one page
SCENES.weekOne=()=>{
  theme('paper');
  const items=[['Open-weights model tops a coding benchmark','#ff5a1f','#ffb13d'],['Agent SDK adds scheduled runs','#1e8fb0','#7fc4d6'],
               ['Video model ships a 4K mode','#6a4bd8','#b59cff'],['Browser agent opens its beta','#2f8f5b','#8fd694'],['Voice API cuts latency in half','#d6336c','#ff9fc0']];
  const sheet=el('div','sheet'); Object.assign(sheet.style,{left:'470px',top:'90px',width:'980px',padding:'46px 52px'});
  sheet.innerHTML=`<div style="font-weight:700;letter-spacing:.2em;font-size:20px;color:#9a8f80">ATLAS · MONDAY 07:00</div>
    <div class="mega" style="font-size:74px;color:var(--ink);margin:10px 0 26px">AI launches, week 1</div>`;
  items.forEach(([h,a,b],i)=>{
    const r=el('div','',sheet); Object.assign(r.style,{display:'flex',alignItems:'center',gap:'28px',padding:'20px 0',borderTop:'1px solid #ece4d6'});
    r.innerHTML=`<div style="width:170px;height:100px;border-radius:14px;flex:none;background:linear-gradient(135deg,${a},${b});position:relative;overflow:hidden">
        <div style="position:absolute;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.28);right:-20px;top:-26px"></div>
        <div style="position:absolute;width:60px;height:60px;border-radius:12px;background:rgba(0,0,0,.14);left:18px;bottom:-14px;transform:rotate(18deg)"></div></div>
      <div><div style="font-weight:900;font-size:32px;color:var(--ink)">${h}</div>
      <div style="margin-top:8px;font-size:22px;color:#8a7b68">Day ${i+1} · <span style="color:#1e6fd6;text-decoration:underline">source ↗</span></div></div>`;
  });
  const badge=el('div','abs',null,'✓ 5/5 sourced'); Object.assign(badge.style,{left:'1260px',top:'130px',padding:'14px 24px',borderRadius:'30px',background:'#2f8f5b',color:'#fff',fontWeight:900,fontSize:'28px',zIndex:5});
  const note=el('div','abs serif'); Object.assign(note.style,{left:'1000px',top:'330px',width:'820px',fontSize:'82px',lineHeight:'1.05',color:'var(--ink)'});
  note.innerHTML='Week one looks<br>exactly like<br><i style="color:var(--orange)">the prompts.</i>';
  const note2=el('div','abs serif',null,'Marked on the exact paper it revised for.'); Object.assign(note2.style,{left:'1004px',top:'690px',width:'780px',fontSize:'44px',fontStyle:'italic',color:'#6f6253'});
  const face=el('div','cam'); Object.assign(face.style,{boxShadow:'0 40px 80px rgba(60,40,20,.3),0 0 0 6px #fbf8f2'});
  const c=el('canvas','',face); c.width=c.height=400; faceCanvases.push({canvas:c,kind:'bubble'});
  const tl=tally();
  const srcAt=wordAt(1,'sources'), shift=S.lines[2].t0-.2, markAt=wordAt(3,'marked');
  return t=>{
    const sk=spring(t/.9); const sh=ramp(t,shift,.8,inOut);
    sheet.style.transform=`translate(${-sh*380}px,${(1-sk)*120 - inOut(t/shift)*220*(1-sh)}px) scale(${1-sh*.3})`;
    sheet.style.transformOrigin='left top'; sheet.style.opacity=clamp(t*3)*(1-.35*sh);
    const bk=spring((t-srcAt)/.6); badge.style.opacity=clamp((t-srcAt)*5)*(1-sh); badge.style.transform=`scale(${lerp(.5,1,clamp(bk))}) rotate(${(1-bk)*-8}deg)`;
    note.style.opacity=ramp(t,shift+.3,.5); note.style.transform=`translateY(${(1-ramp(t,shift+.3,.6))*40}px)`;
    note2.style.opacity=ramp(t,markAt-.1,.5);
    face.style.transform=`translateY(${(1-spring((t-.3)/.9))*420}px)`;
    tl(t);
  };
};
