'use strict';
const data=JSON.parse(document.getElementById('v8-data').textContent);
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let noMotion=reduce.matches;
try{noMotion ||= localStorage.getItem('idodom-motion')==='off';}catch{}
const movie=q('#hero-video'),playButton=q('#video-toggle');
function setMotion(disabled){noMotion=disabled;document.body.classList.toggle('no-motion',disabled);q('#motion-toggle').textContent=disabled?'Включить движение':'Отключить движение';q('#motion-toggle').setAttribute('aria-pressed',String(disabled));if(disabled)movie.pause();else movie.play().catch(()=>{});}
setMotion(noMotion);
movie.addEventListener('play',()=>{playButton.textContent='Пауза';playButton.setAttribute('aria-pressed','false');});
movie.addEventListener('pause',()=>{playButton.textContent='Воспроизвести';playButton.setAttribute('aria-pressed','true');});
movie.addEventListener('error',()=>{movie.hidden=true;playButton.hidden=true;});
movie.querySelector('source').addEventListener('error',()=>{movie.hidden=true;playButton.hidden=true;});
playButton.addEventListener('click',()=>{if(movie.paused)movie.play().catch(()=>{movie.hidden=true;playButton.hidden=true;});else movie.pause();});
q('#motion-toggle').addEventListener('click',()=>{setMotion(!noMotion);try{localStorage.setItem('idodom-motion',noMotion?'off':'on');}catch{}});
reduce.addEventListener('change',e=>setMotion(e.matches));
document.addEventListener('visibilitychange',()=>{if(document.hidden)movie.pause();});
const menu=q('#mobile-menu'),menuToggle=q('.menu-toggle');
function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');}
menuToggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuToggle.setAttribute('aria-expanded',String(!menu.hidden));});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();q('.version-picker').open=false;}});
const mediaTimers=new WeakMap();
function switchImage(image,src,alt){if(image.getAttribute('src')===src){image.alt=alt;return;}clearTimeout(mediaTimers.get(image));const load=()=>{image.classList.remove('changing');image.removeEventListener('load',load);};image.classList.add('changing');const change=()=>{image.addEventListener('load',load);image.alt=alt;image.src=src;setTimeout(load,1000);};if(noMotion)change();else mediaTimers.set(image,setTimeout(change,120));}
function chooseCategory(key){const x=data.categories.find(x=>x.key===key);if(!x)return;qa('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===key)));if(q('#category-image'))switchImage(q('#category-image'),x.src,x.title);q('#category-title').textContent=x.title;q('#category-description').textContent=x.desc;q('#category-link').href='collection.html?category='+key+'&concept='+data.catalogConcept;}
qa('[data-category]').forEach(b=>{for(const event of ['click','pointerenter','focus'])b.addEventListener(event,()=>chooseCategory(b.dataset.category));});
q('.category-rails')?.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;const bs=qa('[data-category]'),n=bs.indexOf(document.activeElement);if(n<0)return;e.preventDefault();let next=e.key==='Home'?0:e.key==='End'?bs.length-1:(n+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+bs.length)%bs.length;bs[next].focus();bs[next].scrollIntoView({block:'nearest',inline:'nearest'});});
let sceneState=0,manualScene=false;
const scenes=[{src:data.assets.woman,title:'В центре<br>вашей жизни.',copy:'Общий план, масштаб комнаты и место человека в интерьере.',caption:'Постановочная AI-сцена'},{src:data.assets.table,title:'Предмет.<br>Его характер.',copy:'Светлая столешница и скульптурное основание стола «Бронкс».',caption:'Бронкс / оригинальная фотография'},{src:data.assets.detail,title:'Ближе<br>к форме.',copy:'Рассмотрите линии основания. Нажмите плюс для увеличения.',caption:'Бронкс / деталь основания'}];
function setScene(n){if(n===sceneState)return;sceneState=n;const s=scenes[n];q('.scene-picture').dataset.sceneState=String(n);switchImage(q('#scene-image'),s.src,n===0?'Женщина в полный рост рядом со столом IDODOM':s.caption);q('#scene-title').innerHTML=s.title;q('#scene-copy').textContent=s.copy;q('#scene-caption').textContent=s.caption;qa('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.scene)===n)));}
qa('[data-scene]').forEach(b=>b.addEventListener('click',()=>{manualScene=true;setScene(Number(b.dataset.scene));}));
let scheduled=false,lastProgress=0;
function updateScroll(){scheduled=false;if(noMotion||innerWidth<=760)return;const s=q('.scroll-scene'),r=s.getBoundingClientRect(),distance=s.offsetHeight-q('.scene-shell').offsetHeight;const progress=Math.max(0,Math.min(1,(68-r.top)/Math.max(1,distance)));q('.scene-picture').style.setProperty('--scene-progress',(progress*100)+'%');if(Math.abs(progress-lastProgress)>.06)manualScene=false;if(!manualScene)setScene(Math.min(2,Math.floor(progress*3)));lastProgress=progress;}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
qa('[data-view]').forEach(b=>b.addEventListener('click',()=>{qa('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));switchImage(q('#detail-image'),b.dataset.view,b.dataset.title);q('#detail-caption').textContent=b.dataset.title;q('.detail-image').dataset.zoom=b.dataset.view;q('.detail-image').dataset.title=b.dataset.title;}));
const dialog=q('#zoom-dialog');let opener=null;
qa('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{if(typeof dialog.showModal!=='function'){window.open(b.dataset.zoom,'_blank','noopener');return;}opener=b;q('#zoom-title').textContent=b.dataset.title;q('#zoom-image').alt=b.dataset.title;q('#zoom-image').src=b.dataset.zoom;q('#zoom-original').href=b.dataset.zoom;q('#zoom-error').hidden=true;dialog.showModal();document.body.style.overflow='hidden';}));
q('#zoom-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow='';q('#zoom-image').removeAttribute('src');opener?.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
q('#zoom-image').addEventListener('error',()=>{if(q('#zoom-image').getAttribute('src'))q('#zoom-error').hidden=false;});
