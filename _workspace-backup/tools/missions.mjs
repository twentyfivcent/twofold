// single source of truth for the daily mission pool -> emits SQL insert + client JS
const M=[];const add=(tier,id,stat,goal,reward,title)=>M.push({id,tier,stat,goal,reward,title});
// easy $25-50
[['e_kills','kills',8,25,'Get 8 eliminations'],['e_hs','headshots',3,30,'Land 3 headshot kills'],['e_play','matches',1,25,'Finish 1 match'],
['e_dmg','damage',1000,30,'Deal 1,000 damage'],['e_assist','assists',2,30,'Get 2 assists'],['e_rounds','rounds_won',3,30,'Win 3 rounds'],
['e_ping','pings',5,25,'Ping 5 enemies or spots for your team'],['e_mantle','mantles',3,25,'Mantle over 3 ledges'],['e_util','util_used',4,30,'Use 4 lethals or tacticals'],
['e_pistol','pistol_kills',2,35,'Get 2 sidearm eliminations'],['e_smg','smg_kills',3,35,'Get 3 SMG eliminations'],['e_rifle','rifle_kills',3,35,'Get 3 rifle eliminations'],
['e_shotgun','shotgun_kills',2,35,'Get 2 shotgun eliminations'],['e_close','close_kills',3,40,'Get 3 eliminations within 5 m'],['e_slide','slide_kills',1,45,'Get 1 elimination while sliding'],
['e_lethal','util_kills',1,45,'Eliminate an enemy with a lethal'],['e_win','wins',1,50,'Win 1 match'],['e_lmg','lmg_kills',2,35,'Get 2 LMG eliminations']].forEach(a=>add('easy',...a));
// medium $60-100
[['m_kills','kills',20,70,'Get 20 eliminations'],['m_hs','headshots',8,80,'Land 8 headshot kills'],['m_play','matches',3,60,'Finish 3 matches'],
['m_dmg','damage',4000,75,'Deal 4,000 damage'],['m_assist','assists',6,70,'Get 6 assists'],['m_rounds','rounds_won',8,70,'Win 8 rounds'],
['m_wins','wins',2,90,'Win 2 matches'],['m_double','doubles',2,85,'Get 2 double eliminations'],['m_long','long_kills',3,80,'Get 3 eliminations from 30 m+'],
['m_sniper','sniper_kills',4,85,'Get 4 sniper or marksman eliminations'],['m_smg','smg_kills',8,75,'Get 8 SMG eliminations'],['m_rifle','rifle_kills',8,75,'Get 8 rifle eliminations'],
['m_shotgun','shotgun_kills',6,75,'Get 6 shotgun eliminations'],['m_air','air_kills',2,90,'Get 2 eliminations while airborne'],['m_flawless','flawless',3,85,'Win 3 rounds without dying'],
['m_melee','melee_kills',1,90,'Get a melee elimination'],['m_revenge','revenge',2,70,'Take revenge on your killer twice'],['m_first','first_bloods',2,80,'Get the first elimination of a round twice']].forEach(a=>add('medium',...a));
// hard $120-200
[['h_kills','kills',40,140,'Get 40 eliminations'],['h_hs','headshots',18,160,'Land 18 headshot kills'],['h_wins','wins',4,180,'Win 4 matches'],
['h_mvp','mvp',1,150,'Be match MVP'],['h_mvp2','mvp',2,200,'Be match MVP twice'],['h_dmg','damage',10000,150,'Deal 10,000 damage'],
['h_double','doubles',5,170,'Get 5 double eliminations'],['h_long','long_kills',8,160,'Get 8 eliminations from 30 m+'],['h_flawless','flawless',8,170,'Win 8 rounds without dying'],
['h_lethal','util_kills',4,170,'Eliminate 4 enemies with lethals'],['h_knife','knife_kills',2,190,'Get 2 Talon Knife eliminations'],['h_melee','melee_kills',3,200,'Get 3 melee eliminations'],
['h_slide','slide_kills',5,160,'Get 5 eliminations while sliding'],['h_air','air_kills',5,170,'Get 5 eliminations while airborne'],['h_pistol','pistol_kills',10,150,'Get 10 sidearm eliminations'],
['h_first','first_bloods',5,160,'Get 5 first eliminations of a round'],['h_assist','assists',14,130,'Get 14 assists'],['h_play','matches',6,120,'Finish 6 matches'],['h_sniper','sniper_kills',10,180,'Get 10 sniper or marksman eliminations']].forEach(a=>add('hard',...a));
// per-match sanity caps for each counter (server clamps every report to these)
export const CAPS={kills:40,headshots:40,matches:1,wins:1,mvp:1,damage:12000,assists:30,rounds_won:12,flawless:12,doubles:15,long_kills:40,close_kills:40,air_kills:40,slide_kills:40,
 util_kills:20,knife_kills:20,melee_kills:20,pistol_kills:40,smg_kills:40,rifle_kills:40,shotgun_kills:40,sniper_kills:40,lmg_kills:40,pings:60,mantles:60,util_used:40,revenge:20,first_bloods:12};
export {M};
if(process.argv[2]==='sql'){const q=s=>"'"+s.replace(/'/g,"''")+"'";
 console.log('insert into public.missions(id,tier,stat,goal,reward,title) values\n'+M.map(m=>` (${q(m.id)},${q(m.tier)},${q(m.stat)},${m.goal},${m.reward},${q(m.title)})`).join(',\n')+'\non conflict (id) do update set tier=excluded.tier, stat=excluded.stat, goal=excluded.goal, reward=excluded.reward, title=excluded.title;');
 console.log('insert into public.mission_caps(stat,cap) values '+Object.entries(CAPS).map(([k,v])=>`(${q(k)},${v})`).join(',')+'\non conflict (stat) do update set cap=excluded.cap;')}
if(process.argv[2]==='js')console.log('const MISSIONS='+JSON.stringify(M)+';const MISSION_CAPS='+JSON.stringify(CAPS)+';');
if(process.argv[2]==='n')console.log(M.length,M.filter(m=>m.tier==='easy').length,M.filter(m=>m.tier==='medium').length,M.filter(m=>m.tier==='hard').length, Math.min(...M.map(m=>m.reward)),Math.max(...M.map(m=>m.reward)), M.every(m=>CAPS[m.stat]));
