// 6:40 — a month of drafts filling the folder; forty read, almost none changed
SCENES.draftsFolder=()=>{
  theme('dark');
  const box=panel(null,{left:'420px',top:'110px',width:'900px',height:'860px',padding:'34px 40px',overflow:'hidden'});
  box.innerHTML=`<div style="display:flex;align-items:baseline;gap:20px"><span style="font-weight:900;font-size:52px">Drafts</span><span class="n mega" style="font-size:52px;color:var(--blue)">0</span></div>
    <div class="list" style="position:relative;margin-top:24px;height:700px;overflow:hidden"></div>`;
  const nEl=box.querySelector('.n'), list=box.querySelector('.list');
  const subj=['Re: invoice 2291','Re: Thursday call','Re: quote for May','Re: intro — thank you','Re: revised deck','Re: delivery window','Re: renewal terms','Re: catch-up next week','Re: speaker slot','Re: contract draft'];
  const EDITED=new Set([32,36]);
  const rows=[...Array(40)].map((_,i)=>{const r=el('div','abs',list);Object.assign(r.style,{left:0,right:0,height:'88px',display:'flex',alignItems:'center',borderTop:'1px solid #2a2622',fontSize:'30px'});
    r.innerHTML=`<span style="flex:1;font-weight:700">${subj[i%subj.length]}</span><span style="font-size:22px;font-weight:700;letter-spacing:.1em;color:${EDITED.has(i)?'var(--amber)':'#6b645b'}">${EDITED.has(i)?'EDITED':'SENT AS DRAFTED'}</span>`;return r});
  const side=el('div','abs'); Object.assign(side.style,{left:'1380px',top:'150px',width:'460px'});
  side.innerHTML=`<div class="kicker">Drafts only</div><div class="mega d" style="font-size:150px;margin-top:10px">Day 1</div>
    <div class="conf serif" style="font-size:44px;font-style:italic;color:#8d857b;margin-top:30px">Not confidence.</div>
    <div class="read" style="margin-top:50px"><div class="mega" style="font-size:96px;color:var(--blue)">40 read.</div><div class="mega" style="font-size:60px;margin-top:10px">Almost none<br>changed.</div></div>`;
  const dEl=side.querySelector('.d'), conf=side.querySelector('.conf'), rd=side.querySelector('.read');
  const t0=wordAt(0,'draftsonly')-.2, t1=wordAt(1,'forty'), tConf=wordAt(0,'confidence'), tNone=wordAt(1,'none');
  const camIn=cam(.2,240);
  return t=>{
    box.style.opacity=ramp(t,0,.4);
    const p=inOut(clamp((t-t0)/(t1-t0))); const n=Math.round(40*p);
    nEl.textContent=n; dEl.textContent='Day '+Math.max(1,Math.round(30*p));
    rows.forEach((r,i)=>{const pos=n-1-i; r.style.display=pos>=0&&pos<9?'flex':'none'; r.style.top=(pos*88)+'px'});
    conf.style.opacity=ramp(t,tConf-.1,.4);
    rd.style.opacity=ramp(t,t1,.4); rd.lastChild.style.opacity=ramp(t,tNone-.3,.4);
    camIn(t);
  };
};
