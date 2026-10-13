(function(){
'use strict';
/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
const NOW=new Date();
const daysAgo=n=>new Date(NOW.getFullYear(),NOW.getMonth(),NOW.getDate()-n);
const fmtD=d=>d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
const av=(name,size=32)=>`<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.38)}px;background:hsl(${hue(name)} 42% 36%)" aria-hidden="true">${esc(name.split(' ').map(w=>w[0]).slice(0,2).join(''))}</span>`;
const I={
  dashboard:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  players:'<circle cx="9" cy="8" r="3.3"/><path d="M3 20c0-3.4 2.7-6 6-6s6 2.6 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.6 0 4.5 2 4.5 5"/>',
  batches:'<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2.3"/><circle cx="19" cy="10" r="2.3"/><path d="M6.5 20c0-3 2.4-5.2 5.5-5.2s5.5 2.2 5.5 5.2M1.5 18c0-2.3 1.6-4 3.5-4M22.5 18c0-2.3-1.6-4-3.5-4"/>',
  attendance:'<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M8.5 15.5l2.5 2.5 4.5-5"/>',
  fees:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
  receipts:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  notifications:'<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
  roles:'<path d="M12 3 4.5 6v6c0 4.6 3.1 8 7.5 9 4.4-1 7.5-4.4 7.5-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  reports:'<path d="M5 20V11M12 20V4M19 20v-6"/>',
  settings:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
  rupee:'<path d="M7 4h10M7 9h10M7 4h2.5a4.5 4.5 0 0 1 0 9H7l7 7"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>',
  bolt:'<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  plusUser:'<circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.4 2.7-6 6-6s6 2.6 6 6M19 8v6M16 11h6"/>',
  cal:'<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  print:'<path d="M7 9V3h10v6M7 17H4v-6h16v6h-3M7 14h10v7H7z"/>'
};
const ic=(n,s=20,sw=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

/* ---------- seed data ---------- */
const batches=[
 {id:1,name:'U-16 Morning',coach:'Suresh Patil',time:'6:00 – 8:00 AM',days:'Mon – Sat',fee:5000,runs:true,n:56,a:[14,16]},
 {id:2,name:'U-14 Evening',coach:'Imran Shaikh',time:'4:30 – 6:30 PM',days:'Mon – Fri',fee:4500,runs:true,n:50,a:[12,14]},
 {id:3,name:'U-19 Evening',coach:'Nikhil Deshmukh',time:'5:00 – 7:00 PM',days:'Mon – Sat',fee:6000,runs:true,n:44,a:[16,19]},
 {id:4,name:'U-12 Morning',coach:'Meghna Iyer',time:'6:30 – 8:00 AM',days:'Tue – Sat',fee:3500,runs:true,n:50,a:[10,12]},
 {id:5,name:'U-14 Weekend',coach:'Imran Shaikh',time:'7:00 – 10:00 AM',days:'Sat – Sun',fee:3000,runs:false,n:28,a:[12,14]},
 {id:6,name:'Senior Nets',coach:'Suresh Patil',time:'7:00 – 9:00 PM',days:'Wed, Fri',fee:3000,runs:false,n:20,a:[18,26]}
];
const bOf=id=>batches.find(b=>b.id===id);
const F=['Arjun','Kabir','Ayaan','Reyansh','Dev','Ishaan','Krish','Atharv','Advait','Dhruv','Yash','Rohan','Tanay','Samarth','Om','Neel','Shaurya','Parth','Sahil','Veer','Pranav','Tejas','Harsh','Rudra','Manav','Siddharth','Omkar','Aryan','Vedant','Kunal','Mihir','Jay','Aniket','Rishi','Chirag','Zayan','Lakshya','Hriday','Tushar','Anay'];
const L=['Joshi','Kulkarni','Patil','Deshpande','Shinde','Gokhale','Pawar','Bhosale','Jadhav','Kale','More','Mehta','Reddy','Iyer','Gupta','Singh','Khan','Desai','Rao','Chavan','Sathe','Naik','Bapat','Phadke','Thakur'];
const SP=[{name:'Rahul Kumar',age:14,b:1},{name:'Aarav Nair',age:12,b:2},{name:'Vihaan Sharma',age:15,b:1},{name:'Aditya Menon',age:13,b:5},{name:'Ishan Patel',age:14,b:2}];
function mkPlayers(){
  let seed=20261012;const rnd=()=>(seed=(seed*1664525+1013904223)%4294967296)/4294967296;
  const slots=[];
  batches.forEach(b=>{const k=b.n-SP.filter(s=>s.b===b.id).length;for(let i=0;i<k;i++)slots.push(b.id)});
  for(let i=slots.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]]}
  const used=new Set(SP.map(s=>s.name));
  const uname=i=>{for(let k=i;;k++){const n=F[k%F.length]+' '+L[(Math.floor(k/F.length)*7+k*3)%L.length];if(!used.has(n)){used.add(n);return n}}};
  const list=slots.map((bid,i)=>{const b=bOf(bid);return{name:uname(i),age:b.a[0]+(i*5)%(b.a[1]-b.a[0]+1),batch:bid}});
  const sp=n=>{const s=SP.find(x=>x.name===n);return{name:s.name,age:s.age,batch:s.b}};
  list.splice(200,0,sp('Ishan Patel'));
  list.push(sp('Aditya Menon'),sp('Vihaan Sharma'),sp('Aarav Nair'),sp('Rahul Kumar'));
  let j=0;
  return list.map((p,k)=>{
    p.id=k+1;p.status='Active';p.joined=daysAgo(Math.floor((list.length-1-k)*1.6)+1);p.today=null;
    if(bOf(p.batch).runs){p.today=(j%12===5&&j<192)?'A':'P';j++}
    return p;
  });
}
const players=mkPlayers();
const pOf=id=>players.find(p=>p.id===id);
const dues={};
[[12,2500],[29,1500],[47,2000],[63,1000],[88,1500],[101,1500],[117,1200],[139,1750],[156,2000],[170,1000],[193,1500],[221,1000]].forEach(([id,a])=>dues[id]=a);
const nm=n=>players.find(p=>p.name===n).id;
let rcNo=2045;
const payments=[
 {id:4,rc:'RC-2044',pid:nm('Ishan Patel'),amount:3000,date:daysAgo(4),mode:'UPI',added:false},
 {id:3,rc:'RC-2043',pid:nm('Vihaan Sharma'),amount:5000,date:daysAgo(3),mode:'Cash',added:false},
 {id:2,rc:'RC-2042',pid:nm('Aarav Nair'),amount:5000,date:daysAgo(2),mode:'Card',added:false},
 {id:1,rc:'RC-2041',pid:nm('Rahul Kumar'),amount:5000,date:daysAgo(1),mode:'UPI',added:false}
];
// newest first: Rahul, Aarav, Vihaan, Ishan
payments.reverse();payments.forEach((p,i)=>p.id=payments.length-i);
const BASE_COLLECTED=124560, BASE_MODES={UPI:72245,Cash:33631,Card:18684};
const WEEKS_THIS=[18200,31400,38900,36060], WEEKS_LAST=[22000,27500,30100,34800];
const ATT_PREV=[90,92,88,95,93,80];
const notes=[
 {t:'12 players have pending fees',d:'Send reminders from Fees & Payments.',r:false,k:'fees'},
 {t:'Coach Suresh Patil opened the U-16 Morning session',d:'Attendance is live for today.',r:false,k:'att'},
 {t:'New enrolment enquiry: Zayan Khan (U-12)',d:'Call back to confirm the trial session.',r:false,k:'player'}
];
const staff=[
 {n:'Admin Administrator',e:'admin@kshetram.example',r:'Admin'},
 {n:'Suresh Patil',e:'suresh@kshetram.example',r:'Coach'},
 {n:'Imran Shaikh',e:'imran@kshetram.example',r:'Coach'},
 {n:'Meera Joshi',e:'meera@kshetram.example',r:'Accountant'},
 {n:'Kavita Rao',e:'kavita@kshetram.example',r:'Front desk'}
];
const S={route:'dashboard',q:'',bf:'all',limit:25,att:'7',fee:'this',attBatch:1,cfg:{academy:'Kshetram Cricket Academy',prefix:'RC',remind:5}};

/* ---------- derived ---------- */
const added=()=>payments.filter(p=>p.added).reduce((s,p)=>s+p.amount,0);
const stats=()=>{
  const exp=players.filter(p=>bOf(p.batch).runs);
  const pre=exp.filter(p=>p.today==='P').length;
  const joinedMonth=players.filter(p=>p.joined.getMonth()===NOW.getMonth()&&p.joined.getFullYear()===NOW.getFullYear()).length;
  const modes={...BASE_MODES};payments.filter(p=>p.added).forEach(p=>modes[p.mode]+=p.amount);
  return{total:players.length,exp:exp.length,pre,pct:exp.length?Math.round(pre/exp.length*100):0,
    collected:BASE_COLLECTED+added(),pending:Object.values(dues).reduce((a,b)=>a+b,0),pc:Object.keys(dues).length,joinedMonth,modes};
};
const unread=()=>notes.filter(n=>!n.r).length;
const pushNote=(t,d,k)=>{notes.unshift({t,d,r:false,k});syncBadges()};
function syncBadges(){
  const u=unread();
  $('#bellBadge').textContent=u;$('#bellBadge').style.display=u?'':'none';
  const nb=$('#nav .badge');if(nb){nb.textContent=u;nb.style.display=u?'':'none'}
}

/* ---------- nav ---------- */
const ROUTES=[['dashboard','Dashboard'],['players','Players'],['batches','Batches'],['attendance','Attendance'],['fees','Fees &amp; Payments'],['receipts','Receipts'],['notifications','Notifications'],['roles','Users &amp; Roles'],['reports','Reports'],['settings','Settings']];
function renderNav(){
  $('#nav').innerHTML=ROUTES.map(([k,l])=>`<a href="#${k}" ${S.route===k?'aria-current="page"':''}>${ic(k==='dashboard'?'dashboard':k,22)}<span>${l}</span>${k==='notifications'?'<span class="badge"></span>':''}</a>`).join('');
  syncBadges();
}

/* ---------- charts ---------- */
function attChart(){
  const st=stats();let vals,labs;
  if(S.att==='7'){
    vals=[...ATT_PREV,st.pct];
    labs=vals.map((_,i)=>daysAgo(6-i).toLocaleDateString('en-US',{weekday:'short'}));
  }else{
    const wk=Math.round((ATT_PREV.reduce((a,b)=>a+b,0)+st.pct)/7);
    vals=[87,89,91,wk];labs=['Wk 1','Wk 2','Wk 3','This wk'];
  }
  const ticks=[100,75,50,25,0].map((t,i)=>`<span class="ytick" style="top:${i*25}%">${t}</span>`).join('');
  return `<div class="bars-wrap"><div class="bars" role="img" aria-label="Attendance percentage per day">${ticks}${vals.map((v,i)=>`<div class="bar ${i===vals.length-1?'today':''}"><span class="v">${v}%</span><div class="fill" style="height:${v*.97}%"></div><span class="d">${labs[i]}</span></div>`).join('')}</div></div>`;
}
function feeChart(){
  const wk=(S.fee==='this'?WEEKS_THIS:WEEKS_LAST).slice();
  if(S.fee==='this')wk[3]+=added();
  let c=0;const cum=wk.map(v=>c+=v);
  const step=Math.ceil(Math.max(...cum)/4/10000)*10000,top=step*4;
  const x0=56,x1=530,y0=14,y1=172;
  const X=i=>x0+(x1-x0)*(i+.5)/4*1 - (x1-x0)*0.5/4*0 ;
  const Y=v=>y1-(y1-y0)*v/top;
  const pts=cum.map((v,i)=>[X(i)+(i*0),Y(v)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=line+` L${pts[3][0]} ${y1} L${pts[0][0]} ${y1}Z`;
  const grid=[0,1,2,3,4].map(i=>{const v=step*i,y=Y(v);return `<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="var(--grid)"/><text x="${x0-8}" y="${y+4}" text-anchor="end" font-size="11" fill="var(--muted)">${v?v/1000+'K':'0'}</text>`}).join('');
  const xl=pts.map((p,i)=>`<text x="${p[0]}" y="196" text-anchor="middle" font-size="11" fill="var(--muted)">Week ${i+1}</text>`).join('');
  const dots=pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#17803f" stroke="var(--surface)" stroke-width="2"><title>Week ${i+1}: ${inr(cum[i])} collected so far</title></circle>`).join('');
  return `<svg viewBox="0 0 560 205" width="100%" role="img" aria-label="Cumulative fees collected by week"><defs><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17803f" stop-opacity=".35"/><stop offset="1" stop-color="#17803f" stop-opacity=".03"/></linearGradient></defs>${grid}${xl}<path d="${area}" fill="url(#fa)"/><path d="${line}" fill="none" stroke="#17803f" stroke-width="2.5" stroke-linejoin="round"/>${dots}</svg>`;
}

/* ---------- views ---------- */
function greet(){const h=NOW.getHours();return h<12?'Good Morning':h<17?'Good Afternoon':'Good Evening'}
function ball(){return `<svg class="ball" viewBox="0 0 190 130" aria-hidden="true"><defs><radialGradient id="bg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e5413c"/><stop offset=".6" stop-color="#b3151b"/><stop offset="1" stop-color="#6e0a0e"/></radialGradient></defs><path d="M0 130 C40 112 120 110 190 118V130Z" fill="#3f8a2a" opacity=".8"/><circle cx="108" cy="62" r="52" fill="url(#bg)"/><path d="M70 28c24 18 24 60 0 88M146 28c-24 18-24 60 0 88" fill="none" stroke="#f4dcc8" stroke-width="1.6" stroke-dasharray="3 3.4"/><path d="M60 40c30 12 62 12 92 0" fill="none" stroke="#f4dcc8" stroke-width="1.2" stroke-dasharray="3 3.4" opacity=".0"/></svg>`}
function recentPlayers(){return players.slice().sort((a,b)=>b.joined-a.joined||b.id-a.id).slice(0,4)}
function dash(){
  const s=stats(),wk=WEEKS_THIS[3]+added();
  const rp=recentPlayers().map((p,i)=>`<tr><td>${i+1}</td><td><div class="who">${av(p.name,28)}${esc(p.name)}</div></td><td>${p.age}</td><td>${esc(bOf(p.batch).name)}</td><td><span class="chip">${p.status}</span></td><td>${fmtD(p.joined)}</td></tr>`).join('');
  const rpay=payments.slice(0,4).map((p,i)=>{const pl=pOf(p.pid);return `<tr><td>${i+1}</td><td><div class="who">${av(pl.name,28)}${esc(pl.name)}</div></td><td>${inr(p.amount)}</td><td>${fmtD(p.date)}</td><td>${p.mode}</td><td><span class="chip">Paid</span></td></tr>`}).join('');
  return `
  <section class="hello"><div><h1>${greet()}, <em>Admin!</em></h1><p>Here’s what’s happening at ${esc(S.cfg.academy)}.</p></div><div class="q">“ Small steps create big players. ”</div>${ball()}</section>
  <section class="kpis" aria-label="Key numbers">
    <div class="card kpi"><div class="tile" style="background:#2f9a4f">${ic('players',34,1.8)}</div><div><div class="lab">Total Players</div><div class="val">${s.total}</div><div class="sub"><span class="up">${ic('up',14,2.5)}</span><span class="up" style="display:flex;gap:4px;align-items:center">${s.joinedMonth} joined this month</span></div></div></div>
    <div class="card kpi"><div class="tile" style="background:#2f8fef">${ic('cal',34,1.8)}</div><div><div class="lab">Today’s Attendance</div><div class="val">${s.pct}%</div><div class="sub">${s.pre} / ${s.exp} present</div></div></div>
    <div class="card kpi"><div class="tile" style="background:#e8a317">${ic('rupee',34,2)}</div><div><div class="lab">Fees Collected</div><div class="val">${inr(s.collected)}</div><div class="sub"><span class="up">${ic('up',14,2.5)}</span><span class="up">${inr(wk)} this week</span></div></div></div>
    <div class="card kpi"><div class="tile" style="background:#d63a3a">${ic('alert',34,2)}</div><div><div class="lab">Pending Fees</div><div class="val" style="color:var(--red)">${inr(s.pending)}</div><div class="sub">${s.pc} players pending</div></div></div>
  </section>
  <section class="two">
    <div class="card"><div class="card-h"><span class="ico">${ic('reports',18)}</span><h2>Attendance Overview</h2><select class="sel" data-chart="att" aria-label="Attendance range"><option value="7" ${S.att==='7'?'selected':''}>Last 7 Days</option><option value="4" ${S.att==='4'?'selected':''}>Last 4 Weeks</option></select></div><div class="card-b" id="attBody">${attChart()}</div></div>
    <div class="card"><div class="card-h"><span class="ico g">${ic('rupee',18)}</span><h2>Fees Collection</h2><select class="sel" data-chart="fee" aria-label="Fees range"><option value="this" ${S.fee==='this'?'selected':''}>This Month</option><option value="last" ${S.fee==='last'?'selected':''}>Last Month</option></select></div><div class="card-b" id="feeBody">${feeChart()}</div></div>
  </section>
  <section class="card qa"><div class="row"><h2><span class="ico" style="background:#fff">${ic('bolt',18)}</span>Quick Actions</h2>
    <button class="btn b-green" data-act="add-player">${ic('plusUser',20)}Add Player</button>
    <button class="btn b-blue" data-act="go" data-to="attendance">${ic('attendance',20)}Mark Attendance</button>
    <button class="btn b-sky" data-act="pay">${ic('rupee',20)}Record Payment</button>
    <button class="btn b-sand" data-act="add-batch">${ic('batches',20)}Create Batch</button>
    <button class="btn b-plain" data-act="receipt">${ic('file',20)}Generate Receipt</button></div></section>
  <section class="two">
    <div class="card"><div class="card-h"><span class="ico">${ic('players',18)}</span><h2>Recent Players</h2><button class="link" data-act="go" data-to="players">View All ${ic('arrow',14)}</button></div><div class="card-b tw"><table><thead><tr><th>#</th><th>Name</th><th>Age</th><th>Batch</th><th>Status</th><th>Joined On</th></tr></thead><tbody>${rp}</tbody></table></div></div>
    <div class="card"><div class="card-h"><span class="ico">${ic('rupee',18)}</span><h2>Recent Payments</h2><button class="link" data-act="go" data-to="fees">View All ${ic('arrow',14)}</button></div><div class="card-b tw"><table><thead><tr><th>#</th><th>Player</th><th>Amount</th><th>Date</th><th>Mode</th><th>Status</th></tr></thead><tbody>${rpay}</tbody></table></div></div>
  </section>`;
}

function playersRows(){
  const q=S.q.trim().toLowerCase();
  const list=players.filter(p=>(S.bf==='all'||p.batch===+S.bf)&&(!q||p.name.toLowerCase().includes(q)||bOf(p.batch).name.toLowerCase().includes(q)||('#'+p.id)===q));
  const shown=list.slice().reverse().slice(0,S.limit);
  const rows=shown.map(p=>`<tr><td>${p.id}</td><td><div class="who">${av(p.name,30)}${esc(p.name)}</div></td><td>${p.age}</td><td>${esc(bOf(p.batch).name)}</td><td><span class="chip">${p.status}</span></td><td>${dues[p.id]?`<span class="chip due">Due ${inr(dues[p.id])}</span>`:'<span class="muted">Clear</span>'}</td><td>${fmtD(p.joined)}</td><td><button class="btn sm b-ghost" data-act="pay" data-pid="${p.id}">Record payment</button></td></tr>`).join('');
  return{count:list.length,html:rows||`<tr><td colspan="8"><div class="empty">No players match. Try a different name or batch.</div></td></tr>`,more:list.length>shown.length};
}
function players_v(){
  const r=playersRows();
  return `<div class="page-h"><h1>Players</h1><button class="btn b-green" data-act="add-player">${ic('plusUser',20)}Add Player</button></div>
  <div class="card"><div class="toolbar"><input type="search" id="pq" placeholder="Search by name or batch" value="${esc(S.q)}" aria-label="Search players"><select id="pb" aria-label="Filter by batch"><option value="all">All batches</option>${batches.map(b=>`<option value="${b.id}" ${S.bf==b.id?'selected':''}>${esc(b.name)}</option>`).join('')}</select><span class="muted" id="pcount">${r.count} players</span></div>
  <div class="card-b tw"><table><thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Batch</th><th>Status</th><th>Fees</th><th>Joined On</th><th></th></tr></thead><tbody id="prows">${r.html}</tbody></table></div>
  <div class="sumline" id="pmore" style="${r.more?'':'display:none'}"><button class="btn sm b-plain" data-act="more">Show more players</button></div></div>`;
}
function updPlayers(){const r=playersRows();$('#prows').innerHTML=r.html;$('#pcount').textContent=r.count+' players';$('#pmore').style.display=r.more?'':'none'}

function batches_v(){
  return `<div class="page-h"><h1>Batches</h1><button class="btn b-sand" data-act="add-batch">${ic('batches',20)}Create Batch</button></div>
  <div class="grid3">${batches.map(b=>{
    const m=players.filter(p=>p.batch===b.id),pre=m.filter(p=>p.today==='P').length,pct=b.runs&&m.length?Math.round(pre/m.length*100):0;
    return `<div class="card batch"><div style="display:flex;gap:8px;align-items:center"><h3 style="flex:1">${esc(b.name)}</h3><span class="chip ${b.runs?'':'info'}">${b.runs?'Session today':'No session today'}</span></div>
    <dl class="kv"><dt>Coach</dt><dd>${esc(b.coach)}</dd><dt>Timing</dt><dd>${esc(b.time)}</dd><dt>Days</dt><dd>${esc(b.days)}</dd><dt>Monthly fee</dt><dd>${inr(b.fee)}</dd><dt>Players</dt><dd>${m.length}</dd></dl>
    <div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span class="muted">Today’s attendance</span><b>${b.runs?pct+'%':'—'}</b></div><div class="meter"><i style="width:${pct}%"></i></div></div>
    <button class="btn sm b-ghost" data-act="att-batch" data-bid="${b.id}">Mark attendance</button></div>`}).join('')}</div>`;
}

function attRow(p){return `<div class="att-row" data-pid="${p.id}"><div class="who">${av(p.name,34)}<div><div>${esc(p.name)}</div><div class="muted" style="font-size:12px">Age ${p.age}</div></div></div><div class="seg" role="group" aria-label="Attendance for ${esc(p.name)}"><button class="p" data-act="mark" data-v="P" aria-pressed="${p.today==='P'}">Present</button><button class="a" data-act="mark" data-v="A" aria-pressed="${p.today==='A'}">Absent</button></div></div>`}
function attSum(){
  const m=players.filter(p=>p.batch===S.attBatch),pre=m.filter(p=>p.today==='P').length,ab=m.filter(p=>p.today==='A').length;
  return `<span class="chip">${pre} present</span><span class="chip due">${ab} absent</span><span class="chip warn">${m.length-pre-ab} not marked</span>`;
}
function attendance_v(){
  const m=players.filter(p=>p.batch===S.attBatch);
  return `<div class="page-h"><h1>Attendance</h1><span class="muted">${NOW.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span></div>
  <div class="card"><div class="toolbar"><select id="ab" aria-label="Batch">${batches.map(b=>`<option value="${b.id}" ${S.attBatch===b.id?'selected':''}>${esc(b.name)} · ${esc(b.time)}</option>`).join('')}</select><button class="btn sm b-green" data-act="all-present">Mark all present</button><button class="btn sm b-plain" data-act="clear-att">Clear</button></div>
  <div class="sumline" id="asum">${attSum()}</div><div id="arows">${m.map(attRow).join('')}</div></div>`;
}

function fees_v(){
  const s=stats();
  const dl=Object.entries(dues).map(([id,a])=>{const p=pOf(+id);return `<tr><td><div class="who">${av(p.name,28)}${esc(p.name)}</div></td><td>${esc(bOf(p.batch).name)}</td><td><b style="color:var(--red)">${inr(a)}</b></td><td><button class="btn sm b-green" data-act="pay" data-pid="${p.id}">Collect</button></td></tr>`}).join('');
  return `<div class="page-h"><h1>Fees &amp; Payments</h1><button class="btn b-sky" data-act="pay">${ic('rupee',20)}Record Payment</button></div>
  <section class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))"><div class="card kpi"><div><div class="lab">Collected this month</div><div class="val">${inr(s.collected)}</div></div></div><div class="card kpi"><div><div class="lab">Pending</div><div class="val" style="color:var(--red)">${inr(s.pending)}</div><div class="sub">${s.pc} players</div></div></div></section>
  <section class="two"><div class="card"><div class="card-h"><span class="ico">${ic('alert',18)}</span><h2>Pending fees</h2></div><div class="card-b tw">${dl?`<table><thead><tr><th>Player</th><th>Batch</th><th>Due</th><th></th></tr></thead><tbody>${dl}</tbody></table>`:'<div class="empty">All fees are cleared. Nice work.</div>'}</div></div>
  <div class="card"><div class="card-h"><span class="ico g">${ic('rupee',18)}</span><h2>Recent payments</h2></div><div class="card-b tw"><table><thead><tr><th>Receipt</th><th>Player</th><th>Amount</th><th>Date</th><th>Mode</th></tr></thead><tbody>${payments.slice(0,12).map(p=>`<tr><td>${p.rc}</td><td>${esc(pOf(p.pid).name)}</td><td>${inr(p.amount)}</td><td>${fmtD(p.date)}</td><td>${p.mode}</td></tr>`).join('')}</tbody></table></div></div></section>`;
}
function receipts_v(){
  return `<div class="page-h"><h1>Receipts</h1></div><div class="card"><div class="card-b tw"><table><thead><tr><th>Receipt no.</th><th>Player</th><th>Amount</th><th>Date</th><th>Mode</th><th></th></tr></thead><tbody>${payments.map(p=>`<tr><td>${p.rc}</td><td>${esc(pOf(p.pid).name)}</td><td>${inr(p.amount)}</td><td>${fmtD(p.date)}</td><td>${p.mode}</td><td><button class="btn sm b-ghost" data-act="receipt" data-id="${p.id}">View &amp; print</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function notifications_v(){
  return `<div class="page-h"><h1>Notifications</h1><button class="btn sm b-plain" data-act="read-all" ${unread()?'':'disabled'}>Mark all as read</button></div><div class="card">${notes.map((n,i)=>`<div class="note ${n.r?'':'unread'}"><span class="ico ${n.k==='fees'?'':'g'}">${ic(n.k==='fees'?'rupee':n.k==='att'?'attendance':'players',18)}</span><div style="flex:1"><b>${esc(n.t)}</b><div class="muted">${esc(n.d)}</div></div>${n.r?'':`<button class="link" data-act="read" data-i="${i}">Mark read</button>`}</div>`).join('')}</div>`;
}
function roles_v(){
  return `<div class="page-h"><h1>Users &amp; Roles</h1></div><div class="card"><div class="card-b tw"><table><thead><tr><th>User</th><th>Email</th><th>Role</th></tr></thead><tbody>${staff.map((u,i)=>`<tr><td><div class="who">${av(u.n,30)}${esc(u.n)}</div></td><td>${esc(u.e)}</td><td><select class="sel" data-role="${i}" aria-label="Role for ${esc(u.n)}" ${i===0?'disabled':''}>${['Admin','Coach','Accountant','Front desk'].map(r=>`<option ${u.r===r?'selected':''}>${r}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div></div>`;
}
function reports_v(){
  const s=stats(),mt=Object.values(s.modes).reduce((a,b)=>a+b,0);
  return `<div class="page-h"><h1>Reports</h1></div><section class="two">
  <div class="card"><div class="card-h"><span class="ico">${ic('attendance',18)}</span><h2>Today’s attendance by batch</h2></div><div class="card-b">${batches.filter(b=>b.runs).map(b=>{const m=players.filter(p=>p.batch===b.id),pr=m.filter(p=>p.today==='P').length,pc=m.length?Math.round(pr/m.length*100):0;return `<div class="hbar"><span>${esc(b.name)}</span><div class="meter"><i style="width:${pc}%;background:var(--bar)"></i></div><b>${pc}%</b></div>`}).join('')}</div></div>
  <div class="card"><div class="card-h"><span class="ico g">${ic('rupee',18)}</span><h2>Fees by payment mode</h2></div><div class="card-b">${Object.entries(s.modes).map(([k,v])=>`<div class="hbar"><span>${k}</span><div class="meter"><i style="width:${Math.round(v/mt*100)}%"></i></div><b>${Math.round(v/mt*100)}%</b></div>`).join('')}<p class="muted" style="margin:10px 0 0">Total ${inr(mt)} this month</p></div></div>
  <div class="card"><div class="card-h"><span class="ico">${ic('batches',18)}</span><h2>Players per batch</h2></div><div class="card-b">${batches.map(b=>{const n=players.filter(p=>p.batch===b.id).length;return `<div class="hbar"><span>${esc(b.name)}</span><div class="meter"><i style="width:${n/players.length*100*2.2}%;background:#e8a317"></i></div><b>${n}</b></div>`}).join('')}</div></div></section>`;
}
function settings_v(){
  return `<div class="page-h"><h1>Settings</h1></div><div class="card"><form id="cfgForm" class="card-b" style="display:flex;flex-direction:column;gap:14px;max-width:520px;padding-top:16px">
  <label class="f">Academy name<input name="academy" value="${esc(S.cfg.academy)}" required></label>
  <div class="two-f"><label class="f">Receipt prefix<input name="prefix" value="${esc(S.cfg.prefix)}" maxlength="4"></label><label class="f">Fee reminder day<input name="remind" type="number" min="1" max="28" value="${S.cfg.remind}"></label></div>
  <label class="f">Theme<select name="theme"><option value="auto">Match my device</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
  <div><button class="btn b-green" type="submit">Save settings</button></div></form></div>`;
}

const VIEWS={dashboard:dash,players:players_v,batches:batches_v,attendance:attendance_v,fees:fees_v,receipts:receipts_v,notifications:notifications_v,roles:roles_v,reports:reports_v,settings:settings_v};
function render(){
  if(!VIEWS[S.route])S.route='dashboard';
  $('#view').innerHTML=VIEWS[S.route]();
  renderNav();
  document.title=(ROUTES.find(r=>r[0]===S.route)[1].replace('&amp;','&'))+' · Kshetram Cricket Academy ERP';
}

/* ---------- modals ---------- */
const dlg=$('#dlg'),form=$('#dlgForm');let onSubmit=null;
function modal(title,body,okLabel,fn,wide){
  dlg.className=wide?'wide':'';
  form.innerHTML=`<div class="dlg-h"><h2>${title}</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close" style="color:var(--ink)">${ic('x',20)}</button></div><div class="dlg-b">${body}<div class="err" id="err" role="alert"></div></div><div class="dlg-f"><button type="button" class="btn b-plain" data-act="close">Cancel</button>${okLabel?`<button type="submit" class="btn b-green">${okLabel}</button>`:''}</div>`;
  onSubmit=fn;if(!dlg.open)dlg.showModal();
  const f=form.querySelector('input,select');if(f&&matchMedia('(pointer:fine)').matches)f.focus();
}
form.addEventListener('submit',e=>{e.preventDefault();if(onSubmit)onSubmit(new FormData(form))});
const fail=m=>{$('#err').textContent=m};
const batchOpts=sel=>batches.map(b=>`<option value="${b.id}" ${sel===b.id?'selected':''}>${esc(b.name)} · ${inr(b.fee)}/month</option>`).join('');

function addPlayer(){
  modal('Add player',`<label class="f">Full name<input name="name" required autocomplete="off"></label><div class="two-f"><label class="f">Age<input name="age" type="number" min="5" max="60" required></label><label class="f">Batch<select name="batch">${batchOpts()}</select></label></div>`,'Add player',fd=>{
    const name=String(fd.get('name')).trim(),age=+fd.get('age');
    if(!name)return fail('Enter the player’s name.');
    if(!(age>=5&&age<=60))return fail('Enter an age between 5 and 60.');
    const p={id:players.length+1,name,age,batch:+fd.get('batch'),status:'Active',joined:new Date(NOW),today:null};
    players.push(p);dues[p.id]=bOf(p.batch).fee;
    pushNote(`${name} joined ${bOf(p.batch).name}`,`First month fee of ${inr(bOf(p.batch).fee)} is pending.`,'player');
    dlg.close();toast(`${name} added to ${bOf(p.batch).name}`);render();
  });
}
function addBatch(){
  modal('Create batch',`<label class="f">Batch name<input name="name" placeholder="e.g. U-17 Evening" required></label><div class="two-f"><label class="f">Coach<input name="coach" required></label><label class="f">Monthly fee (₹)<input name="fee" type="number" min="0" step="100" required></label></div><div class="two-f"><label class="f">Timing<input name="time" placeholder="5:00 – 7:00 PM" required></label><label class="f">Days<select name="days"><option>Mon – Fri</option><option>Mon – Sat</option><option>Sat – Sun</option><option>Daily</option></select></label></div>`,'Create batch',fd=>{
    const name=String(fd.get('name')).trim();
    if(!name||!String(fd.get('coach')).trim())return fail('Enter a batch name and a coach.');
    if(batches.some(b=>b.name.toLowerCase()===name.toLowerCase()))return fail('A batch with this name already exists.');
    batches.push({id:Math.max(...batches.map(b=>b.id))+1,name,coach:String(fd.get('coach')).trim(),time:String(fd.get('time')).trim(),days:fd.get('days'),fee:+fd.get('fee')||0,runs:false,n:0,a:[5,60]});
    dlg.close();toast(`Batch “${name}” created`);render();
  });
}
function recordPayment(pid){
  const pre=pid?pOf(pid):null;
  const label=p=>`${p.name} — ${bOf(p.batch).name} · #${p.id}`;
  modal('Record payment',`<label class="f">Player<input name="player" list="plist" value="${pre?esc(label(pre)):''}" placeholder="Start typing a name" required autocomplete="off"><span class="hint">Pick from the list so the right player is chosen.</span></label><datalist id="plist">${players.map(p=>`<option value="${esc(label(p))}">`).join('')}</datalist>
  <div class="two-f"><label class="f">Amount (₹)<input name="amount" id="amt" type="number" min="1" step="1" value="${pre?(dues[pre.id]||bOf(pre.batch).fee):''}" required></label><label class="f">Mode<select name="mode"><option>UPI</option><option>Cash</option><option>Card</option></select></label></div>`,'Save payment',fd=>{
    const m=/#(\d+)\s*$/.exec(String(fd.get('player')));const p=m&&pOf(+m[1]);
    if(!p)return fail('Choose a player from the list.');
    const amount=+fd.get('amount');if(!(amount>0))return fail('Enter an amount greater than zero.');
    const pay={id:payments.length+1,rc:S.cfg.prefix+'-'+(rcNo++),pid:p.id,amount,date:new Date(NOW),mode:fd.get('mode'),added:true};
    payments.unshift(pay);
    if(dues[p.id]){dues[p.id]-=amount;if(dues[p.id]<=0)delete dues[p.id]}
    pushNote(`Payment received from ${p.name}`,`${inr(amount)} by ${pay.mode} · ${pay.rc}`,'fees');
    dlg.close();toast(`${inr(amount)} recorded for ${p.name}`);render();
  });
  const inp=form.querySelector('[name=player]');
  inp.addEventListener('change',()=>{const m=/#(\d+)\s*$/.exec(inp.value),p=m&&pOf(+m[1]);if(p)$('#amt').value=dues[p.id]||bOf(p.batch).fee});
}
function receiptHTML(pay){
  const p=pOf(pay.pid),b=bOf(p.batch);
  return `<h3>${esc(S.cfg.academy.toUpperCase())}</h3><div class="muted">Fee receipt · ${pay.rc}</div><hr style="border:0;border-top:1px solid var(--line);margin:12px 0">
  <dl class="kv" style="font-size:14px;gap:8px 16px"><dt>Date</dt><dd>${fmtD(pay.date)}</dd><dt>Received from</dt><dd>${esc(p.name)} (#${p.id})</dd><dt>Batch</dt><dd>${esc(b.name)}</dd><dt>Towards</dt><dd>Monthly coaching fee</dd><dt>Payment mode</dt><dd>${pay.mode}</dd><dt>Balance due</dt><dd>${inr(dues[p.id]||0)}</dd></dl>
  <div class="tot"><span>Amount paid</span><span>${inr(pay.amount)}</span></div>`;
}
function openReceipt(id){
  const pay=payments.find(p=>p.id===id)||payments[0];
  modal('Fee receipt',`<label class="f">Receipt<select id="rsel">${payments.slice(0,15).map(p=>`<option value="${p.id}" ${p.id===pay.id?'selected':''}>${p.rc} · ${esc(pOf(p.pid).name)} · ${inr(p.amount)}</option>`).join('')}</select></label><div class="receipt" id="rbody">${receiptHTML(pay)}</div>`,null,null,true);
  const f=form.querySelector('.dlg-f');
  f.insertAdjacentHTML('beforeend',`<button type="button" class="btn b-green" data-act="print" data-id="${pay.id}">${ic('print',18)}Print receipt</button>`);
  $('#rsel').addEventListener('change',e=>{const x=payments.find(p=>p.id===+e.target.value);$('#rbody').innerHTML=receiptHTML(x);form.querySelector('[data-act=print]').dataset.id=x.id});
}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2800)}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t){return}
  const a=t.dataset.act;
  switch(a){
    case 'go':location.hash='#'+t.dataset.to;break;
    case 'add-player':addPlayer();break;
    case 'add-batch':addBatch();break;
    case 'pay':recordPayment(t.dataset.pid?+t.dataset.pid:null);break;
    case 'receipt':openReceipt(t.dataset.id?+t.dataset.id:null);break;
    case 'close':dlg.close();break;
    case 'print':{const x=payments.find(p=>p.id===+t.dataset.id);$('#printArea').innerHTML=`<div class="receipt" style="background:#fff;border-color:#999">${receiptHTML(x)}</div>`;try{window.print()}catch(_){toast('Printing is not available here. Open the page in a browser tab.')}break}
    case 'more':S.limit+=25;updPlayers();break;
    case 'att-batch':S.attBatch=+t.dataset.bid;location.hash='#attendance';break;
    case 'mark':{
      const row=t.closest('.att-row'),p=pOf(+row.dataset.pid),v=t.dataset.v;
      p.today=p.today===v?null:v;bOf(p.batch).runs=true;
      row.outerHTML=attRow(p);$('#asum').innerHTML=attSum();break}
    case 'all-present':players.filter(p=>p.batch===S.attBatch).forEach(p=>p.today='P');bOf(S.attBatch).runs=true;render();toast('Everyone in this batch is marked present');break;
    case 'clear-att':players.filter(p=>p.batch===S.attBatch).forEach(p=>p.today=null);render();break;
    case 'read':notes[+t.dataset.i].r=true;render();break;
    case 'read-all':notes.forEach(n=>n.r=true);render();break;
  }
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.chart==='att'){S.att=t.value;$('#attBody').innerHTML=attChart()}
  else if(t.dataset.chart==='fee'){S.fee=t.value;$('#feeBody').innerHTML=feeChart()}
  else if(t.id==='pb'){S.bf=t.value;S.limit=25;updPlayers()}
  else if(t.id==='ab'){S.attBatch=+t.value;render()}
  else if(t.dataset.role!==undefined){staff[+t.dataset.role].r=t.value;toast('Role updated')}
});
document.addEventListener('input',e=>{if(e.target.id==='pq'){S.q=e.target.value;$('#gsearch').value=S.q;S.limit=25;updPlayers()}});
document.addEventListener('submit',e=>{
  if(e.target.id==='cfgForm'){
    e.preventDefault();const fd=new FormData(e.target);
    S.cfg.academy=String(fd.get('academy')).trim()||S.cfg.academy;S.cfg.prefix=(String(fd.get('prefix')).trim()||'RC').toUpperCase();S.cfg.remind=+fd.get('remind')||5;
    const th=fd.get('theme');if(th==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',th);
    toast('Settings saved');
  }
});
const gs=$('#gsearch');
gs.addEventListener('input',()=>{S.q=gs.value;if(S.route==='players'){$('#pq').value=S.q;S.limit=25;updPlayers()}});
gs.addEventListener('keydown',e=>{if(e.key==='Enter'){S.limit=25;if(S.route==='players')render();else location.hash='#players'}});
$('#bell').addEventListener('click',()=>location.hash='#notifications');
$('#me').addEventListener('click',()=>location.hash='#settings');
const setNav=o=>{document.body.classList.toggle('nav-open',o);$('#menuBtn').setAttribute('aria-expanded',o)};
$('#menuBtn').addEventListener('click',()=>setNav(!document.body.classList.contains('nav-open')));
$('#scrim').addEventListener('click',()=>setNav(false));
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
function route(){S.route=(location.hash||'#dashboard').slice(1);setNav(false);render();window.scrollTo(0,0)}
window.addEventListener('hashchange',route);
route();
})();
