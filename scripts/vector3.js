class Vector3 {
  constructor (x, y, z) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
  }
  dot (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
  // https://rosettacode.org/wiki/Vector_products
  cross (v) {
    return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
  }
  plus (v) {
    if (v instanceof Vector3) return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
    return new Vector3(this.x + v, this.y + v, this.z + v)
  }
  // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
  angleAxis (angle, axis) {
    const v = this
    const k = axis
    const theta = angle * Math.PI / 180
    const first = v.scaledBy(Math.cos(theta))
    const second = (k.cross(v)).scaledBy(Math.sin(theta))
    const third = k.scaledBy(k.dot(v)).scaledBy(1 - Math.cos(theta))
    return first.plus(second).plus(third)
  }
  minus (v) {
    if (v instanceof Vector3) return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
    return new Vector3(this.x - v, this.y - v, this.z - v)
  }
  scaledBy (v) {
    if (v instanceof Vector3) return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
    return new Vector3(this.x * v, this.y * v, this.z * v)
  }
  scale (v) {
    if (v instanceof Vector3) {
      this.x *= v.x; this.y *= v.y; this.z *= v.z
    } else {
      this.x *= v; this.y *= v; this.z *= v
    }
    return this
  }
  dividedBy (v) {
    if (v instanceof Vector3) return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z)
    return new Vector3(this.x / v, this.y / v, this.z / v)
  }
  reflected (normal) {
    const cos = normal.dot(this)
    return this.minus(normal.scaledBy(2 * cos)).normalized  // TODO: normalized necessary?
  }
  // http://asawicki.info/news_1301_reflect_and_refract_functions.html
  refracted (normal, exteriorIndex, interiorIndex) {
    const ratio = exteriorIndex / interiorIndex
    const nDotI = normal.dot(this)
    const k = 1 - ratio * ratio * (1 - nDotI * nDotI)
    if (k < 0) return null  // total internal reflection
    const offset = normal.scaledBy(ratio * nDotI + Math.sqrt(k))
    return this.scaledBy(ratio).minus(offset).normalized  // TODO: normalized necessary?
  }
  add (v) {
    this.x += v.x; this.y += v.y; this.z += v.z
    return this
  }
  floor (n) {
    return new Vector3(this.x < n ? n : this.x, this.y < n ? n : this.y, this.z < n ? n : this.z)
  }
  lerp (v, n) {
    const m = 1 - n
    return new Vector3(this.x * m + v.x * n, this.y * m + v.y * n, this.z * m + v.z * n)
  }
  // https://math.stackexchange.com/questions/1461038/how-exactly-does-the-sign-of-the-dot-product-determine-the-angle-between-two-vec
  enters (normal) {
    return normal.dot(this) < 0
  }
  get length () {
    return Math.sqrt(this.dot(this))
  }
  get array () {
    return [this.x, this.y, this.z]
  }
  get normalized () {
    return this.dividedBy(this.length)
  }
  get randomInHemisphere () {
    const rand = Vector3.randomInSphere
    return this.dot(rand) > 0 ? rand : rand.scaledBy(-1)
  }
  // http://www.rorydriscoll.com/2009/01/07/better-sampling/
  // https://cseweb.ucsd.edu/classes/sp17/cse168-a/CSE168_08_PathTracing.pdf
  // https://github.com/fogleman/pt/blob/69e74a07b0af72f1601c64120a866d9a5f432e2f/pt/ray.go#L28
  get randomInCosHemisphere () {
    const u = Math.random()
    const v = Math.random()
    const r = Math.sqrt(u)
    const theta = 2 * Math.PI * v
    const s = this.cross(Vector3.randomInSphere).normalized
    const t = this.cross(s)
    const d = new Vector3()
    d.add(s.scaledBy(r * Math.cos(theta)))
    d.add(t.scaledBy(r * Math.sin(theta)))
    d.add(this.scaledBy(Math.sqrt(1 - u)))
    return d
  }
  // https://stackoverflow.com/questions/17083173/sampling-a-hemisphere-using-an-arbitary-distribtuion
  // https://computergraphics.stackexchange.com/questions/2431/role-of-pdf-of-uniform-random-sampling-in-a-path-tracer
  randomInCone (theta) {
    const X1 = Math.random()
    const X2 = Math.random()
    const phi = 2 * Math.PI * X1
    const alpha = Math.acos(1 - (1 - Math.cos(theta)) * X2)
    const x = Math.sin(alpha) * Math.cos(phi)
    const y = Math.sin(alpha) * sin * phi
    const z = -Math.cos(alpha)
    return new Vector3(x, y, z)
  }
  get max () {
    return Math.max(this.x, this.y, this.z)
  }
  get min () {
    return Math.min(this.x, this.y, this.z)
  }
  static fromAngles (theta, phi) {
    return new Vector3(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi))
  }
  static get randomInSphere () {
    return Vector3.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1))
  }
}
