// ================================================================== thumbnail
// A still, not a shot: the presenter pushed right, two or three huge words on
// the left. Rendered once by engine/thumbnail.py from video.json "thumbnail".
// params: kicker, lines [{html, size?, color?}], badge (html), zoom, shift (px)
SCENES.thumbnail=()=>{
  const p=P();
  const face=faceFull(p.zoom||1.18, p.zoom||1.18);
  face.style.transform=`translateX(${p.shift==null?360:p.shift}px)`;
  const shade=el('div','fill'); shade.style.background='linear-gradient(90deg,#0c0b0a 0%,#0c0b0a 24%,rgba(12,11,10,.85) 40%,rgba(12,11,10,.2) 62%,transparent 75%)';
  const col=el('div','abs'); Object.assign(col.style,{left:'90px',top:0,bottom:0,width:'1060px',display:'flex',flexDirection:'column',justifyContent:'center',gap:'10px'});
  if(p.kicker){const k=el('div','kicker',col,p.kicker); Object.assign(k.style,{fontSize:'40px',marginBottom:'14px'});}
  (p.lines||[]).forEach(l=>{const d=el('div','mega',col,l.html);
    Object.assign(d.style,{fontSize:(l.size||190)+'px',color:l.color||'var(--cream)',textShadow:'0 10px 40px rgba(0,0,0,.6)'});});
  if(p.badge){const b=el('div','',col,p.badge); Object.assign(b.style,{alignSelf:'flex-start',marginTop:'34px',padding:'18px 34px',
    borderRadius:'22px',background:'var(--cream)',color:'var(--ink)',fontWeight:900,fontSize:'52px',boxShadow:'0 20px 50px rgba(0,0,0,.5)'});}
  return t=>{};
};
