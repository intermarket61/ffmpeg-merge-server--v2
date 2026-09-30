// ================================================================== paying to learn nothing changed
SCENES.nothingChanged=()=>{
  theme('dark');
  const head=el('div','abs',null,'<div class="kicker">Scout · every 30 minutes</div><div class="mega" style="font-size:80px;margin-top:14px">Spent checking: <span id="sp" style="color:var(--orange)">$0.00</span></div>');
  Object.assign(head.style,{left:'120px',top:'80px'}); const sp=head.querySelector('#sp');
  const tiles=[]; const cols=8, rows=4;
  for(let i=0;i<cols*rows;i++){
    const d=el('div','abs'); Object.assign(d.style,{left:(120+(i%cols)*212)+'px',top:(300+Math.floor(i/cols)*150)+'px',width:'196px',height:'134px',borderRadius:'16px',background:'#1b1916',padding:'16px 18px',boxShadow:'0 0 0 1px rgba(255,255,255,.06)'});
    d.innerHTML=`<div style="font-size:18px;color:var(--mute);font-weight:700">${String(7+Math.floor(i/2)).padStart(2,'0')}:${i%2?'30':'00'}</div>
      <div class="stamp" style="margin-top:10px;font-weight:900;font-size:20px;letter-spacing:.06em;color:var(--mute);border:2px solid #3a342e;border-radius:8px;padding:4px 8px;display:inline-block;transform:rotate(-4deg)">NOTHING CHANGED</div>
      <div style="position:absolute;right:14px;bottom:12px;font-weight:900;font-size:22px;color:var(--orange)">$0.04</div>`;
    tiles.push(d);
  }
  const card=panel(null,{left:'560px',top:'380px',width:'800px',padding:'44px 50px',zIndex:20});
  card.innerHTML=`<div style="font-weight:700;font-size:24px;letter-spacing:.2em;color:var(--mute)">HEARTBEAT MODEL</div>
    <div style="margin-top:20px;display:flex;gap:18px"><span class="lg" style="flex:1;text-align:center;padding:22px;border-radius:16px;font-weight:900;font-size:34px">Large</span><span class="sm" style="flex:1;text-align:center;padding:22px;border-radius:16px;font-weight:900;font-size:34px">Small</span></div>
    <div style="margin-top:22px;font-family:Newsreader;font-style:italic;font-size:34px;color:var(--mute)">The cheap model is there for exactly this. <span style="color:var(--orange)">Never set.</span></div>`;
  const lg=card.querySelector('.lg'), sm=card.querySelector('.sm');
  const camIn=cam(.2,240); const tl=tally();
  const endStamp=S.lines[1].t0-.3, cheapAt=wordAt(1,'cheaper');
  return t=>{
    head.style.opacity=ramp(t,0,.4);
    let spent=0;
    tiles.forEach((d,i)=>{const s=.3+i*(endStamp-.3)/tiles.length; const on=t>=s;
      d.style.opacity=on?1:.15; if(on) spent+=.04;
      const st=d.querySelector('.stamp'); st.style.color=on?'var(--cream)':'var(--mute)'; st.style.borderColor=on?'var(--cream)':'#3a342e';
      st.style.transform=`rotate(-4deg) scale(${on?lerp(1.6,1,ramp(t,s,.18)):1})`;});
    sp.textContent='$'+(spent*9).toFixed(2);
    const k=spring((t-cheapAt+.1)/.7); card.style.opacity=clamp((t-cheapAt+.1)*5); card.style.transform=`translateY(${(1-k)*80}px)`;
    tiles.forEach(d=>d.style.filter= t>cheapAt?`blur(${3*ramp(t,cheapAt,.4)}px)`:'none');
    const pulse=.5+.5*Math.sin(t*6);
    lg.style.background='var(--cream)'; lg.style.color='var(--ink)';
    sm.style.background='#26221e'; sm.style.color='var(--mute)'; sm.style.boxShadow=`0 0 0 3px rgba(255,90,31,${.4+.6*pulse})`;
    camIn(t); tl(t);
  };
};
