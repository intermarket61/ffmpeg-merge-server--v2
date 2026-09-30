// ================================================================== generic presenter
SCENES.presenter=()=>{
  const z=P().zoom||[1.0,1.07];
  faceFull(z[0],z[1]);
  const pills=makePills(P().pills);
  const tl=tally();
  return t=>{runPills(pills,t); tl(t)};
};
