function tri (ctx) {
  ctx.moveTo(-3, 0)
  ctx.lineTo(3, 0)
  ctx.moveTo(1, 2)
  ctx.lineTo(3, 0)
  ctx.lineJoin = 'miter'
  ctx.miterLimit = 10
  ctx.lineTo(1, -2)
}
function tri2 (ctx) {
  ctx.moveTo(-3, 0)
  ctx.lineTo(3, 0)
  ctx.moveTo(1, -4)
  ctx.lineTo(3, 0)
  ctx.lineJoin = 'miter'
  ctx.miterLimit = 10
  ctx.lineTo(1, 4)
}

export function clear (w, h, ctx) {
  ctx.clearRect(0, 0, 2 * w, 2 * h)
}

export function Render (w, h, arrayR, arrayTheta, ctx, dark) {
  ctx.lineWidth = 1
  const frequency = 14
  for (let i = 0; i < w; i += frequency) {
    for (let j = 0; j < h; j += frequency) {
      let scale = arrayR[j][i] / 2000000
      if (scale > 6) { scale = 6 }
      ctx.beginPath()
      const color = Math.floor(scale * 43)
      if (dark === true) {
        ctx.strokeStyle = `rgb(${color}, ${300 - color}, 255)`
      } else {
        ctx.strokeStyle = `rgb(${color}, 20, ${300 - color})`
      }
      ctx.save()
      ctx.translate(2 * i, 2 * (h - j))
      ctx.rotate(Math.PI - arrayTheta[j][i])
      ctx.scale(scale, 1)
      tri(ctx)
      ctx.restore()
      ctx.stroke()
    }
  }
}

export function RenderCircle (h, c, ctx, dark) {
  for (let i = 0; i < c.l; i++) {
    if (c.q[i] > 0) {
      if (dark === true) {
        ctx.fillStyle = '#EE4266'
      } else {
        ctx.fillStyle = '#DC493A'
      }
    } else {
      if (dark === true) {
        ctx.fillStyle = '#5CC8FF'
      } else {
        ctx.fillStyle = '#4392F1'
      }
    }
    ctx.beginPath()
    ctx.arc(2 * c.x[i], 2 * (h - c.y[i]), 22 * (1 + Math.abs(c.q[i])), 0, 2 * Math.PI, false)
    ctx.fill()
  }
}

export function RenderForce (h, c, ctx) {
  ctx.lineWidth = 3
  // ctx.strokeStyle = '#FF8A00'
  for (let i = 0; i < c.l; i++) {
    let scale = c.fr[i] / 100000
    if (scale > 20) { scale = 20 }
    ctx.beginPath()
    const color = Math.floor(scale * 13)
    const color2 = Math.floor(scale * 3)
    ctx.strokeStyle = `rgb(${color}, ${256 - color2}, 20)`
    ctx.save()
    ctx.translate(2 * c.x[i], 2 * (h - c.y[i]))
    ctx.rotate(Math.PI - c.ftheta[i])
    ctx.scale(scale, 1)
    tri2(ctx)
    ctx.restore()
    ctx.stroke()
  }
}
