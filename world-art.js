/* Static scene artwork: request one selected image, never prefetch the other worlds. */
const sceneArt=(()=>{
  const world=document.getElementById('arrival-world');
  const scene=world.querySelector('.world-scene');
  const base=document.getElementById('world-base-art');
  const sources={
    calm:{file:'assets/world-grove.webp',alt:'The Quiet Grove: teal trees, still pools and curved bridges surround a glowing doorway on floating garden islands.'},
    curious:{file:'assets/world-trail.webp',alt:'The Lantern Trail: golden footprints and lanterns connect a map, a telescope and a treasure chest around a glowing doorway.'},
    together:{file:'assets/world-garden.webp',alt:'The Common Ground: flower beds, welcome signs, a picnic table and bridges gather around an open garden doorway.'}
  };
  let request=0;
  const reduced=()=>document.body.classList.contains('reduced-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clearLayers(){
    scene.querySelectorAll('.world-art-selected').forEach(image=>image.remove());
    base.style.removeProperty('opacity');
    base.removeAttribute('aria-hidden');
    delete world.dataset.artMood;
    world.style.removeProperty('--selected-world-art');
  }
  function reset(){request++;clearLayers();world.dataset.artState='starter';}
  function select(mood){
    const source=sources[mood];if(!source)return;
    const current=++request;clearLayers();world.dataset.artState='loading';
    const image=new Image(1344,752);
    image.className='world-illustration world-art-selected';
    image.alt=source.alt;
    image.decoding='async';
    image.onload=()=>{
      if(current!==request)return;
      scene.insertBefore(image,scene.querySelector('.world-overlay'));
      const reveal=()=>{
        if(current!==request){image.remove();return;}
        image.classList.add('world-art-visible');
        base.style.opacity='0';
        base.setAttribute('aria-hidden','true');
        world.dataset.artState='ready';
        world.dataset.artMood=mood;
        world.style.setProperty('--selected-world-art',`url("${source.file}")`);
      };
      if(reduced())reveal();
      else {void image.offsetWidth;requestAnimationFrame(reveal);}
    };
    image.onerror=()=>{
      if(current!==request)return;
      clearLayers();world.dataset.artState='fallback';
      // The existing starter illustration and all creative actions remain usable.
    };
    image.src=source.file;
  }
  return {select,reset};
})();

window.kollabSceneArt=sceneArt;
