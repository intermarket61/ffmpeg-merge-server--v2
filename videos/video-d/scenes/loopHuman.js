// 0:00 — three agents in a loop, a human in it, and the question nobody answers
SCENES.loopHuman=()=>{
  theme('dark');
  const names=['Research','Judgment','Design'];
  const nodes=names.map((n,i)=>{const p=panel(null,{left:(470+i*440)+'px',top:'300px',width:'340px',height:'150px',display:'grid',placeItems:'center'});
    p.innerHTML=`<div style="font-weight:900;font-size:46px">${n}</div>`; return p});
  const links=[0,1].map(i=>{const l=el('div','abs');Object.assign(l.style,{left:(810+i*440)+'px',top:'373px',width:'100px',height:'5px',background:DATA,boxShadow:'0 0 12px var(--blue)'});return l});
  const human=el('div','abs',null,`<svg width="140" height="140" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="#f1eadf"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" fill="#f1eadf"/></svg>`);
  Object.assign(human.style,{left:'890px',top:'560px'});
  const loop=el('div','abs'); Object.assign(loop.style,{left:'560px',top:'450px',width:'800px',height:'220px',border:'5px dashed #4a433b',borderTop:'0',borderRadius:'0 0 60px 60px'});
  const lab=el('div','abs kicker',null,'Human in the loop'); Object.assign(lab.style,{left:'760px',top:'730px',width:'400px',textAlign:'center'});
  const q=el('div','abs mega',null,'Looking at <span style="color:var(--accent)">what?</span>'); Object.assign(q.style,{left:'420px',top:'840px',fontSize:'96px'});
  const tKeep=S.lines[1].t0, tQ=wordAt(2,'looking');
  const camIn=cam(.2,240);
  return t=>{
    nodes.forEach((p,i)=>{p.style.opacity=ramp(t,.1+i*.2,.4)}); links.forEach((l,i)=>l.style.opacity=ramp(t,.4+i*.2,.3));
    const k=ramp(t,tKeep-.1,.5); loop.style.opacity=k; human.style.opacity=k; lab.style.opacity=k;
    human.style.transform=`translateY(${(1-spring((t-tKeep)/.6))*40}px)`;
    q.style.opacity=ramp(t,tQ-.2,.4); camIn(t);
  };
};
