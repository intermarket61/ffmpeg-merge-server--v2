// Shared pieces for Video E. Colour rule: green (the accent) = a lead handled,
// amber = needs a human, blue = data passing through. No red anywhere.
const LEAD='var(--accent)', WARN='var(--amber)', DATA='var(--blue)';
const DIM='#4a433b';

// simple line icons, drawn in currentColor
const ICONS={
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m14 6 4 4"/>',
  sheet:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M10 4v16"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  branch:'<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 8v8M6 12c0-3 4-3 10-3"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  check:'<path d="m5 12 4 4 10-10"/>',
  hook:'<circle cx="12" cy="6" r="3"/><path d="M12 9v4l-5 6M12 13l5 6"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>',
  phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
};
function ico(name,size=40,color){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color||'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}
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
// an n8n-style node: rounded square with an icon, name underneath. set(k) lights it (0..1)
function node(parent,x,y,icon,name,sub,{size=140,col=LEAD}={}){
  const w=el('div','abs',parent); Object.assign(w.style,{left:x+'px',top:y+'px',width:size+'px'});
  const b=el('div','',w,ico(icon,size*.42)); Object.assign(b.style,{width:size+'px',height:size+'px',borderRadius:(size*.22)+'px',
    background:'#1d1a17',display:'grid',placeItems:'center',color:DIM,boxShadow:'0 0 0 2px #2f2a25,0 30px 60px rgba(0,0,0,.45)'});
  const n=el('div','',w,name); Object.assign(n.style,{position:'absolute',left:'50%',top:(size+18)+'px',transform:'translateX(-50%)',
    width:'230px',textAlign:'center',fontWeight:900,fontSize:'26px',lineHeight:'1.1',color:'#8d857b'});
  let s=null;
  if(sub){s=el('div','serif',w,sub); Object.assign(s.style,{position:'absolute',left:'50%',top:(size+52)+'px',transform:'translateX(-50%)',
    width:'230px',textAlign:'center',fontStyle:'italic',fontSize:'24px',color:'#8d857b'});}
  return {w,b,n,s,set(k){
    b.style.color=k>.5?col:DIM;
    b.style.boxShadow=k>.5?`0 0 0 3px ${col},0 0 50px rgba(143,214,148,.25),0 30px 60px rgba(0,0,0,.45)`:'0 0 0 2px #2f2a25,0 30px 60px rgba(0,0,0,.45)';
    n.style.color=k>.5?'var(--cream)':'#8d857b'; if(s) s.style.color=k>.5?'#cfc6b8':'#6f685f';
  }};
}
// an SVG overlay for connectors; line(x1,y1,x2,y2) returns set(k) that draws it 0..1
function wires(){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('width','1920'); svg.setAttribute('height','1080');
  Object.assign(svg.style,{position:'absolute',left:0,top:0}); stage.appendChild(svg);
  return {svg,line(x1,y1,x2,y2,col='#5b544c',w=4){
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    const mx=(x1+x2)/2;
    p.setAttribute('d',y1===y2?`M${x1} ${y1}L${x2} ${y2}`:`M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);
    p.setAttribute('fill','none'); p.setAttribute('stroke',col); p.setAttribute('stroke-width',w); p.setAttribute('stroke-linecap','round');
    svg.appendChild(p); const L=p.getTotalLength(); p.style.strokeDasharray=L;
    return k=>{p.style.strokeDashoffset=L*(1-clamp(k))};
  }};
}
// a field row "key  value" for JSON-ish cards
function field(parent,k,v,{vcol='var(--cream)',size=30}={}){
  const r=el('div','',parent); Object.assign(r.style,{display:'flex',gap:'24px',alignItems:'baseline',padding:'10px 0',fontSize:size+'px',fontFamily:'monospace'});
  r.innerHTML=`<span style="color:var(--blue);width:190px;flex:none">${k}</span><span class="v" style="color:${vcol};white-space:pre">${v}</span>`;
  return r;
}
