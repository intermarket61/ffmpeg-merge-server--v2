// ================================================================== text card
SCENES.textCard=()=>{
  const th=P().theme||'dark'; theme(th);
  const ink= th==='dark'?'var(--cream)':'var(--ink)';
  if(th==='dark'){const glow=el('div','fill');glow.style.background='radial-gradient(circle at 80% 70%,rgba(255,90,31,.16),transparent 45%)'}
  const col=el('div','abs'); Object.assign(col.style,{left:'150px',right:'150px',top:0,bottom:0,display:'flex',flexDirection:'column',justifyContent:'center',gap:'22px'});
  const anims=(P().blocks||[]).map(b=>{
    const d=el('div',b.serif?'serif':'mega',col,b.html);
    Object.assign(d.style,{fontSize:b.size+'px',color:b.color||ink,fontStyle:b.italic?'italic':'normal',lineHeight:b.serif?'1.15':'.95'});
    if(b.serif) d.style.letterSpacing='-.01em';
    return pop(d,wAt(b.at)-.12,70);
  });
  const camIn=cam(.15,280); const tl=tally();
  return t=>{anims.forEach(a=>a(t)); camIn(t); tl(t)};
};
