import test from 'node:test';
import assert from 'node:assert/strict';
import {SEED,ROLE_KEY,STORAGE_KEY,TOUR_KEY} from '../dist/model.mjs';

const pages=['index','people','accounts','stores','cases','tasks','docs','finance','operations','history','settings','admin'];
const roles=['admin','ops','marketing','finance','sales','owner1','merchant'];

function loadUI(role,page,id='',fixture=SEED,tourSeen=true){
  const values=new Map([[ROLE_KEY,role],[STORAGE_KEY,JSON.stringify(fixture)]]);
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
