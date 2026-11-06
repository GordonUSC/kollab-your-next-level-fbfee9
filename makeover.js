/* v10 makeover helpers (Darby): legibility floor + living island. No network, no storage. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Legibility floor: on phones, no visible text below 14px (Gordon: "the fonts are TINY").
 function floor(){if(innerWidth>760)return;for(const e of document.querySelectorAll('body *')){if(!e.offsetParent)continue;const own=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1);if(!own)continue;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<14){e.style.fontSize='14px';if(getComputedStyle(e).letterSpacing!=='normal')e.style.letterSpacing='.04em'}}}
 // Living island: Higgsfield loop under the still, only before a world is chosen.
 function island(){if(reduce)return;const sc=document.querySelector('.world-scene');if(!sc||sc.querySelector('.v10-island'))return;const v=document.createElement('video');v.className='v10-island';v.src='assets/island-alive-web.mp4';v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');v.autoplay=true;v.setAttribute('aria-hidden','true');const img=sc.querySelector('#world-base-art');if(img&&img.nextSibling)sc.insertBefore(v,img.nextSibling);else sc.appendChild(v);v.play().catch(()=>{})}
 // Cause and effect: the chosen ACTION visibly changes the world art (Higgsfield before/after pairs).
 const ACT={calm:['act-calm-0','act-calm-1'],curious:['act-curious-0','act-curious-1'],together:['act-together-0','act-together-1']};
 document.addEventListener('click',e=>{const b=e.target.closest('[data-arrival-choice]');if(!b)return;const w=document.getElementById('arrival-world');const mood=w&&w.dataset.mood;const list=ACT[mood];if(!list)return;const i=Number(b.dataset.arrivalChoice);
   setTimeout(()=>{const img=document.querySelector('.world-art-selected');if(!img)return;const next=new Image();next.onload=()=>{img.style.transition=reduce?'none':'opacity .25s';img.style.opacity='.15';setTimeout(()=>{img.src=next.src;img.style.opacity='1';w.classList.remove('v9-pulse');void w.offsetWidth;w.classList.add('v9-pulse')},reduce?0:250)};next.src='assets/'+list[i]+'.webp';setTimeout(()=>{const win=document.querySelector('#arrival-console .v9-win');if(win&&!win.querySelector('.v10-thumb')){const th=document.createElement('img');th.className='v10-thumb';th.src='assets/'+list[i]+'.webp';th.alt='Your world, changed by your choice';win.appendChild(th)}},120)},60)},true);
 addEventListener('DOMContentLoaded',()=>{island();floor()});
 new MutationObserver(()=>{clearTimeout(floor.t);floor.t=setTimeout(floor,60)}).observe(document.documentElement,{subtree:true,childList:true});
 addEventListener('resize',()=>{clearTimeout(floor.t);floor.t=setTimeout(floor,120)});
})();
