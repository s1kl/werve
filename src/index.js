import { GPU } from 'gpu.js'
import './index.scss'
import { Charge } from './models/charge.js'
import { ElectricField } from './models/electric-field.js'
import { clear, Render, RenderCircle, RenderForce } from './models/render.js'

const canvas = document.getElementById('canvas')
const canvas2 = document.getElementById('canvas2')
const ctx = canvas2.getContext('2d')
const gpu = new GPU()
const gpuCanvas = new GPU({ canvas: canvas })
const width = 300
const height = 300
canvas.width = width
canvas.height = height
canvas2.width = 2 * width
canvas2.height = 2 * height

let dark = false
let radio = 'install'
const time = document.getElementById('time')
const render1 = document.getElementById('norm')
const render2 = document.getElementById('vector')
const render5 = document.getElementById('force')
const inputElem = document.getElementById('range')
const currentValueElem = document.getElementById('range-label')
let mouseX
let mouseY

const setCurrentValue = (val) => {
  currentValueElem.innerText = 'charge:' + val
}
const rangeOnChange = (e) => {
  setCurrentValue(e.target.value)
}
window.onload = () => {
  inputElem.addEventListener('input', rangeOnChange)
  setCurrentValue(inputElem.value)
}

document.getElementsByName('radio').forEach(
  r => r.addEventListener('change',
    e => (radio = e.target.value))
)

function canvasClick (a) {
  const rect = a.target.getBoundingClientRect()
  const viewX = a.clientX - rect.left
  const viewY = a.clientY - rect.top
  const scaleWidth = canvas.clientWidth / width
  const scaleHeight = canvas.clientHeight / height
  const canvasX = Math.floor(viewX / scaleWidth)
  const canvasY = Math.floor(viewY / scaleHeight)
  if (Number(inputElem.value) !== 0 && radio === 'install') {
    c.setCharge([canvasX, height - canvasY, Number(inputElem.value)])
  }
  if (radio === 'delete') {
    c.deleteCharge(canvasX, height - canvasY)
  }
  if (radio === 'fix') {
    c.fixCharge(canvasX, height - canvasY)
  }
}
canvas2.addEventListener('click', canvasClick, false)

function canvasMousedown (a) {
  const rect = a.target.getBoundingClientRect()
  const viewX = a.clientX - rect.left
  const viewY = a.clientY - rect.top
  const scaleWidth = canvas.clientWidth / width
  const scaleHeight = canvas.clientHeight / height
  const canvasX = Math.floor(viewX / scaleWidth)
  const canvasY = Math.floor(viewY / scaleHeight)
  mouseX = canvasX
  mouseY = canvasY
  if (Number(inputElem.value) !== 0 && radio === 'move') {
    c.moveBeginCharge(canvasX, height - canvasY)
  }
}
function canvasMouseup () {
  c.moveEndCharge()
}
function canvasMousemove (a) {
  if (Number(inputElem.value) !== 0 && radio === 'move' && c.move.includes(true) === true) {
    const rect = a.target.getBoundingClientRect()
    const viewX = a.clientX - rect.left
    const viewY = a.clientY - rect.top
    const scaleWidth = canvas.clientWidth / width
    const scaleHeight = canvas.clientHeight / height
    const canvasX = Math.floor(viewX / scaleWidth)
    const canvasY = Math.floor(viewY / scaleHeight)
    mouseX = canvasX
    mouseY = canvasY
  }
}

function canvasTouchstart (a) {
  const touch = a.changedTouches[0]
  const rect = touch.target.getBoundingClientRect()
  const viewX = touch.clientX - rect.left
  const viewY = touch.clientY - rect.top
  const scaleWidth = canvas.clientWidth / width
  const scaleHeight = canvas.clientHeight / height
  const canvasX = Math.floor(viewX / scaleWidth)
  const canvasY = Math.floor(viewY / scaleHeight)
  mouseX = canvasX
  mouseY = canvasY
  if (Number(inputElem.value) !== 0 && radio === 'move') {
    c.moveBeginCharge(canvasX, height - canvasY)
  }
}
function canvasTouchend () {
  c.moveEndCharge()
}
function canvasTouchmove (a) {
  // a.preventDefault()
  if (Number(inputElem.value) !== 0 && radio === 'move' && c.move.includes(true) === true) {
    const touch = a.changedTouches[0]
    const rect = touch.target.getBoundingClientRect()
    const viewX = touch.clientX - rect.left
    const viewY = touch.clientY - rect.top
    const scaleWidth = canvas.clientWidth / width
    const scaleHeight = canvas.clientHeight / height
    const canvasX = Math.floor(viewX / scaleWidth)
    const canvasY = Math.floor(viewY / scaleHeight)
    mouseX = canvasX
    mouseY = canvasY
  }
}

canvas2.addEventListener('touchmove', function (a) {
  a.preventDefault()
}, { passive: false })

canvas2.addEventListener('touchstart', canvasTouchstart, false)
canvas2.addEventListener('touchmove', canvasTouchmove, false)
document.addEventListener('touchend', canvasTouchend, false)
canvas2.addEventListener('mousedown', canvasMousedown, false)
canvas2.addEventListener('mousemove', canvasMousemove, false)
document.addEventListener('mouseup', canvasMouseup, false)

function simulate () {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
    dark = true
  } else {
    dark = false
  }
  if (c.l === 0) {
    e.render0Kernel(kernelRender0, dark)
    clear(width, height, ctx)
    requestAnimationFrame(simulate)
  } else {
    e.superposeElectricFieldKernel(kernelSuperposeElectricFieldFirst, kernelSuperposeElectricField, c)
    e.convertPolarElectricFieldKernel(kernelconvertPolarElectricFieldR, kernelconvertPolarElectricFieldTheta)
    if (time.checked) {
      c.calcCoulombForce(e.electric_field_x, e.electric_field_y)
    }

    if (render1.checked) {
      e.renderRKernel(kernelRenderR, dark)
    } else {
      e.render0Kernel(kernelRender0, dark)
    }

    if (render2.checked) {
      clear(width, height, ctx)
      Render(width, height, e.electric_field_r, e.electric_field_theta, ctx, dark)
      RenderCircle(height, c, ctx, dark)
      if (render5.checked) {
        RenderForce(height, c, ctx)
      }
    } else if (render5.checked) {
      clear(width, height, ctx)
      RenderCircle(height, c, ctx, dark)
      RenderForce(height, c, ctx)
    } else {
      clear(width, height, ctx)
    }

    if (time.checked) {
      c.calcPositions(width, height, mouseX, height - mouseY)
    }

    requestAnimationFrame(simulate)
  }
}

const e = new ElectricField(width, height)
e.calcElectricFieldTemplate(gpu)

const c = new Charge()

const kernelSuperposeElectricFieldFirst = gpu.createKernel(e.superposeElectricFieldFirstGpu).setConstants({ w: width, h: height }).setOutput([height, width])
const kernelSuperposeElectricField = gpu.createKernel(e.superposeElectricFieldGpu).setConstants({ w: width, h: height }).setOutput([height, width])
const kernelconvertPolarElectricFieldR = gpu.createKernel(e.convertPolarElectricFieldGpuR).setOutput([height, width])
const kernelconvertPolarElectricFieldTheta = gpu.createKernel(e.convertPolarElectricFieldGpuTheta).setOutput([height, width])

const kernelRenderR = gpuCanvas.createKernel(e.renderRGpu).setOutput([height, width]).setGraphical(true)
const kernelRender0 = gpuCanvas.createKernel(e.render0Gpu).setOutput([height, width]).setGraphical(true)

simulate()
