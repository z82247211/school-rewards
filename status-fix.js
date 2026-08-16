(function(){
  const API='https://ubjsvqhxoufdjwzqkmsd.supabase.co/functions/v1/school-api';
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  async function studentRequests(){
    const list=document.getElementById('requestsList'); if(!list)return;
    const t=sessionStorage.getItem('schoolToken'); if(!t)return;
    try{
      const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify({action:'requests'})});
      const d=await r.json(); if(!r.ok)throw Error(d.error||'خطا');
      const rows=d.requests||[];
      if(!rows.length){list.innerHTML='<p class="empty">هنوز درخواستی ثبت نکرده‌اید.</p>';return;}
      const labels={pending:['⏳','در انتظار تأیید','pending'],approved:['✅','تأیید شد — آماده تحویل','approved'],rejected:['❌','رد شد','rejected'],delivered:['🎁','تحویل شد','delivered']};
      list.innerHTML=rows.map(x=>{const z=labels[x.status]||['📌',x.status,x.status];return '<div class="request reward-request '+z[2]+'"><div><strong>'+esc(x.rewards?.name||'جایزه')+'</strong><div class="muted">⭐ '+esc(x.rewards?.points_required??'')+' امتیاز</div></div><span class="status '+z[2]+'">'+z[0]+' '+z[1]+'</span></div>';}).join('');
    }catch(e){list.innerHTML='<p class="empty">'+esc(e.message)+'</p>';}
  }
  window.requests=studentRequests;
  window.setRequestStatus=async function(id,status){
    const t=sessionStorage.getItem('adminToken');
    try{
      const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify({action:'admin_request_status',request_id:Number(id),status})});
      const d=await r.json(); if(!r.ok)throw Error(d.error||'خطا');
      if(typeof window.loadRequestsAdmin==='function')await window.loadRequestsAdmin();
      if(typeof window.loadReports==='function')await window.loadReports();
      alert(status==='approved'?'جایزه تأیید شد و وضعیت آن برای دانش‌آموز نمایش داده می‌شود.':'وضعیت درخواست تغییر کرد.');
    }catch(e){alert(e.message);}
  };
  function refresh(){if(!document.getElementById('studentPanel')?.classList.contains('hidden'))studentRequests();}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  setTimeout(refresh,800);
  setInterval(refresh,15000);
})();