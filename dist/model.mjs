export const ACTORS = {
  ops: {id:'ops',name:'陳予安',title:'管理方・營運',initial:'陳',kind:'ops'},
  finance: {id:'finance',name:'李思穎',title:'管理方・會計',initial:'李',kind:'finance'},
  marketing: {id:'marketing',name:'周怡潔',title:'管理方・行銷',initial:'周',kind:'marketing'},
  sales: {id:'sales',name:'業務人員',title:'管理方・業務',initial:'業',kind:'sales'},
  owner1: {id:'owner1',name:'王大明',title:'號主・帳號持有人',initial:'王',kind:'owner',personId:'p1'},
  owner2: {id:'owner2',name:'林怡君',title:'號主・帳號持有人',initial:'林',kind:'owner',personId:'p2'},
  merchant: {id:'merchant',name:'店主 B',title:'店主・實際經營者',initial:'B',kind:'merchant',personId:'mB'},
  merchantC: {id:'merchantC',name:'店主 C',title:'店主・實際經營者',initial:'C',kind:'merchant',personId:'mC'},
  merchantE: {id:'merchantE',name:'店主 E',title:'店主・實際經營者',initial:'E',kind:'merchant',personId:'mE'},
  merchantF: {id:'merchantF',name:'店主 F',title:'店主・實際經營者',initial:'F',kind:'merchant',personId:'mF'},
  owner3: {id:'owner3',name:'許雅婷',title:'號主・帳號持有人',initial:'許',kind:'owner',personId:'p3'},
  admin: {id:'admin',name:'系統管理員',title:'獨立系統後台',initial:'管',kind:'admin'}
};

export const STAGES = {
  Verification:['立案','盤點資料','補齊佐證','提交平台','等待審核','結案'],
  Penalty:['收到通知','確認責任','決定申訴','處理結果','費用處理','結案'],
  Reconciliation:['發現差異','比對來源','確認調整','實際付款','確認完成','結案'],
  Handover:['提出交接','盤點未結事項','處理差異','管理方確認','建立新關係','結案'],
  Exit:['提出退出','核對未結事項','最終結算','歸還帳號','關閉店舖','結案']
};
export const CASE_LABELS={Verification:'平台驗證',Penalty:'罰款責任',Reconciliation:'對帳差異',Handover:'店主交接',Exit:'號主退出'};
export const TASK_STATUSES=['待處理','進行中','完成','不執行','取消','重複建立'];
export const STORAGE_KEY='argo-commerce-os-demo-v2';
export const ROLE_KEY='argo-commerce-os-demo-role-v1';
export const TOUR_KEY='argo-commerce-os-tour-v3';

export const SEED={
  version:2,
  people:[
    {id:'p1',kind:'owner',salesId:'sales',name:'王大明',phone:'0912-***-456',city:'台北市',email:'wang@example.test',status:'合作中',notes:'合作 2 年，平台驗證待補件。',sensitive:{family:'已授權資料',occupation:'自由工作者',income:'限專責人員',health:'限專責人員'}},
    {id:'p2',kind:'owner',salesId:'sales',name:'林怡君',phone:'0922-***-731',city:'新北市',email:'lin@example.test',status:'合作中',notes:'酷澎帳號，近期評估退出合作。',sensitive:{family:'未提供',occupation:'商業顧問',income:'限專責人員',health:'限專責人員'}},
    {id:'p3',kind:'owner',salesId:'sales',name:'許雅婷',phone:'0933-***-842',city:'桃園市',email:'hsu@example.test',status:'合作中',notes:'兩平台合作，待完成身分文件。',sensitive:{family:'未提供',occupation:'設計師',income:'未提供',health:'未提供'}},
    {id:'mA',kind:'merchant',name:'店主 A',phone:'—',city:'深圳',email:'merchant-a@example.test',status:'歷任店主',notes:'一號店歷任經營者。'},
    {id:'mB',kind:'merchant',name:'店主 B',phone:'—',city:'廣州',email:'merchant-b@example.test',status:'合作中',notes:'拾光選物現任經營者。'},
    {id:'mC',kind:'merchant',name:'店主 C',phone:'—',city:'杭州',email:'merchant-c@example.test',status:'合作中',notes:'森活日常現任經營者。'},
    {id:'mD',kind:'merchant',name:'店主 D',phone:'—',city:'廈門',email:'merchant-d@example.test',status:'待交接',notes:'交接情境候選人。'},
    {id:'mE',kind:'merchant',name:'店主 E',phone:'—',city:'福州',email:'merchant-e@example.test',status:'合作中',notes:'居家品類。'},
    {id:'mF',kind:'merchant',name:'店主 F',phone:'—',city:'廈門',email:'merchant-f@example.test',status:'合作中',notes:'美妝與選物。'}
  ],
  entities:[{id:'e1',name:'拾光商行',kind:'owner_business',ownerId:'p1',taxId:'2456****',storeIds:['s1','s2'],status:'營運中'},
    {id:'e2',name:'ARGO 營運管理',kind:'management_company',ownerId:null,storeIds:[],status:'營運中'},
    {id:'e3',name:'雅婷設計商行',kind:'owner_business',ownerId:'p3',taxId:'8932****',storeIds:['s5','s6'],status:'營運中'}],
  accounts:[
    {id:'a1',code:'SHP-WANG-001',platform:'Shopee',ownerId:'p1',status:'正常',storeIds:['s1']},
    {id:'a2',code:'MOMO-WANG-002',platform:'momo',ownerId:'p1',status:'正常',storeIds:['s2']},
    {id:'a3',code:'CP-LIN-003',platform:'酷澎',ownerId:'p2',status:'授權將到期',storeIds:['s3']},
    {id:'a4',code:'SHP-LIN-004',platform:'Shopee',ownerId:'p2',status:'正常',storeIds:['s4']},
    {id:'a5',code:'MOMO-HSU-005',platform:'momo',ownerId:'p3',status:'正常',storeIds:['s5']},
    {id:'a6',code:'SHP-HSU-006',platform:'Shopee',ownerId:'p3',status:'驗證中',storeIds:['s6']}
  ],
  stores:[
    {id:'s1',code:'STR-SHP-001',name:'拾光選物',accountId:'a1',entityId:'e1',status:'營運中',category:'居家生活',rating:4.8,returnRate:3.2,sales:1420000,orders:3148,trend:[61,73,68,82,77,90,96],assignments:[{merchantId:'mA',from:'2025-01-01',to:'2026-03-31',confirmedBy:'ops'},{merchantId:'mB',from:'2026-04-01',to:null,confirmedBy:'ops'}]},
    {id:'s2',code:'STR-MOMO-002',name:'拾光選物',accountId:'a2',entityId:'e1',status:'營運中',category:'居家生活',rating:4.7,returnRate:4.1,sales:980000,orders:1927,trend:[46,51,48,59,66,63,71],assignments:[{merchantId:'mB',from:'2026-05-01',to:null,confirmedBy:'ops'}]},
    {id:'s3',code:'STR-CP-003',name:'森活日常',accountId:'a3',entityId:null,status:'營運中',category:'生活選物',rating:4.6,returnRate:5.7,sales:760000,orders:1385,trend:[43,48,51,46,53,60,62],assignments:[{merchantId:'mC',from:'2025-11-01',to:null,confirmedBy:'ops'}]},
    {id:'s4',code:'STR-SHP-004',name:'森活日常',accountId:'a4',entityId:null,status:'營運中',category:'家居雜貨',rating:4.5,returnRate:3.9,sales:620000,orders:1017,trend:[36,42,41,48,47,54,59],assignments:[{merchantId:'mE',from:'2026-01-01',to:null,confirmedBy:'ops'}]},
    {id:'s5',code:'STR-MOMO-005',name:'小島選品',accountId:'a5',entityId:'e3',status:'營運中',category:'設計選物',rating:4.9,returnRate:2.6,sales:870000,orders:1436,trend:[47,51,58,62,61,72,81],assignments:[{merchantId:'mF',from:'2026-02-01',to:null,confirmedBy:'ops'}]},
    {id:'s6',code:'STR-SHP-006',name:'小島選品',accountId:'a6',entityId:'e3',status:'營運中',category:'美妝',rating:4.7,returnRate:4.4,sales:530000,orders:969,trend:[31,35,42,39,48,54,60],assignments:[{merchantId:'mE',from:'2026-06-01',to:null,confirmedBy:'ops'}]}
  ],
  documents:[
    {id:'d1',name:'九月訂貨單.pdf',type:'訂貨單',version:1,uploadedBy:'ops',uploadedAt:'2026-10-10 09:20',source:'管理方上傳',refs:[{kind:'store',id:'s1'},{kind:'case',id:'cv1'}],operational:true},
    {id:'d2',name:'九月進貨紀錄.csv',type:'進貨紀錄',version:1,uploadedBy:'ops',uploadedAt:'2026-10-10 10:15',source:'模擬匯出資料',refs:[{kind:'store',id:'s1'},{kind:'case',id:'cv1'}],operational:true},
    {id:'d3',name:'平台違規通知.pdf',type:'法律公文',version:1,uploadedBy:'ops',uploadedAt:'2026-04-08 11:00',source:'平台通知',refs:[{kind:'store',id:'s1'},{kind:'case',id:'cp1'}],operational:true},
    {id:'d4',name:'九月平台帳單.pdf',type:'平台帳單',version:1,uploadedBy:'finance',uploadedAt:'2026-10-11 14:10',source:'模擬平台匯出',refs:[{kind:'store',id:'s1'},{kind:'case',id:'cr1'},{kind:'settlement',id:'f1'}],operational:true},
    {id:'d5',name:'內部對帳表.xlsx',type:'對帳佐證',version:1,uploadedBy:'finance',uploadedAt:'2026-10-11 15:30',source:'示範資料',refs:[{kind:'case',id:'cr1'},{kind:'settlement',id:'f1'}],operational:true}
  ],
  cases:[
    {id:'cv1',code:'VC-001',type:'Verification',title:'Shopee 拾光選物貨源驗證',storeId:'s1',status:'處理中',step:2,due:'2026-10-18',createdAt:'2026-10-10',assignee:'ops',requirements:[{key:'purchase',label:'訂貨單',docId:'d1'},{key:'inbound',label:'進貨紀錄',docId:'d2'},{key:'logistics',label:'物流佐證',docId:null},{key:'payment',label:'付款證明',docId:null}],next:'補齊物流與付款證明',description:'平台要求核對近期貨源，需三方共同補件。'},
    {id:'cp1',code:'PN-001',type:'Penalty',title:'三月平台違規通知責任確認',storeId:'s1',status:'待確認',step:1,due:'2026-10-20',createdAt:'2026-04-08',occurrenceAt:'2026-03-18',noticeAt:'2026-04-08',responsibleMerchantId:null,decisionReason:'',assignee:'ops',requirements:[{key:'notice',label:'違規通知',docId:'d3'}],next:'確認事發期間店主',description:'事件發生時為 A 經營，通知送達時已由 B 經營。'},
    {id:'cr1',code:'RC-001',type:'Reconciliation',title:'九月帳務差異比對',storeId:'s1',status:'處理中',step:1,due:'2026-10-21',createdAt:'2026-10-11',settlementId:'f1',assignee:'finance',requirements:[{key:'platform',label:'平台帳單',docId:'d4'},{key:'ledger',label:'內部對帳表',docId:'d5'}],next:'核對來源及調整',description:'平台帳單與內部記帳金額有差異。'},
    {id:'ch0',code:'HO-001',type:'Handover',title:'拾光選物 A → B 交接',storeId:'s1',status:'已結案',step:5,due:'2026-04-01',createdAt:'2026-03-25',assignee:'ops',requirements:[{key:'inventory',label:'庫存盤點',docId:'d2'}],next:'已完成',handover:{from:'mA',to:'mB',effectiveDate:'2026-04-01'},description:'保留歷任經營期間與交接快照。'}
  ],
  tasks:[
    {id:'t1',title:'補九月物流佐證',storeId:'s1',sourceType:'case',sourceId:'cv1',assignee:'merchant',createdBy:'ops',due:'2026-10-17',status:'進行中',criteria:'上傳物流單或出貨佐證',deletedAt:null},
    {id:'t2',title:'確認付款證明',storeId:'s1',sourceType:'case',sourceId:'cv1',assignee:'owner1',createdBy:'ops',due:'2026-10-17',status:'待處理',criteria:'提供付款憑證並確認來源',deletedAt:null},
    {id:'t3',title:'比對九月平台費',storeId:'s1',sourceType:'case',sourceId:'cr1',assignee:'finance',createdBy:'ops',due:'2026-10-19',status:'進行中',criteria:'找出差額與費用來源',deletedAt:null},
    {id:'t4',title:'確認三月罰款責任',storeId:'s1',sourceType:'case',sourceId:'cp1',assignee:'ops',createdBy:'ops',due:'2026-10-20',status:'待處理',criteria:'核對事發日經營關係',deletedAt:null}
  ],
  settlements:[
    {id:'f1',code:'SET-2026-09-001',storeId:'s1',operatorId:'mB',period:'2026/09',base:168000,adjustments:[],payments:[{id:'pay1',amount:100000,date:'2026-10-09',note:'首筆匯款'}],status:'待對帳',locked:false,sourceDocIds:['d4','d5']},
    {id:'f2',code:'SET-2026-09-002',storeId:'s2',operatorId:'mB',period:'2026/09',base:93000,adjustments:[],payments:[{id:'pay2',amount:93000,date:'2026-10-10',note:'已核銷'}],status:'已完成',locked:true,sourceDocIds:[]}
  ],
  movements:[
    {id:'mv1',code:'IN-1012-031',type:'入庫',storeId:'s1',date:'2026-10-12',qty:480,route:'深圳 → 台北主倉',status:'已入庫',source:'PO-10031'},
    {id:'mv2',code:'OUT-1013-144',type:'出貨',storeId:'s2',date:'2026-10-13',qty:120,route:'台北主倉 → momo',status:'已出貨',source:'OUT-144'},
    {id:'mv3',code:'RT-1014-018',type:'退貨',storeId:'s1',date:'2026-10-14',qty:36,route:'Shopee → 台北主倉',status:'對貨中',source:'RET-018'},
    {id:'mv4',code:'IN-1015-006',type:'入庫',storeId:'s3',date:'2026-10-15',qty:260,route:'義烏 → 台北主倉',status:'待點收',source:'PO-10044'}
  ],
  records:[
    {id:'r1',time:'2026-10-15 09:20',storeId:'s1',entityType:'case',entityId:'cv1',title:'驗證案待補件',detail:'缺物流與付款證明。',actor:'ops'},
    {id:'r2',time:'2026-10-11 15:30',storeId:'s1',entityType:'case',entityId:'cr1',title:'九月對帳差異',detail:'建立 RC-001，待會計確認。',actor:'finance'},
    {id:'r3',time:'2026-04-08 11:00',storeId:'s1',entityType:'case',entityId:'cp1',title:'收到平台違規通知',detail:'事發日 2026-03-18；經營責任待確認。',actor:'ops'},
    {id:'r4',time:'2026-04-01 10:00',storeId:'s1',entityType:'store',entityId:'s1',title:'店主交接生效',detail:'A 經營期結束，B 開始經營。',actor:'ops'}
  ],
  audit:[
    {id:'au1',time:'2026-10-11 15:30',actor:'finance',action:'建立對帳案',entityType:'case',entityId:'cr1',before:'無',after:'RC-001',reason:'九月帳單差異'},
    {id:'au2',time:'2026-04-01 10:00',actor:'ops',action:'確認店主交接',entityType:'store',entityId:'s1',before:'店主 A',after:'店主 B',reason:'HO-001 交接完成'}
  ],
  notifications:[
    {id:'n1',title:'VC-001 待補付款證明',recipient:'owner1',route:'cases.html?id=cv1',read:false},
    {id:'n2',title:'VC-001 待補物流佐證',recipient:'merchant',route:'cases.html?id=cv1',read:false},
    {id:'n3',title:'RC-001 需核對來源',recipient:'finance',route:'cases.html?id=cr1',read:false},
    {id:'n4',title:'PN-001 待責任確認',recipient:'ops',route:'cases.html?id=cp1',read:false}
  ],
  pendingChanges:[],
  users:Object.values(ACTORS).map(x=>({...x,login:x.id,status:'啟用',passwordHash:null})),
  settings:{companyName:'ARGO 營運管理',platforms:['Shopee','momo','酷澎'],deletionVerifier:null},
  expenseRequests:[]
};

export function clone(x){return JSON.parse(JSON.stringify(x))}
function hydrateActors(s){for(const key of Object.keys(ACTORS))delete ACTORS[key];for(const u of s.users||[])if(u.status==='啟用'&&!u.deletedAt)ACTORS[u.id]={id:u.id,name:u.name,title:u.title,initial:u.initial,kind:u.kind,personId:u.personId}}
function assignSalesDefaults(state){for(const p of state.people)if(p.kind==='owner'&&p.salesId===undefined)p.salesId=SEED.people.find(x=>x.id===p.id)?.salesId??null}
export function loadState(){try{const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY));if(parsed?.version===2){parsed.settings=parsed.settings||clone(SEED.settings);parsed.settings.deletionVerifier??=null;parsed.expenseRequests??=[];assignSalesDefaults(parsed);parsed.users??=clone(SEED.users);for(const u of SEED.users)if(!parsed.users.some(x=>x.id===u.id))parsed.users.push(clone(u));for(const u of parsed.users)u.passwordHash??=null;hydrateActors(parsed);return parsed}const old=JSON.parse(localStorage.getItem('argo-commerce-os-demo-v1'));if(old?.version===1){const next=clone(old);next.version=2;for(const key of ['people','entities','accounts','stores'])for(const x of SEED[key])if(!next[key].some(y=>y.id===x.id))next[key].push(clone(x));next.users=clone(SEED.users);next.settings=clone(SEED.settings);next.expenseRequests=[];assignSalesDefaults(next);hydrateActors(next);return next}}catch{}const result=clone(SEED);hydrateActors(result);return result}
export function saveState(state){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));hydrateActors(state)}
export const person=(s,id)=>s.people.find(x=>x.id===id);
export const account=(s,id)=>s.accounts.find(x=>x.id===id);
export const store=(s,id)=>s.stores.find(x=>x.id===id);
export const caseById=(s,id)=>s.cases.find(x=>x.id===id);
export const settlement=(s,id)=>s.settlements.find(x=>x.id===id);
export const ownerOf=(s,st)=>person(s,account(s,st.accountId)?.ownerId);
export const currentOperator=(s,st)=>person(s,st.assignments.find(x=>!x.to)?.merchantId);
export const operatorAt=(s,st,date)=>person(s,st.assignments.find(x=>x.from<=date&&(!x.to||x.to>=date))?.merchantId);
export const platform=(s,st)=>account(s,st.accountId)?.platform||'—';
export const roleOf=id=>ACTORS[id]||{id,kind:'unknown',name:'無效帳號',title:'無權限',initial:'?'};
export function amount(fin){return fin.base+fin.adjustments.reduce((sum,x)=>sum+Number(x.amount),0)}
export function paid(fin){return fin.payments.reduce((sum,x)=>sum+Number(x.amount),0)}
export function outstanding(fin){return Math.max(0,amount(fin)-paid(fin))}
export const money=n=>'NT$ '+Number(n||0).toLocaleString('zh-TW');
const FINANCE_DOCUMENT_TYPES=new Set(['平台帳單','對帳佐證','內部對帳表','結算報表','付款證明','費用單據','發票','收據']);
const stamp=()=>new Date().toLocaleString('zh-TW',{hour12:false});
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const ensure=(condition,msg)=>{if(!condition)throw new Error(msg)};
const roleIs=(role,...kinds)=>kinds.includes(roleOf(role).kind);

export function visibleStores(s,role){
  const a=roleOf(role);
  if(['ops','admin','finance','marketing'].includes(a.kind))return s.stores.filter(x=>!x.deletedAt);
  if(a.kind==='owner')return s.stores.filter(x=>!x.deletedAt&&account(s,x.accountId)?.ownerId===a.personId);
  if(a.kind==='sales')return s.stores.filter(x=>!x.deletedAt&&s.people.some(p=>p.id===account(s,x.accountId)?.ownerId&&p.salesId===a.id));
  if(a.kind==='merchant')return s.stores.filter(x=>!x.deletedAt&&x.assignments.some(v=>v.merchantId===a.personId));
  return [];
}
export const canViewStore=(s,role,id)=>visibleStores(s,role).some(x=>x.id===id);
export function visibleCases(s,role){
  const ids=new Set(visibleStores(s,role).map(x=>x.id));
  return s.cases.filter(x=>{
    if(x.deletedAt)return false;
    if(roleOf(role).kind==='marketing')return false;
    if(roleOf(role).kind==='sales'&&x.type==='Reconciliation')return false;
    if(!ids.has(x.storeId))return false;
    if(roleOf(role).kind==='merchant'){
      if(x.type==='Penalty')return x.responsibleMerchantId===roleOf(role).personId;
      if(x.type==='Exit')return false;
    }
    if(roleOf(role).kind==='finance')return ['Reconciliation','Penalty','Exit'].includes(x.type);
    return true;
  });
}
export const canViewCase=(s,role,id)=>visibleCases(s,role).some(x=>x.id===id);
export function visibleTasks(s,role){
  const ids=new Set(visibleStores(s,role).map(x=>x.id));
  if(roleIs(role,'admin','ops'))return s.tasks.filter(x=>!x.deletedAt);
  return s.tasks.filter(x=>!x.deletedAt&&ids.has(x.storeId)&&!(roleIs(role,'sales')&&x.sourceType==='case'&&caseById(s,x.sourceId)?.type==='Reconciliation')&&(x.assignee===role||x.createdBy===role||roleIs(role,'finance')&&s.expenseRequests?.some(r=>r.taskId===x.id)));
}
export function canManageTask(s,role,id){const t=s.tasks.find(x=>x.id===id&&!x.deletedAt);return !!t&&visibleTasks(s,role).some(x=>x.id===id)&&(roleIs(role,'admin','ops')||t.assignee===role||t.createdBy===role)}
export function visibleSettlements(s,role){
  const ids=new Set(visibleStores(s,role).map(x=>x.id));
  return s.settlements.filter(x=>!x.deletedAt&&ids.has(x.storeId)&&!['marketing','sales'].includes(roleOf(role).kind)&&(roleOf(role).kind!=='merchant'||x.operatorId===roleOf(role).personId));
}
function financeDocument(s,d){
  return d.financeOnly===true||FINANCE_DOCUMENT_TYPES.has(d.type)||d.uploadedBy==='finance'||s.users?.some(u=>u.id===d.uploadedBy&&u.kind==='finance')||s.expenseRequests?.some(r=>r.documentId===d.id)||s.cases.some(c=>c.requirements?.some(r=>r.key==='payment'&&r.docId===d.id))||d.refs.some(r=>r.kind==='settlement'||r.kind==='case'&&caseById(s,r.id)?.type==='Reconciliation');
}
export function visibleDocuments(s,role){
  const ids=new Set(visibleStores(s,role).map(x=>x.id));
  return s.documents.filter(d=>{
    if(d.deletedAt)return false;
    if(d.privacy==='owner_private'){
      const pid=d.refs.find(r=>r.kind==='person')?.id;
      if(roleIs(role,'admin','ops'))return true;
      if(roleOf(role).kind==='owner')return roleOf(role).personId===pid;
      return roleOf(role).kind==='finance'&&d.type==='銀行存摺'&&visibleStores(s,role).some(st=>ownerOf(s,st)?.id===pid);
    }
    if(roleIs(role,'ops','admin'))return true;
    if(roleIs(role,'marketing'))return d.type==='廣告素材'||d.type==='行銷報表';
    if(roleIs(role,'sales')&&financeDocument(s,d))return false;
    const associated=d.refs.some(r=>r.kind==='store'&&ids.has(r.id)||r.kind==='case'&&canViewCase(s,role,r.id)||r.kind==='settlement'&&visibleSettlements(s,role).some(f=>f.id===r.id));
    return associated&&(roleOf(role).kind!=='merchant'||d.operational);
  });
}
export function visiblePeople(s,role){
  const a=roleOf(role);
  if(a.kind==='admin'||a.kind==='ops')return s.people.filter(x=>!x.deletedAt);
  if(a.kind==='owner')return s.people.filter(x=>!x.deletedAt&&x.id===a.personId);
  if(a.kind==='sales')return s.people.filter(x=>!x.deletedAt&&x.kind==='owner'&&x.salesId===a.id);
  if(a.kind==='finance')return s.people.filter(x=>!x.deletedAt&&x.kind==='owner'&&visibleStores(s,role).some(st=>ownerOf(s,st)?.id===x.id));
  return [];
}
export function audit(s,role,action,entityType,entityId,before,after,reason){
  s.audit.unshift({id:uid('au'),time:stamp(),actor:role,action,entityType,entityId,before:String(before??'—'),after:String(after??'—'),reason:reason||'示範操作'});
}
export function record(s,role,title,detail,entityType,entityId,storeId){
  s.records.unshift({id:uid('r'),time:stamp(),storeId,entityType,entityId,title,detail,actor:role});
}
export function notify(s,recipient,title,route){if(recipient&&ACTORS[recipient])s.notifications.unshift({id:uid('n'),recipient,title,route,read:false})}
function scoped(s,role,storeId){ensure(canViewStore(s,role,storeId),'這間店不在目前身分的責任範圍。')}
function caseManager(role,type){return roleIs(role,'ops','admin')||(type==='Reconciliation'&&roleIs(role,'finance'))}
export function createTask(s,role,x){
  scoped(s,role,x.storeId);
  ensure(x.title?.trim()&&x.criteria?.trim(),'請填寫任務名稱與完成條件。');
  ensure(ACTORS[x.assignee],'請選擇負責人。');
  ensure(canViewStore(s,x.assignee,x.storeId),'負責人無法查看這間店舖，請選擇有權限的帳號。');
  if(x.sourceType==='case'){
    ensure(caseById(s,x.sourceId)?.storeId===x.storeId&&canViewCase(s,role,x.sourceId),'來源案件與店舖不符或目前身分無權查看。');
    ensure(!(caseById(s,x.sourceId)?.type==='Reconciliation'&&roleIs(x.assignee,'sales')),'對帳案件任務不可指派業務。');
  }
  const t={id:uid('t'),title:x.title.trim(),storeId:x.storeId,sourceType:x.sourceType||'store',sourceId:x.sourceId||x.storeId,assignee:x.assignee,createdBy:role,due:x.due||'2026-10-22',status:'待處理',criteria:x.criteria.trim(),deletedAt:null};
  s.tasks.unshift(t);audit(s,role,'建立任務','task',t.id,'無',t.title,'責任範圍內新增');record(s,role,'建立任務',t.title,'task',t.id,t.storeId);notify(s,t.assignee,'新任務：'+t.title,'tasks.html?id='+t.id);return t;
}
export function updateTask(s,role,id,status,reason=''){
  const t=s.tasks.find(x=>x.id===id&&!x.deletedAt);ensure(canManageTask(s,role,id),'無權操作這項任務。');
  ensure(TASK_STATUSES.includes(status),'無效的任務狀態。');
  ensure(status==='完成'||reason.trim(),'此狀態需要填寫原因。');
  const before=t.status;t.status=status;t.statusReason=reason.trim();audit(s,role,'任務狀態變更','task',id,before,status,reason);record(s,role,'任務'+status,t.title+(reason?'；'+reason:''),'task',id,t.storeId);return t;
}
export function addTaskEvidence(s,role,taskId,x){
  const t=s.tasks.find(y=>y.id===taskId&&!y.deletedAt);ensure(canManageTask(s,role,taskId),'無權替此任務上傳佐證。');
  ensure(x.name?.trim(),'請填佐證名稱。');
  ensure(!roleIs(role,'sales'),'業務不上傳店舖文件或任務佐證。');
  const d={id:uid('d'),name:x.name.trim(),type:x.type||'任務佐證',version:1,uploadedBy:role,uploadedAt:stamp(),source:x.source||'任務上傳',refs:[{kind:'store',id:t.storeId},{kind:'task',id:t.id}],operational:true};
  if(x.dataUrl)d.dataUrl=x.dataUrl;s.documents.unshift(d);t.evidenceDocIds??=[];t.evidenceDocIds.push(d.id);
  audit(s,role,'上傳任務佐證','document',d.id,'無',d.name,'任務 '+t.title);record(s,role,'任務佐證上傳',d.name,'task',t.id,t.storeId);return d;
}
export function requestExpense(s,role,taskId,amountValue,reason,documentId){
  ensure(roleIs(role,'ops','admin'),'任務費用由營運申請，號主與店主只提交單據。');
  const t=s.tasks.find(y=>y.id===taskId&&!y.deletedAt);ensure(canManageTask(s,role,taskId),'無權申請此任務費用。');
  const value=Number(amountValue);ensure(Number.isFinite(value)&&value>0&&reason?.trim(),'請填正數金額與費用用途。');
  ensure(documentId&&t.evidenceDocIds?.includes(documentId),'費用申請須關聯這項任務的單據。');
  const r={id:uid('ex'),taskId,storeId:t.storeId,amount:value,reason:reason.trim(),documentId,requestedBy:role,requestedAt:stamp(),status:'待會計審核'};
  s.expenseRequests.push(r);audit(s,role,'申請任務費用','expense',r.id,'無',money(value),reason);record(s,role,'費用申請',t.title+'・'+money(value),'expense',r.id,t.storeId);notify(s,'finance','費用申請待審：'+t.title,'tasks.html?id='+t.id);return r;
}
export function decideExpense(s,role,id,status,reason){
  ensure(roleIs(role,'finance','admin'),'僅會計或管理員可審核費用。');const r=s.expenseRequests.find(x=>x.id===id);ensure(r&&r.status==='待會計審核','找不到待審費用。');
  ensure(['已核准','已退回'].includes(status)&&reason?.trim(),'請選擇審核結果並填寫原因。');r.status=status;r.decidedBy=role;r.decidedAt=stamp();r.decisionReason=reason.trim();
  audit(s,role,'審核費用','expense',id,'待會計審核',status,reason);record(s,role,'費用'+status,r.reason+'・'+money(r.amount),'expense',id,r.storeId);notify(s,r.requestedBy,'費用申請'+status,'tasks.html?id='+r.taskId);return r;
}
export function deleteTask(s,role,id,reason,secondHash){
  if(roleIs(role,'admin'))ensure(secondHash&&secondHash===s.settings.deletionVerifier,'系統管理員刪除前須通過二次密碼確認。');
  const t=s.tasks.find(x=>x.id===id&&!x.deletedAt);ensure(canManageTask(s,role,id),'無權刪除此任務。');
  ensure(!t.evidenceDocIds?.length&&!s.expenseRequests.some(r=>r.taskId===id),'任務已有單據或費用申請，請保留任務歷程。');
  ensure(reason?.trim(),'刪除任務必須填原因。');t.deletedAt=stamp();t.deleteReason=reason.trim();
  audit(s,role,'刪除任務','task',id,t.title,'從工作清單移除',reason);record(s,role,'任務已移除',t.title,'task',id,t.storeId);
}
export function submitCrm(s,role,personId,patch,reason){
  const p=person(s,personId);ensure(p?.kind==='owner'&&(roleIs(role,'ops','admin')||roleOf(role).personId===personId),'無權提出此 CRM 修改。');
  ensure(reason?.trim(),'請填寫修改原因。');
  const c={id:uid('pc'),personId,patch,reason,submittedBy:role,status:'待號主確認',time:stamp()};
  s.pendingChanges.unshift(c);audit(s,role,'提交 CRM 修改','person',personId,'待確認',JSON.stringify(patch),reason);
  notify(s,personId==='p1'?'owner1':'owner2','CRM 資料待你確認','people.html?id='+personId);return c;
}
export function confirmCrm(s,role,id){
  const c=s.pendingChanges.find(x=>x.id===id);ensure(c?.status==='待號主確認','找不到待確認修改。');
  ensure(roleOf(role).personId===c.personId||roleIs(role,'admin'),'此修改需由該號主確認。');
  const p=person(s,c.personId),before=JSON.stringify({phone:p.phone,city:p.city,notes:p.notes});
  for(const k of ['phone','city','notes'])if(c.patch[k]!==undefined)p[k]=c.patch[k];
  c.status='已確認';c.confirmedBy=role;c.confirmedAt=stamp();
  audit(s,role,'確認 CRM 修改','person',p.id,before,JSON.stringify({phone:p.phone,city:p.city,notes:p.notes}),c.reason);
  record(s,role,'CRM 修改已確認',c.reason,'person',p.id,s.stores.find(st=>ownerOf(s,st)?.id===p.id)?.id);return p;
}
export function createCase(s,role,x){
  scoped(s,role,x.storeId);ensure(x.title?.trim(),'請填寫案件名稱。');
  const type=x.type||'Verification';
  ensure(STAGES[type],'無效案件類型。');
  ensure(type!=='Handover'&&type!=='Exit','請使用交接或退出的專用流程。');
  const owner=ownerOf(s,store(s,x.storeId));
  ensure(caseManager(role,type)||roleOf(role).kind==='merchant'&&type==='Reconciliation'||roleOf(role).kind==='owner'&&type==='Verification','目前身分不能建立這類案件。');
  const reqs={Verification:[['purchase','訂貨單'],['inbound','進貨紀錄'],['logistics','物流佐證'],['payment','付款證明']],Penalty:[['notice','違規通知']],Reconciliation:[['platform','平台帳單'],['ledger','內部對帳表']]}[type]||[];
  if(type==='Penalty')ensure(x.occurrenceAt&&x.noticeAt&&x.occurrenceAt<=x.noticeAt,'罰款案必須填寫有效的事發日與通知日。');
  const c={id:uid('c'),code:({Verification:'VC',Penalty:'PN',Reconciliation:'RC'})[type]+'-'+String(s.cases.length+1).padStart(3,'0'),type,title:x.title.trim(),storeId:x.storeId,status:'處理中',step:0,due:x.due||'2026-10-25',createdAt:stamp(),assignee:type==='Reconciliation'?'finance':'ops',requirements:reqs.map(([key,label])=>({key,label,docId:null})),next:'盤點資料',description:x.description||'',ownerId:owner?.id,settlementId:x.settlementId||null,occurrenceAt:type==='Penalty'?x.occurrenceAt:undefined,noticeAt:type==='Penalty'?x.noticeAt:undefined};
  s.cases.unshift(c);audit(s,role,'建立案件','case',c.id,'無',c.code,x.description||'建立案件');record(s,role,'建立'+CASE_LABELS[type]+'案件',c.code,'case',c.id,c.storeId);notify(s,c.assignee,c.code+' 新案件','cases.html?id='+c.id);return c;
}
function closedEvidence(s,d){return s.cases.some(c=>c.status==='已結案'&&(d.refs.some(r=>r.kind==='case'&&r.id===c.id)||c.requirements.some(r=>r.docId===d.id)))}
export function addDocument(s,role,x){
  ensure(!roleIs(role,'sales'),'業務不上傳店舖文件。');
  scoped(s,role,x.storeId);
  if(roleIs(role,'marketing'))ensure(['廣告素材','行銷報表'].includes(x.type),'行銷角色僅能上傳行銷相關文件。');
  if(x.caseId){const c=caseById(s,x.caseId);ensure(c&&c.storeId===x.storeId&&canViewCase(s,role,x.caseId),'案件與店舖不符或無權補件。');ensure(c.status!=='已結案','已結案案件的歷史佐證不可覆寫。')}
  if(x.settlementId)ensure(settlement(s,x.settlementId)?.storeId===x.storeId,'結算與店舖不符。');
  ensure(x.name?.trim()&&x.type?.trim(),'請填寫文件名稱與類型。');
  const financeOnly=roleIs(role,'finance')||FINANCE_DOCUMENT_TYPES.has(x.type.trim())||!!x.settlementId||x.requirementKey==='payment'||caseById(s,x.caseId)?.type==='Reconciliation';
  ensure(!roleIs(role,'sales')||!financeOnly,'業務不可上傳財務文件。');
  const existing=x.caseId&&x.requirementKey?s.documents.find(d=>d.refs.some(r=>r.kind==='case'&&r.id===x.caseId)&&d.type===x.type&&d.name===x.name):null;
  const refs=[{kind:'store',id:x.storeId}];
  if(x.caseId)refs.push({kind:'case',id:x.caseId});
  if(x.settlementId)refs.push({kind:'settlement',id:x.settlementId});
  let d;
  if(existing){ensure(!closedEvidence(s,existing),'已結案案件的歷史佐證不可覆寫。');const before=existing.version;existing.version++;existing.uploadedAt=stamp();existing.uploadedBy=role;existing.financeOnly=existing.financeOnly===true||financeOnly;existing.source=x.source||'示範上傳';if(x.dataUrl)existing.dataUrl=x.dataUrl;d=existing;audit(s,role,'更新文件版本','document',d.id,'v'+before,'v'+d.version,'新版本上傳')}
  else{d={id:uid('d'),name:x.name.trim(),type:x.type.trim(),version:1,uploadedBy:role,uploadedAt:stamp(),source:x.source||'展示上傳',refs,operational:true,financeOnly};if(x.dataUrl)d.dataUrl=x.dataUrl;s.documents.unshift(d);audit(s,role,'新增文件','document',d.id,'無',d.name,'文件上傳')}
  if(x.caseId&&x.requirementKey){const c=caseById(s,x.caseId),req=c?.requirements.find(r=>r.key===x.requirementKey);ensure(req,'找不到指定的補件項目。');req.docId=d.id;notify(s,c.assignee,c.code+' 收到新佐證','cases.html?id='+c.id)}
  record(s,role,'文件已補充',d.name+' v'+d.version,'document',d.id,x.storeId);return d;
}
export function updateDocumentVersion(s,role,id,dataUrl,source){
  ensure(!roleIs(role,'sales'),'業務不更新店舖文件版本。');
  const d=s.documents.find(x=>x.id===id);ensure(d&&visibleDocuments(s,role).some(x=>x.id===id),'無權更新此文件。');
  if(d.privacy==='owner_private')ensure(roleIs(role,'admin','ops')||roleOf(role).kind==='owner'&&roleOf(role).personId===d.refs.find(r=>r.kind==='person')?.id,'無權更新號主個人文件。');
  ensure(!closedEvidence(s,d),'已結案案件的歷史佐證不可覆寫。');
  const storeRef=d.refs.find(r=>r.kind==='store');
  const before=d.version;d.version++;d.uploadedBy=role;d.uploadedAt=stamp();d.source=source||'展示新版本';
  if(roleIs(role,'finance'))d.financeOnly=true;
  if(dataUrl)d.dataUrl=dataUrl;
  audit(s,role,'更新文件版本','document',id,'v'+before,'v'+d.version,source||'新版文件');
  record(s,role,'文件版本更新',d.name+' v'+d.version,'document',id,storeRef?.id);return d;
}
export function assignPenalty(s,role,id,merchantId,reason){
  const c=caseById(s,id);ensure(c?.type==='Penalty'&&caseManager(role,c.type),'只有管理方可以確認罰款責任。');
  ensure(canViewCase(s,role,id),'無權處理此案件。');ensure(reason?.trim(),'請填責任判定理由。');
  const expected=operatorAt(s,store(s,c.storeId),c.occurrenceAt);
  ensure(merchantId===expected?.id,'示範規則以事發日的經營期間判定；請選擇 '+(expected?.name||'有效期間內店主')+'。');
  c.responsibleMerchantId=merchantId;c.decisionReason=reason.trim();c.status='處理中';
  audit(s,role,'確認責任','case',id,'待確認',person(s,merchantId)?.name,reason);record(s,role,'罰款責任已確認','事發日 '+c.occurrenceAt+'，'+reason,'case',id,c.storeId);return c;
}
export function addAdjustment(s,role,id,amountValue,reason,documentId){
  ensure(roleIs(role,'finance','admin'),'只有會計可調整結算。');
  const f=settlement(s,id);ensure(f&&visibleSettlements(s,role).some(x=>x.id===id),'無權查看此結算。');ensure(!f.locked,'已鎖定結算不可直接調整。');
  const n=Number(amountValue);ensure(Number.isFinite(n)&&n!==0,'請輸入非零調整金額。');ensure(amount(f)+n>=paid(f),'調整後金額不可小於已付款金額。');ensure(reason?.trim(),'調整必須填寫原因。');
  const a={id:uid('adj'),amount:n,reason:reason.trim(),documentId:documentId||null,actor:role,time:stamp()};f.adjustments.push(a);
  audit(s,role,'新增結算調整','settlement',id,'原始 '+money(f.base),'調整 '+money(n),reason);record(s,role,'結算金額調整',reason+' '+money(n),'settlement',id,f.storeId);return f;
}
export function createSettlement(s,role,x){
  ensure(roleIs(role,'finance','admin'),'僅會計或系統管理員可建立結算。');
  const st=store(s,x.storeId);ensure(st&&visibleStores(s,role).some(y=>y.id===st.id),'無權處理此店舖。');
  ensure(x.code?.trim()&&/^\d{4}\/\d{2}$/.test(x.period||''),'請填結算編號與 YYYY/MM 期間。');uniqueCode(s.settlements,x.code.trim());
  const base=Number(x.base);ensure(Number.isFinite(base)&&base>=0,'基本金額須為零或正數。');
  ensure(!s.settlements.some(f=>f.storeId===st.id&&f.period===x.period),'此 Store 在該期間已有結算。');
  const operator=currentOperator(s,st);ensure(operator,'店舖沒有現任店主，無法建立結算。');
  const f={id:uid('f'),code:x.code.trim(),storeId:st.id,operatorId:operator.id,period:x.period,base,adjustments:[],payments:[],status:'待對帳',locked:false,sourceDocIds:[]};
  s.settlements.unshift(f);audit(s,role,'建立結算','settlement',f.id,'無',f.code,'基本金額 '+money(base));record(s,role,'建立店舖結算',f.code+'・'+x.period,'settlement',f.id,st.id);return f;
}
export function addPayment(s,role,id,value,note){
  ensure(roleIs(role,'finance','admin'),'只有會計可登錄付款。');const f=settlement(s,id);ensure(f&&visibleSettlements(s,role).some(x=>x.id===id),'無權查看此結算。');ensure(!f.locked,'已鎖定結算不可直接修改。');
  const n=Number(value);ensure(n>0&&n<=outstanding(f),'付款金額必須大於零，且不能超過未清金額。');
  f.payments.push({id:uid('pay'),amount:n,date:stamp().slice(0,10),note:note||'示範付款'});
  audit(s,role,'登錄付款','settlement',id,money(paid(f)-n),money(paid(f)),note);record(s,role,'收到付款',money(n),'settlement',id,f.storeId);return f;
}
export function lockSettlement(s,role,id){
  ensure(roleIs(role,'finance','admin'),'只有會計可以確認結算。');const f=settlement(s,id);ensure(f&&visibleSettlements(s,role).some(x=>x.id===id),'無權查看此結算。');
  ensure(outstanding(f)===0,'尚有未清金額 '+money(outstanding(f))+'。');
  const disputes=s.cases.filter(c=>c.settlementId===id&&c.type==='Reconciliation'&&c.status!=='已結案');
  ensure(disputes.length===0,'請先結束關聯的對帳差異案件。');
  f.locked=true;f.status='已完成';audit(s,role,'結算確認鎖定','settlement',id,'待對帳','已完成','核對付款與案件');record(s,role,'結算已完成',f.code,'settlement',id,f.storeId);return f;
}
export function requestHandover(s,role,storeId,to,effectiveDate,reason){
  scoped(s,role,storeId);ensure(roleIs(role,'ops','merchant','admin'),'此身分不能提出店主交接。');
  const st=store(s,storeId),cur=currentOperator(s,st);ensure(st?.status==='營運中'&&cur,'店舖目前不能交接。');
  ensure(person(s,to)?.kind==='merchant'&&person(s,to)?.status!=='已取消合作'&&to!==cur.id,'請選擇仍在合作中的新店主。');
  ensure(effectiveDate>st.assignments.find(x=>!x.to).from,'生效日必須晚於現任店主開始日。');
  ensure(!s.cases.some(c=>c.type==='Handover'&&c.storeId===storeId&&c.status!=='已結案'),'已有待處理交接案件。');
  const c={id:uid('c'),code:'HO-'+String(s.cases.length+1).padStart(3,'0'),type:'Handover',title:st.name+' '+cur.name+' → '+person(s,to).name+' 交接',storeId,status:'處理中',step:1,due:effectiveDate,createdAt:stamp(),assignee:'ops',requirements:[['inventory','庫存盤點'],['refund','未結退款'],['amount','未結帳款'],['platform','平台狀態']].map(([key,label])=>({key,label,docId:null})),next:'補齊交接盤點',description:reason||'店主交接',handover:{from:cur.id,to,effectiveDate,confirmed:false}};
  s.cases.unshift(c);audit(s,role,'提出店主交接','case',c.id,cur.name,person(s,to).name,reason);record(s,role,'提出店主交接',c.title,'case',c.id,storeId);notify(s,'ops',c.code+' 待交接盤點','cases.html?id='+c.id);return c;
}
export function requestExit(s,role,ownerId,date,reason){
  ensure(roleIs(role,'ops','owner','admin')&&(roleIs(role,'ops','admin')||roleOf(role).personId===ownerId),'此身分不能提出號主退出。');
  const acc=s.accounts.find(x=>x.ownerId===ownerId&&x.status!=='已歸還');ensure(acc,'沒有可退出的平台帳號。');
  ensure(!s.cases.some(c=>c.type==='Exit'&&c.ownerId===ownerId&&c.status!=='已結案'),'已有待處理退出案件。');
  const st=store(s,acc.storeIds[0]);
  const c={id:uid('c'),code:'EX-'+String(s.cases.length+1).padStart(3,'0'),type:'Exit',title:person(s,ownerId).name+' 合作退出',storeId:st.id,ownerId,status:'處理中',step:1,due:date,createdAt:stamp(),assignee:'ops',requirements:[],next:'核對未結事項',description:reason||'合作退出',exit:{effectiveDate:date}};
  s.cases.unshift(c);audit(s,role,'提出號主退出','case',c.id,'合作中','退出申請',reason);record(s,role,'號主退出申請',c.title,'case',c.id,st.id);notify(s,'ops',c.code+' 需核對帳號與店舖','cases.html?id='+c.id);return c;
}
export function advanceCase(s,role,id){
  const c=caseById(s,id);ensure(c&&canViewCase(s,role,id),'無權查看此案件。');ensure(caseManager(role,c.type),'這個步驟需要管理方確認。');ensure(c.status!=='已結案','案件已結案。');
  const missing=c.requirements.filter(x=>!x.docId);
  if(c.type==='Verification'&&c.step>=2&&c.step<4)ensure(!missing.length,'仍缺 '+missing.map(x=>x.label).join('、')+'，不能提交平台。');
  if(c.type==='Penalty'&&c.step>=1)ensure(c.responsibleMerchantId&&c.decisionReason,'請先確認事發期間的責任店主。');
  if(c.type==='Handover'&&c.step>=1)ensure(!missing.length,'交接盤點尚缺 '+missing.map(x=>x.label).join('、')+'。');
  if(c.type==='Reconciliation'&&c.step>=3){const f=settlement(s,c.settlementId);if(f)ensure(outstanding(f)===0,'結算仍有未清金額 '+money(outstanding(f))+'。')}
  if(c.type==='Exit')ensure(!exitBlockers(s,c).length,'尚有未結事項：'+exitBlockers(s,c).join('、')+'。');
  const before=STAGES[c.type][c.step];c.step=Math.min(c.step+1,STAGES[c.type].length-1);
  const next=STAGES[c.type][c.step];c.next=next==='結案'?'已完成':'進行「'+next+'」';
  if(next==='結案'){
    c.status='已結案';
    if(c.type==='Handover')applyHandover(s,c,role);
    if(c.type==='Exit')applyExit(s,c,role);
  }else c.status='處理中';
  audit(s,role,'推進案件','case',id,before,next,'檢查完成條件');record(s,role,'案件進入 '+next,c.code,'case',id,c.storeId);return c;
}
function previousDay(date){const d=new Date(date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10)}
function applyHandover(s,c,role){
  const st=store(s,c.storeId),cur=st.assignments.find(x=>!x.to);ensure(cur&&cur.merchantId===c.handover.from,'交接前的現任店主已變更，請重新核對。');
  cur.to=previousDay(c.handover.effectiveDate);st.assignments.push({merchantId:c.handover.to,from:c.handover.effectiveDate,to:null,confirmedBy:role});
  record(s,role,'店主交接正式生效',person(s,cur.merchantId).name+' → '+person(s,c.handover.to).name,'store',st.id,st.id);
  audit(s,role,'確認經營關係','store',st.id,person(s,cur.merchantId).name,person(s,c.handover.to).name,c.code);
}
export function exitBlockers(s,c){
  const ownedAccounts=s.accounts.filter(a=>a.ownerId===c.ownerId&&a.status!=='已歸還');
  const ids=new Set(ownedAccounts.flatMap(a=>a.storeIds));
  const open=s.cases.filter(x=>x.id!==c.id&&ids.has(x.storeId)&&x.status!=='已結案');
  const due=s.settlements.filter(x=>ids.has(x.storeId)&&outstanding(x)>0);
  return [...open.map(x=>x.code+' 未結'),...due.map(x=>x.code+' 未清 '+money(outstanding(x)))];
}
function applyExit(s,c,role){
  for(const a of s.accounts.filter(x=>x.ownerId===c.ownerId&&x.status!=='已歸還')){
    a.status='已歸還';
    for(const st of s.stores.filter(x=>x.accountId===a.id)){
      st.status='已關閉';const current=st.assignments.find(x=>!x.to);if(current)current.to=c.exit.effectiveDate;
      record(s,role,'號主退出・店舖關閉',a.code+' 帳號已歸還','store',st.id,st.id);
      audit(s,role,'關閉店舖','store',st.id,'營運中','已關閉',c.code);
    }
  }
  const p=person(s,c.ownerId);p.status='資料保留中';
  audit(s,role,'號主退出完成','person',p.id,'合作中','資料保留中',c.code);
}
export function addRecord(s,role,storeId,title,detail,choice){
  scoped(s,role,storeId);ensure(title?.trim()&&detail?.trim(),'請填寫事件與內容。');
  const r={id:uid('r'),time:stamp(),storeId,entityType:'store',entityId:storeId,title:title.trim(),detail:detail.trim(),actor:role};s.records.unshift(r);
  audit(s,role,'新增業務紀錄','record',r.id,'無',r.title,detail);
  if(choice==='task'){const t=createTask(s,role,{storeId,title:'處理：'+title,criteria:detail,assignee:role,sourceType:'record',sourceId:r.id});return {record:r,task:t}}
  if(choice==='case'){const c=createCase(s,role,{storeId,title,type:'Verification',description:detail});return {record:r,case:c}}
  return {record:r};
}
export function addMovement(s,role,x){
  ensure(roleIs(role,'ops','admin','merchant'),'只有管理方或店主可新增物流紀錄。');scoped(s,role,x.storeId);
  const st=store(s,x.storeId);
  ensure(st.status==='營運中','已關閉店舖不可新增物流紀錄。');
  if(roleIs(role,'merchant'))ensure(currentOperator(s,st)?.id===roleOf(role).personId,'只有目前負責的店主可新增物流紀錄。');
  const qty=Number(x.qty);ensure(qty>0&&x.route?.trim(),'請填入數量與物流路線。');
  const m={id:uid('mv'),code:'MV-'+String(s.movements.length+1).padStart(4,'0'),type:x.type||'入庫',storeId:x.storeId,date:stamp().slice(0,10),qty,route:x.route.trim(),status:'待處理',source:x.source||'展示輸入'};
  s.movements.unshift(m);audit(s,role,'新增物流紀錄','movement',m.id,'無',m.code,m.source);record(s,role,'物流紀錄建立',m.code+'・'+m.route,'movement',m.id,m.storeId);return m;
}
export function updateMovement(s,role,id,status,reason){
  ensure(roleIs(role,'ops','admin'),'只有管理方可更新物流紀錄。');
  const m=s.movements.find(x=>x.id===id);ensure(m&&canViewStore(s,role,m.storeId),'無權更新此物流紀錄。');
  ensure(reason?.trim(),'請說明異動原因。');const before=m.status;m.status=status;
  audit(s,role,'更新物流狀態','movement',id,before,status,reason);record(s,role,'物流狀態更新',m.code+'：'+status,'movement',id,m.storeId);return m;
}
export function markNotification(s,role,id){
  const n=s.notifications.find(x=>x.id===id);ensure(n&&n.recipient===role,'無權讀取此通知。');n.read=true;return n;
}
function manager(role){ensure(roleIs(role,'ops','admin'),'僅管理方可設定合作資料。')}
function ownerScope(s,role,ownerId){ensure(roleIs(role,'ops','admin')||roleIs(role,'sales')&&person(s,ownerId)?.salesId===roleOf(role).id,'此身分不能管理這位號主。')}
function uniqueCode(list,code,except){ensure(!list.some(x=>x.code?.toLowerCase()===code.toLowerCase()&&x.id!==except),'此編號已存在，請使用不同編號。')}
export function createPerson(s,role,x){
  ensure(roleIs(role,'ops','admin')||roleIs(role,'sales')&&x.kind==='owner','此身分只能新增號主。');ensure(['owner','merchant'].includes(x.kind),'請選擇合作類型。');ensure(x.name?.trim(),'請輸入合作對象姓名。');
  const p={id:uid('p'),kind:x.kind,name:x.name.trim(),phone:x.phone?.trim()||'—',city:x.city?.trim()||'—',email:x.email?.trim()||'',status:'合作中',notes:x.notes?.trim()||'',sensitive:x.kind==='owner'?{family:'未提供',occupation:'未提供',income:'未提供',health:'未提供'}:undefined};
  if(roleIs(role,'sales'))p.salesId=roleOf(role).id;
  s.people.unshift(p);audit(s,role,'新增合作對象','person',p.id,'無',p.name,x.kind);record(s,role,'新增合作對象',p.name+'・'+x.kind,'person',p.id);return p;
}
export function createPlatformAccount(s,role,x){
  ownerScope(s,role,x.ownerId);const owner=person(s,x.ownerId);ensure(owner?.kind==='owner'&&owner.status!=='資料保留中','請選擇有效號主。');
  ensure(s.settings.platforms.includes(x.platform),'請選擇已設定的平台。');ensure(x.code?.trim(),'請填寫平台帳號識別碼。');uniqueCode(s.accounts,x.code.trim());
  const a={id:uid('a'),code:x.code.trim(),platform:x.platform,ownerId:owner.id,status:x.status||'正常',storeIds:[],note:x.note?.trim()||'',history:[{time:stamp(),actor:role,action:'建立',detail:'號主 '+owner.name+'・'+x.platform}]};
  s.accounts.unshift(a);audit(s,role,'建立平台帳號','account',a.id,'無',a.code,'號主 '+owner.name);record(s,role,'建立平台帳號',a.code,'account',a.id);return a;
}
export function updatePlatformAccount(s,role,id,patch,reason){
  const a=account(s,id);ensure(a,'找不到平台帳號。');ownerScope(s,role,a.ownerId);ensure(reason?.trim(),'修改原因必填。');
  const before=JSON.stringify({code:a.code,status:a.status,note:a.note});
  if(patch.code?.trim()){uniqueCode(s.accounts,patch.code.trim(),id);a.code=patch.code.trim()}
  if(patch.status)ensure(['正常','驗證中','授權將到期','暫停','已歸還'].includes(patch.status),'無效帳號狀態。');
  if(patch.status==='已歸還')ensure(a.storeIds.every(id=>store(s,id)?.status==='已關閉'),'帳號下仍有營運中的店舖，請使用號主退出流程。');
  if(patch.status)a.status=patch.status;
  a.note=patch.note?.trim()||'';
  const after=JSON.stringify({code:a.code,status:a.status,note:a.note});a.history=a.history||[];a.history.unshift({time:stamp(),actor:role,action:'修改',detail:reason.trim()});
  audit(s,role,'修改平台帳號','account',id,before,after,reason);record(s,role,'平台帳號修改',a.code+'・'+reason,'account',id);return a;
}
export function createStore(s,role,x){
  manager(role);const a=account(s,x.accountId),merchant=person(s,x.merchantId);ensure(a&&a.status!=='已歸還','請選擇有效的平台帳號。');ensure(merchant?.kind==='merchant'&&merchant.status!=='已取消合作','請選擇仍在合作中的店主。');
  ensure(x.name?.trim()&&x.code?.trim()&&x.startDate,'請填店名、店舖編號與經營起日。');uniqueCode(s.stores,x.code.trim());
  const entity=x.entityId?s.entities.find(e=>e.id===x.entityId):null;ensure(!entity||entity.kind==='owner_business'&&entity.ownerId===a.ownerId,'號主公司必須屬於該平台帳號的號主。');
  const st={id:uid('s'),code:x.code.trim(),name:x.name.trim(),accountId:a.id,entityId:entity?.id||null,status:'營運中',category:x.category?.trim()||'綜合選物',rating:0,returnRate:0,sales:0,orders:0,trend:[0,0,0,0,0,0,0],note:x.note?.trim()||'',assignments:[{merchantId:merchant.id,from:x.startDate,to:null,confirmedBy:role}]};
  s.stores.unshift(st);a.storeIds.push(st.id);if(entity)entity.storeIds.push(st.id);audit(s,role,'建立 Store','store',st.id,'無',st.code,'帳號 '+a.code+'，店主 '+merchant.name);record(s,role,'店舖建立',st.name+'・'+a.platform,'store',st.id,st.id);return st;
}
export function updateStore(s,role,id,patch,reason){
  manager(role);const st=store(s,id);ensure(st&&reason?.trim(),'請選擇店舖並填修改原因。');const before=JSON.stringify({name:st.name,category:st.category,note:st.note});
  ensure(patch.name?.trim(),'店名不可空白。');st.name=patch.name.trim();st.category=patch.category?.trim()||'綜合選物';st.note=patch.note?.trim()||'';
  audit(s,role,'修改 Store','store',id,before,JSON.stringify({name:st.name,category:st.category,note:st.note}),reason);record(s,role,'店舖資料修改',reason,'store',id,id);return st;
}
export function createOwnerBusiness(s,role,x){
  ownerScope(s,role,x.ownerId);const owner=person(s,x.ownerId);ensure(owner?.kind==='owner'&&x.name?.trim(),'請選擇號主並填寫公司或商號名稱。');
  const e={id:uid('e'),name:x.name.trim(),kind:'owner_business',ownerId:owner.id,taxId:x.taxId?.trim()||'未提供',storeIds:[],status:'營運中'};
  s.entities.unshift(e);audit(s,role,'建立號主商號','entity',e.id,'無',e.name,'號主 '+owner.name);return e;
}
export function assignSales(s,role,ownerId,salesId,reason){
  manager(role);const owner=person(s,ownerId);ensure(owner?.kind==='owner','請選擇號主。');
  ensure(!salesId||ACTORS[salesId]?.kind==='sales','請選擇業務。');ensure(reason?.trim(),'請填寫指派原因。');
  const before=owner.salesId||'未指派';owner.salesId=salesId||null;
  audit(s,role,'指派負責業務','person',ownerId,before,owner.salesId||'未指派',reason);record(s,role,'負責業務變更',owner.name+'・'+reason,'person',ownerId);return owner;
}
export function addPersonDocument(s,role,ownerId,x){
  const p=person(s,ownerId);ensure(p?.kind==='owner'&&(roleIs(role,'ops','admin')||roleOf(role).kind==='owner'&&roleOf(role).personId===ownerId),'無權上傳此號主文件。');
  ensure(['身分證','銀行存摺','授權書','其他個人文件'].includes(x.type),'請選擇個人文件類型。');ensure(x.name?.trim(),'請填文件名稱。');
  const d={id:uid('d'),name:x.name.trim(),type:x.type,version:1,uploadedBy:role,uploadedAt:stamp(),source:x.source||'展示上傳',refs:[{kind:'person',id:ownerId}],privacy:'owner_private',operational:false};
  if(x.dataUrl)d.dataUrl=x.dataUrl;s.documents.unshift(d);audit(s,role,'上傳號主文件','document',d.id,'無',d.name,'僅號主與授權管理方可見');record(s,role,'號主文件上傳',d.type+'・'+d.name,'document',d.id);return d;
}
export function createLogin(s,role,x){
  ensure(roleIs(role,'admin'),'僅系統管理員可設定登入帳號。');ensure(x.login?.trim()&&x.name?.trim(),'請填登入代號與顯示名稱。');
  ensure(['admin','ops','marketing','finance','sales','owner','merchant'].includes(x.kind),'無效角色。');ensure(!s.users.some(u=>u.login.toLowerCase()===x.login.trim().toLowerCase()),'登入代號已存在。');
  const p=x.personId?person(s,x.personId):null;ensure(!['owner','merchant'].includes(x.kind)||p?.kind===x.kind,'號主或店主登入必須綁定相同類型的合作對象。');
  ensure(!p||!p.deletedAt&&p.status!=='已取消合作'&&p.status!=='資料保留中','已結束合作的對象不可建立登入。');
  const u={id:uid('u'),login:x.login.trim(),name:x.name.trim(),title:({admin:'系統管理員',ops:'管理方・營運',marketing:'管理方・行銷',sales:'管理方・業務',finance:'管理方・會計',owner:'號主・帳號持有人',merchant:'店主・實際經營者'})[x.kind],initial:x.name.trim()[0],kind:x.kind,personId:p?.id,status:'啟用',passwordHash:x.passwordHash||null};
  s.users.unshift(u);hydrateActors(s);audit(s,role,'新增展示登入','user',u.id,'無',u.login,u.kind);return u;
}
export function setLoginStatus(s,role,id,status,reason){
  ensure(roleIs(role,'admin'),'僅系統管理員可管理登入帳號。');const u=s.users.find(x=>x.id===id);ensure(u&&['啟用','停用'].includes(status),'找不到帳號或狀態無效。');ensure(reason?.trim(),'請填寫異動原因。');
  ensure(id!==role||status==='啟用','請先切換另一位管理員，再停用目前使用的登入。');
  if(status==='啟用'&&u.personId)ensure(!['已取消合作','資料保留中'].includes(person(s,u.personId)?.status),'此合作對象已結束合作，無法啟用登入。');
  if(u.kind==='admin'&&status==='停用')ensure(s.users.filter(x=>x.kind==='admin'&&x.status==='啟用').length>1,'不可停用最後一個系統管理員。');
  const before=u.status;u.status=status;hydrateActors(s);audit(s,role,'登入狀態變更','user',id,before,status,reason);return u;
}
export function addPlatform(s,role,name){ensure(roleIs(role,'admin'),'僅系統管理員可設定平台。');ensure(name?.trim(),'請填平台名稱。');ensure(!s.settings.platforms.some(x=>x.toLowerCase()===name.trim().toLowerCase()),'平台已存在。');s.settings.platforms.push(name.trim());audit(s,role,'新增平台選項','settings','platforms','無',name,'展示設定');return name.trim()}
export function updateLogin(s,role,id,x,reason){
  ensure(roleIs(role,'admin'),'僅系統管理員可修改登入帳號。');const u=s.users.find(y=>y.id===id&&!y.deletedAt);ensure(u&&reason?.trim(),'找不到帳號或缺少原因。');
  ensure(['admin','ops','marketing','finance','sales','owner','merchant'].includes(x.kind),'角色無效。');const p=x.personId?person(s,x.personId):null;
  ensure(id!==role||x.kind==='admin','請先切換另一位管理員，再修改目前帳號的管理權限。');
  ensure(!['owner','merchant'].includes(x.kind)||p?.kind===x.kind,'號主或店主帳號須綁定同類合作對象。');
  ensure(!p||!p.deletedAt&&p.status!=='已取消合作'&&p.status!=='資料保留中','已結束合作的對象不可綁定登入。');
  if(u.kind==='admin'&&x.kind!=='admin')ensure(s.users.filter(y=>y.kind==='admin'&&y.status==='啟用'&&!y.deletedAt).length>1,'不可移除最後一位管理員。');
  const before=JSON.stringify({name:u.name,kind:u.kind,personId:u.personId});u.name=x.name?.trim()||u.name;u.kind=x.kind;u.title=({admin:'系統管理員',ops:'管理方・營運',marketing:'管理方・行銷',sales:'管理方・業務',finance:'管理方・會計',owner:'號主・帳號持有人',merchant:'店主・實際經營者'})[x.kind];u.personId=p?.id;u.initial=u.name[0];
  audit(s,role,'修改登入權限','user',id,before,JSON.stringify({name:u.name,kind:u.kind,personId:u.personId}),reason);hydrateActors(s);return u;
}
export function resetLoginPassword(s,role,id,passwordHash,reason){
  ensure(roleIs(role,'admin'),'僅管理員可重設登入密碼。');const u=s.users.find(y=>y.id===id&&!y.deletedAt);ensure(u&&passwordHash&&reason?.trim(),'請指定帳號、新密碼與原因。');
  u.passwordHash=passwordHash;audit(s,role,'重設登入密碼','user',id,'已設定','新密碼已生效',reason);return u;
}
export function setDeletionPassword(s,role,passwordHash,oldHash){
  ensure(roleIs(role,'admin')&&passwordHash,'僅管理員可設定二次刪除密碼。');
  if(s.settings.deletionVerifier)ensure(oldHash===s.settings.deletionVerifier,'原二次密碼不正確。');
  s.settings.deletionVerifier=passwordHash;audit(s,role,'設定二次刪除密碼','settings','deletionVerifier','已更新','已設定','獨立刪除確認');return true;
}
export function setMerchantStatus(s,role,id,status,reason){
  manager(role);const p=person(s,id);ensure(p?.kind==='merchant'&&['合作中','待交接','已取消合作'].includes(status)&&reason?.trim(),'請選擇店主、狀態與原因。');
  if(status==='已取消合作')ensure(!s.stores.some(st=>!st.deletedAt&&st.status==='營運中'&&currentOperator(s,st)?.id===id),'仍有現任經營店舖，請先完成交接。');
  const before=p.status;p.status=status;if(status==='已取消合作'){for(const u of s.users.filter(u=>u.personId===id&&u.kind==='merchant'))u.status='停用';hydrateActors(s)}audit(s,role,'店主合作狀態變更','person',id,before,status,reason);record(s,role,'店主合作狀態',p.name+'・'+status,'person',id);return p;
}
const ADMIN_FIELDS={person:['name','phone','city','email','notes','status','sensitive.family','sensitive.occupation','sensitive.income','sensitive.health'],account:['code','status','note'],store:['name','category','note'],case:['title','description','due'],task:['title','criteria','due'],document:['name','type','source'],entity:['name','taxId']};
export function adminEdit(s,role,type,id,field,value,reason){
  ensure(roleIs(role,'admin'),'僅管理員可修正資料。');ensure(ADMIN_FIELDS[type]?.includes(field)&&reason?.trim(),'欄位不允許更正或未填原因。');
  const lists={person:s.people,account:s.accounts,store:s.stores,case:s.cases,task:s.tasks,document:s.documents,entity:s.entities};const x=lists[type]?.find(y=>y.id===id&&!y.deletedAt);
  ensure(x,'找不到可修改的資料。');ensure(!(type==='case'&&x.status==='已結案'),'歷史結案資料不可覆寫。');ensure(value?.trim(),'更正後內容不可空白。');
  if(type==='document')ensure(!closedEvidence(s,x),'已結案案件的歷史佐證不可覆寫。');
  if(type==='account')return updatePlatformAccount(s,role,id,{code:field==='code'?value:x.code,status:field==='status'?value:x.status,note:field==='note'?value:x.note},reason);
  if(type==='store'&&field==='name'||type==='store'&&field==='category'||type==='store'&&field==='note')return updateStore(s,role,id,{name:field==='name'?value:x.name,category:field==='category'?value:x.category,note:field==='note'?value:x.note},reason);
  if(type==='person'&&x.kind==='merchant'&&field==='status')return setMerchantStatus(s,role,id,value,reason);
  if(type==='person'&&x.kind==='owner'&&field==='status'){ensure(['合作中','資料保留中'].includes(value),'無效合作狀態。');ensure(!s.accounts.some(a=>a.ownerId===id&&a.status!=='已歸還')||value==='合作中','號主仍有帳號，請使用退出流程。')}
  if(type==='person'&&field.startsWith('sensitive.')){ensure(x.kind==='owner','僅號主有此敏感欄位。');const key=field.slice(10),before=x.sensitive?.[key];x.sensitive??={};x.sensitive[key]=value.trim();audit(s,role,'管理員敏感資料修正',type,id,before,x.sensitive[key],reason);return x}
  if(type==='entity'&&x.kind==='management_company'&&field==='name')s.settings.companyName=value.trim();
  const before=x[field];x[field]=value.trim();audit(s,role,'管理員資料修正',type,id,before,x[field],reason);record(s,role,'管理員資料修正',field+'・'+reason,type,id,x.storeId);return x;
}
export function adminDelete(s,role,type,id,reason,secondHash){
  ensure(roleIs(role,'admin'),'僅系統管理員可刪除。');ensure(s.settings.deletionVerifier&&secondHash===s.settings.deletionVerifier,'二次密碼不正確或尚未設定。');ensure(reason?.trim(),'刪除原因必填。');
  ensure(!['record','audit'].includes(type),'歷史紀錄不可刪除。');
  const lists={person:s.people,account:s.accounts,store:s.stores,case:s.cases,task:s.tasks,document:s.documents,settlement:s.settlements,entity:s.entities,user:s.users};const x=lists[type]?.find(y=>y.id===id&&!y.deletedAt);ensure(x,'找不到可刪除資料。');
  if(type==='person')ensure(!s.accounts.some(a=>!a.deletedAt&&a.ownerId===id)&&!s.stores.some(st=>!st.deletedAt&&st.assignments.some(a=>a.merchantId===id))&&!s.users.some(u=>!u.deletedAt&&u.personId===id)&&!s.documents.some(d=>!d.deletedAt&&d.refs.some(r=>r.kind==='person'&&r.id===id))&&!s.entities.some(e=>!e.deletedAt&&e.ownerId===id)&&!s.pendingChanges.some(c=>c.personId===id&&c.status!=='已確認'),'人物仍關聯帳號、Store、登入、文件、商號或待確認 CRM。');
  if(type==='account')ensure(!s.stores.some(st=>!st.deletedAt&&st.accountId===id),'帳號仍有 Store。');
  if(type==='store')ensure(!s.cases.some(c=>!c.deletedAt&&c.storeId===id)&&!s.tasks.some(t=>!t.deletedAt&&t.storeId===id)&&!s.settlements.some(f=>!f.deletedAt&&f.storeId===id)&&!s.documents.some(d=>!d.deletedAt&&d.refs.some(r=>r.kind==='store'&&r.id===id))&&!s.movements.some(m=>m.storeId===id),'Store 仍有案件、任務、結算、文件或物流紀錄。');
  if(type==='case')ensure(x.status!=='已結案'&&!s.tasks.some(t=>!t.deletedAt&&t.sourceType==='case'&&t.sourceId===id)&&!s.documents.some(d=>!d.deletedAt&&d.refs.some(r=>r.kind==='case'&&r.id===id)),'案件已有歷史結案或關聯資料。');
  if(type==='task')ensure(!x.evidenceDocIds?.length&&!s.expenseRequests.some(r=>r.taskId===id),'任務已有單據或費用申請。');
  if(type==='document')ensure(!s.cases.some(c=>c.requirements.some(r=>r.docId===id))&&!s.tasks.some(t=>!t.deletedAt&&t.evidenceDocIds?.includes(id))&&!s.expenseRequests.some(r=>r.documentId===id)&&!s.settlements.some(f=>f.sourceDocIds.includes(id)),'文件仍被案件、任務、費用或結算引用。');
  if(type==='settlement')ensure(!x.locked&&!x.payments.length&&!x.adjustments.length&&!s.cases.some(c=>c.settlementId===id),'結算已有付款、調整、案件或已鎖定。');
  if(type==='entity')ensure(x.kind==='owner_business'&&!s.stores.some(st=>!st.deletedAt&&st.entityId===id),'管理公司或仍關聯 Store 的商號不可刪除。');
  if(type==='user'){ensure(id!==role,'不可刪除目前登入的帳號。');if(x.kind==='admin')ensure(s.users.filter(u=>u.kind==='admin'&&u.status==='啟用'&&!u.deletedAt).length>1,'不可刪除最後一位管理員。')}
  x.deletedAt=stamp();x.deleteReason=reason.trim();audit(s,role,'管理員刪除（保留歷史）',type,id,x.name||x.code||id,'已從工作清單移除',reason);
  return x;
}
