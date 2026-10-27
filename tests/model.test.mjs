import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../dist/model.mjs';

const fresh=()=>m.clone(m.SEED);

test('relationships and role visibility keep the business boundaries',()=>{
  const s=fresh();
  assert.equal(s.stores.length,6);
  assert.equal(new Set(s.stores.map(st=>m.currentOperator(s,st)?.id)).size,4);
  assert.notEqual(s.stores.find(st=>st.id==='s1').accountId,s.stores.find(st=>st.id==='s2').accountId);
  assert.equal(s.entities.find(x=>x.kind==='management_company').storeIds.length,0);
  assert.equal(m.visibleStores(s,'owner1').length,2);
  assert.equal(m.visibleStores(s,'merchant').length,2);
  assert.equal(m.visibleStores(s,'marketing').length,6);
  assert.equal(m.visibleCases(s,'marketing').length,0);
  assert.equal(m.visibleSettlements(s,'marketing').length,0);
  assert.equal(m.visiblePeople(s,'merchant').length,0);
  assert.equal(m.visibleStores(s,'invalid-role').length,0);
});

test('CRM person, account, Store and personal documents form a usable chain',()=>{
  const s=fresh();
  const owner=m.createPerson(s,'admin',{kind:'owner',name:'新號主'});
  const merchant=m.createPerson(s,'ops',{kind:'merchant',name:'新店主'});
  const ownerUser=m.createLogin(s,'admin',{login:'new-owner',name:'新號主',kind:'owner',personId:owner.id,passwordHash:'hash-owner'});
  const merchantUser=m.createLogin(s,'admin',{login:'new-merchant',name:'新店主',kind:'merchant',personId:merchant.id,passwordHash:'hash-merchant'});
  const a=m.createPlatformAccount(s,'admin',{ownerId:owner.id,platform:'Shopee',code:'NEW-ACCOUNT'});
  assert.equal(a.storeIds.length,0);
  const entity=m.createOwnerBusiness(s,'ops',{ownerId:owner.id,name:'新商號'});
  const st=m.createStore(s,'admin',{accountId:a.id,name:'跨平台店',code:'NEW-STORE',merchantId:merchant.id,startDate:'2026-10-15',entityId:entity.id});
  assert.deepEqual(a.storeIds,[st.id]);
  assert.deepEqual(entity.storeIds,[st.id]);
  assert.equal(m.visibleStores(s,ownerUser.id)[0].id,st.id);
  assert.equal(m.visibleStores(s,merchantUser.id)[0].id,st.id);
  assert.throws(()=>m.updatePlatformAccount(s,'admin',a.id,{status:'已歸還'},'手動'),/仍有營運/);
  const idDoc=m.addPersonDocument(s,ownerUser.id,owner.id,{type:'身分證',name:'樣本身分證'});
  const bank=m.addPersonDocument(s,ownerUser.id,owner.id,{type:'銀行存摺',name:'樣本存摺'});
  assert.ok(m.visibleDocuments(s,ownerUser.id).some(d=>d.id===idDoc.id));
  assert.ok(!m.visibleDocuments(s,merchantUser.id).some(d=>d.id===idDoc.id));
  assert.ok(!m.visibleDocuments(s,'finance').some(d=>d.id===idDoc.id));
  assert.ok(m.visibleDocuments(s,'finance').some(d=>d.id===bank.id));
  assert.ok(m.visibleDocuments(s,'admin').some(d=>d.id===idDoc.id));
  assert.ok(s.audit.some(x=>x.entityId===a.id&&x.action==='建立平台帳號'));
});

test('owner CRM submission does not overwrite before owner confirmation',()=>{
  const s=fresh();
  const c=m.submitCrm(s,'ops','p1',{phone:'0999-123-456'},'換號碼');
  assert.equal(m.person(s,'p1').phone,'0912-***-456');
  assert.throws(()=>m.confirmCrm(s,'ops',c.id),/號主確認/);
  m.confirmCrm(s,'owner1',c.id);
  assert.equal(m.person(s,'p1').phone,'0999-123-456');
});

test('task evidence and expense application require a document and finance decision',()=>{
  const s=fresh();
  assert.throws(()=>m.requestExpense(s,'ops','t1',1500,'運費',null),/單據/);
  const d=m.addTaskEvidence(s,'merchant','t1',{name:'運費收據',dataUrl:'data:text/plain;base64,VEVTVA=='});
  const r=m.requestExpense(s,'ops','t1',1500,'驗證運費',d.id);
  assert.equal(r.status,'待會計審核');
  assert.ok(m.visibleTasks(s,'finance').some(t=>t.id==='t1'));
  assert.equal(m.canManageTask(s,'finance','t1'),false);
  assert.throws(()=>m.updateTask(s,'finance','t1','完成'),/無權/);
  assert.throws(()=>m.decideExpense(s,'merchant',r.id,'已核准','核對'),/會計/);
  m.decideExpense(s,'finance',r.id,'已核准','單據相符');
  assert.equal(r.status,'已核准');
  assert.throws(()=>m.deleteTask(s,'merchant','t1','完成'),/單據或費用/);
  assert.ok(s.audit.some(x=>x.entityId===r.id&&x.action==='審核費用'));
});

test('verification, temporal penalty, handover and multi-account exit retain the invariants',()=>{
  const s=fresh();
  assert.throws(()=>m.advanceCase(s,'ops','cv1'),/仍缺/);
  m.addDocument(s,'merchant',{storeId:'s1',caseId:'cv1',requirementKey:'logistics',name:'物流單',type:'物流佐證'});
  m.addDocument(s,'owner1',{storeId:'s1',caseId:'cv1',requirementKey:'payment',name:'付款單',type:'付款證明'});
  for(let i=0;i<3;i++)m.advanceCase(s,'ops','cv1');
  assert.equal(m.caseById(s,'cv1').status,'已結案');
  assert.throws(()=>m.assignPenalty(s,'ops','cp1','mB','通知日'),/事發日/);
  m.assignPenalty(s,'admin','cp1','mA','有效期間');
  const h=m.requestHandover(s,'ops','s2','mD','2026-10-25','交接');
  assert.throws(()=>m.advanceCase(s,'ops',h.id),/尚缺/);
  for(const req of h.requirements)m.addDocument(s,'ops',{storeId:'s2',caseId:h.id,requirementKey:req.key,name:req.label,type:req.label});
  for(let i=0;i<4;i++)m.advanceCase(s,'ops',h.id);
  assert.equal(m.store(s,'s2').assignments.filter(a=>!a.to).length,1);
  assert.equal(m.currentOperator(s,m.store(s,'s2')).id,'mD');
  const exit=m.requestExit(s,'owner2','p2','2026-10-31','退出');
  for(let i=0;i<4;i++)m.advanceCase(s,'admin',exit.id);
  assert.equal(m.account(s,'a3').status,'已歸還');
  assert.equal(m.account(s,'a4').status,'已歸還');
  assert.equal(m.store(s,'s3').status,'已關閉');
  assert.equal(m.store(s,'s4').status,'已關閉');
});

test('merchant cancellation requires handover and removes active login',()=>{
  const s=fresh();
  assert.throws(()=>m.setMerchantStatus(s,'ops','mB','已取消合作','結束'),/先完成交接/);
  const h=m.requestHandover(s,'ops','s2','mD','2026-10-25','交接');
  for(const req of h.requirements)m.addDocument(s,'ops',{storeId:'s2',caseId:h.id,requirementKey:req.key,name:req.label,type:req.label});
  for(let i=0;i<4;i++)m.advanceCase(s,'ops',h.id);
  const h2=m.requestHandover(s,'ops','s1','mD','2026-10-26','交接');
  for(const req of h2.requirements)m.addDocument(s,'ops',{storeId:'s1',caseId:h2.id,requirementKey:req.key,name:req.label,type:req.label});
  for(let i=0;i<4;i++)m.advanceCase(s,'ops',h2.id);
  m.setMerchantStatus(s,'ops','mB','已取消合作','結束合作');
  assert.equal(s.users.find(u=>u.id==='merchant').status,'停用');
  assert.equal(m.visibleStores(s,'merchant').length,0);
  assert.throws(()=>m.createStore(s,'admin',{accountId:'a1',merchantId:'mB',name:'新店',code:'NEW',startDate:'2026-10-27'}),/合作中/);
});

test('admin credentials, two step delete and immutable history are enforced',()=>{
  const s=fresh();
  assert.throws(()=>m.adminDelete(s,'admin','person','p1','測試','hash'),/二次密碼/);
  m.setDeletionPassword(s,'admin','hash-1');
  assert.throws(()=>m.setDeletionPassword(s,'admin','hash-2','wrong'),/原二次密碼/);
  assert.throws(()=>m.adminDelete(s,'ops','document','d1','測試','hash-1'),/管理員/);
  assert.throws(()=>m.adminDelete(s,'admin','audit','au1','測試','hash-1'),/歷史紀錄/);
  assert.throws(()=>m.adminDelete(s,'admin','case','ch0','測試','hash-1'),/歷史結案/);
  assert.throws(()=>m.adminDelete(s,'admin','store','s1','測試','hash-1'),/仍有/);
  const owner=m.createPerson(s,'admin',{kind:'owner',name:'待刪測試'});
  const historyLength=s.records.length;
  m.adminDelete(s,'admin','person',owner.id,'資料重複','hash-1');
  assert.ok(!m.visiblePeople(s,'admin').some(p=>p.id===owner.id));
  assert.ok(s.audit.some(x=>x.entityId===owner.id&&x.action.includes('刪除')));
  assert.equal(s.records.length,historyLength);
  const t=m.createTask(s,'ops',{storeId:'s1',title:'測試任務',criteria:'結束',assignee:'ops'});
  assert.throws(()=>m.deleteTask(s,'admin',t.id,'重複'),/二次密碼/);
  m.deleteTask(s,'admin',t.id,'重複','hash-1');
  assert.ok(s.audit.some(x=>x.entityId===t.id&&x.action==='刪除任務'));
});

test('admin can change roles and reset passwords without losing the last admin',()=>{
  const s=fresh();
  m.updateLogin(s,'admin','marketing',{name:'行銷主管',kind:'marketing',personId:''},'職務調整');
  m.resetLoginPassword(s,'admin','marketing','new-hash','本人申請');
  assert.equal(s.users.find(x=>x.id==='marketing').passwordHash,'new-hash');
  assert.throws(()=>m.updateLogin(s,'admin','admin',{name:'主管',kind:'finance'},'測試'),/目前帳號/);
  assert.throws(()=>m.setLoginStatus(s,'admin','admin','停用','測試'),/目前使用/);
  assert.equal(m.roleOf('marketing').kind,'marketing');
});

test('assignment scope and closed case documents preserve their history',()=>{
  const s=fresh();
  assert.throws(()=>m.createTask(s,'ops',{storeId:'s1',title:'錯誤派工',criteria:'處理',assignee:'owner2'}),/無法查看/);
  assert.throws(()=>m.addDocument(s,'admin',{storeId:'s2',caseId:'cv1',requirementKey:'logistics',name:'錯誤',type:'物流佐證'}),/不符/);
  assert.throws(()=>m.updateDocumentVersion(s,'admin','d2','data:text/plain;base64,QQ==','新版'),/歷史佐證/);
  assert.equal(m.updateDocumentVersion(s,'admin','d5','data:text/plain;base64,QQ==','新版').version,2);
  assert.throws(()=>m.adminEdit(s,'admin','case','ch0','title','改寫歷史','測試'),/歷史結案/);
  m.adminEdit(s,'admin','person','p1','sensitive.occupation','工程師','已核實');
  assert.equal(m.person(s,'p1').sensitive.occupation,'工程師');
  m.adminEdit(s,'admin','entity','e2','name','ARGO 管理公司','登記名稱');
  assert.equal(s.settings.companyName,'ARGO 管理公司');
});

test('reconciliation tasks reject sales without breaking other task flows',()=>{
  const s=fresh();
  assert.throws(()=>m.createTask(s,'ops',{storeId:'s1',sourceType:'case',sourceId:'cr1',title:'核對帳單',criteria:'確認差額',assignee:'sales'}),/對帳案件任務不可指派業務/);
  assert.throws(()=>m.createTask(s,'sales',{storeId:'s1',sourceType:'case',sourceId:'cr1',title:'核對帳單',criteria:'確認差額',assignee:'finance'}),/無權查看/);
  const financeTask=m.createTask(s,'ops',{storeId:'s1',sourceType:'case',sourceId:'cr1',title:'核對帳單',criteria:'確認差額',assignee:'finance'});
  assert.ok(m.visibleTasks(s,'finance').some(x=>x.id===financeTask.id));
  const salesTask=m.createTask(s,'ops',{storeId:'s1',sourceType:'case',sourceId:'cv1',title:'追蹤補件',criteria:'確認物流佐證',assignee:'sales'});
  assert.ok(m.visibleTasks(s,'sales').some(x=>x.id===salesTask.id));
  const oldTask={...financeTask,id:'legacy-reconciliation-sales',assignee:'sales'};
  s.tasks.push(oldTask);
  assert.ok(!m.visibleTasks(s,'sales').some(x=>x.id===oldTask.id));
  assert.ok(m.visibleTasks(s,'ops').some(x=>x.id===oldTask.id));
});

test('sales manages only assigned owners and only operations can reassign them',()=>{
  const s=fresh();
  assert.equal(m.visiblePeople(s,'sales').filter(x=>x.kind==='owner').length,3);
  assert.throws(()=>m.assignSales(s,'sales','p1','sales','自行指派'),/僅管理方/);
  m.assignSales(s,'ops','p2',null,'暫時未指派');
  assert.equal(m.person(s,'p2').salesId,null);
  assert.ok(!m.visiblePeople(s,'sales').some(x=>x.id==='p2'));
  assert.ok(!m.visibleStores(s,'sales').some(x=>m.account(s,x.accountId)?.ownerId==='p2'));
  m.createPlatformAccount(s,'sales',{ownerId:'p1',platform:'Shopee',code:'SHP-WANG-009',status:'正常',note:''});
  assert.throws(()=>m.createPlatformAccount(s,'sales',{ownerId:'p2',platform:'Shopee',code:'SHP-LIN-009',status:'正常',note:''}),/不能管理這位號主/);
  assert.equal(m.visibleSettlements(s,'sales').length,0);
});

test('sales keeps store sales access while finance documents and expense actions stay outside its scope',()=>{
  const s=fresh();
  assert.equal(m.visibleStores(s,'sales').find(st=>st.id==='s1')?.sales,1420000);
  const bill=m.addDocument(s,'ops',{storeId:'s1',name:'十月平台帳單.pdf',type:'平台帳單'});
  const receipt=m.addDocument(s,'finance',{storeId:'s1',name:'付款紀錄.pdf',type:'營運文件'});
  const payment=m.addDocument(s,'ops',{storeId:'s1',caseId:'cv1',requirementKey:'payment',name:'付款證明.pdf',type:'一般佐證'});
  const logistics=m.addDocument(s,'ops',{storeId:'s1',caseId:'cv1',requirementKey:'logistics',name:'物流佐證.pdf',type:'物流佐證'});
  for(const d of [bill,receipt,payment]){
    assert.ok(!m.visibleDocuments(s,'sales').some(x=>x.id===d.id));
    assert.throws(()=>m.updateDocumentVersion(s,'sales',d.id,null,'改版'),/業務不更新/);
  }
  assert.ok(m.visibleDocuments(s,'sales').some(x=>x.id===logistics.id));
  assert.throws(()=>m.addDocument(s,'sales',{storeId:'s1',name:'帳單',type:'平台帳單'}),/業務不上傳店舖文件/);
  assert.throws(()=>m.addDocument(s,'sales',{storeId:'s1',caseId:'cv1',requirementKey:'payment',name:'付款',type:'一般佐證'}),/業務不上傳店舖文件/);
  const task=m.createTask(s,'ops',{storeId:'s1',sourceType:'case',sourceId:'cv1',title:'物流追蹤',criteria:'補物流資料',assignee:'sales'});
  assert.throws(()=>m.addTaskEvidence(s,'sales',task.id,{name:'收據',type:'收據'}),/業務不上傳店舖文件或任務佐證/);
  assert.throws(()=>m.addTaskEvidence(s,'sales',task.id,{name:'物流資料',type:'物流佐證'}),/業務不上傳店舖文件或任務佐證/);
  assert.throws(()=>m.requestExpense(s,'sales',task.id,1000,'代墊運費','none'),/任務費用由營運申請/);
});

test('merchants key in movements for their stores and sales develops only owners',()=>{
  const s=fresh();
  m.addMovement(s,'merchant',{storeId:'s1',type:'出貨',qty:10,route:'台北主倉 → 平台',source:'OUT-KEYIN'});
  assert.ok(s.movements.some(x=>x.source==='OUT-KEYIN'));
  assert.throws(()=>m.addMovement(s,'merchant',{storeId:'s3',type:'出貨',qty:1,route:'x'}),/責任範圍/);
  assert.throws(()=>m.addMovement(s,'sales',{storeId:'s1',type:'入庫',qty:1,route:'x'}),/只有管理方或店主/);
  const owner=m.createPerson(s,'sales',{kind:'owner',name:'新開發號主',phone:'',city:'',email:'',notes:''});
  assert.equal(owner.salesId,'sales');
  assert.throws(()=>m.createPerson(s,'sales',{kind:'merchant',name:'新店主'}),/只能新增號主/);
  assert.throws(()=>m.createPerson(s,'merchant',{kind:'owner',name:'x'}),/只能新增號主/);
});
