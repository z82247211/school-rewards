const students={
  ali:{name:'علی رضایی',points:120},
  sara:{name:'سارا محمدی',points:250},
  reza:{name:'رضا احمدی',points:80}
};
const rewards=[
  {id:1,name:'دفتر فانتزی',cost:50,emoji:'📒'},
  {id:2,name:'جامدادی رنگی',cost:80,emoji:'🖍️'},
  {id:3,name:'خودکار چندرنگ',cost:100,emoji:'🖊️'},
  {id:4,name:'آبرنگ 16 رنگ',cost:150,emoji:'🎨'},
  {id:5,name:'ماژیک رنگی',cost:200,emoji:'🖌️'},
  {id:6,name:'ست لوازم تحریر',cost:250,emoji:'🎁'}
];
let currentUser=null;
const $=id=>document.getElementById(id);
function login(){
  const key=$('username').value.trim().toLowerCase();
  if(!students[key]){$('loginMessage').textContent='نام کاربری پیدا نشد. برای آزمایش از ali، sara یا reza استفاده کنید.';return;}
  currentUser=key;$('loginSection').classList.add('hidden');$('studentPanel').classList.remove('hidden');render();
}
function render(){
  const s=students[currentUser];$('studentName').textContent=s.name;$('studentPoints').textContent=`${s.points} امتیاز`;
  const grid=$('rewardsGrid');grid.innerHTML='';
  rewards.forEach(r=>{const can=s.points>=r.cost;const card=document.createElement('article');card.className='reward';card.innerHTML=`<div class="emoji">${r.emoji}</div><h3>${r.name}</h3><div class="price">${r.cost} امتیاز</div><button ${can?'':'disabled'}>${can?'دریافت جایزه':'امتیاز کافی نیست'}</button>`;card.querySelector('button').onclick=()=>requestReward(r.id);grid.appendChild(card)});
  renderRequests();
}
function requestReward(id){
  const r=rewards.find(x=>x.id===id);const s=students[currentUser];
  if(s.points<r.cost)return;
  s.points-=r.cost;
  const requests=JSON.parse(localStorage.getItem('rewardRequests')||'[]');
  requests.push({student:s.name,reward:r.name,cost:r.cost,status:'در انتظار بررسی'});
  localStorage.setItem('rewardRequests',JSON.stringify(requests));render();
}
function renderRequests(){
  const list=$('requestsList');const all=JSON.parse(localStorage.getItem('rewardRequests')||'[]').filter(x=>x.student===students[currentUser].name);list.innerHTML='';
  if(!all.length){list.innerHTML='<p class="empty">هنوز درخواستی ثبت نکرده‌اید.</p>';return}
  all.forEach(x=>{const el=document.createElement('div');el.className='request';el.innerHTML=`<span>${x.reward} — ${x.cost} امتیاز</span><span class="status">${x.status}</span>`;list.appendChild(el)});
}
function logout(){currentUser=null;$('studentPanel').classList.add('hidden');$('loginSection').classList.remove('hidden');$('username').value='';$('loginMessage').textContent=''}
$('loginBtn').onclick=login;$('logoutBtn').onclick=logout;$('username').addEventListener('keydown',e=>{if(e.key==='Enter')login()});