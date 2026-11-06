/* Student feedback (Darby, 11/6). Anonymous: no names, no accounts. Posts to Darby's inbox via FormSubmit so Gordon's team can improve the experience. */
(()=>{
 const ENDPOINT='https://formsubmit.co/ajax/gbellamyai@gmail.com';
 const css=`.fb-btn{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:60;background:#c8ff3d;color:#141022;border:3px solid #141022;border-radius:99px;padding:12px 18px;font:800 16px/1 "Bricolage Grotesque",system-ui,sans-serif;box-shadow:0 5px 0 #141022;cursor:pointer}
.fb-panel{position:fixed;inset:auto max(12px,env(safe-area-inset-right,0px)) max(12px,env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px));z-index:61;max-width:440px;margin-left:auto;background:#1d1731;color:#fff8ec;border:2px solid #3a3158;border-radius:20px;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,.6);font:17px/1.45 "Atkinson Hyperlegible",system-ui,sans-serif;max-height:85vh;overflow:auto}
.fb-panel h3{font:800 22px/1.1 "Bricolage Grotesque",system-ui,sans-serif;margin:0 0 6px}
.fb-panel p{margin:0 0 10px;font-size:15px;color:#cfc6e6}
.fb-faces{display:flex;gap:8px;margin:0 0 12px}
.fb-faces button{flex:1;font-size:28px;padding:8px 0;border-radius:12px;border:2px solid #3a3158;background:#271f40;cursor:pointer}
.fb-faces button[aria-pressed="true"]{border-color:#c8ff3d;background:#3b4a12}
.fb-panel label{display:block;font-weight:700;font-size:15px;margin:8px 0 4px}
.fb-panel textarea{width:100%;font:16px/1.4 "Atkinson Hyperlegible",system-ui,sans-serif;border-radius:12px;border:2px solid #3a3158;background:#0d0a18;color:#fff8ec;padding:10px}
.fb-row{display:flex;gap:10px;margin-top:12px}
.fb-send{flex:1;background:#c8ff3d;color:#141022;border:3px solid #141022;border-radius:14px;padding:12px;font:800 17px "Bricolage Grotesque",system-ui,sans-serif;cursor:pointer}
.fb-close{background:transparent;color:#62d4ff;border:0;text-decoration:underline;font-size:16px;cursor:pointer}
.fb-msg{min-height:1.4em;margin-top:8px;font-weight:700}
.fb-inline{margin:12px 0;padding:12px;border-radius:14px;border:2px dashed #c8ff3d;text-align:center}
.fb-inline button{margin-top:8px}
body.arrival-playing .fb-btn{bottom:max(14px,env(safe-area-inset-bottom,0px))}`;
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const btn=document.createElement('button');btn.className='fb-btn';btn.type='button';btn.textContent='💬 Feedback';document.body.appendChild(btn);
 let panel=null,rating='';
 function where(){const w=document.getElementById('arrival-world');const s=document.querySelector('.v9-steps b');return [s?s.textContent:'home',w?('world:'+(w.dataset.mood||'-')+' choice:'+(w.dataset.choice||'-')):''].join(' · ')}
 function open(){if(panel){panel.hidden=false;return}
  panel=document.createElement('div');panel.className='fb-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Send feedback');
  panel.innerHTML=`<h3>Help us make this better</h3><p>Anonymous. Please don't type your name or any personal info.</p>
   <div class="fb-faces" role="group" aria-label="How was it?">${['😕','😐','🙂','😀','🤩'].map((f,i)=>`<button type="button" data-r="${i+1}" aria-pressed="false" aria-label="${['Confusing','Meh','Okay','Good','Amazing'][i]}">${f}</button>`).join('')}</div>
   <label for="fb-confusing">What was confusing?</label><textarea id="fb-confusing" rows="2" maxlength="400"></textarea>
   <label for="fb-fun">What was the most fun?</label><textarea id="fb-fun" rows="2" maxlength="400"></textarea>
   <label for="fb-idea">One idea to make it better</label><textarea id="fb-idea" rows="2" maxlength="400"></textarea>
   <div class="fb-row"><button type="button" class="fb-send">Send feedback</button><button type="button" class="fb-close">Close</button></div><div class="fb-msg" role="status" aria-live="polite"></div>`;
  document.body.appendChild(panel);
  panel.querySelectorAll('.fb-faces button').forEach(b=>b.addEventListener('click',()=>{rating=b.dataset.r;panel.querySelectorAll('.fb-faces button').forEach(x=>x.setAttribute('aria-pressed',x===b))}));
  panel.querySelector('.fb-close').addEventListener('click',()=>{panel.hidden=true;btn.focus()});
  panel.querySelector('.fb-send').addEventListener('click',send);
  panel.querySelector('textarea').focus()}
 async function send(){const msg=panel.querySelector('.fb-msg'),c=panel.querySelector('#fb-confusing').value.trim(),f=panel.querySelector('#fb-fun').value.trim(),i=panel.querySelector('#fb-idea').value.trim();
  if(!rating&&!c&&!f&&!i){msg.textContent='Pick a face or write one thing first.';return}
  const b=panel.querySelector('.fb-send');b.disabled=true;msg.textContent='Sending…';
  try{const ctl=new AbortController();const tm=setTimeout(()=>ctl.abort(),12000);const r=await fetch(ENDPOINT,{signal:ctl.signal,method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({_subject:'Kollab Next Level feedback',_template:'table',_captcha:'false',rating:rating||'-',confusing:c||'-',most_fun:f||'-',idea:i||'-',where:where(),version:(document.querySelector('meta[name=kollab-version]')||{}).content||'',sent:new Date().toISOString()})});
   if(!r.ok)throw new Error(r.status);msg.textContent='Thank you! A real person reads every note. ✦';panel.querySelectorAll('textarea').forEach(t=>t.value='');rating='';panel.querySelectorAll('.fb-faces button').forEach(x=>x.setAttribute('aria-pressed','false'));setTimeout(()=>{panel.hidden=true},1800)}
  catch(e){const txt=['Rating: '+(rating||'-'),'Confusing: '+(c||'-'),'Most fun: '+(f||'-'),'Idea: '+(i||'-'),'Where: '+where()].join('\n');msg.innerHTML='Couldn’t send right now. Tap <b>Copy</b> and give it to Kollab staff, or try again later. Thank you!';let cp=panel.querySelector('.fb-copy');if(!cp){cp=document.createElement('button');cp.type='button';cp.className='fb-send fb-copy';cp.textContent='Copy my feedback';msg.after(cp);cp.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(cp.dataset.t);cp.textContent='Copied ✓'}catch(_){const ta=document.createElement('textarea');ta.value=cp.dataset.t;panel.appendChild(ta);ta.select();try{document.execCommand('copy');cp.textContent='Copied ✓'}catch(__){}ta.remove()}})}cp.dataset.t=txt}finally{b.disabled=false}}
 btn.addEventListener('click',open);
 // invite feedback at the end of the run
 new MutationObserver(()=>{const ba=document.getElementById('v10-why');if(ba&&!document.getElementById('fb-inline')){const d=document.createElement('div');d.id='fb-inline';d.className='fb-inline';d.innerHTML='<b>First time trying this? Your feedback shapes the next version.</b><br><button type="button" class="fb-send" style="width:auto;padding:10px 18px">💬 Tell us how it went</button>';ba.insertAdjacentElement('afterend',d);d.querySelector('button').addEventListener('click',open)}}).observe(document.documentElement,{subtree:true,childList:true});
})();
