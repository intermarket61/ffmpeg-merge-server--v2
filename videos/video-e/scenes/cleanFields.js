// 2:25 — Edit Fields: tidy what came in, add received_at / source / status
SCENES.cleanFields=()=>{
  theme('dark');
  const hd=heading('Step 02 · Edit Fields','Tidy it, then <span style="color:var(--accent)">label it.</span>',420,70,80);
  const A=panel(null,{left:'420px',top:'260px',width:'680px',padding:'28px 34px'});
  el('div','',A,'<span style="font-weight:700;font-size:20px;letter-spacing:.2em;color:#8d857b">CAME IN</span>');
  field(A,'name','"  Dana Ruiz "',{vcol:'#cfc6b8',size:26}); field(A,'email','" Dana.Ruiz@Gmail.com "',{vcol:'#cfc6b8',size:26});
  field(A,'message','"Kitchen refit quote"',{vcol:'#cfc6b8',size:26});
  const mid=el('div','abs',null,ico('edit',70)); Object.assign(mid.style,{left:'1118px',top:'360px',color:'var(--accent)'});
  const B=panel(null,{left:'1210px',top:'260px',width:'630px',padding:'28px 34px'});
  el('div','',B,'<span style="font-weight:700;font-size:20px;letter-spacing:.2em;color:var(--accent)">GOES OUT</span>');
  const b1=field(B,'name','"Dana Ruiz"',{size:26}), b2=field(B,'email','"dana.ruiz@gmail.com"',{size:26}), b3=field(B,'message','"Kitchen refit quote"',{size:26});
  const sep=el('div','',B); Object.assign(sep.style,{borderTop:'2px dashed #3a342e',margin:'12px 0'});
  const n1=field(B,'received_at','"2026-10-20 21:14"',{vcol:LEAD,size:26}), n2=field(B,'source','"website form"',{vcol:LEAD,size:26}), n3=field(B,'status','"new"',{vcol:LEAD,size:26});
  n3.style.background='rgba(143,214,148,.10)'; n3.style.borderRadius='10px'; n3.style.paddingLeft='10px';
  const tB=S.lines[1].t0, tA=[wordAt(2,'arrived'),wordAt(2,'came'),wordAt(2,'status')];
  const camIn=cam(.2,220);
  return t=>{hd(t); A.style.opacity=ramp(t,.15,.4); mid.style.opacity=ramp(t,.6,.4);
    B.style.opacity=ramp(t,tB-.2,.4); [b1,b2,b3].forEach(r=>r.style.opacity=ramp(t,tB,.4));
    sep.style.opacity=ramp(t,tA[0]-.3,.3); [n1,n2,n3].forEach((r,i)=>{r.style.opacity=ramp(t,tA[i]-.1,.3); r.style.transform=`translateX(${(1-ramp(t,tA[i]-.1,.4))*30}px)`});
    camIn(t)};
};
