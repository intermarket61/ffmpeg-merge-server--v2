// Shared pieces for Video D. Colour rule: amber = an alarm fired, green = healthy,
// blue = neutral data. No red anywhere.
const FIRE='var(--amber)', OK='var(--green)', DATA='var(--blue)';
const ALARMS=[['Nothing came out','A run that delivered nothing'],['Everything got through','A filter that never says no'],
              ['Something’s missing','A required field is empty'],['It cost too much','Spend past half the cap']];

function heading(kick,title,left=420,top=70,size=80){
  const d=el('div','abs',null,`<div class="kicker">${kick}</div><div class="mega" style="font-size:${size}px;margin-top:14px">${title}</div>`);
  Object.assign(d.style,{left:left+'px',top:top+'px'});
  return t=>{d.style.opacity=ramp(t,0,.5)};
}
function chip(parent,html,col,style){
  const c=el('span','',parent,html);
  Object.assign(c.style,{display:'inline-block',padding:'8px 18px',borderRadius:'12px',fontWeight:700,fontSize:'24px',
    letterSpacing:'.04em',color:col||'var(--cream)',background:'rgba(255,255,255,.06)',whiteSpace:'nowrap'},style||{});
  return c;
}
// a bell glyph that can ring (k 0..1 lit)
function bell(parent,size=64){
  const d=el('div','',parent,`<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6v4.5L4 16v1h16v-1l-2-3.5V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" fill="currentColor"/></svg>`);
  Object.assign(d.style,{display:'inline-block',color:'#4a433b',lineHeight:0});
  return {el:d,set(k,t=0){d.style.color=k>.5?FIRE:'#4a433b';
    d.style.transform=k>.5?`rotate(${14*Math.sin(t*18)*Math.max(0,1-(t%2.5))}deg)`:'none';
    d.style.filter=k>.5?'drop-shadow(0 0 18px rgba(255,177,61,.8))':'none'}};
}
