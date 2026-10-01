// Shared pieces for Video B's scenes. Colour rule for the whole video:
// blue = inbound (reads, recoverable), amber = outbound (reaches a person).
// No red anywhere; green only for "switched on".
const IN='var(--blue)', OUT='var(--amber)';

// kicker + headline block, fades in from t=0
function heading(kick,title,left=420,top=80,size=84){
  const d=el('div','abs',null,`<div class="kicker">${kick}</div><div class="mega" style="font-size:${size}px;margin-top:14px">${title}</div>`);
  Object.assign(d.style,{left:left+'px',top:top+'px'});
  return t=>{d.style.opacity=ramp(t,0,.5)};
}
// a settings switch; set(k, colour) slides the knob (k 0..1)
function toggle(parent,w=104,h=56){
  const sw=el('span','',parent); Object.assign(sw.style,{width:w+'px',height:h+'px',borderRadius:h/2+'px',background:'#2a2622',position:'relative',display:'inline-block',flex:'none'});
  const kn=el('span','',sw); const p=Math.round(h*.11), d=h-2*p;
  Object.assign(kn.style,{position:'absolute',top:p+'px',left:p+'px',width:d+'px',height:d+'px',borderRadius:'50%',background:'#6b645b'});
  return {el:sw,set(k,col='var(--green)'){
    kn.style.left=(p+(w-h)*k)+'px'; kn.style.background=k>.5?'#fff':'#6b645b';
    sw.style.background=k>.5?col:'#2a2622';
  }};
}
// small rounded label
function chip(parent,html,col,style){
  const c=el('span','',parent,html);
  Object.assign(c.style,{display:'inline-block',padding:'8px 18px',borderRadius:'12px',fontWeight:700,fontSize:'24px',
    letterSpacing:'.04em',color:col||'var(--cream)',background:'rgba(255,255,255,.06)',whiteSpace:'nowrap'},style||{});
  return c;
}
// a soft cool glow behind dark scenes
function coolGlow(x='75%',y='70%'){
  const g=el('div','fill'); g.style.background=`radial-gradient(circle at ${x} ${y},rgba(127,196,214,.12),transparent 45%)`;
}
