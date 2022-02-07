export class Charge {
  constructor () {
    this.x = []
    this.y = []
    this.vx = []
    this.vy = []
    this.fx = []
    this.fy = []
    this.fr = []
    this.ftheta = []
    this.q = []
    this.r = []
    this.fix = []
    this.move = []
    this.l = 0
  }

  setCharge (array) {
    this.x.push(array[0])
    this.y.push(array[1])
    this.vx.push(0)
    this.vy.push(0)
    this.fx.push(0)
    this.fy.push(0)
    this.q.push(array[2])
    this.r.push(11 * (1 + Math.abs(array[2])))
    this.fix.push(false)
    this.move.push(false)
    this.l++
    return this
  }

  deleteCharge (pointX, pointY) {
    const x = this.x
    const y = this.y
    const r = this.r
    for (let i = 0; i < this.l; i++) {
      if (pointX >= x[i] - r[i] && pointX <= x[i] + r[i] && pointY >= y[i] - r[i] && pointY <= y[i] + r[i]) {
        this.x.splice(i, 1)
        this.y.splice(i, 1)
        this.vx.splice(i, 1)
        this.vy.splice(i, 1)
        this.fx.splice(i, 1)
        this.fy.splice(i, 1)
        this.q.splice(i, 1)
        this.r.splice(i, 1)
        this.fix.splice(i, 1)
        this.move.splice(i, 1)
        this.l--
        return this
      }
    }
  }

  fixCharge (pointX, pointY) {
    const x = this.x
    const y = this.y
    const r = this.r
    for (let i = 0; i < this.l; i++) {
      if (pointX >= x[i] - r[i] && pointX <= x[i] + r[i] && pointY >= y[i] - r[i] && pointY <= y[i] + r[i]) {
        this.fix[i] = !this.fix[i]
        return this
      }
    }
  }

  moveBeginCharge (pointX, pointY) {
    const x = this.x
    const y = this.y
    const r = this.r
    for (let i = 0; i < this.l; i++) {
      if (pointX >= x[i] - r[i] && pointX <= x[i] + r[i] && pointY >= y[i] - r[i] && pointY <= y[i] + r[i]) {
        this.move[i] = true
      }
    }
    return this
  }

  moveEndCharge () {
    this.move = this.move.map(() => false)
    return this
  }

  calcCoulombForce (electricFieldX, electricFieldY) {
    const q = this.q
    const x = this.x
    const y = this.y
    for (let i = 0; i < this.l; i++) {
      this.fx[i] = q[i] * electricFieldX[y[i]][x[i]]
      this.fy[i] = q[i] * electricFieldY[y[i]][x[i]]
      const fx = this.fx[i]
      const fy = this.fy[i]
      this.fr[i] = Math.hypot(fx, fy)
      // this.fr[i] = Math.sqrt(fx * fx + fy * fy)
      this.ftheta[i] = Math.atan2(fy, fx)
    }
    return this
  }

  calcPositions (w, h, pointX, pointY) {
    const x = this.x
    const y = this.y
    const vx = this.vx
    const vy = this.vy
    const fx = this.fx
    const fy = this.fy
    const r = this.r
    const fix = this.fix
    const move = this.move
    const l = this.l
    const CoefficientOfRestitution = 0.2
    for (let i = 0; i < l; i++) {
      const t = 1 / 10000
      const m1 = r[i] / 1000

      if (fix[i] === false) {
        vx[i] = vx[i] - fx[i] / m1 * t
        x[i] = x[i] + Math.trunc(vx[i] * t + fx[i] / m1 * t * t / 2)
        vy[i] = vy[i] - fy[i] / m1 * t
        y[i] = y[i] + Math.trunc(vy[i] * t + fy[i] / m1 * t * t / 2)
      }

      for (let j = i + 1; j < l; j++) {
        let dx = x[i] - x[j]
        let dy = y[i] - y[j]
        const m2 = r[j] / 1000
        const d = Math.hypot(dx, dy)
        const l = r[i] + r[j]
        let z = l - d
        if (d > 0 && d <= l) {
          dx /= d
          dy /= d
          z /= 2
          if (fix[i] === false) {
            x[i] += Math.round(dx * z)
            y[i] += Math.round(dy * z)
          }
          if (fix[j] === false) {
            x[j] -= Math.round(dx * z)
            y[j] -= Math.round(dy * z)
          }
          // vx[i] = vx[j] * CoefficientOfRestitution + (vx[j] = vx[i] * CoefficientOfRestitution, 0)
          // vy[i] = vy[j] * CoefficientOfRestitution + (vy[j] = vy[i] * CoefficientOfRestitution, 0)
          const vx1 = vx[i]
          const vx2 = vx[j]
          const vy1 = vy[i]
          const vy2 = vy[j]
          if (fix[i] === false) {
            vx[i] = (CoefficientOfRestitution * m2 * (vx2 - vx1) + m1 * vx1 + m2 * vx2) / (m1 + m2)
            vy[i] = (CoefficientOfRestitution * m2 * (vy2 - vy1) + m1 * vy1 + m2 * vy2) / (m1 + m2)
          }
          if (fix[j] === false) {
            vx[j] = (CoefficientOfRestitution * m1 * (vx1 - vx2) + m1 * vx1 + m2 * vx2) / (m1 + m2)
            vy[j] = (CoefficientOfRestitution * m1 * (vy1 - vy2) + m1 * vy1 + m2 * vy2) / (m1 + m2)
          }
        }
      }

      if (move[i] === true) {
        vx[i] = 0
        x[i] = pointX
        vy[i] = 0
        y[i] = pointY
      }

      if (x[i] >= w - 1) {
        vx[i] = -CoefficientOfRestitution * vx[i]
        x[i] = w - 2
      } else if (x[i] <= 0) {
        vx[i] = -CoefficientOfRestitution * vx[i]
        x[i] = 1
      }
      if (y[i] >= h - 1) {
        vy[i] = -CoefficientOfRestitution * vy[i]
        y[i] = h - 2
      } else if (y[i] <= 0) {
        vy[i] = -CoefficientOfRestitution * vy[i]
        y[i] = 1
      }
    }
    return this
  }
};
