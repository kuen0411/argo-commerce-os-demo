import {ACTORS,STAGES,CASE_LABELS,TASK_STATUSES,SEED,STORAGE_KEY,ROLE_KEY,TOUR_KEY,clone,loadState,saveState,person,account,store,caseById,settlement,ownerOf,currentOperator,operatorAt,platform,roleOf,amount,paid,outstanding,money,visibleStores,visibleCases,visibleTasks,canManageTask,visibleSettlements,visibleDocuments,visiblePeople,canViewStore,canViewCase,createTask,updateTask,deleteTask,addTaskEvidence,requestExpense,decideExpense,submitCrm,confirmCrm,createCase,addDocument,updateDocumentVersion,assignPenalty,createSettlement,addAdjustment,addPayment,lockSettlement,requestHandover,requestExit,advanceCase,exitBlockers,addRecord,addMovement,updateMovement,markNotification,createPerson,createPlatformAccount,updatePlatformAccount,createStore,updateStore,createOwnerBusiness,assignSales,addPersonDocument,createLogin,setLoginStatus,addPlatform,updateLogin,resetLoginPassword,setDeletionPassword,setMerchantStatus,adminEdit,adminDelete} from './model.mjs';

let state=loadState();
let role=localStorage.getItem(ROLE_KEY)||'ops';
if(!ACTORS[role])role=ACTORS.ops?'ops':'admin';
const pathname=location.pathname.split('/').pop()||'index.html';
const page=pathname.replace('.html','')||'index';
const query=new URLSearchParams(location.search);
const detailId=query.get('id');
const filterState={};
let chartPeriod='30日';
let modalContext={};

const paths={
  dashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><path d="M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1"/>',
  store:'<path d="M3 9h18l-2-5H5zM5 9v11h14V9M9 20v-7h6v7"/>',
  accounts:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  cases:'<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 3h8M8 10h8M8 14h8M8 18h5"/>',
  tasks:'<path d="m4 7 2 2 4-4M13 7h7M4 16l2 2 4-4M13 16h7"/>',
  docs:'<path d="M6 2h8l5 5v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v6h5M8 13h8M8 17h8"/>',
  finance:'<rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 10h20M16 15h3"/>',
  operations:'<path d="M3 7h12v11H3zM15 11h4l2 3v4h-6M7 18a2 2 0 1 0 4 0M17 18a2 2 0 1 0 4 0"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-7M3 4v5h5M12 7v5l4 2"/>',
  search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  alert:'<path d="M12 3 2 21h20L12 3zM12 9v5m0 4h.01"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
  chart:'<path d="M3 20V4M3 20h18M6 16l5-6 4 3 5-7"/>',
  shield:'<path d="M12 2 4 5v7c0 5 3 8 8 10 5-2 8-5 8-10V5zM9 12l2 2 4-4"/>',
  reset:'<path d="M3 12a9 9 0 1 1 3 6M3 17v4h4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
  file:'<path d="M5 3h9l5 5v13H5zM14 3v5h5"/>'
};
function icon(name){return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.layers)+'</svg>'}
function esc(x){return String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function link(pageName,id){return './'+pageName+'.html'+(id?'?id='+encodeURIComponent(id):'')}
function button(label,action,kind='btn',id='',extra=''){return '<button class="'+kind+'" data-action="'+action+'"'+(id?' data-id="'+esc(id)+'"':'')+extra+'>'+label+'</button>'}
function modalButton(label,kind,id='',cls='btn',extra=''){return button(label,'modal',cls,id,' data-kind="'+kind+'"'+extra)}
function pageHead(kicker,title,desc,actions=''){return '<div class="page-head"><div><div class="eyebrow">'+kicker+'</div><h1>'+title+'</h1><p>'+desc+'</p></div><div class="head-actions">'+actions+'</div></div>'}
function card(title,body,subtitle='',action=''){return '<section class="card"><div class="card-head"><div><h2>'+title+'</h2>'+(subtitle?'<p>'+subtitle+'</p>':'')+'</div>'+action+'</div><div class="card-body'+(body.startsWith('<div class="row')||body.startsWith('<div class="table-wrap')?' flush':'')+'">'+body+'</div></section>'}
function pill(status){let cls=/完成|已結案|正常|已備妥|已入庫|已出貨|已確認|已歸還/.test(status)?'ok':/缺|逾|異常|待確認|罰款|已關閉/.test(status)?'bad':/待|進行|處理|即將|對貨/.test(status)?'warn':'info';return '<span class="pill '+cls+'">'+esc(status)+'</span>'}
function row(iconName,title,subtitle,hrefValue,status='',color='blue'){return '<a class="row click" href="'+hrefValue+'"><span class="row-icon '+color+'">'+icon(iconName)+'</span><span class="row-main"><b>'+title+'</b><small>'+subtitle+'</small></span><span class="row-end">'+(status?pill(status):'')+'<span>→</span></span></a>'}
function metric(label,value,caption,ico,color='blue'){return '<div class="card metric-card"><span class="micon '+color+'">'+icon(ico)+'</span><span class="label">'+label+'</span><strong>'+value+'</strong><small>'+caption+'</small></div>'}
function name(id){return ACTORS[id]?.name||person(state,id)?.name||id||'—'}
function storeName(id){return store(state,id)?.name||'—'}
function act(){return roleOf(role)}
function isOps(){return ['ops','admin'].includes(act().kind)}
function canManageOwners(){return isOps()||act().kind==='sales'}
function isCaseManager(c){return isOps()||(act().kind==='finance'&&c.type==='Reconciliation')}
function showPerson(p){return act().kind!=='merchant'&&visiblePeople(state,role).some(x=>x.id===p.id)}
function localDate(d){return d?esc(d):'—'}
function dataTime(t){return esc(t?.slice(0,16)||'—')}
function notifyCount(){return state.notifications.filter(n=>n.recipient===role&&!n.read).length}
function navItems(){
  if(act().kind==='admin')return [['index','dashboard','總覽'],['people','people','合作對象'],['accounts','accounts','平台帳號'],['stores','store','店舖'],['cases','cases','案件'],['tasks','tasks','任務'],['docs','docs','文件'],['finance','finance','財務'],['operations','operations','電商與物流'],['history','history','歷程與稽核'],['settings','settings','系統設定'],['admin','shield','管理稽核']];
  if(act().kind==='merchant')return [['index','dashboard','工作台'],['stores','store','我的店舖'],['cases','cases','相關案件'],['tasks','tasks','我的任務'],['docs','docs','佐證文件'],['finance','finance','帳務對帳'],['operations','operations','營運摘要']];
  if(act().kind==='sales')return [['index','dashboard','業務工作台'],['people','people','我的號主'],['accounts','accounts','號主帳號'],['stores','store','關聯店舖'],['cases','cases','相關案件'],['tasks','tasks','我的任務'],['docs','docs','文件']];
  if(act().kind==='marketing')return [['index','dashboard','行銷工作台'],['stores','store','店舖摘要'],['tasks','tasks','行銷任務'],['docs','docs','行銷文件'],['operations','operations','成效摘要']];
  if(act().kind==='owner')return [['index','dashboard','工作台'],['people','people','我的資料'],['accounts','accounts','我的帳號'],['stores','store','關聯店舖'],['cases','cases','相關案件'],['tasks','tasks','我的任務'],['docs','docs','文件'],['finance','finance','相關帳務']];
  if(act().kind==='finance')return [['index','dashboard','會計工作台'],['stores','store','責任店舖'],['cases','cases','對帳案件'],['tasks','tasks','我的任務'],['docs','docs','來源文件'],['finance','finance','結算對帳'],['operations','operations','營運摘要'],['history','history','歷程']];
  return [['index','dashboard','營運工作台'],['people','people','人與合作'],['accounts','accounts','平台帳號'],['stores','store','店舖管理'],['cases','cases','案件中心'],['tasks','tasks','任務協作'],['docs','docs','文件佐證'],['finance','finance','財務對帳'],['operations','operations','電商與物流'],['history','history','歷程與稽核']];
}
function shell(content){
  let items=navItems();
  let nav=items.map(([key,ico,label])=>'<a class="nav-item '+(page===key?'active':'')+'" href="'+link(key==='index'?'index':key)+'">'+icon(ico)+'<span>'+label+'</span></a>').join('');
  let mobileKeys=['index','stores','cases','tasks','finance'];
  let mobile=mobileKeys.map(k=>{let n=items.find(x=>x[0]===k);return n?'<a href="'+link(k)+'" class="'+(page===k?'active':'')+'">'+icon(n[1])+'<span>'+n[2].replace('管理','')+'</span></a>':''}).join('');
  let actor=act();
  return '<div class="site"><header class="topbar"><a href="./index.html" class="brand"><span class="mark">A</span><span><span class="brand-title">ARGO Commerce OS</span><span class="brand-sub">OPERATION INTELLIGENCE</span></span></a><button class="top-search" data-action="modal" data-kind="search">'+icon('search')+' 搜尋人物、店舖、案件或文件 <span style="margin-left:auto">⌘ K</span></button><div class="top-actions"><span class="demo-pill">SIMULATED DATA</span><button class="top-icon" title="介面導覽" data-action="modal" data-kind="tour">'+icon('layers')+'</button><button class="top-icon" title="通知" data-action="modal" data-kind="notifications">'+icon('bell')+(notifyCount()?'<span class="dot-count">'+notifyCount()+'</span>':'')+'</button><button class="actor-btn" data-action="modal" data-kind="role" title="切換展示身分"><span class="avatar">'+actor.initial+'</span><span><strong>'+actor.name+'</strong><small>'+actor.title+'</small></span><span class="chev">▾</span></button></div></header><div class="layout"><aside class="sidebar"><div class="nav-caption">WORKSPACE</div><nav class="nav-list">'+nav+'</nav><div class="side-bottom">ARGO / INTERACTIVE DEMO<br>展示資料暫存在此瀏覽器。</div></aside><main class="content" id="main-content">'+content+'</main></div><nav class="mobile-nav">'+mobile+'</nav></div>';
}
function spark(values,large=false){
  const max=Math.max(1,...values)*1.13,min=Math.min(0,...values)*.78,w=large?660:210,h=large?170:40;
  const points=values.map((v,i)=>[i*w/(values.length-1),h-(v-min)/(max-min)*h]);
  const line=points.map(([x,y])=>x.toFixed(1)+','+y.toFixed(1)).join(' ');
  const area='0,'+h+' '+line+' '+w+','+h;
  return '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" role="img" aria-label="模擬銷售走勢"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#5db8b5" stop-opacity=".32"/><stop offset="1" stop-color="#5db8b5" stop-opacity=".01"/></linearGradient></defs><polygon points="'+area+'" fill="url(#chart-fill)"/><polyline points="'+line+'" fill="none" stroke="#2d9e97" stroke-width="'+(large?3:2)+'" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+points.at(-1)[0]+'" cy="'+points.at(-1)[1]+'" r="'+(large?5:3)+'" fill="#2d9e97" stroke="white" stroke-width="2"/></svg>';
}
function chart(values,total){
  const series=chartPeriod==='7日'?values:chartPeriod==='90日'?values.map((v,i)=>v*.78+i*4):values.map((v,i)=>v*.91+i*2);
  return '<div class="chart-top"><div><small>可見店舖銷售摘要・展示數據</small><strong>'+money(total)+'</strong></div><div class="segment">'+['7日','30日','90日'].map(p=>'<button data-action="chart-period" data-period="'+p+'" class="'+(p===chartPeriod?'active':'')+'">'+p+'</button>').join('')+'</div></div><div class="chart-wrap">'+spark(series,true)+'<div class="chart-labels"><span>第 1 期</span><span>第 2 期</span><span>第 3 期</span><span>第 4 期</span><span>第 5 期</span><span>第 6 期</span><span>最新</span></div></div>';
}
function caseRow(c){
  const completed=c.requirements.filter(r=>r.docId).length,total=c.requirements.length;
  const subtitle=storeName(c.storeId)+' · '+CASE_LABELS[c.type]+' · 下一步：'+esc(c.next);
  return '<a class="row click" href="'+link('cases',c.id)+'"><span class="row-icon '+(c.type==='Penalty'?'red':c.type==='Reconciliation'?'amber':'blue')+'">'+icon('cases')+'</span><span class="row-main"><b>'+esc(c.code)+'　'+esc(c.title)+'</b><small>'+subtitle+'</small>'+(total?'<div class="progress"><i style="width:'+Math.round(completed/total*100)+'%"></i></div>':'')+'</span><span class="row-end">'+pill(c.status)+'</span></a>';
}
function taskRow(t,inline=false){
  const due=t.due&&t.due<'2026-10-15'&&t.status!=='完成'?' · 逾期':'';
  return '<div class="row"><span class="row-icon '+(t.status==='完成'?'teal':'amber')+'">'+icon('tasks')+'</span><span class="row-main"><b>'+esc(t.title)+'</b><small>'+storeName(t.storeId)+' · '+esc(name(t.assignee))+' · 截止 '+esc(t.due)+due+'</small></span><span class="row-end">'+pill(t.status)+(inline||!canManageTask(state,role,t.id)?'':' '+modalButton('處理','task-status',t.id,'btn tiny'))+'</span></div>';
}
function miniEvent(r){return '<div class="event"><time>'+dataTime(r.time)+' · '+esc(name(r.actor))+'</time><b>'+esc(r.title)+'</b><small>'+esc(r.detail)+'</small></div>'}
function renderDashboard(){
  const st=visibleStores(state,role),cs=visibleCases(state,role),ts=visibleTasks(state,role),fs=visibleSettlements(state,role);
  const active=cs.filter(x=>x.status!=='已結案'),missing=active.filter(x=>x.requirements.some(r=>!r.docId));
  const title=act().kind==='owner'?'你的帳號，有哪些事需要配合？':act().kind==='merchant'?'你的店舖，今天需要處理什麼？':act().kind==='finance'?'把每一筆差異，對到有根據。':act().kind==='admin'?'查看系統歷程與異常修正。':'把三方合作的每件事，追到結果。';
  const desc=act().kind==='owner'?'驗證、文件、稅務與帳號狀態都集中在這裡。':act().kind==='merchant'?'經營摘要、帳務、文件與任務，依你的責任店舖顯示。':'店舖、人物、責任、文件與金額連成可回顧的營運脈絡。';
  const hero='<div class="hero"><div><div class="eyebrow">ARGO COMMERCE OS / LIVE WALKTHROUGH</div><h1>'+title+'</h1><p>'+desc+'</p><a class="btn primary" href="'+link(active.length?'cases':'stores',active[0]?.id)+'">'+(active.length?'查看待處理案件':'查看店舖')+'　'+icon('arrow')+'</a></div><div class="hero-decoration"><b>A/OS</b><small>OPERATIONS, CONNECTED.</small></div></div>';
  const kpis='<div class="grid kpi">'+metric('可見店舖',st.length,'依目前身分範圍','store','blue')+metric('進行中案件',active.length,'其中 '+missing.length+' 件缺資料','cases','amber')+metric('待處理任務',ts.filter(x=>!['完成','取消','不執行','重複建立'].includes(x.status)).length,'負責或建立的任務','tasks','teal')+metric('待處理款項',money(fs.reduce((a,f)=>a+outstanding(f),0)),'示範計算','finance','violet')+'</div>';
  const aggregate=[0,1,2,3,4,5,6].map(i=>st.reduce((sum,x)=>sum+x.trend[i],0));
  const chartCard=card('銷售趨勢',chart(aggregate,st.reduce((a,x)=>a+x.sales,0)),'依可見店舖彙整，資料為模擬');
  const caseCard=card('優先處理',active.slice(0,4).map(caseRow).join('')||'<div class="empty">目前沒有待處理案件</div>','案件資料隨操作更新','<a class="btn tiny" href="'+link('cases')+'">全部案件 →</a>');
  const taskCard=card('我的工作清單',ts.filter(x=>x.status!=='完成').slice(0,4).map(x=>taskRow(x,true)).join('')||'<div class="empty">目前沒有待辦</div>','每件任務都有來源與完成條件','<a class="btn tiny" href="'+link('tasks')+'">查看任務 →</a>');
  const sourceCard=card('模擬資料來源','<div class="list-mini"><div><span>Shopee</span><strong>銷售摘要 · 平台帳單</strong></div><div><span>momo</span><strong>銷售摘要 · 商品</strong></div><div><span>酷澎</span><strong>帳號狀態 · 物流</strong></div><div><span>資料標記</span><strong class="link">示範輸入 / 模擬匯出</strong></div></div>','平台狀態僅作展示');
  const scenarios='<div class="split-title">GUIDED SCENARIOS　四段可操作情境</div><div class="grid two"><a class="scenario" href="'+link('cases','cv1')+'"><span class="number">01</span><span><b>平台驗證・三方補件</b><small>缺件 → 任務 → 補證據 → 提交</small></span><span class="arrow">→</span></a><a class="scenario" href="'+link('cases','cp1')+'"><span class="number">02</span><span><b>罰款與責任期間</b><small>事發日、通知日與歷任店主</small></span><span class="arrow">→</span></a><a class="scenario" href="'+link('stores','s1')+'"><span class="number">03</span><span><b>店主交接</b><small>盤點 → 確認 → 保留舊關係</small></span><span class="arrow">→</span></a><a class="scenario" href="'+link('people','p2')+'"><span class="number">04</span><span><b>號主退出</b><small>未結事項 → 帳號歸還 → 關店</small></span><span class="arrow">→</span></a></div>';
  return hero+kpis+'<div class="grid two">'+chartCard+'<div class="stack">'+caseCard+sourceCard+'</div></div><div class="split-title">WORK QUEUE　責任與待辦</div><div class="grid two">'+taskCard+card('最近重要事件','<div class="timeline">'+state.records.filter(r=>st.some(x=>x.id===r.storeId)).slice(0,4).map(miniEvent).join('')+'</div>','業務時間線與操作稽核分離')+'</div>'+scenarios;
}

function filterBar(key,placeholder,options){
  const f=filterState[key]||{q:'',v:''};
  return '<div class="filters"><input class="input" data-filter-key="'+key+'" data-filter-field="q" placeholder="'+placeholder+'" value="'+esc(f.q)+'"><select class="select" data-filter-key="'+key+'" data-filter-field="v"><option value="">全部</option>'+options.map(x=>'<option value="'+esc(x)+'" '+(f.v===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>';
}
function filtered(key,list,searchText,valueFn){const f=filterState[key]||{q:'',v:''};return list.filter(x=>String(searchText(x)).toLowerCase().includes(f.q.toLowerCase())&&(!f.v||valueFn(x)===f.v))}
function storeCard(st){
  const op=currentOperator(state,st),acc=account(state,st.accountId);
  return '<a class="card metric-card" href="'+link('stores',st.id)+'" style="display:block"><span class="tag">'+esc(acc?.platform)+'</span><h2 style="margin:12px 0 4px">'+esc(st.name)+'</h2><small>'+esc(st.code)+' · 店主 '+esc(op?.name)+'</small><div style="display:flex;align-items:end;justify-content:space-between;margin-top:17px"><div><small>近 30 日銷售</small><strong style="font-size:19px">'+money(st.sales)+'</strong></div><div class="mini-bars">'+st.trend.slice(-5).map(v=>'<i style="height:'+Math.round(v/100*34)+'px"></i>').join('')+'</div></div><div style="margin-top:12px">'+pill(st.status)+'</div></a>';
}
function renderStores(){
  if(detailId)return renderStoreDetail(detailId);
  const st=filtered('stores',visibleStores(state,role),x=>x.name+' '+x.code+' '+platform(state,x),x=>platform(state,x));
  return pageHead('STORE / ACCOUNT','店舖管理','Store 是營運與責任的中心；跨平台同名店舖各自獨立。',isOps()?modalButton(icon('plus')+' 新增店舖','store-create','','btn primary')+modalButton('重要事件','event','','btn'):'')+
    filterBar('stores','搜尋店名、平台或編號',state.settings.platforms)+
    '<div class="grid three">'+st.map(storeCard).join('')+'</div>'+
    '<div class="split-title">RELATIONSHIP　關係架構</div>'+
    '<div class="notice"><b>號主 → 平台帳號 → Store → 有效期間內店主</b><p>每間店可查看歷任店主、案件、文件、帳務與重要歷程。關閉店舖後，原紀錄仍保留。</p></div>';
}
function renderStoreDetail(id){
  const st=store(state,id);if(!st||!canViewStore(state,role,id))return denied();
  const acc=account(state,st.accountId),owner=ownerOf(state,st),op=currentOperator(state,st),entity=state.entities.find(e=>e.id===st.entityId);
  const cases=visibleCases(state,role).filter(x=>x.storeId===id),docs=visibleDocuments(state,role).filter(d=>d.refs.some(r=>r.kind==='store'&&r.id===id)),finance=visibleSettlements(state,role).filter(f=>f.storeId===id),recs=state.records.filter(r=>r.storeId===id);
  let actions=isOps()?modalButton('編輯店舖','store-edit',st.id,'btn primary')+modalButton('建立事件','event',st.id,'btn')+(st.status==='營運中'?modalButton('發起交接','handover',st.id,'btn'):''):act().kind==='merchant'&&st.status==='營運中'?modalButton('提出交接','handover',st.id,'btn'):'';
  const facts='<div class="facts"><div class="fact"><small>平台帳號</small><b><a href="'+link('accounts',acc.id)+'">'+esc(acc.code)+'</a></b></div><div class="fact"><small>號主</small><b>'+(showPerson(owner)?'<a href="'+link('people',owner.id)+'">'+esc(owner.name)+'</a>':esc(owner.name))+'</b></div><div class="fact"><small>號主公司／商號</small><b>'+esc(entity?.name||'個人帳號')+'</b></div><div class="fact"><small>現任店主</small><b>'+esc(op?.name||'無')+'</b></div><div class="fact"><small>客戶評價</small><b>'+st.rating+' / 5.0</b></div><div class="fact"><small>退貨率</small><b>'+st.returnRate+'%</b></div></div>';
  const assignments='<div class="timeline">'+st.assignments.slice().reverse().map(x=>{const m=person(state,x.merchantId),linked=m&&!m.deletedAt&&m.status!=='已取消合作'&&showPerson(m);return '<div class="event"><time>'+esc(x.from)+' — '+esc(x.to||'現在')+'</time><b>'+(linked?'<a class="link" href="'+link('people',m.id)+'">'+esc(m.name)+'</a>':esc(m?.name||'已移除店主'))+'</b><small>經營有效期間 · 確認人 '+esc(name(x.confirmedBy))+(m?.status==='已取消合作'?' · 已取消合作':'')+'</small></div>'}).join('')+'</div>';
  const stats='<div class="grid kpi">'+metric('近 30 日銷售',money(st.sales),'模擬銷售摘要','chart','blue')+metric('訂單摘要',st.orders.toLocaleString('zh-TW'),'不逐筆同步','store','teal')+metric('相關案件',cases.length,'包含歷史案件','cases','amber')+metric('文件佐證',docs.length,'可關聯多個物件','docs','violet')+'</div>';
  return pageHead(esc(platform(state,st))+' / '+esc(st.code),esc(st.name),esc(st.category)+' · '+esc(st.status)+' · 同名跨平台店舖分開管理',actions)+stats+
    '<div class="grid two">'+card('店舖與帳號關係',facts,'責任關係由有效期間與正式確認維護')+card('營運趨勢',chart(st.trend,st.sales),'銷售資料為示範摘要')+'</div>'+
    '<div class="split-title">ACCOUNTABILITY　經營責任</div><div class="grid two">'+card('歷任店主',assignments,'交接後不覆蓋舊經營者')+card('關聯案件',cases.map(caseRow).join('')||'<div class="empty">目前沒有案件</div>','點擊案件可查看流程與缺件')+'</div>'+
    '<div class="split-title">EVIDENCE & FINANCE　佐證與帳務</div><div class="grid two">'+card('關聯文件',docs.slice(0,5).map(d=>row('docs',esc(d.name),'v'+d.version+' · '+esc(d.type),link('docs',d.id),'','violet')).join('')||'<div class="empty">尚無文件</div>')+card('結算資料',finance.map(f=>row('finance',esc(f.code),esc(f.period)+' · 未清 '+money(outstanding(f)),link('finance',f.id),f.status,'amber')).join('')||'<div class="empty">尚無結算</div>')+'</div>'+
    '<div class="split-title">TIMELINE　重要歷程</div>'+card('店舖業務時間線','<div class="timeline">'+recs.slice(0,8).map(miniEvent).join('')+'</div>','重要事件可回顧；Audit 另由管理方檢視');
}

function renderAccounts(){
  if(act().kind==='marketing')return denied();
  const list=state.accounts.filter(a=>!a.deletedAt&&(isOps()||act().kind==='owner'&&a.ownerId===act().personId||visibleStores(state,role).some(st=>st.accountId===a.id)||act().kind==='sales'&&visiblePeople(state,role).some(p=>p.id===a.ownerId)));
  if(detailId){const a=account(state,detailId);if(!a||!list.some(x=>x.id===a.id))return denied();const p=person(state,a.ownerId),stores=a.storeIds.map(id=>store(state,id)).filter(x=>canViewStore(state,role,x.id));return pageHead('PLATFORM ACCOUNT',esc(a.code),esc(a.platform)+' · '+esc(a.status),canManageOwners()?modalButton('編輯帳號','account-edit',a.id,'btn primary')+modalButton('在此帳號新增店舖','store-create',a.id,'btn'):'')+'<div class="grid two">'+card('帳號與號主','<div class="facts"><div class="fact"><small>平台</small><b>'+esc(a.platform)+'</b></div><div class="fact"><small>號主</small><b>'+(showPerson(p)?'<a href="'+link('people',p.id)+'">'+esc(p.name)+'</a>':esc(p.name))+'</b></div><div class="fact"><small>帳號狀態</small><b>'+esc(a.status)+'</b></div><div class="fact"><small>建立時間</small><b>'+esc(a.history?.at(-1)?.time||'展示初始資料')+'</b></div></div><div class="notice" style="margin-top:13px"><b>備註</b><p>'+esc(a.note||'尚無備註')+'</p></div>','號主是平台帳號的持有人')+card('帳號下的 Store',stores.map(st=>row('store',esc(st.name),esc(st.code)+' · '+esc(currentOperator(state,st)?.name),link('stores',st.id),st.status,'teal')).join('')||'<div class="empty">尚無店舖，可從此帳號新增。</div>','號主退出時這些店舖連動關閉')+'</div><div class="split-title">ACCOUNT HISTORY　帳號紀錄</div>'+card('狀態與編修紀錄','<div class="timeline">'+(a.history||[{time:'展示初始資料',actor:'ops',action:'匯入',detail:'原始示範帳號'}]).map(h=>'<div class="event"><time>'+esc(h.time)+' · '+esc(name(h.actor))+'</time><b>'+esc(h.action)+'</b><small>'+esc(h.detail)+'</small></div>').join('')+'</div>','正式變更另寫入 Audit')}
  return pageHead('PLATFORM ACCOUNTS','平台帳號','可建立、編輯並追查帳號狀態；每筆帳號明確屬於一位號主。',canManageOwners()?modalButton(icon('plus')+' 新增平台帳號','account-create','','btn primary'):'')+
    '<div class="grid three">'+list.map(a=>{const p=person(state,a.ownerId);return '<a class="card metric-card" href="'+link('accounts',a.id)+'"><span class="tag">'+esc(a.platform)+'</span><h2 style="margin:13px 0 5px">'+esc(a.code)+'</h2><small>號主 '+esc(p?.name)+' · '+a.storeIds.filter(id=>!store(state,id)?.deletedAt).length+' 間店</small><div style="margin-top:17px">'+pill(a.status)+'</div></a>'}).join('')+'</div>'+
    (isOps()?'<div class="split-title">PLATFORMS　平台主檔</div>'+card('已使用的平台',state.settings.platforms.map(x=>'<div class="row"><span class="row-icon teal">'+icon('store')+'</span><span class="row-main"><b>'+esc(x)+'</b><small>'+state.accounts.filter(a=>!a.deletedAt&&a.platform===x).length+' 個平台帳號</small></span></div>').join(''),'平台選項與所屬帳號在這裡管理',act().kind==='admin'?modalButton('新增平台','platform-create','','btn tiny'):''):'');
}
function renderPeople(){
  if(['merchant','marketing'].includes(act().kind))return denied();
  if(detailId)return renderPersonDetail(detailId);
  const list=filtered('people',visiblePeople(state,role).filter(x=>x.kind==='owner'),x=>x.name+' '+x.city+' '+x.notes,x=>x.status),merchants=visiblePeople(state,role).filter(x=>x.kind==='merchant');
  return pageHead('PEOPLE / RELATIONSHIP','人與合作關係','新增號主或店主，並追查平台帳號、經營店舖與文件。',isOps()?modalButton(icon('plus')+' 新增合作對象','person-create','','btn primary'):'')+
    filterBar('people','搜尋姓名、城市或合作備註',['合作中','資料保留中'])+
    '<div class="grid two">'+card('號主名單',list.map(p=>row('people',esc(p.name),esc(p.city)+' · '+esc(p.notes),link('people',p.id),p.status,'blue')).join('')||'<div class="empty">沒有符合的人物</div>','點擊查看帳號、店舖與歷史')+
    card('合作店主',merchants.map(p=>row('people',esc(p.name),esc(p.city)+' · '+esc(p.notes),link('people',p.id),p.status,'teal')).join('')||'<div class="empty">尚未新增店主</div>','同一店主可經營多個 Store')+'</div>';
}
function renderPersonDetail(id){
  const p=person(state,id);if(!p||!showPerson(p))return denied();
  if(p.kind==='merchant'){
    const st=visibleStores(state,role).filter(x=>x.assignments.some(a=>a.merchantId===p.id));
    return pageHead('MERCHANT / '+esc(p.id),esc(p.name),esc(p.city)+' · '+esc(p.status),isOps()?modalButton('變更合作狀態','merchant-status',p.id,'btn primary')+(act().kind==='admin'?modalButton('建立登入帳號','login-create',p.id,'btn'):''):'')+
      '<div class="grid two">'+card('合作資料','<div class="facts"><div class="fact"><small>電話</small><b>'+esc(p.phone)+'</b></div><div class="fact"><small>Email</small><b>'+esc(p.email)+'</b></div><div class="fact"><small>合作備註</small><b>'+esc(p.notes)+'</b></div></div>')+card('經營過的 Store',st.map(x=>row('store',esc(x.name),esc(platform(state,x))+' · '+x.assignments.filter(a=>a.merchantId===p.id).map(a=>a.from+' 至 '+(a.to||'現在')).join('、'),link('stores',x.id),x.status,'teal')).join('')||'<div class="empty">尚未指派店舖</div>','每段期間獨立保留')+'</div>';
  }
  const st=visibleStores(state,role).filter(x=>ownerOf(state,x)?.id===p.id),acc=state.accounts.filter(x=>!x.deletedAt&&x.ownerId===p.id&&(isOps()||act().personId===id||st.some(y=>y.accountId===x.id)));
  const businesses=state.entities.filter(e=>!e.deletedAt&&e.kind==='owner_business'&&e.ownerId===id);
  const pending=state.pendingChanges.filter(x=>x.personId===id);
  const relevant=state.records.filter(r=>st.some(x=>x.id===r.storeId)||r.entityType==='person'&&r.entityId===id);
  const edit=(isOps()||act().personId===id)?modalButton('提出 CRM 修改','crm',id,'btn primary'):'';
  const exit=(isOps()||act().personId===id)&&p.status==='合作中'?modalButton('提出退出','exit',id,'btn'):'';
  const sensitive=(act().personId===id||act().kind==='admin')?
    '<div class="facts"><div class="fact"><small>家庭</small><b>'+esc(p.sensitive?.family)+'</b></div><div class="fact"><small>職業</small><b>'+esc(p.sensitive?.occupation)+'</b></div><div class="fact"><small>收入</small><b>'+esc(p.sensitive?.income)+'</b></div><div class="fact"><small>健康</small><b>'+esc(p.sensitive?.health)+'</b></div></div>':
    '<div class="notice"><b>敏感欄位已遮蔽</b><p>家庭、收入、健康與規劃資料需獨立授權；管理方一般營運帳號只看必要聯絡與合作資訊。</p></div>';
  const pendingHtml=pending.map(c=>'<div class="row"><span class="row-icon '+(c.status==='已確認'?'teal':'amber')+'">'+icon('people')+'</span><span class="row-main"><b>'+esc(c.status)+' · '+esc(c.reason)+'</b><small>'+esc(name(c.submittedBy))+' · '+dataTime(c.time)+'</small></span><span class="row-end">'+(c.status==='待號主確認'&&(act().personId===id||act().kind==='admin')?button(act().kind==='admin'?'管理員確認':'確認修改','confirm-crm','btn tiny primary',c.id):pill(c.status))+'</span></div>').join('')||'<div class="empty">尚無待確認修改</div>';
  const personDocs=visibleDocuments(state,role).filter(d=>d.refs.some(r=>r.kind==='person'&&r.id===id));
  return pageHead('OWNER CRM / '+esc(p.id),esc(p.name),esc(p.city)+' · '+esc(p.status),edit+(canManageOwners()?modalButton('新增平台帳號','account-create',p.id,'btn'):'')+modalButton('上傳個人文件','person-document',p.id,'btn')+(isOps()?modalButton('指派業務','sales-assign',id,'btn'):'')+exit)+
    '<div class="grid two">'+card('基本與合作資料','<div class="facts"><div class="fact"><small>聯絡電話</small><b>'+esc(p.phone)+'</b></div><div class="fact"><small>電子信箱</small><b>'+esc(p.email)+'</b></div><div class="fact"><small>合作狀態</small><b>'+esc(p.status)+'</b></div><div class="fact"><small>負責業務</small><b>'+esc(p.salesId?name(p.salesId):'未指派')+'</b></div></div><div style="margin-top:13px" class="notice"><b>合作備註</b><p>'+esc(p.notes)+'</p></div>','修改會先提交，再由號主確認')+card('敏感資料',sensitive,'依身分與欄位授權顯示')+'</div>'+
    '<div class="split-title">RELATIONSHIP　帳號與店舖</div><div class="grid two">'+card('平台帳號',acc.map(a=>row('accounts',esc(a.code),esc(a.platform),link('accounts',a.id),a.status)).join('')||'<div class="empty">尚無帳號</div>')+card('關聯 Store',st.map(x=>row('store',esc(x.name),esc(platform(state,x))+' · '+esc(currentOperator(state,x)?.name),link('stores',x.id),x.status,'teal')).join('')||'<div class="empty">尚無店舖</div>')+'</div>'+
    '<div class="split-title">OWNER BUSINESS　號主名下公司／商號</div>'+card('所屬法律實體',businesses.map(e=>'<div class="row"><span class="row-icon violet">'+icon('accounts')+'</span><span class="row-main"><b>'+esc(e.name)+'</b><small>統編 '+esc(e.taxId)+' · '+e.storeIds.filter(id=>!store(state,id)?.deletedAt).length+' 間 Store</small></span></div>').join('')||'<div class="empty">此號主尚未成立公司／商號</div>','與管理公司分開',canManageOwners()?modalButton('新增此號主商號','entity-create',id,'btn tiny'):'')+
    '<div class="split-title">IDENTITY & BANK　號主個人文件</div>'+card('身分、存摺與授權文件',personDocs.map(d=>row('docs',esc(d.name),esc(d.type)+' · v'+d.version+' · 限定查閱',link('docs',d.id),'私密','violet')).join('')||'<div class="empty">尚無個人文件。可上傳示範用身分證、存摺或授權書。</div>','個人文件不會出現在店主的營運文件清單')+
    '<div class="split-title">APPROVAL & HISTORY　確認與歷程</div><div class="grid two">'+card('CRM 變更確認',pendingHtml)+card('人物相關時間線','<div class="timeline">'+relevant.slice(0,7).map(miniEvent).join('')+'</div>')+'</div>';
}

function renderCases(){
  if(detailId)return renderCaseDetail(detailId);
  const visible=visibleCases(state,role),list=filtered('cases',visible,x=>x.code+' '+x.title+' '+storeName(x.storeId),x=>CASE_LABELS[x.type]);
  const open=visible.filter(x=>x.status!=='已結案');
  const actions=isOps()||['finance','merchant','owner'].includes(act().kind)?modalButton(icon('plus')+' 建立案件','case','','btn primary'):'';
  return pageHead('CASE / WORKFLOW','案件中心','複雜事件按階段處理；缺件、確認與結案都有明確條件。',actions)+
    '<div class="grid kpi">'+metric('可見案件',visible.length,'依責任範圍','cases','blue')+metric('處理中',open.length,'需要繼續推進','calendar','amber')+metric('等待佐證',open.filter(c=>c.requirements.some(r=>!r.docId)).length,'缺件不能提交','alert','red')+metric('已結案',visible.length-open.length,'保留處理歷程','check','teal')+'</div>'+
    filterBar('cases','搜尋案件編號、名稱或店舖',Object.values(CASE_LABELS))+
    card('案件清單',list.map(caseRow).join('')||'<div class="empty">沒有符合條件的案件</div>','從案件進入店舖、任務、文件與時間線');
}
function renderCaseDetail(id){
  const c=caseById(state,id);if(!c||!canViewCase(state,role,id))return denied();
  const st=store(state,c.storeId),owner=ownerOf(state,st),reqDone=c.requirements.filter(r=>r.docId).length;
  const tasks=visibleTasks(state,role).filter(t=>t.sourceType==='case'&&t.sourceId===id),docs=visibleDocuments(state,role).filter(d=>d.refs.some(r=>r.kind==='case'&&r.id===id));
  const recs=state.records.filter(r=>r.entityType==='case'&&r.entityId===id||r.storeId===st.id&&r.title.includes(c.code));
  let actions=(c.status!=='已結案'?modalButton('＋ 新增任務','task',c.id,'btn'):'')+(c.status!=='已結案'&&isCaseManager(c)?button('推進下一步　'+icon('arrow'),'advance-case','btn primary',c.id):'');
  if(c.type==='Penalty'&&isOps()&&!c.responsibleMerchantId)actions=modalButton('確認責任店主','penalty',c.id,'btn primary')+actions;
  const stages=STAGES[c.type].map((step,i)=>'<div class="step '+(i<c.step?'done':i===c.step?'current':'')+'">'+esc(step)+'<span>'+(i<c.step?'已完成':i===c.step?'目前階段':'待處理')+'</span></div>').join('');
  let missing=c.requirements.filter(x=>!x.docId);
  let blocker='';
  if(c.type==='Exit'){const blockers=exitBlockers(state,c);blocker='<div class="notice '+(blockers.length?'danger':'ok')+'"><b>'+(blockers.length?'尚不能完成退出':'退出前置事項已完成')+'</b><p>'+(blockers.length?esc(blockers.join('、')):'可由管理方推進帳號歸還與店舖關閉。')+'</p></div>'}
  else if(missing.length)blocker='<div class="notice warn"><b>目前缺少 '+missing.length+' 項佐證</b><p>'+missing.map(x=>esc(x.label)).join('、')+'。關鍵步驟會檢查缺件。</p></div>';
  else if(c.type==='Penalty'&&!c.responsibleMerchantId)blocker='<div class="notice danger"><b>責任尚未確認</b><p>請以事發日與經營有效期間判斷，由管理方留下正式理由。</p></div>';
  else blocker='<div class="notice ok"><b>目前資料已備妥</b><p>仍需由有權管理方確認下一階段。</p></div>';
  const reqHtml=c.requirements.map(r=>{const d=state.documents.find(x=>x.id===r.docId);return '<div class="req"><span class="row-icon '+(d?'teal':'red')+'">'+icon(d?'check':'alert')+'</span><span style="min-width:0"><b>'+esc(r.label)+'</b><small>'+(d?esc(d.name)+' · v'+d.version:'尚未提供')+'</small></span>'+(c.status!=='已結案'?modalButton(d?'更新':'補件','evidence',c.id,'btn tiny soft',' data-req="'+esc(r.key)+'"'):'')+'</div>'}).join('')||'<div class="empty">此案件依前置事項與正式確認推進</div>';
  const facts='<div class="facts"><div class="fact"><small>關聯 Store</small><b><a href="'+link('stores',st.id)+'">'+esc(st.name)+'</a></b></div><div class="fact"><small>號主</small><b>'+esc(owner.name)+'</b></div><div class="fact"><small>案件負責人</small><b>'+esc(name(c.assignee))+'</b></div><div class="fact"><small>截止日期</small><b>'+esc(c.due)+'</b></div><div class="fact"><small>佐證完成</small><b>'+reqDone+' / '+c.requirements.length+'</b></div><div class="fact"><small>目前階段</small><b>'+esc(STAGES[c.type][c.step])+'</b></div></div>';
  let special='';
  if(c.type==='Penalty'){const candidate=operatorAt(state,st,c.occurrenceAt);special='<div class="split-title">RESPONSIBILITY　事發責任</div>'+card('事發日與通知日','<div class="facts"><div class="fact"><small>事發日</small><b>'+esc(c.occurrenceAt)+'</b></div><div class="fact"><small>通知日</small><b>'+esc(c.noticeAt)+'</b></div><div class="fact"><small>事發當時店主</small><b>'+esc(candidate?.name)+'</b></div></div><div style="margin-top:12px">'+(c.responsibleMerchantId?'<div class="notice ok"><b>管理方判定：'+esc(person(state,c.responsibleMerchantId)?.name)+'</b><p>'+esc(c.decisionReason)+'</p></div>':'<div class="notice warn"><b>待正式判定</b><p>通知日的現任店主並不直接等於事發責任人。</p></div>')+'</div>')}
  if(c.type==='Handover'){special='<div class="split-title">HANDOVER　交接快照</div>'+card('新舊店主與生效日','<div class="facts"><div class="fact"><small>原店主</small><b>'+esc(person(state,c.handover.from)?.name)+'</b></div><div class="fact"><small>新店主</small><b>'+esc(person(state,c.handover.to)?.name)+'</b></div><div class="fact"><small>預定生效</small><b>'+esc(c.handover.effectiveDate)+'</b></div></div>','盤點及管理方確認後才更新正式經營關係')}
  if(c.type==='Reconciliation'&&c.settlementId){const f=settlement(state,c.settlementId);special='<div class="split-title">FINANCE　關聯結算</div>'+card('結算來源',row('finance',esc(f.code),esc(f.period)+' · 未清 '+money(outstanding(f)),link('finance',f.id),f.status,'amber'))}
  return pageHead(esc(c.code)+' / '+esc(CASE_LABELS[c.type]),esc(c.title),esc(st.name)+' · 建立 '+dataTime(c.createdAt)+' · '+esc(c.description),actions)+
    '<div class="grid two">'+card('案件現況',facts+'<div style="margin-top:13px">'+blocker+'</div>','跨角色共同維護，正式進度由有權者確認')+card('處理流程','<div class="steps">'+stages+'</div><div class="notice"><b>下一步：'+esc(c.next)+'</b><p>每一步會留下業務紀錄及操作稽核。</p></div>','依案件類型顯示前後依賴')+'</div>'+
    special+'<div class="split-title">EVIDENCE & WORK　文件與執行</div><div class="grid two">'+card('所需佐證','<div class="req-grid">'+reqHtml+'</div>','同一份文件可在店舖與案件中回查')+card('關聯任務',tasks.map(t=>taskRow(t,true)).join('')||'<div class="empty">目前沒有分派任務</div>','Task 是可選的執行動作','<a class="btn tiny" href="'+link('tasks')+'">任務列表 →</a>')+'</div>'+
    '<div class="split-title">TRACE　關聯與歷程</div><div class="grid two">'+card('案件時間線','<div class="timeline">'+recs.slice(0,8).map(miniEvent).join('')+'</div>','業務事件與稽核分開')+card('文件與關聯',docs.map(d=>row('docs',esc(d.name),esc(d.type)+' · v'+d.version,link('docs',d.id),'','violet')).join('')+row('store',esc(st.name),esc(platform(state,st))+' · '+esc(st.code),link('stores',st.id),'','teal'),'可沿關聯回到原始物件')+'</div>';
}

function renderTasks(){
  const tasks=visibleTasks(state,role);
  if(detailId){const t=tasks.find(x=>x.id===detailId);if(!t)return denied();const evidences=(t.evidenceDocIds||[]).map(did=>state.documents.find(d=>d.id===did)).filter(d=>d&&!d.deletedAt&&visibleDocuments(state,role).some(x=>x.id===d.id));const expenses=state.expenseRequests.filter(x=>x.taskId===t.id);return pageHead('TASK / '+esc(t.id),esc(t.title),esc(storeName(t.storeId))+' · 負責 '+esc(name(t.assignee)),(canManageTask(state,role,t.id)?modalButton('更新／上傳單據','task-status',t.id,'btn primary')+modalButton('刪除任務','task-delete',t.id,'btn danger'):''))+
    '<div class="grid two">'+card('任務詳情','<div class="facts"><div class="fact"><small>狀態</small><b>'+esc(t.status)+'</b></div><div class="fact"><small>截止</small><b>'+esc(t.due)+'</b></div><div class="fact"><small>建立者</small><b>'+esc(name(t.createdBy))+'</b></div></div><div style="margin-top:14px" class="notice"><b>完成條件</b><p>'+esc(t.criteria)+'</p></div>','可選完成、不執行、取消或標記重複')+card('來源物件',row(t.sourceType==='case'?'cases':'store',esc(t.sourceType==='case'?caseById(state,t.sourceId)?.code||'案件':'店舖／紀錄'),esc(storeName(t.storeId)),t.sourceType==='case'?link('cases',t.sourceId):link('stores',t.storeId)),'任務可關聯案件，也可直接關聯業務紀錄')+'</div>'+
    '<div class="split-title">PROOF & EXPENSE　佐證與費用</div><div class="grid two">'+card('任務單據',evidences.map(d=>'<div class="row"><span class="row-icon violet">'+icon('docs')+'</span><span class="row-main"><a class="link" href="'+link('docs',d.id)+'">'+esc(d.name)+'</a><small>v'+d.version+' · '+esc(name(d.uploadedBy))+'</small></span><span class="row-end">'+button('下載','download-doc','btn tiny',d.id)+'</span></div>').join('')||'<div class="empty">尚無任務佐證</div>')+card('費用申請',expenses.map(r=>'<div class="row"><span class="row-icon amber">'+icon('finance')+'</span><span class="row-main"><b>'+money(r.amount)+' · '+esc(r.reason)+'</b><small>'+esc(name(r.requestedBy))+' · '+esc(r.documentId)+' · '+esc(r.decisionReason||'待會計審核')+'</small></span><span class="row-end">'+pill(r.status)+(r.status==='待會計審核'&&['finance','admin'].includes(act().kind)?modalButton('審核','expense-decide',r.id,'btn tiny'):'')+'</span></div>').join('')||'<div class="empty">尚無費用申請</div>','申請須有關聯單據；會計確認後保留結果')+'</div>'}
  const filteredTasks=filtered('tasks',tasks,x=>x.title+' '+storeName(x.storeId)+' '+name(x.assignee),x=>x.status);
  return pageHead('TASK / NOTIFICATION','任務協作','三方可在責任範圍內建立及處理任務；每次重要異動保留紀錄。',modalButton(icon('plus')+' 新增任務','task','','btn primary'))+
    '<div class="grid kpi">'+metric('可見任務',tasks.length,'依身分與責任範圍','tasks','blue')+metric('進行中',tasks.filter(x=>x.status==='進行中').length,'有人正在處理','chart','teal')+metric('待處理',tasks.filter(x=>x.status==='待處理').length,'等待負責人','calendar','amber')+metric('已完成',tasks.filter(x=>x.status==='完成').length,'留下結案紀錄','check','violet')+'</div>'+
    filterBar('tasks','搜尋任務、店舖或負責人',TASK_STATUSES)+card('任務清單',filteredTasks.map(t=>'<div class="row"><span class="row-icon '+(t.status==='完成'?'teal':'amber')+'">'+icon('tasks')+'</span><span class="row-main"><a class="link" href="'+link('tasks',t.id)+'">'+esc(t.title)+'</a><small>'+esc(storeName(t.storeId))+' · '+esc(name(t.assignee))+' · '+esc(t.due)+' · '+esc(t.criteria)+'</small></span><span class="row-end">'+pill(t.status)+(canManageTask(state,role,t.id)?modalButton('處理','task-status',t.id,'btn tiny'):'')+'</span></div>').join('')||'<div class="empty">沒有符合條件的任務</div>','刪除任務不會刪掉 Audit');
}
function renderDocs(){
  const docs=visibleDocuments(state,role);
  if(detailId){const d=docs.find(x=>x.id===detailId);if(!d)return denied();const refs=d.refs.map(r=>{const label=r.kind==='person'?person(state,r.id)?.name:r.kind==='store'?storeName(r.id):r.kind==='task'?state.tasks.find(t=>t.id===r.id)?.title:r.kind==='case'?caseById(state,r.id)?.code:settlement(state,r.id)?.code;const path=r.kind==='person'?link('people',r.id):r.kind==='store'?link('stores',r.id):r.kind==='task'?link('tasks',r.id):r.kind==='case'?link('cases',r.id):link('finance',r.id);return row(r.kind==='person'?'people':r.kind==='store'?'store':r.kind==='task'?'tasks':r.kind==='case'?'cases':'finance',esc(label||r.id),esc(r.kind),path)}).join('');return pageHead('DOCUMENT / '+esc(d.id),esc(d.name),esc(d.type)+' · v'+d.version+(d.privacy==='owner_private'?' · 個人私密文件':''),modalButton('查看檔案','doc-view',d.id,'btn primary')+button('下載','download-doc','btn',d.id)+(d.privacy==='owner_private'&&act().kind==='finance'?'':modalButton('更新版本','doc-version',d.id,'btn')))+
    '<div class="grid two">'+card('文件資訊','<div class="facts"><div class="fact"><small>類型</small><b>'+esc(d.type)+'</b></div><div class="fact"><small>目前版本</small><b>v'+d.version+'</b></div><div class="fact"><small>來源</small><b>'+esc(d.source)+'</b></div><div class="fact"><small>上傳者</small><b>'+esc(name(d.uploadedBy))+'</b></div><div class="fact"><small>更新時間</small><b>'+dataTime(d.uploadedAt)+'</b></div></div><div style="margin-top:14px" class="notice"><b>展示文件預覽</b><p>'+esc(d.name)+' · '+esc(d.type)+' · '+(d.dataUrl?'此文件可下載':'種子資料可下載示範摘要')+'</p></div>','重要文件有來源、版本與關聯')+card('關聯物件',refs,'一份文件可被多個業務物件引用')+'</div>'}
  const list=filtered('docs',docs,x=>x.name+' '+x.type+' '+x.source,x=>x.type);
  return pageHead('DOCUMENT / EVIDENCE','文件與佐證','文件可搜尋與更新版本；號主身分與存摺文件按個人權限顯示。',modalButton(icon('plus')+' 店舖文件','document','','btn primary')+(act().kind==='owner'||isOps()?modalButton('號主個人文件','person-document','','btn') :''))+
    filterBar('docs','搜尋文件名稱、類型或來源',[...new Set(docs.map(x=>x.type))])+
    '<div class="grid two">'+card('文件清單',list.map(d=>'<div class="row"><span class="row-icon violet">'+icon('docs')+'</span><span class="row-main"><a class="link" href="'+link('docs',d.id)+'">'+esc(d.name)+'</a><small>'+esc(d.type)+' · v'+d.version+' · '+esc(d.source)+'</small></span><span class="row-end">'+(d.privacy==='owner_private'?pill('私密'):'')+modalButton('查看','doc-view',d.id,'btn tiny')+button('下載','download-doc','btn tiny',d.id)+'</span></div>').join('')||'<div class="empty">沒有符合條件的文件</div>','查看或下載目前版本；種子資料下載為標示清楚的示範摘要')+
    card('缺件提醒',visibleCases(state,role).filter(c=>c.requirements.some(r=>!r.docId)).map(c=>row('alert',esc(c.code)+' · '+esc(c.title),c.requirements.filter(r=>!r.docId).map(x=>esc(x.label)).join('、'),link('cases',c.id),'缺件','red')).join('')||'<div class="empty">目前沒有缺件案件</div>','補件後案件狀態會同步更新')+'</div>';
}
function renderFinance(){
  if(['marketing','sales'].includes(act().kind))return denied();
  const fs=visibleSettlements(state,role);
  if(detailId)return renderFinanceDetail(detailId);
  const list=filtered('finance',fs,x=>x.code+' '+storeName(x.storeId)+' '+x.period,x=>x.status);
  return pageHead('FINANCE / SETTLEMENT','結算與對帳','基本金額、調整、實付與未清額分開呈現；所有數字為展示算例。',['finance','admin'].includes(act().kind)?modalButton(icon('plus')+' 建立結算','settlement-create','','btn primary'):'')+
    '<div class="grid kpi">'+metric('應付合計',money(fs.reduce((a,f)=>a+amount(f),0)),'基本額加逐筆調整','finance','blue')+metric('實際已付',money(fs.reduce((a,f)=>a+paid(f),0)),'依付款紀錄','check','teal')+metric('未清款項',money(fs.reduce((a,f)=>a+outstanding(f),0)),'需要對帳','alert','amber')+metric('結算筆數',fs.length,'依可見店舖','docs','violet')+'</div>'+
    filterBar('finance','搜尋結算編號、店舖或期間',['待對帳','已完成'])+
    card('店舖結算','<div class="table-wrap"><table class="table"><thead><tr><th>結算與期間</th><th>Store</th><th>基本額</th><th>調整</th><th>已付</th><th>未清</th><th>狀態</th></tr></thead><tbody>'+list.map(f=>'<tr><td><a class="link" href="'+link('finance',f.id)+'">'+esc(f.code)+'</a><small>'+esc(f.period)+'</small></td><td>'+esc(storeName(f.storeId))+'</td><td>'+money(f.base)+'</td><td>'+money(amount(f)-f.base)+'</td><td>'+money(paid(f))+'</td><td><strong>'+money(outstanding(f))+'</strong></td><td>'+pill(f.status)+'</td></tr>').join('')+'</tbody></table></div>','點擊結算可查看來源與調整理由')+
    (['finance','admin'].includes(act().kind)?'<div class="split-title">EXPENSE APPROVAL　費用申請</div>'+card('待審與已審',state.expenseRequests.map(r=>'<div class="row"><span class="row-icon amber">'+icon('finance')+'</span><span class="row-main"><a class="link" href="'+link('tasks',r.taskId)+'">'+esc(state.tasks.find(t=>t.id===r.taskId)?.title||r.taskId)+'</a><small>'+esc(storeName(r.storeId))+' · '+esc(r.reason)+' · 單據 '+esc(state.documents.find(d=>d.id===r.documentId)?.name)+'</small></span><span class="row-end"><b>'+money(r.amount)+'</b>'+pill(r.status)+(r.status==='待會計審核'?modalButton('審核','expense-decide',r.id,'btn tiny'):'')+'</span></div>').join('')||'<div class="empty">目前沒有費用申請</div>','費用申請來源為任務與單據；審核不直接改變結算基本金額'):'');
}
function renderFinanceDetail(id){
  const f=settlement(state,id);if(!f||!visibleSettlements(state,role).some(x=>x.id===id))return denied();
  const st=store(state,f.storeId),docs=f.sourceDocIds.map(id=>state.documents.find(x=>x.id===id)).filter(x=>visibleDocuments(state,role).some(d=>d.id===x?.id));
  const relevantCases=visibleCases(state,role).filter(c=>c.settlementId===f.id);
  const manager=['finance','admin'].includes(act().kind);
  const actions=manager&&!f.locked?modalButton('＋ 金額調整','adjust',f.id,'btn')+modalButton('登錄付款','payment',f.id,'btn primary')+button('確認結算','lock-settlement','btn soft',f.id):act().kind==='merchant'?button('提出對帳異議','dispute','btn primary',f.id):'';
  const adjustment=f.adjustments.map(a=>'<div class="row"><span class="row-icon '+(a.amount>=0?'teal':'red')+'">'+icon('finance')+'</span><span class="row-main"><b>'+esc(a.reason)+'</b><small>'+dataTime(a.time)+' · '+esc(name(a.actor))+(a.documentId?' · 有佐證':'')+'</small></span><strong>'+money(a.amount)+'</strong></div>').join('')||'<div class="empty">尚無個案調整，基本金額保持原值</div>';
  const payments=f.payments.map(p=>'<div class="row"><span class="row-icon teal">'+icon('check')+'</span><span class="row-main"><b>'+money(p.amount)+'</b><small>'+esc(p.date)+' · '+esc(p.note)+'</small></span></div>').join('')||'<div class="empty">尚未登錄付款</div>';
  return pageHead('SETTLEMENT / '+esc(f.code),esc(st.name)+' · '+esc(f.period),esc(f.status)+' · 店主 '+esc(person(state,f.operatorId)?.name)+' · 計算規則為展示算例',actions)+
    '<div class="card"><div class="card-body"><div class="money-steps"><div class="money-step"><small>基本金額</small><b>'+money(f.base)+'</b></div><div class="money-step"><small>逐筆調整</small><b>'+money(amount(f)-f.base)+'</b></div><div class="money-step"><small>最終應付</small><b>'+money(amount(f))+'</b></div><div class="money-step highlight"><small>未清金額</small><b>'+money(outstanding(f))+'</b></div></div><p style="color:#8090a4;font-size:10px;margin:12px 0 0">最終應付＝基本金額＋逐筆調整；未清＝最終應付－實際已付。正式合作算法尚待確認。</p></div></div>'+
    '<div class="split-title">LEDGER　調整與付款</div><div class="grid two">'+card('調整明細',adjustment,'調整保留原金額、理由與操作者')+card('實際付款',payments,'已付 '+money(paid(f))+' · 未清 '+money(outstanding(f)))+'</div>'+
    '<div class="split-title">SOURCE & DISPUTE　來源與異議</div><div class="grid two">'+card('來源文件',docs.map(d=>row('docs',esc(d.name),esc(d.type),link('docs',d.id),'','violet')).join('')||'<div class="empty">無來源文件</div>')+card('關聯案件',relevantCases.map(caseRow).join('')||'<div class="empty">目前沒有關聯異議</div>','爭議由 Case 保留處理與確認')+'</div>';
}
function renderOperations(){
  const st=visibleStores(state,role),ids=new Set(st.map(x=>x.id)),moves=state.movements.filter(x=>ids.has(x.storeId));
  const list=filtered('operations',moves,x=>x.code+' '+x.route+' '+storeName(x.storeId),x=>x.type);
  return pageHead('COMMERCE / LOGISTICS','電商與物流摘要','銷售、退款、進出貨與異常以摘要和重要紀錄呈現。',isOps()?modalButton(icon('plus')+' 新增物流紀錄','movement','','btn primary'):'')+
    '<div class="grid kpi">'+metric('銷售摘要',money(st.reduce((a,x)=>a+x.sales,0)),'可見 Store 近 30 日','chart','blue')+metric('訂單摘要',st.reduce((a,x)=>a+x.orders,0).toLocaleString('zh-TW'),'無逐筆狀態同步','store','teal')+metric('物流紀錄',moves.length,'進貨、出貨與退貨','operations','amber')+metric('退貨率',st.length?(st.reduce((a,x)=>a+x.returnRate,0)/st.length).toFixed(1)+'%':'0%','範例平均值','alert','violet')+'</div>'+
    '<div class="grid two">'+card('平台銷售分布',st.map(x=>'<div class="row"><span class="row-icon blue">'+icon('store')+'</span><span class="row-main"><b>'+esc(platform(state,x))+' · '+esc(x.name)+'</b><small>'+x.orders.toLocaleString('zh-TW')+' 筆訂單摘要 · 評價 '+x.rating+'</small><div class="progress"><i style="width:'+Math.round(x.sales/1500000*100)+'%"></i></div></span><strong>'+money(x.sales)+'</strong></div>').join(''),'模擬平台匯出資料')+
    card('關鍵營運觀察','<div class="notice"><b>依責任店舖追溯</b><p>銷售摘要、廣告、退款及進出貨可回到各 Store 和相關文件；大量逐筆交易仍由平台後台管理。</p></div><div class="list-mini" style="margin-top:15px"><div><span>資料來源</span><strong>API / 匯出 / 人工回報（模擬）</strong></div><div><span>重要事件</span><strong>入庫、退貨、驗證、對帳</strong></div><div><span>近期異常</span><strong>'+esc(moves.filter(x=>x.status==='對貨中'||x.status==='待點收').length)+' 件待處理</strong></div></div>')+'</div>'+
    '<div class="split-title">MOVEMENT LEDGER　進出退貨</div>'+filterBar('operations','搜尋物流編號、路線或店舖',['入庫','出貨','退貨'])+
    card('物流異動','<div class="table-wrap"><table class="table"><thead><tr><th>編號／類型</th><th>Store</th><th>日期</th><th>路線</th><th>數量</th><th>狀態</th><th>操作</th></tr></thead><tbody>'+list.map(m=>'<tr><td><strong>'+esc(m.code)+'</strong><small>'+esc(m.type)+'</small></td><td><a class="link" href="'+link('stores',m.storeId)+'">'+esc(storeName(m.storeId))+'</a></td><td>'+esc(m.date)+'</td><td>'+esc(m.route)+'</td><td>'+m.qty+'</td><td>'+pill(m.status)+'</td><td>'+(isOps()?modalButton('更新','movement-status',m.id,'btn tiny'):'—')+'</td></tr>').join('')+'</tbody></table></div>','物流紀錄含來源與責任店舖');
}
function renderHistory(){
  if(!['ops','finance','admin'].includes(act().kind))return denied();
  const tab=query.get('tab')==='audit'?'audit':'timeline';
  const allowed=new Set(visibleStores(state,role).map(x=>x.id));
  const recs=state.records.filter(r=>!r.storeId||allowed.has(r.storeId));
  const audits=state.audit.filter(a=>act().kind!=='finance'||a.entityType==='settlement'||a.entityType==='case'&&visibleCases(state,role).some(c=>c.id===a.entityId));
  const sub='<div class="subnav"><a href="./history.html?tab=timeline" class="'+(tab==='timeline'?'active':'')+'">業務 Timeline</a><a href="./history.html?tab=audit" class="'+(tab==='audit'?'active':'')+'">操作 Audit</a></div>';
  const body=tab==='timeline'?'<div class="timeline">'+recs.map(miniEvent).join('')+'</div>':
    '<div class="table-wrap"><table class="table"><thead><tr><th>時間</th><th>操作者</th><th>動作／物件</th><th>變更前</th><th>變更後</th><th>原因</th></tr></thead><tbody>'+audits.map(a=>'<tr><td>'+dataTime(a.time)+'</td><td>'+esc(name(a.actor))+'</td><td><strong>'+esc(a.action)+'</strong><small>'+esc(a.entityType)+' / '+esc(a.entityId)+'</small></td><td>'+esc(a.before)+'</td><td>'+esc(a.after)+'</td><td>'+esc(a.reason)+'</td></tr>').join('')+'</tbody></table></div>';
  return pageHead('HISTORY / AUDIT','歷程與稽核','業務事件與正式變更分開查閱；記錄可追到人物、店舖與案件。')+sub+card(tab==='timeline'?'業務事件':'操作稽核',body,tab==='timeline'?'回答「發生了什麼」':'回答「誰在什麼時候改了什麼」');
}
function renderAdmin(){
  if(act().kind!=='admin')return denied();
  const manage=(type,items,labelOf)=>card(({person:'合作對象',account:'平台帳號',store:'Store',case:'案件',task:'任務',document:'文件',settlement:'結算',entity:'法律實體',user:'登入帳號'})[type],items.filter(x=>!x.deletedAt).map(x=>'<div class="row"><span class="row-icon blue">'+icon(type==='document'?'docs':type==='user'?'people':type==='settlement'?'finance':'store')+'</span><span class="row-main"><b>'+esc(labelOf(x))+'</b><small>'+esc(x.id)+'</small></span><span class="row-end">'+(type==='document'?modalButton('查看','doc-view',x.id,'btn tiny'):'')+(['person','account','store','case','task','document','entity'].includes(type)?modalButton('修正','admin-edit',x.id,'btn tiny',' data-req="'+type+'"'):'')+(type==='entity'&&x.kind==='management_company'?'':modalButton('刪除','admin-delete',x.id,'btn tiny danger',' data-req="'+type+'"'))+'</span></div>').join('')||'<div class="empty">無資料</div>','歷史紀錄不在可刪清單；有關聯的資料會阻擋刪除');
  return pageHead('SYSTEM ADMIN / HIGHEST ACCESS','系統管理後台','系統管理員擁有全部模組與資料的最高權限，並管理展示登入與設定。',modalButton('新增登入帳號','login-create','','btn primary')+'<a class="btn" href="./settings.html">進入設定 →</a>')+
    '<div class="grid kpi">'+metric('人物',state.people.length,'自然人主檔','people','blue')+metric('Store',state.stores.length,'包含關閉店舖','store','teal')+metric('稽核紀錄',state.audit.length,'不可無痕覆寫','history','amber')+metric('待確認修改',state.pendingChanges.filter(x=>x.status!=='已確認').length,'CRM 需號主驗收','shield','violet')+'</div>'+
    '<div class="grid two">'+card('最近系統 Audit','<div class="timeline">'+state.audit.slice(0,6).map(x=>'<div class="event"><time>'+dataTime(x.time)+' · '+esc(name(x.actor))+'</time><b>'+esc(x.action)+'</b><small>'+esc(x.before)+' → '+esc(x.after)+' · '+esc(x.reason)+'</small></div>').join('')+'</div>','管理員覆寫會留下前後值')+
    card('最高權限工作入口','<div class="choice-list">'+[['合作對象','people'],['平台帳號','accounts'],['店舖','stores'],['文件佐證','docs'],['財務對帳','finance'],['登入帳號管理','settings']].map(([label,path])=>'<a class="choice" href="'+link(path)+'"><span>'+icon(path==='settings'?'settings':path==='people'?'people':path==='accounts'?'accounts':path==='docs'?'docs':path==='finance'?'finance':'store')+'</span><b>'+label+'</b><span class="chev">→</span></a>').join('')+'</div>','管理員與管理方操作都保留 Audit')+'</div>'+
    '<div class="split-title">DATA CONTROL　資料維護與受控刪除</div><div class="grid two">'+manage('person',state.people,x=>x.name)+manage('account',state.accounts,x=>x.code)+manage('store',state.stores,x=>x.name+' · '+x.code)+manage('case',state.cases,x=>x.code+' · '+x.title)+manage('task',state.tasks,x=>x.title)+manage('document',state.documents,x=>x.name)+manage('settlement',state.settlements,x=>x.code)+manage('entity',state.entities,x=>x.name+(x.kind==='management_company'?'（管理公司）':''))+manage('user',state.users,x=>x.login)+'</div>';
}
function renderSettings(){
  if(act().kind!=='admin')return denied();
  const users=state.users.filter(u=>!u.deletedAt).map(u=>'<div class="row"><span class="row-icon '+(u.kind==='admin'?'violet':'blue')+'">'+icon('people')+'</span><span class="row-main"><b>'+esc(u.name)+' · '+esc(u.login)+'</b><small>'+esc(u.title)+(u.personId?' · '+esc(person(state,u.personId)?.name):'')+'</small></span><span class="row-end">'+pill(u.status)+modalButton('編輯權限','login-edit',u.id,'btn tiny')+modalButton('重設密碼','login-reset',u.id,'btn tiny')+modalButton(u.status==='啟用'?'停用':'啟用','login-status',u.id,'btn tiny')+'</span></div>').join('');
  return pageHead('SETTINGS / IDENTITY','登入與安全設定','由系統管理員維護登入帳號、角色、密碼與獨立的刪除確認密碼。',modalButton('新增登入帳號','login-create','','btn primary'))+
    card('登入帳號與權限',users,'可設定管理員、營運、行銷、會計、號主、店主；修改與重設均記錄於 Audit')+
    '<div class="split-title">SECURITY　刪除確認</div>'+card('二次刪除密碼','<div class="notice '+(state.settings.deletionVerifier?'ok':'warn')+'"><b>'+(state.settings.deletionVerifier?'已設定獨立二次密碼':'尚未設定二次密碼')+'</b><p>管理員刪除資料前須再次輸入。歷史 Timeline、Audit 及已結案紀錄不可刪除。</p></div>','Demo 密碼驗證只保存在此瀏覽器；正式版須由後端身分服務執行',modalButton(state.settings.deletionVerifier?'更新二次密碼':'設定二次密碼','delete-password','','btn tiny'));
}
function denied(){return pageHead('ACCESS SCOPE','此身分無權開啟這筆資料','請切換展示身分或返回工作台。')+'<div class="card"><div class="empty"><b>資料範圍已隔離</b>人物、店舖、案件與敏感欄位均依目前身分顯示。<div style="margin-top:15px"><a class="btn primary" href="./index.html">返回工作台</a></div></div></div>'}
function render(){
  const views={index:renderDashboard,stores:renderStores,accounts:renderAccounts,people:renderPeople,cases:renderCases,tasks:renderTasks,docs:renderDocs,finance:renderFinance,operations:renderOperations,history:renderHistory,admin:renderAdmin,settings:renderSettings};
  document.getElementById('app').innerHTML=shell((views[page]||renderDashboard)());
  document.title=(page==='index'?'總覽':({stores:'店舖',accounts:'平台帳號',people:'人與合作',cases:'案件',tasks:'任務',docs:'文件',finance:'財務',operations:'營運',history:'歷程',admin:'系統後台',settings:'設定'})[page]||'ARGO')+'｜ARGO Commerce OS';
}

function field(label,key,value='',type='text',required=true,full=false,extra=''){
  const tag=type==='textarea'?'<textarea class="textarea" name="'+key+'" '+(required?'required':'')+'>'+esc(value)+'</textarea>':'<input class="input" name="'+key+'" type="'+type+'" value="'+esc(value)+'" '+(required?'required':'')+' '+extra+'>';
  return '<div class="field '+(full?'full':'')+'"><label>'+label+'</label>'+tag+'</div>';
}
function fileField(label){return '<div class="field full"><label>'+label+'</label><input class="input" type="file" name="file"><small>最多 1 MB，僅限展示檔案。</small></div>'}
function adminObject(type,id){return ({person:state.people,account:state.accounts,store:state.stores,case:state.cases,task:state.tasks,document:state.documents,settlement:state.settlements,entity:state.entities,user:state.users})[type]?.find(x=>x.id===id)}
function adminValue(obj,key){return key?.startsWith('sensitive.')?obj?.sensitive?.[key.slice(10)]:obj?.[key]}
async function passwordHash(value){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('ARGO-DEMO-LOCAL:'+value));return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('')}
function showTourOnce(){const key=TOUR_KEY+':'+role;if(localStorage.getItem(key)!=='seen'){localStorage.setItem(key,'seen');openModal('tour')}}
function choiceField(label,key,items,selected='',full=false){return '<div class="field '+(full?'full':'')+'"><label>'+label+'</label><select class="select" name="'+key+'">'+items.map(([v,t])=>'<option value="'+esc(v)+'" '+(v===selected?'selected':'')+'>'+esc(t)+'</option>').join('')+'</select></div>'}
function storeOptions(defaultId){return visibleStores(state,role).filter(s=>s.status==='營運中').map(s=>[s.id,platform(state,s)+' · '+s.name+' ('+s.code+')'])}
function actorOptions(){return Object.values(ACTORS).filter(a=>a.kind!=='admin').map(a=>[a.id,a.name+'・'+a.title])}
function form(kind,body,submit='儲存',hint=''){return '<form data-form="'+kind+'"><div class="modal-body">'+(hint?'<div class="notice" style="margin-bottom:16px">'+hint+'</div>':'')+'<div class="form-grid">'+body+'</div></div><div class="modal-actions"><button type="button" class="btn" data-action="close-modal">取消</button><button class="btn primary" type="submit">'+submit+'</button></div></form>'}
function modal(title,body,wide=false){document.getElementById('modal-root').innerHTML='<div class="overlay" data-action="overlay"><div class="modal '+(wide?'wide':'')+'" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="modal-head"><h2>'+title+'</h2><button class="modal-close" aria-label="關閉" data-action="close-modal">×</button></div>'+body+'</div></div>';const first=document.querySelector('.modal input,.modal select,.modal button');first?.focus()}
function closeModal(){document.getElementById('modal-root').innerHTML='';modalContext={}}
function toast(message,error=false){const root=document.getElementById('toast-root');root.innerHTML='<div class="toast '+(error?'error':'')+'">'+esc(message)+'</div>';setTimeout(()=>{root.innerHTML=''},4300)}
function downloadDocument(id){
  const d=visibleDocuments(state,role).find(x=>x.id===id);if(!d){toast('目前身分無權下載此文件。',true);return}
  const a=document.createElement('a');let blobUrl=null;
  if(d.dataUrl?.startsWith('data:')){a.href=d.dataUrl;a.download=d.name}
  else{const body='ARGO Commerce OS｜模擬文件摘要\n\n文件：'+d.name+'\n類型：'+d.type+'\n來源：'+d.source+'\n版本：v'+d.version+'\n\n此檔案是展示資料的摘要，不是原始平台單據。';blobUrl=URL.createObjectURL(new Blob([body],{type:'text/plain;charset=utf-8'}));a.href=blobUrl;a.download=d.name.replace(/\.[^.]+$/,'')+'-示範摘要.txt'}
  document.body.append(a);a.click();a.remove();if(blobUrl)setTimeout(()=>URL.revokeObjectURL(blobUrl),1000);
}
function searchResults(q){
  const text=(q||'').trim().toLowerCase();if(!text)return '<div class="empty">輸入名稱、平台、案件編號或文件名稱</div>';
  const rows=[...visibleStores(state,role).filter(s=>(s.name+' '+s.code+' '+platform(state,s)).toLowerCase().includes(text)).map(s=>['店舖',s.name+' · '+platform(state,s),link('stores',s.id)]),...visibleCases(state,role).filter(c=>(c.code+' '+c.title).toLowerCase().includes(text)).map(c=>['案件',c.code+' · '+c.title,link('cases',c.id)]),...visibleDocuments(state,role).filter(d=>d.name.toLowerCase().includes(text)).map(d=>['文件',d.name,link('docs',d.id)]),...visiblePeople(state,role).filter(p=>p.name.toLowerCase().includes(text)).map(p=>['人物',p.name,link('people',p.id)])];
  return rows.slice(0,14).map(([type,label,path])=>'<a class="search-result" href="'+path+'"><b>'+esc(label)+'</b><small>'+type+'</small></a>').join('')||'<div class="empty">找不到符合目前身分範圍的資料</div>';
}
function openModal(kind,id='',req=''){
  if((kind==='doc-view'||kind==='doc-version')&&!visibleDocuments(state,role).some(x=>x.id===id)){toast('目前身分無權查看此文件。',true);return}
  if(['admin-edit','admin-delete','login-create','login-edit','login-reset','login-status','delete-password','platform-create'].includes(kind)&&act().kind!=='admin'){toast('此操作需要系統管理員權限。',true);return}
  modalContext={kind,id,req};let title='',body='',wide=false;const c=caseById(state,id),f=settlement(state,id),t=state.tasks.find(x=>x.id===id),d=state.documents.find(x=>x.id===id),p=person(state,id),mv=state.movements.find(x=>x.id===id);
  if(kind==='role'){title='切換展示帳號';body='<div class="modal-body"><p class="muted-text">選擇帳號並輸入展示密碼。初始範例密碼：Demo1234!。這是本機模擬驗證。</p><div class="choice-list">'+Object.values(ACTORS).map(a=>'<button class="choice" data-action="login-prompt" data-id="'+a.id+'"><span>'+a.initial+'</span><span><b>'+a.name+'</b><small>'+a.title+'</small></span><span class="chev">'+(role===a.id?'目前使用':'→')+'</span></button>').join('')+'</div></div>'}
  else if(kind==='signin'){title='登入展示帳號';const u=state.users.find(x=>x.id===id);body=form(kind,field('登入密碼','password','','password',true,true,'autocomplete="current-password"'),'切換身分','帳號：'+esc(u?.name)+'（'+esc(u?.login)+'）。初始範例密碼 Demo1234!；管理員重設後使用新密碼。')}
  else if(kind==='tour'){title=act().title+'・首次使用導覽';const intros={index:'你的摘要與待辦',people:'合作對象與 CRM',accounts:'號主平台帳號',stores:'店舖與經營責任',cases:'案件流程與補件',tasks:'執行、佐證與費用',docs:'文件查看與下載',finance:'結算、差異與付款',operations:'銷售與物流摘要',history:'業務及操作歷程',settings:'登入權限與密碼管理',admin:'全部模組與資料維護'};const focus={owner:'先確認個人資料及平台帳號，再處理驗證文件與任務。',merchant:'查看責任店舖、任務與帳務，並上傳佐證或申請費用。',finance:'優先核對結算、費用申請與來源文件。',marketing:'查看店舖摘要、行銷任務與行銷文件。',ops:'從合作對象、平台帳號到 Store 建立關係，再處理案件與任務。',admin:'可進入所有模組，並在設定管理登入及二次刪除密碼。'};body='<div class="modal-body"><div class="notice"><b>歡迎，'+esc(act().name)+'</b><p>'+focus[act().kind]+' 此導覽只在這個展示帳號首次使用時出現，可從右上角圖示重開。</p></div><div class="choice-list" style="margin-top:15px">'+navItems().map(([key,ico,label])=>'<a class="choice" href="'+link(key)+'"><span>'+icon(ico)+'</span><span><b>'+label+'</b><small>'+intros[key]+'</small></span><span class="chev">→</span></a>').join('')+'</div></div>';wide=true}
  else if(kind==='scenario'){title='四段可操作展示路線';body='<div class="modal-body"><div class="choice-list">'+[['01','平台驗證：依序切換店主、號主補件，管理方提交',link('cases','cv1')],['02','罰款：事發 A／通知 B，確認歷史責任',link('cases','cp1')],['03','交接：在店舖頁發起，盤點四項後生效',link('stores','s1')],['04','退出：以林怡君身分提出，管理方完成',link('people','p2')]].map(([n,label,url])=>'<a class="choice" href="'+url+'"><span>'+n+'</span><b>'+label+'</b><span class="chev">→</span></a>').join('')+'</div></div>'}
  else if(kind==='notifications'){title='通知中心';body='<div class="modal-body"><div class="choice-list">'+(state.notifications.filter(n=>n.recipient===role).map(n=>'<button class="choice" data-action="notification" data-id="'+n.id+'"><span>'+icon('bell')+'</span><span><b>'+esc(n.title)+'</b><small>'+(n.read?'已讀':'未讀')+'</small></span><span class="chev">→</span></button>').join('')||'<div class="empty">目前沒有通知</div>')+'</div></div>'}
  else if(kind==='search'){title='全域搜尋';body='<div class="modal-body"><input id="global-search" class="input" placeholder="搜尋目前身分可見的人物、店舖、案件、文件" autocomplete="off"><div id="search-results">'+searchResults('')+'</div></div>';wide=true}
  else if(kind==='person-create'){title='新增合作對象';body=form(kind,choiceField('合作類型','kind',[['owner','號主（平台帳號持有人）'],['merchant','店主（實際經營者）']])+field('姓名或店家代表','name')+field('聯絡電話','phone','','text',false)+field('城市','city','','text',false)+field('Email','email','','email',false)+field('合作備註','notes','','textarea',false,true),'新增並查看','建立人物主檔後，可以新增平台帳號或指派店舖。')}
  else if(kind==='account-create'){title='新增平台帳號';const owners=state.people.filter(x=>x.kind==='owner'&&x.status!=='資料保留中');body=form(kind,choiceField('號主','ownerId',owners.map(x=>[x.id,x.name]),id||owners[0]?.id)+choiceField('平台','platform',state.settings.platforms.map(x=>[x,x]))+field('平台帳號識別碼','code','','text',true,true)+choiceField('狀態','status',[['正常','正常'],['驗證中','驗證中'],['授權將到期','授權將到期'],['暫停','暫停']])+field('帳號備註','note','','textarea',false,true),'建立帳號','此帳號會獨立保存。建立後可在其下新增 Store，變更將留下紀錄。')}
  else if(kind==='account-edit'){title='編輯平台帳號';const a=account(state,id);body=form(kind,field('帳號識別碼','code',a?.code)+choiceField('狀態','status',[['正常','正常'],['驗證中','驗證中'],['授權將到期','授權將到期'],['暫停','暫停'],['已歸還','已歸還']],a?.status)+field('備註','note',a?.note,'textarea',false,true)+field('修改原因','reason','','textarea',true,true),'儲存帳號','平台與號主關係固定；退出流程會歸還帳號並關閉其下店舖。')}
  else if(kind==='store-create'){title='新增 Store 店舖';const acc=state.accounts.filter(a=>!a.deletedAt&&a.status!=='已歸還'),selected=acc.find(a=>a.id===id)||acc[0],merchants=state.people.filter(x=>!x.deletedAt&&x.kind==='merchant'&&!['歷任店主','已取消合作'].includes(x.status));body=form(kind,choiceField('平台帳號','accountId',acc.map(a=>[a.id,a.platform+' · '+a.code+' / '+person(state,a.ownerId)?.name]),selected?.id)+field('店舖名稱','name')+field('Store 編號','code')+choiceField('現任店主','merchantId',merchants.map(x=>[x.id,x.name]))+field('經營起日','startDate','2026-10-15','date')+field('商品類別','category','綜合選物')+choiceField('號主公司／商號（選填）','entityId',[['','不指定'],...state.entities.filter(e=>!e.deletedAt&&e.kind==='owner_business').map(e=>[e.id,e.name+'・'+person(state,e.ownerId)?.name])])+field('備註','note','','textarea',false,true),'建立店舖','同名跨平台是兩間獨立 Store；號主商號須與帳號號主一致。')}
  else if(kind==='store-edit'){title='編輯店舖資料';const st=store(state,id);body=form(kind,field('店舖名稱','name',st?.name)+field('商品類別','category',st?.category)+field('備註','note',st?.note,'textarea',false,true)+field('修改原因','reason','','textarea',true,true),'儲存資料','帳號與店主關係另走正式交接流程。')}
  else if(kind==='entity-create'){title='新增號主公司／商號';body=form(kind,choiceField('所屬號主','ownerId',state.people.filter(x=>x.kind==='owner'&&!x.deletedAt).map(x=>[x.id,x.name]),id)+field('公司或商號名稱','name')+field('統一編號（可遮蔽）','taxId','','text',false),'建立商號','將顯示在此號主的 CRM 關係中。')}
  else if(kind==='person-document'){title='號主個人文件';const owners=state.people.filter(x=>x.kind==='owner'&&(isOps()||act().personId===x.id));body=form(kind,choiceField('號主','ownerId',owners.map(x=>[x.id,x.name]),id||owners[0]?.id)+choiceField('文件種類','type',[['身分證','身分證'],['銀行存摺','銀行存摺'],['授權書','授權書'],['其他個人文件','其他個人文件']])+field('文件名稱','name','示範文件.pdf')+field('資料來源','source','號主展示上傳')+'<div class="field full"><label>選擇示範檔案（選填，最多 1 MB）</label><input class="input" type="file" name="file"><small>僅供 DEMO，資料存在此瀏覽器。請勿上傳真實身分證或存摺。</small></div>','儲存個人文件','這類文件只讓該號主與授權管理方查看；店主看不到。')}
  else if(kind==='login-create'){title='新增展示登入帳號';const pp=person(state,id),defaultKind=pp?.kind||'ops';body=form(kind,field('登入代號','login')+field('顯示名稱','name',pp?.name||'')+choiceField('角色','kind',[['ops','管理方・營運'],['marketing','管理方・行銷'],['finance','管理方・會計'],['owner','號主'],['merchant','店主'],['admin','系統管理員']],defaultKind)+choiceField('綁定合作對象（號主／店主必選）','personId',[['','不綁定'],...state.people.filter(x=>!x.deletedAt).map(x=>[x.id,x.name+'・'+(x.kind==='owner'?'號主':'店主')])],pp?.id||'')+field('初始密碼（至少 8 字）','password','','password',true,true,'minlength="8"'),'建立登入','建立後需輸入密碼才能切換到此帳號。展示版的密碼僅在本機驗證。')}
  else if(kind==='login-edit'){title='修改登入與權限';const u=state.users.find(x=>x.id===id);body=form(kind,field('顯示名稱','name',u?.name)+choiceField('角色','kind',[['admin','系統管理員'],['ops','營運'],['marketing','行銷'],['finance','會計'],['owner','號主'],['merchant','店主']],u?.kind)+choiceField('綁定合作對象','personId',[['','不綁定'],...state.people.filter(x=>!x.deletedAt).map(x=>[x.id,x.name+'・'+(x.kind==='owner'?'號主':'店主')])],u?.personId||'')+field('修改原因','reason','','textarea',true,true),'更新權限','登入代號：'+esc(u?.login)+'。變更會記入 Audit。')}
  else if(kind==='login-reset'){title='重設登入密碼';const u=state.users.find(x=>x.id===id);body=form(kind,field('新密碼（至少 8 字）','password','','password',true,true,'minlength="8"')+field('重設原因','reason','','textarea',true,true),'重設密碼','帳號：'+esc(u?.login)+'。舊密碼將立即失效。')}
  else if(kind==='delete-password'){title='設定二次刪除密碼';body=form(kind,(state.settings.deletionVerifier?field('目前二次密碼','oldPassword','','password',true,true):'')+field('獨立二次密碼（至少 8 字）','password','','password',true,true,'minlength="8"')+field('再次輸入','confirm','','password',true,true,'minlength="8"'),'儲存二次密碼','刪除業務資料時須再次輸入；請與登入密碼不同。')}
  else if(kind==='merchant-status'){title='變更店主合作狀態';body=form(kind,choiceField('合作狀態','status',[['合作中','合作中'],['待交接','待交接'],['已取消合作','已取消合作']],p?.status)+field('變更原因','reason','','textarea',true,true),'確認變更','取消合作前，所有現任經營店舖須先完成交接。取消後舊姓名保留但不再連結。')}
  else if(kind==='sales-assign'){title='指派負責業務';body=form(kind,choiceField('負責業務','salesId',[['','未指派'],...Object.values(ACTORS).filter(a=>a.kind==='sales').map(a=>[a.id,a.name+'・'+a.title])],p?.salesId||'')+field('指派原因','reason','','textarea',true,true),'確認指派','指派後，該號主的平台帳號、店舖與文件可見範圍隨之改變。')}
  else if(kind==='login-status'){title='變更登入狀態';const u=state.users.find(x=>x.id===id);body=form(kind,choiceField('狀態','status',[['啟用','啟用'],['停用','停用']],u?.status)+field('異動原因','reason','','textarea',true,true),'儲存狀態','登入：'+esc(u?.login))}
  else if(kind==='platform-create'){title='新增電商平台';body=form(kind,field('平台名稱','name'),'新增平台','新平台可在建立平台帳號時選擇。')}
  else if(kind==='settlement-create'){title='建立店舖結算';body=form(kind,choiceField('Store','storeId',storeOptions())+field('結算編號','code','SET-2026-10-007')+field('結算期間（YYYY/MM）','period','2026/10')+field('基本金額','base','0','number',true,false,'min="0" step="1"'),'建立結算','建立後可逐筆調整、登錄付款並建立對帳案件。')}
  else if(kind==='task'){title='新增任務';const source=c?'case':'store',storeId=c?.storeId||visibleStores(state,role)[0]?.id;body=form(kind,choiceField('Store','storeId',storeOptions(),storeId)+field('任務名稱','title','')+field('完成條件','criteria','','textarea',true,true)+choiceField('負責人','assignee',actorOptions(),role)+field('截止日期','due','2026-10-22','date')+(c?'<input type="hidden" name="sourceId" value="'+c.id+'"><input type="hidden" name="sourceType" value="case">':''),'建立任務','建立者、負責人及來源會一同保存。')}
  else if(kind==='task-status'){title='更新任務／上傳佐證';body=form(kind,choiceField('新狀態','status',TASK_STATUSES.map(x=>[x,x]),t?.status)+field('處理說明（完成以外狀態必填）','reason','','textarea',false,true)+field('佐證名稱（選擇檔案時填寫）','evidenceName','','text',false)+fileField('任務單據或佐證（選填）')+field('費用申請金額（選填）','expenseAmount','','number',false,false,'min="0"')+field('費用用途（申請時必填）','expenseReason','','textarea',false,true)+choiceField('既有單據（未新增檔案時選）','documentId',[['','請選擇'],...(t?.evidenceDocIds||[]).map(did=>[did,state.documents.find(d=>d.id===did)?.name||did])]),'儲存任務','上傳單據後可同時申請費用；費用須由會計或管理員審核。')}
  else if(kind==='task-delete'){title='移除任務';body=form(kind,field('移除原因','reason','','textarea',true,true)+(act().kind==='admin'?field('二次刪除密碼','secondPassword','','password',true,true):''),'確認移除','工作清單移除後，業務紀錄和 Audit 仍保留。')}
  else if(kind==='expense-decide'){title='審核費用申請';const ex=state.expenseRequests.find(x=>x.id===id);body=form(kind,choiceField('審核結果','status',[['已核准','已核准'],['已退回','已退回']])+field('審核理由','reason','','textarea',true,true),'確認結果','申請金額 '+money(ex?.amount)+' · '+esc(ex?.reason))}
  else if(kind==='event'){title='新增重要事件';body=form(kind,choiceField('Store','storeId',storeOptions(),canViewStore(state,role,id)?id:visibleStores(state,role)[0]?.id)+field('事件名稱','title')+field('事件內容','detail','','textarea',true,true)+choiceField('後續動作','choice',[['record','只留業務紀錄'],['task','同步建立任務'],['case','同步建立驗證案件']]),'建立事件','Record 可以獨立存在，任務或案件依需要建立。')}
  else if(kind==='case'){title='建立案件';const types=act().kind==='merchant'?[['Reconciliation','對帳差異']]:act().kind==='owner'?[['Verification','平台驗證']]:act().kind==='finance'?[['Reconciliation','對帳差異']]:[['Verification','平台驗證'],['Penalty','罰款責任'],['Reconciliation','對帳差異']];body=form(kind,choiceField('Store','storeId',storeOptions())+choiceField('案件類型','type',types)+field('案件名稱','title')+field('截止日期','due','2026-10-25','date')+field('事發日（罰款案）','occurrenceAt','2026-10-12','date',false)+field('通知日（罰款案）','noticeAt','2026-10-15','date',false)+field('背景說明','description','','textarea',false,true),'建立案件','交接與退出使用各自的專用流程；罰款責任以事發日判斷。')}
  else if(kind==='crm'){title='提出 CRM 資料修改';body=form(kind,field('聯絡電話','phone',p?.phone)+field('城市','city',p?.city)+field('合作備註','notes',p?.notes,'textarea',false,true)+field('修改原因','reason','','textarea',true,true),'提交待號主確認','提交與確認是兩個獨立動作；修改須由該號主確認後生效。')}
  else if(kind==='handover'){title='提出店主交接';const target=store(state,id)||visibleStores(state,role)[0];body=form(kind,choiceField('Store','storeId',storeOptions(),target?.id)+choiceField('新店主','to',state.people.filter(x=>x.kind==='merchant'&&x.id!==currentOperator(state,target)?.id).map(x=>[x.id,x.name]),'mD')+field('生效日期','effectiveDate','2026-10-25','date')+field('交接原因','reason','','textarea',true,true),'建立交接案件','交接完成前，現任店主與歷史經營期間不會改動。')}
  else if(kind==='exit'){title='提出號主退出';const owners=state.people.filter(x=>x.kind==='owner'&&state.accounts.some(a=>a.ownerId===x.id&&a.status!=='已歸還')&&visiblePeople(state,role).some(z=>z.id===x.id));body=form(kind,choiceField('號主','ownerId',owners.map(x=>[x.id,x.name]),id||owners[0]?.id)+field('預定日期','date','2026-10-31','date')+field('退出原因','reason','','textarea',true,true),'提出退出','須清理未結案件與應付帳款，才可歸還帳號與關閉店舖。')}
  else if(kind==='evidence'){title='案件補件／更新佐證';const item=c?.requirements.find(x=>x.key===req);body=form(kind,field('文件名稱','name',(item?.label||'佐證')+'.pdf')+field('文件類型','type',item?.label)+field('資料來源','source','展示上傳')+'<div class="field full"><label>選擇檔案（選填，最多 1 MB）</label><input class="input" type="file" name="file"><small>未選檔時建立清楚標記為示範的文件資料。</small></div>','保存佐證','案件 '+esc(c?.code)+' · '+esc(item?.label))}
  else if(kind==='document'){title='加入文件';body=form(kind,choiceField('關聯 Store','storeId',storeOptions())+field('文件名稱','name')+(act().kind==='marketing'?choiceField('文件類型','type',[['廣告素材','廣告素材'],['行銷報表','行銷報表']]):field('文件類型','type','營運文件'))+field('資料來源','source','展示上傳')+'<div class="field full"><label>選擇檔案（選填，最多 1 MB）</label><input class="input" type="file" name="file"></div>','加入文件')}
  else if(kind==='doc-version'){title='更新文件版本';body=form(kind,field('來源與版本說明','source','新版示範上傳')+'<div class="field full"><label>選擇新檔案（選填，最多 1 MB）</label><input class="input" type="file" name="file"></div>','更新版本','目前 '+esc(d?.name)+' v'+esc(d?.version))}
  else if(kind==='doc-view'){title='查看文件・'+esc(d?.name);body='<div class="modal-body">'+(d?.dataUrl&&d.dataUrl.startsWith('data:image/')?'<img src="'+esc(d.dataUrl)+'" alt="'+esc(d.name)+'" style="width:100%;max-height:60vh;object-fit:contain">':d?.dataUrl&&d.dataUrl.startsWith('data:application/pdf')?'<iframe title="'+esc(d.name)+'" src="'+esc(d.dataUrl)+'" style="width:100%;height:55vh;border:0"></iframe>':'<div class="notice"><b>展示文件預覽</b><p>'+esc(d?.name)+' · '+esc(d?.type)+' · '+(d?.dataUrl?'此格式請下載開啟':'這是種子資料，只提供模擬內容與關聯紀錄')+'</p></div>')+'<div style="margin-top:14px">'+button('下載此文件','download-doc','btn primary',id)+'</div></div>';wide=true}
  else if(kind==='admin-edit'){title='管理員修正資料';const type=req||'person',obj=adminObject(type,id),fields={person:[['name','姓名'],['phone','電話'],['city','城市'],['email','Email'],['notes','備註'],['status','合作狀態'],...(obj?.kind==='owner'?[['sensitive.family','家庭'],['sensitive.occupation','職業'],['sensitive.income','收入'],['sensitive.health','健康']]:[])],account:[['code','帳號識別碼'],['status','狀態'],['note','備註']],store:[['name','店名'],['category','類別'],['note','備註']],case:[['title','標題'],['description','說明'],['due','截止日']],task:[['title','標題'],['criteria','完成條件'],['due','截止日']],document:[['name','名稱'],['type','類型'],['source','來源']],entity:[['name','名稱'],['taxId','統編']]}[type]||[];body=form(kind,'<input type="hidden" name="entityType" value="'+esc(type)+'">'+choiceField('欄位','field',fields)+field('修正後內容','value',String(adminValue(obj,fields[0]?.[0])||''),'text',true,true)+field('原因','reason','','textarea',true,true),'儲存修正','物件：'+esc(obj?.name||obj?.code||id)+'。關係與金額請使用專用流程，歷史結案不可改。')}
  else if(kind==='admin-delete'){title='管理員刪除資料';const obj=adminObject(req,id);body=form(kind,'<input type="hidden" name="entityType" value="'+esc(req)+'">'+field('刪除原因','reason','','textarea',true,true)+field('二次刪除密碼','secondPassword','','password',true,true),'確認刪除','物件：'+esc(obj?.name||obj?.code||id)+'。保留 Timeline／Audit；有依賴的資料會阻擋刪除。')}
  else if(kind==='penalty'){title='確認事發責任';const target=operatorAt(state,store(state,c.storeId),c.occurrenceAt);body=form(kind,choiceField('責任店主','merchantId',state.people.filter(x=>x.kind==='merchant').map(x=>[x.id,x.name]),target?.id)+field('判定理由','reason','依事發日 '+c.occurrenceAt+' 的經營有效期間判定','','',true,true),'確認責任','事發日 '+esc(c.occurrenceAt)+'，通知日 '+esc(c.noticeAt)+'；展示規則會檢查責任期間。')}
  else if(kind==='adjust'){title='結算金額調整';body=form(kind,field('調整金額（負數代表減項）','amount','-8000','number',true,false,'step="1"')+field('調整原因','reason','','textarea',true,true)+choiceField('關聯文件（選填）','documentId',[['','不指定'],...visibleDocuments(state,role).filter(x=>x.refs.some(r=>r.kind==='store'&&r.id===f.storeId)).map(x=>[x.id,x.name])]),'記錄調整','基本額 '+money(f?.base)+'，每筆調整保留理由與操作者。')}
  else if(kind==='payment'){title='登錄實際付款';body=form(kind,field('付款金額','amount',outstanding(f),'number',true,false,'min="1" step="1"')+field('付款備註','note','示範匯款','','',false,true),'登錄付款','目前未清 '+money(outstanding(f))) }
  else if(kind==='movement'){title='新增物流紀錄';body=form(kind,choiceField('Store','storeId',storeOptions())+choiceField('類型','type',[['入庫','入庫'],['出貨','出貨'],['退貨','退貨']])+field('數量','qty','100','number',true,false,'min="1"')+field('物流路線','route','台北主倉 → 平台')+field('來源編號','source','展示輸入'),'建立紀錄')}
  else if(kind==='movement-status'){title='更新物流狀態';body=form(kind,choiceField('狀態','status',[['待處理','待處理'],['待點收','待點收'],['對貨中','對貨中'],['已入庫','已入庫'],['已出貨','已出貨'],['已完成','已完成']],mv?.status)+field('變更原因','reason','','textarea',true,true),'儲存','編號 '+esc(mv?.code))}
  else return;
  modal(title,body,wide);
}

function commit(work,message,next){
  try{const draft=clone(state),result=work(draft);saveState(draft);state=draft;closeModal();render();toast(message);if(next)location.href=next(result);return result}
  catch(error){toast(error?.message||'無法儲存，請檢查資料。',true);return null}
}
async function fileData(formEl){const file=formEl.querySelector('input[type="file"]')?.files?.[0];if(!file)return null;if(file.size>1024*1024)throw Error('檔案上限為 1 MB。');return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('無法讀取檔案。'));reader.readAsDataURL(file)})}
async function submitForm(formEl){
  const kind=formEl.dataset.form,ctx={...modalContext},data=new FormData(formEl),v=k=>String(data.get(k)||'').trim();let file=null;
  try{file=await fileData(formEl)}catch(error){toast(error.message,true);return}
  const redirect=(pageName)=>x=>link(pageName,x?.id);
  if(kind==='signin'){const u=state.users.find(x=>x.id===ctx.id&&x.status==='啟用'&&!x.deletedAt);if(!u){toast('帳號已停用。',true);return}const valid=u.passwordHash?await passwordHash(v('password'))===u.passwordHash:v('password')==='Demo1234!';if(!valid){toast('密碼不正確。',true);return}role=u.id;localStorage.setItem(ROLE_KEY,role);closeModal();render();showTourOnce();toast('已切換為 '+u.name);return}
  if(kind==='person-create')commit(s=>createPerson(s,role,{kind:v('kind'),name:v('name'),phone:v('phone'),city:v('city'),email:v('email'),notes:v('notes')}),'合作對象已建立',redirect('people'));
  else if(kind==='account-create')commit(s=>createPlatformAccount(s,role,{ownerId:v('ownerId'),platform:v('platform'),code:v('code'),status:v('status'),note:v('note')}),'平台帳號已建立',redirect('accounts'));
  else if(kind==='account-edit')commit(s=>updatePlatformAccount(s,role,ctx.id,{code:v('code'),status:v('status'),note:v('note')},v('reason')),'平台帳號已更新');
  else if(kind==='store-create')commit(s=>createStore(s,role,{accountId:v('accountId'),name:v('name'),code:v('code'),merchantId:v('merchantId'),startDate:v('startDate'),category:v('category'),entityId:v('entityId'),note:v('note')}),'Store 已建立',redirect('stores'));
  else if(kind==='store-edit')commit(s=>updateStore(s,role,ctx.id,{name:v('name'),category:v('category'),note:v('note')},v('reason')),'Store 資料已更新');
  else if(kind==='entity-create')commit(s=>createOwnerBusiness(s,role,{ownerId:v('ownerId'),name:v('name'),taxId:v('taxId')}),'號主商號已建立');
  else if(kind==='person-document')commit(s=>addPersonDocument(s,role,v('ownerId'),{type:v('type'),name:v('name'),source:v('source'),dataUrl:file}),'個人文件已儲存',redirect('docs'));
  else if(kind==='login-create'){if(v('password').length<8){toast('密碼至少 8 字。',true);return}const hash=await passwordHash(v('password'));commit(s=>createLogin(s,role,{login:v('login'),name:v('name'),kind:v('kind'),personId:v('personId'),passwordHash:hash}),'展示登入已建立',()=>link('settings'))}
  else if(kind==='login-edit')commit(s=>updateLogin(s,role,ctx.id,{name:v('name'),kind:v('kind'),personId:v('personId')},v('reason')),'登入權限已更新');
  else if(kind==='login-reset'){if(v('password').length<8){toast('密碼至少 8 字。',true);return}const hash=await passwordHash(v('password'));commit(s=>resetLoginPassword(s,role,ctx.id,hash,v('reason')),'密碼已重設');}
  else if(kind==='delete-password'){if(v('password').length<8||v('password')!==v('confirm')){toast('二次密碼至少 8 字，兩次輸入需相同。',true);return}const hash=await passwordHash(v('password')),old=v('oldPassword')?await passwordHash(v('oldPassword')):null;commit(s=>setDeletionPassword(s,role,hash,old),'二次密碼已設定')}
  else if(kind==='login-status')commit(s=>setLoginStatus(s,role,ctx.id,v('status'),v('reason')),'登入狀態已更新');
  else if(kind==='merchant-status')commit(s=>setMerchantStatus(s,role,ctx.id,v('status'),v('reason')),'店主合作狀態已更新');
  else if(kind==='sales-assign')commit(s=>assignSales(s,role,ctx.id,v('salesId'),v('reason')),'負責業務已更新');
  else if(kind==='platform-create')commit(s=>addPlatform(s,role,v('name')),'平台已加入');
  else if(kind==='settlement-create')commit(s=>createSettlement(s,role,{storeId:v('storeId'),code:v('code'),period:v('period'),base:v('base')}),'結算已建立',redirect('finance'));
  else if(kind==='task')commit(s=>createTask(s,role,{storeId:v('storeId'),title:v('title'),criteria:v('criteria'),assignee:v('assignee'),due:v('due'),sourceType:v('sourceType')||'store',sourceId:v('sourceId')||v('storeId')}),'任務已建立',redirect('tasks'));
  else if(kind==='task-status'){
    const expense=v('expenseAmount'),evidenceName=v('evidenceName')||formEl.querySelector('input[type="file"]')?.files?.[0]?.name;
    if(file&&!evidenceName){toast('請填寫佐證名稱。',true);return}
    commit(s=>{let docId=v('documentId');if(file)docId=addTaskEvidence(s,role,ctx.id,{name:evidenceName,type:'任務單據',dataUrl:file}).id;if(expense)requestExpense(s,role,ctx.id,expense,v('expenseReason'),docId);return updateTask(s,role,ctx.id,v('status'),v('reason'))},'任務、佐證與費用已更新');
  }
  else if(kind==='task-delete'){const hash=act().kind==='admin'?await passwordHash(v('secondPassword')):null;commit(s=>deleteTask(s,role,ctx.id,v('reason'),hash),'任務已移除',()=>link('tasks'))}
  else if(kind==='expense-decide')commit(s=>decideExpense(s,role,ctx.id,v('status'),v('reason')),'費用審核已記錄');
  else if(kind==='event')commit(s=>addRecord(s,role,v('storeId'),v('title'),v('detail'),v('choice')),'事件已記錄',result=>result.case?link('cases',result.case.id):result.task?link('tasks',result.task.id):link('stores',v('storeId')));
  else if(kind==='case')commit(s=>createCase(s,role,{storeId:v('storeId'),type:v('type'),title:v('title'),due:v('due'),description:v('description'),settlementId:v('settlementId'),occurrenceAt:v('occurrenceAt'),noticeAt:v('noticeAt')}),'案件已建立',redirect('cases'));
  else if(kind==='crm')commit(s=>submitCrm(s,role,ctx.id,{phone:v('phone'),city:v('city'),notes:v('notes')},v('reason')),'已提交，等待號主確認');
  else if(kind==='handover')commit(s=>requestHandover(s,role,v('storeId'),v('to'),v('effectiveDate'),v('reason')),'交接案件已建立',redirect('cases'));
  else if(kind==='exit')commit(s=>requestExit(s,role,v('ownerId'),v('date'),v('reason')),'退出案件已建立',redirect('cases'));
  else if(kind==='evidence')commit(s=>addDocument(s,role,{storeId:caseById(s,ctx.id).storeId,caseId:ctx.id,requirementKey:ctx.req,name:v('name'),type:v('type'),source:v('source'),dataUrl:file}),'佐證已更新');
  else if(kind==='document')commit(s=>addDocument(s,role,{storeId:v('storeId'),name:v('name'),type:v('type'),source:v('source'),dataUrl:file}),'文件已加入',redirect('docs'));
  else if(kind==='doc-version')commit(s=>updateDocumentVersion(s,role,ctx.id,file,v('source')),'文件版本已更新');
  else if(kind==='penalty')commit(s=>assignPenalty(s,role,ctx.id,v('merchantId'),v('reason')),'事發責任已確認');
  else if(kind==='adjust')commit(s=>addAdjustment(s,role,ctx.id,v('amount'),v('reason'),v('documentId')),'結算調整已記錄');
  else if(kind==='payment')commit(s=>addPayment(s,role,ctx.id,v('amount'),v('note')),'付款已登錄');
  else if(kind==='movement')commit(s=>addMovement(s,role,{storeId:v('storeId'),type:v('type'),qty:v('qty'),route:v('route'),source:v('source')}),'物流紀錄已新增');
  else if(kind==='movement-status')commit(s=>updateMovement(s,role,ctx.id,v('status'),v('reason')),'物流狀態已更新');
  else if(kind==='admin-edit')commit(s=>adminEdit(s,role,v('entityType'),ctx.id,v('field'),v('value'),v('reason')),'管理員修正已記錄');
  else if(kind==='admin-delete'){const hash=await passwordHash(v('secondPassword'));commit(s=>adminDelete(s,role,v('entityType'),ctx.id,v('reason'),hash),'資料已從清單移除，歷史保留',()=>link('admin'))}
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-action]');if(!el)return;
  const action=el.dataset.action,id=el.dataset.id||'';
  if(el.tagName==='A')e.preventDefault();
  if(action==='overlay'){if(e.target===el)closeModal();return}
  if(action==='close-modal'){closeModal();return}
  if(action==='modal'){openModal(el.dataset.kind,id,el.dataset.req||'');return}
  if(action==='login-prompt'){openModal('signin',id);return}
  if(action==='enter-admin'){openModal('signin','admin');return}
  if(action==='download-doc'){downloadDocument(id);return}
  if(action==='notification'){const n=state.notifications.find(x=>x.id===id);if(n)commit(s=>markNotification(s,role,id),'已標示通知');if(n)location.href='./'+n.route;return}
  if(action==='advance-case'){commit(s=>advanceCase(s,role,id),'案件已推進下一步');return}
  if(action==='confirm-crm'){commit(s=>confirmCrm(s,role,id),'號主已確認 CRM 修改');return}
  if(action==='lock-settlement'){commit(s=>lockSettlement(s,role,id),'結算已確認並鎖定');return}
  if(action==='dispute'){const fin=settlement(state,id);openModal('case');const formEl=document.querySelector('form[data-form="case"]');if(formEl){formEl.storeId.value=fin.storeId;formEl.type.value='Reconciliation';formEl.title.value=fin.period+' 結算異議';const hid=document.createElement('input');hid.type='hidden';hid.name='settlementId';hid.value=id;formEl.append(hid)}return}
  if(action==='chart-period'){chartPeriod=el.dataset.period;render();return}
});
document.addEventListener('submit',e=>{const formEl=e.target.closest('form[data-form]');if(formEl){e.preventDefault();submitForm(formEl)}});
document.addEventListener('input',e=>{if(e.target.id==='global-search')document.getElementById('search-results').innerHTML=searchResults(e.target.value)});
document.addEventListener('change',e=>{const el=e.target;if(el.name==='field'&&modalContext.kind==='admin-edit'){const obj=adminObject(modalContext.req,modalContext.id),input=document.querySelector('form[data-form="admin-edit"] [name="value"]');if(input)input.value=String(adminValue(obj,el.value)??'')}if(el.dataset.filterKey){const k=el.dataset.filterKey;filterState[k]=filterState[k]||{q:'',v:''};filterState[k][el.dataset.filterField]=el.value;render()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openModal('search')}if(e.key==='Enter'&&e.target.dataset.filterKey){e.preventDefault();e.target.blur()}});
render();
showTourOnce();
