import { MONO_ARROW } from '../data/bitmap-image-model.js'

function setText(root, selector, text) { const node=root.querySelector(selector); if(node)node.textContent=text }
function setPressed(buttons, active) { buttons.forEach(button=>button.setAttribute('aria-pressed',String(button===active))) }

export function initBitmapExplorers(root=document) {
 root.querySelectorAll('[data-bitmap-locator]').forEach(host=>{
  if(host.dataset.bitmapReady)return
  host.dataset.bitmapReady='true'
  const cells=[...host.querySelectorAll('[data-pixel]')]
  cells.forEach((button,index)=>button.addEventListener('click',()=>{
   setPressed(cells,button)
   setText(host,'[data-position]',`Row ${Math.floor(index/8)+1}, column ${index%8+1}: ${MONO_ARROW[index]?'black':'white'}. One of 32 pixels.`)
  }))
 })
 root.querySelectorAll('[data-vector-zoom]').forEach(host=>{
  if(host.dataset.bitmapReady)return
  host.dataset.bitmapReady='true'
  const buttons=[...host.querySelectorAll('[data-zoom]')]
  function render(scale) {
   host.querySelectorAll('[data-scaled-badge]').forEach(image=>image.style.width=`${24*scale}px`)
   setPressed(buttons,buttons.find(button=>Number(button.dataset.zoom)===scale))
   setText(host,'[data-zoom-status]',`×${scale} view. Raster: 24 × 24 stored pixels. Vector: 3 stored shapes.`)
  }
  buttons.forEach(button=>button.addEventListener('click',()=>render(Number(button.dataset.zoom))))
  render(8)
 })
}
