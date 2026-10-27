import test from 'node:test';
import assert from 'node:assert/strict';
import {SEED,ROLE_KEY,STORAGE_KEY,TOUR_KEY} from '../dist/model.mjs';

const pages=['index','people','accounts','stores','cases','tasks','docs','finance','operations','history','settings','admin'];
const roles=['admin','ops','marketing','finance','sales','owner1','merchant'];

function loadUI(role,page,id='',fixture=SEED,tourSeen=true,legacyV1=null){
  const values=new Map([[ROLE_KEY,role],[STORAGE_KEY,JSON.stringify(fixture)]]);
  if(legacyV1)values.set('argo-commerce-os-demo-v1',JSON.stringify(legacyV1));
  if(tourSeen)values.set(TOUR_KEY+':'+role,'seen');
  globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};
  globalThis.location={pathname:'/'+page+'.html',search:id?'?id='+id:'',href:''};
  const roots={app:{innerHTML:''},'modal-root':{innerHTML:''},'toast-root':{innerHTML:''}};
  globalThis.document={getElementById:k=>roots[k],querySelector:()=>null,addEventListener:()=>{},title:''};
  return import('../dist/app.mjs?ui='+role+'-'+page+'-'+id+'-'+Math.random()).then(()=>roots);
}

test('all twelve pages render for seven identities with scoped navigation',async()=>{
  for(const role of roles)for(const page of pages){
    const ui=await loadUI(role,page);
    assert.match(ui.app.innerHTML,/ARGO Commerce OS/,role+' '+page);
    if(role!=='admin'&&['settings','admin'].includes(page))assert.match(ui.app.innerHTML,/無權開啟/,role+' '+page);
    if(role==='admin'&&page==='admin')assert.match(ui.app.innerHTML,/DATA CONTROL/,role+' '+page);
    if(role==='marketing'&&['people','accounts','finance'].includes(page))assert.match(ui.app.innerHTML,/無權開啟/,role+' '+page);
    if(role==='sales'&&page==='finance')assert.match(ui.app.innerHTML,/無權開啟/,role+' '+page);
  }
});

test('sales sees and manages only the owners assigned to them',async()=>{
  const fixture=structuredClone(SEED);
  fixture.people.find(x=>x.id==='p2').salesId=null;
  const list=await loadUI('sales','people','',fixture);
  assert.match(list.app.innerHTML,/王大明/);
  assert.doesNotMatch(list.app.innerHTML,/林怡君/);
  const hidden=await loadUI('sales','people','p2',fixture);
  assert.match(hidden.app.innerHTML,/無權開啟/);
  const owned=await loadUI('sales','people','p1');
  assert.match(owned.app.innerHTML,/新增平台帳號/);
  assert.match(owned.app.innerHTML,/負責業務/);
  assert.doesNotMatch(owned.app.innerHTML,/指派業務/);
  const ops=await loadUI('ops','people','p1');
  assert.match(ops.app.innerHTML,/指派業務/);
});

test('merchant links and private document routes observe visibility rules',async()=>{
  const a=await loadUI('admin','stores','s1');
  assert.match(a.app.innerHTML,/people\.html\?id=mB/);
  const fixture=structuredClone(SEED);
  fixture.documents.push({id:'private-test',name:'身分證範例.png',type:'身分證',version:1,uploadedBy:'owner1',uploadedAt:'2026-10-15',source:'展示',refs:[{kind:'person',id:'p1'}],privacy:'owner_private',operational:false});
  const b=await loadUI('merchant','docs','private-test',fixture);
  assert.match(b.app.innerHTML,/無權開啟/);
  const c=await loadUI('owner1','docs','private-test',fixture);
  assert.doesNotMatch(c.app.innerHTML,/無權開啟/);
  const d=await loadUI('owner1','people','p1');
  assert.match(d.app.innerHTML,/號主名下公司／商號/);
  const e=await loadUI('admin','settings');
  assert.match(e.app.innerHTML,/二次刪除密碼/);
  assert.doesNotMatch(e.app.innerHTML,/可選電商平台|號主公司／商號|第一次使用導覽/);
  const canceled=structuredClone(SEED);
  canceled.people.find(x=>x.id==='mA').status='已取消合作';
  const f=await loadUI('admin','stores','s1',canceled);
  assert.doesNotMatch(f.app.innerHTML,/people\.html\?id=mA/);
  assert.match(f.app.innerHTML,/已取消合作/);
});

test('first visit tour uses each account and its permitted modules',async()=>{
  const admin=await loadUI('admin','index','',SEED,false);
  assert.match(admin['modal-root'].innerHTML,/首次使用導覽/);
  assert.match(admin['modal-root'].innerHTML,/登入權限與密碼管理/);
  const merchant=await loadUI('merchant','index','',SEED,false);
  assert.match(merchant['modal-root'].innerHTML,/首次使用導覽/);
  assert.match(merchant['modal-root'].innerHTML,/任務查看|執行、佐證與費用/);
  assert.doesNotMatch(merchant['modal-root'].innerHTML,/登入權限與密碼管理/);
});

test('sales cannot reach reconciliation cases, settlement amounts or finance documents',async()=>{
  const dashboard=await loadUI('sales','index');
  assert.doesNotMatch(dashboard.app.innerHTML,/68,000/);
  const reconciliation=await loadUI('sales','cases','cr1');
  assert.match(reconciliation.app.innerHTML,/無權開啟/);
  const finance=await loadUI('sales','docs','d4');
  assert.match(finance.app.innerHTML,/無權開啟/);
  const store=await loadUI('sales','stores','s1');
  assert.doesNotMatch(store.app.innerHTML,/RC-001/);
});

test('store creation and personal document upload are limited to their owners',async()=>{
  const salesAccount=await loadUI('sales','accounts','a1');
  assert.match(salesAccount.app.innerHTML,/編輯帳號/);
  assert.doesNotMatch(salesAccount.app.innerHTML,/在此帳號新增店舖/);
  const opsAccount=await loadUI('ops','accounts','a1');
  assert.match(opsAccount.app.innerHTML,/在此帳號新增店舖/);
  const salesOwner=await loadUI('sales','people','p1');
  assert.doesNotMatch(salesOwner.app.innerHTML,/上傳個人文件/);
  const ownerSelf=await loadUI('owner1','people','p1');
  assert.match(ownerSelf.app.innerHTML,/上傳個人文件/);
});

test('legacy v1 saves keep owners assigned to sales',async()=>{
  const legacy={...structuredClone(SEED),version:1,people:SEED.people.map(({salesId,...p})=>p)};
  const v1=await loadUI('sales','people','',null,true,legacy);
  assert.match(v1.app.innerHTML,/王大明/);
  assert.match(v1.app.innerHTML,/林怡君/);
});

test('sales screens retain sales figures without exposing finance history, task expenses or notifications',async()=>{
  const fixture=structuredClone(SEED);
  fixture.documents.push({id:'bill-extra',name:'十月平台帳單.pdf',type:'平台帳單',version:1,uploadedBy:'ops',refs:[{kind:'store',id:'s1'}],operational:true});
  fixture.records.unshift(
    {id:'finance-record',time:'2026-10-16',storeId:'s1',entityType:'settlement',entityId:'f1',title:'私有結算事項',detail:'NT$ 43,210',actor:'finance'},
    {id:'bill-record',time:'2026-10-16',storeId:'s1',entityType:'document',entityId:'bill-extra',title:'私有文件事項',detail:'十月平台帳單.pdf',actor:'ops'}
  );
  fixture.notifications.push({id:'old-sales-recon',title:'RC-001 對帳提醒',recipient:'sales',route:'cases.html?id=cr1',read:false});
  fixture.tasks.find(t=>t.id==='t1').assignee='sales';
  fixture.expenseRequests.push({id:'ex-extra',taskId:'t1',storeId:'s1',amount:43210,reason:'私有費用用途',documentId:'d1',requestedBy:'merchant',status:'待會計審核'});
  for(const [page,id] of [['index',''],['stores','s1'],['people','p1']]){
    const ui=await loadUI('sales',page,id,fixture);
    assert.doesNotMatch(ui.app.innerHTML,/私有結算事項|私有文件事項|NT\$ 43,210|十月平台帳單\.pdf/);
    if(page==='stores')assert.match(ui.app.innerHTML,/NT\$ 1,420,000/);
    if(page==='index')assert.match(ui.app.innerHTML,/近 30 日銷售/);
  }
  const task=await loadUI('sales','tasks','t1',fixture);
  assert.doesNotMatch(task.app.innerHTML,/私有費用用途|NT\$ 43,210|費用申請/);
  const docs=await loadUI('sales','docs','bill-extra',fixture);
  assert.match(docs.app.innerHTML,/無權開啟/);
  const unread=await loadUI('sales','accounts','a1',fixture);
  assert.doesNotMatch(unread.app.innerHTML,/dot-count/);
});

test('sales owner page includes a newly created account before its first Store',async()=>{
  const fixture=structuredClone(SEED);
  fixture.accounts.push({id:'new-account',code:'NEW-WANG-010',platform:'Shopee',ownerId:'p1',status:'正常',storeIds:[]});
  const owner=await loadUI('sales','people','p1',fixture);
  assert.match(owner.app.innerHTML,/NEW-WANG-010/);
});

test('sales verification case does not show a payment document or offer to upload it',async()=>{
  const fixture=structuredClone(SEED);
  fixture.documents.push({id:'payment-extra',name:'私有付款憑證.pdf',type:'一般佐證',version:1,uploadedBy:'ops',refs:[{kind:'store',id:'s1'},{kind:'case',id:'cv1'}],operational:true});
  fixture.cases.find(c=>c.id==='cv1').requirements.find(r=>r.key==='payment').docId='payment-extra';
  const detail=await loadUI('sales','cases','cv1',fixture);
  assert.doesNotMatch(detail.app.innerHTML,/私有付款憑證\.pdf/);
  assert.match(detail.app.innerHTML,/僅授權身分可查看/);
  assert.doesNotMatch(detail.app.innerHTML,/data-req="payment"/);
  const doc=await loadUI('sales','docs','payment-extra',fixture);
  assert.match(doc.app.innerHTML,/無權開啟/);
});
