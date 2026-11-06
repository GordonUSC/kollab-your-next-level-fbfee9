/* One user-triggered flourish. No initial request, loop, sound or required wait. */
(()=>{
  const scene=document.querySelector('.world-scene');
  const movie=document.getElementById('arrival-movie');
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let active=false,played=false,inView=true,run=0;
  const allowed=()=>!document.body.classList.contains('reduced-motion')&&!preference.matches&&!navigator.connection?.saveData;
  function stop(){
    run++;active=false;movie.pause();movie.classList.remove('is-playing');
    if(movie.hasAttribute('src')){movie.removeAttribute('src');movie.load();}
  }
  function resume(){
    if(!active||!inView||document.hidden||!allowed())return;
    const current=run;
    const result=movie.play();
    if(result?.catch)result.catch(()=>{if(current===run)stop();});
  }
  function play(){
    if(played||!allowed())return;
    played=true;active=true;run++;movie.muted=true;
    movie.src='assets/island-alive-web.mp4';resume();
  }
  movie.addEventListener('playing',()=>{if(active&&allowed())movie.classList.add('is-playing');else stop();});
  movie.addEventListener('ended',stop);
  movie.addEventListener('error',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)movie.pause();else resume();});
  new MutationObserver(()=>{if(!allowed())stop();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  preference.addEventListener('change',()=>{if(!allowed())stop();});
  navigator.connection?.addEventListener?.('change',()=>{if(!allowed())stop();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;
    if(!inView)movie.pause();else resume();
  },{threshold:.05}).observe(scene);
  window.kollabArrivalMovie={play,stop};
})();
