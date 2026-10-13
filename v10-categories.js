'use strict';
{
 const accordion=document.querySelector('.shutter-accordion');
 if(accordion){
  const panels=[...accordion.querySelectorAll('.shutter')];
  const open=panel=>panels.forEach(item=>{const active=item===panel;item.classList.toggle('is-open',active);item.querySelector('.shutter-trigger').setAttribute('aria-expanded',String(active));item.querySelector('.shutter-visual').setAttribute('aria-hidden',String(!active));item.querySelector('.shutter-detail').setAttribute('aria-hidden',String(!active));});
  panels.forEach(panel=>{
   panel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')open(panel);});
   panel.querySelector('.shutter-trigger').addEventListener('click',()=>open(panel));
   panel.addEventListener('focusin',()=>open(panel));
  });
  accordion.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   const current=panels.findIndex(panel=>panel.contains(document.activeElement));if(current<0)return;
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?panels.length-1:(current+(event.key==='ArrowRight'?1:-1)+panels.length)%panels.length;
   panels[next].querySelector('.shutter-trigger').focus();
  });
 }
}
